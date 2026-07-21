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
          line-height:1.5;
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

          L’annuaire devient
          votre véritable outil
          de développement économique.

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.5;
            font-weight:400;
          ">

          Ce n’est pas
          une simple liste d’entreprises.

          <br><br>

          C’est votre véritable outil
          de développement économique.

          <br><br>

          Et il ne vous coûte rien.

          <br><br>

          Prenez quelques minutes
          pour le découvrir
          et mesurez par vous-même
          tout ce qu’il peut vous apporter.

          <br><br>

          Bo'CitéArt permet
          aux habitants,
          aux entreprises,
          aux commerçants
          et aux collectivités
          de découvrir rapidement
          les richesses économiques,
          les métiers
          et les savoir-faire
          présents dans leur commune
          et leur territoire.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.5;
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

          Qui vous dit
          qu’il faut aller loin
          pour trouver ce qui existe peut-être déjà
          à quelques pas de chez vous ?

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.5;
            font-weight:400;
          ">

          Chaque jour,
          des entreprises cherchent :

          <br><br>

          • de nouveaux clients ;<br>
          • des fournisseurs ;<br>
          • des partenaires ;<br>
          • des salariés ;<br>
          • des sous-traitants ;<br>
          • des compétences particulières.

          <br><br>

          Trop souvent,
          la réponse se trouve
          à deux pas de votre entreprise.

          <br><br>

          Encore faut-il savoir
          qu’elle existe.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.5;
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
            line-height:1.5;
            font-weight:400;
          ">

          Découvrez et trouvez rapidement :

          <br><br>

          • les métiers ;<br>
          • les savoir-faire ;<br>
          • les produits ;<br>
          • les services ;<br>
          • les partenaires ;<br>
          • les fournisseurs ;<br>
          • les sous-traitants ;<br>
          • les recherches professionnelles ;<br>
          • les besoins des entreprises.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.5;
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

          Faire connaître son entreprise
          devient aujourd’hui
          un véritable atout concurrentiel.

        </div>

        <div
          style="
            margin-top:14px;
            color:#111;
            font-size:15px;
            line-height:1.5;
            font-weight:400;
          ">

          Lorsqu’une entreprise
          est facilement identifiée
          par les habitants
          et les professionnels,

          elle augmente naturellement
          ses opportunités.

          <br><br>

          Plus de visibilité.<br>
          Plus de contacts.<br>
          Plus de recommandations.<br>
          Plus de collaborations.<br>
          Plus de possibilités de recrutement.

          <br><br>

          Aujourd’hui,
          être excellent ne suffit plus.

          <br><br>

          Encore faut-il être vu,
          connu
          et surtout reconnu.

        </div>

      </div>

      <div
        class="box"
        style="
          font-size:15px;
          line-height:1.5;
          font-weight:400;
        ">

        <div
          class="
