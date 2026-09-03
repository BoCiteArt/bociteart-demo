/* =========================================================
   BO'CITÉART — MODULE SPORT EXTERNE
   Fichier : sport/bociteart-sport.js

   Ce fichier contient le moteur complet de la tuile Sport.
   Il est chargé par index.html mais n'ouvre rien
   automatiquement au chargement.
   ========================================================= */

(function(){
  "use strict";


  /* =========================================================
     PROTECTION CONTRE UN DOUBLE CHARGEMENT
     ========================================================= */

  if(
    window.__bociteSportModuleLoaded
  ){
    return;
  }

  window.__bociteSportModuleLoaded=
    true;


  /* =========================================================
     PASSERELLES VERS LES FONCTIONS GÉNÉRALES DE INDEX.HTML
     ========================================================= */

  const openModal=
    (...args)=>{

      if(
        typeof window.openModal !==
        "function"
      ){

        console.error(
          "Bo'CitéArt Sport : openModal indisponible."
        );

        return;
      }

      return window.openModal(
        ...args
      );
    };


  const openWellbeingMap=
    (...args)=>{

      if(
        typeof window.openWellbeingMap !==
        "function"
      ){

        alert(
          "La carte est momentanément indisponible."
        );

        return;
      }

      return window.openWellbeingMap(
        ...args
      );
    };


  const logPilotageAccess=
    (...args)=>{

      if(
        typeof window.logPilotageAccess ===
        "function"
      ){

        return window.logPilotageAccess(
          ...args
        );
      }
    };


  /* =========================================================
     SPORT — CLÉS DE STOCKAGE
     ========================================================= */

  const SPORT_KEYS={

    wallet:
      "bociteart_sport_wallet_v3",

    ledger:
      "bociteart_sport_ledger_v3",

    access:
      "bociteart_sport_access_v3",

    accessSecurity:
      "bociteart_sport_access_security_v1",

    club:
      "bociteart_sport_club_v4",

    training:
      "bociteart_sport_training_v3",

    reports:
      "bociteart_sport_reports_v4",

    solidarity:
      "bociteart_sport_solidarity_v4",

    exchanges:
      "bociteart_sport_exchanges_v4",

    season:
      "bociteart_sport_season_v2",

    contacts:
      "bociteart_sport_support_contacts_v2",

    associations:
      "bociteart_sport_associations_v2",

    dossiers:
      "bociteart_sport_support_dossiers_v2",

    receipts:
      "bociteart_sport_receipts_v2",

    mairieTransfers:
      "bociteart_sport_mairie_transfers_v2",

    payments:
      "bociteart_sport_payments_v2",

    pubs:
      "bociteart_sport_pubs_v3",

    governance:
      "bociteart_sport_governance_v1",

    governanceReports:
      "bociteart_sport_governance_reports_v1",

    mandateHistory:
      "bociteart_sport_mandate_history_v1"
  };


  /* =========================================================
     SPORT — CONFIGURATION
     ========================================================= */

  const SPORT_CONFIG=
    Object.assign(
      {

        mode:
          "preproduction",

        clubId:
          "sport-club-local",

        resultsEndpoint:
          "",

        identityEndpoint:
          "",

        authEndpoint:
          "",

        scanEndpoint:
          "",

        notificationEndpoint:
          "",

        governanceEndpoint:
          "",

        governanceReportEndpoint:
          "",

        supportEndpoint:
          "",

        merchantLookupEndpoint:
          "",

        checkoutEndpoint:
          "",

        paymentStatusEndpoint:
          "",

        billingProductCode:
          "SPORT_TAPE_7D",

        supportMinimumHT:
          50,

        schoolYearEndMonthDay:
          "07-07",

        mairieSportAccountCode:
          "MAIRIE-SPORT-SOLIDARITE"

      },

      window.BOCITEART_SPORT_CONFIG ||
      {}
    );


  /* =========================================================
     SESSION SPORT
     ========================================================= */

  let sportSession=
    window.bociteartSportSession ||
    {

      role:"",
      accountId:"",
      name:"",
      team:""
    };


  /* =========================================================
     OUTILS GÉNÉRAUX
     ========================================================= */

  const sportEl=
    id =>
      document.getElementById(
        id
      );


  const sportLoad=
    (
      key,
      fallback
    )=>{

      try{

        const raw=
          localStorage.getItem(
            key
          );

        return raw
          ? JSON.parse(raw)
          : fallback;

      }catch(error){

        return fallback;
      }
    };


  const sportSave=
    (
      key,
      value
    )=>{

      try{

        localStorage.setItem(
          key,
          JSON.stringify(
            value
          )
        );

        return true;

      }catch(error){

        return false;
      }
    };


  const sportId=
    prefix =>
      String(
        prefix ||
        "sport"
      ) +
      "-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,8);


  const sportEsc=
    value =>
      String(
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


  /* =========================================================
     IDENTITÉ VISUELLE Bo'CitéArt
     ========================================================= */

  const sportBrandHtml=
    () =>
      '<span class="bociteSportLogo">' +
      "Bo'Cité" +
      '<span class="bociteSportArt">' +
      "Art" +
      "</span>" +
      "</span>";

/* =========================================================
   ÇA COMMENCE ICI — PROTECTION DU TITRE SPORT
   ========================================================= */

function sportSetModalHeader(
  before
){

  const title =
    sportEl(
      "modalTitle"
    );

  const body =
    sportEl(
      "modalBody"
    );

  if(
    !title ||
    !body
  ){
    return;
  }

  /*
   * Sport ne peut modifier le titre que si la fenêtre
   * actuellement affichée contient réellement Sport.
   */
  if(
    !body.querySelector(
      ".bociteSportRoot"
    )
  ){
    return;
  }

  title.innerHTML =
    sportEsc(
      before ||
      ""
    ) +
    " " +
    sportBrandHtml();
}

/* =========================================================
   ÇA FINIT ICI — PROTECTION DU TITRE SPORT
   ========================================================= */

  function sportTitle(
    before,
    after=""
  ){

    return `

      <div
        class="sportTitleCard"
      >

        <div
          class="sportTitleText"
        >

          ${sportEsc(
            before
          )}

          ${sportBrandHtml()}

          ${
            after
              ? " " +
                sportEsc(
                  after
                )
              : ""
          }

        </div>

      </div>

    `;
  }

  /* =========================================================
     STYLES DU MODULE SPORT
     ========================================================= */

  function sportStyles(){

    return `

      <style>

        #modal .head{
          background:#ffffff !important;
        }


        #modalTitle{
          color:#2f5d46 !important;
          font-size:17px !important;
          font-weight:700 !important;
        }


        #modalTitle .bociteSportLogo{
          display:inline-block;
          color:#2f5d46 !important;
          font-weight:700 !important;
          white-space:nowrap !important;
        }


        #modalTitle .bociteSportArt{
          color:#b00020 !important;
          font-weight:700 !important;
        }


        .bociteSportRoot{
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.55;
        }


        .bociteSportRoot *{
          box-sizing:border-box;
        }


        .sportTitleCard{
          margin-top:14px;
          padding:12px 14px;
          background:#ffffff;
          border:1px solid rgba(47,93,70,.30);
          border-radius:14px;
        }


        .sportTitleCard:first-child{
          margin-top:0;
        }


        .sportTitleText,
        .sportSubTitle{
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
          line-height:1.35;
        }


        .sportCard,
        .walletBox{
          margin-top:8px;
          padding:14px;
          background:#ffffff !important;
          border:1px solid rgba(47,93,70,.20) !important;
          border-radius:14px;
          color:#111111 !important;
          font-size:14px !important;
          font-weight:400 !important;
          line-height:1.55 !important;
        }


        .sportText,
        .walletSub{
          color:#111111 !important;
          font-size:14px !important;
          font-weight:400 !important;
          line-height:1.55 !important;
        }


        .bociteSportRoot ul{
          margin:10px 0 0 20px;
          padding:0;
        }


        .bociteSportRoot li{
          margin:6px 0;
          font-weight:400;
        }


        .bociteSportLogo{
          display:inline-block;
          color:#2f5d46 !important;
          font-weight:700 !important;
          white-space:nowrap !important;
        }


        .bociteSportArt{
          color:#b00020 !important;
          font-weight:700 !important;
        }


        .sportBtn,
        .walletMini{
          background:#ffffff !important;
          color:#2f5d46 !important;
          border:1px solid rgba(47,93,70,.38) !important;
          border-radius:10px;
          padding:9px 12px;
          min-height:42px;
          font-size:14px !important;
          font-weight:700 !important;
          cursor:pointer;
        }


        .sportBtnDanger{
          color:#8e001a !important;
          border-color:rgba(176,0,32,.35) !important;
        }


        .sportActions{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
          margin-top:12px;
        }


        .sportActions > button{
          flex:1 1 180px;
        }


        .sportField{
          width:100%;
          margin-top:6px;
          padding:10px;
          background:#ffffff !important;
          color:#111111 !important;
          border:1px solid rgba(47,93,70,.28) !important;
          border-radius:10px;
          font-size:14px !important;
          font-weight:400 !important;
        }


        textarea.sportField{
          min-height:100px;
          resize:vertical;
        }


        .sportLabel{
          display:block;
          margin-top:10px;
          color:#111111;
          font-size:14px;
          font-weight:400;
        }


        .sportCheck{
          display:flex;
          gap:9px;
          align-items:flex-start;
          margin-top:8px;
        }


        .sportStatus,
        .sportItem{
          margin-top:10px;
          padding:10px;
          background:#ffffff;
          border:1px solid rgba(47,93,70,.18);
          border-radius:10px;
          color:#111111;
          font-size:14px;
          font-weight:400;
        }


        .sportName{
          color:#2f5d46;
          font-size:15px;
          font-weight:700;
        }


        .sportPill{
          display:inline-block;
          margin:5px 5px 0 0;
          padding:4px 8px;
          border:1px solid rgba(47,93,70,.25);
          border-radius:999px;
          font-size:12px;
        }


        .walletTitle{
          color:#2f5d46 !important;
          font-size:17px !important;
          font-weight:700 !important;
        }


        .walletValue{
          font-size:34px;
          font-weight:700;
          line-height:1.1;
          margin-top:6px;
        }

      </style>

    `;
  }


  /* =========================================================
     DATE DE FIN DE SAISON PAR DÉFAUT
     ========================================================= */

  function sportDefaultSeasonEndDate(){

    const now=
      new Date();


    const parts=
      String(
        SPORT_CONFIG
          .schoolYearEndMonthDay ||
        "07-07"
      )
        .split("-");


    const month=
      Math.max(
        1,
        Math.min(
          12,
          Number(
            parts[0] ||
            7
          )
        )
      );


    const day=
      Math.max(
        1,
        Math.min(
          31,
          Number(
            parts[1] ||
            7
          )
        )
      );


    let year=
      now.getFullYear();


    if(
      now >
      new Date(
        year,
        month - 1,
        day,
        23,
        59,
        59
      )
    ){

      year++;
    }


    return (
      `${year}-` +
      `${String(month).padStart(2,"0")}-` +
      `${String(day).padStart(2,"0")}`
    );
  }


/* =========================================================
   FIN DU BLOC SPORT 1
   LE BLOC 2 SE COLLE IMMÉDIATEMENT DESSOUS
   ========================================================= */

/* =========================================================
   BLOC SPORT 2
   IDENTITÉ DU CLUB
   GOUVERNANCE / CONTINUITÉ
   PORTEFEUILLE BOCITECOINS
   ========================================================= */


/* =========================================================
   IDENTITÉ DE LA STRUCTURE SPORTIVE
   ========================================================= */

function sportClub(){

  const base={

    id:
      SPORT_CONFIG.clubId,

    clubRef:
      "",

    name:
      "Club partenaire",

    officialName:
      "",

    commune:
      "",

    organizationType:
      "association_sportive",

    legalForm:
      "",

    sirenSiret:
      "",

    rnaNumber:
      "",

    vatStatus:
      "to_verify",

    vatNumber:
      "",

    accountingEmail:
      "",

    sportName:
      "",

    federation:
      "",

    league:
      "",

    officialClubId:
      "",

    officialResultsUrl:
      "",

    publicNetworkUrl:
      "",

    teams:
      [],

    seasonEndDate:
      sportDefaultSeasonEndDate(),

    identityStatus:
      "pending"
  };


  const saved=
    sportLoad(
      SPORT_KEYS.club,
      null
    );


  if(
    !saved ||
    typeof saved !==
    "object"
  ){

    return base;
  }


  return Object.assign(
    {},
    base,
    saved,
    {

      teams:
        Array.isArray(
          saved.teams
        )
          ? saved.teams
          : []
    }
  );
}


const sportSaveClub=
  club =>
    sportSave(
      SPORT_KEYS.club,
      club
    );


/* =========================================================
   HISTORIQUE DES MANDATS
   APPARTIENT À LA STRUCTURE
   ========================================================= */

function sportMandateHistory(){

  const rows=
    sportLoad(
      SPORT_KEYS.mandateHistory,
      []
    );

  return Array.isArray(rows)
    ? rows
    : [];
}


function sportSaveMandateHistory(
  rows
){

  return sportSave(
    SPORT_KEYS.mandateHistory,
    Array.isArray(rows)
      ? rows.slice(-500)
      : []
  );
}


function sportRecordMandateEvent(
  type,
  governance,
  source
){

  const rows=
    sportMandateHistory();


  rows.push({

    id:
      sportId(
        "mandate"
      ),

    clubId:
      SPORT_CONFIG.clubId,

    clubRef:
      sportClub()
        .clubRef ||
      "",

    type:
      String(
        type ||
        "governance_update"
      ),

    presidentName:
      String(
        governance &&
        governance.president &&
        governance.president.fullName ||
        ""
      ),

    presidentRole:
      String(
        governance &&
        governance.president &&
        governance.president.role ||
        ""
      ),

    governanceStatus:
      String(
        governance &&
        governance.status ||
        ""
      ),

    activationStatus:
      String(
        governance &&
        governance.activationStatus ||
        ""
      ),

    source:
      String(
        source ||
        "sport_module"
      ),

    createdAt:
      Date.now()
  });


  sportSaveMandateHistory(
    rows
  );
}


/* =========================================================
   GOUVERNANCE PAR DÉFAUT
   ========================================================= */

function sportDefaultGovernance(){

  return {

    clubId:
      SPORT_CONFIG.clubId,

    /*
      draft
      pending_review
      verified
      suspended
      disputed
    */
    status:
      "draft",

    /*
      blocked
      active
    */
    activationStatus:
      "blocked",

    president:{

      fullName:
        "",

      role:
        "Président / responsable légal",

      email:
        "",

      phone:
        "",

      officialReference:
        "",

      verificationStatus:
        "pending"
    },

    continuity:[

      {

        id:
          "continuity-1",

        fullName:
          "",

        role:
          "",

        email:
          "",

        phone:
          "",

        officialReference:
          "",

        verificationStatus:
          "pending"
      },

      {

        id:
          "continuity-2",

        fullName:
          "",

        role:
          "",

        email:
          "",

        phone:
          "",

        officialReference:
          "",

        verificationStatus:
          "pending"
      }
    ],

    submittedAt:
      null,

    verifiedAt:
      null,

    verifiedBy:
      "",

    updatedAt:
      Date.now()
  };
}


/* =========================================================
   CHARGEMENT DE LA GOUVERNANCE
   ========================================================= */

function sportLoadGovernance(){

  const saved=
    sportLoad(
      SPORT_KEYS.governance,
      null
    );


  const base=
    sportDefaultGovernance();


  if(
    !saved ||
    typeof saved !==
    "object"
  ){

    return base;
  }


  const president=
    Object.assign(
      {},
      base.president,
      saved.president ||
      {}
    );


  const savedContinuity=
    Array.isArray(
      saved.continuity
    )
      ? saved.continuity
      : [];


  const continuity=[

    Object.assign(
      {},
      base.continuity[0],
      savedContinuity[0] ||
      {}
    ),

    Object.assign(
      {},
      base.continuity[1],
      savedContinuity[1] ||
      {}
    )
  ];


  return Object.assign(
    {},
    base,
    saved,
    {
      president:
        president,

      continuity:
        continuity
    }
  );
}


/* =========================================================
   ENREGISTREMENT DE LA GOUVERNANCE
   ========================================================= */

function sportSaveGovernance(
  data
){

  if(
    !data ||
    typeof data !==
    "object"
  ){

    return false;
  }


  const clean=
    Object.assign(
      {},
      data,
      {

        clubId:
          SPORT_CONFIG.clubId,

        updatedAt:
          Date.now()
      }
    );


  return sportSave(
    SPORT_KEYS.governance,
    clean
  );
}


/* =========================================================
   CONTRÔLE DE COMPLÉTUDE

   Ceci contrôle uniquement
   que les informations nécessaires
   ont été fournies.

   Cela ne valide jamais
   l'identité ou le mandat.
   ========================================================= */

function sportGovernanceCompleteness(){

  const governance=
    sportLoadGovernance();


  const missing=[];


  const president=
    governance.president ||
    {};


  if(
    !String(
      president.fullName ||
      ""
    ).trim()
  ){

    missing.push(
      "Président / responsable légal"
    );
  }


  if(
    !String(
      president.role ||
      ""
    ).trim()
  ){

    missing.push(
      "Fonction du Président"
    );
  }


  if(
    !String(
      president.email ||
      ""
    ).trim() &&
    !String(
      president.phone ||
      ""
    ).trim()
  ){

    missing.push(
      "Coordonnée du Président"
    );
  }


  const continuity=
    Array.isArray(
      governance.continuity
    )
      ? governance.continuity
      : [];


  for(
    let index=0;
    index<2;
    index++
  ){

    const person=
      continuity[index] ||
      {};


    if(
      !String(
        person.fullName ||
        ""
      ).trim()
    ){

      missing.push(
        "Personne de continuité " +
        (
          index +
          1
        )
      );
    }


    if(
      !String(
        person.role ||
        ""
      ).trim()
    ){

      missing.push(
        "Fonction de la personne de continuité " +
        (
          index +
          1
        )
      );
    }


    if(
      !String(
        person.email ||
        ""
      ).trim() &&
      !String(
        person.phone ||
        ""
      ).trim()
    ){

      missing.push(
        "Coordonnée de la personne de continuité " +
        (
          index +
          1
        )
      );
    }
  }


  return {

    complete:
      missing.length ===
      0,

    missing:
      missing
  };
}


/* =========================================================
   GOUVERNANCE RÉELLEMENT VALIDÉE
   ========================================================= */

function sportGovernanceIsVerified(){

  const governance=
    sportLoadGovernance();


  const completeness=
    sportGovernanceCompleteness();


  if(
    completeness.complete !==
    true
  ){

    return false;
  }


  if(
    governance.status !==
    "verified"
  ){

    return false;
  }


  if(
    governance.activationStatus !==
    "active"
  ){

    return false;
  }


  const president=
    governance.president ||
    {};


  if(
    president.verificationStatus !==
    "verified"
  ){

    return false;
  }


  const continuity=
    Array.isArray(
      governance.continuity
    )
      ? governance.continuity
      : [];


  if(
    continuity.length <
    2
  ){

    return false;
  }


  return continuity
    .slice(
      0,
      2
    )
    .every(
      person =>
        person &&
        person.verificationStatus ===
        "verified"
    );
}


/* =========================================================
   ENREGISTRER UNE NOUVELLE DÉCLARATION
   ========================================================= */

function sportSaveGovernanceDraft(
  president,
  continuity
){

  const people=
    Array.isArray(
      continuity
    )
      ? continuity
      : [];


  const next=
    sportDefaultGovernance();


  next.president={

    fullName:
      String(
        president &&
        president.fullName ||
        ""
      ).trim(),

    role:
      String(
        president &&
        president.role ||
        "Président / responsable légal"
      ).trim(),

    email:
      String(
        president &&
        president.email ||
        ""
      ).trim(),

    phone:
      String(
        president &&
        president.phone ||
        ""
      ).trim(),

    officialReference:
      String(
        president &&
        president.officialReference ||
        ""
      ).trim(),

    verificationStatus:
      "pending"
  };


  next.continuity=
    [
      0,
      1
    ]
      .map(
        index =>{

          const person=
            people[index] ||
            {};


          return {

            id:
              "continuity-" +
              (
                index +
                1
              ),

            fullName:
              String(
                person.fullName ||
                ""
              ).trim(),

            role:
              String(
                person.role ||
                ""
              ).trim(),

            email:
              String(
                person.email ||
                ""
              ).trim(),

            phone:
              String(
                person.phone ||
                ""
              ).trim(),

            officialReference:
              String(
                person.officialReference ||
                ""
              ).trim(),

            verificationStatus:
              "pending"
          };
        }
      );


  next.status=
    "pending_review";


  next.activationStatus=
    "blocked";


  next.submittedAt=
    Date.now();


  next.verifiedAt=
    null;


  next.verifiedBy=
    "";


  sportSaveGovernance(
    next
  );


  sportRecordMandateEvent(
    "governance_submitted",
    next,
    "sport_module"
  );


  return next;
}


/* =========================================================
   APPLIQUER UNE VALIDATION SERVEUR

   Cette fonction reste privée
   à l'intérieur du module Sport.
   ========================================================= */

function sportApplyGovernanceVerification(
  serverResult
){

  if(
    !serverResult ||
    serverResult.verified !==
    true
  ){

    return false;
  }


  const governance=
    sportLoadGovernance();


  governance.status=
    "verified";


  governance.activationStatus=
    "active";


  governance.verifiedAt=
    Date.now();


  governance.verifiedBy=
    String(
      serverResult.verifiedBy ||
      "Bo'CitéArt"
    );


  governance.president=
    Object.assign(
      {},
      governance.president,
      {
        verificationStatus:
          "verified"
      }
    );


  governance.continuity=
    (
      Array.isArray(
        governance.continuity
      )
        ? governance.continuity
        : []
    )
      .slice(
        0,
        2
      )
      .map(
        person =>
          Object.assign(
            {},
            person,
            {
              verificationStatus:
                "verified"
            }
          )
      );


  sportSaveGovernance(
    governance
  );


  sportRecordMandateEvent(
    "governance_verified",
    governance,
    String(
      serverResult.verifiedBy ||
      "server"
    )
  );


  return true;
}


/* =========================================================
   DEMANDER LA VÉRIFICATION AU SERVEUR
   ========================================================= */

async function sportSubmitGovernanceVerification(){

  const governance=
    sportLoadGovernance();


  const completeness=
    sportGovernanceCompleteness();


  if(
    !completeness.complete
  ){

    return {

      ok:false,

      reason:
        "incomplete",

      missing:
        completeness.missing
    };
  }


  /*
    Sans serveur sécurisé raccordé,
    aucune validation artificielle
    n'est créée dans le navigateur.
  */
  if(
    !SPORT_CONFIG
      .governanceEndpoint
  ){

    return {

      ok:true,

      verified:false,

      pending:true
    };
  }


  try{

    const response=
      await fetch(
        SPORT_CONFIG
          .governanceEndpoint,
        {

          method:
            "POST",

          credentials:
            "include",

          headers:{

            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({

              clubId:
                SPORT_CONFIG.clubId,

              clubRef:
                sportClub()
                  .clubRef ||
                "",

              governance:
                governance
            })
        }
      );


    if(
      !response.ok
    ){

      return {

        ok:false,

        verified:false,

        pending:true,

        reason:
          "verification_unavailable"
      };
    }


    const result=
      await response.json();


    if(
      result &&
      result.verified ===
      true
    ){

      sportApplyGovernanceVerification(
        result
      );


      return {

        ok:true,

        verified:true
      };
    }


    return {

      ok:true,

      verified:false,

      pending:true
    };


  }catch(error){

    return {

      ok:false,

      verified:false,

      pending:true,

      reason:
        "network_error"
    };
  }
}


/* =========================================================
   VERROU DES FONCTIONS SENSIBLES
   ========================================================= */

function sportRequireVerifiedGovernance(){

  if(
    sportGovernanceIsVerified()
  ){

    return true;
  }


  alert(
    "La gouvernance de la structure doit être vérifiée avant l’ouverture de cette fonction réservée."
  );


  return false;
}


/* =========================================================
   PORTEFEUILLE SPORT
   ========================================================= */

function sportWallet(){

  const saved=
    sportLoad(
      SPORT_KEYS.wallet,
      {
        vert:0
      }
    );


  return {

    vert:
      Math.max(
        0,
        Number(
          saved &&
          saved.vert ||
          0
        )
      )
  };
}


function sportSaveWallet(
  wallet
){

  return sportSave(
    SPORT_KEYS.wallet,
    {

      vert:
        Math.max(
          0,
          Number(
            wallet &&
            wallet.vert ||
            0
          )
        )
    }
  );
}


/* =========================================================
   JOURNAL BOCITECOINS SPORT
   ========================================================= */

function sportLedger(){

  const rows=
    sportLoad(
      SPORT_KEYS.ledger,
      []
    );


  return Array.isArray(rows)
    ? rows
    : [];
}


function sportSaveLedger(
  rows
){

  return sportSave(
    SPORT_KEYS.ledger,
    Array.isArray(rows)
      ? rows.slice(-500)
      : []
  );
}


/* =========================================================
   CRÉDITER 1 BOCITECOIN
   ========================================================= */

function sportAddCoin(
  reason,
  reference,
  team
){

  const ledger=
    sportLedger();


  /*
    Une référence unique empêche
    de créditer deux fois
    la même action validée.
  */
  if(
    reference &&
    ledger.some(
      item =>
        String(
          item.reference ||
          ""
        ) ===
        String(
          reference
        )
    )
  ){

    return {

      ok:false,

      duplicate:true,

      balance:
        sportWallet()
          .vert
    };
  }


  const wallet=
    sportWallet();


  wallet.vert +=
    1;


  sportSaveWallet(
    wallet
  );


  ledger.push({

    id:
      sportId(
        "coin"
      ),

    direction:
      "credit",

    amount:
      1,

    reason:
      String(
        reason ||
        ""
      ),

    reference:
      String(
        reference ||
        ""
      ),

    team:
      String(
        team ||
        ""
      ),

    ts:
      Date.now(),

    date:
      new Date()
        .toLocaleString(
          "fr-FR"
        )
  });


  sportSaveLedger(
    ledger
  );


  return {

    ok:true,

    balance:
      wallet.vert
  };
}


/* =========================================================
   DÉBIT D'UN CABAS SPORT
   EXACTEMENT 30 BOCITECOINS
   ========================================================= */

function sportDebitBag(
  actor,
  representative
){

  const wallet=
    sportWallet();


  if(
    wallet.vert <
    30
  ){

    return {

      ok:false,

      reason:
        "insufficient_balance",

      balance:
        wallet.vert
    };
  }


  wallet.vert -=
    30;


  sportSaveWallet(
    wallet
  );


  const ledger=
    sportLedger();


  ledger.push({

    id:
      sportId(
        "bag"
      ),

    direction:
      "debit",

    amount:
      30,

    reason:
      "Cabas Sport",

    actor:
      actor &&
      typeof actor ===
      "object"
        ? actor
        : {},

    representative:
      representative &&
      typeof representative ===
      "object"
        ? representative
        : {},

    ts:
      Date.now(),

    date:
      new Date()
        .toLocaleString(
          "fr-FR"
        )
  });


  sportSaveLedger(
    ledger
  );

  return {

    ok:true,

    balance:
      wallet.vert
  };
}

/* =========================================================
   RELIQUAT DE FIN DE SAISON
   INFÉRIEUR À 30 BOCITECOINS
   ========================================================= */

function sportDebitRemainder(
  associationId
){

  const wallet=
    sportWallet();


  const amount=
    Number(
      wallet.vert ||
      0
    );


  if(
    amount <=
    0
  ){

    return {

      ok:false,

      reason:
        "empty_balance",

      balance:
        amount
    };
  }


  if(
    amount >=
    30
  ){

    return {

      ok:false,

      reason:
        "bag_still_available",

      balance:
        amount
    };
  }


  wallet.vert=
    0;


  sportSaveWallet(
    wallet
  );


  const ledger=
    sportLedger();


  ledger.push({

    id:
      sportId(
        "solidarity"
      ),

    direction:
      "solidarity_transfer",

    amount:
      amount,

    associationId:
      String(
        associationId ||
        ""
      ),

    municipalAccountCode:
      SPORT_CONFIG
        .mairieSportAccountCode,

    ts:
      Date.now(),

    date:
      new Date()
        .toLocaleString(
          "fr-FR"
        )
  });


  sportSaveLedger(
    ledger
  );

  return {

    ok:true,

    amount:
      amount,

    balance:
      0
  };
}

/* =========================================================
   FIN DU BLOC SPORT 2

   LE BLOC SPORT 3
   SE COLLE IMMÉDIATEMENT DESSOUS.
   ========================================================= */

 /* =========================================================
   BLOC SPORT 3
   ACCÈS — DONNÉES — SOUTIENS — CABAS
   ========================================================= */

async function sportHash(v){

  v=
    String(v||"");

  try{

    if(
      crypto &&
      crypto.subtle &&
      TextEncoder
    ){

      const b=
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder()
            .encode(v)
        );

      return Array
        .from(
          new Uint8Array(b)
        )
        .map(
          x =>
            x
              .toString(16)
              .padStart(2,"0")
        )
        .join("");
    }

  }catch(e){}

  return "local:" + v;
}


function sportAccess(){

  const x=
    sportLoad(
      SPORT_KEYS.access,
      null
    );

  if(
    x &&
    Array.isArray(
      x.coaches
    )
  ){

    return {

      clubId:
        String(
          x.clubId ||
          SPORT_CONFIG.clubId
        ),

      president:{

        id:
          "president",

        name:
          String(
            x.president &&
            x.president.name ||
            "Président / responsable légal"
          ),

        active:
          !(
            x.president &&
            x.president.active === false
          )
      },

      coaches:
        x.coaches
    };
  }

  return {

    clubId:
      SPORT_CONFIG.clubId,

    president:{

      id:
        "president",

      name:
        "Président / responsable légal",

      active:
        true
    },

    coaches:[]
  };
}


const sportSaveAccess =
  x => sportSave(
    SPORT_KEYS.access,
    x
  );


const sportNorm =
  v =>
    String(v||"")
      .trim()
      .toUpperCase()
      .replace(/\s+/g,"");


function sportSecurity(){

  const x=
    sportLoad(
      SPORT_KEYS.accessSecurity,
      {}
    );

  return (
    x &&
    typeof x === "object"
  )
    ? x
    : {};
}


function sportLocked(id){

  const k=
    sportNorm(id);

  const d=
    sportSecurity();

  const e=
    d[k];

  if(!e){
    return false;
  }

  if(
    Number(
      e.lockedUntil ||
      0
    ) >
    Date.now()
  ){
    return true;
  }

  if(e.lockedUntil){

    delete d[k];

    sportSave(
      SPORT_KEYS.accessSecurity,
      d
    );
  }

  return false;
}


function sportFail(id){

  const k=
    sportNorm(id);

  const d=
    sportSecurity();

  const e=
    d[k] || {
      failures:0,
      lockedUntil:0
    };

  if(
    e.lockedUntil &&
    Date.now() >=
    e.lockedUntil
  ){
    e.failures=0;
    e.lockedUntil=0;
  }

  e.failures=
    Number(
      e.failures ||
      0
    ) + 1;

  if(
    e.failures >= 3
  ){

    e.lockedUntil=
      Date.now() +
      (
        15 *
        60 *
        1000
      );
  }

  d[k]=e;

  sportSave(
    SPORT_KEYS.accessSecurity,
    d
  );

  try{

    logPilotageAccess(
      "Sport",
      e.lockedUntil
        ? "Accès responsable Sport temporairement verrouillé"
        : "Échec accès responsable Sport"
    );

  }catch(_){}

  return !!e.lockedUntil;
}


function sportResetFail(id){

  const k=
    sportNorm(id);

  const d=
    sportSecurity();

  if(d[k]){

    delete d[k];

    sportSave(
      SPORT_KEYS.accessSecurity,
      d
    );
  }
}


const sportReports=()=>{

  const x=
    sportLoad(
      SPORT_KEYS.reports,
      []
    );

  return Array.isArray(x)
    ? x
    : [];
};


const sportSaveReports =
  x =>
    sportSave(
      SPORT_KEYS.reports,
      Array.isArray(x)
        ? x.slice(-500)
        : []
    );


const sportTrainings=()=>{

  const x=
    sportLoad(
      SPORT_KEYS.training,
      []
    );

  return Array.isArray(x)
    ? x
    : [];
};


const sportSaveTrainings =
  x =>
    sportSave(
      SPORT_KEYS.training,
      Array.isArray(x)
        ? x.slice(-400)
        : []
    );


const sportExchanges=()=>{

  const x=
    sportLoad(
      SPORT_KEYS.exchanges,
      []
    );

  return Array.isArray(x)
    ? x
    : [];
};


const sportSaveExchanges =
  x =>
    sportSave(
      SPORT_KEYS.exchanges,
      Array.isArray(x)
        ? x.slice(-500)
        : []
    );


const sportContacts=()=>{

  const x=
    sportLoad(
      SPORT_KEYS.contacts,
      []
    );

  return Array.isArray(x)
    ? x
    : [];
};


const sportSaveContacts =
  x =>
    sportSave(
      SPORT_KEYS.contacts,
      Array.isArray(x)
        ? x.slice(-500)
        : []
    );


function sportAssociations(){

  const base=[

    {
      id:"A",
      label:"Association solidaire A",
      cause:
        "En attente du choix défini par la mairie et Bo'CitéArt"
    },

    {
      id:"B",
      label:"Association solidaire B",
      cause:
         "En attente du choix défini par la mairie et Bo'CitéArt"
    },

    {
      id:"C",
      label:"Association solidaire C",
      cause:
         "En attente du choix défini par la mairie et Bo'CitéArt"
    },

    {
      id:"D",
      label:"Association solidaire D",
      cause:
         "En attente du choix défini par la mairie et Bo'CitéArt"
    }

  ].map(
    x =>
      Object.assign(
        x,
        {
          active:false,
          verified:false,
          legalName:"",
          sirenSiret:"",
          rnaNumber:"",
          accountingEmail:"",
          canIssueRequiredDocument:false,
          canIssueTaxReceipt:false,
          fiscalEligibilityStatus:"to_verify",
          renewalEligible:true,
          renewalBlockReason:""
        }
      )
  );

  const saved=
    sportLoad(
      SPORT_KEYS.associations,
      []
    );

  const map={};

  if(
    Array.isArray(saved)
  ){

    saved.forEach(
      x=>{

        if(
          x &&
          x.id
        ){
          map[x.id]=x;
        }
      }
    );
  }

  return base.map(
    x =>
      Object.assign(
        {},
        x,
        map[x.id] || {}
      )
  );
}


const sportSaveAssociations =
  x =>
    sportSave(
      SPORT_KEYS.associations,
      Array.isArray(x)
        ? x.slice(0,20)
        : []
    );


const sportAssociationOK =
  a =>
    !!(
      a &&
      a.active === true &&
      a.verified === true &&
      a.canIssueRequiredDocument === true &&
      a.renewalEligible !== false
    );


const sportDossiers=()=>{

  const x=
    sportLoad(
      SPORT_KEYS.dossiers,
      []
    );

  return Array.isArray(x)
    ? x
    : [];
};


const sportSaveDossiers =
  x =>
    sportSave(
      SPORT_KEYS.dossiers,
      Array.isArray(x)
        ? x.slice(-1000)
        : []
    );


const sportReceipts=()=>{

  const x=
    sportLoad(
      SPORT_KEYS.receipts,
      []
    );

  return Array.isArray(x)
    ? x
    : [];
};


const sportSaveReceipts =
  x =>
    sportSave(
      SPORT_KEYS.receipts,
      Array.isArray(x)
        ? x.slice(-1000)
        : []
    );


const sportMairieTransfers=()=>{

  const x=
    sportLoad(
      SPORT_KEYS.mairieTransfers,
      []
    );

  return Array.isArray(x)
    ? x
    : [];
};


const sportSaveMairieTransfers =
  x =>
    sportSave(
      SPORT_KEYS.mairieTransfers,
      Array.isArray(x)
        ? x.slice(-1000)
        : []
    );


function sportAllocation(
  mode,
  amountHT
){

  const amount=
    Math.round(
      Number(amountHT || 0) *
      100
    ) / 100;

  if(
    !Number.isFinite(amount) ||
    amount <
      Number(
        SPORT_CONFIG.supportMinimumHT ||
        50
      )
  ){
    return null;
  }

  const code=
    String(
      mode ||
      ""
    ).toUpperCase();

  if(
    code === "ALL_CLUB" ||
    code === "ALL-CLUB" ||
    code === "100_CLUB" ||
    String(mode) === "all_club"
  ){

    return {

      mode:
        "all_club",

      allocationCode:
        "ALL_CLUB",

      amountHT:
        amount,

      clubHT:
        amount,

      associationHT:
        0
    };
  }

  if(
    code === "HALF_HALF" ||
    code === "50_50" ||
    String(mode) === "half_half"
  ){

    const clubHT=
      Math.round(
        (
          amount /
          2
        ) *
        100
      ) / 100;

    const associationHT=
      Math.round(
        (
          amount -
          clubHT
        ) *
        100
      ) / 100;

    return {

      mode:
        "half_half",

      allocationCode:
        "HALF_HALF",

      amountHT:
        amount,

      clubHT:
        clubHT,

      associationHT:
        associationHT
    };
  }

  return null;
}


function sportReceiptDraft(
  d,
  a
){

  if(
    !d ||
    !a ||
    Number(
      d.allocation
        .associationHT ||
      0
    ) <= 0
  ){
    return null;
  }

  return {

    id:
      sportId("receipt"),

    dossierId:
      d.id,

    operationRef:
      d.operationRef,

    associationId:
      a.id,

    associationName:
      a.legalName ||
      a.label,

    donorName:
      d.merchant.name,

    donorSiret:
      d.merchant.sirenSiret,

    donorAddress:
      d.merchant.address,

    donorEmail:
      d.merchant.accountingEmail ||
      d.merchant.email,

    amountHT:
      d.allocation.associationHT,

    currency:
      "EUR",

    fiscalNature:
      "to_validate_by_association",

    documentTypeRequested:
      "accounting_supporting_document",

    taxReceiptAllowedOnlyIfAssociationConfirmsEligibility:
      a.canIssueTaxReceipt === true,

    status:
      "waiting_association",

    createdAt:
      Date.now()
  };
}


function sportClubDocumentDraft(d){

  if(
    !d ||
    Number(
      d.allocation &&
      d.allocation.clubHT ||
      0
    ) <= 0
  ){
    return null;
  }

  return {

    id:
      sportId(
        "club-document"
      ),

    dossierId:
      d.id,

    operationRef:
      d.operationRef,

    beneficiaryClubRef:
      d.club.clubRef,

    beneficiaryName:
      d.club.officialName ||
      d.club.name,

    beneficiarySiret:
      d.club.sirenSiret,

    beneficiaryVatStatus:
      d.club.vatStatus,

    beneficiaryVatNumber:
      d.club.vatNumber,

    customerName:
      d.merchant.name,

    customerSiret:
      d.merchant.sirenSiret,

    customerEmail:
      d.merchant.accountingEmail ||
      d.merchant.email,

    amountHT:
      d.allocation.clubHT,

    currency:
      "EUR",

    documentType:
      "invoice_or_accounting_document_to_validate",

    vatTreatment:
      "to_validate_from_club_fiscal_status",

    status:
      "waiting_club_validation",

    createdAt:
      Date.now()
  };
}


async function sportCreateSupportDossier(
  scan,
  merchant,
  mode,
  associationId,
  amountHT
){

  const club=
    sportClub();

  const allocation=
    sportAllocation(
      mode,
      amountHT
    );

  merchant=
    merchant &&
    typeof merchant === "object"
      ? merchant
      : {};

  if(
    !club.clubRef ||
    !scan ||
    scan.type !==
    "sport_club_ref" ||
    String(
      scan.clubRef ||
      ""
    ) !==
    String(
      club.clubRef ||
      ""
    )
  ){

    return {
      ok:false,
      reason:
        "invalid_club_scan"
    };
  }

  if(!allocation){

    return {
      ok:false,
      reason:
        "invalid_allocation"
    };
  }

  let association=null;

  if(
    allocation.associationHT >
    0
  ){

    association=
      sportAssociations()
        .find(
          x =>
            String(x.id) ===
            String(
              associationId ||
              ""
            )
        );

    if(
      !sportAssociationOK(
        association
      )
    ){

      return {
        ok:false,
        reason:
          "association_not_eligible"
      };
    }
  }

  const d={

    id:
      sportId("support"),

    operationRef:
      "BCA-SPORT-SOUTIEN-" +
      Date.now(),

    club:{

      clubRef:
        club.clubRef,

      name:
        club.name,

      officialName:
        club.officialName,

      commune:
        club.commune,

      organizationType:
        club.organizationType,

      legalForm:
        club.legalForm,

      sirenSiret:
        club.sirenSiret,

      rnaNumber:
        club.rnaNumber,

      vatStatus:
        club.vatStatus,

      vatNumber:
        club.vatNumber,

      accountingEmail:
        club.accountingEmail
    },

    merchant:{

      id:
        String(
          merchant.id ||
          merchant.merchantId ||
          ""
        ),

      type:
        String(
          merchant.type ||
          "professional"
        ),

      name:
        String(
          merchant.name ||
          merchant.shopName ||
          merchant.companyName ||
          ""
        ),

      sirenSiret:
        String(
          merchant.sirenSiret ||
          merchant.siret ||
          ""
        ),

      address:
        String(
          merchant.address ||
          ""
        ),

      email:
        String(
          merchant.email ||
          ""
        ),

      accountingEmail:
        String(
          merchant.accountingEmail ||
          merchant.email ||
          ""
        ),

      phone:
        String(
          merchant.phone ||
          ""
        )
    },

    allocation:
      allocation,

    association:
      association
        ? {
            id:
              association.id,

            label:
              association.label,

            legalName:
              association.legalName,

            accountingEmail:
              association.accountingEmail
          }
        : null,

    visibility:{
      durationDays:7,
      status:
        "pending_payment_and_validation"
    },

    fiscalQualification:
      "to_validate",

    taxTreatment:
      "not_hardcoded",

    clubDocumentStatus:
      allocation.clubHT > 0
        ? "waiting_club_validation"
        : "not_required",

    receiptStatus:
      allocation.associationHT > 0
        ? "waiting_association"
        : "not_required",

    status:
      "prepared",

    createdAt:
      Date.now()
  };

  d.clubDocumentDraft=
    sportClubDocumentDraft(d);

  d.receiptDraft=
    association
      ? sportReceiptDraft(
          d,
          association
        )
      : null;

  if(
    SPORT_CONFIG.supportEndpoint
  ){

    try{

      const r=
        await fetch(
          SPORT_CONFIG.supportEndpoint,
          {
            method:"POST",
            credentials:"include",
            headers:{
              "Content-Type":
                "application/json"
            },
            body:
              JSON.stringify(d)
          }
        );

      if(r.ok){

        const j=
          await r.json();

        if(
          j &&
          j.operationRef
        ){
          d.operationRef=
            String(
              j.operationRef
            );
        }

        d.status=
          "transmitted";
      }

    }catch(_){

      d.status=
        "waiting_transmission";
    }
  }

  const all=
    sportDossiers();

  all.push(d);

  sportSaveDossiers(all);

  if(d.receiptDraft){

    const q=
      sportReceipts();

    q.push(
      d.receiptDraft
    );

    sportSaveReceipts(q);
  }

  return {
    ok:true,
    dossier:d
  };
}


function sportMarkReceiptReceived(
  dossierId,
  doc
){

  const all=
    sportDossiers();

  const i=
    all.findIndex(
      x =>
        String(x.id) ===
        String(dossierId)
    );

  if(i < 0){

    return {
      ok:false
    };
  }

  all[i].receiptStatus=
    "received";

  all[i].receiptDocument=
    doc || {};

  all[i].receiptReceivedAt=
    Date.now();

  sportSaveDossiers(all);

  const q=
    sportReceipts();

  const j=
    q.findIndex(
      x =>
        String(
          x.dossierId
        ) ===
        String(dossierId)
    );

  if(j >= 0){

    q[j].status=
      "received";

    q[j].receivedAt=
      Date.now();

    sportSaveReceipts(q);
  }

  return {
    ok:true
  };
}


function sportMarkReceiptMissing(
  dossierId
){

  const all=
    sportDossiers();

  const i=
    all.findIndex(
      x =>
        String(x.id) ===
        String(dossierId)
    );

  if(
    i < 0 ||
    !all[i].association
  ){

    return {
      ok:false
    };
  }

  all[i].receiptStatus=
    "missing_blocks_renewal";

  sportSaveDossiers(all);

  const a=
    sportAssociations();

  const j=
    a.findIndex(
      x =>
        String(x.id) ===
        String(
          all[i]
            .association
            .id
        )
    );

  if(j >= 0){

    a[j].renewalEligible=
      false;

    a[j].renewalBlockReason=
      "Justificatif obligatoire non retourné";

    sportSaveAssociations(a);
  }

  return {
    ok:true
  };
}


function sportClubCode(){

  const c=
    sportClub();

  const representative={

    ref:
      String(
        sportSession.accountId ||
        sportSession.role ||
        ""
      ),

    name:
      String(
        sportSession.name ||
        "Responsable du club"
      ),

    role:
      String(
        sportSession.role ||
        ""
      ),

    team:
      String(
        sportSession.team ||
        ""
      )
  };

  return {

    type:
      "sport_club_ref",

    clubId:
      c.id,

    clubRef:
      String(
        c.clubRef ||
        ""
      ),

    clubName:
      String(
        c.name ||
        ""
      ),

    commune:
      String(
        c.commune ||
        ""
      ),

    organizationType:
      String(
        c.organizationType ||
        ""
      ),

    presentedBy:
      representative,

    scanToken:
      "",

    ts:
      Date.now()
  };
}


function sportCreateBagExchangeReceipt(
  exchange,
  balance
){

  if(!exchange){
    return null;
  }

  const receipt={

    id:
      sportId(
        "bag-receipt"
      ),

    documentType:
      "sport_bag_exchange_receipt",

    operationRef:
      String(
        exchange.operationRef ||
        exchange.id ||
        ""
      ),

    clubRef:
      String(
        exchange.clubRef ||
        ""
      ),

    clubName:
      String(
        exchange.clubName ||
        ""
      ),

    amount:
      Number(
        exchange.amount ||
        30
      ),

    balanceAfter:
      Number(
        balance || 0
      ),

    actor:
      exchange.actor || {},

    representative:
      exchange.representative || {},

    purchase:
      exchange.purchase
        ? {
            amountTTC:
              Number(
                exchange.purchase.amountTTC ||
                0
              ),

            reference:
              String(
                exchange.purchase.reference ||
                ""
              )
          }
        : null,

    validatedAt:
      exchange.validatedAt ||
      Date.now(),

    status:
      "recorded",

    createdAt:
      Date.now()
  };

  const receipts=
    sportReceipts();

  receipts.push(
    receipt
  );

  sportSaveReceipts(
    receipts
  );

  return receipt;
}


async function sportNotifyBagExchange(
  exchange,
  balance,
  receipt
){

  if(!exchange){

    return {
      ok:false
    };
  }

  const payload={

    event:
      "sport_bag_redeemed",

    operationRef:
      String(
        exchange.operationRef ||
        exchange.id ||
        ""
      ),

    receiptId:
      String(
        receipt &&
        receipt.id ||
        ""
      ),

    documentType:
      "sport_bag_exchange_receipt",

    clubRef:
      String(
        exchange.clubRef ||
        ""
      ),

    clubName:
      String(
        exchange.clubName ||
        ""
      ),

    amount:
      Number(
        exchange.amount ||
        30
      ),

    balance:
      Number(
        balance || 0
      ),

    actor:
      exchange.actor || {},

    representative:
      exchange.representative || {},

    purchase:
      exchange.purchase
        ? {
            amountTTC:
              Number(
                exchange.purchase.amountTTC ||
                0
              ),

            reference:
              String(
                exchange.purchase.reference ||
                ""
              )
          }
        : null,

    validatedAt:
      exchange.validatedAt ||
      Date.now(),

    requestedChannels:[
      "in_app",
      "email",
      "sms"
    ]
  };

  if(
    !SPORT_CONFIG.notificationEndpoint
  ){

    return {
      ok:true,
      pending:true,
      payload:
        payload
    };
  }

  try{

    const response=
      await fetch(
        SPORT_CONFIG.notificationEndpoint,
        {
          method:"POST",
          credentials:"include",
          headers:{
            "Content-Type":
              "application/json"
          },
          body:
            JSON.stringify(
              payload
            )
        }
      );

    if(!response.ok){

      return {
        ok:false,
        pending:true
      };
    }

    return {
      ok:true,
      sent:true
    };

  }catch(error){

    return {
      ok:false,
      pending:true
    };
  }
}


async function sportValidateBag(
  scan,
  actor
){

  const c=
    sportClub();

  if(
    !c.clubRef ||
    !scan ||
    scan.type !==
    "sport_club_ref"
  ){

    return {
      ok:false,
      reason:
        "invalid_scan"
    };
  }

  if(
    String(
      scan.clubRef ||
      ""
    ) !==
    String(
      c.clubRef
    )
  ){

    return {
      ok:false,
      reason:
        "wrong_club"
    };
  }

  const representative={

    ref:
      String(
        scan.presentedBy &&
        scan.presentedBy.ref ||
        ""
      ),

    name:
      String(
        scan.presentedBy &&
        scan.presentedBy.name ||
        "Responsable du club"
      ),

    role:
      String(
        scan.presentedBy &&
        scan.presentedBy.role ||
        ""
      ),

    team:
      String(
        scan.presentedBy &&
        scan.presentedBy.team ||
        ""
      )
  };

  let purchase=
    null;

  if(
    actor &&
    actor.type ===
    "merchant"
  ){

    const purchaseAmount=
      Number(
        actor.purchaseAmountTTC ||
        0
      );

    const purchaseReference=
      String(
        actor.purchaseReference ||
        ""
      ).trim();

    if(
      purchaseAmount < 10 ||
      !purchaseReference
    ){

      return {
        ok:false,
        reason:
          "purchase_required",
        minimumPurchaseTTC:
          10
      };
    }

    purchase={

      amountTTC:
        purchaseAmount,

      reference:
        purchaseReference
    };
  }

  if(
    SPORT_CONFIG.scanEndpoint
  ){

    try{

      const r=
        await fetch(
          SPORT_CONFIG.scanEndpoint,
          {
            method:"POST",
            credentials:"include",
            headers:{
              "Content-Type":
                "application/json"
            },
            body:
              JSON.stringify({

                action:
                  "redeem_sport_bag",

                clubRef:
                  c.clubRef,

                scanToken:
                  String(
                    scan.scanToken ||
                    ""
                  ),

                amount:
                  30,

                actor:
                  actor || {},

                representative:
                  representative,

                purchase:
                  purchase
              })
          }
        );

      return r.ok
        ? await r.json()
        : {
            ok:false,
            reason:
              "service_unavailable"
          };

    }catch(error){

      return {
        ok:false,
        reason:
          "service_unavailable"
      };
    }
  }

  const debit=
    sportDebitBag(
      actor,
      representative
    );

  if(!debit.ok){
    return debit;
  }

  const operationRef=
    "BCA-SPORT-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2,7)
      .toUpperCase();

  const exchange={

    id:
      sportId("bag"),

    operationRef:
      operationRef,

    clubRef:
      c.clubRef,

    clubName:
      c.name,

    amount:
      30,

    actor:
      actor || {},

    representative:
      representative,

    purchase:
      purchase,

    validatedAt:
      Date.now(),

    date:
      new Date()
        .toLocaleString(
          "fr-FR"
        )
  };

  const exchanges=
    sportExchanges();

  exchanges.push(
    exchange
  );

  sportSaveExchanges(
    exchanges
  );

  const receipt=
    sportCreateBagExchangeReceipt(
      exchange,
      debit.balance
    );

  await sportNotifyBagExchange(
    exchange,
    debit.balance,
    receipt
  );

  return {

    ok:true,

    balance:
      debit.balance,

    operationRef:
      operationRef,

    receiptId:
      receipt
        ? receipt.id
        : ""
  };
}


window.BociteSportMerchant={

  validateClubScan:
    (
      scan,
      merchant,
      purchase
    ) =>
      sportValidateBag(
        scan,
        {

          type:
            "merchant",

          label:
            String(
              merchant &&
              merchant.name ||

              merchant &&
              merchant.shopName ||

              merchant ||

              "Commerce partenaire"
            ),

          merchantId:
            String(
              merchant &&
              merchant.id ||
              ""
            ),

          purchaseAmountTTC:
            Number(
              purchase &&
              purchase.amountTTC ||
              0
            ),

          purchaseReference:
            String(
              purchase &&
              (
                purchase.reference ||
                purchase.ticketReference ||
                purchase.transactionReference
              ) ||
              ""
            )
        }
      ),

  createSupportFromClubScan:
    (
      scan,
      merchant,
      mode,
      associationId,
      amountHT
    ) =>
      sportCreateSupportDossier(
        scan,
        merchant,
        mode,
        associationId,
        amountHT
      ),

  allocationOptions:
    amountHT => [

      sportAllocation(
        "ALL_CLUB",
        amountHT
      ),

      sportAllocation(
        "HALF_HALF",
        amountHT
      )

    ].filter(Boolean)
};


window.BociteSportMairie={

  readClub(scan){

    const c=
      sportClub();

    const w=
      sportWallet();

    if(
      !scan ||
      scan.type !==
      "sport_club_ref" ||
      String(
        scan.clubRef ||
        ""
      ) !==
      String(
        c.clubRef ||
        ""
      )
    ){

      return {
        ok:false,
        reason:
          "invalid_scan"
      };
    }

    return {

      ok:true,

      municipalAccountCode:
        SPORT_CONFIG
          .mairieSportAccountCode,

      club:{

        clubRef:
          c.clubRef,

        name:
          c.name,

        officialName:
          c.officialName,

        commune:
          c.commune,

        organizationType:
          c.organizationType,

        legalForm:
          c.legalForm,

        sirenSiret:
          c.sirenSiret,

        rnaNumber:
          c.rnaNumber
      },

      balance:
        w.vert,

      canRedeemBag:
        w.vert >= 30,

      canTransferRemainder:
        (
          w.vert > 0 &&
          w.vert < 30
        )
    };
  },

  validateClubScan:
    scan =>
      sportValidateBag(
        scan,
        {

          type:
            "mairie",

          label:
            "Mairie — service Sport",

          municipalAccountCode:
            SPORT_CONFIG
              .mairieSportAccountCode
        }
      ),

  transferRemainderToAssociation(
    scan,
    associationId
  ){

    const c=
      sportClub();

    if(
      !scan ||
      scan.type !==
      "sport_club_ref" ||
      String(
        scan.clubRef ||
        ""
      ) !==
      String(
        c.clubRef ||
        ""
      )
    ){

      return {
        ok:false,
        reason:
          "invalid_scan"
      };
    }

    const a=
      sportAssociations()
        .find(
          x =>
            String(x.id) ===
            String(
              associationId ||
              ""
            )
        );

    if(
      !sportAssociationOK(a)
    ){

      return {
        ok:false,
        reason:
          "association_not_eligible"
      };
    }

    const r=
      sportDebitRemainder(
        a.id
      );

    if(!r.ok){
      return r;
    }

    const all=
      sportMairieTransfers();

    const x={

      id:
        sportId(
          "mairie-transfer"
        ),

      municipalAccountCode:
        SPORT_CONFIG
          .mairieSportAccountCode,

      clubRef:
        c.clubRef,

      clubName:
        c.name,

      associationId:
        a.id,

      associationName:
        a.legalName ||
        a.label,

      bocitecoins:
        r.amount,

      status:
        "validated",

      createdAt:
        Date.now(),

      date:
        new Date()
          .toLocaleString(
            "fr-FR"
          )
    };

    all.push(x);

    sportSaveMairieTransfers(
      all
    );

    return {

      ok:true,

      transfer:
        x,

      balance:
        0
    };
  },

  history:
    () =>
      sportExchanges()
        .slice(),

  solidarityHistory:
    () =>
      sportMairieTransfers()
        .slice()
};


window.BociteSportAssociation={

  registerPartners(items){

    const now=
      sportAssociations();

    const map={};

    now.forEach(
      x =>
        map[
          String(x.id)
        ]=x
    );

    (
      Array.isArray(items)
        ? items
        : []
    ).forEach(
      x=>{

        if(
          x &&
          x.id
        ){

          map[
            String(x.id)
          ]=
            Object.assign(
              {},
              map[
                String(x.id)
              ] || {},
              x
            );
        }
      }
    );

    const out=
      Object
        .keys(map)
        .map(
          k => map[k]
        );

    sportSaveAssociations(
      out
    );

    return out;
  },

  receiptQueue:
    () =>
      sportReceipts()
        .filter(
          x =>
            x &&
            x.status !==
            "received"
        ),

  validateAndReturnReceipt:
    (
      dossierId,
      doc
    ) =>
      sportMarkReceiptReceived(
        dossierId,
        doc
      ),

  markReceiptMissingForRenewal:
    dossierId =>
      sportMarkReceiptMissing(
        dossierId
      ),

  partners:
    () =>
      sportAssociations()
        .slice()
};


window.BociteSportSupportRules={

  minimumHT:
    50,

  amountRule:
    "free_amount_from_minimum",

  choices:[

    {
      code:
        "ALL_CLUB",
      label:
        "100 % au club"
    },

    {
      code:
        "HALF_HALF",
      label:
        "50 % au club / 50 % à l’association"
    }
  ],

  paymentProcessing:
    "server_side",

  beneficiarySettlement:
    "server_side",

  taxTreatment:
    "validated_case_by_case"
};


/* =========================================================
   FIN BLOC SPORT 3
   ========================================================= */

  /* =========================================================
   BLOC SPORT 4
   IDENTITÉ — RÉSULTATS — SAISON — PRÉSENTATION PUBLIQUE
   ========================================================= */

function sportSaveIdentityFromUi(){

  if(
    sportSession.role !==
    "president"
  ){
    return;
  }

  const c=
    sportClub();

  c.name=
    String(
      sportEl(
        "sportClubName"
      )?.value ||
      "Club partenaire"
    ).trim() ||
    "Club partenaire";

  c.officialName=
    String(
      sportEl(
        "sportOfficialName"
      )?.value ||
      c.name
    ).trim() ||
    c.name;

  c.organizationType=
    String(
      sportEl(
        "sportOrganizationType"
      )?.value ||
      "association_sportive"
    );

  c.legalForm=
    String(
      sportEl(
        "sportLegalForm"
      )?.value ||
      ""
    ).trim();

  c.sirenSiret=
    String(
      sportEl(
        "sportSiret"
      )?.value ||
      ""
    ).trim();

  c.rnaNumber=
    String(
      sportEl(
        "sportRna"
      )?.value ||
      ""
    ).trim();

  c.vatStatus=
    String(
      sportEl(
        "sportVatStatus"
      )?.value ||
      "to_verify"
    );

  c.vatNumber=
    String(
      sportEl(
        "sportVatNumber"
      )?.value ||
      ""
    ).trim();

  c.accountingEmail=
    String(
      sportEl(
        "sportAccountingEmail"
      )?.value ||
      ""
    ).trim();

  c.commune=
    String(
      sportEl(
        "sportCommune"
      )?.value ||
      ""
    ).trim();

  c.sportName=
    String(
      sportEl(
        "sportName"
      )?.value ||
      ""
    ).trim();

  c.federation=
    String(
      sportEl(
        "sportFederation"
      )?.value ||
      ""
    ).trim();

  c.league=
    String(
      sportEl(
        "sportLeague"
      )?.value ||
      ""
    ).trim();

  c.officialClubId=
    String(
      sportEl(
        "sportOfficialId"
      )?.value ||
      ""
    ).trim();

  c.officialResultsUrl=
    String(
      sportEl(
        "sportOfficialUrl"
      )?.value ||
      ""
    ).trim();

  c.publicNetworkUrl=
    String(
      sportEl(
        "sportPublicUrl"
      )?.value ||
      ""
    ).trim();

  c.seasonEndDate=
    String(
      sportEl(
        "sportSeasonEnd"
      )?.value ||
      c.seasonEndDate ||
      sportDefaultSeasonEndDate()
    );

  c.teams=
    String(
      sportEl(
        "sportTeams"
      )?.value ||
      ""
    )
      .split(/\n|,/)
      .map(
        x => x.trim()
      )
      .filter(Boolean)
      .slice(0,60);

  const finish=()=>{

    sportSaveClub(c);

    const o=
      sportEl(
        "sportIdentityStatus"
      );

    if(o){

      o.textContent=
        "Fiche d’identité enregistrée. Référence : " +
        (
          c.clubRef ||
          "en cours d’attribution"
        ) +
        ".";
    }

    sportRunSeason();
  };

  if(
    SPORT_CONFIG.identityEndpoint
  ){

    const o=
      sportEl(
        "sportIdentityStatus"
      );

    if(o){

      o.textContent=
        "Validation de la fiche d’identité…";
    }

    fetch(
      SPORT_CONFIG.identityEndpoint,
      {
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":
            "application/json"
        },
        body:
          JSON.stringify(c)
      }
    )
      .then(
        r =>
          r.ok
            ? r.json()
            : Promise.reject()
      )
      .then(
        j=>{

          if(
            j &&
            j.clubRef
          ){

            c.clubRef=
              String(
                j.clubRef
              );

            c.identityStatus=
              "validated";
          }

          finish();
        }
      )
      .catch(
        ()=>{

          c.identityStatus=
            "waiting_validation";

          finish();
        }
      );

  }else{

    if(!c.clubRef){

      c.clubRef=
        "BCA-SP-LOCAL-" +
        Math.random()
          .toString(36)
          .slice(2,8)
          .toUpperCase();
    }

    c.identityStatus=
      "local_pending";

    finish();
  }
}


async function sportSyncResults(){

  const c=
    sportClub();

  const o=
    sportEl(
      "sportResultSyncStatus"
    );

  if(
    !c.clubRef ||
    !c.commune ||
    !c.officialName ||
    !c.sportName ||
    !c.officialResultsUrl
  ){

    if(o){

      o.textContent=
        "Complétez la fiche d’identité et la source officielle des résultats.";
    }

    return;
  }

  if(
    !SPORT_CONFIG.resultsEndpoint
  ){

    if(o){

      o.textContent=
        "Fiche et source officielle enregistrées. La récupération automatique sera active dès le raccordement du service de résultats.";
    }

    return;
  }

  if(o){

    o.textContent=
      "Vérification des résultats officiels…";
  }

  try{

    const r=
      await fetch(
        SPORT_CONFIG.resultsEndpoint,
        {
          method:"POST",
          credentials:"include",
          headers:{
            "Content-Type":
              "application/json"
          },
          body:
            JSON.stringify({

              clubRef:
                c.clubRef,

              commune:
                c.commune,

              officialName:
                c.officialName,

              sportName:
                c.sportName,

              federation:
                c.federation,

              league:
                c.league,

              officialClubId:
                c.officialClubId,

              officialResultsUrl:
                c.officialResultsUrl,

              teams:
                c.teams
            })
        }
      );

    if(!r.ok){
      throw 0;
    }

    const j=
      await r.json();

    const rows=
      Array.isArray(
        j?.results
      )
        ? j.results
        : [];

    const all=
      sportReports();

    let added=0;
    let wins=0;

    rows.forEach(
      x=>{

        if(
          !x ||
          x.official !== true ||
          !x.id
        ){
          return;
        }

        if(
          x.clubRef &&
          String(
            x.clubRef
          ) !==
          String(
            c.clubRef
          )
        ){
          return;
        }

        if(
          String(
            x.resultStatus ||
            "final"
          ).toLowerCase() !==
          "final"
        ){
          return;
        }

        const ref=
          "match:" +
          x.id;

        if(
          all.some(
            y =>
              y.matchRef ===
              ref
          )
        ){
          return;
        }

        all.push({

          id:
            sportId("result"),

          matchRef:
            ref,

          clubRef:
            c.clubRef,

          team:
            String(
              x.team ||
              "Équipe"
            ),

          opponent:
            String(
              x.opponent ||
              ""
            ),

          score:
            String(
              x.score ||
              ""
            ),

          text:
            String(
              x.text ||
              x.score ||
              "Résultat officiel"
            ),

          playedAt:
            String(
              x.playedAt ||
              ""
            ),

          official:
            true,

          won:
            x.won === true,

          sourceLabel:
            String(
              x.sourceLabel ||
              "Source officielle"
            ),

          ts:
            Date.now()
        });

        added++;

        if(
          x.won === true &&
          sportAddCoin(
            "Match officiellement gagné",
            ref,
            String(
              x.team ||
              ""
            )
          ).ok
        ){
          wins++;
        }
      }
    );

    sportSaveReports(all);

    sportRenderPrivateResults();

    sportRefreshWallet();

    if(o){

      o.textContent=
        added +
        " résultat(s) officiel(s) ajouté(s), " +
        wins +
        " nouvelle(s) victoire(s) créditée(s).";
    }

  }catch(_){

    if(o){

      o.textContent=
        "La vérification automatique est indisponible. La présidence peut saisir un résultat de secours, sans crédit avant confirmation officielle.";
    }
  }
}


function sportManualResult(){

  if(
    sportSession.role !==
    "president"
  ){
    return;
  }

  const team=
    String(
      sportEl(
        "sportManualTeam"
      )?.value ||
      ""
    ).trim();

  const text=
    String(
      sportEl(
        "sportManualResult"
      )?.value ||
      ""
    ).trim();

  if(
    !team ||
    text.length < 3
  ){

    alert(
      "Renseignez l’équipe et le résultat."
    );

    return;
  }

  const all=
    sportReports();

  all.push({

    id:
      sportId("manual"),

    clubRef:
      sportClub()
        .clubRef,

    team:
      team,

    text:
      text,

    official:
      false,

    verificationStatus:
      "pending_official_check",

    source:
      "president_fallback",

    ts:
      Date.now(),

    date:
      new Date()
        .toLocaleString(
          "fr-FR"
        )
  });

  sportSaveReports(all);

  const field=
    sportEl(
      "sportManualResult"
    );

  if(field){
    field.value="";
  }

  sportRenderPrivateResults();
}


function sportDaysUntil(iso){

  const t=
    new Date(
      String(iso||"") +
      "T23:59:59"
    );

  if(isNaN(t)){
    return null;
  }

  const n=
    new Date();

  const a=
    new Date(
      n.getFullYear(),
      n.getMonth(),
      n.getDate()
    );

  const b=
    new Date(
      t.getFullYear(),
      t.getMonth(),
      t.getDate()
    );

  return Math.ceil(
    (
      b-a
    ) /
    86400000
  );
}


function sportReminderText(
  days,
  balance
){

  if(balance <= 0){
    return "";
  }

  const start=
    days === 30
      ? "Il vous reste 30 jours pour utiliser vos bocitecoins avant la clôture de la saison."
      : days === 15
        ? "Avez-vous pensé à utiliser vos bocitecoins ? Il vous reste 15 jours avant la clôture de la saison."
        : "Plus que 7 jours avant la clôture de la saison : pensez à vider le portefeuille du club.";

  return balance < 30
    ? (
        start +
        " Votre solde est de " +
        balance +
        " bocitecoins : il ne permet plus un Cabas de 30. Présentez le code du club à la mairie afin d’orienter ce reliquat vers les associations solidaires validées. À la clôture, tout solde restant sera perdu."
      )
    : (
        start +
        " Votre solde est de " +
        balance +
        " bocitecoins. Chaque Cabas vaut exactement 30 bocitecoins. Les bocitecoins ne se transfèrent jamais entre clubs. À la clôture, tout solde restant sera perdu."
      );
}


function sportRunSeason(){

  const c=
    sportClub();

  const days=
    sportDaysUntil(
      c.seasonEndDate
    );

  const w=
    sportWallet();

  const state=
    sportLoad(
      SPORT_KEYS.season,
      {}
    );

  const notice=
    sportEl(
      "sportSeasonNotice"
    );

  if(days == null){
    return;
  }

  if(days < 0){

    if(w.vert > 0){

      const old=
        w.vert;

      sportSaveWallet({
        vert:0
      });

      const l=
        sportLedger();

      l.push({

        id:
          sportId(
            "season-close"
          ),

        direction:
          "expire",

        amount:
          old,

        reason:
          "Clôture annuelle du portefeuille Sport",

        ts:
          Date.now(),

        date:
          new Date()
            .toLocaleString(
              "fr-FR"
            )
      });

      sportSaveLedger(
        l
      );
    }

    let next=
      new Date(
        String(
          c.seasonEndDate
        ) +
        "T12:00:00"
      );

    if(
      !isNaN(next)
    ){

      do{

        next.setFullYear(
          next.getFullYear() +
          1
        );

      }while(
        next <
        new Date()
      );

      c.seasonEndDate=
        next
          .toISOString()
          .slice(0,10);

      sportSaveClub(c);
    }

    if(notice){

      notice.style.display=
        "block";

      notice.textContent=
        "La saison est clôturée. Le portefeuille repart à zéro pour la nouvelle saison.";
    }

    sportRefreshWallet();

    return;
  }

  if(w.vert <= 0){

    if(notice){

      notice.style.display=
        "none";

      notice.textContent=
        "";
    }

    return;
  }

  if(
    [
      30,
      15,
      7
    ].includes(days)
  ){

    const k=
      String(
        c.clubRef ||
        c.id
      ) +
      "|" +
      c.seasonEndDate +
      "|" +
      days;

    if(!state[k]){

      const msg=
        sportReminderText(
          days,
          w.vert
        );

      state[k]={
        sentAt:
          Date.now(),
        balance:
          w.vert
      };

      sportSave(
        SPORT_KEYS.season,
        state
      );

      if(notice){

        notice.style.display=
          "block";

        notice.textContent=
          msg;
      }

      if(
        SPORT_CONFIG
          .notificationEndpoint
      ){

        fetch(
          SPORT_CONFIG.notificationEndpoint,
          {
            method:"POST",
            credentials:"include",
            headers:{
              "Content-Type":
                "application/json"
            },
            body:
              JSON.stringify({
                scope:
                  "sport_season",
                clubRef:
                  c.clubRef,
                daysRemaining:
                  days,
                balance:
                  w.vert,
                message:
                  msg
              })
          }
        ).catch(()=>{});
      }
    }
  }
}


window.BociteSportSeasonMaintenance={
  run:
    sportRunSeason
};


function sportPublicResultsHtml(){

  const a=
    sportReports()
      .slice()
      .reverse()
      .slice(0,40);

  if(!a.length){

    return `
      <div class="sportCard">
        Les résultats des clubs partenaires
        apparaîtront ici dès leur publication.
      </div>
    `;
  }

  return a.map(
    x => `

      <div class="sportItem">

        <div class="sportName">
          ${sportEsc(
            x.team ||
            "Équipe"
          )}
        </div>

        <div>
          ${sportEsc(
            x.text ||
            x.score ||
            "Résultat"
          )}
        </div>

        <div>
          ${sportEsc(
            x.playedAt ||
            x.date ||
            ""
          )}
        </div>

        <span class="sportPill">
          ${
            x.official
              ? "Résultat officiel vérifié"
              : "Saisi par le club — vérification officielle en attente"
          }
        </span>

      </div>
    `
  ).join("");
}


function sportBenefitsHtml(){

  return `

    ${sportTitle(
      "Ce que le sport fait grandir avec"
    )}

    <div class="sportCard">

      <div class="sportText">

        Le sport rassemble,
        transmet
        et révèle bien davantage
        qu’un résultat.

        Avec ${sportBrandHtml()},
        l’entraînement,
        la compétition
        et la vie du club
        deviennent des occasions concrètes
        de faire grandir
        le respect,
        l’engagement,
        l’entraide,
        la responsabilité
        et la solidarité.

      </div>

      <ul>

        <li>
          écouter les consignes du coach
          et aller jusqu’au bout
          de l’effort demandé ;
        </li>

        <li>
          respecter ses partenaires,
          ses adversaires,
          les arbitres,
          les entraîneurs,
          les bénévoles
          et tout le personnel de service ;
        </li>

        <li>
          savoir attendre,
          écouter
          et laisser une place aux autres ;
        </li>

        <li>
          encourager un équipier
          lorsqu’il rencontre une difficulté ;
        </li>

        <li>
          partager les efforts,
          le matériel
          et les responsabilités ;
        </li>

        <li>
          accepter la victoire avec respect
          et la défaite avec dignité ;
        </li>

        <li>
          être ponctuel
          et respecter l’engagement pris
          envers son équipe ;
        </li>

        <li>
          ranger le matériel
          après l’entraînement
          ou le match ;
        </li>

        <li>
          laisser les vestiaires,
          le terrain,
          la salle
          et les espaces utilisés propres ;
        </li>

        <li>
          prendre soin des équipements
          appartenant au club
          ou à la collectivité ;
        </li>

        <li>
          apprendre que les bons comportements
          produisent toujours quelque chose
          de rare et de précieux :
          des valeurs,
          de la confiance
          et une utilité réelle
          pour tout le club ;
        </li>

        <li>
          comprendre progressivement
          que le sport est
          un formidable miroir
          de nos comportements
          et une force
          au service de la solidarité.
        </li>

      </ul>

    </div>


    ${sportTitle(
      "Ce que",
      "apporte au sportif"
    )}

    <div class="sportCard">

      <ul>

        <li>
          voir ses efforts
          et ceux de son équipe
          reconnus au-delà du seul score ;
        </li>

        <li>
          participer à un objectif collectif
          plutôt qu’à une récompense individuelle ;
        </li>

        <li>
          retrouver les résultats de son équipe
          et des autres équipes du club ;
        </li>

        <li>
          mieux connaître tous les commerces,
          les entreprises,
          les associations
          et les acteurs de la commune
          qui soutiennent son club ;
        </li>

        <li>
          devenir un ambassadeur
          de son équipe,
          de son club
          et de sa commune ;
        </li>

        <li>
          comprendre que le sport relie
          effort,
          respect,
          vie locale
          et solidarité.
        </li>

      </ul>

      <div class="sportText">

        <strong>
          Avec ${sportBrandHtml()},
          le sportif porte aussi
          les valeurs de son club
          partout où il va.
        </strong>

      </div>

    </div>


    ${sportTitle(
      "Ce que",
      "apporte au club"
    )}

    <div class="sportCard">

      <ul>

        <li>
          faire connaître ses équipes,
          ses disciplines,
          ses résultats
          et ses rendez-vous ;
        </li>

        <li>
          valoriser le travail
          des présidents,
          entraîneurs,
          éducateurs,
          dirigeants,
          bénévoles
          et de tout le personnel de service ;
        </li>

        <li>
          mettre en valeur
          les comportements responsables
          des équipes ;
        </li>

        <li>
          consacrer les bocitecoins
          aux besoins utiles du club ;
        </li>

        <li>
          créer des relations directes
          avec les commerces
          et entreprises de la commune ;
        </li>

        <li>
          renforcer les relations
          avec les adhérents,
          les familles
          et les supporters ;
        </li>

        <li>
          donner davantage de visibilité
          aux clubs
          et disciplines
          encore trop méconnus.
        </li>

      </ul>

      <div class="sportText">

        <strong>
          Avec ${sportBrandHtml()},
          chaque club gagne une nouvelle porte
          pour montrer ce qu’il fait,
          ce qu’il transmet
          et tout ce qu’il apporte
          à la commune.
        </strong>

      </div>

    </div>


    ${sportTitle(
      "Ce que",
      "apporte au commerçant"
    )}

    <div class="sportCard">

      <div class="sportText">

        Voici une belle occasion
        de montrer qui vous êtes
        dans toute la commune,
        de faire connaître vos services
        et de montrer concrètement
        votre attachement
        à la vie locale.

      </div>

      <ul>

        <li>
          être davantage remarqué
          par les citoyens,
          les adhérents,
          les familles,
          les supporters
          et leur entourage ;
        </li>

        <li>
          disposer d’une présence supplémentaire
          dans ${sportBrandHtml()} ;
        </li>

        <li>
          ouvrir une véritable fenêtre
          sur la ville,
          dans la poche de tous ;
        </li>

        <li>
          diffuser pendant 7 jours
          une petite publicité locale
          mettant en avant votre commerce
          et le club soutenu ;
        </li>

        <li>
          associer clairement votre enseigne
          à la vie de tous les clubs sportifs
          de votre commune ;
        </li>

        <li>
          aller plus loin
          en soutenant une association
          de recherche retenue ;
        </li>

        <li>
          créer une relation durable
          avec un club
          qui a des besoins d’achat,
          d’équipement
          et de développement.
        </li>

      </ul>

      <div class="sportText">

        <strong>
          Avec ${sportBrandHtml()},
          votre soutien ne reste jamais invisible :
          votre commerce devient un cœur,
          un poumon de la vie locale.
          Il crée de nouvelles rencontres,
          rapproche les habitants
          et fait vivre toute la commune.
        </strong>

      </div>

    </div>


    ${sportTitle(
      "Dans le cadre sportif, ce que",
      "apporte à la mairie"
    )}

    <div class="sportCard">

      <ul>

        <li>
          valoriser les clubs
          qui font vivre la commune
          toute l’année ;
        </li>

        <li>
          encourager le respect
          des équipements sportifs
          et des espaces communs ;
        </li>

        <li>
          mieux faire connaître
          la diversité sportive
          présente dans la commune ;
        </li>

        <li>
          renforcer les liens
          entre clubs,
          habitants,
          commerces,
          entreprises
          et associations ;
        </li>

        <li>
          disposer d’un cadre identifiable
          et comptablement traçable
          pour les bocitecoins Sport ;
        </li>

        <li>
          gérer les Cabas
          de 30 bocitecoins
          et les reliquats de fin de saison
          depuis son compte de service
          Sport / solidarité ;
        </li>

        <li>
          soutenir des causes solidaires
          retenues avec ${sportBrandHtml()}.
        </li>

      </ul>

    </div>


    ${sportTitle(
      "Ce que",
      "apporte au citoyen"
    )}

    <div class="sportCard">

      <div class="sportText">

        <strong>
          Faire vivre le local commence
          par un geste simple :
          acheter ici
          ce dont vous avez besoin.
        </strong>

      </div>

      <ul>

        <li>
          acheter dans votre commune,
          c’est investir
          dans votre propre avenir
          et celui de votre territoire ;
        </li>

        <li>
          soutenir un commerce,
          c’est soutenir
          des emplois,
          des salariés,
          des artisans,
          des fournisseurs
          et toute une activité locale ;
        </li>

        <li>
          préserver les professionnels
          dont vous aurez besoin demain ;
        </li>

        <li>
          connaître les clubs,
          associations
          et acteurs
          qui font vivre la commune ;
        </li>

        <li>
          voir que les petits gestes
          de chacun
          finissent toujours
          par produire
          un résultat visible pour tous.
        </li>

      </ul>

      <div class="sportText">

        <strong>
          Avec ${sportBrandHtml()},
          acheter local,
          c’est faire vivre
          ce qui vous entoure
          et investir
          dans l’avenir de votre commune
          et dans le vôtre.
        </strong>

      </div>

    </div>


    ${sportTitle(
      "Un vrai phare pour tous, y compris pour les associations solidaires avec"
    )}

    <div class="sportCard">

      <div class="sportText">

        Avec ${sportBrandHtml()},
        les associations solidaires retenues
        trouvent une place visible
        au cœur de la commune.

      </div>

      <ul>

        <li>
          faire connaître des causes
          encore trop méconnues ;
        </li>

        <li>
          montrer le travail accompli ;
        </li>

        <li>
          expliquer ce que
          les soutiens reçus
          permettent de réaliser ;
        </li>

        <li>
          recevoir le soutien
          des clubs
          et des professionnels
          selon les choix validés ;
        </li>

        <li>
          retourner obligatoirement
          le justificatif comptable prévu
          lorsqu’un professionnel
          leur verse une somme ;
        </li>

        <li>
          remercier les clubs,
          commerces,
          entreprises,
          citoyens
          et collectivités
          qui participent.
        </li>

      </ul>

      <div class="sportText">

        Les associations réellement proposées
        sont sélectionnées
        et vérifiées
        avec la mairie
        et ${sportBrandHtml()}.

        Les emplacements
        A, B, C et D
        restent provisoires
        jusqu’à leur désignation.

      </div>

      <div class="sportText">

        <strong>
          ${sportBrandHtml()}
          devient un véritable phare
          qui éclaire ce que chacun apporte
          et donne envie aux autres
          de rejoindre le mouvement.
        </strong>

      </div>

    </div>
  `;
}


/* =========================================================
   FIN BLOC SPORT 4
   ========================================================= */

  /* =========================================================
   BLOC SPORT 5
   GOUVERNANCE — SIGNALEMENT — MÉMOIRE DU CLUB
   ========================================================= */

function sportGovernanceHtml(){

  const g=
    sportLoadGovernance();

  const p=
    g.president || {};

  const people=
    Array.isArray(g.continuity)
      ? g.continuity
      : [];

  const c1=
    people[0] || {};

  const c2=
    people[1] || {};

  const verified=
    sportGovernanceIsVerified();

  return `

    <div class="sportCard">

      <div class="sportSubTitle">
        Gouvernance et continuité
        avec ${sportBrandHtml()}
      </div>

      <div class="sportText" style="margin-top:8px;">

        Les personnes déclarées doivent
        correspondre à la gouvernance réelle
        de la structure.

        <br><br>

        Une simple saisie ne valide jamais
        un Président ou un responsable.

        Les fonctions réservées restent bloquées
        tant que les informations nécessaires
        n’ont pas été vérifiées.

      </div>

      <div
        class="sportStatus"
        style="margin-top:10px;"
      >
        État :
        <strong>
          ${
            verified
              ? "✓ Gouvernance validée"
              : "Vérification nécessaire"
          }
        </strong>
      </div>


      <div class="sportSubTitle" style="margin-top:16px;">
        Président / responsable légal
      </div>

      <label class="sportLabel">
        Nom et prénom
      </label>

      <input
        id="sportGovPresidentName"
        class="sportField"
        value="${sportEsc(p.fullName || "")}"
      >

      <label class="sportLabel">
        Fonction officielle
      </label>

      <input
        id="sportGovPresidentRole"
        class="sportField"
        value="${sportEsc(
          p.role ||
          "Président / responsable légal"
        )}"
      >

      <label class="sportLabel">
        Email
      </label>

      <input
        id="sportGovPresidentEmail"
        class="sportField"
        type="email"
        value="${sportEsc(p.email || "")}"
      >

      <label class="sportLabel">
        Téléphone
      </label>

      <input
        id="sportGovPresidentPhone"
        class="sportField"
        value="${sportEsc(p.phone || "")}"
      >

      <label class="sportLabel">
        Référence permettant de justifier la fonction
      </label>

      <input
        id="sportGovPresidentRef"
        class="sportField"
        value="${sportEsc(
          p.officialReference || ""
        )}"
        placeholder="Référence du document ou mandat"
      >


      <div class="sportSubTitle" style="margin-top:18px;">
        Personne de continuité 1
      </div>

      <label class="sportLabel">
        Nom et prénom
      </label>

      <input
        id="sportGovC1Name"
        class="sportField"
        value="${sportEsc(c1.fullName || "")}"
      >

      <label class="sportLabel">
        Fonction officielle
      </label>

      <input
        id="sportGovC1Role"
        class="sportField"
        value="${sportEsc(c1.role || "")}"
        placeholder="Secrétaire, trésorier..."
      >

      <label class="sportLabel">
        Email
      </label>

      <input
        id="sportGovC1Email"
        class="sportField"
        type="email"
        value="${sportEsc(c1.email || "")}"
      >

      <label class="sportLabel">
        Téléphone
      </label>

      <input
        id="sportGovC1Phone"
        class="sportField"
        value="${sportEsc(c1.phone || "")}"
      >

      <label class="sportLabel">
        Référence permettant de justifier la fonction
      </label>

      <input
        id="sportGovC1Ref"
        class="sportField"
        value="${sportEsc(
          c1.officialReference || ""
        )}"
        placeholder="Référence du document ou mandat"
      >


      <div class="sportSubTitle" style="margin-top:18px;">
        Personne de continuité 2
      </div>

      <label class="sportLabel">
        Nom et prénom
      </label>

      <input
        id="sportGovC2Name"
        class="sportField"
        value="${sportEsc(c2.fullName || "")}"
      >

      <label class="sportLabel">
        Fonction officielle
      </label>

      <input
        id="sportGovC2Role"
        class="sportField"
        value="${sportEsc(c2.role || "")}"
        placeholder="Secrétaire, trésorier..."
      >

      <label class="sportLabel">
        Email
      </label>

      <input
        id="sportGovC2Email"
        class="sportField"
        type="email"
        value="${sportEsc(c2.email || "")}"
      >

      <label class="sportLabel">
        Téléphone
      </label>

      <input
        id="sportGovC2Phone"
        class="sportField"
        value="${sportEsc(c2.phone || "")}"
      >

      <label class="sportLabel">
        Référence permettant de justifier la fonction
      </label>

      <input
        id="sportGovC2Ref"
        class="sportField"
        value="${sportEsc(
          c2.officialReference || ""
        )}"
        placeholder="Référence du document ou mandat"
      >


      <button
        id="sportGovernanceSave"
        class="sportBtn"
        type="button"
        style="
          width:100%;
          margin-top:16px;
        "
      >
        Enregistrer et demander la vérification
      </button>

      <div
        id="sportGovernanceStatus"
        class="sportStatus"
      ></div>

    </div>

  `;
}


async function sportSaveGovernanceFromUi(){

  const value=
    id =>
      String(
        sportEl(id)?.value ||
        ""
      ).trim();

  const president={

    fullName:
      value(
        "sportGovPresidentName"
      ),

    role:
      value(
        "sportGovPresidentRole"
      ),

    email:
      value(
        "sportGovPresidentEmail"
      ),

    phone:
      value(
        "sportGovPresidentPhone"
      ),

    officialReference:
      value(
        "sportGovPresidentRef"
      )
  };


  const continuity=[

    {
      fullName:
        value("sportGovC1Name"),

      role:
        value("sportGovC1Role"),

      email:
        value("sportGovC1Email"),

      phone:
        value("sportGovC1Phone"),

      officialReference:
        value("sportGovC1Ref")
    },

    {
      fullName:
        value("sportGovC2Name"),

      role:
        value("sportGovC2Role"),

      email:
        value("sportGovC2Email"),

      phone:
        value("sportGovC2Phone"),

      officialReference:
        value("sportGovC2Ref")
    }
  ];

  sportSaveGovernanceDraft(
    president,
    continuity
  );

  const status=
    sportEl(
      "sportGovernanceStatus"
    );

  const check=
    sportGovernanceCompleteness();

  if(!check.complete){

    if(status){

      status.textContent=
        "La fiche est enregistrée mais reste incomplète. " +
        check.missing.join(", ") +
        ".";
    }

    return;
  }

  if(status){

    status.textContent=
      "Fiche complète. Vérification en attente.";
  }

  const result=
    await sportSubmitGovernanceVerification();

  if(
    result &&
    result.verified === true
  ){

    if(status){

      status.textContent=
        "✓ Gouvernance vérifiée.";
    }

    return;
  }

  if(status){

    status.textContent=
      "Fiche enregistrée. Les fonctions réservées seront ouvertes après validation.";
  }
}


function sportGovernanceReports(){

  const rows=
    sportLoad(
      SPORT_KEYS.governanceReports,
      []
    );

  return Array.isArray(rows)
    ? rows
    : [];
}


function sportSaveGovernanceReports(rows){

  return sportSave(
    SPORT_KEYS.governanceReports,
    Array.isArray(rows)
      ? rows
      : []
  );
}


function sportGovernanceReportHtml(){

  if(
    sportSession.role !==
    "president"
  ){
    return "";
  }

  return `

    <div class="sportCard">

      <div class="sportSubTitle">
        Signaler un changement de gouvernance
      </div>

      <div class="sportText" style="margin-top:8px;">

        Un départ, un remplacement,
        une indisponibilité ou une contestation
        peut être signalé sans attendre
        la transmission des anciens accès.

        <br><br>

        Le signalement est traité
        confidentiellement.

        Il ne modifie pas automatiquement
        les droits d’une personne
        tant que la situation
        n’a pas été contrôlée.

      </div>

      <label class="sportLabel">
        Situation
      </label>

      <select
        id="sportGovReportType"
        class="sportField"
      >

        <option value="">
          Choisir
        </option>

        <option value="president_change">
          Changement de Président / responsable légal
        </option>

        <option value="person_departure">
          Départ d’une personne déclarée
        </option>

        <option value="person_removed">
          Personne retirée de ses fonctions
        </option>

        <option value="unavailable">
          Responsable indisponible
        </option>

        <option value="access_problem">
          Problème d’accès ou de continuité
        </option>

        <option value="mandate_dispute">
          Contestation concernant une fonction
        </option>

        <option value="other">
          Autre changement
        </option>

      </select>

      <label class="sportLabel">
        Personne concernée
      </label>

      <input
        id="sportGovReportPerson"
        class="sportField"
        placeholder="Nom et prénom"
      >

      <label class="sportLabel">
        Précisions
      </label>

      <textarea
        id="sportGovReportMessage"
        class="sportField"
        style="min-height:90px;"
        placeholder="Indiquez simplement ce qui a changé."
      ></textarea>

      <button
        id="sportGovReportSend"
        class="sportBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
        "
      >
        Transmettre le changement
      </button>

      <div
        id="sportGovReportStatus"
        class="sportStatus"
      ></div>

    </div>

  `;
}


async function sportSendGovernanceReport(){

  const type=
    String(
      sportEl(
        "sportGovReportType"
      )?.value ||
      ""
    ).trim();

  const person=
    String(
      sportEl(
        "sportGovReportPerson"
      )?.value ||
      ""
    ).trim();

  const message=
    String(
      sportEl(
        "sportGovReportMessage"
      )?.value ||
      ""
    ).trim();

  const status=
    sportEl(
      "sportGovReportStatus"
    );

  if(!type){

    if(status){

      status.textContent=
        "Choisissez la situation à signaler.";
    }

    return;
  }

  if(
    !person &&
    !message
  ){

    if(status){

      status.textContent=
        "Indiquez la personne concernée ou une courte précision.";
    }

    return;
  }

  const report={

    id:
      "SPORT-GOV-" +
      Date.now(),

    clubId:
      SPORT_CONFIG.clubId,

    clubRef:
      sportClub().clubRef ||
      "",

    type:
      type,

    person:
      person,

    message:
      message,

    reporterRole:
      String(
        sportSession.role ||
        ""
      ),

    reporterAccountId:
      String(
        sportSession.accountId ||
        ""
      ),

    reporterName:
      String(
        sportSession.name ||
        ""
      ),

    confidential:
      true,

    status:
      "pending_review",

    createdAt:
      new Date()
        .toISOString()
  };

  if(
    SPORT_CONFIG
      .governanceReportEndpoint
  ){

    try{

      const response=
        await fetch(
          SPORT_CONFIG
            .governanceReportEndpoint,
          {
            method:"POST",
            credentials:"include",
            headers:{
              "Content-Type":
                "application/json"
            },
            body:
              JSON.stringify(
                report
              )
          }
        );

      if(!response.ok){

        throw new Error(
          "report_failed"
        );
      }

      const result=
        await response.json();

      if(
        result &&
        result.reference
      ){

        report.serverReference=
          String(
            result.reference
          );
      }

      report.status=
        "transmitted";

    }catch(error){

      report.status=
        "pending_transmission";
    }
  }

  const rows=
    sportGovernanceReports();

  rows.push(
    report
  );

  sportSaveGovernanceReports(
    rows.slice(-100)
  );

  const typeEl=
    sportEl(
      "sportGovReportType"
    );

  if(typeEl){
    typeEl.value="";
  }

  const personEl=
    sportEl(
      "sportGovReportPerson"
    );

  if(personEl){
    personEl.value="";
  }

  const messageEl=
    sportEl(
      "sportGovReportMessage"
    );

  if(messageEl){
    messageEl.value="";
  }

  if(status){

    status.textContent=
      "Signalement enregistré. La situation sera vérifiée avant toute modification des droits.";
  }
}


function sportHistoryTimestamp(item){

  if(!item){
    return 0;
  }

  const direct=[
    item.ts,
    item.createdAt,
    item.validatedAt,
    item.paidAt,
    item.coinAwardedAt,
    item.receiptReceivedAt
  ];

  for(
    const value
    of direct
  ){

    const n=
      Number(value);

    if(
      Number.isFinite(n) &&
      n > 0
    ){
      return n;
    }
  }

  const text=
    item.playedAt ||
    item.date ||
    item.ts_fr ||
    "";

  const parsed=
    Date.parse(text);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}


function sportHistoryPeriodStart(period){

  const now=
    new Date();

  if(
    period ===
    "month"
  ){

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,0,0,0
    ).getTime();
  }

  if(
    period ===
    "quarter"
  ){

    const quarterMonth=
      Math.floor(
        now.getMonth() /
        3
      ) * 3;

    return new Date(
      now.getFullYear(),
      quarterMonth,
      1,
      0,0,0,0
    ).getTime();
  }

  if(
    period ===
    "semester"
  ){

    const semesterMonth=
      now.getMonth() < 6
        ? 0
        : 6;

    return new Date(
      now.getFullYear(),
      semesterMonth,
      1,
      0,0,0,0
    ).getTime();
  }

  if(
    period ===
    "season"
  ){

    const club=
      sportClub();

    const end=
      new Date(
        String(
          club.seasonEndDate ||
          ""
        ) +
        "T23:59:59"
      );

    if(
      !Number.isNaN(
        end.getTime()
      )
    ){

      const start=
        new Date(end);

      start.setFullYear(
        start.getFullYear() -
        1
      );

      start.setDate(
        start.getDate() +
        1
      );

      return start.getTime();
    }
  }

  return 0;
}


function sportHistoryFilter(
  rows,
  period
){

  const start=
    sportHistoryPeriodStart(
      period
    );

  if(!start){

    return Array.isArray(rows)
      ? rows.slice()
      : [];
  }

  return (
    Array.isArray(rows)
      ? rows
      : []
  ).filter(
    item =>
      sportHistoryTimestamp(
        item
      ) >=
      start
  );
}


function sportPresidentHistoryHtml(){

  if(
    sportSession.role !==
    "president"
  ){
    return "";
  }

  return `

    <div class="sportCard">

      <div class="sportSubTitle">
        Suivi et mémoire du club avec
        ${sportBrandHtml()}
      </div>

      <div
        class="sportText"
        style="margin-top:8px;"
      >

        Cet historique appartient
        à la structure sportive.

        <br><br>

        Un changement de Président
        ou de responsable
        ne supprime jamais
        les opérations déjà enregistrées.

      </div>

      <label class="sportLabel">
        Période à consulter
      </label>

      <select
        id="sportPresidentHistoryPeriod"
        class="sportField"
      >

        <option value="month">
          Ce mois
        </option>

        <option value="quarter">
          Ce trimestre
        </option>

        <option value="semester">
          Ce semestre
        </option>

        <option value="season" selected>
          Cette saison
        </option>

        <option value="all">
          Tout l’historique
        </option>

      </select>

      <button
        id="sportPresidentHistoryRefresh"
        class="sportBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        "
      >
        Actualiser le relevé
      </button>

      <div
        id="sportPresidentHistorySummary"
        style="margin-top:12px;"
      ></div>

      <div
        id="sportPresidentHistoryDetails"
        style="margin-top:12px;"
      ></div>

    </div>

  `;
}


function sportRenderPresidentHistory(){

  if(
    sportSession.role !==
    "president"
  ){
    return;
  }

  const summary=
    sportEl(
      "sportPresidentHistorySummary"
    );

  const details=
    sportEl(
      "sportPresidentHistoryDetails"
    );

  if(
    !summary ||
    !details
  ){
    return;
  }

  const periodEl=
    sportEl(
      "sportPresidentHistoryPeriod"
    );

  const period=
    periodEl
      ? periodEl.value
      : "season";

  const ledger=
    sportHistoryFilter(
      sportLedger(),
      period
    );

  const exchanges=
    sportHistoryFilter(
      sportExchanges(),
      period
    );

  const trainings=
    sportHistoryFilter(
      sportTrainings(),
      period
    );

  const reports=
    sportHistoryFilter(
      sportReports(),
      period
    );

  const dossiers=
    sportHistoryFilter(
      sportDossiers(),
      period
    );

  const payments=
    sportHistoryFilter(
      sportPaymentRecords(),
      period
    );

  const credits=
    ledger.filter(
      x =>
        x.direction ===
        "credit"
    );

  const debits=
    ledger.filter(
      x =>
        x.direction ===
        "debit"
    );

  const solidarity=
    ledger.filter(
      x =>
        x.direction ===
        "solidarity_transfer"
    );

  const expired=
    ledger.filter(
      x =>
        x.direction ===
        "expire"
    );

  const coinsWon=
    credits.reduce(
      (sum,x) =>
        sum +
        Number(
          x.amount || 0
        ),
      0
    );

  const coinsUsed=
    debits.reduce(
      (sum,x) =>
        sum +
        Number(
          x.amount || 0
        ),
      0
    );

  const solidarityCoins=
    solidarity.reduce(
      (sum,x) =>
        sum +
        Number(
          x.amount || 0
        ),
      0
    );

  const expiredCoins=
    expired.reduce(
      (sum,x) =>
        sum +
        Number(
          x.amount || 0
        ),
      0
    );

  const validatedTrainings=
    trainings.filter(
      x =>
        x.coinAwarded ===
        true
    ).length;

  const officialResults=
    reports.filter(
      x =>
        x.official ===
        true
    ).length;

  const paidSupport=
    payments.filter(
      x =>
        x.status ===
        "paid"
    );

  const paidAmountHT=
    paidSupport.reduce(
      (sum,x) =>
        sum +
        Number(
          x.amountHT || 0
        ),
      0
    );

  const exchangesByRepresentative={};

  exchanges.forEach(
    item=>{

      const representative=
        item.representative || {};

      const ref=
        String(
          representative.ref ||
          representative.name ||
          "non-identifie"
        );

      const name=
        String(
          representative.name ||
          "Représentant non identifié"
        );

      const team=
        String(
          representative.team ||
          ""
        );

      if(
        !exchangesByRepresentative[ref]
      ){

        exchangesByRepresentative[ref]={
          name:
            name,
          team:
            team,
          exchanges:
            0,
          coins:
            0
        };
      }

      exchangesByRepresentative[ref]
        .exchanges += 1;

      exchangesByRepresentative[ref]
        .coins +=
          Number(
            item.amount || 30
          );
    }
  );

  const representativeRows=
    Object.values(
      exchangesByRepresentative
    );

  const supportsByRepresentative={};

  paidSupport.forEach(
    item=>{

      const representative=
        item.representative || {};

      const ref=
        String(
          representative.ref ||
          representative.name ||
          "non-identifie"
        );

      const name=
        String(
          representative.name ||
          "Représentant non identifié"
        );

      const team=
        String(
          representative.team ||
          ""
        );

      if(
        !supportsByRepresentative[ref]
      ){

        supportsByRepresentative[ref]={
          name:
            name,
          team:
            team,
          supports:
            0,
          amountHT:
            0
        };
      }

      supportsByRepresentative[ref]
        .supports += 1;

      supportsByRepresentative[ref]
        .amountHT +=
          Number(
            item.amountHT || 0
          );
    }
  );

  const supportRepresentativeRows=
    Object.values(
      supportsByRepresentative
    );

  summary.innerHTML=`

    <div class="sportItem">

      <div class="sportName">
        Situation de la période
      </div>

      <div style="margin-top:8px;">
        Solde actuel :
        <strong>
          ${sportWallet().vert}
          bocitecoins
        </strong>
      </div>

      <div style="margin-top:6px;">
        Bocitecoins gagnés :
        <strong>${coinsWon}</strong>
      </div>

      <div style="margin-top:6px;">
        Bocitecoins utilisés en Cabas :
        <strong>${coinsUsed}</strong>
      </div>

      <div style="margin-top:6px;">
        Orientés vers la solidarité :
        <strong>${solidarityCoins}</strong>
      </div>

      <div style="margin-top:6px;">
        Expirés en clôture :
        <strong>${expiredCoins}</strong>
      </div>

      <div style="margin-top:6px;">
        Cabas validés :
        <strong>${exchanges.length}</strong>
      </div>

      <div style="margin-top:6px;">
        Entraînements ayant produit
        un bocitecoin :
        <strong>${validatedTrainings}</strong>
      </div>

      <div style="margin-top:6px;">
        Résultats officiels enregistrés :
        <strong>${officialResults}</strong>
      </div>

      <div style="margin-top:6px;">
        Parrainages / soutiens enregistrés :
        <strong>${dossiers.length}</strong>
      </div>

      <div style="margin-top:6px;">
        Paiements de soutien confirmés :
        <strong>${paidSupport.length}</strong>
      </div>

      <div style="margin-top:6px;">
        Montant HT des paiements confirmés :
        <strong>
          ${paidAmountHT.toFixed(2)} €
        </strong>
      </div>

      ${
        representativeRows.length
          ? `

            <div
              class="sportSubTitle"
              style="margin-top:16px;"
            >
              Échanges Cabas par représentant
            </div>

            ${
              representativeRows
                .map(
                  row=>`

                    <div
                      style="
                        margin-top:8px;
                        padding-top:8px;
                        border-top:1px solid rgba(47,93,70,.18);
                      "
                    >

                      <strong>
                        ${sportEsc(
                          row.name
                        )}
                      </strong>

                      ${
                        row.team
                          ? " — " +
                            sportEsc(
                              row.team
                            )
                          : ""
                      }

                      <br>

                      ${row.exchanges}
                      échange(s) Cabas

                      —
                      ${row.coins}
                      bocitecoins utilisés

                    </div>

                  `
                )
                .join("")
            }

          `
          : ""
      }

      ${
        supportRepresentativeRows.length
          ? `

            <div
              class="sportSubTitle"
              style="margin-top:18px;"
            >
              Parrainages par représentant
            </div>

            ${
              supportRepresentativeRows
                .map(
                  row=>`

                    <div
                      style="
                        margin-top:8px;
                        padding-top:8px;
                        border-top:1px solid rgba(47,93,70,.18);
                      "
                    >

                      <strong>
                        ${sportEsc(
                          row.name
                        )}
                      </strong>

                      ${
                        row.team
                          ? " — " +
                            sportEsc(
                              row.team
                            )
                          : ""
                      }

                      <br>

                      ${row.supports}
                      parrainage(s) confirmé(s)

                      <br>

                      Montant HT :
                      <strong>
                        ${row.amountHT.toFixed(2)} €
                      </strong>

                    </div>

                  `
                )
                .join("")
            }

          `
          : ""
      }

    </div>
  `;

  const operations=[];

  ledger.forEach(
    item=>{

      let label=
        item.reason ||
        "Mouvement bocitecoins";

      if(
        item.direction ===
        "solidarity_transfer"
      ){

        label=
          "Orientation vers une association solidaire";
      }

      if(
        item.direction ===
        "expire"
      ){

        label=
          "Clôture de saison";
      }

      operations.push({

        ts:
          sportHistoryTimestamp(
            item
          ),

        title:
          label,

        detail:
          (
            item.direction ===
            "credit"
              ? "+"
              : "-"
          ) +
          String(
            item.amount || 0
          ) +
          " bocitecoins" +
          (
            item.team
              ? " — " +
                item.team
              : ""
          )
      });
    }
  );

  exchanges.forEach(
    item=>{

      const actor=
        item.actor &&
        item.actor.label
          ? item.actor.label
          : "Partenaire";

      operations.push({

        ts:
          sportHistoryTimestamp(
            item
          ),

        title:
          "Cabas Sport validé",

        detail:
          String(
            item.amount || 30
          ) +
          " bocitecoins — " +
          actor +
          (
            item.representative &&
            item.representative.name
              ? " — présenté par " +
                String(
                  item.representative.name
                )
              : ""
          ) +
          (
            item.representative &&
            item.representative.team
              ? " — " +
                String(
                  item.representative.team
                )
              : ""
          ) +
          (
            item.operationRef
              ? " — Réf. " +
                String(
                  item.operationRef
                )
              : ""
          )
      });
    }
  );

  payments.forEach(
    item=>{

      operations.push({

        ts:
          sportHistoryTimestamp(
            item
          ),

        title:
          item.status === "paid"
            ? "Parrainage payé"
            : "Parrainage en cours",

        detail:
          String(
            item.merchantName ||
            "Commerce partenaire"
          ) +
          " — " +
          Number(
            item.amountHT || 0
          ).toFixed(2) +
          " € HT" +
          (
            item.representative &&
            item.representative.name
              ? " — obtenu par " +
                String(
                  item.representative.name
                )
              : ""
          ) +
          (
            item.representative &&
            item.representative.team
              ? " — " +
                String(
                  item.representative.team
                )
              : ""
          ) +
          (
            item.paymentReference
              ? " — Réf. " +
                String(
                  item.paymentReference
                )
              : ""
          )
      });
    }
  );

  operations.sort(
    (a,b) =>
      b.ts - a.ts
  );

  const latest=
    operations.slice(
      0,
      30
    );

  details.innerHTML=
    latest.length
      ? `

        <div class="sportSubTitle">
          Dernières opérations de la période
        </div>

        ${
          latest
            .map(
              item=>`

                <div class="sportItem">

                  <div class="sportName">
                    ${sportEsc(
                      item.title
                    )}
                  </div>

                  <div style="margin-top:5px;">
                    ${sportEsc(
                      item.detail
                    )}
                  </div>

                  <div
                    class="sportStatus"
                    style="margin-top:5px;"
                  >
                    ${
                      item.ts
                        ? new Date(
                            item.ts
                          )
                          .toLocaleString(
                            "fr-FR"
                          )
                        : ""
                    }
                  </div>

                </div>

              `
            )
            .join("")
        }

      `
      : `

        <div class="sportStatus">
          Aucune opération enregistrée
          pour cette période.
        </div>

      `;
}


/* =========================================================
   FIN BLOC SPORT 5
   ========================================================= */

  /* =========================================================
   BLOC SPORT 6
   ÉCRANS PRIVÉS
   ========================================================= */

function sportPresidentHtml(){

  if(
    sportSession.role !==
    "president"
  ){
    return "";
  }

  const c=
    sportClub();

  const waiting=
    sportReceipts()
      .filter(
        x =>
          x.status !==
          "received"
      ).length;

  return `

    ${sportTitle(
      "Présidence de la structure sportive avec"
    )}

    ${sportGovernanceHtml()}

    ${sportGovernanceReportHtml()}

    ${sportPresidentHistoryHtml()}

    <div class="sportCard">

      <div class="sportText">

        Le président
        ou responsable légal
        dispose de l’accès maître
        depuis la porte privée
        ${sportBrandHtml()},
        sur le même principe
        que la Direction de l’École.

        Aucun identifiant Président
        n’est affiché
        dans la partie publique.

        Il crée,
        suspend,
        réactive
        et réattribue
        jusqu’à deux accès
        entraîneur ou responsable.

      </div>

      <div class="sportCard">

        <div class="sportSubTitle">
          Fiche d’identité
          de la structure sportive
          avec ${sportBrandHtml()}
        </div>

        <label class="sportLabel">
          Nom usuel
        </label>

        <input
          id="sportClubName"
          class="sportField"
          value="${sportEsc(c.name)}"
        >

        <label class="sportLabel">
          Nom officiel
        </label>

        <input
          id="sportOfficialName"
          class="sportField"
          value="${sportEsc(c.officialName)}"
        >

        <label class="sportLabel">
          Type de structure
        </label>

        <select
          id="sportOrganizationType"
          class="sportField"
        >

          <option
            value="association_sportive"
            ${c.organizationType==="association_sportive" ? "selected" : ""}
          >
            Association sportive
          </option>

          <option
            value="club_sportif"
            ${c.organizationType==="club_sportif" ? "selected" : ""}
          >
            Club sportif
          </option>

          <option
            value="section_sportive"
            ${c.organizationType==="section_sportive" ? "selected" : ""}
          >
            Section sportive
          </option>

          <option
            value="autre"
            ${c.organizationType==="autre" ? "selected" : ""}
          >
            Autre structure sportive
          </option>

        </select>

        <label class="sportLabel">
          Forme juridique
        </label>

        <input
          id="sportLegalForm"
          class="sportField"
          value="${sportEsc(c.legalForm)}"
          placeholder="Ex : association loi 1901"
        >

        <label class="sportLabel">
          SIREN / SIRET
        </label>

        <input
          id="sportSiret"
          class="sportField"
          value="${sportEsc(c.sirenSiret)}"
        >

        <label class="sportLabel">
          Numéro RNA
        </label>

        <input
          id="sportRna"
          class="sportField"
          value="${sportEsc(c.rnaNumber)}"
        >

        <label class="sportLabel">
          Situation TVA
        </label>

        <select
          id="sportVatStatus"
          class="sportField"
        >

          <option
            value="to_verify"
            ${c.vatStatus==="to_verify" ? "selected" : ""}
          >
            À vérifier
          </option>

          <option
            value="subject"
            ${c.vatStatus==="subject" ? "selected" : ""}
          >
            Assujetti à la TVA
          </option>

          <option
            value="not_subject"
            ${c.vatStatus==="not_subject" ? "selected" : ""}
          >
            Non assujetti / exonéré selon situation validée
          </option>

        </select>

        <label class="sportLabel">
          N° TVA intracommunautaire
        </label>

        <input
          id="sportVatNumber"
          class="sportField"
          value="${sportEsc(c.vatNumber)}"
        >

        <label class="sportLabel">
          Email comptable
        </label>

        <input
          id="sportAccountingEmail"
          class="sportField"
          value="${sportEsc(c.accountingEmail)}"
        >

        <div class="sportStatus">

          La TVA
          et le type de justificatif
          ne sont jamais déduits
          du seul mot
          « association »
          ou « club ».

          Le statut fiscal validé
          de la structure
          est enregistré
          dans cette fiche.

        </div>

        <label class="sportLabel">
          Commune partenaire
        </label>

        <input
          id="sportCommune"
          class="sportField"
          value="${sportEsc(c.commune)}"
        >

        <label class="sportLabel">
          Discipline sportive
        </label>

        <input
          id="sportName"
          class="sportField"
          value="${sportEsc(c.sportName)}"
        >

        <label class="sportLabel">
          Fédération
        </label>

        <input
          id="sportFederation"
          class="sportField"
          value="${sportEsc(c.federation)}"
        >

        <label class="sportLabel">
          Ligue / district / comité
        </label>

        <input
          id="sportLeague"
          class="sportField"
          value="${sportEsc(c.league)}"
        >

        <label class="sportLabel">
          Identifiant officiel
        </label>

        <input
          id="sportOfficialId"
          class="sportField"
          value="${sportEsc(c.officialClubId)}"
        >

        <label class="sportLabel">
          Équipes —
          une par ligne
          ou séparées par une virgule
        </label>

        <textarea
          id="sportTeams"
          class="sportField"
        >${sportEsc(c.teams.join("\n"))}</textarea>

        <label class="sportLabel">
          Source officielle des résultats
        </label>

        <input
          id="sportOfficialUrl"
          class="sportField"
          value="${sportEsc(c.officialResultsUrl)}"
          placeholder="Fédération, ligue, district, comité ou compétition officielle"
        >

        <label class="sportLabel">
          Page publique du club
        </label>

        <input
          id="sportPublicUrl"
          class="sportField"
          value="${sportEsc(c.publicNetworkUrl)}"
        >

        <label class="sportLabel">
          Fin de saison
        </label>

        <input
          id="sportSeasonEnd"
          class="sportField"
          type="date"
          value="${sportEsc(c.seasonEndDate)}"
        >

        <div class="sportStatus">

          Référence club :
          <strong>
            ${sportEsc(
              c.clubRef ||
              "attribuée après validation"
            )}
          </strong>

        </div>

        <div class="sportActions">

          <button
            id="sportIdentitySave"
            class="sportBtn"
            type="button"
          >
            Enregistrer la fiche
          </button>

          <button
            id="sportSyncResults"
            class="sportBtn"
            type="button"
          >
            Vérifier les résultats officiels
          </button>

        </div>

        <div
          id="sportIdentityStatus"
          class="sportStatus"
        ></div>

        <div
          id="sportResultSyncStatus"
          class="sportStatus"
        ></div>

      </div>


      <div class="sportCard">

        <div class="sportSubTitle">
          Accès entraîneurs / responsables
          avec ${sportBrandHtml()}
        </div>

        <label class="sportLabel">
          Nom
        </label>

        <input
          id="sportCoachName"
          class="sportField"
        >

        <label class="sportLabel">
          Équipe
        </label>

        <input
          id="sportCoachTeam"
          class="sportField"
        >

        <label class="sportLabel">
          Code initial
        </label>

        <input
          id="sportCoachCode"
          class="sportField"
          type="password"
          placeholder="6 caractères minimum"
        >

        <button
          id="sportCoachCreate"
          class="sportBtn"
          type="button"
          style="
            width:100%;
            margin-top:12px;
          "
        >
          Créer l’accès
        </button>

        <div
          id="sportAccessStatus"
          class="sportStatus"
        ></div>

        <div
          id="sportAccessList"
        ></div>

      </div>


      <div class="sportCard">

        <div class="sportSubTitle">
          Suivi soutien / justificatifs
          avec ${sportBrandHtml()}
        </div>

        <div class="sportStatus">

          Dossiers de soutien :
          <strong>
            ${sportDossiers().length}
          </strong>

          <br>

          Justificatifs en attente :
          <strong>
            ${waiting}
          </strong>

        </div>

      </div>

    </div>
  `;
}


function sportTrainingHtml(){

  return `

    ${sportTitle(
      "Entraînements responsables avec"
    )}

    <div class="sportCard">

      <div class="sportText">

        Une séance correctement terminée
        fait gagner
        <strong>
          1 bocitecoin à l’équipe
        </strong>
        après deux validations indépendantes.

        Critères :
        consignes respectées,
        comportement respectueux,
        matériel rangé,
        vestiaires
        et espaces laissés propres.

      </div>

      <label class="sportLabel">
        Date
      </label>

      <input
        id="sportTrainingDate"
        class="sportField"
        type="date"
      >

      <label class="sportLabel">
        Équipe
      </label>

      <input
        id="sportTrainingTeam"
        class="sportField"
        value="${sportEsc(
          sportSession.team ||
          ""
        )}"
      >

      <label class="sportLabel">
        Séance
      </label>

      <input
        id="sportTrainingLabel"
        class="sportField"
        value="Entraînement"
      >

      <button
        id="sportTrainingCreate"
        class="sportBtn"
        type="button"
        style="
          width:100%;
          margin-top:12px;
        "
      >
        Enregistrer la séance
      </button>

      <div
        id="sportTrainingList"
      ></div>

    </div>
  `;
}


function sportResultsPrivateHtml(){

  return `

    ${sportTitle(
      "Résultats du week-end avec"
    )}

    <div class="sportCard">

      <div class="sportText">

        Les résultats sont recherchés
        à partir de la commune partenaire,
        de la fiche d’identité,
        de la référence du club
        et de la source officielle.

        Une victoire définitivement confirmée
        fait gagner
        <strong>
          1 bocitecoin
        </strong>
        une seule fois.

      </div>

      ${
        sportSession.role ===
        "president"
          ? `

            <div class="sportCard">

              <div class="sportSubTitle">
                Saisie de secours
                par la présidence
              </div>

              <div class="sportText">

                À utiliser uniquement
                si la récupération automatique
                est indisponible.

                Aucun bocitecoin
                n’est crédité
                avant la vérification officielle.

              </div>

              <label class="sportLabel">
                Équipe
              </label>

              <input
                id="sportManualTeam"
                class="sportField"
              >

              <label class="sportLabel">
                Résultat / compte-rendu
              </label>

              <textarea
                id="sportManualResult"
                class="sportField"
              ></textarea>

              <button
                id="sportManualSave"
                class="sportBtn"
                type="button"
                style="
                  width:100%;
                  margin-top:12px;
                "
              >
                Enregistrer le résultat de secours
              </button>

            </div>

          `
          : ""
      }

      <div
        id="sportPrivateResults"
      ></div>

    </div>
  `;
}


function sportSolidarityHtml(){

  const saved=
    sportLoad(
      SPORT_KEYS.solidarity,
      {
        mode:"none",
        map:{}
      }
    );

  const a=
    sportAssociations();

  return `

    ${sportTitle(
      "Orientation solidaire du club avec"
    )}

    <div class="sportCard">

      <div class="sportText">

        Le club choisit
        de garder ses bocitecoins,
        d’en partager une partie
        ou de les orienter entièrement
        vers une association.

        En fin de saison,
        un reliquat inférieur à 30
        peut être remis à la mairie
        pour une association validée.

      </div>

      <label class="sportCheck">

        <input
          type="radio"
          name="sportDonMode"
          value="none"
          ${saved.mode==="none" ? "checked" : ""}
        >

        Garder 100 % pour le club

      </label>

      <label class="sportCheck">

        <input
          type="radio"
          name="sportDonMode"
          value="partial"
          ${saved.mode==="partial" ? "checked" : ""}
        >

        Partager une partie

      </label>

      <label class="sportCheck">

        <input
          type="radio"
          name="sportDonMode"
          value="full"
          ${saved.mode==="full" ? "checked" : ""}
        >

        Donner 100 %

      </label>

      <div class="sportCard">

        <div class="sportSubTitle">
          Associations proposées
          avec ${sportBrandHtml()}
        </div>

        ${
          a.map(
            x => `

              <div class="sportItem">

                <label class="sportCheck">

                  <input
                    class="sportAssoPick"
                    type="checkbox"
                    data-id="${sportEsc(x.id)}"
                    ${
                      saved.map &&
                      saved.map[x.id] != null
                        ? "checked"
                        : ""
                    }
                  >

                  <span>

                    <strong>
                      ${sportEsc(
                        x.legalName ||
                        x.label
                      )}
                    </strong>

                    —
                    ${sportEsc(x.cause)}
                    —

                    ${
                      sportAssociationOK(x)
                        ? "association validée"
                       : " — En attente du choix défini par la mairie et Bo'CitéArt"
                    }

                  </span>

                </label>

                <label class="sportLabel">
                  Part en %
                </label>

                <input
                  class="sportField sportAssoPct"
                  type="number"
                  min="0"
                  max="100"
                  value="${Number(
                    saved.map &&
                    saved.map[x.id] ||
                    0
                  )}"
                  data-id="${sportEsc(x.id)}"
                >

              </div>

            `
          ).join("")
        }

      </div>

      <button
        id="sportSolidaritySave"
        class="sportBtn"
        type="button"
        style="
          width:100%;
          margin-top:12px;
        "
      >
        Enregistrer l’orientation
      </button>

      <div
        id="sportSolidarityStatus"
        class="sportStatus"
      >
        Modalités d’échange
        et de remise des reliquats
        à voir avec la mairie.
      </div>

    </div>
  `;
}


