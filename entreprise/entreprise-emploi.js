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

  function getEmploymentHtml(){

    return `

      <div
        class="box entrepriseModuleIntro">

        <strong
          class="entrepriseModuleTitle">

          Recruter autrement

        </strong>

        <br><br>

        Toutes les entreprises,
        quels que soient leur taille,
        leur activité
        ou leur territoire,

        rencontrent aujourd'hui
        des difficultés pour recruter.

        <br><br>

        Mais les salariés
        rencontrent eux aussi
        leurs propres difficultés.

        <br><br>

        Les entreprises sont confrontées
        au poids des charges,
        aux besoins de compétences
        et au manque de candidatures.

        <br><br>

        Les salariés doivent,
        de leur côté,
        supporter le coût des déplacements,
        les temps de trajet,
        la fatigue quotidienne
        et une organisation familiale
        parfois de plus en plus complexe.

        <br><br>

        Entre les besoins des entreprises
        et les attentes des salariés,

        chacun peut finir
        par se retrouver enfermé
        dans ses propres contraintes.

        <br><br>

        Recruter ne consiste donc plus seulement
        à publier une annonce.

        <br><br>

        Il faut aussi permettre
        à l'entreprise et au futur salarié
        de se découvrir,
        de se comprendre
        et de se rencontrer plus facilement.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Et si votre futur salarié
          habitait déjà
          dans votre commune ?

        </strong>

        <br><br>

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

        Pourtant,
        il ne connaît pas forcément
        votre activité,
        vos métiers,
        vos besoins
        ni les opportunités
        que vous pouvez proposer.

        <br><br>

        Et de votre côté,
        vous ne savez peut-être pas
        que ses compétences
        existent déjà
        dans votre environnement proche.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Les outils de recrutement
          restent indispensables

        </strong>

        <br><br>

        France Travail,
        les agences d'intérim,
        les sites spécialisés,
        les annonces,
        les réseaux professionnels
        et le bouche-à-oreille

        restent des moyens utiles
        pour rechercher un salarié.

        <br><br>

        Mais ils ne permettent pas toujours
        de toucher directement
        les habitants
        de votre propre commune.

        <br><br>

        Pourtant,
        votre futur collaborateur
        habite sans doute
        à quelques rues
        de votre entreprise.

        <br><br>

        Avant de rechercher plus loin,
        commencez par rendre
        votre entreprise
        pleinement visible
        sur son propre territoire.

        <br><br>

        C'est là
        que se trouvent
        vos premières opportunités.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Avant de publier une annonce…

        </strong>

        <br><br>

        Commencez par faire connaître
        votre entreprise.

        <br><br>

        On ne postule pas
        dans une entreprise
        dont on ignore l'existence.

        <br><br>

        Plus les habitants
        connaissent vos métiers,
        vos équipes,
        vos réalisations
        et votre savoir-faire,

        plus ils penseront naturellement
        à vous
        lorsqu'une opportunité
        se présentera.

        <br><br>

        La visibilité locale
        devient ainsi
        le premier levier
        du recrutement de proximité.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Les habitants connaissent-ils
          réellement votre entreprise ?

        </strong>

        <br><br>

        Combien de personnes
        connaissent aujourd'hui :

        <br><br>

        • vos métiers ;<br>
        • vos compétences ;<br>
        • vos réalisations ;<br>
        • vos équipes ;<br>
        • vos valeurs ;<br>
        • vos besoins de recrutement ?

        <br><br>

        Une entreprise peut être connue
        de ses clients,
        de ses fournisseurs
        ou de son secteur professionnel,

        sans être réellement connue
        des habitants
        qui vivent autour d'elle.

        <br><br>

        Pourtant,
        ce sont aussi ces habitants
        qui peuvent devenir :

        <br><br>

        • de futurs salariés ;<br>
        • des candidats spontanés ;<br>
        • des stagiaires ;<br>
        • des alternants ;<br>
        • des relais d'information ;<br>
        • des ambassadeurs de proximité.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Faire connaître l'entreprise
          avant même de recruter

        </strong>

        <br><br>

        Lorsqu'une entreprise
        devient mieux connue
        dans sa commune,

        les recommandations,
        les candidatures spontanées
        et le bouche-à-oreille

        prennent naturellement
        davantage d'importance.

        <br><br>

        Plus les habitants
        connaissent votre entreprise,

        plus ils deviennent naturellement
        vos premiers relais d'information.

        <br><br>

        Ils peuvent parler
        de vos métiers,
        de vos besoins,
        de vos équipes
        et de vos opportunités

        à leur famille,
        à leurs voisins,
        à leurs proches
        ou à leurs connaissances.

        <br><br>

        Ce sont souvent
        vos meilleurs ambassadeurs.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Créer les rencontres
          qui n'auraient peut-être jamais eu lieu

        </strong>

        <br><br>

        En reliant progressivement
        les entreprises,
        les habitants,
        les établissements scolaires,
        les associations
        et les collectivités,

        <span class="bociteartName">
          Bo'CitéArt
        </span>

        favorise des rencontres
        qui, sans cela,
        n'auraient probablement
        jamais eu lieu.

        <br><br>

        Un jeune peut découvrir
        un métier présent dans sa ville.

        <br><br>

        Un habitant peut identifier
        une entreprise
        qu'il ne connaissait pas.

        <br><br>

        Un salarié peut se rapprocher
        de son domicile.

        <br><br>

        Une entreprise peut trouver
        une compétence
        qu'elle recherchait loin,

        alors qu'elle existait déjà
        sur son territoire.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Un emploi plus proche,
          une meilleure qualité de vie

        </strong>

        <br><br>

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

        C'est un avantage
        pour le salarié,

        mais également
        pour l'entreprise.

        <br><br>

        Un salarié qui travaille
        plus près de chez lui

        peut être plus disponible,
        plus stable
        et moins exposé
        aux difficultés liées
        aux longs trajets quotidiens.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Mieux recruter,
          mais aussi mieux fidéliser

        </strong>

        <br><br>

        Trouver un salarié
        est une première étape.

        <br><br>

        Le conserver durablement
        est tout aussi important.

        <br><br>

        Cette qualité de vie retrouvée
        peut renforcer l'adhésion
        et la fidélisation des salariés.

        <br><br>

        Une entreprise
        mieux intégrée
        dans son territoire,

        plus visible
        et plus proche
        de ses équipes

        peut aussi devenir
        plus attractive.

        <br><br>

        Recruter localement
        ne signifie donc pas seulement
        pourvoir un poste.

        <br><br>

        Cela peut aussi contribuer
        à créer une relation
        plus durable
        entre l'entreprise,
        le salarié
        et le territoire.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Commencer localement,
          puis élargir progressivement

        </strong>

        <br><br>

        L'objectif n'est pas
        de limiter la recherche
        à une seule commune.

        <br><br>

        Il s'agit d'abord
        de commencer
        par ce qui existe
        au plus près.

        <br><br>

        Puis,
        si nécessaire,
        la recherche peut être élargie :

        <br><br>

        • aux communes voisines ;<br>
        • au département ;<br>
        • à la région ;<br>
        • puis à un territoire plus large.

        <br><br>

        Cette progression permet
        de ne pas rechercher loin

        ce qui pourrait déjà exister
        à proximité.

      </div>

      <div class="box">

        <strong
          class="entrepriseModuleSubtitle">

          Les outils
          <span class="bociteartName">
            Bo'CitéArt
          </span>
          pour recruter autrement

        </strong>

        <br><br>

        <span class="bociteartName">
          Bo'CitéArt
        </span>

        met progressivement
        à votre disposition
        plusieurs outils complémentaires :

        <br><br>

        • publier une offre d'emploi ;<br>
        • rechercher un salarié ;<br>
        • recevoir des candidatures spontanées ;<br>
        • proposer un stage ;<br>
        • accueillir un alternant ;<br>
        • renforcer votre visibilité locale.

        <br><br>

        L'objectif n'est pas seulement
        de publier une offre.

        <br><br>

        Il s'agit de rapprocher durablement
        les entreprises,
        les habitants,
        les jeunes,
        les établissements scolaires
        et les talents
        du territoire.

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
        class="box entrepriseModuleConclusion">

        <strong
          class="entrepriseModuleSubtitle">

          Une richesse
          pour toute la commune,
          la Mairie
          et son territoire

        </strong>

        <br><br>

        Chaque recrutement local
        profite bien au-delà
        de l'entreprise.

        <br><br>

        Il peut réduire les déplacements,
        soutenir le pouvoir d'achat,
        améliorer la qualité de vie,
        renforcer l'activité économique
        et maintenir davantage
        de compétences sur le territoire.

        <br><br>

        L'entreprise trouve
        plus facilement
        les personnes dont elle a besoin.

        <br><br>

        Le salarié peut travailler
        plus près de chez lui.

        <br><br>

        La commune conserve
        davantage de dynamisme,
        de savoir-faire
        et de richesse locale.

        <br><br>

        Le recrutement devient alors
        un véritable cercle vertueux

        pour l'entreprise,
        la commune
        et tout son territoire.

        <br><br>

        Si
        <span class="bociteartName">
          Bo'CitéArt
        </span>
        commence déjà
        à vous convaincre,

        découvrez les autres rubriques
        mises à votre disposition.

        <br><br>

        Elles reposent toutes
        sur la même logique :

        relier les bonnes pratiques,
        le bon sens
        et les forces déjà présentes

        pour en faire
        un véritable moteur
        de développement.

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
