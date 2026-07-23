/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE EMPLOI
   RECRUTER AUTREMENT
   ========================================================= */

(function initEntrepriseEmploi(){ 

  "use strict"; 

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-emploi.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getBociteArtHtml(){

  return `
    <span
      style="
        white-space:nowrap;
        font-weight:700;
      ">
      <span style="color:#21624d;">Bo'Cité</span><span style="color:#d40000;">Art</span>
    </span>
  `;
}

  function getTitleHtml(title, centered){

    return `
      <div
        class="entrepriseModuleSubtitle"
        style="
          color:#21624d;
          font-weight:700;
          margin:0 0 24px 0;
          line-height:1.35;
          ${centered ? "text-align:center;" : ""}
        ">
        ${title}
      </div>
    `;
  }

  function getEmploymentHtml(){

    const bociteart =
      getBociteArtHtml();

    return `

      <div
        class="box entrepriseModuleIntro"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Le recrutement ne commence pas par une annonce"
        )}

        Les entreprises cherchent des compétences.

        <br><br>

        Les habitants cherchent un emploi,
        un stage,
        une alternance
        ou une meilleure qualité de vie.

        <br><br>

        Les établissements scolaires
        préparent les jeunes à leur avenir.

        <br><br>

        Les communes souhaitent maintenir
        l'activité,
        l'emploi
        et les savoir-faire
        sur leur territoire.

        <br><br>

        Tout le monde partage donc
        une partie du même objectif.

        <br><br>

        Pourtant,
        chacun agit encore trop souvent
        de son côté.

        <br><br>

        Les entreprises publient.

        Les candidats recherchent.

        Les écoles orientent.

        Les collectivités accompagnent.

        <br><br>

        Mais ces actions restent encore
        trop souvent séparées.

        <br><br>

        Les outils existent.

        Les compétences existent.

        Les besoins existent.

        <br><br>

        Ce qui manque le plus souvent,
        c'est le lien capable
        de les réunir durablement.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Un ravin s'est installé entre les entreprises et leur propre territoire"
        )}

        Une entreprise peut être reconnue
        par ses clients,
        ses fournisseurs
        ou son secteur professionnel,

        tout en restant presque inconnue
        des habitants
        qui vivent à quelques rues.

        <br><br>

        Ses métiers sont peu visibles.

        Son savoir-faire est mal identifié.

        Ses réalisations restent méconnues.

        Ses besoins de recrutement
        circulent insuffisamment.

        <br><br>

        Dans le même temps,
        des habitants ignorent
        qu'une opportunité existe
        près de chez eux.

        <br><br>

        Des jeunes découvrent parfois
        des métiers présents
        dans leur propre commune

        uniquement lorsqu'ils commencent
        à rechercher un stage,
        une alternance
        ou une orientation.

        <br><br>

        Des candidats parcourent
        plusieurs dizaines de kilomètres

        alors qu'une entreprise proche
        pourrait rechercher
        exactement leurs compétences.

        <br><br>

        Ce décalage n'est pas
        un manque de volonté.

        <br><br>

        C'est avant tout
        un manque de visibilité,
        de circulation de l'information
        et de connexion entre les acteurs.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Et si votre futur salarié habitait déjà dans votre commune ?"
        )}

        Avant de rechercher
        à plusieurs dizaines de kilomètres,

        demandez-vous si la personne
        que vous recherchez
        ne vit pas déjà
        près de votre entreprise.

        <br><br>

        Votre futur collaborateur
        habite peut-être
        à quelques rues seulement.

        <br><br>

        Mais il ne connaît pas forcément :

        <br><br>

        • votre entreprise ;<br>
        • vos métiers ;<br>
        • vos équipes ;<br>
        • vos projets ;<br>
        • vos valeurs ;<br>
        • vos besoins de recrutement.

        <br><br>

        De votre côté,
        vous ignorez peut-être
        que ses compétences
        existent déjà
        dans votre environnement proche.

        <br><br>

        Avant de rechercher plus loin,
        commencez donc
        par rendre votre entreprise
        pleinement visible
        sur son propre territoire.

        <br><br>

        C'est là
        que se trouvent
        vos premières opportunités.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Les moyens de recrutement existent déjà"
        )}

        France Travail,
        les agences d'intérim,
        les sites spécialisés,
        les annonces,
        les réseaux professionnels
        et le bouche-à-oreille

        restent utiles
        et nécessaires.

        <br><br>

        Mais ils interviennent souvent
        lorsque la recherche
        est déjà engagée.

        <br><br>

        Ils ne suffisent pas toujours
        à faire connaître durablement
        une entreprise
        auprès des habitants
        de sa propre commune.

        <br><br>

        Publier une annonce
        permet de faire connaître
        un poste disponible.

        <br><br>

        Faire connaître l'entreprise
        permet de préparer
        les recrutements futurs.

        <br><br>

        Lorsqu'un habitant connaît déjà
        votre activité,
        votre savoir-faire
        et vos métiers,

        votre prochaine annonce
        ne lui apparaît plus
        comme une information isolée.

        <br><br>

        Elle devient une opportunité
        proposée par une entreprise
        qu'il connaît déjà.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Avant de publier une offre, faites enfin connaître votre entreprise"
        )}

        On ne postule pas facilement
        dans une entreprise
        dont on ignore l'existence.

        <br><br>

        On recommande encore moins
        une entreprise
        que l'on ne connaît pas.

        <br><br>

        Vous pensez peut-être
        que votre entreprise
        est déjà connue.

        <br><br>

        Pourtant,
        rappelez-vous cette simple question :

        <br><br>

        <span
          style="
            display:block;
            color:#21624d;
            font-weight:700;
            text-align:center;
            line-height:1.5;
          ">
          « Pourriez-vous me donner
          cinq noms d'entreprises
          dans votre ville ? »
        </span>

        <br>

        Pour la plupart des habitants,
        la réponse est difficile.

        <br><br>

        Et si les habitants
        ne connaissent pas
        les entreprises présentes
        autour d'eux,

        comment pourraient-ils
        penser spontanément à elles
        pour travailler,
        recommander un proche,
        proposer une candidature
        ou orienter un jeune ?

        <br><br>

        La première mission
        consiste donc à rendre visibles :

        <br><br>

        • vos métiers ;<br>
        • vos compétences ;<br>
        • vos réalisations ;<br>
        • vos équipes ;<br>
        • vos valeurs ;<br>
        • vos projets ;<br>
        • vos besoins actuels et futurs.

        <br><br>

        Plus votre entreprise
        est connue localement,

        plus elle peut être identifiée
        comme un employeur possible,

        même lorsqu'aucune annonce
        n'est encore publiée.

        <br><br>

        Cette visibilité prépare
        les candidatures spontanées,
        les recommandations,
        les stages,
        les alternances
        et les recrutements futurs.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Les habitants deviennent vos premiers relais"
        )}

        Lorsqu'une entreprise
        prend réellement sa place
        dans la vie locale,

        les habitants commencent
        à mieux connaître
        ses activités
        et ses besoins.

        <br><br>

        Ils peuvent alors parler
        de ses métiers
        à leur famille,
        à leurs voisins,
        à leurs proches
        ou à leurs connaissances.

        <br><br>

        Une information
        qui serait restée isolée

        peut ainsi atteindre
        la bonne personne
        par une recommandation locale.

        <br><br>

        Les habitants ne remplacent pas
        les professionnels du recrutement.

        <br><br>

        Ils deviennent
        un relais supplémentaire,
        naturel
        et permanent.

        <br><br>

        Ce sont souvent
        les premiers ambassadeurs
        d'une entreprise
        qu'ils connaissent,
        comprennent
        et reconnaissent
        comme utile à leur territoire.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Relier enfin ce qui fonctionne encore séparément"
        )}

        On parle depuis longtemps
        d'emploi local,
        de proximité,
        d'orientation,
        d'attractivité,
        de mobilité
        et de qualité de vie.

        <br><br>

        Toutes ces idées sont justes.

        <br><br>

        Mais elles restent trop souvent
        réparties entre plusieurs acteurs,
        plusieurs services
        et plusieurs outils

        qui communiquent peu
        entre eux.

        <br><br>

        ${bociteart}
        ne remplace pas
        ce qui existe.

        <br><br>

        ${bociteart}
        relie les acteurs,
        les outils
        et les initiatives

        afin que chacun
        puisse produire davantage
        de résultats.

        <br><br>

        En reliant progressivement
        les entreprises,
        les habitants,
        les jeunes,
        les établissements scolaires,
        les associations
        et les collectivités,

        ${bociteart}
        favorise des rencontres
        qui, sans cela,
        n'auraient probablement
        jamais eu lieu.

        <br><br>

        Un jeune peut découvrir
        un métier présent
        dans sa propre ville.

        <br><br>

        Un habitant peut identifier
        une entreprise
        qu'il ne connaissait pas.

        <br><br>

        Une personne en recherche
        peut découvrir une opportunité
        à proximité.

        <br><br>

        Une entreprise peut trouver
        une compétence
        qu'elle recherchait loin,

        alors qu'elle existait déjà
        sur son territoire.

        <br><br>

        Tout le monde dit
        qu'il faudrait mieux relier
        les entreprises,
        les habitants,
        les écoles
        et les collectivités.

        <br><br>

        ${bociteart}
        réunit enfin
        les outils nécessaires
        pour le faire concrètement.

        <br><br>

        Le manque de lien
        ne peut donc plus
        rester une excuse
        pour ne pas agir.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Un emploi plus proche peut changer le quotidien"
        )}

        Un recrutement de proximité
        peut permettre :

        <br><br>

        • moins de kilomètres parcourus ;<br>
        • moins de temps passé dans les transports ;<br>
        • moins de fatigue quotidienne ;<br>
        • une réduction du coût des déplacements ;<br>
        • davantage de temps personnel et familial ;<br>
        • une organisation quotidienne plus simple ;<br>
        • parfois même la possibilité de se passer d'un second véhicule.

        <br><br>

        Pour le salarié,
        cette proximité peut représenter
        une amélioration concrète
        de la qualité de vie.

        <br><br>

        Pour l'entreprise,
        elle peut réduire
        certaines difficultés
        liées aux longs trajets,
        aux retards,
        à la fatigue
        ou aux changements d'organisation.

        <br><br>

        La proximité ne garantit pas
        à elle seule
        la réussite d'un recrutement.

        <br><br>

        Mais elle peut devenir
        un avantage réel
        pour attirer,
        accueillir
        et conserver
        les compétences.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Recruter localement, c'est aussi mieux fidéliser"
        )}

        Trouver un salarié
        est une première étape.

        <br><br>

        Lui donner envie de rester
        est tout aussi important.

        <br><br>

        Une entreprise
        mieux connue,
        mieux intégrée
        et mieux reliée
        à son territoire

        peut renforcer
        son attractivité.

        <br><br>

        Un salarié qui travaille
        plus près de son domicile

        peut retrouver du temps,
        réduire certaines dépenses
        et mieux organiser
        sa vie quotidienne.

        <br><br>

        Cette qualité de vie retrouvée
        peut renforcer son adhésion
        à l'entreprise
        et favoriser sa fidélisation.

        <br><br>

        Le recrutement ne se limite plus
        à pourvoir un poste.

        <br><br>

        Il devient une relation durable
        entre une entreprise,
        une personne
        et un territoire.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Commencez au plus près, puis élargissez"
        )}

        Recruter localement
        ne signifie pas
        limiter systématiquement
        la recherche
        à une seule commune.

        <br><br>

        Cela signifie commencer
        dans le bon ordre.

        <br><br>

        D'abord,
        rendre l'entreprise visible
        dans son environnement immédiat.

        <br><br>

        Ensuite,
        rechercher dans la commune
        et les communes voisines.

        <br><br>

        Puis,
        si nécessaire,
        élargir progressivement :

        <br><br>

        • au département ;<br>
        • à la région ;<br>
        • puis à un territoire plus large.

        <br><br>

        Cette méthode évite
        de chercher immédiatement loin

        ce qui pourrait déjà exister
        à proximité.

      </div>

      <div
        class="box"
        style="
          font-weight:400;
          line-height:1.65;
        ">

       ${getTitleHtml(
  `Les outils
  <span style="white-space:nowrap;">
    <span style="color:#21624d;">Bo'Cité</span><span style="color:#d40000;">Art</span>
  </span>
  pour passer à l'action`
)}

        ${bociteart}
        met progressivement
        à votre disposition
        plusieurs outils complémentaires :

        <br><br>

        • faire connaître votre entreprise ;<br>
        • présenter vos métiers et votre savoir-faire ;<br>
        • publier une offre d'emploi ;<br>
        • rechercher un salarié ;<br>
        • recevoir des candidatures spontanées ;<br>
        • proposer un stage ;<br>
        • accueillir un alternant ;<br>
        • renforcer votre visibilité locale.

        <br><br>

        Aucun de ces outils
        ne doit fonctionner seul.

        <br><br>

        Leur force vient
        de leur capacité
        à se compléter.

        <br><br>

        La visibilité prépare
        la recommandation.

        <br><br>

        La recommandation
        facilite la rencontre.

        <br><br>

        La rencontre
        peut conduire
        à une candidature.

        <br><br>

        La proximité
        peut ensuite favoriser
        une relation plus durable.

        <br><br>

        La priorité,
        pour l'entreprise,
        est donc de prendre rapidement
        toute sa place
        dans cette dynamique locale.

        <br><br>

        Tant qu'elle reste invisible
        pour une grande partie
        de son propre territoire,

        une partie de ses opportunités,
        de ses futurs candidats
        et de ses futurs relais

        reste elle aussi invisible.

      </div>

      <div
        class="entrepriseModuleActions">

        <button
          id="emploiOffersBtn"
          class="choiceBtn"
          type="button">

          Consulter les offres

        </button>

        <button
          id="emploiCvBtn"
          class="choiceBtn"
          type="button">

          Déposer un CV

        </button>

        <button
          id="emploiPublishBtn"
          class="choiceBtn"
          type="button">

          Publier une offre

        </button>

        <button
          id="emploiApplicationsBtn"
          class="choiceBtn"
          type="button">

          Voir mes candidatures

        </button>

      </div>

      <div
        class="box entrepriseModuleConclusion"
        style="
          font-weight:400;
          line-height:1.65;
        ">

        ${getTitleHtml(
          "Conclusion",
          true
        )}

        <div
          class="entrepriseModuleSubtitle"
          style="
            color:#21624d;
            font-weight:700;
            margin:0 0 28px 0;
            line-height:1.4;
            text-align:center;
          ">

          Une richesse pour l'entreprise,
          la commune,
          la Mairie
          et tout son territoire

        </div>

        Chaque recrutement local
        profite bien au-delà
        de l'entreprise.

        <br><br>

        L'entreprise trouve
        plus facilement
        les compétences
        dont elle a besoin.

        <br><br>

        Le salarié peut travailler
        plus près de chez lui
        et améliorer
        son organisation quotidienne.

        <br><br>

        Les habitants découvrent
        les entreprises,
        les métiers
        et les opportunités
        présents sur leur territoire.

        <br><br>

        Les établissements scolaires
        peuvent mieux relier
        les jeunes
        au monde professionnel local.

        <br><br>

        La commune conserve
        davantage de savoir-faire,
        d'activité
        et de richesse économique.

        <br><br>

        Mais cette dynamique
        ne peut pas reposer
        uniquement sur les entreprises
        et les habitants.

        <br><br>

        La Mairie possède
        un rôle essentiel.

        <br><br>

        Elle peut rendre visibles
        les forces économiques
        de son territoire,

        favoriser les connexions,
        soutenir la circulation
        de l'information

        et montrer que les entreprises
        de la commune
        ne sont pas oubliées
        dans un annuaire,
        un dossier
        ou un dispositif isolé.

        <br><br>

        Une collectivité
        qui connaît,
        valorise
        et relie ses entreprises

        crée les conditions
        d'un territoire
        plus attractif,
        plus vivant
        et plus résilient.

        <br><br>

        Tout le monde affirme
        qu'il faut rapprocher
        l'emploi,
        les habitants,
        les entreprises,
        les écoles
        et les institutions.

        <br><br>

        ${bociteart}
        apporte désormais
        l'architecture
        et les outils
        permettant de le faire réellement.

        <br><br>

        Il ne s'agit plus seulement
        de constater le ravin.

        <br><br>

        Il devient possible
        de construire le pont.

        <br><br>

        Si ${bociteart}
        commence déjà
        à vous convaincre,

        découvrez les autres rubriques
        mises à votre disposition.

        <br><br>

        Elles reposent toutes
        sur la même logique :

        relier les acteurs,
        les outils
        et les bonnes pratiques

        afin de transformer
        des initiatives encore isolées

        en un véritable moteur
        de développement
        pour l'entreprise
        et son territoire.

      </div>

    `;
  }

  function bindEmployment(){

    const offersButton =
      getElement(
        "emploiOffersBtn"
      );

    const cvButton =
      getElement(
        "emploiCvBtn"
      );

    const publishButton =
      getElement(
        "emploiPublishBtn"
      );

    const applicationsButton =
      getElement(
        "emploiApplicationsBtn"
      );

    if(offersButton){

      offersButton.onclick = function(){

        if(
          typeof module.openEmploymentOffers ===
          "function"
        ){
          module.openEmploymentOffers();
          return;
        }

        module.openScreen(
          "emploi"
        );
      };
    }

    if(cvButton){

      cvButton.onclick = function(){

        if(
          typeof module.openSpontaneousCv ===
          "function"
        ){
          module.openSpontaneousCv();
          return;
        }

        alert(
          "Le dépôt de CV sera disponible dans la prochaine étape."
        );
      };
    }

    if(publishButton){

      publishButton.onclick = function(){

        const openForm =
          function(){

            if(
              typeof module.openEmploymentForm ===
              "function"
            ){
              module.openEmploymentForm();
              return;
            }

            alert(
              "Le formulaire de publication est momentanément indisponible."
            );
          };

        if(
          typeof module.requirePartnerAccess ===
          "function"
        ){
          module.requirePartnerAccess(
            openForm
          );
          return;
        }

        openForm();
      };
    }

    if(applicationsButton){

      applicationsButton.onclick = function(){

        if(
          typeof module.openEmploymentApplications ===
          "function"
        ){
          module.openEmploymentApplications();
          return;
        }

        alert(
          "Les candidatures seront disponibles après chargement du module correspondant."
        );
      };
    }

  }

  function openEmploymentModule(){

    module.renderModulePage(

      "Recruter autrement",

      getEmploymentHtml(),

      {
        afterRender:
          bindEmployment
      }

    );
  }

  module.registerScreen(
    "emploi",
    openEmploymentModule
  );

  module.openEmploymentModule =
    openEmploymentModule;

  console.log(
    "✅ Module Emploi nouvelle génération chargé"
  );

})();
