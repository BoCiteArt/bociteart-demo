/* =========================================================
   BO'CITÉART — REGISTRE CENTRAL RECHERCHE MÉDICALE
   Fichier : js/bociteart-research-associations.js

   RÔLE :
   - associations candidates proposées ou recherchées ;
   - Agent Mairie : premier contrôle ;
   - sélection Mairie de 1 à 4 associations ;
   - Agent Bo'CitéArt : second contrôle indépendant ;
   - validation automatique si les deux contrôles sont OK ;
   - validité annuelle ;
   - enveloppe annuelle Mairie en euros ;
   - répartition automatique entre 1 à 4 associations ;
   - aucune conversion points -> euros ;
   - suivi des origines École / Sport / Commerce / Citoyen ;
   - confirmation de réception ;
   - justificatifs ;
   - messages officiels de remerciement ;
   - fil transversal visible dans les tuiles concernées.

   IMPORTANT PRODUCTION :
   Les contrôles IA, IBAN, paiements et validations sensibles
   doivent être réalisés côté serveur.
   ========================================================= */

(function(){

"use strict";


/* =========================================================
   PROTECTION DOUBLE CHARGEMENT
   ========================================================= */

if(
  window.__bociteResearchAssociationsLoaded
){
  return;
}

window.__bociteResearchAssociationsLoaded=
  true;


/* =========================================================
   CONFIGURATION
   ========================================================= */

const CONFIG=
  Object.assign(
    {

      mode:
        "preproduction",

      communeId:
        "",

      communeName:
        "",

      /*
        Recherche automatique d'associations
        à partir de sources officielles / contrôlées.
      */
      searchEndpoint:
        "",

      /*
        Premier Agent :
        contrôle pour la Mairie.
      */
      mairieReviewEndpoint:
        "",

      /*
        Second Agent :
        contrôle indépendant Bo'CitéArt.
      */
      bociteartReviewEndpoint:
        "",

      /*
        Enregistrement de la sélection officielle.
      */
      selectionEndpoint:
        "",

      /*
        Enregistrement sécurisé
        des coordonnées bancaires.
      */
      bankDetailsEndpoint:
        "",

      /*
        Préparation / transmission
        du versement Mairie.
      */
      paymentEndpoint:
        "",

      /*
        Confirmation bancaire / comptable.
      */
      paymentStatusEndpoint:
        "",

      /*
        Création du lien sécurisé
        envoyé à l'association bénéficiaire.
      */
      acknowledgementEndpoint:
        "",

      /*
        Réception du remerciement
        et des justificatifs.
      */
      thanksEndpoint:
        "",

      /*
        Notifications Mairie / Bo'CitéArt.
      */
      notificationEndpoint:
        ""

    },

    window.BOCITEART_RESEARCH_CONFIG ||
    {}
  );


/* =========================================================
   STOCKAGE PRÉPRODUCTION

   AUCUN IBAN COMPLET N'EST STOCKÉ ICI.
   ========================================================= */

const KEYS={

  state:
    "bociteart_research_state_v1",

  candidates:
    "bociteart_research_candidates_v1",

  participation:
    "bociteart_research_participation_v1",

  envelopes:
    "bociteart_research_envelopes_v1",

  payments:
    "bociteart_research_payments_v1",

  thanks:
    "bociteart_research_thanks_v1",

  reminders:
    "bociteart_research_reminders_v1"

};


/* =========================================================
   OUTILS GÉNÉRAUX
   ========================================================= */

function load(
  key,
  fallback
){

  try{

    const raw=
      localStorage.getItem(
        key
      );

    return raw
      ? JSON.parse(raw)
      : fallback;

  }catch(_){

    return fallback;
  }
}


function save(
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

  }catch(_){

    return false;
  }
}


function clone(
  value
){

  try{

    return JSON.parse(
      JSON.stringify(
        value
      )
    );

  }catch(_){

    return value;
  }
}


function id(
  prefix
){

  return String(
    prefix ||
    "bca"
  ) +
  "-" +
  Date.now() +
  "-" +
  Math.random()
    .toString(36)
    .slice(2,8);
}


function text(
  value
){

  return String(
    value == null
      ? ""
      : value
  ).trim();
}


function amountEUR(
  value
){

  const n=
    Number(
      value
    );

  if(
    !Number.isFinite(n) ||
    n < 0
  ){
    return null;
  }

  return Math.round(
    n * 100
  ) / 100;
}


function isoNow(){

  return new Date()
    .toISOString();
}


function timestamp(){

  return Date.now();
}


/* =========================================================
   NOTIFICATION
   ========================================================= */

async function notify(
  eventName,
  payload={}
){

  const data={

    event:
      String(
        eventName ||
        "research_event"
      ),

    communeId:
      CONFIG.communeId,

    communeName:
      CONFIG.communeName,

    payload:
      payload &&
      typeof payload ===
        "object"
        ? payload
        : {},

    createdAt:
      isoNow()
  };


  if(
    !CONFIG.notificationEndpoint
  ){

    return {

      ok:true,

      pending:true,

      payload:
        data
    };
  }


  try{

    const response=
      await fetch(
        CONFIG.notificationEndpoint,
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
              data
            )
        }
      );


    return {

      ok:
        response.ok,

      sent:
        response.ok
    };

  }catch(_){

    return {

      ok:false,

      pending:true
    };
  }
}


/* =========================================================
   ÉTAT CENTRAL
   ========================================================= */

function defaultState(){

  return {

    communeId:
      CONFIG.communeId,

    communeName:
      CONFIG.communeName,

    /*
      Nombre voulu par la Mairie :
      minimum 1
      maximum 4
    */
    targetActiveCount:
      4,

    selectedCandidateIds:
      [],

    activeAssociationIds:
      [],

    updatedAt:
      timestamp()
  };
}


function getState(){

  const saved=
    load(
      KEYS.state,
      null
    );

  return Object.assign(
    defaultState(),
    saved &&
    typeof saved ===
      "object"
      ? saved
      : {}
  );
}


