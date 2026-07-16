/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE FIDÉLISATION
   ATTIRER ET FIDÉLISER AUTREMENT
   ========================================================= */

(function initEntrepriseFidelisation(){ 

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-fidelisation.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getLoyaltyHtml(){

    return `

      <div
        class="box entrepriseModuleIntro">

        <strong
          class="entrepriseModuleTitle">

          Fidéliser ne consiste plus
          uniquement à augmenter les salaires

        </strong>

        <br>

        Bien sûr,
        la rémunération reste importante.

        <br><br>

        Mais aujourd'hui,
        les salariés recherchent également :

        <br><br>

        • du sens ;<br>
        • de la confiance ;<br>
        • un employeur reconnu ;<br>
        • une bonne qualité de vie ;<br>
        • un équilibre durable.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Faites connaître votre entreprise

        </strong>

        <br><br>

        Combien de personnes
        connaissent réellement
        votre entreprise,
        vos équipes,
        vos métiers
        et votre savoir-faire ?

        <br><br>

        Une entreprise reconnue
        attire naturellement
        davantage de candidatures
        et renforce
        la fierté d'appartenance
        de ses collaborateurs.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Valorisez vos équipes

        </strong>

        <br><br>

        Présentez :

        <br><br>

        • vos métiers ;<br>
        • vos collaborateurs ;<br>
        • vos réussites ;<br>
        • vos innovations ;<br>
        • vos engagements.

        <br><br>

        Les habitants découvrent
        l'entreprise.

        Les salariés voient
        leur travail reconnu.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Donner envie de rester

        </strong>

        <br><br>

        La fidélisation passe aussi par :

        <br><br>

        • la proximité ;<br>
        • les initiatives locales ;<br>
        • la participation à la vie du territoire ;<br>
        • le sentiment d'appartenir
          à une entreprise utile.

      </div>

      <div
        class="entrepriseModuleActions">

        <button
          id="loyaltyVisibilityBtnNew"
          class="choiceBtn"
          type="button">

          Faire connaître mon entreprise

        </button>

        <button
          id="loyaltyEmploymentBtnNew"
          class="choiceBtn"
          type="button">

          Recruter autrement

        </button>

        <button
          id="loyaltyPatronageBtnNew"
          class="choiceBtn"
          type="button">

          Découvrir le mécénat

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion">

        <strong style="font-size:20px;">

          Les salariés restent plus facilement
          lorsqu'ils sont fiers
          de leur entreprise.

        </strong>

      </div>

    `;
  }

  function bindLoyalty(){

    const visibilityButton =
      getElement(
        "loyaltyVisibilityBtnNew"
      );

    const employmentButton =
      getElement(
        "loyaltyEmploymentBtnNew"
      );

    const patronageButton =
      getElement(
        "loyaltyPatronageBtnNew"
      );

    if(visibilityButton){

      visibilityButton.onclick = function(){

        module.openScreen(
          "visibilite"
        );
      };
    }

    if(employmentButton){

      employmentButton.onclick = function(){

        module.openScreen(
          "emploi"
        );
      };
    }

    if(patronageButton){

      patronageButton.onclick = function(){

        module.openScreen(
          "mecenat"
        );
      };
    }

  }

  function openLoyaltyModule(){

    module.renderModulePage(

      "Attirer et fidéliser autrement",

      getLoyaltyHtml(),

      {
        afterRender:
          bindLoyalty
      }

    );
  }

  module.registerScreen(
    "fidelisation",
    openLoyaltyModule
  );

  module.openLoyaltyModule =
    openLoyaltyModule;

  console.log(
    "✅ Nouveau module Fidélisation chargé"
  );

})();
