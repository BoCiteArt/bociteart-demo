/* =========================================================
   BLOC 4
   FINANCE SPORT COMPLET

   FICHIER :
   entreprise/finance/bociteart-finance-sport.js

   EFFACER TOUT LE FICHIER ACTUEL
   ET LE REMPLACER PAR TOUT CE BLOC.
   ========================================================= */

/* =========================================================
   ÇA COMMENCE ICI — BO'CITÉART — FINANCE — RACCORD SPORT

   RÈGLES :
   - parrainage club : 50 € HT minimum ;
   - diffusion : 3 jours consécutifs ;
   - 6 commerces maximum simultanément ;
   - réservation : 15 minutes ;
   - mode manuel : +5 minutes renouvelables ;
   - 4 bandes privées de présentation ;
   - une seule bande finale peut être publiée ;
   - aucun texte publicitaire libre ;
   - choix des jeunes respecté ;
   - soutien recherche supplémentaire : 10 € minimum ;
   - paiement confirmé avant diffusion.
   ========================================================= */

(function(){

  "use strict";


  if(
    window.BociteFinanceSport &&
    window.BociteFinanceSport.ready ===
      true
  ){
    return;
  }


  const CONNECTOR_NAME=
    "sport-parrainage";

  const MOUNT_ID=
    "bociteSportFinanceMount";

  const PROFILE_KEY=
    "bociteart_finance_sport_merchant_v3";

  const OPERATIONS_KEY=
    "bociteart_finance_sport_operations_v3";

  const HOLDS_KEY=
    "bociteart_finance_sport_publicity_holds_v1";

  const CAMPAIGNS_KEY=
    "bociteart_finance_sport_publicity_campaigns_v1";

  const CABAS_CONTEXT_KEY=
    "bociteart_finance_sport_last_cabas_v1";


  const MINIMUM_SPONSORSHIP_HT=
    50;

  const MINIMUM_EXTRA_RESEARCH=
    10;

  const PUBLICATION_DAYS=
    3;

  const DAILY_CAPACITY=
    6;

  const HOLD_MINUTES=
    15;

  const MANUAL_EXTENSION_MINUTES=
    5;

  const MAX_LOCAL_OPERATIONS=
    250;

  const SEARCH_SLOT_DAYS=
    90;


  let activeCorrectionDraftId="";
  let financeEventsInstalled=false;
  let countdownTimer=null;
  let activeHold=null;
  let workflowStarted=false;


  function sfCore(){

    return (
      window.BociteFinance ||
      null
    );
  }


  function sfUI(){

    return (
      window.BociteFinanceUI ||
      null
    );
  }


  function sfText(
    value
  ){

    return String(
      value == null
        ? ""
        : value
    ).trim();
  }


  function sfNow(){

    return new Date()
      .toISOString();
  }


  function sfField(
    id
  ){

    return document
      .getElementById(
        id
      );
  }


  function sfValue(
    id
  ){

    const field=
      sfField(
        id
      );

    return sfText(
      field
        ? field.value
        : ""
    );
  }


  function sfDigits(
    value
  ){

    return sfText(
      value
    )
      .replace(
        /\D/g,
        ""
      );
  }


  function sfClone(
    value
  ){

    try{

      return value == null
        ? value
        : JSON.parse(
            JSON.stringify(
              value
            )
          );

    }catch(error){

      return null;
    }
  }


  function sfEscape(
    value
  ){

    return sfText(
      value
    )
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }


  function sfEmailValid(
    value
  ){

    return !!(
      sfText(value) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
          sfText(value)
        )
    );
  }


  function sfMoney(
    value
  ){

    const amount=
      Number(
        value ||
        0
      );

    return Number.isFinite(
      amount
    )
      ? amount.toLocaleString(
          "fr-FR",
          {
            minimumFractionDigits:
              2,
            maximumFractionDigits:
              2
          }
        )
      : "0,00";
  }


  function sfId(
    prefix
  ){

    const head=
      sfText(
        prefix
      ) ||
      "sport-finance";

    if(
      window.crypto &&
      typeof window.crypto.randomUUID ===
        "function"
    ){

      return (
        head +
        "-" +
        window.crypto.randomUUID()
      );
    }

    return (
      head +
      "-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,10)
    );
  }


  function sfRead(
    key,
    fallback
  ){

    try{

      const raw=
        localStorage.getItem(
          key
        );

      return raw
        ? JSON.parse(raw)
        : fallback;

    }catch(error){

      return fallback;
    }
  }


  function sfWrite(
    key,
    value
  ){

    try{

      localStorage.setItem(
        key,
        JSON.stringify(
          value
        )
      );

      return true;

    }catch(error){

      return false;
    }
  }


  /* =========================================================
     CLUB
     ========================================================= */

  function sfClub(){

    let club={};

    if(
      window.BociteSportModule &&
      typeof window.BociteSportModule.getClub ===
        "function"
    ){

      club=
        window.BociteSportModule
          .getClub() ||
        {};
    }


    /*
      Anciennes fiches déjà renseignées
      mais sans clubRef :
      référence locale uniquement
      hors production.
    */

    if(
      club &&
      !sfText(
        club.clubRef
      ) &&
      sfText(
        club.officialName ||
        club.name
      ) &&
      sfText(
        club.commune
      )
    ){

      const config=
        (
          window.BociteSportModule &&
          typeof window.BociteSportModule.getConfig ===
            "function"
        )
          ? (
              window.BociteSportModule
                .getConfig() ||
              {}
            )
          : {};


      if(
        sfText(
          config.mode
        ).toLowerCase() !==
          "production"
      ){

        const base=
          (
            sfText(
              club.officialName ||
              club.name
            ) +
            "-" +
            sfText(
              club.commune
            )
          )
            .toUpperCase()
            .replace(
              /[^A-Z0-9]+/g,
              "-"
            )
            .replace(
              /^-+|-+$/g,
              ""
            )
            .slice(
              0,
              28
            );


        club=
          Object.assign(
            {},
            club,
            {

              clubRef:
                "BCA-SP-LOCAL-" +
                (
                  base ||
                  "CLUB"
                ),

              identityStatus:
                club.identityStatus ||
                "local_pending"
            }
          );
      }
    }


    return club;
  }


  /* =========================================================
     SESSION PRÉSIDENT / COLLABORATEUR
     ========================================================= */

  function sfSession(){

    let source={};


    if(
      window.BociteSportModule &&
      typeof window.BociteSportModule.getSession ===
        "function"
    ){

      source=
        window.BociteSportModule
          .getSession() ||
        {};

    }else{

      source=
        window.bociteartSportSession ||
        {};
    }


    return {

      accountId:
        sfText(
          source.accountId ||
          source.id
        ),

      name:
        sfText(
          source.name
        ),

      role:
        sfText(
          source.role
        ),

      team:
        sfText(
          source.team
        )
    };
  }


  /* =========================================================
     CHOIX DES JEUNES
     ========================================================= */

  function sfYouthOrientation(){

    if(
      window.BociteSportModule &&
      typeof window.BociteSportModule
        .getYouthOrientation ===
          "function"
    ){

      const value=
        window.BociteSportModule
          .getYouthOrientation();

      if(
        value &&
        typeof value ===
          "object"
      ){
        return value;
      }
    }


    const saved=
      sfRead(
        "bociteart_sport_youth_sponsorship_choice_v1",
        null
      );


    if(
      saved &&
      typeof saved ===
        "object"
    ){

      if(
        saved.locked ===
          true
      ){
        return saved;
      }


      if(
        Array.isArray(
          saved.records
        )
      ){

        const session=
          sfSession();

        const team=
          sfText(
            session.team
          )
            .toLocaleLowerCase(
              "fr-FR"
            );

        let record=null;


        if(team){

          record=
            saved.records
              .slice()
              .reverse()
              .find(
                item =>
                  item &&
                  item.locked ===
                    true &&
                  sfText(
                    item.groupName
                  )
                    .toLocaleLowerCase(
                      "fr-FR"
                    ) ===
                    team
              ) ||
            null;
        }


        if(
          !record &&
          sfText(
            saved.activeRecordId
          )
        ){

          record=
            saved.records
              .find(
                item =>
                  sfText(
                    item &&
                    item.id
                  ) ===
                    sfText(
                      saved.activeRecordId
                    )
              ) ||
            null;
        }


        if(record){
          return record;
        }
      }
    }


    return {

      locked:false,

      choice:"",

      associationId:"",

      associationName:"",

      groupName:""
    };
  }


  /* =========================================================
     ASSOCIATIONS VALIDÉES
     ========================================================= */

  function sfAssociations(){

    let source=[];


    if(
      window.BociteSportModule &&
      typeof window.BociteSportModule.getAssociations ===
        "function"
    ){

      const sportSource=
        window.BociteSportModule
          .getAssociations();

      if(
        Array.isArray(
          sportSource
        )
      ){

        source=
          sportSource;
      }
    }


    if(
      !source.length &&
      Array.isArray(
        window.BOCITEART_FINANCE_ASSOCIATIONS
      )
    ){

      source=
        window.BOCITEART_FINANCE_ASSOCIATIONS;
    }


    return source.filter(
      item =>
        item &&
        (
          item.validated ===
            true ||
          item.active ===
            true ||
          item.status ===
            "validated"
        ) &&
        sfText(
          item.id
        ) &&
        sfText(
          item.name ||
          item.legalName ||
          item.label
        )
    );
  }


  function sfAssociationById(
    id
  ){

    return sfAssociations()
      .find(
        item =>
          String(
            item.id
          ) ===
            String(
              id
            )
      ) ||
      null;
  }


  /* =========================================================
     PROFIL COMMERÇANT
     ========================================================= */

  function sfReadSavedProfile(){

    try{

      const parsed=
        JSON.parse(
          sessionStorage.getItem(
            PROFILE_KEY
          ) ||
          "{}"
        );

      return (
        parsed &&
        typeof parsed ===
          "object"
      )
        ? parsed
        : {};

    }catch(error){

      return {};
    }
  }


  function sfReadCabasContext(){

    try{

      const parsed=
        JSON.parse(
          sessionStorage.getItem(
            CABAS_CONTEXT_KEY
          ) ||
          "{}"
        );

      return (
        parsed &&
        typeof parsed ===
          "object"
      )
        ? parsed
        : {};

    }catch(error){

      return {};
    }
  }


  function sfSaveCabasContext(
    value
  ){

    try{

      sessionStorage.setItem(
        CABAS_CONTEXT_KEY,
        JSON.stringify(
          value ||
          {}
        )
      );

    }catch(error){}
  }


  function sfInitialProfile(){

    const shared=
      window
        .BOCITEART_LAST_SPORT_MERCHANT_PROFILE;

    const saved=
      sfReadSavedProfile();

    const cabas=
      sfReadCabasContext();

    const merchant=
      (
        cabas &&
        cabas.merchant &&
        typeof cabas.merchant ===
          "object"
      )
        ? cabas.merchant
        : {};


    return Object.assign(
      {},
      (
        shared &&
        typeof shared ===
          "object"
      )
        ? shared
        : {},
      merchant,
      saved
    );
  }


  function sfReadProfile(){

    return {

      name:
        sfValue(
          "bcfSportMerchantName"
        ).slice(
          0,
          36
        ),

      sirenSiret:
        sfValue(
          "bcfSportMerchantSiret"
        ).slice(
          0,
          20
        ),

      vatNumber:
        sfValue(
          "bcfSportMerchantVat"
        ).slice(
          0,
          20
        ),

      address:
        sfValue(
          "bcfSportMerchantAddress"
        ).slice(
          0,
          42
        ),

      phone:
        sfValue(
          "bcfSportMerchantPhone"
        ).slice(
          0,
          18
        ),

      email:
        sfValue(
          "bcfSportMerchantEmail"
        ).slice(
          0,
          80
        ),

      accountingEmail:
        sfValue(
          "bcfSportMerchantAccountingEmail"
        ).slice(
          0,
          80
        ),

      website:
        sfValue(
          "bcfSportMerchantWebsite"
        ).slice(
          0,
          36
        ),

      updatedAt:
        sfNow()
    };
  }


  function sfSaveProfile(
    profile
  ){

    const clean=
      (
        profile &&
        typeof profile ===
          "object"
      )
        ? profile
        : {};


    try{

      sessionStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(
          clean
        )
      );

    }catch(error){}


    window
      .BOCITEART_LAST_SPORT_MERCHANT_PROFILE=
      Object.assign(
        {},
        clean
      );


    return clean;
  }


  function sfMerchantSnapshot(
    profile
  ){

    return {

      name:
        sfText(
          profile.name
        ),

      sirenSiret:
        sfDigits(
          profile.sirenSiret
        ),

      vatNumber:
        sfText(
          profile.vatNumber
        )
          .replace(
            /\s+/g,
            ""
          )
          .toUpperCase(),

      address:
        sfText(
          profile.address
        ),

      phone:
        sfText(
          profile.phone
        ),

      email:
        sfText(
          profile.email
        ),

      accountingEmail:
        sfText(
          profile.accountingEmail
        ),

      website:
        sfText(
          profile.website
        ),

      identityVersion:
        sfText(
          profile.updatedAt
        )
    };
  }


  function sfClubSnapshot(
    club
  ){

    return {

      clubRef:
        sfText(
          club.clubRef
        ),

      name:
        sfText(
          club.name ||
          club.officialName
        ),

      officialName:
        sfText(
          club.officialName
        ),

      commune:
        sfText(
          club.commune
        ),

      organizationType:
        sfText(
          club.organizationType
        ),

      legalForm:
        sfText(
          club.legalForm
        ),

      sirenSiret:
        sfText(
          club.sirenSiret ||
          club.siret ||
          club.siren
        ),

      rnaNumber:
        sfText(
          club.rnaNumber
        ),

      vatStatus:
        sfText(
          club.vatStatus
        ),

      vatNumber:
        sfText(
          club.vatNumber
        ),

      accountingEmail:
        sfText(
          club.accountingEmail
        )
    };
  }


  function sfAssociationSnapshot(
    association
  ){

    if(!association){
      return null;
    }


    return {

      id:
        sfText(
          association.id
        ),

      name:
        sfText(
          association.name ||
          association.legalName ||
          association.label
        ),

      legalName:
        sfText(
          association.legalName
        ),

      accountingEmail:
        sfText(
          association.accountingEmail
        ),

      validated:
        association.validated ===
          true
    };
  }


  /* =========================================================
     HISTORIQUE LOCAL
     ========================================================= */

  function sfReadOperations(){

    const rows=
      sfRead(
        OPERATIONS_KEY,
        []
      );

    return Array.isArray(
      rows
    )
      ? rows
      : [];
  }


  function sfWriteOperations(
    rows
  ){

    return sfWrite(
      OPERATIONS_KEY,
      Array.isArray(
        rows
      )
        ? rows.slice(
            -MAX_LOCAL_OPERATIONS
          )
        : []
    );
  }


  function sfUpsertOperation(
    data
  ){

    const source=
      (
        data &&
        typeof data ===
          "object"
      )
        ? data
        : {};


    const draftId=
      sfText(
        source.draftId
      );

    const operationRef=
      sfText(
        source.operationRef
      );

    const paymentReference=
      sfText(
        source.paymentReference
      );


    if(
      !draftId &&
      !operationRef &&
      !paymentReference
    ){
      return null;
    }


    const rows=
      sfReadOperations();


    const index=
      rows.findIndex(
        item =>
          (
            draftId &&
            sfText(
              item.draftId
            ) ===
              draftId
          )
          ||
          (
            operationRef &&
            sfText(
              item.operationRef
            ) ===
              operationRef
          )
          ||
          (
            paymentReference &&
            sfText(
              item.paymentReference
            ) ===
              paymentReference
          )
      );


    const next=
      Object.assign(
        {},
        index >= 0
          ? rows[index]
          : {},
        sfClone(
          source
        ) ||
        {},
        {
          updatedAt:
            sfNow()
        }
      );


    if(
      !next.createdAt
    ){

      next.createdAt=
        sfNow();
    }


    if(
      index >= 0
    ){

      rows[index]=
        next;

    }else{

      rows.push(
        next
      );
    }


    sfWriteOperations(
      rows
    );


    return sfClone(
      next
    );
  }


  function sfLatestOperation(){

    const rows=
      sfReadOperations();

    return rows
      .slice()
      .sort(
        (
          a,
          b
        ) =>
          String(
            b.updatedAt ||
            b.createdAt ||
            ""
          )
            .localeCompare(
              String(
                a.updatedAt ||
                a.createdAt ||
                ""
              )
            )
      )[0] ||
      null;
  }


  function sfStatusLabel(
    status
  ){

    const core=
      sfCore();

    if(
      core &&
      typeof core.statusLabel ===
        "function"
    ){

      return core.statusLabel(
        status
      );
    }


    const labels={

      draft:
        "À vérifier",

      confirmed:
        "Confirmé avant paiement",

      payment_pending:
        "Paiement en cours",

      paid:
        "Paiement confirmé",

      refused:
        "Paiement refusé",

      cancelled:
        "Paiement annulé",

      refunded:
        "Paiement remboursé",

      disputed:
        "Paiement contesté"
    };


    return (
      labels[
        sfText(status)
      ] ||
      "État en cours"
    );
  }


  function sfRenderLatestOperation(){

    const target=
      sfField(
        "bcfSportLastOperation"
      );

    if(!target){
      return;
    }


    const operation=
      sfLatestOperation();


    if(!operation){

      target.innerHTML=
        "Aucune opération de parrainage enregistrée sur cet appareil.";

      return;
    }


    target.innerHTML=

      "<strong>" +
      sfEscape(
        sfStatusLabel(
          operation.status
        )
      ) +
      "</strong>" +

      (
        Number(
          operation.amountHT
        ) > 0
          ? " — " +
            sfEscape(
              sfMoney(
                operation.amountHT
              )
            ) +
            " € HT"
          : ""
      ) +

      (
        Number(
          operation.extraResearchAmount
        ) > 0
          ? "<br>Soutien recherche complémentaire : " +
            sfEscape(
              sfMoney(
                operation.extraResearchAmount
              )
            ) +
            " €"
          : ""
      ) +

      (
        operation.publicationStart
          ? "<br>Diffusion : " +
            sfEscape(
              sfFormatDateRange(
                operation.publicationStart,
                operation.publicationEnd
              )
            )
          : ""
      ) +

      (
        operation.paymentReference
          ? "<br>Réf. paiement : " +
            sfEscape(
              operation.paymentReference
            )
          : ""
      ) +

      (
        operation.operationRef
          ? "<br>Réf. dossier : " +
            sfEscape(
              operation.operationRef
            )
          : ""
      );
  }


  /* =========================================================
     DATES / CALENDRIER
     ========================================================= */

  function sfDateToKey(
    date
  ){

    const value=
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

    return (
      value.getFullYear() +
      "-" +
      String(
        value.getMonth() +
        1
      ).padStart(
        2,
        "0"
      ) +
      "-" +
      String(
        value.getDate()
      ).padStart(
        2,
        "0"
      )
    );
  }


  function sfKeyToDate(
    key
  ){

    const parts=
      String(
        key
      )
        .split("-")
        .map(
          Number
        );

    return new Date(
      parts[0],
      (
        parts[1] ||
        1
      ) -
      1,
      parts[2] ||
      1,
      12,
      0,
      0,
      0
    );
  }


  function sfAddDaysKey(
    key,
    days
  ){

    const date=
      sfKeyToDate(
        key
      );

    date.setDate(
      date.getDate() +
      Number(
        days ||
        0
      )
    );

    return sfDateToKey(
      date
    );
  }


  function sfTodayKey(){

    return sfDateToKey(
      new Date()
    );
  }


  function sfDateLabel(
    key
  ){

    if(!key){
      return "";
    }

    return sfKeyToDate(
      key
    )
      .toLocaleDateString(
        "fr-FR",
        {
          day:"2-digit",
          month:"2-digit",
          year:"numeric"
        }
      );
  }


  function sfFormatDateRange(
    start,
    end
  ){

    return (
      "du " +
      sfDateLabel(
        start
      ) +
      " au " +
      sfDateLabel(
        end
      ) +
      " inclus"
    );
  }


  /* =========================================================
     CRÉNEAUX
     ========================================================= */

  function sfReadHolds(){

    const rows=
      sfRead(
        HOLDS_KEY,
        []
      );

    return Array.isArray(
      rows
    )
      ? rows
      : [];
  }


  function sfWriteHolds(
    rows
  ){

    return sfWrite(
      HOLDS_KEY,
      Array.isArray(
        rows
      )
        ? rows
        : []
    );
  }


  function sfReadCampaigns(){

    const rows=
      sfRead(
        CAMPAIGNS_KEY,
        []
      );

    return Array.isArray(
      rows
    )
      ? rows
      : [];
  }


  function sfWriteCampaigns(
    rows
  ){

    return sfWrite(
      CAMPAIGNS_KEY,
      Array.isArray(
        rows
      )
        ? rows
        : []
    );
  }


  function sfCleanupHolds(){

    const now=
      Date.now();

    const rows=
      sfReadHolds()
        .filter(
          item =>
            item &&
            item.status ===
              "held" &&
            Number(
              item.expiresAt ||
              0
            ) >
              now
        );


    sfWriteHolds(
      rows
    );

    return rows;
  }


  function sfOccupancyForDate(
    dateKey,
    excludeHoldId
  ){

    const now=
      Date.now();

    const campaigns=
      sfReadCampaigns()
        .filter(
          item =>
            item &&
            [
              "scheduled",
              "active",
              "paid"
            ].includes(
              sfText(
                item.status
              )
            )
        );

    const holds=
      sfCleanupHolds()
        .filter(
          item =>
            item &&
            item.id !==
              excludeHoldId &&
            Number(
              item.expiresAt ||
              0
            ) >
              now
        );


    let count=0;


    campaigns.forEach(
      item =>{

        if(
          dateKey >=
            item.startDate &&
          dateKey <=
            item.endDate
        ){

          count++;
        }
      }
    );


    holds.forEach(
      item =>{

        if(
          dateKey >=
            item.startDate &&
          dateKey <=
            item.endDate
        ){

          count++;
        }
      }
    );


    return count;
  }


  function sfFindNextSlot(
    fromKey
  ){

    const start=
      fromKey ||
      sfTodayKey();


    for(
      let offset=0;
      offset <
        SEARCH_SLOT_DAYS;
      offset++
    ){

      const candidate=
        sfAddDaysKey(
          start,
          offset
        );


      let available=
        true;


      for(
        let day=0;
        day <
          PUBLICATION_DAYS;
        day++
      ){

        if(
          sfOccupancyForDate(
            sfAddDaysKey(
              candidate,
              day
            ),
            activeHold &&
            activeHold.id
          ) >=
            DAILY_CAPACITY
        ){

          available=
            false;

          break;
        }
      }


      if(available){

        const end=
          sfAddDaysKey(
            candidate,
            PUBLICATION_DAYS -
            1
          );


        const freeSlots=
          Math.min.apply(
            null,
            [
              0,
              1,
              2
            ].map(
              day =>
                Math.max(
                  0,
                  DAILY_CAPACITY -
                  sfOccupancyForDate(
                    sfAddDaysKey(
                      candidate,
                      day
                    ),
                    activeHold &&
                    activeHold.id
                  )
                )
            )
          );


        return {

          startDate:
            candidate,

          endDate:
            end,

          freeSlots:
            freeSlots
        };
      }
    }


    return null;
  }


  /* =========================================================
     SERVEUR
     ========================================================= */

  function sfGetConfig(){

    const core=
      sfCore();

    return (
      core &&
      typeof core.getConfig ===
        "function"
    )
      ? (
          core.getConfig() ||
          {}
        )
      : {};
  }


  function sfIsProduction(){

    return (
      sfText(
        sfGetConfig()
          .mode
      )
        .toLowerCase() ===
      "production"
    );
  }


  function sfApiBase(){

    return sfText(
      sfGetConfig()
        .apiBaseUrl
    )
      .replace(
        /\/$/,
        ""
      );
  }


  async function sfServerJson(
    path,
    payload
  ){

    const base=
      sfApiBase();

    if(!base){

      throw new Error(
        "Le serveur sécurisé Finance n'est pas configuré."
      );
    }


    const response=
      await fetch(
        base +
        path,
        {

          method:
            "POST",

          credentials:
            "include",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              payload ||
              {}
            )
        }
      );


    if(!response.ok){

      throw new Error(
        "Service momentanément indisponible."
      );
    }


    return response.json();
  }


  /* =========================================================
     RÉSERVATION 15 MINUTES
     ========================================================= */

  async function sfReserveSlot(){

    if(
      activeHold &&
      Number(
        activeHold.expiresAt
      ) >
        Date.now()
    ){

      return activeHold;
    }


    const slot=
      sfFindNextSlot(
        sfTodayKey()
      );


    if(!slot){

      throw new Error(
        "Aucun créneau n'est actuellement disponible."
      );
    }


    if(
      sfIsProduction()
    ){

      const result=
        await sfServerJson(
          "/sport-publicity/hold",
          {

            clubRef:
              sfText(
                sfClub()
                  .clubRef
              ),

            requestedStart:
              slot.startDate,

            durationDays:
              PUBLICATION_DAYS,

            holdMinutes:
              HOLD_MINUTES,

            capacity:
              DAILY_CAPACITY
          }
        );


      if(
        !result ||
        result.ok !==
          true ||
        !result.holdId
      ){

        throw new Error(
          "Le créneau n'a pas pu être réservé."
        );
      }


      activeHold={

        id:
          sfText(
            result.holdId
          ),

        startDate:
          sfText(
            result.startDate
          ),

        endDate:
          sfText(
            result.endDate
          ),

        expiresAt:
          Number(
            result.expiresAt
          ),

        status:
          "held",

        manual:false
      };


      return activeHold;
    }


    const hold={

      id:
        sfId(
          "BCA-SP-HOLD"
        ),

      startDate:
        slot.startDate,

      endDate:
        slot.endDate,

      expiresAt:
        Date.now() +
        HOLD_MINUTES *
        60 *
        1000,

      status:
        "held",

      manual:false,

      createdAt:
        Date.now()
    };


    const rows=
      sfCleanupHolds();

    rows.push(
      hold
    );

    sfWriteHolds(
      rows
    );

    activeHold=
      hold;


    return hold;
  }


  /* =========================================================
     MODE MANUEL
     +5 MINUTES RENOUVELABLES
     ========================================================= */

  async function sfExtendHold(){

    if(
      !activeHold ||
      Number(
        activeHold.expiresAt ||
        0
      ) <=
        Date.now()
    ){

      throw new Error(
        "La réservation a expiré."
      );
    }


    if(
      !activeHold.manual
    ){

      throw new Error(
        "La prolongation est réservée au mode manuel."
      );
    }


    if(
      sfIsProduction()
    ){

      const result=
        await sfServerJson(
          "/sport-publicity/hold/extend",
          {

            holdId:
              activeHold.id,

            minutes:
              MANUAL_EXTENSION_MINUTES
          }
        );


      if(
        !result ||
        result.ok !==
          true
      ){

        throw new Error(
          "La réservation n'a pas pu être prolongée."
        );
      }


      activeHold.expiresAt=
        Number(
          result.expiresAt
        );

    }else{

      activeHold.expiresAt=
        Math.max(
          Date.now(),
          Number(
            activeHold.expiresAt
          )
        ) +
        MANUAL_EXTENSION_MINUTES *
        60 *
        1000;


      const rows=
        sfCleanupHolds();

      const index=
        rows.findIndex(
          item =>
            item.id ===
              activeHold.id
        );


      if(
        index >=
          0
      ){

        rows[index]=
          sfClone(
            activeHold
          );

      }else{

        rows.push(
          sfClone(
            activeHold
          )
        );
      }


      sfWriteHolds(
        rows
      );
    }


    sfRenderHold();

    return activeHold;
  }


  async function sfReleaseHold(
    reason
  ){

    if(!activeHold){
      return;
    }


    const id=
      activeHold.id;


    if(
      sfIsProduction()
    ){

      try{

        await sfServerJson(
          "/sport-publicity/hold/release",
          {
            holdId:
              id,
            reason:
              sfText(
                reason
              )
          }
        );

      }catch(error){}

    }else{

      sfWriteHolds(
        sfCleanupHolds()
          .filter(
            item =>
              item.id !==
                id
          )
      );
    }


    activeHold=
      null;

    sfStopCountdown();

    sfRenderAvailability();
  }


  function sfConfirmCampaignFromHold(
    operation
  ){

    if(
      !activeHold ||
      !operation
    ){
      return;
    }


    if(
      !sfIsProduction()
    ){

      const rows=
        sfReadCampaigns();


      const index=
        rows.findIndex(
          item =>
            sfText(
              item.operationRef
            ) ===
              sfText(
                operation.operationRef
              )
        );


      const campaign={

        id:
          sfId(
            "BCA-SP-CAMPAIGN"
          ),

        operationRef:
          sfText(
            operation.operationRef
          ),

        startDate:
          activeHold.startDate,

        endDate:
          activeHold.endDate,

        status:
          "paid",

        publicText:
          sfText(
            operation.publicityText
          ),

        createdAt:
          Date.now()
      };


      if(
        index >=
          0
      ){

        rows[index]=
          Object.assign(
            {},
            rows[index],
            campaign
          );

      }else{

        rows.push(
          campaign
        );
      }


      sfWriteCampaigns(
        rows
      );


      sfWriteHolds(
        sfCleanupHolds()
          .filter(
            item =>
              item.id !==
                activeHold.id
          )
      );
    }


    activeHold=
      null;

    sfStopCountdown();
  }


  /* =========================================================
     DISPONIBILITÉ VISIBLE AU CLUB
     ========================================================= */

  function sfAvailabilitySummary(){

    const slot=
      sfFindNextSlot(
        sfTodayKey()
      );


    if(!slot){

      return {

        label:
          "Prochain créneau à confirmer",

        detail:
          "Aucun créneau proche n'est disponible pour le moment.",

        slot:null
      };
    }


    const offset=
      Math.round(
        (
          sfKeyToDate(
            slot.startDate
          ) -
          sfKeyToDate(
            sfTodayKey()
          )
        ) /
        (
          24 *
          3600 *
          1000
        )
      );


    const label=
      offset <=
        3
        ? (
            slot.freeSlots +
            " créneau" +
            (
              slot.freeSlots >
                1
                ? "x"
                : ""
            ) +
            " proche" +
            (
              slot.freeSlots >
                1
                ? "s"
                : ""
            ) +
            " disponible" +
            (
              slot.freeSlots >
                1
                ? "s"
                : ""
            )
          )
        : "Prochain créneau disponible";


    return {

      label:
        label,

      detail:
        sfFormatDateRange(
          slot.startDate,
          slot.endDate
        ),

      slot:
        slot
    };
  }


  function sfRenderAvailability(){

    const target=
      sfField(
        "bcfSportAvailability"
      );

    if(!target){
      return;
    }


    const info=
      sfAvailabilitySummary();


    target.innerHTML=

      "<strong>" +
      sfEscape(
        info.label
      ) +
      "</strong>" +

      "<br>" +

      sfEscape(
        info.detail
      ) +

      "<br>" +

      '<span style="font-weight:400;">' +
      "6 commerces maximum diffusés simultanément. " +
      "L'échange Cabas reste indépendant de cette disponibilité." +
      "</span>";
  }


  /* =========================================================
     COMPTE À REBOURS
     ========================================================= */

  function sfStopCountdown(){

    if(countdownTimer){

      clearInterval(
        countdownTimer
      );

      countdownTimer=
        null;
    }
  }


  function sfStartCountdown(){

    sfStopCountdown();

    sfRenderHold();

    countdownTimer=
      setInterval(
        sfRenderHold,
        1000
      );
  }


  function sfRenderHold(){

    const target=
      sfField(
        "bcfSportHoldStatus"
      );

    const extend=
      sfField(
        "bcfSportExtendHold"
      );


    if(!target){
      return;
    }


    if(!activeHold){

      target.textContent=
        "Aucun créneau réservé.";

      if(extend){
        extend.style.display=
          "none";
      }

      return;
    }


    const left=
      Math.max(
        0,
        Number(
          activeHold.expiresAt ||
          0
        ) -
        Date.now()
      );


    if(
      left <=
        0
    ){

      target.textContent=
        "La réservation du créneau a expiré. Recommencez pour obtenir le prochain créneau disponible.";

      if(extend){

        extend.style.display=
          "none";
      }


      sfReleaseHold(
        "expired"
      );

      return;
    }


    const minutes=
      Math.floor(
        left /
        60000
      );

    const seconds=
      Math.floor(
        (
          left %
          60000
        ) /
        1000
      );


    target.innerHTML=

      "Créneau réservé : <strong>" +
      sfEscape(
        sfFormatDateRange(
          activeHold.startDate,
          activeHold.endDate
        )
      ) +
      "</strong>" +

      "<br>" +

      "Temps restant : <strong>" +
      String(
        minutes
      ).padStart(
        2,
        "0"
      ) +
      ":" +
      String(
        seconds
      ).padStart(
        2,
        "0"
      ) +
      "</strong>";


    if(extend){

      const show=
        activeHold.manual ===
          true &&
        left <=
          2 *
          60 *
          1000;


      extend.style.display=
        show
          ? "block"
          : "none";
    }
  }


  /* =========================================================
     4 CHOIX
     ========================================================= */

  function sfOrientationLabel(
    orientation
  ){

    if(
      !orientation ||
      orientation.locked !==
        true
    ){

      return (
        "Orientation des jeunes non encore enregistrée"
      );
    }


    return orientation.choice ===
      "club_research"
      ? "50 % pour le club / 50 % pour la recherche médicale"
      : "100 % pour le club";
  }


  function sfAllowedChoiceNumbers(
    orientation
  ){

    if(
      !orientation ||
      orientation.locked !==
        true
    ){
      return [];
    }


    return orientation.choice ===
      "club_research"
      ? [
          2,
          3
        ]
      : [
          1,
          4
        ];
  }


  function sfManualMode(){

    const field=
      sfField(
        "bcfSportManualMode"
      );

    return !!(
      field &&
      field.checked
    );
  }


  function sfSelectedChoice(){

    const field=
      document.querySelector(
        'input[name="bcfSportPublicityChoice"]:checked'
      );

    return Number(
      field
        ? field.value
        : 0
    );
  }


  function sfAmountHT(){

    const amount=
      Number(
        sfValue(
          "bcfSportAmountHT"
        )
      );

    return (
      Math.round(
        amount *
        100
      ) /
      100
    );
  }


  function sfExtraResearch(){

    const amount=
      Number(
        sfValue(
          "bcfSportExtraResearch"
        )
      );

    return (
      Math.round(
        amount *
        100
      ) /
      100
    );
  }


  function sfContactTail(
    profile
  ){

    return [
      sfText(
        profile.address
      ),
      sfText(
        profile.phone
      ),
      sfText(
        profile.website
      )
    ].join(
      " • "
    );
  }


  function sfSelectedResearchAssociation(
    orientation,
    choice
  ){

    if(
      orientation &&
      orientation.choice ===
        "club_research"
    ){

      const id=
        sfText(
          orientation.associationId
        );


      const found=
        id
          ? sfAssociationById(
              id
            )
          : null;


      if(found){
        return found;
      }


      if(
        sfText(
          orientation.associationName
        )
      ){

        return {

          id:
            id ||
            "research",

          name:
            sfText(
              orientation.associationName
            )
              .slice(
                0,
                40
              ),

          validated:true
        };
      }
    }


    if(
      Number(
        choice
      ) ===
        4
    ){

      const selectedId=
        sfValue(
          "bcfSportMerchantResearchAssociation"
        );


      const selected=
        selectedId
          ? sfAssociationById(
              selectedId
            )
          : null;


      if(selected){
        return selected;
      }
    }


    return null;
  }


  function sfAssociationName(
    orientation,
    choice
  ){

    const association=
      sfSelectedResearchAssociation(
        orientation,
        choice
      );

    return association
      ? sfText(
          association.name ||
          association.legalName ||
          association.label
        )
          .slice(
            0,
            40
          )
      : "";
  }


  function sfBonusPrefix(
    choice,
    amountHT,
    extra
  ){

    if(
      ![
        3,
        4
      ].includes(
        Number(
          choice
        )
      ) ||
      Number(
        extra
      ) <
        MINIMUM_EXTRA_RESEARCH
    ){

      return "";
    }


    const clubShare=
      Number(
        choice
      ) ===
        3
        ? Number(
            amountHT
          ) /
          2
        : Number(
            amountHT
          );


    if(
      Number(
        extra
      ) >=
        clubShare &&
      clubShare >
        0
    ){

      return (
        "🌿 GRAND MERCI À CE COMMERCE SOLIDAIRE 🌿 — "
      );
    }


    return (
      "🌿 SOUTIEN RECHERCHE — "
    );
  }


  function sfPlaceholder(
    label
  ){

    return (
      '<span class="bcfMissing">[' +
      sfEscape(
        label
      ) +
      "]</span>"
    );
  }


  function sfBandData(
    choice,
    profile,
    club,
    orientation,
    amountHT,
    extra
  ){

    const merchant=
      sfText(
        profile.name
      )
        .slice(
          0,
          36
        );

    const clubName=
      sfText(
        club.name ||
        club.officialName
      )
        .slice(
          0,
          40
        );

    const association=
      sfAssociationName(
        orientation,
        choice
      );

    const tail=
      sfContactTail(
        profile
      );


    const missing=[];


    if(!merchant){

      missing.push(
        "nom du commerce"
      );
    }


    if(!clubName){

      missing.push(
        "club"
      );
    }


    if(
      !sfText(
        profile.address
      )
    ){

      missing.push(
        "adresse"
      );
    }


    if(
      !sfText(
        profile.phone
      )
    ){

      missing.push(
        "téléphone"
      );
    }


    if(
      !sfText(
        profile.website
      )
    ){

      missing.push(
        "site"
      );
    }


    if(
      [
        2,
        3,
        4
      ].includes(
        Number(
          choice
        )
      ) &&
      !association
    ){

      missing.push(
        "association"
      );
    }


    const merchantHtml=
      merchant
        ? sfEscape(
            merchant
          )
        : sfPlaceholder(
            "NOM COMMERCE"
          );


    const clubHtml=
      clubName
        ? sfEscape(
            clubName
          )
        : sfPlaceholder(
            "CLUB"
          );


    const associationHtml=
      association
        ? sfEscape(
            association
          )
        : sfPlaceholder(
            "ASSOCIATION"
          );


    const addressHtml=
      sfText(
        profile.address
      )
        ? sfEscape(
            profile.address
          )
        : sfPlaceholder(
            "ADRESSE"
          );


    const phoneHtml=
      sfText(
        profile.phone
      )
        ? sfEscape(
            profile.phone
          )
        : sfPlaceholder(
            "TÉL."
          );


    const websiteHtml=
      sfText(
        profile.website
      )
        ? sfEscape(
            profile.website
          )
        : sfPlaceholder(
            "SITE"
          );


    const tailHtml=
      addressHtml +
      " • " +
      phoneHtml +
      " • " +
      websiteHtml;


    let html="";
    let text="";


    const prefix=
      sfBonusPrefix(
        choice,
        amountHT,
        extra
      );


    if(
      Number(
        choice
      ) ===
        1
    ){

      html=
        "Le club " +
        clubHtml +
        " a le <strong>soutien total</strong> de " +
        merchantHtml +
        " — " +
        tailHtml;


      text=
        "Le club " +
        clubName +
        " a le soutien total de " +
        merchant +
        " — " +
        tail;
    }


    if(
      Number(
        choice
      ) ===
        2
    ){

      html=
        "Le club " +
        clubHtml +
        " et " +
        associationHtml +
        " ont le <strong>soutien</strong> de " +
        merchantHtml +
        " — " +
        tailHtml;


      text=
        "Le club " +
        clubName +
        " et " +
        association +
        " ont le soutien de " +
        merchant +
        " — " +
        tail;
    }


    if(
      Number(
        choice
      ) ===
        3
    ){

      html=
        sfEscape(
          prefix
        ) +
        merchantHtml +
        " soutient le club " +
        clubHtml +
        " et <strong>renforce</strong> son soutien à " +
        associationHtml +
        " — " +
        tailHtml;


      text=
        prefix +
        merchant +
        " soutient le club " +
        clubName +
        " et renforce son soutien à " +
        association +
        " — " +
        tail;
    }


    if(
      Number(
        choice
      ) ===
        4
    ){

      html=
        sfEscape(
          prefix
        ) +
        merchantHtml +
        " soutient le club " +
        clubHtml +
        " et <strong>choisit aussi</strong> de soutenir " +
        associationHtml +
        " — " +
        tailHtml;


      text=
        prefix +
        merchant +
        " soutient le club " +
        clubName +
        " et choisit aussi de soutenir " +
        association +
        " — " +
        tail;
    }


    return {

      choice:
        Number(
          choice
        ),

      html:
        html,

      text:
        sfText(
          text
        )
          .replace(
            /\s+/g,
            " "
          ),

      missing:
        Array.from(
          new Set(
            missing
          )
        )
    };
  }


  function sfPreviewBands(){

    const target=
      sfField(
        "bcfSportBands"
      );

    if(!target){
      return;
    }


    const profile=
      sfReadProfile();

    const club=
      sfClub();

    const orientation=
      sfYouthOrientation();

    const allowed=
      sfAllowedChoiceNumbers(
        orientation
      );

    const amount=
      sfAmountHT();

    const extra=
      sfExtraResearch();


    target.innerHTML=
      [
        1,
        2,
        3,
        4
      ]
        .map(
          number =>{

            const band=
              sfBandData(
                number,
                profile,
                club,
                orientation,
                amount,
                extra
              );


            const selectable=
              allowed.includes(
                number
              );


            return `

              <div
                class="
                  bcfChoiceCard
                  ${
                    selectable
                      ? ""
                      : "bcfChoiceDisabled"
                  }
                "
              >

                <label class="sportCheck">

                  <input
                    type="radio"
                    name="bcfSportPublicityChoice"
                    value="${number}"
                    ${
                      selectable
                        ? ""
                        : "disabled"
                    }
                  >

                  <span>

                    <strong>
                      CHOIX ${number}
                    </strong>

                    ${
                      selectable
                        ? ""
                        : " — exemple non sélectionnable pour l’orientation enregistrée par les jeunes"
                    }

                  </span>

                </label>

                <div class="bcfTicker">

                  <div class="bcfTickerMove">
                    ${band.html}
                  </div>

                </div>

              </div>
            `;
          }
        )
        .join("");


    target
      .querySelectorAll(
        'input[name="bcfSportPublicityChoice"]'
      )
      .forEach(
        radio =>{

          radio.addEventListener(
            "change",
            sfUpdateChoiceUi
          );
        }
      );


    sfUpdateChoiceUi();
  }


  function sfUpdateChoiceUi(){

    const choice=
      sfSelectedChoice();

    const box=
      sfField(
        "bcfSportExtraResearchBox"
      );


    if(box){

      box.style.display=
        [
          3,
          4
        ].includes(
          choice
        )
          ? "block"
          : "none";
    }


    sfRenderFinalPreview();
  }


  function sfRenderFinalPreview(){

    const target=
      sfField(
        "bcfSportFinalPreview"
      );

    if(!target){
      return;
    }


    const choice=
      sfSelectedChoice();


    if(!choice){

      target.innerHTML=
        "Choisissez l’une des formules disponibles.";

      return;
    }


    const band=
      sfBandData(
        choice,
        sfReadProfile(),
        sfClub(),
        sfYouthOrientation(),
        sfAmountHT(),
        sfExtraResearch()
      );


    target.innerHTML=

      '<div class="bcfTicker">' +
      '<div class="bcfTickerMove">' +
      band.html +
      "</div>" +
      "</div>" +

      (
        band.missing.length
          ? '<div class="sportStatus" style="margin-top:8px;color:#8e001a;">' +
            "À compléter : " +
            sfEscape(
              band.missing.join(
                ", "
              )
            ) +
            ".</div>"
          : ""
      );
  }


  /* =========================================================
     ÉTAT / VALIDATION
     ========================================================= */

  function sfSetStatus(
    message,
    state
  ){

    const target=
      sfField(
        "bcfSportStatus"
      );

    if(!target){
      return;
    }


    target.textContent=
      sfText(
        message
      );


    target.style.color=
      state ===
        "error"
        ? "#7f1a1d"
        : "#111111";


    target.style.borderColor=
      state ===
        "error"
        ? "#a51e22"
        : "";
  }


  function sfValidate(
    profile,
    club,
    orientation,
    choice,
    amountHT,
    extra
  ){

    const errors=[];


    if(
      !sfText(
        club.clubRef
      )
    ){

      errors.push(
        "La fiche d’identité du club doit être enregistrée."
      );
    }


    if(
      !orientation ||
      orientation.locked !==
        true
    ){

      errors.push(
        "Le choix des jeunes doit être enregistré avant de présenter la visibilité au commerçant."
      );
    }


    if(
      !sfAllowedChoiceNumbers(
        orientation
      )
        .includes(
          Number(
            choice
          )
        )
    ){

      errors.push(
        "Choisissez une formule compatible avec l’orientation enregistrée par les jeunes."
      );
    }


    if(!profile.name){

      errors.push(
        "Le nom ou l’enseigne du commerçant est obligatoire."
      );
    }


    const digits=
      sfDigits(
        profile.sirenSiret
      );


    if(!digits){

      errors.push(
        "Le SIREN ou SIRET du commerçant est obligatoire."
      );

    }else if(
      digits.length !==
        9 &&
      digits.length !==
        14
    ){

      errors.push(
        "Le SIREN ou SIRET doit comporter 9 ou 14 chiffres."
      );
    }


    if(!profile.address){

      errors.push(
        "L’adresse professionnelle du commerçant est obligatoire."
      );
    }


    if(!profile.phone){

      errors.push(
        "Le téléphone du commerce est obligatoire pour la bande."
      );
    }


    if(!profile.website){

      errors.push(
        "Le site du commerce est obligatoire pour la bande."
      );
    }


    if(
      !profile.accountingEmail
    ){

      errors.push(
        "L’adresse électronique comptable est obligatoire."
      );

    }else if(
      !sfEmailValid(
        profile.accountingEmail
      )
    ){

      errors.push(
        "L’adresse électronique comptable n’est pas valide."
      );
    }


    if(
      profile.email &&
      !sfEmailValid(
        profile.email
      )
    ){

      errors.push(
        "L’adresse électronique du commerçant n’est pas valide."
      );
    }


    if(
      !Number.isFinite(
        amountHT
      ) ||
      amountHT <
        MINIMUM_SPONSORSHIP_HT
    ){

      errors.push(
        "Le parrainage du club est de 50 € HT minimum."
      );
    }


    if(
      [
        3,
        4
      ].includes(
        Number(
          choice
        )
      ) &&
      (
        !Number.isFinite(
          extra
        ) ||
        extra <
          MINIMUM_EXTRA_RESEARCH
      )
    ){

      errors.push(
        "Le soutien complémentaire à la recherche est de 10 € minimum."
      );
    }


    const band=
      sfBandData(
        choice,
        profile,
        club,
        orientation,
        amountHT,
        extra
      );


    if(
      band.missing.length
    ){

      errors.push(
        "Complétez les informations encore manquantes dans les bandes."
      );
    }


    return errors;
  }


  /* =========================================================
     RÈGLES TRANSMISES AU CŒUR FINANCE
     ========================================================= */

  function sfPolicies(){

    return {

      payment:{

        activationOnlyAfterConfirmedPayment:
          true,

        finalConfirmationSource:
          "server_psp",

        clientConfirmationNotSufficient:
          true,

        idempotencyRequired:
          true,

        cardPaymentViaPsp:
          true,

        cardNetworksExpected:[
          "visa",
          "mastercard"
        ],

        dynamicPaymentQrServerSide:
          true,

        noBankSecretInBrowser:
          true
      },


      publication:{

        durationDays:
          PUBLICATION_DAYS,

        maxConcurrentPerDay:
          DAILY_CAPACITY,

        holdMinutes:
          HOLD_MINUTES,

        manualExtensionMinutes:
          MANUAL_EXTENSION_MINUTES,

        startOnlyAfterConfirmedPayment:
          true,

        automaticServerActivationAfterPaid:
          true,

        clientCannotActivatePublication:
          true
      },


      publicity:{

        templatesLocked:
          true,

        freeTextForbidden:
          true,

        privateFourPreviewTemplates:
          true,

        onlySelectedFinalMessageCanPublish:
          true,

        youthOrientationMustBeRespected:
          true,

        manualFallbackUsesSameTemplates:
          true
      },


      accounting:{

        finalProcessing:
          "server_only",

        reconciliationRequired:
          true,

        providerFeesRecorded:
          true,

        beneficiarySettlementServerSide:
          true,

        settlementAfterConfirmedPayment:
          true,

        noClientFinalAccounting:
          true,

        noPublicInternalFormula:
          true
      },


      documents:{

        merchantDocumentRequired:
          true,

        clubSponsorshipDocumentRequired:
          true,

        associationDocumentAccordingToEligibility:
          true,

        bociteartDocumentAccordingToActualService:
          true,

        duplicateBillingForbidden:
          true,

        electronicInvoicingCompatibilityRequired:
          true,

        accountingExportRequired:
          true,

        archiveRequired:
          true
      },


      tax:{

        vatTreatment:
          "server_validate_actual_status",

        fiscalQualification:
          "server_validate_actual_operation",

        associationTaxReceipt:
          "only_if_legally_eligible",

        noAutomaticTaxReceipt:
          true
      },


      audit:{

        agent1Required:
          true,

        agent2IndependentControlRequired:
          true,

        securityLogRequired:
          true,

        serverRevalidationRequired:
          true
      }
    };
  }


  /* =========================================================
     OUVERTURE DU PARCOURS
     ========================================================= */

  async function sfBeginWorkflow(){

    if(
      workflowStarted &&
      activeHold &&
      Number(
        activeHold.expiresAt
      ) >
        Date.now()
    ){
      return;
    }


    const orientation=
      sfYouthOrientation();


    if(
      !orientation ||
      orientation.locked !==
        true
    ){

      sfSetStatus(
        "Le choix des jeunes doit d’abord être enregistré dans l’espace Sport.",
        "error"
      );

      return;
    }


    try{

      activeHold=
        await sfReserveSlot();

      workflowStarted=
        true;


      const body=
        sfField(
          "bcfSportWorkflow"
        );


      if(body){

        body.style.display=
          "block";
      }


      sfStartCountdown();

      sfPreviewBands();

      sfSetStatus(
        "Le créneau est réservé pendant votre préparation.",
        "success"
      );


      const first=
        sfField(
          "bcfSportMerchantName"
        );


      if(first){

        first.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });
      }

    }catch(error){

      sfSetStatus(
        error.message ||
        "Le créneau n’a pas pu être réservé.",
        "error"
      );
    }
  }


  function sfToggleManual(){

    const manual=
      sfManualMode();


    if(activeHold){

      activeHold.manual=
        manual;
    }


    const notice=
      sfField(
        "bcfSportManualNotice"
      );


    if(notice){

      notice.style.display=
        manual
          ? "block"
          : "none";
    }


    sfRenderHold();

    sfPreviewBands();
  }


  function sfBindLiveFields(){

    [
      "bcfSportMerchantName",
      "bcfSportMerchantAddress",
      "bcfSportMerchantPhone",
      "bcfSportMerchantWebsite",
      "bcfSportAmountHT",
      "bcfSportExtraResearch"
    ]
      .forEach(
        id =>{

          const field=
            sfField(
              id
            );


          if(field){

            field.addEventListener(
              "input",
              ()=>{

                sfPreviewBands();

                sfRenderFinalPreview();
              }
            );
          }
        }
      );


    const association=
      sfField(
        "bcfSportMerchantResearchAssociation"
      );


    if(association){

      association.addEventListener(
        "change",
        ()=>{

          sfPreviewBands();

          sfRenderFinalPreview();
        }
      );
    }
  }


  /* =========================================================
     RÉCAPITULATIF AVANT PAIEMENT
     ========================================================= */

  async function sfOpenReview(){

    const core=
      sfCore();

    const ui=
      sfUI();


    if(
      !core ||
      !ui ||
      ui.ready !==
        true
    ){

      sfSetStatus(
        "Le service Finance est momentanément indisponible.",
        "error"
      );

      return;
    }


    if(
      !activeHold ||
      Number(
        activeHold.expiresAt ||
        0
      ) <=
        Date.now()
    ){

      sfSetStatus(
        "La réservation du créneau a expiré. Recommencez pour obtenir le prochain créneau disponible.",
        "error"
      );

      return;
    }


    const profile=
      sfSaveProfile(
        sfReadProfile()
      );

    const club=
      sfClub();

    const orientation=
      sfYouthOrientation();

    const choice=
      sfSelectedChoice();

    const amountHT=
      sfAmountHT();

    const extra=
      sfExtraResearch();

    const representative=
      sfSession();


    if(
      !representative.accountId
    ){

      sfSetStatus(
        "L’utilisateur Sport doit être identifié avant de présenter ce parrainage.",
        "error"
      );

      return;
    }


    const errors=
      sfValidate(
        profile,
        club,
        orientation,
        choice,
        amountHT,
        extra
      );


    if(
      errors.length
    ){

      sfSetStatus(
        errors[0],
        "error"
      );

      return;
    }


    if(
      !window.confirm(
        "Le commerçant confirme que la phrase affichée correspond bien à son choix et accepte les dates de diffusion indiquées ?"
      )
    ){
      return;
    }


    const association=
      sfSelectedResearchAssociation(
        orientation,
        choice
      );


    const finalBand=
      sfBandData(
        choice,
        profile,
        club,
        orientation,
        amountHT,
        extra
      );


    const operationRef=
      "BCA-SPORT-PARR-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,7)
        .toUpperCase();


    const clubSnapshot=
      sfClubSnapshot(
        club
      );

    const merchantSnapshot=
      sfMerchantSnapshot(
        profile
      );

    const associationSnapshot=
      sfAssociationSnapshot(
        association
      );


    const allocationCode=
      [
        2,
        3
      ].includes(
        choice
      )
        ? "HALF_HALF"
        : "ALL_CLUB";


    const totalToPay=
      Math.round(
        (
          amountHT +
          (
            [
              3,
              4
            ].includes(
              choice
            )
              ? extra
              : 0
          )
        ) *
        100
      ) /
      100;


    ui.open({

      connectorName:
        CONNECTOR_NAME,

      flowType:
        "sport_local_sponsorship",

      reviewTitle:
        "Récapitulatif avant paiement",

      operationRef:
        operationRef,

      payerRef:
        sfDigits(
          profile.sirenSiret
        ),

      payerSnapshot:
        merchantSnapshot,

      merchantSnapshot:
        merchantSnapshot,

      representativeRef:
        representative.accountId,

      representative:
        representative,

      presentedAt:
        sfNow(),

      identityVersion:
        profile.updatedAt,

      clubRef:
        clubSnapshot.clubRef,

      clubSnapshot:
        clubSnapshot,

      youthOrientation:
        sfClone(
          orientation
        ),

      publicityChoice:
        choice,

      publicityText:
        finalBand.text,

      publicationStart:
        activeHold.startDate,

      publicationEnd:
        activeHold.endDate,

      slotHoldId:
        activeHold.id,

      amountHT:
        amountHT,

      extraResearchAmount:
        [
          3,
          4
        ].includes(
          choice
        )
          ? extra
          : 0,

      totalPaymentAmount:
        totalToPay,

      allocationCode:
        allocationCode,

      associationId:
        associationSnapshot
          ? associationSnapshot.id
          : "",

      associationSnapshot:
        associationSnapshot,

      beneficiaryRefs:[
        clubSnapshot.clubRef,
        associationSnapshot
          ? associationSnapshot.id
          : ""
      ].filter(
        Boolean
      ),

      publicationDays:
        PUBLICATION_DAYS,

      paymentChannel:
        "card_psp",

      paymentPresentation:{
        cardNetworks:[
          "visa",
          "mastercard"
        ],
        dynamicQr:true
      },

      financePolicies:
        sfPolicies(),

      previewLines:[
        finalBand.text,
        "Diffusion " +
        sfFormatDateRange(
          activeHold.startDate,
          activeHold.endDate
        )
      ],

      previewText:
        finalBand.text
    });


    sfUpsertOperation({

      operationRef:
        operationRef,

      status:
        "draft",

      amountHT:
        amountHT,

      extraResearchAmount:
        [
          3,
          4
        ].includes(
          choice
        )
          ? extra
          : 0,

      totalPaymentAmount:
        totalToPay,

      allocationCode:
        allocationCode,

      clubRef:
        clubSnapshot.clubRef,

      clubName:
        clubSnapshot.name ||
        clubSnapshot.officialName,

      payerRef:
        sfDigits(
          profile.sirenSiret
        ),

      merchantName:
        profile.name,

      representativeRef:
        representative.accountId,

      representativeName:
        representative.name,

      associationId:
        associationSnapshot
          ? associationSnapshot.id
          : "",

      associationName:
        associationSnapshot
          ? associationSnapshot.name
          : "",

      publicationDays:
        PUBLICATION_DAYS,

      publicationStart:
        activeHold.startDate,

      publicationEnd:
        activeHold.endDate,

      publicityChoice:
        choice,

      publicityText:
        finalBand.text,

      slotHoldId:
        activeHold.id
    });


    sfRenderLatestOperation();
  }


  /* =========================================================
     CORRECTION IDENTITÉ
     ========================================================= */

  function sfEditIdentity(
    context
  ){

    activeCorrectionDraftId=
      sfText(
        context &&
        context.draftId
      );


    const first=
      sfField(
        "bcfSportMerchantName"
      );

    const button=
      sfField(
        "bcfSportReturnToReview"
      );

    const notice=
      sfField(
        "bcfSportCorrectionNotice"
      );


    if(notice){

      notice.style.display=
        "block";
    }


    if(button){

      button.style.display=
        "block";
    }


    if(first){

      first.scrollIntoView({
        behavior:"smooth",
        block:"center"
      });

      setTimeout(
        ()=>first.focus(),
        300
      );
    }
  }


  function sfReturnToReview(){

    const ui=
      sfUI();

    const core=
      sfCore();

    const draftId=
      activeCorrectionDraftId;


    if(
      !ui ||
      !core ||
      !draftId
    ){
      return;
    }


    const profile=
      sfSaveProfile(
        sfReadProfile()
      );

    const choice=
      sfSelectedChoice();

    const amountHT=
      sfAmountHT();

    const extra=
      sfExtraResearch();

    const club=
      sfClub();

    const orientation=
      sfYouthOrientation();


    const errors=
      sfValidate(
        profile,
        club,
        orientation,
        choice,
        amountHT,
        extra
      );


    if(
      errors.length
    ){

      sfSetStatus(
        errors[0],
        "error"
      );

      return;
    }


    const band=
      sfBandData(
        choice,
        profile,
        club,
        orientation,
        amountHT,
        extra
      );


    const merchantSnapshot=
      sfMerchantSnapshot(
        profile
      );

    const clubSnapshot=
      sfClubSnapshot(
        club
      );


    const association=
      sfSelectedResearchAssociation(
        orientation,
        choice
      );


    const associationSnapshot=
      sfAssociationSnapshot(
        association
      );


    const button=
      sfField(
        "bcfSportReturnToReview"
      );

    const notice=
      sfField(
        "bcfSportCorrectionNotice"
      );


    if(button){

      button.style.display=
        "none";
    }


    if(notice){

      notice.style.display=
        "none";
    }


    activeCorrectionDraftId=
      "";


    ui.resumeAfterIdentityEdit(
      draftId,
      {

        payerRef:
          sfDigits(
            profile.sirenSiret
          ),

        payerSnapshot:
          merchantSnapshot,

        merchantSnapshot:
          merchantSnapshot,

        identityVersion:
          profile.updatedAt,

        amountHT:
          amountHT,

        extraResearchAmount:
          [
            3,
            4
          ].includes(
            choice
          )
            ? extra
            : 0,

        totalPaymentAmount:
          Math.round(
            (
              amountHT +
              (
                [
                  3,
                  4
                ].includes(
                  choice
                )
                  ? extra
                  : 0
              )
            ) *
            100
          ) /
          100,

        allocationCode:
          [
            2,
            3
          ].includes(
            choice
          )
            ? "HALF_HALF"
            : "ALL_CLUB",

        clubRef:
          clubSnapshot.clubRef,

        clubSnapshot:
          clubSnapshot,

        youthOrientation:
          sfClone(
            orientation
          ),

        publicityChoice:
          choice,

        publicityText:
          band.text,

        associationId:
          associationSnapshot
            ? associationSnapshot.id
            : "",

        associationSnapshot:
          associationSnapshot,

        beneficiaryRefs:[
          clubSnapshot.clubRef,
          associationSnapshot
            ? associationSnapshot.id
            : ""
        ].filter(
          Boolean
        ),

        publicationDays:
          PUBLICATION_DAYS,

        publicationStart:
          activeHold
            ? activeHold.startDate
            : "",

        publicationEnd:
          activeHold
            ? activeHold.endDate
            : "",

        slotHoldId:
          activeHold
            ? activeHold.id
            : "",

        paymentChannel:
          "card_psp",

        paymentPresentation:{
          cardNetworks:[
            "visa",
            "mastercard"
          ],
          dynamicQr:true
        },

        financePolicies:
          sfPolicies(),

        previewLines:[
          band.text
        ],

        previewText:
          band.text
      }
    );
  }


  /* =========================================================
     CHECKOUT
     ========================================================= */

  function sfCheckoutPayload(
    request
  ){

    const core=
      sfCore();

    const base=
      (
        request &&
        typeof request ===
          "object"
      )
        ? request
        : {};


    const draft=
      (
        core &&
        typeof core.getDraft ===
          "function"
      )
        ? core.getDraft(
            base.draftId
          )
        : null;


    if(!draft){

      throw new Error(
        "Le dossier Finance Sport est introuvable."
      );
    }


    return Object.assign(
      {},
      sfClone(
        base
      ) ||
      {},
      {

        connectorName:
          CONNECTOR_NAME,

        operationRef:
          sfText(
            draft.operationRef
          ),

        representativeRef:
          sfText(
            draft.representativeRef
          ),

        representative:
          sfClone(
            draft.representative
          ) ||
          null,

        presentedAt:
          sfText(
            draft.presentedAt
          ),

        payerSnapshot:
          sfClone(
            draft.payerSnapshot ||
            draft.merchantSnapshot
          ) ||
          null,

        merchantSnapshot:
          sfClone(
            draft.merchantSnapshot ||
            draft.payerSnapshot
          ) ||
          null,

        clubRef:
          sfText(
            draft.clubRef
          ),

        clubSnapshot:
          sfClone(
            draft.clubSnapshot
          ) ||
          null,

        youthOrientation:
          sfClone(
            draft.youthOrientation
          ) ||
          null,

        publicityChoice:
          Number(
            draft.publicityChoice ||
            0
          ),

        publicityText:
          sfText(
            draft.publicityText
          ),

        associationId:
          sfText(
            draft.associationId
          ),

        associationSnapshot:
          sfClone(
            draft.associationSnapshot
          ) ||
          null,

        publicationDays:
          Number(
            draft.publicationDays ||
            PUBLICATION_DAYS
          ),

        publicationStart:
          sfText(
            draft.publicationStart
          ),

        publicationEnd:
          sfText(
            draft.publicationEnd
          ),

        slotHoldId:
          sfText(
            draft.slotHoldId
          ),

        extraResearchAmount:
          Number(
            draft.extraResearchAmount ||
            0
          ),

        totalPaymentAmount:
          Number(
            draft.totalPaymentAmount ||
            draft.amountHT ||
            0
          ),

        paymentChannel:
          sfText(
            draft.paymentChannel ||
            "card_psp"
          ),

        paymentPresentation:
          sfClone(
            draft.paymentPresentation
          ) ||
          {
            cardNetworks:[
              "visa",
              "mastercard"
            ],
            dynamicQr:true
          },

        financePolicies:
          sfClone(
            draft.financePolicies
          ) ||
          sfPolicies(),

        serverMustRevalidate:
          true,

        clientAccountingIsFinal:
          false
      }
    );
  }


  async function sfStartCheckout(
    request
  ){

    const core=
      sfCore();


    if(!core){

      throw new Error(
        "Le cœur Finance n'est pas chargé."
      );
    }


    const config=
      core.getConfig();

    const payload=
      sfCheckoutPayload(
        request
      );

    let responseData=null;


    if(
      sfText(
        config.mode
      )
        .toLowerCase() ===
        "production"
    ){

      if(
        !sfText(
          config.apiBaseUrl
        )
      ){

        throw new Error(
          "Le serveur sécurisé Finance n'est pas configuré."
        );
      }


      const response=
        await fetch(
          sfText(
            config.apiBaseUrl
          )
            .replace(
              /\/$/,
              ""
            ) +
          "/payments/checkout",
          {

            method:
              "POST",

            credentials:
              "include",

            headers:{
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                payload
              )
          }
        );


      if(!response.ok){

        throw new Error(
          "Le paiement sécurisé est momentanément indisponible."
        );
      }


      responseData=
        await response.json();

    }else{

      if(
        !window.BociteFinanceTest ||
        window.BociteFinanceTest.ready !==
          true
      ){

        throw new Error(
          "Le test à blanc Finance n'est pas chargé."
        );
      }


      responseData=
        await window.BociteFinanceTest
          .startCheckout(
            payload
          );
    }


    if(
      !responseData ||
      responseData.ok !==
        true ||
      !sfText(
        responseData.paymentReference
      )
    ){

      throw new Error(
        "Le paiement sécurisé n'a pas pu être préparé."
      );
    }


    sfUpsertOperation({

      draftId:
        sfText(
          payload.draftId
        ),

      operationRef:
        sfText(
          payload.operationRef
        ),

      paymentReference:
        sfText(
          responseData.paymentReference
        ),

      status:
        "payment_pending",

      amountHT:
        Number(
          payload.amountHT ||
          0
        ),

      extraResearchAmount:
        Number(
          payload.extraResearchAmount ||
          0
        ),

      totalPaymentAmount:
        Number(
          payload.totalPaymentAmount ||
          0
        ),

      allocationCode:
        sfText(
          payload.allocationCode
        ),

      clubRef:
        sfText(
          payload.clubRef
        ),

      representativeRef:
        sfText(
          payload.representativeRef
        ),

      associationId:
        sfText(
          payload.associationId
        ),

      publicationDays:
        Number(
          payload.publicationDays ||
          PUBLICATION_DAYS
        ),

      publicationStart:
        sfText(
          payload.publicationStart
        ),

      publicationEnd:
        sfText(
          payload.publicationEnd
        ),

      publicityText:
        sfText(
          payload.publicityText
        ),

      slotHoldId:
        sfText(
          payload.slotHoldId
        )
    });


    sfRenderLatestOperation();


    return responseData;
  }


  /* =========================================================
     RETOURS DE PAIEMENT
     ========================================================= */

  function sfHandleStatus(
    status,
    draft
  ){

    if(
      !draft ||
      draft.connectorName !==
        CONNECTOR_NAME
    ){
      return;
    }


    const operation=
      sfUpsertOperation({

        draftId:
          sfText(
            draft.draftId
          ),

        operationRef:
          sfText(
            draft.operationRef
          ),

        paymentReference:
          sfText(
            draft.paymentReference
          ),

        serverReference:
          sfText(
            draft.serverReference
          ),

        status:
          status,

        amountHT:
          Number(
            draft.amountHT ||
            0
          ),

        extraResearchAmount:
          Number(
            draft.extraResearchAmount ||
            0
          ),

        totalPaymentAmount:
          Number(
            draft.totalPaymentAmount ||
            0
          ),

        allocationCode:
          sfText(
            draft.allocationCode
          ),

        clubRef:
          sfText(
            draft.clubRef
          ),

        representativeRef:
          sfText(
            draft.representativeRef
          ),

        associationId:
          sfText(
            draft.associationId
          ),

        publicationDays:
          Number(
            draft.publicationDays ||
            PUBLICATION_DAYS
          ),

        publicationStart:
          sfText(
            draft.publicationStart
          ),

        publicationEnd:
          sfText(
            draft.publicationEnd
          ),

        publicityText:
          sfText(
            draft.publicityText
          ),

        slotHoldId:
          sfText(
            draft.slotHoldId
          ),

        paidAt:
          sfText(
            draft.paidAt
          )
      });


    if(
      status ===
        "paid"
    ){

      sfConfirmCampaignFromHold(
        operation
      );
    }


    if(
      [
        "refused",
        "cancelled"
      ].includes(
        status
      )
    ){

      sfReleaseHold(
        status
      );
    }


    const messages={

      payment_pending:
        "Paiement en cours. La publicité ne sera diffusée qu’après confirmation effective.",

      paid:
        "Paiement confirmé. La diffusion de 3 jours est programmée sur le créneau validé.",

      refused:
        "Paiement refusé. Aucune diffusion n’est activée et le créneau est libéré.",

      cancelled:
        "Paiement annulé. Aucune diffusion n’est activée et le créneau est libéré.",

      refunded:
        "Paiement remboursé. Le dossier est placé sous contrôle avant toute suite.",

      disputed:
        "Paiement contesté. Le dossier est placé sous contrôle avant toute suite."
    };


    sfSetStatus(
      messages[
        status
      ] ||
      sfStatusLabel(
        status
      ),
      [
        "refused",
        "cancelled",
        "disputed"
      ].includes(
        status
      )
        ? "error"
        : "success"
    );


    sfRenderLatestOperation();

    sfRenderAvailability();
  }


  function sfInstallEvents(){

    if(
      financeEventsInstalled
    ){
      return;
    }


    const core=
      sfCore();


    if(
      !core ||
      core.ready !==
        true ||
      typeof core.on !==
        "function"
    ){
      return;
    }


    financeEventsInstalled=
      true;


    [
      "payment-pending",
      "payment-payment_pending",
      "payment-paid",
      "payment-refused",
      "payment-cancelled",
      "payment-refunded",
      "payment-disputed"
    ]
      .forEach(
        eventName =>{

          core.on(
            eventName,
            draft =>{

              const normalized=
                (
                  eventName ===
                    "payment-pending" ||
                  eventName ===
                    "payment-payment_pending"
                )
                  ? "payment_pending"
                  : eventName.replace(
                      "payment-",
                      ""
                    );


              sfHandleStatus(
                normalized,
                draft
              );
            }
          );
        }
      );
  }


  /* =========================================================
     STYLE DES 4 BANDES PRIVÉES
     ========================================================= */

  function sfStyles(){

    return `

      <style>

        .bcfChoiceCard{
          margin-top:10px;
          padding:10px;
          border:1px solid rgba(47,93,70,.22);
          border-radius:10px;
          background:#fff;
        }

        .bcfChoiceDisabled{
          opacity:.58;
        }

        .bcfTicker{
          overflow:hidden;
          white-space:nowrap;
          border:1px solid rgba(47,93,70,.28);
          border-radius:9px;
          background:#fff;
          padding:8px 0;
          margin-top:8px;
        }

        .bcfTickerMove{
          display:inline-block;
          padding-left:100%;
          animation:bcfSportScroll 14s linear infinite;
          color:#111;
          font-size:14px;
          font-weight:400;
        }

        .bcfTickerMove strong{
          font-weight:700;
        }

        .bcfMissing{
          display:inline-block;
          padding:0 4px;
          border-radius:4px;
          background:#ececec;
          color:#9a001b;
          font-weight:700;
        }

        @keyframes bcfSportScroll{

          0%{
            transform:translateX(0);
          }

          100%{
            transform:translateX(-100%);
          }
        }

      </style>
    `;
  }


  /* =========================================================
     AFFICHAGE
     ========================================================= */

  function sfRender(){

    const mount=
      sfField(
        MOUNT_ID
      );


    if(
      !mount ||
      mount.dataset.financeReady ===
        "1"
    ){
      return;
    }


    const profile=
      sfInitialProfile();

    const orientation=
      sfYouthOrientation();

    const representative=
      sfSession();

    const info=
      sfAvailabilitySummary();


    mount.dataset.financeReady=
      "1";


    mount.innerHTML=`

      ${sfStyles()}

      <div class="sportCard">

        <div class="sportSubTitle">

          Visibilité des commerces partenaires
          avec

          <span class="bociteSportLogo">
            Bo'Cité
            <span class="bociteSportArt">
              Art
            </span>
          </span>

        </div>


        <div
          class="sportText"
          style="margin-top:8px;"
        >

          L’échange Cabas
          reste indépendant
          de cette proposition.

          <br><br>

          Après l’échange,
          le commerçant peut profiter
          de cet instant
          pour être encore plus visible
          dans la ville.

          <br><br>

          Pendant
          <strong>3 jours d’affilée</strong>,
          son commerce peut apparaître
          dans la petite bande défilante
          de l’application.

          <br><br>

          <strong>
            Pendant 3 jours,
            on parle de vous !
          </strong>

        </div>


        <div
          id="bcfSportAvailability"
          class="sportStatus"
          style="margin-top:10px;"
        >

          <strong>
            ${sfEscape(
              info.label
            )}
          </strong>

          <br>

          ${sfEscape(
            info.detail
          )}

        </div>


        <div
          class="sportStatus"
          style="margin-top:10px;"
        >

          Parrainage présenté par

          <strong>
            ${sfEscape(
              representative.name ||
              "Utilisateur Sport autorisé"
            )}
          </strong>

          ${
            representative.team
              ? " — Équipe : " +
                sfEscape(
                  representative.team
                )
              : ""
          }

        </div>


        <div
          class="sportStatus"
          style="margin-top:10px;"
        >

          Choix des jeunes :

          <strong>
            ${sfEscape(
              sfOrientationLabel(
                orientation
              )
            )}
          </strong>

          ${
            orientation &&
            orientation.groupName
              ? `

                <br>

                Groupe :

                <strong>
                  ${sfEscape(
                    orientation.groupName
                  )}
                </strong>

              `
              : ""
          }

        </div>


        <button
          id="bcfSportBegin"
          class="sportBtn"
          type="button"
          style="
            width:100%;
            margin-top:12px;
          "
        >
          Préparer la visibilité du commerce
        </button>


        <div
          id="bcfSportWorkflow"
          style="display:none;"
        >

          <div
            id="bcfSportHoldStatus"
            class="sportStatus"
            style="margin-top:12px;"
          ></div>


          <button
            id="bcfSportExtendHold"
            class="sportBtn"
            type="button"
            style="
              display:none;
              width:100%;
              margin-top:8px;
            "
          >
            Prolonger mon créneau de 5 minutes
          </button>


          <div class="sportCard">

            <div class="sportSubTitle">
              Informations du commerçant
            </div>

            <div
              class="sportText"
              style="margin-top:8px;"
            >

              Les champs sont préremplis
              lorsqu’ils sont disponibles.

              En cas de problème automatique,
              activez le mode manuel :

              les 4 modèles restent verrouillés
              et vous complétez uniquement
              les informations manquantes.

            </div>


            <label class="sportCheck">

              <input
                id="bcfSportManualMode"
                type="checkbox"
              >

              <span>
                Préremplissage automatique indisponible
                — compléter manuellement
              </span>

            </label>


            <div
              id="bcfSportManualNotice"
              class="sportStatus"
              style="display:none;"
            >

              Mode manuel :
              aucun texte publicitaire libre
              n’est possible.

              Les mêmes informations
              remplissent automatiquement
              les 4 bandes.

            </div>


            <label class="sportLabel">
              Nom ou enseigne
            </label>

            <input
              id="bcfSportMerchantName"
              class="sportField"
              maxlength="36"
              value="${sfEscape(
                profile.name ||
                profile.shopName ||
                profile.companyName
              )}"
            >


            <label class="sportLabel">
              Adresse professionnelle courte
            </label>

            <input
              id="bcfSportMerchantAddress"
              class="sportField"
              maxlength="42"
              value="${sfEscape(
                profile.address
              )}"
            >


            <label class="sportLabel">
              Téléphone
            </label>

            <input
              id="bcfSportMerchantPhone"
              class="sportField"
              type="tel"
              maxlength="18"
              value="${sfEscape(
                profile.phone
              )}"
            >


            <label class="sportLabel">
              Site
            </label>

            <input
              id="bcfSportMerchantWebsite"
              class="sportField"
              maxlength="36"
              value="${sfEscape(
                profile.website ||
                profile.site
              )}"
            >


            <label class="sportLabel">
              SIREN / SIRET
            </label>

            <input
              id="bcfSportMerchantSiret"
              class="sportField"
              inputmode="numeric"
              maxlength="20"
              value="${sfEscape(
                profile.sirenSiret ||
                profile.siret ||
                profile.siren
              )}"
            >


            <label class="sportLabel">

              N° TVA intracommunautaire

              <span style="font-weight:400;">
                (si applicable)
              </span>

            </label>

            <input
              id="bcfSportMerchantVat"
              class="sportField"
              maxlength="20"
              value="${sfEscape(
                profile.vatNumber ||
                profile.vat ||
                ""
              )}"
            >


            <label class="sportLabel">
              Email
            </label>

            <input
              id="bcfSportMerchantEmail"
              class="sportField"
              type="email"
              maxlength="80"
              value="${sfEscape(
                profile.email
              )}"
            >


            <label class="sportLabel">
              Email comptable
            </label>

            <input
              id="bcfSportMerchantAccountingEmail"
              class="sportField"
              type="email"
              maxlength="80"
              value="${sfEscape(
                profile.accountingEmail ||
                profile.email
              )}"
            >


            <div
              id="bcfSportCorrectionNotice"
              class="sportStatus"
              style="display:none;"
            >

              Corrigez les informations nécessaires,
              puis revenez au récapitulatif.

            </div>


            <button
              id="bcfSportReturnToReview"
              class="sportBtn"
              type="button"
              style="
                display:none;
                width:100%;
                margin-top:12px;
              "
            >
              Enregistrer les corrections
              et revenir au récapitulatif
            </button>

          </div>


          <div class="sportCard">

            <div class="sportSubTitle">
              Le commerçant a 4 choix possibles
            </div>

            <div
              class="sportText"
              style="margin-top:8px;"
            >

              Regardez dans les petites bandes
              ci-dessous
              ce que les habitants pourront voir.

              <br><br>

              Les 4 bandes sont uniquement
              des exemples privés.

              Une seule phrase finale
              pourra être validée
              et diffusée.

            </div>


            <div
              id="bcfSportBands"
            ></div>


            ${
              orientation &&
              orientation.choice ===
                "club_research"
                ? `

                  <div
                    class="sportStatus"
                    style="margin-top:10px;"
                  >

                    Association retenue
                    avec les jeunes :

                    <strong>
                      ${sfEscape(
                        sfAssociationName(
                          orientation,
                          2
                        ) ||
                        "Association de recherche validée"
                      )}
                    </strong>

                  </div>

                `
                : `

                  <label class="sportLabel">
                    Association de recherche médicale
                    pour le choix 4
                  </label>

                  <select
                    id="bcfSportMerchantResearchAssociation"
                    class="sportField"
                  >

                    <option value="">
                      Choisir une association validée
                    </option>

                    ${
                      sfAssociations()
                        .map(
                          item => `

                            <option
                              value="${sfEscape(
                                item.id
                              )}"
                            >

                              ${sfEscape(
                                item.name ||
                                item.legalName ||
                                item.label
                              )}

                            </option>

                          `
                        )
                        .join("")
                    }

                  </select>


                  ${
                    !sfAssociations()
                      .length
                      ? `

                        <div
                          class="sportStatus"
                          style="margin-top:8px;"
                        >

                          Aucune association
                          de recherche validée
                          n’est encore disponible.

                        </div>

                      `
                      : ""
                  }

                `
            }

          </div>


          <div class="sportCard">

            <div class="sportSubTitle">
              Montant du parrainage
            </div>


            <label class="sportLabel">
              Parrainage du club
              — montant en € HT
            </label>

            <input
              id="bcfSportAmountHT"
              class="sportField"
              type="number"
              min="50"
              step="0.01"
              value="50"
            >


            <div
              id="bcfSportExtraResearchBox"
              style="display:none;"
            >

              <label class="sportLabel">

                Soutien complémentaire
                à la recherche
                — minimum 10 €

              </label>

              <input
                id="bcfSportExtraResearch"
                class="sportField"
                type="number"
                min="10"
                step="1"
                value="10"
              >

            </div>


            <div
              class="sportStatus"
              style="margin-top:10px;"
            >

              Le commerçant reste
              entièrement libre
              de poursuivre ou non.

              Le parrainage
              n’est jamais une condition
              de l’échange Cabas.

            </div>

          </div>


          <div class="sportCard">

            <div class="sportSubTitle">
              Phrase finale présentée au commerçant
            </div>


            <div
              id="bcfSportFinalPreview"
              class="sportStatus"
            >
              Choisissez l’une
              des formules disponibles.
            </div>


            <div
              class="sportStatus"
              style="margin-top:10px;"
            >

              Le commerçant voit
              ses dates exactes
              avant paiement.

              La diffusion ne démarre
              qu’après confirmation effective
              du paiement.

            </div>


            <button
              id="bcfSportOpenReview"
              class="sportBtn"
              type="button"
              style="
                width:100%;
                margin-top:12px;
              "
            >
              Valider avec le commerçant
              et continuer vers le paiement
            </button>


            <button
              id="bcfSportCancelWorkflow"
              class="sportBtn"
              type="button"
              style="
                width:100%;
                margin-top:8px;
              "
            >
              Pas maintenant
              — libérer le créneau
            </button>


            <div
              id="bcfSportStatus"
              class="sportStatus"
            >
              Préparez les informations
              et choisissez une formule.
            </div>

          </div>

        </div>


        <div class="sportCard">

          <div class="sportSubTitle">
            Suivi de la dernière opération
          </div>

          <div
            id="bcfSportLastOperation"
            class="sportStatus"
          >
            Aucune opération
            de parrainage enregistrée
            sur cet appareil.
          </div>

        </div>

      </div>
    `;


    const begin=
      sfField(
        "bcfSportBegin"
      );

    if(begin){

      begin.onclick=
        sfBeginWorkflow;
    }


    const manual=
      sfField(
        "bcfSportManualMode"
      );

    if(manual){

      manual.onchange=
        sfToggleManual;
    }


    const extend=
      sfField(
        "bcfSportExtendHold"
      );

    if(extend){

      extend.onclick=
        async ()=>{

          try{

            await sfExtendHold();

            sfSetStatus(
              "Créneau prolongé de 5 minutes.",
              "success"
            );

          }catch(error){

            sfSetStatus(
              error.message,
              "error"
            );
          }
        };
    }


    const open=
      sfField(
        "bcfSportOpenReview"
      );

    if(open){

      open.onclick=
        sfOpenReview;
    }


    const cancel=
      sfField(
        "bcfSportCancelWorkflow"
      );

    if(cancel){

      cancel.onclick=
        async ()=>{

          await sfReleaseHold(
            "not_now"
          );

          workflowStarted=
            false;


          const body=
            sfField(
              "bcfSportWorkflow"
            );


          if(body){

            body.style.display=
              "none";
          }


          sfSetStatus(
            "Le créneau a été libéré.",
            "success"
          );
        };
    }


    const back=
      sfField(
        "bcfSportReturnToReview"
      );

    if(back){

      back.onclick=
        sfReturnToReview;
    }


    sfBindLiveFields();

    sfRenderAvailability();

    sfRenderLatestOperation();
  }


  /* =========================================================
     APRÈS ÉCHANGE CABAS
     ========================================================= */

  function sfAfterCabasExchange(
    context
  ){

    const data=
      (
        context &&
        typeof context ===
          "object"
      )
        ? context
        : {};


    sfSaveCabasContext(
      data
    );


    const merchant=
      (
        data.merchant &&
        typeof data.merchant ===
          "object"
      )
        ? data.merchant
        : {};


    if(
      Object.keys(
        merchant
      ).length
    ){

      window
        .BOCITEART_LAST_SPORT_MERCHANT_PROFILE=
        Object.assign(
          {},
          window
            .BOCITEART_LAST_SPORT_MERCHANT_PROFILE ||
          {},
          merchant
        );


      try{

        sessionStorage.setItem(
          PROFILE_KEY,
          JSON.stringify(
            Object.assign(
              {},
              sfReadSavedProfile(),
              merchant
            )
          )
        );

      }catch(error){}
    }


    const mount=
      sfField(
        MOUNT_ID
      );


    if(mount){

      mount.dataset.financeReady=
        "";

      sfRender();

      setTimeout(
        sfBeginWorkflow,
        0
      );
    }


    return {
      ok:true
    };
  }


  /* =========================================================
     INSTALLATION
     ========================================================= */

  function sfInstall(){

    const core=
      sfCore();


    if(
      core &&
      core.ready ===
        true &&
      typeof core.getConnector ===
        "function" &&
      typeof core.registerConnector ===
        "function" &&
      !core.getConnector(
        CONNECTOR_NAME
      )
    ){

      core.registerConnector(
        CONNECTOR_NAME,
        {

          startCheckout:
            sfStartCheckout,

          editIdentity:
            sfEditIdentity
        }
      );
    }


    sfInstallEvents();

    sfRender();
  }


  if(
    document.readyState ===
      "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      sfInstall,
      {
        once:true
      }
    );

  }else{

    sfInstall();
  }


  const observer=
    new MutationObserver(
      ()=>sfInstall()
    );


  observer.observe(
    document.documentElement,
    {
      childList:true,
      subtree:true
    }
  );


  window.BociteFinanceSport={

    ready:true,

    install:
      sfInstall,

    afterCabasExchange:
      sfAfterCabasExchange,

    openReview:
      sfOpenReview,

    getOperations:
      ()=>
        sfClone(
          sfReadOperations()
        ) ||
        [],

    getLatestOperation:
      ()=>
        sfClone(
          sfLatestOperation()
        ),

    getPolicies:
      ()=>
        sfClone(
          sfPolicies()
        ),

    getAvailability:
      ()=>
        sfClone(
          sfAvailabilitySummary()
        ),

    releaseHold:
      ()=>
        sfReleaseHold(
          "external_release"
        )
  };


  console.info(
    "✅ Bo'CitéArt Finance — raccord Sport chargé"
  );

})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART — FINANCE — RACCORD SPORT
   ========================================================= */
