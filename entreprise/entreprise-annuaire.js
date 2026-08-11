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
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt Annuaire : module Entreprise introuvable."
    );

    return;
  }

  /* =======================================================
     ESPACE DU MODULE
     ======================================================= */

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

  function getElement(id){

    return document.getElementById(id);
  }

  function normalizeText(value){

    return String(value || "")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .trim();
  }

  function escapeHtml(value){

    return String(value || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function loadJson(key, fallback){

    try{

      const raw =
        localStorage.getItem(key);

      if(!raw){
        return fallback;
      }

      const parsed =
        JSON.parse(raw);

      return parsed;

    }catch(error){

      console.warn(
        "Bo'CitéArt Annuaire : lecture impossible",
        key,
        error
      );

      return fallback;
    }
  }

  function saveJson(key, value){

    try{

      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

      return true;

    }catch(error){

      console.warn(
        "Bo'CitéArt Annuaire : sauvegarde impossible",
        key,
        error
      );

      return false;
    }
  }

  function formatDate(timestamp){

    if(!timestamp){
      return "";
    }

    try{

      return new Date(
        timestamp
      ).toLocaleDateString(
        "fr-FR",
        {
          day:"2-digit",
          month:"2-digit",
          year:"numeric"
        }
      );

    }catch(error){

      return "";
    }
  }

  function formatDateTime(timestamp){

    if(!timestamp){
      return "";
    }

    try{

      return new Date(
        timestamp
      ).toLocaleString(
        "fr-FR"
      );

    }catch(error){

      return "";
    }
  }

  function uniqueId(prefix){

    return (
      prefix +
      "_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2,8)
    );
  }

  function safeArray(value){

    return Array.isArray(value)
      ? value
      : [];
  }

function getCurrentCommune(){

  try{

    const config =
      JSON.parse(
        localStorage.getItem(
          "bociteart_city_config_v1"
        ) || "{}"
      );

    if(
      config &&
      config.active === true &&
      config.cityName
    ){
      return String(
        config.cityName
      ).trim();
    }

  }catch(error){
    /* aucune action */
  }

  return "votre ville";
}

  function getModalContent(){

    return document.querySelector(
      ".modal-content," +
      ".modalContent," +
      "#modalContent"
    );
  }

  function scrollModalTop(){

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
  }

  function render(
    title,
    html,
    callback
  ){

  module.renderModal(
  title,
  `
    <div class="bociteAnnuaireRoot">
      ${html}
    </div>
  `
);

    window.setTimeout(
      function(){

        scrollModalTop();

        if(
          typeof callback ===
          "function"
        ){
          callback();
        }

      },
      0
    );
  }

  function requirePrivateAccess(
    callback
  ){

    if(
      typeof module.requirePrivateAccess ===
      "function"
    ){

      module.requirePrivateAccess(
        callback
      );

      return;
    }

    if(
      typeof module.requirePartnerAccess ===
      "function"
    ){

      module.requirePartnerAccess(
        callback
      );

      return;
    }

    alert(
      "L'accès professionnel privé est momentanément indisponible."
    );
  }

  /* =======================================================
     STYLE DU MODULE
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
        gap:7px;
      }

      .bociteAnnuairePhotoGrid img{
        width:100%;
        aspect-ratio:4/3;
        object-fit:cover;
        border-radius:8px;
      }

      .bociteAnnuaireStars{
        letter-spacing:2px;
        font-size:20px;
      }

      .bociteAnnuaireDashboardCard{
        margin-bottom:10px;
      }

      .bociteAnnuaireDragHandle{
        cursor:grab;
        user-select:none;
        font-weight:700;
      }

      @media(max-width:420px){

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

  injectStyles();

  /* =======================================================
     LOGO
     ======================================================= */

  function getLogoHtml(){

    return `
      <strong
        style="
          display:inline-block;
          white-space:nowrap;
          font-weight:900;
        ">
        <span style="color:#2f5d46;">
          Bo'Cité
        </span><span style="color:#b00020;">
          Art
        </span>
      </strong>
    `;
  }

  /* =======================================================
     REPÈRES VISUELS
     ======================================================= */

  function partnerBadge(){

    return `
      <span
        title="Partenaire Bo'CitéArt"
        style="
          display:inline-flex;
          align-items:center;
          gap:5px;
        ">
        <span
          style="
            width:13px;
            height:13px;
            border-radius:50%;
            background:#2f8f4e;
            display:inline-block;
          ">
        </span>
        <span style="font-size:12px;">
          Partenaire
        </span>
      </span>
    `;
  }

  function bocitecoinBadge(){

    return `
      <span
        title="Participe au programme bocitecoins"
        style="
          display:inline-flex;
          align-items:center;
          gap:5px;
        ">
        <span
          style="
            width:0;
            height:0;
            border-left:7px solid transparent;
            border-right:7px solid transparent;
            border-bottom:13px solid #e58a1f;
            display:inline-block;
          ">
        </span>
        <span style="font-size:12px;">
          bocitecoins
        </span>
      </span>
    `;
  }

  function commerceBadge(){

    return `
      <span
        title="Commerce"
        style="
          display:inline-flex;
          align-items:center;
          gap:5px;
        ">
        <span
          style="
            width:13px;
            height:13px;
            background:#b00020;
            display:inline-block;
          ">
        </span>
        <span style="font-size:12px;">
          Commerce
        </span>
      </span>
    `;
  }

  function entrepriseBadge(){

    return `
      <span
        title="Entreprise ou professionnel"
        style="
          display:inline-flex;
          align-items:center;
          gap:5px;
        ">
        <span
          style="
            width:13px;
            height:13px;
            background:#2874a6;
            display:inline-block;
          ">
        </span>
        <span style="font-size:12px;">
          Entreprise / professionnel
        </span>
      </span>
    `;
  }

  function getBadgesHtml(entity){

    const badges = [];

    if(entity.partner){
      badges.push(
        partnerBadge()
      );
    }

    if(entity.bocitecoins){
      badges.push(
        bocitecoinBadge()
      );
    }

    if(
      entity.kind ===
      "commerce"
    ){
      badges.push(
        commerceBadge()
      );
    }

    if(
      entity.kind ===
      "entreprise" ||
      entity.kind ===
      "professionnel"
    ){
      badges.push(
        entrepriseBadge()
      );
    }

    return `
      <div
        class="bociteAnnuaireBadgeRow">
        ${badges.join("")}
      </div>
    `;
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

    const data =
      loadJson(
        STORAGE.entities,
        []
      );

    return safeArray(data);
  }

  function saveEntities(data){

    saveJson(
      STORAGE.entities,
      safeArray(data)
    );
  }

  function getEntityById(id){

    return loadEntities()
      .find(function(entity){

        return (
          String(entity.id) ===
          String(id)
        );
      }) || null;
  }

  /*
    Cette fonction permettra plus tard
    au véritable agent / fournisseur de données
    de transmettre un instantané actualisé
    de l'annuaire.

    Le navigateur ne visite pas lui-même
    BODACC, Infogreffe ou d'autres services.
  */

  function applyExternalDirectorySnapshot(
    rows,
    sourceLabel
  ){

    const entities =
      safeArray(rows);

    saveEntities(
      entities
    );

    saveJson(
      STORAGE.updateState,
      {
        updatedAt:
          Date.now(),

        source:
          sourceLabel ||
          "Source externe autorisée",

        count:
          entities.length
      }
    );

    return entities.length;
  }

  annuaire.applyExternalDirectorySnapshot =
    applyExternalDirectorySnapshot;

  /* =======================================================
     SYNONYMES DE RECHERCHE
     ======================================================= */

  const SEARCH_SYNONYMS = {

    "fuite":[
      "plombier",
      "plomberie"
    ],

    "toiture":[
      "couvreur",
      "couverture",
      "zinguerie"
    ],

    "chaudiere":[
      "chauffagiste",
      "chauffage"
    ],

    "mal au pied":[
      "podologue",
      "pedicure-podologue"
    ],

    "kine":[
      "kinesitherapeute"
    ],

    "repas":[
      "restaurant",
      "traiteur"
    ],

    "voiture":[
      "garage",
      "automobile"
    ]

  };

  function expandSearchTerms(query){

    const normalized =
      normalizeText(query);

    let terms = [
      normalized
    ];

    Object.keys(
      SEARCH_SYNONYMS
    )
    .forEach(function(key){

      if(
        normalized.includes(
          normalizeText(key)
        )
      ){

        terms =
          terms.concat(
            SEARCH_SYNONYMS[key]
              .map(normalizeText)
          );
      }
    });

    return Array.from(
      new Set(terms)
    );
  }

  function entitySearchText(entity){

    return normalizeText(
      [
        entity.name,
        entity.trade,
        entity.category,
        entity.subcategory,
        entity.activity,
        entity.description,
        safeArray(entity.services)
          .join(" "),
        safeArray(entity.keywords)
          .join(" "),
        entity.commune
      ].join(" ")
    );
  }

  function searchEntities(
    query,
    options
  ){

    options =
      options || {};

    const commune =
      normalizeText(
        options.commune ||
        getCurrentCommune()
      );

    const terms =
      expandSearchTerms(
        query
      );

    return loadEntities()
      .filter(function(entity){

        if(
          options.localOnly !==
          false
        ){

          if(
            normalizeText(
              entity.commune
            ) !== commune
          ){
            return false;
          }
        }

        if(options.category){

          const category =
            normalizeText(
              options.category
            );

          const entityCategories =
            normalizeText(
              [
                entity.category,
                entity.subcategory,
                entity.trade,
                entity.kind
              ].join(" ")
            );

          if(
            !entityCategories.includes(
              category
            )
          ){
            return false;
          }
        }

        if(!query){
          return true;
        }

        const haystack =
          entitySearchText(
            entity
          );

        return terms.some(
          function(term){

            return haystack.includes(
              term
            );
          }
        );
      })
      .sort(function(a,b){

        return String(
          a.name || ""
        ).localeCompare(
          String(
            b.name || ""
          ),
          "fr"
        );
      });
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
      String(query || "").trim();

    if(!cleanQuery){
      return;
    }

    let history =
      loadSearchHistory();

    const normalized =
      normalizeText(cleanQuery);

    history =
      history.filter(function(item){

        return !(
          normalizeText(
            item.query
          ) === normalized &&
          normalizeText(
            item.commune
          ) ===
          normalizeText(
            commune
          )
        );
      });

    history.unshift({

      id:
        uniqueId("search"),

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
   
   function removeSearchHistoryItem(id){

  const history =
    loadSearchHistory()
      .filter(function(item){

        return (
          String(item.id) !==
          String(id)
        );
      });

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
      history.filter(function(item){

        return (
          String(item.entityId) !==
          String(entity.id)
        );
      });

    history.unshift({

      id:
        uniqueId("view"),

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

  function isFavorite(entityId){

    return loadFavorites()
      .some(function(item){

        return (
          String(item.entityId) ===
          String(entityId)
        );
      });
  }

  function toggleFavorite(entity){

    let favorites =
      loadFavorites();

    const exists =
      favorites.some(
        function(item){

          return (
            String(item.entityId) ===
            String(entity.id)
          );
        }
      );

    if(exists){

      favorites =
        favorites.filter(
          function(item){

            return (
              String(item.entityId) !==
              String(entity.id)
            );
          }
        );

    }else{

      favorites.unshift({

        entityId:
          entity.id,

        name:
          entity.name,

        commune:
          entity.commune,

        savedAt:
          Date.now()

      });
    }

    saveJson(
      STORAGE.favorites,
      favorites
    );

    return !exists;
  }

  /* =======================================================
     APPRÉCIATIONS
     ======================================================= */

  function loadRatings(){

    return safeArray(
      loadJson(
        STORAGE.ratings,
        []
      )
    );
  }

  function getRatingsForEntity(
    entityId
  ){

    return loadRatings()
      .filter(function(rating){

        return (
          String(
            rating.entityId
          ) ===
          String(entityId) &&
          rating.verified === true
        );
      });
  }

  function average(values){

    if(!values.length){
      return 0;
    }

    const total =
      values.reduce(
        function(sum,value){

          return (
            sum +
            Number(value || 0)
          );
        },
        0
      );

    return (
      total /
      values.length
    );
  }

  function getRatingSummary(
    entityId
  ){

    const ratings =
      getRatingsForEntity(
        entityId
      );

    if(
      ratings.length <
      MINIMUM_RATINGS
    ){

      return {
        visible:false,
        count:
          ratings.length
      };
    }

    const globalValues =
      ratings.map(function(rating){

        return average([
          rating.welcome,
          rating.quality,
          rating.value
        ]);
      });

    const recommendation =
      ratings.filter(
        function(rating){

          return (
            rating.recommend ===
            true
          );
        }
      ).length;

    const dates =
      ratings
        .map(function(rating){

          return Number(
            rating.createdAt || 0
          );
        })
        .filter(Boolean)
        .sort(function(a,b){

          return a-b;
        });

    return {

      visible:true,

      count:
        ratings.length,

      global:
        average(
          globalValues
        ),

      welcome:
        average(
          ratings.map(
            function(r){
              return r.welcome;
            }
          )
        ),

      quality:
        average(
          ratings.map(
            function(r){
              return r.quality;
            }
          )
        ),

      value:
        average(
          ratings.map(
            function(r){
              return r.value;
            }
          )
        ),

      recommendPercent:
        Math.round(
          (
            recommendation /
            ratings.length
          ) * 100
        ),

      from:
        dates[0] || 0,

      to:
        dates[
          dates.length - 1
        ] || 0

    };
  }

  /*
    Une appréciation ne peut être enregistrée
    comme vérifiée que par une interaction
    reconnue par Bo'CitéArt.

    Cette méthode est volontairement publique
    pour être appelée plus tard par le système
    de preuve de fréquentation.
  */

  function recordVerifiedRating(
    entityId,
    values,
    verificationReference
  ){

    const ratings =
      loadRatings();

    ratings.push({

      id:
        uniqueId("rating"),

      entityId:
        entityId,

      welcome:
        Number(
          values.welcome || 0
        ),

      quality:
        Number(
          values.quality || 0
        ),

      value:
        Number(
          values.value || 0
        ),

      recommend:
        values.recommend ===
        true,

      verified:true,

      verificationReference:
        verificationReference ||
        "",

      createdAt:
        Date.now()

    });

    saveJson(
      STORAGE.ratings,
      ratings
    );
  }

  annuaire.recordVerifiedRating =
    recordVerifiedRating;

  /* =======================================================
     HORAIRES
     ======================================================= */

  function getOpenStatus(entity){

    if(!entity.hours){
      return "";
    }

    /*
      Format possible :
      hours:{
        1:[["09:00","12:00"],["14:00","18:00"]],
        2:[...]
      }

      0 = dimanche
      1 = lundi
    */

    const now =
      new Date();

    const day =
      now.getDay();

    const periods =
      safeArray(
        entity.hours[day]
      );

    if(!periods.length){

      return "Fermé aujourd'hui";
    }

    const currentMinutes =
      (
        now.getHours() *
        60
      ) +
      now.getMinutes();

    const opened =
      periods.some(
        function(period){

          if(
            !Array.isArray(period) ||
            period.length < 2
          ){
            return false;
          }

          function toMinutes(value){

            const parts =
              String(value)
                .split(":");

            return (
              Number(parts[0] || 0) *
              60
            ) +
            Number(parts[1] || 0);
          }

          const start =
            toMinutes(
              period[0]
            );

          const end =
            toMinutes(
              period[1]
            );

          return (
            currentMinutes >= start &&
            currentMinutes <= end
          );
        }
      );

    return opened
      ? "Ouvert maintenant"
      : "Fermé actuellement";
  }

  /* =======================================================
     GÉOLOCALISATION
     ======================================================= */

  function distanceKm(
    lat1,
    lon1,
    lat2,
    lon2
  ){

    const R =
      6371;

    function rad(value){

      return (
        value *
        Math.PI /
        180
      );
    }

    const dLat =
      rad(
        lat2-lat1
      );

    const dLon =
      rad(
        lon2-lon1
      );

    const a =
      Math.sin(
        dLat/2
      ) ** 2 +
      Math.cos(
        rad(lat1)
      ) *
      Math.cos(
        rad(lat2)
      ) *
      Math.sin(
        dLon/2
      ) ** 2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1-a)
      );

    return R*c;
  }

  /* =======================================================
     LÉGENDE
     ======================================================= */

  function getLegendHtml(){

    return `

      <div
        id="annuaireLegendBox"
        class="box"
        style="
          display:none;
          margin-top:10px;
        ">

        <div
          class="bociteAnnuaireTitle">
          Comprendre les repères
        </div>

        <div
          style="margin-top:12px;">
          ${partnerBadge()}
        </div>

        <div
          class="bociteAnnuaireSmall"
          style="margin:4px 0 12px 22px;">
          Établissement ayant rejoint
          officiellement Bo'CitéArt.
        </div>

        <div>
          ${bocitecoinBadge()}
        </div>

        <div
          class="bociteAnnuaireSmall"
          style="margin:4px 0 12px 22px;">
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
          L'annuaire est régulièrement
          actualisé afin d'intégrer
          les créations,
          modifications
          et cessations identifiées
          à partir de données fiables.
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
        .map(function(category){

          return `

            <button
              type="button"
              class="choiceBtn annuaireCategoryBtn"
              data-category="${category.id}"
              style="
                width:100%;
                min-height:62px;
                text-align:left;
                margin:0;
              ">

              <strong
                style="
                  display:block;
                  color:#2f5d46;
                  font-size:16px;
                ">
                ${escapeHtml(category.title)}
              </strong>

              <span
                style="
                  display:block;
                  color:#111;
                  font-size:13px;
                  font-weight:400;
                  margin-top:3px;
                ">
                ${escapeHtml(category.subtitle)}
              </span>

            </button>

          `;
        })
        .join("");

    const history =
      loadSearchHistory()
        .slice(0,4);

    const historyHtml =
      history.length
        ? history
            .map(function(item){

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
            })
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
          Trouvez simplement
          ce qui existe près de chez vous.
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

      <div
        class="box"
        style="margin-top:11px;">

        <div class="bociteAnnuaireTitle">
          Un annuaire régulièrement actualisé
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:7px;">

          ${getLogoHtml()}
          rassemble les commerces,
          entreprises,
          artisans,
          professionnels
          et services identifiables
          dans votre commune.

          <br><br>

          <strong>
            Pourquoi chercher loin
            ce qui existe peut-être déjà
            près de chez vous ?
          </strong>

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

  /* =======================================================
     LANCEMENT RECHERCHE
     ======================================================= */

  function launchSearch(
    query,
    options
  ){

    const cleanQuery =
      String(query || "").trim();

    if(!cleanQuery){

      alert(
        "Indiquez un nom, un métier, un produit ou un service."
      );

      return;
    }

    addSearchHistory(
      cleanQuery,
      getCurrentCommune()
    );

    openResults(
      cleanQuery,
      options || {}
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
      getOpenStatus(entity);

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
      options || {};

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
            Aucun résultat dans votre ville
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:7px;">
            Vous pouvez élargir votre recherche
            autour de votre commune.
          </div>

          <button
            id="annuaireExpandSearchBtn"
            class="choiceBtn"
            type="button"
            style="
              width:100%;
              margin-top:9px;
            ">
            Élargir ma recherche
          </button>

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

        const expand =
          getElement(
            "annuaireExpandSearchBtn"
          );

        if(expand){

          expand.onclick =
            function(){

              const expanded =
                searchEntities(
                  query,
                  {
                    localOnly:false
                  }
                );

              openGenericEntityList(
                "Résultats élargis",
                expanded
              );
            };
        }

      }
    );
  }

  function openGenericEntityList(
    title,
    entities
  ){

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
        style="width:100%;">
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
     CATÉGORIES
     ======================================================= */

  /* =======================================================
   CATÉGORIES → MÉTIERS → ÉTABLISSEMENTS
   ======================================================= */

/*
  Un nom compréhensible par l'utilisateur
  peut correspondre à plusieurs formulations
  dans les données officielles.
*/

const TRADE_SEARCH_TERMS = {

/* SANTÉ */

"Médecins généralistes":[
  "médecin généraliste",
  "médecin",
  "médecine générale"
],

"Infirmiers":[
  "infirmier",
  "infirmière",
  "soins infirmiers"
],

"Kinésithérapeutes":[
  "kinésithérapeute",
  "kinesitherapeute",
  "masseur kinésithérapeute",
  "masseur-kinesitherapeute"
],

"Dentistes":[
  "dentiste",
  "chirurgien dentiste",
  "chirurgien-dentiste",
  "dentaire",
  "pratique dentaire"
],

"Pharmacies":[
  "pharmacie",
  "pharmacien",
  "pharmaceutique",
  "produits pharmaceutiques"
],

"Pédicures-podologues":[
  "podologue",
  "pédicure podologue",
  "pedicure podologue",
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
  "laboratoire analyses médicales",
  "laboratoire médical",
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


  /* MAISON / ARTISANS */

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
    "paysage",
    "espaces verts"
  ],

  "Serruriers":[
    "serrurier",
    "serrurerie"
  ],

  "Entreprises de rénovation":[
    "rénovation",
    "renovation",
    "travaux"
  ],

  /* AUTOMOBILE */

  "Garages automobiles":[
    "garage",
    "automobile",
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
    "vehicule utilitaire",
    "utilitaire"
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
    "boulanger",
    "boulangerie",
    "boulangerie-pâtisserie",
    "boulangerie patisserie",
    "pain"
  ],

  "Boucheries":[
    "boucher",
    "boucherie",
    "charcuterie"
  ],

  "Traiteurs":[
    "traiteur"
  ],

  "Cafés":[
    "café",
    "cafe",
    "débit de boissons",
    "debit de boissons"
  ],

  "Épiceries":[
    "épicerie",
    "epicerie",
    "alimentation générale",
    "alimentation generale"
  ],

  "Commerces alimentaires":[
    "commerce alimentaire",
    "alimentation"
  ],

  /* SERVICES PROFESSIONNELS */

  "Experts-comptables":[
    "expert comptable",
    "expert-comptable",
    "comptabilité",
    "comptabilite"
  ],

  "Avocats":[
    "avocat",
    "activité juridique",
    "activite juridique"
  ],

  "Assurances":[
    "assurance",
    "assureur"
  ],

  "Informatique":[
    "informatique",
    "ordinateur",
    "logiciel"
  ],

  "Communication":[
    "communication",
    "publicité",
    "publicite"
  ],

  "Transport":[
    "transport"
  ],

  "Nettoyage professionnel":[
    "nettoyage",
    "propreté",
    "proprete"
  ],

  "Sécurité":[
    "sécurité",
    "securite",
    "surveillance"
  ],

  "Bureaux d'études":[
    "bureau d'études",
    "bureau d'etudes",
    "ingénierie",
    "ingenierie"
  ],

  "Conseil":[
    "conseil",
    "consultant"
  ],

  /* HÉBERGEMENT */

  "Hôtels":[
    "hôtel",
    "hotel",
    "hôtellerie",
    "hotellerie"
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
    "location courte duree",
    "hébergement touristique",
    "hebergement touristique"
  ],

  "Autres hébergements":[
    "hébergement",
    "hebergement"
  ]

};


/* =======================================================
   RECHERCHE D'UN MÉTIER
   ======================================================= */

function searchEntitiesByTrade(
  trade
){

  const commune =
    normalizeText(
      getCurrentCommune()
    );

  const searchTerms =
    safeArray(
      TRADE_SEARCH_TERMS[trade]
    );

  const terms =
    (
      searchTerms.length
        ? searchTerms
        : [trade]
    )
    .map(normalizeText);

  return loadEntities()
    .filter(function(entity){

      if(
        normalizeText(
          entity.commune
        ) !== commune
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
        DENTISTES

        On évite de classer comme dentiste
        un laboratoire de prothèse dentaire.
      */

      if(
        trade ===
        "Dentistes"
      ){

        const dentalLabTerms = [

          "laboratoire dentaire",
          "laboratoire de prothese dentaire",
          "laboratoire de protheses dentaires",
          "prothese dentaire",
          "prothesiste dentaire"

        ];

        const isDentalLaboratory =
          dentalLabTerms.some(
            function(term){

              return haystack.includes(
                normalizeText(term)
              );
            }
          );

        if(isDentalLaboratory){
          return false;
        }
      }

      /*
        LABORATOIRES D'ANALYSES MÉDICALES

        On évite qu'un laboratoire dentaire
        soit confondu avec un laboratoire
        de biologie médicale.
      */

      if(
        trade ===
        "Laboratoires d'analyses médicales"
      ){

        if(
          haystack.includes(
            normalizeText(
              "laboratoire dentaire"
            )
          ) ||
          haystack.includes(
            normalizeText(
              "prothèse dentaire"
            )
          )
        ){
          return false;
        }
      }

      return true;
    })
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

/* =======================================================
   OUVRIR LES PROFESSIONNELS D'UN MÉTIER
   ======================================================= */

function openTradeResults(
  trade
){

  const results =
    searchEntitiesByTrade(
      trade
    );

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
        style="margin-top:6px;">
        ${escapeHtml(getCurrentCommune())}
      </div>

    </div>

  `;

  if(!results.length){

    html += `

      <div
        class="box"
        style="margin-top:9px;">

        <div class="bociteAnnuaireTitle">
          Aucun résultat disponible
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Aucune fiche correspondant à ce métier
          n'est encore disponible
          dans les données actuellement chargées.
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
          function(){

            openAllTrades();
          };
      }

    }
  );
}


/* =======================================================
   OUVERTURE D'UNE GRANDE CATÉGORIE
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

  /*
    Entreprises :
    pour le moment on conserve
    la liste générale des entreprises.
  */

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
   PAGE INTERMÉDIAIRE : LISTE DES MÉTIERS
   ======================================================= */

function openTradeFamily(
  title,
  trades
){

  const buttons =
    safeArray(trades)
      .map(function(trade){

        const count =
          searchEntitiesByTrade(
            trade
          ).length;

        return `

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
                font-size:12px;
                font-weight:400;
                margin-top:3px;
              ">
              ${
                count
                  ? (
                      count +
                      (
                        count > 1
                          ? " professionnels"
                          : " professionnel"
                      )
                    )
                  : "Données à compléter"
              }
            </span>

          </button>

        `;
      })
      .join("");

  render(
    title,
    `

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

      ${buttons}

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

    `,
    function(){

      document
        .querySelectorAll(
          ".annuaireTradeBtn"
        )
        .forEach(function(button){

          button.onclick =
            function(){

              openTradeResults(
                button.getAttribute(
                  "data-trade"
                ) || ""
              );
            };
        });

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
   TOUS LES MÉTIERS
   ======================================================= */

function openAllTrades(){

  const sections = [

    {
      title:"Santé",
      values:
        METIERS.sante
    },

    {
      title:"Maison & travaux",
      values:
        METIERS.maison
    },

    {
      title:"Automobile & mobilité",
      values:
        METIERS.automobile
    },

    {
      title:"Restaurants & alimentation",
      values:
        METIERS.alimentation
    },

    {
      title:"Services aux entreprises",
      values:
        METIERS.professionnels
    },

    {
      title:"Hôtels & séjours",
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
        Choisissez d'abord un métier.
        Les établissements correspondants
        seront ensuite classés
        par ordre alphabétique.
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

          ${
            section.values
              .map(function(trade){

                const count =
                  searchEntitiesByTrade(
                    trade
                  ).length;

                return `

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
                                  ? " professionnels"
                                  : " professionnel"
                              )
                            )
                          : "Données à compléter"
                      }
                    </span>

                  </button>

                `;
              })
              .join("")
          }

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
        .forEach(function(button){

          button.onclick =
            function(){

              openTradeResults(
                button.getAttribute(
                  "data-trade"
                ) || ""
              );
            };
        });

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
     PHOTOS
     ======================================================= */

  function getPhotosHtml(entity){

    const photos =
      safeArray(
        entity.photos
      )
      .slice(0,8);

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
            photos.map(
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
     PETIT MOT
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

  function signatureTitle(entity){

    if(
      entity.category ===
      "restaurants" ||
      entity.trade ===
      "Restaurant"
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

    return "Le mot du commerçant";
  }

  /* =======================================================
     APPRÉCIATIONS — AFFICHAGE
     ======================================================= */

  function getRatingHtml(entity){

    if(
      entity.ratingEnabled ===
      false
    ){
      return "";
    }

    const summary =
      getRatingSummary(
        entity.id
      );

    if(!summary.visible){

      return `

        <div
          class="box"
          style="margin-top:10px;">

          <div class="bociteAnnuaireTitle">
            Appréciations locales
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:7px;">
            Pas encore assez
            d'expériences locales vérifiées
            pour afficher une note représentative.
          </div>

          <div
            class="bociteAnnuaireSmall"
            style="margin-top:5px;">
            ${summary.count}
            expérience(s) vérifiée(s)
            sur ${MINIMUM_RATINGS}
            minimum.
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
          class="bociteAnnuaireStars"
          style="margin-top:7px;">
          ★★★★★
        </div>

        <div
          style="
            font-size:17px;
            font-weight:700;
            margin-top:4px;
          ">
          ${summary.global.toFixed(1)} / 5
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:7px;">
          ${summary.count}
          expériences locales vérifiées
        </div>

        <div
          class="bociteAnnuaireSmall"
          style="margin-top:5px;">
          Période :
          ${formatDate(summary.from)}
          →
          ${formatDate(summary.to)}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:9px;">

          Accueil :
          <strong>
            ${summary.welcome.toFixed(1)} / 5
          </strong>

          <br>

          Qualité / prestation :
          <strong>
            ${summary.quality.toFixed(1)} / 5
          </strong>

          <br>

          Rapport qualité-prix :
          <strong>
            ${summary.value.toFixed(1)} / 5
          </strong>

          <br>

          Recommandent :
          <strong>
            ${summary.recommendPercent} %
          </strong>

        </div>

        <div
          class="bociteAnnuaireSmall"
          style="
            margin-top:9px;
            padding-top:8px;
            border-top:1px solid #ddd;
          ">
          Aucun commentaire public n'est publié.
        </div>

      </div>

    `;
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

    const signature =
      entity.partner
        ? getPartnerSignature(entity)
        : "";

    const officialHotelStars =
      entity.officialHotelStars
        ? `
            <div
              style="
                margin-top:6px;
                font-size:14px;
              ">
              Classement officiel :
              <strong>
                ${"★".repeat(
                  Math.max(
                    0,
                    Math.min(
                      5,
                      Number(
                        entity.officialHotelStars
                      )
                    )
                  )
                )}
              </strong>
            </div>
          `
        : "";

    const lastUpdate =
      entity.verifiedAt
        ? `
            <div
              class="bociteAnnuaireSmall"
              style="margin-top:6px;">
              Informations vérifiées le :
              ${formatDate(entity.verifiedAt)}
            </div>
          `
        : "";

    const source =
      entity.source
        ? `
            <div
              class="bociteAnnuaireSmall">
              Source :
              ${escapeHtml(entity.source)}
            </div>
          `
        : "";

    const services =
      safeArray(
        entity.services
      );

    const servicesHtml =
      services.length
        ? `
            <div
              class="box"
              style="margin-top:10px;">

              <div class="bociteAnnuaireTitle">
                Services et savoir-faire
              </div>

              <div
                class="bociteAnnuaireText"
                style="margin-top:7px;">
                ${
                  services
                    .map(function(service){

                      return (
                        "• " +
                        escapeHtml(service)
                      );
                    })
                    .join("<br>")
                }
              </div>

            </div>
          `
        : "";

    const signatureHtml =
      signature
        ? `
            <div
              class="box"
              style="margin-top:10px;">

              <div class="bociteAnnuaireTitle">
                ${escapeHtml(
                  signatureTitle(entity)
                )}
              </div>

              <div class="bociteAnnuaireSignature">
                ${escapeHtml(signature)}
              </div>

            </div>
          `
        : "";

    const menuHtml =
      entity.menuUrl
        ? `
            <button
              id="annuaireMenuBtn"
              class="choiceBtn"
              type="button"
              style="width:100%;">
              Voir la carte / le menu
            </button>
          `
        : "";

    const employmentHtml = `

      <div
        class="box"
        style="margin-top:10px;">

        <div class="bociteAnnuaireTitle">
          Emploi
        </div>

        ${
          entity.recruiting
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:6px;">
                  Cette entreprise recrute actuellement.
                </div>

                <button
                  id="annuaireJobsBtn"
                  class="choiceBtn"
                  type="button"
                  style="
                    width:100%;
                    margin-top:8px;
                  ">
                  Voir ses offres d'emploi
                </button>
              `
            : ""
        }

        <div
          class="bociteAnnuaireText"
          style="margin-top:8px;">
          Cette entreprise vous intéresse ?
        </div>

        <button
          id="annuaireSpontaneousBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
          ">
          Envoyer une candidature spontanée
        </button>

      </div>

    `;

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        ${getBadgesHtml(entity)}

        <div
          class="bociteAnnuaireTitle"
          style="margin-top:8px;">
          ${escapeHtml(entity.name)}
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

        ${officialHotelStars}

        <div
          class="bociteAnnuaireText"
          style="margin-top:8px;">
          ${escapeHtml(entity.address || "")}
          ${
            entity.address
              ? "<br>"
              : ""
          }
          ${escapeHtml(entity.postalCode || "")}
          ${escapeHtml(entity.commune || "")}
        </div>

        ${
          entity.phone
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:6px;">
                  Téléphone :
                  ${escapeHtml(entity.phone)}
                </div>
              `
            : ""
        }

        ${
          entity.email
            ? `
                <div class="bociteAnnuaireText">
                  E-mail :
                  ${escapeHtml(entity.email)}
                </div>
              `
            : ""
        }

        ${
          getOpenStatus(entity)
            ? `
                <div
                  style="
                    margin-top:6px;
                    font-weight:700;
                    font-size:13px;
                  ">
                  ${escapeHtml(
                    getOpenStatus(entity)
                  )}
                </div>
              `
            : ""
        }

        ${lastUpdate}
        ${source}

      </div>

      <div
        class="bociteAnnuaireActions"
        style="margin-top:9px;">

        ${
          entity.phone
            ? `
                <button
                  id="annuaireEntityCallBtn"
                  class="choiceBtn"
                  type="button">
                  Appeler
                </button>
              `
            : ""
        }

        <button
          id="annuaireEntityRouteBtn"
          class="choiceBtn"
          type="button">
          Itinéraire
        </button>

        ${
          entity.email
            ? `
                <button
                  id="annuaireEntityMailBtn"
                  class="choiceBtn"
                  type="button">
                  Écrire
                </button>
              `
            : ""
        }

        ${
          entity.website
            ? `
                <button
                  id="annuaireEntityWebBtn"
                  class="choiceBtn"
                  type="button">
                  Site internet
                </button>
              `
            : ""
        }

      </div>

      <button
        id="annuaireFavoriteToggleBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        ${
          favorite
            ? "Retirer de mes favoris"
            : "Enregistrer cette adresse"
        }
      </button>

      ${
        entity.description
          ? `
              <div
                class="box"
                style="margin-top:10px;">

                <div class="bociteAnnuaireTitle">
                  Présentation
                </div>

                <div
                  class="bociteAnnuaireText"
                  style="margin-top:7px;">
                  ${escapeHtml(entity.description)}
                </div>

              </div>
            `
          : ""
      }

      ${servicesHtml}

      ${getPhotosHtml(entity)}

      ${menuHtml}

      ${signatureHtml}

      ${employmentHtml}

      ${getRatingHtml(entity)}

      <button
        id="annuaireReportBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        Signaler une information incorrecte
      </button>

      ${
        entity.partner
          ? `
              <button
                id="annuairePartnerEditBtn"
                class="choiceBtn"
                type="button"
                style="
                  width:100%;
                  margin-top:8px;
                ">
                Modifier ma présentation partenaire
              </button>
            `
          : ""
      }

      <button
        id="annuaireEntityBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
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

              window.location.href =
                "tel:" +
                String(
                  entity.phone
                ).replace(
                  /\s+/g,
                  ""
                );
            };
        }

        const mail =
          getElement(
            "annuaireEntityMailBtn"
          );

        if(mail){

          mail.onclick =
            function(){

              window.location.href =
                "mailto:" +
                entity.email;
            };
        }

        const web =
          getElement(
            "annuaireEntityWebBtn"
          );

        if(web){

          web.onclick =
            function(){

              window.open(
                entity.website,
                "_blank",
                "noopener"
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

              const address =
                [
                  entity.address,
                  entity.postalCode,
                  entity.commune
                ]
                .filter(Boolean)
                .join(" ");

              window.open(
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(
                  address
                ),
                "_blank",
                "noopener"
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

              const added =
                toggleFavorite(
                  entity
                );

              favoriteBtn.textContent =
                added
                  ? "Retirer de mes favoris"
                  : "Enregistrer cette adresse";
            };
        }

        const menu =
          getElement(
            "annuaireMenuBtn"
          );

        if(menu){

          menu.onclick =
            function(){

              window.open(
                entity.menuUrl,
                "_blank",
                "noopener"
              );
            };
        }

        const jobs =
          getElement(
            "annuaireJobsBtn"
          );

        if(jobs){

          jobs.onclick =
            function(){

              if(
                typeof module.openPublicEmploymentList ===
                "function"
              ){

                module.openPublicEmploymentList();
                return;
              }

              if(
                typeof module.openEmploymentPublicHome ===
                "function"
              ){

                module.openEmploymentPublicHome();
                return;
              }

              module.openScreen(
                "emploi"
              );
            };
        }

        const spontaneous =
          getElement(
            "annuaireSpontaneousBtn"
          );

        if(spontaneous){

          spontaneous.onclick =
            function(){

              if(
                typeof module.openApplicationForm ===
                "function"
              ){

                module.openApplicationForm(
                  {
                    companyId:
                      entity.id,

                    companyName:
                      entity.name
                  }
                );

                return;
              }

              if(
                typeof module.openEmploymentPublicHome ===
                "function"
              ){

                module.openEmploymentPublicHome();
                return;
              }

              module.openScreen(
                "emploi"
              );
            };
        }

        const report =
          getElement(
            "annuaireReportBtn"
          );

        if(report){

          report.onclick =
            function(){

              openReportForm(
                entity
              );
            };
        }

        const partnerEdit =
          getElement(
            "annuairePartnerEditBtn"
          );

        if(partnerEdit){

          partnerEdit.onclick =
            function(){

              openPartnerEditor(
                entity
              );
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
     SIGNALEMENT
     ======================================================= */

  function openReportForm(
    entity
  ){

    render(
      "Signaler une information",
      `

        <div class="box">

          <div class="bociteAnnuaireTitle">
            Une information est incorrecte ?
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            ${escapeHtml(entity.name)}
          </div>

        </div>

        <div
          class="box"
          style="margin-top:10px;">

          <label>
            <input
              type="radio"
              name="annuaireReportType"
              value="adresse">
            Adresse incorrecte
          </label>

          <br><br>

          <label>
            <input
              type="radio"
              name="annuaireReportType"
              value="telephone">
            Téléphone incorrect
          </label>

          <br><br>

          <label>
            <input
              type="radio"
              name="annuaireReportType"
              value="horaires">
            Horaires incorrects
          </label>

          <br><br>

          <label>
            <input
              type="radio"
              name="annuaireReportType"
              value="ferme">
            Établissement fermé
          </label>

          <br><br>

          <label>
            <input
              type="radio"
              name="annuaireReportType"
              value="deplace">
            Établissement déplacé
          </label>

          <br><br>

          <label>
            <input
              type="radio"
              name="annuaireReportType"
              value="autre">
            Autre information
          </label>

        </div>

        <button
          id="annuaireReportSendBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:9px;
          ">
          Signaler
        </button>

        <button
          id="annuaireReportBackBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:7px;
          ">
          Retour à la fiche
        </button>

      `,
      function(){

        const send =
          getElement(
            "annuaireReportSendBtn"
          );

        if(send){

          send.onclick =
            function(){

              const selected =
                document.querySelector(
                  "input[name='annuaireReportType']:checked"
                );

              if(!selected){

                alert(
                  "Choisissez l'information à signaler."
                );

                return;
              }

              /*
                Le signalement ne modifie jamais
                directement la fiche.
              */

              const reports =
                safeArray(
                  loadJson(
                    "bociteart_annuaire_reports_v1",
                    []
                  )
                );

              reports.push({

                id:
                  uniqueId("report"),

                entityId:
                  entity.id,

                type:
                  selected.value,

                createdAt:
                  Date.now(),

                status:
                  "a_verifier"

              });

              saveJson(
                "bociteart_annuaire_reports_v1",
                reports
              );

              alert(
                "Merci. L'information sera vérifiée avant toute modification."
              );

              openEntity(
                entity.id
              );
            };
        }

        const back =
          getElement(
            "annuaireReportBackBtn"
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
     PETIT MOT PARTENAIRE
     ======================================================= */

  function openPartnerEditor(
    entity
  ){

    requirePrivateAccess(
      function(){

        if(!entity.partner){

          alert(
            "Cette fonction est réservée aux partenaires Bo'CitéArt."
          );

          return;
        }

        const profiles =
          loadJson(
            STORAGE.partnerProfiles,
            {}
          );

        const saved =
          profiles[
            entity.id
          ] || {};

        const signature =
          saved.signature ||
          entity.signature ||
          "";

        render(
          "Présentation partenaire",
          `

            <div class="box">

              <div class="bociteAnnuaireTitle">
                ${escapeHtml(
                  signatureTitle(entity)
                )}
              </div>

              <div
                class="bociteAnnuaireText"
                style="margin-top:6px;">
                Ajoutez quelques lignes
                personnelles qui vous ressemblent.
                Ce texte devient votre signature
                dans votre fiche publique.
              </div>

            </div>

            <div
              class="box"
              style="margin-top:9px;">

              <textarea
                id="annuairePartnerSignatureInput"
                maxlength="400"
                rows="6"
                style="
                  width:100%;
                  box-sizing:border-box;
                  resize:vertical;
                "
                placeholder="Votre petit mot...">${escapeHtml(signature)}</textarea>

              <div
                class="bociteAnnuaireSmall"
                style="margin-top:6px;">
                400 caractères maximum.
                Pas de promotion,
                remise ou offre commerciale.
                Les campagnes promotionnelles
                utilisent les espaces publicitaires
                prévus dans Bo'CitéArt.
              </div>

            </div>

            <button
              id="annuairePartnerSignatureSaveBtn"
              class="choiceBtn"
              type="button"
              style="
                width:100%;
                margin-top:8px;
              ">
              Enregistrer mon petit mot
            </button>

            <button
              id="annuairePartnerSignatureBackBtn"
              class="choiceBtn"
              type="button"
              style="
                width:100%;
                margin-top:7px;
              ">
              Retour à ma fiche
            </button>

          `,
          function(){

            const save =
              getElement(
                "annuairePartnerSignatureSaveBtn"
              );

            if(save){

              save.onclick =
                function(){

                  const input =
                    getElement(
                      "annuairePartnerSignatureInput"
                    );

                  const value =
                    input
                      ? input.value.trim()
                      : "";

                  profiles[
                    entity.id
                  ] = {

                    ...(profiles[
                      entity.id
                    ] || {}),

                    signature:
                      value,

                    updatedAt:
                      Date.now()

                  };

                  saveJson(
                    STORAGE.partnerProfiles,
                    profiles
                  );

                  alert(
                    "Votre petit mot est enregistré."
                  );

                  openEntity(
                    entity.id
                  );
                };
            }

            const back =
              getElement(
                "annuairePartnerSignatureBackBtn"
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
    );
  }

  /* =======================================================
     HISTORIQUE PUBLIC
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
        Retrouvez une ancienne recherche
        sans avoir à la retaper.
      </div>

    </div>

  `;

  if(!history.length){

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

            <strong
              style="
                color:#2f5d46;
                font-size:15px;
              ">
              ${escapeHtml(item.query)}
            </strong>

            <div
              style="
                font-size:12px;
                margin-top:4px;
                color:#666;
              ">
              ${escapeHtml(item.commune)}
              •
              ${formatDate(item.createdAt)}
            </div>

            <div
              class="bociteAnnuaireActions"
              style="margin-top:8px;">

              <button
                type="button"
                class="choiceBtn annuaireHistoryQueryBtn"
                data-query="${escapeHtml(item.query)}">
                Relancer
              </button>

              <button
                type="button"
                class="choiceBtn annuaireHistoryDeleteBtn"
                data-id="${escapeHtml(item.id)}">
                Supprimer
              </button>

            </div>

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
          margin-top:10px;
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
        .forEach(function(button){

          button.onclick =
            function(){

              launchSearch(
                button.getAttribute(
                  "data-query"
                ) || ""
              );
            };
        });

      document
        .querySelectorAll(
          ".annuaireHistoryDeleteBtn"
        )
        .forEach(function(button){

          button.onclick =
            function(){

              removeSearchHistoryItem(
                button.getAttribute(
                  "data-id"
                )
              );

              openSearchHistory();
            };
        });

      const clearButton =
        getElement(
          "annuaireHistoryClearBtn"
        );

      if(clearButton){

        clearButton.onclick =
          function(){

            if(
              !window.confirm(
                "Effacer toutes vos dernières recherches ?"
              )
            ){
              return;
            }

            clearSearchHistory();

            openSearchHistory();
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

      <div
        class="bociteAnnuaireText"
        style="margin-top:6px;">
        Retrouvez les fiches
        que vous avez déjà consultées.
      </div>

    </div>

  `;

  if(!history.length){

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

            <strong
              style="
                color:#2f5d46;
                font-size:15px;
              ">
              ${escapeHtml(item.name)}
            </strong>

            <div
              style="
                font-size:12px;
                color:#666;
                margin-top:4px;
              ">
              ${escapeHtml(item.commune || "")}
              •
              ${formatDate(item.viewedAt)}
            </div>

            <div
              class="bociteAnnuaireActions"
              style="margin-top:8px;">

              <button
                type="button"
                class="choiceBtn annuaireViewedEntityBtn"
                data-id="${escapeHtml(item.entityId)}">
                Voir la fiche
              </button>

              <button
                type="button"
                class="choiceBtn annuaireViewedDeleteBtn"
                data-id="${escapeHtml(item.id)}">
                Supprimer
              </button>

            </div>

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
          margin-top:10px;
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
        .forEach(function(button){

          button.onclick =
            function(){

              openEntity(
                button.getAttribute(
                  "data-id"
                )
              );
            };
        });

      document
        .querySelectorAll(
          ".annuaireViewedDeleteBtn"
        )
        .forEach(function(button){

          button.onclick =
            function(){

              const id =
                button.getAttribute(
                  "data-id"
                );

              const updated =
                loadViewedHistory()
                  .filter(function(item){

                    return (
                      String(item.id) !==
                      String(id)
                    );
                  });

              saveJson(
                STORAGE.viewedHistory,
                updated
              );

              openViewedHistory();
            };
        });

      const clearButton =
        getElement(
          "annuaireViewedClearBtn"
        );

      if(clearButton){

        clearButton.onclick =
          function(){

            if(
              !window.confirm(
                "Effacer toutes les fiches consultées récemment ?"
              )
            ){
              return;
            }

            saveJson(
              STORAGE.viewedHistory,
              []
            );

            openViewedHistory();
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
        Retrouvez les adresses
        que vous souhaitez conserver.
      </div>

    </div>

  `;

  if(!favorites.length){

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

            <strong
              style="
                color:#2f5d46;
                font-size:15px;
              ">
              ${escapeHtml(item.name)}
            </strong>

            <div
              style="
                font-size:12px;
                color:#666;
                margin-top:4px;
              ">
              ${escapeHtml(item.commune || "")}
              • enregistré le
              ${formatDate(item.savedAt)}
            </div>

            <div
              class="bociteAnnuaireActions"
              style="margin-top:8px;">

              <button
                type="button"
                class="choiceBtn annuaireFavoriteEntityBtn"
                data-id="${escapeHtml(item.entityId)}">
                Voir la fiche
              </button>

              <button
                type="button"
                class="choiceBtn annuaireFavoriteDeleteBtn"
                data-id="${escapeHtml(item.entityId)}">
                Retirer
              </button>

            </div>

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
          margin-top:10px;
        ">
        Tout retirer
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
        .forEach(function(button){

          button.onclick =
            function(){

              openEntity(
                button.getAttribute(
                  "data-id"
                )
              );
            };
        });

      document
        .querySelectorAll(
          ".annuaireFavoriteDeleteBtn"
        )
        .forEach(function(button){

          button.onclick =
            function(){

              const entityId =
                button.getAttribute(
                  "data-id"
                );

              const updated =
                loadFavorites()
                  .filter(function(item){

                    return (
                      String(item.entityId) !==
                      String(entityId)
                    );
                  });

              saveJson(
                STORAGE.favorites,
                updated
              );

              openFavorites();
            };
        });

      const clearButton =
        getElement(
          "annuaireFavoritesClearBtn"
        );

      if(clearButton){

        clearButton.onclick =
          function(){

            if(
              !window.confirm(
                "Retirer toutes les adresses enregistrées ?"
              )
            ){
              return;
            }

            saveJson(
              STORAGE.favorites,
              []
            );

            openFavorites();
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
     PRÈS DE MOI
     ======================================================= */

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

          const results =
            loadEntities()
              .filter(function(entity){

                return (
                  Number.isFinite(
                    Number(entity.lat)
                  ) &&
                  Number.isFinite(
                    Number(entity.lng)
                  )
                );
              })
              .map(function(entity){

                return {

                  entity:entity,

                  distance:
                    distanceKm(
                      lat,
                      lng,
                      Number(entity.lat),
                      Number(entity.lng)
                    )

                };
              })
              .sort(function(a,b){

                return (
                  a.distance -
                  b.distance
                );
              })
              .slice(0,50);

          let html = "";

          if(!results.length){

            html = `
              <div class="box">
                Aucune position géographique
                n'est encore disponible
                pour les établissements.
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
              style="width:100%;">
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
            "Votre position n'a pas pu être utilisée."
          );
        }
      );
  }

  /* =======================================================
     OUVERT MAINTENANT
     ======================================================= */

  function openNow(){

    const results =
      loadEntities()
        .filter(function(entity){

          return (
            getOpenStatus(entity) ===
            "Ouvert maintenant"
          );
        });

    openGenericEntityList(
      "Ouvert maintenant",
      results
    );
  }

  /* =======================================================
     ACTIONS COMMUNES RÉSULTATS
     ======================================================= */

  function bindResultActions(){

    document
      .querySelectorAll(
        ".annuaireOpenEntityBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            openEntity(
              button.getAttribute(
                "data-id"
              )
            );
          };
      });

    document
      .querySelectorAll(
        ".annuaireCallBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            window.location.href =
              "tel:" +
              String(
                button.getAttribute(
                  "data-phone"
                ) || ""
              )
              .replace(
                /\s+/g,
                ""
              );
          };
      });

    document
      .querySelectorAll(
        ".annuaireRouteBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            const address =
              button.getAttribute(
                "data-address"
              ) || "";

            window.open(
              "https://www.google.com/maps/search/?api=1&query=" +
              encodeURIComponent(
                address
              ),
              "_blank",
              "noopener"
            );
          };
      });
  }

  /* =======================================================
     PROFESSIONNEL — HISTORIQUE
     ======================================================= */

  function loadProfessionalHistory(){

    return safeArray(
      loadJson(
        STORAGE.professionalHistory,
        []
      )
    );
  }

  function saveProfessionalSearch(
    query,
    details,
    zone
  ){

    const history =
      loadProfessionalHistory();

    history.unshift({

      id:
        uniqueId("prosearch"),

      query:
        query,

      details:
        details || "",

      zone:
        zone ||
        getCurrentCommune(),

      status:
        "en_cours",

      createdAt:
        Date.now(),

      updatedAt:
        Date.now()

    });

    saveJson(
      STORAGE.professionalHistory,
      history
    );
  }

  /* =======================================================
     CARNET PROFESSIONNEL
     ======================================================= */

  function loadNotebook(){

    return safeArray(
      loadJson(
        STORAGE.notebook,
        []
      )
    );
  }

  function saveNotebookItem(
    entity,
    note
  ){

    let items =
      loadNotebook();

    const existing =
      items.find(
        function(item){

          return (
            String(item.entityId) ===
            String(entity.id)
          );
        }
      );

    if(existing){

      existing.note =
        note;

      existing.updatedAt =
        Date.now();

    }else{

      items.unshift({

        entityId:
          entity.id,

        name:
          entity.name,

        commune:
          entity.commune,

        note:
          note,

        createdAt:
          Date.now(),

        updatedAt:
          Date.now()

      });
    }

    saveJson(
      STORAGE.notebook,
      items
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

  function followEntity(
    entity
  ){

    let followed =
      loadFollowed();

    if(
      followed.some(
        function(item){

          return (
            String(item.entityId) ===
            String(entity.id)
          );
        }
      )
    ){
      return;
    }

    followed.unshift({

      entityId:
        entity.id,

      name:
        entity.name,

      createdAt:
        Date.now(),

      lastCheckedAt:
        entity.professionalData &&
        entity.professionalData.checkedAt
          ? entity.professionalData.checkedAt
          : 0

    });

    saveJson(
      STORAGE.followed,
      followed
    );
  }

  /* =======================================================
     TABLEAU PRO
     ======================================================= */

  const DEFAULT_DASHBOARD_ORDER = [

    "search",
    "history",
    "followed",
    "notebook",
    "information",
    "bercy"

  ];

  function loadDashboardOrder(){

    const order =
      loadJson(
        STORAGE.dashboardOrder,
        DEFAULT_DASHBOARD_ORDER
      );

    return Array.isArray(order)
      ? order
      : DEFAULT_DASHBOARD_ORDER.slice();
  }

  function saveDashboardOrder(
    order
  ){

    saveJson(
      STORAGE.dashboardOrder,
      order
    );
  }

  function dashboardCard(
    id,
    title,
    subtitle,
    buttonLabel
  ){

    return `

      <div
        class="box bociteAnnuaireDashboardCard"
        draggable="true"
        data-dashboard-id="${id}">

        <div
          style="
            display:flex;
            justify-content:space-between;
            gap:8px;
            align-items:center;
          ">

          <div class="bociteAnnuaireTitle">
            ${escapeHtml(title)}
          </div>

          <div
            class="bociteAnnuaireDragHandle"
            title="Déplacer">
            ≡
          </div>

        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:5px;">
          ${escapeHtml(subtitle)}
        </div>

        <button
          type="button"
          class="choiceBtn annuaireDashboardOpenBtn"
          data-dashboard-open="${id}"
          style="
            width:100%;
            margin-top:8px;
          ">
          ${escapeHtml(buttonLabel)}
        </button>

        <div
          class="bociteAnnuaireActions"
          style="margin-top:6px;">

          <button
            type="button"
            class="choiceBtn annuaireDashboardUpBtn"
            data-dashboard-id="${id}">
            Remonter
          </button>

          <button
            type="button"
            class="choiceBtn annuaireDashboardDownBtn"
            data-dashboard-id="${id}">
            Descendre
          </button>

        </div>

      </div>

    `;
  }

  function getProfessionalDashboardHtml(){

    const order =
      loadDashboardOrder();

    const definitions = {

      search:{
        title:
          "Recherche professionnelle",

        subtitle:
          "Fournisseurs • sous-traitants • partenaires • compétences",

        button:
          "Rechercher"
      },

      history:{
        title:
          "Mes recherches professionnelles",

        subtitle:
          "En cours • terminées • anciennes recherches",

        button:
          "Consulter"
      },

      followed:{
        title:
          "Entreprises suivies",

        subtitle:
          "Modifications • événements officiels • surveillance",

        button:
          "Voir mes suivis"
      },

      notebook:{
        title:
          "Mon carnet professionnel",

        subtitle:
          "Contacts • entreprises conservées • notes privées",

        button:
          "Ouvrir mon carnet"
      },

      information:{
        title:
          "Informations professionnelles",

        subtitle:
          "Identité • données publiques • sources • dates",

        button:
          "Analyser une entreprise"
      },

      bercy:{
        title:
          "Bercy Infos Entreprises",

        subtitle:
          "Fiscalité • comptabilité • obligations • aides",

        button:
          "Consulter Bercy Infos"
      }

    };

    const cards =
      order
        .filter(
          function(id){

            return !!definitions[id];
          }
        )
        .map(function(id){

          const item =
            definitions[id];

          return dashboardCard(
            id,
            item.title,
            item.subtitle,
            item.button
          );
        })
        .join("");

    return `

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
          Trouvez • conservez • vérifiez • suivez • anticipez
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        <div class="bociteAnnuaireText">

          Votre tableau de bord
          peut être organisé
          selon vos priorités.

          <br><br>

          Faites glisser les blocs
          ou utilisez
          <strong>Remonter</strong>
          et
          <strong>Descendre</strong>.

        </div>

      </div>

      <div
        id="annuaireProfessionalDashboard"
        style="margin-top:10px;">
        ${cards}
      </div>

      <button
        id="annuaireDashboardResetBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;">
        Réinitialiser l'ordre Bo'CitéArt
      </button>

      <button
        id="annuaireProfessionalBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Retour à l'annuaire
      </button>

    `;
  }

  function openProfessionalDashboard(){

    requirePrivateAccess(
      function(){

        render(
          "Annuaire professionnel",
          getProfessionalDashboardHtml(),
          bindProfessionalDashboard
        );
      }
    );
  }

  /* =======================================================
     RECHERCHE PRO
     ======================================================= */

  function openProfessionalSearch(){

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
            Fournisseur • sous-traitant • partenaire • compétence • produit • service
          </div>

        </div>

        <div
          class="box"
          style="margin-top:9px;">

          <input
            id="annuaireProQueryInput"
            type="text"
            placeholder="Votre recherche"
            style="
              width:100%;
              box-sizing:border-box;
            "
          >

          <textarea
            id="annuaireProDetailsInput"
            rows="4"
            placeholder="Précisez votre besoin"
            style="
              width:100%;
              box-sizing:border-box;
              margin-top:8px;
            "></textarea>

          <select
            id="annuaireProZoneInput"
            style="
              width:100%;
              margin-top:8px;
            ">

            <option value="commune">
              Ma commune
            </option>

            <option value="proche">
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

        </div>

        <button
          id="annuaireProSearchBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:8px;
          ">
          Rechercher et enregistrer
        </button>

        <button
          id="annuaireProSearchBackBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:7px;
          ">
          Retour au tableau de bord
        </button>

      `,
      function(){

        const search =
          getElement(
            "annuaireProSearchBtn"
          );

        if(search){

          search.onclick =
            function(){

              const query =
                getElement(
                  "annuaireProQueryInput"
                )?.value.trim() ||
                "";

              const details =
                getElement(
                  "annuaireProDetailsInput"
                )?.value.trim() ||
                "";

              const zone =
                getElement(
                  "annuaireProZoneInput"
                )?.value ||
                "commune";

              if(!query){

                alert(
                  "Indiquez votre recherche."
                );

                return;
              }

              saveProfessionalSearch(
                query,
                details,
                zone
              );

              openResults(
                query,
                {
                  localOnly:
                    zone ===
                    "commune"
                }
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
        Retrouvez, reprenez ou classez
        vos anciennes recherches.
      </div>

    </div>

  `;

  if(!history.length){

    html += `

      <div
        class="box"
        style="margin-top:9px;">
        Aucune recherche professionnelle enregistrée.
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

            <div
              class="bociteAnnuaireText"
              style="margin-top:5px;">
              ${escapeHtml(item.details || "")}
            </div>

            <div
              class="bociteAnnuaireSmall"
              style="margin-top:5px;">

              Zone :
              ${escapeHtml(item.zone)}

              <br>

              Créée le :
              ${formatDate(item.createdAt)}

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
                class="choiceBtn annuaireProHistoryResumeBtn"
                data-id="${escapeHtml(item.id)}">
                Reprendre
              </button>

              <button
                type="button"
                class="choiceBtn annuaireProHistoryStatusBtn"
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
              class="choiceBtn annuaireProHistoryDeleteBtn"
              data-id="${escapeHtml(item.id)}"
              style="
                width:100%;
                margin-top:7px;
              ">
              Supprimer
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
          margin-top:10px;
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
        margin-top:9px;
      ">
      Retour au tableau de bord
    </button>

  `;

  render(
    "Mes recherches professionnelles",
    html,
    function(){

      document
        .querySelectorAll(
          ".annuaireProHistoryResumeBtn"
        )
        .forEach(function(button){

          button.onclick =
            function(){

              const item =
                loadProfessionalHistory()
                  .find(
                    function(historyItem){

                      return (
                        historyItem.id ===
                        button.getAttribute(
                          "data-id"
                        )
                      );
                    }
                  );

              if(item){

                openResults(
                  item.query,
                  {
                    localOnly:
                      item.zone ===
                      "commune"
                  }
                );
              }
            };
        });

      document
        .querySelectorAll(
          ".annuaireProHistoryStatusBtn"
        )
        .forEach(function(button){

          button.onclick =
            function(){

              const id =
                button.getAttribute(
                  "data-id"
                );

              const current =
                loadProfessionalHistory();

              const item =
                current.find(
                  function(historyItem){

                    return (
                      historyItem.id ===
                      id
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

              saveJson(
                STORAGE.professionalHistory,
                current
              );

              openProfessionalHistory();
            };
        });

      document
        .querySelectorAll(
          ".annuaireProHistoryDeleteBtn"
        )
        .forEach(function(button){

          button.onclick =
            function(){

              const id =
                button.getAttribute(
                  "data-id"
                );

              const updated =
                loadProfessionalHistory()
                  .filter(function(item){

                    return (
                      String(item.id) !==
                      String(id)
                    );
                  });

              saveJson(
                STORAGE.professionalHistory,
                updated
              );

              openProfessionalHistory();
            };
        });

      const clearButton =
        getElement(
          "annuaireProHistoryClearBtn"
        );

      if(clearButton){

        clearButton.onclick =
          function(){

            if(
              !window.confirm(
                "Effacer toutes vos recherches professionnelles ?"
              )
            ){
              return;
            }

            saveJson(
              STORAGE.professionalHistory,
              []
            );

            openProfessionalHistory();
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
     CARNET PRO
     ======================================================= */

  function openNotebook(){

    const items =
      loadNotebook();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Mon carnet professionnel
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Conservez vos contacts
          et vos notes privées.
        </div>

      </div>

    `;

    if(!items.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">
          Aucun professionnel enregistré.
        </div>

      `;

    }else{

      items.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:9px;">

              <div class="bociteAnnuaireTitle">
                ${escapeHtml(item.name)}
              </div>

              <div
                class="bociteAnnuaireSmall"
                style="margin-top:5px;">
                ${escapeHtml(item.commune || "")}
              </div>

              <div
                class="bociteAnnuaireText"
                style="margin-top:7px;">
                <strong>Ma note privée :</strong>
                <br>
                ${escapeHtml(item.note || "")}
              </div>

              <button
                type="button"
                class="choiceBtn annuaireNotebookOpenBtn"
                data-id="${escapeHtml(item.entityId)}"
                style="
                  width:100%;
                  margin-top:8px;
                ">
                Voir la fiche
              </button>

            </div>

          `;
        }
      );
    }

    html += `

      <button
        id="annuaireNotebookBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Retour au tableau de bord
      </button>

    `;

    render(
      "Mon carnet professionnel",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireNotebookOpenBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                openEntity(
                  button.getAttribute(
                    "data-id"
                  )
                );
              };
          });

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

    const followed =
      loadFollowed();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Entreprises suivies
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Retrouvez les informations publiques
          et les événements officiels disponibles.
        </div>

      </div>

    `;

    if(!followed.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">
          Aucune entreprise suivie.
        </div>

      `;

    }else{

      followed.forEach(
        function(item){

          const entity =
            getEntityById(
              item.entityId
            );

          html += `

            <div
              class="box"
              style="margin-top:9px;">

              <div class="bociteAnnuaireTitle">
                ${escapeHtml(item.name)}
              </div>

              <div
                class="bociteAnnuaireSmall"
                style="margin-top:5px;">
                Suivie depuis :
                ${formatDate(item.createdAt)}
              </div>

              ${
                entity &&
                entity.professionalData &&
                safeArray(
                  entity.professionalData.events
                ).length
                  ? `
                      <div
                        class="bociteAnnuaireText"
                        style="margin-top:7px;">
                        ${
                          entity.professionalData.events
                            .slice(0,3)
                            .map(function(event){

                              return (
                                "• " +
                                escapeHtml(
                                  event.label ||
                                  event.type ||
                                  "Événement"
                                ) +
                                (
                                  event.date
                                    ? " — " +
                                      escapeHtml(event.date)
                                    : ""
                                )
                              );
                            })
                            .join("<br>")
                        }
                      </div>
                    `
                  : `
                      <div
                        class="bociteAnnuaireText"
                        style="margin-top:7px;">
                        Aucun nouvel événement officiel
                        disponible dans les données reçues.
                      </div>
                    `
              }

              <button
                type="button"
                class="choiceBtn annuaireFollowedOpenBtn"
                data-id="${escapeHtml(item.entityId)}"
                style="
                  width:100%;
                  margin-top:8px;
                ">
                Voir les informations
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
          margin-top:9px;
        ">
        Retour au tableau de bord
      </button>

    `;

    render(
      "Entreprises suivies",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireFollowedOpenBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                openProfessionalInformation(
                  button.getAttribute(
                    "data-id"
                  )
                );
              };
          });

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
     INFORMATIONS PRO
     ======================================================= */

  function openProfessionalInformation(
    entityId
  ){

    if(!entityId){

      openProfessionalCompanyPicker();
      return;
    }

    const entity =
      getEntityById(
        entityId
      );

    if(!entity){

      alert(
        "Cette entreprise n'est plus disponible."
      );

      return;
    }

    const data =
      entity.professionalData ||
      {};

    const fields = [

      [
        "SIREN",
        data.siren ||
        entity.siren
      ],

      [
        "SIRET",
        data.siret ||
        entity.siret
      ],

      [
        "Forme juridique",
        data.legalForm
      ],

      [
        "Date de création",
        data.creationDate
      ],

      [
        "Activité",
        data.activity ||
        entity.activity
      ],

      [
        "État de l'établissement",
        data.status
      ],

      [
        "Tranche d'effectifs",
        data.workforce
      ],

      [
        "Derniers comptes disponibles",
        data.latestAccounts
      ],

      [
        "Chiffre d'affaires publié",
        data.revenue
      ],

      [
        "Résultat publié",
        data.result
      ]

    ];

    const informationHtml =
      fields
        .filter(
          function(field){

            return !!field[1];
          }
        )
        .map(function(field){

          return `
            <div
              style="margin-top:7px;">
              <strong>
                ${escapeHtml(field[0])} :
              </strong>
              ${escapeHtml(field[1])}
            </div>
          `;
        })
        .join("");

    const events =
      safeArray(
        data.events
      );

    const sources =
      safeArray(
        data.sources ||
        entity.externalSources
      );

    render(
      "Informations professionnelles",
      `

        <div
          class="box"
          style="
            border-left:6px solid #2f5d46;
          ">

          <div class="bociteAnnuaireTitle">
            ${escapeHtml(entity.name)}
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Informations factuelles disponibles
          </div>

        </div>

        <div
          class="box"
          style="margin-top:9px;">

          ${
            informationHtml ||
            `
              <div class="bociteAnnuaireText">
                Aucune donnée professionnelle enrichie
                n'est encore disponible pour cette fiche.
              </div>
            `
          }

          ${
            data.checkedAt
              ? `
                  <div
                    class="bociteAnnuaireSmall"
                    style="margin-top:10px;">
                    Dernière vérification :
                    ${formatDateTime(data.checkedAt)}
                  </div>
                `
              : ""
          }

        </div>

        ${
          events.length
            ? `
                <div
                  class="box"
                  style="margin-top:9px;">

                  <div class="bociteAnnuaireTitle">
                    Événements officiels disponibles
                  </div>

                  <div
                    class="bociteAnnuaireText"
                    style="margin-top:7px;">
                    ${
                      events
                        .map(function(event){

                          return (
                            "• " +
                            escapeHtml(
                              event.label ||
                              event.type ||
                              "Événement"
                            ) +
                            (
                              event.date
                                ? " — " +
                                  escapeHtml(
                                    event.date
                                  )
                                : ""
                            )
                          );
                        })
                        .join("<br>")
                    }
                  </div>

                </div>
              `
            : ""
        }

        ${
          sources.length
            ? `
                <div
                  class="box"
                  style="margin-top:9px;">

                  <div class="bociteAnnuaireTitle">
                    Sources
                  </div>

                  ${
                    sources
                      .map(
                        function(source,index){

                          return `

                            <button
                              type="button"
                              class="choiceBtn annuaireExternalSourceBtn"
                              data-index="${index}"
                              style="
                                width:100%;
                                margin-top:7px;
                                text-align:left;
                              ">
                              ${escapeHtml(
                                source.label ||
                                source.name ||
                                "Source"
                              )}
                            </button>

                          `;
                        }
                      )
                      .join("")
                  }

                </div>
              `
            : ""
        }

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireSmall">
            Bo'CitéArt présente
            des informations factuelles disponibles.
            Elles ne constituent ni une notation,
            ni une garantie de solvabilité
            ou de bonne santé financière.
          </div>

        </div>

        <button
          id="annuaireFollowCompanyBtn"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Ajouter à mes entreprises suivies
        </button>

        <button
          id="annuaireAddNotebookBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:7px;
          ">
          Ajouter à mon carnet professionnel
        </button>

        <button
          id="annuaireProfessionalInformationBackBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:7px;
          ">
          Retour au tableau de bord
        </button>

      `,
      function(){

        document
          .querySelectorAll(
            ".annuaireExternalSourceBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                const index =
                  Number(
                    button.getAttribute(
                      "data-index"
                    )
                  );

                const source =
                  sources[index];

                if(
                  source &&
                  source.url
                ){

                  window.open(
                    source.url,
                    "_blank",
                    "noopener"
                  );
                }
              };
          });

        const follow =
          getElement(
            "annuaireFollowCompanyBtn"
          );

        if(follow){

          follow.onclick =
            function(){

              followEntity(
                entity
              );

              alert(
                "Cette entreprise est ajoutée à votre suivi."
              );
            };
        }

        const notebook =
          getElement(
            "annuaireAddNotebookBtn"
          );

        if(notebook){

          notebook.onclick =
            function(){

              const note =
                window.prompt(
                  "Ajoutez une note privée pour cette entreprise :",
                  ""
                );

              if(note === null){
                return;
              }

              saveNotebookItem(
                entity,
                note.trim()
              );

              alert(
                "Cette entreprise est enregistrée dans votre carnet."
              );
            };
        }

        const back =
          getElement(
            "annuaireProfessionalInformationBackBtn"
          );

        if(back){
          back.onclick =
            openProfessionalDashboard;
        }

      }
    );
  }

  function openProfessionalCompanyPicker(){

    const entities =
      loadEntities();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Analyser une entreprise
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Choisissez une entreprise
          de l'annuaire.
        </div>

      </div>

    `;

    entities.forEach(
      function(entity){

        html += `

          <button
            type="button"
            class="choiceBtn annuaireProCompanyPickerBtn"
            data-id="${escapeHtml(entity.id)}"
            style="
              width:100%;
              text-align:left;
              margin-top:7px;
            ">
            ${escapeHtml(entity.name)}
          </button>

        `;
      }
    );

    html += `

      <button
        id="annuaireProCompanyPickerBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Retour au tableau de bord
      </button>

    `;

    render(
      "Analyser une entreprise",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireProCompanyPickerBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                openProfessionalInformation(
                  button.getAttribute(
                    "data-id"
                  )
                );
              };
          });

        const back =
          getElement(
            "annuaireProCompanyPickerBackBtn"
          );

        if(back){
          back.onclick =
            openProfessionalDashboard;
        }

      }
    );
  }

  /* =======================================================
     BERCY INFO
     ======================================================= */

  function openBercyInfo(){

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
            style="margin-top:7px;">
            Fiscalité • comptabilité • obligations • aides • gestion
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:8px;">
            Retrouvez les informations officielles
            utiles à la vie de votre entreprise.
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
          Consulter Bercy Infos Entreprises
        </button>

        <button
          id="annuaireBercyBackBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:7px;
          ">
          Retour au tableau de bord
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
     PERSONNALISATION TABLEAU PRO
     ======================================================= */

  function moveDashboardItem(
    id,
    direction
  ){

    const order =
      loadDashboardOrder();

    const index =
      order.indexOf(id);

    if(index < 0){
      return;
    }

    const target =
      index +
      direction;

    if(
      target < 0 ||
      target >= order.length
    ){
      return;
    }

    const temp =
      order[index];

    order[index] =
      order[target];

    order[target] =
      temp;

    saveDashboardOrder(
      order
    );

    openProfessionalDashboard();
  }

  function bindProfessionalDashboard(){

    document
      .querySelectorAll(
        ".annuaireDashboardOpenBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            const target =
              button.getAttribute(
                "data-dashboard-open"
              );

            if(
              target ===
              "search"
            ){
              openProfessionalSearch();
            }

            if(
              target ===
              "history"
            ){
              openProfessionalHistory();
            }

            if(
              target ===
              "followed"
            ){
              openFollowedCompanies();
            }

            if(
              target ===
              "notebook"
            ){
              openNotebook();
            }

            if(
              target ===
              "information"
            ){
              openProfessionalInformation();
            }

            if(
              target ===
              "bercy"
            ){
              openBercyInfo();
            }
          };
      });

    document
      .querySelectorAll(
        ".annuaireDashboardUpBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            moveDashboardItem(
              button.getAttribute(
                "data-dashboard-id"
              ),
              -1
            );
          };
      });

    document
      .querySelectorAll(
        ".annuaireDashboardDownBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            moveDashboardItem(
              button.getAttribute(
                "data-dashboard-id"
              ),
              1
            );
          };
      });

    const container =
      getElement(
        "annuaireProfessionalDashboard"
      );

    if(container){

      let draggedId =
        "";

      container
        .querySelectorAll(
          "[data-dashboard-id]"
        )
        .forEach(function(card){

          card.addEventListener(
            "dragstart",
            function(){

              draggedId =
                card.getAttribute(
                  "data-dashboard-id"
                ) || "";
            }
          );

          card.addEventListener(
            "dragover",
            function(event){

              event.preventDefault();
            }
          );

          card.addEventListener(
            "drop",
            function(event){

              event.preventDefault();

              const targetId =
                card.getAttribute(
                  "data-dashboard-id"
                );

              if(
                !draggedId ||
                !targetId ||
                draggedId ===
                targetId
              ){
                return;
              }

              const order =
                loadDashboardOrder();

              const from =
                order.indexOf(
                  draggedId
                );

              const to =
                order.indexOf(
                  targetId
                );

              if(
                from < 0 ||
                to < 0
              ){
                return;
              }

              order.splice(
                from,
                1
              );

              order.splice(
                to,
                0,
                draggedId
              );

              saveDashboardOrder(
                order
              );

              openProfessionalDashboard();
            }
          );
        });
    }

    const reset =
      getElement(
        "annuaireDashboardResetBtn"
      );

    if(reset){

      reset.onclick =
        function(){

          saveDashboardOrder(
            DEFAULT_DASHBOARD_ORDER.slice()
          );

          openProfessionalDashboard();
        };
    }

    const back =
      getElement(
        "annuaireProfessionalBackBtn"
      );

    if(back){
      back.onclick =
        openHome;
    }
  }

  /* =======================================================
     BIND ACCUEIL
     ======================================================= */

  function bindHome(){

    const input =
      getElement(
        "annuaireSearchInput"
      );

    const search =
      getElement(
        "annuaireSearchBtn"
      );

    if(search){

      search.onclick =
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
        ".annuaireCategoryBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            openCategory(
              button.getAttribute(
                "data-category"
              )
            );
          };
      });

    document
      .querySelectorAll(
        ".annuaireRecentQueryBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            launchSearch(
              button.getAttribute(
                "data-query"
              ) || ""
            );
          };
      });

    const near =
      getElement(
        "annuaireNearBtn"
      );

    if(near){
      near.onclick =
        openNearMe;
    }

    const open =
      getElement(
        "annuaireOpenBtn"
      );

    if(open){
      open.onclick =
        openNow;
    }

    const history =
      getElement(
        "annuaireHistoryBtn"
      );

    if(history){
      history.onclick =
        openSearchHistory;
    }

    const favorites =
      getElement(
        "annuaireFavoritesBtn"
      );

    if(favorites){
      favorites.onclick =
        openFavorites;
    }

    const viewed =
      getElement(
        "annuaireViewedBtn"
      );

    if(viewed){
      viewed.onclick =
        openViewedHistory;
    }

    const legend =
      getElement(
        "annuaireLegendBtn"
      );

    if(legend){

      legend.onclick =
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

    const pro =
      getElement(
        "annuaireProfessionalBtn"
      );

    if(pro){
      pro.onclick =
        openProfessionalDashboard;
    }
  }

  /* =======================================================
     EXPOSITION DES FONCTIONS
     ======================================================= */

  annuaire.openHome =
    openHome;

  annuaire.openSearch =
    launchSearch;

  annuaire.openCategory =
    openCategory;

  annuaire.openEntity =
    openEntity;

  annuaire.openSearchHistory =
    openSearchHistory;

  annuaire.openRecentlyViewed =
    openViewedHistory;

  annuaire.openFavorites =
    openFavorites;

  annuaire.openProfessionalDashboard =
    openProfessionalDashboard;

  annuaire.openProfessionalInformation =
    openProfessionalInformation;

  annuaire.loadEntities =
    loadEntities;

  annuaire.saveEntities =
    saveEntities;

  annuaire.getEntityById =
    getEntityById;

  /* =======================================================
     COMPATIBILITÉ AVEC L'ANCIEN ENTREPRISE.JS
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
   DÉMARRAGE ANNUAIRE
   ======================================================= */
   
annuaire.refreshFromProvider =
function(){

  /*
    VERSION SIMPLE ET STABLE

    Aucun appel automatique à une API.
    Aucun chargement de 101 pages.
    Aucun fichier annuaire-[ville].json
    imposé au démarrage.

    L'annuaire conserve simplement
    les données déjà présentes
    dans son stockage local.

    Les mises à jour des données
    seront traitées séparément,
    sans ralentir l'utilisateur.
  */

  const rows =
    loadEntities();

  console.log(
    "✅ Annuaire Bo'CitéArt prêt :",
    rows.length,
    "établissements conservés"
  );

  return Promise.resolve({
    updated:false,
    preserved:true,
    count:
      rows.length,
    source:
      "Stockage local Bo'CitéArt"
  });
};


window.setTimeout(
  function(){

    annuaire
      .refreshFromProvider()
      .then(function(result){

        console.log(
          "✅ Annuaire démarré sans chargement externe",
          result
        );

      });

  },
  100
);


console.log(
  "✅ Bo'CitéArt — Annuaire complet chargé"
);

})();
