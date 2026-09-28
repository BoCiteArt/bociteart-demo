/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 3 — CRÉATION DU COMPTE

   INTRODUCTION
   → CRÉATION DU COMPTE
   → SYNOPTIQUE

   Ce fichier gère :
   → l'écran « Je crée mon compte » ;
   → l'identifiant anonyme d'installation ;
   → l'activation unique ;
   → la catégorie déclarée ;
   → la commune déclarée ;
   → le compte local de démonstration ;
   → les statistiques anonymes.

   Ce fichier ne décide jamais lui-même
   de la page suivante.
   ========================================================= */

(function initBociteartRegistration(){

  "use strict";

  if(window.BoCiteArtRegistration){
    return;
  }

  const OVERLAY_ID =
    "bociteRegistrationOverlay";

  /* =====================================================
     CLÉS DE STOCKAGE
     ===================================================== */

const STORAGE = {

  installation:
    "bociteart_installation_id_v1",

  activation:
    "bociteart_activation_v1",

  account:
    "bociteart_account_demo_v1",

  registration:
    "bociteart_registration_completed_v1",

  statistics:
    "bociteart_statistics_queue_v1",

  profile:
    "bociteart_visit_profile_v1",

  commune:
    "bociteart_declared_commune_v1",

  security:
    "bociteart_account_security_v1",

  verification:
    "bociteart_account_verification_v1",

  organization:
    "bociteart_organization_v1",

  collaborators:
    "bociteart_collaborators_v1",

  sessions:
    "bociteart_account_sessions_v1",

  securityLog:
    "bociteart_security_log_v1"

};


const MAX_STATISTICS =
  250;


const MAX_SECURITY_LOG =
  300;


const ALLOWED_CATEGORIES = [

  "jeune",
  "citoyen",
  "commerce",
  "entreprise",
  "association",
  "sport",
  "ecole",
  "mairie"

];


/* =====================================================
   COMPTES AVEC ORGANISATION
   ===================================================== */

const ORGANIZATION_CATEGORIES = [

  "commerce",
  "entreprise",
  "association",
  "sport",
  "ecole",
  "mairie"

];


function isOrganizationCategory(
  category
){

  const normalized =
    normalizeCategory(
      category
    );

  return ORGANIZATION_CATEGORIES
    .includes(
      normalized
    );
}


/* =====================================================
   RÔLES D'ACCÈS
   ===================================================== */

const ACCESS_ROLES = {

  owner:{
    label:
      "Responsable principal",

    permissions:[
      "all"
    ]
  },

  administrator:{
    label:
      "Administrateur délégué",

    permissions:[
      "profile",
      "messages",
      "publications",
      "bocitecoins",
      "employment",
      "directory",
      "sport",
      "billing",
      "collaborators"
    ]
  },

  communication:{
    label:
      "Communication",

    permissions:[
      "profile",
      "messages",
      "publications",
      "directory"
    ]
  },

  employment:{
    label:
      "Emploi",

    permissions:[
      "employment"
    ]
  },

  finance:{
    label:
      "Gestion / facturation",

    permissions:[
      "billing",
      "bocitecoins"
    ]
  },

  sport:{
    label:
      "Sport / résultats",

    permissions:[
      "sport",
      "messages",
      "publications"
    ]
  },

  custom:{
    label:
      "Accès personnalisé",

    permissions:[]
  }

};

/* =====================================================
   MOTEUR CENTRAL DE DÉCISION
   VALIDATION DES ORGANISATIONS
   ===================================================== */

function runOrganizationValidationDecision(
  decision,
  options
){

  const organization =
    getOrganization();

  if(
    !organization ||
    !organization.organizationId
  ){
    return {
      ok: false,
      reason: "organization_not_found"
    };
  }


  const data =
    options &&
    typeof options === "object"
      ? options
      : {};


  const nextDecision =
    String(
      decision ||
      ""
    ).trim();


  const allowedDecisions = [
    "needs_information",
    "unfavorable",
    "validated"
  ];


  if(
    !allowedDecisions.includes(
      nextDecision
    )
  ){
    return {
      ok: false,
      reason: "invalid_validation_decision"
    };
  }


  /*
    Une validation favorable exige
    que tous les contrôles obligatoires
    de la catégorie soient terminés.
  */

  if(
    nextDecision === "validated"
  ){

    const validationState =
      getOrganizationValidationState();

    if(
      !validationState.ok
    ){
      return validationState;
    }


    if(
      validationState.complete !== true
    ){
      return {
        ok: false,
        reason:
          "validation_checks_incomplete",

        missing:
          validationState.missing
      };
    }
  }


  /*
    La modification réelle du statut
    reste centralisée dans une seule fonction.
  */

  const result =
    setOrganizationValidationStatus(
      nextDecision,
      {
        reason:
          String(
            data.reason ||
            ""
          ).trim(),

        reviewedBy:
          String(
            data.reviewedBy ||
            "bociteart_validation_agent"
          ).trim()
      }
    );


  if(
    !result ||
    result.ok !== true
  ){
    return result || {
      ok: false,
      reason:
        "validation_status_update_failed"
    };
  }


  addSecurityLog(
    "organization_validation_decision",
    {
      organizationId:
        organization.organizationId,

      category:
        organization.category,

      decision:
        nextDecision,

      reviewedBy:
        String(
          data.reviewedBy ||
          "bociteart_validation_agent"
        ).trim(),

      reason:
        String(
          data.reason ||
          ""
        ).trim()
    }
  );


  return {
    ok: true,

    decision:
      nextDecision,

    organization:
      result.organization ||
      getOrganization()
  };
}
   
/* =====================================================
   PERMISSIONS DISPONIBLES
   ===================================================== */

const ACCESS_PERMISSIONS = {

  profile:
    "Modifier la fiche et les informations",

  messages:
    "Publier le mot du jour et les informations",

  publications:
    "Créer et gérer les publications / publicités",

  bocitecoins:
    "Gérer les opérations bocitecoins",

  employment:
    "Gérer l'emploi et les candidatures",

  directory:
    "Gérer la fiche annuaire",

  sport:
    "Publier résultats et résumés sportifs",

  billing:
    "Consulter et gérer la facturation",

  collaborators:
    "Gérer les collaborateurs"

};

/* =====================================================
   VERSION DE SÉCURITÉ
   ===================================================== */

const ACCOUNT_SECURITY_VERSION =
  "2";

  /* =====================================================
     OUTILS
     ===================================================== */

  function getElement(id){

    return document.getElementById(id);
  }

  function safeParse(
    value,
    fallback
  ){

    try{

      return JSON.parse(value);

    }catch(error){

      return fallback;
    }
  }

  function normalizeText(value){

    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeEmail(value){

    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function normalizeCategory(value){

    const category =
      String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();

    const aliases = {
      mineur:"jeune",
      enfant:"jeune",
      jeune:"jeune",

      habitant:"citoyen",
      citoyen:"citoyen",

      commercant:"commerce",
      commerce:"commerce",

      societe:"entreprise",
      professionnel:"entreprise",
      entreprise:"entreprise",

      association:"association",

      club:"sport",
      sportif:"sport",
      sport:"sport",
      "club sportif":"sport",

      scolaire:"ecole",
      enseignant:"ecole",
      ecole:"ecole",

      collectivite:"mairie",
      ville:"mairie",
      mairie:"mairie"
    };

    const normalized =
      aliases[category] ||
      category;

    return ALLOWED_CATEGORIES.includes(
      normalized
    )
      ? normalized
      : "";
  }

  function createUniqueId(prefix){

    if(
      window.crypto &&
      typeof window.crypto.randomUUID ===
      "function"
    ){

      return (
        prefix +
        "-" +
        window.crypto.randomUUID()
      );
    }

    return (
      prefix +
      "-" +
      Date.now().toString(36) +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 12)
    );
  }

  function getLocalStorageItem(key){

    try{

      return localStorage.getItem(key);

    }catch(error){

      return null;
    }
  }

  function setLocalStorageItem(
    key,
    value
  ){

    try{

      localStorage.setItem(
        key,
        value
      );

      return true;

    }catch(error){

      console.warn(
        "Bo'CitéArt : stockage local indisponible.",
        error
      );

      return false;
    }
  }

  function removeLocalStorageItem(key){

    try{

      localStorage.removeItem(key);

      return true;

    }catch(error){

      return false;
    }
  }

/* =====================================================
   SÉCURITÉ DES COMPTES
   CITOYENS + ORGANISATIONS + COLLABORATEURS
   ===================================================== */

function normalizePhone(value){

  return String(value || "")
    .replace(/[^\d+]/g, "")
    .trim();
}


/* =====================================================
   COMPATIBILITÉ
   ===================================================== */

/*
  Certains blocs déjà installés utilisent encore
  isProfessionalCategory().

  On le conserve comme alias pour ne rien casser.
*/

function isProfessionalCategory(
  category
){

  return isOrganizationCategory(
    category
  );
}


/* =====================================================
   SÉCURITÉ PRINCIPALE DU COMPTE
   ===================================================== */

function getAccountSecurity(){

  const saved =
    getLocalStorageItem(
      STORAGE.security
    );

  const data =
    saved
      ? safeParse(
          saved,
          {}
        )
      : {};

  return (
    data &&
    typeof data === "object"
  )
    ? data
    : {};
}


function saveAccountSecurity(
  data
){

  const source =
    data &&
    typeof data === "object"
      ? data
      : {};

  source.version =
    ACCOUNT_SECURITY_VERSION;

  source.updatedAt =
    new Date().toISOString();

  setLocalStorageItem(
    STORAGE.security,
    JSON.stringify(source)
  );

  return source;
}


/* =====================================================
   VÉRIFICATIONS E-MAIL / TÉLÉPHONE
   ===================================================== */

function getAccountVerification(){

  const saved =
    getLocalStorageItem(
      STORAGE.verification
    );

  const data =
    saved
      ? safeParse(
          saved,
          {}
        )
      : {};

  return (
    data &&
    typeof data === "object"
  )
    ? data
    : {};
}


function saveAccountVerification(
  data
){

  const source =
    data &&
    typeof data === "object"
      ? data
      : {};

  source.updatedAt =
    new Date().toISOString();

  setLocalStorageItem(
    STORAGE.verification,
    JSON.stringify(source)
  );

  return source;
}


/* =====================================================
   ORGANISATION
   ===================================================== */

function getOrganization(){

  const saved =
    getLocalStorageItem(
      STORAGE.organization
    );

  const data =
    saved
      ? safeParse(
          saved,
          {}
        )
      : {};

  return (
    data &&
    typeof data === "object"
  )
    ? data
    : {};
}


function saveOrganization(
  data
){

  const source =
    data &&
    typeof data === "object"
      ? data
      : {};

  source.updatedAt =
    new Date().toISOString();

  setLocalStorageItem(
    STORAGE.organization,
    JSON.stringify(source)
  );

  return source;
}


/* =====================================================
   COLLABORATEURS
   ===================================================== */

function loadCollaborators(){

  const saved =
    getLocalStorageItem(
      STORAGE.collaborators
    );

  const rows =
    saved
      ? safeParse(
          saved,
          []
        )
      : [];

  return Array.isArray(rows)
    ? rows
    : [];
}


function saveCollaborators(
  rows
){

  const safeRows =
    Array.isArray(rows)
      ? rows
      : [];

  setLocalStorageItem(
    STORAGE.collaborators,
    JSON.stringify(safeRows)
  );

  return safeRows;
}


function getCollaboratorById(
  collaboratorId
){

  return loadCollaborators()
    .find(function(item){

      return (
        String(item.id) ===
        String(collaboratorId)
      );
    }) || null;
}


/* =====================================================
   JOURNAL DE SÉCURITÉ
   ===================================================== */

function loadSecurityLog(){

  const saved =
    getLocalStorageItem(
      STORAGE.securityLog
    );

  const rows =
    saved
      ? safeParse(
          saved,
          []
        )
      : [];

  return Array.isArray(rows)
    ? rows
    : [];
}


function addSecurityLog(
  type,
  details
){

  const rows =
    loadSecurityLog();

  rows.unshift({

    id:
      createUniqueId(
        "bociteart-security"
      ),

    type:
      normalizeText(
        type ||
        "information"
      ),

    details:
      details &&
      typeof details === "object"
        ? details
        : {},

    date:
      new Date().toISOString()

  });

  setLocalStorageItem(
    STORAGE.securityLog,
    JSON.stringify(
      rows.slice(
        0,
        MAX_SECURITY_LOG
      )
    )
  );
}


/* =====================================================
   SESSIONS
   ===================================================== */

function loadSessions(){

  const saved =
    getLocalStorageItem(
      STORAGE.sessions
    );

  const rows =
    saved
      ? safeParse(
          saved,
          []
        )
      : [];

  return Array.isArray(rows)
    ? rows
    : [];
}


function saveSessions(
  rows
){

  const safeRows =
    Array.isArray(rows)
      ? rows
      : [];

  setLocalStorageItem(
    STORAGE.sessions,
    JSON.stringify(safeRows)
  );

  return safeRows;
}


function revokeCollaboratorSessions(
  collaboratorId
){

  const rows =
    loadSessions()
      .map(function(session){

        if(
          String(
            session.collaboratorId ||
            ""
          ) ===
          String(
            collaboratorId
          )
        ){

          return Object.assign(
            {},
            session,
            {
              active:false,
              revokedAt:
                new Date().toISOString()
            }
          );
        }

        return session;
      });

  saveSessions(
    rows
  );

  addSecurityLog(
    "collaborator_sessions_revoked",
    {
      collaboratorId:
        collaboratorId
    }
  );

  return rows;
}


/* =====================================================
   COUPURE IMMÉDIATE D'UN COLLABORATEUR
   ===================================================== */

function revokeCollaboratorAccess(
  collaboratorId
){

  const rows =
    loadCollaborators();

  const collaborator =
    rows.find(function(item){

      return (
        String(item.id) ===
        String(collaboratorId)
      );
    });

  if(!collaborator){
    return false;
  }

  collaborator.enabled =
    false;

  collaborator.revokedAt =
    new Date().toISOString();

  collaborator.updatedAt =
    new Date().toISOString();

  saveCollaborators(
    rows
  );

  revokeCollaboratorSessions(
    collaboratorId
  );

  addSecurityLog(
    "collaborator_access_revoked",
    {
      collaboratorId:
        collaboratorId,

      name:
        collaborator.displayName ||
        ""
    }
  );

  return true;
}


/* =====================================================
   CODES TEMPORAIRES
   ===================================================== */

function createNumericCode(
  length
){

  const size =
    Number(length) ||
    6;

  const digits =
    [];

  if(
    window.crypto &&
    typeof window.crypto.getRandomValues ===
    "function"
  ){

    const values =
      new Uint32Array(
        size
      );

    window.crypto
      .getRandomValues(
        values
      );

    for(
      let index = 0;
      index < size;
      index += 1
    ){

      digits.push(
        String(
          values[index] %
          10
        )
      );
    }

    return digits.join("");
  }


  /*
    Secours uniquement pour la démo.

    En production :
    génération exclusivement côté serveur.
  */

  for(
    let index = 0;
    index < size;
    index += 1
  ){

    digits.push(
      String(
        Math.floor(
          Math.random() *
          10
        )
      )
    );
  }

  return digits.join("");
}


/* =====================================================
   EMPREINTE LOCALE DES SECRETS
   ===================================================== */

/*
  Démonstration uniquement.

  Aucun mot de passe n'est conservé en clair.

  En production :
  mots de passe, codes temporaires,
  récupération et authentification
  seront gérés côté serveur.
*/

function hashSecret(
  value
){

  const clean =
    String(
      value ||
      ""
    );

  if(!clean){

    return Promise.resolve(
      ""
    );
  }

  if(
    !window.crypto ||
    !window.crypto.subtle ||
    typeof TextEncoder ===
    "undefined"
  ){

    return Promise.reject(
      new Error(
        "Sécurité cryptographique indisponible."
      )
    );
  }

  const encoded =
    new TextEncoder()
      .encode(
        clean
      );

  return window.crypto.subtle
    .digest(
      "SHA-256",
      encoded
    )
    .then(function(buffer){

      return Array.from(
        new Uint8Array(
          buffer
        )
      )
      .map(function(byte){

        return byte
          .toString(16)
          .padStart(
            2,
            "0"
          );
      })
      .join("");
    });
}


function verifySecret(
  value,
  expectedHash
){

  if(
    !value ||
    !expectedHash
  ){

    return Promise.resolve(
      false
    );
  }

  return hashSecret(
    value
  )
  .then(function(hash){

    return (
      hash ===
      expectedHash
    );
  });
}


/* =====================================================
   ÉTAT DU COMPTE
   ===================================================== */

function accountSecurityReady(){

  const security =
    getAccountSecurity();

  return Boolean(
    security &&
    security.activated === true &&
    security.passwordConfigured === true
  );
}


function accountEmailVerified(){

  const verification =
    getAccountVerification();

  return (
    verification.emailVerified ===
    true
  );
}


function accountPhoneVerified(){

  const verification =
    getAccountVerification();

  return (
    verification.phoneVerified ===
    true
  );
}


/* =====================================================
   COMPATIBILITÉ AVEC LES BLOCS DÉJÀ POSÉS
   ===================================================== */

function getProfessionalSecurity(){

  return getAccountSecurity();
}


function saveProfessionalSecurity(
  data
){

  return saveAccountSecurity(
    data
  );
}


function getProfessionalVerification(){

  return getAccountVerification();
}


function saveProfessionalVerification(
  data
){

  return saveAccountVerification(
    data
  );
}


function professionalSecurityReady(){

  return accountSecurityReady();
}


function professionalEmailVerified(){

  return accountEmailVerified();
}


function professionalPhoneVerified(){

  return accountPhoneVerified();
}


/* =====================================================
   PASSKEY / BIOMÉTRIE / 2FA
   ===================================================== */

function passkeyAvailable(){

  return Boolean(
    window.PublicKeyCredential &&
    navigator.credentials
  );
}


function getSecurityCapabilities(){

  return {

    password:
      true,

    emailCode:
      true,

    smsCode:
      true,

    twoFactor:
      true,

    passkey:
      passkeyAvailable(),

    biometric:
      passkeyAvailable(),

    collaboratorManagement:
      true

  };
}

function getProfessionalSecurityCapabilities(){

  return getSecurityCapabilities();
}

   /* =====================================================
   ORGANISATION ET RESPONSABLE PRINCIPAL
   ===================================================== */

function getRolePermissions(
  role,
  customPermissions
){

  const cleanRole =
    String(
      role ||
      "custom"
    ).trim();

  const roleConfig =
    ACCESS_ROLES[
      cleanRole
    ] ||
    ACCESS_ROLES.custom;

  if(
    roleConfig.permissions
      .includes("all")
  ){

    return [
      "all"
    ];
  }

  if(
    cleanRole ===
    "custom"
  ){

    return Array.from(
      new Set(
        Array.isArray(
          customPermissions
        )
          ? customPermissions.filter(
              function(permission){

                return Object.prototype
                  .hasOwnProperty
                  .call(
                    ACCESS_PERMISSIONS,
                    permission
                  );
              }
            )
          : []
      )
    );
  }

  return Array.from(
    new Set(
      roleConfig.permissions
    )
  );
}


function ensureOrganizationForAccount(
  account
){

  if(
    !account ||
    !isOrganizationCategory(
      account.category
    )
  ){

    return null;
  }

const existing =
  getOrganization();

if(
  existing &&
  existing.organizationId
){

  if(
    String(
      existing.ownerAccountId ||
      ""
    ) ===
    String(
      account.accountId ||
      ""
    )
  ){

    return existing;
  }

  removeLocalStorageItem(
    STORAGE.organization
  );

  removeLocalStorageItem(
    STORAGE.collaborators
  );

  removeLocalStorageItem(
    STORAGE.sessions
  );
}

  const organization = {

    organizationId:
      createUniqueId(
        "bociteart-organization"
      ),

    category:
      account.category,

    name:
      account.displayName ||
      "",

    commune:
      account.commune ||
      "",

    ownerAccountId:
      account.accountId,

    ownerDisplayName:
      account.displayName ||
      "",

    ownerEmail:
      account.email ||
      "",

    ownerPhone:
      account.phone ||
      "",

     organizationProfile: {

  organizationName:
    "",

  siretOrSiren:
    "",

  associationIdentifier:
    "",

  clubIdentifier:
    "",

  schoolIdentifier:
    "",

  municipalityIdentifier:
    "",

  establishmentAddress:
    "",

  registeredAddress:
    "",

  registeredOffice:
    "",

  schoolAddress:
    "",

  businessActivity:
    "",

  legalStructure:
    "",

  responsibleIdentity:
    account.displayName || "",

  responsibleAuthority:
    "",

  presidentOrLegalRepresentative:
    "",

  directionOrAuthorizedRepresentative:
    "",

  institutionalAuthority:
    "",

  email:
    account.email || "",

  phone:
    account.phone || ""
},

 active:
      false,

    validationStatus:
      "pending_review",

          active:
      false,

    validationStatus:
      "draft",

    validationRequestedAt:
      null,

    validationReviewedAt:
      null,

    validationReviewedBy:
      null,

    validationReason:
      "",

    validationChecks:
      {},

    validationChecksUpdatedAt:
      null,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),

    version:
      "2"
  };

  saveOrganization(
    organization
  );

  addSecurityLog(
    "organization_created",
    {
      organizationId:
        organization.organizationId,

      ownerAccountId:
        account.accountId,

      category:
        account.category
    }
  );

  return organization;
}

/* =====================================================
   FICHE D'IDENTIFICATION DE L'ORGANISATION
   ===================================================== */

function updateOrganizationProfile(
  data
){

  const organization =
    getOrganization();

  if(
    !organization ||
    !organization.organizationId
  ){
    return {
      ok: false,
      reason: "organization_not_found"
    };
  }


  const account =
    getAccount();

  if(
    !account ||
    !account.accountId
  ){
    return {
      ok: false,
      reason: "account_not_found"
    };
  }


  /*
    Seul le responsable principal
    peut modifier l'identité
    de l'organisation.
  */

  if(
    String(
      organization.ownerAccountId ||
      ""
    ) !==
    String(
      account.accountId ||
      ""
    )
  ){
    return {
      ok: false,
      reason: "organization_owner_required"
    };
  }


  const source =
    data &&
    typeof data === "object"
      ? data
      : {};


  const current =
    (
      organization.organizationProfile &&
      typeof organization.organizationProfile === "object"
    )
      ? organization.organizationProfile
      : {};


  const allowedFields = [

    "organizationName",

    "siretOrSiren",

    "associationIdentifier",

    "clubIdentifier",

    "schoolIdentifier",

    "municipalityIdentifier",

    "establishmentAddress",

    "registeredAddress",

    "registeredOffice",

    "schoolAddress",

    "businessActivity",

    "legalStructure",

    "responsibleIdentity",

    "responsibleAuthority",

    "presidentOrLegalRepresentative",

    "directionOrAuthorizedRepresentative",

    "institutionalAuthority",

    "email",

    "phone"
  ];


  const next = {
    ...current
  };


  allowedFields.forEach(
    function(field){

      if(
        Object.prototype.hasOwnProperty.call(
          source,
          field
        )
      ){

        next[field] =
          String(
            source[field] ||
            ""
          ).trim();
      }
    }
  );


  organization.organizationProfile =
    next;


  /*
    Le nom principal de l'organisation
    reste également disponible
    directement sur sa fiche.
  */

  if(
    next.organizationName
  ){
    organization.name =
      next.organizationName;
  }


  organization.updatedAt =
    new Date().toISOString();


  /*
    Si l'organisation était déjà validée,
    une modification de son identité
    déclenche un nouveau contrôle.

    L'accès privé est donc suspendu
    jusqu'à la nouvelle validation.
  */

  if(
    organization.validationStatus ===
      "validated"
  ){

    organization.validationStatus =
      "pending_review";

    organization.active =
      false;

    organization.validationRequestedAt =
      new Date().toISOString();

    organization.validationReviewedAt =
      null;

    organization.validationReviewedBy =
      null;

    organization.validationReason =
      "organization_profile_updated";


    /*
      Les anciens contrôles ne doivent
      pas permettre une revalidation
      automatique après modification
      de l'identité de l'organisation.
    */

    organization.validationChecks =
      {};

    organization.validationChecksUpdatedAt =
      null;
  }


  saveOrganization(
    organization
  );


  addSecurityLog(
    "organization_profile_updated",
    {
      organizationId:
        organization.organizationId,

      category:
        organization.category,

      accountId:
        account.accountId
    }
  );


  return {
    ok: true,

    organization:
      organization,

    profile:
      organization.organizationProfile
  };
}

     /* =====================================================
   CHAMPS DE LA FICHE ORGANISATION
   SELON LA CATÉGORIE
   ===================================================== */

function getOrganizationProfileFields(
  category
){

  const type =
    String(
      category ||
      ""
    ).trim().toLowerCase();


  const common = [

    {
      name: "organizationName",
      label: "Nom de l'organisation",
      required: true
    },

    {
      name: "responsibleIdentity",
      label: "Nom et prénom du responsable",
      required: true
    },

    {
      name: "responsibleAuthority",
      label: "Qualité ou fonction du responsable",
      required: true
    },

    {
      name: "email",
      label: "Adresse e-mail professionnelle",
      required: true
    },

    {
      name: "phone",
      label: "Téléphone professionnel",
      required: true
    }
  ];


  const specific = {

    commerce: [

      {
        name: "siretOrSiren",
        label: "SIRET ou SIREN",
        required: true
      },

      {
        name: "establishmentAddress",
        label: "Adresse de l'établissement",
        required: true
      },

      {
        name: "businessActivity",
        label: "Activité du commerce",
        required: true
      }
    ],


    entreprise: [

      {
        name: "siretOrSiren",
        label: "SIRET ou SIREN",
        required: true
      },

      {
        name: "registeredAddress",
        label: "Adresse du siège ou de l'entreprise",
        required: true
      },

      {
        name: "businessActivity",
        label: "Activité de l'entreprise",
        required: true
      }
    ],


    association: [

      {
        name: "associationIdentifier",
        label: "RNA, SIREN ou identifiant de l'association",
        required: true
      },

      {
        name: "registeredOffice",
        label: "Adresse du siège de l'association",
        required: true
      }
    ],


    sport: [

      {
        name: "clubIdentifier",
        label: "Identifiant du club",
        required: true
      },

      {
        name: "legalStructure",
        label: "Structure juridique ou affiliation",
        required: true
      },

      {
        name: "presidentOrLegalRepresentative",
        label: "Président ou responsable légal",
        required: true
      }
    ],


    ecole: [

      {
        name: "schoolIdentifier",
        label: "Identifiant de l'établissement",
        required: true
      },

      {
        name: "schoolAddress",
        label: "Adresse de l'établissement",
        required: true
      },

      {
        name: "directionOrAuthorizedRepresentative",
        label: "Direction ou responsable autorisé",
        required: true
      }
    ],


    mairie: [

      {
        name: "municipalityIdentifier",
        label: "Identifiant de la commune",
        required: true
      },

      {
        name: "institutionalAuthority",
        label: "Autorité ou responsable habilité",
        required: true
      }
    ]
  };


  if(
    !Object.prototype.hasOwnProperty.call(
      specific,
      type
    )
  ){
    return [];
  }


  return [
    ...common,
    ...specific[type]
  ];
}

/* =====================================================
   ÉCRAN D'IDENTIFICATION DE L'ORGANISATION
   ===================================================== */

function getOrganizationProvidedInformation(
  organization
){

  const current =
    organization &&
    typeof organization === "object"
      ? organization
      : getOrganization();


  if(
    !current ||
    !current.organizationId
  ){
    return {};
  }


  const profile =
    (
      current.organizationProfile &&
      typeof current.organizationProfile === "object"
    )
      ? current.organizationProfile
      : {};


  function provided(value){

    return (
      String(
        value || ""
      ).trim().length > 0
    );
  }


  return {

    organization_name:
      provided(
        profile.organizationName
      ),

    commune:
      provided(
        current.commune
      ),

    responsible_identity:
      provided(
        profile.responsibleIdentity
      ),

    responsible_authority:
      provided(
        profile.responsibleAuthority
      ),

    email:
      provided(
        profile.email
      ),

    phone:
      provided(
        profile.phone
      ),

    siret_or_siren:
      provided(
        profile.siretOrSiren
      ),

    establishment_address:
      provided(
        profile.establishmentAddress
      ),

    registered_address:
      provided(
        profile.registeredAddress
      ),

    business_activity:
      provided(
        profile.businessActivity
      ),

    association_identifier:
      provided(
        profile.associationIdentifier
      ),

    registered_office:
      provided(
        profile.registeredOffice
      ),

    club_identifier:
      provided(
        profile.clubIdentifier
      ),

    legal_structure:
      provided(
        profile.legalStructure
      ),

    president_or_legal_representative:
      provided(
        profile.presidentOrLegalRepresentative
      ),

    school_identifier:
      provided(
        profile.schoolIdentifier
      ),

    school_address:
      provided(
        profile.schoolAddress
      ),

    direction_or_authorized_representative:
      provided(
        profile.directionOrAuthorizedRepresentative
      ),

    municipality_identifier:
      provided(
        profile.municipalityIdentifier
      ),

    institutional_authority:
      provided(
        profile.institutionalAuthority
      )
  };
}
   
function openOrganizationProfileForm(){

  const account =
    getAccount();

  const organization =
    getOrganization();


  if(
    !account ||
    !organization ||
    !organization.organizationId
  ){
    return false;
  }


  if(
    String(
      organization.ownerAccountId ||
      ""
    ) !==
    String(
      account.accountId ||
      ""
    )
  ){
    return false;
  }


  const fields =
    getOrganizationProfileFields(
      organization.category
    );


  if(
    !fields.length
  ){
    return false;
  }


  const current =
    (
      organization.organizationProfile &&
      typeof organization.organizationProfile === "object"
    )
      ? organization.organizationProfile
      : {};


  const oldOverlay =
    document.getElementById(
      "bociteOrganizationProfileOverlay"
    );


  if(oldOverlay){
    oldOverlay.remove();
  }


  const overlay =
    document.createElement(
      "div"
    );


  overlay.id =
    "bociteOrganizationProfileOverlay";


  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:100000",
    "background:rgba(0,0,0,.45)",
    "overflow:auto",
    "padding:18px",
    "box-sizing:border-box"
  ].join(";");


  const card =
    document.createElement(
      "div"
    );


  card.style.cssText = [
    "max-width:620px",
    "margin:20px auto",
    "background:#fff",
    "border-radius:16px",
    "padding:20px",
    "box-sizing:border-box",
    "box-shadow:0 8px 28px rgba(0,0,0,.18)"
  ].join(";");


  const title =
    document.createElement(
      "div"
    );


  title.textContent =
    "Identification de votre organisation";


  title.style.cssText = [
    "font-size:17px",
    "font-weight:700",
    "color:#24713b",
    "margin-bottom:8px"
  ].join(";");


  const introduction =
    document.createElement(
      "div"
    );


  introduction.textContent =
    "Complétez les informations nécessaires à la vérification de votre organisation par Bo’CitéArt.";


  introduction.style.cssText = [
    "font-size:14px",
    "line-height:1.5",
    "margin-bottom:18px"
  ].join(";");


  card.appendChild(
    title
  );

  card.appendChild(
    introduction
  );


  const inputs = {};


  fields.forEach(
    function(field){

      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.style.marginBottom =
        "14px";


      const label =
        document.createElement(
          "label"
        );


      label.textContent =
        field.label +
        (
          field.required
            ? " *"
            : ""
        );


      label.style.cssText = [
        "display:block",
        "font-size:14px",
        "font-weight:600",
        "margin-bottom:6px"
      ].join(";");


      const input =
        document.createElement(
          "input"
        );


      input.type =
        field.name === "email"
          ? "email"
          : (
              field.name === "phone"
                ? "tel"
                : "text"
            );


      input.value =
        String(
          current[field.name] ||
          ""
        );


      input.style.cssText = [
        "width:100%",
        "box-sizing:border-box",
        "padding:11px",
        "font-size:14px",
        "border:1px solid #b9b9b9",
        "border-radius:9px",
        "background:#fff"
      ].join(";");


      wrapper.appendChild(
        label
      );

      wrapper.appendChild(
        input
      );

      card.appendChild(
        wrapper
      );


      inputs[field.name] = {
        input:
          input,

        required:
          field.required === true
      };
    }
  );


  const message =
    document.createElement(
      "div"
    );


  message.style.cssText = [
    "font-size:14px",
    "margin-top:8px",
    "margin-bottom:12px"
  ].join(";");


  card.appendChild(
    message
  );


  const actions =
    document.createElement(
      "div"
    );


  actions.style.cssText = [
    "display:flex",
    "gap:10px",
    "flex-wrap:wrap",
    "margin-top:8px"
  ].join(";");


  const saveButton =
    document.createElement(
      "button"
    );


  saveButton.type =
    "button";


  saveButton.textContent =
    "Enregistrer et transmettre";


  saveButton.style.cssText = [
    "background:#fff",
    "color:#24713b",
    "border:2px solid #24713b",
    "border-radius:10px",
    "padding:10px 15px",
    "font-size:14px",
    "font-weight:700",
    "cursor:pointer"
  ].join(";");


  const closeButton =
    document.createElement(
      "button"
    );


  closeButton.type =
    "button";


  closeButton.textContent =
    "Fermer";


  closeButton.style.cssText = [
    "background:#fff",
    "color:#24713b",
    "border:1px solid #24713b",
    "border-radius:10px",
    "padding:10px 15px",
    "font-size:14px",
    "cursor:pointer"
  ].join(";");


  actions.appendChild(
    saveButton
  );

  actions.appendChild(
    closeButton
  );

  card.appendChild(
    actions
  );

  overlay.appendChild(
    card
  );

  document.body.appendChild(
    overlay
  );


  closeButton.addEventListener(
    "click",
    function(){

      overlay.remove();
    }
  );


  saveButton.addEventListener(
    "click",
    function(){

      const data = {};

      let missingField =
        false;


      Object.keys(
        inputs
      ).forEach(
        function(name){

          const row =
            inputs[name];

          const value =
            String(
              row.input.value ||
              ""
            ).trim();


          if(
            row.required &&
            !value
          ){
            missingField =
              true;

            row.input.style.borderColor =
              "#b42318";
          }else{

            row.input.style.borderColor =
              "#b9b9b9";
          }


          data[name] =
            value;
        }
      );


      if(missingField){

        message.textContent =
          "Complétez tous les champs obligatoires.";

        return;
      }


           const result =
        updateOrganizationProfile(
          data
        );


      if(
        !result ||
        result.ok !== true
      ){

        message.textContent =
          "L'enregistrement de la fiche n'a pas abouti.";

        return;
      }


      /*
        La fiche obligatoire est complète.

        Le dossier quitte l'état brouillon
        et entre dans la file de contrôle
        Bo’CitéArt.
      */

      const organization =
        result.organization;


      organization.validationStatus =
        "pending_review";

      organization.active =
        false;

      organization.validationRequestedAt =
        new Date().toISOString();

      organization.validationReviewedAt =
        null;

      organization.validationReviewedBy =
        null;

      organization.validationReason =
        "";


      saveOrganization(
        organization
      );


      addSecurityLog(
        "organization_validation_requested",
        {
          organizationId:
            organization.organizationId,

          category:
            organization.category,

          accountId:
            account.accountId
        }
      );


      message.textContent =
        "Votre dossier est enregistré et transmis pour vérification.";


      setTimeout(
        function(){

          if(
            document.body.contains(
              overlay
            )
          ){
            overlay.remove();
          }

        },
        900
      );
    }
  );


  return true;
}
   
/* =====================================================
   RESPONSABLE PRINCIPAL
   ===================================================== */

function isOrganizationOwner(
  accountId
){

  const organization =
    getOrganization();

  if(
    !organization ||
    !organization.ownerAccountId
  ){

    return false;
  }

  return (
    String(
      organization.ownerAccountId
    ) ===
    String(
      accountId
    )
  );
}


/*
  Le responsable principal possède
  toujours tous les droits.

  Il ne doit jamais dépendre
  d'une fiche collaborateur.
*/


/* =========================================================
   ACCÈS DU RESPONSABLE PRINCIPAL
   APRÈS VALIDATION DE L'ORGANISATION
   ========================================================= */

function getOwnerAccess(){

  const organization =
    getOrganization();

  if(
    !organization ||
    !organization.ownerAccountId
  ){

    return null;
  }


  const organizationValidated =
    (
      organization.active === true &&
      organization.validationStatus ===
        "validated"
    );


  return {

    accountId:
      organization.ownerAccountId,

    role:
      "owner",

    permissions:
      organizationValidated
        ? ["all"]
        : [],

    enabled:
      organizationValidated,

    organizationValidated:
      organizationValidated,

    validationStatus:
      organization.validationStatus ||
      "pending_review"
  };
}


/* =========================================================
   FIN ACCÈS DU RESPONSABLE PRINCIPAL
   ========================================================= */

   /* =========================================================
   ÇA COMMENCE ICI
   MOTEUR CENTRAL DE VALIDATION DES ORGANISATIONS Bo'CitéArt
   ========================================================= */

function setOrganizationValidationStatus(
  status,
  options
){

  const allowedStatuses = [
    "pending_review",
    "needs_information",
    "validated",
    "unfavorable"
  ];

  const nextStatus =
    String(
      status ||
      ""
    ).trim();


  if(
    !allowedStatuses.includes(
      nextStatus
    )
  ){

    return {
      ok: false,
      reason: "invalid_status"
    };
  }


  const organization =
    getOrganization();


  if(
    !organization ||
    !organization.organizationId
  ){

    return {
      ok: false,
      reason: "organization_not_found"
    };
  }


  const data =
    options &&
    typeof options === "object"
      ? options
      : {};


  /*
    Une demande de validation définitive
    doit obligatoirement passer tous les
    contrôles prévus pour la catégorie
    de l'organisation.
  */

  if(
    nextStatus === "validated"
  ){

    const validationChecks =
  (
    data.checks &&
    typeof data.checks === "object"
  )
    ? data.checks
    : (
        organization.validationChecks &&
        typeof organization.validationChecks === "object"
          ? organization.validationChecks
          : {}
      );

const validationResult =
  checkOrganizationValidation(
    organization,
    validationChecks
  );

    if(
      !validationResult.ok ||
      !validationResult.complete
    ){

      return {

        ok: false,

        reason:
          "validation_checks_incomplete",

        category:
          organization.category,

        missing:
          validationResult.missing || []
      };
    }
  }

  organization.validationStatus =
    nextStatus; 

if(
  data.checks &&
  typeof data.checks === "object"
){

  organization.validationChecks = {
    ...data.checks
  };

  organization.validationChecksUpdatedAt =
    new Date().toISOString();
}
   
  organization.active =
    (
      nextStatus ===
      "validated"
    );


  organization.validationReason =
    String(
      data.reason ||
      ""
    ).trim();


  organization.validationReviewedAt =
    new Date().toISOString();


  organization.validationReviewedBy =
    String(
      data.reviewedBy ||
      "bociteart"
    ).trim();


  organization.updatedAt =
    new Date().toISOString();


  saveOrganization(
    organization
  );


  addSecurityLog(
    "organization_validation_status_changed",
    {
      organizationId:
        organization.organizationId,

      category:
        organization.category,

      validationStatus:
        organization.validationStatus,

      active:
        organization.active,

      reviewedBy:
        organization.validationReviewedBy
    }
  );


  return {
    ok: true,
    organization:
      organization
  };
}

/* =========================================================
   ÇA FINIT ICI
   MOTEUR CENTRAL DE VALIDATION DES ORGANISATIONS Bo'CitéArt
   ========================================================= */

   /* =========================================================
   ÇA COMMENCE ICI
   RÈGLES DE CONTRÔLE PAR TYPE D'ORGANISATION
   ========================================================= */

function getOrganizationValidationRequirements(
  category
){

  const type =
    String(
      category ||
      ""
    ).trim().toLowerCase();


  const common = [
    "organization_name",
    "commune",
    "responsible_identity",
    "responsible_authority",
    "email",
    "phone"
  ];


  const requirements = {

    commerce: [
      ...common,
      "siret_or_siren",
      "establishment_address",
      "business_activity"
    ],

    entreprise: [
      ...common,
      "siret_or_siren",
      "registered_address",
      "business_activity"
    ],

    association: [
      ...common,
      "association_identifier",
      "registered_office"
    ],

    sport: [
      ...common,
      "club_identifier",
      "legal_structure",
      "president_or_legal_representative"
    ],

    ecole: [
      ...common,
      "school_identifier",
      "school_address",
      "direction_or_authorized_representative"
    ],

    mairie: [
      ...common,
      "municipality_identifier",
      "institutional_authority"
    ]
  };


  if(
    !Object.prototype.hasOwnProperty.call(
      requirements,
      type
    )
  ){

    return {
      ok: false,
      category:
        type,
      requirements: [],
      reason:
        "unsupported_organization_category"
    };
  }


  return {
    ok: true,
    category:
      type,
    requirements:
      requirements[type]
  };
}

/* =========================================================
   ÇA FINIT ICI
   RÈGLES DE CONTRÔLE PAR TYPE D'ORGANISATION
   ========================================================= */

/* =========================================================
   ÇA COMMENCE ICI
   CONTRÔLE COMPLET AVANT VALIDATION D'UNE ORGANISATION
   ========================================================= */

function checkOrganizationValidation(
  organization,
  checks
){

  if(
    !organization ||
    !organization.organizationId
  ){

    return {
      ok: false,
      complete: false,
      reason: "organization_not_found",
      missing: []
    };
  }


  const requirementsResult =
    getOrganizationValidationRequirements(
      organization.category
    );


  if(
    !requirementsResult.ok
  ){

    return {
      ok: false,
      complete: false,
      reason:
        requirementsResult.reason,
      missing: []
    };
  }


  const validationChecks =
    checks &&
    typeof checks === "object"
      ? checks
      : {};


  const missing =
    requirementsResult.requirements.filter(
      function(requirement){

        return (
          validationChecks[requirement] !==
          true
        );
      }
    );


  return {

    ok: true,

    complete:
      missing.length === 0,

    category:
      requirementsResult.category,

    required:
      requirementsResult.requirements,

    missing:
      missing
  };
}

/* =========================================================
   ÇA FINIT ICI
   CONTRÔLE COMPLET AVANT VALIDATION D'UNE ORGANISATION
   ========================================================= */

/* =====================================================
   MISE À JOUR D'UN CONTRÔLE DE VALIDATION
   ===================================================== */

function setOrganizationValidationCheck(
  checkName,
  value
){

  const organization =
    getOrganization();

  if(
    !organization ||
    !organization.organizationId
  ){
    return {
      ok: false,
      reason: "organization_not_found"
    };
  }

  const requirementsResult =
    getOrganizationValidationRequirements(
      organization.category
    );

  const name =
    String(
      checkName ||
      ""
    ).trim();

  if(
    !requirementsResult.ok ||
    !requirementsResult.requirements.includes(
      name
    )
  ){
    return {
      ok: false,
      reason: "invalid_validation_check"
    };
  }

  if(
    typeof value !== "boolean"
  ){
    return {
      ok: false,
      reason: "invalid_validation_check_value"
    };
  }

  const checks =
    (
      organization.validationChecks &&
      typeof organization.validationChecks === "object"
    )
      ? {
          ...organization.validationChecks
        }
      : {};

  checks[name] =
    value;

  organization.validationChecks =
    checks;

  organization.validationChecksUpdatedAt =
    new Date().toISOString();

  organization.updatedAt =
    new Date().toISOString();

  saveOrganization(
    organization
  );

  addSecurityLog(
    "organization_validation_check_updated",
    {
      organizationId:
        organization.organizationId,

      category:
        organization.category,

      check:
        name,

      value:
        checks[name]
    }
  );

  return {
    ok: true,

    check:
      name,

    value:
      checks[name],

    organization:
      organization
  };
}

/* =====================================================
   ÉTAT DES CONTRÔLES DE VALIDATION
   ===================================================== */

function getOrganizationValidationState(){

  const organization =
    getOrganization();

  if(
    !organization ||
    !organization.organizationId
  ){
    return {
      ok: false,
      reason: "organization_not_found"
    };
  }


  const requirementsResult =
    getOrganizationValidationRequirements(
      organization.category
    );

  if(
    !requirementsResult.ok
  ){
    return requirementsResult;
  }


  const checks =
    (
      organization.validationChecks &&
      typeof organization.validationChecks === "object"
    )
      ? organization.validationChecks
      : {};


  const validationResult =
    checkOrganizationValidation(
      organization,
      checks
    );


  return {

    ok: true,

    organizationId:
      organization.organizationId,

    category:
      organization.category,

    status:
      organization.validationStatus ||
      "pending_review",

    active:
      organization.active === true,

    requirements:
      requirementsResult.requirements,

    checks:
      checks,

    complete:
      validationResult.complete === true,

    missing:
      Array.isArray(
        validationResult.missing
      )
        ? validationResult.missing
        : [],

    validationChecksUpdatedAt:
      organization.validationChecksUpdatedAt ||
      null
  };
}
   
/* =====================================================
   PERMISSIONS
   ===================================================== */

function hasAccessPermission(
  permissions,
  permission
){

  const rows =
    Array.isArray(
      permissions
    )
      ? permissions
      : [];

  return (
    rows.includes(
      "all"
    ) ||
    rows.includes(
      permission
    )
  );
}


function collaboratorHasPermission(
  collaborator,
  permission
){

  if(
    !collaborator ||
    collaborator.enabled !== true ||
    collaborator.invitationAccepted !== true
  ){

    return false;
  }

  return hasAccessPermission(
    collaborator.permissions,
    permission
  );
}


/* =====================================================
   CRÉATION D'UN COLLABORATEUR
   ===================================================== */

function createCollaboratorAccess(
  data
){

  const source =
    data &&
    typeof data === "object"
      ? data
      : {};

  const organization =
    getOrganization();

  if(
    !organization ||
    !organization.organizationId
  ){

    return Promise.reject(
      new Error(
        "Organisation introuvable."
      )
    );
  }

  const displayName =
    normalizeText(
      source.displayName
    );

  const email =
    normalizeEmail(
      source.email
    );

  const phone =
    normalizePhone(
      source.phone
    );

  const role =
    ACCESS_ROLES[
      source.role
    ]
      ? source.role
      : "custom";

  const permissions =
    getRolePermissions(
      role,
      source.permissions
    );

/* =========================================================
   ÇA COMMENCE ICI
   VALIDATION COLLABORATEUR — VERSION D'ORIGINE
   ========================================================= */

if(
  !displayName ||
  (
    !email &&
    !phone
  )
){

  return Promise.reject(
    new Error(
      "Nom et moyen de contact obligatoires."
    )
  );

}

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */

  
  /*
    Code d'invitation de démonstration.

    En production :
    génération, expiration et validation
    exclusivement côté serveur.
  */

  const invitationCode =
    createNumericCode(6);


  return hashSecret(
    invitationCode
  )
  .then(function(
    invitationCodeHash
  ){

    const collaborators =
      loadCollaborators();

    const collaborator = {

      id:
        createUniqueId(
          "bociteart-collaborator"
        ),

      organizationId:
        organization.organizationId,

      displayName:
        displayName,

      email:
        email,

      phone:
        phone,

      role:
        role,

      permissions:
        permissions,

      enabled:
        true,

      invitationAccepted:
        false,

      invitationCodeHash:
        invitationCodeHash,

      invitedAt:
        new Date().toISOString(),

      acceptedAt:
        null,

      revokedAt:
        null,

      updatedAt:
        new Date().toISOString(),

      version:
        "1"
    };


    collaborators.push(
      collaborator
    );

    saveCollaborators(
      collaborators
    );


    addSecurityLog(
      "collaborator_invited",
      {
        collaboratorId:
          collaborator.id,

        organizationId:
          organization.organizationId,

        displayName:
          collaborator.displayName,

        role:
          collaborator.role,

        permissions:
          collaborator.permissions
      }
    );


    /*
      On renvoie le code uniquement
      pour pouvoir l'afficher dans la démo.

      Il n'est pas enregistré en clair.
    */

    return {

      collaborator:
        collaborator,

      invitationCode:
        invitationCode
    };
  });
}


/* =====================================================
   ACCEPTATION DE L'INVITATION
   ===================================================== */

function acceptCollaboratorInvitation(
  collaboratorId,
  enteredCode
){

  const collaborators =
    loadCollaborators();

  const collaborator =
    collaborators.find(
      function(item){

        return (
          String(
            item.id
          ) ===
          String(
            collaboratorId
          )
        );
      }
    );

  if(
    !collaborator ||
    collaborator.enabled !==
    true
  ){

    return Promise.resolve(
      false
    );
  }


  return verifySecret(
    enteredCode,
    collaborator.invitationCodeHash
  )
  .then(function(valid){

    if(!valid){
      return false;
    }

    collaborator.invitationAccepted =
      true;

    collaborator.invitationCodeHash =
      "";

    collaborator.acceptedAt =
      new Date().toISOString();

    collaborator.updatedAt =
      new Date().toISOString();


    saveCollaborators(
      collaborators
    );


    addSecurityLog(
      "collaborator_invitation_accepted",
      {
        collaboratorId:
          collaborator.id
      }
    );


    return true;
  });
}


/* =====================================================
   MODIFICATION DES DROITS
   ===================================================== */

function updateCollaboratorAccess(
  collaboratorId,
  changes
){

  const collaborators =
    loadCollaborators();

  const collaborator =
    collaborators.find(
      function(item){

        return (
          String(
            item.id
          ) ===
          String(
            collaboratorId
          )
        );
      }
    );

  if(!collaborator){
    return null;
  }

  const source =
    changes &&
    typeof changes === "object"
      ? changes
      : {};


  if(
    source.displayName !==
    undefined
  ){

    collaborator.displayName =
      normalizeText(
        source.displayName
      );
  }


  if(
    source.email !==
    undefined
  ){

    collaborator.email =
      normalizeEmail(
        source.email
      );
  }


  if(
    source.phone !==
    undefined
  ){

    collaborator.phone =
      normalizePhone(
        source.phone
      );
  }


  if(
    source.role !==
    undefined
  ){

    const role =
      ACCESS_ROLES[
        source.role
      ]
        ? source.role
        : "custom";

    collaborator.role =
      role;

    collaborator.permissions =
      getRolePermissions(
        role,
        source.permissions
      );
  }


  if(
    source.permissions !==
    undefined &&
    collaborator.role ===
    "custom"
  ){

    collaborator.permissions =
      getRolePermissions(
        "custom",
        source.permissions
      );
  }


  collaborator.updatedAt =
    new Date().toISOString();


  saveCollaborators(
    collaborators
  );


  addSecurityLog(
    "collaborator_access_updated",
    {
      collaboratorId:
        collaborator.id,

      role:
        collaborator.role,

      permissions:
        collaborator.permissions
    }
  );


  return collaborator;
}


/* =====================================================
   RÉACTIVER UN COLLABORATEUR
   ===================================================== */

function restoreCollaboratorAccess(
  collaboratorId
){

  const collaborators =
    loadCollaborators();

  const collaborator =
    collaborators.find(
      function(item){

        return (
          String(
            item.id
          ) ===
          String(
            collaboratorId
          )
        );
      }
    );

  if(!collaborator){
    return false;
  }

  collaborator.enabled =
    true;

  collaborator.revokedAt =
    null;

  collaborator.updatedAt =
    new Date().toISOString();


  saveCollaborators(
    collaborators
  );


  addSecurityLog(
    "collaborator_access_restored",
    {
      collaboratorId:
        collaborator.id
    }
  );


  return true;
}


/* =====================================================
   SUPPRESSION DÉFINITIVE
   ===================================================== */

/*
  La coupure immédiate doit être privilégiée.

  La suppression définitive est distincte
  afin de conserver la traçabilité
  tant qu'elle est utile.
*/

function permanentlyDeleteCollaborator(
  collaboratorId
){

  const previous =
    getCollaboratorById(
      collaboratorId
    );

  if(!previous){
    return false;
  }


  revokeCollaboratorSessions(
    collaboratorId
  );


  const collaborators =
    loadCollaborators()
      .filter(
        function(item){

          return (
            String(
              item.id
            ) !==
            String(
              collaboratorId
            )
          );
        }
      );


  saveCollaborators(
    collaborators
  );


  addSecurityLog(
    "collaborator_deleted",
    {
      collaboratorId:
        collaboratorId,

      displayName:
        previous.displayName ||
        ""
    }
  );


  return true;
}


/* =====================================================
   LISTE DES COLLABORATEURS ACTIFS
   ===================================================== */

function getActiveCollaborators(){

  return loadCollaborators()
    .filter(
      function(item){

        return (
          item.enabled === true &&
          item.invitationAccepted === true
        );
      }
    );
}

   /* =====================================================
   CONTRÔLE CENTRAL DES ACCÈS PRIVÉS
   ===================================================== */

function getCurrentAccessContext(){

  const account =
    getAccount();

  const organization =
    getOrganization();


  /*
    Aucun compte identifié.
  */

  if(!account){

    return {

      authenticated:
        false,

      account:
        null,

      organization:
        organization || null,

      role:
        null,

      permissions:
        [],

      collaborator:
        null
    };
  }


  /*
    RESPONSABLE PRINCIPAL

    Le responsable est reconnu comme
    propriétaire de l'organisation.

    L'accès privé n'est ouvert qu'après
    validation de l'organisation par Bo'CitéArt.
  */

  if(
    organization &&
    organization.organizationId &&
    String(
      organization.ownerAccountId ||
      ""
    ) ===
    String(
      account.accountId ||
      ""
    )
  ){

    const organizationValidated =
      (
        organization.active === true &&
        organization.validationStatus ===
          "validated"
      );


    return {

      authenticated:
        Boolean(
          accountSecurityReady() &&
          organizationValidated
        ),

      account:
        account,

      organization:
        organization,

      role:
        "owner",

      permissions:
        organizationValidated
          ? ["all"]
          : [],

      collaborator:
        null,

      organizationValidated:
        organizationValidated,

      validationStatus:
        organization.validationStatus ||
        "pending_review"
    };
  }


  /*
    COMPTE PERSONNEL

    Citoyen ou autre profil
    sans organisation.
  */

  if(
    !isOrganizationCategory(
      account.category
    )
  ){

    return {

      authenticated:
        accountSecurityReady(),

      account:
        account,

      organization:
        null,

      role:
        "personal",

      permissions:[
        "profile"
      ],

      collaborator:
        null
    };
  }


  /*
    COLLABORATEUR

    On recherche une session active
    rattachée à un collaborateur.
  */

  const activeSession =
    loadSessions()
      .find(function(session){

        return (
          session &&
          session.active === true &&
          session.accountId ===
            account.accountId
        );
      });


  if(
    activeSession &&
    activeSession.collaboratorId
  ){

    const collaborator =
      getCollaboratorById(
        activeSession.collaboratorId
      );


    const organizationValidated =
      Boolean(
        organization &&
        organization.organizationId &&
        organization.active === true &&
        organization.validationStatus ===
          "validated"
      );


    if(
      collaborator &&
      collaborator.enabled === true &&
      collaborator.invitationAccepted === true &&
      organizationValidated
    ){

      return {

        authenticated:
          accountSecurityReady(),

        account:
          account,

        organization:
          organization,

        role:
          collaborator.role ||
          "custom",

        permissions:
          Array.isArray(
            collaborator.permissions
          )
            ? collaborator.permissions
            : [],

        collaborator:
          collaborator,

        organizationValidated:
          true,

        validationStatus:
          "validated"
      };
    }
  }


  /*
    Aucun accès privé autorisé.
  */

  return {

    authenticated:
      false,

    account:
      account,

    organization:
      organization || null,

    role:
      null,

    permissions:
      [],

    collaborator:
      null,

    organizationValidated:
      false,

    validationStatus:
      organization &&
      organization.validationStatus
        ? organization.validationStatus
        : "pending_review"
  };
}
 
/* =====================================================
   AUTORISATION D'UNE ACTION
   ===================================================== */

function canAccess(
  permission
){

  const context =
    getCurrentAccessContext();

  if(
    !context.authenticated
  ){

    return false;
  }

  if(
    context.permissions.includes(
      "all"
    )
  ){

    return true;
  }

  return context.permissions
    .includes(
      permission
    );
}


/* =====================================================
   CONTRÔLE D'UNE ACTION PRIVÉE
   ===================================================== */

function requireAccess(
  permission
){

  const allowed =
    canAccess(
      permission
    );

  if(!allowed){

    addSecurityLog(
      "access_refused",
      {
        permission:
          permission || "",

        accountId:
          getAccount()
            ? getAccount().accountId
            : ""
      }
    );
  }

  return allowed;
}


/* =====================================================
   CRÉATION D'UNE SESSION LOCALE
   ===================================================== */

function createSession(
  data
){

  const source =
    data &&
    typeof data === "object"
      ? data
      : {};

  const account =
    getAccount();

  if(!account){
    return null;
  }

  const rows =
    loadSessions();

  const session = {

    id:
      createUniqueId(
        "bociteart-session"
      ),

    accountId:
      account.accountId,

    collaboratorId:
      source.collaboratorId ||
      null,

    active:
      true,

    createdAt:
      new Date().toISOString(),

    lastSeenAt:
      new Date().toISOString(),

    revokedAt:
      null,

    version:
      "1"
  };

  rows.push(
    session
  );

  saveSessions(
    rows
  );

  addSecurityLog(
    "session_created",
    {
      sessionId:
        session.id,

      accountId:
        session.accountId,

      collaboratorId:
        session.collaboratorId
    }
  );

  return session;
}


/* =====================================================
   FERMETURE D'UNE SESSION
   ===================================================== */

function revokeSession(
  sessionId
){

  const rows =
    loadSessions()
      .map(function(session){

        if(
          String(
            session.id ||
            ""
          ) ===
          String(
            sessionId ||
            ""
          )
        ){

          return Object.assign(
            {},
            session,
            {
              active:false,

              revokedAt:
                new Date().toISOString()
            }
          );
        }

        return session;
      });

  saveSessions(
    rows
  );

  addSecurityLog(
    "session_revoked",
    {
      sessionId:
        sessionId
    }
  );

  return true;
}


/* =====================================================
   COUPURE DE TOUTES LES SESSIONS
   D'UN COMPTE
   ===================================================== */

function revokeAllAccountSessions(
  accountId
){

  const rows =
    loadSessions()
      .map(function(session){

        if(
          String(
            session.accountId ||
            ""
          ) ===
          String(
            accountId ||
            ""
          )
        ){

          return Object.assign(
            {},
            session,
            {
              active:false,

              revokedAt:
                new Date().toISOString()
            }
          );
        }

        return session;
      });

  saveSessions(
    rows
  );

  addSecurityLog(
    "account_sessions_revoked",
    {
      accountId:
        accountId
    }
  );

  return rows;
}

 function getLogoHtml(){

  return `
    <span style="color:#2f5d46;font-weight:900;">Bo'Cité</span><span style="color:#b00020;font-weight:900;">Art</span>
  `;

}

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles(){

    if(
      getElement(
        "bociteRegistrationStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteRegistrationStyles";

    style.textContent = `
      #${OVERLAY_ID} {
        position:fixed;
        inset:0;
        z-index:999999;
        overflow-y:auto;
        box-sizing:border-box;
        padding:16px 10px 34px;
        background:#f3eddf;
        color:#111;
        font-family:Arial,sans-serif;
      }

      #bociteRegistrationCard {
        width:100%;
        max-width:650px;
        margin:0 auto;
        box-sizing:border-box;
        padding:23px 18px;
        border:2px solid #2f5d46;
        border-radius:15px;
        background:#fffdf7;
        box-shadow:0 8px 28px rgba(0,0,0,.13);
      }

     .bociteRegistrationTitle {
  margin:0;
  color:#111;
  font-size:28px;
  line-height:1.25;
  text-align:center;
}

.bociteRegistrationTitle span{
  display:inline;
  margin:0;
  padding:0;
}

      .bociteRegistrationIntro {
        margin-top:16px;
        color:#111;
        font-size:17px;
        line-height:1.55;
        text-align:center;
      }

      .bociteRegistrationForm {
        margin-top:22px;
      }

      .bociteRegistrationField {
        margin-top:16px;
      }

      .bociteRegistrationField label {
        display:block;
        margin-bottom:7px;
        color:#111;
        font-size:16px;
        font-weight:800;
      }

      .bociteRegistrationField input,
      .bociteRegistrationField select {
        display:block;
        width:100%;
        box-sizing:border-box;
        padding:13px 12px;
        border:2px solid #2f5d46;
        border-radius:9px;
        background:#fff;
        color:#111;
        font-size:16px;
      }

      .bociteRegistrationField input:focus,
      .bociteRegistrationField select:focus {
        outline:3px solid rgba(47,93,70,.17);
      }

      .bociteRegistrationHelp {
        margin-top:6px;
        color:#444;
        font-size:14px;
        line-height:1.45;
      }

      #bociteRegistrationMessage {
        display:none;
        margin-top:17px;
        padding:13px 12px;
        border-left:6px solid #b00020;
        background:#f7f3ea;
        color:#111;
        font-size:15px;
        line-height:1.45;
      }

      #bociteRegistrationContinueBtn {
        display:block;
        width:100%;
        margin-top:21px;
        padding:15px 12px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        color:#111;
        font-size:18px;
        font-weight:900;
        cursor:pointer;
        touch-action:manipulation;
      }

      #bociteRegistrationContinueBtn:hover,
      #bociteRegistrationContinueBtn:focus {
        background:#f6f2e9;
        outline:3px solid rgba(47,93,70,.16);
      }

      .bociteRegistrationPrivacy {
        margin-top:17px;
        padding:14px 13px;
        border-left:6px solid #2f5d46;
        background:#f7f3ea;
        color:#111;
        font-size:14px;
        line-height:1.5;
      }

      @media(max-width:600px){

        #${OVERLAY_ID} {
          padding:9px 7px 26px;
        }

        #bociteRegistrationCard {
          padding:20px 14px;
          border-radius:12px;
        }

        .bociteRegistrationTitle {
          font-size:24px;
        }

        .bociteRegistrationIntro {
          font-size:16px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /* =====================================================
     INSTALLATION ANONYME
     ===================================================== */

  function createInstallationId(){

    return createUniqueId(
      "bociteart-installation"
    );
  }

  function getInstallationId(){

    let installationId =
      getLocalStorageItem(
        STORAGE.installation
      );

    if(!installationId){

      installationId =
        createInstallationId();

      setLocalStorageItem(
        STORAGE.installation,
        installationId
      );
    }

    return installationId;
  }

  /* =====================================================
     ACTIVATION UNIQUE
     ===================================================== */

  function getActivation(){

    const saved =
      getLocalStorageItem(
        STORAGE.activation
      );

    return saved
      ? safeParse(saved, null)
      : null;
  }

  function hasActivation(){

    const activation =
      getActivation();

    return Boolean(
      activation &&
      activation.activated === true
    );
  }

  function activateInstallation(data){

    const existingActivation =
      getActivation();

    if(
      existingActivation &&
      existingActivation.activated === true
    ){

      return existingActivation;
    }

    const source =
      data &&
      typeof data === "object"
        ? data
        : {};

    const category =
      normalizeCategory(
        source.category ||
        source.profile
      );

    const commune =
      normalizeText(
        source.commune
      );

    const activation = {
      activated:true,

      installationId:
        getInstallationId(),

      activationId:
        createUniqueId(
          "bociteart-activation"
        ),

      activatedAt:
        new Date().toISOString(),

      category:
        category || null,

      commune:
        commune || null,

      version:
        "1"
    };

    setLocalStorageItem(
      STORAGE.activation,
      JSON.stringify(activation)
    );

    addStatistic({
      type:"activation_unique",
      category:activation.category,
      commune:activation.commune
    });

    return activation;
  }

  /* =====================================================
     PROFIL ET COMMUNE
     ===================================================== */

  function saveDeclaredProfile(profile){

    const category =
      normalizeCategory(profile);

    if(!category){
      return null;
    }

    const record = {
      profile:category,
      selectedAt:
        new Date().toISOString()
    };

    setLocalStorageItem(
      STORAGE.profile,
      JSON.stringify(record)
    );

    const activation =
      getActivation();

    if(activation){

      activation.category =
        category;

      activation.updatedAt =
        new Date().toISOString();

      setLocalStorageItem(
        STORAGE.activation,
        JSON.stringify(activation)
      );
    }

    return record;
  }

  function getDeclaredProfile(){

    const saved =
      getLocalStorageItem(
        STORAGE.profile
      );

    const record =
      saved
        ? safeParse(saved, null)
        : null;

    return record &&
      record.profile
        ? normalizeCategory(
            record.profile
          )
        : "";
  }

  function saveDeclaredCommune(commune){

    const normalizedCommune =
      normalizeText(commune);

    if(!normalizedCommune){
      return null;
    }

    const record = {
      commune:
        normalizedCommune,

      selectedAt:
        new Date().toISOString()
    };

    setLocalStorageItem(
      STORAGE.commune,
      JSON.stringify(record)
    );

    const activation =
      getActivation();

    if(activation){

      activation.commune =
        normalizedCommune;

      activation.updatedAt =
        new Date().toISOString();

      setLocalStorageItem(
        STORAGE.activation,
        JSON.stringify(activation)
      );
    }

    return record;
  }

  function getDeclaredCommune(){

    const saved =
      getLocalStorageItem(
        STORAGE.commune
      );

    const record =
      saved
        ? safeParse(saved, null)
        : null;

    return record &&
      record.commune
        ? normalizeText(
            record.commune
          )
        : "";
  }

  /* =====================================================
     STATISTIQUES ANONYMES
     ===================================================== */

  function loadStatisticsQueue(){

    const saved =
      getLocalStorageItem(
        STORAGE.statistics
      );

    const queue =
      saved
        ? safeParse(saved, [])
        : [];

    return Array.isArray(queue)
      ? queue
      : [];
  }

  function saveStatisticsQueue(queue){

    const safeQueue =
      Array.isArray(queue)
        ? queue.slice(
            -MAX_STATISTICS
          )
        : [];

    setLocalStorageItem(
      STORAGE.statistics,
      JSON.stringify(safeQueue)
    );

    return safeQueue;
  }

  function sanitizeStatistic(data){

    const source =
      data &&
      typeof data === "object"
        ? data
        : {};

    return {
      statisticId:
        createUniqueId(
          "bociteart-stat"
        ),

      installationId:
        getInstallationId(),

      type:
        normalizeText(
          source.type ||
          "information"
        ),

      category:
        normalizeCategory(
          source.category ||
          source.profile ||
          getDeclaredProfile()
        ) || null,

      commune:
        normalizeText(
          source.commune ||
          getDeclaredCommune()
        ) || null,

      sector:
        normalizeText(
          source.sector ||
          source.secteur
        ) || null,

      date:
        new Date().toISOString(),

      sent:false
    };
  }

  function addStatistic(data){

    const statistic =
      sanitizeStatistic(data);

    const queue =
      loadStatisticsQueue();

    queue.push(
      statistic
    );

    saveStatisticsQueue(
      queue
    );

    return statistic;
  }

  function getStatistics(){

    return loadStatisticsQueue();
  }

  function getPendingStatistics(){

    return loadStatisticsQueue()
      .filter(function(statistic){

        return statistic.sent !== true;
      });
  }

  function markStatisticsAsSent(
    statisticIds
  ){

    const ids =
      Array.isArray(statisticIds)
        ? statisticIds
        : [];

    const queue =
      loadStatisticsQueue()
        .map(function(statistic){

          if(
            ids.includes(
              statistic.statisticId
            )
          ){

            return Object.assign(
              {},
              statistic,
              {
                sent:true,
                sentAt:
                  new Date()
                    .toISOString()
              }
            );
          }

          return statistic;
        });

    return saveStatisticsQueue(
      queue
    );
  }

  function clearStatistics(){

    saveStatisticsQueue([]);

    return true;
  }

  /* =====================================================
     COMPTE LOCAL
     ===================================================== */

 function sanitizeAccount(data){

  const source =
    data &&
    typeof data === "object"
      ? data
      : {};

  const category =
    normalizeCategory(
      source.category ||
      source.profile
    );

  return {

    accountId:
      source.accountId ||
      createUniqueId(
        "bociteart-account"
      ),

    displayName:
      normalizeText(
        source.displayName
      ),

    email:
      normalizeEmail(
        source.email
      ),

    phone:
      normalizePhone(
        source.phone
      ),

    category:
      category,

    isProfessional:
      isProfessionalCategory(
        category
      ),

    commune:
      normalizeText(
        source.commune
      ),

  securityConfigured:
  Boolean(
    source.securityConfigured
  ),

professionalSecurityConfigured:
  Boolean(
    source.professionalSecurityConfigured
  ),
    createdAt:
      source.createdAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),

    version:
      "2"
  };
}

function createAccount(data){

  const account =
    sanitizeAccount(
      data
    );


  /*
    Enregistrement du compte.

    IMPORTANT :
    l'inscription n'est pas encore déclarée
    totalement terminée ici.

    Elle le sera seulement après
    la sécurisation du compte.
  */

  setLocalStorageItem(
    STORAGE.account,
    JSON.stringify(
      account
    )
  );


  saveDeclaredProfile(
    account.category
  );


  saveDeclaredCommune(
    account.commune
  );


  activateInstallation({
    category:
      account.category,

    commune:
      account.commune
  });


  /*
    Pour une organisation :
    la personne qui crée le compte
    devient automatiquement
    Responsable principal.
  */

  if(
    isOrganizationCategory(
      account.category
    )
  ){

    ensureOrganizationForAccount(
      account
    );
  }

  addStatistic({
    type:
      "inscription_commencee",

    category:
      account.category,

    commune:
      account.commune
  });


  addSecurityLog(
    "account_created",
    {
      accountId:
        account.accountId,

      category:
        account.category,

      organization:
        isOrganizationCategory(
          account.category
        )
    }
  );


  return account;
}

  function updateAccount(data){

    const current =
      getAccount() || {};

    const updated =
      sanitizeAccount(
        Object.assign(
          {},
          current,
          data || {}
        )
      );

    setLocalStorageItem(
      STORAGE.account,
      JSON.stringify(updated)
    );

    return updated;
  }

  function getAccount(){

    const saved =
      getLocalStorageItem(
        STORAGE.account
      );

    return saved
      ? safeParse(saved, null)
      : null;
  }

  function registrationCompleted(){

    return (
      getLocalStorageItem(
        STORAGE.registration
      ) === "true"
    );
  }

function clearAccount(){

  /*
    Suppression complète des données
    liées au compte présent sur cet appareil.

    On conserve volontairement :
    - l'identifiant d'installation ;
    - les statistiques anonymes.

    Tout ce qui concerne l'identité,
    la sécurité et les accès est supprimé.
  */

  removeLocalStorageItem(
    STORAGE.account
  );

  removeLocalStorageItem(
    STORAGE.registration
  );

  removeLocalStorageItem(
    STORAGE.profile
  );

  removeLocalStorageItem(
    STORAGE.commune
  );

  removeLocalStorageItem(
    STORAGE.security
  );

  removeLocalStorageItem(
    STORAGE.verification
  );

  removeLocalStorageItem(
    STORAGE.organization
  );

  removeLocalStorageItem(
    STORAGE.collaborators
  );

  removeLocalStorageItem(
    STORAGE.sessions
  );

  removeLocalStorageItem(
    STORAGE.securityLog
  );

  return true;
}

  /* =====================================================
     CONTENU DE LA PAGE
     ===================================================== */

  function getRegistrationHtml(){

    const account =
      getAccount() || {};

    const savedProfile =
      account.category ||
      getDeclaredProfile();

    const savedCommune =
      account.commune ||
      getDeclaredCommune();

    return `
      <div id="bociteRegistrationCard">

        <h2 class="bociteRegistrationTitle">

          Je crée mon compte

          <br>

          ${getLogoHtml()}

        </h2>

        <div class="bociteRegistrationIntro">

         Quelques informations suffisent
         pour personnaliser votre accès.

        </div>

        <div class="bociteRegistrationForm">

          <div class="bociteRegistrationField">

            <label for="bociteRegistrationName">
              Mon nom, prénom ou pseudonyme
            </label>

            <input
              id="bociteRegistrationName"
              type="text"
              autocomplete="name"
              value="${account.displayName || ""}"
              placeholder="Exemple : Jean-Michel">

            <div class="bociteRegistrationHelp">

             Ce nom sera affiché
             dans votre espace.

            </div>

          </div>

          <div class="bociteRegistrationField">

            <label for="bociteRegistrationEmail">
              Adresse électronique
            </label>

            <input
              id="bociteRegistrationEmail"
              type="email"
              autocomplete="email"
              value="${account.email || ""}"
              placeholder="exemple@adresse.fr">
              <div class="bociteRegistrationHelp">

              Elle vous permet de retrouver
              plus facilement votre compte.

</div>

          </div>

<div
  id="bociteRegistrationProfessionalPhoneWrap"
  class="bociteRegistrationField">

  <label for="bociteRegistrationPhone">
    Numéro de téléphone 
  </label>

  <input
    id="bociteRegistrationPhone"
    type="tel"
    autocomplete="tel"
    value="${account.phone || ""}"
    placeholder="Exemple : 06 12 34 56 78">

 <div class="bociteRegistrationHelp">

  Facultatif pour un citoyen.
  Il permet de recevoir un code
  de vérification ou de récupération.

  Pour un compte professionnel
  ou une organisation, il est demandé
  comme moyen de sécurité supplémentaire.

</div>

</div>

          <div class="bociteRegistrationField">

            <label for="bociteRegistrationCategory">
              Je suis
            </label>

            <select id="bociteRegistrationCategory">

              <option value="">
                Choisissez votre catégorie
              </option>

              <option value="jeune">
                Jeune ou mineur
              </option>

              <option value="citoyen">
                Citoyen majeur
              </option>

              <option value="commerce">
                Commerçant
              </option>

              <option value="entreprise">
                Entreprise
              </option>

              <option value="association">
                Association
              </option>

              <option value="sport">
                Club sportif
              </option>

              <option value="ecole">
                École ou milieu scolaire
              </option>

              <option value="mairie">
                Mairie ou collectivité
              </option>

            </select>

          </div>

          <div class="bociteRegistrationField">

            <label for="bociteRegistrationCommune">
              Ma commune
            </label>

            <input
              id="bociteRegistrationCommune"
              type="text"
              autocomplete="address-level2"
              value="${savedCommune || ""}"
              placeholder="Exemple : Wattignies">

          </div>

        </div>

        <div
          id="bociteRegistrationMessage"
          role="alert">

          Complétez tous les champs
          avant de continuer.

        </div>

        <button
          id="bociteRegistrationContinueBtn"
          type="button">

          Continuer

        </button>

       <div class="bociteRegistrationPrivacy">

  Les statistiques anonymes
  ne contiennent ni votre nom
  ni votre adresse électronique.

  <br><br>

  Elles distinguent uniquement
  l'activation,
  la catégorie d'utilisateur déclarée
  et la commune afin de produire
  des bilans anonymes.

</div>

        </div>
        
    `;
  }

  /* =====================================================
     OUVERTURE ET FERMETURE
     ===================================================== */

  function closeRegistration(){

    const overlay =
      getElement(
        OVERLAY_ID
      );

    if(overlay){
      overlay.remove();
    }
  }

  function openRegistration(){

    installStyles();
    closeRegistration();

    const overlay =
      document.createElement("div");

    overlay.id =
      OVERLAY_ID;

    overlay.innerHTML =
      getRegistrationHtml();

    document.body.appendChild(
      overlay
    );

    const category =
      getElement(
        "bociteRegistrationCategory"
      );
  
    const account =
      getAccount() || {};

    const savedProfile =
      account.category ||
      getDeclaredProfile();

    if(
      category &&
      savedProfile
    ){

      category.value =
        savedProfile;
    }

    bindRegistration();

    overlay.scrollTop = 0;
  }

  /* =====================================================
     VALIDATION DE L'ÉTAPE
     ===================================================== */

/* =====================================================
   FIN D'INSCRIPTION COMMUNE
   ===================================================== */

function finishRegistration(
  account
){

  if(!account){
    return;
  }

  setLocalStorageItem(
    STORAGE.registration,
    "true"
  );


  addStatistic({
    type:
      "inscription_terminee",

    category:
      account.category,

    commune:
      account.commune
  });


  addSecurityLog(
    "registration_completed",
    {
      accountId:
        account.accountId,

      category:
        account.category
    }
  );


  closeRegistration();


  document.dispatchEvent(
    new CustomEvent(
      "bociteart:registration-completed",
      {
        detail:{
          accountId:
            account.accountId,

          category:
            account.category,

          commune:
            account.commune,

         securityConfigured:
  account.category === "jeune"
    ? false
    : true
        }
      }
    )
  );
}

/* =========================================================
   ÇA COMMENCE ICI
   COMPTE PERSONNEL — SÉCURISATION SANS CODE DE RÔLE
   ========================================================= */

function openAccountSecuritySetup(
  account
){

  if(!account){
    return;
  }


  let emailCode=
    "";

  let smsCode=
    "";


  saveAccountSecurity({

    accountId:
      account.accountId,

    activated:
      false,

    passwordConfigured:
      false,

    /*
      Aucun code d'activation de rôle
      n'est demandé pour créer
      le profil personnel Bo'CitéArt.

      Les codes Président, Direction,
      collaborateur, etc.
      sont gérés uniquement
      dans les espaces concernés.
    */

    activationCodeHash:
      "",

    email:
      account.email ||
      "",

    phone:
      account.phone ||
      "",

    createdAt:
      new Date()
        .toISOString()

  });


  const overlay=
    getElement(
      OVERLAY_ID
    );


  if(!overlay){
    return;
  }


  const emailHtml=
    account.email
      ? `

          <button
            id="bociteSecurityEmailBtn"
            type="button"
            class="choiceBtn"
            style="
              width:100%;
              margin-top:10px;
            "
          >
            Vérifier mon adresse e-mail
          </button>

          <div
            id="bociteSecurityEmailWrap"
            class="bociteRegistrationField"
            style="display:none;"
          >

            <label for="bociteSecurityEmailCode">
              Code reçu par e-mail
            </label>

            <input
              id="bociteSecurityEmailCode"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              placeholder="6 chiffres"
            >

          </div>

        `
      : "";


  const smsHtml=
    account.phone
      ? `

          <button
            id="bociteSecuritySmsBtn"
            type="button"
            class="choiceBtn"
            style="
              width:100%;
              margin-top:8px;
            "
          >
            Vérifier mon téléphone
          </button>

          <div
            id="bociteSecuritySmsWrap"
            class="bociteRegistrationField"
            style="display:none;"
          >

            <label for="bociteSecuritySmsCode">
              Code reçu par SMS
            </label>

            <input
              id="bociteSecuritySmsCode"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              placeholder="6 chiffres"
            >

          </div>

        `
      : "";


  overlay.innerHTML=`

    <div id="bociteRegistrationCard">

      <h2 class="bociteRegistrationTitle">

        Sécurisez votre compte

        <br>

        ${getLogoHtml()}

      </h2>


      <div class="bociteRegistrationIntro">

        Votre profil personnel
        vous permet d’être reconnu
        dans ${getLogoHtml()}
        sans avoir à recommencer
        votre identification
        dans chaque espace.

      </div>


      <div class="bociteRegistrationPrivacy">

        <strong>
          Votre profil personnel
        </strong>

        <br><br>

        Aucun code spécial Président,
        Direction, commerce,
        entreprise, association
        ou club sportif
        n’est nécessaire ici.

        <br><br>

        Les autorisations particulières
        seront vérifiées uniquement
        lorsque vous demanderez
        l’accès à une fonction protégée.

      </div>


      <div class="bociteRegistrationField">

        <label for="bociteSecurityPassword">
          Créez votre mot de passe
        </label>

        <input
          id="bociteSecurityPassword"
          type="password"
          autocomplete="new-password"
          placeholder="Votre mot de passe"
        >

        <div class="bociteRegistrationHelp">

          Utilisez un mot de passe personnel
          que vous n’utilisez pas ailleurs.

        </div>

      </div>


      <div class="bociteRegistrationField">

        <label for="bociteSecurityPasswordConfirm">
          Confirmez votre mot de passe
        </label>

        <input
          id="bociteSecurityPasswordConfirm"
          type="password"
          autocomplete="new-password"
          placeholder="Confirmez votre mot de passe"
        >

      </div>


      <div class="bociteRegistrationPrivacy">

        <strong>
          Vérification et récupération
        </strong>

        <br><br>

        Vérifiez au moins
        votre adresse e-mail
        ou votre téléphone.

        <br><br>

        Ces coordonnées permettront également
        de sécuriser une future procédure
        de récupération de votre compte.

        <br><br>

        ${getLogoHtml()}
        ne peut jamais vous communiquer
        votre mot de passe actuel.

      </div>


      ${emailHtml}

      ${smsHtml}


      <div class="bociteRegistrationPrivacy">

        <strong>
          Sécurité renforcée
        </strong>

        <br><br>

        Le compte est préparé
        pour accueillir ensuite,
        selon l’appareil utilisé :

        <br><br>

        • double authentification
        <br>
        • passkey
        <br>
        • empreinte
        <br>
        • reconnaissance faciale
        <br>
        • Windows Hello
        <br>
        • clé de sécurité

      </div>


      <div
        id="bociteSecurityMessage"
        role="alert"
        style="
          display:none;
          margin-top:14px;
          padding:13px;
          border-left:6px solid #b00020;
          background:#f7f3ea;
          color:#111;
          font-size:14px;
          font-weight:400;
          line-height:1.45;
        "
      ></div>


      <button
        id="bociteSecurityValidateBtn"
        type="button"
        style="
          display:block;
          width:100%;
          margin-top:16px;
          padding:15px 12px;
          border:2px solid #2f5d46;
          border-radius:10px;
          background:#ffffff;
          color:#2f5d46;
          font-size:16px;
          font-weight:700;
          cursor:pointer;
        "
      >
        Enregistrer et ouvrir mon profil
      </button>

    </div>

  `;


  /* =====================================================
     VÉRIFICATION E-MAIL
     ===================================================== */

  const emailBtn=
    getElement(
      "bociteSecurityEmailBtn"
    );


  if(emailBtn){

    emailBtn.onclick=
      function(){

        emailCode=
          createNumericCode(
            6
          );


        const wrap=
          getElement(
            "bociteSecurityEmailWrap"
          );


        if(wrap){

          wrap.style.display=
            "block";
        }


        /*
          PRÉSENTATION ACTUELLE UNIQUEMENT.

          En production :
          le code sera transmis
          côté serveur.
        */

        alert(
          "Code e-mail pour le test : " +
          emailCode
        );
      };
  }


  /* =====================================================
     VÉRIFICATION SMS
     ===================================================== */

  const smsBtn=
    getElement(
      "bociteSecuritySmsBtn"
    );


  if(smsBtn){

    smsBtn.onclick=
      function(){

        smsCode=
          createNumericCode(
            6
          );


        const wrap=
          getElement(
            "bociteSecuritySmsWrap"
          );


        if(wrap){

          wrap.style.display=
            "block";
        }


        /*
          PRÉSENTATION ACTUELLE UNIQUEMENT.

          En production :
          le code sera transmis
          côté serveur.
        */

        alert(
          "Code SMS pour le test : " +
          smsCode
        );
      };
  }


  /* =====================================================
     VALIDATION DU PROFIL
     ===================================================== */

  const validate=
    getElement(
      "bociteSecurityValidateBtn"
    );


  if(validate){

    validate.onclick=
      function(){

        const password=
          String(
            getElement(
              "bociteSecurityPassword"
            )?.value ||
            ""
          );


        const confirmation=
          String(
            getElement(
              "bociteSecurityPasswordConfirm"
            )?.value ||
            ""
          );


        const enteredEmailCode=
          normalizeText(
            getElement(
              "bociteSecurityEmailCode"
            )?.value
          );


        const enteredSmsCode=
          normalizeText(
            getElement(
              "bociteSecuritySmsCode"
            )?.value
          );


        const message=
          getElement(
            "bociteSecurityMessage"
          );


        if(
          !password ||
          !confirmation
        ){

          if(message){

            message.textContent=
              "Créez et confirmez votre mot de passe.";

            message.style.display=
              "block";
          }

          return;
        }


        if(
          password.length <
          10
        ){

          if(message){

            message.textContent=
              "Choisissez un mot de passe d’au moins 10 caractères.";

            message.style.display=
              "block";
          }

          return;
        }


        if(
          password !==
          confirmation
        ){

          if(message){

            message.textContent=
              "Les deux mots de passe ne correspondent pas.";

            message.style.display=
              "block";
          }

          return;
        }


        const emailVerified=
          Boolean(
            emailCode &&
            enteredEmailCode ===
              emailCode
          );


        const phoneVerified=
          Boolean(
            smsCode &&
            enteredSmsCode ===
              smsCode
          );


        if(
          !emailVerified &&
          !phoneVerified
        ){

          if(message){

            message.textContent=
              "Vérifiez au moins votre e-mail ou votre téléphone avant de continuer.";

            message.style.display=
              "block";
          }

          return;
        }


        hashSecret(
          password
        )
        .then(
          function(
            passwordHash
          ){

            saveAccountVerification({

              accountId:
                account.accountId,

              emailVerified:
                emailVerified,

              phoneVerified:
                phoneVerified,

              verifiedAt:
                new Date()
                  .toISOString()

            });


            saveAccountSecurity({

              accountId:
                account.accountId,

              activated:
                true,

              passwordConfigured:
                true,

              passwordHash:
                passwordHash,

              activationCodeHash:
                "",

              email:
                account.email ||
                "",

              phone:
                account.phone ||
                "",

              emailRecovery:
                emailVerified,

              smsRecovery:
                phoneVerified,

              twoFactorPrepared:
                true,

              passkeyAvailable:
                passkeyAvailable(),

              activatedAt:
                new Date()
                  .toISOString()

            });


            const updatedAccount=
              updateAccount({

                securityConfigured:
                  true,

                /*
                  Important :
                  un profil personnel identifié
                  ne devient jamais automatiquement
                  responsable d’une organisation.
                */

                professionalSecurityConfigured:
                  false

              });

                      addSecurityLog(
              "account_security_configured",
              {

                accountId:
                  updatedAccount.accountId,

                emailVerified:
                  emailVerified,

                phoneVerified:
                  phoneVerified
              }
            );


            /*
              Le compte personnel est maintenant
              correctement sécurisé.

              Pour une organisation,
              on termine d'abord l'inscription
              puis on ouvre sa fiche
              d'identification.
            */

            if(
              isOrganizationCategory(
                updatedAccount.category
              )
            ){

              finishRegistration(
                updatedAccount
              );


              setTimeout(
                function(){

                  openOrganizationProfileForm();

                },
                100
              );


              return;
            }


            /*
              Citoyen et autres profils personnels :
              fin normale de l'inscription.
            */

            finishRegistration(
              updatedAccount
            );
          }
        )
        .catch(
          function(error){

            console.error(
              "Bo'CitéArt : sécurisation impossible.",
              error
            );


            if(message){

              message.textContent=
                "La sécurisation du compte n’a pas pu être terminée.";

              message.style.display=
                "block";
            }
          }
        );

      };
  }

}
  
 /* =========================================================
   ÇA COMMENCE ICI
   INSCRIPTION — JEUNE SANS BARRIÈRE DE SÉCURISATION
   ========================================================= */

function completeRegistration(){

  const nameField =
    getElement(
      "bociteRegistrationName"
    );

  const emailField =
    getElement(
      "bociteRegistrationEmail"
    );

  const categoryField =
    getElement(
      "bociteRegistrationCategory"
    );

  const communeField =
    getElement(
      "bociteRegistrationCommune"
    );

  const phoneField =
    getElement(
      "bociteRegistrationPhone"
    );

  const message =
    getElement(
      "bociteRegistrationMessage"
    );


  const displayName =
    normalizeText(
      nameField
        ? nameField.value
        : ""
    );


  const email =
    normalizeEmail(
      emailField
        ? emailField.value
        : ""
    );


  const category =
    normalizeCategory(
      categoryField
        ? categoryField.value
        : ""
    );


  const commune =
    normalizeText(
      communeField
        ? communeField.value
        : ""
    );


  const phone =
    normalizePhone(
      phoneField
        ? phoneField.value
        : ""
    );


  const isYoung =
    category === "jeune";


  /*
    Nom + catégorie + commune :
    nécessaires pour tous.

    E-mail :
    non obligatoire pour le jeune.

    Téléphone :
    obligatoire uniquement
    pour les profils professionnels concernés.
  */

  if(
    !displayName ||
    !category ||
    !commune ||
    (
      !isYoung &&
      !email
    ) ||
    (
      isProfessionalCategory(
        category
      ) &&
      !phone
    )
  ){

    if(message){

      message.textContent =
        "Complétez les informations nécessaires avant de continuer.";

      message.style.display =
        "block";

    }

    return;

  }


  /*
    Si une adresse e-mail est fournie,
    elle doit être valide.
  */

  if(
    email &&
    (
      !email.includes("@") ||
      !email.includes(".")
    )
  ){

    if(message){

      message.textContent =
        "Indiquez une adresse électronique valide.";

      message.style.display =
        "block";

    }

    return;

  }


  const account =
    createAccount({

      displayName:
        displayName,

      email:
        email,

      phone:
        phone,

      category:
        category,

      commune:
        commune

    });


  /*
    MOINS DE 15 ANS

    Pas d'écran :
    mot de passe,
    code e-mail,
    code SMS.

    Le parcours continue directement.
  */

  if(isYoung){

    finishRegistration(
      account
    );

    return;

  }


  /*
    Tous les autres profils
    conservent la sécurisation normale.
  */

  openAccountSecuritySetup(
    account
  );

}

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
     
  /* =====================================================
     ÉVÉNEMENTS
     ===================================================== */

  function bindRegistration(){

    const button =
      getElement(
        "bociteRegistrationContinueBtn"
      );

    if(button){

      button.onclick =
        completeRegistration;
    }
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BoCiteArtRegistration = {
    open:
      openRegistration,

    show:
      openRegistration,

    close:
      closeRegistration,

    createAccount:
      createAccount,

    updateAccount:
      updateAccount,

    getAccount:
      getAccount,

    clearAccount:
      clearAccount,

    registrationCompleted:
      registrationCompleted,

    createInstallationId:
      createInstallationId,

    getInstallationId:
      getInstallationId,

    activateInstallation:
      activateInstallation,

    getActivation:
      getActivation,

    hasActivation:
      hasActivation,

    saveDeclaredProfile:
      saveDeclaredProfile,

    getDeclaredProfile:
      getDeclaredProfile,

    saveDeclaredCommune:
      saveDeclaredCommune,

    getDeclaredCommune:
      getDeclaredCommune,

    addStatistic:
      addStatistic,

    getStatistics:
      getStatistics,

    getPendingStatistics:
      getPendingStatistics,

    markStatisticsAsSent:
      markStatisticsAsSent,

    clearStatistics:
      clearStatistics,

securityReady:
  accountSecurityReady,

getSecurity:
  getAccountSecurity,

getVerification:
  getAccountVerification,

getSecurityCapabilities:
  getSecurityCapabilities,

getOrganization:
  getOrganization,

isOrganizationOwner:
  isOrganizationOwner,

getOwnerAccess:
  getOwnerAccess,

    getOrganizationValidationRequirements:
  getOrganizationValidationRequirements,

checkOrganizationValidation:
  checkOrganizationValidation,

getOrganizationValidationState:
  getOrganizationValidationState, 

getCollaborators:
  loadCollaborators,

getActiveCollaborators:
  getActiveCollaborators,

getCollaboratorById:
  getCollaboratorById,

createCollaboratorAccess:
  createCollaboratorAccess,

acceptCollaboratorInvitation:
  acceptCollaboratorInvitation,

updateCollaboratorAccess:
  updateCollaboratorAccess,

revokeCollaboratorAccess:
  revokeCollaboratorAccess,

restoreCollaboratorAccess:
  restoreCollaboratorAccess,

deleteCollaborator:
  permanentlyDeleteCollaborator,

hasAccessPermission:
  hasAccessPermission,

collaboratorHasPermission:
  collaboratorHasPermission,

getSecurityLog:
  loadSecurityLog,

revokeCollaboratorSessions:
  revokeCollaboratorSessions,

accessRoles:
  ACCESS_ROLES,

accessPermissions:
  ACCESS_PERMISSIONS,

     getCurrentAccessContext:
  getCurrentAccessContext,

canAccess:
  canAccess,

requireAccess:
  requireAccess,

storageKeys:
  Object.assign(
    {},
    STORAGE
  )
};

  getInstallationId();

  console.log(
    "✅ Étape création du compte Bo'CitéArt V6 prête"
  );

})();
