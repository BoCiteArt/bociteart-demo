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
    <span class="bociteIntroductionLogoGreen">Bo'Cité</span><span class="bociteIntroductionLogoRed">Art</span>
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
  margin:0 0 18px;
  color:#111;
  font-size:22px;
  line-height:1.3;
  font-weight:700;
  text-align:center;
}

      .bociteIntroductionNameMeaning {
        margin:0 auto;
        color:#111;
        text-align:center;
      }

      .bociteIntroductionNameMeaningLine {
        margin:0;
        font-size:18px;
        line-height:1.5;
      }

      .bociteIntroductionNameWord {
        font-weight:900;
      }

      .bociteIntroductionNameGreen {
        color:#315d46;
      }

      .bociteIntroductionNameRed {
        color:#b00020;
      }

      .bociteIntroductionMeaning {
        font-size:17px;
        font-style:italic;
        font-weight:400;
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
        margin-top:26px;
        color:#111;
        font-size:17px;
        line-height:1.6;
        text-align:left;
      }

     .bociteIntroductionConclusionTitle {
  margin:0 0 18px;
  color:#111;
  font-size:22px;
  line-height:1.3;
  font-weight:700;
  text-align:center;
}

      .bociteIntroductionConclusion p {
        display:flex;
        align-items:flex-start;
        gap:10px;
        margin:14px 0;
        font-weight:400;
        text-align:left;
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
          padding:18px 12px 24px;
        }

        .bociteIntroductionLogoImage {
          width:265px;
        }

        .bociteIntroductionTitle {
          font-size:22px;
        }

        .bociteIntroductionNameMeaningLine {
          width:100%;
          margin:0 auto;
          font-size:clamp(10px, 3vw, 15px);
          line-height:1.5;
          letter-spacing:-0.15px;
          white-space:nowrap;
          text-align:center;
        }

        .bociteIntroductionNameWord {
          font-size:inherit;
        }

        .bociteIntroductionMeaning {
          font-size:inherit;
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
          padding:0;
          font-size:16px;
        }

        .bociteIntroductionConclusionTitle {
          font-size:22px;
          line-height:1.3;
        }

        .bociteIntroductionConclusion p {
          gap:8px;
        }

        #bociteIntroductionContinueBtn {
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

/* =========================================================
   ÇA COMMENCE ICI
   INTRODUCTION GÉNÉRALE BO'CITÉART
   VERSION VALIDÉE 25/08/2026
   ========================================================= */

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
        Bienvenue dans ${getLogoHtml()}
      </h2>

      <div class="bociteIntroductionActors">

        <p>
          <span>
            Avant d’entrer, prenez simplement quelques instants pour lire cette introduction.
          </span>
        </p>

        <p>
          <span>
            ${getLogoHtml()} a été construit autour d’une idée simple :
          </span>
        </p>

        <p>
          <span>
            <strong>
              ce que nous regardons séparément peut parfois prendre un tout autre sens lorsqu’on commence à le regarder ensemble.
            </strong>
          </span>
        </p>

        <p>
          <span>
            Dans l’application, vous découvrirez plusieurs espaces, chacun accompagné de sa propre introduction.
          </span>
        </p>

        <p>
          <span>
            Chacune vous montrera un regard différent.
          </span>
        </p>

        <p>
          <span>
            Ne vous arrêtez pas seulement à celui qui vous concerne directement.
          </span>
        </p>

        <p>
          <span>
            En découvrant aussi la réalité des autres, certaines choses prendront progressivement un autre sens.
          </span>
        </p>

        <p>
          <span>
            <strong>
              C’est en reliant ces différents regards que l’ensemble commencera véritablement à se révéler.
            </strong>
          </span>
        </p>

        <p>
          <span>
            Vous n’avez rien à apprendre par cœur et aucun parcours ne vous sera imposé.
          </span>
        </p>

        <p>
          <span>
            Lors de votre première découverte, ces introductions vous seront présentées naturellement, au bon moment.
          </span>
        </p>

        <p>
          <span>
            Une fois lues, elles ne reviendront plus automatiquement.
          </span>
        </p>

        <p>
          <span>
            Vous pourrez simplement les relire plus tard, si vous le souhaitez, dans le petit onglet
            <strong>« Compte + aide »</strong>, situé en bas à droite de l’application, où vous trouverez également
            d’autres points utiles et importants pour <strong>mieux protéger votre accès, vous accompagner et découvrir
            progressivement les différents services mis à votre disposition.</strong>
          </span>
        </p>

        <p>
          <span>
            <strong>
              Ensemble, toutes ces introductions vous permettront peu à peu de faire la couture complète de ce nouveau monde qui se construit désormais avec vous.
            </strong>
          </span>
        </p>

        <p>
          <span>
            Ensuite, laissez votre curiosité, votre ressenti et votre intuition faire le reste.
          </span>
        </p>

      </div>

      <div class="bociteIntroductionSeparator"></div>

      <h2 class="bociteIntroductionTitle">
        Pourquoi certaines choses ne sont-elles pas expliquées ?
      </h2>

      <div class="bociteIntroductionActors">

        <p>
          <span>
            ${getLogoHtml()} souhaite permettre à chacun de comprendre son esprit, ce qu’il peut apporter et la place qu’il peut y trouver.
          </span>
        </p>

        <p>
          <span>
            Mais son fonctionnement repose aussi sur un savoir-faire qui doit rester protégé.
          </span>
        </p>

        <p>
          <span>
            Vous découvrirez donc les portes qui s’ouvrent, les possibilités et ce qu’elles peuvent apporter, sans que tous les mécanismes qui permettent d’y parvenir soient dévoilés.
          </span>
        </p>

        <p>
          <span>
            <strong>
              On montre les portes, on ne montre pas les engrenages.
            </strong>
          </span>
        </p>

        <p>
          <span>
            Il n’est donc pas nécessaire de tout comprendre maintenant.
          </span>
        </p>

        <p>
          <span>
            Au contraire.
          </span>
        </p>

        <p>
          <span>
            <strong>
              Entrez, découvrez, observez… et laissez peu à peu l’ensemble prendre son sens.
            </strong>
          </span>
        </p>

      </div>

      <button
        id="bociteIntroductionContinueBtn"
        type="button">

        Entrer dans Bo'CitéArt

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