function sportBagHtml(){

  return `

    ${sportTitle(
      "Cabas Sport avec"
    )}

    <div class="sportCard">

      <div class="sportText">

        <strong>
          Un Cabas Sport =
          exactement 30 bocitecoins.
        </strong>

        <br><br>

        Il n’existe pas
        de Cabas de 10,
        20,
        40
        ou 50.

        <br><br>

        Chez un commerçant partenaire,
        le représentant du club
        effectue d’abord
        un achat réel
        d’au moins <strong>10 €</strong>.

        Le commerçant
        scanne ensuite
        le code du club
        et valide l’échange.

        Lorsque l’opération
        est réalisée par la mairie,
        aucun achat n’est demandé.

        Le club ne déclenche jamais
        lui-même l’opération.

        <br><br>

        La nourriture
        et les boissons admises
        représentent au maximum
        <strong>30 %</strong>.

        Les bocitecoins
        ne sont jamais transférables
        entre clubs.

        <br><br>

        En fin de saison,
        un solde inférieur à 30
        peut être remis à la mairie
        pour une association solidaire validée.

        L’opération est ventilée
        sur le compte municipal dédié
        au service Sport / solidarité.

      </div>

      <div
        id="sportWalletStatus"
        class="sportStatus"
      ></div>

      <div
        id="sportSeasonNotice"
        class="sportStatus"
        style="display:none"
      ></div>

      <div
        id="sportExchangeHistory"
      ></div>

    </div>
  `;
}


