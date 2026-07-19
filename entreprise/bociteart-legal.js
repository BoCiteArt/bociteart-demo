/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 1 — INFORMATIONS LÉGALES

   RGPD / CGU / CGV
   → INTRODUCTION

   Ce fichier affiche uniquement l'écran légal.
   Il ne décide jamais lui-même de la page suivante.
   ========================================================= */

(function initBociteartLegal(){

  "use strict";

  if(window.BociteLegal){
    return;
  }

  const OVERLAY_ID =
    "bociteLegalOverlay";

  const STORAGE_KEY =
    "bociteart_legal_acceptance_v2";

  const LEGAL_VERSION = {
    rgpd:"2026-07-19",
    cgu:"2026-07-19",
    cgv:"2026-07-19"
  };

  /* =====================================================
     OUTILS
     ===================================================== */

  function getElement(id){

    return document.getElementById(id);
  }

  function getLogoHtml(){

    return `
      <span style="color:#2f5d46;font-weight:900;">
        Bo'Cité
      </span><span style="color:#b00020;font-weight:900;">
        Art
      </span>
    `;
  }

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles(){

    if(
      getElement(
        "bociteLegalStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteLegalStyles";

    style.textContent = `
      #${OVERLAY_ID} {
        position:fixed;
        inset:0;
        z-index:999999;
        overflow-y:auto;
        box-sizing:border-box;
        padding:16px 10px 34px;
        background:#f3eddf;
        color:#111;
        font-family:Arial,sans-serif;
      }

      #bociteLegalCard {
        width:100%;
        max-width:620px;
        margin:0 auto;
        box-sizing:border-box;
        padding:23px 18px;
        border:2px solid #2f5d46;
        border-radius:15px;
        background:#fffdf7;
        box-shadow:0 8px 28px rgba(0,0,0,.13);
      }

      .bociteLegalTitle {
        margin:0;
        text-align:center;
        font-size:28px;
        line-height:1.25;
      }

      .bociteLegalIntro {
        margin-top:18px;
        font-size:17px;
        line-height:1.55;
      }

      .bociteLegalDocumentBtn {
        display:block;
        width:100%;
        margin-top:10px;
        padding:13px 12px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        color:#111;
        font-size:17px;
        font-weight:800;
        text-align:left;
        cursor:pointer;
      }

      .bociteLegalDocumentBtn[aria-expanded="true"] {
        background:#f2eee4;
      }

      .bociteLegalDocumentContent {
        display:none;
        margin-top:7px;
        padding:15px 13px;
        border-left:6px solid #2f5d46;
        border-radius:8px;
        background:#f7f3ea;
        font-size:15px;
        line-height:1.55;
      }

      .bociteLegalDocumentContent.isOpen {
        display:block;
      }

      .bociteLegalDocumentContent h3 {
        margin:0 0 12px;
        font-size:19px;
      }

      .bociteLegalDocumentContent p {
        margin:10px 0;
      }

      .bociteLegalAcceptance {
        display:flex;
        align-items:flex-start;
        gap:11px;
        margin-top:20px;
        padding:16px 14px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        font-size:16px;
        line-height:1.45;
        cursor:pointer;
      }

      #bociteLegalAcceptCheckbox {
        width:21px;
        height:21px;
        margin:1px 0 0;
        flex:0 0 auto;
        accent-color:#2f5d46;
        cursor:pointer;
      }

      #bociteLegalContinueBtn {
        display:block;
        width:100%;
        margin-top:18px;
        padding:15px 12px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        color:#111;
        font-size:18px;
        font-weight:900;
        cursor:pointer;
      }

      #bociteLegalContinueBtn:disabled {
        background:#aaa;
        color:#fff;
        border-color:#888;
        cursor:not-allowed;
        opacity:.75;
      }

      #bociteLegalMessage {
        display:none;
        margin-top:12px;
        padding:12px;
        border-left:6px solid #b00020;
        background:#f7f3ea;
        font-size:15px;
        line-height:1.45;
      }

      .bociteLegalPrivacyNote {
        margin-top:16px;
        color:#333;
        font-size:14px;
        line-height:1.45;
        text-align:center;
      }

      @media(max-width:600px){

        #${OVERLAY_ID} {
          padding:9px 7px 26px;
        }

        #bociteLegalCard {
          padding:20px 14px;
          border-radius:12px;
        }

        .bociteLegalTitle {
          font-size:25px;
        }

        .bociteLegalIntro {
          font-size:16px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /* =====================================================
     CONTENU
     ===================================================== */

  function getLegalHtml(){

    return `
      <div id="bociteLegalCard">

        <h2 class="bociteLegalTitle">
          ${getLogoHtml()}
        </h2>

        <div class="bociteLegalIntro">

          Avant de poursuivre,
          vous pouvez consulter les informations
          relatives à l'utilisation de l'application,
          à la protection de vos données
          et aux services proposés.

          <br><br>

          Votre validation sera enregistrée
          automatiquement avec sa date,
          son heure
          et la version des documents acceptés.

        </div>

        <button
          id="bociteLegalRgpdBtn"
          class="bociteLegalDocumentBtn"
          type="button"
          aria-expanded="false">

          Protection des données — RGPD

        </button>

        <div
          id="bociteLegalRgpdContent"
          class="bociteLegalDocumentContent">

          <h3>
            Protection des données
          </h3>

          <p>
            ${getLogoHtml()}
            limite la collecte des informations
            aux données nécessaires
            au fonctionnement des services utilisés.
          </p>

          <p>
            Les statistiques d'installation
            et d'activation sont enregistrées
            sans intégrer le nom de l'utilisateur.
          </p>

          <p>
            Elles peuvent distinguer
            une catégorie déclarée,
            une commune
            et un secteur d'activité,
            afin de produire des bilans anonymes.
          </p>

          <p>
            Les informations personnelles complémentaires
            sont demandées uniquement
            lorsqu'une action privée,
            une publication,
            un abonnement,
            un paiement
            ou une facturation l'exige.
          </p>

        </div>

        <button
          id="bociteLegalCguBtn"
          class="bociteLegalDocumentBtn"
          type="button"
          aria-expanded="false">

          Conditions générales d'utilisation

        </button>

        <div
          id="bociteLegalCguContent"
          class="bociteLegalDocumentContent">

          <h3>
            Conditions d'utilisation
          </h3>

          <p>
            L'application permet de découvrir,
            relier
            et valoriser les habitants,
            les commerces,
            les entreprises,
            les associations,
            les écoles,
            les clubs sportifs
            et les services du territoire.
          </p>

          <p>
            Chaque utilisateur reste responsable
            des informations qu'il publie
            ou transmet.
          </p>

          <p>
            Les accès privés,
            professionnels
            ou administratifs
            ne doivent pas être communiqués
            à une personne non autorisée.
          </p>

        </div>

        <button
          id="bociteLegalCgvBtn"
          class="bociteLegalDocumentBtn"
          type="button"
          aria-expanded="false">

          Conditions générales de vente

        </button>

        <div
          id="bociteLegalCgvContent"
          class="bociteLegalDocumentContent">

          <h3>
            Services payants
          </h3>

          <p>
            Les conditions commerciales
            s'appliquent uniquement
            lorsqu'un utilisateur choisit
            un service payant,
            un abonnement,
            une publicité
            ou une prestation professionnelle.
          </p>

          <p>
            Les tarifs,
            les modalités de paiement,
            les conditions de facturation
            et les engagements correspondants
            sont présentés avant validation.
          </p>

          <p>
            La simple consultation
            des espaces publics
            ne crée aucun abonnement.
          </p>

        </div>

        <label
          class="bociteLegalAcceptance"
          for="bociteLegalAcceptCheckbox">

          <input
            id="bociteLegalAcceptCheckbox"
            type="checkbox">

          <span>
            J'ai pris connaissance
            des informations relatives au RGPD,
            aux conditions générales d'utilisation
            et aux conditions générales de vente,
            et je souhaite poursuivre.
          </span>

        </label>

        <div
          id="bociteLegalMessage"
          role="alert">

          Cochez la case
          pour confirmer votre acceptation
          avant de continuer.

        </div>

        <button
          id="bociteLegalContinueBtn"
          type="button"
          disabled>

          Valider et continuer

        </button>

        <div class="bociteLegalPrivacyNote">

          Cette page ne peut pas passer
          à l'étape suivante
          sans votre clic.

        </div>

      </div>
    `;
  }

  /* =====================================================
     OUVERTURE ET FERMETURE
     ===================================================== */

  function closeLegal(){

    const overlay =
      getElement(
        OVERLAY_ID
      );

    if(overlay){
      overlay.remove();
    }
  }

  function openLegal(){

    installStyles();
    closeLegal();

    const overlay =
      document.createElement("div");

    overlay.id =
      OVERLAY_ID;

    overlay.innerHTML =
      getLegalHtml();

    document.body.appendChild(
      overlay
    );

    bindLegal();

    overlay.scrollTop = 0;
  }

  /* =====================================================
     ACCEPTATION
     ===================================================== */

  function createAcceptanceRecord(){

    const now =
      new Date();

    return {
      accepted:true,
      acceptedAt:
        now.toISOString(),
      localDate:
        now.toLocaleDateString("fr-FR"),
      localTime:
        now.toLocaleTimeString("fr-FR"),
      documents:
        Object.assign(
          {},
          LEGAL_VERSION
        ),
      source:
        "bociteart-entry-v6"
    };
  }

  function saveAcceptance(){

    const record =
      createAcceptanceRecord();

    try{

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(record)
      );

    }catch(error){

      console.warn(
        "Bo'CitéArt : validation légale non enregistrée.",
        error
      );
    }

    return record;
  }

  /* =====================================================
     ÉVÉNEMENTS
     ===================================================== */

  function toggleDocument(
    buttonId,
    contentId
  ){

    const button =
      getElement(buttonId);

    const content =
      getElement(contentId);

    if(
      !button ||
      !content
    ){
      return;
    }

    const opening =
      !content.classList.contains(
        "isOpen"
      );

    content.classList.toggle(
      "isOpen",
      opening
    );

    button.setAttribute(
      "aria-expanded",
      String(opening)
    );
  }

  function completeLegal(){

    const checkbox =
      getElement(
        "bociteLegalAcceptCheckbox"
      );

    const message =
      getElement(
        "bociteLegalMessage"
      );

    if(
      !checkbox ||
      !checkbox.checked
    ){

      if(message){
        message.style.display =
          "block";
      }

      return;
    }

    const acceptance =
      saveAcceptance();

    closeLegal();

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:legal-completed",
        {
          detail:{
            acceptance:
              acceptance
          }
        }
      )
    );
  }

  function bindLegal(){

    const checkbox =
      getElement(
        "bociteLegalAcceptCheckbox"
      );

    const continueButton =
      getElement(
        "bociteLegalContinueBtn"
      );

    const message =
      getElement(
        "bociteLegalMessage"
      );

    const rgpdButton =
      getElement(
        "bociteLegalRgpdBtn"
      );

    const cguButton =
      getElement(
        "bociteLegalCguBtn"
      );

    const cgvButton =
      getElement(
        "bociteLegalCgvBtn"
      );

    if(rgpdButton){

      rgpdButton.onclick =
        function(){

          toggleDocument(
            "bociteLegalRgpdBtn",
            "bociteLegalRgpdContent"
          );
        };
    }

    if(cguButton){

      cguButton.onclick =
        function(){

          toggleDocument(
            "bociteLegalCguBtn",
            "bociteLegalCguContent"
          );
        };
    }

    if(cgvButton){

      cgvButton.onclick =
        function(){

          toggleDocument(
            "bociteLegalCgvBtn",
            "bociteLegalCgvContent"
          );
        };
    }

    if(checkbox){

      checkbox.onchange =
        function(){

          if(continueButton){

            continueButton.disabled =
              !checkbox.checked;
          }

          if(
            message &&
            checkbox.checked
          ){

            message.style.display =
              "none";
          }
        };
    }

    if(continueButton){

      continueButton.onclick =
        completeLegal;
    }
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteLegal = {
    open:openLegal,
    close:closeLegal,
    storageKey:STORAGE_KEY,
    version:LEGAL_VERSION
  };

  console.log(
    "✅ Étape légale Bo'CitéArt V6 prête"
  );

})();
