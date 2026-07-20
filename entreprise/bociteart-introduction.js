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

  function getLogoHtml(){

    return `
      <span class="bociteIntroductionLogoGreen">
        Bo'Cité
      </span><span class="bociteIntroductionLogoRed">
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
        margin:0 0 26px;
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

      .bociteIntroductionLogoGreen {
        color:#315d46;
        font-weight:900;
      }

      .bociteIntroductionLogoRed {
        color:#b00020;
        font-weight:900;
      }

      .bociteIntroductionTitle {
        margin:0 0 19px;
        color:#111;
        font-size:25px;
        line-height:1.3;
        font-weight:800;
        text-align:center;
      }

      .bociteIntroductionNameMeaning {
        margin:0 auto;
        padding:18px 14px;
        border:2px solid #315d46;
        border-radius:12px;
        background:#fffdf7;
        color:#111;
        text-align:center;
      }

      .bociteIntroductionNameMeaningLine {
        margin:7px 0;
        font-size:19px;
        line-height:1.45;
      }

      .bociteIntroductionNameWord {
        font-size:24px;
        font-weight:900;
      }

      .bociteIntroductionNameGreen {
        color:#315d46;
      }

      .bociteIntroductionNameRed {
        color:#b00020;
      }

      .bociteIntroductionMeaning {
        font-size:16px;
        font-style:italic;
        font-weight:700;
      }

      .bociteIntroductionSeparator {
        width:74px;
        height:2px;
        margin:26px auto;
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
        margin:14px 0;
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
        margin-top:27px;
        padding:4px 8px;
        color:#111;
        font-size:18px;
        line-height:1.55;
        text-align:center;
      }

      .bociteIntroductionConclusionTitle {
        margin:0 0 15px;
        font-size:18px;
        font-weight:800;
      }

      .bociteIntroductionConclusion p {
        margin:12px 0;
        font-weight:700;
      }

      #bociteIntroductionContinueBtn {
        display:block;
        width:100%;
        margin-top:27px;
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

        .bociteIntroductionTitle {
          font-size:22px;
        }

        .bociteIntroductionNameMeaningLine {
          font-size:18px;
        }

        .bociteIntroductionNameWord {
          font-size:22px;
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
            src="./entreprise/bociteart_logo.png?v=20260720-01"
            alt="Logo officiel Bo'CitéArt">

        </div>

        <h2 class="bociteIntroductionTitle">
          Pourquoi ce nom ?
        </h2>

        <div class="bociteIntroductionNameMeaning">

          <div class="bociteIntroductionNameMeaningLine">
            Parce que rien n'est plus
          </div>

          <div class="bociteIntroductionNameMeaningLine">

            <span class="
              bociteIntroductionNameWord
              bociteIntroductionNameGreen
            ">
              Bo
            </span>

            <span class="bociteIntroductionMeaning">
              (Beau)
            </span>

          </div>

          <div class="bociteIntroductionNameMeaningLine">
            qu'une
          </div>

          <div class="bociteIntroductionNameMeaningLine">

            <span class="
              bociteIntroductionNameWord
              bociteIntroductionNameGreen
            ">
              Cité
            </span>

            <span class="bociteIntroductionMeaning">
              (ville)
            </span>

          </div>

          <div class="bociteIntroductionNameMeaningLine">
            révélée par
          </div>

          <div class="bociteIntroductionNameMeaningLine">

            <span class="
              bociteIntroductionNameWord
              bociteIntroductionNameRed
            ">
              l'Art.
            </span>

          </div>

        </div>

        <div class="bociteIntroductionSeparator"></div>

        <h2 class="bociteIntroductionTitle">

          À quoi sert
          ${getLogoHtml()} ?

        </h2>

        <div class="bociteIntroductionActors">

          <p>
            <span class="introBullet">–</span>

            <span>
              Les œuvres rapprochent les artistes et les habitants.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              L'école révèle les talents de demain.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              Les associations recréent du lien, l'entraide et les sourires.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              Les clubs sportifs gagnent en visibilité et trouvent de nouveaux partenaires et adhérents.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              Les commerces développent, fidélisent enfin durablement une clientèle perdue dans leur ville.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              Les entreprises trouvent enfin des outils incontournables pour être véritablement visibles, développer leur activité, recruter plus facilement leurs collaborateurs.
            </span>
          </p>

          <p>
            <span class="introBullet">–</span>

            <span>
              La mairie révèle ses trésors cachés, les talents, sa richesse mieux partagée, qui font la force de son territoire.
            </span>
          </p>

        </div>

        <div class="bociteIntroductionSeparator"></div>

        <div class="bociteIntroductionConclusion">

          <div class="bociteIntroductionConclusionTitle">
            ${getLogoHtml()}, c'est :
          </div>

          <p>
            Rallumer la lumière sur ce qui est dans l'ombre.
          </p>

          <p>
            Développer les richesses de votre territoire.
          </p>

          <p>
            Relier les citoyens et leur faire redécouvrir leur ville.
          </p>

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
    "✅ Étape introduction Bo'CitéArt officielle prête"
  );

})();
