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
    <button
      id="entrepriseIntroductionBackBtn"
      class="choiceBtn"
      type="button"
      style="
        width:100%;
        margin-bottom:14px;
      ">
      ← Retour à Commerces & Entreprises
    </button>

    <div
      class="box"
      style="
        border-left:6px solid #2f5d46;
        font-size:16px;
        line-height:1.55;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:18px;
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
          line-height:1.5;
          font-weight:400;
        ">
        Comme une très grande majorité
        des habitants et des professionnels :

        <br><br>

        <strong>probablement NON&nbsp;!</strong>

        <br><br>

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
        line-height:1.55;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:18px;
          line-height:1.4;
          font-weight:700;
        ">
        Les règles du jeu ont changé
      </div>

      <div
        style="
          margin-top:14px;
          color:#111;
          font-size:16px;
          line-height:1.55;
          font-weight:400;
        ">
        Internet et le commerce en ligne
        ont ouvert de nouvelles possibilités.

        <br><br>

        Les plus grandes plateformes
        disposent de moyens considérables
        pour capter les clients,
        les données
        et la visibilité.

        <br><br>

        Pour une entreprise locale,
        il devient de plus en plus difficile
        d’avancer seule,
        d’être connue
        et de rendre ses savoir-faire visibles.
      </div>

    </div>

    <div
      class="box"
      style="
        border-left:6px solid #b00020;
        font-size:16px;
        line-height:1.55;
        font-weight:400;
      ">

      <div
        style="
          color:#111;
          font-size:17px;
          line-height:1.5;
          font-weight:700;
        ">
        ${getLogoHtml()} a été imaginé
        pour répondre aux réalités
        des entrepreneurs
        et des commerçants.
      </div>

      <div
        style="
          margin-top:16px;
          color:#2f5d46;
          font-size:17px;
          line-height:1.5;
          font-weight:700;
        ">
        Il vous propose un outil simple,
        réactif
        et toujours accessible
        depuis votre téléphone.
      </div>

      <div
        style="
          margin-top:18px;
          color:#111;
          font-size:16px;
          line-height:1.55;
          font-weight:400;
        ">

        Vous pourrez progressivement découvrir :

        <br><br>

        <span style="color:#2f5d46;font-weight:700;">
          L’annuaire économique
        </span>

        <br>

        pour identifier les entreprises,
        les commerces,
        les artisans,
        les métiers
        et les savoir-faire présents
        dans votre commune.

        <br><br>

        <span style="color:#2f5d46;font-weight:700;">
          Le développement
        </span>

        <br>

        pour rechercher des clients,
        des fournisseurs,
        des sous-traitants
        et des partenaires professionnels.

        <br><br>

        <span style="color:#2f5d46;font-weight:700;">
          L’emploi
        </span>

        <br>

        pour publier une offre,
        recruter localement
        et consulter les candidatures reçues.

        <br><br>

        <span style="color:#2f5d46;font-weight:700;">
          La fidélisation
        </span>

        <br>

        pour mieux faire connaître l’entreprise,
        attirer des salariés
        et valoriser les services accessibles
        autour de leur lieu de travail.

        <br><br>

        <span style="color:#2f5d46;font-weight:700;">
          La visibilité
        </span>

        <br>

        pour présenter votre activité,
        vos métiers,
        vos réalisations
        et votre savoir-faire.

        <br><br>

        <span style="color:#2f5d46;font-weight:700;">
          La recherche professionnelle
        </span>

        <br>

        pour trouver un métier,
        une compétence,
        un fournisseur,
        un expert
        ou une entreprise,
        d’abord dans votre commune,
        puis sur un territoire plus large.

        <br><br>

        <span style="color:#2f5d46;font-weight:700;">
          La mutualisation
        </span>

        <br>

        pour rapprocher les entreprises
        qui rencontrent les mêmes besoins
        et comparer des propositions communes.

        <br><br>

        <span style="color:#2f5d46;font-weight:700;">
          Le mécénat
        </span>

        <br>

        pour découvrir les projets locaux
        et contribuer selon les possibilités
        de votre entreprise.

        <br><br>

        <span style="color:#2f5d46;font-weight:700;">
          La pérennité
        </span>

        <br>

        pour préparer la continuité,
        la valorisation,
        la transmission
        ou la reprise de l’entreprise.
      </div>

      <div
        style="
          margin-top:20px;
          padding:14px;
          border-left:5px solid #2f5d46;
          background:#f7f3ea;
          color:#111;
          font-size:17px;
          line-height:1.55;
          font-weight:400;
        ">
        <strong>
          Commencez d’abord ici,
          impérativement,
          par rendre visibles votre entreprise,
          vos métiers
          et votre savoir-faire
          dans votre commune.
        </strong>
      </div>

      <div
        style="
          margin-top:18px;
          color:#111;
          font-size:16px;
          line-height:1.55;
          font-weight:400;
        ">
        Car avant de pouvoir travailler ensemble,
        recruter,
        recommander,
        mutualiser
        ou créer de nouveaux partenariats,
        encore faut-il savoir
        que votre entreprise existe,
        où elle se trouve
        et ce qu’elle propose.

        <br><br>

        Restez indépendant,
        mais devenez plus visible,
        plus réactif
        et mieux relié
        aux autres acteurs économiques
        de votre commune
        et de votre territoire.
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
       const backButton =
  getElement(
    "entrepriseIntroductionBackBtn"
  );

if(backButton){

  backButton.onclick =
    function(event){

      event.preventDefault();
      event.stopPropagation();

      if(
        typeof window.closeModal ===
        "function"
      ){

        window.closeModal();
        return;
      }

      const closeButtons =
        Array.from(
          document.querySelectorAll(
            "button"
          )
        );

      const modalCloseButton =
        closeButtons.find(
          function(item){

            const text =
              String(
                item.textContent || ""
              ).trim();

            const label =
              String(
                item.getAttribute(
                  "aria-label"
                ) || ""
              ).toLowerCase();

            return (
              text === "×" ||
              text === "✕" ||
              text === "X" ||
              label.includes("fermer") ||
              label.includes("close")
            );
          }
        );

      if(modalCloseButton){

        modalCloseButton.click();
        return;
      }

      if(
        typeof app.goBack ===
        "function"
      ){

        app.goBack();
      }
    };
}

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
