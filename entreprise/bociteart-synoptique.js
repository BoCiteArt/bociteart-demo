/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 4 — SYNOPTIQUE GÉNÉRAL

   CRÉATION DU COMPTE
   → SYNOPTIQUE
   → APPLICATION OFFICIELLE

   Ce fichier affiche uniquement le synoptique.
   Il ne décide jamais lui-même de la page suivante.
   ========================================================= */

(function initBociteartSynoptique(){

  "use strict";

  if(window.BociteSynoptique){
    return;
  }

  const OVERLAY_ID =
    "bociteSynoptiqueOverlay";

  const IMAGE_PATHS = [
    "./entreprise/bociteart-entreprise-synoptique.png?v=20260719-03",
    "./entreprise/entreprise/bociteart-entreprise-synoptique.png?v=20260719-03"
  ];

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
        "bociteSynoptiqueStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteSynoptiqueStyles";

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

      #bociteSynoptiqueCard {
        width:100%;
        max-width:760px;
        margin:0 auto;
        box-sizing:border-box;
        padding:22px 17px;
        border:2px solid #2f5d46;
        border-radius:15px;
        background:#fffdf7;
        box-shadow:0 8px 28px rgba(0,0,0,.13);
      }

      .bociteSynoptiqueTitle {
        margin:0;
        color:#111;
        font-size:28px;
        line-height:1.3;
        text-align:center;
      }

      .bociteSynoptiqueIntro {
        margin-top:16px;
        color:#111;
        font-size:17px;
        line-height:1.5;
        text-align:center;
      }

      .bociteSynoptiqueImageBox {
        margin-top:18px;
        overflow:hidden;
        border-radius:12px;
        background:#fff;
      }

      #bociteSynoptiqueImage {
        display:block;
        width:100%;
        height:auto;
      }

      #bociteSynoptiqueError {
        display:none;
        margin-top:16px;
        padding:16px 14px;
        border-left:6px solid #b00020;
        background:#f7f3ea;
        color:#111;
        font-size:16px;
        line-height:1.5;
      }

      #bociteSynoptiqueContinueBtn {
        display:block;
        width:100%;
        margin-top:20px;
        padding:15px 12px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fffdf7;
        color:#111;
        font-size:18px;
        font-weight:900;
        cursor:pointer;
        touch-action:manipulation;
      }

      #bociteSynoptiqueContinueBtn:hover,
      #bociteSynoptiqueContinueBtn:focus {
        background:#f6f2e9;
        outline:3px solid rgba(47,93,70,.16);
      }

      .bociteSynoptiqueNote {
        margin-top:15px;
        color:#333;
        font-size:14px;
        line-height:1.45;
        text-align:center;
      }

      @media(max-width:600px){

        #${OVERLAY_ID} {
          padding:9px 7px 26px;
        }

        #bociteSynoptiqueCard {
          padding:18px 12px;
          border-radius:12px;
        }

        .bociteSynoptiqueTitle {
          font-size:24px;
        }

        .bociteSynoptiqueIntro {
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

  function getSynoptiqueHtml(){

    return `
      <div id="bociteSynoptiqueCard">

        <h2 class="bociteSynoptiqueTitle">

          ${getLogoHtml()}
          en un coup d'œil

        </h2>

        <div class="bociteSynoptiqueIntro">

          Découvrez visuellement
          tout ce que l'application
          permet de relier
          dans un même territoire.

        </div>

        <div class="bociteSynoptiqueImageBox">

          <img
            id="bociteSynoptiqueImage"
            src="${IMAGE_PATHS[0]}"
            alt="Présentation générale des fonctions de Bo'CitéArt">

        </div>

        <div
          id="bociteSynoptiqueError"
          role="alert">

          Le synoptique n’a pas pu être affiché.

        </div>

        <button
          id="bociteSynoptiqueContinueBtn"
          type="button">

          Entrer dans l'application

        </button>

        <div class="bociteSynoptiqueNote">

          Vous allez maintenant arriver
          sur la page officielle de l'application Bo'CitéArt.

        </div>

      </div>
    `;
  }

  /* =====================================================
     OUVERTURE ET FERMETURE
     ===================================================== */

  function closeSynoptique(){

    const overlay =
      getElement(
        OVERLAY_ID
      );

    if(overlay){
      overlay.remove();
    }
  }

  function openSynoptique(){

    installStyles();
    closeSynoptique();

    const overlay =
      document.createElement("div");

    overlay.id =
      OVERLAY_ID;

    overlay.innerHTML =
      getSynoptiqueHtml();

    document.body.appendChild(
      overlay
    );

    bindSynoptique();

    overlay.scrollTop = 0;
  }

  /* =====================================================
     IMAGE
     ===================================================== */

  function bindImage(){

    const image =
      getElement(
        "bociteSynoptiqueImage"
      );

    const errorBox =
      getElement(
        "bociteSynoptiqueError"
      );

    if(!image){
      return;
    }

    let currentPathIndex = 0;

    image.onload =
      function(){

        image.style.display =
          "block";

        if(errorBox){

          errorBox.style.display =
            "none";
        }
      };

    image.onerror =
      function(){

        currentPathIndex += 1;

        if(
          currentPathIndex <
          IMAGE_PATHS.length
        ){

          image.src =
            IMAGE_PATHS[
              currentPathIndex
            ];

          return;
        }

        console.warn(
          "Image du synoptique introuvable :",
          IMAGE_PATHS
        );

        image.style.display =
          "none";

        if(errorBox){

          errorBox.style.display =
            "block";
        }
      };
  }

  /* =====================================================
     VALIDATION DE L'ÉTAPE
     ===================================================== */

  function completeSynoptique(){

    closeSynoptique();

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:synoptique-completed"
      )
    );
  }

  /* =====================================================
     ÉVÉNEMENTS
     ===================================================== */

  function bindSynoptique(){

    const continueButton =
      getElement(
        "bociteSynoptiqueContinueBtn"
      );

    if(continueButton){

      continueButton.onclick =
        completeSynoptique;
    }

    bindImage();
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteSynoptique = {
    open:
      openSynoptique,

    show:
      openSynoptique,

    close:
      closeSynoptique
  };

  console.log(
    "✅ Étape synoptique Bo'CitéArt V6 prête"
  );

})();
