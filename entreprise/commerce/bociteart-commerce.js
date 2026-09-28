/* =========================================================
   BO'CITÉART
   MODULE COMMERCE / ENTREPRISE

   Fichier :
   entreprise/commerce/bociteart-commerce.js
   ========================================================= */

(function(){

"use strict";


/* =========================================================
   PROTECTION CONTRE UN DOUBLE CHARGEMENT
   ========================================================= */

if(
  window.__bociteCommerceModuleLoaded ===
    true
){
  return;
}


window.__bociteCommerceModuleLoaded =
  true;


/* =========================================================
   ÇA COMMENCE ICI
   CONTENU COMMERCE / ENTREPRISE À EXTRAIRE DE INDEX.HTML
   ========================================================= */


/*
  Le moteur Commerce / Entreprise actuellement présent
  dans index.html sera déplacé ici progressivement.

  On ne supprime rien de index.html avant d'avoir :
  1. extrait le bloc ;
  2. vérifié sa syntaxe ;
  3. raccordé la tuile ;
  4. testé le fonctionnement.
*/


function openCommerceModule(){

  /*
    Le contenu de l'actuel parcours :

    Commerces & entreprises

    sera déplacé ici à l'étape suivante.
  */

  if(
    typeof window.openModal !==
      "function"
  ){

    console.warn(
      "Bo'CitéArt Commerce : moteur de fenêtre indisponible."
    );

    return false;
  }


  window.openModal(
    "Commerces & entreprises",
    `
      <div class="box">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
          "
        >
          Module Commerce / Entreprise
        </div>

        <div
          style="
            margin-top:8px;
            color:#111111;
            font-size:14px;
            font-weight:400;
            line-height:1.5;
          "
        >
          Le module est en cours de séparation
          du fichier principal Bo’CitéArt.
        </div>

      </div>
    `,
    {
      noHistory:true
    }
  );


  return true;
}


/* =========================================================
   ÇA FINIT ICI
   CONTENU COMMERCE / ENTREPRISE À EXTRAIRE DE INDEX.HTML
   ========================================================= */


/* =========================================================
   PORTE PUBLIQUE DU MODULE
   ========================================================= */

window.BociteCommerceModule = {

  ready:
    true,

  open:
    openCommerceModule

};


window.openCommerceModule =
  openCommerceModule;


/* =========================================================
   FIN MODULE COMMERCE / ENTREPRISE
   ========================================================= */

})();
