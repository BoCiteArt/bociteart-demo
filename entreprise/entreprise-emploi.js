/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE EMPLOI
   RECRUTER AUTREMENT
   ========================================================= */

(function initEntrepriseEmploi(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-emploi.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getEmploymentHtml(){

    return `

      <div
        class="box entrepriseModuleIntro">

        <strong
          class="entrepriseModuleTitle">

          Le recrutement a changé

        </strong>

        <br>

        Pendant longtemps,
        publier une annonce suffisait
        pour recevoir plusieurs candidatures.

        <br><br>

        Aujourd'hui,
        les entreprises rencontrent
        de nouvelles difficultés.

        <br><br>

        Les attentes évoluent.

        Les déplacements coûtent plus cher.

        Les temps de trajet pèsent
        sur la qualité de vie.

        <br><br>

        Recruter ne consiste plus seulement
        à diffuser une annonce.

        Il devient nécessaire
        de donner envie
        de rejoindre votre entreprise.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Et si votre futur salarié
          habitait déjà
          dans votre commune ?

        </strong>

        <br><br>

        Avant de rechercher
        à plusieurs dizaines
        de kilomètres,

        demandez-vous si la personne
        que vous recherchez
        ne vit pas déjà
        près de votre entreprise.

        <br><br>

        Un recrutement de proximité
        peut réduire :

        <br><br>

        • le temps de trajet ;<br>
        • le coût des déplacements ;<br>
        • la fatigue quotidienne ;<br>
        • les difficultés d'organisation.

        <br><br>

        C'est souvent un avantage
        pour l'entreprise
        comme pour le salarié.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Avant de publier une annonce…

        </strong>

        <br><br>

        Commencez par faire connaître
        votre entreprise.

        <br><br>

        On ne postule pas
        dans une entreprise
        dont on ignore l'existence.

        <br><br>

        Plus les habitants
        connaissent vos métiers,
        vos équipes
        et votre savoir-faire,

        plus ils penseront naturellement
        à vous lorsqu'une opportunité
        se présentera.

      </div>
            <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Les habitants connaissent-ils
          réellement votre entreprise ?

        </strong>

        <br><br>

        Combien de personnes
        connaissent aujourd'hui :

        <br><br>

        • vos métiers ;<br>
        • vos compétences ;<br>
        • vos réalisations ;<br>
        • vos équipes ;<br>
        • vos valeurs ;<br>
        • vos besoins de recrutement ?

        <br><br>

        Lorsqu'une entreprise devient
        mieux connue dans sa commune,

        les recommandations,
        les candidatures spontanées
        et le bouche-à-oreille
        prennent naturellement
        davantage d'importance.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Les outils Bo'CitéArt
          pour recruter autrement

        </strong>

        <br><br>

        Bo'CitéArt met progressivement
        à votre disposition
        plusieurs outils complémentaires :

        <br><br>

        • publier une offre d'emploi ;<br>
        • rechercher un salarié ;<br>
        • recevoir des candidatures spontanées ;<br>
        • proposer un stage ;<br>
        • accueillir un alternant ;<br>
        • renforcer votre visibilité locale.

        <br><br>

        Chaque outil poursuit
        le même objectif :

        <br><br>

        <strong>

        rapprocher durablement
        les entreprises,
        les habitants
        et les talents
        de votre territoire.

        </strong>

      </div>

      <div
        class="entrepriseModuleActions">

        <button
          id="emploiOffersBtn"
          class="choiceBtn"
          type="button">

          Consulter les offres

        </button>

        <button
          id="emploiCvBtn"
          class="choiceBtn"
          type="button">

          Déposer un CV

        </button>

        <button
          id="emploiPublishBtn"
          class="choiceBtn"
          type="button">

          Publier une offre

        </button>

        <button
          id="emploiApplicationsBtn"
          class="choiceBtn"
          type="button">

          Voir mes candidatures

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion">

        <strong
          style="font-size:20px;">

          Recruter autrement
          commence souvent
          par être connu
          près de chez soi.

        </strong>

      </div>

    `;
  }

  function bindEmployment(){
         const offersButton =
      getElement(
        "emploiOffersBtn"
      );

    const cvButton =
      getElement(
        "emploiCvBtn"
      );

    const publishButton =
      getElement(
        "emploiPublishBtn"
      );

    const applicationsButton =
      getElement(
        "emploiApplicationsBtn"
      );

    if(offersButton){

      offersButton.onclick = function(){

        if(
          typeof module.openEmploymentOffers ===
          "function"
        ){
          module.openEmploymentOffers();
          return;
        }

        module.openScreen(
          "emploi"
        );
      };
    }

    if(cvButton){

      cvButton.onclick = function(){

        if(
          typeof module.openSpontaneousCv ===
          "function"
        ){
          module.openSpontaneousCv();
          return;
        }

        alert(
          "Le dépôt de CV sera disponible dans la prochaine étape."
        );
      };
    }

    if(publishButton){

      publishButton.onclick = function(){

        const openForm =
          function(){

            if(
              typeof module.openEmploymentForm ===
              "function"
            ){
              module.openEmploymentForm();
              return;
            }

            alert(
              "Le formulaire de publication est momentanément indisponible."
            );
          };

        if(
          typeof module.requirePartnerAccess ===
          "function"
        ){
          module.requirePartnerAccess(
            openForm
          );
          return;
        }

        openForm();
      };
    }

    if(applicationsButton){

      applicationsButton.onclick = function(){

        if(
          typeof module.openEmploymentApplications ===
          "function"
        ){
          module.openEmploymentApplications();
          return;
        }

        alert(
          "Les candidatures seront disponibles après chargement du module correspondant."
        );
      };
    }

  }

  function openEmploymentModule(){

    module.renderModulePage(

      "Recruter autrement",

      getEmploymentHtml(),

      {
        afterRender:
          bindEmployment
      }

    );
  }

  module.registerScreen(
    "emploi",
    openEmploymentModule
  );

  module.openEmploymentModule =
    openEmploymentModule;

  console.log(
    "✅ Module Emploi nouvelle génération chargé"
  );

})();

