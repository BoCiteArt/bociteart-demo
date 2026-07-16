/* =========================================================
   BO'CITÉART — ENTREPRISE
   ACCUEIL • SYNOPTIQUE • PRÉSENTATION DES RUBRIQUES
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
    On conserve l’ancien accueil avec les bandes défilantes.
    Il sera ouvert après la présentation générale.
  */

  const originalEntrepriseHome =
    app.openHome;

  function getElement(id){

    return document.getElementById(id);
  }

  function getLogoHtml(){

    return `
      <span style="color:#2f5d46;">
        Bo'Cité
      </span><span style="color:#b00020;">
        Art
      </span>
    `;
  }

  function renderPage(html){

    app.renderModal(
      "Commerces & Entreprises",
      html
    );
  }

  /* =======================================================
     ÉTAPE 1 — ACCROCHE
     ======================================================= */

  function getIntroductionHtml(){

    return `
      <div
        class="box"
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
          ${getLogoHtml()}
          ne vous demande pas
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
        Découvrir ${getLogoHtml()} Entreprise
      </button>
    `;
  }

  /* =======================================================
     ÉTAPE 2 — IMAGE SYNOPTIQUE
     ======================================================= */

  function getOverviewHtml(){

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong
          style="
            display:block;
            font-size:22px;
            line-height:1.35;
          ">
          ${getLogoHtml()} Entreprise
          en un coup d’œil
        </strong>

        <br><br>

        Découvrez en quelques secondes
        les principaux services
        mis à votre disposition.
      </div>

      <div
        style="
          margin-top:12px;
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
            border-radius:12px;
          "
          onerror="
            this.style.display='none';
            document.getElementById(
              'entrepriseImageError'
            ).style.display='block';
          ">
      </div>

      <div
        id="entrepriseImageError"
        class="box"
        style="
          display:none;
          margin-top:12px;
          border-left:6px solid #b00020;
        ">

        <strong>
          L’image du synoptique est introuvable.
        </strong>

        <br><br>

        Vérifiez que le fichier
        <strong>bociteart-entreprise-synoptique.png</strong>
        est bien enregistré dans le dossier
        <strong>entreprise</strong>.
      </div>

      <div
        class="box"
        style="
          margin-top:14px;
          border-left:6px solid #2f5d46;
        ">

        <strong style="font-size:19px;">
          Cette image présente le contenu général.
        </strong>

        <br><br>

        L’interface réelle de l’application
        vous permettra ensuite
        de découvrir chaque rubrique
        et ses différents outils.
      </div>

      <button
        id="entrepriseShowSummaryBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:12px;
        ">
        Voir les principales rubriques
      </button>
    `;
  }

  /* =======================================================
     ÉTAPE 3 — LISTE SIMPLE NON CLIQUABLE
     ======================================================= */

  function getSummaryHtml(){

    return `
      <div
        class="box"
        style="border-left:6px solid #2f5d46;">

        <strong
          style="
            display:block;
            font-size:22px;
            line-height:1.35;
          ">
          Ce que vous découvrirez dans
          ${getLogoHtml()} Entreprise
        </strong>

        <br><br>

        Cette présentation reste volontairement simple.

        <br><br>

        Les bandes défilantes
        et les véritables rubriques de l’application
        vous permettront ensuite
        de découvrir chaque sujet plus en détail.
      </div>

      <div
        style="
          margin-top:16px;
          padding:0 8px;
          font-size:18px;
          line-height:1.55;
        ">

        <div>• Développement</div>

        <div>• Emploi</div>

        <div>• Fidélisation des salariés</div>

        <div>• Visibilité de l’entreprise</div>

        <div>• Mutualisation</div>

        <div>• Économies</div>

        <div>• Pérennité et transmission</div>

        <div>• Mécénat</div>

        <div>• Annuaire économique local</div>

        <div>• Recherche professionnelle en France et en Europe</div>

        <div>• Abonnement professionnel</div>
      </div>

      <div
        class="box"
        style="
          margin-top:18px;
          border-left:6px solid #b00020;
        ">

        <strong style="font-size:20px;">
          ${getLogoHtml()} ne remplace pas
          votre indépendance.
        </strong>

        <br><br>

        Il permet aux commerces
        et aux entreprises
        de rester indépendants
        tout en devenant plus visibles,
        plus solidaires
        et mieux reliés à leur territoire.
      </div>

      <button
        id="entrepriseOpenRealHomeBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
        ">
        Découvrir maintenant les bandes défilantes
      </button>
    `;
  }

  /* =======================================================
     OUVERTURES ET RACCORDEMENTS
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

      const button =
        getElement(
          "entrepriseShowSummaryBtn"
        );

      if(button){

        button.onclick =
          openSummary;
      }

    },0);
  }

  function openSummary(){

    renderPage(
      getSummaryHtml()
    );

    window.setTimeout(function(){

      const button =
        getElement(
          "entrepriseOpenRealHomeBtn"
        );

      if(button){

        button.onclick = function(){

          if(
            typeof originalEntrepriseHome ===
            "function"
          ){
            originalEntrepriseHome.apply(
              app,
              arguments
            );

            return;
          }

          alert(
            "L’accueil avec les bandes défilantes est momentanément indisponible."
          );
        };
      }

    },0);
  }

  app.openHome =
    openIntroduction;

  app.openEntrepriseHome =
    openIntroduction;

  app.openEntrepriseOverview =
    openOverview;

  app.openEntrepriseSummary =
    openSummary;

  app.registerScreen(
    "home",
    openIntroduction
  );

  app.registerScreen(
    "accueil",
    openIntroduction
  );

  console.log(
    "✅ Accueil Entreprise simplifié chargé"
  );

})();
