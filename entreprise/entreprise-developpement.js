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
    Votre développement commence bien avant la vente.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Pensez-vous que votre entreprise soit connue dans votre commune ?
    <br><br>

    Votre première réponse sera probablement :
    <br><br>

    <strong>« Bien sûr ! »</strong>
    <br><br>

    Permettez-moi de vous poser cette question.
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
    Pouvez-vous citer cinq entreprises de votre commune ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    En dehors des grandes surfaces...
    <br>de votre boulanger...
    <br>de votre pharmacie...
    <br>de votre garagiste...
    <br>de tous les commerces que vous fréquentez habituellement...
    <br><br>

    Pouvez-vous citer :
    <br><br>

    • leur nom ;
    <br>• leurs métiers ;
    <br>• ce qu'elles fabriquent ;
    <br>• ce qu'elles proposent.
    <br><br>

    Bien souvent...
    <br>nous restons sans réponse.
    <br><br>

    <strong>Pourquoi ?</strong>
    <br><br>

    Parce que nous passons devant elles...
    <br>sans jamais vraiment les découvrir.
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
    Notre mémoire est pourtant étonnante.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Combien de fois vous êtes-vous arrêté devant une nouvelle vitrine en vous demandant :
    <br><br>

    <strong>« Qu'y avait-il ici avant ? »</strong>
    <br><br>

    ou simplement :
    <br><br>

    <strong>« C'était qui, ici, avant ? »</strong>
    <br><br>

    Très souvent...
    <br>personne ne s'en souvient.
    <br><br>

    Pourtant...
    <br>nous sommes passés devant des centaines de fois.
    <br><br>

    <strong>Pourquoi ?</strong>
    <br><br>

    Parce que voir...
    <br>n'est pas découvrir.
    <br><br>

    Notre cerveau retient rarement ce qu'il ne vit pas.
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
    Être vu ne suffit plus.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Une publicité s'oublie.
    <br>Un logo s'oublie.
    <br>Un nom s'oublie.
    <br><br>

    Mais une entreprise que l'on visite...
    <br>des femmes et des hommes que l'on rencontre...
    <br>un savoir-faire que l'on découvre...
    <br><br>

    laissent une empreinte durable dans la mémoire.
    <br><br>

    Lorsqu'un besoin apparaît...
    <br>le cerveau retrouve naturellement ce souvenir.
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
    Les règles du jeu ont bien changé.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Internet est devenu indispensable.

    <br><br>

    Les grandes plateformes disposent aujourd'hui de moyens considérables pour attirer l'attention.

    <br><br>

    <strong><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span></strong> ne vous demande pas de renoncer au numérique.

    <br><br>

    Il vous aide à renforcer ce que les grandes plateformes ne pourront jamais remplacer :

    <br><br>

    • votre proximité ;

    <br>• votre savoir-faire ;

    <br>• votre histoire ;

    <br>• la confiance ;

    <br>• votre ancrage profond dans votre territoire.

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
    Pourquoi ne pas ouvrir ponctuellement les portes de votre entreprise ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Beaucoup de dirigeants pensent immédiatement :

    <br><br>

    « Je n'ai pas le temps. »

    <br>« Cela coûte trop cher. »

    <br>« Nous avons des contraintes de sécurité. »

    <br>« Nous devons protéger notre savoir-faire. »

    <br><br>

    Toutes ces raisons existent.

    <br><br>

    Mais permettez-moi de partager une conviction qui guide la création de <strong>  <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#c62828;">Art</span></strong> :

    <br><br>

    <strong>Lorsque l'on ne souhaite pas faire quelque chose, on trouve des excuses.</strong>

    <br><br>

    <strong>Lorsque l'on décide de le faire, on trouve toujours la solution.</strong>

    <br><br>

    Une visite peut être organisée.

    <br>Des parcours adaptés peuvent être créés.

    <br>Des zones peuvent être protégées.

    <br>Des groupes peuvent être encadrés.

    <br><br>

    <strong>Il existe toujours la solution! </strong>

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
    Il ne s'agit pas d'un stage, de recruter ou d'embaucher.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Il s'agit de permettre aux élèves, préparés et encadrés par leur établissement scolaire, de découvrir les entreprises de leur commune.

    <br><br>

    <strong>Ne leur fermez plus vos portes.</strong>

    <br><br>

    <strong>Il en va de votre capital, de l'avenir et de la vie de votre entreprise.</strong>

    <br><br>

    Ils voient.

    <br>Ils comprennent.

    <br>Ils mémorisent.

    <br>Ils imaginent.

    <br><br>

    Ils découvrent enfin des métiers qui existent...

    <br><br>

    à seulement quelques minutes de chez eux.

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
    C'est ici que naissent souvent les vocations.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Un jour, on demandera à ces jeunes :

    <br><br>

    <strong>« Que souhaites-tu faire plus tard ? »</strong>

    <br><br>

    Au lieu de répondre :

    <br><br>

    <strong>« Je ne sais pas... »</strong>

    <br><br>

    certains répondront peut-être :

    <br><br>

    <strong>« J'ai visité cette entreprise... j'aimerais faire ce métier. »</strong>

    <br><br>

    Une seule visite peut ouvrir un avenir.

    <br><br>

    Quelques années plus tard...

    <br><br>

    ce même jeune vous adressera peut-être une candidature spontanée.

    <br><br>

    Non pas par hasard.

    <br><br>

    Mais parce qu'il sait qui vous êtes.

    <br>Il comprend votre activité.

    <br>Il connaît vos métiers.

    <br>Il sait pourquoi il souhaite rejoindre votre entreprise.

    <br><br>

    <strong>La découverte d'aujourd'hui construit les recrutements plus solides de demain.</strong>

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
    Vous venez aussi de créer vos premiers ambassadeurs naturels.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Le soir même...

    <br><br>

    ces jeunes racontent leur visite.

    <br><br>

    À leurs parents.

    <br>À leurs proches.

    <br>À leurs amis.

    <br><br>

    Votre entreprise cesse d'être un simple bâtiment.

    <br><br>

    <strong>Elle devient une entreprise que l'on connaît bien mieux.</strong>

    <br><br>

    Une entreprise dont on parle.

    <br>Dont on connaît enfin les métiers.

    <br>Dont on comprend ce qu'elle produit.

    <br><br>

    Sans publicité.

    <br>Sans flyers.

    <br>Sans démarchage.

    <br><br>

    <strong>Simplement... naturellement.</strong>

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
    Votre véritable développement commence ici.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Avant de chercher davantage de clients...

    <br><br>

    <strong>commencez par être véritablement connu et reconnu.</strong>

    <br><br>

    Avant de vouloir recruter...

    <br><br>

    <strong>commencez par être attirant.</strong>

    <br><br>

    Soyez identifié.

    <br>Soyez compris.

    <br>Soyez repéré.

    <br><br>

    <strong>Soyez enfin mémorisé.</strong>

    <br><br>

    Une entreprise connue attire plus facilement :

    <br><br>

    • des clients ;

    <br>• des candidats ;

    <br>• des partenaires ;

    <br>• des fournisseurs ;

    <br>• des recommandations.

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
    Renforcez d'abord vos fondations.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      line-height:1.6;
    ">

    Une entreprise solide ne se construit jamais uniquement avec de la publicité.

    <br><br>

    <strong>Elle se construit d'abord par la connaissance de ce qu'elle est, de ce qu'elle fait et de ce qu'elle produit.</strong>

    <br><br>

    En permettant aux habitants de mieux connaître votre entreprise...

    <br><br>

    vous développez naturellement la publicité la plus ancienne...

    <br><br>

    <strong>la plus belle...</strong>

    <br><br>

    <strong>et probablement la plus efficace :</strong>

    <br><br>

    <strong style="font-size:18px;">
      Le bouche-à-oreille.
    </strong>

    <br><br>

    Celui que tout le monde recherche.

    <br><br>

    <strong>Celui qu'aucune campagne publicitaire ne peut réellement remplacer... ni acheter.</strong>

  </p>

</div>


<div
  style="
    margin-top:18px;
  ">

  <button
    id="developmentNextBtn"
    class="choiceBtn"
    type="button"
    style="width:100%;">

    Cliquez pour découvrir :
    <br>
    <strong>Pourquoi payer plus cher ?</strong>

  </button>

</div>

`;

}
  
function bindDevelopment(){

  const nextButton =
    getElement(
      "developmentNextBtn"
    );

  if(nextButton){

    nextButton.onclick = function(){

      module.openScreen(
        "mutualisation"
      );

    };
  }

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
        showBack:false,
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