/* =========================================================
   FIN BLOC SPORT 6
   ========================================================= */

  /* =========================================================
   BLOC SPORT 7
   PARRAINAGE — COMMERCE — PAIEMENT
   ========================================================= */

function sportPaymentRecords(){

  const x=
    sportLoad(
      SPORT_KEYS.payments,
      []
    );

  return Array.isArray(x)
    ? x
    : [];
}


function sportSavePaymentRecords(x){

  return sportSave(
    SPORT_KEYS.payments,
    Array.isArray(x)
      ? x.slice(-500)
      : []
  );
}


function sportSupportReadMerchant(){

  return {

    name:
      String(
        sportEl(
          "sportSupportMerchantName"
        )?.value ||
        ""
      ).trim(),

    sirenSiret:
      String(
        sportEl(
          "sportSupportMerchantSiret"
        )?.value ||
        ""
      ).trim(),

    address:
      String(
        sportEl(
          "sportSupportMerchantAddress"
        )?.value ||
        ""
      ).trim(),

    phone:
      String(
        sportEl(
          "sportSupportMerchantPhone"
        )?.value ||
        ""
      ).trim(),

    email:
      String(
        sportEl(
          "sportSupportMerchantEmail"
        )?.value ||
        ""
      ).trim(),

    accountingEmail:
      String(
        sportEl(
          "sportSupportMerchantAccountingEmail"
        )?.value ||
        ""
      ).trim()
  };
}


