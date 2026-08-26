/* =========================================================
   ÇA COMMENCE ICI

   BO'CITÉART — ÉCOLE
   CONTRÔLE AUTORISATION PARENTALE
   VOIX RÉELLE / MOT DU JOUR

   DÉMONSTRATION :
   - la vraie voix nécessite une autorisation ;
   - sans autorisation, la voix synthétique reste disponible ;
   - aucune autre fonction du jeune n'est bloquée ;
   - l'autorisation doit correspondre au jeune concerné.

   PRODUCTION :
   la vérification réelle sera faite côté serveur.
   ========================================================= */

(function initBociteSchoolParentalGuard(){

  "use strict";


  if(
    window.BociteSchoolParentalGuard
  ){
    return;
  }


  const SUBJECT_KEY =
    "bociteart_school_voice_subject_v1";


  /* =====================================================
     OUTILS
     ===================================================== */

  function getElement(id){

    return document.getElementById(id);

  }


  function normalize(value){

    return String(
      value || ""
    )
    .trim();

  }


  function getParentRequest(){

    try{

      if(
        window.BociteParentalContact &&
        typeof window
          .BociteParentalContact
          .getPendingRequest ===
            "function"
      ){

        return (
          window.BociteParentalContact
            .getPendingRequest() ||
          null
        );

      }

    }catch(error){

      return null;

    }


    return null;

  }


  function getVoicePermission(){

    try{

      if(
        window.BociteParentalConsent &&
        typeof window
          .BociteParentalConsent
          .getPermission ===
            "function"
      ){

        return (
          window.BociteParentalConsent
            .getPermission(
              "motDuJourVoice"
            ) ||
          null
        );

      }

    }catch(error){

      return null;

    }


    return null;

  }


  function getYoungReference(){

    const input =
      getElement(
        "schoolVoiceYoungReference"
      );


    return normalize(
      input
        ? input.value
        : ""
    );

  }


  function saveVoiceSubject(){

    const accountId =
      getYoungReference();


    if(!accountId){
      return;
    }


    try{

      localStorage.setItem(
        SUBJECT_KEY,
        JSON.stringify({
          accountId:
            accountId,

          savedAt:
            new Date().toISOString()
        })
      );

    }catch(error){

      /* rien */

    }

  }


  /* =====================================================
     VÉRIFICATION
     ===================================================== */

  function canUseCurrentVoice(){

    const accountId =
      getYoungReference();


    if(!accountId){
      return false;
    }


    const permission =
      getVoicePermission();


    if(
      !permission ||
      permission.status !==
        "authorized"
    ){

      return false;

    }


    /*
      L'autorisation doit concerner
      exactement le jeune sélectionné.

      Une autorisation donnée pour
      un enfant ne doit jamais servir
      pour un autre.
    */

    if(
      normalize(
        permission.accountId
      ) !==
      accountId
    ){

      return false;

    }


    return true;

  }


  /* =====================================================
     ÉTAT VISUEL
     ===================================================== */

  function refreshStatus(){

    const status =
      getElement(
        "schoolVoicePermissionStatus"
      );


    if(!status){
      return;
    }


    const accountId =
      getYoungReference();


    if(!accountId){

      status.innerHTML = `

        <strong>
          Autorisation non vérifiée.
        </strong>

        <br><br>

        Sélectionnez ou indiquez d'abord
        la référence du jeune concerné.

      `;

      status.style.borderColor =
        "#c8a96b";

      return;

    }


    const permission =
      getVoicePermission();


    if(
      permission &&
      permission.status ===
        "authorized" &&
      normalize(
        permission.accountId
      ) ===
        accountId
    ){

      status.innerHTML = `

        <strong
          style="
            color:#2f5d46;
          ">
          ✓ Autorisation enregistrée
        </strong>

        <br><br>

        La vraie voix peut être utilisée
        pour le Mot du jour
        dans le cadre de cette démonstration.

      `;

      status.style.borderColor =
        "#2f5d46";

      return;

    }


    if(
      permission &&
      permission.status ===
        "refused" &&
      normalize(
        permission.accountId
      ) ===
        accountId
    ){

      status.innerHTML = `

        <strong>
          Autorisation refusée.
        </strong>

        <br><br>

        La vraie voix ne doit pas être utilisée.
        La voix synthétique reste disponible.

      `;

      status.style.borderColor =
        "#b00020";

      return;

    }


    if(
      permission &&
      permission.status ===
        "revoked"
    ){

      status.innerHTML = `

        <strong>
          Autorisation retirée.
        </strong>

        <br><br>

        La vraie voix ne doit plus être utilisée.

      `;

      status.style.borderColor =
        "#b00020";

      return;

    }


    status.innerHTML = `

      <strong>
        Autorisation parentale manquante.
      </strong>

      <br><br>

      La vraie voix ne peut pas être
      enregistrée ou diffusée.

      <br><br>

      Le Mot du jour peut continuer
      avec une voix synthétique.

    `;

    status.style.borderColor =
      "#c8a96b";

  }


  function showMissingPermission(){

    refreshStatus();


    alert(
      "La vraie voix de cet élève nécessite une autorisation parentale correspondante.\n\n" +
      "Le Mot du jour peut continuer avec la voix synthétique."
    );

  }


  /* =====================================================
     OUVRIR L'AUTORISATION
     VERSION DÉMONSTRATION
     ===================================================== */

  function openDemoConsent(){

    const request =
      getParentRequest();


  if(!request){

  if(
    window.BociteParentalContact &&
    typeof window.BociteParentalContact.open ===
      "function"
  ){

    window.BociteParentalContact.open({

      onContinue:
        function(){

          /*
            Une fois la liaison préparée,
            l'utilisateur revient simplement
            dans l'application.
          */

        }

    });

    return;

  }


  alert(
    "Le module de liaison parentale n'est pas disponible."
  );

  return;

}


    const input =
      getElement(
        "schoolVoiceYoungReference"
      );


    if(
      input &&
      !normalize(
        input.value
      )
    ){

      input.value =
        normalize(
          request.accountId
        );

    }


    if(
      !window.BociteParentalConsent ||
      typeof window
        .BociteParentalConsent
        .openMotDuJour !==
          "function"
    ){

      alert(
        "Le module d'autorisation parentale n'est pas disponible."
      );

      return;

    }


    window.BociteParentalConsent
      .openMotDuJour({

        accountId:
          normalize(
            request.accountId
          ),

        parentEmail:
          normalize(
            request.parentEmail
          )

      });

  }


  /* =====================================================
     AJOUT DANS L'ÉCRAN ÉCOLE
     ===================================================== */

  function installSchoolPanel(){

    const recordButton =
      getElement(
        "schoolRecordVoiceBtn"
      );


    if(!recordButton){
      return;
    }


    if(
      getElement(
        "schoolVoicePermissionPanel"
      )
    ){

      return;
    }


    const actionRow =
      recordButton.parentElement;


    if(
      !actionRow ||
      !actionRow.parentElement
    ){

      return;
    }


    const panel =
      document.createElement(
        "div"
      );


    panel.id =
      "schoolVoicePermissionPanel";


    panel.style.cssText = `

      margin:12px 0 10px 0;

      padding:14px;

      background:#ffffff;

      border:1px solid #dedede;

      border-radius:12px;

      color:#111111;

      font-size:14px;

      line-height:1.5;

    `;


    panel.innerHTML = `

      <div
        style="
          color:#2f5d46;
          font-size:16px;
          font-weight:700;
          margin-bottom:10px;
        ">

        Autorisation de la vraie voix

      </div>


      <div>

        Avant d'enregistrer la vraie voix
        d'un jeune pour le Mot du jour,
        l'autorisation correspondante
        doit être enregistrée.

        <br><br>

        Sans cette autorisation,
        l'enseignant peut continuer
        normalement avec la voix synthétique.

      </div>


      <label
        for="schoolVoiceYoungReference"
        style="
          display:block;
          margin-top:14px;
          margin-bottom:6px;
          font-weight:700;
        ">

        Référence du jeune
        <span style="font-weight:400;">
          (démo)
        </span>

      </label>


      <input
        id="schoolVoiceYoungReference"
        type="text"
        class="miniField"
        autocomplete="off"
        placeholder="Référence du compte jeune"
      >


      <div
        id="schoolVoicePermissionStatus"
        style="
          margin-top:12px;
          padding:12px;
          border:1px solid #c8a96b;
          border-radius:10px;
          background:#fffdf7;
        ">
      </div>


      <button
        id="schoolVoiceCheckPermission"
        type="button"
        class="choiceBtn"
        style="
          width:100%;
          margin-top:12px;
        ">

        Vérifier l'autorisation

      </button>


      <button
        id="schoolVoiceOpenParentConsent"
        type="button"
        class="choiceBtn"
        style="
          width:100%;
          margin-top:10px;
        ">

        Simuler la validation du parent

      </button>


      <div
        style="
          margin-top:11px;
          color:#555555;
          font-size:12px;
          line-height:1.45;
        ">

        En production, la référence de l'élève
        et l'autorisation seront récupérées
        automatiquement depuis le compte sécurisé
        et le serveur Bo'CitéArt.

        L'enseignant n'aura pas à recopier
        un identifiant manuellement.

      </div>

    `;


    actionRow.parentElement
      .insertBefore(
        panel,
        actionRow
      );


    const request =
      getParentRequest();


    const input =
      getElement(
        "schoolVoiceYoungReference"
      );


    /*
      Pour faciliter uniquement
      la démonstration actuelle.
    */

    if(
      input &&
      request &&
      request.accountId
    ){

      input.value =
        normalize(
          request.accountId
        );

    }


    const checkButton =
      getElement(
        "schoolVoiceCheckPermission"
      );


    const consentButton =
      getElement(
        "schoolVoiceOpenParentConsent"
      );


    if(checkButton){

      checkButton.onclick =
        function(){

          refreshStatus();

        };

    }


    if(consentButton){

      consentButton.onclick =
        function(){

          openDemoConsent();

        };

    }


    if(input){

      input.addEventListener(
        "input",
        refreshStatus
      );

    }


    refreshStatus();

  }


  /* =====================================================
     SUIVI DE LA FENÊTRE ÉCOLE
     ===================================================== */

  const observer =
    new MutationObserver(
      function(){

        installSchoolPanel();

      }
    );


  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );


  document.addEventListener(
    "bociteart:parent-permission-updated",
    function(){

      window.setTimeout(
        refreshStatus,
        50
      );

    }
  );


  /* =====================================================
     API
     ===================================================== */

  window.BociteSchoolParentalGuard = {

    canUseCurrentVoice:
      canUseCurrentVoice,

    showMissingPermission:
      showMissingPermission,

    refreshStatus:
      refreshStatus,

    saveVoiceSubject:
      saveVoiceSubject,

    openDemoConsent:
      openDemoConsent

  };


  window.setTimeout(
    installSchoolPanel,
    100
  );


  console.log(
    "✅ École — contrôle parental de la vraie voix chargé"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
