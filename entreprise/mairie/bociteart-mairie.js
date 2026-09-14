/* =========================================================
   ÇA COMMENCE ICI — BO'CITÉART — MODULE MAIRIE EXTERNE

   Fichier :
   entreprise/mairie/bociteart-mairie.js

   Rôle :
   - sortir la Mairie de index.html ;
   - conserver le bandeau rouge de la tuile Mairie ;
   - présenter les services utiles aux habitants ;
   - conserver l'espace interne Mairie ;
   - raccorder École → Mairie ;
   - raccorder Sport → Mairie avec le moteur Sport existant ;
   - raccorder le suivi Finance existant sans dupliquer le paiement ;
   - conserver les suivis et historiques locaux de préproduction.

   IMPORTANT :
   - aucun secret bancaire, PSP, IBAN ou clé privée ici ;
   - le navigateur n'est jamais la preuve finale d'un paiement ;
   - les fonctions Sport sont appelées via window.BociteSportMairie ;
   - les fonctions Finance sont appelées via window.BociteFinanceSport ;
   - on montre les portes, pas les engrenages.
   ========================================================= */

(function(){

  "use strict";


/* =========================================================
   PROTECTION CONTRE UN DOUBLE CHARGEMENT
   ========================================================= */

if(
  window.__bociteMairieModuleLoaded
){
  return;
}

window.__bociteMairieModuleLoaded =
  true;


/* =========================================================
   CONFIGURATION
   ========================================================= */

const VERSION =
  "2026-09-11-01";


const MAIRIE_STORE_KEY =
  "bociteart_mairie_msg";


const SCHOOL_HISTORY_KEY =
  "bociteart_mairie_school_history_v2";


const STYLE_ID =
  "bociteartMairieStyles";


let lastSchoolPayload =
  null;


let lastSportScan =
  null;


/* =========================================================
   PASSERELLE VERS LA MODALE GÉNÉRALE
   ========================================================= */

function mairieOpenModal(
  title,
  html
){

  if(
    typeof window.openModal !==
      "function"
  ){

    console.error(
      "Bo'CitéArt Mairie : openModal indisponible."
    );

    return;
  }


  return window.openModal(
    title,
    html
  );
}


/* =========================================================
   OUTILS
   ========================================================= */

function mairieEl(
  id
){

  return document.getElementById(
    id
  );
}


function mairieText(
  value
){

  return String(
    value == null
      ? ""
      : value
  ).trim();
}


function mairieEsc(
  value
){

  return mairieText(
    value
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


function mairieClone(
  value
){

  if(
    value == null
  ){
    return value;
  }


  try{

    return JSON.parse(
      JSON.stringify(
        value
      )
    );

  }catch(error){

    return value;
  }
}


function mairieNow(){

  return new Date()
    .toISOString();
}


function mairieId(
  prefix
){

  const head =
    mairieText(
      prefix
    ) ||
    "mairie";


  if(
    window.crypto &&
    typeof window.crypto.randomUUID ===
      "function"
  ){

    return (
      head +
      "-" +
      window.crypto.randomUUID()
    );
  }


  return (
    head +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2,10)
  );
}


function mairieRead(
  key,
  fallback
){

  try{

    const raw =
      window.localStorage
        .getItem(
          key
        );


    if(
      !raw
    ){

      return mairieClone(
        fallback
      );
    }


    const parsed =
      JSON.parse(
        raw
      );


    return parsed == null
      ? mairieClone(
          fallback
        )
      : parsed;

  }catch(error){

    return mairieClone(
      fallback
    );
  }
}


function mairieWrite(
  key,
  value
){

  try{

    window.localStorage
      .setItem(
        key,
        JSON.stringify(
          value
        )
      );

    return true;

  }catch(error){

    console.warn(
      "Bo'CitéArt Mairie : stockage local indisponible.",
      error
    );

    return false;
  }
}


/* =========================================================
   IDENTITÉ VISUELLE BO'CITÉART
   ========================================================= */

function mairieBrandHtml(){

  return (
    '<span class="mairieBrand">' +
      '<span class="mairieBrandGreen">Bo\'Cité</span>' +
      '<span class="mairieBrandRed">Art</span>' +
    '</span>'
  );
}


function mairieCardTitle(
  title
){

  return (
    '<div class="mairieTitle">' +
      mairieEsc(
        title
      ) +
    '</div>'
  );
}


function mairieStatus(
  id,
  text
){

  return (
    '<div class="mairieStatus" id="' +
    mairieEsc(
      id
    ) +
    '">' +
    mairieEsc(
      text ||
      ""
    ) +
    '</div>'
  );
}


/* =========================================================
   STYLES
   TUILE MAIRIE + MODULE MAIRIE
   ========================================================= */

function mairieEnsureStyles(){

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

    /* =====================================================
       TUILE MAIRIE
       ===================================================== */

    #mairieTile{
      position:relative;
      overflow:hidden;
    }


    #mairieTile::after{
      content:"";
      position:absolute;
      width:56px;
      height:56px;
      left:-28px;
      bottom:-28px;
      border-radius:50%;
      background:var(--bg,#f1e6d6);
      z-index:4;
      pointer-events:none;
    }


    .mairieTickerWrap{
      position:absolute;
      left:0;
      right:0;
      bottom:0;
      height:18px;
      background:rgba(165,30,34,.95);
      overflow:hidden;
      display:flex;
      align-items:center;
      z-index:5;
    }


    .mairieTickerTrack{
      display:inline-flex;
      align-items:center;
      white-space:nowrap;
      padding-left:100%;
      animation:mairieTickerMove 24s linear infinite;
      color:#ffffff;
      font-size:10px;
      font-weight:900;
    }


    .mairieTickerTrack span{
      padding-right:40px;
    }


    @keyframes mairieTickerMove{

      0%{
        transform:translateX(0);
      }

      100%{
        transform:translateX(-100%);
      }
    }


    /* =====================================================
       MODULE MAIRIE
       ===================================================== */

    .bociteMairieRoot,
    .bociteMairieRoot *{
      box-sizing:border-box;
    }


    .bociteMairieRoot{
      color:#111111;
      font-size:14px;
      font-weight:400;
      line-height:1.5;
    }


    .bociteMairieRoot .mairieCard{
      background:#ffffff;
      border:2px solid rgba(0,0,0,.08);
      border-radius:14px;
      padding:12px;
      margin:10px 0;
      color:#111111;
      font-size:14px;
      font-weight:400;
    }


    .bociteMairieRoot .mairieTitle{
      color:#2f5d46;
      font-size:17px;
      line-height:1.25;
      font-weight:700;
      margin:0 0 8px 0;
    }


    .bociteMairieRoot .mairieText,
    .bociteMairieRoot .mairieStatus,
    .bociteMairieRoot .mairieLabel,
    .bociteMairieRoot li{
      color:#111111;
      font-size:14px;
      line-height:1.5;
      font-weight:400;
    }


    .bociteMairieRoot ul{
      margin:8px 0 0 20px;
      padding:0;
    }


    .bociteMairieRoot .mairieLabel{
      display:block;
      margin-top:10px;
      margin-bottom:5px;
    }


    .bociteMairieRoot .mairieField{
      width:100%;
      border:2px solid rgba(0,0,0,.12);
      border-radius:12px;
      padding:10px;
      background:#ffffff;
      color:#111111;
      font-size:14px;
      font-weight:400;
      font-family:inherit;
      outline:none;
    }


    .bociteMairieRoot textarea.mairieField{
      min-height:110px;
      resize:vertical;
    }


    .bociteMairieRoot .mairieActions{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:10px;
    }


    .bociteMairieRoot .mairieBtn{
      border:2px solid #2f5d46;
      background:#ffffff;
      color:#2f5d46;
      border-radius:12px;
      padding:10px 12px;
      font-size:14px;
      font-weight:700;
      cursor:pointer;
      font-family:inherit;
    }


    .bociteMairieRoot .mairieBtn:disabled{
      opacity:.55;
      cursor:not-allowed;
    }


    .bociteMairieRoot .mairieFull{
      width:100%;
    }


    /* =====================================================
       ÉCOLE → MAIRIE
       JAUNE
       ===================================================== */

    .bociteMairieRoot .mairieSchool{
      border-left:6px solid #d4bb18;
      background:#fffdf0;
    }


    .bociteMairieRoot .mairieSchool .mairieTitle{
      color:#8a6d00;
    }


    /* =====================================================
       SPORT → MAIRIE
       VERT
       ===================================================== */

    .bociteMairieRoot .mairieSport{
      border-left:6px solid #2f5d46;
      background:#f3faf6;
    }


    .bociteMairieRoot .mairieSport .mairieTitle{
      color:#2f5d46;
    }


    /* =====================================================
       LOGO BO'CITÉART
       ===================================================== */

    .bociteMairieRoot .mairieBrand{
      display:inline-flex;
      gap:0;
      white-space:nowrap;
      font-weight:800;
    }


    .bociteMairieRoot .mairieBrandGreen{
      color:#2f5d46;
    }


    .bociteMairieRoot .mairieBrandRed{
      color:#a51e22;
    }


    /* =====================================================
       ÉTATS
       ===================================================== */

    .bociteMairieRoot .mairieStatus{
      margin-top:10px;
      padding:9px 10px;
      border-radius:10px;
      background:#f5f1ea;
    }


    .bociteMairieRoot
    .mairieStatus[data-state="ok"]{
      border-left:4px solid #2f5d46;
    }


    .bociteMairieRoot
    .mairieStatus[data-state="error"]{
      border-left:4px solid #a51e22;
    }


    .bociteMairieRoot
    .mairieStatus[data-state="warn"]{
      border-left:4px solid #d4bb18;
    }


    .bociteMairieRoot .mairieHidden{
      display:none;
    }


    .bociteMairieRoot .mairieGrid{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:8px;
      margin-top:10px;
    }


    @media(max-width:380px){

      .bociteMairieRoot .mairieGrid{
        grid-template-columns:1fr;
      }
    }

  `;


  document.head
    .appendChild(
      style
    );
}


/* =========================================================
   TITRE DE LA MODALE
   ========================================================= */

function mairieSetModalHeader(
  before
){

  const apply =
    function(){

      const title =
        mairieEl(
          "modalTitle"
        );


      if(
        !title
      ){
        return;
      }


      title.innerHTML =
        mairieEsc(
          before ||
          "Mairie avec"
        ) +
        " " +
        '<span style="' +
          'display:inline-flex;' +
          'gap:0;' +
          'white-space:nowrap;' +
          'font-weight:800;' +
        '">' +

          '<span style="color:#2f5d46;">' +
            "Bo'Cité" +
          '</span>' +

          '<span style="color:#a51e22;">' +
            "Art" +
          '</span>' +

        '</span>';
    };


  apply();

  window.setTimeout(
    apply,
    0
  );

  window.setTimeout(
    apply,
    40
  );

  window.setTimeout(
    apply,
    120
  );
}


/* =========================================================
   BANDEAU ROUGE DE LA TUILE MAIRIE
   ========================================================= */

function mairieLoad(){

  return mairieRead(
    MAIRIE_STORE_KEY,
    {}
  );
}


function mairieSave(
  obj
){

  return mairieWrite(
    MAIRIE_STORE_KEY,
    obj &&
    typeof obj ===
      "object"

      ? obj

      : {}
  );
}


function renderMairieTicker(){

  const track =
    mairieEl(
      "mairieTickerTrack"
    );


  if(
    !track
  ){
    return;
  }


  const db =
    mairieLoad();


  const message =
    mairieText(
      db &&
      db.message
    ) ||
    "Informations de la mairie";


  track.innerHTML =

    [
      message,
      message
    ]

      .map(
        function(
          item
        ){

          return (
            "<span>" +
            mairieEsc(
              item
            ) +
            "</span>"
          );
        }
      )

      .join("");
}


/* =========================================================
   SERVICES MUNICIPAUX
   ========================================================= */

const CITY_SERVICES_DATA = [

  {
    title:
      "Accueil mairie",

    items:[
      "Coordonnées, horaires et accueil général de la commune.",
      "Les informations locales définitives sont renseignées par la mairie."
    ]
  },


  {
    title:
      "État civil",

    items:[
      "Actes de naissance, mariage, décès et démarches d’état civil.",
      "Les modalités et rendez-vous renvoient vers le service municipal compétent."
    ]
  },


  {
    title:
      "Carte d’identité / passeport",

    items:[
      "Informations pratiques et orientation vers la démarche officielle.",
      "Les délais et rendez-vous restent ceux du service public compétent."
    ]
  },


  {
    title:
      "CCAS",

    items:[
      "Aide sociale, accompagnement, soutien aux familles et orientation administrative."
    ]
  },


  {
    title:
      "Urbanisme",

    items:[
      "Informations sur les déclarations, permis et démarches liées aux travaux.",
      "Les décisions et délais restent ceux de l’autorité compétente."
    ]
  }

];


function mairieServicesHtml(){

  return `

    <div class="bociteMairieRoot">

      ${

        CITY_SERVICES_DATA

          .map(
            function(
              section
            ){

              return `

                <div class="mairieCard">

                  ${mairieCardTitle(
                    section.title
                  )}

                  <div class="mairieText">

                    ${

                      section.items

                        .map(
                          function(
                            line
                          ){

                            return (
                              "• " +
                              mairieEsc(
                                line
                              )
                            );
                          }
                        )

                        .join(
                          "<br>"
                        )
                    }

                  </div>

                </div>

              `;
            }
          )

          .join("")
      }


      <div class="mairieCard">

        ${mairieCardTitle(
          "Site officiel de la commune"
        )}

        <div class="mairieText">

          Pour les démarches officielles,
          les documents
          et les informations administratives complètes,
          consultez le site de la commune.

        </div>


        <button
          id="mairieOfficialSiteBtn"
          class="mairieBtn mairieFull"
          type="button"
          style="
            margin-top:10px;
          "
        >
          Ouvrir le site officiel
        </button>

      </div>

    </div>

  `;
}


function openMairieServices(){

  mairieEnsureStyles();


  mairieOpenModal(
    "Services municipaux avec Bo'CitéArt",
    mairieServicesHtml()
  );


  mairieSetModalHeader(
    "Services municipaux avec"
  );


  window.setTimeout(
    function(){

      const button =
        mairieEl(
          "mairieOfficialSiteBtn"
        );


      if(
        button
      ){

        button.onclick =
          function(){

            const url =
              mairieText(
                window.BOCITEART_CITY_OFFICIAL_URL
              ) ||
              "https://www.wattignies.fr";


            window.open(
              url,
              "_blank",
              "noopener,noreferrer"
            );
          };
      }

    },
    0
  );
}


/* =========================================================
   ANNUAIRE SANTÉ
   ========================================================= */

function mairieHealthBlock(
  title,
  list
){

  const rows =
    Array.isArray(
      list
    )

      ? list

      : [];


  return `

    <div class="mairieCard">

      ${mairieCardTitle(
        title
      )}

      <div class="mairieText">

        ${

          rows.length

            ? rows

                .map(
                  function(
                    item
                  ){

                    return `

                      <div
                        style="
                          margin-top:8px;
                        "
                      >

                        ${mairieEsc(
                          item.nom ||
                          item.name ||
                          "Professionnel"
                        )}

                        ${
                          mairieText(
                            item.adresse ||
                            item.address
                          )

                            ? "<br>" +
                              mairieEsc(
                                item.adresse ||
                                item.address
                              )

                            : ""
                        }

                        ${
                          mairieText(
                            item.telephone ||
                            item.phone
                          )

                            ? "<br>" +
                              mairieEsc(
                                item.telephone ||
                                item.phone
                              )

                            : ""
                        }

                      </div>

                    `;
                  }
                )

                .join("")

            : "Les informations locales seront renseignées et tenues à jour pour la commune."
        }

      </div>

    </div>

  `;
}

function mairieHealthDirectory(){

  const shared =
    window.BOCITEART_HEALTH_DIRECTORY;


  if(
    shared &&
    typeof shared ===
      "object"
  ){

    return shared;
  }


  return {

    medecins:[],

    specialistes:[],

    kines:[],

    infirmieres:[],

    pharmacies:[],

    professionnels:[],

    communes:{}

  };
}

/* =========================================================
   ANNUAIRE SANTÉ — OUTILS
   ========================================================= */

let mairieHealthVisibleRows =
  [];


let mairieHealthState = {

  commune:"",

  query:""

};


function mairieHealthNorm(
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


function mairieHealthDefaultCommune(){

  try{

    if(
      window.BociteAccess &&
      typeof window.BociteAccess
        .getAccount ===
        "function"
    ){

      const account =
        window.BociteAccess
          .getAccount();


      if(
        account &&
        mairieText(
          account.commune
        )
      ){

        return mairieText(
          account.commune
        );
      }
    }

  }catch(_){}


  return (

    mairieText(
      window.BOCITEART_CITY_NAME
    ) ||

    ""

  );
}


function mairieHealthSpeciality(
  item
){

  if(
    Array.isArray(
      item &&
      item.specialites
    )
  ){

    return item.specialites
      .map(
        mairieText
      )
      .filter(Boolean)
      .join(", ");
  }


  return mairieText(

    item &&
    (
      item.specialite ||
      item.speciality ||
      item.specialty
    )

  );
}


function mairieHealthNormalizeItem(
  item,
  defaultProfession,
  defaultCommune
){

  item =
    item &&
    typeof item ===
      "object"

      ? item

      : {};


  return {

    nom:
      mairieText(
        item.nom ||
        item.name ||
        item.displayName
      ) ||
      "Professionnel de santé",

    profession:
      mairieText(
        item.profession ||
        item.metier ||
        item.job ||
        defaultProfession
      ) ||
      "Professionnels de santé",

    specialite:
      mairieHealthSpeciality(
        item
      ),

    commune:
      mairieText(
        item.commune ||
        item.ville ||
        item.city ||
        defaultCommune
      ),

    adresse:
      mairieText(
        item.adresse ||
        item.address
      ),

    telephone:
      mairieText(
        item.telephone ||
        item.phone
      ),

    email:
      mairieText(
        item.email
      ),

    site:
      mairieText(
        item.site ||
        item.website ||
        item.url
      ),

    rendezVous:
      mairieText(
        item.rendezVous ||
        item.appointmentUrl ||
        item.bookingUrl
      ),

    horaires:
      mairieText(
        item.horaires ||
        item.hours
      ),

    accessibilite:
      mairieText(
        item.accessibilite ||
        item.accessibility
      ),

    informations:
      mairieText(
        item.informations ||
        item.description ||
        item.details
      )

  };
}


function mairieHealthCollectRows(){

  const data =
    mairieHealthDirectory();


  const defaultCommune =
    mairieHealthDefaultCommune();


  const rows =
    [];


  function addList(
    list,
    profession,
    commune
  ){

    if(
      !Array.isArray(
        list
      )
    ){

      return;
    }


    list.forEach(
      function(
        item
      ){

        rows.push(

          mairieHealthNormalizeItem(

            item,

            profession,

            commune ||
            defaultCommune

          )

        );
      }
    );
  }


  /* =====================================================
     ANCIEN FORMAT — CONSERVÉ
     ===================================================== */

  addList(
    data.medecins,
    "Médecins généralistes",
    defaultCommune
  );


  addList(
    data.specialistes,
    "Médecins spécialistes",
    defaultCommune
  );


  addList(
    data.kines,
    "Kinésithérapeutes",
    defaultCommune
  );


  addList(
    data.infirmieres,
    "Infirmières / infirmiers",
    defaultCommune
  );


  addList(
    data.pharmacies,
    "Pharmacies",
    defaultCommune
  );


  addList(
    data.professionnels,
    "Professionnels de santé",
    defaultCommune
  );


  /* =====================================================
     NOUVEAU FORMAT — PLUSIEURS COMMUNES
     ===================================================== */

  if(
    data.communes &&
    typeof data.communes ===
      "object"
  ){

    Object.keys(
      data.communes
    )
    .forEach(
      function(
        communeName
      ){

        const communeData =
          data.communes[
            communeName
          ];


        if(
          !communeData
        ){

          return;
        }


        if(
          Array.isArray(
            communeData
          )
        ){

          addList(
            communeData,
            "Professionnels de santé",
            communeName
          );

          return;
        }


        addList(
          communeData.professionnels,
          "Professionnels de santé",
          communeName
        );


        addList(
          communeData.medecins,
          "Médecins généralistes",
          communeName
        );


        addList(
          communeData.specialistes,
          "Médecins spécialistes",
          communeName
        );


        addList(
          communeData.kines,
          "Kinésithérapeutes",
          communeName
        );


        addList(
          communeData.infirmieres,
          "Infirmières / infirmiers",
          communeName
        );


        addList(
          communeData.pharmacies,
          "Pharmacies",
          communeName
        );


        addList(
          communeData.dentistes,
          "Chirurgiens-dentistes",
          communeName
        );


        addList(
          communeData.sagesFemmes,
          "Sages-femmes",
          communeName
        );


        addList(
          communeData.orthophonistes,
          "Orthophonistes",
          communeName
        );


        addList(
          communeData.psychologues,
          "Psychologues",
          communeName
        );


        addList(
          communeData.laboratoires,
          "Laboratoires",
          communeName
        );


        addList(
          communeData.imagerie,
          "Imagerie médicale",
          communeName
        );

      }
    );
  }


  /* =====================================================
     SUPPRESSION DES DOUBLONS
     ===================================================== */

  const seen =
    new Set();


  return rows.filter(
    function(
      item
    ){

      const key =
        [

          mairieHealthNorm(
            item.nom
          ),

          mairieHealthNorm(
            item.profession
          ),

          mairieHealthNorm(
            item.specialite
          ),

          mairieHealthNorm(
            item.commune
          ),

          mairieHealthNorm(
            item.adresse
          )

        ].join("|");


      if(
        seen.has(
          key
        )
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


function mairieHealthKnownCommunes(){

  const names =
    [];


  mairieHealthCollectRows()
    .forEach(
      function(
        item
      ){

        const commune =
          mairieText(
            item.commune
          );


        if(
          commune &&
          !names.some(
            function(
              existing
            ){

              return (
                mairieHealthNorm(
                  existing
                ) ===
                mairieHealthNorm(
                  commune
                )
              );
            }
          )
        ){

          names.push(
            commune
          );
        }
      }
    );


  return names.sort(
    function(
      a,
      b
    ){

      return a.localeCompare(
        b,
        "fr"
      );
    }
  );
}


function mairieHealthSafeUrl(
  value
){

  const url =
    mairieText(
      value
    );


  if(
    /^https?:\/\//i.test(
      url
    )
  ){

    return url;
  }


  return "";
}


/* =========================================================
   FICHE PROFESSIONNEL
   ========================================================= */

function mairieHealthProfessionalCard(
  item,
  index
){

  return `

    <button
      type="button"
      class="mairieBtn mairieFull"
      data-mairie-health-open="${index}"
      style="
        margin-top:8px;
        text-align:left;
      "
    >

      <strong>
        ${mairieEsc(
          item.nom
        )}
      </strong>

      ${
        item.specialite

          ? "<br>" +
            mairieEsc(
              item.specialite
            )

          : ""
      }

      ${
        item.adresse

          ? "<br><span style='font-weight:400;'>" +
            mairieEsc(
              item.adresse
            ) +
            "</span>"

          : ""
      }

    </button>

  `;
}


function mairieHealthGroupHtml(
  profession,
  rows
){

  const specialities =
    {};


  rows.forEach(
    function(
      row
    ){

      const speciality =
        mairieText(
          row.specialite
        ) ||
        "";


      if(
        !specialities[
          speciality
        ]
      ){

        specialities[
          speciality
        ]=[];
      }


      specialities[
        speciality
      ].push(
        row
      );
    }
  );


  let content =
    "";


  Object.keys(
    specialities
  )
  .sort(
    function(
      a,
      b
    ){

      return a.localeCompare(
        b,
        "fr"
      );
    }
  )
  .forEach(
    function(
      speciality
    ){

      const specialityRows =
        specialities[
          speciality
        ];


      if(
        speciality
      ){

        content += `

          <div
            style="
              color:#2f5d46;
              font-size:14px;
              font-weight:700;
              margin-top:12px;
            "
          >
            ${mairieEsc(
              speciality
            )}
          </div>

        `;
      }


      specialityRows
        .sort(
          function(
            a,
            b
          ){

            return a.nom.localeCompare(
              b.nom,
              "fr"
            );
          }
        )
        .forEach(
          function(
            row
          ){

            const index =
              mairieHealthVisibleRows
                .indexOf(
                  row
                );


            content +=
              mairieHealthProfessionalCard(
                row,
                index
              );
          }
        );

    }
  );


  return `

    <div class="mairieCard">

      ${mairieCardTitle(
        profession
      )}

      ${content}

    </div>

  `;
}


/* =========================================================
   AFFICHAGE DE L'ANNUAIRE
   ========================================================= */

function mairieHealthRender(){

  const communeInput =
    mairieEl(
      "mairieHealthCommuneInput"
    );


  const queryInput =
    mairieEl(
      "mairieHealthSearchInput"
    ); 

  const out =
    mairieEl(
      "mairieHealthResults"
    );


  const title =
    mairieEl(
      "mairieHealthCurrentCity"
    );


  if(
    !out
  ){

    return;
  }


  const commune =
    mairieText(

      communeInput
        ? communeInput.value
        : mairieHealthState.commune

    );


  const query =
    mairieText(

      queryInput
        ? queryInput.value
        : mairieHealthState.query

    );


  mairieHealthState.commune =
    commune;


  mairieHealthState.query =
    query;


  if(
    title
  ){

    title.textContent =
      commune

        ? "Annuaire santé de " +
          commune

        : "Choisissez une commune";
  }


  if(
    !commune
  ){

    mairieHealthVisibleRows =
      [];


    out.innerHTML = `

      <div class="mairieCard">

        <div class="mairieText">

          Indiquez d’abord
          la commune que vous souhaitez consulter.

        </div>

      </div>

    `;


    return;
  }


  let rows =
    mairieHealthCollectRows()
      .filter(
        function(
          item
        ){

          return (

            mairieHealthNorm(
              item.commune
            ) ===
            mairieHealthNorm(
              commune
            )

          );
        }
      );


  if(
    query
  ){

    const needle =
      mairieHealthNorm(
        query
      );


    rows =
      rows.filter(
        function(
          item
        ){

          const haystack =
            mairieHealthNorm(

              [

                item.nom,

                item.profession,

                item.specialite,

                item.adresse,

                item.informations

              ].join(" ")

            );


          return haystack.includes(
            needle
          );
        }
      );
  }


  mairieHealthVisibleRows =
    rows.slice();


  if(
    !rows.length
  ){

    out.innerHTML = `

      <div class="mairieCard">

        ${mairieCardTitle(
          commune
            ? "Aucun résultat pour " +
              commune
            : "Aucun résultat"
        )}

        <div class="mairieText">

          Aucun professionnel correspondant
          n’est actuellement présent
          dans les données raccordées
          à l’annuaire.

          <br><br>

          ${
            query

              ? "Modifiez votre recherche ou consultez une autre commune."

              : "L’annuaire de cette commune doit encore être alimenté ou raccordé."
          }

        </div>

      </div>

    `;


    return;
  }


  const groups =
    {};


  rows.forEach(
    function(
      item
    ){

      const profession =
        mairieText(
          item.profession
        ) ||
        "Professionnels de santé";


      if(
        !groups[
          profession
        ]
      ){

        groups[
          profession
        ]=[];
      }


      groups[
        profession
      ].push(
        item
      );
    }
  );


  out.innerHTML =

    Object.keys(
      groups
    )

    .sort(
      function(
        a,
        b
      ){

        return a.localeCompare(
          b,
          "fr"
        );
      }
    )

    .map(
      function(
        profession
      ){

        return mairieHealthGroupHtml(
          profession,
          groups[
            profession
          ]
        );
      }
    )

    .join("");

}


/* =========================================================
   FICHE DÉTAILLÉE
   ========================================================= */

function mairieHealthShowProfessional(
  index
){

  const item =
    mairieHealthVisibleRows[
      Number(
        index
      )
    ];


  const out =
    mairieEl(
      "mairieHealthResults"
    );


  if(
    !item ||
    !out
  ){

    return;
  }


  const site =
    mairieHealthSafeUrl(
      item.site
    );


  const rendezVous =
    mairieHealthSafeUrl(
      item.rendezVous
    );


  out.innerHTML = `

    <div class="mairieCard">

      ${mairieCardTitle(
        item.nom
      )}


      <div class="mairieText">

        <strong>
          ${mairieEsc(
            item.profession
          )}
        </strong>

        ${
          item.specialite

            ? "<br>" +
              mairieEsc(
                item.specialite
              )

            : ""
        }


        ${
          item.adresse

            ? "<br><br><strong>Adresse</strong><br>" +
              mairieEsc(
                item.adresse
              )

            : ""
        }


        ${
          item.commune

            ? "<br>" +
              mairieEsc(
                item.commune
              )

            : ""
        }


        ${
          item.telephone

            ? "<br><br><strong>Téléphone</strong><br>" +
              mairieEsc(
                item.telephone
              )

            : ""
        }


        ${
          item.email

            ? "<br><br><strong>Contact</strong><br>" +
              mairieEsc(
                item.email
              )

            : ""
        }


        ${
          item.horaires

            ? "<br><br><strong>Horaires</strong><br>" +
              mairieEsc(
                item.horaires
              )

            : ""
        }


        ${
          item.accessibilite

            ? "<br><br><strong>Informations pratiques</strong><br>" +
              mairieEsc(
                item.accessibilite
              )

            : ""
        }


        ${
          item.informations

            ? "<br><br>" +
              mairieEsc(
                item.informations
              )

            : ""
        }

      </div>


      <div
        class="mairieActions"
        style="
          margin-top:14px;
        "
      >

        ${
          item.telephone

            ? `

              <a
                class="mairieBtn"
                href="tel:${mairieEsc(
                  item.telephone
                    .replace(
                      /[^0-9+]/g,
                      ""
                    )
                )}"
              >
                Appeler
              </a>

            `

            : ""
        }


        ${
          item.email

            ? `

              <a
                class="mairieBtn"
                href="mailto:${mairieEsc(
                  item.email
                )}"
              >
                Contacter
              </a>

            `

            : ""
        }


        ${
          rendezVous

            ? `

              <a
                class="mairieBtn"
                href="${mairieEsc(
                  rendezVous
                )}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Prendre rendez-vous
              </a>

            `

            : ""
        }


        ${
          site

            ? `

              <a
                class="mairieBtn"
                href="${mairieEsc(
                  site
                )}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Site du professionnel
              </a>

            `

            : ""
        }

      </div>


      <button
        id="mairieHealthBackToResults"
        class="mairieBtn mairieFull"
        type="button"
        style="
          margin-top:14px;
        "
      >
        Retour à l’annuaire
      </button>

    </div>

  `;

}


/* =========================================================
   HTML PRINCIPAL
   ========================================================= */

function mairieHealthHtml(){

  const ownCommune =
    mairieHealthDefaultCommune();


  mairieHealthState.commune =
    ownCommune;


  mairieHealthState.query =
    "";


  const communes =
    mairieHealthKnownCommunes();


  return `

    <div class="bociteMairieRoot">


      <div class="mairieCard">

        ${mairieCardTitle(
          "Annuaire santé"
        )}


        <div class="mairieText">

          Recherchez les professionnels
          et services de santé
          d’une commune.

          <br><br>

          Cet annuaire contient uniquement
          des informations professionnelles
          et pratiques.

          Il ne contient aucune donnée médicale
          personnelle.

        </div>

      </div>


      <!-- =============================================
           CHOIX DE LA COMMUNE
           ============================================= -->

      <div class="mairieCard">

        ${mairieCardTitle(
          "Choisir la commune"
        )}


        ${
          ownCommune

            ? `

              <div class="mairieText">

                Votre commune :

                <strong>
                  ${mairieEsc(
                    ownCommune
                  )}
                </strong>

              </div>

            `

            : ""
        }


        <label
          class="mairieLabel"
          for="mairieHealthCommuneInput"
        >
          Commune à consulter
        </label>


        <input
          id="mairieHealthCommuneInput"
          class="mairieField"
          type="text"
          list="mairieHealthCommuneList"
          autocomplete="address-level2"
          value="${mairieEsc(
            ownCommune
          )}"
          placeholder="Exemple : Wattignies, Lille, Seclin…"
        >


        <datalist
          id="mairieHealthCommuneList"
        >

          ${
            communes
              .map(
                function(
                  commune
                ){

                  return `

                    <option
                      value="${mairieEsc(
                        commune
                      )}"
                    ></option>

                  `;
                }
              )
              .join("")
          }

        </datalist>


        <div class="mairieActions">

          <button
            id="mairieHealthOpenCommuneBtn"
            class="mairieBtn"
            type="button"
          >
            Afficher cette commune
          </button>


          ${
            ownCommune

              ? `

                <button
                  id="mairieHealthOwnCommuneBtn"
                  class="mairieBtn"
                  type="button"
                >
                  Revenir à ma commune
                </button>

              `

              : ""
          }

        </div>

      </div>

<!-- =============================================
     RECHERCHE DANS LA COMMUNE
     ============================================= -->

<div class="mairieCard">

  <div
    id="mairieHealthCurrentCity"
    class="mairieTitle"
  >
    ${
      ownCommune

        ? "Annuaire santé de " +
          mairieEsc(
            ownCommune
          )

        : "Choisissez une commune"
    }
  </div>


  <label
    class="mairieLabel"
    for="mairieHealthSearchInput"
  >
    Rechercher dans cet annuaire
  </label>


  <input
    id="mairieHealthSearchInput"
    class="mairieField"
    type="search"
    placeholder="Nom, métier ou spécialité : cardiologue, pédiatre, pharmacie…"
  >


  <div
    class="mairieActions"
    style="margin-top:12px;"
  >

    <button
      id="mairieHealthSearchBtn"
      class="mairieBtn"
      type="button"
    >
      Rechercher
    </button>

  </div>


  <div class="mairieText">

    Vous pouvez rechercher directement
    le nom d’un professionnel,
    son métier
    ou une spécialité médicale.

  </div>

</div>

      <div
        id="mairieHealthResults"
      ></div>


    </div>

  `;
}


/* =========================================================
   ÉVÉNEMENTS DE L'ANNUAIRE
   ========================================================= */

function mairieBindHealthDirectory(){

  const communeInput =
    mairieEl(
      "mairieHealthCommuneInput"
    );


  const openCommune =
    mairieEl(
      "mairieHealthOpenCommuneBtn"
    );


  const ownCommune =
    mairieEl(
      "mairieHealthOwnCommuneBtn"
    );


  const searchInput =
    mairieEl(
      "mairieHealthSearchInput"
    );


  const searchButton =
    mairieEl(
      "mairieHealthSearchBtn"
    );


  const results =
    mairieEl(
      "mairieHealthResults"
    );


  /* =====================================================
     RECHERCHE
     ===================================================== */

async function launchHealthSearch(){

  const commune =
    mairieText(
      communeInput
        ? communeInput.value
        : ""
    );


  const query =
    mairieText(
      searchInput
        ? searchInput.value
        : ""
    );


  if(
    !commune
  ){

    if(
      results
    ){

      results.innerHTML = `

        <div class="mairieCard">

          <div class="mairieTitle">
            Commune nécessaire
          </div>

          <div class="mairieText">
            Indiquez d’abord la commune
            dans laquelle vous souhaitez
            effectuer votre recherche.
          </div>

        </div>

      `;

    }

    return;
  }


  mairieHealthState.commune =
    commune;

  mairieHealthState.query =
    query;


  const currentCity =
    mairieEl(
      "mairieHealthCurrentCity"
    );


  if(
    currentCity
  ){

    currentCity.textContent =
      "Annuaire santé de " +
      commune;

  }


  if(
    results
  ){

    results.innerHTML = `

      <div class="mairieCard">

        <div class="mairieTitle">
          Recherche en cours
        </div>

        <div class="mairieText">
          Recherche des professionnels
          correspondant à votre demande…
        </div>

      </div>

    `;

  }


  const healthApi =
    window.BociteHealthAPI;


  if(
    !healthApi ||
    typeof healthApi.search !==
      "function"
  ){

    showHealthNotConnected();

    return;
  }


  const response =
    await healthApi.search({

      commune:
        commune,

      query:
        query

    });


  if(
    !response ||
    response.connected !== true ||
    !Array.isArray(
      response.rows
    )
  ){

    showHealthNotConnected();

    return;
  }


  window.BOCITEART_HEALTH_DIRECTORY = {

    professionnels:
      response.rows,

    communes:{}

  };


  mairieHealthRender();


  function showHealthNotConnected(){

    if(
      !results
    ){
      return;
    }


    results.innerHTML = `

      <div class="mairieCard">

        <div class="mairieTitle">
          Annuaire en cours de raccordement
        </div>

        <div class="mairieText">

          ${
            query

              ? `
                Votre recherche
                <strong>« ${mairieEsc(query)} »</strong>
                pour la commune de
                <strong>${mairieEsc(commune)}</strong>
                est bien prise en compte.
              `

              : `
                La commune de
                <strong>${mairieEsc(commune)}</strong>
                est bien sélectionnée.
              `
          }

          <br><br>

          Les données officielles
          des professionnels de santé
          ne sont pas encore raccordées
          à l’annuaire Bo’CitéArt.

          <br><br>

          Dès ce raccordement effectué,
          cette recherche affichera
          les professionnels correspondant
          à votre demande.

        </div>

      </div>

    `;


    results.scrollIntoView({

      behavior:
        "smooth",

      block:
        "start"

    });

  }

}

  /* =====================================================
     CHOIX DE LA COMMUNE
     ===================================================== */

  if(
    openCommune
  ){

    openCommune.onclick =
      function(){

        mairieHealthRender();

      };
  }


  if(
    communeInput
  ){

    communeInput.addEventListener(

      "keydown",

      function(
        event
      ){

        if(
          event.key ===
            "Enter"
        ){

          event.preventDefault();

          mairieHealthRender();

        }

      }

    );

  }


  /* =====================================================
     RETOUR À MA COMMUNE
     ===================================================== */

  if(
    ownCommune
  ){

    ownCommune.onclick =
      function(){

        const commune =
          mairieHealthDefaultCommune();


        if(
          communeInput
        ){

          communeInput.value =
            commune;

        }


        if(
          searchInput
        ){

          searchInput.value =
            "";

        }


        mairieHealthRender();

      };

  }


  /* =====================================================
     BOUTON RECHERCHER
     ===================================================== */

  if(
    searchButton
  ){

    searchButton.onclick =
      launchHealthSearch;

  }


  /* =====================================================
     TOUCHE ENTRÉE DANS LA RECHERCHE
     ===================================================== */

  if(
    searchInput
  ){

    searchInput.addEventListener(

      "keydown",

      function(
        event
      ){

        if(
          event.key ===
            "Enter"
        ){

          event.preventDefault();

          launchHealthSearch();

        }

      }

    );

  }


  /* =====================================================
     FICHES PROFESSIONNELLES
     ===================================================== */

  if(
    results
  ){

    results.addEventListener(

      "click",

      function(
        event
      ){

        const open =
          event.target.closest(
            "[data-mairie-health-open]"
          );


        if(
          open
        ){

          mairieHealthShowProfessional(

            open.getAttribute(
              "data-mairie-health-open"
            )

          );


          return;
        }


        const back =
          event.target.closest(
            "#mairieHealthBackToResults"
          );


        if(
          back
        ){

          mairieHealthRender();

        }

      }

    );

  }


  mairieHealthRender();

}
/* =========================================================
   OUVERTURE DE L'ANNUAIRE
   ========================================================= */

function openHealthServices(){

  mairieEnsureStyles();


  mairieOpenModal(

    "Annuaire santé",

    mairieHealthHtml()

  );


  mairieSetModalHeader(
    "Annuaire santé"
  );


  window.setTimeout(

    mairieBindHealthDirectory,

    0

  );

}


/* =========================================================
   ÉCOLE → MAIRIE
   ========================================================= */

function mairieSchoolHistory(){

  const rows =
    mairieRead(
      SCHOOL_HISTORY_KEY,
      []
    );


  return Array.isArray(
    rows
  )

    ? rows

    : [];
}


function mairieSaveSchoolHistory(
  rows
){

  return mairieWrite(
    SCHOOL_HISTORY_KEY,

    Array.isArray(
      rows
    )

      ? rows.slice(
          -500
        )

      : []
  );
}


function mairieParseSchoolScan(
  raw
){

  const text =
    mairieText(
      raw
    );


  if(
    !text
  ){

    throw new Error(
      "Scannez ou collez d’abord le code transmis par l’école."
    );
  }


  let payload;


  try{

    if(
      window.boScanEngine &&
      typeof window.boScanEngine.parse ===
        "function"
    ){

      payload =
        window.boScanEngine
          .parse(
            text
          );

    }else{

      payload =
        JSON.parse(
          text
        );
    }

  }catch(error){

    throw new Error(
      "Le code transmis par l’école n’est pas lisible."
    );
  }


  if(
    !payload ||
    typeof payload !==
      "object" ||
    payload.type !==
      "school_wallet"
  ){

    throw new Error(
      "Ce code ne correspond pas à un échange École → Mairie."
    );
  }


  const amount =
    Number(
      payload.wallet ||
      0
    );


  if(
    !Number.isFinite(
      amount
    ) ||
    amount <
      0
  ){

    throw new Error(
      "Le montant transmis par l’école est invalide."
    );
  }


  return {

    type:
      "school_wallet",

    className:
      mairieText(
        payload.class ||
        payload.className
      ) ||
      "Classe non renseignée",

    amount:
      amount,

    solidarity:
      payload.solidarity &&
      typeof payload.solidarity ===
        "object"

        ? mairieClone(
            payload.solidarity
          )

        : {
            mode:
              "none",

            map:{}
          },

    ts:
      Number(
        payload.ts ||
        0
      ) ||
      Date.now(),

    raw:
      mairieClone(
        payload
      )
  };
}


function mairieSchoolReference(
  payload
){

  return [

    mairieText(
      payload.className
    ),

    String(
      payload.amount
    ),

    String(
      payload.ts
    )

  ].join(
    "|"
  );
}


function mairieReadSchoolScan(){

  const input =
    mairieEl(
      "mairieSchoolScanInput"
    );


  const out =
    mairieEl(
      "mairieSchoolReadOut"
    );


  try{

    const parsed =
      mairieParseSchoolScan(

        input
          ? input.value
          : ""
      );


    lastSchoolPayload =
      parsed;


    if(
      out
    ){

      out.dataset.state =
        "ok";


      out.innerHTML =

        "Classe : " +
        mairieEsc(
          parsed.className
        ) +

        "<br>Montant : " +
        mairieEsc(
          parsed.amount
        ) +
        " bocitecoins JAUNE" +

        "<br>Transmission : " +
        mairieEsc(

          new Date(
            parsed.ts
          )
            .toLocaleString(
              "fr-FR"
            )
        );
    }


    return parsed;

  }catch(error){

    lastSchoolPayload =
      null;


    if(
      out
    ){

      out.dataset.state =
        "error";


      out.textContent =
        error.message ||
        "Lecture impossible.";
    }


    return null;
  }
}


function mairieValidateSchoolExchange(){

  const payload =
    lastSchoolPayload ||
    mairieReadSchoolScan();


  if(
    !payload
  ){
    return;
  }


  const rows =
    mairieSchoolHistory();


  const reference =
    mairieSchoolReference(
      payload
    );


  const duplicate =
    rows.find(
      function(
        item
      ){

        return (
          mairieText(
            item.reference
          ) ===
          reference
        );
      }
    );


  const out =
    mairieEl(
      "mairieSchoolReadOut"
    );


  if(
    duplicate
  ){

    if(
      out
    ){

      out.dataset.state =
        "warn";


      out.textContent =
        "Cet échange École → Mairie est déjà enregistré.";
    }


    return duplicate;
  }


  const operation = {

    id:
      mairieId(
        "school-exchange"
      ),

    reference:
      reference,

    className:
      payload.className,

    bocitecoins:
      payload.amount,

    solidarity:
      mairieClone(
        payload.solidarity
      ),

    sourceTs:
      payload.ts,

    status:
      "validated",

    validatedAt:
      mairieNow()

  };


  rows.push(
    operation
  );


  mairieSaveSchoolHistory(
    rows
  );


  if(
    out
  ){

    out.dataset.state =
      "ok";


    out.textContent =
      "Échange École → Mairie confirmé et enregistré.";
  }


  return operation;
}


function mairieShowSchoolHistory(){

  const rows =
    mairieSchoolHistory()
      .slice()
      .reverse();


  mairieOpenModal(
    "Historique École avec Bo'CitéArt",

    `

      <div class="bociteMairieRoot">

        <div class="mairieCard mairieSchool">

          ${mairieCardTitle(
            "Historique École → Mairie"
          )}

          <div class="mairieText">

            ${

              rows.length

                ? rows

                    .map(
                      function(
                        item
                      ){

                        return `

                          <div
                            style="
                              margin-top:10px;
                            "
                          >

                            ${mairieEsc(
                              item.className ||
                              "Classe"
                            )}

                            —

                            ${mairieEsc(
                              item.bocitecoins ||
                              0
                            )}

                            bocitecoins JAUNE

                            <br>

                            ${mairieEsc(

                              item.validatedAt

                                ? new Date(
                                    item.validatedAt
                                  )
                                    .toLocaleString(
                                      "fr-FR"
                                    )

                                : "Date non renseignée"
                            )}

                          </div>

                        `;
                      }
                    )

                    .join("")

                : "Aucun échange École → Mairie enregistré."
            }

          </div>

        </div>

      </div>

    `
  );


  mairieSetModalHeader(
    "Historique École avec"
  );
}


function mairieResetSchoolHistory(){

  if(
    !window.confirm(
      "Réinitialiser l’historique École → Mairie enregistré sur cet appareil ?"
    )
  ){
    return;
  }


  mairieSaveSchoolHistory(
    []
  );


  lastSchoolPayload =
    null;


  const out =
    mairieEl(
      "mairieSchoolReadOut"
    );


  if(
    out
  ){

    out.dataset.state =
      "ok";


    out.textContent =
      "Historique École → Mairie réinitialisé.";
  }
}


function mairieExportSchoolHistory(){

  const data =
    JSON.stringify(

      {

        exportedAt:
          mairieNow(),

        records:
          mairieSchoolHistory()

      },

      null,

      2
    );


  const blob =
    new Blob(
      [
        data
      ],
      {
        type:
          "application/json;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const a =
    document.createElement(
      "a"
    );


  a.href =
    url;


  a.download =
    "bociteart-mairie-ecole-" +
    new Date()
      .toISOString()
      .slice(
        0,
        10
      ) +
    ".json";


  document.body
    .appendChild(
      a
    );


  a.click();


  a.remove();


  window.setTimeout(
    function(){

      URL.revokeObjectURL(
        url
      );

    },
    0
  );
}


/* =========================================================
   SPORT → MAIRIE
   UTILISE LE RACCORD SPORT DÉJÀ EXISTANT
   ========================================================= */

function mairieSportBridge(){

  if(
    window.BociteSportMairie &&
    typeof window.BociteSportMairie ===
      "object"
  ){

    return window
      .BociteSportMairie;
  }


  return null;
}


function mairieSportAssociations(){

  if(
    window.BociteSportModule &&
    typeof window.BociteSportModule.getAssociations ===
      "function"
  ){

    const rows =
      window.BociteSportModule
        .getAssociations();


    return Array.isArray(
      rows
    )

      ? rows

      : [];
  }


  return [];
}


function mairieSportAssociationOptions(){

  const rows =
    mairieSportAssociations();


  if(
    !rows.length
  ){

    return (
      '<option value="">' +
      "Association validée à sélectionner lorsque la liste est disponible" +
      "</option>"
    );
  }


  return (

    '<option value="">' +
      "Choisir l’association" +
    "</option>" +


    rows

      .map(
        function(
          item
        ){

          const id =
            mairieText(
              item.id
            );


          const name =
            mairieText(
              item.name ||
              item.legalName ||
              item.label
            );


          return (
            '<option value="' +
            mairieEsc(
              id
            ) +
            '">' +
            mairieEsc(
              name
            ) +
            "</option>"
          );
        }
      )

      .join("")
  );
}


function mairieParseSportScan(
  raw
){

  const text =
    mairieText(
      raw
    );


  if(
    !text
  ){

    throw new Error(
      "Scannez ou collez d’abord le code du club."
    );
  }


  let scan;


  try{

    scan =
      JSON.parse(
        text
      );

  }catch(error){

    throw new Error(
      "Le code Sport n’est pas lisible."
    );
  }


  if(
    !scan ||
    typeof scan !==
      "object" ||
    scan.type !==
      "sport_club_ref"
  ){

    throw new Error(
      "Ce code ne correspond pas à un club Sport."
    );
  }


  return scan;
}


function mairieReadSportScan(){

  const bridge =
    mairieSportBridge();


  const out =
    mairieEl(
      "mairieSportReadOut"
    );


  if(
    !bridge ||
    typeof bridge.readClub !==
      "function"
  ){

    if(
      out
    ){

      out.dataset.state =
        "error";


      out.textContent =
        "Le raccord Sport → Mairie n’est pas chargé.";
    }


    return null;
  }


  try{

    const input =
      mairieEl(
        "mairieSportScanInput"
      );


    const scan =
      mairieParseSportScan(

        input
          ? input.value
          : ""
      );


    const result =
      bridge.readClub(
        scan
      );


    if(
      !result ||
      result.ok !==
        true
    ){

      throw new Error(
        "Le club présenté n’a pas été reconnu."
      );
    }


    lastSportScan =
      scan;


    if(
      out
    ){

      out.dataset.state =
        "ok";


      out.innerHTML =

        "Club : " +

        mairieEsc(

          result.club &&
          (
            result.club.name ||
            result.club.officialName
          ) ||

          "Club partenaire"
        ) +

        "<br>Solde Sport : " +

        mairieEsc(
          result.balance ||
          0
        ) +

        " bocitecoins" +

        "<br>Cabas disponible : " +

        (
          result.canRedeemBag
            ? "oui"
            : "non"
        ) +

        "<br>Reliquat de fin de saison transférable : " +

        (
          result.canTransferRemainder
            ? "oui"
            : "non"
        );
    }


    return result;

  }catch(error){

    lastSportScan =
      null;


    if(
      out
    ){

      out.dataset.state =
        "error";


      out.textContent =
        error.message ||
        "Lecture Sport impossible.";
    }


    return null;
  }
}


async function mairieValidateSportExchange(){

  const bridge =
    mairieSportBridge();


  const out =
    mairieEl(
      "mairieSportReadOut"
    );


  if(
    !bridge ||
    typeof bridge.validateClubScan !==
      "function"
  ){

    if(
      out
    ){

      out.dataset.state =
        "error";


      out.textContent =
        "Le raccord Sport → Mairie n’est pas chargé.";
    }

    return;
  }


  if(
    !lastSportScan
  ){

    mairieReadSportScan();
  }


  if(
    !lastSportScan
  ){
    return;
  }


  try{

    const result =
      await bridge
        .validateClubScan(
          lastSportScan
        );


    if(
      !result ||
      result.ok !==
        true
    ){

      const messages = {

        insufficient_balance:
          "Le club ne dispose pas encore des 30 bocitecoins nécessaires.",

        invalid_scan:
          "Le code du club n’est pas reconnu.",

        food_limit_reached:
          "La limite applicable à cette catégorie est atteinte."

      };


      throw new Error(

        messages[
          result &&
          result.reason
        ] ||

        "L’échange Sport n’a pas pu être validé."
      );
    }


    if(
      out
    ){

      out.dataset.state =
        "ok";


      out.textContent =
        "Échange Sport → Mairie confirmé. Nouveau solde du club : " +
        String(
          result.balance == null
            ? "—"
            : result.balance
        ) +
        " bocitecoins.";
    }


    return result;

  }catch(error){

    if(
      out
    ){

      out.dataset.state =
        "error";


      out.textContent =
        error.message ||
        "La validation Sport a échoué.";
    }
  }
}


function mairieTransferSportRemainder(){

  const bridge =
    mairieSportBridge();


  const out =
    mairieEl(
      "mairieSportReadOut"
    );


  if(
    !bridge ||
    typeof bridge.transferRemainderToAssociation !==
      "function"
  ){

    if(
      out
    ){

      out.dataset.state =
        "error";


      out.textContent =
        "Le transfert de reliquat Sport n’est pas disponible.";
    }

    return;
  }


  if(
    !lastSportScan
  ){

    mairieReadSportScan();
  }


  if(
    !lastSportScan
  ){
    return;
  }


  const select =
    mairieEl(
      "mairieSportAssociation"
    );


  const associationId =
    mairieText(

      select
        ? select.value
        : ""
    );


  if(
    !associationId
  ){

    if(
      out
    ){

      out.dataset.state =
        "warn";


      out.textContent =
        "Choisissez d’abord une association validée.";
    }

    return;
  }


  const result =
    bridge
      .transferRemainderToAssociation(

        lastSportScan,

        associationId
      );


  if(
    !result ||
    result.ok !==
      true
  ){

    const messages = {

      invalid_scan:
        "Le code du club n’est pas reconnu.",

      association_not_eligible:
        "L’association sélectionnée n’est pas validée pour cette opération.",

      empty_balance:
        "Le club ne dispose d’aucun reliquat.",

      bag_still_available:
        "Le solde du club permet encore un Cabas de 30 bocitecoins. Le reliquat ne peut donc pas être transféré."

    };


    if(
      out
    ){

      out.dataset.state =
        "error";


      out.textContent =

        messages[
          result.reason
        ] ||

        "Le transfert du reliquat n’a pas pu être effectué.";
    }


    return result;
  }


  if(
    out
  ){

    out.dataset.state =
      "ok";


    out.textContent =
      "Reliquat de fin de saison transmis à l’association validée. Solde du club : 0 bocitecoin.";
  }


  return result;
}


function mairieShowSportHistory(){

  const bridge =
    mairieSportBridge();


  if(
    !bridge
  ){

    alert(
      "Le raccord Sport → Mairie n’est pas chargé."
    );

    return;
  }


  const exchanges =
    typeof bridge.history ===
      "function"

      ? bridge.history()

      : [];


  const solidarity =
    typeof bridge.solidarityHistory ===
      "function"

      ? bridge.solidarityHistory()

      : [];


  const exchangeRows =
    Array.isArray(
      exchanges
    )

      ? exchanges
          .slice()
          .reverse()

      : [];


  const solidarityRows =
    Array.isArray(
      solidarity
    )

      ? solidarity
          .slice()
          .reverse()

      : [];


  mairieOpenModal(
    "Historique Sport avec Bo'CitéArt",

    `

      <div class="bociteMairieRoot">


        <div class="mairieCard mairieSport">

          ${mairieCardTitle(
            "Échanges clubs"
          )}

          <div class="mairieText">

            ${

              exchangeRows.length

                ? exchangeRows

                    .slice(
                      0,
                      100
                    )

                    .map(
                      function(
                        item
                      ){

                        return `

                          <div
                            style="
                              margin-top:10px;
                            "
                          >

                            ${mairieEsc(
                              item.clubName ||
                              "Club"
                            )}

                            <br>

                            ${mairieEsc(
                              item.date ||
                              item.createdAt ||
                              ""
                            )}

                          </div>

                        `;
                      }
                    )

                    .join("")

                : "Aucun échange Sport enregistré."
            }

          </div>

        </div>


        <div class="mairieCard mairieSport">

          ${mairieCardTitle(
            "Reliquats de fin de saison"
          )}

          <div class="mairieText">

            ${

              solidarityRows.length

                ? solidarityRows

                    .slice(
                      0,
                      100
                    )

                    .map(
                      function(
                        item
                      ){

                        return `

                          <div
                            style="
                              margin-top:10px;
                            "
                          >

                            ${mairieEsc(
                              item.clubName ||
                              "Club"
                            )}

                            →

                            ${mairieEsc(
                              item.associationName ||
                              "Association"
                            )}

                            <br>

                            ${mairieEsc(
                              item.bocitecoins ||
                              0
                            )}

                            bocitecoins

                            —

                            ${mairieEsc(
                              item.date ||
                              item.createdAt ||
                              ""
                            )}

                          </div>

                        `;
                      }
                    )

                    .join("")

                : "Aucun reliquat Sport enregistré."
            }

          </div>

        </div>


      </div>

    `
  );


  mairieSetModalHeader(
    "Historique Sport avec"
  );
}

/* =========================================================
   FINANCE
   LECTURE DU MOTEUR COMMUN EXISTANT
   AUCUN DEUXIÈME MOTEUR DE PAIEMENT
   ========================================================= */

function mairieFinanceSummary(){

  if(
    !window.BociteFinanceSport ||
    window.BociteFinanceSport.ready !==
      true ||
    typeof window.BociteFinanceSport.getDailyAdminSummary !==
      "function"
  ){

    return {

      ready:
        false,

      message:
        "Le raccord Finance commun n’est pas chargé."

    };
  }


  try{

    const summary =
      window.BociteFinanceSport
        .getDailyAdminSummary();


    return {

      ready:
        true,

      summary:
        summary &&
        typeof summary ===
          "object"

          ? summary

          : {}

    };

  }catch(error){

    return {

      ready:
        false,

      message:
        "Le contrôle Finance n’a pas pu être lu."

    };
  }
}


function mairieRenderFinanceStatus(){

  const out =
    mairieEl(
      "mairieFinanceStatus"
    );


  if(
    !out
  ){
    return;
  }


  const state =
    mairieFinanceSummary();


  if(
    !state.ready
  ){

    out.dataset.state =
      "warn";


    out.textContent =
      state.message;


    return;
  }


  const summary =
    state.summary ||
    {};


  const level =
    mairieText(
      summary.level ||
      summary.status ||
      summary.state
    ) ||
    "ready";


  const alerts =
    Array.isArray(
      summary.alerts
    )

      ? summary.alerts

      : [];


  out.dataset.state =
    alerts.length

      ? "warn"

      : "ok";


  out.innerHTML =

    "Finance commune raccordée." +

    "<br>État : " +
    mairieEsc(
      level
    ) +

    "<br>Alertes à traiter : " +
    mairieEsc(
      alerts.length
    );
}


/* =========================================================
   ÉCRAN PRINCIPAL MAIRIE
   ========================================================= */

function mairieMainHtml(){

  return `

    <div class="bociteMairieRoot">


      <div class="mairieCard">

        <div class="mairieTitle">

          Accès habitants — services utiles avec
          ${mairieBrandHtml()}

        </div>


        <div class="mairieText">

          La Mairie rassemble ici
          des informations pratiques
          et des accès utiles
          à la vie locale.

        </div>


        <div class="mairieGrid">

          <button
            id="openMairieServicesBtn"
            class="mairieBtn"
            type="button"
          >
            Services municipaux
          </button>
       
       <button
  id="openHealthServicesBtn"
  class="mairieBtn"
  type="button"
>
  Santé et professionnels utiles
</button>

        </div>

      </div>


      <div class="mairieCard">

        <div class="mairieTitle">

          Messages gratuits d’intérêt général avec
          ${mairieBrandHtml()}

        </div>


        <div class="mairieText">

         Les informations d’urgence ou d’intérêt général
diffusées par la mairie restent immédiatement visibles
dans le
<span
  style="
    color:#b3282d;
    font-weight:400;
  "
>
  petit bandeau rouge
</span>
de la tuile Mairie.

        </div>


        <ul>

          <li>
            Urgence, tempête ou vigilance météo
          </li>

          <li>
            Rue barrée ou déviation
          </li>

          <li>
            Risque de gel ou température dangereuse
          </li>

          <li>
            Information de sécurité publique
          </li>

        </ul>

      </div>


      <div class="mairieCard">

        <div class="mairieTitle">

          Publicité mairie & association avec
          ${mairieBrandHtml()}

        </div>


        <div class="mairieText">

          La mairie
          et les associations
          disposent de leurs propres accès.

          <br><br>

          Les opérations payantes utilisent
          le moteur Finance commun de
          ${mairieBrandHtml()}.

          Aucun deuxième circuit de paiement
          n’est créé dans ce module.

        </div>

      </div>

      <!-- =================================================
           PORTE INSTITUTIONNELLE MAIRIE
           ================================================= -->

      <div class="mairieCard">

        <div class="mairieTitle">

          Espace institutionnel de la commune avec
          ${mairieBrandHtml()}

        </div>


        <div class="mairieText">

          Cet espace est réservé
          aux personnes habilitées
          par la commune.

          <br><br>

          Chaque accès est personnel
          et rattaché au compte permanent
          de la commune.

        </div>


        <label
          class="mairieLabel"
          for="mairieAccountNumber"
        >
          Numéro de compte de la commune
        </label>


        <input
          class="mairieField"
          id="mairieAccountNumber"
          type="text"
          autocomplete="off"
          placeholder="Ex. BCA-000001"
        >


        <label
          class="mairieLabel"
          for="mairiePersonalId"
          style="
            margin-top:10px;
          "
        >
          Identifiant personnel
        </label>


        <input
          class="mairieField"
          id="mairiePersonalId"
          type="text"
          autocomplete="username"
          placeholder="Votre identifiant personnel"
        >


        <button
          id="mairieInstitutionContinueBtn"
          class="mairieBtn mairieFull"
          type="button"
          style="
            margin-top:12px;
          "
        >
          Continuer
        </button>

<button
  id="mairieDevControlBtn"
  class="mairieBtn mairieFull"
  type="button"
  style="
    margin-top:10px;
  "
>
  Contrôle Bo’CitéArt
</button>

        <div
          id="mairieInstitutionAccessMsg"
          class="mairieText"
          style="
            margin-top:10px;
            display:none;
          "
        ></div>

      </div>


      <div
        id="mairieAdminPanel"
        class="mairieHidden"
      >

        <!-- =================================================
             MESSAGE BANDEAU
             ================================================= -->

        <div class="mairieCard">

          <div class="mairieTitle">

            Message bandeau mairie interne

          </div>


          <div class="mairieText">

            Ce message alimente
            le petit bandeau rouge défilant
            sur la tuile Mairie.

          </div>


          <label
            class="mairieLabel"
            for="mairieMsgInput"
          >
            Message
          </label>


          <input
            class="mairieField"
            id="mairieMsgInput"
            maxlength="280"
            placeholder="Information locale à diffuser"
          >


          <div class="mairieActions">

            <button
              class="mairieBtn"
              id="mairieMsgSave"
              type="button"
            >
              Enregistrer le message
            </button>


            <button
              class="mairieBtn"
              id="mairieMsgReset"
              type="button"
            >
              Effacer le message
            </button>

          </div>


          ${mairieStatus(
            "mairieMsgStatus",
            ""
          )}

        </div>
        
        <!-- =================================================
             ÉCOLE → MAIRIE
             ================================================= -->

        <div class="mairieCard mairieSchool">

          <div class="mairieTitle">

            Lecture École → Mairie

          </div>


          <div class="mairieText">

            La mairie lit le code
            transmis par l’école,
            contrôle les informations présentées
            puis confirme l’échange.

          </div>


          <label
            class="mairieLabel"
            for="mairieSchoolScanInput"
          >
            Code transmis par l’école
          </label>


          <textarea
            id="mairieSchoolScanInput"
            class="mairieField"
            placeholder="Scanner ou coller le code de la classe"
          ></textarea>


          <div class="mairieActions">

            <button
              class="mairieBtn"
              id="mairieSchoolReadBtn"
              type="button"
            >
              Consulter le scan
            </button>


            <button
              class="mairieBtn"
              id="mairieSchoolValidateBtn"
              type="button"
            >
              Confirmer l’échange avec l’école
            </button>


            <button
              class="mairieBtn"
              id="mairieSchoolHistoryBtn"
              type="button"
            >
              Consulter l’historique
            </button>


            <button
              class="mairieBtn"
              id="mairieSchoolExportBtn"
              type="button"
            >
              Exporter l’historique
            </button>


            <button
              class="mairieBtn"
              id="mairieSchoolHistoryResetBtn"
              type="button"
            >
              Réinitialiser l’historique
            </button>

          </div>


          ${mairieStatus(
            "mairieSchoolReadOut",
            "Aucun code École lu pour le moment."
          )}

        </div>


        <!-- =================================================
             SPORT → MAIRIE
             ================================================= -->

        <div class="mairieCard mairieSport">

          <div class="mairieTitle">

            Lecture Sport → Mairie

          </div>


          <div class="mairieText">

            Cet espace utilise directement
            le raccord Sport déjà en place.

            <br><br>

            La mairie lit le club,
            confirme les échanges prévus
            et gère le reliquat de fin de saison
            lorsqu’il est inférieur
            à 30 bocitecoins.

          </div>


          <label
            class="mairieLabel"
            for="mairieSportScanInput"
          >
            Code du club
          </label>


          <textarea
            id="mairieSportScanInput"
            class="mairieField"
            placeholder="Scanner ou coller le code du club"
          ></textarea>


          <div class="mairieActions">

            <button
              class="mairieBtn"
              id="mairieSportReadBtn"
              type="button"
            >
              Consulter le club
            </button>


            <button
              class="mairieBtn"
              id="mairieSportValidateBtn"
              type="button"
            >
              Confirmer l’échange Sport
            </button>


            <button
              class="mairieBtn"
              id="mairieSportHistoryBtn"
              type="button"
            >
              Consulter l’historique Sport
            </button>

          </div>


          <label
            class="mairieLabel"
            for="mairieSportAssociation"
          >
            Association validée
            pour un reliquat de fin de saison
          </label>


          <select
            id="mairieSportAssociation"
            class="mairieField"
          >

            ${mairieSportAssociationOptions()}

          </select>


          <button
            id="mairieSportRemainderBtn"
            class="mairieBtn mairieFull"
            type="button"
            style="
              margin-top:10px;
            "
          >
            Transmettre le reliquat
            à l’association validée
          </button>


          ${mairieStatus(
            "mairieSportReadOut",
            "Aucun code Sport lu pour le moment."
          )}

        </div>

        <!-- =================================================
             RECHERCHE MÉDICALE — ESPACE PRIVÉ MAIRIE
             ================================================= -->

        <div class="mairieCard">

          <div class="mairieTitle">
            Recherche médicale — associations retenues
          </div>


          <div class="mairieText">

            La commune sélectionne les associations
            qu’elle souhaite soutenir.

            <br><br>

            Un premier contrôle automatique
            vérifie les informations disponibles,
            les comptes,
            les activités de recherche
            et la cohérence de l’utilisation
            des ressources.

            <br><br>

            Après le choix de la commune,
            un second contrôle Bo’CitéArt
            est effectué automatiquement.

            <br><br>

            Seules les associations
            ayant satisfait aux deux contrôles
            peuvent être retenues
            pour une durée d’un an.

          </div>

          <!-- =============================================
     ÉTAT DU SERVICE
     ============================================= -->

<div
  style="
    margin-top:16px;
    padding:14px;
    background:#ffffff;
    border:2px solid rgba(0,0,0,.08);
    border-radius:12px;
  "
>

  <div class="mairieTitle">
    État du service
  </div>

  <div class="mairieText">

    ✓ Registre des associations :
    <strong>actif</strong>

    <br><br>

    ○ Recherche automatique :
    <strong>en attente de raccordement</strong>

    <br><br>

    ○ Contrôle Mairie :
    <strong>en attente de raccordement</strong>

    <br><br>

    ○ Second contrôle Bo’CitéArt :
    <strong>en attente de raccordement</strong>

    <br><br>

    ○ Versements sécurisés :
    <strong>en attente de raccordement</strong>

  </div>

</div>


          <!-- =============================================
               NOMBRE D'ASSOCIATIONS
               ============================================= -->

          <label
            class="mairieLabel"
            for="mairieResearchTargetCount"
          >
            Nombre d’associations à retenir
          </label>


          <select
            id="mairieResearchTargetCount"
            class="mairieField"
          >

            <option value="1">
              1 association
            </option>

            <option value="2">
              2 associations
            </option>

            <option value="3">
              3 associations
            </option>

            <option
              value="4"
              selected
            >
              4 associations
            </option>

          </select>


          <!-- =============================================
               RECHERCHE AUTOMATIQUE
               ============================================= -->

          <div
            class="mairieText"
            style="margin-top:14px;"
          >

            Bo’CitéArt recherche en priorité
            les structures engagées
            dans la recherche pédiatrique,
            les maladies rares
            ou orphelines,
            puis élargit la recherche
            lorsque cela est nécessaire.

          </div>

       <button
  id="mairieResearchSearchBtn"
  class="mairieBtn mairieFull"
  type="button"
  disabled
  style="margin-top:10px;"
>
  Recherche automatique — raccordement en cours
</button>

          <!-- =============================================
               ASSOCIATION CONNUE PAR LA MAIRIE
               ============================================= -->

          <label
            class="mairieLabel"
            for="mairieResearchAssociationName"
            style="margin-top:14px;"
          >
            Vérifier une association proposée par la commune
          </label>


          <input
            id="mairieResearchAssociationName"
            class="mairieField"
            maxlength="160"
            placeholder="Nom de l’association"
          >


         <button
  id="mairieResearchCheckBtn"
  class="mairieBtn mairieFull"
  type="button"
  disabled
  style="margin-top:10px;"
>
  Contrôle automatique — raccordement en cours
</button>


          ${mairieStatus(
            "mairieResearchAgentStatus",
            "Aucune association contrôlée pour le moment."
          )}


          <!-- =============================================
               CANDIDATURES TROUVÉES
               ============================================= -->

          <div
            class="mairieTitle"
            style="margin-top:18px;"
          >
            Associations proposées et contrôlées
          </div>


          <div
            id="mairieResearchCandidates"
            class="mairieText"
            style="margin-top:10px;"
          >

            Aucune association proposée
            pour le moment.

          </div>


          <!-- =============================================
               SÉLECTION 1 À 4
               ============================================= -->

          <button
  id="mairieResearchConfirmSelectionBtn"
  class="mairieBtn mairieFull"
  type="button"
  disabled
  style="margin-top:14px;"
>
  Confirmation — raccordement en cours
</button>


          ${mairieStatus(
            "mairieResearchSelectionStatus",
            "Aucune sélection annuelle validée."
          )}


          <!-- =============================================
               SECOND CONTRÔLE BO'CITÉART
               ============================================= -->

          <div
            class="mairieTitle"
            style="margin-top:18px;"
          >
            Contrôle Bo’CitéArt
          </div>


          <div
            id="mairieResearchBociteartReview"
            class="mairieText"
            style="margin-top:10px;"
          >

            Le second contrôle démarre
            automatiquement après confirmation
            de la sélection par la commune.

          </div>


          <!-- =============================================
               ASSOCIATIONS ACTIVES
               ============================================= -->

          <div
            class="mairieTitle"
            style="margin-top:18px;"
          >
            Associations validées pour l’année
          </div>


          <div
            id="mairieResearchActiveList"
            class="mairieText"
            style="margin-top:10px;"
          >

            Aucune association active
            pour le moment.

          </div>


          <!-- =============================================
               ENVELOPPE ANNUELLE
               ============================================= -->

          <div
            class="mairieTitle"
            style="margin-top:18px;"
          >
            Enveloppe annuelle de soutien
          </div>


          <div class="mairieText">

            La commune indique uniquement
            le montant total qu’elle souhaite consacrer
            à cette action.

            <br><br>

            La répartition entre les associations
            validées est calculée automatiquement.

            <br><br>

            Cette enveloppe financière
            est indépendante des points Bo’CitéArt.

          </div>


          <label
            class="mairieLabel"
            for="mairieResearchEnvelopeAmount"
          >
            Montant total annuel en euros
          </label>


          <input
            id="mairieResearchEnvelopeAmount"
            class="mairieField"
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            placeholder="Exemple : 20000"
          >


          <button
  id="mairieResearchPreviewDistributionBtn"
  class="mairieBtn mairieFull"
  type="button"
  disabled
  style="margin-top:10px;"
>
  Calcul de la répartition — raccordement en cours
</button>


          <div
            id="mairieResearchDistributionPreview"
            class="mairieText"
            style="margin-top:12px;"
          >

            La répartition apparaîtra ici
            avant validation.

          </div>


        <button
  id="mairieResearchValidateEnvelopeBtn"
  class="mairieBtn mairieFull"
  type="button"
  disabled
  style="margin-top:10px;"
>
  Validation — raccordement en cours
</button>


          ${mairieStatus(
            "mairieResearchEnvelopeStatus",
            ""
          )}


          <!-- =============================================
               REMERCIEMENTS OFFICIELS
               ============================================= -->

          <div
            class="mairieTitle"
            style="margin-top:18px;"
          >
            Confirmations et remerciements
          </div>


          <div class="mairieText">

            Après réception du versement,
            l’association confirme les fonds reçus,
            transmet le justificatif demandé
            et adresse son message de remerciement.

            <br><br>

            Le message validé rejoint ensuite
            le fil officiel Bo’CitéArt
            destiné aux espaces concernés.

          </div>


          <div
            id="mairieResearchThanksFeed"
            class="mairieText"
            style="margin-top:10px;"
          >

            ✨ Aucun remerciement reçu
            pour le moment.

          </div>

        </div>

        <!-- =================================================
             FIN — RECHERCHE MÉDICALE
             ================================================= -->

        <!-- =================================================
             FINANCE
             ================================================= -->

        <div class="mairieCard">

          <div class="mairieTitle">

            État Finance de la commune

          </div>


          <div class="mairieText">

            Cet espace présente
            l’état des opérations financières
            utiles à la commune
            dans ${mairieBrandHtml()}.

            <br><br>

            Les informations affichées ici
            permettent de vérifier
            que les opérations concernées
            sont correctement prises en compte.

          </div>

          <button
            id="mairieFinanceRefreshBtn"
            class="mairieBtn mairieFull"
            type="button"
            style="
              margin-top:10px;
            "
          >
            Actualiser l’état Finance
          </button>


          ${mairieStatus(
            "mairieFinanceStatus",
            "État Finance non encore lu."
          )}

        </div>


      </div>

    </div>

  `;
}

/* =========================================================
   ÉVÉNEMENTS DE L'ÉCRAN MAIRIE
   ========================================================= */

function mairieBindMainEvents(){

/* =====================================================
   SERVICES
   ===================================================== */

const openServices =
  mairieEl(
    "openMairieServicesBtn"
  );


if(
  openServices
){

  openServices.onclick =
    openMairieServices;
}

/* =====================================================
   SANTÉ — SIMPLE ORIENTATION
   ===================================================== */

const openHealthButton =
  mairieEl(
    "openHealthServicesBtn"
  );


if(
  openHealthButton
){

  openHealthButton.onclick =
    function(){

      mairieOpenModal(
        "Santé et professionnels utiles",
        `

          <div class="bociteMairieRoot">

            <div class="mairieCard">

              <div class="mairieTitle">
                Vous recherchez un médecin ou un professionnel de santé ?
              </div>

              <div class="mairieText">

                Retrouvez les médecins,
                spécialistes,
                pharmacies
                et autres professionnels de santé
                directement dans l’espace

                <strong>
                  « Annuaire santé + aide »
                </strong>

                situé en bas de l’application.

                <br><br>

                Vous y trouverez également
                les aides de proximité
                et les contacts utiles.

              </div>

            </div>

          </div>

        `
      );

    };
}
  /* =====================================================
     PORTE INSTITUTIONNELLE MAIRIE
     ÉTAPE 1 — IDENTIFICATION DU COMPTE ET DE LA PERSONNE
     ===================================================== */

  const institutionContinue =
    mairieEl(
      "mairieInstitutionContinueBtn"
    );

  const accountNumber =
    mairieEl(
      "mairieAccountNumber"
    );

  const personalId =
    mairieEl(
      "mairiePersonalId"
    );


  const accessMsg =
    mairieEl(
      "mairieInstitutionAccessMsg"
    );


  const panel =
    mairieEl(
      "mairieAdminPanel"
    );

     const devControl =
    mairieEl(
      "mairieDevControlBtn"
    );


  if(
    devControl &&
    panel
  ){

    devControl.onclick =
      function(){

        panel.classList.toggle(
          "mairieHidden"
        );


        const isOpen =
          !panel.classList.contains(
            "mairieHidden"
          );


        devControl.textContent =
          isOpen
            ? "Fermer le contrôle Bo’CitéArt"
            : "Contrôle Bo’CitéArt";


        if(
          isOpen
        ){

          mairieRenderFinanceStatus();
        }

      };
  }

  /*
   * L'espace interne reste fermé
   * tant que le parcours d'identification
   * n'est pas terminé.
   */

  if(
    panel
  ){

    panel.classList.add(
      "mairieHidden"
    );
  }


  if(
    institutionContinue
  ){

    institutionContinue.onclick =
      function(){

       const account =
  accountNumber
    ? String(accountNumber.value || "")
        .trim()
        .toUpperCase()
    : "";


const identity =
  personalId
    ? String(personalId.value || "")
        .trim()
    : "";


        if(
          accessMsg
        ){

          accessMsg.style.display =
            "block";

          accessMsg.innerHTML =
            "";
        }


        if(
          !account ||
          !identity
        ){

          if(
            accessMsg
          ){

            accessMsg.innerHTML = `
              <div
                style="
                  color:#8b1e1e;
                "
              >
                Renseignez le numéro de compte
                de la commune
                et votre identifiant personnel.
              </div>
            `;
          }

          return;
        }


        if(
          !/^BCA-[0-9]{6}$/.test(
            account
          )
        ){

          if(
            accessMsg
          ){

            accessMsg.innerHTML = `
              <div
                style="
                  color:#8b1e1e;
                "
              >
                Le numéro de compte
                doit respecter le format
                BCA-000001.
              </div>
            `;
          }

          return;
        }


        if(
          accountNumber
        ){

          accountNumber.value =
            account;
        }


        if(
          accessMsg
        ){

          accessMsg.innerHTML = `

            <div
              class="mairieTitle"
              style="
                margin-top:4px;
              "
            >
              Accès personnel
            </div>


            <div
              class="mairieText"
            >

              Compte commune :
              <strong>${account}</strong>

              <br><br>

              Identifiant :
              <strong>${identity}</strong>

              <br><br>

              Choisissez la situation
              correspondant à votre accès.

            </div>


            <div
              class="mairieActions"
              style="
                margin-top:12px;
              "
            >

              <button
                id="mairieFirstAccessBtn"
                class="mairieBtn"
                type="button"
              >
                Premier accès
              </button>


              <button
                id="mairieExistingAccessBtn"
                class="mairieBtn"
                type="button"
              >
                Accès déjà activé
              </button>

            </div>

          `;
        }


        const firstAccess =
          mairieEl(
            "mairieFirstAccessBtn"
          );


        const existingAccess =
          mairieEl(
            "mairieExistingAccessBtn"
          );


        if(
          firstAccess
        ){

          firstAccess.onclick =
            function(){

              if(
                accessMsg
              ){

                accessMsg.innerHTML = `

                  <div
                    class="mairieTitle"
                  >
                    Premier accès
                  </div>


                  <div
                    class="mairieText"
                  >

                    Le compte de la commune
                    et l’identifiant personnel
                    ont été renseignés.

                    <br><br>

                    L’étape suivante permettra
                    de saisir l’accès provisoire
                    transmis séparément,
                    puis de créer
                    le mot de passe personnel
                    et d’activer le 2FA.

                  </div>

                `;
              }
            };
        }


        if(
          existingAccess
        ){

          existingAccess.onclick =
            function(){

              if(
                accessMsg
              ){

                accessMsg.innerHTML = `

                  <div
                    class="mairieTitle"
                  >
                    Accès déjà activé
                  </div>


                  <div
                    class="mairieText"
                  >

                    L’étape suivante permettra
                    de saisir le mot de passe personnel
                    puis de confirmer l’accès
                    avec le 2FA.

                  </div>

                `;
              }
            };
        }

      };
  }

  const messageInput =
    mairieEl(
      "mairieMsgInput"
    );


  const saved =
    mairieLoad();


  if(
    messageInput
  ){

    messageInput.value =
      mairieText(
        saved &&
        saved.message
      );
  }


  const messageSave =
    mairieEl(
      "mairieMsgSave"
    );


  if(
    messageSave
  ){

    messageSave.onclick =
      function(){

        const status =
          mairieEl(
            "mairieMsgStatus"
          );


        const message =
          mairieText(

            messageInput
              ? messageInput.value
              : ""
          );


        if(
          !message
        ){

          if(
            status
          ){

            status.dataset.state =
              "warn";


            status.textContent =
              "Renseignez un message avant de l’enregistrer.";
          }

          return;
        }


        mairieSave({

          message:
            message,

          ts:
            Date.now(),

          ts_fr:
            new Date()
              .toLocaleString(
                "fr-FR"
              )

        });


        renderMairieTicker();


        if(
          status
        ){

          status.dataset.state =
            "ok";


          status.textContent =
            "Message mairie enregistré et transmis à la tuile.";
        }
      };
  }


  const messageReset =
    mairieEl(
      "mairieMsgReset"
    );


  if(
    messageReset
  ){

    messageReset.onclick =
      function(){

        if(
          !window.confirm(
            "Effacer le message de la tuile Mairie ?"
          )
        ){
          return;
        }


        mairieSave(
          {}
        );


        if(
          messageInput
        ){

          messageInput.value =
            "";
        }


        renderMairieTicker();


        const status =
          mairieEl(
            "mairieMsgStatus"
          );


        if(
          status
        ){

          status.dataset.state =
            "ok";


          status.textContent =
            "Message mairie effacé.";
        }
      };
  }


  /* =====================================================
     ÉCOLE → MAIRIE
     ===================================================== */

  const schoolRead =
    mairieEl(
      "mairieSchoolReadBtn"
    );


  if(
    schoolRead
  ){

    schoolRead.onclick =
      mairieReadSchoolScan;
  }


  const schoolValidate =
    mairieEl(
      "mairieSchoolValidateBtn"
    );


  if(
    schoolValidate
  ){

    schoolValidate.onclick =
      mairieValidateSchoolExchange;
  }


  const schoolHistory =
    mairieEl(
      "mairieSchoolHistoryBtn"
    );


  if(
    schoolHistory
  ){

    schoolHistory.onclick =
      mairieShowSchoolHistory;
  }


  const schoolReset =
    mairieEl(
      "mairieSchoolHistoryResetBtn"
    );


  if(
    schoolReset
  ){

    schoolReset.onclick =
      mairieResetSchoolHistory;
  }


  const schoolExport =
    mairieEl(
      "mairieSchoolExportBtn"
    );


  if(
    schoolExport
  ){

    schoolExport.onclick =
      mairieExportSchoolHistory;
  }


  /* =====================================================
     SPORT → MAIRIE
     ===================================================== */

  const sportRead =
    mairieEl(
      "mairieSportReadBtn"
    );


  if(
    sportRead
  ){

    sportRead.onclick =
      mairieReadSportScan;
  }


  const sportValidate =
    mairieEl(
      "mairieSportValidateBtn"
    );


  if(
    sportValidate
  ){

    sportValidate.onclick =
      mairieValidateSportExchange;
  }


  const sportHistory =
    mairieEl(
      "mairieSportHistoryBtn"
    );


  if(
    sportHistory
  ){

    sportHistory.onclick =
      mairieShowSportHistory;
  }


  const sportRemainder =
    mairieEl(
      "mairieSportRemainderBtn"
    );


  if(
    sportRemainder
  ){

    sportRemainder.onclick =
      mairieTransferSportRemainder;
  }


  /* =====================================================
     FINANCE
     ===================================================== */

  const financeRefresh =
    mairieEl(
      "mairieFinanceRefreshBtn"
    );


  if(
    financeRefresh
  ){

    financeRefresh.onclick =
      mairieRenderFinanceStatus;
  }
}


/* =========================================================
   OUVERTURE DU MODULE MAIRIE
   ========================================================= */

function openMairiePanel(){

  mairieEnsureStyles();


  lastSchoolPayload =
    null;


  lastSportScan =
    null;


  mairieOpenModal(

    "Mairie avec Bo'CitéArt",

    mairieMainHtml()
  );


  mairieSetModalHeader(
    "Mairie avec"
  );


  window.setTimeout(
    mairieBindMainEvents,
    0
  );
}


/* =========================================================
   API PUBLIQUE DU MODULE MAIRIE
   ========================================================= */

window.BociteMairieModule = {

  version:
    VERSION,

  ready:
    true,

  open:
    openMairiePanel,

    openHealth:
    openHealthServices,

  renderTicker:
    renderMairieTicker,

  loadMessage:
    mairieLoad,

  saveMessage:
    mairieSave,

  getSchoolHistory:
    function(){

      return mairieClone(
        mairieSchoolHistory()
      );
    },

  getReferralHistory:
    function(){

      return mairieClone(
        mairieReferralHistory()
      );
    }

};


window.openMairiePanel =
  openMairiePanel;


window.renderMairieTicker =
  renderMairieTicker;


window.mairieLoad =
  mairieLoad;


window.mairieSave =
  mairieSave;


/* =========================================================
   INSTALLATION DU MODULE
   ========================================================= */

function mairieInstall(){

  mairieEnsureStyles();

  renderMairieTicker();
}


if(
  document.readyState ===
    "loading"
){

  document.addEventListener(

    "DOMContentLoaded",

    mairieInstall,

    {
      once:true
    }
  );

}else{

  mairieInstall();
}


console.info(
  "✅ Bo'CitéArt Mairie — module externe chargé"
);

/* =========================================================
   ÇA COMMENCE ICI — MAIRIE — CORRECTION BOUTONS PRINCIPAUX
   ========================================================= */

if(!window.__bociteMairieMainButtonsFixed){

  window.__bociteMairieMainButtonsFixed = true;

  document.addEventListener(
    "click",
    function(event){

      const target =
        event.target instanceof Element
          ? event.target
          : null;

      if(!target){
        return;
      }


      /* =====================================================
         SERVICES MUNICIPAUX
         ===================================================== */

      const servicesButton =
        target.closest(
          "#openMairieServicesBtn"
        );

      if(servicesButton){

        event.preventDefault();

        const cityUrl =
          String(
            window.BOCITEART_CITY_OFFICIAL_URL ||
            "https://www.wattignies.fr"
          ).trim();

        window.open(
          cityUrl,
          "_blank",
          "noopener,noreferrer"
        );

        return;
      }


      /* =====================================================
         ESPACE INTERNE MAIRIE
         ===================================================== */

      const adminButton =
        target.closest(
          "#toggleMairieAdminBtn"
        );

      if(adminButton){

        event.preventDefault();

        const panel =
          document.getElementById(
            "mairieAdminPanel"
          );

        if(!panel){

          console.warn(
            "Bo'CitéArt Mairie : panneau interne introuvable."
          );

          return;
        }

        const isHidden =
          window
            .getComputedStyle(panel)
            .display ===
          "none";

        panel.style.display =
          isHidden
            ? "block"
            : "none";

        adminButton.textContent =
          isHidden
            ? "Fermer l’espace interne mairie"
            : "Ouvrir l’espace interne mairie";

        if(isHidden){

          window.setTimeout(
            function(){

              panel.scrollIntoView({
                behavior:"smooth",
                block:"start"
              });

            },
            50
          );
        }

        return;
      }

    }
  );
}

/* =========================================================
   ÇA FINIT ICI — MAIRIE — CORRECTION BOUTONS PRINCIPAUX
   ========================================================= */
   
})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART — MODULE MAIRIE EXTERNE
   ========================================================= */

