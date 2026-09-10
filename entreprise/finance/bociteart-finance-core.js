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

/* Un seul lancement de paiement simultané par dossier. */
const checkoutInFlight = Object.create(null);

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

 /* =========================================================
   ÇA COMMENCE ICI — MODIFICATION SÉCURISÉE DU BROUILLON
   ========================================================= */

function financeUpdateDraft(draftId, changes){

  const id =
    financeText(
      draftId
    );

  const drafts =
    financeReadDrafts();

  const previous =
    drafts[id];

  if(
    !id ||
    !previous
  ){
    throw new Error(
      "Brouillon Finance introuvable."
    );
  }

  if(
    previous.status !==
      "draft"
  ){
    throw new Error(
      "Cette opération n'est plus modifiable."
    );
  }

  const draft =
    Object.assign(
      {},
      previous,
      financeClone(
        changes ||
        {}
      ),
      {
        draftId:
          id,

        status:
          "draft",

        updatedAt:
          financeNow(),

        confirmedAt:
          null,

        /*
          Toute modification du brouillon
          invalide une ancienne préparation
          de paiement.
        */

        idempotencyKey:
          null,

        paymentReference:
          null,

        serverReference:
          null,

        paidAt:
          null
      }
    );

  drafts[id] =
    draft;

  financeWriteDrafts(
    drafts
  );

  financeEmit(
    "draft-saved",
    draft
  );

  return financeClone(
    draft
  );
}