function sportSupportFillMerchant(profile){

  if(
    !profile ||
    typeof profile !== "object"
  ){
    return;
  }

  const data={

    sportSupportMerchantName:
      profile.name ||
      profile.shopName ||
      profile.companyName ||
      "",

    sportSupportMerchantSiret:
      profile.sirenSiret ||
      profile.siret ||
      "",

    sportSupportMerchantAddress:
      profile.address ||
      "",

    sportSupportMerchantPhone:
      profile.phone ||
      "",

    sportSupportMerchantEmail:
      profile.email ||
      "",

    sportSupportMerchantAccountingEmail:
      profile.accountingEmail ||
      profile.email ||
      ""
  };

  Object
    .keys(data)
    .forEach(
      id=>{

        const e=
          sportEl(id);

        if(e){

          e.value=
            String(
              data[id] ||
              ""
            );
        }
      }
    );

  window
    .BOCITEART_LAST_SPORT_MERCHANT_PROFILE=
      profile;
}


function sportSupportSaveMerchant(){

  const profile=
    sportSupportReadMerchant();

  if(!profile.name){
    return;
  }

  const all=
    sportContacts();

  let index=-1;

  if(profile.sirenSiret){

    index=
      all.findIndex(
        x =>
          String(
            x.sirenSiret ||
            ""
          ) ===
          String(
            profile.sirenSiret
          )
      );
  }

  if(index < 0){

    index=
      all.findIndex(
        x =>
          String(
            x.name ||
            ""
          )
            .trim()
            .toLowerCase() ===
          profile.name
            .trim()
            .toLowerCase()
      );
  }

  const item={

    id:
      index >= 0
        ? all[index].id
        : sportId(
            "merchant"
          ),

    name:
      profile.name,

    sirenSiret:
      profile.sirenSiret,

    address:
      profile.address,

    phone:
      profile.phone,

    email:
      profile.email,

    accountingEmail:
      profile.accountingEmail,

    archived:
      false,

    updatedAt:
      Date.now()
  };

  if(index >= 0){

    all[index]=
      Object.assign(
        {},
        all[index],
        item
      );

  }else{

    all.push(item);
  }

  sportSaveContacts(all);
}


