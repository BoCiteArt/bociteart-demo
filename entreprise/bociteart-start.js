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
   
let pendingCommerceEntrepriseButton = null;
let allowCommerceEntrepriseOpening = false;

  function bindCommerceEntrepriseTile(){

    document.addEventListener(
      "click",
      function(event){

        const trigger =
          event.target.closest(
            "button, a, [role='button'], [onclick]"
          );

        if(!trigger){
          return;
        }

        const text =
          String(trigger.textContent || "")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();

        if(
          !text.includes(
            "commerces & entreprises"
          )
        ){
          return;
        }

        /*
          Ce passage autorise le clic automatique final
          sans relancer une deuxième fois l'introduction.
        */

        if(allowCommerceEntrepriseOpening){

          allowCommerceEntrepriseOpening = false;
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

    /*
      Après le parcours :
      ouverture de la véritable page
      Commerces & Entreprises déjà existante.
    */

    if(
      pendingCommerceEntrepriseButton &&
      document.body.contains(
        pendingCommerceEntrepriseButton
      )
    ){

      const buttonToOpen =
        pendingCommerceEntrepriseButton;

      pendingCommerceEntrepriseButton =
        null;

      allowCommerceEntrepriseOpening =
        true;

      window.setTimeout(
        function(){

          buttonToOpen.click();

        },
        100
      );
    }
  }
   
  function bindJourneyEvents(){

    function handleOpenSynoptique(){
      openSynoptique();
    }

    function handleOpenProfiles(){
      openProfiles();
    }

   function handleProfileSelected(event){

  /*
    Une fois le compte créé ou le profil choisi,
    le visiteur découvre d'abord l'introduction.
  */

  openIntroduction();
}
    function handleEnterExistingApp(event){

      enterExistingApplication(
        event.detail
          ? event.detail.profile
          : null
      );
    }

    window.addEventListener(
      "bociteart:open-synoptique",
      handleOpenSynoptique
    );

    document.addEventListener(
      "bociteart:open-synoptique",
      handleOpenSynoptique
    );

    window.addEventListener(
      "bociteart:open-profils",
      handleOpenProfiles
    );

    document.addEventListener(
      "bociteart:open-profils",
      handleOpenProfiles
    );

    window.addEventListener(
      "bociteart:profile-selected",
      handleProfileSelected
    );

    document.addEventListener(
      "bociteart:profile-selected",
      handleProfileSelected
    );

    window.addEventListener(
      "bociteart:enter-existing-app",
      handleEnterExistingApp
    );

    document.addEventListener(
      "bociteart:enter-existing-app",
      handleEnterExistingApp
    );
  }
   
function startJourney(){

  /*
    Au chargement de la page, le parcours juridique
    et l'inscription existants restent prioritaires.

    Ce fichier ne ferme plus automatiquement
    les écrans d'entrée.
  */

  console.log(
    "✅ Chef d'orchestre prêt — attente de la validation de l'inscription"
  );
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

/*
  La tuile Commerces & Entreprises conserve désormais
  son fonctionnement normal dans l’application.
  Elle ne relance plus la page d’introduction.
*/

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
