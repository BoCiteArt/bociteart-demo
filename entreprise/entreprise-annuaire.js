/* =========================================================
   BO'CITÉART — ANNUAIRE
   VERSION CONSOLIDÉE

   Annuaire public local
   Recherche par activité et métier
   Recherche réseau légère à la demande
   Fiches établissements
   Historique
   Favoris
   Consultés récemment
   Appréciations locales
   Espace professionnel sécurisé
   Carnet professionnel
   Entreprises suivies
   Préparation agent IA / serveur

   IMPORTANT :
   - aucun chargement massif au démarrage
   - aucune récupération de 101 pages
   - le réseau est interrogé uniquement à la demande
   - la sécurité générale reste gérée par
     window.BoCiteArtRegistration
   ========================================================= */

(function(){

"use strict";


/* =========================================================
   MODULE
   ========================================================= */

window.BociteEntreprise =
  window.BociteEntreprise || {};

const module =
  window.BociteEntreprise;

const annuaire =
  module.Annuaire =
    module.Annuaire || {};


/* =========================================================
   STOCKAGE
   ========================================================= */

const STORAGE = {

  entities:
    "bociteart_annuaire_entities_v2",

  searchHistory:
    "bociteart_annuaire_search_history_v2",

  favorites:
    "bociteart_annuaire_favorites_v2",

  viewed:
    "bociteart_annuaire_viewed_v2",

  ratings:
    "bociteart_annuaire_ratings_v2",

  professionalHistory:
    "bociteart_annuaire_professional_history_v2",

  notebook:
    "bociteart_annuaire_professional_notebook_v2",

  followed:
    "bociteart_annuaire_followed_v2"
};


/* =========================================================
   LIMITES
   ========================================================= */

const MAX_SEARCH_HISTORY =
  20;

const MAX_VIEWED_HISTORY =
  20;

const MAX_PROFESSIONAL_HISTORY =
  30;

const MAX_NETWORK_RESULTS =
  20;


/* =========================================================
   OUTILS GÉNÉRAUX
   ========================================================= */

function safeArray(
  value
){

  return Array.isArray(value)
    ? value
    : [];
}


function safeObject(
  value
){

  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  )
    ? value
    : {};
}


function getElement(
  id
){

  return document.getElementById(
    id
  );
}


function normalizeText(
  value
){

  return String(
    value || ""
  )
  .normalize("NFD")
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


function uniqueStrings(
  values
){

  const seen =
    new Set();

  return safeArray(
    values
  )
  .map(
    function(value){

      return String(
        value || ""
      ).trim();
    }
  )
  .filter(
    function(value){

      if(!value){
        return false;
      }

      const key =
        normalizeText(
          value
        );

      if(
        !key ||
        seen.has(key)
      ){
        return false;
      }

      seen.add(
        key
      );

      return true;
    }
  );
}


function createId(
  prefix
){

  return (
    String(
      prefix ||
      "annuaire"
    ) +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .slice(2,10)
  );
}


/* =========================================================
   LOCALSTORAGE
   ========================================================= */

function readStorage(
  key,
  fallback
){

  try{

    const raw =
      localStorage.getItem(
        key
      );

    if(
      raw === null ||
      raw === undefined ||
      raw === ""
    ){

      return fallback;
    }

    return JSON.parse(
      raw
    );

  }catch(error){

    console.warn(
      "Bo'CitéArt Annuaire : lecture stockage impossible.",
      key,
      error
    );

    return fallback;
  }
}


function writeStorage(
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
      "Bo'CitéArt Annuaire : écriture stockage impossible.",
      key,
      error
    );

    return false;
  }
}


/* =========================================================
   COMMUNE COURANTE
   ========================================================= */

function getCurrentCommune(){

  /*
    1 — Commune déclarée lors de l'inscription.
  */

  try{

    const registration =
      window.BoCiteArtRegistration;

    if(
      registration &&
      typeof registration.getDeclaredCommune ===
        "function"
    ){

      const declared =
        String(
          registration.getDeclaredCommune() ||
          ""
        ).trim();

      if(declared){
        return declared;
      }
    }

  }catch(error){

    console.warn(
      "Annuaire : commune d'inscription indisponible.",
      error
    );
  }


  /*
    2 — Ancien stockage de configuration ville.
  */

  try{

    const config =
      JSON.parse(
        localStorage.getItem(
          "bociteart_city_config_v1"
        ) || "{}"
      );

    const configured =
      String(
        config.cityName ||
        ""
      ).trim();

    if(configured){
      return configured;
    }

  }catch(error){
    /* rien */
  }


  /*
    3 — Commune de démonstration.
  */

  return "Wattignies";
}


/* =========================================================
   NORMALISATION D'UNE FICHE
   ========================================================= */

function sanitizeEntity(
  source
){

  source =
    safeObject(
      source
    );

  const keywords =
    uniqueStrings(
      source.keywords
    );

  const id =
    String(
      source.id ||
      source.siret ||
      source.siren ||
      createId(
        "entity"
      )
    );

  return {

    id:
      id,

    siren:
      String(
        source.siren ||
        ""
      ),

    siret:
      String(
        source.siret ||
        ""
      ),

    rpps:
      String(
        source.rpps ||
        ""
      ),

    name:
      String(
        source.name ||
        source.nom ||
        source.nomComplet ||
        source.raisonSociale ||
        "Établissement"
      ).trim(),

    kind:
      String(
        source.kind ||
        source.type ||
        "entreprise"
      ).trim(),

    category:
      String(
        source.category ||
        source.categorie ||
        ""
      ).trim(),

    trade:
      String(
        source.trade ||
        source.metier ||
        ""
      ).trim(),

    activity:
      String(
        source.activity ||
        source.activite ||
        ""
      ).trim(),

    keywords:
      keywords,

    address:
      String(
        source.address ||
        source.adresse ||
        ""
      ).trim(),

    postalCode:
      String(
        source.postalCode ||
        source.codePostal ||
        ""
      ).trim(),

    commune:
      String(
        source.commune ||
        source.city ||
        ""
      ).trim(),

    phone:
      String(
        source.phone ||
        source.telephone ||
        ""
      ).trim(),

    email:
      String(
        source.email ||
        ""
      ).trim(),

    website:
      String(
        source.website ||
        source.site ||
        source.url ||
        ""
      ).trim(),

    latitude:
      Number.isFinite(
        Number(
          source.latitude
        )
      )
        ? Number(
            source.latitude
          )
        : null,

    longitude:
      Number.isFinite(
        Number(
          source.longitude
        )
      )
        ? Number(
            source.longitude
          )
        : null,

    openingHours:
      safeObject(
        source.openingHours
      ),

    source:
      String(
        source.source ||
        "Bo'CitéArt"
      ),

    network:
      Boolean(
        source.network
      ),

    updatedAt:
      String(
        source.updatedAt ||
        new Date().toISOString()
      )
  };
}


/* =========================================================
   FUSION DE DEUX FICHES
   ========================================================= */

function mergeEntity(
  current,
  incoming
){

  current =
    sanitizeEntity(
      current
    );

  incoming =
    sanitizeEntity(
      incoming
    );

  const merged =
    Object.assign(
      {},
      current
    );

  [
    "siren",
    "siret",
    "rpps",
    "name",
    "kind",
    "category",
    "trade",
    "activity",
    "address",
    "postalCode",
    "commune",
    "phone",
    "email",
    "website",
    "source"
  ]
  .forEach(
    function(key){

      if(
        String(
          incoming[key] ||
          ""
        ).trim()
      ){

        merged[key] =
          incoming[key];
      }
    }
  );


  if(
    incoming.latitude !==
    null
  ){

    merged.latitude =
      incoming.latitude;
  }


  if(
    incoming.longitude !==
    null
  ){

    merged.longitude =
      incoming.longitude;
  }


  merged.keywords =
    uniqueStrings(
      []
      .concat(
        safeArray(
          current.keywords
        )
      )
      .concat(
        safeArray(
          incoming.keywords
        )
      )
    );


  merged.openingHours =
    Object.keys(
      incoming.openingHours ||
      {}
    ).length
      ? incoming.openingHours
      : current.openingHours;


  merged.network =
    Boolean(
      current.network ||
      incoming.network
    );


  merged.updatedAt =
    new Date().toISOString();


  return merged;
}