async function sportSupportFindMerchant(){

  const status=
    sportEl(
      "sportSupportStatus"
    );

  const club=
    sportClub();

  if(!club.clubRef){

    if(status){

      status.textContent=
        "La fiche d’identité du club doit d’abord être validée.";
    }

    return;
  }

  if(
    SPORT_CONFIG
      .merchantLookupEndpoint
  ){

    if(status){

      status.textContent=
        "Recherche du commerce…";
    }

    try{

      const response=
        await fetch(
          SPORT_CONFIG
            .merchantLookupEndpoint,
          {
            method:"POST",
            credentials:"include",
            headers:{
              "Content-Type":
                "application/json"
            },
            body:
              JSON.stringify({
                clubRef:
                  club.clubRef
              })
          }
        );

      if(!response.ok){
        throw new Error();
      }

      const data=
        await response.json();

      if(
        !data ||
        !data.merchant
      ){
        throw new Error();
      }

      sportSupportFillMerchant(
        data.merchant
      );

      sportSupportSaveMerchant();

      if(status){

        status.textContent=
          "Commerce reconnu. Sa fiche est préremplie.";
      }

      return;

    }catch(error){

      if(status){

        status.textContent=
          "Le commerce n’a pas été retrouvé automatiquement. La saisie manuelle reste disponible.";
      }

      return;
    }
  }

  if(
    window
      .BOCITEART_LAST_SPORT_MERCHANT_PROFILE
  ){

    sportSupportFillMerchant(
      window
        .BOCITEART_LAST_SPORT_MERCHANT_PROFILE
    );

    if(status){

      status.textContent=
        "Fiche commerce retrouvée.";
    }

    return;
  }

  if(status){

    status.textContent=
      "Aucun commerce scanné n’a été retrouvé. Utilisez la saisie manuelle.";
  }
}


