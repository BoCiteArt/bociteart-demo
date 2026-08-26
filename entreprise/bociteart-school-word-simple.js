/* =========================================================
   ÇA COMMENCE ICI

   BO'CITÉART — ÉCOLE & JEUNES
   MOT DU JOUR — PARCOURS PROFESSEUR SIMPLIFIÉ

   - aucun choix Fille / Garçon par le professeur ;
   - autorisation parentale préparée en amont ;
   - profil vocal synthétique préparé en amont ;
   - vraie voix si autorisée ;
   - sinon voix synthétique du bon profil ;
   - enregistrement temporaire toujours réécoutable avant validation ;
   - programmation limitée à quelques jours de classe ;
   - validation finale réutilisant le moteur École existant.
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

  const CURRENT_CHILD_VOICE_PROFILE_KEY =
    "bociteart_school_current_child_voice_profile_v1";

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
  let selectedVoiceMode = "synthetic";
  let selectedVoiceGender = "";
  let typedFallback = false;

  /* =====================================================
     OUTILS DE BASE
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

  function twoDigits(number){
    return String(number).padStart(2, "0");
  }

  function localDateToIso(date){
    return (
      date.getFullYear() +
      "-" +
      twoDigits(date.getMonth() + 1) +
      "-" +
      twoDigits(date.getDate())
    );
  }

  function todayIso(){
    return localDateToIso(new Date());
  }

  function maxDateIso(){
    const date = new Date();
    date.setDate(date.getDate() + MAX_ADVANCE_DAYS);
    return localDateToIso(date);
  }

  function formatDateFr(iso){
    if(!iso){
      return "";
    }

    const parts = iso.split("-");

    if(parts.length !== 3){
      return iso;
    }

    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    return date.toLocaleDateString(
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
    const totalSeconds = Math.max(
      0,
      Math.floor(milliseconds / 1000)
    );

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return twoDigits(minutes) + ":" + twoDigits(seconds);
  }

  function getCurrentClass(){
    const select = getElement("schoolClassSelect");

    return String(
      select && select.value
        ? select.value
        : "Classe"
    ).trim();
  }

  function getCurrentWordText(){
    const input = getElement("schoolWordInput");

    const direct = String(
      input && input.value
        ? input.value
        : ""
    ).trim();

    if(direct){
      return direct;
    }

    const display = String(
      getElement("schoolWordDisplay")?.textContent || ""
    ).trim();

    const match = display.match(/«\s*(.*?)\s*»/);

    if(match && match[1]){
      return match[1].trim();
    }

    return display || "Je suis ravi aujourd’hui.";
  }

  function getSchoolZone(){
    const zoneSelect = getElement("schoolConfigZone");

    if(zoneSelect && zoneSelect.value){
      return String(zoneSelect.value).trim().toUpperCase();
    }

    try{
      const raw = localStorage.getItem(SCHOOL_CONFIG_KEY);
      const config = raw ? JSON.parse(raw) : null;

      if(config && config.zone){
        return String(config.zone).trim().toUpperCase();
      }
    }catch(error){
      /* rien */
    }

    return "B";
  }

  /* =====================================================
     PROFIL VOCAL PRÉPARÉ EN AMONT
     ===================================================== */

  function normalizeVoiceGender(value){
    const gender = String(value || "")
      .trim()
      .toLowerCase();

    if(
      gender === "girl" ||
      gender === "fille" ||
      gender === "female"
    ){
      return "girl";
    }

    if(
      gender === "boy" ||
      gender === "garcon" ||
      gender === "garçon" ||
      gender === "male"
    ){
      return "boy";
    }

    return "";
  }

  function readStoredVoiceProfile(){
    try{
      const raw = localStorage.getItem(
        CURRENT_CHILD_VOICE_PROFILE_KEY
      );

      return raw
        ? safeParse(raw, null)
        : null;
    }catch(error){
      return null;
    }
  }

  function getCurrentVoiceProfile(){
    try{
      if(
        window.BociteSchoolParentalGuard &&
        typeof window
          .BociteSchoolParentalGuard
          .getCurrentVoiceProfile === "function"
      ){
        const profile = window
          .BociteSchoolParentalGuard
          .getCurrentVoiceProfile();

        if(profile){
          return profile;
        }
      }
    }catch(error){
      /* rien */
    }

    if(window.BociteSchoolCurrentChildVoiceProfile){
      return window.BociteSchoolCurrentChildVoiceProfile;
    }

    return readStoredVoiceProfile();
  }

  function setCurrentVoiceProfile(profile){
    const source = profile || {};

    const gender = normalizeVoiceGender(
      source.syntheticVoice ||
      source.voiceGender
    );

    const clean = {
      firstName:
        String(
          source.firstName ||
          source.prenom ||
          ""
        ).trim(),

      voiceGender:
        gender,

      syntheticVoice:
        gender,

      realVoiceAuthorized:
        source.realVoiceAuthorized === true
    };

    localStorage.setItem(
      CURRENT_CHILD_VOICE_PROFILE_KEY,
      JSON.stringify(clean)
    );

    window.BociteSchoolCurrentChildVoiceProfile = clean;

    refreshSimplePanel();

    return clean;
  }

  function inferGenderFromKnownFirstName(value){
    const name = String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if(!name){
      return "";
    }

    const girls = new Set([
      "alice","ambre","amelie","anna","camille","celine",
      "charlotte","chloe","clara","emma","eva","jade",
      "jeanne","julie","lea","lina","lola","louise",
      "lucie","manon","margaux","marie","mathilde","nina",
      "oceane","romane","rose","sarah","sophie","zoe"
    ]);

    const boys = new Set([
      "adam","alexandre","antoine","arthur","baptiste","benjamin",
      "clement","enzo","gabriel","hugo","jules","leo",
      "louis","lucas","mathis","mathieu","maxime","nathan",
      "nicolas","noah","paul","raphael","remy","thomas",
      "timothee","tom","victor"
    ]);

    if(girls.has(name) && !boys.has(name)){
      return "girl";
    }

    if(boys.has(name) && !girls.has(name)){
      return "boy";
    }

    return "";
  }

  function getAutomaticVoiceGender(){
    const profile = getCurrentVoiceProfile();

    const explicit = normalizeVoiceGender(
      profile &&
      (
        profile.syntheticVoice ||
        profile.voiceGender
      )
    );

    if(explicit){
      return explicit;
    }

    const fromName = inferGenderFromKnownFirstName(
      profile &&
      (
        profile.firstName ||
        profile.prenom
      )
    );

    if(fromName){
      return fromName;
    }

    /*
      Compatibilité avec une programmation déjà faite
      dans la démo : on peut reprendre le profil vocal
      précédemment enregistré pour la classe.
    */

    try{
      const cls = getCurrentClass();

      const previous = loadSchedule()
        .filter(function(item){
          return (
            item &&
            item.class === cls &&
            normalizeVoiceGender(item.voiceGender)
          );
        })
        .sort(function(a, b){
          return String(b.createdAt || "")
            .localeCompare(String(a.createdAt || ""));
        })[0];

      if(previous){
        return normalizeVoiceGender(previous.voiceGender);
      }
    }catch(error){
      /* rien */
    }

    return "";
  }

  function voicePermissionAvailable(){
    try{
      if(
        window.BociteSchoolParentalGuard &&
        typeof window
          .BociteSchoolParentalGuard
          .canUseCurrentVoice === "function"
      ){
        return Boolean(
          window
            .BociteSchoolParentalGuard
            .canUseCurrentVoice()
        );
      }
    }catch(error){
      /* rien */
    }

    const profile = getCurrentVoiceProfile();

    return Boolean(
      profile &&
      profile.realVoiceAuthorized === true
    );
  }

  function prepareVoiceContext(){
    selectedVoiceGender = getAutomaticVoiceGender();

    if(!selectedVoiceGender){
      return false;
    }

    selectedVoiceMode = voicePermissionAvailable()
      ? "real"
      : (
          selectedVoiceGender === "girl"
            ? "synthetic-girl"
            : "synthetic-boy"
        );

    return true;
  }

  /* =====================================================
     VOIX SYNTHÉTIQUE FILLE / GARÇON
     ===================================================== */

  function getSyntheticProfile(kind){
    const cls = getCurrentClass().toUpperCase();

    let boyPitch = 1.10;

    if(/CP|CE1/.test(cls)){
      boyPitch = 1.22;
    }
    else if(/CE2|CM1/.test(cls)){
      boyPitch = 1.18;
    }
    else if(/CM2|6E/.test(cls)){
      boyPitch = 1.14;
    }
    else if(/5E|4E/.test(cls)){
      boyPitch = 1.08;
    }

    return {
      pitch:
        kind === "girl"
          ? Math.min(2, boyPitch + 0.18)
          : boyPitch,
      rate:0.92
    };
  }

  function getGenderedFrenchVoice(kind){
    if(!window.speechSynthesis){
      return null;
    }

    const voices = window.speechSynthesis
      .getVoices()
      .filter(function(voice){
        return (
          voice.lang &&
          voice.lang
            .toLowerCase()
            .startsWith("fr")
        );
      });

    const femaleNames =
      /denise|hortense|julie|sylvie|marie|amelie|amélie|audrey|virginie|eloise|éloise|celine|céline|female|femme|fémin/i;

    const maleNames =
      /henri|paul|claude|alain|thomas|hugo|remy|rémy|mathieu|gerard|gérard|loic|loïc|nicolas|male|homme|masculin/i;

    const matcher =
      kind === "girl"
        ? femaleNames
        : maleNames;

    return voices.find(function(item){
      return matcher.test(
        String(item.name || "") +
        " " +
        String(item.voiceURI || "")
      );
    }) || null;
  }

  function speakSyntheticChild(kind, forcedText){
    if(
      !("speechSynthesis" in window) ||
      typeof window.SpeechSynthesisUtterance !== "function"
    ){
      alert(
        "La voix synthétique n'est pas disponible sur cet appareil."
      );
      return false;
    }

    const gender = normalizeVoiceGender(kind);

    if(!gender){
      alert(
        "Le profil vocal de l'enfant n'est pas encore préparé."
      );
      return false;
    }

    const chosenVoice = getGenderedFrenchVoice(gender);

    if(!chosenVoice){
      alert(
        gender === "girl"
          ? "Aucune voix française féminine adaptée n'est disponible sur cet appareil."
          : "Aucune voix française masculine adaptée n'est disponible sur cet appareil."
      );
      return false;
    }

    const text = String(
      forcedText ||
      getCurrentWordText() ||
      ""
    ).trim();

    if(!text){
      return false;
    }

    const profile = getSyntheticProfile(gender);
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "fr-FR";
    utterance.voice = chosenVoice;
    utterance.rate = profile.rate;
    utterance.pitch = profile.pitch;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return true;
  }

  /* =====================================================
     STYLE PROFESSEUR
     ===================================================== */

  function installStyles(){
    if(getElement("bociteSchoolSimpleStyles")){
      return;
    }

    const style = document.createElement("style");
    style.id = "bociteSchoolSimpleStyles";

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

      #modalBody.bociteSchoolClean,
      #modalBody.bociteSchoolClean p,
      #modalBody.bociteSchoolClean li,
      #modalBody.bociteSchoolClean .muted,
      #modalBody.bociteSchoolClean .box,
      #modalBody.bociteSchoolClean .miniField{
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.5 !important;
      }

      #modalBody.bociteSchoolClean
      div[style*="font-weight:900"]:not(.choiceBtn){
        color:#2f5d46 !important;
        font-size:17px !important;
        font-weight:700 !important;
        line-height:1.35 !important;
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
        margin-top:12px;
        padding:13px 12px;
        border:2px solid rgba(0,0,0,.10);
        border-radius:12px;
        background:#efe4d3;
        color:#111111;
        font-size:16px;
        font-weight:700;
        cursor:pointer;
      }

      .bociteSchoolSimpleButton:disabled{
        opacity:.45;
        cursor:not-allowed;
      }

      .bociteSchoolSimpleSecondary{
        background:#ffffff;
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

    document.head.appendChild(style);
  }

  function cleanSchoolTypography(){
    const modalTitle = getElement("modalTitle");
    const modalBody = getElement("modalBody");

    if(!modalTitle || !modalBody){
      return;
    }

    if(
      String(modalTitle.textContent || "").trim() !== "École"
    ){
      return;
    }

    modalBody.classList.add("bociteSchoolClean");
  }

   /* =====================================================
     MICRO / OVERLAY
     ===================================================== */

  function stopTracks(){
    if(activeStream){
      try{
        activeStream.getTracks().forEach(function(track){
          track.stop();
        });
      }catch(error){
        /* rien */
      }
    }

    activeStream = null;
  }

  function clearTimer(){
    if(timerId){
      window.clearInterval(timerId);
    }

    timerId = null;
  }

  function resetRecorderState(){
    clearTimer();
    stopTracks();
    recorder = null;
    audioChunks = [];
    startedAt = 0;
  }

  function revokeObjectUrl(){
    if(objectUrl){
      try{
        URL.revokeObjectURL(objectUrl);
      }catch(error){
        /* rien */
      }
    }

    objectUrl = "";
  }

  function closeOverlay(){
    if(recorder && recorder.state === "recording"){
      try{
        recorder.onstop = null;
        recorder.stop();
      }catch(error){
        /* rien */
      }
    }

    resetRecorderState();

    const overlay = getElement(OVERLAY_ID);

    if(overlay){
      overlay.remove();
    }

    revokeObjectUrl();
  }

  function createOverlay(){
    closeOverlay();

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;

    overlay.style.cssText = `
      position:fixed;
      inset:0;
      z-index:1000010;
      overflow:auto;
      box-sizing:border-box;
      padding:14px 10px 30px;
      background:rgba(0,0,0,.55);
      font-family:Arial,sans-serif;
    `;

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
        ">
        <div
          style="
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:12px;
          ">
          <div
            id="bociteSchoolSimpleOverlayTitle"
            class="bociteSchoolSimpleTitle">
            Mot du jour
          </div>

          <button
            id="bociteSchoolSimpleClose"
            type="button"
            aria-label="Fermer"
            style="
              width:42px;
              height:42px;
              flex:0 0 42px;
              border:0;
              border-radius:12px;
              background:#ffffff;
              font-size:26px;
              cursor:pointer;
            ">
            ×
          </button>
        </div>

        <div
          id="bociteSchoolSimpleContent"
          class="bociteSchoolSimpleText"
          style="margin-top:16px;">
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = getElement("bociteSchoolSimpleClose");

    if(close){
      close.onclick = closeOverlay;
    }

    return overlay;
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

    if(typeof MediaRecorder.isTypeSupported === "function"){
      for(let index = 0; index < candidates.length; index += 1){
        if(MediaRecorder.isTypeSupported(candidates[index])){
          return { mimeType:candidates[index] };
        }
      }
    }

    return {};
  }

  function updateRecordingTimer(){
    const time = getElement("bociteSchoolSimpleTimer");
    const bar = getElement("bociteSchoolSimpleProgressBar");

    if(!time || !bar){
      return;
    }

    const elapsed = Date.now() - startedAt;
    const percent = Math.min(
      100,
      (elapsed / MAX_RECORDING_MS) * 100
    );

    time.textContent =
      formatTime(elapsed) + " / 02:00";

    bar.style.width = percent + "%";

    if(elapsed >= MAX_RECORDING_MS){
      stopRecording();
    }
  }

  function showRecordingError(message){
    const content = getElement("bociteSchoolSimpleContent");

    if(!content){
      return;
    }

    content.innerHTML = `
      <div class="bociteSchoolSimpleTitle">
        Enregistrement interrompu
      </div>

      <p>${message}</p>

      <button
        id="bociteSchoolSimpleRetry"
        type="button"
        class="bociteSchoolSimpleButton">
        Recommencer
      </button>
    `;

    const retry = getElement("bociteSchoolSimpleRetry");

    if(retry){
      retry.onclick = startRecording;
    }
  }

  async function startRecording(){
    typedFallback = false;

    if(!prepareVoiceContext()){
      alert(
        "Le profil vocal de cet enfant n'est pas encore préparé en amont."
      );
      return;
    }

    if(
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function" ||
      !window.MediaRecorder
    ){
      alert(
        "L'enregistrement vocal n'est pas disponible sur cet appareil."
      );
      return;
    }

    pendingClass = getCurrentClass();
    pendingText = getCurrentWordText();
    pendingBlob = null;
    pendingAudioData = "";

    createOverlay();

    const content = getElement("bociteSchoolSimpleContent");

    content.innerHTML = `<p>Préparation du microphone…</p>`;

    try{
      activeStream = await navigator.mediaDevices.getUserMedia({
        audio:true
      });

      const options = getRecorderOptions();

      if(options === null){
        throw new Error("MediaRecorder indisponible");
      }

      recorder = new MediaRecorder(activeStream, options);
      audioChunks = [];

      recorder.ondataavailable = function(event){
        if(event.data && event.data.size > 0){
          audioChunks.push(event.data);
        }
      };

      recorder.onerror = function(event){
        console.error(
          "Bo'CitéArt — erreur enregistrement :",
          event
        );
        resetRecorderState();
      };

      recorder.onstop = function(){
        clearTimer();

        const mimeType =
          (recorder && recorder.mimeType) ||
          (audioChunks[0] && audioChunks[0].type) ||
          "audio/webm";

        const blob = new Blob(
          audioChunks,
          { type:mimeType }
        );

        stopTracks();
        recorder = null;

        if(!blob || blob.size === 0){
          showRecordingError(
            "Aucun son n'a été enregistré. Recommencez simplement."
          );
          return;
        }

        pendingBlob = blob;
        showRecordingReview();
      };

      content.innerHTML = `
        <div class="bociteSchoolSimpleTitle">
          Enregistrement en cours
        </div>

        <p>
          L'enfant parle normalement.
          L'enregistrement s'arrête automatiquement après 2 minutes.
        </p>

        <div
          id="bociteSchoolSimpleTimer"
          style="
            margin-top:18px;
            text-align:center;
            color:#2f5d46;
            font-size:24px;
            font-weight:700;
          ">
          00:00 / 02:00
        </div>

        <div id="bociteSchoolSimpleProgress">
          <div id="bociteSchoolSimpleProgressBar"></div>
        </div>

        <button
          id="bociteSchoolSimpleStop"
          type="button"
          class="bociteSchoolSimpleButton">
          ■ Arrêter et écouter
        </button>
      `;

      const stop = getElement("bociteSchoolSimpleStop");

      if(stop){
        stop.onclick = stopRecording;
      }

      startedAt = Date.now();
      recorder.start(250);

      timerId = window.setInterval(
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
    if(recorder && recorder.state === "recording"){
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
     ÉCOUTE TEMPORAIRE ET VALIDATION
     ===================================================== */

  function showRecordingReview(){
    const content = getElement("bociteSchoolSimpleContent");

    if(!content || !pendingBlob){
      return;
    }

    if(!prepareVoiceContext()){
      showRecordingError(
        "Le profil vocal de cet enfant n'est pas encore préparé en amont."
      );
      return;
    }

    revokeObjectUrl();
    objectUrl = URL.createObjectURL(pendingBlob);

    const parentOk = voicePermissionAvailable();

    content.innerHTML = `
      <div class="bociteSchoolSimpleTitle">
        Écouter et valider
      </div>

      <p>
        Écoutez simplement l'enregistrement avant validation.
      </p>

      <div
        aria-label="Statut prêt"
        style="
          display:inline-flex;
          align-items:center;
          gap:6px;
          margin-top:4px;
          color:${parentOk ? "#2f5d46" : "#9a9a9a"};
          font-size:14px;
          font-weight:700;
        ">
        <span style="font-size:20px;line-height:1;">✓</span>
        <span>OK</span>
      </div>

      <audio
        id="bociteSchoolSimpleAudio"
        controls
        preload="metadata"
        style="
          display:block;
          width:100%;
          margin-top:15px;
        ">
      </audio>

      <label
        for="bociteSchoolSimpleVolume"
        style="
          display:block;
          margin-top:15px;
          color:#111111;
          font-size:14px;
          font-weight:400;
        ">
        Volume d'écoute
      </label>

      <input
        id="bociteSchoolSimpleVolume"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value="1"
        style="width:100%;margin-top:8px;"
      >

      <button
        id="bociteSchoolSimpleValidateAudio"
        type="button"
        class="bociteSchoolSimpleButton">
        ✓ C'est bon — choisir le jour
      </button>

      <button
        id="bociteSchoolSimpleRetryAudio"
        type="button"
        class="bociteSchoolSimpleButton bociteSchoolSimpleSecondary">
        Recommencer
      </button>
    `;

    const audio = getElement("bociteSchoolSimpleAudio");
    const volume = getElement("bociteSchoolSimpleVolume");

    if(audio){
      audio.src = objectUrl;
      audio.load();
    }

    if(audio && volume){
      volume.oninput = function(){
        audio.volume = Number(volume.value);
      };
    }

    const validate = getElement(
      "bociteSchoolSimpleValidateAudio"
    );

    if(validate){
      validate.onclick = function(){
        if(window.speechSynthesis){
          window.speechSynthesis.cancel();
        }

        if(parentOk){
          selectedVoiceMode = "real";
          convertPendingAudio();
          return;
        }

        selectedVoiceMode =
          selectedVoiceGender === "girl"
            ? "synthetic-girl"
            : "synthetic-boy";

        if(audio){
          audio.pause();
        }

        revokeObjectUrl();
        pendingBlob = null;
        pendingAudioData = "";

        showCalendarStep();
      };
    }

    const retry = getElement(
      "bociteSchoolSimpleRetryAudio"
    );

    if(retry){
      retry.onclick = function(){
        if(audio){
          audio.pause();
        }

        revokeObjectUrl();
        pendingBlob = null;
        pendingAudioData = "";

        startRecording();
      };
    }
  }

  function convertPendingAudio(){
    if(!pendingBlob){
      return;
    }

    const reader = new FileReader();

    reader.onloadend = function(){
      pendingAudioData = String(reader.result || "");

      if(!pendingAudioData){
        showRecordingError(
          "L'enregistrement n'a pas pu être préparé."
        );
        return;
      }

      showCalendarStep();
    };

    reader.onerror = function(){
      showRecordingError(
        "L'enregistrement n'a pas pu être préparé."
      );
    };

    reader.readAsDataURL(pendingBlob);
  }

  /* =====================================================
     SECOURS : ÉCRIRE LA PHRASE
     ===================================================== */

  function openWrittenWordFallback(){
    typedFallback = true;

    if(!prepareVoiceContext()){
      alert(
        "Le profil vocal de cet enfant n'est pas encore préparé en amont."
      );
      return;
    }

    pendingClass = getCurrentClass();
    pendingBlob = null;
    pendingAudioData = "";

    createOverlay();

    const content = getElement("bociteSchoolSimpleContent");

    content.innerHTML = `
      <div class="bociteSchoolSimpleTitle">
        Écrire la phrase
      </div>

      <p>
        Utilisez cette solution si le microphone ne fonctionne pas.
      </p>

      <textarea
        id="bociteSchoolWrittenText"
        rows="4"
        maxlength="500"
        placeholder="Écrivez ici le Mot du jour…"
        style="
          display:block;
          width:100%;
          box-sizing:border-box;
          margin-top:14px;
          padding:12px;
          border:2px solid #2f5d46;
          border-radius:10px;
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          resize:vertical;
        "
      >${pendingText || getCurrentWordText()}</textarea>

      <button
        id="bociteSchoolWrittenPreview"
        type="button"
        class="bociteSchoolSimpleButton">
        ▶ Écouter
      </button>

      <button
        id="bociteSchoolWrittenValidate"
        type="button"
        class="bociteSchoolSimpleButton">
        ✓ C'est bon — choisir le jour
      </button>
    `;

    const field = getElement("bociteSchoolWrittenText");
    const preview = getElement("bociteSchoolWrittenPreview");
    const validate = getElement("bociteSchoolWrittenValidate");

    if(preview){
      preview.onclick = function(){
        pendingText = String(field?.value || "").trim();

        if(!pendingText){
          alert("Écrivez d'abord la phrase.");
          return;
        }

        speakSyntheticChild(
          selectedVoiceGender,
          pendingText
        );
      };
    }

    if(validate){
      validate.onclick = function(){
        pendingText = String(field?.value || "").trim();

        if(!pendingText){
          alert("Écrivez d'abord la phrase.");
          return;
        }

        selectedVoiceMode =
          selectedVoiceGender === "girl"
            ? "synthetic-girl"
            : "synthetic-boy";

        if(window.speechSynthesis){
          window.speechSynthesis.cancel();
        }

        showCalendarStep();
      };
    }
  }

   /* =====================================================
     JOURS DE CLASSE
     ===================================================== */

  function easterSunday(year){
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
  }

  function addDays(date, days){
    const copy = new Date(date.getTime());
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function isFrenchPublicHoliday(iso){
    const parts = iso.split("-");
    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    const year = date.getFullYear();

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

    const easter = easterSunday(year);

    const movable = [
      localDateToIso(addDays(easter, 1)),
      localDateToIso(addDays(easter, 39)),
      localDateToIso(addDays(easter, 50))
    ];

    return fixed.includes(iso) || movable.includes(iso);
  }

  async function isOfficialSchoolHoliday(iso){
    const zoneName = "Zone " + getSchoolZone();

    const endpoint = new URL(
      "https://data.education.gouv.fr/" +
      "api/explore/v2.1/catalog/datasets/" +
      "fr-en-calendrier-scolaire/records"
    );

    endpoint.searchParams.set("limit", "20");

    endpoint.searchParams.set(
      "refine",
      'zones:"' + zoneName + '"'
    );

    endpoint.searchParams.set(
      "where",
      'start_date <= "' +
      iso +
      '" AND end_date >= "' +
      iso +
      '"'
    );

    const response = await fetch(
      endpoint.toString(),
      {
        headers:{
          Accept:"application/json"
        }
      }
    );

    if(!response.ok){
      throw new Error("Calendrier scolaire indisponible");
    }

    const data = await response.json();

    return Boolean(
      data &&
      Array.isArray(data.results) &&
      data.results.length > 0
    );
  }

  /* =====================================================
     CALENDRIER
     ===================================================== */

  function showCalendarStep(){
    const content = getElement("bociteSchoolSimpleContent");
    const title = getElement("bociteSchoolSimpleOverlayTitle");

    if(!content){
      return;
    }

    pendingClass = pendingClass || getCurrentClass();

    if(title){
      title.textContent = "Programmer le Mot du jour";
    }

    const canGoBack =
      typedFallback ||
      (
        selectedVoiceMode === "real" &&
        Boolean(pendingBlob)
      );

    content.innerHTML = `
      <div class="bociteSchoolSimpleTitle">
        Choisir le jour
      </div>

      <p>
        Le Mot du jour est prêt. Choisissez simplement le jour où il doit être présenté.
      </p>

      <p>
        Vous pouvez choisir aujourd'hui ou l'un des prochains jours, dans la limite d'une semaine.
      </p>

      <p>
        Les week-ends, jours fériés et vacances scolaires ne sont pas programmables.
      </p>

      <label
        for="bociteSchoolSimpleDate"
        style="
          display:block;
          margin-top:16px;
          color:#111111;
          font-size:14px;
          font-weight:400;
        ">
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
          background:#ffffff;
          color:#111111;
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
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">
      </div>

      <button
        id="bociteSchoolSimpleSchedule"
        type="button"
        class="bociteSchoolSimpleButton">
        ✓ Programmer le Mot du jour
      </button>

      ${
        canGoBack
          ? `
            <button
              id="bociteSchoolSimpleBack"
              type="button"
              class="bociteSchoolSimpleButton bociteSchoolSimpleSecondary">
              ← Revenir à l'étape précédente
            </button>
          `
          : ""
      }
    `;

    const schedule = getElement("bociteSchoolSimpleSchedule");
    const back = getElement("bociteSchoolSimpleBack");

    if(schedule){
      schedule.onclick = validateScheduleDate;
    }

    if(back){
      back.onclick = function(){
        if(typedFallback){
          openWrittenWordFallback();
          return;
        }

        showRecordingReview();
      };
    }
  }

  async function validateScheduleDate(){
    const dateField = getElement("bociteSchoolSimpleDate");
    const message = getElement("bociteSchoolSimpleDateMessage");
    const scheduleButton = getElement("bociteSchoolSimpleSchedule");

    const iso = String(
      dateField && dateField.value
        ? dateField.value
        : ""
    );

    function showMessage(text){
      if(!message){
        return;
      }

      message.style.display = "block";
      message.textContent = text;
    }

    if(!iso){
      showMessage("Choisissez une date.");
      return;
    }

    const parts = iso.split("-");
    const date = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    const day = date.getDay();

    if(day === 0 || day === 6){
      showMessage(
        "Cette date tombe un week-end. Choisissez un jour de classe."
      );
      return;
    }

    if(isFrenchPublicHoliday(iso)){
      showMessage(
        "Cette date est un jour férié. Choisissez un autre jour."
      );
      return;
    }

    if(scheduleButton){
      scheduleButton.disabled = true;
      scheduleButton.textContent =
        "Vérification du calendrier…";
    }

    try{
      const holiday = await isOfficialSchoolHoliday(iso);

      if(holiday){
        showMessage(
          "Cette date se situe pendant des vacances scolaires. Choisissez un jour de classe."
        );

        if(scheduleButton){
          scheduleButton.disabled = false;
          scheduleButton.textContent =
            "✓ Programmer le Mot du jour";
        }

        return;
      }

      saveSchedule(iso);
      showScheduleSuccess(iso);
    }catch(error){
      console.error(
        "Bo'CitéArt — calendrier scolaire :",
        error
      );

      showMessage(
        "Le calendrier scolaire officiel n'a pas pu être vérifié. Réessayez dans quelques instants."
      );

      if(scheduleButton){
        scheduleButton.disabled = false;
        scheduleButton.textContent =
          "✓ Programmer le Mot du jour";
      }
    }
  }

  /* =====================================================
     PROGRAMMATIONS
     ===================================================== */

  function loadSchedule(){
    try{
      const raw = localStorage.getItem(SCHEDULE_KEY);
      const data = raw ? JSON.parse(raw) : [];

      return Array.isArray(data)
        ? data
        : [];
    }catch(error){
      return [];
    }
  }

  function saveScheduleRows(rows){
    localStorage.setItem(
      SCHEDULE_KEY,
      JSON.stringify(rows)
    );
  }

  function saveSchedule(iso){
    const rows = loadSchedule();
    const currentClass = pendingClass || getCurrentClass();

    const filtered = rows.filter(function(item){
      return !(
        item &&
        item.class === currentClass &&
        item.date === iso
      );
    });

    filtered.push({
      id:"school-word-" + Date.now(),
      class:currentClass,
      date:iso,
      text:pendingText || getCurrentWordText(),
      voiceMode:selectedVoiceMode,
      voiceGender:selectedVoiceGender,
      parentalVoiceAuthorized:voicePermissionAvailable(),
      typedFallback:Boolean(typedFallback),
      audioData:
        selectedVoiceMode === "real"
          ? pendingAudioData
          : "",
      mimeType:
        selectedVoiceMode === "real" && pendingBlob
          ? pendingBlob.type
          : "",
      status:
        iso === todayIso()
          ? "ready-today"
          : "scheduled",
      createdAt:new Date().toISOString(),
      createdAtFr:new Date().toLocaleString("fr-FR")
    });

    try{
      saveScheduleRows(filtered);
    }catch(error){
      console.error(
        "Bo'CitéArt — programmation impossible :",
        error
      );
      return;
    }

    activateTodaySchedule();
  }

  function getTodaySchedule(){
    const cls = getCurrentClass();
    const today = todayIso();

    return loadSchedule().find(function(item){
      return (
        item &&
        item.class === cls &&
        item.date === today
      );
    }) || null;
  }

  function activateTodaySchedule(){
    const cls = getCurrentClass();
    const today = todayIso();
    const rows = loadSchedule();

    const index = rows.findIndex(function(item){
      return (
        item &&
        item.class === cls &&
        item.date === today
      );
    });

    if(index < 0){
      return null;
    }

    let row = rows[index];

    const currentPermission = voicePermissionAvailable();

    if(
      row.voiceMode === "real" &&
      !currentPermission
    ){
      row = Object.assign({}, row, {
        voiceMode:
          row.voiceGender === "girl"
            ? "synthetic-girl"
            : "synthetic-boy",
        parentalVoiceAuthorized:false,
        audioData:"",
        mimeType:""
      });

      rows[index] = row;

      try{
        saveScheduleRows(rows);
      }catch(error){
        /* rien */
      }
    }

    const text = String(row.text || "").trim();
    const wordInput = getElement("schoolWordInput");
    const wordDisplay = getElement("schoolWordDisplay");

    if(
      wordInput &&
      text &&
      String(wordInput.value || "").trim() !== text
    ){
      wordInput.value = text;
    }

    if(wordDisplay && text){
      const expected = "« " + text + " »";

      if(
        String(wordDisplay.textContent || "").trim() !==
        expected
      ){
        wordDisplay.textContent = expected;
      }
    }

    const realVoiceAllowed =
      row.voiceMode === "real" &&
      Boolean(row.audioData) &&
      row.parentalVoiceAuthorized === true &&
      currentPermission;

    let legacy = {};

    try{
      const raw = localStorage.getItem(LEGACY_VOICE_KEY);
      legacy = raw ? JSON.parse(raw) : {};
    }catch(error){
      legacy = {};
    }

    if(realVoiceAllowed){
      legacy[cls] = {
        class:cls,
        audioData:row.audioData,
        mimeType:row.mimeType || "audio/webm",
        scheduledDate:row.date,
        savedAt:Date.now(),
        savedAtFr:new Date().toLocaleString("fr-FR")
      };
    }
    else if(legacy && legacy[cls]){
      delete legacy[cls];
    }

    try{
      localStorage.setItem(
        LEGACY_VOICE_KEY,
        JSON.stringify(legacy)
      );
    }catch(error){
      /* rien */
    }

    try{
      document.dispatchEvent(
        new CustomEvent(
          "bociteart:school-word-ready",
          {
            detail:{
              class:cls,
              date:row.date,
              voiceMode:
                realVoiceAllowed
                  ? "real"
                  : (
                      row.voiceGender === "girl"
                        ? "synthetic-girl"
                        : "synthetic-boy"
                    ),
              text:text
            }
          }
        )
      );
    }catch(error){
      /* rien */
    }

    return row;
  }

  function playTodaySchedule(){
    const row = activateTodaySchedule();

    if(!row){
      return false;
    }

    const realVoiceAllowed =
      row.voiceMode === "real" &&
      Boolean(row.audioData) &&
      row.parentalVoiceAuthorized === true &&
      voicePermissionAvailable();

    if(realVoiceAllowed){
      try{
        const audio = new Audio(row.audioData);
        const playPromise = audio.play();

        if(
          playPromise &&
          typeof playPromise.catch === "function"
        ){
          playPromise.catch(function(error){
            console.error(
              "Bo'CitéArt — lecture du Mot du jour :",
              error
            );
          });
        }

        return true;
      }catch(error){
        console.error(
          "Bo'CitéArt — lecture du Mot du jour :",
          error
        );
      }
    }

    const gender = normalizeVoiceGender(row.voiceGender);

    if(!gender){
      alert(
        "Le profil vocal de cet enfant n'est pas disponible."
      );
      return false;
    }

    return speakSyntheticChild(
      gender,
      String(row.text || "").trim()
    );
  }

  function validateTodayWord(){
    const row = activateTodaySchedule();

    if(!row){
      alert(
        "Aucun Mot du jour n'est programmé pour aujourd'hui."
      );
      return;
    }

    const wordInput = getElement("schoolWordInput");
    const existingValidateButton = getElement("schoolSaveBtn");

    if(wordInput && row.text){
      wordInput.value = String(row.text).trim();
    }

    if(!existingValidateButton){
      alert(
        "La validation du Mot du jour n'est pas disponible."
      );
      return;
    }

    if(existingValidateButton.disabled){
      alert(
        "Le Mot du jour a déjà été validé aujourd'hui."
      );
      refreshSimplePanel();
      return;
    }

    existingValidateButton.click();

    window.setTimeout(
      refreshSimplePanel,
      100
    );
  }

  function showScheduleSuccess(iso){
    const content = getElement("bociteSchoolSimpleContent");
    const title = getElement("bociteSchoolSimpleOverlayTitle");

    if(title){
      title.textContent = "Mot du jour prêt";
    }

    if(!content){
      return;
    }

    content.innerHTML = `
      <div class="bociteSchoolSimpleTitle">
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
        ">
        ${formatDateFr(iso)}
      </p>

      <p>Classe : ${pendingClass}</p>

      <button
        id="bociteSchoolSimpleFinish"
        type="button"
        class="bociteSchoolSimpleButton">
        Terminer
      </button>
    `;

    const finish = getElement("bociteSchoolSimpleFinish");

    if(finish){
      finish.onclick = function(){
        closeOverlay();
        refreshSimplePanel();
      };
    }
  }

   /* =====================================================
     PANNEAU PROFESSEUR
     ===================================================== */

  function refreshSimplePanel(){
    const statusIcon = getElement("bociteSchoolSimpleReadyIcon");
    const recordBtn = getElement("bociteSchoolSimpleStart");
    const writeBtn = getElement("bociteSchoolSimpleWrite");
    const profileMessage = getElement("bociteSchoolSimpleProfileMessage");
    const status = getElement("bociteSchoolSimpleVoiceStatus");

    selectedVoiceGender = getAutomaticVoiceGender();

    const parentOk = voicePermissionAvailable();
    const profileReady = Boolean(selectedVoiceGender);

    if(statusIcon){
      statusIcon.style.color =
        parentOk
          ? "#2f5d46"
          : "#9a9a9a";
    }

    if(profileMessage){
      profileMessage.textContent =
        profileReady
          ? ""
          : "Profil vocal non préparé en amont.";

      profileMessage.style.display =
        profileReady
          ? "none"
          : "block";
    }

    if(recordBtn){
      recordBtn.disabled = !profileReady;
    }

    if(writeBtn){
      writeBtn.disabled = !profileReady;
    }

    activateTodaySchedule();

    if(!status){
      return;
    }

    const today = getTodaySchedule();

    if(!today){
      status.textContent =
        "Aucun Mot du jour n'est programmé pour aujourd'hui.";
      return;
    }

    const existingValidateButton = getElement("schoolSaveBtn");

    const alreadyValidated = Boolean(
      existingValidateButton &&
      existingValidateButton.disabled
    );

    status.innerHTML = `
      <div>
        ${
          alreadyValidated
            ? "✓ Le Mot du jour a été validé aujourd'hui."
            : "Le Mot du jour est prêt pour aujourd'hui."
        }
      </div>

      <button
        id="bociteSchoolPlayToday"
        type="button"
        class="bociteSchoolSimpleButton">
        ▶ Écouter le Mot du jour
      </button>

      ${
        alreadyValidated
          ? ""
          : `
            <button
              id="bociteSchoolValidateToday"
              type="button"
              class="bociteSchoolSimpleButton">
              ✓ Valider le Mot du jour
            </button>
          `
      }
    `;

    const playToday = getElement("bociteSchoolPlayToday");
    const validateToday = getElement("bociteSchoolValidateToday");

    if(playToday){
      playToday.onclick = playTodaySchedule;
    }

    if(validateToday){
      validateToday.onclick = validateTodayWord;
    }
  }

  function installSimplePanel(){
    cleanSchoolTypography();

    const modalTitle = getElement("modalTitle");
    const modalBody = getElement("modalBody");

    if(
      !modalTitle ||
      !modalBody ||
      String(modalTitle.textContent || "").trim() !== "École"
    ){
      return;
    }

    if(getElement("bociteSchoolSimpleVoicePanel")){
      refreshSimplePanel();
      return;
    }

    const oldRecordButton = getElement("schoolRecordVoiceBtn");

    if(!oldRecordButton){
      return;
    }

    let parent = oldRecordButton.parentElement;

    if(parent && parent.parentElement){
      parent = parent.parentElement;
    }

    if(!parent){
      return;
    }

    const panel = document.createElement("div");
    panel.id = "bociteSchoolSimpleVoicePanel";

    panel.style.cssText = `
      margin:14px 0;
      padding:14px;
      border:1px solid #dedede;
      border-radius:12px;
      background:#ffffff;
      box-sizing:border-box;
      color:#111111;
      font-size:14px;
      font-weight:400;
      line-height:1.5;
    `;

    panel.innerHTML = `
      <div
        style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
        ">
        <div class="bociteSchoolSimpleTitle">
          Préparer le Mot du jour
        </div>

        <div
          aria-label="Statut vocal"
          style="
            display:flex;
            align-items:center;
            gap:5px;
            white-space:nowrap;
          ">
          <span
            id="bociteSchoolSimpleReadyIcon"
            style="
              color:#9a9a9a;
              font-size:20px;
              font-weight:700;
              line-height:1;
            ">
            ✓
          </span>
          <span
            style="
              color:#777777;
              font-size:13px;
              font-weight:400;
            ">
            OK
          </span>
        </div>
      </div>

      <div
        id="bociteSchoolSimpleProfileMessage"
        class="bociteSchoolSimpleText"
        style="
          display:none;
          margin-top:8px;
          padding:8px 10px;
          border-radius:8px;
          background:#fff7e7;
        ">
      </div>

      <div
        style="
          display:grid;
          grid-template-columns:46px 1fr;
          gap:10px;
          margin-top:20px;
          align-items:start;
        ">
        <div
          style="
            color:#2f5d46;
            font-size:30px;
            font-weight:700;
            line-height:1;
          ">
          ①
        </div>

        <div>
          <div class="bociteSchoolSimpleTitle">
            Enregistrer la phrase
          </div>

          <p
            class="bociteSchoolSimpleText"
            style="margin:6px 0 0 0;">
            L'enfant parle normalement. Il pourra écouter exactement ce qu'il vient de dire.
          </p>
        </div>
      </div>

      <button
        id="bociteSchoolSimpleStart"
        type="button"
        class="bociteSchoolSimpleButton">
        🎙 Enregistrer
      </button>

      <button
        id="bociteSchoolSimpleWrite"
        type="button"
        class="bociteSchoolSimpleButton bociteSchoolSimpleSecondary">
        ✍ Écrire la phrase à la place
      </button>

      <div
        class="bociteSchoolSimpleText"
        style="margin-top:8px;">
        Enregistrement : 2 minutes maximum, avec arrêt automatique.
      </div>

      <div
        style="
          display:grid;
          grid-template-columns:46px 1fr;
          gap:10px;
          margin-top:22px;
          align-items:start;
        ">
        <div
          style="
            color:#2f5d46;
            font-size:30px;
            font-weight:700;
            line-height:1;
          ">
          ②
        </div>

        <div>
          <div class="bociteSchoolSimpleTitle">
            Écouter et valider
          </div>

          <p
            class="bociteSchoolSimpleText"
            style="margin:6px 0 0 0;">
            Après l'enregistrement, écoutez puis validez ou recommencez simplement.
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
        ">
        <div
          style="
            color:#2f5d46;
            font-size:30px;
            font-weight:700;
            line-height:1;
          ">
          ③
        </div>

        <div>
          <div class="bociteSchoolSimpleTitle">
            Choisir le jour
          </div>

          <p
            class="bociteSchoolSimpleText"
            style="margin:6px 0 0 0;">
            Après validation, le calendrier s'ouvre pour programmer le Mot du jour.
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
        ">
      </div>
    `;

    parent.insertBefore(
      panel,
      parent.firstChild
    );

    const start = getElement("bociteSchoolSimpleStart");
    const write = getElement("bociteSchoolSimpleWrite");

    if(start){
      start.onclick = startRecording;
    }

    if(write){
      write.onclick = openWrittenWordFallback;
    }

    refreshSimplePanel();
  }

  /* =====================================================
     OBSERVATION
     ===================================================== */

  const observer = new MutationObserver(function(){
    const modalTitle = getElement("modalTitle");

    if(
      !modalTitle ||
      String(modalTitle.textContent || "").trim() !== "École"
    ){
      return;
    }

    if(getElement("bociteSchoolSimpleVoicePanel")){
      return;
    }

    window.setTimeout(
      installSimplePanel,
      0
    );
  });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  document.addEventListener(
    "change",
    function(event){
      if(
        event.target &&
        event.target.id === "schoolClassSelect"
      ){
        window.setTimeout(
          function(){
            activateTodaySchedule();
            refreshSimplePanel();
          },
          0
        );
      }
    },
    true
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
    function(event){
      if(event && event.detail){
        setCurrentVoiceProfile(event.detail);
      }
      else{
        refreshSimplePanel();
      }
    }
  );

  document.addEventListener(
    "click",
    function(event){
      const target =
        event.target &&
        typeof event.target.closest === "function"
          ? event.target.closest(".xbtn,#xBtn")
          : null;

      if(!target){
        return;
      }

      const modalTitle = getElement("modalTitle");

      if(
        modalTitle &&
        String(modalTitle.textContent || "").trim() === "École"
      ){
        closeOverlay();
      }
    },
    true
  );

  /* =====================================================
     API
     ===================================================== */

  window.BociteSchoolWordSimple = {
    start:startRecording,
    stop:stopRecording,
    refresh:refreshSimplePanel,
    getSchedule:loadSchedule,
    activateToday:activateTodaySchedule,
    playToday:playTodaySchedule,
    validateToday:validateTodayWord,
    setCurrentVoiceProfile:setCurrentVoiceProfile,
    getCurrentVoiceProfile:getCurrentVoiceProfile,
    close:closeOverlay
  };

  installStyles();

  window.setTimeout(
    installSimplePanel,
    100
  );

  console.log(
    "✅ Mot du jour — parcours professeur automatique chargé"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