function saveState(
  state
){

  state=
    Object.assign(
      {},
      state,
      {
        communeId:
          CONFIG.communeId,

        communeName:
          CONFIG.communeName,

        updatedAt:
          timestamp()
      }
    );

  return save(
    KEYS.state,
    state
  );
}


/* =========================================================
   NOMBRE D'ASSOCIATIONS RETENUES
   1 À 4
   ========================================================= */

function setTargetActiveCount(
  count
){

  const n=
    Number(
      count
    );


  if(
    !Number.isInteger(n) ||
    n < 1 ||
    n > 4
  ){

    return {

      ok:false,

      reason:
        "target_count_must_be_between_1_and_4"
    };
  }


  const state=
    getState();


  state.targetActiveCount=
    n;


  saveState(
    state
  );


  return {

    ok:true,

    targetActiveCount:
      n
  };
}


/* =========================================================
   CANDIDATURE ASSOCIATION
   ========================================================= */

function blankCandidate(){

  return {

    id:
      id(
        "research-association"
      ),

    legalName:
      "",

    usualName:
      "",

    address:
      "",

    postalCode:
      "",

    city:
      "",

    region:
      "",

    country:
      "France",

    sirenSiret:
      "",

    rnaNumber:
      "",

    website:
      "",

    email:
      "",

    accountingEmail:
      "",

    /*
      JAMAIS D'IBAN COMPLET ICI.
    */
    bankDetailsRef:
      "",

    ibanMasked:
      "",

    bicMasked:
      "",

    researchFocus:
      "",

    pediatricResearch:
      false,

    rareDiseaseResearch:
      false,

    orphanDiseaseResearch:
      false,

    localOrRegional:
      false,

    structureSize:
      "to_verify",

    /*
      Indique uniquement la disponibilité
      et le résultat des contrôles.

      Aucune décision financière automatique
      n'est déduite d'un simple score.
    */
    documents:{

      latestAccountsYear:
        "",

      annualAccountsAvailable:
        false,

      annualAccountsReference:
        "",

      activityReportAvailable:
        false,

      activityReportReference:
        "",

      resourceUseDocumentAvailable:
        false,

      resourceUseDocumentReference:
        ""
    },

    mairieAgentReview:{

      status:
        "not_started",

      reasons:
        [],

      facts:
        [],

      reviewedAt:
        null
    },

    mairieSelection:{

      selected:
        false,

      selectedAt:
        null
    },

    bociteartAgentReview:{

      status:
        "not_started",

      reasons:
        [],

      facts:
        [],

      reviewedAt:
        null
    },

    annualValidation:{

      status:
        "not_active",

      validationYear:
        null,

      validatedAt:
        null,

      validUntil:
        null,

      renewalEligible:
        false,

      renewalBlockReason:
        ""
    },

    /*
      Suivi de la diversification
      dans le réseau Bo'CitéArt.
    */
    networkDistribution:{

      supportedByCommuneCount:
        0,

      supportedByCommuneIds:
        []
    },

    createdAt:
      timestamp(),

    updatedAt:
      timestamp()
  };
}


function candidates(){

  const rows=
    load(
      KEYS.candidates,
      []
    );

  return Array.isArray(
    rows
  )
    ? rows
    : [];
}


function saveCandidates(
  rows
){

  return save(
    KEYS.candidates,
    Array.isArray(rows)
      ? rows.slice(-500)
      : []
  );
}


/* =========================================================
   AJOUTER UNE ASSOCIATION PROPOSÉE
   ========================================================= */

function proposeAssociation(
  input={}
){

  const legalName=
    text(
      input.legalName ||
      input.name
    );


  if(!legalName){

    return {

      ok:false,

      reason:
        "association_name_required"
    };
  }


  const all=
    candidates();


  const existing=
    all.find(
      item =>
        (
          input.sirenSiret &&
          text(
            item.sirenSiret
          ) ===
          text(
            input.sirenSiret
          )
        )
        ||
        (
          input.rnaNumber &&
          text(
            item.rnaNumber
          ) ===
          text(
            input.rnaNumber
          )
        )
    );


  if(existing){

    return {

      ok:true,

      duplicate:true,

      candidate:
        clone(
          existing
        )
    };
  }


  const row=
    Object.assign(
      blankCandidate(),
      {

        legalName:
          legalName,

        usualName:
          text(
            input.usualName
          ),

        address:
          text(
            input.address
          ),

        postalCode:
          text(
            input.postalCode
          ),

        city:
          text(
            input.city
          ),

        region:
          text(
            input.region
          ),

        sirenSiret:
          text(
            input.sirenSiret
          ),

        rnaNumber:
          text(
            input.rnaNumber
          ),

        website:
          text(
            input.website
          ),

        email:
          text(
            input.email
          ),

        accountingEmail:
          text(
            input.accountingEmail
          ),

        researchFocus:
          text(
            input.researchFocus
          ),

        pediatricResearch:
          input.pediatricResearch ===
            true,

        rareDiseaseResearch:
          input.rareDiseaseResearch ===
            true,

        orphanDiseaseResearch:
          input.orphanDiseaseResearch ===
            true,

        localOrRegional:
          input.localOrRegional ===
            true,

        structureSize:
          text(
            input.structureSize ||
            "to_verify"
          )
      }
    );


  all.push(
    row
  );


  saveCandidates(
    all
  );


  notify(
    "research_association_proposed",
    {
      candidateId:
        row.id,

      legalName:
        row.legalName
    }
  );


  return {

    ok:true,

    candidate:
      clone(
        row
      )
  };
}


/* =========================================================
   RECHERCHE AUTOMATIQUE

   L'AGENT DOIT PRIVILÉGIER :
   1. pédiatrie / maladies infantiles ;
   2. maladies rares / orphelines ;
   3. structures locales / régionales ;
   4. petites structures sérieuses et transparentes ;
   5. diversification entre communes ;
   6. élargissement seulement si nécessaire.

   AUCUNE ASSOCIATION N'EST INVENTÉE LOCALMENT.
   ========================================================= */

