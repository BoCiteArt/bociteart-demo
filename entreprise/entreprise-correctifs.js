/* =========================================================
   BO'CITÉART — ENTREPRISE
   CORRECTIFS GÉNÉRAUX
   ========================================================= */

(function initEntrepriseCorrectifs(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : module Entreprise introuvable."
    );

    return;
  }

  function getModal(){

    return document.querySelector(
      ".modal-content, .modalContent, #modalContent"
    );
  }

  function removeDuplicateBackButtons(){

    const modal =
      getModal();

    if(!modal){
      return;
    }

    const buttons =
      modal.querySelectorAll(
        ".entrepriseModuleBackBtn,#entrepriseBackBtn"
      );

    if(buttons.length <= 1){
      return;
    }

    buttons.forEach(function(btn,index){

      if(index>0){
        btn.remove();
      }

    });

  }

  function removeDuplicateFooters(){

    const modal =
      getModal();

    if(!modal){
      return;
    }

    const footers =
      modal.querySelectorAll(
        ".entrepriseModuleFooter"
      );

    if(footers.length<=1){
      return;
    }

    footers.forEach(function(box,index){

      if(index>0){
        box.remove();
      }

    });

  }

  function normalizeButtons(){

    const modal =
      getModal();

    if(!modal){
      return;
    }

    modal
      .querySelectorAll(".choiceBtn")
      .forEach(function(button){

        button.style.width="100%";

      });

  }

  function normalizeBoxes(){

    const modal =
      getModal();

    if(!modal){
      return;
    }

    modal
      .querySelectorAll(".box")
      .forEach(function(box){

        box.style.borderRadius="10px";

      });

  }

  function applyCorrections(){

    removeDuplicateBackButtons();

    removeDuplicateFooters();

    normalizeButtons();

    normalizeBoxes();

  }

  const observer =
    new MutationObserver(function(){

      window.setTimeout(
        applyCorrections,
        40
      );

    });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  console.log(
    "✅ Correctifs Entreprise chargés"
  );

})();
