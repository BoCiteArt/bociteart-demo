/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE GÉNÉRALE
   CHEF D'ORCHESTRE UNIQUE — VERSION 4

   ORDRE OBLIGATOIRE :

   1 — RGPD / CGU / CGV
   2 — INTRODUCTION
   3 — JE CRÉE MON COMPTE
   4 — SYNOPTIQUE
   5 — APPLICATION EXISTANTE

   La tuile « Commerces & Entreprises »
   n'est pas interceptée par ce fichier.
   ========================================================= */

(function initBociteartStartV4(){

  "use strict";

  if(window.BociteStartV4Loaded){
    return;
  }

  window.BociteStartV4Loaded = true;

  /* =====================================================
     STOCKAGE
     ===================================================== */

 const STORAGE = {
  session:
    "bociteart_entry_session_v5",

  completed:
    "bociteart_entry_completed_v5"
};
  let currentStep = "";
  let transitionRunning = false;

  /* =====================================================
     OUTILS DE STOCKAGE
     ===================================================== */

  function safeParse(value, fallback){

    try{
      return JSON.parse(value);
    }catch(error){
      return fallback;
    }
  }

  function saveLocal(key, value){

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

  function getLocal(key){

    try{

      return localStorage.getItem(
        key
      );

    }catch(error){

      return null;
    }
  }

  function removeLocal(key){

    try{

      localStorage.removeItem(
        key
      );

    }catch(error){
      /* Rien à faire. */
    }
  }

  function saveStep(step, detail){

    currentStep = step;

    const record = {
      step:step,
      detail:detail || null,
      updatedAt:new Date().toISOString()
    };

    saveLocal(
      STORAGE.session,
      JSON.stringify(record)
    );

    return record;
  }

  function getSavedStep(){

    const saved =
      getLocal(
        STORAGE.session
      );

    return saved
      ? safeParse(saved, null)
      : null;
  }

  function isCompleted(){

    return (
      getLocal(
        STORAGE.completed
      ) === "true"
    );
  }

  /* =====================================================
     FERMETURE DES ÉCRANS DU PARCOURS
     ===================================================== */

  function removeElement(id){

    const element =
      document.getElementById(id);

    if(element){
      element.remove();
    }
  }

  function closeAllEntryScreens(){

    [
      "bociteLegalOverlay",
      "bociteIntroductionOverlay",
      "bociteRegistrationOverlay",
      "bociteSynoptiqueOverlay",
      "bociteProfilsOverlay"
    ].forEach(
      removeElement
    );
  }

  /* =====================================================
     ANCIENS ÉCRANS DE INDEX.HTML

     Ils sont uniquement masqués.
     Ils ne sont ni supprimés
     ni modifiés dans ce fichier.
     ===================================================== */

  function installLegacyScreenProtection(){

    if(
      document.getElementById(
        "bociteLegacyEntryProtection"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteLegacyEntryProtection";

    style.textContent = `
      body.bocite-entry-running
      #welcomeScreen,

      body.bocite-entry-running
      #registrationScreen,

      body.bocite-entry-running
      #registerScreen,

      body.bocite-entry-running
      #accountCreationScreen,

      body.bocite-entry-running
      .welcome-screen,

      body.bocite-entry-running
      .registration-screen,

      body.bocite-entry-running
      .register-screen,

      body.bocite-entry-running
      [data-screen="welcome"],

      body.bocite-entry-running
      [data-screen="registration"] {
        display:none !important;
        visibility:hidden !important;
        pointer-events:none !important;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /* =====================================================
     MASQUAGE DE L'APPLICATION PENDANT LE PARCOURS
     ===================================================== */

  function hideApplication(){

    document.body.classList.add(
      "bocite-entry-running"
    );
  }

  function showApplication(){

    document.body.classList.remove(
      "bocite-entry-running"
    );
  }

  /* =====================================================
     PROTECTION CONTRE LES DOUBLES TRANSITIONS
     ===================================================== */

  function beginTransition(){

    if(transitionRunning){
      return false;
    }

    transitionRunning = true;

    window.setTimeout(
      function(){

        transitionRunning = false;

      },
      250
    );

    return true;
  }

  /* =====================================================
     ÉTAPE 1 — RGPD / CGU / CGV
     ===================================================== */

  function openLegal(){

    closeAllEntryScreens();
    hideApplication();

    saveStep(
      "legal"
    );

    if(
      window.BociteLegal &&
      typeof window.BociteLegal.open ===
      "function"
    ){

      window.BociteLegal.open();
      return true;
    }

    console.error(
      "Bo'CitéArt : bociteart-legal.js n'est pas disponible."
    );

    return false;
  }

  /* =====================================================
     ÉTAPE 2 — INTRODUCTION
     ===================================================== */

  function openIntroduction(){

    closeAllEntryScreens();
    hideApplication();

    saveStep(
      "introduction"
    );

    if(
      window.BociteIntroduction &&
      typeof window.BociteIntroduction.open ===
      "function"
    ){

      window.BociteIntroduction.open();
      return true;
    }

    console.error(
      "Bo'CitéArt : bociteart-introduction.js n'est pas disponible."
    );

    return false;
  }

  /* =====================================================
     ÉTAPE 3 — JE CRÉE MON COMPTE
     ===================================================== */

  function openRegistration(){

    closeAllEntryScreens();
    hideApplication();

    saveStep(
      "registration"
    );

    if(
      window.BociteRegistration &&
      typeof window.BociteRegistration.open ===
      "function"
    ){

      window.BociteRegistration.open();
      return true;
    }

    if(
      window.BoCiteArtRegistration &&
      typeof window.BoCiteArtRegistration.open ===
      "function"
    ){

      window.BoCiteArtRegistration.open();
      return true;
    }

    console.error(
      "Bo'CitéArt : la nouvelle page « Je crée mon compte » n'est pas encore disponible."
    );

    return false;
  }

  /* =====================================================
     ÉTAPE 4 — SYNOPTIQUE
     ===================================================== */

  function openSynoptique(){

    closeAllEntryScreens();
    hideApplication();

    saveStep(
      "synoptique"
    );

    if(
      window.BociteSynoptique &&
      typeof window.BociteSynoptique.open ===
      "function"
    ){

      window.BociteSynoptique.open();
      return true;
    }

    console.error(
      "Bo'CitéArt : bociteart-synoptique.js n'est pas disponible."
    );

    return false;
  }

  /* =====================================================
     ÉTAPE 5 — APPLICATION
     ===================================================== */

  function enterApplication(){

    closeAllEntryScreens();
    showApplication();

    currentStep =
      "application";

    saveLocal(
      STORAGE.completed,
      "true"
    );

    saveStep(
      "application",
      {
        completedAt:
          new Date().toISOString()
      }
    );

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:entry-complete",
        {
          detail:{
            completed:true,
            enteredAt:
              new Date().toISOString()
          }
        }
      )
    );

    console.log(
      "✅ Parcours terminé — application Bo'CitéArt ouverte"
    );
  }

  /* =====================================================
     ÉVÉNEMENTS DU NOUVEAU PARCOURS
     ===================================================== */

  function handleLegalCompleted(){

    if(
      currentStep !== "legal" ||
      !beginTransition()
    ){
      return;
    }

    openIntroduction();
  }

  function handleIntroductionCompleted(){

    if(
      currentStep !== "introduction" ||
      !beginTransition()
    ){
      return;
    }

    openRegistration();
  }

  function handleRegistrationCompleted(event){

    if(
      currentStep !== "registration" ||
      !beginTransition()
    ){
      return;
    }

    saveStep(
      "registration",
      event && event.detail
        ? event.detail
        : null
    );

    openSynoptique();
  }

  function handleSynoptiqueCompleted(){

    if(
      currentStep !== "synoptique" ||
      !beginTransition()
    ){
      return;
    }

    enterApplication();
  }

  function bindJourneyEvents(){

    document.addEventListener(
      "bociteart:legal-completed",
      handleLegalCompleted
    );

    window.addEventListener(
      "bociteart:legal-completed",
      handleLegalCompleted
    );

    document.addEventListener(
      "bociteart:introduction-completed",
      handleIntroductionCompleted
    );

    window.addEventListener(
      "bociteart:introduction-completed",
      handleIntroductionCompleted
    );

    document.addEventListener(
      "bociteart:registration-completed",
      handleRegistrationCompleted
    );

    window.addEventListener(
      "bociteart:registration-completed",
      handleRegistrationCompleted
    );

    document.addEventListener(
      "bociteart:synoptique-completed",
      handleSynoptiqueCompleted
    );

    window.addEventListener(
      "bociteart:synoptique-completed",
      handleSynoptiqueCompleted
    );
  }

  /* =====================================================
     RETOURS
     ===================================================== */

  function backToLegal(){

    openLegal();
  }

  function backToIntroduction(){

    openIntroduction();
  }

  function backToRegistration(){

    openRegistration();
  }

  /* =====================================================
     REPRISE DU PARCOURS
     ===================================================== */

  function resume(){

    const saved =
      getSavedStep();

    if(!saved || !saved.step){

      openLegal();
      return;
    }

    switch(saved.step){

      case "legal":

        openLegal();
        break;

      case "introduction":

        openIntroduction();
        break;

      case "registration":

        openRegistration();
        break;

      case "synoptique":

        openSynoptique();
        break;

      case "application":

        enterApplication();
        break;

      default:

        openLegal();
    }
  }

  /* =====================================================
     RECOMMENCER DEPUIS LE DÉBUT
     ===================================================== */

  function restart(){

    removeLocal(
      STORAGE.session
    );

    removeLocal(
      STORAGE.completed
    );

    currentStep = "";
    transitionRunning = false;

    openLegal();
  }

  /* =====================================================
     DÉMARRAGE
     ===================================================== */

  function start(){

    installLegacyScreenProtection();

    /*
      Si le parcours V4 est déjà terminé,
      l'application s'ouvre directement.
    */

    if(isCompleted()){

      enterApplication();
      return;
    }

    /*
      Sinon, reprise de l'étape enregistrée.
      À la première visite :
      ouverture obligatoire du RGPD.
    */

    resume();
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteStart = {

    start:
      start,

    restart:
      restart,

    resume:
      resume,

    openLegal:
      openLegal,

    openIntroduction:
      openIntroduction,

    openRegistration:
      openRegistration,

    openSynoptique:
      openSynoptique,

    enterApplication:
      enterApplication,

    backToLegal:
      backToLegal,

    backToIntroduction:
      backToIntroduction,

    backToRegistration:
      backToRegistration,

    closeEntryScreens:
      closeAllEntryScreens,

    getCurrentStep:
      function(){

        return currentStep;
      },

    isCompleted:
      isCompleted
  };

  bindJourneyEvents();

  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      start,
      {
        once:true
      }
    );

  }else{

    window.setTimeout(
      start,
      0
    );
  }

  console.log(
    "✅ Chef d'orchestre Bo'CitéArt V4 chargé"
  );

})();