async function searchAssociations(
  criteria={}
){

  if(
    !CONFIG.searchEndpoint
  ){

    return {

      ok:false,

      pending:true,

      reason:
        "search_endpoint_not_configured",

      results:[]
    };
  }


  try{

    const response=
      await fetch(
        CONFIG.searchEndpoint,
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

              communeId:
                CONFIG.communeId,

              communeName:
                CONFIG.communeName,

              priorities:{

                pediatricResearch:
                  true,

                rareOrOrphanDiseases:
                  true,

                localOrRegionalFirst:
                  true,

                smallerTransparentStructuresPreferred:
                  true,

                diversifyAcrossBociteartNetwork:
                  true
              },

              criteria:
                criteria
            })
        }
      );


    if(!response.ok){
      throw 0;
    }


    const result=
      await response.json();


    return {

      ok:true,

      results:
        Array.isArray(
          result &&
          result.results
        )
          ? result.results
          : []
    };

  }catch(_){

    return {

      ok:false,

      reason:
        "search_unavailable",

      results:[]
    };
  }
}


/* =========================================================
   TROUVER UNE CANDIDATURE
   ========================================================= */

function findCandidate(
  candidateId
){

  return candidates()
    .find(
      item =>
        String(
          item.id
        ) ===
        String(
          candidateId
        )
    ) ||
    null;
}


/* =========================================================
   MISE À JOUR D'UNE CANDIDATURE
   ========================================================= */

function updateCandidate(
  candidateId,
  patch
){

  const all=
    candidates();


  const index=
    all.findIndex(
      item =>
        String(
          item.id
        ) ===
        String(
          candidateId
        )
    );


  if(index < 0){

    return {

      ok:false,

      reason:
        "candidate_not_found"
    };
  }


  all[index]=
    Object.assign(
      {},
      all[index],
      patch &&
      typeof patch ===
        "object"
        ? patch
        : {},
      {
        id:
          all[index].id,

        updatedAt:
          timestamp()
      }
    );


  saveCandidates(
    all
  );


  return {

    ok:true,

    candidate:
      clone(
        all[index]
      )
  };
}


/* =========================================================
   PREMIER AGENT — CONTRÔLE MAIRIE
   ========================================================= */

async function runMairieAgentReview(
  candidateId
){

  const candidate=
    findCandidate(
      candidateId
    );


  if(!candidate){

    return {

      ok:false,

      reason:
        "candidate_not_found"
    };
  }


  updateCandidate(
    candidateId,
    {
      mairieAgentReview:{
        status:
          "pending",

        reasons:
          [],

        facts:
          [],

        reviewedAt:
          null
      }
    }
  );


  if(
    !CONFIG.mairieReviewEndpoint
  ){

    return {

      ok:true,

      pending:true,

      reason:
        "mairie_agent_endpoint_not_configured"
    };
  }


  try{

    const response=
      await fetch(
        CONFIG.mairieReviewEndpoint,
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

              candidate:
                candidate,

              priorities:{

                pediatricResearch:
                  true,

                rareOrOrphanDiseases:
                  true,

                transparentUseOfFunds:
                  true,

                proportionateAdministrationCosts:
                  true,

                localOrRegionalFirst:
                  true,

                smallerTransparentStructuresPreferred:
                  true,

                networkDiversification:
                  true
              }
            })
        }
      );


    if(!response.ok){
      throw 0;
    }


    const result=
      await response.json();


    return applyMairieAgentResult(
      candidateId,
      result
    );

  }catch(_){

    return {

      ok:false,

      reason:
        "mairie_agent_unavailable"
    };
  }
}


/* =========================================================
   APPLIQUER LE RÉSULTAT AGENT MAIRIE
   ========================================================= */

function applyMairieAgentResult(
  candidateId,
  result={}
){

  const allowed=[
    "favorable",
    "needs_information",
    "unfavorable"
  ];


  const status=
    allowed.includes(
      String(
        result.status ||
        ""
      )
    )
      ? String(
          result.status
        )
      : "needs_information";


  const patch={

    mairieAgentReview:{

      status:
        status,

      reasons:
        Array.isArray(
          result.reasons
        )
          ? result.reasons.map(
              text
            )
          : [],

      facts:
        Array.isArray(
          result.facts
        )
          ? result.facts
          : [],

      reviewedAt:
        timestamp()
    }
  };


  if(
    result.documents &&
    typeof result.documents ===
      "object"
  ){

    patch.documents=
      Object.assign(
        {},
        findCandidate(
          candidateId
        )?.documents ||
        {},
        result.documents
      );
  }


  if(
    result.networkDistribution &&
    typeof result.networkDistribution ===
      "object"
  ){

    patch.networkDistribution=
      result.networkDistribution;
  }


  const saved=
    updateCandidate(
      candidateId,
      patch
    );


  notify(
    "research_mairie_agent_review_completed",
    {

      candidateId:
        candidateId,

      status:
        status
    }
  );


  return saved;
}


/* =========================================================
   SÉLECTION MAIRIE

   - la Mairie choisit 1, 2, 3 ou 4 ;
   - chaque association doit avoir reçu
     un avis favorable du premier Agent ;
   - le second contrôle Bo'CitéArt démarre
     automatiquement.
   ========================================================= */

