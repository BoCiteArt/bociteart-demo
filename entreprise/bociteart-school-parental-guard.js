/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — ÉCOLE
   GARDE PARENTALE INVISIBLE POUR LE PROFESSEUR
   PROFIL ENFANT + PROFIL VOCAL CONFIRMÉ EN AMONT
   ========================================================= */

(function initBociteSchoolParentalGuard(){
  "use strict";

  if(window.BociteSchoolParentalGuard){
    return;
  }

  const CURRENT_CHILD_KEY =
    "bociteart_school_current_child_v1";

  const ACCOUNT_KEY =
    "bociteart_account_demo_v1";

  function safeParse(value, fallback){
    try{
      return JSON.parse(value);
    }catch(error){
      return fallback;
    }
  }

  function normalizeGender(value){
    const gender = String(value || "")
      .trim()
      .toLowerCase();

    if([
      "girl",
      "fille",
      "female"
    ].includes(gender)){
      return "girl";
    }

    if([
      "boy",
      "garcon",
      "garçon",
      "male"
    ].includes(gender)){
      return "boy";
    }

    return "";
  }

  function normalizeFirstName(value){
    return String(value || "").trim();
  }

  function normalizeChild(data){
    const source = data || {};

    return {
      accountId:String(
        source.accountId ||
        source.childAccountId ||
        source.id ||
        ""
      ).trim(),

      firstName:normalizeFirstName(
        source.firstName ||
        source.prenom ||
        source.displayName
      ),

      voiceGender:normalizeGender(
        source.voiceGender ||
        source.syntheticVoice ||
        source.gender
      )
    };
  }

  function readAccount(){
    return safeParse(
      localStorage.getItem(ACCOUNT_KEY),
      null
    );
  }

  function readStoredChild(){
    return safeParse(
      localStorage.getItem(CURRENT_CHILD_KEY),
      null
    );
  }

  function readChildFromDom(){
    const ids = [
      "schoolChildSelect",
      "schoolStudentSelect",
      "schoolPupilSelect"
    ];

    for(const id of ids){
      const select = document.getElementById(id);

      if(!select){
        continue;
      }

      const option =
        select.options &&
        select.selectedIndex >= 0
          ? select.options[select.selectedIndex]
          : null;

      if(!option){
        continue;
      }

      const child = normalizeChild({
        accountId:
          option.dataset.accountId ||
          option.dataset.childAccountId ||
          option.value,

        firstName:
          option.dataset.firstName ||
          option.dataset.prenom ||
          option.textContent,

        voiceGender:
          option.dataset.voiceGender ||
          option.dataset.syntheticVoice
      });

      if(child.accountId || child.firstName){
        return child;
      }
    }

    return null;
  }

  function getCurrentChild(){
    const stored = readStoredChild();

    if(stored){
      return normalizeChild(stored);
    }

    const domChild = readChildFromDom();

    if(domChild){
      return domChild;
    }

    const account = readAccount();

    if(
      account &&
      String(account.category || "").toLowerCase() === "jeune"
    ){
      return normalizeChild({
        accountId:account.accountId,

        firstName:
          account.firstName ||
          account.prenom ||
          account.displayName,

        voiceGender:
          account.voiceGender ||
          account.syntheticVoice
      });
    }

    return {
      accountId:"",
      firstName:"",
      voiceGender:""
    };
  }

  function setCurrentChild(data){
    const child = normalizeChild(data);

    localStorage.setItem(
      CURRENT_CHILD_KEY,
      JSON.stringify(child)
    );

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:school-child-profile-updated",
        {
          detail:getCurrentVoiceProfile()
        }
      )
    );

    return child;
  }

  function clearCurrentChild(){
    localStorage.removeItem(CURRENT_CHILD_KEY);

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:school-child-profile-updated",
        {
          detail:getCurrentVoiceProfile()
        }
      )
    );
  }

  function getConsentProfile(accountId){
    if(
      !window.BociteParentalConsent ||
      typeof window.BociteParentalConsent.getVoiceProfile !== "function"
    ){
      return null;
    }

    try{
      return window.BociteParentalConsent
        .getVoiceProfile(accountId) || null;
    }catch(error){
      return null;
    }
  }

  function getVoiceProfileFor(accountId, fallbackChild){
    const child = normalizeChild(
      fallbackChild ||
      (
        accountId
          ? { accountId:accountId }
          : getCurrentChild()
      )
    );

    const id = String(
      accountId ||
      child.accountId ||
      ""
    ).trim();

    const consent = id
      ? getConsentProfile(id)
      : null;

    const firstName = normalizeFirstName(
      (consent && consent.firstName) ||
      child.firstName
    );

    const confirmedGender = normalizeGender(
      consent &&
      consent.voiceProfileConfirmed === true
        ? (
            consent.voiceGender ||
            consent.syntheticVoice
          )
        : ""
    );

    return {
      accountId:id,
      firstName:firstName,

      voiceGender:confirmedGender,
      syntheticVoice:confirmedGender,

      voiceProfileConfirmed:Boolean(confirmedGender),

      realVoiceAuthorized:Boolean(
        consent &&
        consent.realVoiceAuthorized === true
      ),

      parentName:
        consent && consent.parentName
          ? String(consent.parentName)
          : "",

      parentEmail:
        consent && consent.parentEmail
          ? String(consent.parentEmail)
          : "",

      policyVersion:
        consent && consent.policyVersion
          ? String(consent.policyVersion)
          : ""
    };
  }

  function getCurrentVoiceProfile(){
    const child = getCurrentChild();

    return getVoiceProfileFor(
      child.accountId,
      child
    );
  }

  function canUseCurrentVoice(){
    const profile = getCurrentVoiceProfile();

    return (
      profile.realVoiceAuthorized === true
    );
  }

  function hasConfirmedSyntheticProfile(){
    const profile = getCurrentVoiceProfile();

    return Boolean(
      profile.voiceProfileConfirmed === true &&
      normalizeGender(
        profile.voiceGender ||
        profile.syntheticVoice
      )
    );
  }

  function openDemoConsent(){
    const child = getCurrentChild();

    if(
      !window.BociteParentalConsent ||
      typeof window.BociteParentalConsent.openMotDuJour !== "function" ||
      !child.accountId
    ){
      return false;
    }

    return window.BociteParentalConsent
      .openMotDuJour({
        accountId:child.accountId,
        firstName:child.firstName,
        voiceGender:child.voiceGender
      });
  }

  function getAuditRecords(filters){
    if(
      !window.BociteParentalConsent ||
      typeof window.BociteParentalConsent.getAuditRecords !== "function"
    ){
      return [];
    }

    try{
      return window.BociteParentalConsent
        .getAuditRecords(filters || {});
    }catch(error){
      return [];
    }
  }

  document.addEventListener(
    "bociteart:parent-permission-updated",
    function(){
      document.dispatchEvent(
        new CustomEvent(
          "bociteart:school-child-profile-updated",
          {
            detail:getCurrentVoiceProfile()
          }
        )
      );
    }
  );

  window.BociteSchoolParentalGuard = {
    setCurrentChild:setCurrentChild,
    clearCurrentChild:clearCurrentChild,
    getCurrentChild:getCurrentChild,

    getVoiceProfileFor:getVoiceProfileFor,
    getCurrentVoiceProfile:getCurrentVoiceProfile,

    canUseCurrentVoice:canUseCurrentVoice,
    hasConfirmedSyntheticProfile:hasConfirmedSyntheticProfile,

    openDemoConsent:openDemoConsent,
    getAuditRecords:getAuditRecords
  };

  console.log(
    "✅ École — garde parentale avec profil vocal confirmé chargée"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
