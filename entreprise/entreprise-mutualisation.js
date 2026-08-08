
/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE MUTUALISATION
   POURQUOI PAYER PLUS CHER ?
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
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Pourquoi payer plus cher ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    <strong>J'en ai assez de payer toujours plus !</strong>
    <br><br>

    Cette phrase...
    <br>combien de fois l'avez-vous prononcée ?
    <br><br>

    Ou simplement pensée ?
    <br><br>

    Électricité.
    <br>Gaz.
    <br>Téléphonie.
    <br>Internet.
    <br>Assurances.
    <br>Mutuelles.
    <br>Papeterie.
    <br>Fournitures.
    <br><br>

    Chaque année...
    <br>les tarifs augmentent.
    <br><br>

    Et l'on finit toujours par se dire :
    <br><br>

    <strong>« Je n'ai pas le choix... il faut bien payer. »</strong>
    <br><br>

    Pourtant...
    <br><br>

    <strong>Ici, désormais, on n'avance plus seul.</strong>
    <br><br>

    <strong>On avance ensemble.</strong>
    <br><br>

    Non pas pour perdre son indépendance.
    <br><br>

    Bien au contraire.
    <br><br>

    <strong>Pour la renforcer.</strong>
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
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Pourquoi chacun continuerait-il à négocier de son côté...
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    ...lorsque plusieurs entreprises rencontrent exactement les mêmes besoins ?
    <br><br>

    Électricité.
    <br>Gaz.
    <br>Téléphonie.
    <br>Internet.
    <br>Assurances.
    <br>Papeterie.
    <br>Fournitures.
    <br>Matériel.
    <br>Prestations.
    <br><br>

    Et bien d'autres encore.
    <br><br>

    <strong>
      En restant totalement indépendantes,
      plusieurs entreprises obtiennent davantage
      simplement parce qu'elles ne sont plus seules.
    </strong>
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
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span> a préparé cette organisation pour vous.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Vous indiquez simplement le besoin qui vous intéresse.
    <br><br>

    Vous ne vous engagez à rien.
    <br><br>

    Votre demande rejoint les autres besoins similaires.
    <br><br>

    Un compteur permet à chacun de suivre l'évolution de la consultation.
    <br><br>

    Vous savez ainsi, en permanence, où en est votre demande.
    <br><br>

    Simplement.
    <br>Clairement.
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
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Lorsque les conditions sont réunies...
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>
    organise automatiquement la suite du processus.

    <br><br>

    Les professionnels susceptibles de répondre
    sont consultés.

    <br><br>

    Ils transmettent leurs meilleures propositions.

    <br><br>

    Vous recevez ensuite
    les réponses directement
    dans votre espace partenaire
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>.

    <br><br>

    Vous comparez.

    <br>Vous analysez.

    <br>Vous choisissez.

    <br>Ou vous refusez.

    <br><br>

    <strong>La décision reste toujours la vôtre.</strong>

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
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Votre espace partenaire évolue en permanence.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Vous retrouvez notamment :

    <br><br>

    • Déposer un nouveau besoin.

    <br>• Consultations en cours.

    <br>• Rejoindre une consultation existante.

    <br>• Mes réponses reçues.

    <br>• Mon historique.

    <br><br>

    Tout est regroupé
    dans un seul espace.

    <br><br>

    Simple.

    <br>Clair.

    <br>Accessible à tout moment.

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
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Et si votre besoin n'existait pas encore ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Proposez-le.

    <br><br>

    Un achat.

    <br>Une location.

    <br>Une prestation.

    <br>Un matériel.

    <br>Un service.

    <br><br>

    Ou toute autre idée.

    <br><br>

    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>
    permettra de faire émerger
    les besoins communs
    les plus utiles.

    <br><br>

    <strong>Les meilleures idées naissent toujours du terrain.</strong>

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
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Tout le monde en parle...
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Réduire ses charges.

    <br>Acheter mieux.

    <br>Obtenir de meilleures conditions.

    <br><br>

    Tout le monde le souhaite.

    <br><br>

    Pourtant...

    <br><br>

    Combien disposent réellement
    d'une organisation pensée
    pour y parvenir ?

    <br><br>

    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>
    a préparé cette possibilité.

    <br><br>

    À vous d'en profiter.

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
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Encore un des très nombreux services inclus dans votre adhésion.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Cet espace est exclusivement réservé
    aux partenaires
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>.

    <br><br>

    Vous continuez simplement
    à gérer votre entreprise.

    <br><br>

    Vous recevez les propositions.

    <br>Vous les comparez.

    <br>Vous décidez.

    <br><br>

    En toute liberté.

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
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Votre abonnement se finance largement tout seul.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Quelques dizaines d'euros
    économisés chaque mois
    représentent plusieurs centaines d'euros
    à la fin de l'année.

    <br><br>

    <strong>

      Votre abonnement
      <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>
      est financé par les économies réalisées...

      <br><br>

      alors tout le monde est déjà gagnant.

    </strong>

    <br><br>

    <strong>

      <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>
      ne devient plus une dépense.

    </strong>

    <br><br>

    <strong style="font-size:18px;">

      Il devient un investissement
      qui continue de produire de la valeur,
      pour votre entreprise
      comme pour votre territoire.

    </strong>

  </p>

</div>


<div
  style="
    display:flex;
    margin-top:18px;
  ">

  <button
    id="mutualisationMecenatBtn"
    class="choiceBtn"
    type="button"
    style="width:100%;">

    Savez-vous vraiment ce qu'est le mécénat ?

  </button>

</div>

`;
}

function bindMutualisation(){

  const mecenatButton =
    getElement(
      "mutualisationMecenatBtn"
    );

  if(mecenatButton){

    mecenatButton.onclick = function(){

      module.openScreen(
        "mecenat"
      );

    };

  }

}

function openMutualisationModule(){

  module.renderModulePage(

    "Pourquoi payer plus cher ?",

    getMutualisationHtml(),

    {
      showBack:false,
      showFooter:false,
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
