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

          Le recrutement a changé

        </strong>

        <br>

        Pendant longtemps,
        publier une annonce suffisait
        pour recevoir plusieurs candidatures.

        <br><br>

        Aujourd'hui,
        les entreprises rencontrent
        de nouvelles difficultés.

        <br><br>

        Les attentes évoluent.

        Les déplacements coûtent plus cher.

        Les temps de trajet pèsent
        sur la qualité de vie.

        <br><br>

        Recruter ne consiste plus seulement
        à diffuser une annonce.

        Il devient nécessaire
        de donner envie
        de rejoindre votre entreprise.

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
        à plusieurs dizaines
        de kilomètres,

        demandez-vous si la personne
        que vous recherchez
        ne vit pas déjà
        près de votre entreprise.

        <br><br>

        Un recrutement de proximité
        peut réduire :

        <br><br>

        • le temps de trajet ;<br>
        • le coût des déplacements ;<br>
        • la fatigue quotidienne ;<br>
        • les difficultés d'organisation.

        <br><br>

        C'est souvent un avantage
        pour l'entreprise
        comme pour le salarié.

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
        vos équipes
        et votre savoir-faire,

        plus ils penseront naturellement
        à vous lorsqu'une opportunité
        se présentera.

      </div>
