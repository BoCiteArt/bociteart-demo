/* =========================================================
   BO'CITÉART — ENTREPRISE
   VISIBILITÉ & COMMUNICATION
   PORTE D'ENTRÉE SIMPLE
   ========================================================= */

(function initEntrepriseVisibilite(){

  "use strict";

  const module =
    window.BociteEntreprise;


  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-visibilite.js."
    );

    return;
  }


  /* =======================================================
     OUTILS
     ======================================================= */

  function getElement(id){

    return document.getElementById(
      id
    );
  }


  function getBrandHtml(){

    return `
      <strong
        style="
          display:inline;
          white-space:nowrap;
          font-weight:700;
        ">
        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          Bo'Cité
        </span><span
          style="
            color:#b00020;
            font-weight:700;
          ">
          Art
        </span>
      </strong>
    `;
  }


  /* =======================================================
     PAGE PRINCIPALE
     ======================================================= */

  function getVisibilityHtml(){

    return `

      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            line-height:1.3;
          ">
          Visibilité & communication
        </div>

        <div
          style="
            margin-top:8px;
            color:#111111;
            font-size:14px;
            font-weight:400;
          ">

          Préparez simplement
          votre communication locale.

          <br><br>

          ${getBrandHtml()}
          vous aide à réfléchir,
          préparer,
          tester
          et suivre vos actions.

        </div>

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:10px;
          ">
          Avant de commencer
        </div>

        Posez-vous une seule question :

        <br><br>

        <strong
          style="
            color:#111111;
            font-size:14px;
            font-weight:700;
          ">
          Quel résultat voulez-vous obtenir ?
        </strong>

        <br><br>

        • Faire venir des clients<br>
        • Faire connaître une offre<br>
        • Présenter un produit ou un service<br>
        • Obtenir des appels ou des contacts<br>
        • Obtenir des demandes de devis<br>
        • Obtenir des réservations<br>
        • Faire connaître votre savoir-faire<br>
        • Recruter

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:8px;
          ">
          Pense-bête
        </div>

        Avant de publier,
        vérifiez simplement :

        <br><br>

        • À qui voulez-vous parler ?<br>
        • Quel message doit être retenu ?<br>
        • Pourquoi agir maintenant ?<br>
        • Votre offre est-elle immédiatement comprise ?<br>
        • La date, le lieu ou le contact sont-ils indiqués ?

        <br><br>

        <strong
          style="
            color:#111111;
            font-size:14px;
            font-weight:700;
          ">
          Si une seule chose devait être retenue
          de votre publicité,
          laquelle serait-ce ?
        </strong>

      </div>


      <button
        id="visibilityAdvertisingBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Préparer une publicité
      </button>


      <button
        id="visibilityNewsBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Publier une actualité
      </button>


      <button
        id="visibilityEmploymentBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Recruter
      </button>


      <button
        id="visibilityDirectoryBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Voir ma présence dans l'annuaire
      </button>


      <button
        id="visibilityResultsBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Voir les résultats de mes communications
      </button>


      <div
        class="box"
        style="
          margin-top:12px;
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:8px;
          ">
          Pour une publicité
        </div>

        Vous pourrez :

        <br><br>

        • préparer votre message ;<br>
        • ajouter vos photos ;<br>
        • voir votre publicité avant diffusion ;<br>
        • choisir les outils utiles ;<br>
        • tester le parcours à blanc ;<br>
        • faire valider la publicité ;<br>
        • suivre ensuite ses résultats.

        <br><br>

        Toute publicité préparée
        par un collaborateur
        devra être validée
        par le responsable
        avant sa diffusion.

      </div>

    `;
  }


  /* =======================================================
     OUVERTURE PUBLICITÉ
     ======================================================= */

  function openAdvertising(){

    if(
      typeof window.openTicker ===
      "function"
    ){

      window.openTicker();
      return;
    }


    alert(
      "L'espace Publicité est momentanément indisponible."
    );
  }


  /* =======================================================
     OUVERTURE ACTUALITÉS
     ======================================================= */

  function openNews(){

    if(
      typeof module.openVisibilityNews ===
      "function"
    ){

      module.openVisibilityNews();
      return;
    }


    if(
      typeof module.openEntrepriseNews ===
      "function"
    ){

      module.openEntrepriseNews();
      return;
    }


    alert(
      "L'espace Actualités est momentanément indisponible."
    );
  }


  /* =======================================================
     OUVERTURE EMPLOI
     ======================================================= */

  function openEmployment(){

    if(
      typeof module.openScreen ===
      "function"
    ){

      module.openScreen(
        "emploi"
      );

      return;
    }


    alert(
      "L'espace Emploi est momentanément indisponible."
    );
  }


  /* =======================================================
     OUVERTURE ANNUAIRE
     ======================================================= */

  function openDirectory(){

    if(
      typeof module.openScreen ===
      "function"
    ){

      module.openScreen(
        "annuaire"
      );

      return;
    }


    alert(
      "L'annuaire est momentanément indisponible."
    );
  }


  /* =======================================================
     RÉSULTATS
     POINT DE RACCORDEMENT
     ======================================================= */

  function openResults(){

    if(
      typeof module.openVisibilityResults ===
      "function"
    ){

      module.openVisibilityResults();
      return;
    }


    /*
      Le véritable tableau de mesure
      sera raccordé au moteur Publicité.

      Il regroupera notamment :
      affichages,
      ouvertures,
      photos consultées,
      appels,
      itinéraires,
      bons,
      QR codes,
      demandes de devis,
      réservations
      et résultats confirmés.
    */

    alert(
      "Le suivi détaillé des résultats sera disponible dès le raccordement du moteur de mesure."
    );
  }


  /* =======================================================
     BIND
     ======================================================= */

  function bindVisibility(){

    const advertisingButton =
      getElement(
        "visibilityAdvertisingBtn"
      );


    const newsButton =
      getElement(
        "visibilityNewsBtn"
      );


    const employmentButton =
      getElement(
        "visibilityEmploymentBtn"
      );


    const directoryButton =
      getElement(
        "visibilityDirectoryBtn"
      );


    const resultsButton =
      getElement(
        "visibilityResultsBtn"
      );


    if(advertisingButton){

      advertisingButton.onclick =
        openAdvertising;
    }


    if(newsButton){

      newsButton.onclick =
        openNews;
    }


    if(employmentButton){

      employmentButton.onclick =
        openEmployment;
    }


    if(directoryButton){

      directoryButton.onclick =
        openDirectory;
    }


    if(resultsButton){

      resultsButton.onclick =
        openResults;
    }
  }


  /* =======================================================
     OUVERTURE DU MODULE
     ======================================================= */

  function openVisibilityModule(){

    if(
      typeof module.renderModulePage ===
      "function"
    ){

      module.renderModulePage(

        "Visibilité & communication",

        getVisibilityHtml(),

        {
          showBack:true,
          showFooter:false,
          afterRender:
            bindVisibility
        }

      );

      return;
    }


    if(
      typeof module.renderModal ===
      "function"
    ){

      module.renderModal(
        "Visibilité & communication",
        getVisibilityHtml()
      );


      window.setTimeout(
        bindVisibility,
        0
      );

      return;
    }


    alert(
      "L'espace Visibilité est momentanément indisponible."
    );
  }


  /* =======================================================
     EXPOSITION
     ======================================================= */

  module.registerScreen(
    "visibilite",
    openVisibilityModule
  );


  module.openVisibilityModule =
    openVisibilityModule;


  console.log(
    "✅ Nouveau module Visibilité & communication chargé"
  );

})();
