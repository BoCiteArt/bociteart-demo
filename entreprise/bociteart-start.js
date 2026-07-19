/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE GÉNÉRALE
   CHEF D'ORCHESTRE UNIQUE

   ORDRE DÉFINITIF :

   1 — RGPD / CGU / CGV
   2 — INTRODUCTION
   3 — CRÉER MON COMPTE
   4 — SYNOPTIQUE
   5 — APPLICATION EXISTANTE

   IMPORTANT :

   → Le parcours se déroule avant l’application.
   → La tuile « Commerces & Entreprises »
     n’est plus interceptée.
   → Une fois dans l’application,
     cette tuile fonctionne normalement.
   → Aucun module existant de l’application
     n’est modifié par ce fichier.
   ========================================================= */

(function initBociteartStart(){

  "use strict";

  if(window.BociteStart){
    return;
  }

  /* =====================================================
     STOCKAGE DU PARCOURS
     ===================================================== */

  const STORAGE = {

    session:
      "bociteart_entry_session_v3",

    completed:
      "bociteart_entry_completed_v3"
  };

  let currentStep =
    "";

  let journeyRunning =
    false;

  let applicationEntered =
    false;

  /* =====================================================
     OUTILS
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

  function saveLocal(
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

  function saveSession(
    step,
    detail
  ){

    currentStep =
      step;

    const record = {

      step:
        step,

      detail:
        detail || null,

      updatedAt:
        new Date().toISOString()
    };

    saveLocal(
      STORAGE.session,
      JSON.stringify(record)
    );

    return record;
  }

  function getSession(){

    const saved =
      getLocal(
        STORAGE.session
      );

    return saved
      ? safeParse(
          saved,
          null
        )
      : null;
  }

  function isJourneyCompleted(){

    return (
      getLocal(
        STORAGE.completed
      ) === "true"
    );
  }

  function markJourneyCompleted(){

    saveLocal(
      STORAGE.completed,
      "true"
    );

    saveSession(
      "application",
      {
        completedAt:
          new Date().toISOString()
      }
    );
  }

  /* =====================================================
     SUPPRESSION DES ÉCRANS DE LA PORTE D'ENTRÉE
     ===================================================== */

  function closeEntryScreens(){

    [
      "bociteLegalOverlay",
      "bociteIntroductionOverlay",
      "bociteRegistrationOverlay",
      "bociteSynoptiqueOverlay",
      "bociteProfilsOverlay"
    ].forEach(function(id){

      const element =
        document.getElementById(id);

      if(element){
        element.remove();
      }
    });
  }

  /* =====================================================
     MASQUAGE TEMPORAIRE DE L'APPLICATION

     Le contenu existant n'est ni supprimé,
     ni modifié.

     Il est seulement masqué pendant
     le parcours d'entrée.
     ===================================================== */

  function hideExistingApplication(){

    if(
      document.getElementById(
        "bociteEntryApplicationMask"
      )
    ){
      return;
    }

    const mask =
      document.createElement("style");

    mask.id =
      "bociteEntryApplicationMask";

    mask.textContent = `
      body > *:not(
        script
      ):not(
        style
      ):not(
        #bociteLegalOverlay
      ):not(
        #bociteIntroductionOverlay
      ):not(
        #bociteRegistrationOverlay
      ):not(
        #bociteSynoptiqueOverlay
      ):not(
        #bociteProfilsOverlay
      ) {
        visibility:hidden !important;
      }
    `;

    document.head.appendChild(
      mask
    );
  }

  function showExistingApplication(){

    const mask =
      document.getElementById(
        "bociteEntryApplicationMask"
      );

    if(mask){
      mask.remove();
    }
  }

  /* =====================================================
     ÉTAPE 1 — INFORMATIONS LÉGALES
     ===================================================== */

  function openLegal(){

    closeEntryScreens();
    hideExistingApplication();

    journeyRunning =
      true;

    applicationEntered =
      false;

    saveSession(
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
      "Bo'CitéArt : le module légal est indisponible."
    );

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:open-legal"
      )
    );

    return false;
  }

  /* =====================================================
     ÉTAPE 2 — INTRODUCTION
     ===================================================== */

  function openIntroduction(){

    closeEntryScreens();
    hideExistingApplication();

    journeyRunning =
      true;

    saveSession(
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
      "Bo'CitéArt : le module d'introduction est indisponible."
    );

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:open-introduction"
      )
    );

    return false;
  }

  /* =====================================================
     ÉTAPE 3 — CRÉER MON COMPTE
     ===================================================== */

  function openRegistration(){

    closeEntryScreens();
    hideExistingApplication();

    journeyRunning =
      true;

    saveSession(
      "registration"
    );

    /*
      API prévue pour la nouvelle page
      « Créer mon compte ».
    */

    if(
      window.BociteRegistration &&
      typeof window.BociteRegistration.open ===
      "function"
    ){

      window.BociteRegistration.open();
      return true;
    }

    /*
      Compatibilité si l'API porte
      le nom complet du module.
    */

    if(
      window.BoCiteArtRegistration &&
      typeof window.BoCiteArtRegistration.open ===
      "function"
    ){

      window.BoCiteArtRegistration.open();
      return true;
    }

    console.error(
      "Bo'CitéArt : la page Créer mon compte est indisponible."
    );

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:open-registration"
      )
    );

    return false;
  }

  /* =====================================================
     ÉTAPE 4 — SYNOPTIQUE
     ===================================================== */

  function openSynoptique(){

    closeEntryScreens();
    hideExistingApplication();

    journeyRunning =
      true;

    saveSession(
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
      "Bo'CitéArt : le synoptique est indisponible."
    );

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:open-synoptique"
      )
    );

    return false;
  }

  /* =====================================================
     ÉTAPE 5 — APPLICATION EXISTANTE
     ===================================================== */

  function enterExistingApplication(){

    closeEntryScreens();
    showExistingApplication();

    journeyRunning =
      false;

    applicationEntered =
      true;

    markJourneyCompleted();

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:entry-complete",
        {
          detail:{

            completed:
              true,

            enteredAt:
              new Date().toISOString()
          }
        }
      )
    );

    console.log(
      "✅ Porte d'entrée terminée — application Bo'CitéArt ouverte"
    );
  }

  /* =====================================================
     NAVIGATION RETOUR
     ===================================================== */

  function backFromLegal(){

    /*
      Première page du parcours :
      aucun écran précédent.
    */

    openLegal();
  }

  function backFromIntroduction(){

    openLegal();
  }

  function backFromRegistration(){

    openIntroduction();
  }

  function backFromSynoptique(){

    openRegistration();
  }

  /* =====================================================
     REPRISE DU PARCOURS
     ===================================================== */

  function resumeJourney(){

    const session =
      getSession();

    if(!session){

      openLegal();
      return;
    }

    switch(session.step){

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

        enterExistingApplication();
        break;

      default:

        openLegal();
    }
  }

  /* =====================================================
     NOUVEAU DÉPART COMPLET
     ===================================================== */

  function restartJourney(){

    removeLocal(
      STORAGE.session
    );

    removeLocal(
      STORAGE.completed
    );

    currentStep =
      "";

    journeyRunning =
      false;

    applicationEntered =
      false;

    openLegal();
  }

  /* =====================================================
     ÉVÉNEMENTS UNIQUES DU PARCOURS
     ===================================================== */

  function bindJourneyEvents(){

    /*
      RGPD / CGU / CGV validés
      → Introduction
    */

    document.addEventListener(
      "bociteart:legal-completed",
      function(){

        if(
          currentStep !== "legal"
        ){
          return;
        }

        openIntroduction();
      }
    );

    /*
      Introduction terminée
      → Créer mon compte
    */

    document.addEventListener(
      "bociteart:introduction-completed",
      function(){

        if(
          currentStep !== "introduction"
        ){
          return;
        }

        openRegistration();
      }
    );

    /*
      Compte créé ou activation confirmée
      → Synoptique
    */

    document.addEventListener(
      "bociteart:registration-completed",
      function(event){

        if(
          currentStep !== "registration"
        ){
          return;
        }

        saveSession(
          "registration",
          event && event.detail
            ? event.detail
            : null
        );

        openSynoptique();
      }
    );

    /*
      Synoptique terminé
      → Application existante
    */

    document.addEventListener(
      "bociteart:synoptique-completed",
      function(){

        if(
          currentStep !== "synoptique"
        ){
          return;
        }

        enterExistingApplication();
      }
    );
  }

  /* =====================================================
     DÉMARRAGE AUTOMATIQUE
     ===================================================== */

  function start(){

    /*
      Parcours déjà terminé :
      l'application s'affiche immédiatement.
    */

    if(
      isJourneyCompleted()
    ){

      enterExistingApplication();
      return;
    }

    /*
      Première utilisation ou parcours inachevé.
    */

    resumeJourney();
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteStart = {

    start:
      start,

    restart:
      restartJourney,

    resume:
      resumeJourney,

    openLegal:
      openLegal,

    openIntroduction:
      openIntroduction,

    openRegistration:
      openRegistration,

    openSynoptique:
      openSynoptique,

    enterApplication:
      enterExistingApplication,

    backFromLegal:
      backFromLegal,

    backFromIntroduction:
      backFromIntroduction,

    backFromRegistration:
      backFromRegistration,

    backFromSynoptique:
      backFromSynoptique,

    closeEntryScreens:
      closeEntryScreens,

    isCompleted:
      isJourneyCompleted,

    getCurrentStep:
      function(){

        return currentStep;
      },

    isRunning:
      function(){

        return journeyRunning;
      },

    applicationIsOpen:
      function(){

        return applicationEntered;
      }
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
    "✅ Chef d'orchestre Bo'CitéArt V3 chargé"
  );

})();
