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

/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — MÉCÉNAT
   PRÉSENTATION ENTREPRISE
   ========================================================= */

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Le mécénat, le connaissez-vous vraiment&nbsp;?
  </h2>

  À quoi sert-il réellement ?

  <br><br>

  J'ai posé cette question
  à de nombreux dirigeants d'entreprises.

  <br><br>

  Les réponses reviennent souvent :

  <br><br>

  « C'est donner de l'argent. »

  <br><br>

  « C'est encore une dépense. »

  <br><br>

  « C'est surtout une histoire
  de réduction d'impôts. »

  <br><br>

  « Ce n'est pas pour une entreprise
  comme la mienne. »

  <br><br>

  Toutes ces réponses sont sincères.

  <br><br>

  Elles traduisent simplement
  l'image que beaucoup se font encore
  du mécénat.

  <br><br>

  Et pourtant...

  <br>

  elles ne représentent
  qu'une toute petite partie
  de ce qu'il est réellement.

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
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
    dans sa commune ?
  </h2>

  Comment continuer à vivre
  dans la mémoire des habitants...

  <br><br>

  Sans bruit.

  <br><br>

  Sans démarchage.

  <br><br>

  Sans flyers.

  <br><br>

  Sans publicité.

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
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

  vous fermez votre entreprise.

  <br><br>

  Vous rentrez chez vous.

  <br><br>

  Pourtant...
  votre entreprise continue de s'exprimer.

  <br><br>

  Toujours sans un bruit.

  <br><br>

  Grâce à votre participation,
  votre signature rejoint celles
  de toutes celles et ceux
  qui ont contribué à la faire vivre.

  <br><br>

  Visible.

  <br>

  Présente.

  <br>

  Inscrite dans votre commune.

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">

    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#b00020;font-weight:700;">Art</span>

    révèle l'Art d'une autre façon

  </h2>

  Le mécénat ne se voit pas.

  <br><br>

  Seul un remerciement sobre
  témoigne de votre participation.

  <br><br>

  Mais cette participation
  rend possible
  ce que chacun découvrira ensuite...

  <br><br>

  et laissera votre trace
  bien plus forte
  que vous ne l'imaginiez.

  <br><br>

  L'Art réveille une histoire.

  <br><br>

  Celle d'un quartier.

  <br><br>

  De ce qui l'a fait vivre hier...

  <br><br>

  Un lieu.

  <br>

  Un événement.

  <br>

  Un métier.

  <br>

  Une personnalité.

  <br>

  Un artiste.

  <br>

  Une association.

  <br>

  Une entreprise.

  <br>

  Une génération.

  <br><br>

  L'Art révèle bien mieux,
  bien plus,
  ce qui existe autour de nous
  et permet de mettre en lumière
  votre propre talent.

  <br><br>

  Il relie la mémoire au présent.

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    L'Art révélé fera vivre
    tous les chemins,
    toutes les rues de la commune
  </h2>

  Les habitants participent.

  <br><br>

  Puis ils découvrent
  ou redécouvrent leur quartier,
  ses entreprises,
  ses métiers
  et ses savoir-faire,
  bien au-delà
  de ce qu'ils en connaissaient
  jusqu'ici.

  <br><br>

  Les salariés s'y reconnaissent.

  <br><br>

  Les écoles découvrent autrement
  leur territoire.

  <br><br>

  Les générations se rencontrent.

  <br><br>

  Les talents se réveillent.

  <br>

  Les talents se révèlent.

  <br><br>

  Et pour chaque habitant, parce que ce type de projet reviendra tous les deux ans, vous aurez toujours la possibilité et l’occasion de faire découvrir l’un de vos talents dans ce cadre-là.

