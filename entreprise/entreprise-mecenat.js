/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE MÉCÉNAT
   INVESTIR AUTREMENT DANS SON TERRITOIRE
   ========================================================= */

(function initEntrepriseMecenat(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-mecenat.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getPatronageHtml(){

    return `

      <div
        class="box entrepriseModuleIntro">

        <strong
          class="entrepriseModuleTitle">

          Le mécénat est encore
          largement méconnu.

        </strong>

        <br>

        Beaucoup d'entreprises
        pensent encore
        que le mécénat
        est réservé
        aux grandes sociétés.

        <br><br>

        C'est faux.

        <br><br>

        Une PME,
        un artisan
        ou un commerce
        peuvent eux aussi
        participer
        au développement
        de leur territoire.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Et si votre entreprise
          devenait un acteur reconnu
          de votre commune ?

        </strong>

        <br><br>

        Le mécénat
        ne consiste pas seulement
        à financer un projet.

        <br><br>

        Il permet aussi
        de renforcer :

        <br><br>

        • votre image ;<br>
        • votre notoriété ;<br>
        • votre ancrage local ;<br>
        • votre crédibilité ;<br>
        • votre engagement.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Bo'CitéArt rapproche

          entreprises,
          habitants
          et collectivités.

        </strong>

        <br><br>

        Les actions soutenues
        peuvent concerner :

        <br><br>

        • les écoles ;<br>
        • les associations ;<br>
        • le patrimoine ;<br>
        • la culture ;<br>
        • le sport ;<br>
        • des projets utiles
          au territoire.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Un investissement
          qui dépasse
          la simple communication.

        </strong>

        <br><br>

        Les habitants
        découvrent
        une entreprise
        qui agit concrètement
        pour sa commune.

        <br><br>

        Cette reconnaissance
        s'installe souvent
        durablement.

      </div>

            <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Un levier souvent sous-estimé

        </strong>

        <br><br>

        Beaucoup d'entreprises
        investissent chaque année
        dans leur communication.

        <br><br>

        Le mécénat local
        permet de faire connaître
        votre entreprise
        autrement.

        <br><br>

        Il associe votre nom
        à des actions positives
        visibles par les habitants.

        <br><br>

        Cette visibilité
        est souvent plus durable
        qu'une publicité classique.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Une démarche gagnante
          pour tous

        </strong>

        <br><br>

        Les habitants
        bénéficient
        de nouvelles initiatives.

        <br><br>

        Les associations,
        les écoles
        et les collectivités
        trouvent de nouveaux partenaires.

        <br><br>

        L'entreprise,
        quant à elle,
        développe durablement
        sa notoriété
        et renforce
        son image locale.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Le mécénat
          peut aussi
          créer des opportunités

        </strong>

        <br><br>

        Une entreprise engagée
        inspire davantage confiance.

        <br><br>

        Cette confiance
        peut favoriser :

        <br><br>

        • de nouveaux contacts ;<br>
        • des recommandations ;<br>
        • des partenariats ;<br>
        • de nouveaux clients ;<br>
        • une meilleure attractivité
          pour les futurs salariés.

      </div>

            <div
        class="entrepriseModuleActions">

        <button
          id="patronageProjectBtn"
          class="choiceBtn"
          type="button">

          Proposer un projet de mécénat

        </button>

        <button
          id="patronageSubscriptionBtn"
          class="choiceBtn"
          type="button">

          Découvrir l'abonnement professionnel

        </button>

        <button
          id="patronageVisibilityBtn"
          class="choiceBtn"
          type="button">

          Développer ma visibilité

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion">

        <strong
          style="font-size:20px;">

          Le mécénat
          n'est pas seulement
          un soutien financier.

          <br><br>

          C'est aussi
          une façon durable
          de faire connaître
          votre entreprise
          tout en contribuant
          au développement
          de votre territoire.

        </strong>

      </div>

    `;
  }

  function bindPatronage(){

    const projectButton =
      getElement(
        "patronageProjectBtn"
      );

    const subscriptionButton =
      getElement(
        "patronageSubscriptionBtn"
      );

    const visibilityButton =
      getElement(
        "patronageVisibilityBtn"
      );

    if(projectButton){

      projectButton.onclick = function(){

        if(
          typeof module.openPatronageForm ===
          "function"
        ){
          module.openPatronageForm();
          return;
        }

        alert(
          "Le formulaire de mécénat sera disponible après chargement du module correspondant."
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

    if(visibilityButton){

      visibilityButton.onclick = function(){

        module.openScreen(
          "visibilite"
        );
      };
    }

  }

  function openPatronageModule(){

    module.renderModulePage(

      "Le mécénat d'entreprise",

      getPatronageHtml(),

      {
        afterRender:
          bindPatronage
      }

    );
  }

  module.registerScreen(
    "mecenat",
    openPatronageModule
  );

  module.openPatronageModule =
    openPatronageModule;

  console.log(
    "✅ Nouveau module Mécénat chargé"
  );

})();
