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
      "bociteart_declared_commune_v1"
  };

  const MAX_STATISTICS =
    250;

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

      category:
        normalizeCategory(
          source.category ||
          source.profile
        ),

      commune:
        normalizeText(
          source.commune
        ),

      createdAt:
        source.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      version:
        "1"
    };
  }

  function createAccount(data){

    const account =
      sanitizeAccount(data);

    setLocalStorageItem(
      STORAGE.account,
      JSON.stringify(account)
    );

    setLocalStorageItem(
      STORAGE.registration,
      "true"
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

    addStatistic({
      type:"inscription_terminee",

      category:
        account.category,

      commune:
        account.commune
    });

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

    removeLocalStorageItem(
      STORAGE.account
    );

    removeLocalStorageItem(
      STORAGE.registration
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

    if(
      !displayName ||
      !email ||
      !category ||
      !commune
    ){

      if(message){

        message.textContent =
          "Complétez tous les champs avant de continuer.";

        message.style.display =
          "block";
      }

      return;
    }

    if(
      !email.includes("@") ||
      !email.includes(".")
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

        category:
          category,

        commune:
          commune
      });

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
              account.commune
          }
        }
      )
    );
  }

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