async function mairieSelectAssociations(
  candidateIds
){

  const ids=
    Array.from(
      new Set(
        (
          Array.isArray(
            candidateIds
          )
            ? candidateIds
            : []
        )
        .map(
          String
        )
      )
    );


  const state=
    getState();


  if(
    ids.length !==
      Number(
        state.targetActiveCount
      )
  ){

    return {

      ok:false,

      reason:
        "selection_count_does_not_match_target",

      target:
        state.targetActiveCount,

      selected:
        ids.length
    };
  }


  if(
    ids.length < 1 ||
    ids.length > 4
  ){

    return {

      ok:false,

      reason:
        "selection_must_contain_1_to_4_associations"
    };
  }


  const all=
    candidates();


  for(
    const candidateId
    of ids
  ){

    const candidate=
      all.find(
        item =>
          String(
            item.id
          ) ===
          String(
            candidateId
          )
      );


    if(!candidate){

      return {

        ok:false,

        reason:
          "candidate_not_found",

        candidateId:
          candidateId
      };
    }


    if(
      candidate.mairieAgentReview
        .status !==
        "favorable"
    ){

      return {

        ok:false,

        reason:
          "mairie_agent_review_not_favorable",

        candidateId:
          candidateId
      };
    }
  }


  const now=
    timestamp();


  const updated=
    all.map(
      item =>{

        const selected=
          ids.includes(
            String(
              item.id
            )
          );


        return Object.assign(
          {},
          item,
          {
            mairieSelection:{

              selected:
                selected,

              selectedAt:
                selected
                  ? now
                  : null
            },

            updatedAt:
              now
          }
        );
      }
    );


  saveCandidates(
    updated
  );


  state.selectedCandidateIds=
    ids.slice();


  state.activeAssociationIds=
    [];


  saveState(
    state
  );


  notify(
    "research_mairie_selection_confirmed",
    {
      candidateIds:
        ids.slice()
    }
  );


  /*
    SECOND CONTRÔLE AUTOMATIQUE
  */

  const reviews=[];


  for(
    const candidateId
    of ids
  ){

    reviews.push(
      await runBociteartAgentReview(
        candidateId
      )
    );
  }


  return {

    ok:true,

    selectedCandidateIds:
      ids.slice(),

    secondReviews:
      reviews
  };
}


/* =========================================================
   SECOND AGENT — CONTRÔLE Bo'CitéArt

   Si favorable :
   activation automatique.
   Aucun clic manuel de Jean-Michel.
   ========================================================= */

async function runBociteartAgentReview(
  candidateId
){

  const candidate=
    findCandidate(
      candidateId
    );


  if(!candidate){

    return {

      ok:false,

      reason:
        "candidate_not_found"
    };
  }


  if(
    candidate.mairieSelection
      .selected !==
      true
  ){

    return {

      ok:false,

      reason:
        "candidate_not_selected_by_mairie"
    };
  }


  updateCandidate(
    candidateId,
    {
      bociteartAgentReview:{

        status:
          "pending",

        reasons:
          [],

        facts:
          [],

        reviewedAt:
          null
      }
    }
  );


  if(
    !CONFIG.bociteartReviewEndpoint
  ){

    return {

      ok:true,

      pending:true,

      reason:
        "bociteart_agent_endpoint_not_configured"
    };
  }


  try{

    const response=
      await fetch(
        CONFIG.bociteartReviewEndpoint,
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

              candidate:
                candidate,

              communeId:
                CONFIG.communeId,

              criteria:{

                researchUseVerified:
                  true,

                pediatricOrRareDiseasePriority:
                  true,

                financialTransparency:
                  true,

                governanceConsistency:
                  true,

                proportionateOperatingCosts:
                  true,

                networkDiversification:
                  true,

                avoidSystematicConcentration:
                  true
              }
            })
        }
      );


    if(!response.ok){
      throw 0;
    }


    const result=
      await response.json();


    return applyBociteartAgentResult(
      candidateId,
      result
    );

  }catch(_){

    return {

      ok:false,

      reason:
        "bociteart_agent_unavailable"
    };
  }
}


/* =========================================================
   APPLIQUER LE SECOND CONTRÔLE

   FAVORABLE =
   VALIDATION AUTOMATIQUE POUR 1 AN.
   ========================================================= */

function applyBociteartAgentResult(
  candidateId,
  result={}
){

  const allowed=[
    "favorable",
    "needs_information",
    "unfavorable"
  ];


  const status=
    allowed.includes(
      String(
        result.status ||
        ""
      )
    )
      ? String(
          result.status
        )
      : "needs_information";


  updateCandidate(
    candidateId,
    {

      bociteartAgentReview:{

        status:
          status,

        reasons:
          Array.isArray(
            result.reasons
          )
            ? result.reasons.map(
                text
              )
            : [],

        facts:
          Array.isArray(
            result.facts
          )
            ? result.facts
            : [],

        reviewedAt:
          timestamp()
      }
    }
  );


  if(
    status ===
      "favorable"
  ){

    return activateAssociationForOneYear(
      candidateId
    );
  }


  notify(
    "research_bociteart_review_requires_action",
    {

      candidateId:
        candidateId,

      status:
        status,

      reasons:
        Array.isArray(
          result.reasons
        )
          ? result.reasons
          : []
    }
  );


  return {

    ok:true,

    activated:false,

    status:
      status
  };
}


/* =========================================================
   ACTIVATION 1 AN
   ========================================================= */

function activateAssociationForOneYear(
  candidateId
){

  const candidate=
    findCandidate(
      candidateId
    );


  if(!candidate){

    return {

      ok:false,

      reason:
        "candidate_not_found"
    };
  }


  if(
    candidate.mairieAgentReview
      .status !==
      "favorable" ||
    candidate.bociteartAgentReview
      .status !==
      "favorable" ||
    candidate.mairieSelection
      .selected !==
      true
  ){

    return {

      ok:false,

      reason:
        "dual_validation_required"
    };
  }


  const now=
    new Date();


  const validUntil=
    new Date(
      now
    );


  validUntil.setFullYear(
    validUntil.getFullYear() +
    1
  );


  updateCandidate(
    candidateId,
    {

      annualValidation:{

        status:
          "active",

        validationYear:
          now.getFullYear(),

        validatedAt:
          now.getTime(),

        validUntil:
          validUntil.getTime(),

        renewalEligible:
          true,

        renewalBlockReason:
          ""
      }
    }
  );


  const state=
    getState();


  if(
    !state.activeAssociationIds
      .includes(
        String(
          candidateId
        )
      )
  ){

    state.activeAssociationIds.push(
      String(
        candidateId
      )
    );
  }


  /*
    GARDE-FOU ABSOLU :
    MAXIMUM 4 ASSOCIATIONS ACTIVES.
  */

  state.activeAssociationIds=
    state.activeAssociationIds
      .slice(
        0,
        4
      );


  saveState(
    state
  );


  notify(
    "research_association_activated",
    {

      candidateId:
        candidateId,

      validUntil:
        validUntil.getTime()
    }
  );


  return {

    ok:true,

    activated:true,

    candidateId:
      candidateId,

    validUntil:
      validUntil.getTime()
  };
}


