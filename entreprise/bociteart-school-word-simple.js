/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — ÉCOLE & JEUNES
   MOT DU JOUR — PARCOURS PROFESSEUR 3 ÉTAPES

   1 — Enregistrer
   2 — Écouter et valider
   3 — Choisir le jour

   Aucun choix Fille / Garçon par le professeur.
   La vraie voix n'est conservée que si elle est autorisée.
   Sinon la prise temporaire est supprimée après validation.
   ========================================================= */

(function initBociteSchoolWordSimple(){
  "use strict";

  if(window.BociteSchoolWordSimple){
    return;
  }

  const OVERLAY_ID =
    "bociteSchoolSimpleRecorderOverlay";

  const SCHEDULE_KEY =
    "bociteart_school_voice_schedule_v1";

  const LEGACY_VOICE_KEY =
    "bociteart_school_voice_v1";

  const SCHOOL_CONFIG_KEY =
    "bociteart_school_config_v1";

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
  let pendingClass = "";
  let pendingText = "";
  let pendingChildAccountId = "";
  let selectedVoiceMode =
    "synthetic-pending";
  let selectedVoiceGender = "";
  let typedFallback = false;

  /* =====================================================
     OUTILS
     ===================================================== */

  function el(id){
    return document.getElementById(id);
  }

  function two(n){
    return String(n).padStart(2,"0");
  }

  function isoDate(d){
    return (
      d.getFullYear() +
      "-" +
      two(d.getMonth()+1) +
      "-" +
      two(d.getDate())
    );
  }

  function todayIso(){
    return isoDate(new Date());
  }

  function maxDateIso(){
    const d = new Date();

    d.setDate(
      d.getDate() +
      MAX_ADVANCE_DAYS
    );

    return isoDate(d);
  }

  function formatTime(ms){
    const s =
      Math.max(
        0,
        Math.floor(ms/1000)
      );

    return (
      two(
        Math.floor(s/60)
      ) +
      ":" +
      two(s%60)
    );
  }

  function formatDateFr(iso){
    const p =
      String(iso || "")
      .split("-");

    if(p.length !== 3){
      return iso || "";
    }

    return new Date(
      Number(p[0]),
      Number(p[1])-1,
      Number(p[2])
    ).toLocaleDateString(
      "fr-FR",
      {
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
      }
    );
  }

  function getCurrentClass(){
    const s =
      el("schoolClassSelect");

    return String(
      s && s.value
        ? s.value
        : "Classe"
    ).trim();
  }

  function getCurrentWordText(){
    const input =
      el("schoolWordInput");

    const direct =
      String(
        input && input.value
          ? input.value
          : ""
      ).trim();

    if(direct){
      return direct;
    }

    const display =
      String(
        el("schoolWordDisplay")
          ?.textContent ||
        ""
      ).trim();

    const m =
      display.match(
        /«\s*(.*?)\s*»/
      );

    return (
      m && m[1]
        ? m[1].trim()
        : (
            display ||
            "Je suis ravi aujourd’hui."
          )
    );
  }

  function getSchoolZone(){
    const s =
      el("schoolConfigZone");

    if(
      s &&
      s.value
    ){
      return String(
        s.value
      )
      .trim()
      .toUpperCase();
    }

    try{
      const raw =
        localStorage.getItem(
          SCHOOL_CONFIG_KEY
        );

      const cfg =
        raw
          ? JSON.parse(raw)
          : null;

      if(
        cfg &&
        cfg.zone
      ){
        return String(
          cfg.zone
        )
        .trim()
        .toUpperCase();
      }
    }catch(error){
      /* rien */
    }

    return "B";
  }

  function normalizeGender(value){
    const g =
      String(
        value ||
        ""
      )
      .trim()
      .toLowerCase();

    if(
      [
        "girl",
        "fille",
        "female"
      ].includes(g)
    ){
      return "girl";
    }

    if(
      [
        "boy",
        "garcon",
        "garçon",
        "male"
      ].includes(g)
    ){
      return "boy";
    }

    return "";
  }

  /* =====================================================
     PROFIL VOCAL EN AMONT
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
    const p =
      getVoiceProfile();

    selectedVoiceGender =
      normalizeGender(
        p.syntheticVoice ||
        p.voiceGender
      );

    pendingChildAccountId =
      String(
        p.accountId ||
        ""
      ).trim();

    if(
      voicePermissionAvailable()
    ){
      selectedVoiceMode =
        "real";
    }
    else if(
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
  }

  /* =====================================================
     VOIX SYNTHÉTIQUE
     ===================================================== */

  function getSyntheticProfile(
    kind
  ){
    const cls =
      getCurrentClass()
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

  function getGenderedFrenchVoice(
    kind
  ){
    if(
      !window.speechSynthesis
    ){
      return null;
    }

    const voices =
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

    const female =
      /denise|hortense|julie|sylvie|marie|amelie|amélie|audrey|virginie|eloise|éloise|celine|céline|female|femme|fémin/i;

    const male =
      /henri|paul|claude|alain|thomas|hugo|remy|rémy|mathieu|gerard|gérard|loic|loïc|nicolas|male|homme|masculin/i;

    const re =
      kind === "girl"
        ? female
        : male;

    return (
      voices.find(
        function(v){
          return re.test(
            String(
              v.name ||
              ""
            ) +
            " " +
            String(
              v.voiceURI ||
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
        "La voix synthétique de cet élève n'est pas encore disponible."
      );

      return false;
    }

    const voice =
      getGenderedFrenchVoice(
        gender
      );

    if(!voice){
      alert(
        gender === "girl"
          ? "Aucune voix française féminine adaptée n'est disponible sur cet appareil."
          : "Aucune voix française masculine adaptée n'est disponible sur cet appareil."
      );

      return false;
    }

    const phrase =
      String(
        text ||
        ""
      ).trim();

    if(!phrase){
      return false;
    }

    const p =
      getSyntheticProfile(
        gender
      );

    const u =
      new SpeechSynthesisUtterance(
        phrase
      );

    u.lang =
      "fr-FR";

    u.voice =
      voice;

    u.rate =
      p.rate;

    u.pitch =
      p.pitch;

    u.volume =
      1;

    window
      .speechSynthesis
      .cancel();

    window
      .speechSynthesis
      .speak(u);

    return true;
  }

  /* =====================================================
     STYLE + MASQUAGE ANCIEN SYSTÈME
     ===================================================== */

  function installStyles(){
    if(
      el(
        "bociteSchoolSimpleStyles"
      )
    ){
      return;
    }

    const s =
      document.createElement(
        "style"
      );

    s.id =
      "bociteSchoolSimpleStyles";

    s.textContent = `

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

      #modalBody.bociteSchoolClean,
      #modalBody.bociteSchoolClean p,
      #modalBody.bociteSchoolClean li,
      #modalBody.bociteSchoolClean .muted,
      #modalBody.bociteSchoolClean .box,
      #modalBody.bociteSchoolClean .miniField{
        color:#111 !important;
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
        color:#111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.5 !important;
      }

      .bociteSchoolSimpleButton{
        display:block;
        width:100%;
        box-sizing:border-box;
        margin-top:12px;
        padding:13px 12px;
        border:2px solid rgba(0,0,0,.10);
        border-radius:12px;
        background:#efe4d3;
        color:#111;
        font-size:16px;
        font-weight:700;
        cursor:pointer;
      }

      .bociteSchoolSimpleSecondary{
        background:#fff;
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
      s
    );
  }

  function hideLegacyVoiceInterface(){
    const body =
      el("modalBody");

    if(!body){
      return;
    }

    body.classList.add(
      "bociteSchoolClean"
    );

    body
      .querySelectorAll(
        "h1,h2,h3,h4,strong,b,div,p,span"
      )
      .forEach(
        function(node){

          if(
            node.closest(
              "#bociteSchoolSimpleVoicePanel"
            )
          ){
            return;
          }

          const t =
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
            t ===
              "voix réelle de l’élève (si accord)" ||
            t ===
              "voix réelle de l'élève (si accord)" ||
            t ===
              "voix réelle de l’élève" ||
            t ===
              "voix réelle de l'élève"
          ){
            node.style.display =
              "none";
          }

        }
      );
  }

  /* =====================================================
     MICRO
     ===================================================== */

  function stopTracks(){
    if(activeStream){
      try{
        activeStream
          .getTracks()
          .forEach(
            function(t){
              t.stop();
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
      clearInterval(
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
      el(OVERLAY_ID);

    if(overlay){
      overlay.remove();
    }

    revokeObjectUrl();
  }

  function createOverlay(){
    closeOverlay();

    const o =
      document.createElement(
        "div"
      );

    o.id =
      OVERLAY_ID;

    o.style.cssText =
      "position:fixed;" +
      "inset:0;" +
      "z-index:1000010;" +
      "overflow:auto;" +
      "box-sizing:border-box;" +
      "padding:14px 10px 30px;" +
      "background:rgba(0,0,0,.55);" +
      "font-family:Arial,sans-serif";

    o.innerHTML = `

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
          style="
            margin-top:16px;
          "
        >
        </div>

      </div>

    `;

    document.body.appendChild(
      o
    );

    el(
      "bociteSchoolSimpleClose"
    ).onclick =
      closeOverlay;
  }

  function getRecorderOptions(){
    if(
      !window.MediaRecorder
    ){
      return null;
    }

    const c = [
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
        const mime
        of c
      ){
        if(
          MediaRecorder
            .isTypeSupported(
              mime
            )
        ){
          return {
            mimeType:mime
          };
        }
      }
    }

    return {};
  }

  function updateRecordingTimer(){
    const timer =
      el(
        "bociteSchoolSimpleTimer"
      );

    const bar =
      el(
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
      formatTime(elapsed) +
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

  function showRecordingError(
    message
  ){
    const content =
      el(
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
        ${message}
      </p>

      <button
        id="bociteSchoolSimpleRetry"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        Recommencer
      </button>

    `;

    el(
      "bociteSchoolSimpleRetry"
    ).onclick =
      startRecording;
  }

  async function startRecording(){
    typedFallback =
      false;

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

    pendingClass =
      getCurrentClass();

    pendingText =
      getCurrentWordText();

    pendingBlob =
      null;

    pendingAudioData =
      "";

    createOverlay();

    el(
      "bociteSchoolSimpleContent"
    ).innerHTML =
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

      if(
        options ===
        null
      ){
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
        function(e){

          if(
            e.data &&
            e.data.size >
              0
          ){
            audioChunks.push(
              e.data
            );
          }

        };

      recorder.onerror =
        function(e){

          console.error(
            "Bo'CitéArt — erreur enregistrement :",
            e
          );

          resetRecorderState();

        };

      recorder.onstop =
        function(){

          clearTimer();

          const mime =
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
                type:mime
              }
            );

          stopTracks();

          recorder =
            null;

          if(
            !blob ||
            blob.size ===
              0
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

      el(
        "bociteSchoolSimpleContent"
      ).innerHTML = `

        <div
          class="bociteSchoolSimpleTitle"
        >
          Enregistrement en cours
        </div>

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

      el(
        "bociteSchoolSimpleStop"
      ).onclick =
        stopRecording;

      startedAt =
        Date.now();

      recorder.start(
        250
      );

      timerId =
        setInterval(
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
     ÉCOUTE ET VALIDATION
     ===================================================== */

  function showRecordingReview(){
    const content =
      el(
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
      el(
        "bociteSchoolSimpleAudio"
      );

    const volume =
      el(
        "bociteSchoolSimpleVolume"
      );

    audio.src =
      objectUrl;

    audio.load();

    volume.oninput =
      function(){

        audio.volume =
          Number(
            volume.value
          );

      };

    el(
      "bociteSchoolSimpleValidateAudio"
    ).onclick =
      function(){

        if(parentOk){

          selectedVoiceMode =
            "real";

          convertPendingAudio();

          return;

        }

        refreshVoiceContext();

        audio.pause();

        revokeObjectUrl();

        pendingBlob =
          null;

        pendingAudioData =
          "";

        showCalendarStep();

      };

    el(
      "bociteSchoolSimpleRetryAudio"
    ).onclick =
      function(){

        audio.pause();

        revokeObjectUrl();

        pendingBlob =
          null;

        pendingAudioData =
          "";

        startRecording();

      };
  }

  function convertPendingAudio(){
    if(!pendingBlob){
      return;
    }

    const r =
      new FileReader();

    r.onloadend =
      function(){

        pendingAudioData =
          String(
            r.result ||
            ""
          );

        if(
          !pendingAudioData
        ){
          showRecordingError(
            "L'enregistrement n'a pas pu être préparé."
          );

          return;
        }

        showCalendarStep();

      };

    r.onerror =
      function(){

        showRecordingError(
          "L'enregistrement n'a pas pu être préparé."
        );

      };

    r.readAsDataURL(
      pendingBlob
    );
  }

  /* =====================================================
     ÉCRIRE LA PHRASE
     ===================================================== */

  function openWrittenWordFallback(){
    typedFallback =
      true;

    refreshVoiceContext();

    pendingClass =
      getCurrentClass();

    pendingText =
      pendingText ||
      getCurrentWordText();

    pendingBlob =
      null;

    pendingAudioData =
      "";

    createOverlay();

    el(
      "bociteSchoolSimpleContent"
    ).innerHTML = `

      <div
        class="bociteSchoolSimpleTitle"
      >
        Écrire la phrase
      </div>

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
      >${pendingText}</textarea>

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
      el(
        "bociteSchoolWrittenText"
      );

    el(
      "bociteSchoolWrittenPreview"
    ).onclick =
      function(){

        pendingText =
          String(
            field.value ||
            ""
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

    el(
      "bociteSchoolWrittenValidate"
    ).onclick =
      function(){

        pendingText =
          String(
            field.value ||
            ""
          ).trim();

        if(!pendingText){

          alert(
            "Écrivez d'abord la phrase."
          );

          return;
        }

        refreshVoiceContext();

        if(
          selectedVoiceMode ===
            "real"
        ){
          selectedVoiceMode =
            selectedVoiceGender ===
              "girl"

              ? "synthetic-girl"

              : selectedVoiceGender ===
                  "boy"

                ? "synthetic-boy"

                : "synthetic-pending";
        }

        showCalendarStep();

      };
  }

  /* =====================================================
     CALENDRIER
     ===================================================== */

  function easterSunday(year){
    const a =
      year % 19;

    const b =
      Math.floor(
        year/100
      );

    const c =
      year % 100;

    const d =
      Math.floor(
        b/4
      );

    const e =
      b % 4;

    const f =
      Math.floor(
        (b+8)/25
      );

    const g =
      Math.floor(
        (b-f+1)/3
      );

    const h =
      (
        19*a +
        b -
        d -
        g +
        15
      ) % 30;

    const i =
      Math.floor(
        c/4
      );

    const k =
      c % 4;

    const l =
      (
        32 +
        2*e +
        2*i -
        h -
        k
      ) % 7;

    const m =
      Math.floor(
        (
          a +
          11*h +
          22*l
        ) /
        451
      );

    const month =
      Math.floor(
        (
          h +
          l -
          7*m +
          114
        ) /
        31
      );

    const day =
      (
        (
          h +
          l -
          7*m +
          114
        ) %
        31
      ) +
      1;

    return new Date(
      year,
      month-1,
      day
    );
  }

  function addDays(
    date,
    days
  ){
    const d =
      new Date(
        date.getTime()
      );

    d.setDate(
      d.getDate() +
      days
    );

    return d;
  }

  function isFrenchPublicHoliday(
    iso
  ){
    const p =
      iso.split("-");

    const d =
      new Date(
        Number(p[0]),
        Number(p[1])-1,
        Number(p[2])
      );

    const y =
      d.getFullYear();

    const fixed = [
      y+"-01-01",
      y+"-05-01",
      y+"-05-08",
      y+"-07-14",
      y+"-08-15",
      y+"-11-01",
      y+"-11-11",
      y+"-12-25"
    ];

    const easter =
      easterSunday(y);

    const movable = [
      isoDate(
        addDays(
          easter,
          1
        )
      ),
      isoDate(
        addDays(
          easter,
          39
        )
      ),
      isoDate(
        addDays(
          easter,
          50
        )
      )
    ];

    return (
      fixed.includes(iso) ||
      movable.includes(iso)
    );
  }

  async function isOfficialSchoolHoliday(
    iso
  ){
    const u =
      new URL(
        "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records"
      );

    u.searchParams.set(
      "limit",
      "20"
    );

    u.searchParams.set(
      "refine",
      'zones:"Zone ' +
      getSchoolZone() +
      '"'
    );

    u.searchParams.set(
      "where",
      'start_date <= "' +
      iso +
      '" AND end_date >= "' +
      iso +
      '"'
    );

    const r =
      await fetch(
        u.toString(),
        {
          headers:{
            Accept:
              "application/json"
          }
        }
      );

    if(!r.ok){
      throw new Error(
        "Calendrier scolaire indisponible"
      );
    }

    const data =
      await r.json();

    return Boolean(
      data &&
      Array.isArray(
        data.results
      ) &&
      data.results.length >
        0
    );
  }

  function showCalendarStep(){
    const content =
      el(
        "bociteSchoolSimpleContent"
      );

    if(!content){
      return;
    }

    pendingClass =
      pendingClass ||
      getCurrentClass();

    const title =
      el(
        "bociteSchoolSimpleOverlayTitle"
      );

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
        Le Mot du jour est prêt.
        Choisissez simplement le jour
        où il doit être présenté.
      </p>

      <p>
        Vous pouvez choisir aujourd'hui
        ou l'un des prochains jours,
        dans la limite d'une semaine.
      </p>

      <p>
        Les week-ends,
        jours fériés
        et vacances scolaires
        ne sont pas programmables.
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
        ✓ Programmer le Mot du jour
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

    el(
      "bociteSchoolSimpleSchedule"
    ).onclick =
      validateScheduleDate;

    const back =
      el(
        "bociteSchoolSimpleBack"
      );

    if(back){
      back.onclick =
        function(){

          if(typedFallback){
            openWrittenWordFallback();
          }
          else{
            showRecordingReview();
          }

        };
    }
  }

  async function validateScheduleDate(){
    const field =
      el(
        "bociteSchoolSimpleDate"
      );

    const message =
      el(
        "bociteSchoolSimpleDateMessage"
      );

    const button =
      el(
        "bociteSchoolSimpleSchedule"
      );

    const iso =
      String(
        field &&
        field.value
          ? field.value
          : ""
      );

    function show(text){
      if(message){
        message.style.display =
          "block";

        message.textContent =
          text;
      }
    }

    if(!iso){
      show(
        "Choisissez une date."
      );

      return;
    }

    const p =
      iso.split("-");

    const d =
      new Date(
        Number(p[0]),
        Number(p[1])-1,
        Number(p[2])
      );

    if(
      d.getDay() === 0 ||
      d.getDay() === 6
    ){
      show(
        "Cette date tombe un week-end. Choisissez un jour de classe."
      );

      return;
    }

    if(
      isFrenchPublicHoliday(
        iso
      )
    ){
      show(
        "Cette date est un jour férié. Choisissez un autre jour."
      );

      return;
    }

    button.disabled =
      true;

    button.textContent =
      "Vérification du calendrier…";

    try{
      if(
        await isOfficialSchoolHoliday(
          iso
        )
      ){
        show(
          "Cette date se situe pendant des vacances scolaires. Choisissez un jour de classe."
        );

        button.disabled =
          false;

        button.textContent =
          "✓ Programmer le Mot du jour";

        return;
      }

      if(
        saveSchedule(
          iso
        ) !== false
      ){
        showScheduleSuccess(
          iso
        );
      }

    }catch(error){

      console.error(
        "Bo'CitéArt — calendrier scolaire :",
        error
      );

      show(
        "Le calendrier scolaire officiel n'a pas pu être vérifié. Réessayez dans quelques instants."
      );

      button.disabled =
        false;

      button.textContent =
        "✓ Programmer le Mot du jour";
    }
  }

  /* =====================================================
     PROGRAMMATIONS
     ===================================================== */

  function loadSchedule(){
    try{
      const raw =
        localStorage.getItem(
          SCHEDULE_KEY
        );

      const data =
        raw
          ? JSON.parse(raw)
          : [];

      return Array.isArray(
        data
      )
        ? data
        : [];

    }catch(error){
      return [];
    }
  }

  function saveScheduleRows(
    rows
  ){
    localStorage.setItem(
      SCHEDULE_KEY,
      JSON.stringify(rows)
    );
  }

  function saveSchedule(
    iso
  ){
    refreshVoiceContext();

    const rows =
      loadSchedule();

    const currentClass =
      pendingClass ||
      getCurrentClass();

    const filtered =
      rows.filter(
        function(i){

          return !(
            i &&
            i.class ===
              currentClass &&
            i.date ===
              iso
          );

        }
      );

    filtered.push({

      id:
        "school-word-" +
        Date.now(),

      class:
        currentClass,

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

  function resolveGenderForRow(
    row
  ){
    const stored =
      normalizeGender(
        row &&
        row.voiceGender
      );

    if(stored){
      return stored;
    }

    const p =
      getVoiceProfileFor(
        row &&
        row.childAccountId
      );

    return normalizeGender(
      p.syntheticVoice ||
      p.voiceGender
    );
  }

  function getTodaySchedule(){
    const cls =
      getCurrentClass();

    const today =
      todayIso();

    return (
      loadSchedule()
        .find(
          function(i){

            return (
              i &&
              i.class ===
                cls &&
              i.date ===
                today
            );

          }
        ) ||
      null
    );
  }

  function activateTodaySchedule(){
    const cls =
      getCurrentClass();

    const today =
      todayIso();

    const rows =
      loadSchedule();

    const index =
      rows.findIndex(
        function(i){

          return (
            i &&
            i.class ===
              cls &&
            i.date ===
              today
          );

        }
      );

    if(index < 0){
      return null;
    }

    let row =
      rows[index];

    const p =
      getVoiceProfileFor(
        row.childAccountId
      );

    const currentPermission =
      Boolean(
        p.realVoiceAuthorized ===
          true
      );

    if(
      row.voiceMode ===
        "real" &&
      !currentPermission
    ){
      const gender =
        resolveGenderForRow(
          row
        );

      row =
        Object.assign(
          {},
          row,
          {
            voiceMode:
              gender === "girl"
                ? "synthetic-girl"
                : gender === "boy"
                  ? "synthetic-boy"
                  : "synthetic-pending",

            voiceGender:
              gender,

            parentalVoiceAuthorized:
              false,

            audioData:
              "",

            mimeType:
              ""
          }
        );

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

    const input =
      el(
        "schoolWordInput"
      );

    const display =
      el(
        "schoolWordDisplay"
      );

    if(
      input &&
      text &&
      String(
        input.value ||
        ""
      ).trim() !==
        text
    ){
      input.value =
        text;
    }

    if(
      display &&
      text
    ){
      const expected =
        "« " +
        text +
        " »";

      if(
        String(
          display.textContent ||
          ""
        ).trim() !==
          expected
      ){
        display.textContent =
          expected;
      }
    }

    const realAllowed =
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

    if(realAllowed){
      legacy[cls] = {

        class:
          cls,

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
      legacy[cls]
    ){
      delete legacy[cls];
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

    const p =
      getVoiceProfileFor(
        row.childAccountId
      );

    const realAllowed =
      row.voiceMode ===
        "real" &&
      Boolean(
        row.audioData
      ) &&
      row.parentalVoiceAuthorized ===
        true &&
      p.realVoiceAuthorized ===
        true;

    if(realAllowed){
      try{
        const a =
          new Audio(
            row.audioData
          );

        const promise =
          a.play();

        if(
          promise &&
          promise.catch
        ){
          promise.catch(
            function(e){

              console.error(
                "Bo'CitéArt — lecture du Mot du jour :",
                e
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
    const row =
      activateTodaySchedule();

    if(!row){
      alert(
        "Aucun Mot du jour n'est programmé pour aujourd'hui."
      );

      return;
    }

    const input =
      el(
        "schoolWordInput"
      );

    const button =
      el(
        "schoolSaveBtn"
      );

    if(
      input &&
      row.text
    ){
      input.value =
        String(
          row.text
        ).trim();
    }

    if(!button){
      alert(
        "La validation du Mot du jour n'est pas disponible."
      );

      return;
    }

    if(button.disabled){
      alert(
        "Le Mot du jour a déjà été validé aujourd'hui."
      );

      refreshSimplePanel();

      return;
    }

    button.click();

    setTimeout(
      refreshSimplePanel,
      100
    );
  }

  function showScheduleSuccess(
    iso
  ){
    const content =
      el(
        "bociteSchoolSimpleContent"
      );

    const title =
      el(
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
        ${formatDateFr(iso)}
      </p>

      <p>
        Classe :
        ${pendingClass}
      </p>

      <button
        id="bociteSchoolSimpleFinish"
        type="button"
        class="bociteSchoolSimpleButton"
      >
        Terminer
      </button>

    `;

    el(
      "bociteSchoolSimpleFinish"
    ).onclick =
      function(){

        closeOverlay();

        refreshSimplePanel();

      };
  }

  /* =====================================================
     PANNEAU PROFESSEUR
     ===================================================== */

  function refreshSimplePanel(){
    refreshVoiceContext();

    hideLegacyVoiceInterface();

    const icon =
      el(
        "bociteSchoolSimpleVoiceIndicator"
      );

    const status =
      el(
        "bociteSchoolSimpleVoiceStatus"
      );

    if(icon){
      icon.style.color =
        voicePermissionAvailable()
          ? "#2f5d46"
          : "#9a9a9a";
    }

    activateTodaySchedule();

    if(!status){
      return;
    }

    const today =
      getTodaySchedule();

    if(!today){
      status.textContent =
        "Aucun Mot du jour n'est programmé pour aujourd'hui.";

      return;
    }

    const oldButton =
      el(
        "schoolSaveBtn"
      );

    const done =
      Boolean(
        oldButton &&
        oldButton.disabled
      );

    status.innerHTML = `

      <div>

        ${
          done
            ? "✓ Le Mot du jour a été validé aujourd'hui."
            : "Le Mot du jour est prêt pour aujourd'hui."
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
        done
          ? ""
          : `
            <button
              id="bociteSchoolValidateToday"
              type="button"
              class="bociteSchoolSimpleButton"
            >
              ✓ Valider le Mot du jour
            </button>
          `
      }

    `;

    el(
      "bociteSchoolPlayToday"
    ).onclick =
      playTodaySchedule;

    const validate =
      el(
        "bociteSchoolValidateToday"
      );

    if(validate){
      validate.onclick =
        validateTodayWord;
    }
  }

  function findLegacyHeading(){
    const body =
      el(
        "modalBody"
      );

    if(!body){
      return null;
    }

    for(
      const node
      of body.querySelectorAll(
        "h1,h2,h3,h4,strong,b,div,p,span"
      )
    ){
      if(
        node.closest(
          "#bociteSchoolSimpleVoicePanel"
        )
      ){
        continue;
      }

      const t =
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
        t ===
          "voix réelle de l’élève (si accord)" ||
        t ===
          "voix réelle de l'élève (si accord)" ||
        t ===
          "voix réelle de l’élève" ||
        t ===
          "voix réelle de l'élève"
      ){
        return node;
      }
    }

    return null;
  }

  function installSimplePanel(){
    const title =
      el(
        "modalTitle"
      );

    const body =
      el(
        "modalBody"
      );

    if(
      !title ||
      !body ||
      String(
        title.textContent ||
        ""
      ).trim() !==
        "École"
    ){
      return;
    }

    hideLegacyVoiceInterface();

    if(
      el(
        "bociteSchoolSimpleVoicePanel"
      )
    ){
      refreshSimplePanel();

      return;
    }

    const oldRecord =
      el(
        "schoolRecordVoiceBtn"
      );

    const heading =
      findLegacyHeading();

    const anchor =
      heading ||
      oldRecord;

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

    panel.style.cssText =
      "margin:14px 0;" +
      "padding:14px;" +
      "border:1px solid #dedede;" +
      "border-radius:12px;" +
      "background:#fff;" +
      "box-sizing:border-box;" +
      "color:#111;" +
      "font-size:14px;" +
      "font-weight:400;" +
      "line-height:1.5";

    panel.innerHTML = `

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
            style="
              margin:6px 0 0 0;
            "
          >
            L'enfant parle normalement.
            Il pourra écouter exactement
            ce qu'il vient de dire.
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
        style="
          margin-top:8px;
        "
      >
        Enregistrement :
        2 minutes maximum,
        avec arrêt automatique.
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
            style="
              margin:6px 0 0 0;
            "
          >
            Après l'enregistrement,
            écoutez puis validez
            ou recommencez simplement.
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
            style="
              margin:6px 0 0 0;
            "
          >
            Après validation,
            le calendrier s'ouvre
            pour programmer le Mot du jour.
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

    `;

    anchor.parentElement
      .insertBefore(
        panel,
        anchor
      );

    el(
      "bociteSchoolSimpleStart"
    ).onclick =
      startRecording;

    el(
      "bociteSchoolSimpleWrite"
    ).onclick =
      openWrittenWordFallback;

    hideLegacyVoiceInterface();

    refreshSimplePanel();
  }

  /* =====================================================
     OBSERVATION
     ===================================================== */

  const observer =
    new MutationObserver(
      function(){

        const title =
          el(
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

        if(
          !el(
            "bociteSchoolSimpleVoicePanel"
          )
        ){
          setTimeout(
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
    "change",
    function(e){

      if(
        e.target &&
        e.target.id ===
          "schoolClassSelect"
      ){
        setTimeout(
          refreshSimplePanel,
          0
        );
      }

    },
    true
  );

  document.addEventListener(
    "bociteart:parent-permission-updated",
    function(){

      setTimeout(
        refreshSimplePanel,
        50
      );

    }
  );

  document.addEventListener(
    "bociteart:school-child-profile-updated",
    function(){

      setTimeout(
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

  setTimeout(
    installSimplePanel,
    100
  );

  console.log(
    "✅ Mot du jour — parcours professeur 3 étapes chargé"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
