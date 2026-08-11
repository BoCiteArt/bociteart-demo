/* =========================================================
   BO'CITÉART — ANNUAIRE DE VOTRE VILLE
   RECONSTRUCTION PROPRE — BASE 2026-08

   PRINCIPES
   • Une seule navigation interne
   • Une seule modale réutilisée
   • Commune issue du compte Bo'CitéArt
   • Recherche locale à la demande
   • Filtrage avant stockage
   • Aucune fausse coordonnée
   • Historique conservé sans suppression automatique
   • Suppression d'une ligne ou de tout l'historique
   • Favoris
   • Consultés récemment
   • Appréciation citoyenne simple 1 à 5
   • Espace professionnel séparé
   • Sécurité centrale Bo'CitéArt
   • Préparation serveur / agent futur

   PARCOURS PUBLIC
   Annuaire
   → Catégorie
   → Métier
   → Résultats
   → Fiche

   Le Retour suit toujours le chemin inverse.
   ========================================================= */

(function initBociteEntrepriseAnnuaire(){

  "use strict";

  const module = window.BociteEntreprise;

  if(!module){
    console.error(
      "Bo'CitéArt Annuaire : module Entreprise introuvable."
    );
    return;
  }

  const Annuaire =
    module.Annuaire =
    module.Annuaire || {};

  /* =======================================================
     VERSION / STOCKAGES PROPRES
     ======================================================= */

  const VERSION = "5.0.0";

  const STORAGE = {

    entities:
      "bociteart_annuaire_v5_entities",

    searchHistory:
      "bociteart_annuaire_v5_search_history",

    viewedHistory:
      "bociteart_annuaire_v5_viewed_history",

    favorites:
      "bociteart_annuaire_v5_favorites",

    ratings:
      "bociteart_annuaire_v5_ratings",

    reports:
      "bociteart_annuaire_v5_reports",

    professionalHistory:
      "bociteart_annuaire_v5_professional_history",

    notebook:
      "bociteart_annuaire_v5_professional_notebook",

    followed:
      "bociteart_annuaire_v5_followed",

    partnerProfiles:
      "bociteart_annuaire_v5_partner_profiles",

    schema:
      "bociteart_annuaire_v5_schema"

  };

  Annuaire.VERSION = VERSION;
  Annuaire.STORAGE = STORAGE;

  /* =======================================================
     ÉTAT UNIQUE DE L'ANNUAIRE
     ======================================================= */

  const State = {

    stack: [],

    current: null,

    requestCounter: 0,

    activeRequest: 0,

    lastResults: [],

    lastQuery: "",

    lastOptions: null

  };

  /* =======================================================
     OUTILS
     ======================================================= */

  function safeArray(value){
    return Array.isArray(value) ? value : [];
  }

  function getElement(id){
    return document.getElementById(id);
  }

  function normalizeText(value){

    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
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

  function loadJson(key, fallback){

    try{

      const raw = localStorage.getItem(key);

      if(!raw){
        return fallback;
      }

      return JSON.parse(raw);

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

  function uniqueId(prefix){

    return (
      prefix +
      "_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 9)
    );
  }

  function formatDate(timestamp){

    if(!timestamp){
      return "";
    }

    try{

      return new Date(timestamp)
        .toLocaleDateString(
          "fr-FR",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
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

      return new Date(timestamp)
        .toLocaleString(
          "fr-FR",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }
        );

    }catch(error){
      return "";
    }
  }

  /* =======================================================
     COMMUNE DU COMPTE
     ======================================================= */

  function getCurrentCommune(){

    try{

      const registration =
        window.BoCiteArtRegistration;

      if(
        registration &&
        typeof registration.getCurrentAccount === "function"
      ){

        const account =
          registration.getCurrentAccount();

        if(
          account &&
          account.commune
        ){
          return String(account.commune).trim();
        }
      }

    }catch(error){
      /* repli ci-dessous */
    }

    try{

      const account =
        JSON.parse(
          localStorage.getItem(
            "bociteart_account_demo_v1"
          ) || "{}"
        );

      if(account.commune){
        return String(account.commune).trim();
      }

    }catch(error){
      /* repli ci-dessous */
    }

    const possibleKeys = [
      "bociteart_user_commune_v1",
      "bociteart_commune_v1",
      "bociteart_registration_commune_v1"
    ];

    for(
      let i = 0;
      i < possibleKeys.length;
      i++
    ){

      const value =
        localStorage.getItem(
          possibleKeys[i]
        );

      if(
        value &&
        String(value).trim()
      ){
        return String(value).trim();
      }
    }

    return "votre ville";
  }

  /* =======================================================
     SÉCURITÉ CENTRALE
     ======================================================= */

  function canAccessDirectory(){

    try{

      const registration =
        window.BoCiteArtRegistration;

      if(
        registration &&
        typeof registration.canAccess === "function"
      ){

        return (
          registration.canAccess("directory") === true
        );
      }

    }catch(error){

      console.warn(
        "Bo'CitéArt Annuaire : contrôle de droit impossible.",
        error
      );
    }

    /*
      Compatibilité temporaire avec l'ancien système.
      À terme, seule la sécurité centrale devra décider.
    */

    return null;
  }

  function requireProfessionalAccess(callback){

    const centralAccess =
      canAccessDirectory();

    if(centralAccess === true){

      callback();
      return;
    }

    if(centralAccess === false){

      alert(
        "Votre compte ne possède pas l'autorisation d'accéder à l'annuaire professionnel."
      );

      return;
    }

    if(
      typeof module.requirePrivateAccess === "function"
    ){

      module.requirePrivateAccess(callback);
      return;
    }

    if(
      typeof module.requirePartnerAccess === "function"
    ){

      module.requirePartnerAccess(callback);
      return;
    }

    alert(
      "L'accès professionnel privé est momentanément indisponible."
    );
  }

  /* =======================================================
     STYLE
     ======================================================= */

  function injectStyles(){

    if(
      document.getElementById(
        "bociteAnnuaireV5Styles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteAnnuaireV5Styles";

    style.textContent = `

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

      .bociteAnnuaireSmall{
        color:#666;
        font-size:12px;
        line-height:1.4;
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

      .bociteAnnuaireResult{
        margin-bottom:9px;
      }

      .bociteAnnuaireHistoryRow{
        margin-top:8px;
      }

      .bociteAnnuaireStars{
        display:flex;
        gap:5px;
        flex-wrap:wrap;
        margin-top:8px;
      }

      .bociteAnnuaireStarBtn{
        min-width:42px;
        min-height:42px;
        font-size:20px;
      }

      .bociteAnnuaireLoading{
        text-align:center;
        padding:18px 8px;
      }

      @media(max-width:420px){

        .bociteAnnuaireGrid,
        .bociteAnnuaireActions{
          grid-template-columns:
            repeat(2,minmax(0,1fr));
        }

      }

    `;

    document.head.appendChild(style);
  }

  injectStyles();

  /* =======================================================
     LOGO
     ======================================================= */

function getLogoHtml(){

  return `<strong style="display:inline;white-space:nowrap;font-weight:900;"><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;position:relative;left:-5px;">Art</span></strong>`;

}
   
   /* =======================================================
     UNE SEULE FONCTION DE RENDU
     ======================================================= */

  function renderModal(title, html, callback){

    module.renderModal(
      title,
      html
    );

    window.setTimeout(
      function(){

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

        if(
          typeof callback === "function"
        ){
          callback();
        }

      },
      0
    );
  }

  /* =======================================================
     NAVIGATION UNIQUE
     ======================================================= */

  function cloneView(view){

    if(!view){
      return null;
    }

    return {
      type: view.type,
      data: view.data || {}
    };
  }

  function navigate(type, data, options){

    options = options || {};

    if(
      State.current &&
      options.replace !== true
    ){
      State.stack.push(
        cloneView(State.current)
      );
    }

    State.current = {
      type: type,
      data: data || {}
    };

    renderCurrentView();
  }

  function replaceView(type, data){

    State.current = {
      type: type,
      data: data || {}
    };

    renderCurrentView();
  }

  function goBack(){

    /*
      Toute recherche réseau encore en cours
      devient obsolète dès que l'utilisateur revient.
    */

    State.activeRequest =
      ++State.requestCounter;

    if(State.stack.length){

      State.current =
        State.stack.pop();

      renderCurrentView();

      return;
    }

    /*
      Sortie de l'annuaire :
      on remet la main au module Entreprise
      lorsqu'une fonction de retour existe.
    */

    if(
      typeof module.returnToEntrepriseHome === "function"
    ){
      module.returnToEntrepriseHome();
      return;
    }

    if(
      typeof module.goBack === "function"
    ){
      module.goBack();
      return;
    }

    if(
      typeof module.openScreen === "function"
    ){
      module.openScreen("accueil");
    }
  }

  function resetNavigation(){

    State.stack = [];

    State.current = {
      type: "home",
      data: {}
    };

    renderCurrentView();
  }

  function getBackButtonHtml(label){

    return `
      <button
        id="annuaireInternalBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        ← ${escapeHtml(label || "Retour")}
      </button>
    `;
  }

  function bindBackButton(){

    const back =
      getElement(
        "annuaireInternalBackBtn"
      );

    if(back){
      back.onclick = goBack;
    }
  }

  /* =======================================================
     CATÉGORIES
     ======================================================= */

  const CATEGORIES = [

    {
      id: "commerces",
      title: "Commerces",
      subtitle:
        "Boutiques • alimentation • proximité"
    },

    {
      id: "restaurants",
      title: "Restaurants",
      subtitle:
        "Restaurants • cafés • traiteurs"
    },

    {
      id: "artisans",
      title: "Artisans",
      subtitle:
        "Travaux • réparation • savoir-faire"
    },

    {
      id: "sante",
      title: "Santé",
      subtitle:
        "Médecins • soins • professionnels"
    },

    {
      id: "entreprises",
      title: "Entreprises",
      subtitle:
        "Industrie • services • compétences"
    },

    {
      id: "hebergements",
      title: "Hôtels & séjours",
      subtitle:
        "Hôtels • gîtes • hébergements"
    },

    {
      id: "services",
      title: "Services",
      subtitle:
        "Particuliers • professionnels"
    },

    {
      id: "metiers",
      title: "Tous les métiers",
      subtitle:
        "Rechercher par activité"
    }

  ];

  const TRADE_FAMILIES = {

    commerces: [
      "Boulangeries",
      "Boucheries",
      "Épiceries",
      "Fleuristes",
      "Coiffeurs",
      "Opticiens",
      "Vêtements",
      "Chaussures",
      "Commerces alimentaires",
      "Autres commerces"
    ],

    restaurants: [
      "Restaurants",
      "Cafés",
      "Brasseries",
      "Traiteurs",
      "Restauration rapide"
    ],

    artisans: [
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

    sante: [
      "Médecins généralistes",
      "Infirmiers",
      "Kinésithérapeutes",
      "Dentistes",
      "Pharmacies",
      "Pédicures-podologues",
      "Orthophonistes",
      "Sages-femmes",
      "Psychologues",
      "Autres professionnels de santé"
    ],

    entreprises: [
      "Industrie",
      "Bâtiment",
      "Transport",
      "Logistique",
      "Informatique",
      "Communication",
      "Bureaux d'études",
      "Conseil",
      "Nettoyage professionnel",
      "Sécurité"
    ],

    hebergements: [
      "Hôtels",
      "Chambres d'hôtes",
      "Gîtes",
      "Locations de courte durée",
      "Autres hébergements"
    ],

    services: [
      "Garages automobiles",
      "Carrossiers",
      "Pneumatiques",
      "Contrôle technique",
      "Experts-comptables",
      "Avocats",
      "Assurances",
      "Informatique",
      "Services à la personne",
      "Autres services"
    ]

  };

  /* =======================================================
     SYNONYMES
     ======================================================= */

  const SEARCH_SYNONYMS = {

    "fuite": [
      "plombier",
      "plomberie"
    ],

    "toiture": [
      "couvreur",
      "couverture",
      "zinguerie"
    ],

    "chaudiere": [
      "chauffagiste",
      "chauffage"
    ],

    "chauffage": [
      "chauffagiste"
    ],

    "mal au pied": [
      "podologue",
      "pedicure podologue"
    ],

    "kine": [
      "kinesitherapeute"
    ],

    "repas": [
      "restaurant",
      "traiteur"
    ],

    "voiture": [
      "garage",
      "automobile"
    ],

    "pneu": [
      "pneumatique",
      "garage"
    ]

  };

  function expandSearchTerms(query){

    const normalized =
      normalizeText(query);

    let terms = [normalized];

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
      new Set(
        terms.filter(Boolean)
      )
    );
  }

  /* =======================================================
     ENTITÉS VALIDÉES
     ======================================================= */

  function loadEntities(){

    return safeArray(
      loadJson(
        STORAGE.entities,
        []
      )
    );
  }

  function saveEntities(entities){

    return saveJson(
      STORAGE.entities,
      safeArray(entities)
    );
  }

  function getEntityById(id){

    return (
      loadEntities()
        .find(function(entity){

          return (
            String(entity.id) ===
            String(id)
          );
        }) ||
      null
    );
  }

  function buildStableEntityId(entity){

    if(entity.id){
      return String(entity.id);
    }

    const base =
      [
        entity.source || "",
        entity.externalId || "",
        entity.name || "",
        entity.address || "",
        entity.postalCode || "",
        entity.commune || ""
      ]
      .map(normalizeText)
      .join("|");

    let hash = 0;

    for(
      let i = 0;
      i < base.length;
      i++
    ){

      hash =
        (
          (hash << 5) -
          hash
        ) +
        base.charCodeAt(i);

      hash |= 0;
    }

    return (
      "entity_" +
      Math.abs(hash)
    );
  }

  function normalizeEntity(raw){

    raw = raw || {};

    const entity = {

      id:
        raw.id || "",

      externalId:
        raw.externalId ||
        raw.osmId ||
        raw.siret ||
        raw.siren ||
        "",

      source:
        raw.source || "",

      name:
        String(
          raw.name || ""
        ).trim(),

      activity:
        String(
          raw.activity ||
          raw.trade ||
          raw.categoryLabel ||
          ""
        ).trim(),

      trade:
        String(
          raw.trade || ""
        ).trim(),

      category:
        String(
          raw.category || ""
        ).trim(),

      subcategory:
        String(
          raw.subcategory || ""
        ).trim(),

      kind:
        String(
          raw.kind || ""
        ).trim(),

      address:
        String(
          raw.address || ""
        ).trim(),

      postalCode:
        String(
          raw.postalCode ||
          raw.postcode ||
          ""
        ).trim(),

      commune:
        String(
          raw.commune ||
          raw.city ||
          ""
        ).trim(),

      phone:
        String(
          raw.phone || ""
        ).trim(),

      email:
        String(
          raw.email || ""
        ).trim(),

      website:
        String(
          raw.website ||
          raw.url ||
          ""
        ).trim(),

      lat:
        Number.isFinite(
          Number(raw.lat)
        )
          ? Number(raw.lat)
          : null,

      lng:
        Number.isFinite(
          Number(
            raw.lng !== undefined
              ? raw.lng
              : raw.lon
          )
        )
          ? Number(
              raw.lng !== undefined
                ? raw.lng
                : raw.lon
            )
          : null,

      hours:
        raw.hours || null,

      services:
        safeArray(raw.services),

      keywords:
        safeArray(raw.keywords),

      photos:
        safeArray(raw.photos),

      description:
        String(
          raw.description || ""
        ).trim(),

      partner:
        raw.partner === true,

      bocitecoins:
        raw.bocitecoins === true,

      recruiting:
        raw.recruiting === true,

      siren:
        String(
          raw.siren || ""
        ).trim(),

      siret:
        String(
          raw.siret || ""
        ).trim(),

      professionalData:
        raw.professionalData || null,

      verifiedAt:
        raw.verifiedAt || 0,

      cachedAt:
        Date.now()

    };

    entity.id =
      buildStableEntityId(entity);

    return entity;
  }

  function mergeValidatedEntities(newEntities){

    const existing =
      loadEntities();

    const map =
      new Map();

    existing.forEach(function(entity){

      map.set(
        String(entity.id),
        entity
      );
    });

    safeArray(newEntities)
      .forEach(function(entity){

        if(!entity || !entity.id){
          return;
        }

        const old =
          map.get(
            String(entity.id)
          ) || {};

        map.set(
          String(entity.id),
          {
            ...old,
            ...entity,
            cachedAt:
              Date.now()
          }
        );
      });

    const result =
      Array.from(
        map.values()
      );

    saveEntities(result);

    return result;
  }

  /* =======================================================
     HISTORIQUE LONGUE DURÉE
     AUCUNE SUPPRESSION AUTOMATIQUE
     ======================================================= */

  function loadSearchHistory(){

    return safeArray(
      loadJson(
        STORAGE.searchHistory,
        []
      )
    );
  }

  function saveSearchHistory(history){

    saveJson(
      STORAGE.searchHistory,
      safeArray(history)
    );
  }

  function addSearchHistory(
    query,
    commune,
    context
  ){

    const cleanQuery =
      String(query || "").trim();

    if(!cleanQuery){
      return null;
    }

    const history =
      loadSearchHistory();

    const item = {

      id:
        uniqueId("search"),

      type:
        "search",

      query:
        cleanQuery,

      commune:
        commune ||
        getCurrentCommune(),

      category:
        context &&
        context.category
          ? context.category
          : "",

      trade:
        context &&
        context.trade
          ? context.trade
          : "",

      createdAt:
        Date.now()

    };

    history.unshift(item);

    /*
      IMPORTANT :
      aucune limite de 150 lignes,
      aucune suppression automatique.
      L'utilisateur décide.
    */

    saveSearchHistory(history);

    return item;
  }

  function deleteSearchHistoryItem(id){

    const history =
      loadSearchHistory()
        .filter(function(item){

          return (
            String(item.id) !==
            String(id)
          );
        });

    saveSearchHistory(history);
  }

  function clearSearchHistory(){

    saveSearchHistory([]);
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

  function addViewedEntity(entity){

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

      activity:
        entity.activity ||
        entity.trade ||
        "",

      commune:
        entity.commune,

      viewedAt:
        Date.now()

    });

    saveJson(
      STORAGE.viewedHistory,
      history
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

        activity:
          entity.activity ||
          entity.trade ||
          "",

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
     FIN DU BLOC 1
     ======================================================= */

   /* =======================================================
     MOTEUR DE RECHERCHE / AGENT
     ======================================================= */

  const Agent =
    Annuaire.Agent =
    Annuaire.Agent || {};

  /*
    L'interface ne connaît pas la provenance
    des données.

    Aujourd'hui :
    • fournisseur externe éventuel ;
    • recherche réseau publique de démonstration.

    Demain :
    • serveur Bo'CitéArt ;
    • API officielles ;
    • agent IA ;
    • enrichissement centralisé.

    Les écrans continueront à appeler :
    Annuaire.Agent.search(...)
  */

  /* =======================================================
     CORRESPONDANCE MÉTIERS → CRITÈRES RÉSEAU
     ======================================================= */

  const TRADE_RULES = {

    "boulangeries": {
      words:[
        "boulangerie",
        "baker",
        "bakery"
      ],
      osm:[
        ["shop","bakery"]
      ]
    },

    "boucheries": {
      words:[
        "boucherie",
        "boucher",
        "butcher"
      ],
      osm:[
        ["shop","butcher"]
      ]
    },

    "epiceries": {
      words:[
        "epicerie",
        "superette",
        "convenience",
        "grocery"
      ],
      osm:[
        ["shop","convenience"],
        ["shop","supermarket"]
      ]
    },

    "fleuristes": {
      words:[
        "fleuriste",
        "fleurs",
        "florist"
      ],
      osm:[
        ["shop","florist"]
      ]
    },

    "coiffeurs": {
      words:[
        "coiffeur",
        "coiffure",
        "hairdresser"
      ],
      osm:[
        ["shop","hairdresser"]
      ]
    },

    "opticiens": {
      words:[
        "opticien",
        "optique",
        "optician"
      ],
      osm:[
        ["shop","optician"]
      ]
    },

    "restaurants": {
      words:[
        "restaurant"
      ],
      osm:[
        ["amenity","restaurant"]
      ]
    },

    "cafes": {
      words:[
        "cafe",
        "coffee"
      ],
      osm:[
        ["amenity","cafe"]
      ]
    },

    "brasseries": {
      words:[
        "brasserie",
        "restaurant"
      ],
      osm:[
        ["amenity","restaurant"]
      ]
    },

    "traiteurs": {
      words:[
        "traiteur",
        "catering"
      ],
      osm:[
        ["shop","deli"],
        ["craft","caterer"]
      ]
    },

    "restauration rapide": {
      words:[
        "fast food",
        "restauration rapide"
      ],
      osm:[
        ["amenity","fast_food"]
      ]
    },

    "couvreurs": {
      words:[
        "couvreur",
        "couverture",
        "toiture",
        "roof"
      ],
      osm:[
        ["craft","roofer"]
      ]
    },

    "plombiers": {
      words:[
        "plombier",
        "plomberie",
        "plumber"
      ],
      osm:[
        ["craft","plumber"]
      ]
    },

    "electriciens": {
      words:[
        "electricien",
        "electricite",
        "electrician"
      ],
      osm:[
        ["craft","electrician"]
      ]
    },

    "chauffagistes": {
      words:[
        "chauffagiste",
        "chauffage",
        "heating"
      ],
      osm:[
        ["craft","heating_engineer"]
      ]
    },

    "menuisiers": {
      words:[
        "menuisier",
        "menuiserie",
        "carpenter"
      ],
      osm:[
        ["craft","carpenter"]
      ]
    },

    "macons": {
      words:[
        "macon",
        "maconnerie",
        "builder"
      ],
      osm:[
        ["craft","builder"]
      ]
    },

    "peintres": {
      words:[
        "peintre",
        "peinture",
        "painter"
      ],
      osm:[
        ["craft","painter"]
      ]
    },

    "carreleurs": {
      words:[
        "carreleur",
        "carrelage",
        "tiler"
      ],
      osm:[
        ["craft","tiler"]
      ]
    },

    "paysagistes": {
      words:[
        "paysagiste",
        "jardin",
        "landscape"
      ],
      osm:[
        ["craft","gardener"]
      ]
    },

    "serruriers": {
      words:[
        "serrurier",
        "serrurerie",
        "locksmith"
      ],
      osm:[
        ["craft","locksmith"]
      ]
    },

    "medecins generalistes": {
      words:[
        "medecin",
        "generaliste",
        "doctor"
      ],
      osm:[
        ["amenity","doctors"],
        ["healthcare","doctor"]
      ]
    },

    "infirmiers": {
      words:[
        "infirmier",
        "infirmiere",
        "nurse"
      ],
      osm:[
        ["healthcare","nurse"]
      ]
    },

    "kinesitherapeutes": {
      words:[
        "kinesitherapeute",
        "kine",
        "physiotherapist"
      ],
      osm:[
        ["healthcare","physiotherapist"]
      ]
    },

    "dentistes": {
      words:[
        "dentiste",
        "dentaire",
        "dentist"
      ],
      osm:[
        ["amenity","dentist"],
        ["healthcare","dentist"]
      ]
    },

    "pharmacies": {
      words:[
        "pharmacie",
        "pharmacy"
      ],
      osm:[
        ["amenity","pharmacy"]
      ]
    },

    "pedicures-podologues": {
      words:[
        "podologue",
        "pedicure",
        "podiatrist"
      ],
      osm:[
        ["healthcare","podiatrist"]
      ]
    },

    "orthophonistes": {
      words:[
        "orthophoniste",
        "speech therapist"
      ],
      osm:[
        ["healthcare","speech_therapist"]
      ]
    },

    "sages-femmes": {
      words:[
        "sage femme",
        "midwife"
      ],
      osm:[
        ["healthcare","midwife"]
      ]
    },

    "psychologues": {
      words:[
        "psychologue",
        "psychologist"
      ],
      osm:[
        ["healthcare","psychotherapist"],
        ["healthcare","psychologist"]
      ]
    },

    "hotels": {
      words:[
        "hotel"
      ],
      osm:[
        ["tourism","hotel"]
      ]
    },

    "chambres d'hotes": {
      words:[
        "chambre d'hote",
        "guest house",
        "bed and breakfast"
      ],
      osm:[
        ["tourism","guest_house"]
      ]
    },

    "gites": {
      words:[
        "gite",
        "holiday cottage"
      ],
      osm:[
        ["tourism","chalet"],
        ["tourism","apartment"]
      ]
    },

    "garages automobiles": {
      words:[
        "garage",
        "automobile",
        "car repair"
      ],
      osm:[
        ["shop","car_repair"]
      ]
    },

    "carrossiers": {
      words:[
        "carrosserie",
        "carrossier"
      ],
      osm:[
        ["craft","body_repair"]
      ]
    },

    "pneumatiques": {
      words:[
        "pneu",
        "pneumatique",
        "tyre"
      ],
      osm:[
        ["shop","tyres"]
      ]
    },

    "controle technique": {
      words:[
        "controle technique",
        "vehicle inspection"
      ],
      osm:[
        ["amenity","vehicle_inspection"]
      ]
    },

    "avocats": {
      words:[
        "avocat",
        "lawyer"
      ],
      osm:[
        ["office","lawyer"]
      ]
    },

    "experts-comptables": {
      words:[
        "expert comptable",
        "comptable",
        "accountant"
      ],
      osm:[
        ["office","accountant"]
      ]
    },

    "assurances": {
      words:[
        "assurance",
        "insurance"
      ],
      osm:[
        ["office","insurance"]
      ]
    }

  };

  /* =======================================================
     RÈGLE D'UNE RECHERCHE
     ======================================================= */

  function getTradeRule(query){

    const normalized =
      normalizeText(query);

    if(
      TRADE_RULES[normalized]
    ){
      return TRADE_RULES[normalized];
    }

    const terms =
      expandSearchTerms(query);

    let selected = null;

    Object.keys(
      TRADE_RULES
    )
    .some(function(key){

      const rule =
        TRADE_RULES[key];

      const matches =
        rule.words.some(
          function(word){

            const normalizedWord =
              normalizeText(word);

            return terms.some(
              function(term){

                return (
                  term.includes(normalizedWord) ||
                  normalizedWord.includes(term)
                );
              }
            );
          }
        );

      if(matches){
        selected = rule;
        return true;
      }

      return false;
    });

    return selected;
  }

  /* =======================================================
     TEXTE D'UNE ENTITÉ POUR CONTRÔLE
     ======================================================= */

  function entitySearchText(entity){

    return normalizeText(
      [
        entity.name,
        entity.activity,
        entity.trade,
        entity.category,
        entity.subcategory,
        entity.kind,
        safeArray(entity.services).join(" "),
        safeArray(entity.keywords).join(" ")
      ].join(" ")
    );
  }

  /* =======================================================
     FILTRAGE STRICT
     ======================================================= */

  function entityMatchesTrade(
    entity,
    query,
    rule
  ){

    if(!entity){
      return false;
    }

    const haystack =
      entitySearchText(entity);

    if(!haystack){
      return false;
    }

    const terms =
      expandSearchTerms(query);

    /*
      Si une règle métier précise existe,
      au moins un des mots autorisés
      doit réellement être présent
      dans les données de l'établissement.
    */

    if(rule){

      return rule.words.some(
        function(word){

          const normalizedWord =
            normalizeText(word);

          return (
            normalizedWord &&
            haystack.includes(
              normalizedWord
            )
          );
        }
      );
    }

    /*
      Recherche libre :
      nom, produit ou service.
    */

    return terms.some(
      function(term){

        return (
          term &&
          haystack.includes(term)
        );
      }
    );
  }

  /* =======================================================
     VALIDITÉ MINIMALE D'UNE FICHE
     ======================================================= */

  function isUsableEntity(entity){

    if(!entity){
      return false;
    }

    if(
      !entity.name ||
      !String(entity.name).trim()
    ){
      return false;
    }

    /*
      Une fiche doit au minimum permettre
      d'identifier l'établissement.

      On ne crée jamais de téléphone,
      d'e-mail ou d'adresse fictive.
    */

    if(
      !entity.activity &&
      !entity.trade &&
      !entity.category
    ){
      return false;
    }

    return true;
  }

  /* =======================================================
     DÉDOUBLONNAGE
     ======================================================= */

  function deduplicateEntities(entities){

    const map =
      new Map();

    safeArray(entities)
      .forEach(function(entity){

        if(!entity){
          return;
        }

        const key =
          entity.id ||
          normalizeText(
            [
              entity.name,
              entity.address,
              entity.postalCode,
              entity.commune
            ].join("|")
          );

        if(!key){
          return;
        }

        const existing =
          map.get(key);

        if(!existing){

          map.set(
            key,
            entity
          );

          return;
        }

        /*
          Si deux sources donnent la même fiche,
          on conserve les données non vides.
        */

        map.set(
          key,
          {
            ...existing,
            ...Object.fromEntries(
              Object.entries(entity)
                .filter(function(entry){

                  const value =
                    entry[1];

                  if(
                    value === null ||
                    value === undefined ||
                    value === ""
                  ){
                    return false;
                  }

                  if(
                    Array.isArray(value) &&
                    !value.length
                  ){
                    return false;
                  }

                  return true;
                })
            )
          }
        );
      });

    return Array.from(
      map.values()
    );
  }

  /* =======================================================
     RECHERCHE DANS LE CACHE VALIDÉ
     ======================================================= */

  function searchCachedEntities(
    query,
    options
  ){

    options = options || {};

    const commune =
      normalizeText(
        options.commune ||
        getCurrentCommune()
      );

    const rule =
      getTradeRule(query);

    return loadEntities()
      .filter(function(entity){

        if(
          options.localOnly !== false &&
          commune &&
          commune !== "votre ville"
        ){

          if(
            normalizeText(
              entity.commune
            ) !== commune
          ){
            return false;
          }
        }

        if(
          options.category &&
          normalizeText(
            entity.category
          ) !==
          normalizeText(
            options.category
          )
        ){

          /*
            Une catégorie peut être absente
            des données réseau.
            Dans ce cas le métier reste prioritaire.
          */

          if(!query){
            return false;
          }
        }

        return entityMatchesTrade(
          entity,
          query,
          rule
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
     FOURNISSEUR EXTERNE PRIORITAIRE
     ======================================================= */

  function searchWithExternalProvider(
    query,
    options
  ){

    const provider =
      window.BociteAnnuaireDataProvider;

    if(
      !provider ||
      typeof provider.search !== "function"
    ){

      return Promise.resolve(null);
    }

    return Promise
      .resolve(
        provider.search({
          query: query,
          commune:
            options.commune ||
            getCurrentCommune(),
          category:
            options.category || "",
          trade:
            options.trade || "",
          localOnly:
            options.localOnly !== false
        })
      )
      .then(function(result){

        if(!result){
          return null;
        }

        if(Array.isArray(result)){
          return result;
        }

        if(
          Array.isArray(result.rows)
        ){
          return result.rows;
        }

        return null;
      })
      .catch(function(error){

        console.warn(
          "Bo'CitéArt Annuaire : fournisseur externe indisponible.",
          error
        );

        return null;
      });
  }

  /* =======================================================
     RECHERCHE OPENSTREETMAP / OVERPASS
     POUR LA DÉMO
     ======================================================= */

  const OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];

  function buildOverpassSelectors(rule){

    if(
      !rule ||
      !safeArray(rule.osm).length
    ){
      return "";
    }

    return rule.osm
      .map(function(pair){

        const key =
          String(pair[0] || "");

        const value =
          String(pair[1] || "");

        if(!key || !value){
          return "";
        }

        return `
          nwr["${key}"="${value}"](area.searchArea);
        `;
      })
      .filter(Boolean)
      .join("\n");
  }

  function buildOverpassQuery(
    query,
    commune
  ){

    const rule =
      getTradeRule(query);

    const selectors =
      buildOverpassSelectors(rule);

    if(!selectors){
      return "";
    }

    const safeCommune =
      String(commune || "")
        .replace(/"/g, '\\"');

    return `
      [out:json][timeout:20];

      area
        ["boundary"="administrative"]
        ["name"="${safeCommune}"]
        ->.searchArea;

      (
        ${selectors}
      );

      out center tags;
    `;
  }

  function getOsmAddress(tags){

    tags = tags || {};

    const street =
      [
        tags["addr:housenumber"],
        tags["addr:street"]
      ]
      .filter(Boolean)
      .join(" ");

    return street.trim();
  }

  function getOsmPhone(tags){

    tags = tags || {};

    return (
      tags.phone ||
      tags["contact:phone"] ||
      ""
    );
  }

  function getOsmEmail(tags){

    tags = tags || {};

    return (
      tags.email ||
      tags["contact:email"] ||
      ""
    );
  }

  function getOsmWebsite(tags){

    tags = tags || {};

    return (
      tags.website ||
      tags["contact:website"] ||
      ""
    );
  }

  function deriveOsmActivity(
    tags,
    query
  ){

    tags = tags || {};

    if(tags.craft){
      return tags.craft;
    }

    if(tags.shop){
      return tags.shop;
    }

    if(tags.healthcare){
      return tags.healthcare;
    }

    if(tags.amenity){
      return tags.amenity;
    }

    if(tags.tourism){
      return tags.tourism;
    }

    if(tags.office){
      return tags.office;
    }

    return query || "";
  }

  function osmElementToEntity(
    element,
    query,
    commune,
    options
  ){

    const tags =
      element.tags || {};

    const lat =
      element.lat !== undefined
        ? Number(element.lat)
        : (
            element.center &&
            element.center.lat !== undefined
              ? Number(element.center.lat)
              : null
          );

    const lng =
      element.lon !== undefined
        ? Number(element.lon)
        : (
            element.center &&
            element.center.lon !== undefined
              ? Number(element.center.lon)
              : null
          );

    const raw = {

      externalId:
        "osm_" +
        String(element.type || "") +
        "_" +
        String(element.id || ""),

      source:
        "OpenStreetMap",

      name:
        tags.name ||
        tags.brand ||
        tags.operator ||
        "",

      activity:
        deriveOsmActivity(
          tags,
          query
        ),

      trade:
        query || "",

      category:
        options.category || "",

      address:
        getOsmAddress(tags),

      postalCode:
        tags["addr:postcode"] || "",

      commune:
        tags["addr:city"] ||
        commune ||
        "",

      phone:
        getOsmPhone(tags),

      email:
        getOsmEmail(tags),

      website:
        getOsmWebsite(tags),

      lat: lat,
      lng: lng,

      keywords: [
        tags.craft,
        tags.shop,
        tags.healthcare,
        tags.amenity,
        tags.tourism,
        tags.office
      ].filter(Boolean),

      verifiedAt:
        Date.now()

    };

    return normalizeEntity(raw);
  }

  async function fetchOverpass(
    query,
    commune,
    options
  ){

    const overpassQuery =
      buildOverpassQuery(
        query,
        commune
      );

    if(!overpassQuery){
      return [];
    }

    let lastError = null;

    for(
      let i = 0;
      i < OVERPASS_SERVERS.length;
      i++
    ){

      try{

        const server =
          OVERPASS_SERVERS[i];

        const response =
          await fetch(
            server,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8"
              },

              body:
                "data=" +
                encodeURIComponent(
                  overpassQuery
                )
            }
          );

        if(!response.ok){

          throw new Error(
            "HTTP " +
            response.status
          );
        }

        const data =
          await response.json();

        return safeArray(
          data.elements
        )
        .map(function(element){

          return osmElementToEntity(
            element,
            query,
            commune,
            options
          );
        });

      }catch(error){

        lastError = error;

        console.warn(
          "Bo'CitéArt Annuaire : serveur réseau indisponible.",
          OVERPASS_SERVERS[i],
          error
        );
      }
    }

    if(lastError){
      throw lastError;
    }

    return [];
  }

  /* =======================================================
     RECHERCHE NOM LIBRE
     NOMINATIM EN REPLI
     ======================================================= */

  async function searchNominatim(
    query,
    commune,
    options
  ){

    /*
      Cette recherche sert surtout
      lorsqu'aucune règle métier structurée
      n'existe : nom précis,
      produit ou service libre.

      Les résultats restent filtrés
      avant d'être acceptés.
    */

    const searchText =
      [
        query,
        commune
      ]
      .filter(Boolean)
      .join(", ");

    const url =
      "https://nominatim.openstreetmap.org/search" +
      "?format=jsonv2" +
      "&addressdetails=1" +
      "&limit=30" +
      "&q=" +
      encodeURIComponent(searchText);

    const response =
      await fetch(
        url,
        {
          headers: {
            "Accept":
              "application/json"
          }
        }
      );

    if(!response.ok){

      throw new Error(
        "HTTP " +
        response.status
      );
    }

    const rows =
      await response.json();

    return safeArray(rows)
      .map(function(row){

        const address =
          row.address || {};

        return normalizeEntity({

          externalId:
            "nominatim_" +
            String(
              row.osm_type || ""
            ) +
            "_" +
            String(
              row.osm_id || ""
            ),

          source:
            "OpenStreetMap",

          name:
            row.name ||
            (
              row.display_name
                ? row.display_name
                    .split(",")[0]
                : ""
            ),

          activity:
            row.type ||
            row.category ||
            query,

          trade:
            query,

          category:
            options.category || "",

          address:
            [
              address.house_number,
              address.road
            ]
            .filter(Boolean)
            .join(" "),

          postalCode:
            address.postcode || "",

          commune:
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            commune ||
            "",

          lat:
            Number(row.lat),

          lng:
            Number(row.lon),

          keywords: [
            row.type,
            row.category
          ].filter(Boolean),

          verifiedAt:
            Date.now()

        });
      });
  }

  /* =======================================================
     RECHERCHE RÉSEAU
     ======================================================= */

  async function searchNetwork(
    query,
    options
  ){

    options = options || {};

    const commune =
      options.commune ||
      getCurrentCommune();

    /*
      1. Fournisseur Bo'CitéArt s'il existe.
    */

    const external =
      await searchWithExternalProvider(
        query,
        options
      );

    if(
      Array.isArray(external)
    ){

      return external
        .map(normalizeEntity);
    }

    /*
      2. Démo publique.
    */

    const rule =
      getTradeRule(query);

    if(rule){

      try{

        return await fetchOverpass(
          query,
          commune,
          options
        );

      }catch(error){

        console.warn(
          "Bo'CitéArt Annuaire : recherche Overpass impossible.",
          error
        );
      }
    }

    /*
      3. Recherche libre en dernier recours.
    */

    try{

      return await searchNominatim(
        query,
        commune,
        options
      );

    }catch(error){

      console.warn(
        "Bo'CitéArt Annuaire : recherche libre impossible.",
        error
      );

      return [];
    }
  }

  /* =======================================================
     VALIDATION DES RÉSULTATS RÉSEAU
     ======================================================= */

  function validateNetworkResults(
    rawRows,
    query,
    options
  ){

    options = options || {};

    const commune =
      normalizeText(
        options.commune ||
        getCurrentCommune()
      );

    const rule =
      getTradeRule(query);

    const validated =
      safeArray(rawRows)
        .map(normalizeEntity)
        .filter(isUsableEntity)
        .filter(function(entity){

          /*
            Si la recherche est locale,
            une commune explicitement différente
            est rejetée.

            Une commune absente peut rester admise
            si la requête réseau était déjà limitée
            à la zone administrative demandée.
          */

          if(
            options.localOnly !== false &&
            commune &&
            commune !== "votre ville" &&
            entity.commune
          ){

            if(
              normalizeText(
                entity.commune
              ) !== commune
            ){
              return false;
            }
          }

          return entityMatchesTrade(
            entity,
            query,
            rule
          );
        });

    return deduplicateEntities(
      validated
    );
  }

  /* =======================================================
     AGENT.SEARCH
     ======================================================= */

  Agent.search =
    async function(options){

      options = options || {};

      const query =
        String(
          options.query || ""
        ).trim();

      const commune =
        options.commune ||
        getCurrentCommune();

      if(!query){

        return {
          query: "",
          commune: commune,
          rows: [],
          source: "none"
        };
      }

      /*
        On commence par les fiches déjà validées.
      */

      const cached =
        searchCachedEntities(
          query,
          options
        );

      let networkRows = [];

      /*
        La recherche réseau est lancée
        uniquement lorsque l'utilisateur
        a réellement demandé une recherche.
      */

      try{

        networkRows =
          await searchNetwork(
            query,
            {
              ...options,
              commune: commune
            }
          );

      }catch(error){

        console.warn(
          "Bo'CitéArt Annuaire : recherche réseau interrompue.",
          error
        );
      }

      const validatedNetwork =
        validateNetworkResults(
          networkRows,
          query,
          {
            ...options,
            commune: commune
          }
        );

      /*
        Seulement APRÈS validation,
        les données peuvent entrer
        dans la mémoire locale.
      */

      if(validatedNetwork.length){

        mergeValidatedEntities(
          validatedNetwork
        );
      }

      const combined =
        deduplicateEntities(
          cached.concat(
            validatedNetwork
          )
        )
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

      return {

        query: query,

        commune: commune,

        rows: combined,

        source:
          validatedNetwork.length
            ? "network_and_cache"
            : (
                cached.length
                  ? "cache"
                  : "none"
              )

      };
    };

  /* =======================================================
     RECHERCHE ASYNCHRONE PROTÉGÉE
     ======================================================= */

  function startSearch(
    query,
    options
  ){

    options = options || {};

    const cleanQuery =
      String(query || "").trim();

    if(!cleanQuery){

      alert(
        "Indiquez un nom, un métier, un produit ou un service."
      );

      return;
    }

    const commune =
      getCurrentCommune();

    addSearchHistory(
      cleanQuery,
      commune,
      options
    );

    const requestId =
      ++State.requestCounter;

    State.activeRequest =
      requestId;

    State.lastQuery =
      cleanQuery;

    State.lastOptions =
      {
        ...options
      };

    /*
      On entre immédiatement
      dans l'écran Résultats.

      La même modale affiche l'attente,
      puis les données.
    */

    navigate(
      "results",
      {
        query: cleanQuery,
        commune: commune,
        options: {
          ...options
        },
        loading: true,
        rows: [],
        requestId: requestId
      }
    );

    Agent.search({
      query: cleanQuery,
      commune: commune,
      category:
        options.category || "",
      trade:
        options.trade || "",
      localOnly:
        options.localOnly !== false
    })
    .then(function(result){

      /*
        Si l'utilisateur a changé d'écran
        ou lancé une autre recherche,
        cette réponse ne touche plus l'interface.
      */

      if(
        requestId !==
        State.activeRequest
      ){
        return;
      }

      if(
        !State.current ||
        State.current.type !==
        "results"
      ){
        return;
      }

      if(
        Number(
          State.current.data.requestId
        ) !==
        Number(requestId)
      ){
        return;
      }

      State.lastResults =
        safeArray(
          result.rows
        );

      replaceView(
        "results",
        {
          query:
            cleanQuery,

          commune:
            commune,

          options:
            {
              ...options
            },

          loading:
            false,

          rows:
            State.lastResults,

          requestId:
            requestId,

          source:
            result.source
        }
      );

    })
    .catch(function(error){

      console.error(
        "Bo'CitéArt Annuaire : erreur de recherche.",
        error
      );

      if(
        requestId !==
        State.activeRequest
      ){
        return;
      }

      replaceView(
        "results",
        {
          query:
            cleanQuery,

          commune:
            commune,

          options:
            {
              ...options
            },

          loading:
            false,

          rows: [],

          requestId:
            requestId,

          error: true
        }
      );
    });
  }

  /* =======================================================
     RELANCER UNE RECHERCHE HISTORIQUE
     ======================================================= */

  function replaySearchHistoryItem(id){

    const item =
      loadSearchHistory()
        .find(function(row){

          return (
            String(row.id) ===
            String(id)
          );
        });

    if(!item){

      alert(
        "Cette recherche n'est plus disponible."
      );

      return;
    }

    startSearch(
      item.query,
      {
        category:
          item.category || "",

        trade:
          item.trade || "",

        localOnly: true
      }
    );
  }

  /* =======================================================
     APPRÉCIATIONS SIMPLES 1 À 5
     ======================================================= */

  function loadRatings(){

    return safeArray(
      loadJson(
        STORAGE.ratings,
        []
      )
    );
  }

  function getEntityRatings(entityId){

    return loadRatings()
      .filter(function(item){

        return (
          String(item.entityId) ===
          String(entityId)
        );
      });
  }

  function getRatingSummary(entityId){

    const rows =
      getEntityRatings(
        entityId
      );

    if(!rows.length){

      return {
        count: 0,
        average: 0
      };
    }

    const total =
      rows.reduce(
        function(sum,item){

          return (
            sum +
            Number(item.value || 0)
          );
        },
        0
      );

    return {
      count:
        rows.length,

      average:
        total /
        rows.length
    };
  }

  function recordRating(
    entityId,
    value
  ){

    const numeric =
      Number(value);

    if(
      numeric < 1 ||
      numeric > 5
    ){
      return false;
    }

    const ratings =
      loadRatings();

    /*
      Pour la démo :
      une appréciation locale enregistrée.

      En production :
      le compte / serveur permettra
      d'empêcher les évaluations multiples
      abusives.
    */

    ratings.push({

      id:
        uniqueId("rating"),

      entityId:
        entityId,

      value:
        numeric,

      createdAt:
        Date.now()

    });

    saveJson(
      STORAGE.ratings,
      ratings
    );

    return true;
  }

  /* =======================================================
     SIGNALEMENTS
     ======================================================= */

  function loadReports(){

    return safeArray(
      loadJson(
        STORAGE.reports,
        []
      )
    );
  }

  function saveReport(
    entity,
    type
  ){

    const reports =
      loadReports();

    reports.push({

      id:
        uniqueId("report"),

      entityId:
        entity.id,

      entityName:
        entity.name,

      type:
        type,

      createdAt:
        Date.now(),

      status:
        "a_verifier"

    });

    saveJson(
      STORAGE.reports,
      reports
    );
  }

  /* =======================================================
     FIN DU BLOC 2
     ======================================================= */

   /* =======================================================
     ÉCRAN ACCUEIL
     ======================================================= */

  function renderHome(){

    const commune =
      getCurrentCommune();

    const categoriesHtml =
      CATEGORIES
        .map(function(category){

          return `
            <button
              type="button"
              class="choiceBtn annuaireCategoryBtn"
              data-category="${escapeHtml(category.id)}"
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

    const recent =
      loadSearchHistory()
        .slice(0,5);

    const recentHtml =
      recent.length
        ? recent
            .map(function(item){

              return `
                <div
                  class="box"
                  style="margin-top:7px;">

                  <div class="bociteAnnuaireTitle">
                    ${escapeHtml(item.query)}
                  </div>

                  <div
                    class="bociteAnnuaireSmall"
                    style="margin-top:4px;">
                    ${escapeHtml(item.commune || "")}
                    •
                    ${formatDateTime(item.createdAt)}
                  </div>

                  <button
                    type="button"
                    class="choiceBtn annuaireReplayHomeBtn"
                    data-id="${escapeHtml(item.id)}"
                    style="
                      width:100%;
                      margin-top:7px;
                    ">
                    Reprendre cette recherche
                  </button>

                </div>
              `;
            })
            .join("")
        : `
            <div class="bociteAnnuaireSmall">
              Vos recherches apparaîtront ici.
            </div>
          `;

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
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
        style="margin-top:9px;">

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

      <div
        class="bociteAnnuaireGrid"
        style="margin-top:9px;">
        ${categoriesHtml}
      </div>

      <div
        class="bociteAnnuaireActions"
        style="margin-top:9px;">

        <button
          id="annuaireHistoryBtn"
          class="choiceBtn"
          type="button">
          Mon historique
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
        id="annuaireProfessionalBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Espace professionnel
      </button>

      <div
        class="box"
        style="margin-top:10px;">

        <div class="bociteAnnuaireTitle">
          Recherches récentes
        </div>

        <div style="margin-top:7px;">
          ${recentHtml}
        </div>

      </div>

      <div
        class="box"
        style="margin-top:10px;">

        <div class="bociteAnnuaireText">
          ${getLogoHtml()}
          vous aide à retrouver
          les ressources économiques
          réellement présentes
          dans votre territoire.
        </div>

      </div>

    `;

    renderModal(
      "Annuaire de votre ville",
      html,
      bindHome
    );
  }

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

          startSearch(
            input
              ? input.value
              : "",
            {
              localOnly:true
            }
          );
        };
    }

    if(input){

      input.onkeydown =
        function(event){

          if(event.key === "Enter"){

            event.preventDefault();

            startSearch(
              input.value,
              {
                localOnly:true
              }
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

            navigate(
              "category",
              {
                categoryId:
                  button.getAttribute(
                    "data-category"
                  ) || ""
              }
            );
          };
      });

    document
      .querySelectorAll(
        ".annuaireReplayHomeBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            replaySearchHistoryItem(
              button.getAttribute(
                "data-id"
              )
            );
          };
      });

    const history =
      getElement(
        "annuaireHistoryBtn"
      );

    if(history){

      history.onclick =
        function(){

          navigate(
            "history",
            {}
          );
        };
    }

    const favorites =
      getElement(
        "annuaireFavoritesBtn"
      );

    if(favorites){

      favorites.onclick =
        function(){

          navigate(
            "favorites",
            {}
          );
        };
    }

    const viewed =
      getElement(
        "annuaireViewedBtn"
      );

    if(viewed){

      viewed.onclick =
        function(){

          navigate(
            "viewed",
            {}
          );
        };
    }

    const professional =
      getElement(
        "annuaireProfessionalBtn"
      );

    if(professional){

      professional.onclick =
        function(){

          requireProfessionalAccess(
            function(){

              navigate(
                "professional",
                {}
              );
            }
          );
        };
    }
  }

  /* =======================================================
     ÉCRAN CATÉGORIE
     ======================================================= */

  function getCategoryById(id){

    return CATEGORIES
      .find(function(category){

        return category.id === id;
      }) || null;
  }

  function renderCategory(data){

    const categoryId =
      data.categoryId || "";

    if(categoryId === "metiers"){

      renderAllTrades();
      return;
    }

    const category =
      getCategoryById(
        categoryId
      );

    if(!category){

      replaceView(
        "home",
        {}
      );

      return;
    }

    const trades =
      safeArray(
        TRADE_FAMILIES[
          categoryId
        ]
      );

    const tradesHtml =
      trades.length
        ? trades
            .map(function(trade){

              return `
                <button
                  type="button"
                  class="choiceBtn annuaireTradeBtn"
                  data-trade="${escapeHtml(trade)}"
                  style="
                    width:100%;
                    text-align:left;
                    margin-top:7px;
                  ">
                  ${escapeHtml(trade)}
                </button>
              `;
            })
            .join("")
        : `
            <div class="box">
              <div class="bociteAnnuaireText">
                Utilisez la recherche par nom,
                métier, produit ou service.
              </div>
            </div>
          `;

    const html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          ${escapeHtml(category.title)}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          ${escapeHtml(category.subtitle)}
        </div>

      </div>

      ${tradesHtml}

      ${getBackButtonHtml("Retour à l'annuaire")}

    `;

    renderModal(
      category.title,
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireTradeBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                navigate(
                  "trade",
                  {
                    categoryId:
                      categoryId,

                    trade:
                      button.getAttribute(
                        "data-trade"
                      ) || ""
                  }
                );
              };
          });

        bindBackButton();
      }
    );
  }

  /* =======================================================
     TOUS LES MÉTIERS
     ======================================================= */

  function renderAllTrades(){

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Tous les métiers
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Choisissez une activité.
        </div>

      </div>

    `;

    Object.keys(
      TRADE_FAMILIES
    )
    .forEach(function(categoryId){

      const category =
        getCategoryById(
          categoryId
        );

      if(!category){
        return;
      }

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireTitle">
            ${escapeHtml(category.title)}
          </div>

          ${
            TRADE_FAMILIES[categoryId]
              .map(function(trade){

                return `
                  <button
                    type="button"
                    class="choiceBtn annuaireAllTradeBtn"
                    data-category="${escapeHtml(categoryId)}"
                    data-trade="${escapeHtml(trade)}"
                    style="
                      width:100%;
                      text-align:left;
                      margin-top:6px;
                    ">
                    ${escapeHtml(trade)}
                  </button>
                `;
              })
              .join("")
          }

        </div>

      `;
    });

    html +=
      getBackButtonHtml(
        "Retour à l'annuaire"
      );

    renderModal(
      "Tous les métiers",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireAllTradeBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                navigate(
                  "trade",
                  {
                    categoryId:
                      button.getAttribute(
                        "data-category"
                      ) || "",

                    trade:
                      button.getAttribute(
                        "data-trade"
                      ) || ""
                  }
                );
              };
          });

        bindBackButton();
      }
    );
  }

  /* =======================================================
     ÉCRAN MÉTIER
     ======================================================= */

  function renderTrade(data){

    const trade =
      data.trade || "";

    const categoryId =
      data.categoryId || "";

    const html = `

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
          Rechercher les professionnels
          correspondant réellement
          à cette activité
          dans ${escapeHtml(getCurrentCommune())}.
        </div>

      </div>

      <button
        id="annuaireTradeSearchBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Voir les professionnels
      </button>

      ${getBackButtonHtml("Retour à la catégorie")}

    `;

    renderModal(
      trade,
      html,
      function(){

        const search =
          getElement(
            "annuaireTradeSearchBtn"
          );

        if(search){

          search.onclick =
            function(){

              startSearch(
                trade,
                {
                  category:
                    categoryId,

                  trade:
                    trade,

                  localOnly:
                    true
                }
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     CARTE RÉSULTAT
     ======================================================= */

  function getResultCard(entity){

    const rating =
      getRatingSummary(
        entity.id
      );

    const ratingHtml =
      rating.count
        ? `
            <div
              class="bociteAnnuaireSmall"
              style="margin-top:5px;">
              Appréciation :
              <strong>
                ${rating.average.toFixed(1)} / 5
              </strong>
              •
              ${rating.count}
              avis
            </div>
          `
        : "";

    return `

      <div
        class="box bociteAnnuaireResult">

        <div class="bociteAnnuaireTitle">
          ${escapeHtml(entity.name)}
        </div>

        ${
          entity.activity
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:4px;">
                  ${escapeHtml(entity.activity)}
                </div>
              `
            : ""
        }

        ${
          entity.commune
            ? `
                <div
                  class="bociteAnnuaireSmall"
                  style="margin-top:4px;">
                  ${escapeHtml(entity.commune)}
                </div>
              `
            : ""
        }

        ${ratingHtml}

        <button
          type="button"
          class="choiceBtn annuaireOpenEntityBtn"
          data-id="${escapeHtml(entity.id)}"
          style="
            width:100%;
            margin-top:8px;
          ">
          Voir la fiche
        </button>

      </div>

    `;
  }

  /* =======================================================
     ÉCRAN RÉSULTATS
     ======================================================= */

  function renderResults(data){

    const query =
      data.query || "";

    const commune =
      data.commune ||
      getCurrentCommune();

    const loading =
      data.loading === true;

    const rows =
      safeArray(
        data.rows
      );

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

    if(loading){

      html += `

        <div
          class="box bociteAnnuaireLoading"
          style="margin-top:9px;">

          <div class="bociteAnnuaireTitle">
            Recherche en cours…
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            ${getLogoHtml()}
            recherche uniquement
            les établissements correspondant
            à votre demande.
          </div>

        </div>

      `;

    }else if(data.error){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireTitle">
            Recherche momentanément indisponible
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Le service réseau n'a pas répondu.
            Vous pouvez réessayer.
          </div>

          <button
            id="annuaireRetrySearchBtn"
            class="choiceBtn"
            type="button"
            style="
              width:100%;
              margin-top:8px;
            ">
            Réessayer
          </button>

        </div>

      `;

    }else if(!rows.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireTitle">
            Aucun résultat correspondant
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Aucun établissement suffisamment fiable
            n'a été trouvé pour cette recherche
            dans votre commune.
          </div>

          <button
            id="annuaireExpandSearchBtn"
            class="choiceBtn"
            type="button"
            style="
              width:100%;
              margin-top:8px;
            ">
            Élargir la recherche
          </button>

        </div>

      `;

    }else{

      html += `

        <div
          class="bociteAnnuaireSmall"
          style="margin:9px 0;">
          ${rows.length}
          établissement(s) trouvé(s)
        </div>

      `;

      rows.forEach(function(entity){

        html +=
          getResultCard(entity);
      });
    }

    html +=
      getBackButtonHtml(
        "Retour"
      );

    renderModal(
      "Résultats",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireOpenEntityBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                navigate(
                  "entity",
                  {
                    entityId:
                      button.getAttribute(
                        "data-id"
                      ),

                    fromQuery:
                      query,

                    resultRows:
                      rows
                  }
                );
              };
          });

        const retry =
          getElement(
            "annuaireRetrySearchBtn"
          );

        if(retry){

          retry.onclick =
            function(){

              startSearch(
                query,
                {
                  ...(data.options || {})
                }
              );
            };
        }

        const expand =
          getElement(
            "annuaireExpandSearchBtn"
          );

        if(expand){

          expand.onclick =
            function(){

              startSearch(
                query,
                {
                  ...(data.options || {}),
                  localOnly:false
                }
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     FICHE ÉTABLISSEMENT
     ======================================================= */

  function renderEntity(data){

    const entity =
      getEntityById(
        data.entityId
      );

    if(!entity){

      renderModal(
        "Fiche indisponible",
        `
          <div class="box">
            <div class="bociteAnnuaireText">
              Cette fiche n'est plus disponible.
            </div>
          </div>

          ${getBackButtonHtml("Retour")}
        `,
        bindBackButton
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

    const rating =
      getRatingSummary(
        entity.id
      );

    const address =
      [
        entity.address,
        entity.postalCode,
        entity.commune
      ]
      .filter(Boolean)
      .join(" ");

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div class="bociteAnnuaireTitle">
          ${escapeHtml(entity.name)}
        </div>

        ${
          entity.activity
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:4px;">
                  ${escapeHtml(entity.activity)}
                </div>
              `
            : ""
        }

        ${
          address
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:7px;">
                  ${escapeHtml(address)}
                </div>
              `
            : ""
        }

              ${
          entity.source
            ? `
                <div
                  class="bociteAnnuaireSmall"
                  style="margin-top:7px;">
                  Source :
                  ${escapeHtml(entity.source)}
                </div>
              `
            : ""
        }

        ${getHoursInformationHtml(entity)}

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

        ${
          address
            ? `
                <button
                  id="annuaireEntityRouteBtn"
                  class="choiceBtn"
                  type="button">
                  Itinéraire
                </button>
              `
            : ""
        }

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
            : "Ajouter à mes favoris"
        }
      </button>

      ${
        entity.description
          ? `
              <div
                class="box"
                style="margin-top:9px;">

                <div class="bociteAnnuaireTitle">
                  Présentation
                </div>

                <div
                  class="bociteAnnuaireText"
                  style="margin-top:6px;">
                  ${escapeHtml(entity.description)}
                </div>

              </div>
            `
          : ""
      }

      ${
        safeArray(entity.services).length
          ? `
              <div
                class="box"
                style="margin-top:9px;">

                <div class="bociteAnnuaireTitle">
                  Services
                </div>

                <div
                  class="bociteAnnuaireText"
                  style="margin-top:6px;">
                  ${
                    entity.services
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
          : ""
      }

      <div
        class="box"
        style="margin-top:9px;">

        <div class="bociteAnnuaireTitle">
          Appréciation locale
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">

          ${
            rating.count
              ? (
                  "Moyenne : <strong>" +
                  rating.average.toFixed(1) +
                  " / 5</strong> • " +
                  rating.count +
                  " appréciation(s)"
                )
              : "Aucune appréciation pour le moment."
          }

        </div>

        <div class="bociteAnnuaireStars">

          <button
            type="button"
            class="choiceBtn bociteAnnuaireStarBtn annuaireRatingBtn"
            data-rating="1">
            1
          </button>

          <button
            type="button"
            class="choiceBtn bociteAnnuaireStarBtn annuaireRatingBtn"
            data-rating="2">
            2
          </button>

          <button
            type="button"
            class="choiceBtn bociteAnnuaireStarBtn annuaireRatingBtn"
            data-rating="3">
            3
          </button>

          <button
            type="button"
            class="choiceBtn bociteAnnuaireStarBtn annuaireRatingBtn"
            data-rating="4">
            4
          </button>

          <button
            type="button"
            class="choiceBtn bociteAnnuaireStarBtn annuaireRatingBtn"
            data-rating="5">
            5
          </button>

        </div>

        <div
          class="bociteAnnuaireSmall"
          style="margin-top:6px;">
          Pas de commentaire public.
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        <div class="bociteAnnuaireTitle">
          Emploi
        </div>

        ${
          entity.recruiting
            ? `
                <button
                  id="annuaireJobsBtn"
                  class="choiceBtn"
                  type="button"
                  style="
                    width:100%;
                    margin-top:7px;
                  ">
                  Voir les offres de cette entreprise
                </button>
              `
            : ""
        }

        <button
          id="annuaireSpontaneousBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:7px;
          ">
          Déposer une candidature spontanée
        </button>

      </div>

      <button
        id="annuaireReportBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Signaler une information incorrecte
      </button>

      ${getBackButtonHtml("Retour aux résultats")}

    `;

    renderModal(
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
                String(entity.phone)
                  .replace(/\s+/g, "");
            };
        }

        const route =
          getElement(
            "annuaireEntityRouteBtn"
          );

        if(route){

          route.onclick =
            function(){

              window.open(
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(address),
                "_blank",
                "noopener"
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
                  : "Ajouter à mes favoris";
            };
        }

        document
          .querySelectorAll(
            ".annuaireRatingBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                const value =
                  Number(
                    button.getAttribute(
                      "data-rating"
                    )
                  );

                if(
                  recordRating(
                    entity.id,
                    value
                  )
                ){

                  alert(
                    "Votre appréciation est enregistrée."
                  );

                  replaceView(
                    "entity",
                    {
                      ...data
                    }
                  );
                }
              };
          });

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

              if(
                typeof module.openScreen ===
                "function"
              ){

                module.openScreen(
                  "emploi"
                );
              }
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

                module.openApplicationForm({
                  companyId:
                    entity.id,
                  companyName:
                    entity.name
                });

                return;
              }

              if(
                typeof module.openEmploymentPublicHome ===
                "function"
              ){

                module.openEmploymentPublicHome();
                return;
              }

              if(
                typeof module.openScreen ===
                "function"
              ){

                module.openScreen(
                  "emploi"
                );
              }
            };
        }

        const report =
          getElement(
            "annuaireReportBtn"
          );

        if(report){

          report.onclick =
            function(){

              navigate(
                "report",
                {
                  entityId:
                    entity.id
                }
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     HISTORIQUE
     ======================================================= */

  function renderHistory(){

    const history =
      loadSearchHistory();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Mon historique
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Vos recherches restent disponibles
          tant que vous ne décidez pas
          de les supprimer.
        </div>

      </div>

    `;

    if(!history.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireText">
            Aucun historique pour le moment.
          </div>

        </div>

      `;

    }else{

      history.forEach(function(item){

        html += `

          <div
            class="box bociteAnnuaireHistoryRow">

            <div class="bociteAnnuaireTitle">
              ${escapeHtml(item.query)}
            </div>

            <div
              class="bociteAnnuaireSmall"
              style="margin-top:4px;">
              ${escapeHtml(item.commune || "")}
              <br>
              ${formatDateTime(item.createdAt)}
            </div>

            <div
              class="bociteAnnuaireActions"
              style="margin-top:8px;">

              <button
                type="button"
                class="choiceBtn annuaireHistoryReplayBtn"
                data-id="${escapeHtml(item.id)}">
                Reprendre
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
      });

      html += `

        <button
          id="annuaireHistoryClearAllBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:10px;
          ">
          Tout supprimer
        </button>

      `;
    }

    html +=
      getBackButtonHtml(
        "Retour à l'annuaire"
      );

    renderModal(
      "Mon historique",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireHistoryReplayBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                replaySearchHistoryItem(
                  button.getAttribute(
                    "data-id"
                  )
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

                const confirmed =
                  window.confirm(
                    "Supprimer uniquement cette ligne de votre historique ?"
                  );

                if(!confirmed){
                  return;
                }

                deleteSearchHistoryItem(
                  button.getAttribute(
                    "data-id"
                  )
                );

                replaceView(
                  "history",
                  {}
                );
              };
          });

        const clear =
          getElement(
            "annuaireHistoryClearAllBtn"
          );

        if(clear){

          clear.onclick =
            function(){

              const confirmed =
                window.confirm(
                  "Supprimer tout votre historique de recherches ? Cette action supprimera toutes les lignes enregistrées sur cet appareil."
                );

              if(!confirmed){
                return;
              }

              clearSearchHistory();

              replaceView(
                "history",
                {}
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     FAVORIS
     ======================================================= */

  function renderFavorites(){

    const favorites =
      loadFavorites();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Mes favoris
        </div>

      </div>

    `;

    if(!favorites.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">
          <div class="bociteAnnuaireText">
            Aucun favori enregistré.
          </div>
        </div>

      `;

    }else{

      favorites.forEach(function(item){

        html += `

          <button
            type="button"
            class="choiceBtn annuaireFavoriteOpenBtn"
            data-id="${escapeHtml(item.entityId)}"
            style="
              width:100%;
              text-align:left;
              margin-top:7px;
            ">

            <strong>
              ${escapeHtml(item.name)}
            </strong>

            ${
              item.activity
                ? `
                    <br>
                    <span
                      style="
                        font-size:12px;
                        font-weight:400;
                      ">
                      ${escapeHtml(item.activity)}
                    </span>
                  `
                : ""
            }

          </button>

        `;
      });
    }

    html +=
      getBackButtonHtml(
        "Retour à l'annuaire"
      );

    renderModal(
      "Mes favoris",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireFavoriteOpenBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                navigate(
                  "entity",
                  {
                    entityId:
                      button.getAttribute(
                        "data-id"
                      )
                  }
                );
              };
          });

        bindBackButton();
      }
    );
  }

  /* =======================================================
     CONSULTÉS RÉCEMMENT
     ======================================================= */

  function renderViewed(){

    const history =
      loadViewedHistory();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Consultés récemment
        </div>

      </div>

    `;

    if(!history.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">
          <div class="bociteAnnuaireText">
            Aucune fiche consultée.
          </div>
        </div>

      `;

    }else{

      history.forEach(function(item){

        html += `

          <button
            type="button"
            class="choiceBtn annuaireViewedOpenBtn"
            data-id="${escapeHtml(item.entityId)}"
            style="
              width:100%;
              text-align:left;
              margin-top:7px;
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
              ${formatDateTime(item.viewedAt)}
            </span>

          </button>

        `;
      });
    }

    html +=
      getBackButtonHtml(
        "Retour à l'annuaire"
      );

    renderModal(
      "Consultés récemment",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireViewedOpenBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                navigate(
                  "entity",
                  {
                    entityId:
                      button.getAttribute(
                        "data-id"
                      )
                  }
                );
              };
          });

        bindBackButton();
      }
    );
  }

  /* =======================================================
     SIGNALEMENT
     ======================================================= */

  function renderReport(data){

    const entity =
      getEntityById(
        data.entityId
      );

    if(!entity){

      goBack();
      return;
    }

    const html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Signaler une information
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          ${escapeHtml(entity.name)}
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

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
            value="activite">
          Activité incorrecte
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
        Envoyer le signalement
      </button>

      ${getBackButtonHtml("Retour à la fiche")}

    `;

    renderModal(
      "Signaler une information",
      html,
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

              saveReport(
                entity,
                selected.value
              );

              alert(
                "Merci. L'information sera vérifiée avant toute modification."
              );

              goBack();
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     FIN DU BLOC 3
     ======================================================= */

   /* =======================================================
     ESPACE PROFESSIONNEL
     ======================================================= */

  function loadProfessionalHistory(){

    return safeArray(
      loadJson(
        STORAGE.professionalHistory,
        []
      )
    );
  }

  function saveProfessionalHistory(history){

    saveJson(
      STORAGE.professionalHistory,
      safeArray(history)
    );
  }

  function addProfessionalSearch(
    query,
    details,
    zone
  ){

    const history =
      loadProfessionalHistory();

    const item = {

      id:
        uniqueId("prosearch"),

      query:
        String(query || "").trim(),

      details:
        String(details || "").trim(),

      zone:
        zone || "commune",

      status:
        "en_cours",

      createdAt:
        Date.now(),

      updatedAt:
        Date.now()

    };

    history.unshift(item);

    saveProfessionalHistory(history);

    return item;
  }

  function toggleProfessionalHistoryStatus(id){

    const history =
      loadProfessionalHistory();

    const item =
      history.find(function(row){

        return (
          String(row.id) ===
          String(id)
        );
      });

    if(!item){
      return;
    }

    item.status =
      item.status === "terminee"
        ? "en_cours"
        : "terminee";

    item.updatedAt =
      Date.now();

    saveProfessionalHistory(history);
  }

  function deleteProfessionalHistoryItem(id){

    const history =
      loadProfessionalHistory()
        .filter(function(item){

          return (
            String(item.id) !==
            String(id)
          );
        });

    saveProfessionalHistory(history);
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

  function saveNotebook(items){

    saveJson(
      STORAGE.notebook,
      safeArray(items)
    );
  }

  function addNotebookItem(
    entity,
    note
  ){

    let items =
      loadNotebook();

    const existing =
      items.find(function(item){

        return (
          String(item.entityId) ===
          String(entity.id)
        );
      });

    if(existing){

      existing.note =
        String(note || "").trim();

      existing.updatedAt =
        Date.now();

    }else{

      items.unshift({

        id:
          uniqueId("notebook"),

        entityId:
          entity.id,

        name:
          entity.name,

        commune:
          entity.commune,

        activity:
          entity.activity ||
          entity.trade ||
          "",

        note:
          String(note || "").trim(),

        createdAt:
          Date.now(),

        updatedAt:
          Date.now()

      });
    }

    saveNotebook(items);
  }

  function deleteNotebookItem(entityId){

    const items =
      loadNotebook()
        .filter(function(item){

          return (
            String(item.entityId) !==
            String(entityId)
          );
        });

    saveNotebook(items);
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

  function saveFollowed(items){

    saveJson(
      STORAGE.followed,
      safeArray(items)
    );
  }

  function followEntity(entity){

    const items =
      loadFollowed();

    const exists =
      items.some(function(item){

        return (
          String(item.entityId) ===
          String(entity.id)
        );
      });

    if(exists){
      return false;
    }

    items.unshift({

      id:
        uniqueId("follow"),

      entityId:
        entity.id,

      name:
        entity.name,

      commune:
        entity.commune,

      createdAt:
        Date.now(),

      lastCheckedAt:
        entity.professionalData &&
        entity.professionalData.checkedAt
          ? entity.professionalData.checkedAt
          : 0

    });

    saveFollowed(items);

    return true;
  }

  function unfollowEntity(entityId){

    const items =
      loadFollowed()
        .filter(function(item){

          return (
            String(item.entityId) !==
            String(entityId)
          );
        });

    saveFollowed(items);
  }

  /* =======================================================
     TABLEAU PROFESSIONNEL
     ======================================================= */

  function renderProfessional(){

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div class="bociteAnnuaireTitle">
          Espace professionnel
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Recherchez, conservez et suivez
          les entreprises utiles
          à votre activité.
        </div>

      </div>

      <button
        id="annuaireProSearchOpenBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Recherche professionnelle
      </button>

      <button
        id="annuaireProHistoryOpenBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Mes recherches professionnelles
      </button>

      <button
        id="annuaireNotebookOpenBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Mon carnet professionnel
      </button>

      <button
        id="annuaireFollowedOpenBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Entreprises suivies
      </button>

      <button
        id="annuaireProInformationOpenBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Informations professionnelles
      </button>

      <button
        id="annuaireBercyOpenPanelBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Bercy Infos Entreprises
      </button>

      ${getBackButtonHtml("Retour à l'annuaire")}

    `;

    renderModal(
      "Espace professionnel",
      html,
      function(){

        const search =
          getElement(
            "annuaireProSearchOpenBtn"
          );

        if(search){

          search.onclick =
            function(){

              navigate(
                "professional_search",
                {}
              );
            };
        }

        const history =
          getElement(
            "annuaireProHistoryOpenBtn"
          );

        if(history){

          history.onclick =
            function(){

              navigate(
                "professional_history",
                {}
              );
            };
        }

        const notebook =
          getElement(
            "annuaireNotebookOpenBtn"
          );

        if(notebook){

          notebook.onclick =
            function(){

              navigate(
                "notebook",
                {}
              );
            };
        }

        const followed =
          getElement(
            "annuaireFollowedOpenBtn"
          );

        if(followed){

          followed.onclick =
            function(){

              navigate(
                "followed",
                {}
              );
            };
        }

        const information =
          getElement(
            "annuaireProInformationOpenBtn"
          );

        if(information){

          information.onclick =
            function(){

              navigate(
                "professional_company_picker",
                {}
              );
            };
        }

        const bercy =
          getElement(
            "annuaireBercyOpenPanelBtn"
          );

        if(bercy){

          bercy.onclick =
            function(){

              navigate(
                "bercy",
                {}
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     RECHERCHE PROFESSIONNELLE
     ======================================================= */

  function renderProfessionalSearch(){

    const html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Recherche professionnelle
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
            min-height:44px;
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
            min-height:44px;
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
        Rechercher
      </button>

      ${getBackButtonHtml("Retour à l'espace professionnel")}

    `;

    renderModal(
      "Recherche professionnelle",
      html,
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
                )?.value.trim() || "";

              const details =
                getElement(
                  "annuaireProDetailsInput"
                )?.value.trim() || "";

              const zone =
                getElement(
                  "annuaireProZoneInput"
                )?.value || "commune";

              if(!query){

                alert(
                  "Indiquez votre recherche."
                );

                return;
              }

              addProfessionalSearch(
                query,
                details,
                zone
              );

              startSearch(
                query,
                {
                  professional:true,
                  localOnly:
                    zone === "commune"
                }
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     HISTORIQUE PROFESSIONNEL
     ======================================================= */

  function renderProfessionalHistory(){

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
          Les recherches restent disponibles
          jusqu'à leur suppression.
        </div>

      </div>

    `;

    if(!history.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireText">
            Aucune recherche professionnelle.
          </div>

        </div>

      `;

    }else{

      history.forEach(function(item){

        html += `

          <div
            class="box"
            style="margin-top:8px;">

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
              style="margin-top:5px;">

              Zone :
              ${escapeHtml(item.zone)}

              <br>

              Créée :
              ${formatDateTime(item.createdAt)}

              <br>

              Statut :
              ${
                item.status === "terminee"
                  ? "Terminée"
                  : "En cours"
              }

            </div>

            <div
              class="bociteAnnuaireActions"
              style="margin-top:8px;">

              <button
                type="button"
                class="choiceBtn annuaireProHistoryReplayBtn"
                data-id="${escapeHtml(item.id)}">
                Reprendre
              </button>

              <button
                type="button"
                class="choiceBtn annuaireProHistoryStatusBtn"
                data-id="${escapeHtml(item.id)}">
                ${
                  item.status === "terminee"
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
              Supprimer cette recherche
            </button>

          </div>

        `;
      });
    }

    html +=
      getBackButtonHtml(
        "Retour à l'espace professionnel"
      );

    renderModal(
      "Mes recherches professionnelles",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireProHistoryReplayBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                const item =
                  loadProfessionalHistory()
                    .find(function(row){

                      return (
                        String(row.id) ===
                        String(
                          button.getAttribute(
                            "data-id"
                          )
                        )
                      );
                    });

                if(!item){
                  return;
                }

                startSearch(
                  item.query,
                  {
                    professional:true,
                    localOnly:
                      item.zone === "commune"
                  }
                );
              };
          });

        document
          .querySelectorAll(
            ".annuaireProHistoryStatusBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                toggleProfessionalHistoryStatus(
                  button.getAttribute(
                    "data-id"
                  )
                );

                replaceView(
                  "professional_history",
                  {}
                );
              };
          });

        document
          .querySelectorAll(
            ".annuaireProHistoryDeleteBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                const confirmed =
                  window.confirm(
                    "Supprimer cette recherche professionnelle ?"
                  );

                if(!confirmed){
                  return;
                }

                deleteProfessionalHistoryItem(
                  button.getAttribute(
                    "data-id"
                  )
                );

                replaceView(
                  "professional_history",
                  {}
                );
              };
          });

        bindBackButton();
      }
    );
  }

  /* =======================================================
     CARNET PROFESSIONNEL
     ======================================================= */

  function renderNotebook(){

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
          Contacts et notes privées.
        </div>

      </div>

    `;

    if(!items.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireText">
            Aucun professionnel enregistré.
          </div>

        </div>

      `;

    }else{

      items.forEach(function(item){

        html += `

          <div
            class="box"
            style="margin-top:8px;">

            <div class="bociteAnnuaireTitle">
              ${escapeHtml(item.name)}
            </div>

            <div
              class="bociteAnnuaireSmall"
              style="margin-top:4px;">
              ${escapeHtml(item.commune || "")}
            </div>

            ${
              item.note
                ? `
                    <div
                      class="bociteAnnuaireText"
                      style="margin-top:6px;">
                      <strong>Ma note privée :</strong>
                      <br>
                      ${escapeHtml(item.note)}
                    </div>
                  `
                : ""
            }

            <div
              class="bociteAnnuaireActions"
              style="margin-top:8px;">

              <button
                type="button"
                class="choiceBtn annuaireNotebookEntityBtn"
                data-id="${escapeHtml(item.entityId)}">
                Voir la fiche
              </button>

              <button
                type="button"
                class="choiceBtn annuaireNotebookDeleteBtn"
                data-id="${escapeHtml(item.entityId)}">
                Supprimer
              </button>

            </div>

          </div>

        `;
      });
    }

    html +=
      getBackButtonHtml(
        "Retour à l'espace professionnel"
      );

    renderModal(
      "Mon carnet professionnel",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireNotebookEntityBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                navigate(
                  "professional_information",
                  {
                    entityId:
                      button.getAttribute(
                        "data-id"
                      )
                  }
                );
              };
          });

        document
          .querySelectorAll(
            ".annuaireNotebookDeleteBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                const confirmed =
                  window.confirm(
                    "Supprimer cette entreprise de votre carnet ?"
                  );

                if(!confirmed){
                  return;
                }

                deleteNotebookItem(
                  button.getAttribute(
                    "data-id"
                  )
                );

                replaceView(
                  "notebook",
                  {}
                );
              };
          });

        bindBackButton();
      }
    );
  }

  /* =======================================================
     ENTREPRISES SUIVIES
     ======================================================= */

  function renderFollowed(){

    const items =
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
          disponibles sur les entreprises
          que vous souhaitez suivre.
        </div>

      </div>

    `;

    if(!items.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireText">
            Aucune entreprise suivie.
          </div>

        </div>

      `;

    }else{

      items.forEach(function(item){

        html += `

          <div
            class="box"
            style="margin-top:8px;">

            <div class="bociteAnnuaireTitle">
              ${escapeHtml(item.name)}
            </div>

            <div
              class="bociteAnnuaireSmall"
              style="margin-top:4px;">
              Suivie depuis :
              ${formatDateTime(item.createdAt)}
            </div>

            <div
              class="bociteAnnuaireActions"
              style="margin-top:8px;">

              <button
                type="button"
                class="choiceBtn annuaireFollowedEntityBtn"
                data-id="${escapeHtml(item.entityId)}">
                Voir
              </button>

              <button
                type="button"
                class="choiceBtn annuaireFollowedDeleteBtn"
                data-id="${escapeHtml(item.entityId)}">
                Ne plus suivre
              </button>

            </div>

          </div>

        `;
      });
    }

    html +=
      getBackButtonHtml(
        "Retour à l'espace professionnel"
      );

    renderModal(
      "Entreprises suivies",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireFollowedEntityBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                navigate(
                  "professional_information",
                  {
                    entityId:
                      button.getAttribute(
                        "data-id"
                      )
                  }
                );
              };
          });

        document
          .querySelectorAll(
            ".annuaireFollowedDeleteBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                unfollowEntity(
                  button.getAttribute(
                    "data-id"
                  )
                );

                replaceView(
                  "followed",
                  {}
                );
              };
          });

        bindBackButton();
      }
    );
  }

  /* =======================================================
     CHOISIR UNE ENTREPRISE
     ======================================================= */

  function renderProfessionalCompanyPicker(){

    const entities =
      loadEntities();

    let html = `

      <div class="box">

        <div class="bociteAnnuaireTitle">
          Informations professionnelles
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Choisissez une entreprise
          déjà identifiée dans l'annuaire.
        </div>

      </div>

    `;

    if(!entities.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div class="bociteAnnuaireText">
            Aucune entreprise n'est encore disponible.
            Effectuez d'abord une recherche.
          </div>

        </div>

      `;

    }else{

      entities
        .slice()
        .sort(function(a,b){

          return String(
            a.name || ""
          ).localeCompare(
            String(
              b.name || ""
            ),
            "fr"
          );
        })
        .forEach(function(entity){

          html += `

            <button
              type="button"
              class="choiceBtn annuaireProCompanyBtn"
              data-id="${escapeHtml(entity.id)}"
              style="
                width:100%;
                text-align:left;
                margin-top:7px;
              ">

              <strong>
                ${escapeHtml(entity.name)}
              </strong>

              ${
                entity.activity
                  ? `
                      <br>
                      <span
                        style="
                          font-size:12px;
                          font-weight:400;
                        ">
                        ${escapeHtml(entity.activity)}
                      </span>
                    `
                  : ""
              }

            </button>

          `;
        });
    }

    html +=
      getBackButtonHtml(
        "Retour à l'espace professionnel"
      );

    renderModal(
      "Informations professionnelles",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireProCompanyBtn"
          )
          .forEach(function(button){

            button.onclick =
              function(){

                navigate(
                  "professional_information",
                  {
                    entityId:
                      button.getAttribute(
                        "data-id"
                      )
                  }
                );
              };
          });

        bindBackButton();
      }
    );
  }

  /* =======================================================
     INFORMATIONS PROFESSIONNELLES
     ======================================================= */

  function renderProfessionalInformation(data){

    const entity =
      getEntityById(
        data.entityId
      );

    if(!entity){

      renderModal(
        "Informations professionnelles",
        `
          <div class="box">
            <div class="bociteAnnuaireText">
              Cette entreprise n'est plus disponible.
            </div>
          </div>

          ${getBackButtonHtml("Retour")}
        `,
        bindBackButton
      );

      return;
    }

    const professional =
      entity.professionalData || {};

    const fields = [

      ["SIREN", entity.siren || professional.siren],

      ["SIRET", entity.siret || professional.siret],

      ["Forme juridique", professional.legalForm],

      ["Date de création", professional.creationDate],

      ["Activité", professional.activity || entity.activity],

      ["État de l'établissement", professional.status],

      ["Tranche d'effectifs", professional.workforce],

      ["Derniers comptes disponibles", professional.latestAccounts],

      ["Chiffre d'affaires publié", professional.revenue],

      ["Résultat publié", professional.result]

    ];

    const information =
      fields
        .filter(function(field){

          return !!field[1];
        })
        .map(function(field){

          return `
            <div
              class="bociteAnnuaireText"
              style="margin-top:6px;">
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
        professional.events
      );

    const html = `

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
          Informations publiques disponibles
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        ${
          information ||
          `
            <div class="bociteAnnuaireText">
              Aucune donnée professionnelle enrichie
              n'est encore disponible pour cette fiche.
            </div>
          `
        }

        ${
          professional.checkedAt
            ? `
                <div
                  class="bociteAnnuaireSmall"
                  style="margin-top:9px;">
                  Dernière vérification :
                  ${formatDateTime(
                    professional.checkedAt
                  )}
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
                  Événements publics disponibles
                </div>

                <div
                  class="bociteAnnuaireText"
                  style="margin-top:6px;">

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
                                escapeHtml(event.date)
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

      <div
        class="box"
        style="margin-top:9px;">

        <div class="bociteAnnuaireSmall">
          Bo'CitéArt présente
          des informations factuelles disponibles.
          Elles ne constituent ni une notation,
          ni une garantie de solvabilité
          ou de santé financière.
        </div>

      </div>

      <button
        id="annuaireFollowCompanyBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Ajouter aux entreprises suivies
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

      ${getBackButtonHtml("Retour")}

    `;

    renderModal(
      "Informations professionnelles",
      html,
      function(){

        const follow =
          getElement(
            "annuaireFollowCompanyBtn"
          );

        if(follow){

          follow.onclick =
            function(){

              const added =
                followEntity(entity);

              alert(
                added
                  ? "Cette entreprise est ajoutée à votre suivi."
                  : "Cette entreprise est déjà suivie."
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
                  "Ajoutez une note privée :",
                  ""
                );

              if(note === null){
                return;
              }

              addNotebookItem(
                entity,
                note
              );

              alert(
                "Cette entreprise est enregistrée dans votre carnet."
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     BERCY INFOS ENTREPRISES
     ======================================================= */

  function renderBercy(){

    const html = `

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
          Fiscalité • comptabilité • obligations • aides • gestion
        </div>

      </div>

      <button
        id="annuaireBercyExternalBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Consulter Bercy Infos Entreprises
      </button>

      ${getBackButtonHtml("Retour à l'espace professionnel")}

    `;

    renderModal(
      "Bercy Infos Entreprises",
      html,
      function(){

        const open =
          getElement(
            "annuaireBercyExternalBtn"
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

        bindBackButton();
      }
    );
  }

  /* =======================================================
     ROUTEUR UNIQUE
     ======================================================= */

  function renderCurrentView(){

    if(!State.current){

      State.current = {
        type:"home",
        data:{}
      };
    }

    const type =
      State.current.type;

    const data =
      State.current.data || {};

    if(type === "home"){
      renderHome();
      return;
    }

    if(type === "category"){
      renderCategory(data);
      return;
    }

    if(type === "trade"){
      renderTrade(data); 
      return;
    }

    if(type === "results"){
      renderResults(data);
      return;
    }

    if(type === "entity"){
      renderEntity(data);
      return;
    }

    if(type === "history"){
      renderHistory();
      return;
    }

    if(type === "favorites"){
      renderFavorites();
      return;
    }

    if(type === "viewed"){
      renderViewed();
      return;
    }

    if(type === "report"){
      renderReport(data);
      return;
    }

    if(type === "professional"){
      renderProfessional();
      return;
    }

    if(type === "professional_search"){
      renderProfessionalSearch();
      return;
    }

    if(type === "professional_history"){
      renderProfessionalHistory();
      return;
    }

    if(type === "notebook"){
      renderNotebook();
      return;
    }

    if(type === "followed"){
      renderFollowed();
      return;
    }

    if(type === "professional_company_picker"){
      renderProfessionalCompanyPicker();
      return;
    }

    if(type === "professional_information"){
      renderProfessionalInformation(data);
      return;
    }

    if(type === "bercy"){
      renderBercy();
      return;
    }

    /*
      Sécurité :
      toute vue inconnue revient à l'accueil.
    */

    State.stack = [];

    State.current = {
      type:"home",
      data:{}
    };

    renderHome();
  }

  /* =======================================================
     EXPOSITION PUBLIQUE DU MODULE
     ======================================================= */

  Annuaire.openHome =
    resetNavigation;

  Annuaire.openSearch =
    function(query){

      if(!State.current){
        resetNavigation();
      }

      startSearch(
        query,
        {
          localOnly:true
        }
      );
    };

  Annuaire.openCategory =
    function(categoryId){

      if(!State.current){

        State.current = {
          type:"home",
          data:{}
        };
      }

      navigate(
        "category",
        {
          categoryId:
            categoryId
        }
      );
    };

  Annuaire.openEntity =
    function(entityId){

      navigate(
        "entity",
        {
          entityId:
            entityId
        }
      );
    };

  Annuaire.openSearchHistory =
    function(){

      navigate(
        "history",
        {}
      );
    };

  Annuaire.openFavorites =
    function(){

      navigate(
        "favorites",
        {}
      );
    };

  Annuaire.openRecentlyViewed =
    function(){

      navigate(
        "viewed",
        {}
      );
    };

  Annuaire.openProfessionalDashboard =
    function(){

      requireProfessionalAccess(
        function(){

          navigate(
            "professional",
            {}
          );
        }
      );
    };

  Annuaire.loadEntities =
    loadEntities;

  Annuaire.saveEntities =
    saveEntities;

  Annuaire.getEntityById =
    getEntityById;

  Annuaire.goBack =
    goBack;

  /* =======================================================
     COMPATIBILITÉ AVEC ENTREPRISE.JS
     ======================================================= */

  if(
    typeof module.registerScreen === "function"
  ){

    module.registerScreen(
      "annuaire",
      resetNavigation
    );

    module.registerScreen(
      "annuaire_local",
      resetNavigation
    );

    module.registerScreen(
      "recherche_professionnelle",
      function(){

        requireProfessionalAccess(
          function(){

            State.stack = [];

            State.current = {
              type:"professional",
              data:{}
            };

            renderCurrentView();
          }
        );
      }
    );
  }

  module.openAnnuaire =
    resetNavigation;

  module.openLocalDirectory =
    resetNavigation;

  module.openCorrectedDirectory =
    resetNavigation;

  module.openProfessionalDirectory =
    function(){

      requireProfessionalAccess(
        function(){

          State.stack = [];

          State.current = {
            type:"professional",
            data:{}
          };

          renderCurrentView();
        }
      );
    };

  /* =======================================================
     INITIALISATION DU SCHÉMA
     ======================================================= */

  saveJson(
    STORAGE.schema,
    {
      version:
        VERSION,

      initializedAt:
        loadJson(
          STORAGE.schema,
          {}
        ).initializedAt ||
        Date.now()
    }
  );

  /* =======================================================
     ANNUAIRE — BLANC DÉFINITIF DES BOUTONS
     RETOUR CONSERVÉ EN BEIGE
     ======================================================= */

  (function forceAnnuaireWhiteButtons(){

    if(
      document.getElementById(
        "bociteAnnuaireWhiteFinal"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteAnnuaireWhiteFinal";

    style.textContent = `

      /* TOUS LES BOUTONS D'ACTION DE L'ANNUAIRE */

      .annuaireCategoryBtn,
      .annuaireTradeBtn,
      .annuaireAllTradeBtn,
      .annuaireReplayHomeBtn,
      .annuaireOpenEntityBtn,
      .annuaireRatingBtn,
      .annuaireHistoryReplayBtn,
      .annuaireHistoryDeleteBtn,
      .annuaireFavoriteOpenBtn,
      .annuaireViewedOpenBtn,

      #annuaireSearchBtn,
      #annuaireHistoryBtn,
      #annuaireFavoritesBtn,
      #annuaireViewedBtn,
      #annuaireProfessionalBtn,
      #annuaireTradeSearchBtn,
      #annuaireRetrySearchBtn,
      #annuaireExpandSearchBtn,
      #annuaireFavoriteToggleBtn,
      #annuaireEntityCallBtn,
      #annuaireEntityRouteBtn,
      #annuaireEntityMailBtn,
      #annuaireEntityWebBtn,
      #annuaireJobsBtn,
      #annuaireSpontaneousBtn,
      #annuaireReportBtn,
      #annuaireReportSendBtn,
      #annuaireHistoryClearAllBtn,

      [class*="annuairePro"]:not(#annuaireInternalBackBtn),
      [class*="annuaireNotebook"]:not(#annuaireInternalBackBtn),
      [class*="annuaireFollowed"]:not(#annuaireInternalBackBtn){

        background:#ffffff !important;
        background-color:#ffffff !important;
        color:#111111 !important;

      }

      /* LES 8 GRANDES CASES DE L'ACCUEIL */

      button.annuaireCategoryBtn{

        background:#ffffff !important;
        background-color:#ffffff !important;

      }

      /* RETOUR UNIQUEMENT : IL RESTE BEIGE */

      #annuaireInternalBackBtn{

        background:#f3e7d3 !important;
        background-color:#f3e7d3 !important;
        color:#111111 !important;

      }

      /* CHAMPS DE SAISIE */

      #annuaireSearchInput,
      #annuaireProQueryInput,
      #annuaireProDetailsInput,
      #annuaireProZoneInput{

        background:#ffffff !important;
        background-color:#ffffff !important;
        color:#111111 !important;

      }

    `;

    document.head.appendChild(style);

  })();
   
  console.log(
    "✅ Bo'CitéArt — Annuaire V5 propre chargé"
  );

})();