/* =========================================================
   ASSOCIATION ENCORE VALIDE ?
   ========================================================= */

function associationIsCurrentlyActive(
  candidate
){

  if(!candidate){
    return false;
  }


  return !!(

    candidate.annualValidation &&
    candidate.annualValidation
      .status ===
      "active" &&

    Number(
      candidate.annualValidation
        .validUntil ||
      0
    ) >
    Date.now() &&

    candidate.mairieAgentReview
      .status ===
      "favorable" &&

    candidate.bociteartAgentReview
      .status ===
      "favorable" &&

    candidate.mairieSelection
      .selected ===
      true
  );
}


/* =========================================================
   LISTE ACTIVE
   ========================================================= */

function activeAssociations(){

  const state=
    getState();


  const all=
    candidates();


  return (
    Array.isArray(
      state.activeAssociationIds
    )
      ? state.activeAssociationIds
      : []
  )
    .map(
      candidateId =>
        all.find(
          item =>
            String(
              item.id
            ) ===
            String(
              candidateId
            )
        )
    )
    .filter(
      associationIsCurrentlyActive
    );
}


/* =========================================================
   COORDONNÉES BANCAIRES

   JAMAIS D'IBAN COMPLET DANS LOCALSTORAGE.
   ========================================================= */

async function registerSecureBankDetails(
  candidateId,
  bankData={}
){

  const candidate=
    findCandidate(
      candidateId
    );


  if(!candidate){

    return {

      ok:false,

      reason:
        "candidate_not_found"
    };
  }


  if(
    !CONFIG.bankDetailsEndpoint
  ){

    return {

      ok:false,

      reason:
        "secure_bank_endpoint_required"
    };
  }


  try{

    const response=
      await fetch(
        CONFIG.bankDetailsEndpoint,
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

              candidateId:
                candidateId,

              iban:
                text(
                  bankData.iban
                ),

              bic:
                text(
                  bankData.bic
                )
            })
        }
      );


    if(!response.ok){
      throw 0;
    }


    const result=
      await response.json();


    if(
      !result ||
      !result.bankDetailsRef
    ){

      throw 0;
    }


    return updateCandidate(
      candidateId,
      {

        bankDetailsRef:
          String(
            result.bankDetailsRef
          ),

        ibanMasked:
          text(
            result.ibanMasked
          ),

        bicMasked:
          text(
            result.bicMasked
          )
      }
    );

  }catch(_){

    return {

      ok:false,

      reason:
        "bank_details_registration_failed"
    };
  }
}


/* =========================================================
   PARTICIPATION SOLIDAIRE

   IMPORTANT :
   AUCUNE VALEUR EURO.
   AUCUNE CONVERSION.

   Permet seulement de distinguer
   l'origine de la mobilisation :
   école, sport, commerce, citoyen...
   ========================================================= */

function participationRows(){

  const rows=
    load(
      KEYS.participation,
      []
    );

  return Array.isArray(rows)
    ? rows
    : [];
}


function recordParticipation(
  input={}
){

  const originType=
    text(
      input.originType
    );


  const allowedOrigins=[
    "school",
    "sport",
    "merchant",
    "company",
    "citizen",
    "association",
    "other"
  ];


  if(
    !allowedOrigins.includes(
      originType
    )
  ){

    return {

      ok:false,

      reason:
        "invalid_origin_type"
    };
  }


  const points=
    Math.max(
      0,
      Number(
        input.pointsCancelled ||
        0
      )
    );


  const row={

    id:
      id(
        "participation"
      ),

    communeId:
      CONFIG.communeId,

    communeName:
      CONFIG.communeName,

    year:
      Number(
        input.year ||
        new Date()
          .getFullYear()
      ),

    originType:
      originType,

    originId:
      text(
        input.originId
      ),

    originName:
      text(
        input.originName
      ),

    /*
      Nombre de points éventuellement annulés.
      AUCUNE valeur monétaire.
    */
    pointsCancelled:
      points,

    financialConversion:
      false,

    cashValue:
      null,

    currency:
      null,

    createdAt:
      timestamp()
  };


  const rows=
    participationRows();


  rows.push(
    row
  );


  save(
    KEYS.participation,
    rows.slice(-5000)
  );


  return {

    ok:true,

    participation:
      clone(
        row
      )
  };
}


/* =========================================================
   SYNTHÈSE DES PARTICIPATIONS
   ========================================================= */

function participationSummary(
  year
){

  const targetYear=
    Number(
      year ||
      new Date()
        .getFullYear()
    );


  const rows=
    participationRows()
      .filter(
        item =>
          Number(
            item.year
          ) ===
          targetYear
      );


  const summary={};


  rows.forEach(
    item =>{

      const key=
        String(
          item.originType ||
          "other"
        );


      if(!summary[key]){

        summary[key]={
          records:
            0,

          pointsCancelled:
            0,

          participants:
            []
        };
      }


      summary[key].records++;


      summary[key]
        .pointsCancelled +=
          Number(
            item.pointsCancelled ||
            0
          );


      if(
        item.originName &&
        !summary[key]
          .participants
          .includes(
            item.originName
          )
      ){

        summary[key]
          .participants
          .push(
            item.originName
          );
      }
    }
  );


  return summary;
}


