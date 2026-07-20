/* =========================================================
   BO'CITÉART — ENTREPRISE
   ACCUEIL EN TROIS ÉTAPES
   1. INTRODUCTION
   2. SYNOPTIQUE
   3. BANDES DÉFILANTES
   ========================================================= */

(function initEntrepriseAccueil(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-accueil.js."
    );

    return;
  }

  /*
    On conserve l’accueil historique
    contenant les bandes défilantes.
  */

  const originalEntrepriseHome =
    typeof app.openHome === "function"
      ? app.openHome
      : null;

  function getElement(id){

    return document.getElementById(id);
  }

  function getLogoHtml(){

    return `<span style="white-space:nowrap;font-weight:900;"><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span></span>`;
  }

  function renderPage(html){

    if(
      typeof app.renderModal !==
      "function"
    ){

      console.error(
        "Bo'CitéArt : fonction renderModal introuvable."
      );

      return;
    }

    app.renderModal(
      "Commerces & Entreprises",
      html
    );
  }

  /* =======================================================
     PAGE 1 — INTRODUCTION PERCUTANTE
     ======================================================= */

  function getIntroductionHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          font-size:16px;
          line-height:1.5;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:20px;
            line-height:1.35;
          ">

          Connaissez-vous le nom
          de cinq entreprises de votre commune,
          en dehors des grandes enseignes?

        </strong>

        <br>

        <strong
          style="
            font-size:18px;
            line-height:1.4;
          ">

          Comme 99% des personnnes, Probablement pas.

        </strong>

        <br><br>

        Pourtant,
        combien de fois entend-on :

        <br><br>

        <strong>
          « Je ne savais pas que cette 
          entreprise existait ici. »
        </strong>

        <br><br>

        ou :

        <br><br>

        <strong>
          « Je ne savais pas
          qu’elle faisait cela. »
        </strong>

        <br><br>

        Ces entreprises pourraient pourtant devenir :

        <br><br>

        • vos prochains clients ;<br>
        • vos futurs salariés ;<br>
        • vos fournisseurs ;<br>
        • vos sous-traitants ;<br>
        • vos partenaires.

      </div>

      <div
        class="box"
        style="
          font-size:16px;
          line-height:1.5;
        ">

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:18px;
            line-height:1.4;
          ">

          Les règles du jeu ont changé.

        </strong>

        <br><br>

        Internet, le commerce en ligne
        ont ouvert de nouvelles possibilités.

        <br><br>

        Les plus grandes plateformes
        disposent de moyens considérables
        pour capter, ou apsirerd'avantage 
        les clients et toute la visibilité.

        <br><br>

        Pour une entreprise locale,
        il devient de plus en plus difficile
        d'avancer, d'exister seule, ou presque.

      </div>

           <div
        class="box"
        style="
          border-left:6px solid #b00020;
          font-size:16px !important;
          line-height:1.5 !important;
          font-weight:400 !important;
        ">

        <div
          style="
            font-size:17px !important;
            line-height:1.45 !important;
            font-weight:700 !important;
          ">

          ${getLogoHtml()} a été imaginé, pour 
          répondre aux réalités efficacement à tous types 
          d'entrepreneurs ou commerçants.

        </div>

        <br><br>

        <div
          style="
            color:#2f5d46;
            font-size:17px !important;
            line-height:1.45 !important;
            font-weight:700 !important;
          ">

          <br><br>

          Il vous propose, un outil simple, réactif,
          directement depuis votre téléphone.

        </div>

        <br><br>

        Développement, emploi, visibilité,
        recherche professionnelle, mutualisation,
        mécénat et pérennité:

        <br><br>

        <span style="font-weight:700 !important;">

          les informations, des outils utiles
          sont réunis dans une seule application,
          toujours à portée de main.

        </span>

        <br><br>

        Commencez d'abord ici, par rendre visibles
        votre entreprise, vos métiers, votre savoir-faire
        dans votre commune.

        <br><br>

        Restez indépendant,
        mais devenez enfin plus visible,
        plus réactif, plus proche
        et surtout mieux relié aux autres acteurs
        économiques de votre ville.

        <br><br>

        <span style="font-weight:700 !important;">

        <span style="font-weight:700 !important;">

        Dans un monde où tout s'accélère,
        l'intelligence artificielle,
        les nouvelles technologies
        transforment les usages.

       <br><br>

        Pouvoir accéder immédiatement
        aux bons outils,
        aux bonnes informations,
        agir rapidement,
        fait aujourd'hui toute la différence.

</span>

