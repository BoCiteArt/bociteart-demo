/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   CHEF D'ORCHESTRE UNIQUE DU PARCOURS

   1. INFORMATIONS LÉGALES
   2. INTRODUCTION
   3. CRÉATION DU COMPTE
   4. SYNOPTIQUE
   5. APPLICATION OFFICIELLE

   RÈGLE ESSENTIELLE :
   → seul ce fichier décide de l'étape suivante ;
   → aucun écran ne doit ouvrir directement un autre écran ;
   → aucun onglet existant de l'application n'est modifié.
   ========================================================= */

(function initBociteartStart(){

  "use strict";

  if(window.BociteStart){
    return;
  }

  /* =====================================================
     VERSION DU PARCOURS
     ===================================================== */

  const JOURNEY_VERSION =
    "8";

  /* =====================================================
     MODE PRÉSENTATION

     Avec ?presentation=1 dans l'adresse :
     le parcours complet recommence à chaque ouverture.

     Sans ce paramètre :
     le parcours apparaît seulement à la première utilisation.
     ===================================================== */

  const PRESENTATION_MODE =
    new URLSearchParams(
      window.location.search
    ).get("presentation") === "1";
   
  const STORAGE = {
    session:
      "bociteart_entry_session_v8",

    completed:
      "bociteart_entry_completed_v8"
  };

  const STEPS = {
    legal:
      "legal",

    introduction:
      "introduction",

    registration:
      "registration",

    synoptique:
      "synoptique",

    application:
      "application"
  };

  let currentStep =
    "";

  let transitionLocked =
    false;

  /* =====================================================
     STOCKAGE
     ===================================================== */

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

  function getStorageItem(key){

    try{

      return localStorage.getItem(key);

    }catch(error){

      return null;
    }
  }

  function setStorageItem(
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
        "Bo'CitéArt : stockage du parcours indisponible.",
        error
      );

      return false;
    }
  }

  function removeStorageItem(key){

    try{

      localStorage.removeItem(key);

      return true;

    }catch(error){

      return false;
    }
  }

  /* =====================================================
     ÉTAT DU PARCOURS
     ===================================================== */

  function getSession(){

    const saved =
      getStorageItem(
        STORAGE.session
      );

    return saved
      ? safeParse(saved, null)
      : null;
  }

  function saveSession(step){

    const session = {
      version:
        JOURNEY_VERSION,

      step:
        step,

      updatedAt:
        new Date().toISOString()
    };

    setStorageItem(
      STORAGE.session,
      JSON.stringify(session)
    );

    currentStep =
      step;

    return session;
  }

  function getCompletion(){

    const saved =
      getStorageItem(
        STORAGE.completed
      );

    return saved
      ? safeParse(saved, null)
      : null;
  }

  function journeyCompleted(){

    const completion =
      getCompletion();

    return Boolean(
      completion &&
      completion.completed === true &&
      completion.version ===
        JOURNEY_VERSION
    );
  }

  function saveCompletion(){

    const completion = {
      completed:true,

      version:
        JOURNEY_VERSION,

      completedAt:
        new Date().toISOString()
    };

    setStorageItem(
      STORAGE.completed,
      JSON.stringify(completion)
    );

    saveSession(
      STEPS.application
    );

    return completion;
  }

  /* =====================================================
     FERMETURE DES ÉCRANS DU NOUVEAU PARCOURS
     ===================================================== */

  function closeKnownOverlay(id){

    const element =
      document.getElementById(id);

    if(element){
      element.remove();
    }
  }

  function closeAllEntryScreens(){

    if(
      window.BociteLegal &&
      typeof window.BociteLegal.close ===
        "function"
    ){

      window.BociteLegal.close();
    }

    if(
      window.BociteIntroduction &&
      typeof window.BociteIntroduction.close ===
        "function"
    ){

      window.BociteIntroduction.close();
    }

    if(
      window.BoCiteArtRegistration &&
      typeof window.BoCiteArtRegistration.close ===
        "function"
    ){

      window.BoCiteArtRegistration.close();
    }

    if(
      window.BociteSynoptique &&
      typeof window.BociteSynoptique.close ===
        "function"
    ){

      window.BociteSynoptique.close();
    }

    closeKnownOverlay(
      "bociteLegalOverlay"
    );

    closeKnownOverlay(
      "bociteIntroductionOverlay"
    );

    closeKnownOverlay(
      "bociteRegistrationOverlay"
    );

    closeKnownOverlay(
      "bociteSynoptiqueOverlay"
    );
  }

  /* =====================================================
     VERROU DE TRANSITION
     Empêche un double clic d'ouvrir deux étapes.
     ===================================================== */

  function runTransition(callback){

    if(transitionLocked){
      return;
    }

    transitionLocked =
      true;

    try{

      callback();

    }finally{

      window.setTimeout(
        function(){

          transitionLocked =
            false;
        },
        250
      );
    }
  }

  /* =====================================================
     ÉTAPE 1 — INFORMATIONS LÉGALES
     ===================================================== */

  function openLegal(){

    runTransition(
      function(){

        closeAllEntryScreens();

        saveSession(
          STEPS.legal
        );

        if(
          window.BociteLegal &&
          typeof window.BociteLegal.open ===
            "function"
        ){

          window.BociteLegal.open();
          return;
        }

        console.error(
          "Bo'CitéArt : le module bociteart-legal.js n'est pas disponible."
        );
      }
    );
  }

  /* =====================================================
     ÉTAPE 2 — INTRODUCTION
     ===================================================== */

  function openIntroduction(){

    runTransition(
      function(){

        closeAllEntryScreens();

        saveSession(
          STEPS.introduction
        );

        if(
          window.BociteIntroduction &&
          typeof window.BociteIntroduction.open ===
            "function"
        ){

          window.BociteIntroduction.open();
          return;
        }

        console.error(
          "Bo'CitéArt : le module bociteart-introduction.js n'est pas disponible."
        );
      }
    );
  }

  /* =====================================================
     ÉTAPE 3 — CRÉATION DU COMPTE
     ===================================================== */

  function openRegistration(){

    runTransition(
      function(){

        closeAllEntryScreens();

        saveSession(
          STEPS.registration
        );

        if(
          window.BoCiteArtRegistration &&
          typeof window.BoCiteArtRegistration.open ===
            "function"
        ){

          window.BoCiteArtRegistration.open();
          return;
        }

        console.error(
          "Bo'CitéArt : le module bociteart-registration.js n'est pas disponible."
        );
      }
    );
  }

  /* =====================================================
     ÉTAPE 4 — SYNOPTIQUE
     ===================================================== */

  function openSynoptique(){

    runTransition(
      function(){

        closeAllEntryScreens();

        saveSession(
          STEPS.synoptique
        );

        if(
          window.BociteSynoptique &&
          typeof window.BociteSynoptique.open ===
            "function"
        ){

          window.BociteSynoptique.open();
          return;
        }

        console.error(
          "Bo'CitéArt : le module bociteart-synoptique.js n'est pas disponible."
        );
      }
    );
  }

  /* =====================================================
     ÉTAPE 5 — APPLICATION OFFICIELLE
     ===================================================== */

  function openApplication(){

    closeAllEntryScreens();

    saveCompletion();

    document.documentElement.style
      .removeProperty("overflow");

    document.body.style
      .removeProperty("overflow");

    window.scrollTo(
      0,
      0
    );

    /*
      Aucun espace particulier n'est ouvert ici.

      L'application officielle déjà présente
      dans index.html reste affichée sous les écrans
      de la porte d'entrée.

      Le parcours n'envoie donc pas l'utilisateur
      directement vers Entreprise, Commerce
      ou un autre onglet.
    */

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:application-ready",
        {
          detail:{
            journeyVersion:
              JOURNEY_VERSION,

            completedAt:
              new Date().toISOString()
          }
        }
      )
    );

    console.log(
      "✅ Parcours terminé — application officielle affichée"
    );
  }

  /* =====================================================
     RÉCEPTION DES VALIDATIONS
     ===================================================== */

  function handleLegalCompleted(){

    if(
      currentStep !==
      STEPS.legal
    ){
      return;
    }

    openIntroduction();
  }

  function handleIntroductionCompleted(){

    if(
      currentStep !==
      STEPS.introduction
    ){
      return;
    }

    openRegistration();
  }

  function handleRegistrationCompleted(){

    if(
      currentStep !==
      STEPS.registration
    ){
      return;
    }

    openSynoptique();
  }

  function handleSynoptiqueCompleted(){

    if(
      currentStep !==
      STEPS.synoptique
    ){
      return;
    }

    openApplication();
  }

  document.addEventListener(
    "bociteart:legal-completed",
    handleLegalCompleted
  );

  document.addEventListener(
    "bociteart:introduction-completed",
    handleIntroductionCompleted
  );

  document.addEventListener(
    "bociteart:registration-completed",
    handleRegistrationCompleted
  );

  document.addEventListener(
    "bociteart:synoptique-completed",
    handleSynoptiqueCompleted
  );

  /* =====================================================
     REPRISE DU PARCOURS
     ===================================================== */

