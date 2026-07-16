/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE ABONNEMENT PROFESSIONNEL
   ========================================================= */

(function initEntrepriseAbonnement(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-abonnement.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getSubscriptionHtml(){

    return `

      <div
        class="box entrepriseModuleIntro">

        <strong
          class="entrepriseModuleTitle">

          Un abonnement
          qui accompagne réellement
          votre développement.

        </strong>

        <br>

        Bo'CitéArt n'est pas
        un simple annuaire.

        <br><br>

        Il réunit progressivement
        des outils destinés
        à accompagner
        les entreprises,
        les commerces
        et les artisans
        dans leur développement.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Ce que comprend
          votre abonnement

        </strong>

        <br><br>

        • votre présentation ;<br>
        • votre visibilité ;<br>
        • vos actualités ;<br>
        • vos recrutements ;<br>
        • vos recherches professionnelles ;<br>
        • vos mutualisations ;<br>
        • votre tableau de direction ;<br>
        • vos outils de développement.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Un abonnement
          qui peut rapidement
          devenir rentable.

        </strong>

        <br><br>

        Une seule économie,

        un nouveau client,

        un recrutement facilité,

        ou un nouveau partenariat

        peuvent déjà
        compenser largement
        son coût annuel.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Une plateforme
          qui évoluera.

        </strong>

        <br><br>

        De nouveaux services
        viendront enrichir
        progressivement
        votre abonnement.

      </div>

            <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Vous restez libre.

        </strong>

        <br><br>

        L'abonnement
        ne vous engage
        que pour la formule
        choisie.

        <br><br>

        Vous décidez
        des outils
        que vous souhaitez utiliser.

        <br><br>

        Bo'CitéArt évoluera
        avec les besoins
        des entreprises.

      </div>

      <div
        class="entrepriseModuleActions">

        <button
          id="subscriptionMonthlyBtn"
          class="choiceBtn"
          type="button">

          Choisir un abonnement mensuel

        </button>

        <button
          id="subscriptionAnnualBtn"
          class="choiceBtn"
          type="button">

          Choisir un abonnement annuel

        </button>

        <button
          id="subscriptionBillingBtn"
          class="choiceBtn"
          type="button">

          Mes abonnements et factures

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion">

        <strong
          style="font-size:20px;">

          L'objectif
          n'est pas de vendre
          un abonnement.

          <br><br>

          L'objectif est
          d'apporter
          davantage de valeur
          que son coût.

        </strong>

      </div>

    `;
  }

  function bindSubscription(){

    const monthlyButton =
      getElement(
        "subscriptionMonthlyBtn"
      );

    const annualButton =
      getElement(
        "subscriptionAnnualBtn"
      );

    const billingButton =
      getElement(
        "subscriptionBillingBtn"
      );

    if(monthlyButton){

      monthlyButton.onclick = function(){

        if(
          typeof module.activateSearchSubscription ===
          "function"
        ){
          module.activateSearchSubscription(
            "france",
            "mensuel"
          );
          return;
        }

        alert(
          "Le module d'abonnement sera disponible après chargement."
        );
      };
    }

    if(annualButton){

      annualButton.onclick = function(){

        if(
          typeof module.activateSearchSubscription ===
          "function"
        ){
          module.activateSearchSubscription(
            "france",
            "annuel"
          );
          return;
        }

        alert(
          "Le module d'abonnement sera disponible après chargement."
        );
      };
    }

    if(billingButton){

      billingButton.onclick = function(){

        if(
          typeof module.openSearchBilling ===
          "function"
        ){
          module.openSearchBilling();
          return;
        }

        alert(
          "L'espace facturation sera disponible après chargement."
        );
      };
    }

  }

  function openSubscriptionModule(){

    module.renderModulePage(

      "Abonnement professionnel",

      getSubscriptionHtml(),

      {
        afterRender:
          bindSubscription
      }

    );
  }

  module.registerScreen(
    "abonnement",
    openSubscriptionModule
  );

  module.openSubscriptionModule =
    openSubscriptionModule;

  console.log(
    "✅ Nouveau module Abonnement chargé"
  );

})();
