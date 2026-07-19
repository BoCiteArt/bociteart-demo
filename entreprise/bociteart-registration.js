/* =========================================================
   BO'CITÉART — MODULE INSCRIPTION ET STATISTIQUES ANONYMES

   Fichier :
   entreprise/bociteart-registration.js

   Ce module gère :
   → l’identifiant anonyme d’installation ;
   → l’activation unique ;
   → le profil déclaré ;
   → la commune déclarée ;
   → l’enregistrement local d’un compte ;
   → la file statistique anonyme.

   Aucun nom n’est ajouté aux statistiques anonymes.
   ========================================================= */

(function initBociteartRegistration(){

  "use strict";

  if(window.BoCiteArtRegistration){
    return;
  }

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

  function safeParse(value, fallback){

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
     PROFIL DÉCLARÉ
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

    addStatistic({
      type:"categorie_declaree",
      category:category
    });

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

    if(
      record &&
      record.profile
    ){

      return normalizeCategory(
        record.profile
      );
    }

    return "";
  }

  /* =====================================================
     COMMUNE DÉCLARÉE
     ===================================================== */

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

    addStatistic({
      type:"commune_declaree",
      commune:normalizedCommune
    });

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

    const category =
      normalizeCategory(
        source.category ||
        source.profile ||
        getDeclaredProfile()
      );

    const commune =
      normalizeText(
        source.commune ||
        getDeclaredCommune()
      );

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
          source.event ||
          "information"
        ),

      category:
        category || null,

      commune:
        commune || null,

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

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:statistic-added",
        {
          detail:{
            statisticId:
              statistic.statisticId,

            type:
              statistic.type
          }
        }
      )
    );

    return statistic;
  }

  function getStatistics(){

    return loadStatisticsQueue();
  }

  function clearStatistics(){

    saveStatisticsQueue([]);

    return true;
  }

  function markStatisticsAsSent(
    statisticIds
  ){

    const ids =
      Array.isArray(statisticIds)
        ? statisticIds
        : [];

    if(!ids.length){
      return loadStatisticsQueue();
    }

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

  function getPendingStatistics(){

    return loadStatisticsQueue()
      .filter(function(statistic){

        return statistic.sent !== true;
      });
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

    const account =
      Object.assign(
        {},
        source
      );

    account.accountId =
      source.accountId ||
      createUniqueId(
        "bociteart-account"
      );

    account.createdAt =
      source.createdAt ||
      new Date().toISOString();

    account.updatedAt =
      new Date().toISOString();

    const category =
      normalizeCategory(
        source.category ||
        source.profile
      );

    if(category){

      account.category =
        category;

      saveDeclaredProfile(
        category
      );
    }

    const commune =
      normalizeText(
        source.commune
      );

    if(commune){

      account.commune =
        commune;

      saveDeclaredCommune(
        commune
      );
    }

    return account;
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

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:registration-completed",
        {
          detail:{
            accountId:
              account.accountId,

            category:
              account.category ||
              null,

            commune:
              account.commune ||
              null
          }
        }
      )
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

    removeLocalStorageItem(
      STORAGE.account
    );

    removeLocalStorageItem(
      STORAGE.registration
    );

    return true;
  }

  /* =====================================================
     SYNCHRONISATION AVEC LE CHOIX DU PROFIL
     ===================================================== */

  document.addEventListener(
    "bociteart:profile-selected",
    function(event){

      const detail =
        event &&
        event.detail
          ? event.detail
          : {};

      const profile =
        detail.profile ||
        detail.category;

      if(profile){

        saveDeclaredProfile(
          profile
        );
      }

      if(!hasActivation()){

        activateInstallation({
          category:
            profile,

          commune:
            getDeclaredCommune()
        });
      }
    }
  );

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BoCiteArtRegistration = {
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
    "✅ Inscription et statistiques anonymes Bo'CitéArt chargées"
  );

})();
