
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
   → le compte local ;
   → la sécurisation du compte ;
   → les organisations ;
   → les collaborateurs ;
   → les statistiques anonymes.

   Ce fichier ne décide jamais lui-même
   de la page suivante.
   ========================================================= */

(function initBociteartRegistration(){

  "use strict";


/* =========================================================
   CONSTANTES
   ========================================================= */

const OVERLAY_ID =
  "bociteRegistrationOverlay";


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
  500;


const MAX_SECURITY_LOG =
  500;


const ACCOUNT_SECURITY_VERSION =
  "3";


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


const ORGANIZATION_CATEGORIES = [

  "commerce",
  "entreprise",
  "association",
  "sport",
  "ecole",
  "mairie"

];


/* =========================================================
   RÔLES
   ========================================================= */

const ACCESS_ROLES = {

  owner: {
    label:
      "Responsable principal",

    permissions:[
      "all"
    ]
  },


  administrator: {
    label:
      "Administrateur",

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


  communication: {
    label:
      "Communication",

    permissions:[
      "profile",
      "messages",
      "publications",
      "directory"
    ]
  },


  employment: {
    label:
      "Emploi",

    permissions:[
      "employment",
      "directory"
    ]
  },


  finance: {
    label:
      "Finance",

    permissions:[
      "billing"
    ]
  },


  sport: {
    label:
      "Sport",

    permissions:[
      "sport",
      "messages",
      "publications"
    ]
  },


  custom: {
    label:
      "Accès personnalisé",

    permissions:[]
  }

};


const ACCESS_PERMISSIONS = {

  profile:
    "Profil",

  messages:
    "Messages",

  publications:
    "Publications",

  bocitecoins:
    "Bocitecoins",

  employment:
    "Emploi",

  directory:
    "Annuaire",

  sport:
    "Sport",

  billing:
    "Facturation",

  collaborators:
    "Collaborateurs"

};


/* =========================================================
   OUTILS GÉNÉRAUX
   ========================================================= */

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
    value ||
    ""
  ).trim();
}


function normalizeEmail(
  value
){

  return normalizeText(
    value
  ).toLowerCase();
}


function normalizePhone(
  value
){

  return normalizeText(
    value
  )
  .replace(
    /[^\d+]/g,
    ""
  );
}


function safeParse(
  value,
  fallback
){

  try{

    return JSON.parse(
      value
    );

  }catch(error){

    return fallback;
  }
}


function createUniqueId(
  prefix
){

  return (
    String(
      prefix ||
      "bociteart"
    ) +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2,10)
  );
}


function createNumericCode(
  length
){

  const size =
    Math.max(
      4,
      Number(length) ||
      6
    );


  let code =
    "";


  for(
    let index = 0;
    index < size;
    index += 1
  ){

    code +=
      String(
        Math.floor(
          Math.random() * 10
        )
      );
  }


  return code;
}


/* =========================================================
   STOCKAGE LOCAL
   ========================================================= */

function getLocalStorageItem(
  key
){

  try{

    return localStorage.getItem(
      key
    );

  }catch(error){

    console.error(
      "Bo'CitéArt : lecture locale impossible.",
      error
    );

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

    console.error(
      "Bo'CitéArt : enregistrement local impossible.",
      error
    );

    return false;
  }
}


function removeLocalStorageItem(
  key
){

  try{

    localStorage.removeItem(
      key
    );

    return true;

  }catch(error){

    console.error(
      "Bo'CitéArt : suppression locale impossible.",
      error
    );

    return false;
  }
}


/* =========================================================
   CATÉGORIES
   ========================================================= */

function normalizeCategory(
  category
){

  const normalized =
    normalizeText(
      category
    )
    .toLowerCase();


  const aliases = {

    citoyenne:
      "citoyen",

    citoyen:
      "citoyen",

    jeune:
      "jeune",

    commerce:
      "commerce",

    commercant:
      "commerce",

    commerçant:
      "commerce",

    entreprise:
      "entreprise",

    association:
      "association",

    sport:
      "sport",

    club:
      "sport",

    ecole:
      "ecole",

    école:
      "ecole",

    scolaire:
      "ecole",

    mairie:
      "mairie",

    commune:
      "mairie"

  };


  const value =
    aliases[normalized] ||
    normalized;


  return ALLOWED_CATEGORIES
    .includes(value)
      ? value
      : "";
}


function isOrganizationCategory(
  category
){

  return ORGANIZATION_CATEGORIES
    .includes(
      normalizeCategory(
        category
      )
    );
}


function isProfessionalCategory(
  category
){

  return isOrganizationCategory(
    category
  );
}


/* =========================================================
   IDENTIFIANT D'INSTALLATION
   ========================================================= */

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


/* =========================================================
   ACTIVATION
   ========================================================= */

function activateInstallation(
  data
){

  const source =
    data &&
    typeof data ===
      "object"
      ? data
      : {};


  const activation = {

    installationId:
      getInstallationId(),

    activated:
      true,

    category:
      normalizeCategory(
        source.category
      ),

    commune:
      normalizeText(
        source.commune
      ),

    activatedAt:
      new Date().toISOString(),

    version:
      "2"
  };


  setLocalStorageItem(
    STORAGE.activation,
    JSON.stringify(
      activation
    )
  );


  return activation;
}


function getActivation(){

  const saved =
    getLocalStorageItem(
      STORAGE.activation
    );


  return saved
    ? safeParse(
        saved,
        null
      )
    : null;
}


function hasActivation(){

  const activation =
    getActivation();


  return Boolean(
    activation &&
    activation.activated ===
      true
  );
}


/* =========================================================
   PROFIL ET COMMUNE DÉCLARÉS
   ========================================================= */

function saveDeclaredProfile(
  profile
){

  const category =
    normalizeCategory(
      profile
    );


  if(!category){
    return false;
  }


  setLocalStorageItem(
    STORAGE.profile,
    category
  );


  return true;
}


function getDeclaredProfile(){

  return normalizeCategory(
    getLocalStorageItem(
      STORAGE.profile
    )
  );
}


function saveDeclaredCommune(
  commune
){

  const value =
    normalizeText(
      commune
    );


  if(!value){
    return false;
  }


  setLocalStorageItem(
    STORAGE.commune,
    value
  );


  return true;
}


function getDeclaredCommune(){

  return normalizeText(
    getLocalStorageItem(
      STORAGE.commune
    )
  );
}


/* =========================================================
   STATISTIQUES
   ========================================================= */

function getStatistics(){

  const saved =
    getLocalStorageItem(
      STORAGE.statistics
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


function addStatistic(
  data
){

  const rows =
    getStatistics();


  rows.push(
    Object.assign(
      {
        id:
          createUniqueId(
            "bociteart-stat"
          ),

        installationId:
          getInstallationId(),

        date:
          new Date().toISOString(),

        sent:
          false
      },
      data &&
      typeof data ===
        "object"
        ? data
        : {}
    )
  );


  setLocalStorageItem(
    STORAGE.statistics,
    JSON.stringify(
      rows.slice(
        -MAX_STATISTICS
      )
    )
  );


  return true;
}


function getPendingStatistics(){

  return getStatistics()
    .filter(
      function(item){

        return (
          item &&
          item.sent !==
            true
        );
      }
    );
}


function markStatisticsAsSent(
  ids
){

  const selected =
    new Set(
      Array.isArray(ids)
        ? ids.map(String)
        : []
    );


  const rows =
    getStatistics()
      .map(
        function(item){

          if(
            item &&
            selected.has(
              String(item.id)
            )
          ){

            return Object.assign(
              {},
              item,
              {
                sent:true,
                sentAt:
                  new Date()
                    .toISOString()
              }
            );
          }


          return item;
        }
      );


  setLocalStorageItem(
    STORAGE.statistics,
    JSON.stringify(rows)
  );


  return true;
}


function clearStatistics(){

  removeLocalStorageItem(
    STORAGE.statistics
  );


  return true;
}


/* =========================================================
   CRYPTOGRAPHIE LOCALE
   ========================================================= */

function hashSecret(
  value
){

  const text =
    String(
      value ||
      ""
    );


  if(
    window.crypto &&
    window.crypto.subtle &&
    window.TextEncoder
  ){

    const bytes =
      new TextEncoder()
        .encode(text);


    return window.crypto.subtle
      .digest(
        "SHA-256",
        bytes
      )
      .then(
        function(buffer){

          return Array.from(
            new Uint8Array(buffer)
          )
          .map(
            function(byte){

              return byte
                .toString(16)
                .padStart(
                  2,
                  "0"
                );
            }
          )
          .join("");
        }
      );
  }


  /*
    Repli local uniquement.
    Le raccordement officiel utilisera
    la sécurité du serveur.
  */

  let hash =
    0;


  for(
    let index = 0;
    index < text.length;
    index += 1
  ){

    hash =
      (
        (
          hash << 5
        ) -
        hash
      ) +
      text.charCodeAt(index);

    hash |=
      0;
  }


  return Promise.resolve(
    "local-" +
    Math.abs(hash)
  );
}


function verifySecret(
  value,
  expectedHash
){

  return hashSecret(
    value
  )
  .then(
    function(hash){

      return (
        String(hash) ===
        String(
          expectedHash ||
          ""
        )
      );
    }
  );
}


/* =========================================================
   SÉCURITÉ PRINCIPALE DU COMPTE
   ========================================================= */

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
    typeof data ===
      "object"
  )
    ? data
    : {};
}


function saveAccountSecurity(
  data
){

  const source =
    data &&
    typeof data ===
      "object"
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


function accountSecurityReady(){

  const security =
    getAccountSecurity();


  return Boolean(
    security &&
    security.activated === true &&
    security.passwordConfigured === true
  );
}


/* =========================================================
   VÉRIFICATION E-MAIL / TÉLÉPHONE
   ========================================================= */

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
    typeof data ===
      "object"
  )
    ? data
    : {};
}


function saveAccountVerification(
  data
){

  const source =
    data &&
    typeof data ===
      "object"
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


/* =========================================================
   ORGANISATION — STOCKAGE
   ========================================================= */

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
    typeof data ===
      "object"
  )
    ? data
    : {};
}


