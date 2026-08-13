/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 1 — NAVIGATION ET ACCUEIL
========================================================= */
 
(function initBociteEntrepriseModule(){       
   
  "use strict";

  const MODULE_NAME = "entreprise";

  const state = {
    currentScreen:"home",
    previousScreen:null,
    history:["home"],
    renderingScreen:false,
    nestedParentScreen:null,
    goingBack:false
  };

  const screens = {};

  function getElement(id){
    return document.getElementById(id);
  }

  function safeEscape(value){
    if(typeof window.escapeHtml === "function"){
      return window.escapeHtml(value);
    }

    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function requireOpenModal(){

    if(typeof window.openModal !== "function"){

      console.error(
        "Bo'CitéArt Entreprise : window.openModal est introuvable."
      );

      alert(
        "L’espace Entreprise est momentanément indisponible."
      );

      return false;
    }

    return true;
  }

  function registerScreen(name, renderer){

    if(
      !name ||
      typeof renderer !== "function"
    ){
      return;
    }

    screens[name] = renderer;
  }

function openScreen(name, options){

  options = options || {};

  const renderer =
    screens[name];

  if(typeof renderer !== "function"){

    console.warn(
      "Écran Entreprise introuvable :",
      name
    );

    return;
  }

  const oldScreen =
    state.currentScreen;

  if(
    !options.fromBack &&
    oldScreen !== name
  ){

    const lastHistory =
      state.history.length
        ? state.history[
            state.history.length - 1
          ]
        : "";

    if(
      oldScreen &&
      lastHistory !== oldScreen
    ){
      state.history.push(oldScreen);
    }
  }

  state.previousScreen =
    oldScreen;

  state.currentScreen =
    name;

  state.nestedParentScreen =
    null;

  state.renderingScreen =
    true;

  try{

    renderer(options);

  }finally{

    window.setTimeout(function(){
      state.renderingScreen = false;
    },0);
  }
}

function goBack(){

  if(state.goingBack){
    return;
  }

  state.goingBack = true;

  try{

    /*
      Une fenêtre interne a été ouverte
      depuis une rubrique principale.
    */

    if(
      state.nestedParentScreen &&
      screens[state.nestedParentScreen]
    ){

      const parentScreen =
        state.nestedParentScreen;

      state.nestedParentScreen =
        null;

      openScreen(
        parentScreen,
        {
          fromBack:true
        }
      );

      return;
    }

    /*
      Retour à la rubrique précédente.
    */

    while(state.history.length){

      const previous =
        state.history.pop();

      if(
        previous &&
        previous !== state.currentScreen &&
        screens[previous]
      ){

        openScreen(
          previous,
          {
            fromBack:true
          }
        );

        return;
      }
    }

    /*
      Aucun historique :
      retour aux bandes Entreprise.
    */

    openScreen(
      "home",
      {
        fromBack:true
      }
    );

  }finally{

    window.setTimeout(function(){
      state.goingBack = false;
    },100);
  }
}

function returnToEntrepriseHome(){

  state.history = ["home"];
  state.previousScreen = null;
  state.nestedParentScreen = null;

  openScreen(
    "home",
    {
      fromBack:true
    }
  );
}

function buildBackButton(options){

  options = options || {};

  if(options.hideBack === true){
    return "";
  }

  return `
    <div
      class="bociteEntrepriseBackArea"
      style="
        display:flex;
        justify-content:flex-start;
        margin-bottom:16px;
      ">

      <button
        class="choiceBtn bociteEntrepriseProtectedBackBtn"
        type="button"
        style="
          width:auto;
          min-width:130px;
          margin:0;
        ">
        ← Retour
      </button>

    </div>
  `;
}
 
   function buildPresentationFooter(){
  return "";
}

function bindBackButton(){

  document
    .querySelectorAll(
      ".bociteEntrepriseProtectedBackBtn"
    )
    .forEach(function(button){

      button.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();

         /* =====================================================
   RETOUR DES 7 PAGES PRIVÉES
   → TABLEAU DE DIRECTION
   ===================================================== */

const directionScreens = [
  "annuaire",
  "collaborateurs",
  "publicite",
  "mutualisation",
  "emploi",
  "visibilite",
  "abonnement"
];

if(
  directionScreens.includes(
    state.currentScreen
  )
){

  if(
    typeof window.BociteEntreprise
      .openDirection ===
    "function"
  ){

    window.BociteEntreprise
      .openDirection();

    return;
  }

  if(
    screens.direction &&
    typeof screens.direction ===
    "function"
  ){

    openScreen(
      "direction",
      {
        fromBack:true
      }
    );

    return;
  }
}

        /*
  PAGE INTRODUCTION ENTREPRISE :
  retour à Commerces & Entreprises.
*/

if(
  state.currentScreen ===
  "introductionEntreprise"
){

  state.currentScreen = null;
  state.previousScreen = null;
  state.nestedParentScreen = null;
  state.history = ["home"];

  /*
    On quitte complètement le parcours Entreprise.
    L'ancien historique général des modales
    ne doit pas recréer son bouton "Retour"
    lors de la prochaine ouverture.
  */

  if(
    Array.isArray(
      window.modalHistory
    )
  ){
    window.modalHistory.length = 0;
  }

  if(
    typeof window.__bociteartOpenByKey ===
    "function"
  ){

    window.__bociteartOpenByKey(
      "commerces"
    );

    return;
  }

}
        /*
          SUR LA PAGE DES BANDES ENTREPRISE :
          retour à l'introduction Entreprise,
          sans fermer la fenêtre.
        */

    if(
  state.currentScreen === "home"
){

  if(
    screens.introductionEntreprise &&
    typeof screens.introductionEntreprise ===
    "function"
  ){

    openScreen(
      "introductionEntreprise",
      {
        fromBack:true
      }
    );

    return;
  }

}
        /*
          DANS LES SOUS-PAGES :
          retour normal à la page précédente.
        */

        goBack();

      };

    });

}
  function bindPresentationFooter(){

    document
      .querySelectorAll(
        ".entrepriseReturnToBandsBtn," +
        ".entreprisePresentationFooter"
      )
      .forEach(function(element){

        element.onclick = function(event){

          event.preventDefault();
          event.stopPropagation();

          returnToEntrepriseHome();
        };

        element.onkeydown = function(event){

          if(
            event.key === "Enter" ||
            event.key === " "
          ){

            event.preventDefault();

            returnToEntrepriseHome();
          }
        };
      });
  }

 function cleanEntrepriseModalPresentation(title){

  window.setTimeout(function(){

    /*
      1. Supprimer les anciens boutons Retour
      présents directement dans certaines pages.
      Le nouveau bouton général reste conservé.
    */

    document
      .querySelectorAll(
        "button, [role='button']"
      )
      .forEach(function(button){

        if(
          button.classList.contains(
            "bociteEntrepriseProtectedBackBtn"
          )
        ){
          return;
        }

        const text =
          String(
            button.textContent || ""
          )
          .replace(/\s+/g," ")
          .trim()
          .toLowerCase();

        if(
          text ===
            "← retour à commerces & entreprises" ||
          text ===
            "retour à commerces & entreprises" ||
          text ===
            "← retour à la page précédente" ||
          text ===
            "retour à la page précédente"
        ){
          button.remove();
        }
      });

    /*
      2. Toujours replacer la nouvelle page
      en haut de la fenêtre.
    */

    const dialogs =
      document.querySelectorAll(
        '[role="dialog"],' +
        '.modal,' +
        '.modal-content,' +
        '.modalContent,' +
        '.modal-body,' +
        '.modalBody'
      );

    dialogs.forEach(function(element){

      if(
        element.scrollHeight >
        element.clientHeight
      ){
        element.scrollTop = 0;
      }

      element
        .querySelectorAll("*")
        .forEach(function(child){

          if(
            child.scrollHeight >
            child.clientHeight &&
            (
              getComputedStyle(child)
                .overflowY === "auto" ||
              getComputedStyle(child)
                .overflowY === "scroll"
            )
          ){
            child.scrollTop = 0;
          }
        });
    });

    /*
      3. Présentation particulière
      de l’Observatoire et de l’Annuaire.
    */

    const normalizedTitle =
      String(title || "")
        .toLowerCase();

    const isEconomicPage =
      normalizedTitle.includes(
        "observatoire économique"
      ) ||
      normalizedTitle.includes(
        "annuaire économique"
      );

    if(isEconomicPage){

      document
        .querySelectorAll(
          ".entrepriseInfoBox," +
          ".observatoireReadableBox"
        )
        .forEach(function(box){

          box.style.fontWeight =
            "400";

          box.style.lineHeight =
            "1.65";
        });

      document
        .querySelectorAll(
          ".entrepriseInfoBox p," +
          ".entrepriseInfoBox div," +
          ".entrepriseInfoBox span," +
          ".observatoireReadableBox p," +
          ".observatoireReadableBox div"
        )
        .forEach(function(element){

          if(
            element.tagName !== "BUTTON" &&
            element.tagName !== "STRONG"
          ){
            element.style.fontWeight =
              "400";
          }
        });

      document
        .querySelectorAll(
          ".entrepriseInfoBox h2," +
          ".entrepriseInfoBox h3," +
          ".entrepriseInfoBox .sectionTitle," +
          ".observatoireReadableTitle"
        )
        .forEach(function(titleElement){

          titleElement.style.color =
            "#2f5d46";

          titleElement.style.fontWeight =
            "700";
        });

      /*
        Remise aux couleurs officielles
        des écritures Bo'CitéArt trouvées.
      */

      document
        .querySelectorAll(
          ".entrepriseInfoBox," +
          ".observatoireReadableBox"
        )
        .forEach(function(box){

          const walker =
            document.createTreeWalker(
              box,
              NodeFilter.SHOW_TEXT
            );

          const nodes = [];

          while(walker.nextNode()){
            nodes.push(
              walker.currentNode
            );
          }

          nodes.forEach(function(node){

            const value =
              node.nodeValue || "";

            if(
              !value.includes("Bo'CitéArt")
            ){
              return;
            }

            const parent =
              node.parentElement;

            if(
              !parent ||
              parent.closest(
                "button,script,style"
              )
            ){
              return;
            }

            const fragment =
              document.createDocumentFragment();

            const parts =
              value.split(
                "Bo'CitéArt"
              );

            parts.forEach(function(part,index){

              if(part){
                fragment.appendChild(
                  document.createTextNode(
                    part
                  )
                );
              }

              if(
                index <
                parts.length - 1
              ){

                const brand =
                  document.createElement(
                    "strong"
                  );

                brand.innerHTML =
                  '<span style="color:#2f5d46;">' +
                  "Bo'Cité" +
                  '</span>' +
                  '<span style="color:#c62828;">' +
                  "Art" +
                  '</span>';

                fragment.appendChild(
                  brand
                );
              }
            });

            node.parentNode.replaceChild(
              fragment,
              node
            );
          });
        });
    }

  },0);
}

function renderModal(title, html, options){

  options = options || {};

  if(!requireOpenModal()){
    return;
  }

  if(
    !state.renderingScreen &&
    state.currentScreen !== "home"
  ){
    state.nestedParentScreen =
      state.currentScreen;
  }

  const footer =
    options.presentationFooter
      ? buildPresentationFooter()
      : "";

  window.openModal(
    title,
    buildBackButton(options) +
    html +
    footer,
    {
      noHistory:true
    }
  );

  window.setTimeout(function(){

    bindBackButton();
    bindPresentationFooter();

    cleanEntrepriseModalPresentation(
      title
    );

  },0);
}

function getHomeHtml(){

  return `
    <style>
      @keyframes entrepriseBandScroll {
        from {
          transform:translateX(100%);
        }

        to {
          transform:translateX(-100%);
        }
      }

      #entrepriseHomeBands {
        display:flex;
        flex-direction:column;
        gap:7px;
        margin-top:10px;
      }

      #entrepriseHomeBands .entrepriseBand {
        display:block;
        position:relative;
        width:100%;
        height:50px;
        margin:0;
        padding:0;
        overflow:hidden;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fffaf1;
        color:#111;
        text-align:left;
        cursor:pointer;
        appearance:none;
        -webkit-appearance:none;
      }

      #entrepriseHomeBands .entrepriseBand:hover {
        background:#f8f2e7;
      }

      #entrepriseHomeBands .entrepriseBandText {
        display:inline-block;
        min-width:100%;
        padding:13px 0;
        white-space:nowrap;
        font-weight:900;
        color:#111;
        animation:
          entrepriseBandScroll
          85s
          linear
          infinite;
        animation-delay:0s;
        will-change:transform;
      }

      #entrepriseHomeBands .entrepriseBandAction {
        color:#b00020;
        font-weight:900;
      }

      #entrepriseHomeBands .entrepriseBandPrivate {
        border-color:#b00020;
        background:#fff7f7;
      }

      .entrepriseInfoBox {
        font-size:16px;
        line-height:1.7;
        color:#222;
        font-weight:400;
      }

      .entrepriseInfoBox p,
      .entrepriseInfoBox li {
        font-size:16px;
        line-height:1.7;
        font-weight:400;
      }

      .entrepriseInfoBox strong {
        font-weight:700;
      }
    </style>

  <!-- Bouton Retour géré automatiquement par buildBackButton() -->

    <div
      class="box entrepriseInfoBox"
      style="
        border-left:6px solid #2f5d46;
      ">

      <span
        style="
          display:block;
          color:#2f5d46;
          font-size:18px;
          font-weight:700;
        ">
        Développez votre entreprise grâce
        aux ressources de votre territoire
      </span>

      <br><br>

      <strong>
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c00020;">Art</span>
      </strong>

      réunit,
      dans un même espace,
      des services utiles pour :

      <br><br>

      <span style="font-weight:400;">
        • recruter plus facilement ;<br>
        • rechercher des entreprises et des compétences ;<br>
        • développer votre activité ;<br>
        • réduire certaines charges ;<br>
        • améliorer votre visibilité ;<br>
        • découvrir des opportunités professionnelles ;<br>
        • préparer l’avenir de votre entreprise ;<br>
        • comprendre et utiliser le mécénat.
      </span>

      <br><br>

      <span style="color:#2f5d46;font-weight:700;">
        Commencez par votre commune,
        puis élargissez votre recherche
        lorsque votre activité le nécessite.
      </span>

    </div>

    <div id="entrepriseHomeBands">

       <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="emploi">

        <span class="entrepriseBandText">
          Déposez votre offre
          • Trouvez la personne près de chez vous
          • Consultez les candidatures
          •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>

      </button>

      <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="fidelisation">

        <span class="entrepriseBandText">
          Attirez vos salariés
          • Fidélisez-les autrement
          • Faites connaître les services proches du travail
          •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>

      </button>

      <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="developpement">

        <span class="entrepriseBandText">
          Développez votre entreprise
          • Clients
          • Fournisseurs
          • Sous-traitants
          • Partenaires locaux
          •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>

      </button>

      <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="mutualisation">

        <span class="entrepriseBandText">
          Réduisez vos charges grâce à la mutualisation
          • Électricité
          • Gaz
          • Assurances
          • Téléphonie
          • Véhicules
          • Entretien
          • Formations
          • Comparez
          • Choisissez
          • Validez
          •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>

      </button>

      <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="visibilite">

        <span class="entrepriseBandText">
          Faites connaître votre entreprise
          • Vos métiers
          • Votre savoir-faire
          • Votre présence dans la ville
          •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>

      </button>

      <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="perennite">

        <span class="entrepriseBandText">
          Préparez l’avenir de votre entreprise
          • Transmission
          • Reprise
          • Continuité
          • Valorisation
          •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>

      </button>

      <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="mecenat">

        <span class="entrepriseBandText">
          Connaissez-vous réellement le mécénat ?
          • Soutien financier
          • Compétences
          • Matériel
          • Projets locaux
          •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>

      </button>

      <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="annuaire_local">

        <span class="entrepriseBandText">
          Découvrez les entreprises, commerces et artisans de votre commune
          • Trouvez un fournisseur
          • Un sous-traitant
          • Un partenaire
          • Des compétences près de chez vous
          •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>

      </button>

      <button
        class="entrepriseBand entrepriseBandPrivate"
        type="button"
        data-entreprise-screen="acces_partenaire">

        <span class="entrepriseBandText">
          Accès partenaire
          • Fiche entreprise
          • Tableau de Direction
          • Services privés
          • Factures
          •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>

      </button>

    </div>

    <div
      class="box entrepriseInfoBox"
      style="
        margin-top:14px;
        border-left:6px solid #2f5d46;
      ">

      <span
        style="
          display:block;
          color:#2f5d46;
          font-size:18px;
          line-height:1.4;
          font-weight:700;
        ">
        Choisissez le service correspondant
        à votre besoin dans les bandes défilantes
      </span>

      <br>

      Chaque proposition ci-dessus vous permet de mieux comprendre son impact pour votre entreprise.

      <br><br>

      Cliquez sur l'une des bandes de votre choix pour découvrir l'idée, la vision et l'impact de ce service, puis agir selon vos objectifs.

    </div>

        <div
      style="
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        margin:12px 0;
      ">

      <button
        class="choiceBtn"
        type="button"
        data-entreprise-screen="annuaire_local">
        Entreprises et commerces de ma ville
      </button>

      <button
        class="choiceBtn"
        type="button"
        data-entreprise-screen="annuaire">
        Recherche professionnelle
      </button>

    </div>
    
  `;
}

function synchronizeHomeBands(){

  const texts = document.querySelectorAll(
    "#entrepriseHomeBands .entrepriseBandText"
  );

  if(!texts.length){
    return;
  }

  texts.forEach(function(text){

    text.style.animation = "none";
    text.style.transform = "";

    void text.offsetWidth;

    text.style.animation =
      "entrepriseBandScroll 85s linear infinite";

    text.style.animationDelay = "-42.5s";
  });
}

function bindHomeButtons(){

  document
    .querySelectorAll(
      "#entrepriseHomeBands [data-entreprise-screen]," +
      "[data-entreprise-screen]"
    )
    .forEach(function(button){

      button.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();

        const screenName =
          button.getAttribute(
            "data-entreprise-screen"
          );

        openScreen(screenName);
      };
    });

  const aiButton =
    getElement("entrepriseAiAskBtn");

  if(aiButton){

    aiButton.onclick = function(){

      const input =
        getElement("entrepriseAiQuestion");

      const answer =
        getElement("entrepriseAiAnswer");

      const question =
        input
          ? String(input.value || "").trim()
          : "";

      if(!question){

        alert(
          "Écrivez votre question."
        );

        return;
      }

      if(
        typeof window.BociteEntreprise
          .runEnterpriseAssistant ===
        "function"
      ){

        window.BociteEntreprise
          .runEnterpriseAssistant(
            question,
            answer
          );

        return;
      }

      if(answer){

        answer.innerHTML = `
          <div class="box entrepriseInfoBox">

            Votre question a bien été enregistrée.

            <br><br>

            Bo'CitéArt recherchera d’abord
            les solutions disponibles
            dans votre ville,
            puis élargira progressivement
            la recherche lorsque cela sera nécessaire.

          </div>
        `;
      }
    };
  }

  synchronizeHomeBands();
}

function openHome(){

  state.currentScreen =
    "home";

  state.previousScreen =
    null;

  state.nestedParentScreen =
    null;

renderModal(
  "Commerces & Entreprises — Entreprise",
  getHomeHtml()
);

  window.setTimeout(function(){

    bindHomeButtons();

  },0);
}

function openWaitingScreen(
  screenName,
  screenTitle
){

  renderModal(
    screenTitle,
    `
      <div class="box entrepriseInfoBox">

        Cette rubrique sera intégrée
        dans la partie correspondante
        du module Entreprise.

      </div>
    `,
    {
      presentationFooter:true
    }
  );
}

registerScreen(
  "home",
  openHome
);

registerScreen(
  "annuaire_local",
  function(){

    if(
      typeof window.BociteEntreprise
        .openLocalDirectory ===
      "function"
    ){

      window.BociteEntreprise
        .openLocalDirectory();

      return;
    }

    openWaitingScreen(
      "annuaire_local",
      "Entreprises et commerces de votre ville"
    );
  }
);

registerScreen(
  "annuaire",
  function(){

    openWaitingScreen(
      "annuaire",
      "Recherche professionnelle"
    );
  }
);

registerScreen(
  "direction",
  function(){

    openWaitingScreen(
      "direction",
      "Tableau de Direction"
    );
  }
);

registerScreen(
  "emploi",
  function(){

    openWaitingScreen(
      "emploi",
      "Vous recherchez du personnel ?"
    );
  }
);

registerScreen(
  "fidelisation",
  function(){

    openWaitingScreen(
      "fidelisation",
      "Attirez et fidélisez vos salariés autrement"
    );
  }
);

registerScreen(
  "developpement",
  function(){

    openWaitingScreen(
      "developpement",
      "Développez votre entreprise"
    );
  }
);

registerScreen(
  "mutualisation",
  function(){

    openWaitingScreen(
      "mutualisation",
      "Réduisez vos charges"
    );
  }
);

registerScreen(
  "visibilite",
  function(){

    openWaitingScreen(
      "visibilite",
      "Faites connaître vos métiers et votre savoir-faire"
    );
  }
);

registerScreen(
  "perennite",
  function(){

    openWaitingScreen(
      "perennite",
      "Préparez l’avenir de votre entreprise"
    );
  }
);

registerScreen(
  "mecenat",
  function(){

    openWaitingScreen(
      "mecenat",
      "Connaissez-vous réellement le mécénat ?"
    );
  }
);

registerScreen(
  "acces_partenaire",
  function(){

    if(
      typeof window.BociteEntreprise
        .openPrivateEntrepriseAccess ===
      "function"
    ){

      window.BociteEntreprise
        .openPrivateEntrepriseAccess();

      return;
    }

    if(
      typeof window.BociteEntreprise
        .openPartnerAccess ===
      "function"
    ){

      window.BociteEntreprise
        .openPartnerAccess();

      return;
    }

    openWaitingScreen(
      "acces_partenaire",
      "Accès partenaire"
    );
  }
);

window.BociteEntreprise = {
  moduleName:MODULE_NAME,
  state:state,
  screens:screens,
  registerScreen:registerScreen,
  openScreen:openScreen,
  openHome:openHome,
  goBack:goBack,
  returnToEntrepriseHome:returnToEntrepriseHome,
  renderModal:renderModal,
  safeEscape:safeEscape
};

window.openEntrepriseHome =
  openHome;

console.log(
  "✅ Module Entreprise — partie 1 chargée"
);

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 2 — ANNUAIRE ET RECHERCHE LOCALE
   ========================================================= */

(function initBociteEntrepriseDirectory(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt Entreprise : la partie 1 doit être chargée avant la partie 2."
    );

    return;
  }

  const DIRECTORY_STORE_KEY =
    "bociteart_entreprise_directory_v1";

  function getElement(id){

    return document.getElementById(id);
  }

  function escapeValue(value){

    return module.safeEscape(value);
  }

  function loadDirectory(){

    try{

      const raw =
        localStorage.getItem(
          DIRECTORY_STORE_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(Array.isArray(parsed)){

        return parsed;
      }

    }catch(error){

      console.warn(
        "Lecture de l’annuaire économique impossible :",
        error
      );
    }

    return [];
  }

  function saveDirectory(companies){

    try{

      localStorage.setItem(
        DIRECTORY_STORE_KEY,
        JSON.stringify(
          Array.isArray(companies)
            ? companies
            : []
        )
      );

    }catch(error){

      console.warn(
        "Enregistrement de l’annuaire économique impossible :",
        error
      );
    }
  }

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );
  }

  function sortCompanies(companies){

    const companyList =
      Array.isArray(companies)
        ? companies
        : [];

    return companyList
      .slice()
      .sort(function(a,b){

        return String(
          a.name || ""
        ).localeCompare(
          String(
            b.name || ""
          ),
          "fr",
          {
            sensitivity:"base"
          }
        );
      });
  }

    function getDirectoryHtml(){

    return `
      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
          font-weight:400;
          color:#111;
          line-height:1.55;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:18px;
            font-weight:700;
            line-height:1.4;
          ">
          Un annuaire économique vivant
        </strong>

        <br>

        Connaissez-vous le nom de cinq entreprises
        présentes dans votre commune ?

        <br><br>

        <strong>
          Probablement pas.
        </strong>

        <br><br>

        Pourtant, des entreprises,
        des commerces,
        des artisans,
        des professions libérales
        et de nombreux savoir-faire
        sont déjà présents près de vous.

        <br><br>

        Avant de rechercher ailleurs,
        commencez par découvrir
        ce qui existe déjà dans votre commune.

      </div>

      <div
        class="box entrepriseInfoBox"
        style="
          font-weight:400;
          color:#111;
          line-height:1.55;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:18px;
            font-weight:700;
          ">
          À quoi sert cet annuaire ?
        </strong>

        <br>

        Il permettra de rechercher rapidement :

        <br><br>

        • une entreprise ;<br>
        • un commerce ;<br>
        • un artisan ;<br>
        • un métier ;<br>
        • un savoir-faire ;<br>
        • un produit ;<br>
        • un service ;<br>
        • un fournisseur ;<br>
        • un sous-traitant ;<br>
        • un partenaire professionnel.

        <br><br>

        Cette visibilité favorisera
        les recommandations,
        les demandes de devis,
        les recrutements,
        les partenariats
        et le développement de l’activité locale.

      </div>

      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
          font-weight:400;
          color:#111;
          line-height:1.55;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:18px;
            font-weight:700;
          ">
          Des informations issues de sources officielles
        </strong>

        <br>

        L’annuaire Bo'CitéArt sera alimenté
        lors de son raccordement
        aux données publiques officielles
        des entreprises françaises.

        <br><br>

        Chaque entreprise pourra ensuite
        compléter volontairement sa fiche,
        présenter son activité,
        ses services,
        ses recrutements
        et ses engagements locaux.

        <br><br>

        Aucune entreprise inventée
        n’est affichée dans cet annuaire.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          color:#111;
          line-height:1.55;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:18px;
            font-weight:700;
          ">
          Rechercher une entreprise,
          un métier ou un savoir-faire
        </strong>

        <br>

        Saisissez un nom,
        un métier,
        une activité,
        un produit
        ou un service.

        <br><br>

        <input
          id="entrepriseDirectorySearch"
          class="miniField"
          type="search"
          placeholder="Nom, métier, activité, produit ou service">

        <select
          id="entrepriseDirectoryFilter"
          class="miniField"
          style="margin-top:10px;">

          <option value="all">
            Toutes les entreprises
          </option>

          <option value="partner">
            Partenaires Bo'CitéArt
          </option>

          <option value="official">
            Référencement officiel
          </option>

        </select>

      </div>

      <div
        id="entrepriseDirectoryCount"
        class="muted"
        style="margin-top:10px;">
      </div>

      <div
        id="entrepriseDirectoryList"
        style="margin-top:10px;">
      </div>
    `;
  }

  function renderDirectoryList(){

    const input =
      getElement(
        "entrepriseDirectorySearch"
      );

    const filter =
      getElement(
        "entrepriseDirectoryFilter"
      );

    const list =
      getElement(
        "entrepriseDirectoryList"
      );

    const count =
      getElement(
        "entrepriseDirectoryCount"
      );

    if(!list){

      return;
    }

    const query =
      normalizeText(
        input ? input.value : ""
      );

    const filterValue =
      filter ? filter.value : "all";

    let companies =
      loadDirectory().filter(
        function(company){

          const searchable =
            normalizeText(
              [
                company.name,
                company.activity,
                company.description,
                company.city,
                company.address
              ].join(" ")
            );

          if(
            query &&
            !searchable.includes(query)
          ){

            return false;
          }

          if(
            filterValue === "partner" &&
            !company.partner
          ){

            return false;
          }

          if(
            filterValue === "official" &&
            company.partner
          ){

            return false;
          }

          return true;
        }
      );

    companies =
      sortCompanies(companies);

    if(count){

      count.textContent =
        companies.length
          ? companies.length +
            " entreprise(s) trouvée(s)."
          : "L’annuaire sera disponible après son raccordement officiel.";
    }

    if(!companies.length){

      list.innerHTML = `
        <div
          class="box"
          style="
            border-left:6px solid #2f5d46;
            font-weight:400;
            color:#111;
            line-height:1.55;
          ">

          L’annuaire économique Bo'CitéArt
          ne contient actuellement
          aucune entreprise enregistrée.

          <br><br>

          Les entreprises apparaîtront ici
          dès le raccordement officiel
          aux données publiques nationales.

          <br><br>

          Les outils de recherche,
          de filtrage
          et de consultation des fiches
          sont déjà préparés.

        </div>
      `;

      return;
    }

    list.innerHTML =
      companies.map(function(company){

        return `
          <div
            class="box"
            style="
              font-weight:400;
              color:#111;
              line-height:1.5;
            ">

            <strong
              style="
                display:block;
                color:#2f5d46;
                font-size:18px;
                font-weight:700;
                line-height:1.4;
              ">
              ${escapeValue(
                company.name || ""
              )}
            </strong>

            <div
              style="
                margin-top:9px;
                color:#2f5d46;
                font-size:16px;
                font-weight:600;
              ">
              ${escapeValue(
                company.activity || ""
              )}
            </div>

            <div style="margin-top:9px;">
              ${escapeValue(
                company.description || ""
              )}
            </div>

            ${
              company.city
                ? `
                  <div style="margin-top:9px;">

                    Commune :

                    <strong
                      style="
                        color:#2f5d46;
                        font-weight:600;
                      ">
                      ${escapeValue(
                        company.city
                      )}
                    </strong>

                  </div>
                `
                : ""
            }

            <button
              class="choiceBtn entrepriseOpenCompanyBtn"
              type="button"
              data-company-id="${escapeValue(
                company.id || ""
              )}"
              style="width:100%;margin-top:12px;">
              Consulter la fiche
            </button>

          </div>
        `;
      }).join("");

    list
      .querySelectorAll(
        ".entrepriseOpenCompanyBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          openCompanyCard(
            button.getAttribute(
              "data-company-id"
            )
          );
        };
      });
  }

  function bindDirectory(){

    const input =
      getElement(
        "entrepriseDirectorySearch"
      );

    const filter =
      getElement(
        "entrepriseDirectoryFilter"
      );

    if(input){

      input.oninput =
        renderDirectoryList;
    }

    if(filter){

      filter.onchange =
        renderDirectoryList;
    }

    renderDirectoryList();
  }

    function openDirectory(){

    module.renderModal(
      "Les entreprises de votre ville",
      getDirectoryHtml()
    );

    window.setTimeout(function(){

      bindDirectory();

    },0);
  }

  function openCompanyCard(companyId){

    const company =
      loadDirectory().find(function(item){

        return item.id === companyId;
      });

    if(!company){

      alert(
        "Cette entreprise est introuvable."
      );

      return;
    }

    const partnerContent =
      company.partner
        ? `
          <div
            class="box entrepriseInfoBox"
            style="
              font-weight:400;
              color:#111;
              line-height:1.55;
            ">

            <strong
              style="
                display:block;
                color:#2f5d46;
                font-size:18px;
                font-weight:700;
                line-height:1.4;
              ">
              Fiche Bo'CitéArt enrichie
            </strong>

            <div style="margin-top:14px;">

              Cette entreprise peut présenter
              ses services,
              ses réalisations,
              ses recrutements,
              ses actualités
              et ses engagements locaux.

            </div>

          </div>

          <div
            style="
              display:flex;
              gap:8px;
              flex-wrap:wrap;
            ">

            <button
              class="choiceBtn"
              id="companyRequestQuoteBtn"
              type="button">

              Demander un devis

            </button>

            <button
              class="choiceBtn"
              id="companyRecruitmentBtn"
              type="button">

              Recrutements

            </button>

          </div>
        `
        : `
          <div
            class="box entrepriseInfoBox"
            style="
              font-weight:400;
              color:#111;
              line-height:1.55;
            ">

            <strong
              style="
                display:block;
                color:#2f5d46;
                font-size:18px;
                font-weight:700;
                line-height:1.4;
              ">
              Informations publiques
            </strong>

            <div style="margin-top:14px;">

              Cette fiche reprend
              les informations publiques disponibles.

              <br><br>

              L’entreprise pourra compléter
              sa présentation,
              ses services,
              ses recrutements
              et ses engagements locaux
              depuis son espace professionnel.

            </div>

          </div>
        `;

    module.renderModal(
      company.name || "Fiche entreprise",
      `
        <div
          class="box entrepriseInfoBox"
          style="
            font-weight:400;
            color:#111;
            line-height:1.55;
          ">

          <strong
            style="
              display:block;
              color:#2f5d46;
              font-size:18px;
              font-weight:700;
              line-height:1.4;
            ">
            Que fait cette entreprise ?
          </strong>

          <div style="margin-top:14px;">

            ${escapeValue(
              company.description || ""
            )}

          </div>

        </div>

        <div
          class="box entrepriseInfoBox"
          style="
            font-weight:400;
            color:#111;
            line-height:1.55;
          ">

          <strong
            style="
              display:block;
              color:#2f5d46;
              font-size:18px;
              font-weight:700;
              line-height:1.4;
            ">
            Activité
          </strong>

          <div
            style="
              margin-top:10px;
              color:#111;
              font-weight:400;
            ">

            ${escapeValue(
              company.activity || ""
            )}

          </div>

          <strong
            style="
              display:block;
              margin-top:18px;
              color:#2f5d46;
              font-size:18px;
              font-weight:700;
              line-height:1.4;
            ">
            Commune
          </strong>

          <div
            style="
              margin-top:10px;
              color:#111;
              font-weight:400;
            ">

            ${escapeValue(
              company.city || ""
            )}

          </div>

        </div>

        ${partnerContent}
      `
    );

    window.setTimeout(function(){

      const quoteButton =
        getElement(
          "companyRequestQuoteBtn"
        );

      const recruitmentButton =
        getElement(
          "companyRecruitmentBtn"
        );

      if(quoteButton){

        quoteButton.onclick = function(){

          alert(
            "La demande de devis sera transmise depuis le compte sécurisé de l’utilisateur."
          );
        };
      }

      if(recruitmentButton){

        recruitmentButton.onclick = function(){

          module.openScreen(
            "emploi"
          );
        };
      }

    },0);
  }

     const originalHome =
    module.screens.home;

  module.registerScreen(
    "home",
    function(){

      originalHome();

      window.setTimeout(function(){

        if(
          typeof bindHomeAi ===
          "function"
        ){

          bindHomeAi();
        }

      },0);
    }
  );

  module.registerScreen(
    "annuaire",
    openDirectory
  );

  module.openCompanyCard =
    openCompanyCard;

  module.loadDirectory =
    loadDirectory;

  module.saveDirectory =
    saveDirectory;

  console.log(
    "✅ Module Entreprise — partie 2 chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 3 — EMPLOI ET FIDÉLISATION
   ========================================================= */

(function initBociteEntrepriseEmployment(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt Entreprise : les parties précédentes doivent être chargées."
    );

    return;
  }

  const EMPLOYMENT_STORE_KEY =
    "bociteart_entreprise_employment_v1";

  function getElement(id){

    return document.getElementById(id);
  }

  function escapeValue(value){

    return module.safeEscape(value);
  }

  function loadEmploymentData(){

    try{

      const raw =
        localStorage.getItem(
          EMPLOYMENT_STORE_KEY
        );

      const parsed =
        raw
          ? JSON.parse(raw)
          : null;

      if(
        parsed &&
        typeof parsed === "object"
      ){

        return {
          offers:
            Array.isArray(parsed.offers)
              ? parsed.offers
              : [],
          applications:
            Array.isArray(parsed.applications)
              ? parsed.applications
              : []
        };
      }

    }catch(error){

      console.warn(
        "Lecture des données emploi impossible :",
        error
      );
    }

    return {
      offers:[],
      applications:[]
    };
  }

  function saveEmploymentData(data){

    try{

      localStorage.setItem(
        EMPLOYMENT_STORE_KEY,
        JSON.stringify(data)
      );

    }catch(error){

      console.warn(
        "Enregistrement des données emploi impossible :",
        error
      );
    }
  }

  function createOfferId(){

    return (
      "OFFRE-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,7)
    );
  }

  /* =========================================================
   BO'CITÉART
   INTRODUCTION GÉNÉRALE - EMPLOI
   ========================================================= */

function getEmploymentIntroductionHtml(){

return `

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Tout commence bien avant le recrutement
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Une entreprise sera véritablement...
    <br>...comprise.
    <br>...connue.
    <br>...et reconnue.
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Si l'on comprend ce qu'elle fait...
    <br>Si l'on découvre ses métiers...
    <br>Si l'on identifie son savoir-faire...
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Alors chacun sait naturellement mieux en parler.
    <br>Les ambassadeurs naissent ainsi... naturellement.
    <br>Les regards changent.
    <br>Les idées s'ouvrent.
    <br>Les vocations apparaissent.
    <br>Les rencontres deviennent alors nettement plus naturelles.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Pourquoi tant de jeunes répondent-ils :
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    « Je ne sais pas... »
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Lorsqu'on demande à un enfant ou à un jeune :
    <br>« Que souhaites-tu faire plus tard ? »
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    La réponse est encore trop souvent :
    <br>« Je ne sais pas. »
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Comment choisir un métier...
    <br>...que l'on n'a jamais réellement découvert ?
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Découvrir fait naître l'envie
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Un livre explique...
    <br>Oui, mais !
    <br><br>
    Une vidéo montre...
    <br>Oui, mais !
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Une véritable visite fait vivre.
    <br>Elle s'imprime naturellement.
    <br>Elle s'imprime durablement.
    <br>Elle reste dans le cerveau.
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Entrer dans une entreprise.
    <br>Découvrir ses métiers.
    <br>Voir les équipes au travail.
    <br>Échanger avec des professionnels.
    <br>Comprendre leur quotidien.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    On retient durablement ce que l'on a vécu.
    <br>Une visite n'apprend pas seulement un métier.
    <br>Elle ouvre le champ des possibles.
    <br>C'est là que naît une vocation.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    L'école devient un véritable trait d'union
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Les visites deviennent le berceau du concret.
    <br>Les métiers prennent vie.
    <br>Les élèves imaginent leur avenir.
    <br>Ils découvrent que leur futur existe déjà autour d'eux.
    <br>Ils découvrent des opportunités à quelques minutes de chez eux.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Toute personne découvrant réellement une entreprise devient naturellement son ambassadeur.
    <br>L'entreprise imprime durablement son image dans l'esprit des jeunes, de leurs familles, de la commune et de son territoire.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Les entreprises y gagnent aussi
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Elles ne présentent plus uniquement un poste.
    <br>Elles font découvrir leur univers.
    <br>Leurs métiers.
    <br>Leurs équipes.
    <br>Leurs savoir-faire.
    <br>Leurs valeurs.
    <br>Leur engagement.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Ainsi, leurs recrutements commencent bien avant leurs besoins.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Les commerces aussi
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Combien d'entreprises connaissent réellement les commerces qui les entourent ?
    <br>Et inversement ?
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Ils partagent pourtant le même territoire.
    <br>Mieux se connaître crée naturellement de nouveaux clients.
    <br>De nouveaux fournisseurs.
    <br>De nouveaux partenaires.
    <br>De nouvelles opportunités.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span> change le point de départ
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Avant de rechercher un salarié...
    <br>commençons par faire découvrir l'entreprise.
    <br><br>
    Avant de rechercher une orientation...
    <br>commençons par faire découvrir les métiers.
    <br><br>
    Avant de rechercher un partenaire...
    <br>commençons par faire se rencontrer les acteurs.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Le reste devient nettement plus simple.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Le recrutement devient une conséquence
  </h2>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Les offres d'emploi.
    <br>Les candidatures spontanées.
    <br>Les stages.
    <br>Les alternances.
    <br>Les apprentissages.
    <br>...reposent désormais sur un territoire qui se connaît.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span> est le pont
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span> est une méthode simple, frappée de bon sens, qui remet naturellement en relation ce que nous avons progressivement appris à séparer.
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span> relie durablement les habitants.
    <br>Les écoles.
    <br>Les commerces.
    <br>Les entreprises.
    <br>Les associations.
    <br>Les collectivités.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Les rencontres se multiplient.
    <br>Les vocations naissent.
    <br>Les partenariats se développent.
    <br>Les opportunités grandissent.
    <br>Le territoire se renforce.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Combien de bouteilles avez-vous déjà jetées à la mer ?
  </h2>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Combien de candidatures sont restées sans réponse ?
    <br>Combien de fois avez-vous entendu :
    <br>« Ça ne sert à rien d'envoyer un CV... personne ne répond. »
    <br>Quel gâchis... pour les deux parties !
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Pourquoi ?
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Le problème ne commence pas avec la candidature.
    <br>Il commence bien avant.
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Aujourd'hui, tout va très vite.
    <br>Une commande arrive.
    <br>Un salarié quitte l'entreprise.
    <br>Un marché s'ouvre.
    <br>Vite... il faut recruter !
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Les annonces sont publiées partout.
    <br>Les réseaux sont sollicités.
    <br>Les plateformes sont consultées.
    <br>En espérant trouver rapidement la bonne personne.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Puis vient la frustration
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    L'entreprise dit :
    <br>« Je manque de bras. »
    <br>« Je ne trouve personne. »
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Pendant ce temps, les candidats envoient leurs CV, attendent une réponse...
    <br>et finissent souvent par perdre espoir.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Combien de bouteilles continuent ainsi d'être jetées à la mer...
    <br>des deux côtés ?
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Le constat est sans appel
  </h2>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    On recrute dans l'urgence.
    <br>On forme dans l'urgence.
    <br>On recommence dans l'urgence.
    <br>Le salarié doute.
    <br>L'entreprise recommence.
    <br>Le cercle se répète.
    <br>Tout le monde perd du temps.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span> vous a déjà montré les causes
  </h2>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Vous connaissez maintenant les conséquences.
    <br>Découvrons la solution.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Le véritable fossé est ici
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Une entreprise qui se fait véritablement connaître construit durablement son image.
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Les habitants savent qui elle est,
    <br>où elle se situe,
    <br>ce qu'elle fait
    <br>et les métiers qu'elle propose.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Elle devient une entreprise que l'on comprend,
    <br>que l'on connaît...
    <br>et que l'on choisit.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Les candidatures changent alors de nature
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Le candidat choisit une entreprise qu'il connaît.
    <br>Il comprend son activité.
    <br>Il connaît ses métiers.
    <br>Il sait pourquoi il souhaite la rejoindre.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    L'entreprise comprend immédiatement pourquoi cette candidature lui est adressée.
    <br>La confiance est déjà installée des deux côtés.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    L'entreprise prépare alors bien mieux son avenir
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Elle attire davantage de candidatures de qualité.
    <br>Elle développe son image,
    <br>sa réputation
    <br>et sa notoriété.
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Elle inspire davantage confiance.
    <br>Elle attire naturellement de nouveaux clients,
    <br>de nouveaux partenaires
    <br>et de nouvelles opportunités.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Son carnet de commandes se développe plus sereinement.
    <br>Les recrutements deviennent alors plus naturels...
    <br>et beaucoup moins dans l'urgence.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    La candidature continue de vivre
  </h2>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Le candidat conserve l'historique de toutes ses démarches.
    <br>L'entreprise conserve son portefeuille de candidats.
    <br>Chacun retrouve facilement ses échanges depuis son téléphone.
    <br>Une réponse est apportée.
    <br>Le respect s'installe.
    <br>La confiance grandit.
    <br>La rencontre continue de vivre dans le temps.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Deux possibilités. Un seul objectif.
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Vous connaissez déjà l'entreprise ?
    <br>Rendez-vous directement dans <strong>Candidature spontanée</strong>.
    <br>Complétez librement votre demande.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    L'entreprise n'est pas encore présente dans l'annuaire ?
    <br>Aucun problème.
    <br>Vous pouvez saisir vous-même les informations dont vous disposez.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Vous recherchez une entreprise ?
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Consultez simplement l'annuaire
    <strong><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span></strong>,
    classé par métiers et par activités.
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Faites défiler les entreprises jusqu'à trouver celle qui correspond à vos compétences,
    à votre projet ou à votre talent.
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Depuis sa fiche, cliquez sur :
    <br><strong>Déposer une candidature spontanée.</strong>
  </p>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Le formulaire s'ouvre automatiquement.
    <br>Lors de votre première candidature, vous complétez votre fiche.
    <br>Par la suite,
    <strong><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span></strong>
    retrouve automatiquement vos informations
    et préremplit le formulaire.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Vous pouvez toujours les modifier avant l'envoi.
    <br>En quelques secondes...
    <br>votre candidature est prête à être transmise
    à l'entreprise choisie.
  </p>

</div>
<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Dans les deux cas...
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Vous retrouvez :
    <br>Le même formulaire.
    <br>Le même historique.
    <br>Les mêmes informations personnelles automatiquement retrouvées lors de vos prochaines candidatures.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    <strong><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span></strong>
    supprime ainsi les recherches inutiles
    et vous permet de passer immédiatement à l'essentiel :
    proposer votre candidature à l'entreprise de votre choix.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Les bénéfices deviennent concrets
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Le candidat trouve plus facilement une entreprise proche de chez lui.
    <br>Il réduit parfois ses déplacements.
    <br>Il gagne du temps.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    L'entreprise stabilise davantage ses équipes
    et poursuit plus sereinement son développement.
    <br>Tout le monde avance enfin dans la même direction.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span> ouvre le champ des possibles
  </h2>

  <p style="margin:0 0 14px 0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Envoyer rapidement une candidature.
    <br>Recevoir systématiquement une réponse.
    <br>Retrouver l'historique de ses échanges.
    <br>Construire un véritable portefeuille de candidats.
    <br>Développer durablement la notoriété de son entreprise.
    <br>Créer davantage de confiance.
    <br>Attirer naturellement de nouvelles compétences.
  </p>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    On ne recrute jamais durablement par hasard.
    <br>On recrute durablement parce que l'on s'est d'abord fait connaître,
    comprendre...
    puis reconnaître.
  </p>

</div>

<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Découvrons maintenant pourquoi fidéliser devient aussi important que recruter.
  </h2>

  <p style="margin:0;font-size:14px;font-weight:400;line-height:1.6;color:#000;">
    Recruter répond à un besoin.
    <br><br>
    Fidéliser construit durablement l'avenir.
  </p>

</div>

<div
  style="
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:10px;
    margin-top:24px;
  ">

  <button
    id="employmentIntroductionHomeBtn"
    class="choiceBtn"
    type="button"
    style="
      width:100%;
      max-width:430px;
    ">
    Découvrir l’espace Emploi et Recrutement
  </button>

  <button
    class="choiceBtn"
    type="button"
    onclick="openEmploymentCompaniesDirectory();"
    style="
      width:100%;
      max-width:430px;
    ">
    Découvrir les entreprises autour de moi
  </button>

</div>

`;

}
      
function openEmploymentIntroduction(){

  module.renderModal(
    "Bo'CitéArt — Emploi • Recrutement",
    getEmploymentIntroductionHtml()
  );

  window.setTimeout(function(){

    const employmentButton =
      getElement(
        "employmentIntroductionHomeBtn"
      );

 const directoryButton =
  getElement(
    "employmentIntroductionDirectoryBtn"
  );

if(employmentButton){

  employmentButton.onclick = function(){

    module.openScreen(
      "emploi_home"
    );
  };
}

if(directoryButton){

  directoryButton.onclick = function(){

    openEmploymentCompaniesDirectory();
  };
}
     
  },0);
}
   
function openEmploymentHome(){

  module.renderModal(
    "Emploi dans votre ville",
    getEmploymentHomeHtml()
  );

  window.setTimeout(function(){

    bindEmploymentHome();

    document
      .querySelectorAll(
        ".modal-body," +
        ".modalBody," +
        ".modal-content," +
        ".modalContent," +
        '[role="dialog"]'
      )
      .forEach(function(element){

        element.scrollTop = 0;
      });

  },0);
}

function openEmploymentCompaniesDirectory(){

  if(
    typeof module.openLocalDirectory ===
    "function"
  ){

    module.openLocalDirectory();

    return;
  }

  module.openScreen(
    "annuaire_local"
  );
}  
function getEmploymentHomeHtml(){

  const data =
    loadEmploymentData();

  const activeOffers =
    data.offers.filter(function(offer){

      return (
        offer.status === "publiee" ||
        offer.status === "modifiee" ||
        offer.status === "published"
      );
    });

const titleStyle = `
  color:#2f5d46;
  font-size:16px;
  font-weight:700;
  line-height:1.45;
`;

const textStyle = `
  color:#111;
  font-size:14px;
  font-weight:400;
  line-height:1.55;
`;

return `

  <div
    class="box entrepriseInfoBox"
    style="
      border-left:6px solid #2f5d46;
      ${textStyle}
    ">

    <div style="${titleStyle}">
      Trouvez un emploi,
      un stage
      ou une alternance près de chez vous
    </div>

    <br>

    <div style="${textStyle}">
      Les entreprises de votre ville
      peuvent publier ici leurs besoins
      en recrutement.

      <br><br>

      Les habitants peuvent consulter gratuitement
      les offres disponibles
      et transmettre leur candidature
      directement à l’entreprise concernée.
    </div>

  </div>

  <div
    class="box entrepriseInfoBox"
    style="${textStyle}">

    <div style="${titleStyle}">
      Pourquoi recruter localement ?
    </div>

    <br>

    <div style="${textStyle}">
      Les compétences recherchées
      sont parfois déjà présentes
      dans votre commune
      ou dans les communes voisines.

      <br><br>

      Une personne qui travaille près de chez elle
      réduit ses déplacements,
      ses frais
      et le temps passé sur la route.

      <br><br>

      L’entreprise améliore également
      son ancrage local
      et sa connaissance auprès des habitants.
    </div>

  </div>

  <div
    class="box entrepriseInfoBox"
    style="
      border-left:6px solid #2f5d46;
      ${textStyle}
    ">

    <div style="${titleStyle}">
      Aucune offre ne correspond actuellement ?
    </div>

    <div
      style="
        margin-top:14px;
        ${textStyle}
      ">

      Le citoyen peut envoyer une candidature spontanée
      à une entreprise de sa ville,
      même si celle-ci n’a pas encore publié d’offre.

      <br><br>

      La candidature reste conservée
      dans l’espace privé de l’entreprise.

      <br><br>

      Elle pourra ainsi retrouver le candidat
      plusieurs mois plus tard,
      lorsqu’un nouveau besoin apparaîtra.

      <br><br>

      Grâce à

      <strong>
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
      </strong>,

      les habitants disposent également
      d’une vision plus précise
      des entreprises,
      des commerces,
      des artisans
      et des savoir-faire présents dans leur ville.

      <br><br>

      Cette meilleure connaissance réciproque
      permet aux habitants
      et aux professionnels
      de mieux se connaître,
      de renforcer leurs échanges
      et de devenir durablement
      plus connectés les uns aux autres.

    </div>

  </div>

  <div
    class="box entrepriseInfoBox"
    style="
      border-left:6px solid #2f5d46;
      ${textStyle}
    ">

    <div style="${titleStyle}">
      Offres actuellement disponibles
    </div>

    <br>

    <div style="${textStyle}">
      Nombre d’offres ouvertes :

      <span
        style="
          color:#2f5d46;
          font-size:18px;
          font-weight:700;
        ">
        ${activeOffers.length}
      </span>
    </div>

  </div>

  <div
    style="
      display:flex;
      gap:8px;
      flex-wrap:wrap;
    ">

    <button
      class="choiceBtn"
      id="employmentViewOffersBtn"
      type="button">
      Consulter toutes les offres
    </button>

    <button
      class="choiceBtn"
      id="employmentSpontaneousBtn"
      type="button">
      Envoyer une candidature spontanée
    </button>

    <button
      class="choiceBtn"
      id="employmentLocalCompaniesBtn"
      type="button">
      Voir les entreprises de ma ville
    </button>

  </div>

  <div
    class="box entrepriseInfoBox"
    style="
      margin-top:16px;
      border-left:6px solid #b00020;
      ${textStyle}
    ">

    <div style="${titleStyle}">
      Espace réservé à l’entreprise
    </div>

    <br>

    <div style="${textStyle}">
      La publication d’une offre,
      sa modification,
      sa clôture
      et l’historique des candidatures
      sont accessibles uniquement
      depuis l’espace professionnel privé.

      <br><br>

      Une entreprise doit clôturer son annonce
      dès que le poste est pourvu.

      <br><br>

      Cela évite les annonces fantômes
      et respecte le temps des candidats.
    </div>

  </div>

  <div
    style="
      display:flex;
      gap:8px;
      flex-wrap:wrap;
    ">

    <button
      class="choiceBtn"
      id="employmentCreateOfferBtn"
      type="button">
      Publier une offre
    </button>

    <button
      class="choiceBtn"
      id="employmentApplicationsBtn"
      type="button">
      Historique des candidatures
    </button>

    <button
      class="choiceBtn"
      id="employmentDirectionBtn"
      type="button">
      Tableau de Direction
    </button>

  </div>
`;
}

   function bindEmploymentHome(){
   
    const createButton =
      getElement(
        "employmentCreateOfferBtn"
      );

    const offersButton =
      getElement(
        "employmentViewOffersBtn"
      );

    const applicationsButton =
      getElement(
        "employmentApplicationsBtn"
      );

    const spontaneousButton =
      getElement(
        "employmentSpontaneousBtn"
      );

    const companiesButton =
      getElement(
        "employmentLocalCompaniesBtn"
      );

    const directionButton =
      getElement(
        "employmentDirectionBtn"
      );

    if(createButton){

      createButton.onclick = function(){

        if(
          typeof module.requirePrivateAccess ===
          "function"
        ){

          module.requirePrivateAccess(
            openEmploymentForm
          );

          return;
        }

        openEmploymentForm();
      };
    }

    if(offersButton){

      offersButton.onclick = function(){

        openEmploymentOffers();
      };
    }

    if(applicationsButton){

      applicationsButton.onclick = function(){

        if(
          typeof module.requirePrivateAccess ===
          "function"
        ){

          module.requirePrivateAccess(
            openEmploymentApplications
          );

          return;
        }

        openEmploymentApplications();
      };
    }

    if(spontaneousButton){

      spontaneousButton.onclick = function(){

        if(
          typeof module.openLocalDirectory ===
          "function"
        ){

          module.openLocalDirectory({
            spontaneousApplication:true
          });

          return;
        }

        module.openScreen(
          "annuaire_local"
        );
      };
    }

    if(companiesButton){

      companiesButton.onclick = function(){

        if(
          typeof module.openLocalDirectory ===
          "function"
        ){

          module.openLocalDirectory();

          return;
        }

        module.openScreen(
          "annuaire_local"
        );
      };
    }

    if(directionButton){

      directionButton.onclick = function(){

        if(
          typeof module.requirePrivateAccess ===
          "function"
        ){

          module.requirePrivateAccess(
            function(){

              module.openScreen(
                "direction"
              );
            }
          );

          return;
        }

        module.openScreen(
          "direction"
        );
      };
    }
  }

function openEmployment(){

  openEmploymentIntroduction();

}

  function openEmploymentForm(){

    module.renderModal(
      "Publier une offre d’emploi",
      `
        <div class="box entrepriseInfoBox">

          <strong>
            Informations sur l’entreprise
          </strong>

          <br><br>

          Les données professionnelles
          et le contact
          doivent être vérifiés
          avant publication.

        </div>

        <label
          style="
            font-weight:900;
          ">
          Nom de l’entreprise
        </label>

        <input
          id="employmentCompanyName"
          class="miniField"
          type="text"
          placeholder="Nom de l’entreprise">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          SIRET ou SIREN
        </label>

        <input
          id="employmentCompanyId"
          class="miniField"
          type="text"
          placeholder="SIRET ou SIREN">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Adresse e-mail de contact
        </label>

        <input
          id="employmentContactEmail"
          class="miniField"
          type="email"
          placeholder="Adresse professionnelle ou personnelle autorisée">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Intitulé du poste
        </label>

        <input
          id="employmentJobTitle"
          class="miniField"
          type="text"
          placeholder="Exemple : électricien, secrétaire, vendeur">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Description de l’offre
        </label>

        <textarea
          id="employmentDescription"
          class="miniField"
          style="
            min-height:130px;
          "
          placeholder="Missions, expérience, horaires, contrat, lieu de travail"></textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Type de contrat
        </label>

        <select
          id="employmentContractType"
          class="miniField">

          <option value="CDI">
            CDI
          </option>

          <option value="CDD">
            CDD
          </option>

          <option value="Interim">
            Intérim
          </option>

          <option value="Stage">
            Stage
          </option>

          <option value="Alternance">
            Alternance
          </option>

          <option value="Autre">
            Autre
          </option>

        </select>

      <label
  style="
    display:block;
    margin-top:10px;
    font-weight:900;
  ">
  Commune du poste
</label>

<input
  id="employmentCity"
  class="miniField"
  type="text"
  autocomplete="address-level2"
  placeholder="Indiquez la commune du poste"
  required>

<div
  class="muted"
  style="
    margin-top:7px;
    color:#555;
    font-size:14px;
    line-height:1.5;
  ">
  Indiquez uniquement la commune dans laquelle
  le poste est proposé.
  Aucune adresse personnelle n’est demandée.
</div>

        <div
          class="box entrepriseInfoBox"
          style="
            margin-top:12px;
          ">

          <strong>
            Publication ponctuelle
          </strong>

          <br><br>

          Tarif professionnel prévu :

          <strong>
            50 € HT
          </strong>.

          <br><br>

          La diffusion définitive sera activée
          après confirmation du paiement.

        </div>

        <label class="miniCheck">

          <input
            id="employmentCommitmentCheck"
            type="checkbox">

          <span>
            Je m’engage à clôturer cette offre
            dès que le poste est pourvu.
          </span>

        </label>

        <button
          id="employmentSaveOfferBtn"
          class="choiceBtn"
          type="button"
          style="
            margin-top:14px;
            width:100%;
          ">
          Enregistrer l’offre
        </button>
      `
    );

    window.setTimeout(function(){

      const saveButton =
        getElement(
          "employmentSaveOfferBtn"
        );

      if(saveButton){

        saveButton.onclick =
          saveEmploymentOffer;
      }

    },0);
  }
   
/* =========================================================
   BO'CITÉART — EMPLOI • RECRUTEMENT
   PAIEMENT DE L'ANNONCE ET FACTURE ACQUITTÉE
   ========================================================= */

const EMPLOYMENT_OFFER_PRICE_HT =
  50;

/*
  Modifier uniquement cette valeur
  si le taux de TVA de Bo'CitéArt évolue.
*/

const BOCITEART_VAT_RATE =
  20;

function formatEmploymentMoney(value){

  return Number(value || 0)
    .toLocaleString(
      "fr-FR",
      {
        minimumFractionDigits:2,
        maximumFractionDigits:2
      }
    );
}

function saveEmploymentOffer(){

  const companyName =
    String(
      getElement("employmentCompanyName")
        ? getElement("employmentCompanyName").value
        : ""
    ).trim();

  const companyId =
    String(
      getElement("employmentCompanyId")
        ? getElement("employmentCompanyId").value
        : ""
    ).trim();

  const email =
    String(
      getElement("employmentContactEmail")
        ? getElement("employmentContactEmail").value
        : ""
    ).trim();

  const title =
    String(
      getElement("employmentJobTitle")
        ? getElement("employmentJobTitle").value
        : ""
    ).trim();

  const description =
    String(
      getElement("employmentDescription")
        ? getElement("employmentDescription").value
        : ""
    ).trim();

  const contract =
    String(
      getElement("employmentContractType")
        ? getElement("employmentContractType").value
        : ""
    ).trim();

  const city =
    String(
      getElement("employmentCity")
        ? getElement("employmentCity").value
        : ""
    ).trim();

  const commitment =
    getElement(
      "employmentCommitmentCheck"
    );

  if(
    !companyName ||
    !companyId ||
    !email ||
    !title ||
    !description ||
    !city
  ){

    alert(
      "Veuillez remplir toutes les informations obligatoires."
    );

    return;
  }

  if(!email.includes("@")){

    alert(
      "Veuillez renseigner une adresse e-mail valide."
    );

    return;
  }

  if(
    !commitment ||
    !commitment.checked
  ){

    alert(
      "Vous devez confirmer que l’offre sera clôturée lorsque le poste sera pourvu."
    );

    return;
  }

  const amountHT =
    EMPLOYMENT_OFFER_PRICE_HT;

  const vatRate =
    BOCITEART_VAT_RATE;

  const amountVAT =
    Number(
      (
        amountHT *
        vatRate /
        100
      ).toFixed(2)
    );

  const amountTTC =
    Number(
      (
        amountHT +
        amountVAT
      ).toFixed(2)
    );

  const pendingOffer = {
    id:createOfferId(),
    companyName:companyName,
    companyId:companyId,
    email:email,
    title:title,
    description:description,
    contract:contract,
    city:city,
    status:"en_attente_paiement",
    amountHT:amountHT,
    vatRate:vatRate,
    amountVAT:amountVAT,
    amountTTC:amountTTC,
    createdAt:Date.now(),
    createdAtFr:
      new Date()
        .toLocaleString("fr-FR"),
    updatedAt:null,
    closedAt:null,
    paidAt:null,
    invoiceId:null
  };

  openEmploymentPayment(
    pendingOffer
  );
}

function openEmploymentPayment(offer){

  module.renderModal(
    "Paiement de l’annonce",
    `
      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
        ">

        <strong
          style="
            color:#2f5d46;
            font-size:18px;
          ">
          Récapitulatif avant publication
        </strong>

        <br><br>

        <strong>
          Entreprise
        </strong>

        <br>

        ${escapeValue(offer.companyName)}

        <br><br>

        <strong>
          Offre
        </strong>

        <br>

        ${escapeValue(offer.title)}

      </div>

      <div
        class="box entrepriseInfoBox">

        <div
          style="
            display:flex;
            justify-content:space-between;
            gap:15px;
          ">

          <span>
            Prix hors taxes
          </span>

          <strong>
            ${formatEmploymentMoney(
              offer.amountHT
            )} €
          </strong>

        </div>

        <br>

        <div
          style="
            display:flex;
            justify-content:space-between;
            gap:15px;
          ">

          <span>
            TVA (${escapeValue(
              offer.vatRate
            )} %)
          </span>

          <strong>
            ${formatEmploymentMoney(
              offer.amountVAT
            )} €
          </strong>

        </div>

        <hr
          style="
            border:none;
            border-top:1px solid #b7d2c2;
            margin:18px 0;
          ">

        <div
          style="
            display:flex;
            justify-content:space-between;
            gap:15px;
            font-size:18px;
          ">

          <strong>
            Total à payer
          </strong>

          <strong
            style="
              color:#2f5d46;
            ">
            ${formatEmploymentMoney(
              offer.amountTTC
            )} € TTC
          </strong>

        </div>

      </div>

      <div
        class="box entrepriseInfoBox">

        Le paiement est effectué immédiatement
        par carte bancaire.

        <br><br>

        L’annonce ne sera publiée
        qu’après confirmation du paiement.

        <br><br>

        Dès que le paiement est confirmé :

        <br><br>

        l’annonce apparaît dans l’espace Emploi,
        le voyant vert de recrutement est activé
        et la facture acquittée est créée
        dans le dossier Factures.

      </div>

      <label
        class="miniCheck">

        <input
          id="employmentPaymentConfirmation"
          type="checkbox">

        <span>
          Je confirme avoir vérifié l’annonce
          et j’accepte le paiement immédiat
          de ${formatEmploymentMoney(
            offer.amountTTC
          )} € TTC.
        </span>

      </label>

      <button
        id="employmentPayByCardBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
          background:#b00020;
          color:#fff;
          border-color:#b00020;
        ">

        Payer par carte bancaire
        et publier l’annonce

      </button>
    `
  );

  window.setTimeout(function(){

    const paymentButton =
      getElement(
        "employmentPayByCardBtn"
      );

    if(!paymentButton){
      return;
    }

    paymentButton.onclick =
      function(){

        const confirmation =
          getElement(
            "employmentPaymentConfirmation"
          );

        if(
          !confirmation ||
          !confirmation.checked
        ){

          alert(
            "Veuillez confirmer le paiement avant de continuer."
          );

          return;
        }

        /*
          DÉMONSTRATION

          En production, cette fonction devra être appelée
          uniquement après le retour sécurisé
          du prestataire de paiement par carte bancaire.
        */

        confirmEmploymentCardPayment(
          offer,
          {
            paid:true,
            paymentMethod:
              "Carte bancaire",
            paymentReference:
              "CB-DEMO-" +
              Date.now()
          }
        );
      };

  },0);
}

function confirmEmploymentCardPayment(
  offer,
  paymentResult
){

  if(
    !paymentResult ||
    paymentResult.paid !== true
  ){

    alert(
      "Le paiement n’a pas été confirmé.\n\n" +
      "L’annonce n’est pas publiée " +
      "et aucune facture n’est créée."
    );

    return;
  }

  if(
    typeof module.createPaidInvoice !==
    "function"
  ){

    alert(
      "Le système de facturation est momentanément indisponible.\n\n" +
      "L’annonce n’a pas été publiée."
    );

    return;
  }

  const invoice =
    module.createPaidInvoice({
      customerName:
        offer.companyName,

      customerEmail:
        offer.email,

      customerId:
        offer.companyId,

      plan:
        "emploi_recrutement",

      planLabel:
        "Publication d’une annonce d’emploi — " +
        offer.title,

      serviceLabel:
        "Publication d’une annonce d’emploi",

      billingMode:
        "ponctuel",

      amountHT:
        offer.amountHT,

      vatRate:
        offer.vatRate,

      amountVAT:
        offer.amountVAT,

      amountTTC:
        offer.amountTTC,

      paymentMethod:
        paymentResult.paymentMethod ||
        "Carte bancaire",

      paymentReference:
        paymentResult.paymentReference ||
        ""
    });

  if(!invoice){

    alert(
      "La facture n’a pas pu être créée.\n\n" +
      "L’annonce n’a pas été publiée."
    );

    return;
  }

  const data =
    loadEmploymentData();

  offer.status =
    "publiee";

  offer.paidAt =
    Date.now();

  offer.paidAtFr =
    new Date()
      .toLocaleString("fr-FR");

  offer.paymentMethod =
    paymentResult.paymentMethod ||
    "Carte bancaire";

  offer.paymentReference =
    paymentResult.paymentReference ||
    "";

  offer.invoiceId =
    invoice.id;

  offer.invoiceNumber =
    invoice.number || "";

  data.offers.push(
    offer
  );

  saveEmploymentData(
    data
  );

  window.dispatchEvent(
    new CustomEvent(
      "bociteart:employment-offer-paid",
      {
        detail:{
          offer:offer,
          invoice:invoice
        }
      }
    )
  );

  alert(
    "Paiement confirmé.\n\n" +
    "L’annonce est maintenant publiée.\n\n" +
    "La facture acquittée a été créée " +
    "dans votre dossier Factures."
  );

  if(
    typeof module.openProfessionalInvoice ===
    "function"
  ){

    module.openProfessionalInvoice(
      invoice.id
    );
  }

  window.setTimeout(function(){

    openEmploymentOffers();

  },200);
}

  function getOfferStatusLabel(status){

    if(status === "publiee"){
      return "Publiée";
    }

    if(status === "modifiee"){
      return "Modifiée";
    }

    if(status === "pourvue"){
      return "Poste pourvu";
    }

    if(status === "cloturee"){
      return "Clôturée";
    }

    if(status === "published"){
      return "Publiée";
    }

    return "Inconnue";
  }

/* =========================================================
   ÇA COMMENCE ICI — PAGE PUBLIQUE OFFRES D’EMPLOI
   ========================================================= */

function openEmploymentOffers(){

  module.renderModal(
    "Offres d’emploi",
    `
      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
          color:#222;
          font-weight:400;
          line-height:1.7;
        ">

        <span
          style="
            display:block;
            color:#2f5d46;
            font-size:18px;
            font-weight:700;
            line-height:1.4;
          ">
          Consultez les offres disponibles dans votre ville
        </span>

        <br>

        Vous trouverez ici les offres d’emploi,
        de stage et d’alternance publiées
        par les entreprises de votre territoire.

        <br><br>

        Chaque annonce présente le poste recherché,
        le type de contrat,
        la commune,
        les missions proposées
        et les compétences souhaitées.

        <br><br>

        Vous pouvez consulter librement les offres
        puis répondre directement
        à celle qui vous intéresse.

      </div>

      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
          color:#222;
          font-weight:400;
          line-height:1.7;
        ">

        <span
          style="
            display:block;
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
          ">
          Comment répondre à une annonce ?
        </span>

        <br>

        Sélectionnez l’offre correspondant
        à votre recherche,
        puis utilisez le bouton prévu
        pour transmettre votre candidature
        à l’entreprise concernée.

        <br><br>

        Votre réponse est liée uniquement
        à l’annonce choisie.

        <br><br>

        Vous pourrez ensuite consulter
        et sélectionner une autre annonce
        lorsque vous le souhaiterez.

      </div>

      <div id="employmentOffersList"></div>

      <div
        class="box entrepriseInfoBox"
        style="
          margin-top:12px;
          border-left:6px solid #2f5d46;
          color:#222;
          font-weight:400;
          line-height:1.7;
        ">

        <span
          style="
            display:block;
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
          ">
          Vous ne trouvez pas encore l’offre recherchée ?
        </span>

        <br>

        Dans l’espace Emploi et Recrutement,
        vous pouvez également envoyer
        une candidature spontanée
        et découvrir les entreprises présentes
        autour de vous.

      </div>
    `
  );

  window.setTimeout(function(){

    renderEmploymentOffers();

    document
      .querySelectorAll(
        ".modal-title," +
        ".modalTitle," +
        ".modal-header h1," +
        ".modal-header h2," +
        ".modalHeader h1," +
        ".modalHeader h2"
      )
      .forEach(function(titleElement){

        if(
          String(
            titleElement.textContent || ""
          ).trim() === "Offres d’emploi"
        ){

          titleElement.style.color =
            "#2f5d46";

          titleElement.style.fontWeight =
            "700";
        }
      });

  },0);
}

/* =========================================================
   ÇA FINIT ICI — PAGE PUBLIQUE OFFRES D’EMPLOI
   ========================================================= */
function renderEmploymentOffers(){
   
    const host =
      getElement(
        "employmentOffersList"
      );

    if(!host){
      return;
    }

    const data =
      loadEmploymentData();

    const offers =
      data.offers
        .slice()
        .sort(function(a,b){

          return (
            Number(b.createdAt) -
            Number(a.createdAt)
          );
        });

if(!offers.length){

  host.innerHTML = `
    <div
      class="box entrepriseInfoBox"
      style="
        border-left:6px solid #2f5d46;
        color:#222;
        font-weight:400;
        line-height:1.7;
      ">

      <span
        style="
          display:block;
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
        ">
        Aucune offre n’est enregistrée pour le moment
      </span>

      <br>

      Il n’y a actuellement aucune offre ouverte
      dans votre ville.

      <br><br>

      Les entreprises peuvent publier
      de nouveaux besoins à tout moment.

      <br><br>

      Revenez régulièrement consulter cette page
      afin de découvrir les prochaines opportunités.

    </div>
  `;

  return;
}

/* =========================================================
   ÇA FINIT ICI — AUCUNE OFFRE DISPONIBLE
   ========================================================= */

    host.innerHTML =
      offers.map(function(offer){

        const active =
          offer.status === "publiee" ||
          offer.status === "modifiee" ||
          offer.status === "published";

        return `
          <div class="box entrepriseInfoBox">

            <strong
              style="
                font-size:16px;
              ">
              ${escapeValue(offer.title)}
            </strong>

            <br>

            <span
              style="
                font-weight:900;
                color:#2f5d46;
              ">
              ${escapeValue(offer.companyName)}
            </span>

            <div
              style="
                margin-top:8px;
              ">

              ${escapeValue(offer.city)}

              •

              ${escapeValue(offer.contract)}

            </div>

            <div
              style="
                margin-top:8px;
                line-height:1.5;
              ">
              ${escapeValue(offer.description)}
            </div>

            <div
              style="
                margin-top:8px;
                font-weight:900;
              ">

              Statut :

              ${escapeValue(
                getOfferStatusLabel(
                  offer.status
                )
              )}

            </div>

            ${
              active
                ? `
                  <div
                    style="
                      display:flex;
                      gap:8px;
                      flex-wrap:wrap;
                      margin-top:10px;
                    ">

                    <button
                      class="choiceBtn employmentApplyBtn"
                      type="button"
                      data-offer-id="${escapeValue(offer.id)}">
                      Répondre à cette offre
                    </button>

                    <button
                      class="choiceBtn employmentCloseBtn"
                      type="button"
                      data-offer-id="${escapeValue(offer.id)}">
                      Indiquer : poste pourvu
                    </button>

                  </div>
                `
                : ""
            }

          </div>
        `;
      }).join("");

    host
      .querySelectorAll(
        ".employmentApplyBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          const offerId =
            button.getAttribute(
              "data-offer-id"
            );

          openApplicationForm(
            offerId
          );
        };
      });

    host
      .querySelectorAll(
        ".employmentCloseBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          const offerId =
            button.getAttribute(
              "data-offer-id"
            );

          if(
            typeof module.requirePrivateAccess ===
            "function"
          ){

            module.requirePrivateAccess(
              function(){

                closeEmploymentOffer(
                  offerId
                );
              }
            );

            return;
          }

          closeEmploymentOffer(
            offerId
          );
        };
      });
  }

  function closeEmploymentOffer(offerId){

    const data =
      loadEmploymentData();

    const offer =
      data.offers.find(function(item){

        return item.id === offerId;
      });

    if(!offer){

      alert(
        "Offre introuvable."
      );

      return;
    }

    if(
      offer.status === "pourvue" ||
      offer.status === "cloturee"
    ){

      alert(
        "Cette offre est déjà clôturée."
      );

      return;
    }

    const confirmation =
      confirm(
        "Confirmer que le poste est pourvu ?\n\n" +
        "L’offre ne sera plus ouverte aux candidatures."
      );

    if(!confirmation){
      return;
    }

    offer.status =
      "pourvue";

    offer.closedAt =
      Date.now();

    offer.updatedAt =
      Date.now();

    saveEmploymentData(
      data
    );

    renderEmploymentOffers();

    alert(
      "L’offre est maintenant indiquée comme pourvue."
    );
  }

function openApplicationForm(offerId){

  const data =
    loadEmploymentData();

  const offer =
    offerId
      ? data.offers.find(function(item){
          return item.id === offerId;
        })
      : null;

  if(offerId && !offer){

    alert(
      "Cette offre est introuvable."
    );

    return;
  }

  if(offer){

    const active =
      offer.status === "publiee" ||
      offer.status === "modifiee" ||
      offer.status === "published";

    if(!active){

      alert(
        "Cette offre n’accepte plus de candidatures."
      );

      openEmploymentOffers();

      return;
    }
  }

  let savedProfile = {};

  try{

    savedProfile =
      JSON.parse(
        localStorage.getItem(
          "bociteart_candidate_profile_v1"
        ) || "{}"
      );

  }catch(error){

    savedProfile = {};
  }

  const savedName =
    escapeValue(
      savedProfile.name || ""
    );

  const savedFirstName =
    escapeValue(
      savedProfile.firstName || ""
    );

  const savedPhone =
    escapeValue(
      savedProfile.phone || ""
    );

  const savedEmail =
    escapeValue(
      savedProfile.email || ""
    );

  const savedCity =
    escapeValue(
      savedProfile.city || ""
    );

  const companyName =
    offer
      ? escapeValue(
          offer.companyName || ""
        )
      : "";

  const position =
    offer
      ? escapeValue(
          offer.title || ""
        )
      : "";

  module.renderModal(
    offer
      ? "Déposer votre candidature"
      : "Candidature spontanée",
    `
      ${
        offer
          ? `
            <div
              class="box entrepriseInfoBox"
              style="
                border-left:6px solid #2f5d46;
                color:#111;
                font-size:14px;
                font-weight:400;
              ">

              <strong
                style="
                  display:block;
                  color:#2f5d46;
                  font-size:16px;
                  font-weight:900;
                  margin-bottom:8px;
                ">
                ${escapeValue(
                  offer.title
                )}
              </strong>

              ${escapeValue(
                offer.companyName
              )}

              <br><br>

              ${escapeValue(
                offer.city
              )}

              •

              ${escapeValue(
                offer.contract
              )}
            </div>
          `
          : `
            <div
              class="box entrepriseInfoBox"
              style="
                border-left:6px solid #2f5d46;
                color:#111;
                font-size:14px;
                font-weight:400;
              ">

              <strong
                style="
                  display:block;
                  color:#2f5d46;
                  font-size:16px;
                  font-weight:900;
                  margin-bottom:8px;
                ">
                Candidature spontanée
              </strong>

              Présentez directement votre candidature
              à l’entreprise de votre choix.
            </div>
          `
      }

      <div
        class="box entrepriseInfoBox"
        style="
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:10px;
          ">
          Vous recherchez ?
        </strong>

        <label class="miniCheck">
          <input
            class="applicationSearchType"
            type="checkbox"
            value="Stage">
          <span>Stage</span>
        </label>

        <label class="miniCheck">
          <input
            class="applicationSearchType"
            type="checkbox"
            value="Apprentissage">
          <span>Apprentissage</span>
        </label>

        <label class="miniCheck">
          <input
            class="applicationSearchType"
            type="checkbox"
            value="Alternance">
          <span>Alternance</span>
        </label>

        <label class="miniCheck">
          <input
            class="applicationSearchType"
            type="checkbox"
            value="CDD">
          <span>CDD</span>
        </label>

        <label class="miniCheck">
          <input
            class="applicationSearchType"
            type="checkbox"
            value="CDI">
          <span>CDI</span>
        </label>

        <label class="miniCheck">
          <input
            class="applicationSearchType"
            type="checkbox"
            value="Intérim">
          <span>Intérim</span>
        </label>

        <label class="miniCheck">
          <input
            class="applicationSearchType"
            type="checkbox"
            value="Emploi saisonnier">
          <span>Emploi saisonnier</span>
        </label>

        <label class="miniCheck">
          <input
            class="applicationSearchType"
            type="checkbox"
            value="Autre">
          <span>Autre</span>
        </label>
      </div>

      ${
        offer
          ? `
            <input
              id="applicationCompanyName"
              type="hidden"
              value="${companyName}">
          `
          : `
            <label
              style="
                display:block;
                color:#2f5d46;
                font-size:16px;
                font-weight:900;
                margin-top:10px;
              ">
              Entreprise destinataire
            </label>

            <input
              id="applicationCompanyName"
              class="miniField"
              type="text"
              placeholder="Nom de l’entreprise">
          `
      }

      <label
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-top:10px;
        ">
        Poste recherché
      </label>

      <input
        id="applicationPosition"
        class="miniField"
        type="text"
        value="${position}"
        placeholder="Poste recherché">

      <label
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-top:10px;
        ">
        Disponibilité
      </label>

      <input
        id="applicationAvailability"
        class="miniField"
        type="text"
        placeholder="Immédiate, date ou période">

      <label
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-top:10px;
        ">
        Nom
      </label>

      <input
        id="applicationCandidateName"
        class="miniField"
        type="text"
        autocomplete="family-name"
        value="${savedName}"
        placeholder="Nom">

      <label
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-top:10px;
        ">
        Prénom
      </label>

      <input
        id="applicationCandidateFirstName"
        class="miniField"
        type="text"
        autocomplete="given-name"
        value="${savedFirstName}"
        placeholder="Prénom">

      <label
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-top:10px;
        ">
        Téléphone
      </label>

      <input
        id="applicationCandidatePhone"
        class="miniField"
        type="tel"
        autocomplete="tel"
        value="${savedPhone}"
        placeholder="Téléphone">

      <label
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-top:10px;
        ">
        Adresse e-mail
      </label>

      <input
        id="applicationCandidateEmail"
        class="miniField"
        type="email"
        autocomplete="email"
        value="${savedEmail}"
        placeholder="Adresse e-mail">

      <label
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-top:10px;
        ">
        Commune
      </label>

      <input
        id="applicationCandidateCity"
        class="miniField"
        type="text"
        autocomplete="address-level2"
        value="${savedCity}"
        placeholder="Commune">

      <div
        class="box entrepriseInfoBox"
        style="
          margin-top:12px;
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:10px;
          ">
          Votre message
        </strong>

        <textarea
          id="applicationCandidateMessage"
          class="miniField"
          style="
            min-height:130px;
            color:#111;
            font-size:14px;
            font-weight:400;
          ">Votre entreprise a retenu toute mon attention.
Je souhaite vous proposer ma candidature pour un poste de ${position}.</textarea>
      </div>

      <div
        class="box entrepriseInfoBox"
        style="
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:10px;
          ">
          Documents facultatifs
        </strong>

        <label
          style="
            display:block;
            margin-bottom:6px;
            font-weight:900;
          ">
          CV
        </label>

        <input
          id="applicationCandidateCv"
          class="miniField"
          type="file"
          accept=".pdf,.doc,.docx">

        <label
          style="
            display:block;
            margin-top:10px;
            margin-bottom:6px;
            font-weight:900;
          ">
          Lettre
        </label>

        <input
          id="applicationCandidateLetter"
          class="miniField"
          type="file"
          accept=".pdf,.doc,.docx">

        <label
          style="
            display:block;
            margin-top:10px;
            margin-bottom:6px;
            font-weight:900;
          ">
          Autre document
        </label>

        <input
          id="applicationCandidateOtherDocument"
          class="miniField"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
      </div>

      <div
        class="box entrepriseInfoBox"
        style="
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        Chaque envoi et chaque réponse sont automatiquement
        classés, enregistrés, datés et horodatés.
      </div>

      <button
        id="applicationSendBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Envoyer ma candidature
      </button>
    `
  );

  window.setTimeout(function(){

    const positionInput =
      getElement(
        "applicationPosition"
      );

    const messageInput =
      getElement(
        "applicationCandidateMessage"
      );

    if(
      positionInput &&
      messageInput
    ){

      positionInput.oninput = function(){

        const selectedPosition =
          String(
            positionInput.value || ""
          ).trim();

        messageInput.value =
          "Votre entreprise a retenu toute mon attention.\n" +
          "Je souhaite vous proposer ma candidature pour un poste de " +
          (
            selectedPosition ||
            "..."
          ) +
          ".";
      };
    }

    const sendButton =
      getElement(
        "applicationSendBtn"
      );

    if(sendButton){

      sendButton.onclick = function(){

        saveApplication(
          offerId || ""
        );
      };
    }

  },0);
}
   
function saveApplication(offerId){

  const searchTypes =
    Array.from(
      document.querySelectorAll(
        ".applicationSearchType:checked"
      )
    ).map(function(input){

      return String(
        input.value || ""
      ).trim();
    });

  const companyName =
    String(
      getElement("applicationCompanyName")
        ? getElement("applicationCompanyName").value
        : ""
    ).trim();

  const position =
    String(
      getElement("applicationPosition")
        ? getElement("applicationPosition").value
        : ""
    ).trim();

  const availability =
    String(
      getElement("applicationAvailability")
        ? getElement("applicationAvailability").value
        : ""
    ).trim();

  const name =
    String(
      getElement("applicationCandidateName")
        ? getElement("applicationCandidateName").value
        : ""
    ).trim();

  const firstName =
    String(
      getElement("applicationCandidateFirstName")
        ? getElement("applicationCandidateFirstName").value
        : ""
    ).trim();

  const phone =
    String(
      getElement("applicationCandidatePhone")
        ? getElement("applicationCandidatePhone").value
        : ""
    ).trim();

  const email =
    String(
      getElement("applicationCandidateEmail")
        ? getElement("applicationCandidateEmail").value
        : ""
    ).trim();

  const city =
    String(
      getElement("applicationCandidateCity")
        ? getElement("applicationCandidateCity").value
        : ""
    ).trim();

  const message =
    String(
      getElement("applicationCandidateMessage")
        ? getElement("applicationCandidateMessage").value
        : ""
    ).trim();

  const cvInput =
    getElement(
      "applicationCandidateCv"
    );

  const letterInput =
    getElement(
      "applicationCandidateLetter"
    );

  const otherDocumentInput =
    getElement(
      "applicationCandidateOtherDocument"
    );

  if(!searchTypes.length){

    alert(
      "Veuillez sélectionner le type de recherche."
    );

    return;
  }

  if(!companyName){

    alert(
      "Veuillez renseigner l’entreprise destinataire."
    );

    return;
  }

  if(!position){

    alert(
      "Veuillez renseigner le poste recherché."
    );

    return;
  }

  if(!availability){

    alert(
      "Veuillez renseigner votre disponibilité."
    );

    return;
  }

  if(
    !name ||
    !firstName ||
    !phone ||
    !email ||
    !city
  ){

    alert(
      "Veuillez remplir toutes vos coordonnées."
    );

    return;
  }

  if(
    !email.includes("@") ||
    !email.includes(".")
  ){

    alert(
      "Veuillez renseigner une adresse e-mail valide."
    );

    return;
  }

  if(!message){

    alert(
      "Votre message ne peut pas être vide."
    );

    return;
  }

  const data =
    loadEmploymentData();

  let offer = null;

  if(offerId){

    offer =
      data.offers.find(function(item){

        return item.id === offerId;
      });

    if(
      !offer ||
      (
        offer.status !== "publiee" &&
        offer.status !== "modifiee" &&
        offer.status !== "published"
      )
    ){

      alert(
        "Cette offre n’accepte plus de candidatures."
      );

      return;
    }
  }

  const now =
    Date.now();

  const dateFr =
    new Date(now)
      .toLocaleString(
        "fr-FR"
      );

  const cvName =
    (
      cvInput &&
      cvInput.files &&
      cvInput.files.length
    )
      ? cvInput.files[0].name
      : "";

  const letterName =
    (
      letterInput &&
      letterInput.files &&
      letterInput.files.length
    )
      ? letterInput.files[0].name
      : "";

  const otherDocumentName =
    (
      otherDocumentInput &&
      otherDocumentInput.files &&
      otherDocumentInput.files.length
    )
      ? otherDocumentInput.files[0].name
      : "";

  const candidateProfile = {

    name:
      name,

    firstName:
      firstName,

    phone:
      phone,

    email:
      email,

    city:
      city
  };

  try{

    localStorage.setItem(
      "bociteart_candidate_profile_v1",
      JSON.stringify(
        candidateProfile
      )
    );

  }catch(error){

    console.warn(
      "Profil candidat non enregistré.",
      error
    );
  }

  if(
    !Array.isArray(
      data.applications
    )
  ){

    data.applications = [];
  }

  data.applications.push({

    id:
      "CAND-" +
      now +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,7),

    offerId:
      offerId || "",

    offerTitle:
      offer
        ? offer.title
        : position,

    companyName:
      offer
        ? offer.companyName
        : companyName,

    searchTypes:
      searchTypes,

    searchType:
      searchTypes.join(", "),

    position:
      position,

    availability:
      availability,

    candidateName:
      name,

    candidateFirstName:
      firstName,

    candidateFullName:
      firstName + " " + name,

    candidateEmail:
      email,

    candidatePhone:
      phone,

    candidateCity:
      city,

    message:
      message,

    cvName:
      cvName,

    letterName:
      letterName,

    otherDocumentName:
      otherDocumentName,

    createdAt:
      now,

    createdAtFr:
      dateFr,

    sentAt:
      now,

    sentAtFr:
      dateFr,

    status:
      "recue",

    replyStatus:
      "en_attente",

    replyMessage:
      "",

    repliedAt:
      null,

    repliedAtFr:
      ""
  });

  saveEmploymentData(
    data
  );

  alert(
    "Votre candidature a été envoyée.\n\n" +
    "Elle est désormais classée, enregistrée, datée et horodatée."
  );

  if(
    typeof module.openEmploymentHistory ===
    "function"
  ){

    module.openEmploymentHistory();

    return;
  }

  if(
    typeof module.openEmploymentApplications ===
    "function"
  ){

    module.openEmploymentApplications();

    return;
  }

  openEmploymentPublicHome();
}

function openEmploymentApplications(){

  module.renderModal(
    "Candidatures reçues",
    `
      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:10px;
          ">
          Candidatures reçues
        </strong>

        Chaque candidature est automatiquement
        classée selon le type de recherche.

        <br><br>

        Chaque envoi et chaque réponse sont
        enregistrés, datés et horodatés.
      </div>

      <div id="employmentApplicationsList"></div>
    `
  );

  window.setTimeout(function(){

    renderEmploymentApplications();

  },0);
}

function renderEmploymentApplications(){

  const host =
    getElement(
      "employmentApplicationsList"
    );

  if(!host){
    return;
  }

  const data =
    loadEmploymentData();

  const applications =
    Array.isArray(
      data.applications
    )
      ? data.applications
          .slice()
          .sort(function(a,b){

            return (
              Number(b.createdAt || 0) -
              Number(a.createdAt || 0)
            );
          })
      : [];

  if(!applications.length){

    host.innerHTML = `
      <div
        class="box entrepriseInfoBox"
        style="
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        Aucune candidature reçue.
      </div>
    `;

    return;
  }

  host.innerHTML =
    applications.map(function(application){

      const applicationId =
        escapeValue(
          application.id || ""
        );

      const fullName =
        application.candidateFullName ||
        (
          (
            application.candidateFirstName ||
            ""
          ) +
          " " +
          (
            application.candidateName ||
            ""
          )
        ).trim() ||
        application.candidateName ||
        "Candidat";

      const searchType =
        application.searchType ||
        (
          Array.isArray(
            application.searchTypes
          )
            ? application.searchTypes.join(", ")
            : ""
        ) ||
        "Non précisé";

      const replySent =
        application.replyStatus ===
        "repondue";

      return `
        <div
          class="box entrepriseInfoBox"
          style="
            border-left:6px solid #2f5d46;
            color:#111;
            font-size:14px;
            font-weight:400;
          ">

          <strong
            style="
              display:block;
              color:#2f5d46;
              font-size:16px;
              font-weight:900;
              margin-bottom:10px;
            ">
            ${escapeValue(
              fullName
            )}
          </strong>

          <strong>Recherche :</strong>

          ${escapeValue(
            searchType
          )}

          <br><br>

          <strong>Poste recherché :</strong>

          ${escapeValue(
            application.position ||
            application.offerTitle ||
            ""
          )}

          <br><br>

          <strong>Disponibilité :</strong>

          ${escapeValue(
            application.availability ||
            "Non précisée"
          )}

          <br><br>

          <strong>Commune :</strong>

          ${escapeValue(
            application.candidateCity ||
            "Non précisée"
          )}

          <br><br>

          <strong>E-mail :</strong>

          ${escapeValue(
            application.candidateEmail ||
            ""
          )}

          <br>

          <strong>Téléphone :</strong>

          ${escapeValue(
            application.candidatePhone ||
            ""
          )}

          <br><br>

          <strong>Message :</strong>

          <br>

          ${escapeValue(
            application.message ||
            ""
          )}

          <br><br>

          <strong>Documents :</strong>

          <br>

          CV :
          ${escapeValue(
            application.cvName ||
            "Non joint"
          )}

          <br>

          Lettre :
          ${escapeValue(
            application.letterName ||
            "Non jointe"
          )}

          <br>

          Autre document :
          ${escapeValue(
            application.otherDocumentName ||
            "Non joint"
          )}

          <br><br>

          <strong>Candidature reçue le :</strong>

          ${escapeValue(
            application.createdAtFr ||
            ""
          )}

          ${
            replySent
              ? `
                <div
                  style="
                    margin-top:14px;
                    padding-top:12px;
                    border-top:1px solid #2f5d46;
                  ">

                  <strong
                    style="
                      display:block;
                      color:#2f5d46;
                      font-size:16px;
                      font-weight:900;
                      margin-bottom:8px;
                    ">
                    Réponse envoyée
                  </strong>

                  ${escapeValue(
                    application.replyMessage ||
                    ""
                  )}

                  <br><br>

                  Envoyée le :

                  ${escapeValue(
                    application.repliedAtFr ||
                    ""
                  )}
                </div>
              `
              : `
                <button
                  class="choiceBtn employmentReplyOpenBtn"
                  type="button"
                  data-application-id="${applicationId}"
                  style="
                    width:100%;
                    margin-top:14px;
                  ">
                  Répondre au candidat
                </button>
              `
          }
        </div>
      `;
    }).join("");

  document
    .querySelectorAll(
      ".employmentReplyOpenBtn"
    )
    .forEach(function(button){

      button.onclick = function(){

        openEmploymentReplyForm(
          button.getAttribute(
            "data-application-id"
          )
        );
      };
    });
}

function openEmploymentReplyForm(applicationId){

  const data =
    loadEmploymentData();

  const application =
    Array.isArray(
      data.applications
    )
      ? data.applications.find(function(item){

          return item.id ===
            applicationId;
        })
      : null;

  if(!application){

    alert(
      "Cette candidature est introuvable."
    );

    return;
  }

  const candidateName =
    application.candidateFullName ||
    (
      (
        application.candidateFirstName ||
        ""
      ) +
      " " +
      (
        application.candidateName ||
        ""
      )
    ).trim() ||
    "le candidat";

  module.renderModal(
    "Répondre au candidat",
    `
      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:10px;
          ">
          ${escapeValue(
            candidateName
          )}
        </strong>

        Poste recherché :

        ${escapeValue(
          application.position ||
          application.offerTitle ||
          ""
        )}
      </div>

      <div
        class="box entrepriseInfoBox"
        style="
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:10px;
          ">
          Votre réponse
        </strong>

        <label class="miniCheck">

          <input
            class="employmentReplyChoice"
            type="checkbox"
            value="Votre candidature a retenu notre attention.">

          <span>
            Votre candidature a retenu notre attention.
          </span>
        </label>

        <label class="miniCheck">

          <input
            class="employmentReplyChoice"
            type="checkbox"
            value="Merci de nous contacter.">

          <span>
            Merci de nous contacter.
          </span>
        </label>

        <label class="miniCheck">

          <input
            class="employmentReplyChoice"
            type="checkbox"
            value="Nous conservons votre candidature dans notre historique.">

          <span>
            Nous conservons votre candidature dans notre historique.
          </span>
        </label>
      </div>

      <label
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-top:10px;
        ">
        Précision facultative
      </label>

      <textarea
        id="employmentReplyAdditionalMessage"
        class="miniField"
        style="
          min-height:90px;
          color:#111;
          font-size:14px;
          font-weight:400;
        "
        placeholder="Ajoutez une précision si nécessaire"></textarea>

      <label
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-top:10px;
        ">
        Document facultatif
      </label>

      <input
        id="employmentReplyDocument"
        class="miniField"
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">

      <button
        id="employmentReplySendBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
        ">
        Envoyer la réponse
      </button>

      <button
        id="employmentReplyBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Retour aux candidatures
      </button>
    `
  );

  window.setTimeout(function(){

    const sendButton =
      getElement(
        "employmentReplySendBtn"
      );

    const backButton =
      getElement(
        "employmentReplyBackBtn"
      );

    if(sendButton){

      sendButton.onclick = function(){

        saveEmploymentReply(
          applicationId
        );
      };
    }

    if(backButton){

      backButton.onclick =
        openEmploymentApplications;
    }

  },0);
}

function saveEmploymentReply(applicationId){

  const selectedReplies =
    Array.from(
      document.querySelectorAll(
        ".employmentReplyChoice:checked"
      )
    ).map(function(input){

      return String(
        input.value || ""
      ).trim();
    });

  const additionalMessage =
    String(
      getElement(
        "employmentReplyAdditionalMessage"
      )
        ? getElement(
            "employmentReplyAdditionalMessage"
          ).value
        : ""
    ).trim();

  const documentInput =
    getElement(
      "employmentReplyDocument"
    );

  if(!selectedReplies.length){

    alert(
      "Veuillez sélectionner au moins une réponse."
    );

    return;
  }

  const data =
    loadEmploymentData();

  const application =
    Array.isArray(
      data.applications
    )
      ? data.applications.find(function(item){

          return item.id ===
            applicationId;
        })
      : null;

  if(!application){

    alert(
      "Cette candidature est introuvable."
    );

    return;
  }

  const now =
    Date.now();

  const dateFr =
    new Date(now)
      .toLocaleString(
        "fr-FR"
      );

  let replyMessage =
    selectedReplies.join("\n\n");

  if(additionalMessage){

    replyMessage +=
      "\n\n" +
      additionalMessage;
  }

  const replyDocumentName =
    (
      documentInput &&
      documentInput.files &&
      documentInput.files.length
    )
      ? documentInput.files[0].name
      : "";

  application.replyStatus =
    "repondue";

  application.status =
    "repondue";

  application.replyChoices =
    selectedReplies;

  application.replyMessage =
    replyMessage;

  application.replyDocumentName =
    replyDocumentName;

  application.repliedAt =
    now;

  application.repliedAtFr =
    dateFr;

  saveEmploymentData(
    data
  );

  alert(
    "La réponse a été envoyée au candidat.\n\n" +
    "Elle est désormais classée, enregistrée, datée et horodatée."
  );

  openEmploymentApplications();
}

   function openEmploymentHistory(){

  let savedProfile = {};

  try{

    savedProfile =
      JSON.parse(
        localStorage.getItem(
          "bociteart_candidate_profile_v1"
        ) || "{}"
      );

  }catch(error){

    savedProfile = {};
  }

  const savedEmail =
    String(
      savedProfile.email || ""
    ).trim().toLowerCase();

  const savedPhone =
    String(
      savedProfile.phone || ""
    ).replace(/\s+/g,"");

  const data =
    loadEmploymentData();

  const applications =
    Array.isArray(
      data.applications
    )
      ? data.applications
          .filter(function(application){

            const applicationEmail =
              String(
                application.candidateEmail || ""
              ).trim().toLowerCase();

            const applicationPhone =
              String(
                application.candidatePhone || ""
              ).replace(/\s+/g,"");

            if(
              savedEmail &&
              applicationEmail === savedEmail
            ){
              return true;
            }

            if(
              savedPhone &&
              applicationPhone === savedPhone
            ){
              return true;
            }

            return false;
          })
          .sort(function(a,b){

            return (
              Number(b.createdAt || 0) -
              Number(a.createdAt || 0)
            );
          })
      : [];

  module.renderModal(
    "Votre historique",
    `
      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:10px;
          ">
          Vos candidatures
        </strong>

        Chaque envoi et chaque réponse sont automatiquement
        classés, enregistrés, datés et horodatés.
      </div>

      ${
        !savedEmail &&
        !savedPhone
          ? `
            <div
              class="box entrepriseInfoBox"
              style="
                color:#111;
                font-size:14px;
                font-weight:400;
              ">

              Aucune identité de candidat
              n’est encore enregistrée.

              <br><br>

              Déposez une première candidature
              pour créer automatiquement votre historique.
            </div>
          `
          : ""
      }

      ${
        applications.length
          ? applications.map(function(application){

              const replySent =
                application.replyStatus ===
                "repondue";

              const searchType =
                application.searchType ||
                (
                  Array.isArray(
                    application.searchTypes
                  )
                    ? application.searchTypes.join(", ")
                    : ""
                ) ||
                "Non précisé";

              return `
                <div
                  class="box entrepriseInfoBox"
                  style="
                    border-left:6px solid ${
                      replySent
                        ? "#2f5d46"
                        : "#b00020"
                    };
                    color:#111;
                    font-size:14px;
                    font-weight:400;
                  ">

                  <strong
                    style="
                      display:block;
                      color:#2f5d46;
                      font-size:16px;
                      font-weight:900;
                      margin-bottom:10px;
                    ">
                    ${escapeValue(
                      application.companyName ||
                      "Entreprise"
                    )}
                  </strong>

                  <strong>Poste recherché :</strong>

                  ${escapeValue(
                    application.position ||
                    application.offerTitle ||
                    ""
                  )}

                  <br><br>

                  <strong>Type de recherche :</strong>

                  ${escapeValue(
                    searchType
                  )}

                  <br><br>

                  <strong>Envoyée le :</strong>

                  ${escapeValue(
                    application.sentAtFr ||
                    application.createdAtFr ||
                    ""
                  )}

                  <br><br>

                  <strong>État :</strong>

                  ${
                    replySent
                      ? "Réponse reçue"
                      : "En attente de réponse"
                  }

                  ${
                    replySent
                      ? `
                        <div
                          style="
                            margin-top:14px;
                            padding-top:12px;
                            border-top:1px solid #2f5d46;
                          ">

                          <strong
                            style="
                              display:block;
                              color:#2f5d46;
                              font-size:16px;
                              font-weight:900;
                              margin-bottom:8px;
                            ">
                            Réponse de l’entreprise
                          </strong>

                          ${escapeValue(
                            application.replyMessage ||
                            ""
                          )}

                          ${
                            application.replyDocumentName
                              ? `
                                <br><br>

                                <strong>Document joint :</strong>

                                ${escapeValue(
                                  application.replyDocumentName
                                )}
                              `
                              : ""
                          }

                          <br><br>

                          <strong>Réponse reçue le :</strong>

                          ${escapeValue(
                            application.repliedAtFr ||
                            ""
                          )}
                        </div>
                      `
                      : ""
                  }
                </div>
              `;
            }).join("")
          : (
              savedEmail ||
              savedPhone
                ? `
                  <div
                    class="box entrepriseInfoBox"
                    style="
                      color:#111;
                      font-size:14px;
                      font-weight:400;
                    ">

                    Aucune candidature enregistrée
                    dans votre historique.
                  </div>
                `
                : ""
            )
      }

      <button
        id="employmentHistoryApplyBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Déposer une candidature
      </button>

      <button
        id="employmentHistoryBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Retour à l’emploi
      </button>
    `
  );

  window.setTimeout(function(){

    const applyButton =
      getElement(
        "employmentHistoryApplyBtn"
      );

    const backButton =
      getElement(
        "employmentHistoryBackBtn"
      );

    if(applyButton){

      applyButton.onclick = function(){

        openApplicationForm();
      };
    }

    if(backButton){

      backButton.onclick = function(){

        if(
          typeof module.openEmploymentPublicHome ===
          "function"
        ){
          module.openEmploymentPublicHome();
          return;
        }

        openEmployment();
      };
    }

  },0);
}

  module.registerScreen(
    "emploi",
    openEmployment
  );

   module.registerScreen(
  "emploi_home",
  openEmploymentHome
);

    module.openEmploymentHome =
  openEmploymentHome;

module.openEmploymentCompaniesDirectory =
  openEmploymentCompaniesDirectory;

window.openEmploymentHome =
  openEmploymentHome;

window.openEmploymentCompaniesDirectory =
  openEmploymentCompaniesDirectory;

  module.openEmploymentForm =
    openEmploymentForm;

  module.openEmploymentOffers =
    openEmploymentOffers;

  module.openEmploymentApplications =
    openEmploymentApplications;

   module.openApplicationForm =
  openApplicationForm;

   module.openEmploymentHistory =
  openEmploymentHistory;

   module.openEmploymentReplyForm =
  openEmploymentReplyForm;

  console.log(
    "✅ Module Entreprise — partie 3 chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 4B — MOTEUR BESOINS / CONSULTATIONS / RÉPONSES
   L'écran public est géré par entreprise-mutualisation.js
   ========================================================= */

(function initBociteEntrepriseMutualisationEngine(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt Entreprise : les parties précédentes doivent être chargées."
    );

    return;
  }

  const MUTUALISATION_STORE_KEY =
    "bociteart_entreprise_mutualisation_v3";

  function escapeValue(value){

    if(
      typeof module.safeEscape ===
      "function"
    ){
      return module.safeEscape(value);
    }

    return String(
      value == null ? "" : value
    );
  }

  function createId(prefix){

    return (
      prefix +
      "-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,8)
    );
  }

  function getDefaultData(){

    return {

      categories:{

        electricite:{
          id:"electricite",
          label:"Électricité",
          count:17,
          target:30,
          interested:false,
          status:"ouverte"
        },

        gaz:{
          id:"gaz",
          label:"Gaz",
          count:9,
          target:30,
          interested:false,
          status:"ouverte"
        },

        telephonie:{
          id:"telephonie",
          label:"Téléphonie et Internet",
          count:24,
          target:30,
          interested:false,
          status:"ouverte"
        },

        assurances:{
          id:"assurances",
          label:"Assurances professionnelles",
          count:12,
          target:30,
          interested:false,
          status:"ouverte"
        },

        mutuelle:{
          id:"mutuelle",
          label:"Mutuelle",
          count:8,
          target:30,
          interested:false,
          status:"ouverte"
        },

        fournitures:{
          id:"fournitures",
          label:"Fournitures professionnelles",
          count:6,
          target:30,
          interested:false,
          status:"ouverte"
        },

        carburant:{
          id:"carburant",
          label:"Carburant",
          count:11,
          target:30,
          interested:false,
          status:"ouverte"
        },

        formation:{
          id:"formation",
          label:"Formation",
          count:5,
          target:20,
          interested:false,
          status:"ouverte"
        }

      },

      customNeeds:[],

      consultations:[],

      supplierRequests:[],

      supplierResponses:[],

      partnerInbox:[],

      commitments:[],

      billingQueue:[],

      auditLog:[]
    };
  }

  function normalizeData(data){

    const defaults =
      getDefaultData();

    const source =
      data &&
      typeof data === "object"
        ? data
        : {};

    return {

      categories:
        Object.assign(
          {},
          defaults.categories,
          source.categories || {}
        ),

      customNeeds:
        Array.isArray(source.customNeeds)
          ? source.customNeeds
          : [],

      consultations:
        Array.isArray(source.consultations)
          ? source.consultations
          : [],

      supplierRequests:
        Array.isArray(source.supplierRequests)
          ? source.supplierRequests
          : [],

      supplierResponses:
        Array.isArray(source.supplierResponses)
          ? source.supplierResponses
          : [],

      partnerInbox:
        Array.isArray(source.partnerInbox)
          ? source.partnerInbox
          : [],

      commitments:
        Array.isArray(source.commitments)
          ? source.commitments
          : [],

      billingQueue:
        Array.isArray(source.billingQueue)
          ? source.billingQueue
          : [],

      auditLog:
        Array.isArray(source.auditLog)
          ? source.auditLog
          : []
    };
  }

  function loadMutualisationData(){

    try{

      const raw =
        localStorage.getItem(
          MUTUALISATION_STORE_KEY
        );

      if(!raw){
        return getDefaultData();
      }

      return normalizeData(
        JSON.parse(raw)
      );

    }catch(error){

      console.warn(
        "Lecture des besoins professionnels impossible :",
        error
      );

      return getDefaultData();
    }
  }

  function saveMutualisationData(data){

    const normalized =
      normalizeData(data);

    try{

      localStorage.setItem(
        MUTUALISATION_STORE_KEY,
        JSON.stringify(normalized)
      );

      return true;

    }catch(error){

      console.warn(
        "Enregistrement des besoins professionnels impossible :",
        error
      );

      return false;
    }
  }

  function addAuditEvent(
    type,
    details
  ){

    const data =
      loadMutualisationData();

    data.auditLog.push({

      id:
        createId("LOG"),

      type:
        String(type || ""),

      details:
        details || {},

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString("fr-FR")
    });

    saveMutualisationData(data);
  }

  function getProgressPercent(
    count,
    target
  ){

    if(!target){
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        Number(count || 0) /
        Number(target || 1) *
        100
      )
    );
  }

  function addCustomNeed(options){

    const input =
      options || {};

    const title =
      String(
        input.title || ""
      ).trim();

    const description =
      String(
        input.description || ""
      ).trim();

    const category =
      String(
        input.category ||
        "autre"
      ).trim();

    if(!title){

      return {
        ok:false,
        error:"Titre du besoin obligatoire."
      };
    }

    const data =
      loadMutualisationData();

    const need = {

      id:
        createId("BESOIN"),

      title:
        title,

      description:
        description,

      category:
        category,

      count:
        1,

      target:
        Number(
          input.target || 20
        ),

      status:
        "ouverte",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString("fr-FR")
    };

    data.customNeeds.push(
      need
    );

    saveMutualisationData(data);

    addAuditEvent(
      "besoin_cree",
      {
        needId:need.id,
        title:need.title
      }
    );

    return {
      ok:true,
      need:need
    };
  }

  function joinNeed(needId){

    const data =
      loadMutualisationData();

    let need =
      data.customNeeds.find(
        function(item){

          return (
            item.id === needId
          );
        }
      );

    if(!need){

      const categoryKeys =
        Object.keys(
          data.categories
        );

      for(
        let i = 0;
        i < categoryKeys.length;
        i += 1
      ){

        const key =
          categoryKeys[i];

        if(
          key === needId ||
          data.categories[key].id === needId
        ){

          need =
            data.categories[key];

          break;
        }
      }
    }

    if(!need){

      return {
        ok:false,
        error:"Besoin introuvable."
      };
    }

    need.count =
      Number(
        need.count || 0
      ) + 1;

    saveMutualisationData(data);

    addAuditEvent(
      "besoin_rejoint",
      {
        needId:
          need.id || needId,

        count:
          need.count
      }
    );

    if(
      Number(need.count) >=
      Number(need.target || 0)
    ){

      prepareConsultation(
        need.id || needId
      );
    }

    return {
      ok:true,
      need:need
    };
  }

  function prepareConsultation(needId){

    const data =
      loadMutualisationData();

    const existing =
      data.consultations.find(
        function(item){

          return (
            item.needId === needId &&
            item.status !== "terminee"
          );
        }
      );

    if(existing){

      return {
        ok:true,
        consultation:existing
      };
    }

    const consultation = {

      id:
        createId("CONSULT"),

      needId:
        needId,

      status:
        "a_preparer",

      supplierSearchStatus:
        "en_attente",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString("fr-FR"),

      launchedAt:
        null,

      launchedAtFr:
        ""
    };

    data.consultations.push(
      consultation
    );

    saveMutualisationData(data);

    addAuditEvent(
      "consultation_preparee",
      {
        consultationId:
          consultation.id,

        needId:
          needId
      }
    );

    return {
      ok:true,
      consultation:
        consultation
    };
  }

  function queueSupplierRequest(
    consultationId,
    supplier
  ){

    const data =
      loadMutualisationData();

    const request = {

      id:
        createId("FOURNISSEUR"),

      consultationId:
        consultationId,

      supplier:
        supplier || {},

      status:
        "a_envoyer",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString("fr-FR")
    };

    data.supplierRequests.push(
      request
    );

    saveMutualisationData(data);

    return request;
  }

  function recordSupplierResponse(
    consultationId,
    response
  ){

    const data =
      loadMutualisationData();

    const supplierResponse = {

      id:
        createId("REPONSE"),

      consultationId:
        consultationId,

      supplierId:
        String(
          response &&
          response.supplierId || ""
        ),

      supplierName:
        String(
          response &&
          response.supplierName || ""
        ),

      title:
        String(
          response &&
          response.title || ""
        ),

      price:
        Number(
          response &&
          response.price || 0
        ),

      details:
        String(
          response &&
          response.details || ""
        ),

      status:
        "recue",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString("fr-FR")
    };

    data.supplierResponses.push(
      supplierResponse
    );

    data.partnerInbox.push({

      id:
        createId("INBOX"),

      consultationId:
        consultationId,

      responseId:
        supplierResponse.id,

      title:
        supplierResponse.title ||
        "Nouvelle proposition reçue",

      status:
        "non_lue",

      createdAt:
        supplierResponse.createdAt,

      createdAtFr:
        supplierResponse.createdAtFr
    });

    saveMutualisationData(data);

    addAuditEvent(
      "reponse_fournisseur_recue",
      {
        consultationId:
          consultationId,

        responseId:
          supplierResponse.id
      }
    );

    return supplierResponse;
  }

  function getPartnerInbox(){

    return loadMutualisationData()
      .partnerInbox
      .slice()
      .sort(
        function(a,b){

          return (
            Number(
              b.createdAt || 0
            ) -
            Number(
              a.createdAt || 0
            )
          );
        }
      );
  }

  function recordCommitment(
    responseId,
    decision
  ){

    const data =
      loadMutualisationData();

    const commitment = {

      id:
        createId("DECISION"),

      responseId:
        responseId,

      decision:
        decision === "accepte"
          ? "accepte"
          : "refuse",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString("fr-FR")
    };

    data.commitments.push(
      commitment
    );

    saveMutualisationData(data);

    addAuditEvent(
      "decision_partenaire",
      {
        responseId:
          responseId,

        decision:
          commitment.decision
      }
    );

    return commitment;
  }

  function queueBillingRecord(options){

    const input =
      options || {};

    const data =
      loadMutualisationData();

    const record = {

      id:
        createId("FACT"),

      supplierId:
        String(
          input.supplierId || ""
        ),

      consultationId:
        String(
          input.consultationId || ""
        ),

      contractId:
        String(
          input.contractId || ""
        ),

      amount:
        Number(
          input.amount || 0
        ),

      status:
        "a_facturer",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString("fr-FR")
    };

    data.billingQueue.push(
      record
    );

    saveMutualisationData(data);

    addAuditEvent(
      "facturation_preparee",
      {
        billingId:
          record.id,

        consultationId:
          record.consultationId
      }
    );

    return record;
  }

  /*
    IMPORTANT :
    Ces deux fonctions sont les points d'entrée
    du futur moteur IA / serveur.

    L'IA ou le backend pourra :
    - rechercher les fournisseurs ;
    - préparer les consultations ;
    - transmettre les demandes ;
    - récupérer les réponses ;
    - alimenter la boîte partenaire ;
    - déclencher la facturation.

    Aucun envoi externe réel n'est encore effectué
    directement depuis ce fichier JavaScript.
  */

  module.loadMutualisationData =
    loadMutualisationData;

  module.saveMutualisationData =
    saveMutualisationData;

  module.getMutualisationProgress =
    getProgressPercent;

  module.addMutualisationNeed =
    addCustomNeed;

  module.joinMutualisationNeed =
    joinNeed;

  module.prepareMutualisationConsultation =
    prepareConsultation;

  module.queueMutualisationSupplierRequest =
    queueSupplierRequest;

  module.recordMutualisationSupplierResponse =
    recordSupplierResponse;

  module.getMutualisationPartnerInbox =
    getPartnerInbox;

  module.recordMutualisationCommitment =
    recordCommitment;

  module.queueMutualisationBilling =
    queueBillingRecord;

  console.log(
    "✅ Moteur besoins, consultations, réponses et facturation préparé"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 4C — RÉPONSES FOURNISSEURS ET DÉCISIONS
   ========================================================= */

(function initBociteEntrepriseMutualisationResponses(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt Entreprise : les parties précédentes doivent être chargées."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function escapeValue(value){

    if(
      typeof module.safeEscape ===
      "function"
    ){
      return module.safeEscape(value);
    }

    return String(
      value == null ? "" : value
    );
  }

  function loadData(){

    if(
      typeof module.loadMutualisationData ===
      "function"
    ){

      return module.loadMutualisationData();
    }

    return {
      supplierResponses:[],
      partnerInbox:[],
      commitments:[]
    };
  }

  function getResponseById(responseId){

    const data =
      loadData();

    return (
      Array.isArray(
        data.supplierResponses
      )
        ? data.supplierResponses.find(
            function(item){

              return (
                item.id === responseId
              );
            }
          )
        : null
    );
  }

  function getPartnerResponses(){

    const data =
      loadData();

    const responses =
      Array.isArray(
        data.supplierResponses
      )
        ? data.supplierResponses.slice()
        : [];

    return responses.sort(
      function(a,b){

        return (
          Number(
            b.createdAt || 0
          ) -
          Number(
            a.createdAt || 0
          )
        );
      }
    );
  }

  function getDecisionForResponse(
    responseId
  ){

    const data =
      loadData();

    const commitments =
      Array.isArray(
        data.commitments
      )
        ? data.commitments
        : [];

    return commitments
      .slice()
      .reverse()
      .find(
        function(item){

          return (
            item.responseId ===
            responseId
          );
        }
      ) || null;
  }

  function getResponseCardHtml(
    response
  ){

    const decision =
      getDecisionForResponse(
        response.id
      );

    return `
      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
          color:#111;
          font-size:14px;
          font-weight:400;
          line-height:1.6;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:10px;
          ">
          ${escapeValue(
            response.title ||
            "Proposition reçue"
          )}
        </strong>

        <strong>Prestataire :</strong>

        ${escapeValue(
          response.supplierName ||
          "Non précisé"
        )}

        <br><br>

        <strong>Proposition :</strong>

        <br>

        ${escapeValue(
          response.details ||
          "Aucun détail complémentaire."
        )}

        ${
          Number(
            response.price || 0
          ) > 0
            ? `
              <br><br>

              <strong>Prix proposé :</strong>

              ${escapeValue(
                response.price
              )} €
            `
            : ""
        }

        <br><br>

        <strong>Reçue le :</strong>

        ${escapeValue(
          response.createdAtFr ||
          ""
        )}

        ${
          decision
            ? `
              <div
                style="
                  margin-top:14px;
                  padding-top:12px;
                  border-top:1px solid #d8d8d8;
                ">

                <strong
                  style="
                    color:#2f5d46;
                    font-size:16px;
                    font-weight:700;
                  ">
                  Votre décision
                </strong>

                <br><br>

                ${
                  decision.decision ===
                  "accepte"
                    ? "Proposition acceptée."
                    : "Proposition refusée."
                }

                <br>

                ${escapeValue(
                  decision.createdAtFr ||
                  ""
                )}

              </div>
            `
            : `
              <div
                style="
                  display:flex;
                  gap:8px;
                  flex-wrap:wrap;
                  margin-top:14px;
                ">

                <button
                  class="choiceBtn mutualisationAcceptResponseBtn"
                  type="button"
                  data-response-id="${escapeValue(
                    response.id
                  )}"
                  style="
                    flex:1 1 140px;
                  ">
                  Accepter
                </button>

                <button
                  class="choiceBtn mutualisationRejectResponseBtn"
                  type="button"
                  data-response-id="${escapeValue(
                    response.id
                  )}"
                  style="
                    flex:1 1 140px;
                    background:#fff;
                  ">
                  Refuser
                </button>

              </div>
            `
        }

      </div>
    `;
  }

  function renderPartnerResponses(){

    const host =
      getElement(
        "mutualisationPartnerResponsesList"
      );

    if(!host){
      return;
    }

    const responses =
      getPartnerResponses();

    if(!responses.length){

      host.innerHTML = `
        <div
          class="box entrepriseInfoBox"
          style="
            color:#111;
            font-size:14px;
            font-weight:400;
          ">

          Aucune proposition reçue
          pour le moment.

        </div>
      `;

      return;
    }

    host.innerHTML =
      responses
        .map(
          getResponseCardHtml
        )
        .join("");

    host
      .querySelectorAll(
        ".mutualisationAcceptResponseBtn"
      )
      .forEach(
        function(button){

          button.onclick =
            function(){

              decideResponse(
                button.getAttribute(
                  "data-response-id"
                ),
                "accepte"
              );
            };
        }
      );

    host
      .querySelectorAll(
        ".mutualisationRejectResponseBtn"
      )
      .forEach(
        function(button){

          button.onclick =
            function(){

              decideResponse(
                button.getAttribute(
                  "data-response-id"
                ),
                "refuse"
              );
            };
        }
      );
  }

  function decideResponse(
    responseId,
    decision
  ){

    const response =
      getResponseById(
        responseId
      );

    if(!response){

      alert(
        "Cette proposition est introuvable."
      );

      return;
    }

    const existingDecision =
      getDecisionForResponse(
        responseId
      );

    if(existingDecision){

      alert(
        "Votre décision est déjà enregistrée."
      );

      return;
    }

    const label =
      decision === "accepte"
        ? "accepter"
        : "refuser";

    const confirmation =
      confirm(
        "Confirmer votre décision : " +
        label +
        " cette proposition ?"
      );

    if(!confirmation){
      return;
    }

    if(
      typeof module.recordMutualisationCommitment !==
      "function"
    ){

      alert(
        "Le moteur de décision est indisponible."
      );

      return;
    }

    module.recordMutualisationCommitment(
      responseId,
      decision
    );

    /*
      Si la proposition est acceptée,
      on prépare la suite administrative.

      La facturation réelle restera gérée
      par le backend / service fournisseur.
    */

    if(
      decision === "accepte" &&
      typeof module.queueMutualisationBilling ===
      "function"
    ){

      module.queueMutualisationBilling({

        supplierId:
          response.supplierId || "",

        consultationId:
          response.consultationId || "",

        contractId:
          response.id || "",

        amount:
          0
      });
    }

    renderPartnerResponses();

    alert(
      decision === "accepte"
        ? "Votre acceptation est enregistrée."
        : "Votre refus est enregistré."
    );
  }

  function getPartnerResponsesHtml(){

    return `

      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
          color:#111;
          font-size:14px;
          font-weight:400;
          line-height:1.6;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:10px;
          ">
          Mes réponses reçues
        </strong>

        Les propositions correspondant
        à vos demandes sont regroupées ici.

        <br><br>

        Vous les consultez.

        <br>Vous les comparez.

        <br>Vous décidez.

        <br><br>

        <strong>
          Votre décision reste toujours la vôtre.
        </strong>

      </div>

      <div
        id="mutualisationPartnerResponsesList">
      </div>
    `;
  }

  function openPartnerResponses(){

    module.renderModal(
      "Mes réponses reçues",
      getPartnerResponsesHtml()
    );

    window.setTimeout(
      function(){

        renderPartnerResponses();

      },
      0
    );
  }

  function getDirectionSummaryHtml(){

    const responses =
      getPartnerResponses();

    if(!responses.length){

      return `
        <div class="box entrepriseInfoBox">

          Aucune proposition
          n'est encore enregistrée.

        </div>
      `;
    }

    return `
      <div
        class="box entrepriseInfoBox">

        <strong>
          Propositions reçues :
        </strong>

        ${responses.length}

        <br><br>

        <button
          id="directionOpenMutualisationResponsesBtn"
          class="choiceBtn"
          type="button">

          Consulter les propositions

        </button>

      </div>
    `;
  }

  function bindDirectionProposalButtons(){

    const button =
      getElement(
        "directionOpenMutualisationResponsesBtn"
      );

    if(button){

      button.onclick =
        openPartnerResponses;
    }
  }

  module.openMutualisationVotes =
    openPartnerResponses;

  module.openMutualisationResponses =
    openPartnerResponses;

  module.getDirectionSummaryHtml =
    getDirectionSummaryHtml;

  module.bindDirectionProposalButtons =
    bindDirectionProposalButtons;

  console.log(
    "✅ Réponses fournisseurs et décisions partenaires chargées"
  );

})();
/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 5 — VISIBILITÉ ET ÉCONOMIES
   ========================================================= */

(function initBociteEntrepriseVisibilityAndSavings(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : les parties précédentes doivent être chargées."
    );
    return;
  }

  const VISIBILITY_STORE_KEY =
    "bociteart_entreprise_visibility_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadVisibilityData(){
    try{
      const raw =
        localStorage.getItem(VISIBILITY_STORE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(parsed && typeof parsed === "object"){
        return parsed;
      }
    }catch(error){
      console.warn(
        "Lecture des données de visibilité impossible :",
        error
      );
    }

    return {
      companyName:"",
      activity:"",
      presentation:"",
      knowHow:"",
      services:"",
      website:"",
      phone:"",
      email:"",
      quoteEnabled:false,
      recruitmentEnabled:false,
      patronageEnabled:false,
      newsEnabled:false,
      updatedAt:null,
      updatedAtFr:""
    };
  }

  function saveVisibilityData(data){
    try{
      localStorage.setItem(
        VISIBILITY_STORE_KEY,
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement de la fiche de visibilité impossible :",
        error
      );
    }
  }

function getVisibilityHtml(){

  return `

 <div class="box entrepriseInfoBox">
style="border-left:6px solid #2f5d46;">

<strong style="font-size:19px;">

Connaissez-vous le nom de cinq entreprises présentes dans votre ville ?

</strong>

<br><br>

Probablement pas.

<br><br>

Nous ne parlons pas uniquement
des grandes enseignes,
mais également des artisans,
des entreprises,
des ateliers,
des prestataires,
des professions libérales,
des PME
et des nombreux savoir-faire
présents dans votre commune.

<br><br>

Cette méconnaissance est aujourd'hui
l'un des principaux freins
au développement économique local.

</div>

 <div class="box entrepriseInfoBox">

<strong style="font-size:18px;">

Faites connaître votre entreprise

</strong>

<br><br>

Avant d'acheter ailleurs,
encore faut-il savoir
que votre entreprise existe.

<br><br>

Bo'CitéArt permet
aux habitants,
aux entreprises,
aux commerces,
aux associations
et aux écoles
de découvrir votre activité.

</div>

 <div class="box entrepriseInfoBox">

<strong>

Présentez :

</strong>

<br><br>

• votre activité

<br>

• vos métiers

<br>

• votre savoir-faire

<br>

• vos réalisations

<br>

• vos produits

<br>

• vos services

<br>

• votre histoire

<br>

• vos recrutements

<br>

• vos apprentissages

</div>

 <div class="box entrepriseInfoBox">

Une entreprise connue
a beaucoup plus de chances :

<br><br>

• d'être recommandée

<br>

• de recruter

<br>

• d'être contactée

<br>

• d'obtenir des devis

<br>

• d'être sollicitée

</div>

<div style="display:flex;gap:8px;flex-wrap:wrap;">

<button
id="visibilityPresentationBtn"
class="choiceBtn">

Présenter mon entreprise

</button>

<button
id="visibilityModifyBtn"
class="choiceBtn">

Modifier ma présentation

</button>

<button
id="visibilityDirectoryBtn"
class="choiceBtn">

Voir les entreprises de ma ville

</button>

</div>

`;
}

  function openVisibility(){
    module.renderModal(
      "Faites connaître vos métiers et votre savoir-faire",
      getVisibilityHtml()
    );

    window.setTimeout(function(){
      bindVisibility();
    },0);
  }

  function getSavingsHtml(){
    const summary =
      typeof module.getDirectionSummaryHtml === "function"
        ? module.getDirectionSummaryHtml()
        : `
           <div class="box entrepriseInfoBox">
            Aucune proposition disponible.
          </div>
        `;

    return `
      <div class="box entrepriseInfoBox">
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Comparez, choisissez, validez
        </strong>

        <br><br>

        Recevez des propositions claires
        avant de prendre votre décision.
      </div>

      <div class="box entrepriseInfoBox">
        <strong>Bo'CitéArt organise</strong><br><br>

        Bo'CitéArt prépare la consultation,
        centralise les réponses et présente
        les différentes solutions reçues.

        <br><br>

        L’entreprise compare et décide.
      </div>

       <div class="box entrepriseInfoBox">
        <strong>Un choix visible et simple</strong><br><br>

        Les participants peuvent consulter :

        <br><br>

        • les prestataires ;<br>
        • les propositions ;<br>
        • les délais ;<br>
        • les économies estimées ;<br>
        • les votes déjà enregistrés ;<br>
        • l’état d’avancement.
      </div>

       <div class="box entrepriseInfoBox">
       
        <strong>Une confirmation finale</strong><br><br>

        Le choix reste modifiable
        tant que l’entreprise n’a pas confirmé
        définitivement sa participation.

        <br><br>

        Une fois confirmée,
        la décision devient un engagement.
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button
          id="savingsMutualisationBtn"
          class="choiceBtn"
          type="button">
          Voir les mutualisations
        </button>

        <button
          id="savingsDirectionBtn"
          class="choiceBtn"
          type="button">
          Ouvrir le Tableau de Direction
        </button>
      </div>

      <div
        style="
          margin-top:16px;
          font-weight:900;
          font-size:17px;
        ">
        Propositions suivies
      </div>

      <div
        id="savingsProposalSummary"
        style="margin-top:10px;">
        ${summary}
      </div>
    `;
  }

  function bindSavings(){
    const mutualisationButton =
      getElement("savingsMutualisationBtn");

    const directionButton =
      getElement("savingsDirectionBtn");

    if(mutualisationButton){
      mutualisationButton.onclick = function(){
        module.openScreen("mutualisation");
      };
    }

    if(directionButton){
      directionButton.onclick = function(){
        module.openScreen("direction");
      };
    }

    if(
      typeof module.bindDirectionProposalButtons === "function"
    ){
      module.bindDirectionProposalButtons();
    }
  }

  function openSavings(){
    module.renderModal(
      "Comparez, choisissez, validez",
      getSavingsHtml()
    );

    window.setTimeout(function(){
      bindSavings();
    },0);
  }

  module.registerScreen(
    "visibilite",
    openVisibility
  );

  module.registerScreen(
    "economies",
    openSavings
  );

  module.loadVisibilityData =
    loadVisibilityData;

  module.saveVisibilityData =
    saveVisibilityData;

  if(typeof openVisibilityPreview === "function"){

  module.openVisibilityPreview =
    openVisibilityPreview;
}

  console.log(
    "✅ Module Entreprise — partie 5 chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 6A — PÉRENNITÉ ET TRANSMISSION
   ========================================================= */

(function initBociteEntrepriseSustainability(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : les parties précédentes doivent être chargées."
    );
    return;
  }

  const SUSTAINABILITY_STORE_KEY =
    "bociteart_entreprise_sustainability_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function getDefaultData(){
    return {
      companyName:"",
      projectType:"",
      preferredBuyer:"",
      estimatedDeadline:"",
      accountantContacted:false,
      chamberContacted:false,
      lawyerContacted:false,
      notaryContacted:false,
      valuationStarted:false,
      confidentialNotes:"",
      nextAction:"",
      status:"a_preparer",
      updatedAt:null,
      updatedAtFr:""
    };
  }

  function loadSustainabilityData(){
    try{
      const raw =
        localStorage.getItem(
          SUSTAINABILITY_STORE_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(parsed && typeof parsed === "object"){
        return Object.assign(
          getDefaultData(),
          parsed
        );
      }
    }catch(error){
      console.warn(
        "Lecture des données de pérennité impossible :",
        error
      );
    }

    return getDefaultData();
  }

  function saveSustainabilityData(data){
    try{
      localStorage.setItem(
        SUSTAINABILITY_STORE_KEY,
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement des données de pérennité impossible :",
        error
      );
    }
  }

  function getSustainabilityHtml(){
    const saved =
      loadSustainabilityData();

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Préparez l’avenir de votre entreprise
        </strong>

        <br><br>

        Combien vaut réellement votre entreprise ?

        <br><br>

        À qui souhaitez-vous la transmettre ?

        <br><br>

        À vos enfants, à un salarié
        ou à un repreneur extérieur ?
      </div>

      <div class="box">
        <strong>
          Commencez par faire évaluer l’entreprise
        </strong>

        <br><br>

        Cette première approche est souvent réalisée
        avec votre expert-comptable.

        <br><br>

        Il peut comparer votre entreprise
        avec d’autres structures de taille
        et d’activité proches dans le même bassin économique.
      </div>

      <div class="box">
        <strong>
          Le chiffre d’affaires ne suffit pas
        </strong>

        <br><br>

        La valeur dépend également :

        <br><br>

        • de la rentabilité ;<br>
        • de la clientèle ;<br>
        • de l’équipe ;<br>
        • de la réputation ;<br>
        • du matériel ;<br>
        • de l’organisation ;<br>
        • des contrats ;<br>
        • du savoir-faire ;<br>
        • de la dépendance au dirigeant.
      </div>

      <div class="box">
        <strong>
          Petit ou très gros, les critères restent comparables
        </strong>

        <br><br>

        L’échelle change, mais la logique demeure la même.

        <br><br>

        Une entreprise se valorise par ce qu’elle produit,
        ce qu’elle gagne, ce qu’elle possède
        et sa capacité à continuer sans perdre sa valeur.
      </div>

      <div class="box">
        <strong>
          Parlez-en d’abord discrètement
        </strong>

        <br><br>

        Avec vos proches, puis avec votre expert-comptable
        afin d’obtenir une première approche chiffrée.

        <br><br>

        La CCI, la CMA et les réseaux professionnels
        disposent également de services consacrés
        à la transmission et à la reprise.

        <br><br>

        Les consulter ne vous engage à rien.
      </div>

      <div class="box">
        <strong>
          Plusieurs chemins sont possibles
        </strong>

        <br><br>

        Vente complète, transmission familiale,
        reprise par un salarié, cession progressive,
        maintien d’une partie de la propriété
        ou organisation de la succession.

        <br><br>

        Selon le projet, un avocat spécialisé
        ou un notaire pourra vous accompagner.
      </div>

      <div class="box">
        <strong>
          Faire connaître l’entreprise compte aussi
        </strong>

        <br><br>

        Chaque année, des entreprises disparaissent
        faute de repreneur.

        <br><br>

        Parfois simplement parce que personne
        ne connaissait réellement leur activité.

        <br><br>

        Faire connaître votre métier aujourd’hui,
        c’est aussi préparer demain.
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button
          id="sustainabilityVisibilityBtn"
          class="choiceBtn"
          type="button">
          Faire connaître mon entreprise
        </button>

        <button
          id="sustainabilityDirectoryBtn"
          class="choiceBtn"
          type="button">
          Rechercher un expert local
        </button>

        <button
          id="sustainabilityDevelopmentBtn"
          class="choiceBtn"
          type="button">
          Préparer un plan d’action
        </button>
      </div>

      <div
        class="box"
        style="margin-top:14px;">

        <strong style="font-size:17px;">
          Mon projet de transmission ou de continuité
        </strong>

        <br><br>

        Cet espace reste réservé à l’entreprise.
      </div>

      <label style="display:block;font-weight:900;">
        Nom de l’entreprise
      </label>

      <input
        id="sustainabilityCompanyName"
        class="miniField"
        type="text"
        value="${escapeValue(saved.companyName || "")}"
        placeholder="Nom de l’entreprise">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Quel projet envisagez-vous ?
      </label>

      <select
        id="sustainabilityProjectType"
        class="miniField">

        <option value="">
          Choisir
        </option>

        <option value="transmission_familiale">
          Transmission familiale
        </option>

        <option value="reprise_salarie">
          Reprise par un salarié
        </option>

        <option value="vente_exterieure">
          Vente à un repreneur extérieur
        </option>

        <option value="cession_progressive">
          Cession progressive
        </option>

        <option value="succession">
          Préparation de la succession
        </option>

        <option value="continuité">
          Assurer la continuité de l’activité
        </option>

        <option value="indecis">
          Je ne sais pas encore
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        À qui souhaiteriez-vous transmettre l’entreprise ?
      </label>

      <select
        id="sustainabilityPreferredBuyer"
        class="miniField">

        <option value="">
          Choisir
        </option>

        <option value="enfant">
          À un enfant ou membre de la famille
        </option>

        <option value="salarie">
          À un salarié
        </option>

        <option value="associe">
          À un associé
        </option>

        <option value="exterieur">
          À un repreneur extérieur
        </option>

        <option value="inconnu">
          Je ne sais pas encore
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Échéance envisagée
      </label>

      <input
        id="sustainabilityDeadline"
        class="miniField"
        type="date"
        value="${escapeValue(
          saved.estimatedDeadline || ""
        )}">

      <div class="box" style="margin-top:12px;">
        <strong>Démarches déjà engagées</strong>

        <label class="miniCheck">
          <input
            id="sustainabilityAccountant"
            type="checkbox"
            ${saved.accountantContacted ? "checked" : ""}>

          <span>
            J’en ai parlé à mon expert-comptable
          </span>
        </label>

        <label class="miniCheck">
          <input
            id="sustainabilityChamber"
            type="checkbox"
            ${saved.chamberContacted ? "checked" : ""}>

          <span>
            J’ai contacté la CCI, la CMA
            ou ma chambre professionnelle
          </span>
        </label>

        <label class="miniCheck">
          <input
            id="sustainabilityLawyer"
            type="checkbox"
            ${saved.lawyerContacted ? "checked" : ""}>

          <span>
            J’ai consulté un avocat spécialisé
          </span>
        </label>

        <label class="miniCheck">
          <input
            id="sustainabilityNotary"
            type="checkbox"
            ${saved.notaryContacted ? "checked" : ""}>

          <span>
            J’ai consulté un notaire
          </span>
        </label>

        <label class="miniCheck">
          <input
            id="sustainabilityValuation"
            type="checkbox"
            ${saved.valuationStarted ? "checked" : ""}>

          <span>
            Une première valorisation a été engagée
          </span>
        </label>
      </div>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Notes confidentielles
      </label>

      <textarea
        id="sustainabilityNotes"
        class="miniField"
        style="min-height:110px;"
        placeholder="Indiquez ici les éléments utiles à votre réflexion.">${escapeValue(saved.confidentialNotes || "")}</textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Prochaine action à réaliser
      </label>

      <textarea
        id="sustainabilityNextAction"
        class="miniField"
        style="min-height:90px;"
        placeholder="Exemple : prendre rendez-vous avec l’expert-comptable.">${escapeValue(saved.nextAction || "")}</textarea>

      <button
        id="sustainabilitySaveBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Enregistrer mon projet
      </button>

      <button
        id="sustainabilitySummaryBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Consulter mon récapitulatif
      </button>

      <div
        id="sustainabilityStatus"
        class="muted"
        style="margin-top:10px;">
      </div>
    `;
  }

  function restoreSelectValues(){
    const saved =
      loadSustainabilityData();

    const project =
      getElement("sustainabilityProjectType");

    const buyer =
      getElement("sustainabilityPreferredBuyer");

    if(project && saved.projectType){
      project.value = saved.projectType;
    }

    if(buyer && saved.preferredBuyer){
      buyer.value = saved.preferredBuyer;
    }
  }

  function saveSustainabilityForm(){
    const companyName =
      String(
        getElement("sustainabilityCompanyName")
          ? getElement("sustainabilityCompanyName").value
          : ""
      ).trim();

    const projectType =
      String(
        getElement("sustainabilityProjectType")
          ? getElement("sustainabilityProjectType").value
          : ""
      ).trim();

    const preferredBuyer =
      String(
        getElement("sustainabilityPreferredBuyer")
          ? getElement("sustainabilityPreferredBuyer").value
          : ""
      ).trim();

    const estimatedDeadline =
      String(
        getElement("sustainabilityDeadline")
          ? getElement("sustainabilityDeadline").value
          : ""
      ).trim();

    const confidentialNotes =
      String(
        getElement("sustainabilityNotes")
          ? getElement("sustainabilityNotes").value
          : ""
      ).trim();

    const nextAction =
      String(
        getElement("sustainabilityNextAction")
          ? getElement("sustainabilityNextAction").value
          : ""
      ).trim();

    if(!companyName){
      alert(
        "Indiquez le nom de l’entreprise."
      );
      return;
    }

    if(!projectType){
      alert(
        "Choisissez le projet que vous envisagez."
      );
      return;
    }

    if(!nextAction){
      alert(
        "Indiquez au moins votre prochaine action."
      );
      return;
    }

    const data = {
      companyName:companyName,
      projectType:projectType,
      preferredBuyer:preferredBuyer,
      estimatedDeadline:estimatedDeadline,

      accountantContacted:
        !!(
          getElement("sustainabilityAccountant") &&
          getElement("sustainabilityAccountant").checked
        ),

      chamberContacted:
        !!(
          getElement("sustainabilityChamber") &&
          getElement("sustainabilityChamber").checked
        ),

      lawyerContacted:
        !!(
          getElement("sustainabilityLawyer") &&
          getElement("sustainabilityLawyer").checked
        ),

      notaryContacted:
        !!(
          getElement("sustainabilityNotary") &&
          getElement("sustainabilityNotary").checked
        ),

      valuationStarted:
        !!(
          getElement("sustainabilityValuation") &&
          getElement("sustainabilityValuation").checked
        ),

      confidentialNotes:confidentialNotes,
      nextAction:nextAction,
      status:"en_cours",
      updatedAt:Date.now(),
      updatedAtFr:
        new Date().toLocaleString("fr-FR")
    };

    saveSustainabilityData(data);

    const status =
      getElement("sustainabilityStatus");

    if(status){
      status.textContent =
        "Projet enregistré le " +
        data.updatedAtFr +
        ".";
    }

    alert(
      "Votre projet a été enregistré dans votre espace professionnel."
    );
  }

  function getProjectLabel(value){
    const labels = {
      transmission_familiale:
        "Transmission familiale",

      reprise_salarie:
        "Reprise par un salarié",

      vente_exterieure:
        "Vente à un repreneur extérieur",

      cession_progressive:
        "Cession progressive",

      succession:
        "Préparation de la succession",

      continuité:
        "Continuité de l’activité",

      indecis:
        "Projet encore indécis"
    };

    return labels[value] || "Non renseigné";
  }

  function getBuyerLabel(value){
    const labels = {
      enfant:
        "Enfant ou membre de la famille",

      salarie:
        "Salarié",

      associe:
        "Associé",

      exterieur:
        "Repreneur extérieur",

      inconnu:
        "Non déterminé"
    };

    return labels[value] || "Non renseigné";
  }

  function getStepsList(data){
    const steps = [];

    if(data.accountantContacted){
      steps.push(
        "Expert-comptable contacté"
      );
    }

    if(data.chamberContacted){
      steps.push(
        "Chambre professionnelle contactée"
      );
    }

    if(data.lawyerContacted){
      steps.push(
        "Avocat spécialisé consulté"
      );
    }

    if(data.notaryContacted){
      steps.push(
        "Notaire consulté"
      );
    }

    if(data.valuationStarted){
      steps.push(
        "Valorisation engagée"
      );
    }

    return steps.length
      ? steps.join("<br>")
      : "Aucune démarche renseignée";
  }

  function openSustainabilitySummary(){
    const data =
      loadSustainabilityData();

    if(
      !data.companyName ||
      !data.projectType
    ){
      alert(
        "Aucun projet n’est encore enregistré."
      );
      return;
    }

    module.renderModal(
      "Mon projet de pérennité",
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            ${escapeValue(data.companyName)}
          </strong>
        </div>

        <div class="box">
          <strong>Projet envisagé</strong><br><br>

          ${escapeValue(
            getProjectLabel(data.projectType)
          )}
        </div>

        <div class="box">
          <strong>Repreneur envisagé</strong><br><br>

          ${escapeValue(
            getBuyerLabel(data.preferredBuyer)
          )}
        </div>

        <div class="box">
          <strong>Échéance</strong><br><br>

          ${escapeValue(
            data.estimatedDeadline ||
            "Non renseignée"
          )}
        </div>

        <div class="box">
          <strong>Démarches engagées</strong><br><br>

          ${getStepsList(data)}
        </div>

        <div class="box">
          <strong>Notes confidentielles</strong><br><br>

          ${escapeValue(
            data.confidentialNotes ||
            "Aucune note"
          )}
        </div>

        <div class="box">
          <strong>Prochaine action</strong><br><br>

          ${escapeValue(
            data.nextAction ||
            "Non renseignée"
          )}
        </div>

        <div class="box">
          <strong>Dernière mise à jour</strong><br><br>

          ${escapeValue(
            data.updatedAtFr || ""
          )}
        </div>
      `
    );
  }

  function bindSustainability(){
    const visibilityButton =
      getElement(
        "sustainabilityVisibilityBtn"
      );

    const directoryButton =
      getElement(
        "sustainabilityDirectoryBtn"
      );

    const developmentButton =
      getElement(
        "sustainabilityDevelopmentBtn"
      );

    const saveButton =
      getElement(
        "sustainabilitySaveBtn"
      );

    const summaryButton =
      getElement(
        "sustainabilitySummaryBtn"
      );

    if(visibilityButton){
      visibilityButton.onclick = function(){
        module.openScreen("visibilite");
      };
    }

    if(directoryButton){
      directoryButton.onclick = function(){
        module.openScreen("annuaire");
      };
    }

    if(developmentButton){
      developmentButton.onclick = function(){
        module.openScreen("developpement");
      };
    }

    if(saveButton){
      saveButton.onclick =
        saveSustainabilityForm;
    }

    if(summaryButton){
      summaryButton.onclick =
        openSustainabilitySummary;
    }

    restoreSelectValues();

    const saved =
      loadSustainabilityData();

    const status =
      getElement("sustainabilityStatus");

    if(
      status &&
      saved.updatedAtFr
    ){
      status.textContent =
        "Dernière mise à jour : " +
        saved.updatedAtFr +
        ".";
    }
  }

  function openSustainability(){

    module.renderModal(
      "Préparez l’avenir de votre entreprise",
      getSustainabilityHtml(),
      {
        presentationFooter:true
      }
    );

    window.setTimeout(function(){

      bindSustainability();

    },0);
  }

  module.registerScreen(
    "perennite",
    openSustainability
  );

  module.loadSustainabilityData =
    loadSustainabilityData;

  module.saveSustainabilityData =
    saveSustainabilityData;

  module.openSustainabilitySummary =
    openSustainabilitySummary;

  console.log(
    "✅ Module Entreprise — partie 6A chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 7 — TABLEAU DE DIRECTION V3
   MENU PRIVÉ UNIQUE
   ========================================================= */

(function initBociteEntrepriseDirection(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );

    return;
  }


  function getElement(id){

    return document.getElementById(id);
  }


  /* =======================================================
     STYLE DU MENU
     ======================================================= */

  function injectDirectionStyles(){

    if(
      document.getElementById(
        "bociteDirectionMenuStylesV3"
      )
    ){
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "bociteDirectionMenuStylesV3";


    style.textContent = `

      .bociteDirectionMenuIntro{
        background:#ffffff !important;
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.5 !important;
        border-left:6px solid #2f5d46;
      }

      .bociteDirectionMenuTitle{
        color:#2f5d46 !important;
        font-size:17px !important;
        font-weight:800 !important;
        line-height:1.35 !important;
      }

      .bociteDirectionMenuBtn{
        width:100%;
        margin-top:8px;
        padding:13px 12px;
        background:#ffffff !important;
        background-color:#ffffff !important;
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        text-align:left;
      }

    .bociteDirectionMenuBtn strong{
  display:block;
  color:#2f5d46 !important;
  font-size:17px !important;
  font-weight:700 !important;
  line-height:1.25 !important;
  margin-bottom:3px;
}

      .bociteDirectionMenuBtn span{
        display:block;
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.4;
      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  injectDirectionStyles();


  /* =======================================================
     PUBLICITÉ
     ======================================================= */

function openAdvertising(){

  if(
    typeof module.openScreen ===
    "function"
  ){

    module.openScreen(
      "publicite"
    );

    return;
  }

  alert(
    "L'espace publicité est momentanément indisponible."
  );
}


  /* =======================================================
     COLLABORATEURS
     ======================================================= */

 function openCollaborators(){

  if(
    typeof module.openScreen ===
    "function"
  ){

    module.openScreen(
      "collaborateurs"
    );

    return;
  }

  alert(
    "L'espace collaborateurs est momentanément indisponible."
  );
}

  /* =======================================================
     ANNUAIRE
     ======================================================= */

 function openDirectory(){

  if(
    typeof module.openScreen ===
    "function"
  ){

    module.openScreen(
      "annuaire"
    );

    return;
  }

  alert(
    "L'annuaire professionnel est momentanément indisponible."
  );
}

  /* =======================================================
     PAYER MOINS DE CHARGES
     ======================================================= */

function openLowerCharges(){

  if(
    typeof module.openScreen ===
    "function"
  ){

    module.openScreen(
      "mutualisation"
    );

    return;
  }

  alert(
    "L'espace Payer moins de charges est momentanément indisponible."
  );
}

  /* =======================================================
     EMPLOI
     ======================================================= */

function openEmployment(){

  if(
    typeof module.openScreen ===
    "function"
  ){

    module.openScreen(
      "emploi"
    );

    return;
  }

  alert(
    "L'espace Emploi et recrutement est momentanément indisponible."
  );
}

  /* =======================================================
     VISIBILITÉ / ACTUALITÉS
     ======================================================= */

 function openVisibility(){

  if(
    typeof module.openScreen ===
    "function"
  ){

    module.openScreen(
      "visibilite"
    );

    return;
  }

  alert(
    "L'espace visibilité est momentanément indisponible."
  );
}

  /* =======================================================
     ABONNEMENT / FACTURES
     ======================================================= */

 function openSubscription(){

  if(
    typeof module.openScreen ===
    "function"
  ){

    module.openScreen(
      "abonnement"
    );

    return;
  }

  alert(
    "L'espace Abonnement et factures est momentanément indisponible."
  );
}

  /* =======================================================
     CONTENU DU TABLEAU DE DIRECTION
     ======================================================= */

  function getDirectionHtml(){

    return `

      <div
        class="
          box
          bociteDirectionMenuIntro
        ">

        <div
          class="bociteDirectionMenuTitle">
          Tableau de Direction
        </div>

        <div
          style="
            margin-top:7px;
            font-size:14px;
            font-weight:400;
            color:#111111;
          ">
          Choisissez la rubrique
          que vous souhaitez ouvrir.
        </div>

      </div>


      <button
        id="directionDirectoryBtn"
        class="
          choiceBtn
          bociteDirectionMenuBtn
        "
        type="button">

        <strong>
          1 — Annuaire professionnel
        </strong>

        <span>
          Recherches • entreprises suivies • informations
        </span>

      </button>


      <button
        id="directionCollaboratorsBtn"
        class="
          choiceBtn
          bociteDirectionMenuBtn
        "
        type="button">

        <strong>
          2 — Mes collaborateurs
        </strong>

        <span>
          Accès 1 • Accès 2 • autorisations
        </span>

      </button>


      <button
        id="directionAdvertisingBtn"
        class="
          choiceBtn
          bociteDirectionMenuBtn
        "
        type="button">

        <strong>
          3 — Publicité
        </strong>

        <span>
          Créer • modifier • programmer • payer • suivre
        </span>

      </button>


      <button
        id="directionLowerChargesBtn"
        class="
          choiceBtn
          bociteDirectionMenuBtn
        "
        type="button">

        <strong>
          4 — Payer moins de charges
        </strong>

        <span>
          Propositions • compteurs • entreprises intéressées • suivi
        </span>

      </button>


      <button
        id="directionEmploymentBtn"
        class="
          choiceBtn
          bociteDirectionMenuBtn
        "
        type="button">

        <strong>
          5 — Emploi et recrutement
        </strong>

        <span>
          Offres • candidatures • historique
        </span>

      </button>


      <button
        id="directionVisibilityBtn"
        class="
          choiceBtn
          bociteDirectionMenuBtn
        "
        type="button">

        <strong>
          6 — Visibilité et actualités
        </strong>

        <span>
          Publications • actualités • suivi
        </span>

      </button>


      <button
        id="directionSubscriptionBtn"
        class="
          choiceBtn
          bociteDirectionMenuBtn
        "
        type="button">

        <strong>
          7 — Abonnement et factures
        </strong>

        <span>
          Abonnement • paiements • factures
        </span>

      </button>

    `;
  }


  /* =======================================================
     RACCORDEMENT DES 7 RUBRIQUES
     ======================================================= */

  function bindDirection(){

    const directoryButton =
      getElement(
        "directionDirectoryBtn"
      );


    const collaboratorsButton =
      getElement(
        "directionCollaboratorsBtn"
      );


    const advertisingButton =
      getElement(
        "directionAdvertisingBtn"
      );


    const lowerChargesButton =
      getElement(
        "directionLowerChargesBtn"
      );


    const employmentButton =
      getElement(
        "directionEmploymentBtn"
      );


    const visibilityButton =
      getElement(
        "directionVisibilityBtn"
      );


    const subscriptionButton =
      getElement(
        "directionSubscriptionBtn"
      );


    if(directoryButton){

      directoryButton.onclick =
        openDirectory;
    }


    if(collaboratorsButton){

      collaboratorsButton.onclick =
        openCollaborators;
    }


    if(advertisingButton){

      advertisingButton.onclick =
        openAdvertising;
    }


    if(lowerChargesButton){

      lowerChargesButton.onclick =
        openLowerCharges;
    }


    if(employmentButton){

      employmentButton.onclick =
        openEmployment;
    }


    if(visibilityButton){

      visibilityButton.onclick =
        openVisibility;
    }


    if(subscriptionButton){

      subscriptionButton.onclick =
        openSubscription;
    }
  }


  /* =======================================================
     OUVERTURE DU TABLEAU DE DIRECTION
     ======================================================= */

  function openDirection(){

    module.renderModal(
      "Tableau de Direction",
      getDirectionHtml()
    );


    window.setTimeout(
      function(){

        bindDirection();

      },
      0
    );
  }


  module.registerScreen(
    "direction",
    openDirection
  );


  module.openDirection =
    openDirection;


  console.log(
    "✅ Tableau de Direction V3 — menu 7 rubriques chargé"
  );

})();
/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 8 — RACCORDEMENT
   ========================================================= */

(function connectBociteEntrepriseModule(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){

    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );

    return;
  }

  if(window.BOCITEART_ENTREPRISE_CONNECTED){
    return;
  }

  window.BOCITEART_ENTREPRISE_CONNECTED =
    true;

  function openEntrepriseModule(event){

    if(event){

      event.preventDefault();
      event.stopPropagation();

      /* =====================================================
   RETOUR DES PAGES PRIVÉES
   → TABLEAU DE DIRECTION
   ===================================================== */

const directionScreens = [
  "annuaire",
  "collaborateurs",
  "publicite",
  "mutualisation",
  "emploi",
  "visibilite",
  "abonnement"
];

if(
  directionScreens.includes(
    state.currentScreen
  )
){

  if(
    typeof window.BociteEntreprise
      .openDirection ===
    "function"
  ){

    window.BociteEntreprise
      .openDirection();

    return;
  }

  if(
    screens.direction &&
    typeof screens.direction ===
    "function"
  ){

    openScreen(
      "direction",
      {
        fromBack:true
      }
    );

    return;
  }
} 

      if(
        typeof event.stopImmediatePropagation ===
        "function"
      ){
        event.stopImmediatePropagation();
      }
    }

    /*
      Premier choix :
      écran officiel d’introduction Entreprise.
    */
     if(
  app.state
){

  app.state.currentScreen =
    "commerces";

  app.state.history = [];
}
     
     if(
      app.screens &&
      typeof app.screens.introductionEntreprise ===
      "function"
    ){

      app.openScreen(
        "introductionEntreprise"
      );

      return;
    }

    /*
      Deuxième choix :
      fonction officielle fournie
      par entreprise-accueil.js.
    */

    if(
      typeof app.openEntrepriseIntroduction ===
      "function"
    ){

      app.openEntrepriseIntroduction();

      return;
    }

    /*
      Compatibilité avec l’ancienne version
      de entreprise-accueil.js.
    */

    if(
      app.screens &&
      typeof app.screens.accueil ===
      "function"
    ){

      app.openScreen(
        "accueil"
      );

      return;
    }

    /*
      Dernier recours seulement.
    */

    if(
      typeof app.openHome ===
      "function"
    ){

      app.openHome();
    }
  }

  document.addEventListener(
    "click",
    function(event){

      const target =
        event.target &&
        typeof event.target.closest ===
        "function"
          ? event.target.closest(
              '[data-commerce-space="entreprise"],' +
              '#openEntrepriseSpace,' +
              '[data-open-entreprise]'
            )
          : null;

      if(!target){
        return;
      }

      openEntrepriseModule(event);

    },
    true
  );

 window.openEntrepriseSpace =
openEntrepriseModule;

/*
  Écran extérieur au module Entreprise :
  page générale Commerces & Entreprises.

  Il permet au moteur de navigation Entreprise
  de retrouver correctement cette page
  lorsque l'on revient depuis l'introduction.
*/

if(
  typeof app.registerScreen ===
  "function"
){

  app.registerScreen(
    "commerces",
    function(){

      if(
        typeof window.__bociteartOpenByKey ===
        "function"
      ){

        window.__bociteartOpenByKey(
          "commerces"
        );

      }

    }
  );

}

      console.log(
      "✅ Module Entreprise raccordé à son introduction"
    );
   
})();

/* =========================================================
   BO'CITÉART — RECHERCHE PROFESSIONNELLE PRIVÉE
   COMMUNE INDÉPENDANTE • FRANCE • EUROPE
   ========================================================= */

(function patchBociteEntrepriseDirectoryV2(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const SEARCH_PLAN_KEY =
    "bociteart_entreprise_search_plan_v1";

  const SEARCH_CITY_KEY =
    "bociteart_entreprise_search_city_v2";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function normalizeText(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-_/]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function loadSearchPlan(){
    try{
      const raw =
        localStorage.getItem(SEARCH_PLAN_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(parsed && typeof parsed === "object"){
        return parsed;
      }
    }catch(error){
      console.warn(
        "Lecture de l’abonnement impossible :",
        error
      );
    }

    return {
      plan:"commune",
      active:true
    };
  }

  function saveSearchPlan(data){
    try{
      localStorage.setItem(
        SEARCH_PLAN_KEY,
        JSON.stringify(data || {})
      );
    }catch(error){
      console.warn(
        "Enregistrement de l’abonnement impossible :",
        error
      );
    }
  }

  function loadIndependentCity(){
    return (
      localStorage.getItem(SEARCH_CITY_KEY) ||
      "Wattignies"
    );
  }

  function saveIndependentCity(city){
    try{
      localStorage.setItem(
        SEARCH_CITY_KEY,
        city
      );
    }catch(error){}
  }

  const tradeDictionary = {
    "macon":[
      "maçon",
      "macon",
      "masonry",
      "mason",
      "bricklayer",
      "construction",
      "building"
    ],

    "carreleur":[
      "carreleur",
      "tiler",
      "tiling",
      "tiles",
      "flooring",
      "carrelage"
    ],

    "electricien":[
      "électricien",
      "electricien",
      "electrician",
      "electrical",
      "electricity"
    ],

    "plombier":[
      "plombier",
      "plumber",
      "plumbing",
      "sanitary"
    ],

    "menuisier":[
      "menuisier",
      "carpenter",
      "joiner",
      "wood",
      "menuiserie"
    ],

    "couvreur":[
      "couvreur",
      "roofer",
      "roofing",
      "toiture"
    ],

    "peintre":[
      "peintre",
      "painter",
      "painting",
      "peinture"
    ],

    "avocat":[
      "avocat",
      "lawyer",
      "solicitor",
      "legal"
    ],

    "comptable":[
      "comptable",
      "accountant",
      "accounting",
      "expertise comptable"
    ],

    "transporteur":[
      "transporteur",
      "transport",
      "logistics",
      "logistique",
      "freight"
    ],

    "nettoyage":[
      "nettoyage",
      "cleaning",
      "cleaner",
      "entretien",
      "propreté"
    ],

    "vitres":[
      "vitres",
      "vitrage",
      "window cleaning",
      "cleaning",
      "nettoyage"
    ],

    "repreneur":[
      "repreneur",
      "reprise entreprise",
      "transmission entreprise",
      "business transfer",
      "business buyer"
    ]
  };

  function expandKeyword(keyword){
    const normalized =
      normalizeText(keyword);

    const words = [normalized];

    Object.keys(tradeDictionary)
      .forEach(function(key){

        const aliases =
          tradeDictionary[key].map(
            normalizeText
          );

        if(
          normalized.includes(key) ||
          aliases.some(function(alias){
            return (
              normalized.includes(alias) ||
              alias.includes(normalized)
            );
          })
        ){
          words.push(key);

          tradeDictionary[key]
            .forEach(function(alias){
              words.push(
                normalizeText(alias)
              );
            });
        }
      });

    return Array.from(
      new Set(
        words.filter(Boolean)
      )
    );
  }

  function getSearchHtml(){
    const plan =
      loadSearchPlan();

    const savedCity =
      loadIndependentCity();

    return `
      <style>
        .professionalSearchPlan {
          display:block;
          width:100%;
          margin-top:8px;
          padding:12px;
          border:2px solid #2f5d46;
          border-radius:10px;
          background:#fffaf1;
          color:#111;
          text-align:left;
          cursor:pointer;
        }

        .professionalSearchPlan.active {
          background:#edf6ef;
          outline:3px solid rgba(47,93,70,.20);
        }

        .professionalSearchPrice {
          display:block;
          margin-top:6px;
          color:#2f5d46;
          font-weight:900;
        }

        .professionalSearchLocked {
          display:inline-block;
          margin-left:6px;
          padding:2px 7px;
          border-radius:999px;
          background:#b00020;
          color:#fff;
          font-size:12px;
          font-weight:900;
        }

        .professionalResultCard {
          margin-top:10px;
          padding:12px;
          border:2px solid #2f5d46;
          border-radius:10px;
          background:#fff;
        }
      </style>

      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Recherche professionnelle privée
        </strong>

        <br><br>

        Cette recherche appartient à l’espace sécurisé
        de votre entreprise.

        <br><br>

        Le métier recherché, la commune choisie,
        l’historique et les résultats ne sont pas visibles
        par les habitants ni par les autres entreprises.

        <br><br>

        La ville choisie ici est indépendante
        de la carte, du Sport et de l’onglet
        « Explorer les alentours ».
      </div>

      <label style="display:block;font-weight:900;">
        Que recherchez-vous ?
      </label>

      <input
        id="professionalSearchKeyword"
        class="miniField"
        type="search"
        placeholder="Exemple : maçon, carreleur, avocat, transporteur">

      <label
        style="
          display:block;
          margin-top:12px;
          font-weight:900;
        ">
        Dans quelle commune souhaitez-vous chercher ?
      </label>

      <input
        id="professionalSearchCity"
        class="miniField"
        type="text"
        value="${escapeValue(savedCity)}"
        placeholder="Exemple : Wattignies, Lille, Bordeaux">

      <div class="muted" style="margin-top:6px;">
        Vous pouvez modifier cette ville à chaque recherche.
      </div>

      <label
        style="
          display:block;
          margin-top:14px;
          font-weight:900;
        ">
        Étendue de la recherche
      </label>

      <button
        class="professionalSearchPlan active"
        type="button"
        data-search-zone="commune">

        <strong>
          Commune choisie
        </strong>

        <span class="professionalSearchPrice">
          Inclus
        </span>
      </button>

      <button
        class="professionalSearchPlan"
        type="button"
        data-search-zone="france">

        <strong>
          France
        </strong>

        ${
          plan.plan !== "france" &&
          plan.plan !== "europe"
            ? `
              <span class="professionalSearchLocked">
                Abonnement
              </span>
            `
            : ""
        }

        <span class="professionalSearchPrice">
          26,50 € HT par mois
          ou 300 € HT par an
        </span>
      </button>

      <button
        class="professionalSearchPlan"
        type="button"
        data-search-zone="europe">

        <strong>
          Europe
        </strong>

        ${
          plan.plan !== "europe"
            ? `
              <span class="professionalSearchLocked">
                Abonnement
              </span>
            `
            : ""
        }

        <span class="professionalSearchPrice">
          44,90 € HT par mois
          ou 500 € HT par an
        </span>
      </button>

      <div
        id="professionalFranceFields"
        style="display:none;margin-top:12px;">

        <label style="display:block;font-weight:900;">
          Périmètre en France
        </label>

        <select
          id="professionalFranceScope"
          class="miniField">

          <option value="commune">
            Commune indiquée
          </option>

          <option value="20">
            Rayon de 20 km
          </option>

          <option value="50">
            Rayon de 50 km
          </option>

          <option value="departement">
            Département
          </option>

          <option value="region">
            Région
          </option>

          <option value="france">
            Toute la France
          </option>
        </select>
      </div>

      <div
        id="professionalEuropeFields"
        style="display:none;margin-top:12px;">

        <label style="display:block;font-weight:900;">
          Pays
        </label>

        <select
          id="professionalEuropeCountry"
          class="miniField">

          <option value="France">France</option>
          <option value="Belgique">Belgique</option>
          <option value="Luxembourg">Luxembourg</option>
          <option value="Pays-Bas">Pays-Bas</option>
          <option value="Allemagne">Allemagne</option>
          <option value="Espagne">Espagne</option>
          <option value="Italie">Italie</option>
          <option value="Portugal">Portugal</option>
          <option value="Suisse">Suisse</option>
          <option value="Autriche">Autriche</option>
          <option value="Irlande">Irlande</option>
          <option value="Danemark">Danemark</option>
          <option value="Suède">Suède</option>
          <option value="Finlande">Finlande</option>
          <option value="Pologne">Pologne</option>
          <option value="Tchéquie">Tchéquie</option>
        </select>
      </div>

      <button
        id="professionalSearchBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
          font-size:17px;
        ">
        Rechercher
      </button>

      <button
        id="professionalClearSearchBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Effacer la recherche
      </button>

      <button
        id="professionalBillingOpenBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Mon abonnement et mes factures
      </button>

      <div
        id="professionalSearchStatus"
        class="muted"
        style="margin-top:10px;">
      </div>

      <div
        id="professionalSearchResults"
        style="margin-top:12px;">
      </div>

      <div
        id="professionalSubscriptionBox"
        style="display:none;margin-top:12px;">
      </div>
    `;
  }

  function getCurrentZone(){
    const selected =
      document.querySelector(
        ".professionalSearchPlan.active"
      );

    return selected
      ? selected.getAttribute("data-search-zone")
      : "commune";
  }

  function selectSearchZone(zone){
    document
      .querySelectorAll(".professionalSearchPlan")
      .forEach(function(button){

        button.classList.toggle(
          "active",
          button.getAttribute("data-search-zone") === zone
        );
      });

    const franceFields =
      getElement("professionalFranceFields");

    const europeFields =
      getElement("professionalEuropeFields");

    if(franceFields){
      franceFields.style.display =
        zone === "france"
          ? "block"
          : "none";
    }

    if(europeFields){
      europeFields.style.display =
        zone === "europe"
          ? "block"
          : "none";
    }

    const results =
      getElement("professionalSearchResults");

    if(results){
      results.innerHTML = "";
    }
  }

  function hasAccessToZone(zone){
    const plan =
      loadSearchPlan();

    if(zone === "commune"){
      return true;
    }

    if(zone === "france"){
      return !!(
        plan.active &&
        (
          plan.plan === "france" ||
          plan.plan === "europe"
        )
      );
    }

    if(zone === "europe"){
      return !!(
        plan.active &&
        plan.plan === "europe"
      );
    }

    return false;
  }

  function getSubscriptionHtml(zone){
    const europe =
      zone === "europe";

    return `
      <div
        class="box"
        style="border-left:6px solid #b00020;">

        <strong style="font-size:18px;">
          ${
            europe
              ? "Recherche professionnelle Europe"
              : "Recherche professionnelle France"
          }
        </strong>

        <br><br>

        Cette zone nécessite un abonnement actif.

        <br><br>

        <strong>
          ${
            europe
              ? "44,90 € HT par mois ou 500 € HT par an"
              : "26,50 € HT par mois ou 300 € HT par an"
          }
        </strong>

        <br><br>

        La recherche dans la commune choisie
        reste accessible sans cette option.
      </div>

      <button
        class="choiceBtn"
        id="professionalMonthlySubscribeBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Choisir l’abonnement mensuel
      </button>

      <button
        class="choiceBtn"
        id="professionalAnnualSubscribeBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Choisir l’abonnement annuel
      </button>
    `;
  }

  function showSubscription(zone){
    const host =
      getElement("professionalSubscriptionBox");

    if(!host){
      return;
    }

    host.style.display = "block";
    host.innerHTML =
      getSubscriptionHtml(zone);

    const monthly =
      getElement("professionalMonthlySubscribeBtn");

    const annual =
      getElement("professionalAnnualSubscribeBtn");

    if(monthly){
      monthly.onclick = function(){
        if(
          typeof module.activateSearchSubscription === "function"
        ){
          module.activateSearchSubscription(
            zone,
            "mensuel"
          );
        }else{
          alert(
            "La gestion de l’abonnement est momentanément indisponible."
          );
        }
      };
    }

    if(annual){
      annual.onclick = function(){
        if(
          typeof module.activateSearchSubscription === "function"
        ){
          module.activateSearchSubscription(
            zone,
            "annuel"
          );
        }else{
          alert(
            "La gestion de l’abonnement est momentanément indisponible."
          );
        }
      };
    }

    host.scrollIntoView({
      behavior:"smooth",
      block:"nearest"
    });
  }

  function getSearchLocation(zone){
    const cityInput =
      getElement("professionalSearchCity");

    const city =
      cityInput
        ? String(cityInput.value || "").trim()
        : "";

    if(!city){
      return "";
    }

    saveIndependentCity(city);

    if(zone === "europe"){
      const country =
        getElement("professionalEuropeCountry");

      const countryValue =
        country
          ? String(country.value || "").trim()
          : "";

      return city + ", " + countryValue;
    }

    return city + ", France";
  }

  async function geocodeLocation(location){
    const url =
      "https://nominatim.openstreetmap.org/search" +
      "?format=jsonv2" +
      "&limit=1" +
      "&addressdetails=1" +
      "&q=" +
      encodeURIComponent(location);

    const response =
      await fetch(
        url,
        {
          headers:{
            "Accept":"application/json"
          }
        }
      );

    if(!response.ok){
      throw new Error(
        "La commune indiquée est momentanément indisponible."
      );
    }

    const data =
      await response.json();

    if(!Array.isArray(data) || !data.length){
      throw new Error(
        "La commune indiquée est introuvable."
      );
    }

    return data[0];
  }

  function getSearchRadius(zone){
    if(zone === "commune"){
      return 8000;
    }

    if(zone === "europe"){
      return 80000;
    }

    const scope =
      getElement("professionalFranceScope");

    const value =
      scope
        ? String(scope.value || "")
        : "commune";

    if(value === "20"){
      return 20000;
    }

    if(value === "50"){
      return 50000;
    }

    if(value === "departement"){
      return 90000;
    }

    if(value === "region"){
      return 180000;
    }

    if(value === "france"){
      return 500000;
    }

    return 10000;
  }

  function buildOverpassQuery(lat, lon, radius){
    return `
      [out:json][timeout:40];
      (
        node["name"](around:${radius},${lat},${lon});
        way["name"](around:${radius},${lat},${lon});
        relation["name"](around:${radius},${lat},${lon});
      );
      out center tags 500;
    `;
  }

  async function fetchProfessionalPlaces(
    lat,
    lon,
    radius
  ){
    const servers = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter"
    ];

    const query =
      buildOverpassQuery(
        lat,
        lon,
        radius
      );

    let lastError = null;

    for(const server of servers){
      try{
        const response =
          await fetch(
            server +
            "?data=" +
            encodeURIComponent(query)
          );

        if(!response.ok){
          lastError =
            new Error(
              "Serveur cartographique indisponible."
            );

          continue;
        }

        const data =
          await response.json();

        return Array.isArray(data.elements)
          ? data.elements
          : [];
      }catch(error){
        lastError = error;
      }
    }

    throw (
      lastError ||
      new Error(
        "La recherche est temporairement indisponible."
      )
    );
  }

  function getSearchableText(element){
    const tags =
      element.tags || {};

    return normalizeText(
      [
        tags.name,
        tags.brand,
        tags.operator,
        tags.shop,
        tags.craft,
        tags.office,
        tags.industry,
        tags.description,
        tags.service,
        tags["contact:website"],
        tags.website
      ]
        .filter(Boolean)
        .join(" ")
    );
  }

  function elementMatchesKeyword(
    element,
    expandedKeywords
  ){
    const searchable =
      getSearchableText(element);

    return expandedKeywords.some(
      function(keyword){
        return searchable.includes(keyword);
      }
    );
  }

  function formatActivity(tags){
    return (
      tags.description ||
      tags.craft ||
      tags.shop ||
      tags.office ||
      tags.industry ||
      tags.service ||
      "Activité professionnelle"
    );
  }

  function renderSearchResults(
    elements,
    keyword,
    location
  ){
    const host =
      getElement("professionalSearchResults");

    if(!host){
      return;
    }

    const expandedKeywords =
      expandKeyword(keyword);

    const matches =
      elements
        .filter(function(element){
          return elementMatchesKeyword(
            element,
            expandedKeywords
          );
        })
        .slice(0,30);

    if(!matches.length){
      host.innerHTML = `
        <div
          class="box"
          style="border-left:6px solid #b00020;">

          <strong>
            Aucun résultat trouvé
          </strong>

          <br><br>

          Aucune entreprise correspondant à :

          <br><br>

          <strong>
            ${escapeValue(keyword)}
          </strong>

          <br><br>

          n’a été trouvée autour de :

          <br><br>

          <strong>
            ${escapeValue(location)}
          </strong>

          <br><br>

          Cela ne signifie pas nécessairement
          qu’aucune entreprise n’existe.

          <br><br>

          Certaines entreprises peuvent ne pas encore
          être correctement renseignées
          dans les données publiques utilisées.

          <br><br>

          Vous pouvez modifier le métier,
          choisir une autre commune
          ou élargir la zone.
        </div>
      `;

      return;
    }

    host.innerHTML = `
      <div class="box">
        <strong>
          ${matches.length} résultat(s) trouvé(s)
        </strong>

        <br><br>

        Métier ou activité :
        <strong>
          ${escapeValue(keyword)}
        </strong>

        <br><br>

        Zone :
        <strong>
          ${escapeValue(location)}
        </strong>
      </div>

      ${
        matches.map(function(element){

          const tags =
            element.tags || {};

          const name =
            tags.name ||
            tags.brand ||
            tags.operator ||
            "Entreprise référencée";

          const address = [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:postcode"],
            tags["addr:city"]
          ]
            .filter(Boolean)
            .join(" ");

          const phone =
            tags["contact:phone"] ||
            tags.phone ||
            "";

          const website =
            tags["contact:website"] ||
            tags.website ||
            "";

          return `
            <div class="professionalResultCard">

              <strong style="font-size:17px;">
                ${escapeValue(name)}
              </strong>

              <br><br>

              Activité :
              <strong>
                ${escapeValue(
                  formatActivity(tags)
                )}
              </strong>

              ${
                address
                  ? `
                    <br><br>

                    Adresse :
                    ${escapeValue(address)}
                  `
                  : ""
              }

              ${
                phone
                  ? `
                    <br><br>

                    Téléphone :
                    ${escapeValue(phone)}
                  `
                  : ""
              }

              ${
                website
                  ? `
                    <br><br>

                    Site internet :
                    ${escapeValue(website)}
                  `
                  : ""
              }
            </div>
          `;
        }).join("")
      }
    `;
  }

  async function runProfessionalSearch(){
    const keywordInput =
      getElement("professionalSearchKeyword");

    const cityInput =
      getElement("professionalSearchCity");

    const status =
      getElement("professionalSearchStatus");

    const results =
      getElement("professionalSearchResults");

    const keyword =
      keywordInput
        ? String(keywordInput.value || "").trim()
        : "";

    const city =
      cityInput
        ? String(cityInput.value || "").trim()
        : "";

    const zone =
      getCurrentZone();

    if(!keyword){
      alert(
        "Indiquez le métier, l’activité ou le service recherché."
      );
      return;
    }

    if(!city){
      alert(
        "Indiquez la commune dans laquelle vous souhaitez chercher."
      );
      return;
    }

    if(!hasAccessToZone(zone)){
      showSubscription(zone);
      return;
    }

    const location =
      getSearchLocation(zone);

    if(status){
      status.textContent =
        "Recherche de la commune en cours…";
    }

    if(results){
      results.innerHTML = "";
    }

    try{
      const geo =
        await geocodeLocation(location);

      const lat =
        Number(geo.lat);

      const lon =
        Number(geo.lon);

      if(
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ){
        throw new Error(
          "Les coordonnées de cette commune sont indisponibles."
        );
      }

      if(status){
        status.textContent =
          "Recherche des entreprises en cours…";
      }

      const elements =
        await fetchProfessionalPlaces(
          lat,
          lon,
          getSearchRadius(zone)
        );

      renderSearchResults(
        elements,
        keyword,
        location
      );

      if(status){
        status.textContent =
          "Recherche terminée.";
      }
    }catch(error){
      console.warn(
        "Recherche professionnelle :",
        error
      );

      if(status){
        status.textContent =
          error.message ||
          "La recherche est temporairement indisponible.";
      }

      if(results){
        results.innerHTML = `
          <div
            class="box"
            style="border-left:6px solid #b00020;">

            <strong>
              Recherche momentanément indisponible
            </strong>

            <br><br>

            ${escapeValue(
              error.message ||
              "Veuillez recommencer dans quelques instants."
            )}
          </div>
        `;
      }
    }
  }

  function clearProfessionalSearch(){
    const keyword =
      getElement("professionalSearchKeyword");

    const city =
      getElement("professionalSearchCity");

    const results =
      getElement("professionalSearchResults");

    const status =
      getElement("professionalSearchStatus");

    if(keyword){
      keyword.value = "";
    }

    if(city){
      city.value = "";
    }

    if(results){
      results.innerHTML = "";
    }

    if(status){
      status.textContent = "";
    }

    localStorage.removeItem(
      SEARCH_CITY_KEY
    );
  }

  function bindProfessionalSearch(){
    document
      .querySelectorAll(".professionalSearchPlan")
      .forEach(function(button){

        button.onclick = function(){
          selectSearchZone(
            button.getAttribute(
              "data-search-zone"
            )
          );
        };
      });

    const searchButton =
      getElement("professionalSearchBtn");

    const clearButton =
      getElement("professionalClearSearchBtn");

    const billingButton =
      getElement("professionalBillingOpenBtn");

    const keywordInput =
      getElement("professionalSearchKeyword");

    const cityInput =
      getElement("professionalSearchCity");

    if(searchButton){
      searchButton.onclick =
        runProfessionalSearch;
    }

    if(clearButton){
      clearButton.onclick =
        clearProfessionalSearch;
    }

    if(billingButton){
      billingButton.onclick = function(){
        if(
          typeof module.openSearchBilling === "function"
        ){
          module.openSearchBilling();
        }else{
          alert(
            "L’espace abonnement et factures est momentanément indisponible."
          );
        }
      };
    }

    [keywordInput, cityInput]
      .filter(Boolean)
      .forEach(function(input){

        input.addEventListener(
          "keydown",
          function(event){

            if(event.key === "Enter"){
              event.preventDefault();
              runProfessionalSearch();
            }
          }
        );
      });
  }

  function openProfessionalDirectory(options){

    options = options || {};

    module.renderModal(
      "Recherche professionnelle",
      getSearchHtml(),
      {
        presentationFooter:false
      }
    );

    window.setTimeout(function(){

      bindProfessionalSearch();

      const keywordInput =
        getElement(
          "professionalSearchKeyword"
        );

      const cityInput =
        getElement(
          "professionalSearchCity"
        );

      if(
        keywordInput &&
        options.keyword
      ){
        keywordInput.value =
          options.keyword;
      }

      if(
        cityInput &&
        options.city
      ){
        cityInput.value =
          options.city;
      }

    },0);
  }

  module.registerScreen(
    "annuaire",
    openProfessionalDirectory
  );

  module.openProfessionalDirectory =
    openProfessionalDirectory;

  module.loadProfessionalSearchPlan =
    loadSearchPlan;

  module.saveProfessionalSearchPlan =
    saveSearchPlan;

  module.runProfessionalSearch =
    runProfessionalSearch;

  console.log(
    "✅ Recherche privée et commune indépendante chargée"
  );

})();

/* =========================================================
   BO'CITÉART — OPPORTUNITÉS PROFESSIONNELLES
   ENTREPRISE VERS ENTREPRISE • 50 € HT
   ========================================================= */

(function addBociteProfessionalOpportunities(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const OPPORTUNITY_STORE_KEY =
    "bociteart_professional_opportunities_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadOpportunities(){
    try{
      const raw =
        localStorage.getItem(
          OPPORTUNITY_STORE_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed)
        ? parsed
        : [];
    }catch(error){
      console.warn(
        "Lecture des opportunités professionnelles impossible :",
        error
      );

      return [];
    }
  }

  function saveOpportunities(list){
    try{
      localStorage.setItem(
        OPPORTUNITY_STORE_KEY,
        JSON.stringify(list || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement des opportunités professionnelles impossible :",
        error
      );
    }
  }

 function getHtml(){

  return `

    <div
      class="box"
      style="
        border-left:6px solid #2f5d46;
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.5;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:800;
          line-height:1.35;
        ">
        Opportunités professionnelles
      </div>

      <div
        style="
          margin-top:8px;
          color:#111111;
          font-size:14px;
          font-weight:400;
        ">
        Publiez une information
        destinée uniquement aux professionnels.
      </div>

    </div>


    <div
      class="box"
      style="
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.5;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:800;
          margin-bottom:8px;
        ">
        Pour quels besoins ?
      </div>

      • rechercher un partenaire ;<br>
      • rechercher un sous-traitant ;<br>
      • rechercher un fournisseur ;<br>
      • rechercher une compétence ;<br>
      • proposer une collaboration ;<br>
      • proposer une formation ;<br>
      • annoncer une rencontre B2B ;<br>
      • présenter une démonstration de matériel ;<br>
      • lancer un appel à candidatures ;<br>
      • annoncer un salon ou un événement professionnel.

    </div>


    <div
      class="box"
      style="
        border-left:6px solid #b00020;
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.5;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:800;
          margin-bottom:8px;
        ">
        Tarif
      </div>

      <span
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:800;
        ">
        50 € HT
      </span>

      par publication.

      <br><br>

      Cette publication est réservée
      à l'espace professionnel
      <strong
        style="
          white-space:nowrap;
          font-weight:800;
        ">
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
      </strong>.

    </div>


    <div
      class="box"
      style="
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.5;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:800;
        ">
        Publier une opportunité
      </div>

    </div>


    <label
      style="
        display:block;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Nom de l’entreprise
    </label>

    <input
      id="professionalOpportunityCompany"
      class="miniField"
      type="text"
      placeholder="Nom de l’entreprise"
      style="
        background:#ffffff;
        color:#111111;
      ">


    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Type d’opportunité
    </label>

    <select
      id="professionalOpportunityType"
      class="miniField"
      style="
        background:#ffffff;
        color:#111111;
      ">

      <option value="">
        Choisir
      </option>

      <option value="partenaire">
        Recherche de partenaire
      </option>

      <option value="sous_traitant">
        Recherche de sous-traitant
      </option>

      <option value="fournisseur">
        Recherche de fournisseur
      </option>

      <option value="competence">
        Recherche de compétence
      </option>

      <option value="collaboration">
        Proposition de collaboration
      </option>

      <option value="formation">
        Formation professionnelle
      </option>

      <option value="conference">
        Conférence ou rencontre B2B
      </option>

      <option value="demonstration">
        Démonstration de matériel
      </option>

      <option value="appel_candidatures">
        Appel à candidatures
      </option>

      <option value="evenement">
        Salon ou événement économique
      </option>

      <option value="autre">
        Autre opportunité professionnelle
      </option>

    </select>


    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Titre
    </label>

    <input
      id="professionalOpportunityTitle"
      class="miniField"
      type="text"
      placeholder="Exemple : recherche carreleur pour chantier à Bordeaux"
      style="
        background:#ffffff;
        color:#111111;
      ">


    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Description
    </label>

    <textarea
      id="professionalOpportunityDescription"
      class="miniField"
      style="
        min-height:120px;
        background:#ffffff;
        color:#111111;
      "
      placeholder="Décrivez simplement votre besoin.">
    </textarea>


    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Commune ou zone concernée
    </label>

    <input
      id="professionalOpportunityLocation"
      class="miniField"
      type="text"
      placeholder="Exemple : Bordeaux, Gironde ou toute la France"
      style="
        background:#ffffff;
        color:#111111;
      ">


    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Date limite de réponse
    </label>

    <input
      id="professionalOpportunityDeadline"
      class="miniField"
      type="date"
      style="
        background:#ffffff;
        color:#111111;
      ">


    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Adresse e-mail professionnelle
    </label>

    <input
      id="professionalOpportunityEmail"
      class="miniField"
      type="email"
      placeholder="contact@entreprise.fr"
      style="
        background:#ffffff;
        color:#111111;
      ">


    <div
      class="box"
      style="
        margin-top:12px;
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">

      <label
        class="miniCheck"
        style="
          font-size:14px;
          font-weight:400;
        ">

        <input
          id="professionalOpportunityLegal"
          type="checkbox">

        <span>
          Je confirme que cette publication
          est destinée aux professionnels.
        </span>

      </label>


      <label
        class="miniCheck"
        style="
          margin-top:8px;
          font-size:14px;
          font-weight:400;
        ">

        <input
          id="professionalOpportunityPayment"
          type="checkbox">

        <span>
          J’accepte le tarif
          de 50 € HT par publication.
        </span>

      </label>

    </div>


    <button
      id="professionalOpportunityPreviewBtn"
      class="choiceBtn"
      type="button"
      style="
        width:100%;
        margin-top:12px;
        background:#ffffff !important;
        color:#111111 !important;
      ">
      Prévisualiser
    </button>


    <button
      id="professionalOpportunityPublishBtn"
      class="choiceBtn"
      type="button"
      style="
        width:100%;
        margin-top:8px;
        background:#ffffff !important;
        color:#111111 !important;
      ">
      Valider et passer au paiement
    </button>


    <div
      id="professionalOpportunityStatus"
      class="muted"
      style="
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
    </div>


    <div
      style="
        margin-top:18px;
        color:#2f5d46;
        font-size:17px;
        font-weight:800;
      ">
      Mes opportunités publiées
    </div>

    <div
      id="professionalOpportunityList"
      style="
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
    </div>

  `;
}
   
  function readForm(){
    return {
      company:
        String(
          getElement("professionalOpportunityCompany")
            ? getElement("professionalOpportunityCompany").value
            : ""
        ).trim(),

      type:
        String(
          getElement("professionalOpportunityType")
            ? getElement("professionalOpportunityType").value
            : ""
        ).trim(),

      title:
        String(
          getElement("professionalOpportunityTitle")
            ? getElement("professionalOpportunityTitle").value
            : ""
        ).trim(),

      description:
        String(
          getElement("professionalOpportunityDescription")
            ? getElement("professionalOpportunityDescription").value
            : ""
        ).trim(),

      location:
        String(
          getElement("professionalOpportunityLocation")
            ? getElement("professionalOpportunityLocation").value
            : ""
        ).trim(),

      deadline:
        String(
          getElement("professionalOpportunityDeadline")
            ? getElement("professionalOpportunityDeadline").value
            : ""
        ).trim(),

      email:
        String(
          getElement("professionalOpportunityEmail")
            ? getElement("professionalOpportunityEmail").value
            : ""
        ).trim(),

      legalAccepted:
        !!(
          getElement("professionalOpportunityLegal") &&
          getElement("professionalOpportunityLegal").checked
        ),

      paymentAccepted:
        !!(
          getElement("professionalOpportunityPayment") &&
          getElement("professionalOpportunityPayment").checked
        )
    };
  }

  function validateForm(data, requireAcceptance){
    if(!data.company){
      alert(
        "Indiquez le nom de l’entreprise."
      );
      return false;
    }

    if(!data.type){
      alert(
        "Choisissez le type d’opportunité."
      );
      return false;
    }

    if(!data.title){
      alert(
        "Indiquez le titre de l’annonce."
      );
      return false;
    }

    if(!data.description){
      alert(
        "Décrivez l’opportunité professionnelle."
      );
      return false;
    }

    if(!data.location){
      alert(
        "Indiquez la commune ou la zone concernée."
      );
      return false;
    }

    if(!data.email || !data.email.includes("@")){
      alert(
        "Indiquez une adresse e-mail professionnelle valide."
      );
      return false;
    }

    if(requireAcceptance && !data.legalAccepted){
      alert(
        "Confirmez que l’annonce est réservée aux professionnels."
      );
      return false;
    }

    if(requireAcceptance && !data.paymentAccepted){
      alert(
        "Vous devez accepter le tarif et les conditions de publication."
      );
      return false;
    }

    return true;
  }

  function getTypeLabel(value){
    const labels = {
      partenaire:
        "Recherche de partenaire",

      sous_traitant:
        "Recherche de sous-traitant",

      fournisseur:
        "Recherche de fournisseur",

      competence:
        "Recherche de compétence",

      collaboration:
        "Proposition de collaboration",

      formation:
        "Formation professionnelle",

      conference:
        "Conférence ou rencontre B2B",

      demonstration:
        "Démonstration de matériel",

      appel_candidatures:
        "Appel à candidatures",

      evenement:
        "Salon ou événement économique",

      autre:
        "Autre opportunité professionnelle"
    };

    return labels[value] || value;
  }

function previewOpportunity(){

  const data =
    readForm();

  if(
    !validateForm(
      data,
      false
    )
  ){
    return;
  }

  module.renderModal(
    "Prévisualisation de l’opportunité",
    `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            line-height:1.35;
          ">
          ${escapeValue(
            data.title
          )}
        </div>

        <div
          style="
            margin-top:8px;
            color:#111111;
            font-size:14px;
            font-weight:400;
          ">
          ${escapeValue(
            getTypeLabel(
              data.type
            )
          )}
        </div>

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:8px;
          ">
          Entreprise
        </div>

        ${escapeValue(
          data.company
        )}

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:8px;
          ">
          Description
        </div>

        ${escapeValue(
          data.description
        )}

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:8px;
          ">
          Zone concernée
        </div>

        ${escapeValue(
          data.location
        )}

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:8px;
          ">
          Date limite
        </div>

        ${escapeValue(
          data.deadline ||
          "Non précisée"
        )}

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:8px;
          ">
          Contact professionnel
        </div>

        ${escapeValue(
          data.email
        )}

      </div>


      <div
        class="box"
        style="
          border-left:6px solid #b00020;
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <span
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
          ">
          50 € HT
        </span>

        par publication professionnelle.

      </div>

    `
  );
}

 function publishOpportunity(){

  const data =
    readForm();

  if(
    !validateForm(
      data,
      true
    )
  ){
    return;
  }

  /* =====================================================
     1. CRÉATION DE LA COMMANDE CENTRALE
     ===================================================== */

  if(
    typeof module.createFinancialOrder !==
    "function"
  ){

    alert(
      "Le moteur financier Bo'CitéArt est momentanément indisponible."
    );

    return;
  }

  const priceHT = 50;
  const vatRate = 20;

  const vatAmount =
    Number(
      (
        priceHT *
        vatRate /
        100
      )
      .toFixed(2)
    );

  const amountTTC =
    Number(
      (
        priceHT +
        vatAmount
      )
      .toFixed(2)
    );

  const order =
    module.createFinancialOrder({

      productCode:
        "PROFESSIONAL_OPPORTUNITY",

      serviceType:
        "professional_opportunity",

      serviceLabel:
        "Publication d'une opportunité professionnelle",

      customerType:
        "professional",

      customerName:
        data.company,

      customerEmail:
        data.email,

      amountHT:
        priceHT,

      vatRate:
        vatRate,

      vatAmount:
        vatAmount,

      amountTTC:
        amountTTC

    });


  /* =====================================================
     2. ENREGISTREMENT DE L'OPPORTUNITÉ
     ELLE N'EST PAS PUBLIÉE AVANT PAIEMENT CONFIRMÉ
     ===================================================== */

  const list =
    loadOpportunities();

  const opportunity = {

    id:
      "OPP-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,7),

    company:
      data.company,

    type:
      data.type,

    title:
      data.title,

    description:
      data.description,

    location:
      data.location,

    deadline:
      data.deadline,

    email:
      data.email,

    priceHT:
      priceHT,

    vatRate:
      vatRate,

    amountTTC:
      amountTTC,

    orderId:
      order.id,

    paymentId:
      "",

    invoiceId:
      "",

    paymentStatus:
      "waiting_payment",

    publicationStatus:
      "waiting_payment",

    createdAt:
      Date.now(),

    createdAtFr:
      new Date()
        .toLocaleString(
          "fr-FR"
        )

  };

  list.unshift(
    opportunity
  );

  saveOpportunities(
    list
  );


  /* =====================================================
     3. CHOIX DU MOYEN DE PAIEMENT
     ===================================================== */

  module.renderModal(
    "Paiement de la publication",
    `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
          ">
          Opportunité professionnelle
        </div>

        <div
          style="
            margin-top:8px;
            color:#111111;
            font-size:14px;
            font-weight:400;
          ">
          ${escapeValue(
            data.title
          )}

          <br><br>

          50,00 € HT<br>
          TVA : 10,00 €<br>
          60,00 € TTC
        </div>

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:8px;
          ">
          Choisissez votre moyen de paiement
        </div>

        La publication sera mise en ligne
        uniquement après confirmation réelle du paiement.

      </div>


      <button
        id="opportunityCardPaymentBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Payer par carte bancaire
      </button>


      <button
        id="opportunityTransferPaymentBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Payer par virement / SEPA
      </button>

    `
  );


  window.setTimeout(
    function(){

      const cardButton =
        getElement(
          "opportunityCardPaymentBtn"
        );

      const transferButton =
        getElement(
          "opportunityTransferPaymentBtn"
        );


      /* ===================================================
         CARTE BANCAIRE / PSP
         =================================================== */

      if(cardButton){

        cardButton.onclick =
          function(){

            if(
              typeof module.createCardPayment !==
              "function"
            ){

              alert(
                "Le paiement par carte est momentanément indisponible."
              );

              return;
            }

            const payment =
              module.createCardPayment(
                order
              );

            opportunity.paymentId =
              payment
                ? payment.id
                : "";

            opportunity.paymentStatus =
              "pending_card_confirmation";

            saveOpportunities(
              list
            );

            /*
              En production :
              ouverture sécurisée du PSP.

              Le PSP confirmera le paiement
              côté serveur.

              Aucune publication ne doit être
              déclenchée sur le simple clic.
            */

            alert(
              "Le paiement par carte est préparé.\n\n" +
              "Dans la version officielle, le PSP sécurisé s'ouvrira ici.\n\n" +
              "Dès confirmation du paiement, la publication sera activée et la facture générée automatiquement."
            );

          };
      }


      /* ===================================================
         VIREMENT / SEPA
         =================================================== */

      if(transferButton){

        transferButton.onclick =
          function(){

            if(
              typeof module.createSepaOrBankTransfer !==
              "function"
            ){

              alert(
                "Le paiement par virement ou SEPA est momentanément indisponible."
              );

              return;
            }

            const payment =
              module.createSepaOrBankTransfer(
                order,
                "bank_transfer"
              );

            opportunity.paymentId =
              payment
                ? payment.id
                : "";

            opportunity.paymentStatus =
              "pending_bank_confirmation";

            saveOpportunities(
              list
            );

            const bank =
              typeof module.getBociteBankInformation ===
              "function"
                ? module.getBociteBankInformation()
                : {};

            const reference =
              payment &&
              payment.transferReference
                ? payment.transferReference
                : "";

            let message =
              "Votre demande de paiement par virement est enregistrée.\n\n" +
              "Référence à indiquer :\n" +
              reference;

            if(
              bank &&
              bank.iban
            ){

              message +=
                "\n\nIBAN Bo'CitéArt :\n" +
                bank.iban;

              if(bank.bic){

                message +=
                  "\n\nBIC :\n" +
                  bank.bic;
              }

            }else{

              message +=
                "\n\nLes coordonnées bancaires officielles Bo'CitéArt seront affichées ici dès l'ouverture du compte professionnel.";
            }

            message +=
              "\n\nLa publication restera en attente jusqu'à confirmation du règlement.";

            alert(
              message
            );

          };
      }

    },
    0
  );

}
   
function renderOpportunities(){

  const host =
    getElement(
      "professionalOpportunityList"
    );

  if(!host){
    return;
  }

  const list =
    loadOpportunities();

  if(!list.length){

    host.innerHTML = `

      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
        ">
        Aucune opportunité professionnelle publiée.
      </div>

    `;

    return;
  }

  host.innerHTML =
    list
      .map(
        function(item){

          return `

            <div
              class="box"
              style="
                background:#ffffff;
                color:#111111;
                font-size:14px;
                font-weight:400;
                line-height:1.5;
              ">

              <div
                style="
                  color:#2f5d46;
                  font-size:17px;
                  font-weight:800;
                  line-height:1.35;
                ">
                ${escapeValue(
                  item.title
                )}
              </div>

              <div
                style="
                  margin-top:8px;
                  color:#111111;
                  font-size:14px;
                  font-weight:400;
                ">
                ${escapeValue(
                  getTypeLabel(
                    item.type
                  )
                )}
              </div>

              <div
                style="
                  margin-top:10px;
                  color:#111111;
                  font-size:14px;
                  font-weight:400;
                ">

                Entreprise :
                ${escapeValue(
                  item.company
                )}

                <br><br>

                ${escapeValue(
                  item.description
                )}

                <br><br>

                Zone :
                ${escapeValue(
                  item.location
                )}

                <br><br>

                Date limite :
                ${escapeValue(
                  item.deadline ||
                  "Non précisée"
                )}

                <br><br>

                Contact :
                ${escapeValue(
                  item.email
                )}

              </div>

              <div
                style="
                  margin-top:10px;
                  color:#666666;
                  font-size:13px;
                  font-weight:400;
                ">
                Publication réservée
                à l’espace professionnel
                <strong
                  style="
                    white-space:nowrap;
                    font-weight:800;
                  ">
                  <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
                </strong>.
              </div>

            </div>

          `;
        }
      )
      .join("");
}
   
  function bindOpportunities(){
    const previewButton =
      getElement(
        "professionalOpportunityPreviewBtn"
      );

    const publishButton =
      getElement(
        "professionalOpportunityPublishBtn"
      );

    if(previewButton){
      previewButton.onclick =
        previewOpportunity;
    }

    if(publishButton){
      publishButton.onclick =
        publishOpportunity;
    }

    renderOpportunities();
  }

  function openOpportunities(){
    module.renderModal(
      "Opportunités professionnelles",
      getHtml()
    );

    window.setTimeout(function(){
      bindOpportunities();
    },0);
  }

  module.registerScreen(
    "opportunites",
    openOpportunities
  );

  module.openProfessionalOpportunities =
    openOpportunities;

  module.loadProfessionalOpportunities =
    loadOpportunities;

  const originalOpenHome =
    module.openHome;

  if(
    typeof originalOpenHome === "function" &&
    !module.__opportunityHomePatched
  ){
    module.__opportunityHomePatched = true;

    module.openHome = function(){
      originalOpenHome.apply(
        module,
        arguments
      );

      window.setTimeout(function(){
        const bands =
          getElement("entrepriseHomeBands");

        if(!bands){
          return;
        }

        if(
          bands.querySelector(
            '[data-entreprise-screen="opportunites"]'
          )
        ){
          return;
        }

        const opportunityButton =
          document.createElement("button");

        opportunityButton.className =
          "entrepriseBand";

        opportunityButton.type =
          "button";

        opportunityButton.setAttribute(
          "data-entreprise-screen",
          "opportunites"
        );

        opportunityButton.innerHTML = `
          <span class="entrepriseBandText">
            Opportunités professionnelles • Partenaires • Sous-traitants • Fournisseurs • Rencontres B2B •
            <span class="entrepriseBandAction">
              Cliquez ici…
            </span>
          </span>
        `;

        const permanenceButton =
          bands.querySelector(
            '[data-entreprise-screen="perennite"]'
          );

        if(permanenceButton){
          bands.insertBefore(
            opportunityButton,
            permanenceButton
          );
        }else{
          bands.appendChild(
            opportunityButton
          );
        }

        opportunityButton.onclick = function(){
          module.openScreen(
            "opportunites"
          );
        };
      },0);
    };
  }

  console.log(
    "✅ Opportunités professionnelles chargées"
  );

})();
/* =========================================================
   BO'CITÉART — FACTURATION CENTRALE
   ABONNEMENTS • EMPLOI • PUBLICITÉ • SERVICES
   PRÉPARATION FACTURATION ÉLECTRONIQUE
   ========================================================= */

(function patchBociteInvoiceRetention(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );

    return;
  }

  /* =======================================================
     1. STOCKAGE
     ======================================================= */

  const INVOICE_KEY =
    "bociteart_entreprise_search_invoices_v1";

  const SEARCH_PLAN_KEY =
    "bociteart_entreprise_search_plan_v1";

  const BILLING_SETTINGS_KEY =
    "bociteart_billing_settings_v1";

  const INVOICE_SEQUENCE_KEY =
    "bociteart_invoice_sequence_v1";

  const RETENTION_MS =
    24 *
    30.4375 *
    24 *
    60 *
    60 *
    1000;

  function getElement(id){

    return document.getElementById(id);
  }

  function escapeValue(value){

    if(
      typeof module.safeEscape ===
      "function"
    ){

      return module.safeEscape(
        value
      );
    }

    return String(
      value == null
        ? ""
        : value
    );
  }

  function loadJson(
    key,
    fallback
  ){

    try{

      const raw =
        localStorage.getItem(
          key
        );

      return raw
        ? JSON.parse(raw)
        : fallback;

    }catch(error){

      return fallback;
    }
  }

  function saveJson(
    key,
    value
  ){

    try{

      localStorage.setItem(
        key,
        JSON.stringify(
          value
        )
      );

      return true;

    }catch(error){

      console.warn(
        "Facturation : enregistrement impossible.",
        error
      );

      return false;
    }
  }

  function formatMoney(value){

    return Number(
      value || 0
    )
    .toLocaleString(
      "fr-FR",
      {
        minimumFractionDigits:2,
        maximumFractionDigits:2
      }
    );
  }

  function getBrandHtml(){

    return `
      <strong
        style="
          white-space:nowrap;
          font-weight:900;
        ">
        <span
          style="color:#2f5d46;">
          Bo'Cité
        </span><span
          style="color:#b00020;">
          Art
        </span>
      </strong>
    `;
  }

  /* =======================================================
     2. FACTURES
     ======================================================= */

  function loadInvoices(){

    const rows =
      loadJson(
        INVOICE_KEY,
        []
      );

    return Array.isArray(rows)
      ? rows
      : [];
  }

  function saveInvoices(rows){

    return saveJson(
      INVOICE_KEY,
      Array.isArray(rows)
        ? rows
        : []
    );
  }

  function cleanExpiredInvoices(){

    const now =
      Date.now();

    const rows =
      loadInvoices();

    const kept =
      rows.filter(
        function(item){

          const timestamp =
            Number(
              item.createdAt ||
              item.issuedAt ||
              0
            );

          if(!timestamp){
            return true;
          }

          return (
            now -
            timestamp
          ) <=
          RETENTION_MS;
        }
      );

    if(
      kept.length !==
      rows.length
    ){

      saveInvoices(
        kept
      );
    }

    return kept;
  }

  /* =======================================================
     3. NUMÉROTATION
     ======================================================= */

  function nextInvoiceNumber(){

    const now =
      new Date();

    const year =
      now.getFullYear();

    let state =
      loadJson(
        INVOICE_SEQUENCE_KEY,
        {
          year:year,
          value:0
        }
      );

    if(
      !state ||
      Number(state.year) !==
      Number(year)
    ){

      state = {
        year:year,
        value:0
      };
    }

    state.value =
      Number(
        state.value || 0
      ) + 1;

    saveJson(
      INVOICE_SEQUENCE_KEY,
      state
    );

    return (
      "BCA-" +
      year +
      "-" +
      String(
        state.value
      )
      .padStart(
        6,
        "0"
      )
    );
  }

  /* =======================================================
     4. IDENTITÉ LÉGALE
     REMPLIE PLUS TARD LORS DE L'IMMATRICULATION
     ======================================================= */

  function getBillingSettings(){

    const defaults = {

      issuer:{

        legalName:
          "Bo'CitéArt",

        address:
          "À compléter lors de l'immatriculation",

        siret:
          "À compléter",

        vatNumber:
          "À compléter",

        email:
          "À compléter"
      },

      provider:{

        connected:false,

        name:"",

        mode:
          "not_connected"
      }

    };

    const saved =
      loadJson(
        BILLING_SETTINGS_KEY,
        {}
      );

    return Object.assign(
      {},
      defaults,
      saved,
      {
        issuer:
          Object.assign(
            {},
            defaults.issuer,
            saved.issuer || {}
          ),

        provider:
          Object.assign(
            {},
            defaults.provider,
            saved.provider || {}
          )
      }
    );
  }

  /* =======================================================
     5. CONNECTEUR DE FACTURATION FUTUR
     ======================================================= */

  window.BociteBillingProvider =
    window.BociteBillingProvider ||
    {

      connected:false,

      name:
        "",

      createInvoice:
        async function(invoice){

          return {
            ok:false,
            status:"not_connected",
            invoiceId:
              invoice.id
          };
        },

      sendInvoice:
        async function(invoice){

          return {
            ok:false,
            status:"not_connected",
            invoiceId:
              invoice.id
          };
        },

      getInvoiceStatus:
        async function(){

          return {
            ok:false,
            status:"not_connected"
          };
        },

      createCreditNote:
        async function(){

          return {
            ok:false,
            status:"not_connected"
          };
        }

    };

  /* =======================================================
     6. NORMALISATION D'UNE FACTURE
     ======================================================= */

  function normalizeInvoice(input){

    input =
      input || {};

    const amountHT =
      Number(
        input.amountHT || 0
      );

    const vatRate =
      Number(
        input.vatRate == null
          ? 20
          : input.vatRate
      );

    const amountVAT =
      Number(
        input.amountVAT != null
          ? input.amountVAT
          : (
              amountHT *
              vatRate /
              100
            )
            .toFixed(2)
      );

    const amountTTC =
      Number(
        input.amountTTC != null
          ? input.amountTTC
          : (
              amountHT +
              amountVAT
            )
            .toFixed(2)
      );

    const now =
      Date.now();

    return {

      id:
        input.id ||
        (
          "INV-" +
          now +
          "-" +
          Math.random()
            .toString(36)
            .slice(2,8)
        ),

      number:
        input.number ||
        nextInvoiceNumber(),

      type:
        input.type ||
        "invoice",

      status:
        input.status ||
        "paid",

      regulatoryStatus:
        input.regulatoryStatus ||
        "not_transmitted",

      customerType:
        input.customerType ||
        "professional",

      customerName:
        String(
          input.customerName || ""
        ),

      customerEmail:
        String(
          input.customerEmail || ""
        ),

      customerId:
        String(
          input.customerId ||
          input.customerSiret ||
          input.customerSiren ||
          ""
        ),

      customerSiren:
        String(
          input.customerSiren || ""
        ),

      customerSiret:
        String(
          input.customerSiret ||
          input.customerId ||
          ""
        ),

      customerVatNumber:
        String(
          input.customerVatNumber || ""
        ),

      serviceType:
        String(
          input.serviceType ||
          input.plan ||
          "service"
        ),

      plan:
        String(
          input.plan || ""
        ),

      planLabel:
        String(
          input.planLabel ||
          input.serviceLabel ||
          "Service Bo'CitéArt"
        ),

      serviceLabel:
        String(
          input.serviceLabel ||
          input.planLabel ||
          "Service Bo'CitéArt"
        ),

      operationCategory:
        String(
          input.operationCategory ||
          "service"
        ),

      billingMode:
        String(
          input.billingMode ||
          "ponctuel"
        ),

      amountHT:
        amountHT,

      vatRate:
        vatRate,

      amountVAT:
        amountVAT,

      amountTTC:
        amountTTC,

      currency:
        "EUR",

      paymentStatus:
        input.paymentStatus ||
        "paid",

      paymentMethod:
        String(
          input.paymentMethod || ""
        ),

      paymentReference:
        String(
          input.paymentReference || ""
        ),

      orderReference:
        String(
          input.orderReference ||
          input.orderId ||
          ""
        ),

      paidAt:
        Number(
          input.paidAt ||
          now
        ),

      issuedAt:
        Number(
          input.issuedAt ||
          now
        ),

      createdAt:
        Number(
          input.createdAt ||
          now
        ),

      createdAtFr:
        new Date(
          Number(
            input.createdAt ||
            now
          )
        )
        .toLocaleString(
          "fr-FR"
        ),

      transmissionChannel:
        input.customerType ===
        "public"
          ? "public_sector"
          : "approved_platform",

      providerName:
        "",

      providerReference:
        "",

      transmittedAt:
        null,

      emailStatus:
        "not_sent",

      emailSentAt:
        null,

      archivedByCustomer:
        false
    };
  }

  /* =======================================================
     7. CRÉATION CENTRALE
     UTILISÉE PAR EMPLOI / ABONNEMENT / PUB / ETC.
     ======================================================= */

  function createPaidInvoice(input){

    const invoice =
      normalizeInvoice(
        input
      );

    const rows =
      loadInvoices();

    rows.unshift(
      invoice
    );

    saveInvoices(
      rows
    );

    window.dispatchEvent(
      new CustomEvent(
        "bociteart:invoice-created",
        {
          detail:{
            invoice:invoice
          }
        }
      )
    );

    return invoice;
  }

  /* =======================================================
     8. TRANSMISSION FUTURE
     ======================================================= */

  async function transmitInvoice(
    invoiceId
  ){

    const rows =
      loadInvoices();

    const invoice =
      rows.find(
        function(item){

          return (
            item.id ===
            invoiceId
          );
        }
      );

    if(!invoice){

      return {
        ok:false,
        status:"not_found"
      };
    }

    const provider =
      window.BociteBillingProvider;

    if(
      !provider ||
      provider.connected !== true ||
      typeof provider.sendInvoice !==
      "function"
    ){

      return {
        ok:false,
        status:"not_connected"
      };
    }

    const result =
      await provider
        .sendInvoice(
          invoice
        );

    if(
      result &&
      result.ok
    ){

      invoice.regulatoryStatus =
        result.status ||
        "transmitted";

      invoice.providerName =
        provider.name ||
        "";

      invoice.providerReference =
        result.reference ||
        "";

      invoice.transmittedAt =
        Date.now();

      saveInvoices(
        rows
      );
    }

    return (
      result ||
      {
        ok:false,
        status:"unknown"
      }
    );
  }

  /* =======================================================
     9. COPIE LISIBLE DE FACTURE
     ======================================================= */

  function buildInvoiceHtml(
    invoice
  ){

    const settings =
      getBillingSettings();

    const issuer =
      settings.issuer ||
      {};

    return `

      <div
        style="
          font-family:Arial,sans-serif;
          color:#111;
          font-size:14px;
          line-height:1.45;
        ">

        <div
          style="
            font-size:22px;
            margin-bottom:12px;
          ">
          ${getBrandHtml()}
        </div>

        <div
          style="
            color:#2f5d46;
            font-size:16px;
            font-weight:700;
          ">
          Facture
          ${escapeValue(
            invoice.number
          )}
        </div>

        <div
          style="margin-top:6px;">
          Date :
          ${escapeValue(
            new Date(
              invoice.issuedAt
            )
            .toLocaleDateString(
              "fr-FR"
            )
          )}
        </div>

        <hr>

        <div>
          <strong>
            Émetteur
          </strong>

          <br>

          ${escapeValue(
            issuer.legalName ||
            "Bo'CitéArt"
          )}

          <br>

          ${escapeValue(
            issuer.address ||
            ""
          )}

          <br>

          SIRET :
          ${escapeValue(
            issuer.siret ||
            ""
          )}

          <br>

          TVA :
          ${escapeValue(
            issuer.vatNumber ||
            ""
          )}
        </div>

        <hr>

        <div>
          <strong>
            Client
          </strong>

          <br>

          ${escapeValue(
            invoice.customerName
          )}

          <br>

          SIREN / SIRET :
          ${escapeValue(
            invoice.customerSiret ||
            invoice.customerSiren ||
            invoice.customerId
          )}
        </div>

        <hr>

        <div>
          <strong>
            Objet
          </strong>

          <br>

          ${escapeValue(
            invoice.serviceLabel
          )}
        </div>

        <div
          style="margin-top:10px;">

          HT :
          ${formatMoney(
            invoice.amountHT
          )} €

          <br>

          TVA
          (${escapeValue(
            invoice.vatRate
          )} %) :

          ${formatMoney(
            invoice.amountVAT
          )} €

          <br>

          <strong>
            TTC :
            ${formatMoney(
              invoice.amountTTC
            )} €
          </strong>

        </div>

        <div
          style="margin-top:10px;">

          Paiement :
          ${escapeValue(
            invoice.paymentMethod ||
            "Non précisé"
          )}

          <br>

          Référence :
          ${escapeValue(
            invoice.paymentReference ||
            "Non précisée"
          )}

        </div>

      </div>
    `;
  }

  /* =======================================================
     10. TÉLÉCHARGEMENT COPIE
     ======================================================= */

  function downloadInvoice(
    invoiceId
  ){

    const invoice =
      loadInvoices()
        .find(
          function(item){

            return (
              item.id ===
              invoiceId
            );
          }
        );

    if(!invoice){

      alert(
        "Facture introuvable."
      );

      return;
    }

    const blob =
      new Blob(
        [
          buildInvoiceHtml(
            invoice
          )
        ],
        {
          type:
            "text/html;charset=utf-8"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href =
      url;

    link.download =
      (
        invoice.number ||
        "facture"
      ) +
      ".html";

    document.body
      .appendChild(
        link
      );

    link.click();

    link.remove();

    URL.revokeObjectURL(
      url
    );
  }

  /* =======================================================
     11. ÉCRAN ABONNEMENTS ET FACTURES
     ======================================================= */

  function getBillingHtml(){

    const invoices =
      cleanExpiredInvoices()
        .sort(
          function(a,b){

            return (
              Number(
                b.createdAt || 0
              ) -
              Number(
                a.createdAt || 0
              )
            );
          }
        );

    const plan =
      loadJson(
        SEARCH_PLAN_KEY,
        {
          plan:"commune",
          active:true
        }
      );

    const provider =
      window.BociteBillingProvider ||
      {};

    let html = `

      <style>

        .bociteBillingBox{
          background:#ffffff !important;
          color:#111111;
          font-size:14px;
          font-weight:400 !important;
          line-height:1.5;
        }

        .bociteBillingTitle{
          color:#2f5d46;
          font-size:16px;
          font-weight:700;
          line-height:1.35;
        }

        .bociteBillingBtn{
          width:100%;
          background:#ffffff !important;
          background-color:#ffffff !important;
          color:#111111 !important;
        }

      </style>

      <div
        class="
          box
          bociteBillingBox
        "
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteBillingTitle">
          Mes abonnements et factures
        </div>

        <div
          style="margin-top:8px;">
          Retrouvez ici vos services souscrits,
          vos paiements et vos factures.
        </div>

      </div>

      <div
        class="
          box
          bociteBillingBox
        ">

        <div
          class="bociteBillingTitle">
          Abonnement actuel
        </div>

        <div
          style="margin-top:8px;">

          Formule :
          ${escapeValue(
            plan.plan ||
            "commune"
          )}

          <br>

          État :
          ${
            plan.active === false
              ? "Inactif"
              : "Actif"
          }

        </div>

      </div>

      <div
        class="
          box
          bociteBillingBox
        ">

        <div
          class="bociteBillingTitle">
          Facturation électronique
        </div>

        <div
          style="margin-top:8px;">

          Connecteur réglementaire :

          <strong>
            ${
              provider.connected === true
                ? "raccordé"
                : "préparé — non raccordé"
            }
          </strong>.

          <br><br>

          Le futur raccordement
          à la plateforme de facturation
          se fera sans modifier
          les écrans Bo'CitéArt.

        </div>

      </div>
    `;

    if(!invoices.length){

      html += `

        <div
          class="
            box
            bociteBillingBox
          ">

          Aucune facture disponible.

        </div>

      `;

    }else{

      invoices.forEach(
        function(invoice){

          html += `

            <div
              class="
                box
                bociteBillingBox
              "
              style="margin-top:9px;">

              <div
                class="bociteBillingTitle">

                ${escapeValue(
                  invoice.number ||
                  "Facture"
                )}

              </div>

              <div
                style="margin-top:7px;">

                ${escapeValue(
                  invoice.serviceLabel ||
                  invoice.planLabel ||
                  "Service Bo'CitéArt"
                )}

                <br>

                ${escapeValue(
                  invoice.createdAtFr ||
                  ""
                )}

                <br><br>

                <strong>
                  ${formatMoney(
                    invoice.amountTTC
                  )} € TTC
                </strong>

                <br>

                Paiement :
                ${escapeValue(
                  invoice.paymentMethod ||
                  "Non précisé"
                )}

                <br>

                Référence :
                ${escapeValue(
                  invoice.paymentReference ||
                  "Non précisée"
                )}

                <br>

                Transmission réglementaire :
                ${escapeValue(
                  invoice.regulatoryStatus ||
                  "not_transmitted"
                )}

              </div>

              <button
                type="button"
                class="
                  choiceBtn
                  bociteBillingBtn
                  billingDownloadBtn
                "
                data-invoice-id="${escapeValue(
                  invoice.id
                )}"
                style="margin-top:8px;">
                Télécharger la copie de facture
              </button>

            </div>

          `;
        }
      );
    }

    html += `

      <div
        class="
          box
          bociteBillingBox
        "
        style="margin-top:10px;">

        <div
          class="bociteBillingTitle">
          Conservation
        </div>

        <div
          style="margin-top:8px;">

          Les copies restent disponibles
          dans cet espace pendant 24 mois.

          <br><br>

          L’entreprise reste responsable
          de la conservation de ses pièces
          dans son propre système comptable.

        </div>

      </div>

    `;

    return html;
  }

  function bindBilling(){

    document
      .querySelectorAll(
        ".billingDownloadBtn"
      )
      .forEach(
        function(button){

          button.onclick =
            function(){

              downloadInvoice(
                button.getAttribute(
                  "data-invoice-id"
                )
              );
            };
        }
      );
  }

  function openBilling(){

    module.renderModal(
      "Abonnement et factures",
      getBillingHtml()
    );

    window.setTimeout(
      function(){

        bindBilling();

      },
      0
    );
  }

  /* =======================================================
     12. ACTIVATION ABONNEMENT
     COMPATIBILITÉ AVEC LE CODE EXISTANT
     ======================================================= */

  function activateSearchSubscription(
    zone,
    mode
  ){

    const prices = {

      france:{
        mensuel:26.50,
        annuel:300
      },

      europe:{
        mensuel:44.90,
        annuel:500
      }

    };

    const selected =
      prices[zone] ||
      prices.france;

    const amountHT =
      Number(
        selected[mode] ||
        selected.annuel
      );

    const vatRate =
      20;

    const amountVAT =
      Number(
        (
          amountHT *
          vatRate /
          100
        )
        .toFixed(2)
      );

    const amountTTC =
      Number(
        (
          amountHT +
          amountVAT
        )
        .toFixed(2)
      );

    const plan = {

      plan:
        zone,

      mode:
        mode,

      active:
        true,

      startedAt:
        Date.now(),

      updatedAt:
        Date.now()
    };

    saveJson(
      SEARCH_PLAN_KEY,
      plan
    );

    const invoice =
      createPaidInvoice({

        customerName:
          "Entreprise",

        customerId:
          "",

        plan:
          "recherche_" +
          zone,

        planLabel:
          "Abonnement recherche professionnelle " +
          zone,

        serviceLabel:
          "Abonnement recherche professionnelle " +
          zone,

        operationCategory:
          "service",

        billingMode:
          mode,

        amountHT:
          amountHT,

        vatRate:
          vatRate,

        amountVAT:
          amountVAT,

        amountTTC:
          amountTTC,

        paymentMethod:
          "Démonstration — à raccorder",

        paymentReference:
          "DEMO-" +
          Date.now(),

        paymentStatus:
          "paid"
      });

    alert(
      "Abonnement activé en démonstration.\n\n" +
      "La facture a été créée dans votre espace Factures."
    );

    openBilling();

    return invoice;
  }

  /* =======================================================
     13. FICHE FACTURE UNIQUE
     ======================================================= */

  module.openProfessionalInvoice =
    function(invoiceId){

      const invoice =
        loadInvoices()
          .find(
            function(item){

              return (
                item.id ===
                invoiceId
              );
            }
          );

      if(!invoice){

        alert(
          "Facture introuvable."
        );

        return;
      }

      module.renderModal(
        "Facture " +
        invoice.number,
        `

          <div
            class="
              box
              bociteBillingBox
            ">
            ${buildInvoiceHtml(
              invoice
            )}
          </div>

          <button
            id="billingSingleDownloadBtn"
            class="
              choiceBtn
              bociteBillingBtn
            "
            type="button"
            style="margin-top:10px;">
            Télécharger la copie
          </button>

        `
      );

      window.setTimeout(
        function(){

          const button =
            getElement(
              "billingSingleDownloadBtn"
            );

          if(button){

            button.onclick =
              function(){

                downloadInvoice(
                  invoice.id
                );
              };
          }

        },
        0
      );
    };

  /* =======================================================
     14. EXPOSITION AU RESTE DE L'APPLICATION
     ======================================================= */

  module.createPaidInvoice =
    createPaidInvoice;

  module.activateSearchSubscription =
    activateSearchSubscription;

  module.openSearchBilling =
    openBilling;

  module.cleanExpiredSearchInvoices =
    cleanExpiredInvoices;

  module.transmitInvoice =
    transmitInvoice;

  module.getBillingInvoices =
    loadInvoices;

  module.saveBillingSettings =
    function(settings){

      return saveJson(
        BILLING_SETTINGS_KEY,
        settings || {}
      );
    };

  cleanExpiredInvoices();

  console.log(
    "✅ Facturation centrale Bo'CitéArt préparée"
  );

  console.log(
    "✅ Abonnements, emploi et services raccordables au même moteur"
  );

  console.log(
    "✅ Connecteur plateforme réglementaire préparé"
  );

})();

/* =========================================================
   BO'CITÉART — RACCORDEMENT ABONNEMENTS ET FACTURES
   ========================================================= */

(function connectBociteSearchSubscriptions(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function connectSubscriptionButtons(){
    const monthlyButton =
      getElement("professionalMonthlySubscribeBtn");

    const annualButton =
      getElement("professionalAnnualSubscribeBtn");

    const selectedZoneButton =
      document.querySelector(
        ".professionalSearchPlan.active"
      );

    const selectedZone =
      selectedZoneButton
        ? selectedZoneButton.getAttribute(
            "data-search-zone"
          )
        : "france";

    if(monthlyButton){
      monthlyButton.onclick = function(){

        if(
          typeof module.activateSearchSubscription !==
          "function"
        ){
          alert(
            "La gestion des abonnements est momentanément indisponible."
          );
          return;
        }

        module.activateSearchSubscription(
          selectedZone,
          "mensuel"
        );
      };
    }

    if(annualButton){
      annualButton.onclick = function(){

        if(
          typeof module.activateSearchSubscription !==
          "function"
        ){
          alert(
            "La gestion des abonnements est momentanément indisponible."
          );
          return;
        }

        module.activateSearchSubscription(
          selectedZone,
          "annuel"
        );
      };
    }
  }

  function observeSubscriptionBox(){
    const host =
      getElement("professionalSubscriptionBox");

    if(!host){
      return;
    }

    const observer =
      new MutationObserver(function(){
        window.setTimeout(function(){
          connectSubscriptionButtons();
        },0);
      });

    observer.observe(
      host,
      {
        childList:true,
        subtree:true
      }
    );
  }

  function addBillingButton(){
    const searchButton =
      getElement("professionalSearchBtn");

    if(!searchButton){
      return;
    }

    if(
      getElement("professionalBillingOpenBtn")
    ){
      return;
    }

    const button =
      document.createElement("button");

    button.id =
      "professionalBillingOpenBtn";

    button.className =
      "choiceBtn";

    button.type =
      "button";

    button.style.width =
      "100%";

    button.style.marginTop =
      "8px";

    button.style.background =
      "#fff";

    button.textContent =
      "Mon abonnement et mes factures";

    button.onclick = function(){

      if(
        typeof module.openSearchBilling ===
        "function"
      ){
        module.openSearchBilling();
      }else{
        alert(
          "L’espace abonnement est momentanément indisponible."
        );
      }
    };

    searchButton.insertAdjacentElement(
      "afterend",
      button
    );
  }

  const originalOpenProfessionalDirectory =
    module.openProfessionalDirectory;

  if(
    typeof originalOpenProfessionalDirectory ===
    "function" &&
    !module.__subscriptionConnectionPatched
  ){
    module.__subscriptionConnectionPatched = true;

    const correctedDirectory = function(){

      originalOpenProfessionalDirectory.apply(
        module,
        arguments
      );

      window.setTimeout(function(){
        observeSubscriptionBox();
        connectSubscriptionButtons();
        addBillingButton();
      },50);
    };

    module.openProfessionalDirectory =
      correctedDirectory;

    module.registerScreen(
      "annuaire",
      correctedDirectory
    );
  }

  console.log(
    "✅ Abonnements et factures raccordés à la recherche"
  );

})();  

/* =========================================================
   BO'CITÉART — RACCORDEMENT QUESTION VERS RECHERCHE
   ========================================================= */

(function connectEntrepriseQuestionToSearch(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function normalizeText(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function extractSearchKeyword(question){
    const normalized =
      normalizeText(question);

    const knownTrades = [
      "maçon",
      "macon",
      "carreleur",
      "électricien",
      "electricien",
      "plombier",
      "menuisier",
      "couvreur",
      "peintre",
      "avocat",
      "comptable",
      "transporteur",
      "nettoyage",
      "vitres",
      "repreneur",
      "fournisseur",
      "sous-traitant",
      "sous traitant",
      "partenaire"
    ];

    const found =
      knownTrades.find(function(trade){
        return normalized.includes(
          normalizeText(trade)
        );
      });

    return found || question.trim();
  }

  function extractCity(question){
    const patterns = [
      /(?:à|a|sur|dans|près de|pres de)\s+([A-Za-zÀ-ÿ' -]{2,40})/i,
      /ville de\s+([A-Za-zÀ-ÿ' -]{2,40})/i,
      /commune de\s+([A-Za-zÀ-ÿ' -]{2,40})/i
    ];

    for(const pattern of patterns){
      const match =
        String(question || "").match(pattern);

      if(match && match[1]){
        return match[1]
          .replace(
            /\b(pour|afin|avec|qui|où|ou|dans)\b.*$/i,
            ""
          )
          .trim();
      }
    }

    return "";
  }

  function bindQuestionButton(){
    const button =
      getElement("entrepriseAiAskBtn");

    if(!button){
      return;
    }

    button.onclick = function(){

      const input =
        getElement("entrepriseAiQuestion");

      const answer =
        getElement("entrepriseAiAnswer");

      const question =
        input
          ? String(input.value || "").trim()
          : "";

      if(!question){
        alert(
          "Écrivez votre question."
        );
        return;
      }

      const keyword =
        extractSearchKeyword(question);

      const city =
        extractCity(question);

      if(answer){
        answer.innerHTML = `
          <div class="box">
            <strong>
              Recherche préparée
            </strong>

            <br><br>

            Activité ou besoin détecté :

            <br><br>

            <strong>
              ${module.safeEscape(keyword)}
            </strong>

            <br><br>

            ${
              city
                ? `
                  Commune détectée :

                  <br><br>

                  <strong>
                    ${module.safeEscape(city)}
                  </strong>

                  <br><br>
                `
                : `
                  Vous pourrez choisir librement
                  la commune dans l’écran suivant.

                  <br><br>
                `
            }

            <button
              id="entrepriseAiOpenSearchBtn"
              class="choiceBtn"
              type="button"
              style="width:100%;">
              Ouvrir la recherche
            </button>
          </div>
        `;
      }

      window.setTimeout(function(){

        const openButton =
          getElement(
            "entrepriseAiOpenSearchBtn"
          );

        if(!openButton){
          return;
        }

        openButton.onclick = function(){

          if(
            typeof module.openProfessionalDirectory ===
            "function"
          ){
            module.openProfessionalDirectory({
              keyword:keyword,
              city:city
            });

            return;
          }

          module.openScreen("annuaire");
        };
      },0);
    };
  }

  const originalOpenHome =
    module.openHome;

  if(
    typeof originalOpenHome === "function" &&
    !module.__questionSearchConnected
  ){
    module.__questionSearchConnected = true;

    module.openHome = function(){

      originalOpenHome.apply(
        module,
        arguments
      );

      window.setTimeout(function(){
        bindQuestionButton();
      },0);
    };

    module.registerScreen(
      "home",
      module.openHome
    );
  }

  console.log(
    "✅ Bouton Poser ma question raccordé à la recherche"
  );

})();

/* =========================================================
   BO'CITÉART — ARCHITECTURE ENTREPRISE
   PARTIE 1 — ACCÈS PARTENAIRE ET ESPACE PRIVÉ
   ========================================================= */

(function addBociteEntreprisePrivateAccess(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const PARTNER_ACCOUNT_KEY =
    "bociteart_entreprise_partner_account_v1";

  const PARTNER_SESSION_KEY =
    "bociteart_entreprise_partner_session_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function generatePartnerCode(){

    const firstPart =
      Math.random()
        .toString(36)
        .slice(2,6)
        .toUpperCase();

    const secondPart =
      Math.random()
        .toString(36)
        .slice(2,6)
        .toUpperCase();

    return (
      "BCA-" +
      firstPart +
      "-" +
      secondPart
    );
  }

  function loadPartnerAccount(){

    try{
      const raw =
        localStorage.getItem(
          PARTNER_ACCOUNT_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(
        parsed &&
        typeof parsed === "object"
      ){
        return parsed;
      }
    }catch(error){
      console.warn(
        "Lecture du compte partenaire impossible :",
        error
      );
    }

    return null;
  }

  function savePartnerAccount(account){

    try{
      localStorage.setItem(
        PARTNER_ACCOUNT_KEY,
        JSON.stringify(account)
      );
    }catch(error){
      console.warn(
        "Enregistrement du compte partenaire impossible :",
        error
      );
    }
  }

  function createDemoPartnerAccount(){

    const existing =
      loadPartnerAccount();

    if(existing){
      return existing;
    }

    const account = {
      id:
        "ENT-" +
        Date.now(),

      companyName:
        "Entreprise de démonstration",

      partnerCode:
        generatePartnerCode(),

      partnerStatus:
        "active",

      partnershipAccepted:
        true,

      accessLevel:
        "partner",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date().toLocaleString("fr-FR")
    };

    savePartnerAccount(account);

    return account;
  }

  function loadPartnerSession(){

    try{
      const raw =
        sessionStorage.getItem(
          PARTNER_SESSION_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : null;

      return !!(
        parsed &&
        parsed.authenticated === true
      );
    }catch(error){
      return false;
    }
  }

  function savePartnerSession(){

    try{
      sessionStorage.setItem(
        PARTNER_SESSION_KEY,
        JSON.stringify({
          authenticated:true,
          connectedAt:Date.now(),
          connectedAtFr:
            new Date().toLocaleString("fr-FR")
        })
      );
    }catch(error){}
  }

  function closePartnerSession(){

    try{
      sessionStorage.removeItem(
        PARTNER_SESSION_KEY
      );
    }catch(error){}
  }

  function isPartnerAccountActive(){

    const account =
      loadPartnerAccount();

    return !!(
      account &&
      account.partnerStatus === "active" &&
      account.partnershipAccepted === true
    );
  }

  function isPartnerAuthenticated(){

    return (
      isPartnerAccountActive() &&
      loadPartnerSession()
    );
  }

 function getAccessHtml(){

  const account =
    createDemoPartnerAccount();

  return `
    <div
      class="box entrepriseInfoBox"
      style="
        border-left:6px solid #2f5d46;
        line-height:1.55;
        font-weight:400;
        color:#111;
      ">

      <strong
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:700;
          line-height:1.4;
        ">
        Espace réservé aux entreprises partenaires
      </strong>

      <br>

      Les tarifs, abonnements, paiements,
      factures, contrats, recherches privées
      et données professionnelles
      sont accessibles uniquement
      depuis l’espace sécurisé de l’entreprise.

      <br><br>

      Chaque entreprise partenaire reçoit
      un code d’accès personnel
      après la validation de son partenariat
      avec

      <strong>
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
      </strong>.

    </div>

    <div
      class="box entrepriseInfoBox"
      style="
        border-left:6px solid #2f5d46;
        line-height:1.55;
        font-weight:400;
        color:#111;
      ">

      <strong
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:700;
          line-height:1.4;
        ">
        Activation de votre espace professionnel
      </strong>

      <br>

      Complétez les renseignements demandés
      afin de préparer l’ouverture
      de votre espace professionnel

      <strong>
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
      </strong>.

      <br><br>

      Vous pouvez dès maintenant parcourir
      et tester l’ensemble du fonctionnement.

      <br><br>

      Lors de l’ouverture officielle,
      votre accès sera activé
      après confirmation
      de votre abonnement.

      <br><br>

      Le paiement pourra être réalisé :

      <br><br>

      • immédiatement par carte bancaire ;<br>
      • par prélèvement bancaire à partir d’un RIB ou d’un IBAN.

      <br><br>

      En cas de prélèvement bancaire,
      l’activation pourra être décalée
      pendant le délai de confirmation
      imposé par le système bancaire.

      <br><br>

      Vos données professionnelles
      et vos accès privés
      seront sécurisés
      par le serveur

      <strong>
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
      </strong>.

    </div>

    <label
      style="
        display:block;
        font-weight:700;
        margin-top:12px;
      ">
      Code d’accès entreprise
    </label>

    <input
      id="entreprisePartnerAccessCode"
      class="miniField"
      type="password"
      autocomplete="off"
      placeholder="Saisissez votre code personnel">

    <button
      id="entreprisePartnerConnectBtn"
      class="choiceBtn"
      type="button"
      style="
        width:100%;
        margin-top:12px;
      ">
      Accéder à mon espace privé
    </button>

    <button
      id="entreprisePartnerReturnBtn"
      class="choiceBtn"
      type="button"
      style="
        width:100%;
        margin-top:8px;
        background:#fff;
      ">
      Retour à l’espace Entreprise
    </button>

    <div
      id="entreprisePartnerAccessStatus"
      class="muted"
      style="margin-top:10px;">
    </div>

    <div
      class="box entrepriseInfoBox"
      style="
        margin-top:14px;
        border-left:6px solid #2f5d46;
        line-height:1.55;
        font-weight:400;
        color:#111;
      ">

      <strong
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:700;
          line-height:1.4;
        ">
        Protection de vos données
      </strong>

      <br>

      Les informations professionnelles
      et les accès privés
      de votre entreprise
      sont destinés à être protégés
      par un espace sécurisé.

      <br><br>

      Seules les personnes autorisées
      par l’entreprise
      pourront accéder
      aux données confidentielles
      et aux outils réservés
      aux partenaires.

    </div>
  `;
}
  function connectPartnerAccount(
    successCallback
  ){

    const account =
      loadPartnerAccount();

    const input =
      getElement(
        "entreprisePartnerAccessCode"
      );

    const status =
      getElement(
        "entreprisePartnerAccessStatus"
      );

    const enteredCode =
      input
        ? String(input.value || "")
            .trim()
            .toUpperCase()
        : "";

    if(!enteredCode){

      alert(
        "Saisissez votre code d’accès entreprise."
      );

      return;
    }

    if(
      !account ||
      enteredCode !==
        String(account.partnerCode || "")
          .toUpperCase()
    ){

      if(status){
        status.innerHTML = `
          <div
            class="box"
            style="border-left:6px solid #b00020;">

            <strong>
              Code incorrect
            </strong>

            <br><br>

            Vérifiez le code communiqué
            à votre entreprise.
          </div>
        `;
      }

      return;
    }

    if(
      account.partnerStatus !== "active" ||
      account.partnershipAccepted !== true
    ){

      alert(
        "Le partenariat de cette entreprise n’est pas actif."
      );

      return;
    }

    savePartnerSession();

    if(
      typeof successCallback ===
      "function"
    ){
      successCallback();
      return;
    }

    openPrivateHome();
  }

  function getPrivateHomeHtml(){

    const account =
      loadPartnerAccount();

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Espace privé de l’entreprise
        </strong>

        <br><br>

        Entreprise connectée :

        <strong>
          ${escapeValue(
            account
              ? account.companyName
              : "Entreprise"
          )}
        </strong>

        <br><br>

        Cet espace regroupera :

        <br><br>

        • les offres et tarifs Bo'CitéArt ;<br>
        • les abonnements actifs ;<br>
        • les recherches professionnelles ;<br>
        • les opportunités publiées ;<br>
        • les demandes collectives ;<br>
        • les factures disponibles ;<br>
        • les projets de mécénat ;<br>
        • les conventions et contrats ;<br>
        • le suivi confidentiel de l’entreprise.
      </div>

      <button
        id="entreprisePrivateOffersBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;">
        Mes offres et abonnements
      </button>

      <button
        id="entreprisePrivateSearchBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Recherche professionnelle
      </button>

      <button
        id="entreprisePrivateMecenatBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Mon espace mécénat privé
      </button>

      <button
        id="entreprisePrivateBillingBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Abonnements et factures
      </button>

      <button
        id="entreprisePrivateDisconnectBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Fermer mon espace privé
      </button>

      <button
        id="entreprisePrivateReturnBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Retour à l’espace Entreprise
      </button>
    `;
  }

  function bindPrivateHome(){

    const offersButton =
      getElement(
        "entreprisePrivateOffersBtn"
      );

    const searchButton =
      getElement(
        "entreprisePrivateSearchBtn"
      );

    const mecenatButton =
      getElement(
        "entreprisePrivateMecenatBtn"
      );

    const billingButton =
      getElement(
        "entreprisePrivateBillingBtn"
      );

    const disconnectButton =
      getElement(
        "entreprisePrivateDisconnectBtn"
      );

    const returnButton =
      getElement(
        "entreprisePrivateReturnBtn"
      );

    if(offersButton){
      offersButton.onclick = function(){

        if(
          typeof module.openPrivateOffers ===
          "function"
        ){
          module.openPrivateOffers();
          return;
        }

        alert(
          "La page des offres privées sera ajoutée à l’étape suivante."
        );
      };
    }

    if(searchButton){
      searchButton.onclick = function(){

        if(
          typeof module.openProfessionalDirectory ===
          "function"
        ){
          module.openProfessionalDirectory();
        }
      };
    }

    if(mecenatButton){
      mecenatButton.onclick = function(){

        if(
          typeof module.openMecenatPrivateSpace ===
          "function"
        ){
          module.openMecenatPrivateSpace();
        }
      };
    }

    if(billingButton){
      billingButton.onclick = function(){

        if(
          typeof module.openSearchBilling ===
          "function"
        ){
          module.openSearchBilling();
        }
      };
    }

    if(disconnectButton){
      disconnectButton.onclick = function(){

        closePartnerSession();

        alert(
          "L’espace privé est fermé."
        );

        if(
          typeof module.openHome ===
          "function"
        ){
          module.openHome();
        }
      };
    }

    if(returnButton){
      returnButton.onclick = function(){

        if(
          typeof module.openHome ===
          "function"
        ){
          module.openHome();
        }
      };
    }
  }

  function openPrivateHome(){

    if(!isPartnerAuthenticated()){
      openPartnerAccess(
        openPrivateHome
      );

      return;
    }

    module.renderModal(
      "Espace privé Entreprise",
      getPrivateHomeHtml()
    );

    window.setTimeout(function(){
      bindPrivateHome();
    },0);
  }

  function openPartnerAccess(
    successCallback
  ){

    if(isPartnerAuthenticated()){

      if(
        typeof successCallback ===
        "function"
      ){
        successCallback();
      }else{
        openPrivateHome();
      }

      return;
    }

    module.renderModal(
      "Accès partenaire Bo'CitéArt",
      getAccessHtml()
    );

    window.setTimeout(function(){

      const connectButton =
        getElement(
          "entreprisePartnerConnectBtn"
        );

      const returnButton =
        getElement(
          "entreprisePartnerReturnBtn"
        );

      const codeInput =
        getElement(
          "entreprisePartnerAccessCode"
        );

      if(connectButton){
        connectButton.onclick = function(){
          connectPartnerAccount(
            successCallback
          );
        };
      }

      if(codeInput){
        codeInput.addEventListener(
          "keydown",
          function(event){

            if(event.key === "Enter"){
              event.preventDefault();

              connectPartnerAccount(
                successCallback
              );
            }
          }
        );
      }

      if(returnButton){
        returnButton.onclick = function(){

          if(
            typeof module.openHome ===
            "function"
          ){
            module.openHome();
          }
        };
      }
    },0);
  }

  function requirePartnerAccess(
    callback
  ){

    if(isPartnerAuthenticated()){

      if(
        typeof callback ===
        "function"
      ){
        callback();
      }

      return true;
    }

    openPartnerAccess(
      callback
    );

    return false;
  }

  module.openPartnerAccess =
    openPartnerAccess;

  module.openPrivateHome =
    openPrivateHome;

  module.requirePartnerAccess =
    requirePartnerAccess;

  module.isPartnerAuthenticated =
    isPartnerAuthenticated;

  module.isPartnerAccountActive =
    isPartnerAccountActive;

  module.loadPartnerAccount =
    loadPartnerAccount;

  module.createDemoPartnerAccount =
    createDemoPartnerAccount;

  module.closePartnerSession =
    closePartnerSession;

  createDemoPartnerAccount();

  console.log(
    "✅ Accès partenaire et espace privé Entreprise chargés"
  );

})();

/* =========================================================
   BO'CITÉART — ARCHITECTURE ENTREPRISE
   PARTIE 2 — OFFRES PRIVÉES ET VERROUILLAGE DES TARIFS
   ========================================================= */

(function connectBociteEntreprisePrivateServices(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function protectFunction(
    functionName,
    screenName
  ){
    const originalFunction =
      module[functionName];

    if(
      typeof originalFunction !== "function"
    ){
      return;
    }

    if(
      originalFunction.__bocitePrivateProtected
    ){
      return;
    }

    const protectedFunction =
      function(){

        const args =
          arguments;

        if(
          typeof module.requirePartnerAccess !==
          "function"
        ){
          originalFunction.apply(
            module,
            args
          );

          return;
        }

        module.requirePartnerAccess(
          function(){

            originalFunction.apply(
              module,
              args
            );
          }
        );
      };

    protectedFunction.__bocitePrivateProtected =
      true;

    module[functionName] =
      protectedFunction;

    if(
      screenName &&
      typeof module.registerScreen ===
      "function"
    ){
      module.registerScreen(
        screenName,
        protectedFunction
      );
    }
  }

  function getPrivateOffersHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Offres et services professionnels Bo'CitéArt
        </strong>

        <br><br>

        Cette page est réservée
        aux entreprises partenaires connectées.

        <br><br>

        Elle regroupe les services disponibles,
        leurs conditions,
        leurs tarifs
        et les accès correspondants.
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Partenariat professionnel Bo'CitéArt
        </strong>

        <br><br>

        Le partenariat donne accès
        à l’espace sécurisé de l’entreprise
        et aux services professionnels disponibles.

        <br><br>

        Il permet notamment :

        <br><br>

        • de gérer la fiche de l’entreprise ;<br>
        • d’accéder aux services privés ;<br>
        • de consulter ses abonnements ;<br>
        • de retrouver ses factures disponibles ;<br>
        • de suivre ses demandes ;<br>
        • d’utiliser les services de recherche ;<br>
        • d’étudier des projets de mécénat ;<br>
        • de recevoir les informations professionnelles.

        <br><br>

        Les conditions définitives du partenariat
        seront précisées avant la mise en production.
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Recherche professionnelle — commune
        </strong>

        <br><br>

        Recherche d’une entreprise,
        d’un artisan,
        d’un fournisseur,
        d’un sous-traitant
        ou d’une compétence
        dans la commune choisie.

        <br><br>

        <strong>
          Incluse dans l’espace professionnel.
        </strong>

        <button
          id="privateOffersLocalSearchBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Ouvrir la recherche professionnelle
        </button>
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Recherche professionnelle — France
        </strong>

        <br><br>

        Permet d’élargir la recherche :

        <br><br>

        • par commune ;<br>
        • par rayon ;<br>
        • par département ;<br>
        • par région ;<br>
        • dans toute la France.

        <br><br>

        Tarif :

        <br><br>

        <strong style="font-size:18px;">
          26,50 € HT par mois
        </strong>

        <br>

        ou

        <br>

        <strong style="font-size:18px;">
          300 € HT par an
        </strong>

        <button
          class="choiceBtn privateOffersSubscribeBtn"
          type="button"
          data-private-offer-plan="france"
          style="width:100%;margin-top:12px;">
          Choisir l’offre France
        </button>
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Recherche professionnelle — Europe
        </strong>

        <br><br>

        Permet de rechercher
        des entreprises,
        fournisseurs,
        partenaires
        et sous-traitants
        dans les pays européens disponibles.

        <br><br>

        Tarif :

        <br><br>

        <strong style="font-size:18px;">
          44,90 € HT par mois
        </strong>

        <br>

        ou

        <br>

        <strong style="font-size:18px;">
          500 € HT par an
        </strong>

        <button
          class="choiceBtn privateOffersSubscribeBtn"
          type="button"
          data-private-offer-plan="europe"
          style="width:100%;margin-top:12px;">
          Choisir l’offre Europe
        </button>
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Opportunité professionnelle
        </strong>

        <br><br>

        Cette publication est destinée
        uniquement aux entreprises.

        <br><br>

        Elle peut concerner :

        <br><br>

        • une recherche de partenaire ;<br>
        • un sous-traitant ;<br>
        • un fournisseur ;<br>
        • une compétence ;<br>
        • une collaboration ;<br>
        • une formation ;<br>
        • une rencontre professionnelle ;<br>
        • un événement économique.

        <br><br>

        Tarif :

        <br><br>

        <strong style="font-size:18px;">
          50 € HT par publication
        </strong>

        <button
          id="privateOffersOpportunityBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Publier une opportunité professionnelle
        </button>
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Fiche entreprise enrichie
        </strong>

        <br><br>

        Elle permet d’ajouter à la fiche officielle :

        <br><br>

        • une présentation ;<br>
        • les métiers ;<br>
        • les services ;<br>
        • les réalisations ;<br>
        • les recrutements ;<br>
        • les actualités ;<br>
        • l’engagement en mécénat ;<br>
        • les demandes de devis ;<br>
        • les coordonnées professionnelles.

        <br><br>

        Cette fiche constitue
        une option complémentaire
        proposée aux entreprises partenaires.

        <br><br>

        Tarif actuellement prévu :

        <br><br>

        <strong style="font-size:18px;">
          199 € HT par an
        </strong>

        <button
          id="privateOffersEnrichedProfileBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Gérer ma fiche entreprise
        </button>
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Mécénat
        </strong>

        <br><br>

        L’entreprise peut :

        <br><br>

        • découvrir les projets ouverts ;<br>
        • enregistrer un intérêt privé ;<br>
        • étudier un projet ;<br>
        • proposer un espace sur son site ;<br>
        • suivre les validations ;<br>
        • préparer une contribution ;<br>
        • retrouver ses documents privés.

        <br><br>

        Les conventions liées
        aux projets Bo'CitéArt
        sont préparées et coordonnées
        par Bo'CitéArt,
        en lien avec les partenaires concernés
        et dans le respect
        des règles juridiques et fiscales applicables.

        <br><br>

        La structure associative
        sans but lucratif prévue par Bo'CitéArt
        pourra porter les opérations éligibles,
        lorsque les conditions juridiques
        et fiscales seront réunies.

        <br><br>

        L’entreprise devra faire confirmer
        l’éligibilité de son opération
        par son expert-comptable.

        <button
          id="privateOffersMecenatBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Ouvrir mon espace mécénat privé
        </button>
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Mes abonnements et mes factures
        </strong>

        <br><br>

        Cet espace permet de consulter :

        <br><br>

        • les services souscrits ;<br>
        • le mode de paiement ;<br>
        • les prochaines échéances ;<br>
        • le renouvellement automatique ;<br>
        • les factures encore disponibles.

        <br><br>

        Bo'CitéArt n’assure pas
        un archivage permanent
        des pièces comptables.

        <br><br>

        Chaque entreprise doit télécharger,
        transmettre et conserver ses factures
        dans son propre système comptable.

        <button
          id="privateOffersBillingBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Consulter mes abonnements et factures
        </button>
      </div>

      <button
        id="privateOffersReturnBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
          background:#fff;
        ">
        Retour à mon espace privé
      </button>
    `;
  }

  function bindPrivateOffers(){

    const localSearchButton =
      getElement(
        "privateOffersLocalSearchBtn"
      );

    const opportunityButton =
      getElement(
        "privateOffersOpportunityBtn"
      );

    const profileButton =
      getElement(
        "privateOffersEnrichedProfileBtn"
      );

    const mecenatButton =
      getElement(
        "privateOffersMecenatBtn"
      );

    const billingButton =
      getElement(
        "privateOffersBillingBtn"
      );

    const returnButton =
      getElement(
        "privateOffersReturnBtn"
      );

    if(localSearchButton){
      localSearchButton.onclick = function(){

        if(
          typeof module.openProfessionalDirectory ===
          "function"
        ){
          module.openProfessionalDirectory();
        }
      };
    }

    document
      .querySelectorAll(
        ".privateOffersSubscribeBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          const plan =
            button.getAttribute(
              "data-private-offer-plan"
            );

          if(
            typeof module.activateSearchSubscription ===
            "function"
          ){
            const annual =
              confirm(
                "Choisissez le paiement.\n\n" +
                "OK : abonnement annuel\n" +
                "Annuler : abonnement mensuel"
              );

            module.activateSearchSubscription(
              plan,
              annual
                ? "annuel"
                : "mensuel"
            );

            return;
          }

          alert(
            "La souscription est momentanément indisponible."
          );
        };
      });

    if(opportunityButton){
      opportunityButton.onclick = function(){

        if(
          typeof module.openProfessionalOpportunities ===
          "function"
        ){
          module.openProfessionalOpportunities();
          return;
        }

        module.openScreen(
          "opportunites"
        );
      };
    }

    if(profileButton){
      profileButton.onclick = function(){

        if(
          typeof module.openScreen ===
          "function"
        ){
          module.openScreen(
            "visibilite"
          );
        }
      };
    }

    if(mecenatButton){
      mecenatButton.onclick = function(){

        if(
          typeof module.openMecenatPrivateSpace ===
          "function"
        ){
          module.openMecenatPrivateSpace();
        }
      };
    }

    if(billingButton){
      billingButton.onclick = function(){

        if(
          typeof module.openSearchBilling ===
          "function"
        ){
          module.openSearchBilling();
        }
      };
    }

    if(returnButton){
      returnButton.onclick = function(){

        if(
          typeof module.openPrivateHome ===
          "function"
        ){
          module.openPrivateHome();
        }
      };
    }
  }

  function openPrivateOffers(){

    if(
      typeof module.isPartnerAuthenticated ===
      "function" &&
      !module.isPartnerAuthenticated()
    ){
      module.openPartnerAccess(
        openPrivateOffers
      );

      return;
    }

    module.renderModal(
      "Offres professionnelles",
      getPrivateOffersHtml()
    );

    window.setTimeout(function(){
      bindPrivateOffers();
    },0);
  }

  module.openPrivateOffers =
    openPrivateOffers;

  /*
    Les fonctions suivantes existent déjà.
    Elles sont maintenant protégées par le code entreprise.
  */

  protectFunction(
    "openProfessionalDirectory",
    "annuaire"
  );

  protectFunction(
    "openProfessionalOpportunities",
    "opportunites"
  );

  protectFunction(
    "openSearchBilling"
  );

  protectFunction(
    "openMecenatPrivateSpace"
  );

  protectFunction(
    "openMecenatPrivateDashboard"
  );

  /*
    Protection particulière de la fiche enrichie.
    Le contenu d’information peut rester public,
    mais le formulaire privé sera protégé
    à l’étape suivante.
  */

  console.log(
    "✅ Offres privées et services payants protégés"
  );

})();

/* =========================================================
   BO'CITÉART
   PARTIE 3
   SUPPRESSION DES TARIFS DES FICHES PUBLIQUES
   ========================================================= */

(function(){

"use strict";

const module = window.BociteEntreprise;

if(!module){
    return;
}

function createPartnerInformationBox(){

return `

<div class="box"
style="
border-left:6px solid #2f5d46;
margin-top:18px;
">

<strong>
Vous souhaitez utiliser ce service ?
</strong>

<br><br>

Toutes les informations présentes dans cette fiche
sont librement consultables.

<br><br>

Les modalités de souscription,
les abonnements,
les paiements,
les tarifs,
les factures
et les espaces privés
sont accessibles uniquement
depuis l'Espace Partenaire Bo'CitéArt.

<br><br>

<button
id="openPartnerPrivateSpace"
class="choiceBtn"
type="button"
style="width:100%;">

Accéder à l'Espace Partenaire

</button>

</div>

`;

}

function connectPartnerButtons(){

const button =
document.getElementById(
"openPartnerPrivateSpace"
);

if(button){

button.onclick=function(){

if(typeof module.openPartnerAccess==="function"){

module.openPartnerAccess();

}

};

}

}

module.appendPartnerInformationBox =
createPartnerInformationBox;

module.bindPartnerInformationBox =
connectPartnerButtons;

console.log(
"✅ Fiches publiques raccordées à l'espace partenaire"
);

})();

/* =========================================================
   BO'CITÉART — ARCHITECTURE ENTREPRISE
   PARTIE 4 — OPPORTUNITÉS PUBLIQUES ET FORMULAIRE PRIVÉ
   ========================================================= */

(function separatePublicAndPrivateOpportunities(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  /*
    La fonction actuelle contient le formulaire,
    le tarif et le paiement.
    Nous la conservons comme fonction privée.
  */

  const privateOpportunityFunction =
    module.openProfessionalOpportunities;

  if(
    typeof privateOpportunityFunction === "function"
  ){
    module.openPrivateProfessionalOpportunities =
      privateOpportunityFunction;
  }

  function getPublicOpportunityHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.55;
        ">

        <strong style="font-size:19px;">
          Opportunités professionnelles
        </strong>

        <br><br>

        Cette rubrique permet aux entreprises,
        artisans et professionnels
        de publier une information destinée
        exclusivement à d’autres professionnels.

        <br><br>

        Elle est distincte de la publicité
        destinée aux habitants.
      </div>

      <div class="box" style="line-height:1.55;">

        <strong style="font-size:18px;">
          À quoi sert une opportunité professionnelle ?
        </strong>

        <br><br>

        Elle peut permettre de rechercher :

        <br><br>

        • un partenaire ;<br>
        • un sous-traitant ;<br>
        • un fournisseur ;<br>
        • une compétence particulière ;<br>
        • un intervenant ;<br>
        • un formateur ;<br>
        • une entreprise disponible dans une autre région ;<br>
        • un repreneur ;<br>
        • une solution technique ;<br>
        • une collaboration temporaire ou durable.

        <br><br>

        Elle peut également servir à présenter :

        <br><br>

        • une formation professionnelle ;<br>
        • une conférence ;<br>
        • une rencontre entre entreprises ;<br>
        • une démonstration de matériel ;<br>
        • un salon professionnel ;<br>
        • un appel à candidatures ;<br>
        • un événement économique ;<br>
        • une proposition de coopération.

        <br><br>

        Cette liste est volontairement non exhaustive.
      </div>

      <div class="box" style="line-height:1.55;">

        <strong style="font-size:18px;">
          Une publication différente de la publicité locale
        </strong>

        <br><br>

        <strong>
          La publicité locale
        </strong>

        s’adresse principalement aux habitants
        pour présenter un produit,
        un service,
        une promotion
        ou un événement.

        <br><br>

        <strong>
          L’opportunité professionnelle
        </strong>

        s’adresse aux entreprises
        pour répondre à un besoin professionnel précis.

        <br><br>

        Elle n’est donc pas mélangée
        avec les publicités grand public.
      </div>

      <div class="box" style="line-height:1.55;">

        <strong style="font-size:18px;">
          Une demande peut créer un intérêt collectif
        </strong>

        <br><br>

        Lorsqu’une même recherche intéresse
        plusieurs entreprises,
        Bo'CitéArt peut identifier
        un besoin commun.

        <br><br>

        Exemples :

        <br><br>

        • plusieurs entreprises recherchent
          une formation SST ;<br>
        • plusieurs entreprises recherchent
          un prestataire pour l’entretien des vitres ;<br>
        • plusieurs entreprises recherchent
          un carreleur disponible dans une région ;<br>
        • plusieurs entreprises recherchent
          une formation d’anglais professionnel ;<br>
        • plusieurs entreprises recherchent
          une solution de recrutement ;<br>
        • plusieurs entreprises recherchent
          un fournisseur ou un sous-traitant.

        <br><br>

        Lorsque l’intérêt devient suffisant,
        Bo'CitéArt peut être alerté
        afin d’étudier une réponse collective.
      </div>

      <div
        class="box"
        style="
          border-left:6px solid #b00020;
          line-height:1.55;
        ">

        <strong>
          Publication réservée aux entreprises partenaires
        </strong>

        <br><br>

        Le formulaire,
        les conditions de publication,
        le tarif,
        le paiement,
        les brouillons
        et le suivi de l’annonce
        sont accessibles uniquement
        dans l’espace privé de l’entreprise.
      </div>

      <button
        id="publicOpportunityPrivateAccessBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Publier une opportunité professionnelle
      </button>

      <button
        id="publicOpportunityReturnBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Retour à l’espace Entreprise
      </button>
    `;
  }

  function bindPublicOpportunity(){

    const privateButton =
      getElement(
        "publicOpportunityPrivateAccessBtn"
      );

    const returnButton =
      getElement(
        "publicOpportunityReturnBtn"
      );

    if(privateButton){

      privateButton.onclick = function(){

        const openPrivateForm =
          function(){

            if(
              typeof module.openPrivateProfessionalOpportunities ===
              "function"
            ){
              module.openPrivateProfessionalOpportunities();
              return;
            }

            alert(
              "Le formulaire privé est momentanément indisponible."
            );
          };

        if(
          typeof module.requirePartnerAccess ===
          "function"
        ){
          module.requirePartnerAccess(
            openPrivateForm
          );

          return;
        }

        openPrivateForm();
      };
    }

    if(returnButton){

      returnButton.onclick = function(){

        if(
          typeof module.openHome ===
          "function"
        ){
          module.openHome();
        }
      };
    }
  }

  function openPublicOpportunities(){

    module.renderModal(
      "Opportunités professionnelles",
      getPublicOpportunityHtml()
    );

    window.setTimeout(function(){
      bindPublicOpportunity();
    },0);
  }

  /*
    L’entrée publique « opportunites »
    ouvre maintenant la fiche explicative sans prix.
  */

  module.registerScreen(
    "opportunites",
    openPublicOpportunities
  );

  module.openPublicProfessionalOpportunities =
    openPublicOpportunities;

  /*
    Le bouton de la page privée des offres
    doit ouvrir directement le formulaire privé.
  */

  const originalOpenPrivateOffers =
    module.openPrivateOffers;

  if(
    typeof originalOpenPrivateOffers === "function" &&
    !module.__privateOpportunityOfferPatched
  ){
    module.__privateOpportunityOfferPatched = true;

    module.openPrivateOffers = function(){

      originalOpenPrivateOffers.apply(
        module,
        arguments
      );

      window.setTimeout(function(){

        const button =
          getElement(
            "privateOffersOpportunityBtn"
          );

        if(!button){
          return;
        }

        button.onclick = function(){

          if(
            typeof module.openPrivateProfessionalOpportunities ===
            "function"
          ){
            module.openPrivateProfessionalOpportunities();
            return;
          }

          alert(
            "Le formulaire privé est momentanément indisponible."
          );
        };
      },0);
    };
  }

  console.log(
    "✅ Opportunités : information publique et formulaire privé séparés"
  );

})();

/* =========================================================
   BO'CITÉART
   RECHERCHE ENTREPRISE V2
   ========================================================= */

(function(){

"use strict";

const module=window.BociteEntreprise;

if(!module){
    return;
}

/*
Cette version remplace complètement
l'ancienne recherche.

Elle devient totalement indépendante
du module Sport.
*/

module.professionalSearchSettings={

city:"",
department:"",
region:"",
country:"France",

scope:"commune",

durationDays:90,

counterVisible:true,

automaticDelete:true,

automaticAlert:true

};

console.log(
"✅ Recherche Entreprise V2 initialisée"
);

})();

/* =========================================================
   BO'CITÉART — RECHERCHE ENTREPRISE
   PARTIE 5A — ZONE INDÉPENDANTE ET NAVIGATION
   ========================================================= */

(function addBociteProfessionalSearchHub(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const SEARCH_SETTINGS_KEY =
    "bociteart_professional_search_settings_v3";

  const previousDirectory =
    module.openProfessionalDirectory;

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadSettings(){

    try{
      const raw =
        localStorage.getItem(
          SEARCH_SETTINGS_KEY
        );

      const parsed =
        raw
          ? JSON.parse(raw)
          : null;

      if(
        parsed &&
        typeof parsed === "object"
      ){
        return parsed;
      }

    }catch(error){
      console.warn(
        "Lecture des paramètres de recherche impossible :",
        error
      );
    }

    return {
      keyword:"",
      city:"",
      department:"",
      region:"",
      country:"France",
      scope:"commune"
    };
  }

  function saveSettings(settings){

    try{
      localStorage.setItem(
        SEARCH_SETTINGS_KEY,
        JSON.stringify(settings)
      );
    }catch(error){
      console.warn(
        "Enregistrement des paramètres de recherche impossible :",
        error
      );
    }
  }

  function getSearchHubHtml(){

    const saved =
      loadSettings();

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Recherche professionnelle
        </strong>

        <br><br>

        Recherchez une entreprise,
        un artisan,
        un fournisseur,
        un sous-traitant,
        un partenaire
        ou une compétence.

        <br><br>

        La zone indiquée ici
        est totalement indépendante
        des villes choisies dans le Sport,
        la carte
        ou « Explorer les alentours ».
      </div>

      <label
        style="
          display:block;
          font-weight:900;
        ">
        Que recherchez-vous ?
      </label>

      <input
        id="professionalHubKeyword"
        class="miniField"
        type="search"
        value="${escapeValue(saved.keyword || "")}"
        placeholder="Exemple : maçon, fleuriste, carreleur, repreneur">

      <label
        style="
          display:block;
          margin-top:12px;
          font-weight:900;
        ">
        Étendue de la recherche
      </label>

      <select
        id="professionalHubScope"
        class="miniField">

        <option value="commune">
          Une commune
        </option>

        <option value="department">
          Un département
        </option>

        <option value="region">
          Une région
        </option>

        <option value="france">
          Toute la France
        </option>

        <option value="europe">
          Un pays européen
        </option>
      </select>

      <div
        id="professionalHubCityFields"
        style="margin-top:12px;">

        <label
          style="
            display:block;
            font-weight:900;
          ">
          Commune
        </label>

        <input
          id="professionalHubCity"
          class="miniField"
          type="text"
          value="${escapeValue(saved.city || "")}"
          placeholder="Exemple : Wattignies">
      </div>

      <div
        id="professionalHubDepartmentFields"
        style="display:none;margin-top:12px;">

        <label
          style="
            display:block;
            font-weight:900;
          ">
          Département
        </label>

        <input
          id="professionalHubDepartment"
          class="miniField"
          type="text"
          value="${escapeValue(saved.department || "")}"
          placeholder="Exemple : Nord ou 59">
      </div>

      <div
        id="professionalHubRegionFields"
        style="display:none;margin-top:12px;">

        <label
          style="
            display:block;
            font-weight:900;
          ">
          Région
        </label>

        <input
          id="professionalHubRegion"
          class="miniField"
          type="text"
          value="${escapeValue(saved.region || "")}"
          placeholder="Exemple : Hauts-de-France">
      </div>

      <div
        id="professionalHubEuropeFields"
        style="display:none;margin-top:12px;">

        <label
          style="
            display:block;
            font-weight:900;
          ">
          Pays
        </label>

        <select
          id="professionalHubCountry"
          class="miniField">

          <option value="Belgique">
            Belgique
          </option>

          <option value="Luxembourg">
            Luxembourg
          </option>

          <option value="Pays-Bas">
            Pays-Bas
          </option>

          <option value="Allemagne">
            Allemagne
          </option>

          <option value="Espagne">
            Espagne
          </option>

          <option value="Italie">
            Italie
          </option>

          <option value="Portugal">
            Portugal
          </option>

          <option value="Suisse">
            Suisse
          </option>

          <option value="Autriche">
            Autriche
          </option>

          <option value="Irlande">
            Irlande
          </option>

          <option value="Danemark">
            Danemark
          </option>

          <option value="Suède">
            Suède
          </option>

          <option value="Finlande">
            Finlande
          </option>

          <option value="Pologne">
            Pologne
          </option>
        </select>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Ville ou région dans ce pays
        </label>

        <input
          id="professionalHubEuropeLocation"
          class="miniField"
          type="text"
          placeholder="Exemple : Bruxelles, Milan, Barcelone">
      </div>

      <button
        id="professionalHubSearchBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
          font-size:17px;
        ">
        Rechercher
      </button>

      <button
        id="professionalHubClearBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Effacer les critères
      </button>

      <button
        id="professionalHubReturnBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Retour à l’espace Entreprise
      </button>

      <div
        id="professionalHubStatus"
        class="muted"
        style="margin-top:10px;">
      </div>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
        ">

        <strong>
          Recherche privée
        </strong>

        <br><br>

        Les métiers recherchés,
        les zones choisies
        et les résultats consultés
        restent dans l’espace privé
        de l’entreprise.
      </div>
    `;
  }

  function updateVisibleFields(){

    const scopeInput =
      getElement(
        "professionalHubScope"
      );

    const scope =
      scopeInput
        ? scopeInput.value
        : "commune";

    const cityFields =
      getElement(
        "professionalHubCityFields"
      );

    const departmentFields =
      getElement(
        "professionalHubDepartmentFields"
      );

    const regionFields =
      getElement(
        "professionalHubRegionFields"
      );

    const europeFields =
      getElement(
        "professionalHubEuropeFields"
      );

    if(cityFields){
      cityFields.style.display =
        scope === "commune"
          ? "block"
          : "none";
    }

    if(departmentFields){
      departmentFields.style.display =
        scope === "department"
          ? "block"
          : "none";
    }

    if(regionFields){
      regionFields.style.display =
        scope === "region"
          ? "block"
          : "none";
    }

    if(europeFields){
      europeFields.style.display =
        scope === "europe"
          ? "block"
          : "none";
    }
  }

  function readSearchSettings(){

    const keywordInput =
      getElement(
        "professionalHubKeyword"
      );

    const scopeInput =
      getElement(
        "professionalHubScope"
      );

    const cityInput =
      getElement(
        "professionalHubCity"
      );

    const departmentInput =
      getElement(
        "professionalHubDepartment"
      );

    const regionInput =
      getElement(
        "professionalHubRegion"
      );

    const countryInput =
      getElement(
        "professionalHubCountry"
      );

    const europeLocationInput =
      getElement(
        "professionalHubEuropeLocation"
      );

    return {
      keyword:
        keywordInput
          ? String(
              keywordInput.value || ""
            ).trim()
          : "",

      scope:
        scopeInput
          ? String(
              scopeInput.value || "commune"
            )
          : "commune",

      city:
        cityInput
          ? String(
              cityInput.value || ""
            ).trim()
          : "",

      department:
        departmentInput
          ? String(
              departmentInput.value || ""
            ).trim()
          : "",

      region:
        regionInput
          ? String(
              regionInput.value || ""
            ).trim()
          : "",

      country:
        countryInput
          ? String(
              countryInput.value || "France"
            ).trim()
          : "France",

      europeLocation:
        europeLocationInput
          ? String(
              europeLocationInput.value || ""
            ).trim()
          : ""
    };
  }

  function validateSearchSettings(settings){

    if(!settings.keyword){

      alert(
        "Indiquez le métier, l’activité ou le service recherché."
      );

      return false;
    }

    if(
      settings.scope === "commune" &&
      !settings.city
    ){

      alert(
        "Indiquez la commune de recherche."
      );

      return false;
    }

    if(
      settings.scope === "department" &&
      !settings.department
    ){

      alert(
        "Indiquez le département de recherche."
      );

      return false;
    }

    if(
      settings.scope === "region" &&
      !settings.region
    ){

      alert(
        "Indiquez la région de recherche."
      );

      return false;
    }

    if(
      settings.scope === "europe" &&
      !settings.europeLocation
    ){

      alert(
        "Indiquez une ville ou une région dans le pays choisi."
      );

      return false;
    }

    return true;
  }

  function buildSearchLocation(settings){

    if(settings.scope === "commune"){
      return settings.city;
    }

    if(settings.scope === "department"){
      return settings.department;
    }

    if(settings.scope === "region"){
      return settings.region;
    }

    if(settings.scope === "france"){
      return "France";
    }

    if(settings.scope === "europe"){
      return (
        settings.europeLocation +
        ", " +
        settings.country
      );
    }

    return "";
  }

  function addReturnButtonToSearchResults(){

    window.setTimeout(function(){

      const existing =
        getElement(
          "professionalSearchReturnToHubBtn"
        );

      if(existing){
        return;
      }

      const modal =
        document.querySelector(
          ".modalContent, .modal-content, #modalContent"
        );

      if(!modal){
        return;
      }

      const button =
        document.createElement("button");

      button.id =
        "professionalSearchReturnToHubBtn";

      button.type =
        "button";

      button.className =
        "choiceBtn";

      button.style.width =
        "100%";

      button.style.marginTop =
        "12px";

      button.style.background =
        "#fff";

      button.textContent =
        "Retour aux critères de recherche";

      button.onclick = function(){
        openProfessionalSearchHub();
      };

      modal.appendChild(button);

    },100);
  }

  function launchSearch(){

    const settings =
      readSearchSettings();

    if(
      !validateSearchSettings(
        settings
      )
    ){
      return;
    }

    saveSettings(settings);

    const location =
      buildSearchLocation(
        settings
      );

    if(
      typeof previousDirectory !==
      "function"
    ){

      alert(
        "Le moteur de recherche actuel est introuvable."
      );

      return;
    }

    previousDirectory.call(
      module,
      {
        keyword:
          settings.keyword,

        city:
          location
      }
    );

    addReturnButtonToSearchResults();
  }

  function clearSearchHub(){

    saveSettings({
      keyword:"",
      city:"",
      department:"",
      region:"",
      country:"France",
      scope:"commune"
    });

    openProfessionalSearchHub();
  }

  function bindSearchHub(){

    const saved =
      loadSettings();

    const scopeInput =
      getElement(
        "professionalHubScope"
      );

    const countryInput =
      getElement(
        "professionalHubCountry"
      );

    const searchButton =
      getElement(
        "professionalHubSearchBtn"
      );

    const clearButton =
      getElement(
        "professionalHubClearBtn"
      );

    const returnButton =
      getElement(
        "professionalHubReturnBtn"
      );

    const keywordInput =
      getElement(
        "professionalHubKeyword"
      );

    if(scopeInput){

      scopeInput.value =
        saved.scope || "commune";

      scopeInput.onchange =
        updateVisibleFields;
    }

    if(
      countryInput &&
      saved.country
    ){
      countryInput.value =
        saved.country;
    }

    updateVisibleFields();

    if(searchButton){
      searchButton.onclick =
        launchSearch;
    }

    if(clearButton){
      clearButton.onclick =
        clearSearchHub;
    }

    if(returnButton){
      returnButton.onclick = function(){

        if(
          typeof module.openHome ===
          "function"
        ){
          module.openHome();
        }
      };
    }

    if(keywordInput){
      keywordInput.addEventListener(
        "keydown",
        function(event){

          if(event.key === "Enter"){
            event.preventDefault();
            launchSearch();
          }
        }
      );
    }
  }

  function openProfessionalSearchHub(){

    const openHub =
      function(){

        module.renderModal(
          "Recherche professionnelle",
          getSearchHubHtml()
        );

        window.setTimeout(function(){
          bindSearchHub();
        },0);
      };

    if(
      typeof module.requirePartnerAccess ===
      "function"
    ){
      module.requirePartnerAccess(
        openHub
      );

      return;
    }

    openHub();
  }

  module.openProfessionalSearchHub =
    openProfessionalSearchHub;

  module.openProfessionalDirectory =
    openProfessionalSearchHub;

  module.registerScreen(
    "annuaire",
    openProfessionalSearchHub
  );

  console.log(
    "✅ Recherche professionnelle indépendante — partie 5A chargée"
  );

})();

/* =========================================================
   BO'CITÉART — RECHERCHE ENTREPRISE
   PARTIE 5B — DEMANDES, COMPTEURS ET ALERTES
   ========================================================= */

(function addBociteProfessionalSearchDemandTracking(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const DEMANDS_KEY =
    "bociteart_professional_search_demands_v1";

  const ALERTS_KEY =
    "bociteart_professional_search_alerts_v1";

  const VALIDITY_DAYS = 90;

  const ALERT_THRESHOLD = 5;

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function normalizeText(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function loadArray(key){

    try{
      const raw =
        localStorage.getItem(key);

      const parsed =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed)
        ? parsed
        : [];
    }catch(error){
      return [];
    }
  }

  function saveArray(key, list){

    try{
      localStorage.setItem(
        key,
        JSON.stringify(list || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement des demandes impossible :",
        error
      );
    }
  }

  function loadDemands(){
    return loadArray(DEMANDS_KEY);
  }

  function saveDemands(list){
    saveArray(DEMANDS_KEY, list);
  }

  function loadAlerts(){
    return loadArray(ALERTS_KEY);
  }

  function saveAlerts(list){
    saveArray(ALERTS_KEY, list);
  }

  function getExpiryTimestamp(){

    return (
      Date.now() +
      VALIDITY_DAYS *
      24 *
      60 *
      60 *
      1000
    );
  }

  function formatDate(timestamp){

    if(!timestamp){
      return "";
    }

    return new Date(timestamp)
      .toLocaleDateString("fr-FR");
  }

  function cleanExpiredDemands(){

    const now =
      Date.now();

    const demands =
      loadDemands();

    const active =
      demands.filter(function(item){

        return (
          item.status === "active" &&
          Number(item.expiresAt || 0) > now
        );
      });

    if(active.length !== demands.length){
      saveDemands(active);
    }

    return active;
  }

  function readCurrentSearch(){

    const keywordInput =
      getElement(
        "professionalHubKeyword"
      );

    const scopeInput =
      getElement(
        "professionalHubScope"
      );

    const cityInput =
      getElement(
        "professionalHubCity"
      );

    const departmentInput =
      getElement(
        "professionalHubDepartment"
      );

    const regionInput =
      getElement(
        "professionalHubRegion"
      );

    const countryInput =
      getElement(
        "professionalHubCountry"
      );

    const europeLocationInput =
      getElement(
        "professionalHubEuropeLocation"
      );

    const scope =
      scopeInput
        ? String(scopeInput.value || "commune")
        : "commune";

    let location = "";

    if(scope === "commune"){
      location =
        cityInput
          ? String(cityInput.value || "").trim()
          : "";
    }

    if(scope === "department"){
      location =
        departmentInput
          ? String(departmentInput.value || "").trim()
          : "";
    }

    if(scope === "region"){
      location =
        regionInput
          ? String(regionInput.value || "").trim()
          : "";
    }

    if(scope === "france"){
      location = "France";
    }

    if(scope === "europe"){

      const country =
        countryInput
          ? String(countryInput.value || "").trim()
          : "";

      const europeLocation =
        europeLocationInput
          ? String(europeLocationInput.value || "").trim()
          : "";

      location =
        europeLocation && country
          ? europeLocation + ", " + country
          : "";
    }

    return {
      keyword:
        keywordInput
          ? String(keywordInput.value || "").trim()
          : "",

      scope:scope,
      location:location
    };
  }

  function registerSearchDemand(){

    const search =
      readCurrentSearch();

    if(
      !search.keyword ||
      !search.location
    ){
      return null;
    }

    const normalizedKeyword =
      normalizeText(search.keyword);

    const normalizedLocation =
      normalizeText(search.location);

    const demands =
      cleanExpiredDemands();

    let demand =
      demands.find(function(item){

        return (
          item.normalizedKeyword ===
            normalizedKeyword &&
          item.normalizedLocation ===
            normalizedLocation &&
          item.scope === search.scope
        );
      });

    if(demand){

      demand.count =
        Number(demand.count || 0) + 1;

      demand.lastSearchAt =
        Date.now();

      demand.lastSearchAtFr =
        new Date()
          .toLocaleString("fr-FR");

      demand.expiresAt =
        getExpiryTimestamp();

      demand.expiresAtFr =
        formatDate(demand.expiresAt);

    }else{

      demand = {
        id:
          "DEM-RECH-" +
          Date.now() +
          "-" +
          Math.random()
            .toString(36)
            .slice(2,7),

        keyword:
          search.keyword,

        normalizedKeyword:
          normalizedKeyword,

        scope:
          search.scope,

        location:
          search.location,

        normalizedLocation:
          normalizedLocation,

        count:1,

        status:"active",

        createdAt:
          Date.now(),

        createdAtFr:
          new Date()
            .toLocaleString("fr-FR"),

        lastSearchAt:
          Date.now(),

        lastSearchAtFr:
          new Date()
            .toLocaleString("fr-FR"),

        expiresAt:
          getExpiryTimestamp(),

        expiresAtFr:
          formatDate(
            getExpiryTimestamp()
          ),

        alertCreated:false
      };

      demands.unshift(demand);
    }

    createBociteAlertIfNeeded(
      demand
    );

    saveDemands(demands);

    showDemandCounter(
      demand
    );

    return demand;
  }

  function createBociteAlertIfNeeded(demand){

    if(
      Number(demand.count || 0) <
      ALERT_THRESHOLD
    ){
      return;
    }

    if(demand.alertCreated){
      return;
    }

    const alerts =
      loadAlerts();

    alerts.unshift({
      id:
        "ALERTE-RECH-" +
        Date.now(),

      demandId:
        demand.id,

      type:
        "fort_interet_professionnel",

      title:
        demand.keyword,

      location:
        demand.location,

      scope:
        demand.scope,

      count:
        demand.count,

      status:
        "a_traiter",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString("fr-FR")
    });

    demand.alertCreated = true;

    saveAlerts(alerts);

    console.warn(
      "🔔 Alerte Bo'CitéArt : forte demande pour " +
      demand.keyword +
      " — " +
      demand.location +
      " — " +
      demand.count +
      " recherches"
    );
  }

  function showDemandCounter(demand){

    window.setTimeout(function(){

      const status =
        getElement(
          "professionalHubStatus"
        );

      if(!status){
        return;
      }

      status.innerHTML = `
        <div
          class="box"
          style="
            border-left:6px solid #2f5d46;
            line-height:1.5;
          ">

          <strong>
            Intérêt professionnel enregistré
          </strong>

          <br><br>

          Recherche :

          <strong>
            ${escapeValue(demand.keyword)}
          </strong>

          <br><br>

          Zone :

          <strong>
            ${escapeValue(demand.location)}
          </strong>

          <br><br>

          Nombre de recherches enregistrées :

          <strong style="font-size:18px;">
            ${Number(demand.count || 0)}
          </strong>

          <br><br>

          Cette demande collective reste active
          pendant trois mois après
          la dernière recherche enregistrée.

          <br><br>

          Échéance actuelle :

          <strong>
            ${escapeValue(demand.expiresAtFr)}
          </strong>

          ${
            Number(demand.count || 0) >=
            ALERT_THRESHOLD
              ? `
                <br><br>

                <strong>
                  L’intérêt est suffisant pour alerter Bo'CitéArt.
                </strong>

                <br><br>

                Bo'CitéArt pourra étudier
                une réponse collective
                et suivre la demande
                en dehors de l’application.
              `
              : ""
          }
        </div>
      `;

    },50);
  }

  function addDemandInformationToHub(){

    const searchButton =
      getElement(
        "professionalHubSearchBtn"
      );

    if(!searchButton){
      return;
    }

    if(
      getElement(
        "professionalDemandInformationBox"
      )
    ){
      return;
    }

    const box =
      document.createElement("div");

    box.id =
      "professionalDemandInformationBox";

    box.className =
      "box";

    box.style.marginTop =
      "14px";

    box.style.borderLeft =
      "6px solid #2f5d46";

    box.innerHTML = `
      <strong>
        Recherche et intérêt collectif
      </strong>

      <br><br>

      Chaque recherche peut alimenter
      anonymement un compteur d’intérêt professionnel.

      <br><br>

      Lorsqu’un besoin identique
      est recherché par plusieurs entreprises,
      Bo'CitéArt peut être alerté
      afin d’étudier une solution commune.

      <br><br>

      Exemples non exhaustifs :

      <br><br>

      • artisan disponible ;<br>
      • prestataire de nettoyage ;<br>
      • entretien des vitres ;<br>
      • formation SST ;<br>
      • formation à la conduite d’engins ;<br>
      • anglais professionnel ;<br>
      • fournisseur ;<br>
      • sous-traitant ;<br>
      • repreneur ;<br>
      • compétence spécialisée.

      <br><br>

      Une demande reste active
      pendant trois mois après
      la dernière recherche correspondante.
    `;

    searchButton.insertAdjacentElement(
      "afterend",
      box
    );
  }

  function bindDemandTracking(){

    const searchButton =
      getElement(
        "professionalHubSearchBtn"
      );

    if(!searchButton){
      return;
    }

    if(
      searchButton
        .dataset
        .demandTrackingBound === "1"
    ){
      return;
    }

    searchButton
      .dataset
      .demandTrackingBound = "1";

    searchButton.addEventListener(
      "click",
      function(){

        registerSearchDemand();

      },
      true
    );

    addDemandInformationToHub();
  }

  const originalOpenHub =
    module.openProfessionalSearchHub;

  if(
    typeof originalOpenHub === "function" &&
    !module.__professionalDemandTrackingPatched
  ){

    module.__professionalDemandTrackingPatched =
      true;

    const correctedOpenHub =
      function(){

        originalOpenHub.apply(
          module,
          arguments
        );

        window.setTimeout(function(){

          cleanExpiredDemands();

          bindDemandTracking();

        },50);
      };

    module.openProfessionalSearchHub =
      correctedOpenHub;

    module.openProfessionalDirectory =
      correctedOpenHub;

    module.registerScreen(
      "annuaire",
      correctedOpenHub
    );
  }

  module.loadProfessionalSearchDemands =
    cleanExpiredDemands;

  module.loadProfessionalSearchAlerts =
    loadAlerts;

  module.registerProfessionalSearchDemand =
    registerSearchDemand;

  cleanExpiredDemands();

  console.log(
    "✅ Recherche professionnelle — compteurs et alertes chargés"
  );

})();

/* =========================================================
   BO'CITÉART — RECHERCHE ENTREPRISE
   PARTIE 5C — TABLEAU PRIVÉ DES DEMANDES ET ALERTES
   ========================================================= */

(function addBociteProfessionalDemandDashboard(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const DEMANDS_KEY =
    "bociteart_professional_search_demands_v1";

  const ALERTS_KEY =
    "bociteart_professional_search_alerts_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadArray(key){

    try{
      const raw =
        localStorage.getItem(key);

      const parsed =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed)
        ? parsed
        : [];

    }catch(error){
      return [];
    }
  }

  function saveArray(key, list){

    try{
      localStorage.setItem(
        key,
        JSON.stringify(list || [])
      );

    }catch(error){
      console.warn(
        "Enregistrement du suivi impossible :",
        error
      );
    }
  }

  function loadDemands(){
    return loadArray(DEMANDS_KEY);
  }

  function saveDemands(list){
    saveArray(DEMANDS_KEY, list);
  }

  function loadAlerts(){
    return loadArray(ALERTS_KEY);
  }

  function saveAlerts(list){
    saveArray(ALERTS_KEY, list);
  }

  function formatDate(timestamp){

    if(!timestamp){
      return "Non renseignée";
    }

    return new Date(
      Number(timestamp)
    ).toLocaleDateString("fr-FR");
  }

  function getRemainingDays(timestamp){

    if(!timestamp){
      return 0;
    }

    return Math.max(
      0,
      Math.ceil(
        (
          Number(timestamp) -
          Date.now()
        ) /
        (
          24 *
          60 *
          60 *
          1000
        )
      )
    );
  }

  function getDemandStatusLabel(status){

    const labels = {
      active:
        "Demande active",

      a_etudier:
        "À étudier",

      recherche_en_cours:
        "Recherche de solution en cours",

      entreprises_contactees:
        "Entreprises concernées contactées",

      solution_trouvee:
        "Solution trouvée",

      cloturee:
        "Demande clôturée",

      abandonnee:
        "Demande abandonnée",

      expiree:
        "Demande expirée"
    };

    return labels[status] || status;
  }

  function getAlertStatusLabel(status){

    const labels = {
      a_traiter:
        "À traiter",

      prise_en_compte:
        "Prise en compte",

      suivi_externe:
        "Suivi réalisé hors application",

      resolue:
        "Résolue",

      classee:
        "Classée sans suite"
    };

    return labels[status] || status;
  }

  function cleanAndClassifyDemands(){

    const demands =
      loadDemands();

    let changed = false;

    demands.forEach(function(demand){

      if(
        demand.status === "active" &&
        Number(demand.expiresAt || 0) <= Date.now()
      ){
        demand.status =
          "expiree";

        demand.expiredAt =
          Date.now();

        demand.expiredAtFr =
          new Date().toLocaleString("fr-FR");

        changed = true;
      }
    });

    if(changed){
      saveDemands(demands);
    }

    return demands;
  }

  function getDashboardHtml(){

    const demands =
      cleanAndClassifyDemands();

    const alerts =
      loadAlerts();

    const activeDemands =
      demands.filter(function(item){
        return (
          item.status !== "cloturee" &&
          item.status !== "abandonnee" &&
          item.status !== "expiree"
        );
      });

    const expiredDemands =
      demands.filter(function(item){
        return item.status === "expiree";
      });

    const openAlerts =
      alerts.filter(function(item){
        return (
          item.status !== "resolue" &&
          item.status !== "classee"
        );
      });

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Suivi Bo'CitéArt des besoins professionnels
        </strong>

        <br><br>

        Ce tableau est réservé
        au pilotage de Bo'CitéArt.

        <br><br>

        Il permet d’identifier
        les recherches qui reviennent régulièrement,
        de suivre leur niveau d’intérêt
        et d’organiser une réponse
        en dehors de l’application lorsque cela est utile.
      </div>

      <div
        style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px;
          margin-top:12px;
        ">

        <div class="box">
          <strong style="font-size:22px;">
            ${activeDemands.length}
          </strong>

          <br>

          Demande(s) active(s)
        </div>

        <div class="box">
          <strong style="font-size:22px;">
            ${openAlerts.length}
          </strong>

          <br>

          Alerte(s) à suivre
        </div>

        <div class="box">
          <strong style="font-size:22px;">
            ${
              activeDemands.reduce(
                function(total, item){
                  return (
                    total +
                    Number(item.count || 0)
                  );
                },
                0
              )
            }
          </strong>

          <br>

          Recherche(s) enregistrée(s)
        </div>

        <div class="box">
          <strong style="font-size:22px;">
            ${expiredDemands.length}
          </strong>

          <br>

          Demande(s) expirée(s)
        </div>
      </div>

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Alertes Bo'CitéArt
      </div>

      <div
        id="bociteProfessionalAlertList"
        style="margin-top:10px;">

        ${
          alerts.length
            ? alerts.map(function(alert){

                return `
                  <div
                    class="box"
                    style="
                      margin-top:8px;
                      border-left:6px solid ${
                        alert.status === "a_traiter"
                          ? "#b00020"
                          : "#2f5d46"
                      };
                    ">

                    <strong style="font-size:17px;">
                      ${escapeValue(alert.title)}
                    </strong>

                    <br><br>

                    Zone :

                    <strong>
                      ${escapeValue(alert.location)}
                    </strong>

                    <br><br>

                    Nombre de recherches :

                    <strong style="font-size:18px;">
                      ${Number(alert.count || 0)}
                    </strong>

                    <br><br>

                    Statut :

                    <strong>
                      ${escapeValue(
                        getAlertStatusLabel(
                          alert.status
                        )
                      )}
                    </strong>

                    <br><br>

                    Créée le :

                    ${escapeValue(
                      alert.createdAtFr || ""
                    )}

                    <label
                      style="
                        display:block;
                        margin-top:12px;
                        font-weight:900;
                      ">
                      Suivi de l’alerte
                    </label>

                    <select
                      class="miniField bociteProfessionalAlertStatus"
                      data-alert-id="${escapeValue(alert.id)}">

                      <option value="a_traiter">
                        À traiter
                      </option>

                      <option value="prise_en_compte">
                        Prise en compte
                      </option>

                      <option value="suivi_externe">
                        Suivi réalisé hors application
                      </option>

                      <option value="resolue">
                        Résolue
                      </option>

                      <option value="classee">
                        Classée sans suite
                      </option>
                    </select>

                    <textarea
                      class="miniField bociteProfessionalAlertNotes"
                      data-alert-notes-id="${escapeValue(alert.id)}"
                      style="
                        min-height:90px;
                        margin-top:8px;
                      "
                      placeholder="Indiquez les démarches réalisées, les entreprises contactées ou la solution envisagée.">${escapeValue(
                        alert.notes || ""
                      )}</textarea>

                    <button
                      class="choiceBtn bociteProfessionalAlertSaveBtn"
                      type="button"
                      data-alert-save-id="${escapeValue(alert.id)}"
                      style="width:100%;margin-top:8px;">
                      Enregistrer le suivi
                    </button>
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucune alerte enregistrée.
              </div>
            `
        }
      </div>

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Demandes professionnelles
      </div>

      <div
        id="bociteProfessionalDemandList"
        style="margin-top:10px;">

        ${
          demands.length
            ? demands.map(function(demand){

                const remainingDays =
                  getRemainingDays(
                    demand.expiresAt
                  );

                return `
                  <div
                    class="box"
                    style="
                      margin-top:8px;
                      border-left:6px solid ${
                        demand.status === "expiree"
                          ? "#777"
                          : "#2f5d46"
                      };
                    ">

                    <strong style="font-size:17px;">
                      ${escapeValue(demand.keyword)}
                    </strong>

                    <br><br>

                    Zone :

                    <strong>
                      ${escapeValue(demand.location)}
                    </strong>

                    <br><br>

                    Compteur :

                    <strong style="font-size:18px;">
                      ${Number(demand.count || 0)}
                    </strong>

                    <br><br>

                    Statut :

                    <strong>
                      ${escapeValue(
                        getDemandStatusLabel(
                          demand.status
                        )
                      )}
                    </strong>

                    <br><br>

                    Dernière recherche :

                    ${escapeValue(
                      demand.lastSearchAtFr ||
                      demand.createdAtFr ||
                      ""
                    )}

                    <br><br>

                    ${
                      demand.status === "expiree"
                        ? `
                          Cette demande est expirée.
                        `
                        : `
                          Validité restante :

                          <strong>
                            ${remainingDays} jour(s)
                          </strong>

                          <br><br>

                          Échéance :

                          <strong>
                            ${escapeValue(
                              demand.expiresAtFr ||
                              formatDate(
                                demand.expiresAt
                              )
                            )}
                          </strong>
                        `
                    }

                    <label
                      style="
                        display:block;
                        margin-top:12px;
                        font-weight:900;
                      ">
                      État du suivi
                    </label>

                    <select
                      class="miniField bociteProfessionalDemandStatus"
                      data-demand-id="${escapeValue(demand.id)}">

                      <option value="active">
                        Demande active
                      </option>

                      <option value="a_etudier">
                        À étudier
                      </option>

                      <option value="recherche_en_cours">
                        Recherche de solution en cours
                      </option>

                      <option value="entreprises_contactees">
                        Entreprises concernées contactées
                      </option>

                      <option value="solution_trouvee">
                        Solution trouvée
                      </option>

                      <option value="cloturee">
                        Demande clôturée
                      </option>

                      <option value="abandonnee">
                        Demande abandonnée
                      </option>

                      <option value="expiree">
                        Demande expirée
                      </option>
                    </select>

                    <textarea
                      class="miniField bociteProfessionalDemandNotes"
                      data-demand-notes-id="${escapeValue(demand.id)}"
                      style="
                        min-height:90px;
                        margin-top:8px;
                      "
                      placeholder="Notes internes Bo'CitéArt.">${escapeValue(
                        demand.notes || ""
                      )}</textarea>

                    <button
                      class="choiceBtn bociteProfessionalDemandSaveBtn"
                      type="button"
                      data-demand-save-id="${escapeValue(demand.id)}"
                      style="width:100%;margin-top:8px;">
                      Enregistrer le suivi
                    </button>

                    ${
                      demand.status !== "expiree"
                        ? `
                          <button
                            class="choiceBtn bociteProfessionalDemandExtendBtn"
                            type="button"
                            data-demand-extend-id="${escapeValue(demand.id)}"
                            style="
                              width:100%;
                              margin-top:8px;
                              background:#fff;
                            ">
                            Prolonger de trois mois
                          </button>
                        `
                        : ""
                    }
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucune demande professionnelle enregistrée.
              </div>
            `
        }
      </div>

      <button
        id="bociteProfessionalDashboardReturnBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
          background:#fff;
        ">
        Retour au pilotage
      </button>
    `;
  }

  function saveAlertTracking(alertId){

    const alerts =
      loadAlerts();

    const alert =
      alerts.find(function(item){
        return item.id === alertId;
      });

    if(!alert){
      alert(
        "Alerte introuvable."
      );
      return;
    }

    const statusInput =
      document.querySelector(
        '[data-alert-id="' +
        CSS.escape(alertId) +
        '"]'
      );

    const notesInput =
      document.querySelector(
        '[data-alert-notes-id="' +
        CSS.escape(alertId) +
        '"]'
      );

    alert.status =
      statusInput
        ? String(statusInput.value || "")
        : alert.status;

    alert.notes =
      notesInput
        ? String(notesInput.value || "").trim()
        : "";

    alert.updatedAt =
      Date.now();

    alert.updatedAtFr =
      new Date().toLocaleString("fr-FR");

    saveAlerts(alerts);

    openDemandDashboard();
  }

  function saveDemandTracking(demandId){

    const demands =
      loadDemands();

    const demand =
      demands.find(function(item){
        return item.id === demandId;
      });

    if(!demand){
      window.alert(
        "Demande introuvable."
      );
      return;
    }

    const statusInput =
      document.querySelector(
        '[data-demand-id="' +
        CSS.escape(demandId) +
        '"]'
      );

    const notesInput =
      document.querySelector(
        '[data-demand-notes-id="' +
        CSS.escape(demandId) +
        '"]'
      );

    demand.status =
      statusInput
        ? String(statusInput.value || "")
        : demand.status;

    demand.notes =
      notesInput
        ? String(notesInput.value || "").trim()
        : "";

    demand.updatedAt =
      Date.now();

    demand.updatedAtFr =
      new Date().toLocaleString("fr-FR");

    saveDemands(demands);

    openDemandDashboard();
  }

  function extendDemand(demandId){

    const demands =
      loadDemands();

    const demand =
      demands.find(function(item){
        return item.id === demandId;
      });

    if(!demand){
      alert(
        "Demande introuvable."
      );
      return;
    }

    demand.status =
      "active";

    demand.expiresAt =
      Date.now() +
      (
        90 *
        24 *
        60 *
        60 *
        1000
      );

    demand.expiresAtFr =
      formatDate(
        demand.expiresAt
      );

    demand.updatedAt =
      Date.now();

    demand.updatedAtFr =
      new Date().toLocaleString("fr-FR");

    saveDemands(demands);

    alert(
      "La demande est prolongée de trois mois."
    );

    openDemandDashboard();
  }

  function restoreSelectedStatuses(){

    const alerts =
      loadAlerts();

    alerts.forEach(function(alert){

      const input =
        document.querySelector(
          '[data-alert-id="' +
          CSS.escape(alert.id) +
          '"]'
        );

      if(input){
        input.value =
          alert.status || "a_traiter";
      }
    });

    const demands =
      loadDemands();

    demands.forEach(function(demand){

      const input =
        document.querySelector(
          '[data-demand-id="' +
          CSS.escape(demand.id) +
          '"]'
        );

      if(input){
        input.value =
          demand.status || "active";
      }
    });
  }

  function bindDemandDashboard(){

    restoreSelectedStatuses();

    document
      .querySelectorAll(
        ".bociteProfessionalAlertSaveBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          saveAlertTracking(
            button.getAttribute(
              "data-alert-save-id"
            )
          );
        };
      });

    document
      .querySelectorAll(
        ".bociteProfessionalDemandSaveBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          saveDemandTracking(
            button.getAttribute(
              "data-demand-save-id"
            )
          );
        };
      });

    document
      .querySelectorAll(
        ".bociteProfessionalDemandExtendBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          extendDemand(
            button.getAttribute(
              "data-demand-extend-id"
            )
          );
        };
      });

    const returnButton =
      getElement(
        "bociteProfessionalDashboardReturnBtn"
      );

    if(returnButton){

      returnButton.onclick = function(){

        if(
          typeof module.openDirection ===
          "function"
        ){
          module.openDirection();
          return;
        }

        if(
          typeof module.openHome ===
          "function"
        ){
          module.openHome();
        }
      };
    }
  }

  function openDemandDashboard(){

    module.renderModal(
      "Suivi des demandes professionnelles",
      getDashboardHtml()
    );

    window.setTimeout(function(){
      bindDemandDashboard();
    },0);
  }

  module.openProfessionalDemandDashboard =
    openDemandDashboard;

  module.loadProfessionalDemandDashboard =
    cleanAndClassifyDemands;

  console.log(
    "✅ Tableau privé des demandes professionnelles chargé"
  );

})();

/* =========================================================
   BO'CITÉART — RECHERCHE ENTREPRISE
   PARTIE 5D — RACCORDEMENT AU PILOTAGE PRIVÉ
   ========================================================= */

(function connectProfessionalDemandDashboardToDirection(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function findDirectionHost(){

    const possibleHosts = [
      getElement("directionActions"),
      getElement("directionButtons"),
      getElement("entrepriseDirectionActions"),
      getElement("directionProposalSummary"),
      getElement("directionMutualisationList"),
      document.querySelector(
        "#modalContent"
      ),
      document.querySelector(
        ".modalContent"
      ),
      document.querySelector(
        ".modal-content"
      ),
      document.querySelector(
        "[role='dialog']"
      )
    ];

    return possibleHosts.find(function(host){
      return !!host;
    }) || null;
  }

  function openProfessionalDemandDashboard(){

    if(
      typeof module.openProfessionalDemandDashboard ===
      "function"
    ){
      module.openProfessionalDemandDashboard();
      return;
    }

    alert(
      "Le tableau de suivi des demandes professionnelles " +
      "est momentanément indisponible."
    );
  }

  function addProfessionalDemandDashboardButton(){

    if(
      getElement(
        "directionProfessionalDemandDashboardBtn"
      )
    ){
      return;
    }

    const host =
      findDirectionHost();

    if(!host){
      console.warn(
        "Bo'CitéArt : emplacement du bouton de suivi introuvable."
      );
      return;
    }

    const container =
      document.createElement("div");

    container.id =
      "directionProfessionalDemandDashboardBox";

    container.className =
      "box";

    container.style.marginTop =
      "14px";

    container.style.borderLeft =
      "6px solid #2f5d46";

    container.innerHTML = `

  <div
    style="
      color:#2f5d46;
      font-size:17px;
      font-weight:800;
      line-height:1.35;
    ">
    Besoins professionnels détectés
  </div>

  <div
    style="
      margin-top:8px;
      color:#111111;
      font-size:14px;
      font-weight:400;
      line-height:1.5;
    ">
    Accès réservé au pilotage privé Bo'CitéArt.
  </div>

  <button
    id="directionProfessionalDemandDashboardBtn"
    class="choiceBtn"
    type="button"
    style="
      width:100%;
      margin-top:12px;
      background:#ffffff !important;
      color:#111111 !important;
    ">
    Ouvrir le suivi des demandes professionnelles
  </button>
`;
      
    host.appendChild(container);

    const button =
      getElement(
        "directionProfessionalDemandDashboardBtn"
      );

    if(button){
      button.onclick =
        openProfessionalDemandDashboard;
    }
  }

  function scheduleButtonInsertion(){

    window.setTimeout(function(){
      addProfessionalDemandDashboardButton();
    },50);

    window.setTimeout(function(){
      addProfessionalDemandDashboardButton();
    },200);
  }

  const originalOpenDirection =
    module.openDirection;

  if(
    typeof originalOpenDirection === "function" &&
    !module.__professionalDemandDashboardConnected
  ){
    module.__professionalDemandDashboardConnected =
      true;

    const patchedOpenDirection =
      function(){

        originalOpenDirection.apply(
          module,
          arguments
        );

        scheduleButtonInsertion();
      };

    module.openDirection =
      patchedOpenDirection;

    if(
      typeof module.registerScreen ===
      "function"
    ){
      module.registerScreen(
        "direction",
        patchedOpenDirection
      );
    }
  }

  document.addEventListener(
    "click",
    function(event){

      const button =
        event.target &&
        typeof event.target.closest === "function"
          ? event.target.closest(
              "#directionProfessionalDemandDashboardBtn"
            )
          : null;

      if(!button){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation ===
        "function"
      ){
        event.stopImmediatePropagation();
      }

      openProfessionalDemandDashboard();
    },
    true
  );

  module.addProfessionalDemandDashboardButton =
    addProfessionalDemandDashboardButton;

  console.log(
    "✅ Suivi des demandes raccordé au pilotage privé"
  );

})();

  /* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 5B — ACTUALITÉS ET VISIBILITÉ ENTREPRISE
   ========================================================= */

(function initBociteEntrepriseVisibilityNews(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const NEWS_STORE_KEY =
    "bociteart_entreprise_visibility_news_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadNews(){
    try{
      const raw =
        localStorage.getItem(NEWS_STORE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      return Array.isArray(parsed)
        ? parsed
        : [];
    }catch(error){
      console.warn(
        "Lecture des actualités impossible :",
        error
      );

      return [];
    }
  }

  function saveNews(news){
    try{
      localStorage.setItem(
        NEWS_STORE_KEY,
        JSON.stringify(news || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement des actualités impossible :",
        error
      );
    }
  }

  function createNewsId(){
    return (
      "ACTU-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,7)
    );
  }

 function getNewsManagerHtml(){

  return `

    <div
      class="box"
      style="
        border-left:6px solid #2f5d46;
        background:#ffffff;
        color:#111111;
        font-size:14px;
        line-height:1.5;
        font-weight:400;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:800;
          line-height:1.35;
        ">
        Faites vivre votre fiche professionnelle
      </div>

      <div
        style="
          margin-top:8px;
          color:#111111;
          font-size:14px;
          font-weight:400;
        ">
        Ajoutez une information utile :
        nouveauté, savoir-faire, réalisation,
        événement, promotion ou nouveau service.
      </div>

    </div>

    <div
      class="box"
      style="
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:800;
        ">
        Ajouter une actualité
      </div>

    </div>

    <label
      style="
        display:block;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Titre
    </label>

    <input
      id="visibilityNewsTitle"
      class="miniField"
      type="text"
      placeholder="Exemple : nouveau service proposé"
      style="
        background:#ffffff;
        color:#111111;
      ">

    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Type d’actualité
    </label>

    <select
      id="visibilityNewsType"
      class="miniField"
      style="
        background:#ffffff;
        color:#111111;
      ">

      <option value="Nouveauté">
        Nouveauté
      </option>

      <option value="Savoir-faire">
        Savoir-faire
      </option>

      <option value="Réalisation">
        Réalisation
      </option>

      <option value="Portes ouvertes">
        Portes ouvertes
      </option>

      <option value="Événement">
        Événement
      </option>

      <option value="Promotion">
        Promotion
      </option>

      <option value="Information">
        Information
      </option>

    </select>

    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Présentation
    </label>

    <textarea
      id="visibilityNewsDescription"
      class="miniField"
      style="
        min-height:120px;
        background:#ffffff;
        color:#111111;
      "
      placeholder="Présentez simplement votre actualité.">
    </textarea>

    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Date de début
    </label>

    <input
      id="visibilityNewsStartDate"
      class="miniField"
      type="date"
      style="
        background:#ffffff;
        color:#111111;
      ">

    <label
      style="
        display:block;
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
      Date de fin
    </label>

    <input
      id="visibilityNewsEndDate"
      class="miniField"
      type="date"
      style="
        background:#ffffff;
        color:#111111;
      ">

    <button
      id="visibilityNewsSaveBtn"
      class="choiceBtn"
      type="button"
      style="
        width:100%;
        margin-top:14px;
        background:#ffffff !important;
        color:#111111 !important;
      ">
      Enregistrer cette actualité
    </button>

    <div
      style="
        margin-top:18px;
        color:#2f5d46;
        font-size:17px;
        font-weight:800;
      ">
      Mes actualités
    </div>

    <div
      id="visibilityNewsList"
      style="
        margin-top:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">
    </div>

  `;
}

  function renderNewsList(){
    const host =
      getElement("visibilityNewsList");

    if(!host){
      return;
    }

    const news =
      loadNews()
        .slice()
        .sort(function(a,b){
          return Number(b.createdAt) -
            Number(a.createdAt);
        });

    if(!news.length){
      host.innerHTML = `
        <div class="box">
          Aucune actualité enregistrée.
        </div>
      `;
      return;
    }

    host.innerHTML =
      news.map(function(item){

        return `
          <div class="box">

            <strong style="font-size:16px;">
              ${escapeValue(item.title)}
            </strong>

            <br><br>

            <span
              style="
                font-weight:900;
                color:#2f5d46;
              ">
              ${escapeValue(item.type)}
            </span>

            <div
              style="
                margin-top:8px;
                line-height:1.5;
              ">
              ${escapeValue(item.description)}
            </div>

            ${
              item.startDate || item.endDate
                ? `
                  <div style="margin-top:10px;">
                    ${
                      item.startDate
                        ? "Du " +
                          escapeValue(item.startDate)
                        : ""
                    }

                    ${
                      item.endDate
                        ? " au " +
                          escapeValue(item.endDate)
                        : ""
                    }
                  </div>
                `
                : ""
            }

            <div
              style="
                margin-top:10px;
                font-size:12px;
                color:#666;
              ">
              Enregistrée le
              ${escapeValue(item.createdAtFr)}
            </div>

            <button
              class="choiceBtn visibilityNewsDeleteBtn"
              type="button"
              data-news-id="${escapeValue(item.id)}"
              style="
                width:100%;
                margin-top:10px;
                background:#fff;
              ">
              Supprimer cette actualité
            </button>
          </div>
        `;
      }).join("");

    host
      .querySelectorAll(
        ".visibilityNewsDeleteBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          deleteNews(
            button.getAttribute("data-news-id")
          );
        };
      });
  }

  function saveNewsForm(){
    const title =
      String(
        getElement("visibilityNewsTitle")
          ? getElement("visibilityNewsTitle").value
          : ""
      ).trim();

    const type =
      String(
        getElement("visibilityNewsType")
          ? getElement("visibilityNewsType").value
          : ""
      ).trim();

    const description =
      String(
        getElement("visibilityNewsDescription")
          ? getElement("visibilityNewsDescription").value
          : ""
      ).trim();

    const startDate =
      String(
        getElement("visibilityNewsStartDate")
          ? getElement("visibilityNewsStartDate").value
          : ""
      ).trim();

    const endDate =
      String(
        getElement("visibilityNewsEndDate")
          ? getElement("visibilityNewsEndDate").value
          : ""
      ).trim();

    if(!title){
      alert(
        "Indiquez le titre de l’actualité."
      );
      return;
    }

    if(!description){
      alert(
        "Présentez cette actualité."
      );
      return;
    }

    if(
      startDate &&
      endDate &&
      endDate < startDate
    ){
      alert(
        "La date de fin ne peut pas être antérieure à la date de début."
      );
      return;
    }

    const news =
      loadNews();

    news.push({
      id:createNewsId(),
      title:title,
      type:type,
      description:description,
      startDate:startDate,
      endDate:endDate,
      createdAt:Date.now(),
      createdAtFr:
        new Date().toLocaleString("fr-FR")
    });

    saveNews(news);

    alert(
      "L’actualité a été enregistrée."
    );

    openNewsManager();
  }

  function deleteNews(newsId){
    const confirmation =
      confirm(
        "Supprimer définitivement cette actualité ?"
      );

    if(!confirmation){
      return;
    }

    const news =
      loadNews().filter(function(item){
        return item.id !== newsId;
      });

    saveNews(news);
    renderNewsList();
  }

  function bindNewsManager(){
    const saveButton =
      getElement("visibilityNewsSaveBtn");

    if(saveButton){
      saveButton.onclick =
        saveNewsForm;
    }

    renderNewsList();
  }

  function openNewsManager(){
    module.renderModal(
      "Actualités de mon entreprise",
      getNewsManagerHtml()
    );

    window.setTimeout(function(){
      bindNewsManager();
    },0);
  }

  function addNewsButtonToVisibility(){
    const status =
      getElement("visibilityStatus");

    if(!status){
      return;
    }

    if(
      getElement(
        "visibilityManageNewsBtn"
      )
    ){
      return;
    }

    const button =
      document.createElement("button");

    button.id =
      "visibilityManageNewsBtn";

    button.className =
      "choiceBtn";

    button.type =
      "button";

    button.style.width =
      "100%";

    button.style.marginTop =
      "10px";

    button.textContent =
      "Gérer mes actualités";

    button.onclick = function(){
      openNewsManager();
    };

    status.insertAdjacentElement(
      "afterend",
      button
    );
  }

  const originalVisibilityScreen =
    module.screens.visibilite;

  if(
    typeof originalVisibilityScreen ===
    "function"
  ){
    module.registerScreen(
      "visibilite",
      function(){

        originalVisibilityScreen();

        window.setTimeout(function(){
          addNewsButtonToVisibility();
        },50);
      }
    );
  }

  module.openVisibilityNews =
    openNewsManager;

  module.loadVisibilityNews =
    loadNews;

  module.saveVisibilityNews =
    saveNews;

  console.log(
    "✅ Module Entreprise — partie 5B Actualités chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 5C — ABONNEMENT ET VISIBILITÉ PROFESSIONNELLE
   ========================================================= */

(function initBociteEntrepriseSubscriptionVisibility(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const SUBSCRIPTION_KEY =
    "bociteart_entreprise_subscription_demo_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function hasSubscription(){
    return (
      localStorage.getItem(SUBSCRIPTION_KEY) ===
      "active"
    );
  }

  function setSubscription(active){
    localStorage.setItem(
      SUBSCRIPTION_KEY,
      active ? "active" : "inactive"
    );
  }

  function loadVisibility(){
    if(
      typeof module.loadVisibilityData ===
      "function"
    ){
      return module.loadVisibilityData();
    }

    return {
      companyName:"",
      activity:"",
      phone:"",
      email:"",
      presentation:"",
      knowHow:"",
      services:"",
      website:"",
      updatedAt:null,
      updatedAtFr:""
    };
  }

  function saveVisibility(data){
    if(
      typeof module.saveVisibilityData ===
      "function"
    ){
      module.saveVisibilityData(data);
    }
  }

  function getLockedFeature(title, text){
    return `
      <button
        class="subscriptionLockedFeature"
        type="button"
        style="
          display:block;
          width:100%;
          margin:8px 0;
          padding:13px;
          border:2px solid #2f5d46;
          border-radius:10px;
          background:#f3eee5;
          color:#111;
          text-align:left;
          cursor:pointer;
        ">

        <strong>
          Accès avec abonnement — ${escapeValue(title)}
        </strong>

        <br><br>

        ${escapeValue(text)}

        <br><br>

        <span
          style="
            color:#b00020;
            font-weight:900;
          ">
          Découvrir ce que cette fonction peut vous apporter
        </span>
      </button>
    `;
  }

  function getSubscriptionArgumentHtml(){
    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:19px;">
          Votre référencement gratuit vous permet d’exister.
        </strong>

        <br><br>

        L’abonnement vous permet réellement
        de faire connaître votre entreprise,
        ses compétences et ce qui la distingue.
      </div>

      <div class="box">
        <strong>
          Une économie peut déjà rembourser votre abonnement
        </strong>

        <br><br>

        Imaginez que la mutualisation vous permette
        d’économiser seulement :

        <br><br>

        • 15 € par mois sur l’électricité ;<br>
        • 10 € par mois sur la téléphonie ;<br>
        • 8 € par mois sur une assurance ou un service.

        <br><br>

        Cela représente déjà :

        <br><br>

        <strong style="font-size:20px;">
          396 € d’économies sur une année.
        </strong>

        <br><br>

        Rien que ces quelques économies peuvent couvrir
        une grande partie, voire la totalité,
        du coût de l’abonnement selon la formule retenue.

        <br><br>

        Et ce calcul ne tient encore compte
        ni des nouveaux clients,
        ni des nouveaux partenaires,
        ni des opportunités commerciales.
      </div>

      <div class="box">
        <strong>
          Savez-vous réellement ce que votre manque
          de visibilité vous coûte ?
        </strong>

        <br><br>

        Vous connaissez probablement le montant
        de votre électricité, de votre assurance
        ou de votre carburant.

        <br><br>

        Mais avez-vous déjà calculé combien de clients,
        de fournisseurs ou de partenaires
        ne vous contactent jamais simplement
        parce qu’ils ignorent que votre entreprise existe
        ou ne savent pas précisément ce qu’elle propose ?

        <br><br>

        Une seule nouvelle relation commerciale
        peut parfois rapporter davantage
        que plusieurs années d’abonnement.
      </div>

      <div class="box">
        <strong>
          Avec l’abonnement, vous pourrez notamment :
        </strong>

        <br><br>

        • ajouter votre logo ;<br>
        • présenter votre entreprise ;<br>
        • expliquer votre savoir-faire ;<br>
        • présenter vos services ;<br>
        • indiquer votre adresse et votre localisation ;<br>
        • ajouter votre site Internet ;<br>
        • publier vos actualités ;<br>
        • montrer vos réalisations ;<br>
        • présenter vos nouveautés et promotions ;<br>
        • recevoir des demandes de devis ;<br>
        • accéder aux fonctions professionnelles ;<br>
        • participer pleinement aux mutualisations.
      </div>

      <button
        id="subscriptionDemoActivateBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Simuler l’activation de l’abonnement
      </button>

      <div
        class="muted"
        style="
          margin-top:9px;
          text-align:center;
        ">
        Bouton de démonstration uniquement.
        Le paiement réel sera raccordé ultérieurement.
      </div>
    `;
  }

  function openSubscriptionArgument(){
    module.renderModal(
      "Pourquoi activer l’abonnement ?",
      getSubscriptionArgumentHtml()
    );

    window.setTimeout(function(){

      const activateButton =
        getElement(
          "subscriptionDemoActivateBtn"
        );

      if(activateButton){
        activateButton.onclick = function(){

          setSubscription(true);

          alert(
            "Abonnement activé pour la démonstration."
          );

          module.openScreen("visibilite");
        };
      }
    },0);
  }

   function saveSubscriptionVisibilityForm(){

    const companyName =
      String(
        getElement("visibilityCompanyName")
          ? getElement("visibilityCompanyName").value
          : ""
      ).trim();

    const activity =
      String(
        getElement("visibilityActivity")
          ? getElement("visibilityActivity").value
          : ""
      ).trim();

    const presentation =
      String(
        getElement("visibilityPresentation")
          ? getElement("visibilityPresentation").value
          : ""
      ).trim();

    const knowHow =
      String(
        getElement("visibilityKnowHow")
          ? getElement("visibilityKnowHow").value
          : ""
      ).trim();

    const services =
      String(
        getElement("visibilityServices")
          ? getElement("visibilityServices").value
          : ""
      ).trim();

    const website =
      String(
        getElement("visibilityWebsite")
          ? getElement("visibilityWebsite").value
          : ""
      ).trim();

    const phone =
      String(
        getElement("visibilityPhone")
          ? getElement("visibilityPhone").value
          : ""
      ).trim();

    const email =
      String(
        getElement("visibilityEmail")
          ? getElement("visibilityEmail").value
          : ""
      ).trim();

    if(
      !companyName ||
      !activity ||
      !presentation
    ){
      alert(
        "Renseignez au minimum le nom, l’activité et la présentation."
      );
      return;
    }

    if(
      email &&
      !email.includes("@")
    ){
      alert(
        "L’adresse e-mail renseignée n’est pas valide."
      );
      return;
    }

    const data = {
      companyName:companyName,
      activity:activity,
      presentation:presentation,
      knowHow:knowHow,
      services:services,
      website:website,
      phone:phone,
      email:email,

      quoteEnabled:
        !!(
          getElement("visibilityQuoteEnabled") &&
          getElement("visibilityQuoteEnabled").checked
        ),

      recruitmentEnabled:
        !!(
          getElement("visibilityRecruitmentEnabled") &&
          getElement("visibilityRecruitmentEnabled").checked
        ),

      patronageEnabled:
        !!(
          getElement("visibilityPatronageEnabled") &&
          getElement("visibilityPatronageEnabled").checked
        ),

      newsEnabled:false,

      updatedAt:Date.now(),

      updatedAtFr:
        new Date().toLocaleString("fr-FR")
    };

    saveVisibilityData(data);

    const status =
      getElement("visibilityStatus");

    if(status){
      status.textContent =
        "Présentation enregistrée le " +
        data.updatedAtFr +
        ".";
    }

    alert(
      "La présentation de votre entreprise est enregistrée."
    );
  }

  function openVisibilityPreview(){

    const data =
      loadVisibilityData();

    if(
      !data.companyName ||
      !data.presentation
    ){
      alert(
        "Enregistrez d’abord la présentation de votre entreprise."
      );
      return;
    }

    module.renderModal(
      data.companyName,
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:19px;">
            ${escapeValue(data.companyName)}
          </strong>

          <br><br>

          <strong>
            ${escapeValue(data.activity || "")}
          </strong>
        </div>

        <div class="box">
          ${escapeValue(data.presentation)}
        </div>

        ${
          data.knowHow
            ? `
              <div class="box">
                <strong>
                  Métiers et savoir-faire
                </strong>

                <br><br>

                ${escapeValue(data.knowHow)}
              </div>
            `
            : ""
        }

        ${
          data.services
            ? `
              <div class="box">
                <strong>
                  Services proposés
                </strong>

                <br><br>

                ${escapeValue(data.services)}
              </div>
            `
            : ""
        }

        ${
          data.phone ||
          data.email ||
          data.website
            ? `
              <div class="box">

                <strong>
                  Contact
                </strong>

                <br><br>

                ${
                  data.phone
                    ? `
                      Téléphone :
                      ${escapeValue(data.phone)}
                      <br>
                    `
                    : ""
                }

                ${
                  data.email
                    ? `
                      E-mail :
                      ${escapeValue(data.email)}
                      <br>
                    `
                    : ""
                }

                ${
                  data.website
                    ? `
                      Site Internet :
                      ${escapeValue(data.website)}
                    `
                    : ""
                }
              </div>
            `
            : ""
        }

        <button
          id="visibilityPreviewModifyBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Modifier ces renseignements
        </button>
      `
    );

    window.setTimeout(function(){

      const modifyButton =
        getElement(
          "visibilityPreviewModifyBtn"
        );

      if(modifyButton){

        modifyButton.onclick = function(){

          module.openScreen(
            "visibilite"
          );
        };
      }

    },0);
  }

  function bindVisibility(){

    const directoryButton =
      getElement(
        "visibilityDirectoryBtn"
      );

    const editButton =
      getElement(
        "visibilityEditCardBtn"
      );

    const previewButton =
      getElement(
        "visibilityPreviewBtn"
      );

    const saveButton =
      getElement(
        "visibilitySaveBtn"
      );

    if(directoryButton){

      directoryButton.onclick = function(){

        if(
          typeof module.openLocalDirectory ===
          "function"
        ){
          module.openLocalDirectory();
          return;
        }

        module.openScreen(
          "annuaire_local"
        );
      };
    }

    if(editButton){

      editButton.onclick = function(){

        const form =
          getElement(
            "visibilityForm"
          );

        if(form){

          form.scrollIntoView({
            behavior:"smooth",
            block:"start"
          });
        }
      };
    }

    if(previewButton){

      previewButton.onclick =
        openVisibilityPreview;
    }

    if(saveButton){

      saveButton.onclick =
        saveVisibilityForm;
    }

    const saved =
      loadVisibilityData();

    const status =
      getElement(
        "visibilityStatus"
      );

    if(
      status &&
      saved.updatedAtFr
    ){
      status.textContent =
        "Dernière modification : " +
        saved.updatedAtFr +
        ".";
    }
  }

  function saveVisibilityForm(){
    const oldData = loadVisibility();
    const subscribed = hasSubscription();

    const companyName =
      String(
        getElement("subscriptionVisibilityCompanyName")
          ? getElement("subscriptionVisibilityCompanyName").value
          : ""
      ).trim();

    const activity =
      String(
        getElement("subscriptionVisibilityActivity")
          ? getElement("subscriptionVisibilityActivity").value
          : ""
      ).trim();

    const phone =
      String(
        getElement("subscriptionVisibilityPhone")
          ? getElement("subscriptionVisibilityPhone").value
          : ""
      ).trim();

    const email =
      String(
        getElement("subscriptionVisibilityEmail")
          ? getElement("subscriptionVisibilityEmail").value
          : ""
      ).trim();

    if(
      !companyName ||
      !activity ||
      !phone ||
      !email
    ){
      alert(
        "Renseignez le nom, l’activité, le téléphone et l’adresse e-mail."
      );
      return;
    }

    if(!email.includes("@")){
      alert(
        "Renseignez une adresse e-mail valide."
      );
      return;
    }

    const newData =
      Object.assign({}, oldData, {
        companyName:companyName,
        activity:activity,
        phone:phone,
        email:email,
        updatedAt:Date.now(),
        updatedAtFr:
          new Date().toLocaleString("fr-FR")
      });

    if(subscribed){
      newData.presentation =
        String(
          getElement("subscriptionVisibilityPresentation")
            ? getElement("subscriptionVisibilityPresentation").value
            : ""
        ).trim();

      newData.knowHow =
        String(
          getElement("subscriptionVisibilityKnowHow")
            ? getElement("subscriptionVisibilityKnowHow").value
            : ""
        ).trim();

      newData.services =
        String(
          getElement("subscriptionVisibilityServices")
            ? getElement("subscriptionVisibilityServices").value
            : ""
        ).trim();

      newData.website =
        String(
          getElement("subscriptionVisibilityWebsite")
            ? getElement("subscriptionVisibilityWebsite").value
            : ""
        ).trim();
    }

    saveVisibility(newData);

    const status =
      getElement("subscriptionVisibilityStatus");

    if(status){
      status.textContent =
        "Fiche enregistrée le " +
        newData.updatedAtFr +
        ".";
    }

    alert(
      "Votre fiche entreprise a été enregistrée."
    );
  }

  function bindVisibilityScreen(){
    const saveButton =
      getElement("subscriptionVisibilitySaveBtn");

    const argumentButton =
      getElement("subscriptionOpenArgumentBtn");

    const deactivateButton =
      getElement("subscriptionDemoDeactivateBtn");

    const newsButton =
      getElement("subscriptionVisibilityNewsBtn");

    const patronageButton =
      getElement("subscriptionVisibilityPatronageBtn");

    if(saveButton){
      saveButton.onclick =
      saveSubscriptionVisibilityForm;
    }

    if(argumentButton){
      argumentButton.onclick =
        openSubscriptionArgument;
    }

    if(deactivateButton){
      deactivateButton.onclick = function(){
        setSubscription(false);

        alert(
          "Abonnement de démonstration désactivé."
        );

        module.openScreen("visibilite");
      };
    }

    if(newsButton){
      newsButton.onclick = function(){
        if(
          typeof module.openVisibilityNews ===
          "function"
        ){
          module.openVisibilityNews();
          return;
        }

        alert(
          "La gestion des actualités sera disponible après chargement du module correspondant."
        );
      };
    }

    if(patronageButton){
      patronageButton.onclick = function(){
        module.openScreen("mecenat");
      };
    }

    document
      .querySelectorAll(
        ".subscriptionLockedFeature"
      )
      .forEach(function(button){
        button.onclick =
          openSubscriptionArgument;
      });
  }

   function openSubscriptionVisibility(){

    module.renderModal(
      "Faites connaître votre entreprise",
      getVisibilityHtml(),
      {
        presentationFooter:true
      }
    );

    window.setTimeout(function(){

      bindVisibilityScreen();

    },0);
  }

  module.registerScreen(
    "visibilite",
    openSubscriptionVisibility
  );

  module.hasEntrepriseSubscription =
    hasSubscription;

  module.setEntrepriseSubscription =
    setSubscription;

  module.openEntrepriseSubscription =
    openSubscriptionArgument;

  console.log(
    "✅ Abonnement Entreprise et visibilité professionnelle chargés"
  );

})();

/* =========================================================
   BO'CITÉART — CORRECTIONS ENTREPRISE
   RECHERCHE • RETOUR • EMPLOI PRIVÉ
   ========================================================= */

(function correctBociteEntrepriseScreens(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function getModalContent(){
    return document.querySelector(
      ".modal-content, .modalContent, #modalContent"
    );
  }

  function cleanProfessionalSearchScreen(){

    const modal =
      getModalContent();

    if(!modal){
      return;
    }

    modal
      .querySelectorAll(".box")
      .forEach(function(box){

        const text =
          String(box.textContent || "")
            .replace(/\s+/g, " ")
            .trim();

        if(
          text.includes(
            "La zone indiquée ici est totalement indépendante"
          )
        ){
          box.innerHTML = `
            <strong style="font-size:19px;">
              Recherche professionnelle
            </strong>

            <br><br>

            Recherchez une entreprise,
            un artisan,
            un fournisseur,
            un sous-traitant,
            un partenaire
            ou une compétence.
          `;
        }

        if(
          text.includes("Types de recherche") ||
          (
            text.includes("Formations") &&
            text.includes("Repreneurs")
          )
        ){
          box.remove();
        }
      });
  }

function ensureEntrepriseBackButton(){

  /*
    Le bouton Retour est désormais créé
    automatiquement par renderModal()
    et utilise l’historique avec goBack().
  */

  return;
}

  function hideEmploymentPrice(){

    const modal =
      getModalContent();

    if(!modal){
      return;
    }

    modal
      .querySelectorAll(".box")
      .forEach(function(box){

        const text =
          String(box.textContent || "")
            .replace(/\s+/g, " ")
            .trim();

        if(
          text.includes(
            "Tarif professionnel prévu"
          ) ||
          text.includes("50 € HT")
        ){
          box.innerHTML = `
            <strong>
              Publication réservée à l’espace professionnel
            </strong>

            <br><br>

            Les conditions de publication,
            la tarification,
            le paiement
            et la facturation
            sont accessibles uniquement
            après connexion à l’espace privé
            de l’entreprise.
          `;
        }
      });
  }

  function applyScreenCorrections(){

    window.setTimeout(function(){

      cleanProfessionalSearchScreen();
      ensureEntrepriseBackButton();
      hideEmploymentPrice();

    },50);
  }

  const originalSearchHub =
    module.openProfessionalSearchHub;

  if(
    typeof originalSearchHub ===
    "function"
  ){
    module.openProfessionalSearchHub =
      function(){

        originalSearchHub.apply(
          module,
          arguments
        );

        applyScreenCorrections();
      };

    module.registerScreen(
      "annuaire",
      module.openProfessionalSearchHub
    );
  }

  const originalEmploymentScreen =
    module.openEmployment;

  if(
    typeof originalEmploymentScreen ===
    "function"
  ){
    module.registerScreen(
      "emploi",
      function(){

        originalEmploymentScreen();

        window.setTimeout(function(){

          ensureEntrepriseBackButton();

          const createButton =
            getElement(
              "employmentCreateOfferBtn"
            );

          if(createButton){

            createButton.onclick =
              function(){

                const openPrivateForm =
                  function(){

                    if(
                      typeof module.openEmploymentForm ===
                      "function"
                    ){
                      module.openEmploymentForm();

                      window.setTimeout(function(){

                        hideEmploymentPrice();
                        ensureEntrepriseBackButton();

                      },50);
                    }
                  };

                if(
                  typeof module.requirePartnerAccess ===
                  "function"
                ){
                  module.requirePartnerAccess(
                    openPrivateForm
                  );

                  return;
                }

                openPrivateForm();
              };
          }

        },50);
      }
    );
  }

  const observer =
    new MutationObserver(function(){

      window.setTimeout(function(){

        cleanProfessionalSearchScreen();
        hideEmploymentPrice();

      },20);
    });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  console.log(
    "✅ Corrections Recherche, Retour et tarif privé chargées"
  );

})();

/* =========================================================
   BO'CITÉART — ENTREPRISE
   MUTUALISATION — EXEMPLES CONCRETS ET ABONNEMENT
   ========================================================= */

(function improveEntrepriseMutualisation(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function addConcreteMutualisationExample(){

    const list =
      getElement("mutualisationList");

    if(!list){
      return;
    }

    if(
      getElement("mutualisationConcreteExample")
    ){
      return;
    }

    const example =
      document.createElement("div");

    example.id =
      "mutualisationConcreteExample";

    example.className =
      "box";

    example.style.marginTop =
      "14px";

    example.style.borderLeft =
      "6px solid #2f5d46";

    example.innerHTML = `
      <strong style="font-size:18px;">
        Concrètement, que pouvez-vous économiser ?
      </strong>

      <br><br>

      Prenons un exemple volontairement prudent :

      <br><br>

      • 15 € par mois sur l’électricité ;<br>
      • 10 € par mois sur la téléphonie ou Internet ;<br>
      • 8 € par mois sur une assurance ou un autre contrat.

      <br><br>

      Cela représente déjà :

      <br><br>

      <strong style="font-size:21px;color:#2f5d46;">
        396 € d’économies sur une année
      </strong>

      <br><br>

      Rien que ces trois économies peuvent couvrir
      une grande partie, voire la totalité,
      de votre abonnement Bo'CitéArt
      selon la formule choisie.

      <br><br>

      Et ce calcul ne tient pas encore compte :

      <br><br>

      • d’un nouveau client ;<br>
      • d’un nouveau fournisseur ;<br>
      • d’un partenaire rencontré localement ;<br>
      • d’un recrutement plus proche ;<br>
      • des possibilités offertes par le mécénat.

      <br><br>

      <strong>
        L’abonnement ne doit donc pas seulement être considéré
        comme une charge.
      </strong>

      <br><br>

      Il peut devenir un outil qui contribue lui-même
      à financer son coût et à développer votre entreprise.
    `;

    list.insertAdjacentElement(
      "afterend",
      example
    );
  }

  function addIsolationMessage(){

    if(
      getElement("mutualisationIsolationMessage")
    ){
      return;
    }

    const example =
      getElement("mutualisationConcreteExample");

    if(!example){
      return;
    }

    const message =
      document.createElement("div");

    message.id =
      "mutualisationIsolationMessage";

    message.className =
      "box";

    message.style.marginTop =
      "12px";

    message.innerHTML = `
      <strong style="font-size:18px;">
        Combien vous coûte le fait de rester seul ?
      </strong>

      <br><br>

      Une entreprise seule dispose souvent
      d’un pouvoir de négociation limité.

      <br><br>

      En se regroupant avec d’autres entreprises,
      elle peut comparer davantage,
      recevoir des propositions collectives
      et décider librement de les accepter ou non.

      <br><br>

      Refuser de participer reste toujours possible.

      <br><br>

      Mais cela signifie aussi continuer à négocier seul,
      alors que d’autres entreprises du territoire
      peuvent obtenir ensemble de meilleures conditions.
    `;

    example.insertAdjacentElement(
      "afterend",
      message
    );
  }

  function addSubscriptionMutualisationButton(){

    if(
      getElement("mutualisationSubscriptionBtn")
    ){
      return;
    }

    const message =
      getElement("mutualisationIsolationMessage");

    if(!message){
      return;
    }

    const button =
      document.createElement("button");

    button.id =
      "mutualisationSubscriptionBtn";

    button.className =
      "choiceBtn";

    button.type =
      "button";

    button.style.width =
      "100%";

    button.style.marginTop =
      "12px";

    button.textContent =
      "Voir ce que l’abonnement peut m’apporter";

    button.onclick = function(){

      if(
        typeof module.openEntrepriseSubscription ===
        "function"
      ){
        module.openEntrepriseSubscription();
        return;
      }

      alert(
        "La présentation de l’abonnement est momentanément indisponible."
      );
    };

    message.insertAdjacentElement(
      "afterend",
      button
    );
  }

  function applyMutualisationImprovements(){

    window.setTimeout(function(){

      addConcreteMutualisationExample();
      addIsolationMessage();
      addSubscriptionMutualisationButton();

    },80);
  }

  const originalMutualisation =
    module.screens.mutualisation;

  if(
    typeof originalMutualisation ===
    "function"
  ){
    module.registerScreen(
      "mutualisation",
      function(){

        originalMutualisation();

        applyMutualisationImprovements();
      }
    );
  }

  console.log(
    "✅ Mutualisation concrète et abonnement chargés"
  );

})();

/* =========================================================
   BO'CITÉART
   ACCÉLÉRATION DES BANDES + HARMONISATION
   ========================================================= */

(function improveEntrepriseHome(){

"use strict";

const styleId =
"bociteartEntrepriseSpeed";

if(document.getElementById(styleId)){
    return;
}

const style =
document.createElement("style");

style.id = styleId;

style.textContent = `

#entrepriseHomeBands .entrepriseBandText{

animation-duration:58s !important;

}

#entrepriseHomeBands .entrepriseBand{

min-height:64px;

}

#entrepriseHomeBands .entrepriseBand strong{

font-size:18px;

}

#entrepriseHomeBands .entrepriseBand button{

font-size:15px;

}

.choiceBtn{

transition:.20s;

}

.choiceBtn:hover{

transform:translateY(-1px);

}

.box{

border-radius:10px;

}

`;

document.head.appendChild(style);

console.log(
"✅ Harmonisation Entreprise chargée"
);

})();

/* =========================================================
   BO'CITÉART — MUTUALISATION
   EXPLICATION DU SEUIL DE PARTICIPANTS
   ========================================================= */

(function addMutualisationThresholdExplanation(){

  "use strict";

  function addExplanation(){

    const modal =
      document.querySelector(
        ".modal-content, .modalContent, #modalContent"
      );

    if(!modal){
      return;
    }

    const title =
      String(
        modal.parentElement
          ? modal.parentElement.textContent
          : modal.textContent
      );

    if(
      !title.includes(
        "Opportunités de mutualisation"
      )
    ){
      return;
    }

    if(
      document.getElementById(
        "mutualisationThresholdExplanation"
      )
    ){
      return;
    }

    const warningBoxes =
      Array.from(
        modal.querySelectorAll(".box")
      );

    const freedomBox =
      warningBoxes.find(function(box){

        return String(
          box.textContent || ""
        ).includes(
          "Votre intérêt ne constitue pas un engagement"
        );
      });

    const explanation =
      document.createElement("div");

    explanation.id =
      "mutualisationThresholdExplanation";

    explanation.className =
      "box";

    explanation.style.borderLeft =
      "6px solid #2f5d46";

    explanation.style.marginTop =
      "14px";

    explanation.innerHTML = `
      <strong style="font-size:18px;">
        Pourquoi faut-il être plusieurs ?
      </strong>

      <br><br>

      Bo'CitéArt ne lancera pas une recherche
      ou une consultation pour une seule entreprise.

      <br><br>

      Chaque proposition devra réunir
      un nombre suffisamment important
      d’entreprises intéressées.

      <br><br>

      Un objectif sera fixé selon le type de besoin,
      par exemple 20, 30 entreprises ou davantage.

      <br><br>

      Lorsque ce seuil sera atteint,
      Bo'CitéArt pourra rechercher pour le groupe :

      <br><br>

      • des prestataires adaptés ;<br>
      • plusieurs propositions comparables ;<br>
      • de meilleures conditions ;<br>
      • une solution commune réellement avantageuse.

      <br><br>

      <strong>
        Plus les entreprises seront nombreuses,
        plus leur capacité de négociation pourra être forte.
      </strong>

      <br><br>

      Chacune restera ensuite entièrement libre
      d’accepter ou de refuser les propositions reçues.
    `;

    if(freedomBox){
      freedomBox.insertAdjacentElement(
        "beforebegin",
        explanation
      );
    }else{
      modal.appendChild(explanation);
    }
  }

  const observer =
    new MutationObserver(function(){
      window.setTimeout(
        addExplanation,
        30
      );
    });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  console.log(
    "✅ Explication du seuil de mutualisation ajoutée"
  );

})();

/* =========================================================
   BO'CITÉART — ENTREPRISE
   CORRECTION GÉNÉRALE DES ACCÈS PRIVÉS
   OPPORTUNITÉS • RECHERCHE • PÉRENNITÉ • MÉCÉNAT
   ========================================================= */

(function secureEntrepriseProfessionalFunctions(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const OPPORTUNITIES_KEY =
    "bociteart_professional_opportunities_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function getModalContent(){
    return document.querySelector(
      ".modal-content, .modalContent, #modalContent"
    );
  }

  function requirePrivateAccess(callback){

    if(
      typeof module.requirePartnerAccess ===
      "function"
    ){
      module.requirePartnerAccess(callback);
      return;
    }

    if(
      typeof module.openPartnerAccess ===
      "function"
    ){
      module.openPartnerAccess(callback);
      return;
    }

    alert(
      "L’accès professionnel privé est momentanément indisponible."
    );
  }

  function loadOpportunities(){

    try{
      const raw =
        localStorage.getItem(OPPORTUNITIES_KEY);

      const parsed =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed)
        ? parsed
        : [];
    }catch(error){
      return [];
    }
  }

  function saveOpportunities(list){

    try{
      localStorage.setItem(
        OPPORTUNITIES_KEY,
        JSON.stringify(list || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement des opportunités impossible :",
        error
      );
    }
  }

  function getPublicOpportunityListHtml(){

    const opportunities =
      loadOpportunities()
        .filter(function(item){
          return item.status === "publiee";
        })
        .sort(function(a,b){
          return Number(b.createdAt) -
            Number(a.createdAt);
        });

    const listHtml =
      opportunities.length
        ? opportunities.map(function(item){

            return `
              <button
                class="publicOpportunityCard"
                type="button"
                data-opportunity-id="${escapeValue(item.id)}"
                style="
                  display:block;
                  width:100%;
                  margin:9px 0;
                  padding:14px;
                  border:2px solid #2f5d46;
                  border-radius:10px;
                  background:#fffaf1;
                  color:#111;
                  text-align:left;
                  cursor:pointer;
                ">

                <strong style="font-size:17px;">
                  ${escapeValue(item.title)}
                </strong>

                <br><br>

                <span
                  style="
                    color:#2f5d46;
                    font-weight:900;
                  ">
                  ${escapeValue(item.type)}
                </span>

                <br><br>

                ${escapeValue(item.location || "Zone non précisée")}

                <br><br>

                <span
                  style="
                    color:#b00020;
                    font-weight:900;
                  ">
                  Consulter cette opportunité
                </span>
              </button>
            `;
          }).join("")
        : `
          <div class="box">
            Aucune opportunité professionnelle
            n’est actuellement publiée.
          </div>
        `;

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Toutes les opportunités professionnelles
        </strong>

        <br><br>

        Cette page regroupe les recherches
        de partenaires, fournisseurs,
        sous-traitants, compétences,
        formations et collaborations
        publiées par les professionnels.

        <br><br>

        Ouvrez uniquement l’offre
        qui correspond à votre activité.
      </div>

      <div id="publicOpportunityList">
        ${listHtml}
      </div>

      <button
        id="publicOpportunityPublishPrivateBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Publier une opportunité
      </button>
    `;
  }

  function openOpportunityDetail(opportunityId){

    const item =
      loadOpportunities().find(function(opportunity){
        return opportunity.id === opportunityId;
      });

    if(!item){
      alert(
        "Cette opportunité est introuvable."
      );
      return;
    }

    module.renderModal(
      item.title,
      `
        <div class="box">
          <strong>Type de demande</strong><br><br>
          ${escapeValue(item.type)}
        </div>

        <div class="box">
          <strong>Entreprise</strong><br><br>
          ${escapeValue(item.company)}
        </div>

        <div class="box">
          <strong>Description</strong><br><br>
          ${escapeValue(item.description)}
        </div>

        <div class="box">
          <strong>Zone concernée</strong><br><br>
          ${escapeValue(item.location || "Non précisée")}

          ${
            item.deadline
              ? `
                <br><br>

                <strong>Date limite</strong><br><br>
                ${escapeValue(item.deadline)}
              `
              : ""
          }
        </div>

        <button
          id="opportunityPrivateContactBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Accéder au contact professionnel
        </button>
      `
    );

    window.setTimeout(function(){

      const contactButton =
        getElement(
          "opportunityPrivateContactBtn"
        );

      if(contactButton){

        contactButton.onclick = function(){

          requirePrivateAccess(function(){

            alert(
              "Contact professionnel :\n\n" +
              item.email
            );
          });
        };
      }
    },0);
  }

  function bindPublicOpportunityList(){

    document
      .querySelectorAll(
        ".publicOpportunityCard"
      )
      .forEach(function(button){

        button.onclick = function(){

          openOpportunityDetail(
            button.getAttribute(
              "data-opportunity-id"
            )
          );
        };
      });

    const publishButton =
      getElement(
        "publicOpportunityPublishPrivateBtn"
      );

    if(publishButton){

      publishButton.onclick = function(){

        requirePrivateAccess(function(){

          if(
            typeof module.openPrivateProfessionalOpportunities ===
            "function"
          ){
            module.openPrivateProfessionalOpportunities();
            return;
          }

          if(
            typeof module.openProfessionalOpportunities ===
            "function"
          ){
            module.openProfessionalOpportunities();
          }
        });
      };
    }
  }

  function openPublicOpportunityList(){

    module.renderModal(
      "Opportunités professionnelles",
      getPublicOpportunityListHtml()
    );

    window.setTimeout(function(){
      bindPublicOpportunityList();
    },0);
  }

  function correctPrivateOpportunityForm(){

    const modal = getModalContent();

    if(!modal){
      return;
    }

    const legal =
      getElement(
        "professionalOpportunityLegal"
      );

    const payment =
      getElement(
        "professionalOpportunityPayment"
      );

    if(legal){

      const label =
        legal.closest("label");

      if(label){
        label.remove();
      }
    }

    if(payment){

      const label =
        payment.closest("label");

      if(label){

        label.innerHTML = `
          <input
            id="professionalOpportunityPayment"
            type="checkbox">

          <span>
            Je confirme la publication
            et j’accepte les conditions tarifaires
            affichées dans mon espace professionnel privé.
          </span>
        `;
      }
    }

    if(
      !getElement(
        "professionalOpportunityDiffusionInfo"
      )
    ){

      const publishButton =
        getElement(
          "professionalOpportunityPublishBtn"
        );

      if(publishButton){

        const information =
          document.createElement("div");

        information.id =
          "professionalOpportunityDiffusionInfo";

        information.className =
          "box";

        information.style.marginTop =
          "12px";

        information.style.borderLeft =
          "6px solid #2f5d46";

        information.innerHTML = `
          <strong>
            Où votre opportunité sera-t-elle visible ?
          </strong>

          <br><br>

          Après validation et paiement,
          elle apparaîtra dans la page générale
          « Opportunités professionnelles ».

          <br><br>

          Les entreprises et les commerçants
          pourront consulter l’ensemble des offres,
          puis ouvrir uniquement celle
          qui correspond à leurs besoins.

          <br><br>

          Les coordonnées de contact
          resteront réservées aux professionnels
          disposant d’un accès privé.
        `;

        publishButton.insertAdjacentElement(
          "beforebegin",
          information
        );
      }
    }
  }

  function securePrivateButtons(){

    const privateIds = [
      "professionalHubSearchBtn",
      "developmentSaveBtn",
      "developmentReadBtn",
      "perenniteSaveBtn",
      "perenniteReadBtn",
      "mecenatPrivateBtn",
      "mecenatPrivateDashboardBtn",
      "subscriptionVisibilitySaveBtn",
      "subscriptionVisibilityNewsBtn",
      "employmentCreateOfferBtn",
      "employmentApplicationsBtn"
    ];

    privateIds.forEach(function(id){

      const button = getElement(id);

      if(
        !button ||
        button.dataset.privateSecured === "yes"
      ){
        return;
      }

      const originalAction =
        button.onclick;

      button.dataset.privateSecured =
        "yes";

      button.onclick = function(event){

        if(event){
          event.preventDefault();
          event.stopPropagation();
        }

        requirePrivateAccess(function(){

          if(
            typeof originalAction ===
            "function"
          ){
            originalAction.call(button);
          }
        });
      };
    });
  }

  function correctSubscriptionTexts(){

    document
      .querySelectorAll(
        ".subscriptionLockedFeature"
      )
      .forEach(function(button){

        if(
          button.querySelector(
            ".subscriptionClickHere"
          )
        ){
          return;
        }

        const line =
          document.createElement("div");

        line.className =
          "subscriptionClickHere";

        line.style.marginTop =
          "8px";

        line.style.color =
          "#b00020";

        line.style.fontWeight =
          "900";

        line.textContent =
          "Cliquez ici pour vous abonner";

        button.appendChild(line);
      });

    const deactivateButton =
      getElement(
        "subscriptionDemoDeactivateBtn"
      );

    if(deactivateButton){
      deactivateButton.remove();
    }

    const activateButton =
      getElement(
        "subscriptionDemoActivateBtn"
      );

    if(activateButton){

      activateButton.textContent =
        "Accéder à l’abonnement professionnel";
    }

    document
      .querySelectorAll(
        ".muted"
      )
      .forEach(function(element){

        const text =
          String(
            element.textContent || ""
          );

        if(
          text.includes(
            "Bouton de démonstration uniquement"
          )
        ){
          element.remove();
        }
      });
  }

  function secureMecenatAccess(){

    const privateButton =
      getElement(
        "mecenatPrivateAccessBtn"
      ) ||
      getElement(
        "mecenatPrivateBtn"
      ) ||
      getElement(
        "mecenatPrivateDashboardBtn"
      );

    if(
      !privateButton ||
      privateButton.dataset.privateSecured === "yes"
    ){
      return;
    }

    const original =
      privateButton.onclick;

    privateButton.dataset.privateSecured =
      "yes";

    privateButton.onclick = function(){

      requirePrivateAccess(function(){

        if(
          typeof original ===
          "function"
        ){
          original.call(privateButton);
          return;
        }

        if(
          typeof module.openMecenatPrivateSpace ===
          "function"
        ){
          module.openMecenatPrivateSpace();
        }
      });
    };
  }

  function securePerenniteActions(){

    const selectors = [
      "#perenniteSaveBtn",
      "#perenniteReadBtn",
      "#perenniteActionBtn",
      "[data-perennite-private]"
    ];

    selectors.forEach(function(selector){

      document
        .querySelectorAll(selector)
        .forEach(function(button){

          if(
            button.dataset.privateSecured ===
            "yes"
          ){
            return;
          }

          const original =
            button.onclick;

          button.dataset.privateSecured =
            "yes";

          button.onclick = function(){

            requirePrivateAccess(function(){

              if(
                typeof original ===
                "function"
              ){
                original.call(button);
              }
            });
          };
        });
    });
  }

  function applyCorrections(){

    window.setTimeout(function(){

      correctPrivateOpportunityForm();
      securePrivateButtons();
      secureMecenatAccess();
      securePerenniteActions();
      correctSubscriptionTexts();

    },60);
  }

  module.openPublicProfessionalOpportunities =
    openPublicOpportunityList;

  module.registerScreen(
    "opportunites",
    openPublicOpportunityList
  );

  const previousPrivateOpportunity =
    module.openPrivateProfessionalOpportunities ||
    module.openProfessionalOpportunities;

  if(
    typeof previousPrivateOpportunity ===
    "function"
  ){

    module.openPrivateProfessionalOpportunities =
      function(){

        requirePrivateAccess(function(){

          previousPrivateOpportunity.apply(
            module,
            arguments
          );

          window.setTimeout(function(){
            correctPrivateOpportunityForm();
          },80);
        });
      };
  }

  const observer =
    new MutationObserver(function(){
      applyCorrections();
    });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  applyCorrections();

  console.log(
    "✅ Accès privés, opportunités et abonnement corrigés"
  );

})();

/* =========================================================
   BO'CITÉART
   ACCÈS PRIVÉ UNIQUE — RACCORDEMENT AU COMPTE PARTENAIRE
   ========================================================= */

(function connectEntreprisePrivateAccess(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt : module Entreprise introuvable."
    );
    return;
  }

  module.requirePrivateAccess =
    function(callback){

      if(
        typeof module.requirePartnerAccess ===
        "function"
      ){
        return module.requirePartnerAccess(
          callback
        );
      }

      if(
        typeof module.openPartnerAccess ===
        "function"
      ){
        module.openPartnerAccess(
          callback
        );

        return false;
      }

      alert(
        "L’accès professionnel privé est momentanément indisponible."
      );

      return false;
    };

  module.hasPrivateAccess =
    function(){

      if(
        typeof module.isPartnerAuthenticated ===
        "function"
      ){
        return module.isPartnerAuthenticated();
      }

      return false;
    };

  module.openPrivateAccess =
    function(callback){

      return module.requirePrivateAccess(
        callback
      );
    };

  console.log(
    "✅ Accès privé raccordé au compte partenaire Entreprise / Commerce"
  );

})();

/* =========================================================
   BO'CITÉART
   ESPACE PRIVÉ — OFFRES, ABONNEMENTS ET SERVICES
   ========================================================= */

(function initEntreprisePrivateOffers(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt : module Entreprise introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function openProtected(action){

    if(
      typeof module.requirePrivateAccess ===
      "function"
    ){
      module.requirePrivateAccess(action);
      return;
    }

    if(
      typeof module.requirePartnerAccess ===
      "function"
    ){
      module.requirePartnerAccess(action);
      return;
    }

    alert(
      "L’accès professionnel privé est momentanément indisponible."
    );
  }

  function getPrivateOffersHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Mes services professionnels
        </strong>

        <br><br>

        Cet espace est uniquement accessible
        à l’entreprise ou au commerce connecté.

        <br><br>

        Les tarifs, les abonnements,
        les paiements, les publications
        et les factures ne sont jamais visibles
        depuis les pages publiques.
      </div>

      <button
        id="privateOffersVisibilityBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;">
        Ma fiche professionnelle
      </button>

      <button
        id="privateOffersEmploymentBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Publier une offre d’emploi
      </button>

      <button
        id="privateOffersOpportunityBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Publier une opportunité professionnelle
      </button>

      <button
        id="privateOffersMutualisationBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Participer aux mutualisations
      </button>

      <button
        id="privateOffersMecenatBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Mon espace mécénat
      </button>

      <button
        id="privateOffersPerenniteBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Mon suivi de pérennité
      </button>

      <button
        id="privateOffersBillingBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Abonnements, paiements et factures
      </button>

      <button
        id="privateOffersReturnBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Retour à mon espace privé
      </button>
    `;
  }

  function bindPrivateOffers(){

    const visibilityButton =
      getElement(
        "privateOffersVisibilityBtn"
      );

    const employmentButton =
      getElement(
        "privateOffersEmploymentBtn"
      );

    const opportunityButton =
      getElement(
        "privateOffersOpportunityBtn"
      );

    const mutualisationButton =
      getElement(
        "privateOffersMutualisationBtn"
      );

    const mecenatButton =
      getElement(
        "privateOffersMecenatBtn"
      );

    const perenniteButton =
      getElement(
        "privateOffersPerenniteBtn"
      );

    const billingButton =
      getElement(
        "privateOffersBillingBtn"
      );

    const returnButton =
      getElement(
        "privateOffersReturnBtn"
      );

    if(visibilityButton){
      visibilityButton.onclick = function(){
        module.openScreen("visibilite");
      };
    }

    if(employmentButton){
      employmentButton.onclick = function(){

        if(
          typeof module.openEmploymentForm ===
          "function"
        ){
          module.openEmploymentForm();
          return;
        }

        module.openScreen("emploi");
      };
    }

    if(opportunityButton){
      opportunityButton.onclick = function(){

        if(
          typeof module.openPrivateProfessionalOpportunities ===
          "function"
        ){
          module.openPrivateProfessionalOpportunities();
          return;
        }

        alert(
          "Le formulaire des opportunités est momentanément indisponible."
        );
      };
    }

    if(mutualisationButton){
      mutualisationButton.onclick = function(){
        module.openScreen("mutualisation");
      };
    }

    if(mecenatButton){
      mecenatButton.onclick = function(){

        if(
          typeof module.openMecenatPrivateSpace ===
          "function"
        ){
          module.openMecenatPrivateSpace();
          return;
        }

        module.openScreen("mecenat");
      };
    }

    if(perenniteButton){
      perenniteButton.onclick = function(){
        module.openScreen("perennite");
      };
    }

    if(billingButton){
      billingButton.onclick = function(){

        if(
          typeof module.openSearchBilling ===
          "function"
        ){
          module.openSearchBilling();
          return;
        }

        alert(
          "La page des abonnements et factures est momentanément indisponible."
        );
      };
    }

    if(returnButton){
      returnButton.onclick = function(){

        if(
          typeof module.openPrivateHome ===
          "function"
        ){
          module.openPrivateHome();
        }
      };
    }
  }

  function openPrivateOffers(){

    openProtected(function(){

      module.renderModal(
        "Offres et services professionnels",
        getPrivateOffersHtml()
      );

      window.setTimeout(function(){
        bindPrivateOffers();
      },0);
    });
  }

  module.openPrivateOffers =
    openPrivateOffers;

  console.log(
    "✅ Offres et services privés Entreprise chargés"
  );

})();

/* =========================================================
   BO'CITÉART
   VERROUILLAGE DES PAGES RÉSERVÉES
   ========================================================= */

(function secureProfessionalScreens(){

"use strict";

const module =
window.BociteEntreprise;

if(!module){
return;
}

const privateScreens=[

"visibilite",
"developpement",
"mutualisation",
"perennite",
"mecenat",
"opportunites"

];

privateScreens.forEach(function(screen){

const original=
module.screens[screen];

if(typeof original!=="function"){
return;
}

module.registerScreen(

screen,

function(){

const publicView=[
"developpement",
"mutualisation",
"perennite",
"mecenat"
].includes(screen);

if(publicView){

original();

return;

}

if(
typeof module.requirePrivateAccess===
"function"
){

module.requirePrivateAccess(function(){

original();

});

return;

}

original();

}

);

});

/* ==========================
Verrouillage des formulaires
========================== */

const observer=
new MutationObserver(function(){

document
.querySelectorAll("form")
.forEach(function(form){

if(
form.dataset.privateLock==="ok"
){
return;
}

const title=
String(
form.textContent||""
);

if(

title.includes("Publier") ||

title.includes("Enregistrer") ||

title.includes("Créer") ||

title.includes("Modifier")

){

form.dataset.privateLock="ok";

form
.querySelectorAll(

"input,textarea,select,button"

)
.forEach(function(field){

if(
field.type==="button" ||
field.type==="submit"
){

field.onclick=function(e){

e.preventDefault();

if(
typeof module.requirePrivateAccess===
"function"
){

module.requirePrivateAccess(function(){});

}

};

}

});

}

});

});

observer.observe(

document.body,

{

childList:true,
subtree:true

}

);

console.log(

"✅ Toutes les fonctions privées sécurisées"

);

})();

/* =========================================================
   Bo'CitéART — EMPLOI
   LISTE PUBLIQUE DES OFFRES + PUBLICATION PRIVÉE
   ========================================================= */ 

(function reorganizeEntrepriseEmployment(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function requirePrivateAccess(callback){

    if(
      typeof module.requirePrivateAccess ===
      "function"
    ){
      module.requirePrivateAccess(callback);
      return;
    }

    if(
      typeof module.requirePartnerAccess ===
      "function"
    ){
      module.requirePartnerAccess(callback);
      return;
    }

    alert(
      "L’accès professionnel privé est momentanément indisponible."
    );
  }

  function loadEmploymentData(){

    if(
      typeof module.loadEmploymentData ===
      "function"
    ){
      return module.loadEmploymentData();
    }

    try{
      const raw =
        localStorage.getItem(
          "bociteart_entreprise_employment_v1"
        );

      const parsed =
        raw ? JSON.parse(raw) : null;

      return {
        offers:
          parsed && Array.isArray(parsed.offers)
            ? parsed.offers
            : [],

        applications:
          parsed && Array.isArray(parsed.applications)
            ? parsed.applications
            : []
      };

    }catch(error){

      return {
        offers:[],
        applications:[]
      };
    }
  }

  function getStatusLabel(status){

    const labels = {
      publiee:"Publiée",
      modifiee:"Modifiée",
      pourvue:"Poste pourvu",
      cloturee:"Clôturée"
    };

    return labels[status] || "Inconnue";
  }

 function getEmploymentPublicHomeHtml(){

  return `

    <div
      class="box"
      style="border-left:6px solid #2f5d46;">

      <strong
        style="
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
        ">
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span> fait...
        <br>
        ...et relie pour vous !
      </strong>

      <br><br>

      Aujourd'hui, de nombreuses candidatures restent sans réponse.

      <br><br>

      <span style="color:#2f5d46;font-weight:700;">
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
      </span>
      simplifie les échanges entre les habitants et les entreprises de votre commune.

      <br><br>

      • Consultez les offres.

      <br>

      • Déposez votre candidature.

      <br>

      • Consultez votre historique.

      <br><br>

      Chaque envoi et chaque réponse sont automatiquement classés,
      enregistrés, datés et horodatés.

      <br><br>

      L'entreprise vous adressera une réponse.

      <br><br>

      Les habitants découvrent mieux les entreprises de leur commune.

      <br><br>

      Les entreprises deviennent enfin plus visibles dans leur ville.

      <br><br>

      Chacun identifie plus facilement l'autre.

      <br><br>

      À terme, cette proximité facilite les recrutements,
      encourage les candidatures et renforce durablement l'emploi local.

    </div>

    <button
      id="employmentPublicListBtn"
      class="choiceBtn"
      type="button"
      style="width:100%;">
      Consulter les offres
    </button>

    <button
      id="employmentPublicApplyBtn"
      class="choiceBtn"
      type="button"
      style="width:100%;margin-top:8px;">
      Déposer votre candidature
    </button>

    <button
      id="employmentHistoryBtn"
      class="choiceBtn"
      type="button"
      style="width:100%;margin-top:8px;">
      Consulter votre historique
    </button>

    <button
      id="employmentPrivatePublishBtn"
      class="choiceBtn"
      type="button"
      style="width:100%;margin-top:18px;">
      Accès entreprise
    </button>

  `;
}
   
function bindEmploymentPublicHome(){

  const listButton =
    getElement("employmentPublicListBtn");

  const applyButton =
    getElement("employmentPublicApplyBtn");

  const historyButton =
    getElement("employmentHistoryBtn");

  const companyButton =
    getElement("employmentPrivatePublishBtn");

  if(listButton){

    listButton.onclick =
      openPublicEmploymentList;
  }

  if(applyButton){

    applyButton.onclick = function(){

      if(
        typeof module.openApplicationForm ===
        "function"
      ){
        module.openApplicationForm();
        return;
      }

      alert(
        "La fiche de candidature est momentanément indisponible."
      );
    };
  }

  if(historyButton){

    historyButton.onclick = function(){

      if(
        typeof module.openEmploymentHistory ===
        "function"
      ){
        module.openEmploymentHistory();
        return;
      }

      if(
        typeof module.openEmploymentApplications ===
        "function"
      ){
        module.openEmploymentApplications();
        return;
      }

      alert(
        "Votre historique est momentanément indisponible."
      );
    };
  }

  if(companyButton){

    companyButton.onclick = function(){

      requirePrivateAccess(function(){

        if(
          typeof module.openEmploymentForm ===
          "function"
        ){
          module.openEmploymentForm();
          return;
        }

        alert(
          "L’espace entreprise est momentanément indisponible."
        );
      });
    };
  }
}

  function openEmploymentPublicHome(){

    module.renderModal(
      "Emploi",
      getEmploymentPublicHomeHtml()
    );

    window.setTimeout(function(){
      bindEmploymentPublicHome();
    },0);
  }

function getPublicEmploymentListHtml(){

  const data = loadEmploymentData();

  const offers =
    data.offers
      .filter(function(offer){

        return (
          offer.status === "publiee" ||
          offer.status === "modifiee"
        );
      })
      .sort(function(a,b){

        return (
          Number(b.createdAt || 0) -
          Number(a.createdAt || 0)
        );
      });

  if(!offers.length){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:10px;
          ">
          Offres disponibles
        </strong>

        Aucune offre d’emploi n’est actuellement disponible.

        <br><br>

        Vous pouvez toutefois déposer directement votre candidature
        auprès de l’entreprise de votre choix.
      </div>

      <button
        id="employmentEmptyApplyBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:10px;">
        Déposer votre candidature
      </button>
    `;
  }

  return `
    <div
      class="box"
      style="
        border-left:6px solid #2f5d46;
        color:#111;
        font-size:14px;
        font-weight:400;
      ">

      <strong
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
          margin-bottom:10px;
        ">
        Offres disponibles
      </strong>

      Consultez les offres publiées par les entreprises de votre commune.

      <br><br>

      Choisissez celle qui correspond à votre recherche.

      <br><br>

      <strong
        style="
          color:#2f5d46;
          font-size:16px;
          font-weight:900;
        ">
        ${offers.length} offre${offers.length > 1 ? "s" : ""} disponible${offers.length > 1 ? "s" : ""}
      </strong>
    </div>

    ${offers.map(function(offer){

      return `
        <button
          class="employmentPublicOfferCard"
          type="button"
          data-offer-id="${escapeValue(offer.id)}"
          style="
            display:block;
            width:100%;
            margin:9px 0;
            padding:14px;
            border:2px solid #2f5d46;
            border-radius:10px;
            background:#fffaf1;
            color:#111;
            font-size:14px;
            font-weight:400;
            text-align:left;
            cursor:pointer;
          ">

          <strong
            style="
              display:block;
              color:#2f5d46;
              font-size:16px;
              font-weight:900;
              margin-bottom:10px;
            ">
            ${escapeValue(offer.title)}
          </strong>

          <span style="color:#111;">
            ${escapeValue(offer.companyName)}
          </span>

          <br><br>

          <span style="color:#111;">
            ${escapeValue(offer.city)}
            •
            ${escapeValue(offer.contract)}
          </span>

          <br><br>

          <span
            style="
              color:#b00020;
              font-size:14px;
              font-weight:900;
            ">
            Voir cette offre
          </span>
        </button>
      `;
    }).join("")}
  `;
}

function openPublicEmploymentList(){

  module.renderModal(
    "Offres d’emploi",
    getPublicEmploymentListHtml()
  );

  window.setTimeout(function(){

    document
      .querySelectorAll(
        ".employmentPublicOfferCard"
      )
      .forEach(function(button){

        button.onclick = function(){

          openPublicEmploymentOffer(
            button.getAttribute(
              "data-offer-id"
            )
          );
        };
      });

    const emptyApplyButton =
      getElement(
        "employmentEmptyApplyBtn"
      );

    if(emptyApplyButton){

      emptyApplyButton.onclick = function(){

        if(
          typeof module.openApplicationForm ===
          "function"
        ){
          module.openApplicationForm();
          return;
        }

        alert(
          "La fiche de candidature est momentanément indisponible."
        );
      };
    }

  },0);

  window.setTimeout(function(){

    const backButton =
      document.querySelector(
        "#entrepriseUniversalBackButton," +
        ".bociteEntrepriseProtectedBackBtn," +
        "#entrepriseBackBtn," +
        "[data-entreprise-back]"
      );

    if(!backButton){
      return;
    }

    backButton.onclick = function(event){

      event.preventDefault();
      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation ===
        "function"
      ){
        event.stopImmediatePropagation();
      }

      if(
        typeof module.openEmploymentPublicHome ===
        "function"
      ){
        module.openEmploymentPublicHome();
        return;
      }

      openEmploymentPublicHome();
    };

  },180);
}
   
function openPublicEmploymentOffer(offerId){

  const data = loadEmploymentData();

  const offer =
    data.offers.find(function(item){
      return item.id === offerId;
    });

  if(!offer){

    alert(
      "Cette offre est introuvable."
    );

    return;
  }

  module.renderModal(
    offer.title,
    `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:8px;
          ">
          Entreprise
        </strong>

        ${escapeValue(
          offer.companyName
        )}
      </div>

      <div
        class="box"
        style="
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:8px;
          ">
          Type de contrat
        </strong>

        ${escapeValue(
          offer.contract
        )}

        <br><br>

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:8px;
          ">
          Commune du poste
        </strong>

        ${escapeValue(
          offer.city
        )}
      </div>

      <div
        class="box"
        style="
          color:#111;
          font-size:14px;
          font-weight:400;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:16px;
            font-weight:900;
            margin-bottom:8px;
          ">
          Description de l’offre
        </strong>

        ${escapeValue(
          offer.description
        )}
      </div>

      <button
        id="employmentPublicApplyBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;">
        Déposer votre candidature
      </button>

      <button
        id="employmentOfferBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Retour aux offres
      </button>
    `
  );

  window.setTimeout(function(){

    const applyButton =
      getElement(
        "employmentPublicApplyBtn"
      );

    const backButton =
      getElement(
        "employmentOfferBackBtn"
      );

    if(applyButton){

      applyButton.onclick = function(){

        if(
          typeof module.openApplicationForm ===
          "function"
        ){
          module.openApplicationForm(
            offerId
          );

          return;
        }

        alert(
          "La fiche de candidature est momentanément indisponible."
        );
      };
    }

    if(backButton){

      backButton.onclick =
        openPublicEmploymentList;
    }

  },0);
}

  module.openEmploymentPublicHome =
    openEmploymentPublicHome;

  module.openPublicEmploymentList =
    openPublicEmploymentList;

  module.openPublicEmploymentOffer =
    openPublicEmploymentOffer;

  console.log(
    "✅ Liste publique des offres d’emploi et publication privée chargées"
  );

})();

/* =========================================================
   BO'CITÉART — ENTREPRISE
   PÉRENNITÉ 
   INFORMATION PUBLIQUE + ACTIONS PRIVÉES
   ========================================================= */

(function separatePublicAndPrivateEntrepriseServices(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function requirePrivateAccess(callback){

    if(
      typeof module.requirePrivateAccess ===
      "function"
    ){
      module.requirePrivateAccess(callback);
      return;
    }

    if(
      typeof module.requirePartnerAccess ===
      "function"
    ){
      module.requirePartnerAccess(callback);
      return;
    }

    alert(
      "L’accès professionnel privé est momentanément indisponible."
    );
  }

  function getModalContent(){
    return document.querySelector(
      ".modal-content, .modalContent, #modalContent"
    );
  }

  function replacePublicFormsByPrivateAccess(service){

    const modal = getModalContent();

    if(!modal){
      return;
    }

    const privateFieldSelectors = [
      "textarea",
      "input[type='text']",
      "input[type='email']",
      "input[type='tel']",
      "input[type='date']",
      "input[type='number']",
      "select"
    ];

    const fields =
      modal.querySelectorAll(
        privateFieldSelectors.join(",")
      );

    if(!fields.length){
      addPrivateAccessBlock(service);
      return;
    }

    const containers = new Set();

    fields.forEach(function(field){

      const container =
        field.closest(
          ".box, form, fieldset"
        ) || field.parentElement;

      if(container){
        containers.add(container);
      }
    });

    containers.forEach(function(container){

      if(
        container.id ===
        service + "PrivateAccessBlock"
      ){
        return;
      }

      container.style.display = "none";
    });

    addPrivateAccessBlock(service);
  }

  function addPrivateAccessBlock(service){

    const modal = getModalContent();

    if(!modal){
      return;
    }

    const blockId =
      service + "PrivateAccessBlock";

    if(getElement(blockId)){
      return;
    }

    const labels = {
      perennite:{
        title:"Préparer l’avenir de mon entreprise",
        text:
          "Le diagnostic, le plan d’action, les dates de suivi et l’historique sont réservés à l’espace professionnel privé.",
        button:
          "Accéder à mon suivi de pérennité"
      },
       
    };

    const content =
      labels[service];

    if(!content){
      return;
    }

    const block =
      document.createElement("div");

    block.id = blockId;
    block.className = "box";
    block.style.marginTop = "14px";
    block.style.borderLeft =
      "6px solid #b00020";

    block.innerHTML = `
      <strong style="font-size:18px;">
        ${content.title}
      </strong>

      <br><br>

      ${content.text}

      <br><br>

      <button
        id="${service}PrivateOpenBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;">
        ${content.button}
      </button>
    `;

    modal.appendChild(block);

    const button =
      getElement(
        service + "PrivateOpenBtn"
      );

    if(button){
      button.onclick = function(){

        requirePrivateAccess(function(){

          openPrivateService(service);
        });
      };
    }
  }

  function restoreHiddenFields(){

    const modal = getModalContent();

    if(!modal){
      return;
    }

    modal
      .querySelectorAll(
        ".box, form, fieldset"
      )
      .forEach(function(container){

        if(
          container.style.display ===
          "none"
        ){
          container.style.display = "";
        }
      });
  }

  function removePrivateAccessBlocks(){

    [
      "perennitePrivateAccessBlock"
    ].forEach(function(id){

      const block = getElement(id);

      if(block){
        block.remove();
      }
    });
  }

  function openPrivateService(service){

  const original =
  module.__originalPerenniteScreen;
     
    if(
      typeof original !==
      "function"
    ){
      alert(
        "Cet espace privé est momentanément indisponible."
      );
      return;
    }

    original();

    window.setTimeout(function(){

      restoreHiddenFields();
      removePrivateAccessBlocks();

      const modal = getModalContent();

      if(!modal){
        return;
      }

      if(
        getElement(
          service + "PrivateStatus"
        )
      ){
        return;
      }

      const status =
        document.createElement("div");

      status.id =
        service + "PrivateStatus";

      status.className = "box";
      status.style.borderLeft =
        "6px solid #2f5d46";
      status.style.marginBottom =
        "12px";

      status.innerHTML = `
        <strong>
          Espace professionnel privé
        </strong>

        <br><br>

        Les informations saisies dans cette page
        sont réservées à l’entreprise ou au commerce connecté.
      `;

      modal.insertBefore(
        status,
        modal.firstChild
      );

    },50);
  }

  const originalPerennite =
    module.screens.perennite;

  module.__originalPerenniteScreen =
    originalPerennite;

  if(
    typeof originalPerennite ===
    "function"
  ){
    module.registerScreen(
      "perennite",
      function(){

        originalPerennite();

        window.setTimeout(function(){

          replacePublicFormsByPrivateAccess(
            "perennite"
          );

        },60);
      }
    );
  }

  module.openPrivatePerennite =
    function(){

      requirePrivateAccess(function(){
        openPrivateService("perennite");
      });
    };

  console.log(
    "✅ Pérennité séparée entre information publique et espace privé"
  );

})();

/* =========================================================
   BO'CITÉART — RECHERCHE PROFESSIONNELLE
   CONSULTATION PUBLIQUE + RECHERCHES ENREGISTRÉES PRIVÉES
   ========================================================= */

(function separateProfessionalSearchAccess(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const SEARCH_STORE_KEY =
    "bociteart_professional_saved_searches_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function requirePrivateAccess(callback){

    if(
      typeof module.requirePrivateAccess ===
      "function"
    ){
      module.requirePrivateAccess(callback);
      return;
    }

    if(
      typeof module.requirePartnerAccess ===
      "function"
    ){
      module.requirePartnerAccess(callback);
      return;
    }

    alert(
      "L’accès professionnel privé est momentanément indisponible."
    );
  }

  function loadSavedSearches(){

    try{
      const raw =
        localStorage.getItem(SEARCH_STORE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed)
        ? parsed
        : [];

    }catch(error){

      return [];
    }
  }

  function saveSavedSearches(list){

    try{
      localStorage.setItem(
        SEARCH_STORE_KEY,
        JSON.stringify(list || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement des recherches impossible :",
        error
      );
    }
  }

  function getPublicSearchHtml(){

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Recherche professionnelle
        </strong>

        <br><br>

        Recherchez une entreprise,
        un artisan,
        un fournisseur,
        un sous-traitant,
        un partenaire
        ou une compétence.
      </div>

      <label style="display:block;font-weight:900;">
        Que recherchez-vous ?
      </label>

      <input
        id="professionalPublicSearchNeed"
        class="miniField"
        type="text"
        placeholder="Exemple : carreleur, comptable, fournisseur">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Zone de recherche
      </label>

      <select
        id="professionalPublicSearchZone"
        class="miniField">

        <option value="commune">
          Ma commune
        </option>

        <option value="proximite">
          Communes proches
        </option>

        <option value="departement">
          Département
        </option>

        <option value="region">
          Région
        </option>

        <option value="france">
          France
        </option>
      </select>

      <button
        id="professionalPublicSearchBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Rechercher
      </button>

      <div
        id="professionalPublicSearchResults"
        style="margin-top:12px;">
      </div>

      <div
        class="box"
        style="margin-top:14px;">

        <strong>
          Vous êtes une entreprise ou un commerce ?
        </strong>

        <br><br>

        L’enregistrement d’une recherche,
        son suivi,
        les alertes
        et l’historique
        sont réservés à l’espace professionnel privé.
      </div>

      <button
        id="professionalPrivateSearchBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;">
        Enregistrer et suivre ma recherche
      </button>

      <button
        id="professionalSavedSearchesBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Consulter mes recherches enregistrées
      </button>
    `;
  }

  function renderPublicSearchResults(){

    const need =
      String(
        getElement("professionalPublicSearchNeed")
          ? getElement("professionalPublicSearchNeed").value
          : ""
      ).trim();

    const zone =
      String(
        getElement("professionalPublicSearchZone")
          ? getElement("professionalPublicSearchZone").value
          : ""
      ).trim();

    const host =
      getElement(
        "professionalPublicSearchResults"
      );

    if(!need){
      alert(
        "Indiquez ce que vous recherchez."
      );
      return;
    }

    if(!host){
      return;
    }

    host.innerHTML = `
      <div class="box">
        <strong>
          Première recherche
        </strong>

        <br><br>

        Bo'CitéArt recherchera en priorité :

        <br><br>

        <strong>
          ${escapeValue(need)}
        </strong>

        <br><br>

        Zone sélectionnée :
        ${escapeValue(
          getZoneLabel(zone)
        )}

        <br><br>

        Dans la version définitive,
        les résultats disponibles
        seront affichés ici.
      </div>
    `;
  }

  function getZoneLabel(value){

    const labels = {
      commune:"Ma commune",
      proximite:"Communes proches",
      departement:"Département",
      region:"Région",
      france:"France"
    };

    return labels[value] || value;
  }

  function openPrivateSearchForm(){

    module.renderModal(
      "Enregistrer une recherche professionnelle",
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong>
            Espace professionnel privé
          </strong>

          <br><br>

          Votre recherche sera enregistrée
          dans votre espace entreprise ou commerce.
        </div>

        <label style="display:block;font-weight:900;">
          Objet de la recherche
        </label>

        <input
          id="privateSearchNeed"
          class="miniField"
          type="text"
          placeholder="Exemple : fournisseur, sous-traitant, partenaire">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Précisions
        </label>

        <textarea
          id="privateSearchDescription"
          class="miniField"
          style="min-height:110px;"
          placeholder="Décrivez précisément votre besoin.">
        </textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Zone de recherche
        </label>

        <select
          id="privateSearchZone"
          class="miniField">

          <option value="commune">
            Ma commune
          </option>

          <option value="proximite">
            Communes proches
          </option>

          <option value="departement">
            Département
          </option>

          <option value="region">
            Région
          </option>

          <option value="france">
            France
          </option>

          <option value="europe">
            Europe
          </option>
        </select>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Date souhaitée
        </label>

        <input
          id="privateSearchDeadline"
          class="miniField"
          type="date">

        <button
          id="privateSearchSaveBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:14px;">
          Enregistrer ma recherche
        </button>
      `
    );

    window.setTimeout(function(){

      const saveButton =
        getElement("privateSearchSaveBtn");

      if(saveButton){
        saveButton.onclick =
          savePrivateSearch;
      }

    },0);
  }

  function savePrivateSearch(){

    const need =
      String(
        getElement("privateSearchNeed")
          ? getElement("privateSearchNeed").value
          : ""
      ).trim();

    const description =
      String(
        getElement("privateSearchDescription")
          ? getElement("privateSearchDescription").value
          : ""
      ).trim();

    const zone =
      String(
        getElement("privateSearchZone")
          ? getElement("privateSearchZone").value
          : ""
      ).trim();

    const deadline =
      String(
        getElement("privateSearchDeadline")
          ? getElement("privateSearchDeadline").value
          : ""
      ).trim();

    if(!need || !description){
      alert(
        "Renseignez votre recherche et ses précisions."
      );
      return;
    }

    const list =
      loadSavedSearches();

    list.push({
      id:
        "RECH-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2,7),

      need:need,
      description:description,
      zone:zone,
      deadline:deadline,
      status:"en_cours",
      createdAt:Date.now(),
      createdAtFr:
        new Date().toLocaleString("fr-FR")
    });

    saveSavedSearches(list);

    alert(
      "Votre recherche professionnelle a été enregistrée."
    );

    openSavedSearches();
  }

  function openSavedSearches(){

    requirePrivateAccess(function(){

      const list =
        loadSavedSearches()
          .slice()
          .sort(function(a,b){
            return Number(b.createdAt) -
              Number(a.createdAt);
          });

      module.renderModal(
        "Mes recherches professionnelles",
        `
          <div
            class="box"
            style="border-left:6px solid #2f5d46;">

            <strong>
              Espace professionnel privé
            </strong>

            <br><br>

            Retrouvez ici vos recherches,
            leur état et leur historique.
          </div>

          ${
            list.length
              ? list.map(function(item){

                  return `
                    <div class="box">

                      <strong style="font-size:17px;">
                        ${escapeValue(item.need)}
                      </strong>

                      <br><br>

                      ${escapeValue(item.description)}

                      <br><br>

                      Zone :
                      ${escapeValue(
                        getZoneLabel(item.zone)
                      )}

                      ${
                        item.deadline
                          ? `
                            <br><br>

                            Date souhaitée :
                            ${escapeValue(item.deadline)}
                          `
                          : ""
                      }

                      <br><br>

                      Statut :
                      <strong>
                        ${escapeValue(
                          item.status === "terminee"
                            ? "Terminée"
                            : "En cours"
                        )}
                      </strong>

                      <br><br>

                      Enregistrée le :
                      ${escapeValue(item.createdAtFr)}

                      ${
                        item.status !== "terminee"
                          ? `
                            <button
                              class="choiceBtn savedSearchCloseBtn"
                              type="button"
                              data-search-id="${escapeValue(item.id)}"
                              style="
                                width:100%;
                                margin-top:12px;
                              ">
                              Marquer cette recherche comme terminée
                            </button>
                          `
                          : ""
                      }
                    </div>
                  `;
                }).join("")
              : `
                <div class="box">
                  Aucune recherche professionnelle enregistrée.
                </div>
              `
          }
        `
      );

      window.setTimeout(function(){

        document
          .querySelectorAll(
            ".savedSearchCloseBtn"
          )
          .forEach(function(button){

            button.onclick = function(){

              closeSavedSearch(
                button.getAttribute(
                  "data-search-id"
                )
              );
            };
          });

      },0);
    });
  }

  function closeSavedSearch(searchId){

    const list =
      loadSavedSearches();

    const search =
      list.find(function(item){
        return item.id === searchId;
      });

    if(!search){
      alert(
        "Cette recherche est introuvable."
      );
      return;
    }

    search.status =
      "terminee";

    search.closedAt =
      Date.now();

    saveSavedSearches(list);

    openSavedSearches();
  }

  function bindPublicSearch(){

    const searchButton =
      getElement(
        "professionalPublicSearchBtn"
      );

    const privateButton =
      getElement(
        "professionalPrivateSearchBtn"
      );

    const savedButton =
      getElement(
        "professionalSavedSearchesBtn"
      );

    if(searchButton){
      searchButton.onclick =
        renderPublicSearchResults;
    }

    if(privateButton){
      privateButton.onclick = function(){

        requirePrivateAccess(
          openPrivateSearchForm
        );
      };
    }

    if(savedButton){
      savedButton.onclick =
        openSavedSearches;
    }
  }

  function openProfessionalSearch(){

    module.renderModal(
      "Recherche professionnelle",
      getPublicSearchHtml()
    );

    window.setTimeout(function(){
      bindPublicSearch();
    },0);
  }

  module.registerScreen(
    "annuaire",
    openProfessionalSearch
  );

  module.openProfessionalSearch =
    openProfessionalSearch;

  module.openPrivateProfessionalSearch =
    function(){

      requirePrivateAccess(
        openPrivateSearchForm
      );
    };

  module.openSavedProfessionalSearches =
    openSavedSearches;

  console.log(
    "✅ Recherche professionnelle publique et suivi privé chargés"
  );

})();

/* ===========================================
   BO'CITÉART — NETTOYAGE GLOBAL DÉSACTIVÉ
   =========================================== */

(function disableDangerousGlobalCleanup(){

  "use strict";

  console.log(
    "✅ Nettoyage global dangereux désactivé"
  );

})();
/* =========================================================
   BO'CITÉART — FACTURATION PROFESSIONNELLE
   PAIEMENT CONFIRMÉ • FACTURE • ARCHIVAGE • ENVOI SERVEUR
   ========================================================= */

(function initBociteProfessionalInvoiceSystem(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt : module Entreprise introuvable."
    );
    return;
  }

  const INVOICE_KEY =
    "bociteart_entreprise_search_invoices_v1";

  const PARTNER_ACCOUNT_KEY =
    "bociteart_entreprise_partner_account_v1";

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function formatMoney(value){
    return Number(value || 0)
      .toFixed(2)
      .replace(".", ",");
  }

  function loadInvoices(){
    try{
      const raw =
        localStorage.getItem(INVOICE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed)
        ? parsed
        : [];
    }catch(error){
      return [];
    }
  }

  function saveInvoices(invoices){
    try{
      localStorage.setItem(
        INVOICE_KEY,
        JSON.stringify(invoices || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement des factures impossible :",
        error
      );
    }
  }

  function loadPartnerAccount(){
    try{
      const raw =
        localStorage.getItem(
          PARTNER_ACCOUNT_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : null;

      return parsed &&
        typeof parsed === "object"
          ? parsed
          : {};
    }catch(error){
      return {};
    }
  }

  function getLogoUrl(){
    const selectors = [
      "#bociteartLogo img",
      ".bociteartLogo img",
      ".appLogo img",
      ".logo img",
      "header img",
      "img[alt*=\"Bo'CitéArt\"]",
      "img[alt*=\"Bo’CitéArt\"]",
      "img[alt*=\"Bociteart\"]"
    ];

    for(const selector of selectors){
      const image =
        document.querySelector(selector);

      if(image && image.src){
        return image.src;
      }
    }

    return "";
  }

  function createInvoiceNumber(){
    const date = new Date();

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    const random =
      Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase();

    return (
      "BCA-" +
      year +
      month +
      day +
      "-" +
      random
    );
  }

  function getInvoiceFooterHtml(){
    return `
      <div class="invoiceFooter">
        <strong>Bo'CitéArt</strong><br>
        Plateforme de dynamisation économique,
        citoyenne et territoriale.<br><br>

        Document établi électroniquement.<br>
        La facture doit être conservée par l’entreprise
        conformément à ses obligations comptables.<br><br>

        Les mentions juridiques définitives,
        l’adresse du siège,
        le numéro SIREN,
        le numéro de TVA
        et les coordonnées bancaires seront repris
        automatiquement depuis les paramètres officiels
        de Bo'CitéArt.
      </div>
    `;
  }

  function getInvoiceHtml(invoice){
    const account =
      loadPartnerAccount();

    const logoUrl =
      getLogoUrl();

    const customerName =
      invoice.customerName ||
      account.companyName ||
      "Entreprise cliente";

    const customerEmail =
      invoice.customerEmail ||
      account.email ||
      "";

    const customerAddress =
      invoice.customerAddress ||
      account.address ||
      "";

    const customerId =
      invoice.customerId ||
      account.siret ||
      account.siren ||
      "";

    const paymentReference =
      invoice.paymentReference ||
      "Non renseignée";

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Facture ${escapeValue(invoice.number || "")}</title>

<style>
  *{
    box-sizing:border-box;
  }

  body{
    margin:0;
    padding:28px;
    font-family:Arial,Helvetica,sans-serif;
    color:#111;
    background:#fff;
    line-height:1.45;
  }

  .invoice{
    width:100%;
    max-width:850px;
    margin:0 auto;
  }

  .invoiceHeader{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:24px;
    padding-bottom:20px;
    border-bottom:3px solid #2f5d46;
  }

  .invoiceLogo{
    max-width:210px;
    max-height:90px;
    object-fit:contain;
  }

  .textLogo{
    font-size:31px;
    font-weight:900;
    color:#2f5d46;
  }

  .textLogo span{
    color:#b00020;
    font-style:italic;
  }

  .invoiceTitle{
    text-align:right;
  }

  .invoiceTitle h1{
    margin:0 0 8px;
    font-size:30px;
    color:#2f5d46;
  }

  .paidBadge{
    display:inline-block;
    margin-top:10px;
    padding:7px 14px;
    border:2px solid #2f5d46;
    border-radius:999px;
    color:#2f5d46;
    font-weight:900;
  }

  .columns{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:22px;
    margin-top:24px;
  }

  .card{
    padding:16px;
    border:1px solid #bbb;
    border-radius:10px;
  }

  .card h2{
    margin:0 0 12px;
    font-size:17px;
    color:#2f5d46;
  }

  table{
    width:100%;
    margin-top:24px;
    border-collapse:collapse;
  }

  th,
  td{
    padding:12px;
    border:1px solid #aaa;
    text-align:left;
    vertical-align:top;
  }

  th{
    background:#f3eee5;
  }

  .money{
    text-align:right;
    white-space:nowrap;
  }

  .totals{
    width:360px;
    max-width:100%;
    margin:18px 0 0 auto;
  }

  .totals div{
    display:flex;
    justify-content:space-between;
    gap:20px;
    padding:8px 0;
  }

  .totalTTC{
    padding-top:12px !important;
    border-top:3px solid #2f5d46;
    font-size:20px;
    font-weight:900;
  }

  .paymentBox{
    margin-top:24px;
    padding:16px;
    border-left:6px solid #2f5d46;
    background:#f8f5ef;
  }

  .invoiceFooter{
    margin-top:35px;
    padding-top:18px;
    border-top:2px solid #2f5d46;
    text-align:center;
    font-size:12px;
    color:#444;
  }

  .printActions{
    display:flex;
    gap:10px;
    margin:24px 0;
  }

  .printActions button{
    padding:11px 16px;
    border:0;
    border-radius:8px;
    background:#2f5d46;
    color:#fff;
    font-weight:900;
    cursor:pointer;
  }

  @media print{
    body{
      padding:0;
    }

    .printActions{
      display:none;
    }
  }

  @media(max-width:650px){
    .invoiceHeader,
    .columns{
      display:block;
    }

    .invoiceTitle{
      margin-top:20px;
      text-align:left;
    }

    .card{
      margin-top:12px;
    }
  }
</style>
</head>

<body>

<div class="invoice">

  <div class="printActions">
    <button onclick="window.print()">
      Imprimer ou enregistrer en PDF
    </button>
  </div>

  <div class="invoiceHeader">

    <div>
      ${
        logoUrl
          ? `
            <img
              class="invoiceLogo"
              src="${escapeValue(logoUrl)}"
              alt="Bo'CitéArt">
          `
          : `
            <div class="textLogo">
              Bo'Cité<span>Art</span>
            </div>
          `
      }
    </div>

    <div class="invoiceTitle">
      <h1>FACTURE</h1>

      <strong>
        ${escapeValue(invoice.number || "")}
      </strong>

      <br>

      Date :
      ${escapeValue(
        invoice.createdAtFr ||
        new Date().toLocaleString("fr-FR")
      )}

      <br>

      <span class="paidBadge">
        PAYÉE
      </span>
    </div>
  </div>

  <div class="columns">

    <div class="card">
      <h2>Émetteur</h2>

      <strong>Bo'CitéArt</strong><br>
      Les coordonnées officielles seront reprises
      depuis les paramètres administratifs
      de la structure porteuse.
    </div>

    <div class="card">
      <h2>Client</h2>

      <strong>
        ${escapeValue(customerName)}
      </strong>

      ${
        customerId
          ? `
            <br>SIREN / SIRET :
            ${escapeValue(customerId)}
          `
          : ""
      }

      ${
        customerAddress
          ? `
            <br>${escapeValue(customerAddress)}
          `
          : ""
      }

      ${
        customerEmail
          ? `
            <br>${escapeValue(customerEmail)}
          `
          : ""
      }
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Service</th>
        <th>Période</th>
        <th class="money">Montant HT</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          ${escapeValue(
            invoice.planLabel ||
            invoice.serviceLabel ||
            "Service professionnel Bo'CitéArt"
          )}
        </td>

        <td>
          ${
            invoice.billingMode === "annuel"
              ? "Abonnement annuel"
              : invoice.billingMode === "mensuel"
                ? "Abonnement mensuel"
                : escapeValue(
                    invoice.billingMode ||
                    "Paiement ponctuel"
                  )
          }
        </td>

        <td class="money">
          ${formatMoney(invoice.amountHT)} €
        </td>
      </tr>
    </tbody>
  </table>

  <div class="totals">

    <div>
      <span>Total HT</span>

      <strong>
        ${formatMoney(invoice.amountHT)} €
      </strong>
    </div>

    <div>
      <span>TVA</span>

      <strong>
        ${formatMoney(invoice.amountVAT)} €
      </strong>
    </div>

    <div class="totalTTC">
      <span>Total TTC</span>

      <span>
        ${formatMoney(invoice.amountTTC)} €
      </span>
    </div>
  </div>

  <div class="paymentBox">
    <strong>Paiement confirmé</strong>

    <br><br>

    Mode de paiement :
    ${escapeValue(
      invoice.paymentMethod ||
      "Paiement électronique"
    )}

    <br>

    Référence :
    ${escapeValue(paymentReference)}

    <br>

    Date de confirmation :
    ${escapeValue(
      invoice.paidAtFr ||
      invoice.createdAtFr ||
      new Date().toLocaleString("fr-FR")
    )}
  </div>

  ${getInvoiceFooterHtml()}

</div>

</body>
</html>
    `;
  }

  function openInvoice(invoiceId){
    const invoice =
      loadInvoices().find(function(item){
        return item.id === invoiceId;
      });

    if(!invoice){
      alert(
        "Cette facture est introuvable."
      );
      return;
    }

    const html =
      getInvoiceHtml(invoice);

    const invoiceWindow =
      window.open("", "_blank");

    if(!invoiceWindow){
      alert(
        "Le navigateur a bloqué l’ouverture de la facture."
      );
      return;
    }

    invoiceWindow.document.open();
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  }

  function createPaidInvoice(paymentData){
    paymentData = paymentData || {};

    const account =
      loadPartnerAccount();

    const amountHT =
      Number(paymentData.amountHT || 0);

    const vatRate =
      Number(
        paymentData.vatRate == null
          ? 20
          : paymentData.vatRate
      );

    const amountVAT =
      Number(
        paymentData.amountVAT != null
          ? paymentData.amountVAT
          : amountHT * vatRate / 100
      );

    const amountTTC =
      Number(
        paymentData.amountTTC != null
          ? paymentData.amountTTC
          : amountHT + amountVAT
      );

    const now =
      new Date();

    const invoice = {
      id:
        "INV-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2, 7),

      number:
        paymentData.number ||
        createInvoiceNumber(),

      customerName:
        paymentData.customerName ||
        account.companyName ||
        "",

      customerEmail:
        paymentData.customerEmail ||
        account.email ||
        "",

      customerAddress:
        paymentData.customerAddress ||
        account.address ||
        "",

      customerId:
        paymentData.customerId ||
        account.siret ||
        account.siren ||
        "",

      plan:
        paymentData.plan || "",

      planLabel:
        paymentData.planLabel ||
        paymentData.serviceLabel ||
        "Service professionnel Bo'CitéArt",

      billingMode:
        paymentData.billingMode ||
        "ponctuel",

      amountHT:amountHT,
      amountVAT:amountVAT,
      amountTTC:amountTTC,

      vatRate:vatRate,

      status:"paid",

      paymentMethod:
        paymentData.paymentMethod ||
        "Paiement électronique",

      paymentReference:
        paymentData.paymentReference ||
        "",

      createdAt:now.getTime(),
      createdAtFr:
        now.toLocaleString("fr-FR"),

      paidAt:now.getTime(),
      paidAtFr:
        now.toLocaleString("fr-FR"),

      emailDeliveryStatus:
        "a_envoyer"
    };

    const invoices =
      loadInvoices();

    invoices.unshift(invoice);

    saveInvoices(invoices);

    /*
      Ce signal permettra au serveur de production
      d’envoyer automatiquement la facture par e-mail.
    */
    window.dispatchEvent(
      new CustomEvent(
        "bociteart:invoice-ready",
        {
          detail:{
            invoice:invoice,
            recipient:
              invoice.customerEmail
          }
        }
      )
    );

    return invoice;
  }

  /*
    Cette fonction devra être appelée uniquement
    par le retour sécurisé du prestataire de paiement.
  */
  module.confirmPaidSubscription =
    function(paymentData){

      const invoice =
        createPaidInvoice(paymentData);

      alert(
        "Paiement confirmé.\n\n" +
        "L’abonnement est activé et la facture a été créée."
      );

      openInvoice(invoice.id);

      return invoice;
    };

  module.openProfessionalInvoice =
    openInvoice;

  module.createPaidInvoice =
    createPaidInvoice;

  /*
    Intercepte les anciens boutons afin
    de ne plus télécharger la facture texte.
  */
  document.addEventListener(
    "click",
    function(event){

      const button =
        event.target &&
        typeof event.target.closest === "function"
          ? event.target.closest(
              ".invoiceRetentionDownloadBtn"
            )
          : null;

      if(!button){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation ===
        "function"
      ){
        event.stopImmediatePropagation();
      }

      openInvoice(
        button.getAttribute(
          "data-invoice-id"
        )
      );
    },
    true
  );

  console.log(
    "✅ Facturation professionnelle Bo'CitéArt chargée"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 04
   LISTE LOCALE DES ENTREPRISES
   ET CANDIDATURES SPONTANÉES
   ========================================================== */

(function addEntrepriseLocalDirectoryAndSpontaneousCv(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  const SPONTANEOUS_STORE_KEY =
    "bociteart_entreprise_spontaneous_cv_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return app.safeEscape(value);
  }

  function normalizeText(value){
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function loadCompanies(){

    if(
      typeof app.loadDirectory ===
      "function"
    ){
      const companies =
        app.loadDirectory();

      if(Array.isArray(companies)){
        return companies;
      }
    }

    return [];
  }

  function loadSpontaneousApplications(){

    try{
      const raw =
        localStorage.getItem(
          SPONTANEOUS_STORE_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed)
        ? parsed
        : [];

    }catch(error){

      console.warn(
        "Lecture des candidatures spontanées impossible :",
        error
      );

      return [];
    }
  }

  function saveSpontaneousApplications(list){

    try{
      localStorage.setItem(
        SPONTANEOUS_STORE_KEY,
        JSON.stringify(list || [])
      );

    }catch(error){

      console.warn(
        "Enregistrement de la candidature impossible :",
        error
      );
    }
  }

  function openLocalDirectory(){

    app.renderModal(
      "Entreprises et commerces de votre ville",
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            Découvrez les entreprises
            et les commerces de votre ville
          </strong>

          <br><br>

          Avant de chercher ailleurs,
          les citoyens et les professionnels
          doivent pouvoir connaître
          ce qui existe déjà près de chez eux.

          <br><br>

          Cette liste permet de retrouver
          les métiers,
          les activités,
          les savoir-faire
          et les services présents localement.
        </div>

        <div class="box">

          <strong>
            Rechercher une entreprise,
            un commerce ou un métier
          </strong>

          <br><br>

          <input
            id="localDirectorySearchInput"
            class="miniField"
            type="search"
            placeholder="Exemple : électricien, comptable, menuisier">
        </div>

        <div
          id="localDirectoryResultCount"
          class="muted"
          style="margin-top:10px;">
        </div>

        <div
          id="localDirectoryResultList"
          style="margin-top:10px;">
        </div>

        <div
          class="box"
          style="
            margin-top:14px;
            border-left:6px solid #2f5d46;
          ">

          <strong>
            Favoriser les échanges entre professionnels locaux
          </strong>

          <br><br>

          Chaque entreprise ou commerce
          pourra choisir librement
          de proposer un avantage partenaire :

          <br><br>

          • 5 % ;<br>
          • 10 % ;<br>
          • ou un avantage personnalisé.

          <br><br>

          Cet avantage restera facultatif.

          <br><br>

          Pour être réellement utile,
          il devra être plus favorable
          que les conditions habituellement proposées
          aux clients.
        </div>

        <div
          class="box"
          style="
            margin-top:14px;
            border-left:6px solid #2f5d46;
          ">

          <strong>
            Vous pourriez être intéressé
            par d’autres services.
          </strong>

          <br><br>

          Cliquez sur l’une des propositions
          dans les bandes défilantes
          de l’espace Entreprise.
        </div>
      `
    );

    window.setTimeout(function(){

      const input =
        getElement(
          "localDirectorySearchInput"
        );

      if(input){
        input.oninput =
          renderLocalDirectory;
      }

      renderLocalDirectory();

    },0);
  }

   function renderLocalDirectory(){

  const host =
    getElement(
      "localDirectoryResultList"
    );

  const count =
    getElement(
      "localDirectoryResultCount"
    );

  if(!host){
    return;
  }

  if(count){
    count.textContent =
      "L’annuaire sera disponible après son raccordement officiel.";
  }

  host.innerHTML = `
    <div
      class="box"
      style="
        border-left:6px solid #2f5d46;
        color:#111;
        font-size:14px;
        line-height:1.55;
        font-weight:400;
      ">

      <strong
        style="
          display:block;
          color:#2f5d46;
          font-size:16px;
          font-weight:700;
        ">
        Annuaire officiel de la commune
      </strong>

      <br>

      L’annuaire économique

      <strong>
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
      </strong>

      sera alimenté lors de son raccordement
      aux données publiques officielles.

      <br><br>

      Aucune entreprise fictive
      n’est affichée dans cet annuaire.

    </div>
  `;
}

function saveSpontaneousApplication(company){

  const name =
    String(
      getElement("spontaneousCvName")
        ? getElement("spontaneousCvName").value
        : ""
    ).trim();

  const email =
    String(
      getElement("spontaneousCvEmail")
        ? getElement("spontaneousCvEmail").value
        : ""
    ).trim();

  const phone =
    String(
      getElement("spontaneousCvPhone")
        ? getElement("spontaneousCvPhone").value
        : ""
    ).trim();

  const job =
    String(
      getElement("spontaneousCvJob")
        ? getElement("spontaneousCvJob").value
        : ""
    ).trim();

  const message =
    String(
      getElement("spontaneousCvMessage")
        ? getElement("spontaneousCvMessage").value
        : ""
    ).trim();

  const fileInput =
    getElement(
      "spontaneousCvFile"
    );

  const consent =
    getElement(
      "spontaneousCvConsent"
    );

  if(
    !name ||
    !email ||
    !phone ||
    !job ||
    !message
  ){

    alert(
      "Veuillez remplir toutes les informations."
    );

    return;
  }

  if(!email.includes("@")){

    alert(
      "Veuillez renseigner une adresse e-mail valide."
    );

    return;
  }

  if(
    !fileInput ||
    !fileInput.files ||
    !fileInput.files.length
  ){

    alert(
      "Veuillez sélectionner votre CV."
    );

    return;
  }

  if(
    !consent ||
    !consent.checked
  ){

    alert(
      "Vous devez accepter la conservation de votre candidature."
    );

    return;
  }

  const applications =
    loadSpontaneousApplications();

  applications.unshift({

    id:
      "CANDIDATURE-SPONTANEE-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,7),

    companyId:company.id,

    companyName:
      company.name,

    candidateName:name,

    candidateEmail:email,

    candidatePhone:phone,

    requestedJob:job,

    message:message,

    cvName:
      fileInput.files[0].name,

    status:"recue",

    createdAt:
      Date.now(),

    createdAtFr:
      new Date()
        .toLocaleString(
          "fr-FR"
        )
  });

  saveSpontaneousApplications(
    applications
  );

  alert(
    "Votre candidature spontanée a été enregistrée."
  );

  openLocalDirectory();
}

/*
  L’ancien annuaire reste disponible,
  mais il ne remplace plus l’Observatoire économique.
*/

app.openCorrectedDirectory =
  openLocalDirectory;

app.openLocalDirectory =
  openLocalDirectory;

  /*
  L’ancienne fonction de candidature spontanée
  n’est plus utilisée dans cette version.
*/ 

app.loadSpontaneousApplications =
  loadSpontaneousApplications;

console.log(
  "✅ Liste locale et candidatures spontanées chargées"
);

})();
/* ==========================================================
   BO'CITÉART
   CORRECTIF 05
   HISTORIQUE DES CANDIDATURES
   DANS LE TABLEAU DE DIRECTION
   ========================================================== */

(function addCandidateHistoryToDirection(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  const EMPLOYMENT_STORE_KEY =
    "bociteart_entreprise_employment_v1";

  const SPONTANEOUS_STORE_KEY =
    "bociteart_entreprise_spontaneous_cv_v1";

  function escapeValue(value){
    return app.safeEscape(value);
  }

  function loadJson(key, fallback){

    try{

      const raw =
        localStorage.getItem(key);

      const parsed =
        raw ? JSON.parse(raw) : null;

      return parsed == null
        ? fallback
        : parsed;

    }catch(error){

      console.warn(
        "Lecture des candidatures impossible :",
        error
      );

      return fallback;
    }
  }

  function loadEmploymentApplications(){

    const data =
      loadJson(
        EMPLOYMENT_STORE_KEY,
        {
          offers:[],
          applications:[]
        }
      );

    return Array.isArray(
      data.applications
    )
      ? data.applications
      : [];
  }

  function loadSpontaneousApplications(){

    const list =
      loadJson(
        SPONTANEOUS_STORE_KEY,
        []
      );

    return Array.isArray(list)
      ? list
      : [];
  }

  function getCandidateHistoryButtonHtml(){

    const offerApplications =
      loadEmploymentApplications();

    const spontaneousApplications =
      loadSpontaneousApplications();

    const total =
      offerApplications.length +
      spontaneousApplications.length;

    return `
      <div
        class="box"
        style="
          margin-top:16px;
          border-left:6px solid #2f5d46;
        ">

        <strong style="font-size:17px;">
          Historique des candidatures
        </strong>

        <br><br>

        Toutes les candidatures restent disponibles
        dans votre espace privé.

        <br><br>

        Vous pouvez retrouver un candidat
        plusieurs mois plus tard
        lorsqu’un nouveau besoin apparaît.

        <br><br>

        Votre carnet de candidats
        se construit progressivement.

        <br><br>

        Candidatures reçues :

        <strong>
          ${total}
        </strong>

        <br><br>

        • réponses à une offre :
        <strong>
          ${offerApplications.length}
        </strong>

        <br>

        • candidatures spontanées :
        <strong>
          ${spontaneousApplications.length}
        </strong>

        <button
          id="directionCandidateHistoryBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Consulter l’historique des candidatures
        </button>
      </div>
    `;
  }

  function openCandidateHistory(){

    const offerApplications =
      loadEmploymentApplications()
        .slice()
        .sort(function(a,b){

          return Number(
            b.createdAt || 0
          ) -
          Number(
            a.createdAt || 0
          );
        });

    const spontaneousApplications =
      loadSpontaneousApplications()
        .slice()
        .sort(function(a,b){

          return Number(
            b.createdAt || 0
          ) -
          Number(
            a.createdAt || 0
          );
        });

    app.renderModal(
      "Historique des candidatures",
      `
        <div
          class="box"
          style="border-left:6px solid #b00020;">

          <strong style="font-size:18px;">
            Espace privé de l’entreprise
          </strong>

          <br><br>

          Cet historique n’est pas visible
          par les citoyens
          ni par les autres entreprises.

          <br><br>

          Il permet de retrouver
          les candidatures reçues
          lorsqu’un nouveau besoin apparaît.
        </div>

        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong>
            Candidatures liées à une offre
          </strong>

          <br><br>

          Nombre reçu :

          <strong>
            ${offerApplications.length}
          </strong>
        </div>

        ${
          offerApplications.length
            ? offerApplications.map(function(application){

                return `
                  <div class="box">

                    <strong style="font-size:16px;">
                      ${escapeValue(
                        application.candidateName ||
                        "Candidat"
                      )}
                    </strong>

                    <br><br>

                    Offre :

                    <strong>
                      ${escapeValue(
                        application.offerTitle ||
                        "Non renseignée"
                      )}
                    </strong>

                    <br><br>

                    Entreprise :

                    ${escapeValue(
                      application.companyName ||
                      ""
                    )}

                    <br><br>

                    E-mail :

                    ${escapeValue(
                      application.candidateEmail ||
                      ""
                    )}

                    <br>

                    Téléphone :

                    ${escapeValue(
                      application.candidatePhone ||
                      ""
                    )}

                    <br><br>

                    CV :

                    ${escapeValue(
                      application.cvName ||
                      "Non renseigné"
                    )}

                    <br><br>

                    Message :

                    ${escapeValue(
                      application.message ||
                      ""
                    )}

                    <br><br>

                    Reçue le :

                    ${escapeValue(
                      application.createdAtFr ||
                      ""
                    )}
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucune candidature liée
                à une offre n’est enregistrée.
              </div>
            `
        }

        <div
          class="box"
          style="
            margin-top:16px;
            border-left:6px solid #2f5d46;
          ">

          <strong>
            Candidatures spontanées
          </strong>

          <br><br>

          Nombre reçu :

          <strong>
            ${spontaneousApplications.length}
          </strong>
        </div>

        ${
          spontaneousApplications.length
            ? spontaneousApplications.map(function(application){

                return `
                  <div class="box">

                    <strong style="font-size:16px;">
                      ${escapeValue(
                        application.candidateName ||
                        "Candidat"
                      )}
                    </strong>

                    <br><br>

                    Entreprise destinataire :

                    <strong>
                      ${escapeValue(
                        application.companyName ||
                        ""
                      )}
                    </strong>

                    <br><br>

                    Métier ou poste recherché :

                    ${escapeValue(
                      application.requestedJob ||
                      ""
                    )}

                    <br><br>

                    E-mail :

                    ${escapeValue(
                      application.candidateEmail ||
                      ""
                    )}

                    <br>

                    Téléphone :

                    ${escapeValue(
                      application.candidatePhone ||
                      ""
                    )}

                    <br><br>

                    CV :

                    ${escapeValue(
                      application.cvName ||
                      "Non renseigné"
                    )}

                    <br><br>

                    Message :

                    ${escapeValue(
                      application.message ||
                      ""
                    )}

                    <br><br>

                    Reçue le :

                    ${escapeValue(
                      application.createdAtFr ||
                      ""
                    )}
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucune candidature spontanée
                n’est enregistrée.
              </div>
            `
        }

        <button
          id="candidateHistoryReturnDirectionBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Retour au Tableau de Direction
        </button>
      `
    );

    window.setTimeout(function(){

      const returnButton =
        document.getElementById(
          "candidateHistoryReturnDirectionBtn"
        );

      if(returnButton){

        returnButton.onclick = function(){

          app.openScreen(
            "direction"
          );
        };
      }

    },0);
  }

  /*
    Ce correctif ajoute automatiquement
    le bloc Historique lorsque le Tableau
    de Direction est ouvert.

    Il ne remplace pas les autres informations
    déjà présentes dans le Tableau de Direction.
  */

  if(
    !app.__candidateHistoryDirectionPatched
  ){

    app.__candidateHistoryDirectionPatched =
      true;

    const previousRenderModal =
      app.renderModal;

    app.renderModal = function(
      title,
      html
    ){

      let correctedHtml =
        html;

      if(
        String(title || "")
          .toLowerCase()
          .includes(
            "tableau de direction"
          )
      ){

        correctedHtml =
          String(html || "") +
          getCandidateHistoryButtonHtml();
      }

      previousRenderModal.call(
        app,
        title,
        correctedHtml
      );

      if(
        String(title || "")
          .toLowerCase()
          .includes(
            "tableau de direction"
          )
      ){

        window.setTimeout(function(){

          const historyButton =
            document.getElementById(
              "directionCandidateHistoryBtn"
            );

          if(historyButton){

            historyButton.onclick =
              openCandidateHistory;
          }

        },0);
      }
    };
  }

  app.openCandidateHistory =
    openCandidateHistory;

  console.log(
    "✅ Historique des candidatures ajouté au Tableau de Direction"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 06
   RÉPARATION DES CLICS SUR LES BANDES ENTREPRISE
   ========================================================== */

(function repairEntrepriseBandClicks(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  if(
    window.BOCITEART_ENTREPRISE_BAND_CLICKS_FIXED
  ){
    return;
  }

  window.BOCITEART_ENTREPRISE_BAND_CLICKS_FIXED =
    true;

  function openEntrepriseScreen(screenName){

    if(!screenName){
      return;
    }

    /*
      On appelle directement l’écran enregistré.
      Cela évite les anciens correctifs
      qui bloquent actuellement les clics.
    */

    if(
      app.screens &&
      typeof app.screens[screenName] ===
      "function"
    ){
      app.state.previousScreen =
        app.state.currentScreen;

      app.state.currentScreen =
        screenName;

      app.screens[screenName]();

      return;
    }

    if(
      typeof app.openScreen ===
      "function"
    ){
      app.openScreen(screenName);
      return;
    }

    alert(
      "Cette rubrique est momentanément indisponible."
    );
  }

  document.addEventListener(
    "click",
    function(event){

      const button =
        event.target &&
        typeof event.target.closest ===
        "function"
          ? event.target.closest(
              "[data-entreprise-screen]," +
              "[data-corrected-screen]"
            )
          : null;

      if(!button){
        return;
      }

      const screenName =
        button.getAttribute(
          "data-entreprise-screen"
        ) ||
        button.getAttribute(
          "data-corrected-screen"
        );

      if(!screenName){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation ===
        "function"
      ){
        event.stopImmediatePropagation();
      }

      openEntrepriseScreen(
        screenName
      );
    },
    true
  );

  console.log(
    "✅ Clics des bandes Entreprise réparés"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 07
   NETTOYAGE DES ENCARTS
   RETOUR SUR CHAQUE PAGE
   BANDES DÉFILANTES SYNCHRONISÉES
   PROTECTION DES TARIFS DU TABLEAU DE DIRECTION
   ========================================================== */

(function cleanAndSynchronizeEntreprisePages(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  if(
    window.BOCITEART_ENTREPRISE_CLEANUP_07
  ){
    return;
  }

  window.BOCITEART_ENTREPRISE_CLEANUP_07 =
    true;

  const STYLE_ID =
    "bociteartEntrepriseCleanup07Style";

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /[’']/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();
  }

  function getModalContent(){

    return document.querySelector(
      ".modal-content," +
      ".modalContent," +
      "#modalContent"
    );
  }

  function getModalTitle(){

    const titleElement =
      document.querySelector(
        ".modal-title," +
        ".modalTitle," +
        "#modalTitle," +
        ".modalHeader h1," +
        ".modalHeader h2," +
        ".modal-header h1," +
        ".modal-header h2"
      );

    if(titleElement){

      return normalizeText(
        titleElement.textContent
      );
    }

    const modal =
      getModalContent();

    return normalizeText(
      modal
        ? modal.textContent
        : ""
    );
  }

  function installStyles(){

    if(
      document.getElementById(
        STYLE_ID
      )
    ){
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `

      @keyframes bociteEntrepriseUnifiedScroll {

        from {
          transform:translateX(100%);
        }

        to {
          transform:translateX(-100%);
        }
      }

      #entrepriseHomeBands
      .entrepriseBandText,

      .entrepriseUnifiedBandText {

        animation-name:
          bociteEntrepriseUnifiedScroll
          !important;

        animation-duration:
          78s
          !important;

        animation-delay:
          0s
          !important;

        animation-timing-function:
          linear
          !important;

        animation-iteration-count:
          infinite
          !important;

        animation-play-state:
          paused;

        will-change:
          transform;
      }

      .entrepriseUnifiedSuggestions {

        margin-top:18px;
      }

      .entrepriseUnifiedSuggestionsTitle {

        margin-bottom:9px;
        padding:12px;
        border-left:6px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        line-height:1.45;
      }

      .entrepriseUnifiedBands {

        display:flex;
        flex-direction:column;
        gap:7px;
      }

      .entrepriseUnifiedBand {

        display:block;
        position:relative;
        width:100%;
        height:56px;
        margin:0;
        padding:0;
        overflow:hidden;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fffaf1;
        color:#111;
        cursor:pointer;
        appearance:none;
        -webkit-appearance:none;
      }

      .entrepriseUnifiedBandText {

        display:inline-block;
        min-width:100%;
        padding:15px 0;
        white-space:nowrap;
        color:#111;
        font-weight:900;
      }

      .entrepriseUnifiedBandAction {

        color:#b00020;
        font-weight:900;
      }

      #entrepriseUniversalBackButton {

        display:block;
        width:auto;
        margin:0 0 14px 0;
      }

      .entreprisePrivatePricesHidden {

        display:none !important;
      }
      
   /* =====================================================
   BO'CITÉART — TYPOGRAPHIE GLOBALE
   ===================================================== */

.box{
  font-size:14px;
  color:#111;
  font-weight:400;
  line-height:1.55;
}

.box p,
.box div,
.box li,
.box span{
  font-size:14px;
  color:#111;
  font-weight:400;
  line-height:1.55;
}

.box h1,
.box h2,
.box h3,
.box h4{
  color:#2f5d46;
  font-size:16px;
  font-weight:700;
  line-height:1.35;
}

.box ul{
  padding-left:22px;
}

.box li{
  margin-bottom:8px;
}
    `;

    document.head.appendChild(
      style
    );
  }

  function buildSuggestionsHtml(){

    return `
      <div
        id="entrepriseUnifiedSuggestions"
        class="entrepriseUnifiedSuggestions">

        <div
          class="entrepriseUnifiedSuggestionsTitle">

          <strong>
            Vous pourriez également être intéressé.
          </strong>

          <br><br>

          Cliquez dans l’une des propositions
          en bandes défilantes.

        </div>

        <div class="entrepriseUnifiedBands">

          <button
            class="entrepriseUnifiedBand"
            type="button"
            data-unified-entreprise-screen="emploi">

            <span class="entrepriseUnifiedBandText">
              Recherche de personnel • Offres locales • Candidatures •
              <span class="entrepriseUnifiedBandAction">
                Cliquez ici…
              </span>
            </span>

          </button>

          <button
            class="entrepriseUnifiedBand"
            type="button"
            data-unified-entreprise-screen="fidelisation">

            <span class="entrepriseUnifiedBandText">
              Fidélisation • Salariés • Services proches du travail •
              <span class="entrepriseUnifiedBandAction">
                Cliquez ici…
              </span>
            </span>

          </button>

          <button
            class="entrepriseUnifiedBand"
            type="button"
            data-unified-entreprise-screen="developpement">

            <span class="entrepriseUnifiedBandText">
              Développement • Fournisseurs • Partenaires • Sous-traitants •
              <span class="entrepriseUnifiedBandAction">
                Cliquez ici…
              </span>
            </span>

          </button>

          <button
            class="entrepriseUnifiedBand"
            type="button"
            data-unified-entreprise-screen="mutualisation">

            <span class="entrepriseUnifiedBandText">
              Réduisez vos charges • Comparez • Choisissez • Validez •
              <span class="entrepriseUnifiedBandAction">
                Cliquez ici…
              </span>
            </span>

          </button>

          <button
            class="entrepriseUnifiedBand"
            type="button"
            data-unified-entreprise-screen="visibilite">

            <span class="entrepriseUnifiedBandText">
              Visibilité • Métiers • Savoir-faire •
              <span class="entrepriseUnifiedBandAction">
                Cliquez ici…
              </span>
            </span>

          </button>

          <button
            class="entrepriseUnifiedBand"
            type="button"
            data-unified-entreprise-screen="perennite">

            <span class="entrepriseUnifiedBandText">
              Pérennité • Transmission • Reprise • Continuité •
              <span class="entrepriseUnifiedBandAction">
                Cliquez ici…
              </span>
            </span>

          </button>

          <button
            class="entrepriseUnifiedBand"
            type="button"
            data-unified-entreprise-screen="mecenat">

            <span class="entrepriseUnifiedBandText">
              Mécénat • Projets locaux • Engagement territorial •
              <span class="entrepriseUnifiedBandAction">
                Cliquez ici…
              </span>
            </span>

          </button>

        </div>
      </div>
    `;
  }

function addUniversalBackButton(
  modal,
  title
){
  return;
}
  function isSmallUnwantedBox(
    element,
    title
  ){

    const text =
      normalizeText(
        element.textContent
      );

    if(!text){
      return false;
    }

    const exactSmallLabels = [
      "recherche de personnel",
      "fidelisation",
      "developpement",
      "mutualisation",
      "visibilite",
      "economies",
      "perennite",
      "mecenat",
      "rechercher du personnel",
      "decouvrir les services locaux",
      "decouvrir le mecenat"
    ];

    if(
      exactSmallLabels.includes(
        text
      )
    ){
      return true;
    }

    if(
      text.startsWith(
        "vous pourriez egalement etre interesse par"
      )
    ){
      return true;
    }

    if(
      text.startsWith(
        "vous pourriez etre interesse par"
      )
    ){
      return true;
    }

    if(
      title.includes(
        "reduisez vos charges"
      ) ||
      title.includes(
        "opportunites de mutualisation"
      )
    ){

      if(
        text.includes(
          "decouvrez les entreprises de votre ville"
        ) &&
        text.includes(
          "la recherche commence toujours dans votre commune"
        )
      ){
        return true;
      }

      if(
        text.includes(
          "choisissez votre espace"
        ) &&
        text.includes(
          "commerce"
        ) &&
        text.includes(
          "entreprise"
        )
      ){
        return true;
      }
    }

    return false;
  }

  function removeUnwantedBoxes(
    modal,
    title
  ){

    if(!modal){
      return;
    }

    const candidates =
      modal.querySelectorAll(
        ".box," +
        ".choiceBtn," +
        "button," +
        ".miniCard," +
        ".choiceCard"
      );

    candidates.forEach(
      function(element){

        if(
          element.id ===
          "entrepriseUniversalBackButton"
        ){
          return;
        }

        if(
          element.closest(
            "#entrepriseUnifiedSuggestions"
          )
        ){
          return;
        }

        if(
          isSmallUnwantedBox(
            element,
            title
          )
        ){
          element.remove();
        }
      }
    );
  }

  function protectDirectionPrices(
    modal,
    title
  ){

    if(
      !modal ||
      !title.includes(
        "tableau de direction"
      )
    ){
      return;
    }

    const blocks =
      modal.querySelectorAll(
        ".box"
      );

    blocks.forEach(
      function(block){

        const text =
          normalizeText(
            block.textContent
          );

        const containsPrivatePrice =
          text.includes(
            "329 € ht"
          ) ||
          text.includes(
            "199 € ht"
          ) ||
          text.includes(
            "50 € ht par publication"
          ) ||
          text.includes(
            "adhesion annuelle professionnelle"
          ) ||
          text.includes(
            "services professionnels"
          );

        if(
          containsPrivatePrice
        ){
          block.classList.add(
            "entreprisePrivatePricesHidden"
          );
        }
      }
    );

    const existing =
      modal.querySelector(
        "#entreprisePrivateAccessNotice"
      );

    if(existing){
      return;
    }

    const notice =
      document.createElement(
        "div"
      );

    notice.id =
      "entreprisePrivateAccessNotice";

    notice.className =
      "box";

    notice.style.borderLeft =
      "6px solid #b00020";

    notice.innerHTML = `
      <strong>
        Informations professionnelles privées
      </strong>

      <br><br>

      Les abonnements,
      les tarifs,
      les factures
      et les informations propres à l’entreprise
      seront accessibles uniquement
      après identification de l’entreprise.

      <br><br>

      La fiche de renseignements
      et le code d’accès de chaque entreprise
      seront ajoutés dans la prochaine étape.
    `;

    modal.appendChild(
      notice
    );
  }

  function addSuggestions(
    modal,
    title
  ){

    if(!modal){
      return;
    }

    if(
      title.includes(
        "commerces & entreprises"
      ) ||
      title.includes(
        "commerces et entreprises"
      )
    ){
      return;
    }

    if(
      modal.querySelector(
        "#entrepriseUnifiedSuggestions"
      )
    ){
      return;
    }

    const host =
      document.createElement(
        "div"
      );

    host.innerHTML =
      buildSuggestionsHtml();

    const suggestions =
      host.firstElementChild;

    if(suggestions){

      modal.appendChild(
        suggestions
      );
    }
  }

  function bindUnifiedBands(
    modal
  ){

    if(!modal){
      return;
    }

    modal
      .querySelectorAll(
        "[data-unified-entreprise-screen]"
      )
      .forEach(
        function(button){

          button.onclick =
            function(event){

              if(event){
                event.preventDefault();
                event.stopPropagation();
              }

              const screen =
                button.getAttribute(
                  "data-unified-entreprise-screen"
                );

              if(
                screen &&
                typeof app.openScreen ===
                "function"
              ){

                app.openScreen(
                  screen
                );
              }
            };
        }
      );
  }

  function synchronizeBands(){

    const texts =
      document.querySelectorAll(
        "#entrepriseHomeBands " +
        ".entrepriseBandText," +
        ".entrepriseUnifiedBandText"
      );

    texts.forEach(
      function(text){

        text.style.animation =
          "none";

        text.style.transform =
          "translateX(100%)";

        text.style.animationPlayState =
          "paused";
      }
    );

    void document.body.offsetWidth;

    window.requestAnimationFrame(
      function(){

        texts.forEach(
          function(text){

            text.style.animation =
              "";

            text.style.animationPlayState =
              "running";
          }
        );
      }
    );
  }

  function applyCorrections(){

    const modal =
      getModalContent();

    if(!modal){
      return;
    }

    installStyles();

    const title =
      getModalTitle();

    removeUnwantedBoxes(
      modal,
      title
    );

    protectDirectionPrices(
      modal,
      title
    );

    addSuggestions(
      modal,
      title
    );

    bindUnifiedBands(
      modal
    );

    synchronizeBands();
  }

  let correctionTimer =
    null;

  const observer =
    new MutationObserver(
      function(){

        window.clearTimeout(
          correctionTimer
        );

        correctionTimer =
          window.setTimeout(
            applyCorrections,
            80
          );
      }
    );

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  document.addEventListener(
    "click",
    function(event){

      const target =
        event.target &&
        typeof event.target.closest ===
        "function"
          ? event.target.closest(
              "[data-entreprise-screen]," +
              "[data-corrected-screen]," +
              "[data-unified-entreprise-screen]"
            )
          : null;

      if(!target){
        return;
      }

      window.setTimeout(
        applyCorrections,
        100
      );
    },
    true
  );

  window.setTimeout(
    applyCorrections,
    200
  );

  console.log(
    "✅ Nettoyage, retours et bandes synchronisées chargés"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 08
   NOUVELLE INTRODUCTION DE LA PAGE VISIBILITÉ
   ========================================================== */

(function correctEntrepriseVisibilityIntroduction(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  function insertVisibilityIntroduction(){

    const modal =
      document.querySelector(
        ".modal-content," +
        ".modalContent," +
        "#modalContent"
      );

    if(!modal){
      return;
    }

    const modalText =
      String(
        modal.textContent || ""
      )
        .toLowerCase()
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        );

    if(
      !modalText.includes(
        "faites connaitre vos metiers"
      ) &&
      !modalText.includes(
        "votre savoir-faire"
      )
    ){
      return;
    }

    if(
      modal.querySelector(
        "#entrepriseVisibilityNewIntroduction"
      )
    ){
      return;
    }

    const introduction =
      document.createElement(
        "div"
      );

    introduction.id =
      "entrepriseVisibilityNewIntroduction";

    introduction.className =
      "box";

    introduction.style.borderLeft =
      "6px solid #2f5d46";

    introduction.style.marginBottom =
      "14px";

    introduction.innerHTML = `
      <strong style="font-size:18px;">
        Connaissez-vous le nom
        de cinq entreprises
        présentes dans votre ville ?
      </strong>

      <br><br>

      Probablement pas.

      <br><br>

      Et vous n’êtes pas le seul.

      <br><br>

      Il est encore trop difficile
      pour les habitants de savoir
      quelles entreprises existent,
      ce qu’elles font
      et où elles se trouvent
      dans leur propre ville.

      <br><br>

      <strong>
        Cela n’est pas normal.
      </strong>

      <br><br>

      Avant de chercher des clients,
      des salariés,
      des partenaires
      ou des fournisseurs plus loin,
      faites connaître votre entreprise
      en priorité à toute votre ville.

      <br><br>

      Les citoyens doivent savoir
      que vous existez,
      comprendre vos métiers,
      connaître votre savoir-faire
      et pouvoir vous situer.

      <br><br>

      Cette visibilité locale
      peut favoriser le recrutement,
      le bouche-à-oreille,
      les partenariats,
      les vocations chez les jeunes
      et la transmission future
      de l’entreprise.
    `;

    const firstExistingBox =
      modal.querySelector(
        ".box"
      );

    if(firstExistingBox){
      firstExistingBox.before(
        introduction
      );
    }else{
      modal.prepend(
        introduction
      );
    }
  }

  const observer =
    new MutationObserver(
      function(){
        window.setTimeout(
          insertVisibilityIntroduction,
          60
        );
      }
    );

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  window.setTimeout(
    insertVisibilityIntroduction,
    200
  );

  console.log(
    "✅ Introduction Visibilité corrigée"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 09
   FICHE DE RENSEIGNEMENTS ENTREPRISE
   ET CODE D’ACCÈS PRIVÉ
   ========================================================== */

(function addEntrepriseProfileAndPrivateAccess(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  if(
    window.BOCITEART_ENTREPRISE_PROFILE_09
  ){
    return;
  }

  window.BOCITEART_ENTREPRISE_PROFILE_09 =
    true;

  const PROFILE_KEY =
    "bociteart_entreprise_profile_v1";

  const ACCESS_KEY =
    "bociteart_entreprise_private_access_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return app.safeEscape(value);
  }

  function loadProfile(){

    try{

      const raw =
        localStorage.getItem(
          PROFILE_KEY
        );

      const data =
        raw ? JSON.parse(raw) : null;

      if(
        data &&
        typeof data === "object"
      ){
        return data;
      }

    }catch(error){

      console.warn(
        "Lecture de la fiche entreprise impossible :",
        error
      );
    }

    return {
      companyName:"",
      legalForm:"",
      siret:"",
      activity:"",
      address:"",
      postalCode:"",
      city:"Wattignies",
      managerName:"",
      email:"",
      phone:"",
      employeeCount:"",
      website:"",
      accessCode:"",
      updatedAt:"",
      updatedAtFr:""
    };
  }

  function saveProfile(profile){

    try{

      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(profile)
      );

    }catch(error){

      console.warn(
        "Enregistrement de la fiche entreprise impossible :",
        error
      );
    }
  }

  function createAccessCode(){

    return String(
      Math.floor(
        100000 +
        Math.random() * 900000
      )
    );
  }

  function isPrivateAccessOpen(){

    try{

      const raw =
        sessionStorage.getItem(
          ACCESS_KEY
        );

      const data =
        raw ? JSON.parse(raw) : null;

      return !!(
        data &&
        data.open === true
      );

    }catch(error){

      return false;
    }
  }

  function openPrivateAccess(){

    try{

      sessionStorage.setItem(
        ACCESS_KEY,
        JSON.stringify({
          open:true,
          openedAt:Date.now()
        })
      );

    }catch(error){}
  }

  function closePrivateAccess(){

    try{

      sessionStorage.removeItem(
        ACCESS_KEY
      );

    }catch(error){}
  }

  function getProfileHtml(){

    const saved =
      loadProfile();

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Fiche de renseignements de l’entreprise
        </strong>

        <br><br>

        Cette fiche permet d’identifier
        l’entreprise et d’ouvrir
        son espace professionnel privé.

        <br><br>

        Les informations confidentielles,
        les candidatures,
        les mutualisations,
        les tarifs et les factures
        ne sont pas visibles par les citoyens.
      </div>

      <label style="font-weight:900;">
        Nom de l’entreprise
      </label>

      <input
        id="entrepriseProfileName"
        class="miniField"
        type="text"
        value="${escapeValue(
          saved.companyName || ""
        )}"
        placeholder="Nom de l’entreprise">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Forme juridique
      </label>

      <select
        id="entrepriseProfileLegalForm"
        class="miniField">

        <option value="">
          Choisir
        </option>

        <option value="EI">
          Entreprise individuelle
        </option>

        <option value="EURL">
          EURL
        </option>

        <option value="SARL">
          SARL
        </option>

        <option value="SAS">
          SAS
        </option>

        <option value="SASU">
          SASU
        </option>

        <option value="SA">
          SA
        </option>

        <option value="Association">
          Association
        </option>

        <option value="Autre">
          Autre
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        SIRET ou SIREN
      </label>

      <input
        id="entrepriseProfileSiret"
        class="miniField"
        type="text"
        value="${escapeValue(
          saved.siret || ""
        )}"
        placeholder="SIRET ou SIREN">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Activité principale
      </label>

      <input
        id="entrepriseProfileActivity"
        class="miniField"
        type="text"
        value="${escapeValue(
          saved.activity || ""
        )}"
        placeholder="Activité principale">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Adresse
      </label>

      <input
        id="entrepriseProfileAddress"
        class="miniField"
        type="text"
        value="${escapeValue(
          saved.address || ""
        )}"
        placeholder="Adresse">

      <div
        style="
          display:grid;
          grid-template-columns:120px 1fr;
          gap:8px;
          margin-top:8px;
        ">

        <input
          id="entrepriseProfilePostalCode"
          class="miniField"
          type="text"
          value="${escapeValue(
            saved.postalCode || ""
          )}"
          placeholder="Code postal">

        <input
          id="entrepriseProfileCity"
          class="miniField"
          type="text"
          value="${escapeValue(
            saved.city || "Wattignies"
          )}"
          placeholder="Commune">
      </div>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Nom du responsable
      </label>

      <input
        id="entrepriseProfileManager"
        class="miniField"
        type="text"
        value="${escapeValue(
          saved.managerName || ""
        )}"
        placeholder="Nom et prénom">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Adresse e-mail professionnelle
      </label>

      <input
        id="entrepriseProfileEmail"
        class="miniField"
        type="email"
        value="${escapeValue(
          saved.email || ""
        )}"
        placeholder="Adresse e-mail">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Téléphone
      </label>

      <input
        id="entrepriseProfilePhone"
        class="miniField"
        type="tel"
        value="${escapeValue(
          saved.phone || ""
        )}"
        placeholder="Téléphone">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Nombre de salariés
      </label>

      <input
        id="entrepriseProfileEmployees"
        class="miniField"
        type="number"
        min="0"
        value="${escapeValue(
          saved.employeeCount || ""
        )}"
        placeholder="Nombre de salariés">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Site Internet
      </label>

      <input
        id="entrepriseProfileWebsite"
        class="miniField"
        type="url"
        value="${escapeValue(
          saved.website || ""
        )}"
        placeholder="https://">

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
        ">

        <strong>
          Code d’accès de l’entreprise
        </strong>

        <br><br>

        Lors du premier enregistrement,
        un code personnel à six chiffres
        est créé pour cette entreprise.

        <br><br>

        Ce même code restera ensuite associé
        à la fiche de l’entreprise.

        <br><br>

        Conservez-le soigneusement.
      </div>

      <button
        id="entrepriseProfileSaveBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Enregistrer la fiche entreprise
      </button>

      ${
        saved.accessCode
          ? `
            <button
              id="entrepriseProfileShowCodeBtn"
              class="choiceBtn"
              type="button"
              style="
                width:100%;
                margin-top:8px;
                background:#fff;
              ">
              Afficher mon code d’accès
            </button>
          `
          : ""
      }

      <div
        id="entrepriseProfileStatus"
        class="muted"
        style="margin-top:10px;">
      </div>
    `;
  }

  function restoreLegalForm(){

    const saved =
      loadProfile();

        /* =====================================================
       ACCÈS ADMINISTRATEUR BO'CITÉART — DÉMO
       Permet à l'administrateur de contrôler tous
       les espaces privés sans créer de fausse entreprise.
       ===================================================== */

    const isBociteAdmin =
      (
        localStorage.getItem(
          "bociteart_admin_authenticated_v1"
        ) === "true"
      ) ||
      (
        sessionStorage.getItem(
          "bociteart_admin_authenticated_v1"
        ) === "true"
      ) ||
      (
        window.BOCITEART_ADMIN_MODE === true
      );

    if(isBociteAdmin){

      if(
        typeof successCallback ===
        "function"
      ){
        successCallback();
        return;
      }

      openPrivateAccess();
      return;
    } 

    const select =
      getElement(
        "entrepriseProfileLegalForm"
      );

    if(
      select &&
      saved.legalForm
    ){
      select.value =
        saved.legalForm;
    }
  }

  function saveProfileForm(){

    const current =
      loadProfile();

    const companyName =
      String(
        getElement("entrepriseProfileName")
          ? getElement("entrepriseProfileName").value
          : ""
      ).trim();

    const legalForm =
      String(
        getElement("entrepriseProfileLegalForm")
          ? getElement("entrepriseProfileLegalForm").value
          : ""
      ).trim();

    const siret =
      String(
        getElement("entrepriseProfileSiret")
          ? getElement("entrepriseProfileSiret").value
          : ""
      )
        .replace(/\s+/g, "")
        .trim();

    const activity =
      String(
        getElement("entrepriseProfileActivity")
          ? getElement("entrepriseProfileActivity").value
          : ""
      ).trim();

    const address =
      String(
        getElement("entrepriseProfileAddress")
          ? getElement("entrepriseProfileAddress").value
          : ""
      ).trim();

    const postalCode =
      String(
        getElement("entrepriseProfilePostalCode")
          ? getElement("entrepriseProfilePostalCode").value
          : ""
      ).trim();

    const city =
      String(
        getElement("entrepriseProfileCity")
          ? getElement("entrepriseProfileCity").value
          : ""
      ).trim();

    const managerName =
      String(
        getElement("entrepriseProfileManager")
          ? getElement("entrepriseProfileManager").value
          : ""
      ).trim();

    const email =
      String(
        getElement("entrepriseProfileEmail")
          ? getElement("entrepriseProfileEmail").value
          : ""
      ).trim();

    const phone =
      String(
        getElement("entrepriseProfilePhone")
          ? getElement("entrepriseProfilePhone").value
          : ""
      ).trim();

    const employeeCount =
      String(
        getElement("entrepriseProfileEmployees")
          ? getElement("entrepriseProfileEmployees").value
          : ""
      ).trim();

    const website =
      String(
        getElement("entrepriseProfileWebsite")
          ? getElement("entrepriseProfileWebsite").value
          : ""
      ).trim();

    if(
      !companyName ||
      !legalForm ||
      !siret ||
      !activity ||
      !address ||
      !postalCode ||
      !city ||
      !managerName ||
      !email ||
      !phone
    ){
      alert(
        "Veuillez remplir toutes les informations obligatoires."
      );
      return;
    }

    if(
      siret.length !== 9 &&
      siret.length !== 14
    ){
      alert(
        "Le numéro SIREN doit contenir 9 chiffres ou le SIRET 14 chiffres."
      );
      return;
    }

    if(
      !/^\d+$/.test(siret)
    ){
      alert(
        "Le SIRET ou SIREN doit contenir uniquement des chiffres."
      );
      return;
    }

    if(!email.includes("@")){
      alert(
        "Veuillez renseigner une adresse e-mail valide."
      );
      return;
    }

    const firstCreation =
      !current.accessCode;

    const profile = {
      companyName:companyName,
      legalForm:legalForm,
      siret:siret,
      activity:activity,
      address:address,
      postalCode:postalCode,
      city:city,
      managerName:managerName,
      email:email,
      phone:phone,
      employeeCount:employeeCount,
      website:website,

      accessCode:
        current.accessCode ||
        createAccessCode(),

      updatedAt:
        Date.now(),

      updatedAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )
    };

    saveProfile(profile);

    const status =
      getElement(
        "entrepriseProfileStatus"
      );

    if(status){
      status.textContent =
        "Fiche enregistrée le " +
        profile.updatedAtFr +
        ".";
    }

    if(firstCreation){

      alert(
        "La fiche entreprise est enregistrée.\n\n" +
        "Votre code d’accès personnel est :\n\n" +
        profile.accessCode +
        "\n\nConservez soigneusement ce code."
      );

    }else{

      alert(
        "La fiche entreprise a été mise à jour.\n\n" +
        "Votre code d’accès reste inchangé."
      );
    }

    openEntrepriseProfile();
  }

  function showAccessCode(){

    const profile =
      loadProfile();

    if(!profile.accessCode){
      alert(
        "Enregistrez d’abord la fiche entreprise."
      );
      return;
    }

    const confirmation =
      confirm(
        "Afficher le code d’accès privé de l’entreprise ?"
      );

    if(!confirmation){
      return;
    }

    alert(
      "Code d’accès de l’entreprise :\n\n" +
      profile.accessCode
    );
  }

  function bindProfile(){

    restoreLegalForm();

    const saveButton =
      getElement(
        "entrepriseProfileSaveBtn"
      );

    const showCodeButton =
      getElement(
        "entrepriseProfileShowCodeBtn"
      );

    if(saveButton){
      saveButton.onclick =
        saveProfileForm;
    }

    if(showCodeButton){
      showCodeButton.onclick =
        showAccessCode;
    }

    const saved =
      loadProfile();

    const status =
      getElement(
        "entrepriseProfileStatus"
      );

    if(
      status &&
      saved.updatedAtFr
    ){
      status.textContent =
        "Dernière mise à jour : " +
        saved.updatedAtFr +
        ".";
    }
  }

  function openEntrepriseProfile(){

    app.renderModal(
      "Fiche de l’entreprise",
      getProfileHtml()
    );

    window.setTimeout(
      bindProfile,
      0
    );
  }

   function openPrivateLogin(
    successCallback
  ){

    const profile =
      loadProfile();

    /* =====================================================
       ADMINISTRATEUR BO'CITÉART — CONTRÔLE DE LA DÉMO
       ===================================================== */

    const isBociteAdmin =
      (
        localStorage.getItem(
          "bociteart_admin_authenticated_v1"
        ) === "true"
      ) ||
      (
        sessionStorage.getItem(
          "bociteart_admin_authenticated_v1"
        ) === "true"
      ) ||
      (
        window.BOCITEART_ADMIN_MODE === true
      );

    if(isBociteAdmin){

      if(
        typeof successCallback ===
        "function"
      ){

        successCallback();
        return;
      }

      openPrivateAccess();
      return;
    }

    /* =====================================================
       FICHE PROFESSIONNELLE NON ENCORE CRÉÉE
       ===================================================== */

    if(
      !profile.companyName ||
      !profile.accessCode
    ){

      app.renderModal(
        "Accès professionnel",
        `
          <div
            class="box"
            style="
              border-left:6px solid #b00020;
              background:#ffffff;
              color:#111111;
              font-size:14px;
              line-height:1.50;
              font-weight:400;
            ">

            <div
              style="
                color:#2f5d46;
                font-size:17px;
                line-height:1.35;
                font-weight:800;
                margin-bottom:10px;
              ">
              Fiche professionnelle à compléter
            </div>

            La fiche professionnelle
            permet d’identifier l’entreprise
            et de sécuriser son espace privé.

            <br><br>

            Un code d’accès personnel
            sera créé lors du premier enregistrement.

          </div>

          <button
            id="privateAccessCreateProfileBtn"
            class="choiceBtn"
            type="button"
            style="
              width:100%;
              margin-top:10px;
              background:#ffffff !important;
              color:#111111 !important;
            ">
            Compléter ma fiche professionnelle
          </button>
        `
      );

      window.setTimeout(
        function(){

          const button =
            getElement(
              "privateAccessCreateProfileBtn"
            );

          if(button){

            button.onclick =
              openEntrepriseProfile;
          }

        },
        0
      );

      return;
    }

    /* =====================================================
       ACCÈS PRIVÉ
       ===================================================== */

    app.renderModal(
      "Accès privé de l’entreprise",
      `

        <div
          class="box"
          style="
            border-left:6px solid #b00020;
            background:#ffffff;
            color:#111111;
            font-size:14px;
            line-height:1.50;
            font-weight:400;
          ">

          <div
            style="
              color:#2f5d46;
              font-size:17px;
              line-height:1.35;
              font-weight:800;
              margin-bottom:10px;
            ">
            ${escapeValue(
              profile.companyName
            )}
          </div>

          Cet espace est réservé
          aux informations
          et services privés de l’entreprise.

          <br><br>

          • candidatures reçues ;<br>
          • actions pour payer moins de charges ;<br>
          • propositions et décisions ;<br>
          • abonnements ;<br>
          • paiements ;<br>
          • factures.

        </div>

        <label
          for="entreprisePrivateCodeInput"
          style="
            display:block;
            margin-top:12px;
            color:#111111;
            font-size:14px;
            font-weight:400;
          ">
          Code d’accès de l’entreprise
        </label>

        <input
          id="entreprisePrivateCodeInput"
          class="miniField"
          type="password"
          inputmode="numeric"
          maxlength="6"
          placeholder="Code à six chiffres"
          style="
            background:#ffffff;
            color:#111111;
          ">

        <button
          id="entreprisePrivateLoginBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:12px;
            background:#ffffff !important;
            color:#111111 !important;
          ">
          Ouvrir l’espace privé
        </button>

      `
    );

    window.setTimeout(
      function(){

        const codeInput =
          getElement(
            "entreprisePrivateCodeInput"
          );

        const loginButton =
          getElement(
            "entreprisePrivateLoginBtn"
          );

        function verifyCode(){

          const entered =
            String(
              codeInput
                ? codeInput.value
                : ""
            )
            .trim();

          if(
            entered !==
            String(
              profile.accessCode
            )
          ){

            alert(
              "Le code d’accès est incorrect."
            );

            return;
          }

          openPrivateAccess();

          if(
            typeof successCallback ===
            "function"
          ){

            successCallback();
          }
        }

        if(loginButton){

          loginButton.onclick =
            verifyCode;
        }

        if(codeInput){

          codeInput.addEventListener(
            "keydown",
            function(event){

              if(
                event.key ===
                "Enter"
              ){

                event.preventDefault();

                verifyCode();
              }
            }
          );
        }

      },
      0
    );
  }
  /*
    Conservation de la dernière version
    du Tableau de Direction déjà enregistrée.
  */

  const previousDirectionScreen =
    app.screens &&
    typeof app.screens.direction ===
    "function"
      ? app.screens.direction
      : null;

  function openProtectedDirection(){

    if(isPrivateAccessOpen()){

      if(previousDirectionScreen){
        previousDirectionScreen();
      }

      return;
    }

    openPrivateLogin(
      function(){

        if(previousDirectionScreen){
          previousDirectionScreen();
        }
      }
    );
  }

  /*
    Ajout des boutons sur l’accueil Entreprise.
  */

  function addProfileButtonsToHome(){

    const modal =
      document.querySelector(
        ".modal-content," +
        ".modalContent," +
        "#modalContent"
      );

    if(!modal){
      return;
    }

    const text =
      String(
        modal.textContent || ""
      )
        .toLowerCase()
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        );

    if(
      !text.includes(
        "commerces & entreprises"
      ) &&
      !text.includes(
        "developpez votre entreprise"
      )
    ){
      return;
    }

    if(
      modal.querySelector(
        "#entrepriseProfileHomeBox"
      )
    ){
      return;
    }

    const box =
      document.createElement(
        "div"
      );

    box.id =
      "entrepriseProfileHomeBox";

    box.className =
      "box";

    box.style.borderLeft =
      "6px solid #2f5d46";

    box.innerHTML = `
      <strong>
        Espace professionnel de l’entreprise
      </strong>

      <br><br>

      Complétez la fiche de l’entreprise
      pour recevoir votre code d’accès privé.

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:12px;
        ">

        <button
          id="entrepriseHomeProfileBtn"
          class="choiceBtn"
          type="button">
          Ma fiche entreprise
        </button>

        <button
          id="entrepriseHomePrivateBtn"
          class="choiceBtn"
          type="button">
          Accès privé entreprise
        </button>
      </div>
    `;

    const bands =
      modal.querySelector(
        "#entrepriseHomeBands"
      );

    if(bands){
      bands.before(box);
    }else{
      modal.appendChild(box);
    }

    const profileButton =
      getElement(
        "entrepriseHomeProfileBtn"
      );

    const privateButton =
      getElement(
        "entrepriseHomePrivateBtn"
      );

    if(profileButton){
      profileButton.onclick =
        openEntrepriseProfile;
    }

    if(privateButton){
      privateButton.onclick =
        openProtectedDirection;
    }
  }

  const observer =
    new MutationObserver(
      function(){

        window.setTimeout(
          addProfileButtonsToHome,
          80
        );
      }
    );

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  app.registerScreen(
    "fiche_entreprise",
    openEntrepriseProfile
  );

  app.registerScreen(
    "direction",
    openProtectedDirection
  );

  app.openEntrepriseProfile =
    openEntrepriseProfile;

  app.openPrivateEntrepriseAccess =
    openProtectedDirection;

  app.closePrivateEntrepriseAccess =
    closePrivateAccess;

  app.loadEntrepriseProfile =
    loadProfile;

  window.setTimeout(
    addProfileButtonsToHome,
    200
  );

  console.log(
    "✅ Fiche entreprise et accès privé chargés"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 10
   PAGE DÉVELOPPEZ VOTRE ENTREPRISE
   LISTE LOCALE • RECHERCHE • REMISE PARTENAIRE
   ========================================================== */

(function correctEntrepriseDevelopmentPage(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function openCorrectedDevelopmentPage(){

    app.renderModal(
      "Développez votre entreprise",
      `
        <button
          id="developmentCorrectedBackBtn"
          class="choiceBtn"
          type="button"
          style="margin-bottom:14px;">
          Retour
        </button>

        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            Votre prochain client,
            fournisseur,
            salarié
            ou partenaire
            se trouve peut-être déjà
            dans votre ville
          </strong>

          <br><br>

          Une entreprise se développe
          grâce à ses produits
          et à ses services,
          mais aussi grâce aux rencontres,
          aux informations
          et aux bonnes décisions
          prises au bon moment.
        </div>

        <div class="box">

          <strong>
            Commencez par regarder autour de vous
          </strong>

          <br><br>

          Découvrez les entreprises
          et les commerces présents
          dans votre commune,
          leurs métiers,
          leurs savoir-faire
          et leurs besoins.

          <br><br>

          Recherchez un fournisseur,
          un sous-traitant,
          une compétence complémentaire,
          un commerce
          ou un partenaire local.

          <br><br>

          Avant de chercher loin,
          regardez ce qui existe déjà
          près de chez vous.
        </div>

        <div class="box">

          <strong>
            Une liste locale réellement utile
          </strong>

          <br><br>

          Les citoyens,
          les entreprises
          et les commerces
          doivent pouvoir retrouver
          les acteurs présents dans leur ville.

          <br><br>

          Cette connaissance locale
          permet de se rappeler
          qui travaille,
          produit
          et propose des services
          sur le territoire.
        </div>

        <div
          style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
          ">

          <button
            id="developmentCorrectedDirectoryBtn"
            class="choiceBtn"
            type="button">
            Voir les entreprises et commerces de ma ville
          </button>

          <button
            id="developmentCorrectedSearchBtn"
            class="choiceBtn"
            type="button">
            Rechercher un professionnel
          </button>

          <button
            id="developmentCorrectedVisibilityBtn"
            class="choiceBtn"
            type="button">
            Faire connaître mon entreprise
          </button>

          <button
            id="developmentCorrectedEmploymentBtn"
            class="choiceBtn"
            type="button">
            Trouver du personnel
          </button>
        </div>

        <div
          class="box"
          style="
            margin-top:16px;
            border-left:6px solid #2f5d46;
          ">

          <strong style="font-size:17px;">
            Favoriser les échanges entre professionnels locaux
          </strong>

          <br><br>

          Une entreprise ou un commerce
          pourra choisir librement
          de proposer un avantage
          aux autres professionnels partenaires
          de sa ville.

          <br><br>

          Cet avantage pourra être :

          <br><br>

          • une remise de 5 % ;<br>
          • une remise de 10 % ;<br>
          • ou un avantage personnalisé.

          <br><br>

          Cette remise ne sera jamais obligatoire.

          <br><br>

          Pour produire un véritable effet,
          elle devra toutefois être plus avantageuse
          que les conditions habituellement accordées
          aux clients.
        </div>

        <div class="box">

          <strong>
            Le principe est réciproque
          </strong>

          <br><br>

          Lorsque deux professionnels partenaires
          choisissent de participer,
          chacun peut bénéficier
          des conditions proposées par l’autre.

          <br><br>

          L’objectif est de favoriser
          davantage de relations commerciales locales,
          sans imposer de fournisseur
          ni limiter la liberté de choix.
        </div>

        <div
          class="box"
          style="
            margin-top:16px;
            border-left:6px solid #2f5d46;
          ">

          <strong>
            Vous pourriez également être intéressé.
          </strong>

          <br><br>

          Cliquez dans l’une des propositions
          en bandes défilantes
          situées en bas de cette page.
        </div>

        <div
          id="developmentCorrectedBandsHost">
        </div>
      `
    );

    window.setTimeout(function(){

      const backButton =
        getElement(
          "developmentCorrectedBackBtn"
        );

      const directoryButton =
        getElement(
          "developmentCorrectedDirectoryBtn"
        );

      const searchButton =
        getElement(
          "developmentCorrectedSearchBtn"
        );

      const visibilityButton =
        getElement(
          "developmentCorrectedVisibilityBtn"
        );

      const employmentButton =
        getElement(
          "developmentCorrectedEmploymentBtn"
        );

      if(backButton){
        backButton.onclick = function(){
          app.openHome();
        };
      }

      if(directoryButton){
        directoryButton.onclick = function(){

          if(
            typeof app.openLocalDirectory ===
            "function"
          ){
            app.openLocalDirectory();
            return;
          }

          if(
            typeof app.openCorrectedDirectory ===
            "function"
          ){
            app.openCorrectedDirectory();
            return;
          }

          app.openScreen(
            "annuaire"
          );
        };
      }

      if(searchButton){
        searchButton.onclick = function(){

          if(
            typeof app.openProfessionalDirectory ===
            "function"
          ){
            app.openProfessionalDirectory();
            return;
          }

          app.openScreen(
            "annuaire"
          );
        };
      }

      if(visibilityButton){
        visibilityButton.onclick = function(){
          app.openScreen(
            "visibilite"
          );
        };
      }

      if(employmentButton){
        employmentButton.onclick = function(){
          app.openScreen(
            "emploi"
          );
        };
      }

    },0);
  }

  /*
    Le dernier écran enregistré
    remplace les anciennes versions
    de la page Développement.
  */

  app.registerScreen(
    "developpement",
    openCorrectedDevelopmentPage
  );

  app.openCorrectedDevelopmentPage =
    openCorrectedDevelopmentPage;

  console.log(
    "✅ Page Développement corrigée"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 11
   RÉDUISEZ VOS CHARGES
   MUTUALISATIONS • COMPARAISON • DÉCISION PRIVÉE
   ========================================================== */

(function correctEntrepriseMutualisationPage(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return app.safeEscape(value);
  }

  function loadData(){

    if(
      typeof app.loadMutualisationData ===
      "function"
    ){
      const data =
        app.loadMutualisationData();

      if(
        data &&
        typeof data === "object"
      ){
        return data;
      }
    }

    return {};
  }

  function saveData(data){

    if(
      typeof app.saveMutualisationData ===
      "function"
    ){
      app.saveMutualisationData(
        data
      );
    }
  }

  function getMutualisationKeys(data){

    return Object.keys(data)
      .filter(function(key){

        const item =
          data[key];

        return (
          key !== "autres" &&
          item &&
          typeof item === "object" &&
          item.label
        );
      });
  }

  function getProgressPercent(
    count,
    target
  ){

    const safeTarget =
      Number(target || 0);

    if(!safeTarget){
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        Number(count || 0) /
        safeTarget *
        100
      )
    );
  }

  function getMutualisationCards(){

    const data =
      loadData();

    const keys =
      getMutualisationKeys(
        data
      );

    if(!keys.length){

      return `
        <div class="box">
          Aucune mutualisation
          n’est disponible pour le moment.
        </div>
      `;
    }

    return keys
      .map(function(key){

        const item =
          data[key];

        const count =
          Number(
            item.count || 0
          );

        const target =
          Number(
            item.target || 0
          );

        const percent =
          getProgressPercent(
            count,
            target
          );

        return `
          <div class="box">

            <div
              style="
                display:flex;
                justify-content:space-between;
                gap:10px;
                align-items:flex-start;
              ">

              <div style="flex:1;">

                <strong style="font-size:16px;">
                  ${escapeValue(
                    item.label
                  )}
                </strong>

                ${
                  item.description
                    ? `
                      <div
                        style="
                          margin-top:8px;
                          line-height:1.45;
                        ">
                        ${escapeValue(
                          item.description
                        )}
                      </div>
                    `
                    : ""
                }
              </div>

              <strong
                style="
                  color:#2f5d46;
                  white-space:nowrap;
                ">
                ${count} / ${target}
              </strong>
            </div>

            <div
              style="
                height:12px;
                margin-top:10px;
                overflow:hidden;
                border-radius:999px;
                background:#e5dfd5;
              ">

              <div
                style="
                  width:${percent}%;
                  height:100%;
                  background:#2f5d46;
                ">
              </div>
            </div>

            <div
              class="muted"
              style="margin-top:6px;">
              ${percent} % de l’objectif indicatif
            </div>

            <button
              class="choiceBtn correctedChargesInterestBtn"
              type="button"
              data-charges-key="${escapeValue(
                key
              )}"
              style="
                width:100%;
                margin-top:10px;
                ${
                  item.interested
                    ? "opacity:.65;"
                    : ""
                }
              ">

              ${
                item.interested
                  ? "Intérêt enregistré"
                  : "Cette mutualisation m’intéresse"
              }
            </button>

            <button
              class="choiceBtn correctedChargesProposalBtn"
              type="button"
              data-charges-key="${escapeValue(
                key
              )}"
              style="
                width:100%;
                margin-top:8px;
                background:#fff;
              ">
              Voir les propositions
            </button>
          </div>
        `;
      })
      .join("");
  }

  function openCorrectedChargesPage(){

    app.renderModal(
      "Réduisez vos charges",
      `
        <button
          id="correctedChargesBackBtn"
          class="choiceBtn"
          type="button"
          style="margin-bottom:14px;">
          Retour
        </button>

        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            Réduisez vos charges
          </strong>

          <br><br>

          Pourquoi continuer
          à négocier seul
          lorsqu’il est possible
          de regrouper les besoins
          de plusieurs entreprises ?

          <br><br>

          Bo'CitéArt recueille
          les entreprises intéressées,
          organise la consultation
          et rassemble les propositions reçues.
        </div>

        <div class="box">

          <strong>
            Bo'CitéArt ne choisit pas à votre place
          </strong>

          <br><br>

          Bo'CitéArt ne vend aucun contrat,
          ne recommande aucun prestataire
          et ne devient pas un groupement d’achat.

          <br><br>

          Chaque entreprise reste libre :

          <br><br>

          • de consulter les propositions ;<br>
          • de les comparer ;<br>
          • d’en choisir une ;<br>
          • de refuser toutes les propositions ;<br>
          • ou de confirmer sa participation.
        </div>

        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:17px;">
            Comparez, choisissez, validez
          </strong>

          <br><br>

          Lorsque les propositions sont disponibles,
          elles sont présentées clairement
          dans le Tableau de Direction privé
          de l’entreprise.

          <br><br>

          Vous pourrez y consulter :

          <br><br>

          • le nom du prestataire ;<br>
          • la proposition reçue ;<br>
          • les délais ;<br>
          • les économies estimées ;<br>
          • les votes enregistrés ;<br>
          • l’état d’avancement.

          <br><br>

          Votre choix reste modifiable
          tant que vous n’avez pas confirmé
          définitivement votre participation.
        </div>

        <div
          style="
            margin-top:16px;
            margin-bottom:10px;
            font-size:18px;
            font-weight:900;
            color:#2f5d46;
          ">
          Mutualisations proposées
        </div>

        <div id="correctedChargesList">
          ${getMutualisationCards()}
        </div>

        <div
          class="box"
          style="
            margin-top:16px;
            border-left:6px solid #b00020;
          ">

          <strong>
            Votre premier clic
            ne constitue pas un engagement
          </strong>

          <br><br>

          Il indique uniquement
          que le sujet peut vous intéresser.

          <br><br>

          L’engagement éventuel
          intervient uniquement
          après consultation des propositions
          et confirmation
          dans le Tableau de Direction privé.
        </div>

        <button
          id="correctedChargesDirectionBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Ouvrir le Tableau de Direction
        </button>
      `
    );

    window.setTimeout(function(){

      const backButton =
        getElement(
          "correctedChargesBackBtn"
        );

      const directionButton =
        getElement(
          "correctedChargesDirectionBtn"
        );

      if(backButton){

        backButton.onclick = function(){
          app.openHome();
        };
      }

      if(directionButton){

        directionButton.onclick =
          openProtectedDirection;
      }

      document
        .querySelectorAll(
          ".correctedChargesInterestBtn"
        )
        .forEach(function(button){

          button.onclick = function(){

            registerInterest(
              button.getAttribute(
                "data-charges-key"
              )
            );
          };
        });

      document
        .querySelectorAll(
          ".correctedChargesProposalBtn"
        )
        .forEach(function(button){

          button.onclick = function(){

            openProposals(
              button.getAttribute(
                "data-charges-key"
              )
            );
          };
        });

    },0);
  }

  function registerInterest(key){

    const data =
      loadData();

    const item =
      data[key];

    if(!item){

      alert(
        "Cette mutualisation est introuvable."
      );

      return;
    }

    if(item.interested){

      alert(
        "Votre intérêt est déjà enregistré."
      );

      return;
    }

    item.interested =
      true;

    item.count =
      Number(
        item.count || 0
      ) + 1;

    item.updatedAt =
      Date.now();

    item.updatedAtFr =
      new Date()
        .toLocaleString(
          "fr-FR"
        );

    saveData(
      data
    );

    alert(
      "Votre intérêt est enregistré.\n\n" +
      "Vous ne prenez aucun engagement à ce stade."
    );

    openCorrectedChargesPage();
  }

  function openProtectedDirection(){

    if(
      typeof app.openPrivateEntrepriseAccess ===
      "function"
    ){
      app.openPrivateEntrepriseAccess();
      return;
    }

    app.openScreen(
      "direction"
    );
  }

  function openProposals(key){

    const data =
      loadData();

    const item =
      data[key];

    if(!item){

      alert(
        "Cette mutualisation est introuvable."
      );

      return;
    }

    if(!item.interested){

      alert(
        "Enregistrez d’abord votre intérêt " +
        "pour cette mutualisation."
      );

      return;
    }

    /*
      Les propositions et les décisions
      appartiennent à l’espace privé.
    */

    if(
      typeof app.openPrivateEntrepriseAccess ===
      "function"
    ){
      app.openPrivateEntrepriseAccess();
      return;
    }

    if(
      typeof app.openMutualisationVotes ===
      "function"
    ){
      app.openMutualisationVotes(
        key
      );

      return;
    }

    alert(
      "Les propositions ne sont pas encore disponibles."
    );
  }

  /*
    « Économies » ne reste plus
    comme une page séparée.

    Elle ouvre désormais directement
    la page Réduisez vos charges,
    qui contient aussi :
    Comparez, choisissez, validez.
  */

  app.registerScreen(
    "mutualisation",
    openCorrectedChargesPage
  );

  app.registerScreen(
    "economies",
    openCorrectedChargesPage
  );

  app.openCorrectedChargesPage =
    openCorrectedChargesPage;

  console.log(
    "✅ Page Réduisez vos charges corrigée"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 12
   PAGE VISIBILITÉ COMPLÈTE
   PRÉSENTATION DE L’ENTREPRISE • FICHE ENRICHIE
   ========================================================== */

(function correctEntrepriseVisibilityPage(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return app.safeEscape(value);
  }

  function loadVisibilityData(){

    if(
      typeof app.loadVisibilityData ===
      "function"
    ){
      const data =
        app.loadVisibilityData();

      if(
        data &&
        typeof data === "object"
      ){
        return data;
      }
    }

    return {
      companyName:"",
      activity:"",
      presentation:"",
      knowHow:"",
      services:"",
      website:"",
      phone:"",
      email:"",
      quoteEnabled:false,
      recruitmentEnabled:false,
      patronageEnabled:false,
      newsEnabled:false,
      updatedAtFr:""
    };
  }

  function saveVisibilityData(data){

    if(
      typeof app.saveVisibilityData ===
      "function"
    ){
      app.saveVisibilityData(
        data
      );

      return;
    }

    try{
      localStorage.setItem(
        "bociteart_entreprise_visibility_v1",
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement de la visibilité impossible :",
        error
      );
    }
  }

  function openCorrectedVisibilityPage(){

    const saved =
      loadVisibilityData();

    app.renderModal(
      "Faites connaître vos métiers et votre savoir-faire",
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            Connaissez-vous le nom
            de cinq entreprises
            présentes dans votre ville ?
          </strong>

          <br><br>

          Probablement pas.

          <br><br>

          Et vous n’êtes pas le seul.

          <br><br>

          Il est encore trop difficile
          pour les habitants de savoir
          quelles entreprises existent,
          ce qu’elles font
          et où elles se trouvent
          dans leur propre ville.

          <br><br>

          <strong>
            Cela n’est pas normal.
          </strong>
        </div>

        <div class="box">

          <strong style="font-size:17px;">
            Faites connaître votre entreprise
            en priorité à toute votre ville
          </strong>

          <br><br>

          Avant de chercher des clients,
          des salariés,
          des partenaires
          ou des fournisseurs plus loin,
          les citoyens doivent déjà savoir
          que votre entreprise existe.

          <br><br>

          Ils doivent comprendre :

          <br><br>

          • ce que vous faites ;<br>
          • où vous vous trouvez ;<br>
          • quels métiers vous exercez ;<br>
          • quels services vous proposez ;<br>
          • quels savoir-faire vous possédez.
        </div>

        <div class="box">

          <strong>
            Faire connaître votre entreprise
            crée plusieurs leviers
          </strong>

          <br><br>

          • le recrutement ;<br>
          • le bouche-à-oreille ;<br>
          • les partenariats ;<br>
          • la découverte des métiers ;<br>
          • les vocations chez les jeunes ;<br>
          • la transmission future ;<br>
          • la reconnaissance locale.
        </div>

        <div class="box">

          <strong>
            Même si vous travaillez
            uniquement avec des professionnels
          </strong>

          <br><br>

          Les habitants peuvent connaître
          votre activité,
          parler de vous,
          transmettre votre nom,
          penser à vous pour un emploi
          ou vous mettre en relation
          avec une autre entreprise.
        </div>

        <div
          style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
          ">

          <button
            id="correctedVisibilityDirectoryBtn"
            class="choiceBtn"
            type="button">
            Voir les entreprises et commerces de la ville
          </button>

          <button
            id="correctedVisibilityProfileBtn"
            class="choiceBtn"
            type="button">
            Ma fiche entreprise
          </button>

          <button
            id="correctedVisibilityAdvertisementBtn"
            class="choiceBtn"
            type="button">
            Diffuser une publicité
          </button>
        </div>

        <div
          class="box"
          style="
            margin-top:16px;
            border-left:6px solid #2f5d46;
          ">

          <strong style="font-size:17px;">
            Présenter mon entreprise
          </strong>

          <br><br>

          Complétez les informations
          que vous souhaitez rendre visibles
          dans la fiche enrichie Bo'CitéArt.
        </div>

        <label style="font-weight:900;">
          Nom de l’entreprise
        </label>

        <input
          id="correctedVisibilityCompanyName"
          class="miniField"
          type="text"
          value="${escapeValue(
            saved.companyName || ""
          )}"
          placeholder="Nom de l’entreprise">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Activité principale
        </label>

        <input
          id="correctedVisibilityActivity"
          class="miniField"
          type="text"
          value="${escapeValue(
            saved.activity || ""
          )}"
          placeholder="Exemple : installation électrique">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Présentation de l’entreprise
        </label>

        <textarea
          id="correctedVisibilityPresentation"
          class="miniField"
          style="min-height:110px;"
          placeholder="Présentez votre entreprise.">${escapeValue(
            saved.presentation || ""
          )}</textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Métiers et savoir-faire
        </label>

        <textarea
          id="correctedVisibilityKnowHow"
          class="miniField"
          style="min-height:100px;"
          placeholder="Décrivez vos métiers et votre savoir-faire.">${escapeValue(
            saved.knowHow || ""
          )}</textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Services proposés
        </label>

        <textarea
          id="correctedVisibilityServices"
          class="miniField"
          style="min-height:100px;"
          placeholder="Indiquez vos principaux services.">${escapeValue(
            saved.services || ""
          )}</textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Téléphone
        </label>

        <input
          id="correctedVisibilityPhone"
          class="miniField"
          type="tel"
          value="${escapeValue(
            saved.phone || ""
          )}"
          placeholder="Téléphone professionnel">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Adresse e-mail
        </label>

        <input
          id="correctedVisibilityEmail"
          class="miniField"
          type="email"
          value="${escapeValue(
            saved.email || ""
          )}"
          placeholder="Adresse e-mail professionnelle">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Site Internet
        </label>

        <input
          id="correctedVisibilityWebsite"
          class="miniField"
          type="url"
          value="${escapeValue(
            saved.website || ""
          )}"
          placeholder="https://">

        <div
          class="box"
          style="margin-top:12px;">

          <strong>
            Services visibles sur la fiche
          </strong>

          <label class="miniCheck">

            <input
              id="correctedVisibilityQuote"
              type="checkbox"
              ${
                saved.quoteEnabled
                  ? "checked"
                  : ""
              }>

            <span>
              Autoriser les demandes de devis
            </span>
          </label>

          <label class="miniCheck">

            <input
              id="correctedVisibilityRecruitment"
              type="checkbox"
              ${
                saved.recruitmentEnabled
                  ? "checked"
                  : ""
              }>

            <span>
              Afficher les recrutements en cours
            </span>
          </label>

          <label class="miniCheck">

            <input
              id="correctedVisibilityPatronage"
              type="checkbox"
              ${
                saved.patronageEnabled
                  ? "checked"
                  : ""
              }>

            <span>
              Afficher les engagements en mécénat
            </span>
          </label>

          <label class="miniCheck">

            <input
              id="correctedVisibilityNews"
              type="checkbox"
              ${
                saved.newsEnabled
                  ? "checked"
                  : ""
              }>

            <span>
              Afficher les actualités de l’entreprise
            </span>
          </label>
        </div>

        <button
          id="correctedVisibilitySaveBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Enregistrer ma présentation
        </button>

        <button
          id="correctedVisibilityPreviewBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
            background:#fff;
          ">
          Prévisualiser ma fiche
        </button>

        <div
          id="correctedVisibilityStatus"
          class="muted"
          style="margin-top:10px;">
        </div>
      `
    );

    window.setTimeout(function(){

      const directoryButton =
        getElement(
          "correctedVisibilityDirectoryBtn"
        );

      const profileButton =
        getElement(
          "correctedVisibilityProfileBtn"
        );

      const advertisementButton =
        getElement(
          "correctedVisibilityAdvertisementBtn"
        );

      const saveButton =
        getElement(
          "correctedVisibilitySaveBtn"
        );

      const previewButton =
        getElement(
          "correctedVisibilityPreviewBtn"
        );

      if(directoryButton){
        directoryButton.onclick = function(){

          if(
            typeof app.openLocalDirectory ===
            "function"
          ){
            app.openLocalDirectory();
            return;
          }

          if(
            typeof app.openCorrectedDirectory ===
            "function"
          ){
            app.openCorrectedDirectory();
            return;
          }

          app.openScreen(
            "annuaire"
          );
        };
      }

      if(profileButton){
        profileButton.onclick = function(){

          if(
            typeof app.openEntrepriseProfile ===
            "function"
          ){
            app.openEntrepriseProfile();
          }
        };
      }

      if(advertisementButton){
        advertisementButton.onclick = function(){

          if(
            typeof window.openTicker ===
            "function"
          ){
            window.openTicker();
          }else{
            alert(
              "Le calendrier publicitaire est momentanément indisponible."
            );
          }
        };
      }

      if(saveButton){
        saveButton.onclick =
          saveCorrectedVisibility;
      }

      if(previewButton){
        previewButton.onclick =
          openCorrectedVisibilityPreview;
      }

      const status =
        getElement(
          "correctedVisibilityStatus"
        );

      if(
        status &&
        saved.updatedAtFr
      ){
        status.textContent =
          "Dernière mise à jour : " +
          saved.updatedAtFr +
          ".";
      }

    },0);
  }

  function saveCorrectedVisibility(){

    const companyName =
      String(
        getElement("correctedVisibilityCompanyName")
          ? getElement("correctedVisibilityCompanyName").value
          : ""
      ).trim();

    const activity =
      String(
        getElement("correctedVisibilityActivity")
          ? getElement("correctedVisibilityActivity").value
          : ""
      ).trim();

    const presentation =
      String(
        getElement("correctedVisibilityPresentation")
          ? getElement("correctedVisibilityPresentation").value
          : ""
      ).trim();

    const knowHow =
      String(
        getElement("correctedVisibilityKnowHow")
          ? getElement("correctedVisibilityKnowHow").value
          : ""
      ).trim();

    const services =
      String(
        getElement("correctedVisibilityServices")
          ? getElement("correctedVisibilityServices").value
          : ""
      ).trim();

    const phone =
      String(
        getElement("correctedVisibilityPhone")
          ? getElement("correctedVisibilityPhone").value
          : ""
      ).trim();

    const email =
      String(
        getElement("correctedVisibilityEmail")
          ? getElement("correctedVisibilityEmail").value
          : ""
      ).trim();

    const website =
      String(
        getElement("correctedVisibilityWebsite")
          ? getElement("correctedVisibilityWebsite").value
          : ""
      ).trim();

    if(
      !companyName ||
      !activity ||
      !presentation
    ){
      alert(
        "Renseignez au minimum le nom, l’activité et la présentation."
      );
      return;
    }

    if(
      email &&
      !email.includes("@")
    ){
      alert(
        "L’adresse e-mail renseignée n’est pas valide."
      );
      return;
    }

    const data = {
      companyName:companyName,
      activity:activity,
      presentation:presentation,
      knowHow:knowHow,
      services:services,
      phone:phone,
      email:email,
      website:website,

      quoteEnabled:
        !!(
          getElement("correctedVisibilityQuote") &&
          getElement("correctedVisibilityQuote").checked
        ),

      recruitmentEnabled:
        !!(
          getElement("correctedVisibilityRecruitment") &&
          getElement("correctedVisibilityRecruitment").checked
        ),

      patronageEnabled:
        !!(
          getElement("correctedVisibilityPatronage") &&
          getElement("correctedVisibilityPatronage").checked
        ),

      newsEnabled:
        !!(
          getElement("correctedVisibilityNews") &&
          getElement("correctedVisibilityNews").checked
        ),

      updatedAt:
        Date.now(),

      updatedAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )
    };

    saveVisibilityData(
      data
    );

    const status =
      getElement(
        "correctedVisibilityStatus"
      );

    if(status){
      status.textContent =
        "Présentation enregistrée le " +
        data.updatedAtFr +
        ".";
    }

    alert(
      "La présentation de l’entreprise est enregistrée."
    );
  }

  function openCorrectedVisibilityPreview(){

    const data =
      loadVisibilityData();

    if(
      !data.companyName ||
      !data.presentation
    ){
      alert(
        "Enregistrez d’abord la présentation de l’entreprise."
      );
      return;
    }

    app.renderModal(
      data.companyName,
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            ${escapeValue(
              data.companyName
            )}
          </strong>

          <br><br>

          <strong>
            ${escapeValue(
              data.activity || ""
            )}
          </strong>
        </div>

        <div class="box">
          ${escapeValue(
            data.presentation
          )}
        </div>

        ${
          data.knowHow
            ? `
              <div class="box">

                <strong>
                  Métiers et savoir-faire
                </strong>

                <br><br>

                ${escapeValue(
                  data.knowHow
                )}
              </div>
            `
            : ""
        }

        ${
          data.services
            ? `
              <div class="box">

                <strong>
                  Services proposés
                </strong>

                <br><br>

                ${escapeValue(
                  data.services
                )}
              </div>
            `
            : ""
        }

        ${
          data.phone ||
          data.email ||
          data.website
            ? `
              <div class="box">

                <strong>
                  Contact
                </strong>

                <br><br>

                ${
                  data.phone
                    ? `
                      Téléphone :
                      ${escapeValue(
                        data.phone
                      )}
                      <br>
                    `
                    : ""
                }

                ${
                  data.email
                    ? `
                      E-mail :
                      ${escapeValue(
                        data.email
                      )}
                      <br>
                    `
                    : ""
                }

                ${
                  data.website
                    ? `
                      Site Internet :
                      ${escapeValue(
                        data.website
                      )}
                    `
                    : ""
                }
              </div>
            `
            : ""
        }

        <div
          style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
          ">

          ${
            data.quoteEnabled
              ? `
                <button
                  class="choiceBtn"
                  type="button">
                  Demander un devis
                </button>
              `
              : ""
          }

          ${
            data.recruitmentEnabled
              ? `
                <button
                  id="correctedPreviewEmploymentBtn"
                  class="choiceBtn"
                  type="button">
                  Voir les recrutements
                </button>
              `
              : ""
          }

          ${
            data.patronageEnabled
              ? `
                <button
                  id="correctedPreviewMecenatBtn"
                  class="choiceBtn"
                  type="button">
                  Voir l’engagement en mécénat
                </button>
              `
              : ""
          }
        </div>
      `
    );

    window.setTimeout(function(){

      const employmentButton =
        getElement(
          "correctedPreviewEmploymentBtn"
        );

      const mecenatButton =
        getElement(
          "correctedPreviewMecenatBtn"
        );

      if(employmentButton){
        employmentButton.onclick = function(){
          app.openScreen(
            "emploi"
          );
        };
      }

      if(mecenatButton){
        mecenatButton.onclick = function(){
          app.openScreen(
            "mecenat"
          );
        };
      }

    },0);
  }

  app.registerScreen(
    "visibilite",
    openCorrectedVisibilityPage
  );

  app.openCorrectedVisibilityPage =
    openCorrectedVisibilityPage;

  app.openCorrectedVisibilityPreview =
    openCorrectedVisibilityPreview;

  console.log(
    "✅ Page Visibilité complète corrigée"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 14
   IA ENTREPRISE
   ANALYSE DE LA QUESTION ET ORIENTATION UTILE
   ========================================================== */

(function improveEntrepriseArtificialIntelligence(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  if(
    window.BOCITEART_ENTREPRISE_AI_14
  ){
    return;
  }

  window.BOCITEART_ENTREPRISE_AI_14 =
    true;

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return app.safeEscape(value);
  }

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /[’']/g,
        " "
      )
      .replace(
        /[^a-z0-9\s-]/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();
  }

  function containsAny(
    text,
    words
  ){

    return words.some(
      function(word){

        return text.includes(
          normalizeText(word)
        );
      }
    );
  }

  function analyseQuestion(
    question
  ){

    const text =
      normalizeText(
        question
      );

    if(
      containsAny(
        text,
        [
          "emploi",
          "recrutement",
          "recruter",
          "personnel",
          "salarie",
          "candidat",
          "cv",
          "stage",
          "alternance",
          "apprenti",
          "poste",
          "embauche"
        ]
      )
    ){

      return {
        category:"emploi",

        title:
          "Recherche de personnel ou d’emploi",

        answer:
          "Votre demande concerne l’emploi. " +
          "Bo'CitéArt peut vous orienter vers les offres locales, " +
          "les candidatures reçues ou l’envoi d’un CV spontané.",

        primaryLabel:
          "Ouvrir la rubrique Emploi",

        primaryAction:
          function(){
            app.openScreen(
              "emploi"
            );
          },

        secondaryLabel:
          "Consulter l’historique des candidatures",

        secondaryAction:
          function(){

            if(
              typeof app.openCandidateHistory ===
              "function"
            ){
              app.openCandidateHistory();
              return;
            }

            app.openScreen(
              "direction"
            );
          }
      };
    }

    if(
      containsAny(
        text,
        [
          "electricien",
          "plombier",
          "macon",
          "carreleur",
          "menuisier",
          "peintre",
          "couvreur",
          "avocat",
          "comptable",
          "transporteur",
          "nettoyage",
          "fournisseur",
          "sous traitant",
          "sous-traitant",
          "prestataire",
          "professionnel",
          "entreprise",
          "commerce",
          "partenaire"
        ]
      )
    ){

      return {
        category:"recherche_professionnelle",

        title:
          "Recherche d’une entreprise ou d’un professionnel",

        answer:
          "Bo'CitéArt commence par rechercher les entreprises, " +
          "les commerces et les compétences présents dans la commune. " +
          "La recherche peut ensuite être élargie selon le besoin.",

        primaryLabel:
          "Rechercher un professionnel",

        primaryAction:
          function(){

            if(
              typeof app.openProfessionalDirectory ===
              "function"
            ){
              app.openProfessionalDirectory({
                keyword:question
              });

              return;
            }

            app.openScreen(
              "annuaire"
            );
          },

        secondaryLabel:
          "Voir les entreprises et commerces locaux",

        secondaryAction:
          function(){

            if(
              typeof app.openLocalDirectory ===
              "function"
            ){
              app.openLocalDirectory();
              return;
            }

            if(
              typeof app.openCorrectedDirectory ===
              "function"
            ){
              app.openCorrectedDirectory();
              return;
            }

            app.openScreen(
              "annuaire"
            );
          }
      };
    }

    if(
      containsAny(
        text,
        [
          "charge",
          "charges",
          "electricite",
          "gaz",
          "assurance",
          "mutuelle",
          "telephone",
          "telephonie",
          "internet",
          "fibre",
          "vehicule",
          "flotte",
          "carburant",
          "nettoyage",
          "vitre",
          "maintenance",
          "alarme",
          "formation",
          "mutualisation",
          "economiser",
          "economie",
          "reduire"
        ]
      )
    ){

      return {
        category:"charges",

        title:
          "Réduction des charges",

        answer:
          "Votre demande concerne une charge professionnelle " +
          "ou une prestation pouvant être mutualisée. " +
          "Vous pouvez consulter les regroupements ouverts, " +
          "indiquer votre intérêt et suivre les propositions reçues.",

        primaryLabel:
          "Voir les mutualisations",

        primaryAction:
          function(){
            app.openScreen(
              "mutualisation"
            );
          },

        secondaryLabel:
          "Ouvrir le Tableau de Direction",

        secondaryAction:
          function(){

            if(
              typeof app.openPrivateEntrepriseAccess ===
              "function"
            ){
              app.openPrivateEntrepriseAccess();
              return;
            }

            app.openScreen(
              "direction"
            );
          }
      };
    }

    if(
      containsAny(
        text,
        [
          "visibilite",
          "faire connaitre",
          "publicite",
          "communication",
          "presentation",
          "savoir faire",
          "metier",
          "faire connaitre mon entreprise",
          "clients",
          "bouche a oreille"
        ]
      )
    ){

      return {
        category:"visibilite",

        title:
          "Visibilité de l’entreprise",

        answer:
          "Votre demande concerne la connaissance de l’entreprise " +
          "dans la ville. Commencez par présenter clairement vos métiers, " +
          "vos services, votre savoir-faire et votre localisation.",

        primaryLabel:
          "Faire connaître mon entreprise",

        primaryAction:
          function(){
            app.openScreen(
              "visibilite"
            );
          },

        secondaryLabel:
          "Voir les acteurs locaux",

        secondaryAction:
          function(){

            if(
              typeof app.openLocalDirectory ===
              "function"
            ){
              app.openLocalDirectory();
              return;
            }

            app.openScreen(
              "annuaire"
            );
          }
      };
    }

    if(
      containsAny(
        text,
        [
          "mecenat",
          "don",
          "soutenir",
          "projet local",
          "culture",
          "education",
          "sport",
          "patrimoine",
          "solidarite",
          "environnement",
          "interet general"
        ]
      )
    ){

      return {
        category:"mecenat",

        title:
          "Mécénat et projets locaux",

        answer:
          "Votre demande concerne le mécénat. " +
          "Vous pouvez découvrir les projets locaux, " +
          "choisir une forme de contribution " +
          "et préparer votre réflexion dans l’espace privé de l’entreprise.",

        primaryLabel:
          "Découvrir le mécénat",

        primaryAction:
          function(){
            app.openScreen(
              "mecenat"
            );
          },

        secondaryLabel:
          "Découvrir les projets locaux",

        secondaryAction:
          function(){

            if(
              typeof app.openCorrectedMecenatProjects ===
              "function"
            ){
              app.openCorrectedMecenatProjects();
              return;
            }

            if(
              typeof app.openMecenatProjects ===
              "function"
            ){
              app.openMecenatProjects();
              return;
            }

            app.openScreen(
              "mecenat"
            );
          }
      };
    }

    if(
      containsAny(
        text,
        [
          "transmission",
          "reprise",
          "repreneur",
          "vendre entreprise",
          "succession",
          "continuité",
          "continuite",
          "avenir entreprise",
          "valorisation",
          "valeur entreprise"
        ]
      )
    ){

      return {
        category:"perennite",

        title:
          "Pérennité et transmission",

        answer:
          "Votre demande concerne l’avenir de l’entreprise. " +
          "Vous pouvez préparer la transmission, la reprise, " +
          "la continuité de l’activité et votre prochaine action.",

        primaryLabel:
          "Préparer l’avenir de l’entreprise",

        primaryAction:
          function(){
            app.openScreen(
              "perennite"
            );
          },

        secondaryLabel:
          "Préparer un plan de développement",

        secondaryAction:
          function(){
            app.openScreen(
              "developpement"
            );
          }
      };
    }

    if(
      containsAny(
        text,
        [
          "developpement",
          "developper",
          "nouveau client",
          "nouveaux clients",
          "opportunite",
          "partenariat",
          "partenaire",
          "fournisseur",
          "sous traitant",
          "sous-traitant",
          "croissance"
        ]
      )
    ){

      return {
        category:"developpement",

        title:
          "Développement de l’entreprise",

        answer:
          "Votre demande concerne le développement de l’activité. " +
          "Commencez par regarder les ressources, entreprises, " +
          "fournisseurs et partenaires présents dans votre ville.",

        primaryLabel:
          "Ouvrir la rubrique Développement",

        primaryAction:
          function(){
            app.openScreen(
              "developpement"
            );
          },

        secondaryLabel:
          "Voir les acteurs locaux",

        secondaryAction:
          function(){

            if(
              typeof app.openLocalDirectory ===
              "function"
            ){
              app.openLocalDirectory();
              return;
            }

            app.openScreen(
              "annuaire"
            );
          }
      };
    }

    return {
      category:"general",

      title:
        "Recherche Bo'CitéArt",

      answer:
        "Votre demande a bien été analysée. " +
        "Bo'CitéArt vous propose de commencer par les ressources " +
        "présentes dans votre commune, puis d’élargir la recherche " +
        "si aucune solution locale ne correspond.",

      primaryLabel:
        "Rechercher un professionnel",

      primaryAction:
        function(){

          if(
            typeof app.openProfessionalDirectory ===
            "function"
          ){
            app.openProfessionalDirectory({
              keyword:question
            });

            return;
          }

          app.openScreen(
            "annuaire"
          );
        },

      secondaryLabel:
        "Voir les entreprises et commerces locaux",

      secondaryAction:
        function(){

          if(
            typeof app.openLocalDirectory ===
            "function"
          ){
            app.openLocalDirectory();
            return;
          }

          app.openScreen(
            "annuaire"
          );
        }
    };
  }

    app.analyseEntrepriseQuestion =
    analyseQuestion;

  console.log(
    "✅ IA Entreprise améliorée et orientée"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 15
   PÉRENNITÉ • TRANSMISSION • REPRISE • CONTINUITÉ
   ========================================================== */

(function correctEntrepriseSustainabilityPage(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return app.safeEscape(value);
  }

  function loadData(){

    if(
      typeof app.loadSustainabilityData ===
      "function"
    ){
      const data =
        app.loadSustainabilityData();

      if(
        data &&
        typeof data === "object"
      ){
        return data;
      }
    }

    try{

      const raw =
        localStorage.getItem(
          "bociteart_entreprise_sustainability_v1"
        );

      const parsed =
        raw ? JSON.parse(raw) : null;

      return parsed || {};

    }catch(error){

      return {};
    }
  }

  function saveData(data){

    if(
      typeof app.saveSustainabilityData ===
      "function"
    ){
      app.saveSustainabilityData(
        data
      );

      return;
    }

    try{

      localStorage.setItem(
        "bociteart_entreprise_sustainability_v1",
        JSON.stringify(data)
      );

    }catch(error){

      console.warn(
        "Enregistrement du projet de pérennité impossible :",
        error
      );
    }
  }

  function getProjectLabel(value){

    const labels = {

      transmission_familiale:
        "Transmission familiale",

      reprise_salarie:
        "Reprise par un salarié",

      vente_exterieure:
        "Vente à un repreneur extérieur",

      cession_progressive:
        "Cession progressive",

      succession:
        "Préparation de la succession",

      continuite:
        "Assurer la continuité de l’activité",

      indecis:
        "Projet encore indécis"
    };

    return labels[value] ||
      "Non renseigné";
  }

  function getBuyerLabel(value){

    const labels = {

      enfant:
        "Enfant ou membre de la famille",

      salarie:
        "Salarié",

      associe:
        "Associé",

      exterieur:
        "Repreneur extérieur",

      inconnu:
        "Non déterminé"
    };

    return labels[value] ||
      "Non renseigné";
  }

  function openCorrectedSustainabilityPage(){

    const saved =
      loadData();

    app.renderModal(
      "Préparez l’avenir de votre entreprise",
      `
        <button
          id="correctedSustainabilityBackBtn"
          class="choiceBtn"
          type="button"
          style="margin-bottom:14px;">
          Retour
        </button>

        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            Préparez l’avenir
            de votre entreprise
          </strong>

          <br><br>

          Votre entreprise possède
          une histoire,
          des clients,
          des salariés,
          un savoir-faire
          et une valeur.

          <br><br>

          Pourtant,
          la transmission
          ou la continuité
          est souvent préparée trop tard.
        </div>

        <div class="box">

          <strong>
            À qui souhaiteriez-vous
            transmettre votre entreprise ?
          </strong>

          <br><br>

          À vos enfants,
          à un salarié,
          à un associé
          ou à un repreneur extérieur ?

          <br><br>

          Même si vous ne souhaitez pas
          transmettre immédiatement,
          commencer à réfléchir
          ne vous engage à rien.
        </div>

        <div class="box">

          <strong>
            Combien vaut réellement votre entreprise ?
          </strong>

          <br><br>

          Le chiffre d’affaires
          ne suffit pas
          pour déterminer sa valeur.

          <br><br>

          Il faut également regarder :

          <br><br>

          • la rentabilité ;<br>
          • la clientèle ;<br>
          • les contrats ;<br>
          • l’équipe ;<br>
          • le matériel ;<br>
          • l’organisation ;<br>
          • la réputation ;<br>
          • le savoir-faire ;<br>
          • la dépendance au dirigeant.
        </div>

        <div class="box">

          <strong>
            Faites d’abord connaître votre entreprise
          </strong>

          <br><br>

          Chaque année,
          des entreprises disparaissent
          faute de repreneur.

          <br><br>

          Parfois simplement
          parce que personne
          ne connaissait réellement
          leur activité,
          leurs métiers
          ou leur valeur locale.

          <br><br>

          Faire connaître votre entreprise aujourd’hui,
          c’est aussi préparer sa continuité demain.
        </div>

        <div class="box">

          <strong>
            Les premiers interlocuteurs possibles
          </strong>

          <br><br>

          Vous pouvez commencer par échanger
          avec :

          <br><br>

          • votre expert-comptable ;<br>
          • votre avocat ;<br>
          • votre notaire ;<br>
          • la CCI ;<br>
          • la CMA ;<br>
          • votre organisation professionnelle.

          <br><br>

          Les consulter
          ne vous oblige pas
          à vendre ou à transmettre.
        </div>

        <div
          style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
          ">

          <button
            id="correctedSustainabilityVisibilityBtn"
            class="choiceBtn"
            type="button">
            Faire connaître mon entreprise
          </button>

          <button
            id="correctedSustainabilityExpertBtn"
            class="choiceBtn"
            type="button">
            Rechercher un expert local
          </button>

          <button
            id="correctedSustainabilityDevelopmentBtn"
            class="choiceBtn"
            type="button">
            Préparer un plan d’action
          </button>
        </div>

        <div
          class="box"
          style="
            margin-top:16px;
            border-left:6px solid #2f5d46;
          ">

          <strong style="font-size:17px;">
            Mon projet de transmission
            ou de continuité
          </strong>

          <br><br>

          Ces informations restent réservées
          à l’entreprise.
        </div>

        <label style="font-weight:900;">
          Nom de l’entreprise
        </label>

        <input
          id="correctedSustainabilityCompanyName"
          class="miniField"
          type="text"
          value="${escapeValue(
            saved.companyName || ""
          )}"
          placeholder="Nom de l’entreprise">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Quel projet envisagez-vous ?
        </label>

        <select
          id="correctedSustainabilityProjectType"
          class="miniField">

          <option value="">
            Choisir
          </option>

          <option value="transmission_familiale">
            Transmission familiale
          </option>

          <option value="reprise_salarie">
            Reprise par un salarié
          </option>

          <option value="vente_exterieure">
            Vente à un repreneur extérieur
          </option>

          <option value="cession_progressive">
            Cession progressive
          </option>

          <option value="succession">
            Préparation de la succession
          </option>

          <option value="continuite">
            Assurer la continuité de l’activité
          </option>

          <option value="indecis">
            Je ne sais pas encore
          </option>
        </select>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Repreneur envisagé
        </label>

        <select
          id="correctedSustainabilityBuyer"
          class="miniField">

          <option value="">
            Choisir
          </option>

          <option value="enfant">
            Enfant ou membre de la famille
          </option>

          <option value="salarie">
            Salarié
          </option>

          <option value="associe">
            Associé
          </option>

          <option value="exterieur">
            Repreneur extérieur
          </option>

          <option value="inconnu">
            Je ne sais pas encore
          </option>
        </select>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Échéance envisagée
        </label>

        <input
          id="correctedSustainabilityDeadline"
          class="miniField"
          type="date"
          value="${escapeValue(
            saved.estimatedDeadline || ""
          )}">

        <div
          class="box"
          style="margin-top:12px;">

          <strong>
            Démarches déjà engagées
          </strong>

          <label class="miniCheck">

            <input
              id="correctedSustainabilityAccountant"
              type="checkbox"
              ${
                saved.accountantContacted
                  ? "checked"
                  : ""
              }>

            <span>
              J’en ai parlé
              à mon expert-comptable
            </span>
          </label>

          <label class="miniCheck">

            <input
              id="correctedSustainabilityChamber"
              type="checkbox"
              ${
                saved.chamberContacted
                  ? "checked"
                  : ""
              }>

            <span>
              J’ai contacté la CCI,
              la CMA
              ou une organisation professionnelle
            </span>
          </label>

          <label class="miniCheck">

            <input
              id="correctedSustainabilityLawyer"
              type="checkbox"
              ${
                saved.lawyerContacted
                  ? "checked"
                  : ""
              }>

            <span>
              J’ai consulté un avocat
            </span>
          </label>

          <label class="miniCheck">

            <input
              id="correctedSustainabilityNotary"
              type="checkbox"
              ${
                saved.notaryContacted
                  ? "checked"
                  : ""
              }>

            <span>
              J’ai consulté un notaire
            </span>
          </label>

          <label class="miniCheck">

            <input
              id="correctedSustainabilityValuation"
              type="checkbox"
              ${
                saved.valuationStarted
                  ? "checked"
                  : ""
              }>

            <span>
              Une première valorisation
              a été engagée
            </span>
          </label>
        </div>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Notes confidentielles
        </label>

        <textarea
          id="correctedSustainabilityNotes"
          class="miniField"
          style="min-height:110px;"
          placeholder="Indiquez les éléments utiles à votre réflexion.">${escapeValue(
            saved.confidentialNotes || ""
          )}</textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Prochaine action
        </label>

        <textarea
          id="correctedSustainabilityNextAction"
          class="miniField"
          style="min-height:90px;"
          placeholder="Exemple : prendre rendez-vous avec l’expert-comptable.">${escapeValue(
            saved.nextAction || ""
          )}</textarea>

        <button
          id="correctedSustainabilitySaveBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Enregistrer mon projet
        </button>

        <button
          id="correctedSustainabilitySummaryBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
            background:#fff;
          ">
          Consulter mon récapitulatif
        </button>

        <div
          id="correctedSustainabilityStatus"
          class="muted"
          style="margin-top:10px;">
        </div>
      `
    );

    window.setTimeout(function(){

      const backButton =
        getElement(
          "correctedSustainabilityBackBtn"
        );

      const visibilityButton =
        getElement(
          "correctedSustainabilityVisibilityBtn"
        );

      const expertButton =
        getElement(
          "correctedSustainabilityExpertBtn"
        );

      const developmentButton =
        getElement(
          "correctedSustainabilityDevelopmentBtn"
        );

      const saveButton =
        getElement(
          "correctedSustainabilitySaveBtn"
        );

      const summaryButton =
        getElement(
          "correctedSustainabilitySummaryBtn"
        );

      if(backButton){
        backButton.onclick = function(){
          app.openHome();
        };
      }

      if(visibilityButton){
        visibilityButton.onclick = function(){
          app.openScreen(
            "visibilite"
          );
        };
      }

      if(expertButton){
        expertButton.onclick = function(){

          if(
            typeof app.openLocalDirectory ===
            "function"
          ){
            app.openLocalDirectory();
            return;
          }

          app.openScreen(
            "annuaire"
          );
        };
      }

      if(developmentButton){
        developmentButton.onclick = function(){
          app.openScreen(
            "developpement"
          );
        };
      }

      if(saveButton){
        saveButton.onclick =
          saveCorrectedSustainability;
      }

      if(summaryButton){
        summaryButton.onclick =
          openCorrectedSustainabilitySummary;
      }

      const projectSelect =
        getElement(
          "correctedSustainabilityProjectType"
        );

      const buyerSelect =
        getElement(
          "correctedSustainabilityBuyer"
        );

      if(
        projectSelect &&
        saved.projectType
      ){
        projectSelect.value =
          saved.projectType === "continuité"
            ? "continuite"
            : saved.projectType;
      }

      if(
        buyerSelect &&
        saved.preferredBuyer
      ){
        buyerSelect.value =
          saved.preferredBuyer;
      }

      const status =
        getElement(
          "correctedSustainabilityStatus"
        );

      if(
        status &&
        saved.updatedAtFr
      ){
        status.textContent =
          "Dernière mise à jour : " +
          saved.updatedAtFr +
          ".";
      }

    },0);
  }

  function saveCorrectedSustainability(){

    const companyName =
      String(
        getElement(
          "correctedSustainabilityCompanyName"
        )
          ? getElement(
              "correctedSustainabilityCompanyName"
            ).value
          : ""
      ).trim();

    const projectType =
      String(
        getElement(
          "correctedSustainabilityProjectType"
        )
          ? getElement(
              "correctedSustainabilityProjectType"
            ).value
          : ""
      ).trim();

    const preferredBuyer =
      String(
        getElement(
          "correctedSustainabilityBuyer"
        )
          ? getElement(
              "correctedSustainabilityBuyer"
            ).value
          : ""
      ).trim();

    const estimatedDeadline =
      String(
        getElement(
          "correctedSustainabilityDeadline"
        )
          ? getElement(
              "correctedSustainabilityDeadline"
            ).value
          : ""
      ).trim();

    const confidentialNotes =
      String(
        getElement(
          "correctedSustainabilityNotes"
        )
          ? getElement(
              "correctedSustainabilityNotes"
            ).value
          : ""
      ).trim();

    const nextAction =
      String(
        getElement(
          "correctedSustainabilityNextAction"
        )
          ? getElement(
              "correctedSustainabilityNextAction"
            ).value
          : ""
      ).trim();

    if(!companyName){

      alert(
        "Indiquez le nom de l’entreprise."
      );

      return;
    }

    if(!projectType){

      alert(
        "Choisissez le projet envisagé."
      );

      return;
    }

    if(!nextAction){

      alert(
        "Indiquez au moins votre prochaine action."
      );

      return;
    }

    const data = {

      companyName:
        companyName,

      projectType:
        projectType,

      preferredBuyer:
        preferredBuyer,

      estimatedDeadline:
        estimatedDeadline,

      accountantContacted:
        !!(
          getElement(
            "correctedSustainabilityAccountant"
          ) &&
          getElement(
            "correctedSustainabilityAccountant"
          ).checked
        ),

      chamberContacted:
        !!(
          getElement(
            "correctedSustainabilityChamber"
          ) &&
          getElement(
            "correctedSustainabilityChamber"
          ).checked
        ),

      lawyerContacted:
        !!(
          getElement(
            "correctedSustainabilityLawyer"
          ) &&
          getElement(
            "correctedSustainabilityLawyer"
          ).checked
        ),

      notaryContacted:
        !!(
          getElement(
            "correctedSustainabilityNotary"
          ) &&
          getElement(
            "correctedSustainabilityNotary"
          ).checked
        ),

      valuationStarted:
        !!(
          getElement(
            "correctedSustainabilityValuation"
          ) &&
          getElement(
            "correctedSustainabilityValuation"
          ).checked
        ),

      confidentialNotes:
        confidentialNotes,

      nextAction:
        nextAction,

      status:
        "en_cours",

      updatedAt:
        Date.now(),

      updatedAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )
    };

    saveData(
      data
    );

    const status =
      getElement(
        "correctedSustainabilityStatus"
      );

    if(status){
      status.textContent =
        "Projet enregistré le " +
        data.updatedAtFr +
        ".";
    }

    alert(
      "Votre projet est enregistré dans l’espace privé de l’entreprise."
    );
  }

  function openCorrectedSustainabilitySummary(){

    const data =
      loadData();

    if(
      !data.companyName ||
      !data.projectType
    ){

      alert(
        "Aucun projet n’est encore enregistré."
      );

      return;
    }

    const steps = [];

    if(data.accountantContacted){
      steps.push(
        "Expert-comptable contacté"
      );
    }

    if(data.chamberContacted){
      steps.push(
        "CCI, CMA ou organisation professionnelle contactée"
      );
    }

    if(data.lawyerContacted){
      steps.push(
        "Avocat consulté"
      );
    }

    if(data.notaryContacted){
      steps.push(
        "Notaire consulté"
      );
    }

    if(data.valuationStarted){
      steps.push(
        "Valorisation engagée"
      );
    }

    app.renderModal(
      "Mon projet de pérennité",
      `
        <button
          id="correctedSustainabilitySummaryBackBtn"
          class="choiceBtn"
          type="button"
          style="margin-bottom:14px;">
          Retour
        </button>

        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            ${escapeValue(
              data.companyName
            )}
          </strong>
        </div>

        <div class="box">

          <strong>
            Projet envisagé
          </strong>

          <br><br>

          ${escapeValue(
            getProjectLabel(
              data.projectType
            )
          )}
        </div>

        <div class="box">

          <strong>
            Repreneur envisagé
          </strong>

          <br><br>

          ${escapeValue(
            getBuyerLabel(
              data.preferredBuyer
            )
          )}
        </div>

        <div class="box">

          <strong>
            Échéance envisagée
          </strong>

          <br><br>

          ${escapeValue(
            data.estimatedDeadline ||
            "Non renseignée"
          )}
        </div>

        <div class="box">

          <strong>
            Démarches engagées
          </strong>

          <br><br>

          ${
            steps.length
              ? steps
                  .map(function(step){
                    return escapeValue(
                      step
                    );
                  })
                  .join("<br>")
              : "Aucune démarche renseignée"
          }
        </div>

        <div class="box">

          <strong>
            Notes confidentielles
          </strong>

          <br><br>

          ${escapeValue(
            data.confidentialNotes ||
            "Aucune note"
          )}
        </div>

        <div class="box">

          <strong>
            Prochaine action
          </strong>

          <br><br>

          ${escapeValue(
            data.nextAction ||
            "Non renseignée"
          )}
        </div>

        <div class="box">

          <strong>
            Dernière mise à jour
          </strong>

          <br><br>

          ${escapeValue(
            data.updatedAtFr ||
            ""
          )}
        </div>
      `
    );

    window.setTimeout(function(){

      const backButton =
        getElement(
          "correctedSustainabilitySummaryBackBtn"
        );

      if(backButton){
        backButton.onclick =
          openCorrectedSustainabilityPage;
      }

    },0);
  }

  app.registerScreen(
    "perennite",
    openCorrectedSustainabilityPage
  );

  app.openCorrectedSustainabilityPage =
    openCorrectedSustainabilityPage;

  app.openCorrectedSustainabilitySummary =
    openCorrectedSustainabilitySummary;

  console.log(
    "✅ Page Pérennité corrigée"
  );

})();

/* ==========================================================
   BO'CITÉART
   CORRECTIF 16
   DÉBLOCAGE DÉFINITIF DES BANDES DÉFILANTES
   ========================================================== */

(function definitivelyRepairEntrepriseBands(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  if(
    window.BOCITEART_ENTREPRISE_BANDS_FINAL_16
  ){
    return;
  }

  window.BOCITEART_ENTREPRISE_BANDS_FINAL_16 =
    true;

function openDirectly(screenName){

  if(!screenName){
    return;
  }

  if(
    typeof app.openScreen ===
    "function"
  ){
    app.openScreen(
      screenName
    );

    return;
  }

  const renderer =
    app.screens &&
    app.screens[screenName];

  if(
    typeof renderer ===
    "function"
  ){
    renderer();
    return;
  }

  alert(
    "Cette rubrique est momentanément indisponible."
  );
}
  /*
    Le gestionnaire est placé sur WINDOW
    en phase de capture.

    Il agit avant les anciens gestionnaires
    installés sur DOCUMENT qui bloquaient les clics.
  */

  window.addEventListener(
    "click",
    function(event){

      const target =
        event.target;

      if(
        !target ||
        typeof target.closest !==
        "function"
      ){
        return;
      }

      const button =
        target.closest(
          "#entrepriseHomeBands " +
          "[data-entreprise-screen]," +

          ".entrepriseUnifiedBands " +
          "[data-unified-entreprise-screen]," +

          ".entrepriseCorrectionBands " +
          "[data-corrected-screen]," +

          "[data-final-entreprise-screen]"
        );

      if(!button){
        return;
      }

      const screenName =
        button.getAttribute(
          "data-entreprise-screen"
        ) ||
        button.getAttribute(
          "data-unified-entreprise-screen"
        ) ||
        button.getAttribute(
          "data-corrected-screen"
        ) ||
        button.getAttribute(
          "data-final-entreprise-screen"
        );

      if(!screenName){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation ===
        "function"
      ){
        event.stopImmediatePropagation();
      }

      window.requestAnimationFrame(
        function(){

          openDirectly(
            screenName
          );
        }
      );

    },
    true
  );

  /*
    Rend explicitement les bandes cliquables.
  */

  function reinforceButtons(){

    document
      .querySelectorAll(
        "#entrepriseHomeBands " +
        "[data-entreprise-screen]," +

        ".entrepriseUnifiedBands " +
        "[data-unified-entreprise-screen]," +

        ".entrepriseCorrectionBands " +
        "[data-corrected-screen]"
      )
      .forEach(function(button){

        button.style.pointerEvents =
          "auto";

        button.style.cursor =
          "pointer";

        button.disabled =
          false;

        const text =
          button.querySelector(
            ".entrepriseBandText," +
            ".entrepriseUnifiedBandText," +
            ".entrepriseCorrectionBandText"
          );

        if(text){
          text.style.pointerEvents =
            "none";
        }
      });
  }

  const observer =
    new MutationObserver(
      function(){

        window.setTimeout(
          reinforceButtons,
          30
        );
      }
    );

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  window.setTimeout(
    reinforceButtons,
    100
  );

  console.log(
    "✅ Bandes Entreprise définitivement débloquées"
  );

})();

/* ==========================================================
   BO'CITÉART — EMPLOI PUBLIC
   PRÉSENTATION COMPLÈTE AVANT LA LISTE DES OFFRES
   ========================================================== */

(function completePublicEmploymentPage(){

  "use strict";

  const app = window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module introuvable."
    );
    return;
  }

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getModalContent(){

    return document.querySelector(
      ".modal-content," +
      ".modalContent," +
      "#modalContent," +
      ".modal-body," +
      ".modalBody"
    );
  }

  function getModalTitle(){

    const title =
      document.querySelector(
        ".modal-title," +
        ".modalTitle," +
        "#modalTitle," +
        ".modal-header h1," +
        ".modal-header h2," +
        ".modalHeader h1," +
        ".modalHeader h2"
      );

    return title
      ? normalizeText(title.textContent)
      : "";
  }

  function applyEmploymentPresentation(){

    const modal = getModalContent();

    if(!modal){
      return;
    }

    const title = getModalTitle();

    if(
      !title.includes(
        "toutes les offres d emploi"
      )
    ){
      return;
    }

    if(
      modal.querySelector(
        "#bocitePublicEmploymentIntroduction"
      )
    ){
      return;
    }

    /*
      Le retour doit revenir à la page Emploi,
      et non directement à l’accueil Entreprise.
    */

    const oldReturnButton =
      Array.from(
        modal.querySelectorAll("button")
      )
      .find(function(button){

        const text =
          normalizeText(
            button.textContent
          );

        return text.includes(
          "retour a l espace entreprise"
        );
      });

    if(oldReturnButton){

      oldReturnButton.textContent =
        "← Retour à la page Emploi";

      oldReturnButton.onclick =
        function(event){

          event.preventDefault();
          event.stopPropagation();

          if(
            typeof app.openScreen ===
            "function"
          ){
            app.openScreen("emploi");
          }
        };
    }

    const introduction =
      document.createElement("div");

    introduction.id =
      "bocitePublicEmploymentIntroduction";

    introduction.innerHTML = `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:19px;">
          Trouvez un emploi,
          un stage
          ou une alternance près de chez vous
        </strong>

        <br><br>

        Les entreprises de votre ville
        peuvent publier ici leurs besoins
        en recrutement.

        <br><br>

        Vous pouvez consulter gratuitement
        les offres disponibles
        et transmettre votre candidature
        directement à l’entreprise concernée.
      </div>

      <div class="box">

        <strong style="font-size:17px;">
          Aucune offre ne correspond actuellement
          à votre recherche ?
        </strong>

        <br><br>

        Vous pouvez malgré tout
        déposer une candidature spontanée.

        <br><br>

        Votre CV pourra être adressé
        à une entreprise de votre ville,
        même si elle n’a pas encore publié d’offre.

        <br><br>

        Les candidatures restent conservées
        dans l’espace privé de l’entreprise,
        afin qu’elle puisse retrouver votre profil
        lorsqu’un nouveau besoin apparaît.
      </div>

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-bottom:16px;
        ">

        <button
          id="publicEmploymentDirectoryBtn"
          class="choiceBtn"
          type="button">
          Voir les entreprises de ma ville
        </button>

        <button
          id="publicEmploymentSpontaneousBtn"
          class="choiceBtn"
          type="button">
          Envoyer une candidature spontanée
        </button>

        <button
          id="publicEmploymentReturnBtn"
          class="choiceBtn"
          type="button">
          Retour à la page Emploi
        </button>
      </div>

      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:17px;">
          Offres actuellement disponibles
        </strong>

        <br><br>

        Les offres publiées par les entreprises
        apparaissent ci-dessous.
      </div>
    `;

    /*
      On place la présentation avant
      le message indiquant qu’aucune offre n’existe.
    */

    const emptyOfferBox =
      Array.from(
        modal.querySelectorAll(".box")
      )
      .find(function(box){

        return normalizeText(
          box.textContent
        ).includes(
          "aucune offre d emploi n est actuellement disponible"
        );
      });

    if(emptyOfferBox){
      emptyOfferBox.before(
        introduction
      );
    }else{
      modal.appendChild(
        introduction
      );
    }

    const directoryButton =
      document.getElementById(
        "publicEmploymentDirectoryBtn"
      );

    const spontaneousButton =
      document.getElementById(
        "publicEmploymentSpontaneousBtn"
      );

    const returnButton =
      document.getElementById(
        "publicEmploymentReturnBtn"
      );

    if(directoryButton){

      directoryButton.onclick =
        function(){

          if(
            typeof app.openLocalDirectory ===
            "function"
          ){
            app.openLocalDirectory();
            return;
          }

          if(
            typeof app.openCorrectedDirectory ===
            "function"
          ){
            app.openCorrectedDirectory();
            return;
          }

          app.openScreen("annuaire_local");
        };
    }

    if(spontaneousButton){

      spontaneousButton.onclick =
        function(){

          if(
            typeof app.openLocalDirectory ===
            "function"
          ){
            app.openLocalDirectory();
            return;
          }

          app.openScreen("annuaire_local");
        };
    }

    if(returnButton){

      returnButton.onclick =
        function(){

          app.openScreen("emploi");
        };
    }
  }

  let timer = null;

  const observer =
    new MutationObserver(function(){

      window.clearTimeout(timer);

      timer =
        window.setTimeout(
          applyEmploymentPresentation,
          60
        );
    });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  window.setTimeout(
    applyEmploymentPresentation,
    200
  );

  console.log(
    "✅ Présentation complète des offres d’emploi chargée"
  );

})();

/* =========================================================
   BO'CITÉART — CORRECTIF FINAL
   RETOUR UNIQUE • ANNUAIRE LOCAL RÉEL
   ========================================================= */

(function correctEntrepriseNavigationAndDirectory(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getModalContent(){

    return document.querySelector(
      "#modalContent," +
      ".modal-content," +
      ".modalContent," +
      ".modal-body," +
      ".modalBody"
    );
  }

  function openPreviousPage(){

    if(
      typeof app.goBack ===
      "function"
    ){
      app.goBack();
      return;
    }

    if(
      typeof app.openHome ===
      "function"
    ){
      app.openHome();
    }
  }

function correctBackButtons(){

  const modal =
    getModalContent();

  if(!modal){
    return;
  }

  modal
    .querySelectorAll(
      "button, [role='button']"
    )
    .forEach(function(button){

      /*
        Le nouveau bouton officiel
        ← Retour
        doit absolument être conservé.
      */

      if(
        button.classList &&
        button.classList.contains(
          "bociteEntrepriseProtectedBackBtn"
        )
      ){
        return;
      }

      const text =
        normalizeText(
          button.textContent
        );

      /*
        Suppression uniquement
        des anciens boutons Retour.
      */

      if(
        text === "retour" ||
        text === "retour a l espace entreprise" ||
        text === "retour a la page precedente" ||
        text === "retour a commerces & entreprises"
      ){
        button.remove();
      }

    });

}

  function openRealLocalDirectory(){

    if(
      typeof app.openLocalDirectory ===
      "function"
    ){
      app.openLocalDirectory();
      return;
    }

    if(
      typeof app.openCorrectedDirectory ===
      "function"
    ){
      app.openCorrectedDirectory();
      return;
    }

    alert(
      "L’annuaire local est momentanément indisponible."
    );
  }

  /*
    Le véritable annuaire local remplace
    définitivement l’écran d’attente inutile.
  */

  app.registerScreen(
    "annuaire_local",
    openRealLocalDirectory
  );

  /*
    Correction directe des boutons
    « Entreprises et commerces de ma ville ».
  */

  function correctDirectoryButtons(){

    document
      .querySelectorAll(
        "[data-entreprise-screen='annuaire_local']," +
        "#employmentLocalCompaniesBtn," +
        "#developmentDirectoryBtn," +
        "#loyaltyLocalDirectoryBtn," +
        "#visibilityDirectoryBtn," +
        "#bociteEmploymentDirectoryBtn," +
        "#publicEmploymentDirectoryBtn"
      )
      .forEach(function(button){

        button.onclick = function(event){

          event.preventDefault();
          event.stopPropagation();

          openRealLocalDirectory();
        };
      });
  }

  function applyCorrections(){

    window.setTimeout(function(){

      correctBackButtons();
      correctDirectoryButtons();

    },30);
  }

  const observer =
    new MutationObserver(function(){

      applyCorrections();
    });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  applyCorrections();

  console.log(
    "✅ Retour unique et annuaire local réel corrigés"
  );

})();

/* =========================================================
   BO'CITÉART — CORRECTIF ENTREPRISE
   BANDES CLIQUABLES
   ========================================================= */

(function repairEntrepriseBands(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){

    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );

    return;
  }

  if(
    window.BOCITE_ENTREPRISE_BANDS_REPAIRED
  ){
    return;
  }

  window.BOCITE_ENTREPRISE_BANDS_REPAIRED =
    true;

  function installClickableBandStyle(){

    if(
      document.getElementById(
        "entrepriseClickableBandsStyle"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "entrepriseClickableBandsStyle";

    style.textContent = `
      #entrepriseHomeBands .entrepriseBand {
        position:relative !important;
        z-index:2 !important;
        pointer-events:auto !important;
        cursor:pointer !important;
        touch-action:manipulation !important;
      }

      #entrepriseHomeBands .entrepriseBandText,
      #entrepriseHomeBands .entrepriseBandText * {
        pointer-events:none !important;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function openEntrepriseScreen(
    screenName
  ){

    if(
      !screenName ||
      typeof app.openScreen !==
      "function"
    ){
      return;
    }

    app.openScreen(
      screenName
    );
  }

  document.addEventListener(
    "click",
    function(event){

      const target =
        event.target;

      if(
        !target ||
        typeof target.closest !==
        "function"
      ){
        return;
      }

      const band =
        target.closest(
          "#entrepriseHomeBands .entrepriseBand"
        );

      if(!band){
        return;
      }

      const screenName =
        band.getAttribute(
          "data-entreprise-screen"
        );

      if(!screenName){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation ===
        "function"
      ){
        event.stopImmediatePropagation();
      }

      openEntrepriseScreen(
        screenName
      );

    },
    true
  );

  installClickableBandStyle();

  console.log(
    "✅ Bandes Entreprise réparées"
  );

})();
/* =========================================================
   BO'CITÉART — ASSISTANT ENTREPRISE V2
   RÉPONSES IMMÉDIATES ET ORIENTATION
   ========================================================= */

(function installEntrepriseAssistantV2(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){

    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );

    return;
  }

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeValue(value){

    if(
      typeof app.safeEscape ===
      "function"
    ){
      return app.safeEscape(value);
    }

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function extractCity(question){

    const text =
      String(question || "").trim();

    const patterns = [

      /(?:dans la ville de)\s+([a-zA-ZÀ-ÿ' -]{2,40})$/i,

      /(?:dans|à|au|sur|vers|près de)\s+([a-zA-ZÀ-ÿ' -]{2,40})$/i
    ];

    for(
      let index = 0;
      index < patterns.length;
      index++
    ){

      const match =
        text.match(
          patterns[index]
        );

      if(match){

        return String(
          match[1] || ""
        ).trim();
      }
    }

    return "";
  }

  function extractNeed(question){

    return String(question || "")
      .replace(
        /^(je|nous|mon entreprise|notre entreprise)\s+/i,
        ""
      )
      .replace(
        /^(recherche|cherche|voudrais|souhaite|veux|ai besoin de)\s+/i,
        ""
      )
      .replace(
        /(?:dans la ville de|dans|à|au|sur|vers|près de)\s+[a-zA-ZÀ-ÿ' -]{2,40}$/i,
        ""
      )
      .trim();
  }

  function getAnswer(question){

    const normalized =
      normalizeText(question);

    const city =
      extractCity(question);

    const need =
      extractNeed(question) ||
      String(question || "").trim();

    if(
      normalized.includes("emploi") ||
      normalized.includes("recrut") ||
      normalized.includes("personnel") ||
      normalized.includes("salarie") ||
      normalized.includes("apprenti") ||
      normalized.includes("alternance") ||
      normalized.includes("stage")
    ){

      return {
        title:
          "Votre recherche concerne l’emploi.",
        lines:[
          "Consultez les offres disponibles dans votre ville.",
          "Déposez une offre depuis l’espace professionnel.",
          "Consultez les candidatures spontanées reçues.",
          "Élargissez ensuite aux communes voisines si nécessaire."
        ],
        button:
          "Ouvrir la rubrique Emploi",
        screen:
          "emploi"
      };
    }

    if(
      normalized.includes("charge") ||
      normalized.includes("electricite") ||
      normalized.includes("gaz") ||
      normalized.includes("assurance") ||
      normalized.includes("telephonie") ||
      normalized.includes("internet") ||
      normalized.includes("mutualis")
    ){

      return {
        title:
          "Plusieurs solutions peuvent réduire vos charges.",
        lines:[
          "Vérifiez les mutualisations déjà proposées.",
          "Déclarez votre intérêt sans engagement immédiat.",
          "Attendez que le nombre nécessaire d’entreprises soit atteint.",
          "Comparez ensuite les offres reçues avant de décider."
        ],
        button:
          "Voir les mutualisations",
        screen:
          "mutualisation"
      };
    }

    if(
      normalized.includes("mecenat") ||
      normalized.includes("mecene") ||
      normalized.includes("don") ||
      normalized.includes("projet local")
    ){

      return {
        title:
          "Le mécénat peut répondre à votre demande.",
        lines:[
          "Découvrez les projets locaux pouvant être soutenus.",
          "Choisissez entre un apport financier, du matériel ou des compétences.",
          "Préparez votre engagement dans votre espace privé.",
          "Vérifiez l’aspect fiscal avec votre expert-comptable."
        ],
        button:
          "Découvrir le mécénat",
        screen:
          "mecenat"
      };
    }

    if(
      normalized.includes("retraite") ||
      normalized.includes("transmission") ||
      normalized.includes("transmettre") ||
      normalized.includes("cession") ||
      normalized.includes("repreneur") ||
      normalized.includes("succession")
    ){

      return {
        title:
          "Il faut préparer l’avenir de votre entreprise.",
        lines:[
          "Identifiez ce qui doit être transmis.",
          "Valorisez les métiers et le savoir-faire de l’entreprise.",
          "Préparez les documents utiles.",
          "Recherchez progressivement un repreneur ou une solution de continuité."
        ],
        button:
          "Ouvrir la rubrique Pérennité",
        screen:
          "perennite"
      };
    }

    if(
      normalized.includes("visibilite") ||
      normalized.includes("faire connaitre") ||
      normalized.includes("publicite") ||
      normalized.includes("notoriete") ||
      normalized.includes("presentation")
    ){

      return {
        title:
          "Votre entreprise doit d’abord être visible localement.",
        lines:[
          "Complétez votre fiche entreprise.",
          "Présentez vos métiers et votre savoir-faire.",
          "Indiquez vos services et vos coordonnées.",
          "Diffusez ensuite vos actualités ou vos besoins."
        ],
        button:
          "Faire connaître mon entreprise",
        screen:
          "visibilite"
      };
    }

    return {
      title:
        city
          ? (
              "Recherche de « " +
              need +
              " » à " +
              city
            )
          : (
              "Recherche de « " +
              need +
              " » dans votre ville"
            ),

      lines:[
        city
          ? (
              "La recherche commencera dans la commune de " +
              city +
              "."
            )
          : (
              "La recherche commencera dans votre commune."
            ),

        "Les entreprises, commerces, artisans et services correspondants seront recherchés en priorité.",

        "En l’absence de résultat suffisant, la recherche pourra être élargie aux communes voisines.",

        "Vous pourrez ensuite consulter les fiches disponibles et contacter directement les professionnels."
      ],

      button:
        "Rechercher les professionnels",

      action:
        "search",

      keyword:
        need,

      city:
        city
    };
  }

  function openSearch(
    keyword,
    city
  ){

    if(
      typeof app.openProfessionalDirectory ===
      "function"
    ){

      app.openProfessionalDirectory({
        keyword:keyword || "",
        city:city || ""
      });

      return;
    }

    if(
      typeof app.openProfessionalSearch ===
      "function"
    ){

      app.openProfessionalSearch();

      window.setTimeout(function(){

        const input =
          document.getElementById(
            "professionalPublicSearchNeed"
          );

        if(input){
          input.value =
            keyword || "";
        }

      },80);

      return;
    }

    app.openScreen(
      "annuaire"
    );
  }

  function renderAnswer(
    question,
    answerHost
  ){

    const host =
      answerHost ||
      document.getElementById(
        "entrepriseAiAnswer"
      );

    if(!host){
      return;
    }

    const result =
      getAnswer(question);

    host.innerHTML = `
      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #2f5d46;
        ">

        <strong style="font-size:19px;">
          ${escapeValue(result.title)}
        </strong>

        <br><br>

        ${
          result.lines
            .map(function(line){

              return `
                • ${escapeValue(line)}
                <br><br>
              `;
            })
            .join("")
        }

        <button
          id="entrepriseAiResultActionBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          ${escapeValue(result.button)}
        </button>
      </div>
    `;

    const button =
      document.getElementById(
        "entrepriseAiResultActionBtn"
      );

    if(!button){
      return;
    }

    button.onclick = function(event){

      event.preventDefault();
      event.stopPropagation();

      if(
        result.action ===
        "search"
      ){

        openSearch(
          result.keyword,
          result.city
        );

        return;
      }

      if(result.screen){

        app.openScreen(
          result.screen
        );
      }
    };

    host.scrollIntoView({
      behavior:"smooth",
      block:"nearest"
    });
  }

  /*
    Cette fonction est celle appelée
    par le bouton déjà présent dans la page.
  */

  app.runEnterpriseAssistant =
    function(
      question,
      answerHost
    ){

      renderAnswer(
        question,
        answerHost
      );
    };

  console.log(
    "✅ Assistant Entreprise V2 avec réponses installé"
  );

})();

/* =========================================================
   BO'CITÉART — CORRECTIF FINAL ASSISTANT ENTREPRISE
   RÉPONSE AFFICHÉE DIRECTEMENT DANS L’ENCART
   ========================================================= */

(function forceEntrepriseAssistantAnswer(){

  "use strict";

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeHtml(value){

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function findCity(question){

    const text =
      String(question || "").trim();

    const match =
      text.match(
        /(?:ville de|commune de|sur|à|au|dans)\s+([a-zA-ZÀ-ÿ' -]{2,35})(?:\?|$)/i
      );

    return match
      ? String(match[1] || "").trim()
      : "";
  }

  function buildAnswer(question){

    const normalized =
      normalizeText(question);

    const city =
      findCity(question);

    if(
      normalized.includes("gros oeuvre") ||
      normalized.includes("batiment") ||
      normalized.includes("macon") ||
      normalized.includes("construction") ||
      normalized.includes("renovation") ||
      normalized.includes("bricolage") ||
      normalized.includes("artisan") ||
      normalized.includes("entreprise")
    ){
      return {
        title:
          "Recherche d’une entreprise ou d’un professionnel",

        text:
          city
            ? (
                "Bo'CitéArt recherchera d’abord les entreprises correspondant à votre besoin à " +
                city +
                ", puis dans les communes voisines et, si nécessaire, dans la région."
              )
            : (
                "Bo'CitéArt recherchera d’abord les entreprises correspondant à votre besoin dans votre commune, puis dans les communes voisines et dans la région."
              ),

        advice:[
          "Précisez le métier recherché : gros œuvre, maçonnerie, couverture, plomberie, électricité ou rénovation.",
          "Consultez les fiches des entreprises locales.",
          "Vérifiez leurs métiers, leurs services et leurs coordonnées.",
          "Demandez ensuite un ou plusieurs devis."
        ],

        buttonText:
          "Rechercher les entreprises",

        screen:
          "annuaire"
      };
    }

    if(
      normalized.includes("emploi") ||
      normalized.includes("personnel") ||
      normalized.includes("recrut") ||
      normalized.includes("salarie") ||
      normalized.includes("apprenti")
    ){
      return {
        title:
          "Votre demande concerne l’emploi",

        text:
          "Bo'CitéArt peut vous orienter vers les offres locales, les candidatures spontanées et les entreprises qui recrutent.",

        advice:[
          "Consultez les offres disponibles.",
          "Déposez une offre depuis l’espace professionnel.",
          "Consultez les candidatures reçues.",
          "Élargissez aux communes voisines lorsque cela est nécessaire."
        ],

        buttonText:
          "Ouvrir la rubrique Emploi",

        screen:
          "emploi"
      };
    }

    if(
      normalized.includes("charge") ||
      normalized.includes("electricite") ||
      normalized.includes("gaz") ||
      normalized.includes("assurance") ||
      normalized.includes("telephonie") ||
      normalized.includes("mutualisation")
    ){
      return {
        title:
          "Votre demande concerne la réduction des charges",

        text:
          "Plusieurs entreprises peuvent se regrouper pour comparer des propositions et améliorer leur pouvoir de négociation.",

        advice:[
          "Consultez les mutualisations proposées.",
          "Déclarez votre intérêt sans engagement.",
          "Attendez que le nombre nécessaire d’entreprises soit atteint.",
          "Comparez ensuite les offres reçues."
        ],

        buttonText:
          "Voir les mutualisations",

        screen:
          "mutualisation"
      };
    }

    if(
      normalized.includes("mecenat") ||
      normalized.includes("mecene") ||
      normalized.includes("don")
    ){
      return {
        title:
          "Votre demande concerne le mécénat",

        text:
          "Bo'CitéArt peut vous présenter les projets locaux et les différentes formes de contribution possibles.",

        advice:[
          "Soutien financier.",
          "Don de matériel ou de produits.",
          "Mécénat de compétences.",
          "Accompagnement d’un projet local."
        ],

        buttonText:
          "Découvrir le mécénat",

        screen:
          "mecenat"
      };
    }

    return {
      title:
        "Première orientation Bo'CitéArt",

      text:
        city
          ? (
              "Votre demande sera recherchée en priorité à " +
              city +
              ", puis dans les communes voisines."
            )
          : (
              "Votre demande sera recherchée en priorité dans votre commune, puis dans les communes voisines."
            ),

      advice:[
        "Précisez le métier, le service ou le type d’entreprise recherché.",
        "Consultez les acteurs locaux disponibles.",
        "Élargissez progressivement la zone de recherche.",
        "Contactez directement les professionnels correspondant à votre besoin."
      ],

      buttonText:
        "Ouvrir la recherche professionnelle",

      screen:
        "annuaire"
    };
  }

  function displayAnswer(){

    const input =
      document.getElementById(
        "entrepriseAiQuestion"
      );

    const host =
      document.getElementById(
        "entrepriseAiAnswer"
      );

    if(!input || !host){
      return;
    }

    const question =
      String(input.value || "").trim();

    if(!question){

      alert(
        "Écrivez votre question."
      );

      return;
    }

    const answer =
      buildAnswer(question);

    host.innerHTML = `
      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #2f5d46;
          color:#111;
        ">

        <strong style="font-size:19px;">
          ${escapeHtml(answer.title)}
        </strong>

        <br><br>

        ${escapeHtml(answer.text)}

        <br><br>

        ${
          answer.advice.map(function(line){

            return `
              • ${escapeHtml(line)}
              <br>
            `;
          }).join("")
        }

        <button
          id="entrepriseFinalAiActionBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:14px;
          ">
          ${escapeHtml(answer.buttonText)}
        </button>
      </div>
    `;

    const actionButton =
      document.getElementById(
        "entrepriseFinalAiActionBtn"
      );

    if(actionButton){

      actionButton.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();

        const app =
          window.BociteEntreprise;

        if(
          app &&
          typeof app.openScreen ===
          "function"
        ){
          app.openScreen(
            answer.screen
          );
        }
      };
    }

    host.scrollIntoView({
      behavior:"smooth",
      block:"nearest"
    });
  }

  /*
    Capture prioritaire du clic :
    empêche l’ancien message provisoire
    de remplacer notre véritable réponse.
  */

  document.addEventListener(
    "click",
    function(event){

      const target =
        event.target;

      if(
        !target ||
        typeof target.closest !==
        "function"
      ){
        return;
      }

      const button =
        target.closest(
          "#entrepriseAiAskBtn"
        );

      if(!button){
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      displayAnswer();

    },
    true
  );

  document.addEventListener(
    "keydown",
    function(event){

      if(
        event.key === "Enter" &&
        event.target &&
        event.target.id ===
        "entrepriseAiQuestion"
      ){
        event.preventDefault();
        displayAnswer();
      }
    },
    true
  );

  console.log(
    "✅ Réponse visible de l’assistant Entreprise installée"
  );

})();

/* =========================================================
   BO'CITÉART — ASSISTANT ENTREPRISE V3
   NEUTRALISATION DE L’ANCIEN BOUTON
   RÉPONSE VISIBLE • ÉLARGISSEMENT DE LA RECHERCHE
   ========================================================= */

(function installEntrepriseAssistantV3(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeHtml(value){

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function findCity(question){

    const text =
      String(question || "").trim();

    const patterns = [
      /ville de\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /commune de\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /autour de\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /près de\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /sur\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /à\s+([a-zA-ZÀ-ÿ' -]{2,45})/i
    ];

    for(
      let index = 0;
      index < patterns.length;
      index++
    ){
      const match =
        text.match(patterns[index]);

      if(match){

        return String(match[1] || "")
          .replace(
            /\b(?:dans|puis|et|pour|avec|éventuellement)\b.*$/i,
            ""
          )
          .trim();
      }
    }

    return "";
  }

  function determineCategory(question){

    const text =
      normalizeText(question);

    if(
      text.includes("emploi") ||
      text.includes("recrut") ||
      text.includes("personnel") ||
      text.includes("salarie") ||
      text.includes("apprenti") ||
      text.includes("stage")
    ){
      return "emploi";
    }

    if(
      text.includes("charge") ||
      text.includes("electricite") ||
      text.includes("gaz") ||
      text.includes("assurance") ||
      text.includes("telephone") ||
      text.includes("internet") ||
      text.includes("mutualis")
    ){
      return "mutualisation";
    }

    if(
      text.includes("mecenat") ||
      text.includes("mecene") ||
      text.includes("don")
    ){
      return "mecenat";
    }

    if(
      text.includes("transmission") ||
      text.includes("repreneur") ||
      text.includes("cession") ||
      text.includes("retraite")
    ){
      return "perennite";
    }

    if(
      text.includes("visibilite") ||
      text.includes("faire connaitre") ||
      text.includes("publicite")
    ){
      return "visibilite";
    }

    return "recherche";
  }

  function getAnswerHost(){

    let host =
      document.getElementById(
        "entrepriseAiAnswer"
      );

    if(host){
      return host;
    }

    const input =
      document.getElementById(
        "entrepriseAiQuestion"
      );

    if(!input){
      return null;
    }

    host =
      document.createElement("div");

    host.id =
      "entrepriseAiAnswer";

    host.style.marginTop =
      "12px";

    input.parentElement.appendChild(
      host
    );

    return host;
  }

  function openScreen(screenName){

    if(
      typeof app.openScreen ===
      "function"
    ){
      app.openScreen(screenName);
    }
  }

  function displayAnswer(question){

    const host =
      getAnswerHost();

    if(!host){
      alert(
        "L’encart de réponse est introuvable."
      );
      return;
    }

    const category =
      determineCategory(question);

    const city =
      findCity(question);

    const locationText =
      city
        ? city
        : "votre commune";

    let title =
      "Recherche professionnelle locale";

   let mainText =
  `Aucun professionnel ne correspond actuellement à votre recherche.

Au fur et à mesure du raccordement des différentes bases de données publiques autorisées et des inscriptions des professionnels, l’annuaire Bo'CitéArt s’enrichira automatiquement.

La recherche commence toujours par votre commune, puis s’étend progressivement jusqu’à un rayon de 20 kilomètres afin de privilégier les ressources de proximité avant d’élargir le périmètre de recherche.`;

    let advice = [
      "La recherche doit commencer dans " +
        locationText +
        ".",

      "Elle doit ensuite être élargie aux communes voisines.",

      "En l’absence de résultat suffisant, elle pourra être étendue au département puis à la région.",

      "La version définitive utilisera l’annuaire économique et les données professionnelles mises à jour."
    ];

    let mainButtonText =
      "Consulter l’annuaire professionnel";

    let mainScreen =
      "annuaire";

    if(category === "emploi"){

      title =
        "Votre question concerne l’emploi";

      mainText =
        "Bo'CitéArt peut vous orienter vers les offres locales, les candidatures spontanées et les entreprises qui recrutent.";

      advice = [
        "Consultez les offres disponibles.",
        "Recherchez d’abord dans " + locationText + ".",
        "Élargissez ensuite aux communes voisines.",
        "Une entreprise peut publier son offre depuis son espace privé."
      ];

      mainButtonText =
        "Ouvrir la rubrique Emploi";

      mainScreen =
        "emploi";
    }

    if(category === "mutualisation"){

      title =
        "Votre question concerne la réduction des charges";

      mainText =
        "Bo'CitéArt peut regrouper plusieurs entreprises ayant le même besoin afin de rechercher des propositions communes.";

      advice = [
        "Déclarez votre intérêt sans engagement immédiat.",
        "Attendez que le nombre nécessaire d’entreprises soit atteint.",
        "Comparez les propositions reçues.",
        "Chaque entreprise reste libre d’accepter ou de refuser."
      ];

      mainButtonText =
        "Voir les mutualisations";

      mainScreen =
        "mutualisation";
    }

    if(category === "mecenat"){

      title =
        "Votre question concerne le mécénat";

      mainText =
        "Bo'CitéArt peut vous présenter les projets locaux et les différentes formes de contribution possibles.";

      advice = [
        "Soutien financier.",
        "Don de matériel ou de produits.",
        "Mécénat de compétences.",
        "Vérification avec votre expert-comptable."
      ];

      mainButtonText =
        "Découvrir le mécénat";

      mainScreen =
        "mecenat";
    }

    if(category === "perennite"){

      title =
        "Votre question concerne l’avenir de l’entreprise";

      mainText =
        "Bo'CitéArt peut vous aider à préparer la transmission, la reprise ou la continuité de votre activité.";

      advice = [
        "Identifier ce qui doit être transmis.",
        "Valoriser le savoir-faire de l’entreprise.",
        "Préparer les informations utiles.",
        "Rechercher progressivement un repreneur."
      ];

      mainButtonText =
        "Ouvrir la rubrique Pérennité";

      mainScreen =
        "perennite";
    }

    if(category === "visibilite"){

      title =
        "Votre question concerne la visibilité";

      mainText =
        "La première étape consiste à présenter clairement votre entreprise, ses métiers, ses services et ses coordonnées.";

      advice = [
        "Complétez votre fiche entreprise.",
        "Présentez vos métiers et votre savoir-faire.",
        "Indiquez vos services.",
        "Diffusez ensuite vos actualités."
      ];

      mainButtonText =
        "Faire connaître mon entreprise";

      mainScreen =
        "visibilite";
    }

    host.innerHTML = `
      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #2f5d46;
          color:#111;
        ">

        <strong style="font-size:19px;">
          ${escapeHtml(title)}
        </strong>

        <br><br>

        ${escapeHtml(mainText)}

        <br><br>

        ${
          advice.map(function(line){

            return `
              • ${escapeHtml(line)}
              <br><br>
            `;
          }).join("")
        }

        <div
          class="box"
          style="
            margin-top:12px;
            border-left:6px solid #b00020;
          ">

          <strong>
            Souhaitez-vous élargir la recherche ?
          </strong>

          <br><br>

          Si aucun résultat n’est disponible autour de vous,
          Bo'CitéArt peut poursuivre progressivement
          dans les communes voisines,
          le département,
          puis la région.
        </div>

        <button
          id="entrepriseAiMainActionBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:12px;
          ">
          ${escapeHtml(mainButtonText)}
        </button>

        <button
          id="entrepriseAiExpandSearchBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
            background:#fff;
          ">
          Continuer la recherche plus loin
        </button>
      </div>
    `;

    const mainButton =
      document.getElementById(
        "entrepriseAiMainActionBtn"
      );

    if(mainButton){

      mainButton.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();

        openScreen(mainScreen);
      };
    }

    const expandButton =
      document.getElementById(
        "entrepriseAiExpandSearchBtn"
      );

    if(expandButton){

      expandButton.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();

        host.insertAdjacentHTML(
          "beforeend",
          `
            <div
              class="box"
              style="
                margin-top:12px;
                border-left:6px solid #2f5d46;
              ">

              <strong>
                Recherche élargie demandée
              </strong>

              <br><br>

              La recherche sera poursuivie :

              <br><br>

              • dans les communes voisines ;<br>
              • dans le département ;<br>
              • puis dans la région si nécessaire.

              <br><br>

              Dans la version définitive,
              les résultats disponibles seront affichés ici.
            </div>
          `
        );
      };
    }

    host.scrollIntoView({
      behavior:"smooth",
      block:"nearest"
    });
  }

  function replaceAssistantButton(){

    const oldButton =
      document.getElementById(
        "entrepriseAiAskBtn"
      );

    if(
      !oldButton ||
      oldButton.dataset.assistantV3 === "ok"
    ){
      return;
    }

    /*
      La copie supprime tous les anciens
      événements onclick attachés au bouton.
    */

    const newButton =
      oldButton.cloneNode(true);

    newButton.dataset.assistantV3 =
      "ok";

    oldButton.parentNode.replaceChild(
      newButton,
      oldButton
    );

    newButton.onclick = function(event){

      event.preventDefault();
      event.stopPropagation();

      const input =
        document.getElementById(
          "entrepriseAiQuestion"
        );

      const question =
        input
          ? String(input.value || "").trim()
          : "";

      if(!question){

        alert(
          "Écrivez votre question."
        );
        return;
      }

      displayAnswer(question);
    };
  }

  function applyAssistantRepair(){

    window.setTimeout(function(){

      replaceAssistantButton();

    },20);
  }

  const observer =
    new MutationObserver(function(){

      applyAssistantRepair();
    });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  applyAssistantRepair();

  console.log(
    "✅ Assistant Entreprise V3 réellement prioritaire installé"
  );

})();

/* =========================================================
   BO'CITÉART — ASSISTANT ENTREPRISE V4
   NOUVEAU BOUTON INDÉPENDANT • RÉPONSE IMMÉDIATE
   ========================================================= */

(function installEntrepriseAssistantV4(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
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

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function createNewAssistantButton(){

    const oldButton =
      document.getElementById(
        "entrepriseAiAskBtn"
      );

    if(!oldButton){
      return;
    }

    if(
      document.getElementById(
        "entrepriseAiAskBtnV4"
      )
    ){
      return;
    }

    const newButton =
      document.createElement("button");

    newButton.id =
      "entrepriseAiAskBtnV4";

    newButton.className =
      oldButton.className || "choiceBtn";

    newButton.type =
      "button";

    newButton.style.cssText =
      oldButton.style.cssText;

    newButton.textContent =
      "Poser ma question";

    oldButton.replaceWith(
      newButton
    );

    newButton.onclick =
      answerQuestion;
  }

  function getAnswerHost(){

    let host =
      document.getElementById(
        "entrepriseAiAnswerV4"
      );

    if(host){
      return host;
    }

    const oldHost =
      document.getElementById(
        "entrepriseAiAnswer"
      );

    if(oldHost){

      oldHost.id =
        "entrepriseAiAnswerV4";

      oldHost.innerHTML = "";

      return oldHost;
    }

    const button =
      document.getElementById(
        "entrepriseAiAskBtnV4"
      );

    if(!button){
      return null;
    }

    host =
      document.createElement("div");

    host.id =
      "entrepriseAiAnswerV4";

    host.style.marginTop =
      "14px";

    button.insertAdjacentElement(
      "afterend",
      host
    );

    return host;
  }

  function determineCategory(question){

    const text =
      normalizeText(question);

    if(
      text.includes("emploi") ||
      text.includes("recrut") ||
      text.includes("personnel") ||
      text.includes("salarie") ||
      text.includes("carrossier") ||
      text.includes("peintre") ||
      text.includes("apprenti")
    ){
      return "emploi";
    }

    if(
      text.includes("charge") ||
      text.includes("gaz") ||
      text.includes("electricite") ||
      text.includes("assurance") ||
      text.includes("mutualis")
    ){
      return "mutualisation";
    }

    if(
      text.includes("mecenat") ||
      text.includes("mecene") ||
      text.includes("don")
    ){
      return "mecenat";
    }

    if(
      text.includes("transmission") ||
      text.includes("repreneur") ||
      text.includes("retraite") ||
      text.includes("cession")
    ){
      return "perennite";
    }

    if(
      text.includes("visibilite") ||
      text.includes("faire connaitre") ||
      text.includes("publicite")
    ){
      return "visibilite";
    }

    return "recherche";
  }

function buildAnswer(question){

  const category =
    determineCategory(question);

  const brandHtml = `
    <strong>
      <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#b00020;font-weight:700;">Art</span>
    </strong>
  `;

  if(category === "emploi"){

    return {
      title:
        "Recherche de personnel ou de compétence",

      text:
        `Aucun profil ne correspond actuellement à votre recherche.

${brandHtml} recherchera d’abord les profils, les candidatures et les besoins disponibles dans votre commune, puis élargira progressivement la recherche aux communes voisines, jusqu’à un rayon de 20 kilomètres.`,

      lines:[
        "Consulter les offres et les candidatures disponibles.",
        "Rechercher les entreprises du métier concerné.",
        "Élargir aux communes voisines si aucun résultat n’est trouvé.",
        "Poursuivre ensuite dans le département et la région."
      ],

      buttonText:
        "Ouvrir la rubrique Emploi",

      screen:
        "emploi"
    };
  }

  if(category === "mutualisation"){

    return {
      title:
        "Réduire les charges mutualisables",

      text:
        `${brandHtml} permet de regrouper plusieurs entreprises ayant le même besoin afin de lancer une recherche commune et de comparer les propositions reçues.`,

      lines:[
        "Déclarer votre intérêt.",
        "Attendre que le nombre nécessaire d’entreprises soit atteint.",
        "Comparer les propositions reçues.",
        "Accepter ou refuser librement."
      ],

      buttonText:
        "Voir les mutualisations",

      screen:
        "mutualisation"
    };
  }

  if(category === "mecenat"){

    return {
      title:
        "Recherche liée au mécénat",

      text:
        `${brandHtml} oriente les entreprises vers les projets locaux et les différentes formes de contribution possibles.`,

      lines:[
        "Soutien financier.",
        "Don de matériel.",
        "Mécénat de compétences.",
        "Accompagnement d’un projet local."
      ],

      buttonText:
        "Découvrir le mécénat",

      screen:
        "mecenat"
    };
  }

  if(category === "perennite"){

    return {
      title:
        "Préparer l’avenir de votre entreprise",

      text:
        `${brandHtml} accompagne progressivement la réflexion autour de la transmission, de la reprise et de la continuité de votre activité.`,

      lines:[
        "Valoriser le savoir-faire.",
        "Préparer les informations utiles.",
        "Identifier les besoins liés à la transmission.",
        "Rechercher un repreneur."
      ],

      buttonText:
        "Ouvrir la rubrique Pérennité",

      screen:
        "perennite"
    };
  }

  if(category === "visibilite"){

    return {
      title:
        "Faire connaître votre entreprise",

      text:
        `${brandHtml} rend visibles vos métiers, votre savoir-faire, vos services et vos coordonnées auprès des habitants et des professionnels.`,

      lines:[
        "Compléter votre fiche.",
        "Présenter vos métiers.",
        "Présenter vos services.",
        "Publier vos actualités."
      ],

      buttonText:
        "Faire connaître mon entreprise",

      screen:
        "visibilite"
    };
  }

  return {
    title:
      "Recherche professionnelle",

    text:
      `Aucun professionnel ne correspond actuellement à votre recherche.

La recherche commence dans votre commune, puis s’étend progressivement aux communes voisines, jusqu’à un rayon de 20 kilomètres.

${brandHtml} enrichira les résultats au fur et à mesure du raccordement des sources publiques autorisées et des inscriptions des professionnels.`,

    lines:[
      "Identifier précisément le métier ou le service recherché.",
      "Consulter les entreprises et les commerces locaux.",
      "Élargir progressivement la zone si aucun résultat n’est trouvé.",
      "Contacter directement les professionnels disponibles."
    ],

    buttonText:
      "Ouvrir la recherche professionnelle",

    screen:
      "annuaire"
  };
}

  function answerQuestion(){

    const input =
      document.getElementById(
        "entrepriseAiQuestion"
      );

    const host =
      getAnswerHost();

    if(!input || !host){
      return;
    }

    const question =
      String(input.value || "").trim();

    if(!question){

      alert(
        "Écrivez votre question."
      );

      return;
    }

    const answer =
      buildAnswer(question);

    host.innerHTML = `
      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #2f5d46;
          color:#111;
        ">

        <strong style="font-size:19px;">
          ${escapeHtml(answer.title)}
        </strong>

        <br><br>

       ${answer.text}

        <br><br>

        ${
          answer.lines.map(function(line){

            return `
              • ${escapeHtml(line)}
              <br><br>
            `;
          }).join("")
        }

        <div
          class="box"
          style="
            border-left:6px solid #b00020;
            margin-top:10px;
          ">

          <strong>
            Souhaitez-vous poursuivre plus loin ?
          </strong>

          <br><br>

          En l’absence de résultat autour de vous,
          la recherche pourra être étendue
          aux communes voisines,
          au département,
          puis à la région.
        </div>

        <button
          id="entrepriseAiActionV4"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:12px;
          ">
          ${escapeHtml(answer.buttonText)}
        </button>

        <button
          id="entrepriseAiExpandV4"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
            background:#fff;
          ">
          Continuer la recherche plus loin
        </button>

        <div
          id="entrepriseAiExpandedResultV4">
        </div>
      </div>
    `;

    const actionButton =
      document.getElementById(
        "entrepriseAiActionV4"
      );

    if(actionButton){

      actionButton.onclick = function(){

        app.openScreen(
          answer.screen
        );
      };
    }

    const expandButton =
      document.getElementById(
        "entrepriseAiExpandV4"
      );

    if(expandButton){

      expandButton.onclick = function(){

        const expandedHost =
          document.getElementById(
            "entrepriseAiExpandedResultV4"
          );

        if(expandedHost){

          expandedHost.innerHTML = `
            <div
              class="box"
              style="
                margin-top:12px;
                border-left:6px solid #2f5d46;
              ">

              <strong>
                Recherche élargie
              </strong>

              <br><br>

              La recherche sera poursuivie :

              <br><br>

              • dans les communes voisines ;<br>
              • dans la métropole ou le département ;<br>
              • dans la région ;<br>
              • puis au niveau national si nécessaire.

              <br><br>

              Les résultats réels seront affichés ici
              lorsque l’annuaire économique
              et les sources professionnelles
              seront connectés.
            </div>
          `;
        }
      };
    }

    host.scrollIntoView({
      behavior:"smooth",
      block:"nearest"
    });
  }

  function apply(){

    window.setTimeout(function(){

      createNewAssistantButton();

    },50);
  }

  const observer =
    new MutationObserver(
      apply
    );

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  apply();

  console.log(
    "✅ Assistant Entreprise V4 indépendant installé"
  );

})();

/* =========================================================
   BO'CITÉART — OBSERVATOIRE ET ANNUAIRE ÉCONOMIQUE VIVANT
   LECTURE OBLIGATOIRE • TERRITOIRE • ANNUAIRE
   ========================================================= */

function getObservatoireIntroHtml(){

return `

${getRetourEntrepriseButton()}

<div class="box">

<h2 style="color:#0b7a43;font-size:16px;font-weight:bold;">
Pourquoi un observatoire économique ?
</h2>

<p>

Chaque territoire possède des entreprises,
des artisans,
des commerces,
des associations
et des savoir-faire souvent méconnus.

</p>

<p>

Lorsqu'ils restent invisibles,
les opportunités disparaissent,
les partenariats ne se créent pas
et une partie de la richesse locale
profite à d'autres territoires.

</p>

<p>

L'Observatoire économique
<b>Bo'CitéArt</b>
a été conçu pour révéler
ce potentiel
et permettre aux acteurs locaux
de mieux se connaître,
de mieux collaborer
et de développer davantage
leur activité.

</p>

<div style="text-align:center;margin-top:25px;">

<button
class="btnRed"
onclick="openObservatoireSuite()">

Découvrir les avantages

</button>

</div>

</div>

`;

}

function openObservatoireSuite(){

openModal(

"Observatoire économique",

`

${getRetourEntrepriseButton()}

<div class="box">

<h2 style="color:#0b7a43;font-size:16px;font-weight:bold;">
Ce que cela apporte
à votre entreprise
</h2>

<ul>

<li>Être plus facilement trouvée.</li>

<li>Trouver de nouveaux partenaires.</li>

<li>Identifier des compétences locales.</li>

<li>Découvrir de nouveaux marchés.</li>

<li>Développer son réseau professionnel.</li>

<li>Valoriser son savoir-faire.</li>

<li>Créer davantage d'opportunités.</li>

</ul>

<p>

Plus les entreprises participent,
plus cet outil devient utile
à l'ensemble du territoire.

</p>

<div style="text-align:center;margin-top:25px;">

<button
class="btnRed"
onclick="openObservatoireAccueil()">

Accéder à l'observatoire

</button>

</div>

</div>

`

);

}

function openObservatoireAccueil(){

openModal(

"Observatoire économique",

`

${getRetourEntrepriseButton()}

<div class="box">

<h2 style="color:#0b7a43;font-size:16px;font-weight:bold;">
Observatoire économique vivant
</h2>

<p>

Choisissez le service
que vous souhaitez utiliser.

</p>

<div class="entrepriseActionList">

<button class="btnGreen" onclick="openAnnuaireEconomique()">
Annuaire économique
</button>

<button class="btnGreen" onclick="openRechercheProfessionnelle()">
Recherche professionnelle
</button>

<button class="btnGreen" onclick="openOpportunitesEntreprise()">
Opportunités
</button>

<button class="btnGreen" onclick="openPartenairesEntreprise()">
Partenaires
</button>

<button class="btnGreen" onclick="openStatistiquesEntreprise()">
Statistiques
</button>

</div>

</div>

`

);

}

/* =========================================================
   BO'CITÉART — EMPLOI • RECRUTEMENT
   VOYANT ANNUAIRE ET SUIVI DES OFFRES
   ========================================================= */

(function initBociteEmploymentRecruitmentFollowUp(){

  "use strict";

  const EMPLOYMENT_STORE_KEY =
    "bociteart_entreprise_employment_v1";

  const REMINDER_STORE_KEY =
    "bociteart_entreprise_employment_reminders_v1";

  const SEVEN_DAYS =
    7 * 24 * 60 * 60 * 1000;

  const MAX_REMINDERS =
    4;

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function loadEmploymentData(){

    try{

      const raw =
        localStorage.getItem(
          EMPLOYMENT_STORE_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : {};

      return {
        offers:
          Array.isArray(parsed.offers)
            ? parsed.offers
            : [],
        applications:
          Array.isArray(parsed.applications)
            ? parsed.applications
            : []
      };

    }catch(error){

      console.warn(
        "Lecture des offres de recrutement impossible :",
        error
      );

      return {
        offers:[],
        applications:[]
      };
    }
  }

  function saveEmploymentData(data){

    try{

      localStorage.setItem(
        EMPLOYMENT_STORE_KEY,
        JSON.stringify(data)
      );

    }catch(error){

      console.warn(
        "Enregistrement des offres impossible :",
        error
      );
    }
  }

  function loadReminders(){

    try{

      const raw =
        localStorage.getItem(
          REMINDER_STORE_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : {};

      return (
        parsed &&
        typeof parsed === "object"
      )
        ? parsed
        : {};

    }catch(error){

      return {};
    }
  }

  function saveReminders(reminders){

    try{

      localStorage.setItem(
        REMINDER_STORE_KEY,
        JSON.stringify(reminders || {})
      );

    }catch(error){

      console.warn(
        "Enregistrement des rappels impossible :",
        error
      );
    }
  }

  function isOfferActive(offer){

    if(!offer){
      return false;
    }

    return (
      offer.status === "publiee" ||
      offer.status === "modifiee" ||
      offer.status === "published" ||
      offer.status === "active"
    );
  }

  function getActiveOffers(){

    return loadEmploymentData()
      .offers
      .filter(isOfferActive);
  }

  function companyHasActiveOffer(companyName){

    const normalizedCompanyName =
      normalizeText(companyName);

    if(!normalizedCompanyName){
      return false;
    }

    return getActiveOffers()
      .some(function(offer){

        return (
          normalizeText(
            offer.companyName
          ) === normalizedCompanyName
        );
      });
  }

  function installRecruitmentStyles(){

    if(
      document.getElementById(
        "bociteRecruitmentStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteRecruitmentStyles";

    style.textContent = `

      @keyframes bociteRecruitmentPulse {

        0%,
        100% {
          opacity:.38;
          transform:scale(.88);
          box-shadow:
            0 0 0 0
            rgba(47,138,82,.10);
        }

        50% {
          opacity:1;
          transform:scale(1);
          box-shadow:
            0 0 0 4px
            rgba(47,138,82,.13);
        }
      }

      .bociteRecruitmentIndicator {
        display:flex;
        align-items:center;
        gap:7px;
        width:max-content;
        margin-top:8px;
        color:#2f5d46;
        font-size:11px;
        line-height:1.2;
        font-weight:700;
        cursor:pointer;
      }

      .bociteRecruitmentLight {
        display:inline-block;
        width:7px;
        height:7px;
        flex:0 0 7px;
        border-radius:50%;
        background:#2f8a52;
        animation:
          bociteRecruitmentPulse
          1.7s
          ease-in-out
          infinite;
      }

      @media (
        prefers-reduced-motion:
        reduce
      ){

        .bociteRecruitmentLight {
          animation:none;
          opacity:1;
        }
      }

    `;

    document.head.appendChild(style);
  }

  function updateDirectoryRecruitmentLights(){

    installRecruitmentStyles();

    const app =
      window.BociteEntreprise;

    if(
      !app ||
      typeof app.loadDirectory !==
      "function"
    ){
      return;
    }

    const companies =
      app.loadDirectory();

    document
      .querySelectorAll(
        ".entrepriseDirectoryOpen"
      )
      .forEach(function(button){

        const companyId =
          button.getAttribute(
            "data-company-id"
          );

        const company =
          companies.find(function(item){

            return (
              String(item.id) ===
              String(companyId)
            );
          });

        const card =
          button.closest(
            ".box"
          );

        if(!card || !company){
          return;
        }

        const oldIndicator =
          card.querySelector(
            ".bociteRecruitmentIndicator"
          );

        if(
          !companyHasActiveOffer(
            company.name
          )
        ){

          if(oldIndicator){
            oldIndicator.remove();
          }

          return;
        }

        if(oldIndicator){
          return;
        }

        const indicator =
          document.createElement("div");

        indicator.className =
          "bociteRecruitmentIndicator";

        indicator.setAttribute(
          "role",
          "button"
        );

        indicator.setAttribute(
          "tabindex",
          "0"
        );

        indicator.setAttribute(
          "title",
          "Cette entreprise recrute actuellement"
        );

        indicator.innerHTML = `
          <span
            class="bociteRecruitmentLight"
            aria-hidden="true">
          </span>

          <span>
            Recrute actuellement
          </span>
        `;

        indicator.onclick = function(){

          if(
            window.BociteEntreprise &&
            typeof window.BociteEntreprise
              .openScreen === "function"
          ){

            window.BociteEntreprise
              .openScreen("emploi");
          }
        };

        indicator.onkeydown =
          function(event){

            if(
              event.key === "Enter" ||
              event.key === " "
            ){

              event.preventDefault();
              indicator.click();
            }
          };

        const actionArea =
          button.parentElement;

        card.insertBefore(
          indicator,
          actionArea
        );
      });
  }

  function getOfferReferenceDate(
    offer,
    reminder
  ){

    if(
      reminder &&
      Number(reminder.lastReminderAt)
    ){

      return Number(
        reminder.lastReminderAt
      );
    }

    const offerDate =
      Number(
        offer.createdAt ||
        offer.updatedAt ||
        offer.publishedAt
      );

    return Number.isFinite(offerDate)
      ? offerDate
      : Date.now();
  }

  function checkRecruitmentReminders(){

    const data =
      loadEmploymentData();

    const reminders =
      loadReminders();

    const now =
      Date.now();

    let employmentChanged =
      false;

    let remindersChanged =
      false;

    data.offers.forEach(function(offer){

      const offerId =
        String(
          offer.id || ""
        );

      if(!offerId){
        return;
      }

      if(!isOfferActive(offer)){

        if(reminders[offerId]){

          delete reminders[offerId];

          remindersChanged = true;
        }

        return;
      }

      const currentReminder =
        reminders[offerId] || {
          count:0,
          lastReminderAt:0
        };

      const referenceDate =
        getOfferReferenceDate(
          offer,
          currentReminder
        );

      if(
        now - referenceDate <
        SEVEN_DAYS
      ){
        return;
      }

      const newCount =
        Number(
          currentReminder.count || 0
        ) + 1;

      if(
        newCount >=
        MAX_REMINDERS
      ){

        offer.status =
          "masquee_absence_reponse";

        offer.hiddenAt =
          now;

        offer.hiddenReason =
          "Absence de réponse après quatre rappels de suivi.";

        reminders[offerId] = {
          count:newCount,
          lastReminderAt:now,
          status:"annonce_masquee",
          companyName:
            offer.companyName || "",
          email:
            offer.email ||
            offer.contactEmail ||
            "",
          title:
            offer.title || ""
        };

        employmentChanged = true;
        remindersChanged = true;

        console.info(
         "Bo'CitéArt Emploi : annonce masquée après quatre rappels.",
          offer.companyName,
          offer.title
        );

        return;
      }

      reminders[offerId] = {
        count:newCount,
        lastReminderAt:now,
        status:"rappel_a_envoyer",
        companyName:
          offer.companyName || "",
        email:
          offer.email ||
          offer.contactEmail ||
          "",
        title:
          offer.title || "",
        question:
          "Avez-vous terminé votre recrutement ?",
        answers:[
          "Oui",
          "Non"
        ]
      };

      remindersChanged = true;

      console.info(
         "Bo'CitéArt Emploi : rappel de recrutement préparé.",
        offer.companyName,
        offer.title,
        "Rappel " +
        newCount +
        " sur " +
        MAX_REMINDERS
      );
    });

    if(employmentChanged){

      saveEmploymentData(data);
    }

    if(remindersChanged){

      saveReminders(reminders);
    }

    updateDirectoryRecruitmentLights();
  }

  function observeDirectory(){

    const observer =
      new MutationObserver(function(){

        updateDirectoryRecruitmentLights();
      });

    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );
  }

  installRecruitmentStyles();

  observeDirectory();

  window.setTimeout(function(){

    checkRecruitmentReminders();

  },1200);

  window.setInterval(function(){

    checkRecruitmentReminders();

  },60 * 60 * 1000);

  window.addEventListener(
    "storage",
    function(event){

      if(
        event.key ===
        EMPLOYMENT_STORE_KEY
      ){

        updateDirectoryRecruitmentLights();
      }
    }
  );

  window.BociteEmploymentRecruitment = {
    updateDirectoryRecruitmentLights:
      updateDirectoryRecruitmentLights,
    checkRecruitmentReminders:
      checkRecruitmentReminders,
    companyHasActiveOffer:
      companyHasActiveOffer
  };

  console.log(
    "✅ Bo'CitéArt — Emploi • Recrutement chargé"
  );

})();

/* =========================================================
   BO'CITÉART — DIAGNOSTIC DU BOUTON RETOUR EMPLOI
   ========================================================= */

document.addEventListener(
  "click",
  function(event){

    const button =
      event.target &&
      typeof event.target.closest === "function"
        ? event.target.closest(
            "button"
          )
        : null;

    if(!button){
      return;
    }

    const text =
      String(
        button.textContent || ""
      )
      .replace(/\s+/g," ")
      .trim()
      .toLowerCase();

    if(
      text !== "retour" &&
      text !== "← retour"
    ){
      return;
    }

    const titleElement =
      document.querySelector(
        ".modal-title," +
        ".modalTitle," +
        ".modal-header h1," +
        ".modal-header h2," +
        ".modalHeader h1," +
        ".modalHeader h2"
      );

    console.log(
      "🔎 DIAGNOSTIC RETOUR = " +
      JSON.stringify({
        buttonId:
          button.id || "",

        buttonClass:
          String(
            button.className || ""
          ),

        buttonText:
          String(
            button.textContent || ""
          )
          .replace(/\s+/g," ")
          .trim(),

        modalTitle:
          titleElement
            ? String(
                titleElement.textContent || ""
              )
              .replace(/\s+/g," ")
              .trim()
            : "",

        currentScreen:
          window.BociteEntreprise &&
          window.BociteEntreprise.state
            ? window.BociteEntreprise.state.currentScreen
            : ""
      })
    );
  },
  true
);

/* =========================================================
   BO'CITÉART — MOTEUR FINANCIER CENTRAL V1
   TARIFS • ABONNEMENTS • PAIEMENTS • FACTURATION
   DROITS • GEL / RÉACTIVATION • COMPTABILITÉ

   IMPORTANT :
   - aucune donnée bancaire sensible de carte n'est stockée ici ;
   - les données PSP seront gérées côté serveur en production ;
   - l'IBAN Bo'CitéArt sera renseigné à un seul endroit ;
   - ce bloc prépare les raccordements futurs.
   ========================================================= */

(function initBociteFinancialEngine(){

  "use strict";

  const module =
    window.BociteEntreprise =
    window.BociteEntreprise || {};

  /* =======================================================
     1 — CONFIGURATION FINANCIÈRE CENTRALE
     ======================================================= */

  const FinancialConfig = {

    version: "1.0",

    issuer: {

      brand: "Bo'CitéArt",

      legalName: "",

      address: "",

      postalCode: "",

      city: "",

      country: "France",

      siret: "",

      siren: "",

      vatNumber: "",

      email: "",

      phone: ""

    },

    bank: {

      accountHolder: "",

      iban: "",

      bic: ""

    },

    providers: {

      cardPSP: "",

      sepaPSP: "",

      electronicInvoicePlatform: ""

    },

    subscription: {

      renewalMode:
        "annual",

      automaticRenewal:
        true,

      failedPaymentReminderDays:
        5,

      freezePremiumServices:
        true,

      preserveBasicAccess:
        true,

      preserveCustomerData:
        true

    }

  };

  module.FinancialConfig =
    FinancialConfig;


  /* =======================================================
     2 — CATALOGUE TARIFAIRE CENTRAL

     Les modules devront progressivement venir chercher
     leurs prix ici au lieu de les écrire en dur.
     ======================================================= */

  const PriceCatalog = {

    professionalMembership: {

      code:
        "PRO_MEMBERSHIP_ANNUAL",

      label:
        "Adhésion annuelle professionnelle",

      amountHT:
        329,

      vatRate:
        20,

      frequency:
        "annual",

      active:
        true

    },


    enrichedProfile: {

      code:
        "ENRICHED_PROFILE_ANNUAL",

      label:
        "Fiche enrichie",

      amountHT:
        199,

      vatRate:
        20,

      frequency:
        "annual",

      active:
        true

    },


    employmentPublication: {

      code:
        "EMPLOYMENT_PUBLICATION",

      label:
        "Publication d'une offre d'emploi",

      amountHT:
        50,

      vatRate:
        20,

      frequency:
        "one_time",

      active:
        true

    },


    advertisingPublication: {

      code:
        "ADVERTISING_PUBLICATION",

      label:
        "Publication publicitaire",

      amountHT:
        50,

      vatRate:
        20,

      frequency:
        "one_time",

      active:
        true

    },


    professionalOpportunity: {

      code:
        "PROFESSIONAL_OPPORTUNITY",

      label:
        "Opportunité professionnelle",

      amountHT:
        50,

      vatRate:
        20,

      frequency:
        "one_time",

      active:
        true

    },


    professionalSearchFranceMonthly: {

      code:
        "PRO_SEARCH_FRANCE_MONTHLY",

      label:
        "Recherche professionnelle France",

      amountHT:
        26.50,

      vatRate:
        20,

      frequency:
        "monthly",

      active:
        true

    },


    professionalSearchFranceAnnual: {

      code:
        "PRO_SEARCH_FRANCE_ANNUAL",

      label:
        "Recherche professionnelle France",

      amountHT:
        300,

      vatRate:
        20,

      frequency:
        "annual",

      active:
        true

    },


    professionalSearchEuropeMonthly: {

      code:
        "PRO_SEARCH_EUROPE_MONTHLY",

      label:
        "Recherche professionnelle Europe",

      amountHT:
        44.90,

      vatRate:
        20,

      frequency:
        "monthly",

      active:
        true

    },


    professionalSearchEuropeAnnual: {

      code:
        "PRO_SEARCH_EUROPE_ANNUAL",

      label:
        "Recherche professionnelle Europe",

      amountHT:
        500,

      vatRate:
        20,

      frequency:
        "annual",

      active:
        true

    }

  };

  module.PriceCatalog =
    PriceCatalog;


  /* =======================================================
     3 — CALCUL DES PRIX
     ======================================================= */

  function calculatePrice(
    product
  ){

    if(!product){
      return null;
    }

    const amountHT =
      Number(
        product.amountHT || 0
      );

    const vatRate =
      Number(
        product.vatRate || 0
      );

    const vatAmount =
      amountHT *
      vatRate /
      100;

    const amountTTC =
      amountHT +
      vatAmount;

    return {

      amountHT:
        Number(
          amountHT.toFixed(2)
        ),

      vatRate:
        vatRate,

      vatAmount:
        Number(
          vatAmount.toFixed(2)
        ),

      amountTTC:
        Number(
          amountTTC.toFixed(2)
        )

    };

  }

  module.calculateFinancialPrice =
    calculatePrice;


  /* =======================================================
     4 — ÉTATS D'ABONNEMENT
     ======================================================= */

  const SubscriptionStatus = {

    ACTIVE:
      "active",

    RENEWAL_PENDING:
      "renewal_pending",

    PAYMENT_PENDING:
      "payment_pending",

    FINAL_REMINDER:
      "final_reminder",

    PREMIUM_FROZEN:
      "premium_frozen",

    CANCELLED:
      "cancelled",

    EXPIRED:
      "expired"

  };

  module.SubscriptionStatus =
    SubscriptionStatus;


  /* =======================================================
     5 — ÉTATS DE PAIEMENT
     ======================================================= */

  const PaymentStatus = {

    CREATED:
      "created",

    PENDING:
      "pending",

    CONFIRMED:
      "confirmed",

    FAILED:
      "failed",

    REFUNDED:
      "refunded",

    PARTIALLY_REFUNDED:
      "partially_refunded",

    CANCELLED:
      "cancelled"

  };

  module.PaymentStatus =
    PaymentStatus;


  /* =======================================================
     6 — MOYENS DE PAIEMENT
     ======================================================= */

  const PaymentMethods = {

    CARD:
      "card",

    SEPA_DIRECT_DEBIT:
      "sepa_direct_debit",

    BANK_TRANSFER:
      "bank_transfer",

    PUBLIC_ENTITY_TRANSFER:
      "public_entity_transfer"

  };

  module.PaymentMethods =
    PaymentMethods;


  /* =======================================================
     7 — DROITS COLLABORATEURS
     ======================================================= */

  const ProfessionalPermissions = {

    ADVERTISING:
      "advertising",

    EMPLOYMENT:
      "employment",

    DIRECTORY:
      "directory",

    PROFESSIONAL_SEARCH:
      "professional_search",

    LOWER_CHARGES:
      "lower_charges",

    VISIBILITY:
      "visibility",

    BILLING_VIEW:
      "billing_view",

    BILLING_MANAGE:
      "billing_manage"

  };

  module.ProfessionalPermissions =
    ProfessionalPermissions;


  /* =======================================================
     8 — DROITS RÉSERVÉS AU RESPONSABLE PRINCIPAL

     Ces droits ne devront pas être délégués
     à un simple collaborateur.
     ======================================================= */

  const OwnerOnlyPermissions = {

    MANAGE_SUBSCRIPTION:
      "manage_subscription",

    CHANGE_PAYMENT_METHOD:
      "change_payment_method",

    MANAGE_COLLABORATORS:
      "manage_collaborators",

    CANCEL_SUBSCRIPTION:
      "cancel_subscription",

    MANAGE_BANK_DETAILS:
      "manage_bank_details"

  };

  module.OwnerOnlyPermissions =
    OwnerOnlyPermissions;


  /* =======================================================
     9 — JOURNAL FINANCIER LOCAL DE DÉMONSTRATION

     En production :
     stockage serveur + base de données.
     ======================================================= */

  const FINANCIAL_LOG_KEY =
    "bociteart_financial_log_v1";

  function loadFinancialLog(){

    try{

      const raw =
        localStorage.getItem(
          FINANCIAL_LOG_KEY
        );

      if(!raw){
        return [];
      }

      const data =
        JSON.parse(raw);

      return Array.isArray(data)
        ? data
        : [];

    }catch(error){

      console.error(
        "Bo'CitéArt : lecture du journal financier impossible.",
        error
      );

      return [];

    }

  }


  function saveFinancialLog(
    entries
  ){

    localStorage.setItem(
      FINANCIAL_LOG_KEY,
      JSON.stringify(
        entries
      )
    );

  }


  function addFinancialEvent(
    type,
    data
  ){

    const entries =
      loadFinancialLog();

    const event = {

      id:
        "BCA-EVT-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2,8)
          .toUpperCase(),

      type:
        type,

      date:
        new Date()
          .toISOString(),

      data:
        data || {}

    };

    entries.push(
      event
    );

    saveFinancialLog(
      entries
    );

    return event;

  }

  module.loadFinancialLog =
    loadFinancialLog;

  module.addFinancialEvent =
    addFinancialEvent;


  /* =======================================================
     10 — GEL DES SERVICES PREMIUM

     IMPORTANT :
     le compte n'est pas supprimé.
     Les données ne sont pas supprimées.
     Les fonctions de base restent accessibles.
     ======================================================= */

  const PREMIUM_STATUS_KEY =
    "bociteart_professional_premium_status_v1";


  function getPremiumStatus(){

    try{

      const raw =
        localStorage.getItem(
          PREMIUM_STATUS_KEY
        );

      if(!raw){

        return {
          frozen:false,
          reason:"",
          frozenAt:null
        };

      }

      return JSON.parse(raw);

    }catch(error){

      return {
        frozen:false,
        reason:"",
        frozenAt:null
      };

    }

  }


  function freezePremiumServices(
    reason
  ){

    const status = {

      frozen:
        true,

      reason:
        reason ||
        "payment_pending",

      frozenAt:
        new Date()
          .toISOString()

    };

    localStorage.setItem(
      PREMIUM_STATUS_KEY,
      JSON.stringify(
        status
      )
    );

    addFinancialEvent(
      "premium_services_frozen",
      status
    );

    return status;

  }


  function reactivatePremiumServices(){

    const status = {

      frozen:
        false,

      reason:
        "",

      frozenAt:
        null,

      reactivatedAt:
        new Date()
          .toISOString()

    };

    localStorage.setItem(
      PREMIUM_STATUS_KEY,
      JSON.stringify(
        status
      )
    );

    addFinancialEvent(
      "premium_services_reactivated",
      status
    );

    return status;

  }


  function canUsePremiumServices(){

    return !getPremiumStatus()
      .frozen;

  }


  module.getPremiumStatus =
    getPremiumStatus;

  module.freezePremiumServices =
    freezePremiumServices;

  module.reactivatePremiumServices =
    reactivatePremiumServices;

  module.canUsePremiumServices =
    canUsePremiumServices;


  /* =======================================================
     11 — PAIEMENT CONFIRMÉ

     Cette fonction sera appelée plus tard par le serveur
     après confirmation réelle du PSP / SEPA.

     Jamais sur un simple clic du client.
     ======================================================= */

  function confirmPayment(
    payment
  ){

    if(!payment){
      return false;
    }

    addFinancialEvent(
      "payment_confirmed",
      {

        paymentId:
          payment.id || "",

        invoiceId:
          payment.invoiceId || "",

        method:
          payment.method || "",

        amountHT:
          payment.amountHT || 0,

        vatAmount:
          payment.vatAmount || 0,

        amountTTC:
          payment.amountTTC || 0,

        providerFee:
          payment.providerFee || 0,

        netPayout:
          payment.netPayout || 0,

        providerTransactionId:
          payment.providerTransactionId || "",

        payoutReference:
          payment.payoutReference || ""

      }
    );

    reactivatePremiumServices();

    return true;

  }

  module.confirmFinancialPayment =
    confirmPayment;


  /* =======================================================
     12 — ÉCHEC DE PAIEMENT
     ======================================================= */

  function registerPaymentFailure(
    payment
  ){

    addFinancialEvent(
      "payment_failed",
      {

        paymentId:
          payment &&
          payment.id
            ? payment.id
            : "",

        reason:
          payment &&
          payment.reason
            ? payment.reason
            : "",

        date:
          new Date()
            .toISOString()

      }
    );

    return true;

  }

  module.registerPaymentFailure =
    registerPaymentFailure;


  /* =======================================================
     13 — RÉFÉRENCE UNIQUE POUR VIREMENT
     ======================================================= */

  function createBankTransferReference(){

    const date =
      new Date();

    return (
      "BCA-" +
      date.getFullYear() +
      "-" +
      Date.now()
        .toString()
        .slice(-8)
    );

  }

  module.createBankTransferReference =
    createBankTransferReference;


  /* =======================================================
     14 — MESURE DE LA VALEUR APPORTÉE AU PROFESSIONNEL

     Prépare :
     "Ce que Bo'CitéArt vous a apporté cette année"
     ======================================================= */

  const VALUE_KEY =
    "bociteart_professional_value_v1";


  function loadProfessionalValue(){

    try{

      const raw =
        localStorage.getItem(
          VALUE_KEY
        );

      if(!raw){

        return {

          profileViews:
            0,

          contacts:
            0,

          applications:
            0,

          professionalRequests:
            0,

          partnerships:
            0,

          advertisingActions:
            0,

          measuredSavings:
            0

        };

      }

      return JSON.parse(raw);

    }catch(error){

      return {

        profileViews:0,
        contacts:0,
        applications:0,
        professionalRequests:0,
        partnerships:0,
        advertisingActions:0,
        measuredSavings:0

      };

    }

  }


  function saveProfessionalValue(
    data
  ){

    localStorage.setItem(
      VALUE_KEY,
      JSON.stringify(
        data
      )
    );

  }


  module.loadProfessionalValue =
    loadProfessionalValue;

  module.saveProfessionalValue =
    saveProfessionalValue;


  /* =======================================================
     15 — INFORMATIONS BANCAIRES AFFICHABLES

     L'IBAN sera renseigné plus tard dans FinancialConfig.

     Aucun IBAN n'est écrit dans les autres modules.
     ======================================================= */

  function getBociteBankInformation(){

    return {

      accountHolder:
        FinancialConfig.bank
          .accountHolder,

      iban:
        FinancialConfig.bank
          .iban,

      bic:
        FinancialConfig.bank
          .bic

    };

  }

  module.getBociteBankInformation =
    getBociteBankInformation;


  /* =======================================================
     16 — INFORMATIONS ÉMETTEUR POUR LES FACTURES
     ======================================================= */

  function getInvoiceIssuer(){

    return Object.assign(
      {},
      FinancialConfig.issuer
    );

  }

  module.getInvoiceIssuer =
    getInvoiceIssuer;


  /* =======================================================
     17 — POINTS DE RACCORDEMENT PRODUCTION

     Ils seront remplacés/raccordés au serveur officiel.
     ======================================================= */

  module.FinancialConnectors = {

    createCardPayment:
      null,

    createSepaPayment:
      null,

    verifyBankTransfer:
      null,

    createInvoice:
      null,

    createCreditNote:
      null,

    sendInvoiceByEmail:
      null,

    sendPaymentReminder:
      null,

    exportAccounting:
      null,

    electronicInvoiceTransmission:
      null,

    reconcilePSPPayout:
      null

  };


  /* =======================================================
     18 — SÉCURITÉ

     Les numéros de carte, cryptogrammes et données
     bancaires sensibles ne doivent jamais être placés
     dans localStorage.
     ======================================================= */

  module.isFinancialEngineReady =
    function(){

      return true;

    };


  console.log(
    "✅ Bo'CitéArt — moteur financier central V1 chargé"
  );

  console.log(
    "✅ Catalogue tarifaire central préparé"
  );

  console.log(
    "✅ CB / PSP / SEPA / virement préparés"
  );

  console.log(
    "✅ Gel et réactivation des services premium préparés"
  );

  console.log(
    "✅ Droits collaborateurs et responsable préparés"
  );

  console.log(
    "✅ Rapprochement comptable et facturation préparés"
  );

   /* =========================================================
   BO'CITÉART — CIRCUITS DE PAIEMENT V1
   CB / PSP • SEPA • VIREMENT • MAIRIE
   COMMISSIONS • RAPPROCHEMENT • IMPAYÉS
   ========================================================= */

(function initBocitePaymentFlows(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : moteur Entreprise introuvable."
    );

    return;
  }

  /* =======================================================
     1. STOCKAGES
     ======================================================= */

  const ORDERS_KEY =
    "bociteart_financial_orders_v1";

  const PAYMENTS_KEY =
    "bociteart_financial_payments_v1";

  const PAYOUTS_KEY =
    "bociteart_financial_payouts_v1";

  const PUBLIC_INVOICES_KEY =
    "bociteart_public_entity_invoices_v1";


  function loadList(
    key
  ){

    try{

      const raw =
        localStorage.getItem(
          key
        );

      if(!raw){
        return [];
      }

      const data =
        JSON.parse(
          raw
        );

      return Array.isArray(data)
        ? data
        : [];

    }catch(error){

      return [];
    }
  }


  function saveList(
    key,
    data
  ){

    try{

      localStorage.setItem(
        key,
        JSON.stringify(
          Array.isArray(data)
            ? data
            : []
        )
      );

      return true;

    }catch(error){

      console.warn(
        "Bo'CitéArt : stockage financier impossible.",
        error
      );

      return false;
    }
  }


  function createId(
    prefix
  ){

    return (
      prefix +
      "-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,8)
        .toUpperCase()
    );
  }


  /* =======================================================
     2. CRÉATION D'UNE COMMANDE
     ======================================================= */

  function createFinancialOrder(
    options
  ){

    const input =
      options || {};

    const amountHT =
      Number(
        input.amountHT || 0
      );

    const vatRate =
      Number(
        input.vatRate || 0
      );

    const vatAmount =
      Number(
        input.vatAmount != null
          ? input.vatAmount
          : (
              amountHT *
              vatRate /
              100
            ).toFixed(2)
      );

    const amountTTC =
      Number(
        input.amountTTC != null
          ? input.amountTTC
          : (
              amountHT +
              vatAmount
            ).toFixed(2)
      );

    const order = {

      id:
        createId(
          "CMD"
        ),

      productCode:
        String(
          input.productCode || ""
        ),

      serviceType:
        String(
          input.serviceType || ""
        ),

      serviceLabel:
        String(
          input.serviceLabel ||
          "Service Bo'CitéArt"
        ),

      customerType:
        String(
          input.customerType ||
          "professional"
        ),

      customerId:
        String(
          input.customerId || ""
        ),

      customerName:
        String(
          input.customerName || ""
        ),

      customerEmail:
        String(
          input.customerEmail || ""
        ),

      customerSiret:
        String(
          input.customerSiret || ""
        ),

      amountHT:
        amountHT,

      vatRate:
        vatRate,

      vatAmount:
        vatAmount,

      amountTTC:
        amountTTC,

      currency:
        "EUR",

      paymentMethod:
        String(
          input.paymentMethod || ""
        ),

      status:
        "waiting_payment",

      invoiceId:
        "",

      paymentId:
        "",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )

    };

    const orders =
      loadList(
        ORDERS_KEY
      );

    orders.push(
      order
    );

    saveList(
      ORDERS_KEY,
      orders
    );

    if(
      typeof module.addFinancialEvent ===
      "function"
    ){

      module.addFinancialEvent(
        "order_created",
        order
      );
    }

    return order;
  }


  /* =======================================================
     3. PAIEMENT CB / PSP

     IMPORTANT :
     cette fonction prépare uniquement
     la demande.

     En production :
     le PSP renverra la confirmation serveur.
     ======================================================= */

  function createCardPayment(
    order
  ){

    if(!order){
      return null;
    }

    const payment = {

      id:
        createId(
          "PAY-CB"
        ),

      orderId:
        order.id,

      method:
        "card",

      status:
        "pending",

      grossAmount:
        Number(
          order.amountTTC || 0
        ),

      providerFee:
        0,

      netPayout:
        0,

      providerTransactionId:
        "",

      payoutReference:
        "",

      createdAt:
        Date.now(),

      confirmedAt:
        null

    };

    const payments =
      loadList(
        PAYMENTS_KEY
      );

    payments.push(
      payment
    );

    saveList(
      PAYMENTS_KEY,
      payments
    );

    return payment;
  }


  /* =======================================================
     4. CONFIRMATION PSP
     ======================================================= */

  function confirmCardPayment(
    paymentId,
    providerResult
  ){

    const payments =
      loadList(
        PAYMENTS_KEY
      );

    const payment =
      payments.find(
        function(item){

          return (
            item.id ===
            paymentId
          );
        }
      );

    if(!payment){

      return {
        ok:false,
        error:
          "Paiement introuvable."
      };
    }

    const result =
      providerResult || {};

    if(
      result.paid !==
      true
    ){

      payment.status =
        "failed";

      payment.failureReason =
        String(
          result.reason || ""
        );

      saveList(
        PAYMENTS_KEY,
        payments
      );

      if(
        typeof module.registerPaymentFailure ===
        "function"
      ){

        module.registerPaymentFailure(
          payment
        );
      }

      return {
        ok:false,
        payment:payment
      };
    }

    payment.status =
      "confirmed";

    payment.providerTransactionId =
      String(
        result.transactionId || ""
      );

    payment.providerFee =
      Number(
        result.providerFee || 0
      );

    payment.netPayout =
      Number(
        result.netPayout != null
          ? result.netPayout
          : (
              Number(
                payment.grossAmount || 0
              ) -
              Number(
                result.providerFee || 0
              )
            )
      );

    payment.confirmedAt =
      Date.now();

    saveList(
      PAYMENTS_KEY,
      payments
    );

    const orders =
      loadList(
        ORDERS_KEY
      );

    const order =
      orders.find(
        function(item){

          return (
            item.id ===
            payment.orderId
          );
        }
      );

    if(order){

      order.status =
        "paid";

      order.paymentId =
        payment.id;

      saveList(
        ORDERS_KEY,
        orders
      );
    }

    if(
      typeof module.confirmFinancialPayment ===
      "function"
    ){

      module.confirmFinancialPayment({

        id:
          payment.id,

        invoiceId:
          order
            ? order.invoiceId
            : "",

        method:
          "card",

        amountHT:
          order
            ? order.amountHT
            : 0,

        vatAmount:
          order
            ? order.vatAmount
            : 0,

        amountTTC:
          payment.grossAmount,

        providerFee:
          payment.providerFee,

        netPayout:
          payment.netPayout,

        providerTransactionId:
          payment.providerTransactionId,

        payoutReference:
          payment.payoutReference

      });
    }

    return {
      ok:true,
      payment:payment,
      order:order
    };
  }


  /* =======================================================
     5. SEPA / VIREMENT
     ======================================================= */

  function createSepaOrBankTransfer(
    order,
    method
  ){

    if(!order){
      return null;
    }

    const paymentMethod =
      method ===
      "sepa_direct_debit"
        ? "sepa_direct_debit"
        : "bank_transfer";

    const reference =
      typeof module.createBankTransferReference ===
      "function"
        ? module.createBankTransferReference()
        : createId(
            "BCA"
          );

    const payment = {

      id:
        createId(
          paymentMethod ===
          "sepa_direct_debit"
            ? "PAY-SEPA"
            : "PAY-VIR"
        ),

      orderId:
        order.id,

      method:
        paymentMethod,

      status:
        "pending",

      expectedAmount:
        Number(
          order.amountTTC || 0
        ),

      transferReference:
        reference,

      createdAt:
        Date.now(),

      confirmedAt:
        null

    };

    const payments =
      loadList(
        PAYMENTS_KEY
      );

    payments.push(
      payment
    );

    saveList(
      PAYMENTS_KEY,
      payments
    );

    return payment;
  }


  /* =======================================================
     6. CONFIRMATION SEPA / VIREMENT
     ======================================================= */

  function confirmSepaOrTransfer(
    paymentId,
    bankResult
  ){

    const payments =
      loadList(
        PAYMENTS_KEY
      );

    const payment =
      payments.find(
        function(item){

          return (
            item.id ===
            paymentId
          );
        }
      );

    if(!payment){

      return {
        ok:false
      };
    }

    const result =
      bankResult || {};

    if(
      result.confirmed !==
      true
    ){

      return {
        ok:false,
        payment:payment
      };
    }

    payment.status =
      "confirmed";

    payment.bankReference =
      String(
        result.bankReference || ""
      );

    payment.confirmedAt =
      Date.now();

    saveList(
      PAYMENTS_KEY,
      payments
    );

    const orders =
      loadList(
        ORDERS_KEY
      );

    const order =
      orders.find(
        function(item){

          return (
            item.id ===
            payment.orderId
          );
        }
      );

    if(order){

      order.status =
        "paid";

      order.paymentId =
        payment.id;

      saveList(
        ORDERS_KEY,
        orders
      );
    }

    if(
      typeof module.confirmFinancialPayment ===
      "function"
    ){

      module.confirmFinancialPayment({

        id:
          payment.id,

        method:
          payment.method,

        amountHT:
          order
            ? order.amountHT
            : 0,

        vatAmount:
          order
            ? order.vatAmount
            : 0,

        amountTTC:
          order
            ? order.amountTTC
            : payment.expectedAmount,

        providerFee:
          Number(
            result.providerFee || 0
          ),

        netPayout:
          Number(
            result.netPayout != null
              ? result.netPayout
              : payment.expectedAmount
          ),

        providerTransactionId:
          payment.bankReference,

        payoutReference:
          payment.bankReference

      });
    }

    return {
      ok:true,
      payment:payment,
      order:order
    };
  }


  /* =======================================================
     7. VERSEMENTS PSP ET COMMISSIONS
     ======================================================= */

  function recordPSPPayout(
    options
  ){

    const input =
      options || {};

    const payout = {

      id:
        createId(
          "PAYOUT"
        ),

      provider:
        String(
          input.provider || ""
        ),

      providerPayoutId:
        String(
          input.providerPayoutId || ""
        ),

      grossAmount:
        Number(
          input.grossAmount || 0
        ),

      providerFees:
        Number(
          input.providerFees || 0
        ),

      netAmount:
        Number(
          input.netAmount || 0
        ),

      bankReference:
        String(
          input.bankReference || ""
        ),

      status:
        "received",

      receivedAt:
        Date.now(),

      reconciled:
        false

    };

    const payouts =
      loadList(
        PAYOUTS_KEY
      );

    payouts.push(
      payout
    );

    saveList(
      PAYOUTS_KEY,
      payouts
    );

    if(
      typeof module.addFinancialEvent ===
      "function"
    ){

      module.addFinancialEvent(
        "psp_payout_received",
        payout
      );
    }

    return payout;
  }


  /* =======================================================
     8. RAPPROCHEMENT COMPTABLE PSP
     ======================================================= */

  function reconcilePSPPayout(
    payoutId
  ){

    const payouts =
      loadList(
        PAYOUTS_KEY
      );

    const payout =
      payouts.find(
        function(item){

          return (
            item.id ===
            payoutId
          );
        }
      );

    if(!payout){

      return {
        ok:false,
        reason:
          "payout_not_found"
      };
    }

    const payments =
      loadList(
        PAYMENTS_KEY
      )
      .filter(
        function(payment){

          return (
            payment.status ===
            "confirmed" &&
            payment.method ===
            "card"
          );
        }
      );

    const totalGross =
      payments.reduce(
        function(total,payment){

          return (
            total +
            Number(
              payment.grossAmount || 0
            )
          );

        },
        0
      );

    const totalFees =
      payments.reduce(
        function(total,payment){

          return (
            total +
            Number(
              payment.providerFee || 0
            )
          );

        },
        0
      );

    const expectedNet =
      Number(
        (
          totalGross -
          totalFees
        )
        .toFixed(2)
      );

    const difference =
      Number(
        (
          Number(
            payout.netAmount || 0
          ) -
          expectedNet
        )
        .toFixed(2)
      );

    payout.reconciled =
      Math.abs(
        difference
      ) < 0.01;

    payout.expectedNet =
      expectedNet;

    payout.difference =
      difference;

    payout.reconciledAt =
      Date.now();

    saveList(
      PAYOUTS_KEY,
      payouts
    );

    if(
      typeof module.addFinancialEvent ===
      "function"
    ){

      module.addFinancialEvent(
        payout.reconciled
          ? "psp_payout_reconciled"
          : "psp_payout_difference",
        {
          payoutId:
            payout.id,

          expectedNet:
            expectedNet,

          receivedNet:
            payout.netAmount,

          difference:
            difference
        }
      );
    }

    return {
      ok:
        payout.reconciled,

      payout:
        payout
    };
  }


  /* =======================================================
     9. MAIRIES / ORGANISMES PUBLICS

     Devis / commande / facture
     paiement différé.
     ======================================================= */

  function createPublicEntityInvoice(
    options
  ){

    const input =
      options || {};

    const invoice = {

      id:
        createId(
          "PUB-INV"
        ),

      customerType:
        "public",

      customerName:
        String(
          input.customerName || ""
        ),

      customerId:
        String(
          input.customerId || ""
        ),

      serviceLabel:
        String(
          input.serviceLabel || ""
        ),

      quoteReference:
        String(
          input.quoteReference || ""
        ),

      purchaseOrderReference:
        String(
          input.purchaseOrderReference || ""
        ),

      amountHT:
        Number(
          input.amountHT || 0
        ),

      vatRate:
        Number(
          input.vatRate || 0
        ),

      amountTTC:
        Number(
          input.amountTTC || 0
        ),

      status:
        "issued",

      paymentStatus:
        "waiting_payment",

      issuedAt:
        Date.now(),

      dueAt:
        Number(
          input.dueAt || 0
        ),

      reminderSentAt:
        null,

      paidAt:
        null

    };

    const rows =
      loadList(
        PUBLIC_INVOICES_KEY
      );

    rows.push(
      invoice
    );

    saveList(
      PUBLIC_INVOICES_KEY,
      rows
    );

    return invoice;
  }


  /* =======================================================
     10. CONTRÔLE IMPAYÉS MAIRIE
     ======================================================= */

  function publicEntityHasUnpaidInvoice(
    customerId
  ){

    return loadList(
      PUBLIC_INVOICES_KEY
    )
    .some(
      function(invoice){

        return (
          String(
            invoice.customerId || ""
          ) ===
          String(
            customerId || ""
          ) &&
          invoice.paymentStatus !==
          "paid"
        );
      }
    );
  }


  /* =======================================================
     11. BLOCAGE NOUVELLE PRESTATION PUBLIQUE
     ======================================================= */

  function canPublicEntityOrder(
    customerId
  ){

    return !publicEntityHasUnpaidInvoice(
      customerId
    );
  }


  /* =======================================================
     12. PAIEMENT MAIRIE CONFIRMÉ
     ======================================================= */

  function confirmPublicEntityPayment(
    invoiceId,
    paymentReference
  ){

    const rows =
      loadList(
        PUBLIC_INVOICES_KEY
      );

    const invoice =
      rows.find(
        function(item){

          return (
            item.id ===
            invoiceId
          );
        }
      );

    if(!invoice){

      return false;
    }

    invoice.paymentStatus =
      "paid";

    invoice.paymentReference =
      String(
        paymentReference || ""
      );

    invoice.paidAt =
      Date.now();

    saveList(
      PUBLIC_INVOICES_KEY,
      rows
    );

    if(
      typeof module.addFinancialEvent ===
      "function"
    ){

      module.addFinancialEvent(
        "public_invoice_paid",
        {
          invoiceId:
            invoice.id,

          customerId:
            invoice.customerId
        }
      );
    }

    return true;
  }


  /* =======================================================
     13. ABONNEMENT — ÉCHEC / J+5 / GEL
     ======================================================= */

  function processSubscriptionPaymentFailure(
    options
  ){

    const input =
      options || {};

    const failedAt =
      Number(
        input.failedAt ||
        Date.now()
      );

    const now =
      Date.now();

    const delayDays =
      5;

    const delayMs =
      delayDays *
      24 *
      60 *
      60 *
      1000;

    const elapsed =
      now -
      failedAt;

    if(
      elapsed <
      delayMs
    ){

      return {
        status:
          "payment_pending",

        freeze:
          false,

        remainingMs:
          delayMs -
          elapsed
      };
    }

    if(
      typeof module.freezePremiumServices ===
      "function"
    ){

      module.freezePremiumServices(
        "subscription_payment_unpaid"
      );
    }

    if(
      typeof module.addFinancialEvent ===
      "function"
    ){

      module.addFinancialEvent(
        "subscription_final_reminder",
        {
          failedAt:
            failedAt,

          processedAt:
            now
        }
      );
    }

    return {
      status:
        "premium_frozen",

      freeze:
        true
    };
  }


  /* =======================================================
     14. SERVICE GRATUIT / SERVICE PREMIUM
     ======================================================= */

  function requirePremiumService(
    callback
  ){

    if(
      typeof module.canUsePremiumServices ===
      "function" &&
      !module.canUsePremiumServices()
    ){

      alert(
        "Votre compte reste accessible, mais ce service professionnel est temporairement gelé.\n\n" +
        "Régularisez votre abonnement pour le réactiver."
      );

      if(
        typeof module.openSearchBilling ===
        "function"
      ){

        module.openSearchBilling();
      }

      return false;
    }

    if(
      typeof callback ===
      "function"
    ){

      callback();
    }

    return true;
  }


  /* =======================================================
     15. EXPORT COMPTABLE PRÉPARÉ
     ======================================================= */

  function buildAccountingExport(){

    return {

      generatedAt:
        new Date()
          .toISOString(),

      orders:
        loadList(
          ORDERS_KEY
        ),

      payments:
        loadList(
          PAYMENTS_KEY
        ),

      pspPayouts:
        loadList(
          PAYOUTS_KEY
        ),

      publicInvoices:
        loadList(
          PUBLIC_INVOICES_KEY
        ),

      financialLog:
        typeof module.loadFinancialLog ===
        "function"
          ? module.loadFinancialLog()
          : []

    };
  }


  /* =======================================================
     16. EXPOSITION
     ======================================================= */

  module.createFinancialOrder =
    createFinancialOrder;

  module.createCardPayment =
    createCardPayment;

  module.confirmCardPayment =
    confirmCardPayment;

  module.createSepaOrBankTransfer =
    createSepaOrBankTransfer;

  module.confirmSepaOrTransfer =
    confirmSepaOrTransfer;

  module.recordPSPPayout =
    recordPSPPayout;

  module.reconcilePSPPayout =
    reconcilePSPPayout;

  module.createPublicEntityInvoice =
    createPublicEntityInvoice;

  module.publicEntityHasUnpaidInvoice =
    publicEntityHasUnpaidInvoice;

  module.canPublicEntityOrder =
    canPublicEntityOrder;

  module.confirmPublicEntityPayment =
    confirmPublicEntityPayment;

  module.processSubscriptionPaymentFailure =
    processSubscriptionPaymentFailure;

  module.requirePremiumService =
    requirePremiumService;

  module.buildAccountingExport =
    buildAccountingExport;


  console.log(
    "✅ Bo'CitéArt — circuits de paiement V1 chargés"
  );

  console.log(
    "✅ Paiements CB / PSP préparés"
  );

  console.log(
    "✅ SEPA et virements préparés"
  );

  console.log(
    "✅ Commissions et versements PSP préparés"
  );

  console.log(
    "✅ Rapprochement comptable préparé"
  );

  console.log(
    "✅ Mairies et paiements différés préparés"
  );

  console.log(
    "✅ Impayés et gel des services premium préparés"
  );

})();
  /* =========================================================
   BO'CITÉART — FINALISATION CENTRALE DES PAIEMENTS V1
   PAIEMENT CONFIRMÉ → FACTURE → ACTIVATION DU SERVICE
   ========================================================= */

(function initBocitePaymentFinalization(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : moteur Entreprise introuvable."
    );

    return;
  }


  const ORDERS_KEY =
    "bociteart_financial_orders_v1";

  const OPPORTUNITY_KEY =
    "bociteart_professional_opportunities_v1";


  function loadList(
    key
  ){

    try{

      const raw =
        localStorage.getItem(
          key
        );

      const data =
        raw
          ? JSON.parse(raw)
          : [];

      return Array.isArray(data)
        ? data
        : [];

    }catch(error){

      return [];
    }
  }


  function saveList(
    key,
    data
  ){

    try{

      localStorage.setItem(
        key,
        JSON.stringify(
          Array.isArray(data)
            ? data
            : []
        )
      );

      return true;

    }catch(error){

      console.warn(
        "Bo'CitéArt : enregistrement impossible.",
        error
      );

      return false;
    }
  }


  /* =======================================================
     1. CRÉER LA FACTURE APRÈS PAIEMENT CONFIRMÉ
     ======================================================= */

  function createInvoiceFromOrder(
    order,
    payment
  ){

    if(
      !order ||
      typeof module.createPaidInvoice !==
      "function"
    ){

      return null;
    }

    /*
      Une commande ne doit produire
      qu'une seule facture.
    */

    if(order.invoiceId){

      return null;
    }


    const invoice =
      module.createPaidInvoice({

        customerType:
          order.customerType ||
          "professional",

        customerName:
          order.customerName ||
          "",

        customerEmail:
          order.customerEmail ||
          "",

        customerSiret:
          order.customerSiret ||
          "",

        serviceType:
          order.serviceType ||
          "",

        serviceLabel:
          order.serviceLabel ||
          "Service Bo'CitéArt",

        operationCategory:
          "service",

        amountHT:
          Number(
            order.amountHT || 0
          ),

        vatRate:
          Number(
            order.vatRate || 0
          ),

        amountVAT:
          Number(
            order.vatAmount || 0
          ),

        amountTTC:
          Number(
            order.amountTTC || 0
          ),

        orderReference:
          order.id,

        paymentStatus:
          "paid",

        paymentMethod:
          payment
            ? payment.method || ""
            : "",

        paymentReference:
          payment
            ? (
                payment.providerTransactionId ||
                payment.bankReference ||
                payment.transferReference ||
                payment.id ||
                ""
              )
            : "",

        paidAt:
          payment &&
          payment.confirmedAt
            ? payment.confirmedAt
            : Date.now(),

        status:
          "paid"

      });


    if(!invoice){
      return null;
    }


    const orders =
      loadList(
        ORDERS_KEY
      );

    const storedOrder =
      orders.find(
        function(item){

          return (
            item.id ===
            order.id
          );
        }
      );


    if(storedOrder){

      storedOrder.invoiceId =
        invoice.id;

      storedOrder.invoiceNumber =
        invoice.number || "";

      storedOrder.status =
        "completed";

      storedOrder.completedAt =
        Date.now();

      saveList(
        ORDERS_KEY,
        orders
      );
    }


    return invoice;
  }


  /* =======================================================
     2. ACTIVER UNE OPPORTUNITÉ PROFESSIONNELLE
     ======================================================= */

  function activateProfessionalOpportunity(
    order,
    payment,
    invoice
  ){

    if(
      !order ||
      order.serviceType !==
      "professional_opportunity"
    ){
      return false;
    }


    const opportunities =
      loadList(
        OPPORTUNITY_KEY
      );


    const opportunity =
      opportunities.find(
        function(item){

          return (
            item.orderId ===
            order.id
          );
        }
      );


    if(!opportunity){

      return false;
    }


    opportunity.paymentStatus =
      "paid";

    opportunity.publicationStatus =
      "published";

    opportunity.paymentId =
      payment
        ? payment.id || ""
        : "";

    opportunity.invoiceId =
      invoice
        ? invoice.id || ""
        : "";

    opportunity.invoiceNumber =
      invoice
        ? invoice.number || ""
        : "";

    opportunity.publishedAt =
      Date.now();

    opportunity.publishedAtFr =
      new Date()
        .toLocaleString(
          "fr-FR"
        );


    saveList(
      OPPORTUNITY_KEY,
      opportunities
    );


    if(
      typeof module.addFinancialEvent ===
      "function"
    ){

      module.addFinancialEvent(
        "professional_opportunity_published",
        {

          opportunityId:
            opportunity.id,

          orderId:
            order.id,

          paymentId:
            payment
              ? payment.id || ""
              : "",

          invoiceId:
            invoice
              ? invoice.id || ""
              : ""

        }
      );
    }


    return true;
  }


  /* =======================================================
     3. FINALISATION UNIQUE

     Plus tard :
     publicité,
     emploi,
     abonnement,
     fiche enrichie,
     autres services
     utiliseront cette même entrée.
     ======================================================= */

  function finalizeFinancialOrder(
    order,
    payment
  ){

    if(!order){

      return {
        ok:false,
        reason:
          "order_missing"
      };
    }


    const invoice =
      createInvoiceFromOrder(
        order,
        payment
      );


    let serviceActivated =
      false;


    if(
      order.serviceType ===
      "professional_opportunity"
    ){

      serviceActivated =
        activateProfessionalOpportunity(
          order,
          payment,
          invoice
        );
    }


    if(
      typeof module.addFinancialEvent ===
      "function"
    ){

      module.addFinancialEvent(
        "financial_order_finalized",
        {

          orderId:
            order.id,

          serviceType:
            order.serviceType || "",

          paymentId:
            payment
              ? payment.id || ""
              : "",

          invoiceId:
            invoice
              ? invoice.id || ""
              : "",

          serviceActivated:
            serviceActivated

        }
      );
    }


    return {

      ok:true,

      order:
        order,

      payment:
        payment || null,

      invoice:
        invoice || null,

      serviceActivated:
        serviceActivated

    };
  }


  module.finalizeFinancialOrder =
    finalizeFinancialOrder;


  /* =======================================================
     4. RACCORDEMENT AU PAIEMENT CARTE EXISTANT
     ======================================================= */

  if(
    typeof module.confirmCardPayment ===
    "function" &&
    !module.__cardFinalizationConnected
  ){

    module.__cardFinalizationConnected =
      true;


    const originalConfirmCardPayment =
      module.confirmCardPayment;


    module.confirmCardPayment =
      function(){

        const result =
          originalConfirmCardPayment
            .apply(
              module,
              arguments
            );


        if(
          result &&
          result.ok === true &&
          result.order
        ){

          finalizeFinancialOrder(
            result.order,
            result.payment || null
          );
        }


        return result;
      };
  }


  /* =======================================================
     5. RACCORDEMENT SEPA / VIREMENT EXISTANT
     ======================================================= */

  if(
    typeof module.confirmSepaOrTransfer ===
    "function" &&
    !module.__sepaFinalizationConnected
  ){

    module.__sepaFinalizationConnected =
      true;


    const originalConfirmSepaOrTransfer =
      module.confirmSepaOrTransfer;


    module.confirmSepaOrTransfer =
      function(){

        const result =
          originalConfirmSepaOrTransfer
            .apply(
              module,
              arguments
            );


        if(
          result &&
          result.ok === true &&
          result.order
        ){

          finalizeFinancialOrder(
            result.order,
            result.payment || null
          );
        }


        return result;
      };
  }


  console.log(
    "✅ Finalisation centrale des paiements raccordée"
  );

  console.log(
    "✅ Paiement confirmé → facture → activation du service"
  );

})(); 
/* =========================================================
   BO'CITÉART — GESTION DES COLLABORATEURS V1
   ÉCRAN RÉSERVÉ AU RESPONSABLE
   ACCÈS 1 + ACCÈS 2
   ========================================================= */

(function initBociteCollaboratorManagement(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(
    !module ||
    !module.collaborators
  ){

    console.error(
      "Bo'CitéArt : moteur collaborateurs introuvable."
    );

    return;
  }


  /* =======================================================
     OUTILS
     ======================================================= */

  function escapeValue(value){

    return String(
      value == null
        ? ""
        : value
    )
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
  }


  function getElement(id){

    return document.getElementById(
      id
    );
  }


  /*
    Pour la démo actuelle, on récupère l'identifiant
    de la structure professionnelle disponible.

    Le raccordement officiel au compte serveur
    remplacera ensuite cette résolution.
  */

  function getCurrentStructureId(){

    try{

      if(
        typeof module.getCurrentProfessionalId ===
        "function"
      ){

        const id =
          module.getCurrentProfessionalId();

        if(id){
          return String(id);
        }
      }

    }catch(error){
      /* secours ci-dessous */
    }


    try{

      const registration =
        window.BoCiteArtRegistration;

      if(
        registration &&
        typeof registration.getCurrentAccount ===
        "function"
      ){

        const account =
          registration.getCurrentAccount();

        if(account){

          return String(
            account.structureId ||
            account.companyId ||
            account.siret ||
            account.id ||
            "bociteart-demo-structure"
          );
        }
      }

    }catch(error){
      /* secours ci-dessous */
    }


    return "bociteart-demo-structure";
  }


  function emptyCollaborator(slot){

    return {

      slot:
        slot,

      firstName:
        "",

      lastName:
        "",

      email:
        "",

      phone:
        "",

      active:
        false,

      revoked:
        false,

      activationCode:
        "",

      permissions:{

        advertising:false,
        employment:false,
        news:false,
        visibility:false,
        directory:false

      }

    };
  }


  function getCollaboratorBySlot(
    structureId,
    slot
  ){

    const list =
      module.collaborators
        .getCollaborators(
          structureId
        );


    const found =
      list.find(
        function(item){

          return (
            Number(item.slot) ===
            Number(slot)
          );
        }
      );


    return (
      found ||
      emptyCollaborator(slot)
    );
  }


  /* =======================================================
     CARTE D'UN COLLABORATEUR
     ======================================================= */

  function collaboratorCardHtml(
    collaborator,
    slot
  ){

    const permissions =
      collaborator.permissions ||
      {};


    const exists =
      Boolean(
        collaborator.id
      );


    const active =
      exists &&
      collaborator.active === true &&
      collaborator.revoked !== true;


    const statusText =
      active
        ? "Accès actif"
        : exists
          ? "Accès coupé"
          : "Aucun collaborateur";


    return `

      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
          ">
          Accès ${slot}
        </div>


        <div
          style="
            margin-top:6px;
            color:#111111;
            font-size:14px;
            font-weight:400;
          ">
          ${statusText}
        </div>


        <label
          style="
            display:block;
            margin-top:12px;
            font-weight:400;
          ">
          Prénom
        </label>

        <input
          id="collabFirstName${slot}"
          class="miniField"
          type="text"
          value="${escapeValue(
            collaborator.firstName
          )}"
          style="
            background:#ffffff;
            color:#111111;
          "
        >


        <label
          style="
            display:block;
            margin-top:8px;
            font-weight:400;
          ">
          Nom
        </label>

        <input
          id="collabLastName${slot}"
          class="miniField"
          type="text"
          value="${escapeValue(
            collaborator.lastName
          )}"
          style="
            background:#ffffff;
            color:#111111;
          "
        >


        <label
          style="
            display:block;
            margin-top:8px;
            font-weight:400;
          ">
          E-mail
        </label>

        <input
          id="collabEmail${slot}"
          class="miniField"
          type="email"
          value="${escapeValue(
            collaborator.email
          )}"
          style="
            background:#ffffff;
            color:#111111;
          "
        >


        <label
          style="
            display:block;
            margin-top:8px;
            font-weight:400;
          ">
          Téléphone
        </label>

        <input
          id="collabPhone${slot}"
          class="miniField"
          type="tel"
          value="${escapeValue(
            collaborator.phone
          )}"
          style="
            background:#ffffff;
            color:#111111;
          "
        >


        <div
          style="
            margin-top:14px;
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
          ">
          Autorisations
        </div>


        <label
          style="
            display:block;
            margin-top:8px;
            font-weight:400;
          ">

          <input
            id="collabAdvertising${slot}"
            type="checkbox"
            ${
              permissions.advertising
                ? "checked"
                : ""
            }
          >

          Publicité dans le grand bandeau

        </label>


        <label
          style="
            display:block;
            margin-top:6px;
            font-weight:400;
          ">

          <input
            id="collabEmployment${slot}"
            type="checkbox"
            ${
              permissions.employment
                ? "checked"
                : ""
            }
          >

          Emploi

        </label>


        <label
          style="
            display:block;
            margin-top:6px;
            font-weight:400;
          ">

          <input
            id="collabNews${slot}"
            type="checkbox"
            ${
              permissions.news
                ? "checked"
                : ""
            }
          >

          Actualités

        </label>


        <label
          style="
            display:block;
            margin-top:6px;
            font-weight:400;
          ">

          <input
            id="collabVisibility${slot}"
            type="checkbox"
            ${
              permissions.visibility
                ? "checked"
                : ""
            }
          >

          Visibilité

        </label>


        <label
          style="
            display:block;
            margin-top:6px;
            font-weight:400;
          ">

          <input
            id="collabDirectory${slot}"
            type="checkbox"
            ${
              permissions.directory
                ? "checked"
                : ""
            }
          >

          Annuaire professionnel

        </label>


        <button
          id="collabSave${slot}"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:14px;
            background:#ffffff !important;
            color:#111111 !important;
          ">
          Enregistrer les autorisations
        </button>


        <button
          id="collabRenew${slot}"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
            background:#ffffff !important;
            color:#111111 !important;
          ">
          ${
            exists
              ? "Créer un nouvel accès"
              : "Créer l'accès"
          }
        </button>


        ${
          exists
            ? `

              <button
                id="collabCut${slot}"
                type="button"
                style="
                  width:100%;
                  margin-top:12px;
                  padding:12px;
                  border:2px solid #b00020;
                  border-radius:10px;
                  background:#ffffff;
                  color:#b00020;
                  font-size:14px;
                  font-weight:800;
                  cursor:pointer;
                ">
                COUPER L'ACCÈS ${slot}
              </button>

            `
            : ""
        }

      </div>

    `;
  }


  /* =======================================================
     ÉCRAN RESPONSABLE
     ======================================================= */

  function openCollaboratorManagement(){

    const structureId =
      getCurrentStructureId();


    const collaborator1 =
      getCollaboratorBySlot(
        structureId,
        1
      );


    const collaborator2 =
      getCollaboratorBySlot(
        structureId,
        2
      );


    const html = `

      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
          ">
          Mes collaborateurs
        </div>

        <div
          style="
            margin-top:8px;
            color:#111111;
            font-size:14px;
            font-weight:400;
          ">

          Vous pouvez créer jusqu'à
          deux accès collaborateurs.

          <br><br>

          Choisissez uniquement
          les fonctions que vous souhaitez
          leur confier.

          <br><br>

          Chaque collaborateur accède
          à son propre espace privé.
          Il n'accède pas à votre
          Tableau de Direction.

        </div>

      </div>


      ${collaboratorCardHtml(
        collaborator1,
        1
      )}


      ${collaboratorCardHtml(
        collaborator2,
        2
      )}

    `;


    if(
      typeof module.renderModulePage ===
      "function"
    ){

      module.renderModulePage(
        "Gestion des collaborateurs",
        html,
        {
          afterRender:
            function(){

              bindCollaboratorManagement(
                structureId
              );
            }
        }
      );

      return;
    }


    if(
      typeof module.renderModal ===
      "function"
    ){

      module.renderModal(
        "Gestion des collaborateurs",
        html
      );


      setTimeout(
        function(){

          bindCollaboratorManagement(
            structureId
          );

        },
        0
      );

      return;
    }


    alert(
      "L'espace collaborateurs est momentanément indisponible."
    );
  }


  /* =======================================================
     LECTURE DU FORMULAIRE
     ======================================================= */

  function readCollaboratorForm(
    slot
  ){

    const firstName =
      getElement(
        "collabFirstName" +
        slot
      );


    const lastName =
      getElement(
        "collabLastName" +
        slot
      );


    const email =
      getElement(
        "collabEmail" +
        slot
      );


    const phone =
      getElement(
        "collabPhone" +
        slot
      );


    return {

      firstName:
        firstName
          ? firstName.value
          : "",

      lastName:
        lastName
          ? lastName.value
          : "",

      email:
        email
          ? email.value
          : "",

      phone:
        phone
          ? phone.value
          : "",

      permissions:{

        advertising:
          Boolean(
            getElement(
              "collabAdvertising" +
              slot
            ) &&
            getElement(
              "collabAdvertising" +
              slot
            ).checked
          ),

        employment:
          Boolean(
            getElement(
              "collabEmployment" +
              slot
            ) &&
            getElement(
              "collabEmployment" +
              slot
            ).checked
          ),

        news:
          Boolean(
            getElement(
              "collabNews" +
              slot
            ) &&
            getElement(
              "collabNews" +
              slot
            ).checked
          ),

        visibility:
          Boolean(
            getElement(
              "collabVisibility" +
              slot
            ) &&
            getElement(
              "collabVisibility" +
              slot
            ).checked
          ),

        directory:
          Boolean(
            getElement(
              "collabDirectory" +
              slot
            ) &&
            getElement(
              "collabDirectory" +
              slot
            ).checked
          )

      }

    };
  }


  /* =======================================================
     ENREGISTREMENT
     ======================================================= */

  function saveSlot(
    structureId,
    slot
  ){

    const data =
      readCollaboratorForm(
        slot
      );


    if(
      !String(
        data.firstName || ""
      ).trim() ||
      !String(
        data.lastName || ""
      ).trim()
    ){

      alert(
        "Renseignez le prénom et le nom du collaborateur."
      );

      return null;
    }


    if(
      !String(
        data.email || ""
      ).trim()
    ){

      alert(
        "Renseignez l'adresse e-mail du collaborateur."
      );

      return null;
    }


    const result =
      module.collaborators
        .save(
          structureId,
          slot,
          data
        );


    if(
      !result ||
      result.ok !== true
    ){

      alert(
        "L'accès collaborateur n'a pas pu être enregistré."
      );

      return null;
    }


    return result;
  }


  /* =======================================================
     BOUTONS
     ======================================================= */

  function bindCollaboratorManagement(
    structureId
  ){

    [1,2].forEach(
      function(slot){

        const saveButton =
          getElement(
            "collabSave" +
            slot
          );


        const renewButton =
          getElement(
            "collabRenew" +
            slot
          );


        const cutButton =
          getElement(
            "collabCut" +
            slot
          );


        if(saveButton){

          saveButton.onclick =
            function(){

              const result =
                saveSlot(
                  structureId,
                  slot
                );


              if(!result){
                return;
              }


              alert(
                "Les informations et autorisations de l'accès " +
                slot +
                " sont enregistrées."
              );


              openCollaboratorManagement();
            };
        }


        if(renewButton){

          renewButton.onclick =
            function(){

              let collaborator =
                getCollaboratorBySlot(
                  structureId,
                  slot
                );


              /*
                Si le collaborateur n'existe pas encore,
                on commence par enregistrer sa fiche.
              */

              if(!collaborator.id){

                const saved =
                  saveSlot(
                    structureId,
                    slot
                  );


                if(!saved){
                  return;
                }


                collaborator =
                  saved.collaborator;
              }


              const result =
                module.collaborators
                  .renewAccess(
                    structureId,
                    slot
                  );


              if(
                !result ||
                result.ok !== true
              ){

                alert(
                  "Le nouvel accès n'a pas pu être créé."
                );

                return;
              }


              alert(
                "NOUVEL ACCÈS " +
                slot +
                "\n\n" +
                "Code initial à transmettre au collaborateur :\n\n" +
                result.activationCode +
                "\n\n" +
                "L'ancien accès est désormais invalidé."
              );


              openCollaboratorManagement();
            };
        }


        if(cutButton){

          cutButton.onclick =
            function(){

              const confirmed =
                window.confirm(
                  "Couper immédiatement l'accès " +
                  slot +
                  " ?\n\n" +
                  "Le collaborateur ne pourra plus utiliser son espace ni les fonctions qui lui étaient autorisées."
                );


              if(!confirmed){
                return;
              }


              const result =
                module.collaborators
                  .cutAccess(
                    structureId,
                    slot
                  );


              if(
                !result ||
                result.ok !== true
              ){

                alert(
                  "L'accès n'a pas pu être coupé."
                );

                return;
              }


              alert(
                "L'accès " +
                slot +
                " est maintenant coupé."
              );


              openCollaboratorManagement();
            };
        }

      }
    );
  }


  /* =======================================================
     EXPOSITION
     ======================================================= */

  module.openCollaboratorManagement =
    openCollaboratorManagement;

   module.registerScreen(
  "collaborateurs",
  function(){

    if(
      typeof module.openCollaboratorManagement ===
      "function"
    ){

      module.openCollaboratorManagement();
      return;
    }

    alert(
      "L'espace collaborateurs est momentanément indisponible."
    );
  }
);


  console.log(
    "✅ Gestion des 2 collaborateurs chargée"
  );

  console.log(
    "✅ Accès 1 et Accès 2 réservés au responsable"
  );

})();

  /* =========================================================
   BO'CITÉART — RACCORDEMENT PUBLICITÉ
   TABLEAU DE DIRECTION → GRAND BANDEAU
   ========================================================= */

(function connectDirectionAdvertising(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){
    return;
  }

  module.registerScreen(
    "publicite",
    function(){

      if(
        typeof window.openTicker ===
        "function"
      ){

        window.openTicker();
        return;
      }

      alert(
        "Le calendrier du grand bandeau publicitaire est momentanément indisponible."
      );
    }
  );

  console.log(
    "✅ Publicité raccordée au Tableau de Direction"
  );

})(); 
   
})();