Sous différentes formes, reconnaissance, prix, mise à l’honneur, le talent finit toujours par être récompensé.

  <br><br>

  À vos talents donc... !

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    C'est aussi ici
    que votre entreprise
    entre dans l'histoire
  </h2>

  Non par une publicité.

  <br><br>

  Non par un slogan.

  <br><br>

  Mais en contribuant
  à ce qui appartient réellement
  à la vie...

  <br>

  à votre vie dans la commune.

  <br><br>

  Hier,
  comme la plupart d'entre nous,
  nous passions devant votre entreprise
  sans réellement savoir
  qui vous étiez.

  <br><br>

  Ce que vous faisiez.

  <br>

  Ce que vous produisiez.

  <br>

  Pour qui.

  <br><br>

  Ni les métiers
  et les savoir-faire
  qui vivent derrière vos murs.

  <br><br>

  Votre entreprise était là.

  <br><br>

  Mais la connaissions-nous
  véritablement ?

  <br><br>

  Aujourd'hui,
  les regards changent.

  <br><br>

  Votre entreprise
  n'est pas simplement
  présente dans la ville.

  <br><br>

  Elle devient véritablement
  connue,
  comprise
  et reconnue.

  <br><br>

  Une publicité attire un regard.

  <br><br>

  Une présence,
  une signature
  bien construites dans le temps
  laissent obligatoirement une trace.

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Votre appartenance
    se construit ici,
    maintenant,
    désormais
  </h2>

  Vous n'êtes plus simplement
  installé à une adresse.

  <br><br>

  Avec l'accompagnement de la mairie, <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#b00020;font-weight:700;">Art</span>

  inscrit encore plus fortement
  votre entreprise
  dans la vie de la commune.

  <br><br>

  Vous faites partie
  de ce qui vit autour de vous.

  <br><br>

  Et ce que l'on contribue
  à construire...

  <br><br>

  on le mémorise davantage...

  <br><br>

  on le respecte...

  <br><br>

  on le préserve...

  <br><br>

  et l'on en est fier.

  <br><br>

  Avec le temps,
  votre engagement,
  votre présence
  et votre contribution
  restent inscrits
  dans votre propre historique,
  mais aussi et surtout
  dans celui de votre commune.

  <br><br>

  Votre fiche

  <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#b00020;font-weight:700;">Art</span>

  en conservera la mémoire.

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Le mécénat est aussi
    un engagement reconnu
  </h2>

  Selon la situation
  de votre entreprise
  et sous réserve
  de la législation en vigueur,
  certaines actions de mécénat
  ouvrent droit
  aux avantages fiscaux
  prévus par la loi
  lorsqu'elles remplissent
  les conditions requises.

  <br><br>

  <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#b00020;font-weight:700;">Art</span>

  vous aide à mieux comprendre
  ce dispositif
  et facilite,
  lorsque cela devient nécessaire,
  la mise en relation
  avec les professionnels compétents.

  <br><br>

  Parlons-en.

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
  ">

  <h2
    style="
      margin:0 0 14px 0;
      color:#2f5d46;
      font-size:17px;
      font-weight:700;
      line-height:1.4;
    ">
    Et demain...
  </h2>

  <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#b00020;font-weight:700;">Art</span>

  ne dévoile pas à l'avance
  ce qui prendra vie
  dans votre commune.

  <br><br>

  Votre entreprise,
  votre commerce,
  en seront immanquablement informé.

  <br><br>

  Chacun choisira alors
  la place qu'il souhaite prendre.

  <br><br>

  Avancer ou pas.

  <br><br>

  Prendre sa place ou pas.

  <br><br>

  Mais vous saurez
  que l'occasion est là.

  <br><br>

  Regarder ensuite
  ce qui aura été construit
  ne remplacera jamais
  le fait d'avoir participé
  à son histoire.

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
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.6;
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

  ne sont pas uniquement
  celles qui portent un bâtiment.

  <br><br>

  Ce sont aussi celles
  qui permettent
  à votre entreprise
  de prendre racine
  et de continuer à vivre
  dans la mémoire
  des générations qui suivront.

  <br><br>

  Ce que vous construisez
  aujourd'hui
  dans votre territoire
  participe directement
  à ce que votre entreprise
  sera...

  <br>

  ou laissera demain.

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
      background:#ffffff;
      color:#111111;
      font-size:14px;
      font-weight:400;
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
