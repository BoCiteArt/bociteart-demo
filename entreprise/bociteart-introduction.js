/* =========================================================
   BO'CITÉART — PAGE D'INTRODUCTION
   Après validation RGPD / CGU / CGV
   ========================================================= */

(function initBociteartIntroduction(){

  "use strict";

  if(window.BociteIntroduction){
    return;
  }

  function installStyles(){

    if(document.getElementById("bociteIntroductionStyles")){
      return;
    }

    const style = document.createElement("style");

    style.id = "bociteIntroductionStyles";

    style.textContent = `
      #bociteIntroductionOverlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        overflow-y: auto;
        box-sizing: border-box;
        padding: 18px 10px 36px;
        background: #f1e5cf;
        color: #111;
        font-family: Arial, sans-serif;
      }

      #bociteIntroductionCard {
        width: 100%;
        max-width: 650px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 20px 20px 28px;
        background: #f1e5cf;
      }

      .bociteIntroductionLogoBox {
        margin: 0 0 22px;
        text-align: center;
      }

      .bociteIntroductionLogoImage {
        display: block;
        width: 310px;
        max-width: 88%;
        height: auto;
        margin: 0 auto;
        object-fit: contain;
      }

      .bociteIntroductionSignature {
        margin-top: 22px;
        color: #111;
        line-height: 1.55;
        text-align: center;
      }

      .bociteIntroductionSignature div {
        margin: 5px 0;
        font-size: 21px;
        font-weight: 400;
      }

      .bociteIntroductionSeparator {
        width: 74px;
        height: 2px;
        margin: 24px auto;
        background: #315d46;
      }

      .bociteIntroductionActors {
        color: #111;
        font-size: 17px;
        line-height: 1.6;
      }

      .bociteIntroductionActors p {
        margin: 13px 0;
      }

      .bociteIntroductionConclusion {
        margin-top: 26px;
        color: #111;
        font-size: 18px;
        line-height: 1.55;
        text-align: center;
        font-weight: 400;
      }

      #bociteIntroductionStartBtn {
        display: block;
        width: 100%;
        margin-top: 25px;
        padding: 15px 14px;
        border: 2px solid #315d46;
        border-radius: 9px;
        background: transparent;
        color: #111;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
      }

      #bociteIntroductionStartBtn:hover {
        background: rgba(49, 93, 70, 0.07);
      }

      @media (max-width: 600px) {

        #bociteIntroductionOverlay {
          padding: 10px 7px 28px;
        }

        #bociteIntroductionCard {
          padding: 18px 15px 24px;
        }

        .bociteIntroductionLogoImage {
          width: 265px;
        }

        .bociteIntroductionSignature div {
          font-size: 19px;
        }

        .bociteIntroductionActors {
          font-size: 16px;
        }

        .bociteIntroductionConclusion {
          font-size: 17px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function closeIntroduction(){

    const overlay =
      document.getElementById("bociteIntroductionOverlay");

    if(overlay){
      overlay.remove();
    }
  }

  function openPresentationPage(){

    closeIntroduction();

    window.dispatchEvent(
      new CustomEvent("bociteart:open-synoptique")
    );
  }

  function renderIntroduction(){

    installStyles();
    closeIntroduction();

    const overlay = document.createElement("div");

    overlay.id = "bociteIntroductionOverlay";

    overlay.innerHTML = `
      <div id="bociteIntroductionCard">

        <div class="bociteIntroductionLogoBox">
          <img
            class="bociteIntroductionLogoImage"
            src="./entreprise/bociteart_logo.png?v=20260717-44"
            alt="Logo officiel Bo'CitéArt">
        </div>

        <div class="bociteIntroductionSignature">
          <div>Découvrir ce qui existe.</div>
          <div>RELIER les énergies.</div>
          <div>Faire vivre chaque territoire.</div>
        </div>

        <div class="bociteIntroductionSeparator"></div>

        <div class="bociteIntroductionActors">

          <p>
            Les œuvres rapprochent les artistes, les habitants.
          </p>

          <p>
            L'école révèle ses talents.
          </p>

          <p>
            Les associations rassemblent les sourires.
          </p>

          <p>
            Les clubs sportifs développent leurs forces
            et l'esprit d'équipe.
          </p>

          <p>
            Les commerces renforcent et fidélisent leur clientèle.
          </p>

          <p>
            Les entreprises véritablement visibles
            trouvent leurs futurs collaborateurs.
          </p>

          <p>
            La mairie révèle les trésors
            et les richesses de son territoire.
          </p>

        </div>

        <div class="bociteIntroductionSeparator"></div>

        <div class="bociteIntroductionConclusion">
          Bo'CitéArt relie les énergies<br>
          pour faire vivre chaque territoire.
        </div>

        <button
          id="bociteIntroductionStartBtn"
          type="button">
          Commencer la découverte
        </button>

      </div>
    `;

    document.body.appendChild(overlay);

    const button =
      document.getElementById("bociteIntroductionStartBtn");

    if(button){
      button.addEventListener(
        "click",
        openPresentationPage
      );
    }
  }

  window.BociteIntroduction = {
    open: renderIntroduction,
    show: renderIntroduction,
    close: closeIntroduction
  };

  console.log(
    "✅ Introduction officielle Bo'CitéArt prête"
  );

})();
