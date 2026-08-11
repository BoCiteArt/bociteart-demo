/* =========================================================
   BO'CITÉART — ANNUAIRE DE VOTRE VILLE
   MODULE INDÉPENDANT COMPLET

   PUBLIC
   • Recherche locale
   • Classement par métiers
   • Fiches établissements
   • Téléphone / e-mail / site / itinéraire
   • Photos / menus / hébergements
   • Emploi / candidature spontanée
   • Appréciations locales sans commentaires
   • Historique
   • Consultés récemment
   • Favoris

   PROFESSIONNEL
   • Recherche professionnelle
   • Historique professionnel
   • Carnet professionnel
   • Entreprises suivies
   • Informations publiques enrichies
   • Sources et dates
   • Tableau de bord personnalisable
   • Bercy Infos Entreprises

   PARTENAIRE
   • Petit mot du chef / artisan / commerçant / hôte
   • Modification depuis l'espace privé uniquement

   IMPORTANT
   L'annuaire affiche les données disponibles.
   Il ne fabrique aucune entreprise et ne produit
   aucune notation financière automatique.
   ========================================================= */

(function initBociteEntrepriseAnnuaire(){

  "use strict";

  const module =
    window.BociteEntreprise =
    window.BociteEntreprise || {};

  const annuaire =
    module.Annuaire =
    module.Annuaire || {};

  /* =======================================================
     STOCKAGES
     ======================================================= */

  const STORAGE = {

    entities:
      "bociteart_annuaire_entities_v2",

    searchHistory:
      "bociteart_annuaire_search_history_v2",

    viewedHistory:
      "bociteart_annuaire_viewed_history_v2",

    favorites:
      "bociteart_annuaire_favorites_v2",

    ratings:
      "bociteart_annuaire_ratings_v2",

    professionalHistory:
      "bociteart_annuaire_professional_history_v2",

    notebook:
      "bociteart_annuaire_professional_notebook_v2",

    followed:
      "bociteart_annuaire_followed_v2",

    dashboardOrder:
      "bociteart_annuaire_dashboard_order_v2",

    partnerProfiles:
      "bociteart_annuaire_partner_profiles_v2",

    updateState:
      "bociteart_annuaire_update_state_v2"

  };

  annuaire.STORAGE =
    STORAGE;

  const MINIMUM_RATINGS =
    10;

  const MAX_SEARCH_HISTORY =
    150;

  const MAX_VIEW_HISTORY =
    150;

  /* =======================================================
     OUTILS
     ======================================================= */

  function loadJson(
    key,
    fallback
  ){

    try{

      const raw =
        localStorage.getItem(
          key
        );

      if(!raw){
        return fallback;
      }

      const parsed =
        JSON.parse(
          raw
        );

      return parsed == null
        ? fallback
        : parsed;

    }catch(error){

      console.warn(
        "Bo'CitéArt Annuaire : lecture impossible",
        key,
        error
      );

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
        "Bo'CitéArt Annuaire : enregistrement impossible",
        key,
        error
      );

      return false;
    }
  }

  function safeArray(
    value
  ){

    return Array.isArray(
      value
    )
      ? value
      : [];
  }

  function normalizeText(
    value
  ){

    return String(
      value == null
        ? ""
        : value
    )
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim();
  }

  function escapeHtml(
    value
  ){

    return String(
      value == null
        ? ""
        : value
    )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
  }

  function uniqueId(
    prefix
  ){

    return (
      String(
        prefix ||
        "id"
      ) +
      "_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2,10)
    );
  }

  function formatDate(
    timestamp
  ){

    if(!timestamp){
      return "";
    }

    try{

      return new Date(
        timestamp
      )
      .toLocaleDateString(
        "fr-FR"
      );

    }catch(error){

      return "";
    }
  }

  function formatDateTime(
    timestamp
  ){

    if(!timestamp){
      return "";
    }

    try{

      return new Date(
        timestamp
      )
      .toLocaleString(
        "fr-FR"
      );

    }catch(error){

      return "";
    }
  }

  function getElement(
    id
  ){

    return document.getElementById(
      id
    );
  }

  function getCurrentCommune(){

    let config = {};

    try{

      config =
        JSON.parse(
          localStorage.getItem(
            "bociteart_city_config_v1"
          ) || "{}"
        );

    }catch(error){

      config = {};
    }

    const city =
      String(
        config.cityName ||
        ""
      ).trim();

    if(city){
      return city;
    }

    const account =
      loadJson(
        "bociteart_account_demo_v1",
        {}
      );

    if(
      account &&
      account.commune
    ){

      return String(
        account.commune
      ).trim();
    }

    return "Wattignies";
  }

  function getCurrentPostalCode(){

    let config = {};

    try{

      config =
        JSON.parse(
          localStorage.getItem(
            "bociteart_city_config_v1"
          ) || "{}"
        );

    }catch(error){

      config = {};
    }

    return String(
      config.postalCode ||
      ""
    ).trim();
  }

  function getCurrentInseeCode(){

    let config = {};

    try{

      config =
        JSON.parse(
          localStorage.getItem(
            "bociteart_city_config_v1"
          ) || "{}"
        );

    }catch(error){

      config = {};
    }

    const direct =
      String(
        config.inseeCode ||
        ""
      ).trim();

    if(direct){
      return direct;
    }

    const known = {

      wattignies:
        "59648"

    };

    const key =
      normalizeText(
        config.citySlug ||
        config.cityName ||
        getCurrentCommune()
      )
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

    return known[key] || "";
  }

  function openModal(
    title,
    html
  ){

    if(
      typeof module.openModal ===
      "function"
    ){

      module.openModal(
        title,
        html
      );

      return;
    }

    if(
      typeof window.openModal ===
      "function"
    ){

      window.openModal(
        title,
        html
      );

      return;
    }

    alert(
      String(title || "") +
      "\n\n" +
      String(
        html ||
        ""
      )
      .replace(
        /<[^>]+>/g,
        " "
      )
    );
  }

  function render(
    title,
    html,
    afterRender
  ){

    openModal(
      title,
      `
        <div class="bociteAnnuaireRoot">
          ${html}
        </div>
      `
    );

    window.setTimeout(
      function(){

        injectStyles();

        if(
          typeof afterRender ===
          "function"
        ){
          afterRender();
        }

      },
      20
    );
  }

  /* =======================================================
     STYLE
     ======================================================= */

  function injectStyles(){

    if(
      document.getElementById(
        "bociteAnnuaireStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "bociteAnnuaireStyles";

    style.textContent = `

      .bociteAnnuaireRoot button.choiceBtn,
      .bociteAnnuaireRoot .choiceBtn{
        background:#ffffff !important;
        background-color:#ffffff !important;
        background-image:none !important;
      }

      .bociteAnnuaireRoot button.choiceBtn:hover,
      .bociteAnnuaireRoot button.choiceBtn:focus,
      .bociteAnnuaireRoot button.choiceBtn:active,
      .bociteAnnuaireRoot .choiceBtn:hover,
      .bociteAnnuaireRoot .choiceBtn:focus,
      .bociteAnnuaireRoot .choiceBtn:active{
        background:#ffffff !important;
        background-color:#ffffff !important;
        background-image:none !important;
      }

      .bociteAnnuaireTitle{
        color:#2f5d46;
        font-size:16px;
        line-height:1.35;
        font-weight:700;
      }

      .bociteAnnuaireText{
        color:#111;
        font-size:14px;
        line-height:1.45;
        font-weight:400;
      }

      .bociteAnnuaireGrid{
        display:grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap:8px;
      }

      .bociteAnnuaireActions{
        display:grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap:8px;
      }

      .bociteAnnuaireBadgeRow{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
        align-items:center;
      }

      .bociteAnnuaireResult{
        margin-bottom:10px;
      }

      .bociteAnnuaireSmall{
        color:#666;
        font-size:12px;
        line-height:1.4;
      }

      .bociteAnnuaireSignature{
        margin-top:12px;
        padding:15px;
        border-left:4px solid #2f5d46;
        background:#faf8f1;
        font-family:
          "Segoe Print",
          "Bradley Hand",
          "Comic Sans MS",
          cursive;
        font-style:italic;
        font-size:15px;
        line-height:1.55;
        color:#333;
      }

      .bociteAnnuairePhotoGrid{
        display:grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap:8px;
      }

      .bociteAnnuairePhotoGrid img{
        width:100%;
        aspect-ratio:1/1;
        object-fit:cover;
        border-radius:12px;
        border:1px solid #ddd;
      }

      .bociteAnnuaireStars{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
      }

      .bociteAnnuaireStars button{
        min-width:44px;
        min-height:44px;
      }

      @media(max-width:480px){

        .bociteAnnuaireGrid,
        .bociteAnnuaireActions{
          grid-template-columns:
            repeat(2,minmax(0,1fr));
        }

      }
    `;

    document.head.appendChild(
      style
    );
  }

  /* =======================================================
     CATÉGORIES
     ======================================================= */

  const CATEGORIES = [

    {
      id:"commerces",
      title:"Commerces",
      subtitle:
        "Boutiques • alimentation • proximité"
    },

    {
      id:"restaurants",
      title:"Restaurants",
      subtitle:
        "Restaurants • cafés • traiteurs"
    },

    {
      id:"artisans",
      title:"Artisans",
      subtitle:
        "Travaux • réparation • savoir-faire"
    },

    {
      id:"sante",
      title:"Santé",
      subtitle:
        "Médecins • soins • professionnels"
    },

    {
      id:"entreprises",
      title:"Entreprises",
      subtitle:
        "Industrie • services • compétences"
    },

    {
      id:"hebergements",
      title:"Hôtels & séjours",
      subtitle:
        "Hôtels • gîtes • hébergements"
    },

    {
      id:"services",
      title:"Services",
      subtitle:
        "Particuliers • professionnels"
    },

    {
      id:"metiers",
      title:"Tout voir par métier",
      subtitle:
        "Tous les métiers de votre ville"
    }

  ];

  /* =======================================================
     MÉTIERS
     ======================================================= */

  const METIERS = {

    sante:[

      "Médecins généralistes",
      "Infirmiers",
      "Kinésithérapeutes",
      "Dentistes",
      "Pharmacies",
      "Pédicures-podologues",
      "Orthophonistes",
      "Sages-femmes",
      "Psychologues",
      "Laboratoires d'analyses médicales",
      "Autres professionnels de santé"

    ],

    maison:[

      "Couvreurs",
      "Plombiers",
      "Électriciens",
      "Chauffagistes",
      "Menuisiers",
      "Maçons",
      "Peintres",
      "Carreleurs",
      "Paysagistes",
      "Serruriers",
      "Entreprises de rénovation"

    ],

    automobile:[

      "Garages automobiles",
      "Carrossiers",
      "Pneumatiques",
      "Contrôle technique",
      "Motos",
      "Cycles",
      "Véhicules utilitaires",
      "Poids lourds"

    ],

    alimentation:[

      "Restaurants",
      "Boulangeries",
      "Boucheries",
      "Traiteurs",
      "Cafés",
      "Épiceries",
      "Commerces alimentaires"

    ],

    professionnels:[

      "Experts-comptables",
      "Avocats",
      "Assurances",
      "Informatique",
      "Communication",
      "Transport",
      "Nettoyage professionnel",
      "Sécurité",
      "Bureaux d'études",
      "Conseil"

    ],

    hebergements:[

      "Hôtels",
      "Chambres d'hôtes",
      "Gîtes",
      "Locations de courte durée",
      "Autres hébergements"

    ]

  };

  /* =======================================================
     DONNÉES
     ======================================================= */

  function loadEntities(){

    return safeArray(
      loadJson(
        STORAGE.entities,
        []
      )
    );
  }

  function saveEntities(
    data
  ){

    return saveJson(
      STORAGE.entities,
      safeArray(
        data
      )
    );
  }

  function getEntityById(
    id
  ){

    return loadEntities()
      .find(
        function(entity){

          return (
            String(
              entity.id
            ) ===
            String(
              id
            )
          );
        }
      ) || null;
  }

  annuaire.loadEntities =
    loadEntities;

  annuaire.saveEntities =
    saveEntities;

  annuaire.getEntityById =
    getEntityById;

  /* =======================================================
     TEXTE DE RECHERCHE
     ======================================================= */

  function entitySearchText(
    entity
  ){

    return normalizeText(
      [
        entity.name,
        entity.kind,
        entity.category,
        entity.trade,
        entity.activity,
        entity.description,
        entity.commune,
        entity.postalCode,
        entity.address,
        safeArray(
          entity.services
        ).join(" "),
        safeArray(
          entity.keywords
        ).join(" ")
      ]
      .filter(Boolean)
      .join(" ")
    );
  }

  function searchEntities(
    query,
    options
  ){

    options =
      options || {};

    const clean =
      normalizeText(
        query
      );

    const commune =
      normalizeText(
        getCurrentCommune()
      );

    let rows =
      loadEntities();

    if(
      options.localOnly !==
      false
    ){

      rows =
        rows.filter(
          function(entity){

            return (
              normalizeText(
                entity.commune
              ) ===
              commune
            );
          }
        );
    }

    if(options.category){

      rows =
        rows.filter(
          function(entity){

            return (
              normalizeText(
                entity.category
              ) ===
              normalizeText(
                options.category
              )
            );
          }
        );
    }

    if(clean){

      rows =
        rows.filter(
          function(entity){

            return entitySearchText(
              entity
            ).includes(
              clean
            );
          }
        );
    }

    return rows.sort(
      function(a,b){

        return String(
          a.name ||
          ""
        )
        .localeCompare(
          String(
            b.name ||
            ""
          ),
          "fr",
          {
            sensitivity:"base"
          }
        );
      }
    );
  }

  /* =======================================================
     HISTORIQUE RECHERCHES
     ======================================================= */

  function loadSearchHistory(){

    return safeArray(
      loadJson(
        STORAGE.searchHistory,
        []
      )
    );
  }

  function addSearchHistory(
    query,
    commune
  ){

    const cleanQuery =
      String(
        query ||
        ""
      ).trim();

    if(!cleanQuery){
      return;
    }

    let history =
      loadSearchHistory();

    const normalized =
      normalizeText(
        cleanQuery
      );

    history =
      history.filter(
        function(item){

          return !(
            normalizeText(
              item.query
            ) ===
            normalized &&
            normalizeText(
              item.commune
            ) ===
            normalizeText(
              commune
            )
          );
        }
      );

    history.unshift({

      id:
        uniqueId(
          "search"
        ),

      query:
        cleanQuery,

      commune:
        commune ||
        getCurrentCommune(),

      createdAt:
        Date.now()

    });

    saveJson(
      STORAGE.searchHistory,
      history.slice(
        0,
        MAX_SEARCH_HISTORY
      )
    );
  }

  function removeSearchHistoryItem(
    id
  ){

    const history =
      loadSearchHistory()
      .filter(
        function(item){

          return (
            String(
              item.id
            ) !==
            String(
              id
            )
          );
        }
      );

    saveJson(
      STORAGE.searchHistory,
      history
    );
  }

  function clearSearchHistory(){

    saveJson(
      STORAGE.searchHistory,
      []
    );
  }

  /* =======================================================
     CONSULTÉS RÉCEMMENT
     ======================================================= */

  function loadViewedHistory(){

    return safeArray(
      loadJson(
        STORAGE.viewedHistory,
        []
      )
    );
  }

  function addViewedEntity(
    entity
  ){

    if(!entity){
      return;
    }

    let history =
      loadViewedHistory();

    history =
      history.filter(
        function(item){

          return (
            String(
              item.entityId
            ) !==
            String(
              entity.id
            )
          );
        }
      );

    history.unshift({

      id:
        uniqueId(
          "view"
        ),

      entityId:
        entity.id,

      name:
        entity.name,

      commune:
        entity.commune,

      viewedAt:
        Date.now()

    });

    saveJson(
      STORAGE.viewedHistory,
      history.slice(
        0,
        MAX_VIEW_HISTORY
      )
    );
  }

  function removeViewedHistoryItem(
    id
  ){

    const history =
      loadViewedHistory()
      .filter(
        function(item){

          return (
            String(
              item.id
            ) !==
            String(
              id
            )
          );
        }
      );

    saveJson(
      STORAGE.viewedHistory,
      history
    );
  }

  function clearViewedHistory(){

    saveJson(
      STORAGE.viewedHistory,
      []
    );
  }

  /* =======================================================
     FAVORIS
     ======================================================= */

  function loadFavorites(){

    return safeArray(
      loadJson(
        STORAGE.favorites,
        []
      )
    );
  }

  function isFavorite(
    entityId
  ){

    return loadFavorites()
      .some(
        function(item){

          return (
            String(
              item.entityId
            ) ===
            String(
              entityId
            )
          );
        }
      );
  }

  function toggleFavorite(
    entity
  ){

    if(!entity){
      return false;
    }

    let favorites =
      loadFavorites();

    const exists =
      favorites.some(
        function(item){

          return (
            String(
              item.entityId
            ) ===
            String(
              entity.id
            )
          );
        }
      );

    if(exists){

      favorites =
        favorites.filter(
          function(item){

            return (
              String(
                item.entityId
              ) !==
              String(
                entity.id
              )
            );
          }
        );

      saveJson(
        STORAGE.favorites,
        favorites
      );

      return false;
    }

    favorites.unshift({

      id:
        uniqueId(
          "favorite"
        ),

      entityId:
        entity.id,

      name:
        entity.name,

      commune:
        entity.commune,

      savedAt:
        Date.now()

    });

    saveJson(
      STORAGE.favorites,
      favorites
    );

    return true;
  }

  function removeFavorite(
    entityId
  ){

    const favorites =
      loadFavorites()
      .filter(
        function(item){

          return (
            String(
              item.entityId
            ) !==
            String(
              entityId
            )
          );
        }
      );

    saveJson(
      STORAGE.favorites,
      favorites
    );
  }

  function clearFavorites(){

    saveJson(
      STORAGE.favorites,
      []
    );
  }

  /* =======================================================
     APPRÉCIATIONS
     ======================================================= */

  function loadRatings(){

    const raw =
      loadJson(
        STORAGE.ratings,
        {}
      );

    return (
      raw &&
      typeof raw ===
      "object" &&
      !Array.isArray(raw)
    )
      ? raw
      : {};
  }

  function saveRatings(
    ratings
  ){

    saveJson(
      STORAGE.ratings,
      ratings || {}
    );
  }

  function getEntityRatings(
    entityId
  ){

    const ratings =
      loadRatings();

    return safeArray(
      ratings[
        entityId
      ]
    );
  }

  function getRatingSummary(
    entityId
  ){

    const rows =
      getEntityRatings(
        entityId
      );

    if(!rows.length){

      return {
        count:0,
        global:0,
        visible:false
      };
    }

    const total =
      rows.reduce(
        function(sum,item){

          return (
            sum +
            Number(
              item.rating ||
              0
            )
          );
        },
        0
      );

    const average =
      total /
      rows.length;

    return {
      count:
        rows.length,

      global:
        average,

      visible:
        rows.length >=
        MINIMUM_RATINGS
    };
  }

  function addRating(
    entityId,
    rating
  ){

    const clean =
      Number(
        rating
      );

    if(
      !Number.isFinite(
        clean
      ) ||
      clean < 1 ||
      clean > 5
    ){
      return false;
    }

    const ratings =
      loadRatings();

    const rows =
      safeArray(
        ratings[
          entityId
        ]
      );

    rows.unshift({

      id:
        uniqueId(
          "rating"
        ),

      rating:
        clean,

      createdAt:
        Date.now(),

      commune:
        getCurrentCommune(),

      verified:
        true

    });

    ratings[
      entityId
    ] =
      rows;

    saveRatings(
      ratings
    );

    return true;
  }

  /* =======================================================
     HISTORIQUE PRO
     ======================================================= */

  function loadProfessionalHistory(){

    return safeArray(
      loadJson(
        STORAGE.professionalHistory,
        []
      )
    );
  }

  function saveProfessionalHistory(
    rows
  ){

    saveJson(
      STORAGE.professionalHistory,
      safeArray(
        rows
      )
    );
  }

  function addProfessionalHistory(
    data
  ){

    const rows =
      loadProfessionalHistory();

    const item = {

      id:
        uniqueId(
          "prosearch"
        ),

      query:
        String(
          data.query ||
          ""
        ).trim(),

      details:
        String(
          data.details ||
          ""
        ).trim(),

      zone:
        data.zone ||
        "commune",

      status:
        "en_cours",

      createdAt:
        Date.now(),

      updatedAt:
        Date.now()

    };

    rows.unshift(
      item
    );

    saveProfessionalHistory(
      rows
    );

    return item;
  }

  function removeProfessionalHistoryItem(
    id
  ){

    const rows =
      loadProfessionalHistory()
      .filter(
        function(item){

          return (
            String(
              item.id
            ) !==
            String(
              id
            )
          );
        }
      );

    saveProfessionalHistory(
      rows
    );
  }

  function clearProfessionalHistory(){

    saveProfessionalHistory(
      []
    );
  }

  /* =======================================================
     CARNET PRO
     ======================================================= */

  function loadNotebook(){

    return safeArray(
      loadJson(
        STORAGE.notebook,
        []
      )
    );
  }

  function saveNotebook(
    rows
  ){

    saveJson(
      STORAGE.notebook,
      safeArray(
        rows
      )
    );
  }

  function addNotebookEntity(
    entity
  ){

    if(!entity){
      return;
    }

    let rows =
      loadNotebook();

    rows =
      rows.filter(
        function(item){

          return (
            String(
              item.entityId
            ) !==
            String(
              entity.id
            )
          );
        }
      );

    rows.unshift({

      id:
        uniqueId(
          "notebook"
        ),

      entityId:
        entity.id,

      name:
        entity.name,

      commune:
        entity.commune,

      savedAt:
        Date.now()

    });

    saveNotebook(
      rows
    );
  }

  function removeNotebookEntity(
    entityId
  ){

    const rows =
      loadNotebook()
      .filter(
        function(item){

          return (
            String(
              item.entityId
            ) !==
            String(
              entityId
            )
          );
        }
      );

    saveNotebook(
      rows
    );
  }

  function clearNotebook(){

    saveNotebook(
      []
    );
  }

  /* =======================================================
     ENTREPRISES SUIVIES
     ======================================================= */

  function loadFollowed(){

    return safeArray(
      loadJson(
        STORAGE.followed,
        []
      )
    );
  }

  function saveFollowed(
    rows
  ){

    saveJson(
      STORAGE.followed,
      safeArray(
        rows
      )
    );
  }

  function isFollowed(
    entityId
  ){

    return loadFollowed()
      .some(
        function(item){

          return (
            String(
              item.entityId
            ) ===
            String(
              entityId
            )
          );
        }
      );
  }

  function toggleFollowed(
    entity
  ){

    if(!entity){
      return false;
    }

    let rows =
      loadFollowed();

    const exists =
      rows.some(
        function(item){

          return (
            String(
              item.entityId
            ) ===
            String(
              entity.id
            )
          );
        }
      );

    if(exists){

      rows =
        rows.filter(
          function(item){

            return (
              String(
                item.entityId
              ) !==
              String(
                entity.id
              )
            );
          }
        );

      saveFollowed(
        rows
      );

      return false;
    }

    rows.unshift({

      id:
        uniqueId(
          "followed"
        ),

      entityId:
        entity.id,

      name:
        entity.name,

      commune:
        entity.commune,

      createdAt:
        Date.now()

    });

    saveFollowed(
      rows
    );

    return true;
  }

  /* =======================================================
     BADGES
     ======================================================= */

  function getBadgesHtml(
    entity
  ){

    const badges =
      [];

    if(
      entity.partner
    ){

      badges.push(
        `
          <span
            style="
              display:inline-block;
              padding:5px 8px;
              border-radius:999px;
              background:#2f5d46;
              color:#fff;
              font-size:11px;
              font-weight:700;
            ">
            Partenaire Bo'CitéArt
          </span>
        `
      );
    }

    if(
      entity.bocitecoins
    ){

      badges.push(
        `
          <span
            style="
              display:inline-block;
              padding:5px 8px;
              border-radius:999px;
              border:1px solid #2f5d46;
              color:#2f5d46;
              font-size:11px;
              font-weight:700;
            ">
            bocitecoins
          </span>
        `
      );
    }

    if(
      entity.recruiting
    ){

      badges.push(
        `
          <span
            style="
              display:inline-block;
              padding:5px 8px;
              border-radius:999px;
              border:1px solid #b91c1c;
              color:#b91c1c;
              font-size:11px;
              font-weight:700;
            ">
            Recrute
          </span>
        `
      );
    }

    if(!badges.length){
      return "";
    }

    return `
      <div class="bociteAnnuaireBadgeRow">
        ${badges.join("")}
      </div>
    `;
  }

  /* =======================================================
     OUVERTURE / HORAIRES
     ======================================================= */

  function getOpenStatus(
    entity
  ){

    const hours =
      entity &&
      entity.hours;

    if(
      !hours ||
      typeof hours !==
      "object"
    ){
      return "";
    }

    const now =
      new Date();

    const day =
      now.getDay();

    const days = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi"
    ];

    const key =
      days[day];

    const ranges =
      safeArray(
        hours[key]
      );

    if(!ranges.length){
      return "Fermé aujourd'hui";
    }

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes();

    const open =
      ranges.some(
        function(range){

          if(
            !range ||
            !range.start ||
            !range.end
          ){
            return false;
          }

          const startParts =
            String(
              range.start
            )
            .split(":");

          const endParts =
            String(
              range.end
            )
            .split(":");

          const start =
            Number(
              startParts[0]
            ) * 60 +
            Number(
              startParts[1] ||
              0
            );

          const end =
            Number(
              endParts[0]
            ) * 60 +
            Number(
              endParts[1] ||
              0
            );

          return (
            currentMinutes >=
            start &&
            currentMinutes <
            end
          );
        }
      );

    return open
      ? "Ouvert"
      : "Fermé";
  }

  /* =======================================================
     ITINÉRAIRE
     ======================================================= */

  function openRoute(
    address
  ){

    const clean =
      String(
        address ||
        ""
      ).trim();

    if(!clean){

      alert(
        "Adresse indisponible."
      );

      return;
    }

    window.open(
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        clean
      ),
      "_blank",
      "noopener"
    );
  }

  /* =======================================================
     CONTACT
     ======================================================= */

  function callPhone(
    phone
  ){

    const clean =
      String(
        phone ||
        ""
      )
      .replace(
        /[^\d+]/g,
        ""
      );

    if(!clean){
      return;
    }

    window.location.href =
      "tel:" +
      clean;
  }

  function sendEmail(
    email
  ){

    const clean =
      String(
        email ||
        ""
      ).trim();

    if(!clean){
      return;
    }

    window.location.href =
      "mailto:" +
      clean;
  }

  function openWebsite(
    website
  ){

    let clean =
      String(
        website ||
        ""
      ).trim();

    if(!clean){
      return;
    }

    if(
      !/^https?:\/\//i.test(
        clean
      )
    ){

      clean =
        "https://" +
        clean;
    }

    window.open(
      clean,
      "_blank",
      "noopener"
    );
  }

  /* =======================================================
     RECHERCHE SIMPLE
     ======================================================= */

  function launchSearch(
    query,
    options
  ){

    const cleanQuery =
      String(
        query ||
        ""
      ).trim();

    if(!cleanQuery){

      alert(
        "Indiquez un nom, un métier, un produit ou un service."
      );

      return;
    }

    options =
      options ||
      {};

    addSearchHistory(
      cleanQuery,
      getCurrentCommune()
    );

    /*
      Affichage immédiat avec les
      données déjà mémorisées.
    */

    openResults(
      cleanQuery,
      options
    );

    /*
      Une seule recherche réseau ciblée.
      Aucun balayage global de la ville.
    */

    searchNetworkForQuery(
      cleanQuery
    )
    .then(
      function(networkRows){

        if(
          !networkRows.length
        ){
          return;
        }

        mergeNetworkEntities(
          networkRows
        );

        /*
          Réaffichage uniquement
          si le réseau a apporté
          de nouveaux résultats.
        */

        openResults(
          cleanQuery,
          options
        );
      }
    )
    .catch(
      function(error){

        console.warn(
          "Bo'CitéArt : recherche réseau indisponible.",
          error
        );
      }
    );
  }

  /* =======================================================
     RÉSULTATS
     ======================================================= */

  function getResultCard(
    entity,
    distance
  ){

    const status =
      getOpenStatus(
        entity
      );

    const rating =
      getRatingSummary(
        entity.id
      );

    const ratingHtml =
      rating.visible
        ? `
            <div
              style="
                margin-top:6px;
                font-size:13px;
              ">
              <strong>
                ${rating.global.toFixed(1)} / 5
              </strong>
              •
              ${rating.count}
              expériences locales
            </div>
          `
        : "";

    const distanceHtml =
      typeof distance ===
      "number"
        ? `
            <div
              class="bociteAnnuaireSmall"
              style="margin-top:3px;">
              À ${distance.toFixed(1)} km
            </div>
          `
        : "";

    return `

      <div
        class="box bociteAnnuaireResult">

        ${getBadgesHtml(entity)}

        <div
          class="bociteAnnuaireTitle"
          style="margin-top:7px;">
          ${escapeHtml(entity.name || "Établissement")}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:4px;">
          ${escapeHtml(
            entity.activity ||
            entity.trade ||
            ""
          )}
        </div>

        <div
          class="bociteAnnuaireSmall"
          style="margin-top:4px;">
          ${escapeHtml(entity.commune || "")}
        </div>

        ${distanceHtml}

        ${
          status
            ? `
                <div
                  style="
                    margin-top:5px;
                    font-size:13px;
                    font-weight:700;
                  ">
                  ${escapeHtml(status)}
                </div>
              `
            : ""
        }

        ${ratingHtml}

        <div
          class="bociteAnnuaireActions"
          style="margin-top:9px;">

          <button
            type="button"
            class="choiceBtn annuaireOpenEntityBtn"
            data-id="${escapeHtml(entity.id)}">
            Voir la fiche
          </button>

          ${
            entity.phone
              ? `
                  <button
                    type="button"
                    class="choiceBtn annuaireCallBtn"
                    data-phone="${escapeHtml(entity.phone)}">
                    Appeler
                  </button>
                `
              : `
                  <button
                    type="button"
                    class="choiceBtn"
                    disabled>
                    Téléphone indisponible
                  </button>
                `
          }

        </div>

        <button
          type="button"
          class="choiceBtn annuaireRouteBtn"
          data-address="${escapeHtml(
            [
              entity.address,
              entity.postalCode,
              entity.commune
            ]
            .filter(Boolean)
            .join(" ")
          )}"
          style="
            width:100%;
            margin-top:7px;
          ">
          Itinéraire
        </button>

      </div>
    `;
  }

  function openResults(
    query,
    options
  ){

    options =
      options ||
      {};

    const results =
      searchEntities(
        query,
        options
      );

    const commune =
      getCurrentCommune();

    let html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div class="bociteAnnuaireTitle">
          Résultats dans ${escapeHtml(commune)}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:5px;">
          Recherche :
          <strong>
            ${escapeHtml(query)}
          </strong>
        </div>

      </div>

    `;

    if(!results.length){

      html += `

        <div
          class="box"
          style="margin-top:10px;">

          <div class="bociteAnnuaireTitle">
            Recherche en cours
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:7px;">
            Bo'CitéArt recherche également
            sur le réseau pour votre ville.
          </div>

        </div>

      `;

    }else{

      html += `
        <div style="margin-top:10px;">
      `;

      results.forEach(
        function(entity){

          html +=
            getResultCard(
              entity
            );
        }
      );

      html += `
        </div>
      `;
    }

    html += `

      <button
        id="annuaireResultsBackHomeBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour à l'annuaire
      </button>

    `;

    render(
      "Résultats",
      html,
      function(){

        bindResultActions();

        const back =
          getElement(
            "annuaireResultsBackHomeBtn"
          );

        if(back){

          back.onclick =
            openHome;
        }

      }
    );
  }

   /* =======================================================
     RÉSEAU LÉGER
     UNE RECHERCHE = UNE REQUÊTE
     ======================================================= */

  function getNetworkCityConfig(){

    let config = {};

    try{

      config =
        JSON.parse(
          localStorage.getItem(
            "bociteart_city_config_v1"
          ) || "{}"
        );

    }catch(error){

      config = {};
    }

    const cityName =
      String(
        config.cityName ||
        getCurrentCommune() ||
        ""
      ).trim();

    const postalCode =
      String(
        config.postalCode ||
        getCurrentPostalCode() ||
        ""
      ).trim();

    const inseeCode =
      String(
        config.inseeCode ||
        getCurrentInseeCode() ||
        ""
      ).trim();

    return {
      cityName:
        cityName,

      postalCode:
        postalCode,

      inseeCode:
        inseeCode
    };
  }


  function networkCategory(
    section
  ){

    section =
      String(
        section ||
        ""
      ).trim();

    if(section === "I"){
      return "restaurants";
    }

    if(section === "Q"){
      return "sante";
    }

    if(section === "F"){
      return "artisans";
    }

    if(section === "G"){
      return "commerces";
    }

    if(
      section === "H" ||
      section === "J" ||
      section === "K" ||
      section === "L" ||
      section === "M" ||
      section === "N" ||
      section === "S"
    ){
      return "services";
    }

    return "entreprises";
  }


  function networkKind(
    section
  ){

    return (
      section === "G" ||
      section === "I"
    )
      ? "commerce"
      : "entreprise";
  }


  function networkAddress(
    establishment
  ){

    if(!establishment){
      return "";
    }

    if(
      establishment.adresse
    ){

      return String(
        establishment.adresse
      ).trim();
    }

    return [
      establishment.numero_voie,
      establishment.indice_repetition,
      establishment.type_voie,
      establishment.libelle_voie
    ]
    .filter(Boolean)
    .join(" ")
    .trim();
  }


  function mapNetworkEntity(
    company,
    establishment,
    query,
    cityConfig
  ){

    const selected =
      establishment ||
      company.siege ||
      {};

    const section =
      String(
        company.section_activite_principale ||
        ""
      ).trim();

    const activity =
      String(
        selected.libelle_activite_principale ||
        company.libelle_activite_principale ||
        ""
      ).trim();

    const siret =
      String(
        selected.siret ||
        ""
      ).trim();

    const name =
      String(
        company.nom_complet ||
        company.nom_raison_sociale ||
        company.nom_commercial ||
        "Établissement"
      ).trim();

    return {

      id:
        siret ||
        String(
          company.siren ||
          uniqueId(
            "network"
          )
        ),

      siren:
        String(
          company.siren ||
          ""
        ),

      siret:
        siret,

      name:
        name,

      kind:
        networkKind(
          section
        ),

      category:
        networkCategory(
          section
        ),

      trade:
        activity,

      activity:
        activity,

      activityCode:
        String(
          selected.activite_principale ||
          company.activite_principale ||
          ""
        ),

      description:
        "",

      services:
        [],

      keywords:[
        query,
        activity,
        company.nom_complet,
        company.nom_raison_sociale,
        company.nom_commercial
      ]
      .filter(Boolean),

      commune:
        String(
          selected.libelle_commune ||
          cityConfig.cityName ||
          getCurrentCommune()
        ).trim(),

      postalCode:
        String(
          selected.code_postal ||
          cityConfig.postalCode ||
          ""
        ).trim(),

      address:
        networkAddress(
          selected
        ),

      phone:
        "",

      email:
        "",

      website:
        "",

      lat:
        selected.latitude
          ? Number(
              selected.latitude
            )
          : null,

      lng:
        selected.longitude
          ? Number(
              selected.longitude
            )
          : null,

      partner:
        false,

      bocitecoins:
        false,

      recruiting:
        false,

      source:
        "API Recherche d'Entreprises — État",

      verifiedAt:
        Date.now()

    };
  }

  function mergeNetworkEntities(
    rows
  ){

    const merged =
      new Map();

    loadEntities()
    .forEach(
      function(entity){

        const key =
          String(
            entity.siret ||
            entity.id ||
            ""
          );

        if(!key){
          return;
        }

        merged.set(
          key,
          entity
        );
      }
    );

    safeArray(
      rows
    )
    .forEach(
      function(entity){

        const key =
          String(
            entity.siret ||
            entity.id ||
            ""
          );

        if(!key){
          return;
        }

        const previous =
          merged.get(
            key
          );

        /*
          Si une fiche Bo'CitéArt
          possède déjà des informations
          enrichies, on ne les détruit pas.

          Les données réseau complètent
          seulement ce qui manque.
        */

        if(previous){

          merged.set(
            key,
            Object.assign(
              {},
              entity,
              previous,
              {

                address:
                  previous.address ||
                  entity.address ||
                  "",

                postalCode:
                  previous.postalCode ||
                  entity.postalCode ||
                  "",

                commune:
                  previous.commune ||
                  entity.commune ||
                  "",

                activity:
                  previous.activity ||
                  entity.activity ||
                  "",

                trade:
                  previous.trade ||
                  entity.trade ||
                  "",

                source:
                  previous.partner
                    ? previous.source
                    : (
                        entity.source ||
                        previous.source
                      )

              }
            )
          );

          return;
        }

        merged.set(
          key,
          entity
        );
      }
    );

    const result =
      Array.from(
        merged.values()
      );

    saveEntities(
      result
    );

    return result;
  }


  function searchNetworkForQuery(
    query
  ){

    const cleanQuery =
      String(
        query ||
        ""
      ).trim();

    if(!cleanQuery){

      return Promise.resolve(
        []
      );
    }

    const cityConfig =
      getNetworkCityConfig();

    /*
      Pour Wattignies le code INSEE
      est déjà connu.

      Pour les futures communes,
      le code sera simplement fourni
      par la configuration de la ville.
    */

    if(
      !cityConfig.inseeCode &&
      !cityConfig.postalCode
    ){

      console.warn(
        "Bo'CitéArt : commune non configurée pour la recherche réseau."
      );

      return Promise.resolve(
        []
      );
    }

    const params =
      new URLSearchParams();

    params.set(
      "q",
      cleanQuery
    );

    if(
      cityConfig.inseeCode
    ){

      params.set(
        "code_commune",
        cityConfig.inseeCode
      );

    }else{

      params.set(
        "code_postal",
        cityConfig.postalCode
      );
    }

    params.set(
      "etat_administratif",
      "A"
    );

    params.set(
      "page",
      "1"
    );

    params.set(
      "per_page",
      "25"
    );

    params.set(
      "limite_matching_etablissements",
      "25"
    );

    const url =
      "https://recherche-entreprises.api.gouv.fr/search?" +
      params.toString();

    return fetch(
      url,
      {
        method:"GET",
        headers:{
          "Accept":
            "application/json"
        }
      }
    )
    .then(
      function(response){

        if(!response.ok){

          throw new Error(
            "API HTTP " +
            response.status
          );
        }

        return response.json();
      }
    )
    .then(
      function(data){

        const rows =
          [];

        safeArray(
          data.results
        )
        .forEach(
          function(company){

            const establishments =
              safeArray(
                company.matching_etablissements
              );

            let candidates =
              establishments;

            if(
              !candidates.length &&
              company.siege
            ){

              candidates = [
                company.siege
              ];
            }

            candidates.forEach(
              function(establishment){

                const establishmentPostal =
                  String(
                    establishment.code_postal ||
                    ""
                  ).trim();

                const establishmentCommuneCode =
                  String(
                    establishment.commune ||
                    ""
                  ).trim();

                /*
                  On élimine les établissements
                  qui ne correspondent pas
                  réellement à la commune.
                */

                if(
                  cityConfig.inseeCode &&
                  establishmentCommuneCode &&
                  establishmentCommuneCode !==
                  cityConfig.inseeCode
                ){
                  return;
                }

                if(
                  !cityConfig.inseeCode &&
                  cityConfig.postalCode &&
                  establishmentPostal &&
                  establishmentPostal !==
                  cityConfig.postalCode
                ){
                  return;
                }

                rows.push(
                  mapNetworkEntity(
                    company,
                    establishment,
                    cleanQuery,
                    cityConfig
                  )
                );
              }
            );
          }
        );

        /*
          Déduplication par SIRET.
        */

        const unique =
          new Map();

        rows.forEach(
          function(entity){

            const key =
              String(
                entity.siret ||
                entity.id ||
                ""
              );

            if(!key){
              return;
            }

            unique.set(
              key,
              entity
            );
          }
        );

        const result =
          Array.from(
            unique.values()
          );

        console.log(
          "✅ Recherche réseau Bo'CitéArt :",
          cleanQuery,
          "—",
          result.length,
          "établissement(s)"
        );

        return result;
      }
    );
  }

  /* =======================================================
     LÉGENDE
     ======================================================= */

  function partnerBadge(){

    return `
      <span
        style="
          display:inline-flex;
          align-items:center;
          gap:5px;
          font-size:12px;
          font-weight:700;
        ">
        <span
          style="
            width:13px;
            height:13px;
            display:inline-block;
            background:#2f5d46;
            border-radius:3px;
          ">
        </span>
        Partenaire Bo'CitéArt
      </span>
    `;
  }

  function bocitecoinBadge(){

    return `
      <span
        style="
          display:inline-flex;
          align-items:center;
          gap:5px;
          font-size:12px;
          font-weight:700;
        ">
        <span
          style="
            width:13px;
            height:13px;
            display:inline-block;
            border:2px solid #b91c1c;
            border-radius:50%;
          ">
        </span>
        bocitecoins
      </span>
    `;
  }

  function commerceBadge(){

    return `
      <span
        style="
          display:inline-flex;
          align-items:center;
          gap:5px;
          font-size:12px;
          font-weight:700;
        ">
        <span
          style="
            width:13px;
            height:13px;
            display:inline-block;
            background:#b91c1c;
          ">
        </span>
        Commerce
      </span>
    `;
  }


  function entrepriseBadge(){

    return `
      <span
        style="
          display:inline-flex;
          align-items:center;
          gap:5px;
          font-size:12px;
          font-weight:700;
        ">
        <span
          style="
            width:13px;
            height:13px;
            display:inline-block;
            background:#3182a8;
          ">
        </span>
        Entreprise / professionnel
      </span>
    `;
  }


  function getLegendHtml(){

    return `

      <div
        id="annuaireLegendBox"
        class="box"
        style="
          display:none;
          margin-top:10px;
        ">

        <div class="bociteAnnuaireTitle">
          Comprendre les repères
        </div>

        <div
          style="margin-top:12px;">
          ${partnerBadge()}
        </div>

        <div
          class="bociteAnnuaireSmall"
          style="
            margin:4px 0 12px 22px;
          ">
          Établissement ayant rejoint
          officiellement Bo'CitéArt.
        </div>

        <div>
          ${bocitecoinBadge()}
        </div>

        <div
          class="bociteAnnuaireSmall"
          style="
            margin:4px 0 12px 22px;
          ">
          Participation selon les règles
          applicables à l'activité.
        </div>

        <div>
          ${commerceBadge()}
        </div>

        <div style="margin-top:10px;">
          ${entrepriseBadge()}
        </div>

        <div
          class="bociteAnnuaireSmall"
          style="
            margin-top:14px;
            padding-top:10px;
            border-top:1px solid #ddd;
          ">
          Les informations peuvent provenir
          de Bo'CitéArt et de sources publiques
          disponibles.
        </div>

      </div>
    `;
  }

  /* =======================================================
     PAGE ACCUEIL
     ======================================================= */

  function getHomeHtml(){

    const commune =
      getCurrentCommune();

    const categoryButtons =
      CATEGORIES
      .map(
        function(category){

          return `

            <button
              type="button"
              class="choiceBtn annuaireCategoryBtn"
              data-category="${escapeHtml(category.id)}"
              style="
                width:100%;
                min-height:92px;
                text-align:left;
                padding:14px;
              ">

              <div class="bociteAnnuaireTitle">
                ${escapeHtml(category.title)}
              </div>

              <div
                class="bociteAnnuaireText"
                style="margin-top:3px;">
                ${escapeHtml(category.subtitle)}
              </div>

            </button>

          `;
        }
      )
      .join("");

    const history =
      loadSearchHistory()
      .slice(
        0,
        4
      );

    const historyHtml =
      history.length
        ? history
            .map(
              function(item){

                return `

                  <button
                    type="button"
                    class="choiceBtn annuaireRecentQueryBtn"
                    data-query="${escapeHtml(item.query)}"
                    style="
                      width:100%;
                      text-align:left;
                      margin-top:7px;
                    ">

                    <strong>
                      ${escapeHtml(item.query)}
                    </strong>

                    <br>

                    <span
                      style="
                        font-size:12px;
                        font-weight:400;
                      ">
                      ${escapeHtml(item.commune)}
                      •
                      ${formatDate(item.createdAt)}
                    </span>

                  </button>

                `;
              }
            )
            .join("")
        : `
            <div class="bociteAnnuaireSmall">
              Vos recherches apparaîtront ici
              pour être retrouvées sans les retaper.
            </div>
          `;

    return `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          margin-bottom:10px;
        ">

        <div class="bociteAnnuaireTitle">
          Annuaire de ${escapeHtml(commune)}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:5px;">
          Trouvez simplement ce qui existe
          près de chez vous.
        </div>

      </div>

      <div
        class="box"
        style="margin-bottom:10px;">

        <label
          for="annuaireSearchInput"
          class="bociteAnnuaireTitle"
          style="
            display:block;
            margin-bottom:7px;
          ">
          Que recherchez-vous ?
        </label>

        <input
          id="annuaireSearchInput"
          type="search"
          autocomplete="off"
          placeholder="Nom, métier, produit ou service"
          style="
            width:100%;
            min-height:46px;
            box-sizing:border-box;
            border:1px solid #bbb;
            border-radius:8px;
            padding:10px;
            font-size:14px;
          "
        >

        <div
          class="bociteAnnuaireSmall"
          style="margin-top:5px;">
          Restaurant • couvreur • médecin • garage • Dupont…
        </div>

        <button
          id="annuaireSearchBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Rechercher dans ma ville
        </button>

      </div>

      <div class="bociteAnnuaireGrid">
        ${categoryButtons}
      </div>

      <div
        class="bociteAnnuaireActions"
        style="margin-top:9px;">

        <button
          id="annuaireNearBtn"
          class="choiceBtn"
          type="button">
          Près de moi
        </button>

        <button
          id="annuaireOpenBtn"
          class="choiceBtn"
          type="button">
          Ouvert maintenant
        </button>

      </div>

      <div
        class="bociteAnnuaireActions"
        style="margin-top:9px;">

        <button
          id="annuaireHistoryBtn"
          class="choiceBtn"
          type="button">
          Dernières recherches
        </button>

        <button
          id="annuaireFavoritesBtn"
          class="choiceBtn"
          type="button">
          Mes favoris
        </button>

      </div>

      <button
        id="annuaireViewedBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Consultés récemment
      </button>

      <button
        id="annuaireLegendBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Comprendre les symboles
      </button>

      ${getLegendHtml()}

      <div
        class="box"
        style="margin-top:11px;">

        <div class="bociteAnnuaireTitle">
          Recherches récentes
        </div>

        <div style="margin-top:7px;">
          ${historyHtml}
        </div>

      </div>

      <button
        id="annuaireProfessionalBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Espace professionnel enrichi
      </button>

    `;
  }

  function openHome(){

    render(
      "Annuaire de votre ville",
      getHomeHtml(),
      bindHome
    );
  }


  function bindHome(){

    const input =
      getElement(
        "annuaireSearchInput"
      );

    const searchBtn =
      getElement(
        "annuaireSearchBtn"
      );

    if(searchBtn){

      searchBtn.onclick =
        function(){

          launchSearch(
            input
              ? input.value
              : ""
          );
        };
    }

    if(input){

      input.onkeydown =
        function(event){

          if(
            event.key ===
            "Enter"
          ){

            event.preventDefault();

            launchSearch(
              input.value
            );
          }
        };
    }

    document
    .querySelectorAll(
      ".annuaireRecentQueryBtn"
    )
    .forEach(
      function(button){

        button.onclick =
          function(){

            launchSearch(
              button.dataset.query ||
              ""
            );
          };
      }
    );


    document
    .querySelectorAll(
      ".annuaireCategoryBtn"
    )
    .forEach(
      function(button){

        button.onclick =
          function(){

            const category =
              button.dataset.category ||
              "";

            openCategory(
              category
            );
          };
      }
    );


    const historyBtn =
      getElement(
        "annuaireHistoryBtn"
      );

    if(historyBtn){

      historyBtn.onclick =
        openSearchHistory;
    }


    const favoritesBtn =
      getElement(
        "annuaireFavoritesBtn"
      );

    if(favoritesBtn){

      favoritesBtn.onclick =
        openFavorites;
    }


    const viewedBtn =
      getElement(
        "annuaireViewedBtn"
      );

    if(viewedBtn){

      viewedBtn.onclick =
        openViewedHistory;
    }


    const legendBtn =
      getElement(
        "annuaireLegendBtn"
      );

    if(legendBtn){

      legendBtn.onclick =
        function(){

          const box =
            getElement(
              "annuaireLegendBox"
            );

          if(!box){
            return;
          }

          box.style.display =
            box.style.display ===
            "none"
              ? "block"
              : "none";
        };
    }


    const nearBtn =
      getElement(
        "annuaireNearBtn"
      );

    if(nearBtn){

      nearBtn.onclick =
        openNearMe;
    }


    const openBtn =
      getElement(
        "annuaireOpenBtn"
      );

    if(openBtn){

      openBtn.onclick =
        openCurrentlyOpen;
    }


    const professionalBtn =
      getElement(
        "annuaireProfessionalBtn"
      );

    if(professionalBtn){

      professionalBtn.onclick =
        openProfessionalDashboard;
    }
  }

  /* =======================================================
     ACTIONS DES CARTES
     ======================================================= */

  function bindResultActions(){

    document
    .querySelectorAll(
      ".annuaireOpenEntityBtn"
    )
    .forEach(
      function(button){

        button.onclick =
          function(){

            openEntity(
              button.dataset.id
            );
          };
      }
    );


    document
    .querySelectorAll(
      ".annuaireCallBtn"
    )
    .forEach(
      function(button){

        button.onclick =
          function(){

            callPhone(
              button.dataset.phone
            );
          };
      }
    );


    document
    .querySelectorAll(
      ".annuaireRouteBtn"
    )
    .forEach(
      function(button){

        button.onclick =
          function(){

            openRoute(
              button.dataset.address
            );
          };
      }
    );
  }

  /* =======================================================
     LISTE GÉNÉRIQUE
     ======================================================= */

  function openGenericEntityList(
    title,
    entities
  ){

    entities =
      safeArray(
        entities
      );

    let html = "";

    if(!entities.length){

      html = `

        <div class="box">

          <div class="bociteAnnuaireText">
            Aucun établissement disponible.
          </div>

        </div>

      `;

    }else{

      entities.forEach(
        function(entity){

          html +=
            getResultCard(
              entity
            );
        }
      );
    }

    html += `

      <button
        id="annuaireGenericBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour à l'annuaire
      </button>

    `;

    render(
      title,
      html,
      function(){

        bindResultActions();

        const back =
          getElement(
            "annuaireGenericBackBtn"
          );

        if(back){

          back.onclick =
            openHome;
        }
      }
    );
  } 

   /* =======================================================
     CATÉGORIES → MÉTIERS
     ======================================================= */

  const TRADE_SEARCH_TERMS = {

    /* SANTÉ */

    "Médecins généralistes":[
      "médecin généraliste",
      "médecine générale"
    ],

    "Infirmiers":[
      "infirmier",
      "infirmière",
      "soins infirmiers"
    ],

    "Kinésithérapeutes":[
      "kinésithérapeute",
      "masseur kinésithérapeute",
      "masseur-kinesitherapeute"
    ],

    "Dentistes":[
      "dentiste",
      "chirurgien dentiste",
      "chirurgien-dentiste"
    ],

    "Pharmacies":[
      "pharmacie",
      "pharmacien"
    ],

    "Pédicures-podologues":[
      "podologue",
      "pédicure podologue",
      "pédicure-podologue"
    ],

    "Orthophonistes":[
      "orthophoniste",
      "orthophonie"
    ],

    "Sages-femmes":[
      "sage-femme",
      "sage femme"
    ],

    "Psychologues":[
      "psychologue",
      "psychologie"
    ],

    "Laboratoires d'analyses médicales":[
      "laboratoire d'analyses médicales",
      "laboratoire de biologie médicale",
      "biologie médicale"
    ],

    "Autres professionnels de santé":[
      "audioprothésiste",
      "orthoptiste",
      "diététicien",
      "ergothérapeute",
      "psychomotricien",
      "ostéopathe",
      "chiropracteur"
    ],

    /* MAISON */

    "Couvreurs":[
      "couvreur",
      "couverture",
      "toiture",
      "zinguerie"
    ],

    "Plombiers":[
      "plombier",
      "plomberie"
    ],

    "Électriciens":[
      "électricien",
      "electricien",
      "électricité",
      "electricite"
    ],

    "Chauffagistes":[
      "chauffagiste",
      "chauffage"
    ],

    "Menuisiers":[
      "menuisier",
      "menuiserie"
    ],

    "Maçons":[
      "maçon",
      "macon",
      "maçonnerie",
      "maconnerie"
    ],

    "Peintres":[
      "peintre",
      "peinture"
    ],

    "Carreleurs":[
      "carreleur",
      "carrelage"
    ],

    "Paysagistes":[
      "paysagiste",
      "espaces verts"
    ],

    "Serruriers":[
      "serrurier",
      "serrurerie"
    ],

    "Entreprises de rénovation":[
      "rénovation",
      "renovation"
    ],

    /* AUTOMOBILE */

    "Garages automobiles":[
      "garage automobile",
      "réparation automobile",
      "reparation automobile"
    ],

    "Carrossiers":[
      "carrossier",
      "carrosserie"
    ],

    "Pneumatiques":[
      "pneumatique",
      "pneu"
    ],

    "Contrôle technique":[
      "contrôle technique",
      "controle technique"
    ],

    "Motos":[
      "moto",
      "motocycle"
    ],

    "Cycles":[
      "vélo",
      "velo",
      "cycle",
      "bicyclette"
    ],

    "Véhicules utilitaires":[
      "véhicule utilitaire",
      "vehicule utilitaire"
    ],

    "Poids lourds":[
      "poids lourd",
      "camion"
    ],

    /* ALIMENTATION */

    "Restaurants":[
      "restaurant",
      "restauration"
    ],

    "Boulangeries":[
      "boulangerie",
      "boulanger",
      "boulangerie pâtisserie",
      "boulangerie-pâtisserie"
    ],

    "Boucheries":[
      "boucherie",
      "boucher",
      "charcuterie"
    ],

    "Traiteurs":[
      "traiteur"
    ],

    "Cafés":[
      "café",
      "cafe",
      "débit de boissons"
    ],

    "Épiceries":[
      "épicerie",
      "epicerie",
      "alimentation générale"
    ],

    "Commerces alimentaires":[
      "commerce alimentaire",
      "alimentation"
    ],

    /* SERVICES PRO */

    "Experts-comptables":[
      "expert comptable",
      "expert-comptable",
      "comptabilité"
    ],

    "Avocats":[
      "avocat",
      "activité juridique"
    ],

    "Assurances":[
      "assurance",
      "assureur"
    ],

    "Informatique":[
      "informatique",
      "logiciel"
    ],

    "Communication":[
      "communication",
      "publicité"
    ],

    "Transport":[
      "transport"
    ],

    "Nettoyage professionnel":[
      "nettoyage",
      "propreté"
    ],

    "Sécurité":[
      "sécurité",
      "surveillance"
    ],

    "Bureaux d'études":[
      "bureau d'études",
      "ingénierie"
    ],

    "Conseil":[
      "conseil",
      "consultant"
    ],

    /* HÉBERGEMENT */

    "Hôtels":[
      "hôtel",
      "hotel",
      "hôtellerie"
    ],

    "Chambres d'hôtes":[
      "chambre d'hôtes",
      "chambre d'hotes"
    ],

    "Gîtes":[
      "gîte",
      "gite"
    ],

    "Locations de courte durée":[
      "location courte durée",
      "hébergement touristique"
    ],

    "Autres hébergements":[
      "hébergement",
      "hebergement"
    ]

  };

  /* =======================================================
     RECHERCHE PAR MÉTIER
     ======================================================= */

  function searchEntitiesByTrade(
    trade
  ){

    const commune =
      normalizeText(
        getCurrentCommune()
      );

    const terms =
      safeArray(
        TRADE_SEARCH_TERMS[
          trade
        ]
      )
      .concat(
        [trade]
      )
      .map(
        normalizeText
      )
      .filter(Boolean);

    return loadEntities()
      .filter(
        function(entity){

          if(
            normalizeText(
              entity.commune
            ) !==
            commune
          ){
            return false;
          }

          const haystack =
            entitySearchText(
              entity
            );

          const matches =
            terms.some(
              function(term){

                return (
                  term &&
                  haystack.includes(
                    term
                  )
                );
              }
            );

          if(!matches){
            return false;
          }

          /*
            Un laboratoire de prothèse
            dentaire n'est pas classé
            dans les dentistes.
          */

          if(
            trade ===
            "Dentistes"
          ){

            const excluded = [
              "laboratoire dentaire",
              "prothese dentaire",
              "prothesiste dentaire"
            ];

            const isLab =
              excluded.some(
                function(term){

                  return haystack.includes(
                    normalizeText(
                      term
                    )
                  );
                }
              );

            if(isLab){
              return false;
            }
          }

          return true;
        }
      )
      .sort(
        function(a,b){

          return String(
            a.name ||
            ""
          )
          .localeCompare(
            String(
              b.name ||
              ""
            ),
            "fr",
            {
              sensitivity:"base"
            }
          );
        }
      );
  }

  /* =======================================================
     OUVRIR UNE CATÉGORIE
     ======================================================= */

  function openCategory(
    categoryId
  ){

    if(
      categoryId ===
      "metiers"
    ){

      openAllTrades();
      return;
    }

    if(
      categoryId ===
      "sante"
    ){

      openTradeFamily(
        "Santé",
        METIERS.sante
      );

      return;
    }

    if(
      categoryId ===
      "artisans"
    ){

      openTradeFamily(
        "Artisans • Maison & travaux",
        METIERS.maison
      );

      return;
    }

    if(
      categoryId ===
      "restaurants"
    ){

      openTradeFamily(
        "Restaurants & alimentation",
        METIERS.alimentation
      );

      return;
    }

    if(
      categoryId ===
      "commerces"
    ){

      openTradeFamily(
        "Commerces & alimentation",
        METIERS.alimentation
      );

      return;
    }

    if(
      categoryId ===
      "services"
    ){

      openTradeFamily(
        "Services",
        METIERS.professionnels
      );

      return;
    }

    if(
      categoryId ===
      "hebergements"
    ){

      openTradeFamily(
        "Hôtels & séjours",
        METIERS.hebergements
      );

      return;
    }

    if(
      categoryId ===
      "entreprises"
    ){

      const results =
        searchEntities(
          "",
          {
            category:
              "entreprises"
          }
        );

      openGenericEntityList(
        "Entreprises",
        results
      );

      return;
    }

    openHome();
  }

  /* =======================================================
     PAGE MÉTIERS D'UNE CATÉGORIE
     ======================================================= */

  function openTradeFamily(
    title,
    trades
  ){

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          ${escapeHtml(title)}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Choisissez un métier.
        </div>

      </div>

    `;

    safeArray(
      trades
    )
    .forEach(
      function(trade){

        const count =
          searchEntitiesByTrade(
            trade
          ).length;

        html += `

          <button
            type="button"
            class="choiceBtn annuaireTradeBtn"
            data-trade="${escapeHtml(trade)}"
            style="
              width:100%;
              margin-top:7px;
              text-align:left;
            ">

            <strong
              style="
                display:block;
                color:#2f5d46;
                font-size:16px;
              ">
              ${escapeHtml(trade)}
            </strong>

            <span
              style="
                display:block;
                margin-top:3px;
                font-size:12px;
                font-weight:400;
              ">
              ${
                count
                  ? (
                      count +
                      (
                        count > 1
                          ? " professionnels déjà disponibles"
                          : " professionnel déjà disponible"
                      )
                    )
                  : "Recherche réseau disponible"
              }
            </span>

          </button>

        `;
      }
    );

    html += `

      <button
        id="annuaireTradeBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour à l'annuaire
      </button>

    `;

    render(
      title,
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireTradeBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  const trade =
                    button.getAttribute(
                      "data-trade"
                    ) ||
                    "";

                  openTradeResults(
                    trade
                  );
                };
            }
          );

        const back =
          getElement(
            "annuaireTradeBackBtn"
          );

        if(back){

          back.onclick =
            openHome;
        }
      }
    );
  }

  /* =======================================================
     RÉSULTATS D'UN MÉTIER
     ======================================================= */

  function openTradeResults(
    trade
  ){

    const existing =
      searchEntitiesByTrade(
        trade
      );

    renderTradeResults(
      trade,
      existing,
      existing.length === 0
    );

    /*
      Une seule demande réseau.

      On prend le premier terme
      réellement exploitable.
    */

    const networkTerms =
      safeArray(
        TRADE_SEARCH_TERMS[
          trade
        ]
      );

    const networkQuery =
      networkTerms[0] ||
      trade;

    searchNetworkForQuery(
      networkQuery
    )
    .then(
      function(rows){

        if(!rows.length){
          return;
        }

        mergeNetworkEntities(
          rows
        );

        const refreshed =
          searchEntitiesByTrade(
            trade
          );

        renderTradeResults(
          trade,
          refreshed,
          false
        );
      }
    )
    .catch(
      function(error){

        console.warn(
          "Bo'CitéArt : recherche métier indisponible.",
          error
        );
      }
    );
  }

  function renderTradeResults(
    trade,
    results,
    searching
  ){

    let html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div class="bociteAnnuaireTitle">
          ${escapeHtml(trade)}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:5px;">
          ${escapeHtml(getCurrentCommune())}
        </div>

      </div>

    `;

    if(
      !results.length
    ){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireTitle">
            ${
              searching
                ? "Recherche en cours"
                : "Aucun résultat disponible"
            }
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            ${
              searching
                ? (
                    "Bo'CitéArt vérifie également " +
                    "les données disponibles sur le réseau."
                  )
                : (
                    "Aucun établissement correspondant " +
                    "n'a été trouvé pour le moment."
                  )
            }
          </div>

        </div>

      `;

    }else{

      results.forEach(
        function(entity){

          html +=
            getResultCard(
              entity
            );
        }
      );
    }

    html += `

      <button
        id="annuaireTradeResultsBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour aux métiers
      </button>

    `;

    render(
      trade,
      html,
      function(){

        bindResultActions();

        const back =
          getElement(
            "annuaireTradeResultsBackBtn"
          );

        if(back){

          back.onclick =
            openAllTrades;
        }
      }
    );
  }

  /* =======================================================
     TOUS LES MÉTIERS
     ======================================================= */

  function openAllTrades(){

    const sections = [

      {
        title:
          "Santé",
        values:
          METIERS.sante
      },

      {
        title:
          "Maison & travaux",
        values:
          METIERS.maison
      },

      {
        title:
          "Automobile & mobilité",
        values:
          METIERS.automobile
      },

      {
        title:
          "Restaurants & alimentation",
        values:
          METIERS.alimentation
      },

      {
        title:
          "Services aux entreprises",
        values:
          METIERS.professionnels
      },

      {
        title:
          "Hôtels & séjours",
        values:
          METIERS.hebergements
      }

    ];

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Tous les métiers de votre ville
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Choisissez un métier.
        </div>

      </div>

    `;

    sections.forEach(
      function(section){

        html += `

          <div
            class="box"
            style="margin-top:9px;">

            <div class="bociteAnnuaireTitle">
              ${escapeHtml(section.title)}
            </div>

        `;

        safeArray(
          section.values
        )
        .forEach(
          function(trade){

            const count =
              searchEntitiesByTrade(
                trade
              ).length;

            html += `

              <button
                type="button"
                class="choiceBtn annuaireTradeBtn"
                data-trade="${escapeHtml(trade)}"
                style="
                  width:100%;
                  margin-top:6px;
                  text-align:left;
                ">

                <strong>
                  ${escapeHtml(trade)}
                </strong>

                <br>

                <span
                  style="
                    font-size:12px;
                    font-weight:400;
                  ">
                  ${
                    count
                      ? (
                          count +
                          (
                            count > 1
                              ? " disponibles"
                              : " disponible"
                          )
                        )
                      : "Recherche réseau"
                  }
                </span>

              </button>

            `;
          }
        );

        html += `
          </div>
        `;
      }
    );

    html += `

      <button
        id="annuaireAllTradesBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour à l'annuaire
      </button>

    `;

    render(
      "Tous les métiers",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireTradeBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  openTradeResults(
                    button.getAttribute(
                      "data-trade"
                    ) ||
                    ""
                  );
                };
            }
          );

        const back =
          getElement(
            "annuaireAllTradesBackBtn"
          );

        if(back){

          back.onclick =
            openHome;
        }
      }
    );
  }

  /* =======================================================
     HISTORIQUE DES RECHERCHES
     ======================================================= */

  function openSearchHistory(){

    const history =
      loadSearchHistory();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Mes dernières recherches
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Retrouvez une recherche
          sans avoir à la retaper.
        </div>

      </div>

    `;

    if(
      !history.length
    ){

      html += `

        <div
          class="box"
          style="margin-top:9px;">
          Aucun historique pour le moment.
        </div>

      `;

    }else{

      history.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:7px;">

              <button
                type="button"
                class="choiceBtn annuaireHistoryQueryBtn"
                data-query="${escapeHtml(item.query)}"
                style="
                  width:100%;
                  text-align:left;
                ">

                <strong>
                  ${escapeHtml(item.query)}
                </strong>

                <br>

                <span
                  style="
                    font-size:12px;
                    font-weight:400;
                  ">
                  ${escapeHtml(item.commune)}
                  •
                  ${formatDate(item.createdAt)}
                </span>

              </button>

              <button
                type="button"
                class="choiceBtn annuaireHistoryDeleteBtn"
                data-id="${escapeHtml(item.id)}"
                style="
                  width:100%;
                  margin-top:5px;
                ">
                Supprimer cette recherche
              </button>

            </div>

          `;
        }
      );

      html += `

        <button
          id="annuaireHistoryClearBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Tout effacer
        </button>

      `;
    }

    html += `

      <button
        id="annuaireHistoryBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour à l'annuaire
      </button>

    `;

    render(
      "Mes dernières recherches",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireHistoryQueryBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  launchSearch(
                    button.getAttribute(
                      "data-query"
                    ) ||
                    ""
                  );
                };
            }
          );


        document
          .querySelectorAll(
            ".annuaireHistoryDeleteBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  removeSearchHistoryItem(
                    button.getAttribute(
                      "data-id"
                    )
                  );

                  openSearchHistory();
                };
            }
          );


        const clear =
          getElement(
            "annuaireHistoryClearBtn"
          );

        if(clear){

          clear.onclick =
            function(){

              if(
                window.confirm(
                  "Effacer tout l'historique des recherches ?"
                )
              ){

                clearSearchHistory();
                openSearchHistory();
              }
            };
        }


        const back =
          getElement(
            "annuaireHistoryBackBtn"
          );

        if(back){

          back.onclick =
            openHome;
        }
      }
    );
  }

  /* =======================================================
     CONSULTÉS RÉCEMMENT
     ======================================================= */

  function openViewedHistory(){

    const history =
      loadViewedHistory();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Consultés récemment
        </div>

      </div>

    `;

    if(
      !history.length
    ){

      html += `

        <div
          class="box"
          style="margin-top:9px;">
          Aucune fiche consultée pour le moment.
        </div>

      `;

    }else{

      history.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:7px;">

              <button
                type="button"
                class="choiceBtn annuaireViewedEntityBtn"
                data-id="${escapeHtml(item.entityId)}"
                style="
                  width:100%;
                  text-align:left;
                ">

                <strong>
                  ${escapeHtml(item.name)}
                </strong>

                <br>

                <span
                  style="
                    font-size:12px;
                    font-weight:400;
                  ">
                  ${escapeHtml(item.commune || "")}
                  •
                  ${formatDate(item.viewedAt)}
                </span>

              </button>

              <button
                type="button"
                class="choiceBtn annuaireViewedDeleteBtn"
                data-id="${escapeHtml(item.id)}"
                style="
                  width:100%;
                  margin-top:5px;
                ">
                Retirer de l'historique
              </button>

            </div>

          `;
        }
      );

      html += `

        <button
          id="annuaireViewedClearBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Tout effacer
        </button>

      `;
    }

    html += `

      <button
        id="annuaireViewedBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour à l'annuaire
      </button>

    `;

    render(
      "Consultés récemment",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireViewedEntityBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  openEntity(
                    button.getAttribute(
                      "data-id"
                    )
                  );
                };
            }
          );


        document
          .querySelectorAll(
            ".annuaireViewedDeleteBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  removeViewedHistoryItem(
                    button.getAttribute(
                      "data-id"
                    )
                  );

                  openViewedHistory();
                };
            }
          );


        const clear =
          getElement(
            "annuaireViewedClearBtn"
          );

        if(clear){

          clear.onclick =
            function(){

              if(
                window.confirm(
                  "Effacer toutes les fiches consultées récemment ?"
                )
              ){

                clearViewedHistory();
                openViewedHistory();
              }
            };
        }


        const back =
          getElement(
            "annuaireViewedBackBtn"
          );

        if(back){

          back.onclick =
            openHome;
        }
      }
    );
  }

  /* =======================================================
     FAVORIS
     ======================================================= */

  function openFavorites(){

    const favorites =
      loadFavorites();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Mes favoris
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Retrouvez rapidement
          les adresses que vous souhaitez conserver.
        </div>

      </div>

    `;

    if(
      !favorites.length
    ){

      html += `

        <div
          class="box"
          style="margin-top:9px;">
          Aucun favori enregistré.
        </div>

      `;

    }else{

      favorites.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:7px;">

              <button
                type="button"
                class="choiceBtn annuaireFavoriteEntityBtn"
                data-id="${escapeHtml(item.entityId)}"
                style="
                  width:100%;
                  text-align:left;
                ">

                <strong>
                  ${escapeHtml(item.name)}
                </strong>

                <br>

                <span
                  style="
                    font-size:12px;
                    font-weight:400;
                  ">
                  ${escapeHtml(item.commune || "")}
                  •
                  enregistré le
                  ${formatDate(item.savedAt)}
                </span>

              </button>

              <button
                type="button"
                class="choiceBtn annuaireFavoriteDeleteBtn"
                data-id="${escapeHtml(item.entityId)}"
                style="
                  width:100%;
                  margin-top:5px;
                ">
                Retirer des favoris
              </button>

            </div>

          `;
        }
      );

      html += `

        <button
          id="annuaireFavoritesClearBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Tout effacer
        </button>

      `;
    }

    html += `

      <button
        id="annuaireFavoritesBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour à l'annuaire
      </button>

    `;

    render(
      "Mes favoris",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireFavoriteEntityBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  openEntity(
                    button.getAttribute(
                      "data-id"
                    )
                  );
                };
            }
          );


        document
          .querySelectorAll(
            ".annuaireFavoriteDeleteBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  removeFavorite(
                    button.getAttribute(
                      "data-id"
                    )
                  );

                  openFavorites();
                };
            }
          );


        const clear =
          getElement(
            "annuaireFavoritesClearBtn"
          );

        if(clear){

          clear.onclick =
            function(){

              if(
                window.confirm(
                  "Effacer tous les favoris ?"
                )
              ){

                clearFavorites();
                openFavorites();
              }
            };
        }


        const back =
          getElement(
            "annuaireFavoritesBackBtn"
          );

        if(back){

          back.onclick =
            openHome;
        }
      }
    );
  }

   /* =======================================================
     PHOTOS
     ======================================================= */

  function getPhotosHtml(
    entity
  ){

    const photos =
      safeArray(
        entity.photos
      )
      .slice(
        0,
        8
      );

    if(!photos.length){
      return "";
    }

    return `

      <div
        class="box"
        style="margin-top:10px;">

        <div class="bociteAnnuaireTitle">
          Photos
        </div>

        <div
          class="bociteAnnuairePhotoGrid"
          style="margin-top:8px;">

          ${
            photos
            .map(
              function(photo){

                const url =
                  typeof photo ===
                  "string"
                    ? photo
                    : photo.url;

                const alt =
                  typeof photo ===
                  "object"
                    ? (
                        photo.alt ||
                        entity.name ||
                        ""
                      )
                    : (
                        entity.name ||
                        ""
                      );

                return `

                  <img
                    src="${escapeHtml(url)}"
                    alt="${escapeHtml(alt)}"
                    loading="lazy"
                  >

                `;
              }
            )
            .join("")
          }

        </div>

      </div>

    `;
  }

  /* =======================================================
     PETIT MOT PARTENAIRE
     ======================================================= */

  function getPartnerSignature(
    entity
  ){

    const profiles =
      loadJson(
        STORAGE.partnerProfiles,
        {}
      );

    const saved =
      profiles[
        entity.id
      ] || {};

    return (
      saved.signature ||
      entity.signature ||
      ""
    );
  }


  function signatureTitle(
    entity
  ){

    if(
      entity.category ===
      "restaurants" ||
      normalizeText(
        entity.trade
      ).includes(
        "restaurant"
      )
    ){

      return "Le petit mot du chef";
    }

    if(
      entity.category ===
      "artisans"
    ){

      return "Le mot de l'artisan";
    }

    if(
      entity.category ===
      "hebergements"
    ){

      return "Le mot de votre hôte";
    }

    return "Le mot du professionnel";
  }


  function getSignatureHtml(
    entity
  ){

    const signature =
      getPartnerSignature(
        entity
      );

    if(!signature){
      return "";
    }

    return `

      <div class="bociteAnnuaireSignature">

        <div
          style="
            font-family:inherit;
            font-style:normal;
            font-weight:700;
            color:#2f5d46;
            margin-bottom:6px;
          ">
          ${escapeHtml(
            signatureTitle(
              entity
            )
          )}
        </div>

        ${escapeHtml(signature)}

      </div>

    `;
  }

  /* =======================================================
     APPRÉCIATIONS
     ======================================================= */

  function getRatingDisplayHtml(
    entity
  ){

    const summary =
      getRatingSummary(
        entity.id
      );

    if(
      !summary.visible
    ){

      return `

        <div
          class="box"
          style="margin-top:10px;">

          <div class="bociteAnnuaireTitle">
            Appréciations locales
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            L'appréciation globale devient visible
            à partir de ${MINIMUM_RATINGS}
            expériences locales enregistrées.
          </div>

          <div
            class="bociteAnnuaireSmall"
            style="margin-top:6px;">
            ${
              summary.count
                ? (
                    summary.count +
                    (
                      summary.count > 1
                        ? " appréciations enregistrées"
                        : " appréciation enregistrée"
                    )
                  )
                : "Aucune appréciation enregistrée pour le moment."
            }
          </div>

        </div>

      `;
    }

    return `

      <div
        class="box"
        style="margin-top:10px;">

        <div class="bociteAnnuaireTitle">
          Appréciations locales
        </div>

        <div
          style="
            margin-top:7px;
            font-size:18px;
            font-weight:700;
            color:#2f5d46;
          ">
          ${summary.global.toFixed(1)} / 5
        </div>

        <div
          class="bociteAnnuaireSmall"
          style="margin-top:4px;">
          ${summary.count}
          expériences locales enregistrées
        </div>

      </div>

    `;
  }


  function openRatingForm(
    entityId
  ){

    const entity =
      getEntityById(
        entityId
      );

    if(!entity){
      return;
    }

    const buttons =
      [1,2,3,4,5]
      .map(
        function(value){

          return `

            <button
              type="button"
              class="choiceBtn annuaireRatingValueBtn"
              data-rating="${value}">
              ${value} / 5
            </button>

          `;
        }
      )
      .join("");

    render(
      "Donner mon appréciation",
      `

        <div class="box">

          <div class="bociteAnnuaireTitle">
            ${escapeHtml(entity.name)}
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Donnez simplement votre appréciation.
          </div>

          <div
            class="bociteAnnuaireSmall"
            style="margin-top:6px;">
            Aucun commentaire libre n'est demandé.
          </div>

        </div>

        <div
          class="bociteAnnuaireStars"
          style="margin-top:10px;">

          ${buttons}

        </div>

        <button
          id="annuaireRatingBackBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:10px;
          ">
          Retour à la fiche
        </button>

      `,
      function(){

        document
          .querySelectorAll(
            ".annuaireRatingValueBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  const value =
                    Number(
                      button.getAttribute(
                        "data-rating"
                      )
                    );

                  const saved =
                    addRating(
                      entity.id,
                      value
                    );

                  if(saved){

                    alert(
                      "Votre appréciation a été enregistrée."
                    );

                    openEntity(
                      entity.id
                    );
                  }
                };
            }
          );


        const back =
          getElement(
            "annuaireRatingBackBtn"
          );

        if(back){

          back.onclick =
            function(){

              openEntity(
                entity.id
              );
            };
        }
      }
    );
  }

  /* =======================================================
     FICHE ÉTABLISSEMENT
     ======================================================= */

  function openEntity(
    entityId
  ){

    const entity =
      getEntityById(
        entityId
      );

    if(!entity){

      alert(
        "Cette fiche n'est plus disponible."
      );

      return;
    }

    addViewedEntity(
      entity
    );

    const favorite =
      isFavorite(
        entity.id
      );

    const followed =
      isFollowed(
        entity.id
      );

    const contactHtml = `

      <div
        class="box"
        style="margin-top:10px;">

        <div class="bociteAnnuaireTitle">
          Coordonnées
        </div>

        ${
          entity.address
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:7px;">
                  ${escapeHtml(entity.address)}
                  ${
                    entity.postalCode ||
                    entity.commune
                      ? "<br>"
                      : ""
                  }
                  ${escapeHtml(
                    [
                      entity.postalCode,
                      entity.commune
                    ]
                    .filter(Boolean)
                    .join(" ")
                  )}
                </div>
              `
            : `
                <div
                  class="bociteAnnuaireSmall"
                  style="margin-top:7px;">
                  Adresse non renseignée.
                </div>
              `
        }

        <div
          class="bociteAnnuaireActions"
          style="margin-top:9px;">

          ${
            entity.phone
              ? `
                  <button
                    type="button"
                    id="annuaireEntityCallBtn"
                    class="choiceBtn">
                    Appeler
                  </button>
                `
              : `
                  <button
                    type="button"
                    class="choiceBtn"
                    disabled>
                    Téléphone indisponible
                  </button>
                `
          }

          ${
            entity.email
              ? `
                  <button
                    type="button"
                    id="annuaireEntityEmailBtn"
                    class="choiceBtn">
                    Envoyer un e-mail
                  </button>
                `
              : `
                  <button
                    type="button"
                    class="choiceBtn"
                    disabled>
                    E-mail indisponible
                  </button>
                `
          }

        </div>

        ${
          entity.website
            ? `
                <button
                  type="button"
                  id="annuaireEntityWebsiteBtn"
                  class="choiceBtn"
                  style="
                    width:100%;
                    margin-top:7px;
                  ">
                  Voir le site internet
                </button>
              `
            : ""
        }

        ${
          entity.address
            ? `
                <button
                  type="button"
                  id="annuaireEntityRouteBtn"
                  class="choiceBtn"
                  style="
                    width:100%;
                    margin-top:7px;
                  ">
                  Itinéraire
                </button>
              `
            : ""
        }

      </div>

    `;

    const sourceHtml =
      entity.source
        ? `

            <div
              class="box"
              style="margin-top:10px;">

              <div class="bociteAnnuaireTitle">
                Informations
              </div>

              <div
                class="bociteAnnuaireSmall"
                style="margin-top:6px;">
                Source :
                ${escapeHtml(entity.source)}
              </div>

              ${
                entity.verifiedAt
                  ? `
                      <div
                        class="bociteAnnuaireSmall"
                        style="margin-top:4px;">
                        Vérifié / actualisé :
                        ${formatDate(entity.verifiedAt)}
                      </div>
                    `
                  : ""
              }

            </div>

          `
        : "";

    const employmentHtml =
      entity.recruiting
        ? `

            <div
              class="box"
              style="margin-top:10px;">

              <div class="bociteAnnuaireTitle">
                Cette entreprise recrute
              </div>

              <button
                id="annuaireEntityEmploymentBtn"
                class="choiceBtn"
                type="button"
                style="
                  width:100%;
                  margin-top:8px;
                ">
                Voir les offres d'emploi
              </button>

            </div>

          `
        : "";

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        ${getBadgesHtml(entity)}

        <div
          class="bociteAnnuaireTitle"
          style="margin-top:7px;">
          ${escapeHtml(entity.name)}
        </div>

        ${
          entity.activity ||
          entity.trade
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:5px;">
                  ${escapeHtml(
                    entity.activity ||
                    entity.trade
                  )}
                </div>
              `
            : ""
        }

        ${
          entity.description
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:8px;">
                  ${escapeHtml(entity.description)}
                </div>
              `
            : ""
        }

      </div>

      ${getSignatureHtml(entity)}

      ${getPhotosHtml(entity)}

      ${contactHtml}

      ${employmentHtml}

      ${getRatingDisplayHtml(entity)}

      <button
        id="annuaireGiveRatingBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Donner mon appréciation
      </button>

      <div
        class="bociteAnnuaireActions"
        style="margin-top:8px;">

        <button
          id="annuaireFavoriteToggleBtn"
          class="choiceBtn"
          type="button">
          ${
            favorite
              ? "Retirer des favoris"
              : "Ajouter aux favoris"
          }
        </button>

        <button
          id="annuaireNotebookAddBtn"
          class="choiceBtn"
          type="button">
          Ajouter à mon carnet pro
        </button>

      </div>

      <button
        id="annuaireFollowToggleBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        ${
          followed
            ? "Ne plus suivre cette entreprise"
            : "Suivre cette entreprise"
        }
      </button>

      ${sourceHtml}

      <button
        id="annuaireEntityBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour à l'annuaire
      </button>

    `;


    render(
      entity.name,
      html,
      function(){

        const call =
          getElement(
            "annuaireEntityCallBtn"
          );

        if(call){

          call.onclick =
            function(){

              callPhone(
                entity.phone
              );
            };
        }


        const email =
          getElement(
            "annuaireEntityEmailBtn"
          );

        if(email){

          email.onclick =
            function(){

              sendEmail(
                entity.email
              );
            };
        }


        const website =
          getElement(
            "annuaireEntityWebsiteBtn"
          );

        if(website){

          website.onclick =
            function(){

              openWebsite(
                entity.website
              );
            };
        }


        const route =
          getElement(
            "annuaireEntityRouteBtn"
          );

        if(route){

          route.onclick =
            function(){

              openRoute(
                [
                  entity.address,
                  entity.postalCode,
                  entity.commune
                ]
                .filter(Boolean)
                .join(" ")
              );
            };
        }


        const rating =
          getElement(
            "annuaireGiveRatingBtn"
          );

        if(rating){

          rating.onclick =
            function(){

              openRatingForm(
                entity.id
              );
            };
        }


        const favoriteBtn =
          getElement(
            "annuaireFavoriteToggleBtn"
          );

        if(favoriteBtn){

          favoriteBtn.onclick =
            function(){

              toggleFavorite(
                entity
              );

              openEntity(
                entity.id
              );
            };
        }


        const notebook =
          getElement(
            "annuaireNotebookAddBtn"
          );

        if(notebook){

          notebook.onclick =
            function(){

              addNotebookEntity(
                entity
              );

              alert(
                "Entreprise ajoutée à votre carnet professionnel."
              );
            };
        }


        const follow =
          getElement(
            "annuaireFollowToggleBtn"
          );

        if(follow){

          follow.onclick =
            function(){

              toggleFollowed(
                entity
              );

              openEntity(
                entity.id
              );
            };
        }


        const employment =
          getElement(
            "annuaireEntityEmploymentBtn"
          );

        if(employment){

          employment.onclick =
            function(){

              if(
                typeof module.openEmploymentPublicHome ===
                "function"
              ){

                module.openEmploymentPublicHome();

              }else{

                alert(
                  "L'espace emploi n'est pas disponible pour le moment."
                );
              }
            };
        }


        const back =
          getElement(
            "annuaireEntityBackBtn"
          );

        if(back){

          back.onclick =
            openHome;
        }
      }
    );
  }

  /* =======================================================
     PRÈS DE MOI
     ======================================================= */

  function distanceKm(
    lat1,
    lng1,
    lat2,
    lng2
  ){

    const toRad =
      function(value){

        return (
          Number(value) *
          Math.PI /
          180
        );
      };

    const R =
      6371;

    const dLat =
      toRad(
        lat2 - lat1
      );

    const dLng =
      toRad(
        lng2 - lng1
      );

    const a =
      Math.sin(
        dLat / 2
      ) *
      Math.sin(
        dLat / 2
      ) +
      Math.cos(
        toRad(lat1)
      ) *
      Math.cos(
        toRad(lat2)
      ) *
      Math.sin(
        dLng / 2
      ) *
      Math.sin(
        dLng / 2
      );

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1-a)
      );

    return R * c;
  }


  function openNearMe(){

    if(
      !navigator.geolocation
    ){

      alert(
        "La géolocalisation n'est pas disponible sur cet appareil."
      );

      return;
    }

    navigator.geolocation
      .getCurrentPosition(
        function(position){

          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;

          const commune =
            normalizeText(
              getCurrentCommune()
            );

          const results =
            loadEntities()
            .filter(
              function(entity){

                return (
                  normalizeText(
                    entity.commune
                  ) === commune &&
                  Number.isFinite(
                    Number(entity.lat)
                  ) &&
                  Number.isFinite(
                    Number(entity.lng)
                  )
                );
              }
            )
            .map(
              function(entity){

                return {
                  entity:
                    entity,

                  distance:
                    distanceKm(
                      lat,
                      lng,
                      Number(entity.lat),
                      Number(entity.lng)
                    )
                };
              }
            )
            .sort(
              function(a,b){

                return (
                  a.distance -
                  b.distance
                );
              }
            )
            .slice(
              0,
              30
            );

          let html = `

            <div class="box">

              <div class="bociteAnnuaireTitle">
                Près de moi
              </div>

              <div
                class="bociteAnnuaireText"
                style="margin-top:6px;">
                Établissements classés
                par proximité.
              </div>

            </div>

          `;

          if(
            !results.length
          ){

            html += `

              <div
                class="box"
                style="margin-top:9px;">
                <div class="bociteAnnuaireText">
                  Aucune position exploitable
                  n'est encore disponible
                  dans les fiches chargées.
                </div>
              </div>

            `;

          }else{

            results.forEach(
              function(item){

                html +=
                  getResultCard(
                    item.entity,
                    item.distance
                  );
              }
            );
          }

          html += `

            <button
              id="annuaireNearBackBtn"
              class="choiceBtn"
              type="button"
              style="
                width:100%;
                margin-top:10px;
              ">
              Retour à l'annuaire
            </button>

          `;

          render(
            "Près de moi",
            html,
            function(){

              bindResultActions();

              const back =
                getElement(
                  "annuaireNearBackBtn"
                );

              if(back){

                back.onclick =
                  openHome;
              }
            }
          );
        },
        function(){

          alert(
            "Votre position n'a pas pu être obtenue."
          );
        },
        {
          enableHighAccuracy:false,
          timeout:7000,
          maximumAge:300000
        }
      );
  }


  /* =======================================================
     OUVERT MAINTENANT
     ======================================================= */

  function openCurrentlyOpen(){

    const commune =
      normalizeText(
        getCurrentCommune()
      );

    const results =
      loadEntities()
      .filter(
        function(entity){

          return (
            normalizeText(
              entity.commune
            ) === commune &&
            getOpenStatus(
              entity
            ) ===
            "Ouvert"
          );
        }
      )
      .sort(
        function(a,b){

          return String(
            a.name ||
            ""
          )
          .localeCompare(
            String(
              b.name ||
              ""
            ),
            "fr",
            {
              sensitivity:"base"
            }
          );
        }
      );

    openGenericEntityList(
      "Ouvert maintenant",
      results
    );
  }

   /* =======================================================
     ESPACE PROFESSIONNEL ENRICHI
     ======================================================= */

  function openProfessionalDashboard(){

    const history =
      loadProfessionalHistory();

    const notebook =
      loadNotebook();

    const followed =
      loadFollowed();

    render(
      "Espace professionnel",
      `

        <div
          class="box"
          style="
            border-left:6px solid #2f5d46;
          ">

          <div class="bociteAnnuaireTitle">
            Annuaire professionnel enrichi
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Recherchez, conservez et suivez
            les entreprises utiles à votre activité.
          </div>

        </div>

        <button
          id="annuaireProNewSearchBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Nouvelle recherche professionnelle
        </button>

        <div
          class="bociteAnnuaireGrid"
          style="margin-top:9px;">

          <button
            id="annuaireProHistoryBtn"
            class="choiceBtn"
            type="button">

            <strong>
              Mes recherches
            </strong>

            <br>

            <span
              style="
                font-size:12px;
                font-weight:400;
              ">
              ${history.length}
              enregistrée${history.length > 1 ? "s" : ""}
            </span>

          </button>

          <button
            id="annuaireProNotebookBtn"
            class="choiceBtn"
            type="button">

            <strong>
              Mon carnet
            </strong>

            <br>

            <span
              style="
                font-size:12px;
                font-weight:400;
              ">
              ${notebook.length}
              fiche${notebook.length > 1 ? "s" : ""}
            </span>

          </button>

          <button
            id="annuaireProFollowedBtn"
            class="choiceBtn"
            type="button">

            <strong>
              Entreprises suivies
            </strong>

            <br>

            <span
              style="
                font-size:12px;
                font-weight:400;
              ">
              ${followed.length}
              suivie${followed.length > 1 ? "s" : ""}
            </span>

          </button>

          <button
            id="annuaireProBercyBtn"
            class="choiceBtn"
            type="button">

            <strong>
              Bercy Infos Entreprises
            </strong>

            <br>

            <span
              style="
                font-size:12px;
                font-weight:400;
              ">
              Informations utiles
            </span>

          </button>

        </div>


        <div
          class="box"
          style="margin-top:10px;">

          <div class="bociteAnnuaireTitle">
            Vos priorités
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Retrouvez rapidement les recherches
            et entreprises que vous souhaitez suivre.
          </div>

        </div>


        <button
          id="annuaireProBackBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:10px;
          ">
          Retour à l'annuaire
        </button>

      `,
      function(){

        const newSearch =
          getElement(
            "annuaireProNewSearchBtn"
          );

        if(newSearch){

          newSearch.onclick =
            openProfessionalSearchForm;
        }


        const historyBtn =
          getElement(
            "annuaireProHistoryBtn"
          );

        if(historyBtn){

          historyBtn.onclick =
            openProfessionalHistory;
        }


        const notebookBtn =
          getElement(
            "annuaireProNotebookBtn"
          );

        if(notebookBtn){

          notebookBtn.onclick =
            openProfessionalNotebook;
        }


        const followedBtn =
          getElement(
            "annuaireProFollowedBtn"
          );

        if(followedBtn){

          followedBtn.onclick =
            openFollowedCompanies;
        }


        const bercyBtn =
          getElement(
            "annuaireProBercyBtn"
          );

        if(bercyBtn){

          bercyBtn.onclick =
            openBercyInfos;
        }


        const back =
          getElement(
            "annuaireProBackBtn"
          );

        if(back){

          back.onclick =
            openHome;
        }
      }
    );
  }

  /* =======================================================
     NOUVELLE RECHERCHE PROFESSIONNELLE
     ======================================================= */

  function openProfessionalSearchForm(){

    render(
      "Recherche professionnelle",
      `

        <div class="box">

          <div class="bociteAnnuaireTitle">
            Que recherchez-vous ?
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Entreprise, fournisseur,
            prestataire, compétence ou service.
          </div>

        </div>


        <div
          class="box"
          style="margin-top:9px;">

          <label
            for="annuaireProQueryInput"
            class="bociteAnnuaireTitle">
            Recherche
          </label>

          <input
            id="annuaireProQueryInput"
            type="text"
            autocomplete="off"
            placeholder="Ex. transport, imprimeur, maintenance..."
            style="
              width:100%;
              min-height:44px;
              box-sizing:border-box;
              margin-top:7px;
              padding:10px;
              border:1px solid #bbb;
              border-radius:8px;
              font-size:14px;
            "
          >


          <label
            for="annuaireProDetailsInput"
            class="bociteAnnuaireTitle"
            style="
              display:block;
              margin-top:12px;
            ">
            Précisions
          </label>

          <textarea
            id="annuaireProDetailsInput"
            rows="4"
            placeholder="Précisez votre besoin si nécessaire."
            style="
              width:100%;
              box-sizing:border-box;
              margin-top:7px;
              padding:10px;
              border:1px solid #bbb;
              border-radius:8px;
              font-size:14px;
              resize:vertical;
            "
          ></textarea>


          <div
            class="bociteAnnuaireTitle"
            style="margin-top:12px;">
            Zone de recherche
          </div>

          <label
            style="
              display:block;
              margin-top:7px;
              font-size:14px;
            ">
            <input
              type="radio"
              name="annuaireProZone"
              value="commune"
              checked
            >
            Ma commune
          </label>

          <label
            style="
              display:block;
              margin-top:6px;
              font-size:14px;
            ">
            <input
              type="radio"
              name="annuaireProZone"
              value="elargie"
            >
            Recherche élargie
          </label>

        </div>


        <button
          id="annuaireProLaunchBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Lancer la recherche
        </button>


        <button
          id="annuaireProSearchBackBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
          ">
          Retour au tableau professionnel
        </button>

      `,
      function(){

        const launch =
          getElement(
            "annuaireProLaunchBtn"
          );

        if(launch){

          launch.onclick =
            function(){

              const queryInput =
                getElement(
                  "annuaireProQueryInput"
                );

              const detailsInput =
                getElement(
                  "annuaireProDetailsInput"
                );

              const query =
                String(
                  queryInput
                    ? queryInput.value
                    : ""
                ).trim();

              const details =
                String(
                  detailsInput
                    ? detailsInput.value
                    : ""
                ).trim();

              if(!query){

                alert(
                  "Indiquez ce que vous recherchez."
                );

                return;
              }

              const checked =
                document.querySelector(
                  'input[name="annuaireProZone"]:checked'
                );

              const zone =
                checked
                  ? checked.value
                  : "commune";


              const item =
                addProfessionalHistory({

                  query:
                    query,

                  details:
                    details,

                  zone:
                    zone

                });


              openProfessionalSearchResults(
                item
              );
            };
        }


        const back =
          getElement(
            "annuaireProSearchBackBtn"
          );

        if(back){

          back.onclick =
            openProfessionalDashboard;
        }
      }
    );
  }

  /* =======================================================
     RÉSULTATS RECHERCHE PROFESSIONNELLE
     ======================================================= */

  function openProfessionalSearchResults(
    item
  ){

    if(!item){
      return;
    }

    const localOnly =
      item.zone !==
      "elargie";

    let results =
      searchEntities(
        item.query,
        {
          localOnly:
            localOnly
        }
      );

    renderProfessionalSearchResults(
      item,
      results,
      results.length === 0
    );

    /*
      Une seule requête réseau ciblée.
      Pas de chargement global.
    */

    searchNetworkForQuery(
      item.query
    )
    .then(
      function(rows){

        if(!rows.length){
          return;
        }

        mergeNetworkEntities(
          rows
        );

        results =
          searchEntities(
            item.query,
            {
              localOnly:
                localOnly
            }
          );

        renderProfessionalSearchResults(
          item,
          results,
          false
        );
      }
    )
    .catch(
      function(error){

        console.warn(
          "Bo'CitéArt : recherche professionnelle réseau indisponible.",
          error
        );
      }
    );
  }


  function renderProfessionalSearchResults(
    item,
    results,
    searching
  ){

    let html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div class="bociteAnnuaireTitle">
          ${escapeHtml(item.query)}
        </div>

        ${
          item.details
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:6px;">
                  ${escapeHtml(item.details)}
                </div>
              `
            : ""
        }

        <div
          class="bociteAnnuaireSmall"
          style="margin-top:7px;">
          Zone :
          ${
            item.zone ===
            "elargie"
              ? "Recherche élargie"
              : escapeHtml(getCurrentCommune())
          }
        </div>

      </div>

    `;

    if(!results.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireTitle">
            ${
              searching
                ? "Recherche en cours"
                : "Aucun résultat disponible"
            }
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            ${
              searching
                ? (
                    "Bo'CitéArt vérifie les données " +
                    "disponibles pour cette recherche."
                  )
                : (
                    "Aucun établissement correspondant " +
                    "n'a été trouvé pour le moment."
                  )
            }
          </div>

        </div>

      `;

    }else{

      results.forEach(
        function(entity){

          html +=
            getResultCard(
              entity
            );
        }
      );
    }

    html += `

      <button
        id="annuaireProResultsHistoryBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Voir mes recherches professionnelles
      </button>


      <button
        id="annuaireProResultsBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Retour au tableau professionnel
      </button>

    `;


    render(
      "Résultats professionnels",
      html,
      function(){

        bindResultActions();


        const history =
          getElement(
            "annuaireProResultsHistoryBtn"
          );

        if(history){

          history.onclick =
            openProfessionalHistory;
        }


        const back =
          getElement(
            "annuaireProResultsBackBtn"
          );

        if(back){

          back.onclick =
            openProfessionalDashboard;
        }
      }
    );
  }

  /* =======================================================
     HISTORIQUE PROFESSIONNEL
     ======================================================= */

  function openProfessionalHistory(){

    const history =
      loadProfessionalHistory();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Mes recherches professionnelles
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Retrouvez vos recherches en cours
          et celles que vous avez terminées.
        </div>

      </div>

    `;


    if(!history.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireText">
            Aucune recherche professionnelle enregistrée.
          </div>

        </div>

      `;

    }else{

      history.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:9px;">

              <div class="bociteAnnuaireTitle">
                ${escapeHtml(item.query)}
              </div>

              ${
                item.details
                  ? `
                      <div
                        class="bociteAnnuaireText"
                        style="margin-top:5px;">
                        ${escapeHtml(item.details)}
                      </div>
                    `
                  : ""
              }

              <div
                class="bociteAnnuaireSmall"
                style="margin-top:6px;">

                Créée le :
                ${formatDateTime(item.createdAt)}

                <br>

                Statut :
                ${
                  item.status ===
                  "terminee"
                    ? "Terminée"
                    : "En cours"
                }

              </div>


              <div
                class="bociteAnnuaireActions"
                style="margin-top:8px;">

                <button
                  type="button"
                  class="choiceBtn annuaireProResumeBtn"
                  data-id="${escapeHtml(item.id)}">
                  Reprendre
                </button>

                <button
                  type="button"
                  class="choiceBtn annuaireProStatusBtn"
                  data-id="${escapeHtml(item.id)}">
                  ${
                    item.status ===
                    "terminee"
                      ? "Remettre en cours"
                      : "Terminer"
                  }
                </button>

              </div>


              <button
                type="button"
                class="choiceBtn annuaireProDeleteBtn"
                data-id="${escapeHtml(item.id)}"
                style="
                  width:100%;
                  margin-top:6px;
                ">
                Supprimer cette recherche
              </button>

            </div>

          `;
        }
      );


      html += `

        <button
          id="annuaireProHistoryClearBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Tout effacer
        </button>

      `;
    }


    html += `

      <button
        id="annuaireProHistoryBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour au tableau professionnel
      </button>

    `;


    render(
      "Mes recherches professionnelles",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireProResumeBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  const id =
                    button.getAttribute(
                      "data-id"
                    );

                  const item =
                    loadProfessionalHistory()
                    .find(
                      function(row){

                        return (
                          String(row.id) ===
                          String(id)
                        );
                      }
                    );

                  if(item){

                    openProfessionalSearchResults(
                      item
                    );
                  }
                };
            }
          );


        document
          .querySelectorAll(
            ".annuaireProStatusBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  const id =
                    button.getAttribute(
                      "data-id"
                    );

                  const rows =
                    loadProfessionalHistory();

                  const item =
                    rows.find(
                      function(row){

                        return (
                          String(row.id) ===
                          String(id)
                        );
                      }
                    );

                  if(!item){
                    return;
                  }

                  item.status =
                    item.status ===
                    "terminee"
                      ? "en_cours"
                      : "terminee";

                  item.updatedAt =
                    Date.now();

                  saveProfessionalHistory(
                    rows
                  );

                  openProfessionalHistory();
                };
            }
          );


        document
          .querySelectorAll(
            ".annuaireProDeleteBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  removeProfessionalHistoryItem(
                    button.getAttribute(
                      "data-id"
                    )
                  );

                  openProfessionalHistory();
                };
            }
          );


        const clear =
          getElement(
            "annuaireProHistoryClearBtn"
          );

        if(clear){

          clear.onclick =
            function(){

              if(
                window.confirm(
                  "Effacer tout l'historique professionnel ?"
                )
              ){

                clearProfessionalHistory();
                openProfessionalHistory();
              }
            };
        }


        const back =
          getElement(
            "annuaireProHistoryBackBtn"
          );

        if(back){

          back.onclick =
            openProfessionalDashboard;
        }
      }
    );
  }

  /* =======================================================
     CARNET PROFESSIONNEL
     ======================================================= */

  function openProfessionalNotebook(){

    const rows =
      loadNotebook();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Mon carnet professionnel
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Conservez ici les entreprises
          utiles à votre activité.
        </div>

      </div>

    `;


    if(!rows.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">
          <div class="bociteAnnuaireText">
            Votre carnet est vide.
          </div>
        </div>

      `;

    }else{

      rows.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:7px;">

              <button
                type="button"
                class="choiceBtn annuaireNotebookEntityBtn"
                data-id="${escapeHtml(item.entityId)}"
                style="
                  width:100%;
                  text-align:left;
                ">

                <strong>
                  ${escapeHtml(item.name)}
                </strong>

                <br>

                <span
                  style="
                    font-size:12px;
                    font-weight:400;
                  ">
                  ${escapeHtml(item.commune || "")}
                  •
                  ${formatDate(item.savedAt)}
                </span>

              </button>


              <button
                type="button"
                class="choiceBtn annuaireNotebookDeleteBtn"
                data-id="${escapeHtml(item.entityId)}"
                style="
                  width:100%;
                  margin-top:5px;
                ">
                Retirer du carnet
              </button>

            </div>

          `;
        }
      );


      html += `

        <button
          id="annuaireNotebookClearBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Tout effacer
        </button>

      `;
    }


    html += `

      <button
        id="annuaireNotebookBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour au tableau professionnel
      </button>

    `;


    render(
      "Mon carnet professionnel",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireNotebookEntityBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  openEntity(
                    button.getAttribute(
                      "data-id"
                    )
                  );
                };
            }
          );


        document
          .querySelectorAll(
            ".annuaireNotebookDeleteBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  removeNotebookEntity(
                    button.getAttribute(
                      "data-id"
                    )
                  );

                  openProfessionalNotebook();
                };
            }
          );


        const clear =
          getElement(
            "annuaireNotebookClearBtn"
          );

        if(clear){

          clear.onclick =
            function(){

              if(
                window.confirm(
                  "Effacer tout le carnet professionnel ?"
                )
              ){

                clearNotebook();
                openProfessionalNotebook();
              }
            };
        }


        const back =
          getElement(
            "annuaireNotebookBackBtn"
          );

        if(back){

          back.onclick =
            openProfessionalDashboard;
        }
      }
    );
  }

  /* =======================================================
     ENTREPRISES SUIVIES
     ======================================================= */

  function openFollowedCompanies(){

    const rows =
      loadFollowed();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Entreprises suivies
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Retrouvez ici les entreprises
          que vous avez choisi de suivre.
        </div>

      </div>

    `;


    if(!rows.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">
          <div class="bociteAnnuaireText">
            Aucune entreprise suivie pour le moment.
          </div>
        </div>

      `;

    }else{

      rows.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:7px;">

              <button
                type="button"
                class="choiceBtn annuaireFollowedEntityBtn"
                data-id="${escapeHtml(item.entityId)}"
                style="
                  width:100%;
                  text-align:left;
                ">

                <strong>
                  ${escapeHtml(item.name)}
                </strong>

                <br>

                <span
                  style="
                    font-size:12px;
                    font-weight:400;
                  ">
                  ${escapeHtml(item.commune || "")}
                  • suivi depuis le
                  ${formatDate(item.createdAt)}
                </span>

              </button>

            </div>

          `;
        }
      );
    }


    html += `

      <button
        id="annuaireFollowedBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Retour au tableau professionnel
      </button>

    `;


    render(
      "Entreprises suivies",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireFollowedEntityBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  openEntity(
                    button.getAttribute(
                      "data-id"
                    )
                  );
                };
            }
          );


        const back =
          getElement(
            "annuaireFollowedBackBtn"
          );

        if(back){

          back.onclick =
            openProfessionalDashboard;
        }
      }
    );
  }

  /* =======================================================
     BERCY INFOS ENTREPRISES
     ======================================================= */

  function openBercyInfos(){

    render(
      "Bercy Infos Entreprises",
      `

        <div
          class="box"
          style="
            border-left:6px solid #2f5d46;
          ">

          <div class="bociteAnnuaireTitle">
            Bercy Infos Entreprises
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Retrouvez les informations,
            démarches et actualités utiles
            aux entreprises.
          </div>

        </div>


        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireTitle">
            À quoi cela sert ?
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Accéder rapidement aux informations
            publiques utiles pour gérer,
            développer et sécuriser son activité.
          </div>

        </div>


        <button
          id="annuaireBercyOpenBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Ouvrir Bercy Infos Entreprises
        </button>


        <button
          id="annuaireBercyBackBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
          ">
          Retour au tableau professionnel
        </button>

      `,
      function(){

        const open =
          getElement(
            "annuaireBercyOpenBtn"
          );

        if(open){

          open.onclick =
            function(){

              window.open(
                "https://www.economie.gouv.fr/entreprises",
                "_blank",
                "noopener"
              );
            };
        }

        const back =
          getElement(
            "annuaireBercyBackBtn"
          );

        if(back){

          back.onclick =
            openProfessionalDashboard;
        }
      }
    );
  }

   /* =======================================================
     COMPATIBILITÉ AVEC ENTREPRISE.JS
     ======================================================= */

  if(
    typeof module.registerScreen ===
    "function"
  ){

    module.registerScreen(
      "annuaire",
      openHome
    );

    module.registerScreen(
      "annuaire_local",
      openHome
    );

    module.registerScreen(
      "recherche_professionnelle",
      openProfessionalDashboard
    );
  }


  module.openAnnuaire =
    openHome;

  module.openLocalDirectory =
    openHome;

  module.openCorrectedDirectory =
    openHome;

  module.openProfessionalDirectory =
    openProfessionalDashboard;


  /* =======================================================
     FONCTIONS PUBLIQUES DU MODULE
     ======================================================= */

  annuaire.openHome =
    openHome;

  annuaire.openEntity =
    openEntity;

  annuaire.openFavorites =
    openFavorites;

  annuaire.openSearchHistory =
    openSearchHistory;

  annuaire.openViewedHistory =
    openViewedHistory;

  annuaire.openProfessionalDashboard =
    openProfessionalDashboard;

  annuaire.openProfessionalHistory =
    openProfessionalHistory;

  annuaire.openProfessionalNotebook =
    openProfessionalNotebook;

  annuaire.openFollowedCompanies =
    openFollowedCompanies;

  annuaire.searchEntities =
    searchEntities;

  annuaire.searchEntitiesByTrade =
    searchEntitiesByTrade;

  annuaire.searchNetworkForQuery =
    searchNetworkForQuery;

  annuaire.mergeNetworkEntities =
    mergeNetworkEntities;


  /* =======================================================
     PRÉPARATION FUTURE SERVEUR
     ======================================================= */

  /*
    Le jour où Bo'CitéArt passe sur serveur,
    on pourra remplacer uniquement cette fonction
    par un fournisseur serveur sécurisé.

    Tout le reste de l'annuaire pourra rester identique.
  */

  annuaire.refreshFromProvider =
    function(){

      const rows =
        loadEntities();

      return Promise.resolve({
        updated:false,
        preserved:true,
        count:
          rows.length,
        source:
          "Stockage local Bo'CitéArt"
      });
    };

/* =======================================================
   SÉCURISATION ANNUAIRE
   BOUTONS DYNAMIQUES + PRÉPARATION AGENT IA
   ======================================================= */

/*
  Ce correctif ne recrée aucune page.

  Il sécurise uniquement les boutons
  qui peuvent être reconstruits par la modale
  après l'exécution de bindHome().
*/

if(
  !window.BOCITE_ANNUAIRE_ACTIONS_SECURISEES
){

  window.BOCITE_ANNUAIRE_ACTIONS_SECURISEES =
    true;

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


      /* -------------------------------
         CONSULTÉS RÉCEMMENT
         ------------------------------- */

      const viewedButton =
        target.closest(
          "#annuaireViewedBtn"
        );

      if(viewedButton){

        event.preventDefault();
        event.stopPropagation();

        if(
          typeof event.stopImmediatePropagation ===
          "function"
        ){
          event.stopImmediatePropagation();
        }

        openViewedHistory();

        return;
      }


      /* -------------------------------
         COMPRENDRE LES SYMBOLES
         ------------------------------- */

      const legendButton =
        target.closest(
          "#annuaireLegendBtn"
        );

      if(legendButton){

        event.preventDefault();
        event.stopPropagation();

        if(
          typeof event.stopImmediatePropagation ===
          "function"
        ){
          event.stopImmediatePropagation();
        }

        const legendBox =
          getElement(
            "annuaireLegendBox"
          );

        if(!legendBox){
          return;
        }

        legendBox.style.display =
          legendBox.style.display ===
          "none"
            ? "block"
            : "none";

        return;
      }


      /* -------------------------------
         ESPACE PROFESSIONNEL
         ------------------------------- */

      const professionalButton =
        target.closest(
          "#annuaireProfessionalBtn"
        );

      if(professionalButton){

        event.preventDefault();
        event.stopPropagation();

        if(
          typeof event.stopImmediatePropagation ===
          "function"
        ){
          event.stopImmediatePropagation();
        }

        openProfessionalDashboard();

        return;
      }

    },
    true
  );
}


/* =======================================================
   AGENT IA — POINT DE RACCORDEMENT
   ======================================================= */

/*
  IMPORTANT :

  Aucune clé IA n'est placée
  dans le JavaScript public.

  Pour la démonstration :
  l'annuaire utilise déjà
  la recherche réseau légère.

  Pour la version officielle :
  le serveur Bo'CitéArt pourra installer :

  window.BociteAnnuaireAIProvider

  sans modifier les écrans
  ni les historiques de l'annuaire.
*/

annuaire.Agent =
  annuaire.Agent || {};


/*
  Indique si un véritable
  agent serveur est raccordé.
*/

annuaire.Agent.isConnected =
function(){

  return !!(
    window.BociteAnnuaireAIProvider &&
    typeof
      window.BociteAnnuaireAIProvider.enrich ===
      "function"
  );
};


/*
  Préparation d'une fiche.

  Si l'agent serveur existe :
  il pourra compléter et vérifier
  les informations.

  Sinon :
  la fiche actuelle est conservée
  sans modification.
*/

annuaire.Agent.enrichEntity =
function(entity){

  if(!entity){

    return Promise.resolve(
      null
    );
  }

  const provider =
    window.BociteAnnuaireAIProvider;

  if(
    !provider ||
    typeof provider.enrich !==
    "function"
  ){

    return Promise.resolve(
      entity
    );
  }

  return Promise
    .resolve(
      provider.enrich(
        entity
      )
    )
    .then(function(result){

      if(
        !result ||
        typeof result !==
        "object"
      ){

        return entity;
      }

      /*
        Les informations déjà validées
        par Bo'CitéArt restent prioritaires.
      */

      const enriched =
        Object.assign(
          {},
          result,
          entity
        );

      return enriched;
    })
    .catch(function(error){

      console.warn(
        "Bo'CitéArt : agent IA indisponible.",
        error
      );

      return entity;
    });
};


/*
  Recherche assistée.

  Pour le moment,
  elle utilise le raccord réseau
  déjà présent dans ce fichier.

  Plus tard, le serveur IA pourra
  prendre la main sans changer
  la fonction appelée par l'interface.
*/

annuaire.Agent.search =
function(query){

  const provider =
    window.BociteAnnuaireAIProvider;

  if(
    provider &&
    typeof provider.search ===
    "function"
  ){

    return Promise.resolve(
      provider.search({
        query:
          String(query || "").trim(),

        commune:
          getCurrentCommune(),

        postalCode:
          getCurrentPostalCode(),

        inseeCode:
          getCurrentInseeCode()
      })
    );
  }

  return searchNetworkForQuery(
    query
  );
};


console.log(
  "✅ Annuaire — boutons sécurisés et raccord agent IA préparé"
);
   
  /* =======================================================
     DÉMARRAGE
     ======================================================= */

  window.setTimeout(
    function(){

      annuaire
        .refreshFromProvider()
        .then(
          function(result){

            console.log(
              "✅ Annuaire Bo'CitéArt prêt",
              result
            );
          }
        );

    },
    100
  );

  console.log(
    "✅ Bo'CitéArt — Annuaire complet chargé"
  );

})();
