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
    Savez-vous vraiment ce qu'est le mécénat ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Selon vous...
    <br><br>

    <strong>qu'est-ce que le mécénat ?</strong>
    <br><br>

    À quoi sert-il réellement ?
    <br><br>

    <strong>
      J'ai posé cette question à de nombreux dirigeants d'entreprises.
    </strong>
    <br><br>

    Voici, en général, les réponses que j'entends :
    <br><br>

    <strong>« C'est donner de l'argent. »</strong>
    <br><br>

    <strong>« C'est encore une dépense. »</strong>
    <br><br>

    <strong>« C'est surtout une histoire de réduction d'impôts. »</strong>
    <br><br>

    <strong>« C'est réservé aux grandes entreprises. »</strong>
    <br><br>

    <strong>« Nous n'avons déjà plus de marge. »</strong>
    <br><br>

    <strong>« Ce n'est pas le moment. »</strong>
    <br><br>

    <strong>« Nous avons déjà suffisamment de charges. »</strong>
    <br><br>

    <strong>« C'est un autre monde... ce n'est pas pour nous. »</strong>
    <br><br>

    Toutes ces réponses sont sincères.
    <br><br>

    Elles traduisent simplement l'image
    que beaucoup se font encore du mécénat.
    <br><br>

    <strong>
      Et pourtant... elles ne représentent
      qu'une toute petite partie
      de ce qu'il est réellement.
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
    Comment permettre à votre entreprise
    de s'enraciner durablement
    au cœur de sa commune et de son territoire ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    <strong>
      Comment continuer à vivre
      dans la mémoire des habitants...
    </strong>

    <br><br>

    Sans bruit.
    <br><br>

    Sans démarchage.
    <br><br>

    Sans flyers.
    <br><br>

    Sans publicité.

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
    Chaque soir...
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    vous fermez votre entreprise.
    <br><br>

    Vous rentrez chez vous.
    <br><br>

    <strong>
      Pourtant... votre entreprise continue de s'exprimer.
    </strong>
    <br><br>

    Toujours sans un bruit.
    <br><br>

    Grâce à une œuvre.
    <br><br>

    Visible.
    <br>Vivante.
    <br>Présente dans votre commune.

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
    Une œuvre qui continue de parler pour vous.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Elle raconte une histoire.
    <br><br>

    Elle témoigne d'une époque.
    <br><br>

    Elle révèle des talents.
    <br><br>

    Des savoir-faire.
    <br>Des entreprises.
    <br>Des commerces.
    <br>Des salariés.
    <br><br>

    Elle rassemble habitants, artistes,
    entreprises et tous ceux
    qui ont participé à sa création.
    <br><br>

    Elle accompagne également la mairie
    dans la valorisation de son territoire.
    <br><br>

    <strong>
      Elle devient le témoin vivant
      de celles et ceux qui ont choisi
      d'écrire ensemble une nouvelle page
      de l'histoire de leur commune.
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
    C'est ici que votre entreprise laisse son empreinte.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Non par une publicité.
    <br><br>

    Non par un slogan.
    <br><br>

    Mais par une réalisation visible de tous.
    <br><br>

    <strong>
      Dans chaque quartier,
      une œuvre porte silencieusement
      une partie de votre histoire.
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
    Une œuvre vivante dans votre commune.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Les citoyens la découvrent.
    <br><br>

    Les salariés s'y reconnaissent.
    <br><br>

    Les écoles découvrent autrement
    les métiers de leur territoire.
    <br><br>

    Les générations se rencontrent.
    <br><br>

    Les talents se réveillent.
    <br>Les talents se révèlent.
    <br><br>

    Et parce que le projet revient
    tous les deux ans...
    <br><br>

    <strong>
      chacun sait qu'un jour viendra
      peut-être son tour d'y participer.
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
    Voilà ce qu'est réellement le mécénat.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Bien plus qu'un simple soutien.
    <br><br>

    <strong>
      Une œuvre qui continue de parler de vous...
      bien après sa création.
    </strong>
    <br><br>

    Une publicité attire un regard...
    <br><br>

    <strong>
      Une œuvre inscrit durablement
      votre entreprise
      dans la mémoire de votre commune.
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
    Le mécénat génère également de nombreuses retombées positives.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Selon les projets soutenus,
    il peut donner lieu à :

    <br><br>

    • une inauguration ;
    <br>• un article de presse ;
    <br>• un reportage ;
    <br>• une distinction ;
    <br>• un label ;
    <br>• une récompense ;
    <br>• la mise en valeur d'une innovation ;
    <br>• des remerciements publics.

    <br><br>

    Autant d'éléments qui renforcent progressivement
    votre notoriété,
    votre crédibilité
    et votre ancrage dans votre commune.

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
    Le sentiment d'appartenance se construit.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    En associant habitants,
    écoles,
    artistes,
    salariés
    et entreprises...

    <br><br>

    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>
    développe naturellement
    le sentiment d'appartenance.

    <br><br>

    <strong>
      Et ce que l'on contribue à construire...
    </strong>

    <br><br>

    <strong>on le mémorise davantage...</strong>
    <br><br>

    <strong>on le respecte...</strong>
    <br><br>

    <strong>on le préserve...</strong>
    <br><br>

    <strong>et l'on en est fier.</strong>

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
    Au fil des années...
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>,

    <br>la mairie,

    <br>votre entreprise,

    <br>vos salariés,

    <br>les citoyens...

    <br><br>

    conserveront la mémoire
    de vos engagements,

    <br>de vos réalisations,

    <br>des reconnaissances obtenues,

    <br>et de votre contribution
    à l'histoire de votre commune.

    <br><br>

    <strong>
      Votre fiche
      <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>
      deviendra progressivement
      la mémoire vivante de cet engagement.
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

    Le mécénat est également un investissement reconnu.

  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Souvent méconnu.

    <br><br>

    Souvent mal compris.

    <br><br>

    Selon la situation de votre entreprise
    et sous réserve des dispositions prévues
    par la législation en vigueur,
    les actions de mécénat
    peuvent ouvrir droit
    aux avantages fiscaux
    prévus par la loi.

    <br><br>

    <strong>

      <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>

      vous aide à mieux comprendre
      ce dispositif
      et facilite la mise en relation
      avec les organismes
      et les professionnels compétents.

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

      Les plus solides fondations...

  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

      ne sont pas uniquement
      celles qui portent
      un bâtiment.

      <br><br>

      <strong>

      Ce sont celles qui permettent
      à votre entreprise
      de continuer à vivre
      dans la mémoire
      des générations
      qui suivront...

      <br><br>

      bien après
      que nous aurons tous
      quitté la scène.

      </strong>

  </p>

</div>


<div
  style="
    display:flex;
    margin-top:18px;
  ">

  <button
    id="patronageNextBtn"
    class="choiceBtn"
    type="button"
    style="
      width:100%;
    ">

    Préparer l'avenir de votre entreprise

  </button>

</div>

`;
}

 function bindPatronage(){

  const nextButton =
    getElement(
      "patronageNextBtn"
    );

  if(nextButton){

    nextButton.onclick = function(){

      module.openScreen(
        "perennite"
      );

    };

  }

}

function openPatronageModule(){

  module.renderModulePage(

    "Le mécénat d'entreprise",

    getPatronageHtml(),

    {
      showBack:false,
      showFooter:false,
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
