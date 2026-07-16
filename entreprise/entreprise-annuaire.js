/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE ANNUAIRE ÉCONOMIQUE
   DÉCOUVRIR LES ENTREPRISES AUTREMENT
   ========================================================= */

(function initEntrepriseAnnuaire(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-annuaire.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getDirectoryHtml(){

    return `

      <div
        class="box entrepriseModuleIntro">

        <strong
          class="entrepriseModuleTitle">

          L'annuaire devient
          un véritable outil
          de développement économique.

        </strong>

        <br>

        Il ne s'agit plus
        d'une simple liste de noms.

        <br><br>

        Bo'CitéArt souhaite permettre
        aux habitants,
        aux entreprises
        et aux collectivités
        de mieux connaître
        les richesses économiques
        présentes sur leur territoire.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Connaissez-vous
          cinq entreprises
          de votre commune
          en dehors
          des grandes enseignes ?

        </strong>

        <br><br>

        Probablement pas.

        <br><br>

        Pourtant,
        combien de fois entend-on :

        <br><br>

        « Je ne savais pas
        que cette entreprise
        faisait cela. »

        <br><br>

        Ou encore :

        <br><br>

        « Je ne savais même pas
        qu'elle existait. »

        <br><br>

        C'est précisément
        ce manque de visibilité
        que Bo'CitéArt souhaite corriger.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Un annuaire vivant

        </strong>

        <br><br>

        Vous pourrez découvrir :

        <br><br>

        • les métiers ;<br>
        • les savoir-faire ;<br>
        • les produits ;<br>
        • les services ;<br>
        • les partenaires ;<br>
        • les recherches professionnelles.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Rechercher autrement

        </strong>

        <br><br>

        Avant d'aller chercher loin,

        regardez déjà
        ce qui existe
        autour de vous.

        <br><br>

        Votre prochain fournisseur,
        partenaire,
        sous-traitant
        ou client
        est peut-être déjà
        dans votre commune.

      </div>

            <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Un annuaire qui crée
          des opportunités

        </strong>

        <br><br>

        Bo'CitéArt ne souhaite pas
        simplement afficher
        des entreprises.

        <br><br>

        Son objectif est de favoriser :

        <br><br>

        • les rencontres ;<br>
        • les échanges ;<br>
        • les partenariats ;<br>
        • les recrutements ;<br>
        • les recommandations ;<br>
        • les collaborations locales.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Une base vivante

        </strong>

        <br><br>

        Les entreprises,
        commerces,
        artisans
        et professions
        pourront mettre à jour
        leurs informations.

        <br><br>

        Bo'CitéArt enrichira
        progressivement
        cette base
        afin qu'elle reste
        la plus fiable possible.

      </div>

      <div
        class="entrepriseModuleActions">

        <button
          id="directorySearchBtn"
          class="choiceBtn"
          type="button">

          Rechercher une entreprise

        </button>

        <button
          id="directoryProfessionalBtn"
          class="choiceBtn"
          type="button">

          Recherche professionnelle

        </button>

        <button
          id="directoryVisibilityBtn"
          class="choiceBtn"
          type="button">

          Faire connaître mon entreprise

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion">

        <strong
          style="font-size:20px;">

          Plus nous connaîtrons
          les entreprises
          de notre territoire,

          plus elles auront
          d'opportunités
          de travailler ensemble.

        </strong>

      </div>

    `;
  }

  function bindDirectory(){

    const searchButton =
      getElement(
        "directorySearchBtn"
      );

    const professionalButton =
      getElement(
        "directoryProfessionalBtn"
      );

    const visibilityButton =
      getElement(
        "directoryVisibilityBtn"
      );

    if(searchButton){

      searchButton.onclick = function(){

        if(
          typeof module.openLocalDirectory ===
          "function"
        ){
          module.openLocalDirectory();
          return;
        }

        module.openScreen(
          "annuaire_local"
        );
      };
    }

    if(professionalButton){

      professionalButton.onclick = function(){

        module.openScreen(
          "annuaire"
        );
      };
    }

    if(visibilityButton){

      visibilityButton.onclick = function(){

        module.openScreen(
          "visibilite"
        );
      };
    }

  }

  function openDirectoryModule(){

    module.renderModulePage(

      "Annuaire économique",

      getDirectoryHtml(),

      {
        afterRender:
          bindDirectory
      }

    );
  }

  module.registerScreen(
    "annuaire_local",
    openDirectoryModule
  );

  module.openDirectoryModule =
    openDirectoryModule;

  console.log(
    "✅ Nouveau module Annuaire chargé"
  );

})();
