
/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 2 — INFORMATIONS LÉGALES

   FICHIER INDÉPENDANT :
   aucun onglet existant n'est modifié
   ========================================================= */

(function initBociteartLegal(){

  "use strict";

  if(window.BociteLegal){
    return;
  }

  const LEGAL_VERSION = {
    rgpd:"2026-07-16",
    cgu:"2026-07-16",
    cgv:"2026-07-16"
  };

  const STORAGE_KEY =
    "bociteart_legal_acceptance_v1";

  function getLogoHtml(){

    return `
      <span
        style="
          color:#2f5d46;
          font-weight:900;
        ">
        Bo'Cité
      </span><span
        style="
          color:#b00020;
          font-weight:900;
        ">
        Art
      </span>
    `;
  }

  function installStyles(){

    if(
      document.getElementById(
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
      #bociteLegalOverlay {
        position:fixed;
        inset:0;
        z-index:999999;
        overflow-y:auto;
        box-sizing:border-box;
        padding:16px 10px 34px;
        background:#f3eddf;
        color:#111;
        font-family:Arial, sans-serif;
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
        color:#111;
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
        touch-action:manipulation;
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
        color:#111;
        font-size:15px;
        line-height:1.55;
      }

      .bociteLegalDocumentContent.isOpen {
        display:block;
      }

      .bociteLegalDocumentContent h3 {
        margin:0 0 12px;
        color:#111;
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
        color:#111;
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
        background:#ffffff;
        color:#111;
        font-size:18px;
        font-weight:900;
        cursor:pointer;
        touch-action:manipulation;
        transition:all .2s ease;
      }

      #bociteLegalContinueBtn:enabled:hover{
        background:#f6f2e9;
      }
      #bociteLegalContinueBtn:disabled {
      background:#aaa;
      color:#ffffff;
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
        color:#111;
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

      @media (max-width:600px) {
        #bociteLegalOverlay {
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

        .bociteLegalDocumentBtn {
          font-size:16px;
        }

        .bociteLegalAcceptance {
          font-size:15px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function getLegalHtml(){

    return `
      <div id="bociteLegalCard">

        <h2 class="bociteLegalTitle">
          ${getLogoHtml()}
        </h2>

        <div class="bociteLegalIntro">

          Avant de poursuivre,
          vous pouvez consulter les informations
          relatives à l’utilisation de l’application,
          à la protection des données
          et aux services proposés.

          <br><br>

          Votre validation sera horodatée
          automatiquement en arrière-plan.

          Aucune date
          ni aucune heure
          ne vous seront demandées.
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
            limite la collecte
            aux informations nécessaires
            au fonctionnement des services utilisés.
          </p>

          <p>
            Les espaces publics peuvent être consultés
            sans créer immédiatement
            une fiche professionnelle complète.
          </p>

          <p>
            Les informations supplémentaires
            sont demandées uniquement
            lorsqu’une action privée,
            une publication,
            un abonnement,
            un paiement
            ou une facturation
            l’exige.
          </p>

          <p>
            Pour les projets scolaires,
            les autorisations parentales
            relatives à l’enregistrement
            de la voix des enfants
            restent conservées
            par l’établissement scolaire
            selon son organisation.
          </p>

          <p>
            ${getLogoHtml()}
            n’a pas vocation
            à recevoir les fiches parentales signées.
          </p>
        </div>

        <button
          id="bociteLegalCguBtn"
          class="bociteLegalDocumentBtn"
          type="button"
          aria-expanded="false">
          Conditions générales d’utilisation
        </button>

        <div
          id="bociteLegalCguContent"
          class="bociteLegalDocumentContent">

          <h3>
            Conditions d’utilisation
          </h3>

          <p>
            L’application permet de découvrir,
            relier
            et valoriser
            les acteurs et les initiatives
            d’un territoire.
          </p>

          <p>
            Les informations publiques
            peuvent être consultées librement.
          </p>

          <p>
            Certaines fonctions nécessitent
            un compte,
            une vérification,
            un code d’accès
            ou un abonnement adapté au profil.
          </p>

          <p>
            Chaque utilisateur reste responsable
            des informations
            qu’il publie
            ou transmet.
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
            s’appliquent uniquement
            lorsqu’un utilisateur choisit
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
            La simple découverte
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
            J’ai pris connaissance
            des informations applicables
            et je souhaite poursuivre
            la découverte de ${getLogoHtml()}.
          </span>
        </label>

        <div id="bociteLegalMessage">

          Cochez la case
          pour confirmer
          que vous avez pris connaissance
          des informations.
        </div>

        <button
          id="bociteLegalContinueBtn"
          type="button"
          disabled>
          Continuer
        </button>

        <div class="bociteLegalPrivacyNote">

          L’acceptation est enregistrée
          automatiquement avec sa date,
          son heure
          et la version des documents.

        </div>

      </div>
    `;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function removeLegal(){

    const overlay =
      getElement(
        "bociteLegalOverlay"
      );

    if(overlay){
      overlay.remove();
    }
  }

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

    const isOpen =
      content.classList.contains(
        "isOpen"
      );

    content.classList.toggle(
      "isOpen",
      !isOpen
    );

    button.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );
  }

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
      timezone:
        Intl.DateTimeFormat()
          .resolvedOptions()
          .timeZone || "",
      documents:{
        rgpd:
          LEGAL_VERSION.rgpd,
        cgu:
          LEGAL_VERSION.cgu,
        cgv:
          LEGAL_VERSION.cgv
      },
      source:
        "bociteart-entry"
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
        "Bo'CitéArt : horodatage local non enregistré.",
        error
      );
    }

    window.BociteLegalAcceptance =
      record;

    return record;
  }

  function continueJourney(){

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

    const record =
      saveAcceptance();

    removeLegal();

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:open-synoptique",
        {
          detail:{
            acceptance:
              record
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
        continueJourney;
    }
  }

  function openLegal(){

    installStyles();
    removeLegal();

    const overlay =
      document.createElement("div");

    overlay.id =
      "bociteLegalOverlay";

    overlay.innerHTML =
      getLegalHtml();

    document.body.appendChild(
      overlay
    );

    bindLegal();

    window.setTimeout(function(){

      overlay.scrollTop = 0;

    },0);
  }

  function getSavedAcceptance(){

    try{

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      return saved
        ? JSON.parse(saved)
        : null;

    }catch(error){

      return null;
    }
  }

  window.BociteLegal = {
    open:openLegal,
    close:removeLegal,
    getAcceptance:
      getSavedAcceptance,
    storageKey:
      STORAGE_KEY,
    version:
      LEGAL_VERSION
  };

  document.addEventListener(
    "bociteart:open-legal",
    openLegal
  );

  console.log(
    "✅ Informations légales Bo'CitéArt prêtes"
  );

})();
