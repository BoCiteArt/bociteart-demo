/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE DÉVELOPPEMENT
   DÉVELOPPER AUTREMENT
   ========================================================= */

(function initEntrepriseDeveloppement(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : le module Entreprise doit être chargé avant entreprise-developpement.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getDevelopmentHtml(){

    return `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
        ">

        <strong
          style="
            display:block;
            font-size:22px;
            color:#2f5d46;
            line-height:1.35;
          ">
          Connaissez-vous le nom de cinq entreprises
          de votre commune,
          en dehors des hypermarchés
          et des grandes enseignes ?
        </strong>

        <br>

        <strong style="font-size:19px;">
          Probablement pas.
        </strong>

        <br><br>

        Pourtant, combien de fois entend-on :

        <br><br>

        <strong>
          « Je ne savais même pas
          que cette entreprise existait. »
        </strong>

        <br><br>

        ou :

        <br><br>

        <strong>
          « Je ne savais pas
          qu’elle faisait cela. »
        </strong>

        <br><br>

        Si les habitants ne connaissent pas
        les entreprises qui les entourent,
        comment pourraient-ils devenir
        leurs clients,
        leurs futurs salariés
        ou parler d’elles autour d’eux ?
      </div>

      <div class="box">

        <strong
          style="
            font-size:20px;
            color:#2f5d46;
          ">
          Les règles du jeu ont changé
        </strong>

        <br><br>

        Internet et le commerce en ligne
        ont ouvert de nouvelles possibilités,
        et de nombreuses entreprises
        ont su s’y adapter.

        <br><br>

        Mais les plus grandes plateformes
        disposent désormais de moyens considérables
        pour attirer les clients,
        capter leur attention
        et occuper toujours davantage de place.

        <br><br>

        Pour une entreprise locale,
        il devient de plus en plus difficile
        d’être visible seule.

        <br><br>

        Bo'CitéArt ne vous propose pas
        de renoncer au numérique.

        <br><br>

        Il vous propose de renforcer
        ce que les grandes plateformes
        ne pourront jamais remplacer :

        <br><br>

        • votre proximité ;<br>
        • votre savoir-faire ;<br>
        • votre indépendance ;<br>
        • la confiance des habitants ;<br>
        • votre ancrage dans le territoire.
      </div>

      <div class="box">

        <strong
          style="
            font-size:20px;
            color:#2f5d46;
          ">
          Et si votre développement commençait
          simplement par votre propre ville ?
        </strong>

        <br><br>

        Avant de chercher plus loin,
        commencez par être connu.

        <br><br>

        Comment un habitant pourrait-il postuler
        dans une entreprise
        dont il ignore l’existence ?

        <br><br>

        Comment un futur client
        pourrait-il vous choisir
        s’il ne connaît ni votre métier,
        ni vos services,
        ni votre savoir-faire ?

        <br><br>

        Faire connaître votre entreprise
        dans sa propre commune
        peut favoriser :

        <br><br>

        • le bouche-à-oreille ;<br>
        • les recommandations ;<br>
        • les recrutements de proximité ;<br>
        • les candidatures spontanées ;<br>
        • les relations entre professionnels ;<br>
        • de nouvelles opportunités commerciales.
      </div>

      <div class="box">

        <strong
          style="
            font-size:20px;
            color:#2f5d46;
          ">
          Seul, il devient plus difficile d’être visible
        </strong>

        <br><br>

        Travailler ensemble
        ne signifie pas perdre son indépendance.

        <br><br>

        Chaque entreprise conserve :

        <br><br>

        • son identité ;<br>
        • ses décisions ;<br>
        • ses clients ;<br>
        • ses méthodes ;<br>
        • sa liberté.

        <br><br>

        Mais en devenant plus visibles ensemble,
        les entreprises peuvent renforcer
        leur territoire
        et leur propre avenir.

        <br><br>

        <strong>
          Seul, on résiste difficilement.
          Ensemble, on avance mieux.
        </strong>
      </div>

      <div class="box">

        <strong
          style="
            font-size:20px;
            color:#2f5d46;
          ">
          Commencez près de chez vous
        </strong>

        <br><br>

        Votre prochain client,
        fournisseur,
        sous-traitant,
        partenaire
        ou futur salarié
        se trouve peut-être déjà
        à quelques kilomètres.

        <br><br>

        Bo'CitéArt vous permet de commencer
        par les ressources présentes dans votre commune,
        puis d’élargir la recherche
        lorsque cela devient nécessaire.
      </div>

      <div
        style="
          display:flex;
          flex-direction:column;
          gap:10px;
          margin-top:14px;
        ">

        <button
          id="developmentDirectoryBtnNew"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Découvrir les entreprises de ma ville
        </button>

        <button
          id="developmentVisibilityBtnNew"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Faire connaître mon entreprise
        </button>

        <button
          id="developmentEmploymentBtnNew"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Rechercher ou recruter localement
        </button>

        <button
          id="developmentPartnerBtnNew"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Rechercher un partenaire professionnel
        </button>

        <button
          id="developmentMutualisationBtnNew"
          class="choiceBtn"
          type="button"
          style="width:100%;">
          Découvrir la force de la mutualisation
        </button>
      </div>

      <div
        class="box"
        style="
          margin-top:16px;
          border-left:6px solid #b00020;
        ">

        <strong style="font-size:19px;">
          Les excuses ne créent jamais d’opportunités.
        </strong>

        <br><br>

        <strong style="font-size:21px;color:#2f5d46;">
          Les solutions, oui.
        </strong>

        <br><br>

        Bo'CitéArt ne vous demande pas
        de travailler davantage.

        <br><br>

        Il vous propose
        de regarder votre territoire autrement.
      </div>

      <button
        id="developmentPrivatePlanBtnNew"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:12px;
        ">
        Ouvrir mon plan de développement privé
      </button>
    `;
  }

  function bindDevelopment(){

    const directoryButton =
      getElement(
        "developmentDirectoryBtnNew"
      );

    const visibilityButton =
      getElement(
        "developmentVisibilityBtnNew"
      );

    const employmentButton =
      getElement(
        "developmentEmploymentBtnNew"
      );

    const partnerButton =
      getElement(
        "developmentPartnerBtnNew"
      );

    const mutualisationButton =
      getElement(
        "developmentMutualisationBtnNew"
      );

    const privatePlanButton =
      getElement(
        "developmentPrivatePlanBtnNew"
      );

    if(directoryButton){

      directoryButton.onclick = function(){

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

    if(partnerButton){

      partnerButton.onclick = function(){

        module.openScreen(
          "annuaire"
        );
      };
    }

    if(mutualisationButton){

      mutualisationButton.onclick = function(){

        module.openScreen(
          "mutualisation"
        );
      };
    }

    if(privatePlanButton){

      privatePlanButton.onclick = function(){

        const openPlan = function(){

          if(
            typeof module.openDevelopmentPlan ===
            "function"
          ){
            module.openDevelopmentPlan();
            return;
          }

          alert(
            "Le plan de développement privé est momentanément indisponible."
          );
        };

        if(
          typeof module.requirePrivateAccess ===
          "function"
        ){
          module.requirePrivateAccess(
            openPlan
          );
          return;
        }

        if(
          typeof module.requirePartnerAccess ===
          "function"
        ){
          module.requirePartnerAccess(
            openPlan
          );
          return;
        }

        openPlan();
      };
    }
  }

  function openDevelopment(){

    module.renderModal(
      "Développer autrement",
      getDevelopmentHtml(),
      {
        presentationFooter:true
      }
    );

    window.setTimeout(function(){

      bindDevelopment();

    },0);
  }

  /*
    Le nouveau fichier remplace seulement
    l’écran Développement enregistré auparavant.
    Le gros entreprise.js reste chargé
    et conserve les autres fonctionnalités.
  */

  module.registerScreen(
    "developpement",
    openDevelopment
  );

  module.openDevelopmentNew =
    openDevelopment;

  console.log(
    "✅ Nouveau module Développement chargé"
  );

})();
