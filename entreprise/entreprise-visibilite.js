/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE VISIBILITÉ
   FAIRE CONNAÎTRE SON ENTREPRISE
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

  function getElement(id){

    return document.getElementById(id);
  }

  function getVisibilityHtml(){

    return `

      <div
        class="box entrepriseModuleIntro">

        <strong
          class="entrepriseModuleTitle">

          Être excellent ne suffit plus.

        </strong>

        <br>

        Encore faut-il être connu.

        <br><br>

        Beaucoup d'entreprises
        possèdent un véritable savoir-faire.

        Pourtant,
        elles restent presque invisibles
        pour les habitants
        de leur propre commune.

        <br><br>

        Une entreprise inconnue
        ne peut pas être choisie.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Connaissez-vous cinq entreprises
          de votre ville
          en dehors des hypermarchés
          et des grandes enseignes ?

        </strong>

        <br><br>

        Probablement pas.

        <br><br>

        Pourtant,
        combien de fois entend-on :

        <br><br>

        « Je ne savais pas
        qu'ils faisaient cela. »

        <br><br>

        ou

        <br><br>

        « Je ne savais même pas
        que cette entreprise existait. »

        <br><br>

        Cette situation
        pénalise autant
        les habitants
        que les entreprises.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Faire connaître son entreprise
          change beaucoup de choses

        </strong>

        <br><br>

        Une meilleure visibilité
        peut favoriser :

        <br><br>

        • de nouveaux clients ;<br>
        • de nouveaux salariés ;<br>
        • de nouveaux partenaires ;<br>
        • le bouche-à-oreille ;<br>
        • la confiance ;<br>
        • la reconnaissance locale.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Bo'CitéArt vous aide
          à devenir visible durablement

        </strong>

        <br><br>

        Présentez :

        <br><br>

        • votre activité ;<br>
        • vos métiers ;<br>
        • vos équipes ;<br>
        • vos réalisations ;<br>
        • vos services ;<br>
        • votre savoir-faire.

        <br><br>

        Vous ne diffusez plus
        simplement une publicité.

        <br><br>

        Vous développez
        votre notoriété locale.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          La meilleure publicité
          reste celle dont on parle.

        </strong>

        <br><br>

        Lorsque les habitants
        découvrent réellement
        votre entreprise,

        ils deviennent naturellement
        vos premiers ambassadeurs.

      </div>

      <div
        class="entrepriseModuleActions">

        <button
          id="visibilitySubscriptionBtn"
          class="choiceBtn"
          type="button">

          Faire connaître mon entreprise

        </button>

        <button
          id="visibilityNewsBtn"
          class="choiceBtn"
          type="button">

          Publier une actualité

        </button>

        <button
          id="visibilityDirectoryBtn"
          class="choiceBtn"
          type="button">

          Voir les entreprises de ma ville

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion">

        <strong style="font-size:20px;">

          Une entreprise visible
          crée davantage d'opportunités
          qu'une entreprise inconnue.

        </strong>

      </div>

    `;
  }

  function bindVisibility(){

    const subscriptionButton =
      getElement(
        "visibilitySubscriptionBtn"
      );

    const newsButton =
      getElement(
        "visibilityNewsBtn"
      );

    const directoryButton =
      getElement(
        "visibilityDirectoryBtn"
      );

    if(subscriptionButton){

      subscriptionButton.onclick = function(){

        if(
          typeof module.openEntrepriseSubscription ===
          "function"
        ){
          module.openEntrepriseSubscription();
          return;
        }

        module.openScreen(
          "abonnement"
        );
      };
    }

    if(newsButton){

      newsButton.onclick = function(){

        if(
          typeof module.openVisibilityNews ===
          "function"
        ){
          module.openVisibilityNews();
          return;
        }

        alert(
          "Le module Actualités sera disponible après son chargement."
        );
      };
    }

    if(directoryButton){

      directoryButton.onclick = function(){

        module.openScreen(
          "annuaire"
        );
      };
    }

  }

  function openVisibilityModule(){

    module.renderModulePage(

      "Faire connaître son entreprise",

      getVisibilityHtml(),

      {
        afterRender:
          bindVisibility
      }

    );
  }

  module.registerScreen(
    "visibilite",
    openVisibilityModule
  );

  module.openVisibilityModule =
    openVisibilityModule;

  console.log(
    "✅ Nouveau module Visibilité chargé"
  );

})();
