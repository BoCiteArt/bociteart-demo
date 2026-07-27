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

 function buildBackButton(){
    
    if(
      state.currentScreen === "home" &&
      !state.nestedParentScreen
    ){
      return "";
    }

    return `
      <button
        class="choiceBtn"
        id="entrepriseBackBtn"
        type="button"
        style="
          width:100%;
          margin-bottom:14px;
        ">
        ← Retour à la page précédente
      </button>
    `;
  }

  function buildPresentationFooter(){

    return `
      <div
        class="box entreprisePresentationFooter"
        style="
          margin-top:18px;
          border-left:6px solid #2f5d46;
          cursor:pointer;
        "
        role="button"
        tabindex="0">

        <strong style="font-size:17px;">
          Vous pourriez également être intéressé.
        </strong>

        <br><br>

        Cliquez ici pour revenir
        aux propositions en bandes défilantes
        de l’espace Entreprise.

        <button
          class="choiceBtn entrepriseReturnToBandsBtn"
          type="button"
          style="
            width:100%;
            margin-top:12px;
          ">
          Revenir aux bandes défilantes
        </button>
      </div>
    `;
  }

  function bindBackButton(){

    const button =
      getElement("entrepriseBackBtn");

    if(button){

      button.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();

        goBack();
      };
    }
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

  function renderModal(title, html, options){

    options = options || {};

    if(!requireOpenModal()){
      return;
    }

    /*
      Lorsqu’une fonction ouvre directement
      une nouvelle fenêtre sans openScreen(),
      on mémorise la rubrique principale
      afin que Retour y ramène.
    */

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
      buildBackButton() +
      html +
      footer,
      {
        noHistory:true
      }
    );

    window.setTimeout(function(){

      bindBackButton();
      bindPresentationFooter();

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
    "bociteart_entreprise_directory_demo_v1";

  const demoCompanies = [
    {
      id:"ENT-001",
      name:"ABC Électricité",
      activity:"Installation électrique",
      description:
        "Installation, dépannage et entretien électrique pour particuliers et professionnels.",
      city:"Wattignies",
      address:"Wattignies",
      phone:"",
      website:"",
      partner:false
    },
    {
      id:"ENT-002",
      name:"Acier Nord",
      activity:"Métallerie industrielle",
      description:
        "Fabrication et transformation de pièces métalliques pour les professionnels.",
      city:"Wattignies",
      address:"Wattignies",
      phone:"",
      website:"",
      partner:false
    },
    {
      id:"ENT-003",
      name:"Bâtir Conseil",
      activity:"Conseil dans le bâtiment",
      description:
        "Conseil, accompagnement et préparation de projets dans le secteur du bâtiment.",
      city:"Wattignies",
      address:"Wattignies",
      phone:"",
      website:"",
      partner:true
    },
    {
      id:"ENT-004",
      name:"Cabinet Horizon",
      activity:"Expertise comptable",
      description:
        "Expertise comptable, gestion et accompagnement des entreprises.",
      city:"Wattignies",
      address:"Wattignies",
      phone:"",
      website:"",
      partner:true
    },
    {
      id:"ENT-005",
      name:"Menuiserie du Centre",
      activity:"Menuiserie",
      description:
        "Menuiserie intérieure, extérieure et réalisations sur mesure.",
      city:"Wattignies",
      address:"Wattignies",
      phone:"",
      website:"",
      partner:false
    },
    {
      id:"ENT-006",
      name:"Services Techniques du Nord",
      activity:"Maintenance professionnelle",
      description:
        "Maintenance, entretien et services techniques destinés aux entreprises.",
      city:"Wattignies",
      address:"Wattignies",
      phone:"",
      website:"",
      partner:false
    }
  ];

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadDirectory(){

    try{

      const raw =
        localStorage.getItem(DIRECTORY_STORE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(Array.isArray(parsed) && parsed.length){
        return parsed;
      }

    }catch(error){

      console.warn(
        "Lecture de l’annuaire local impossible :",
        error
      );
    }

    return demoCompanies.slice();
  }

  function saveDirectory(companies){

    try{

      localStorage.setItem(
        DIRECTORY_STORE_KEY,
        JSON.stringify(companies || [])
      );

    }catch(error){

      console.warn(
        "Enregistrement de l’annuaire impossible :",
        error
      );
    }
  }

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function sortCompanies(companies){

    return companies.slice().sort(function(a,b){

      return String(a.name || "").localeCompare(
        String(b.name || ""),
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
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:20px;
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

        Ils produisent,
        recrutent
        et proposent des produits
        ou des services,
        sans toujours être suffisamment connus
        des habitants
        ni même des autres professionnels.

        <br><br>

        <strong>
          Avant de rechercher ailleurs,
          commencez par découvrir
          ce qui existe déjà dans votre commune.
        </strong>

      </div>

      <div class="box entrepriseInfoBox">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:18px;
          ">
          À quoi sert cet annuaire ?
        </strong>

        <br>

        Il permet de rechercher rapidement :

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

        Cette visibilité constitue
        le point de départ
        de nouvelles relations locales :

        <br><br>

        • recommandations ;<br>
        • demandes de devis ;<br>
        • recrutements ;<br>
        • partenariats ;<br>
        • sous-traitance ;<br>
        • développement de l’activité.

        <br><br>

        L’annuaire ne remplace pas
        les autres thèmes de l’application.

        <br><br>

        Il permet d’abord
        de savoir qui existe,
        où se trouve l’entreprise
        et ce qu’elle peut proposer.

      </div>

      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:18px;
          ">
          Un annuaire régulièrement actualisé
        </strong>

        <br>

        Contrairement à une simple liste,

        <strong>
          <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
        </strong>

        a vocation à suivre
        l’évolution des entreprises.

        <br><br>

        Les informations de situation
        proviendront exclusivement
        de données publiques officielles.

        <br><br>

        Elles permettront notamment
        de repérer une entreprise :

        <br><br>

        🟢 active ;<br><br>

        🔵 dont les informations
        ont récemment été mises à jour ;<br><br>

        🟠 faisant l’objet
        d’une procédure collective publiée ;<br><br>

        🔴 faisant l’objet
        d’une liquidation judiciaire publiée ;<br><br>

        ⚪ radiée
        ou dont l’activité a cessé.

        <br><br>

        Ces indications auront pour objectif
        de mieux informer les utilisateurs.

        <br><br>

        Elles ne remplaceront jamais
        la consultation des publications
        et registres officiels.

      </div>

      <div class="box">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:18px;
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
    getElement("entrepriseDirectorySearch");

  const filter =
    getElement("entrepriseDirectoryFilter");

  const list =
    getElement("entrepriseDirectoryList");

  const count =
    getElement("entrepriseDirectoryCount");

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
    loadDirectory().filter(function(company){

      const searchable =
        normalizeText(
          [
            company.name,
            company.activity,
            company.description,
            company.city
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
    });

  companies =
    sortCompanies(companies);

  if(count){

    count.textContent =
      companies.length +
      " entreprise(s) trouvée(s).";
  }

  if(!companies.length){

    list.innerHTML = `
      <div class="box entrepriseInfoBox">
        Aucune entreprise ne correspond
        à votre recherche.
      </div>
    `;

    return;
  }

  list.innerHTML =
    companies.map(function(company){

      const badge =
        company.partner
          ? `
            <span
              style="
                display:inline-block;
                margin-top:7px;
                padding:5px 8px;
                border-radius:999px;
                background:#e6f3ea;
                color:#2f5d46;
                font-size:11px;
                font-weight:900;
              ">
              Partenaire Bo'CitéArt
            </span>
          `
          : `
            <span
              style="
                display:inline-block;
                margin-top:7px;
                padding:5px 8px;
                border-radius:999px;
                background:#efe4d3;
                color:#333;
                font-size:11px;
                font-weight:900;
              ">
              Référencement officiel
            </span>
          `;

      return `
        <div class="box entrepriseInfoBox">

          <strong
            style="font-size:16px;">
            ${escapeValue(company.name)}
          </strong>

          <br>

          <span
            style="
              font-weight:900;
              color:#2f5d46;
            ">
            ${escapeValue(company.activity)}
          </span>

          <div
            style="
              margin-top:8px;
              line-height:1.45;
            ">
            ${escapeValue(company.description)}
          </div>

          ${badge}

          <div style="margin-top:10px;">

            <button
              class="choiceBtn entrepriseDirectoryOpen"
              type="button"
              data-company-id="${escapeValue(company.id)}">

              Consulter la fiche

            </button>

          </div>

        </div>
      `;

    }).join("");

  list
    .querySelectorAll(
      ".entrepriseDirectoryOpen"
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
    getElement("entrepriseDirectorySearch");

  const filter =
    getElement("entrepriseDirectoryFilter");

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
        <div class="box entrepriseInfoBox">

          <strong>
            Fiche Bo'CitéArt enrichie
          </strong>

          <br><br>

          Cette entreprise peut présenter
          ses services,
          ses réalisations,
          ses recrutements,
          ses actualités
          et ses engagements locaux.

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
        <div class="box entrepriseInfoBox">

          Cette fiche reprend actuellement
          les informations publiques disponibles.

          <br><br>

          L’entreprise pourra enrichir volontairement
          sa présentation
          en devenant partenaire Bo'CitéArt.

        </div>
      `;

  module.renderModal(
    company.name,
    `
      <div class="box entrepriseInfoBox">

        <strong>
          Que fait cette entreprise ?
        </strong>

        <br><br>

        ${escapeValue(company.description)}

      </div>

      <div class="box entrepriseInfoBox">

        <strong>
          Activité
        </strong>

        <br>

        ${escapeValue(company.activity)}

        <br><br>

        <strong>
          Commune
        </strong>

        <br>

        ${escapeValue(company.city)}

      </div>

      ${partnerContent}
    `
  );

  window.setTimeout(function(){

    const quoteButton =
      getElement("companyRequestQuoteBtn");

    const recruitmentButton =
      getElement("companyRecruitmentBtn");

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

function getLocalAnswer(question){

  const normalized =
    normalizeText(question);

  if(
    normalized.includes("electricien") ||
    normalized.includes("plombier") ||
    normalized.includes("menuisier") ||
    normalized.includes("comptable") ||
    normalized.includes("avocat")
  ){

    return {
      text:
        "Bo'CitéArt vous propose de commencer par les professionnels présents dans votre commune.",
      actionLabel:
        "Consulter les entreprises de la ville",
      actionScreen:
        "annuaire"
    };
  }

  if(
    normalized.includes("personnel") ||
    normalized.includes("salarie") ||
    normalized.includes("recrut") ||
    normalized.includes("emploi")
  ){

    return {
      text:
        "Commencez par informer les habitants de votre ville. Les compétences recherchées sont souvent déjà près de chez vous.",
      actionLabel:
        "Ouvrir la rubrique Emploi",
      actionScreen:
        "emploi"
    };
  }

  if(
    normalized.includes("charge") ||
    normalized.includes("electricite") ||
    normalized.includes("gaz") ||
    normalized.includes("assurance") ||
    normalized.includes("telephone")
  ){

    return {
      text:
        "Consultez les regroupements déjà ouverts. Plus les participants sont nombreux, plus la négociation peut devenir favorable.",
      actionLabel:
        "Voir les mutualisations",
      actionScreen:
        "mutualisation"
    };
  }

  if(
    normalized.includes("mecenat") ||
    normalized.includes("don") ||
    normalized.includes("soutenir")
  ){

    return {
      text:
        "Le mécénat peut renforcer votre présence locale tout en soutenant une action utile au territoire.",
      actionLabel:
        "Découvrir le mécénat",
      actionScreen:
        "mecenat"
    };
  }

  return {
    text:
      "Votre demande a bien été prise en compte. La version définitive recherchera d’abord les solutions de votre ville, puis celles des communes voisines.",
    actionLabel:
      "Voir les entreprises de la ville",
    actionScreen:
      "annuaire"
  };
}

function bindHomeAi(){

  const button =
    getElement("entrepriseAiAskBtn");

  if(!button){
    return;
  }

  button.onclick = function(){

    const input =
      getElement("entrepriseAiQuestion");

    const answerBox =
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

    if(!answerBox){
      return;
    }

    const result =
      getLocalAnswer(question);

    answerBox.innerHTML = `
      <div class="box entrepriseInfoBox">

        ${escapeValue(result.text)}

        <br><br>

        <button
          class="choiceBtn"
          id="entrepriseAiResultBtn"
          type="button">

          ${escapeValue(result.actionLabel)}

        </button>

      </div>
    `;

    window.setTimeout(function(){

      const resultButton =
        getElement("entrepriseAiResultBtn");

      if(resultButton){

        resultButton.onclick = function(){

          module.openScreen(
            result.actionScreen
          );
        };
      }

    },0);
  };
}

const originalHome =
  module.screens.home;

module.registerScreen(
  "home",
  function(){

    originalHome();

    window.setTimeout(function(){

      bindHomeAi();

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

<div class="box" style="
border-left:6px solid #2f5d46; 
font-weight:400;
color:#222;
line-height:1.8;
">

<h2 style="color:#2f5d46;font-weight:700;">
BO'CITÉ<span style="color:#c62828;">ART</span> — EMPLOI
</h2>

<h3 style="margin-top:25px;color:#2f5d46;font-weight:600;">
Pourquoi recrutons-nous de plus en plus difficilement ?
</h3>

<p>Chaque jour, des entreprises recrutent.</p>

<p>Chaque jour, des habitants recherchent un emploi.</p>

<p>Des jeunes cherchent leur voie.</p>

<p>Des adultes souhaitent se reconvertir.</p>

<p>Des écoles recherchent des entreprises pour les stages, les alternances et les apprentissages.</p>

<p>Des collectivités souhaitent préserver l'emploi local.</p>

<p>Pourtant, malgré tous ces besoins, les rencontres deviennent plus difficiles.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<p>Nous parlons souvent de pénurie de main-d'œuvre.</p>

<p>De difficultés de recrutement.</p>

<p>De manque de compétences.</p>

<p>Mais si le véritable problème se trouvait ailleurs&nbsp;?</p>

<p>Avant de pouvoir recruter, encore faut-il être connu.</p>

<p>Avant de choisir une entreprise, encore faut-il savoir qu'elle existe.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Un territoire rempli d'entreprises... souvent invisibles
</h3>

<p>Pouvez-vous citer spontanément cinq entreprises de votre commune, en dehors des grandes enseignes&nbsp;?</p>

<p>Connaissez-vous réellement leurs activités&nbsp;?</p>

<p>Les métiers qu'elles exercent&nbsp;?</p>

<p>Leurs savoir-faire&nbsp;?</p>

<p>Les postes qu'elles recrutent régulièrement&nbsp;?</p>

<p>Très souvent, la réponse est non.</p>

<p>Pourtant, ces entreprises sont parfois installées à quelques centaines de mètres de chez vous.</p>

<p>Nous passons devant leurs bâtiments chaque jour.</p>

<p>Nous voyons leurs ateliers.</p>

<p>Leurs véhicules.</p>

<p>Leurs entrepôts.</p>

<p>Mais à force de les voir... nous ne les regardons plus.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<p>Derrière ces murs travaillent pourtant des femmes et des hommes qui créent, fabriquent, innovent, réparent, entretiennent, conçoivent et transmettent leur savoir-faire.</p>

<p>Des métiers existent.</p>

<p>Des emplois existent.</p>

<p>Des CDI existent.</p>

<p>Des stages existent.</p>

<p>Des alternances existent.</p>

<p>Des apprentissages existent.</p>

<p>Des opportunités existent.</p>

<p>Mais une grande partie de cette richesse économique reste encore invisible.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Cette invisibilité a un coût
</h3>

<p>Les entreprises peinent davantage à recruter.</p>

<p>Les habitants cherchent parfois loin ce qui existe pourtant près de chez eux.</p>

<p>Les jeunes ignorent des métiers qui pourraient les passionner.</p>

<p>Les établissements scolaires rencontrent davantage de difficultés pour trouver des partenaires.</p>

<p>Les collectivités perdent une partie de leur dynamique économique.</p>

<p>Chaque acteur avance souvent de son côté alors que tous poursuivent finalement le même objectif&nbsp;: faire vivre durablement leur territoire.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Et si nous commencions simplement par mieux nous connaître ?
</h3>

<p><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span> propose une approche différente.</p>

<p>Avant de vouloir recruter davantage...</p>

<p>Commençons par rendre visibles les entreprises qui existent déjà.</p>

<p>Faire connaître leurs métiers.</p>

<p>Leurs savoir-faire.</p>

<p>Leurs équipes.</p>

<p>Leurs produits.</p>

<p>Leurs services.</p>

<p>Leurs recrutements.</p>

<p>Leurs besoins.</p>

<p>Car une entreprise connue inspire davantage confiance qu'une entreprise que personne ne connaît.</p>

<p>Lorsqu'un habitant découvre les entreprises de sa commune, il devient naturellement un relais d'information.</p>

<p>Il peut orienter un proche vers une entreprise qui recrute.</p>

<p>Conseiller un jeune recherchant un stage.</p>

<p>Parler d'une alternance.</p>

<p>Faire découvrir un apprentissage.</p>

<p>Recommander un savoir-faire local.</p>

<p>Petit à petit, chaque habitant devient lui aussi un ambassadeur économique de son territoire.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Les écoles retrouvent naturellement leur place
</h3>

<p>Les élèves découvrent progressivement les métiers qui existent autour d'eux.</p>

<p>Ils imaginent plus concrètement leur avenir professionnel.</p>

<p>Les établissements scolaires trouvent plus facilement des entreprises pour :</p>

<p>Les stages.</p>

<p>Les apprentissages.</p>

<p>Les alternances.</p>

<p>Les visites d'entreprises.</p>

<p>Les rencontres entre professionnels et jeunes.</p>

<p>L'entreprise redevient ainsi un acteur naturel de la vie locale.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
La commune devient un véritable facilitateur
</h3>

<p>Accompagnée par <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span>, la mairie dispose enfin d'un outil lui permettant de mieux faire connaître les richesses économiques de son territoire.</p>

<p>Son rôle n'est pas de remplacer les entreprises.</p>

<p>Son rôle est de faciliter leur visibilité.</p>

<p>Son rôle est de rendre plus visibles les entreprises, les commerces, les artisans, les associations, les emplois et les initiatives qui contribuent chaque jour au dynamisme du territoire.</p>

<p>Parce qu'un territoire ne peut valoriser que ce qu'il rend vraiment visible.</p>

<p>Aucun acteur local ne devrait rester invisible sur son propre territoire.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Découvrir avant de rechercher
</h3>

<p>La plupart des recherches d'emploi commencent aujourd'hui par une annonce.</p>

<p><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span> propose de commencer autrement.</p>

<p>Avant même de rechercher un emploi, un stage, une alternance ou un apprentissage, encore faut-il connaître les entreprises qui existent réellement autour de soi.</p>

<p>Chaque commune possède des entreprises parfois installées depuis plusieurs dizaines d'années que beaucoup d'habitants ignorent totalement.</p>

<p>Grâce à <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span>, chacun découvre progressivement le tissu économique de son territoire.</p>

<p>Une liste simple présente les entreprises implantées dans chaque commune partenaire.</p>

<p>Au fil des adhésions des collectivités, de nouvelles communes viennent enrichir automatiquement cet annuaire vivant.</p>

<p>Les entreprises sont ensuite proposées par proximité afin de permettre à chacun de découvrir naturellement les richesses économiques situées autour de son domicile.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Les entreprises partenaires vont encore plus loin
</h3>

<p>Toutes les entreprises participent à la richesse économique d'un territoire.</p>

<p>C'est pourquoi chacune peut être identifiée dans l'annuaire afin de faire connaître l'ensemble du tissu économique local.</p>

<p>Les entreprises qui choisissent de devenir partenaires de <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span> bénéficient d'une visibilité renforcée.</p>

<p>Leur fiche devient alors un véritable espace de présentation.</p>

<p>Les habitants peuvent découvrir leurs activités, leurs métiers, leurs savoir-faire, leurs coordonnées, leurs horaires, leurs recrutements, leurs stages, leurs apprentissages, leurs alternances ainsi que les informations utiles qu'elles souhaitent partager.</p>

<p>Cette présence permanente permet à l'entreprise d'être identifiée avant même qu'un besoin n'apparaisse.</p>

<p>Lorsqu'elle recrute, recherche un partenaire, souhaite développer son activité ou faire connaître un nouveau service, elle s'appuie déjà sur une visibilité construite dans le temps.</p>

<p>Elle ne devient plus seulement visible lorsqu'elle publie une annonce ; elle devient naturellement identifiable tout au long de l'année.</p>

<p>Ainsi, chaque entreprise choisit librement le niveau de visibilité qu'elle souhaite donner à son activité, tout en participant au rayonnement économique de son territoire.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Un annuaire vivant et régulièrement actualisé
</h3>

<p>L'annuaire <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span> évolue avec la vie économique du territoire.</p>

<p>Grâce à l'intelligence artificielle et aux sources d'information disponibles, les nouvelles entreprises, les changements d'activité, les modifications d'adresse et les fermetures peuvent être repérés plus rapidement.</p>

<p>Ces informations sont ensuite vérifiées et actualisées régulièrement afin de proposer un guide économique aussi fidèle et utile que possible.</p>

<p>Les entreprises partenaires peuvent également compléter directement leur fiche et maintenir leurs informations à jour.</p>

<p>Au fil de l'arrivée de nouvelles communes partenaires, la cartographie économique s'enrichit progressivement et permet de découvrir les entreprises situées de plus en plus largement autour de soi.</p>

<p>L'annuaire devient ainsi un outil vivant, construit dans le temps avec les collectivités, les entreprises et les acteurs du territoire.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Une démarche où chacun est gagnant
</h3>

<p>Le citoyen découvre plus facilement les entreprises, les métiers, les commerces, les artisans et les services qui existent autour de lui.</p>

<p>L'entreprise développe sa visibilité, facilite ses recrutements et crée plus naturellement de nouvelles opportunités.</p>

<p>Les écoles trouvent davantage de partenaires pour les stages, les apprentissages, les alternances et les projets pédagogiques.</p>

<p>Les associations gagnent en visibilité et créent plus facilement de nouveaux liens avec les habitants et les entreprises.</p>

<p>La mairie dispose d'une méthode concrète pour mieux relier les acteurs de son territoire et valoriser les initiatives locales.</p>

<p>Lorsque chacun trouve plus facilement les autres, les échanges se développent, les collaborations se multiplient et le territoire devient progressivement plus dynamique.</p>

<p>Bo'Cité<span style="color:#c62828;">Art</span> ne crée pas cette richesse.</p>

<p>Elle existe déjà.</p>

<p>Il la révèle, la relie et contribue à la rendre plus visible.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Une dynamique portée par tout un territoire
</h3>

<p><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span> n'a pas vocation à agir à la place des entreprises, des collectivités, des associations ou des habitants.</p>

<p>Son rôle est de leur permettre de mieux se connaître, de mieux se rencontrer et de mieux coopérer autour d'une vision commune du territoire.</p>

<p>Chaque entreprise qui rejoint cette démarche renforce la visibilité du tissu économique local. Chaque habitant qui découvre une activité près de chez lui participe à cette dynamique. Chaque école, chaque association et chaque collectivité vient enrichir ce réseau de relations.</p>

<p>Progressivement, les initiatives cessent d'évoluer côte à côte pour commencer à avancer ensemble.</p>

<p>C'est cette mise en relation permanente qui crée de nouvelles opportunités, favorise l'emploi, développe les partenariats et contribue à renforcer durablement l'attractivité du territoire.</p>

<p><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span> n'est pas la richesse du territoire.</p>

<p>La richesse existe déjà.</p>

<p>Son ambition est de la révéler, de la relier et de permettre à chacun d'en devenir pleinement acteur.</p>

<h3 style="color:#2f5d46;font-weight:600;">
Une nouvelle façon de faire vivre son territoire
</h3>

<p><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span> n'a pas vocation à remplacer ce qui existe déjà.</p>

<p>Sa vocation est de relier durablement les habitants, les entreprises, les commerces, les artisans, les associations, les établissements scolaires, les clubs sportifs et les collectivités autour d'une même dynamique territoriale.</p>

<p>Chaque acteur conserve son identité, son rôle et son autonomie, tout en devenant plus facilement visible, accessible et identifiable par les autres.</p>

<p>En facilitant ces rencontres, le territoire apprend progressivement à mieux se connaître, à mieux consommer localement, à mieux recruter, à mieux transmettre ses savoir-faire et à développer davantage de coopérations.</p>

<p><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span> n'ajoute pas une structure supplémentaire. Il crée les liens qui permettent aux initiatives déjà présentes de produire davantage de valeur lorsqu'elles agissent ensemble.</p>

<p>Parce qu'un territoire devient véritablement plus fort lorsque chacun connaît enfin les richesses qui l'entourent et peut naturellement entrer en relation avec elles.</p>

<h3 style="color:#2f5d46;font-weight:600;">
Pourquoi devenir partenaire Bo'CitéArt ?
</h3>

<p>Rejoindre Bo'Cité<span style="color:#c62828;">Art</span>, ce n'est pas simplement apparaître dans un annuaire économique.</p>

<p>C'est intégrer un écosystème où chaque rubrique renforce les autres.</p>

<p>Une entreprise peut d'abord rechercher de nouveaux collaborateurs.</p>

<p>Puis développer sa visibilité.</p>

<p>Fidéliser sa clientèle.</p>

<p>Mutualiser certaines dépenses avec d'autres entreprises.</p>

<p>Découvrir de nouvelles opportunités de développement.</p>

<p>S'engager dans des actions de mécénat.</p>

<p>Préparer la transmission de son activité.</p>

<p>Valoriser ses métiers.</p>

<p>Faire connaître ses savoir-faire.</p>

<p>Créer de nouveaux partenariats.</p>

<p>Aucune de ces rubriques n'a été pensée pour fonctionner seule.</p>

<p>Elles ont été conçues pour se compléter et produire davantage de valeur lorsqu'elles sont utilisées ensemble.</p>

<p>La mairie, accompagnée par Bo'Cité<span style="color:#c62828;">Art</span>, devient alors le facilitateur de cette dynamique territoriale.</p>

<p>Les entreprises gagnent en visibilité.</p>

<p>Les habitants découvrent plus facilement les richesses économiques de leur territoire.</p>

<p>Les écoles trouvent davantage de partenaires.</p>

<p>Les associations créent de nouveaux liens.</p>

<p>Les collectivités disposent enfin d'un outil capable de relier durablement l'ensemble des acteurs locaux.</p>

<p>Chacun y trouve plus facilement sa place, ses besoins, ses opportunités et de nouvelles perspectives de développement.</p>

<hr style="border:none;border-top:1px solid #b7d2c2;margin:28px 0;">

<h3 style="color:#2f5d46;font-weight:600;">
Un territoire ne manque pas de richesses. Il manque simplement d'un moyen de les rendre visibles, de les relier et de leur permettre d'agir ensemble. Voilà toute l'ambition de <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span> : l'Art de relier les femmes, les hommes, les initiatives et les opportunités qui font vivre un territoire.
</h3>

<p>Cette introduction constitue la porte d'entrée de l'univers Entreprise de <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span>.</p>

<p>En découvrant progressivement les différentes rubriques, chaque dirigeant comprend que l'objectif n'est pas de proposer un outil supplémentaire.</p>

<p>L'objectif est de relier durablement les entreprises, les habitants, les collectivités, les écoles, les associations et l'ensemble des acteurs du territoire.</p>

<p>Communication, visibilité, emploi, fidélisation, mutualisation, mécénat, développement, économies, transmission…</p>

<p>Chaque rubrique répond à un besoin concret.</p>

<p>Mais c'est lorsqu'elles fonctionnent ensemble qu'elles prennent toute leur valeur.</p>

<p>Une entreprise devient plus visible.</p>

<p>Elle recrute plus facilement.</p>

<p>Elle développe plus naturellement son activité.</p>

<p>Les habitants découvrent les richesses économiques de leur territoire.</p>

<p>Les écoles trouvent davantage de partenaires.</p>

<p>Les collectivités disposent enfin d'un véritable outil de mise en relation.</p>

<p>Progressivement, chacun comprend mieux le rôle des autres et les collaborations deviennent plus naturelles.</p>

<p>Bo'Cité<span style="color:#c62828;">Art</span> ne relie pas uniquement des fonctionnalités.</p>

<p>Il relie les femmes, les hommes, les compétences, les initiatives et les opportunités qui font vivre un territoire.</p>

<p>C'est en créant ces liens que l'on renforce durablement l'économie locale.</p>

<p>Parce qu'un territoire devient plus fort lorsque chacun peut enfin découvrir, connaître et rencontrer les autres.</p>

<p>Et lorsque tous avancent enfin dans la même direction.</p>

<div style="text-align:center;margin-top:35px;">

<button class="action-btn"
        onclick="openEntrepriseHome();"
        style="margin:6px;">
Retour
</button>

<button class="action-btn"
        onclick="openEmploymentHome();"
        style="margin:6px;">
Découvrir l'espace Emploi
</button>

<button class="action-btn"
        onclick="openEmploymentCompaniesDirectory();"
        style="margin:6px;">
Découvrir les entreprises autour de moi
</button>

</div>

</div>

`;

}
function openEmploymentIntroduction(){

  module.renderModal(
    "Emploi",
    getEmploymentIntroductionHtml()
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
    font-weight:700;
    line-height:1.4;
  `;

  const textStyle = `
    color:#111;
    font-weight:400;
    line-height:1.7;
  `;

  return `

    <div
      style="
        display:flex;
        justify-content:flex-start;
        margin-bottom:16px;
      ">

      <button
        class="choiceBtn"
        id="employmentBackBtn"
        type="button"
        style="
          width:auto;
          min-width:120px;
        ">
        ← Retour
      </button>

    </div>

    <div
      class="box entrepriseInfoBox"
      style="
        border-left:6px solid #2f5d46;
        ${textStyle}
      ">

      <div
        style="
          ${titleStyle}
          font-size:19px;
        ">
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

      <div
        style="
          ${titleStyle}
          font-size:17px;
        ">
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
      style="${textStyle}">

      <div
        style="
          ${titleStyle}
          font-size:17px;
        ">
        Aucune offre ne correspond actuellement ?
      </div>

      <br>

      <div style="${textStyle}">
        Le citoyen peut envoyer
        une candidature spontanée
        à une entreprise de sa ville,
        même si celle-ci
        n’a pas encore publié d’offre.

        <br><br>

        La candidature reste conservée
        dans l’espace privé de l’entreprise.

        <br><br>

        Elle pourra retrouver le candidat
        plusieurs mois plus tard
        lorsqu’un nouveau besoin apparaîtra.
      </div>

    </div>

    <div
      class="box entrepriseInfoBox"
      style="
        border-left:6px solid #2f5d46;
        ${textStyle}
      ">

      <div
        style="
          ${titleStyle}
          font-size:17px;
        ">
        Offres actuellement disponibles
      </div>

      <br>

      <div style="${textStyle}">
        Nombre d’offres ouvertes :

        <span
          style="
            color:#2f5d46;
            font-size:20px;
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

      <div
        style="
          ${titleStyle}
          font-size:17px;
        ">
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

    const backButton =
  getElement(
    "employmentBackBtn"
  );

if(backButton){

  backButton.onclick = function(){

    module.openScreen("home");

  };

} 
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
          value="Wattignies"
          placeholder="Commune">

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
      getElement("employmentCommitmentCheck");

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

    if(!commitment || !commitment.checked){
      alert(
        "Vous devez confirmer que l’offre sera clôturée lorsque le poste sera pourvu."
      );
      return;
    }

    const data =
      loadEmploymentData();

    data.offers.push({
      id:createOfferId(),
      companyName:companyName,
      companyId:companyId,
      email:email,
      title:title,
      description:description,
      contract:contract,
      city:city,
      status:"publiee",
      createdAt:Date.now(),
      createdAtFr:
        new Date().toLocaleString("fr-FR"),
      updatedAt:null,
      closedAt:null
    });

    saveEmploymentData(data);

    alert(
      "Offre enregistrée dans la démonstration.\n\n" +
      "Elle sera diffusée après validation du paiement."
    );

    openEmploymentOffers();
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

  function openEmploymentOffers(){

    module.renderModal(
      "Offres d’emploi",
      `
        <div class="box entrepriseInfoBox">

          Les habitants consultent ici
          les offres disponibles
          dans leur ville.

          <br><br>

          Ils peuvent répondre uniquement
          à l’annonce choisie.

        </div>

        <div id="employmentOffersList"></div>
      `
    );

    window.setTimeout(function(){

      renderEmploymentOffers();

    },0);
  }

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
        <div class="box entrepriseInfoBox">

          Aucune offre n’est enregistrée
          pour le moment.

        </div>
      `;

      return;
    }

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
      data.offers.find(function(item){

        return item.id === offerId;
      });

    if(!offer){

      alert(
        "Offre introuvable."
      );

      return;
    }

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

    module.renderModal(
      "Répondre à l’offre",
      `
        <div
          class="box entrepriseInfoBox"
          style="
            border-left:6px solid #2f5d46;
          ">

          <strong
            style="
              font-size:17px;
            ">
            ${escapeValue(offer.title)}
          </strong>

          <br><br>

          <strong>
            ${escapeValue(offer.companyName)}
          </strong>

          <br><br>

          ${escapeValue(offer.city)}

          •

          ${escapeValue(offer.contract)}

        </div>

        <label
          style="
            font-weight:900;
          ">
          Nom et prénom
        </label>

        <input
          id="applicationCandidateName"
          class="miniField"
          type="text"
          autocomplete="name"
          placeholder="Nom et prénom">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Adresse e-mail
        </label>

        <input
          id="applicationCandidateEmail"
          class="miniField"
          type="email"
          autocomplete="email"
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
          id="applicationCandidatePhone"
          class="miniField"
          type="tel"
          autocomplete="tel"
          placeholder="Téléphone">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Message au recruteur
        </label>

        <textarea
          id="applicationCandidateMessage"
          class="miniField"
          style="
            min-height:110px;
          "
          placeholder="Présentez brièvement votre candidature"></textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          CV
        </label>

        <input
          id="applicationCandidateCv"
          class="miniField"
          type="file"
          accept=".pdf,.doc,.docx">

        <div
          class="box entrepriseInfoBox"
          style="
            margin-top:12px;
          ">

          Le CV est transmis uniquement
          pour cette offre.

          <br><br>

          Il n’est pas déposé
          dans un espace public
          et n’est pas accessible
          à l’ensemble des entreprises.

          <br><br>

          Dans cette démonstration,
          seul le nom du fichier est enregistré localement.
          Le contenu réel du CV n’est pas envoyé
          vers un serveur.

        </div>

        <label class="miniCheck">

          <input
            id="applicationConsentCheck"
            type="checkbox">

          <span>
            J’accepte que cette entreprise conserve
            ma candidature dans son historique
            afin de pouvoir me recontacter ultérieurement.
          </span>

        </label>

        <button
          id="applicationSendBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:14px;
          ">
          Envoyer ma candidature
        </button>
      `
    );

    window.setTimeout(function(){

      const sendButton =
        getElement(
          "applicationSendBtn"
        );

      if(sendButton){

        sendButton.onclick = function(){

          saveApplication(
            offerId
          );
        };
      }

    },0);
  }

  function saveApplication(offerId){

    const name =
      String(
        getElement("applicationCandidateName")
          ? getElement("applicationCandidateName").value
          : ""
      ).trim();

    const email =
      String(
        getElement("applicationCandidateEmail")
          ? getElement("applicationCandidateEmail").value
          : ""
      ).trim();

    const phone =
      String(
        getElement("applicationCandidatePhone")
          ? getElement("applicationCandidatePhone").value
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

    const consent =
      getElement(
        "applicationConsentCheck"
      );

    if(
      !name ||
      !email ||
      !phone ||
      !message
    ){

      alert(
        "Veuillez remplir vos coordonnées et votre message."
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
      !cvInput ||
      !cvInput.files ||
      !cvInput.files.length
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

    const data =
      loadEmploymentData();

    const offer =
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

    data.applications.push({

      id:
        "CAND-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2,7),

      offerId:
        offerId,

      offerTitle:
        offer.title,

      companyName:
        offer.companyName,

      candidateName:
        name,

      candidateEmail:
        email,

      candidatePhone:
        phone,

      message:
        message,

      cvName:
        cvInput.files[0].name,

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          ),

      status:
        "recue"
    });

    saveEmploymentData(
      data
    );

    alert(
      "Votre candidature a été transmise à l’entreprise."
    );

    openEmploymentOffers();
  }

  function openEmploymentApplications(){

    module.renderModal(
      "Candidatures reçues",
      `
        <div class="box entrepriseInfoBox">

          Cet espace appartient au Tableau de Direction
          de l’entreprise.

          <br><br>

          Les candidatures sont conservées dans l’historique
          afin de permettre un contact ultérieur.

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
      data.applications
        .slice()
        .sort(function(a,b){

          return (
            Number(b.createdAt) -
            Number(a.createdAt)
          );
        });

    if(!applications.length){

      host.innerHTML = `
        <div class="box entrepriseInfoBox">

          Aucune candidature reçue.

        </div>
      `;

      return;
    }

    host.innerHTML =
      applications.map(function(application){

        return `
          <div class="box entrepriseInfoBox">

            <strong>
              ${escapeValue(application.candidateName)}
            </strong>

            <br><br>

            Offre :

            ${escapeValue(application.offerTitle)}

            <br>

            Entreprise :

            ${escapeValue(application.companyName)}

            <br><br>

            E-mail :

            ${escapeValue(application.candidateEmail)}

            <br>

            Téléphone :

            ${escapeValue(application.candidatePhone)}

            <br><br>

            Message :

            ${escapeValue(application.message)}

            <br><br>

            CV :

            ${escapeValue(application.cvName)}

            <br><br>

            Reçue le :

            ${escapeValue(application.createdAtFr)}

          </div>
        `;
      }).join("");
  }

  function getLoyaltyHtml(){

    return `
      <div
        class="box entrepriseInfoBox"
        style="
          border-left:6px solid #2f5d46;
        ">

        <strong
          style="
            font-size:19px;
          ">
          Faites d’abord connaître votre entreprise
          partout dans la ville
        </strong>

        <br><br>

        Les citoyens doivent savoir
        ce que fait votre entreprise,
        où elle se trouve
        et quels métiers elle propose.

        <br><br>

        Cette visibilité locale peut faciliter
        le recrutement,
        développer le bouche-à-oreille
        et renforcer la fierté
        d’appartenance des salariés.

      </div>

      <div class="box entrepriseInfoBox">

        <strong
          style="
            font-size:17px;
          ">
          Faites connaître ce qui existe
          autour du lieu de travail
        </strong>

        <br><br>

        Faire connaître aux salariés :

        <br><br>

        • les commerces ;<br>
        • les services ;<br>
        • les clubs ;<br>
        • les activités ;<br>
        • les initiatives locales accessibles
        près du lieu de travail.

        <br><br>

        Valorisez également
        les initiatives auxquelles
        l’entreprise participe,
        mais aussi celles qui existent déjà
        sur le territoire.

      </div>

      <div class="box entrepriseInfoBox">

        <strong>
          La proximité améliore le quotidien
        </strong>

        <br><br>

        Recruter dans la commune
        ou dans les communes voisines
        peut réduire :

        <br><br>

        • les temps de déplacement ;<br>
        • les frais de transport ;<br>
        • la fatigue quotidienne ;<br>
        • les difficultés liées aux horaires.

        <br><br>

        Un salarié regarde la rémunération,
        mais également :

        <br><br>

        • la distance entre son domicile et son travail ;<br>
        • la qualité de vie ;<br>
        • la reconnaissance ;<br>
        • l’ambiance ;<br>
        • les services accessibles près de l’entreprise ;<br>
        • l’engagement local de son employeur.

      </div>

      <div class="box entrepriseInfoBox">

        <strong>
          Des actions concrètes pour fidéliser
        </strong>

        <br><br>

        • faire connaître les métiers de l’entreprise ;<br>
        • valoriser le savoir-faire des équipes ;<br>
        • présenter les services disponibles autour du travail ;<br>
        • associer les salariés à une action locale ;<br>
        • soutenir un projet utile à la ville ;<br>
        • reconnaître les initiatives internes ;<br>
        • faciliter l’accès aux commerces et activités locales.

      </div>

      <div class="box entrepriseInfoBox">

        <strong>
          Une entreprise mieux connue
        </strong>

        <br><br>

        Lorsque les habitants connaissent
        votre activité,
        vos métiers
        et votre présence dans la ville,
        ils peuvent parler de vous naturellement.

        <br><br>

        Cela favorise :

        <br><br>

        • les recrutements futurs ;<br>
        • la recommandation ;<br>
        • la reconnaissance locale ;<br>
        • la fierté d’appartenance des salariés.

      </div>

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
        ">

        <button
          class="choiceBtn"
          id="loyaltyEmploymentBtn"
          type="button">
          Rechercher du personnel
        </button>

        <button
          class="choiceBtn"
          id="loyaltyLocalDirectoryBtn"
          type="button">
          Entreprises et commerces de la ville
        </button>

        <button
          class="choiceBtn"
          id="loyaltyVisibilityBtn"
          type="button">
          Faire connaître mon entreprise
        </button>

        <button
          class="choiceBtn"
          id="loyaltyPatronageBtn"
          type="button">
          Découvrir le mécénat
        </button>

      </div>
    `;
  }

  function openLoyalty(){

    module.renderModal(
      "Attirez et fidélisez vos salariés autrement",
      getLoyaltyHtml(),
      {
        presentationFooter:true
      }
    );

    window.setTimeout(function(){

      const employmentButton =
        getElement(
          "loyaltyEmploymentBtn"
        );

      const directoryButton =
        getElement(
          "loyaltyLocalDirectoryBtn"
        );

      const visibilityButton =
        getElement(
          "loyaltyVisibilityBtn"
        );

      const patronageButton =
        getElement(
          "loyaltyPatronageBtn"
        );

      if(employmentButton){

        employmentButton.onclick = function(){

          module.openScreen(
            "emploi"
          );
        };
      }

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

      if(visibilityButton){

        visibilityButton.onclick = function(){

          module.openScreen(
            "visibilite"
          );
        };
      }

      if(patronageButton){

        patronageButton.onclick = function(){

          module.openScreen(
            "mecenat"
          );
        };
      }

    },0);
  }

  module.registerScreen(
    "emploi",
    openEmployment
  );

     module.openEmployment =
    openEmployment;

  module.registerScreen(
    "fidelisation",
    openLoyalty
  );

  module.openEmploymentForm =
    openEmploymentForm;

  module.openEmploymentOffers =
    openEmploymentOffers;

  module.openEmploymentApplications =
    openEmploymentApplications;

  console.log(
    "✅ Module Entreprise — partie 3 chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 4A — DÉVELOPPEMENT
   ========================================================= */

(function initBociteEntrepriseDevelopment(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : les parties précédentes doivent être chargées."
    );
    return;
  }

  const DEVELOPMENT_STORE_KEY =
    "bociteart_entreprise_development_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadDevelopmentData(){
    try{
      const raw =
        localStorage.getItem(DEVELOPMENT_STORE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(parsed && typeof parsed === "object"){
        return parsed;
      }
    }catch(error){
      console.warn(
        "Lecture des données de développement impossible :",
        error
      );
    }

    return {
      objective:"",
      need:"",
      localSearch:"",
      action:"",
      deadline:"",
      status:"a_preparer",
      updatedAt:null,
      updatedAtFr:""
    };
  }

  function saveDevelopmentData(data){
    try{
      localStorage.setItem(
        DEVELOPMENT_STORE_KEY,
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement des données de développement impossible :",
        error
      );
    }
  }

  function getDevelopmentHtml(){

    const saved =
      loadDevelopmentData();

    return `
       <div class="box entrepriseInfoBox">
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:19px;">
          Connaissez-vous le nom de cinq entreprises
          présentes dans votre ville ?
        </strong>

        <br><br>

        Probablement pas.

        <br><br>

        Nous ne parlons pas seulement
        des grandes enseignes connues de tous,
        mais de toutes les autres entreprises,
        artisans,
        prestataires
        et commerces qui travaillent
        chaque jour dans votre commune.

        <br><br>

        Elles produisent,
        recrutent,
        proposent des services
        et participent à la vie économique locale,
        sans être suffisamment connues
        des habitants
        ni même des autres professionnels.

        <br><br>

        <strong>
          Ce manque de connaissance
          représente une véritable perte pour la ville.
        </strong>

        <br><br>

        Avant de chercher ailleurs,
        commencez par découvrir
        les compétences déjà présentes
        sur votre territoire.
      </div>

       <div class="box entrepriseInfoBox">

        <strong style="font-size:18px;">
          Développez votre entreprise
        </strong>

        <br><br>

        Votre prochain client,
        fournisseur,
        salarié,
        sous-traitant
        ou partenaire
        se trouve peut-être déjà
        dans votre ville.

        <br><br>

        Une entreprise se développe
        grâce à ses produits
        et à ses services,
        mais aussi grâce aux rencontres,
        aux informations
        et aux bonnes décisions
        prises au bon moment.
      </div>


        <div class="box entrepriseInfoBox">

  <div
    class="sectionTitle"
    style="
      color:#2f5d46;
      font-weight:400;
    ">
    Une liste économique locale commune
  </div>

  <br>

  Les habitants,
  les entreprises,
  les commerces,
  les artisans
  et les professionnels
  doivent pouvoir retrouver facilement
  les acteurs économiques
  présents dans leur ville.

  <br><br>

  Cet annuaire permet de savoir
  qui travaille,
  produit,
  recrute
  et propose des services
  près de chez soi.

  <br><br>

  Il aide chacun à rechercher
  une solution locale en priorité,
  avant de se tourner systématiquement
  vers une autre commune
  ou un territoire plus éloigné.

</div>
      <div class="box entrepriseInfoBox"> 

  <div class="sectionTitle">
    Développer les relations entre professionnels locaux
  </div>

  <br>

  Une entreprise,
  un commerce,
  un artisan
  ou un professionnel
  peut choisir librement de proposer
  un avantage réservé
  aux autres partenaires
  <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>.

  <br><br>

  Cet avantage peut prendre différentes formes :

  <br><br>

  • une remise de X % ;<br>
  • un montant personnalisé ;<br>
  • une condition commerciale spécifique ;<br>
  • une priorité d'intervention ;<br>
  • une prestation complémentaire ;<br>
  • ou tout autre avantage décidé librement par l'entreprise.

  <br><br>

  Cet avantage reste entièrement facultatif.

  <br><br>

  Lorsqu'il est proposé,
  il a pour vocation de créer
  une relation privilégiée
  entre les acteurs économiques locaux
  et d'encourager les entreprises d'abord
  à travailler davantage ensemble.

  <br><br>

  Mais l'objectif de
  <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
  va bien au-delà.

  <br><br>

  Tout commence par une étape essentielle :

  <br><br>

  <strong>
  rendre les entreprises visibles.
  </strong>

  <br><br>

  Car avant de pouvoir travailler ensemble,
  encore faut-il savoir :

  <br><br>

  • qu'une entreprise existe ;<br>
  • où elle se trouve ;<br>
  • quel est son métier ;<br>
  • quels sont ses savoir-faire ;<br>
  • quels produits ou services elle propose.

  <br><br>

  Une fois cette visibilité retrouvée,
  les habitants,
  les entreprises,
  les commerces,
  les artisans
  et les professionnels
  peuvent enfin apprendre
  à se connaître,
  à se rencontrer
  et à créer de nouvelles opportunités.

  <br><br>

  C'est alors que peuvent naturellement se développer :

  <br><br>

  • les partenariats ;<br>
  • la sous-traitance ;<br>
  • les recommandations ;<br>
  • les recrutements ;<br>
  • le mécénat ;<br>
  • la mutualisation ;<br>
  • les nouveaux clients ;<br>
  • et plus largement,
  le développement économique local.

</div>

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
        ">

        <button
          class="choiceBtn"
          id="developmentDirectoryBtn"
          type="button">
          Entreprises et commerces de ma ville
        </button>

        <button
          class="choiceBtn"
          id="developmentVisibilityBtn"
          type="button">
          Faire connaître mon entreprise
        </button>

        <button
          class="choiceBtn"
          id="developmentPartnerBtn"
          type="button">
          Rechercher un partenaire professionnel
        </button>
      </div>

      <div class="box entrepriseInfoBox">
style="margin-top:12px;">

        <strong style="font-size:17px;">
          Espace professionnel privé
        </strong>

        <br><br>

        Le plan de développement ci-dessous
        est réservé à l’entreprise.

        <br><br>

        Il permet d’enregistrer
        un objectif,
        un besoin,
        une action
        et une date de suivi
        dans le Tableau de Direction.
      </div>

      <label
        style="
          display:block;
          font-weight:900;
        ">
        Quel est votre objectif principal ?
      </label>

      <select
        id="developmentObjective"
        class="miniField">

        <option value="">
          Choisir un objectif
        </option>

        <option value="nouveaux_clients">
          Trouver de nouveaux clients
        </option>

        <option value="fournisseur">
          Trouver un fournisseur
        </option>

        <option value="sous_traitant">
          Trouver un sous-traitant
        </option>

        <option value="partenaire">
          Trouver un partenaire
        </option>

        <option value="recrutement">
          Recruter
        </option>

        <option value="visibilite">
          Améliorer ma visibilité
        </option>

        <option value="charges">
          Réduire mes charges
        </option>

        <option value="transmission">
          Préparer la transmission
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:12px;
          font-weight:900;
        ">
        Quel est votre besoin précis ?
      </label>

      <textarea
        id="developmentNeed"
        class="miniField"
        style="min-height:110px;"
        placeholder="Expliquez simplement ce que vous recherchez.">${escapeValue(
          saved.need || ""
        )}</textarea>

      <label
        style="
          display:block;
          margin-top:12px;
          font-weight:900;
        ">
        Avez-vous déjà recherché une solution locale ?
      </label>

      <textarea
        id="developmentLocalSearch"
        class="miniField"
        style="min-height:90px;"
        placeholder="Indiquez les démarches déjà réalisées.">${escapeValue(
          saved.localSearch || ""
        )}</textarea>

      <label
        style="
          display:block;
          margin-top:12px;
          font-weight:900;
        ">
        Quelle action souhaitez-vous engager ?
      </label>

      <textarea
        id="developmentAction"
        class="miniField"
        style="min-height:90px;"
        placeholder="Exemple : contacter trois entreprises locales, demander un devis ou organiser une rencontre.">${escapeValue(
          saved.action || ""
        )}</textarea>

      <label
        style="
          display:block;
          margin-top:12px;
          font-weight:900;
        ">
        Pour quelle date ?
      </label>

      <input
        id="developmentDeadline"
        class="miniField"
        type="date"
        value="${escapeValue(
          saved.deadline || ""
        )}">

      <button
        id="developmentSaveBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
        ">
        Enregistrer ou modifier mon plan d’action
      </button>

      <button
        id="developmentReadBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Consulter mon plan d’action
      </button>

      <div
        id="developmentStatus"
        class="muted"
        style="margin-top:10px;">
      </div>

       <div class="box entrepriseInfoBox">
        style="margin-top:14px;">

        <strong>
          Besoin d’une première orientation ?
        </strong>

        <br><br>

        Posez votre question à Bo'CitéArt.

        <br><br>

        La recherche commencera
        par les entreprises,
        commerces
        et compétences disponibles
        dans votre ville,
        avant de s’élargir.
      </div>

      <textarea
        id="developmentQuestion"
        class="miniField"
        style="min-height:90px;"
        placeholder="Exemple : je recherche un sous-traitant, un fournisseur ou un partenaire.">
      </textarea>

      <button
        id="developmentQuestionBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Rechercher une première solution
      </button>

      <div
        id="developmentAnswer"
        class="muted"
        style="margin-top:10px;">
      </div>
    `;
  }

  function restoreDevelopmentObjective(){
    const saved =
      loadDevelopmentData();

    const objective =
      getElement("developmentObjective");

    if(objective && saved.objective){
      objective.value = saved.objective;
    }
  }

  function saveDevelopmentPlan(){
    const objective =
      String(
        getElement("developmentObjective")
          ? getElement("developmentObjective").value
          : ""
      ).trim();

    const need =
      String(
        getElement("developmentNeed")
          ? getElement("developmentNeed").value
          : ""
      ).trim();

    const localSearch =
      String(
        getElement("developmentLocalSearch")
          ? getElement("developmentLocalSearch").value
          : ""
      ).trim();

    const action =
      String(
        getElement("developmentAction")
          ? getElement("developmentAction").value
          : ""
      ).trim();

    const deadline =
      String(
        getElement("developmentDeadline")
          ? getElement("developmentDeadline").value
          : ""
      ).trim();

    if(!objective){
      alert(
        "Choisissez votre objectif principal."
      );
      return;
    }

    if(!need){
      alert(
        "Expliquez votre besoin précis."
      );
      return;
    }

    if(!action){
      alert(
        "Indiquez l’action que vous souhaitez engager."
      );
      return;
    }

    const data = {
      objective:objective,
      need:need,
      localSearch:localSearch,
      action:action,
      deadline:deadline,
      status:"en_cours",
      updatedAt:Date.now(),
      updatedAtFr:
        new Date().toLocaleString("fr-FR")
    };

    saveDevelopmentData(data);

    const status =
      getElement("developmentStatus");

    if(status){
      status.textContent =
        "Plan d’action enregistré le " +
        data.updatedAtFr +
        ".";
    }

    alert(
      "Votre plan d’action a été enregistré dans votre espace professionnel."
    );
  }

  function getObjectiveLabel(value){
    const labels = {
      nouveaux_clients:
        "Trouver de nouveaux clients",

      fournisseur:
        "Trouver un fournisseur",

      sous_traitant:
        "Trouver un sous-traitant",

      partenaire:
        "Trouver un partenaire",

      recrutement:
        "Recruter",

      visibilite:
        "Améliorer ma visibilité",

      charges:
        "Réduire mes charges",

      transmission:
        "Préparer la transmission"
    };

    return labels[value] || value || "Non renseigné";
  }

  function openDevelopmentPlan(){
    const data =
      loadDevelopmentData();

    if(!data.objective && !data.need){
      alert(
        "Aucun plan d’action n’est encore enregistré."
      );
      return;
    }

    module.renderModal(
      "Mon plan de développement",
      `
         <div class="box entrepriseInfoBox">
          <strong>Objectif principal</strong><br><br>
          ${escapeValue(
            getObjectiveLabel(data.objective)
          )}
        </div>

        <div class="box entrepriseInfoBox">
          <strong>Besoin identifié</strong><br><br>
          ${escapeValue(data.need || "Non renseigné")}
        </div>

         <div class="box entrepriseInfoBox">
          <strong>Recherche locale déjà effectuée</strong><br><br>
          ${escapeValue(
            data.localSearch || "Aucune démarche renseignée"
          )}
        </div>

         <div class="box entrepriseInfoBox">
          <strong>Action prévue</strong><br><br>
          ${escapeValue(data.action || "Non renseignée")}
        </div>

         <div class="box entrepriseInfoBox">
          <strong>Date souhaitée</strong><br><br>
          ${escapeValue(data.deadline || "Non renseignée")}

          <br><br>

          <strong>Dernière mise à jour</strong><br>
          ${escapeValue(data.updatedAtFr || "")}
        </div>
      `
    );
  }

  function getDevelopmentAnswer(question){
    const normalized =
      String(question || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if(
      normalized.includes("fournisseur") ||
      normalized.includes("sous-traitant") ||
      normalized.includes("sous traitant") ||
      normalized.includes("partenaire")
    ){
      return {
        text:
          "Commencez par consulter les entreprises présentes dans votre commune. Une compétence complémentaire ou un partenaire peut déjà se trouver près de vous.",
        buttonLabel:
          "Consulter l’annuaire local",
        screen:
          "annuaire"
      };
    }

    if(
      normalized.includes("client") ||
      normalized.includes("visibilite") ||
      normalized.includes("faire connaitre")
    ){
      return {
        text:
          "Commencez par expliquer clairement ce que fait votre entreprise et à qui vos services s’adressent. La visibilité locale crée souvent des contacts indirects.",
        buttonLabel:
          "Améliorer ma visibilité",
        screen:
          "visibilite"
      };
    }

    if(
      normalized.includes("recrut") ||
      normalized.includes("salarie") ||
      normalized.includes("personnel")
    ){
      return {
        text:
          "Diffusez d’abord votre besoin auprès des habitants de votre commune. Les compétences recherchées sont souvent déjà proches de l’entreprise.",
        buttonLabel:
          "Ouvrir la rubrique Emploi",
        screen:
          "emploi"
      };
    }

    if(
      normalized.includes("charge") ||
      normalized.includes("electricite") ||
      normalized.includes("gaz") ||
      normalized.includes("assurance")
    ){
      return {
        text:
          "Consultez les mutualisations ouvertes dans votre ville. Un regroupement peut renforcer la capacité de négociation des entreprises.",
        buttonLabel:
          "Voir les mutualisations",
        screen:
          "mutualisation"
      };
    }

    return {
      text:
        "Votre demande est enregistrée. Bo'CitéArt commencera par rechercher les acteurs, compétences et solutions disponibles dans votre commune.",
      buttonLabel:
        "Voir les entreprises de ma ville",
      screen:
        "annuaire"
    };
  }

  function bindDevelopment(){
    const directoryButton =
      getElement("developmentDirectoryBtn");

    const visibilityButton =
      getElement("developmentVisibilityBtn");

    const partnerButton =
      getElement("developmentPartnerBtn");

    const saveButton =
      getElement("developmentSaveBtn");

    const readButton =
      getElement("developmentReadBtn");

    const questionButton =
      getElement("developmentQuestionBtn");

    if(directoryButton){
      directoryButton.onclick = function(){
        module.openScreen("annuaire");
      };
    }

    if(visibilityButton){
      visibilityButton.onclick = function(){
        module.openScreen("visibilite");
      };
    }

    if(partnerButton){
      partnerButton.onclick = function(){
        module.openScreen("annuaire");
      };
    }

    if(saveButton){
      saveButton.onclick =
        saveDevelopmentPlan;
    }

    if(readButton){
      readButton.onclick =
        openDevelopmentPlan;
    }

    if(questionButton){
      questionButton.onclick = function(){
        const input =
          getElement("developmentQuestion");

        const answerBox =
          getElement("developmentAnswer");

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

        if(!answerBox){
          return;
        }

        const result =
          getDevelopmentAnswer(question);

        answerBox.innerHTML = `
          <div class="box">
            ${escapeValue(result.text)}

            <br><br>

            <button
              id="developmentAnswerAction"
              class="choiceBtn"
              type="button">
              ${escapeValue(result.buttonLabel)}
            </button>
          </div>
        `;

        window.setTimeout(function(){
          const actionButton =
            getElement("developmentAnswerAction");

          if(actionButton){
            actionButton.onclick = function(){
              module.openScreen(
                result.screen
              );
            };
          }
        },0);
      };
    }

    restoreDevelopmentObjective();

    const saved =
      loadDevelopmentData();

    const status =
      getElement("developmentStatus");

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

  function openDevelopment(){

    module.renderModal(
      "Développez votre entreprise",
      getDevelopmentHtml(),
      {
        presentationFooter:true
      }
    );

    window.setTimeout(function(){

      bindDevelopment();

    },0);
  }

  module.registerScreen(
    "developpement",
    openDevelopment
  );

  module.loadDevelopmentData =
    loadDevelopmentData;

  module.saveDevelopmentData =
    saveDevelopmentData;

  module.openDevelopmentPlan =
    openDevelopmentPlan;

  console.log(
    "✅ Module Entreprise — partie 4A chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 4B — MUTUALISATION
   ========================================================= */

(function initBociteEntrepriseMutualisation(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : les parties précédentes doivent être chargées."
    );
    return;
  }

  const MUTUALISATION_STORE_KEY =
    "bociteart_entreprise_mutualisation_v2";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function getDefaultData(){
    return {
      electricite:{
        label:"Électricité",
        count:17,
        target:30,
        interested:false
      },
      gaz:{
        label:"Gaz",
        count:9,
        target:30,
        interested:false
      },
      telephonie:{
        label:"Téléphonie et Internet",
        count:24,
        target:30,
        interested:false
      },
      assurances:{
        label:"Assurances professionnelles",
        count:12,
        target:30,
        interested:false
      },
      mutuelle:{
        label:"Mutuelle",
        count:8,
        target:30,
        interested:false
      },
      fournitures:{
        label:"Fournitures professionnelles",
        count:6,
        target:30,
        interested:false
      },
      carburant:{
        label:"Carburant",
        count:11,
        target:30,
        interested:false
      },
      formation:{
        label:"Formation",
        count:5,
        target:20,
        interested:false
      },
      autres:[]
    };
  }

  function loadMutualisationData(){
    try{
      const raw =
        localStorage.getItem(MUTUALISATION_STORE_KEY);

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
        "Lecture des mutualisations impossible :",
        error
      );
    }

    return getDefaultData();
  }

  function saveMutualisationData(data){
    try{
      localStorage.setItem(
        MUTUALISATION_STORE_KEY,
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement des mutualisations impossible :",
        error
      );
    }
  }

  function getProgressPercent(count, target){
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

function getMutualisationHtml(){

return `

 <div class="box entrepriseInfoBox">
  style="border-left:6px solid #2f5d46;">

  <div class="sectionTitle">
    Connaissez-vous le nom de cinq entreprises
    présentes dans votre ville ?
  </div>

  <br>

  Comme une très grande majorité des habitants,

  <strong>probablement NON&nbsp;!</strong>

  <br><br>

  Pourtant, votre commune possède des entreprises,
  des artisans,
  des commerces,
  des prestataires de services
  et de nombreux savoir-faire
  souvent méconnus.

  <br><br>

  Avant de rechercher une solution ailleurs,
  prenez le temps de découvrir
  les compétences déjà présentes
  sur votre territoire.

  <br><br>

  <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
a pour vocation de rendre ces acteurs plus visibles
afin de renforcer et de favoriser avant tout
les échanges,
les partenariats,
l'emploi
et le développement économique local,
en permettant à chaque entreprise,
artisan,
commerce
et professionnel
d'être vu,
connu
et reconnu
d'abord dans sa ville,
puis sur son territoire.
</div>

 <div class="box entrepriseInfoBox">
<strong>

Comparez • Choisissez • Validez

</strong>

<br><br>

Bo'CitéArt permettra progressivement
de comparer les propositions reçues
pour différents postes de dépenses.

</div>

 <div class="box entrepriseInfoBox">

Les principales mutualisations
pourront concerner :

<br><br>

• Électricité

<br>

• Gaz

<br>

• Téléphonie

<br>

• Internet

<br>

• Assurances

<br>

• Véhicules

<br>

• Entretien

<br>

• Formation

<br>

• Fournitures

<br>

• Achats groupés

</div>

 <div class="box entrepriseInfoBox">

<strong>

Comment cela fonctionne ?

</strong>

<br><br>

Lorsqu'un nombre suffisant
d'entreprises
exprime le même besoin,
Bo'CitéArt peut lancer
une recherche commune.

<br><br>

Les propositions reçues
seront regroupées
dans votre Tableau de Direction.

</div>

 <div class="box entrepriseInfoBox">

Vous resterez toujours libre :

<br><br>

• d'accepter

<br>

• de refuser

<br>

• de comparer

<br>

• de demander un autre devis

</div>

<div style="display:flex;gap:8px;flex-wrap:wrap;">

<button
id="mutualisationRequestBtn"
class="choiceBtn">

Déclarer un besoin

</button>

<button
id="mutualisationAnswersBtn"
class="choiceBtn">

Voir les réponses reçues

</button>

<button
id="mutualisationDirectionBtn"
class="choiceBtn">

Ouvrir le Tableau de Direction

</button>

</div>

`;
}

  function openMutualisation(){
    module.renderModal(
      "Réduisez vos charges",
      getMutualisationHtml()
    );

    window.setTimeout(function(){
      bindMutualisation();
    },0);
  }

  module.registerScreen(
    "mutualisation",
    openMutualisation
  );

  module.loadMutualisationData =
    loadMutualisationData;

  module.saveMutualisationData =
    saveMutualisationData;

  module.openMutualisation =
    openMutualisation;

  console.log(
    "✅ Module Entreprise — partie 4B chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 4C — PROPOSITIONS, VOTES ET ENGAGEMENTS
   ========================================================= */

(function initBociteEntrepriseMutualisationVotes(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : les parties précédentes doivent être chargées."
    );
    return;
  }

  const PROPOSALS_STORE_KEY =
    "bociteart_entreprise_mutualisation_proposals_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadProposals(){
    try{
      const raw =
        localStorage.getItem(PROPOSALS_STORE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(parsed && typeof parsed === "object"){
        return parsed;
      }
    }catch(error){
      console.warn(
        "Lecture des propositions impossible :",
        error
      );
    }

    return {};
  }

  function saveProposals(data){
    try{
      localStorage.setItem(
        PROPOSALS_STORE_KEY,
        JSON.stringify(data || {})
      );
    }catch(error){
      console.warn(
        "Enregistrement des propositions impossible :",
        error
      );
    }
  }

  function getMutualisationLabel(key){
    const data =
      typeof module.loadMutualisationData === "function"
        ? module.loadMutualisationData()
        : {};

    return (
      data[key] &&
      data[key].label
    )
      ? data[key].label
      : key;
  }

  function ensureProposalGroup(key){
    const data =
      loadProposals();

    if(!data[key]){
      data[key] = {
        key:key,
        label:getMutualisationLabel(key),
        status:"consultation_a_preparer",
        selectedProposalId:"",
        finalCommitment:false,
        unableToParticipate:false,
        unableDate:null,
        unableDateFr:"",
        updatedAt:Date.now(),
        updatedAtFr:
          new Date().toLocaleString("fr-FR"),
        proposals:[
          {
            id:key + "-P1",
            title:"Proposition 1",
            provider:"Prestataire A",
            description:
              "Première proposition de démonstration.",
            estimatedSaving:"À préciser",
            deadline:"À préciser",
            votes:0
          },
          {
            id:key + "-P2",
            title:"Proposition 2",
            provider:"Prestataire B",
            description:
              "Deuxième proposition de démonstration.",
            estimatedSaving:"À préciser",
            deadline:"À préciser",
            votes:0
          },
          {
            id:key + "-P3",
            title:"Proposition 3",
            provider:"Prestataire C",
            description:
              "Troisième proposition de démonstration.",
            estimatedSaving:"À préciser",
            deadline:"À préciser",
            votes:0
          }
        ]
      };

      saveProposals(data);
    }

    return data[key];
  }

  function getVotesHtml(key){
    const group =
      ensureProposalGroup(key);

    return `
       <div class="box entrepriseInfoBox">
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          ${escapeValue(group.label)}
        </strong>

        <br><br>

        Bo'CitéArt présente ici les propositions reçues.

        <br><br>

        Chaque entreprise peut comparer,
        choisir puis confirmer son engagement.
      </div>

       <div class="box entrepriseInfoBox">
        <strong>État d’avancement</strong><br><br>

        ${
          group.status === "consultation_a_preparer"
            ? "La consultation doit encore être préparée."
            : escapeValue(group.status)
        }

        <br><br>

        Dernière mise à jour :
        ${escapeValue(group.updatedAtFr || "")}
      </div>

      <div
        id="mutualisationProposalList">
      </div>

       <div class="box entrepriseInfoBox">
        style="margin-top:14px;">

        <strong>Votre décision</strong><br><br>

        Après avoir choisi une proposition,
        vous pourrez confirmer définitivement
        votre participation.

        <br><br>

        Cette confirmation engage l’entreprise
        à participer à la prestation retenue.
      </div>

      <button
        id="mutualisationConfirmCommitmentBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:10px;">
        Confirmer définitivement ma participation
      </button>

      <button
        id="mutualisationUnableBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Je ne peux pas participer à cet événement
      </button>

      <div
        id="mutualisationDecisionStatus"
        class="muted"
        style="margin-top:10px;">
      </div>
    `;
  }

  function renderProposalList(key){
    const host =
      getElement("mutualisationProposalList");

    if(!host){
      return;
    }

    const all =
      loadProposals();

    const group =
      all[key] ||
      ensureProposalGroup(key);

    host.innerHTML =
      group.proposals.map(function(proposal){

        const selected =
          group.selectedProposalId ===
          proposal.id;

        return `
           <div class="box entrepriseInfoBox">
            <strong style="font-size:16px;">
              ${escapeValue(proposal.title)}
            </strong>

            <br><br>

            Prestataire :
            <strong>
              ${escapeValue(proposal.provider)}
            </strong>

            <br><br>

            ${escapeValue(proposal.description)}

            <br><br>

            Économie estimée :
            <strong>
              ${escapeValue(proposal.estimatedSaving)}
            </strong>

            <br>

            Délai :
            <strong>
              ${escapeValue(proposal.deadline)}
            </strong>

            <br><br>

            Votes enregistrés :
            <strong>
              ${Number(proposal.votes || 0)}
            </strong>

            <button
              class="choiceBtn mutualisationVoteBtn"
              type="button"
              data-proposal-id="${escapeValue(proposal.id)}"
              style="
                width:100%;
                margin-top:10px;
                ${selected ? "opacity:.65;" : ""}
              ">
              ${
                selected
                  ? "Proposition choisie"
                  : "Choisir cette proposition"
              }
            </button>
          </div>
        `;
      }).join("");

    host
      .querySelectorAll(".mutualisationVoteBtn")
      .forEach(function(button){

        button.onclick = function(){
          chooseProposal(
            key,
            button.getAttribute(
              "data-proposal-id"
            )
          );
        };
      });
  }

  function chooseProposal(key, proposalId){
    const data =
      loadProposals();

    const group =
      data[key] ||
      ensureProposalGroup(key);

    if(
      group.finalCommitment
    ){
      alert(
        "Votre participation est déjà confirmée définitivement."
      );
      return;
    }

    if(
      group.selectedProposalId ===
      proposalId
    ){
      alert(
        "Cette proposition est déjà sélectionnée."
      );
      return;
    }

    group.proposals.forEach(function(proposal){
      if(
        proposal.id ===
        group.selectedProposalId &&
        Number(proposal.votes || 0) > 0
      ){
        proposal.votes =
          Number(proposal.votes || 0) - 1;
      }
    });

    const selected =
      group.proposals.find(function(proposal){
        return proposal.id === proposalId;
      });

    if(!selected){
      alert(
        "Cette proposition est introuvable."
      );
      return;
    }

    selected.votes =
      Number(selected.votes || 0) + 1;

    group.selectedProposalId =
      proposalId;

    group.status =
      "choix_en_cours";

    group.updatedAt =
      Date.now();

    group.updatedAtFr =
      new Date().toLocaleString("fr-FR");

    data[key] = group;

    saveProposals(data);
    renderProposalList(key);
    refreshDecisionStatus(key);

    alert(
      "Votre choix est enregistré.\n\n" +
      "Vous pouvez encore le modifier tant que " +
      "vous n’avez pas confirmé définitivement votre participation."
    );
  }

  function confirmCommitment(key){
    const data =
      loadProposals();

    const group =
      data[key] ||
      ensureProposalGroup(key);

    if(!group.selectedProposalId){
      alert(
        "Choisissez d’abord une proposition."
      );
      return;
    }

    if(group.finalCommitment){
      alert(
        "Votre participation est déjà confirmée."
      );
      return;
    }

    const selected =
      group.proposals.find(function(proposal){
        return (
          proposal.id ===
          group.selectedProposalId
        );
      });

    const confirmation =
      confirm(
        "Confirmer définitivement votre participation ?\n\n" +
        "Proposition retenue : " +
        (
          selected
            ? selected.title + " — " + selected.provider
            : ""
        ) +
        "\n\nCette décision engage l’entreprise."
      );

    if(!confirmation){
      return;
    }

    group.finalCommitment = true;
    group.unableToParticipate = false;
    group.status = "engagement_confirme";
    group.commitmentDate = Date.now();
    group.commitmentDateFr =
      new Date().toLocaleString("fr-FR");

    group.updatedAt =
      Date.now();

    group.updatedAtFr =
      new Date().toLocaleString("fr-FR");

    data[key] = group;

    saveProposals(data);
    refreshDecisionStatus(key);

    alert(
      "Votre participation est maintenant confirmée définitivement."
    );
  }

  function declareUnable(key){
    const data =
      loadProposals();

    const group =
      data[key] ||
      ensureProposalGroup(key);

    if(group.finalCommitment){
      alert(
        "Votre participation a déjà été confirmée définitivement.\n\n" +
        "Cette option n’est plus disponible."
      );
      return;
    }

    const confirmation =
      confirm(
        "Confirmer que vous ne pouvez pas participer à cet événement ?\n\n" +
        "Votre place pourra alors être proposée à une autre entreprise."
      );

    if(!confirmation){
      return;
    }

    group.unableToParticipate = true;
    group.status = "participation_impossible";
    group.unableDate = Date.now();
    group.unableDateFr =
      new Date().toLocaleString("fr-FR");

    if(group.selectedProposalId){
      const selected =
        group.proposals.find(function(proposal){
          return (
            proposal.id ===
            group.selectedProposalId
          );
        });

      if(
        selected &&
        Number(selected.votes || 0) > 0
      ){
        selected.votes =
          Number(selected.votes || 0) - 1;
      }
    }

    group.selectedProposalId = "";

    group.updatedAt =
      Date.now();

    group.updatedAtFr =
      new Date().toLocaleString("fr-FR");

    data[key] = group;

    saveProposals(data);
    renderProposalList(key);
    refreshDecisionStatus(key);

    alert(
      "Votre impossibilité de participer est enregistrée.\n\n" +
      "Aucune identité ne sera affichée aux autres participants."
    );
  }

  function refreshDecisionStatus(key){
    const host =
      getElement("mutualisationDecisionStatus");

    if(!host){
      return;
    }

    const data =
      loadProposals();

    const group =
      data[key] ||
      ensureProposalGroup(key);

    if(group.finalCommitment){
      host.innerHTML = `
         <div class="box entrepriseInfoBox">
          <strong>
            Participation confirmée
          </strong>

          <br><br>

          Date :
          ${escapeValue(
            group.commitmentDateFr || ""
          )}
        </div>
      `;
      return;
    }

    if(group.unableToParticipate){
      host.innerHTML = `
         <div class="box entrepriseInfoBox">
          <strong>
            Participation impossible
          </strong>

          <br><br>

          Votre place peut être proposée
          à une autre entreprise.

          <br><br>

          Date :
          ${escapeValue(
            group.unableDateFr || ""
          )}
        </div>
      `;
      return;
    }

    if(group.selectedProposalId){
      const selected =
        group.proposals.find(function(proposal){
          return (
            proposal.id ===
            group.selectedProposalId
          );
        });

      host.innerHTML = `
         <div class="box entrepriseInfoBox">
          Proposition sélectionnée :

          <br><br>

          <strong>
            ${
              selected
                ? escapeValue(
                    selected.title +
                    " — " +
                    selected.provider
                  )
                : ""
            }
          </strong>

          <br><br>

          Vous devez encore confirmer
          définitivement votre participation.
        </div>
      `;
      return;
    }

    host.textContent =
      "Aucune proposition sélectionnée.";
  }

  function bindVotes(key){
    const confirmButton =
      getElement(
        "mutualisationConfirmCommitmentBtn"
      );

    const unableButton =
      getElement(
        "mutualisationUnableBtn"
      );

    if(confirmButton){
      confirmButton.onclick = function(){
        confirmCommitment(key);
      };
    }

    if(unableButton){
      unableButton.onclick = function(){
        declareUnable(key);
      };
    }

    renderProposalList(key);
    refreshDecisionStatus(key);
  }

  function openMutualisationVotes(key){
    if(!key){
      alert(
        "Mutualisation introuvable."
      );
      return;
    }

    const group =
      ensureProposalGroup(key);

    module.renderModal(
      "Propositions — " + group.label,
      getVotesHtml(key)
    );

    window.setTimeout(function(){
      bindVotes(key);
    },0);
  }

  function getDirectionSummaryHtml(){
    const proposals =
      loadProposals();

    const keys =
      Object.keys(proposals);

    if(!keys.length){
      return `
        <div class="box entrepriseInfoBox">
          Aucune consultation n’est encore ouverte.
        </div>
      `;
    }

    return keys.map(function(key){
      const group =
        proposals[key];

      let status =
        "En attente de choix";

      if(group.finalCommitment){
        status =
          "Participation confirmée";
      }else if(group.unableToParticipate){
        status =
          "Participation impossible";
      }else if(group.selectedProposalId){
        status =
          "Proposition sélectionnée";
      }

      return `
         <div class="box entrepriseInfoBox">
          <strong>
            ${escapeValue(group.label)}
          </strong>

          <br><br>

          Statut :
          <strong>
            ${escapeValue(status)}
          </strong>

          <br><br>

          <button
            class="choiceBtn directionOpenProposalBtn"
            type="button"
            data-mutualisation-key="${escapeValue(key)}">
            Consulter les propositions
          </button>
        </div>
      `;
    }).join("");
  }

  function bindDirectionProposalButtons(){
    document
      .querySelectorAll(
        ".directionOpenProposalBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          openMutualisationVotes(
            button.getAttribute(
              "data-mutualisation-key"
            )
          );
        };
      });
  }

  module.openMutualisationVotes =
    openMutualisationVotes;

  module.getDirectionSummaryHtml =
    getDirectionSummaryHtml;

  module.bindDirectionProposalButtons =
    bindDirectionProposalButtons;

  console.log(
    "✅ Module Entreprise — partie 4C chargée"
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
   PARTIE 6B — MÉCÉNAT
   ========================================================= */

(function initBociteEntrepriseMecenat(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : les parties précédentes doivent être chargées."
    );
    return;
  }

  const MECENAT_STORE_KEY =
    "bociteart_entreprise_mecenat_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function getDefaultMecenatData(){
    return {
      companyName:"",
      projectType:"",
      contributionType:"",
      contributionAmount:"",
      skillsDescription:"",
      materialDescription:"",
      selectedProject:"",
      visibilityAccepted:false,
      accountantContacted:false,
      notes:"",
      status:"a_preparer",
      updatedAt:null,
      updatedAtFr:""
    };
  }

  function loadMecenatData(){
    try{
      const raw =
        localStorage.getItem(MECENAT_STORE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(parsed && typeof parsed === "object"){
        return Object.assign(
          getDefaultMecenatData(),
          parsed
        );
      }
    }catch(error){
      console.warn(
        "Lecture des données mécénat impossible :",
        error
      );
    }

    return getDefaultMecenatData();
  }

  function saveMecenatData(data){
    try{
      localStorage.setItem(
        MECENAT_STORE_KEY,
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement des données mécénat impossible :",
        error
      );
    }
  }

  function getMecenatHtml(){

    const saved =
      loadMecenatData();

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:19px;">
          Connaissez-vous réellement le mécénat ?
        </strong>

        <br><br>

        Beaucoup d’entreprises
        connaissent mal le mécénat.

        <br><br>

        Certaines pensent
        qu’il est réservé
        aux grandes entreprises.

        <br><br>

        D’autres imaginent
        qu’il nécessite obligatoirement
        des moyens financiers importants.

        <br><br>

        Pourtant,
        une petite entreprise,
        une PME,
        un artisan,
        un commerce
        ou une structure plus importante
        peut participer
        à la vie de son territoire.
      </div>

      <div class="box">

        <strong style="font-size:17px;">
          Le mécénat ne consiste pas uniquement
          à donner de l’argent
        </strong>

        <br><br>

        Il peut aussi prendre la forme :

        <br><br>

        • d’un soutien financier ;<br>
        • d’un prêt de matériel ;<br>
        • d’un don de produit ;<br>
        • d’une compétence ;<br>
        • d’un savoir-faire ;<br>
        • d’un lieu ;<br>
        • d’un véhicule ;<br>
        • d’un accompagnement ;<br>
        • ou de temps consacré à un projet.
      </div>

      <div class="box">

        <strong>
          Chaque entreprise peut contribuer
          selon ses possibilités
        </strong>

        <br><br>

        Le mécénat peut soutenir :

        <br><br>

        • la culture ;<br>
        • l’éducation ;<br>
        • le sport ;<br>
        • le patrimoine ;<br>
        • la solidarité ;<br>
        • l’environnement ;<br>
        • une action locale d’intérêt général.
      </div>

      <div class="box">

        <strong>
          Faire connaître l’entreprise autrement
        </strong>

        <br><br>

        Lorsqu’une entreprise soutient
        un projet utile,
        elle peut être remerciée
        dans le cadre autorisé.

        <br><br>

        Ce n’est pas une publicité classique.

        <br><br>

        C’est la reconnaissance
        de son engagement
        auprès du territoire.
      </div>

      <div class="box">

        <strong>
          Le retour est souvent indirect
        </strong>

        <br><br>

        Il se construit progressivement par :

        <br><br>

        • la confiance ;<br>
        • la réputation ;<br>
        • le bouche-à-oreille ;<br>
        • la connaissance des métiers ;<br>
        • la fierté des salariés ;<br>
        • de futurs recrutements ;<br>
        • de nouveaux liens locaux.
      </div>

      <div class="box">

        <strong>
          Un avantage fiscal peut exister
        </strong>

        <br><br>

        Sous certaines conditions,
        le mécénat peut ouvrir droit
        à un avantage fiscal.

        <br><br>

        Les règles peuvent évoluer.

        <br><br>

        L’entreprise devra vérifier
        sa situation
        avec son expert-comptable
        ou son conseil habituel.
      </div>

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
        ">

        <button
          id="mecenatProjectsBtn"
          class="choiceBtn"
          type="button">
          Découvrir les projets locaux
        </button>

        <button
          id="mecenatVisibilityBtn"
          class="choiceBtn"
          type="button">
          Faire connaître mon engagement
        </button>

        <button
          id="mecenatExpertBtn"
          class="choiceBtn"
          type="button">
          Rechercher un expert local
        </button>
      </div>

      <div
        class="box"
        style="
          margin-top:16px;
          border-left:6px solid #b00020;
        ">

        <strong style="font-size:17px;">
          Espace privé de l’entreprise
        </strong>

        <br><br>

        La préparation d’un projet de mécénat,
        les montants,
        les compétences proposées,
        le matériel disponible
        et les notes internes
        restent confidentiels.
      </div>

      <label style="display:block;font-weight:900;">
        Nom de l’entreprise
      </label>

      <input
        id="mecenatCompanyName"
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
        Quel type de projet souhaitez-vous soutenir ?
      </label>

      <select
        id="mecenatProjectType"
        class="miniField">

        <option value="">
          Choisir
        </option>

        <option value="culture">
          Culture
        </option>

        <option value="education">
          Éducation
        </option>

        <option value="sport">
          Sport
        </option>

        <option value="patrimoine">
          Patrimoine
        </option>

        <option value="solidarite">
          Solidarité
        </option>

        <option value="environnement">
          Environnement
        </option>

        <option value="autre">
          Autre projet d’intérêt général
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Sous quelle forme souhaitez-vous contribuer ?
      </label>

      <select
        id="mecenatContributionType"
        class="miniField">

        <option value="">
          Choisir
        </option>

        <option value="financier">
          Contribution financière
        </option>

        <option value="competences">
          Mécénat de compétences
        </option>

        <option value="materiel">
          Don de matériel ou de produits
        </option>

        <option value="mixte">
          Contribution mixte
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Montant envisagé
      </label>

      <input
        id="mecenatContributionAmount"
        class="miniField"
        type="number"
        min="0"
        step="1"
        value="${escapeValue(
          saved.contributionAmount || ""
        )}"
        placeholder="Montant en euros">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Compétences que vous pourriez proposer
      </label>

      <textarea
        id="mecenatSkillsDescription"
        class="miniField"
        style="min-height:90px;"
        placeholder="Exemple : communication, bâtiment, informatique, transport ou logistique.">${escapeValue(
          saved.skillsDescription || ""
        )}</textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Matériel ou produits disponibles
      </label>

      <textarea
        id="mecenatMaterialDescription"
        class="miniField"
        style="min-height:90px;"
        placeholder="Décrivez ce que vous pourriez mettre à disposition.">${escapeValue(
          saved.materialDescription || ""
        )}</textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Projet retenu
      </label>

      <input
        id="mecenatSelectedProject"
        class="miniField"
        type="text"
        value="${escapeValue(
          saved.selectedProject || ""
        )}"
        placeholder="Nom du projet choisi">

      <div
        class="box"
        style="margin-top:12px;">

        <label class="miniCheck">

          <input
            id="mecenatVisibilityAccepted"
            type="checkbox"
            ${saved.visibilityAccepted
              ? "checked"
              : ""}>

          <span>
            J’accepte que l’entreprise
            soit remerciée
            dans le cadre autorisé du projet.
          </span>
        </label>

        <label class="miniCheck">

          <input
            id="mecenatAccountantContacted"
            type="checkbox"
            ${saved.accountantContacted
              ? "checked"
              : ""}>

          <span>
            J’ai demandé
            ou je demanderai conseil
            à mon expert-comptable.
          </span>
        </label>
      </div>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Notes
      </label>

      <textarea
        id="mecenatNotes"
        class="miniField"
        style="min-height:100px;"
        placeholder="Indiquez ici vos questions ou vos conditions.">${escapeValue(
          saved.notes || ""
        )}</textarea>

      <button
        id="mecenatSaveBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:12px;
        ">
        Enregistrer ou modifier ma réflexion
      </button>

      <button
        id="mecenatSummaryBtn"
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
        id="mecenatStatus"
        class="muted"
        style="margin-top:10px;">
      </div>
    `;
  }

  function restoreMecenatSelects(){
    const saved =
      loadMecenatData();

    const projectType =
      getElement("mecenatProjectType");

    const contributionType =
      getElement("mecenatContributionType");

    if(projectType && saved.projectType){
      projectType.value =
        saved.projectType;
    }

    if(
      contributionType &&
      saved.contributionType
    ){
      contributionType.value =
        saved.contributionType;
    }
  }

  function saveMecenatForm(){
    const companyName =
      String(
        getElement("mecenatCompanyName")
          ? getElement("mecenatCompanyName").value
          : ""
      ).trim();

    const projectType =
      String(
        getElement("mecenatProjectType")
          ? getElement("mecenatProjectType").value
          : ""
      ).trim();

    const contributionType =
      String(
        getElement("mecenatContributionType")
          ? getElement("mecenatContributionType").value
          : ""
      ).trim();

    const contributionAmount =
      String(
        getElement("mecenatContributionAmount")
          ? getElement("mecenatContributionAmount").value
          : ""
      ).trim();

    const skillsDescription =
      String(
        getElement("mecenatSkillsDescription")
          ? getElement("mecenatSkillsDescription").value
          : ""
      ).trim();

    const materialDescription =
      String(
        getElement("mecenatMaterialDescription")
          ? getElement("mecenatMaterialDescription").value
          : ""
      ).trim();

    const selectedProject =
      String(
        getElement("mecenatSelectedProject")
          ? getElement("mecenatSelectedProject").value
          : ""
      ).trim();

    const notes =
      String(
        getElement("mecenatNotes")
          ? getElement("mecenatNotes").value
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
        "Choisissez un type de projet."
      );
      return;
    }

    if(!contributionType){
      alert(
        "Choisissez une forme de contribution."
      );
      return;
    }

    if(
      contributionType === "financier" &&
      !contributionAmount
    ){
      alert(
        "Indiquez le montant envisagé."
      );
      return;
    }

    if(
      contributionType === "competences" &&
      !skillsDescription
    ){
      alert(
        "Décrivez les compétences proposées."
      );
      return;
    }

    if(
      contributionType === "materiel" &&
      !materialDescription
    ){
      alert(
        "Décrivez le matériel ou les produits proposés."
      );
      return;
    }

    const data = {
      companyName:companyName,
      projectType:projectType,
      contributionType:contributionType,
      contributionAmount:contributionAmount,
      skillsDescription:skillsDescription,
      materialDescription:materialDescription,
      selectedProject:selectedProject,

      visibilityAccepted:
        !!(
          getElement("mecenatVisibilityAccepted") &&
          getElement("mecenatVisibilityAccepted").checked
        ),

      accountantContacted:
        !!(
          getElement("mecenatAccountantContacted") &&
          getElement("mecenatAccountantContacted").checked
        ),

      notes:notes,
      status:"en_reflexion",
      updatedAt:Date.now(),
      updatedAtFr:
        new Date().toLocaleString("fr-FR")
    };

    saveMecenatData(data);

    const status =
      getElement("mecenatStatus");

    if(status){
      status.textContent =
        "Réflexion enregistrée le " +
        data.updatedAtFr +
        ".";
    }

    alert(
      "Votre réflexion sur le mécénat a été enregistrée."
    );
  }

  function getProjectTypeLabel(value){
    const labels = {
      culture:"Culture",
      education:"Éducation",
      sport:"Sport",
      patrimoine:"Patrimoine",
      solidarite:"Solidarité",
      environnement:"Environnement",
      autre:"Autre projet d’intérêt général"
    };

    return labels[value] || "Non renseigné";
  }

  function getContributionTypeLabel(value){
    const labels = {
      financier:"Contribution financière",
      competences:"Mécénat de compétences",
      materiel:"Don de matériel ou de produits",
      mixte:"Contribution mixte"
    };

    return labels[value] || "Non renseigné";
  }

  function openMecenatSummary(){
    const data =
      loadMecenatData();

    if(
      !data.companyName ||
      !data.projectType ||
      !data.contributionType
    ){
      alert(
        "Aucune réflexion complète n’est enregistrée."
      );
      return;
    }

    module.renderModal(
      "Mon projet de mécénat",
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            ${escapeValue(data.companyName)}
          </strong>
        </div>

        <div class="box">
          <strong>Type de projet</strong><br><br>

          ${escapeValue(
            getProjectTypeLabel(data.projectType)
          )}
        </div>

        <div class="box">
          <strong>Forme de contribution</strong><br><br>

          ${escapeValue(
            getContributionTypeLabel(
              data.contributionType
            )
          )}
        </div>

        ${
          data.contributionAmount
            ? `
              <div class="box">
                <strong>Montant envisagé</strong><br><br>

                ${escapeValue(data.contributionAmount)} €
              </div>
            `
            : ""
        }

        ${
          data.skillsDescription
            ? `
              <div class="box">
                <strong>Compétences proposées</strong><br><br>

                ${escapeValue(data.skillsDescription)}
              </div>
            `
            : ""
        }

        ${
          data.materialDescription
            ? `
              <div class="box">
                <strong>Matériel ou produits proposés</strong><br><br>

                ${escapeValue(data.materialDescription)}
              </div>
            `
            : ""
        }

        <div class="box">
          <strong>Projet retenu</strong><br><br>

          ${escapeValue(
            data.selectedProject ||
            "Non renseigné"
          )}
        </div>

        <div class="box">
          <strong>Remerciement autorisé</strong><br><br>

          ${
            data.visibilityAccepted
              ? "Oui"
              : "Non"
          }
        </div>

        <div class="box">
          <strong>Expert-comptable consulté</strong><br><br>

          ${
            data.accountantContacted
              ? "Oui"
              : "Pas encore"
          }
        </div>

        <div class="box">
          <strong>Notes</strong><br><br>

          ${escapeValue(
            data.notes || "Aucune note"
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

  function openMecenatProjects(){
    module.renderModal(
      "Projets locaux ouverts au mécénat",
      `
        <div class="box">
          <strong>Exemples de projets</strong><br><br>

          Dans la version définitive,
          les projets seront proposés et validés
          selon les règles applicables.
        </div>

        <div class="box">
          <strong>Projet culturel</strong><br><br>

          Soutien à une œuvre, une fresque,
          une exposition ou un parcours culturel.
        </div>

        <div class="box">
          <strong>Projet éducatif</strong><br><br>

          Soutien à une action pédagogique,
          un équipement ou un projet scolaire.
        </div>

        <div class="box">
          <strong>Projet sportif</strong><br><br>

          Soutien à une action locale
          portée dans le cadre prévu.
        </div>

        <div class="box">
          <strong>Projet patrimonial</strong><br><br>

          Soutien à la valorisation
          ou à la préservation d’un élément local.
        </div>
      `
    );
  }

  function bindMecenat(){
    const projectsButton =
      getElement("mecenatProjectsBtn");

    const visibilityButton =
      getElement("mecenatVisibilityBtn");

    const expertButton =
      getElement("mecenatExpertBtn");

    const saveButton =
      getElement("mecenatSaveBtn");

    const summaryButton =
      getElement("mecenatSummaryBtn");

    if(projectsButton){
      projectsButton.onclick =
        openMecenatProjects;
    }

    if(visibilityButton){
      visibilityButton.onclick = function(){
        module.openScreen("visibilite");
      };
    }

    if(expertButton){
      expertButton.onclick = function(){
        module.openScreen("annuaire");
      };
    }

    if(saveButton){
      saveButton.onclick =
        saveMecenatForm;
    }

    if(summaryButton){
      summaryButton.onclick =
        openMecenatSummary;
    }

    restoreMecenatSelects();

    const saved =
      loadMecenatData();

    const status =
      getElement("mecenatStatus");

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

  function openMecenat(){

    module.renderModal(
      "Savez-vous à qui et à quoi sert le mécénat ?",
      getMecenatHtml(),
      {
        presentationFooter:true
      }
    );

    window.setTimeout(function(){

      bindMecenat();

    },0);
  }   
   
  module.registerScreen(
    "mecenat",
    openMecenat
  );

  module.loadMecenatData =
    loadMecenatData;

  module.saveMecenatData =
    saveMecenatData;

  module.openMecenatSummary =
    openMecenatSummary;

  module.openMecenatProjects =
    openMecenatProjects;

  console.log(
    "✅ Module Entreprise — partie 6B chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 7 — TABLEAU DE DIRECTION
   ========================================================= */

(function initBociteEntrepriseDirection(){

  "use strict";

  const module = window.BociteEntreprise;

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
    return module.safeEscape(value);
  }

  function getEmploymentSummary(){
    if(typeof module.openEmploymentApplications !== "function"){
      return {
        offers:0,
        applications:0
      };
    }

    try{
      const raw =
        localStorage.getItem(
          "bociteart_entreprise_employment_v1"
        );

      const data =
        raw ? JSON.parse(raw) : {};

      return {
        offers:Array.isArray(data.offers)
          ? data.offers.length
          : 0,

        applications:Array.isArray(data.applications)
          ? data.applications.length
          : 0
      };
    }catch(error){
      return {
        offers:0,
        applications:0
      };
    }
  }

  function getMutualisationSummary(){
    if(
      typeof module.loadMutualisationData !== "function"
    ){
      return [];
    }

    const data =
      module.loadMutualisationData();

    const keys = [
      "electricite",
      "gaz",
      "telephonie",
      "assurances",
      "mutuelle",
      "fournitures",
      "carburant",
      "formation"
    ];

    return keys
      .map(function(key){
        const item = data[key];

        if(!item){
          return null;
        }

        return {
          key:key,
          label:item.label,
          count:Number(item.count || 0),
          target:Number(item.target || 0),
          interested:!!item.interested
        };
      })
      .filter(Boolean);
  }

  function getDevelopmentSummary(){
    if(
      typeof module.loadDevelopmentData !== "function"
    ){
      return null;
    }

    const data =
      module.loadDevelopmentData();

    if(!data || !data.objective){
      return null;
    }

    return data;
  }

  function getVisibilitySummary(){
    if(
      typeof module.loadVisibilityData !== "function"
    ){
      return null;
    }

    const data =
      module.loadVisibilityData();

    if(!data || !data.companyName){
      return null;
    }

    return data;
  }

  function getSustainabilitySummary(){
    if(
      typeof module.loadSustainabilityData !== "function"
    ){
      return null;
    }

    const data =
      module.loadSustainabilityData();

    if(!data || !data.companyName){
      return null;
    }

    return data;
  }

  function getMecenatSummary(){
    if(
      typeof module.loadMecenatData !== "function"
    ){
      return null;
    }

    const data =
      module.loadMecenatData();

    if(!data || !data.companyName){
      return null;
    }

    return data;
  }

  function getDirectionHtml(){
    const employment =
      getEmploymentSummary();

    const mutualisations =
      getMutualisationSummary();

    const development =
      getDevelopmentSummary();

    const visibility =
      getVisibilitySummary();

    const sustainability =
      getSustainabilitySummary();

    const mecenat =
      getMecenatSummary();

    const proposals =
      typeof module.getDirectionSummaryHtml === "function"
        ? module.getDirectionSummaryHtml()
        : `
          <div class="box">
            Aucune proposition disponible.
          </div>
        `;

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Tableau de Direction
        </strong>

        <br><br>

        Cet espace rassemble les informations,
        les actions et les décisions de votre entreprise.

        <br><br>

        Il reste réservé au compte professionnel autorisé.
      </div>

      <div
        style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px;
          margin-top:12px;
        ">

        <div class="box">
          <strong style="font-size:20px;">
            ${employment.offers}
          </strong>

          <br>

          Offre(s) enregistrée(s)
        </div>

        <div class="box">
          <strong style="font-size:20px;">
            ${employment.applications}
          </strong>

          <br>

          Candidature(s) reçue(s)
        </div>

        <div class="box">
          <strong style="font-size:20px;">
            ${
              mutualisations.filter(function(item){
                return item.interested;
              }).length
            }
          </strong>

          <br>

          Mutualisation(s) suivie(s)
        </div>

        <div class="box">
          <strong style="font-size:20px;">
            ${development ? "1" : "0"}
          </strong>

          <br>

          Plan de développement
        </div>
      </div>

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Emploi
      </div>

      <div class="box">
        Offres enregistrées :
        <strong>${employment.offers}</strong>

        <br><br>

        Candidatures reçues :
        <strong>${employment.applications}</strong>

        <div
          style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
            margin-top:12px;
          ">

          <button
            id="directionEmploymentOffersBtn"
            class="choiceBtn"
            type="button">
            Voir les offres
          </button>

          <button
            id="directionEmploymentApplicationsBtn"
            class="choiceBtn"
            type="button">
            Voir les candidatures
          </button>
        </div>
      </div>

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Mutualisations
      </div>

      <div id="directionMutualisationList">
        ${
          mutualisations.length
            ? mutualisations.map(function(item){

                return `
                  <div class="box">
                    <strong>
                      ${escapeValue(item.label)}
                    </strong>

                    <br><br>

                    Participants :
                    <strong>
                      ${item.count}
                      /
                      ${item.target}
                    </strong>

                    <br><br>

                    Votre intérêt :
                    <strong>
                      ${
                        item.interested
                          ? "Enregistré"
                          : "Non enregistré"
                      }
                    </strong>

                    <button
                      class="choiceBtn directionMutualisationBtn"
                      type="button"
                      data-mutualisation-key="${escapeValue(item.key)}"
                      style="width:100%;margin-top:10px;">
                      Voir cette mutualisation
                    </button>
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucune mutualisation disponible.
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
        Propositions et décisions
      </div>

      <div id="directionProposalSummary">
        ${proposals}
      </div>

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Développement
      </div>

      ${
        development
          ? `
            <div class="box">
              <strong>Plan enregistré</strong>

              <br><br>

              Besoin :
              ${escapeValue(
                development.need || "Non renseigné"
              )}

              <br><br>

              Prochaine action :
              ${escapeValue(
                development.action || "Non renseignée"
              )}

              <br><br>

              Mise à jour :
              ${escapeValue(
                development.updatedAtFr || ""
              )}

              <button
                id="directionDevelopmentBtn"
                class="choiceBtn"
                type="button"
                style="width:100%;margin-top:10px;">
                Ouvrir le développement
              </button>
            </div>
          `
          : `
            <div class="box">
              Aucun plan de développement enregistré.

              <button
                id="directionDevelopmentBtn"
                class="choiceBtn"
                type="button"
                style="width:100%;margin-top:10px;">
                Préparer un plan
              </button>
            </div>
          `
      }

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Visibilité
      </div>

      ${
        visibility
          ? `
            <div class="box">
              <strong>
                ${escapeValue(visibility.companyName)}
              </strong>

              <br><br>

              ${escapeValue(
                visibility.activity || ""
              )}

              <br><br>

              Dernière mise à jour :
              ${escapeValue(
                visibility.updatedAtFr || ""
              )}

              <button
                id="directionVisibilityBtn"
                class="choiceBtn"
                type="button"
                style="width:100%;margin-top:10px;">
                Ouvrir la fiche entreprise
              </button>
            </div>
          `
          : `
            <div class="box">
              Aucune fiche enrichie enregistrée.

              <button
                id="directionVisibilityBtn"
                class="choiceBtn"
                type="button"
                style="width:100%;margin-top:10px;">
                Créer ma fiche
              </button>
            </div>
          `
      }

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Pérennité
      </div>

      ${
        sustainability
          ? `
            <div class="box">
              <strong>
                ${escapeValue(sustainability.companyName)}
              </strong>

              <br><br>

              Projet enregistré.

              <br><br>

              Prochaine action :
              ${escapeValue(
                sustainability.nextAction || "Non renseignée"
              )}

              <button
                id="directionSustainabilityBtn"
                class="choiceBtn"
                type="button"
                style="width:100%;margin-top:10px;">
                Ouvrir le projet
              </button>
            </div>
          `
          : `
            <div class="box">
              Aucun projet de transmission
              ou de continuité enregistré.

              <button
                id="directionSustainabilityBtn"
                class="choiceBtn"
                type="button"
                style="width:100%;margin-top:10px;">
                Préparer l’avenir
              </button>
            </div>
          `
      }

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Mécénat
      </div>

      ${
        mecenat
          ? `
            <div class="box">
              <strong>
                ${escapeValue(mecenat.companyName)}
              </strong>

              <br><br>

              Projet :
              ${escapeValue(
                mecenat.selectedProject || "Non renseigné"
              )}

              <br><br>

              Dernière mise à jour :
              ${escapeValue(
                mecenat.updatedAtFr || ""
              )}

              <button
                id="directionMecenatBtn"
                class="choiceBtn"
                type="button"
                style="width:100%;margin-top:10px;">
                Ouvrir le mécénat
              </button>
            </div>
          `
          : `
            <div class="box">
              Aucune réflexion mécénat enregistrée.

              <button
                id="directionMecenatBtn"
                class="choiceBtn"
                type="button"
                style="width:100%;margin-top:10px;">
                Découvrir le mécénat
              </button>
            </div>
          `
      }

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Services professionnels
      </div>

      <div class="box">
        <strong>
          Adhésion annuelle professionnelle
        </strong>

        <br><br>

        329 € HT par an.

        <br><br>

        Paiement prévu à la validation du contrat.
      </div>

      <div class="box">
        <strong>
          Fiche enrichie
        </strong>

        <br><br>

        199 € HT par an.
      </div>

      <div class="box">
        <strong>
          Publicité ou offre d’emploi
        </strong>

        <br><br>

        50 € HT par publication.
      </div>

      <div class="muted">
        Ces informations sont réservées
        au compte professionnel.
      </div>
    `;
  }

  function bindDirection(){
    const offersButton =
      getElement("directionEmploymentOffersBtn");

    const applicationsButton =
      getElement("directionEmploymentApplicationsBtn");

    const developmentButton =
      getElement("directionDevelopmentBtn");

    const visibilityButton =
      getElement("directionVisibilityBtn");

    const sustainabilityButton =
      getElement("directionSustainabilityBtn");

    const mecenatButton =
      getElement("directionMecenatBtn");

    if(offersButton){
      offersButton.onclick = function(){
        if(
          typeof module.openEmploymentOffers === "function"
        ){
          module.openEmploymentOffers();
        }
      };
    }

    if(applicationsButton){
      applicationsButton.onclick = function(){
        if(
          typeof module.openEmploymentApplications === "function"
        ){
          module.openEmploymentApplications();
        }
      };
    }

    if(developmentButton){
      developmentButton.onclick = function(){
        module.openScreen("developpement");
      };
    }

    if(visibilityButton){
      visibilityButton.onclick = function(){
        module.openScreen("visibilite");
      };
    }

    if(sustainabilityButton){
      sustainabilityButton.onclick = function(){
        module.openScreen("perennite");
      };
    }

    if(mecenatButton){
      mecenatButton.onclick = function(){
        module.openScreen("mecenat");
      };
    }

    document
      .querySelectorAll(".directionMutualisationBtn")
      .forEach(function(button){

        button.onclick = function(){
          module.openScreen("mutualisation");
        };
      });

    if(
      typeof module.bindDirectionProposalButtons === "function"
    ){
      module.bindDirectionProposalButtons();
    }
  }

  function openDirection(){
    module.renderModal(
      "Tableau de Direction",
      getDirectionHtml()
    );

    window.setTimeout(function(){
      bindDirection();
    },0);
  }

  module.registerScreen(
    "direction",
    openDirection
  );

  module.openDirection =
    openDirection;

  console.log(
    "✅ Module Entreprise — partie 7 chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 8 — RACCORDEMENT
   ========================================================= */

(function connectBociteEntrepriseModule(){

  "use strict";

  if(!window.BociteEntreprise){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  if(window.BOCITEART_ENTREPRISE_CONNECTED){
    return;
  }

  window.BOCITEART_ENTREPRISE_CONNECTED = true;

  function openEntrepriseModule(event){

    if(event){
      event.preventDefault();
      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation === "function"
      ){
        event.stopImmediatePropagation();
      }
    }

    window.BociteEntreprise.openHome();
  }

  document.addEventListener(
    "click",
    function(event){

      const target =
        event.target &&
        typeof event.target.closest === "function"
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

  window.openEntrepriseHome =
    function(){
      window.BociteEntreprise.openHome();
    };

  console.log(
    "✅ Module Entreprise raccordé à Bo'CitéArt"
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
   BO'CITÉART — OPPORTUNITÉS DE MUTUALISATION
   CHARGES RÉCURRENTES • SERVICES COMMUNS • EXEMPLES
   ========================================================= */

(function patchBociteEntrepriseMutualisationV2(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const MUTUALISATION_KEY =
    "bociteart_entreprise_mutualisation_v4";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function getDefaultData(){
    return {
      electricite:{
        label:"Électricité",
        description:
          "Contrats d’électricité pour bureaux, ateliers, commerces ou sites professionnels.",
        count:17,
        target:30,
        interested:false
      },

      gaz:{
        label:"Gaz",
        description:
          "Contrats de gaz destinés aux locaux et installations professionnelles.",
        count:9,
        target:30,
        interested:false
      },

      telephonie:{
        label:"Téléphonie et Internet",
        description:
          "Téléphonie fixe, mobile, accès Internet, fibre et solutions professionnelles.",
        count:24,
        target:30,
        interested:false
      },

      assurances:{
        label:"Assurances professionnelles",
        description:
          "Responsabilité civile, multirisque, véhicules, locaux et risques professionnels.",
        count:12,
        target:30,
        interested:false
      },

      mutuelle:{
        label:"Mutuelle collective",
        description:
          "Recherche de propositions communes pour la complémentaire santé des salariés.",
        count:8,
        target:30,
        interested:false
      },

      flotte:{
        label:"Flotte automobile",
        description:
          "Location, entretien ou gestion de plusieurs véhicules professionnels.",
        count:7,
        target:20,
        interested:false
      },

      carburant:{
        label:"Cartes carburant",
        description:
          "Solutions de carburant ou de recharge pour les véhicules professionnels.",
        count:11,
        target:25,
        interested:false
      },

      nettoyage:{
        label:"Nettoyage des bureaux et locaux",
        description:
          "Entretien régulier des bureaux, ateliers, sanitaires et espaces professionnels.",
        count:6,
        target:20,
        interested:false
      },

      vitres:{
        label:"Entretien des vitres",
        description:
          "Nettoyage périodique des vitrages, vitrines, baies et façades vitrées.",
        count:5,
        target:20,
        interested:false
      },

      espacesVerts:{
        label:"Entretien des espaces verts",
        description:
          "Tonte, taille, entretien des abords, parkings et terrains professionnels.",
        count:4,
        target:20,
        interested:false
      },

      maintenance:{
        label:"Maintenance des locaux",
        description:
          "Petits travaux, chauffage, ventilation, portes, équipements et entretien technique.",
        count:6,
        target:20,
        interested:false
      },

      dechets:{
        label:"Collecte et traitement des déchets",
        description:
          "Déchets de bureaux, déchets industriels, cartons, bois, métaux ou déchets spécifiques.",
        count:5,
        target:20,
        interested:false
      },

      alarmes:{
        label:"Alarmes et télésurveillance",
        description:
          "Protection des locaux, détection d’intrusion, vidéosurveillance et télésurveillance.",
        count:9,
        target:20,
        interested:false
      },

      controles:{
        label:"Vérifications réglementaires",
        description:
          "Exemples : installations électriques, extincteurs, appareils de levage, portes automatiques et contrôles périodiques obligatoires.",
        count:4,
        target:20,
        interested:false
      },

      formation:{
        label:"Formations professionnelles communes",
        description:
          "Exemples : sauveteur secouriste du travail, habilitation électrique, conduite d’engins, sécurité incendie, anglais professionnel et cybersécurité.",
        count:5,
        target:20,
        interested:false
      },

      autres:[]
    };
  }

  function loadData(){
    try{
      const raw =
        localStorage.getItem(MUTUALISATION_KEY);

      const saved =
        raw ? JSON.parse(raw) : null;

      if(saved && typeof saved === "object"){
        return Object.assign(
          getDefaultData(),
          saved
        );
      }
    }catch(error){
      console.warn(
        "Lecture des mutualisations impossible :",
        error
      );
    }

    return getDefaultData();
  }

  function saveData(data){
    try{
      localStorage.setItem(
        MUTUALISATION_KEY,
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement des mutualisations impossible :",
        error
      );
    }
  }

  function getItems(){
    return [
      "electricite",
      "gaz",
      "telephonie",
      "assurances",
      "mutuelle",
      "flotte",
      "carburant",
      "nettoyage",
      "vitres",
      "espacesVerts",
      "maintenance",
      "dechets",
      "alarmes",
      "controles",
      "formation"
    ];
  }

  function getHtml(){
    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Opportunités de mutualisation
        </strong>

        <br><br>

        Bo'CitéArt permet aux entreprises intéressées
        de se regrouper afin d’obtenir des propositions
        communes auprès de prestataires.

        <br><br>

        <strong>
          Chaque entreprise reste totalement libre
          d’accepter ou non une proposition.
        </strong>
      </div>

      <div class="box">
        <strong>
          Bo'CitéArt ne devient pas un groupement d’achat
        </strong>

        <br><br>

        Bo'CitéArt ne vend aucun contrat,
        ne choisit aucun prestataire à la place de l’entreprise
        et ne recommande aucun fournisseur.

        <br><br>

        Son rôle consiste uniquement à :

        <br><br>

        • recueillir les besoins communs ;<br>
        • comptabiliser les entreprises intéressées ;<br>
        • organiser une consultation ;<br>
        • centraliser les propositions reçues ;<br>
        • présenter les résultats clairement.

        <br><br>

        Le contrat éventuel reste conclu directement
        entre chaque entreprise et le prestataire retenu.
      </div>

      <div class="box">
        <strong>
          Quelles prestations sont concernées ?
        </strong>

        <br><br>

        Il s’agit de charges ou de prestations
        professionnelles récurrentes pouvant concerner
        plusieurs entreprises.

        <br><br>

        Exemples :

        <br><br>

        • énergie ;<br>
        • assurances ;<br>
        • mutuelle collective ;<br>
        • véhicules ;<br>
        • nettoyage des bureaux ;<br>
        • entretien des vitres ;<br>
        • maintenance des locaux ;<br>
        • espaces verts ;<br>
        • contrôles réglementaires ;<br>
        • formations communes.

        <br><br>

        Bo'CitéArt ne propose pas d’achat groupé
        de marchandises destinées à la revente.
      </div>

      <div
        id="mutualisationCorrectedList"
        style="margin-top:12px;">
      </div>

      <div
        class="box"
        style="margin-top:14px;">

        <strong>
          Vous avez identifié une autre charge
          ou une prestation récurrente ?
        </strong>

        <br><br>

        Vous pouvez la proposer ci-dessous.

        <br><br>

        Exemple :

        <br><br>

        <strong>
          Entretien mensuel des vitres de bureaux
        </strong>
      </div>

      <label
        style="
          display:block;
          font-weight:900;
        ">
        Quelle charge ou prestation proposez-vous ?
      </label>

      <input
        id="mutualisationCorrectedTitle"
        class="miniField"
        type="text"
        placeholder="Exemple : entretien des vitres">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Précisez votre besoin
      </label>

      <textarea
        id="mutualisationCorrectedDescription"
        class="miniField"
        style="min-height:90px;"
        placeholder="Exemple : nettoyage mensuel des vitrages de bureaux et des baies vitrées.">
      </textarea>

      <button
        id="mutualisationCorrectedSaveBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:10px;">
        Proposer cette mutualisation
      </button>

      <div
        id="mutualisationCorrectedOtherList"
        style="margin-top:12px;">
      </div>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
        ">

        <strong>
          Votre intérêt ne constitue pas un engagement
        </strong>

        <br><br>

        Le clic indique uniquement que le sujet
        peut vous intéresser.

        <br><br>

        Vous pourrez ensuite consulter les propositions reçues
        et rester libre de les accepter ou de les refuser.
      </div>
    `;
  }

  function renderMainList(){
    const host =
      getElement("mutualisationCorrectedList");

    if(!host){
      return;
    }

    const data =
      loadData();

    host.innerHTML =
      getItems().map(function(key){

        const item =
          data[key];

        const count =
          Number(item.count || 0);

        const target =
          Number(item.target || 1);

        const percent =
          Math.min(
            100,
            Math.round(
              count / target * 100
            )
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

              <strong style="font-size:16px;">
                ${escapeValue(item.label)}
              </strong>

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
                margin-top:8px;
                line-height:1.45;
              ">
              ${escapeValue(item.description || "")}
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
              class="choiceBtn mutualisationCorrectedInterestBtn"
              type="button"
              data-mutualisation-corrected-key="${escapeValue(key)}"
              style="
                width:100%;
                margin-top:10px;
                ${item.interested ? "opacity:.65;" : ""}
              ">

              ${
                item.interested
                  ? "Intérêt enregistré"
                  : "Cette mutualisation m’intéresse"
              }
            </button>
          </div>
        `;
      }).join("");

    host
      .querySelectorAll(
        ".mutualisationCorrectedInterestBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          registerInterest(
            button.getAttribute(
              "data-mutualisation-corrected-key"
            )
          );
        };
      });
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

    item.interested = true;

    item.count =
      Number(item.count || 0) + 1;

    item.updatedAt =
      Date.now();

    item.updatedAtFr =
      new Date().toLocaleString("fr-FR");

    saveData(data);

    renderMainList();

    alert(
      "Votre intérêt est enregistré.\n\n" +
      "Vous ne prenez aucun engagement à ce stade.\n\n" +
      "Vous resterez libre d’accepter ou de refuser " +
      "les propositions qui seront présentées."
    );
  }

  function saveOtherRequest(){
    const titleInput =
      getElement(
        "mutualisationCorrectedTitle"
      );

    const descriptionInput =
      getElement(
        "mutualisationCorrectedDescription"
      );

    const title =
      titleInput
        ? String(titleInput.value || "").trim()
        : "";

    const description =
      descriptionInput
        ? String(descriptionInput.value || "").trim()
        : "";

    if(!title){
      alert(
        "Indiquez clairement la charge ou la prestation proposée.\n\n" +
        "Exemple : entretien des vitres."
      );
      return;
    }

    if(!description){
      alert(
        "Précisez votre besoin.\n\n" +
        "Exemple : nettoyage mensuel des vitrages de bureaux."
      );
      return;
    }

    const data =
      loadData();

    if(!Array.isArray(data.autres)){
      data.autres = [];
    }

    data.autres.push({
      id:
        "MUT-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2,7),

      title:title,
      description:description,
      count:1,
      target:10,
      status:"a_etudier",
      createdAt:Date.now(),
      createdAtFr:
        new Date().toLocaleString("fr-FR")
    });

    saveData(data);

    if(titleInput){
      titleInput.value = "";
    }

    if(descriptionInput){
      descriptionInput.value = "";
    }

    renderOtherList();

    alert(
      "Votre proposition est enregistrée.\n\n" +
      "Elle pourra être présentée aux autres entreprises " +
      "si elle correspond à une charge professionnelle récurrente."
    );
  }

  function renderOtherList(){
    const host =
      getElement(
        "mutualisationCorrectedOtherList"
      );

    if(!host){
      return;
    }

    const data =
      loadData();

    const list =
      Array.isArray(data.autres)
        ? data.autres
        : [];

    if(!list.length){
      host.innerHTML = "";
      return;
    }

    host.innerHTML = `
      <strong style="font-size:17px;">
        Autres propositions enregistrées
      </strong>

      ${
        list.map(function(item){
          return `
            <div
              class="box"
              style="margin-top:8px;">

              <strong>
                ${escapeValue(item.title)}
              </strong>

              <br><br>

              ${escapeValue(item.description)}

              <br><br>

              Statut :

              <strong>
                À étudier
              </strong>
            </div>
          `;
        }).join("")
      }
    `;
  }

  function bindMutualisation(){
    const saveButton =
      getElement(
        "mutualisationCorrectedSaveBtn"
      );

    if(saveButton){
      saveButton.onclick =
        saveOtherRequest;
    }

    renderMainList();
    renderOtherList();
  }

function openMutualisation(){

  module.renderModal(
    "Opportunités de mutualisation",
    getHtml(),
    {
      presentationFooter:true
    }
  );

  window.setTimeout(function(){

    bindMutualisation();

  },0);
}
   
  module.registerScreen(
    "mutualisation",
    openMutualisation
  );

  module.registerScreen(
    "economies",
    openMutualisation
  );

  module.loadMutualisationData =
    loadData;

  module.saveMutualisationData =
    saveData;

  console.log(
    "✅ Mutualisations détaillées et exemples ajoutés"
  );

})();

/* =========================================================
   BO'CITÉART — CORRECTIF MÉCÉNAT
   PROJETS MAIRIE • PROJETS ENTREPRISE • ESPACE CONFIDENTIEL
   ========================================================= */

(function patchBociteEntrepriseMecenat(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const MECENAT_PRIVATE_KEY =
    "bociteart_entreprise_mecenat_private_v2";

  const MECENAT_ACCESS_KEY =
    "bociteart_entreprise_mecenat_access_v1";

  const MECENAT_PROJECTS_KEY =
    "bociteart_mecenat_projects_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function generateAccessCode(){
    const saved =
      localStorage.getItem(MECENAT_ACCESS_KEY);

    if(saved){
      return saved;
    }

    const code =
      "BCA-" +
      Math.random()
        .toString(36)
        .slice(2,6)
        .toUpperCase() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,6)
        .toUpperCase();

    localStorage.setItem(
      MECENAT_ACCESS_KEY,
      code
    );

    return code;
  }

  function loadPrivateData(){
    try{
      const raw =
        localStorage.getItem(MECENAT_PRIVATE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(parsed && typeof parsed === "object"){
        return parsed;
      }
    }catch(error){
      console.warn(
        "Lecture des données confidentielles mécénat impossible :",
        error
      );
    }

    return {
      companyName:"",
      selectedProject:"",
      projectType:"",
      contributionType:"",
      contributionAmount:"",
      skillsDescription:"",
      materialDescription:"",
      notes:"",
      accountantContacted:false,
      visibilityAccepted:false,
      updatedAtFr:""
    };
  }

  function savePrivateData(data){
    try{
      localStorage.setItem(
        MECENAT_PRIVATE_KEY,
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement des données confidentielles mécénat impossible :",
        error
      );
    }
  }

  function loadProjects(){
    try{
      const raw =
        localStorage.getItem(MECENAT_PROJECTS_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(Array.isArray(parsed)){
        return parsed;
      }
    }catch(error){
      console.warn(
        "Lecture des projets mécénat impossible :",
        error
      );
    }

    return [
      {
        id:"FRESQUE-01",
        title:"Fresque artistique locale",
        type:"Culture",
        promoter:"Mairie",
        status:"Soumis à validation municipale",
        description:
          "Création d’une fresque sur un espace validé par la commune."
      },

      {
        id:"ECOLE-01",
        title:"Projet éducatif local",
        type:"Éducation",
        promoter:"Mairie",
        status:"Projet de démonstration",
        description:
          "Soutien à une action pédagogique ou à un équipement scolaire."
      },

      {
        id:"PATRIMOINE-01",
        title:"Valorisation du patrimoine communal",
        type:"Patrimoine",
        promoter:"Mairie",
        status:"Projet de démonstration",
        description:
          "Mise en valeur d’un élément du patrimoine ou de l’histoire locale."
      }
    ];
  }

  function getPublicHtml(){
    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Connaissez-vous le mécénat ?
        </strong>

        <br><br>

        Le mécénat permet à une entreprise de soutenir
        un projet d’intérêt général par une contribution
        financière, matérielle ou par la mise à disposition
        de compétences.

        <br><br>

        Il ne s’agit pas d’une publicité traditionnelle.
      </div>

      <div class="box">
        <strong>
          Un avantage fiscal réel et avantageux existe
        </strong>

        <br><br>

        Le mécénat peut ouvrir droit à une réduction d’impôt,
        sous réserve du respect des conditions prévues
        par la réglementation en vigueur.

        <br><br>

        L’entreprise doit notamment vérifier l’éligibilité
        du bénéficiaire et conserver les justificatifs nécessaires.

        <br><br>

        Votre expert-comptable pourra confirmer
        les règles applicables à votre situation.
      </div>

      <div class="box">
        <strong>
          Les projets sont présentés prioritairement par la mairie
        </strong>

        <br><br>

        La commune peut proposer des projets locaux :

        <br><br>

        • fresques ;<br>
        • patrimoine ;<br>
        • écoles ;<br>
        • culture ;<br>
        • sport ;<br>
        • environnement ;<br>
        • solidarité.

        <br><br>

        Cela permet à la mairie de valoriser les projets
        de son territoire et d’en informer directement
        les entreprises susceptibles de les soutenir.
      </div>

      <div class="box">
        <strong>
          Une entreprise peut aussi proposer un projet sur son site
        </strong>

        <br><br>

        Lorsqu’aucun projet municipal ne correspond à son souhait,
        une entreprise peut proposer, par exemple,
        une fresque sur son siège, son atelier ou son entrepôt.

        <br><br>

        Ce projet reste soumis aux autorisations nécessaires
        et ne devient éligible au mécénat que si toutes
        les conditions juridiques et fiscales sont réunies.
      </div>

      <div
        id="mecenatPublicProjects"
        style="margin-top:12px;">
      </div>

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:12px;
        ">

        <button
          id="mecenatOpenPrivateBtn"
          class="choiceBtn"
          type="button">
          Accéder à mon espace confidentiel
        </button>

        <button
          id="mecenatVisibilityBtnV2"
          class="choiceBtn"
          type="button">
          Faire connaître mon engagement
        </button>
      </div>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
        ">

        <strong>
          Confidentialité
        </strong>

        <br><br>

        Les montants, les réflexions,
        les choix de projet et les conditions
        indiquées par l’entreprise restent privés.

        <br><br>

        Ils ne sont visibles que depuis
        l’espace professionnel sécurisé de l’entreprise.
      </div>
    `;
  }

  function renderPublicProjects(){
    const host =
      getElement("mecenatPublicProjects");

    if(!host){
      return;
    }

    const projects =
      loadProjects();

    host.innerHTML = `
      <strong style="font-size:17px;">
        Projets proposés
      </strong>

      ${
        projects.map(function(project){
          return `
            <div class="box" style="margin-top:8px;">
              <strong style="font-size:16px;">
                ${escapeValue(project.title)}
              </strong>

              <br><br>

              Catégorie :
              <strong>
                ${escapeValue(project.type)}
              </strong>

              <br>

              Présenté par :
              <strong>
                ${escapeValue(project.promoter)}
              </strong>

              <br><br>

              ${escapeValue(project.description)}

              <br><br>

              Statut :
              <strong>
                ${escapeValue(project.status)}
              </strong>

              <button
                class="choiceBtn mecenatChoosePublicProjectBtn"
                type="button"
                data-mecenat-project-id="${escapeValue(project.id)}"
                style="width:100%;margin-top:10px;">
                Étudier ce projet
              </button>
            </div>
          `;
        }).join("")
      }
    `;

    host
      .querySelectorAll(".mecenatChoosePublicProjectBtn")
      .forEach(function(button){

        button.onclick = function(){
          openPrivateSpace(
            button.getAttribute(
              "data-mecenat-project-id"
            )
          );
        };
      });
  }

  function getProjectById(projectId){
    return loadProjects().find(function(project){
      return project.id === projectId;
    }) || null;
  }

  function getPrivateHtml(projectId){
    const saved =
      loadPrivateData();

    const selectedProject =
      getProjectById(projectId) ||
      getProjectById(saved.selectedProject);

    const accessCode =
      generateAccessCode();

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Espace mécénat confidentiel
        </strong>

        <br><br>

        Cet espace est réservé à votre entreprise.

        <br><br>

        Code de démonstration attribué automatiquement :

        <br><br>

        <strong style="font-size:18px;">
          ${escapeValue(accessCode)}
        </strong>

        <br><br>

        Dans la version définitive,
        les identifiants seront générés automatiquement
        lors de l’adhésion de l’entreprise.
      </div>

      ${
        selectedProject
          ? `
            <div class="box">
              <strong>Projet sélectionné</strong>

              <br><br>

              ${escapeValue(selectedProject.title)}

              <br><br>

              Présenté par :
              ${escapeValue(selectedProject.promoter)}

              <input
                id="mecenatPrivateSelectedProject"
                type="hidden"
                value="${escapeValue(selectedProject.id)}">
            </div>
          `
          : `
            <input
              id="mecenatPrivateSelectedProject"
              type="hidden"
              value="">
          `
      }

      <label style="display:block;font-weight:900;">
        Nom de l’entreprise
      </label>

      <input
        id="mecenatPrivateCompanyName"
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
        Type de projet recherché
      </label>

      <select
        id="mecenatPrivateProjectType"
        class="miniField">

        <option value="">Choisir</option>
        <option value="culture">Culture</option>
        <option value="education">Éducation</option>
        <option value="sport">Sport</option>
        <option value="patrimoine">Patrimoine</option>
        <option value="solidarite">Solidarité</option>
        <option value="environnement">Environnement</option>
        <option value="site_entreprise">
          Projet sur le site de l’entreprise
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Forme de contribution envisagée
      </label>

      <select
        id="mecenatPrivateContributionType"
        class="miniField">

        <option value="">Choisir</option>
        <option value="financier">
          Contribution financière
        </option>
        <option value="competences">
          Mécénat de compétences
        </option>
        <option value="materiel">
          Don de matériel ou de produits
        </option>
        <option value="mixte">
          Contribution mixte
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Montant envisagé
      </label>

      <input
        id="mecenatPrivateAmount"
        class="miniField"
        type="number"
        min="0"
        step="1"
        value="${escapeValue(saved.contributionAmount || "")}"
        placeholder="Montant en euros">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Compétences proposées
      </label>

      <textarea
        id="mecenatPrivateSkills"
        class="miniField"
        style="min-height:90px;"
        placeholder="Exemple : bâtiment, communication, informatique, logistique.">${escapeValue(saved.skillsDescription || "")}</textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Matériel ou produits proposés
      </label>

      <textarea
        id="mecenatPrivateMaterial"
        class="miniField"
        style="min-height:90px;"
        placeholder="Décrivez le matériel ou les produits proposés.">${escapeValue(saved.materialDescription || "")}</textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Notes confidentielles
      </label>

      <textarea
        id="mecenatPrivateNotes"
        class="miniField"
        style="min-height:100px;"
        placeholder="Indiquez vos questions, conditions ou réflexions.">${escapeValue(saved.notes || "")}</textarea>

      <div class="box" style="margin-top:12px;">
        <label class="miniCheck">
          <input
            id="mecenatPrivateAccountant"
            type="checkbox"
            ${saved.accountantContacted ? "checked" : ""}>

          <span>
            J’ai consulté ou je consulterai
            mon expert-comptable.
          </span>
        </label>

        <label class="miniCheck">
          <input
            id="mecenatPrivateVisibility"
            type="checkbox"
            ${saved.visibilityAccepted ? "checked" : ""}>

          <span>
            J’accepte que l’entreprise soit remerciée
            dans le cadre autorisé du projet.
          </span>
        </label>
      </div>

      <button
        id="mecenatPrivateSaveBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Enregistrer confidentiellement
      </button>

      <div
        id="mecenatPrivateStatus"
        class="muted"
        style="margin-top:10px;">
      </div>
    `;
  }

  function restorePrivateSelects(){
    const saved =
      loadPrivateData();

    const projectType =
      getElement("mecenatPrivateProjectType");

    const contributionType =
      getElement("mecenatPrivateContributionType");

    if(projectType && saved.projectType){
      projectType.value =
        saved.projectType;
    }

    if(
      contributionType &&
      saved.contributionType
    ){
      contributionType.value =
        saved.contributionType;
    }
  }

  function savePrivateForm(){
    const companyName =
      String(
        getElement("mecenatPrivateCompanyName")
          ? getElement("mecenatPrivateCompanyName").value
          : ""
      ).trim();

    const selectedProject =
      String(
        getElement("mecenatPrivateSelectedProject")
          ? getElement("mecenatPrivateSelectedProject").value
          : ""
      ).trim();

    const projectType =
      String(
        getElement("mecenatPrivateProjectType")
          ? getElement("mecenatPrivateProjectType").value
          : ""
      ).trim();

    const contributionType =
      String(
        getElement("mecenatPrivateContributionType")
          ? getElement("mecenatPrivateContributionType").value
          : ""
      ).trim();

    const contributionAmount =
      String(
        getElement("mecenatPrivateAmount")
          ? getElement("mecenatPrivateAmount").value
          : ""
      ).trim();

    const skillsDescription =
      String(
        getElement("mecenatPrivateSkills")
          ? getElement("mecenatPrivateSkills").value
          : ""
      ).trim();

    const materialDescription =
      String(
        getElement("mecenatPrivateMaterial")
          ? getElement("mecenatPrivateMaterial").value
          : ""
      ).trim();

    const notes =
      String(
        getElement("mecenatPrivateNotes")
          ? getElement("mecenatPrivateNotes").value
          : ""
      ).trim();

    if(!companyName){
      alert(
        "Indiquez le nom de l’entreprise."
      );
      return;
    }

    if(!projectType && !selectedProject){
      alert(
        "Choisissez un projet ou un type de projet."
      );
      return;
    }

    if(!contributionType){
      alert(
        "Choisissez une forme de contribution."
      );
      return;
    }

    const data = {
      companyName:companyName,
      selectedProject:selectedProject,
      projectType:projectType,
      contributionType:contributionType,
      contributionAmount:contributionAmount,
      skillsDescription:skillsDescription,
      materialDescription:materialDescription,
      notes:notes,

      accountantContacted:
        !!(
          getElement("mecenatPrivateAccountant") &&
          getElement("mecenatPrivateAccountant").checked
        ),

      visibilityAccepted:
        !!(
          getElement("mecenatPrivateVisibility") &&
          getElement("mecenatPrivateVisibility").checked
        ),

      updatedAt:Date.now(),
      updatedAtFr:
        new Date().toLocaleString("fr-FR")
    };

    savePrivateData(data);

    const status =
      getElement("mecenatPrivateStatus");

    if(status){
      status.textContent =
        "Données confidentielles enregistrées le " +
        data.updatedAtFr +
        ".";
    }

    alert(
      "Votre réflexion a été enregistrée dans votre espace confidentiel."
    );
  }

  function bindPrivateSpace(){
    const saveButton =
      getElement("mecenatPrivateSaveBtn");

    if(saveButton){
      saveButton.onclick =
        savePrivateForm;
    }

    restorePrivateSelects();

    const saved =
      loadPrivateData();

    const status =
      getElement("mecenatPrivateStatus");

    if(status && saved.updatedAtFr){
      status.textContent =
        "Dernière mise à jour : " +
        saved.updatedAtFr +
        ".";
    }
  }

  function openPrivateSpace(projectId){
    module.renderModal(
      "Espace mécénat confidentiel",
      getPrivateHtml(projectId)
    );

    window.setTimeout(function(){
      bindPrivateSpace();
    },0);
  }

  function bindPublicMecenat(){
    const privateButton =
      getElement("mecenatOpenPrivateBtn");

    const visibilityButton =
      getElement("mecenatVisibilityBtnV2");

    if(privateButton){
      privateButton.onclick = function(){
        openPrivateSpace("");
      };
    }

    if(visibilityButton){
      visibilityButton.onclick = function(){
        module.openScreen("visibilite");
      };
    }

    renderPublicProjects();
  }

  function openMecenat(){
    module.renderModal(
      "Mécénat",
      getPublicHtml()
    );

    window.setTimeout(function(){
      bindPublicMecenat();
    },0);
  }

  module.registerScreen(
    "mecenat",
    openMecenat
  );

  module.openMecenatPrivateSpace =
    openPrivateSpace;

  module.loadMecenatData =
    loadPrivateData;

  module.saveMecenatData =
    savePrivateData;

  console.log(
    "✅ Mécénat corrigé et espace confidentiel chargé"
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
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Opportunités professionnelles
        </strong>

        <br><br>

        Publiez une information destinée exclusivement
        aux entreprises, artisans et professionnels.

        <br><br>

        Cette rubrique est différente
        de la publicité destinée aux habitants.
      </div>

      <div class="box">
        <strong>
          Quelle est la différence avec une publicité ?
        </strong>

        <br><br>

        <strong>La publicité locale</strong>
        permet de présenter une offre, un produit,
        une promotion ou un événement aux habitants.

        <br><br>

        <strong>L’opportunité professionnelle</strong>
        sert à rechercher ou informer d’autres entreprises.

        <br><br>

        Elle peut concerner :

        <br><br>

        • une recherche de partenaire ;<br>
        • une recherche de sous-traitant ;<br>
        • une recherche de fournisseur ;<br>
        • un appel à compétences ;<br>
        • une proposition de collaboration ;<br>
        • une formation professionnelle ;<br>
        • une conférence ou une rencontre B2B ;<br>
        • une démonstration de matériel ;<br>
        • un appel à candidatures ;<br>
        • un salon ou un événement économique.
      </div>

      <div
        class="box"
        style="border-left:6px solid #b00020;">

        <strong>
          Tarif de publication
        </strong>

        <br><br>

        <strong style="font-size:20px;">
          50 € HT
        </strong>

        <br><br>

        La publication est destinée
        à l’espace professionnel Bo'CitéArt.

        <br><br>

        Après validation et mise en ligne,
        la réservation est ferme et non remboursable.
      </div>

      <div class="box">
        <strong>
          Publier une opportunité
        </strong>

        <br><br>

        Les informations seront vérifiées
        avant leur diffusion dans la version définitive.
      </div>

      <label style="display:block;font-weight:900;">
        Nom de l’entreprise
      </label>

      <input
        id="professionalOpportunityCompany"
        class="miniField"
        type="text"
        placeholder="Nom de l’entreprise">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Type d’opportunité
      </label>

      <select
        id="professionalOpportunityType"
        class="miniField">

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
          font-weight:900;
        ">
        Titre de l’annonce
      </label>

      <input
        id="professionalOpportunityTitle"
        class="miniField"
        type="text"
        placeholder="Exemple : recherche carreleur pour chantier à Bordeaux">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Description
      </label>

      <textarea
        id="professionalOpportunityDescription"
        class="miniField"
        style="min-height:120px;"
        placeholder="Décrivez clairement votre besoin, les compétences recherchées et les conditions principales.">
      </textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Commune ou zone concernée
      </label>

      <input
        id="professionalOpportunityLocation"
        class="miniField"
        type="text"
        placeholder="Exemple : Bordeaux, Gironde ou toute la France">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Date limite de réponse
      </label>

      <input
        id="professionalOpportunityDeadline"
        class="miniField"
        type="date">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Adresse e-mail professionnelle
      </label>

      <input
        id="professionalOpportunityEmail"
        class="miniField"
        type="email"
        placeholder="contact@entreprise.fr">

      <div
        class="box"
        style="margin-top:12px;">

        <label class="miniCheck">
          <input
            id="professionalOpportunityLegal"
            type="checkbox">

          <span>
            Je confirme que cette annonce est destinée
            aux professionnels et qu’elle ne constitue pas
            une publicité grand public.
          </span>
        </label>

        <label class="miniCheck">
          <input
            id="professionalOpportunityPayment"
            type="checkbox">

          <span>
            J’accepte le tarif de 50 € HT
            et le caractère ferme et non remboursable
            après validation et mise en ligne.
          </span>
        </label>
      </div>

      <button
        id="professionalOpportunityPreviewBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Prévisualiser l’opportunité
      </button>

      <button
        id="professionalOpportunityPublishBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Valider et passer au paiement
      </button>

      <div
        id="professionalOpportunityStatus"
        class="muted"
        style="margin-top:10px;">
      </div>

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Opportunités publiées
      </div>

      <div
        id="professionalOpportunityList"
        style="margin-top:10px;">
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

    if(!validateForm(data, false)){
      return;
    }

    module.renderModal(
      "Prévisualisation de l’opportunité",
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            ${escapeValue(data.title)}
          </strong>

          <br><br>

          ${escapeValue(
            getTypeLabel(data.type)
          )}
        </div>

        <div class="box">
          <strong>Entreprise</strong><br><br>
          ${escapeValue(data.company)}
        </div>

        <div class="box">
          <strong>Description</strong><br><br>
          ${escapeValue(data.description)}
        </div>

        <div class="box">
          <strong>Zone concernée</strong><br><br>
          ${escapeValue(data.location)}
        </div>

        <div class="box">
          <strong>Date limite</strong><br><br>
          ${escapeValue(
            data.deadline || "Non précisée"
          )}
        </div>

        <div class="box">
          <strong>Contact professionnel</strong><br><br>
          ${escapeValue(data.email)}
        </div>

        <div
          class="box"
          style="border-left:6px solid #b00020;">

          Publication professionnelle :
          <strong>50 € HT</strong>
        </div>
      `
    );
  }

  function publishOpportunity(){
    const data =
      readForm();

    if(!validateForm(data, true)){
      return;
    }

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

      company:data.company,
      type:data.type,
      title:data.title,
      description:data.description,
      location:data.location,
      deadline:data.deadline,
      email:data.email,

      priceHT:50,
      paymentStatus:"demo_paid",
      publicationStatus:"published",

      invoiceNumber:
        "DEMO-OPP-" + Date.now(),

      createdAt:Date.now(),

      createdAtFr:
        new Date().toLocaleString("fr-FR")
    };

    list.unshift(opportunity);

    saveOpportunities(list);

    const status =
      getElement("professionalOpportunityStatus");

    if(status){
      status.textContent =
        "Opportunité enregistrée le " +
        opportunity.createdAtFr +
        ". Facture de démonstration : " +
        opportunity.invoiceNumber +
        ".";
    }

    alert(
      "Opportunité professionnelle enregistrée.\n\n" +
      "Dans la version définitive, elle sera publiée " +
      "après confirmation automatique du paiement de 50 € HT.\n\n" +
      "La facture sera générée et envoyée automatiquement."
    );

    openOpportunities();
  }

  function renderOpportunities(){
    const host =
      getElement("professionalOpportunityList");

    if(!host){
      return;
    }

    const list =
      loadOpportunities();

    if(!list.length){
      host.innerHTML = `
        <div class="box">
          Aucune opportunité professionnelle publiée.
        </div>
      `;

      return;
    }

    host.innerHTML =
      list.map(function(item){

        return `
          <div class="box">

            <strong style="font-size:17px;">
              ${escapeValue(item.title)}
            </strong>

            <br><br>

            ${escapeValue(
              getTypeLabel(item.type)
            )}

            <br><br>

            Entreprise :
            <strong>
              ${escapeValue(item.company)}
            </strong>

            <br><br>

            ${escapeValue(item.description)}

            <br><br>

            Zone :
            <strong>
              ${escapeValue(item.location)}
            </strong>

            <br><br>

            Date limite :
            <strong>
              ${escapeValue(
                item.deadline || "Non précisée"
              )}
            </strong>

            <br><br>

            Contact :
            ${escapeValue(item.email)}

            <br><br>

            <span class="muted">
              Publication professionnelle distincte
              de la publicité grand public.
            </span>
          </div>
        `;
      }).join("");
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
   BO'CITÉART — FACTURES DISPONIBLES 24 MOIS
   RESPONSABILITÉ D’ARCHIVAGE DE L’ENTREPRISE
   ========================================================= */

(function patchBociteInvoiceRetention(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const INVOICE_KEY =
    "bociteart_entreprise_search_invoices_v1";

  const PLAN_KEY =
    "bociteart_entreprise_search_plan_v1";

  const RETENTION_MONTHS = 24;

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadPlan(){
    try{
      const raw =
        localStorage.getItem(PLAN_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      return parsed &&
        typeof parsed === "object"
          ? parsed
          : {
              plan:"commune",
              active:true
            };
    }catch(error){
      return {
        plan:"commune",
        active:true
      };
    }
  }

  function savePlan(plan){
    try{
      localStorage.setItem(
        PLAN_KEY,
        JSON.stringify(plan || {})
      );
    }catch(error){
      console.warn(
        "Enregistrement de l’abonnement impossible :",
        error
      );
    }
  }

  function loadAllInvoices(){
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

  function saveInvoices(list){
    try{
      localStorage.setItem(
        INVOICE_KEY,
        JSON.stringify(list || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement des factures impossible :",
        error
      );
    }
  }

  function getRetentionLimit(){
    const limit =
      new Date();

    limit.setMonth(
      limit.getMonth() -
      RETENTION_MONTHS
    );

    return limit.getTime();
  }

  function cleanExpiredInvoices(){
    const invoices =
      loadAllInvoices();

    const limit =
      getRetentionLimit();

    const retained =
      invoices.filter(function(invoice){

        const timestamp =
          Number(invoice.createdAt || 0);

        if(!timestamp){
          return true;
        }

        return timestamp >= limit;
      });

    if(retained.length !== invoices.length){
      saveInvoices(retained);
    }

    return retained;
  }

  function getPlanLabel(planName){
    if(planName === "europe"){
      return "Recherche professionnelle Europe";
    }

    if(planName === "france"){
      return "Recherche professionnelle France";
    }

    return "Recherche locale";
  }

  function formatDate(value){
    if(!value){
      return "Non renseignée";
    }

    const date =
      new Date(value + "T12:00:00");

    if(Number.isNaN(date.getTime())){
      return value;
    }

    return date.toLocaleDateString("fr-FR");
  }

  function formatMoney(value){
    return Number(value || 0)
      .toFixed(2)
      .replace(".",",");
  }

  function getInvoiceExpiryDate(invoice){
    const created =
      new Date(
        Number(invoice.createdAt || Date.now())
      );

    created.setMonth(
      created.getMonth() +
      RETENTION_MONTHS
    );

    return created.toLocaleDateString("fr-FR");
  }

  function getBillingHtml(){
    const plan =
      loadPlan();

    const invoices =
      cleanExpiredInvoices();

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Mon abonnement de recherche
        </strong>

        <br><br>

        Formule actuelle :

        <br><br>

        <strong>
          ${escapeValue(
            getPlanLabel(plan.plan)
          )}
        </strong>

        <br><br>

        Statut :

        <strong>
          ${
            plan.active
              ? "Actif"
              : "Suspendu"
          }
        </strong>

        ${
          plan.plan !== "commune"
            ? `
              <br><br>

              Paiement :

              <strong>
                ${
                  plan.billingMode === "annuel"
                    ? "Annuel"
                    : "Mensuel"
                }
              </strong>

              <br><br>

              Prochaine échéance :

              <strong>
                ${escapeValue(
                  formatDate(
                    plan.nextBillingDate
                  )
                )}
              </strong>

              <br><br>

              Renouvellement automatique :

              <strong>
                ${
                  plan.autoRenew
                    ? "Activé"
                    : "Désactivé"
                }
              </strong>
            `
            : ""
        }
      </div>

      ${
        plan.plan !== "commune"
          ? `
            <button
              id="invoiceRetentionRenewBtn"
              class="choiceBtn"
              type="button"
              style="width:100%;">

              ${
                plan.autoRenew
                  ? "Désactiver le renouvellement automatique"
                  : "Réactiver le renouvellement automatique"
              }
            </button>
          `
          : `
            <div class="box">
              La recherche dans votre commune
              est incluse dans votre espace professionnel.

              <br><br>

              Les recherches France et Europe
              nécessitent une option payante.
            </div>
          `
      }

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
        ">

        <strong>
          Conservation de vos factures
        </strong>

        <br><br>

        Les factures Bo'CitéArt restent disponibles
        dans votre espace pendant
        <strong>24 mois à compter de leur émission</strong>.

        <br><br>

        Téléchargez-les dès leur réception
        et transmettez-les à votre service comptable.

        <br><br>

        <strong>
          La conservation légale des documents comptables
          reste sous la responsabilité de votre entreprise.
        </strong>

        <br><br>

        Bo'CitéArt n’assure pas un archivage permanent
        de vos pièces comptables.

        <br><br>

        Après 24 mois, les factures peuvent être
        automatiquement retirées de votre espace.
      </div>

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Mes factures disponibles
      </div>

      <div
        id="invoiceRetentionList"
        style="margin-top:10px;">

        ${
          invoices.length
            ? invoices.map(function(invoice){

                return `
                  <div class="box">

                    <strong>
                      ${escapeValue(
                        invoice.number || "Facture"
                      )}
                    </strong>

                    <br><br>

                    ${escapeValue(
                      invoice.planLabel ||
                      "Service Bo'CitéArt"
                    )}

                    <br><br>

                    Montant HT :

                    <strong>
                      ${formatMoney(
                        invoice.amountHT
                      )}
                      €
                    </strong>

                    <br>

                    TVA :

                    ${formatMoney(
                      invoice.amountVAT
                    )}
                    €

                    <br>

                    Total TTC :

                    <strong>
                      ${formatMoney(
                        invoice.amountTTC
                      )}
                      €
                    </strong>

                    <br><br>

                    Émise le :

                    ${escapeValue(
                      invoice.createdAtFr || ""
                    )}

                    <br><br>

                    Disponible dans cet espace jusqu’au :

                    <strong>
                      ${escapeValue(
                        getInvoiceExpiryDate(invoice)
                      )}
                    </strong>

                    <br><br>

                    Statut :

                    <strong>
                      ${
                        invoice.status === "paid"
                          ? "Payée"
                          : "En attente"
                      }
                    </strong>

                    <button
                      class="choiceBtn invoiceRetentionDownloadBtn"
                      type="button"
                      data-invoice-id="${escapeValue(
                        invoice.id
                      )}"
                      style="
                        width:100%;
                        margin-top:10px;
                      ">
                      Télécharger et archiver la facture
                    </button>
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucune facture disponible
                dans les 24 derniers mois.
              </div>
            `
        }
      </div>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #2f5d46;
        ">

        <strong>
          Renouvellement et paiement
        </strong>

        <br><br>

        Un rappel est prévu 7 jours avant l’échéance,
        puis un second rappel 3 jours avant.

        <br><br>

        En cas d’échec du paiement,
        seule l’option France ou Europe est suspendue.

        <br><br>

        La recherche dans la commune reste accessible.
      </div>
    `;
  }

  function downloadInvoice(invoiceId){
    const invoice =
      cleanExpiredInvoices().find(function(item){
        return item.id === invoiceId;
      });

    if(!invoice){
      alert(
        "Cette facture n’est plus disponible dans votre espace."
      );
      return;
    }

    const confirmation =
      confirm(
        "Téléchargez et archivez cette facture dès maintenant.\n\n" +
        "Bo'CitéArt la conserve dans votre espace pendant 24 mois seulement.\n\n" +
        "La conservation comptable reste sous la responsabilité de votre entreprise.\n\n" +
        "Continuer le téléchargement ?"
      );

    if(!confirmation){
      return;
    }

    const content =
      "BO'CITÉART\n" +
      "FACTURE DE DÉMONSTRATION\n\n" +

      "Facture : " +
      (invoice.number || "") +
      "\n" +

      "Date : " +
      (invoice.createdAtFr || "") +
      "\n\n" +

      "Service : " +
      (
        invoice.planLabel ||
        "Service Bo'CitéArt"
      ) +
      "\n" +

      "Périodicité : " +
      (
        invoice.billingMode === "annuel"
          ? "Annuelle"
          : "Mensuelle"
      ) +
      "\n\n" +

      "Montant HT : " +
      formatMoney(invoice.amountHT) +
      " €\n" +

      "TVA : " +
      formatMoney(invoice.amountVAT) +
      " €\n" +

      "Total TTC : " +
      formatMoney(invoice.amountTTC) +
      " €\n\n" +

      "Statut : " +
      (
        invoice.status === "paid"
          ? "Payée"
          : "En attente"
      ) +
      "\n\n" +

      "IMPORTANT\n" +
      "Cette facture reste disponible dans l’espace Bo'CitéArt pendant 24 mois.\n" +
      "La conservation légale du document reste sous la responsabilité de l’entreprise.\n\n" +

      "Document de démonstration — sans valeur comptable.";

    const blob =
      new Blob(
        [content],
        {
          type:"text/plain;charset=utf-8"
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      (
        invoice.number ||
        "facture-bociteart"
      ) +
      ".txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function bindBilling(){
    const plan =
      loadPlan();

    const renewButton =
      getElement(
        "invoiceRetentionRenewBtn"
      );

    if(renewButton){
      renewButton.onclick = function(){

        plan.autoRenew =
          !plan.autoRenew;

        savePlan(plan);

        alert(
          plan.autoRenew
            ? "Renouvellement automatique réactivé."
            : "Renouvellement automatique désactivé. L’accès restera actif jusqu’à l’échéance."
        );

        openBilling();
      };
    }

    document
      .querySelectorAll(
        ".invoiceRetentionDownloadBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          downloadInvoice(
            button.getAttribute(
              "data-invoice-id"
            )
          );
        };
      });
  }

  function openBilling(){
    module.renderModal(
      "Abonnement et factures",
      getBillingHtml()
    );

    window.setTimeout(function(){
      bindBilling();
    },0);
  }

  module.openSearchBilling =
    openBilling;

  module.cleanExpiredSearchInvoices =
    cleanExpiredInvoices;

  cleanExpiredInvoices();

  console.log(
    "✅ Factures limitées à 24 mois et archivage responsabilisé"
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
   BO'CITÉART — MÉCÉNAT
   PARTIE 1 — PRÉSENTATION PUBLIQUE ET ATTRACTIVE
   ========================================================= */

(function addBociteMecenatPublicPresentation(){

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

  function getMecenatPublicPresentationHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.55;
        ">

        <strong style="font-size:20px;">
          Et si une partie de votre effort fiscal
          devenait une action visible et durable
          pour votre ville ?
        </strong>

        <br><br>

        Le mécénat permet à une entreprise
        de soutenir directement un projet utile
        à son territoire :

        <br><br>

        • culture ;<br>
        • sport ;<br>
        • éducation ;<br>
        • patrimoine ;<br>
        • environnement ;<br>
        • solidarité ;<br>
        • création artistique ;<br>
        • valorisation des métiers et des talents locaux.

        <br><br>

        Votre entreprise ne finance pas seulement
        une réalisation.

        <br><br>

        Elle participe concrètement
        au développement de sa ville
        et laisse une trace utile dans le temps.
      </div>

      <div
        class="box"
        style="
          border-left:6px solid #b00020;
          line-height:1.55;
        ">

        <strong style="font-size:19px;">
          Une réduction d’impôt particulièrement attractive
          peut s’appliquer
        </strong>

        <br><br>

        Lorsqu’un projet et son bénéficiaire
        remplissent les conditions prévues
        par la réglementation,
        le mécénat peut ouvrir droit
        à une réduction d’impôt
        pouvant atteindre généralement
        <strong>60 % du montant du don</strong>.

        <br><br>

        Exemple indicatif :

        <br><br>

        Pour une contribution de :

        <br>

        <strong style="font-size:18px;">
          1 000 €
        </strong>

        <br><br>

        la réduction d’impôt peut représenter :

        <br>

        <strong style="font-size:18px;">
          600 €
        </strong>

        <br><br>

        Le coût restant pour l’entreprise
        peut alors être de :

        <br>

        <strong style="font-size:18px;">
          400 €
        </strong>

        <br><br>

        Cet exemple reste soumis
        aux conditions juridiques et fiscales applicables.

        <br><br>

        Votre expert-comptable doit confirmer
        l’éligibilité du projet,
        du bénéficiaire et de votre entreprise.
      </div>

      <div class="box" style="line-height:1.55;">

        <strong style="font-size:18px;">
          Une contribution utile plutôt qu’un simple coût
        </strong>

        <br><br>

        Lorsqu’elle est éligible,
        l’entreprise peut choisir d’affecter
        une partie de son effort financier
        à une action concrète sur son territoire.

        <br><br>

        Elle participe ainsi directement :

        <br><br>

        • à l’embellissement de la ville ;<br>
        • à la découverte de nouveaux artistes ;<br>
        • au soutien des associations ;<br>
        • au développement du sport ;<br>
        • aux projets culturels et éducatifs ;<br>
        • à la valorisation de l’histoire locale ;<br>
        • à la création de liens entre les habitants.

        <br><br>

        L’entreprise voit ce qu’elle soutient
        et peut suivre l’évolution du projet.
      </div>

      <div class="box" style="line-height:1.55;">

        <strong style="font-size:18px;">
          Des retombées durables pour votre entreprise
        </strong>

        <br><br>

        Le mécénat n’est pas une publicité traditionnelle.

        <br><br>

        Il peut néanmoins produire
        des effets importants sur le long terme :

        <br><br>

        • faire connaître l’existence de l’entreprise ;<br>
        • expliquer ses métiers et son savoir-faire ;<br>
        • renforcer sa réputation locale ;<br>
        • créer de la confiance ;<br>
        • développer le bouche-à-oreille ;<br>
        • valoriser les salariés ;<br>
        • renforcer la fierté d’appartenance ;<br>
        • faciliter les recrutements futurs ;<br>
        • associer durablement son nom à un projet utile.

        <br><br>

        Une entreprise connue et reconnue
        dans son territoire devient plus facilement
        une entreprise à laquelle les habitants pensent,
        qu’ils recommandent et qu’ils souhaitent rejoindre.
      </div>

      <div class="box" style="line-height:1.55;">

        <strong style="font-size:18px;">
          Révéler les talents artistiques de nos villes
        </strong>

        <br><br>

        De nombreux artistes amateurs ou professionnels
        restent encore invisibles dans nos communes.

        <br><br>

        Bo'CitéArt souhaite leur ouvrir la porte
        en développant des projets capables
        de révéler leur travail :

        <br><br>

        • œuvres murales peintes ;<br>
        • sculptures ;<br>
        • œuvres en bronze ;<br>
        • installations artistiques ;<br>
        • photographies ;<br>
        • créations numériques ;<br>
        • tableaux d’artistes locaux ;<br>
        • mobilier artistique ;<br>
        • mise en valeur d’un véhicule ancien
          ou exceptionnel ;<br>
        • œuvres liées à l’histoire,
          aux métiers ou à la vie de la ville.

        <br><br>

        Le projet artistique doit toujours
        créer un lien avec le territoire,
        ses habitants, son patrimoine,
        ses entreprises ou ses activités.
      </div>

      <div class="box" style="line-height:1.55;">

        <strong style="font-size:18px;">
          Une entreprise peut accueillir une œuvre
          sur son propre site
        </strong>

        <br><br>

        Lorsqu’aucun projet municipal
        ne correspond aux espaces disponibles,
        une entreprise peut proposer
        l’accueil d’une ou plusieurs œuvres
        sur :

        <br><br>

        • son siège ;<br>
        • son terrain ;<br>
        • un mur d’entrepôt ;<br>
        • son atelier ;<br>
        • ses bureaux ;<br>
        • ses espaces extérieurs ;<br>
        • tout autre lieu adapté.

        <br><br>

        Le projet reste soumis
        aux autorisations nécessaires
        et aux conditions juridiques,
        fiscales, techniques et artistiques applicables.
      </div>

      <div class="box" style="line-height:1.55;">

        <strong style="font-size:18px;">
          Comment les projets sont-ils préparés ?
        </strong>

        <br><br>

        Bo'CitéArt prépare un thème
        lié à la vie de la ville,
        à ses métiers,
        à son histoire,
        à ses habitants
        ou à son évolution.

        <br><br>

        Le thème est ensuite présenté à la mairie.

        <br><br>

        La commune peut :

        <br><br>

        • valider le thème ;<br>
        • demander une adaptation ;<br>
        • proposer une évolution ;<br>
        • refuser le projet en indiquant son motif.

        <br><br>

        Les échanges ont lieu avant la validation définitive
        afin de conserver la cohérence artistique du projet
        tout en tenant compte de la vision de la commune.
      </div>

      <div class="box" style="line-height:1.55;">

        <strong style="font-size:18px;">
          Les citoyens et les artistes restent au cœur du projet
        </strong>

        <br><br>

        Les dessins et propositions visuelles
        sont recherchés en priorité
        auprès des citoyens et artistes de la ville.

        <br><br>

        Lorsqu’une réalisation à grande échelle
        exige une compétence particulière,
        Bo'CitéArt recherche un artiste capable
        de la réaliser :

        <br><br>

        1. dans la commune ;<br>
        2. dans les communes voisines ;<br>
        3. dans le territoire ;<br>
        4. dans la région si nécessaire.

        <br><br>

        Lorsqu’une ville comprend plusieurs quartiers
        ou plusieurs espaces,
        plusieurs artistes peuvent être sollicités.

        <br><br>

        Cette organisation permet
        de valoriser davantage de créateurs
        et de renouveler régulièrement
        le regard porté sur la ville.
      </div>

      <div
        class="box"
        style="
          line-height:1.55;
          border-left:6px solid #2f5d46;
        ">

        <strong style="font-size:18px;">
          Un renouvellement régulier des thèmes
        </strong>

        <br><br>

        Les grandes réalisations visuelles
        peuvent être renouvelées selon un rythme prévu,
        par exemple tous les deux ans.

        <br><br>

        L’année intermédiaire permet de préparer :

        <br><br>

        • le thème suivant ;<br>
        • les consultations citoyennes ;<br>
        • la sélection des dessins ;<br>
        • les validations ;<br>
        • la recherche des artistes ;<br>
        • les partenariats et le mécénat.

        <br><br>

        Ce roulement crée une attente,
        renouvelle l’intérêt des habitants
        et permet de révéler progressivement
        les différentes dimensions de la ville.
      </div>

      <div
        style="
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-top:14px;
        ">

        <button
          id="mecenatPublicDiscoverProjectsBtn"
          class="choiceBtn"
          type="button">
          Découvrir les projets proposés
        </button>

        <button
          id="mecenatPublicInterestedBtn"
          class="choiceBtn"
          type="button">
          Je suis intéressé
        </button>

        <button
          id="mecenatPublicPrivateSpaceBtn"
          class="choiceBtn"
          type="button">
          Mon espace mécénat privé
        </button>
      </div>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
          line-height:1.55;
        ">

        <strong>
          Vos choix restent confidentiels
        </strong>

        <br><br>

        Les montants envisagés,
        vos notes,
        les projets étudiés,
        vos conditions
        et votre décision
        restent dans l’espace sécurisé
        de votre entreprise.

        <br><br>

        Rien n’est publié
        sans votre validation explicite.
      </div>

      <div
        id="mecenatPublicPresentationStatus"
        class="muted"
        style="margin-top:10px;">
      </div>
    `;
  }

  function bindMecenatPublicPresentation(){

    const discoverButton =
      getElement(
        "mecenatPublicDiscoverProjectsBtn"
      );

    const interestedButton =
      getElement(
        "mecenatPublicInterestedBtn"
      );

    const privateButton =
      getElement(
        "mecenatPublicPrivateSpaceBtn"
      );

    const status =
      getElement(
        "mecenatPublicPresentationStatus"
      );

    if(discoverButton){
      discoverButton.onclick = function(){

        if(status){
          status.innerHTML = `
            <div class="box">
              La liste complète des projets
              proposés ou validés
              sera intégrée dans la prochaine partie.
            </div>
          `;
        }
      };
    }

    if(interestedButton){
      interestedButton.onclick = function(){

        try{
          localStorage.setItem(
            "bociteart_mecenat_general_interest_v1",
            JSON.stringify({
              interested:true,
              createdAt:Date.now(),
              createdAtFr:
                new Date().toLocaleString("fr-FR"),
              status:"interet_enregistre"
            })
          );
        }catch(error){}

        if(status){
          status.innerHTML = `
            <div
              class="box"
              style="border-left:6px solid #2f5d46;">

              <strong>
                Votre intérêt est enregistré
              </strong>

              <br><br>

              Cela ne constitue pas encore
              un engagement financier ou contractuel.

              <br><br>

              Vous pourrez ensuite consulter
              les projets disponibles
              et choisir librement
              celui que vous souhaitez étudier.
            </div>
          `;
        }

        status.scrollIntoView({
          behavior:"smooth",
          block:"nearest"
        });
      };
    }

    if(privateButton){
      privateButton.onclick = function(){

        if(
          typeof module.openMecenatPrivateSpace ===
          "function"
        ){
          module.openMecenatPrivateSpace("");
          return;
        }

        alert(
          "L’espace mécénat privé est momentanément indisponible."
        );
      };
    }
  }

  function openMecenatPublicPresentation(){

    module.renderModal(
      "Mécénat — Entreprise et territoire",
      getMecenatPublicPresentationHtml()
    );

    window.setTimeout(function(){
      bindMecenatPublicPresentation();
    },0);
  }

  module.registerScreen(
    "mecenat",
    openMecenatPublicPresentation
  );

  module.openMecenatPublicPresentation =
    openMecenatPublicPresentation;

  console.log(
    "✅ Mécénat — partie 1 présentation publique chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MÉCÉNAT
   PARTIE 2 — PROJETS VALIDÉS ET MANIFESTATIONS D’INTÉRÊT
   ========================================================= */

(function addBociteMecenatProjectsCatalogue(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const PROJECTS_KEY =
    "bociteart_mecenat_validated_projects_v2";

  const INTERESTS_KEY =
    "bociteart_mecenat_company_interests_v2";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function getDefaultProjects(){
    return [
      {
        id:"ART-VILLE-001",

        title:
          "Œuvres et parcours artistiques liés à la vie de la ville",

        category:
          "Création artistique",

        promoter:
          "Bo'CitéArt",

        municipalStatus:
          "valide",

        companyStatus:
          "ouvert",

        location:
          "Espaces proposés et validés avec la commune",

        description:
          "Création d’un ensemble d’œuvres révélant les habitants, les métiers, l’histoire, les quartiers et les activités de la ville.",

        possibleWorks:[
          "Œuvre murale peinte",
          "Sculpture",
          "Œuvre en bronze",
          "Photographie",
          "Création numérique",
          "Tableaux d’artistes locaux",
          "Installation artistique",
          "Mobilier artistique"
        ],

        artists:
          "Citoyens et artistes recherchés prioritairement dans la commune, puis autour et dans la région.",

        rhythm:
          "Préparation annuelle et renouvellement visuel possible tous les deux ans.",

        fundingGoal:
          "À définir selon les œuvres et les espaces",

        visible:true
      },

      {
        id:"SPORT-LOCAL-001",

        title:
          "Soutien à une action sportive locale",

        category:
          "Sport",

        promoter:
          "Mairie",

        municipalStatus:
          "valide",

        companyStatus:
          "ouvert",

        location:
          "Commune pilote",

        description:
          "Soutien à une action sportive, à un équipement ou à un projet porté dans un cadre local éligible.",

        possibleWorks:[
          "Équipement",
          "Action éducative",
          "Événement local",
          "Projet d’inclusion"
        ],

        artists:"",
        rhythm:
          "Selon le calendrier du projet",

        fundingGoal:
          "À définir par le porteur du projet",

        visible:true
      },

      {
        id:"ECOLE-LOCAL-001",

        title:
          "Projet éducatif et culturel pour les écoles",

        category:
          "Éducation",

        promoter:
          "Mairie",

        municipalStatus:
          "adapte",

        companyStatus:
          "ouvert",

        location:
          "Écoles de la commune",

        description:
          "Soutien à une action pédagogique, culturelle ou artistique construite avec les établissements concernés.",

        possibleWorks:[
          "Atelier artistique",
          "Projet pédagogique",
          "Découverte des métiers",
          "Création collective"
        ],

        artists:
          "Intervenants et artistes locaux recherchés en priorité.",

        rhythm:
          "Selon le calendrier scolaire",

        fundingGoal:
          "À définir après validation définitive",

        visible:true
      },

      {
        id:"PATRIMOINE-LOCAL-001",

        title:
          "Mise en valeur du patrimoine et de l’histoire locale",

        category:
          "Patrimoine",

        promoter:
          "Bo'CitéArt et mairie",

        municipalStatus:
          "en_etude",

        companyStatus:
          "ferme",

        location:
          "Lieu à confirmer",

        description:
          "Projet destiné à raconter un élément du patrimoine, une activité ancienne, un métier ou une évolution importante de la ville.",

        possibleWorks:[
          "Parcours historique",
          "Photographie",
          "Œuvre sculptée",
          "Création graphique",
          "Installation extérieure"
        ],

        artists:
          "Sélection après validation du thème et du lieu.",

        rhythm:
          "Projet en préparation",

        fundingGoal:
          "Non ouvert au mécénat pour le moment",

        visible:false
      }
    ];
  }

  function loadProjects(){
    try{
      const raw =
        localStorage.getItem(PROJECTS_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(Array.isArray(parsed)){
        return parsed;
      }
    }catch(error){
      console.warn(
        "Lecture des projets mécénat impossible :",
        error
      );
    }

    const defaults =
      getDefaultProjects();

    try{
      localStorage.setItem(
        PROJECTS_KEY,
        JSON.stringify(defaults)
      );
    }catch(error){}

    return defaults;
  }

  function saveProjects(projects){
    try{
      localStorage.setItem(
        PROJECTS_KEY,
        JSON.stringify(projects || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement des projets mécénat impossible :",
        error
      );
    }
  }

  function loadInterests(){
    try{
      const raw =
        localStorage.getItem(INTERESTS_KEY);

      const parsed =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed)
        ? parsed
        : [];
    }catch(error){
      return [];
    }
  }

  function saveInterests(interests){
    try{
      localStorage.setItem(
        INTERESTS_KEY,
        JSON.stringify(interests || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement de l’intérêt mécénat impossible :",
        error
      );
    }
  }

  function getMunicipalStatusLabel(status){
    const labels = {
      propose:
        "Thème proposé à la mairie",

      en_etude:
        "En cours d’étude par la mairie",

      adaptation_demandee:
        "Adaptation demandée",

      adapte:
        "Projet adapté avec la mairie",

      valide:
        "Projet validé par la mairie",

      refuse:
        "Projet refusé"
    };

    return labels[status] || status;
  }

  function getVisibleProjects(){
    return loadProjects().filter(function(project){
      return (
        project.visible === true &&
        project.companyStatus === "ouvert" &&
        (
          project.municipalStatus === "valide" ||
          project.municipalStatus === "adapte"
        )
      );
    });
  }

  function hasCompanyInterest(projectId){
    return loadInterests().some(function(item){
      return item.projectId === projectId;
    });
  }

  function getProjectsHtml(){
    const projects =
      getVisibleProjects();

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Projets ouverts aux entreprises
        </strong>

        <br><br>

        L’entreprise ne voit ici que les projets
        validés, adaptés avec la mairie
        ou officiellement ouverts
        à une manifestation d’intérêt.

        <br><br>

        Les thèmes encore en préparation,
        en discussion ou refusés
        ne sont pas présentés aux entreprises.
      </div>

      <div
        class="box"
        style="line-height:1.5;">

        <strong>
          Comment fonctionne la sélection ?
        </strong>

        <br><br>

        1. Bo'CitéArt prépare un thème
        lié à la vie du territoire.

        <br><br>

        2. Le projet est présenté à la mairie.

        <br><br>

        3. La mairie peut le valider,
        demander une adaptation ou le refuser.

        <br><br>

        4. Après validation,
        le projet peut être présenté
        aux entreprises intéressées.

        <br><br>

        5. L’intérêt d’une entreprise reste privé
        jusqu’à la conclusion d’un accord.
      </div>

      <div
        id="mecenatValidatedProjectList"
        style="margin-top:12px;">

        ${
          projects.length
            ? projects.map(function(project){

                const interested =
                  hasCompanyInterest(project.id);

                return `
                  <div
                    class="box"
                    style="
                      margin-top:10px;
                      border-left:6px solid #2f5d46;
                    ">

                    <strong style="font-size:18px;">
                      ${escapeValue(project.title)}
                    </strong>

                    <br><br>

                    Catégorie :

                    <strong>
                      ${escapeValue(project.category)}
                    </strong>

                    <br><br>

                    Présenté par :

                    <strong>
                      ${escapeValue(project.promoter)}
                    </strong>

                    <br><br>

                    État municipal :

                    <strong>
                      ${escapeValue(
                        getMunicipalStatusLabel(
                          project.municipalStatus
                        )
                      )}
                    </strong>

                    <br><br>

                    Lieu ou territoire :

                    <strong>
                      ${escapeValue(project.location)}
                    </strong>

                    <br><br>

                    ${escapeValue(project.description)}

                    ${
                      Array.isArray(project.possibleWorks) &&
                      project.possibleWorks.length
                        ? `
                          <br><br>

                          <strong>
                            Exemples de réalisations possibles
                          </strong>

                          <br><br>

                          ${project.possibleWorks
                            .map(function(item){
                              return (
                                "• " +
                                escapeValue(item)
                              );
                            })
                            .join("<br>")}
                        `
                        : ""
                    }

                    ${
                      project.artists
                        ? `
                          <br><br>

                          <strong>
                            Artistes et intervenants
                          </strong>

                          <br><br>

                          ${escapeValue(project.artists)}
                        `
                        : ""
                    }

                    <br><br>

                    Rythme ou calendrier :

                    <strong>
                      ${escapeValue(project.rhythm)}
                    </strong>

                    <br><br>

                    Besoin de financement :

                    <strong>
                      ${escapeValue(project.fundingGoal)}
                    </strong>

                    <button
                      class="choiceBtn mecenatProjectInterestBtn"
                      type="button"
                      data-mecenat-project-id="${escapeValue(project.id)}"
                      style="
                        width:100%;
                        margin-top:12px;
                        ${interested ? "opacity:.65;" : ""}
                      ">

                      ${
                        interested
                          ? "Intérêt privé déjà enregistré"
                          : "Ce projet peut m’intéresser"
                      }
                    </button>

                    <button
                      class="choiceBtn mecenatProjectPrivateBtn"
                      type="button"
                      data-mecenat-project-id="${escapeValue(project.id)}"
                      style="
                        width:100%;
                        margin-top:8px;
                        background:#fff;
                      ">
                      Étudier ce projet dans mon espace privé
                    </button>
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucun projet n’est actuellement ouvert
                à une manifestation d’intérêt.
              </div>
            `
        }
      </div>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
        ">

        <strong>
          Confidentialité
        </strong>

        <br><br>

        Le fait de cliquer sur un projet
        n’est pas rendu public.

        <br><br>

        La mairie, les habitants
        et les autres entreprises
        ne voient ni votre intérêt,
        ni vos notes,
        ni le montant envisagé.

        <br><br>

        Un engagement ne devient effectif
        qu’après validation contractuelle.
      </div>
    `;
  }

  function registerProjectInterest(projectId){
    const project =
      getVisibleProjects().find(function(item){
        return item.id === projectId;
      });

    if(!project){
      alert(
        "Ce projet n’est plus ouvert aux entreprises."
      );
      return;
    }

    const interests =
      loadInterests();

    const existing =
      interests.find(function(item){
        return item.projectId === projectId;
      });

    if(existing){
      alert(
        "Votre intérêt privé est déjà enregistré pour ce projet."
      );
      return;
    }

    interests.push({
      id:
        "MEC-INT-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2,7),

      projectId:project.id,
      projectTitle:project.title,

      status:
        "interet_prive_enregistre",

      private:true,

      contractSigned:false,

      createdAt:
        Date.now(),

      createdAtFr:
        new Date().toLocaleString("fr-FR")
    });

    saveInterests(interests);

    alert(
      "Votre intérêt privé est enregistré.\n\n" +
      "Cela ne constitue ni un engagement financier " +
      "ni un accord contractuel.\n\n" +
      "Vous pouvez maintenant étudier ce projet " +
      "dans votre espace mécénat privé."
    );

    openProjectsCatalogue();
  }

  function openProjectPrivateSpace(projectId){
    registerProjectInterestSilently(projectId);

    if(
      typeof module.openMecenatPrivateSpace ===
      "function"
    ){
      module.openMecenatPrivateSpace(projectId);
      return;
    }

    alert(
      "L’espace mécénat privé est momentanément indisponible."
    );
  }

  function registerProjectInterestSilently(projectId){
    const project =
      getVisibleProjects().find(function(item){
        return item.id === projectId;
      });

    if(!project){
      return;
    }

    const interests =
      loadInterests();

    if(
      interests.some(function(item){
        return item.projectId === projectId;
      })
    ){
      return;
    }

    interests.push({
      id:
        "MEC-INT-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2,7),

      projectId:project.id,
      projectTitle:project.title,

      status:
        "etude_privee",

      private:true,

      contractSigned:false,

      createdAt:
        Date.now(),

      createdAtFr:
        new Date().toLocaleString("fr-FR")
    });

    saveInterests(interests);
  }

  function bindProjectsCatalogue(){
    document
      .querySelectorAll(
        ".mecenatProjectInterestBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          registerProjectInterest(
            button.getAttribute(
              "data-mecenat-project-id"
            )
          );
        };
      });

    document
      .querySelectorAll(
        ".mecenatProjectPrivateBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          openProjectPrivateSpace(
            button.getAttribute(
              "data-mecenat-project-id"
            )
          );
        };
      });
  }

  function openProjectsCatalogue(){
    module.renderModal(
      "Projets ouverts au mécénat",
      getProjectsHtml()
    );

    window.setTimeout(function(){
      bindProjectsCatalogue();
    },0);
  }

  module.openMecenatProjectsCatalogue =
    openProjectsCatalogue;

  module.loadMecenatValidatedProjects =
    loadProjects;

  module.saveMecenatValidatedProjects =
    saveProjects;

  module.loadMecenatCompanyInterests =
    loadInterests;

  document.addEventListener(
    "click",
    function(event){

      const button =
        event.target &&
        typeof event.target.closest === "function"
          ? event.target.closest(
              "#mecenatPublicDiscoverProjectsBtn"
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

      openProjectsCatalogue();
    },
    true
  );

  console.log(
    "✅ Mécénat — partie 2 projets validés chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MÉCÉNAT
   PARTIE 3 — PROJETS PROPOSÉS PAR LES ENTREPRISES
   ========================================================= */

(function addBociteMecenatCompanyProjects(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const COMPANY_PROJECTS_KEY =
    "bociteart_mecenat_company_projects_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function loadCompanyProjects(){
    try{
      const raw =
        localStorage.getItem(
          COMPANY_PROJECTS_KEY
        );

      const parsed =
        raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed)
        ? parsed
        : [];
    }catch(error){
      console.warn(
        "Lecture des projets proposés par les entreprises impossible :",
        error
      );

      return [];
    }
  }

  function saveCompanyProjects(projects){
    try{
      localStorage.setItem(
        COMPANY_PROJECTS_KEY,
        JSON.stringify(projects || [])
      );
    }catch(error){
      console.warn(
        "Enregistrement du projet impossible :",
        error
      );
    }
  }

  function getCompanyProjectHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Proposer l’accueil d’une œuvre
          ou d’un projet artistique sur votre site
        </strong>

        <br><br>

        Une entreprise peut proposer
        un espace situé sur son siège,
        son terrain, son atelier,
        ses bureaux ou son entrepôt.

        <br><br>

        Il ne s’agit pas de choisir seul
        une œuvre ou un artiste.

        <br><br>

        Bo'CitéArt prépare d’abord
        une proposition artistique cohérente
        avec la ville, ses habitants,
        ses métiers, son patrimoine
        et les caractéristiques du lieu.
      </div>

      <div class="box" style="line-height:1.5;">

        <strong>
          Exemples de projets possibles
        </strong>

        <br><br>

        • œuvre murale peinte ;<br>
        • sculpture ;<br>
        • œuvre en bronze ;<br>
        • installation artistique ;<br>
        • exposition photographique ;<br>
        • tableau ou série de tableaux ;<br>
        • création numérique ;<br>
        • mobilier artistique ;<br>
        • présentation d’un véhicule ancien
          ou exceptionnel ;<br>
        • œuvre consacrée à l’histoire
          ou aux métiers de la ville.

        <br><br>

        Cette liste n’est pas limitative.

        <br><br>

        Le projet doit cependant conserver
        un lien réel avec le territoire
        et présenter un intérêt artistique,
        culturel ou citoyen.
      </div>

      <div class="box" style="line-height:1.5;">

        <strong>
          Le rôle de Bo'CitéArt
        </strong>

        <br><br>

        Bo'CitéArt organise automatiquement
        les premières étapes :

        <br><br>

        1. enregistrement confidentiel
        de l’intérêt de l’entreprise ;<br><br>

        2. analyse de l’espace proposé ;<br><br>

        3. préparation d’un thème
        ou d’une orientation artistique ;<br><br>

        4. présentation du thème à la mairie ;<br><br>

        5. adaptation éventuelle
        après échange avec la commune ;<br><br>

        6. recherche d’artistes
        en priorité dans la ville,
        puis autour et dans la région ;<br><br>

        7. préparation du projet,
        du budget et du contrat.

        <br><br>

        L’entreprise reste libre
        de poursuivre ou non
        tant qu’aucun contrat n’est signé.
      </div>

      <div
        class="box"
        style="
          border-left:6px solid #b00020;
          line-height:1.5;
        ">

        <strong>
          Cette demande reste confidentielle
        </strong>

        <br><br>

        Le lieu proposé,
        les dimensions,
        les photographies,
        le budget envisagé,
        les notes et les échanges
        restent dans l’espace professionnel privé.

        <br><br>

        Rien n’est rendu public
        avant validation du projet
        et accord de l’entreprise.
      </div>

      <label style="display:block;font-weight:900;">
        Nom de l’entreprise
      </label>

      <input
        id="companyMecenatProjectCompany"
        class="miniField"
        type="text"
        placeholder="Nom de l’entreprise">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Commune du site proposé
      </label>

      <input
        id="companyMecenatProjectCity"
        class="miniField"
        type="text"
        placeholder="Exemple : Wattignies">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Type de lieu
      </label>

      <select
        id="companyMecenatProjectPlaceType"
        class="miniField">

        <option value="">
          Choisir
        </option>

        <option value="siege">
          Siège de l’entreprise
        </option>

        <option value="entrepot">
          Entrepôt
        </option>

        <option value="atelier">
          Atelier
        </option>

        <option value="bureaux">
          Bureaux
        </option>

        <option value="terrain">
          Terrain ou espace extérieur
        </option>

        <option value="mur">
          Mur ou pignon
        </option>

        <option value="hall">
          Hall d’accueil
        </option>

        <option value="autre">
          Autre espace
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Décrivez l’espace proposé
      </label>

      <textarea
        id="companyMecenatProjectPlaceDescription"
        class="miniField"
        style="min-height:110px;"
        placeholder="Dimensions approximatives, visibilité, accès, état du support, contraintes éventuelles.">
      </textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Type de projet souhaité
      </label>

      <select
        id="companyMecenatProjectArtType"
        class="miniField">

        <option value="">
          Je souhaite être conseillé
        </option>

        <option value="oeuvre_murale">
          Œuvre murale peinte
        </option>

        <option value="sculpture">
          Sculpture
        </option>

        <option value="bronze">
          Œuvre en bronze
        </option>

        <option value="photographie">
          Photographie
        </option>

        <option value="tableaux">
          Tableaux d’artistes locaux
        </option>

        <option value="installation">
          Installation artistique
        </option>

        <option value="numerique">
          Création numérique
        </option>

        <option value="vehicule">
          Véhicule ancien ou exceptionnel
        </option>

        <option value="autre">
          Autre projet artistique
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Avez-vous une idée de thème ?
      </label>

      <textarea
        id="companyMecenatProjectTheme"
        class="miniField"
        style="min-height:100px;"
        placeholder="Exemple : histoire de l’entreprise, métiers de la ville, industrie locale, patrimoine, habitants, jeunesse.">
      </textarea>

      <div class="box" style="margin-top:12px;">

        <strong>
          Important
        </strong>

        <br><br>

        L’idée exprimée par l’entreprise
        constitue un point de départ.

        <br><br>

        Le thème définitif sera travaillé
        avec Bo'CitéArt,
        puis présenté à la mairie.

        <br><br>

        La commune pourra le valider,
        demander une adaptation
        ou proposer une évolution
        avant sa validation définitive.
      </div>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Budget indicatif envisagé
      </label>

      <select
        id="companyMecenatProjectBudget"
        class="miniField">

        <option value="">
          Je ne sais pas encore
        </option>

        <option value="moins_2500">
          Moins de 2 500 € HT
        </option>

        <option value="2500_5000">
          De 2 500 à 5 000 € HT
        </option>

        <option value="5000_10000">
          De 5 000 à 10 000 € HT
        </option>

        <option value="10000_25000">
          De 10 000 à 25 000 € HT
        </option>

        <option value="plus_25000">
          Plus de 25 000 € HT
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Échéance souhaitée
      </label>

      <input
        id="companyMecenatProjectDeadline"
        class="miniField"
        type="date">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Notes confidentielles
      </label>

      <textarea
        id="companyMecenatProjectNotes"
        class="miniField"
        style="min-height:100px;"
        placeholder="Indiquez ici vos questions, conditions ou contraintes.">
      </textarea>

      <div class="box" style="margin-top:12px;">

        <label class="miniCheck">
          <input
            id="companyMecenatProjectInterestCheck"
            type="checkbox">

          <span>
            Je confirme être intéressé
            par l’étude confidentielle
            d’un projet sur le site de mon entreprise.
          </span>
        </label>

        <label class="miniCheck">
          <input
            id="companyMecenatProjectNoCommitmentCheck"
            type="checkbox">

          <span>
            Je comprends que cette demande
            ne constitue pas encore
            un engagement financier ou contractuel.
          </span>
        </label>
      </div>

      <button
        id="companyMecenatProjectPreviewBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Prévisualiser ma proposition
      </button>

      <button
        id="companyMecenatProjectSaveBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Enregistrer confidentiellement
      </button>

      <div
        id="companyMecenatProjectStatus"
        class="muted"
        style="margin-top:10px;">
      </div>

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Mes projets proposés
      </div>

      <div
        id="companyMecenatProjectList"
        style="margin-top:10px;">
      </div>
    `;
  }

  function readCompanyProjectForm(){
    return {
      company:
        String(
          getElement("companyMecenatProjectCompany")
            ? getElement("companyMecenatProjectCompany").value
            : ""
        ).trim(),

      city:
        String(
          getElement("companyMecenatProjectCity")
            ? getElement("companyMecenatProjectCity").value
            : ""
        ).trim(),

      placeType:
        String(
          getElement("companyMecenatProjectPlaceType")
            ? getElement("companyMecenatProjectPlaceType").value
            : ""
        ).trim(),

      placeDescription:
        String(
          getElement("companyMecenatProjectPlaceDescription")
            ? getElement("companyMecenatProjectPlaceDescription").value
            : ""
        ).trim(),

      artType:
        String(
          getElement("companyMecenatProjectArtType")
            ? getElement("companyMecenatProjectArtType").value
            : ""
        ).trim(),

      theme:
        String(
          getElement("companyMecenatProjectTheme")
            ? getElement("companyMecenatProjectTheme").value
            : ""
        ).trim(),

      budget:
        String(
          getElement("companyMecenatProjectBudget")
            ? getElement("companyMecenatProjectBudget").value
            : ""
        ).trim(),

      deadline:
        String(
          getElement("companyMecenatProjectDeadline")
            ? getElement("companyMecenatProjectDeadline").value
            : ""
        ).trim(),

      notes:
        String(
          getElement("companyMecenatProjectNotes")
            ? getElement("companyMecenatProjectNotes").value
            : ""
        ).trim(),

      interestAccepted:
        !!(
          getElement("companyMecenatProjectInterestCheck") &&
          getElement("companyMecenatProjectInterestCheck").checked
        ),

      noCommitmentAccepted:
        !!(
          getElement("companyMecenatProjectNoCommitmentCheck") &&
          getElement("companyMecenatProjectNoCommitmentCheck").checked
        )
    };
  }

  function validateCompanyProject(data, requireChecks){
    if(!data.company){
      alert(
        "Indiquez le nom de l’entreprise."
      );
      return false;
    }

    if(!data.city){
      alert(
        "Indiquez la commune du site proposé."
      );
      return false;
    }

    if(!data.placeType){
      alert(
        "Choisissez le type de lieu."
      );
      return false;
    }

    if(!data.placeDescription){
      alert(
        "Décrivez l’espace proposé."
      );
      return false;
    }

    if(
      requireChecks &&
      !data.interestAccepted
    ){
      alert(
        "Confirmez votre intérêt pour l’étude du projet."
      );
      return false;
    }

    if(
      requireChecks &&
      !data.noCommitmentAccepted
    ){
      alert(
        "Confirmez que vous avez compris " +
        "que cette demande ne constitue pas encore un engagement."
      );
      return false;
    }

    return true;
  }

  function getPlaceTypeLabel(value){
    const labels = {
      siege:"Siège de l’entreprise",
      entrepot:"Entrepôt",
      atelier:"Atelier",
      bureaux:"Bureaux",
      terrain:"Terrain ou espace extérieur",
      mur:"Mur ou pignon",
      hall:"Hall d’accueil",
      autre:"Autre espace"
    };

    return labels[value] || value;
  }

  function getArtTypeLabel(value){
    const labels = {
      oeuvre_murale:"Œuvre murale peinte",
      sculpture:"Sculpture",
      bronze:"Œuvre en bronze",
      photographie:"Photographie",
      tableaux:"Tableaux d’artistes locaux",
      installation:"Installation artistique",
      numerique:"Création numérique",
      vehicule:"Véhicule ancien ou exceptionnel",
      autre:"Autre projet artistique"
    };

    return labels[value] ||
      "Projet à définir avec Bo'CitéArt";
  }

  function getBudgetLabel(value){
    const labels = {
      moins_2500:"Moins de 2 500 € HT",
      "2500_5000":"De 2 500 à 5 000 € HT",
      "5000_10000":"De 5 000 à 10 000 € HT",
      "10000_25000":"De 10 000 à 25 000 € HT",
      plus_25000:"Plus de 25 000 € HT"
    };

    return labels[value] ||
      "Budget non défini";
  }

  function previewCompanyProject(){
    const data =
      readCompanyProjectForm();

    if(!validateCompanyProject(data, false)){
      return;
    }

    module.renderModal(
      "Prévisualisation privée du projet",
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            ${escapeValue(data.company)}
          </strong>

          <br><br>

          Projet proposé à :

          <strong>
            ${escapeValue(data.city)}
          </strong>
        </div>

        <div class="box">
          <strong>Lieu proposé</strong><br><br>

          ${escapeValue(
            getPlaceTypeLabel(
              data.placeType
            )
          )}

          <br><br>

          ${escapeValue(
            data.placeDescription
          )}
        </div>

        <div class="box">
          <strong>Orientation artistique</strong><br><br>

          ${escapeValue(
            getArtTypeLabel(
              data.artType
            )
          )}

          <br><br>

          Thème proposé :

          <br><br>

          ${escapeValue(
            data.theme ||
            "À définir avec Bo'CitéArt"
          )}
        </div>

        <div class="box">
          <strong>Budget indicatif</strong><br><br>

          ${escapeValue(
            getBudgetLabel(
              data.budget
            )
          )}
        </div>

        <div class="box">
          <strong>Échéance souhaitée</strong><br><br>

          ${escapeValue(
            data.deadline ||
            "Non renseignée"
          )}
        </div>

        <div class="box">
          <strong>Notes confidentielles</strong><br><br>

          ${escapeValue(
            data.notes ||
            "Aucune note"
          )}
        </div>

        <div
          class="box"
          style="border-left:6px solid #b00020;">

          Cette prévisualisation reste privée.

          <br><br>

          Le projet n’est pas transmis
          à la mairie et n’est pas publié
          tant que vous ne l’avez pas enregistré.
        </div>
      `
    );
  }

  function saveCompanyProject(){
    const data =
      readCompanyProjectForm();

    if(!validateCompanyProject(data, true)){
      return;
    }

    const projects =
      loadCompanyProjects();

    const project = {
      id:
        "MEC-ENT-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2,7),

      company:data.company,
      city:data.city,
      placeType:data.placeType,
      placeDescription:data.placeDescription,
      artType:data.artType,
      theme:data.theme,
      budget:data.budget,
      deadline:data.deadline,
      notes:data.notes,

      private:true,

      status:
        "demande_confidentielle_enregistree",

      municipalStatus:
        "non_transmis",

      artisticStatus:
        "a_etudier",

      contractStatus:
        "aucun_engagement",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date().toLocaleString("fr-FR"),

      updatedAt:
        Date.now(),

      updatedAtFr:
        new Date().toLocaleString("fr-FR")
    };

    projects.unshift(project);

    saveCompanyProjects(projects);

    const status =
      getElement("companyMecenatProjectStatus");

    if(status){
      status.innerHTML = `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong>
            Votre proposition privée est enregistrée
          </strong>

          <br><br>

          Référence :

          <strong>
            ${escapeValue(project.id)}
          </strong>

          <br><br>

          Statut :

          <strong>
            À étudier par le processus Bo'CitéArt
          </strong>

          <br><br>

          Aucun engagement financier
          ou contractuel n’est encore créé.
        </div>
      `;
    }

    renderCompanyProjects();

    alert(
      "Votre proposition a été enregistrée confidentiellement.\n\n" +
      "Elle devra ensuite être étudiée, structurée " +
      "et présentée à la mairie avant toute validation."
    );
  }

  function deleteCompanyProject(projectId){
    const projects =
      loadCompanyProjects();

    const project =
      projects.find(function(item){
        return item.id === projectId;
      });

    if(!project){
      alert(
        "Projet introuvable."
      );
      return;
    }

    if(
      project.contractStatus ===
      "contrat_signe"
    ){
      alert(
        "Ce projet ne peut plus être supprimé " +
        "car un contrat est déjà signé."
      );
      return;
    }

    const confirmation =
      confirm(
        "Supprimer cette proposition privée ?\n\n" +
        "Cette suppression est définitive."
      );

    if(!confirmation){
      return;
    }

    const updated =
      projects.filter(function(item){
        return item.id !== projectId;
      });

    saveCompanyProjects(updated);

    renderCompanyProjects();
  }

  function renderCompanyProjects(){
    const host =
      getElement("companyMecenatProjectList");

    if(!host){
      return;
    }

    const projects =
      loadCompanyProjects();

    if(!projects.length){
      host.innerHTML = `
        <div class="box">
          Aucun projet proposé par votre entreprise.
        </div>
      `;

      return;
    }

    host.innerHTML =
      projects.map(function(project){

        return `
          <div
            class="box"
            style="
              margin-top:8px;
              border-left:6px solid #2f5d46;
            ">

            <strong style="font-size:17px;">
              ${escapeValue(
                getArtTypeLabel(
                  project.artType
                )
              )}
            </strong>

            <br><br>

            Commune :

            <strong>
              ${escapeValue(project.city)}
            </strong>

            <br><br>

            Lieu :

            <strong>
              ${escapeValue(
                getPlaceTypeLabel(
                  project.placeType
                )
              )}
            </strong>

            <br><br>

            Thème :

            ${escapeValue(
              project.theme ||
              "À définir avec Bo'CitéArt"
            )}

            <br><br>

            Budget :

            <strong>
              ${escapeValue(
                getBudgetLabel(
                  project.budget
                )
              )}
            </strong>

            <br><br>

            Statut :

            <strong>
              Proposition privée enregistrée
            </strong>

            <br><br>

            Mairie :

            <strong>
              Non transmise
            </strong>

            <br><br>

            Contrat :

            <strong>
              Aucun engagement
            </strong>

            <button
              class="choiceBtn companyMecenatDeleteBtn"
              type="button"
              data-company-mecenat-project-id="${escapeValue(project.id)}"
              style="
                width:100%;
                margin-top:10px;
                background:#fff;
              ">
              Supprimer cette proposition
            </button>
          </div>
        `;
      }).join("");

    host
      .querySelectorAll(
        ".companyMecenatDeleteBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          deleteCompanyProject(
            button.getAttribute(
              "data-company-mecenat-project-id"
            )
          );
        };
      });
  }

  function bindCompanyProjectForm(){
    const previewButton =
      getElement(
        "companyMecenatProjectPreviewBtn"
      );

    const saveButton =
      getElement(
        "companyMecenatProjectSaveBtn"
      );

    if(previewButton){
      previewButton.onclick =
        previewCompanyProject;
    }

    if(saveButton){
      saveButton.onclick =
        saveCompanyProject;
    }

    renderCompanyProjects();
  }

  function openCompanyProjectProposal(){
    module.renderModal(
      "Proposer un projet sur le site de l’entreprise",
      getCompanyProjectHtml()
    );

    window.setTimeout(function(){
      bindCompanyProjectForm();
    },0);
  }

  module.openMecenatCompanyProjectProposal =
    openCompanyProjectProposal;

  module.loadMecenatCompanyProjects =
    loadCompanyProjects;

  module.saveMecenatCompanyProjects =
    saveCompanyProjects;

  document.addEventListener(
    "click",
    function(event){

      const button =
        event.target &&
        typeof event.target.closest === "function"
          ? event.target.closest(
              "#mecenatPublicInterestedBtn"
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

      openCompanyProjectProposal();
    },
    true
  );

  console.log(
    "✅ Mécénat — partie 3 projets entreprise chargée"
  );

})();

/* =========================================================
   BO'CITÉART — MÉCÉNAT
   PARTIE 4 — ESPACE PRIVÉ ET SUIVI AUTOMATISÉ
   ========================================================= */

(function addBociteMecenatPrivateDashboard(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const INTERESTS_KEY =
    "bociteart_mecenat_company_interests_v2";

  const COMPANY_PROJECTS_KEY =
    "bociteart_mecenat_company_projects_v1";

  const PRIVATE_DECISIONS_KEY =
    "bociteart_mecenat_private_decisions_v1";

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
        "Enregistrement mécénat impossible :",
        error
      );
    }
  }

  function loadInterests(){
    return loadArray(INTERESTS_KEY);
  }

  function loadCompanyProjects(){
    return loadArray(COMPANY_PROJECTS_KEY);
  }

  function loadDecisions(){
    return loadArray(PRIVATE_DECISIONS_KEY);
  }

  function saveDecisions(list){
    saveArray(
      PRIVATE_DECISIONS_KEY,
      list
    );
  }

  function getInterestStatusLabel(status){
    const labels = {
      interet_prive_enregistre:
        "Intérêt privé enregistré",

      etude_privee:
        "Projet en étude privée",

      informations_a_completer:
        "Informations à compléter",

      pret_pour_validation:
        "Prêt pour validation",

      accord_de_principe:
        "Accord de principe enregistré",

      contrat_a_preparer:
        "Contrat à préparer",

      contrat_signe:
        "Contrat signé",

      abandonne:
        "Projet abandonné"
    };

    return labels[status] || status;
  }

  function getCompanyProjectStatusLabel(status){
    const labels = {
      demande_confidentielle_enregistree:
        "Demande confidentielle enregistrée",

      analyse_automatique:
        "Analyse automatique en cours",

      informations_a_completer:
        "Informations à compléter",

      theme_a_preparer:
        "Thème à préparer",

      mairie_a_consulter:
        "Projet à présenter à la mairie",

      adaptation_demandee:
        "Adaptation demandée",

      valide_par_mairie:
        "Validé par la mairie",

      contrat_a_preparer:
        "Contrat à préparer",

      contrat_signe:
        "Contrat signé",

      abandonne:
        "Projet abandonné"
    };

    return labels[status] || status;
  }

  function getPrivateDashboardHtml(){
    const interests =
      loadInterests();

    const companyProjects =
      loadCompanyProjects();

    const decisions =
      loadDecisions();

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Mon espace mécénat privé
        </strong>

        <br><br>

        Cet espace est réservé
        au compte professionnel de l’entreprise.

        <br><br>

        Les projets étudiés,
        les montants envisagés,
        les notes,
        les décisions
        et les documents préparatoires
        restent confidentiels.

        <br><br>

        Ils ne sont pas visibles
        par les habitants,
        les autres entreprises
        ou le public.
      </div>

      <div class="box">

        <strong>
          Fonctionnement automatisé
        </strong>

        <br><br>

        L’application suit automatiquement
        les différentes étapes :

        <br><br>

        1. intérêt enregistré ;<br>
        2. informations à compléter ;<br>
        3. étude privée ;<br>
        4. thème ou projet préparé ;<br>
        5. validation municipale si nécessaire ;<br>
        6. accord de principe de l’entreprise ;<br>
        7. préparation du contrat ;<br>
        8. signature ;<br>
        9. suivi du projet.

        <br><br>

        Bo'CitéArt n’intervient directement
        que lorsqu’une validation artistique,
        municipale ou contractuelle est nécessaire.
      </div>

      <div
        style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px;
          margin-top:12px;
        ">

        <div class="box">
          <strong style="font-size:21px;">
            ${interests.length}
          </strong>

          <br>

          Projet(s) étudié(s)
        </div>

        <div class="box">
          <strong style="font-size:21px;">
            ${companyProjects.length}
          </strong>

          <br>

          Projet(s) proposé(s)
        </div>

        <div class="box">
          <strong style="font-size:21px;">
            ${
              decisions.filter(function(item){
                return item.status === "accord_de_principe";
              }).length
            }
          </strong>

          <br>

          Accord(s) de principe
        </div>

        <div class="box">
          <strong style="font-size:21px;">
            ${
              decisions.filter(function(item){
                return item.contractSigned === true;
              }).length
            }
          </strong>

          <br>

          Contrat(s) signé(s)
        </div>
      </div>

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Projets proposés par la mairie ou Bo'CitéArt
      </div>

      <div
        id="privateMecenatInterestList"
        style="margin-top:10px;">

        ${
          interests.length
            ? interests.map(function(item){

                const decision =
                  decisions.find(function(entry){
                    return entry.sourceId === item.projectId;
                  });

                return `
                  <div
                    class="box"
                    style="border-left:6px solid #2f5d46;">

                    <strong style="font-size:17px;">
                      ${escapeValue(item.projectTitle)}
                    </strong>

                    <br><br>

                    Statut :

                    <strong>
                      ${escapeValue(
                        getInterestStatusLabel(
                          decision
                            ? decision.status
                            : item.status
                        )
                      )}
                    </strong>

                    <br><br>

                    Enregistré le :

                    ${escapeValue(
                      item.createdAtFr || ""
                    )}

                    <button
                      class="choiceBtn privateMecenatStudyBtn"
                      type="button"
                      data-private-project-id="${escapeValue(item.projectId)}"
                      data-private-project-title="${escapeValue(item.projectTitle)}"
                      style="width:100%;margin-top:10px;">
                      Étudier ce projet
                    </button>
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucun projet public
                n’est actuellement étudié.
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
        Projets proposés sur le site de l’entreprise
      </div>

      <div
        id="privateMecenatCompanyProjectList"
        style="margin-top:10px;">

        ${
          companyProjects.length
            ? companyProjects.map(function(project){

                return `
                  <div
                    class="box"
                    style="border-left:6px solid #2f5d46;">

                    <strong style="font-size:17px;">
                      ${escapeValue(
                        project.theme ||
                        "Projet artistique à définir"
                      )}
                    </strong>

                    <br><br>

                    Commune :

                    <strong>
                      ${escapeValue(project.city)}
                    </strong>

                    <br><br>

                    Statut :

                    <strong>
                      ${escapeValue(
                        getCompanyProjectStatusLabel(
                          project.status
                        )
                      )}
                    </strong>

                    <br><br>

                    Mairie :

                    <strong>
                      ${escapeValue(
                        project.municipalStatus === "non_transmis"
                          ? "Non transmis"
                          : project.municipalStatus
                      )}
                    </strong>

                    <br><br>

                    Contrat :

                    <strong>
                      ${escapeValue(
                        project.contractStatus === "aucun_engagement"
                          ? "Aucun engagement"
                          : project.contractStatus
                      )}
                    </strong>

                    <button
                      class="choiceBtn privateMecenatCompanyOpenBtn"
                      type="button"
                      data-company-project-id="${escapeValue(project.id)}"
                      style="width:100%;margin-top:10px;">
                      Consulter le suivi privé
                    </button>
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucun projet proposé
                sur le site de l’entreprise.
              </div>
            `
        }
      </div>

      <button
        id="privateMecenatOpenProjectsBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:14px;">
        Découvrir les projets ouverts
      </button>

      <button
        id="privateMecenatNewCompanyProjectBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:8px;">
        Proposer un projet sur mon site
      </button>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
        ">

        <strong>
          Aucun engagement automatique
        </strong>

        <br><br>

        L’enregistrement d’un intérêt,
        d’un budget indicatif
        ou d’une proposition
        ne vaut pas signature.

        <br><br>

        L’entreprise reste libre
        tant qu’elle n’a pas validé
        son accord de principe,
        puis signé le contrat définitif.
      </div>
    `;
  }

  function getPrivateStudyHtml(
    projectId,
    projectTitle
  ){
    const decisions =
      loadDecisions();

    const saved =
      decisions.find(function(item){
        return item.sourceId === projectId;
      }) || {};

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          ${escapeValue(projectTitle)}
        </strong>

        <br><br>

        Étude strictement confidentielle.
      </div>

      <label style="display:block;font-weight:900;">
        Montant envisagé
      </label>

      <input
        id="privateMecenatAmount"
        class="miniField"
        type="number"
        min="0"
        step="1"
        value="${escapeValue(saved.amount || "")}"
        placeholder="Montant en euros">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Forme de contribution
      </label>

      <select
        id="privateMecenatContributionType"
        class="miniField">

        <option value="">
          Choisir
        </option>

        <option value="financier">
          Contribution financière
        </option>

        <option value="competences">
          Mécénat de compétences
        </option>

        <option value="materiel">
          Matériel ou produits
        </option>

        <option value="mixte">
          Contribution mixte
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Questions ou conditions
      </label>

      <textarea
        id="privateMecenatConditions"
        class="miniField"
        style="min-height:110px;"
        placeholder="Indiquez ici vos questions, contraintes ou conditions.">${escapeValue(saved.conditions || "")}</textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Notes internes
      </label>

      <textarea
        id="privateMecenatNotes"
        class="miniField"
        style="min-height:100px;"
        placeholder="Ces notes restent privées.">${escapeValue(saved.notes || "")}</textarea>

      <div class="box" style="margin-top:12px;">

        <label class="miniCheck">
          <input
            id="privateMecenatAccountantCheck"
            type="checkbox"
            ${saved.accountantChecked ? "checked" : ""}>

          <span>
            Je consulterai mon expert-comptable
            avant tout engagement définitif.
          </span>
        </label>

        <label class="miniCheck">
          <input
            id="privateMecenatPrincipleCheck"
            type="checkbox"
            ${saved.principleAccepted ? "checked" : ""}>

          <span>
            Je souhaite enregistrer
            un accord de principe,
            sans signature définitive à ce stade.
          </span>
        </label>
      </div>

      <button
        id="privateMecenatSaveStudyBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Enregistrer mon étude privée
      </button>

      <button
        id="privateMecenatAbandonBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Abandonner l’étude de ce projet
      </button>

      <div
        id="privateMecenatStudyStatus"
        class="muted"
        style="margin-top:10px;">
      </div>
    `;
  }

  function restoreContributionType(projectId){
    const decisions =
      loadDecisions();

    const saved =
      decisions.find(function(item){
        return item.sourceId === projectId;
      });

    const select =
      getElement(
        "privateMecenatContributionType"
      );

    if(
      select &&
      saved &&
      saved.contributionType
    ){
      select.value =
        saved.contributionType;
    }
  }

  function savePrivateStudy(
    projectId,
    projectTitle
  ){
    const amount =
      String(
        getElement("privateMecenatAmount")
          ? getElement("privateMecenatAmount").value
          : ""
      ).trim();

    const contributionType =
      String(
        getElement("privateMecenatContributionType")
          ? getElement("privateMecenatContributionType").value
          : ""
      ).trim();

    const conditions =
      String(
        getElement("privateMecenatConditions")
          ? getElement("privateMecenatConditions").value
          : ""
      ).trim();

    const notes =
      String(
        getElement("privateMecenatNotes")
          ? getElement("privateMecenatNotes").value
          : ""
      ).trim();

    const accountantChecked =
      !!(
        getElement("privateMecenatAccountantCheck") &&
        getElement("privateMecenatAccountantCheck").checked
      );

    const principleAccepted =
      !!(
        getElement("privateMecenatPrincipleCheck") &&
        getElement("privateMecenatPrincipleCheck").checked
      );

    if(!contributionType){
      alert(
        "Choisissez une forme de contribution."
      );
      return;
    }

    if(
      contributionType === "financier" &&
      !amount
    ){
      alert(
        "Indiquez le montant envisagé."
      );
      return;
    }

    const decisions =
      loadDecisions();

    const existingIndex =
      decisions.findIndex(function(item){
        return item.sourceId === projectId;
      });

    const decision = {
      id:
        existingIndex >= 0
          ? decisions[existingIndex].id
          : "MEC-DEC-" + Date.now(),

      sourceId:projectId,
      sourceTitle:projectTitle,
      sourceType:"projet_ouvert",

      amount:amount,
      contributionType:contributionType,
      conditions:conditions,
      notes:notes,
      accountantChecked:accountantChecked,
      principleAccepted:principleAccepted,

      status:
        principleAccepted
          ? "accord_de_principe"
          : "etude_privee",

      private:true,
      contractSigned:false,

      updatedAt:Date.now(),
      updatedAtFr:
        new Date().toLocaleString("fr-FR")
    };

    if(existingIndex >= 0){
      decisions[existingIndex] =
        decision;
    }else{
      decisions.unshift(
        decision
      );
    }

    saveDecisions(decisions);

    const status =
      getElement(
        "privateMecenatStudyStatus"
      );

    if(status){
      status.innerHTML = `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong>
            Étude privée enregistrée
          </strong>

          <br><br>

          Statut :

          <strong>
            ${
              principleAccepted
                ? "Accord de principe"
                : "Projet en étude privée"
            }
          </strong>

          <br><br>

          Aucun contrat n’est signé à ce stade.
        </div>
      `;
    }

    alert(
      "Votre étude privée est enregistrée."
    );
  }

  function abandonPrivateStudy(projectId){
    const confirmation =
      confirm(
        "Abandonner l’étude de ce projet ?\n\n" +
        "Votre décision restera enregistrée dans votre espace privé."
      );

    if(!confirmation){
      return;
    }

    const decisions =
      loadDecisions();

    const existing =
      decisions.find(function(item){
        return item.sourceId === projectId;
      });

    if(existing){
      existing.status =
        "abandonne";

      existing.principleAccepted =
        false;

      existing.contractSigned =
        false;

      existing.updatedAt =
        Date.now();

      existing.updatedAtFr =
        new Date().toLocaleString("fr-FR");
    }else{
      decisions.unshift({
        id:"MEC-DEC-" + Date.now(),
        sourceId:projectId,
        sourceTitle:"",
        sourceType:"projet_ouvert",
        status:"abandonne",
        principleAccepted:false,
        contractSigned:false,
        private:true,
        updatedAt:Date.now(),
        updatedAtFr:
          new Date().toLocaleString("fr-FR")
      });
    }

    saveDecisions(decisions);

    alert(
      "L’étude de ce projet est abandonnée."
    );

    openPrivateDashboard();
  }

  function openPrivateStudy(
    projectId,
    projectTitle
  ){
    module.renderModal(
      "Étude privée du projet",
      getPrivateStudyHtml(
        projectId,
        projectTitle
      )
    );

    window.setTimeout(function(){

      restoreContributionType(
        projectId
      );

      const saveButton =
        getElement(
          "privateMecenatSaveStudyBtn"
        );

      const abandonButton =
        getElement(
          "privateMecenatAbandonBtn"
        );

      if(saveButton){
        saveButton.onclick = function(){
          savePrivateStudy(
            projectId,
            projectTitle
          );
        };
      }

      if(abandonButton){
        abandonButton.onclick = function(){
          abandonPrivateStudy(
            projectId
          );
        };
      }
    },0);
  }

  function bindPrivateDashboard(){

    document
      .querySelectorAll(
        ".privateMecenatStudyBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          openPrivateStudy(
            button.getAttribute(
              "data-private-project-id"
            ),
            button.getAttribute(
              "data-private-project-title"
            )
          );
        };
      });

    document
      .querySelectorAll(
        ".privateMecenatCompanyOpenBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          const projectId =
            button.getAttribute(
              "data-company-project-id"
            );

          const projects =
            loadCompanyProjects();

          const project =
            projects.find(function(item){
              return item.id === projectId;
            });

          if(!project){
            alert(
              "Projet introuvable."
            );
            return;
          }

          module.renderModal(
            "Suivi privé du projet",
            `
              <div
                class="box"
                style="border-left:6px solid #2f5d46;">

                <strong style="font-size:18px;">
                  ${
                    escapeValue(
                      project.theme ||
                      "Projet artistique à définir"
                    )
                  }
                </strong>
              </div>

              <div class="box">
                <strong>Entreprise</strong><br><br>
                ${escapeValue(project.company)}
              </div>

              <div class="box">
                <strong>Commune</strong><br><br>
                ${escapeValue(project.city)}
              </div>

              <div class="box">
                <strong>Espace proposé</strong><br><br>
                ${escapeValue(project.placeDescription)}
              </div>

              <div class="box">
                <strong>Statut actuel</strong><br><br>

                ${
                  escapeValue(
                    getCompanyProjectStatusLabel(
                      project.status
                    )
                  )
                }
              </div>

              <div class="box">
                <strong>Validation municipale</strong><br><br>

                ${
                  project.municipalStatus === "non_transmis"
                    ? "Le projet n’a pas encore été transmis à la mairie."
                    : escapeValue(project.municipalStatus)
                }
              </div>

              <div
                class="box"
                style="border-left:6px solid #b00020;">

                Aucun engagement contractuel
                n’existe tant que le contrat définitif
                n’est pas signé.
              </div>
            `
          );
        };
      });

    const projectsButton =
      getElement(
        "privateMecenatOpenProjectsBtn"
      );

    const newProjectButton =
      getElement(
        "privateMecenatNewCompanyProjectBtn"
      );

    if(projectsButton){
      projectsButton.onclick = function(){

        if(
          typeof module.openMecenatProjectsCatalogue ===
          "function"
        ){
          module.openMecenatProjectsCatalogue();
        }
      };
    }

    if(newProjectButton){
      newProjectButton.onclick = function(){

        if(
          typeof module.openMecenatCompanyProjectProposal ===
          "function"
        ){
          module.openMecenatCompanyProjectProposal();
        }
      };
    }
  }

  function openPrivateDashboard(){
    module.renderModal(
      "Mon espace mécénat privé",
      getPrivateDashboardHtml()
    );

    window.setTimeout(function(){
      bindPrivateDashboard();
    },0);
  }

  module.openMecenatPrivateSpace =
    openPrivateDashboard;

  module.openMecenatPrivateDashboard =
    openPrivateDashboard;

  module.loadMecenatPrivateDecisions =
    loadDecisions;

  console.log(
    "✅ Mécénat — partie 4 espace privé automatisé chargé"
  );

})();

/* =========================================================
   BO'CITÉART — MÉCÉNAT
   PARTIE 5 — VALIDATION MAIRIE ET SUIVI AUTOMATIQUE
   ========================================================= */

(function addBociteMecenatMunicipalWorkflow(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const COMPANY_PROJECTS_KEY =
    "bociteart_mecenat_company_projects_v1";

  const MUNICIPAL_WORKFLOW_KEY =
    "bociteart_mecenat_municipal_workflow_v1";

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
        "Enregistrement du suivi mécénat impossible :",
        error
      );
    }
  }

  function loadCompanyProjects(){
    return loadArray(
      COMPANY_PROJECTS_KEY
    );
  }

  function saveCompanyProjects(projects){
    saveArray(
      COMPANY_PROJECTS_KEY,
      projects
    );
  }

  function loadWorkflow(){
    return loadArray(
      MUNICIPAL_WORKFLOW_KEY
    );
  }

  function saveWorkflow(workflow){
    saveArray(
      MUNICIPAL_WORKFLOW_KEY,
      workflow
    );
  }

  function getMunicipalStatusLabel(status){
    const labels = {
      non_transmis:
        "Non transmis à la mairie",

      a_transmettre:
        "Prêt à être présenté à la mairie",

      transmis:
        "Transmis à la mairie",

      en_etude:
        "En cours d’étude par la mairie",

      adaptation_demandee:
        "Adaptation demandée par la mairie",

      adaptation_preparee:
        "Nouvelle proposition préparée",

      valide:
        "Validé par la mairie",

      refuse:
        "Refusé par la mairie"
    };

    return labels[status] || status;
  }

  function getProjectStatusLabel(status){
    const labels = {
      demande_confidentielle_enregistree:
        "Demande confidentielle enregistrée",

      analyse_automatique:
        "Analyse automatique en cours",

      informations_a_completer:
        "Informations à compléter",

      theme_a_preparer:
        "Thème à préparer",

      mairie_a_consulter:
        "Projet prêt à être présenté à la mairie",

      adaptation_demandee:
        "Adaptation demandée",

      valide_par_mairie:
        "Validé par la mairie",

      contrat_a_preparer:
        "Contrat à préparer",

      contrat_signe:
        "Contrat signé",

      abandonne:
        "Projet abandonné"
    };

    return labels[status] || status;
  }

  function analyseProjectAutomatically(project){
    const missing = [];

    if(!project.company){
      missing.push(
        "nom de l’entreprise"
      );
    }

    if(!project.city){
      missing.push(
        "commune"
      );
    }

    if(!project.placeType){
      missing.push(
        "type de lieu"
      );
    }

    if(!project.placeDescription){
      missing.push(
        "description de l’espace"
      );
    }

    if(missing.length){
      project.status =
        "informations_a_completer";

      project.automaticAnalysis = {
        complete:false,
        missing:missing,
        message:
          "Certaines informations doivent être complétées."
      };

      return project;
    }

    project.status =
      "theme_a_preparer";

    project.automaticAnalysis = {
      complete:true,
      missing:[],
      message:
        "Les informations principales sont complètes. Le thème artistique peut être préparé."
    };

    return project;
  }

  function prepareAutomaticTheme(project){
    const place =
      project.placeType || "site";

    const city =
      project.city || "la commune";

    const companyTheme =
      String(
        project.theme || ""
      ).trim();

    const preparedTheme =
      companyTheme
        ? companyTheme
        : (
            "Création artistique liée à la vie de " +
            city +
            ", à ses habitants, ses métiers, " +
            "son patrimoine et son évolution."
          );

    project.preparedTheme =
      preparedTheme;

    project.preparedOrientation =
      "Le projet devra être adapté au " +
      place +
      " proposé par l’entreprise, " +
      "tout en conservant un lien réel " +
      "avec le territoire.";

    project.status =
      "mairie_a_consulter";

    project.municipalStatus =
      "a_transmettre";

    project.themePreparedAt =
      Date.now();

    project.themePreparedAtFr =
      new Date().toLocaleString("fr-FR");

    return project;
  }

  function runAutomaticPreparation(){
    const projects =
      loadCompanyProjects();

    let changed = false;

    projects.forEach(function(project){

      if(
        project.status ===
        "demande_confidentielle_enregistree"
      ){
        project.status =
          "analyse_automatique";

        analyseProjectAutomatically(
          project
        );

        changed = true;
      }

      if(
        project.status ===
        "theme_a_preparer"
      ){
        prepareAutomaticTheme(
          project
        );

        changed = true;
      }
    });

    if(changed){
      saveCompanyProjects(
        projects
      );
    }

    return projects;
  }

  function ensureWorkflowEntry(project){
    const workflow =
      loadWorkflow();

    let entry =
      workflow.find(function(item){
        return item.projectId === project.id;
      });

    if(!entry){
      entry = {
        id:
          "MEC-MAIRIE-" +
          Date.now() +
          "-" +
          Math.random()
            .toString(36)
            .slice(2,7),

        projectId:
          project.id,

        company:
          project.company,

        city:
          project.city,

        projectTitle:
          project.preparedTheme ||
          project.theme ||
          "Projet artistique à définir",

        municipalStatus:
          project.municipalStatus ||
          "a_transmettre",

        municipalityComment:"",
        adaptationRequest:"",
        adaptedTheme:"",
        refusalReason:"",

        createdAt:
          Date.now(),

        createdAtFr:
          new Date().toLocaleString("fr-FR"),

        updatedAt:
          Date.now(),

        updatedAtFr:
          new Date().toLocaleString("fr-FR")
      };

      workflow.unshift(entry);

      saveWorkflow(workflow);
    }

    return entry;
  }

  function transmitToMunicipality(projectId){
    const projects =
      loadCompanyProjects();

    const project =
      projects.find(function(item){
        return item.id === projectId;
      });

    if(!project){
      alert(
        "Projet introuvable."
      );
      return;
    }

    if(
      project.status !==
      "mairie_a_consulter"
    ){
      alert(
        "Ce projet n’est pas encore prêt à être présenté à la mairie."
      );
      return;
    }

    project.municipalStatus =
      "transmis";

    project.transmittedAt =
      Date.now();

    project.transmittedAtFr =
      new Date().toLocaleString("fr-FR");

    project.updatedAt =
      Date.now();

    project.updatedAtFr =
      new Date().toLocaleString("fr-FR");

    saveCompanyProjects(
      projects
    );

    const entry =
      ensureWorkflowEntry(
        project
      );

    const workflow =
      loadWorkflow();

    const workflowEntry =
      workflow.find(function(item){
        return item.id === entry.id;
      });

    if(workflowEntry){
      workflowEntry.municipalStatus =
        "transmis";

      workflowEntry.updatedAt =
        Date.now();

      workflowEntry.updatedAtFr =
        new Date().toLocaleString("fr-FR");

      saveWorkflow(
        workflow
      );
    }

    alert(
      "Le projet est maintenant indiqué comme transmis à la mairie.\n\n" +
      "Dans la version définitive, la transmission sera envoyée automatiquement dans l’espace sécurisé de la commune."
    );

    openMunicipalWorkflow();
  }

  function getWorkflowHtml(){
    const projects =
      runAutomaticPreparation();

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Suivi automatisé des projets artistiques
        </strong>

        <br><br>

        Cet écran permet de suivre les projets
        proposés par les entreprises
        sans devoir traiter manuellement
        chaque première demande.

        <br><br>

        L’application réalise automatiquement :

        <br><br>

        • le contrôle des informations principales ;<br>
        • l’identification des éléments manquants ;<br>
        • la préparation d’une première orientation artistique ;<br>
        • la création du dossier de présentation ;<br>
        • le suivi de la validation municipale ;<br>
        • l’information de l’entreprise sur l’avancement.
      </div>

      <div
        class="box"
        style="border-left:6px solid #b00020;">

        <strong>
          Les décisions artistiques et contractuelles
          ne sont pas automatiques
        </strong>

        <br><br>

        Bo'CitéArt reste responsable
        de la cohérence artistique du thème.

        <br><br>

        La mairie reste responsable
        de sa validation municipale.

        <br><br>

        L’entreprise reste responsable
        de son engagement et de la signature du contrat.
      </div>

      <div
        id="mecenatAutomaticWorkflowList"
        style="margin-top:12px;">

        ${
          projects.length
            ? projects.map(function(project){

                const missing =
                  project.automaticAnalysis &&
                  Array.isArray(
                    project.automaticAnalysis.missing
                  )
                    ? project.automaticAnalysis.missing
                    : [];

                return `
                  <div
                    class="box"
                    style="
                      margin-top:10px;
                      border-left:6px solid #2f5d46;
                    ">

                    <strong style="font-size:17px;">
                      ${escapeValue(
                        project.company ||
                        "Entreprise"
                      )}
                    </strong>

                    <br><br>

                    Commune :

                    <strong>
                      ${escapeValue(
                        project.city || ""
                      )}
                    </strong>

                    <br><br>

                    Statut du projet :

                    <strong>
                      ${escapeValue(
                        getProjectStatusLabel(
                          project.status
                        )
                      )}
                    </strong>

                    <br><br>

                    État mairie :

                    <strong>
                      ${escapeValue(
                        getMunicipalStatusLabel(
                          project.municipalStatus ||
                          "non_transmis"
                        )
                      )}
                    </strong>

                    ${
                      missing.length
                        ? `
                          <br><br>

                          <strong>
                            Informations manquantes
                          </strong>

                          <br><br>

                          ${missing
                            .map(function(item){
                              return (
                                "• " +
                                escapeValue(item)
                              );
                            })
                            .join("<br>")}
                        `
                        : ""
                    }

                    ${
                      project.preparedTheme
                        ? `
                          <br><br>

                          <strong>
                            Thème préparé
                          </strong>

                          <br><br>

                          ${escapeValue(
                            project.preparedTheme
                          )}

                          <br><br>

                          ${escapeValue(
                            project.preparedOrientation ||
                            ""
                          )}
                        `
                        : ""
                    }

                    ${
                      project.status ===
                      "mairie_a_consulter"
                        ? `
                          <button
                            class="choiceBtn mecenatTransmitMunicipalityBtn"
                            type="button"
                            data-mecenat-workflow-project-id="${escapeValue(
                              project.id
                            )}"
                            style="
                              width:100%;
                              margin-top:12px;
                            ">
                            Présenter le projet à la mairie
                          </button>
                        `
                        : ""
                    }

                    ${
                      project.municipalStatus ===
                      "transmis"
                        ? `
                          <button
                            class="choiceBtn mecenatOpenMunicipalDecisionBtn"
                            type="button"
                            data-mecenat-workflow-project-id="${escapeValue(
                              project.id
                            )}"
                            style="
                              width:100%;
                              margin-top:8px;
                              background:#fff;
                            ">
                            Ouvrir l’espace de décision mairie
                          </button>
                        `
                        : ""
                    }
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucun projet d’entreprise enregistré.
              </div>
            `
        }
      </div>
    `;
  }

  function getMunicipalDecisionHtml(project){
    const entry =
      ensureWorkflowEntry(
        project
      );

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Décision de la mairie
        </strong>

        <br><br>

        Projet proposé par :

        <strong>
          ${escapeValue(project.company)}
        </strong>

        <br><br>

        Commune :

        <strong>
          ${escapeValue(project.city)}
        </strong>
      </div>

      <div class="box">
        <strong>
          Thème préparé par Bo'CitéArt
        </strong>

        <br><br>

        ${escapeValue(
          project.preparedTheme ||
          project.theme ||
          "Thème à définir"
        )}

        <br><br>

        ${escapeValue(
          project.preparedOrientation ||
          ""
        )}
      </div>

      <label style="display:block;font-weight:900;">
        Décision municipale
      </label>

      <select
        id="mecenatMunicipalDecision"
        class="miniField">

        <option value="en_etude">
          Mettre le projet en étude
        </option>

        <option value="valide">
          Valider le projet
        </option>

        <option value="adaptation_demandee">
          Demander une adaptation
        </option>

        <option value="refuse">
          Refuser le projet
        </option>
      </select>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Commentaire de la mairie
      </label>

      <textarea
        id="mecenatMunicipalComment"
        class="miniField"
        style="min-height:100px;"
        placeholder="Indiquez la motivation, les observations ou les conditions.">${escapeValue(
          entry.municipalityComment || ""
        )}</textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Adaptation demandée
      </label>

      <textarea
        id="mecenatMunicipalAdaptation"
        class="miniField"
        style="min-height:100px;"
        placeholder="À remplir uniquement si une adaptation est demandée.">${escapeValue(
          entry.adaptationRequest || ""
        )}</textarea>

      <button
        id="mecenatMunicipalSaveDecisionBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Enregistrer la décision municipale
      </button>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
        ">

        La validation municipale
        ne constitue pas encore
        un contrat de mécénat.

        <br><br>

        Après validation,
        le budget,
        les artistes,
        les autorisations techniques
        et le contrat devront encore être finalisés.
      </div>
    `;
  }

  function saveMunicipalDecision(projectId){
    const decisionInput =
      getElement(
        "mecenatMunicipalDecision"
      );

    const commentInput =
      getElement(
        "mecenatMunicipalComment"
      );

    const adaptationInput =
      getElement(
        "mecenatMunicipalAdaptation"
      );

    const decision =
      decisionInput
        ? String(decisionInput.value || "")
        : "";

    const comment =
      commentInput
        ? String(commentInput.value || "").trim()
        : "";

    const adaptation =
      adaptationInput
        ? String(adaptationInput.value || "").trim()
        : "";

    if(
      decision === "adaptation_demandee" &&
      !adaptation
    ){
      alert(
        "Précisez l’adaptation demandée par la mairie."
      );
      return;
    }

    if(
      decision === "refuse" &&
      !comment
    ){
      alert(
        "Indiquez le motif du refus."
      );
      return;
    }

    const projects =
      loadCompanyProjects();

    const project =
      projects.find(function(item){
        return item.id === projectId;
      });

    if(!project){
      alert(
        "Projet introuvable."
      );
      return;
    }

    project.municipalStatus =
      decision;

    if(decision === "valide"){
      project.status =
        "valide_par_mairie";
    }

    if(
      decision ===
      "adaptation_demandee"
    ){
      project.status =
        "adaptation_demandee";
    }

    if(decision === "en_etude"){
      project.status =
        "mairie_a_consulter";
    }

    if(decision === "refuse"){
      project.status =
        "abandonne";
    }

    project.municipalityComment =
      comment;

    project.adaptationRequest =
      adaptation;

    project.updatedAt =
      Date.now();

    project.updatedAtFr =
      new Date().toLocaleString("fr-FR");

    saveCompanyProjects(
      projects
    );

    const workflow =
      loadWorkflow();

    const entry =
      workflow.find(function(item){
        return item.projectId === projectId;
      });

    if(entry){
      entry.municipalStatus =
        decision;

      entry.municipalityComment =
        comment;

      entry.adaptationRequest =
        adaptation;

      entry.updatedAt =
        Date.now();

      entry.updatedAtFr =
        new Date().toLocaleString("fr-FR");

      saveWorkflow(
        workflow
      );
    }

    alert(
      "La décision municipale est enregistrée."
    );

    openMunicipalWorkflow();
  }

  function openMunicipalDecision(projectId){
    const project =
      loadCompanyProjects()
        .find(function(item){
          return item.id === projectId;
        });

    if(!project){
      alert(
        "Projet introuvable."
      );
      return;
    }

    module.renderModal(
      "Validation municipale",
      getMunicipalDecisionHtml(
        project
      )
    );

    window.setTimeout(function(){

      const button =
        getElement(
          "mecenatMunicipalSaveDecisionBtn"
        );

      if(button){
        button.onclick = function(){
          saveMunicipalDecision(
            projectId
          );
        };
      }
    },0);
  }

  function bindMunicipalWorkflow(){
    document
      .querySelectorAll(
        ".mecenatTransmitMunicipalityBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          transmitToMunicipality(
            button.getAttribute(
              "data-mecenat-workflow-project-id"
            )
          );
        };
      });

    document
      .querySelectorAll(
        ".mecenatOpenMunicipalDecisionBtn"
      )
      .forEach(function(button){

        button.onclick = function(){
          openMunicipalDecision(
            button.getAttribute(
              "data-mecenat-workflow-project-id"
            )
          );
        };
      });
  }

  function openMunicipalWorkflow(){
    module.renderModal(
      "Suivi des projets mécénat",
      getWorkflowHtml()
    );

    window.setTimeout(function(){
      bindMunicipalWorkflow();
    },0);
  }

  module.openMecenatMunicipalWorkflow =
    openMunicipalWorkflow;

  module.runMecenatAutomaticPreparation =
    runAutomaticPreparation;

  module.loadMecenatMunicipalWorkflow =
    loadWorkflow;

  window.setTimeout(function(){
    runAutomaticPreparation();
  },1000);

  console.log(
    "✅ Mécénat — partie 5 validation mairie chargée"
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
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.5;
        ">

        <strong style="font-size:19px;">
          Espace réservé aux entreprises partenaires
        </strong>

        <br><br>

        Les tarifs, abonnements, paiements,
        factures, contrats, recherches privées
        et données professionnelles
        sont accessibles uniquement
        depuis l’espace sécurisé de l’entreprise.

        <br><br>

        Chaque entreprise partenaire reçoit
        un code d’accès personnel
        après la validation de son partenariat
        avec Bo'CitéArt.
      </div>

      <div class="box">

        <strong>
          Compte de démonstration
        </strong>

        <br><br>

        Entreprise :

        <strong>
          ${escapeValue(account.companyName)}
        </strong>

        <br><br>

        Code personnel de démonstration :

        <br><br>

        <strong
          style="
            display:inline-block;
            padding:8px 12px;
            border:2px solid #2f5d46;
            border-radius:8px;
            font-size:18px;
          ">
          ${escapeValue(account.partnerCode)}
        </strong>

        <br><br>

        Dans la version définitive,
        ce code sera communiqué automatiquement
        après l’enregistrement de la fiche entreprise
        et la validation du partenariat.
      </div>

      <label
        style="
          display:block;
          font-weight:900;
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
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #b00020;
        ">

        <strong>
          Important
        </strong>

        <br><br>

        Le code utilisé dans cette démonstration
        sert uniquement à représenter
        le futur fonctionnement.

        <br><br>

        Dans la version définitive,
        l’identification et les données privées
        devront être sécurisées par le serveur,
        et non uniquement dans le navigateur.
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
      <strong style="font-size:17px;">
        Besoins professionnels détectés
      </strong>

      <br><br>

      Consultez les recherches récurrentes,
      les compteurs d’intérêt
      et les alertes nécessitant
      un suivi par Bo'CitéArt.

      <br><br>

      Cet accès est réservé
      au pilotage privé Bo'CitéArt.

      <button
        id="directionProfessionalDemandDashboardBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:12px;
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
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Faites vivre votre fiche entreprise
        </strong>

        <br><br>

        Présentez une nouveauté, un savoir-faire,
        une porte ouverte, un nouveau service
        ou une réalisation récente.

        <br><br>

        Les habitants doivent d’abord savoir
        que votre entreprise existe et comprendre
        ce qu’elle peut leur apporter.
      </div>

      <div class="box">
        <strong>Ajouter une actualité</strong>
      </div>

      <label
        style="
          display:block;
          font-weight:900;
        ">
        Titre
      </label>

      <input
        id="visibilityNewsTitle"
        class="miniField"
        type="text"
        placeholder="Exemple : nouveau service proposé">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Type d’actualité
      </label>

      <select
        id="visibilityNewsType"
        class="miniField">

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
          font-weight:900;
        ">
        Présentation
      </label>

      <textarea
        id="visibilityNewsDescription"
        class="miniField"
        style="min-height:120px;"
        placeholder="Expliquez clairement ce que les habitants doivent retenir.">
      </textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Date de début
      </label>

      <input
        id="visibilityNewsStartDate"
        class="miniField"
        type="date">

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Date de fin
      </label>

      <input
        id="visibilityNewsEndDate"
        class="miniField"
        type="date">

      <button
        id="visibilityNewsSaveBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
        ">
        Enregistrer cette actualité
      </button>

      <div
        style="
          margin-top:18px;
          font-size:17px;
          font-weight:900;
        ">
        Mes actualités
      </div>

      <div
        id="visibilityNewsList"
        style="margin-top:10px;">
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
   BO'CITÉART — ENTREPRISE
   MÉCÉNAT — IMPACT LOCAL ET ABONNEMENT
   ========================================================= */

(function improveEntrepriseMecenat(){

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

  function getModalContent(){
    return document.querySelector(
      ".modal-content, .modalContent, #modalContent"
    );
  }

  function addMecenatIntroduction(){

    const modal = getModalContent();

    if(
      !modal ||
      getElement("mecenatLocalIntroduction")
    ){
      return;
    }

    const block = document.createElement("div");

    block.id = "mecenatLocalIntroduction";
    block.className = "box";
    block.style.borderLeft = "6px solid #2f5d46";
    block.style.marginBottom = "12px";

    block.innerHTML = `
      <strong style="font-size:18px;">
        Votre entreprise peut agir directement
        pour sa ville
      </strong>

      <br><br>

      Le mécénat permet de soutenir des projets
      concrets au bénéfice des habitants :

      <br><br>

      • écoles ;<br>
      • culture ;<br>
      • sport ;<br>
      • associations ;<br>
      • patrimoine ;<br>
      • actions citoyennes ;<br>
      • amélioration du cadre de vie.

      <br><br>

      Votre engagement devient visible
      par les réalisations qu’il rend possibles,
      sans transformer le mécénat
      en publicité commerciale classique.
    `;

    modal.insertBefore(
      block,
      modal.firstChild
    );
  }

  function addMecenatFiscalExplanation(){

    const modal = getModalContent();

    if(
      !modal ||
      getElement("mecenatFiscalExplanation")
    ){
      return;
    }

    const block = document.createElement("div");

    block.id = "mecenatFiscalExplanation";
    block.className = "box";

    block.innerHTML = `
      <strong style="font-size:18px;">
        Donner une utilité locale
        à une partie de votre effort financier
      </strong>

      <br><br>

      Une entreprise qui réalise un bénéfice
      peut choisir de soutenir un projet éligible
      au mécénat, dans le respect
      des règles fiscales applicables.

      <br><br>

      Le mécénat ne remplace pas automatiquement
      l’impôt sur les sociétés.

      <br><br>

      Il permet cependant, sous conditions,
      de bénéficier du régime fiscal prévu par la loi
      tout en dirigeant une partie de son engagement
      vers une action concrète utile au territoire.

      <br><br>

      L’entreprise sait alors à quoi
      son soutien contribue réellement.
    `;

    modal.appendChild(block);
  }

  function addMecenatNotorietyBlock(){

    const modal = getModalContent();

    if(
      !modal ||
      getElement("mecenatNotorietyBlock")
    ){
      return;
    }

    const block = document.createElement("div");

    block.id = "mecenatNotorietyBlock";
    block.className = "box";

    block.innerHTML = `
      <strong style="font-size:18px;">
        Une autre manière de faire connaître
        votre entreprise
      </strong>

      <br><br>

      Une publicité indique ce que vous vendez.

      <br><br>

      Le mécénat montre ce que votre entreprise
      apporte à son territoire.

      <br><br>

      Les habitants peuvent découvrir
      qu’une entreprise locale a contribué
      à une action utile, à une école,
      à un club, à une association
      ou à un projet de la ville.

      <br><br>

      Cette reconnaissance se construit
      avec discrétion, confiance et durée.

      <br><br>

      Elle peut renforcer naturellement :

      <br><br>

      • votre notoriété locale ;<br>
      • votre image ;<br>
      • votre ancrage territorial ;<br>
      • la confiance des habitants ;<br>
      • la fierté de vos salariés.
    `;

    modal.appendChild(block);
  }

  function addMecenatConcreteExample(){

    const modal = getModalContent();

    if(
      !modal ||
      getElement("mecenatConcreteExample")
    ){
      return;
    }

    const block = document.createElement("div");

    block.id = "mecenatConcreteExample";
    block.className = "box";

    block.innerHTML = `
      <strong style="font-size:18px;">
        Imaginez concrètement
      </strong>

      <br><br>

      Votre entreprise participe
      au financement d’un projet local.

      <br><br>

      Quelques mois plus tard,
      les habitants voient :

      <br><br>

      • une action réalisée dans une école ;<br>
      • un équipement sportif soutenu ;<br>
      • une œuvre culturelle créée ;<br>
      • une association accompagnée ;<br>
      • un projet citoyen devenu possible.

      <br><br>

      Votre entreprise n’est plus seulement
      un nom ou une activité.

      <br><br>

      Elle devient un acteur identifié
      de la vie locale.
    `;

    modal.appendChild(block);
  }

  function addMecenatSubscriptionBlock(){

    const modal = getModalContent();

    if(
      !modal ||
      getElement("mecenatSubscriptionBlock")
    ){
      return;
    }

    const subscribed =
      typeof module.hasEntrepriseSubscription ===
        "function"
        ? module.hasEntrepriseSubscription()
        : false;

    const block = document.createElement("div");

    block.id = "mecenatSubscriptionBlock";
    block.className = "box";
    block.style.borderLeft = "6px solid #b00020";

    block.innerHTML = subscribed
      ? `
        <strong style="font-size:18px;">
          Accès professionnel actif
        </strong>

        <br><br>

        Votre abonnement vous permet :

        <br><br>

        • de découvrir les projets proposés ;<br>
        • de suivre leur avancement ;<br>
        • d’indiquer les projets qui vous intéressent ;<br>
        • de valoriser votre engagement local ;<br>
        • de conserver l’historique de vos actions ;<br>
        • d’accéder aux informations professionnelles.
      `
      : `
        <strong style="font-size:18px;">
          Accès réservé aux entreprises abonnées
        </strong>

        <br><br>

        Vous pouvez découvrir gratuitement
        le principe du mécénat
        et les bénéfices possibles pour la ville.

        <br><br>

        L’abonnement professionnel permet ensuite
        d’accéder aux projets,
        de suivre leur réalisation
        et de valoriser l’engagement
        de votre entreprise.

        <br><br>

        <button
          id="mecenatSubscriptionOpenBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Découvrir les avantages de l’abonnement
        </button>
      `;

    modal.appendChild(block);

    const button =
      getElement("mecenatSubscriptionOpenBtn");

    if(button){
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
    }
  }

  function applyMecenatImprovements(){

    window.setTimeout(function(){

      addMecenatIntroduction();
      addMecenatFiscalExplanation();
      addMecenatNotorietyBlock();
      addMecenatConcreteExample();
      addMecenatSubscriptionBlock();

    },80);
  }

  const originalMecenat =
    module.screens.mecenat;

  if(
    typeof originalMecenat ===
    "function"
  ){
    module.registerScreen(
      "mecenat",
      function(){

        originalMecenat();

        applyMecenatImprovements();
      }
    );
  }

  console.log(
    "✅ Mécénat local et abonnement chargés"
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

/* ===========================
Bouton retour automatique
=========================== */

const observer =
new MutationObserver(function(){

const modal =
document.querySelector(
".modal-content,.modalContent,#modalContent"
);

if(!modal){
return;
}

if(
modal.querySelector(
"#globalEntrepriseBackButton"
)
){
return;
}

const button =
document.createElement("button");

button.id =
"globalEntrepriseBackButton";

button.className =
"choiceBtn";

button.style.width =
"100%";

button.style.marginBottom =
"10px";

button.textContent =
"← Retour à l'espace Entreprise";

button.onclick=function(){

if(
window.BociteEntreprise &&
typeof window.BociteEntreprise.openHome==="function"
){
window.BociteEntreprise.openHome();
}

};

modal.prepend(button);

});

observer.observe(
document.body,
{
childList:true,
subtree:true
});

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
   BO'CITÉART — EMPLOI
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

        <strong style="font-size:18px;">
          Les offres d’emploi de votre territoire
        </strong>

        <br><br>

        Consultez dans une seule page
        toutes les offres actuellement disponibles.

        <br><br>

        Ouvrez ensuite uniquement l’annonce
        qui correspond à votre recherche.
      </div>

      <button
        id="employmentPublicListBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;">
        Consulter toutes les offres
      </button>

      <div
        class="box"
        style="margin-top:14px;">

        <strong>
          Vous êtes une entreprise ou un commerce ?
        </strong>

        <br><br>

        La publication d’une offre,
        sa modification,
        sa clôture,
        les candidatures reçues
        et les conditions tarifaires
        sont accessibles uniquement
        depuis votre espace professionnel privé.
      </div>

      <button
        id="employmentPrivatePublishBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;">
        Accéder à la publication professionnelle
      </button>

      <button
        id="employmentPrivateApplicationsBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Consulter mes candidatures
      </button>
    `;
  }

  function bindEmploymentPublicHome(){

    const listButton =
      getElement("employmentPublicListBtn");

    const publishButton =
      getElement("employmentPrivatePublishBtn");

    const applicationsButton =
      getElement("employmentPrivateApplicationsBtn");

    if(listButton){
      listButton.onclick =
        openPublicEmploymentList;
    }

    if(publishButton){
      publishButton.onclick = function(){

        requirePrivateAccess(function(){

          if(
            typeof module.openEmploymentForm ===
            "function"
          ){
            module.openEmploymentForm();
          }
        });
      };
    }

    if(applicationsButton){
      applicationsButton.onclick = function(){

        requirePrivateAccess(function(){

          if(
            typeof module.openEmploymentApplications ===
            "function"
          ){
            module.openEmploymentApplications();
          }
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
        <div class="box">
          Aucune offre d’emploi
          n’est actuellement disponible.
        </div>
      `;
    }

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Toutes les offres disponibles
        </strong>

        <br><br>

        ${offers.length}
        offre(s) actuellement accessible(s).

        <br><br>

        Cliquez sur une annonce
        pour consulter son contenu complet.
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
              text-align:left;
              cursor:pointer;
            ">

            <strong style="font-size:17px;">
              ${escapeValue(offer.title)}
            </strong>

            <br><br>

            <span
              style="
                color:#2f5d46;
                font-weight:900;
              ">
              ${escapeValue(offer.companyName)}
            </span>

            <br><br>

            ${escapeValue(offer.city)}
            •
            ${escapeValue(offer.contract)}

            <br><br>

            <span
              style="
                color:#b00020;
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
      "Toutes les offres d’emploi",
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

    },0);
  }

  function openPublicEmploymentOffer(offerId){

    const data = loadEmploymentData();

    const offer =
      data.offers.find(function(item){
        return item.id === offerId;
      });

    if(!offer){
      alert("Cette offre est introuvable.");
      return;
    }

    module.renderModal(
      offer.title,
      `
        <div class="box">
          <strong>Entreprise</strong><br><br>
          ${escapeValue(offer.companyName)}
        </div>

        <div class="box">
          <strong>Type de contrat</strong><br><br>
          ${escapeValue(offer.contract)}

          <br><br>

          <strong>Commune du poste</strong><br><br>
          ${escapeValue(offer.city)}
        </div>

        <div class="box">
          <strong>Description de l’offre</strong><br><br>
          ${escapeValue(offer.description)}
        </div>

        <div class="box">
          <strong>Statut</strong><br><br>
          ${escapeValue(
            getStatusLabel(offer.status)
          )}
        </div>

        <button
          id="employmentPublicApplyBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Répondre à cette offre
        </button>
      `
    );

    window.setTimeout(function(){

      const applyButton =
        getElement("employmentPublicApplyBtn");

      if(applyButton){

        applyButton.onclick = function(){

          if(
            typeof module.openApplicationForm ===
            "function"
          ){
            module.openApplicationForm(offerId);
            return;
          }

          if(
            typeof module.openEmploymentOffers ===
            "function"
          ){
            module.openEmploymentOffers();
          }
        };
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
   PÉRENNITÉ ET MÉCÉNAT
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

      mecenat:{
        title:"Agir comme mécène local",
        text:
          "Le choix des projets, les montants, les documents, le suivi et la valorisation de l’engagement sont réservés à l’espace professionnel privé.",
        button:
          "Accéder à mon espace mécénat"
      }
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
      "perennitePrivateAccessBlock",
      "mecenatPrivateAccessBlock"
    ].forEach(function(id){

      const block = getElement(id);

      if(block){
        block.remove();
      }
    });
  }

  function openPrivateService(service){

    const original =
      service === "perennite"
        ? module.__originalPerenniteScreen
        : module.__originalMecenatScreen;

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

  const originalMecenat =
    module.screens.mecenat;

  module.__originalPerenniteScreen =
    originalPerennite;

  module.__originalMecenatScreen =
    originalMecenat;

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

  if(
    typeof originalMecenat ===
    "function"
  ){
    module.registerScreen(
      "mecenat",
      function(){

        originalMecenat();

        window.setTimeout(function(){

          replacePublicFormsByPrivateAccess(
            "mecenat"
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

  module.openMecenatPrivateSpace =
    function(){

      requirePrivateAccess(function(){
        openPrivateService("mecenat");
      });
    };

  console.log(
    "✅ Pérennité et mécénat séparés entre information publique et espace privé"
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

    const input =
      getElement(
        "localDirectorySearchInput"
      );

    if(!host){
      return;
    }

    const query =
      normalizeText(
        input ? input.value : ""
      );

    const companies =
      loadCompanies()
        .filter(function(company){

          const searchable =
            normalizeText(
              [
                company.name,
                company.activity,
                company.description,
                company.city
              ].join(" ")
            );

          return (
            !query ||
            searchable.includes(query)
          );
        })
        .sort(function(a,b){

          return String(
            a.name || ""
          ).localeCompare(
            String(b.name || ""),
            "fr",
            {
              sensitivity:"base"
            }
          );
        });

    if(count){
      count.textContent =
        companies.length +
        " entreprise(s) ou commerce(s) trouvé(s).";
    }

    if(!companies.length){

      host.innerHTML = `
        <div class="box">
          Aucun résultat ne correspond
          à votre recherche.
        </div>
      `;

      return;
    }

    host.innerHTML =
      companies.map(function(company){

        return `
          <div class="box">

            <strong style="font-size:17px;">
              ${escapeValue(
                company.name || ""
              )}
            </strong>

            <br><br>

            <strong style="color:#2f5d46;">
              ${escapeValue(
                company.activity || ""
              )}
            </strong>

            <br><br>

            ${escapeValue(
              company.description || ""
            )}

            ${
              company.city
                ? `
                  <br><br>

                  Commune :
                  <strong>
                    ${escapeValue(
                      company.city
                    )}
                  </strong>
                `
                : ""
            }

            <button
              class="choiceBtn localDirectoryCvBtn"
              type="button"
              data-company-id="${escapeValue(
                company.id
              )}"
              style="width:100%;margin-top:12px;">
              Envoyer une candidature spontanée
            </button>
          </div>
        `;
      }).join("");

    host
      .querySelectorAll(
        ".localDirectoryCvBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          openSpontaneousApplicationForm(
            button.getAttribute(
              "data-company-id"
            )
          );
        };
      });
  }

  function openSpontaneousApplicationForm(companyId){

    const company =
      loadCompanies()
        .find(function(item){

          return item.id === companyId;
        });

    if(!company){

      alert(
        "Cette entreprise est introuvable."
      );

      return;
    }

    app.renderModal(
      "Candidature spontanée",
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            ${escapeValue(
              company.name
            )}
          </strong>

          <br><br>

          ${escapeValue(
            company.activity || ""
          )}

          <br><br>

          Vous pouvez envoyer votre candidature
          même si cette entreprise
          n’a pas publié d’offre.
        </div>

        <label style="font-weight:900;">
          Nom et prénom
        </label>

        <input
          id="spontaneousCvName"
          class="miniField"
          type="text"
          placeholder="Nom et prénom">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Adresse e-mail
        </label>

        <input
          id="spontaneousCvEmail"
          class="miniField"
          type="email"
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
          id="spontaneousCvPhone"
          class="miniField"
          type="tel"
          placeholder="Téléphone">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Métier ou poste recherché
        </label>

        <input
          id="spontaneousCvJob"
          class="miniField"
          type="text"
          placeholder="Exemple : vendeur, comptable, technicien">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Message à l’entreprise
        </label>

        <textarea
          id="spontaneousCvMessage"
          class="miniField"
          style="min-height:110px;"
          placeholder="Présentez brièvement votre candidature.">
        </textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          CV
        </label>

        <input
          id="spontaneousCvFile"
          class="miniField"
          type="file"
          accept=".pdf,.doc,.docx">

        <div
          class="box"
          style="margin-top:12px;">

          Votre candidature sera transmise
          uniquement à cette entreprise.

          <br><br>

          Elle ne sera pas visible publiquement
          ni accessible aux autres entreprises.
        </div>

        <label class="miniCheck">

          <input
            id="spontaneousCvConsent"
            type="checkbox">

          <span>
            J’accepte que cette entreprise
            conserve ma candidature
            dans son historique privé
            afin de pouvoir me recontacter
            ultérieurement.
          </span>
        </label>

        <button
          id="spontaneousCvSendBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Envoyer ma candidature
        </button>
      `
    );

    window.setTimeout(function(){

      const sendButton =
        getElement(
          "spontaneousCvSendBtn"
        );

      if(sendButton){

        sendButton.onclick = function(){

          saveSpontaneousApplication(
            company
          );
        };
      }

    },0);
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

  app.openSpontaneousApplicationForm =
    openSpontaneousApplicationForm;

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
      modal ? modal.textContent : ""
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
      document.createElement("style");

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
              Fidélisation • Salariés • Services de proximité •
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

    const oldButtons =
      modal.querySelectorAll(
        "#entrepriseBackBtn," +
        "#entrepriseCorrectedBackBtn," +
        "#globalEntrepriseBackButton," +
        "[data-entreprise-back]"
      );

    oldButtons.forEach(
      function(button){

        if(
          button.id !==
          "entrepriseUniversalBackButton"
        ){
          button.remove();
        }
      }
    );

    let button =
      modal.querySelector(
        "#entrepriseUniversalBackButton"
      );

    if(!button){

      button =
        document.createElement(
          "button"
        );

      button.id =
        "entrepriseUniversalBackButton";

      button.className =
        "choiceBtn";

      button.type =
        "button";

      button.textContent =
        "Retour";

      modal.prepend(
        button
      );
    }

    button.onclick =
      function(event){

        if(event){
          event.preventDefault();
          event.stopPropagation();
        }

        if(
          typeof app.openHome ===
          "function"
        ){
          app.openHome();
        }
      };
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

            text.style.animation = "";

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

    addUniversalBackButton(
      modal,
      title
    );

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

  let correctionTimer = null;

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

    if(
      !profile.companyName ||
      !profile.accessCode
    ){

      app.renderModal(
        "Accès professionnel",
        `
          <div
            class="box"
            style="border-left:6px solid #b00020;">

            <strong style="font-size:18px;">
              La fiche entreprise doit être complétée
            </strong>

            <br><br>

            Avant d’ouvrir le Tableau de Direction,
            renseignez l’identité de l’entreprise.

            <br><br>

            Un code d’accès personnel
            sera créé lors de l’enregistrement.
          </div>

          <button
            id="privateAccessCreateProfileBtn"
            class="choiceBtn"
            type="button"
            style="width:100%;">
            Compléter la fiche entreprise
          </button>
        `
      );

      window.setTimeout(function(){

        const button =
          getElement(
            "privateAccessCreateProfileBtn"
          );

        if(button){
          button.onclick =
            openEntrepriseProfile;
        }

      },0);

      return;
    }

    app.renderModal(
      "Accès privé de l’entreprise",
      `
        <div
          class="box"
          style="border-left:6px solid #b00020;">

          <strong style="font-size:18px;">
            ${escapeValue(
              profile.companyName
            )}
          </strong>

          <br><br>

          Cet espace contient
          les informations privées de l’entreprise :

          <br><br>

          • candidatures reçues ;<br>
          • mutualisations suivies ;<br>
          • propositions et décisions ;<br>
          • abonnements ;<br>
          • tarifs ;<br>
          • factures.
        </div>

        <label style="font-weight:900;">
          Code d’accès de l’entreprise
        </label>

        <input
          id="entreprisePrivateCodeInput"
          class="miniField"
          type="password"
          inputmode="numeric"
          maxlength="6"
          placeholder="Code à six chiffres">

        <button
          id="entreprisePrivateLoginBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Ouvrir l’espace privé
        </button>

        <button
          id="entreprisePrivateProfileBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
            background:#fff;
          ">
          Consulter la fiche entreprise
        </button>
      `
    );

    window.setTimeout(function(){

      const codeInput =
        getElement(
          "entreprisePrivateCodeInput"
        );

      const loginButton =
        getElement(
          "entreprisePrivateLoginBtn"
        );

      const profileButton =
        getElement(
          "entreprisePrivateProfileBtn"
        );

      function verifyCode(){

        const entered =
          String(
            codeInput
              ? codeInput.value
              : ""
          ).trim();

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

            if(event.key === "Enter"){

              event.preventDefault();
              verifyCode();
            }
          }
        );
      }

      if(profileButton){
        profileButton.onclick =
          openEntrepriseProfile;
      }

    },0);
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
        <button
          id="correctedVisibilityBackBtn"
          class="choiceBtn"
          type="button"
          style="margin-bottom:14px;">
          Retour
        </button>

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

      const backButton =
        getElement(
          "correctedVisibilityBackBtn"
        );

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
        <button
          id="correctedVisibilityPreviewBackBtn"
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

      const backButton =
        getElement(
          "correctedVisibilityPreviewBackBtn"
        );

      const employmentButton =
        getElement(
          "correctedPreviewEmploymentBtn"
        );

      const mecenatButton =
        getElement(
          "correctedPreviewMecenatBtn"
        );

      if(backButton){
        backButton.onclick =
          openCorrectedVisibilityPage;
      }

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
   CORRECTIF 13
   PAGE MÉCÉNAT COMPLÈTE
   COMPRENDRE • CHOISIR • PRÉPARER SA PARTICIPATION
   ========================================================== */

(function correctEntrepriseMecenatPage(){

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

  function loadMecenatData(){

    if(
      typeof app.loadMecenatData ===
      "function"
    ){
      const data =
        app.loadMecenatData();

      if(
        data &&
        typeof data === "object"
      ){
        return data;
      }
    }

    return {
      companyName:"",
      projectType:"",
      contributionType:"",
      contributionAmount:"",
      skillsDescription:"",
      materialDescription:"",
      selectedProject:"",
      visibilityAccepted:false,
      accountantContacted:false,
      notes:"",
      updatedAtFr:""
    };
  }

  function saveMecenatData(data){

    if(
      typeof app.saveMecenatData ===
      "function"
    ){
      app.saveMecenatData(
        data
      );

      return;
    }

    try{
      localStorage.setItem(
        "bociteart_entreprise_mecenat_v1",
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement du mécénat impossible :",
        error
      );
    }
  }

  function openCorrectedMecenatPage(){

    const saved =
      loadMecenatData();

    app.renderModal(
      "Connaissez-vous le mécénat ?",
      `
        <button
          id="correctedMecenatBackBtn"
          class="choiceBtn"
          type="button"
          style="margin-bottom:14px;">
          Retour
        </button>

        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            Connaissez-vous réellement
            le mécénat
            et savez-vous à quoi il peut servir ?
          </strong>

          <br><br>

          Beaucoup d’entreprises
          connaissent peu le mécénat,
          n’y pensent jamais
          ou imaginent qu’il est réservé
          aux grandes entreprises.

          <br><br>

          Pourtant,
          une petite entreprise,
          un commerce,
          un artisan
          ou une structure plus importante
          peut soutenir un projet utile
          à son territoire.
        </div>

        <div class="box">

          <strong>
            Le mécénat ne consiste pas seulement
            à donner de l’argent
          </strong>

          <br><br>

          Une entreprise peut contribuer :

          <br><br>

          • financièrement ;<br>
          • avec ses compétences ;<br>
          • avec du matériel ;<br>
          • avec des produits ;<br>
          • avec du temps ;<br>
          • ou avec plusieurs formes d’aide.
        </div>

        <div class="box">

          <strong>
            À quoi peut servir le mécénat ?
          </strong>

          <br><br>

          Il peut soutenir :

          <br><br>

          • la culture ;<br>
          • l’éducation ;<br>
          • le sport ;<br>
          • le patrimoine ;<br>
          • la solidarité ;<br>
          • l’environnement ;<br>
          • une action locale d’intérêt général.
        </div>

        <div class="box">

          <strong>
            Le mécénat permet aussi
            de faire connaître l’entreprise autrement
          </strong>

          <br><br>

          Avant de pouvoir soutenir
          ou rejoindre votre entreprise,
          les habitants doivent déjà savoir
          qu’elle existe,
          comprendre ce qu’elle fait
          et connaître les métiers
          qui y sont exercés.

          <br><br>

          Lorsqu’une entreprise participe
          à un projet local,
          elle peut être remerciée
          dans le cadre autorisé.

          <br><br>

          Ce n’est pas une publicité classique,
          mais une reconnaissance
          de son engagement.
        </div>

        <div class="box">

          <strong>
            Le retour est souvent indirect
          </strong>

          <br><br>

          Il peut se construire avec le temps
          par :

          <br><br>

          • la confiance ;<br>
          • la réputation ;<br>
          • le bouche-à-oreille ;<br>
          • la fierté des salariés ;<br>
          • la connaissance des métiers ;<br>
          • de futurs recrutements ;<br>
          • de nouveaux liens locaux.
        </div>

        <div
          class="box"
          style="border-left:6px solid #b00020;">

          <strong>
            Un avantage fiscal peut exister
          </strong>

          <br><br>

          Le mécénat peut ouvrir droit,
          sous certaines conditions,
          à un avantage fiscal.

          <br><br>

          Les règles peuvent évoluer
          selon la nature du projet
          et la situation de l’entreprise.

          <br><br>

          L’entreprise doit vérifier
          les conditions applicables
          avec son expert-comptable
          ou son conseil.
        </div>

        <div
          style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
          ">

          <button
            id="correctedMecenatProjectsBtn"
            class="choiceBtn"
            type="button">
            Découvrir les projets locaux
          </button>

          <button
            id="correctedMecenatVisibilityBtn"
            class="choiceBtn"
            type="button">
            Faire connaître mon engagement
          </button>

          <button
            id="correctedMecenatDirectoryBtn"
            class="choiceBtn"
            type="button">
            Rechercher un expert local
          </button>
        </div>

        <div
          class="box"
          style="
            margin-top:16px;
            border-left:6px solid #2f5d46;
          ">

          <strong style="font-size:17px;">
            Préparer ma réflexion
          </strong>

          <br><br>

          Cet espace appartient
          à l’entreprise
          et reste privé.
        </div>

        <label style="font-weight:900;">
          Nom de l’entreprise
        </label>

        <input
          id="correctedMecenatCompanyName"
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
          Quel type de projet souhaitez-vous soutenir ?
        </label>

        <select
          id="correctedMecenatProjectType"
          class="miniField">

          <option value="">
            Choisir
          </option>

          <option value="culture">
            Culture
          </option>

          <option value="education">
            Éducation
          </option>

          <option value="sport">
            Sport
          </option>

          <option value="patrimoine">
            Patrimoine
          </option>

          <option value="solidarite">
            Solidarité
          </option>

          <option value="environnement">
            Environnement
          </option>

          <option value="autre">
            Autre projet d’intérêt général
          </option>
        </select>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Sous quelle forme souhaitez-vous contribuer ?
        </label>

        <select
          id="correctedMecenatContributionType"
          class="miniField">

          <option value="">
            Choisir
          </option>

          <option value="financier">
            Contribution financière
          </option>

          <option value="competences">
            Mécénat de compétences
          </option>

          <option value="materiel">
            Don de matériel ou de produits
          </option>

          <option value="mixte">
            Contribution mixte
          </option>
        </select>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Montant envisagé
        </label>

        <input
          id="correctedMecenatAmount"
          class="miniField"
          type="number"
          min="0"
          value="${escapeValue(
            saved.contributionAmount || ""
          )}"
          placeholder="Montant en euros">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Compétences que vous pourriez proposer
        </label>

        <textarea
          id="correctedMecenatSkills"
          class="miniField"
          style="min-height:90px;"
          placeholder="Exemple : communication, bâtiment, informatique, logistique.">${escapeValue(
            saved.skillsDescription || ""
          )}</textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Matériel ou produits disponibles
        </label>

        <textarea
          id="correctedMecenatMaterial"
          class="miniField"
          style="min-height:90px;"
          placeholder="Décrivez le matériel ou les produits proposés.">${escapeValue(
            saved.materialDescription || ""
          )}</textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Projet éventuellement retenu
        </label>

        <input
          id="correctedMecenatSelectedProject"
          class="miniField"
          type="text"
          value="${escapeValue(
            saved.selectedProject || ""
          )}"
          placeholder="Nom du projet">

        <div
          class="box"
          style="margin-top:12px;">

          <label class="miniCheck">

            <input
              id="correctedMecenatVisibility"
              type="checkbox"
              ${
                saved.visibilityAccepted
                  ? "checked"
                  : ""
              }>

            <span>
              J’accepte que l’entreprise
              soit remerciée
              dans le cadre autorisé du projet.
            </span>
          </label>

          <label class="miniCheck">

            <input
              id="correctedMecenatAccountant"
              type="checkbox"
              ${
                saved.accountantContacted
                  ? "checked"
                  : ""
              }>

            <span>
              J’ai demandé
              ou je demanderai conseil
              à mon expert-comptable.
            </span>
          </label>
        </div>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Questions ou conditions
        </label>

        <textarea
          id="correctedMecenatNotes"
          class="miniField"
          style="min-height:100px;"
          placeholder="Indiquez ici vos questions ou vos conditions.">${escapeValue(
            saved.notes || ""
          )}</textarea>

        <button
          id="correctedMecenatSaveBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Enregistrer ma réflexion
        </button>

        <button
          id="correctedMecenatSummaryBtn"
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
          id="correctedMecenatStatus"
          class="muted"
          style="margin-top:10px;">
        </div>
      `
    );

    window.setTimeout(function(){

      const backButton =
        getElement(
          "correctedMecenatBackBtn"
        );

      const projectsButton =
        getElement(
          "correctedMecenatProjectsBtn"
        );

      const visibilityButton =
        getElement(
          "correctedMecenatVisibilityBtn"
        );

      const directoryButton =
        getElement(
          "correctedMecenatDirectoryBtn"
        );

      const saveButton =
        getElement(
          "correctedMecenatSaveBtn"
        );

      const summaryButton =
        getElement(
          "correctedMecenatSummaryBtn"
        );

      if(backButton){
        backButton.onclick = function(){
          app.openHome();
        };
      }

      if(projectsButton){
        projectsButton.onclick = function(){

          if(
            typeof app.openMecenatProjects ===
            "function"
          ){
            app.openMecenatProjects();
          }else{
            openCorrectedMecenatProjects();
          }
        };
      }

      if(visibilityButton){
        visibilityButton.onclick = function(){
          app.openScreen(
            "visibilite"
          );
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

          app.openScreen(
            "annuaire"
          );
        };
      }

      if(saveButton){
        saveButton.onclick =
          saveCorrectedMecenat;
      }

      if(summaryButton){
        summaryButton.onclick =
          openCorrectedMecenatSummary;
      }

      restoreMecenatSelects();

      const status =
        getElement(
          "correctedMecenatStatus"
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

  function restoreMecenatSelects(){

    const saved =
      loadMecenatData();

    const projectType =
      getElement(
        "correctedMecenatProjectType"
      );

    const contributionType =
      getElement(
        "correctedMecenatContributionType"
      );

    if(
      projectType &&
      saved.projectType
    ){
      projectType.value =
        saved.projectType;
    }

    if(
      contributionType &&
      saved.contributionType
    ){
      contributionType.value =
        saved.contributionType;
    }
  }

  function saveCorrectedMecenat(){

    const companyName =
      String(
        getElement("correctedMecenatCompanyName")
          ? getElement("correctedMecenatCompanyName").value
          : ""
      ).trim();

    const projectType =
      String(
        getElement("correctedMecenatProjectType")
          ? getElement("correctedMecenatProjectType").value
          : ""
      ).trim();

    const contributionType =
      String(
        getElement("correctedMecenatContributionType")
          ? getElement("correctedMecenatContributionType").value
          : ""
      ).trim();

    const contributionAmount =
      String(
        getElement("correctedMecenatAmount")
          ? getElement("correctedMecenatAmount").value
          : ""
      ).trim();

    const skillsDescription =
      String(
        getElement("correctedMecenatSkills")
          ? getElement("correctedMecenatSkills").value
          : ""
      ).trim();

    const materialDescription =
      String(
        getElement("correctedMecenatMaterial")
          ? getElement("correctedMecenatMaterial").value
          : ""
      ).trim();

    const selectedProject =
      String(
        getElement("correctedMecenatSelectedProject")
          ? getElement("correctedMecenatSelectedProject").value
          : ""
      ).trim();

    const notes =
      String(
        getElement("correctedMecenatNotes")
          ? getElement("correctedMecenatNotes").value
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
        "Choisissez le type de projet."
      );
      return;
    }

    if(!contributionType){
      alert(
        "Choisissez la forme de contribution."
      );
      return;
    }

    if(
      contributionType === "financier" &&
      !contributionAmount
    ){
      alert(
        "Indiquez le montant envisagé."
      );
      return;
    }

    if(
      contributionType === "competences" &&
      !skillsDescription
    ){
      alert(
        "Décrivez les compétences proposées."
      );
      return;
    }

    if(
      contributionType === "materiel" &&
      !materialDescription
    ){
      alert(
        "Décrivez le matériel ou les produits proposés."
      );
      return;
    }

    const data = {
      companyName:companyName,
      projectType:projectType,
      contributionType:contributionType,
      contributionAmount:contributionAmount,
      skillsDescription:skillsDescription,
      materialDescription:materialDescription,
      selectedProject:selectedProject,

      visibilityAccepted:
        !!(
          getElement("correctedMecenatVisibility") &&
          getElement("correctedMecenatVisibility").checked
        ),

      accountantContacted:
        !!(
          getElement("correctedMecenatAccountant") &&
          getElement("correctedMecenatAccountant").checked
        ),

      notes:notes,

      status:
        "en_reflexion",

      updatedAt:
        Date.now(),

      updatedAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )
    };

    saveMecenatData(
      data
    );

    const status =
      getElement(
        "correctedMecenatStatus"
      );

    if(status){
      status.textContent =
        "Réflexion enregistrée le " +
        data.updatedAtFr +
        ".";
    }

    alert(
      "Votre réflexion sur le mécénat est enregistrée."
    );
  }

  function getProjectLabel(value){

    const labels = {
      culture:"Culture",
      education:"Éducation",
      sport:"Sport",
      patrimoine:"Patrimoine",
      solidarite:"Solidarité",
      environnement:"Environnement",
      autre:"Autre projet d’intérêt général"
    };

    return labels[value] ||
      "Non renseigné";
  }

  function getContributionLabel(value){

    const labels = {
      financier:"Contribution financière",
      competences:"Mécénat de compétences",
      materiel:"Don de matériel ou de produits",
      mixte:"Contribution mixte"
    };

    return labels[value] ||
      "Non renseigné";
  }

  function openCorrectedMecenatSummary(){

    const data =
      loadMecenatData();

    if(
      !data.companyName ||
      !data.projectType ||
      !data.contributionType
    ){
      alert(
        "Aucune réflexion complète n’est enregistrée."
      );
      return;
    }

    app.renderModal(
      "Mon projet de mécénat",
      `
        <button
          id="correctedMecenatSummaryBackBtn"
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
            Type de projet
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
            Forme de contribution
          </strong>

          <br><br>

          ${escapeValue(
            getContributionLabel(
              data.contributionType
            )
          )}
        </div>

        ${
          data.contributionAmount
            ? `
              <div class="box">
                <strong>
                  Montant envisagé
                </strong>

                <br><br>

                ${escapeValue(
                  data.contributionAmount
                )} €
              </div>
            `
            : ""
        }

        ${
          data.skillsDescription
            ? `
              <div class="box">
                <strong>
                  Compétences proposées
                </strong>

                <br><br>

                ${escapeValue(
                  data.skillsDescription
                )}
              </div>
            `
            : ""
        }

        ${
          data.materialDescription
            ? `
              <div class="box">
                <strong>
                  Matériel ou produits proposés
                </strong>

                <br><br>

                ${escapeValue(
                  data.materialDescription
                )}
              </div>
            `
            : ""
        }

        <div class="box">
          <strong>
            Projet retenu
          </strong>

          <br><br>

          ${escapeValue(
            data.selectedProject ||
            "Non renseigné"
          )}
        </div>

        <div class="box">
          <strong>
            Remerciement autorisé
          </strong>

          <br><br>

          ${
            data.visibilityAccepted
              ? "Oui"
              : "Non"
          }
        </div>

        <div class="box">
          <strong>
            Expert-comptable consulté
          </strong>

          <br><br>

          ${
            data.accountantContacted
              ? "Oui"
              : "Pas encore"
          }
        </div>

        <div class="box">
          <strong>
            Notes
          </strong>

          <br><br>

          ${escapeValue(
            data.notes ||
            "Aucune note"
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
          "correctedMecenatSummaryBackBtn"
        );

      if(backButton){
        backButton.onclick =
          openCorrectedMecenatPage;
      }

    },0);
  }

  function openCorrectedMecenatProjects(){

    app.renderModal(
      "Projets locaux ouverts au mécénat",
      `
        <button
          id="correctedMecenatProjectsBackBtn"
          class="choiceBtn"
          type="button"
          style="margin-bottom:14px;">
          Retour
        </button>

        <div class="box">
          <strong>
            Projets proposés par la ville
          </strong>

          <br><br>

          Les projets ouverts au mécénat
          devront être clairement présentés,
          validés
          et accompagnés
          des informations nécessaires.
        </div>

        <div class="box">
          <strong>
            Culture
          </strong>

          <br><br>

          Fresques,
          œuvres,
          expositions,
          patrimoine
          ou parcours culturel.
        </div>

        <div class="box">
          <strong>
            Éducation
          </strong>

          <br><br>

          Actions pédagogiques,
          projets scolaires,
          équipements
          ou découverte des métiers.
        </div>

        <div class="box">
          <strong>
            Sport
          </strong>

          <br><br>

          Actions sportives locales
          portées dans le cadre prévu
          et validé.
        </div>

        <div class="box">
          <strong>
            Solidarité et environnement
          </strong>

          <br><br>

          Projets locaux
          utiles aux habitants,
          à la qualité de vie
          ou à la préservation du territoire.
        </div>
      `
    );

    window.setTimeout(function(){

      const backButton =
        getElement(
          "correctedMecenatProjectsBackBtn"
        );

      if(backButton){
        backButton.onclick =
          openCorrectedMecenatPage;
      }

    },0);
  }

  app.registerScreen(
    "mecenat",
    openCorrectedMecenatPage
  );

  app.openCorrectedMecenatPage =
    openCorrectedMecenatPage;

  app.openCorrectedMecenatSummary =
    openCorrectedMecenatSummary;

  app.openCorrectedMecenatProjects =
    openCorrectedMecenatProjects;

  console.log(
    "✅ Page Mécénat complète corrigée"
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

  function renderAiAnswer(
    host,
    result
  ){

    host.innerHTML = `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:17px;">
          ${escapeValue(
            result.title
          )}
        </strong>

        <br><br>

        ${escapeValue(
          result.answer
        )}

        <div
          style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
            margin-top:12px;
          ">

          <button
            id="entrepriseAiPrimaryActionBtn"
            class="choiceBtn"
            type="button">
            ${escapeValue(
              result.primaryLabel
            )}
          </button>

          ${
            result.secondaryLabel
              ? `
                <button
                  id="entrepriseAiSecondaryActionBtn"
                  class="choiceBtn"
                  type="button"
                  style="background:#fff;">
                  ${escapeValue(
                    result.secondaryLabel
                  )}
                </button>
              `
              : ""
          }
        </div>
      </div>
    `;

    window.setTimeout(function(){

      const primaryButton =
        getElement(
          "entrepriseAiPrimaryActionBtn"
        );

      const secondaryButton =
        getElement(
          "entrepriseAiSecondaryActionBtn"
        );

      if(primaryButton){
        primaryButton.onclick =
          result.primaryAction;
      }

      if(
        secondaryButton &&
        typeof result.secondaryAction ===
        "function"
      ){
        secondaryButton.onclick =
          result.secondaryAction;
      }

    },0);
  }

  function bindEntrepriseAi(){

    const button =
      getElement(
        "entrepriseAiAskBtn"
      );

    const input =
      getElement(
        "entrepriseAiQuestion"
      );

    const answer =
      getElement(
        "entrepriseAiAnswer"
      );

    if(
      !button ||
      !input ||
      !answer
    ){
      return;
    }

    if(
      button.dataset.aiImproved ===
      "true"
    ){
      return;
    }

    button.dataset.aiImproved =
      "true";

    function runAnalysis(){

      const question =
        String(
          input.value || ""
        ).trim();

      if(!question){

        alert(
          "Écrivez votre question."
        );

        return;
      }

      answer.innerHTML = `
        <div class="box">
          Analyse de votre demande en cours…
        </div>
      `;

      window.setTimeout(function(){

        const result =
          analyseQuestion(
            question
          );

        renderAiAnswer(
          answer,
          result
        );

      },300);
    }

    button.onclick =
      runAnalysis;

    input.addEventListener(
      "keydown",
      function(event){

        if(
          event.key ===
          "Enter" &&
          !event.shiftKey
        ){

          event.preventDefault();

          runAnalysis();
        }
      }
    );
  }

  const observer =
    new MutationObserver(
      function(){

        window.setTimeout(
          bindEntrepriseAi,
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

  window.setTimeout(
    bindEntrepriseAi,
    200
  );

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

    const renderer =
      app.screens &&
      app.screens[screenName];

    if(
      typeof renderer ===
      "function"
    ){
      if(app.state){

        if(
          app.state.currentScreen !==
          screenName
        ){
          app.state.previousScreen =
            app.state.currentScreen;
        }

        app.state.currentScreen =
          screenName;
      }

      renderer();

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

    const buttons =
      Array.from(
        modal.querySelectorAll("button")
      );

    /*
      Suppression du grand bouton :
      « Retour à la page précédente ».
    */

    buttons.forEach(function(button){

      const text =
        normalizeText(
          button.textContent
        );

      if(
        text.includes(
          "retour a la page precedente"
        )
      ){
        button.remove();
      }
    });

    /*
      Recherche des petits boutons Retour.
    */

    const returnButtons =
      Array.from(
        modal.querySelectorAll("button")
      )
      .filter(function(button){

        const text =
          normalizeText(
            button.textContent
          );

        return (
          text === "retour" ||
          text === "retour a l espace entreprise"
        );
      });

    /*
      On ne conserve qu’un seul bouton Retour.
    */

    returnButtons.forEach(function(button, index){

      if(index > 0){
        button.remove();
        return;
      }

      button.textContent =
        "Retour";

      button.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();

        openPreviousPage();
      };
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
   BANDES CLIQUABLES • ASSISTANT IMMÉDIAT
   ========================================================= */

(function repairEntrepriseBandsAndAssistant(){

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
    window.BOCITE_ENTREPRISE_ASSISTANT_REPAIRED
  ){
    return;
  }

  window.BOCITE_ENTREPRISE_ASSISTANT_REPAIRED =
    true;

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

      #entrepriseAiAskBtn {
        position:relative !important;
        z-index:3 !important;
        pointer-events:auto !important;
        cursor:pointer !important;
        touch-action:manipulation !important;
      }
    `;

    document.head.appendChild(style);
  }

  function openEntrepriseScreen(screenName){

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

  function extractCity(question){

    const original =
      String(question || "").trim();

    const match =
      original.match(
        /(?:\bà\b|\bau\b|\bsur\b|\bvers\b|\bprès de\b)\s+([a-zA-ZÀ-ÿ' -]{2,40})$/i
      );

    if(!match){
      return "";
    }

    return String(
      match[1] || ""
    )
      .replace(
        /\b(?:et|pour|dans)\b.*$/i,
        ""
      )
      .trim();
  }

  function extractSearchNeed(question){

    return String(question || "")
      .replace(
        /^(je|nous|mon entreprise|notre entreprise)\s+/i,
        ""
      )
      .replace(
        /^(recherche|cherche|voudrais|souhaite|veux)\s+/i,
        ""
      )
      .replace(
        /\b(?:à|au|sur|vers|près de)\s+[a-zA-ZÀ-ÿ' -]{2,40}$/i,
        ""
      )
      .trim();
  }

  function getAssistantResult(question){

    const normalized =
      normalizeText(question);

    const city =
      extractCity(question);

    const searchNeed =
      extractSearchNeed(question);

    if(
      normalized.includes("emploi") ||
      normalized.includes("recrut") ||
      normalized.includes("salarie") ||
      normalized.includes("personnel") ||
      normalized.includes("apprenti") ||
      normalized.includes("alternance") ||
      normalized.includes("stage")
    ){
      return {
        title:
          "Votre demande concerne l’emploi.",
        text:
          "Bo'CitéArt peut vous orienter vers les offres locales, les candidatures spontanées et les entreprises qui recrutent.",
        actionLabel:
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
      normalized.includes("telephone") ||
      normalized.includes("internet") ||
      normalized.includes("mutualis")
    ){
      return {
        title:
          "Votre demande concerne la réduction des charges.",
        text:
          "Vous pouvez consulter les regroupements existants et déclarer votre intérêt sans engagement immédiat.",
        actionLabel:
          "Voir les mutualisations",
        screen:
          "mutualisation"
      };
    }

    if(
      normalized.includes("mecenat") ||
      normalized.includes("mecene") ||
      normalized.includes("don") ||
      normalized.includes("soutenir un projet")
    ){
      return {
        title:
          "Votre demande concerne le mécénat.",
        text:
          "Bo'CitéArt peut vous présenter les formes de mécénat et les projets locaux susceptibles d’être soutenus.",
        actionLabel:
          "Découvrir le mécénat",
        screen:
          "mecenat"
      };
    }

    if(
      normalized.includes("transmission") ||
      normalized.includes("transmettre") ||
      normalized.includes("repreneur") ||
      normalized.includes("retraite") ||
      normalized.includes("cession") ||
      normalized.includes("succession")
    ){
      return {
        title:
          "Votre demande concerne l’avenir de l’entreprise.",
        text:
          "Vous pouvez préparer progressivement la transmission, la reprise ou la continuité de votre activité.",
        actionLabel:
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
          "Votre demande concerne la visibilité.",
        text:
          "Présentez votre entreprise, ses métiers, ses services et son savoir-faire à l’ensemble de la ville.",
        actionLabel:
          "Faire connaître mon entreprise",
        screen:
          "visibilite"
      };
    }

    if(
      normalized.includes("fournisseur") ||
      normalized.includes("sous traitant") ||
      normalized.includes("sous-traitant") ||
      normalized.includes("partenaire") ||
      normalized.includes("artisan") ||
      normalized.includes("entreprise") ||
      normalized.includes("commerce") ||
      normalized.includes("repasseuse") ||
      normalized.includes("plombier") ||
      normalized.includes("electricien") ||
      normalized.includes("comptable") ||
      normalized.includes("avocat") ||
      normalized.includes("menuisier") ||
      normalized.includes("carreleur")
    ){
      return {
        title:
          "Une recherche professionnelle peut être lancée.",
        text:
          city
            ? (
                "Bo'CitéArt recherchera en priorité « " +
                searchNeed +
                " » à " +
                city +
                ", puis dans les communes voisines."
              )
            : (
                "Bo'CitéArt recherchera en priorité « " +
                searchNeed +
                " » dans votre commune, puis dans les communes voisines."
              ),
        actionLabel:
          "Lancer la recherche",
        action:
          "professional_search",
        keyword:
          searchNeed,
        city:
          city
      };
    }

    return {
      title:
        "Votre demande a été comprise.",
      text:
        "Bo'CitéArt commencera par rechercher une solution dans votre commune. Vous pouvez également ouvrir la recherche professionnelle pour préciser le métier, le service ou l’entreprise recherchée.",
      actionLabel:
        "Ouvrir la recherche professionnelle",
      action:
        "professional_search",
      keyword:
        searchNeed,
      city:
        city
    };
  }

  function openProfessionalSearch(
    keyword,
    city
  ){

    const options = {
      keyword:
        keyword || "",
      city:
        city || ""
    };

    if(
      typeof app.openProfessionalDirectory ===
      "function"
    ){
      app.openProfessionalDirectory(
        options
      );

      return;
    }

    if(
      typeof app.openProfessionalSearch ===
      "function"
    ){
      app.openProfessionalSearch(
        options
      );

      window.setTimeout(function(){

        const needInput =
          document.getElementById(
            "professionalPublicSearchNeed"
          );

        if(
          needInput &&
          keyword
        ){
          needInput.value =
            keyword;
        }

      },100);

      return;
    }

    openEntrepriseScreen(
      "annuaire"
    );
  }

  function renderAssistantAnswer(question){

    const answerBox =
      document.getElementById(
        "entrepriseAiAnswer"
      );

    if(!answerBox){
      return;
    }

    const result =
      getAssistantResult(
        question
      );

    answerBox.innerHTML = `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          margin-top:12px;
        ">

        <strong style="font-size:18px;">
          ${escapeValue(result.title)}
        </strong>

        <br><br>

        ${escapeValue(result.text)}

        <button
          id="entrepriseAssistantActionBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:12px;
          ">
          ${escapeValue(result.actionLabel)}
        </button>
      </div>
    `;

    const actionButton =
      document.getElementById(
        "entrepriseAssistantActionBtn"
      );

    if(!actionButton){
      return;
    }

    actionButton.onclick = function(event){

      event.preventDefault();
      event.stopPropagation();

      if(
        result.action ===
        "professional_search"
      ){
        openProfessionalSearch(
          result.keyword,
          result.city
        );

        return;
      }

      openEntrepriseScreen(
        result.screen
      );
    };
  }

  function askEntrepriseAssistant(){

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
        "Écrivez votre question avant de continuer."
      );

      return;
    }

    renderAssistantAnswer(
      question
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

      const aiButton =
        target.closest(
          "#entrepriseAiAskBtn"
        );

      if(aiButton){

        event.preventDefault();
        event.stopPropagation();

        if(
          typeof event.stopImmediatePropagation ===
          "function"
        ){
          event.stopImmediatePropagation();
        }

        askEntrepriseAssistant();

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

  document.addEventListener(
    "keydown",
    function(event){

      if(
        event.key !== "Enter"
      ){
        return;
      }

      if(
        event.target &&
        event.target.id ===
        "entrepriseAiQuestion"
      ){

        event.preventDefault();

        askEntrepriseAssistant();
      }
    }
  );

  installClickableBandStyle();

  console.log(
    "✅ Bandes Entreprise et assistant local réparés"
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
      "Aucun résultat confirmé ne peut encore être affiché automatiquement dans cette démonstration.";

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

    if(category === "emploi"){

      return {
        title:
          "Recherche de personnel ou de compétence",

        text:
          "Aucun résultat confirmé ne peut encore être affiché automatiquement dans cette démonstration. Bo'CitéArt recherchera d’abord les profils et les entreprises présents dans la métropole lilloise, puis élargira progressivement la recherche.",

        lines:[
          "Consulter les offres et candidatures disponibles.",
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
          "Recherche d’une solution pour réduire vos charges",

        text:
          "Bo'CitéArt peut regrouper plusieurs entreprises ayant le même besoin afin de lancer une recherche commune et comparer les propositions reçues.",

        lines:[
          "Déclarer votre intérêt.",
          "Attendre que le nombre nécessaire d’entreprises soit atteint.",
          "Comparer les offres.",
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
          "Bo'CitéArt peut vous orienter vers les projets locaux et les différentes formes de contribution possibles.",

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
          "Bo'CitéArt peut vous aider à préparer progressivement la transmission, la reprise ou la continuité de votre activité.",

        lines:[
          "Valoriser le savoir-faire.",
          "Préparer les informations utiles.",
          "Identifier les besoins de transmission.",
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
          "Bo'CitéArt peut rendre visibles vos métiers, votre savoir-faire, vos services et vos coordonnées auprès des habitants et des professionnels.",

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
        "Aucun résultat confirmé ne peut encore être affiché automatiquement dans cette démonstration. La recherche commencera dans votre commune, puis dans les communes voisines, le département et la région.",

      lines:[
        "Identifier précisément le métier ou le service recherché.",
        "Consulter les entreprises et commerces locaux.",
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

        ${escapeHtml(answer.text)}

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

(function patchBociteObservatoireEconomique(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt : module Entreprise introuvable."
    );
    return;
  }

  const INTRO_KEY =
    "bociteart_observatoire_intro_lue_v1";

  const TERRITORY_KEY =
    "bociteart_observatoire_territoire_v1";

  function getElement(id){
    return document.getElementById(id);
  }

  function escapeValue(value){
    return module.safeEscape(value);
  }

  function introIsRead(){
    return (
      localStorage.getItem(INTRO_KEY) === "oui"
    );
  }

  function getTerritoryLabel(value){

    const labels = {
      commune:"Ma commune",
      voisines:"Communes voisines",
      departement:"Mon département",
      region:"Ma région",
      france:"Toute la France"
    };

    return labels[value] || "Ma commune";
  }

  function getPresentationHtml(showContinueButton){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.55;
        ">

        <strong style="font-size:20px;">
          Comprendre l’Observatoire économique Bo'CitéArt
        </strong>

        <br><br>

        L’annuaire est souvent utilisé
        comme une simple liste de noms.

        <br><br>

        Bo'CitéArt veut en faire
        un véritable outil de découverte,
        de recherche
        et de développement économique.

        <br><br>

        Il permet aux habitants,
        aux entreprises,
        aux commerces,
        aux artisans
        et aux collectivités
        de mieux connaître les richesses économiques
        présentes autour d’eux
        et partout en France.
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Un annuaire vivant
        </strong>

        <br><br>

        Vous pourrez découvrir :

        <br><br>

        • les entreprises ;<br>
        • les commerces ;<br>
        • les artisans ;<br>
        • leurs métiers ;<br>
        • leurs savoir-faire ;<br>
        • leurs produits ;<br>
        • leurs services ;<br>
        • leurs besoins ;<br>
        • leurs recherches professionnelles.
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Commencer par regarder autour de soi
        </strong>

        <br><br>

        Avant de rechercher systématiquement loin,
        il est utile de vérifier
        ce qui existe déjà dans sa commune,
        dans les communes voisines,
        dans son département
        ou dans sa région.

        <br><br>

        Votre prochain fournisseur,
        sous-traitant,
        partenaire,
        client
        ou futur salarié
        se trouve peut-être déjà près de vous.
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Rechercher partout en France
        </strong>

        <br><br>

        Une entreprise doit également pouvoir élargir
        sa recherche lorsque son besoin l’exige.

        <br><br>

        L’Observatoire économique Bo'CitéArt
        permettra de rechercher une activité,
        un métier,
        un commerce,
        un artisan
        ou une entreprise
        partout en France.
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Des informations régulièrement actualisées
        </strong>

        <br><br>

        L’objectif est de relier l’annuaire
        aux informations publiques officielles
        afin d’identifier régulièrement :

        <br><br>

        • les nouvelles entreprises ;<br>
        • les nouveaux commerces ;<br>
        • les changements d’adresse ;<br>
        • les changements d’activité ;<br>
        • les cessations ;<br>
        • les fermetures ;<br>
        • les éventuels doublons.
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Le rôle de l’intelligence artificielle
        </strong>

        <br><br>

        L’intelligence artificielle aidera
        à rapprocher,
        classer
        et contrôler les informations disponibles.

        <br><br>

        Elle ne devra pas inventer une entreprise
        ni supprimer seule une fiche.

        <br><br>

        Les mises à jour devront s’appuyer
        sur des données officielles
        et sur des contrôles réguliers.
      </div>

      <div class="box">

        <strong style="font-size:18px;">
          Pourquoi cette lecture est importante
        </strong>

        <br><br>

        Bo'CitéArt ne propose pas seulement
        de rechercher un nom.

        <br><br>

        L’objectif est aussi de faire connaître
        les acteurs économiques,
        de favoriser les relations locales,
        de créer de nouvelles opportunités
        et d’aider chacun
        à prendre de meilleures décisions.

        <br><br>

        Cette présentation vous permet de comprendre
        tout ce que cet outil va vous apporter.
      </div>

           ${
        showContinueButton
          ? `
            <button
              id="observatoireFinishReadingBtn"
              class="choiceBtn"
              type="button"
              style="
                width:100%;
                margin-top:14px;
                background:#b00020;
                color:#fff;
              ">
              J’ai terminé la lecture — accéder à l’Observatoire
            </button>
          `
          : ""
      }
    `;
  }

  function getMandatoryIntroductionHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.55;
        ">

        <strong style="font-size:21px;">
          Observatoire économique Bo'CitéArt
        </strong>

        <br><br>

        <strong>
          L’annuaire vivant des entreprises,
          commerces et artisans de France
        </strong>
      </div>

      <div
        class="box"
        style="border-left:6px solid #b00020;">

        <strong style="font-size:18px;">
          Lecture nécessaire avant le premier accès
        </strong>

        <br><br>

        Avant d’accéder à l’Observatoire économique
        Bo'CitéArt,
        la lecture de cette présentation est nécessaire.

        <br><br>

        Cette présentation ne dure que quelques minutes
        et vous permettra de comprendre
        tout ce que cet outil va vous apporter,
        que vous soyez citoyen,
        artisan,
        commerçant,
        entrepreneur,
        association
        ou collectivité.
      </div>

      ${getPresentationHtml(true)}
    `;
  }

  function getObservatoireHomeHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.55;
        ">

        <strong style="font-size:21px;">
          Observatoire économique Bo'CitéArt
        </strong>

        <br><br>

        <strong>
          L’annuaire vivant des entreprises,
          commerces et artisans de France
        </strong>

        <br><br>

        Recherchez près de chez vous
        ou élargissez directement votre recherche
        à toute la France.
      </div>

      <details
        id="observatoirePresentationDetails"
        class="box">

        <summary
          style="
            cursor:pointer;
            font-weight:900;
            color:#2f5d46;
          ">
          Relire la présentation complète
        </summary>

        <div style="margin-top:14px;">
          ${getPresentationHtml(false)}
        </div>
      </details>

      <div class="box">

        <strong style="font-size:18px;">
          Rechercher dans
        </strong>

        <br><br>

        Choisissez votre territoire.
        Vous arriverez directement
        dans l’annuaire correspondant.
      </div>

      <div
        style="
          display:grid;
          grid-template-columns:1fr;
          gap:9px;
        ">

        <button
          class="choiceBtn observatoireTerritoryBtn"
          type="button"
          data-observatoire-territory="commune">
          Ma commune
        </button>

        <button
          class="choiceBtn observatoireTerritoryBtn"
          type="button"
          data-observatoire-territory="voisines">
          Communes voisines
        </button>

        <button
          class="choiceBtn observatoireTerritoryBtn"
          type="button"
          data-observatoire-territory="departement">
          Mon département
        </button>

        <button
          class="choiceBtn observatoireTerritoryBtn"
          type="button"
          data-observatoire-territory="region">
          Ma région
        </button>

        <button
          class="choiceBtn observatoireTerritoryBtn"
          type="button"
          data-observatoire-territory="france">
          Toute la France
        </button>
      </div>
    `;
  }

     function getDirectoryHtml(territory){

    const territoryLabel =
      getTerritoryLabel(territory);

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          line-height:1.55;
        ">

        <strong style="font-size:20px;">
          Annuaire économique vivant
        </strong>

        <br><br>

        Territoire sélectionné :

        <br><br>

        <strong
          style="
            font-size:18px;
            color:#2f5d46;
          ">
          ${escapeValue(territoryLabel)}
        </strong>
      </div>

      <button
        id="observatoireChangeTerritoryBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-bottom:12px;
        ">
        Changer de territoire
      </button>

      <details class="box">

        <summary
          style="
            cursor:pointer;
            font-weight:900;
            color:#2f5d46;
          ">
          Relire la présentation de l’Observatoire
        </summary>

        <div style="margin-top:14px;">
          ${getPresentationHtml(false)}
        </div>
      </details>

      <div class="box">

        <strong>
          Rechercher
        </strong>

        <br><br>

        <input
          id="observatoireDirectorySearch"
          class="miniField"
          type="search"
          placeholder="Nom, métier, activité, produit ou service">

        <select
          id="observatoireDirectoryCategory"
          class="miniField"
          style="margin-top:9px;">

          <option value="all">
            Toutes les activités
          </option>

          <option value="artisan">
            Artisans
          </option>

          <option value="commerce">
            Commerces
          </option>

          <option value="entreprise">
            Entreprises
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
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong>
          Mise à jour de l’annuaire
        </strong>

        <br><br>

        La démonstration utilise actuellement
        les fiches enregistrées dans l’application.

        <br><br>

        La connexion nationale aux données officielles
        et leur actualisation assistée
        par intelligence artificielle
        seront raccordées dans la version définitive.
      </div>

      <div
        id="observatoireDirectoryCount"
        class="muted"
        style="margin-top:10px;">
      </div>

      <div
        id="observatoireDirectoryList"
        style="margin-top:10px;">
      </div>
    `;
  }

    function loadCompanies(){

    if(
      typeof module.loadDirectory === "function"
    ){
      return module.loadDirectory();
    }

    return [];
  }

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getCompanyCategory(company){

    const text =
      normalizeText(
        [
          company.name,
          company.activity,
          company.description
        ].join(" ")
      );

    if(
      text.includes("menuiser") ||
      text.includes("electric") ||
      text.includes("batiment") ||
      text.includes("métaller") ||
      text.includes("metaller") ||
      text.includes("plomb") ||
      text.includes("peint") ||
      text.includes("couvreur") ||
      text.includes("maçon") ||
      text.includes("macon")
    ){
      return "artisan";
    }

    if(
      text.includes("commerce") ||
      text.includes("magasin") ||
      text.includes("boutique") ||
      text.includes("restaurant") ||
      text.includes("boulanger") ||
      text.includes("coiffeur")
    ){
      return "commerce";
    }

    return "entreprise";
  }

  function renderDirectoryList(){

    const input =
      getElement("observatoireDirectorySearch");

    const category =
      getElement("observatoireDirectoryCategory");

    const list =
      getElement("observatoireDirectoryList");

    const count =
      getElement("observatoireDirectoryCount");

    if(!list){
      return;
    }

    const query =
      normalizeText(
        input ? input.value : ""
      );

    const categoryValue =
      category ? category.value : "all";

    let companies =
      loadCompanies().filter(function(company){

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
          categoryValue === "partner" &&
          !company.partner
        ){
          return false;
        }

        if(
          categoryValue === "official" &&
          company.partner
        ){
          return false;
        }

        if(
          categoryValue === "artisan" ||
          categoryValue === "commerce" ||
          categoryValue === "entreprise"
        ){
          if(
            getCompanyCategory(company) !==
            categoryValue
          ){
            return false;
          }
        }

        return true;
      });

    companies.sort(function(a,b){

      return String(a.name || "").localeCompare(
        String(b.name || ""),
        "fr",
        {
          sensitivity:"base"
        }
      );
    });

         if(count){

      count.textContent =
        companies.length +
        " résultat(s) trouvé(s).";
    }

    if(!companies.length){

      list.innerHTML = `
        <div class="box">
          Aucun résultat ne correspond
          à votre recherche actuelle.
        </div>
      `;

      return;
    }

    list.innerHTML =
      companies.map(function(company){

        return `
          <div class="box">

            <strong style="font-size:17px;">
              ${escapeValue(company.name)}
            </strong>

            <br><br>

            <span
              style="
                color:#2f5d46;
                font-weight:900;
              ">
              ${escapeValue(company.activity)}
            </span>

            <div
              style="
                margin-top:9px;
                line-height:1.5;
              ">
              ${escapeValue(company.description)}
            </div>

            <div style="margin-top:9px;">
              Commune :
              <strong>
                ${escapeValue(company.city || "")}
              </strong>
            </div>

            <div style="margin-top:10px;">

              <button
                class="choiceBtn observatoireOpenCompanyBtn"
                type="button"
                data-company-id="${escapeValue(company.id)}">

                Consulter la fiche

              </button>

            </div>

          </div>
        `;

      }).join("");

    list
      .querySelectorAll(
        ".observatoireOpenCompanyBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          const companyId =
            button.getAttribute(
              "data-company-id"
            );

          if(
            typeof module.openCompanyCard ===
            "function"
          ){

            module.openCompanyCard(
              companyId
            );

          }

        };

      });

  }

     function bindDirectory(){

    const input =
      getElement("observatoireDirectorySearch");

    const category =
      getElement("observatoireDirectoryCategory");

    const changeButton =
      getElement("observatoireChangeTerritoryBtn");

    if(input){
      input.oninput = renderDirectoryList;
    }

    if(category){
      category.onchange = renderDirectoryList;
    }

    if(changeButton){

      changeButton.onclick = function(){

        openObservatoireHome();

      };

    }

    renderDirectoryList();

  }

  function openTerritoryDirectory(territory){

    localStorage.setItem(
      TERRITORY_KEY,
      territory
    );

    module.renderModal(
      "Annuaire économique — " +
      getTerritoryLabel(territory),
      getDirectoryHtml(territory)
    );

    setTimeout(function(){

      bindDirectory();

    },0);

  }

  function bindObservatoireHome(){

    document
      .querySelectorAll(
        ".observatoireTerritoryBtn"
      )
      .forEach(function(button){

        button.onclick = function(){

          openTerritoryDirectory(
            button.getAttribute(
              "data-observatoire-territory"
            ) || "commune"
          );

        };

      });

  }

  function openObservatoireHome(){

    if(!introIsRead()){

      module.renderModal(
        "Observatoire économique Bo'CitéArt",
        getMandatoryIntroductionHtml()
      );

      setTimeout(function(){

        const btn =
          getElement(
            "observatoireFinishReadingBtn"
          );

        if(btn){

          btn.onclick = function(){

            localStorage.setItem(
              INTRO_KEY,
              "oui"
            );

            openObservatoireHome();

          };

        }

      },0);

      return;

    }

    module.renderModal(
      "Observatoire économique Bo'CitéArt",
      getObservatoireHomeHtml()
    );

    setTimeout(bindObservatoireHome,0);

  }

  module.registerScreen(
    "annuaire_local",
    openObservatoireHome
  );

  module.openLocalDirectory =
    openObservatoireHome;

  module.openObservatoireEconomique =
    openObservatoireHome;

  console.log(
    "✅ Observatoire économique Bo'CitéArt chargé"
  );

})();

(function(){

  const module = window.BociteEntreprise;

  if(
    !module ||
    typeof module.openObservatoireEconomique !== "function"
  ){
    console.warn(
      "Observatoire économique introuvable"
    ); 
    return;
  }

  module.openLocalDirectory =
    module.openObservatoireEconomique;

  module.registerScreen(
    "annuaire_local",
    module.openObservatoireEconomique
  );

  console.log(
    "✅ Observatoire économique remis en priorité"
  );

})();





