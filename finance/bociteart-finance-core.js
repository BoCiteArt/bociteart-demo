/* =========================================================
   ÇA COMMENCE ICI — BO'CITÉART — FINANCE — CŒUR COMMUN

   Fichier public : finance/bociteart-finance-core.js

   Ce fichier orchestre uniquement le parcours côté application.
   Aucun secret, IBAN complet, numéro de carte, calcul comptable
   définitif, webhook PSP ou document légal n'est traité ici.
   Ces opérations appartiennent au serveur privé Bo'CitéArt.
   ========================================================= */

(function(){
  "use strict";

  if(
    window.BociteFinance &&
    window.BociteFinance.ready === true
  ){
    return;
  }

  const VERSION = "2026-09-03-01";
  const STORAGE_KEY = "bociteart_finance_drafts_v1";
  const connectors = Object.create(null);
  const listeners = Object.create(null);

  let config = {
    mode: "preproduction",
    apiBaseUrl: "",
    paymentWatchIntervalMs: 2500,
    paymentWatchTimeoutMs: 180000
  };

  function financeClone(value){
    return value == null
      ? value
      : JSON.parse(JSON.stringify(value));
  }

  function financeText(value){
    return String(value == null ? "" : value).trim();
  }

  function financeNow(){
    return new Date().toISOString();
  }

  function financeId(prefix){
    const head = financeText(prefix) || "finance";

    if(
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ){
      return head + "-" + window.crypto.randomUUID();
    }

    return head + "-" + Date.now() + "-" +
      Math.random().toString(36).slice(2, 12);
  }

  function financeReadDrafts(){
    try{
      const parsed = JSON.parse(
        window.sessionStorage.getItem(STORAGE_KEY) || "{}"
      );

      return parsed && typeof parsed === "object"
        ? parsed
        : {};
    }catch(error){
      return {};
    }
  }

  function financeWriteDrafts(drafts){
    try{
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(drafts || {})
      );
      return true;
    }catch(error){
      return false;
    }
  }

  function financeEmit(eventName, detail){
    const name = financeText(eventName);
    const callbacks = (listeners[name] || []).slice();

    callbacks.forEach(function(callback){
      try{
        callback(financeClone(detail));
      }catch(error){
        window.setTimeout(function(){ throw error; }, 0);
      }
    });

    try{
      window.dispatchEvent(
        new CustomEvent("bociteart:finance:" + name, {
          detail: financeClone(detail)
        })
      );
    }catch(error){
      /* Compatibilité avec les anciens navigateurs. */
    }
  }

  function financeOn(eventName, callback){
    const name = financeText(eventName);

    if(!name || typeof callback !== "function"){
      return function(){};
    }

    listeners[name] = listeners[name] || [];
    listeners[name].push(callback);

    return function(){
      listeners[name] = (listeners[name] || []).filter(
        function(item){ return item !== callback; }
      );
    };
  }

    function financeConfigure(nextConfig){
    const incoming = nextConfig && typeof nextConfig === "object"
      ? nextConfig
      : {};

    config = Object.assign({}, config, incoming);
    return financeClone(config);
  }

  function financeRegisterConnector(name, connector){
    const connectorName = financeText(name);

    if(!connectorName){
      throw new Error("Nom de raccord Finance manquant.");
    }

    if(!connector || typeof connector !== "object"){
      throw new Error("Raccord Finance invalide : " + connectorName);
    }

    connectors[connectorName] = connector;
    financeEmit("connector-ready", { name: connectorName });
    return true;
  }

  function financeConnector(name){
    return connectors[financeText(name)] || null;
  }

  function financeCreateDraft(input){
    const source = input && typeof input === "object" ? input : {};
    const draftId = financeText(source.draftId) || financeId("draft");
    const drafts = financeReadDrafts();
    const previous = drafts[draftId] || {};

    const draft = Object.assign({}, previous, financeClone(source), {
      draftId: draftId,
      status: "draft",
      createdAt: previous.createdAt || financeNow(),
      updatedAt: financeNow(),
      confirmedAt: null,
      paymentReference: null
    });

    drafts[draftId] = draft;
    financeWriteDrafts(drafts);
    financeEmit("draft-saved", draft);

    return financeClone(draft);
  }

  function financeUpdateDraft(draftId, changes){
    const id = financeText(draftId);
    const drafts = financeReadDrafts();
    const previous = drafts[id];

    if(!id || !previous){
      throw new Error("Brouillon Finance introuvable.");
    }

    if(previous.status !== "draft"){
      throw new Error("Cette opération n'est plus modifiable.");
    }

    const draft = Object.assign(
      {},
      previous,
      financeClone(changes || {}),
      {
        draftId: id,
        status: "draft",
        updatedAt: financeNow(),
        confirmedAt: null
      }
    );

    drafts[id] = draft;
    financeWriteDrafts(drafts);
    financeEmit("draft-saved", draft);

    return financeClone(draft);
  }

  function financeGetDraft(draftId){
    return financeClone(
      financeReadDrafts()[financeText(draftId)] || null
    );
  }

  function financeDeleteDraft(draftId){
    const id = financeText(draftId);
    const drafts = financeReadDrafts();

    if(!drafts[id]){
      return false;
    }

    if(drafts[id].status !== "draft"){
      throw new Error("Une opération confirmée ne peut pas être supprimée.");
    }

    delete drafts[id];
    financeWriteDrafts(drafts);
    financeEmit("draft-deleted", { draftId: id });
    return true;
  }

    function financeValidateDraft(draft){
    const value = draft && typeof draft === "object" ? draft : {};
    const errors = [];

    if(!financeText(value.flowType)){
      errors.push("Type d'opération manquant.");
    }

    if(!financeText(value.payerRef)){
      errors.push("Payeur non identifié.");
    }

    if(!financeText(value.identityVersion)){
      errors.push("Version de la fiche d'identité manquante.");
    }

    if(!financeText(value.previewText)){
      errors.push("Aperçu final manquant.");
    }

    if(
      !Number.isFinite(Number(value.amountHT)) ||
      Number(value.amountHT) <= 0
    ){
      errors.push("Montant HT invalide.");
    }

    if(value.confirmedByPayer !== true){
      errors.push("La vérification finale n'a pas été confirmée.");
    }

    return {
      ok: errors.length === 0,
      errors: errors
    };
  }

  function financeFreezeDraft(draftId){
    const id = financeText(draftId);
    const drafts = financeReadDrafts();
    const previous = drafts[id];

    if(!previous){
      throw new Error("Brouillon Finance introuvable.");
    }

    const validation = financeValidateDraft(previous);

    if(!validation.ok){
      const error = new Error(validation.errors.join(" "));
      error.validationErrors = validation.errors.slice();
      throw error;
    }

    const frozen = Object.assign({}, previous, {
      status: "confirmed",
      confirmedAt: financeNow(),
      updatedAt: financeNow()
    });

    drafts[id] = frozen;
    financeWriteDrafts(drafts);
    financeEmit("draft-confirmed", frozen);

    return financeClone(frozen);
  }

  async function financeStartCheckout(draftId){
    const frozen = financeFreezeDraft(draftId);
    const connector = financeConnector(frozen.connectorName);

    if(!connector || typeof connector.startCheckout !== "function"){
      throw new Error("Service de paiement non raccordé.");
    }

    const request = {
      draftId: frozen.draftId,
      idempotencyKey: frozen.idempotencyKey || financeId("payment"),
      flowType: frozen.flowType,
      payerRef: frozen.payerRef,
      beneficiaryRefs: financeClone(frozen.beneficiaryRefs || []),
      identityVersion: frozen.identityVersion,
      amountHT: Number(frozen.amountHT),
      allocationCode: financeText(frozen.allocationCode),
      previewText: frozen.previewText,
      returnUrl: window.location.href
    };

    const response = await connector.startCheckout(financeClone(request));

    if(
      !response ||
      response.ok !== true ||
      !financeText(response.paymentReference)
    ){
      throw new Error("Le paiement sécurisé n'a pas pu être préparé.");
    }

    const drafts = financeReadDrafts();
    const current = drafts[frozen.draftId] || frozen;
    const updated = Object.assign({}, current, {
      status: "payment_pending",
      idempotencyKey: request.idempotencyKey,
      paymentReference: financeText(response.paymentReference),
      updatedAt: financeNow()
    });

    drafts[frozen.draftId] = updated;
    financeWriteDrafts(drafts);
    financeEmit("payment-pending", updated);

    return Object.assign({}, financeClone(response), {
      draft: financeClone(updated)
    });
  }

    function financeApplyServerStatus(draftId, serverStatus){
    const id = financeText(draftId);
    const allowed = [
      "payment_pending",
      "paid",
      "refused",
      "cancelled",
      "refunded",
      "disputed"
    ];
    const status = financeText(serverStatus && serverStatus.status);
    const drafts = financeReadDrafts();
    const previous = drafts[id];

    if(!previous){
      throw new Error("Opération Finance introuvable.");
    }

    if(allowed.indexOf(status) === -1){
      throw new Error("État de paiement refusé.");
    }

    const updated = Object.assign({}, previous, {
      status: status,
      updatedAt: financeNow(),
      serverReference: financeText(
        serverStatus && serverStatus.serverReference
      ) || previous.serverReference || ""
    });

    if(status === "paid"){
      updated.paidAt = financeText(serverStatus.paidAt) || financeNow();
    }

    drafts[id] = updated;
    financeWriteDrafts(drafts);
    financeEmit("payment-" + status, updated);

    return financeClone(updated);
  }

  function financeStatusLabel(status){
    const labels = {
      draft: "À vérifier",
      confirmed: "Confirmé avant paiement",
      payment_pending: "Paiement en cours",
      paid: "Paiement confirmé",
      refused: "Paiement refusé",
      cancelled: "Paiement annulé",
      refunded: "Paiement remboursé",
      disputed: "Paiement contesté"
    };

    return labels[financeText(status)] || "État inconnu";
  }

  window.BociteFinance = {
    version: VERSION,
    ready: true,
    configure: financeConfigure,
    getConfig: function(){ return financeClone(config); },
    registerConnector: financeRegisterConnector,
    getConnector: financeConnector,
    on: financeOn,
    emit: financeEmit,
    createDraft: financeCreateDraft,
    updateDraft: financeUpdateDraft,
    getDraft: financeGetDraft,
    deleteDraft: financeDeleteDraft,
    validateDraft: financeValidateDraft,
    freezeDraft: financeFreezeDraft,
    startCheckout: financeStartCheckout,
    applyServerStatus: financeApplyServerStatus,
    statusLabel: financeStatusLabel
  };

  financeEmit("core-ready", {
    version: VERSION,
    mode: config.mode
  });

  console.info("✅ Bo'CitéArt Finance — cœur commun chargé");

})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART — FINANCE — CŒUR COMMUN
   ========================================================= */
