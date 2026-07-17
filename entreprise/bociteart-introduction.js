/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 1 — INTRODUCTION GÉNÉRALE

   FICHIER INDÉPENDANT :
   aucune modification des onglets existants

   Le véritable logo déjà présent dans l'application
   est réutilisé automatiquement.
   ========================================================= */

(function initBociteartIntroduction(){

  "use strict";

  if(window.BociteIntroduction){
    return;
  }

  function escapeHtml(value){

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function findExistingOfficialLogo(){

    const directSelectors = [
      "#bociteLogo",
      "#bociteartLogo",
      "#mainLogo",
      ".bocite-logo img",
      ".bociteart-logo img",
      ".logo img",
      "header img"
    ];

    for(
      let index = 0;
      index < directSelectors.length;
      index++
    ){

      const image =
        document.querySelector(
          directSelectors[index]
        );

      if(
        image &&
        image.tagName === "IMG" &&
        (image.currentSrc || image.src)
      ){
        return image.currentSrc || image.src;
      }
    }

    const images =
      Array.from(
        document.querySelectorAll("img")
      );

    const probableLogo =
      images.find(function(image){

        const information =
          String(
            (image.alt || "") +
            " " +
            (image.title || "") +
            " " +
            (image.currentSrc || image.src || "")
          )
            .toLowerCase()
            .normalize("NFD")
            .replace(
              /[\u0300-\u036f]/g,
              ""
            );

        return (
          information.includes("bocite") ||
          information.includes("bo-cite") ||
          information.includes("logo")
        );
      });

    if(probableLogo){

      return (
        probableLogo.currentSrc ||
        probableLogo.src ||
        ""
      );
    }

    return "";
  }

  function getOfficialLogoHtml(){

    const logoSource =
      findExistingOfficialLogo();

    if(logoSource){

      return `
        <img
          class="bociteIntroductionLogoImage"
          src="${escapeHtml(logoSource)}"
          alt="Logo officiel Bo'CitéArt">
      `;
    }

    /*
      Solution de secours uniquement si aucun logo
      déjà présent dans l'application n'est détecté.
    */

    return `
      <div class="bociteIntroductionLogoFallback">

        <span class="bociteIntroductionLogoGreen">
          Bo'Cité
        </span><span class="bociteIntroductionLogoRed">
          Art
        </span>

      </div>
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
        background:#f1e5cf;
        border:none;
        border-radius:15px;
        box-shadow:none;
      }

      .bociteIntroductionLogoBox {
        margin:0 0 20px;
        text-align:center;
      }

      .bociteIntroductionLogoImage {
        display:block;
        width:230px;
        max-width:76%;
        height:auto;
        margin:0 auto;
        object-fit:contain;
      }

      .bociteIntroductionLogoFallback {
        color:#111;
        font-size:34px;
        font-weight:900;
        line-height:1.15;
        text-align:center;
      }

      .bociteIntroductionLogoGreen {
        color:#2f5d46;
      }

      .bociteIntroductionLogoRed {
        color:#b00020;
        font-style:italic;
      }

      .bociteIntroductionSignature {
        margin-top:24px;
        color:#111;
        line-height:1.5;
        text-align:center;
      }

      .bociteIntroductionSignature div {
        margin:6px 0;
        font-size:21px;
        font-weight:400;
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

      .bociteIntroductionFinalSentence {
        margin-top:28px;
        color:#111;
        font-size:17px;
        line-height:1.55;
        font-weight:400;
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

        .bociteIntroductionLogoImage {
          width:195px;
        }

        .bociteIntroductionLogoFallback {
          font-size:30px;
        }

        .bociteIntroductionSignature div {
          font-size:19px;
        }

        .bociteIntroductionActors {
          font-size:16px;
        }

        .bociteIntroductionFinalSentence {
          font-size:16px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

    function renderIntroduction(){

    installStyles();

    const old =
      document.getElementById(
        "bociteIntroductionOverlay"
      );

    if(old){
      old.remove();
    }

    const overlay =
      document.createElement("div");

    overlay.id =
      "bociteIntroductionOverlay";

    overlay.innerHTML = `

      <div id="bociteIntroductionCard">

        <div class="bociteIntroductionLogoBox">

          ${getOfficialLogoHtml()}

        </div>

        <div class="bociteIntroductionSignature">

          <div>Découvrir ce qui existe.</div>

          <div>RELIER les énergies.</div>

          <div>Faire vivre chaque territoire.</div>

        </div>

        <div class="bociteIntroductionSeparator"></div>

        <div class="bociteIntroductionActors">

          <p>
            Les œuvres rapprochent les artistes,
            les habitants.
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

        <div class="bociteIntroductionSeparator"></div>

        <div class="bociteIntroductionFinalSentence">

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

    document.body.appendChild(
      overlay
    );

    document
      .getElementById(
        "bociteIntroductionStartBtn"
      )
      .addEventListener(
        "click",
        function(){

          overlay.remove();

          if(
            typeof window.dispatchEvent ===
            "function"
          ){

            window.dispatchEvent(
              new CustomEvent(
                "bociteart:open-legal"
              )
            );

            return;
          }

          if(
            typeof window.openLegalPage ===
            "function"
          ){

            window.openLegalPage();

            return;
          }

          if(
            typeof window.showLegalPage ===
            "function"
          ){

            window.showLegalPage();

            return;
          }

          console.log(
            "Étape suivante : ouverture de la page légale."
          );

        }
      );
  }

  window.BociteIntroduction = {

    open: renderIntroduction,

    show: renderIntroduction

  };

  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      renderIntroduction
    );

  }else{

    renderIntroduction();

  }

})(); 
