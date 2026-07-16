
/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE MUTUALISATION
   RÉDUIRE SES CHARGES AUTREMENT
   ========================================================= */

(function initEntrepriseMutualisation(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-mutualisation.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getMutualisationHtml(){

    return `

      <div
        class="box entrepriseModuleIntro">

        <strong
          class="entrepriseModuleTitle">

          Et si certaines de vos charges
          pouvaient diminuer
          sans changer votre façon
          de travailler ?

        </strong>

        <br>

        Chaque entreprise
        négocie souvent seule.

        <br><br>

        Pourtant,
        plusieurs entreprises
        ayant les mêmes besoins
        disposent généralement
        d'un pouvoir de négociation
        bien supérieur.

        <br><br>

        Bo'CitéArt vous propose
        d'observer cette possibilité.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Mutualiser
          ne signifie pas
          perdre son indépendance.

        </strong>

        <br><br>

        Chaque entreprise reste :

        <br><br>

        • totalement libre ;<br>
        • indépendante ;<br>
        • propriétaire de ses décisions ;<br>
        • libre d'accepter
          ou de refuser
          toute proposition.

        <br><br>

        Mutualiser consiste seulement
        à rechercher ensemble
        de meilleures opportunités.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Pourquoi rester seul ?

        </strong>

        <br><br>

        Une entreprise isolée
        dispose souvent
        d'un pouvoir limité.

        <br><br>

        En regroupant plusieurs entreprises
        autour d'un même besoin,

        il devient possible
        d'obtenir davantage
        de propositions
        et de meilleures conditions.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Quelques exemples

        </strong>

        <br><br>

        Une mutualisation pourra concerner :

        <br><br>

        • l'électricité ;<br>
        • le gaz ;<br>
        • les assurances ;<br>
        • Internet ;<br>
        • la téléphonie ;<br>
        • certains achats professionnels ;<br>
        • d'autres besoins communs.

      </div>

            <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Pourquoi attendre plusieurs entreprises ?

        </strong>

        <br><br>

        Bo'CitéArt ne lancera pas
        une consultation
        pour une seule entreprise.

        <br><br>

        Un objectif sera fixé
        selon le type de besoin.

        <br><br>

        Par exemple :

        <br><br>

        • 20 entreprises ;<br>
        • 30 entreprises ;<br>
        • ou davantage.

        <br><br>

        Lorsque ce seuil sera atteint,
        Bo'CitéArt pourra consulter
        plusieurs prestataires
        afin d'obtenir
        les propositions
        les plus intéressantes.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Chacun reste libre

        </strong>

        <br><br>

        Votre participation
        n'est jamais
        un engagement d'achat.

        <br><br>

        Vous pourrez :

        <br><br>

        • comparer ;<br>
        • analyser ;<br>
        • accepter ;<br>
        • ou refuser.

        <br><br>

        Vous restez seul décisionnaire.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Quelques économies
          deviennent vite importantes

        </strong>

        <br><br>

        Prenons un exemple prudent :

        <br><br>

        • 15 € / mois sur l'électricité ;<br>
        • 10 € / mois sur Internet ;<br>
        • 8 € / mois sur une assurance.

        <br><br>

        Cela représente déjà :

        <br><br>

        <strong
          style="
            font-size:22px;
            color:#2f5d46;
          ">

          396 € d'économies par an

        </strong>

        <br><br>

        Sans compter
        les autres gains possibles.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Et ce n'est souvent
          que le début…

        </strong>

        <br><br>

        Ces économies
        peuvent ensuite être complétées par :

        <br><br>

        • un nouveau client ;<br>
        • un nouveau partenaire ;<br>
        • un nouveau fournisseur ;<br>
        • un recrutement facilité ;<br>
        • une meilleure visibilité.

        <br><br>

        L'abonnement Bo'CitéArt
        peut ainsi contribuer
        à financer lui-même
        une partie de son coût.

      </div>

            <div
        class="entrepriseModuleActions">

        <button
          id="mutualisationFormBtn"
          class="choiceBtn"
          type="button">

          Déclarer un besoin de mutualisation

        </button>

        <button
          id="mutualisationSubscriptionBtn"
          class="choiceBtn"
          type="button">

          Découvrir l'abonnement professionnel

        </button>

        <button
          id="mutualisationDirectoryBtn"
          class="choiceBtn"
          type="button">

          Rechercher des entreprises partenaires

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion">

        <strong style="font-size:20px;">

          Se regrouper ne retire
          aucune liberté.

          <br><br>

          Cela permet simplement
          de négocier autrement.

        </strong>

      </div>

    `;
  }

  function bindMutualisation(){

    const formButton =
      getElement(
        "mutualisationFormBtn"
      );

    const subscriptionButton =
      getElement(
        "mutualisationSubscriptionBtn"
      );

    const directoryButton =
      getElement(
        "mutualisationDirectoryBtn"
      );

    if(formButton){

      formButton.onclick = function(){

        if(
          typeof module.openMutualisation ===
          "function"
        ){
          module.openMutualisation();
          return;
        }

        alert(
          "Le formulaire de mutualisation sera disponible après chargement du module correspondant."
        );
      };
    }

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

    if(directoryButton){

      directoryButton.onclick = function(){

        module.openScreen(
          "annuaire"
        );
      };
    }

  }

  function openMutualisationModule(){

    module.renderModulePage(

      "Réduire ses charges autrement",

      getMutualisationHtml(),

      {
        afterRender:
          bindMutualisation
      }

    );
  }

  module.registerScreen(
    "mutualisation",
    openMutualisationModule
  );

  module.registerScreen(
    "economies",
    openMutualisationModule
  );

  module.openMutualisationModule =
    openMutualisationModule;

  console.log(
    "✅ Nouveau module Mutualisation chargé"
  );

})();
