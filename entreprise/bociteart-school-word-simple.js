/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — ÉCOLE & JEUNES
   MOT DU JOUR — PROFESSEUR + MULTI-CLASSES

   - Nom de classe librement modifiable
   - Dernière classe utilisée préremplie
   - Plusieurs classes dans le même espace
   - Identifiant stable par classe même si son nom change
   - Programmation séparée pour chaque classe
   - Jours de classe uniquement
   - Aucun choix Fille / Garçon par le professeur
   - Autorisation parentale traitée en amont
   ========================================================= */

(function initBociteSchoolWordSimple(){
  "use strict";

  if(window.BociteSchoolWordSimple){
    return;
  }

  const OVERLAY_ID =
    "bociteSchoolSimpleRecorderOverlay";

  const SCHEDULE_KEY =
    "bociteart_school_voice_schedule_v2";

  const LEGACY_SCHEDULE_KEY =
    "bociteart_school_voice_schedule_v1";

  const LEGACY_VOICE_KEY =
    "bociteart_school_voice_v1";

  const SCHOOL_CONFIG_KEY =
    "bociteart_school_config_v1";

  const CLASSES_KEY =
    "bociteart_school_classes_v1";

  const CURRENT_CLASS_ID_KEY =
    "bociteart_school_current_class_id_v1";

  const LAST_CLASS_NAME_KEY =
    "bociteart_school_last_class_name_v1";

  const MAX_RECORDING_MS =
    2 * 60 * 1000;

  const MAX_ADVANCE_DAYS =
    7;

  let recorder = null;
  let activeStream = null;
  let audioChunks = [];
  let timerId = null;
  let startedAt = 0;
  let objectUrl = "";

  let pendingBlob = null;
  let pendingAudioData = "";

  let pendingClassId = "";
  let pendingClassName = "";
  let pendingText = "";

  let pendingChildAccountId = "";

  let selectedVoiceMode =
    "synthetic-pending";

  let selectedVoiceGender = "";

  let typedFallback = false;

  let creatingNewClass = false;


  /* =====================================================
     OUTILS
     ===================================================== */

  function getElement(id){
    return document.getElementById(id);
  }


  function safeParse(value, fallback){
    try{
      return JSON.parse(value);
    }catch(error){
      return fallback;
    }
  }


  function escapeHtml(value){
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function normalizeClassName(value){
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }


  function createId(prefix){
    return (
      prefix +
      "-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 8)
    );
  }


  function twoDigits(value){
    return String(value)
      .padStart(2, "0");
  }


  function localDateToIso(date){
    return (
      date.getFullYear() +
      "-" +
      twoDigits(
        date.getMonth() + 1
      ) +
      "-" +
      twoDigits(
        date.getDate()
      )
    );
  }


  function todayIso(){
    return localDateToIso(
      new Date()
    );
  }


  function maxDateIso(){
    const date =
      new Date();

    date.setDate(
      date.getDate() +
      MAX_ADVANCE_DAYS
    );

    return localDateToIso(
      date
    );
  }


  function formatDateFr(iso){
    const parts =
      String(iso || "")
        .split("-");

    if(parts.length !== 3){
      return iso || "";
    }

    const date =
      new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
      );

    return date
      .toLocaleDateString(
        "fr-FR",
        {
          weekday:"long",
          day:"numeric",
          month:"long",
          year:"numeric"
        }
      );
  }


  function formatTime(milliseconds){
    const seconds =
      Math.max(
        0,
        Math.floor(
          milliseconds / 1000
        )
      );

    return (
      twoDigits(
        Math.floor(
          seconds / 60
        )
      ) +
      ":" +
      twoDigits(
        seconds % 60
      )
    );
  }


  function normalizeGender(value){
    const gender =
      String(value || "")
        .trim()
        .toLowerCase();

    if(
      [
        "girl",
        "fille",
        "female"
      ].includes(gender)
    ){
      return "girl";
    }

    if(
      [
        "boy",
        "garcon",
        "garçon",
        "male"
      ].includes(gender)
    ){
      return "boy";
    }

    return "";
  }


  function getCurrentWordText(){
    const input =
      getElement(
        "schoolWordInput"
      );

    const direct =
      String(
        input &&
        input.value
          ? input.value
          : ""
      ).trim();

    if(direct){
      return direct;
    }

    const display =
      String(
        getElement(
          "schoolWordDisplay"
        )?.textContent ||
        ""
      ).trim();

    const match =
      display.match(
        /«\s*(.*?)\s*»/
      );

    if(
      match &&
      match[1]
    ){
      return match[1]
        .trim();
    }

    return (
      display ||
      "Je suis ravi aujourd’hui."
    );
  }


  function getSchoolZone(){
    const zoneSelect =
      getElement(
        "schoolConfigZone"
      );

    if(
      zoneSelect &&
      zoneSelect.value
    ){
      return String(
        zoneSelect.value
      )
        .trim()
        .toUpperCase();
    }

    try{
      const raw =
        localStorage.getItem(
          SCHOOL_CONFIG_KEY
        );

      const config =
        raw
          ? JSON.parse(raw)
          : null;

      if(
        config &&
        config.zone
      ){
        return String(
          config.zone
        )
          .trim()
          .toUpperCase();
      }

    }catch(error){
      /* rien */
    }

    return "B";
  }


  /* =====================================================
     GESTION DES CLASSES
     ===================================================== */

  function loadClasses(){
    const data =
      safeParse(
        localStorage.getItem(
          CLASSES_KEY
        ),
        []
      );

    return Array.isArray(data)
      ? data.filter(
          function(row){
            return (
              row &&
              row.id &&
              normalizeClassName(
                row.name
              )
            );
          }
        )
      : [];
  }


  function saveClasses(rows){
    localStorage.setItem(
      CLASSES_KEY,
      JSON.stringify(rows)
    );
  }


  function getCurrentClassId(){
    return String(
      localStorage.getItem(
        CURRENT_CLASS_ID_KEY
      ) ||
      ""
    ).trim();
  }


  function setCurrentClassId(id){
    const clean =
      String(id || "")
        .trim();

    if(clean){
      localStorage.setItem(
        CURRENT_CLASS_ID_KEY,
        clean
      );
    }else{
      localStorage.removeItem(
        CURRENT_CLASS_ID_KEY
      );
    }
  }


  function getClassById(id){
    const wanted =
      String(id || "")
        .trim();

    return (
      loadClasses()
        .find(
          function(row){
            return (
              row.id === wanted
            );
          }
        ) ||
      null
    );
  }


  function getCurrentClassRecord(){
    const classes =
      loadClasses();

    const id =
      getCurrentClassId();

    if(
      creatingNewClass &&
      !id
    ){
      return null;
    }

    let current =
      classes.find(
        function(row){
          return (
            row.id === id
          );
        }
      ) ||
      null;

    if(current){
      return current;
    }

    if(classes.length){
      current =
        classes[0];

      setCurrentClassId(
        current.id
      );

      return current;
    }

    return null;
  }


  function getCurrentClassName(){
    const current =
      getCurrentClassRecord();

    if(current){
      return normalizeClassName(
        current.name
      );
    }

    return normalizeClassName(
      localStorage.getItem(
        LAST_CLASS_NAME_KEY
      ) ||
      ""
    );
  }


  function ensureLegacyClassOption(name){
    const select =
      getElement(
        "schoolClassSelect"
      );

    const clean =
      normalizeClassName(name);

    if(
      !select ||
      !clean
    ){
      return;
    }

    let option =
      Array
        .from(
          select.options ||
          []
        )
        .find(
          function(row){
            return (
              String(
                row.value ||
                ""
              ).trim() ===
              clean
            );
          }
        );

    if(!option){
      option =
        document
          .createElement(
            "option"
          );

      option.value =
        clean;

      option.textContent =
        clean;

      option.dataset
        .bociteCustomClass =
          "1";

      select.appendChild(
        option
      );
    }

    if(
      select.value !==
      clean
    ){
      select.value =
        clean;

      try{
        select.dispatchEvent(
          new Event(
            "change",
            {
              bubbles:true
            }
          )
        );
      }catch(error){
        /* rien */
      }
    }
  }


  function createClass(name){
    const clean =
      normalizeClassName(name);

    if(!clean){
      return null;
    }

    const classes =
      loadClasses();

    const existing =
      classes.find(
        function(row){
          return (
            normalizeClassName(
              row.name
            ).toLowerCase() ===
            clean.toLowerCase()
          );
        }
      );

    if(existing){
      creatingNewClass =
        false;

      setCurrentClassId(
        existing.id
      );

      localStorage.setItem(
        LAST_CLASS_NAME_KEY,
        existing.name
      );

      ensureLegacyClassOption(
        existing.name
      );

      return existing;
    }

    const row = {
      id:
        createId(
          "school-class"
        ),

      name:
        clean,

      createdAt:
        new Date()
          .toISOString(),

      updatedAt:
        new Date()
          .toISOString()
    };

    classes.push(row);

    saveClasses(classes);

    creatingNewClass =
      false;

    setCurrentClassId(
      row.id
    );

    localStorage.setItem(
      LAST_CLASS_NAME_KEY,
      row.name
    );

    ensureLegacyClassOption(
      row.name
    );

    return row;
  }


  function renameCurrentClass(name){
    const clean =
      normalizeClassName(name);

    if(!clean){
      return null;
    }

    const classes =
      loadClasses();

    const id =
      getCurrentClassId();

    const index =
      classes.findIndex(
        function(row){
          return (
            row.id === id
          );
        }
      );

    if(index < 0){
      return createClass(clean);
    }

    classes[index] =
      Object.assign(
        {},
        classes[index],
        {
          name:
            clean,

          updatedAt:
            new Date()
              .toISOString()
        }
      );

    saveClasses(classes);

    localStorage.setItem(
      LAST_CLASS_NAME_KEY,
      clean
    );

    ensureLegacyClassOption(
      clean
    );

    return classes[index];
  }


  function selectClass(id){
    const row =
      getClassById(id);

    if(!row){
      return null;
    }

    creatingNewClass =
      false;

    setCurrentClassId(
      row.id
    );

    localStorage.setItem(
      LAST_CLASS_NAME_KEY,
      row.name
    );

    ensureLegacyClassOption(
      row.name
    );

    const input =
      getElement(
        "bociteSchoolClassNameInput"
      );

    if(input){
      input.value =
        row.name;
    }

    refreshClassControls();
    refreshSimplePanel();

    return row;
  }


  function saveClassFromInput(){
    const input =
      getElement(
        "bociteSchoolClassNameInput"
      );

    if(!input){
      return null;
    }

    const clean =
      normalizeClassName(
        input.value
      );

    if(!clean){
      alert(
        "Indiquez le nom de la classe."
      );

      input.focus();

      return null;
    }

    const current =
      creatingNewClass
        ? null
        : getCurrentClassRecord();

    const saved =
      current
        ? renameCurrentClass(clean)
        : createClass(clean);

    if(saved){
      input.value =
        saved.name;

      refreshClassControls();
      refreshSimplePanel();
    }

    return saved;
  }


  function beginNewClass(){
    creatingNewClass =
      true;

    setCurrentClassId("");

    const input =
      getElement(
        "bociteSchoolClassNameInput"
      );

    if(input){
      input.value = "";
      input.focus();
    }

    refreshClassControls();
  }


  function refreshClassControls(){
    const select =
      getElement(
        "bociteSchoolClassList"
      );

    const input =
      getElement(
        "bociteSchoolClassNameInput"
      );

    const current =
      getCurrentClassRecord();

    const classes =
      loadClasses();

    if(select){
      select.innerHTML = "";

      const placeholder =
        document
          .createElement(
            "option"
          );

      placeholder.value = "";

      placeholder.textContent =
        classes.length
          ? "Choisir une classe enregistrée"
          : "Aucune classe enregistrée";

      select.appendChild(
        placeholder
      );

      classes.forEach(
        function(row){
          const option =
            document
              .createElement(
                "option"
              );

          option.value =
            row.id;

          option.textContent =
            row.name;

          select.appendChild(
            option
          );
        }
      );

      select.value =
        current
          ? current.id
          : "";
    }

    if(
      input &&
      document.activeElement !==
        input
    ){
      input.value =
        creatingNewClass
          ? ""
          : current
            ? current.name
            : normalizeClassName(
                localStorage.getItem(
                  LAST_CLASS_NAME_KEY
                ) ||
                ""
              );
    }
  }


  function ensureInitialClass(){
    if(creatingNewClass){
      return null;
    }

    const current =
      getCurrentClassRecord();

    if(current){
      ensureLegacyClassOption(
        current.name
      );

      return current;
    }

    const last =
      normalizeClassName(
        localStorage.getItem(
          LAST_CLASS_NAME_KEY
        ) ||
        ""
      );

    if(last){
      return createClass(last);
    }

    const legacySelect =
      getElement(
        "schoolClassSelect"
      );

    const legacyName =
      normalizeClassName(
        legacySelect &&
        legacySelect.value
          ? legacySelect.value
          : ""
      );

    if(legacyName){
      return createClass(
        legacyName
      );
    }

    return null;
  }


  /* =====================================================
     PROFIL VOCAL — INVISIBLE POUR LE PROFESSEUR
     ===================================================== */

  function getVoiceProfile(){
    try{
      if(
        window.BociteSchoolParentalGuard &&
        typeof window
          .BociteSchoolParentalGuard
          .getCurrentVoiceProfile ===
            "function"
      ){
        return (
          window
            .BociteSchoolParentalGuard
            .getCurrentVoiceProfile() ||
          {}
        );
      }

    }catch(error){
      /* rien */
    }

    return {};
  }


  function getVoiceProfileFor(
    accountId
  ){
    try{
      if(
        window.BociteSchoolParentalGuard &&
        typeof window
          .BociteSchoolParentalGuard
          .getVoiceProfileFor ===
            "function"
      ){
        return (
          window
            .BociteSchoolParentalGuard
            .getVoiceProfileFor(
              accountId
            ) ||
          {}
        );
      }

    }catch(error){
      /* rien */
    }

    return getVoiceProfile();
  }


  function voicePermissionAvailable(){
    try{
      return Boolean(
        window.BociteSchoolParentalGuard &&
        typeof window
          .BociteSchoolParentalGuard
          .canUseCurrentVoice ===
            "function" &&
        window
          .BociteSchoolParentalGuard
          .canUseCurrentVoice()
      );

    }catch(error){
      return false;
    }
  }


  function refreshVoiceContext(){
    const profile =
      getVoiceProfile();

    selectedVoiceGender =
      normalizeGender(
        profile.syntheticVoice ||
        profile.voiceGender
      );

    pendingChildAccountId =
      String(
        profile.accountId ||
        ""
      ).trim();

    if(
      voicePermissionAvailable()
    ){
      selectedVoiceMode =
        "real";

      return;
    }

    if(
      selectedVoiceGender ===
        "girl"
    ){
      selectedVoiceMode =
        "synthetic-girl";

      return;
    }

    if(
      selectedVoiceGender ===
        "boy"
    ){
      selectedVoiceMode =
        "synthetic-boy";

      return;
    }

    selectedVoiceMode =
      "synthetic-pending";
  }


  /* =====================================================
     VOIX SYNTHÉTIQUE
     ===================================================== */

  function getSyntheticProfile(kind){
    const cls =
      getCurrentClassName()
        .toUpperCase();

    let boyPitch =
      1.10;

    if(
      /CP|CE1/.test(cls)
    ){
      boyPitch =
        1.22;
    }
    else if(
      /CE2|CM1/.test(cls)
    ){
      boyPitch =
        1.18;
    }
    else if(
      /CM2|6E/.test(cls)
    ){
      boyPitch =
        1.14;
    }
    else if(
      /5E|4E/.test(cls)
    ){
      boyPitch =
        1.08;
    }

    return {
      pitch:
        kind === "girl"
          ? Math.min(
              2,
              boyPitch + 0.18
            )
          : boyPitch,

      rate:
        0.92
    };
  }


  function getGenderedFrenchVoice(kind){
    if(
      !window.speechSynthesis
    ){
      return null;
    }

    const frenchVoices =
      window
        .speechSynthesis
        .getVoices()
        .filter(
          function(voice){
            return (
              voice.lang &&
              voice.lang
                .toLowerCase()
                .startsWith("fr")
            );
          }
        );

    const femaleNames =
      /denise|hortense|julie|sylvie|marie|amelie|amélie|audrey|virginie|eloise|éloise|celine|céline|female|femme|fémin/i;

    const maleNames =
      /henri|paul|claude|alain|thomas|hugo|remy|rémy|mathieu|gerard|gérard|loic|loïc|nicolas|male|homme|masculin/i;

    const matcher =
      kind === "girl"
        ? femaleNames
        : maleNames;

    return (
      frenchVoices.find(
        function(voice){
          return matcher.test(
            String(
              voice.name ||
              ""
            ) +
            " " +
            String(
              voice.voiceURI ||
              ""
            )
          );
        }
      ) ||
      null
    );
  }


  function speakSyntheticChild(
    kind,
    text
  ){
    if(
      !window.speechSynthesis ||
      typeof window
        .SpeechSynthesisUtterance !==
          "function"
    ){
      alert(
        "La voix synthétique n'est pas disponible sur cet appareil."
      );

      return false;
    }

    const gender =
      normalizeGender(kind);

    if(!gender){
      alert(
        "Le profil vocal de cet enfant doit d'abord être confirmé dans la fiche parentale."
      );

      return false;
    }

    const chosenVoice =
      getGenderedFrenchVoice(
        gender
      );

    if(!chosenVoice){
      alert(
        gender === "girl"
          ? "Aucune voix française féminine adaptée n'est disponible sur cet appareil."
          : "Aucune voix française masculine adaptée n'est disponible sur cet appareil."
      );

      return false;
    }

    const phrase =
      String(text || "")
        .trim();

    if(!phrase){
      return false;
    }

    const profile =
      getSyntheticProfile(
        gender
      );

    const utterance =
      new SpeechSynthesisUtterance(
        phrase
      );

    utterance.lang =
      "fr-FR";

    utterance.voice =
      chosenVoice;

    utterance.rate =
      profile.rate;

    utterance.pitch =
      profile.pitch;

    utterance.volume =
      1;

    window
      .speechSynthesis
      .cancel();

    window
      .speechSynthesis
      .speak(
        utterance
      );

    return true;
  }

   /* =====================================================
     STYLE + MASQUAGE DE L'ANCIENNE INTERFACE
     ===================================================== */

  function installStyles(){
    if(
      getElement(
        "bociteSchoolSimpleStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "bociteSchoolSimpleStyles";

    style.textContent = `

      #schoolVoicePermissionPanel,
      #schoolRecordVoiceBtn,
      #schoolStopRecordVoiceBtn,
      #schoolPlayRecordedVoiceBtn,
      #schoolDeleteRecordedVoiceBtn,
      #schoolRecordedVoiceStatus,
      #playChild,
      #playFemale{
        display:none !important;
      }

      #modalBody.bociteSchoolClean p,
      #modalBody.bociteSchoolClean li,
      #modalBody.bociteSchoolClean .muted{
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.5 !important;
      }

      .bociteSchoolSimpleTitle{
        color:#2f5d46 !important;
        font-size:17px !important;
        font-weight:700 !important;
        line-height:1.35 !important;
      }

      .bociteSchoolSimpleText{
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.5 !important;
      }

      .bociteSchoolSimpleButton{
        display:block;
        width:100%;
        box-sizing:border-box;
        margin-top:10px;
        padding:12px;
        border:2px solid rgba(0,0,0,.10);
        border-radius:11px;
        background:#efe4d3;
        color:#111111;
        font-size:16px;
        font-weight:700;
        cursor:pointer;
      }

      .bociteSchoolSimpleSecondary{
        background:#ffffff;
      }

      .bociteSchoolClassField{
        display:block;
        width:100%;
        box-sizing:border-box;
        margin-top:7px;
        padding:11px;
        border:1px solid #aaa;
        border-radius:9px;
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
      }

      #bociteSchoolSimpleProgress{
        width:100%;
        height:12px;
        overflow:hidden;
        border-radius:999px;
        background:#e5e5e5;
        margin-top:12px;
      }

      #bociteSchoolSimpleProgressBar{
        width:0%;
        height:100%;
        background:#2f5d46;
        transition:width .25s linear;
      }

    `;

    document.head.appendChild(
      style
    );
  }


  function hideLegacyVoiceInterface(){
    const body =
      getElement(
        "modalBody"
      );

    if(!body){
      return;
    }

    body.classList.add(
      "bociteSchoolClean"
    );

    const nodes =
      body.querySelectorAll(
        "h1,h2,h3,h4,strong,b,div,p,span"
      );

    nodes.forEach(
      function(node){
        if(
          node.closest(
            "#bociteSchoolSimpleVoicePanel"
          )
        ){
          return;
        }

        const text =
          String(
            node.textContent ||
            ""
          )
          .replace(
            /\s+/g,
            " "
          )
          .trim()
          .toLowerCase();

        if(
          text ===
            "voix réelle de l’élève (si accord)" ||
          text ===
            "voix réelle de l'élève (si accord)" ||
          text ===
            "voix réelle de l’élève" ||
          text ===
            "voix réelle de l'élève"
        ){
          node.style.display =
            "none";
        }
      }
    );
  }


  /* =====================================================
     ENREGISTREMENT
     ===================================================== */

  function stopTracks(){
    if(activeStream){
      try{
        activeStream
          .getTracks()
          .forEach(
            function(track){
              track.stop();
            }
          );
      }catch(error){
        /* rien */
      }
    }

    activeStream =
      null;
  }


  function clearTimer(){
    if(timerId){
      window.clearInterval(
        timerId
      );
    }

    timerId =
      null;
  }


  function resetRecorderState(){
    clearTimer();
    stopTracks();

    recorder =
      null;

    audioChunks =
      [];

    startedAt =
      0;
  }


  function revokeObjectUrl(){
    if(objectUrl){
      try{
        URL.revokeObjectURL(
          objectUrl
        );
      }catch(error){
        /* rien */
      }
    }

    objectUrl =
      "";
  }


  function closeOverlay(){
    if(
      recorder &&
      recorder.state ===
        "recording"
    ){
      try{
        recorder.onstop =
          null;

        recorder.stop();
      }catch(error){
        /* rien */
      }
    }

    resetRecorderState();

    const overlay =
      getElement(
        OVERLAY_ID
      );

    if(overlay){
      overlay.remove();
    }

    revokeObjectUrl();
  }


  function createOverlay(){
    closeOverlay();

    const overlay =
      document.createElement(
        "div"
      );

    overlay.id =
      OVERLAY_ID;

    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:1000010",
      "overflow:auto",
      "box-sizing:border-box",
      "padding:14px 10px 30px",
      "background:rgba(0,0,0,.55)",
      "font-family:Arial,sans-serif"
    ].join(";");

    overlay.innerHTML = `

      <div
        style="
          width:100%;
          max-width:620px;
          margin:16px auto;
          box-sizing:border-box;
          padding:18px 16px;
          border:2px solid #2f5d46;
          border-radius:15px;
          background:#fffdf7;
        "
      >

        <div
          style="
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:12px;
          "
        >

          <div
            id="bociteSchoolSimpleOverlayTitle"
            class="bociteSchoolSimpleTitle"
          >
            Mot du jour
          </div>

          <button
            id="bociteSchoolSimpleClose"
            type="button"
            aria-label="Fermer"
            style="
              width:42px;
              height:42px;
              border:0;
              border-radius:12px;
              background:#fff;
              font-size:26px;
              cursor:pointer;
            "
          >
            ×
          </button>

        </div>

        <div
          id="bociteSchoolSimpleContent"
          class="bociteSchoolSimpleText"
          style="margin-top:16px;"
        >
        </div>

      </div>

    `;

    document.body.appendChild(
      overlay
    );

    const close =
      getElement(
        "bociteSchoolSimpleClose"
      );

    if(close){
      close.onclick =
        closeOverlay;
    }
  }


  function getRecorderOptions(){
    if(!window.MediaRecorder){
      return null;
    }

    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus"
    ];

    if(
      typeof MediaRecorder
        .isTypeSupported ===
          "function"
    ){
      for(
        const mimeType
        of candidates
      ){
        if(
          MediaRecorder
            .isTypeSupported(
              mimeType
            )
        ){
          return {
            mimeType:mimeType
          };
        }
      }
    }

    return {};
  }


  function updateRecordingTimer(){
    const timer =
      getElement(
        "bociteSchoolSimpleTimer"
      );

    const bar =
      getElement(
        "bociteSchoolSimpleProgressBar"
      );

    if(
      !timer ||
      !bar
    ){
      return;
    }

    const elapsed =
      Date.now() -
      startedAt;

    timer.textContent =
      formatTime(
        elapsed
      ) +
      " / 02:00";

    bar.style.width =
      Math.min(
        100,
        (
          elapsed /
          MAX_RECORDING_MS
        ) *
        100
      ) +
      "%";

    if(
      elapsed >=
      MAX_RECORDING_MS
    ){
      stopRecording();
    }
  }


  function showRecordingError(message){
    const content =
      getElement(
        "bociteSchoolSimpleContent"
      );

    if(!content){
      return;
    }

    content.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle"
      >
        Enregistrement interrompu
      </div>

      <p>
        ${escapeHtml(message)}
      </p>

      <button
        id="bociteSchoolSimpleRetry"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        Recommencer
      </button>

    `;

    const retry =
      getElement(
        "bociteSchoolSimpleRetry"
      );

    if(retry){
      retry.onclick =
        startRecording;
    }
  }


  function prepareCurrentClass(){
    const saved =
      saveClassFromInput();

    if(!saved){
      return null;
    }

    pendingClassId =
      saved.id;

    pendingClassName =
      saved.name;

    ensureLegacyClassOption(
      saved.name
    );

    return saved;
  }


  async function startRecording(){
    typedFallback =
      false;

    const currentClass =
      prepareCurrentClass();

    if(!currentClass){
      return;
    }

    refreshVoiceContext();

    if(
      !navigator.mediaDevices ||
      typeof navigator
        .mediaDevices
        .getUserMedia !==
          "function" ||
      !window.MediaRecorder
    ){
      alert(
        "L'enregistrement vocal n'est pas disponible sur cet appareil."
      );

      return;
    }

    pendingText =
      getCurrentWordText();

    pendingBlob =
      null;

    pendingAudioData =
      "";

    createOverlay();

    const content =
      getElement(
        "bociteSchoolSimpleContent"
      );

    content.innerHTML =
      "<p>Préparation du microphone…</p>";

    try{
      activeStream =
        await navigator
          .mediaDevices
          .getUserMedia({
            audio:true
          });

      const options =
        getRecorderOptions();

      if(options === null){
        throw new Error(
          "MediaRecorder indisponible"
        );
      }

      recorder =
        new MediaRecorder(
          activeStream,
          options
        );

      audioChunks =
        [];

      recorder.ondataavailable =
        function(event){
          if(
            event.data &&
            event.data.size > 0
          ){
            audioChunks.push(
              event.data
            );
          }
        };

      recorder.onerror =
        function(event){
          console.error(
            "Bo'CitéArt — erreur enregistrement :",
            event
          );

          resetRecorderState();
        };

      recorder.onstop =
        function(){
          clearTimer();

          const mimeType =
            (
              recorder &&
              recorder.mimeType
            ) ||
            (
              audioChunks[0] &&
              audioChunks[0].type
            ) ||
            "audio/webm";

          const blob =
            new Blob(
              audioChunks,
              {
                type:mimeType
              }
            );

          stopTracks();

          recorder =
            null;

          if(
            !blob ||
            blob.size === 0
          ){
            showRecordingError(
              "Aucun son n'a été enregistré. Recommencez simplement."
            );

            return;
          }

          pendingBlob =
            blob;

          showRecordingReview();
        };

      content.innerHTML = `

        <div
          class="bociteSchoolSimpleTitle"
        >
          Enregistrement en cours
        </div>

        <p>
          Classe :
          <strong>
            ${escapeHtml(
              pendingClassName
            )}
          </strong>
        </p>

        <p>
          L'enfant parle normalement.
          L'enregistrement s'arrête
          automatiquement après 2 minutes.
        </p>

        <div
          id="bociteSchoolSimpleTimer"
          style="
            margin-top:18px;
            text-align:center;
            color:#2f5d46;
            font-size:24px;
            font-weight:700;
          "
        >
          00:00 / 02:00
        </div>

        <div
          id="bociteSchoolSimpleProgress"
        >
          <div
            id="bociteSchoolSimpleProgressBar"
          >
          </div>
        </div>

        <button
          id="bociteSchoolSimpleStop"
          type="button"
          class="bociteSchoolSimpleButton"
        >
          ■ Arrêter et écouter
        </button>

      `;

      const stop =
        getElement(
          "bociteSchoolSimpleStop"
        );

      if(stop){
        stop.onclick =
          stopRecording;
      }

      startedAt =
        Date.now();

      recorder.start(
        250
      );

      timerId =
        window.setInterval(
          updateRecordingTimer,
          250
        );

      updateRecordingTimer();

    }catch(error){
      console.error(
        "Bo'CitéArt — microphone :",
        error
      );

      resetRecorderState();

      showRecordingError(
        "Le microphone n'a pas pu être utilisé. Vérifiez son autorisation dans le navigateur puis recommencez."
      );
    }
  }


  function stopRecording(){
    if(
      recorder &&
      recorder.state ===
        "recording"
    ){
      try{
        recorder.stop();
      }catch(error){
        resetRecorderState();

        showRecordingError(
          "L'enregistrement n'a pas pu être arrêté correctement."
        );
      }
    }
  }


  /* =====================================================
     ÉCOUTER ET VALIDER
     ===================================================== */

  function showRecordingReview(){
    const content =
      getElement(
        "bociteSchoolSimpleContent"
      );

    if(
      !content ||
      !pendingBlob
    ){
      return;
    }

    refreshVoiceContext();

    revokeObjectUrl();

    objectUrl =
      URL.createObjectURL(
        pendingBlob
      );

    const parentOk =
      voicePermissionAvailable();

    content.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle"
      >
        Écouter et valider
      </div>

      <p>
        Classe :
        <strong>
          ${escapeHtml(
            pendingClassName
          )}
        </strong>
      </p>

      <p>
        Écoutez simplement
        l'enregistrement avant validation.
      </p>

      <audio
        id="bociteSchoolSimpleAudio"
        controls
        preload="metadata"
        style="
          display:block;
          width:100%;
          margin-top:15px;
        "
      >
      </audio>

      <label
        for="bociteSchoolSimpleVolume"
        style="
          display:block;
          margin-top:15px;
          color:#111;
          font-size:14px;
          font-weight:400;
        "
      >
        Volume d'écoute
      </label>

      <input
        id="bociteSchoolSimpleVolume"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value="1"
        style="
          width:100%;
          margin-top:8px;
        "
      >

      <button
        id="bociteSchoolSimpleValidateAudio"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        ✓ C'est bon — choisir le jour
      </button>

      <button
        id="bociteSchoolSimpleRetryAudio"
        type="button"
        class="
          bociteSchoolSimpleButton
          bociteSchoolSimpleSecondary
        "
      >
        Recommencer
      </button>

    `;

    const audio =
      getElement(
        "bociteSchoolSimpleAudio"
      );

    const volume =
      getElement(
        "bociteSchoolSimpleVolume"
      );

    if(audio){
      audio.src =
        objectUrl;

      audio.load();
    }

    if(
      audio &&
      volume
    ){
      volume.oninput =
        function(){
          audio.volume =
            Number(
              volume.value
            );
        };
    }

    const validate =
      getElement(
        "bociteSchoolSimpleValidateAudio"
      );

    if(validate){
      validate.onclick =
        function(){
          if(parentOk){
            selectedVoiceMode =
              "real";

            convertPendingAudio();

            return;
          }

          /*
             Pas d'autorisation :
             l'enfant a pu écouter sa vraie prise,
             mais celle-ci n'est pas conservée.
          */

          refreshVoiceContext();

          if(audio){
            audio.pause();
          }

          revokeObjectUrl();

          pendingBlob =
            null;

          pendingAudioData =
            "";

          showCalendarStep();
        };
    }

    const retry =
      getElement(
        "bociteSchoolSimpleRetryAudio"
      );

    if(retry){
      retry.onclick =
        function(){
          if(audio){
            audio.pause();
          }

          revokeObjectUrl();

          pendingBlob =
            null;

          pendingAudioData =
            "";

          startRecording();
        };
    }
  }


  function convertPendingAudio(){
    if(!pendingBlob){
      return;
    }

    const reader =
      new FileReader();

    reader.onloadend =
      function(){
        pendingAudioData =
          String(
            reader.result ||
            ""
          );

        if(!pendingAudioData){
          showRecordingError(
            "L'enregistrement n'a pas pu être préparé."
          );

          return;
        }

        showCalendarStep();
      };

    reader.onerror =
      function(){
        showRecordingError(
          "L'enregistrement n'a pas pu être préparé."
        );
      };

    reader.readAsDataURL(
      pendingBlob
    );
  }


  /* =====================================================
     SOLUTION ÉCRITE
     ===================================================== */

  function openWrittenWordFallback(){
    typedFallback =
      true;

    const currentClass =
      prepareCurrentClass();

    if(!currentClass){
      return;
    }

    refreshVoiceContext();

    pendingText =
      pendingText ||
      getCurrentWordText();

    pendingBlob =
      null;

    pendingAudioData =
      "";

    createOverlay();

    const content =
      getElement(
        "bociteSchoolSimpleContent"
      );

    content.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle"
      >
        Écrire la phrase
      </div>

      <p>
        Classe :
        <strong>
          ${escapeHtml(
            pendingClassName
          )}
        </strong>
      </p>

      <p>
        Utilisez cette solution
        si le microphone ne fonctionne pas.
      </p>

      <textarea
        id="bociteSchoolWrittenText"
        rows="4"
        maxlength="500"
        style="
          display:block;
          width:100%;
          box-sizing:border-box;
          margin-top:14px;
          padding:12px;
          border:2px solid #2f5d46;
          border-radius:10px;
          background:#fff;
          color:#111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          resize:vertical;
        "
      >${escapeHtml(
        pendingText
      )}</textarea>

      <button
        id="bociteSchoolWrittenPreview"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        ▶ Écouter
      </button>

      <button
        id="bociteSchoolWrittenValidate"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        ✓ C'est bon — choisir le jour
      </button>

    `;

    const field =
      getElement(
        "bociteSchoolWrittenText"
      );

    const preview =
      getElement(
        "bociteSchoolWrittenPreview"
      );

    const validate =
      getElement(
        "bociteSchoolWrittenValidate"
      );

    if(preview){
      preview.onclick =
        function(){
          pendingText =
            String(
              field &&
              field.value
                ? field.value
                : ""
            ).trim();

          if(!pendingText){
            alert(
              "Écrivez d'abord la phrase."
            );

            return;
          }

          refreshVoiceContext();

          speakSyntheticChild(
            selectedVoiceGender,
            pendingText
          );
        };
    }

    if(validate){
      validate.onclick =
        function(){
          pendingText =
            String(
              field &&
              field.value
                ? field.value
                : ""
            ).trim();

          if(!pendingText){
            alert(
              "Écrivez d'abord la phrase."
            );

            return;
          }

          refreshVoiceContext();

          /*
             Une phrase écrite utilise
             forcément la voix synthétique.
          */

          if(
            selectedVoiceGender ===
              "girl"
          ){
            selectedVoiceMode =
              "synthetic-girl";
          }
          else if(
            selectedVoiceGender ===
              "boy"
          ){
            selectedVoiceMode =
              "synthetic-boy";
          }
          else{
            selectedVoiceMode =
              "synthetic-pending";
          }

          showCalendarStep();
        };
    }
  }


  /* =====================================================
     CALENDRIER SCOLAIRE
     ===================================================== */

  function easterSunday(year){
    const a =
      year % 19;

    const b =
      Math.floor(
        year / 100
      );

    const c =
      year % 100;

    const d =
      Math.floor(
        b / 4
      );

    const e =
      b % 4;

    const f =
      Math.floor(
        (b + 8) / 25
      );

    const g =
      Math.floor(
        (b - f + 1) / 3
      );

    const h =
      (
        19 * a +
        b -
        d -
        g +
        15
      ) % 30;

    const i =
      Math.floor(
        c / 4
      );

    const k =
      c % 4;

    const l =
      (
        32 +
        2 * e +
        2 * i -
        h -
        k
      ) % 7;

    const m =
      Math.floor(
        (
          a +
          11 * h +
          22 * l
        ) /
        451
      );

    const month =
      Math.floor(
        (
          h +
          l -
          7 * m +
          114
        ) /
        31
      );

    const day =
      (
        (
          h +
          l -
          7 * m +
          114
        ) %
        31
      ) + 1;

    return new Date(
      year,
      month - 1,
      day
    );
  }


  function addDays(date, days){
    const copy =
      new Date(
        date.getTime()
      );

    copy.setDate(
      copy.getDate() +
      days
    );

    return copy;
  }


  function isFrenchPublicHoliday(iso){
    const parts =
      iso.split("-");

    const date =
      new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
      );

    const year =
      date.getFullYear();

    const fixed = [
      year + "-01-01",
      year + "-05-01",
      year + "-05-08",
      year + "-07-14",
      year + "-08-15",
      year + "-11-01",
      year + "-11-11",
      year + "-12-25"
    ];

    const easter =
      easterSunday(
        year
      );

    const movable = [
      localDateToIso(
        addDays(
          easter,
          1
        )
      ),

      localDateToIso(
        addDays(
          easter,
          39
        )
      ),

      localDateToIso(
        addDays(
          easter,
          50
        )
      )
    ];

    return (
      fixed.includes(
        iso
      ) ||
      movable.includes(
        iso
      )
    );
  }


  async function isOfficialSchoolHoliday(iso){
    const endpoint =
      new URL(
        "https://data.education.gouv.fr/" +
        "api/explore/v2.1/catalog/datasets/" +
        "fr-en-calendrier-scolaire/records"
      );

    endpoint.searchParams.set(
      "limit",
      "20"
    );

    endpoint.searchParams.set(
      "refine",
      'zones:"Zone ' +
      getSchoolZone() +
      '"'
    );

    endpoint.searchParams.set(
      "where",
      'start_date <= "' +
      iso +
      '" AND end_date >= "' +
      iso +
      '"'
    );

    const response =
      await fetch(
        endpoint.toString(),
        {
          headers:{
            Accept:
              "application/json"
          }
        }
      );

    if(!response.ok){
      throw new Error(
        "Calendrier scolaire indisponible"
      );
    }

    const data =
      await response.json();

    return Boolean(
      data &&
      Array.isArray(
        data.results
      ) &&
      data.results.length > 0
    );
  }


  function showCalendarStep(){
    const content =
      getElement(
        "bociteSchoolSimpleContent"
      );

    const title =
      getElement(
        "bociteSchoolSimpleOverlayTitle"
      );

    if(!content){
      return;
    }

    if(title){
      title.textContent =
        "Programmer le Mot du jour";
    }

    const canGoBack =
      typedFallback ||
      (
        selectedVoiceMode ===
          "real" &&
        Boolean(
          pendingBlob
        )
      );

    content.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle"
      >
        Choisir le jour
      </div>

      <p>
        Classe :
        <strong>
          ${escapeHtml(
            pendingClassName
          )}
        </strong>
      </p>

      <p>
        Choisissez le jour
        où ce Mot du jour
        doit être présenté
        dans cette classe.
      </p>

      <p>
        Les programmations
        des autres classes
        restent totalement séparées.
      </p>

      <p>
        Seuls les jours de classe
        sont acceptés.
      </p>

      <label
        for="bociteSchoolSimpleDate"
        style="
          display:block;
          margin-top:16px;
          color:#111;
          font-size:14px;
          font-weight:400;
        "
      >
        Date choisie
      </label>

      <input
        id="bociteSchoolSimpleDate"
        type="date"
        min="${todayIso()}"
        max="${maxDateIso()}"
        value="${todayIso()}"
        style="
          display:block;
          width:100%;
          box-sizing:border-box;
          margin-top:8px;
          padding:12px;
          border:2px solid #2f5d46;
          border-radius:10px;
          background:#fff;
          color:#111;
          font-size:16px;
          font-weight:400;
        "
      >

      <div
        id="bociteSchoolSimpleDateMessage"
        style="
          display:none;
          margin-top:12px;
          padding:12px;
          border-left:5px solid #2f5d46;
          background:#fff;
          color:#111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        "
      >
      </div>

      <button
        id="bociteSchoolSimpleSchedule"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        ✓ Programmer pour cette classe
      </button>

      ${
        canGoBack
          ? `
            <button
              id="bociteSchoolSimpleBack"
              type="button"
              class="
                bociteSchoolSimpleButton
                bociteSchoolSimpleSecondary
              "
            >
              ← Revenir à l'étape précédente
            </button>
          `
          : ""
      }

    `;

    const schedule =
      getElement(
        "bociteSchoolSimpleSchedule"
      );

    if(schedule){
      schedule.onclick =
        validateScheduleDate;
    }

    const back =
      getElement(
        "bociteSchoolSimpleBack"
      );

    if(back){
      back.onclick =
        function(){
          if(typedFallback){
            openWrittenWordFallback();

            return;
          }

          showRecordingReview();
        };
    }
  }


  async function validateScheduleDate(){
    const field =
      getElement(
        "bociteSchoolSimpleDate"
      );

    const message =
      getElement(
        "bociteSchoolSimpleDateMessage"
      );

    const button =
      getElement(
        "bociteSchoolSimpleSchedule"
      );

    const iso =
      String(
        field &&
        field.value
          ? field.value
          : ""
      );

    function showMessage(text){
      if(!message){
        return;
      }

      message.style.display =
        "block";

      message.textContent =
        text;
    }

    if(!iso){
      showMessage(
        "Choisissez une date."
      );

      return;
    }

    const parts =
      iso.split("-");

    const date =
      new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
      );

    if(
      date.getDay() === 0 ||
      date.getDay() === 6
    ){
      showMessage(
        "Cette date tombe un week-end. Choisissez un jour de classe."
      );

      return;
    }

    if(
      isFrenchPublicHoliday(
        iso
      )
    ){
      showMessage(
        "Cette date est un jour férié. Choisissez un autre jour."
      );

      return;
    }

    if(button){
      button.disabled =
        true;

      button.textContent =
        "Vérification du calendrier…";
    }

    try{
      const holiday =
        await isOfficialSchoolHoliday(
          iso
        );

      if(holiday){
        showMessage(
          "Cette date se situe pendant des vacances scolaires. Choisissez un jour de classe."
        );

        if(button){
          button.disabled =
            false;

          button.textContent =
            "✓ Programmer pour cette classe";
        }

        return;
      }

      const saved =
        saveSchedule(
          iso
        );

      if(saved !== false){
        showScheduleSuccess(
          iso
        );
      }

    }catch(error){
      console.error(
        "Bo'CitéArt — calendrier scolaire :",
        error
      );

      showMessage(
        "Le calendrier scolaire officiel n'a pas pu être vérifié. Réessayez dans quelques instants."
      );

      if(button){
        button.disabled =
          false;

        button.textContent =
          "✓ Programmer pour cette classe";
      }
    }
  }

   /* =====================================================
     PROGRAMMATIONS MULTI-CLASSES
     ===================================================== */

  function migrateLegacySchedules(){
    const currentRaw =
      localStorage.getItem(
        SCHEDULE_KEY
      );

    if(currentRaw !== null){
      const current =
        safeParse(
          currentRaw,
          []
        );

      return Array.isArray(current)
        ? current
        : [];
    }

    const legacy =
      safeParse(
        localStorage.getItem(
          LEGACY_SCHEDULE_KEY
        ),
        []
      );

    if(!Array.isArray(legacy) || !legacy.length){
      localStorage.setItem(
        SCHEDULE_KEY,
        "[]"
      );

      return [];
    }

    const classes =
      loadClasses();

    function ensureMigrationClass(name){
      const clean =
        normalizeClassName(
          name || "Classe"
        ) || "Classe";

      let row =
        classes.find(
          function(item){
            return (
              normalizeClassName(
                item.name
              ).toLowerCase() ===
              clean.toLowerCase()
            );
          }
        );

      if(!row){
        row = {
          id:createId(
            "school-class"
          ),
          name:clean,
          createdAt:
            new Date()
              .toISOString(),
          updatedAt:
            new Date()
              .toISOString()
        };

        classes.push(row);
      }

      return row;
    }

    const migrated =
      legacy
        .filter(Boolean)
        .map(
          function(item){
            const className =
              normalizeClassName(
                item.className ||
                item.class ||
                "Classe"
              ) || "Classe";

            const classRow =
              ensureMigrationClass(
                className
              );

            return Object.assign(
              {},
              item,
              {
                classId:
                  classRow.id,
                className:
                  classRow.name,
                class:
                  classRow.name
              }
            );
          }
        );

    saveClasses(classes);

    localStorage.setItem(
      SCHEDULE_KEY,
      JSON.stringify(
        migrated
      )
    );

    return migrated;
  }


  function loadSchedule(){
    const data =
      migrateLegacySchedules();

    return Array.isArray(data)
      ? data
      : [];
  }


  function saveScheduleRows(rows){
    localStorage.setItem(
      SCHEDULE_KEY,
      JSON.stringify(
        Array.isArray(rows)
          ? rows
          : []
      )
    );
  }


  function getDisplayClassName(row){
    if(
      row &&
      row.classId
    ){
      const current =
        getClassById(
          row.classId
        );

      if(current){
        return normalizeClassName(
          current.name
        );
      }
    }

    return normalizeClassName(
      row &&
      (
        row.className ||
        row.class
      )
    ) || "Classe";
  }


  function saveSchedule(iso){
    refreshVoiceContext();

    if(
      !pendingClassId ||
      !pendingClassName
    ){
      const current =
        prepareCurrentClass();

      if(!current){
        return false;
      }
    }

    const rows =
      loadSchedule();

    const filtered =
      rows.filter(
        function(item){
          return !(
            item &&
            item.classId ===
              pendingClassId &&
            item.date ===
              iso
          );
        }
      );

    filtered.push({
      id:
        createId(
          "school-word"
        ),

      classId:
        pendingClassId,

      className:
        pendingClassName,

      class:
        pendingClassName,

      date:
        iso,

      text:
        pendingText ||
        getCurrentWordText(),

      childAccountId:
        pendingChildAccountId,

      voiceMode:
        selectedVoiceMode,

      voiceGender:
        selectedVoiceGender,

      parentalVoiceAuthorized:
        selectedVoiceMode ===
          "real" &&
        voicePermissionAvailable(),

      typedFallback:
        Boolean(
          typedFallback
        ),

      audioData:
        selectedVoiceMode ===
          "real"
          ? pendingAudioData
          : "",

      mimeType:
        selectedVoiceMode ===
          "real" &&
        pendingBlob
          ? pendingBlob.type
          : "",

      status:
        iso === todayIso()
          ? "ready-today"
          : "scheduled",

      createdAt:
        new Date()
          .toISOString()
    });

    try{
      saveScheduleRows(
        filtered
      );
    }catch(error){
      console.error(
        "Bo'CitéArt — programmation impossible :",
        error
      );

      alert(
        "La programmation n'a pas pu être enregistrée."
      );

      return false;
    }

    activateTodaySchedule();

    return true;
  }


  function resolveGenderForRow(row){
    const stored =
      normalizeGender(
        row &&
        row.voiceGender
      );

    if(stored){
      return stored;
    }

    const profile =
      getVoiceProfileFor(
        row &&
        row.childAccountId
      );

    return normalizeGender(
      profile.syntheticVoice ||
      profile.voiceGender
    );
  }


  function getTodaySchedule(){
    const current =
      getCurrentClassRecord();

    if(!current){
      return null;
    }

    const today =
      todayIso();

    return (
      loadSchedule()
        .find(
          function(item){
            return (
              item &&
              item.classId ===
                current.id &&
              item.date ===
                today
            );
          }
        ) ||
      null
    );
  }


  function activateTodaySchedule(){
    const current =
      getCurrentClassRecord();

    if(!current){
      return null;
    }

    ensureLegacyClassOption(
      current.name
    );

    const today =
      todayIso();

    const rows =
      loadSchedule();

    const index =
      rows.findIndex(
        function(item){
          return (
            item &&
            item.classId ===
              current.id &&
            item.date ===
              today
          );
        }
      );

    if(index < 0){
      return null;
    }

    let row =
      rows[index];

    const currentProfile =
      getVoiceProfileFor(
        row.childAccountId
      );

    const currentPermission =
      Boolean(
        currentProfile.realVoiceAuthorized ===
          true
      );

    const confirmedGender =
      normalizeGender(
        currentProfile.syntheticVoice ||
        currentProfile.voiceGender ||
        row.voiceGender
      );

    let changed =
      false;

    if(
      row.voiceMode ===
        "real" &&
      !currentPermission
    ){
      row =
        Object.assign(
          {},
          row,
          {
            voiceMode:
              confirmedGender ===
                "girl"
                ? "synthetic-girl"
                : confirmedGender ===
                    "boy"
                  ? "synthetic-boy"
                  : "synthetic-pending",

            voiceGender:
              confirmedGender,

            parentalVoiceAuthorized:
              false,

            audioData:
              "",

            mimeType:
              ""
          }
        );

      changed =
        true;
    }
    else if(
      row.voiceMode ===
        "synthetic-pending" &&
      confirmedGender
    ){
      row =
        Object.assign(
          {},
          row,
          {
            voiceMode:
              confirmedGender ===
                "girl"
                ? "synthetic-girl"
                : "synthetic-boy",

            voiceGender:
              confirmedGender
          }
        );

      changed =
        true;
    }

    const currentClassName =
      normalizeClassName(
        current.name
      );

    if(
      row.className !==
        currentClassName ||
      row.class !==
        currentClassName
    ){
      row =
        Object.assign(
          {},
          row,
          {
            className:
              currentClassName,

            class:
              currentClassName
          }
        );

      changed =
        true;
    }

    if(changed){
      rows[index] =
        row;

      try{
        saveScheduleRows(
          rows
        );
      }catch(error){
        /* rien */
      }
    }

    const text =
      String(
        row.text ||
        ""
      ).trim();

    const wordInput =
      getElement(
        "schoolWordInput"
      );

    const wordDisplay =
      getElement(
        "schoolWordDisplay"
      );

    if(
      wordInput &&
      text &&
      String(
        wordInput.value ||
        ""
      ).trim() !==
        text
    ){
      wordInput.value =
        text;
    }

    if(
      wordDisplay &&
      text
    ){
      const expected =
        "« " +
        text +
        " »";

      if(
        String(
          wordDisplay.textContent ||
          ""
        ).trim() !==
          expected
      ){
        wordDisplay.textContent =
          expected;
      }
    }

    const realVoiceAllowed =
      row.voiceMode ===
        "real" &&
      Boolean(
        row.audioData
      ) &&
      row.parentalVoiceAuthorized ===
        true &&
      currentPermission;

    let legacy =
      {};

    try{
      const raw =
        localStorage.getItem(
          LEGACY_VOICE_KEY
        );

      legacy =
        raw
          ? JSON.parse(raw)
          : {};
    }catch(error){
      legacy =
        {};
    }

    if(realVoiceAllowed){
      legacy[currentClassName] = {
        class:
          currentClassName,

        audioData:
          row.audioData,

        mimeType:
          row.mimeType ||
          "audio/webm",

        scheduledDate:
          row.date,

        savedAt:
          Date.now()
      };
    }
    else if(
      legacy &&
      legacy[currentClassName]
    ){
      delete legacy[
        currentClassName
      ];
    }

    try{
      localStorage.setItem(
        LEGACY_VOICE_KEY,
        JSON.stringify(
          legacy
        )
      );
    }catch(error){
      /* rien */
    }

    return row;
  }


  function playTodaySchedule(){
    const row =
      activateTodaySchedule();

    if(!row){
      return false;
    }

    const profile =
      getVoiceProfileFor(
        row.childAccountId
      );

    const realVoiceAllowed =
      row.voiceMode ===
        "real" &&
      Boolean(
        row.audioData
      ) &&
      row.parentalVoiceAuthorized ===
        true &&
      profile.realVoiceAuthorized ===
        true;

    if(realVoiceAllowed){
      try{
        const audio =
          new Audio(
            row.audioData
          );

        const promise =
          audio.play();

        if(
          promise &&
          typeof promise.catch ===
            "function"
        ){
          promise.catch(
            function(error){
              console.error(
                "Bo'CitéArt — lecture du Mot du jour :",
                error
              );
            }
          );
        }

        return true;

      }catch(error){
        console.error(
          "Bo'CitéArt — lecture du Mot du jour :",
          error
        );
      }
    }

    return speakSyntheticChild(
      resolveGenderForRow(
        row
      ),

      String(
        row.text ||
        ""
      ).trim()
    );
  }


  function validateTodayWord(){
    const current =
      getCurrentClassRecord();

    if(!current){
      alert(
        "Choisissez d'abord la classe."
      );

      return;
    }

    ensureLegacyClassOption(
      current.name
    );

    const row =
      activateTodaySchedule();

    if(!row){
      alert(
        "Aucun Mot du jour n'est programmé pour aujourd'hui dans cette classe."
      );

      return;
    }

    const wordInput =
      getElement(
        "schoolWordInput"
      );

    const existingButton =
      getElement(
        "schoolSaveBtn"
      );

    if(
      wordInput &&
      row.text
    ){
      wordInput.value =
        String(
          row.text
        ).trim();
    }

    if(!existingButton){
      alert(
        "La validation du Mot du jour n'est pas disponible."
      );

      return;
    }

    if(existingButton.disabled){
      alert(
        "Le Mot du jour a déjà été validé aujourd'hui pour cette classe."
      );

      refreshSimplePanel();

      return;
    }

    existingButton.click();

    window.setTimeout(
      refreshSimplePanel,
      100
    );
  }


  function getUpcomingSchedules(){
    const today =
      todayIso();

    return loadSchedule()
      .filter(
        function(row){
          return (
            row &&
            row.date &&
            row.date >= today
          );
        }
      )
      .sort(
        function(a, b){
          if(a.date !== b.date){
            return String(a.date)
              .localeCompare(
                String(b.date)
              );
          }

          return getDisplayClassName(a)
            .localeCompare(
              getDisplayClassName(b),
              "fr",
              {
                sensitivity:"base"
              }
            );
        }
      );
  }


  function buildScheduleListHtml(){
    const rows =
      getUpcomingSchedules();

    if(!rows.length){
      return `
        <div
          class="bociteSchoolSimpleText"
          style="margin-top:8px;"
        >
          Aucune programmation enregistrée pour les prochains jours.
        </div>
      `;
    }

    return rows
      .map(
        function(row){
          return `
            <div
              style="
                margin-top:8px;
                padding:10px;
                border:1px solid #dedede;
                border-radius:9px;
                background:#fff;
              "
            >
              <div
                style="
                  color:#2f5d46;
                  font-size:14px;
                  font-weight:700;
                "
              >
                ${escapeHtml(
                  getDisplayClassName(
                    row
                  )
                )}
              </div>

              <div
                class="bociteSchoolSimpleText"
                style="margin-top:3px;"
              >
                ${escapeHtml(
                  formatDateFr(
                    row.date
                  )
                )}
              </div>
            </div>
          `;
        }
      )
      .join("");
  }


  function showScheduleSuccess(iso){
    const content =
      getElement(
        "bociteSchoolSimpleContent"
      );

    const title =
      getElement(
        "bociteSchoolSimpleOverlayTitle"
      );

    if(title){
      title.textContent =
        "Mot du jour prêt";
    }

    if(!content){
      return;
    }

    content.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle"
      >
        C'est enregistré
      </div>

      <p>
        Le Mot du jour a été préparé pour :
      </p>

      <p
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
        "
      >
        ${escapeHtml(
          pendingClassName
        )}
      </p>

      <p>
        ${escapeHtml(
          formatDateFr(
            iso
          )
        )}
      </p>

      <button
        id="bociteSchoolPrepareAnotherClass"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        Préparer une autre classe
      </button>

      <button
        id="bociteSchoolSimpleFinish"
        type="button"
        class="
          bociteSchoolSimpleButton
          bociteSchoolSimpleSecondary
        "
      >
        Terminer
      </button>

    `;

    const another =
      getElement(
        "bociteSchoolPrepareAnotherClass"
      );

    if(another){
      another.onclick =
        function(){
          closeOverlay();

          beginNewClass();

          refreshSimplePanel();

          const input =
            getElement(
              "bociteSchoolClassNameInput"
            );

          if(input){
            input.focus();
          }
        };
    }

    const finish =
      getElement(
        "bociteSchoolSimpleFinish"
      );

    if(finish){
      finish.onclick =
        function(){
          closeOverlay();

          refreshSimplePanel();
        };
    }
  }


  /* =====================================================
     PANNEAU PROFESSEUR
     ===================================================== */

  function hideLegacyClassControl(){
    const select =
      getElement(
        "schoolClassSelect"
      );

    if(select){
      select.style.display =
        "none";
    }

    const body =
      getElement(
        "modalBody"
      );

    if(!body){
      return;
    }

    const label =
      body.querySelector(
        'label[for="schoolClassSelect"]'
      );

    if(label){
      label.style.display =
        "none";
    }
  }


  function refreshSimplePanel(){
    ensureInitialClass();

    refreshClassControls();

    refreshVoiceContext();

    hideLegacyVoiceInterface();

    hideLegacyClassControl();

    const icon =
      getElement(
        "bociteSchoolSimpleVoiceIndicator"
      );

    const status =
      getElement(
        "bociteSchoolSimpleVoiceStatus"
      );

    const scheduleList =
      getElement(
        "bociteSchoolAllSchedules"
      );

    if(icon){
      icon.style.color =
        voicePermissionAvailable()
          ? "#2f5d46"
          : "#9a9a9a";
    }

    if(scheduleList){
      scheduleList.innerHTML =
        buildScheduleListHtml();
    }

    const current =
      getCurrentClassRecord();

    if(!current){
      if(status){
        status.textContent =
          "Enregistrez une classe pour commencer.";
      }

      return;
    }

    ensureLegacyClassOption(
      current.name
    );

    activateTodaySchedule();

    if(!status){
      return;
    }

    const today =
      getTodaySchedule();

    if(!today){
      status.innerHTML = `
        <div>
          Aucun Mot du jour n'est programmé pour aujourd'hui dans cette classe.
        </div>
      `;

      return;
    }

    const existingButton =
      getElement(
        "schoolSaveBtn"
      );

    const alreadyValidated =
      Boolean(
        existingButton &&
        existingButton.disabled
      );

    status.innerHTML = `

      <div
        style="
          color:#2f5d46;
          font-size:14px;
          font-weight:700;
        "
      >
        ${escapeHtml(
          current.name
        )}
      </div>

      <div
        style="margin-top:5px;"
      >
        ${
          alreadyValidated
            ? "✓ Le Mot du jour a été validé aujourd'hui pour cette classe."
            : "Le Mot du jour est prêt pour aujourd'hui dans cette classe."
        }
      </div>

      <button
        id="bociteSchoolPlayToday"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        ▶ Écouter le Mot du jour
      </button>

      ${
        alreadyValidated
          ? ""
          : `
            <button
              id="bociteSchoolValidateToday"
              type="button"
              class="bociteSchoolSimpleButton"
            >
              ✓ Valider pour cette classe
            </button>
          `
      }

    `;

    const play =
      getElement(
        "bociteSchoolPlayToday"
      );

    const validate =
      getElement(
        "bociteSchoolValidateToday"
      );

    if(play){
      play.onclick =
        playTodaySchedule;
    }

    if(validate){
      validate.onclick =
        validateTodayWord;
    }
  }


  function findLegacyHeading(){
    const body =
      getElement(
        "modalBody"
      );

    if(!body){
      return null;
    }

    const nodes =
      body.querySelectorAll(
        "h1,h2,h3,h4,strong,b,div,p,span"
      );

    for(const node of nodes){
      if(
        node.closest(
          "#bociteSchoolSimpleVoicePanel"
        )
      ){
        continue;
      }

      const text =
        String(
          node.textContent ||
          ""
        )
        .replace(
          /\s+/g,
          " "
        )
        .trim()
        .toLowerCase();

      if(
        text ===
          "voix réelle de l’élève (si accord)" ||
        text ===
          "voix réelle de l'élève (si accord)" ||
        text ===
          "voix réelle de l’élève" ||
        text ===
          "voix réelle de l'élève"
      ){
        return node;
      }
    }

    return null;
  }


  function installSimplePanel(){
    const modalTitle =
      getElement(
        "modalTitle"
      );

    const modalBody =
      getElement(
        "modalBody"
      );

    if(
      !modalTitle ||
      !modalBody ||
      String(
        modalTitle.textContent ||
        ""
      ).trim() !==
        "École"
    ){
      return;
    }

    ensureInitialClass();

    hideLegacyVoiceInterface();

    hideLegacyClassControl();

    if(
      getElement(
        "bociteSchoolSimpleVoicePanel"
      )
    ){
      refreshSimplePanel();

      return;
    }

    const oldRecordButton =
      getElement(
        "schoolRecordVoiceBtn"
      );

    const heading =
      findLegacyHeading();

    const anchor =
      heading ||
      oldRecordButton;

    if(
      !anchor ||
      !anchor.parentElement
    ){
      return;
    }

    const panel =
      document.createElement(
        "div"
      );

    panel.id =
      "bociteSchoolSimpleVoicePanel";

    panel.style.cssText = [
      "margin:14px 0",
      "padding:14px",
      "border:1px solid #dedede",
      "border-radius:12px",
      "background:#ffffff",
      "box-sizing:border-box",
      "color:#111111",
      "font-size:14px",
      "font-weight:400",
      "line-height:1.5"
    ].join(";");

    panel.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle"
      >
        Classe
      </div>

      <p
        class="bociteSchoolSimpleText"
        style="margin:6px 0 0 0;"
      >
        Indiquez librement la classe et l'établissement, par exemple :
        CM2 A — École Voltaire — Wattignies.
        Le dernier nom enregistré restera prérempli la prochaine fois.
      </p>

      <label
        for="bociteSchoolClassList"
        class="bociteSchoolSimpleText"
        style="display:block;margin-top:12px;"
      >
        Classes déjà enregistrées
      </label>

      <select
        id="bociteSchoolClassList"
        class="bociteSchoolClassField"
      >
      </select>

      <label
        for="bociteSchoolClassNameInput"
        class="bociteSchoolSimpleText"
        style="display:block;margin-top:12px;"
      >
        Nom de la classe
      </label>

      <input
        id="bociteSchoolClassNameInput"
        class="bociteSchoolClassField"
        type="text"
        maxlength="120"
        autocomplete="off"
        placeholder="CM2 A — École Voltaire — Wattignies"
      >

      <button
        id="bociteSchoolSaveClassName"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        ✓ Enregistrer ce nom de classe
      </button>

      <button
        id="bociteSchoolNewClass"
        type="button"
        class="
          bociteSchoolSimpleButton
          bociteSchoolSimpleSecondary
        "
      >
        + Ajouter une autre classe
      </button>

      <div
        style="
          margin-top:22px;
          padding-top:16px;
          border-top:1px solid #dedede;
        "
      >

        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
          "
        >

          <div
            class="bociteSchoolSimpleTitle"
          >
            Préparer le Mot du jour
          </div>

          <span
            id="bociteSchoolSimpleVoiceIndicator"
            aria-label="Statut de la vraie voix"
            style="
              color:#9a9a9a;
              font-size:22px;
              font-weight:700;
              line-height:1;
            "
          >
            ✓
          </span>

        </div>

        <p
          class="bociteSchoolSimpleText"
          style="margin:8px 0 0 0;"
        >
          Le professeur peut enregistrer la vraie voix de l’élève.
          L’autorisation des parents ou du responsable légal concernant
          la diffusion de la voix de l’enfant est traitée en amont.
          Si la vraie voix est autorisée, elle est conservée.
          Si elle ne l’est pas, elle est remplacée automatiquement
          par une voix synthétique correspondant au profil confirmé
          par le parent ou le responsable légal.
        </p>

        <div
          style="
            display:grid;
            grid-template-columns:46px 1fr;
            gap:10px;
            margin-top:20px;
            align-items:start;
          "
        >

          <div
            style="
              color:#2f5d46;
              font-size:30px;
              font-weight:700;
              line-height:1;
            "
          >
            ①
          </div>

          <div>

            <div
              class="bociteSchoolSimpleTitle"
            >
              Enregistrer la phrase
            </div>

            <p
              class="bociteSchoolSimpleText"
              style="margin:6px 0 0 0;"
            >
              L'enfant parle normalement puis écoute exactement
              ce qu'il vient d'enregistrer.
            </p>

          </div>

        </div>

        <button
          id="bociteSchoolSimpleStart"
          type="button"
          class="bociteSchoolSimpleButton"
        >
          🎙 Enregistrer
        </button>

        <button
          id="bociteSchoolSimpleWrite"
          type="button"
          class="
            bociteSchoolSimpleButton
            bociteSchoolSimpleSecondary
          "
        >
          ✍ Écrire la phrase à la place
        </button>

        <div
          class="bociteSchoolSimpleText"
          style="margin-top:8px;"
        >
          Enregistrement : 2 minutes maximum, avec arrêt automatique.
        </div>

        <div
          style="
            display:grid;
            grid-template-columns:46px 1fr;
            gap:10px;
            margin-top:22px;
            align-items:start;
          "
        >

          <div
            style="
              color:#2f5d46;
              font-size:30px;
              font-weight:700;
              line-height:1;
            "
          >
            ②
          </div>

          <div>

            <div
              class="bociteSchoolSimpleTitle"
            >
              Écouter et valider
            </div>

            <p
              class="bociteSchoolSimpleText"
              style="margin:6px 0 0 0;"
            >
              Écoutez puis validez ou recommencez simplement.
            </p>

          </div>

        </div>

        <div
          style="
            display:grid;
            grid-template-columns:46px 1fr;
            gap:10px;
            margin-top:22px;
            align-items:start;
          "
        >

          <div
            style="
              color:#2f5d46;
              font-size:30px;
              font-weight:700;
              line-height:1;
            "
          >
            ③
          </div>

          <div>

            <div
              class="bociteSchoolSimpleTitle"
            >
              Choisir le jour
            </div>

            <p
              class="bociteSchoolSimpleText"
              style="margin:6px 0 0 0;"
            >
              Chaque classe possède sa propre programmation.
              Vous pouvez donc préparer plusieurs classes à la suite
              pour la même matinée ou pour des jours différents.
            </p>

          </div>

        </div>

        <div
          id="bociteSchoolSimpleVoiceStatus"
          class="bociteSchoolSimpleText"
          style="
            margin-top:18px;
            padding-top:12px;
            border-top:1px solid #dedede;
          "
        >
        </div>

      </div>

      <div
        style="
          margin-top:22px;
          padding-top:16px;
          border-top:1px solid #dedede;
        "
      >

        <div
          class="bociteSchoolSimpleTitle"
        >
          Programmations enregistrées
        </div>

        <div
          id="bociteSchoolAllSchedules"
        >
        </div>

      </div>

    `;

    anchor.parentElement
      .insertBefore(
        panel,
        anchor
      );

    const classList =
      getElement(
        "bociteSchoolClassList"
      );

    const classInput =
      getElement(
        "bociteSchoolClassNameInput"
      );

    const saveClassButton =
      getElement(
        "bociteSchoolSaveClassName"
      );

    const newClassButton =
      getElement(
        "bociteSchoolNewClass"
      );

    const start =
      getElement(
        "bociteSchoolSimpleStart"
      );

    const write =
      getElement(
        "bociteSchoolSimpleWrite"
      );

    if(classList){
      classList.onchange =
        function(){
          const id =
            String(
              classList.value ||
              ""
            ).trim();

          if(id){
            selectClass(id);
          }
        };
    }

    if(classInput){
      classInput.addEventListener(
        "change",
        function(){
          if(
            normalizeClassName(
              classInput.value
            )
          ){
            saveClassFromInput();
          }
        }
      );

      classInput.addEventListener(
        "keydown",
        function(event){
          if(event.key === "Enter"){
            event.preventDefault();

            saveClassFromInput();
          }
        }
      );
    }

    if(saveClassButton){
      saveClassButton.onclick =
        saveClassFromInput;
    }

    if(newClassButton){
      newClassButton.onclick =
        beginNewClass;
    }

    if(start){
      start.onclick =
        startRecording;
    }

    if(write){
      write.onclick =
        openWrittenWordFallback;
    }

    refreshClassControls();

    hideLegacyVoiceInterface();

    hideLegacyClassControl();

    refreshSimplePanel();
  }


  /* =====================================================
     OBSERVATION
     ===================================================== */

  const observer =
    new MutationObserver(
      function(){
        const title =
          getElement(
            "modalTitle"
          );

        if(
          !title ||
          String(
            title.textContent ||
            ""
          ).trim() !==
            "École"
        ){
          return;
        }

        hideLegacyVoiceInterface();

        hideLegacyClassControl();

        if(
          !getElement(
            "bociteSchoolSimpleVoicePanel"
          )
        ){
          window.setTimeout(
            installSimplePanel,
            0
          );
        }
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
        refreshSimplePanel,
        50
      );
    }
  );


  document.addEventListener(
    "bociteart:school-child-profile-updated",
    function(){
      window.setTimeout(
        refreshSimplePanel,
        50
      );
    }
  );


  /* =====================================================
     API
     ===================================================== */

  window.BociteSchoolWordSimple = {
    start:
      startRecording,

    stop:
      stopRecording,

    refresh:
      refreshSimplePanel,

    getSchedule:
      loadSchedule,

    getClasses:
      loadClasses,

    selectClass:
      selectClass,

    newClass:
      beginNewClass,

    saveCurrentClass:
      saveClassFromInput,

    activateToday:
      activateTodaySchedule,

    playToday:
      playTodaySchedule,

    validateToday:
      validateTodayWord,

    close:
      closeOverlay
  };


  installStyles();

  window.setTimeout(
    installSimplePanel,
    100
  );


  console.log(
    "✅ Mot du jour — multi-classes + autorisation parentale chargés"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
