/* =========================================================
   ÇA COMMENCE ICI — BO'CITÉART — FINANCE — RACCORD SPORT

   Fichier public : entreprise/finance/bociteart-finance-sport.js

   Rôle :
   - proposer la visibilité commerciale uniquement après un Cabas validé ;
   - préparer un parrainage Sport de 50 € HT minimum ;
   - respecter le choix collectif des jeunes lorsqu'il est enregistré ;
   - permettre un soutien recherche supplémentaire de 10 € minimum ;
   - réserver 3 jours consécutifs de diffusion ;
   - limiter à 6 publicités simultanées par jour ;
   - réserver temporairement un créneau 15 minutes ;
   - permettre une prolongation manuelle de 5 minutes ;
   - transmettre les données nécessaires au cœur Finance et au serveur ;
   - ne jamais considérer le navigateur comme preuve de paiement.

   Aucun secret bancaire, clé PSP, IBAN complet, formule interne,
   ventilation comptable définitive ou reçu fiscal automatique
   n'est stocké dans ce fichier public.
   ========================================================= */

(function(){
  "use strict";

  if(
    window.BociteFinanceSport &&
    window.BociteFinanceSport.ready === true
  ){
    return;
  }


  /* =========================================================
     CONFIGURATION
     ========================================================= */

  const VERSION =
    "2026-09-08-01";

  const CONNECTOR_NAME =
    "sport-parrainage";

  const MOUNT_ID =
    "bociteSportFinanceMount";


  const PROFILE_KEY =
    "bociteart_finance_sport_merchant_v3";

  const OPERATIONS_KEY =
    "bociteart_finance_sport_operations_v3";

  const PENDING_OFFER_KEY =
    "bociteart_finance_sport_pending_offer_v1";

  const LOCAL_SLOTS_KEY =
    "bociteart_finance_sport_slots_v1";


  const MINIMUM_HT =
    50;

  const EXTRA_RESEARCH_MINIMUM =
    10;

  const PUBLICATION_DAYS =
    3;

  const DAILY_CAPACITY =
    6;

  const HOLD_MINUTES =
    15;

  const MANUAL_EXTENSION_MINUTES =
    5;

  const MAX_LOCAL_OPERATIONS =
    300;


  const PUBLICITY_TEMPLATES = [

    {
      code:
        "THANKS",

      label:
        "Formule 1"
    },

    {
      code:
        "SUPPORTS",

      label:
        "Formule 2"
    },

    {
      code:
        "LOCAL",

      label:
        "Formule 3"
    },

    {
      code:
        "CLUB_THANKS",

      label:
        "Formule 4"
    }

  ];


  let activeCorrectionDraftId =
    "";

  let financeEventsInstalled =
    false;

  let currentHold =
    null;


  /* =========================================================
     OUTILS
     ========================================================= */

  function sportFinanceCore(){

    return (
      window.BociteFinance ||
      null
    );
  }


  function sportFinanceUI(){

    return (
      window.BociteFinanceUI ||
      null
    );
  }


  function sportFinanceText(
    value
  ){

    return String(
      value == null
        ? ""
        : value
    ).trim();
  }


  function sportFinanceEscape(
    value
  ){

    return sportFinanceText(
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
        /\"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }


  function sportFinanceClone(
    value
  ){

    if(
      value == null
    ){
      return value;
    }


    try{

      return JSON.parse(
        JSON.stringify(
          value
        )
      );

    }catch(error){

      return null;
    }
  }


  function sportFinanceNow(){

    return new Date()
      .toISOString();
  }


  function sportFinanceId(
    prefix
  ){

    const head =
      sportFinanceText(
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


  function sportFinanceDigits(
    value
  ){

    return sportFinanceText(
      value
    )
      .replace(
        /\D/g,
        ""
      );
  }


  function sportFinanceEmailLooksValid(
    value
  ){

    const email =
      sportFinanceText(
        value
      );


    return !!(
      email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
          email
        )
    );
  }


  function sportFinanceRound(
    value
  ){

    const n =
      Number(
        value ||
        0
      );


    if(
      !Number.isFinite(
        n
      )
    ){

      return 0;
    }


    return (
      Math.round(
        n *
        100
      ) /
      100
    );
  }


  function sportFinanceFormatMoney(
    value
  ){

    return sportFinanceRound(
      value
    )
      .toLocaleString(
        "fr-FR",
        {

          minimumFractionDigits:
            2,

          maximumFractionDigits:
            2
        }
      );
  }


  function sportFinanceField(
    id
  ){

    return document
      .getElementById(
        id
      );
  }


  function sportFinanceValue(
    id
  ){

    const field =
      sportFinanceField(
        id
      );


    return sportFinanceText(
      field
        ? field.value
        : ""
    );
  }


  function sportFinanceChecked(
    id
  ){

    const field =
      sportFinanceField(
        id
      );


    return !!(
      field &&
      field.checked ===
        true
    );
  }


  function sportFinanceConfig(){

    const core =
      sportFinanceCore();


    if(
      core &&
      typeof core.getConfig ===
        "function"
    ){

      return (
        core.getConfig() ||
        {}
      );
    }


    return {};
  }


  function sportFinanceIsProduction(){

    return (
      sportFinanceText(
        sportFinanceConfig()
          .mode
      )
        .toLowerCase() ===
      "production"
    );
  }


  function sportFinanceApiBase(){

    return sportFinanceText(
      sportFinanceConfig()
        .apiBaseUrl
    )
      .replace(
        /\/$/,
        ""
      );
  }


  async function sportFinanceServerPost(
    path,
    payload
  ){

    const base =
      sportFinanceApiBase();


    if(!base){

      throw new Error(
        "Le serveur sécurisé Finance n'est pas configuré."
      );
    }


    const response =
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


    if(
      !response.ok
    ){

      throw new Error(
        "Le service sécurisé est momentanément indisponible."
      );
    }


    return response.json();
  }


  /* =========================================================
     SPORT — DONNÉES PARTAGÉES
     ========================================================= */

  function sportFinanceClub(){

    if(
      window.BociteSportModule &&
      typeof window.BociteSportModule.getClub ===
        "function"
    ){

      return (
        window.BociteSportModule
          .getClub() ||
        {}
      );
    }


    return {};
  }


  function sportFinanceSession(){

    let source =
      {};


    if(
      window.BociteSportModule &&
      typeof window.BociteSportModule.getSession ===
        "function"
    ){

      source =
        window.BociteSportModule
          .getSession() ||
        {};

    }else{

      source =
        window.bociteartSportSession ||
        {};
    }


    return {

      accountId:
        sportFinanceText(
          source.accountId ||
          source.id
        ),

      name:
        sportFinanceText(
          source.name
        ),

      role:
        sportFinanceText(
          source.role
        ),

      team:
        sportFinanceText(
          source.team
        )
    };
  }


  function sportFinanceYouthOrientation(){

    if(
      window.BociteSportModule &&
      typeof window.BociteSportModule.getYouthOrientation ===
        "function"
    ){

      return (
        window.BociteSportModule
          .getYouthOrientation() ||
        {}
      );
    }


    return {};
  }


  function sportFinanceSportAssociations(){

    if(
      window.BociteSportModule &&
      typeof window.BociteSportModule.getAssociations ===
        "function"
    ){

      const rows =
        window.BociteSportModule
          .getAssociations();


      return Array.isArray(
        rows
      )
        ? rows
        : [];
    }


    return [];
  }


  function sportFinanceAssociations(){

    const fromSport =
      sportFinanceSportAssociations()
        .filter(
          function(
            item
          ){

            return !!(

              item &&

              item.active ===
                true &&

              item.verified ===
                true &&

              item.canIssueRequiredDocument ===
                true &&

              item.renewalEligible !==
                false &&

              sportFinanceText(
                item.id
              )
            );
          }
        )
        .map(
          function(
            item
          ){

            return {

              id:
                sportFinanceText(
                  item.id
                ),

              name:
                sportFinanceText(

                  item.legalName ||
                  item.label ||
                  item.name
                ),

              legalName:
                sportFinanceText(
                  item.legalName
                ),

              accountingEmail:
                sportFinanceText(
                  item.accountingEmail
                ),

              validated:
                true
            };
          }
        );


    if(
      fromSport.length
    ){

      return fromSport;
    }


    const shared =
      window
        .BOCITEART_FINANCE_ASSOCIATIONS;


    if(
      !Array.isArray(
        shared
      )
    ){

      return [];
    }


    return shared
      .filter(
        function(
          item
        ){

          return !!(

            item &&

            item.validated ===
              true &&

            sportFinanceText(
              item.id
            ) &&

            sportFinanceText(

              item.name ||
              item.legalName ||
              item.label
            )
          );
        }
      )
      .map(
        function(
          item
        ){

          return {

            id:
              sportFinanceText(
                item.id
              ),

            name:
              sportFinanceText(

                item.name ||
                item.legalName ||
                item.label
              ),

            legalName:
              sportFinanceText(
                item.legalName
              ),

            accountingEmail:
              sportFinanceText(
                item.accountingEmail
              ),

            validated:
              true
          };
        }
      );
  }


  function sportFinanceClubSnapshot(
    club
  ){

    const source =
      club &&
      typeof club ===
        "object"

        ? club

        : {};


    return {

      clubRef:
        sportFinanceText(
          source.clubRef
        ),

      name:
        sportFinanceText(

          source.name ||
          source.officialName
        ),

      officialName:
        sportFinanceText(
          source.officialName
        ),

      commune:
        sportFinanceText(
          source.commune
        ),

      organizationType:
        sportFinanceText(
          source.organizationType
        ),

      legalForm:
        sportFinanceText(
          source.legalForm
        ),

      sirenSiret:
        sportFinanceText(

          source.sirenSiret ||
          source.siret ||
          source.siren
        ),

      rnaNumber:
        sportFinanceText(
          source.rnaNumber
        ),

      vatStatus:
        sportFinanceText(
          source.vatStatus
        ),

      vatNumber:
        sportFinanceText(
          source.vatNumber
        ),

      accountingEmail:
        sportFinanceText(
          source.accountingEmail
        )
    };
  }


  function sportFinanceAssociationSnapshot(
    association
  ){

    if(
      !association
    ){

      return null;
    }


    return {

      id:
        sportFinanceText(
          association.id
        ),

      name:
        sportFinanceText(

          association.name ||
          association.legalName ||
          association.label
        ),

      legalName:
        sportFinanceText(
          association.legalName
        ),

      accountingEmail:
        sportFinanceText(
          association.accountingEmail
        ),

      validated:
        association.validated ===
        true
    };
  }


  /* =========================================================
     PROFIL COMMERÇANT
     ========================================================= */

  function sportFinanceReadSavedProfile(){

    try{

      const saved =
        JSON.parse(

          window.sessionStorage
            .getItem(
              PROFILE_KEY
            ) ||
          "{}"
        );


      return (
        saved &&
        typeof saved ===
          "object"
      )
        ? saved
        : {};

    }catch(error){

      return {};
    }
  }


  function sportFinanceReadPendingOffer(){

    try{

      const saved =
        JSON.parse(

          window.sessionStorage
            .getItem(
              PENDING_OFFER_KEY
            ) ||
          "null"
        );


      return (
        saved &&
        typeof saved ===
          "object"
      )
        ? saved
        : null;

    }catch(error){

      return null;
    }
  }


  function sportFinanceWritePendingOffer(
    offer
  ){

    try{

      if(
        !offer
      ){

        window.sessionStorage
          .removeItem(
            PENDING_OFFER_KEY
          );

        return true;
      }


      window.sessionStorage
        .setItem(

          PENDING_OFFER_KEY,

          JSON.stringify(
            offer
          )
        );


      return true;

    }catch(error){

      return false;
    }
  }


  function sportFinanceInitialProfile(){

    const pending =
      sportFinanceReadPendingOffer();


    const pendingMerchant =
      pending &&
      pending.merchant;


    const shared =
      window
        .BOCITEART_LAST_SPORT_MERCHANT_PROFILE;


    const saved =
      sportFinanceReadSavedProfile();


    return Object.assign(
      {},

      shared &&
      typeof shared ===
        "object"

        ? shared

        : {},

      saved,

      pendingMerchant &&
      typeof pendingMerchant ===
        "object"

        ? pendingMerchant

        : {}
    );
  }


  function sportFinanceReadProfile(){

    return {

      name:
        sportFinanceValue(
          "bcfSportMerchantName"
        ),

      sirenSiret:
        sportFinanceValue(
          "bcfSportMerchantSiret"
        ),

      vatNumber:
        sportFinanceValue(
          "bcfSportMerchantVat"
        ),

      address:
        sportFinanceValue(
          "bcfSportMerchantAddress"
        ),

      phone:
        sportFinanceValue(
          "bcfSportMerchantPhone"
        ),

      email:
        sportFinanceValue(
          "bcfSportMerchantEmail"
        ),

      accountingEmail:
        sportFinanceValue(
          "bcfSportMerchantAccountingEmail"
        ),

      website:
        sportFinanceValue(
          "bcfSportMerchantWebsite"
        ),

      updatedAt:
        sportFinanceNow()
    };
  }


  function sportFinanceSaveProfile(
    profile
  ){

    const clean =

      profile &&
      typeof profile ===
        "object"

        ? profile

        : {};


    try{

      window.sessionStorage
        .setItem(

          PROFILE_KEY,

          JSON.stringify(
            clean
          )
        );

    }catch(error){

      console.warn(
        "Bo'CitéArt Finance Sport : profil non mémorisé.",
        error
      );
    }


    window
      .BOCITEART_LAST_SPORT_MERCHANT_PROFILE =
        Object.assign(
          {},
          clean
        );


    return clean;
  }


  function sportFinanceMerchantSnapshot(
    profile
  ){

    const source =

      profile &&
      typeof profile ===
        "object"

        ? profile

        : {};


    return {

      name:
        sportFinanceText(
          source.name
        ),

      sirenSiret:
        sportFinanceDigits(
          source.sirenSiret
        ),

      vatNumber:
        sportFinanceText(
          source.vatNumber
        )
          .replace(
            /\s+/g,
            ""
          )
          .toUpperCase(),

      address:
        sportFinanceText(
          source.address
        ),

      phone:
        sportFinanceText(
          source.phone
        ),

      email:
        sportFinanceText(
          source.email
        ),

      accountingEmail:
        sportFinanceText(
          source.accountingEmail
        ),

      website:
        sportFinanceText(
          source.website
        ),

      identityVersion:
        sportFinanceText(
          source.updatedAt
        )
    };
  }


  /* =========================================================
     HISTORIQUE LOCAL
     ========================================================= */

  function sportFinanceReadOperations(){

    try{

      const parsed =
        JSON.parse(

          window.localStorage
            .getItem(
              OPERATIONS_KEY
            ) ||
          "[]"
        );


      return Array.isArray(
        parsed
      )
        ? parsed
        : [];

    }catch(error){

      return [];
    }
  }


  function sportFinanceWriteOperations(
    operations
  ){

    const list =

      Array.isArray(
        operations
      )

        ? operations.slice(
            -MAX_LOCAL_OPERATIONS
          )

        : [];


    try{

      window.localStorage
        .setItem(

          OPERATIONS_KEY,

          JSON.stringify(
            list
          )
        );


      return true;

    }catch(error){

      return false;
    }
  }


  function sportFinanceUpsertOperation(
    data
  ){

    const source =

      data &&
      typeof data ===
        "object"

        ? data

        : {};


    const draftId =
      sportFinanceText(
        source.draftId
      );


    const operationRef =
      sportFinanceText(
        source.operationRef
      );


    const paymentReference =
      sportFinanceText(
        source.paymentReference
      );


    if(
      !draftId &&
      !operationRef &&
      !paymentReference
    ){

      return null;
    }


    const operations =
      sportFinanceReadOperations();


    const index =
      operations.findIndex(
        function(
          item
        ){

          return !!(

            (
              draftId &&

              sportFinanceText(
                item.draftId
              ) ===
              draftId
            )

            ||

            (
              operationRef &&

              sportFinanceText(
                item.operationRef
              ) ===
              operationRef
            )

            ||

            (
              paymentReference &&

              sportFinanceText(
                item.paymentReference
              ) ===
              paymentReference
            )
          );
        }
      );


    const previous =

      index >=
      0

        ? operations[
            index
          ]

        : {};


    const next =
      Object.assign(

        {},

        previous,

        sportFinanceClone(
          source
        ) ||
        {},

        {

          updatedAt:
            sportFinanceNow()
        }
      );


    if(
      !next.createdAt
    ){

      next.createdAt =
        sportFinanceNow();
    }


    if(
      index >=
      0
    ){

      operations[
        index
      ] =
        next;

    }else{

      operations.push(
        next
      );
    }


    sportFinanceWriteOperations(
      operations
    );


    return sportFinanceClone(
      next
    );
  }


  function sportFinanceLatestOperation(){

    return sportFinanceReadOperations()
      .slice()
      .sort(
        function(
          a,
          b
        ){

          return String(
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
            );
        }
      )[0] ||
      null;
  }


  function sportFinanceStatusLabel(
    status
  ){

    const core =
      sportFinanceCore();


    if(
      core &&
      typeof core.statusLabel ===
        "function"
    ){

      return core.statusLabel(
        status
      );
    }


    const labels = {

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
        sportFinanceText(
          status
        )
      ]

      ||

      "État en cours"
    );
  }


  function sportFinanceRenderLatestOperation(){

    const target =
      sportFinanceField(
        "bcfSportLastOperation"
      );


    if(
      !target
    ){

      return;
    }


    const operation =
      sportFinanceLatestOperation();


    if(
      !operation
    ){

      target.innerHTML =
        "Aucune opération de parrainage enregistrée sur cet appareil.";

      return;
    }


    const extra =
      Number(
        operation.extraResearchAmount ||
        0
      );


    target.innerHTML = `

      <strong>

        ${sportFinanceEscape(

          sportFinanceStatusLabel(
            operation.status
          )

        )}

      </strong>


      ${
        Number(
          operation.amountHT ||
          0
        ) > 0

          ? " — " +

            sportFinanceEscape(

              sportFinanceFormatMoney(
                operation.amountHT
              )

            ) +

            " € HT"

          : ""
      }


      ${
        extra > 0

          ? "<br>Soutien recherche supplémentaire : " +

            sportFinanceEscape(

              sportFinanceFormatMoney(
                extra
              )

            ) +

            " €"

          : ""
      }


      ${
        operation.publicationStart &&
        operation.publicationEnd

          ? "<br>Diffusion prévue : du " +

            sportFinanceEscape(

              sportFinanceDateFr(
                operation.publicationStart
              )

            ) +

            " au " +

            sportFinanceEscape(

              sportFinanceDateFr(
                operation.publicationEnd
              )

            ) +

            " inclus."

          : ""
      }


      ${
        operation.paymentReference

          ? "<br>Réf. paiement : " +

            sportFinanceEscape(
              operation.paymentReference
            )

          : ""
      }


      ${
        operation.operationRef

          ? "<br>Réf. dossier : " +

            sportFinanceEscape(
              operation.operationRef
            )

          : ""
      }

    `;
  }


  /* =========================================================
     DATES — 3 JOURS CONSÉCUTIFS
     ========================================================= */

  function sportFinanceParseDate(
    iso
  ){

    const value =
      sportFinanceText(
        iso
      );


    if(
      !/^\d{4}-\d{2}-\d{2}$/
        .test(
          value
        )
    ){

      return null;
    }


    const parts =
      value
        .split("-")
        .map(
          Number
        );


    const date =
      new Date(

        parts[0],

        parts[1] -
        1,

        parts[2],

        12,
        0,
        0,
        0
      );


    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  }


  function sportFinanceDateIso(
    date
  ){

    if(
      !(date instanceof Date) ||
      Number.isNaN(
        date.getTime()
      )
    ){

      return "";
    }


    return [

      date.getFullYear(),

      String(
        date.getMonth() +
        1
      )
        .padStart(
          2,
          "0"
        ),

      String(
        date.getDate()
      )
        .padStart(
          2,
          "0"
        )

    ].join("-");
  }


  function sportFinanceAddDays(
    iso,
    days
  ){

    const date =
      sportFinanceParseDate(
        iso
      );


    if(
      !date
    ){

      return "";
    }


    date.setDate(

      date.getDate() +
      Number(
        days ||
        0
      )
    );


    return sportFinanceDateIso(
      date
    );
  }


  function sportFinanceTodayIso(){

    return sportFinanceDateIso(
      new Date()
    );
  }


  function sportFinanceDateFr(
    iso
  ){

    const date =
      sportFinanceParseDate(
        iso
      );


    if(
      !date
    ){

      return sportFinanceText(
        iso
      );
    }


    return date
      .toLocaleDateString(
        "fr-FR"
      );
  }


  function sportFinanceDateRange(
    start
  ){

    const cleanStart =
      sportFinanceText(
        start
      );


    if(
      !cleanStart
    ){

      return null;
    }


    return {

      start:
        cleanStart,

      end:
        sportFinanceAddDays(

          cleanStart,

          PUBLICATION_DAYS -
          1
        ),

      days:[

        cleanStart,

        sportFinanceAddDays(
          cleanStart,
          1
        ),

        sportFinanceAddDays(
          cleanStart,
          2
        )
      ]
    };
  }


  /* =========================================================
     CRÉNEAUX LOCAUX — PRÉPRODUCTION
     ========================================================= */

  function sportFinanceReadLocalSlots(){

    try{

      const rows =
        JSON.parse(

          window.localStorage
            .getItem(
              LOCAL_SLOTS_KEY
            ) ||
          "[]"
        );


      return Array.isArray(
        rows
      )
        ? rows
        : [];

    }catch(error){

      return [];
    }
  }


  function sportFinanceWriteLocalSlots(
    rows
  ){

    try{

      window.localStorage
        .setItem(

          LOCAL_SLOTS_KEY,

          JSON.stringify(

            Array.isArray(
              rows
            )

              ? rows.slice(
                  -1000
                )

              : []
          )
        );


      return true;

    }catch(error){

      return false;
    }
  }


  function sportFinanceCleanLocalSlots(){

    const now =
      Date.now();


    const rows =
      sportFinanceReadLocalSlots();


    let changed =
      false;


    rows.forEach(
      function(
        item
      ){

        if(
          item &&
          item.status ===
            "held" &&
          Number(
            item.expiresAt ||
            0
          ) <=
          now
        ){

          item.status =
            "expired";

          item.expiredAt =
            now;

          changed =
            true;
        }
      }
    );


    if(
      changed
    ){

      sportFinanceWriteLocalSlots(
        rows
      );
    }


    return rows;
  }


  function sportFinanceLocalOccupiedCount(
    day,
    ignoreHoldId
  ){

    return sportFinanceCleanLocalSlots()
      .filter(
        function(
          item
        ){

          if(
            !item ||
            sportFinanceText(
              item.id
            ) ===
            sportFinanceText(
              ignoreHoldId
            )
          ){

            return false;
          }


          if(
            ![
              "held",
              "payment_pending",
              "paid",
              "active"
            ]
              .includes(
                sportFinanceText(
                  item.status
                )
              )
          ){

            return false;
          }


          const range =
            sportFinanceDateRange(
              item.publicationStart
            );


          return !!(

            range &&
            range.days
              .includes(
                day
              )
          );
        }
      )
      .length;
  }


  function sportFinanceLocalAvailability(
    start,
    ignoreHoldId
  ){

    const range =
      sportFinanceDateRange(
        start
      );


    if(
      !range
    ){

      return {

        ok:
          false,

        available:
          false,

        reason:
          "invalid_date"
      };
    }


    const dayStatus =
      range.days
        .map(
          function(
            day
          ){

            const occupied =
              sportFinanceLocalOccupiedCount(

                day,

                ignoreHoldId
              );


            return {

              date:
                day,

              occupied:
                occupied,

              remaining:
                Math.max(

                  0,

                  DAILY_CAPACITY -
                  occupied
                ),

              available:
                occupied <
                DAILY_CAPACITY
            };
          }
        );


    return {

      ok:
        true,

      available:
        dayStatus
          .every(
            function(
              item
            ){

              return item.available;
            }
          ),

      publicationStart:
        range.start,

      publicationEnd:
        range.end,

      dayStatus:
        dayStatus
    };
  }


  /* =========================================================
     DISPONIBILITÉ SERVEUR / LOCALE
     ========================================================= */

  async function sportFinanceCheckAvailability(
    start
  ){

    const range =
      sportFinanceDateRange(
        start
      );


    if(
      !range
    ){

      return {

        ok:
          false,

        available:
          false,

        reason:
          "invalid_date"
      };
    }


    if(
      sportFinanceIsProduction()
    ){

      const result =
        await sportFinanceServerPost(

          "/sport/publicity/availability",

          {

            publicationStart:
              range.start,

            publicationEnd:
              range.end,

            publicationDays:
              PUBLICATION_DAYS,

            dailyCapacity:
              DAILY_CAPACITY,

            clubRef:
              sportFinanceText(
                sportFinanceClub()
                  .clubRef
              )
          }
        );


      return Object.assign(

        {

          publicationStart:
            range.start,

          publicationEnd:
            range.end
        },

        result ||
        {}
      );
    }


    return sportFinanceLocalAvailability(

      range.start,

      currentHold &&
      currentHold.slotHoldId
    );
  }


  async function sportFinanceReserveSlot(
    start,
    context
  ){

    const range =
      sportFinanceDateRange(
        start
      );


    if(
      !range
    ){

      throw new Error(
        "Choisissez une date de diffusion valide."
      );
    }


    if(
      currentHold &&
      currentHold.slotHoldId &&
      currentHold.publicationStart ===
        range.start &&
      Number(
        currentHold.expiresAt ||
        0
      ) >
      Date.now()
    ){

      return currentHold;
    }


    if(
      currentHold &&
      currentHold.slotHoldId
    ){

      await sportFinanceReleaseHold(
        "date_changed"
      );
    }


    if(
      sportFinanceIsProduction()
    ){

      const result =
        await sportFinanceServerPost(

          "/sport/publicity/hold",

          {

            publicationStart:
              range.start,

            publicationEnd:
              range.end,

            publicationDays:
              PUBLICATION_DAYS,

            dailyCapacity:
              DAILY_CAPACITY,

            holdMinutes:
              HOLD_MINUTES,

            clubRef:
              sportFinanceText(
                sportFinanceClub()
                  .clubRef
              ),

            merchantRef:
              sportFinanceText(

                context &&
                context.merchantRef
              ),

            cabasOperationRef:
              sportFinanceText(

                context &&
                context.cabasOperationRef
              )
          }
        );


      if(
        !result ||
        result.ok !==
          true ||
        !sportFinanceText(
          result.slotHoldId
        )
      ){

        throw new Error(
          "Ce créneau n'est plus disponible. Choisissez une autre date."
        );
      }


      currentHold = {

        slotHoldId:
          sportFinanceText(
            result.slotHoldId
          ),

        publicationStart:
          sportFinanceText(

            result.publicationStart ||
            range.start
          ),

        publicationEnd:
          sportFinanceText(

            result.publicationEnd ||
            range.end
          ),

        expiresAt:
          Number(

            result.expiresAt ||
            (
              Date.now() +
              HOLD_MINUTES *
              60000
            )
          ),

        mode:
          "server"
      };


      return sportFinanceClone(
        currentHold
      );
    }


    const availability =
      sportFinanceLocalAvailability(
        range.start
      );


    if(
      !availability.available
    ){

      throw new Error(
        "Ce créneau est complet sur au moins une des trois journées."
      );
    }


    const hold = {

      id:
        sportFinanceId(
          "sport-slot"
        ),

      status:
        "held",

      publicationStart:
        range.start,

      publicationEnd:
        range.end,

      createdAt:
        Date.now(),

      expiresAt:
        Date.now() +
        HOLD_MINUTES *
        60000,

      merchantRef:
        sportFinanceText(

          context &&
          context.merchantRef
        ),

      cabasOperationRef:
        sportFinanceText(

          context &&
          context.cabasOperationRef
        )
    };


    const rows =
      sportFinanceReadLocalSlots();


    rows.push(
      hold
    );


    sportFinanceWriteLocalSlots(
      rows
    );


    currentHold = {

      slotHoldId:
        hold.id,

      publicationStart:
        hold.publicationStart,

      publicationEnd:
        hold.publicationEnd,

      expiresAt:
        hold.expiresAt,

      mode:
        "local"
    };


    return sportFinanceClone(
      currentHold
    );
  }


  async function sportFinanceExtendHold(){

    if(
      !currentHold ||
      !currentHold.slotHoldId
    ){

      throw new Error(
        "Aucun créneau temporaire n'est réservé."
      );
    }


    if(
      sportFinanceIsProduction()
    ){

      const result =
        await sportFinanceServerPost(

          "/sport/publicity/hold/extend",

          {

            slotHoldId:
              currentHold.slotHoldId,

            additionalMinutes:
              MANUAL_EXTENSION_MINUTES
          }
        );


      if(
        !result ||
        result.ok !==
          true
      ){

        throw new Error(
          "La réservation temporaire n'a pas pu être prolongée."
        );
      }


      currentHold.expiresAt =
        Number(

          result.expiresAt ||

          (
            Date.now() +
            MANUAL_EXTENSION_MINUTES *
            60000
          )
        );


      sportFinanceRenderHoldStatus();


      return sportFinanceClone(
        currentHold
      );
    }


    const rows =
      sportFinanceCleanLocalSlots();


    const index =
      rows.findIndex(
        function(
          item
        ){

          return (
            sportFinanceText(
              item.id
            ) ===
            currentHold.slotHoldId
          );
        }
      );


    if(
      index <
      0 ||
      rows[index]
        .status !==
      "held"
    ){

      throw new Error(
        "La réservation temporaire a expiré."
      );
    }


    rows[index]
      .expiresAt =
        Math.max(

          Date.now(),

          Number(
            rows[index]
              .expiresAt ||
            0
          )
        )

        +

        MANUAL_EXTENSION_MINUTES *
        60000;


    rows[index]
      .extendedAt =
        Date.now();


    sportFinanceWriteLocalSlots(
      rows
    );


    currentHold.expiresAt =
      rows[index]
        .expiresAt;


    sportFinanceRenderHoldStatus();


    return sportFinanceClone(
      currentHold
    );
  }


  async function sportFinanceReleaseHold(
    reason
  ){

    if(
      !currentHold ||
      !currentHold.slotHoldId
    ){

      return true;
    }


    const holdId =
      currentHold
        .slotHoldId;


    if(
      sportFinanceIsProduction()
    ){

      try{

        await sportFinanceServerPost(

          "/sport/publicity/hold/release",

          {

            slotHoldId:
              holdId,

            reason:
              sportFinanceText(

                reason ||
                "released"
              )
          }
        );

      }catch(error){

        console.warn(
          "Bo'CitéArt Finance Sport : libération serveur à rapprocher.",
          error
        );
      }

    }else{

      const rows =
        sportFinanceReadLocalSlots();


      const index =
        rows.findIndex(
          function(
            item
          ){

            return (
              sportFinanceText(
                item.id
              ) ===
              holdId
            );
          }
        );


      if(
        index >=
          0 &&
        rows[index]
          .status ===
        "held"
      ){

        rows[index]
          .status =
            "released";

        rows[index]
          .releasedAt =
            Date.now();

        rows[index]
          .releaseReason =
            sportFinanceText(
              reason
            );


        sportFinanceWriteLocalSlots(
          rows
        );
      }
    }


    currentHold =
      null;


    sportFinanceRenderHoldStatus();


    return true;
  }


  function sportFinanceCommitLocalHold(
    draft
  ){

    if(
      sportFinanceIsProduction()
    ){

      return;
    }


    const holdId =
      sportFinanceText(

        draft &&
        draft.slotHoldId
      );


    if(
      !holdId
    ){

      return;
    }


    const rows =
      sportFinanceReadLocalSlots();


    const index =
      rows.findIndex(
        function(
          item
        ){

          return (
            sportFinanceText(
              item.id
            ) ===
            holdId
          );
        }
      );


    if(
      index >=
      0
    ){

      rows[index]
        .status =
          "paid";

      rows[index]
        .paidAt =
          Date.now();


      sportFinanceWriteLocalSlots(
        rows
      );
    }
  }


  function sportFinanceMarkLocalPublicationFailure(
    detail
  ){

    const holdId =
      sportFinanceText(

        detail &&
        detail.slotHoldId
      );


    if(
      !holdId ||
      sportFinanceIsProduction()
    ){

      return;
    }


    const rows =
      sportFinanceReadLocalSlots();


    const index =
      rows.findIndex(
        function(
          item
        ){

          return (
            sportFinanceText(
              item.id
            ) ===
            holdId
          );
        }
      );


    if(
      index >=
      0
    ){

      rows[index]
        .status =
          "reschedule_required";

      rows[index]
        .publicationFailureAt =
          Date.now();


      sportFinanceWriteLocalSlots(
        rows
      );
    }
  }


  /* =========================================================
     MONTANTS — DESTINATION — RECHERCHE
     ========================================================= */

  function sportFinanceAmountHT(){

    return sportFinanceRound(

      sportFinanceValue(
        "bcfSportAmountHT"
      )
    );
  }


  function sportFinanceExtraResearchAmount(){

    if(
      !sportFinanceChecked(
        "bcfSportExtraResearchEnabled"
      )
    ){

      return 0;
    }


    return sportFinanceRound(

      sportFinanceValue(
        "bcfSportExtraResearchAmount"
      )
    );
  }


  function sportFinanceChoice(){

    const selected =
      document.querySelector(
        'input[name="bcfSportAllocation"]:checked'
      );


    return sportFinanceText(

      selected
        ? selected.value
        : ""
    );
  }


  function sportFinanceYouthLockedChoice(){

    const youth =
      sportFinanceYouthOrientation();


    if(
      !youth ||
      youth.locked !==
        true
    ){

      return {

        locked:
          false,

        choice:
          "",

        associationId:
          "",

        associationName:
          "",

        groupName:
          ""
      };
    }


    return {

      locked:
        true,

      choice:
        youth.choice ===
          "club_research"

          ? "HALF_HALF"

          : "ALL_CLUB",

      associationId:
        sportFinanceText(
          youth.associationId
        ),

      associationName:
        sportFinanceText(
          youth.associationName
        ),

      groupName:
        sportFinanceText(
          youth.groupName
        )
    };
  }


  function sportFinanceSelectedAssociation(){

    const id =
      sportFinanceValue(
        "bcfSportAssociation"
      );


    return sportFinanceAssociations()
      .find(
        function(
          item
        ){

          return (
            String(
              item.id
            ) ===
            String(
              id
            )
          );
        }
      ) ||
      null;
  }


  function sportFinanceTemplateCode(){

    const selected =
      document.querySelector(
        'input[name="bcfSportTemplate"]:checked'
      );


    return sportFinanceText(

      selected
        ? selected.value
        : "THANKS"
    );
  }


  function sportFinanceHasResearch(
    choice,
    extraResearchAmount
  ){

    return (
      choice ===
        "HALF_HALF"

      ||

      Number(
        extraResearchAmount ||
        0
      ) >
      0
    );
  }


  function sportFinancePublicityText(
    templateCode,
    profile,
    club,
    choice,
    extraResearchAmount
  ){

    const merchantName =
      sportFinanceText(
        profile.name
      ) ||
      "Ce commerce";


    const clubName =
      sportFinanceText(

        club.name ||
        club.officialName
      ) ||
      "le club";


    const hasResearch =
      sportFinanceHasResearch(

        choice,

        extraResearchAmount
      );


    switch(
      templateCode
    ){

      case "SUPPORTS":

        return (

          merchantName +

          " soutient " +

          clubName +

          (
            hasResearch

              ? " et la recherche médicale"

              : ""
          )

          +

          " avec Bo'CitéArt."
        );


      case "LOCAL":

        return (

          "Avec " +

          merchantName +

          ", " +

          clubName +

          " bénéficie d’un soutien local"

          +

          (
            hasResearch

              ? ", avec un soutien également apporté à la recherche médicale"

              : ""
          )

          +

          "."
        );


      case "CLUB_THANKS":

        return (

          clubName +

          " remercie " +

          merchantName +

          " pour son parrainage avec Bo'CitéArt"

          +

          (
            hasResearch

              ? ", qui soutient également la recherche médicale"

              : ""
          )

          +

          "."
        );


      case "THANKS":
      default:

        return (

          "Merci à " +

          merchantName +

          " pour son soutien à " +

          clubName +

          (
            hasResearch

              ? " et à la recherche médicale"

              : ""
          )

          +

          "."
        );
    }
  }


  /* =========================================================
     AFFICHAGES DYNAMIQUES
     ========================================================= */

  function sportFinanceSetStatus(
    message,
    state
  ){

    const target =
      sportFinanceField(
        "bcfSportStatus"
      );


    if(
      !target
    ){

      return;
    }


    target.textContent =
      sportFinanceText(
        message
      );


    target.style.color =

      state ===
        "error"

        ? "#7f1a1d"

        : "#111111";


    target.style.borderColor =

      state ===
        "error"

        ? "#a51e22"

        : "";
  }


  function sportFinanceRenderHoldStatus(){

    const target =
      sportFinanceField(
        "bcfSportHoldStatus"
      );


    const extend =
      sportFinanceField(
        "bcfSportExtendHold"
      );


    if(
      !target
    ){

      return;
    }


    if(
      !currentHold ||
      !currentHold.slotHoldId ||
      Number(
        currentHold.expiresAt ||
        0
      ) <=
      Date.now()
    ){

      target.textContent =
        "Aucun créneau n’est actuellement réservé.";


      if(
        extend
      ){

        extend.style.display =
          "none";
      }


      return;
    }


    target.textContent =
      "Créneau réservé temporairement jusqu’à " +

      new Date(
        currentHold.expiresAt
      )
        .toLocaleTimeString(
          "fr-FR",
          {

            hour:
              "2-digit",

            minute:
              "2-digit"
          }
        )

      +

      ".";


    if(
      extend
    ){

      extend.style.display =
        "block";
    }
  }


  function sportFinanceUpdateDatePreview(){

    const target =
      sportFinanceField(
        "bcfSportDatePreview"
      );


    const start =
      sportFinanceValue(
        "bcfSportPublicationStart"
      );


    const range =
      sportFinanceDateRange(
        start
      );


    if(
      !target
    ){

      return;
    }


    if(
      !range
    ){

      target.textContent =
        "Choisissez le premier jour de diffusion.";

      return;
    }


    target.textContent =
      "Votre publicité sera diffusée du " +

      sportFinanceDateFr(
        range.start
      )

      +

      " au " +

      sportFinanceDateFr(
        range.end
      )

      +

      " inclus, sous réserve de disponibilité et de confirmation du paiement.";
  }


  function sportFinanceUpdateResearchBox(){

    const choice =
      sportFinanceChoice();


    const extraEnabled =
      sportFinanceChecked(
        "bcfSportExtraResearchEnabled"
      );


    const associationBox =
      sportFinanceField(
        "bcfSportAssociationBox"
      );


    const extraBox =
      sportFinanceField(
        "bcfSportExtraResearchBox"
      );


    if(
      associationBox
    ){

      associationBox.style.display =

        (
          choice ===
            "HALF_HALF"

          ||

          extraEnabled
        )

          ? "block"

          : "none";
    }


    if(
      extraBox
    ){

      extraBox.style.display =

        extraEnabled

          ? "block"

          : "none";
    }
  }


  function sportFinanceRenderTemplates(){

    const target =
      sportFinanceField(
        "bcfSportTemplateList"
      );


    if(
      !target
    ){

      return;
    }


    const profile =
      sportFinanceReadProfile();


    const club =
      sportFinanceClub();


    const choice =
      sportFinanceChoice();


    const extra =
      sportFinanceExtraResearchAmount();


    const selectedCode =
      sportFinanceTemplateCode();


    target.innerHTML =
      PUBLICITY_TEMPLATES
        .map(
          function(
            template
          ){

            const text =
              sportFinancePublicityText(

                template.code,

                profile,

                club,

                choice,

                extra
              );


            return `

              <label
                class="sportItem"
                style="
                  display:block;
                  cursor:pointer;
                "
              >

                <input
                  type="radio"
                  name="bcfSportTemplate"
                  value="${sportFinanceEscape(
                    template.code
                  )}"
                  ${
                    template.code ===
                      selectedCode

                      ? "checked"

                      : ""
                  }
                >

                <strong>
                  ${sportFinanceEscape(
                    template.label
                  )}
                </strong>

                <div
                  style="
                    margin-top:6px;
                  "
                >
                  ${sportFinanceEscape(
                    text
                  )}
                </div>

              </label>

            `;
          }
        )
        .join("");
  }


  async function sportFinanceShowAvailability(){

    const start =
      sportFinanceValue(
        "bcfSportPublicationStart"
      );


    const target =
      sportFinanceField(
        "bcfSportAvailabilityStatus"
      );


    if(
      !start
    ){

      if(
        target
      ){

        target.textContent =
          "Choisissez d’abord le premier jour de diffusion.";
      }


      return;
    }


    if(
      target
    ){

      target.textContent =
        "Vérification des disponibilités…";
    }


    try{

      const result =
        await sportFinanceCheckAvailability(
          start
        );


      if(
        !target
      ){

        return;
      }


      if(
        result.available ===
          true
      ){

        target.textContent =
          "Créneau disponible pour les 3 jours : du " +

          sportFinanceDateFr(

            result.publicationStart ||
            start
          )

          +

          " au " +

          sportFinanceDateFr(

            result.publicationEnd ||

            sportFinanceAddDays(
              start,
              2
            )
          )

          +

          " inclus.";

      }else{

        target.textContent =
          "Ce créneau est complet sur au moins une journée. Choisissez une autre date.";
      }

    }catch(error){

      if(
        target
      ){

        target.textContent =

          error &&
          error.message

            ? error.message

            : "La disponibilité n’a pas pu être vérifiée.";
      }
    }
  }


  /* =========================================================
     VALIDATION
     ========================================================= */

  function sportFinanceValidate(
    profile,
    club,
    amountHT,
    extraResearchAmount,
    choice,
    association,
    publicationStart,
    templateCode
  ){

    const errors =
      [];


    const youth =
      sportFinanceYouthLockedChoice();


    if(
      !sportFinanceText(
        club.clubRef
      )
    ){

      errors.push(
        "La fiche d’identité du club doit être enregistrée."
      );
    }


    if(
      !profile.name
    ){

      errors.push(
        "Le nom ou l’enseigne du commerçant est obligatoire."
      );
    }


    const digits =
      sportFinanceDigits(
        profile.sirenSiret
      );


    if(
      !digits
    ){

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


    if(
      profile.vatNumber
    ){

      const vat =
        sportFinanceText(
          profile.vatNumber
        )
          .replace(
            /\s+/g,
            ""
          )
          .toUpperCase();


      if(
        !/^[A-Z]{2}[A-Z0-9]{8,12}$/
          .test(
            vat
          )
      ){

        errors.push(
          "Le numéro de TVA intracommunautaire indiqué n’est pas valide."
        );
      }
    }


    if(
      !profile.address
    ){

      errors.push(
        "L’adresse professionnelle du commerçant est obligatoire."
      );
    }


    if(
      !profile.accountingEmail
    ){

      errors.push(
        "L’adresse électronique comptable est obligatoire."
      );

    }else if(

      !sportFinanceEmailLooksValid(
        profile.accountingEmail
      )
    ){

      errors.push(
        "L’adresse électronique comptable n’est pas valide."
      );
    }


    if(
      profile.email &&
      !sportFinanceEmailLooksValid(
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
        MINIMUM_HT
    ){

      errors.push(
        "Le parrainage minimum est de 50 € HT."
      );
    }


    if(
      extraResearchAmount >
        0 &&

      extraResearchAmount <
        EXTRA_RESEARCH_MINIMUM
    ){

      errors.push(
        "Le soutien recherche supplémentaire est de 10 € minimum."
      );
    }


    if(
      ![
        "ALL_CLUB",
        "HALF_HALF"
      ]
        .includes(
          choice
        )
    ){

      errors.push(
        "Choisissez la destination du parrainage."
      );
    }


    if(
      youth.locked &&
      youth.choice !==
        choice
    ){

      errors.push(
        "La destination doit respecter le choix collectif déjà enregistré pour ce groupe."
      );
    }


    if(
      (
        choice ===
          "HALF_HALF"

        ||

        extraResearchAmount >
          0
      )

      &&

      !association
    ){

      errors.push(
        "Choisissez une association de recherche médicale validée."
      );
    }


    if(
      association &&
      association.validated !==
        true
    ){

      errors.push(
        "L’association choisie doit être préalablement validée."
      );
    }


    if(
      youth.locked &&
      youth.associationId &&
      choice ===
        "HALF_HALF" &&

      (
        !association ||

        String(
          association.id
        ) !==
        String(
          youth.associationId
        )
      )
    ){

      errors.push(
        "L’association doit correspondre au choix collectif déjà enregistré."
      );
    }


    const range =
      sportFinanceDateRange(
        publicationStart
      );


    if(
      !range
    ){

      errors.push(
        "Choisissez le premier jour de diffusion."
      );
    }


    if(
      range &&
      range.start <
        sportFinanceTodayIso()
    ){

      errors.push(
        "La date de diffusion ne peut pas être antérieure à aujourd’hui."
      );
    }


    if(
      !PUBLICITY_TEMPLATES
        .some(
          function(
            item
          ){

            return (
              item.code ===
              templateCode
            );
          }
        )
    ){

      errors.push(
        "Choisissez l’une des quatre formulations proposées."
      );
    }


    return errors;
  }


  /* =========================================================
     POLITIQUES SERVEUR
     ========================================================= */

  function sportFinancePolicies(){

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

        dailyCapacity:
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
          true,

        oneFinalPublicSentenceOnly:
          true,

        releaseOnRefusal:
          true,

        releaseOnCancellation:
          true,

        releaseOnAbandonmentOrExpiry:
          true,

        technicalPublicationFailureDoesNotConsumeCampaign:
          true,

        technicalPublicationFailureRequiresReschedule:
          true
      },


      amounts:{

        sponsorshipMinimumHT:
          MINIMUM_HT,

        extraResearchMinimum:
          EXTRA_RESEARCH_MINIMUM,

        extraResearchAmountKeptSeparate:
          true,

        extraResearchTaxQualificationServerSide:
          true,

        totalPaymentAmountServerRevalidationRequired:
          true
      },


      allocation:{

        youthChoiceMustBeRespectedWhenLocked:
          true,

        finalDistribution:
          "server_only",

        associationShareOnlyIfSelectedAndValidated:
          true,

        associationQualification:
          "server_validate_actual_eligibility",

        noPublicInternalFormula:
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

        clubDocumentAccordingToLegalStatus:
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

        activationAfterControls:
          true,

        securityLogRequired:
          true,

        serverRevalidationRequired:
          true
      }
    };
  }


  /* =========================================================
     CONSTRUCTION DU DOSSIER
     ========================================================= */

  function sportFinanceBuildDraftData(){

    const profile =
      sportFinanceSaveProfile(

        sportFinanceReadProfile()
      );


    const club =
      sportFinanceClub();


    const representative =
      sportFinanceSession();


    const amountHT =
      sportFinanceAmountHT();


    const extraResearchAmount =
      sportFinanceExtraResearchAmount();


    const choice =
      sportFinanceChoice();


    const association =
      sportFinanceSelectedAssociation();


    const publicationStart =
      sportFinanceValue(
        "bcfSportPublicationStart"
      );


    const range =
      sportFinanceDateRange(
        publicationStart
      );


    const templateCode =
      sportFinanceTemplateCode();


    const pendingOffer =
      sportFinanceReadPendingOffer() ||
      {};


    const errors =
      sportFinanceValidate(

        profile,

        club,

        amountHT,

        extraResearchAmount,

        choice,

        association,

        publicationStart,

        templateCode
      );


    if(
      !representative.accountId
    ){

      errors.unshift(
        "L’utilisateur Sport doit être identifié avant de présenter ce parrainage."
      );
    }


    if(
      !pendingOffer.exchange ||
      pendingOffer.exchange.ok !==
        true
    ){

      errors.unshift(
        "La visibilité commerciale est proposée uniquement après un échange Cabas terminé."
      );
    }


    const clubSnapshot =
      sportFinanceClubSnapshot(
        club
      );


    const merchantSnapshot =
      sportFinanceMerchantSnapshot(
        profile
      );


    const associationSnapshot =
      sportFinanceAssociationSnapshot(
        association
      );


    const publicityText =
      sportFinancePublicityText(

        templateCode,

        profile,

        club,

        choice,

        extraResearchAmount
      );


    return {

      errors:
        errors,

      profile:
        profile,

      club:
        club,

      representative:
        representative,

      amountHT:
        amountHT,

      extraResearchAmount:
        extraResearchAmount,

      totalPaymentAmount:
        sportFinanceRound(

          amountHT +
          extraResearchAmount
        ),

      choice:
        choice,

      association:
        association,

      publicationStart:
        range
          ? range.start
          : "",

      publicationEnd:
        range
          ? range.end
          : "",

      templateCode:
        templateCode,

      publicityText:
        publicityText,

      pendingOffer:
        pendingOffer,

      clubSnapshot:
        clubSnapshot,

      merchantSnapshot:
        merchantSnapshot,

      associationSnapshot:
        associationSnapshot
    };
  }


  /* =========================================================
     OUVERTURE DU RÉCAPITULATIF
     ========================================================= */

  async function sportFinanceOpenReview(){

    const core =
      sportFinanceCore();


    const ui =
      sportFinanceUI();


    if(
      !core ||
      !ui ||
      ui.ready !==
        true
    ){

      sportFinanceSetStatus(
        "Le service Finance est momentanément indisponible.",
        "error"
      );

      return;
    }


    const data =
      sportFinanceBuildDraftData();


    if(
      data.errors.length
    ){

      sportFinanceSetStatus(
        data.errors[0],
        "error"
      );

      return;
    }


    sportFinanceSetStatus(
      "Réservation temporaire du créneau…",
      "success"
    );


    try{

      const availability =
        await sportFinanceCheckAvailability(
          data.publicationStart
        );


      if(
        availability.available !==
          true
      ){

        sportFinanceSetStatus(
          "Ce créneau est complet sur au moins une des trois journées.",
          "error"
        );

        return;
      }


      const hold =
        await sportFinanceReserveSlot(

          data.publicationStart,

          {

            merchantRef:
              sportFinanceDigits(
                data.profile.sirenSiret
              ),

            cabasOperationRef:
              sportFinanceText(

                data.pendingOffer.exchange
                  .operationRef
              )
          }
        );


      sportFinanceRenderHoldStatus();


      const operationRef =

        "BCA-SPORT-PARR-" +

        Date.now() +

        "-" +

        Math.random()
          .toString(36)
          .slice(2,7)
          .toUpperCase();


      const previewLines = [

        data.publicityText,

        "Diffusion du " +

        sportFinanceDateFr(
          data.publicationStart
        )

        +

        " au " +

        sportFinanceDateFr(
          data.publicationEnd
        )

        +

        " inclus.",


        "Parrainage : " +

        sportFinanceFormatMoney(
          data.amountHT
        )

        +

        " € HT"

        +

        (
          data.extraResearchAmount >
            0

            ? " — soutien recherche supplémentaire : " +

              sportFinanceFormatMoney(
                data.extraResearchAmount
              )

              +

              " €"

            : ""
        )
      ];


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
          sportFinanceDigits(
            data.profile.sirenSiret
          ),

        payerSnapshot:
          data.merchantSnapshot,

        merchantSnapshot:
          data.merchantSnapshot,

        representativeRef:
          data.representative.accountId,

        representative:
          data.representative,

        presentedAt:
          sportFinanceNow(),

        identityVersion:
          data.profile.updatedAt,

        clubRef:
          data.clubSnapshot.clubRef,

        clubSnapshot:
          data.clubSnapshot,

        beneficiaryRefs:[

          data.clubSnapshot.clubRef,

          data.associationSnapshot
            ? data.associationSnapshot.id
            : ""

        ].filter(
          Boolean
        ),

        amountHT:
          data.amountHT,

        extraResearchAmount:
          data.extraResearchAmount,

        totalPaymentAmount:
          data.totalPaymentAmount,

        allocationCode:
          data.choice,

        associationId:

          data.associationSnapshot
            ? data.associationSnapshot.id
            : "",

        associationSnapshot:
          data.associationSnapshot,

        publicationDays:
          PUBLICATION_DAYS,

        publicationStart:
          data.publicationStart,

        publicationEnd:
          data.publicationEnd,

        slotHoldId:
          hold.slotHoldId,

        slotHoldExpiresAt:
          hold.expiresAt,

        publicityTemplateCode:
          data.templateCode,

        publicityText:
          data.publicityText,

        publicSentenceCount:
          1,

        cabasOperationRef:
          sportFinanceText(

            data.pendingOffer.exchange
              .operationRef
          ),

        purchaseReference:
          sportFinanceText(

            data.pendingOffer.purchase &&
            data.pendingOffer.purchase.reference
          ),

        paymentChannel:
          "card_psp",

        paymentPresentation:{

          cardNetworks:[
            "visa",
            "mastercard"
          ],

          dynamicQr:
            true
        },

        financePolicies:
          sportFinancePolicies(),

        previewLines:
          previewLines,

        previewText:
          previewLines.join(
            " — "
          )
      });


      sportFinanceUpsertOperation({

        operationRef:
          operationRef,

        status:
          "draft",

        amountHT:
          data.amountHT,

        extraResearchAmount:
          data.extraResearchAmount,

        totalPaymentAmount:
          data.totalPaymentAmount,

        allocationCode:
          data.choice,

        clubRef:
          data.clubSnapshot.clubRef,

        clubName:

          data.clubSnapshot.name ||
          data.clubSnapshot.officialName,

        payerRef:
          sportFinanceDigits(
            data.profile.sirenSiret
          ),

        merchantName:
          data.profile.name,

        representativeRef:
          data.representative.accountId,

        representativeName:
          data.representative.name,

        associationId:

          data.associationSnapshot
            ? data.associationSnapshot.id
            : "",

        associationName:

          data.associationSnapshot
            ? data.associationSnapshot.name
            : "",

        publicationDays:
          PUBLICATION_DAYS,

        publicationStart:
          data.publicationStart,

        publicationEnd:
          data.publicationEnd,

        slotHoldId:
          hold.slotHoldId,

        publicityText:
          data.publicityText,

        publicityTemplateCode:
          data.templateCode,

        cabasOperationRef:
          sportFinanceText(

            data.pendingOffer.exchange
              .operationRef
          )
      });


      sportFinanceSetStatus(
        "Créneau réservé temporairement. Vérifiez le récapitulatif avant paiement.",
        "success"
      );


      sportFinanceRenderLatestOperation();


    }catch(error){

      sportFinanceSetStatus(

        error &&
        error.message

          ? error.message

          : "Le créneau n’a pas pu être réservé.",

        "error"
      );
    }
  }


  /* =========================================================
     CORRECTION IDENTITÉ
     ========================================================= */

  function sportFinanceEditIdentity(
    context
  ){

    activeCorrectionDraftId =
      sportFinanceText(

        context &&
        context.draftId
      );


    const firstField =
      sportFinanceField(
        "bcfSportMerchantName"
      );


    const returnButton =
      sportFinanceField(
        "bcfSportReturnToReview"
      );


    const correctionNotice =
      sportFinanceField(
        "bcfSportCorrectionNotice"
      );


    if(
      correctionNotice
    ){

      correctionNotice.style.display =
        "block";
    }


    if(
      returnButton
    ){

      returnButton.style.display =
        "block";
    }


    if(
      firstField
    ){

      firstField.scrollIntoView({

        behavior:
          "smooth",

        block:
          "center"
      });


      window.setTimeout(
        function(){

          firstField.focus();

        },
        300
      );
    }
  }


  function sportFinanceReturnToReview(){

    const ui =
      sportFinanceUI();


    const draftId =
      activeCorrectionDraftId;


    if(
      !ui ||
      !draftId
    ){

      return;
    }


    const data =
      sportFinanceBuildDraftData();


    if(
      data.errors.length
    ){

      sportFinanceSetStatus(
        data.errors[0],
        "error"
      );

      return;
    }


    if(
      !currentHold ||
      !currentHold.slotHoldId ||
      Number(
        currentHold.expiresAt ||
        0
      ) <=
      Date.now()
    ){

      sportFinanceSetStatus(
        "La réservation temporaire a expiré. Reprenez le récapitulatif pour réserver de nouveau les dates.",
        "error"
      );

      return;
    }


    const previewLines = [

      data.publicityText,

      "Diffusion du " +

      sportFinanceDateFr(
        data.publicationStart
      )

      +

      " au " +

      sportFinanceDateFr(
        data.publicationEnd
      )

      +

      " inclus.",


      "Parrainage : " +

      sportFinanceFormatMoney(
        data.amountHT
      )

      +

      " € HT"

      +

      (
        data.extraResearchAmount >
          0

          ? " — soutien recherche supplémentaire : " +

            sportFinanceFormatMoney(
              data.extraResearchAmount
            )

            +

            " €"

          : ""
      )
    ];


    const returnButton =
      sportFinanceField(
        "bcfSportReturnToReview"
      );


    const correctionNotice =
      sportFinanceField(
        "bcfSportCorrectionNotice"
      );


    if(
      returnButton
    ){

      returnButton.style.display =
        "none";
    }


    if(
      correctionNotice
    ){

      correctionNotice.style.display =
        "none";
    }


    activeCorrectionDraftId =
      "";


    ui.resumeAfterIdentityEdit(

      draftId,

      {

        payerRef:
          sportFinanceDigits(
            data.profile.sirenSiret
          ),

        payerSnapshot:
          data.merchantSnapshot,

        merchantSnapshot:
          data.merchantSnapshot,

        identityVersion:
          data.profile.updatedAt,

        amountHT:
          data.amountHT,

        extraResearchAmount:
          data.extraResearchAmount,

        totalPaymentAmount:
          data.totalPaymentAmount,

        allocationCode:
          data.choice,

        clubRef:
          data.clubSnapshot.clubRef,

        clubSnapshot:
          data.clubSnapshot,

        associationId:

          data.associationSnapshot
            ? data.associationSnapshot.id
            : "",

        associationSnapshot:
          data.associationSnapshot,

        beneficiaryRefs:[

          data.clubSnapshot.clubRef,

          data.associationSnapshot
            ? data.associationSnapshot.id
            : ""

        ].filter(
          Boolean
        ),

        publicationDays:
          PUBLICATION_DAYS,

        publicationStart:
          data.publicationStart,

        publicationEnd:
          data.publicationEnd,

        slotHoldId:
          currentHold.slotHoldId,

        slotHoldExpiresAt:
          currentHold.expiresAt,

        publicityTemplateCode:
          data.templateCode,

        publicityText:
          data.publicityText,

        publicSentenceCount:
          1,

        financePolicies:
          sportFinancePolicies(),

        previewLines:
          previewLines,

        previewText:
          previewLines.join(
            " — "
          )
      }
    );
  }


  /* =========================================================
     PAYLOAD CHECKOUT
     ========================================================= */

  function sportFinanceCheckoutPayload(
    request
  ){

    const core =
      sportFinanceCore();


    const base =

      request &&
      typeof request ===
        "object"

        ? request

        : {};


    const draft =

      core &&
      typeof core.getDraft ===
        "function"

        ? core.getDraft(
            base.draftId
          )

        : null;


    if(
      !draft
    ){

      throw new Error(
        "Le dossier Finance Sport est introuvable."
      );
    }


    if(
      !sportFinanceText(
        draft.slotHoldId
      )

      ||

      !sportFinanceText(
        draft.publicationStart
      )

      ||

      !sportFinanceText(
        draft.publicationEnd
      )
    ){

      throw new Error(
        "La réservation de diffusion est incomplète."
      );
    }


    return Object.assign(

      {},

      sportFinanceClone(
        base
      ) ||
      {},

      {

        connectorName:
          CONNECTOR_NAME,

        operationRef:
          sportFinanceText(
            draft.operationRef
          ),

        representativeRef:
          sportFinanceText(
            draft.representativeRef
          ),

        representative:
          sportFinanceClone(
            draft.representative
          ) ||
          null,

        payerSnapshot:
          sportFinanceClone(

            draft.payerSnapshot ||
            draft.merchantSnapshot

          ) ||
          null,

        merchantSnapshot:
          sportFinanceClone(

            draft.merchantSnapshot ||
            draft.payerSnapshot

          ) ||
          null,

        clubRef:
          sportFinanceText(
            draft.clubRef
          ),

        clubSnapshot:
          sportFinanceClone(
            draft.clubSnapshot
          ) ||
          null,

        associationId:
          sportFinanceText(
            draft.associationId
          ),

        associationSnapshot:
          sportFinanceClone(
            draft.associationSnapshot
          ) ||
          null,

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

            (
              Number(
                draft.amountHT ||
                0
              )

              +

              Number(
                draft.extraResearchAmount ||
                0
              )
            )
          ),

        allocationCode:
          sportFinanceText(
            draft.allocationCode
          ),

        publicationDays:
          Number(

            draft.publicationDays ||
            PUBLICATION_DAYS
          ),

        publicationStart:
          sportFinanceText(
            draft.publicationStart
          ),

        publicationEnd:
          sportFinanceText(
            draft.publicationEnd
          ),

        slotHoldId:
          sportFinanceText(
            draft.slotHoldId
          ),

        slotHoldExpiresAt:
          Number(
            draft.slotHoldExpiresAt ||
            0
          ),

        publicityTemplateCode:
          sportFinanceText(
            draft.publicityTemplateCode
          ),

        publicityText:
          sportFinanceText(
            draft.publicityText
          ),

        publicSentenceCount:
          1,

        cabasOperationRef:
          sportFinanceText(
            draft.cabasOperationRef
          ),

        purchaseReference:
          sportFinanceText(
            draft.purchaseReference
          ),

        paymentChannel:
          sportFinanceText(

            draft.paymentChannel ||
            "card_psp"
          ),

        paymentPresentation:
          sportFinanceClone(
            draft.paymentPresentation
          )

          ||

          {

            cardNetworks:[
              "visa",
              "mastercard"
            ],

            dynamicQr:
              true
          },

        financePolicies:
          sportFinanceClone(
            draft.financePolicies
          )

          ||

          sportFinancePolicies(),

        serverMustRevalidate:
          true,

        clientAccountingIsFinal:
          false,

        extraResearchTaxQualification:
          "server_only"
      }
    );
  }


  /* =========================================================
     DÉMARRAGE DU PAIEMENT
     ========================================================= */

  async function sportFinanceStartCheckout(
    request
  ){

    const core =
      sportFinanceCore();


    if(
      !core
    ){

      throw new Error(
        "Le cœur Finance n'est pas chargé."
      );
    }


    const payload =
      sportFinanceCheckoutPayload(
        request
      );


    if(
      Number(
        payload.slotHoldExpiresAt ||
        0
      ) >
      0

      &&

      Number(
        payload.slotHoldExpiresAt
      ) <=
      Date.now()
    ){

      await sportFinanceReleaseHold(
        "hold_expired_before_checkout"
      );


      throw new Error(
        "La réservation temporaire a expiré. Reprenez les dates avant le paiement."
      );
    }


    let responseData =
      null;


    try{

      if(
        sportFinanceIsProduction()
      ){

        responseData =
          await sportFinanceServerPost(

            "/payments/checkout",

            payload
          );

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


        responseData =
          await window
            .BociteFinanceTest
            .startCheckout(
              payload
            );
      }


      if(
        !responseData ||
        responseData.ok !==
          true ||
        !sportFinanceText(
          responseData.paymentReference
        )
      ){

        throw new Error(
          "Le paiement sécurisé n'a pas pu être préparé."
        );
      }


      if(
        !sportFinanceIsProduction()
      ){

        const rows =
          sportFinanceReadLocalSlots();


        const index =
          rows.findIndex(
            function(
              item
            ){

              return (
                sportFinanceText(
                  item.id
                ) ===
                payload.slotHoldId
              );
            }
          );


        if(
          index >=
          0
        ){

          rows[index]
            .status =
              "payment_pending";

          rows[index]
            .paymentReference =
              sportFinanceText(
                responseData.paymentReference
              );


          sportFinanceWriteLocalSlots(
            rows
          );
        }
      }


      sportFinanceUpsertOperation({

        draftId:
          sportFinanceText(
            payload.draftId
          ),

        operationRef:
          sportFinanceText(
            payload.operationRef
          ),

        paymentReference:
          sportFinanceText(
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
          sportFinanceText(
            payload.allocationCode
          ),

        clubRef:
          sportFinanceText(
            payload.clubRef
          ),

        representativeRef:
          sportFinanceText(
            payload.representativeRef
          ),

        associationId:
          sportFinanceText(
            payload.associationId
          ),

        publicationDays:
          PUBLICATION_DAYS,

        publicationStart:
          sportFinanceText(
            payload.publicationStart
          ),

        publicationEnd:
          sportFinanceText(
            payload.publicationEnd
          ),

        slotHoldId:
          sportFinanceText(
            payload.slotHoldId
          ),

        publicityText:
          sportFinanceText(
            payload.publicityText
          )
      });


      sportFinanceRenderLatestOperation();


      return responseData;


    }catch(error){

      await sportFinanceReleaseHold(
        "checkout_failed"
      );


      throw error;
    }
  }


  /* =========================================================
     INTERFACE
     ========================================================= */

  function sportFinanceAssociationOptions(
    selectedId
  ){

    const associations =
      sportFinanceAssociations();


    if(
      !associations.length
    ){

      return `

        <option value="">

          En attente du choix défini
          par la mairie et Bo'CitéArt

        </option>

      `;
    }


    return `

      <option value="">
        Choisir l’association
      </option>

      ${
        associations
          .map(
            function(
              item
            ){

              return `

                <option
                  value="${sportFinanceEscape(
                    item.id
                  )}"
                  ${
                    String(
                      item.id
                    ) ===
                    String(
                      selectedId ||
                      ""
                    )

                      ? "selected"

                      : ""
                  }
                >
                  ${sportFinanceEscape(
                    item.name
                  )}
                </option>

              `;
            }
          )
          .join("")
      }

    `;
  }


  function sportFinanceRender(){

    const mount =
      sportFinanceField(
        MOUNT_ID
      );


    if(
      !mount
    ){

      return;
    }


    const pendingOffer =
      sportFinanceReadPendingOffer();


    if(
      !pendingOffer ||
      !pendingOffer.exchange ||
      pendingOffer.exchange.ok !==
        true
    ){

      mount.innerHTML =
        "";

      mount.dataset.financeOfferId =
        "";

      return;
    }


    if(
      mount.dataset.financeOfferId ===
      sportFinanceText(
        pendingOffer.id
      )
    ){

      sportFinanceRenderHoldStatus();

      return;
    }


    const profile =
      sportFinanceInitialProfile();


    const associations =
      sportFinanceAssociations();


    const representative =
      sportFinanceSession();


    const youth =
      sportFinanceYouthLockedChoice();


    const lockedChoice =
      youth.locked
        ? youth.choice
        : "";


    const selectedAssociationId =
      youth.locked
        ? youth.associationId
        : "";


    mount.dataset.financeOfferId =
      sportFinanceText(
        pendingOffer.id
      );


    mount.innerHTML = `

      <div class="sportCard">


        <div class="sportSubTitle">

          Visibilité commerciale après le Cabas avec

          <span class="bociteSportLogo">

            Bo'Cité

            <span class="bociteSportArt">
              Art
            </span>

          </span>

        </div>


        <div
          class="sportText"
          style="margin-top:10px;"
        >

          L’échange du Cabas est terminé.

          Le commerçant peut maintenant choisir,
          indépendamment de cet échange,
          une visibilité locale de

          <strong>
            3 jours consécutifs
          </strong>.

          <br><br>

          Le parrainage commence à

          <strong>
            50 € HT
          </strong>.

          Jusqu’à

          <strong>
            6 commerces
          </strong>

          peuvent être diffusés simultanément
          par jour.

          <br><br>

          Les dates sont connues avant paiement.

          Le créneau est ensuite réservé
          temporairement pendant

          <strong>
            15 minutes
          </strong>.

          En cas de préparation manuelle
          réellement en cours,
          la réservation peut être prolongée de

          <strong>
            5 minutes
          </strong>.

        </div>


        <div
          class="sportStatus"
          style="margin-top:12px;"
        >

          Cabas validé

          ${
            pendingOffer.exchange
              .operationRef

              ? " — Réf. " +

                sportFinanceEscape(

                  pendingOffer.exchange
                    .operationRef
                )

              : ""
          }

        </div>


        <div class="sportStatus">

          Présenté par

          <strong>

            ${sportFinanceEscape(

              representative.name ||
              "Utilisateur Sport autorisé"

            )}

          </strong>


          ${
            representative.team

              ? " — Équipe : " +

                sportFinanceEscape(
                  representative.team
                )

              : ""
          }

        </div>


        <div class="sportCard">

          <div class="sportSubTitle">

            Informations du commerçant

          </div>


          <div
            class="sportText"
            style="margin-top:8px;"
          >

            Les informations connues
            sont préremplies.

            Elles restent modifiables
            avant paiement
            pour corriger une erreur
            ou compléter la fiche.

          </div>


          <div
            id="bcfSportCorrectionNotice"
            class="sportStatus"
            style="display:none;"
          >

            Corrigez les informations nécessaires,
            puis revenez au récapitulatif.

          </div>


          <label class="sportLabel">

            Nom ou enseigne

          </label>


          <input
            id="bcfSportMerchantName"
            class="sportField"
            value="${sportFinanceEscape(

              profile.name ||
              profile.shopName ||
              profile.companyName

            )}"
          >


          <label class="sportLabel">

            SIREN / SIRET

          </label>


          <input
            id="bcfSportMerchantSiret"
            class="sportField"
            inputmode="numeric"
            value="${sportFinanceEscape(

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
            value="${sportFinanceEscape(

              profile.vatNumber ||
              profile.vat ||
              ""

            )}"
          >


          <label class="sportLabel">

            Adresse professionnelle

          </label>


          <input
            id="bcfSportMerchantAddress"
            class="sportField"
            value="${sportFinanceEscape(
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
            value="${sportFinanceEscape(
              profile.phone
            )}"
          >


          <label class="sportLabel">

            Site

          </label>


          <input
            id="bcfSportMerchantWebsite"
            class="sportField"
            value="${sportFinanceEscape(

              profile.website ||
              profile.site

            )}"
          >


          <label class="sportLabel">

            Email

          </label>


          <input
            id="bcfSportMerchantEmail"
            class="sportField"
            type="email"
            value="${sportFinanceEscape(
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
            value="${sportFinanceEscape(

              profile.accountingEmail ||
              profile.email

            )}"
          >


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

            Montant et choix du groupe

          </div>


          <label class="sportLabel">

            Parrainage en € HT

          </label>


          <input
            id="bcfSportAmountHT"
            class="sportField"
            type="number"
            min="50"
            step="0.01"
            value="50"
          >


          ${
            youth.locked

              ? `

                  <div class="sportStatus">

                    Choix collectif enregistré pour

                    <strong>

                      ${sportFinanceEscape(

                        youth.groupName ||
                        "le groupe"

                      )}

                    </strong>

                    :

                    <strong>

                      ${
                        youth.choice ===
                          "HALF_HALF"

                          ? "50 % pour le club / 50 % pour la recherche médicale"

                          : "100 % pour le club"
                      }

                    </strong>.

                    Ce choix est repris
                    automatiquement ici.

                  </div>

                `

              : `

                  <div class="sportStatus">

                    Aucun choix collectif verrouillé
                    n’est rattaché à cette session.

                    La destination doit donc être
                    sélectionnée pour ce dossier.

                  </div>

                `
          }


          <label class="sportCheck">

            <input
              type="radio"
              name="bcfSportAllocation"
              value="ALL_CLUB"
              ${
                lockedChoice ===
                  "ALL_CLUB"

                  ? "checked"

                  : ""
              }
              ${
                youth.locked

                  ? "disabled"

                  : ""
              }
            >

            <span>

              <strong>
                100 % pour le club
              </strong>

            </span>

          </label>


          <label class="sportCheck">

            <input
              type="radio"
              name="bcfSportAllocation"
              value="HALF_HALF"
              ${
                lockedChoice ===
                  "HALF_HALF"

                  ? "checked"

                  : ""
              }
              ${
                youth.locked

                  ? "disabled"

                  : ""
              }
              ${
                associations.length

                  ? ""

                  : "disabled"
              }
            >

            <span>

              <strong>

                50 % pour le club /
                50 % pour la recherche médicale

              </strong>

            </span>

          </label>


          <label
            class="sportCheck"
            style="margin-top:14px;"
          >

            <input
              id="bcfSportExtraResearchEnabled"
              type="checkbox"
            >

            <span>

              Ajouter un soutien supplémentaire
              à la recherche médicale

            </span>

          </label>


          <div
            id="bcfSportExtraResearchBox"
            style="
              display:none;
              margin-top:8px;
            "
          >

            <label class="sportLabel">

              Montant supplémentaire en €

            </label>


            <input
              id="bcfSportExtraResearchAmount"
              class="sportField"
              type="number"
              min="10"
              step="0.01"
              value="10"
            >


            <div class="sportStatus">

              Minimum : 10 €.

              Ce montant reste séparé
              du parrainage en € HT.

              Sa qualification fiscale définitive
              est validée côté serveur.

            </div>

          </div>


          <div
            id="bcfSportAssociationBox"
            style="
              display:${
                lockedChoice ===
                  "HALF_HALF"

                  ? "block"

                  : "none"
              };
              margin-top:12px;
            "
          >

            <label class="sportLabel">

              Association de recherche médicale

            </label>


            <select
              id="bcfSportAssociation"
              class="sportField"

              ${
                associations.length

                  ? ""

                  : "disabled"
              }

              ${
                youth.locked &&
                youth.associationId

                  ? "disabled"

                  : ""
              }
            >

              ${sportFinanceAssociationOptions(
                selectedAssociationId
              )}

            </select>

          </div>


          ${
            associations.length

              ? ""

              : `

                  <div class="sportStatus">

                    Associations de recherche :
                    en attente du choix défini
                    par la mairie et Bo'CitéArt.

                  </div>

                `
          }

        </div>


        <div class="sportCard">

          <div class="sportSubTitle">

            Dates de diffusion

          </div>


          <div
            class="sportText"
            style="margin-top:8px;"
          >

            Choisissez le premier jour.

            Les deux jours suivants
            sont ajoutés automatiquement.

          </div>


          <label class="sportLabel">

            Premier jour de diffusion

          </label>


          <input
            id="bcfSportPublicationStart"
            class="sportField"
            type="date"
            min="${sportFinanceEscape(
              sportFinanceTodayIso()
            )}"
            value="${sportFinanceEscape(
              sportFinanceTodayIso()
            )}"
          >


          <div
            id="bcfSportDatePreview"
            class="sportStatus"
          ></div>


          <button
            id="bcfSportCheckAvailability"
            class="sportBtn"
            type="button"
            style="
              width:100%;
              margin-top:10px;
            "
          >

            Vérifier la disponibilité
            de ces 3 jours

          </button>


          <div
            id="bcfSportAvailabilityStatus"
            class="sportStatus"
          ></div>


          <div
            id="bcfSportHoldStatus"
            class="sportStatus"
          >

            Aucun créneau
            n’est actuellement réservé.

          </div>


          <button
            id="bcfSportExtendHold"
            class="sportBtn"
            type="button"
            style="
              display:none;
              width:100%;
              margin-top:10px;
            "
          >

            Prolonger la réservation
            de 5 minutes

          </button>

        </div>


        <div class="sportCard">

          <div class="sportSubTitle">

            Choisissez l’une
            des 4 bandes privées

          </div>


          <div
            class="sportText"
            style="margin-top:8px;"
          >

            Ces quatre formulations servent
            uniquement à choisir
            la phrase finale avant paiement.

            Une seule phrase sera publiée
            après confirmation du paiement.

          </div>


          <div
            id="bcfSportTemplateList"
          ></div>

        </div>


        <div class="sportCard">


          <div class="sportStatus">

            Avant paiement,
            vous connaissez les dates,
            le montant du parrainage,
            l’éventuel soutien recherche supplémentaire
            et la phrase qui sera diffusée.

            <br><br>

            La publication ne démarre jamais
            sur la seule foi du navigateur.

            Elle est activée uniquement
            après confirmation effective
            du prestataire de paiement.

            <br><br>

            En cas de refus,
            d’abandon
            ou d’expiration,
            le créneau est libéré.

            Si un incident technique
            empêche la publication
            après paiement,
            la campagne n’est pas consommée
            et doit être reprogrammée.

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

            Continuer vers le paiement

          </button>


          <div
            id="bcfSportStatus"
            class="sportStatus"
          >

            Complétez les informations
            puis vérifiez le récapitulatif.

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

            Aucune opération de parrainage
            enregistrée sur cet appareil.

          </div>

        </div>


      </div>

    `;


    const allocationRadios =
      mount.querySelectorAll(
        'input[name="bcfSportAllocation"]'
      );


    allocationRadios
      .forEach(
        function(
          radio
        ){

          radio.addEventListener(
            "change",
            function(){

              sportFinanceUpdateResearchBox();

              sportFinanceRenderTemplates();
            }
          );
        }
      );


    const extraEnabled =
      sportFinanceField(
        "bcfSportExtraResearchEnabled"
      );


    if(
      extraEnabled
    ){

      extraEnabled.onchange =
        function(){

          sportFinanceUpdateResearchBox();

          sportFinanceRenderTemplates();
        };
    }


    const extraAmount =
      sportFinanceField(
        "bcfSportExtraResearchAmount"
      );


    if(
      extraAmount
    ){

      extraAmount.oninput =
        sportFinanceRenderTemplates;
    }


    [

      "bcfSportMerchantName",
      "bcfSportMerchantAddress",
      "bcfSportMerchantPhone",
      "bcfSportMerchantEmail",
      "bcfSportMerchantWebsite"

    ].forEach(
      function(
        id
      ){

        const field =
          sportFinanceField(
            id
          );


        if(
          field
        ){

          field.oninput =
            sportFinanceRenderTemplates;
        }
      }
    );


    const dateField =
      sportFinanceField(
        "bcfSportPublicationStart"
      );


    if(
      dateField
    ){

      dateField.onchange =
        async function(){

          if(
            currentHold &&
            currentHold.slotHoldId
          ){

            await sportFinanceReleaseHold(
              "publication_date_changed"
            );
          }


          sportFinanceUpdateDatePreview();
        };
    }


    const checkAvailability =
      sportFinanceField(
        "bcfSportCheckAvailability"
      );


    if(
      checkAvailability
    ){

      checkAvailability.onclick =
        sportFinanceShowAvailability;
    }


    const extendHold =
      sportFinanceField(
        "bcfSportExtendHold"
      );


    if(
      extendHold
    ){

      extendHold.onclick =
        async function(){

          try{

            await sportFinanceExtendHold();


            sportFinanceSetStatus(
              "La réservation a été prolongée de 5 minutes.",
              "success"
            );

          }catch(error){

            sportFinanceSetStatus(

              error &&
              error.message

                ? error.message

                : "La réservation n’a pas pu être prolongée.",

              "error"
            );
          }
        };
    }


    const openReview =
      sportFinanceField(
        "bcfSportOpenReview"
      );


    if(
      openReview
    ){

      openReview.onclick =
        sportFinanceOpenReview;
    }


    const returnToReview =
      sportFinanceField(
        "bcfSportReturnToReview"
      );


    if(
      returnToReview
    ){

      returnToReview.onclick =
        sportFinanceReturnToReview;
    }


    if(
      youth.locked &&
      lockedChoice
    ){

      const lockedRadio =
        mount.querySelector(

          'input[name="bcfSportAllocation"][value="' +

          lockedChoice +

          '"]'
        );


      if(
        lockedRadio
      ){

        lockedRadio.checked =
          true;
      }
    }


    sportFinanceUpdateResearchBox();

    sportFinanceUpdateDatePreview();

    sportFinanceRenderTemplates();

    sportFinanceRenderHoldStatus();

    sportFinanceRenderLatestOperation();
  }


  /* =========================================================
     RETOUR DES ÉTATS FINANCE
     ========================================================= */

  async function sportFinanceHandleStatus(
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


    sportFinanceUpsertOperation({

      draftId:
        sportFinanceText(
          draft.draftId
        ),

      operationRef:
        sportFinanceText(
          draft.operationRef
        ),

      paymentReference:
        sportFinanceText(
          draft.paymentReference
        ),

      serverReference:
        sportFinanceText(
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
        sportFinanceText(
          draft.allocationCode
        ),

      clubRef:
        sportFinanceText(
          draft.clubRef
        ),

      representativeRef:
        sportFinanceText(
          draft.representativeRef
        ),

      associationId:
        sportFinanceText(
          draft.associationId
        ),

      publicationDays:
        Number(

          draft.publicationDays ||
          PUBLICATION_DAYS
        ),

      publicationStart:
        sportFinanceText(
          draft.publicationStart
        ),

      publicationEnd:
        sportFinanceText(
          draft.publicationEnd
        ),

      slotHoldId:
        sportFinanceText(
          draft.slotHoldId
        ),

      publicityText:
        sportFinanceText(
          draft.publicityText
        ),

      paidAt:
        sportFinanceText(
          draft.paidAt
        )
    });


    if(
      status ===
        "paid"
    ){

      sportFinanceCommitLocalHold(
        draft
      );


      sportFinanceSetStatus(

        "Paiement confirmé. La diffusion est programmée du " +

        sportFinanceDateFr(
          draft.publicationStart
        )

        +

        " au " +

        sportFinanceDateFr(
          draft.publicationEnd
        )

        +

        " inclus. Phrase publique : " +

        sportFinanceText(
          draft.publicityText
        ),

        "success"
      );


      sportFinanceWritePendingOffer(
        null
      );


      currentHold =
        null;


      window.setTimeout(
        sportFinanceRender,
        0
      );
    }


    if(
      status ===
        "refused"

      ||

      status ===
        "cancelled"
    ){

      if(
        draft.slotHoldId
      ){

        currentHold = {

          slotHoldId:
            sportFinanceText(
              draft.slotHoldId
            ),

          publicationStart:
            sportFinanceText(
              draft.publicationStart
            ),

          publicationEnd:
            sportFinanceText(
              draft.publicationEnd
            ),

          expiresAt:
            Number(
              draft.slotHoldExpiresAt ||
              0
            ),

          mode:
            sportFinanceIsProduction()

              ? "server"

              : "local"
        };
      }


      await sportFinanceReleaseHold(

        status ===
          "refused"

          ? "payment_refused"

          : "payment_cancelled"
      );


      sportFinanceSetStatus(

        status ===
          "refused"

          ? "Paiement refusé. Aucune diffusion n’est activée et le créneau est libéré."

          : "Paiement annulé. Aucune diffusion n’est activée et le créneau est libéré.",

        "error"
      );
    }


    if(
      status ===
        "refunded"
    ){

      if(
        draft.slotHoldId
      ){

        currentHold = {

          slotHoldId:
            sportFinanceText(
              draft.slotHoldId
            ),

          publicationStart:
            sportFinanceText(
              draft.publicationStart
            ),

          publicationEnd:
            sportFinanceText(
              draft.publicationEnd
            ),

          expiresAt:
            Number(
              draft.slotHoldExpiresAt ||
              0
            ),

          mode:
            sportFinanceIsProduction()

              ? "server"

              : "local"
        };
      }


      await sportFinanceReleaseHold(
        "payment_refunded"
      );


      sportFinanceSetStatus(
        "Paiement remboursé. Le dossier est rapproché côté serveur et le créneau non consommé doit être libéré ou reprogrammé selon son état réel.",
        "success"
      );
    }


    if(
      status ===
        "disputed"
    ){

      sportFinanceSetStatus(
        "Paiement contesté. Le dossier est placé sous contrôle avant toute suite.",
        "error"
      );
    }


    if(
      status ===
        "payment_pending"
    ){

      sportFinanceSetStatus(
        "Paiement en cours. La publicité ne sera diffusée qu’après confirmation effective.",
        "success"
      );
    }


    sportFinanceRenderLatestOperation();
  }


  function sportFinanceInstallEvents(){

    if(
      financeEventsInstalled
    ){

      return;
    }


    const core =
      sportFinanceCore();


    if(
      !core ||
      core.ready !==
        true ||
      typeof core.on !==
        "function"
    ){

      return;
    }


    financeEventsInstalled =
      true;


    [

      "payment-pending",

      "payment-payment_pending",

      "payment-paid",

      "payment-refused",

      "payment-cancelled",

      "payment-refunded",

      "payment-disputed"

    ].forEach(
      function(
        eventName
      ){

        core.on(

          eventName,

          function(
            draft
          ){

            const normalizedStatus =

              (
                eventName ===
                  "payment-pending"

                ||

                eventName ===
                  "payment-payment_pending"
              )

                ? "payment_pending"

                : eventName.replace(
                    "payment-",
                    ""
                  );


            sportFinanceHandleStatus(
              normalizedStatus,
              draft
            );
          }
        );
      }
    );


    core.on(

      "draft-deleted",

      function(
        detail
      ){

        const draftId =
          sportFinanceText(

            detail &&
            detail.draftId
          );


        const operation =
          sportFinanceReadOperations()
            .find(
              function(
                item
              ){

                return (
                  sportFinanceText(
                    item.draftId
                  ) ===
                  draftId
                );
              }
            );


        if(
          operation &&
          operation.slotHoldId
        ){

          currentHold = {

            slotHoldId:
              sportFinanceText(
                operation.slotHoldId
              ),

            publicationStart:
              sportFinanceText(
                operation.publicationStart
              ),

            publicationEnd:
              sportFinanceText(
                operation.publicationEnd
              ),

            expiresAt:
              0
          };


          sportFinanceReleaseHold(
            "draft_abandoned"
          );
        }
      }
    );


    window.addEventListener(

      "bociteart:sport-publication-failed",

      function(
        event
      ){

        sportFinanceMarkPublicationFailure(

          event &&
          event.detail
        );
      }
    );
  }


  /* =========================================================
     APRÈS CABAS — PORTE D'ENTRÉE UNIQUE
     ========================================================= */

  function sportFinanceAfterCabasExchange(
    context
  ){

    const source =

      context &&
      typeof context ===
        "object"

        ? context

        : {};


    const exchange =

      source.exchange &&
      typeof source.exchange ===
        "object"

        ? source.exchange

        : null;


    if(
      !exchange ||
      exchange.ok !==
        true
    ){

      return {

        ok:
          false,

        reason:
          "cabas_not_completed"
      };
    }


    const merchant =

      source.merchant &&
      typeof source.merchant ===
        "object"

        ? source.merchant

        : {};


    const purchase =

      source.purchase &&
      typeof source.purchase ===
        "object"

        ? source.purchase

        : {};


    const offer = {

      id:
        sportFinanceId(
          "sport-offer"
        ),

      exchange:
        sportFinanceClone(
          exchange
        ),

      merchant:
        sportFinanceClone(
          merchant
        ),

      purchase:
        sportFinanceClone(
          purchase
        ),

      createdAt:
        sportFinanceNow(),

      status:
        "available_after_cabas"
    };


    sportFinanceWritePendingOffer(
      offer
    );


    const saved =
      sportFinanceReadSavedProfile();


    sportFinanceSaveProfile(

      Object.assign(

        {},

        saved,

        merchant,

        {

          updatedAt:
            sportFinanceNow()
        }
      )
    );


    const mount =
      sportFinanceField(
        MOUNT_ID
      );


    if(
      mount
    ){

      mount.dataset.financeOfferId =
        "";
    }


    sportFinanceRender();


    window.setTimeout(
      function(){

        const target =
          sportFinanceField(
            MOUNT_ID
          );


        if(
          target
        ){

          target.scrollIntoView({

            behavior:
              "smooth",

            block:
              "start"
          });
        }
      },
      80
    );


    return {

      ok:
        true,

      offerId:
        offer.id
    };
  }


  /* =========================================================
     ÉCHEC TECHNIQUE DE PUBLICATION APRÈS PAIEMENT
     ========================================================= */

  function sportFinanceMarkPublicationFailure(
    detail
  ){

    const source =

      detail &&
      typeof detail ===
        "object"

        ? detail

        : {};


    const operationRef =
      sportFinanceText(
        source.operationRef
      );


    const paymentReference =
      sportFinanceText(
        source.paymentReference
      );


    const operation =
      sportFinanceUpsertOperation({

        operationRef:
          operationRef,

        paymentReference:
          paymentReference,

        slotHoldId:
          sportFinanceText(
            source.slotHoldId
          ),

        publicationStart:
          sportFinanceText(
            source.publicationStart
          ),

        publicationEnd:
          sportFinanceText(
            source.publicationEnd
          ),

        publicationStatus:
          "reschedule_required",

        campaignConsumed:
          false,

        status:
          sportFinanceText(

            source.status ||
            "paid"
          )
      });


    sportFinanceMarkLocalPublicationFailure(

      operation ||
      source
    );


    sportFinanceSetStatus(
      "Le paiement reste enregistré, mais la diffusion n’a pas pu être réalisée. La campagne n’est pas consommée et doit être reprogrammée.",
      "error"
    );


    sportFinanceRenderLatestOperation();


    return operation;
  }


  /* =========================================================
     INSTALLATION
     ========================================================= */

  function sportFinanceInstall(){

    const core =
      sportFinanceCore();


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
            sportFinanceStartCheckout,

          editIdentity:
            sportFinanceEditIdentity
        }
      );
    }


    sportFinanceInstallEvents();

    sportFinanceRender();
  }


  if(
    document.readyState ===
      "loading"
  ){

    document.addEventListener(

      "DOMContentLoaded",

      sportFinanceInstall,

      {
        once:
          true
      }
    );

  }else{

    sportFinanceInstall();
  }


  const observer =
    new MutationObserver(
      function(){

        sportFinanceInstall();
      }
    );


  observer.observe(

    document.documentElement,

    {

      childList:
        true,

      subtree:
        true
    }
  );


  /* =========================================================
     API PUBLIQUE
     ========================================================= */

  window.BociteFinanceSport = {

    version:
      VERSION,

    ready:
      true,

    install:
      sportFinanceInstall,

    afterCabasExchange:
      sportFinanceAfterCabasExchange,

    openReview:
      sportFinanceOpenReview,

    checkAvailability:
      sportFinanceCheckAvailability,

    extendCurrentHold:
      sportFinanceExtendHold,

    releaseCurrentHold:
      sportFinanceReleaseHold,

    markPublicationFailure:
      sportFinanceMarkPublicationFailure,

    getOperations:
      function(){

        return (

          sportFinanceClone(
            sportFinanceReadOperations()
          )

          ||

          []
        );
      },

    getLatestOperation:
      function(){

        return sportFinanceClone(
          sportFinanceLatestOperation()
        );
      },

    getPolicies:
      function(){

        return sportFinanceClone(
          sportFinancePolicies()
        );
      },

    getPendingOffer:
      function(){

        return sportFinanceClone(
          sportFinanceReadPendingOffer()
        );
      }
  };


  console.info(
    "✅ Bo'CitéArt Finance — raccord Sport chargé — 3 jours / capacité 6"
  );

})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART — FINANCE — RACCORD SPORT
   ========================================================= */