function sportSupportAmount(){

  const value=
    Number(
      sportEl(
        "sportSupportAmountHT"
      )?.value ||
      0
    );

  return Math.round(
    value *
    100
  ) / 100;
}


function sportSupportChoice(){

  return String(
    document.querySelector(
      'input[name="sportSupportAllocation"]:checked'
    )?.value ||
    "ALL_CLUB"
  );
}


function sportSupportUpdatePreview(){

  const amount=
    sportSupportAmount();

  const choice=
    sportSupportChoice();

  const preview=
    sportEl(
      "sportSupportPreview"
    );

  const associationBox=
    sportEl(
      "sportSupportAssociationBox"
    );

  if(associationBox){

    associationBox.style.display=
      choice ===
      "HALF_HALF"
        ? "block"
        : "none";
  }

  if(!preview){
    return;
  }

  if(
    !Number.isFinite(amount) ||
    amount <
      Number(
        SPORT_CONFIG.supportMinimumHT ||
        50
      )
  ){

    preview.textContent=
      "Montant minimum : 50 € HT.";

    return;
  }

  const allocation=
    sportAllocation(
      choice,
      amount
    );

  if(!allocation){

    preview.textContent=
      "Choix de répartition invalide.";

    return;
  }

  if(
    choice ===
    "ALL_CLUB"
  ){

    preview.innerHTML=

      "<strong>" +
      sportEsc(
        amount.toFixed(2)
      ) +
      " € HT</strong>" +

      " — 100 % destinés au club avant traitement du paiement.";

    return;
  }

  preview.innerHTML=

    "<strong>" +
    sportEsc(
      amount.toFixed(2)
    ) +
    " € HT</strong>" +

    " — " +

    sportEsc(
      allocation.clubHT
        .toFixed(2)
    ) +

    " € HT pour le club et " +

    sportEsc(
      allocation.associationHT
        .toFixed(2)
    ) +

    " € HT pour l’association avant traitement du paiement.";
}


async function sportSupportStartPayment(){

  const status=
    sportEl(
      "sportSupportStatus"
    );

  const club=
    sportClub();

  const amountHT=
    sportSupportAmount();

  const choice=
    sportSupportChoice();

  const merchant=
    sportSupportReadMerchant();

  const representative={

    ref:
      String(
        sportSession.accountId ||
        sportSession.role ||
        ""
      ),

    name:
      String(
        sportSession.name ||
        "Responsable du club"
      ),

    role:
      String(
        sportSession.role ||
        ""
      ),

    team:
      String(
        sportSession.team ||
        ""
      )
  };

  if(!club.clubRef){

    if(status){

      status.textContent=
        "La fiche d’identité du club doit être validée avant le paiement.";
    }

    return;
  }

  if(
    !Number.isFinite(amountHT) ||
    amountHT <
      Number(
        SPORT_CONFIG.supportMinimumHT ||
        50
      )
  ){

    if(status){

      status.textContent=
        "Le montant minimum est de 50 € HT.";
    }

    return;
  }

  if(
    choice !== "ALL_CLUB" &&
    choice !== "HALF_HALF"
  ){

    if(status){

      status.textContent=
        "Choisissez 100 % au club ou 50 / 50.";
    }

    return;
  }

  if(
    !merchant.name ||
    !merchant.sirenSiret ||
    !merchant.address ||
    !merchant.accountingEmail
  ){

    if(status){

      status.textContent=
        "Complétez le nom, le SIRET, l’adresse et l’email comptable du commerce.";
    }

    return;
  }

  let associationId="";

  if(
    choice ===
    "HALF_HALF"
  ){

    associationId=
      String(
        sportEl(
          "sportSupportAssociation"
        )?.value ||
        ""
      );

    const association=
      sportAssociations()
        .find(
          x =>
            String(x.id) ===
            String(
              associationId
            )
        );

    if(
      !association ||
      !sportAssociationOK(
        association
      )
    ){

      if(status){

        status.textContent=
          "Choisissez une association partenaire validée.";
      }

      return;
    }
  }

  sportSupportSaveMerchant();

  const payload={

    productCode:
      SPORT_CONFIG
        .billingProductCode,

    amountHT:
      amountHT,

    clubRef:
      club.clubRef,

    representative:
      representative,

    allocationCode:
      choice,

    associationId:
      associationId,

    merchant:{

      name:
        merchant.name,

      sirenSiret:
        merchant.sirenSiret,

      address:
        merchant.address,

      phone:
        merchant.phone,

      email:
        merchant.email,

      accountingEmail:
        merchant.accountingEmail
    },

    returnUrl:
      window.location.href,

    cancelUrl:
      window.location.href
  };

  if(
    !SPORT_CONFIG
      .checkoutEndpoint
  ){

    if(status){

      status.textContent=
        "Le paiement sécurisé n’est pas encore raccordé au service de paiement.";
    }

    return;
  }

  if(status){

    status.textContent=
      "Préparation du paiement sécurisé…";
  }

  try{

    const response=
      await fetch(
        SPORT_CONFIG
          .checkoutEndpoint,
        {
          method:
            "POST",
          credentials:
            "include",
          headers:{
            "Content-Type":
              "application/json"
          },
          body:
            JSON.stringify(
              payload
            )
        }
      );

    if(!response.ok){
      throw new Error();
    }

    const data=
      await response.json();

    if(
      !data ||
      data.ok !== true ||
      !data.paymentReference ||
      !data.checkoutUrl
    ){
      throw new Error();
    }

    const payments=
      sportPaymentRecords();

    payments.push({

      paymentReference:
        String(
          data.paymentReference
        ),

      clubRef:
        club.clubRef,

      representative:
        representative,

      merchantName:
        merchant.name,

      merchantSiret:
        merchant.sirenSiret,

      amountHT:
        amountHT,

      allocationCode:
        choice,

      associationId:
        associationId,

      status:
        "checkout_created",

      createdAt:
        Date.now()
    });

    sportSavePaymentRecords(
      payments
    );

    if(status){

      status.textContent=
        "Paiement sécurisé préparé.";
    }

    window.location.assign(
      data.checkoutUrl
    );

  }catch(error){

    if(status){

      status.textContent=
        "Le paiement sécurisé est momentanément indisponible.";
    }
  }
}


