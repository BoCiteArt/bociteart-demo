/* =========================================================
   BLOC 1
   ÇA COMMENCE ICI — BO'CITÉART — FINANCE — FONDATION COMMUNE
   + RACCORD SPORT

   Fichier :
   entreprise/finance/bociteart-finance-sport.js

   Ce fichier prépare au maximum la couche application :
   - identité et numéro client permanent ;
   - publicité Sport indépendante du Cabas ;
   - créneau de 72 heures exactes ;
   - 6 publicités simultanées maximum ;
   - réservation 15 minutes et prolongation +5 minutes ;
   - parrainage de 50 € HT minimum ;
   - soutien recherche supplémentaire de 10 € minimum ;
   - préparation des documents et du dossier comptable ;
   - règles Agent 1 / Agent 2 ;
   - transmission future vers serveur / PSP / plateforme comptable ;
   - règles réutilisables pour Commerce, Entreprise, Association,
     Mairie et autres modules Bo'CitéArt.

   IMPORTANT :
   - le navigateur n'est jamais la preuve finale d'un paiement ;
   - aucun secret PSP, IBAN complet, clé bancaire ou accès comptable
     n'est stocké ici ;
   - les numéros légaux définitifs de facture, la TVA finale,
     les split payments, reversements, écritures définitives,
     factures électroniques et contrôles officiels sont finalisés
     côté serveur au moment du raccordement production.
   ========================================================= */

