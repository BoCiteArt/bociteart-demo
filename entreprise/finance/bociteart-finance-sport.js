/* =========================================================
   ÇA COMMENCE ICI — BO'CITÉART — FINANCE — RACCORD SPORT

   Fichier public : finance/bociteart-finance-sport.js

   Rôle de ce fichier :
   - préparer le parrainage Sport côté application ;
   - identifier le commerçant, le club et le représentant ;
   - transmettre le dossier au cœur Finance ;
   - suivre les états de paiement renvoyés par le cœur Finance ;
   - préparer les informations nécessaires au serveur privé.

   Ce fichier ne contient :
   - aucun secret bancaire ;
   - aucune clé PSP ;
   - aucun IBAN complet ;
   - aucune ventilation financière interne définitive ;
   - aucune TVA imposée arbitrairement ;
   - aucune facture fiscale définitive ;
   - aucun reçu fiscal automatique.

   Paiements, rapprochements, reversements, factures,
   justificatifs, éligibilité fiscale et contrôles Agent 1 / Agent 2
   sont validés côté serveur privé Bo'CitéArt.
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

  const CONNECTOR_NAME =
    "sport-parrainage";

  const MOUNT_ID =
    "bociteSportFinanceMount";

  const PROFILE_KEY =
    "bociteart_finance_sport_merchant_v2";

  const OPERATIONS_KEY =
    "bociteart_finance_sport_operations_v2";

  const MINIMUM_HT =
    50;

  const PUBLICATION_DAYS =
    5;

  const MAX_LOCAL_OPERATIONS =
    250;


  let activeCorrectionDraftId =
    "";

  let financeEventsInstalled =
    false;


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


  function sportFinanceFormatMoney(
    value
  ){

    const amount =
      Number(
        value ||
        0
      );


    if(
      !Number.isFinite(
        amount
      )
    ){

      return "0,00";
    }


    return amount
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


  /* =========================================================
     SPORT — CLUB
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


  /* =========================================================
     SPORT — UTILISATEUR QUI PRÉSENTE LE PARRAINAGE
     ========================================================= */

  function sportFinanceSession(){

    let source = {};


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


  /* =========================================================
     ASSOCIATIONS VALIDÉES
     ========================================================= */

  function sportFinanceAssociations(){

    const source =
      window
        .BOCITEART_FINANCE_ASSOCIATIONS;


    if(
      !Array.isArray(
        source
      )
    ){

      return [];
    }


    return source.filter(
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
            item.name
          )
        );
      }
    );
  }


  /* =========================================================
     PHOTOGRAPHIE DU CLUB
     ========================================================= */

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


  /* =========================================================
     PHOTOGRAPHIE DE L'ASSOCIATION
     ========================================================= */

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


  function sportFinanceInitialProfile(){

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

      saved
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
     HISTORIQUE LOCAL DE SUIVI

     Ce journal facilite la préproduction.

     En production :
     la référence comptable officielle
     reste exclusivement côté serveur.
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

      console.warn(
        "Bo'CitéArt Finance Sport : historique local indisponible.",
        error
      );


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

      index >= 0

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
      index >= 0
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

    const operations =
      sportFinanceReadOperations();


    if(
      !operations.length
    ){

      return null;
    }


    return operations
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


    const amount =
      Number(
        operation.amountHT ||
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
        Number.isFinite(
          amount
        ) &&
        amount > 0

          ? " — " +

            sportFinanceEscape(

              sportFinanceFormatMoney(
                amount
              )

            ) +

            " € HT"

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
     MONTANT
     ========================================================= */

  function sportFinanceAmount(){

    const amount =
      Number(

        sportFinanceValue(
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


  /* =========================================================
     DESTINATION
     ========================================================= */

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


  /* =========================================================
     APERÇU PUBLIC
     ========================================================= */

  function sportFinancePreview(
    profile,
    club,
    choice,
    association
  ){

    const contact =

      profile.website ||
      profile.phone ||
      profile.email;


    const lines = [

      profile.name,

      profile.address
    ];


    if(
      contact
    ){

      lines.push(
        contact
      );
    }


    lines.push(

      "Merci à ce commerçant pour son soutien au club " +

      sportFinanceText(

        club.name ||
        club.officialName ||
        "partenaire"
      )

      +

      "."
    );


    if(
      choice ===
        "HALF_HALF" &&

      association
    ){

      lines.push(

        "Merci également pour son soutien à " +

        sportFinanceText(
          association.name
        )

        +

        "."
      );
    }


    return lines.filter(
      Boolean
    );
  }


  /* =========================================================
     MESSAGE D'ÉTAT
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


  /* =========================================================
     OUVERTURE / FERMETURE DU CHOIX ASSOCIATION
     ========================================================= */

  function sportFinanceToggleAssociation(){

    const choice =
      sportFinanceChoice();


    const box =
      sportFinanceField(
        "bcfSportAssociationBox"
      );


    if(
      box
    ){

      box.style.display =

        choice ===
          "HALF_HALF"

          ? "block"

          : "none";
    }


    if(
      choice !==
        "HALF_HALF"
    ){

      const select =
        sportFinanceField(
          "bcfSportAssociation"
        );


      if(
        select
      ){

        select.value =
          "";
      }
    }
  }


  /* =========================================================
     VALIDATION CÔTÉ APPLICATION

     Le serveur répète toutes les vérifications nécessaires.
     ========================================================= */

  function sportFinanceValidate(
    profile,
    club,
    amount,
    choice,
    association
  ){

    const errors =
      [];


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
        "L’adresse du commerçant est obligatoire."
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
        amount
      ) ||

      amount <
        MINIMUM_HT
    ){

      errors.push(
        "Le montant minimum est de 50 € HT."
      );
    }


    if(
      choice !==
        "ALL_CLUB" &&

      choice !==
        "HALF_HALF"
    ){

      errors.push(
        "Choisissez la destination du soutien."
      );
    }


    if(
      choice ===
        "HALF_HALF" &&

      !association
    ){

      errors.push(
        "Choisissez une association préalablement validée."
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


    return errors;
  }


  /* =========================================================
     POLITIQUES À FAIRE RESPECTER CÔTÉ SERVEUR

     On décrit les obligations de contrôle.
     Aucune formule financière confidentielle n'est exposée.
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

        startOnlyAfterConfirmedPayment:
          true,

        automaticServerActivationAfterPaid:
          true,

        clientCannotActivatePublication:
          true
      },


      allocation:{

        finalDistribution:
          "server_only",

        clubSupportNature:
          "sponsorship",

        associationShareOnlyIfSelectedAndValidated:
          true,

        associationQualification:
          "server_validate_actual_eligibility",

        bociteartServiceTreatment:
          "server_only",

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

        monthlyGroupingAllowedWhenLegallyCompatible:
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
     ÇA COMMENCE ICI
     OUVERTURE DU RÉCAPITULATIF
     ========================================================= */

  function sportFinanceOpenReview(){

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


    const profile =
      sportFinanceSaveProfile(

        sportFinanceReadProfile()
      );


    const club =
      sportFinanceClub();


    const amountHT =
      sportFinanceAmount();


    const choice =
      sportFinanceChoice();


    const association =
      sportFinanceSelectedAssociation();


    const representative =
      sportFinanceSession();


    if(
      !representative.accountId
    ){

      sportFinanceSetStatus(
        "L’utilisateur Sport doit être identifié avant de présenter ce parrainage.",
        "error"
      );

      return;
    }


    const errors =
      sportFinanceValidate(

        profile,
        club,
        amountHT,
        choice,
        association
      );


    if(
      errors.length
    ){

      sportFinanceSetStatus(
        errors[0],
        "error"
      );

      return;
    }


    const previewLines =
      sportFinancePreview(

        profile,
        club,
        choice,
        association
      );


    const operationRef =

      "BCA-SPORT-PARR-" +

      Date.now() +

      "-" +

      Math.random()
        .toString(36)
        .slice(2,7)
        .toUpperCase();


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
        sportFinanceNow(),


      identityVersion:
        profile.updatedAt,


      clubRef:
        clubSnapshot.clubRef,


      clubSnapshot:
        clubSnapshot,


      beneficiaryRefs:[

        clubSnapshot.clubRef,

        associationSnapshot
          ? associationSnapshot.id
          : ""

      ].filter(
        Boolean
      ),


      amountHT:
        amountHT,


      allocationCode:
        choice,


      associationId:

        associationSnapshot
          ? associationSnapshot.id
          : "",


      associationSnapshot:
        associationSnapshot,


      publicationDays:
        PUBLICATION_DAYS,


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
        amountHT,


      allocationCode:
        choice,


      clubRef:
        clubSnapshot.clubRef,


      clubName:

        clubSnapshot.name ||
        clubSnapshot.officialName,


      payerRef:
        sportFinanceDigits(
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
        PUBLICATION_DAYS
    });


    sportFinanceRenderLatestOperation();
  }

  /* =========================================================
     ÇA FINIT ICI
     OUVERTURE DU RÉCAPITULATIF
     ========================================================= */


  /* =========================================================
     CORRECTION IDENTITÉ COMMERÇANT
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


    const core =
      sportFinanceCore();


    const draftId =
      activeCorrectionDraftId;


    if(
      !ui ||
      !core ||
      !draftId
    ){

      return;
    }


    const profile =
      sportFinanceSaveProfile(

        sportFinanceReadProfile()
      );


    const club =
      sportFinanceClub();


    const choice =
      sportFinanceChoice();


    const association =
      sportFinanceSelectedAssociation();


    const amountHT =
      sportFinanceAmount();


    const errors =
      sportFinanceValidate(

        profile,
        club,
        amountHT,
        choice,
        association
      );


    if(
      errors.length
    ){

      sportFinanceSetStatus(
        errors[0],
        "error"
      );

      return;
    }


    const previewLines =
      sportFinancePreview(

        profile,
        club,
        choice,
        association
      );


    const merchantSnapshot =
      sportFinanceMerchantSnapshot(
        profile
      );


    const clubSnapshot =
      sportFinanceClubSnapshot(
        club
      );


    const associationSnapshot =
      sportFinanceAssociationSnapshot(
        association
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


        allocationCode:
          choice,


        clubRef:
          clubSnapshot.clubRef,


        clubSnapshot:
          clubSnapshot,


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
      }
    );
  }


  /* =========================================================
     PRÉPARATION DU PAYLOAD SERVEUR

     Le cœur Finance transmet volontairement
     un ensemble limité de données au connecteur.

     Le raccord Sport recharge ici le brouillon gelé
     afin d'associer correctement au paiement :

     - le commerçant ;
     - le club ;
     - le représentant ;
     - l'association éventuelle ;
     - la durée de publication ;
     - les obligations de contrôle.

     Le serveur doit ensuite tout revalider.
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


        presentedAt:
          sportFinanceText(
            draft.presentedAt
          ),


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


        publicationDays:
          Number(

            draft.publicationDays ||
            PUBLICATION_DAYS
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
          false
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


    const config =
      core.getConfig();


    const payload =
      sportFinanceCheckoutPayload(
        request
      );


    let responseData =
      null;


    /* =====================================================
       PRODUCTION
       ===================================================== */

    if(
      sportFinanceText(
        config.mode
      )
        .toLowerCase() ===
        "production"
    ){

      if(
        !sportFinanceText(
          config.apiBaseUrl
        )
      ){

        throw new Error(
          "Le serveur sécurisé Finance n'est pas configuré."
        );
      }


      const response =
        await fetch(

          sportFinanceText(
            config.apiBaseUrl
          )
            .replace(
              /\/$/,
              ""
            )

          +

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


      if(
        !response.ok
      ){

        throw new Error(
          "Le paiement sécurisé est momentanément indisponible."
        );
      }


      responseData =
        await response.json();


    /* =====================================================
       PRÉPRODUCTION
       ===================================================== */

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
        Number(

          payload.publicationDays ||
          PUBLICATION_DAYS
        )
    });


    sportFinanceRenderLatestOperation();


    return responseData;
  }


  /* =========================================================
     LISTE ASSOCIATIONS
     ========================================================= */

  function sportFinanceAssociationOptions(){

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

              return (

                '<option value="' +

                sportFinanceEscape(
                  item.id
                )

                +

                '">' +

                sportFinanceEscape(
                  item.name
                )

                +

                '</option>'
              );
            }
          )
          .join("")
      }

    `;
  }


  /* =========================================================
     ÇA COMMENCE ICI
     INTERFACE FINANCE SPORT
     ========================================================= */

  function sportFinanceRender(){

    const mount =
      sportFinanceField(
        MOUNT_ID
      );


    if(
      !mount ||
      mount.dataset.financeReady ===
        "1"
    ){

      return;
    }


    const profile =
      sportFinanceInitialProfile();


    const associations =
      sportFinanceAssociations();


    const representative =
      sportFinanceSession();


    mount.dataset.financeReady =
      "1";


    mount.innerHTML = `

      <div class="sportCard">

        <div class="sportSubTitle">

          Parrainage et publicité locale avec

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

          Le commerçant choisit
          un montant à partir de

          <strong>
            50 € HT
          </strong>.

          <br><br>

          Le paiement est préparé
          par le prestataire sécurisé
          de Bo'CitéArt.

          Les cartes
          <strong>Visa</strong>
          et <strong>Mastercard</strong>
          sont prévues,
          ainsi qu’un QR de paiement temporaire
          lorsqu’il est proposé
          par le prestataire.

          <br><br>

          La diffusion démarre
          automatiquement
          après confirmation effective
          du paiement
          et dure

          <strong>
            5 jours réels
          </strong>.

        </div>


        <div
          class="sportStatus"
          style="margin-top:12px;"
        >

          Parrainage présenté par

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


          <div class="sportStatus">

            Relisez attentivement
            ces informations.

            <br><br>

            Elles servent au paiement,
            à la publicité
            et aux documents associés.

            <br><br>

            La qualification fiscale définitive
            reste contrôlée selon
            la situation réelle de chaque partie.

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

            Montant et destination
            du parrainage

          </div>


          <label class="sportLabel">

            Montant en € HT

          </label>


          <input
            id="bcfSportAmountHT"
            class="sportField"
            type="number"
            min="50"
            step="0.01"
            value="50"
          >


          <label class="sportCheck">

            <input
              type="radio"
              name="bcfSportAllocation"
              value="ALL_CLUB"
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
                associations.length
                  ? ""
                  : "disabled"
              }
            >

            <span>

              <strong>

                50 % pour le club /
                50 % pour l’association choisie

              </strong>

            </span>

          </label>


          <div
            id="bcfSportAssociationBox"
            style="
              display:none;
              margin-top:12px;
            "
          >

            <label class="sportLabel">

              Association retenue

            </label>


            <select
              id="bcfSportAssociation"
              class="sportField"

              ${
                associations.length
                  ? ""
                  : "disabled"
              }
            >

              ${sportFinanceAssociationOptions()}

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


          <div
            class="sportStatus"
            style="margin-top:12px;"
          >

            Le paiement,
            la diffusion
            et les documents associés
            sont validés uniquement
            après confirmation effective
            du prestataire de paiement.

            <br><br>

            Les justificatifs,
            factures
            et éventuels documents fiscaux
            sont ensuite établis
            selon le statut réel
            des parties concernées.

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

            Choisissez la destination
            du parrainage,
            puis continuez vers le paiement.

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


    mount
      .querySelectorAll(
        'input[name="bcfSportAllocation"]'
      )
      .forEach(
        function(
          radio
        ){

          radio.addEventListener(
            "change",
            sportFinanceToggleAssociation
          );
        }
      );


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


    sportFinanceRenderLatestOperation();
  }

  /* =========================================================
     ÇA FINIT ICI
     INTERFACE FINANCE SPORT
     ========================================================= */


  /* =========================================================
     ÉTATS RENVOYÉS PAR LE CŒUR FINANCE
     ========================================================= */

  function sportFinanceHandleStatus(
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


      paidAt:
        sportFinanceText(
          draft.paidAt
        )
    });


    const messages = {

      payment_pending:
        "Paiement en cours. La publicité ne sera diffusée qu’après confirmation effective.",


      paid:
        "Paiement confirmé. La diffusion de 5 jours est déclenchée automatiquement côté serveur et les documents associés sont préparés selon le statut réel des parties.",


      refused:
        "Paiement refusé. Aucune diffusion n’est activée.",


      cancelled:
        "Paiement annulé. Aucune diffusion n’est activée.",


      refunded:
        "Paiement remboursé. Le dossier doit être rapproché et contrôlé côté serveur.",


      disputed:
        "Paiement contesté. Le dossier est placé sous contrôle avant toute suite."
    };


    sportFinanceSetStatus(

      messages[
        status
      ]

      ||

      sportFinanceStatusLabel(
        status
      ),


      (
        status ===
          "refused"

        ||

        status ===
          "cancelled"

        ||

        status ===
          "disputed"
      )

        ? "error"

        : "success"
    );


    sportFinanceRenderLatestOperation();
  }


  /* =========================================================
     INSTALLATION DES ÉVÉNEMENTS FINANCE
     ========================================================= */

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

      /*
        Compatibilité avec l'état
        payment_pending remonté
        directement par financeApplyServerStatus().
      */
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
  }


  /* =========================================================
     INSTALLATION DU RACCORD SPORT
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


  /* =========================================================
     CHARGEMENT
     ========================================================= */

  if(
    document.readyState ===
      "loading"
  ){

    document.addEventListener(

      "DOMContentLoaded",

      sportFinanceInstall,

      {
        once:true
      }
    );

  }else{

    sportFinanceInstall();
  }


  /* =========================================================
     RÉOUVERTURE AUTOMATIQUE SI LE MODULE SPORT EST RECRÉÉ
     ========================================================= */

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
     API PUBLIQUE DU RACCORD SPORT
     ========================================================= */

  window.BociteFinanceSport = {

    ready:
      true,


    install:
      sportFinanceInstall,


    openReview:
      sportFinanceOpenReview,


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
      }
  };


  console.info(
    "✅ Bo'CitéArt Finance — raccord Sport chargé"
  );

})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART — FINANCE — RACCORD SPORT
   ========================================================= */