/* =========================================================
   ENVELOPPES MAIRIE
   ========================================================= */

function envelopes(){

  const rows=
    load(
      KEYS.envelopes,
      []
    );

  return Array.isArray(rows)
    ? rows
    : [];
}


/* =========================================================
   RÉPARTITION EXACTE EN CENTIMES

   Exemple :
   20 000 € / 3

   6 666,67
   6 666,67
   6 666,66
   ========================================================= */

function equalDistribution(
  totalEUR,
  associationIds
){

  const amount=
    amountEUR(
      totalEUR
    );


  const ids=
    Array.isArray(
      associationIds
    )
      ? associationIds.slice()
      : [];


  if(
    amount == null ||
    amount <= 0 ||
    ids.length < 1 ||
    ids.length > 4
  ){

    return null;
  }


  const totalCents=
    Math.round(
      amount * 100
    );


  const base=
    Math.floor(
      totalCents /
      ids.length
    );


  let remainder=
    totalCents -
    (
      base *
      ids.length
    );


  return ids.map(
    associationId =>{

      const cents=
        base +
        (
          remainder > 0
            ? 1
            : 0
        );


      if(
        remainder > 0
      ){
        remainder--;
      }


      return {

        associationId:
          associationId,

        amountEUR:
          cents /
          100
      };
    }
  );
}


/* =========================================================
   CRÉER L'ENVELOPPE ANNUELLE
   ========================================================= */

function createAnnualEnvelope(
  year,
  totalEUR
){

  const active=
    activeAssociations();


  if(
    active.length < 1 ||
    active.length > 4
  ){

    return {

      ok:false,

      reason:
        "active_associations_required"
    };
  }


  const distribution=
    equalDistribution(
      totalEUR,
      active.map(
        item => item.id
      )
    );


  if(!distribution){

    return {

      ok:false,

      reason:
        "invalid_amount"
    };
  }


  const row={

    id:
      id(
        "research-envelope"
      ),

    communeId:
      CONFIG.communeId,

    communeName:
      CONFIG.communeName,

    year:
      Number(
        year
      ),

    totalEUR:
      amountEUR(
        totalEUR
      ),

    /*
      AUCUN LIEN MATHÉMATIQUE
      AVEC LE NOMBRE DE POINTS.
    */
    pointsConversion:
      false,

    pointCashValue:
      null,

    activeAssociationCount:
      active.length,

    distribution:
      distribution.map(
        line =>{

          const association=
            active.find(
              item =>
                String(
                  item.id
                ) ===
                String(
                  line.associationId
                )
            );


          return {

            associationId:
              line.associationId,

            associationName:
              association
                ? association.legalName
                : "",

            amountEUR:
              line.amountEUR
          };
        }
      ),

    status:
      "draft",

    confirmedAt:
      null,

    transmittedAt:
      null,

    paidAt:
      null,

    createdAt:
      timestamp()
  };


  const rows=
    envelopes();


  rows.push(
    row
  );


  save(
    KEYS.envelopes,
    rows.slice(-100)
  );


  return {

    ok:true,

    envelope:
      clone(
        row
      )
  };
}


/* =========================================================
   CONFIRMER LA RÉPARTITION

   LA MAIRIE VALIDE LE TOTAL
   ET LA RÉPARTITION AFFICHÉE.
   ========================================================= */

async function confirmAnnualEnvelope(
  envelopeId
){

  const rows=
    envelopes();


  const index=
    rows.findIndex(
      item =>
        String(
          item.id
        ) ===
        String(
          envelopeId
        )
    );


  if(index < 0){

    return {

      ok:false,

      reason:
        "envelope_not_found"
    };
  }


  const envelope=
    rows[index];


  envelope.status=
    "confirmed";


  envelope.confirmedAt=
    timestamp();


  rows[index]=
    envelope;


  save(
    KEYS.envelopes,
    rows
  );


  if(
    !CONFIG.paymentEndpoint
  ){

    envelope.status=
      "ready_for_payment";


    rows[index]=
      envelope;


    save(
      KEYS.envelopes,
      rows
    );


    return {

      ok:true,

      pending:true,

      reason:
        "payment_endpoint_not_configured",

      envelope:
        clone(
          envelope
        )
    };
  }


  try{

    const response=
      await fetch(
        CONFIG.paymentEndpoint,
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

              action:
                "prepare_research_payments",

              envelope:
                envelope
            })
        }
      );


    if(!response.ok){
      throw 0;
    }


    const result=
      await response.json();


    envelope.status=
      "transmitted";


    envelope.transmittedAt=
      timestamp();


    if(
      result &&
      result.paymentBatchRef
    ){

      envelope.paymentBatchRef=
        String(
          result.paymentBatchRef
        );
    }


    rows[index]=
      envelope;


    save(
      KEYS.envelopes,
      rows
    );


    return {

      ok:true,

      envelope:
        clone(
          envelope
        )
    };

  }catch(_){

    envelope.status=
      "payment_transmission_failed";


    rows[index]=
      envelope;


    save(
      KEYS.envelopes,
      rows
    );


    return {

      ok:false,

      reason:
        "payment_transmission_failed"
    };
  }
}


/* =========================================================
   CONFIRMATION DE PAIEMENT

   CETTE FONCTION DEVRA ÊTRE ALIMENTÉE
   PAR LE SERVEUR / PSP / CIRCUIT COMPTABLE.
   ========================================================= */