(function(){
  "use strict";

  if(
    window.BociteFinanceSport &&
    window.BociteFinanceSport.ready === true
  ){
    return;
  }

  const VERSION = "2026-09-09-01";
  const CONNECTOR_NAME = "sport-parrainage";
  const MOUNT_ID = "bociteSportFinanceMount";
  const PROFILE_KEY = "bociteart_finance_sport_merchant_v4";
  const OPERATIONS_KEY = "bociteart_finance_sport_operations_v4";
  const LOCAL_SLOTS_KEY = "bociteart_finance_sport_slots_v2";
  const LOCAL_CLIENTS_KEY = "bociteart_finance_clients_v1";
  const LOCAL_AUDIT_KEY = "bociteart_finance_audit_v1";
  const LOCAL_BRANDING_KEY = "bociteart_finance_branding_v1";
  const LOCAL_TARIFF_KEY = "bociteart_finance_tariff_v1";
  const LOCAL_ACCOUNTING_SETTINGS_KEY = "bociteart_finance_accounting_settings_v1";

  const MINIMUM_HT = 50;
  const EXTRA_RESEARCH_MINIMUM = 10;
  const PUBLICATION_DURATION_MS = 72 * 60 * 60 * 1000;
  const CONCURRENT_CAPACITY = 6;
  const HOLD_MINUTES = 15;
  const MANUAL_EXTENSION_MINUTES = 5;
  const BOCITEART_BASE_FEE_RATE_HT = 0.10;
  const PUBLIC_ENTITY_TARGET_DAYS = 30;
  const PUBLIC_ENTITY_LATE_FIXED_COMPENSATION = 40;
  const ACCOUNTING_RETENTION_YEARS = 10;
  const SECURITY_LOG_RETENTION_DAYS = 365;
  const MAX_LOCAL_OPERATIONS = 500;
  const MAX_LOCAL_AUDIT = 1000;
  const MAX_LOCAL_SLOTS = 1500;
  const LOCAL_NEXT_SLOT_SEARCH_DAYS = 45;
  const LOCAL_NEXT_SLOT_STEP_MINUTES = 15;

  const PUBLICITY_TEMPLATES = [
    { code:"THANKS", label:"Formule 1" },
    { code:"SUPPORTS", label:"Formule 2" },
    { code:"LOCAL", label:"Formule 3" },
    { code:"CLUB_THANKS", label:"Formule 4" }
  ];

  let activeCorrectionDraftId = "";
  let financeEventsInstalled = false;
  let currentHold = null;
  let identityCheckCache = null;

  function sportFinanceCore(){ return window.BociteFinance || null; }
  function sportFinanceUI(){ return window.BociteFinanceUI || null; }
  function sportFinanceText(value){ return String(value == null ? "" : value).trim(); }

  function sportFinanceEscape(value){
    return sportFinanceText(value)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/\"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function sportFinanceClone(value){
    if(value == null){ return value; }
    try{
      return JSON.parse(
        JSON.stringify(value)
      );
    }catch(error){
      return null;
    }
  }

  function sportFinanceNow(){
    return new Date().toISOString();
  }

  function sportFinanceId(prefix){
    const head =
      sportFinanceText(prefix) ||
      "bocite-finance";

    if(
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ){
      return head + "-" + window.crypto.randomUUID();
    }

    return (
      head +
      "-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,12)
    );
  }

  function sportFinanceDigits(value){
    return sportFinanceText(value)
      .replace(/\D/g,"");
  }

  function sportFinanceRound(value){
    const number =
      Number(value || 0);

    if(
      !Number.isFinite(number)
    ){
      return 0;
    }

    return (
      Math.round(
        number * 100
      ) / 100
    );
  }

  function sportFinanceFormatMoney(value){
    return sportFinanceRound(value)
      .toLocaleString(
        "fr-FR",
        {
          minimumFractionDigits:2,
          maximumFractionDigits:2
        }
      );
  }

  function sportFinanceEmailLooksValid(value){
    const email =
      sportFinanceText(value);

    return !!(
      email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email)
    );
  }

  function sportFinanceField(id){
    return document.getElementById(id);
  }

  function sportFinanceValue(id){
    const field =
      sportFinanceField(id);

    return sportFinanceText(
      field
        ? field.value
        : ""
    );
  }

  function sportFinanceChecked(id){
    const field =
      sportFinanceField(id);

    return !!(
      field &&
      field.checked === true
    );
  }

  function sportFinanceConfig(){
    const core =
      sportFinanceCore();

    if(
      core &&
      typeof core.getConfig === "function"
    ){
      return core.getConfig() || {};
    }

    return {};
  }

  function sportFinanceIsProduction(){
    return (
      sportFinanceText(
        sportFinanceConfig().mode
      )
        .toLowerCase() ===
      "production"
    );
  }

  function sportFinanceApiBase(){
    return sportFinanceText(
      sportFinanceConfig().apiBaseUrl
    )
      .replace(/\/$/,"");
  }

  async function sportFinanceServerPost(path,payload){
    const base =
      sportFinanceApiBase();

    if(!base){
      throw new Error(
        "Le serveur sécurisé Finance n'est pas configuré."
      );
    }

    const response =
      await fetch(
        base + path,
        {
          method:"POST",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(
            payload || {}
          )
        }
      );

    if(!response.ok){
      let message =
        "Le service sécurisé est momentanément indisponible.";

      try{
        const body =
          await response.json();

        if(
          body &&
          body.message
        ){
          message =
            sportFinanceText(
              body.message
            ) ||
            message;
        }
      }catch(error){}

      throw new Error(message);
    }

    return response.json();
  }

  function sportFinanceReadJson(storage,key,fallback){
    try{
      const parsed =
        JSON.parse(
          storage.getItem(key) ||
          JSON.stringify(fallback)
        );

      return parsed == null
        ? fallback
        : parsed;

    }catch(error){
      return fallback;
    }
  }

  function sportFinanceWriteJson(storage,key,value){
    try{
      storage.setItem(
        key,
        JSON.stringify(value)
      );
      return true;
    }catch(error){
      return false;
    }
  }

  function financeFoundationClientRegistry(){
    const value =
      sportFinanceReadJson(
        window.localStorage,
        LOCAL_CLIENTS_KEY,
        {
          years:{},
          entities:{}
        }
      );

    value.years =
      value.years &&
      typeof value.years === "object"
        ? value.years
        : {};

    value.entities =
      value.entities &&
      typeof value.entities === "object"
        ? value.entities
        : {};

    return value;
  }

  function financeFoundationClientEntityKey(
    entityType,
    stableKey
  ){
    return (
      sportFinanceText(entityType)
        .toLowerCase() +
      "::" +
      sportFinanceText(stableKey)
        .toUpperCase()
    );
  }

  function financeFoundationFormatClientNumber(
    year,
    sequence
  ){
    const y =
      String(
        Number(year) ||
        new Date().getFullYear()
      )
        .padStart(
          4,
          "0"
        );

    const seq =
      Math.max(
        100,
        Number(sequence) || 100
      );

    return (
      y +
      "000" +
      String(seq)
    );
  }

  function financeFoundationEnsureLocalClientNumber(
    entityType,
    stableKey,
    existingNumber
  ){
    const existing =
      sportFinanceDigits(
        existingNumber
      );

    if(existing){
      return existing;
    }

    const key =
      financeFoundationClientEntityKey(
        entityType,
        stableKey
      );

    if(
      !key ||
      key.endsWith("::")
    ){
      return "";
    }

    const registry =
      financeFoundationClientRegistry();

    if(
      registry.entities[key] &&
      registry.entities[key].clientNumber
    ){
      return String(
        registry.entities[key].clientNumber
      );
    }

    const year =
      new Date().getFullYear();

    const yearKey =
      String(year);

    const current =
      Math.max(
        99,
        Number(
          registry.years[yearKey] ||
          99
        )
      );

    const next =
      current + 1;

    const clientNumber =
      financeFoundationFormatClientNumber(
        year,
        next
      );

    registry.years[yearKey] =
      next;

    registry.entities[key] = {
      clientNumber:clientNumber,
      entityType:sportFinanceText(entityType),
      stableKey:sportFinanceText(stableKey),
      createdAt:sportFinanceNow(),
      immutable:true
    };

    sportFinanceWriteJson(
      window.localStorage,
      LOCAL_CLIENTS_KEY,
      registry
    );

    return clientNumber;
  }

  function financeFoundationAccountingPolicies(){
    return {

      clientIdentity:{

        permanentClientNumber:true,

        visibleFormat:
          "YYYY000100+",

        annualSequenceStartsAt:
          100,

        immutableAfterAssignment:
          true,

        technicalUuidAlsoRequired:
          true,

        userCorrectsOwnData:
          true,

        officialReferenceCheckRequired:
          true,

        newFinancialOperationsBlockedUntilIdentityConcordant:
          true,

        materialIdentityChangeRequiresRecheck:
          true
      },

      invoicing:{

        finalInvoiceNumberServerSide:
          true,

        chronologicalContinuousSequenceRequired:
          true,

        invoiceDateRequired:
          true,

        serviceDateRequired:
          true,

        issuerIdentityRequired:
          true,

        customerIdentityRequired:
          true,

        customerSirenWhenRequired:
          true,

        vatTreatmentByActualStatus:
          true,

        electronicInvoiceCompatibilityRequired:
          true,

        receptionElectronicInvoiceRequiredFrom:
          "2026-09-01",

        smeEmissionTargetFrom:
          "2027-09-01",

        accountingRetentionYears:
          ACCOUNTING_RETENTION_YEARS,

        mandateBillingSupported:
          true,

        clubDocumentCanBeIssuedOnBehalfOfClub:
          true,

        monthlyBociteArtServiceInvoiceSupported:
          true,

        duplicateBillingForbidden:
          true,

        previousIssuedDocumentNeverSilentlyRewritten:
          true,

        correctionTraceRequired:
          true
      },

      bociteartFees:{

        initialBaseRateHT:
          BOCITEART_BASE_FEE_RATE_HT,

        currentRateHT:
          financeFoundationCurrentFeeRateHT(),

        vatAddedAccordingToActualStatus:
          true,

        pspFeesSeparate:
          true,

        pspIndexationPolicy:
          "server_agent2_versioned",

        noRetroactiveTariffChange:
          true,

        beneficiaryBearsBociteArtFee:
          true,

        beneficiaryBearsAllocatedPspFee:
          true,

        grossBeneficiaryAmountRemainsDocumentReference:
          true
      },

      psp:{

        regulatedProviderRequired:
          true,

        splitOrThirdPartyCollectionFrameworkRequired:
          true,

        browserNeverFinalPaymentProof:
          true,

        webhookOrEquivalentServerConfirmationRequired:
          true,

        idempotencyRequired:
          true,

        pspFeeActualAmountRecorded:
          true,

        bankSecretsServerOnly:
          true,

        ibanChangeEnhancedVerification:
          true
      },

      audit:{

        agent1EndToEndRequired:
          true,

        agent2IndependentRequired:
          true,

        agent1PreparesAccountingFile:
          true,

        agent2ApprovesAccountingTransmission:
          true,

        anomalyNeverSilentlyCorrected:
          true,

        auditTrailRequired:
          true,

        legislationMonitoringServerSide:
          true,

        deterministicLegalUpdatesCanBeAppliedAutomatically:
          true,

        ambiguousLegalSituationRequiresHumanEscalation:
          true
      },

      accountingDelivery:{

        dedicatedPlatformRequired:
          true,

        platformChosenWithAccountant:
          true,

        noScatteredEmailWorkflow:
          true,

        transmissionAfterAgent2Approval:
          true,

        batchReferenceRequired:
          true,

        transmissionTimestampRequired:
          true,

        blockingAnomalyPreventsValidatedStatus:
          true
      },

      publicEntities:{

        deferredPaymentSupported:
          true,

        targetPaymentDays:
          PUBLIC_ENTITY_TARGET_DAYS,

        automaticReminders:
          true,

        fixedLateCompensation:
          PUBLIC_ENTITY_LATE_FIXED_COMPENSATION,

        lateInterestServerCalculated:
          true,

        newPaidServicesCanBeSuspendedWhenOverdue:
          true,

        existingPublicContractMustRespectApplicableContract:
          true,

        dailyAdminAlertRequired:
          true,

        chorusOrPublicInvoicePlatformReady:
          true
      },

      retention:{

        accountingYears:
          ACCOUNTING_RETENTION_YEARS,

        securityLogDays:
          SECURITY_LOG_RETENTION_DAYS
      },

      continuity:{

        chargebackWorkflowRequired:
          true,

        exceptionalRefundWorkflowRequired:
          true,

        recoveryAfterCrashRequired:
          true,

        noDoublePayment:
          true,

        noDoubleInvoice:
          true,

        noDoubleSettlement:
          true,

        legalAndAccountingHistoryAttachedToEntityNotCurrentManager:
          true
      }
    };
  }

  function financeFoundationAgent1Blueprint(){
    return {

      role:
        "operational_end_to_end",

      checks:[
        "identity",
        "operation_type",
        "billing_method",
        "invoice_model",
        "payment_path",
        "psp_confirmation",
        "psp_fees",
        "bociteart_fees",
        "beneficiary_allocation",
        "settlements",
        "documents",
        "references",
        "dates",
        "refunds_or_chargebacks",
        "archive",
        "accounting_delivery"
      ],

      blockOnMismatch:
        true,

      silentCorrectionForbidden:
        true
    };
  }

  function financeFoundationAgent2Blueprint(){
    return {

      role:
        "independent_control_and_governance",

      checks:[
        "agent1_independent_recalculation",
        "tariff_version",
        "psp_tariff_evolution",
        "bociteart_indexation",
        "legal_rules",
        "tax_rules",
        "invoice_mentions",
        "electronic_invoicing",
        "public_payment_delay",
        "accounting_file_completeness"
      ],

      deterministicUpdatesAutomatic:
        true,

      ambiguousCasesEscalated:
        true,

      accountingReleaseAuthority:
        true,

      tariffChangesVersioned:
        true,

      retroactiveTariffChangeForbidden:
        true
    };
  }

  function financeFoundationDocumentManifest(input){
    const source =
      input &&
      typeof input === "object"
        ? input
        : {};

    return {

      dossierRef:
        sportFinanceText(
          source.dossierRef
        ),

      operationRef:
        sportFinanceText(
          source.operationRef
        ),

      payerClientNumber:
        sportFinanceText(
          source.payerClientNumber
        ),

      beneficiaryClientNumbers:
        Array.isArray(
          source.beneficiaryClientNumbers
        )
          ? source.beneficiaryClientNumbers.slice()
          : [],

      documents:[

        {
          code:
            "beneficiary_gross_document",

          required:
            true,

          issuer:
            "beneficiary",

          issueMode:
            "server_or_mandate",

          amountBasis:
            "gross_beneficiary_amount"
        },

        {
          code:
            "bociteart_monthly_service_invoice",

          required:
            true,

          issuer:
            "bociteart",

          issueMode:
            "monthly_grouped_when_compatible",

          amountBasis:
            "bociteart_fee_ht_plus_applicable_vat"
        },

        {
          code:
            "psp_fee_statement",

          required:
            true,

          issuer:
            "psp_or_authorized_processor",

          amountBasis:
            "actual_psp_fee"
        },

        {
          code:
            "independent_research_receipt",

          required:
            Number(
              source.extraResearchAmount ||
              0
            ) > 0,

          issuer:
            "research_association",

          issueMode:
            "only_according_to_actual_eligibility",

          taxReceiptAutomatic:
            false
        }
      ],

      invoiceRetentionYears:
        ACCOUNTING_RETENTION_YEARS,

      preparedAt:
        sportFinanceNow()
    };
  }

  function financeFoundationBuildAccountingDossier(input){
    const source =
      input &&
      typeof input === "object"
        ? input
        : {};

    const dossierRef =
      sportFinanceText(
        source.dossierRef
      ) ||
      sportFinanceId(
        "accounting-dossier"
      );

    return {

      dossierRef:
        dossierRef,

      operationRef:
        sportFinanceText(
          source.operationRef
        ),

      module:
        sportFinanceText(
          source.module
        ),

      flowType:
        sportFinanceText(
          source.flowType
        ),

      client:
        sportFinanceClone(
          source.client
        ) ||
        null,

      beneficiaries:
        sportFinanceClone(
          source.beneficiaries
        ) ||
        [],

      payment:
        sportFinanceClone(
          source.payment
        ) ||
        {},

      taxation:
        sportFinanceClone(
          source.taxation
        ) ||
        {
          finalQualification:
            "server_only"
        },

      fees:{

        bociteart:{

          initialBaseRateHT:
            BOCITEART_BASE_FEE_RATE_HT,

          appliedRateHT:
            source.bociteArtFeeRateHT == null
              ? financeFoundationCurrentFeeRateHT()
              : Number(
                  source.bociteArtFeeRateHT
                ),

          vatTreatment:
            "according_to_actual_bociteart_status",

          invoiceMode:
            "monthly_automatic"
        },

        psp:{

          actualAmount:
            source.pspFeeActualAmount == null
              ? null
              : Number(
                  source.pspFeeActualAmount
                ),

          separateFromBociteArt:
            true
        }
      },

      documents:
        financeFoundationDocumentManifest({

          dossierRef:
            dossierRef,

          operationRef:
            source.operationRef,

          payerClientNumber:
            source.client &&
            source.client.clientNumber,

          beneficiaryClientNumbers:
            (
              source.beneficiaries ||
              []
            )
              .map(
                function(item){
                  return sportFinanceText(
                    item &&
                    item.clientNumber
                  );
                }
              )
              .filter(Boolean),

          extraResearchAmount:
            source.extraResearchAmount
        }),

      agent1:{
        status:"pending",
        blueprint:
          financeFoundationAgent1Blueprint()
      },

      agent2:{
        status:"pending",
        blueprint:
          financeFoundationAgent2Blueprint()
      },

      accountingPlatform:{
        status:
          "waiting_agent2",

        platformId:
          "",

        batchRef:
          "",

        transmittedAt:
          ""
      },

      archive:{
        required:true,
        years:ACCOUNTING_RETENTION_YEARS,
        status:"pending"
      },

      createdAt:
        sportFinanceNow(),

      updatedAt:
        sportFinanceNow()
    };
  }

  function financeFoundationSaveAudit(entry){
    const rows =
      sportFinanceReadJson(
        window.localStorage,
        LOCAL_AUDIT_KEY,
        []
      );

    const list =
      Array.isArray(rows)
        ? rows
        : [];

    const next =
      Object.assign(
        {
          id:sportFinanceId("audit"),
          createdAt:sportFinanceNow()
        },
        sportFinanceClone(entry) ||
        {}
      );

    list.push(next);

    sportFinanceWriteJson(
      window.localStorage,
      LOCAL_AUDIT_KEY,
      list.slice(
        -MAX_LOCAL_AUDIT
      )
    );

    return next;
  }

  function financeFoundationCurrentTariff(){
    const saved =
      sportFinanceReadJson(
        window.localStorage,
        LOCAL_TARIFF_KEY,
        null
      );

    if(
      saved &&
      typeof saved === "object"
    ){
      return saved;
    }

    const initial = {

      version:
        "BCA-FEE-1",

      effectiveFrom:
        "2026-09-09T00:00:00.000Z",

      bociteArtRateHT:
        BOCITEART_BASE_FEE_RATE_HT,

      pspIndexReference:
        100,

      source:
        "initial_policy",

      serverAuthorityRequiredInProduction:
        true,

      createdAt:
        sportFinanceNow()
    };

    sportFinanceWriteJson(
      window.localStorage,
      LOCAL_TARIFF_KEY,
      initial
    );

    return initial;
  }

  function financeFoundationCurrentFeeRateHT(){
    const tariff =
      financeFoundationCurrentTariff();

    const rate =
      Number(
        tariff &&
        tariff.bociteArtRateHT
      );

    return (
      Number.isFinite(rate) &&
      rate > 0
    )
      ? rate
      : BOCITEART_BASE_FEE_RATE_HT;
  }

  function financeFoundationAccountingDestination(){
    const saved =
      sportFinanceReadJson(
        window.localStorage,
        LOCAL_ACCOUNTING_SETTINGS_KEY,
        null
      );

    if(
      saved &&
      typeof saved === "object"
    ){
      return saved;
    }

    return {

      status:
        "configuration_pending",

      accountantClientRef:
        "",

      accountantName:
        "",

      accountingFirmName:
        "",

      platformId:
        "",

      platformName:
        "",

      platformEndpointConfiguredServerSide:
        false,

      transmissionMode:
        "dedicated_accounting_platform",

      updatedAt:
        sportFinanceNow()
    };
  }

  function financeFoundationConfigureAccountingDestination(nextSettings){
    const source =
      nextSettings &&
      typeof nextSettings === "object"
        ? nextSettings
        : {};

    const previous =
      financeFoundationAccountingDestination();

    const next =
      Object.assign(
        {},
        previous,
        {
          accountantClientRef:
            sportFinanceText(
              source.accountantClientRef ||
              previous.accountantClientRef
            ),

          accountantName:
            sportFinanceText(
              source.accountantName ||
              previous.accountantName
            ),

          accountingFirmName:
            sportFinanceText(
              source.accountingFirmName ||
              previous.accountingFirmName
            ),

          platformId:
            sportFinanceText(
              source.platformId ||
              previous.platformId
            ),

          platformName:
            sportFinanceText(
              source.platformName ||
              previous.platformName
            ),

          status:
            sportFinanceText(
              source.status ||
              previous.status ||
              "configuration_pending"
            ),

          platformEndpointConfiguredServerSide:
            source.platformEndpointConfiguredServerSide === true,

          transmissionMode:
            "dedicated_accounting_platform",

          updatedAt:
            sportFinanceNow()
        }
      );

    sportFinanceWriteJson(
      window.localStorage,
      LOCAL_ACCOUNTING_SETTINGS_KEY,
      next
    );

    return sportFinanceClone(next);
  }

  function financeFoundationInvoiceBlueprint(kind){
    return {

      documentKind:
        sportFinanceText(kind) ||
        "generic_invoice",

      finalGeneration:
        "server_only",

      finalInvoiceNumber:
        "server_chronological_continuous_sequence",

      invoiceDate:
        "server_issue_date",

      serviceDateOrPeriod:
        "operation_or_period_date",

      currency:
        "EUR",

      issuer:{

        permanentClientNumber:
          true,

        legalName:
          true,

        legalForm:
          true,

        sirenSiret:
          true,

        address:
          true,

        vatNumber:
          "when_applicable"
      },

      customer:{

        permanentClientNumber:
          true,

        legalName:
          true,

        sirenSiret:
          "when_required",

        billingAddress:
          true,

        vatNumber:
          "when_applicable"
      },

      operation:{

        reference:
          true,

        description:
          true,

        quantity:
          true,

        unitPriceHT:
          true,

        totalHT:
          true,

        vatRate:
          "according_to_actual_status",

        vatAmount:
          "server_calculated",

        totalTTC:
          "server_calculated"
      },

      payment:{

        method:
          true,

        dueDateOrPaidAt:
          true,

        pspReference:
          "when_applicable",

        paymentTerms:
          true,

        latePenaltyMention:
          "when_legally_required",

        recoveryCompensationMention:
          "when_legally_required"
      },

      electronicInvoicing:{

        categoryOfOperation:
          true,

        customerSiren:
          "when_required",

        platformRouting:
          "server_connector",

        legalFormat:
          "current_rule_monitored_by_agent2"
      },

      correction:{

        originalNeverSilentlyRewritten:
          true,

        rectificationDocumentWhenLegallyRequired:
          true,

        auditTrailRequired:
          true
      },

      retentionYears:
        ACCOUNTING_RETENTION_YEARS
    };
  }

  function financeFoundationGetDailyAdminSummary(){
    const operations =
      sportFinanceReadOperations();

    const audits =
      sportFinanceReadJson(
        window.localStorage,
        LOCAL_AUDIT_KEY,
        []
      );

    const problems =
      (
        Array.isArray(audits)
          ? audits
          : []
      )
        .filter(
          function(item){
            return !!(
              item &&
              (
                item.level === "red" ||
                item.level === "orange"
              ) &&
              item.resolved !== true
            );
          }
        );

    const totals =
      operations.reduce(
        function(acc,item){

          const amount =
            Number(
              item.totalPaymentAmount ||
              item.amountHT ||
              0
            );

          if(
            item.status === "paid"
          ){
            acc.paidCount += 1;
            acc.paidAmount +=
              Number.isFinite(amount)
                ? amount
                : 0;
          }

          if(
            item.status === "payment_pending"
          ){
            acc.pendingCount += 1;
          }

          if(
            item.status === "refused" ||
            item.status === "cancelled" ||
            item.status === "disputed"
          ){
            acc.problemCount += 1;
          }

          return acc;
        },
        {
          paidCount:0,
          paidAmount:0,
          pendingCount:0,
          problemCount:0
        }
      );

    return {

      generatedAt:
        sportFinanceNow(),

      state:
        problems.some(
          function(item){
            return item.level === "red";
          }
        )
          ? "red"
          : (
              problems.length
                ? "orange"
                : "green"
            ),

      problems:
        sportFinanceClone(
          problems
        ) ||
        [],

      totals:
        totals,

      message:
        problems.length
          ? problems.length + " point(s) nécessitent une attention."
          : "Tout est OK."
    };
  }

  if(
    !window.BociteFinanceFoundation ||
    window.BociteFinanceFoundation.ready !== true
  ){
    window.BociteFinanceFoundation = {

      ready:
        true,

      version:
        VERSION,

      policies:
        financeFoundationAccountingPolicies,

      agent1Blueprint:
        financeFoundationAgent1Blueprint,

      agent2Blueprint:
        financeFoundationAgent2Blueprint,

      ensureLocalClientNumber:
        financeFoundationEnsureLocalClientNumber,

      formatClientNumber:
        financeFoundationFormatClientNumber,

      buildAccountingDossier:
        financeFoundationBuildAccountingDossier,

      saveAudit:
        financeFoundationSaveAudit,

      getDailyAdminSummary:
        financeFoundationGetDailyAdminSummary,

      getCurrentTariff:
        function(){
          return sportFinanceClone(
            financeFoundationCurrentTariff()
          );
        },

      getCurrentFeeRateHT:
        financeFoundationCurrentFeeRateHT,

      getAccountingDestination:
        function(){
          return sportFinanceClone(
            financeFoundationAccountingDestination()
          );
        },

      configureAccountingDestination:
        financeFoundationConfigureAccountingDestination,

      invoiceBlueprint:
        financeFoundationInvoiceBlueprint,

      runGovernanceCheck:
        async function(){

          if(
            sportFinanceIsProduction()
          ){
            return sportFinanceServerPost(
              "/finance/governance/run",
              {
                requestedAt:
                  sportFinanceNow(),

                currentTariff:
                  financeFoundationCurrentTariff(),

                policies:
                  financeFoundationAccountingPolicies()
              }
            );
          }

          return {

            ok:
              true,

            mode:
              "preproduction",

            agent2:
              "ready_for_server_monitoring",

            tariff:
              financeFoundationCurrentTariff(),

            legalMonitoring:
              "server_connection_required",

            accountingPlatform:
              "configuration_pending"
          };
        }
    };
  }

  /* =========================================================
     ÇA FINIT ICI — BLOC 1
     ========================================================= */

   /* =========================================================
     BLOC 2
     SPORT — IDENTITÉS — NUMÉROS CLIENTS — LOGO — PROFIL
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

      return Array.isArray(rows)
        ? rows
        : [];
    }

    return [];
  }


  function sportFinanceAssociations(){

    const fromSport =
      sportFinanceSportAssociations()
        .filter(
          function(item){

            return !!(

              item &&

              item.active === true &&

              item.verified === true &&

              item.canIssueRequiredDocument === true &&

              item.renewalEligible !== false &&

              sportFinanceText(
                item.id
              )
            );
          }
        )
        .map(
          function(item){

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

              sirenSiret:
                sportFinanceText(
                  item.sirenSiret ||
                  item.siret ||
                  item.siren
                ),

              rnaNumber:
                sportFinanceText(
                  item.rnaNumber
                ),

              address:
                sportFinanceText(
                  item.address
                ),

              accountingEmail:
                sportFinanceText(
                  item.accountingEmail
                ),

              taxReceiptEligible:
                item.taxReceiptEligible === true,

              clientNumber:
                sportFinanceText(
                  item.clientNumber
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
        function(item){

          return !!(

            item &&

            item.validated === true &&

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
        function(item){

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

            sirenSiret:
              sportFinanceText(
                item.sirenSiret ||
                item.siret ||
                item.siren
              ),

            rnaNumber:
              sportFinanceText(
                item.rnaNumber
              ),

            address:
              sportFinanceText(
                item.address
              ),

            accountingEmail:
              sportFinanceText(
                item.accountingEmail
              ),

            taxReceiptEligible:
              item.taxReceiptEligible === true,

            clientNumber:
              sportFinanceText(
                item.clientNumber
              ),

            validated:
              true
          };
        }
      );
  }


  function sportFinanceReadSavedProfile(){

    const value =
      sportFinanceReadJson(
        window.sessionStorage,
        PROFILE_KEY,
        {}
      );

    return (
      value &&
      typeof value === "object"
    )
      ? value
      : {};
  }


  function sportFinanceSaveProfile(profile){

    const clean =
      profile &&
      typeof profile === "object"
        ? profile
        : {};

    sportFinanceWriteJson(
      window.sessionStorage,
      PROFILE_KEY,
      clean
    );

    window
      .BOCITEART_LAST_SPORT_MERCHANT_PROFILE =
        Object.assign(
          {},
          clean
        );

    return clean;
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
      typeof shared === "object"
        ? shared
        : {},

      saved
    );
  }


  function sportFinanceReadProfile(){

    const previous =
      sportFinanceReadSavedProfile();

    return {

      clientNumber:
        sportFinanceText(
          previous.clientNumber
        ),

      technicalId:
        sportFinanceText(
          previous.technicalId
        ) ||
        sportFinanceId(
          "merchant"
        ),

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


  function sportFinanceEnsureMerchantClientNumber(profile){

    const source =
      profile &&
      typeof profile === "object"
        ? profile
        : {};

    const stableKey =
      sportFinanceDigits(
        source.sirenSiret
      ) ||
      sportFinanceText(
        source.technicalId
      );

    if(!stableKey){
      return "";
    }

    if(
      sportFinanceIsProduction()
    ){
      return sportFinanceText(
        source.clientNumber
      );
    }

    return financeFoundationEnsureLocalClientNumber(
      "merchant",
      stableKey,
      source.clientNumber
    );
  }


  function sportFinanceEnsureClubClientNumber(club){

    const source =
      club &&
      typeof club === "object"
        ? club
        : {};

    const stableKey =
      sportFinanceText(
        source.clubRef
      ) ||
      sportFinanceDigits(
        source.sirenSiret ||
        source.siret ||
        source.siren
      );

    if(!stableKey){
      return "";
    }

    if(
      sportFinanceIsProduction()
    ){
      return sportFinanceText(
        source.clientNumber
      );
    }

    return financeFoundationEnsureLocalClientNumber(
      "club",
      stableKey,
      source.clientNumber
    );
  }


  function sportFinanceEnsureAssociationClientNumber(association){

    if(!association){
      return "";
    }

    const stableKey =
      sportFinanceText(
        association.id
      ) ||
      sportFinanceDigits(
        association.sirenSiret
      );

    if(!stableKey){
      return "";
    }

    if(
      sportFinanceIsProduction()
    ){
      return sportFinanceText(
        association.clientNumber
      );
    }

    return financeFoundationEnsureLocalClientNumber(
      "association",
      stableKey,
      association.clientNumber
    );
  }


  function sportFinanceMerchantSnapshot(profile){

    const source =
      profile &&
      typeof profile === "object"
        ? profile
        : {};

    const clientNumber =
      sportFinanceEnsureMerchantClientNumber(
        source
      );

    return {

      clientNumber:
        clientNumber,

      technicalId:
        sportFinanceText(
          source.technicalId
        ),

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


  function sportFinanceClubSnapshot(club){

    const source =
      club &&
      typeof club === "object"
        ? club
        : {};

    return {

      clientNumber:
        sportFinanceEnsureClubClientNumber(
          source
        ),

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
        ),

      address:
        sportFinanceText(
          source.address
        ),

      logoRef:
        sportFinanceText(
          source.logoRef
        )
    };
  }


  function sportFinanceAssociationSnapshot(association){

    if(!association){
      return null;
    }

    return {

      clientNumber:
        sportFinanceEnsureAssociationClientNumber(
          association
        ),

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

      sirenSiret:
        sportFinanceText(
          association.sirenSiret
        ),

      rnaNumber:
        sportFinanceText(
          association.rnaNumber
        ),

      address:
        sportFinanceText(
          association.address
        ),

      accountingEmail:
        sportFinanceText(
          association.accountingEmail
        ),

      taxReceiptEligible:
        association.taxReceiptEligible === true,

      validated:
        association.validated === true
    };
  }


  function sportFinanceIdentityLocalCheck(profile){

    const source =
      profile &&
      typeof profile === "object"
        ? profile
        : {};

    const errors =
      [];

    const digits =
      sportFinanceDigits(
        source.sirenSiret
      );

    if(
      !source.name
    ){
      errors.push(
        "Le nom ou l’enseigne est obligatoire."
      );
    }

    if(
      !digits
    ){
      errors.push(
        "Le SIREN ou SIRET est obligatoire."
      );

    }else if(
      digits.length !== 9 &&
      digits.length !== 14
    ){
      errors.push(
        "Le SIREN ou SIRET doit comporter 9 ou 14 chiffres."
      );
    }

    if(
      !source.address
    ){
      errors.push(
        "L’adresse professionnelle est obligatoire."
      );
    }

    if(
      !source.accountingEmail
    ){
      errors.push(
        "L’adresse électronique comptable est obligatoire."
      );

    }else if(
      !sportFinanceEmailLooksValid(
        source.accountingEmail
      )
    ){
      errors.push(
        "L’adresse électronique comptable n’est pas valide."
      );
    }

    if(
      source.email &&
      !sportFinanceEmailLooksValid(
        source.email
      )
    ){
      errors.push(
        "L’adresse électronique n’est pas valide."
      );
    }

    if(
      source.vatNumber
    ){
      const vat =
        sportFinanceText(
          source.vatNumber
        )
          .replace(
            /\s+/g,
            ""
          )
          .toUpperCase();

      if(
        !/^[A-Z]{2}[A-Z0-9]{8,12}$/
          .test(vat)
      ){
        errors.push(
          "Le numéro de TVA intracommunautaire indiqué n’est pas valide."
        );
      }
    }

    return {

      ok:
        errors.length === 0,

      status:
        errors.length
          ? "correction_required"
          : "prechecked",

      errors:
        errors,

      checkedAt:
        sportFinanceNow(),

      source:
        "local_format_precheck"
    };
  }


  async function sportFinanceVerifyIdentity(profile){

    const source =
      profile &&
      typeof profile === "object"
        ? profile
        : sportFinanceReadProfile();

    const local =
      sportFinanceIdentityLocalCheck(
        source
      );

    if(
      !local.ok
    ){
      identityCheckCache =
        local;

      return local;
    }

    if(
      !sportFinanceIsProduction()
    ){
      const clientNumber =
        sportFinanceEnsureMerchantClientNumber(
          source
        );

      identityCheckCache =
        Object.assign(
          {},
          local,
          {
            ok:true,
            status:"prechecked",
            clientNumber:clientNumber,
            officialSourceConnection:
              "server_required_for_final_validation"
          }
        );

      return sportFinanceClone(
        identityCheckCache
      );
    }

    const result =
      await sportFinanceServerPost(

        "/finance/identity/verify",

        {

          entityType:
            "merchant",

          identity:{

            clientNumber:
              sportFinanceText(
                source.clientNumber
              ),

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
              ),

            address:
              sportFinanceText(
                source.address
              ),

            accountingEmail:
              sportFinanceText(
                source.accountingEmail
              )
          },

          requiredReferenceSources:[
            "RNE_INPI",
            "SIRENE",
            "VAT_IF_APPLICABLE"
          ],

          userMustCorrectOwnData:
            true
        }
      );

    identityCheckCache =
      result ||
      {
        ok:false,
        status:"correction_required",
        errors:[
          "La vérification n’a pas abouti."
        ]
      };

    if(
      identityCheckCache.ok === true &&
      identityCheckCache.clientNumber
    ){
      source.clientNumber =
        sportFinanceText(
          identityCheckCache.clientNumber
        );

      sportFinanceSaveProfile(
        source
      );
    }

    return sportFinanceClone(
      identityCheckCache
    );
  }


  function sportFinanceIdentityAccepted(result){

    if(
      !result ||
      result.ok !== true
    ){
      return false;
    }

    if(
      sportFinanceIsProduction()
    ){
      return (
        result.status === "verified" ||
        result.status === "concordant"
      );
    }

    return (
      result.status === "prechecked" ||
      result.status === "verified" ||
      result.status === "concordant"
    );
  }


  function sportFinanceBrandingStore(){

    const value =
      sportFinanceReadJson(
        window.localStorage,
        LOCAL_BRANDING_KEY,
        {}
      );

    return (
      value &&
      typeof value === "object"
    )
      ? value
      : {};
  }


  async function sportFinanceUploadClubLogo(file){

    if(
      !file
    ){
      throw new Error(
        "Choisissez un fichier image."
      );
    }

    if(
      !/^image\//
        .test(
          file.type ||
          ""
        )
    ){
      throw new Error(
        "Le logo doit être une image."
      );
    }

    if(
      file.size >
      1024 * 1024
    ){
      throw new Error(
        "Le logo doit rester inférieur à 1 Mo."
      );
    }

    const club =
      sportFinanceClubSnapshot(
        sportFinanceClub()
      );

    if(
      !club.clubRef
    ){
      throw new Error(
        "La référence du club est manquante."
      );
    }

    if(
      sportFinanceIsProduction()
    ){
      const base =
        sportFinanceApiBase();

      if(
        !base
      ){
        throw new Error(
          "Le serveur Finance n'est pas configuré."
        );
      }

      const form =
        new FormData();

      form.append(
        "entityType",
        "club"
      );

      form.append(
        "entityRef",
        club.clubRef
      );

      form.append(
        "logo",
        file
      );

      const response =
        await fetch(
          base +
          "/finance/entities/branding",
          {
            method:"POST",
            credentials:"include",
            body:form
          }
        );

      if(
        !response.ok
      ){
        throw new Error(
          "Le logo n'a pas pu être enregistré."
        );
      }

      return response.json();
    }

    const dataUrl =
      await new Promise(
        function(resolve,reject){

          const reader =
            new FileReader();

          reader.onload =
            function(){
              resolve(
                String(
                  reader.result ||
                  ""
                )
              );
            };

          reader.onerror =
            function(){
              reject(
                new Error(
                  "Lecture du logo impossible."
                )
              );
            };

          reader.readAsDataURL(
            file
          );
        }
      );

    const store =
      sportFinanceBrandingStore();

    store[
      club.clubRef
    ] = {

      logoDataUrl:
        dataUrl,

      fileName:
        sportFinanceText(
          file.name
        ),

      updatedAt:
        sportFinanceNow()
    };

    sportFinanceWriteJson(
      window.localStorage,
      LOCAL_BRANDING_KEY,
      store
    );

    return {
      ok:true,
      mode:"preproduction",
      clubRef:club.clubRef
    };
  }

  /* =========================================================
     ÇA FINIT ICI — BLOC 2
     ========================================================= */

   /* =========================================================
     BLOC 3
     SPORT — PUBLICITÉ INDÉPENDANTE — 72 HEURES — CAPACITÉ 6
     ========================================================= */

  function sportFinanceDateTimeLocalValue(date){

    const d =
      date instanceof Date
        ? date
        : new Date(date);

    if(
      Number.isNaN(
        d.getTime()
      )
    ){
      return "";
    }

    const pad =
      function(value){
        return String(value)
          .padStart(
            2,
            "0"
          );
      };

    return (
      d.getFullYear() +
      "-" +
      pad(
        d.getMonth() + 1
      ) +
      "-" +
      pad(
        d.getDate()
      ) +
      "T" +
      pad(
        d.getHours()
      ) +
      ":" +
      pad(
        d.getMinutes()
      )
    );
  }


  function sportFinanceRoundDateToStep(date,minutes){

    const d =
      new Date(
        date instanceof Date
          ? date.getTime()
          : date
      );

    const step =
      Math.max(
        1,
        Number(minutes) || 1
      );

    const ms =
      step *
      60 *
      1000;

    d.setTime(
      Math.ceil(
        d.getTime() / ms
      ) * ms
    );

    d.setSeconds(
      0,
      0
    );

    return d;
  }


  function sportFinanceDefaultStart(){

    return sportFinanceRoundDateToStep(
      new Date(
        Date.now() +
        2 * 60 * 1000
      ),
      5
    );
  }


  function sportFinanceParseDateTime(value){

    const text =
      sportFinanceText(value);

    if(
      !text
    ){
      return null;
    }

    const date =
      new Date(text);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  }


  function sportFinancePublicationRange(startValue){

    const startDate =
      sportFinanceParseDateTime(
        startValue
      );

    if(
      !startDate
    ){
      return null;
    }

    const endDate =
      new Date(
        startDate.getTime() +
        PUBLICATION_DURATION_MS
      );

    return {

      startIso:
        startDate.toISOString(),

      endIso:
        endDate.toISOString(),

      startLocal:
        sportFinanceDateTimeLocalValue(
          startDate
        ),

      endLocal:
        sportFinanceDateTimeLocalValue(
          endDate
        ),

      durationHours:
        72
    };
  }


  function sportFinanceDateTimeFr(value){

    const date =
      new Date(value);

    if(
      Number.isNaN(
        date.getTime()
      )
    ){
      return sportFinanceText(value);
    }

    return date
      .toLocaleString(
        "fr-FR",
        {
          day:"2-digit",
          month:"2-digit",
          year:"numeric",
          hour:"2-digit",
          minute:"2-digit"
        }
      );
  }


  function sportFinanceIntervalsOverlap(
    startA,
    endA,
    startB,
    endB
  ){

    const a1 =
      new Date(startA)
        .getTime();

    const a2 =
      new Date(endA)
        .getTime();

    const b1 =
      new Date(startB)
        .getTime();

    const b2 =
      new Date(endB)
        .getTime();

    if(
      [
        a1,
        a2,
        b1,
        b2
      ]
        .some(
          function(value){
            return Number.isNaN(
              value
            );
          }
        )
    ){
      return false;
    }

    return (
      a1 < b2 &&
      b1 < a2
    );
  }


  function sportFinanceReadLocalSlots(){

    const value =
      sportFinanceReadJson(
        window.localStorage,
        LOCAL_SLOTS_KEY,
        []
      );

    return Array.isArray(value)
      ? value
      : [];
  }


  function sportFinanceWriteLocalSlots(rows){

    return sportFinanceWriteJson(
      window.localStorage,
      LOCAL_SLOTS_KEY,
      Array.isArray(rows)
        ? rows.slice(
            -MAX_LOCAL_SLOTS
          )
        : []
    );
  }


  function sportFinanceCleanLocalSlots(){

    const now =
      Date.now();

    const rows =
      sportFinanceReadLocalSlots();

    let changed =
      false;

    rows.forEach(
      function(item){

        if(
          item &&
          item.status === "held" &&
          Number(
            item.expiresAt ||
            0
          ) <= now
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


  function sportFinanceRelevantSlotStatus(status){

    return [
      "held",
      "payment_pending",
      "paid",
      "scheduled",
      "active",
      "reschedule_required"
    ]
      .includes(
        sportFinanceText(
          status
        )
      );
  }


  function sportFinanceLocalMaxConcurrency(
    startIso,
    endIso,
    ignoreHoldId
  ){

    const rows =
      sportFinanceCleanLocalSlots()
        .filter(
          function(item){

            return !!(

              item &&

              sportFinanceRelevantSlotStatus(
                item.status
              ) &&

              sportFinanceText(
                item.id
              ) !==
              sportFinanceText(
                ignoreHoldId
              ) &&

              sportFinanceIntervalsOverlap(
                item.publicationStart,
                item.publicationEnd,
                startIso,
                endIso
              )
            );
          }
        );

    const events =
      [];

    rows.forEach(
      function(item){

        const start =
          Math.max(
            new Date(
              item.publicationStart
            )
              .getTime(),

            new Date(
              startIso
            )
              .getTime()
          );

        const end =
          Math.min(
            new Date(
              item.publicationEnd
            )
              .getTime(),

            new Date(
              endIso
            )
              .getTime()
          );

        events.push({
          time:start,
          delta:1
        });

        events.push({
          time:end,
          delta:-1
        });
      }
    );

    events.sort(
      function(a,b){

        if(
          a.time === b.time
        ){
          return (
            a.delta -
            b.delta
          );
        }

        return (
          a.time -
          b.time
        );
      }
    );

    let count =
      0;

    let max =
      0;

    events.forEach(
      function(event){

        count +=
          event.delta;

        max =
          Math.max(
            max,
            count
          );
      }
    );

    return max;
  }


  function sportFinanceLocalAvailability(
    startValue,
    ignoreHoldId
  ){

    const range =
      sportFinancePublicationRange(
        startValue
      );

    if(
      !range
    ){
      return {
        ok:false,
        available:false,
        reason:"invalid_datetime"
      };
    }

    const existingMax =
      sportFinanceLocalMaxConcurrency(
        range.startIso,
        range.endIso,
        ignoreHoldId
      );

    return {

      ok:true,

      available:
        existingMax <
        CONCURRENT_CAPACITY,

      existingMaxConcurrency:
        existingMax,

      capacity:
        CONCURRENT_CAPACITY,

      publicationStart:
        range.startIso,

      publicationEnd:
        range.endIso,

      durationHours:
        72
    };
  }


  async function sportFinanceCheckAvailability(startValue){

    const range =
      sportFinancePublicationRange(
        startValue
      );

    if(
      !range
    ){
      return {
        ok:false,
        available:false,
        reason:"invalid_datetime"
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
              range.startIso,

            publicationEnd:
              range.endIso,

            durationHours:
              72,

            concurrentCapacity:
              CONCURRENT_CAPACITY,

            clubRef:
              sportFinanceText(
                sportFinanceClub()
                  .clubRef
              ),

            ignoreSlotHoldId:
              currentHold &&
              currentHold.slotHoldId
          }
        );

      return Object.assign(
        {
          publicationStart:
            range.startIso,

          publicationEnd:
            range.endIso,

          durationHours:
            72
        },
        result ||
        {}
      );
    }

    return sportFinanceLocalAvailability(
      range.startIso,
      currentHold &&
      currentHold.slotHoldId
    );
  }


  async function sportFinanceFindNextAvailability(fromValue){

    const requested =
      sportFinanceParseDateTime(
        fromValue
      ) ||
      new Date();

    if(
      sportFinanceIsProduction()
    ){

      const result =
        await sportFinanceServerPost(

          "/sport/publicity/next-available",

          {

            from:
              requested.toISOString(),

            durationHours:
              72,

            concurrentCapacity:
              CONCURRENT_CAPACITY,

            clubRef:
              sportFinanceText(
                sportFinanceClub()
                  .clubRef
              )
          }
        );

      return result ||
        {
          ok:false
        };
    }

    const limit =
      requested.getTime() +
      LOCAL_NEXT_SLOT_SEARCH_DAYS *
      24 *
      60 *
      60 *
      1000;

    let candidate =
      sportFinanceRoundDateToStep(
        requested,
        LOCAL_NEXT_SLOT_STEP_MINUTES
      );

    while(
      candidate.getTime() <=
      limit
    ){

      const result =
        sportFinanceLocalAvailability(
          candidate.toISOString(),
          currentHold &&
          currentHold.slotHoldId
        );

      if(
        result.available
      ){
        return Object.assign(
          {
            ok:true
          },
          result
        );
      }

      candidate =
        new Date(
          candidate.getTime() +
          LOCAL_NEXT_SLOT_STEP_MINUTES *
          60 *
          1000
        );
    }

    return {

      ok:false,

      available:false,

      reason:
        "no_slot_in_local_search_window"
    };
  }


  async function sportFinanceReserveSlot(
    startValue,
    context
  ){

    const range =
      sportFinancePublicationRange(
        startValue
      );

    if(
      !range
    ){
      throw new Error(
        "Choisissez une date et une heure de diffusion valides."
      );
    }

    if(
      currentHold &&
      currentHold.slotHoldId &&
      currentHold.publicationStart ===
        range.startIso &&
      Number(
        currentHold.expiresAt ||
        0
      ) >
      Date.now()
    ){
      return sportFinanceClone(
        currentHold
      );
    }

    if(
      currentHold &&
      currentHold.slotHoldId
    ){
      await sportFinanceReleaseHold(
        "datetime_changed"
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
              range.startIso,

            publicationEnd:
              range.endIso,

            durationHours:
              72,

            concurrentCapacity:
              CONCURRENT_CAPACITY,

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
              )
          }
        );

      if(
        !result ||
        result.ok !== true ||
        !sportFinanceText(
          result.slotHoldId
        )
      ){
        throw new Error(
          "Ce créneau n'est plus disponible. Choisissez une autre date ou heure."
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
            range.startIso
          ),

        publicationEnd:
          sportFinanceText(
            result.publicationEnd ||
            range.endIso
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
        range.startIso
      );

    if(
      !availability.available
    ){
      throw new Error(
        "Six publicités sont déjà programmées sur une partie de cette période de 72 heures."
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
        range.startIso,

      publicationEnd:
        range.endIso,

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
              MANUAL_EXTENSION_MINUTES,

            manualPreparationInProgress:
              true
          }
        );

      if(
        !result ||
        result.ok !== true
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
        function(item){

          return (
            sportFinanceText(
              item.id
            ) ===
            currentHold.slotHoldId
          );
        }
      );

    if(
      index < 0 ||
      rows[index].status !==
        "held"
    ){
      throw new Error(
        "La réservation temporaire a expiré."
      );
    }

    rows[index].expiresAt =
      Math.max(
        Date.now(),
        Number(
          rows[index].expiresAt ||
          0
        )
      ) +
      MANUAL_EXTENSION_MINUTES *
      60000;

    rows[index].extendedAt =
      Date.now();

    sportFinanceWriteLocalSlots(
      rows
    );

    currentHold.expiresAt =
      rows[index].expiresAt;

    sportFinanceRenderHoldStatus();

    return sportFinanceClone(
      currentHold
    );
  }


  async function sportFinanceReleaseHold(reason){

    if(
      !currentHold ||
      !currentHold.slotHoldId
    ){
      return true;
    }

    const holdId =
      currentHold.slotHoldId;

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

        financeFoundationSaveAudit({

          level:
            "orange",

          code:
            "slot_release_server_pending",

          message:
            error.message,

          slotHoldId:
            holdId,

          resolved:
            false
        });
      }

    }else{

      const rows =
        sportFinanceReadLocalSlots();

      const index =
        rows.findIndex(
          function(item){
            return (
              sportFinanceText(
                item.id
              ) ===
              holdId
            );
          }
        );

      if(
        index >= 0 &&
        rows[index].status ===
          "held"
      ){

        rows[index].status =
          "released";

        rows[index].releasedAt =
          Date.now();

        rows[index].releaseReason =
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


  function sportFinanceCommitLocalHold(draft){

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
        function(item){

          return (
            sportFinanceText(
              item.id
            ) ===
            holdId
          );
        }
      );

    if(
      index >= 0
    ){

      rows[index].status =
        "scheduled";

      rows[index].paidAt =
        Date.now();

      sportFinanceWriteLocalSlots(
        rows
      );
    }
  }

  /* =========================================================
     ÇA FINIT ICI — BLOC 3
     ========================================================= */

   /* =========================================================
     BLOC 4
     SPORT — DOSSIERS — MONTANTS — DOCUMENTS — AGENT 1 / 2
     ========================================================= */

  function sportFinanceReadOperations(){

    const rows =
      sportFinanceReadJson(
        window.localStorage,
        OPERATIONS_KEY,
        []
      );

    return Array.isArray(rows)
      ? rows
      : [];
  }


  function sportFinanceWriteOperations(rows){

    return sportFinanceWriteJson(
      window.localStorage,
      OPERATIONS_KEY,
      Array.isArray(rows)
        ? rows.slice(
            -MAX_LOCAL_OPERATIONS
          )
        : []
    );
  }


  function sportFinanceUpsertOperation(data){

    const source =
      data &&
      typeof data === "object"
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

    const rows =
      sportFinanceReadOperations();

    const index =
      rows.findIndex(
        function(item){

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
        ? rows[index]
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
          createdAt:
            previous.createdAt ||
            sportFinanceNow(),

          updatedAt:
            sportFinanceNow()
        }
      );

    if(
      index >= 0
    ){
      rows[index] =
        next;
    }else{
      rows.push(
        next
      );
    }

    sportFinanceWriteOperations(
      rows
    );

    return sportFinanceClone(
      next
    );
  }


  function sportFinanceLatestOperation(){

    return sportFinanceReadOperations()
      .slice()
      .sort(
        function(a,b){

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


  function sportFinanceStatusLabel(status){

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
      ] ||
      "État en cours"
    );
  }


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
      youth.locked !== true
    ){
      return {

        locked:false,

        choice:"",

        associationId:"",

        associationName:"",

        groupName:""
      };
    }

    return {

      locked:true,

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
        function(item){

          return (
            String(
              item.id
            ) ===
            String(id)
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
      choice === "HALF_HALF" ||
      Number(
        extraResearchAmount ||
        0
      ) > 0
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

    const research =
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
          " soutient le club " +
          clubName +
          (
            research
              ? " et apporte également son soutien à la recherche médicale"
              : ""
          ) +
          " avec Bo'CitéArt."
        );


      case "LOCAL":

        return (
          "Avec " +
          merchantName +
          ", le club " +
          clubName +
          " bénéficie d’un soutien local" +
          (
            research
              ? ", avec un soutien distinct également apporté à la recherche médicale"
              : ""
          ) +
          "."
        );


      case "CLUB_THANKS":

        return (
          "Le club " +
          clubName +
          " remercie " +
          merchantName +
          " pour son soutien au club" +
          (
            research
              ? " et pour son soutien à la recherche médicale"
              : ""
          ) +
          "."
        );


      case "THANKS":
      default:

        return (
          "Merci à " +
          merchantName +
          " pour son soutien au club " +
          clubName +
          (
            research
              ? " et pour son soutien à la recherche médicale"
              : ""
          ) +
          "."
        );
    }
  }


  function sportFinanceGrossAllocation(
    amountHT,
    choice,
    extraResearchAmount
  ){

    const sponsorship =
      sportFinanceRound(
        amountHT
      );

    const extra =
      sportFinanceRound(
        extraResearchAmount
      );

    const clubGross =
      choice ===
        "HALF_HALF"
        ? sportFinanceRound(
            sponsorship / 2
          )
        : sponsorship;

    const associationParrainageGross =
      choice ===
        "HALF_HALF"
        ? sportFinanceRound(
            sponsorship -
            clubGross
          )
        : 0;

    return {

      sponsorshipGrossHT:
        sponsorship,

      clubGrossHT:
        clubGross,

      associationParrainageGrossHT:
        associationParrainageGross,

      independentResearchGross:
        extra,

      paymentBaseBeforeFinalTax:
        sportFinanceRound(
          sponsorship +
          extra
        ),

      finalPaymentTotal:
        "server_quote_after_actual_tax_qualification"
    };
  }


  function sportFinanceCurrentFeeRateHT(){

    return financeFoundationCurrentFeeRateHT();
  }


  function sportFinancePolicies(){

    return {

      common:
        financeFoundationAccountingPolicies(),

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
          true,

        finalPaymentQuoteServerSide:
          true
      },

      publication:{

        independentFromCabas:
          true,

        durationHours:
          72,

        concurrentCapacity:
          CONCURRENT_CAPACITY,

        immediateStartAllowedWhenAvailable:
          true,

        futureProgrammingAllowed:
          true,

        nextAvailableProposalRequired:
          true,

        datetimeRequired:
          true,

        holdMinutes:
          HOLD_MINUTES,

        manualExtensionMinutes:
          MANUAL_EXTENSION_MINUTES,

        startOnlyAfterConfirmedPayment:
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

        merchantDoesNotDirectlyPayBociteArtFeeAsExtraLine:
          true,

        beneficiarySettlementDeductsAuthorizedFees:
          true
      },

      allocation:{

        youthChoiceMustBeRespectedWhenLocked:
          true,

        beneficiaryGrossAmountsRecordedBeforeFees:
          true,

        currentBociteArtFeeRateHT:
          sportFinanceCurrentFeeRateHT(),

        bociteArtFeeChargedToEachBeneficiaryOnItsGrossShare:
          true,

        pspFeeSeparateAndAllocatedByServer:
          true,

        associationTaxReceiptNeverAutomaticForAdvertisingShare:
          true,

        independentResearchReceiptOnlyIfActuallyEligible:
          true,

        noPublicInternalSettlementFormula:
          true
      },

      documents:{

        clubGrossParrainageDocumentRequired:
          true,

        clubDocumentCanBeGeneratedUnderMandate:
          true,

        clubLogoOptional:
          true,

        defaultClubLetterheadCanBeGenerated:
          true,

        associationDocumentAccordingToActualQualification:
          true,

        independentResearchReceiptAccordingToEligibility:
          true,

        bociteArtMonthlyServiceInvoiceToClub:
          true,

        bociteArtMonthlyServiceInvoiceToAssociationWhenApplicable:
          true,

        pspFeeEvidenceSeparate:
          true,

        duplicateBillingForbidden:
          true,

        accountingExportRequired:
          true,

        archiveYears:
          ACCOUNTING_RETENTION_YEARS
      },

      audit:{

        agent1:
          financeFoundationAgent1Blueprint(),

        agent2:
          financeFoundationAgent2Blueprint()
      }
    };
  }


  function sportFinanceBuildAccountingDossier(
    data,
    operationRef,
    paymentReference
  ){

    const allocation =
      sportFinanceGrossAllocation(
        data.amountHT,
        data.choice,
        data.extraResearchAmount
      );

    const feeRate =
      sportFinanceCurrentFeeRateHT();

    const beneficiaries = [

      {

        type:
          "club",

        ref:
          data.clubSnapshot.clubRef,

        clientNumber:
          data.clubSnapshot.clientNumber,

        name:
          data.clubSnapshot.name ||
          data.clubSnapshot.officialName,

        grossAmountHT:
          allocation.clubGrossHT,

        bociteArtFeeRateHT:
          feeRate,

        pspFee:
          "server_actual",

        netSettlement:
          "server_calculated",

        document:
          "parrainage_invoice_or_required_equivalent",

        invoiceBlueprint:
          financeFoundationInvoiceBlueprint(
            "club_parrainage"
          )
      }
    ];

    if(
      data.associationSnapshot &&
      allocation.associationParrainageGrossHT > 0
    ){

      beneficiaries.push({

        type:
          "research_association_parrainage_share",

        ref:
          data.associationSnapshot.id,

        clientNumber:
          data.associationSnapshot.clientNumber,

        name:
          data.associationSnapshot.name,

        grossAmountHT:
          allocation.associationParrainageGrossHT,

        bociteArtFeeRateHT:
          feeRate,

        pspFee:
          "server_actual",

        netSettlement:
          "server_calculated",

        taxReceipt:
          false,

        document:
          "accounting_document_not_automatic_tax_receipt",

        invoiceBlueprint:
          financeFoundationInvoiceBlueprint(
            "association_parrainage_share"
          )
      });
    }

    if(
      data.associationSnapshot &&
      allocation.independentResearchGross > 0
    ){

      beneficiaries.push({

        type:
          "research_association_independent_support",

        ref:
          data.associationSnapshot.id,

        clientNumber:
          data.associationSnapshot.clientNumber,

        name:
          data.associationSnapshot.name,

        grossAmount:
          allocation.independentResearchGross,

        bociteArtFeeRateHT:
          feeRate,

        pspFee:
          "server_actual",

        netSettlement:
          "server_calculated",

        taxReceipt:
          data.associationSnapshot.taxReceiptEligible === true
            ? "server_confirm_eligibility"
            : false,

        document:
          "receipt_or_tax_receipt_according_to_actual_eligibility"
      });
    }

    const dossier =
      financeFoundationBuildAccountingDossier({

        operationRef:
          operationRef,

        module:
          "sport",

        flowType:
          "sport_local_sponsorship",

        client:
          data.merchantSnapshot,

        beneficiaries:
          beneficiaries,

        extraResearchAmount:
          data.extraResearchAmount,

        payment:{

          reference:
            sportFinanceText(
              paymentReference
            ),

          sponsorshipAmountHT:
            data.amountHT,

          extraResearchAmount:
            data.extraResearchAmount,

          paymentBaseBeforeFinalTax:
            data.paymentBaseBeforeFinalTax,

          finalPaymentTotal:
            "server_quote_after_actual_tax_qualification",

          status:
            "pending_server_confirmation",

          psp:
            "server_configured_provider",

          pspFeeActualAmount:
            null
        },

        taxation:{

          sponsorship:
            "actual_beneficiary_status",

          independentResearch:
            "server_validate_actual_eligibility",

          bociteArtServiceFee:
            "current_rate_ht_plus_applicable_vat",

          finalQualification:
            "server_only"
        },

        bociteArtFeeRateHT:
          feeRate,

        pspFeeActualAmount:
          null
      });

    dossier.invoiceBlueprints = {

      club:
        financeFoundationInvoiceBlueprint(
          "club_parrainage"
        ),

      bociteartMonthly:
        financeFoundationInvoiceBlueprint(
          "bociteart_monthly_service"
        ),

      research:
        financeFoundationInvoiceBlueprint(
          "research_support"
        ),

      publicEntity:
        financeFoundationInvoiceBlueprint(
          "public_entity"
        )
    };

    dossier.accountingPlatform =
      Object.assign(

        {},

        dossier.accountingPlatform ||
        {},

        {
          destination:
            financeFoundationAccountingDestination()
        }
      );

    dossier.tariff =
      financeFoundationCurrentTariff();

    return dossier;
  }


  function sportFinancePrepareAgent1(
    operation,
    data,
    paymentReference
  ){

    const dossier =
      sportFinanceBuildAccountingDossier(
        data,
        operation.operationRef,
        paymentReference
      );

    dossier.agent1.status =
      "prepared";

    dossier.agent1.preparedAt =
      sportFinanceNow();

    dossier.agent1.operationChecks = {

      payerIdentity:
        true,

      beneficiaryIdentity:
        true,

      publicationWindow:
        true,

      grossAllocation:
        true,

      documentManifest:
        true,

      pspConfirmation:
        "waiting_server",

      pspFees:
        "waiting_server",

      bociteArtFees:
        "waiting_server_recalculation",

      settlements:
        "waiting_server",

      archive:
        "waiting_server",

      accountingDelivery:
        "waiting_agent2"
    };

    return dossier;
  }


  async function sportFinanceQueueAuditAfterPaid(draft){

    const operation =
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

        status:
          "paid",

        accountingStatus:
          "agent1_queued"
      });

    if(
      sportFinanceIsProduction()
    ){

      try{

        const result =
          await sportFinanceServerPost(

            "/finance/audit/queue",

            {

              operationRef:
                sportFinanceText(
                  draft.operationRef
                ),

              paymentReference:
                sportFinanceText(
                  draft.paymentReference
                ),

              accountingDossier:
                sportFinanceClone(
                  draft.accountingDossier
                ) ||
                null,

              requireAgent1:
                true,

              requireAgent2:
                true,

              accountingTransmission:
                "after_agent2_approval"
            }
          );

        sportFinanceUpsertOperation({

          operationRef:
            sportFinanceText(
              draft.operationRef
            ),

          accountingStatus:
            sportFinanceText(
              result &&
              result.accountingStatus
            ) ||
            "agent1_in_progress",

          agent1Status:
            sportFinanceText(
              result &&
              result.agent1Status
            ),

          agent2Status:
            sportFinanceText(
              result &&
              result.agent2Status
            )
        });

      }catch(error){

        financeFoundationSaveAudit({

          level:
            "red",

          code:
            "audit_queue_failed",

          operationRef:
            sportFinanceText(
              draft.operationRef
            ),

          message:
            error.message ||
            "Le dossier n’a pas pu être transmis au contrôle financier.",

          resolved:
            false
        });
      }

    }else{

      sportFinanceUpsertOperation({

        operationRef:
          sportFinanceText(
            draft.operationRef
          ),

        accountingStatus:
          "prepared_for_server_agent1_agent2"
      });
    }

    return operation;
  }

  /* =========================================================
     ÇA FINIT ICI — BLOC 4
     ========================================================= */

   /* =========================================================
     BLOC 5
     SPORT — AFFICHAGE — VALIDATION — RÉCAPITULATIF — PAIEMENT
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
      state === "error"
        ? "#7f1a1d"
        : "#111111";
  }


  function sportFinanceRenderIdentityStatus(result){

    const target =
      sportFinanceField(
        "bcfSportIdentityStatus"
      );

    if(
      !target
    ){
      return;
    }

    if(
      !result
    ){
      target.textContent =
        "La fiche doit être vérifiée avant le paiement.";

      return;
    }

    if(
      sportFinanceIdentityAccepted(
        result
      )
    ){

      target.innerHTML =
        "Fiche vérifiée" +
        (
          result.clientNumber
            ? " — N° client Bo'CitéArt : <strong>" +
              sportFinanceEscape(
                result.clientNumber
              ) +
              "</strong>"
            : ""
        ) +
        ".";

      return;
    }

    const errors =
      Array.isArray(
        result.errors
      )
        ? result.errors
        : [];

    target.textContent =
      errors[0] ||
      "Veuillez rectifier les informations indiquées avant de poursuivre.";
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
            hour:"2-digit",
            minute:"2-digit"
          }
        ) +
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

    if(
      !target
    ){
      return;
    }

    const range =
      sportFinancePublicationRange(
        sportFinanceValue(
          "bcfSportPublicationStart"
        )
      );

    if(
      !range
    ){
      target.textContent =
        "Choisissez une date et une heure de démarrage.";

      return;
    }

    target.textContent =
      "Votre publicité sera diffusée pendant 72 heures, du " +
      sportFinanceDateTimeFr(
        range.startIso
      ) +
      " au " +
      sportFinanceDateTimeFr(
        range.endIso
      ) +
      ", sous réserve de disponibilité et de confirmation du paiement.";
  }


  function sportFinanceUpdateResearchBox(){

    const choice =
      sportFinanceChoice();

    const extra =
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
        choice === "HALF_HALF" ||
        extra
          ? "block"
          : "none";
    }

    if(
      extraBox
    ){
      extraBox.style.display =
        extra
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
          function(template){

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
                  style="margin-top:6px;"
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
      target.textContent =
        "Aucune opération de parrainage enregistrée sur cet appareil.";

      return;
    }

    target.innerHTML =
      "<strong>" +
      sportFinanceEscape(
        sportFinanceStatusLabel(
          operation.status
        )
      ) +
      "</strong>" +

      (
        operation.amountHT
          ? " — " +
            sportFinanceEscape(
              sportFinanceFormatMoney(
                operation.amountHT
              )
            ) +
            " € HT"
          : ""
      ) +

      (
        operation.extraResearchAmount
          ? "<br>Soutien recherche supplémentaire : " +
            sportFinanceEscape(
              sportFinanceFormatMoney(
                operation.extraResearchAmount
              )
            ) +
            " €"
          : ""
      ) +

      (
        operation.publicationStart &&
        operation.publicationEnd
          ? "<br>Diffusion : " +
            sportFinanceEscape(
              sportFinanceDateTimeFr(
                operation.publicationStart
              )
            ) +
            " → " +
            sportFinanceEscape(
              sportFinanceDateTimeFr(
                operation.publicationEnd
              )
            ) +
            " (72 h)"
          : ""
      ) +

      (
        operation.paymentReference
          ? "<br>Réf. paiement : " +
            sportFinanceEscape(
              operation.paymentReference
            )
          : ""
      ) +

      (
        operation.operationRef
          ? "<br>Réf. dossier : " +
            sportFinanceEscape(
              operation.operationRef
            )
          : ""
      );
  }


  async function sportFinanceShowAvailability(){

    const target =
      sportFinanceField(
        "bcfSportAvailabilityStatus"
      );

    const start =
      sportFinanceValue(
        "bcfSportPublicationStart"
      );

    if(
      !start
    ){
      if(
        target
      ){
        target.textContent =
          "Choisissez d’abord une date et une heure.";
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
        result.available === true
      ){

        target.textContent =
          "Créneau disponible : démarrage " +
          sportFinanceDateTimeFr(
            result.publicationStart
          ) +
          ", fin " +
          sportFinanceDateTimeFr(
            result.publicationEnd
          ) +
          ".";

        return;
      }

      const next =
        await sportFinanceFindNextAvailability(
          start
        );

      if(
        next &&
        next.available === true
      ){

        target.innerHTML =
          "Ce départ n’est pas disponible. Prochain créneau : <strong>" +
          sportFinanceEscape(
            sportFinanceDateTimeFr(
              next.publicationStart
            )
          ) +
          "</strong>.";

      }else{

        target.textContent =
          "Aucun créneau proche n’a été trouvé. Choisissez une autre période.";
      }

    }catch(error){

      if(
        target
      ){
        target.textContent =
          error.message ||
          "La disponibilité n’a pas pu être vérifiée.";
      }
    }
  }


  async function sportFinanceStartAsSoonAsPossible(){

    const target =
      sportFinanceField(
        "bcfSportAvailabilityStatus"
      );

    if(
      target
    ){
      target.textContent =
        "Recherche du premier créneau disponible…";
    }

    try{

      const next =
        await sportFinanceFindNextAvailability(
          new Date()
        );

      if(
        !next ||
        next.available !== true
      ){

        if(
          target
        ){
          target.textContent =
            "Aucun créneau proche n’a été trouvé.";
        }

        return;
      }

      const field =
        sportFinanceField(
          "bcfSportPublicationStart"
        );

      if(
        field
      ){
        field.value =
          sportFinanceDateTimeLocalValue(
            new Date(
              next.publicationStart
            )
          );
      }

      sportFinanceUpdateDatePreview();

      if(
        target
      ){
        target.textContent =
          new Date(
            next.publicationStart
          )
            .getTime() <=
          Date.now() +
          15 * 60 * 1000

            ? "Une place est disponible immédiatement."

            : "Premier créneau disponible : " +
              sportFinanceDateTimeFr(
                next.publicationStart
              ) +
              ".";
      }

    }catch(error){

      if(
        target
      ){
        target.textContent =
          error.message ||
          "Recherche impossible.";
      }
    }
  }


  function sportFinanceValidate(
    profile,
    club,
    identityCheck,
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
        "La fiche d’identité du club doit disposer d’une référence."
      );
    }

    if(
      !sportFinanceIdentityAccepted(
        identityCheck
      )
    ){
      errors.push(
        (
          identityCheck &&
          Array.isArray(
            identityCheck.errors
          ) &&
          identityCheck.errors[0]
        ) ||
        "La fiche du commerçant doit être vérifiée avant le paiement."
      );
    }

    if(
      !profile.name
    ){
      errors.push(
        "Le nom ou l’enseigne du commerçant est obligatoire."
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
      extraResearchAmount > 0 &&
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
        choice === "HALF_HALF" ||
        extraResearchAmount > 0
      ) &&
      !association
    ){
      errors.push(
        "Choisissez une association de recherche médicale validée."
      );
    }

    if(
      association &&
      association.validated !== true
    ){
      errors.push(
        "L’association choisie doit être préalablement validée."
      );
    }

    if(
      youth.locked &&
      youth.associationId &&
      choice === "HALF_HALF" &&
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
      sportFinancePublicationRange(
        publicationStart
      );

    if(
      !range
    ){
      errors.push(
        "Choisissez la date et l’heure de démarrage."
      );

    }else if(
      new Date(
        range.startIso
      )
        .getTime() <
      Date.now() -
      60 * 1000
    ){
      errors.push(
        "L’heure de démarrage ne peut pas être antérieure à maintenant."
      );
    }

    if(
      !PUBLICITY_TEMPLATES
        .some(
          function(item){
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


  async function sportFinanceBuildDraftData(){

    const profile =
      sportFinanceSaveProfile(
        sportFinanceReadProfile()
      );

    const verified =
      await sportFinanceVerifyIdentity(
        profile
      );

    if(
      sportFinanceIdentityAccepted(
        verified
      ) &&
      verified.clientNumber
    ){

      profile.clientNumber =
        sportFinanceText(
          verified.clientNumber
        );

      sportFinanceSaveProfile(
        profile
      );

    }else if(
      !sportFinanceIsProduction()
    ){

      profile.clientNumber =
        sportFinanceEnsureMerchantClientNumber(
          profile
        );

      sportFinanceSaveProfile(
        profile
      );
    }

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
      sportFinancePublicationRange(
        publicationStart
      );

    const templateCode =
      sportFinanceTemplateCode();

    const errors =
      sportFinanceValidate(

        profile,

        club,

        verified,

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

    const allocation =
      sportFinanceGrossAllocation(

        amountHT,

        choice,

        extraResearchAmount
      );

    if(
      sportFinanceIsProduction() &&
      !merchantSnapshot.clientNumber
    ){
      errors.push(
        "Le numéro client permanent doit être attribué par le serveur avant le paiement."
      );
    }

    if(
      sportFinanceIsProduction() &&
      !clubSnapshot.clientNumber
    ){
      errors.push(
        "Le numéro client permanent du club doit être attribué par le serveur avant le paiement."
      );
    }

    return {

      errors:
        errors,

      profile:
        profile,

      identityCheck:
        verified,

      club:
        club,

      representative:
        representative,

      amountHT:
        amountHT,

      extraResearchAmount:
        extraResearchAmount,

      paymentBaseBeforeFinalTax:
        allocation.paymentBaseBeforeFinalTax,

      totalPaymentAmount:
        allocation.paymentBaseBeforeFinalTax,

      totalPaymentAmountProvisional:
        true,

      choice:
        choice,

      association:
        association,

      publicationStart:
        range
          ? range.startIso
          : "",

      publicationEnd:
        range
          ? range.endIso
          : "",

      templateCode:
        templateCode,

      publicityText:
        publicityText,

      clubSnapshot:
        clubSnapshot,

      merchantSnapshot:
        merchantSnapshot,

      associationSnapshot:
        associationSnapshot,

      grossAllocation:
        allocation
    };
  }


  async function sportFinanceOpenReview(){

    const core =
      sportFinanceCore();

    const ui =
      sportFinanceUI();

    if(
      !core ||
      !ui ||
      ui.ready !== true
    ){

      sportFinanceSetStatus(
        "Le service Finance est momentanément indisponible.",
        "error"
      );

      return;
    }

    sportFinanceSetStatus(
      "Contrôle de la fiche et du créneau…",
      "success"
    );

    try{

      const data =
        await sportFinanceBuildDraftData();

      sportFinanceRenderIdentityStatus(
        data.identityCheck
      );

      if(
        data.errors.length
      ){
        sportFinanceSetStatus(
          data.errors[0],
          "error"
        );
        return;
      }

      let availability =
        await sportFinanceCheckAvailability(
          data.publicationStart
        );

      if(
        availability.available !== true
      ){

        const next =
          await sportFinanceFindNextAvailability(
            data.publicationStart
          );

        if(
          next &&
          next.available === true
        ){

          const field =
            sportFinanceField(
              "bcfSportPublicationStart"
            );

          if(
            field
          ){
            field.value =
              sportFinanceDateTimeLocalValue(
                new Date(
                  next.publicationStart
                )
              );
          }

          sportFinanceUpdateDatePreview();

          sportFinanceSetStatus(
            "Le créneau choisi n’est plus disponible. Le prochain créneau disponible a été proposé.",
            "error"
          );

          return;
        }

        sportFinanceSetStatus(
          "Aucun créneau de 72 heures n’est disponible dans cette période.",
          "error"
        );

        return;
      }

      const hold =
        await sportFinanceReserveSlot(

          data.publicationStart,

          {

            merchantRef:
              data.merchantSnapshot.clientNumber ||
              data.merchantSnapshot.sirenSiret,

            clubRef:
              data.clubSnapshot.clubRef
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

      const accountingDossier =
        sportFinanceBuildAccountingDossier(
          data,
          operationRef,
          ""
        );

      const previewLines = [

        data.publicityText,

        "Diffusion pendant 72 heures : du " +
        sportFinanceDateTimeFr(
          data.publicationStart
        ) +
        " au " +
        sportFinanceDateTimeFr(
          data.publicationEnd
        ) +
        ".",

        "Parrainage : " +
        sportFinanceFormatMoney(
          data.amountHT
        ) +
        " € HT",

        data.extraResearchAmount > 0
          ? "Soutien recherche supplémentaire : " +
            sportFinanceFormatMoney(
              data.extraResearchAmount
            ) +
            " €"
          : "",

        "N° client commerçant : " +
        data.merchantSnapshot.clientNumber

      ].filter(Boolean);

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
          data.merchantSnapshot.clientNumber ||
          data.merchantSnapshot.sirenSiret,

        payerClientNumber:
          data.merchantSnapshot.clientNumber,

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

        identityCheck:
          data.identityCheck,

        clubRef:
          data.clubSnapshot.clubRef,

        clubClientNumber:
          data.clubSnapshot.clientNumber,

        clubSnapshot:
          data.clubSnapshot,

        beneficiaryRefs:[

          data.clubSnapshot.clubRef,

          data.associationSnapshot
            ? data.associationSnapshot.id
            : ""

        ].filter(Boolean),

        amountHT:
          data.amountHT,

        extraResearchAmount:
          data.extraResearchAmount,

        paymentBaseBeforeFinalTax:
          data.paymentBaseBeforeFinalTax,

        totalPaymentAmount:
          data.totalPaymentAmount,

        totalPaymentAmountProvisional:
          true,

        allocationCode:
          data.choice,

        grossAllocation:
          data.grossAllocation,

        associationId:
          data.associationSnapshot
            ? data.associationSnapshot.id
            : "",

        associationSnapshot:
          data.associationSnapshot,

        publicationDurationHours:
          72,

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

        independentFromCabas:
          true,

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

        accountingDossier:
          accountingDossier,

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

        payerClientNumber:
          data.merchantSnapshot.clientNumber,

        clubClientNumber:
          data.clubSnapshot.clientNumber,

        amountHT:
          data.amountHT,

        extraResearchAmount:
          data.extraResearchAmount,

        paymentBaseBeforeFinalTax:
          data.paymentBaseBeforeFinalTax,

        totalPaymentAmount:
          data.totalPaymentAmount,

        totalPaymentAmountProvisional:
          true,

        allocationCode:
          data.choice,

        grossAllocation:
          data.grossAllocation,

        clubRef:
          data.clubSnapshot.clubRef,

        clubName:
          data.clubSnapshot.name ||
          data.clubSnapshot.officialName,

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

        publicationDurationHours:
          72,

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

        tariffVersion:
          financeFoundationCurrentTariff()
            .version,

        feeRateHT:
          sportFinanceCurrentFeeRateHT(),

        accountingDossier:
          accountingDossier
      });

      sportFinanceSetStatus(
        "Créneau réservé temporairement. Vérifiez le récapitulatif avant paiement.",
        "success"
      );

      sportFinanceRenderLatestOperation();

    }catch(error){

      sportFinanceSetStatus(
        error.message ||
        "Le dossier n’a pas pu être préparé.",
        "error"
      );
    }
  }


  function sportFinanceEditIdentity(context){

    activeCorrectionDraftId =
      sportFinanceText(
        context &&
        context.draftId
      );

    const notice =
      sportFinanceField(
        "bcfSportCorrectionNotice"
      );

    const button =
      sportFinanceField(
        "bcfSportReturnToReview"
      );

    const first =
      sportFinanceField(
        "bcfSportMerchantName"
      );

    if(
      notice
    ){
      notice.style.display =
        "block";
    }

    if(
      button
    ){
      button.style.display =
        "block";
    }

    if(
      first
    ){
      first.scrollIntoView({
        behavior:"smooth",
        block:"center"
      });

      window.setTimeout(
        function(){
          first.focus();
        },
        250
      );
    }
  }


  async function sportFinanceReturnToReview(){

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
      await sportFinanceBuildDraftData();

    sportFinanceRenderIdentityStatus(
      data.identityCheck
    );

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
        "La réservation temporaire a expiré. Reprenez le créneau.",
        "error"
      );
      return;
    }

    const previewLines = [

      data.publicityText,

      "Diffusion pendant 72 heures : du " +
      sportFinanceDateTimeFr(
        data.publicationStart
      ) +
      " au " +
      sportFinanceDateTimeFr(
        data.publicationEnd
      ) +
      ".",

      "Parrainage : " +
      sportFinanceFormatMoney(
        data.amountHT
      ) +
      " € HT"
    ];

    ui.resumeAfterIdentityEdit(

      draftId,

      {

        payerRef:
          data.merchantSnapshot.clientNumber ||
          data.merchantSnapshot.sirenSiret,

        payerClientNumber:
          data.merchantSnapshot.clientNumber,

        payerSnapshot:
          data.merchantSnapshot,

        merchantSnapshot:
          data.merchantSnapshot,

        identityVersion:
          data.profile.updatedAt,

        identityCheck:
          data.identityCheck,

        amountHT:
          data.amountHT,

        extraResearchAmount:
          data.extraResearchAmount,

        paymentBaseBeforeFinalTax:
          data.paymentBaseBeforeFinalTax,

        totalPaymentAmount:
          data.totalPaymentAmount,

        totalPaymentAmountProvisional:
          true,

        allocationCode:
          data.choice,

        grossAllocation:
          data.grossAllocation,

        clubRef:
          data.clubSnapshot.clubRef,

        clubClientNumber:
          data.clubSnapshot.clientNumber,

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

        ].filter(Boolean),

        publicationDurationHours:
          72,

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

        independentFromCabas:
          true,

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

    const notice =
      sportFinanceField(
        "bcfSportCorrectionNotice"
      );

    const button =
      sportFinanceField(
        "bcfSportReturnToReview"
      );

    if(
      notice
    ){
      notice.style.display =
        "none";
    }

    if(
      button
    ){
      button.style.display =
        "none";
    }

    activeCorrectionDraftId =
      "";
  }


  function sportFinanceCheckoutPayload(request){

    const core =
      sportFinanceCore();

    const base =
      request &&
      typeof request === "object"
        ? request
        : {};

    const draft =
      core &&
      typeof core.getDraft === "function"
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
      ) ||
      !sportFinanceText(
        draft.publicationStart
      ) ||
      !sportFinanceText(
        draft.publicationEnd
      )
    ){
      throw new Error(
        "La réservation de diffusion est incomplète."
      );
    }

    const tariff =
      financeFoundationCurrentTariff();

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

        payerClientNumber:
          sportFinanceText(
            draft.payerClientNumber
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

        clubClientNumber:
          sportFinanceText(
            draft.clubClientNumber
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

        paymentBaseBeforeFinalTax:
          Number(
            draft.paymentBaseBeforeFinalTax ||
            draft.totalPaymentAmount ||
            0
          ),

        totalPaymentAmount:
          Number(
            draft.totalPaymentAmount ||
            0
          ),

        totalPaymentAmountProvisional:
          true,

        grossAllocation:
          sportFinanceClone(
            draft.grossAllocation
          ) ||
          null,

        allocationCode:
          sportFinanceText(
            draft.allocationCode
          ),

        publicationDurationHours:
          72,

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

        independentFromCabas:
          true,

        paymentChannel:
          sportFinanceText(
            draft.paymentChannel ||
            "card_psp"
          ),

        paymentPresentation:
          sportFinanceClone(
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
          sportFinanceClone(
            draft.financePolicies
          ) ||
          sportFinancePolicies(),

        accountingDossier:
          sportFinanceClone(
            draft.accountingDossier
          ) ||
          null,

        serverMustRevalidate:
          true,

        clientAccountingIsFinal:
          false,

        finalTaxCalculationServerSide:
          true,

        finalPaymentQuoteServerSide:
          true,

        bociteArtFeeRateHT:
          sportFinanceCurrentFeeRateHT(),

        bociteArtTariffVersion:
          sportFinanceText(
            tariff.version
          ),

        pspFee:
          "actual_server_value",

        accountingTransmission:
          "after_agent2_approval"
      }
    );
  }


  async function sportFinanceStartCheckout(request){

    if(
      !sportFinanceCore()
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
      ) > 0 &&
      Number(
        payload.slotHoldExpiresAt
      ) <=
      Date.now()
    ){
      await sportFinanceReleaseHold(
        "hold_expired_before_checkout"
      );

      throw new Error(
        "La réservation temporaire a expiré. Reprenez le créneau avant le paiement."
      );
    }

    try{

      let responseData;

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
          window.BociteFinanceTest.ready !== true
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
        responseData.ok !== true ||
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

        extraResearchAmount:
          Number(
            payload.extraResearchAmount ||
            0
          ),

        paymentBaseBeforeFinalTax:
          Number(
            payload.paymentBaseBeforeFinalTax ||
            0
          ),

        finalPaymentAmount:
          Number(
            responseData.finalPaymentAmount ||
            0
          ) ||
          null,

        totalPaymentAmount:
          Number(
            responseData.finalPaymentAmount ||
            payload.totalPaymentAmount ||
            0
          ),

        totalPaymentAmountProvisional:
          !Number(
            responseData.finalPaymentAmount ||
            0
          ),

        allocationCode:
          sportFinanceText(
            payload.allocationCode
          ),

        grossAllocation:
          sportFinanceClone(
            payload.grossAllocation
          ),

        clubRef:
          sportFinanceText(
            payload.clubRef
          ),

        associationId:
          sportFinanceText(
            payload.associationId
          ),

        publicationDurationHours:
          72,

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
          ),

        tariffVersion:
          sportFinanceText(
            payload.bociteArtTariffVersion
          ),

        feeRateHT:
          Number(
            payload.bociteArtFeeRateHT ||
            0
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
     ÇA FINIT ICI — BLOC 5
     ========================================================= */

   /* =========================================================
     BLOC 6
     SPORT — INTERFACE FINANCE COMPLÈTE
     ========================================================= */

  function sportFinanceAssociationOptions(selectedId){

    const associations =
      sportFinanceAssociations();

    if(
      !associations.length
    ){
      return (
        '<option value="">' +
        "En attente du choix défini par la mairie et Bo'CitéArt" +
        "</option>"
      );
    }

    return (
      '<option value="">Choisir l’association</option>' +

      associations
        .map(
          function(item){

            return (
              '<option value="' +
              sportFinanceEscape(
                item.id
              ) +
              '" ' +

              (
                String(
                  item.id
                ) ===
                String(
                  selectedId ||
                  ""
                )
                  ? "selected"
                  : ""
              ) +

              ">" +

              sportFinanceEscape(
                item.name
              ) +

              "</option>"
            );
          }
        )
        .join("")
    );
  }


  function sportFinanceClubBrandingHtml(){

    const session =
      sportFinanceSession();

    if(
      session.role !== "president"
    ){
      return "";
    }

    const branding =
      sportFinanceBrandingStore();

    return `

      <div class="sportCard">

        <div class="sportSubTitle">

          Présentation des documents du club

        </div>

        <div
          class="sportText"
          style="margin-top:8px;"
        >

          Le logo est facultatif.

          S’il n’est pas ajouté,
          Bo'CitéArt prépare une présentation standard
          à partir des coordonnées vérifiées du club.

          Les documents définitifs
          restent produits côté serveur.

        </div>

        <label class="sportLabel">

          Logo du club

        </label>

        <input
          id="bcfSportClubLogo"
          class="sportField"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
        >

        <button
          id="bcfSportClubLogoSave"
          class="sportBtn"
          type="button"
          style="
            width:100%;
            margin-top:10px;
          "
        >

          Enregistrer / remplacer le logo

        </button>

        <div
          id="bcfSportClubLogoStatus"
          class="sportStatus"
        >

          ${
            branding &&
            branding.logoName

              ? "Logo enregistré : " +
                sportFinanceEscape(
                  branding.logoName
                )

              : "Aucun logo enregistré."
          }

        </div>

      </div>

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

    const profile =
      sportFinanceInitialProfile();

    const associations =
      sportFinanceAssociations();

    const representative =
      sportFinanceSession();

    const club =
      sportFinanceClubSnapshot(
        sportFinanceClub()
      );

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

    const defaultStart =
      sportFinanceDateTimeLocalValue(
        sportFinanceDefaultStart()
      );

    const tariff =
      financeFoundationCurrentTariff();

    const feePercent =
      sportFinanceRound(
        sportFinanceCurrentFeeRateHT() *
        100
      );

    const merchantClientNumber =
      sportFinanceText(
        profile.clientNumber
      );

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

          La publicité est
          <strong>indépendante du Cabas</strong>.

          Le commerçant peut choisir
          cette visibilité
          sans échange de bocitecoins.

          <br><br>

          Le parrainage commence à

          <strong>
            50 € HT
          </strong>.

          La publicité est diffusée
          pendant

          <strong>
            72 heures exactes
          </strong>

          à partir de son heure réelle
          de démarrage.

          <br><br>

          Au maximum

          <strong>
            6 publicités sont diffusées simultanément
          </strong>.

          Si une place est disponible immédiatement,
          le départ peut être proposé tout de suite ;

          sinon le prochain créneau disponible
          est proposé avec sa date et son heure.

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

        <div class="sportStatus">

          Club :

          <strong>

            ${sportFinanceEscape(
              club.name ||
              club.officialName ||
              "Club partenaire"
            )}

          </strong>

          ${
            club.clientNumber

              ? "<br>N° client club : <strong>" +
                sportFinanceEscape(
                  club.clientNumber
                ) +
                "</strong>"

              : ""
          }

        </div>

      </div>


      <div class="sportCard">

        <div class="sportSubTitle">

          Informations du commerçant

        </div>

        <div
          class="sportText"
          style="margin-top:8px;"
        >

          Les données essentielles
          doivent concorder
          avec les références officielles disponibles.

          En cas d’écart,
          la fiche reste bloquée
          et le commerçant corrige lui-même
          ses informations avant de poursuivre.

        </div>

        <div class="sportStatus">

          N° client Bo'CitéArt :

          <strong id="bcfSportMerchantClientNumber">

            ${sportFinanceEscape(
              merchantClientNumber ||
              "attribué après validation"
            )}

          </strong>

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
          id="bcfSportVerifyIdentity"
          class="sportBtn"
          type="button"
          style="
            width:100%;
            margin-top:12px;
          "
        >

          Vérifier ma fiche

        </button>

        <div
          id="bcfSportIdentityStatus"
          class="sportStatus"
        >

          La fiche doit être vérifiée
          avant le paiement.

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

          Montant et destination

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

                  Ce choix est repris automatiquement.

                </div>

              `

            : `

                <div class="sportStatus">

                  Sélectionnez la destination
                  du parrainage
                  pour ce dossier.

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

            Ce soutien reste distinct
            du parrainage.

            Sa qualification fiscale réelle
            est contrôlée
            avant émission du document.

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

          Diffusion — 72 heures exactes

        </div>

        <div
          class="sportText"
          style="margin-top:8px;"
        >

          Choisissez une date et une heure,
          ou demandez le premier créneau disponible.

          Les 72 heures sont calculées
          à partir de l’heure réelle de démarrage :

          la diffusion ne s’arrête pas à minuit.

        </div>

        <button
          id="bcfSportStartNow"
          class="sportBtn"
          type="button"
          style="
            width:100%;
            margin-top:10px;
          "
        >

          Démarrer dès que possible

        </button>

        <label class="sportLabel">

          Date et heure de démarrage

        </label>

        <input
          id="bcfSportPublicationStart"
          class="sportField"
          type="datetime-local"
          step="300"
          value="${sportFinanceEscape(
            defaultStart
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

          Vérifier ce créneau de 72 heures

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

          Ces quatre formulations
          restent privées pendant la préparation.

          Une seule phrase finale
          est publiée
          après confirmation du paiement.

        </div>

        <div id="bcfSportTemplateList"></div>

      </div>


      ${sportFinanceClubBrandingHtml()}


      <div class="sportCard">

        <div class="sportSubTitle">

          Finance et documents

        </div>

        <div class="sportStatus">

          Avant paiement,
          le commerçant connaît le parrainage,
          la destination,
          l’éventuel soutien recherche,
          la phrase finale
          et les 72 heures de diffusion.

          <br><br>

          Le montant affiché en € HT
          reste la base de parrainage.

          La TVA
          et le total définitif réellement à payer
          sont établis
          selon le statut réel des parties
          et confirmés côté serveur
          avant l’encaissement de production.

          <br><br>

          Les frais PSP
          restent distincts
          des frais Bo'CitéArt.

          Taux Bo'CitéArt actuellement enregistré :

          <strong>

            ${sportFinanceEscape(
              sportFinanceFormatMoney(
                feePercent
              )
            )} % HT

          </strong>

          — version

          <strong>

            ${sportFinanceEscape(
              tariff.version
            )}

          </strong>.

          L’évolution du tarif
          est contrôlée et versionnée
          par Agent 2 côté serveur,

          sans modification rétroactive
          des opérations déjà engagées.

          <br><br>

          Agent 1 prépare
          et rapproche le dossier complet ;

          Agent 2 le contrôle
          indépendamment

          avant transmission
          vers la plateforme comptable
          choisie avec le comptable.

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

          Vérifiez la fiche,
          le montant,
          la destination
          et le créneau.

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

    `;


    mount
      .querySelectorAll(
        'input[name="bcfSportAllocation"]'
      )
      .forEach(
        function(radio){

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
    ]
      .forEach(
        function(id){

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


    const verifyIdentity =
      sportFinanceField(
        "bcfSportVerifyIdentity"
      );

    if(
      verifyIdentity
    ){

      verifyIdentity.onclick =
        async function(){

          const profileToCheck =
            sportFinanceSaveProfile(
              sportFinanceReadProfile()
            );

          sportFinanceRenderIdentityStatus(
            null
          );

          sportFinanceSetStatus(
            "Vérification de la fiche…",
            "success"
          );

          try{

            const result =
              await sportFinanceVerifyIdentity(
                profileToCheck
              );

            sportFinanceRenderIdentityStatus(
              result
            );

            if(
              sportFinanceIdentityAccepted(
                result
              )
            ){

              const saved =
                sportFinanceReadSavedProfile();

              const number =
                sportFinanceText(
                  result.clientNumber
                ) ||
                sportFinanceEnsureMerchantClientNumber(
                  saved
                );

              if(
                number
              ){

                saved.clientNumber =
                  number;

                sportFinanceSaveProfile(
                  saved
                );

                const out =
                  sportFinanceField(
                    "bcfSportMerchantClientNumber"
                  );

                if(
                  out
                ){
                  out.textContent =
                    number;
                }
              }

              sportFinanceSetStatus(
                "Fiche contrôlée. Vous pouvez poursuivre.",
                "success"
              );

            }else{

              sportFinanceSetStatus(
                "Veuillez rectifier l’erreur indiquée avant de poursuivre.",
                "error"
              );
            }

          }catch(error){

            sportFinanceSetStatus(
              error.message ||
              "La fiche n’a pas pu être vérifiée.",
              "error"
            );
          }
        };
    }


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
              "publication_datetime_changed"
            );
          }

          sportFinanceUpdateDatePreview();
        };
    }


    const startNow =
      sportFinanceField(
        "bcfSportStartNow"
      );

    if(
      startNow
    ){
      startNow.onclick =
        sportFinanceStartAsSoonAsPossible;
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
              error.message ||
              "La réservation n’a pas pu être prolongée.",
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


    const logoSave =
      sportFinanceField(
        "bcfSportClubLogoSave"
      );

    if(
      logoSave
    ){

      logoSave.onclick =
        async function(){

          const field =
            sportFinanceField(
              "bcfSportClubLogo"
            );

          const status =
            sportFinanceField(
              "bcfSportClubLogoStatus"
            );

          const file =
            field &&
            field.files &&
            field.files[0];

          try{

            await sportFinanceUploadClubLogo(
              file
            );

            if(
              status
            ){
              status.textContent =
                "Logo enregistré pour les futurs documents.";
            }

          }catch(error){

            if(
              status
            ){
              status.textContent =
                error.message ||
                "Le logo n’a pas pu être enregistré.";
            }
          }
        };
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

    if(
      identityCheckCache
    ){
      sportFinanceRenderIdentityStatus(
        identityCheckCache
      );
    }
  }

  /* =========================================================
     ÇA FINIT ICI — BLOC 6
     ========================================================= */

   /* =========================================================
     BLOC 7
     GOUVERNANCE — MAIRIES — COMPTABLE — ÉTATS — EXPORT
     ========================================================= */

  function financeFoundationPublicEntityLateCase(invoice){

    const source =
      invoice &&
      typeof invoice === "object"
        ? invoice
        : {};

    const due =
      new Date(
        source.dueAt ||
        source.dueDate ||
        ""
      );

    const now =
      new Date(
        source.asOf ||
        Date.now()
      );

    const validDue =
      !Number.isNaN(
        due.getTime()
      );

    const overdue =
      validDue &&
      now.getTime() >
        due.getTime() &&
      source.paid !== true;

    const daysLate =
      overdue
        ? Math.max(
            1,
            Math.floor(
              (
                now.getTime() -
                due.getTime()
              ) /
              (
                24 *
                60 *
                60 *
                1000
              )
            )
          )
        : 0;

    return {

      invoiceRef:
        sportFinanceText(
          source.invoiceRef
        ),

      clientNumber:
        sportFinanceText(
          source.clientNumber
        ),

      publicEntity:
        sportFinanceText(
          source.publicEntity
        ),

      dueAt:
        validDue
          ? due.toISOString()
          : "",

      overdue:
        overdue,

      daysLate:
        daysLate,

      principal:
        Number(
          source.principal ||
          source.amount ||
          0
        ),

      fixedRecoveryCompensation:
        overdue
          ? PUBLIC_ENTITY_LATE_FIXED_COMPENSATION
          : 0,

      fixedRecoveryCompensationTreatment:
        "separate_late_payment_claim_not_silent_invoice_rewrite",

      lateInterest:
        overdue
          ? "server_calculate_according_to_current_rule"
          : 0,

      automaticReminders:
        true,

      blockNewPaidServices:
        overdue,

      existingContractAction:
        "respect_contract_and_public_procurement_rules",

      chorusOrPublicPlatform:
        "future_server_connector",

      adminDailyAlert:
        overdue,

      generatedAt:
        sportFinanceNow()
    };
  }


  function financeFoundationRegisterAdminAlert(input){

    const source =
      input &&
      typeof input === "object"
        ? input
        : {};

    return financeFoundationSaveAudit({

      level:
        [
          "red",
          "orange",
          "green"
        ]
          .includes(
            source.level
          )
          ? source.level
          : "orange",

      code:
        sportFinanceText(
          source.code ||
          "finance_attention"
        ),

      clientNumber:
        sportFinanceText(
          source.clientNumber
        ),

      operationRef:
        sportFinanceText(
          source.operationRef
        ),

      invoiceRef:
        sportFinanceText(
          source.invoiceRef
        ),

      message:
        sportFinanceText(
          source.message
        ),

      actionRequired:
        sportFinanceText(
          source.actionRequired
        ),

      responsible:
        sportFinanceText(
          source.responsible ||
          "system"
        ),

      resolved:
        source.resolved === true
    });
  }


  async function financeFoundationTransmitAccountingDossier(dossier){

    const source =
      dossier &&
      typeof dossier === "object"
        ? dossier
        : {};

    if(
      !source.agent2 ||
      source.agent2.status !==
        "approved"
    ){
      return {
        ok:false,
        reason:"agent2_approval_required"
      };
    }

    const destination =
      financeFoundationAccountingDestination();

    if(
      sportFinanceIsProduction()
    ){

      return sportFinanceServerPost(

        "/finance/accounting/transmit",

        {

          dossier:
            source,

          destination:
            destination,

          deliveryMode:
            "accounting_platform",

          requireBatchTrace:
            true,

          requireTransmissionTimestamp:
            true
        }
      );
    }

    return {

      ok:true,

      mode:
        "preproduction",

      status:
        "ready_for_accounting_platform_connection",

      dossierRef:
        sportFinanceText(
          source.dossierRef
        ),

      destination:
        destination
    };
  }


  function financeFoundationApplyGovernanceSnapshot(snapshot){

    const source =
      snapshot &&
      typeof snapshot === "object"
        ? snapshot
        : {};

    if(
      source.approved !== true
    ){
      return {
        ok:false,
        reason:
          "unapproved_governance_snapshot"
      };
    }

    if(
      sportFinanceIsProduction() &&
      (
        source.serverValidated !== true ||
        !sportFinanceText(
          source.serverReference
        )
      )
    ){
      return {
        ok:false,
        reason:
          "server_validated_governance_required"
      };
    }

    const current =
      financeFoundationCurrentTariff();

    const nextRate =
      Number(
        source.bociteArtRateHT == null
          ? current.bociteArtRateHT
          : source.bociteArtRateHT
      );

    if(
      !Number.isFinite(
        nextRate
      ) ||
      nextRate <= 0
    ){
      return {
        ok:false,
        reason:
          "invalid_bociteart_rate"
      };
    }

    const next = {

      version:
        sportFinanceText(
          source.version
        ) ||
        current.version,

      effectiveFrom:
        sportFinanceText(
          source.effectiveFrom
        ) ||
        sportFinanceNow(),

      bociteArtRateHT:
        nextRate,

      pspIndexReference:
        Number(
          source.pspIndexReference == null
            ? current.pspIndexReference
            : source.pspIndexReference
        ),

      source:
        sportFinanceText(
          source.source
        ) ||
        "agent2_server_governance",

      serverReference:
        sportFinanceText(
          source.serverReference
        ),

      serverAuthorityRequiredInProduction:
        true,

      previousVersion:
        current.version,

      noRetroactiveChange:
        true,

      createdAt:
        sportFinanceNow()
    };

    sportFinanceWriteJson(
      window.localStorage,
      LOCAL_TARIFF_KEY,
      next
    );

    financeFoundationSaveAudit({

      level:
        "green",

      code:
        "tariff_version_updated",

      message:
        "Nouvelle version tarifaire validée par la gouvernance Agent 2.",

      tariffVersion:
        next.version,

      resolved:
        true
    });

    return {
      ok:true,
      tariff:sportFinanceClone(
        next
      )
    };
  }


  async function financeFoundationRefreshGovernance(){

    if(
      !sportFinanceIsProduction()
    ){

      return {

        ok:true,

        mode:
          "preproduction",

        tariff:
          financeFoundationCurrentTariff(),

        legalMonitoring:
          "server_connection_required"
      };
    }

    const result =
      await sportFinanceServerPost(

        "/finance/governance/current",

        {

          currentTariffVersion:
            financeFoundationCurrentTariff()
              .version,

          requestedAt:
            sportFinanceNow(),

          requireAgent2:
            true,

          includePspTariffState:
            true,

          includeLegalAndInvoiceRules:
            true
        }
      );

    if(
      result &&
      result.tariffSnapshot
    ){
      financeFoundationApplyGovernanceSnapshot(
        result.tariffSnapshot
      );
    }

    return result;
  }


  window
    .BociteFinanceFoundation
    .publicEntityLateCase =
      financeFoundationPublicEntityLateCase;


  window
    .BociteFinanceFoundation
    .registerAdminAlert =
      financeFoundationRegisterAdminAlert;


  window
    .BociteFinanceFoundation
    .transmitAccountingDossier =
      financeFoundationTransmitAccountingDossier;


  window
    .BociteFinanceFoundation
    .applyGovernanceSnapshot =
      financeFoundationApplyGovernanceSnapshot;


  window
    .BociteFinanceFoundation
    .refreshGovernance =
      financeFoundationRefreshGovernance;


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

      paymentBaseBeforeFinalTax:
        Number(
          draft.paymentBaseBeforeFinalTax ||
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

      grossAllocation:
        sportFinanceClone(
          draft.grossAllocation
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

      publicationDurationHours:
        72,

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
      status === "paid"
    ){

      sportFinanceCommitLocalHold(
        draft
      );

      sportFinanceSetStatus(

        "Paiement confirmé. Diffusion programmée du " +
        sportFinanceDateTimeFr(
          draft.publicationStart
        ) +
        " au " +
        sportFinanceDateTimeFr(
          draft.publicationEnd
        ) +
        ". Le dossier passe par Agent 1 puis Agent 2 avant transmission comptable.",

        "success"
      );

      currentHold =
        null;

      await sportFinanceQueueAuditAfterPaid(
        draft
      );
    }


    if(
      status === "refused" ||
      status === "cancelled"
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
        status === "refused"
          ? "payment_refused"
          : "payment_cancelled"
      );

      sportFinanceSetStatus(

        status === "refused"

          ? "Paiement refusé. Aucune diffusion n’est activée et le créneau est libéré."

          : "Paiement annulé. Aucune diffusion n’est activée et le créneau est libéré.",

        "error"
      );
    }


    if(
      status === "refunded"
    ){

      financeFoundationRegisterAdminAlert({

        level:
          "orange",

        code:
          "refund_to_reconcile",

        operationRef:
          sportFinanceText(
            draft.operationRef
          ),

        message:
          "Remboursement à rapprocher par Agent 1 et à contrôler par Agent 2.",

        actionRequired:
          "Vérifier la pièce de remboursement et le reversement éventuel."
      });

      sportFinanceSetStatus(
        "Paiement remboursé. Le dossier reste tracé et passe au rapprochement comptable.",
        "success"
      );
    }


    if(
      status === "disputed"
    ){

      financeFoundationRegisterAdminAlert({

        level:
          "red",

        code:
          "payment_disputed",

        operationRef:
          sportFinanceText(
            draft.operationRef
          ),

        message:
          "Paiement contesté : contrôle Agent 1 / Agent 2 requis.",

        actionRequired:
          "Suspendre les suites financières jusqu’au contrôle."
      });

      sportFinanceSetStatus(
        "Paiement contesté. Le dossier est placé sous contrôle avant toute suite.",
        "error"
      );
    }


    if(
      status === "payment_pending"
    ){

      sportFinanceSetStatus(
        "Paiement en cours. La publicité ne sera diffusée qu’après confirmation effective du PSP côté serveur.",
        "success"
      );
    }

    sportFinanceRenderHoldStatus();

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
      core.ready !== true ||
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
    ]
      .forEach(
        function(eventName){

          core.on(
            eventName,
            function(draft){

              const normalizedStatus =

                eventName === "payment-pending" ||
                eventName === "payment-payment_pending"

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
      function(detail){

        const draftId =
          sportFinanceText(
            detail &&
            detail.draftId
          );

        const operation =
          sportFinanceReadOperations()
            .find(
              function(item){

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
              0,

            mode:
              sportFinanceIsProduction()
                ? "server"
                : "local"
          };

          sportFinanceReleaseHold(
            "draft_abandoned"
          );
        }
      }
    );


    window.addEventListener(
      "bociteart:sport-publication-failed",
      function(event){

        sportFinanceMarkPublicationFailure(
          event &&
          event.detail
        );
      }
    );
  }


  function sportFinanceMarkPublicationFailure(detail){

    const source =
      detail &&
      typeof detail === "object"
        ? detail
        : {};

    const operation =
      sportFinanceUpsertOperation({

        operationRef:
          sportFinanceText(
            source.operationRef
          ),

        paymentReference:
          sportFinanceText(
            source.paymentReference
          ),

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
          ),

        accountingStatus:
          "publication_incident_to_reconcile"
      });

    financeFoundationRegisterAdminAlert({

      level:
        "red",

      code:
        "publication_failure_after_payment",

      operationRef:
        sportFinanceText(
          source.operationRef
        ),

      message:
        "Campagne payée non consommée : reprogrammation nécessaire.",

      actionRequired:
        "Reprogrammer 72 heures complètes sans consommer la campagne initiale."
    });

    sportFinanceSetStatus(
      "Le paiement reste enregistré, mais la diffusion n’a pas pu être réalisée. La campagne n’est pas consommée et doit être reprogrammée.",
      "error"
    );

    sportFinanceRenderLatestOperation();

    return operation;
  }


  function sportFinancePrefillMerchant(context){

    const source =
      context &&
      typeof context === "object"
        ? context
        : {};

    const merchant =
      source.merchant &&
      typeof source.merchant === "object"
        ? source.merchant
        : source;

    const saved =
      sportFinanceReadSavedProfile();

    const next =
      Object.assign(
        {},
        saved,
        merchant,
        {
          updatedAt:
            sportFinanceNow()
        }
      );

    next.clientNumber =
      sportFinanceText(
        saved.clientNumber ||
        merchant.clientNumber
      );

    sportFinanceSaveProfile(
      next
    );

    identityCheckCache =
      null;

    return next;
  }


  function sportFinanceOpenForMerchant(context){

    if(
      context &&
      typeof context === "object"
    ){
      sportFinancePrefillMerchant(
        context
      );
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
            behavior:"smooth",
            block:"start"
          });
        }
      },
      60
    );

    return {
      ok:true,
      independentFromCabas:true
    };
  }


  function sportFinanceAfterCabasExchange(context){

    /*
      Compatibilité avec l’appel historique du module Sport.

      La publicité ne dépend pas du Cabas.

      Si le Cabas fournit déjà le profil du commerçant,
      il sert uniquement au préremplissage.
    */

    const source =
      context &&
      typeof context === "object"
        ? context
        : {};

    const merchant =
      source.merchant &&
      typeof source.merchant === "object"
        ? source.merchant
        : null;

    if(
      merchant
    ){
      sportFinancePrefillMerchant({
        merchant:merchant
      });
    }

    sportFinanceRender();

    return {
      ok:true,
      independentFromCabas:true,
      cabasRequired:false
    };
  }


  function sportFinanceInstall(){

    const core =
      sportFinanceCore();

    if(
      core &&
      core.ready === true &&
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
        once:true
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


  window.BociteFinanceSport = {

    version:
      VERSION,

    ready:
      true,

    install:
      sportFinanceInstall,

    open:
      sportFinanceOpenForMerchant,

    openForMerchant:
      sportFinanceOpenForMerchant,

    prefillMerchant:
      sportFinancePrefillMerchant,

    afterCabasExchange:
      sportFinanceAfterCabasExchange,

    openReview:
      sportFinanceOpenReview,

    verifyIdentity:
      sportFinanceVerifyIdentity,

    checkAvailability:
      sportFinanceCheckAvailability,

    findNextAvailability:
      sportFinanceFindNextAvailability,

    extendCurrentHold:
      sportFinanceExtendHold,

    releaseCurrentHold:
      sportFinanceReleaseHold,

    markPublicationFailure:
      sportFinanceMarkPublicationFailure,

    uploadClubLogo:
      sportFinanceUploadClubLogo,

    getOperations:
      function(){

        return (
          sportFinanceClone(
            sportFinanceReadOperations()
          ) ||
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

    getDailyAdminSummary:
      financeFoundationGetDailyAdminSummary,

    getCurrentTariff:
      function(){

        return sportFinanceClone(
          financeFoundationCurrentTariff()
        );
      },

    refreshGovernance:
      financeFoundationRefreshGovernance,

    getAccountingDestination:
      function(){

        return sportFinanceClone(
          financeFoundationAccountingDestination()
        );
      },

    configureAccountingDestination:
      financeFoundationConfigureAccountingDestination,

    getAccountingFoundation:
      function(){

        return {

          policies:
            financeFoundationAccountingPolicies(),

          agent1:
            financeFoundationAgent1Blueprint(),

          agent2:
            financeFoundationAgent2Blueprint(),

          invoiceBlueprint:
            financeFoundationInvoiceBlueprint(
              "generic_invoice"
            )
        };
      }
  };


  console.info(
    "✅ Bo'CitéArt Finance — Sport prêt — publicité indépendante / 72 h / capacité 6 / Agent 1 + Agent 2"
  );

})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART — FINANCE — RACCORD SPORT
   ========================================================= */

