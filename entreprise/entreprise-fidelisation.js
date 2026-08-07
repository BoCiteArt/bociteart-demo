/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE FIDÉLISATION
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
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    L'herbe est-elle vraiment plus verte ailleurs ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Tout le monde sourit en entendant cette question...
    <br><br>

    Pourtant, combien de salariés sont partis en pensant trouver mieux ?
    <br><br>

    Pour un salaire plus élevé.
    <br>Pour un poste plus attractif.
    <br>Pour une nouvelle aventure.
    <br><br>

    Qui ne l'aurait pas fait ?
  </p>

</div>


<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Puis vient parfois la réalité.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Les promesses s'effacent.
    <br>Les salaires arrivent en retard.
    <br>L'organisation devient plus difficile.
    <br>L'ambiance change.
    <br>Parfois, l'entreprise ferme.
    <br><br>

    Et un jour, cette phrase revient souvent :
    <br><br>

    « Finalement... j'étais bien où j'étais. »
  </p>

</div>


<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Pourquoi ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Une entreprise n'embauche jamais pour voir partir un bon salarié.
    <br><br>

    Un salarié n'entre jamais dans une entreprise avec l'envie de la quitter.
    <br><br>

    Les deux recherchent pourtant la même chose :
    <br>la stabilité.
    <br><br>

    Lorsque chacun est au rendez-vous de ses engagements, la confiance grandit.
    <br><br>

    L'entreprise développe les compétences de ses collaborateurs.
    <br>Le salarié développe son savoir-faire et son expérience.
    <br><br>

    Ensemble, ils construisent l'avenir.
  </p>

</div>


<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    La fidélisation ne repose pas uniquement sur le salaire.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    L'entreprise ne peut pas toujours augmenter davantage.
    <br><br>

    Le salarié aimerait parfois gagner plus.
    <br><br>

    Les deux se retrouvent face à une même réalité.
    <br><br>

    Alors, que faire ?
  </p>

</div>


<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Le temps devient une richesse.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Travailler plus près de chez soi, c'est souvent :
    <br><br>

    moins de transports,
    <br>moins de fatigue,
    <br>moins de stress,
    <br>moins de dépenses,
    <br>plus de temps pour sa famille,
    <br>pour ses proches,
    <br>pour vivre.
    <br><br>

    Cette richesse n'apparaît sur aucune fiche de paie.
    <br><br>

    Pourtant, elle améliore profondément la qualité de vie.
  </p>

</div>


<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Puis viennent les petits plus.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Les titres-restaurant.
    <br>Les chèques-vacances.
    <br>Les avantages proposés par l'entreprise.
    <br>Les partenaires locaux.
    <br>Les activités.
    <br>Les œuvres.
    <br><br>

    Pris séparément, ils semblent modestes.
    <br><br>

    Ensemble, ils améliorent réellement le quotidien.
  </p>

</div>


<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    La confiance donne envie de rester.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Une entreprise qui respecte ses équipes.
    <br>Qui les fait progresser.
    <br>Qui reconnaît leurs compétences.
    <br>Qui améliore progressivement leur qualité de vie.
    <br><br>

    Construit naturellement une fidélité durable.
    <br><br>

    Le salarié, lui aussi, comprend mieux les contraintes de son entreprise
    et participe davantage à son développement.
  </p>

</div>


<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Et si partir n'était pas toujours une fin ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Pourquoi ne pas reprendre contact lorsqu'un départ s'est fait dans le respect ?
    <br><br>

    Les erreurs existent.
    <br>Les parcours évoluent.
    <br><br>

    Une candidature spontanée permet parfois de retrouver une entreprise
    que l'on sait désormais apprécier à sa juste valeur.
  </p>

</div>


<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Quel gâchis... pour les deux parties.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    L'entreprise a perdu un bon collaborateur.
    <br>Le salarié a perdu une entreprise sérieuse.
    <br>Chacun pensait trouver mieux.
    <br><br>

    Chacun a parfois perdu davantage.
    <br><br>

    Pourtant, une entreprise qui fidélise ses équipes construit aussi
    sa stabilité, son image, sa réputation et son avenir.
    <br><br>

    Le salarié retrouve progressivement un meilleur équilibre de vie,
    davantage de sérénité et une qualité de travail plus durable.
    <br><br>

    La confiance se construit jour après jour.
    <br><br>

    C'est elle qui fait grandir durablement les femmes,
    les hommes... et les entreprises.
  </p>

</div>


<div
  style="
    background:#ffffff;
    border:1px solid #e6e6e6;
    border-left:6px solid #2f5d46;
    border-radius:16px;
    padding:18px;
    margin:0 0 16px 0;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Découvrons maintenant comment développer durablement votre entreprise.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    La page suivante vous explique comment développer naturellement
    votre entreprise, votre commerce, créer de nouvelles opportunités
    et révéler des richesses déjà présentes autour de vous...
    sans toujours les voir.
  </p>

</div>


<div
  style="
    margin-top:16px;
  ">

  <button
    id="loyaltyDevelopmentBtn"
    class="choiceBtn"
    type="button"
    style="
      width:100%;
    ">
    Développement
  </button>

</div>

`;

  }


  function bindLoyalty(){

    const developmentButton =
      getElement(
        "loyaltyDevelopmentBtn"
      );

    if(developmentButton){

      developmentButton.onclick =
        function(){

          module.openScreen(
            "developpement"
          );
        };
    }
  }


  function openLoyaltyModule(){

    module.renderModulePage(

      "Fidélisation",

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
