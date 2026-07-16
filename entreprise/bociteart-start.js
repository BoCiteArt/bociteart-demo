/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   CHEF D'ORCHESTRE DU PARCOURS

   INTRODUCTION
   → INFORMATIONS LÉGALES
   → SYNOPTIQUE
   → CHOIX DE L'UNIVERS
   → APPLICATION EXISTANTE

   Aucun onglet existant n'est modifié.
   ========================================================= */

(function initBociteartStart(){

  "use strict";

  if(window.BociteStart){
    return;
  }

  const SESSION_KEY =
    "bociteart_entry_session_v1";

  function closeAllEntryScreens(){

    const ids = [
      "bociteIntroductionOverlay",
      "bociteLegalOverlay",
      "bociteSynoptiqueOverlay",
      "bociteProfilsOverlay"
    ];

    ids.forEach(function(id){

      const element =
        document.getElementById(id);

      if(element){
        element.remove();
      }
    });
  }

  function getSavedSession(){

    try{

      const saved =
        sessionStorage.getItem(
          SESSION_KEY
        );

      return saved
        ? JSON.parse(saved)
        : null;

    }catch(error){

      return null;
    }
  }

  function saveSession(step){

    const record = {
      step:step,
      updatedAt:
        new Date().toISOString()
    };

    try{

      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(record)
      );

    }catch(error){

      console.warn(
        "Bo'CitéArt : session d'entrée non enregistrée.",
        error
      );
    }

    return record;
  }

  function openIntroduction(){

    closeAllEntryScreens();

    saveSession(
      "introduction"
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
      "Bo'CitéArt : introduction indisponible."
    );
  }

  function openLegal(){

    closeAllEntryScreens();

    saveSession(
      "legal"
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
      "Bo'CitéArt : informations légales indisponibles."
    );
  }

  function openSynoptique(){

    closeAllEntryScreens();

    saveSession(
      "synoptique"
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
      "Bo'CitéArt : synoptique indisponible."
    );
  }

  function openProfiles(){

    closeAllEntryScreens();

    saveSession(
      "profils"
    );

    if(
      window.BociteProfils &&
      typeof window.BociteProfils.open ===
      "function"
    ){
      window.BociteProfils.open();
      return;
    }

    console.error(
      "Bo'CitéArt : choix des univers indisponible."
    );
  }

  function enterExistingApplication(profile){

    closeAllEntryScreens();

    saveSession(
      "application"
    );

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:entry-complete",
        {
          detail:{
            profile:
              profile || null,
            enteredAt:
              new Date().toISOString()
          }
        }
      )
    );
  }

  function bindJourneyEvents(){

    document.addEventListener(
      "bociteart:open-legal",
      function(){

        openLegal();
      }
    );

    document.addEventListener(
      "bociteart:open-synoptique",
      function(){

        openSynoptique();
      }
    );

    document.addEventListener(
      "bociteart:open-profils",
      function(){

        openProfiles();
      }
    );

    document.addEventListener(
      "bociteart:profile-selected",
      function(event){

        enterExistingApplication(
          event.detail
            ? event.detail.profile
            : null
        );
      }
    );

    document.addEventListener(
      "bociteart:enter-existing-app",
      function(event){

        enterExistingApplication(
          event.detail
            ? event.detail.profile
            : null
        );
      }
    );
  }

  function startJourney(){

    /*
      Pour le premier raccordement,
      l'introduction s'ouvre systématiquement.

      Aucun onglet existant n'est remplacé.
    */

    openIntroduction();
  }

  function restartJourney(){

    try{

      sessionStorage.removeItem(
        SESSION_KEY
      );

    }catch(error){
      /* Rien à faire. */
    }

    openIntroduction();
  }

  function resumeJourney(){

    const session =
      getSavedSession();

    if(!session){

      openIntroduction();
      return;
    }

    switch(session.step){

      case "legal":
        openLegal();
        break;

      case "synoptique":
        openSynoptique();
        break;

      case "profils":
        openProfiles();
        break;

      case "application":
        closeAllEntryScreens();
        break;

      default:
        openIntroduction();
    }
  }

  window.BociteStart = {
    start:startJourney,
    restart:restartJourney,
    resume:resumeJourney,
    openIntroduction:openIntroduction,
    openLegal:openLegal,
    openSynoptique:openSynoptique,
    openProfiles:openProfiles,
    close:closeAllEntryScreens
  };

  bindJourneyEvents();

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

    window.setTimeout(
      startJourney,
      0
    );
  }

  console.log(
    "✅ Parcours d'entrée général Bo'CitéArt démarré"
  );

})();
