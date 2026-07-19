/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 2 — INTRODUCTION

   INFORMATIONS LÉGALES
   → INTRODUCTION
   → CRÉATION DU COMPTE

   Ce fichier affiche uniquement l'introduction.
   Il ne décide jamais lui-même de la page suivante.
   ========================================================= */

(function initBociteartIntroduction(){

  "use strict";

  if(window.BociteIntroduction){
    return;
  }

  const OVERLAY_ID =
    "bociteIntroductionOverlay";

  /* =====================================================
     OUTILS
     ===================================================== */

  function getElement(id){

    return document.getElementById(id);
  }

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles(){

    if(
      getElement(
        "bociteIntroductionStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteIntroductionStyles";

    style.textContent = `
      #${OVERLAY_ID} {
        position:fixed;
        inset:0;
        z-index:999999;
        overflow-y:auto;
        box-sizing:border-box;
        padding:18px 10px 36px;
        background:#f2ecde;
        color:#111;
        font-family:Arial,sans-serif;
      }

      #bociteIntroductionCard {
        width:100%;
        max-width:650px;
        margin:0 auto;
        box-sizing:border-box;
        padding:20px 20px 28px;
        background:#f2ecde;
      }

      .bociteIntroductionLogoBox {
        margin:0 0 22px;
        text-align:center;
      }

      .bociteIntroductionLogoImage {
        display:block;
        width:310px;
        max-width:88%;
        height:auto;
        margin:0 auto;
        object-fit:contain;
      }

      .bociteIntroductionSignature {
        margin-top:22px;
        color:#111;
        line-height:1.55;
        text-align:center;
      }

      .bociteIntroductionSignature div {
        margin:5px 0;
        font-size:21px;
        font-weight:700;
      }

      .bociteIntroductionSeparator {
        width:74px;
        height:2px;
        margin:24px auto;
        background:#315d46;
      }

      .bociteIntroductionActors {
        color:#111;
        font-size:17px;
        line-height:1.6;
      }

      .bociteIntroductionActors p {
        display:flex;
        align-items:flex-start;
        gap:10px;
        margin:13px 0;
        text-align:left;
      }

      .introBullet {
        flex:0 0 18px;
        min-width:18px;
        color:#315d46;
        font-size:20px;
        font-weight:700;
        line-height:1.35;
        text-align:center;
      }

      .bociteIntroductionConclusion {
        margin-top:26px;
        color:#111;
        font-size:18px;
        line-height:1.55;
        text-align:center;
        font-weight:700;
      }

      #bociteIntroductionContinueBtn {
        display:block;
        width:100%;
        margin-top:25px;
        padding:15px 14px;
        border:2px solid #315d46;
        border-radius:9px;
        background:#f2ecde;
        color:#111;
        font-size:18px;
        font-weight:800;
        cursor:pointer;
        touch-action:manipulation;
      }

      #bociteIntroductionContinueBtn:hover,
      #bociteIntroductionContinueBtn:focus {
        background:rgba(49,93,70,.07);
        outline:3px solid rgba(49,93,70,.16);
      }

      @media(max-width:600px){

        #${OVERLAY_ID} {
          padding:10px 7px 28px;
        }

        #bociteIntroductionCard {
          padding:18px 15px 24px;
        }

        .bociteIntroductionLogoImage {
          width:265px;
        }

        .bociteIntroductionSignature div {
          font-size:19px;
        }

        .bociteIntroductionActors {
          font-size:16px;
        }

        .bociteIntroductionActors p {
          gap:8px;
        }

        .introBullet {
          flex-basis:16px;
          min-width:16px;
          font-size:18px;
        }

        .bociteIntroductionConclusion {
          font-size:17px;
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

  function getIntroductionHtml(){

    return `
      <div id="bociteIntroductionCard">

        <div class="bociteIntroductionLogoBox">

          <img
            class="bociteIntroductionLogoImage"
            src="./entreprise/bociteart_logo.png?v=20260719-02"
            alt="Logo officiel Bo'CitéArt">

        </div>

        <div class="bociteIntroductionSignature">

          <div>
            Découvrir ce qui existe.
          </div>

          <div>
            RELIER les énergies.
          </div>

          <div>
            Faire vivre chaque territoire.
          </div>

        </div>

        <div class="bociteIntroductionSeparator"></div>

        <div class="bociteIntroductionActors">

          <p>
            <span class="introBullet">–</span>

            <span>
              Les œuvres rapprochent
              les artistes
              et les habitants.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              L'école révèle ses talents.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              Les associations
              rassemblent les sourires.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              Les clubs sportifs
              développent leurs forces
              et l'esprit d'équipe.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              Les commerces renforcent
              et fidélisent leur clientèle.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              Les entreprises véritablement visibles
              trouvent leurs futurs collaborateurs.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              La mairie révèle
              les trésors
              et les richesses
              de son territoire.
            </span>
          </p>

        </div>

        <div class="bociteIntroductionSeparator"></div>

        <div class="bociteIntroductionConclusion">

          Bo'CitéArt relie les énergies

          <br>

          pour faire vivre chaque territoire.

        </div>

        <button
          id="bociteIntroductionContinueBtn"
          type="button">

          Commencer la découverte

        </button>

      </div>
    `;
  }

  /* =====================================================
     OUVERTURE ET FERMETURE
     ===================================================== */

  function closeIntroduction(){

    const overlay =
      getElement(
        OVERLAY_ID
      );

    if(overlay){
      overlay.remove();
    }
  }

  function openIntroduction(){

    installStyles();
    closeIntroduction();

    const overlay =
      document.createElement("div");

    overlay.id =
      OVERLAY_ID;

    overlay.innerHTML =
      getIntroductionHtml();

    document.body.appendChild(
      overlay
    );

    bindIntroduction();

    overlay.scrollTop = 0;
  }

  /* =====================================================
     VALIDATION DE L'ÉTAPE
     ===================================================== */

  function completeIntroduction(){

    closeIntroduction();

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:introduction-completed"
      )
    );
  }

  /* =====================================================
     ÉVÉNEMENTS
     ===================================================== */

  function bindIntroduction(){

    const continueButton =
      getElement(
        "bociteIntroductionContinueBtn"
      );

    if(continueButton){

      continueButton.onclick =
        completeIntroduction;
    }
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteIntroduction = {
    open:openIntroduction,
    show:openIntroduction,
    close:closeIntroduction
  };

  console.log(
    "✅ Étape introduction Bo'CitéArt V6 prête"
  );

})();
