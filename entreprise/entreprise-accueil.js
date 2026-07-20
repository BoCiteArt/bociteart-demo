/* =========================================================
   BO'CITÉART — ENTREPRISE
   ACCUEIL EN DEUX ÉTAPES

   1. INTRODUCTION
   2. ESPACE ENTREPRISE AVEC BANDES DÉFILANTES
   ========================================================= */

(function initEntrepriseAccueil(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){

    console.error(
      "Bo'CitéArt : le module Entreprise doit être chargé avant entreprise-accueil.js."
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

    return `
      <span
        style="
          white-space:nowrap;
          font-weight:900;
        ">

        <span style="color:#2f5d46;">
          Bo'Cité
        </span><span style="color:#b00020;">
          Art
        </span>

      </span>
    `;
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
     PAGE 1 — INTRODUCTION
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

        <div
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Connaissez-vous le nom
          de cinq entreprises de votre commune,
          en dehors des grandes enseignes ?

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Comme 99 % des personnes,
          probablement pas.

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:16px;
            line-height:1.5;
            font-weight:400;
          ">

          Pourtant, combien de fois entend-on :

          <br><br>

          « Je ne savais pas que cette entreprise
          existait ici. »

          <br><br>

          ou :

          <br><br>

          « Je ne savais pas qu’elle faisait cela. »

          <br><br>

          Ces entreprises pourraient pourtant devenir :

          <br><br>

          • vos prochains clients ;<br>
          • vos futurs salariés ;<br>
          • vos fournisseurs ;<br>
          • vos sous-traitants ;<br>
          • vos partenaires.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:16px;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
            text-align:center;
          ">

          Les règles du jeu ont changé.

        </div>

        <div
          style="
            margin-top:16px;
            color:#111;
            font-size:16px;
            line-height:1.5;
            font-weight:400;
          ">

          Internet et le commerce en ligne
          ont ouvert de nouvelles possibilités.

          <br><br>

          Les plus grandes plateformes
          disposent de moyens considérables
          pour capter davantage les clients
          et la visibilité.

          <br><br>

          Pour une entreprise locale,
          il devient de plus en plus difficile
          d’avancer, d’exister seule,
          ou presque.

        </div>

      </div>

      <div
        class="box"
        style="
          border-left:6px solid #b00020;
          font-size:16px;
          line-height:1.5;
          font-weight:400;
        ">

        <div
          style="
            font-size:16px;
            line-height:1.45;
            font-weight:700;
          ">

          ${getLogoHtml()} a été imaginé
          pour répondre efficacement
          aux réalités de tous les entrepreneurs
          et commerçants.

        </div>

        <div
          style="
            margin-top:16px;
            color:#2f5d46;
            font-size:16px;
            line-height:1.45;
            font-weight:700;
          ">

          Il vous propose un outil simple,
          réactif,
          toujours accessible
          depuis votre téléphone.

        </div>

        <div
          style="
            margin-top:16px;
            color:#111;
            font-size:16px;
            line-height:1.5;
            font-weight:400;
          ">

          Développement, emploi, visibilité,
          recherche professionnelle, mutualisation,
          mécénat et pérennité :

          <br><br>

          Les informations et les outils utiles
          sont réunis dans une seule application,
          toujours à portée de main.

          <br><br>

          Commencez d’abord ici,
          par rendre visibles
          votre entreprise,
          vos métiers
          et votre savoir-faire
          dans votre commune.

          <br><br>

          Restez indépendant,
          mais devenez plus visible,
          plus réactif
          et mieux connecté
          aux autres acteurs économiques
          de votre commune
          et de votre territoire.

          <br><br>

          Dans un monde où tout s’accélère,
          l’intelligence artificielle
          et les nouvelles technologies
          transforment les usages.

          <br><br>

          Pouvoir accéder immédiatement
          aux bons outils,
          aux bonnes informations
          et agir rapidement
          fait aujourd’hui toute la différence.

        </div>

      </div>

      <button
        id="entrepriseEnterSpaceBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:14px;
        ">

        Découvrir l’espace Entreprise

      </button>
    `;
  }

  /* =======================================================
     OUVERTURE DE L’INTRODUCTION
     ======================================================= */

  function openIntroduction(){

    renderPage(
      getIntroductionHtml()
    );

    window.setTimeout(function(){

      const button =
        getElement(
          "entrepriseEnterSpaceBtn"
        );

      if(button){

        button.onclick =
          function(event){

            event.preventDefault();
            event.stopPropagation();

            openRealEntrepriseHome();
          };
      }

    },0);
  }

  /* =======================================================
     OUVERTURE DE L’ESPACE ENTREPRISE EXISTANT
     ======================================================= */

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

  app.openEntrepriseIntroduction =
    openIntroduction;
   
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
    "✅ Accueil Entreprise en deux étapes chargé"
  );

})();
