
/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 3 — SYNOPTIQUE GÉNÉRAL

   FICHIER INDÉPENDANT :
   aucun onglet existant n'est modifié
   ========================================================= */

(function initBociteartSynoptique(){
 
  "use strict";

  if(window.BociteSynoptique){
    return;
  }

  const IMAGE_PATHS = [
    "./entreprise/bociteart-entreprise-synoptique.png",
    "./entreprise/entreprise/bociteart-entreprise-synoptique.png"
  ];

  function getElement(id){

    return document.getElementById(id);
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
      #bociteSynoptiqueOverlay {
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

      .bociteSynoptiqueNotice {
        margin-top:18px;
        padding:16px 14px;
        border-left:6px solid #2f5d46;
        background:#f6f2e9;
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

      #bociteSynoptiqueBackBtn {
        display:block;
        width:100%;
        margin-top:9px;
        padding:13px 12px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        color:#111;
        font-size:17px;
        font-weight:800;
        cursor:pointer;
        touch-action:manipulation;
      }

      @media (max-width:600px) {
        #bociteSynoptiqueOverlay {
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

        .bociteSynoptiqueNotice {
          font-size:15px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

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

<div id="bociteSynoptiqueError" style="display:none;"></div>

<div class="bociteSynoptiqueNotice" style="display:none;"></div>

<button
  id="bociteSynoptiqueContinueBtn"
  type="button">

  Choisir mon espace

</button>

<button
  id="bociteSynoptiqueBackBtn"
  type="button">

  Retour

</button>

</div>
`;
} 

  function removeSynoptique(){

    const overlay =
      getElement(
        "bociteSynoptiqueOverlay"
      );

    if(overlay){
      overlay.remove();
    }
  }

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

image.onerror = function(){

  currentPathIndex += 1;

  if(currentPathIndex < IMAGE_PATHS.length){

    image.src = IMAGE_PATHS[currentPathIndex];
    return;
  }

  console.warn(
    "Image du synoptique introuvable :",
    IMAGE_PATHS
  );

  /* On ne montre plus de message à l'utilisateur */

  image.style.display = "block";

  if(errorBox){
    errorBox.style.display = "none";
  }
};
 }    
  function continueJourney(){

    removeSynoptique();

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:open-profils"
      )
    );
  }

 function returnToIntroduction(){

  removeSynoptique();

  if(
    window.BociteIntroduction &&
    typeof window.BociteIntroduction.open ===
    "function"
  ){

    window.BociteIntroduction.open();
    return;
  }

  if(
    window.BociteStart &&
    typeof window.BociteStart.openIntroduction ===
    "function"
  ){

    window.BociteStart.openIntroduction();
  }
}
   
  function bindSynoptique(){

    const continueButton =
      getElement(
        "bociteSynoptiqueContinueBtn"
      );

    const backButton =
      getElement(
        "bociteSynoptiqueBackBtn"
      );

    if(continueButton){

      continueButton.onclick =
        continueJourney;
    }

    if(backButton){

   backButton.onclick =
  returnToIntroduction;

  }
     
    bindImage();
     
  }

  function openSynoptique(){

    installStyles();
    removeSynoptique();

    const overlay =
      document.createElement("div");

    overlay.id =
      "bociteSynoptiqueOverlay";

    overlay.innerHTML =
      getSynoptiqueHtml();

    document.body.appendChild(
      overlay
    );

    bindSynoptique();

    window.setTimeout(function(){

      overlay.scrollTop = 0;

    },0);
  }

  window.BociteSynoptique = {
    open:openSynoptique,
    close:removeSynoptique
  };

  document.addEventListener(
    "bociteart:open-synoptique",
    openSynoptique
  );

  console.log(
    "✅ Synoptique général Bo'CitéArt prêt"
  );

})();
