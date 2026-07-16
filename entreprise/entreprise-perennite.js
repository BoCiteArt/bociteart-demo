/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE PÉRENNITÉ
   PRÉPARER L'AVENIR DE SON ENTREPRISE
   ========================================================= */

(function initEntreprisePerennite(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-perennite.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getSustainabilityHtml(){

    return `

      <div
        class="box entrepriseModuleIntro">

        <strong
          class="entrepriseModuleTitle">

          Une entreprise
          se construit chaque jour.

          Sa pérennité aussi.

        </strong>

        <br>

        Beaucoup de dirigeants
        consacrent toute leur énergie
        à leur activité quotidienne.

        <br><br>

        Pourtant,
        préparer l'avenir
        est tout aussi essentiel.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Préparer aujourd'hui
          facilite demain.

        </strong>

        <br><br>

        Développer son entreprise,
        c'est également penser :

        <br><br>

        • à sa transmission ;<br>
        • à son évolution ;<br>
        • à ses futurs collaborateurs ;<br>
        • à son savoir-faire ;<br>
        • à son image ;<br>
        • à son organisation.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Votre savoir-faire
          est une richesse.

        </strong>

        <br><br>

        Il mérite d'être :

        <br><br>

        • reconnu ;<br>
        • valorisé ;<br>
        • transmis ;<br>
        • partagé lorsque vous le souhaitez.

        <br><br>

        Une entreprise connue
        transmet plus facilement
        son histoire,
        ses valeurs
        et ses compétences.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Anticiper
          permet de choisir.

        </strong>

        <br><br>

        Plus une entreprise
        prépare son avenir,

        plus elle conserve
        sa liberté
        de décision.

      </div>

            <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Faire connaître aujourd'hui
          pour transmettre demain

        </strong>

        <br><br>

        Une entreprise connue,
        reconnue
        et appréciée
        constitue souvent
        un patrimoine
        plus solide.

        <br><br>

        Les habitants,
        les futurs salariés,
        les partenaires
        et les repreneurs potentiels
        identifient plus facilement
        une entreprise
        qui a su développer
        sa visibilité.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Préparer la relève

        </strong>

        <br><br>

        Chaque entreprise
        possède une histoire.

        <br><br>

        Préparer son avenir,
        c'est aussi transmettre :

        <br><br>

        • une expérience ;<br>
        • des valeurs ;<br>
        • une méthode ;<br>
        • un savoir-faire ;<br>
        • une réputation.

        <br><br>

        Cette préparation
        ne concerne pas uniquement
        le départ du dirigeant.

        <br><br>

        Elle participe également
        au développement
        quotidien
        de l'entreprise.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Une entreprise durable
          regarde toujours plus loin

        </strong>

        <br><br>

        Chaque décision prise aujourd'hui
        peut produire des effets
        pendant plusieurs années.

        <br><br>

        Bo'CitéArt vous accompagne
        pour renforcer progressivement :

        <br><br>

        • votre visibilité ;<br>
        • votre attractivité ;<br>
        • votre développement ;<br>
        • votre ancrage local ;<br>
        • la valeur de votre entreprise.

      </div>

            <div
        class="entrepriseModuleActions">

        <button
          id="perenniteDevelopmentBtn"
          class="choiceBtn"
          type="button">

          Développer mon entreprise

        </button>

        <button
          id="perenniteVisibilityBtn"
          class="choiceBtn"
          type="button">

          Renforcer ma visibilité

        </button>

        <button
          id="perenniteDirectionBtn"
          class="choiceBtn"
          type="button">

          Ouvrir mon tableau de direction

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion">

        <strong
          style="font-size:20px;">

          La meilleure façon
          de préparer l'avenir
          est de commencer aujourd'hui.

        </strong>

      </div>

    `;
  }

  function bindSustainability(){

    const developmentButton =
      getElement(
        "perenniteDevelopmentBtn"
      );

    const visibilityButton =
      getElement(
        "perenniteVisibilityBtn"
      );

    const directionButton =
      getElement(
        "perenniteDirectionBtn"
      );

    if(developmentButton){

      developmentButton.onclick =
        function(){

          module.openScreen(
            "developpement"
          );
        };
    }

    if(visibilityButton){

      visibilityButton.onclick =
        function(){

          module.openScreen(
            "visibilite"
          );
        };
    }

    if(directionButton){

      directionButton.onclick =
        function(){

          if(
            typeof module.openDevelopmentPlan ===
            "function"
          ){
            module.openDevelopmentPlan();
            return;
          }

          alert(
            "Le tableau de direction sera disponible après chargement du module correspondant."
          );
        };
    }

  }

  function openSustainabilityModule(){

    module.renderModulePage(

      "Préparer l'avenir de son entreprise",

      getSustainabilityHtml(),

      {
        afterRender:
          bindSustainability
      }

    );
  }

  module.registerScreen(
    "perennite",
    openSustainabilityModule
  );

  module.openSustainabilityModule =
    openSustainabilityModule;

  console.log(
    "✅ Nouveau module Pérennité chargé"
  );

})();
