/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 1 — INTRODUCTION GÉNÉRALE

   FICHIER INDÉPENDANT :
   aucune modification des onglets existants
   ========================================================= */

(function initBociteartIntroduction(){

  "use strict";

  if(window.BociteIntroduction){
    return;
  }

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
        padding:16px 10px 34px;
        background:#f1e5cf;
        color:#111;
        font-family:Arial, sans-serif;
      }

      #bociteIntroductionCard {
        width:100%;
        max-width:620px;
        margin:0 auto;
        box-sizing:border-box;
        padding:24px 18px;
        border:2px solid #2f5d46;
        border-radius:15px;
        background:#f1e5cf;
        border:none;
        box-shadow:none;
      }

      .bociteIntroductionLogo {
        margin:0;
        text-align:center;
        font-size:34px;
        line-height:1.2;
      }

      .bociteIntroductionSignature {
        margin-top:24px;
        text-align:center;
        color:#111;
        line-height:1.5;
      }

      .bociteIntroductionSignature div {
        margin:6px 0;
        font-size:21px;
      }

      .bociteIntroductionSignature strong {
      font-size:21px;
      font-weight:400;
}
      }

      .bociteIntroductionSeparator {
        width:78px;
        height:2px;
        margin:24px auto;
        background:#2f5d46;
      }

      .bociteIntroductionActors {
        color:#111;
        font-size:17px;
        line-height:1.55;
      }

      .bociteIntroductionActors p {
        margin:12px 0;
      }

      .bociteIntroductionConclusion {
        margin-top:25px;
        padding:17px 14px;
        border-left:6px solid #2f5d46;
        background:#f6f2e9;
        color:#111;
        font-size:20px;
        line-height:1.45;
        text-align:center;
      }

      #bociteIntroductionStartBtn {
        display:block;
        width:100%;
        margin-top:22px;
        padding:15px 12px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#f1e5cf;
        color:#111;
        font-size:18px;
        font-weight:900;
        cursor:pointer;
        touch-action:manipulation;
      }

      #bociteIntroductionStartBtn:focus {
        outline:3px solid rgba(47,93,70,.25);
      }

      @media (max-width:600px) {
        #bociteIntroductionOverlay {
          padding:9px 7px 26px;
        }

        #bociteIntroductionCard {
          padding:21px 15px;
          border-radius:12px;
        }

        .bociteIntroductionLogo {
          font-size:30px;
        }

        .bociteIntroductionSignature div {
          font-size:19px;
        }

        .bociteIntroductionSignature strong {
          font-size:22px;
        }

        .bociteIntroductionActors {
          font-size:16px;
        }

        .bociteIntroductionConclusion {
          font-size:18px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function getIntroductionHtml(){

    return `
      <div id="bociteIntroductionCard">

        <div
  style="
    text-align:center;
    margin-bottom:20px;
  ">

  <img
    src="/bociteart-demo/entreprise/bociteart-logo-officiel.png" 
    alt="Logo officiel Bo'CitéArt"
    style="
      display:block;
      width:210px;
      max-width:70%;
      height:auto;
      margin:0 auto;
    ">
</div>

        <div class="bociteIntroductionSignature">

          <div>
            Découvrir ce qui existe.
          </div>

          <div>
            <strong>
              RELIER les énergies.
            </strong>
          </div>

          <div>
            Faire vivre chaque territoire.
          </div>

        </div>

        <div class="bociteIntroductionSeparator">
        </div>

        <div class="bociteIntroductionActors">

          <p>
            Les œuvres rapprochent
            les artistes, les habitants.
          </p>

          <p>
            L'école révèle ses talents.
          </p>

          <p>
            Les associations rassemblent
            les sourires.
          </p>

          <p>
            Les clubs sportifs développent
            leurs forces et l'esprit d'équipe.
          </p>

          <p>
            Les commerces renforcent
            et fidélisent leur clientèle.
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

       <div
  style="
    margin-top:28px;
    color:#111;
    font-size:17px;
    line-height:1.55;
    font-weight:400;
  ">

  Bo'CitéArt relie les énergies
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

  function removeIntroduction(){

    const overlay =
      document.getElementById(
        "bociteIntroductionOverlay"
      );

    if(overlay){
      overlay.remove();
    }
  }

  function continueJourney(){

    removeIntroduction();

    /*
      Le fichier juridique écoutera cet événement.
      Aucun onglet existant n'est modifié.
    */

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:open-legal"
      )
    );
  }

  function openIntroduction(){

    installStyles();
    removeIntroduction();

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
        continueJourney;
    }

    window.setTimeout(function(){

      overlay.scrollTop = 0;

    },0);
  }

  window.BociteIntroduction = {
    open:openIntroduction,
    close:removeIntroduction
  };

  console.log(
    "✅ Introduction générale Bo'CitéArt prête"
  );

})();
