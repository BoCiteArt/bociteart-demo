/* =========================================================
   BO'CITÉART — ANNUAIRE
   VERSION PROPRE ET PRÉPARÉE POUR LE BRANCHEMENT OFFICIEL

   PUBLIC
   • Annuaire territorial
   • Commune reprise du compte
   • Recherche nom / métier / produit / service
   • Catégories et métiers
   • Fiches réelles uniquement
   • Historique longue durée
   • Favoris
   • Consultés récemment
   • Appréciation 1 à 5
   • Candidatures spontanées

   PROFESSIONNEL PRIVÉ
   • Sécurité centrale Bo'CitéArt
   • Droits responsable / collaborateurs
   • Contrôle abonnement
   • Recherche fournisseur / partenaire / sous-traitant
   • Commune / proximité / département / région
   • France entière
   • Europe par pays
   • Historique professionnel
   • Carnet professionnel
   • Entreprises suivies
   • Informations entreprises / Bercy

   ARCHITECTURE OFFICIELLE
   • Annuaire.Agent.search()
   • Annuaire.Agent.enrichEntity()
   • Annuaire.UpdateAgent
   • Fournisseur officiel interchangeable
   • Territoires pilotés côté serveur
   • Aucun chargement massif
   • Aucune donnée inventée
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

  const Annuaire =
    module.Annuaire =
    module.Annuaire || {};

  const VERSION =
    "6.0.0";

  /* =======================================================
     1. STOCKAGE
     ======================================================= */

  const STORAGE = {

    schema:
      "bociteart_annuaire_schema_v6",

    entities:
      "bociteart_annuaire_entities_v6",

    communeCache:
      "bociteart_annuaire_commune_cache_v6",

    searchHistory:
      "bociteart_annuaire_search_history_v6",

    viewedHistory:
      "bociteart_annuaire_viewed_history_v6",

    favorites:
      "bociteart_annuaire_favorites_v6",

    ratings:
      "bociteart_annuaire_ratings_v6",

    citizenActions:
      "bociteart_annuaire_citizen_actions_v6",

    professionalHistory:
      "bociteart_annuaire_professional_history_v6",

    professionalNotebook:
      "bociteart_annuaire_professional_notebook_v6",

    professionalFollowed:
      "bociteart_annuaire_professional_followed_v6",

    reports:
      "bociteart_annuaire_reports_v6",

    updateState:
      "bociteart_annuaire_update_state_v6",

    providerCache:
      "bociteart_annuaire_provider_cache_v6"

  };

  Annuaire.STORAGE =
    STORAGE;

  /* =======================================================
     2. ÉTAT UNIQUE
     ======================================================= */

  const State = {

    current:null,

    stack:[],

    requestId:0,

    abortController:null,

    professionalContext:null

  };

  /* =======================================================
     3. OUTILS
     ======================================================= */

  function getElement(id){

    return document.getElementById(id);
  }

  function safeArray(value){

    return Array.isArray(value)
      ? value
      : [];
  }

  function loadJson(
    key,
    fallback
  ){

    try{

      const raw =
        localStorage.getItem(key);

      return raw
        ? JSON.parse(raw)
        : fallback;

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
        JSON.stringify(value)
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

  function uniqueId(prefix){

    return String(prefix || "item") +
      "_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2,10);
  }

  function normalizeText(value){

    return String(value || "")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
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

  function escapeHtml(value){

    return String(value || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function formatDateTime(value){

    if(!value){
      return "";
    }

    try{

      return new Date(value)
        .toLocaleString(
          "fr-FR",
          {
            day:"2-digit",
            month:"2-digit",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit"
          }
        );

    }catch(error){

      return "";
    }
  }

  function normalizeUrl(value){

    const text =
      String(value || "")
        .trim();

    if(!text){
      return "";
    }

    if(
      /^https?:\/\//i.test(text)
    ){
      return text;
    }

    return "https://" + text;
  }

  /* =======================================================
     4. COMMUNE DU COMPTE
     ======================================================= */

  function getCurrentCommune(){

    const possibleKeys = [

      "bociteart_account_demo_v1",

      "bociteart_activation_v1",

      "bociteart_registration_v1"

    ];

    for(
      let i = 0;
      i < possibleKeys.length;
      i++
    ){

      const data =
        loadJson(
          possibleKeys[i],
          null
        );

      if(!data){
        continue;
      }

      const commune =
        data.commune ||
        data.city ||
        data.ville ||
        data.municipality ||
        "";

      if(
        String(commune)
          .trim()
      ){

        return String(commune)
          .trim();
      }
    }

    try{

      if(
        window.BoCiteArtRegistration &&
        typeof window.BoCiteArtRegistration
          .getCurrentAccount === "function"
      ){

        const account =
          window.BoCiteArtRegistration
            .getCurrentAccount();

        const commune =
          account &&
          (
            account.commune ||
            account.city ||
            account.ville
          );

        if(commune){

          return String(commune)
            .trim();
        }
      }

    }catch(error){

      /* pas de blocage */
    }

    return "Wattignies";
  }

  /* =======================================================
     5. LOGO
     UNE SEULE CHAÎNE VISUELLE
     ======================================================= */

  function getLogoHtml(){

    return (
      "<strong " +
      "class=\"bociteAnnuaireLogo\">" +
      "Bo'Cité" +
      "<span>Art</span>" +
      "</strong>"
    );
  }

  /* =======================================================
     7. CATÉGORIES PUBLIQUES
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
      title:"Tous les métiers",
      subtitle:
        "Rechercher par activité"
    }

  ];

  /* =======================================================
     8. FAMILLES DE MÉTIERS
     ======================================================= */

  const TRADE_FAMILIES = [

    {
      id:"sante",
      title:"Santé",
      trades:[
        "Médecins généralistes",
        "Infirmiers",
        "Kinésithérapeutes",
        "Dentistes",
        "Pharmacies",
        "Pédicures-podologues",
        "Orthophonistes",
        "Sages-femmes",
        "Psychologues"
      ]
    },

    {
      id:"maison",
      title:"Maison & travaux",
      trades:[
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
      ]
    },

    {
      id:"automobile",
      title:"Automobile & mobilité",
      trades:[
        "Garages automobiles",
        "Carrossiers",
        "Pneumatiques",
        "Contrôle technique",
        "Motos",
        "Cycles"
      ]
    },

    {
      id:"alimentation",
      title:"Restaurants & alimentation",
      trades:[
        "Restaurants",
        "Boulangeries",
        "Boucheries",
        "Traiteurs",
        "Cafés",
        "Épiceries",
        "Commerces alimentaires"
      ]
    },

    {
      id:"professionnels",
      title:"Services aux entreprises",
      trades:[
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
      ]
    },

    {
      id:"hebergements",
      title:"Hôtels & séjours",
      trades:[
        "Hôtels",
        "Chambres d'hôtes",
        "Gîtes",
        "Locations de courte durée",
        "Autres hébergements"
      ]
    }

  ];

  /* =======================================================
     9. RÈGLES STRICTES DE VALIDATION MÉTIER
     ======================================================= */

  const TRADE_RULES = {

    "medecins generalistes":[
      {key:"amenity",values:["doctors"]},
      {key:"healthcare",values:["doctor"]}
    ],

    "infirmiers":[
      {key:"healthcare",values:["nurse"]}
    ],

    "kinesitherapeutes":[
      {key:"healthcare",values:["physiotherapist"]}
    ],

    "dentistes":[
      {key:"amenity",values:["dentist"]},
      {key:"healthcare",values:["dentist"]}
    ],

    "pharmacies":[
      {key:"amenity",values:["pharmacy"]}
    ],

    "pedicures-podologues":[
      {key:"healthcare",values:["podiatrist"]}
    ],

    "orthophonistes":[
      {key:"healthcare",values:["speech_therapist"]}
    ],

    "sages-femmes":[
      {key:"healthcare",values:["midwife"]}
    ],

    "psychologues":[
      {key:"healthcare",values:["psychotherapist","psychologist"]}
    ],

    "couvreurs":[
      {key:"craft",values:["roofer"]}
    ],

    "plombiers":[
      {key:"craft",values:["plumber"]}
    ],

    "electriciens":[
      {key:"craft",values:["electrician"]}
    ],

    "chauffagistes":[
      {key:"craft",values:["hvac","heating_engineer"]}
    ],

    "menuisiers":[
      {key:"craft",values:["carpenter","joiner"]}
    ],

    "macons":[
      {key:"craft",values:["bricklayer","mason"]}
    ],

    "peintres":[
      {key:"craft",values:["painter"]}
    ],

    "carreleurs":[
      {key:"craft",values:["tiler"]}
    ],

    "paysagistes":[
      {key:"craft",values:["landscaper","gardener"]}
    ],

    "serruriers":[
      {key:"craft",values:["locksmith"]}
    ],

    "garages automobiles":[
      {key:"shop",values:["car_repair"]},
      {key:"craft",values:["car_repair"]}
    ],

    "carrossiers":[
      {key:"craft",values:["car_repair","body_repair"]}
    ],

    "pneumatiques":[
      {key:"shop",values:["tyres"]}
    ],

    "controle technique":[
      {key:"amenity",values:["vehicle_inspection"]}
    ],

    "motos":[
      {key:"shop",values:["motorcycle","motorcycle_repair"]}
    ],

    "cycles":[
      {key:"shop",values:["bicycle","bicycle_repair"]}
    ],

    "restaurants":[
      {key:"amenity",values:["restaurant"]}
    ],

    "boulangeries":[
      {key:"shop",values:["bakery"]}
    ],

    "boucheries":[
      {key:"shop",values:["butcher"]}
    ],

    "traiteurs":[
      {key:"shop",values:["caterer"]},
      {key:"craft",values:["caterer"]}
    ],

    "cafes":[
      {key:"amenity",values:["cafe"]}
    ],

    "epiceries":[
      {key:"shop",values:["convenience","grocery","supermarket"]}
    ],

    "hotels":[
      {key:"tourism",values:["hotel"]}
    ],

    "chambres d hotes":[
      {key:"tourism",values:["guest_house"]}
    ],

    "gites":[
      {key:"tourism",values:["chalet","apartment","guest_house"]}
    ],

    "locations de courte duree":[
      {key:"tourism",values:["apartment"]}
    ]

  };

  /* =======================================================
     10. CONFIGURATION PROFESSIONNELLE
     ======================================================= */

  const PROFESSIONAL_ZONES = [

    {
      id:"commune",
      label:"Ma commune",
      subscriptionRequired:false
    },

    {
      id:"proche",
      label:"Communes proches",
      subscriptionRequired:false
    },

    {
      id:"departement",
      label:"Département",
      subscriptionRequired:true
    },

    {
      id:"region",
      label:"Région",
      subscriptionRequired:true
    },

    {
      id:"france",
      label:"France entière",
      subscriptionRequired:true
    },

    {
      id:"europe",
      label:"Europe — choisir un pays",
      subscriptionRequired:true
    }

  ];

  /* =======================================================
     12. FOURNISSEUR OFFICIEL / AGENT IA
     ======================================================= */

  Annuaire.Agent =
    Annuaire.Agent || {};

  Annuaire.UpdateAgent =
    Annuaire.UpdateAgent || {};

  /*
   * CONTRAT DU FUTUR FOURNISSEUR OFFICIEL :
   *
   * window.BociteAnnuaireDataProvider = {
   *
   *   search(request, options),
   *
   *   enrichEntity(entity, options),
   *
   *   refreshTerritory(territory, options),
   *
   *   getAuthorizedTerritories(options)
   *
   * };
   *
   * Les écrans de l'annuaire ne devront jamais
   * être réécrits lorsque le serveur sera branché.
   */

  function getOfficialProvider(){

    const provider =
      window.BociteAnnuaireDataProvider;

    if(
      provider &&
      typeof provider === "object"
    ){

      return provider;
    }

    return null;
  }

  Annuaire.Agent.isOfficialProviderReady =
    function(){

      const provider =
        getOfficialProvider();

      return !!(
        provider &&
        typeof provider.search ===
        "function"
      );
    };

  Annuaire.Agent.enrichEntity =
    async function(entity){

      const provider =
        getOfficialProvider();

      if(
        provider &&
        typeof provider.enrichEntity ===
        "function"
      ){

        return await Promise.resolve(
          provider.enrichEntity(
            entity,
            {
              professional:
                canAccessProfessionalDirectory()
            }
          )
        );
      }

      return entity;
    };

  /*
   * UpdateAgent ne lance PAS de balayage national
   * depuis le navigateur.
   *
   * En production, le serveur fournira uniquement
   * les territoires autorisés par les contrats.
   */

  Annuaire.UpdateAgent.getAuthorizedTerritories =
    async function(){

      const provider =
        getOfficialProvider();

      if(
        provider &&
        typeof provider
          .getAuthorizedTerritories ===
          "function"
      ){

        const result =
          await Promise.resolve(
            provider
              .getAuthorizedTerritories()
          );

        return safeArray(result);
      }

      return [
        {
          type:"commune",
          name:getCurrentCommune(),
          demo:true
        }
      ];
    };

  Annuaire.UpdateAgent.refreshTerritory =
    async function(territory){

      const provider =
        getOfficialProvider();

      if(
        !provider ||
        typeof provider.refreshTerritory !==
        "function"
      ){

        return {
          ready:false,
          reason:"official_provider_not_connected"
        };
      }

      return await Promise.resolve(
        provider.refreshTerritory(
          territory,
          {
            requestedAt:Date.now()
          }
        )
      );
    };

  Annuaire.UpdateAgent.run =
    async function(){

      const territories =
        await Annuaire.UpdateAgent
          .getAuthorizedTerritories();

      const results = [];

      for(
        let i = 0;
        i < territories.length;
        i++
      ){

        const territory =
          territories[i];

        if(territory.demo){
          continue;
        }

        try{

          const result =
            await Annuaire.UpdateAgent
              .refreshTerritory(
                territory
              );

          results.push({
            territory:territory,
            success:true,
            result:result
          });

        }catch(error){

          results.push({
            territory:territory,
            success:false,
            error:String(
              error &&
              error.message ||
              error
            )
          });
        }
      }

      saveJson(
        STORAGE.updateState,
        {
          lastRun:Date.now(),
          results:results
        }
      );

      return results;
    };

  /* =======================================================
     13. STYLE UNIQUE
     PAS DE PATCH CSS EN FIN DE FICHIER
     ======================================================= */

  function injectStyles(){

    if(
      document.getElementById(
        "bociteAnnuaireV6Styles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteAnnuaireV6Styles";

    style.textContent = `

      .bociteAnnuaireTitle{
        color:#2f5d46;
        font-size:16px;
        line-height:1.25;
        font-weight:800;
      }

      .bociteAnnuaireText{
        color:#111;
        font-size:14px;
        line-height:1.35;
        font-weight:400;
      }

      .bociteAnnuaireSmall{
        color:#555;
        font-size:12px;
        line-height:1.3;
        font-weight:400;
      }

      .bociteAnnuaireLogo{
        display:inline;
        color:#2f5d46;
        font-weight:900;
        font-size:inherit;
        line-height:inherit;
        white-space:nowrap;
        word-spacing:0;
        letter-spacing:normal;
      }

      .bociteAnnuaireLogo > span{
        display:inline;
        color:#b00020;
        margin:0;
        padding:0;
        position:static;
        left:auto;
        word-spacing:0;
        letter-spacing:normal;
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

      .bociteAnnuaireWhiteButton,
      .bociteAnnuaireCategoryButton,
      .bociteAnnuaireTradeButton,
      .bociteAnnuaireActionButton{

        background:#ffffff !important;
        background-color:#ffffff !important;
        color:#111111 !important;
      }

      .bociteAnnuaireBackButton{

        background:#f3e7d3 !important;
        background-color:#f3e7d3 !important;
        color:#111111 !important;
      }

      .bociteAnnuaireInput,
      .bociteAnnuaireSelect,
      .bociteAnnuaireTextarea{

        width:100%;
        box-sizing:border-box;
        background:#ffffff;
        color:#111111;
        font-size:14px;
      }

      .bociteAnnuaireInput,
      .bociteAnnuaireSelect{

        min-height:44px;
      }

      .bociteAnnuaireTextarea{

        min-height:88px;
        resize:vertical;
      }

      @media(max-width:420px){

        .bociteAnnuaireGrid,
        .bociteAnnuaireActions{

          grid-template-columns:
            repeat(2,minmax(0,1fr));
        }
      }

    `;

    document.head
      .appendChild(style);
  }

  injectStyles();

   /* =======================================================
     14. ENTITÉS / FICHES
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

    saveJson(
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
        entity.siret || "",
        entity.siren || "",
        entity.name || "",
        entity.address || "",
        entity.postalCode || "",
        entity.commune || "",
        entity.countryCode || ""
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
        String(
          raw.source || ""
        ).trim(),

      sourceType:
        String(
          raw.sourceType || ""
        ).trim(),

      sourceUrl:
        String(
          raw.sourceUrl || ""
        ).trim(),

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
          raw.town ||
          raw.village ||
          ""
        ).trim(),

      department:
        String(
          raw.department || ""
        ).trim(),

      region:
        String(
          raw.region || ""
        ).trim(),

      country:
        String(
          raw.country || ""
        ).trim(),

      countryCode:
        String(
          raw.countryCode ||
          raw.country_code ||
          ""
        )
        .trim()
        .toUpperCase(),

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

      openingHours:
        String(
          raw.openingHours ||
          raw.opening_hours ||
          ""
        ).trim(),

      openNow:
        typeof raw.openNow ===
        "boolean"
          ? raw.openNow
          : null,

      services:
        safeArray(
          raw.services
        ),

      keywords:
        safeArray(
          raw.keywords
        ),

      tags:
        raw.tags &&
        typeof raw.tags ===
        "object"
          ? raw.tags
          : {},

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
        raw.professionalData &&
        typeof raw.professionalData ===
        "object"
          ? raw.professionalData
          : null,

      verificationStatus:
        String(
          raw.verificationStatus ||
          "confirmed"
        ).trim(),

      verifiedAt:
        Number(
          raw.verifiedAt || 0
        ),

      lastCheckedAt:
        Number(
          raw.lastCheckedAt ||
          raw.verifiedAt ||
          0
        ),

      cachedAt:
        Date.now()

    };

    entity.id =
      buildStableEntityId(
        entity
      );

    return entity;
  }

  function mergeValidatedEntities(
    newEntities
  ){

    const existing =
      loadEntities();

    const map =
      new Map();

    existing.forEach(
      function(entity){

        map.set(
          String(entity.id),
          entity
        );
      }
    );

    safeArray(newEntities)
      .forEach(function(entity){

        if(
          !entity ||
          !entity.id
        ){
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
     15. HISTORIQUES / FAVORIS / ACTIONS
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
    context
  ){

    const clean =
      String(
        query || ""
      ).trim();

    if(!clean){
      return null;
    }

    const history =
      loadSearchHistory();

    const item = {

      id:
        uniqueId(
          "search"
        ),

      type:
        "search",

      query:
        clean,

      commune:
        context.commune ||
        getCurrentCommune(),

      category:
        context.category || "",

      trade:
        context.trade || "",

      zone:
        context.zone || "commune",

      countryCode:
        context.countryCode || "",

      country:
        context.country || "",

      professional:
        context.professional === true,

      createdAt:
        Date.now()

    };

    history.unshift(
      item
    );

    saveSearchHistory(
      history
    );

    return item;
  }

  function deleteSearchHistoryItem(id){

    saveSearchHistory(
      loadSearchHistory()
        .filter(function(item){

          return (
            String(item.id) !==
            String(id)
          );
        })
    );
  }

  function clearSearchHistory(){

    saveSearchHistory(
      []
    );
  }

  function loadViewedHistory(){

    return safeArray(
      loadJson(
        STORAGE.viewedHistory,
        []
      )
    );
  }

  function addViewedEntity(entity){

    let history =
      loadViewedHistory();

    history =
      history.filter(
        function(item){

          return (
            String(item.entityId) !==
            String(entity.id)
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

      activity:
        entity.activity ||
        entity.trade ||
        "",

      commune:
        entity.commune,

      country:
        entity.country,

      viewedAt:
        Date.now()

    });

    saveJson(
      STORAGE.viewedHistory,
      history
    );
  }

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

        country:
          entity.country,

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

  function loadCitizenActions(){

    return safeArray(
      loadJson(
        STORAGE.citizenActions,
        []
      )
    );
  }

  function saveCitizenActions(actions){

    saveJson(
      STORAGE.citizenActions,
      safeArray(actions)
    );
  }

  function addCitizenAction(
    type,
    entity,
    details
  ){

    details =
      details || {};

    const actions =
      loadCitizenActions();

    const item = {

      id:
        uniqueId(
          "action"
        ),

      type:
        type,

      entityId:
        entity &&
        entity.id
          ? entity.id
          : "",

      companyName:
        entity &&
        entity.name
          ? entity.name
          : "",

      commune:
        entity &&
        entity.commune
          ? entity.commune
          : getCurrentCommune(),

      country:
        entity &&
        entity.country
          ? entity.country
          : "",

      trade:
        details.trade || "",

      employmentType:
        details.employmentType || "",

      status:
        details.status || "created",

      createdAt:
        Date.now(),

      updatedAt:
        Date.now()

    };

    actions.unshift(
      item
    );

    saveCitizenActions(
      actions
    );

    return item;
  }

  /* =======================================================
     16. APPRÉCIATIONS 1 À 5
     ======================================================= */

  function loadRatings(){

    return safeArray(
      loadJson(
        STORAGE.ratings,
        []
      )
    );
  }

  function getRatingSummary(
    entityId
  ){

    const rows =
      loadRatings()
        .filter(
          function(item){

            return (
              String(item.entityId) ===
              String(entityId)
            );
          }
        );

    if(!rows.length){

      return {
        count:0,
        average:0
      };
    }

    const total =
      rows.reduce(
        function(sum,item){

          return (
            sum +
            Number(
              item.value || 0
            )
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

    const rows =
      loadRatings();

    rows.push({

      id:
        uniqueId(
          "rating"
        ),

      entityId:
        entityId,

      value:
        numeric,

      createdAt:
        Date.now()

    });

    saveJson(
      STORAGE.ratings,
      rows
    );

    return true;
  }

  /* =======================================================
     17. SIGNALEMENTS
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
        uniqueId(
          "report"
        ),

      entityId:
        entity.id,

      entityName:
        entity.name,

      type:
        type,

      createdAt:
        Date.now(),

      status:
        "to_verify"

    });

    saveJson(
      STORAGE.reports,
      reports
    );
  }

  /* =======================================================
     18. HORAIRES / OUVERT-FERMÉ
     ======================================================= */

  const DAY_CODES = [
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa"
  ];

  function timeToMinutes(value){

    const match =
      String(value || "")
        .match(
          /^(\d{1,2}):(\d{2})$/
        );

    if(!match){
      return null;
    }

    const hour =
      Number(
        match[1]
      );

    const minute =
      Number(
        match[2]
      );

    if(
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ){
      return null;
    }

    return (
      hour * 60 +
      minute
    );
  }

  function dayCodeToIndex(code){

    return DAY_CODES.indexOf(
      String(code || "")
    );
  }

  function parseDayExpression(value){

    const result = [];

    String(value || "")
      .split(",")
      .map(
        function(item){

          return item.trim();
        }
      )
      .filter(Boolean)
      .forEach(
        function(item){

          if(
            item.includes("-")
          ){

            const parts =
              item.split("-");

            const start =
              dayCodeToIndex(
                parts[0]
              );

            const end =
              dayCodeToIndex(
                parts[1]
              );

            if(
              start < 0 ||
              end < 0
            ){
              return;
            }

            if(start <= end){

              for(
                let i = start;
                i <= end;
                i++
              ){
                result.push(i);
              }

            }else{

              for(
                let i = start;
                i <= 6;
                i++
              ){
                result.push(i);
              }

              for(
                let i = 0;
                i <= end;
                i++
              ){
                result.push(i);
              }
            }

            return;
          }

          const index =
            dayCodeToIndex(
              item
            );

          if(index >= 0){

            result.push(
              index
            );
          }
        }
      );

    return Array.from(
      new Set(result)
    );
  }

  function parseSimpleOpeningHours(
    openingHours
  ){

    const value =
      String(
        openingHours || ""
      ).trim();

    if(!value){

      return {
        known:false,
        open:null,
        label:""
      };
    }

    if(value === "24/7"){

      return {
        known:true,
        open:true,
        label:"Ouvert actuellement"
      };
    }

    const now =
      new Date();

    const currentDay =
      now.getDay();

    const currentMinutes =
      (
        now.getHours() *
        60
      ) +
      now.getMinutes();

    const segments =
      value
        .split(";")
        .map(
          function(item){

            return item.trim();
          }
        )
        .filter(Boolean);

    let understoodToday =
      false;

    let validPeriodToday =
      false;

    for(
      let i = 0;
      i < segments.length;
      i++
    ){

      const match =
        segments[i]
          .match(
            /^([A-Za-z,\-]+)\s+(.+)$/
          );

      if(!match){
        continue;
      }

      const days =
        parseDayExpression(
          match[1]
        );

      if(
        !days.includes(
          currentDay
        )
      ){
        continue;
      }

      understoodToday =
        true;

      const timePart =
        String(
          match[2] || ""
        ).trim();

      if(
        normalizeText(
          timePart
        ) === "off"
      ){

        return {
          known:true,
          open:false,
          label:"Fermé actuellement"
        };
      }

      const periods =
        timePart
          .split(",")
          .map(
            function(period){

              return period.trim();
            }
          );

      for(
        let p = 0;
        p < periods.length;
        p++
      ){

        const times =
          periods[p]
            .split("-");

        if(
          times.length !== 2
        ){
          continue;
        }

        const start =
          timeToMinutes(
            times[0]
          );

        const end =
          timeToMinutes(
            times[1]
          );

        if(
          start === null ||
          end === null
        ){
          continue;
        }

        validPeriodToday =
          true;

        if(
          currentMinutes >= start &&
          currentMinutes <= end
        ){

          return {
            known:true,
            open:true,
            label:"Ouvert actuellement"
          };
        }
      }
    }

    if(
      understoodToday &&
      validPeriodToday
    ){

      return {
        known:true,
        open:false,
        label:"Fermé actuellement"
      };
    }

    return {
      known:false,
      open:null,
      label:""
    };
  }

  function getEntityOpenStatus(
    entity
  ){

    if(!entity){

      return {
        known:false,
        open:null,
        label:""
      };
    }

    if(
      entity.openNow === true
    ){

      return {
        known:true,
        open:true,
        label:"Ouvert actuellement"
      };
    }

    if(
      entity.openNow === false
    ){

      return {
        known:true,
        open:false,
        label:"Fermé actuellement"
      };
    }

    if(entity.openingHours){

      return parseSimpleOpeningHours(
        entity.openingHours
      );
    }

    return {
      known:false,
      open:null,
      label:""
    };
  }

  function getHoursInformationHtml(
    entity
  ){

    const status =
      getEntityOpenStatus(
        entity
      );

    let html = "";

    if(
      status.known === true
    ){

      html += `
        <div
          class="bociteAnnuaireText"
          style="
            margin-top:7px;
            font-weight:700;
            color:${
              status.open
                ? "#2f5d46"
                : "#555"
            };
          ">
          ${escapeHtml(
            status.label
          )}
        </div>
      `;
    }

    if(entity.openingHours){

      html += `
        <div
          class="bociteAnnuaireSmall"
          style="margin-top:5px;">
          Horaires :
          ${escapeHtml(
            entity.openingHours
          )}
        </div>
      `;
    }

    return html;
  }

  /* =======================================================
     19. VALIDATION STRICTE DES MÉTIERS
     ======================================================= */

  function getTradeRules(
    trade
  ){

    return safeArray(
      TRADE_RULES[
        normalizeText(
          trade
        )
      ]
    );
  }

  function tagsMatchTrade(
    tags,
    trade
  ){

    const rules =
      getTradeRules(
        trade
      );

    if(!rules.length){

      return true;
    }

    return rules.some(
      function(rule){

        const current =
          normalizeText(
            tags[
              rule.key
            ]
          );

        if(!current){
          return false;
        }

        return safeArray(
          rule.values
        )
        .some(
          function(value){

            return (
              current ===
              normalizeText(
                value
              )
            );
          }
        );
      }
    );
  }

  function entityMatchesText(
    entity,
    query
  ){

    const needle =
      normalizeText(
        query
      );

    if(!needle){
      return true;
    }

    const haystack =
      normalizeText(
        [
          entity.name,
          entity.activity,
          entity.trade,
          entity.category,
          entity.subcategory,
          entity.description,
          safeArray(
            entity.services
          ).join(" "),
          safeArray(
            entity.keywords
          ).join(" ")
        ].join(" ")
      );

    return haystack.includes(
      needle
    );
  }

  function isUsableEntity(entity){

    if(
      !entity ||
      !entity.name
    ){
      return false;
    }

    if(
      !entity.activity &&
      !entity.trade &&
      !entity.category
    ){
      return false;
    }

    return true;
  }

  function deduplicateEntities(
    entities
  ){

    const map =
      new Map();

    safeArray(entities)
      .forEach(
        function(entity){

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
                entity.commune,
                entity.countryCode
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

          const merged = {
            ...existing,
            ...entity
          };

          map.set(
            key,
            merged
          );
        }
      );

    return Array.from(
      map.values()
    );
  }

  function validateResults(
    rows,
    request
  ){

    const commune =
      normalizeText(
        request.commune || ""
      );

    const countryCode =
      String(
        request.countryCode || ""
      )
      .trim()
      .toUpperCase();

    return deduplicateEntities(

      safeArray(rows)
        .map(
          normalizeEntity
        )
        .filter(
          isUsableEntity
        )
        .filter(
          function(entity){

            if(
              request.trade &&
              !tagsMatchTrade(
                entity.tags,
                request.trade
              )
            ){
              return false;
            }

            if(
              request.query &&
              !request.trade &&
              !entityMatchesText(
                entity,
                request.query
              )
            ){
              return false;
            }

            if(
              request.zone ===
              "commune" &&
              commune &&
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

            if(
              request.zone ===
              "europe" &&
              countryCode &&
              entity.countryCode
            ){

              if(
                entity.countryCode !==
                countryCode
              ){
                return false;
              }
            }

            return true;
          }
        )
    );
  }

  /* =======================================================
     20. RECHERCHE DANS LE CACHE
     ======================================================= */

  function searchCachedEntities(
    request
  ){

    const commune =
      normalizeText(
        request.commune ||
        ""
      );

    const countryCode =
      String(
        request.countryCode ||
        ""
      )
      .trim()
      .toUpperCase();

    return loadEntities()
      .filter(
        function(entity){

          if(
            request.zone ===
            "commune" &&
            commune
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
            request.zone ===
            "europe" &&
            countryCode
          ){

            if(
              String(
                entity.countryCode ||
                ""
              ).toUpperCase() !==
              countryCode
            ){
              return false;
            }
          }

          if(
            request.trade &&
            !tagsMatchTrade(
              entity.tags,
              request.trade
            )
          ){

            return false;
          }

          return entityMatchesText(
            entity,
            request.query ||
            request.trade ||
            ""
          );
        }
      );
  }

  /* =======================================================
     21. OPENSTREETMAP / OVERPASS — DÉMO LOCALE
     ======================================================= */

  const OVERPASS_SERVERS = [

    "https://overpass-api.de/api/interpreter",

    "https://overpass.kumi.systems/api/interpreter"

  ];

  function buildOverpassSelectors(
    trade
  ){

    const rules =
      getTradeRules(
        trade
      );

    if(!rules.length){
      return "";
    }

    return rules
      .map(
        function(rule){

          return safeArray(
            rule.values
          )
          .map(
            function(value){

              return (
                'nwr["' +
                rule.key +
                '"="' +
                value +
                '"](area.searchArea);'
              );
            }
          )
          .join("\n");
        }
      )
      .join("\n");
  }

  function buildLocalOverpassQuery(
    request
  ){

    const selectors =
      buildOverpassSelectors(
        request.trade ||
        request.query
      );

    if(!selectors){
      return "";
    }

    const commune =
      String(
        request.commune ||
        getCurrentCommune()
      )
      .replace(
        /"/g,
        '\\"'
      );

    return `
      [out:json][timeout:25];

      area
        ["boundary"="administrative"]
        ["name"="${commune}"]
        ->.searchArea;

      (
        ${selectors}
      );

      out center tags;
    `;
  }

  function getOsmAddress(tags){

    return [
      tags[
        "addr:housenumber"
      ],
      tags[
        "addr:street"
      ]
    ]
    .filter(Boolean)
    .join(" ")
    .trim();
  }

  function osmElementToEntity(
    element,
    request
  ){

    const tags =
      element.tags || {};

    const lat =
      element.lat !== undefined
        ? Number(
            element.lat
          )
        : (
            element.center &&
            element.center.lat !==
            undefined
              ? Number(
                  element.center.lat
                )
              : null
          );

    const lng =
      element.lon !== undefined
        ? Number(
            element.lon
          )
        : (
            element.center &&
            element.center.lon !==
            undefined
              ? Number(
                  element.center.lon
                )
              : null
          );

    const activity =
      tags.craft ||
      tags.shop ||
      tags.healthcare ||
      tags.amenity ||
      tags.tourism ||
      tags.office ||
      request.trade ||
      request.query ||
      "";

    return normalizeEntity({

      externalId:
        "osm_" +
        String(
          element.type || ""
        ) +
        "_" +
        String(
          element.id || ""
        ),

      source:
        "OpenStreetMap",

      sourceType:
        "public_network",

      name:
        tags.name ||
        tags.brand ||
        tags.operator ||
        "",

      activity:
        activity,

      trade:
        request.trade || "",

      category:
        request.category || "",

      address:
        getOsmAddress(
          tags
        ),

      postalCode:
        tags[
          "addr:postcode"
        ] || "",

      commune:
        tags[
          "addr:city"
        ] ||
        request.commune ||
        "",

      country:
        tags[
          "addr:country"
        ] || "",

      countryCode:
        tags[
          "addr:country"
        ] || "",

      phone:
        tags.phone ||
        tags[
          "contact:phone"
        ] ||
        "",

      email:
        tags.email ||
        tags[
          "contact:email"
        ] ||
        "",

      website:
        tags.website ||
        tags[
          "contact:website"
        ] ||
        "",

      openingHours:
        tags.opening_hours ||
        "",

      lat:
        lat,

      lng:
        lng,

      tags:
        tags,

      keywords:
        [
          tags.craft,
          tags.shop,
          tags.healthcare,
          tags.amenity,
          tags.tourism,
          tags.office
        ]
        .filter(Boolean),

      verificationStatus:
        "confirmed",

      verifiedAt:
        Date.now(),

      lastCheckedAt:
        Date.now()

    });
  }

  async function searchOverpassLocal(
    request,
    signal
  ){

    const query =
      buildLocalOverpassQuery(
        request
      );

    if(!query){
      return [];
    }

    let lastError =
      null;

    for(
      let i = 0;
      i < OVERPASS_SERVERS.length;
      i++
    ){

      try{

        const response =
          await fetch(
            OVERPASS_SERVERS[i],
            {
              method:"POST",

              headers:{
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8"
              },

              body:
                "data=" +
                encodeURIComponent(
                  query
                ),

              signal:
                signal
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
        .map(
          function(element){

            return osmElementToEntity(
              element,
              request
            );
          }
        );

      }catch(error){

        if(
          error &&
          error.name ===
          "AbortError"
        ){
          throw error;
        }

        lastError =
          error;
      }
    }

    if(lastError){
      throw lastError;
    }

    return [];
  }

  /* =======================================================
     22. FOURNISSEUR OFFICIEL
     FRANCE / EUROPE / RECHERCHE PRO
     ======================================================= */

  async function searchOfficialProvider(
    request,
    signal
  ){

    const provider =
      getOfficialProvider();

    if(
      !provider ||
      typeof provider.search !==
      "function"
    ){

      return null;
    }

    const result =
      await Promise.resolve(
        provider.search(
          request,
          {
            signal:
              signal
          }
        )
      );

    if(
      Array.isArray(result)
    ){
      return result;
    }

    if(
      result &&
      Array.isArray(
        result.rows
      )
    ){
      return result.rows;
    }

    return [];
  }

  /* =======================================================
     23. AGENT.SEARCH
     ======================================================= */

  Annuaire.Agent.search =
    async function(
      request,
      options
    ){

      request =
        request || {};

      options =
        options || {};

      const normalizedRequest = {

        query:
          String(
            request.query || ""
          ).trim(),

        trade:
          String(
            request.trade || ""
          ).trim(),

        category:
          String(
            request.category || ""
          ).trim(),

        commune:
          String(
            request.commune ||
            getCurrentCommune()
          ).trim(),

        zone:
          String(
            request.zone ||
            "commune"
          ).trim(),

        professional:
          request.professional ===
          true,

        countryCode:
          String(
            request.countryCode ||
            ""
          )
          .trim()
          .toUpperCase(),

        country:
          String(
            request.country || ""
          ).trim()

      };

      const cached =
        searchCachedEntities(
          normalizedRequest
        );

      let networkRows = [];

      /*
       * FOURNISSEUR OFFICIEL PRIORITAIRE :
       * France, Europe, et demain toutes les recherches.
       */
      if(
        Annuaire.Agent
          .isOfficialProviderReady()
      ){

        networkRows =
          await searchOfficialProvider(
            normalizedRequest,
            options.signal
          );

      }else{

        /*
         * SANS FOURNISSEUR OFFICIEL :
         * uniquement la recherche communale de démonstration.
         *
         * On ne prétend pas fournir une France/Europe
         * complète depuis le navigateur.
         */
        if(
          normalizedRequest.zone ===
          "commune"
        ){

          networkRows =
            await searchOverpassLocal(
              normalizedRequest,
              options.signal
            );

        }else{

          networkRows =
            [];
        }
      }

      const validated =
        validateResults(
          networkRows,
          normalizedRequest
        );

      if(validated.length){

        mergeValidatedEntities(
          validated
        );
      }

      return {

        request:
          normalizedRequest,

        rows:
          deduplicateEntities(
            cached.concat(
              validated
            )
          )
          .sort(
            function(a,b){

              return String(
                a.name || ""
              ).localeCompare(
                String(
                  b.name || ""
                ),
                "fr"
              );
            }
          ),

        officialProvider:
          Annuaire.Agent
            .isOfficialProviderReady(),

        source:
          validated.length
            ? "network_and_cache"
            : (
                cached.length
                  ? "cache"
                  : "none"
              )

      };
    };

  /* =======================================================
     24. RECHERCHE ASYNCHRONE ANNULABLE
     ======================================================= */

  function cancelCurrentSearch(){

    if(
      State.abortController
    ){

      try{

        State.abortController
          .abort();

      }catch(error){

        /* aucun blocage */
      }
    }

    State.abortController =
      null;
  }

  async function runSearch(
    request
  ){

    cancelCurrentSearch();

    const controller =
      new AbortController();

    State.abortController =
      controller;

    const requestId =
      ++State.requestId;

    addSearchHistory(
      request.query ||
      request.trade,
      request
    );

    navigate(
      "results",
      {
        request:
          request,

        loading:
          true,

        rows:
          [],

        requestId:
          requestId
      }
    );

    try{

      const result =
        await Annuaire.Agent
          .search(
            request,
            {
              signal:
                controller.signal
            }
          );

      if(
        requestId !==
        State.requestId
      ){
        return;
      }

      replaceView(
        "results",
        {
          request:
            request,

          loading:
            false,

          rows:
            safeArray(
              result.rows
            ),

          source:
            result.source,

          officialProvider:
            result.officialProvider,

          requestId:
            requestId
        }
      );

    }catch(error){

      if(
        error &&
        error.name ===
        "AbortError"
      ){
        return;
      }

      if(
        requestId !==
        State.requestId
      ){
        return;
      }

      replaceView(
        "results",
        {
          request:
            request,

          loading:
            false,

          rows:
            [],

          error:
            true,

          requestId:
            requestId
        }
      );
    }
  }

  /* =======================================================
     25. NAVIGATION UNIQUE
     ======================================================= */

  function cloneView(view){

    if(!view){
      return null;
    }

    return {
      type:
        view.type,

      data:
        view.data || {}
    };
  }

  function navigate(
    type,
    data,
    options
  ){

    options =
      options || {};

    if(
      State.current &&
      options.replace !==
      true
    ){

      State.stack.push(
        cloneView(
          State.current
        )
      );
    }

    State.current = {

      type:
        type,

      data:
        data || {}

    };

    renderCurrentView();
  }

  function replaceView(
    type,
    data
  ){

    State.current = {

      type:
        type,

      data:
        data || {}

    };

    renderCurrentView();
  }

  function goBack(){

    cancelCurrentSearch();

    if(
      State.stack.length
    ){

      State.current =
        State.stack.pop();

      renderCurrentView();

      return;
    }

    if(
      typeof module
        .returnToEntrepriseHome ===
      "function"
    ){

      module
        .returnToEntrepriseHome();

      return;
    }

    if(
      typeof module.goBack ===
      "function"
    ){

      module.goBack();

      return;
    }

    if(
      typeof module.openScreen ===
      "function"
    ){

      module.openScreen(
        "accueil"
      );
    }
  }

  function resetNavigation(){

    cancelCurrentSearch();

    State.stack =
      [];

    State.current = {

      type:
        "home",

      data:
        {}

    };

    renderCurrentView();
  }

  function getBackButtonHtml(
    label
  ){

    return `
      <button
        id="annuaireInternalBackBtn"
        class="
          choiceBtn
          bociteAnnuaireBackButton
        "
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">
        ← ${escapeHtml(
          label ||
          "Retour"
        )}
      </button>
    `;
  }

  function bindBackButton(){

    const button =
      getElement(
        "annuaireInternalBackBtn"
      );

    if(button){

      button.onclick =
        goBack;
    }
  }

  /* =======================================================
     26. MODALE UNIQUE
     ======================================================= */

  function renderModal(
    title,
    html,
    callback
  ){

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
          .forEach(
            function(element){

              element.scrollTop =
                0;
            }
          );

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

   /* =======================================================
     27. OUTILS DES MÉTIERS / CATÉGORIES
     ======================================================= */

  function getCategoryById(id){

    return CATEGORIES
      .find(
        function(category){

          return (
            category.id === id
          );
        }
      ) || null;
  }

  function getTradeFamilyById(id){

    return TRADE_FAMILIES
      .find(
        function(family){

          return (
            family.id === id
          );
        }
      ) || null;
  }

  function getTradesForCategory(
    categoryId
  ){

    const result = [];

    function addFamily(
      familyId,
      allowedTrades
    ){

      const family =
        getTradeFamilyById(
          familyId
        );

      if(!family){
        return;
      }

      safeArray(
        family.trades
      )
      .forEach(
        function(trade){

          if(
            Array.isArray(
              allowedTrades
            ) &&
            allowedTrades.length &&
            !allowedTrades.includes(
              trade
            )
          ){
            return;
          }

          if(
            !result.includes(
              trade
            )
          ){

            result.push(
              trade
            );
          }
        }
      );
    }

    if(
      categoryId ===
      "sante"
    ){

      addFamily(
        "sante"
      );
    }

    if(
      categoryId ===
      "artisans"
    ){

      addFamily(
        "maison"
      );
    }

    if(
      categoryId ===
      "restaurants"
    ){

      addFamily(
        "alimentation",
        [
          "Restaurants",
          "Traiteurs",
          "Cafés"
        ]
      );
    }

    if(
      categoryId ===
      "commerces"
    ){

      addFamily(
        "alimentation",
        [
          "Boulangeries",
          "Boucheries",
          "Épiceries",
          "Commerces alimentaires"
        ]
      );

      /*
       * Les recherches libres permettent ensuite
       * de trouver fleuristes, vêtements, opticiens,
       * coiffure, etc. sans fabriquer de faux métiers.
       */
    }

    if(
      categoryId ===
      "entreprises"
    ){

      addFamily(
        "professionnels"
      );
    }

    if(
      categoryId ===
      "hebergements"
    ){

      addFamily(
        "hebergements"
      );
    }

    if(
      categoryId ===
      "services"
    ){

      addFamily(
        "automobile"
      );

      addFamily(
        "professionnels"
      );
    }

    return result;
  }

  function getAllTrades(){

    const result = [];

    TRADE_FAMILIES
      .forEach(
        function(family){

          safeArray(
            family.trades
          )
          .forEach(
            function(trade){

              if(
                !result.includes(
                  trade
                )
              ){

                result.push(
                  trade
                );
              }
            }
          );
        }
      );

    return result;
  }

  /* =======================================================
     28. ACCUEIL PUBLIC
     ======================================================= */

  function renderHome(){

    const commune =
      getCurrentCommune();

    const categoriesHtml =
      CATEGORIES
        .map(
          function(category){

            return `
              <button
                type="button"
                class="
                  choiceBtn
                  bociteAnnuaireCategoryButton
                  annuaireCategoryBtn
                "
                data-category="${escapeHtml(
                  category.id
                )}"
                style="
                  width:100%;
                  min-height:62px;
                  margin:0;
                  text-align:left;
                ">

                <strong
                  style="
                    display:block;
                    color:#2f5d46;
                    font-size:16px;
                    font-weight:800;
                  ">
                  ${escapeHtml(
                    category.title
                  )}
                </strong>

                <span
                  style="
                    display:block;
                    margin-top:3px;
                    color:#111;
                    font-size:13px;
                    font-weight:400;
                  ">
                  ${escapeHtml(
                    category.subtitle
                  )}
                </span>

              </button>
            `;
          }
        )
        .join("");

    const recent =
      loadSearchHistory()
        .filter(
          function(item){

            return (
              item.professional !==
              true
            );
          }
        )
        .slice(
          0,
          5
        );

    const recentHtml =
      recent.length
        ? recent
            .map(
              function(item){

                return `
                  <div
                    class="box"
                    style="margin-top:7px;">

                    <div
                      class="bociteAnnuaireTitle">
                      ${escapeHtml(
                        item.query
                      )}
                    </div>

                    <div
                      class="bociteAnnuaireSmall"
                      style="margin-top:4px;">
                      ${escapeHtml(
                        item.commune || ""
                      )}
                      •
                      ${formatDateTime(
                        item.createdAt
                      )}
                    </div>

                    <button
                      type="button"
                      class="
                        choiceBtn
                        bociteAnnuaireWhiteButton
                        annuaireReplayHomeBtn
                      "
                      data-id="${escapeHtml(
                        item.id
                      )}"
                      style="
                        width:100%;
                        margin-top:7px;
                      ">
                      Reprendre cette recherche
                    </button>

                  </div>
                `;
              }
            )
            .join("")
        : `
            <div
              class="bociteAnnuaireSmall">
              Vos recherches apparaîtront ici.
            </div>
          `;

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteAnnuaireTitle">
          Annuaire de ${escapeHtml(
            commune
          )}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:5px;">
          Trouvez un commerce,
          une entreprise,
          un artisan,
          un professionnel,
          un produit ou un service.
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
          class="bociteAnnuaireInput"
          type="search"
          autocomplete="off"
          placeholder="Nom, métier, produit ou service"
          style="
            border:1px solid #bbb;
            border-radius:8px;
            padding:10px;
          "
        >

        <div
          class="bociteAnnuaireSmall"
          style="margin-top:5px;">
          Restaurant • couvreur • dentiste • garage • Dupont…
        </div>

        <button
          id="annuaireSearchBtn"
          class="
            choiceBtn
            bociteAnnuaireWhiteButton
          "
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
          class="
            choiceBtn
            bociteAnnuaireWhiteButton
          "
          type="button">
          Mon historique
        </button>

        <button
          id="annuaireFavoritesBtn"
          class="
            choiceBtn
            bociteAnnuaireWhiteButton
          "
          type="button">
          Mes favoris
        </button>

      </div>

      <button
        id="annuaireViewedBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Consultés récemment
      </button>

      <button
        id="annuaireCitizenActionsBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Mes démarches
      </button>

      <button
        id="annuaireProfessionalBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Espace professionnel privé
      </button>

      <div
        class="box"
        style="margin-top:10px;">

        <div
          class="bociteAnnuaireTitle">
          Recherches récentes
        </div>

        <div
          style="margin-top:7px;">
          ${recentHtml}
        </div>

      </div>

      <div
        class="box"
        style="margin-top:10px;">

        <div
          class="bociteAnnuaireText">
          ${getLogoHtml()} vous aide à retrouver
          les ressources réellement présentes
          sur votre territoire.
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

    const searchButton =
      getElement(
        "annuaireSearchBtn"
      );

    function launchPublicSearch(){

      const query =
        input
          ? String(
              input.value || ""
            ).trim()
          : "";

      if(!query){

        alert(
          "Indiquez un nom, un métier, un produit ou un service."
        );

        return;
      }

      runSearch({

        query:
          query,

        trade:
          "",

        category:
          "",

        commune:
          getCurrentCommune(),

        zone:
          "commune",

        professional:
          false,

        countryCode:
          "FR",

        country:
          "France"

      });
    }

    if(searchButton){

      searchButton.onclick =
        launchPublicSearch;
    }

    if(input){

      input.onkeydown =
        function(event){

          if(
            event.key ===
            "Enter"
          ){

            event.preventDefault();

            launchPublicSearch();
          }
        };
    }

    document
      .querySelectorAll(
        ".annuaireCategoryBtn"
      )
      .forEach(
        function(button){

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
        }
      );

    document
      .querySelectorAll(
        ".annuaireReplayHomeBtn"
      )
      .forEach(
        function(button){

          button.onclick =
            function(){

              replaySearchHistoryItem(
                button.getAttribute(
                  "data-id"
                )
              );
            };
        }
      );

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

    const actions =
      getElement(
        "annuaireCitizenActionsBtn"
      );

    if(actions){

      actions.onclick =
        function(){

          navigate(
            "citizen_actions",
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
     29. CATÉGORIE
     ======================================================= */

  function renderCategory(data){

    const categoryId =
      String(
        data.categoryId || ""
      );

    if(
      categoryId ===
      "metiers"
    ){

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
      getTradesForCategory(
        categoryId
      );

    let html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          ${escapeHtml(
            category.title
          )}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          ${escapeHtml(
            category.subtitle
          )}
        </div>

      </div>

    `;

    if(
      trades.length
    ){

      trades.forEach(
        function(trade){

          html += `

            <button
              type="button"
              class="
                choiceBtn
                bociteAnnuaireTradeButton
                annuaireTradeBtn
              "
              data-trade="${escapeHtml(
                trade
              )}"
              style="
                width:100%;
                margin-top:7px;
                text-align:left;
              ">
              ${escapeHtml(
                trade
              )}
            </button>

          `;
        }
      );

    }else{

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div
            class="bociteAnnuaireText">
            Utilisez la recherche par nom,
            métier, produit ou service.
          </div>

        </div>

      `;
    }

    html +=
      getBackButtonHtml(
        "Retour à l'annuaire"
      );

    renderModal(
      category.title,
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
            }
          );

        bindBackButton();
      }
    );
  }

  /* =======================================================
     30. TOUS LES MÉTIERS
     ======================================================= */

  function renderAllTrades(){

    let html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          Tous les métiers
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Choisissez une activité.
        </div>

      </div>

    `;

    TRADE_FAMILIES
      .forEach(
        function(family){

          html += `

            <div
              class="box"
              style="margin-top:9px;">

              <div
                class="bociteAnnuaireTitle">
                ${escapeHtml(
                  family.title
                )}
              </div>

          `;

          safeArray(
            family.trades
          )
          .forEach(
            function(trade){

              html += `

                <button
                  type="button"
                  class="
                    choiceBtn
                    bociteAnnuaireTradeButton
                    annuaireAllTradeBtn
                  "
                  data-trade="${escapeHtml(
                    trade
                  )}"
                  style="
                    width:100%;
                    margin-top:6px;
                    text-align:left;
                  ">
                  ${escapeHtml(
                    trade
                  )}
                </button>

              `;
            }
          );

          html += `
            </div>
          `;
        }
      );

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
          .forEach(
            function(button){

              button.onclick =
                function(){

                  navigate(
                    "trade",
                    {
                      trade:
                        button.getAttribute(
                          "data-trade"
                        ) || ""
                    }
                  );
                };
            }
          );

        bindBackButton();
      }
    );
  }

  /* =======================================================
     31. ÉCRAN MÉTIER
     CANDIDATURE SPONTANÉE INTÉGRÉE
     ======================================================= */

  function renderTrade(data){

    const trade =
      String(
        data.trade || ""
      ).trim();

    if(!trade){

      goBack();
      return;
    }

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteAnnuaireTitle">
          ${escapeHtml(
            trade
          )}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Retrouvez les professionnels
          correspondant réellement à ce métier
          dans ${escapeHtml(
            getCurrentCommune()
          )}.
        </div>

      </div>

      <button
        id="annuaireTradeSearchBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Voir les professionnels
      </button>

      <button
        id="annuaireTradeApplicationBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Déposer une candidature spontanée
      </button>

      <div
        class="box"
        style="margin-top:9px;">

        <div
          class="bociteAnnuaireSmall">
          La candidature sera adressée
          à l'entreprise que vous choisirez.
          Aucun envoi n'est réalisé
          sans destinataire identifié.
        </div>

      </div>

      ${getBackButtonHtml(
        "Retour"
      )}

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

              runSearch({

                query:
                  trade,

                trade:
                  trade,

                category:
                  data.categoryId ||
                  "",

                commune:
                  getCurrentCommune(),

                zone:
                  "commune",

                professional:
                  false,

                countryCode:
                  "FR",

                country:
                  "France"

              });
            };
        }

        const application =
          getElement(
            "annuaireTradeApplicationBtn"
          );

        if(application){

          application.onclick =
            function(){

              navigate(
                "trade_application",
                {
                  trade:
                    trade,

                  categoryId:
                    data.categoryId ||
                    ""
                }
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     32. CHOIX ENTREPRISE POUR CANDIDATURE MÉTIER
     ======================================================= */

  async function renderTradeApplication(
    data
  ){

    const trade =
      String(
        data.trade || ""
      ).trim();

    if(!trade){

      goBack();
      return;
    }

    const viewToken =
      ++State.requestId;

    renderModal(
      "Candidature spontanée",
      `

        <div
          class="box">

          <div
            class="bociteAnnuaireTitle">
            ${escapeHtml(
              trade
            )}
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Recherche des entreprises
            correspondant à ce métier…
          </div>

        </div>

        ${getBackButtonHtml(
          "Retour au métier"
        )}

      `,
      bindBackButton
    );

    try{

      cancelCurrentSearch();

      const controller =
        new AbortController();

      State.abortController =
        controller;

      const result =
        await Annuaire.Agent
          .search(
            {
              query:
                trade,

              trade:
                trade,

              category:
                data.categoryId ||
                "",

              commune:
                getCurrentCommune(),

              zone:
                "commune",

              professional:
                false,

              countryCode:
                "FR",

              country:
                "France"
            },
            {
              signal:
                controller.signal
            }
          );

      if(
        !State.current ||
        State.current.type !==
        "trade_application"
      ){
        return;
      }

      if(
        State.requestId !==
        viewToken
      ){
        return;
      }

      const rows =
        safeArray(
          result.rows
        );

      let html = `

        <div
          class="box">

          <div
            class="bociteAnnuaireTitle">
            Choisissez l'entreprise
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Métier :
            <strong>
              ${escapeHtml(
                trade
              )}
            </strong>
          </div>

        </div>

      `;

      if(!rows.length){

        html += `

          <div
            class="box"
            style="margin-top:9px;">

            <div
              class="bociteAnnuaireText">
              Aucune entreprise correspondant
              suffisamment à ce métier
              n'a été trouvée pour le moment.
            </div>

          </div>

        `;

      }else{

        rows.forEach(
          function(entity){

            html += `

              <button
                type="button"
                class="
                  choiceBtn
                  bociteAnnuaireWhiteButton
                  annuaireApplicationTargetBtn
                "
                data-id="${escapeHtml(
                  entity.id
                )}"
                style="
                  width:100%;
                  margin-top:7px;
                  text-align:left;
                ">

                <strong>
                  ${escapeHtml(
                    entity.name
                  )}
                </strong>

                ${
                  entity.commune
                    ? `
                        <br>
                        <span
                          style="
                            font-size:12px;
                            font-weight:400;
                          ">
                          ${escapeHtml(
                            entity.commune
                          )}
                        </span>
                      `
                    : ""
                }

              </button>

            `;
          }
        );
      }

      html +=
        getBackButtonHtml(
          "Retour au métier"
        );

      renderModal(
        "Candidature spontanée",
        html,
        function(){

          document
            .querySelectorAll(
              ".annuaireApplicationTargetBtn"
            )
            .forEach(
              function(button){

                button.onclick =
                  function(){

                    const entity =
                      getEntityById(
                        button.getAttribute(
                          "data-id"
                        )
                      );

                    if(!entity){

                      alert(
                        "Cette entreprise n'est plus disponible."
                      );

                      return;
                    }

                    openSpontaneousApplication(
                      entity,
                      trade
                    );
                  };
              }
            );

          bindBackButton();
        }
      );

    }catch(error){

      if(
        error &&
        error.name ===
        "AbortError"
      ){
        return;
      }

      renderModal(
        "Candidature spontanée",
        `

          <div
            class="box">

            <div
              class="bociteAnnuaireTitle">
              Recherche momentanément indisponible
            </div>

            <div
              class="bociteAnnuaireText"
              style="margin-top:6px;">
              Vous pourrez réessayer
              depuis ce métier.
            </div>

          </div>

          ${getBackButtonHtml(
            "Retour au métier"
          )}

        `,
        bindBackButton
      );
    }
  }

  /* =======================================================
     33. RACCORDEMENT AU MODULE EMPLOI
     ======================================================= */

  function openSpontaneousApplication(
    entity,
    trade
  ){

    addCitizenAction(
      "employment_application_opened",
      entity,
      {
        trade:
          trade ||
          entity.trade ||
          entity.activity ||
          "",

        status:
          "opened"
      }
    );

    /*
     * Priorité au formulaire Emploi officiel.
     */
    if(
      typeof module
        .openApplicationForm ===
      "function"
    ){

      module.openApplicationForm({

        companyId:
          entity.id,

        companyName:
          entity.name,

        companyCommune:
          entity.commune,

        trade:
          trade ||
          entity.trade ||
          entity.activity ||
          "",

        source:
          "annuaire"

      });

      return;
    }

    if(
      typeof module
        .openEmploymentPublicHome ===
      "function"
    ){

      module
        .openEmploymentPublicHome();

      return;
    }

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
      "Le formulaire Emploi n'est pas encore disponible."
    );
  }

  /* =======================================================
     34. CARTE RÉSULTAT
     ======================================================= */

  function getResultCard(entity){

    const rating =
      getRatingSummary(
        entity.id
      );

    const openStatus =
      getEntityOpenStatus(
        entity
      );

    return `

      <div
        class="
          box
          bociteAnnuaireResult
        "
        style="
          margin-bottom:9px;
        ">

        <div
          class="bociteAnnuaireTitle">
          ${escapeHtml(
            entity.name
          )}
        </div>

        ${
          entity.activity
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:4px;">
                  ${escapeHtml(
                    entity.activity
                  )}
                </div>
              `
            : ""
        }

        ${
          entity.commune ||
          entity.country
            ? `
                <div
                  class="bociteAnnuaireSmall"
                  style="margin-top:4px;">
                  ${escapeHtml(
                    [
                      entity.commune,
                      entity.country
                    ]
                    .filter(Boolean)
                    .join(" • ")
                  )}
                </div>
              `
            : ""
        }

        ${
          openStatus.known
            ? `
                <div
                  class="bociteAnnuaireSmall"
                  style="
                    margin-top:4px;
                    font-weight:700;
                    color:${
                      openStatus.open
                        ? "#2f5d46"
                        : "#555"
                    };
                  ">
                  ${escapeHtml(
                    openStatus.label
                  )}
                </div>
              `
            : ""
        }

        ${
          rating.count
            ? `
                <div
                  class="bociteAnnuaireSmall"
                  style="margin-top:4px;">
                  ${rating.average.toFixed(
                    1
                  )} / 5
                  •
                  ${rating.count}
                  appréciation(s)
                </div>
              `
            : ""
        }

        <button
          type="button"
          class="
            choiceBtn
            bociteAnnuaireWhiteButton
            annuaireOpenEntityBtn
          "
          data-id="${escapeHtml(
            entity.id
          )}"
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
     35. RÉSULTATS
     ======================================================= */

  function renderResults(data){

    const request =
      data.request ||
      {};

    const rows =
      safeArray(
        data.rows
      );

    const searchLabel =
      request.trade ||
      request.query ||
      "";

    let zoneLabel =
      request.commune ||
      getCurrentCommune();

    if(
      request.zone ===
      "france"
    ){

      zoneLabel =
        "France entière";
    }

    if(
      request.zone ===
      "europe"
    ){

      zoneLabel =
        request.country ||
        "Europe";
    }

    let html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteAnnuaireTitle">
          Résultats
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:5px;">
          <strong>
            ${escapeHtml(
              searchLabel
            )}
          </strong>
          <br>
          ${escapeHtml(
            zoneLabel
          )}
        </div>

      </div>

    `;

    if(
      data.loading ===
      true
    ){

      html += `

        <div
          class="box"
          style="
            margin-top:9px;
            text-align:center;
            padding:18px 8px;
          ">

          <div
            class="bociteAnnuaireTitle">
            Recherche en cours…
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            ${getLogoHtml()} recherche
            les établissements correspondant
            à votre demande.
          </div>

        </div>

      `;

    }else if(
      data.error ===
      true
    ){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div
            class="bociteAnnuaireTitle">
            Recherche momentanément indisponible
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">
            Le service n'a pas répondu.
          </div>

          <button
            id="annuaireRetrySearchBtn"
            class="
              choiceBtn
              bociteAnnuaireWhiteButton
            "
            type="button"
            style="
              width:100%;
              margin-top:8px;
            ">
            Réessayer
          </button>

        </div>

      `;

    }else if(
      !rows.length
    ){

      const officialMissing =
        request.professional ===
          true &&
        (
          request.zone ===
            "france" ||
          request.zone ===
            "europe" ||
          request.zone ===
            "region" ||
          request.zone ===
            "departement"
        ) &&
        data.officialProvider !==
          true;

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div
            class="bociteAnnuaireTitle">
            ${
              officialMissing
                ? "Branchement officiel requis"
                : "Aucun résultat correspondant"
            }
          </div>

          <div
            class="bociteAnnuaireText"
            style="margin-top:6px;">

            ${
              officialMissing
                ? (
                    "La recherche étendue est déjà préparée dans l'annuaire. " +
                    "Elle deviendra active lorsque le fournisseur officiel Bo'CitéArt sera raccordé."
                  )
                : (
                    "Aucun établissement suffisamment fiable n'a été trouvé pour cette recherche."
                  )
            }

          </div>

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

      rows.forEach(
        function(entity){

          html +=
            getResultCard(
              entity
            );
        }
      );
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
          .forEach(
            function(button){

              button.onclick =
                function(){

                  navigate(
                    "entity",
                    {
                      entityId:
                        button.getAttribute(
                          "data-id"
                        ),

                      professional:
                        request.professional ===
                        true
                    }
                  );
                };
            }
          );

        const retry =
          getElement(
            "annuaireRetrySearchBtn"
          );

        if(retry){

          retry.onclick =
            function(){

              runSearch({
                ...request
              });
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     36. FICHE ÉTABLISSEMENT
     ======================================================= */

  async function renderEntity(data){

    let entity =
      getEntityById(
        data.entityId
      );

    if(!entity){

      renderModal(
        "Fiche indisponible",
        `

          <div
            class="box">

            <div
              class="bociteAnnuaireText">
              Cette fiche n'est plus disponible.
            </div>

          </div>

          ${getBackButtonHtml(
            "Retour"
          )}

        `,
        bindBackButton
      );

      return;
    }

    /*
     * Enrichissement officiel si disponible.
     * La fiche de base reste affichable
     * même si le serveur ne répond pas.
     */
    try{

      const enriched =
        await Annuaire.Agent
          .enrichEntity(
            entity
          );

      if(enriched){

        const normalized =
          normalizeEntity({
            ...entity,
            ...enriched
          });

        mergeValidatedEntities(
          [
            normalized
          ]
        );

        entity =
          normalized;
      }

    }catch(error){

      /* la fiche reste utilisable */
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
        entity.commune,
        entity.country
      ]
      .filter(Boolean)
      .join(" ");

    const verificationText =
      entity.lastCheckedAt
        ? (
            "Dernière vérification : " +
            formatDateTime(
              entity.lastCheckedAt
            )
          )
        : "";

    let html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteAnnuaireTitle">
          ${escapeHtml(
            entity.name
          )}
        </div>

        ${
          entity.activity
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:4px;">
                  ${escapeHtml(
                    entity.activity
                  )}
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
                  ${escapeHtml(
                    address
                  )}
                </div>
              `
            : ""
        }

        ${getHoursInformationHtml(
          entity
        )}

        ${
          entity.source
            ? `
                <div
                  class="bociteAnnuaireSmall"
                  style="margin-top:7px;">
                  Source :
                  ${escapeHtml(
                    entity.source
                  )}
                </div>
              `
            : ""
        }

        ${
          verificationText
            ? `
                <div
                  class="bociteAnnuaireSmall"
                  style="margin-top:3px;">
                  ${escapeHtml(
                    verificationText
                  )}
                </div>
              `
            : ""
        }

      </div>

      <div
        class="bociteAnnuaireActions"
        style="margin-top:9px;">

        ${
          entity.phone
            ? `
                <button
                  id="annuaireEntityCallBtn"
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                  "
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
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                  "
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
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                  "
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
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                  "
                  type="button">
                  Site internet
                </button>
              `
            : ""
        }

      </div>

      <button
        id="annuaireFavoriteToggleBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
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

      <div
        class="box"
        style="margin-top:9px;">

        <div
          class="bociteAnnuaireTitle">
          Appréciation locale
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">

          ${
            rating.count
              ? (
                  "Moyenne : <strong>" +
                  rating.average.toFixed(
                    1
                  ) +
                  " / 5</strong> • " +
                  rating.count +
                  " appréciation(s)"
                )
              : (
                  "Aucune appréciation pour le moment."
                )
          }

        </div>

        <div
          class="bociteAnnuaireActions"
          style="margin-top:8px;">

          ${
            [1,2,3,4,5]
              .map(
                function(value){

                  return `
                    <button
                      type="button"
                      class="
                        choiceBtn
                        bociteAnnuaireWhiteButton
                        annuaireRatingBtn
                      "
                      data-rating="${value}">
                      ${value}
                    </button>
                  `;
                }
              )
              .join("")
          }

        </div>

        <div
          class="bociteAnnuaireSmall"
          style="margin-top:6px;">
          Sans commentaire public.
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        <div
          class="bociteAnnuaireTitle">
          Emploi
        </div>

        ${
          entity.recruiting
            ? `
                <button
                  id="annuaireJobsBtn"
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                  "
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
          class="
            choiceBtn
            bociteAnnuaireWhiteButton
          "
          type="button"
          style="
            width:100%;
            margin-top:7px;
          ">
          Déposer une candidature spontanée
        </button>

      </div>

      ${
        data.professional ===
        true
          ? `
              <button
                id="annuaireOpenProfessionalInfoBtn"
                class="
                  choiceBtn
                  bociteAnnuaireWhiteButton
                "
                type="button"
                style="
                  width:100%;
                  margin-top:8px;
                ">
                Informations professionnelles
              </button>
            `
          : ""
      }

      <button
        id="annuaireReportBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        Signaler une information incorrecte
      </button>

      ${getBackButtonHtml(
        "Retour aux résultats"
      )}

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
                String(
                  entity.phone
                )
                .replace(
                  /\s+/g,
                  ""
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

        const website =
          getElement(
            "annuaireEntityWebBtn"
          );

        if(website){

          website.onclick =
            function(){

              window.open(
                normalizeUrl(
                  entity.website
                ),
                "_blank",
                "noopener"
              );
            };
        }

        const favoriteButton =
          getElement(
            "annuaireFavoriteToggleBtn"
          );

        if(favoriteButton){

          favoriteButton.onclick =
            function(){

              const added =
                toggleFavorite(
                  entity
                );

              favoriteButton
                .textContent =
                  added
                    ? "Retirer de mes favoris"
                    : "Ajouter à mes favoris";
            };
        }

        document
          .querySelectorAll(
            ".annuaireRatingBtn"
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
            }
          );

        const jobs =
          getElement(
            "annuaireJobsBtn"
          );

        if(jobs){

          jobs.onclick =
            function(){

              if(
                typeof module
                  .openPublicEmploymentList ===
                "function"
              ){

                module
                  .openPublicEmploymentList(
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
                typeof module
                  .openEmploymentPublicHome ===
                "function"
              ){

                module
                  .openEmploymentPublicHome();

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

              openSpontaneousApplication(
                entity,
                entity.trade ||
                entity.activity ||
                ""
              );
            };
        }

        const proInformation =
          getElement(
            "annuaireOpenProfessionalInfoBtn"
          );

        if(proInformation){

          proInformation.onclick =
            function(){

              requireProfessionalAccess(
                function(){

                  navigate(
                    "professional_information",
                    {
                      entityId:
                        entity.id
                    }
                  );
                }
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
     37. RELANCER UNE RECHERCHE HISTORIQUE
     ======================================================= */

  function replaySearchHistoryItem(id){

    const item =
      loadSearchHistory()
        .find(
          function(row){

            return (
              String(row.id) ===
              String(id)
            );
          }
        );

    if(!item){

      alert(
        "Cette recherche n'est plus disponible."
      );

      return;
    }

    if(
      item.professional ===
      true
    ){

      requireProfessionalAccess(
        function(){

          if(
            (
              item.zone ===
              "departement" ||
              item.zone ===
              "region" ||
              item.zone ===
              "france" ||
              item.zone ===
              "europe"
            )
          ){

            requireExtendedSubscription(
              function(){

                runSearch({
                  ...item
                });
              }
            );

            return;
          }

          runSearch({
            ...item
          });
        }
      );

      return;
    }

    runSearch({

      query:
        item.query,

      trade:
        item.trade || "",

      category:
        item.category || "",

      commune:
        item.commune ||
        getCurrentCommune(),

      zone:
        "commune",

      professional:
        false,

      countryCode:
        "FR",

      country:
        "France"

    });
  }

  /* =======================================================
     38. HISTORIQUE PUBLIC
     ======================================================= */

  function renderHistory(){

    const history =
      loadSearchHistory()
        .filter(
          function(item){

            return (
              item.professional !==
              true
            );
          }
        );

    let html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
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

          <div
            class="bociteAnnuaireText">
            Aucun historique pour le moment.
          </div>

        </div>

      `;

    }else{

      history.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:8px;">

              <div
                class="bociteAnnuaireTitle">
                ${escapeHtml(
                  item.query
                )}
              </div>

              <div
                class="bociteAnnuaireSmall"
                style="margin-top:4px;">
                ${escapeHtml(
                  item.commune || ""
                )}
                <br>
                ${formatDateTime(
                  item.createdAt
                )}
              </div>

              <div
                class="bociteAnnuaireActions"
                style="margin-top:8px;">

                <button
                  type="button"
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                    annuaireHistoryReplayBtn
                  "
                  data-id="${escapeHtml(
                    item.id
                  )}">
                  Reprendre
                </button>

                <button
                  type="button"
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                    annuaireHistoryDeleteBtn
                  "
                  data-id="${escapeHtml(
                    item.id
                  )}">
                  Supprimer
                </button>

              </div>

            </div>

          `;
        }
      );

      html += `

        <button
          id="annuaireHistoryClearAllBtn"
          class="
            choiceBtn
            bociteAnnuaireWhiteButton
          "
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
          .forEach(
            function(button){

              button.onclick =
                function(){

                  replaySearchHistoryItem(
                    button.getAttribute(
                      "data-id"
                    )
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

                  if(
                    !window.confirm(
                      "Supprimer uniquement cette ligne ?"
                    )
                  ){
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
            }
          );

        const clear =
          getElement(
            "annuaireHistoryClearAllBtn"
          );

        if(clear){

          clear.onclick =
            function(){

              if(
                !window.confirm(
                  "Supprimer tout votre historique de recherches ?"
                )
              ){
                return;
              }

              const professionalRows =
                loadSearchHistory()
                  .filter(
                    function(item){

                      return (
                        item.professional ===
                        true
                      );
                    }
                  );

              saveSearchHistory(
                professionalRows
              );

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
     39. FAVORIS
     ======================================================= */

  function renderFavorites(){

    const favorites =
      loadFavorites();

    let html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          Mes favoris
        </div>

      </div>

    `;

    if(!favorites.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div
            class="bociteAnnuaireText">
            Aucun favori enregistré.
          </div>

        </div>

      `;

    }else{

      favorites.forEach(
        function(item){

          html += `

            <button
              type="button"
              class="
                choiceBtn
                bociteAnnuaireWhiteButton
                annuaireFavoriteOpenBtn
              "
              data-id="${escapeHtml(
                item.entityId
              )}"
              style="
                width:100%;
                margin-top:7px;
                text-align:left;
              ">

              <strong>
                ${escapeHtml(
                  item.name
                )}
              </strong>

              ${
                item.commune
                  ? `
                      <br>
                      <span
                        style="
                          font-size:12px;
                          font-weight:400;
                        ">
                        ${escapeHtml(
                          item.commune
                        )}
                      </span>
                    `
                  : ""
              }

            </button>

          `;
        }
      );
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
          .forEach(
            function(button){

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
            }
          );

        bindBackButton();
      }
    );
  }

  /* =======================================================
     40. CONSULTÉS RÉCEMMENT
     ======================================================= */

  function renderViewed(){

    const history =
      loadViewedHistory();

    let html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          Consultés récemment
        </div>

      </div>

    `;

    if(!history.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div
            class="bociteAnnuaireText">
            Aucune fiche consultée.
          </div>

        </div>

      `;

    }else{

      history.forEach(
        function(item){

          html += `

            <button
              type="button"
              class="
                choiceBtn
                bociteAnnuaireWhiteButton
                annuaireViewedOpenBtn
              "
              data-id="${escapeHtml(
                item.entityId
              )}"
              style="
                width:100%;
                margin-top:7px;
                text-align:left;
              ">

              <strong>
                ${escapeHtml(
                  item.name
                )}
              </strong>

              <br>

              <span
                style="
                  font-size:12px;
                  font-weight:400;
                ">
                ${escapeHtml(
                  item.commune || ""
                )}
                •
                ${formatDateTime(
                  item.viewedAt
                )}
              </span>

            </button>

          `;
        }
      );
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
          .forEach(
            function(button){

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
            }
          );

        bindBackButton();
      }
    );
  }

  /* =======================================================
     41. MES DÉMARCHES
     ======================================================= */

  function renderCitizenActions(){

    const actions =
      loadCitizenActions();

    let html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          Mes démarches
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Retrouvez les démarches
          commencées depuis l'annuaire,
          avec leur date et leur heure.
        </div>

      </div>

    `;

    if(!actions.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div
            class="bociteAnnuaireText">
            Aucune démarche enregistrée.
          </div>

        </div>

      `;

    }else{

      actions.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:8px;">

              <div
                class="bociteAnnuaireTitle">
                ${escapeHtml(
                  item.companyName ||
                  "Entreprise"
                )}
              </div>

              <div
                class="bociteAnnuaireText"
                style="margin-top:5px;">
                ${
                  item.type ===
                  "employment_application_opened"
                    ? "Candidature spontanée"
                    : escapeHtml(
                        item.type
                      )
                }
              </div>

              ${
                item.trade
                  ? `
                      <div
                        class="bociteAnnuaireSmall"
                        style="margin-top:4px;">
                        Métier :
                        ${escapeHtml(
                          item.trade
                        )}
                      </div>
                    `
                  : ""
              }

              <div
                class="bociteAnnuaireSmall"
                style="margin-top:4px;">
                ${formatDateTime(
                  item.createdAt
                )}
              </div>

              ${
                item.entityId
                  ? `
                      <button
                        type="button"
                        class="
                          choiceBtn
                          bociteAnnuaireWhiteButton
                          annuaireActionEntityBtn
                        "
                        data-id="${escapeHtml(
                          item.entityId
                        )}"
                        style="
                          width:100%;
                          margin-top:7px;
                        ">
                        Retrouver l'entreprise
                      </button>
                    `
                  : ""
              }

            </div>

          `;
        }
      );
    }

    html +=
      getBackButtonHtml(
        "Retour à l'annuaire"
      );

    renderModal(
      "Mes démarches",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireActionEntityBtn"
          )
          .forEach(
            function(button){

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
            }
          );

        bindBackButton();
      }
    );
  }

  /* =======================================================
     42. SIGNALEMENT
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

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          Signaler une information
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          ${escapeHtml(
            entity.name
          )}
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        <label>
          <input
            type="radio"
            name="annuaireReportType"
            value="address">
          Adresse incorrecte
        </label>

        <br><br>

        <label>
          <input
            type="radio"
            name="annuaireReportType"
            value="phone">
          Téléphone incorrect
        </label>

        <br><br>

        <label>
          <input
            type="radio"
            name="annuaireReportType"
            value="activity">
          Activité incorrecte
        </label>

        <br><br>

        <label>
          <input
            type="radio"
            name="annuaireReportType"
            value="closed">
          Établissement fermé
        </label>

        <br><br>

        <label>
          <input
            type="radio"
            name="annuaireReportType"
            value="moved">
          Établissement déplacé
        </label>

        <br><br>

        <label>
          <input
            type="radio"
            name="annuaireReportType"
            value="other">
          Autre information
        </label>

      </div>

      <button
        id="annuaireReportSendBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Envoyer le signalement
      </button>

      ${getBackButtonHtml(
        "Retour à la fiche"
      )}

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
     43. SÉCURITÉ DE L'ESPACE PROFESSIONNEL
     ======================================================= */

  function canAccessProfessionalDirectory(){

    try{

      if(
        window.BoCiteArtRegistration &&
        typeof window.BoCiteArtRegistration.canAccess ===
        "function"
      ){

        return (
          window.BoCiteArtRegistration
            .canAccess("directory") ===
          true
        );
      }

      if(
        module.registration &&
        typeof module.registration.canAccess ===
        "function"
      ){

        return (
          module.registration
            .canAccess("directory") ===
          true
        );
      }

    }catch(error){

      console.warn(
        "Annuaire : contrôle sécurité indisponible",
        error
      );
    }

    return false;
  }

  function requireProfessionalAccess(callback){

    /*
     * La sécurité centrale reste l'autorité.
     * L'annuaire ne crée aucun mot de passe,
     * aucun code parallèle et aucun compte local.
     */

    if(
      canAccessProfessionalDirectory()
    ){

      if(
        typeof callback ===
        "function"
      ){
        callback();
      }

      return true;
    }

    /*
     * Si le module central possède son propre
     * écran d'accès, on lui passe la main.
     */

    if(
      window.BoCiteArtRegistration &&
      typeof window.BoCiteArtRegistration
        .requestAccess ===
      "function"
    ){

      window.BoCiteArtRegistration
        .requestAccess(
          "directory",
          callback
        );

      return false;
    }

    if(
      typeof module
        .openProfessionalAccess ===
      "function"
    ){

      module.openProfessionalAccess(
        "directory",
        callback
      );

      return false;
    }

    alert(
      "Accès privé professionnel requis."
    );

    return false;
  }

  /* =======================================================
     44. ABONNEMENT POUR RECHERCHE ÉTENDUE
     ======================================================= */

  function hasExtendedDirectorySubscription(){

    /*
     * Aucun faux abonnement n'est créé ici.
     * On interroge les mécanismes déjà présents
     * dans l'application.
     */

    try{

      if(
        typeof module
          .hasActiveSubscription ===
        "function"
      ){

        return (
          module.hasActiveSubscription(
            "directory_extended"
          ) === true
        );
      }

      if(
        typeof module
          .hasActiveProfessionalSubscription ===
        "function"
      ){

        return (
          module
            .hasActiveProfessionalSubscription(
              "directory"
            ) === true
        );
      }

      if(
        window.BoCiteArtSubscription &&
        typeof window.BoCiteArtSubscription
          .isActive ===
        "function"
      ){

        return (
          window.BoCiteArtSubscription
            .isActive(
              "directory_extended"
            ) === true
        );
      }

    }catch(error){

      console.warn(
        "Annuaire : abonnement non vérifiable",
        error
      );
    }

    return false;
  }

  function requireExtendedSubscription(
    callback
  ){

    if(
      hasExtendedDirectorySubscription()
    ){

      if(
        typeof callback ===
        "function"
      ){
        callback();
      }

      return true;
    }

    navigate(
      "professional_subscription",
      {
        returnAction:
          "professional_search"
      }
    );

    return false;
  }

  /* =======================================================
     45. PAYS EUROPÉENS
     ======================================================= */

  const EUROPE_COUNTRIES = [

    {code:"AT",name:"Autriche"},
    {code:"BE",name:"Belgique"},
    {code:"BG",name:"Bulgarie"},
    {code:"HR",name:"Croatie"},
    {code:"CY",name:"Chypre"},
    {code:"CZ",name:"Tchéquie"},
    {code:"DK",name:"Danemark"},
    {code:"EE",name:"Estonie"},
    {code:"FI",name:"Finlande"},
    {code:"FR",name:"France"},
    {code:"DE",name:"Allemagne"},
    {code:"GR",name:"Grèce"},
    {code:"HU",name:"Hongrie"},
    {code:"IE",name:"Irlande"},
    {code:"IT",name:"Italie"},
    {code:"LV",name:"Lettonie"},
    {code:"LT",name:"Lituanie"},
    {code:"LU",name:"Luxembourg"},
    {code:"MT",name:"Malte"},
    {code:"NL",name:"Pays-Bas"},
    {code:"PL",name:"Pologne"},
    {code:"PT",name:"Portugal"},
    {code:"RO",name:"Roumanie"},
    {code:"SK",name:"Slovaquie"},
    {code:"SI",name:"Slovénie"},
    {code:"ES",name:"Espagne"},
    {code:"SE",name:"Suède"},

    /*
     * Pays européens hors UE également utiles
     * à une recherche de partenaires.
     */

    {code:"AL",name:"Albanie"},
    {code:"AD",name:"Andorre"},
    {code:"BA",name:"Bosnie-Herzégovine"},
    {code:"IS",name:"Islande"},
    {code:"LI",name:"Liechtenstein"},
    {code:"MC",name:"Monaco"},
    {code:"ME",name:"Monténégro"},
    {code:"MK",name:"Macédoine du Nord"},
    {code:"NO",name:"Norvège"},
    {code:"SM",name:"Saint-Marin"},
    {code:"RS",name:"Serbie"},
    {code:"CH",name:"Suisse"},
    {code:"GB",name:"Royaume-Uni"}

  ];

  function getEuropeCountry(
    code
  ){

    return EUROPE_COUNTRIES
      .find(
        function(country){

          return (
            country.code ===
            String(
              code || ""
            )
            .toUpperCase()
          );
        }
      ) || null;
  }

  /* =======================================================
     46. CARNET PROFESSIONNEL
     ======================================================= */

  function loadProfessionalNotebook(){

    return safeArray(
      loadJson(
        STORAGE.professionalNotebook,
        []
      )
    );
  }

  function saveProfessionalNotebook(
    rows
  ){

    saveJson(
      STORAGE.professionalNotebook,
      safeArray(rows)
    );
  }

  function isInProfessionalNotebook(
    entityId
  ){

    return loadProfessionalNotebook()
      .some(
        function(item){

          return (
            String(item.entityId) ===
            String(entityId)
          );
        }
      );
  }

  function addToProfessionalNotebook(
    entity
  ){

    let rows =
      loadProfessionalNotebook();

    if(
      rows.some(
        function(item){

          return (
            String(item.entityId) ===
            String(entity.id)
          );
        }
      )
    ){

      return false;
    }

    rows.unshift({

      id:
        uniqueId(
          "pro_contact"
        ),

      entityId:
        entity.id,

      name:
        entity.name,

      activity:
        entity.activity ||
        entity.trade ||
        "",

      commune:
        entity.commune || "",

      country:
        entity.country || "",

      phone:
        entity.phone || "",

      email:
        entity.email || "",

      website:
        entity.website || "",

      note:
        "",

      createdAt:
        Date.now(),

      updatedAt:
        Date.now()

    });

    saveProfessionalNotebook(
      rows
    );

    return true;
  }

  function removeFromProfessionalNotebook(
    id
  ){

    saveProfessionalNotebook(
      loadProfessionalNotebook()
        .filter(
          function(item){

            return (
              String(item.id) !==
              String(id)
            );
          }
        )
    );
  }

  function updateProfessionalNotebookNote(
    id,
    note
  ){

    const rows =
      loadProfessionalNotebook();

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
      return false;
    }

    item.note =
      String(
        note || ""
      ).trim();

    item.updatedAt =
      Date.now();

    saveProfessionalNotebook(
      rows
    );

    return true;
  }

  /* =======================================================
     47. ENTREPRISES SUIVIES
     ======================================================= */

  function loadFollowedCompanies(){

    return safeArray(
      loadJson(
        STORAGE.followedCompanies,
        []
      )
    );
  }

  function saveFollowedCompanies(
    rows
  ){

    saveJson(
      STORAGE.followedCompanies,
      safeArray(rows)
    );
  }

  function isCompanyFollowed(
    entityId
  ){

    return loadFollowedCompanies()
      .some(
        function(item){

          return (
            String(item.entityId) ===
            String(entityId)
          );
        }
      );
  }

  function toggleFollowCompany(
    entity
  ){

    let rows =
      loadFollowedCompanies();

    const existing =
      rows.find(
        function(item){

          return (
            String(item.entityId) ===
            String(entity.id)
          );
        }
      );

    if(existing){

      rows =
        rows.filter(
          function(item){

            return (
              String(item.entityId) !==
              String(entity.id)
            );
          }
        );

      saveFollowedCompanies(
        rows
      );

      return false;
    }

    rows.unshift({

      id:
        uniqueId(
          "follow"
        ),

      entityId:
        entity.id,

      name:
        entity.name,

      activity:
        entity.activity ||
        entity.trade ||
        "",

      commune:
        entity.commune || "",

      country:
        entity.country || "",

      followedAt:
        Date.now(),

      lastCheckedAt:
        entity.lastCheckedAt || 0

    });

    saveFollowedCompanies(
      rows
    );

    return true;
  }

  /* =======================================================
     48. ACCUEIL PROFESSIONNEL PRIVÉ
     ======================================================= */

  function renderProfessionalHome(){

    if(
      !canAccessProfessionalDirectory()
    ){

      requireProfessionalAccess(
        function(){

          replaceView(
            "professional",
            {}
          );
        }
      );

      return;
    }

    const extended =
      hasExtendedDirectorySubscription();

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteAnnuaireTitle">
          Espace professionnel privé
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Recherchez des entreprises,
          fournisseurs, partenaires,
          sous-traitants ou compétences.
        </div>

        <div
          class="bociteAnnuaireSmall"
          style="margin-top:6px;">
          Accès protégé par votre compte
          professionnel ${getLogoHtml()}.
        </div>

      </div>

      <button
        id="annuaireProSearchBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:9px;
        ">
        Recherche professionnelle
      </button>

      <button
        id="annuaireProHistoryBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Historique de mes recherches
      </button>

      <button
        id="annuaireProNotebookBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Mon carnet professionnel
      </button>

      <button
        id="annuaireProFollowedBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Entreprises suivies
      </button>

      <button
        id="annuaireBercyBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Bercy Infos Entreprises
      </button>

      <div
        class="box"
        style="margin-top:10px;">

        <div
          class="bociteAnnuaireTitle">
          Recherche étendue
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">

          ${
            extended
              ? (
                  "Votre accès étendu est actif : " +
                  "commune, proximité, département, région, France et Europe."
                )
              : (
                  "La recherche France entière et Europe " +
                  "est réservée à l'abonnement professionnel."
                )
          }

        </div>

        ${
          !extended
            ? `
                <button
                  id="annuaireProSubscriptionBtn"
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                  "
                  type="button"
                  style="
                    width:100%;
                    margin-top:8px;
                  ">
                  Voir l'accès étendu
                </button>
              `
            : ""
        }

      </div>

      ${getBackButtonHtml(
        "Retour à l'annuaire"
      )}

    `;

    renderModal(
      "Espace professionnel",
      html,
      function(){

        const search =
          getElement(
            "annuaireProSearchBtn"
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
            "annuaireProHistoryBtn"
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
            "annuaireProNotebookBtn"
          );

        if(notebook){

          notebook.onclick =
            function(){

              navigate(
                "professional_notebook",
                {}
              );
            };
        }

        const followed =
          getElement(
            "annuaireProFollowedBtn"
          );

        if(followed){

          followed.onclick =
            function(){

              navigate(
                "professional_followed",
                {}
              );
            };
        }

        const bercy =
          getElement(
            "annuaireBercyBtn"
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

        const subscription =
          getElement(
            "annuaireProSubscriptionBtn"
          );

        if(subscription){

          subscription.onclick =
            function(){

              navigate(
                "professional_subscription",
                {}
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     49. FORMULAIRE RECHERCHE PROFESSIONNELLE
     ======================================================= */

  function renderProfessionalSearch(){

    if(
      !canAccessProfessionalDirectory()
    ){

      requireProfessionalAccess(
        function(){

          replaceView(
            "professional_search",
            {}
          );
        }
      );

      return;
    }

    const extended =
      hasExtendedDirectorySubscription();

    const countries =
      EUROPE_COUNTRIES
        .map(
          function(country){

            return `
              <option
                value="${escapeHtml(
                  country.code
                )}">
                ${escapeHtml(
                  country.name
                )}
              </option>
            `;
          }
        )
        .join("");

    const html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          Recherche professionnelle
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Recherchez par activité,
          métier, produit, service,
          compétence ou nom d'entreprise.
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        <label
          for="annuaireProQueryInput"
          class="bociteAnnuaireTitle">
          Je recherche
        </label>

        <input
          id="annuaireProQueryInput"
          class="bociteAnnuaireInput"
          type="search"
          autocomplete="off"
          placeholder="Ex. fabricant aluminium, transport, architecte…"
          style="
            background:#ffffff !important;
            color:#111111 !important;
            border:1px solid #bbb;
            border-radius:8px;
            padding:10px;
            margin-top:6px;
          "
        >

        <label
          for="annuaireProDetailsInput"
          class="bociteAnnuaireTitle"
          style="
            display:block;
            margin-top:10px;
          ">
          Précisez votre besoin
        </label>

        <textarea
          id="annuaireProDetailsInput"
          class="bociteAnnuaireTextarea"
          rows="3"
          placeholder="Produit, capacité, spécialité ou besoin recherché…"
          style="
            width:100%;
            box-sizing:border-box;
            background:#ffffff !important;
            color:#111111 !important;
            border:1px solid #bbb;
            border-radius:8px;
            padding:10px;
            margin-top:6px;
          "
        ></textarea>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        <div
          class="bociteAnnuaireTitle">
          Zone de recherche
        </div>

        <div
          style="
            margin-top:8px;
            line-height:2;
          ">

          <label>
            <input
              type="radio"
              name="annuaireProZone"
              value="commune"
              checked
              style="background:#ffffff;">
            Ma commune
          </label>

          <br>

          <label>
            <input
              type="radio"
              name="annuaireProZone"
              value="proximity"
              style="background:#ffffff;">
            Autour de ma commune
          </label>

          <br>

          <label>
            <input
              type="radio"
              name="annuaireProZone"
              value="departement"
              ${
                extended
                  ? ""
                  : "disabled"
              }
              style="background:#ffffff;">
            Département
            ${
              extended
                ? ""
                : " — abonnement"
            }
          </label>

          <br>

          <label>
            <input
              type="radio"
              name="annuaireProZone"
              value="region"
              ${
                extended
                  ? ""
                  : "disabled"
              }
              style="background:#ffffff;">
            Région
            ${
              extended
                ? ""
                : " — abonnement"
            }
          </label>

          <br>

          <label>
            <input
              type="radio"
              name="annuaireProZone"
              value="france"
              ${
                extended
                  ? ""
                  : "disabled"
              }
              style="background:#ffffff;">
            France entière
            ${
              extended
                ? ""
                : " — abonnement"
            }
          </label>

          <br>

          <label>
            <input
              type="radio"
              name="annuaireProZone"
              value="europe"
              ${
                extended
                  ? ""
                  : "disabled"
              }
              style="background:#ffffff;">
            Europe par pays
            ${
              extended
                ? ""
                : " — abonnement"
            }
          </label>

        </div>

        <div
          id="annuaireEuropeCountryBox"
          style="
            display:none;
            margin-top:9px;
          ">

          <label
            for="annuaireEuropeCountrySelect"
            class="bociteAnnuaireTitle">
            Pays
          </label>

          <select
            id="annuaireEuropeCountrySelect"
            class="bociteAnnuaireSelect"
            style="
              width:100%;
              box-sizing:border-box;
              background:#ffffff !important;
              color:#111111 !important;
              border:1px solid #bbb;
              border-radius:8px;
              padding:10px;
              margin-top:6px;
            ">
            ${countries}
          </select>

        </div>

      </div>

      <button
        id="annuaireProLaunchSearchBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:9px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Lancer la recherche
      </button>

      ${
        !extended
          ? `
              <button
                id="annuaireProSearchSubscriptionBtn"
                class="
                  choiceBtn
                  bociteAnnuaireWhiteButton
                "
                type="button"
                style="
                  width:100%;
                  margin-top:7px;
                  background:#ffffff !important;
                  color:#111111 !important;
                ">
                Accéder aux recherches France et Europe
              </button>
            `
          : ""
      }

      ${getBackButtonHtml(
        "Retour à l'espace professionnel"
      )}

    `;

    renderModal(
      "Recherche professionnelle",
      html,
      function(){

        const countryBox =
          getElement(
            "annuaireEuropeCountryBox"
          );

        function refreshZone(){

          const selected =
            document.querySelector(
              "input[name='annuaireProZone']:checked"
            );

          if(countryBox){

            countryBox.style.display =
              (
                selected &&
                selected.value ===
                "europe"
              )
                ? "block"
                : "none";
          }
        }

        document
          .querySelectorAll(
            "input[name='annuaireProZone']"
          )
          .forEach(
            function(radio){

              radio.onchange =
                refreshZone;
            }
          );

        refreshZone();

        const launch =
          getElement(
            "annuaireProLaunchSearchBtn"
          );

        if(launch){

          launch.onclick =
            function(){

              const queryElement =
                getElement(
                  "annuaireProQueryInput"
                );

              const detailsElement =
                getElement(
                  "annuaireProDetailsInput"
                );

              const selected =
                document.querySelector(
                  "input[name='annuaireProZone']:checked"
                );

              const query =
                queryElement
                  ? String(
                      queryElement.value ||
                      ""
                    ).trim()
                  : "";

              const details =
                detailsElement
                  ? String(
                      detailsElement.value ||
                      ""
                    ).trim()
                  : "";

              const zone =
                selected
                  ? selected.value
                  : "commune";

              if(!query){

                alert(
                  "Indiquez ce que vous recherchez."
                );

                return;
              }

              if(
                (
                  zone ===
                  "departement" ||
                  zone ===
                  "region" ||
                  zone ===
                  "france" ||
                  zone ===
                  "europe"
                ) &&
                !hasExtendedDirectorySubscription()
              ){

                requireExtendedSubscription(
                  function(){

                    replaceView(
                      "professional_search",
                      {}
                    );
                  }
                );

                return;
              }

              let countryCode =
                "FR";

              let country =
                "France";

              if(
                zone ===
                "europe"
              ){

                const select =
                  getElement(
                    "annuaireEuropeCountrySelect"
                  );

                countryCode =
                  select
                    ? select.value
                    : "FR";

                const countryData =
                  getEuropeCountry(
                    countryCode
                  );

                country =
                  countryData
                    ? countryData.name
                    : "";
              }

              runSearch({

                query:
                  [
                    query,
                    details
                  ]
                  .filter(Boolean)
                  .join(" "),

                trade:
                  "",

                category:
                  "",

                commune:
                  getCurrentCommune(),

                zone:
                  zone,

                professional:
                  true,

                countryCode:
                  countryCode,

                country:
                  country

              });
            };
        }

        const subscription =
          getElement(
            "annuaireProSearchSubscriptionBtn"
          );

        if(subscription){

          subscription.onclick =
            function(){

              navigate(
                "professional_subscription",
                {}
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     50. HISTORIQUE PROFESSIONNEL
     ======================================================= */

  function renderProfessionalHistory(){

    if(
      !canAccessProfessionalDirectory()
    ){

      requireProfessionalAccess(
        function(){

          replaceView(
            "professional_history",
            {}
          );
        }
      );

      return;
    }

    const history =
      loadSearchHistory()
        .filter(
          function(item){

            return (
              item.professional ===
              true
            );
          }
        );

    let html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          Historique professionnel
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Vos recherches restent disponibles
          jusqu'à leur suppression volontaire.
        </div>

      </div>

    `;

    if(!history.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div
            class="bociteAnnuaireText">
            Aucune recherche professionnelle enregistrée.
          </div>

        </div>

      `;

    }else{

      history.forEach(
        function(item){

          let zone =
            item.zone || "";

          if(
            item.zone ===
            "europe"
          ){

            zone =
              item.country ||
              "Europe";
          }

          if(
            item.zone ===
            "france"
          ){

            zone =
              "France entière";
          }

          html += `

            <div
              class="box"
              style="margin-top:8px;">

              <div
                class="bociteAnnuaireTitle">
                ${escapeHtml(
                  item.query
                )}
              </div>

              <div
                class="bociteAnnuaireSmall"
                style="margin-top:4px;">
                Zone :
                ${escapeHtml(
                  zone
                )}
                <br>
                ${formatDateTime(
                  item.createdAt
                )}
              </div>

              <div
                class="bociteAnnuaireActions"
                style="margin-top:8px;">

                <button
                  type="button"
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                    annuaireProHistoryReplayBtn
                  "
                  data-id="${escapeHtml(
                    item.id
                  )}">
                  Reprendre
                </button>

                <button
                  type="button"
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                    annuaireProHistoryDeleteBtn
                  "
                  data-id="${escapeHtml(
                    item.id
                  )}">
                  Supprimer
                </button>

              </div>

            </div>

          `;
        }
      );

      html += `

        <button
          id="annuaireProHistoryClearBtn"
          class="
            choiceBtn
            bociteAnnuaireWhiteButton
          "
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
        "Retour à l'espace professionnel"
      );

    renderModal(
      "Historique professionnel",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireProHistoryReplayBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  replaySearchHistoryItem(
                    button.getAttribute(
                      "data-id"
                    )
                  );
                };
            }
          );

        document
          .querySelectorAll(
            ".annuaireProHistoryDeleteBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  if(
                    !window.confirm(
                      "Supprimer cette recherche ?"
                    )
                  ){
                    return;
                  }

                  deleteSearchHistoryItem(
                    button.getAttribute(
                      "data-id"
                    )
                  );

                  replaceView(
                    "professional_history",
                    {}
                  );
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
                !window.confirm(
                  "Supprimer tout l'historique professionnel ?"
                )
              ){
                return;
              }

              const publicRows =
                loadSearchHistory()
                  .filter(
                    function(item){

                      return (
                        item.professional !==
                        true
                      );
                    }
                  );

              saveSearchHistory(
                publicRows
              );

              replaceView(
                "professional_history",
                {}
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     51. CARNET PROFESSIONNEL
     ======================================================= */

  function renderProfessionalNotebook(){

    if(
      !canAccessProfessionalDirectory()
    ){

      requireProfessionalAccess(
        function(){

          replaceView(
            "professional_notebook",
            {}
          );
        }
      );

      return;
    }

    const rows =
      loadProfessionalNotebook();

    let html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          Mon carnet professionnel
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Conservez les contacts utiles
          retrouvés dans l'annuaire.
        </div>

      </div>

    `;

    if(!rows.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div
            class="bociteAnnuaireText">
            Aucun contact enregistré.
          </div>

        </div>

      `;

    }else{

      rows.forEach(
        function(item){

          html += `

            <div
              class="box"
              style="margin-top:8px;">

              <div
                class="bociteAnnuaireTitle">
                ${escapeHtml(
                  item.name
                )}
              </div>

              ${
                item.activity
                  ? `
                      <div
                        class="bociteAnnuaireText"
                        style="margin-top:4px;">
                        ${escapeHtml(
                          item.activity
                        )}
                      </div>
                    `
                  : ""
              }

              <div
                class="bociteAnnuaireSmall"
                style="margin-top:4px;">
                ${escapeHtml(
                  [
                    item.commune,
                    item.country
                  ]
                  .filter(Boolean)
                  .join(" • ")
                )}
                <br>
                Ajouté le
                ${formatDateTime(
                  item.createdAt
                )}
              </div>

              <textarea
                class="
                  bociteAnnuaireTextarea
                  annuaireNotebookNoteInput
                "
                data-id="${escapeHtml(
                  item.id
                )}"
                rows="2"
                placeholder="Note privée"
                style="
                  width:100%;
                  box-sizing:border-box;
                  background:#ffffff !important;
                  color:#111111 !important;
                  border:1px solid #bbb;
                  border-radius:8px;
                  padding:9px;
                  margin-top:7px;
                ">${escapeHtml(
                  item.note || ""
                )}</textarea>

              <div
                class="bociteAnnuaireActions"
                style="margin-top:7px;">

                <button
                  type="button"
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                    annuaireNotebookOpenBtn
                  "
                  data-entity-id="${escapeHtml(
                    item.entityId
                  )}">
                  Voir la fiche
                </button>

                <button
                  type="button"
                  class="
                    choiceBtn
                    bociteAnnuaireWhiteButton
                    annuaireNotebookDeleteBtn
                  "
                  data-id="${escapeHtml(
                    item.id
                  )}">
                  Retirer
                </button>

              </div>

            </div>

          `;
        }
      );
    }

    html +=
      getBackButtonHtml(
        "Retour à l'espace professionnel"
      );

    renderModal(
      "Carnet professionnel",
      html,
      function(){

        document
          .querySelectorAll(
            ".annuaireNotebookNoteInput"
          )
          .forEach(
            function(input){

              input.onchange =
                function(){

                  updateProfessionalNotebookNote(
                    input.getAttribute(
                      "data-id"
                    ),
                    input.value
                  );
                };
            }
          );

        document
          .querySelectorAll(
            ".annuaireNotebookOpenBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  navigate(
                    "entity",
                    {
                      entityId:
                        button.getAttribute(
                          "data-entity-id"
                        ),

                      professional:
                        true
                    }
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

                  if(
                    !window.confirm(
                      "Retirer ce contact du carnet ?"
                    )
                  ){
                    return;
                  }

                  removeFromProfessionalNotebook(
                    button.getAttribute(
                      "data-id"
                    )
                  );

                  replaceView(
                    "professional_notebook",
                    {}
                  );
                };
            }
          );

        bindBackButton();
      }
    );
  }

  /* =======================================================
     52. ENTREPRISES SUIVIES
     ======================================================= */

  function renderProfessionalFollowed(){

    if(
      !canAccessProfessionalDirectory()
    ){

      requireProfessionalAccess(
        function(){

          replaceView(
            "professional_followed",
            {}
          );
        }
      );

      return;
    }

    const rows =
      loadFollowedCompanies();

    let html = `

      <div
        class="box">

        <div
          class="bociteAnnuaireTitle">
          Entreprises suivies
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Retrouvez rapidement
          les entreprises que vous souhaitez suivre.
        </div>

      </div>

    `;

    if(!rows.length){

      html += `

        <div
          class="box"
          style="margin-top:9px;">

          <div
            class="bociteAnnuaireText">
            Aucune entreprise suivie.
          </div>

        </div>

      `;

    }else{

      rows.forEach(
        function(item){

          html += `

            <button
              type="button"
              class="
                choiceBtn
                bociteAnnuaireWhiteButton
                annuaireFollowedOpenBtn
              "
              data-id="${escapeHtml(
                item.entityId
              )}"
              style="
                width:100%;
                margin-top:7px;
                text-align:left;
              ">

              <strong>
                ${escapeHtml(
                  item.name
                )}
              </strong>

              <br>

              <span
                style="
                  font-size:12px;
                  font-weight:400;
                ">
                ${escapeHtml(
                  [
                    item.activity,
                    item.commune,
                    item.country
                  ]
                  .filter(Boolean)
                  .join(" • ")
                )}
              </span>

            </button>

          `;
        }
      );
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
            ".annuaireFollowedOpenBtn"
          )
          .forEach(
            function(button){

              button.onclick =
                function(){

                  navigate(
                    "entity",
                    {
                      entityId:
                        button.getAttribute(
                          "data-id"
                        ),

                      professional:
                        true
                    }
                  );
                };
            }
          );

        bindBackButton();
      }
    );
  }

  /* =======================================================
     53. INFORMATIONS PROFESSIONNELLES D'UNE FICHE
     ======================================================= */

  function renderProfessionalInformation(
    data
  ){

    if(
      !canAccessProfessionalDirectory()
    ){

      requireProfessionalAccess(
        function(){

          replaceView(
            "professional_information",
            data
          );
        }
      );

      return;
    }

    const entity =
      getEntityById(
        data.entityId
      );

    if(!entity){

      goBack();
      return;
    }

    const inNotebook =
      isInProfessionalNotebook(
        entity.id
      );

    const followed =
      isCompanyFollowed(
        entity.id
      );

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteAnnuaireTitle">
          ${escapeHtml(
            entity.name
          )}
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:5px;">
          Informations professionnelles
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        ${
          entity.siren
            ? `
                <div
                  class="bociteAnnuaireText">
                  <strong>SIREN :</strong>
                  ${escapeHtml(
                    entity.siren
                  )}
                </div>
              `
            : ""
        }

        ${
          entity.siret
            ? `
                <div
                  class="bociteAnnuaireText"
                  style="margin-top:5px;">
                  <strong>SIRET :</strong>
                  ${escapeHtml(
                    entity.siret
                  )}
                </div>
              `
            : ""
        }

        ${
          !entity.siren &&
          !entity.siret
            ? `
                <div
                  class="bociteAnnuaireText">
                  Les données légales complémentaires
                  apparaîtront lorsqu'elles seront
                  disponibles auprès du fournisseur officiel.
                </div>
              `
            : ""
        }

      </div>

      <button
        id="annuaireAddNotebookBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:8px;
        ">
        ${
          inNotebook
            ? "Déjà dans mon carnet"
            : "Ajouter à mon carnet professionnel"
        }
      </button>

      <button
        id="annuaireFollowCompanyBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        ${
          followed
            ? "Ne plus suivre cette entreprise"
            : "Suivre cette entreprise"
        }
      </button>

      ${getBackButtonHtml(
        "Retour à la fiche"
      )}

    `;

    renderModal(
      "Informations professionnelles",
      html,
      function(){

        const notebook =
          getElement(
            "annuaireAddNotebookBtn"
          );

        if(notebook){

          notebook.onclick =
            function(){

              if(
                isInProfessionalNotebook(
                  entity.id
                )
              ){

                alert(
                  "Cette entreprise est déjà dans votre carnet."
                );

                return;
              }

              addToProfessionalNotebook(
                entity
              );

              notebook.textContent =
                "Déjà dans mon carnet";
            };
        }

        const follow =
          getElement(
            "annuaireFollowCompanyBtn"
          );

        if(follow){

          follow.onclick =
            function(){

              const active =
                toggleFollowCompany(
                  entity
                );

              follow.textContent =
                active
                  ? "Ne plus suivre cette entreprise"
                  : "Suivre cette entreprise";
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     54. ABONNEMENT / RECHERCHE ÉTENDUE
     ======================================================= */

  function renderProfessionalSubscription(){

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteAnnuaireTitle">
          Recherche professionnelle étendue
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          L'abonnement professionnel
          permet d'étendre la recherche
          au-delà de la commune.
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        <div
          class="bociteAnnuaireTitle">
          Recherche disponible
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:7px;">
          Commune
          <br>
          Proximité
          <br>
          Département
          <br>
          Région
          <br>
          France entière
          <br>
          Europe par pays
        </div>

      </div>

      <div
        class="box"
        style="margin-top:9px;">

        <div
          class="bociteAnnuaireText">
          Le moteur est préparé pour recevoir
          le fournisseur professionnel officiel
          sans reconstruire les écrans
          de l'annuaire.
        </div>

      </div>

      <button
        id="annuaireOpenSubscriptionModuleBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:9px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Consulter mon abonnement
      </button>

      ${getBackButtonHtml(
        "Retour"
      )}

    `;

    renderModal(
      "Recherche étendue",
      html,
      function(){

        const button =
          getElement(
            "annuaireOpenSubscriptionModuleBtn"
          );

        if(button){

          button.onclick =
            function(){

              if(
                typeof module
                  .openSubscription ===
                "function"
              ){

                module.openSubscription();
                return;
              }

              if(
                typeof module
                  .openAbonnement ===
                "function"
              ){

                module.openAbonnement();
                return;
              }

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
                "Le module Abonnement sera raccordé ici."
              );
            };
        }

        bindBackButton();
      }
    );
  }

  /* =======================================================
     55. BERCY INFOS ENTREPRISES
     ======================================================= */

  function renderBercy(){

    if(
      !canAccessProfessionalDirectory()
    ){

      requireProfessionalAccess(
        function(){

          replaceView(
            "bercy",
            {}
          );
        }
      );

      return;
    }

    const html = `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteAnnuaireTitle">
          Bercy Infos Entreprises
        </div>

        <div
          class="bociteAnnuaireText"
          style="margin-top:6px;">
          Retrouvez les informations
          et ressources officielles
          destinées aux entreprises.
        </div>

      </div>

      <button
        id="annuaireBercyExternalBtn"
        class="
          choiceBtn
          bociteAnnuaireWhiteButton
        "
        type="button"
        style="
          width:100%;
          margin-top:9px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Ouvrir Bercy Infos Entreprises
      </button>

      ${getBackButtonHtml(
        "Retour à l'espace professionnel"
      )}

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
     54. SURFACE BLANCHE DE L'ANNUAIRE
     ======================================================= */

  function applyAnnuaireSurface(){

    window.setTimeout(
      function(){

        document
          .querySelectorAll(
            ".modal-body .box," +
            ".modalBody .box," +
            ".modal-content .box," +
            ".modalContent .box"
          )
          .forEach(
            function(box){

              box.style.background =
                "#ffffff";
            }
          );

        document
          .querySelectorAll(
            ".bociteAnnuaireWhiteButton," +
            ".bociteAnnuaireCategoryButton," +
            ".bociteAnnuaireTradeButton," +
            ".bociteAnnuaireActionButton"
          )
          .forEach(
            function(button){

              button.style
                .setProperty(
                  "background",
                  "#ffffff",
                  "important"
                );

              button.style
                .setProperty(
                  "background-color",
                  "#ffffff",
                  "important"
                );

              button.style
                .setProperty(
                  "color",
                  "#111111",
                  "important"
                );
            }
          );

        const back =
          getElement(
            "annuaireInternalBackBtn"
          );

        if(back){

          back.style
            .setProperty(
              "background",
              "#f3e7d3",
              "important"
            );

          back.style
            .setProperty(
              "background-color",
              "#f3e7d3",
              "important"
            );

          back.style
            .setProperty(
              "color",
              "#111111",
              "important"
            );
        }

      },
      0
    );
  }

  /* =======================================================
     55. ROUTEUR UNIQUE
     ======================================================= */

  function renderCurrentView(){

    if(!State.current){

      State.current = {

        type:
          "home",

        data:
          {}

      };
    }

    const type =
      State.current.type;

    const data =
      State.current.data ||
      {};

    if(
      type ===
      "home"
    ){

      renderHome();

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "category"
    ){

      renderCategory(
        data
      );

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "trade"
    ){

      renderTrade(
        data
      );

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "trade_application"
    ){

      renderTradeApplication(
        data
      );

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "results"
    ){

      renderResults(
        data
      );

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "entity"
    ){

      renderEntity(
        data
      );

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "history"
    ){

      renderHistory();

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "favorites"
    ){

      renderFavorites();

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "viewed"
    ){

      renderViewed();

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "citizen_actions"
    ){

      renderCitizenActions();

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "report"
    ){

      renderReport(
        data
      );

      applyAnnuaireSurface();

      return;
    }

    if(
      type ===
      "professional"
    ){

      requireProfessionalAccess(
        function(){

          renderProfessionalHome();

          applyAnnuaireSurface();
        }
      );

      return;
    }

    if(
      type ===
      "professional_search"
    ){

      requireProfessionalAccess(
        function(){

          renderProfessionalSearch();

          applyAnnuaireSurface();
        }
      );

      return;
    }

    if(
      type ===
      "professional_history"
    ){

      requireProfessionalAccess(
        function(){

          renderProfessionalHistory();

          applyAnnuaireSurface();
        }
      );

      return;
    }

    if(
      type ===
      "professional_notebook"
    ){

      requireProfessionalAccess(
        function(){

          renderProfessionalNotebook();

          applyAnnuaireSurface();
        }
      );

      return;
    }

    if(
      type ===
      "professional_followed"
    ){

      requireProfessionalAccess(
        function(){

          renderProfessionalFollowed();

          applyAnnuaireSurface();
        }
      );

      return;
    }

    if(
      type ===
      "professional_information"
    ){

      requireProfessionalAccess(
        function(){

          renderProfessionalInformation(
            data
          );

          applyAnnuaireSurface();
        }
      );

      return;
    }

    if(
      type ===
      "professional_subscription"
    ){

      requireProfessionalAccess(
        function(){

          renderProfessionalSubscription();

          applyAnnuaireSurface();
        }
      );

      return;
    }

    if(
      type ===
      "bercy"
    ){

      requireProfessionalAccess(
        function(){

          renderBercy();

          applyAnnuaireSurface();
        }
      );

      return;
    }

    /*
     * Vue inconnue :
     * retour propre à l'accueil.
     */

    State.stack =
      [];

    State.current = {

      type:
        "home",

      data:
        {}

    };

    renderHome();

    applyAnnuaireSurface();
  }

  /* =======================================================
     56. API PUBLIQUE DE L'ANNUAIRE
     ======================================================= */

  Annuaire.VERSION =
    VERSION;

  Annuaire.openHome =
    resetNavigation;

  Annuaire.goBack =
    goBack;

  Annuaire.getCurrentCommune =
    getCurrentCommune;

  Annuaire.loadEntities =
    loadEntities;

  Annuaire.getEntityById =
    getEntityById;

  Annuaire.getOpenStatus =
    getEntityOpenStatus;

  Annuaire.openSearch =
    function(query){

      const clean =
        String(
          query || ""
        ).trim();

      if(!clean){

        resetNavigation();

        return;
      }

      runSearch({

        query:
          clean,

        trade:
          "",

        category:
          "",

        commune:
          getCurrentCommune(),

        zone:
          "commune",

        professional:
          false,

        countryCode:
          "FR",

        country:
          "France"

      });
    };

  Annuaire.openCategory =
    function(categoryId){

      State.stack =
        [];

      State.current = {

        type:
          "home",

        data:
          {}

      };

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

  Annuaire.openCitizenActions =
    function(){

      navigate(
        "citizen_actions",
        {}
      );
    };

  Annuaire.openProfessionalDashboard =
    function(){

      requireProfessionalAccess(
        function(){

          State.stack =
            [];

          State.current = {

            type:
              "professional",

            data:
              {}

          };

          renderCurrentView();
        }
      );
    };

  /* =======================================================
     57. RECHERCHE PROFESSIONNELLE EXPOSÉE
     ======================================================= */

  Annuaire.openProfessionalSearch =
    function(){

      requireProfessionalAccess(
        function(){

          navigate(
            "professional_search",
            {}
          );
        }
      );
    };

  Annuaire.searchProfessional =
    function(options){

      options =
        options || {};

      requireProfessionalAccess(
        function(){

          const zone =
            String(
              options.zone ||
              "commune"
            );

          const extended =
            (
              zone ===
              "departement" ||

              zone ===
              "region" ||

              zone ===
              "france" ||

              zone ===
              "europe"
            );

          const execute =
            function(){

              runSearch({

                query:
                  String(
                    options.query ||
                    ""
                  ).trim(),

                trade:
                  String(
                    options.trade ||
                    ""
                  ).trim(),

                category:
                  String(
                    options.category ||
                    ""
                  ).trim(),

                commune:
                  String(
                    options.commune ||
                    getCurrentCommune()
                  ).trim(),

                zone:
                  zone,

                professional:
                  true,

                countryCode:
                  String(
                    options.countryCode ||
                    "FR"
                  )
                  .toUpperCase(),

                country:
                  String(
                    options.country ||
                    "France"
                  )

              });
            };

          if(extended){

            requireExtendedSubscription(
              execute
            );

            return;
          }

          execute();
        }
      );
    };

  /* =======================================================
     58. AGENT DE MISE À JOUR OFFICIEL
     ======================================================= */

  Annuaire.UpdateAgent.getState =
    function(){

      return loadJson(
        STORAGE.updateState,
        {
          lastRun:0,
          results:[]
        }
      );
    };

  Annuaire.UpdateAgent.isReady =
    function(){

      const provider =
        getOfficialProvider();

      return !!(
        provider &&
        typeof provider
          .refreshTerritory ===
          "function" &&
        typeof provider
          .getAuthorizedTerritories ===
          "function"
      );
    };

  /*
   * Cette fonction pourra être appelée
   * par le serveur ou par le futur orchestrateur.
   *
   * Le navigateur ne lance jamais
   * un balayage massif de la France ou de l'Europe.
   */

  Annuaire.UpdateAgent.refresh =
    async function(){

      if(
        !Annuaire.UpdateAgent
          .isReady()
      ){

        return {

          ready:
            false,

          message:
            "Fournisseur officiel non raccordé"

        };
      }

      return await Annuaire.UpdateAgent
        .run();
    };

  /* =======================================================
     59. COMPATIBILITÉ AVEC ENTREPRISE.JS
     ======================================================= */

  if(
    typeof module.registerScreen ===
    "function"
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

            State.stack =
              [];

            State.current = {

              type:
                "professional",

              data:
                {}

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

          State.stack =
            [];

          State.current = {

            type:
              "professional",

            data:
              {}

          };

          renderCurrentView();
        }
      );
    };

  /* =======================================================
     60. SCHÉMA / INITIALISATION
     ======================================================= */

  const previousSchema =
    loadJson(
      STORAGE.schema,
      {}
    );

  saveJson(
    STORAGE.schema,
    {

      version:
        VERSION,

      initializedAt:
        previousSchema
          .initializedAt ||
        Date.now(),

      updatedAt:
        Date.now(),

      architecture:
        "provider_ready",

      publicScope:
        "territorial",

      professionalScopes:[
        "commune",
        "proche",
        "departement",
        "region",
        "france",
        "europe"
      ],

      officialProviderConnected:
        Annuaire.Agent
          .isOfficialProviderReady(),

      updateAgentConnected:
        Annuaire.UpdateAgent
          .isReady()

    }
  );

  /* =======================================================
     61. CONTRÔLE DE COHÉRENCE AU CHARGEMENT
     ======================================================= */

  const requiredFunctions = [

    "renderHome",
    "renderCategory",
    "renderTrade",
    "renderResults",
    "renderEntity",
    "renderHistory",
    "renderFavorites",
    "renderViewed",
    "renderCitizenActions",
    "renderProfessionalHome",
    "renderProfessionalSearch"

  ];

  const missingFunctions =
    requiredFunctions
      .filter(
        function(name){

          try{

            return (
              eval(
                "typeof " +
                name
              ) !==
              "function"
            );

          }catch(error){

            return true;
          }
        }
      );

  if(
    missingFunctions.length
  ){

    console.error(
      "Bo'CitéArt Annuaire V6 : fonctions manquantes :",
      missingFunctions
    );

  }else{

    console.log(
      "✅ Bo'CitéArt — Annuaire V6 prêt"
    );
  }

  console.log(
    "✅ Annuaire public territorial préparé"
  );

  console.log(
    "✅ Annuaire professionnel France / Europe préparé"
  );

  console.log(
    "✅ Sécurité compte professionnel raccordée"
  );

  console.log(
    "✅ Abonnement recherche étendue préparé"
  );

  console.log(
    "✅ Agent de mise à jour prêt pour fournisseur officiel"
  );

})();