/* =========================================================
   ÇA FINIT ICI — MODIFICATION SÉCURISÉE DU BROUILLON
   ========================================================= */
   
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

  /* =========================================================
   ÇA COMMENCE ICI — DÉMARRAGE PAIEMENT SÉCURISÉ
   ========================================================= */

  async function financeStartCheckoutRun(draftId){

  const id =
    financeText(
      draftId
    );

  let drafts =
    financeReadDrafts();

  let current =
    drafts[id];

  if(
    !id ||
    !current
  ){
    throw new Error(
      "Brouillon Finance introuvable."
    );
  }

  /*
    Un paiement déjà en cours
    ne doit jamais être démarré
    une seconde fois.
  */

  if(
    current.status ===
      "payment_pending" &&
    financeText(
      current.paymentReference
    )
  ){
    return {

      ok:
        true,

      paymentReference:
        financeText(
          current.paymentReference
        ),

      checkoutUrl:
        financeText(
          current.checkoutUrl
        ),

      alreadyPending:
        true,

      draft:
        financeClone(
          current
        )
    };
  }

  /*
    Ces états ne peuvent pas
    redémarrer un nouveau paiement
    sur le même dossier.
  */

  if(
    [
      "paid",
      "refused",
      "cancelled",
      "refunded",
      "disputed"
    ]
      .includes(
        financeText(
          current.status
        )
      )
  ){
    throw new Error(
      "Cette opération de paiement est déjà terminée."
    );
  }

  /*
    Premier passage :
    le brouillon est figé.

    Après une réponse réseau incertaine,
    le même dossier peut être repris
    sans créer une nouvelle opération.
  */

  if(
    current.status ===
      "draft"
  ){

    current =
      financeFreezeDraft(
        id
      );

  }else if(
    current.status ===
      "confirmed" ||
    current.status ===
      "checkout_uncertain"
  ){

    const validation =
      financeValidateDraft(
        current
      );

    if(
      !validation.ok
    ){

      const error =
        new Error(
          validation.errors.join(
            " "
          )
        );

      error.validationErrors =
        validation.errors.slice();

      throw error;
    }

  }else{

    throw new Error(
      "L’état actuel de cette opération ne permet pas de lancer le paiement."
    );
  }

  const connector =
    financeConnector(
      current.connectorName
    );

  if(
    !connector ||
    typeof connector.startCheckout !==
      "function"
  ){
    throw new Error(
      "Service de paiement non raccordé."
    );
  }

  /*
    CRITIQUE :

    La clé d’idempotence est créée
    et enregistrée AVANT tout appel
    au système de paiement.

    En cas de coupure réseau,
    la prochaine tentative reprend
    exactement la même clé.
  */

  const idempotencyKey =
    financeText(
      current.idempotencyKey
    ) ||
    financeId(
      "payment"
    );

  drafts =
    financeReadDrafts();

  current =
    Object.assign(
      {},
      drafts[id] ||
      current,
      {
        idempotencyKey:
          idempotencyKey,

        updatedAt:
          financeNow()
      }
    );

  drafts[id] =
    current;

  financeWriteDrafts(
    drafts
  );

  const request = {

    draftId:
      current.draftId,

    idempotencyKey:
      idempotencyKey,

    flowType:
      current.flowType,

    payerRef:
      current.payerRef,

    representativeRef:
      financeText(
        current.representativeRef
      ),

    representative:
      financeClone(
        current.representative ||
        {}
      ),

    presentedAt:
      financeText(
        current.presentedAt
      ),

    beneficiaryRefs:
      financeClone(
        current.beneficiaryRefs ||
        []
      ),

    identityVersion:
      current.identityVersion,

    amountHT:
      Number(
        current.amountHT
      ),

    allocationCode:
      financeText(
        current.allocationCode
      ),

    previewText:
      current.previewText,

    returnUrl:
      window.location.href
  };

  let response;

  try{

    response =
      await connector.startCheckout(
        financeClone(
          request
        )
      );

  }catch(error){

    drafts =
      financeReadDrafts();

    const previous =
      drafts[id] ||
      current;

    const productionMode =
      financeText(
        config.mode
      )
        .toLowerCase() ===
      "production";

    /*
      En production,
      une coupure réseau ne signifie
      jamais que le PSP n'a pas reçu
      la demande.

      La clé de paiement est conservée.
    */

    if(
      productionMode
    ){

      drafts[id] =
        Object.assign(
          {},
          previous,
          {
            status:
              "checkout_uncertain",

            idempotencyKey:
              idempotencyKey,

            updatedAt:
              financeNow()
          }
        );

    }else{

      /*
        En préproduction,
        aucun argent réel n'est engagé.

        On revient au brouillon.
      */

      drafts[id] =
        Object.assign(
          {},
          previous,
          {
            status:
              "draft",

            confirmedAt:
              null,

            idempotencyKey:
              null,

            paymentReference:
              null,

            updatedAt:
              financeNow()
          }
        );
    }

    financeWriteDrafts(
      drafts
    );

    throw error;
  }

  if(
    !response ||
    response.ok !== true ||
    !financeText(
      response.paymentReference
    )
  ){
    throw new Error(
      "Le paiement sécurisé n'a pas pu être préparé."
    );
  }

  const paymentReference =
    financeText(
      response.paymentReference
    );

  drafts =
    financeReadDrafts();

  current =
    drafts[id] ||
    current;

  /*
    Si un retour serveur est arrivé
    très rapidement pendant
    la préparation du paiement,
    on ne revient jamais en arrière.
  */

  if(
    [
      "paid",
      "refused",
      "cancelled",
      "refunded",
      "disputed"
    ]
      .includes(
        financeText(
          current.status
        )
      )
  ){

    if(
      financeText(
        current.paymentReference
      ) &&
      financeText(
        current.paymentReference
      ) !==
      paymentReference
    ){
      throw new Error(
        "Incohérence de référence de paiement."
      );
    }

    return Object.assign(
      {},
      financeClone(
        response
      ),
      {
        draft:
          financeClone(
            current
          )
      }
    );
  }

  /*
    Une même clé de sécurité
    doit toujours correspondre
    à une seule référence de paiement.
  */

  if(
    financeText(
      current.paymentReference
    ) &&
    financeText(
      current.paymentReference
    ) !==
    paymentReference
  ){
    throw new Error(
      "Incohérence de référence de paiement."
    );
  }

  const updated =
    Object.assign(
      {},
      current,
      {
        status:
          "payment_pending",

        idempotencyKey:
          idempotencyKey,

        paymentReference:
          paymentReference,

        checkoutUrl:
          financeText(
            response.checkoutUrl
          ) ||
          financeText(
            current.checkoutUrl
          ),

        updatedAt:
          financeNow()
      }
    );

  drafts[id] =
    updated;

  financeWriteDrafts(
    drafts
  );

  financeEmit(
    "payment-pending",
    updated
  );

  return Object.assign(
    {},
    financeClone(
      response
    ),
    {
      draft:
        financeClone(
          updated
        )
    }
  );
}

   /* =========================================================
   ÇA COMMENCE ICI — VERROU ANTI DOUBLE-CLIC
   ========================================================= */

