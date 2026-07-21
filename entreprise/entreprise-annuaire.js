/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE ANNUAIRE ÉCONOMIQUE
   DÉCOUVRIR LES ENTREPRISES AUTREMENT
   ========================================================= */

(function initEntrepriseAnnuaire(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-annuaire.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  /* =======================================================
     PAGE PRINCIPALE — ANNUAIRE ÉCONOMIQUE
     ======================================================= */

  function getDirectoryHtml(){

    return `

      <div
        class="box entrepriseModuleIntro"
        style="
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          class="entrepriseModuleTitle"
          style="
            color:#2f5d46;
            font-size:17px;
            line-height:1.4;
            font-weight:700;
          ">

          L’annuaire devient votre véritable outil
          de développement économique.

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Il ne s’agit plus
          d’une simple liste de noms.

          <br><br>

          L’annuaire Bo'CitéArt révèle
          les entreprises,
          les commerces,
          les artisans,
          les métiers
          et les savoir-faire
          présents dans votre commune
          et sur votre territoire.

          <br><br>

          Il permet aux habitants,
          aux professionnels
          et aux collectivités
          de découvrir rapidement
          les richesses économiques
          qui existent déjà autour d’eux.

          <br><br>

          Il vous aide à trouver,
          à être trouvé
          et à créer de nouvelles opportunités.

          <br><br>

          Et il ne vous coûte rien.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          class="entrepriseModuleSubtitle"
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Connaissez-vous vraiment votre entreprise ?

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Vous connaissez votre métier.

          <br><br>

          Vous connaissez vos produits,
          vos services,
          vos équipes
          et vos clients.

          <br><br>

          Mais connaissez-vous réellement
          l’image que votre entreprise renvoie
          à celles et ceux
          qui passent devant elle chaque jour ?

          <br><br>

          Les habitants savent-ils
          ce que vous fabriquez ?

          <br><br>

          Connaissent-ils vos métiers ?

          <br><br>

          Savent-ils que vous recrutez,
          que vous recherchez des partenaires,
          des fournisseurs,
          des sous-traitants
          ou de nouvelles compétences ?

          <br><br>

          Connaissent-ils les savoir-faire
          développés par votre entreprise
          depuis parfois plusieurs décennies ?

          <br><br>

          Trop souvent,
          la réponse est non.

          <br><br>

          Votre entreprise est présente.

          <br>

          Elle est visible physiquement.

          <br>

          Mais elle reste inconnue
          d’une grande partie de son territoire.

          <br><br>

          Ce n’est plus un simple angle mort.

          <br>

          C’est un véritable ravin
          entre ce que votre entreprise possède
          et ce que les autres en connaissent.

          <br><br>

          L’annuaire Bo'CitéArt
          commence à combler ce ravin.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          class="entrepriseModuleSubtitle"
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Commencez par regarder autour de vous.

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Chaque jour,
          des entreprises recherchent :

          <br><br>

          <span style="color:#2f5d46;">–</span>
          de nouveaux clients ;<br>

          <span style="color:#2f5d46;">–</span>
          des fournisseurs ;<br>

          <span style="color:#2f5d46;">–</span>
          des partenaires ;<br>

          <span style="color:#2f5d46;">–</span>
          des sous-traitants ;<br>

          <span style="color:#2f5d46;">–</span>
          des compétences particulières ;<br>

          <span style="color:#2f5d46;">–</span>
          des salariés ;<br>

          <span style="color:#2f5d46;">–</span>
          une solution à un besoin précis.

          <br><br>

          Trop souvent,
          elles commencent immédiatement
          par chercher loin.

          <br><br>

          Pourtant,
          la réponse existe déjà
          à quelques rues
          ou à quelques kilomètres.

          <br><br>

          Encore faut-il savoir
          qu’elle existe.

          <br><br>

          Pourquoi aller chercher loin
          ce qui existe déjà
          près de chez vous ?

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          class="entrepriseModuleSubtitle"
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Un annuaire vivant

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Découvrez et recherchez rapidement :

          <br><br>

          <span style="color:#2f5d46;">–</span>
          les entreprises ;<br>

          <span style="color:#2f5d46;">–</span>
          les commerces ;<br>

          <span style="color:#2f5d46;">–</span>
          les artisans ;<br>

          <span style="color:#2f5d46;">–</span>
          les secteurs d’activité ;<br>

          <span style="color:#2f5d46;">–</span>
          les métiers ;<br>

          <span style="color:#2f5d46;">–</span>
          les savoir-faire ;<br>

          <span style="color:#2f5d46;">–</span>
          les produits ;<br>

          <span style="color:#2f5d46;">–</span>
          les services ;<br>

          <span style="color:#2f5d46;">–</span>
          les partenaires ;<br>

          <span style="color:#2f5d46;">–</span>
          les fournisseurs ;<br>

          <span style="color:#2f5d46;">–</span>
          les sous-traitants ;<br>

          <span style="color:#2f5d46;">–</span>
          les recherches professionnelles ;<br>

          <span style="color:#2f5d46;">–</span>
          les besoins exprimés par les entreprises.

          <br><br>

          L’annuaire devient
          un point de rencontre économique
          entre les besoins
          et les compétences disponibles.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          class="entrepriseModuleSubtitle"
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Un dirigeant ne recherche pas seulement un client.

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Il recherche également :

          <br><br>

          <span style="color:#2f5d46;">–</span>
          une compétence ;<br>

          <span style="color:#2f5d46;">–</span>
          une idée ;<br>

          <span style="color:#2f5d46;">–</span>
          un fabricant ;<br>

          <span style="color:#2f5d46;">–</span>
          un artisan ;<br>

          <span style="color:#2f5d46;">–</span>
          un bureau d’études ;<br>

          <span style="color:#2f5d46;">–</span>
          un transporteur ;<br>

          <span style="color:#2f5d46;">–</span>
          un expert ;<br>

          <span style="color:#2f5d46;">–</span>
          un futur partenaire ;<br>

          <span style="color:#2f5d46;">–</span>
          une réponse rapide à un problème concret.

          <br><br>

          L’annuaire Bo'CitéArt
          rassemble ces possibilités
          dans un même espace.

          <br><br>

          Vous ne perdez plus votre premier réflexe
          à chercher partout.

          <br><br>

          Vous commencez
          par découvrir les forces
          déjà présentes autour de vous.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          class="entrepriseModuleSubtitle"
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Être connu devient un avantage concurrentiel.

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Les meilleures entreprises
          ne sont pas toujours
          les plus connues.

          <br><br>

          Pourtant,
          une entreprise clairement identifiée
          multiplie ses opportunités.

          <br><br>

          Elle reçoit davantage de contacts.

          <br>

          Elle développe les recommandations.

          <br>

          Elle facilite les collaborations.

          <br>

          Elle attire de nouveaux partenaires.

          <br>

          Elle fait connaître ses besoins.

          <br>

          Elle devient plus facilement
          une référence sur son territoire.

          <br><br>

          Aujourd’hui,
          être excellent ne suffit plus.

          <br><br>

          Il faut être vu.

          <br>

          Il faut être connu.

          <br>

          Il faut être reconnu.

          <br><br>

          L’annuaire Bo'CitéArt
          constitue la première porte d’entrée
          vers cette reconnaissance.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          class="entrepriseModuleSubtitle"
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Des opportunités locales qui peuvent aller plus loin.

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Bo'CitéArt commence
          par révéler les richesses
          de votre commune
          et de votre territoire.

          <br><br>

          Les entreprises inscrites
          développent ensuite
          leurs relations
          selon leurs activités,
          leurs besoins
          et leur capacité à intervenir.

          <br><br>

          Une compétence locale
          peut répondre à un besoin local.

          <br><br>

          Elle peut également
          ouvrir une collaboration
          départementale,
          régionale,
          nationale
          ou européenne.

          <br><br>

          Le point de départ reste le même :

          <br><br>

          mieux connaître
          ce qui existe déjà autour de soi
          avant d’élargir sa recherche.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          class="entrepriseModuleSubtitle"
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Une base économique régulièrement enrichie

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Les entreprises,
          les commerces,
          les artisans
          et les professionnels
          disposent d’un espace
          pour présenter
          et mettre à jour leurs informations.

          <br><br>

          Bo'CitéArt enrichit progressivement
          cette base économique
          afin qu’elle reste
          claire,
          utile
          et la plus fiable possible.

          <br><br>

          Une base vivante
          ne se contente pas d’exister.

          <br><br>

          Elle évolue avec les entreprises,
          leurs métiers,
          leurs recherches
          et les besoins du territoire.

        </div>

      </div>

      <div
        class="entrepriseModuleActions">

        <button
          id="directorySearchBtn"
          class="choiceBtn"
          type="button">

          Rechercher une entreprise

        </button>

        <button
          id="directoryProfessionalBtn"
          class="choiceBtn"
          type="button">

          Recherche professionnelle

        </button>

        <button
          id="directoryVisibilityBtn"
          class="choiceBtn"
          type="button">

          Faire connaître mon entreprise

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion"
        style="
          color:#111;
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Ce qui existe autour de nous
          ne doit plus rester invisible.

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Plus les entreprises
          d’une commune sont connues,

          <br><br>

          plus elles développent
          leurs contacts,
          leurs collaborations,
          leurs recommandations
          et leurs possibilités d’activité.

          <br><br>

          L’entreprise découvre
          de nouvelles ressources.

          <br>

          Les professionnels travaillent
          plus facilement ensemble.

          <br>

          Les habitants comprennent mieux
          les richesses économiques
          présentes autour d’eux.

          <br>

          La collectivité connaît davantage
          les forces de son territoire.

          <br><br>

          L’annuaire ne crée pas
          les compétences.

          <br><br>

          Il révèle enfin
          celles qui existaient déjà.

        </div>

      </div>

      <!-- =================================================
           INFORMATION BERCY INFOS ENTREPRISES
           Placée en fin de page
           ================================================= -->

      <div
        class="box"
        style="
          margin-top:16px;
          border-left:6px solid #2f5d46;
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:16px;
            line-height:1.4;
            font-weight:700;
          ">

          Restez informé des changements
          utiles à votre entreprise

        </div>

        <div
          style="
            margin-top:12px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Aides,
          obligations légales,
          fiscalité,
          comptabilité
          et gestion d’entreprise :

          <br><br>

          découvrez également
          Bercy Infos Entreprises,
          un service officiel et gratuit.

        </div>

        <button
          id="directoryBercyInfoBtn"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:14px;
          ">

          Découvrir Bercy Infos Entreprises

        </button>

      </div>

    `;
  }

  /* =======================================================
     ACTIONS DE L'ANNUAIRE
     ======================================================= */

  function bindDirectory(){

    const searchButton =
      getElement(
        "directorySearchBtn"
      );

    const professionalButton =
      getElement(
        "directoryProfessionalBtn"
      );

    const visibilityButton =
      getElement(
        "directoryVisibilityBtn"
      );

    const bercyInfoButton =
      getElement(
        "directoryBercyInfoBtn"
      );

    if(searchButton){

      searchButton.onclick = function(){

        if(
          typeof module.openLocalDirectory ===
          "function"
        ){

          module.openLocalDirectory();
          return;
        }

        module.openScreen(
          "annuaire_local"
        );
      };
    }

    if(professionalButton){

      professionalButton.onclick = function(){

        module.openScreen(
          "annuaire"
        );
      };
    }

    if(visibilityButton){

      visibilityButton.onclick = function(){

        module.openScreen(
          "visibilite"
        );
      };
    }

    if(bercyInfoButton){

      bercyInfoButton.onclick = function(){

        openBercyInfoPage();
      };
    }

  }

  /* =======================================================
     PAGE BERCY INFOS ENTREPRISES
     ======================================================= */

  function getBercyInfoHtml(){

    return `

      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          font-size:15px;
          line-height:1.55;
          font-weight:400;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            line-height:1.4;
            font-weight:700;
          ">

          Pourquoi s’abonner
          à Bercy Infos Entreprises ?

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.55;
            font-weight:400;
          ">

          Recevez régulièrement
          les informations officielles
          utiles à votre entreprise :

          <br><br>

          <span style="color:#2f5d46;">–</span>
          nouvelles aides et subventions ;<br>

          <span style="color:#2f5d46;">–</span>
          crédits d’impôt ;<br>

          <span style="color:#2f5d46;">–</span>
          TVA et facturation électronique ;<br>

          <span style="color:#2f5d46;">–</span>
          nouvelles obligations légales ;<br>

          <span style="color:#2f5d46;">–</span>
          évolutions fiscales et comptables ;<br>

          <span style="color:#2f5d46;">–</span>
          conseils pratiques de gestion.

          <br><br>

          Les informations sont officielles,
          régulièrement mises à jour
          et sans publicité commerciale.

          <br><br>

          Ce service du ministère
          de l’Économie est gratuit.

        </div>

      </div>

      <a
        href="https://www.economie.gouv.fr/abonnement"
        target="_blank"
        rel="noopener noreferrer"
        class="choiceBtn"
        style="
          display:block;
          width:100%;
          box-sizing:border-box;
          margin-top:14px;
          text-align:center;
          text-decoration:none;
        ">

        S’abonner gratuitement

      </a>

      <button
        id="directoryBercyBackBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
        ">

        Retour à l’annuaire économique

      </button>

    `;
  }

  function bindBercyInfoPage(){

    const backButton =
      getElement(
        "directoryBercyBackBtn"
      );

    if(backButton){

      backButton.onclick = function(){

        openDirectoryModule();
      };
    }

  }

  function openBercyInfoPage(){

    module.renderModulePage(

      "Bercy Infos Entreprises",

      getBercyInfoHtml(),

      {
        afterRender:
          bindBercyInfoPage
      }

    );
  }

  /* =======================================================
     OUVERTURE DE L'ANNUAIRE
     ======================================================= */

  function openDirectoryModule(){

    module.renderModulePage(

      "Annuaire économique",

      getDirectoryHtml(),

      {
        afterRender:
          bindDirectory
      }

    );
  }

  /* =======================================================
     ENREGISTREMENT
     ======================================================= */

  module.registerScreen(
    "annuaire_local",
    openDirectoryModule
  );

  module.openDirectoryModule =
    openDirectoryModule;

  module.openBercyInfoPage =
    openBercyInfoPage;

  console.log(
    "✅ Module Annuaire économique avec Bercy Infos chargé"
  );

})();