function markPaymentConfirmed(
  input={}
){

  const amount=
    amountEUR(
      input.amountEUR
    );


  if(
    !input.associationId ||
    amount == null ||
    amount <= 0
  ){

    return {

      ok:false,

      reason:
        "invalid_payment"
    };
  }


  const association=
    findCandidate(
      input.associationId
    );


  if(
    !association ||
    !associationIsCurrentlyActive(
      association
    )
  ){

    return {

      ok:false,

      reason:
        "association_not_active"
    };
  }


  const row={

    id:
      id(
        "research-payment"
      ),

    envelopeId:
      text(
        input.envelopeId
      ),

    paymentReference:
      text(
        input.paymentReference
      ),

    associationId:
      association.id,

    associationName:
      association.legalName,

    amountEUR:
      amount,

    currency:
      "EUR",

    payerType:
      text(
        input.payerType ||
        "mairie"
      ),

    payerName:
      text(
        input.payerName ||
        CONFIG.communeName
      ),

    communeId:
      CONFIG.communeId,

    communeName:
      CONFIG.communeName,

    origins:
      Array.isArray(
        input.origins
      )
        ? input.origins
        : [],

    status:
      "paid",

    paidAt:
      Number(
        input.paidAt ||
        timestamp()
      ),

    acknowledgementStatus:
      "waiting_association_confirmation",

    thanksStatus:
      "waiting",

    createdAt:
      timestamp()
  };


  const rows=
    load(
      KEYS.payments,
      []
    );


  rows.push(
    row
  );


  save(
    KEYS.payments,
    rows.slice(-1000)
  );


  notify(
    "research_payment_confirmed",
    {

      paymentId:
        row.id,

      associationId:
        row.associationId,

      amountEUR:
        row.amountEUR
    }
  );


  return {

    ok:true,

    payment:
      clone(
        row
      )
  };
}


/* =========================================================
   DEMANDER À L'ASSOCIATION
   DE CONFIRMER LA RÉCEPTION

   LE SERVEUR DOIT CRÉER
   LE LIEN SÉCURISÉ.
   ========================================================= */

async function requestAssociationAcknowledgement(
  paymentId
){

  const payments=
    load(
      KEYS.payments,
      []
    );


  const payment=
    payments.find(
      item =>
        String(
          item.id
        ) ===
        String(
          paymentId
        )
    );


  if(!payment){

    return {

      ok:false,

      reason:
        "payment_not_found"
    };
  }


  if(
    !CONFIG.acknowledgementEndpoint
  ){

    return {

      ok:true,

      pending:true,

      reason:
        "acknowledgement_endpoint_not_configured"
    };
  }


  try{

    const response=
      await fetch(
        CONFIG.acknowledgementEndpoint,
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

              action:
                "create_acknowledgement_link",

              payment:
                payment
            })
        }
      );


    if(!response.ok){
      throw 0;
    }


    const result=
      await response.json();


    return {

      ok:true,

      sent:
        true,

      deliveryMasked:
        text(
          result &&
          result.deliveryMasked
        )
    };

  }catch(_){

    return {

      ok:false,

      reason:
        "acknowledgement_request_failed"
    };
  }
}


/* =========================================================
   MESSAGE DE REMERCIEMENT REÇU

   EN PRODUCTION :
   CETTE ACTION DOIT ÊTRE AUTHENTIFIÉE
   PAR LE LIEN SÉCURISÉ DU SERVEUR.
   ========================================================= */

function registerAssociationThanks(
  input={}
){

  const message=
    text(
      input.message
    );


  if(
    message.length < 3
  ){

    return {

      ok:false,

      reason:
        "thanks_message_required"
    };
  }


  const amount=
    amountEUR(
      input.amountEUR
    );


  const row={

    id:
      id(
        "official-thanks"
      ),

    paymentId:
      text(
        input.paymentId
      ),

    associationId:
      text(
        input.associationId
      ),

    associationName:
      text(
        input.associationName
      ),

    communeId:
      CONFIG.communeId,

    communeName:
      CONFIG.communeName,

    amountEUR:
      amount,

    showAmount:
      input.showAmount !==
        false,

    payerType:
      text(
        input.payerType
      ),

    payerName:
      text(
        input.payerName
      ),

    message:
      message.slice(
        0,
        1200
      ),

    emoji:
      "✨",

    origins:
      Array.isArray(
        input.origins
      )
        ? input.origins
        : [],

    /*
      Les tuiles concernées
      sont déterminées par les origines.
    */
    channels:
      Array.from(
        new Set(
          (
            Array.isArray(
              input.channels
            )
              ? input.channels
              : [
                  "mairie",
                  "citizen"
                ]
          )
          .map(
            String
          )
        )
      ),

    receiptConfirmed:
      input.receiptConfirmed ===
        true,

    supportingDocumentReceived:
      input.supportingDocumentReceived ===
        true,

    publicationProofReceived:
      input.publicationProofReceived ===
        true,

    status:
      "published",

    createdAt:
      timestamp()
  };


  const rows=
    load(
      KEYS.thanks,
      []
    );


  rows.push(
    row
  );


  save(
    KEYS.thanks,
    rows.slice(-2000)
  );


  notify(
    "research_official_thanks_published",
    {

      thanksId:
        row.id,

      associationName:
        row.associationName,

      channels:
        row.channels
    }
  );


  return {

    ok:true,

    thanks:
      clone(
        row
      )
  };
}


/* =========================================================
   FIL OFFICIEL DE REMERCIEMENTS
   ========================================================= */

function officialThanksFeed(
  channel
){

  const rows=
    load(
      KEYS.thanks,
      []
    );


  return (
    Array.isArray(rows)
      ? rows
      : []
  )
    .filter(
      item =>
        item &&
        item.status ===
          "published"
    )
    .filter(
      item =>
        !channel ||
        (
          Array.isArray(
            item.channels
          ) &&
          item.channels.includes(
            String(
              channel
            )
          )
        )
    )
    .slice()
    .sort(
      (a,b)=>
        Number(
          b.createdAt ||
          0
        ) -
        Number(
          a.createdAt ||
          0
        )
    );
}


/* =========================================================
   FIN D'ANNÉE — RAPPELS MAIRIE

   1er décembre
   J-15
   J-7
   Après clôture :
   dossier restant à régulariser.

   AUCUNE DONNÉE N'EST EFFACÉE.
   ========================================================= */

