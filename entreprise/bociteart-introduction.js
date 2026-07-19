/* =========================================================
   BO'CITÉART — PAGE D'INTRODUCTION

   INTRODUCTION
   → INFORMATIONS LÉGALES

   Aucun onglet existant n'est modifié.
   ========================================================= */

(function initBociteartIntroduction(){

  "use strict";

  if(window.BociteIntroduction){
    return;
  }

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles(){

    if(
      document.getElementById(
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
      #bociteIntroductionOverlay {
        position:fixed;
        inset:0;
        z-index:999999;
        overflow-y:auto;
        box-sizing:border-box;
        padding:18px 10px 36px;
        background:#f2ecde;
        color:#111;
        font-family:Arial, sans-serif;
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

      #bociteIntroductionStartBtn {
        display:block;
        width:100%;
        margin-top:25px;
        padding:15px 14px;
        border:2px solid #315d46;
        border-radius:9px;
        background:#f2ecde;
        color:#111;
        font-size:18px;
        font-weight:700;
        cursor:pointer;
        touch-action:manipulation;
      }

      #bociteIntroductionStartBtn:hover,
      #bociteIntroductionStartBtn:focus {
        background:rgba(49,93,70,.07);
        outline:3px solid rgba(49,93,70,.16);
      }

      @media (max-width:600px) {

        #bociteIntroductionOverlay {
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
     FERMETURE
     ===================================================== */

  function closeIntroduction(){

    const overlay =
      document.getElementById(
        "bociteIntroductionOverlay"
      );

    if(overlay){
      overlay.remove();
    }
  }

  /* =====================================================
     ÉTAPE SUIVANTE
     ===================================================== */

  function openLegalPage(){

    closeIntroduction();

    if(
      window.BociteStart &&
      typeof window.BociteStart.openLegal ===
      "function"
    ){

      window.BociteStart.openLegal();
      return;
    }

    if(
      window.BociteLegal &&
      typeof window.BociteLegal.open ===
      "function"
    ){

      window.BociteLegal.open();
      return;
    }

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:open-legal"
      )
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
            src="./entreprise/bociteart_logo.png?v=20260719-01"
            alt="Logo officiel Bo'CitéArt">

        </div>

        <div class="bociteIntroductionSignature">

          <div>
            <strong>
              Découvrir ce qui existe.
            </strong>
          </div>

          <div>
            <strong>
              RELIER les énergies.
            </strong>
          </div>

          <div>
            <strong>
              Faire vivre chaque territoire.
            </strong>
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
          id="bociteIntroductionStartBtn"
          type="button">

          Commencer la découverte

        </button>

      </div>
    `;
  }

  /* =====================================================
     OUVERTURE
     ===================================================== */

  function renderIntroduction(){

    installStyles();
    closeIntroduction();

    const overlay =
      document.createElement("div");

    overlay.id =
      "bociteIntroductionOverlay";

    overlay.innerHTML =
      getIntroductionHtml();

    document.body.appendChild(
      overlay
    );

    const button =
      document.getElementById(
        "bociteIntroductionStartBtn"
      );

    if(button){

      button.onclick =
        openLegalPage;
    }

    window.setTimeout(
      function(){

        overlay.scrollTop = 0;

      },
      0
    );
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteIntroduction = {
    open:renderIntroduction,
    show:renderIntroduction,
    close:closeIntroduction
  };

  console.log(
    "✅ Introduction officielle Bo'CitéArt prête"
  );

})();