/* =========================================================
   IDENTIFICATION DES DOUBLONS
   ========================================================= */

function getEntityIdentity(
  entity
){

  entity =
    safeObject(
      entity
    );

  if(entity.siret){

    return (
      "siret:" +
      String(
        entity.siret
      )
    );
  }

  if(entity.siren){

    return (
      "siren:" +
      String(
        entity.siren
      )
    );
  }

  if(entity.rpps){

    return (
      "rpps:" +
      String(
        entity.rpps
      )
    );
  }

  return (
    "name:" +
    normalizeText(
      entity.name
    ) +
    "|" +
    normalizeText(
      entity.commune
    ) +
    "|" +
    normalizeText(
      entity.address
    )
  );
}


/* =========================================================
   CHARGEMENT DES ÉTABLISSEMENTS
   ========================================================= */

function loadEntities(){

  return safeArray(
    readStorage(
      STORAGE.entities,
      []
    )
  )
  .map(
    sanitizeEntity
  );
}


function saveEntities(
  rows
){

  const sanitized =
    safeArray(
      rows
    )
    .map(
      sanitizeEntity
    );

  writeStorage(
    STORAGE.entities,
    sanitized
  );

  return sanitized;
}


/* =========================================================
   FUSION DES DONNÉES RÉSEAU
   ========================================================= */

function mergeNetworkEntities(
  rows
){

  const current =
    loadEntities();

  const map =
    new Map();


  current.forEach(
    function(entity){

      map.set(
        getEntityIdentity(
          entity
        ),
        entity
      );
    }
  );


  safeArray(
    rows
  )
  .map(
    sanitizeEntity
  )
  .forEach(
    function(entity){

      const identity =
        getEntityIdentity(
          entity
        );

      if(
        map.has(
          identity
        )
      ){

        map.set(
          identity,
          mergeEntity(
            map.get(
              identity
            ),
            entity
          )
        );

      }else{

        map.set(
          identity,
          entity
        );
      }
    }
  );


  const merged =
    Array.from(
      map.values()
    );


  saveEntities(
    merged
  );

  return merged;
}


/* =========================================================
   RECHERCHE LOCALE
   ========================================================= */

function buildEntitySearchText(
  entity
){

  return normalizeText(
    [
      entity.name,
      entity.kind,
      entity.category,
      entity.trade,
      entity.activity,
      entity.commune,
      entity.postalCode
    ]
    .concat(
      safeArray(
        entity.keywords
      )
    )
    .join(" ")
  );
}


function searchEntities(
  query,
  options
){

  options =
    safeObject(
      options
    );

  const cleanQuery =
    normalizeText(
      query
    );

  if(!cleanQuery){
    return [];
  }


  const words =
    cleanQuery
      .split(/\s+/)
      .filter(Boolean);


  const currentCommune =
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
            !currentCommune ||
            normalizeText(
              entity.commune
            ) ===
            currentCommune
          );
        }
      );
  }


  rows =
    rows.filter(
      function(entity){

        const text =
          buildEntitySearchText(
            entity
          );

        return words.every(
          function(word){

            return text.includes(
              word
            );
          }
        );
      }
    );


  rows.sort(
    function(a,b){

      const aName =
        normalizeText(
          a.name
        );

      const bName =
        normalizeText(
          b.name
        );

      const aExact =
        aName.includes(
          cleanQuery
        )
          ? 1
          : 0;

      const bExact =
        bName.includes(
          cleanQuery
        )
          ? 1
          : 0;

      if(
        aExact !==
        bExact
      ){

        return (
          bExact -
          aExact
        );
      }

      return aName.localeCompare(
        bName,
        "fr"
      );
    }
  );


  return rows;
}


/* =========================================================
   RECHERCHE PAR MÉTIER
   ========================================================= */

function searchEntitiesByTrade(
  trade
){

  const cleanTrade =
    normalizeText(
      trade
    );

  if(!cleanTrade){
    return [];
  }

  const commune =
    normalizeText(
      getCurrentCommune()
    );

  return loadEntities()
    .filter(
      function(entity){

        if(
          commune &&
          normalizeText(
            entity.commune
          ) !==
          commune
        ){

          return false;
        }

        const text =
          buildEntitySearchText(
            entity
          );

        return text.includes(
          cleanTrade
        );
      }
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
    );
}


/* =========================================================
   HISTORIQUE DES RECHERCHES
   ========================================================= */

function loadSearchHistory(){

  return safeArray(
    readStorage(
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
      query || ""
    ).trim();

  if(!cleanQuery){
    return;
  }


  let rows =
    loadSearchHistory();


  rows =
    rows.filter(
      function(item){

        return (
          normalizeText(
            item.query
          ) !==
          normalizeText(
            cleanQuery
          ) ||
          normalizeText(
            item.commune
          ) !==
          normalizeText(
            commune
          )
        );
      }
    );


  rows.unshift({

    id:
      createId(
        "search"
      ),

    query:
      cleanQuery,

    commune:
      String(
        commune || ""
      ),

    createdAt:
      new Date().toISOString()
  });


  rows =
    rows.slice(
      0,
      MAX_SEARCH_HISTORY
    );


  writeStorage(
    STORAGE.searchHistory,
    rows
  );
}


/* =========================================================
   FAVORIS
   ========================================================= */

function loadFavorites(){

  return uniqueStrings(
    readStorage(
      STORAGE.favorites,
      []
    )
  );
}


function isFavorite(
  entityId
){

  return loadFavorites()
    .includes(
      String(
        entityId || ""
      )
    );
}


function toggleFavorite(
  entityId
){

  const id =
    String(
      entityId || ""
    );

  if(!id){
    return false;
  }


  let rows =
    loadFavorites();


  if(
    rows.includes(
      id
    )
  ){

    rows =
      rows.filter(
        function(item){

          return item !== id;
        }
      );

  }else{

    rows.unshift(
      id
    );
  }


  writeStorage(
    STORAGE.favorites,
    rows
  );

  return rows.includes(
    id
  );
}


/* =========================================================
   CONSULTÉS RÉCEMMENT
   ========================================================= */

function loadViewedHistory(){

  return safeArray(
    readStorage(
      STORAGE.viewed,
      []
    )
  );
}


function addViewedEntity(
  entity
){

  if(
    !entity ||
    !entity.id
  ){
    return;
  }


  let rows =
    loadViewedHistory();


  rows =
    rows.filter(
      function(item){

        return (
          String(
            item.id || ""
          ) !==
          String(
            entity.id
          )
        );
      }
    );


  rows.unshift({

    id:
      entity.id,

    name:
      entity.name,

    activity:
      entity.activity ||
      entity.trade ||
      "",

    commune:
      entity.commune ||
      "",

    viewedAt:
      new Date().toISOString()
  });


  rows =
    rows.slice(
      0,
      MAX_VIEWED_HISTORY
    );


  writeStorage(
    STORAGE.viewed,
    rows
  );
}


/* =========================================================
   APPRÉCIATIONS LOCALES
   ========================================================= */

function loadRatings(){

  return safeArray(
    readStorage(
      STORAGE.ratings,
      []
    )
  );
}


function saveRating(
  entityId,
  score
){

  const id =
    String(
      entityId || ""
    );

  const value =
    Number(
      score
    );


  if(
    !id ||
    !Number.isFinite(
      value
    ) ||
    value < 1 ||
    value > 5
  ){

    return false;
  }


  let rows =
    loadRatings();


  /*
    Pour la démo :
    une appréciation locale par appareil
    et par établissement.

    Une future version serveur pourra
    remplacer ce stockage sans modifier
    l'interface de la fiche.
  */

  const existingIndex =
    rows.findIndex(
      function(item){

        return (
          String(
            item.entityId ||
            ""
          ) ===
          id
        );
      }
    );


  const rating = {

    entityId:
      id,

    score:
      value,

    updatedAt:
      new Date().toISOString()
  };


  if(
    existingIndex >=
    0
  ){

    rows[
      existingIndex
    ] = rating;

  }else{

    rows.push(
      rating
    );
  }


  writeStorage(
    STORAGE.ratings,
    rows
  );

  return true;
}


function getRatingSummary(
  entityId
){

  const ratings =
    loadRatings()
      .filter(
        function(item){

          return (
            String(
              item.entityId ||
              ""
            ) ===
            String(
              entityId ||
              ""
            )
          );
        }
      );


  if(
    !ratings.length
  ){

    return {
      visible:false,
      global:0,
      count:0
    };
  }


  const total =
    ratings.reduce(
      function(sum,item){

        return (
          sum +
          Number(
            item.score || 0
          )
        );
      },
      0
    );


  return {

    visible:true,

    global:
      total /
      ratings.length,

    count:
      ratings.length
  };
}


/* =========================================================
   HISTORIQUE PROFESSIONNEL
   ========================================================= */

function loadProfessionalHistory(){

  return safeArray(
    readStorage(
      STORAGE.professionalHistory,
      []
    )
  );
}


function addProfessionalHistory(
  query
){

  const clean =
    String(
      query || ""
    ).trim();

  if(!clean){
    return;
  }


  let rows =
    loadProfessionalHistory();


  rows =
    rows.filter(
      function(item){

        return (
          normalizeText(
            item.query
          ) !==
          normalizeText(
            clean
          )
        );
      }
    );


  rows.unshift({

    id:
      createId(
        "pro-search"
      ),

    query:
      clean,

    commune:
      getCurrentCommune(),

    createdAt:
      new Date().toISOString()
  });


  rows =
    rows.slice(
      0,
      MAX_PROFESSIONAL_HISTORY
    );


  writeStorage(
    STORAGE.professionalHistory,
    rows
  );
}


/* =========================================================
   CARNET PROFESSIONNEL
   ========================================================= */

function loadNotebook(){

  return safeArray(
    readStorage(
      STORAGE.notebook,
      []
    )
  );
}


function addNotebookEntity(
  entity
){

  if(
    !entity ||
    !entity.id
  ){

    return false;
  }


  let rows =
    loadNotebook();


  rows =
    rows.filter(
      function(item){

        return (
          String(
            item.id || ""
          ) !==
          String(
            entity.id
          )
        );
      }
    );


  rows.unshift({

    id:
      entity.id,

    name:
      entity.name,

    activity:
      entity.activity ||
      entity.trade ||
      "",

    commune:
      entity.commune ||
      "",

    addedAt:
      new Date().toISOString()
  });


  writeStorage(
    STORAGE.notebook,
    rows
  );

  return true;
}


/* =========================================================
   ENTREPRISES SUIVIES
   ========================================================= */

function loadFollowed(){

  return safeArray(
    readStorage(
      STORAGE.followed,
      []
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
            item.id || ""
          ) ===
          String(
            entityId || ""
          )
        );
      }
    );
}


