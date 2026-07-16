/* =========================================================
   BO'CITÉART — ENTREPRISE
   CŒUR COMMUN DES NOUVEAUX MODULES
   NAVIGATION • RETOUR • PIED DE PAGE • STYLES
   ========================================================= */

(function initEntrepriseCore(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-core.js."
    );

    return;
  }

  if(app.modularCoreLoaded){
    return;
  }

  app.modularCoreLoaded = true;

  function getElement(id){

    return document.getElementById(id);
  }

  function escapeHtml(value){

    if(
      typeof app.safeEscape ===
      "function"
    ){
      return app.safeEscape(value);
    }

    return String(
      value == null ? "" : value
    )
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function installCoreStyles(){

    if(
      getElement(
        "entrepriseModularCoreStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "entrepriseModularCoreStyles";

    style.textContent = `
      .entrepriseModuleIntro {
        border-left:6px solid #2f5d46;
      }

      .entrepriseModuleTitle {
        display:block;
        color:#2f5d46;
        font-size:22px;
        line-height:1.35;
      }

      .entrepriseModuleSubtitle {
        display:block;
        color:#111;
        font-size:18px;
        line-height:1.4;
      }

      .entrepriseModuleActions {
        display:flex;
        flex-direction:column;
        gap:10px;
        margin-top:14px;
      }

      .entrepriseModuleActions .choiceBtn {
        width:100%;
      }

      .entrepriseModuleConclusion {
        margin-top:16px;
        border-left:6px solid #b00020;
      }

      .entrepriseModuleBackBtn {
        width:100%;
        margin-bottom:12px;
      }

      .entrepriseModuleFooter {
        margin-top:18px;
        border-left:6px solid #2f5d46;
        cursor:pointer;
      }

      .entrepriseModuleFooter:focus {
        outline:3px solid rgba(47,93,70,.25);
      }

      @media (max-width:600px) {
        .entrepriseModuleTitle {
          font-size:20px;
        }

        .entrepriseModuleSubtitle {
          font-size:17px;
        }

        .entrepriseModuleActions {
          gap:8px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function getBackButtonHtml(){

    return `
      <button
        id="entrepriseModularBackBtn"
        class="choiceBtn entrepriseModuleBackBtn"
        type="button">
        Retour
      </button>
    `;
  }

  function getPresentationFooterHtml(){

    return `
      <div
        id="entrepriseModularFooter"
        class="box entrepriseModuleFooter"
        role="button"
        tabindex="0">

        <strong style="font-size:17px;">
          Vous pourriez également être intéressé.
        </strong>

        <br><br>

        Cliquez ici pour revenir
        aux propositions de l’espace Entreprise.
      </div>
    `;
  }

  function goBack(){

    if(
      typeof app.goBack ===
      "function"
    ){
      app.goBack();
      return;
    }

    if(
      typeof app.openHome ===
      "function"
    ){
      app.openHome();
      return;
    }

    if(
      typeof window.openEntrepriseHome ===
      "function"
    ){
      window.openEntrepriseHome();
    }
  }

  function returnToHome(){

    if(
      typeof app.returnToEntrepriseHome ===
      "function"
    ){
      app.returnToEntrepriseHome();
      return;
    }

    if(
      typeof app.openHome ===
      "function"
    ){
      app.openHome();
      return;
    }

    if(
      typeof window.openEntrepriseHome ===
      "function"
    ){
      window.openEntrepriseHome();
    }
  }

  function bindCommonNavigation(){

    const backButton =
      getElement(
        "entrepriseModularBackBtn"
      );

    const footer =
      getElement(
        "entrepriseModularFooter"
      );

    if(backButton){

      backButton.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();

        goBack();
      };
    }

    if(footer){

      footer.onclick = function(event){

        event.preventDefault();
        event.stopPropagation();

        returnToHome();
      };

      footer.onkeydown = function(event){

        if(
          event.key === "Enter" ||
          event.key === " "
        ){
          event.preventDefault();

          returnToHome();
        }
      };
    }
  }

  function renderModulePage(
    title,
    html,
    options
  ){

    options = options || {};

    if(
      typeof app.renderModal !==
      "function"
    ){
      console.error(
        "Bo'CitéArt : fonction renderModal introuvable."
      );

      return;
    }

    const showBack =
      options.showBack !== false;

    const showFooter =
      options.showFooter !== false;

    const completeHtml =
      (
        showBack
          ? getBackButtonHtml()
          : ""
      ) +
      html +
      (
        showFooter
          ? getPresentationFooterHtml()
          : ""
      );

    app.renderModal(
      title,
      completeHtml
    );

    window.setTimeout(function(){

      bindCommonNavigation();

      if(
        typeof options.afterRender ===
        "function"
      ){
        options.afterRender();
      }

    },0);
  }

  app.escapeModuleHtml =
    escapeHtml;

  app.renderModulePage =
    renderModulePage;

  app.getModuleBackButtonHtml =
    getBackButtonHtml;

  app.getModuleFooterHtml =
    getPresentationFooterHtml;

  app.bindModuleNavigation =
    bindCommonNavigation;

  app.returnToModuleHome =
    returnToHome;

  installCoreStyles();

  console.log(
    "✅ Cœur modulaire Entreprise chargé"
  );

})();