function financeStartCheckout(draftId){

  const id =
    financeText(
      draftId
    );

  if(
    !id
  ){
    return Promise.reject(
      new Error(
        "Brouillon Finance introuvable."
      )
    );
  }

  /*
    Si ce dossier est déjà en train
    de lancer son paiement,
    on reprend exactement
    la même opération en cours.
  */

  if(
    checkoutInFlight[id]
  ){
    return checkoutInFlight[id];
  }

  const operation =
    financeStartCheckoutRun(
      id
    );

  checkoutInFlight[id] =
    operation;

  operation.then(

    function(){

      if(
        checkoutInFlight[id] ===
        operation
      ){
        delete checkoutInFlight[id];
      }
    },

    function(){

      if(
        checkoutInFlight[id] ===
        operation
      ){
        delete checkoutInFlight[id];
      }
    }
  );

  return operation;
}

/* =========================================================
   ÇA FINIT ICI — VERROU ANTI DOUBLE-CLIC
   ========================================================= */

/* =========================================================
   ÇA FINIT ICI — DÉMARRAGE PAIEMENT SÉCURISÉ
   ========================================================= */
   
/* =========================================================
   ÇA COMMENCE ICI — CONTRÔLE DES ÉTATS DE PAIEMENT
   ========================================================= */

function financePaymentTransitionAllowed(
  previousStatus,
  nextStatus
){

  const previous =
    financeText(
      previousStatus
    );

  const next =
    financeText(
      nextStatus
    );

  if(
    previous ===
    next
  ){
    return true;
  }

  const transitions = {

    confirmed:[
      "payment_pending",
      "paid",
      "refused",
      "cancelled"
    ],

    checkout_uncertain:[
      "payment_pending",
      "paid",
      "refused",
      "cancelled"
    ],

    payment_pending:[
      "paid",
      "refused",
      "cancelled"
    ],

    paid:[
      "refunded",
      "disputed"
    ],

    disputed:[
      "paid",
      "refunded"
    ],

    refused:[],

    cancelled:[],

    refunded:[]
  };

  return !!(
    transitions[previous] &&
    transitions[previous]
      .includes(
        next
      )
  );
}