function toggleFollowed(
  entity
){

  if(
    !entity ||
    !entity.id
  ){

    return false;
  }


  let rows =
    loadFollowed();


  const already =
    rows.some(
      function(item){

        return (
          String(
            item.id || ""
          ) ===
          String(
            entity.id
          )
        );
      }
    );


  if(already){

    rows =
      rows.filter(
        function(item){

          return (
            String(
              item.id || ""
            ) !==
            String(
              entity.id
            )
          );
        }
      );

  }else{

    rows.unshift({

      id:
        entity.id,

      name:
        entity.name,

      activity:
        entity.activity ||
        entity.trade ||
        "",

      commune:
        entity.commune ||
        "",

      followedAt:
        new Date().toISOString()
    });
  }


  writeStorage(
    STORAGE.followed,
    rows
  );


  return !already;
}


/* =========================================================
   RÉCUPÉRATION D'UNE FICHE
   ========================================================= */

function getEntityById(
  entityId
){

  const id =
    String(
      entityId || ""
    );

  return loadEntities()
    .find(
      function(entity){

        return (
          String(
            entity.id || ""
          ) ===
          id
        );
      }
    ) || null;
}


/* =========================================================
   STATUT OUVERT / FERMÉ
   ========================================================= */

function getOpenStatus(
  entity
){

  /*
    Les horaires officiels ne sont pas
    toujours disponibles dans les données
    publiques utilisées par la démo.

    On n'invente donc jamais un statut.
  */

  if(
    !entity ||
    !entity.openingHours ||
    !Object.keys(
      entity.openingHours
    ).length
  ){

    return "";
  }


  return "";
}


/* =========================================================
   BADGES
   ========================================================= */

function getBadgesHtml(
  entity
){

  const badges =
    [];


  if(
    normalizeText(
      entity.commune
    ) ===
    normalizeText(
      getCurrentCommune()
    )
  ){

    badges.push(
      "Local"
    );
  }


  if(
    entity.network
  ){

    badges.push(
      "Réseau"
    );
  }


  if(
    entity.phone
  ){

    badges.push(
      "Contact"
    );
  }


  if(
    entity.website
  ){

    badges.push(
      "Site"
    );
  }


  if(
    !badges.length
  ){

    return "";
  }


  return `

    <div
      style="
        display:flex;
        flex-wrap:wrap;
        gap:5px;
      ">

      ${
        badges
          .map(
            function(label){

              return `

                <span
                  style="
                    display:inline-block;
                    padding:3px 7px;
                    border:1px solid #2f5d46;
                    border-radius:999px;
                    color:#2f5d46;
                    background:#fff;
                    font-size:11px;
                    font-weight:700;
                  ">
                  ${escapeHtml(label)}
                </span>

              `;
            }
          )
          .join("")
      }

    </div>

  `;
}

/* =========================================================
   RÉSEAU LÉGER
   UNE RECHERCHE = UNE REQUÊTE
   ========================================================= */

function getCurrentPostalCode(){

  try{

    const config =
      JSON.parse(
        localStorage.getItem(
          "bociteart_city_config_v1"
        ) || "{}"
      );

    return String(
      config.postalCode ||
      ""
    ).trim();

  }catch(error){

    return "";
  }
}


