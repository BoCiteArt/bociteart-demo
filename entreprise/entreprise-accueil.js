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
    <strong
      style="
        display:inline-block;
        white-space:nowrap;
        font-weight:900;
      ">
      <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
    </strong>
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
        de 5 entreprises de votre commune,
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

        <strong>
          probablement NON&nbsp;!
        </strong>

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
        pour vous
        et pour répondre aux réalités
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
        À l’aide d’un outil simple,
        réactif
        et toujours accessible
        depuis votre poche,
        sur votre téléphone portable.
      </div>

      <div
        style="
          margin-top:18px;
          color:#111;
          font-size:16px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
  style="
    color:#2f5d46;
    font-size:18px;
    line-height:1.5;
    font-weight:700;
  ">
  Découvrez les thèmes suivants
</div>

<div
  style="
    margin-top:10px;
    color:#111;
    font-size:16px;
    line-height:1.55;
    font-weight:400;
  ">
  Sur la prochaine page,
  cliquez dans la bande défilante
  correspondant au thème choisi
  Des explications plus approfondies
  vous y attendent.
</div>

        <br>

        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          L’annuaire économique
        </span>

        <br>

        Rendez visibles votre entreprise,
        vos métiers
        et votre savoir-faire
        afin d’être trouvé plus facilement
        par les habitants,
        les entreprises,
        les collectivités
        et les futurs partenaires
        de votre territoire.

        <br><br>

        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          Le développement
        </span>

        <br>

        Développez votre activité
        en recherchant de nouveaux clients,
        fournisseurs,
        sous-traitants
        et partenaires professionnels,
        d’abord près de chez vous.

        <br><br>

        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          L’emploi
        </span>

        <br>

        Publiez une offre d’emploi
        et recrutez autrement,
        en donnant d’abord leur chance
        aux compétences présentes
        sur votre territoire,
        puis en élargissant progressivement
        votre recherche si nécessaire.

        <br><br>

        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          La fidélisation
        </span>

        <br>

        Faites connaître votre entreprise autrement,
        attirez plus facilement
        de futurs salariés,
        valorisez vos services
        et renforcez votre attractivité locale.

        <br><br>

        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          La visibilité
        </span>

        <br>

        Présentez vos activités,
        vos métiers,
        vos réalisations
        et votre savoir-faire,
        sans bruit,
        mais différemment
        des moyens de communication traditionnels.

        <br><br>

        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          La recherche professionnelle
        </span>

        <br>

        Gardez toujours à l’esprit
        de rechercher un métier,
        une compétence,
        un fournisseur,
        un expert
        ou une entreprise
        d’abord dans votre commune,
        puis d’élargir éventuellement
        votre recherche si nécessaire.

        <br><br>

        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          La mutualisation
        </span>

        <br>

        Face à des charges
        de plus en plus lourdes,
        rapprochez les entreprises partenaires
        ${getLogoHtml()}
        ayant les mêmes besoins.

        <br><br>

        Mutualisez certaines charges,
        comparez plusieurs propositions communes
        et recherchez ensemble
        de meilleures conditions tarifaires.

        <br><br>

        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          Le mécénat
        </span>

        <br>

        Découvrez ce puissant levier
        de développement local,
        encore largement méconnu,
        qui permet aux entreprises
        de renforcer discrètement
        mais efficacement leur visibilité,
        de valoriser leur image
        et de découvrir des opportunités
        auxquelles beaucoup ne pensent jamais.

        <br><br>

        <span
          style="
            color:#2f5d46;
            font-weight:700;
          ">
          La pérennité
        </span>

        <br>

        Préparez dès aujourd’hui
        la continuité,
        la valorisation,
        la transmission
        ou la reprise de votre entreprise.

        <br><br>

        Les plus belles réussites
        se construisent dans le temps.
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

        <strong
          style="
            display:block;
            color:#2f5d46;
            font-size:19px;
          ">
          Commencez ICI&nbsp;!
        </strong>

        <br>

        Impérativement,
        commencez par rendre visibles
        votre entreprise,
        vos métiers
        et votre savoir-faire
        dans votre commune.

        <br><br>

        Restez indépendant,
        OUI,
        mais devenez véritablement visible,
        réactif
        et mieux relié
        aux autres acteurs économiques
        de votre commune
        et de votre territoire.

        <br><br>

        Devenez désormais
        un acteur identifié,
        reconnu
        et incontournable
        de votre environnement économique.
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
