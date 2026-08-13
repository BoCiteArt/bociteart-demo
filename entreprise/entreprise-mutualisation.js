/* =========================================================
   BO'CITÉART — ENTREPRISE
   PAYEZ MOINS DE CHARGES
   ========================================================= */

(function initEntrepriseMutualisation(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-mutualisation.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  function getBrandHtml(){

    return `
      <strong
        style="
          display:inline;
          white-space:nowrap;
          font-weight:800;
        ">
        <span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span>
      </strong>
    `;
  }

  function getMutualisationHtml(){

    return `

      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.55;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            line-height:1.35;
            margin-bottom:10px;
          ">
          Payez moins de charges
        </div>

        Regroupez certains besoins
        avec d'autres professionnels
        pour rechercher de meilleures conditions,
        tout en restant totalement indépendant.

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.55;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:10px;
          ">
          Quels besoins ?
        </div>

        • Électricité et gaz<br>
        • Téléphonie et Internet<br>
        • Assurances et mutuelles<br>
        • Fournitures et papeterie<br>
        • Matériel professionnel<br>
        • Véhicules<br>
        • Entretien<br>
        • Prestations<br>
        • Formations<br>
        • Achats ou locations

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.55;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:10px;
          ">
          Comment cela fonctionne ?
        </div>

        1. Vous indiquez votre besoin.

        <br><br>

        2. ${getBrandHtml()}
        rapproche les demandes similaires.

        <br><br>

        3. Vous suivez le nombre
        de professionnels intéressés.

        <br><br>

        4. Lorsque les conditions sont réunies,
        les fournisseurs susceptibles de répondre
        peuvent être consultés.

        <br><br>

        5. Vous recevez les propositions
        dans votre espace privé.

        <br><br>

        6. Vous comparez et vous décidez.

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.55;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:10px;
          ">
          Vous gardez la décision
        </div>

        Déposer un besoin
        ne vous oblige pas à accepter
        une proposition.

        <br><br>

        Vous pouvez comparer,
        choisir
        ou refuser.

        <br><br>

        Votre entreprise reste indépendante.

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.55;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:10px;
          ">
          Dans votre espace privé
        </div>

        • Déposer un besoin<br>
        • Voir les demandes en cours<br>
        • Rejoindre une demande existante<br>
        • Consulter les propositions reçues<br>
        • Suivre vos décisions<br>
        • Retrouver votre historique

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.55;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:10px;
          ">
          Votre besoin n'est pas encore proposé ?
        </div>

        Ajoutez-le.

        <br><br>

        ${getBrandHtml()}
        pourra identifier
        les autres professionnels
        ayant le même besoin.

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.55;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:800;
            margin-bottom:10px;
          ">
          Un service compris dans votre abonnement
        </div>

        Les économies obtenues
        sur vos charges professionnelles
        peuvent contribuer à couvrir
        tout ou partie du coût
        de votre abonnement.

      </div>


      <button
        id="mutualisationPrivateAccessBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:4px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Accéder à mes demandes
      </button>


      <button
        id="mutualisationMecenatBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Découvrir le mécénat
      </button>

    `;
  }


  function bindMutualisation(){

    const privateButton =
      getElement(
        "mutualisationPrivateAccessBtn"
      );

    const mecenatButton =
      getElement(
        "mutualisationMecenatBtn"
      );


    if(privateButton){

      privateButton.onclick =
        function(){

          /*
            On utilise le système privé central existant.
            Aucun second compte professionnel n'est créé ici.
          */

          if(
            typeof module.openPrivateAccess ===
            "function"
          ){

            module.openPrivateAccess();
            return;
          }

          if(
            typeof module.openPrivateLogin ===
            "function"
          ){

            module.openPrivateLogin();
            return;
          }

          if(
            typeof module.openScreen ===
            "function"
          ){

            module.openScreen(
              "acces_partenaire"
            );
          }

        };
    }


    if(mecenatButton){

      mecenatButton.onclick =
        function(){

          module.openScreen(
            "mecenat"
          );

        };
    }

  }


  function openMutualisationModule(){

    module.renderModulePage(

      "Payez moins de charges",

      getMutualisationHtml(),

        {
  showBack:true,
  showFooter:false,
  afterRender:
    bindMutualisation
}

    );

  }


  /*
    IMPORTANT :
    les noms techniques restent inchangés
    pour ne casser aucun raccordement existant.
  */

  module.registerScreen(
    "mutualisation",
    openMutualisationModule
  );

  module.registerScreen(
    "economies",
    openMutualisationModule
  );

  module.openMutualisationModule =
    openMutualisationModule;


  console.log(
    "✅ Nouveau module Payez moins de charges chargé"
  );

})();