async function sportSupportCheckPayment(){

  const status=
    sportEl(
      "sportSupportStatus"
    );

  const records=
    sportPaymentRecords()
      .slice()
      .reverse();

  const payment=
    records.find(
      x =>
        x &&
        x.paymentReference
    );

  if(!payment){

    if(status){

      status.textContent=
        "Aucun paiement à vérifier.";
    }

    return;
  }

  if(
    !SPORT_CONFIG
      .paymentStatusEndpoint
  ){

    if(status){

      status.textContent=
        "La vérification automatique du paiement n’est pas encore raccordée.";
    }

    return;
  }

  if(status){

    status.textContent=
      "Vérification du paiement…";
  }

  try{

    const response=
      await fetch(
        SPORT_CONFIG
          .paymentStatusEndpoint,
        {
          method:
            "POST",
          credentials:
            "include",
          headers:{
            "Content-Type":
              "application/json"
          },
          body:
            JSON.stringify({
              paymentReference:
                payment.paymentReference
            })
        }
      );

    if(!response.ok){
      throw new Error();
    }

    const data=
      await response.json();

    if(
      data &&
      data.status ===
      "paid"
    ){

      const all=
        sportPaymentRecords();

      const index=
        all.findIndex(
          x =>
            String(
              x.paymentReference
            ) ===
            String(
              payment.paymentReference
            )
        );

      if(index >= 0){

        all[index].status=
          "paid";

        all[index].paidAt=
          Date.now();

        all[index].invoiceStatus=
          data.invoiceSent === true
            ? "sent"
            : "processing";

        sportSavePaymentRecords(
          all
        );
      }

      if(status){

        status.textContent=
          data.invoiceSent === true
            ? "Paiement confirmé. La facture a été envoyée au commerce."
            : "Paiement confirmé. La facture est en cours d’envoi au commerce.";
      }

      sportRenderPresidentHistory();

      return;
    }

    if(status){

      status.textContent=
        "Le paiement n’est pas encore confirmé.";
    }

  }catch(error){

    if(status){

      status.textContent=
        "La vérification du paiement est momentanément indisponible.";
    }
  }
}


function sportInitSupportPaymentUi(){

  const amount=
    sportEl(
      "sportSupportAmountHT"
    );

  if(amount){

    amount.oninput=
      sportSupportUpdatePreview;

    amount.onchange=
      sportSupportUpdatePreview;
  }

  document
    .querySelectorAll(
      'input[name="sportSupportAllocation"]'
    )
    .forEach(
      input=>{

        input.onchange=
          sportSupportUpdatePreview;
      }
    );

  const findMerchant=
    sportEl(
      "sportSupportFindMerchant"
    );

  if(findMerchant){

    findMerchant.onclick=
      sportSupportFindMerchant;
  }

  const pay=
    sportEl(
      "sportSupportPayBtn"
    );

  if(pay){

    pay.onclick=
      sportSupportStartPayment;
  }

  const check=
    sportEl(
      "sportSupportCheckPayment"
    );

  if(check){

    check.onclick=
      sportSupportCheckPayment;
  }

  sportSupportUpdatePreview();
}


function sportSupportHtml(){

  const associations=
    sportAssociations()
      .filter(
        sportAssociationOK
      );

  return `

    ${sportTitle(
      "Publicité locale et soutien avec"
    )}

    <div class="sportCard">

      <div class="sportText">

        Le commerçant choisit librement
        le montant de son soutien
        à partir de
        <strong>
          50 € HT
        </strong>.

        <br><br>

        Il dispose de deux choix :

        <br>

        <strong>
          100 % pour le club
        </strong>

        ou

        <strong>
          50 % pour le club
          et 50 % pour une association
          de recherche partenaire.
        </strong>

        <br><br>

        La petite publicité locale
        est diffusée pendant
        <strong>
          7 jours consécutifs
        </strong>
        après confirmation du paiement.

      </div>

      <div class="sportCard">

        <div class="sportSubTitle">
          Commerce avec
          ${sportBrandHtml()}
        </div>

        <div class="sportText">

          Si le commerçant
          vient de scanner
          l’identité du club,
          sa fiche est retrouvée
          et préremplie.

          <br><br>

          La saisie manuelle reste disponible
          en cas d’impossibilité de lecture.

        </div>

        <button
          id="sportSupportFindMerchant"
          class="sportBtn"
          type="button"
          style="
            width:100%;
            margin-top:12px;
          "
        >
          Retrouver le commerce
          qui vient de me scanner
        </button>

        <label class="sportLabel">
          Nom du commerce / entreprise
        </label>

        <input
          id="sportSupportMerchantName"
          class="sportField"
        >

        <label class="sportLabel">
          SIREN / SIRET
        </label>

        <input
          id="sportSupportMerchantSiret"
          class="sportField"
        >

        <label class="sportLabel">
          Adresse
        </label>

        <input
          id="sportSupportMerchantAddress"
          class="sportField"
        >

        <label class="sportLabel">
          Téléphone
        </label>

        <input
          id="sportSupportMerchantPhone"
          class="sportField"
        >

        <label class="sportLabel">
          Email
        </label>

        <input
          id="sportSupportMerchantEmail"
          class="sportField"
        >

        <label class="sportLabel">
          Email comptable
        </label>

        <input
          id="sportSupportMerchantAccountingEmail"
          class="sportField"
        >

      </div>

      <div class="sportCard">

        <div class="sportSubTitle">
          Montant choisi avec
          ${sportBrandHtml()}
        </div>

        <label class="sportLabel">
          Montant du soutien en € HT
        </label>

        <input
          id="sportSupportAmountHT"
          class="sportField"
          type="number"
          min="50"
          step="1"
          value="50"
        >

        <div
          class="sportText"
          style="margin-top:8px;"
        >
          Montant minimum :
          <strong>
            50 € HT
          </strong>.

          Le commerçant peut choisir
          librement un montant supérieur.
        </div>

      </div>

      <div class="sportCard">

        <div class="sportSubTitle">
          Choix du commerçant avec
          ${sportBrandHtml()}
        </div>

        <label class="sportCheck">

          <input
            type="radio"
            name="sportSupportAllocation"
            value="ALL_CLUB"
            checked
          >

          <span>

            <strong>
              100 % pour le club
            </strong>

          </span>

        </label>

        <label class="sportCheck">

          <input
            type="radio"
            name="sportSupportAllocation"
            value="HALF_HALF"
          >

          <span>

            <strong>
              50 % pour le club
              / 50 % pour l’association
            </strong>

          </span>

        </label>

        <div
          id="sportSupportAssociationBox"
          style="
            display:none;
            margin-top:12px;
          "
        >

          <label class="sportLabel">
            Association de recherche partenaire
          </label>

          <select
            id="sportSupportAssociation"
            class="sportField"
          >

            <option value="">
              Choisir l’association
            </option>

            ${
              associations.length
                ? associations
                    .map(
                      x => `

                        <option
                          value="${sportEsc(x.id)}"
                        >
                          ${sportEsc(
                            x.legalName ||
                            x.label
                          )}
                        </option>

                      `
                    )
                    .join("")
                : `

                    <option
                      value=""
                      disabled
                    >
                      Aucune association
                      partenaire validée
                    </option>

                  `
            }

          </select>

        </div>

        <div
          id="sportSupportPreview"
          class="sportStatus"
        ></div>

      </div>

      <div class="sportCard">

        <div class="sportSubTitle">
          Paiement sécurisé avec
          ${sportBrandHtml()}
        </div>

        <div class="sportText">

          Le commerçant règle
          sur la page de paiement sécurisée.

          <br><br>

          Aucune donnée bancaire
          n’est saisie
          ni conservée
          dans ${sportBrandHtml()}.

          <br><br>

          Après confirmation du paiement,
          la facture correspondant
          au montant réellement payé
          est envoyée
          à l’adresse comptable du commerce.

          <br><br>

          La publicité locale
          n’est activée
          qu’après confirmation effective
          du paiement.

        </div>

        <div class="sportActions">

          <button
            id="sportSupportPayBtn"
            class="sportBtn"
            type="button"
          >
            Ouvrir le paiement sécurisé
          </button>

          <button
            id="sportSupportCheckPayment"
            class="sportBtn"
            type="button"
          >
            Vérifier le paiement
          </button>

        </div>

        <div
          id="sportSupportStatus"
          class="sportStatus"
        >
          Aucun paiement en cours.
        </div>

      </div>

    </div>
  `;
}

/* =========================================================
   FIN BLOC SPORT 7
   ========================================================= */

  /* =========================================================
   BLOC SPORT 8
   ACCÈS ENTRAÎNEURS — SÉANCES — CONTACTS
   ========================================================= */

function sportRenderAccessList(){

  const out=
    sportEl(
      "sportAccessList"
    );

  if(!out){
    return;
  }

  const a=
    sportAccess();

  if(
    !a.coaches.length
  ){

    out.innerHTML=
      '<div class="sportStatus">Aucun accès entraîneur ou responsable n’a encore été créé.</div>';

    return;
  }

  out.innerHTML=
    a.coaches
      .map(
        x => `

          <div class="sportItem">

            <div class="sportName">
              ${sportEsc(
                x.name ||
                "Responsable"
              )}
            </div>

            <div>
              Équipe :
              ${sportEsc(
                x.team ||
                "Toutes les équipes"
              )}
            </div>

            <div>
              Identifiant :
              <strong>
                ${sportEsc(
                  x.identifier ||
                  ""
                )}
              </strong>
            </div>

            <div>
              ${
                x.active === false
                  ? "Accès suspendu"
                  : "Accès actif"
              }
            </div>

            <div class="sportActions">

              <button
                class="sportBtn"
                data-sport-open="${sportEsc(x.id)}"
                type="button"
              >
                Ouvrir cet accès
              </button>

              <button
                class="sportBtn ${
                  x.active === false
                    ? ""
                    : "sportBtnDanger"
                }"
                data-sport-toggle="${sportEsc(x.id)}"
                type="button"
              >
                ${
                  x.active === false
                    ? "Réactiver"
                    : "Suspendre"
                }
              </button>

              <button
                class="sportBtn"
                data-sport-reset="${sportEsc(x.id)}"
                type="button"
              >
                Réinitialiser le code
              </button>

            </div>

          </div>

        `
      )
      .join("");

  out
    .querySelectorAll(
      "[data-sport-open]"
    )
    .forEach(
      b =>{

        b.onclick=()=>{

          const x=
            sportAccess()
              .coaches
              .find(
                y =>
                  String(y.id) ===
                  String(
                    b.dataset
                      .sportOpen
                  )
              );

          if(
            !x ||
            x.active === false
          ){
            return;
          }

          sportSession={

            role:
              "coach",

            accountId:
              x.id,

            name:
              x.name ||
              "Responsable",

            team:
              x.team ||
              "",

            openedFromPresident:
              true
          };

          window.bociteartSportSession=
            sportSession;

          openClubReserve();
        };
      }
    );

  out
    .querySelectorAll(
      "[data-sport-toggle]"
    )
    .forEach(
      b =>{

        b.onclick=()=>{

          const a=
            sportAccess();

          const i=
            a.coaches
              .findIndex(
                y =>
                  String(y.id) ===
                  String(
                    b.dataset
                      .sportToggle
                  )
              );

          if(i < 0){
            return;
          }

          a.coaches[i].active=
            a.coaches[i]
              .active === false
                ? true
                : false;

          a.coaches[i].updatedAt=
            Date.now();

          sportSaveAccess(a);

          sportRenderAccessList();
        };
      }
    );

  out
    .querySelectorAll(
      "[data-sport-reset]"
    )
    .forEach(
      b =>{

        b.onclick=
          async ()=>{

            const code=
              String(
                prompt(
                  "Nouveau code personnel — 6 caractères minimum",
                  ""
                ) ||
                ""
              ).trim();

            if(!code){
              return;
            }

            if(
              code.length < 6
            ){

              alert(
                "Le code doit comporter au moins 6 caractères."
              );

              return;
            }

            const a=
              sportAccess();

            const i=
              a.coaches
                .findIndex(
                  y =>
                    String(y.id) ===
                    String(
                      b.dataset
                        .sportReset
                    )
                );

            if(i < 0){
              return;
            }

            a.coaches[i].codeHash=
              await sportHash(
                code
              );

            a.coaches[i].active=
              true;

            a.coaches[i].updatedAt=
              Date.now();

            sportSaveAccess(a);

            sportResetFail(
              a.coaches[i]
                .identifier
            );

            alert(
              "Le code a été réinitialisé."
            );

            sportRenderAccessList();
          };
      }
    );
}


async function sportCreateCoach(){

  if(
    sportSession.role !==
    "president"
  ){
    return;
  }

  if(
    !sportRequireVerifiedGovernance()
  ){
    return;
  }

  const a=
    sportAccess();

  if(
    a.coaches.length >= 2
  ){

    alert(
      "Deux accès responsables sont déjà créés. Suspendez ou réattribuez un accès existant."
    );

    return;
  }

  const name=
    String(
      sportEl(
        "sportCoachName"
      )?.value ||
      ""
    ).trim();

  const team=
    String(
      sportEl(
        "sportCoachTeam"
      )?.value ||
      ""
    ).trim();

  const code=
    String(
      sportEl(
        "sportCoachCode"
      )?.value ||
      ""
    ).trim();

  if(!name){

    alert(
      "Renseignez le nom du responsable."
    );

    return;
  }

  if(
    code.length < 6
  ){

    alert(
      "Le code doit comporter au moins 6 caractères."
    );

    return;
  }

  const identifier=
    "SPORT-" +
    String(
      a.coaches.length +
      1
    ) +
    "-" +
    Math.random()
      .toString(36)
      .slice(2,6)
      .toUpperCase();

  a.coaches.push({

    id:
      sportId("coach"),

    identifier:
      identifier,

    name:
      name,

    team:
      team,

    codeHash:
      await sportHash(
        code
      ),

    active:
      true,

    createdAt:
      Date.now(),

    updatedAt:
      Date.now()
  });

  sportSaveAccess(a);

  const s=
    sportEl(
      "sportAccessStatus"
    );

  if(s){

    s.textContent=
      "Accès créé. Identifiant : " +
      identifier;
  }

  [
    "sportCoachName",
    "sportCoachTeam",
    "sportCoachCode"
  ].forEach(
    id =>{

      const e=
        sportEl(id);

      if(e){
        e.value="";
      }
    }
  );

  sportRenderAccessList();
}


function sportRenderTrainings(){

  const out=
    sportEl(
      "sportTrainingList"
    );

  if(!out){
    return;
  }

  const a=
    sportTrainings()
      .slice()
      .reverse()
      .slice(0,30);

  if(!a.length){

    out.innerHTML=
      '<div class="sportStatus">Aucune séance enregistrée.</div>';

    return;
  }

  out.innerHTML=
    a.map(
      x =>{

        const c=
          Array.isArray(
            x.confirmations
          )
            ? x.confirmations
            : [];

        const me=
          String(
            sportSession.accountId ||
            sportSession.role ||
            ""
          );

        const already=
          c.some(
            y =>
              String(
                y.accountId
              ) ===
              me
          );

        return `

          <div class="sportItem">

            <div class="sportName">
              ${sportEsc(
                x.team ||
                "Équipe"
              )}
            </div>

            <div>
              ${sportEsc(
                x.date ||
                ""
              )}
              —
              ${sportEsc(
                x.label ||
                "Entraînement"
              )}
            </div>

            <div>
              Validations indépendantes :
              ${c.length}/2
            </div>

            <div>

              ${
                x.coinAwarded
                  ? "✓ 1 bocitecoin crédité à l’équipe."
                  : "Consignes, respect, matériel, vestiaires et espaces doivent être validés."
              }

            </div>

            ${
              !x.coinAwarded &&
              !already
                ? `
                  <button
                    class="sportBtn"
                    data-training-confirm="${sportEsc(x.id)}"
                    type="button"
                    style="margin-top:10px"
                  >
                    Confirmer la séance correctement terminée
                  </button>
                `
                : ""
            }

          </div>

        `;
      }
    )
    .join("");

  out
    .querySelectorAll(
      "[data-training-confirm]"
    )
    .forEach(
      b =>{

        b.onclick=()=>{

          const all=
            sportTrainings();

          const i=
            all.findIndex(
              x =>
                String(x.id) ===
                String(
                  b.dataset
                    .trainingConfirm
                )
            );

          if(i < 0){
            return;
          }

          const x=
            all[i];

          x.confirmations=
            Array.isArray(
              x.confirmations
            )
              ? x.confirmations
              : [];

          const me=
            String(
              sportSession.accountId ||
              sportSession.role ||
              ""
            );

          if(
            !me ||
            x.confirmations.some(
              y =>
                String(
                  y.accountId
                ) ===
                me
            )
          ){
            return;
          }

          x.confirmations.push({

            accountId:
              me,

            name:
              sportSession.name ||
              "Responsable",

            ts:
              Date.now()
          });

          if(
            x.confirmations.length >= 2 &&
            !x.coinAwarded
          ){

            const r=
              sportAddCoin(
                "Séance sportive correctement terminée",
                "training:" +
                x.id,
                x.team
              );

            if(r.ok){

              x.coinAwarded=
                true;

              x.coinAwardedAt=
                Date.now();
            }
          }

          all[i]=x;

          sportSaveTrainings(all);

          sportRenderTrainings();

          sportRefreshWallet();
        };
      }
    );
}


function sportCreateTraining(){

  const team=
    String(
      sportEl(
        "sportTrainingTeam"
      )?.value ||
      sportSession.team ||
      ""
    ).trim();

  const date=
    String(
      sportEl(
        "sportTrainingDate"
      )?.value ||
      ""
    ).trim();

  const label=
    String(
      sportEl(
        "sportTrainingLabel"
      )?.value ||
      "Entraînement"
    ).trim();

  if(!team){

    alert(
      "Renseignez l’équipe."
    );

    return;
  }

  const all=
    sportTrainings();

  all.push({

    id:
      sportId(
        "training"
      ),

    team:
      team,

    date:
      date,

    label:
      label,

    confirmations:
      [],

    coinAwarded:
      false,

    createdBy:
      sportSession.accountId ||
      sportSession.role,

    createdAt:
      Date.now()
  });

  sportSaveTrainings(all);

  sportRenderTrainings();
}


function sportRenderPrivateResults(){

  const out=
    sportEl(
      "sportPrivateResults"
    );

  if(!out){
    return;
  }

  const a=
    sportReports()
      .slice()
      .reverse()
      .slice(0,40);

  out.innerHTML=
    a.length
      ? a.map(
          x => `

            <div class="sportItem">

              <div class="sportName">
                ${sportEsc(
                  x.team ||
                  "Équipe"
                )}
              </div>

              <div>
                ${sportEsc(
                  x.text ||
                  x.score ||
                  "Résultat"
                )}
              </div>

              <div>
                ${sportEsc(
                  x.playedAt ||
                  x.date ||
                  ""
                )}
              </div>

              <span class="sportPill">
                ${
                  x.official
                    ? "Résultat officiel vérifié"
                    : "Vérification officielle en attente"
                }
              </span>

            </div>

          `
        ).join("")
      : '<div class="sportStatus">Aucun résultat enregistré.</div>';
}


function sportSaveSolidarityFromUi(){

  const mode=
    String(
      document.querySelector(
        'input[name="sportDonMode"]:checked'
      )?.value ||
      "none"
    );

  const picks=
    Array.from(
      document.querySelectorAll(
        ".sportAssoPick"
      )
    );

  const map={};

  if(
    mode ===
    "none"
  ){

    sportSave(
      SPORT_KEYS.solidarity,
      {
        mode:
          mode,
        map:
          map
      }
    );

    const s=
      sportEl(
        "sportSolidarityStatus"
      );

    if(s){

      s.textContent=
        "Orientation enregistrée : 100 % pour le club.";
    }

    return;
  }

  const selected=
    picks.filter(
      x => x.checked
    );

  if(!selected.length){

    alert(
      "Sélectionnez au moins une association."
    );

    return;
  }

  if(
    mode ===
    "full"
  ){

    const base=
      Math.floor(
        100 /
        selected.length
      );

    let rest=100;

    selected.forEach(
      (x,i)=>{

        const id=
          x.dataset.id;

        map[id]=
          i ===
          selected.length-1
            ? rest
            : base;

        rest -=
          map[id];
      }
    );
  }

  if(
    mode ===
    "partial"
  ){

    let total=0;

    selected.forEach(
      x=>{

        const id=
          x.dataset.id;

        const input=
          document.querySelector(
            '.sportAssoPct[data-id="' +
            CSS.escape(id) +
            '"]'
          );

        const v=
          Math.max(
            0,
            Math.min(
              100,
              Number(
                input?.value ||
                0
              )
            )
          );

        map[id]=v;

        total += v;
      }
    );

    if(total !== 100){

      alert(
        "En partage partiel, le total doit être égal à 100 %."
      );

      return;
    }
  }

  sportSave(
    SPORT_KEYS.solidarity,
    {
      mode:
        mode,
      map:
        map
    }
  );

  const s=
    sportEl(
      "sportSolidarityStatus"
    );

  if(s){

    s.textContent=
      "Orientation enregistrée. Les destinations réelles restent soumises à la validation des associations proposées.";
  }
}


function sportRefreshWallet(){

  const w=
    sportWallet();

  const v=
    sportEl(
      "sportCoinBalance"
    );

  if(v){
    v.textContent=w.vert;
  }

  const s=
    sportEl(
      "sportWalletStatus"
    );

  if(s){

    s.textContent=
      w.vert >= 30
        ? (
            "Solde : " +
            w.vert +
            " bocitecoins. Cabas disponibles : " +
            Math.floor(
              w.vert /
              30
            ) +
            ". Chaque Cabas vaut exactement 30 bocitecoins."
          )
        : w.vert > 0
          ? (
              "Solde : " +
              w.vert +
              " bocitecoins. Aucun Cabas disponible. En fin de saison, ce reliquat peut être remis à la mairie pour une association validée."
            )
          : "Solde : 0 bocitecoin. Aucun rappel de fin de saison n’est nécessaire.";
  }

  sportRenderExchangeHistory();
}