function financeApplyServerStatus(
  draftId,
  serverStatus
){

  const id =
    financeText(
      draftId
    );

  const source =
    serverStatus &&
    typeof serverStatus === "object"
      ? serverStatus
      : {};

  const allowed = [
    "payment_pending",
    "paid",
    "refused",
    "cancelled",
    "refunded",
    "disputed"
  ];

  const status =
    financeText(
      source.status
    );

  const drafts =
    financeReadDrafts();

  const previous =
    drafts[id];

  if(
    !previous
  ){
    throw new Error(
      "Opération Finance introuvable."
    );
  }

  if(
    !allowed.includes(
      status
    )
  ){
    throw new Error(
      "État de paiement refusé."
    );
  }

  /*
    Un retour ancien ou incohérent
    ne doit jamais faire revenir
    un paiement vers un état précédent.

    Exemple interdit :
    paid → payment_pending
  */

  if(
    !financePaymentTransitionAllowed(
      previous.status,
      status
    )
  ){
    throw new Error(
      "Transition d’état de paiement refusée : " +
      financeText(
        previous.status
      ) +
      " → " +
      status +
      "."
    );
  }

  const incomingPaymentReference =
    financeText(
      source.paymentReference
    );

  const existingPaymentReference =
    financeText(
      previous.paymentReference
    );

   /* =========================================================
   ÇA COMMENCE ICI — RETOUR PSP DUPLIQUÉ
   ========================================================= */

if(
  financeText(
    previous.status
  ) ===
  status
){

  if(
    incomingPaymentReference &&
    existingPaymentReference &&
    incomingPaymentReference !==
      existingPaymentReference
  ){
    throw new Error(
      "Incohérence de référence de paiement."
    );
  }

  /*
    Même état reçu une seconde fois :
    on ne relance pas les traitements
    financiers déjà effectués.
  */

  return financeClone(
    previous
  );
}

/* =========================================================
   ÇA FINIT ICI — RETOUR PSP DUPLIQUÉ
   ========================================================= */
   
  /*
    Si le serveur fournit une référence
    de paiement, elle doit correspondre
    à celle déjà liée au dossier.
  */

  if(
    incomingPaymentReference &&
    existingPaymentReference &&
    incomingPaymentReference !==
      existingPaymentReference
  ){
    throw new Error(
      "Incohérence de référence de paiement."
    );
  }

  const updated =
    Object.assign(
      {},
      previous,
      {
        status:
          status,

        paymentReference:
          incomingPaymentReference ||
          existingPaymentReference ||
          "",

        serverReference:
          financeText(
            source.serverReference
          ) ||
          financeText(
            previous.serverReference
          ),

        updatedAt:
          financeNow()
      }
    );

  if(
    status ===
      "paid"
  ){

    updated.paidAt =
      financeText(
        source.paidAt
      ) ||
      financeText(
        previous.paidAt
      ) ||
      financeNow();
  }

  drafts[id] =
    updated;

  financeWriteDrafts(
    drafts
  );

  financeEmit(
    "payment-" +
    status,
    updated
  );

  return financeClone(
    updated
  );
}

/* =========================================================
   ÇA FINIT ICI — CONTRÔLE DES ÉTATS DE PAIEMENT
   ========================================================= */
   
/* =========================================================
   ÇA COMMENCE ICI — ÉTATS + EXPORT DU CŒUR FINANCE
   ========================================================= */

function financeStatusLabel(status){

  const labels = {

    draft:
      "À vérifier",

    confirmed:
      "Confirmé avant paiement",

    checkout_uncertain:
      "Paiement à vérifier",

    payment_pending:
      "Paiement en cours",

    paid:
      "Paiement confirmé",

    refused:
      "Paiement refusé",

    cancelled:
      "Paiement annulé",

    refunded:
      "Paiement remboursé",

    disputed:
      "Paiement contesté"
  };

  return (
    labels[
      financeText(
        status
      )
    ] ||
    "État inconnu"
  );
}


window.BociteFinance = {

  version:
    VERSION,

  ready:
    true,

  configure:
    financeConfigure,

  getConfig:
    function(){
      return financeClone(
        config
      );
    },

  registerConnector:
    financeRegisterConnector,

  getConnector:
    financeConnector,

  on:
    financeOn,

  emit:
    financeEmit,

  createDraft:
    financeCreateDraft,

  updateDraft:
    financeUpdateDraft,

  getDraft:
    financeGetDraft,

  deleteDraft:
    financeDeleteDraft,

  validateDraft:
    financeValidateDraft,

  freezeDraft:
    financeFreezeDraft,

  startCheckout:
    financeStartCheckout,

  applyServerStatus:
    financeApplyServerStatus,

  statusLabel:
    financeStatusLabel
};


financeEmit(
  "core-ready",
  {
    version:
      VERSION,

    mode:
      config.mode
  }
);


console.info(
  "✅ Bo'CitéArt Finance — cœur commun chargé"
);

})();

/* =========================================================
   ÇA FINIT ICI — ÉTATS + EXPORT DU CŒUR FINANCE
   ========================================================= */

