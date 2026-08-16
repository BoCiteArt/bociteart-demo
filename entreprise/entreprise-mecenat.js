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
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Selon vous...

    <br><br>

    <strong>
      qu'est-ce que le mécénat ?
    </strong>

    <br><br>

    À quoi sert-il réellement ?

    <br><br>

    J'ai posé cette question
    à de nombreux dirigeants d'entreprises.

    <br><br>

    Les réponses reviennent souvent :

    <br><br>

    <strong>
      « C'est donner de l'argent. »
    </strong>

    <br><br>

    <strong>
      « C'est encore une dépense. »
    </strong>

    <br><br>

    <strong>
      « C'est surtout une histoire
      de réduction d'impôts. »
    </strong>

    <br><br>

    <strong>
      « Ce n'est pas pour une entreprise
      comme la mienne. »
    </strong>

    <br><br>

    Toutes ces réponses sont sincères.

    <br><br>

    Elles traduisent simplement
    l'image que beaucoup se font encore
    du mécénat.

    <br><br>

    <strong>
      Et pourtant...
      elles ne représentent
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
    au cœur de sa commune
    et de son territoire ?
  </h2>

  <p
    style="
      margin:0;
      color:#000000;
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
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    vous fermez votre entreprise.

    <br><br>

    Vous rentrez chez vous.

    <br><br>

    <strong>
      Pourtant...
      votre entreprise continue de s'exprimer.
    </strong>

    <br><br>

    Toujours sans un bruit.

    <br><br>

    <strong>
      Grâce à votre participation,
      votre signature rejoint celles
      de toutes celles et ceux
      qui ont contribué à la faire vivre.
    </strong>

    <br><br>

    Visible.

    <br>

    Présente.

    <br>

    Inscrite dans votre commune.

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
    L'art raconte bien plus
    que ce que l'on voit
  </h2>

  <p
    style="
      margin:0;
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Il réveille une histoire.

    <br><br>

    Celle d'un quartier.

    <br><br>

    De celles et ceux
    qui l'ont fait vivre hier...

    <br><br>

    et de celles et ceux
    qui le font vivre aujourd'hui.

    <br><br>

    Un événement.

    <br>
    Un lieu.

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

    <strong>
      L'art révèle bien mieux,
      bien plus,
      ce qui se cache derrière chacun...
      et met aussi en lumière
      vos propres talents.
    </strong>

    <br><br>

    Il rapproche les générations.

    <br>

    Il réveille la mémoire.

    <br>

    Il révèle le présent.

    <br><br>

    <strong>
      Il devient un trait d'union
      entre ce qui a construit
      votre territoire
      et tout ce qui le fait vivre
      aujourd'hui.
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
    L'art révélé fera vivre
    tous les chemins,
    toutes les rues de la commune
  </h2>

  <p
    style="
      margin:0;
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Tous les habitants sont invités
    à participer,
    selon leur volonté,
    leurs envies
    et leurs talents.

    <br><br>

    Puis enfin,
    ils découvrent ou redécouvrent
    leur quartier,
    ses entreprises,
    ses métiers
    et ses savoir-faire,

    <strong>
      bien au-delà
      de ce qu'ils en connaissaient
      jusqu'ici.
    </strong>

    <br><br>

    Les salariés s'y reconnaissent.

    <br><br>

    Les écoles découvrent autrement
    les métiers
    et les savoir-faire
    de leur territoire.

    <br><br>

    Les générations se rencontrent.

    <br><br>

    Les talents se réveillent.

    <br>

    Les talents se révèlent.

    <br><br>

    Les regards changent.

    <br>

    La connaissance grandit.

    <br><br>

    Et parce que le projet revient
    <strong>tous les deux ans</strong>,
    vous aurez toujours
    une nouvelle occasion
    de faire découvrir
    ce que vous savez faire.

    <br><br>

    <strong>
      « Ça aussi, je peux le faire. »
    </strong>

    <br><br>

    <strong>
      À vos talents donc... !
    </strong>

    <br><br>

    Les talents mis à l'honneur
    seront aussi récompensés.

    <br><br>

    <strong>
      Et cette reconnaissance
      fera vivre à son tour
      le commerce local.
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
    C'est aussi là,
    ici,
    que votre entreprise entre dans l'histoire
  </h2>

  <p
    style="
      margin:0;
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Non par une publicité.

    <br><br>

    Non par un slogan.

    <br><br>

    Mais

    <strong>
      en contribuant à ce qui appartient
      réellement à la vie...
      à votre vie dans la commune.
    </strong>

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

    Les métiers
    et les savoir-faire
    qui vivent derrière vos murs.

    <br><br>

    Votre entreprise était là.

    <br><br>

    <strong>
      Mais la connaissions-nous
      véritablement ?
    </strong>

    <br><br>

    Aujourd'hui,
    les regards changent.

    <br><br>

    <strong>
      Votre entreprise
      n'est pas simplement
      présente dans la ville.
    </strong>

    <br><br>

    <strong>
      Elle devient véritablement
      connue,
      comprise
      et reconnue.
    </strong>

    <br><br>

    Une publicité attire un regard.

    <br><br>

    <strong>
      Une présence,
      une signature
      bien construites dans le temps
      laissent obligatoirement une trace.
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
    Votre appartenance
    se construit ici,
    maintenant,
    désormais
  </h2>

  <p
    style="
      margin:0;
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    En associant habitants,
    écoles,
    artistes,
    salariés,
    entreprises,
    commerces,
    associations
    et acteurs du territoire...

    <br><br>

    <strong>

      <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>

      développe,
      fonde
      et inscrit naturellement
      votre appartenance
      dans la vie de la commune.

    </strong>

    <br><br>

    Vous n'êtes plus simplement
    installé à une adresse.

    <br><br>

    <strong>
      Vous faites partie
      de ce qui vit autour de vous.
    </strong>

    <br><br>

    Et ce que l'on contribue
    à construire...

    <br><br>

    <strong>
      on le mémorise davantage...
    </strong>

    <br><br>

    <strong>
      on le respecte...
    </strong>

    <br><br>

    <strong>
      on le préserve...
    </strong>

    <br><br>

    <strong>
      et l'on en est fier.
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
    Le mécénat génère donc
    bien plus de retombées positives
    que nous ne l'imaginions
  </h2>

  <p
    style="
      margin:0;
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Ou,
    plus simplement encore...

    <br><br>

    <strong>
      bien plus que beaucoup d'entre nous
      n'en avaient réellement compris le sens.
    </strong>

    <br><br>

    Une inauguration.

    <br>

    Un article.

    <br>

    Un reportage.

    <br>

    Une reconnaissance.

    <br>

    La mise en valeur d'un talent,
    d'un savoir-faire,
    d'une innovation
    ou d'une réalisation.

    <br><br>

    Votre nom prend désormais un sens.

    <br><br>

    Votre activité devient compréhensible.

    <br><br>

    Votre présence devient identifiable.

    <br><br>

    Vos métiers deviennent visibles.

    <br><br>

    <strong>
      Notoriété,
      crédibilité
      et ancrage
      se construisent alors
      dans le temps.
    </strong>

    <br><br>

    Le mécénat prend ainsi
    tout son sens :

    <br><br>

    <strong>
      c'est un véritable investissement
      dans votre territoire,
      votre connaissance,
      votre reconnaissance
      et votre avenir.
    </strong>

    <br><br>

    Ce n'est plus une dépense
    que l'on regarde partir.

    <br><br>

    <strong>
      C'est une valeur
      que l'on construit
      et qui continue de vivre.
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
    Au fil des années...
  </h2>

  <p
    style="
      margin:0;
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    Le temps passe.

    <br><br>

    Mais les engagements restent.

    <br>

    Les réalisations restent.

    <br>

    Les rencontres restent.

    <br>

    Les histoires restent.

    <br>

    La mémoire de celles et ceux
    qui ont participé reste.

    <br><br>

    <strong>
      Votre fiche avec

      <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>

      conservera progressivement
      la mémoire de votre engagement
      et de votre contribution à la vie :
      pour votre propre historique,
      mais aussi et surtout
      pour celui de votre commune.
    </strong>

    <br><br>

    Votre présence s'inscrit
    dans le temps.

    <br><br>

    Votre notoriété ne se construit
    alors plus seulement
    par ce que vous dites
    de votre entreprise...

    <br><br>

    <strong>
      mais aussi par tout ce que
      les autres savent désormais d'elle.
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
    Le mécénat est également
    un engagement reconnu
  </h2>

  <p
    style="
      margin:0;
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

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

    <strong>

      <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>

      vous aide à mieux comprendre
      ce dispositif
      et facilite,
      lorsque cela devient nécessaire,
      la mise en relation
      avec les professionnels compétents.

    </strong>

    <br><br>

    <strong>
      Parlons-en... ?
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
    Et demain ?
  </h2>

  <p
    style="
      margin:0;
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>

    ne dévoile pas à l'avance
    ce qui prendra vie
    dans votre commune.

    <br><br>

    <strong>
      Votre entreprise
      ou votre commerce
      en sera immanquablement informé.
    </strong>

    <br><br>

    Chacun choisira alors
    la place qu'il souhaite prendre.

    <br><br>

    <strong>
      Avancer ou pas.
    </strong>

    <br><br>

    <strong>
      Prendre sa place ou pas.
    </strong>

    <br><br>

    Mais une chose sera certaine :

    <br><br>

    <strong>
      vous saurez
      que l'occasion est là.
    </strong>

    <br><br>

    Car regarder ensuite
    ce qui aura été construit
    ne remplacera jamais
    le fait d'avoir participé
    à son histoire.

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
      color:#000000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">

    ne sont pas uniquement
    celles qui portent un bâtiment.

    <br><br>

    <strong>
      Ce sont celles
      qui permettent
      à votre entreprise
      de prendre racine,
      de grandir
      et de continuer à vivre
      dans la mémoire
      des générations
      qui suivront...
    </strong>

    <br><br>

    bien après
    que nous aurons tous
    quitté la scène.

    <br><br>

    <strong>
      Ce que vous construisez
      aujourd'hui
      dans votre territoire
      participe directement
      à ce que votre entreprise
      sera...
      ou laissera demain.
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