async function annualMaintenance(
  dateInput
){

  const now=
    dateInput
      ? new Date(
          dateInput
        )
      : new Date();


  if(
    Number.isNaN(
      now.getTime()
    )
  ){

    return {

      ok:false,

      reason:
        "invalid_date"
    };
  }


  const year=
    now.getFullYear();


  const deadline=
    new Date(
      year,
      11,
      31,
      23,
      59,
      59
    );


  const day=
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );


  const deadlineDay=
    new Date(
      deadline.getFullYear(),
      deadline.getMonth(),
      deadline.getDate()
    );


  const daysRemaining=
    Math.ceil(
      (
        deadlineDay -
        day
      ) /
      86400000
    );


  const yearEnvelopes=
    envelopes()
      .filter(
        item =>
          Number(
            item.year
          ) ===
          year
      );


  const paid=
    yearEnvelopes.some(
      item =>
        item.status ===
          "paid"
    );


  if(paid){

    return {

      ok:true,

      nothingToDo:true
    };
  }


  let reminderCode="";


  if(
    now.getMonth() === 11 &&
    now.getDate() === 1
  ){

    reminderCode=
      "december_start";
  }
  else if(
    daysRemaining === 15
  ){

    reminderCode=
      "deadline_minus_15";
  }
  else if(
    daysRemaining === 7
  ){

    reminderCode=
      "deadline_minus_7";
  }
  else if(
    now >
    deadline
  ){

    reminderCode=
      "previous_year_pending";
  }


  if(!reminderCode){

    return {

      ok:true,

      nothingToDo:true
    };
  }


  const reminderId=
    CONFIG.communeId +
    "|" +
    year +
    "|" +
    reminderCode;


  const sent=
    load(
      KEYS.reminders,
      {}
    );


  if(
    sent[
      reminderId
    ]
  ){

    return {

      ok:true,

      duplicate:true
    };
  }


  sent[
    reminderId
  ]={
    sentAt:
      timestamp()
  };


  save(
    KEYS.reminders,
    sent
  );


  await notify(
    "research_annual_payment_reminder",
    {

      year:
        year,

      reminderCode:
        reminderCode,

      daysRemaining:
        daysRemaining
    }
  );


  return {

    ok:true,

    reminderSent:
      reminderCode
  };
}


/* =========================================================
   CONTRÔLE DES VALIDITÉS ANNUELLES

   UNE ASSOCIATION EXPIRÉE
   NE RESTE PAS ACTIVE.
   ========================================================= */

function expireOutdatedAssociations(){

  const all=
    candidates();


  const now=
    Date.now();


  let changed=
    false;


  const updated=
    all.map(
      item =>{

        if(
          item &&
          item.annualValidation &&
          item.annualValidation
            .status ===
            "active" &&
          Number(
            item.annualValidation
              .validUntil ||
            0
          ) <=
          now
        ){

          changed=
            true;


          return Object.assign(
            {},
            item,
            {

              annualValidation:
                Object.assign(
                  {},
                  item.annualValidation,
                  {

                    status:
                      "expired",

                    renewalEligible:
                      false,

                    renewalBlockReason:
                      "Contrôle annuel à renouveler"
                  }
                ),

              updatedAt:
                timestamp()
            }
          );
        }


        return item;
      }
    );


  if(changed){

    saveCandidates(
      updated
    );


    const active=
      updated
        .filter(
          associationIsCurrentlyActive
        )
        .map(
          item =>
            String(
              item.id
            )
        );


    const state=
      getState();


    state.activeAssociationIds=
      active;


    saveState(
      state
    );
  }


  return {

    ok:true,

    changed:
      changed
  };
}


/* =========================================================
   API PUBLIQUE INTERNE Bo'CitéArt
   ========================================================= */

window.BociteResearchAssociations={

  /* État */
  getState:
    () =>
      clone(
        getState()
      ),

  setTargetActiveCount:
    setTargetActiveCount,


  /* Recherche / candidatures */
  search:
    searchAssociations,

  propose:
    proposeAssociation,

  candidates:
    () =>
      clone(
        candidates()
      ),

  find:
    candidateId =>
      clone(
        findCandidate(
          candidateId
        )
      ),


  /* Premier contrôle Mairie */
  runMairieAgentReview:
    runMairieAgentReview,

  applyMairieAgentResult:
    applyMairieAgentResult,


  /* Sélection Mairie */
  mairieSelectAssociations:
    mairieSelectAssociations,


  /* Second contrôle Bo'CitéArt */
  runBociteartAgentReview:
    runBociteartAgentReview,

  applyBociteartAgentResult:
    applyBociteartAgentResult,


  /* Associations actives */
  active:
    () =>
      clone(
        activeAssociations()
      ),

  isActive:
    candidateId =>
      associationIsCurrentlyActive(
        findCandidate(
          candidateId
        )
      ),

  expireOutdated:
    expireOutdatedAssociations,


  /* Coordonnées bancaires sécurisées */
  registerSecureBankDetails:
    registerSecureBankDetails,


  /* Participation sans conversion monétaire */
  recordParticipation:
    recordParticipation,

  participationSummary:
    participationSummary,


  /* Enveloppe Mairie */
  createAnnualEnvelope:
    createAnnualEnvelope,

  envelopes:
    () =>
      clone(
        envelopes()
      ),

  confirmAnnualEnvelope:
    confirmAnnualEnvelope,


  /* Paiements réellement confirmés */
  markPaymentConfirmed:
    markPaymentConfirmed,

  requestAssociationAcknowledgement:
    requestAssociationAcknowledgement,


  /* Remerciements */
  registerAssociationThanks:
    registerAssociationThanks,

  officialThanksFeed:
    officialThanksFeed,


  /* Maintenance annuelle */
  annualMaintenance:
    annualMaintenance
};


/* =========================================================
   MAINTENANCE AU CHARGEMENT
   ========================================================= */

expireOutdatedAssociations();


/* =========================================================
   ÇA FINIT ICI
   REGISTRE CENTRAL RECHERCHE MÉDICALE
   ========================================================= */

})();
