/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 1 — INTRODUCTION GÉNÉRALE

   Fichier indépendant.
   Aucun onglet existant n'est modifié.
   ========================================================= */

(function initBociteartIntroduction(){

  "use strict";

  if(window.BociteIntroduction){
    return;
  }

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
        position: fixed;
        inset: 0;
        z-index: 999999;
        overflow-y: auto;
        box-sizing: border-box;
        padding: 16px 10px 34px;
        background: #f1e5cf;
        color: #111;
        font-family: Arial, sans-serif;
      }

      #bociteIntroductionCard {
        width: 100%;
        max-width: 620px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 24px 18px;
        background: #f1e5cf;
        border: none;
        box-shadow: none;
      }

      .bociteIntroductionLogoBox {
        margin: 0 0 22px;
        text-align: center;
      }

      .bociteIntroductionLogoImage {
        display: block;
        width: 250px;
        max-width: 82%;
        height: auto;
        margin: 0 auto;
        object-fit: contain;
      }

      .bociteIntroductionSignature {
        margin-top: 24px;
        color: #111;
        line-height: 1.5;
        text-align: center;
      }

      .bociteIntroductionSignature div {
        margin: 6px 0;
        font-size: 21px;
        font-weight: 400;
      }

      .bociteIntroductionSeparator {
        width: 78px;
        height: 2px;
        margin: 24px auto;
        background: #2f5d46;
      }

      .bociteIntroductionActors {
        color: #111;
        font-size: 17px;
        line-height: 1.55;
      }

      .bociteIntroductionActors p {
        margin: 12px 0;
      }

      .bociteIntroductionFinalSentence {
        margin-top: 28px;
        color: #111;
        font-size: 17px;
        line-height: 1.55;
        font-weight: 400;
        text-align: center;
      }

      #bociteIntroductionStartBtn {
        display: block;
        width: 100%;
        margin-top: 24px;
        padding: 15px 12px;
        border: 2px solid #2f5d46;
        border-radius: 10px;
        background: #f1e5cf;
        color: #111;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        touch-action: manipulation;
      }

      #bociteIntroductionStartBtn:focus {
        outline: 3px solid rgba(47, 93, 70, 0.25);
      }

      @media (max-width: 600px) {

        #bociteIntroductionOverlay {
          padding: 9px 7px 26px;
        }

        #bociteIntroductionCard {
          padding: 21px 15px;
        }

        .bociteIntroductionLogoImage {
          width: 220px;
        }

        .bociteIntroductionSignature div {
          font-size: 19px;
        }

        .bociteIntroductionActors,
        .bociteIntroductionFinalSentence {
          font-size: 16px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function closeIntroduction(){

    const overlay =
      document.getElementById(
        "bociteIntroductionOverlay"
      );

    if(overlay){
      overlay.remove();
    }
  }

  function openLegalPage(){

    closeIntroduction();

    const event =
      new CustomEvent(
        "bociteart:open-legal"
      );

    window.dispatchEvent(event);
  }

  function renderIntroduction(){

    installStyles();
    closeIntroduction();

    const overlay =
      document.createElement("div");

    overlay.id =
      "bociteIntroductionOverlay";

    overlay.innerHTML = `
      <div id="bociteIntroductionCard">

        <div class="bociteIntroductionLogoBox">
          <img
            class="bociteIntroductionLogoImage"
            src="./entreprise/bociteart_logo.png"
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

        <div class="bociteIntroductionFinalSentence">
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
      document.getElementById(
        "bociteIntroductionStartBtn"
      );

    if(button){
      button.addEventListener(
        "click",
        openLegalPage
      );
    }
  }

  window.BociteIntroduction = {
    open: renderIntroduction,
    show: renderIntroduction,
    close: closeIntroduction
  };

  console.log(
    "✅ Introduction générale Bo'CitéArt prête"
  );

})();
