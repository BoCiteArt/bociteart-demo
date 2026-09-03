/* =========================================================
   ÇA COMMENCE ICI — BO'CITÉART — FINANCE — INTERFACE COMMUNE

   Fichier public : finance/bociteart-finance-ui.js

   Aperçu final, correction de la fiche d'identité,
   confirmation du payeur et départ vers le paiement sécurisé.
   Aucun paiement n'est validé dans le navigateur.
   ========================================================= */

(function(){
  "use strict";

  if(
    window.BociteFinanceUI &&
    window.BociteFinanceUI.ready === true
  ){
    return;
  }

  const VERSION = "2026-09-03-01";
  const ROOT_ID = "bociteFinanceReviewRoot";
  const STYLE_ID = "bociteFinanceReviewStyles";

  let activeDraftId = "";
  let returnFocusElement = null;

  function financeUiCore(){
    if(
      !window.BociteFinance ||
      window.BociteFinance.ready !== true
    ){
      throw new Error("Le cœur Finance n'est pas chargé.");
    }

    return window.BociteFinance;
  }

  function financeUiText(value){
    return String(value == null ? "" : value).trim();
  }

  function financeUiEscape(value){
    return financeUiText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function financeUiBrand(){
    return '<strong class="bcf-brand">' +
      '<span>Bo\'Cité</span><span>Art</span>' +
      '</strong>';
  }

  function financeUiMoney(value){
    const amount = Number(value);

    if(!Number.isFinite(amount)){
      return "—";
    }

    return amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + " €";
  }

  function financeUiEnsureStyles(){
    if(document.getElementById(STYLE_ID)){
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID}{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.68);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
      #${ROOT_ID} *{box-sizing:border-box}
      #${ROOT_ID} .bcf-panel{width:min(640px,100%);max-height:92vh;overflow:auto;background:#f1e6d6;border-radius:26px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
      #${ROOT_ID} .bcf-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;background:#fff;border-bottom:1px solid #e4e4e4}
      #${ROOT_ID} .bcf-title{margin:0;color:#2f5d46;font-size:17px;line-height:1.3;font-weight:700}
      #${ROOT_ID} .bcf-brand span:first-child{color:#2f5d46}
      #${ROOT_ID} .bcf-brand span:last-child{color:#a51e22}
      #${ROOT_ID} .bcf-close{width:44px;height:44px;border:0;border-radius:14px;background:#fff;color:#111;font-size:28px;line-height:1;box-shadow:0 6px 20px rgba(0,0,0,.10);cursor:pointer}
      #${ROOT_ID} .bcf-body{padding:18px}
      #${ROOT_ID} .bcf-card{margin:0 0 14px;padding:16px;background:#fff;border:1px solid #cfdbd4;border-radius:20px}
      #${ROOT_ID} .bcf-subtitle{margin:0 0 10px;color:#2f5d46;font-size:17px;line-height:1.35;font-weight:700}
      #${ROOT_ID} .bcf-text{margin:0;color:#111;font-size:14px;line-height:1.55;font-weight:400}
      #${ROOT_ID} .bcf-preview{display:grid;gap:8px;padding:14px;border:2px solid #2f5d46;border-radius:16px;background:#fff}
      #${ROOT_ID} .bcf-line{color:#111;font-size:14px;line-height:1.45;font-weight:400;overflow-wrap:anywhere}
      #${ROOT_ID} .bcf-amounts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
      #${ROOT_ID} .bcf-amount{padding:12px;border:1px solid #d7e0db;border-radius:14px;background:#fff}
      #${ROOT_ID} .bcf-amount span{display:block;color:#111;font-size:13px;font-weight:400}
      #${ROOT_ID} .bcf-amount strong{display:block;margin-top:4px;color:#2f5d46;font-size:16px}
      #${ROOT_ID} .bcf-check{display:flex;align-items:flex-start;gap:10px;margin-top:14px;color:#111;font-size:14px;line-height:1.45;cursor:pointer}
      #${ROOT_ID} .bcf-check input{width:20px;height:20px;flex:0 0 auto;margin-top:1px;accent-color:#2f5d46}
      #${ROOT_ID} .bcf-actions{display:grid;gap:10px;margin-top:14px}
      #${ROOT_ID} .bcf-btn{width:100%;min-height:52px;padding:12px 16px;border:1px solid #aac1b4;border-radius:16px;background:#fff;color:#2f5d46;font-size:15px;font-weight:700;cursor:pointer}
      #${ROOT_ID} .bcf-btn:disabled{opacity:.48;cursor:not-allowed}
      #${ROOT_ID} .bcf-status{min-height:48px;margin-top:12px;padding:12px;border:1px solid #d7e0db;border-radius:14px;background:#fff;color:#111;font-size:14px;line-height:1.45;font-weight:400}
      #${ROOT_ID} .bcf-status[data-state="error"]{border-color:#a51e22;color:#7f1a1d}
      #${ROOT_ID} .bcf-status[data-state="success"]{border-color:#2f5d46;color:#2f5d46;font-weight:700}
      @media(max-width:480px){#${ROOT_ID}{padding:0}#${ROOT_ID} .bcf-panel{width:100%;max-height:100vh;min-height:100vh;border-radius:0}#${ROOT_ID} .bcf-amounts{grid-template-columns:1fr}}
    `;

    document.head.appendChild(style);
  }

  function financeUiRemove(){
    const root = document.getElementById(ROOT_ID);

    if(root){
      root.remove();
    }

    document.body.classList.remove("bociteFinanceOpen");

    if(returnFocusElement && typeof returnFocusElement.focus === "function"){
      try{
        returnFocusElement.focus();
      }catch(error){
        /* Le bouton d'origine peut avoir disparu. */
      }
    }

    returnFocusElement = null;
  }

  function financeUiPreviewLines(draft){
    if(Array.isArray(draft.previewLines) && draft.previewLines.length){
      return draft.previewLines
        .map(financeUiText)
        .filter(Boolean);
    }

    const text = financeUiText(draft.previewText);
    return text ? [text] : [];
  }

  function financeUiPreviewHtml(draft){
    const lines = financeUiPreviewLines(draft);

    if(!lines.length){
      return '<div class="bcf-line">Aucun aperçu disponible.</div>';
    }

    return lines.map(function(line){
      return '<div class="bcf-line">' + financeUiEscape(line) + '</div>';
    }).join("");
  }

  function financeUiSetStatus(message, state){
    const status = document.getElementById("bcfStatus");

    if(!status){
      return;
    }

    status.textContent = financeUiText(message);
    status.dataset.state = financeUiText(state) || "information";
  }

    function financeUiRender(draftId){
    const core = financeUiCore();
    const draft = core.getDraft(draftId);

    if(!draft){
      throw new Error("La préparation de cette opération est introuvable.");
    }

    const originFocus = returnFocusElement;

    activeDraftId = draft.draftId;
    financeUiEnsureStyles();
    financeUiRemove();
    returnFocusElement = originFocus;

    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "bcfTitle");

    const title = financeUiText(draft.reviewTitle) ||
      "Vérification avant paiement";

    const amountTTC = Number.isFinite(Number(draft.amountTTC))
      ? Number(draft.amountTTC)
      : null;

    root.innerHTML = `
      <section class="bcf-panel">
        <header class="bcf-head">
          <h2 class="bcf-title" id="bcfTitle">${financeUiEscape(title)} avec ${financeUiBrand()}</h2>
          <button class="bcf-close" id="bcfClose" type="button" aria-label="Fermer">×</button>
        </header>

        <div class="bcf-body">
          <div class="bcf-card">
            <h3 class="bcf-subtitle">Vérifiez attentivement vos informations</h3>
            <p class="bcf-text">
              Ces informations proviennent de votre fiche d’identité. Si vous constatez une erreur,
              corrigez-la maintenant. La préparation en cours sera conservée et l’aperçu sera ensuite actualisé.
            </p>
          </div>

          <div class="bcf-card">
            <h3 class="bcf-subtitle">Aperçu définitif</h3>
            <div class="bcf-preview" id="bcfPreview">${financeUiPreviewHtml(draft)}</div>

            <div class="bcf-amounts">
              <div class="bcf-amount">
                <span>Montant HT</span>
                <strong>${financeUiMoney(draft.amountHT)}</strong>
              </div>
              <div class="bcf-amount">
                <span>Montant TTC</span>
                <strong>${amountTTC == null ? "Calculé avant le paiement" : financeUiMoney(amountTTC)}</strong>
              </div>
            </div>

            <button class="bcf-btn" id="bcfEditIdentity" type="button">
              Corriger mes informations
            </button>
          </div>

          <div class="bcf-card">
            <p class="bcf-text">
              Dès que le paiement est confirmé, la publication est automatiquement transmise.
              Elle ne peut plus être modifiée ni remboursée, sauf erreur imputable à Bo’CitéArt
              ou disposition légale contraire.
            </p>

            <label class="bcf-check">
              <input id="bcfConfirm" type="checkbox">
              <span>
                Je confirme que toutes les informations affichées sont exactes et j’autorise
                leur utilisation dès confirmation du paiement.
              </span>
            </label>

            <div class="bcf-actions">
              <button class="bcf-btn" id="bcfPay" type="button" disabled>
                Confirmer et payer
              </button>
            </div>

            <div class="bcf-status" id="bcfStatus" data-state="information">
              Vérification obligatoire avant le paiement.
            </div>
          </div>
        </div>
      </section>
    `;

    document.body.appendChild(root);
    document.body.classList.add("bociteFinanceOpen");

          const closeButton = document.getElementById("bcfClose");
    const editButton = document.getElementById("bcfEditIdentity");
    const confirmBox = document.getElementById("bcfConfirm");
    const payButton = document.getElementById("bcfPay");

    closeButton.onclick = financeUiRemove;

    confirmBox.onchange = function(){
      const checked = confirmBox.checked === true;

      core.updateDraft(draft.draftId, {
        confirmedByPayer: checked
      });

      payButton.disabled = !checked;
      financeUiSetStatus(
        checked
          ? "Informations confirmées. Vous pouvez maintenant payer."
          : "Vérification obligatoire avant le paiement.",
        checked ? "success" : "information"
      );
    };

    editButton.onclick = function(){
      const current = core.getDraft(draft.draftId);
      const connector = core.getConnector(current.connectorName);

      core.updateDraft(draft.draftId, {
        confirmedByPayer: false
      });

      if(
        connector &&
        typeof connector.editIdentity === "function"
      ){
        financeUiRemove();
        connector.editIdentity({
          draftId: draft.draftId,
          payerRef: current.payerRef,
          identityVersion: current.identityVersion
        });
        return;
      }

      core.emit("identity-edit-requested", {
        draftId: draft.draftId,
        connectorName: current.connectorName,
        payerRef: current.payerRef
      });

      financeUiSetStatus(
        "La fiche d’identité n’est pas encore raccordée à cet espace.",
        "error"
      );
    };

    payButton.onclick = async function(){
      payButton.disabled = true;
      editButton.disabled = true;
      confirmBox.disabled = true;
      financeUiSetStatus("Ouverture du paiement sécurisé…", "information");

      try{
        const response = await core.startCheckout(draft.draftId);

        if(response.checkoutUrl){
          window.location.assign(response.checkoutUrl);
          return;
        }

        financeUiSetStatus(
          "Paiement préparé. Confirmation sécurisée en attente.",
          "information"
        );
      }catch(error){
        payButton.disabled = false;
        editButton.disabled = false;
        confirmBox.disabled = false;
        financeUiSetStatus(
          error && error.message
            ? error.message
            : "Le paiement sécurisé est momentanément indisponible.",
          "error"
        );
      }
    };

    window.setTimeout(function(){
      closeButton.focus();
    }, 0);

    return draft.draftId;
  }

    function financeUiOpen(input){
    const core = financeUiCore();
    const source = input && typeof input === "object" ? input : {};

    returnFocusElement = document.activeElement;

    const previewLines = Array.isArray(source.previewLines)
      ? source.previewLines.map(financeUiText).filter(Boolean)
      : [];

    const payload = Object.assign({}, source, {
      previewLines: previewLines,
      previewText: financeUiText(source.previewText) || previewLines.join(" — "),
      confirmedByPayer: false
    });

    const draft = payload.draftId && core.getDraft(payload.draftId)
      ? core.updateDraft(payload.draftId, payload)
      : core.createDraft(payload);

    return financeUiRender(draft.draftId);
  }

  function financeUiResume(draftId, identityUpdate){
    const core = financeUiCore();
    const update = identityUpdate && typeof identityUpdate === "object"
      ? identityUpdate
      : {};

    const previewLines = Array.isArray(update.previewLines)
      ? update.previewLines.map(financeUiText).filter(Boolean)
      : null;

    const changes = Object.assign({}, update, {
      confirmedByPayer: false
    });

    if(previewLines){
      changes.previewLines = previewLines;
      changes.previewText = financeUiText(update.previewText) ||
        previewLines.join(" — ");
    }

    core.updateDraft(draftId, changes);
    return financeUiRender(draftId);
  }

  function financeUiShowPaid(draft){
    if(!draft || draft.draftId !== activeDraftId){
      return;
    }

    const root = document.getElementById(ROOT_ID);

    if(!root){
      return;
    }

    const payButton = document.getElementById("bcfPay");
    const editButton = document.getElementById("bcfEditIdentity");
    const confirmBox = document.getElementById("bcfConfirm");

    if(payButton){
      payButton.disabled = true;
      payButton.textContent = "Paiement confirmé";
    }

    if(editButton){
      editButton.disabled = true;
    }

    if(confirmBox){
      confirmBox.disabled = true;
    }

    financeUiSetStatus(
      "Paiement confirmé. La publication a été automatiquement transmise.",
      "success"

          );
  }

  window.BociteFinanceUI = {
    version: VERSION,
    ready: true,
    open: financeUiOpen,
    resumeAfterIdentityEdit: financeUiResume,
    close: financeUiRemove,
    showPaid: financeUiShowPaid
  };

  try{
    financeUiCore().on("payment-paid", financeUiShowPaid);
  }catch(error){
    /* Le cœur signalera clairement son absence lors de l'ouverture. */
  }

  console.info("✅ Bo'CitéArt Finance — interface commune chargée");

})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART — FINANCE — INTERFACE COMMUNE
   ========================================================= */
