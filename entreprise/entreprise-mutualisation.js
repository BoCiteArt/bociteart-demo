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

function escapeValue(value){

  if(
    typeof module.safeEscape ===
    "function"
  ){
    return module.safeEscape(
      value
    );
  }

  return String(
    value == null
      ? ""
      : value
  )
  .replace(/&/g,"&amp;")
  .replace(/</g,"&lt;")
  .replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;")
  .replace(/'/g,"&#039;");
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

  const data =
    typeof module.loadMutualisationData ===
    "function"
      ? module.loadMutualisationData()
      : {
          categories:{},
          customNeeds:[]
        };


  const categories =
    data &&
    data.categories &&
    typeof data.categories === "object"
      ? data.categories
      : {};


  const customNeeds =
    data &&
    Array.isArray(
      data.customNeeds
    )
      ? data.customNeeds
      : [];


  function needLine(
    id,
    label,
    count
  ){

    return `

      <div
        style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:11px 0;
          border-bottom:1px solid #e3e3e3;
        ">

        <div
          style="
            flex:1;
            min-width:0;
            color:#111111;
            font-size:14px;
            font-weight:400;
          ">

          ${escapeValue(label)}

          <div
            style="
              margin-top:3px;
              color:#555555;
              font-size:14px;
              font-weight:400;
            ">

            ${Number(count || 0)}
            professionnel(s) intéressé(s)

          </div>

        </div>


        <button
          class="choiceBtn mutualisationJoinBtn"
          type="button"
          data-need-id="${escapeValue(id)}"
          style="
            width:auto;
            min-width:125px;
            margin:0;
            background:#ffffff !important;
            color:#111111 !important;
          ">
          Je suis intéressé
        </button>

      </div>

    `;
  }


  const defaultOrder = [
    "electricite",
    "gaz",
    "telephonie",
    "assurances",
    "mutuelle",
    "fournitures",
    "carburant",
    "formation"
  ];


  const standardHtml =
    defaultOrder
      .map(function(key){

        const item =
          categories[key];

        if(!item){
          return "";
        }

        return needLine(
          item.id || key,
          item.label || key,
          item.count || 0
        );

      })
      .join("");


  const customHtml =
    customNeeds.length
      ? customNeeds
          .map(function(item){

            return needLine(
              item.id || "",
              item.title || "Nouvelle demande",
              item.count || 0
            );

          })
          .join("")
      : "";


  return `

    <div
      class="box"
      style="
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.5;
        border-left:6px solid #2f5d46;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
          margin-bottom:8px;
        ">
        Payer moins de charges
      </div>

      Indiquez simplement
      les économies qui peuvent
      vous intéresser.

      <br><br>

      Plus plusieurs professionnels
      expriment le même besoin,
      plus une consultation commune
      peut devenir intéressante.

    </div>


    <div
      class="box"
      style="
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
          margin-bottom:8px;
        ">
        Économies proposées
      </div>

      ${standardHtml}

      ${customHtml}

    </div>


    <div
      class="box"
      style="
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.5;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
          margin-bottom:8px;
        ">
        Vous avez une autre idée ?
      </div>

      Ajoutez votre besoin.
      Il apparaîtra ensuite
      dans la liste afin que
      d'autres professionnels
      puissent signaler leur intérêt.

      <input
        id="mutualisationNewNeedTitle"
        class="miniField"
        type="text"
        placeholder="Exemple : achat groupé de matériel"
        style="
          margin-top:10px;
          background:#ffffff;
          color:#111111;
        "
      >

      <textarea
        id="mutualisationNewNeedDescription"
        class="miniField"
        placeholder="Précisez votre besoin si nécessaire"
        style="
          margin-top:8px;
          min-height:80px;
          background:#ffffff;
          color:#111111;
        ">
      </textarea>

      <button
        id="mutualisationAddNeedBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:10px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Ajouter cette demande
      </button>

    </div>


    <div
      class="box"
      style="
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.5;
        border-left:6px solid #2f5d46;
      ">

      <div
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
          margin-bottom:8px;
        ">
        Suivi
      </div>

      Les demandes restent visibles
      avec leur compteur.

      <br><br>

      Lorsque plusieurs professionnels
      manifestent leur intérêt,
      la demande pourra être étudiée
      et suivie par Bo'CitéArt.

      <br><br>

      Les consultations fournisseurs,
      les réponses reçues
      et l'état d'avancement
      seront ensuite regroupés
      dans votre espace privé.

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
      Suivre mes demandes
    </button>

  `;
}


function bindMutualisation(){

  const privateButton =
    getElement(
      "mutualisationPrivateAccessBtn"
    );


  const addNeedButton =
    getElement(
      "mutualisationAddNeedBtn"
    );


  document
    .querySelectorAll(
      ".mutualisationJoinBtn"
    )
    .forEach(function(button){

      button.onclick = function(){

        const needId =
          String(
            button.getAttribute(
              "data-need-id"
            ) || ""
          );


        if(
          !needId ||
          typeof module.joinMutualisationNeed !==
          "function"
        ){

          alert(
            "Cette demande est momentanément indisponible."
          );

          return;
        }


        const result =
          module.joinMutualisationNeed(
            needId
          );


        if(
          !result ||
          result.ok !== true
        ){

          alert(
            result &&
            result.error
              ? result.error
              : "Votre intérêt n'a pas pu être enregistré."
          );

          return;
        }


        alert(
          "Votre intérêt est enregistré."
        );


        openMutualisationModule();

      };

    });


  if(addNeedButton){

    addNeedButton.onclick =
      function(){

        const titleInput =
          getElement(
            "mutualisationNewNeedTitle"
          );


        const descriptionInput =
          getElement(
            "mutualisationNewNeedDescription"
          );


        const title =
          String(
            titleInput
              ? titleInput.value
              : ""
          )
          .trim();


        const description =
          String(
            descriptionInput
              ? descriptionInput.value
              : ""
          )
          .trim();


        if(!title){

          alert(
            "Indiquez le besoin que vous souhaitez proposer."
          );

          return;
        }


        if(
          typeof module.addMutualisationNeed !==
          "function"
        ){

          alert(
            "Le système de demandes est momentanément indisponible."
          );

          return;
        }


        const result =
          module.addMutualisationNeed({

            title:
              title,

            description:
              description,

            category:
              "autre"

          });


        if(
          !result ||
          result.ok !== true
        ){

          alert(
            result &&
            result.error
              ? result.error
              : "La demande n'a pas pu être ajoutée."
          );

          return;
        }


        alert(
          "Votre demande est ajoutée.\n\n" +
          "Les autres professionnels pourront maintenant signaler leur intérêt."
        );


        openMutualisationModule();

      };
  }


  if(privateButton){

    privateButton.onclick =
      function(){

        if(
          typeof module.openMutualisationResponses ===
          "function"
        ){

          module.openMutualisationResponses();
          return;
        }


        if(
          typeof module.openPrivateAccess ===
          "function"
        ){

          module.openPrivateAccess();
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
