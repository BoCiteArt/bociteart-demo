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
      font-size:16px;
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

    Comme beaucoup de dirigeants,
    votre première réponse sera probablement :
    <br><br>

    « Bien sûr ! »
    <br><br>

    Alors, permettez-moi de vous poser une autre question.
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
    <br>des commerces que tout le monde fréquente...
    <br><br>

    Pouvez-vous citer cinq entreprises ?
    <br><br>

    Leur nom.
    <br>Leurs métiers.
    <br>Ce qu'elles fabriquent.
    <br>Ce qu'elles proposent.
    <br><br>

    Bien souvent...
    <br>nous restons sans réponse.
    <br><br>

    Pourquoi ?
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
      font-size:16px;
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
    Combien de fois vous êtes-vous arrêté devant une nouvelle vitrine
    en vous demandant :
    <br><br>

    « Qu'y avait-il ici avant ? »
    <br><br>

    Très souvent...
    <br>personne ne s'en souvient.
    <br><br>

    Pourtant...
    <br>nous sommes parfois passés devant des centaines de fois.
    <br><br>

    Pourquoi ?
    <br><br>

    Parce que voir...
    <br>n'est pas découvrir.
    <br><br>

    Et notre cerveau retient rarement ce qu'il ne vit pas.
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
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Les règles du jeu ont changé.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Internet est devenu indispensable.
    <br><br>

    Les grandes plateformes disposent aujourd'hui
    de moyens considérables pour attirer l'attention.
    <br><br>

    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span>
    ne vous demande pas de renoncer au numérique.
    <br><br>

    Il vous aide à renforcer ce que les grandes plateformes
    ne pourront jamais remplacer :
    <br><br>

    • votre proximité ;
    <br>• votre savoir-faire ;
    <br>• votre histoire ;
    <br>• la confiance ;
    <br>• votre ancrage dans votre territoire.
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
    Pourquoi ouvrir ponctuellement les portes de votre entreprise ?
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Beaucoup de dirigeants pensent immédiatement :
    <br><br>

    « Je n'ai pas le temps. »
    <br><br>

    « Cela coûte trop cher. »
    <br><br>

    « Nous avons des contraintes de sécurité. »
    <br><br>

    « Nous devons protéger notre savoir-faire. »
    <br><br>

    Toutes ces raisons existent.
    <br><br>

    Mais permettez-moi de partager une conviction
    qui guide la création de
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span> :
    <br><br>

    <strong>
      Lorsque l'on ne souhaite pas faire quelque chose,
      on trouve des excuses.
    </strong>
    <br><br>

    <strong>
      Lorsque l'on décide de le faire,
      on trouve des solutions.
    </strong>
    <br><br>

    Une visite peut être organisée.
    <br>Des parcours adaptés peuvent être créés.
    <br>Des zones peuvent être protégées.
    <br>Des groupes peuvent être encadrés.
    <br><br>

    Il existe presque toujours une solution.
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
    Il ne s'agit pas d'un stage.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Il ne s'agit pas de recruter immédiatement.
    <br><br>

    Il ne s'agit pas d'embaucher.
    <br><br>

    Il s'agit simplement de permettre aux élèves
    de découvrir les entreprises de leur propre commune.
    <br><br>

    Ils voient.
    <br>Ils comprennent.
    <br>Ils mémorisent.
    <br>Ils imaginent.
    <br><br>

    Ils découvrent enfin des métiers qui existent parfois...
    <br>à seulement quelques minutes de chez eux.
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
    C'est ici que naissent souvent les vocations.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Un jour, on demandera à ces jeunes :
    <br><br>

    « Que souhaites-tu faire plus tard ? »
    <br><br>

    Au lieu de répondre :
    <br><br>

    « Je ne sais pas... »
    <br><br>

    certains répondront peut-être :
    <br><br>

    « J'ai visité cette entreprise...
    j'aimerais faire ce métier. »
    <br><br>

    Une seule visite peut parfois ouvrir un avenir.
    <br><br>

    Et quelques années plus tard...
    <br><br>

    ce même jeune vous adressera peut-être
    une candidature spontanée.
    <br><br>

    Non pas par hasard.
    <br><br>

    Mais parce qu'il sait qui vous êtes.
    <br>Il comprend votre activité.
    <br>Il connaît vos métiers.
    <br>Il sait pourquoi il souhaite rejoindre votre entreprise.
    <br><br>

    <strong>
      La découverte d'aujourd'hui construit
      le recrutement plus solide de demain.
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
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    Vous venez aussi de créer vos premiers ambassadeurs.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
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

    Elle devient une entreprise que l'on connaît.
    <br>Que l'on comprend.
    <br>Et dont on parle.
    <br><br>

    Sans publicité.
    <br>Sans démarchage.
    <br>Naturellement.
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
    Votre développement commence ici.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Avant de chercher davantage de clients...
    <br>commencez par être connu.
    <br><br>

    Avant de vouloir recruter...
    <br>commencez par être compris.
    <br><br>

    Avant d'espérer être choisi...
    <br>commencez par être mémorisé.
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
      font-size:16px;
      font-weight:700;
      line-height:1.4;
    ">
    <span style="color:#2f5d46;font-weight:700;">Bo'Cité</span><span style="color:#c62828;font-weight:700;">Art</span> renforce vos fondations.
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Il rapproche les habitants de leurs entreprises.
    <br><br>

    Il développe naturellement le bouche-à-oreille.
    <br><br>

    Il favorise les rencontres.
    <br><br>

    Il crée davantage d'opportunités.
    <br><br>

    Il transforme progressivement une entreprise que l'on ignore...
    <br><br>

    en une entreprise que l'on connaît...
    <br>que l'on comprend...
    <br>que l'on recommande...
    <br><br>

    et à laquelle on pense naturellement lorsqu'un besoin apparaît.
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
    Une entreprise peut grandir seule...
  </h2>

  <p
    style="
      margin:0;
      color:#000;
      font-size:14px;
      font-weight:400;
      line-height:1.6;
    ">
    Mais lorsqu'un territoire apprend à mieux se connaître...
    <br><br>

    chaque entreprise devient aussi une opportunité pour les autres.
    <br><br>

    <strong>
      Découvrons maintenant comment la mutualisation
      transforme cette force collective
      en nouvelles opportunités.
    </strong>
  </p>

</div>


<div
  style="
    display:flex;
    margin-top:16px;
  ">

 <button
  id="developmentNextBtn"
  class="choiceBtn"
  type="button"
  style="
    width:100%;
  ">
  Pourquoi payer plus cher ?
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