function saveOrganization(
  data
){

  const source =
    data &&
    typeof data ===
      "object"
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


/* =========================================================
   COLLABORATEURS — STOCKAGE
   ========================================================= */

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
    .find(
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
    ) ||
    null;
}


/* =========================================================
   JOURNAL DE SÉCURITÉ
   ========================================================= */

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
      typeof details ===
        "object"
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


  return true;
}


/* =========================================================
   SESSIONS
   ========================================================= */

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
    loadSessions();


  let changed =
    false;


  rows.forEach(
    function(session){

      if(
        session &&
        String(
          session.collaboratorId ||
          ""
        ) ===
        String(
          collaboratorId ||
          ""
        ) &&
        session.active ===
          true
      ){

        session.active =
          false;

        session.revokedAt =
          new Date().toISOString();

        changed =
          true;
      }
    }
  );


  if(changed){

    saveSessions(
      rows
    );
  }


  return changed;
}


/* =========================================================
   RÉVOCATION D'UN COLLABORATEUR
   ========================================================= */

function revokeCollaboratorAccess(
  collaboratorId
){

  const organization =
    getOrganization();

  const account =
    typeof getAccount ===
      "function"
      ? getAccount()
      : null;


  if(
    !organization ||
    !organization.organizationId ||
    !account ||
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
          ) &&
          String(
            item.organizationId ||
            ""
          ) ===
          String(
            organization.organizationId
          )
        );
      }
    );


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
    collaborators
  );


  revokeCollaboratorSessions(
    collaboratorId
  );


  addSecurityLog(
    "collaborator_access_revoked",
    {
      collaboratorId:
        collaborator.id,

      organizationId:
        organization.organizationId
    }
  );


  return true;
}


/* =========================================================
   PASSKEY / CAPACITÉS
   ========================================================= */

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


/* =========================================================
   INTERFACE D'INSCRIPTION — OUTILS
   ========================================================= */

function getLogoHtml(){

  return (
    '<span style="color:#2f5d46;font-weight:700;">Bo’Cité</span>' +
    '<span style="color:#a52a2a;font-weight:700;">Art</span>'
  );
}


