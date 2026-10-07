
/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — ACCÈS ANNUAIRE SANTÉ + AIDE
   ========================================================= */

(function installBociteHealthHelpAccess(){

  "use strict";


  if(
    window.__bociteHealthHelpAccessV1
  ){
    return;
  }


  window.__bociteHealthHelpAccessV1 =
    true;


  /* =====================================================
     OUVRIR ANNUAIRE SANTÉ + AIDE
     ===================================================== */

  function openHealthHelp(){

    window.BOCITEART_MODAL_CONTEXT =
      "citizen_health_help";


    if(
      Array.isArray(
        window.modalHistory
      )
    ){
      window.modalHistory.length = 0;
    }


    /*
      MOTEUR PRINCIPAL :
      véritable annuaire Santé du module Mairie.
    */

    if(
      window.BociteMairieModule &&
      typeof window.BociteMairieModule.openHealth ===
        "function"
    ){

      window.BociteMairieModule.openHealth();


      /*
        Le module Mairie construit la fenêtre.
        On lui redonne ensuite le titre public.
      */

      window.setTimeout(
        function(){

          const modalTitle =
            document.getElementById(
              "modalTitle"
            );


          if(modalTitle){

            modalTitle.textContent =
              "Annuaire santé + aide";

          }


          document
            .querySelectorAll(
              '[data-bociteart-auto-back="1"]'
            )
            .forEach(
              function(button){

                button.remove();

              }
            );

        },
        0
      );


      window.setTimeout(
        function(){

          const modalTitle =
            document.getElementById(
              "modalTitle"
            );


          if(modalTitle){

            modalTitle.textContent =
              "Annuaire santé + aide";

          }

        },
        180
      );


      return;
    }


    /*
      SECOURS :
      fonction Santé déjà présente dans index-test.
    */

    if(
      typeof window.openSanteVille ===
        "function"
    ){

      window.openSanteVille();

      return;
    }


    alert(
      "L'annuaire santé + aide est momentanément indisponible."
    );

  }


  /*
    Fonction également disponible
    pour les autres modules.
  */

  window.openHealthHelp =
    openHealthHelp;


  /* =====================================================
     RACCORDEMENT DU CLIC

     WINDOW EN CAPTURE :
     ce clic passe avant les contrôles placés
     plus bas sur DOCUMENT.
     ===================================================== */

  window.addEventListener(
    "click",
    function(event){

      const target =
        event.target &&
        typeof event.target.closest ===
          "function"
          ? event.target.closest(
              "#openHealthHelp"
            )
          : null;


      if(!target){
        return;
      }


      event.preventDefault();

      event.stopPropagation();


      openHealthHelp();

    },
    true
  );


  /* =====================================================
     ACCESSIBILITÉ CLAVIER
     ===================================================== */

  window.addEventListener(
    "keydown",
    function(event){

      if(
        event.key !== "Enter" &&
        event.key !== " "
      ){
        return;
      }


      const target =
        event.target &&
        typeof event.target.closest ===
          "function"
          ? event.target.closest(
              "#openHealthHelp"
            )
          : null;


      if(!target){
        return;
      }


      event.preventDefault();

      event.stopPropagation();


      openHealthHelp();

    },
    true
  );


  console.log(
    "✅ Annuaire santé + aide — accès raccordé"
  );


})();

/* =========================================================
   ÇA FINIT ICI
   BO'CITÉART — ACCÈS ANNUAIRE SANTÉ + AIDE
   ========================================================= */