function getCurrentInseeCode(){

  try{

    const config =
      JSON.parse(
        localStorage.getItem(
          "bociteart_city_config_v1"
        ) || "{}"
      );

    const direct =
      String(
        config.inseeCode ||
        ""
      ).trim();

    if(direct){
      return direct;
    }

  }catch(error){
    /* rien */
  }


  const known = {

    wattignies:
      "59648"

  };


  const key =
    normalizeText(
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


/* =========================================================
   CONFIGURATION RÉSEAU
   ========================================================= */

function getNetworkCityConfig(){

  return {

    cityName:
      getCurrentCommune(),

    postalCode:
      getCurrentPostalCode(),

    inseeCode:
      getCurrentInseeCode()

  };
}


/* =========================================================
   CATÉGORIE D'UNE FICHE RÉSEAU
   ========================================================= */

function getNetworkCategory(
  activity
){

  const clean =
    normalizeText(
      activity
    );


  if(
    clean.includes(
      "restaurant"
    ) ||
    clean.includes(
      "restauration"
    )
  ){

    return "restaurants";
  }


  if(
    clean.includes(
      "boulanger"
    ) ||
    clean.includes(
      "boucher"
    ) ||
    clean.includes(
      "epicer"
    ) ||
    clean.includes(
      "aliment"
    )
  ){

    return "commerces";
  }


  if(
    clean.includes(
      "medecin"
    ) ||
    clean.includes(
      "dentiste"
    ) ||
    clean.includes(
      "infirm"
    ) ||
    clean.includes(
      "pharmac"
    ) ||
    clean.includes(
      "kinesither"
    )
  ){

    return "sante";
  }


  if(
    clean.includes(
      "plomb"
    ) ||
    clean.includes(
      "electric"
    ) ||
    clean.includes(
      "macon"
    ) ||
    clean.includes(
      "menuiser"
    ) ||
    clean.includes(
      "couverture"
    )
  ){

    return "artisans";
  }


  return "entreprises";
}


/* =========================================================
   CONVERSION D'UN ÉTABLISSEMENT RÉSEAU
   ========================================================= */

function mapNetworkEntity(
  company,
  establishment,
  query
){

  company =
    safeObject(
      company
    );

  establishment =
    safeObject(
      establishment
    );


  const activity =
    String(
      establishment.libelle_activite_principale ||
      company.libelle_activite_principale ||
      ""
    ).trim();


  const name =
    String(
      company.nom_complet ||
      company.nom_raison_sociale ||
      company.nom_commercial ||
      "Établissement"
    ).trim();


  const address =
    [
      establishment.numero_voie,
      establishment.indice_repetition,
      establishment.type_voie,
      establishment.libelle_voie
    ]
    .filter(Boolean)
    .join(" ")
    .trim();


  return sanitizeEntity({

    id:
      establishment.siret ||
      company.siren ||
      createId(
        "network"
      ),

    siren:
      company.siren ||
      "",

    siret:
      establishment.siret ||
      "",

    name:
      name,

    kind:
      "entreprise",

    category:
      getNetworkCategory(
        activity
      ),

    trade:
      activity,

    activity:
      activity,

    keywords:[
      query,
      activity,
      company.nom_complet,
      company.nom_raison_sociale,
      company.nom_commercial
    ],

    address:
      establishment.adresse ||
      address ||
      "",

    postalCode:
      establishment.code_postal ||
      "",

    commune:
      establishment.libelle_commune ||
      getCurrentCommune(),

    phone:
      "",

    email:
      "",

    website:
      "",

    latitude:
      establishment.latitude,

    longitude:
      establishment.longitude,

    source:
      "API Recherche d'Entreprises — État",

    network:
      true

  });
}


/* =========================================================
   RECHERCHE RÉSEAU CIBLÉE
   ========================================================= */

function searchNetworkForQuery(
  query
){

  const cleanQuery =
    String(
      query || ""
    ).trim();


  if(!cleanQuery){

    return Promise.resolve(
      []
    );
  }


  const city =
    getNetworkCityConfig();


  if(
    !city.inseeCode &&
    !city.postalCode
  ){

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
    city.inseeCode
  ){

    params.set(
      "code_commune",
      city.inseeCode
    );

  }else{

    params.set(
      "code_postal",
      city.postalCode
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
    String(
      MAX_NETWORK_RESULTS
    )
  );


  params.set(
    "limite_matching_etablissements",
    String(
      MAX_NETWORK_RESULTS
    )
  );


  const url =
    "https://recherche-entreprises.api.gouv.fr/search?" +
    params.toString();


  return fetch(
    url,
    {
      method:
        "GET",

      headers:{
        Accept:
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

      const results =
        [];


      safeArray(
        data.results
      )
      .forEach(
        function(company){

          let establishments =
            safeArray(
              company.matching_etablissements
            );


          if(
            !establishments.length &&
            company.siege
          ){

            establishments = [
              company.siege
            ];
          }


          establishments.forEach(
            function(establishment){

              const establishmentCommune =
                String(
                  establishment.commune ||
                  ""
                ).trim();


              const establishmentPostalCode =
                String(
                  establishment.code_postal ||
                  ""
                ).trim();


              if(
                city.inseeCode &&
                establishmentCommune &&
                establishmentCommune !==
                city.inseeCode
              ){

                return;
              }


              if(
                !city.inseeCode &&
                city.postalCode &&
                establishmentPostalCode &&
                establishmentPostalCode !==
                city.postalCode
              ){

                return;
              }


              results.push(
                mapNetworkEntity(
                  company,
                  establishment,
                  cleanQuery
                )
              );
            }
          );
        }
      );


      const map =
        new Map();


      results.forEach(
        function(entity){

          map.set(
            getEntityIdentity(
              entity
            ),
            entity
          );
        }
      );


      const unique =
        Array.from(
          map.values()
        );


      console.log(
        "✅ Recherche réseau Bo'CitéArt :",
        cleanQuery,
        "—",
        unique.length,
        "résultat(s)"
      );


      return unique;
    }
  );
}


/* =========================================================
   AGENT IA — POINT DE RACCORDEMENT
   ========================================================= */

annuaire.Agent =
  annuaire.Agent || {};


annuaire.Agent.isConnected =
function(){

  return Boolean(
    window.BociteAnnuaireAIProvider &&
    (
      typeof window.BociteAnnuaireAIProvider.search ===
        "function" ||
      typeof window.BociteAnnuaireAIProvider.enrich ===
        "function"
    )
  );
};


annuaire.Agent.search =
function(
  query
){

  const provider =
    window.BociteAnnuaireAIProvider;


  if(
    provider &&
    typeof provider.search ===
      "function"
  ){

    return Promise
      .resolve(
        provider.search({

          query:
            String(
              query || ""
            ).trim(),

          commune:
            getCurrentCommune(),

          postalCode:
            getCurrentPostalCode(),

          inseeCode:
            getCurrentInseeCode()

        })
      )
      .then(
        function(rows){

          return safeArray(
            rows
          )
          .map(
            sanitizeEntity
          );
        }
      );
  }


  return searchNetworkForQuery(
    query
  );
};


annuaire.Agent.enrichEntity =
function(
  entity
){

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
    .then(
      function(result){

        if(
          !result ||
          typeof result !==
            "object"
        ){

          return entity;
        }


        return mergeEntity(
          entity,
          result
        );
      }
    )
    .catch(
      function(error){

        console.warn(
          "Bo'CitéArt : enrichissement IA indisponible.",
          error
        );

        return entity;
      }
    );
};


/* =========================================================
   MÉTIERS
   ========================================================= */

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


/* =========================================================
   TERMES DE RECHERCHE MÉTIERS
   ========================================================= */

const TRADE_SEARCH_TERMS = {

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
    "masseur kinésithérapeute"
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
    "pédicure podologue"
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
    "laboratoire de biologie médicale"
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
    "électricité"
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
    "maçonnerie"
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
    "travaux"
  ],

  "Garages automobiles":[
    "garage automobile",
    "réparation automobile"
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
    "contrôle technique"
  ],

  "Motos":[
    "moto",
    "motocycle"
  ],

  "Cycles":[
    "vélo",
    "cycle",
    "bicyclette"
  ],

  "Véhicules utilitaires":[
    "véhicule utilitaire"
  ],

  "Poids lourds":[
    "poids lourd",
    "camion"
  ],

  "Restaurants":[
    "restaurant",
    "restauration"
  ],

  "Boulangeries":[
    "boulangerie",
    "boulanger"
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
    "débit de boissons"
  ],

  "Épiceries":[
    "épicerie",
    "alimentation générale"
  ],

  "Commerces alimentaires":[
    "commerce alimentaire",
    "alimentation"
  ],

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

  "Hôtels":[
    "hôtel",
    "hôtellerie"
  ],

  "Chambres d'hôtes":[
    "chambre d'hôtes"
  ],

  "Gîtes":[
    "gîte"
  ],

  "Locations de courte durée":[
    "location courte durée",
    "hébergement touristique"
  ],

  "Autres hébergements":[
    "hébergement"
  ]

};


/* =========================================================
   RECHERCHE LOCALE PAR MÉTIER
   ========================================================= */

function searchLocalTrade(
  trade
){

  const terms =
    uniqueStrings(
      safeArray(
        TRADE_SEARCH_TERMS[
          trade
        ]
      )
      .concat(
        [trade]
      )
    )
    .map(
      normalizeText
    );


  const commune =
    normalizeText(
      getCurrentCommune()
    );


  return loadEntities()
    .filter(
      function(entity){

        if(
          commune &&
          normalizeText(
            entity.commune
          ) !==
          commune
        ){

          return false;
        }


        const text =
          buildEntitySearchText(
            entity
          );


        const match =
          terms.some(
            function(term){

              return (
                term &&
                text.includes(
                  term
                )
              );
            }
          );


        if(!match){
          return false;
        }


        if(
          trade ===
          "Dentistes"
        ){

          const excluded = [

            "laboratoire dentaire",
            "prothese dentaire",
            "prothesiste dentaire"

          ];


          if(
            excluded.some(
              function(term){

                return text.includes(
                  normalizeText(
                    term
                  )
                );
              }
            )
          ){

            return false;
          }
        }


        return true;
      }
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
    );
}


/* =========================================================
   CATÉGORIES PRINCIPALES
   ========================================================= */

const CATEGORIES = [

  {
    id:
      "commerces",

    title:
      "Commerces",

    subtitle:
      "Boutiques • alimentation • proximité"
  },

  {
    id:
      "restaurants",

    title:
      "Restaurants",

    subtitle:
      "Restaurants • cafés • traiteurs"
  },

  {
    id:
      "artisans",

    title:
      "Artisans",

    subtitle:
      "Travaux • réparation • savoir-faire"
  },

  {
    id:
      "sante",

    title:
      "Santé",

    subtitle:
      "Médecins • soins • professionnels"
  },

  {
    id:
      "entreprises",

    title:
      "Entreprises",

    subtitle:
      "Industrie • services • compétences"
  },

  {
    id:
      "hebergements",

    title:
      "Hôtels & séjours",

    subtitle:
      "Hôtels • gîtes • hébergements"
  },

  {
    id:
      "services",

    title:
      "Services",

    subtitle:
      "Particuliers • professionnels"
  },

  {
    id:
      "metiers",

    title:
      "Tout voir par métier",

    subtitle:
      "Tous les métiers de votre ville"
  }

];


/* =========================================================
   MODALE
   ========================================================= */

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
    String(
      title || ""
    ) +
    "\n\n" +
    String(
      html || ""
    )
    .replace(
      /<[^>]+>/g,
      " "
    )
  );
}


/* =========================================================
   RENDU
   ========================================================= */

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

      installAnnuaireStyles();

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


/* =========================================================
   STYLES
   ========================================================= */

function installAnnuaireStyles(){

  if(
    getElement(
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

    .bociteAnnuaireRoot{
      color:#111;
      font-family:Arial,sans-serif;
    }

    .bociteAnnuaireTitle{
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.35;
    }

    .bociteAnnuaireText{
      color:#111;
      font-size:14px;
      font-weight:400;
      line-height:1.45;
    }

    .bociteAnnuaireSmall{
      color:#666;
      font-size:12px;
      line-height:1.4;
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

    .bociteAnnuaireRoot .choiceBtn{
      background:#fff !important;
      background-image:none !important;
    }

    .bociteAnnuaireStars{
      display:grid;
      grid-template-columns:
        repeat(5,minmax(0,1fr));
      gap:6px;
    }

    .bociteAnnuaireStars .choiceBtn{
      min-height:45px;
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


/* =========================================================
   LOGO OFFICIEL
   ========================================================= */

function bociteArtLogoText(){

  return `
    <span style="font-weight:900;">
      <span style="color:#2f5d46;">
        Bo'Cité
      </span><span style="color:#b00020;">
        Art
      </span>
    </span>
  `;
}


/* =========================================================
   CARTE RÉSULTAT
   ========================================================= */

function getResultCard(
  entity,
  distance
){

  const rating =
    getRatingSummary(
      entity.id
    );


  const distanceHtml =
    Number.isFinite(
      Number(
        distance
      )
    )
      ? `
          <div
            class="bociteAnnuaireSmall"
            style="margin-top:4px;">
            À ${Number(distance).toFixed(1)} km
          </div>
        `
      : "";


  const ratingHtml =
    rating.visible
      ? `
          <div
            class="bociteAnnuaireSmall"
            style="margin-top:5px;">
            ${rating.global.toFixed(1)} / 5
          </div>
        `
      : "";


  return `

    <div
      class="box bociteAnnuaireResult">

      ${getBadgesHtml(entity)}

      <div
        class="bociteAnnuaireTitle"
        style="margin-top:6px;">
        ${escapeHtml(entity.name)}
      </div>

      ${
        entity.activity ||
        entity.trade
          ? `
              <div
                class="bociteAnnuaireText"
                style="margin-top:4px;">
                ${escapeHtml(
                  entity.activity ||
                  entity.trade
                )}
              </div>
            `
          : ""
      }

      <div
        class="bociteAnnuaireSmall"
        style="margin-top:4px;">
        ${escapeHtml(entity.commune)}
      </div>

      ${distanceHtml}
      ${ratingHtml}

      <div
        class="bociteAnnuaireActions"
        style="margin-top:8px;">

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

      ${
        entity.address
          ? `
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
            `
          : ""
      }

    </div>

  `;
}


/* =========================================================
   ACTIONS CARTE
   ========================================================= */

function callPhone(
  phone
){

  const clean =
    String(
      phone || ""
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


function openRoute(
  address
){

  const clean =
    String(
      address || ""
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
              button.getAttribute(
                "data-id"
              )
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
              button.getAttribute(
                "data-phone"
              )
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
              button.getAttribute(
                "data-address"
              )
            );
          };
      }
    );
}


/* =========================================================
   LANCER UNE RECHERCHE PUBLIQUE
   ========================================================= */

function launchSearch(
  query,
  options
){

  const cleanQuery =
    String(
      query || ""
    ).trim();


  if(!cleanQuery){

    alert(
      "Indiquez un nom, un métier, un produit ou un service."
    );

    return;
  }


  options =
    safeObject(
      options
    );


  addSearchHistory(
    cleanQuery,
    getCurrentCommune()
  );


  const existing =
    searchEntities(
      cleanQuery,
      options
    );


  renderSearchResults(
    cleanQuery,
    existing,
    existing.length === 0
  );


  annuaire.Agent
    .search(
      cleanQuery
    )
    .then(
      function(rows){

        if(
          rows.length
        ){

          mergeNetworkEntities(
            rows
          );
        }


        const refreshed =
          searchEntities(
            cleanQuery,
            options
          );


        renderSearchResults(
          cleanQuery,
          refreshed,
          false
        );
      }
    )
    .catch(
      function(error){

        console.warn(
          "Bo'CitéArt : recherche réseau indisponible.",
          error
        );


        renderSearchResults(
          cleanQuery,
          existing,
          false
        );
      }
    );
}


/* =========================================================
   AFFICHAGE RÉSULTATS PUBLICS
   ========================================================= */

function renderSearchResults(
  query,
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
        Résultats dans ${escapeHtml(getCurrentCommune())}
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
                  bociteArtLogoText() +
                  " vérifie également les données disponibles sur le réseau."
                )
              : (
                  "Aucun établissement correspondant n'a été trouvé pour le moment."
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

 /* =========================================================
   ACCUEIL ANNUAIRE
   ========================================================= */

function getHomeHtml(){

  const commune =
    getCurrentCommune();


  const categoriesHtml =
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
                min-height:88px;
                padding:13px;
                text-align:left;
              ">

              <div class="bociteAnnuaireTitle">
                ${escapeHtml(category.title)}
              </div>

              <div
                class="bociteAnnuaireText"
                style="margin-top:4px;">
                ${escapeHtml(category.subtitle)}
              </div>

            </button>

          `;
        }
      )
      .join("");


  const recent =
    loadSearchHistory()
      .slice(
        0,
        4
      );


  const recentHtml =
    recent.length
      ? recent
          .map(
            function(item){

              return `

                <button
                  type="button"
                  class="choiceBtn annuaireRecentQueryBtn"
                  data-query="${escapeHtml(item.query)}"
                  style="
                    width:100%;
                    margin-top:6px;
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
                    ${escapeHtml(item.commune || commune)}
                  </span>

                </button>

              `;
            }
          )
          .join("")
      : `

          <div class="bociteAnnuaireSmall">
            Vos recherches apparaîtront ici.
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
        Trouvez simplement les commerces,
        entreprises, artisans et professionnels
        de votre ville.
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
        Restaurant • couvreur • médecin • garage • entreprise…
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
      ${categoriesHtml}
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
        id="annuaireHistoryBtn"
        class="choiceBtn"
        type="button">
        Dernières recherches
      </button>

    </div>


    <div
      class="bociteAnnuaireActions"
      style="margin-top:8px;">

      <button
        id="annuaireFavoritesBtn"
        class="choiceBtn"
        type="button">
        Mes favoris
      </button>

      <button
        id="annuaireViewedBtn"
        class="choiceBtn"
        type="button">
        Consultés récemment
      </button>

    </div>


    <button
      id="annuaireLegendBtn"
      class="choiceBtn"
      type="button"
      style="
        width:100%;
        margin-top:8px;
      ">
      Comprendre les repères
    </button>


    <div
      id="annuaireLegendBox"
      class="box"
      style="
        display:none;
        margin-top:8px;
      ">

      <div class="bociteAnnuaireTitle">
        Repères de l'annuaire
      </div>

      <div
        class="bociteAnnuaireText"
        style="margin-top:7px;">

        <strong>Local</strong>
        : établissement situé dans votre commune.

        <br><br>

        <strong>Réseau</strong>
        : information obtenue lors d'une recherche
        sur une source publique disponible.

        <br><br>

        <strong>Contact</strong>
        : numéro de téléphone disponible.

        <br><br>

        <strong>Site</strong>
        : site internet disponible.

      </div>

    </div>


    <div
      class="box"
      style="margin-top:10px;">

      <div class="bociteAnnuaireTitle">
        Recherches récentes
      </div>

      <div style="margin-top:6px;">
        ${recentHtml}
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


/* =========================================================
   OUVERTURE ACCUEIL
   ========================================================= */

function openHome(){

  render(
    "Annuaire de votre ville",
    getHomeHtml(),
    bindHome
  );
}


/* =========================================================
   ACTIONS ACCUEIL
   ========================================================= */

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
      ".annuaireCategoryBtn"
    )
    .forEach(
      function(button){

        button.onclick =
          function(){

            openCategory(
              button.getAttribute(
                "data-category"
              ) ||
              ""
            );
          };
      }
    );


  const nearBtn =
    getElement(
      "annuaireNearBtn"
    );

  if(nearBtn){

    nearBtn.onclick =
      openNearMe;
  }


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

}


/* =========================================================
   OUVERTURE D'UNE CATÉGORIE
   ========================================================= */

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
    "restaurants" ||
    categoryId ===
    "commerces"
  ){

    openTradeFamily(
      "Restaurants & commerces alimentaires",
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

    launchSearch(
      "entreprise"
    );

    return;
  }


  openHome();
}


/* =========================================================
   LISTE DES MÉTIERS D'UNE FAMILLE
   ========================================================= */

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
        Choisissez le métier recherché.
      </div>

    </div>

  `;


  safeArray(
    trades
  )
  .forEach(
    function(trade){

      const count =
        searchLocalTrade(
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
                        ? " professionnels disponibles"
                        : " professionnel disponible"
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
      id="annuaireTradeFamilyBackBtn"
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
          "annuaireTradeFamilyBackBtn"
        );


      if(back){

        back.onclick =
          openHome;
      }
    }
  );
}


/* =========================================================
   RÉSULTATS D'UN MÉTIER
   ========================================================= */

function openTradeResults(
  trade
){

  const existing =
    searchLocalTrade(
      trade
    );


  renderTradeResults(
    trade,
    existing,
    existing.length === 0
  );


  const terms =
    safeArray(
      TRADE_SEARCH_TERMS[
        trade
      ]
    );


  const networkQuery =
    terms[0] ||
    trade;


  annuaire.Agent
    .search(
      networkQuery
    )
    .then(
      function(rows){

        if(
          rows.length
        ){

          mergeNetworkEntities(
            rows
          );
        }


        const refreshed =
          searchLocalTrade(
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


        renderTradeResults(
          trade,
          existing,
          false
        );
      }
    );
}


/* =========================================================
   AFFICHAGE RÉSULTATS MÉTIER
   ========================================================= */

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
                  bociteArtLogoText() +
                  " vérifie les données disponibles sur le réseau."
                )
              : (
                  "Aucun établissement correspondant n'a été trouvé pour le moment."
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


/* =========================================================
   TOUS LES MÉTIERS
   ========================================================= */

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
        Choisissez le métier recherché.
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
            searchLocalTrade(
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


/* =========================================================
   HISTORIQUE PUBLIC DES RECHERCHES
   ========================================================= */

function openSearchHistory(){

  const rows =
    loadSearchHistory();


  let html = `

    <div class="box">

      <div class="bociteAnnuaireTitle">
        Mes dernières recherches
      </div>

      <div
        class="bociteAnnuaireText"
        style="margin-top:6px;">
        Retrouvez rapidement une recherche précédente.
      </div>

    </div>

  `;


  if(
    !rows.length
  ){

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

    rows.forEach(
      function(item){

        html += `

          <button
            type="button"
            class="choiceBtn annuaireHistoryQueryBtn"
            data-query="${escapeHtml(item.query)}"
            style="
              width:100%;
              margin-top:7px;
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
              ${escapeHtml(item.commune || "")}
            </span>

          </button>

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
        margin-top:9px;
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

              writeStorage(
                STORAGE.searchHistory,
                []
              );

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


/* =========================================================
   FAVORIS
   ========================================================= */

function openFavorites(){

  const favoriteIds =
    loadFavorites();


  const entities =
    favoriteIds
      .map(
        getEntityById
      )
      .filter(Boolean);


  let html = `

    <div class="box">

      <div class="bociteAnnuaireTitle">
        Mes favoris
      </div>

      <div
        class="bociteAnnuaireText"
        style="margin-top:6px;">
        Retrouvez rapidement
        les établissements enregistrés.
      </div>

    </div>

  `;


  if(
    !entities.length
  ){

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
      id="annuaireFavoritesClearBtn"
      class="choiceBtn"
      type="button"
      style="
        width:100%;
        margin-top:9px;
      ">
      Tout effacer
    </button>

    <button
      id="annuaireFavoritesBackBtn"
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
    "Mes favoris",
    html,
    function(){

      bindResultActions();


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

              writeStorage(
                STORAGE.favorites,
                []
              );

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


/* =========================================================
   CONSULTÉS RÉCEMMENT
   ========================================================= */

function openViewedHistory(){

  const rows =
    loadViewedHistory();


  let html = `

    <div class="box">

      <div class="bociteAnnuaireTitle">
        Consultés récemment
      </div>

    </div>

  `;


  if(
    !rows.length
  ){

    html += `

      <div
        class="box"
        style="margin-top:9px;">

        <div class="bociteAnnuaireText">
          Aucune fiche consultée pour le moment.
        </div>

      </div>

    `;

  }else{

    rows.forEach(
      function(item){

        const entity =
          getEntityById(
            item.id
          );


        html += `

          <div
            class="box"
            style="margin-top:7px;">

            <div class="bociteAnnuaireTitle">
              ${escapeHtml(item.name)}
            </div>

            ${
              item.activity
                ? `
                    <div
                      class="bociteAnnuaireText"
                      style="margin-top:4px;">
                      ${escapeHtml(item.activity)}
                    </div>
                  `
                : ""
            }

            <div
              class="bociteAnnuaireSmall"
              style="margin-top:4px;">
              ${escapeHtml(item.commune || "")}
            </div>

            ${
              entity
                ? `
                    <button
                      type="button"
                      class="choiceBtn annuaireViewedEntityBtn"
                      data-id="${escapeHtml(item.id)}"
                      style="
                        width:100%;
                        margin-top:7px;
                      ">
                      Voir la fiche
                    </button>
                  `
                : `
                    <div
                      class="bociteAnnuaireSmall"
                      style="margin-top:7px;">
                      Cette fiche n'est plus disponible.
                    </div>
                  `
            }

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
        margin-top:8px;
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


      const clear =
        getElement(
          "annuaireViewedClearBtn"
        );


      if(clear){

        clear.onclick =
          function(){

            if(
              window.confirm(
                "Effacer les fiches consultées récemment ?"
              )
            ){

              writeStorage(
                STORAGE.viewed,
                []
              );

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

/* =========================================================
   APPRÉCIATION D'UNE FICHE
   ========================================================= */

function openRatingForm(
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


                if(
                  saveRating(
                    entity.id,
                    value
                  )
                ){

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


/* =========================================================
   FICHE ÉTABLISSEMENT
   ========================================================= */

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


  const rating =
    getRatingSummary(
      entity.id
    );


  let contactHtml = `

    <div
      class="box"
      style="margin-top:10px;">

      <div class="bociteAnnuaireTitle">
        Coordonnées
      </div>

  `;


  if(
    entity.address ||
    entity.postalCode ||
    entity.commune
  ){

    contactHtml += `

      <div
        class="bociteAnnuaireText"
        style="margin-top:7px;">

        ${escapeHtml(entity.address)}

        ${
          entity.address &&
          (
            entity.postalCode ||
            entity.commune
          )
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

    `;

  }else{

    contactHtml += `

      <div
        class="bociteAnnuaireSmall"
        style="margin-top:7px;">
        Adresse non renseignée.
      </div>

    `;
  }


  contactHtml += `

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
            : `
                <button
                  class="choiceBtn"
                  type="button"
                  disabled>
                  Téléphone indisponible
                </button>
              `
        }

        ${
          entity.email
            ? `
                <button
                  id="annuaireEntityEmailBtn"
                  class="choiceBtn"
                  type="button">
                  Envoyer un e-mail
                </button>
              `
            : `
                <button
                  class="choiceBtn"
                  type="button"
                  disabled>
                  E-mail indisponible
                </button>
              `
        }

      </div>

  `;


  if(entity.website){

    contactHtml += `

      <button
        id="annuaireEntityWebsiteBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Voir le site internet
      </button>

    `;
  }


  if(
    entity.address ||
    entity.commune
  ){

    contactHtml += `

      <button
        id="annuaireEntityRouteBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:7px;
        ">
        Itinéraire
      </button>

    `;
  }


  contactHtml += `
    </div>
  `;


  const ratingHtml =
    rating.visible
      ? `

          <div
            class="box"
            style="margin-top:10px;">

            <div class="bociteAnnuaireTitle">
              Appréciation locale
            </div>

            <div
              style="
                margin-top:7px;
                color:#2f5d46;
                font-size:18px;
                font-weight:700;
              ">
              ${rating.global.toFixed(1)} / 5
            </div>

          </div>

        `
      : `

          <div
            class="box"
            style="margin-top:10px;">

            <div class="bociteAnnuaireTitle">
              Appréciation locale
            </div>

            <div
              class="bociteAnnuaireText"
              style="margin-top:6px;">
              Aucune appréciation enregistrée
              sur cet appareil pour le moment.
            </div>

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

    </div>


    ${contactHtml}


    ${
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

            </div>
          `
        : ""
    }


    ${ratingHtml}


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

            window.location.href =
              "mailto:" +
              entity.email;
          };
      }


      const website =
        getElement(
          "annuaireEntityWebsiteBtn"
        );


      if(website){

        website.onclick =
          function(){

            let url =
              String(
                entity.website ||
                ""
              ).trim();


            if(
              url &&
              !/^https?:\/\//i.test(
                url
              )
            ){

              url =
                "https://" +
                url;
            }


            if(url){

              window.open(
                url,
                "_blank",
                "noopener"
              );
            }
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


      const ratingBtn =
        getElement(
          "annuaireGiveRatingBtn"
        );


      if(ratingBtn){

        ratingBtn.onclick =
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
              entity.id
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

            if(
              !requireDirectoryAccess(
                "utiliser le carnet professionnel"
              )
            ){

              return;
            }


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

            if(
              !requireDirectoryAccess(
                "suivre une entreprise"
              )
            ){

              return;
            }


            toggleFollowed(
              entity
            );


            openEntity(
              entity.id
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


/* =========================================================
   GÉOLOCALISATION
   ========================================================= */

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


  const radius =
    6371;


  const dLat =
    toRad(
      lat2 -
      lat1
    );


  const dLng =
    toRad(
      lng2 -
      lng1
    );


  const a =
    Math.sin(
      dLat / 2
    ) *
    Math.sin(
      dLat / 2
    ) +
    Math.cos(
      toRad(
        lat1
      )
    ) *
    Math.cos(
      toRad(
        lat2
      )
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
      Math.sqrt(
        1 - a
      )
    );


  return (
    radius *
    c
  );
}


/* =========================================================
   PRÈS DE MOI
   ========================================================= */

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


        const rows =
          loadEntities()
            .filter(
              function(entity){

                return (
                  Number.isFinite(
                    entity.latitude
                  ) &&
                  Number.isFinite(
                    entity.longitude
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
                      entity.latitude,
                      entity.longitude
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
          !rows.length
        ){

          html += `

            <div
              class="box"
              style="margin-top:9px;">

              <div class="bociteAnnuaireText">
                Les fiches actuellement disponibles
                ne contiennent pas encore suffisamment
                de coordonnées géographiques.
              </div>

            </div>

          `;

        }else{

          rows.forEach(
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
        enableHighAccuracy:
          false,

        timeout:
          7000,

        maximumAge:
          300000
      }
    );
}


/* =========================================================
   SÉCURITÉ ESPACE PROFESSIONNEL
   ========================================================= */

function requireDirectoryAccess(
  actionLabel
){

  const registration =
    window.BoCiteArtRegistration;


  if(
    !registration ||
    typeof registration.securityReady !==
      "function"
  ){

    alert(
      "La sécurisation du compte n'est pas disponible pour le moment."
    );

    return false;
  }


  if(
    !registration.securityReady()
  ){

    alert(
      "Votre compte doit être sécurisé avant de pouvoir " +
      String(
        actionLabel ||
        "accéder à cet espace professionnel"
      ) +
      "."
    );

    return false;
  }


  if(
    typeof registration.canAccess ===
      "function" &&
    !registration.canAccess(
      "directory"
    )
  ){

    alert(
      "Vous ne disposez pas de l'autorisation nécessaire pour " +
      String(
        actionLabel ||
        "accéder à cet espace professionnel"
      ) +
      "."
    );

    return false;
  }


  return true;
}


/* =========================================================
   ESPACE PROFESSIONNEL
   ========================================================= */

function openProfessionalDashboard(){

  if(
    !requireDirectoryAccess(
      "accéder à l'annuaire professionnel"
    )
  ){

    return;
  }


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


/* =========================================================
   OUVERTURE DU BOUTON PRO DE L'ACCUEIL
   ========================================================= */

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


    const professionalButton =
      target.closest(
        "#annuaireProfessionalBtn"
      );


    if(!professionalButton){
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


    openProfessionalDashboard();

  },
  true
);

 /* =========================================================
   RECHERCHE PROFESSIONNELLE
   ========================================================= */

function openProfessionalSearchForm(){

  if(
    !requireDirectoryAccess(
      "effectuer une recherche professionnelle"
    )
  ){

    return;
  }


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
          type="search"
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

      const input =
        getElement(
          "annuaireProQueryInput"
        );


      const launch =
        getElement(
          "annuaireProLaunchBtn"
        );


      function run(){

        const query =
          String(
            input
              ? input.value
              : ""
          ).trim();


        if(!query){

          alert(
            "Indiquez ce que vous recherchez."
          );

          return;
        }


        addProfessionalHistory(
          query
        );


        openProfessionalSearchResults(
          query
        );
      }


      if(launch){

        launch.onclick =
          run;
      }


      if(input){

        input.onkeydown =
          function(event){

            if(
              event.key ===
              "Enter"
            ){

              event.preventDefault();

              run();
            }
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


/* =========================================================
   RÉSULTATS DE LA RECHERCHE PROFESSIONNELLE
   ========================================================= */

function openProfessionalSearchResults(
  query
){

  if(
    !requireDirectoryAccess(
      "consulter les résultats professionnels"
    )
  ){

    return;
  }


  const cleanQuery =
    String(
      query || ""
    ).trim();


  if(!cleanQuery){

    openProfessionalSearchForm();

    return;
  }


  const existing =
    searchEntities(
      cleanQuery,
      {
        localOnly:false
      }
    );


  renderProfessionalSearchResults(
    cleanQuery,
    existing,
    existing.length === 0
  );


  annuaire.Agent
    .search(
      cleanQuery
    )
    .then(
      function(rows){

        if(
          rows.length
        ){

          mergeNetworkEntities(
            rows
          );
        }


        const refreshed =
          searchEntities(
            cleanQuery,
            {
              localOnly:false
            }
          );


        renderProfessionalSearchResults(
          cleanQuery,
          refreshed,
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


        renderProfessionalSearchResults(
          cleanQuery,
          existing,
          false
        );
      }
    );
}


/* =========================================================
   AFFICHAGE RÉSULTATS PROFESSIONNELS
   ========================================================= */

function renderProfessionalSearchResults(
  query,
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
        Recherche professionnelle
      </div>

      <div
        class="bociteAnnuaireText"
        style="margin-top:6px;">
        <strong>
          ${escapeHtml(query)}
        </strong>
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
                  bociteArtLogoText() +
                  " vérifie également les données disponibles sur le réseau."
                )
              : (
                  "Aucun établissement correspondant n'a été trouvé pour le moment."
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
      Mes recherches professionnelles
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


/* =========================================================
   HISTORIQUE PROFESSIONNEL
   ========================================================= */

function openProfessionalHistory(){

  if(
    !requireDirectoryAccess(
      "consulter vos recherches professionnelles"
    )
  ){

    return;
  }


  const rows =
    loadProfessionalHistory();


  let html = `

    <div class="box">

      <div class="bociteAnnuaireTitle">
        Mes recherches professionnelles
      </div>

      <div
        class="bociteAnnuaireText"
        style="margin-top:6px;">
        Retrouvez vos recherches sans les retaper.
      </div>

    </div>

  `;


  if(
    !rows.length
  ){

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

    rows.forEach(
      function(item){

        html += `

          <button
            type="button"
            class="choiceBtn annuaireProHistoryQueryBtn"
            data-query="${escapeHtml(item.query)}"
            style="
              width:100%;
              margin-top:7px;
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
              ${escapeHtml(item.commune || "")}
            </span>

          </button>

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
        margin-top:8px;
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
          ".annuaireProHistoryQueryBtn"
        )
        .forEach(
          function(button){

            button.onclick =
              function(){

                openProfessionalSearchResults(
                  button.getAttribute(
                    "data-query"
                  ) ||
                  ""
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
              window.confirm(
                "Effacer tout l'historique professionnel ?"
              )
            ){

              writeStorage(
                STORAGE.professionalHistory,
                []
              );

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


/* =========================================================
   CARNET PROFESSIONNEL
   ========================================================= */

function openProfessionalNotebook(){

  if(
    !requireDirectoryAccess(
      "consulter votre carnet professionnel"
    )
  ){

    return;
  }


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
        Retrouvez les entreprises
        que vous avez enregistrées.
      </div>

    </div>

  `;


  if(
    !rows.length
  ){

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

            <div class="bociteAnnuaireTitle">
              ${escapeHtml(item.name)}
            </div>

            ${
              item.activity
                ? `
                    <div
                      class="bociteAnnuaireText"
                      style="margin-top:4px;">
                      ${escapeHtml(item.activity)}
                    </div>
                  `
                : ""
            }

            <div
              class="bociteAnnuaireSmall"
              style="margin-top:4px;">
              ${escapeHtml(item.commune || "")}
            </div>

            <button
              type="button"
              class="choiceBtn annuaireNotebookEntityBtn"
              data-id="${escapeHtml(item.id)}"
              style="
                width:100%;
                margin-top:7px;
              ">
              Voir la fiche
            </button>

            <button
              type="button"
              class="choiceBtn annuaireNotebookRemoveBtn"
              data-id="${escapeHtml(item.id)}"
              style="
                width:100%;
                margin-top:6px;
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
        margin-top:8px;
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
          ".annuaireNotebookRemoveBtn"
        )
        .forEach(
          function(button){

            button.onclick =
              function(){

                const id =
                  button.getAttribute(
                    "data-id"
                  );


                const updated =
                  loadNotebook()
                    .filter(
                      function(item){

                        return (
                          String(
                            item.id || ""
                          ) !==
                          String(
                            id || ""
                          )
                        );
                      }
                    );


                writeStorage(
                  STORAGE.notebook,
                  updated
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

              writeStorage(
                STORAGE.notebook,
                []
              );

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


/* =========================================================
   ENTREPRISES SUIVIES
   ========================================================= */

function openFollowedCompanies(){

  if(
    !requireDirectoryAccess(
      "consulter les entreprises suivies"
    )
  ){

    return;
  }


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
        Retrouvez les entreprises
        que vous souhaitez garder à l'œil.
      </div>

    </div>

  `;


  if(
    !rows.length
  ){

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

            <div class="bociteAnnuaireTitle">
              ${escapeHtml(item.name)}
            </div>

            ${
              item.activity
                ? `
                    <div
                      class="bociteAnnuaireText"
                      style="margin-top:4px;">
                      ${escapeHtml(item.activity)}
                    </div>
                  `
                : ""
            }

            <div
              class="bociteAnnuaireSmall"
              style="margin-top:4px;">
              ${escapeHtml(item.commune || "")}
            </div>

            <button
              type="button"
              class="choiceBtn annuaireFollowedEntityBtn"
              data-id="${escapeHtml(item.id)}"
              style="
                width:100%;
                margin-top:7px;
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
      id="annuaireFollowedBackBtn"
      class="choiceBtn"
      type="button"
      style="
        width:100%;
        margin-top:9px;
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


/* =========================================================
   BERCY INFOS ENTREPRISES
   ========================================================= */

function openBercyInfos(){

  if(
    !requireDirectoryAccess(
      "accéder aux informations professionnelles"
    )
  ){

    return;
  }


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


/* =========================================================
   FOURNISSEUR FUTUR
   ========================================================= */

annuaire.refreshFromProvider =
function(){

  /*
    Aucun balayage global.

    Le chargement réseau est déclenché
    uniquement lorsqu'un utilisateur
    effectue une recherche.
  */

  return Promise.resolve({

    updated:
      false,

    preserved:
      true,

    count:
      loadEntities().length,

    source:
      "Stockage local + recherche réseau ciblée"

  });
};


/* =========================================================
   API PUBLIQUE DE L'ANNUAIRE
   ========================================================= */

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
  searchLocalTrade;

annuaire.searchNetworkForQuery =
  searchNetworkForQuery;

annuaire.mergeNetworkEntities =
  mergeNetworkEntities;

annuaire.loadEntities =
  loadEntities;

annuaire.saveEntities =
  saveEntities;

annuaire.getEntityById =
  getEntityById;


/* =========================================================
   COMPATIBILITÉ AVEC ENTREPRISE.JS
   ========================================================= */

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


/* =========================================================
   DÉMARRAGE LÉGER
   ========================================================= */

window.setTimeout(
  function(){

    annuaire
      .refreshFromProvider()
      .then(
        function(result){

          console.log(
            "✅ Annuaire Bo'CitéArt prêt :",
            result.count,
            "établissement(s) conservé(s)"
          );
        }
      )
      .catch(
        function(error){

          console.warn(
            "Bo'CitéArt : démarrage annuaire incomplet.",
            error
          );
        }
      );

  },
  100
);


/* =========================================================
   FIN
   ========================================================= */

console.log(
  "✅ Bo'CitéArt — Annuaire consolidé chargé"
);

})();