function installStyles(){

  if(
    document.getElementById(
      "bociteRegistrationStyles"
    )
  ){
    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "bociteRegistrationStyles";


  style.textContent = `

    #${OVERLAY_ID}{
      position:fixed;
      inset:0;
      z-index:999999;
      overflow:auto;
      padding:24px 14px;
      box-sizing:border-box;
      background:#f7f3ea;
    }

    #bociteRegistrationCard{
      width:min(620px,100%);
      margin:0 auto;
      padding:22px;
      box-sizing:border-box;
      background:#ffffff;
      border:2px solid #2f5d46;
      border-radius:15px;
    }

    .bociteRegistrationTitle{
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:17px;
      font-weight:700;
      line-height:1.35;
      text-align:center;
    }

    .bociteRegistrationIntro,
    .bociteRegistrationPrivacy,
    .bociteRegistrationHelp{
      color:#111;
      font-size:14px;
      line-height:1.5;
    }

    .bociteRegistrationPrivacy{
      margin:14px 0;
      padding:14px;
      background:#f7f3ea;
      border-radius:10px;
    }

    .bociteRegistrationField{
      margin-top:13px;
    }

    .bociteRegistrationField label{
      display:block;
      margin-bottom:5px;
      color:#111;
      font-size:14px;
      font-weight:700;
    }

    .bociteRegistrationField input,
    .bociteRegistrationField select{
      width:100%;
      box-sizing:border-box;
      padding:11px 12px;
      border:2px solid #2f5d46;
      border-radius:9px;
      background:#fff;
      color:#111;
      font-size:14px;
    }

    #bociteRegistrationMessage{
      display:none;
      margin-top:14px;
      padding:13px;
      border-left:6px solid #b00020;
      background:#f7f3ea;
      color:#111;
      font-size:14px;
      line-height:1.45;
    }

    #bociteRegistrationContinueBtn,
    .choiceBtn{
      width:100%;
      margin-top:16px;
      padding:14px 12px;
      border:2px solid #2f5d46;
      border-radius:10px;
      background:#fff;
      color:#2f5d46;
      font-size:15px;
      font-weight:700;
      cursor:pointer;
    }

  `;


  document.head.appendChild(
    style
  );
}


/* =========================================================
   INTERFACE D'INSCRIPTION
   ========================================================= */

function getRegistrationHtml(){

  const savedCommune =
    getDeclaredCommune();


  return `

    <div id="bociteRegistrationCard">

      <h2 class="bociteRegistrationTitle">
        Je crée mon compte
        <br>
        ${getLogoHtml()}
      </h2>

      <div class="bociteRegistrationIntro">
        Votre compte permet de retrouver
        votre profil et les services
        correspondant à votre situation.
      </div>

      <div class="bociteRegistrationField">

        <label for="bociteRegistrationName">
          Nom et prénom
        </label>

        <input
          id="bociteRegistrationName"
          type="text"
          autocomplete="name"
          placeholder="Votre nom et prénom">

      </div>


      <div class="bociteRegistrationField">

        <label for="bociteRegistrationEmail">
          Adresse e-mail
        </label>

        <input
          id="bociteRegistrationEmail"
          type="email"
          autocomplete="email"
          placeholder="Votre adresse e-mail">

      </div>


      <div class="bociteRegistrationField">

        <label for="bociteRegistrationPhone">
          Téléphone
        </label>

        <input
          id="bociteRegistrationPhone"
          type="tel"
          autocomplete="tel"
          placeholder="Votre numéro de téléphone">

      </div>


      <div class="bociteRegistrationField">

        <label for="bociteRegistrationCategory">
          Je suis
        </label>

        <select
          id="bociteRegistrationCategory">

          <option value="">
            Sélectionnez votre profil
          </option>

          <option value="jeune">
            Jeune
          </option>

          <option value="citoyen">
            Citoyen
          </option>

          <option value="commerce">
            Commerce
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


      <div
        id="bociteRegistrationMessage"
        role="alert">

        Complétez les informations nécessaires
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


/* =========================================================
   OUVERTURE ET FERMETURE
   ========================================================= */

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
    document.createElement(
      "div"
    );


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
    typeof getAccount ===
      "function"
      ? (
          getAccount() ||
          {}
        )
      : {};


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

  overlay.scrollTop =
    0;
}


/* =========================================================
   LIAISON DU FORMULAIRE
   ========================================================= */

function bindRegistration(){

  const button =
    getElement(
      "bociteRegistrationContinueBtn"
    );


  if(!button){
    return;
  }


  button.onclick =
    function(){

      if(
        typeof completeRegistration ===
        "function"
      ){

        completeRegistration();
      }
    };
}

/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — ORGANISATIONS
   DOSSIER — VALIDATION — ACCÈS
   ========================================================= */


/* =========================================================
   RÔLES ET PERMISSIONS
   ========================================================= */

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
    return ["all"];
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


/* =========================================================
   CRÉATION DE L'ORGANISATION
   ========================================================= */

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

    /*
      Un compte différent ne reprend jamais
      silencieusement l'organisation précédente.
    */

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


  const now =
    new Date().toISOString();


  const organization = {

    organizationId:
      createUniqueId(
        "bociteart-organization"
      ),

    category:
      String(
        account.category ||
        ""
      ).trim().toLowerCase(),

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


    /* IDENTITÉ DE L'ORGANISATION */

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
        account.displayName ||
        "",

      responsibleAuthority:
        "",

      presidentOrLegalRepresentative:
        "",

      directionOrAuthorizedRepresentative:
        "",

      institutionalAuthority:
        "",

      email:
        account.email ||
        "",

      phone:
        account.phone ||
        ""
    },


    /*
      draft :
      organisation créée mais dossier
      pas encore transmis.
    */

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


    /*
      Contrôles réalisés par Bo'CitéArt.
      Ils sont séparés des informations
      déclarées par l'utilisateur.
    */

    validationChecks:
      {},

    validationChecksUpdatedAt:
      null,


    createdAt:
      now,

    updatedAt:
      now,

    version:
      "3"
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
        organization.category,

      validationStatus:
        organization.validationStatus
    }
  );


  return organization;
}


/* =========================================================
   RESPONSABLE PRINCIPAL
   ========================================================= */

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
      accountId ||
      ""
    )
  );
}

function getOwnerAccess(){

  const organization =
    getOrganization();


  if(
    !organization ||
    !organization.ownerAccountId
  ){
    return null;
  }


  /*
    L'organisation doit avoir été
    validée par Bo'CitéArt.
  */

  const organizationValidated =
    (
      organization.active === true &&
      organization.validationStatus ===
        "validated"
    );


  /*
    Le responsable doit également
    avoir utilisé son code initial
    à usage unique.
  */

  const professionalAccessReady =
    (
      organization.professionalAccessReady ===
        true
    );


  /*
    L'accès principal n'est ouvert
    que lorsque les deux conditions
    sont réunies.
  */

  const ownerAccessEnabled =
    (
      organizationValidated &&
      professionalAccessReady
    );


  return {

    accountId:
      organization.ownerAccountId,

    role:
      "owner",

    permissions:
      ownerAccessEnabled
        ? ["all"]
        : [],

    enabled:
      ownerAccessEnabled,

    organizationValidated:
      organizationValidated,

    professionalAccessReady:
      professionalAccessReady,

    validationStatus:
      organization.validationStatus ||
      "draft"
  };
}
   
/* =========================================================
   CHAMPS DU DOSSIER SELON L'ORGANISATION
   ========================================================= */

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
      name:"organizationName",
      label:"Nom de l'organisation",
      required:true
    },

    {
      name:"responsibleIdentity",
      label:"Nom et prénom du responsable",
      required:true
    },

    {
      name:"responsibleAuthority",
      label:"Qualité ou fonction du responsable",
      required:true
    },

    {
      name:"email",
      label:"Adresse e-mail",
      type:"email",
      required:true
    },

    {
      name:"phone",
      label:"Téléphone",
      type:"tel",
      required:true
    }
  ];


  const specific = {

    commerce: [

      {
        name:"siretOrSiren",
        label:"SIRET ou SIREN",
        required:true
      },

      {
        name:"establishmentAddress",
        label:"Adresse de l'établissement",
        required:true
      },

      {
        name:"businessActivity",
        label:"Activité du commerce",
        required:true
      }
    ],


    entreprise: [

      {
        name:"siretOrSiren",
        label:"SIRET ou SIREN",
        required:true
      },

      {
        name:"registeredAddress",
        label:"Adresse de l'entreprise",
        required:true
      },

      {
        name:"businessActivity",
        label:"Activité de l'entreprise",
        required:true
      }
    ],


    association: [

      {
        name:"associationIdentifier",
        label:"RNA, SIREN ou identifiant de l'association",
        required:true
      },

      {
        name:"registeredOffice",
        label:"Siège de l'association",
        required:true
      }
    ],


    sport: [

      {
        name:"clubIdentifier",
        label:"Identifiant ou affiliation du club",
        required:true
      },

      {
        name:"legalStructure",
        label:"Structure juridique du club",
        required:true
      },

      {
        name:"presidentOrLegalRepresentative",
        label:"Président ou responsable légal",
        required:true
      }
    ],


    ecole: [

      {
        name:"schoolIdentifier",
        label:"Nom ou identifiant de l'établissement",
        required:true
      },

      {
        name:"schoolAddress",
        label:"Adresse de l'établissement",
        required:true
      },

      {
        name:"directionOrAuthorizedRepresentative",
        label:"Direction ou responsable autorisé",
        required:true
      }
    ],


    mairie: [

      {
        name:"municipalityIdentifier",
        label:"Commune ou identifiant de la collectivité",
        required:true
      },

      {
        name:"institutionalAuthority",
        label:"Autorité ou service habilité",
        required:true
      }
    ]
  };


  if(
    !Object.prototype
      .hasOwnProperty
      .call(
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


/* =========================================================
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
    !Object.prototype
      .hasOwnProperty
      .call(
        requirements,
        type
      )
  ){

    return {

      ok:false,

      category:
        type,

      requirements:[],

      reason:
        "unsupported_organization_category"
    };
  }


  return {

    ok:true,

    category:
      type,

    requirements:
      requirements[type]
  };
}


/* =========================================================
   INFORMATIONS FOURNIES
   FOURNI ≠ CONTRÔLÉ ≠ VALIDÉ
   ========================================================= */

function getOrganizationProvidedInformation(
  organization
){

  const current =
    (
      organization &&
      typeof organization ===
        "object"
    )
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
      typeof current.organizationProfile ===
        "object"
    )
      ? current.organizationProfile
      : {};


  function provided(value){

    return (
      String(
        value ||
        ""
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


/* =========================================================
   COMPLÉTUDE DU DOSSIER
   ========================================================= */

function getOrganizationSubmissionState(
  organization
){

  const current =
    (
      organization &&
      typeof organization ===
        "object"
    )
      ? organization
      : getOrganization();


  if(
    !current ||
    !current.organizationId
  ){

    return {
      ok:false,
      complete:false,
      requirements:[],
      provided:{},
      missing:[],
      reason:"organization_not_found"
    };
  }


  const requirementsResult =
    getOrganizationValidationRequirements(
      current.category
    );


  if(
    !requirementsResult.ok
  ){

    return {
      ok:false,
      complete:false,
      requirements:[],
      provided:{},
      missing:[],
      reason:
        requirementsResult.reason
    };
  }


  const provided =
    getOrganizationProvidedInformation(
      current
    );


  const missing =
    requirementsResult.requirements
      .filter(
        function(requirement){

          return (
            provided[requirement] !==
            true
          );
        }
      );


  return {

    ok:true,

    complete:
      missing.length === 0,

    category:
      requirementsResult.category,

    requirements:
      requirementsResult.requirements,

    provided:
      provided,

    missing:
      missing
  };
}


/* =========================================================
   MISE À JOUR DU DOSSIER
   ========================================================= */

function updateOrganizationProfile(
  data
){

  const organization =
    getOrganization();

  const account =
    getAccount();


  if(
    !organization ||
    !organization.organizationId
  ){

    return {
      ok:false,
      reason:"organization_not_found"
    };
  }


  if(
    !account ||
    !account.accountId
  ){

    return {
      ok:false,
      reason:"account_not_found"
    };
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

    return {
      ok:false,
      reason:"owner_required"
    };
  }


  const source =
    (
      data &&
      typeof data ===
        "object"
    )
      ? data
      : {};


  const profile =
    (
      organization.organizationProfile &&
      typeof organization.organizationProfile ===
        "object"
    )
      ? {
          ...organization.organizationProfile
        }
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


  let changed =
    false;


  allowedFields.forEach(
    function(field){

      if(
        !Object.prototype
          .hasOwnProperty
          .call(
            source,
            field
          )
      ){
        return;
      }


      const nextValue =
        String(
          source[field] ||
          ""
        ).trim();


      const previousValue =
        String(
          profile[field] ||
          ""
        ).trim();


      if(
        nextValue !==
        previousValue
      ){
        changed = true;
      }


      profile[field] =
        nextValue;
    }
  );


  organization.organizationProfile =
    profile;


  if(
    profile.organizationName
  ){
    organization.name =
      profile.organizationName;
  }


  /*
    Toute modification réelle de l'identité
    annule une validation précédente.

    Aucun contrôle portant sur d'anciennes
    informations n'est conservé.
  */

   if(changed){

    /*
      Toute modification réelle du dossier
      suspend la validation précédente
      et referme l'accès professionnel
      jusqu'à une nouvelle validation Bo'CitéArt.

      L'identifiant professionnel permanent
      reste attaché à l'organisation.
    */

    organization.active =
      false;

    organization.validationStatus =
      "draft";

    organization.validationRequestedAt =
      null;

    organization.validationReviewedAt =
      null;

    organization.validationReviewedBy =
      null;

    organization.validationReason =
      "";

    organization.validationChecks =
      {};

    organization.validationChecksUpdatedAt =
      null;

    organization.initialAccessCodeHash =
      null;

    organization.initialAccessCodeIssuedAt =
      null;

    organization.initialAccessCodeUsedAt =
      null;

    organization.professionalAccessReady =
      false;
  }


  organization.updatedAt =
    new Date().toISOString();


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
        account.accountId,

      changed:
        changed,

      validationStatus:
        organization.validationStatus
    }
  );


  return {

    ok:true,

    changed:
      changed,

    organization:
      organization,

    profile:
      profile
  };
}
   
/* =========================================================
   TRANSMISSION DU DOSSIER
   ========================================================= */

function submitOrganizationForReview(){

  const organization =
    getOrganization();

  const account =
    getAccount();


  if(
    !organization ||
    !organization.organizationId
  ){

    return {
      ok:false,
      reason:"organization_not_found"
    };
  }


  if(
    !account ||
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
      ok:false,
      reason:"owner_required"
    };
  }


  const submission =
    getOrganizationSubmissionState(
      organization
    );


  if(
    !submission.ok ||
    !submission.complete
  ){

    organization.active =
      false;

    organization.validationStatus =
      "draft";

    organization.validationRequestedAt =
      null;

    organization.updatedAt =
      new Date().toISOString();


    saveOrganization(
      organization
    );


    return {

      ok:false,

      reason:
        "organization_profile_incomplete",

      missing:
        submission.missing ||
        []
    };
  }


  organization.active =
    false;

  organization.validationStatus =
    "pending_review";

  organization.validationRequestedAt =
    new Date().toISOString();

  organization.validationReviewedAt =
    null;

  organization.validationReviewedBy =
    null;

  organization.validationReason =
    "";

  organization.validationChecks =
    {};

  organization.validationChecksUpdatedAt =
    null;

  organization.updatedAt =
    new Date().toISOString();


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


  return {
    ok:true,
    organization:
      organization
  };
}


/* =========================================================
   CONTRÔLE DES INFORMATIONS PAR Bo'CitéArt
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
      ok:false,
      complete:false,
      reason:"organization_not_found",
      missing:[]
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
      ok:false,
      complete:false,
      reason:
        requirementsResult.reason,
      missing:[]
    };
  }


  const validationChecks =
    (
      checks &&
      typeof checks ===
        "object"
    )
      ? checks
      : {};


  const missing =
    requirementsResult.requirements
      .filter(
        function(requirement){

          return (
            validationChecks[
              requirement
            ] !== true
          );
        }
      );


  return {

    ok:true,

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
      ok:false,
      reason:"organization_not_found"
    };
  }


  if(
    organization.validationStatus !==
      "pending_review" &&
    organization.validationStatus !==
      "needs_information"
  ){

    return {
      ok:false,
      reason:"organization_not_under_review"
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
    !requirementsResult.requirements
      .includes(name)
  ){

    return {
      ok:false,
      reason:"invalid_validation_check"
    };
  }


  if(
    typeof value !==
    "boolean"
  ){

    return {
      ok:false,
      reason:"invalid_validation_check_value"
    };
  }


  const checks =
    (
      organization.validationChecks &&
      typeof organization.validationChecks ===
        "object"
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
        value
    }
  );


  return {
    ok:true,
    organization:
      organization
  };
}


/* =========================================================
   ÉTAT DE LA VALIDATION
   ========================================================= */

function getOrganizationValidationState(){

  const organization =
    getOrganization();


  if(
    !organization ||
    !organization.organizationId
  ){

    return {
      ok:false,
      reason:"organization_not_found"
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
      ok:false,
      reason:
        requirementsResult.reason
    };
  }


  const checks =
    (
      organization.validationChecks &&
      typeof organization.validationChecks ===
        "object"
    )
      ? organization.validationChecks
      : {};


  const validation =
    checkOrganizationValidation(
      organization,
      checks
    );


  return {

    ok:true,

    organizationId:
      organization.organizationId,

    category:
      organization.category,

    validationStatus:
      organization.validationStatus ||
      "draft",

    active:
      organization.active === true,

    requirements:
      requirementsResult.requirements,

    checks:
      checks,

    complete:
      validation.complete === true,

    missing:
      validation.missing ||
      [],

    validationChecksUpdatedAt:
      organization.validationChecksUpdatedAt ||
      null
  };
}

/* =========================================================
   ACCÈS PROFESSIONNEL APRÈS VALIDATION
   IDENTIFIANT + CODE INITIAL À USAGE UNIQUE
   ========================================================= */


/* =========================================================
   IDENTIFIANT PROFESSIONNEL
   ========================================================= */

function createProfessionalIdentifier(
  organization
){

  if(
    !organization ||
    !organization.organizationId
  ){
    return "";
  }


  /*
    L'identifiant professionnel reste
    définitivement rattaché à l'organisation.

    S'il existe déjà, il est conservé.
  */

  if(
    organization.professionalIdentifier
  ){

    return String(
      organization.professionalIdentifier
    );
  }


  const categoryCodes = {

    commerce:"COM",
    entreprise:"ENT",
    association:"ASS",
    sport:"SPO",
    ecole:"ECO",
    mairie:"MAI"

  };


  const categoryCode =
    categoryCodes[
      String(
        organization.category ||
        ""
      )
      .trim()
      .toLowerCase()
    ] ||
    "ORG";


  const year =
    new Date()
      .getFullYear();


  const source =
    String(
      organization.organizationId ||
      ""
    )
    .replace(
      /[^a-zA-Z0-9]/g,
      ""
    )
    .toUpperCase();


  const suffix =
    source.slice(-6) ||
    String(
      Date.now()
    ).slice(-6);


  return [
    "BCA",
    categoryCode,
    year,
    suffix
  ].join("-");
}


/* =========================================================
   ÉMISSION DU PREMIER ACCÈS PROFESSIONNEL
   ========================================================= */

function issueProfessionalInitialAccess(
  organization
){

  if(
    !organization ||
    !organization.organizationId
  ){

    return Promise.resolve({
      ok:false,
      reason:"organization_not_found"
    });
  }


  /*
    Aucun accès professionnel ne peut
    être émis avant validation Bo'CitéArt.
  */

  if(
    organization.active !== true ||
    organization.validationStatus !==
      "validated"
  ){

    return Promise.resolve({
      ok:false,
      reason:"organization_not_validated"
    });
  }


  /*
    L'identifiant professionnel est permanent.

    Une réémission de code ne change donc
    jamais cet identifiant.
  */

  const professionalIdentifier =
    organization.professionalIdentifier ||
    createProfessionalIdentifier(
      organization
    );


  const initialAccessCode =
    createNumericCode(6);


  return hashSecret(
    initialAccessCode
  )
  .then(
    function(codeHash){

      organization.professionalIdentifier =
        professionalIdentifier;

      organization.initialAccessCodeHash =
        codeHash;

      organization.initialAccessCodeIssuedAt =
        new Date().toISOString();

      organization.initialAccessCodeUsedAt =
        null;

      organization.professionalAccessReady =
        false;

      organization.updatedAt =
        new Date().toISOString();


      saveOrganization(
        organization
      );


      addSecurityLog(
        "professional_initial_access_issued",
        {

          organizationId:
            organization.organizationId,

          category:
            organization.category,

          professionalIdentifier:
            professionalIdentifier
        }
      );


      /*
        Le code initial en clair est retourné
        uniquement au moment de son émission.

        Seule son empreinte est enregistrée.
      */

      return {

        ok:true,

        professionalIdentifier:
          professionalIdentifier,

        initialAccessCode:
          initialAccessCode,

        organization:
          organization
      };
    }
  );
}


/* =========================================================
   CONTRÔLE DU PREMIER ACCÈS PROFESSIONNEL
   ========================================================= */

function verifyProfessionalInitialAccess(
  professionalIdentifier,
  enteredCode
){

  const organization =
    getOrganization();


  if(
    !organization ||
    !organization.organizationId
  ){

    return Promise.resolve({
      ok:false,
      reason:"organization_not_found"
    });
  }


  /*
    L'organisation doit toujours être
    active et validée au moment
    de l'utilisation du code initial.
  */

  if(
    organization.active !== true ||
    organization.validationStatus !==
      "validated"
  ){

    return Promise.resolve({
      ok:false,
      reason:"organization_not_validated"
    });
  }


  /*
    Contrôle de l'identifiant professionnel.
  */

  if(
    String(
      professionalIdentifier ||
      ""
    ).trim() !==
    String(
      organization.professionalIdentifier ||
      ""
    ).trim()
  ){

    addSecurityLog(
      "professional_initial_access_rejected",
      {

        organizationId:
          organization.organizationId,

        reason:
          "invalid_professional_identifier"
      }
    );


    return Promise.resolve({
      ok:false,
      reason:"invalid_professional_identifier"
    });
  }


  /*
    Le premier accès est à usage unique.

    Une fois validé, il ne doit plus
    être accepté une deuxième fois.
  */

  if(
    organization.professionalAccessReady ===
      true ||
    organization.initialAccessCodeUsedAt
  ){

    return Promise.resolve({
      ok:false,
      reason:"initial_access_already_used"
    });
  }


  /*
    Aucun contrôle n'est possible
    si aucun code initial n'a été émis.
  */

  if(
    !organization.initialAccessCodeHash
  ){

    return Promise.resolve({
      ok:false,
      reason:"initial_access_not_issued"
    });
  }


  return verifySecret(
    enteredCode,
    organization.initialAccessCodeHash
  )
  .then(
    function(valid){

      if(!valid){

        addSecurityLog(
          "professional_initial_access_rejected",
          {

            organizationId:
              organization.organizationId,

            reason:
              "invalid_initial_access_code"
          }
        );


        return {
          ok:false,
          reason:"invalid_initial_access_code"
        };
      }


      /*
        Le code initial devient définitivement
        inutilisable après sa validation.

        Le mot de passe personnel déjà créé
        dans la sécurité centrale du compte
        reste ensuite le moyen normal d'accès.
      */

      organization.initialAccessCodeUsedAt =
        new Date().toISOString();

      organization.initialAccessCodeHash =
        null;

      organization.professionalAccessReady =
        true;

      organization.updatedAt =
        new Date().toISOString();


      saveOrganization(
        organization
      );


      addSecurityLog(
        "professional_initial_access_accepted",
        {

          organizationId:
            organization.organizationId,

          category:
            organization.category,

          professionalIdentifier:
            organization.professionalIdentifier
        }
      );


      return {

        ok:true,

        organizationId:
          organization.organizationId,

        professionalIdentifier:
          organization.professionalIdentifier,

        professionalAccessReady:
          true,

        organization:
          organization
      };
    }
  );
}


/* =========================================================
   ÉTAT DE L'ACCÈS PROFESSIONNEL
   ========================================================= */

function getProfessionalAccessState(){

  const organization =
    getOrganization();


  if(
    !organization ||
    !organization.organizationId
  ){

    return {
      ok:false,
      reason:"organization_not_found"
    };
  }


  return {

    ok:true,

    organizationId:
      organization.organizationId,

    category:
      organization.category,

    professionalIdentifier:
      organization.professionalIdentifier ||
      "",

    identifierIssued:
      Boolean(
        organization.professionalIdentifier
      ),

    initialAccessIssued:
      Boolean(
        organization.initialAccessCodeIssuedAt
      ),

    initialAccessUsed:
      Boolean(
        organization.initialAccessCodeUsedAt
      ),

    professionalAccessReady:
      organization.professionalAccessReady ===
        true,

    organizationValidated:
      (
        organization.active === true &&
        organization.validationStatus ===
          "validated"
      )
  };
}


/* =========================================================
   RÉÉMISSION D'UN CODE INITIAL
   ========================================================= */

function reissueProfessionalInitialAccess(){

  const organization =
    getOrganization();


  if(
    !organization ||
    !organization.organizationId
  ){

    return Promise.resolve({
      ok:false,
      reason:"organization_not_found"
    });
  }


  if(
    organization.active !== true ||
    organization.validationStatus !==
      "validated"
  ){

    return Promise.resolve({
      ok:false,
      reason:"organization_not_validated"
    });
  }


  /*
    L'identifiant professionnel existant
    est conservé.

    Seul un nouveau code initial
    à usage unique est émis.
  */

  return issueProfessionalInitialAccess(
    organization
  );
}
   
/* =========================================================
   DÉCISION DE VALIDATION
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
      ok:false,
      reason:"invalid_status"
    };
  }


  const organization =
    getOrganization();


  if(
    !organization ||
    !organization.organizationId
  ){

    return {
      ok:false,
      reason:"organization_not_found"
    };
  }


  const data =
    (
      options &&
      typeof options ===
        "object"
    )
      ? options
      : {};


  /*
    Un dossier brouillon ne peut jamais
    être validé directement.
  */

  if(
    nextStatus ===
      "validated" &&
    organization.validationStatus !==
      "pending_review" &&
    organization.validationStatus !==
      "needs_information"
  ){

    return {
      ok:false,
      reason:"organization_not_under_review"
    };
  }


  const validationChecks =
    (
      data.checks &&
      typeof data.checks ===
        "object"
    )
      ? {
          ...data.checks
        }
      : (
          organization.validationChecks &&
          typeof organization.validationChecks ===
            "object"
            ? {
                ...organization.validationChecks
              }
            : {}
        );


  if(
    nextStatus ===
    "validated"
  ){

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

        ok:false,

        reason:
          "validation_checks_incomplete",

        category:
          organization.category,

        missing:
          validationResult.missing ||
          []
      };
    }
  }


  if(
    data.checks &&
    typeof data.checks ===
      "object"
  ){

    organization.validationChecks =
      validationChecks;

    organization.validationChecksUpdatedAt =
      new Date().toISOString();
  }


  organization.validationStatus =
    nextStatus;

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
    ok:true,
    organization:
      organization
  };
}

/* =========================================================
   DÉCISION DE VALIDATION
   ========================================================= */
   
function runOrganizationValidationDecision(
  decision,
  options
){

  const nextDecision =
    String(
      decision ||
      ""
    ).trim();


  const allowed = [
    "needs_information",
    "unfavorable",
    "validated"
  ];


  if(
    !allowed.includes(
      nextDecision
    )
  ){

    return Promise.resolve({
      ok:false,
      reason:"invalid_validation_decision"
    });
  }


  const organization =
    getOrganization();


  if(
    !organization ||
    !organization.organizationId
  ){

    return Promise.resolve({
      ok:false,
      reason:"organization_not_found"
    });
  }


  if(
    organization.validationStatus !==
      "pending_review" &&
    organization.validationStatus !==
      "needs_information"
  ){

    return Promise.resolve({
      ok:false,
      reason:"organization_not_under_review"
    });
  }


  const result =
    setOrganizationValidationStatus(
      nextDecision,
      options
    );


  if(
    !result ||
    result.ok !== true
  ){

    return Promise.resolve(
      result
    );
  }


  addSecurityLog(
    "organization_validation_decision",
    {
      organizationId:
        organization.organizationId,

      category:
        organization.category,

      decision:
        nextDecision
    }
  );


  /*
    Si le dossier n'est pas validé,
    aucun accès professionnel
    n'est délivré.
  */

  if(
    nextDecision !==
      "validated"
  ){

    return Promise.resolve(
      result
    );
  }


  /*
    Après validation Bo'CitéArt,
    création de l'identifiant
    professionnel et émission
    du code initial.
  */

  const validatedOrganization =
    result.organization ||
    getOrganization();


  return issueProfessionalInitialAccess(
    validatedOrganization
  )
  .then(
    function(
      accessResult
    ){

      if(
        !accessResult ||
        accessResult.ok !== true
      ){

        return {

          ok:false,

          reason:
            (
              accessResult &&
              accessResult.reason
            ) ||
            "professional_access_issue_failed",

          organization:
            validatedOrganization
        };
      }


      return {

        ok:true,

        decision:
          "validated",

        organization:
          getOrganization(),

        professionalIdentifier:
          accessResult.professionalIdentifier,

        initialAccessCode:
          accessResult.initialAccessCode
      };
    }
  );
}
/* =========================================================
   FORMULAIRE D'IDENTIFICATION DE L'ORGANISATION
   ========================================================= */

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


  const previousOverlay =
    document.getElementById(
      "bociteOrganizationProfileOverlay"
    );


  if(previousOverlay){
    previousOverlay.remove();
  }


  const fields =
    getOrganizationProfileFields(
      organization.category
    );


  if(
    !Array.isArray(fields) ||
    fields.length === 0
  ){
    return false;
  }


  const profile =
    (
      organization.organizationProfile &&
      typeof organization.organizationProfile ===
        "object"
    )
      ? organization.organizationProfile
      : {};


  const overlay =
    document.createElement(
      "div"
    );


  overlay.id =
    "bociteOrganizationProfileOverlay";


  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:1000000",
    "background:rgba(0,0,0,.48)",
    "display:flex",
    "align-items:flex-start",
    "justify-content:center",
    "overflow:auto",
    "padding:24px 14px"
  ].join(";");


  const card =
    document.createElement(
      "div"
    );


  card.style.cssText = [
    "width:min(620px,100%)",
    "background:#fff",
    "border:2px solid #2f5d46",
    "border-radius:15px",
    "padding:22px",
    "box-sizing:border-box",
    "box-shadow:0 12px 36px rgba(0,0,0,.20)"
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
    "color:#2f5d46",
    "margin-bottom:8px"
  ].join(";");


  const introduction =
    document.createElement(
      "div"
    );


  introduction.textContent =
    "Complétez les informations de votre organisation. Après transmission, Bo’CitéArt vérifie le dossier avant l'ouverture de l'espace privé.";


  introduction.style.cssText = [
    "font-size:14px",
    "line-height:1.5",
    "color:#111",
    "margin-bottom:18px"
  ].join(";");


  card.appendChild(
    title
  );

  card.appendChild(
    introduction
  );


  const inputMap =
    {};


  fields.forEach(
    function(field){

      const wrap =
        document.createElement(
          "div"
        );


      wrap.style.marginBottom =
        "13px";


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
        "font-weight:700",
        "margin-bottom:5px",
        "color:#111"
      ].join(";");


      const input =
        document.createElement(
          "input"
        );


      input.type =
        field.type ||
        "text";

      input.value =
        String(
          profile[field.name] ||
          ""
        );

      input.autocomplete =
        "off";


      input.style.cssText = [
        "width:100%",
        "box-sizing:border-box",
        "padding:11px 12px",
        "font-size:14px",
        "border:2px solid #2f5d46",
        "border-radius:9px",
        "background:#fff",
        "color:#111"
      ].join(";");


      inputMap[field.name] =
        input;


      wrap.appendChild(
        label
      );

      wrap.appendChild(
        input
      );

      card.appendChild(
        wrap
      );
    }
  );


  const message =
    document.createElement(
      "div"
    );


  message.style.cssText = [
    "font-size:14px",
    "line-height:1.45",
    "min-height:20px",
    "margin-top:6px",
    "margin-bottom:10px",
    "color:#111"
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
    "border:2px solid #2f5d46",
    "color:#2f5d46",
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
    "border:2px solid #2f5d46",
    "color:#2f5d46",
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


  closeButton.onclick =
    function(){

      overlay.remove();
    };


  saveButton.onclick =
    function(){

      message.textContent =
        "";


      const data =
        {};

      let missingVisibleField =
        false;


      fields.forEach(
        function(field){

          const value =
            String(
              inputMap[field.name]
                ? inputMap[field.name].value
                : ""
            ).trim();


          data[field.name] =
            value;


          if(
            field.required &&
            !value
          ){
            missingVisibleField =
              true;
          }
        }
      );


      if(missingVisibleField){

        message.textContent =
          "Complétez toutes les informations obligatoires avant de transmettre votre dossier.";

        return;
      }


      const updateResult =
        updateOrganizationProfile(
          data
        );


      if(
        !updateResult ||
        updateResult.ok !== true
      ){

        message.textContent =
          "L'enregistrement du dossier n'a pas abouti.";

        return;
      }


      const submissionResult =
        submitOrganizationForReview();


      if(
        !submissionResult ||
        submissionResult.ok !== true
      ){

        message.textContent =
          "Complétez toutes les informations obligatoires avant de transmettre votre dossier.";

        return;
      }


      message.textContent =
        "Votre dossier est enregistré et transmis pour vérification.";


      saveButton.disabled =
        true;


      setTimeout(
        function(){

          if(
            overlay &&
            overlay.parentNode
          ){
            overlay.remove();
          }

        },
        1000
      );
    };


  return true;
}


/* =========================================================
   PERMISSIONS
   ========================================================= */

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
    rows.includes("all") ||
    rows.includes(permission)
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


  const organization =
    getOrganization();


  if(
    !organization ||
    organization.active !== true ||
    organization.validationStatus !==
      "validated"
  ){
    return false;
  }


  return hasAccessPermission(
    collaborator.permissions,
    permission
  );
}


/* =========================================================
   CRÉATION D'UN COLLABORATEUR
   ========================================================= */

function createCollaboratorAccess(
  data
){

  const source =
    (
      data &&
      typeof data ===
        "object"
    )
      ? data
      : {};


  const organization =
    getOrganization();

  const account =
    getAccount();


  /*
    L'organisation doit exister,
    être validée et son accès
    professionnel doit avoir été activé.
  */

  if(
    !organization ||
    !organization.organizationId ||
    organization.active !== true ||
    organization.validationStatus !==
      "validated" ||
    organization.professionalAccessReady !==
      true
  ){

    return Promise.reject(
      new Error(
        "L'accès professionnel de l'organisation doit être validé et activé avant d'ajouter un collaborateur."
      )
    );
  }


  /*
    Seul le responsable principal,
    depuis son compte sécurisé,
    peut créer un collaborateur.
  */

  if(
    !account ||
    !account.accountId ||
    !accountSecurityReady() ||
    String(
      organization.ownerAccountId ||
      ""
    ) !==
    String(
      account.accountId ||
      ""
    )
  ){

    return Promise.reject(
      new Error(
        "Accès réservé au responsable principal."
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


  /*
    Un nom et au moins un moyen
    de contact sont obligatoires.
  */

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


  const invitationCode =
    createNumericCode(6);


  return hashSecret(
    invitationCode
  )
  .then(
    function(
      invitationCodeHash
    ){

      const collaborators =
        loadCollaborators();

      const now =
        new Date().toISOString();


      const collaborator = {

        id:
          createUniqueId(
            "bociteart-collaborator"
          ),

        organizationId:
          organization.organizationId,

        /*
          Le compte du collaborateur
          n'est rattaché qu'au moment
          où celui-ci accepte lui-même
          son invitation.
        */

        accountId:
          "",

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
          now,

        createdAt:
          now,

        acceptedAt:
          null,

        revokedAt:
          null,

        updatedAt:
          now,

        version:
          "3"
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

          ownerAccountId:
            account.accountId,

          displayName:
            collaborator.displayName,

          role:
            collaborator.role,

          permissions:
            collaborator.permissions
        }
      );


      /*
        Le code n'est renvoyé qu'ici
        pour permettre sa transmission
        initiale au collaborateur.

        Seul son hash reste enregistré.
      */

      return {

        collaborator:
          collaborator,

        invitationCode:
          invitationCode
      };
    }
  );
}
  /* =========================================================
   ACCEPTATION DE L'INVITATION
   ========================================================= */

function acceptCollaboratorInvitation(
  collaboratorId,
  enteredCode
){

  const organization =
    getOrganization();

  const account =
    getAccount();


  /*
    L'organisation doit exister,
    être active et validée.
  */

  if(
    !organization ||
    !organization.organizationId ||
    organization.active !== true ||
    organization.validationStatus !==
      "validated"
  ){

    return Promise.resolve(
      false
    );
  }


  /*
    Le collaborateur doit disposer
    de son propre compte Bo'CitéArt
    et de la sécurité de compte active.
  */

  if(
    !account ||
    !account.accountId ||
    !accountSecurityReady()
  ){

    return Promise.resolve(
      false
    );
  }


  const collaborators =
    loadCollaborators();


  const collaborator =
    collaborators.find(
      function(item){

        return (
          item &&
          String(
            item.id ||
            ""
          ) ===
          String(
            collaboratorId ||
            ""
          ) &&
          String(
            item.organizationId ||
            ""
          ) ===
          String(
            organization.organizationId ||
            ""
          )
        );
      }
    );


  if(
    !collaborator ||
    collaborator.enabled !== true
  ){

    return Promise.resolve(
      false
    );
  }


  /*
    Une invitation déjà acceptée
    ne peut jamais être réutilisée.
  */

  if(
    collaborator.invitationAccepted ===
      true ||
    collaborator.acceptedAt ||
    !collaborator.invitationCodeHash
  ){

    return Promise.resolve(
      false
    );
  }


  /*
    Le compte du responsable principal
    ne peut pas devenir lui-même
    un compte collaborateur.
  */

  if(
    String(
      organization.ownerAccountId ||
      ""
    ) ===
    String(
      account.accountId ||
      ""
    )
  ){

    return Promise.resolve(
      false
    );
  }


  /*
    Un même compte ne peut pas être
    rattaché plusieurs fois à la même
    organisation comme collaborateur.
  */

  const accountAlreadyLinked =
    collaborators.some(
      function(item){

        return (
          item &&
          String(
            item.organizationId ||
            ""
          ) ===
          String(
            organization.organizationId ||
            ""
          ) &&
          String(
            item.accountId ||
            ""
          ) ===
          String(
            account.accountId ||
            ""
          ) &&
          String(
            item.id ||
            ""
          ) !==
          String(
            collaborator.id ||
            ""
          )
        );
      }
    );


  if(accountAlreadyLinked){

    return Promise.resolve(
      false
    );
  }


  return verifySecret(
    enteredCode,
    collaborator.invitationCodeHash
  )
  .then(
    function(valid){

      if(!valid){

        addSecurityLog(
          "collaborator_invitation_rejected",
          {
            collaboratorId:
              collaborator.id,

            organizationId:
              organization.organizationId,

            accountId:
              account.accountId,

            reason:
              "invalid_invitation_code"
          }
        );


        return false;
      }


      /*
        Rattachement définitif
        de l'accès collaborateur
        à son propre compte.
      */

      collaborator.accountId =
        account.accountId;

      collaborator.invitationAccepted =
        true;

      collaborator.invitationCodeHash =
        "";

      collaborator.acceptedAt =
        new Date().toISOString();

      collaborator.revokedAt =
        null;

      collaborator.updatedAt =
        new Date().toISOString();


      saveCollaborators(
        collaborators
      );


      addSecurityLog(
        "collaborator_invitation_accepted",
        {
          collaboratorId:
            collaborator.id,

          organizationId:
            organization.organizationId,

          accountId:
            account.accountId,

          role:
            collaborator.role,

          permissions:
            collaborator.permissions
        }
      );


      return true;
    }
  );
}

  /* =========================================================
   MODIFICATION D'UN COLLABORATEUR
   ========================================================= */

function updateCollaboratorAccess(
  collaboratorId,
  changes
){

  const organization =
    getOrganization();

  const account =
    getAccount();


  /*
    Une modification n'est autorisée
    qu'après validation et activation
    de l'accès professionnel.
  */

  if(
    !organization ||
    !organization.organizationId ||
    organization.active !== true ||
    organization.validationStatus !==
      "validated" ||
    organization.professionalAccessReady !==
      true
  ){

    return null;
  }


  /*
    Seul le responsable principal,
    depuis son compte sécurisé,
    peut modifier un collaborateur.
  */

  if(
    !account ||
    !account.accountId ||
    !accountSecurityReady() ||
    String(
      organization.ownerAccountId ||
      ""
    ) !==
    String(
      account.accountId ||
      ""
    )
  ){

    return null;
  }


  const collaborators =
    loadCollaborators();


  const collaborator =
    collaborators.find(
      function(item){

        return (
          item &&
          String(
            item.id ||
            ""
          ) ===
          String(
            collaboratorId ||
            ""
          ) &&
          String(
            item.organizationId ||
            ""
          ) ===
          String(
            organization.organizationId ||
            ""
          )
        );
      }
    );


  if(!collaborator){

    return null;
  }


  const source =
    (
      changes &&
      typeof changes ===
        "object"
    )
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

      organizationId:
        organization.organizationId,

      ownerAccountId:
        account.accountId,

      role:
        collaborator.role,

      permissions:
        collaborator.permissions
    }
  );


  return collaborator;
}

  /* =========================================================
   RÉACTIVATION D'UN COLLABORATEUR
   ========================================================= */

function restoreCollaboratorAccess(
  collaboratorId
){

  const organization =
    getOrganization();

  const account =
    getAccount();


  /*
    Une réactivation n'est autorisée
    qu'après validation et activation
    de l'accès professionnel.
  */

  if(
    !organization ||
    !organization.organizationId ||
    organization.active !== true ||
    organization.validationStatus !==
      "validated" ||
    organization.professionalAccessReady !==
      true
  ){

    return false;
  }


  /*
    Seul le responsable principal,
    depuis son compte sécurisé,
    peut réactiver un collaborateur.
  */

  if(
    !account ||
    !account.accountId ||
    !accountSecurityReady() ||
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


  const collaborators =
    loadCollaborators();


  const collaborator =
    collaborators.find(
      function(item){

        return (
          item &&
          String(
            item.id ||
            ""
          ) ===
          String(
            collaboratorId ||
            ""
          ) &&
          String(
            item.organizationId ||
            ""
          ) ===
          String(
            organization.organizationId ||
            ""
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
        collaborator.id,

      organizationId:
        organization.organizationId,

      ownerAccountId:
        account.accountId
    }
  );


  return true;
} 
 
/* =========================================================
   COLLABORATEURS ACTIFS
   ========================================================= */

function getActiveCollaborators(){

  const organization =
    getOrganization();


  if(
    !organization ||
    organization.active !== true ||
    organization.validationStatus !==
      "validated"
  ){
    return [];
  }


  return loadCollaborators()
    .filter(
      function(item){

        return (
          item.enabled === true &&
          item.invitationAccepted === true &&
          String(
            item.organizationId ||
            ""
          ) ===
          String(
            organization.organizationId
          )
        );
      }
    );
}

/* =========================================================
   SUPPRESSION DÉFINITIVE D'UN COLLABORATEUR
   ========================================================= */

function permanentlyDeleteCollaborator(
  collaboratorId
){

  const organization =
    getOrganization();

  const account =
    getAccount();


  /*
    La suppression définitive
    est réservée au responsable principal
    de l'organisation.
  */

  if(
    !organization ||
    !organization.organizationId ||
    !account ||
    !account.accountId ||
    !accountSecurityReady() ||
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


  const previous =
    getCollaboratorById(
      collaboratorId
    );


  /*
    Le collaborateur doit appartenir
    à l'organisation actuellement ouverte.
  */

  if(
    !previous ||
    String(
      previous.organizationId ||
      ""
    ) !==
    String(
      organization.organizationId ||
      ""
    )
  ){

    return false;
  }


  /*
    Toute session encore liée
    au collaborateur est révoquée
    avant sa suppression.
  */

  revokeCollaboratorSessions(
    collaboratorId
  );


  const collaborators =
    loadCollaborators()
      .filter(
        function(item){

          return (
            String(
              item.id ||
              ""
            ) !==
            String(
              collaboratorId ||
              ""
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

      organizationId:
        organization.organizationId,

      ownerAccountId:
        account.accountId,

      displayName:
        previous.displayName ||
        "",

      role:
        previous.role ||
        ""
    }
  );


  return true;
}
   
/* =========================================================
   CONTRÔLE CENTRAL DES ACCÈS PRIVÉS
   ========================================================= */

function getCurrentAccessContext(){

  const account =
    getAccount();

  const organization =
    getOrganization();


  /*
    AUCUN COMPTE
  */

  if(
    !account ||
    !account.accountId
  ){

    return {

      authenticated:false,

      account:null,

      organization:
        organization || null,

      role:null,

      permissions:[],

      collaborator:null,

      organizationValidated:false,

      professionalAccessReady:false,

      validationStatus:
        organization
          ? (
              organization.validationStatus ||
              "draft"
            )
          : null
    };
  }


  /*
    COMPTE PERSONNEL
    SANS ORGANISATION
  */

  if(
    !organization ||
    !organization.organizationId
  ){

    return {

      authenticated:
        Boolean(
          accountSecurityReady()
        ),

      account:
        account,

      organization:null,

      role:
        "account",

      permissions:[],

      collaborator:null,

      organizationValidated:false,

      professionalAccessReady:false,

      validationStatus:null
    };
  }


  /*
    RESPONSABLE PRINCIPAL
  */

  if(
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


    const professionalAccessReady =
      (
        organization.professionalAccessReady ===
          true
      );


    const authenticated =
      Boolean(
        accountSecurityReady() &&
        organizationValidated &&
        professionalAccessReady
      );


    return {

      authenticated:
        authenticated,

      account:
        account,

      organization:
        organization,

      role:
        "owner",

      permissions:
        authenticated
          ? ["all"]
          : [],

      collaborator:null,

      organizationValidated:
        organizationValidated,

      professionalAccessReady:
        professionalAccessReady,

      validationStatus:
        organization.validationStatus ||
        "draft"
    };
  }


  /*
    COLLABORATEUR

    L'organisation doit être active
    et validée avant qu'un collaborateur
    puisse disposer d'un accès privé.
  */

  const organizationValidated =
    (
      organization.active === true &&
      organization.validationStatus ===
        "validated"
    );


  if(!organizationValidated){

    return {

      authenticated:false,

      account:
        account,

      organization:
        organization,

      role:null,

      permissions:[],

      collaborator:null,

      organizationValidated:false,

      professionalAccessReady:
        organization.professionalAccessReady ===
          true,

      validationStatus:
        organization.validationStatus ||
        "draft"
    };
  }


  const collaborators =
    loadCollaborators();


  const collaborator =
    Array.isArray(
      collaborators
    )
      ? collaborators.find(
          function(item){

            if(!item){
              return false;
            }


            return (
              String(
                item.organizationId ||
                ""
              ) ===
              String(
                organization.organizationId ||
                ""
              ) &&

              String(
                item.accountId ||
                ""
              ) ===
              String(
                account.accountId ||
                ""
              ) &&

              item.enabled === true &&

              item.invitationAccepted === true
            );
          }
        ) || null
      : null;


  /*
    AUCUN DROIT PROFESSIONNEL
    POUR CE COMPTE
  */

  if(!collaborator){

    return {

      authenticated:false,

      account:
        account,

      organization:
        organization,

      role:null,

      permissions:[],

      collaborator:null,

      organizationValidated:true,

      professionalAccessReady:
        organization.professionalAccessReady ===
          true,

      validationStatus:
        organization.validationStatus ||
        "validated"
    };
  }


  /*
    COLLABORATEUR AUTORISÉ
  */

  const collaboratorAuthenticated =
    Boolean(
      accountSecurityReady()
    );


  return {

    authenticated:
      collaboratorAuthenticated,

    account:
      account,

    organization:
      organization,

    role:
      collaborator.role ||
      "collaborator",

    permissions:
      collaboratorAuthenticated &&
      Array.isArray(
        collaborator.permissions
      )
        ? collaborator.permissions.slice()
        : [],

    collaborator:
      collaborator,

    organizationValidated:true,

    professionalAccessReady:
      organization.professionalAccessReady ===
        true,

    validationStatus:
      organization.validationStatus ||
      "validated"
  };
}

/* =========================================================
   AUTORISATION D'UNE ACTION
   ========================================================= */

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


function requireAccess(
  permission
){

  const allowed =
    canAccess(
      permission
    );


  if(!allowed){

    const account =
      getAccount();


    addSecurityLog(
      "access_refused",
      {
        permission:
          permission ||
          "",

        accountId:
          account
            ? account.accountId
            : ""
      }
    );
  }


  return allowed;
}


/* =========================================================
   ÇA FINIT ICI — BLOC 1/2
   LE BLOC 2 CONTINUE IMMÉDIATEMENT
   ========================================================= */

/* =========================================================
   ÇA COMMENCE ICI — BLOC 2/2
   COMPTE + SÉCURISATION + ORGANISATION
   ========================================================= */


/* =========================================================
   COMPTE LOCAL
   ========================================================= */

function sanitizeAccount(
  data
){

  const source =
    (
      data &&
      typeof data ===
        "object"
    )
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
      "3"
  };
}


function createAccount(
  data
){

  const account =
    sanitizeAccount(
      data
    );


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
    Pour Commerce, Entreprise,
    Association, Sport, École et Mairie,
    on crée uniquement la structure locale
    du dossier.

    Elle reste en DRAFT.
    Aucun droit privé n'est encore ouvert.
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


function updateAccount(
  data
){

  const current =
    getAccount() ||
    {};


  const updated =
    sanitizeAccount(
      Object.assign(
        {},
        current,
        data ||
        {}
      )
    );


  setLocalStorageItem(
    STORAGE.account,
    JSON.stringify(
      updated
    )
  );


  return updated;
}


function getAccount(){

  const saved =
    getLocalStorageItem(
      STORAGE.account
    );


  return saved
    ? safeParse(
        saved,
        null
      )
    : null;
}


function registrationCompleted(){

  return (
    getLocalStorageItem(
      STORAGE.registration
    ) ===
    "true"
  );
}


/* =========================================================
   SUPPRESSION DU COMPTE LOCAL
   ========================================================= */

function clearAccount(){

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


/* =========================================================
   FIN D'INSCRIPTION
   ========================================================= */

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
            account.category ===
              "jeune"
                ? false
                : true
        }
      }
    )
  );
}


/* =========================================================
   SUITE APRÈS SÉCURISATION DU COMPTE
   ========================================================= */

function continueAfterAccountSecurity(
  account
){

  if(!account){
    return;
  }


  /*
    Le compte personnel est créé et sécurisé.
  */

  finishRegistration(
    account
  );


  /*
    Pour un citoyen ou un autre profil
    sans organisation, le parcours est terminé.
  */

  if(
    !isOrganizationCategory(
      account.category
    )
  ){
    return;
  }


  let organization =
    getOrganization();


  if(
    !organization ||
    !organization.organizationId
  ){

    organization =
      ensureOrganizationForAccount(
        account
      );
  }


  if(
    !organization ||
    !organization.organizationId
  ){
    return;
  }


  /*
    Le dossier n'est présenté que s'il
    n'a pas encore été transmis.
  */

  if(
    (
      organization.validationStatus ||
      "draft"
    ) ===
    "draft"
  ){

    setTimeout(
      function(){

        openOrganizationProfileForm();

      },
      120
    );
  }
}


/* =========================================================
   SÉCURISATION DU COMPTE
   ========================================================= */

function openAccountSecuritySetup(
  account
){

  if(!account){
    return;
  }


  let emailCode =
    "";

  let smsCode =
    "";


  saveAccountSecurity({

    accountId:
      account.accountId,

    activated:
      false,

    passwordConfigured:
      false,

    activationCodeHash:
      "",

    email:
      account.email ||
      "",

    phone:
      account.phone ||
      "",

    createdAt:
      new Date().toISOString()

  });


  const overlay =
    getElement(
      OVERLAY_ID
    );


  if(!overlay){
    return;
  }


  const emailHtml =
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


  const smsHtml =
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


  overlay.innerHTML = `

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
        sans recommencer votre identification
        dans chaque espace.

      </div>


      <div class="bociteRegistrationPrivacy">

        <strong>
          Votre profil personnel
        </strong>

        <br><br>

        La sécurisation de votre compte
        est distincte de la validation
        d'une organisation.

        <br><br>

        Pour un commerce, une entreprise,
        une association, un club sportif,
        une école ou une mairie,
        l'accès privé de l'organisation
        est ouvert après vérification
        et validation du dossier.

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

        Ces coordonnées servent également
        à sécuriser la récupération
        de votre compte.

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
        selon l'appareil utilisé :

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
        Enregistrer et continuer
      </button>

    </div>

  `;


  const emailBtn =
    getElement(
      "bociteSecurityEmailBtn"
    );


  if(emailBtn){

    emailBtn.onclick =
      function(){

        emailCode =
          createNumericCode(
            6
          );


        const wrap =
          getElement(
            "bociteSecurityEmailWrap"
          );


        if(wrap){
          wrap.style.display =
            "block";
        }


        /*
          Le branchement serveur d'envoi
          remplacera cette présentation locale.
        */

        alert(
          "Votre code e-mail : " +
          emailCode
        );
      };
  }


  const smsBtn =
    getElement(
      "bociteSecuritySmsBtn"
    );


  if(smsBtn){

    smsBtn.onclick =
      function(){

        smsCode =
          createNumericCode(
            6
          );


        const wrap =
          getElement(
            "bociteSecuritySmsWrap"
          );


        if(wrap){
          wrap.style.display =
            "block";
        }


        alert(
          "Votre code SMS : " +
          smsCode
        );
      };
  }


  const validate =
    getElement(
      "bociteSecurityValidateBtn"
    );


  if(validate){

    validate.onclick =
      function(){

        const password =
          String(
            getElement(
              "bociteSecurityPassword"
            )?.value ||
            ""
          );


        const confirmation =
          String(
            getElement(
              "bociteSecurityPasswordConfirm"
            )?.value ||
            ""
          );


        const enteredEmailCode =
          normalizeText(
            getElement(
              "bociteSecurityEmailCode"
            )?.value
          );


        const enteredSmsCode =
          normalizeText(
            getElement(
              "bociteSecuritySmsCode"
            )?.value
          );


        const message =
          getElement(
            "bociteSecurityMessage"
          );


        if(
          !password ||
          !confirmation
        ){

          if(message){

            message.textContent =
              "Créez et confirmez votre mot de passe.";

            message.style.display =
              "block";
          }

          return;
        }


        if(
          password.length <
          10
        ){

          if(message){

            message.textContent =
              "Choisissez un mot de passe d’au moins 10 caractères.";

            message.style.display =
              "block";
          }

          return;
        }


        if(
          password !==
          confirmation
        ){

          if(message){

            message.textContent =
              "Les deux mots de passe ne correspondent pas.";

            message.style.display =
              "block";
          }

          return;
        }


        const emailVerified =
          Boolean(
            emailCode &&
            enteredEmailCode ===
              emailCode
          );


        const phoneVerified =
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

            message.textContent =
              "Vérifiez au moins votre e-mail ou votre téléphone avant de continuer.";

            message.style.display =
              "block";
          }

          return;
        }


        validate.disabled =
          true;


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
                new Date().toISOString()

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
                new Date().toISOString()

            });


            const updatedAccount =
              updateAccount({

                securityConfigured:
                  true,

                /*
                  La sécurisation du compte
                  ne valide jamais automatiquement
                  l'organisation.
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


            continueAfterAccountSecurity(
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


            validate.disabled =
              false;


            if(message){

              message.textContent =
                "La sécurisation du compte n’a pas pu être terminée.";

              message.style.display =
                "block";
            }
          }
        );
      };
  }
}


/* =========================================================
   VALIDATION DE L'INSCRIPTION
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
    category ===
    "jeune";


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
    JEUNE :
    aucun écran mot de passe / e-mail / SMS.
  */

  if(isYoung){

    finishRegistration(
      account
    );

    return;
  }


  /*
    TOUS LES AUTRES PROFILS :
    sécurisation du compte.
  */

  openAccountSecuritySetup(
    account
  );
}


/* =========================================================
   API PUBLIQUE
   ========================================================= */

/* =========================================================
   AGENT CENTRAL — VALIDATION AUTOMATIQUE ORGANISATION
   Commerce / Entreprise
   ========================================================= */

function bociteNormalizeText(value){
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}


function bociteDigits(value){
  return String(value || "")
    .replace(/\D/g, "");
}


function bociteOfficialCompanySearch(sirenSiret){

  const digits =
    bociteDigits(sirenSiret);

  if(
    digits.length !== 9 &&
    digits.length !== 14
  ){
    return Promise.resolve({
      ok:false,
      reason:"invalid_siren_siret"
    });
  }


  const url =
    "https://recherche-entreprises.api.gouv.fr/search?q=" +
    encodeURIComponent(digits) +
    "&page=1&per_page=10";


  return fetch(
    url,
    {
      method:"GET",
      headers:{
        Accept:"application/json"
      }
    }
  )
  .then(function(response){

    if(!response.ok){
      throw new Error(
        "API HTTP " +
        response.status
      );
    }

    return response.json();
  })
  .then(function(data){

    const companies =
      Array.isArray(data.results)
        ? data.results
        : [];


    let foundCompany = null;
    let foundEstablishment = null;


    companies.some(function(company){

      const companySiren =
        bociteDigits(
          company.siren
        );


      if(
        digits.length === 9 &&
        companySiren === digits
      ){
        foundCompany =
          company;

        foundEstablishment =
          company.siege ||
          null;

        return true;
      }


      const establishments =
        Array.isArray(
          company.matching_etablissements
        )
          ? company.matching_etablissements
          : [];


      const establishment =
        establishments.find(
          function(item){

            return (
              bociteDigits(
                item &&
                item.siret
              ) === digits
            );
          }
        );


      if(establishment){

        foundCompany =
          company;

        foundEstablishment =
          establishment;

        return true;
      }


      if(
        company.siege &&
        bociteDigits(
          company.siege.siret
        ) === digits
      ){

        foundCompany =
          company;

        foundEstablishment =
          company.siege;

        return true;
      }


      return false;
    });


    if(!foundCompany){

      return {
        ok:false,
        reason:"company_not_found"
      };
    }


    const establishment =
      foundEstablishment ||
      foundCompany.siege ||
      {};


    return {

      ok:true,

      source:
        "API Recherche d'Entreprises — État",

      siren:
        bociteDigits(
          foundCompany.siren
        ),

      siret:
        bociteDigits(
          establishment.siret
        ),

      name:
        String(
          foundCompany.nom_complet ||
          foundCompany.nom_raison_sociale ||
          foundCompany.nom_commercial ||
          ""
        ).trim(),

      address:
        String(
          establishment.adresse ||
          [
            establishment.numero_voie,
            establishment.indice_repetition,
            establishment.type_voie,
            establishment.libelle_voie,
            establishment.code_postal,
            establishment.libelle_commune
          ]
          .filter(Boolean)
          .join(" ")
        ).trim(),

      commune:
        String(
          establishment.libelle_commune ||
          ""
        ).trim(),

      postalCode:
        String(
          establishment.code_postal ||
          ""
        ).trim(),

      activity:
        String(
          establishment.libelle_activite_principale ||
          foundCompany.libelle_activite_principale ||
          ""
        ).trim(),

      administrativeStatus:
        String(
          establishment.etat_administratif ||
          ""
        ).trim(),

      rawCompany:
        foundCompany,

      rawEstablishment:
        establishment
    };
  })
  .catch(function(error){

    console.error(
      "Bo'CitéArt — contrôle officiel impossible",
      error
    );

    return {
      ok:false,
      reason:"official_service_unavailable"
    };
  });
}


/* =========================================================
   COMPARAISON DOSSIER / DONNÉES OFFICIELLES
   ========================================================= */

function bociteCheckProfessionalOrganization(
  organization,
  official
){

  const profile =
    (
      organization &&
      organization.organizationProfile &&
      typeof organization.organizationProfile ===
        "object"
    )
      ? organization.organizationProfile
      : {};


  const checks = {};


  const declaredNumber =
    bociteDigits(
      profile.siretOrSiren
    );


  const officialSiren =
    bociteDigits(
      official.siren
    );


  const officialSiret =
    bociteDigits(
      official.siret
    );


  checks.siret_or_siren =
    (
      declaredNumber &&
      (
        declaredNumber ===
          officialSiren ||
        declaredNumber ===
          officialSiret
      )
    );


  const declaredName =
    bociteNormalizeText(
      profile.organizationName ||
      organization.name
    );


  const officialName =
    bociteNormalizeText(
      official.name
    );


  checks.organization_name =
    Boolean(
      declaredName &&
      officialName &&
      (
        declaredName === officialName ||
        declaredName.includes(
          officialName
        ) ||
        officialName.includes(
          declaredName
        )
      )
    );


  const declaredCommune =
    bociteNormalizeText(
      organization.commune
    );


  const officialCommune =
    bociteNormalizeText(
      official.commune
    );


  checks.commune =
    Boolean(
      declaredCommune &&
      officialCommune &&
      declaredCommune ===
        officialCommune
    );


  const professionalAddress =
    (
      organization.category ===
        "commerce"
    )
      ? profile.establishmentAddress
      : profile.registeredAddress;


  checks.establishment_address =
    Boolean(
      organization.category !==
        "commerce" ||
      String(
        professionalAddress ||
        ""
      ).trim()
    );


  checks.registered_address =
    Boolean(
      organization.category !==
        "entreprise" ||
      String(
        professionalAddress ||
        ""
      ).trim()
    );


  checks.business_activity =
    Boolean(
      String(
        profile.businessActivity ||
        official.activity ||
        ""
      ).trim()
    );


  checks.responsible_identity =
    Boolean(
      String(
        profile.responsibleIdentity ||
        ""
      ).trim()
    );


  checks.responsible_authority =
    Boolean(
      String(
        profile.responsibleAuthority ||
        ""
      ).trim()
    );


  checks.email =
    Boolean(
      String(
        profile.email ||
        organization.ownerEmail ||
        ""
      ).trim()
    );


  checks.phone =
    Boolean(
      String(
        profile.phone ||
        organization.ownerPhone ||
        ""
      ).trim()
    );


  return checks;
}


/* =========================================================
   AGENT CENTRAL
   ========================================================= */

async function runAutomaticOrganizationAgent(){

  const organization =
    getOrganization();


  if(
    !organization ||
    !organization.organizationId
  ){

    return {
      ok:false,
      reason:"organization_not_found"
    };
  }


  if(
    organization.category !==
      "commerce" &&
    organization.category !==
      "entreprise"
  ){

    return {
      ok:false,
      reason:
        "automatic_check_not_available_for_category"
    };
  }


  if(
    organization.validationStatus !==
      "pending_review" &&
    organization.validationStatus !==
      "needs_information"
  ){

    return {
      ok:false,
      reason:
        "organization_not_under_review"
    };
  }


  const profile =
    organization.organizationProfile ||
    {};


  const sirenSiret =
    bociteDigits(
      profile.siretOrSiren
    );


  if(
    sirenSiret.length !== 9 &&
    sirenSiret.length !== 14
  ){

    return runOrganizationValidationDecision(
      "needs_information",
      {
        reviewedBy:
          "agent-central-bociteart",

        reason:
          "SIREN ou SIRET manquant ou incorrect."
      }
    );
  }


  const official =
    await bociteOfficialCompanySearch(
      sirenSiret
    );


  if(
    !official ||
    official.ok !== true
  ){

    /*
      Une indisponibilité de la source officielle
      ne doit jamais produire un refus définitif.
    */

    if(
      official &&
      official.reason ===
        "official_service_unavailable"
    ){

      return {
        ok:false,
        reason:
          "official_service_unavailable",
        retry:true
      };
    }


    return runOrganizationValidationDecision(
      "needs_information",
      {
        reviewedBy:
          "agent-central-bociteart",

        reason:
          "L'identité professionnelle n'a pas été retrouvée dans la source officielle."
      }
    );
  }


  const checks =
    bociteCheckProfessionalOrganization(
      organization,
      official
    );


  const validation =
    checkOrganizationValidation(
      organization,
      checks
    );


  if(
    !validation ||
    validation.ok !== true ||
    validation.complete !== true
  ){

    return runOrganizationValidationDecision(
      "needs_information",
      {
        reviewedBy:
          "agent-central-bociteart",

        reason:
          "Certaines informations professionnelles doivent être corrigées ou complétées.",

        checks:
          checks
      }
    );
  }


  /*
    Tous les contrôles obligatoires
    sont concordants.

    Le moteur central existant effectue
    ensuite la validation et émet
    l'identifiant professionnel permanent
    ainsi que le code initial.
  */

  const result =
    await runOrganizationValidationDecision(
      "validated",
      {
        reviewedBy:
          "agent-central-bociteart",

        reason:
          "Contrôles professionnels automatiques conformes.",

        checks:
          checks
      }
    );


  if(
    result &&
    result.ok === true
  ){

    addSecurityLog(
      "automatic_organization_validation",
      {
        organizationId:
          organization.organizationId,

        category:
          organization.category,

        source:
          official.source,

        siren:
          official.siren,

        siret:
          official.siret,

        checkedAt:
          new Date().toISOString()
      }
    );
  }


  return result;
}
   
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


  /*
    CONSULTATION DE LA VALIDATION.

    Les fonctions qui modifient
    les contrôles ou la décision
    ne sont volontairement pas exposées.
  */

 getOrganizationValidationRequirements:
  getOrganizationValidationRequirements,

checkOrganizationValidation:
  checkOrganizationValidation,

getOrganizationValidationState:
  getOrganizationValidationState,

getProfessionalAccessState:
  getProfessionalAccessState,

verifyProfessionalInitialAccess:
  verifyProfessionalInitialAccess,

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

  runOrganizationValidationDecision:
  runOrganizationValidationDecision,

   runAutomaticOrganizationAgent:
  runAutomaticOrganizationAgent,

openOrganizationProfile:
  openOrganizationProfileForm, 

  storageKeys:
    Object.assign(
      {},
      STORAGE
    )
};

/* =========================================================
   COMPATIBILITÉ
   ========================================================= */

window.BociteAccount =
  window.BoCiteArtRegistration;

/* =========================================================
   INITIALISATION
   ========================================================= */

getInstallationId();

console.log(
  "✅ Étape création du compte Bo'CitéArt V7 prête"
);

/* =========================================================
   ÇA FINIT ICI
   BO'CITÉART — ORGANISATIONS
   DOSSIER — VALIDATION — ACCÈS
   ========================================================= */
})();