</span>

        </span>

      </div>
      
      <button
        id="entrepriseDiscoverOverviewBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
        ">

        Découvrir l’application

      </button>
    `;
  }

  /* =======================================================
     PAGE 2 — SYNOPTIQUE
     ======================================================= */

  function getOverviewHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          font-size:16px;
          line-height:1.5;
        ">

        <strong
          style="
            display:block;
            font-size:19px;
            line-height:1.35;
          ">

          <span style="white-space:nowrap;">
            ${getLogoHtml()}
          </span>
          Entreprise en un coup d’œil

        </strong>

        <br><br>

        Découvrez visuellement
        les principaux services
        et les différentes possibilités
        proposées aux commerces
        et aux entreprises.

      </div>

      <div
        style="
          margin-top:12px;
          overflow:hidden;
          text-align:center;
        ">

        <img
          id="entrepriseSynoptiqueImage"
          src="./entreprise/bociteart-entreprise-synoptique.png"
          alt="Présentation générale des fonctions Bo'CitéArt Entreprise"
          style="
            display:block;
            width:100%;
            height:auto;
            border-radius:12px;
          ">

      </div>

      <div
        id="entrepriseSynoptiqueError"
        class="box"
        style="
          display:none;
          margin-top:12px;
          border-left:6px solid #b00020;
          font-size:16px;
          line-height:1.5;
        ">

        <strong>
          L’image du synoptique
          n’a pas été trouvée.
        </strong>

        <br><br>

        Vérifiez que le fichier porte exactement le nom :

        <br><br>

        <strong>
          bociteart-entreprise-synoptique.png
        </strong>

      </div>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #2f5d46;
          font-size:16px;
          line-height:1.5;
        ">

        <strong
          style="
            font-size:17px;
            line-height:1.4;
          ">

          Cette image présente
          le contenu général de l’application.

        </strong>

        <br><br>

        L’interface réelle,
        accessible à l’étape suivante,
        vous permettra ensuite
        de parcourir les bandes défilantes
        et d’ouvrir chaque rubrique.

      </div>

      <button
        id="entrepriseEnterRealHomeBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:12px;
        ">

        Entrer dans l’espace Entreprise

      </button>

      <button
        id="entrepriseOverviewBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">

        Retour

      </button>
    `;
  }
  function bindSynoptiqueImage(){

    const image =
      getElement(
        "entrepriseSynoptiqueImage"
      );

    const errorBox =
      getElement(
        "entrepriseSynoptiqueError"
      );

    if(!image){
      return;
    }

    let secondPathTried =
      false;

    image.onerror = function(){

      /*
        Ce second chemin fonctionne aussi
        si l’image est encore placée
        dans entreprise/entreprise/.
      */

      if(!secondPathTried){

        secondPathTried = true;

        image.src =
          "./entreprise/entreprise/bociteart-entreprise-synoptique.png";

        return;
      }

      image.style.display =
        "none";

      if(errorBox){

        errorBox.style.display =
          "block";
      }
    };
  }

  /* =======================================================
     OUVERTURE DES TROIS ÉTAPES
     ======================================================= */

  function openIntroduction(){

    renderPage(
      getIntroductionHtml()
    );

    window.setTimeout(function(){

      const button =
        getElement(
          "entrepriseDiscoverOverviewBtn"
        );

      if(button){

        button.onclick =
          openOverview;
      }

    },0);
  }

  function openOverview(){

    renderPage(
      getOverviewHtml()
    );

    window.setTimeout(function(){

      bindSynoptiqueImage();

      const enterButton =
        getElement(
          "entrepriseEnterRealHomeBtn"
        );

      const backButton =
        getElement(
          "entrepriseOverviewBackBtn"
        );

      if(enterButton){

        enterButton.onclick =
          openRealEntrepriseHome;
      }

      if(backButton){

        backButton.onclick =
          openIntroduction;
      }

    },0);
  }

  function openRealEntrepriseHome(){

    if(
      typeof originalEntrepriseHome ===
      "function"
    ){

      originalEntrepriseHome.call(
        app
      );

      return;
    }

    alert(
      "L’accueil avec les bandes défilantes est momentanément indisponible."
    );
  }

  /* =======================================================
     ENREGISTREMENT
     ======================================================= */

  app.openHome =
    openIntroduction;

  app.openEntrepriseHome =
    openIntroduction;

  app.openEntrepriseOverview =
    openOverview;

  app.openRealEntrepriseHome =
    openRealEntrepriseHome;

  if(
    typeof app.registerScreen ===
    "function"
  ){

    app.registerScreen(
      "home",
      openIntroduction
    );

    app.registerScreen(
      "accueil",
      openIntroduction
    );
  }

  console.log(
    "✅ Accueil Entreprise en trois étapes chargé"
  );

})();
