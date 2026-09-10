/* =========================================================
   ÇA COMMENCE ICI — BO'CITÉART — FINANCE — TEST À BLANC

   Fichier public : entreprise/finance/bociteart-finance-test.js

   Simule les réponses du futur PSP sans argent réel.
   Ce moteur est automatiquement interdit en production.
   ========================================================= */

(function(){
  "use strict";

  if(
    window.BociteFinanceTest &&
    window.BociteFinanceTest.ready === true
  ){
    return;
  }

  const VERSION = "2026-09-10-01";

  const HISTORY_KEY =
    "bociteart_finance_test_history_v1";

  const SCENARIO_KEY =
    "bociteart_finance_test_scenario_v1";

  const DELAY_KEY =
    "bociteart_finance_test_delay_v1";


  const ALLOWED_SCENARIOS = [
    "paid",
    "refused",
    "cancelled",
    "pending"
  ];


  function testCore(){

    if(
      !window.BociteFinance ||
      window.BociteFinance.ready !== true
    ){
      throw new Error(
        "Le cœur Finance n'est pas chargé."
      );
    }

    return window.BociteFinance;
  }


  function testText(value){

    return String(
      value == null
        ? ""
        : value
    ).trim();
  }


  function testClone(value){

    return value == null
      ? value
      : JSON.parse(
          JSON.stringify(value)
        );
  }


  function testNow(){

    return new Date()
      .toISOString();
  }


  function testReference(){

    if(
      window.crypto &&
      typeof window.crypto.randomUUID ===
        "function"
    ){
      return (
        "TEST-" +
        window.crypto.randomUUID()
      );
    }

    return (
      "TEST-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,10)
    );
  }


  function testReadHistory(){

    try{

      const parsed =
        JSON.parse(
          window.sessionStorage.getItem(
            HISTORY_KEY
          ) ||
          "[]"
        );

      return Array.isArray(parsed)
        ? parsed
        : [];

    }catch(error){

      return [];
    }
  }


  function testWriteHistory(history){

    try{

      window.sessionStorage.setItem(

        HISTORY_KEY,

        JSON.stringify(
          Array.isArray(history)
            ? history
            : []
        )
      );

      return true;

    }catch(error){

      return false;
    }
  }


  function testScenario(){

    const saved =
      testText(
        window.sessionStorage.getItem(
          SCENARIO_KEY
        )
      );

    return ALLOWED_SCENARIOS.includes(
      saved
    )
      ? saved
      : "paid";
  }


  function testSetScenario(
    nextScenario
  ){

    const scenario =
      testText(
        nextScenario
      );

    if(
      !ALLOWED_SCENARIOS.includes(
        scenario
      )
    ){
      throw new Error(
        "Scénario de test inconnu."
      );
    }

    window.sessionStorage.setItem(
      SCENARIO_KEY,
      scenario
    );

    return scenario;
  }


  function testDelay(){

    const saved =
      Number(
        window.sessionStorage.getItem(
          DELAY_KEY
        )
      );

    return (
      Number.isFinite(saved) &&
      saved >= 0
    )
      ? saved
      : 900;
  }


  function testSetDelay(
    milliseconds
  ){

    const delay =
      Number(
        milliseconds
      );

    if(
      !Number.isFinite(delay) ||
      delay < 0 ||
      delay > 30000
    ){
      throw new Error(
        "Délai de test invalide."
      );
    }

    window.sessionStorage.setItem(
      DELAY_KEY,
      String(
        Math.round(delay)
      )
    );

    return Math.round(
      delay
    );
  }


  function testProductionForbidden(){

    const mode =
      testText(
        testCore()
          .getConfig()
          .mode
      )
        .toLowerCase();

    if(
      mode ===
        "production"
    ){
      throw new Error(
        "Le test à blanc est interdit en production."
      );
    }
  }


  function testValidateRequest(
    request
  ){

    const value =
      request &&
      typeof request === "object"

        ? request

        : {};


    if(
      !testText(
        value.draftId
      )
    ){
      throw new Error(
        "Brouillon de paiement manquant."
      );
    }


    if(
      !testText(
        value.idempotencyKey
      )
    ){
      throw new Error(
        "Clé de sécurité du paiement manquante."
      );
    }


    if(
      !testText(
        value.payerRef
      )
    ){
      throw new Error(
        "Payeur non identifié."
      );
    }


    if(
      !Number.isFinite(
        Number(
          value.amountHT
        )
      ) ||
      Number(
        value.amountHT
      ) <= 0
    ){
      throw new Error(
        "Montant de test invalide."
      );
    }


    return value;
  }


  function testFindByPaymentReference(
    paymentReference
  ){

    const reference =
      testText(
        paymentReference
      );

    return (
      testReadHistory()
        .find(
          function(item){

            return (
              item.paymentReference ===
              reference
            );
          }
        ) ||
      null
    );
  }


  function testUpdateHistory(
    paymentReference,
    changes
  ){

    const history =
      testReadHistory();


    const index =
      history.findIndex(
        function(item){

          return (
            item.paymentReference ===
            paymentReference
          );
        }
      );


    if(
      index < 0
    ){
      return null;
    }


    history[index] =
      Object.assign(

        {},

        history[index],

        changes ||
        {},

        {
          updatedAt:
            testNow()
        }
      );


    testWriteHistory(
      history
    );


    return testClone(
      history[index]
    );
  }


  function testApplyResult(
    record,
    scenario
  ){

    if(
      scenario ===
        "pending"
    ){
      return testClone(
        record
      );
    }


    const current =
      testFindByPaymentReference(
        record.paymentReference
      );


    /*
      Un résultat déjà appliqué
      n'est jamais rejoué.
    */

    if(
      current &&
      current.completedAt
    ){
      return testClone(
        current
      );
    }


    const serverStatus = {

      status:
        scenario,

      paymentReference:
        record.paymentReference,

      serverReference:
        record.paymentReference,

      paidAt:
        scenario === "paid"
          ? testNow()
          : ""
    };


    testCore()
      .applyServerStatus(

        record.draftId,

        serverStatus
      );


    return testUpdateHistory(

      record.paymentReference,

      {
        status:
          scenario,

        completedAt:
          testNow()
      }
    );
  }


  async function testStartCheckout(
    request
  ){

    testProductionForbidden();


    const value =
      testValidateRequest(
        request
      );


    const history =
      testReadHistory();


    /*
      Une même clé d'idempotence
      ne crée jamais un second paiement.
    */

    const duplicate =
      history.find(
        function(item){

          return (
            item.idempotencyKey ===
            value.idempotencyKey
          );
        }
      );


    if(
      duplicate
    ){

      return {

        ok:
          true,

        paymentReference:
          duplicate.paymentReference,

        checkoutUrl:
          "",

        testMode:
          true,

        duplicateProtected:
          true
      };
    }


    const record = {

      paymentReference:
        testReference(),

      idempotencyKey:
        testText(
          value.idempotencyKey
        ),

      draftId:
        testText(
          value.draftId
        ),

      flowType:
        testText(
          value.flowType
        ),

      payerRef:
        testText(
          value.payerRef
        ),

      representativeRef:
        testText(
          value.representativeRef
        ),

      beneficiaryRefs:
        testClone(
          value.beneficiaryRefs ||
          []
        ),

      amountHT:
        Number(
          value.amountHT
        ),

      allocationCode:
        testText(
          value.allocationCode
        ),

      status:
        "payment_pending",

      scenario:
        testScenario(),

      createdAt:
        testNow(),

      updatedAt:
        testNow(),

      completedAt:
        ""
    };


    history.push(
      record
    );


    testWriteHistory(
      history
    );


    window.setTimeout(

      function(){

        try{

          testApplyResult(
            record,
            record.scenario
          );

        }catch(error){

          console.error(
            "Bo'CitéArt Finance — échec du test à blanc",
            error
          );
        }
      },

      testDelay()
    );


    return {

      ok:
        true,

      paymentReference:
        record.paymentReference,

      checkoutUrl:
        "",

      testMode:
        true,

      duplicateProtected:
        false
    };
  }


  function testCompletePending(
    paymentReference,
    finalStatus
  ){

    testProductionForbidden();


    const reference =
      testText(
        paymentReference
      );


    const status =
      testText(
        finalStatus
      );


    if(
      ![
        "paid",
        "refused",
        "cancelled"
      ]
        .includes(
          status
        )
    ){
      throw new Error(
        "État final de test invalide."
      );
    }


    const record =
      testFindByPaymentReference(
        reference
      );


    if(
      !record
    ){
      throw new Error(
        "Paiement de test introuvable."
      );
    }


    return testApplyResult(
      record,
      status
    );
  }


  function testDisputePaid(
    paymentReference
  ){

    testProductionForbidden();


    const record =
      testFindByPaymentReference(
        paymentReference
      );


    if(
      !record
    ){
      throw new Error(
        "Paiement de test introuvable."
      );
    }


    const currentDraft =
      testCore()
        .getDraft(
          record.draftId
        );


    if(
      !currentDraft ||
      currentDraft.status !==
        "paid"
    ){
      throw new Error(
        "Seul un paiement confirmé peut être contesté dans ce test."
      );
    }


    testCore()
      .applyServerStatus(

        record.draftId,

        {
          status:
            "disputed",

          paymentReference:
            record.paymentReference,

          serverReference:
            record.paymentReference
        }
      );


    return testUpdateHistory(

      record.paymentReference,

      {
        status:
          "disputed",

        disputedAt:
          testNow()
      }
    );
  }


  function testRefund(
    paymentReference
  ){

    testProductionForbidden();


    const record =
      testFindByPaymentReference(
        paymentReference
      );


    if(
      !record
    ){
      throw new Error(
        "Paiement de test introuvable."
      );
    }


    const currentDraft =
      testCore()
        .getDraft(
          record.draftId
        );


    if(
      !currentDraft ||
      ![
        "paid",
        "disputed"
      ]
        .includes(
          currentDraft.status
        )
    ){
      throw new Error(
        "Ce paiement ne peut pas être remboursé dans ce test."
      );
    }


    testCore()
      .applyServerStatus(

        record.draftId,

        {
          status:
            "refunded",

          paymentReference:
            record.paymentReference,

          serverReference:
            record.paymentReference
        }
      );


    return testUpdateHistory(

      record.paymentReference,

      {
        status:
          "refunded",

        refundedAt:
          testNow()
      }
    );
  }


  function testClear(){

    testProductionForbidden();


    window.sessionStorage.removeItem(
      HISTORY_KEY
    );

    window.sessionStorage.removeItem(
      SCENARIO_KEY
    );

    window.sessionStorage.removeItem(
      DELAY_KEY
    );


    return true;
  }


  window.BociteFinanceTest = {

    version:
      VERSION,

    ready:
      true,

    allowedScenarios:
      ALLOWED_SCENARIOS.slice(),

    getScenario:
      testScenario,

    setScenario:
      testSetScenario,

    getDelay:
      testDelay,

    setDelay:
      testSetDelay,

    startCheckout:
      testStartCheckout,

    completePending:
      testCompletePending,

    disputePaid:
      testDisputePaid,

    refund:
      testRefund,

    getHistory:
      function(){

        return testClone(
          testReadHistory()
        );
      },

    clear:
      testClear
  };


  console.info(
    "✅ Bo'CitéArt Finance — test à blanc chargé"
  );

})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART — FINANCE — TEST À BLANC
   ========================================================= */