function sportRenderExchangeHistory(){

  const out=
    sportEl(
      "sportExchangeHistory"
    );

  if(!out){
    return;
  }

  const a=
    sportExchanges()
      .slice()
      .reverse()
      .slice(0,20);

  out.innerHTML=
    a.length
      ? a.map(
          x => `

            <div class="sportItem">

              <strong>
                30 bocitecoins
              </strong>

              —
              ${sportEsc(
                x.date ||
                ""
              )}

              <br>

              ${sportEsc(
                x.actor &&
                x.actor.label ||
                "Validation commerçant / mairie"
              )}

              ${
                x.operationRef
                  ? "<br>Réf. " +
                    sportEsc(
                      x.operationRef
                    )
                  : ""
              }

            </div>

          `
        ).join("")
      : '<div class="sportStatus">Aucun Cabas échangé pour le moment.</div>';
}


function sportFindContact(name){

  return sportContacts()
    .find(
      x =>
        !x.archived &&
        String(
          x.name ||
          ""
        ).toLowerCase() ===
        String(
          name ||
          ""
        )
          .trim()
          .toLowerCase()
    );
}


function sportFillContact(x){

  if(!x){
    return;
  }

  [
    [
      "sportContactName",
      "name"
    ],
    [
      "sportContactSiret",
      "sirenSiret"
    ],
    [
      "sportContactAddress",
      "address"
    ],
    [
      "sportContactPhone",
      "phone"
    ],
    [
      "sportContactEmail",
      "email"
    ],
    [
      "sportContactAccountingEmail",
      "accountingEmail"
    ]

  ].forEach(
    ([id,k])=>{

      const e=
        sportEl(id);

      if(e){

        e.value=
          String(
            x[k] ||
            ""
          );
      }
    }
  );
}


function sportPrefillContact(){

  const x=
    sportFindContact(
      sportEl(
        "sportContactName"
      )?.value
    );

  if(x){
    sportFillContact(x);
  }
}


function sportSaveContact(){

  const name=
    String(
      sportEl(
        "sportContactName"
      )?.value ||
      ""
    ).trim();

  if(!name){

    alert(
      "Renseignez le nom du commerce."
    );

    return;
  }

  const all=
    sportContacts();

  const i=
    all.findIndex(
      x =>
        String(
          x.name ||
          ""
        ).toLowerCase() ===
        name.toLowerCase()
    );

  const x={

    id:
      i >= 0
        ? all[i].id
        : sportId(
            "merchant"
          ),

    name:
      name,

    sirenSiret:
      String(
        sportEl(
          "sportContactSiret"
        )?.value ||
        ""
      ).trim(),

    address:
      String(
        sportEl(
          "sportContactAddress"
        )?.value ||
        ""
      ).trim(),

    phone:
      String(
        sportEl(
          "sportContactPhone"
        )?.value ||
        ""
      ).trim(),

    email:
      String(
        sportEl(
          "sportContactEmail"
        )?.value ||
        ""
      ).trim(),

    accountingEmail:
      String(
        sportEl(
          "sportContactAccountingEmail"
        )?.value ||
        ""
      ).trim(),

    archived:
      false,

    updatedAt:
      Date.now()
  };

  if(i >= 0){

    all[i]=
      Object.assign(
        {},
        all[i],
        x
      );

  }else{

    all.push(x);
  }

  sportSaveContacts(all);

  const s=
    sportEl(
      "sportContactStatus"
    );

  if(s){

    s.textContent=
      "Fiche enregistrée. Elle sera préremplie au prochain passage.";
  }

  sportRenderContacts();
}


function sportRenderContacts(){

  const out=
    sportEl(
      "sportContactList"
    );

  if(!out){
    return;
  }

  const a=
    sportContacts()
      .filter(
        x => !x.archived
      );

  out.innerHTML=
    a.length
      ? a.map(
          x => `

            <div class="sportItem">

              <div class="sportName">
                ${sportEsc(x.name)}
              </div>

              <div>
                ${sportEsc(
                  x.address ||
                  ""
                )}
              </div>

              <div class="sportActions">

                <button
                  class="sportBtn"
                  data-contact-load="${sportEsc(x.id)}"
                  type="button"
                >
                  Reprendre la fiche
                </button>

                <button
                  class="sportBtn sportBtnDanger"
                  data-contact-archive="${sportEsc(x.id)}"
                  type="button"
                >
                  Retirer de la liste active
                </button>

              </div>

            </div>

          `
        ).join("")
      : '<div class="sportStatus">Aucune fiche commerce de secours enregistrée.</div>';

  out
    .querySelectorAll(
      "[data-contact-load]"
    )
    .forEach(
      b =>{

        b.onclick=()=>{

          sportFillContact(
            sportContacts()
              .find(
                x =>
                  String(x.id) ===
                  String(
                    b.dataset
                      .contactLoad
                  )
              )
          );
        };
      }
    );

  out
    .querySelectorAll(
      "[data-contact-archive]"
    )
    .forEach(
      b =>{

        b.onclick=()=>{

          const all=
            sportContacts();

          const i=
            all.findIndex(
              x =>
                String(x.id) ===
                String(
                  b.dataset
                    .contactArchive
                )
            );

          if(i < 0){
            return;
          }

          all[i].archived=
            true;

          all[i].archivedAt=
            Date.now();

          sportSaveContacts(all);

          sportRenderContacts();
        };
      }
    );
}


function sportShowCode(){

  const c=
    sportClub();

  if(!c.clubRef){

    alert(
      "La fiche d’identité du club doit d’abord disposer d’une référence."
    );

    return;
  }

  alert(
    "Code club à présenter au commerçant ou à la mairie :\n\n" +
    JSON.stringify(
      sportClubCode(),
      null,
      2
    )
  );
}


function openSportPublicResults(){

  openModal(
    "Résultats du week-end avec Bo'CitéArt",
    `

      ${sportStyles()}

      <div class="bociteSportRoot">

        ${sportTitle(
          "Résultats du week-end avec"
        )}

        <div class="sportCard">

          <div class="sportText">

            Retrouvez rapidement
            les résultats des clubs
            et associations sportives partenaires.

            Les résultats officiels
            sont identifiés comme tels ;

            les saisies de secours
            restent signalées
            jusqu’à leur vérification.

          </div>

          <div
            id="sportPublicResults"
          >
            ${sportPublicResultsHtml()}
          </div>

        </div>

        <button
          id="sportResultsBack"
          class="sportBtn"
          type="button"
          style="
            width:100%;
            margin-top:14px;
          "
        >
          Retour au Sport
        </button>

      </div>

    `
  );

  sportSetModalHeader(
    "Résultats du week-end avec"
  );

  setTimeout(
    ()=>{

      const b=
        sportEl(
          "sportResultsBack"
        );

      if(b){

        b.onclick=
          openSportPanel;
      }

    },
    0
  );
}


window.openSportPublicResults=
  openSportPublicResults;

/* =========================================================
   FIN BLOC SPORT 8
   ========================================================= */
   /* =========================================================
   BLOC SPORT 9
   OUVERTURE DU MODULE — ACCÈS — EXPORT
   ========================================================= */

function openClubReserve(){

  const c=
    sportClub();

  const role=
    sportSession.role ===
    "president"
      ? "Présidence / responsable légal"
      : "Entraîneur / responsable";

  openModal(
    "Club avec Bo'CitéArt",
    `

      ${sportStyles()}

      <div class="bociteSportRoot">

        ${sportTitle(
          "Espace de la structure sportive avec"
        )}

        <div class="sportCard">

          <div class="sportName">
            ${sportEsc(
              c.name ||
              "Club partenaire"
            )}
          </div>

          <div>
            ${sportEsc(role)}
            —
            ${sportEsc(
              sportSession.name ||
              ""
            )}
          </div>

        </div>


        ${sportTitle(
          "Bocitecoins Sport avec"
        )}

        <div class="walletBox">

          <div class="walletTitle">
            Portefeuille Sport
          </div>

          <div
            id="sportCoinBalance"
            class="walletValue"
          >
            0
          </div>

          <div class="walletSub">

            Les bocitecoins appartiennent
            au club
            ou à l’association sportive,
            jamais à une personne.

            Ils sont crédités
            par les actions sportives validées
            et les victoires
            officiellement vérifiées.

          </div>

          <div
            id="sportWalletStatus"
            class="sportStatus"
          ></div>

          <div
            id="sportSeasonNotice"
            class="sportStatus"
            style="display:none"
          ></div>

          <div class="sportActions">

            <button
              id="walletSportInfo"
              class="walletMini"
              type="button"
            >
              Règle du Cabas
            </button>

            <button
              id="sportShowQr"
              class="walletMini"
              type="button"
            >
              Code du club
            </button>

          </div>

        </div>


        ${sportPresidentHtml()}

        ${sportTrainingHtml()}

        ${sportResultsPrivateHtml()}

        ${sportSolidarityHtml()}

        ${sportBagHtml()}

        <div id="bociteSportFinanceMount"></div>


        <div class="sportActions">

          ${
            sportSession.openedFromPresident
              ? `
                <button
                  id="sportBackPresident"
                  class="sportBtn"
                  type="button"
                >
                  Retour à la présidence
                </button>
              `
              : ""
          }

          <button
            id="sportClubClose"
            class="sportBtn"
            type="button"
          >
            Fermer l’espace
          </button>

        </div>

      </div>

    `
  );

  sportSetModalHeader(
    "Club avec"
  );

  setTimeout(
    ()=>{

      sportRefreshWallet();

      sportRunSeason();

      sportRenderAccessList();

      sportRenderTrainings();

      sportRenderPrivateResults();

      sportRenderContacts();

      sportInitSupportPaymentUi();

      sportRenderPresidentHistory();


      const governanceSave=
        sportEl(
          "sportGovernanceSave"
        );

      if(governanceSave){

        governanceSave.onclick=
          sportSaveGovernanceFromUi;
      }


      const governanceReportSend=
        sportEl(
          "sportGovReportSend"
        );

      if(governanceReportSend){

        governanceReportSend.onclick=
          sportSendGovernanceReport;
      }


      const historyRefresh=
        sportEl(
          "sportPresidentHistoryRefresh"
        );

      if(historyRefresh){

        historyRefresh.onclick=
          sportRenderPresidentHistory;
      }


      const historyPeriod=
        sportEl(
          "sportPresidentHistoryPeriod"
        );

      if(historyPeriod){

        historyPeriod.onchange=
          sportRenderPresidentHistory;
      }


      const td=
        sportEl(
          "sportTrainingDate"
        );

      if(
        td &&
        !td.value
      ){

        td.value=
          new Date()
            .toISOString()
            .slice(0,10);
      }


      const info=
        sportEl(
          "walletSportInfo"
        );

      if(info){

        info.onclick=
          ()=> alert(

            "Bocitecoins Sport — règle du Cabas\n\n" +

            "- 1 Cabas = exactement 30 bocitecoins\n" +

            "- aucun Cabas de 10, 20, 40 ou 50\n" +

            "- chez un commerçant partenaire : achat réel minimum de 10 € avant l’échange\n" +

            "- le commerçant partenaire ou la mairie scanne ensuite le club\n" +

            "- le club ne valide jamais lui-même l’échange\n" +

            "- nourriture / boissons : 30 % maximum\n" +

            "- aucun transfert entre clubs\n" +

            "- les reliquats inférieurs à 30 peuvent être remis à la mairie en fin de saison pour une association validée"
          );
      }


      const qr=
        sportEl(
          "sportShowQr"
        );

      if(qr){

        qr.onclick=
          sportShowCode;
      }


      const idSave=
        sportEl(
          "sportIdentitySave"
        );

      if(idSave){

        idSave.onclick=
          sportSaveIdentityFromUi;
      }


      const sync=
        sportEl(
          "sportSyncResults"
        );

      if(sync){

        sync.onclick=
          sportSyncResults;
      }


      const coach=
        sportEl(
          "sportCoachCreate"
        );

      if(coach){

        coach.onclick=
          sportCreateCoach;
      }


      const tr=
        sportEl(
          "sportTrainingCreate"
        );

      if(tr){

        tr.onclick=
          sportCreateTraining;
      }


      const mr=
        sportEl(
          "sportManualSave"
        );

      if(mr){

        mr.onclick=
          sportManualResult;
      }


      const sol=
        sportEl(
          "sportSolidaritySave"
        );

      if(sol){

        sol.onclick=
          sportSaveSolidarityFromUi;
      }


      const cn=
        sportEl(
          "sportContactName"
        );

      if(cn){

        cn.onchange=
          sportPrefillContact;

        cn.onblur=
          sportPrefillContact;
      }


      const cs=
        sportEl(
          "sportContactSave"
        );

      if(cs){

        cs.onclick=
          sportSaveContact;
      }


      const bp=
        sportEl(
          "sportBackPresident"
        );

      if(bp){

        bp.onclick=()=>{

          sportSession={

            role:
              "president",

            accountId:
              "president",

            name:
              sportAccess()
                .president
                .name,

            team:""
          };

          window.bociteartSportSession=
            sportSession;

          openClubReserve();
        };
      }


      const close=
        sportEl(
          "sportClubClose"
        );

      if(close){

        close.onclick=()=>{

          sportSession={
            role:"",
            accountId:"",
            name:"",
            team:""
          };

          window.bociteartSportSession=
            sportSession;

          openSportPanel();
        };
      }

    },
    0
  );
}


window.openClubReserve=
  openClubReserve;


function openClubAccess(){

  openModal(
    "Accès responsables avec Bo'CitéArt",
    `

      ${sportStyles()}

      <div class="bociteSportRoot">

        ${sportTitle(
          "Accès responsables avec"
        )}

        <div class="sportCard">

          Cet accès est réservé
          aux entraîneurs
          et responsables autorisés
          de la structure sportive.

          <label class="sportLabel">
            Identifiant personnel
          </label>

          <input
            id="sportLoginIdentifier"
            class="sportField"
            autocomplete="username"
            placeholder="Identifiant responsable"
          >

          <label class="sportLabel">
            Code personnel
          </label>

          <input
            id="sportLoginCode"
            class="sportField"
            type="password"
            autocomplete="current-password"
            placeholder="Code d’accès"
          >

          <button
            id="sportLoginBtn"
            class="sportBtn"
            type="button"
            style="
              width:100%;
              margin-top:12px;
            "
          >
            Ouvrir l’espace
          </button>

          <div
            id="sportLoginStatus"
            class="sportStatus"
          ></div>

        </div>

      </div>

    `
  );

  sportSetModalHeader(
    "Accès responsables avec"
  );

  setTimeout(
    ()=>{

      const b=
        sportEl(
          "sportLoginBtn"
        );

      if(!b){
        return;
      }

      b.onclick=
        async ()=>{

          const id=
            String(
              sportEl(
                "sportLoginIdentifier"
              )?.value ||
              ""
            ).trim();

          const code=
            String(
              sportEl(
                "sportLoginCode"
              )?.value ||
              ""
            ).trim();

          const o=
            sportEl(
              "sportLoginStatus"
            );

          if(
            !id ||
            !code
          ){

            if(o){

              o.textContent=
                "Renseignez l’identifiant et le code.";
            }

            return;
          }

/* =====================================================
   ÇA COMMENCE ICI — ACCÈS SPÉCIAL DE TEST
   ===================================================== */

          if(
            SPORT_CONFIG.mode !==
              "production" &&

            sportNorm(id) ===
              "SPORT-TEST" &&

            code ===
              "BCA-SPORT-2026"
          ){

            window
              .bociteartSportTestFullAccess =
              true;


            sportResetFail(
              id
            );


            sportSession={

              role:
                "president",

              accountId:
                "sport-test-full",

              name:
                "Accès spécial de test",

              team:
                "",

              testFullAccess:
                true
            };


            window.bociteartSportSession=
              sportSession;


            openClubReserve();

            return;
          }

/* =====================================================
   ÇA FINIT ICI — ACCÈS SPÉCIAL DE TEST
   ===================================================== */


          if(
            sportLocked(id)
          ){

            if(o){

              o.textContent=
                "Accès temporairement indisponible. Contactez le président de la structure.";
            }

            return;
          }
           
          if(
            sportLocked(id)
          ){

            if(o){

              o.textContent=
                "Accès temporairement indisponible. Contactez le président de la structure.";
            }

            return;
          }

          if(
            SPORT_CONFIG.mode ===
            "production" &&
            SPORT_CONFIG.authEndpoint
          ){

            try{

              const r=
                await fetch(
                  SPORT_CONFIG.authEndpoint,
                  {
                    method:"POST",
                    credentials:"include",
                    headers:{
                      "Content-Type":
                        "application/json"
                    },
                    body:
                      JSON.stringify({
                        scope:
                          "sport_responsible",
                        identifier:
                          id,
                        code:
                          code
                      })
                  }
                );

              if(!r.ok){
                throw 0;
              }

              const j=
                await r.json();

              if(
                !j ||
                j.ok !== true ||
                j.role ===
                "president"
              ){
                throw 0;
              }

              sportResetFail(id);

              sportSession={

                role:
                  "coach",

                accountId:
                  String(
                    j.accountId ||
                    id
                  ),

                name:
                  String(
                    j.name ||
                    "Responsable"
                  ),

                team:
                  String(
                    j.team ||
                    ""
                  )
              };

              window.bociteartSportSession=
                sportSession;

              openClubReserve();

              return;

            }catch(_){

              const locked=
                sportFail(id);

              if(o){

                o.textContent=
                  locked
                    ? "Accès temporairement indisponible. Contactez le président de la structure."
                    : "Accès réservé aux responsables autorisés.";
              }

              return;
            }
          }

          const a=
            sportAccess();

          const x=
            a.coaches
              .find(
                y =>
                  sportNorm(
                    y.identifier
                  ) ===
                  sportNorm(id) &&
                  y.active !== false
              );

          if(
            x &&
            x.codeHash ===
            await sportHash(code)
          ){

            sportResetFail(id);

            sportSession={

              role:
                "coach",

              accountId:
                x.id,

              name:
                x.name ||
                "Responsable",

              team:
                x.team ||
                ""
            };

            window.bociteartSportSession=
              sportSession;

            openClubReserve();

            return;
          }

          const locked=
            sportFail(id);

          if(o){

            o.textContent=
              locked
                ? "Accès temporairement indisponible. Contactez le président de la structure."
                : "Accès réservé aux responsables autorisés.";
          }
        };

    },
    0
  );
}


window.openClubAccess=
  openClubAccess;


/* =========================================================
   PORTE PRIVÉE PRÉSIDENT
   ========================================================= */

window.openSportPresidentPrivate=
  function(){

    if(
      !window.bociteartAdminSession
    ){

      alert(
        "Accès privé requis."
      );

      return;
    }

    const a=
      sportAccess();

    if(
      a.president.active ===
      false
    ){

      alert(
        "Accès temporairement indisponible."
      );

      return;
    }

    const governance=
      sportLoadGovernance();

    sportSession={

      role:
        "president",

      accountId:
        "president",

      name:
        (
          governance.president &&
          governance.president.fullName
        ) ||
        a.president.name ||
        "Président / responsable légal",

      team:""
    };

    window.bociteartSportSession=
      sportSession;

    openClubReserve();
  };


function openSportPanel(){

  if(
    window.bociteartAdminSession &&
    window.bociteartSportPrivateEntry
  ){

    window.bociteartSportPrivateEntry=
      false;

    window.openSportPresidentPrivate();

    return;
  }

  openModal(
    "Sport avec Bo'CitéArt",
    `

      ${sportStyles()}

      <div class="bociteSportRoot">

        ${sportTitle(
          "Sport avec"
        )}

        <div class="sportCard">

          <div class="sportText">

            Le sport relie
            l’effort,
            le respect,
            l’engagement,
            la vie locale
            et la solidarité.

            <br><br>

            ${sportBrandHtml()}
            rend visibles
            les clubs
            et associations sportives,
            leurs résultats,
            les comportements
            qui font grandir une équipe
            et les acteurs de la commune
            qui les soutiennent.

          </div>

        </div>


        ${sportTitle(
          "Résultats du week-end avec"
        )}

        <div class="sportCard">

          <div class="sportText">

            <strong>
              Les résultats sont accessibles
              immédiatement,
              sans dérouler
              toute la présentation.
            </strong>

          </div>

          <button
            id="sportPublicResultsBtn"
            class="sportBtn"
            type="button"
            style="
              width:100%;
              margin-top:12px;
            "
          >
            Voir les résultats du week-end
          </button>

        </div>


        ${sportBenefitsHtml()}


        ${sportTitle(
          "Explorer les alentours avec"
        )}

        <div class="sportCard">

          Retrouvez
          les équipements sportifs,
          parcs,
          transports,
          commerces utiles
          et autres repères
          de la commune.

          <button
            id="openMap"
            class="sportBtn"
            type="button"
            style="
              width:100%;
              margin-top:12px;
            "
          >
            Consulter la carte
          </button>

        </div>


        ${sportTitle(
          "Espace Clubs & associations sportives partenaires avec"
        )}

        <div class="sportCard">

          Les fonctions réservées
          sont accessibles uniquement
          aux entraîneurs
          et responsables autorisés.

          <button
            id="sportOpenClubAccess"
            class="sportBtn"
            type="button"
            style="
              width:100%;
              margin-top:12px;
            "
          >
            Accéder à l’espace responsable
          </button>

        </div>

      </div>

    `
  );

  sportSetModalHeader(
    "Sport avec"
  );

  setTimeout(
    ()=>{

      const r=
        sportEl(
          "sportPublicResultsBtn"
        );

      if(r){

        r.onclick=
          openSportPublicResults;
      }

      const m=
        sportEl(
          "openMap"
        );

      if(m){

        m.onclick=
          openWellbeingMap;
      }

      const a=
        sportEl(
          "sportOpenClubAccess"
        );

      if(a){

        a.onclick=
          openClubAccess;
      }

    },
    0
  );
}


/* =========================================================
   INTERFACE PUBLIQUE DU MODULE
   ========================================================= */

window.BociteSportModule={

  version:
    "2026-09-02-01",

  ready:
    true,

  open:
    ()=>openSportPanel(),

  openPresident:
    ()=>window.openSportPresidentPrivate(),

  getClub:
    ()=>sportClub(),

  getWallet:
    ()=>sportWallet(),

  getConfig:
    ()=>Object.assign(
      {},
      SPORT_CONFIG
    )
};


window.openSportPanel=
  openSportPanel;


/* =========================================================
   FIN DU MODULE SPORT EXTERNE
   ========================================================= */

})();
  
