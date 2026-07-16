/* =========================================================
   BO'CITÉART — ENTREPRISE
   ACCUEIL EN TROIS ÉTAPES
   ACCROCHE • SYNOPTIQUE • INTERFACE
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

  function getElement(id){

    return document.getElementById(id);
  }

  function getIntroductionHtml(){

    return `
      <div
        class="box entrepriseModuleIntro"
        style="border-left:6px solid #2f5d46;">

        <strong
          style="
            display:block;
            font-size:23px;
            line-height:1.35;
            color:#2f5d46;
          ">
          Connaissez-vous le nom de cinq entreprises
          de votre commune,
          en dehors des hypermarchés
          et des grandes enseignes ?
        </strong>

        <br>

        <strong style="font-size:20px;">
          Probablement pas.
        </strong>

        <br><br>

        Pourtant, elles pourraient devenir :

        <br><br>

        • vos prochains clients ;<br>
        • vos futurs salariés ;<br>
        • vos fournisseurs ;<br>
        • vos sous-traitants ;<br>
        • vos partenaires.

        <br><br>

        Combien de fois entend-on :

        <br><br>

        <strong>
          « Je ne savais même pas
          que cette entreprise existait. »
        </strong>

        <br><br>

        ou :

        <br><br>

        <strong>
          « Je ne savais pas
          qu’elle faisait cela. »
        </strong>
      </div>

      <div class="box">

        <strong
          style="
            display:block;
            font-size:20px;
            color:#2f5d46;
          ">
          Les règles du jeu ont changé
        </strong>

        <br><br>

        Internet et le commerce en ligne
        ont ouvert de nouvelles possibilités.

        <br><br>

        Mais les grandes plateformes
        disposent de moyens considérables
        pour capter l’attention,
        les clients
        et la visibilité.

        <br><br>

        Pour une entreprise locale,
        il devient de plus en plus difficile
        d’avancer seule.
      </div>

      <div
        class="box"
        style="border-left:6px solid #b00020;">

        <strong style="font-size:20px;">
          Bo'CitéArt ne vous demande pas
          de travailler davantage.
        </strong>

        <br><br>

        <strong
          style="
            font-size:22px;
            color:#2f5d46;
          ">
          Il vous propose de travailler autrement.
        </strong>

        <br><br>

        Commencez par rendre visibles
        votre entreprise,
        vos métiers,
        vos équipes
        et votre savoir-faire
        dans votre propre territoire.

        <br><br>

        Puis élargissez votre recherche
        en France
        ou en Europe
        lorsque cela devient nécessaire.
      </div>

      <button
        id="entrepriseDiscoverOverviewBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
        ">
        Découvrir Bo'CitéArt Entreprise
      </button>
    `;
  }

  function getOverviewHtml(){

    return `
      <div
        class="box entrepriseModuleIntro"
        style="border-left:6px solid #2f5d46;">

        <strong
          style="
            display:block;
            font-size:22px;
            color:#2f5d46;
          ">
          Bo'CitéArt Entreprise en un coup d’œil
        </strong>

        <br><br>

        Découvrez en quelques secondes
        les principaux services
        qui seront mis à votre disposition.
      </div>

      <div
        class="box"
        style="
          padding:8px;
          overflow:hidden;
          text-align:center;
        ">

        <img
          src="./entreprise/bociteart-entreprise-synoptique.png"
          alt="Présentation générale des fonctions Bo'CitéArt Entreprise"
          style="
            display:block;
            width:100%;
            height:auto;
            border-radius:10px;
          ">
      </div>

      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong style="font-size:19px;">
          Cette image présente le contenu général.
        </strong>

        <br><br>

        L’interface réelle de l’application
        est différente
        et vous permettra ensuite
        d’ouvrir chaque rubrique,
        d’utiliser ses outils
        et de gérer votre espace professionnel.
      </div>

      <div
        class="box"
        style="border-left:6px solid #b00020;">

        <strong style="font-size:19px;">
          Bo'CitéArt évoluera régulièrement.
        </strong>

        <br><br>

        De nouveaux services
        pourront enrichir progressivement
        l’application
        selon les besoins des entreprises,
        des commerces
        et des territoires.
      </div>

      <button
        id="entrepriseEnterAppBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:12px;
        ">
        Entrer dans l’application
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

  function getApplicationHtml(){

    return `
      <div
        class="box entrepriseModuleIntro"
        style="border-left:6px solid #2f5d46;">

        <strong
          style="
            display:block;
            font-size:22px;
            color:#2f5d46;
          ">
          Que souhaitez-vous faire ?
        </strong>

        <br><br>

        Ouvrez la rubrique
        correspondant à votre besoin.
      </div>

      <div
        style="
          display:flex;
          flex-direction:column;
          gap:9px;
          margin-top:14px;
        ">

        <button
          id="entrepriseHomeDevelopmentBtn"
          class="choiceBtn"
          type="button">
          Développer autrement
        </button>

        <button
          id="entrepriseHomeEmploymentBtn"
          class="choiceBtn"
          type="button">
          Recruter autrement
        </button>

        <button
          id="entrepriseHomeLoyaltyBtn"
          class="choiceBtn"
          type="button">
          Attirer et fidéliser vos salariés
        </button>

        <button
          id="entrepriseHomeVisibilityBtn"
          class="choiceBtn"
          type="button">
          Faire connaître votre entreprise
        </button>

        <button
          id="entrepriseHomeMutualisationBtn"
          class="choiceBtn"
          type="button">
          Réduire vos charges par la mutualisation
        </button>

        <button
          id="entrepriseHomePatronageBtn"
          class="choiceBtn"
          type="button">
          Découvrir le mécénat
        </button>

        <button
          id="entrepriseHomeSustainabilityBtn"
          class="choiceBtn"
          type="button">
          Préparer l’avenir de votre entreprise
        </button>

        <button
          id="entrepriseHomeDirectoryBtn"
          class="choiceBtn"
          type="button">
          Entreprises et commerces de ma ville
        </button>

        <button
          id="entrepriseHomeProfessionalSearchBtn"
          class="choiceBtn"
          type="button">
          Recherche professionnelle
        </button>

        <button
          id="entrepriseHomeSubscriptionBtn"
          class="choiceBtn"
          type="button">
          Abonnement professionnel
        </button>
      </div>

      <div
        class="box"
        style="
          margin-top:18px;
          border-left:6px solid #2f5d46;
        ">

        <strong style="font-size:19px;">
          Vous avez une question précise ?
        </strong>

        <br><br>

        Décrivez votre besoin.
        Bo'CitéArt recherchera d’abord localement,
        puis pourra élargir en France
        ou en Europe.

        <textarea
          id="entrepriseAiQuestion"
          class="miniField"
          style="
            width:100%;
            min-height:105px;
            margin-top:12px;
            box-sizing:border-box;
          "
          placeholder="Exemple : je recherche un fournisseur spécialisé en France ou en Europe.">
        </textarea>

        <button
          id="entrepriseAiAskBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:10px;
          ">
          Poser ma question
        </button>

        <div
          id="entrepriseAiAnswer"
          class="bociteAssistantResponse"
          style="margin-top:12px;">
        </div>
      </div>

      <button
        id="entrepriseAppBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:12px;
          background:#fff;
        ">
        Retour au synoptique
      </button>
    `;
  }

  function renderPage(html){

    app.renderModal(
      "Commerces & Entreprises",
      html
    );
  }

  function openScreen(screenName){

    if(
      typeof app.openScreen ===
      "function"
    ){
      app.openScreen(
        screenName
      );
    }
  }

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

      const enterButton =
        getElement(
          "entrepriseEnterAppBtn"
        );

      const backButton =
        getElement(
          "entrepriseOverviewBackBtn"
        );

      if(enterButton){

        enterButton.onclick =
          openApplication;
      }

      if(backButton){

        backButton.onclick =
          openIntroduction;
      }

    },0);
  }

  function bindApplication(){

    const routes = [
      [
        "entrepriseHomeDevelopmentBtn",
        "developpement"
      ],
      [
        "entrepriseHomeEmploymentBtn",
        "emploi"
      ],
      [
        "entrepriseHomeLoyaltyBtn",
        "fidelisation"
      ],
      [
        "entrepriseHomeVisibilityBtn",
        "visibilite"
      ],
      [
        "entrepriseHomeMutualisationBtn",
        "mutualisation"
      ],
      [
        "entrepriseHomePatronageBtn",
        "mecenat"
      ],
      [
        "entrepriseHomeSustainabilityBtn",
        "perennite"
      ],
      [
        "entrepriseHomeDirectoryBtn",
        "annuaire_local"
      ],
      [
        "entrepriseHomeProfessionalSearchBtn",
        "annuaire"
      ],
      [
        "entrepriseHomeSubscriptionBtn",
        "abonnement"
      ]
    ];

    routes.forEach(function(route){

      const button =
        getElement(
          route[0]
        );

      if(button){

        button.onclick = function(){

          openScreen(
            route[1]
          );
        };
      }
    });

    const backButton =
      getElement(
        "entrepriseAppBackBtn"
      );

    if(backButton){

      backButton.onclick =
        openOverview;
    }
  }

  function openApplication(){

    renderPage(
      getApplicationHtml()
    );

    window.setTimeout(
      bindApplication,
      0
    );
  }

  app.openHome =
    openIntroduction;

  app.openEntrepriseHome =
    openIntroduction;

  app.openEntrepriseOverview =
    openOverview;

  app.openEntrepriseApplication =
    openApplication;

  app.registerScreen(
    "home",
    openIntroduction
  );

  app.registerScreen(
    "accueil",
    openIntroduction
  );

  console.log(
    "✅ Accueil Entreprise en trois étapes chargé"
  );

})();
