/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   CHEF D'ORCHESTRE UNIQUE DU PARCOURS

   CLIC COMMERCES & ENTREPRISES
   → INTRODUCTION
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
    "bociteart_entry_session_v2";

  let pendingCommerceEntrepriseButton = null;
  let journeyIsRunning = false;
  let allowNextExistingOpening = false;

  /* =====================================================
     OUTILS
     ===================================================== */

  function normalizeText(value){

    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function saveSession(step, detail){

    const record = {
      step:step,
      detail:detail || null,
      updatedAt:new Date().toISOString()
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

  function clearSession(){

    try{

      sessionStorage.removeItem(
        SESSION_KEY
      );

    }catch(error){
      /* Rien à faire. */
    }
  }

  function closeAllEntryScreens(){

    [
      "bociteIntroductionOverlay",
      "bociteLegalOverlay",
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
     OUVERTURE DES ÉTAPES
     ===================================================== */

  function openIntroduction(){

    closeAllEntryScreens();

    journeyIsRunning = true;

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

    journeyIsRunning = true;

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

    journeyIsRunning = true;

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

    journeyIsRunning = true;

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

  /* =====================================================
     FIN DU PARCOURS
     ===================================================== */

  function completeJourney(profile){

    closeAllEntryScreens();

    journeyIsRunning = false;
    allowNextExistingOpening = true;

    saveSession(
      "application",
      {
        profile:profile || null
      }
    );

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:entry-complete",
        {
          detail:{
            profile:profile || null,
            enteredAt:new Date().toISOString()
          }
        }
      )
    );
  }

  function openPendingCommerceEntreprise(){

    if(
      !pendingCommerceEntrepriseButton ||
      !document.body.contains(
        pendingCommerceEntrepriseButton
      )
    ){

      pendingCommerceEntrepriseButton = null;
      return false;
    }

    const buttonToOpen =
      pendingCommerceEntrepriseButton;

    pendingCommerceEntrepriseButton = null;
    allowNextExistingOpening = true;

    window.setTimeout(
      function(){

        buttonToOpen.click();

      },
      80
    );

    return true;
  }

  /* =====================================================
     DÉTECTION DE LA TUILE COMMERCES & ENTREPRISES
     ===================================================== */

  function isCommerceEntrepriseTrigger(element){

    if(!element){
      return false;
    }

    const text =
      normalizeText(
        element.textContent
      );

    return (
      text.includes(
        "commerces & entreprises"
      ) ||
      text.includes(
        "commerces et entreprises"
      )
    );
  }

  function bindCommerceEntrepriseTile(){

    document.addEventListener(
      "click",
      function(event){

        const trigger =
          event.target.closest(
            "button, a, [role='button'], [onclick], .choiceBtn"
          );

        if(
          !trigger ||
          !isCommerceEntrepriseTrigger(
            trigger
          )
        ){
          return;
        }

        /*
          Autorisation donnée après le parcours :
          le clic final ouvre normalement l'espace existant.
        */

        if(allowNextExistingOpening){

          allowNextExistingOpening = false;
          return;
        }

        /*
          Pendant le parcours, aucun nouveau départ.
        */

        if(journeyIsRunning){

          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        pendingCommerceEntrepriseButton =
          trigger;

        openIntroduction();

      },
      true
    );
  }

  /* =====================================================
     ÉVÉNEMENTS DU PARCOURS
     ===================================================== */

  function bindJourneyEvents(){

    /*
      Le bouton de l'introduction envoie actuellement :
      window → bociteart:open-synoptique

      Le chef d'orchestre le transforme en :
      INTRODUCTION → INFORMATIONS LÉGALES
    */

    window.addEventListener(
      "bociteart:open-synoptique",
      function(){

        const session =
          getSavedSession();

        if(
          session &&
          session.step === "introduction"
        ){

          openLegal();
          return;
        }

        openSynoptique();
      }
    );

    /*
      Après validation légale :
      document → bociteart:open-synoptique
    */

    document.addEventListener(
      "bociteart:open-synoptique",
      function(){

        const session =
          getSavedSession();

        if(
          session &&
          session.step === "legal"
        ){

          saveSession(
            "synoptique"
          );

          journeyIsRunning = true;
        }
      },
      true
    );

    /*
      Après le synoptique :
      document → bociteart:open-profils
    */

    document.addEventListener(
      "bociteart:open-profils",
      function(){

        saveSession(
          "profils"
        );

        journeyIsRunning = true;
      },
      true
    );

    /*
      Le profil est enregistré.

      On ne relance surtout plus l'introduction.
    */

    document.addEventListener(
      "bociteart:profile-selected",
      function(event){

        const profile =
          event.detail &&
          event.detail.profile
            ? event.detail.profile
            : null;

        completeJourney(
          profile
        );
      },
      true
    );

    window.addEventListener(
      "bociteart:profile-selected",
      function(event){

        const profile =
          event.detail &&
          event.detail.profile
            ? event.detail.profile
            : null;

        completeJourney(
          profile
        );
      },
      true
    );

    /*
      Solution de secours lorsqu'un module
      ne trouve pas directement son espace.
    */

    document.addEventListener(
      "bociteart:enter-existing-app",
      function(event){

        const profile =
          event.detail &&
          event.detail.profile
            ? event.detail.profile
            : null;

        completeJourney(
          profile
        );

        openPendingCommerceEntreprise();
      }
    );

    window.addEventListener(
      "bociteart:enter-existing-app",
      function(event){

        const profile =
          event.detail &&
          event.detail.profile
            ? event.detail.profile
            : null;

        completeJourney(
          profile
        );

        openPendingCommerceEntreprise();
      }
    );
  }

  /* =====================================================
     DÉMARRAGE
     ===================================================== */

  function startJourney(){

    journeyIsRunning = false;

    console.log(
      "✅ Chef d'orchestre Bo'CitéArt prêt"
    );
  }

  function restartJourney(){

    clearSession();

    journeyIsRunning = false;
    allowNextExistingOpening = false;

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

      case "introduction":
        openIntroduction();
        break;

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
        journeyIsRunning = false;
        break;

      default:
        openIntroduction();
    }
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteStart = {
    start:startJourney,
    restart:restartJourney,
    resume:resumeJourney,
    openIntroduction:openIntroduction,
    openLegal:openLegal,
    openSynoptique:openSynoptique,
    openProfiles:openProfiles,
    complete:completeJourney,
    close:closeAllEntryScreens
  };

  bindCommerceEntrepriseTile();
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
    "✅ Parcours d'entrée général Bo'CitéArt chargé"
  );

})();
