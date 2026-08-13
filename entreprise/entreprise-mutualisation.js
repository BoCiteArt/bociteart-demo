/* =========================================================
   BO'CITÉART — ENTREPRISE
   PAYER MOINS DE CHARGES
   BLOC 1 — BASE DU MODULE
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


  /* =======================================================
     CONSTANTES
     ======================================================= */

  const STORE_KEY =
    "bociteart_mutualisation_ui_v2";

  const STATUS_LABELS = {

    interested:
      "Intéressé",

    free:
      "Disponible",

    engaged:
      "Contrat en cours",

    litigation:
      "Situation à vérifier",

    postponed:
      "Reporté",

    consultation:
      "Consultation en cours",

    offers:
      "Offres disponibles",

    vote:
      "Vote en cours",

    confirmed:
      "Engagement confirmé",

    signed:
      "Contrat signé"

  };


  /* =======================================================
     OUTILS
     ======================================================= */

  function getElement(id){

    return document.getElementById(id);
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


  function createId(prefix){

    return (
      String(prefix || "ID") +
      "-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,8)
    );
  }


  function formatDate(value){

    if(!value){
      return "";
    }

    try{

      const date =
        new Date(value);

      if(
        Number.isNaN(
          date.getTime()
        )
      ){
        return "";
      }

      return date
        .toLocaleDateString(
          "fr-FR"
        );

    }catch(error){

      return "";
    }
  }


  function formatDateTime(value){

    if(!value){
      return "";
    }

    try{

      const date =
        new Date(value);

      if(
        Number.isNaN(
          date.getTime()
        )
      ){
        return "";
      }

      return date
        .toLocaleString(
          "fr-FR"
        );

    }catch(error){

      return "";
    }
  }


  function getBrandHtml(){

    return (
      '<strong class="bociteMutualisationBrand">' +
        '<span class="bociteMutualisationBrandGreen">Bo&#39;Cité</span>' +
        '<span class="bociteMutualisationBrandRed">Art</span>' +
      '</strong>'
    );
  }


  /* =======================================================
     STYLES
     ======================================================= */

  function injectStyles(){

    if(
      document.getElementById(
        "bociteMutualisationStylesV2"
      )
    ){
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "bociteMutualisationStylesV2";


    style.textContent = `

      .bociteMutualisationPage,
      .bociteMutualisationPage *{
        box-sizing:border-box;
      }

      .bociteMutualisationPage{
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.5;
      }

      .bociteMutualisationBox{
        background:#ffffff !important;
        color:#111111 !important;
        border:1px solid #dedede;
        border-radius:12px;
        padding:14px;
        margin:0 0 10px 0;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.5 !important;
      }

      .bociteMutualisationBoxAccent{
        border-left:6px solid #2f5d46;
      }

      .bociteMutualisationTitle{
        color:#2f5d46 !important;
        font-size:17px !important;
        font-weight:700 !important;
        line-height:1.3 !important;
        margin:0 0 8px 0 !important;
      }

      .bociteMutualisationText{
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.5 !important;
      }

      .bociteMutualisationBrand{
        white-space:nowrap;
        font-weight:700 !important;
      }

      .bociteMutualisationBrandGreen{
        color:#2f5d46 !important;
        font-weight:700 !important;
      }

      .bociteMutualisationBrandRed{
        color:#b00020 !important;
        font-weight:700 !important;
      }

      .bociteMutualisationButton{
        width:100%;
        background:#ffffff !important;
        background-color:#ffffff !important;
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        margin-top:8px;
      }

      .bociteMutualisationMiniButton{
        width:auto;
        min-width:120px;
        background:#ffffff !important;
        background-color:#ffffff !important;
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        margin:0;
      }

      .bociteMutualisationInput,
      .bociteMutualisationSelect,
      .bociteMutualisationTextarea{
        width:100%;
        background:#ffffff !important;
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        margin-top:7px;
      }

      .bociteMutualisationTextarea{
        min-height:85px;
      }

      .bociteMutualisationNeedLine{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        padding:11px 0;
        border-bottom:1px solid #e4e4e4;
      }

      .bociteMutualisationNeedInfo{
        flex:1;
        min-width:0;
        color:#111111;
        font-size:14px;
        font-weight:400;
      }

      .bociteMutualisationCounter{
        display:block;
        margin-top:3px;
        color:#555555;
        font-size:14px;
        font-weight:400;
      }

      .bociteMutualisationStatus{
        display:inline-block;
        margin-top:6px;
        padding:4px 8px;
        border:1px solid #d8d8d8;
        border-radius:999px;
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
      }

      .bociteMutualisationGrid{
        display:grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap:8px;
      }

      .bociteMutualisationCard{
        background:#ffffff;
        border:1px solid #dedede;
        border-radius:10px;
        padding:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      }

      .bociteMutualisationCard strong{
        display:block;
        color:#2f5d46;
        font-size:17px;
        font-weight:700;
        margin-bottom:4px;
      }

      .bociteMutualisationBackOnly{
        background:#fffaf1 !important;
        background-color:#fffaf1 !important;
      }

      @media(max-width:520px){

        .bociteMutualisationGrid{
          grid-template-columns:1fr 1fr;
        }

        .bociteMutualisationNeedLine{
          align-items:flex-start;
        }

        .bociteMutualisationMiniButton{
          min-width:110px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  injectStyles();


  /* =======================================================
     STOCKAGE LOCAL COMPLÉMENTAIRE
     ======================================================= */

  function getDefaultUiData(){

    return {

      operations:{},

      participantSituations:{},

      reminders:[],

      documentVault:{},

      audit:[]

    };
  }


  function normalizeUiData(data){

    const source =
      data &&
      typeof data === "object"
        ? data
        : {};


    return {

      operations:
        source.operations &&
        typeof source.operations === "object"
          ? source.operations
          : {},

      participantSituations:
        source.participantSituations &&
        typeof source.participantSituations === "object"
          ? source.participantSituations
          : {},

      reminders:
        Array.isArray(
          source.reminders
        )
          ? source.reminders
          : [],

      documentVault:
        source.documentVault &&
        typeof source.documentVault === "object"
          ? source.documentVault
          : {},

      audit:
        Array.isArray(
          source.audit
        )
          ? source.audit
          : []

    };
  }


  function loadUiData(){

    try{

      const raw =
        localStorage.getItem(
          STORE_KEY
        );

      if(!raw){
        return getDefaultUiData();
      }

      return normalizeUiData(
        JSON.parse(raw)
      );

    }catch(error){

      return getDefaultUiData();
    }
  }


  function saveUiData(data){

    try{

      localStorage.setItem(
        STORE_KEY,
        JSON.stringify(
          normalizeUiData(data)
        )
      );

      return true;

    }catch(error){

      console.warn(
        "Bo'CitéArt : enregistrement du suivi Payer moins de charges impossible.",
        error
      );

      return false;
    }
  }


  function addAudit(
    type,
    details
  ){

    const data =
      loadUiData();


    data.audit.push({

      id:
        createId(
          "TRACE"
        ),

      type:
        String(
          type || ""
        ),

      details:
        details || {},

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )

    });


    saveUiData(
      data
    );
  }


  /* =======================================================
     IDENTIFIANT DU PROFESSIONNEL
     ======================================================= */

  function getCurrentProfessionalId(){

    try{

      if(
        typeof module.getCurrentProfessionalId ===
        "function"
      ){

        const id =
          module.getCurrentProfessionalId();

        if(id){
          return String(id);
        }
      }

    }catch(error){
      /* secours ci-dessous */
    }


    try{

      const registration =
        window.BoCiteArtRegistration;

      if(
        registration &&
        typeof registration.getCurrentAccount ===
        "function"
      ){

        const account =
          registration.getCurrentAccount();

        if(account){

          return String(
            account.structureId ||
            account.companyId ||
            account.siret ||
            account.id ||
            "bociteart-demo-professional"
          );
        }
      }

    }catch(error){
      /* secours ci-dessous */
    }


    return "bociteart-demo-professional";
  }


  /* =======================================================
     COMMUNE DE RÉFÉRENCE
     ======================================================= */

  function getCurrentCommune(){

    try{

      const registration =
        window.BoCiteArtRegistration;

      if(
        registration &&
        typeof registration.getCurrentAccount ===
        "function"
      ){

        const account =
          registration.getCurrentAccount();

        if(
          account &&
          (
            account.commune ||
            account.city
          )
        ){

          return String(
            account.commune ||
            account.city
          ).trim();
        }
      }

    }catch(error){
      /* secours ci-dessous */
    }


    try{

      const saved =
        localStorage.getItem(
          "bociteart_entreprise_search_city_v2"
        );

      if(saved){
        return String(saved).trim();
      }

    }catch(error){
      /* secours ci-dessous */
    }


    return "Votre commune";
  }


  /* =======================================================
     SITUATION CONTRACTUELLE D'UN PROFESSIONNEL
     ======================================================= */

  function getSituationKey(
    professionalId,
    needId
  ){

    return (
      String(
        professionalId || ""
      ) +
      "::" +
      String(
        needId || ""
      )
    );
  }


  function getParticipantSituation(
    professionalId,
    needId
  ){

    const data =
      loadUiData();


    const key =
      getSituationKey(
        professionalId,
        needId
      );


    return (
      data.participantSituations[key] ||
      {
        professionalId:
          professionalId,

        needId:
          needId,

        status:
          "",

        supplier:
          "",

        contractEndDate:
          "",

        noticeMonths:
          "",

        nextReviewDate:
          "",

        litigation:
          false,

        note:
          "",

        updatedAt:
          null,

        updatedAtFr:
          ""
      }
    );
  }


  function saveParticipantSituation(
    professionalId,
    needId,
    situation
  ){

    const data =
      loadUiData();


    const key =
      getSituationKey(
        professionalId,
        needId
      );


    data.participantSituations[key] =
      Object.assign(
        {},
        getParticipantSituation(
          professionalId,
          needId
        ),
        situation || {},
        {
          professionalId:
            professionalId,

          needId:
            needId,

          updatedAt:
            Date.now(),

          updatedAtFr:
            new Date()
              .toLocaleString(
                "fr-FR"
              )
        }
      );


    saveUiData(
      data
    );


    addAudit(
      "situation_contractuelle_mise_a_jour",
      {
        professionalId:
          professionalId,

        needId:
          needId,

        status:
          data.participantSituations[key]
            .status || ""
      }
    );


    return data.participantSituations[key];
  }


  /* =======================================================
     RAPPELS À PRÉPARER
     ======================================================= */

  function scheduleReminder(options){

    const input =
      options || {};


    const data =
      loadUiData();


    const reminder = {

      id:
        createId(
          "RAPPEL"
        ),

      professionalId:
        String(
          input.professionalId || ""
        ),

      needId:
        String(
          input.needId || ""
        ),

      subject:
        String(
          input.subject || ""
        ),

      dueDate:
        String(
          input.dueDate || ""
        ),

      reason:
        String(
          input.reason || ""
        ),

      status:
        "programme",

      createdAt:
        Date.now(),

      createdAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )

    };


    data.reminders.push(
      reminder
    );


    saveUiData(
      data
    );


    window.dispatchEvent(
      new CustomEvent(
        "bociteart:mutualisation-reminder-created",
        {
          detail:
            reminder
        }
      )
    );


    return reminder;
  }


  /* =======================================================
     OPÉRATION LOCALE PAR COMMUNE
     ======================================================= */

  function getOperationKey(
    commune,
    needId
  ){

    return (
      String(
        commune || ""
      )
      .trim()
      .toLowerCase() +
      "::" +
      String(
        needId || ""
      )
    );
  }


  function getOperation(
    commune,
    needId
  ){

    const data =
      loadUiData();


    const key =
      getOperationKey(
        commune,
        needId
      );


    return (
      data.operations[key] ||
      {
        id:
          createId(
            "OP"
          ),

        commune:
          commune,

        needId:
          needId,

        status:
          "ouverte",

        interestedUnique:0,

        voters:0,

        confirmed:0,

        signedActive:0,

        currentThreshold:0,

        nextThreshold:0,

        supplierSelectionStatus:
          "non_demarre",

        supplierConsultationStatus:
          "non_demarre",

        votingStatus:
          "non_demarre",

        contractingStatus:
          "non_demarre",

        updatedAt:
          null,

        updatedAtFr:
          ""
      }
    );
  }


  function saveOperation(
    commune,
    needId,
    operation
  ){

    const data =
      loadUiData();


    const key =
      getOperationKey(
        commune,
        needId
      );


    data.operations[key] =
      Object.assign(
        {},
        getOperation(
          commune,
          needId
        ),
        operation || {},
        {
          commune:
            commune,

          needId:
            needId,

          updatedAt:
            Date.now(),

          updatedAtFr:
            new Date()
              .toLocaleString(
                "fr-FR"
              )
        }
      );


    saveUiData(
      data
    );


    return data.operations[key];
  }


  /* =======================================================
     EXPOSITION INTERNE DU BLOC 1
     ======================================================= */

  module.mutualisationV2 =
    module.mutualisationV2 || {};


  module.mutualisationV2.loadUiData =
    loadUiData;

  module.mutualisationV2.saveUiData =
    saveUiData;

  module.mutualisationV2.getCurrentProfessionalId =
    getCurrentProfessionalId;

  module.mutualisationV2.getCurrentCommune =
    getCurrentCommune;

  module.mutualisationV2.getParticipantSituation =
    getParticipantSituation;

  module.mutualisationV2.saveParticipantSituation =
    saveParticipantSituation;

  module.mutualisationV2.scheduleReminder =
    scheduleReminder;

  module.mutualisationV2.getOperation =
    getOperation;

  module.mutualisationV2.saveOperation =
    saveOperation;

  module.mutualisationV2.getBrandHtml =
    getBrandHtml;

  module.mutualisationV2.escapeValue =
    escapeValue;

  module.mutualisationV2.getElement =
    getElement;

  module.mutualisationV2.formatDate =
    formatDate;

  module.mutualisationV2.formatDateTime =
    formatDateTime;

  module.mutualisationV2.statusLabels =
    STATUS_LABELS;

   /* =======================================================
     BLOC 2
     PAGE PRINCIPALE — PAYER MOINS DE CHARGES
     ======================================================= */

  function loadExistingMutualisationData(){

    if(
      typeof module.loadMutualisationData ===
      "function"
    ){

      try{

        const data =
          module.loadMutualisationData();

        if(data){
          return data;
        }

      }catch(error){
        /* secours ci-dessous */
      }
    }


    return {
      categories:{},
      customNeeds:[]
    };
  }


  function getNeedLabel(
    needId,
    fallback
  ){

    const existing =
      loadExistingMutualisationData();


    const categories =
      existing.categories || {};


    const keys =
      Object.keys(
        categories
      );


    for(
      let i = 0;
      i < keys.length;
      i += 1
    ){

      const item =
        categories[
          keys[i]
        ] || {};


      if(
        keys[i] === needId ||
        item.id === needId
      ){

        return String(
          item.label ||
          fallback ||
          needId
        );
      }
    }


    const customNeeds =
      Array.isArray(
        existing.customNeeds
      )
        ? existing.customNeeds
        : [];


    const custom =
      customNeeds.find(
        function(item){

          return (
            item &&
            item.id === needId
          );
        }
      );


    if(custom){

      return String(
        custom.title ||
        fallback ||
        needId
      );
    }


    return String(
      fallback ||
      needId ||
      "Demande"
    );
  }


  /* =======================================================
     COMPTEUR D'UNE DEMANDE
     ======================================================= */

  function getNeedCount(
    needId
  ){

    const existing =
      loadExistingMutualisationData();


    const categories =
      existing.categories || {};


    const keys =
      Object.keys(
        categories
      );


    for(
      let i = 0;
      i < keys.length;
      i += 1
    ){

      const item =
        categories[
          keys[i]
        ] || {};


      if(
        keys[i] === needId ||
        item.id === needId
      ){

        return Number(
          item.count || 0
        );
      }
    }


    const customNeeds =
      Array.isArray(
        existing.customNeeds
      )
        ? existing.customNeeds
        : [];


    const custom =
      customNeeds.find(
        function(item){

          return (
            item &&
            item.id === needId
          );
        }
      );


    return custom
      ? Number(
          custom.count || 0
        )
      : 0;
  }


  /* =======================================================
     DEMANDES AFFICHÉES
     ======================================================= */

  function getVisibleNeeds(){

    const existing =
      loadExistingMutualisationData();


    const categories =
      existing.categories || {};


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


    const result = [];


    defaultOrder
      .forEach(function(key){

        const item =
          categories[key];

        if(!item){
          return;
        }


        result.push({

          id:
            String(
              item.id || key
            ),

          label:
            String(
              item.label || key
            ),

          count:
            Number(
              item.count || 0
            )

        });

      });


    const customNeeds =
      Array.isArray(
        existing.customNeeds
      )
        ? existing.customNeeds
        : [];


    customNeeds
      .forEach(function(item){

        if(!item){
          return;
        }


        result.push({

          id:
            String(
              item.id || ""
            ),

          label:
            String(
              item.title ||
              "Nouvelle demande"
            ),

          count:
            Number(
              item.count || 0
            )

        });

      });


    return result;
  }


  /* =======================================================
     VÉRIFICATION :
     LE PROFESSIONNEL EST-IL DÉJÀ INSCRIT ?
     ======================================================= */

  function isCurrentProfessionalRegistered(
    needId
  ){

    const professionalId =
      getCurrentProfessionalId();


    const situation =
      getParticipantSituation(
        professionalId,
        needId
      );


    return Boolean(
      situation &&
      situation.status
    );
  }


  /* =======================================================
     LIGNE D'UNE DEMANDE
     ======================================================= */

  function getNeedLineHtml(
    item
  ){

    const needId =
      String(
        item.id || ""
      );


    const label =
      String(
        item.label ||
        "Demande"
      );


    const count =
      Number(
        item.count || 0
      );


    const registered =
      isCurrentProfessionalRegistered(
        needId
      );


    const professionalId =
      getCurrentProfessionalId();


    const situation =
      getParticipantSituation(
        professionalId,
        needId
      );


    const statusLabel =
      situation.status
        ? (
            STATUS_LABELS[
              situation.status
            ] ||
            "Suivi en cours"
          )
        : "";


    return `

      <div
        class="bociteMutualisationNeedLine">

        <div
          class="bociteMutualisationNeedInfo">

          ${escapeValue(
            label
          )}

          <span
            class="bociteMutualisationCounter">

            ${count}
            professionnel(s) intéressé(s)

          </span>

          ${
            registered
              ? `
                <span
                  class="bociteMutualisationStatus">

                  ${escapeValue(
                    statusLabel
                  )}

                </span>
              `
              : ""
          }

        </div>


        ${
          registered
            ? `
              <button
                class="
                  choiceBtn
                  bociteMutualisationMiniButton
                  mutualisationSituationBtn
                "
                type="button"
                data-need-id="${escapeValue(
                  needId
                )}"
                data-need-label="${escapeValue(
                  label
                )}">
                Voir mon suivi
              </button>
            `
            : `
              <button
                class="
                  choiceBtn
                  bociteMutualisationMiniButton
                  mutualisationJoinBtn
                "
                type="button"
                data-need-id="${escapeValue(
                  needId
                )}"
                data-need-label="${escapeValue(
                  label
                )}">
                Je suis intéressé
              </button>
            `
        }

      </div>

    `;
  }


  /* =======================================================
     PAGE PRINCIPALE
     ======================================================= */

  function getMutualisationHtml(){

    const commune =
      getCurrentCommune();


    const needs =
      getVisibleNeeds();


    const needsHtml =
      needs.length
        ? needs
            .map(
              getNeedLineHtml
            )
            .join("")
        : `
            <div
              class="bociteMutualisationText">

              Aucune demande
              n'est encore enregistrée.

            </div>
          `;


    return `

      <div
        class="bociteMutualisationPage">


        <div
          class="
            bociteMutualisationBox
            bociteMutualisationBoxAccent
          ">

          <div
            class="bociteMutualisationTitle">
            Payer moins de charges
          </div>

          <div
            class="bociteMutualisationText">

            Vous indiquez votre besoin.
            ${getBrandHtml()}
            regroupe les professionnels intéressés
            et recherche les meilleures conditions.

            <br><br>

            Vous suivez l'avancement,
            comparez les propositions
            puis décidez.

          </div>

        </div>


        <div
          class="bociteMutualisationBox">

          <div
            class="bociteMutualisationTitle">
            Dans votre commune
          </div>

          <div
            class="bociteMutualisationText">

            ${escapeValue(
              commune
            )}

          </div>

        </div>


        <div
          class="bociteMutualisationBox">

          <div
            class="bociteMutualisationTitle">
            Les demandes en cours
          </div>

          ${needsHtml}

        </div>


        <div
          class="bociteMutualisationBox">

          <div
            class="bociteMutualisationTitle">
            Vous avez un autre besoin ?
          </div>

          <div
            class="bociteMutualisationText">

            Proposez-le.
            Il pourra être rejoint
            par d'autres professionnels.

          </div>


          <input
            id="mutualisationNewNeedTitle"
            class="
              miniField
              bociteMutualisationInput
            "
            type="text"
            placeholder="Exemple : achat de matériel"
          >


          <textarea
            id="mutualisationNewNeedDescription"
            class="
              miniField
              bociteMutualisationTextarea
            "
            placeholder="Précisez votre besoin si nécessaire"
          ></textarea>


          <button
            id="mutualisationAddNeedBtn"
            class="
              choiceBtn
              bociteMutualisationButton
            "
            type="button">
            Ajouter cette demande
          </button>

        </div>


        <button
          id="mutualisationPrivateAccessBtn"
          class="
            choiceBtn
            bociteMutualisationButton
          "
          type="button">
          Suivre mes demandes
        </button>


      </div>

    `;
  }


  /* =======================================================
     ÉCRAN :
     MA SITUATION ACTUELLE
     ======================================================= */

  function getSituationHtml(
    needId,
    needLabel
  ){

    const professionalId =
      getCurrentProfessionalId();


    const situation =
      getParticipantSituation(
        professionalId,
        needId
      );


    return `

      <div
        class="bociteMutualisationPage">


        <div
          class="
            bociteMutualisationBox
            bociteMutualisationBoxAccent
          ">

          <div
            class="bociteMutualisationTitle">
            ${escapeValue(
              needLabel
            )}
          </div>

          <div
            class="bociteMutualisationText">

            Pour préparer votre demande,
            indiquez simplement
            votre situation actuelle.

          </div>

        </div>


        <div
          class="bociteMutualisationBox">

          <div
            class="bociteMutualisationTitle">
            Votre contrat actuel
          </div>


          <button
            class="
              choiceBtn
              bociteMutualisationButton
              mutualisationContractChoiceBtn
            "
            type="button"
            data-status="free"
            data-need-id="${escapeValue(
              needId
            )}"
            data-need-label="${escapeValue(
              needLabel
            )}">
            Je suis disponible
          </button>


          <button
            class="
              choiceBtn
              bociteMutualisationButton
              mutualisationContractChoiceBtn
            "
            type="button"
            data-status="engaged"
            data-need-id="${escapeValue(
              needId
            )}"
            data-need-label="${escapeValue(
              needLabel
            )}">
            J'ai encore un contrat en cours
          </button>


          <button
            class="
              choiceBtn
              bociteMutualisationButton
              mutualisationContractChoiceBtn
            "
            type="button"
            data-status="litigation"
            data-need-id="${escapeValue(
              needId
            )}"
            data-need-label="${escapeValue(
              needLabel
            )}">
            Une situation m'empêche actuellement de changer
          </button>

        </div>


        ${
          situation.status
            ? `
              <div
                class="bociteMutualisationBox">

                <div
                  class="bociteMutualisationTitle">
                  Situation enregistrée
                </div>

                <div
                  class="bociteMutualisationText">

                  ${
                    escapeValue(
                      STATUS_LABELS[
                        situation.status
                      ] ||
                      "Suivi en cours"
                    )
                  }

                  ${
                    situation.nextReviewDate
                      ? `
                          <br><br>

                          Prochaine date de suivi :
                          ${escapeValue(
                            formatDate(
                              situation.nextReviewDate
                            )
                          )}
                        `
                      : ""
                  }

                </div>

              </div>
            `
            : ""
        }


      </div>

    `;
  }


  /* =======================================================
     CONTRAT EN COURS
     ======================================================= */

  function getEngagedContractHtml(
    needId,
    needLabel
  ){

    return `

      <div
        class="bociteMutualisationPage">


        <div
          class="
            bociteMutualisationBox
            bociteMutualisationBoxAccent
          ">

          <div
            class="bociteMutualisationTitle">
            Contrat actuel
          </div>

          <div
            class="bociteMutualisationText">

            Ces informations permettent
            à ${getBrandHtml()}
            de préparer votre prochaine étape
            au bon moment.

          </div>

        </div>


        <div
          class="bociteMutualisationBox">

          <label
            class="bociteMutualisationText"
            for="mutualisationCurrentSupplier">

            Prestataire actuel

          </label>

          <input
            id="mutualisationCurrentSupplier"
            class="
              miniField
              bociteMutualisationInput
            "
            type="text"
            placeholder="Nom du prestataire"
          >


          <label
            class="bociteMutualisationText"
            for="mutualisationContractEndDate"
            style="
              display:block;
              margin-top:12px;
            ">

            Date d'échéance du contrat

          </label>

          <input
            id="mutualisationContractEndDate"
            class="
              miniField
              bociteMutualisationInput
            "
            type="date"
          >


          <label
            class="bociteMutualisationText"
            for="mutualisationNoticeMonths"
            style="
              display:block;
              margin-top:12px;
            ">

            Préavis connu

          </label>

          <select
            id="mutualisationNoticeMonths"
            class="
              miniField
              bociteMutualisationSelect
            ">

            <option value="">
              Je ne sais pas
            </option>

            <option value="1">
              1 mois
            </option>

            <option value="2">
              2 mois
            </option>

            <option value="3">
              3 mois
            </option>

            <option value="6">
              6 mois
            </option>

          </select>


          <button
            id="mutualisationSaveContractBtn"
            class="
              choiceBtn
              bociteMutualisationButton
            "
            type="button"
            data-need-id="${escapeValue(
              needId
            )}"
            data-need-label="${escapeValue(
              needLabel
            )}">
            Enregistrer et préparer le suivi
          </button>

        </div>


      </div>

    `;
  }


  /* =======================================================
     SITUATION À REPORTER
     ======================================================= */

  function getPostponedSituationHtml(
    needId,
    needLabel
  ){

    return `

      <div
        class="bociteMutualisationPage">


        <div
          class="
            bociteMutualisationBox
            bociteMutualisationBoxAccent
          ">

          <div
            class="bociteMutualisationTitle">
            Reporter cette demande
          </div>

          <div
            class="bociteMutualisationText">

            Votre situation ne vous permet pas
            de changer maintenant.

            <br><br>

            Indiquez simplement
            quand ${getBrandHtml()}
            doit reprendre ce dossier avec vous.

          </div>

        </div>


        <div
          class="bociteMutualisationBox">

          <label
            class="bociteMutualisationText"
            for="mutualisationPostponeReason">

            Situation actuelle

          </label>


          <select
            id="mutualisationPostponeReason"
            class="
              miniField
              bociteMutualisationSelect
            ">

            <option value="litige">
              Litige ou désaccord en cours
            </option>

            <option value="negociation">
              Négociation en cours
            </option>

            <option value="prolongation">
              Contrat prolongé
            </option>

            <option value="autre">
              Autre situation
            </option>

          </select>


          <label
            class="bociteMutualisationText"
            for="mutualisationPostponeDate"
            style="
              display:block;
              margin-top:12px;
            ">

            Me rappeler à partir du

          </label>


          <input
            id="mutualisationPostponeDate"
            class="
              miniField
              bociteMutualisationInput
            "
            type="date"
          >


          <textarea
            id="mutualisationPostponeNote"
            class="
              miniField
              bociteMutualisationTextarea
            "
            placeholder="Précision facultative"
          ></textarea>


          <button
            id="mutualisationSavePostponeBtn"
            class="
              choiceBtn
              bociteMutualisationButton
            "
            type="button"
            data-need-id="${escapeValue(
              needId
            )}"
            data-need-label="${escapeValue(
              needLabel
            )}">
            Enregistrer ce rappel
          </button>

        </div>


      </div>

    `;
  }


  /* =======================================================
     CALCUL DE LA DATE UTILE
     ======================================================= */

  function calculateUsefulDate(
    contractEndDate,
    noticeMonths
  ){

    if(!contractEndDate){
      return "";
    }


    const date =
      new Date(
        contractEndDate +
        "T12:00:00"
      );


    if(
      Number.isNaN(
        date.getTime()
      )
    ){
      return "";
    }


    const months =
      Number(
        noticeMonths || 0
      );


    if(months > 0){

      date.setMonth(
        date.getMonth() -
        months
      );
    }


    /*
      Une marge de préparation est prévue
      avant la date limite connue.
    */

    date.setDate(
      date.getDate() - 14
    );


    return (
      date.getFullYear() +
      "-" +
      String(
        date.getMonth() + 1
      ).padStart(2,"0") +
      "-" +
      String(
        date.getDate()
      ).padStart(2,"0")
    );
  }


  /* =======================================================
     OUVERTURE SITUATION
     ======================================================= */

  function openSituation(
    needId,
    needLabel
  ){

    module.renderModulePage(

      "Payer moins de charges",

      getSituationHtml(
        needId,
        needLabel
      ),

      {
        showBack:true,
        showFooter:false,

        afterRender:
          function(){

            bindSituation(
              needId,
              needLabel
            );
          }
      }

    );
  }


  /* =======================================================
     OUVERTURE CONTRAT EN COURS
     ======================================================= */

  function openEngagedContract(
    needId,
    needLabel
  ){

    module.renderModulePage(

      "Payer moins de charges",

      getEngagedContractHtml(
        needId,
        needLabel
      ),

      {
        showBack:true,
        showFooter:false,

        afterRender:
          function(){

            bindEngagedContract(
              needId,
              needLabel
            );
          }
      }

    );
  }


  /* =======================================================
     OUVERTURE REPORT
     ======================================================= */

  function openPostponedSituation(
    needId,
    needLabel
  ){

    module.renderModulePage(

      "Payer moins de charges",

      getPostponedSituationHtml(
        needId,
        needLabel
      ),

      {
        showBack:true,
        showFooter:false,

        afterRender:
          function(){

            bindPostponedSituation(
              needId,
              needLabel
            );
          }
      }

    );
  }


  /* =======================================================
     ENREGISTREMENT DE L'INTÉRÊT
     ======================================================= */

  function registerInterest(
    needId,
    needLabel
  ){

    if(
      typeof module.joinMutualisationNeed ===
      "function"
    ){

      const result =
        module.joinMutualisationNeed(
          needId
        );


      if(
        result &&
        result.ok === false
      ){

        alert(
          result.error ||
          "Votre demande n'a pas pu être enregistrée."
        );

        return false;
      }
    }


    const professionalId =
      getCurrentProfessionalId();


    saveParticipantSituation(
      professionalId,
      needId,
      {
        status:
          "interested",

        needLabel:
          needLabel,

        commune:
          getCurrentCommune()
      }
    );


    const operation =
      getOperation(
        getCurrentCommune(),
        needId
      );


    saveOperation(
      getCurrentCommune(),
      needId,
      Object.assign(
        {},
        operation,
        {
          interestedUnique:
            Math.max(
              Number(
                operation.interestedUnique || 0
              ),
              getNeedCount(
                needId
              )
            )
        }
      )
    );


    return true;
  }


  /* =======================================================
     BIND — SITUATION
     ======================================================= */

  function bindSituation(
    needId,
    needLabel
  ){

    document
      .querySelectorAll(
        ".mutualisationContractChoiceBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            const status =
              String(
                button.getAttribute(
                  "data-status"
                ) || ""
              );


            const professionalId =
              getCurrentProfessionalId();


            if(
              status === "free"
            ){

              saveParticipantSituation(
                professionalId,
                needId,
                {
                  status:
                    "free",

                  needLabel:
                    needLabel,

                  commune:
                    getCurrentCommune(),

                  nextReviewDate:
                    ""
                }
              );


              alert(
                "Votre situation est enregistrée.\n\n" +
                "Vous pouvez maintenant suivre cette demande."
              );


              openMutualisationModule();

              return;
            }


            if(
              status === "engaged"
            ){

              openEngagedContract(
                needId,
                needLabel
              );

              return;
            }


            if(
              status === "litigation"
            ){

              openPostponedSituation(
                needId,
                needLabel
              );
            }

          };

      });
  }


  /* =======================================================
     BIND — CONTRAT EN COURS
     ======================================================= */

  function bindEngagedContract(
    needId,
    needLabel
  ){

    const button =
      getElement(
        "mutualisationSaveContractBtn"
      );


    if(!button){
      return;
    }


    button.onclick =
      function(){

        const supplier =
          String(
            getElement(
              "mutualisationCurrentSupplier"
            )?.value || ""
          )
          .trim();


        const endDate =
          String(
            getElement(
              "mutualisationContractEndDate"
            )?.value || ""
          );


        const noticeMonths =
          String(
            getElement(
              "mutualisationNoticeMonths"
            )?.value || ""
          );


        if(!endDate){

          alert(
            "Indiquez la date d'échéance connue de votre contrat."
          );

          return;
        }


        const usefulDate =
          calculateUsefulDate(
            endDate,
            noticeMonths
          );


        const professionalId =
          getCurrentProfessionalId();


        saveParticipantSituation(
          professionalId,
          needId,
          {
            status:
              "engaged",

            needLabel:
              needLabel,

            commune:
              getCurrentCommune(),

            supplier:
              supplier,

            contractEndDate:
              endDate,

            noticeMonths:
              noticeMonths,

            nextReviewDate:
              usefulDate
          }
        );


        scheduleReminder({

          professionalId:
            professionalId,

          needId:
            needId,

          subject:
            needLabel,

          dueDate:
            usefulDate,

          reason:
            "Préparer la prochaine échéance du contrat"

        });


        alert(
          "Votre échéance est enregistrée.\n\n" +
          (
            usefulDate
              ? (
                  "Votre suivi est prévu à partir du " +
                  formatDate(
                    usefulDate
                  ) +
                  "."
                )
              : "Votre dossier reste enregistré."
          )
        );


        openMutualisationModule();

      };
  }


  /* =======================================================
     BIND — REPORT / LITIGE / ATTENTE
     ======================================================= */

  function bindPostponedSituation(
    needId,
    needLabel
  ){

    const button =
      getElement(
        "mutualisationSavePostponeBtn"
      );


    if(!button){
      return;
    }


    button.onclick =
      function(){

        const reason =
          String(
            getElement(
              "mutualisationPostponeReason"
            )?.value || ""
          );


        const date =
          String(
            getElement(
              "mutualisationPostponeDate"
            )?.value || ""
          );


        const note =
          String(
            getElement(
              "mutualisationPostponeNote"
            )?.value || ""
          )
          .trim();


        if(!date){

          alert(
            "Indiquez la date à laquelle vous souhaitez reprendre ce dossier."
          );

          return;
        }


        const professionalId =
          getCurrentProfessionalId();


        saveParticipantSituation(
          professionalId,
          needId,
          {
            status:
              reason === "litige"
                ? "litigation"
                : "postponed",

            needLabel:
              needLabel,

            commune:
              getCurrentCommune(),

            litigation:
              reason === "litige",

            note:
              note,

            nextReviewDate:
              date
          }
        );


        scheduleReminder({

          professionalId:
            professionalId,

          needId:
            needId,

          subject:
            needLabel,

          dueDate:
            date,

          reason:
            reason

        });


        alert(
          "Votre dossier est conservé.\n\n" +
          "Le suivi est prévu à partir du " +
          formatDate(
            date
          ) +
          "."
        );


        openMutualisationModule();

      };
  }


  /* =======================================================
     AJOUT D'UNE NOUVELLE DEMANDE
     ======================================================= */

  function addNewNeed(){

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
      "Votre demande est enregistrée."
    );


    openMutualisationModule();
  }


  /* =======================================================
     BIND PAGE PRINCIPALE
     ======================================================= */

  function bindMutualisation(){

    document
      .querySelectorAll(
        ".mutualisationJoinBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            const needId =
              String(
                button.getAttribute(
                  "data-need-id"
                ) || ""
              );


            const needLabel =
              String(
                button.getAttribute(
                  "data-need-label"
                ) || "Demande"
              );


            if(!needId){
              return;
            }


            if(
              registerInterest(
                needId,
                needLabel
              )
            ){

              openSituation(
                needId,
                needLabel
              );
            }

          };

      });


    document
      .querySelectorAll(
        ".mutualisationSituationBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            openSituation(

              String(
                button.getAttribute(
                  "data-need-id"
                ) || ""
              ),

              String(
                button.getAttribute(
                  "data-need-label"
                ) || "Demande"
              )

            );

          };

      });


    const addButton =
      getElement(
        "mutualisationAddNeedBtn"
      );


    if(addButton){

      addButton.onclick =
        addNewNeed;
    }


    const followButton =
      getElement(
        "mutualisationPrivateAccessBtn"
      );


    if(followButton){

      followButton.onclick =
        function(){

          if(
            typeof module.openMutualisationResponses ===
            "function"
          ){

            module.openMutualisationResponses();

            return;
          }


          alert(
            "Votre suivi est en préparation."
          );

        };
    }
  }

   /* =======================================================
     BLOC 3
     SUIVI VIVANT • OFFRES • VOTE • ENGAGEMENT
     ======================================================= */


  /* =======================================================
     COMPTEURS DE SUIVI
     ======================================================= */

  function getOperationCounters(
    needId
  ){

    const commune =
      getCurrentCommune();


    const operation =
      getOperation(
        commune,
        needId
      );


    return {

      interested:
        Number(
          operation.interestedUnique || 0
        ),

      voters:
        Number(
          operation.voters || 0
        ),

      confirmed:
        Number(
          operation.confirmed || 0
        ),

      signed:
        Number(
          operation.signedActive || 0
        )

    };
  }


  /* =======================================================
     OPÉRATION — DONNÉES COMPLÉMENTAIRES
     ======================================================= */

  function ensureOperationDetails(
    needId,
    needLabel
  ){

    const commune =
      getCurrentCommune();


    const operation =
      getOperation(
        commune,
        needId
      );


    const updated =
      Object.assign(
        {},
        operation,
        {

          label:
            needLabel,

          offers:
            Array.isArray(
              operation.offers
            )
              ? operation.offers
              : [],

          votes:
            operation.votes &&
            typeof operation.votes ===
            "object"
              ? operation.votes
              : {},

          winningOfferId:
            String(
              operation.winningOfferId ||
              ""
            ),

          finalOfferConfirmed:
            Boolean(
              operation.finalOfferConfirmed
            ),

          currentThreshold:
            Number(
              operation.currentThreshold || 0
            ),

          nextThreshold:
            Number(
              operation.nextThreshold || 0
            ),

          voteDeadline:
            String(
              operation.voteDeadline || ""
            ),

          lastSupplierReviewAt:
            operation.lastSupplierReviewAt ||
            null

        }
      );


    return saveOperation(
      commune,
      needId,
      updated
    );
  }


  /* =======================================================
     PALIERS
     ======================================================= */

  function calculateThresholds(
    activeCount
  ){

    const count =
      Number(
        activeCount || 0
      );


    const thresholds = [
      10,
      20,
      30,
      40,
      50,
      75,
      100,
      150,
      200,
      300,
      500
    ];


    let current = 0;
    let next = 0;


    thresholds
      .forEach(function(value){

        if(
          count >= value
        ){
          current = value;
        }

      });


    next =
      thresholds.find(
        function(value){

          return value > count;
        }
      ) || 0;


    return {
      current:
        current,
      next:
        next
    };
  }


  /* =======================================================
     SYNCHRONISATION DES PALIERS
     ======================================================= */

  function syncOperationThresholds(
    needId,
    needLabel
  ){

    const commune =
      getCurrentCommune();


    const operation =
      ensureOperationDetails(
        needId,
        needLabel
      );


    const activeCount =
      Math.max(
        Number(
          operation.signedActive || 0
        ),
        Number(
          operation.interestedUnique || 0
        )
      );


    const thresholds =
      calculateThresholds(
        activeCount
      );


    return saveOperation(
      commune,
      needId,
      Object.assign(
        {},
        operation,
        {
          currentThreshold:
            thresholds.current,

          nextThreshold:
            thresholds.next
        }
      )
    );
  }


  /* =======================================================
     PAGE DE SUIVI
     ======================================================= */

  function getOperationTrackingHtml(
    needId,
    needLabel
  ){

    const commune =
      getCurrentCommune();


    const operation =
      syncOperationThresholds(
        needId,
        needLabel
      );


    const counters =
      getOperationCounters(
        needId
      );


    const nextThreshold =
      Number(
        operation.nextThreshold || 0
      );


    const remaining =
      nextThreshold
        ? Math.max(
            0,
            nextThreshold -
            Math.max(
              counters.signed,
              counters.interested
            )
          )
        : 0;


    return `

      <div
        class="bociteMutualisationPage">


        <div
          class="
            bociteMutualisationBox
            bociteMutualisationBoxAccent
          ">

          <div
            class="bociteMutualisationTitle">

            ${escapeValue(
              needLabel
            )}

          </div>

          <div
            class="bociteMutualisationText">

            Commune :
            ${escapeValue(
              commune
            )}

          </div>

        </div>


        <div
          class="bociteMutualisationGrid">


          <div
            class="bociteMutualisationCard">

            <strong>
              ${counters.interested}
            </strong>

            intéressé(s)

          </div>


          <div
            class="bociteMutualisationCard">

            <strong>
              ${counters.voters}
            </strong>

            vote(s)

          </div>


          <div
            class="bociteMutualisationCard">

            <strong>
              ${counters.confirmed}
            </strong>

            engagement(s)

          </div>


          <div
            class="bociteMutualisationCard">

            <strong>
              ${counters.signed}
            </strong>

            contrat(s) actif(s)

          </div>


        </div>


        <div
          class="bociteMutualisationBox"
          style="
            margin-top:10px;
          ">

          <div
            class="bociteMutualisationTitle">

            Avancement

          </div>


          <div
            class="bociteMutualisationText">

            ${
              operation.currentThreshold
                ? (
                    "Palier actuel : " +
                    escapeValue(
                      operation.currentThreshold
                    )
                  )
                : "Premier palier en préparation"
            }

            ${
              nextThreshold
                ? `
                    <br><br>

                    Prochain palier :
                    ${escapeValue(
                      nextThreshold
                    )}

                    <br>

                    ${
                      remaining
                    }
                    participation(s)
                    supplémentaire(s)
                    nécessaire(s).
                  `
                : ""
            }

          </div>

        </div>


        <div
          class="bociteMutualisationBox">

          <div
            class="bociteMutualisationTitle">

            État de votre demande

          </div>

          <div
            class="bociteMutualisationText">

            ${getOperationStatusText(
              operation
            )}

          </div>

        </div>


        ${
          getOffersSectionHtml(
            operation,
            needId,
            needLabel
          )
        }


        <button
          id="mutualisationTrackingBackBtn"
          class="
            choiceBtn
            bociteMutualisationButton
          "
          type="button">
          Revenir aux demandes
        </button>


      </div>

    `;
  }


  /* =======================================================
     TEXTE D'ÉTAT
     ======================================================= */

  function getOperationStatusText(
    operation
  ){

    if(
      operation.contractingStatus ===
      "signed"
    ){

      return (
        "Votre contrat est enregistré. " +
        "Le groupe continue d'évoluer " +
        "et les améliorations prévues aux nouveaux paliers pourront être appliquées selon les conditions convenues."
      );
    }


    if(
      operation.contractingStatus ===
      "ready"
    ){

      return (
        "L'offre retenue est prête pour la contractualisation."
      );
    }


    if(
      operation.votingStatus ===
      "closed"
    ){

      return (
        "Le vote est terminé. " +
        "L'offre collective retenue est en préparation."
      );
    }


    if(
      operation.votingStatus ===
      "open"
    ){

      return (
        "Les propositions sont disponibles. " +
        "Vous pouvez consulter la synthèse puis voter."
      );
    }


    if(
      operation.supplierConsultationStatus ===
      "responses_received"
    ){

      return (
        "Les propositions fournisseurs ont été reçues et sont en cours de préparation."
      );
    }


    if(
      operation.supplierConsultationStatus ===
      "sent"
    ){

      return (
        "La demande a été transmise aux prestataires sélectionnés."
      );
    }


    if(
      operation.supplierSelectionStatus ===
      "ready"
    ){

      return (
        "La consultation est prête à être lancée."
      );
    }


    return (
      "Le groupe se constitue. " +
      "Vous pouvez suivre son évolution depuis cette page."
    );
  }


  /* =======================================================
     OFFRES
     ======================================================= */

  function getOffersSectionHtml(
    operation,
    needId,
    needLabel
  ){

    const offers =
      Array.isArray(
        operation.offers
      )
        ? operation.offers
        : [];


    if(!offers.length){

      return `
        <div
          class="bociteMutualisationBox">

          <div
            class="bociteMutualisationTitle">

            Propositions

          </div>

          <div
            class="bociteMutualisationText">

            Aucune proposition
            n'est encore disponible.

          </div>

        </div>
      `;
    }


    const votes =
      operation.votes &&
      typeof operation.votes ===
      "object"
        ? operation.votes
        : {};


    const winningOfferId =
      String(
        operation.winningOfferId || ""
      );


    const voteClosed =
      operation.votingStatus ===
      "closed";


    return `

      <div
        class="bociteMutualisationBox">

        <div
          class="bociteMutualisationTitle">

          Synthèse ${getBrandHtml()}

        </div>

        <div
          class="bociteMutualisationText">

          Comparez les propositions
          avant de faire votre choix.

        </div>

      </div>


      ${offers
        .map(function(offer,index){

          const offerId =
            String(
              offer.id ||
              (
                "offre-" +
                (index + 1)
              )
            );


          const voteCount =
            Number(
              votes[offerId] || 0
            );


          const isWinner =
            (
              voteClosed &&
              winningOfferId ===
              offerId
            );


          return `

            <div
              class="
                bociteMutualisationBox
                ${
                  isWinner
                    ? "bociteMutualisationBoxAccent"
                    : ""
                }
              ">

              <div
                class="bociteMutualisationTitle">

                Offre ${index + 1}

              </div>


              <div
                class="bociteMutualisationText">

                ${
                  offer.summary
                    ? escapeValue(
                        offer.summary
                      )
                    : "Proposition reçue."
                }

                ${
                  offer.advantages
                    ? `
                        <br><br>

                        Points favorables :
                        ${escapeValue(
                          offer.advantages
                        )}
                      `
                    : ""
                }

                ${
                  offer.watchPoints
                    ? `
                        <br><br>

                        Points à vérifier :
                        ${escapeValue(
                          offer.watchPoints
                        )}
                      `
                    : ""
                }

                <br><br>

                Votes :
                ${voteCount}

              </div>


              ${
                !voteClosed
                  ? `
                      <button
                        class="
                          choiceBtn
                          bociteMutualisationButton
                          mutualisationVoteBtn
                        "
                        type="button"
                        data-need-id="${escapeValue(
                          needId
                        )}"
                        data-need-label="${escapeValue(
                          needLabel
                        )}"
                        data-offer-id="${escapeValue(
                          offerId
                        )}">
                        Choisir cette offre
                      </button>
                    `
                  : ""
              }


              ${
                isWinner
                  ? `
                      <div
                        class="bociteMutualisationStatus">

                        Offre retenue

                      </div>
                    `
                  : ""
              }


            </div>

          `;

        })
        .join("")}

    `;
  }


  /* =======================================================
     VOTE UNIQUE DU PROFESSIONNEL
     ======================================================= */

  function registerVote(
    needId,
    offerId
  ){

    const professionalId =
      getCurrentProfessionalId();


    const commune =
      getCurrentCommune();


    const operation =
      ensureOperationDetails(
        needId,
        getNeedLabel(
          needId,
          "Demande"
        )
      );


    operation.professionalVotes =
      operation.professionalVotes &&
      typeof operation.professionalVotes ===
      "object"
        ? operation.professionalVotes
        : {};


    if(
      operation.professionalVotes[
        professionalId
      ]
    ){

      alert(
        "Votre vote est déjà enregistré."
      );

      return false;
    }


    operation.votes =
      operation.votes &&
      typeof operation.votes ===
      "object"
        ? operation.votes
        : {};


    operation.votes[
      offerId
    ] =
      Number(
        operation.votes[
          offerId
        ] || 0
      ) + 1;


    operation.professionalVotes[
      professionalId
    ] =
      offerId;


    operation.voters =
      Object.keys(
        operation.professionalVotes
      ).length;


    operation.votingStatus =
      "open";


    saveOperation(
      commune,
      needId,
      operation
    );


    addAudit(
      "vote_enregistre",
      {
        professionalId:
          professionalId,

        needId:
          needId,

        offerId:
          offerId
      }
    );


    return true;
  }


  /* =======================================================
     CALCUL DE L'OFFRE GAGNANTE
     ======================================================= */

  function calculateWinningOffer(
    operation
  ){

    const votes =
      operation.votes &&
      typeof operation.votes ===
      "object"
        ? operation.votes
        : {};


    const ids =
      Object.keys(
        votes
      );


    if(!ids.length){
      return "";
    }


    let winner = "";
    let bestCount = -1;


    ids
      .forEach(function(id){

        const count =
          Number(
            votes[id] || 0
          );


        if(
          count > bestCount
        ){

          bestCount =
            count;

          winner =
            id;
        }

      });


    return winner;
  }


  /* =======================================================
     CLÔTURE DU VOTE
     POINT DE RACCORDEMENT ADMIN / SERVEUR
     ======================================================= */

  function closeVote(
    needId
  ){

    const commune =
      getCurrentCommune();


    const operation =
      ensureOperationDetails(
        needId,
        getNeedLabel(
          needId,
          "Demande"
        )
      );


    const winner =
      calculateWinningOffer(
        operation
      );


    if(!winner){

      return {
        ok:false,
        error:
          "Aucun vote enregistré."
      };
    }


    operation.winningOfferId =
      winner;


    operation.votingStatus =
      "closed";


    operation.contractingStatus =
      "ready";


    saveOperation(
      commune,
      needId,
      operation
    );


    window.dispatchEvent(
      new CustomEvent(
        "bociteart:mutualisation-vote-closed",
        {
          detail:{
            commune:
              commune,

            needId:
              needId,

            winningOfferId:
              winner
          }
        }
      )
    );


    return {
      ok:true,
      winningOfferId:
        winner
    };
  }


  /* =======================================================
     ENGAGEMENT SUR L'OFFRE RETENUE
     ======================================================= */

  function confirmWinningOffer(
    needId
  ){

    const professionalId =
      getCurrentProfessionalId();


    const commune =
      getCurrentCommune();


    const operation =
      ensureOperationDetails(
        needId,
        getNeedLabel(
          needId,
          "Demande"
        )
      );


    if(
      !operation.winningOfferId
    ){

      alert(
        "Aucune offre collective n'est encore retenue."
      );

      return false;
    }


    operation.confirmedProfessionals =
      operation.confirmedProfessionals &&
      typeof operation.confirmedProfessionals ===
      "object"
        ? operation.confirmedProfessionals
        : {};


    if(
      operation.confirmedProfessionals[
        professionalId
      ]
    ){

      alert(
        "Votre engagement est déjà enregistré."
      );

      return false;
    }


    operation.confirmedProfessionals[
      professionalId
    ] = {

      confirmedAt:
        Date.now(),

      confirmedAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )

    };


    operation.confirmed =
      Object.keys(
        operation.confirmedProfessionals
      ).length;


    saveOperation(
      commune,
      needId,
      operation
    );


    addAudit(
      "engagement_confirme",
      {
        professionalId:
          professionalId,

        needId:
          needId,

        offerId:
          operation.winningOfferId
      }
    );


    window.dispatchEvent(
      new CustomEvent(
        "bociteart:mutualisation-engagement-confirmed",
        {
          detail:{
            professionalId:
              professionalId,

            commune:
              commune,

            needId:
              needId,

            offerId:
              operation.winningOfferId
          }
        }
      )
    );


    return true;
  }


  /* =======================================================
     CONTRAT SIGNÉ
     POINT DE RACCORDEMENT SIGNATURE ÉLECTRONIQUE
     ======================================================= */

  function markContractSigned(
    needId,
    contractReference
  ){

    const professionalId =
      getCurrentProfessionalId();


    const commune =
      getCurrentCommune();


    const operation =
      ensureOperationDetails(
        needId,
        getNeedLabel(
          needId,
          "Demande"
        )
      );


    operation.signedProfessionals =
      operation.signedProfessionals &&
      typeof operation.signedProfessionals ===
      "object"
        ? operation.signedProfessionals
        : {};


    if(
      !operation.signedProfessionals[
        professionalId
      ]
    ){

      operation.signedProfessionals[
        professionalId
      ] = {

        reference:
          String(
            contractReference || ""
          ),

        signedAt:
          Date.now(),

        signedAtFr:
          new Date()
            .toLocaleString(
              "fr-FR"
            )

      };

    }


    operation.signedActive =
      Object.keys(
        operation.signedProfessionals
      ).length;


    operation.contractingStatus =
      "signed";


    saveOperation(
      commune,
      needId,
      operation
    );


    syncOperationThresholds(
      needId,
      getNeedLabel(
        needId,
        "Demande"
      )
    );


    addAudit(
      "contrat_signe",
      {
        professionalId:
          professionalId,

        needId:
          needId,

        reference:
          contractReference || ""
      }
    );


    return true;
  }


  /* =======================================================
     AJOUT DES OFFRES
     POINT DE RACCORDEMENT BO'CITÉART / SERVEUR
     ======================================================= */

  function setOperationOffers(
    needId,
    offers,
    voteDeadline
  ){

    const commune =
      getCurrentCommune();


    const operation =
      ensureOperationDetails(
        needId,
        getNeedLabel(
          needId,
          "Demande"
        )
      );


    operation.offers =
      Array.isArray(
        offers
      )
        ? offers.slice(
            0,
            3
          )
        : [];


    operation.votes = {};


    operation.professionalVotes = {};


    operation.voters = 0;


    operation.voteDeadline =
      String(
        voteDeadline || ""
      );


    operation.supplierConsultationStatus =
      "responses_received";


    operation.votingStatus =
      operation.offers.length
        ? "open"
        : "non_demarre";


    saveOperation(
      commune,
      needId,
      operation
    );


    return operation;
  }


  /* =======================================================
     OUVERTURE DU SUIVI
     ======================================================= */

  function openOperationTracking(
    needId,
    needLabel
  ){

    module.renderModulePage(

      "Payer moins de charges",

      getOperationTrackingHtml(
        needId,
        needLabel
      ),

      {
        showBack:true,
        showFooter:false,

        afterRender:
          function(){

            bindOperationTracking(
              needId,
              needLabel
            );
          }
      }

    );
  }


  /* =======================================================
     BIND SUIVI
     ======================================================= */

  function bindOperationTracking(
    needId,
    needLabel
  ){

    document
      .querySelectorAll(
        ".mutualisationVoteBtn"
      )
      .forEach(function(button){

        button.onclick =
          function(){

            const offerId =
              String(
                button.getAttribute(
                  "data-offer-id"
                ) || ""
              );


            if(!offerId){
              return;
            }


            if(
              registerVote(
                needId,
                offerId
              )
            ){

              alert(
                "Votre vote est enregistré."
              );


              openOperationTracking(
                needId,
                needLabel
              );
            }

          };

      });


    const backButton =
      getElement(
        "mutualisationTrackingBackBtn"
      );


    if(backButton){

      backButton.onclick =
        openMutualisationModule;
    }
  }


  /* =======================================================
     PAGE PRINCIPALE
     MODIFICATION DU BOUTON "VOIR MON SUIVI"
     ======================================================= */

  const previousBindMutualisation =
    bindMutualisation;


  bindMutualisation =
    function(){

      previousBindMutualisation();


      document
        .querySelectorAll(
          ".mutualisationSituationBtn"
        )
        .forEach(function(button){

          button.onclick =
            function(){

              const needId =
                String(
                  button.getAttribute(
                    "data-need-id"
                  ) || ""
                );


              const needLabel =
                String(
                  button.getAttribute(
                    "data-need-label"
                  ) || "Demande"
                );


              const situation =
                getParticipantSituation(
                  getCurrentProfessionalId(),
                  needId
                );


              if(
                situation.status ===
                "interested"
              ){

                openSituation(
                  needId,
                  needLabel
                );

                return;
              }


              openOperationTracking(
                needId,
                needLabel
              );

            };

        });


      const followButton =
        getElement(
          "mutualisationPrivateAccessBtn"
        );


      if(followButton){

        followButton.onclick =
          function(){

            const situations =
              loadUiData()
                .participantSituations;


            const professionalId =
              getCurrentProfessionalId();


            const keys =
              Object.keys(
                situations
              )
              .filter(
                function(key){

                  return key.startsWith(
                    professionalId +
                    "::"
                  );
                }
              );


            if(!keys.length){

              alert(
                "Vous n'avez encore aucune demande suivie."
              );

              return;
            }


            const situation =
              situations[
                keys[0]
              ];


            openOperationTracking(

              situation.needId,

              situation.needLabel ||
              getNeedLabel(
                situation.needId,
                "Demande"
              )

            );

          };
      }

    };


  /* =======================================================
     OUVERTURE PRINCIPALE
     ======================================================= */

  function openMutualisationModule(){

    module.renderModulePage(

      "Payer moins de charges",

      getMutualisationHtml(),

      {
        showBack:true,
        showFooter:false,
        afterRender:
          bindMutualisation
      }

    );
  }


  /* =======================================================
     RACCORDEMENTS
     ======================================================= */

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


  module.mutualisationV2.openOperationTracking =
    openOperationTracking;


  module.mutualisationV2.setOperationOffers =
    setOperationOffers;


  module.mutualisationV2.closeVote =
    closeVote;


  module.mutualisationV2.confirmWinningOffer =
    confirmWinningOffer;


  module.mutualisationV2.markContractSigned =
    markContractSigned;


  module.mutualisationV2.syncOperationThresholds =
    syncOperationThresholds;


  console.log(
    "✅ Payer moins de charges V2 chargé"
  );


})();
