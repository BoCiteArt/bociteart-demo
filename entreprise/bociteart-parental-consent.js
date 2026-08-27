/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — AUTORISATIONS PARENTALES
   VOIX RÉELLE + PROFIL VOCAL SYNTHÉTIQUE
   ========================================================= */

(function initBociteParentalConsent(){
  "use strict";

  if(window.BociteParentalConsent){
    return;
  }

  const STORAGE_KEY =
    "bociteart_parent_permissions_v1";

  const OVERLAY_ID =
    "bociteParentalConsentOverlay";

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

    if(["girl","fille","female"].includes(gender)){
      return "girl";
    }

    if(["boy","garcon","garçon","male"].includes(gender)){
      return "boy";
    }

    return "";
  }

  function getAccountId(value){
    if(value){
      return String(value).trim();
    }

    try{
      const account = safeParse(
        localStorage.getItem("bociteart_account_demo_v1"),
        null
      );

      return account && account.accountId
        ? String(account.accountId).trim()
        : "";
    }catch(error){
      return "";
    }
  }

  function loadAll(){
    const data = safeParse(
      localStorage.getItem(STORAGE_KEY),
      {}
    );

    return data && typeof data === "object"
      ? data
      : {};
  }

  function saveAll(data){
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data || {})
    );
  }

  function getPermission(accountId){
    const id = getAccountId(accountId);

    if(!id){
      return null;
    }

    const all = loadAll();
    return all[id] || null;
  }

  function saveMotDuJourDecision(data){
    const source = data || {};
    const accountId = getAccountId(source.accountId);

    if(!accountId){
      return null;
    }

    const syntheticVoice = normalizeGender(
      source.syntheticVoice ||
      source.voiceGender
    );

    const authorized =
      source.realVoiceAuthorized === true ||
      source.status === "authorized";

    const permission = {
      accountId:accountId,

      firstName:String(
        source.firstName ||
        source.prenom ||
        ""
      ).trim(),

      parentEmail:String(
        source.parentEmail ||
        ""
      )
      .trim()
      .toLowerCase(),

      status:
        authorized
          ? "authorized"
          : "refused",

      realVoiceAuthorized:
        authorized,

      syntheticVoice:
        syntheticVoice,

      voiceGender:
        syntheticVoice,

      verification:
        "demo_unverified",

      updatedAt:
        new Date().toISOString()
    };

    const all = loadAll();

    all[accountId] =
      permission;

    saveAll(all);

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:parent-permission-updated",
        {
          detail:
            permission
        }
      )
    );

    return permission;
  }

  function hasMotDuJourVoicePermission(
    accountId
  ){
    const permission =
      getPermission(accountId);

    return Boolean(
      permission &&
      permission.realVoiceAuthorized === true &&
      permission.status === "authorized"
    );
  }

  function getVoiceProfile(accountId){
    const permission =
      getPermission(accountId);

    if(!permission){
      return null;
    }

    return {
      accountId:
        permission.accountId,

      firstName:
        permission.firstName ||
        "",

      realVoiceAuthorized:
        permission.realVoiceAuthorized === true,

      syntheticVoice:
        normalizeGender(
          permission.syntheticVoice
        ),

      voiceGender:
        normalizeGender(
          permission.voiceGender ||
          permission.syntheticVoice
        )
    };
  }

  function revokeMotDuJourVoice(
    accountId
  ){
    const id =
      getAccountId(accountId);

    if(!id){
      return false;
    }

    const all =
      loadAll();

    const previous =
      all[id] ||
      {};

    all[id] =
      Object.assign(
        {},
        previous,
        {
          accountId:id,

          status:
            "revoked",

          realVoiceAuthorized:
            false,

          verification:
            "demo_unverified",

          updatedAt:
            new Date()
              .toISOString()
        }
      );

    saveAll(all);

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:parent-permission-updated",
        {
          detail:
            all[id]
        }
      )
    );

    return true;
  }

  function close(){
    const overlay =
      document.getElementById(
        OVERLAY_ID
      );

    if(overlay){
      overlay.remove();
    }
  }

  function openMotDuJour(options){
    const source =
      options ||
      {};

    const accountId =
      getAccountId(
        source.accountId
      );

    if(!accountId){
      return false;
    }

    const existing =
      getPermission(
        accountId
      ) ||
      {};

    const presetGender =
      normalizeGender(
        source.syntheticVoice ||
        source.voiceGender ||
        existing.syntheticVoice
      );

    close();

    const overlay =
      document.createElement(
        "div"
      );

    overlay.id =
      OVERLAY_ID;

    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:1000030",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "padding:16px",
      "background:rgba(0,0,0,.55)",
      "font-family:Arial,sans-serif"
    ].join(";");

    overlay.innerHTML = `

      <div
        style="
          width:100%;
          max-width:560px;
          background:#fffdf7;
          border:2px solid #2f5d46;
          border-radius:15px;
          padding:18px;
          box-sizing:border-box;
        "
      >

        <div
          style="
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:12px;
          "
        >

          <div
            style="
              color:#2f5d46;
              font-size:17px;
              font-weight:700;
            "
          >
            Autorisation — Mot du jour
          </div>

          <button
            id="bociteParentConsentClose"
            type="button"
            style="
              border:0;
              background:#fff;
              font-size:24px;
              cursor:pointer;
            "
          >
            ×
          </button>

        </div>

        <p
          style="
            font-size:14px;
            font-weight:400;
            color:#111;
            line-height:1.5;
          "
        >
          Cet écran est destiné au parent
          ou au responsable légal,
          pas au professeur.
        </p>

        <label
          style="
            display:block;
            font-size:14px;
            color:#111;
            margin-top:12px;
          "
        >
          Profil vocal de remplacement
        </label>

        <select
          id="bociteParentSyntheticVoice"
          style="
            width:100%;
            margin-top:7px;
            padding:11px;
            border:1px solid #bbb;
            border-radius:9px;
            font-size:14px;
          "
        >

          <option
            value=""
            ${
              presetGender
                ? ""
                : "selected"
            }
          >
            À confirmer
          </option>

          <option
            value="girl"
            ${
              presetGender === "girl"
                ? "selected"
                : ""
            }
          >
            Fille
          </option>

          <option
            value="boy"
            ${
              presetGender === "boy"
                ? "selected"
                : ""
            }
          >
            Garçon
          </option>

        </select>

        <button
          id="bociteParentAuthorizeVoice"
          type="button"
          style="
            width:100%;
            margin-top:14px;
            padding:12px;
            border:1px solid #d7c9b5;
            border-radius:10px;
            background:#efe4d3;
            font-size:16px;
            font-weight:700;
            cursor:pointer;
          "
        >
          Autoriser la vraie voix
        </button>

        <button
          id="bociteParentRefuseVoice"
          type="button"
          style="
            width:100%;
            margin-top:10px;
            padding:12px;
            border:1px solid #ddd;
            border-radius:10px;
            background:#fff;
            font-size:16px;
            font-weight:700;
            cursor:pointer;
          "
        >
          Ne pas autoriser la vraie voix
        </button>

      </div>

    `;

    document.body.appendChild(
      overlay
    );

    document
      .getElementById(
        "bociteParentConsentClose"
      )
      .onclick =
        close;

    function saveDecision(
      authorized
    ){
      const gender =
        normalizeGender(
          document
            .getElementById(
              "bociteParentSyntheticVoice"
            )
            .value
        );

      saveMotDuJourDecision({
        accountId:
          accountId,

        firstName:
          source.firstName ||
          source.prenom ||
          existing.firstName,

        parentEmail:
          source.parentEmail ||
          existing.parentEmail,

        realVoiceAuthorized:
          authorized,

        syntheticVoice:
          gender
      });

      close();
    }

    document
      .getElementById(
        "bociteParentAuthorizeVoice"
      )
      .onclick =
        function(){
          saveDecision(true);
        };

    document
      .getElementById(
        "bociteParentRefuseVoice"
      )
      .onclick =
        function(){
          saveDecision(false);
        };

    return true;
  }

  window.BociteParentalConsent = {

    openMotDuJour:
      openMotDuJour,

    close:
      close,

    getPermission:
      getPermission,

    getVoiceProfile:
      getVoiceProfile,

    saveMotDuJourDecision:
      saveMotDuJourDecision,

    hasMotDuJourVoicePermission:
      hasMotDuJourVoicePermission,

    revokeMotDuJourVoice:
      revokeMotDuJourVoice

  };

  console.log(
    "✅ Autorisations parentales Bo'CitéArt simplifiées chargées"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
