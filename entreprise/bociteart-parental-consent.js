/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — AUTORISATIONS PARENTALES
   MOT DU JOUR — DÉCISION + PROFIL VOCAL + TRAÇABILITÉ DÉMO
   ========================================================= */

(function initBociteParentalConsent(){
  "use strict";

  if(window.BociteParentalConsent){
    return;
  }

  const STORAGE_KEY =
    "bociteart_parent_permissions_v1";

  const AUDIT_KEY =
    "bociteart_parent_permissions_audit_v1";

  const OVERLAY_ID =
    "bociteParentalConsentOverlay";

  const POLICY_VERSION =
    "mot_du_jour_voice_v1_20260827";

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

  function normalizeEmail(value){
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function inferGenderFromKnownFirstName(value){
    const name = normalizeFirstName(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if(!name){
      return "";
    }

    const girls = new Set([
      "alice","ambre","amelie","anna","celine","charlotte",
      "chloe","clara","emma","eva","jade","jeanne","julie",
      "lea","lina","lola","louise","lucie","manon","margaux",
      "marie","mathilde","nina","oceane","romane","rose","sarah",
      "sophie","zoe","frederique"
    ]);

    const boys = new Set([
      "adam","alexandre","antoine","arthur","baptiste","benjamin",
      "clement","enzo","frederic","gabriel","hugo","jules","leo",
      "louis","lucas","mathis","mathieu","maxime","nathan","nicolas",
      "noah","paul","raphael","remy","thomas","timothee","tom","victor"
    ]);

    if(girls.has(name) && !boys.has(name)){
      return "girl";
    }

    if(boys.has(name) && !girls.has(name)){
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

  function loadAudit(){
    const data = safeParse(
      localStorage.getItem(AUDIT_KEY),
      []
    );

    return Array.isArray(data)
      ? data
      : [];
  }

  function saveAudit(rows){
    localStorage.setItem(
      AUDIT_KEY,
      JSON.stringify(
        Array.isArray(rows)
          ? rows
          : []
      )
    );
  }

  function appendAudit(entry){
    const rows = loadAudit();

    rows.push(Object.assign({
      auditId:
        "parent-audit-" +
        Date.now() +
        "-" +
        Math.random().toString(36).slice(2, 8),

      policyVersion:
        POLICY_VERSION,

      recordedAt:
        new Date().toISOString(),

      source:
        "demo_browser_storage"
    }, entry || {}));

    saveAudit(rows);

    return rows[rows.length - 1];
  }

  function getPermission(accountId){
    const id = getAccountId(accountId);

    if(!id){
      return null;
    }

    const all = loadAll();

    return all[id] || null;
  }

  function getVoiceProfile(accountId){
    const permission = getPermission(accountId);

    if(!permission){
      return null;
    }

    const confirmedGender =
      permission.voiceProfileConfirmed === true
        ? normalizeGender(
            permission.voiceGender ||
            permission.syntheticVoice
          )
        : "";

    return {
      accountId:
        permission.accountId,

      firstName:
        permission.firstName || "",

      realVoiceAuthorized:
        permission.realVoiceAuthorized === true &&
        permission.status === "authorized",

      syntheticVoice:
        confirmedGender,

      voiceGender:
        confirmedGender,

      voiceProfileConfirmed:
        Boolean(confirmedGender),

      parentName:
        permission.parentName || "",

      parentEmail:
        permission.parentEmail || "",

      policyVersion:
        permission.policyVersion ||
        POLICY_VERSION
    };
  }

  function saveMotDuJourDecision(data){
    const source = data || {};

    const accountId =
      getAccountId(source.accountId);

    if(!accountId){
      return null;
    }

    const gender = normalizeGender(
      source.syntheticVoice ||
      source.voiceGender
    );

    if(!gender){
      return null;
    }

    const authorized =
      source.realVoiceAuthorized === true ||
      source.status === "authorized";

    const all = loadAll();
    const previous = all[accountId] || null;

    const permission = {
      accountId:accountId,

      firstName:
        normalizeFirstName(
          source.firstName ||
          source.prenom ||
          (previous && previous.firstName)
        ),

      parentName:
        String(
          source.parentName ||
          source.legalRepresentativeName ||
          (previous && previous.parentName) ||
          ""
        ).trim(),

      parentEmail:
        normalizeEmail(
          source.parentEmail ||
          (previous && previous.parentEmail)
        ),

      status:
        authorized
          ? "authorized"
          : "refused",

      realVoiceAuthorized:
        authorized,

      syntheticVoice:
        gender,

      voiceGender:
        gender,

      voiceProfileConfirmed:
        true,

      verification:
        "demo_unverified",

      policyVersion:
        POLICY_VERSION,

      updatedAt:
        new Date().toISOString()
    };

    all[accountId] = permission;
    saveAll(all);

    appendAudit({
      action:
        authorized
          ? "voice_authorized"
          : "voice_refused",

      accountId:
        accountId,

      firstName:
        permission.firstName,

      parentName:
        permission.parentName,

      parentEmail:
        permission.parentEmail,

      realVoiceAuthorized:
        authorized,

      voiceGender:
        gender,

      voiceProfileConfirmed:
        true,

      previousStatus:
        previous
          ? previous.status || ""
          : ""
    });

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

  function hasMotDuJourVoicePermission(accountId){
    const permission = getPermission(accountId);

    return Boolean(
      permission &&
      permission.realVoiceAuthorized === true &&
      permission.status === "authorized"
    );
  }

  function revokeMotDuJourVoice(accountId){
    const id = getAccountId(accountId);

    if(!id){
      return false;
    }

    const all = loadAll();
    const previous = all[id] || {};

    all[id] = Object.assign({}, previous, {
      accountId:id,
      status:"revoked",
      realVoiceAuthorized:false,
      verification:"demo_unverified",
      policyVersion:POLICY_VERSION,
      updatedAt:new Date().toISOString()
    });

    saveAll(all);

    appendAudit({
      action:"voice_revoked",
      accountId:id,
      firstName:all[id].firstName || "",
      parentName:all[id].parentName || "",
      parentEmail:all[id].parentEmail || "",
      realVoiceAuthorized:false,
      voiceGender:normalizeGender(
        all[id].voiceGender ||
        all[id].syntheticVoice
      ),
      voiceProfileConfirmed:
        all[id].voiceProfileConfirmed === true,
      previousStatus:
        previous.status || ""
    });

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

  function getAuditRecords(filters){
    const source = filters || {};

    const accountId =
      String(
        source.accountId ||
        ""
      ).trim();

    const parentEmail =
      normalizeEmail(
        source.parentEmail
      );

    return loadAudit().filter(function(row){

      if(
        accountId &&
        String(row.accountId || "") !==
          accountId
      ){
        return false;
      }

      if(
        parentEmail &&
        normalizeEmail(
          row.parentEmail
        ) !==
          parentEmail
      ){
        return false;
      }

      return true;
    });
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
    const source = options || {};

    const accountId =
      getAccountId(
        source.accountId
      );

    if(!accountId){
      return false;
    }

    const existing =
      getPermission(accountId) || {};

    const firstName =
      normalizeFirstName(
        source.firstName ||
        source.prenom ||
        existing.firstName
      );

    const existingGender =
      existing.voiceProfileConfirmed === true
        ? normalizeGender(
            existing.voiceGender ||
            existing.syntheticVoice
          )
        : "";

    const suggestion =
      existingGender ||
      normalizeGender(
        source.voiceGender ||
        source.syntheticVoice
      ) ||
      inferGenderFromKnownFirstName(
        firstName
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
      "overflow:auto",
      "padding:16px",
      "box-sizing:border-box",
      "background:rgba(0,0,0,.55)",
      "font-family:Arial,sans-serif"
    ].join(";");

    overlay.innerHTML = `

      <div
        style="
          width:100%;
          max-width:600px;
          margin:20px auto;
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
            Autorisation parentale — Mot du jour
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
          Cette fiche est destinée au parent
          ou au responsable légal.
          Elle permet de confirmer le profil vocal
          de l'enfant et d'accepter ou non
          la conservation et la diffusion
          de sa vraie voix dans le cadre
          du Mot du jour.
        </p>

        <div
          style="
            margin-top:14px;
            padding:12px;
            border:1px solid #dedede;
            border-radius:10px;
            background:#fff;
          "
        >
          <div
            style="
              font-size:14px;
              color:#111;
            "
          >
            Enfant :
            <strong>
              ${firstName || "à renseigner"}
            </strong>
          </div>
        </div>

        <label
          for="bociteParentName"
          style="
            display:block;
            margin-top:14px;
            font-size:14px;
            color:#111;
          "
        >
          Nom du parent ou du responsable légal
        </label>

        <input
          id="bociteParentName"
          type="text"
          value="${String(
            existing.parentName ||
            source.parentName ||
            ""
          ).replace(/"/g, "&quot;")}"
          style="
            width:100%;
            box-sizing:border-box;
            margin-top:7px;
            padding:11px;
            border:1px solid #bbb;
            border-radius:9px;
            font-size:14px;
          "
        >

        <label
          for="bociteParentEmail"
          style="
            display:block;
            margin-top:14px;
            font-size:14px;
            color:#111;
          "
        >
          Adresse e-mail du parent
          ou du responsable légal
        </label>

        <input
          id="bociteParentEmail"
          type="email"
          value="${normalizeEmail(
            existing.parentEmail ||
            source.parentEmail
          )}"
          style="
            width:100%;
            box-sizing:border-box;
            margin-top:7px;
            padding:11px;
            border:1px solid #bbb;
            border-radius:9px;
            font-size:14px;
          "
        >

        <div
          style="
            margin-top:16px;
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
          "
        >
          Confirmer le profil vocal de l'enfant
        </div>

        <p
          style="
            font-size:14px;
            font-weight:400;
            color:#111;
            line-height:1.5;
          "
        >
          Le prénom peut aider à proposer un choix,
          mais il ne décide jamais à la place
          du parent.
          Cochez obligatoirement Fille ou Garçon
          afin d'éviter toute erreur
          de voix synthétique.
        </p>

        <label
          style="
            display:flex;
            align-items:center;
            gap:9px;
            margin-top:10px;
            padding:10px;
            border:1px solid #dedede;
            border-radius:9px;
            background:#fff;
            cursor:pointer;
          "
        >

          <input
            id="bociteParentVoiceGirl"
            type="radio"
            name="bociteParentVoiceGender"
            value="girl"
            ${
              suggestion === "girl"
                ? "checked"
                : ""
            }
          >

          <span
            style="
              font-size:14px;
              color:#111;
            "
          >
            Fille
          </span>

        </label>

        <label
          style="
            display:flex;
            align-items:center;
            gap:9px;
            margin-top:8px;
            padding:10px;
            border:1px solid #dedede;
            border-radius:9px;
            background:#fff;
            cursor:pointer;
          "
        >

          <input
            id="bociteParentVoiceBoy"
            type="radio"
            name="bociteParentVoiceGender"
            value="boy"
            ${
              suggestion === "boy"
                ? "checked"
                : ""
            }
          >

          <span
            style="
              font-size:14px;
              color:#111;
            "
          >
            Garçon
          </span>

        </label>

        <div
          id="bociteParentConsentMessage"
          style="
            display:none;
            margin-top:12px;
            padding:10px;
            border-left:5px solid #2f5d46;
            background:#fff;
            color:#111;
            font-size:14px;
            line-height:1.5;
          "
        >
        </div>

        <div
          style="
            margin-top:18px;
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
          "
        >
          Décision concernant la vraie voix
        </div>

        <p
          style="
            font-size:14px;
            font-weight:400;
            color:#111;
            line-height:1.5;
          "
        >
          Si la vraie voix est autorisée,
          elle pourra être conservée et utilisée.
          Si elle n'est pas autorisée,
          l'enregistrement réel utilisé pour l'écoute
          avant validation sera supprimé
          et remplacé automatiquement
          par la voix synthétique correspondant
          au profil confirmé ci-dessus.
        </p>

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

        <p
          style="
            margin-top:14px;
            font-size:12px;
            font-weight:400;
            color:#666;
            line-height:1.45;
          "
        >
          Démo : la décision et son historique
          sont conservés dans le navigateur.
          En production, ces éléments devront
          être enregistrés côté serveur
          dans un espace sécurisé et consultable
          uniquement par les personnes autorisées.
        </p>

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

    function showMessage(text){
      const box =
        document.getElementById(
          "bociteParentConsentMessage"
        );

      if(!box){
        return;
      }

      box.style.display =
        "block";

      box.textContent =
        text;
    }

    function getSelectedGender(){
      const checked =
        document.querySelector(
          'input[name="bociteParentVoiceGender"]:checked'
        );

      return normalizeGender(
        checked &&
        checked.value
      );
    }

    function saveDecision(authorized){
      const parentName =
        String(
          document
            .getElementById(
              "bociteParentName"
            )
            .value ||
          ""
        ).trim();

      const parentEmail =
        normalizeEmail(
          document
            .getElementById(
              "bociteParentEmail"
            )
            .value
        );

      const gender =
        getSelectedGender();

      if(!parentName){
        showMessage(
          "Renseignez le nom du parent ou du responsable légal."
        );

        return;
      }

      if(
        !parentEmail ||
        !parentEmail.includes("@")
      ){
        showMessage(
          "Renseignez une adresse e-mail valide pour le parent ou le responsable légal."
        );

        return;
      }

      if(!gender){
        showMessage(
          "Confirmez obligatoirement Fille ou Garçon avant de valider la fiche."
        );

        return;
      }

      const saved =
        saveMotDuJourDecision({
          accountId:accountId,
          firstName:firstName,
          parentName:parentName,
          parentEmail:parentEmail,
          realVoiceAuthorized:authorized,
          syntheticVoice:gender
        });

      if(!saved){
        showMessage(
          "La fiche n'a pas pu être enregistrée."
        );

        return;
      }

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
      revokeMotDuJourVoice,

    getAuditRecords:
      getAuditRecords

  };

  console.log(
    "✅ Autorisations parentales — profil vocal et traçabilité démo chargés"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
