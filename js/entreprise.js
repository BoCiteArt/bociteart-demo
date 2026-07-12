/* =========================================================
   BO'CITÉART — MODULE ENTREPRISE
   PARTIE 1 — NAVIGATION ET ACCUEIL
   ========================================================= */

(function initBociteEntrepriseModule(){

  "use strict";

  const MODULE_NAME = "entreprise";

  const state = {
    currentScreen: "home",
    previousScreen: null
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
    if(!name || typeof renderer !== "function"){
      return;
    }

    screens[name] = renderer;
  }

  function openScreen(name, options){

    options = options || {};

    const renderer = screens[name];

    if(typeof renderer !== "function"){
      console.warn(
        "Écran Entreprise introuvable :",
        name
      );

      return;
    }

    if(state.currentScreen !== name){
      state.previousScreen = state.currentScreen;
    }

    state.currentScreen = name;

    renderer(options);
  }

  function buildBackButton(){
    if(state.currentScreen === "home"){
      return "";
    }

    return `
      <button
        class="choiceBtn"
        id="entrepriseBackBtn"
        type="button"
        style="margin-bottom:12px;">
        Retour à l’espace Entreprise
      </button>
    `;
  }

  function bindBackButton(){
    const button = getElement("entrepriseBackBtn");

    if(button){
      button.onclick = function(){
        openScreen("home");
      };
    }
  }

  function renderModal(title, html){

    if(!requireOpenModal()){
      return;
    }

    window.openModal(
      title,
      buildBackButton() + html,
      {
        noHistory:true
      }
    );

    window.setTimeout(function(){
      bindBackButton();
    }, 0);
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
        height:48px;
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
        padding:12px 0;
        white-space:nowrap;
        font-weight:900;
        color:#111;
        animation-name:entrepriseBandScroll;
        animation-duration:95s;
        animation-timing-function:linear;
        animation-iteration-count:infinite;
        animation-delay:0s;
        will-change:transform;
      }

      #entrepriseHomeBands .entrepriseBandAction {
        color:#b00020;
        font-weight:900;
      }

      @media (prefers-reduced-motion: reduce) {
        #entrepriseHomeBands .entrepriseBandText {
          animation-duration:95s;
        }
      }
    </style>

    <div
      class="box"
      style="
        border-left:6px solid #2f5d46;
        line-height:1.5;
      ">

      <strong style="font-size:18px;">
        Développez votre entreprise grâce aux ressources
        de votre territoire
      </strong>

      <br><br>

      Bo'CitéArt réunit, dans un même espace,
      des services utiles pour :

      <br><br>

      • recruter plus facilement ;<br>
      • rechercher des entreprises et des compétences ;<br>
      • développer votre activité ;<br>
      • réduire certaines charges ;<br>
      • améliorer votre visibilité ;<br>
      • découvrir des opportunités professionnelles ;<br>
      • préparer l’avenir de votre entreprise ;<br>
      • comprendre et utiliser le mécénat.

      <br><br>

      Commencez par votre commune, puis élargissez
      votre recherche lorsque votre activité le nécessite.
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
        data-entreprise-screen="annuaire">
        Rechercher une entreprise
      </button>

      <button
        class="choiceBtn"
        type="button"
        data-entreprise-screen="direction">
        Tableau de Direction
      </button>
    </div>

    <div id="entrepriseHomeBands">

      <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="emploi">

        <span class="entrepriseBandText">
          Déposez votre offre • Trouvez la personne près de chez vous •
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
          Attirez • Fidélisez vos salariés autrement •
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
          Développez votre entreprise • Partenaires • Sous-traitants • Nouvelles opportunités •
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
          Réduisez certaines charges • Électricité • Gaz • Assurances • Mutuelle • Flotte automobile •
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
          Faites connaître vos métiers • Votre entreprise • Votre savoir-faire •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>
      </button>

      <button
        class="entrepriseBand"
        type="button"
        data-entreprise-screen="economies">

        <span class="entrepriseBandText">
          Opportunités de mutualisation • Recevez des propositions communes • Vous restez libre de votre décision •
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
          Préparez l’avenir de votre entreprise • Transmission • Reprise • Continuité •
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
          Connaissez-vous le mécénat ? • Projets locaux • Avantage fiscal sous conditions •
          <span class="entrepriseBandAction">
            Cliquez ici…
          </span>
        </span>
      </button>
    </div>

    <div
      class="box"
      style="margin-top:14px;">

      <strong>
        Vous avez une question précise ?
      </strong>

      <br><br>

      Bo'CitéArt recherchera d’abord les solutions
      présentes dans votre commune, puis pourra élargir
      la recherche à la France ou à l’Europe
      selon l’abonnement choisi.

      <textarea
        id="entrepriseAiQuestion"
        class="miniField"
        style="
          min-height:85px;
          margin-top:10px;
        "
        placeholder="Exemple : je recherche un salarié, un carreleur, un fournisseur ou une solution pour réduire mes charges.">
      </textarea>

      <button
        class="choiceBtn"
        id="entrepriseAiAskBtn"
        type="button"
        style="margin-top:10px;">
        Poser ma question
      </button>

      <div
        id="entrepriseAiAnswer"
        class="muted"
        style="margin-top:10px;">
      </div>
    </div>
  `;
}

  function bindHomeButtons(){

    document
      .querySelectorAll("[data-entreprise-screen]")
      .forEach(function(button){

        button.onclick = function(){

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
          alert("Écrivez votre question.");
          return;
        }

        if(answer){
          answer.innerHTML = `
            <div class="box">
              Votre question a bien été enregistrée.<br><br>

              Le moteur Bo'CitéArt recherchera d’abord
              les solutions disponibles dans votre ville,
              puis élargira progressivement la recherche
              lorsque cela sera nécessaire.
            </div>
          `;
        }
      };
    }
  }

  function openHome(){

    state.currentScreen = "home";

    renderModal(
      "Commerces & Entreprises — Entreprise",
      getHomeHtml()
    );

    window.setTimeout(function(){
      bindHomeButtons();
    }, 0);
  }

  function openWaitingScreen(screenName, screenTitle){

    renderModal(
      screenTitle,
      `
        <div class="box">
          Cette rubrique sera intégrée dans la prochaine partie
          du module Entreprise.
        </div>
      `
    );
  }

  registerScreen("home", openHome);

  registerScreen("annuaire", function(){
    openWaitingScreen(
      "annuaire",
      "Les entreprises de votre ville"
    );
  });

  registerScreen("direction", function(){
    openWaitingScreen(
      "direction",
      "Tableau de Direction"
    );
  });

  registerScreen("emploi", function(){
    openWaitingScreen(
      "emploi",
      "Vous recherchez du personnel ?"
    );
  });

  registerScreen("fidelisation", function(){
    openWaitingScreen(
      "fidelisation",
      "Attirez et fidélisez vos salariés autrement"
    );
  });

  registerScreen("developpement", function(){
    openWaitingScreen(
      "developpement",
      "Développez votre entreprise"
    );
  });

  registerScreen("mutualisation", function(){
    openWaitingScreen(
      "mutualisation",
      "Réduisez vos charges"
    );
  });

  registerScreen("visibilite", function(){
    openWaitingScreen(
      "visibilite",
      "Faites connaître vos métiers et votre savoir-faire"
    );
  });

  registerScreen("economies", function(){
    openWaitingScreen(
      "economies",
      "Comparez, choisissez, validez"
    );
  });

  registerScreen("perennite", function(){
    openWaitingScreen(
      "perennite",
      "Préparez l’avenir de votre entreprise"
    );
  });

  registerScreen("mecenat", function(){
    openWaitingScreen(
      "mecenat",
      "Savez-vous à qui et à quoi sert le mécénat ?"
    );
  });

  window.BociteEntreprise = {
    moduleName:MODULE_NAME,
    state:state,
    screens:screens,
    registerScreen:registerScreen,
    openScreen:openScreen,
    openHome:openHome,
    renderModal:renderModal,
    safeEscape:safeEscape
  };

  window.openEntrepriseHome = openHome;

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
      <div class="box" style="border-left:6px solid #2f5d46;">
        <strong>Les entreprises de votre ville</strong><br><br>

        Retrouvez les activités et les savoir-faire présents
        dans votre commune.

        <br><br>

        Dans la version définitive, cette liste sera alimentée
        et actualisée à partir des données publiques officielles.
      </div>

      <div class="box">
        <strong>Rechercher</strong><br><br>

        <input
          id="entrepriseDirectorySearch"
          class="miniField"
          type="search"
          placeholder="Nom, métier ou activité">

        <select
          id="entrepriseDirectoryFilter"
          class="miniField"
          style="margin-top:9px;">

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

    companies = sortCompanies(companies);

    if(count){
      count.textContent =
        companies.length +
        " entreprise(s) trouvée(s).";
    }

    if(!companies.length){
      list.innerHTML = `
        <div class="box">
          Aucune entreprise ne correspond à votre recherche.
        </div>
      `;
      return;
    }

    list.innerHTML =
      companies.map(function(company){

        const badge = company.partner
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
          <div class="box">
            <strong style="font-size:16px;">
              ${escapeValue(company.name)}
            </strong>

            <br>

            <span style="font-weight:900;color:#2f5d46;">
              ${escapeValue(company.activity)}
            </span>

            <div style="margin-top:8px;line-height:1.45;">
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
      .querySelectorAll(".entrepriseDirectoryOpen")
      .forEach(function(button){

        button.onclick = function(){
          openCompanyCard(
            button.getAttribute("data-company-id")
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
      input.oninput = renderDirectoryList;
    }

    if(filter){
      filter.onchange = renderDirectoryList;
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
      alert("Cette entreprise est introuvable.");
      return;
    }

    const partnerContent = company.partner
      ? `
        <div class="box">
          <strong>Fiche Bo'CitéArt enrichie</strong><br><br>

          Cette entreprise peut présenter ses services,
          ses réalisations, ses recrutements, ses actualités
          et ses engagements locaux.
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;">
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
        <div class="box">
          Cette fiche reprend actuellement les informations
          publiques disponibles.

          <br><br>

          L’entreprise pourra enrichir volontairement
          sa présentation en devenant partenaire Bo'CitéArt.
        </div>
      `;

    module.renderModal(
      company.name,
      `
        <div class="box">
          <strong>Que fait cette entreprise ?</strong><br><br>

          ${escapeValue(company.description)}
        </div>

        <div class="box">
          <strong>Activité</strong><br>
          ${escapeValue(company.activity)}

          <br><br>

          <strong>Commune</strong><br>
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
          module.openScreen("emploi");
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
        alert("Écrivez votre question.");
        return;
      }

      if(!answerBox){
        return;
      }

      const result =
        getLocalAnswer(question);

      answerBox.innerHTML = `
        <div class="box">
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

  module.registerScreen("home", function(){
    originalHome();

    window.setTimeout(function(){
      bindHomeAi();
    },0);
  });

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

  const module = window.BociteEntreprise;

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
        localStorage.getItem(EMPLOYMENT_STORE_KEY);

      const parsed =
        raw ? JSON.parse(raw) : null;

      if(parsed && typeof parsed === "object"){
        return {
          offers:Array.isArray(parsed.offers)
            ? parsed.offers
            : [],
          applications:Array.isArray(parsed.applications)
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
      Math.random().toString(36).slice(2,7)
    );
  }

  function getEmploymentHomeHtml(){
    return `
      <div class="box" style="border-left:6px solid #2f5d46;">
        <strong style="font-size:18px;">
          Vous recherchez du personnel ?
        </strong>

        <br><br>

        Faites votre recrutement dans cet espace unique.

        <br><br>

        <strong>
          Les habitants de votre ville seront les premiers informés.
        </strong>

        <br><br>

        Pourquoi chercher plus loin lorsque les compétences
        sont souvent déjà près de chez vous ?
      </div>

      <div class="box">
        <strong>Un recrutement plus local</strong><br><br>

        L’offre est présentée en priorité dans votre commune.

        <br><br>

        Le citoyen répond uniquement à l’annonce
        qui correspond à son profil.

        <br><br>

        Son CV et son message restent associés
        à cette offre précise.
      </div>

      <div class="box">
        <strong>Votre historique vous est offert</strong><br><br>

        L’entreprise conserve les candidatures reçues
        dans son Tableau de Direction.

        <br><br>

        Elle peut retrouver un candidat plusieurs mois plus tard
        et lui demander s’il est encore disponible.
      </div>

      <div class="box">
        <strong>Respect du candidat</strong><br><br>

        Lorsque le poste est pourvu, l’entreprise doit clôturer
        son annonce.

        <br><br>

        Cela évite aux citoyens de perdre leur temps
        à répondre à une offre qui n’est plus disponible.
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button
          class="choiceBtn"
          id="employmentCreateOfferBtn"
          type="button">
          Publier une offre
        </button>

        <button
          class="choiceBtn"
          id="employmentViewOffersBtn"
          type="button">
          Consulter les offres
        </button>

        <button
          class="choiceBtn"
          id="employmentApplicationsBtn"
          type="button">
          Candidatures reçues
        </button>
      </div>

      <div class="box" style="margin-top:14px;">
        <strong>Règle de diffusion</strong><br><br>

        Une offre publiée doit être modifiée ou clôturée
        dès que la situation évolue.

        <br><br>

        Statuts possibles :

        <br><br>

        • publiée<br>
        • modifiée<br>
        • poste pourvu<br>
        • clôturée
      </div>
    `;
  }

  function bindEmploymentHome(){
    const createButton =
      getElement("employmentCreateOfferBtn");

    const offersButton =
      getElement("employmentViewOffersBtn");

    const applicationsButton =
      getElement("employmentApplicationsBtn");

    if(createButton){
      createButton.onclick = function(){
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
        openEmploymentApplications();
      };
    }
  }

  function openEmployment(){
    module.renderModal(
      "Vous recherchez du personnel ?",
      getEmploymentHomeHtml()
    );

    window.setTimeout(function(){
      bindEmploymentHome();
    },0);
  }

  function openEmploymentForm(){
    module.renderModal(
      "Publier une offre d’emploi",
      `
        <div class="box">
          <strong>Informations sur l’entreprise</strong><br><br>

          Les données professionnelles et le contact
          doivent être vérifiés avant publication.
        </div>

        <label style="font-weight:900;">
          Nom de l’entreprise
        </label>

        <input
          id="employmentCompanyName"
          class="miniField"
          type="text"
          placeholder="Nom de l’entreprise">

        <label style="display:block;margin-top:10px;font-weight:900;">
          SIRET ou SIREN
        </label>

        <input
          id="employmentCompanyId"
          class="miniField"
          type="text"
          placeholder="SIRET ou SIREN">

        <label style="display:block;margin-top:10px;font-weight:900;">
          Adresse e-mail de contact
        </label>

        <input
          id="employmentContactEmail"
          class="miniField"
          type="email"
          placeholder="Adresse professionnelle ou personnelle autorisée">

        <label style="display:block;margin-top:10px;font-weight:900;">
          Intitulé du poste
        </label>

        <input
          id="employmentJobTitle"
          class="miniField"
          type="text"
          placeholder="Exemple : électricien, secrétaire, vendeur">

        <label style="display:block;margin-top:10px;font-weight:900;">
          Description de l’offre
        </label>

        <textarea
          id="employmentDescription"
          class="miniField"
          style="min-height:130px;"
          placeholder="Missions, expérience, horaires, contrat, lieu de travail">
        </textarea>

        <label style="display:block;margin-top:10px;font-weight:900;">
          Type de contrat
        </label>

        <select
          id="employmentContractType"
          class="miniField">

          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Interim">Intérim</option>
          <option value="Stage">Stage</option>
          <option value="Alternance">Alternance</option>
          <option value="Autre">Autre</option>
        </select>

        <label style="display:block;margin-top:10px;font-weight:900;">
          Commune du poste
        </label>

        <input
          id="employmentCity"
          class="miniField"
          type="text"
          value="Wattignies"
          placeholder="Commune">

        <div class="box" style="margin-top:12px;">
          <strong>Publication ponctuelle</strong><br><br>

          Tarif professionnel prévu :
          <strong>50 € HT</strong>.

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
          style="margin-top:14px;width:100%;">
          Enregistrer l’offre
        </button>
      `
    );

    window.setTimeout(function(){
      const saveButton =
        getElement("employmentSaveOfferBtn");

      if(saveButton){
        saveButton.onclick = saveEmploymentOffer;
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

    return "Inconnue";
  }

  function openEmploymentOffers(){
    module.renderModal(
      "Offres d’emploi",
      `
        <div class="box">
          Les habitants consultent ici les offres disponibles
          dans leur ville.

          <br><br>

          Ils peuvent répondre uniquement à l’annonce choisie.
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
      getElement("employmentOffersList");

    if(!host){
      return;
    }

    const data =
      loadEmploymentData();

    const offers =
      data.offers
        .slice()
        .sort(function(a,b){
          return Number(b.createdAt) -
            Number(a.createdAt);
        });

    if(!offers.length){
      host.innerHTML = `
        <div class="box">
          Aucune offre n’est enregistrée pour le moment.
        </div>
      `;
      return;
    }

    host.innerHTML =
      offers.map(function(offer){

        const active =
          offer.status === "publiee" ||
          offer.status === "modifiee";

        return `
          <div class="box">
            <strong style="font-size:16px;">
              ${escapeValue(offer.title)}
            </strong>

            <br>

            <span style="font-weight:900;color:#2f5d46;">
              ${escapeValue(offer.companyName)}
            </span>

            <div style="margin-top:8px;">
              ${escapeValue(offer.city)}
              •
              ${escapeValue(offer.contract)}
            </div>

            <div style="margin-top:8px;line-height:1.5;">
              ${escapeValue(offer.description)}
            </div>

            <div style="margin-top:8px;font-weight:900;">
              Statut :
              ${escapeValue(
                getOfferStatusLabel(offer.status)
              )}
            </div>

            ${
              active
                ? `
                  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
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
      .querySelectorAll(".employmentApplyBtn")
      .forEach(function(button){

        button.onclick = function(){
          openApplicationForm(
            button.getAttribute("data-offer-id")
          );
        };
      });

    host
      .querySelectorAll(".employmentCloseBtn")
      .forEach(function(button){

        button.onclick = function(){
          closeEmploymentOffer(
            button.getAttribute("data-offer-id")
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
      alert("Offre introuvable.");
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

    offer.status = "pourvue";
    offer.closedAt = Date.now();

    saveEmploymentData(data);
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
      alert("Offre introuvable.");
      return;
    }

    module.renderModal(
      "Répondre à l’offre",
      `
        <div class="box">
          <strong>
            ${escapeValue(offer.title)}
          </strong>

          <br><br>

          ${escapeValue(offer.companyName)}
          •
          ${escapeValue(offer.city)}
        </div>

        <label style="font-weight:900;">
          Nom et prénom
        </label>

        <input
          id="applicationCandidateName"
          class="miniField"
          type="text"
          placeholder="Nom et prénom">

        <label style="display:block;margin-top:10px;font-weight:900;">
          Adresse e-mail
        </label>

        <input
          id="applicationCandidateEmail"
          class="miniField"
          type="email"
          placeholder="Adresse e-mail">

        <label style="display:block;margin-top:10px;font-weight:900;">
          Téléphone
        </label>

        <input
          id="applicationCandidatePhone"
          class="miniField"
          type="tel"
          placeholder="Téléphone">

        <label style="display:block;margin-top:10px;font-weight:900;">
          Message au recruteur
        </label>

        <textarea
          id="applicationCandidateMessage"
          class="miniField"
          style="min-height:110px;"
          placeholder="Présentez brièvement votre candidature">
        </textarea>

        <label style="display:block;margin-top:10px;font-weight:900;">
          CV
        </label>

        <input
          id="applicationCandidateCv"
          class="miniField"
          type="file"
          accept=".pdf,.doc,.docx">

        <div class="box" style="margin-top:12px;">
          Le CV est envoyé uniquement pour cette offre.

          <br><br>

          Il n’est pas déposé dans un espace public
          ni accessible à toutes les entreprises.
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
          style="width:100%;margin-top:14px;">
          Envoyer ma candidature
        </button>
      `
    );

    window.setTimeout(function(){
      const sendButton =
        getElement("applicationSendBtn");

      if(sendButton){
        sendButton.onclick = function(){
          saveApplication(offerId);
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
      getElement("applicationCandidateCv");

    const consent =
      getElement("applicationConsentCheck");

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

    if(
      !cvInput ||
      !cvInput.files ||
      !cvInput.files.length
    ){
      alert("Veuillez sélectionner votre CV.");
      return;
    }

    if(!consent || !consent.checked){
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
        offer.status !== "modifiee"
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
        Math.random().toString(36).slice(2,7),
      offerId:offerId,
      offerTitle:offer.title,
      companyName:offer.companyName,
      candidateName:name,
      candidateEmail:email,
      candidatePhone:phone,
      message:message,
      cvName:cvInput.files[0].name,
      createdAt:Date.now(),
      createdAtFr:
        new Date().toLocaleString("fr-FR"),
      status:"recue"
    });

    saveEmploymentData(data);

    alert(
      "Votre candidature a été transmise à l’entreprise."
    );

    openEmploymentOffers();
  }

  function openEmploymentApplications(){
    module.renderModal(
      "Candidatures reçues",
      `
        <div class="box">
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
      getElement("employmentApplicationsList");

    if(!host){
      return;
    }

    const data =
      loadEmploymentData();

    const applications =
      data.applications
        .slice()
        .sort(function(a,b){
          return Number(b.createdAt) -
            Number(a.createdAt);
        });

    if(!applications.length){
      host.innerHTML = `
        <div class="box">
          Aucune candidature reçue.
        </div>
      `;
      return;
    }

    host.innerHTML =
      applications.map(function(application){
        return `
          <div class="box">
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
      <div class="box" style="border-left:6px solid #2f5d46;">
        <strong style="font-size:18px;">
          Attirez et fidélisez vos salariés autrement
        </strong>

        <br><br>

        Recruter près de l’entreprise peut déjà réduire
        les temps de déplacement et les frais de transport.
      </div>

      <div class="box">
        <strong>La proximité compte</strong><br><br>

        Un salarié regarde la rémunération,
        mais également :

        <br><br>

        • la distance entre son domicile et son travail ;<br>
        • la qualité de vie ;<br>
        • la reconnaissance ;<br>
        • l’ambiance ;<br>
        • les services accessibles près de l’entreprise ;<br>
        • l’engagement de son employeur.
      </div>

      <div class="box">
        <strong>Des actions concrètes</strong><br><br>

        Recruter en priorité dans la commune
        ou dans les communes voisines.

        <br><br>

        Faire connaître aux salariés les commerces,
        les services, les activités et les clubs
        présents autour de l’entreprise.

        <br><br>

        Valoriser les métiers et le savoir-faire
        des équipes.

        <br><br>

        Associer les salariés à une action locale,
        un mécénat ou un projet utile à la ville.
      </div>

      <div class="box">
        <strong>Une entreprise mieux connue</strong><br><br>

        Lorsque les habitants connaissent votre activité,
        vos métiers et votre présence dans la ville,
        ils peuvent parler de vous naturellement.

        <br><br>

        Cela favorise aussi les recrutements futurs
        et la fierté d’appartenance des salariés.
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button
          class="choiceBtn"
          id="loyaltyEmploymentBtn"
          type="button">
          Rechercher du personnel
        </button>

        <button
          class="choiceBtn"
          id="loyaltyDirectoryBtn"
          type="button">
          Découvrir les services locaux
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
      getLoyaltyHtml()
    );

    window.setTimeout(function(){
      const employmentButton =
        getElement("loyaltyEmploymentBtn");

      const directoryButton =
        getElement("loyaltyDirectoryBtn");

      const patronageButton =
        getElement("loyaltyPatronageBtn");

      if(employmentButton){
        employmentButton.onclick = function(){
          module.openScreen("emploi");
        };
      }

      if(directoryButton){
        directoryButton.onclick = function(){
          module.openScreen("annuaire");
        };
      }

      if(patronageButton){
        patronageButton.onclick = function(){
          module.openScreen("mecenat");
        };
      }
    },0);
  }

  module.registerScreen(
    "emploi",
    openEmployment
  );

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
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Développez votre entreprise
        </strong>

        <br><br>

        Votre prochain client, fournisseur, salarié
        ou partenaire se trouve peut-être déjà
        dans votre ville.
      </div>

      <div class="box">
        <strong>
          Commencez par regarder autour de vous
        </strong>

        <br><br>

        Découvrez les entreprises présentes dans votre commune,
        leurs métiers, leurs savoir-faire et leurs besoins.

        <br><br>

        Recherchez un fournisseur, un sous-traitant,
        une compétence complémentaire ou un partenaire local.

        <br><br>

        Avant de chercher loin, regardez ce qui existe déjà
        près de chez vous.
      </div>

      <div class="box">
        <strong>
          Bo'CitéArt prépare des connexions utiles
        </strong>

        <br><br>

        L’objectif n’est pas seulement d’afficher des noms
        dans un annuaire.

        <br><br>

        Il s’agit de permettre aux entreprises de mieux
        se connaître, de travailler ensemble et de découvrir
        des opportunités qu’elles ne voyaient pas auparavant.
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button
          class="choiceBtn"
          id="developmentDirectoryBtn"
          type="button">
          Les entreprises de ma ville
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
          Rechercher un partenaire
        </button>
      </div>

      <div
        class="box"
        style="margin-top:14px;">

        <strong style="font-size:17px;">
          Préparez votre prochaine action
        </strong>

        <br><br>

        Répondez simplement aux questions suivantes.
        Votre réponse restera dans votre espace professionnel.
      </div>

      <label style="display:block;font-weight:900;">
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
        placeholder="Expliquez simplement ce que vous recherchez.">${escapeValue(saved.need || "")}</textarea>

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
        placeholder="Indiquez les démarches déjà réalisées.">${escapeValue(saved.localSearch || "")}</textarea>

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
        placeholder="Exemple : contacter trois entreprises locales, demander un devis ou organiser une rencontre.">${escapeValue(saved.action || "")}</textarea>

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
        value="${escapeValue(saved.deadline || "")}">

      <button
        id="developmentSaveBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:14px;">
        Enregistrer mon plan d’action
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

      <div
        class="box"
        style="margin-top:14px;">

        <strong>
          Besoin d’une réponse rapide ?
        </strong>

        <br><br>

        Posez votre question à Bo'CitéArt.

        <br><br>

        La réponse commencera toujours par les ressources
        disponibles dans votre ville avant de s’élargir.
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
        style="width:100%;margin-top:10px;">
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
        <div class="box">
          <strong>Objectif principal</strong><br><br>
          ${escapeValue(
            getObjectiveLabel(data.objective)
          )}
        </div>

        <div class="box">
          <strong>Besoin identifié</strong><br><br>
          ${escapeValue(data.need || "Non renseigné")}
        </div>

        <div class="box">
          <strong>Recherche locale déjà effectuée</strong><br><br>
          ${escapeValue(
            data.localSearch || "Aucune démarche renseignée"
          )}
        </div>

        <div class="box">
          <strong>Action prévue</strong><br><br>
          ${escapeValue(data.action || "Non renseignée")}
        </div>

        <div class="box">
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
      getDevelopmentHtml()
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
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Réduisez vos charges
        </strong>

        <br><br>

        Pourquoi continuer à négocier seul
        lorsqu’il est possible de se regrouper ?

        <br><br>

        Tout le monde en parle.
        Peu le font réellement.

        <br><br>

        Bo'CitéArt organise la démarche.
      </div>

      <div class="box">
        <strong>Comment cela fonctionne ?</strong>

        <br><br>

        1. Vous indiquez les sujets qui vous intéressent.

        <br><br>

        2. Le compteur augmente immédiatement.

        <br><br>

        3. Lorsque le nombre nécessaire est atteint,
        Bo'CitéArt prépare la consultation.

        <br><br>

        4. Les propositions sont présentées
        dans votre Tableau de Direction.

        <br><br>

        5. Chaque entreprise choisit librement
        la proposition qu’elle souhaite.
      </div>

      <div
        id="mutualisationList"
        style="margin-top:12px;">
      </div>

      <div
        class="box"
        style="margin-top:14px;">

        <strong>
          Vous souhaitez proposer un autre regroupement ?
        </strong>

        <br><br>

        Décrivez simplement votre besoin.

        <br><br>

        Si plusieurs entreprises expriment la même demande,
        Bo'CitéArt pourra l’étudier.
      </div>

      <input
        id="mutualisationOtherTitle"
        class="miniField"
        type="text"
        placeholder="Exemple : entretien des véhicules">

      <textarea
        id="mutualisationOtherDescription"
        class="miniField"
        style="min-height:90px;margin-top:8px;"
        placeholder="Expliquez brièvement le besoin.">
      </textarea>

      <button
        id="mutualisationOtherSaveBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:10px;">
        Proposer ce regroupement
      </button>

      <div
        id="mutualisationOtherList"
        style="margin-top:12px;">
      </div>

      <div
        class="box"
        style="margin-top:14px;">

        <strong>
          Information importante
        </strong>

        <br><br>

        Le premier clic indique seulement votre intérêt.

        <br><br>

        Il ne constitue pas encore
        un engagement définitif.

        <br><br>

        L’engagement final interviendra
        uniquement après présentation
        des propositions et confirmation
        dans le Tableau de Direction.
      </div>
    `;
  }

  function renderMutualisationList(){
    const host =
      getElement("mutualisationList");

    if(!host){
      return;
    }

    const data =
      loadMutualisationData();

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

    host.innerHTML =
      keys.map(function(key){

        const item = data[key];
        const percent =
          getProgressPercent(
            item.count,
            item.target
          );

        const buttonText =
          item.interested
            ? "Intérêt enregistré"
            : "Je suis intéressé";

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
                  ${escapeValue(item.label)}
                </strong>

                <div
                  class="muted"
                  style="margin-top:5px;">
                  Objectif conseillé :
                  ${Number(item.target)} participants
                </div>
              </div>

              <div
                style="
                  font-size:18px;
                  font-weight:900;
                  color:#2f5d46;
                  white-space:nowrap;
                ">
                ${Number(item.count)}
                /
                ${Number(item.target)}
              </div>
            </div>

            <div
              style="
                margin-top:10px;
                height:12px;
                border-radius:999px;
                background:#e6e0d7;
                overflow:hidden;
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
              Progression :
              ${percent} %
            </div>

            <button
              class="choiceBtn mutualisationInterestBtn"
              type="button"
              data-mutualisation-key="${escapeValue(key)}"
              style="
                width:100%;
                margin-top:10px;
                ${item.interested ? "opacity:.65;" : ""}
              ">
              ${escapeValue(buttonText)}
            </button>
          </div>
        `;
      }).join("");

    host
      .querySelectorAll(".mutualisationInterestBtn")
      .forEach(function(button){

        button.onclick = function(){
          registerInterest(
            button.getAttribute(
              "data-mutualisation-key"
            )
          );
        };
      });
  }

  function registerInterest(key){
    const data =
      loadMutualisationData();

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

    item.interestDate =
      Date.now();

    item.interestDateFr =
      new Date().toLocaleString("fr-FR");

    saveMutualisationData(data);
    renderMutualisationList();

    if(
      Number(item.count) >=
      Number(item.target)
    ){
      alert(
        "Votre intérêt est enregistré.\n\n" +
        "Le nombre conseillé de participants est maintenant atteint.\n\n" +
        "Bo'CitéArt peut préparer l’étude de cette demande."
      );
      return;
    }

    alert(
      "Votre intérêt est enregistré.\n\n" +
      "Le compteur vient d’augmenter.\n\n" +
      "Plus les entreprises seront nombreuses, " +
      "plus la négociation pourra devenir favorable."
    );
  }

  function saveOtherRequest(){
    const title =
      String(
        getElement("mutualisationOtherTitle")
          ? getElement("mutualisationOtherTitle").value
          : ""
      ).trim();

    const description =
      String(
        getElement("mutualisationOtherDescription")
          ? getElement("mutualisationOtherDescription").value
          : ""
      ).trim();

    if(!title){
      alert(
        "Indiquez le regroupement souhaité."
      );
      return;
    }

    if(!description){
      alert(
        "Expliquez brièvement votre besoin."
      );
      return;
    }

    const data =
      loadMutualisationData();

    if(!Array.isArray(data.autres)){
      data.autres = [];
    }

    const normalizedTitle =
      title.toLowerCase();

    const existing =
      data.autres.find(function(item){
        return String(item.title || "")
          .toLowerCase() ===
          normalizedTitle;
      });

    if(existing){
      if(existing.interested){
        alert(
          "Vous avez déjà participé à cette demande."
        );
        return;
      }

      existing.count =
        Number(existing.count || 0) + 1;

      existing.interested = true;

      existing.lastUpdate =
        Date.now();

      existing.lastUpdateFr =
        new Date().toLocaleString("fr-FR");
    }else{
      data.autres.push({
        id:
          "AUTRE-" +
          Date.now() +
          "-" +
          Math.random()
            .toString(36)
            .slice(2,7),

        title:title,
        description:description,
        count:1,
        target:10,
        interested:true,
        createdAt:Date.now(),
        createdAtFr:
          new Date().toLocaleString("fr-FR"),
        status:"en_observation"
      });
    }

    saveMutualisationData(data);

    const titleInput =
      getElement("mutualisationOtherTitle");

    const descriptionInput =
      getElement("mutualisationOtherDescription");

    if(titleInput){
      titleInput.value = "";
    }

    if(descriptionInput){
      descriptionInput.value = "";
    }

    renderOtherRequests();

    alert(
      "Votre demande est enregistrée.\n\n" +
      "Bo'CitéArt suivra automatiquement son évolution."
    );
  }

  function renderOtherRequests(){
    const host =
      getElement("mutualisationOtherList");

    if(!host){
      return;
    }

    const data =
      loadMutualisationData();

    const requests =
      Array.isArray(data.autres)
        ? data.autres
        : [];

    if(!requests.length){
      host.innerHTML = "";
      return;
    }

    host.innerHTML = `
      <div
        style="
          font-weight:900;
          font-size:17px;
          margin-bottom:8px;
        ">
        Demandes proposées
      </div>

      ${
        requests.map(function(item){

          const count =
            Number(item.count || 0);

          const target =
            Number(item.target || 10);

          const reached =
            count >= target;

          return `
            <div class="box">
              <strong>
                ${escapeValue(item.title)}
              </strong>

              <br><br>

              ${escapeValue(item.description)}

              <br><br>

              Participants :
              <strong>
                ${count}
                /
                ${target}
              </strong>

              <br><br>

              Statut :
              <strong>
                ${
                  reached
                    ? "Demande à étudier"
                    : "En observation"
                }
              </strong>
            </div>
          `;
        }).join("")
      }
    `;
  }

  function bindMutualisation(){
    const otherButton =
      getElement("mutualisationOtherSaveBtn");

    if(otherButton){
      otherButton.onclick =
        saveOtherRequest;
    }

    renderMutualisationList();
    renderOtherRequests();
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
      <div
        class="box"
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

      <div class="box">
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

      <div
        class="box"
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
          <div class="box">
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
        <div class="box">
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
        <div class="box">
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
        <div class="box">
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
        <div class="box">
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
        <div class="box">
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
    const saved =
      loadVisibilityData();

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Faites connaître vos métiers et votre savoir-faire
        </strong>

        <br><br>

        Parce qu’avant d’acheter ou de chercher ailleurs,
        les habitants doivent déjà savoir que vous existez.
      </div>

      <div class="box">
        <strong>
          Il est encore trop difficile de savoir
          qui fait quoi dans sa propre ville
        </strong>

        <br><br>

        Même lorsque vos produits ou services
        ne s’adressent pas directement aux particuliers,
        les habitants peuvent connaître votre activité,
        parler de vous ou transmettre votre nom.
      </div>

      <div class="box">
        <strong>
          Faire connaître votre entreprise crée plusieurs leviers
        </strong>

        <br><br>

        • l’emploi ;<br>
        • le bouche-à-oreille ;<br>
        • les partenariats ;<br>
        • la découverte des métiers ;<br>
        • les vocations chez les jeunes ;<br>
        • la transmission future ;<br>
        • la reconnaissance locale.
      </div>

      <div class="box">
        <strong>
          Chaque année, des entreprises disparaissent
          faute de repreneur
        </strong>

        <br><br>

        Parfois simplement parce que personne
        ne connaissait réellement leur activité.

        <br><br>

        Faire connaître votre métier aujourd’hui,
        c’est aussi préparer demain.
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button
          id="visibilityDirectoryBtn"
          class="choiceBtn"
          type="button">
          Voir les entreprises de la ville
        </button>

        <button
          id="visibilityAdvertisementBtn"
          class="choiceBtn"
          type="button">
          Diffuser une publicité
        </button>

        <button
          id="visibilityEditCardBtn"
          class="choiceBtn"
          type="button">
          Présenter mon entreprise
        </button>
      </div>

      <div
        class="box"
        style="margin-top:14px;">

        <strong style="font-size:17px;">
          Fiche Bo'CitéArt enrichie
        </strong>

        <br><br>

        Les informations officielles de l’entreprise
        peuvent apparaître dans l’annuaire.

        <br><br>

        La fiche enrichie permet d’ajouter volontairement :

        <br><br>

        • une présentation ;<br>
        • les métiers ;<br>
        • les services ;<br>
        • les réalisations ;<br>
        • les recrutements ;<br>
        • les actualités ;<br>
        • l’engagement en mécénat ;<br>
        • une demande de devis ;<br>
        • un contact direct.
      </div>

      <div
        class="box">

        <strong>
          Tarif professionnel prévu
        </strong>

        <br><br>

        Fiche enrichie :
        <strong>199 € HT par an</strong>.

        <br><br>

        Publicité ponctuelle :
        <strong>50 € HT</strong>.
      </div>

      <div
        id="visibilityForm"
        style="margin-top:12px;">

        <label style="display:block;font-weight:900;">
          Nom de l’entreprise
        </label>

        <input
          id="visibilityCompanyName"
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
          Activité principale
        </label>

        <input
          id="visibilityActivity"
          class="miniField"
          type="text"
          value="${escapeValue(saved.activity || "")}"
          placeholder="Exemple : installation électrique">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Présentation
        </label>

        <textarea
          id="visibilityPresentation"
          class="miniField"
          style="min-height:100px;"
          placeholder="Présentez votre entreprise.">${escapeValue(saved.presentation || "")}</textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Savoir-faire
        </label>

        <textarea
          id="visibilityKnowHow"
          class="miniField"
          style="min-height:90px;"
          placeholder="Décrivez ce qui vous distingue.">${escapeValue(saved.knowHow || "")}</textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Services proposés
        </label>

        <textarea
          id="visibilityServices"
          class="miniField"
          style="min-height:90px;"
          placeholder="Indiquez vos principaux services.">${escapeValue(saved.services || "")}</textarea>

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Site internet
        </label>

        <input
          id="visibilityWebsite"
          class="miniField"
          type="url"
          value="${escapeValue(saved.website || "")}"
          placeholder="https://">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Téléphone
        </label>

        <input
          id="visibilityPhone"
          class="miniField"
          type="tel"
          value="${escapeValue(saved.phone || "")}"
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
          id="visibilityEmail"
          class="miniField"
          type="email"
          value="${escapeValue(saved.email || "")}"
          placeholder="Adresse e-mail professionnelle">

        <div class="box" style="margin-top:12px;">
          <strong>Choisir les services visibles</strong>

          <label class="miniCheck">
            <input
              id="visibilityQuoteEnabled"
              type="checkbox"
              ${saved.quoteEnabled ? "checked" : ""}>

            <span>
              Autoriser les demandes de devis
            </span>
          </label>

          <label class="miniCheck">
            <input
              id="visibilityRecruitmentEnabled"
              type="checkbox"
              ${saved.recruitmentEnabled ? "checked" : ""}>

            <span>
              Afficher les recrutements en cours
            </span>
          </label>

          <label class="miniCheck">
            <input
              id="visibilityPatronageEnabled"
              type="checkbox"
              ${saved.patronageEnabled ? "checked" : ""}>

            <span>
              Afficher les engagements en mécénat
            </span>
          </label>

          <label class="miniCheck">
            <input
              id="visibilityNewsEnabled"
              type="checkbox"
              ${saved.newsEnabled ? "checked" : ""}>

            <span>
              Afficher les actualités de l’entreprise
            </span>
          </label>
        </div>

        <button
          id="visibilitySaveBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;margin-top:12px;">
          Enregistrer ma fiche
        </button>

        <button
          id="visibilityPreviewBtn"
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
          id="visibilityStatus"
          class="muted"
          style="margin-top:10px;">
        </div>
      </div>
    `;
  }

  function saveVisibilityForm(){
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

    if(email && !email.includes("@")){
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

      newsEnabled:
        !!(
          getElement("visibilityNewsEnabled") &&
          getElement("visibilityNewsEnabled").checked
        ),

      updatedAt:Date.now(),
      updatedAtFr:
        new Date().toLocaleString("fr-FR")
    };

    saveVisibilityData(data);

    const status =
      getElement("visibilityStatus");

    if(status){
      status.textContent =
        "Fiche enregistrée le " +
        data.updatedAtFr +
        ".";
    }

    alert(
      "Votre fiche a été enregistrée dans la démonstration."
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
        "Enregistrez d’abord votre fiche."
      );
      return;
    }

    const actions = [];

    if(data.quoteEnabled){
      actions.push(
        `<button class="choiceBtn" type="button">
          Demander un devis
        </button>`
      );
    }

    if(data.recruitmentEnabled){
      actions.push(
        `<button
          class="choiceBtn"
          id="visibilityPreviewEmploymentBtn"
          type="button">
          Recrutements en cours
        </button>`
      );
    }

    if(data.patronageEnabled){
      actions.push(
        `<button
          class="choiceBtn"
          id="visibilityPreviewPatronageBtn"
          type="button">
          Engagement en mécénat
        </button>`
      );
    }

    module.renderModal(
      data.companyName,
      `
        <div
          class="box"
          style="border-left:6px solid #2f5d46;">

          <strong style="font-size:18px;">
            ${escapeValue(data.companyName)}
          </strong>

          <br><br>

          <strong>
            ${escapeValue(data.activity)}
          </strong>
        </div>

        <div class="box">
          ${escapeValue(data.presentation)}
        </div>

        ${
          data.knowHow
            ? `
              <div class="box">
                <strong>Savoir-faire</strong><br><br>
                ${escapeValue(data.knowHow)}
              </div>
            `
            : ""
        }

        ${
          data.services
            ? `
              <div class="box">
                <strong>Services proposés</strong><br><br>
                ${escapeValue(data.services)}
              </div>
            `
            : ""
        }

        ${
          data.phone || data.email || data.website
            ? `
              <div class="box">
                <strong>Contact</strong><br><br>

                ${
                  data.phone
                    ? "Téléphone : " +
                      escapeValue(data.phone) +
                      "<br>"
                    : ""
                }

                ${
                  data.email
                    ? "E-mail : " +
                      escapeValue(data.email) +
                      "<br>"
                    : ""
                }

                ${
                  data.website
                    ? "Site internet : " +
                      escapeValue(data.website)
                    : ""
                }
              </div>
            `
            : ""
        }

        ${
          actions.length
            ? `
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${actions.join("")}
              </div>
            `
            : ""
        }
      `
    );

    window.setTimeout(function(){
      const employmentButton =
        getElement("visibilityPreviewEmploymentBtn");

      const patronageButton =
        getElement("visibilityPreviewPatronageBtn");

      if(employmentButton){
        employmentButton.onclick = function(){
          module.openScreen("emploi");
        };
      }

      if(patronageButton){
        patronageButton.onclick = function(){
          module.openScreen("mecenat");
        };
      }
    },0);
  }

  function bindVisibility(){
    const directoryButton =
      getElement("visibilityDirectoryBtn");

    const advertisementButton =
      getElement("visibilityAdvertisementBtn");

    const editButton =
      getElement("visibilityEditCardBtn");

    const saveButton =
      getElement("visibilitySaveBtn");

    const previewButton =
      getElement("visibilityPreviewBtn");

    if(directoryButton){
      directoryButton.onclick = function(){
        module.openScreen("annuaire");
      };
    }

    if(advertisementButton){
      advertisementButton.onclick = function(){
        if(typeof window.openTicker === "function"){
          window.openTicker();
        }else{
          alert(
            "Le calendrier publicitaire est momentanément indisponible."
          );
        }
      };
    }

    if(editButton){
      editButton.onclick = function(){
        const form =
          getElement("visibilityForm");

        if(form){
          form.scrollIntoView({
            behavior:"smooth",
            block:"start"
          });
        }
      };
    }

    if(saveButton){
      saveButton.onclick =
        saveVisibilityForm;
    }

    if(previewButton){
      previewButton.onclick =
        openVisibilityPreview;
    }

    const saved =
      loadVisibilityData();

    const status =
      getElement("visibilityStatus");

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
          <div class="box">
            Aucune proposition disponible.
          </div>
        `;

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:18px;">
          Comparez, choisissez, validez
        </strong>

        <br><br>

        Recevez des propositions claires
        avant de prendre votre décision.
      </div>

      <div class="box">
        <strong>Bo'CitéArt organise</strong><br><br>

        Bo'CitéArt prépare la consultation,
        centralise les réponses et présente
        les différentes solutions reçues.

        <br><br>

        L’entreprise compare et décide.
      </div>

      <div class="box">
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

      <div class="box">
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

  module.openVisibilityPreview =
    openVisibilityPreview;

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
      getSustainabilityHtml()
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

        <strong style="font-size:18px;">
          Savez-vous à qui et à quoi sert le mécénat ?
        </strong>

        <br><br>

        Beaucoup d’entreprises connaissent peu le mécénat,
        n’y pensent jamais ou imaginent qu’il est réservé
        aux grandes entreprises.

        <br><br>

        Pourtant, il est accessible à toutes,
        quelle que soit leur taille.
      </div>

      <div class="box">
        <strong>
          Le mécénat permet de soutenir un projet utile
        </strong>

        <br><br>

        Il peut concerner :

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
          Il permet aussi de faire connaître l’entreprise autrement
        </strong>

        <br><br>

        La première chose à comprendre,
        c’est que les habitants doivent savoir
        que votre entreprise existe,
        ce qu’elle fait et où elle se trouve.

        <br><br>

        L’emploi est l’un des exemples les plus parlants.

        <br><br>

        Lorsqu’une personne connaît déjà votre activité,
        vos métiers et votre présence dans la ville,
        elle peut plus facilement penser à vous,
        parler de vous ou envisager de vous rejoindre.
      </div>

      <div class="box">
        <strong>
          Une présence discrète mais durable
        </strong>

        <br><br>

        Lorsqu’une entreprise participe à un projet,
        un remerciement rappelle sa contribution.

        <br><br>

        Le mécénat est encadré.
        Il ne s’agit pas d’une publicité classique.

        <br><br>

        Mais cette présence contribue progressivement
        à construire une image forte,
        locale et durable.
      </div>

      <div class="box">
        <strong>
          Un simple geste peut produire plusieurs effets
        </strong>

        <br><br>

        • améliorer la connaissance de l’entreprise ;<br>
        • renforcer la confiance ;<br>
        • développer le bouche-à-oreille ;<br>
        • valoriser les salariés ;<br>
        • faciliter de futurs recrutements ;<br>
        • montrer l’engagement local ;<br>
        • associer l’entreprise à un projet utile.
      </div>

      <div class="box">
        <strong>
          Le retour sur investissement est souvent indirect
        </strong>

        <br><br>

        Il ne se mesure pas uniquement en chiffre d’affaires immédiat.

        <br><br>

        Il se construit avec le temps,
        par la réputation, la confiance,
        la reconnaissance et les liens créés
        dans la ville.
      </div>

      <div class="box">
        <strong>
          Un avantage fiscal peut exister
        </strong>

        <br><br>

        Sous certaines conditions,
        le mécénat peut ouvrir droit
        à des avantages fiscaux prévus par la loi.

        <br><br>

        Ces règles peuvent évoluer.

        <br><br>

        Votre expert-comptable vous précisera
        les conditions applicables à votre entreprise.
      </div>

      <div class="box">
        <strong>
          Bo'CitéArt fait le lien
        </strong>

        <br><br>

        Bo'CitéArt peut présenter les projets disponibles,
        enregistrer les entreprises intéressées
        et suivre les engagements.

        <br><br>

        Le dirigeant conserve la maîtrise
        de sa décision.
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
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
        style="margin-top:14px;">

        <strong style="font-size:17px;">
          Préparer ma participation
        </strong>

        <br><br>

        Cet espace reste réservé à l’entreprise.
      </div>

      <label style="display:block;font-weight:900;">
        Nom de l’entreprise
      </label>

      <input
        id="mecenatCompanyName"
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
        Montant envisagé, si contribution financière
      </label>

      <input
        id="mecenatContributionAmount"
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
        Compétences que vous pourriez proposer
      </label>

      <textarea
        id="mecenatSkillsDescription"
        class="miniField"
        style="min-height:90px;"
        placeholder="Exemple : communication, bâtiment, informatique, logistique.">${escapeValue(saved.skillsDescription || "")}</textarea>

      <label
        style="
          display:block;
          margin-top:10px;
          font-weight:900;
        ">
        Matériel ou produits que vous pourriez fournir
      </label>

      <textarea
        id="mecenatMaterialDescription"
        class="miniField"
        style="min-height:90px;"
        placeholder="Décrivez ce que vous pourriez mettre à disposition.">${escapeValue(saved.materialDescription || "")}</textarea>

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
        value="${escapeValue(saved.selectedProject || "")}"
        placeholder="Nom du projet choisi">

      <div class="box" style="margin-top:12px;">
        <label class="miniCheck">
          <input
            id="mecenatVisibilityAccepted"
            type="checkbox"
            ${saved.visibilityAccepted ? "checked" : ""}>

          <span>
            J’accepte que l’entreprise soit remerciée
            dans le cadre autorisé du projet.
          </span>
        </label>

        <label class="miniCheck">
          <input
            id="mecenatAccountantContacted"
            type="checkbox"
            ${saved.accountantContacted ? "checked" : ""}>

          <span>
            J’ai demandé ou je demanderai conseil
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
        placeholder="Indiquez ici vos questions ou vos conditions.">${escapeValue(saved.notes || "")}</textarea>

      <button
        id="mecenatSaveBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:12px;">
        Enregistrer ma réflexion
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
      getMecenatHtml()
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
   BO'CITÉART — CORRECTIF RECHERCHE PROFESSIONNELLE
   COMMUNE • FRANCE • EUROPE
   ========================================================= */

(function patchBociteEntrepriseDirectory(){

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

  const ACCOUNT_CITY_KEY =
    "bociteart_current_city";

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
        "Lecture de l’abonnement de recherche impossible :",
        error
      );
    }

    return {
      plan:"commune",
      active:true,
      billingMode:"",
      nextBillingDate:"",
      invoiceNumber:"",
      updatedAtFr:""
    };
  }

  function saveSearchPlan(data){
    try{
      localStorage.setItem(
        SEARCH_PLAN_KEY,
        JSON.stringify(data)
      );
    }catch(error){
      console.warn(
        "Enregistrement de l’abonnement impossible :",
        error
      );
    }
  }

  function getAccountCity(){
    return (
      localStorage.getItem(ACCOUNT_CITY_KEY) ||
      window.BOCITEART_CURRENT_CITY ||
      "Wattignies"
    );
  }

  function getSearchHtml(){
    const accountCity =
      getAccountCity();

    const plan =
      loadSearchPlan();

    return `
      <style>
        .professionalSearchPlan {
          display:block;
          width:100%;
          padding:12px;
          margin-top:8px;
          border:2px solid #2f5d46;
          border-radius:10px;
          background:#fffaf1;
          color:#111;
          text-align:left;
          cursor:pointer;
        }

        .professionalSearchPlan.active {
          outline:3px solid rgba(47,93,70,.22);
          background:#f2f8f3;
        }

        .professionalSearchPrice {
          display:block;
          margin-top:5px;
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
          Rechercher une entreprise ou une compétence
        </strong>

        <br><br>

        Recherchez un artisan, une entreprise,
        un fournisseur, un sous-traitant,
        une profession libérale ou un partenaire.

        <br><br>

        La recherche dans votre commune est incluse.

        <br><br>

        Les recherches élargies à la France
        et à l’Europe nécessitent un abonnement professionnel.
      </div>

      <label style="display:block;font-weight:900;">
        Que recherchez-vous ?
      </label>

      <input
        id="professionalSearchKeyword"
        class="miniField"
        type="search"
        placeholder="Exemple : carreleur, électricien, avocat, transporteur">

      <label
        style="
          display:block;
          margin-top:12px;
          font-weight:900;
        ">
        Zone de recherche
      </label>

      <button
        class="professionalSearchPlan active"
        type="button"
        data-search-zone="commune">

        <strong>
          Ma commune
        </strong>

        <span class="professionalSearchPrice">
          Inclus dans l’espace professionnel
        </span>

        <span class="muted">
          Commune du compte :
          ${escapeValue(accountCity)}
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
            ? `<span class="professionalSearchLocked">
                 Abonnement
               </span>`
            : ""
        }

        <span class="professionalSearchPrice">
          26,50 € HT par mois
          ou 300 € HT par an
        </span>

        <span class="muted">
          Recherche par commune, département,
          région ou dans toute la France.
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
            ? `<span class="professionalSearchLocked">
                 Abonnement
               </span>`
            : ""
        }

        <span class="professionalSearchPrice">
          44,90 € HT par mois
          ou 500 € HT par an
        </span>

        <span class="muted">
          Recherche de fournisseurs,
          partenaires et sous-traitants
          dans les pays européens disponibles.
        </span>
      </button>

      <div
        id="professionalFranceFields"
        style="display:none;margin-top:12px;">

        <label style="display:block;font-weight:900;">
          Commune, département ou région
        </label>

        <input
          id="professionalFranceLocation"
          class="miniField"
          type="text"
          placeholder="Exemple : Lille, Gironde, Bretagne">

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Périmètre
        </label>

        <select
          id="professionalFranceScope"
          class="miniField">

          <option value="commune">
            Commune indiquée
          </option>

          <option value="20">
            Dans un rayon de 20 km
          </option>

          <option value="50">
            Dans un rayon de 50 km
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

        <label
          style="
            display:block;
            margin-top:10px;
            font-weight:900;
          ">
          Ville ou région
        </label>

        <input
          id="professionalEuropeLocation"
          class="miniField"
          type="text"
          placeholder="Exemple : Bruxelles, Lombardie, Barcelone">
      </div>

      <button
        id="professionalSearchBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;margin-top:14px;">
        Rechercher
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

    const subscription =
      getElement("professionalSubscriptionBox");

    if(results){
      results.innerHTML = "";
    }

    if(subscription){
      subscription.style.display = "none";
      subscription.innerHTML = "";
    }
  }

  function hasAccessToZone(zone){
    const plan =
      loadSearchPlan();

    if(zone === "commune"){
      return true;
    }

    if(zone === "france"){
      return (
        plan.active &&
        (
          plan.plan === "france" ||
          plan.plan === "europe"
        )
      );
    }

    if(zone === "europe"){
      return (
        plan.active &&
        plan.plan === "europe"
      );
    }

    return false;
  }

  function getSubscriptionHtml(zone){
    const isEurope =
      zone === "europe";

    const title =
      isEurope
        ? "Recherche professionnelle Europe"
        : "Recherche professionnelle France";

    const monthly =
      isEurope
        ? "44,90 € HT par mois"
        : "26,50 € HT par mois";

    const annual =
      isEurope
        ? "500 € HT par an"
        : "300 € HT par an";

    return `
      <div
        class="box"
        style="border-left:6px solid #b00020;">

        <strong style="font-size:18px;">
          ${title}
        </strong>

        <br><br>

        Cette recherche élargie nécessite
        un abonnement professionnel actif.

        <br><br>

        <strong>${monthly}</strong>

        <br>

        ou

        <br>

        <strong>${annual}</strong>

        <br><br>

        L’abonnement comprend :

        <br><br>

        • les recherches illimitées dans la zone choisie ;<br>
        • la recherche par métier, activité ou service ;<br>
        • l’accès aux fiches professionnelles disponibles ;<br>
        • les favoris ;<br>
        • l’historique des recherches ;<br>
        • les factures automatiques ;<br>
        • les rappels avant renouvellement.

        <br><br>

        La recherche dans la commune du compte
        reste toujours accessible.
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

    const monthlyButton =
      getElement("professionalMonthlySubscribeBtn");

    const annualButton =
      getElement("professionalAnnualSubscribeBtn");

    if(monthlyButton){
      monthlyButton.onclick = function(){
        activateDemoSubscription(
          zone,
          "mensuel"
        );
      };
    }

    if(annualButton){
      annualButton.onclick = function(){
        activateDemoSubscription(
          zone,
          "annuel"
        );
      };
    }

    host.scrollIntoView({
      behavior:"smooth",
      block:"nearest"
    });
  }

  function activateDemoSubscription(zone, billingMode){
    const now =
      new Date();

    const nextDate =
      new Date(now);

    if(billingMode === "annuel"){
      nextDate.setFullYear(
        nextDate.getFullYear() + 1
      );
    }else{
      nextDate.setMonth(
        nextDate.getMonth() + 1
      );
    }

    const plan = {
      plan:zone,
      active:true,
      billingMode:billingMode,
      nextBillingDate:
        nextDate.toISOString().slice(0,10),
      invoiceNumber:
        "DEMO-RECH-" + Date.now(),
      updatedAtFr:
        now.toLocaleString("fr-FR")
    };

    saveSearchPlan(plan);

    alert(
      "Abonnement de démonstration activé.\n\n" +
      "Dans la version définitive, le paiement, " +
      "la facture et les rappels seront automatiques."
    );

    module.openScreen("annuaire");
  }

  function getSearchLocation(zone){
    if(zone === "commune"){
      return getAccountCity() + ", France";
    }

    if(zone === "france"){
      const input =
        getElement("professionalFranceLocation");

      const value =
        input
          ? String(input.value || "").trim()
          : "";

      return value
        ? value + ", France"
        : "France";
    }

    const country =
      getElement("professionalEuropeCountry");

    const location =
      getElement("professionalEuropeLocation");

    const countryValue =
      country
        ? String(country.value || "").trim()
        : "";

    const locationValue =
      location
        ? String(location.value || "").trim()
        : "";

    return locationValue
      ? locationValue + ", " + countryValue
      : countryValue;
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
        "La localisation demandée est indisponible."
      );
    }

    const results =
      await response.json();

    if(
      !Array.isArray(results) ||
      !results.length
    ){
      throw new Error(
        "La commune ou la zone indiquée est introuvable."
      );
    }

    return results[0];
  }

  function getSearchRadius(zone){
    if(zone === "commune"){
      return 7000;
    }

    if(zone === "france"){
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
        return 80000;
      }

      if(value === "region"){
        return 180000;
      }

      if(value === "france"){
        return 500000;
      }

      return 10000;
    }

    return 80000;
  }

  function buildOverpassQuery(lat, lng, radius){
    return `
      [out:json][timeout:35];
      (
        node["name"](around:${radius},${lat},${lng});
        way["name"](around:${radius},${lat},${lng});
        relation["name"](around:${radius},${lat},${lng});
      );
      out center tags 300;
    `;
  }

  async function fetchProfessionalPlaces(lat, lng, radius){
    const servers = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter"
    ];

    const query =
      buildOverpassQuery(
        lat,
        lng,
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
        "La recherche professionnelle est temporairement indisponible."
      )
    );
  }

  function elementMatchesKeyword(element, keyword){
    const tags =
      element.tags || {};

    const searchable = [
      tags.name,
      tags.brand,
      tags.operator,
      tags.shop,
      tags.craft,
      tags.office,
      tags.industry,
      tags.description,
      tags["contact:website"],
      tags.website
    ]
      .filter(Boolean)
      .join(" ");

    return normalizeText(searchable)
      .includes(
        normalizeText(keyword)
      );
  }

  function formatActivity(tags){
    return (
      tags.craft ||
      tags.shop ||
      tags.office ||
      tags.industry ||
      tags.description ||
      "Activité professionnelle"
    );
  }

  function renderSearchResults(elements, keyword, location){
    const host =
      getElement("professionalSearchResults");

    if(!host){
      return;
    }

    const matches =
      elements
        .filter(function(element){
          return elementMatchesKeyword(
            element,
            keyword
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

          n’a été trouvée dans la zone :

          <br><br>

          <strong>
            ${escapeValue(location)}
          </strong>

          <br><br>

          Vous pouvez modifier le métier recherché
          ou élargir la zone de recherche.
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

        Recherche :
        ${escapeValue(keyword)}

        <br>

        Zone :
        ${escapeValue(location)}
      </div>

      ${
        matches.map(function(element){
          const tags =
            element.tags || {};

          const name =
            tags.name ||
            tags.brand ||
            tags.operator ||
            "Entreprise";

          const activity =
            formatActivity(tags);

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
                ${escapeValue(activity)}
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
                    Site :
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

    const status =
      getElement("professionalSearchStatus");

    const results =
      getElement("professionalSearchResults");

    const keyword =
      keywordInput
        ? String(keywordInput.value || "").trim()
        : "";

    const zone =
      getCurrentZone();

    if(!keyword){
      alert(
        "Indiquez le métier, l’activité ou le service recherché."
      );
      return;
    }

    if(!hasAccessToZone(zone)){
      showSubscription(zone);
      return;
    }

    const location =
      getSearchLocation(zone);

    if(!location){
      alert(
        "Indiquez la commune ou la zone de recherche."
      );
      return;
    }

    if(status){
      status.textContent =
        "Recherche de la zone en cours…";
    }

    if(results){
      results.innerHTML = "";
    }

    try{
      const geo =
        await geocodeLocation(location);

      const lat =
        Number(geo.lat);

      const lng =
        Number(geo.lon);

      if(
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ){
        throw new Error(
          "Les coordonnées de la zone sont indisponibles."
        );
      }

      if(status){
        status.textContent =
          "Recherche des entreprises en cours…";
      }

      const radius =
        getSearchRadius(zone);

      const elements =
        await fetchProfessionalPlaces(
          lat,
          lng,
          radius
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

            ${
              escapeValue(
                error.message ||
                "Veuillez recommencer dans quelques instants."
              )
            }
          </div>
        `;
      }
    }
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

    const keywordInput =
      getElement("professionalSearchKeyword");

    if(searchButton){
      searchButton.onclick =
        runProfessionalSearch;
    }

    if(keywordInput){
      keywordInput.addEventListener(
        "keydown",
        function(event){
          if(event.key === "Enter"){
            event.preventDefault();
            runProfessionalSearch();
          }
        }
      );
    }
  }

  function openProfessionalDirectory(){
    module.renderModal(
      "Recherche professionnelle",
      getSearchHtml()
    );

    window.setTimeout(function(){
      bindProfessionalSearch();
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

  console.log(
    "✅ Recherche professionnelle Commune • France • Europe chargée"
  );

})();

/* =========================================================
   BO'CITÉART — CORRECTIF OPPORTUNITÉS DE MUTUALISATION
   ========================================================= */

(function patchBociteEntrepriseMutualisation(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const MUTUALISATION_KEY =
    "bociteart_entreprise_mutualisation_v3";

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
        label:"Mutuelle collective",
        count:8,
        target:30,
        interested:false
      },

      flotte:{
        label:"Flotte automobile",
        count:7,
        target:20,
        interested:false
      },

      carburant:{
        label:"Cartes carburant",
        count:11,
        target:25,
        interested:false
      },

      maintenance:{
        label:"Contrats de maintenance",
        count:6,
        target:20,
        interested:false
      },

      dechets:{
        label:"Collecte et traitement des déchets",
        count:5,
        target:20,
        interested:false
      },

      alarmes:{
        label:"Alarmes et télésurveillance",
        count:9,
        target:20,
        interested:false
      },

      controles:{
        label:"Vérifications réglementaires",
        count:4,
        target:20,
        interested:false
      },

      formation:{
        label:"Formations professionnelles communes",
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
          d’accepter ou non une offre.
        </strong>
      </div>

      <div class="box">
        <strong>
          Le rôle de Bo'CitéArt
        </strong>

        <br><br>

        Bo'CitéArt ne vend aucun contrat,
        ne recommande aucun fournisseur
        et ne devient pas un groupement d’achat.

        <br><br>

        Son rôle consiste uniquement à :

        <br><br>

        • recueillir l’intérêt des entreprises ;<br>
        • identifier les besoins communs ;<br>
        • organiser une consultation ;<br>
        • centraliser les propositions reçues ;<br>
        • présenter les résultats clairement.

        <br><br>

        Le contrat éventuel reste conclu directement
        entre l’entreprise et le prestataire retenu.
      </div>

      <div class="box">
        <strong>
          Quels postes peuvent être mutualisés ?
        </strong>

        <br><br>

        La mutualisation concerne uniquement
        des charges et prestations professionnelles
        communes à plusieurs entreprises.

        <br><br>

        Bo'CitéArt ne propose pas l’achat groupé
        de marchandises destinées à la revente.
      </div>

      <div
        id="mutualisationCorrectedList"
        style="margin-top:12px;">
      </div>

      <div class="box" style="margin-top:14px;">
        <strong>
          Vous avez identifié une autre charge commune ?
        </strong>

        <br><br>

        Proposez-la.

        <br><br>

        Elle ne sera étudiée que si elle correspond
        à une dépense professionnelle récurrente
        pouvant concerner plusieurs entreprises.
      </div>

      <input
        id="mutualisationCorrectedTitle"
        class="miniField"
        type="text"
        placeholder="Exemple : entretien des véhicules">

      <textarea
        id="mutualisationCorrectedDescription"
        class="miniField"
        style="min-height:90px;margin-top:8px;"
        placeholder="Expliquez brièvement la charge ou la prestation concernée.">
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
        style="margin-top:14px;border-left:6px solid #b00020;">

        <strong>
          Votre clic ne constitue pas un engagement
        </strong>

        <br><br>

        Il indique uniquement votre intérêt.

        <br><br>

        Vous pourrez consulter les propositions reçues
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

            <div class="muted" style="margin-top:6px;">
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
      "Vous resterez libre d’accepter ou non " +
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
        "Indiquez la charge ou la prestation concernée."
      );
      return;
    }

    if(!description){
      alert(
        "Expliquez brièvement votre proposition."
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
      "Elle sera étudiée uniquement si elle correspond " +
      "à une charge professionnelle commune."
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
            <div class="box" style="margin-top:8px;">
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
      getHtml()
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
    "✅ Opportunités de mutualisation corrigées"
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
   BO'CITÉART — GESTION DES ABONNEMENTS DE RECHERCHE
   RAPPELS J-7 • J-3 • FACTURES • SUSPENSION
   ========================================================= */

(function addBociteSearchBillingManagement(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Entreprise : module principal introuvable."
    );
    return;
  }

  const PLAN_KEY =
    "bociteart_entreprise_search_plan_v1";

  const INVOICE_KEY =
    "bociteart_entreprise_search_invoices_v1";

  const ALERT_KEY =
    "bociteart_entreprise_search_alerts_v1";

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

  function loadAlerts(){
    try{
      const raw =
        localStorage.getItem(ALERT_KEY);

      const parsed =
        raw ? JSON.parse(raw) : {};

      return parsed &&
        typeof parsed === "object"
          ? parsed
          : {};
    }catch(error){
      return {};
    }
  }

  function saveAlerts(data){
    try{
      localStorage.setItem(
        ALERT_KEY,
        JSON.stringify(data || {})
      );
    }catch(error){}
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

  function getPlanPrice(planName, billingMode){
    if(planName === "europe"){
      return billingMode === "annuel"
        ? 500
        : 44.90;
    }

    if(planName === "france"){
      return billingMode === "annuel"
        ? 300
        : 26.50;
    }

    return 0;
  }

  function formatDate(dateValue){
    if(!dateValue){
      return "Non renseignée";
    }

    const date =
      new Date(dateValue + "T12:00:00");

    if(Number.isNaN(date.getTime())){
      return dateValue;
    }

    return date.toLocaleDateString("fr-FR");
  }

  function daysUntil(dateValue){
    if(!dateValue){
      return null;
    }

    const today =
      new Date();

    today.setHours(0,0,0,0);

    const target =
      new Date(dateValue + "T00:00:00");

    if(Number.isNaN(target.getTime())){
      return null;
    }

    return Math.ceil(
      (
        target.getTime() -
        today.getTime()
      ) /
      (
        1000 *
        60 *
        60 *
        24
      )
    );
  }

  function createInvoice(plan){
    if(
      !plan ||
      plan.plan === "commune"
    ){
      return null;
    }

    const invoices =
      loadInvoices();

    const price =
      getPlanPrice(
        plan.plan,
        plan.billingMode
      );

    const invoice = {
      id:
        "FACT-RECH-" +
        Date.now(),

      number:
        "BCA-RECH-" +
        new Date()
          .toISOString()
          .slice(0,10)
          .replace(/-/g,"") +
        "-" +
        String(
          invoices.length + 1
        ).padStart(4,"0"),

      plan:plan.plan,

      planLabel:
        getPlanLabel(plan.plan),

      billingMode:
        plan.billingMode,

      amountHT:price,

      vatRate:20,

      amountVAT:
        Number(
          (price * 0.20).toFixed(2)
        ),

      amountTTC:
        Number(
          (price * 1.20).toFixed(2)
        ),

      status:"paid",

      paymentMethod:
        "Carte bancaire — démonstration",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date().toLocaleString("fr-FR")
    };

    invoices.unshift(invoice);

    saveInvoices(invoices);

    plan.invoiceNumber =
      invoice.number;

    plan.lastInvoiceDate =
      new Date()
        .toISOString()
        .slice(0,10);

    savePlan(plan);

    return invoice;
  }

  function getNextBillingDate(billingMode){
    const date =
      new Date();

    if(billingMode === "annuel"){
      date.setFullYear(
        date.getFullYear() + 1
      );
    }else{
      date.setMonth(
        date.getMonth() + 1
      );
    }

    return date
      .toISOString()
      .slice(0,10);
  }

  function activateSearchSubscription(
    planName,
    billingMode
  ){
    const now =
      new Date();

    const plan = {
      plan:planName,
      active:true,
      paymentStatus:"paid",
      billingMode:billingMode,
      autoRenew:true,

      nextBillingDate:
        getNextBillingDate(
          billingMode
        ),

      cancellationRequested:false,
      suspendedAt:"",
      updatedAt:Date.now(),
      updatedAtFr:
        now.toLocaleString("fr-FR")
    };

    savePlan(plan);

    const invoice =
      createInvoice(plan);

    alert(
      getPlanLabel(planName) +
      " activée.\n\n" +
      "Montant : " +
      getPlanPrice(
        planName,
        billingMode
      )
        .toFixed(2)
        .replace(".",",") +
      " € HT.\n\n" +
      (
        invoice
          ? "Facture : " +
            invoice.number +
            "."
          : ""
      )
    );

    if(
      typeof module.openScreen === "function"
    ){
      module.openScreen("annuaire");
    }
  }

  function checkBillingStatus(){
    const plan =
      loadPlan();

    if(
      !plan ||
      plan.plan === "commune" ||
      !plan.nextBillingDate
    ){
      return;
    }

    const remaining =
      daysUntil(
        plan.nextBillingDate
      );

    if(remaining === null){
      return;
    }

    const alerts =
      loadAlerts();

    const alertBase =
      plan.plan +
      "-" +
      plan.nextBillingDate;

    if(
      remaining === 7 &&
      !alerts[alertBase + "-7"]
    ){
      alerts[alertBase + "-7"] = true;

      alert(
        "Rappel d’abonnement\n\n" +
        getPlanLabel(plan.plan) +
        " sera renouvelée dans 7 jours.\n\n" +
        "Échéance : " +
        formatDate(
          plan.nextBillingDate
        ) +
        "."
      );
    }

    if(
      remaining === 3 &&
      !alerts[alertBase + "-3"]
    ){
      alerts[alertBase + "-3"] = true;

      alert(
        "Second rappel d’abonnement\n\n" +
        getPlanLabel(plan.plan) +
        " sera renouvelée dans 3 jours.\n\n" +
        "Vérifiez que votre carte bancaire est toujours valide."
      );
    }

    if(
      remaining < 0 &&
      plan.paymentStatus !== "paid"
    ){
      plan.active = false;
      plan.paymentStatus = "suspended";
      plan.suspendedAt =
        new Date()
          .toISOString()
          .slice(0,10);

      savePlan(plan);

      if(!alerts[alertBase + "-suspended"]){
        alerts[alertBase + "-suspended"] = true;

        alert(
          "Option de recherche suspendue\n\n" +
          "Le paiement de l’abonnement n’a pas été confirmé.\n\n" +
          "La recherche locale reste accessible."
        );
      }
    }

    saveAlerts(alerts);
  }

  function getBillingHtml(){
    const plan =
      loadPlan();

    const invoices =
      loadInvoices();

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
        plan.plan === "commune"
          ? `
            <div class="box">
              La recherche dans votre commune
              est incluse dans votre espace professionnel.

              <br><br>

              Les recherches France et Europe
              nécessitent une option payante.
            </div>
          `
          : `
            <button
              id="searchBillingToggleRenewBtn"
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
      }

      <div
        style="
          margin-top:18px;
          font-size:18px;
          font-weight:900;
          color:#2f5d46;
        ">
        Mes factures
      </div>

      <div
        id="searchInvoiceList"
        style="margin-top:10px;">

        ${
          invoices.length
            ? invoices.map(function(invoice){
                return `
                  <div class="box">
                    <strong>
                      ${escapeValue(
                        invoice.number
                      )}
                    </strong>

                    <br><br>

                    ${escapeValue(
                      invoice.planLabel
                    )}

                    <br><br>

                    Montant HT :
                    <strong>
                      ${Number(
                        invoice.amountHT
                      )
                        .toFixed(2)
                        .replace(".",",")}
                      €
                    </strong>

                    <br>

                    TVA :
                    ${Number(
                      invoice.amountVAT
                    )
                      .toFixed(2)
                      .replace(".",",")}
                    €

                    <br>

                    Total TTC :
                    <strong>
                      ${Number(
                        invoice.amountTTC
                      )
                        .toFixed(2)
                        .replace(".",",")}
                      €
                    </strong>

                    <br><br>

                    Date :
                    ${escapeValue(
                      invoice.createdAtFr
                    )}

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
                      class="choiceBtn searchInvoiceDownloadBtn"
                      type="button"
                      data-invoice-id="${escapeValue(
                        invoice.id
                      )}"
                      style="
                        width:100%;
                        margin-top:10px;
                      ">
                      Télécharger la facture
                    </button>
                  </div>
                `;
              }).join("")
            : `
              <div class="box">
                Aucune facture disponible.
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
          Fonctionnement prévu
        </strong>

        <br><br>

        Un rappel est envoyé 7 jours avant l’échéance,
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
      loadInvoices().find(function(item){
        return item.id === invoiceId;
      });

    if(!invoice){
      alert(
        "Facture introuvable."
      );
      return;
    }

    const content =
      "BO'CITÉART\n" +
      "FACTURE DE DÉMONSTRATION\n\n" +

      "Facture : " +
      invoice.number +
      "\n" +

      "Date : " +
      invoice.createdAtFr +
      "\n\n" +

      "Service : " +
      invoice.planLabel +
      "\n" +

      "Périodicité : " +
      (
        invoice.billingMode === "annuel"
          ? "Annuelle"
          : "Mensuelle"
      ) +
      "\n\n" +

      "Montant HT : " +
      invoice.amountHT
        .toFixed(2)
        .replace(".",",") +
      " €\n" +

      "TVA 20 % : " +
      invoice.amountVAT
        .toFixed(2)
        .replace(".",",") +
      " €\n" +

      "Total TTC : " +
      invoice.amountTTC
        .toFixed(2)
        .replace(".",",") +
      " €\n\n" +

      "Statut : Payée\n\n" +

      "Document de démonstration — sans valeur comptable.";

    const blob =
      new Blob(
        [content],
        {
          type:
            "text/plain;charset=utf-8"
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      invoice.number + ".txt";

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
        "searchBillingToggleRenewBtn"
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
        ".searchInvoiceDownloadBtn"
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

  module.activateSearchSubscription =
    activateSearchSubscription;

  module.openSearchBilling =
    openBilling;

  module.checkSearchBillingStatus =
    checkBillingStatus;

  module.loadSearchInvoices =
    loadInvoices;

  window.setTimeout(function(){
    checkBillingStatus();
  },1000);

  console.log(
    "✅ Gestion des abonnements, rappels et factures chargée"
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