function resume(){

  /*
    MODE PRÉSENTATION :
    le parcours complet recommence
    depuis les informations légales.
  */

  if(PRESENTATION_MODE){

    removeStorageItem(
      STORAGE.session
    );

    removeStorageItem(
      STORAGE.completed
    );

    currentStep =
      "";

    openLegal();

    console.log(
      "✅ Parcours complet affiché"
    );

    return;
  }

  /*
    MODE UTILISATEUR NORMAL :
    après la première validation complète,
    l'application s'ouvre directement.
  */

  if(journeyCompleted()){

    closeAllEntryScreens();

    currentStep =
      STEPS.application;

    console.log(
      "✅ Porte d'entrée déjà terminée — application affichée"
    );

    return;
  }

  const session =
    getSession();

  const savedStep =
    session &&
    session.version ===
      JOURNEY_VERSION
        ? session.step
        : "";

  switch(savedStep){

    case STEPS.introduction:

      openIntroduction();
      break;

    case STEPS.registration:

      openRegistration();
      break;

    case STEPS.synoptique:

      openSynoptique();
      break;

    case STEPS.legal:
    default:

      openLegal();
      break;
  }
}
  /* =====================================================
     RÉINITIALISATION DE TEST
     ===================================================== */

  function resetJourney(){

    removeStorageItem(
      STORAGE.session
    );

    removeStorageItem(
      STORAGE.completed
    );

    currentStep =
      "";

    closeAllEntryScreens();

    openLegal();

    console.log(
      "✅ Parcours Bo'CitéArt réinitialisé"
    );
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteStart = {
    resume:
      resume,

    reset:
      resetJourney,

    openLegal:
      openLegal,

    openIntroduction:
      openIntroduction,

    openRegistration:
      openRegistration,

    openSynoptique:
      openSynoptique,

    openApplication:
      openApplication,

    getCurrentStep:
      function(){

        return currentStep;
      },

    journeyCompleted:
      journeyCompleted,

    storageKeys:
      Object.assign(
        {},
        STORAGE
      ),

    version:
      JOURNEY_VERSION
  };

  /* =====================================================
     DÉMARRAGE UNIQUE
     ===================================================== */

  function startJourney(){

    window.setTimeout(
      resume,
      0
    );
  }

  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      startJourney,
      {
        once:true
      }
    );

  }else{

    startJourney();
  }

  console.log(
    "✅ Chef d'orchestre Bo'CitéArt V8 chargé"
  );

})();
