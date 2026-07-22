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

  function installDevelopmentStyles(){

    if(
      getElement(
        "entrepriseDevelopmentStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "entrepriseDevelopmentStyles";

    style.textContent = `
      .entrepriseDevelopmentPage {
        color:#111;
        line-height:1.55;
      }

      .entrepriseDevelopmentPage .developmentBox {
        margin-top:14px;
      }

      .entrepriseDevelopmentPage .developmentBox:first-child {
        margin-top:0;
      }

      .entrepriseDevelopmentPage .developmentIntro {
        border-left:6px solid #2f5d46;
      }

      .entrepriseDevelopmentPage .developmentTitle {
        display:block;
        margin:0;
        color:#2f5d46;
        font-size:20px;
        font-weight:700;
        line-height:1.4;
      }

      .entrepriseDevelopmentPage .developmentAnswer {
        display:block;
        color:#111;
        font-size:19px;
        font-weight:400;
        line-height:1.45;
      }

      .entrepriseDevelopmentPage .developmentQuote {
        display:block;
        color:#111;
        font-style:italic;
        font-weight:400;
        line-height:1.5;
      }

      .entrepriseDevelopmentPage .developmentActions {
        display:flex;
        flex-direction:column;
        gap:10px;
        margin-top:14px;
      }

      .entrepriseDevelopmentPage .developmentActions .choiceBtn {
        width:100%;
      }

      .entrepriseDevelopmentPage .developmentPrivateBtn {
        width:100%;
        margin-top:14px;
      }

            .entrepriseDevelopmentPage,
      .entrepriseDevelopmentPage p,
      .entrepriseDevelopmentPage li,
      .entrepriseDevelopmentPage span:not(.developmentTitle) {
        font-weight:400;
      }

      .entrepriseDevelopmentPage .box,
      .entrepriseDevelopmentPage .developmentBox,
      .entrepriseDevelopmentPage .developmentActions,
      .entrepriseDevelopmentPage .choiceBtn {
        background:#f7edda;
      }

      .entrepriseDevelopmentPage .developmentTitle {
        color:#2f5d46;
        font-weight:700;
      }

      .entrepriseDevelopmentPage .choiceBtn {
        color:#111;
        font-weight:400;
      }

            .entrepriseDevelopmentPage,
      .entrepriseDevelopmentPage *,
      .entrepriseDevelopmentPage .box,
      .entrepriseDevelopmentPage .choiceBtn {
        font-weight:400 !important;
      }

      .entrepriseDevelopmentPage .developmentTitle {
        color:#2f5d46 !important;
        font-weight:700 !important;
      }

      .entrepriseDevelopmentPage .developmentBox,
      .entrepriseDevelopmentPage .choiceBtn {
        background:#f7edda !important;
      }

      .entrepriseDevelopmentPage .developmentBackBtn {
        display:block !important;
        width:auto !important;
        margin:0 0 14px 0 !important;
        padding:10px 16px !important;
        border:2px solid #2f5d46 !important;
        border-radius:14px !important;
        background:#f7edda !important;
        color:#111 !important;
        font-weight:400 !important;
        cursor:pointer !important;
      }
      @media (max-width:600px) {

        .entrepriseDevelopmentPage .developmentTitle {
          font-size:19px;
        }

        .entrepriseDevelopmentPage .developmentAnswer {
          font-size:18px;
        }

        .entrepriseDevelopmentPage .developmentActions {
          gap:8px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function getDevelopmentHtml(){

    return `
    
      <div class="entrepriseDevelopmentPage">  
              <button
          id="developmentBackBtnNew"
          class="developmentBackBtn"
          type="button">
          Retour
        </button>

        <div
          class="box developmentBox developmentIntro">

          <span class="developmentTitle">
            Connaissez-vous le nom de cinq entreprises
            de votre commune,
            en dehors des hypermarchés
            et des grandes enseignes ?
          </span>

          <br>

          <span class="developmentAnswer">
            Probablement pas.
          </span>

          <br><br>

          Pourtant, combien de fois entend-on :

          <br><br>

          <span class="developmentQuote">
            « Je ne savais même pas
            que cette entreprise existait. »
          </span>

          <br><br>

          ou :

          <br><br>

          <span class="developmentQuote">
            « Je ne savais pas
            qu’elle faisait cela. »
          </span>

          <br><br>

          Si les habitants ne connaissent pas
          les entreprises qui les entourent,
          comment pourraient-ils devenir
          leurs clients,
          leurs futurs salariés
          ou parler d’elles autour d’eux ?
        </div>

        <div class="box developmentBox">

          <span class="developmentTitle">
            Les règles du jeu ont changé
          </span>

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

                <div class="box developmentBox">

          <span class="developmentTitle">
            Et si votre développement commençait
            simplement par votre propre ville ?
          </span>

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

        <div class="box developmentBox">

          <span class="developmentTitle">
            Seul, il devient plus difficile d’être visible
          </span>

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

          Seul, on résiste difficilement.
          Ensemble, on avance mieux.
        </div>

        <div class="box developmentBox">

          <span class="developmentTitle">
            Commencez près de chez vous
          </span>

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

        <div class="developmentActions">

          <button
            id="developmentDirectoryBtnNew"
            class="choiceBtn"
            type="button">
            Découvrir les entreprises de ma ville
          </button>

          <button
            id="developmentVisibilityBtnNew"
            class="choiceBtn"
            type="button">
            Faire connaître mon entreprise
          </button>

          <button
            id="developmentEmploymentBtnNew"
            class="choiceBtn"
            type="button">
            Rechercher ou recruter localement
          </button>

          <button
            id="developmentPartnerBtnNew"
            class="choiceBtn"
            type="button">
            Rechercher un partenaire professionnel
          </button>

          <button
            id="developmentMutualisationBtnNew"
            class="choiceBtn"
            type="button">
            Découvrir la force de la mutualisation
          </button>

        </div>

        <!--
          Emplacement réservé à la future conclusion.
          Elle sera ajoutée lorsque l’ensemble
          du parcours Entreprise sera terminé.
        -->

        <button
          id="developmentPrivatePlanBtnNew"
          class="choiceBtn developmentPrivateBtn"
          type="button">
          Ouvrir mon plan de développement privé
        </button>

      </div>
    `;
  }

  function bindDevelopment(){
         const backButton =
      getElement(
        "developmentBackBtnNew"
      );

    if(backButton){

      backButton.onclick = function(){

        if(
          typeof module.goBack ===
          "function"
        ){
          module.goBack();
          return;
        }

        if(
              if(
          typeof module.openHome ===
          "function"
        ){
          module.openHome();
          return;
        }

        window.history.back();
      };
    }

    function connectButton(id, action){

      const button =
        getElement(id);

      if(button){
        button.onclick = action;
      }
    }

    connectButton(
      "developmentDirectoryBtnNew",
      function(){

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
      }
    );

    connectButton(
      "developmentVisibilityBtnNew",
      function(){

        module.openScreen(
          "visibilite"
        );
      }
    );

    connectButton(
      "developmentEmploymentBtnNew",
      function(){

        module.openScreen(
          "emploi"
        );
      }
    );

    connectButton(
      "developmentPartnerBtnNew",
      function(){

        module.openScreen(
          "annuaire"
        );
      }
    );

    connectButton(
      "developmentMutualisationBtnNew",
      function(){

        module.openScreen(
          "mutualisation"
        );
      }
    );

    connectButton(
      "developmentPrivatePlanBtnNew",
      function(){

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
      }
    );
  }

  function openDevelopment(){

    const pageHtml =
      getDevelopmentHtml();

    if(
      typeof module.renderModulePage ===
      "function"
    ){

      module.renderModulePage(
        "Développer autrement",
        pageHtml,
        {
          showBack:true,
          showFooter:false,
          afterRender:bindDevelopment
        }
      );

      return;
    }

    module.renderModal(
      "Développer autrement",
      pageHtml
    );

    window.setTimeout(function(){

      bindDevelopment();

    },0);
  }

  installDevelopmentStyles();

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
