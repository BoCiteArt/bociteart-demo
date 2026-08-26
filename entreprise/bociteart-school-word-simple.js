
/* =========================================================
   ÇA COMMENCE ICI

   BO'CITÉART — ÉCOLE & JEUNES
   MOT DU JOUR — PARCOURS SIMPLIFIÉ

   OBJECTIF :
   - professeur : 2 ou 3 clics essentiels ;
   - enregistrement visible ;
   - maximum 2 minutes ;
   - arrêt automatique ;
   - écoute avant validation ;
   - volume réglable ;
   - recommencer si nécessaire ;
   - choix d'une date après validation ;
   - pas de programmation pendant les vacances ;
   - quelques jours d'avance seulement ;
   - ancienne interface technique masquée ;
   - textes 14 px noirs non gras ;
   - titres 17 px verts gras.

   Le système existant n'est pas supprimé.
   ========================================================= */

(function initBociteSchoolWordSimple(){

  "use strict";


  if(
    window.BociteSchoolWordSimple
  ){
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


  /*
    2 minutes maximum.
  */

  const MAX_RECORDING_MS =
    2 * 60 * 1000;


  /*
    Quelques jours d'avance seulement.

    Pas de remplissage de tout
    un trimestre à l'avance.
  */

  const MAX_ADVANCE_DAYS =
    7;


  let recorder =
    null;

  let activeStream =
    null;

  let audioChunks =
    [];

  let timerId =
    null;

  let startedAt =
    0;

  let objectUrl =
    "";

  let pendingBlob =
    null;

  let pendingAudioData =
    "";

  let pendingClass =
    "";

  let recordingFinished =
    false;

   /* =========================================================
   ÇA COMMENCE ICI
   CHOIX DE LA VOIX SYNTHÉTIQUE
   ========================================================= */

let selectedVoiceMode =
  "real";


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

    return match[1].trim();

  }


  return (
    display ||
    "Je suis ravi aujourd’hui."
  );

}


function getSyntheticProfile(
  kind
){

  const cls =
    getCurrentClass()
      .toUpperCase();


  let boyPitch =
    1.25;


  if(
    /CP|CE1/.test(cls)
  ){

    boyPitch =
      1.38;

  }
  else if(
    /CE2|CM1/.test(cls)
  ){

    boyPitch =
      1.32;

  }
  else if(
    /CM2|6E/.test(cls)
  ){

    boyPitch =
      1.27;

  }
  else if(
    /5E|4E/.test(cls)
  ){

    boyPitch =
      1.18;

  }


  return {

    pitch:
      kind === "girl"
        ? Math.min(
            2,
            boyPitch + 0.12
          )
        : boyPitch,

    rate:
      0.92

  };

}


function speakSyntheticChild(
  kind
){

  if(
    !(
      "speechSynthesis" in window
    )
  ){

    alert(
      "La voix synthétique n'est pas disponible sur cet appareil."
    );

    return;

  }


  const text =
    getCurrentWordText();


  const profile =
    getSyntheticProfile(
      kind
    );


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang =
    "fr-FR";


  utterance.rate =
    profile.rate;


  utterance.pitch =
    profile.pitch;


  const volume =
    getElement(
      "bociteSchoolSimpleVolume"
    );


  utterance.volume =
    volume
      ? Number(
          volume.value
        )
      : 1;


  const frenchVoices =
    window.speechSynthesis
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


  if(
    frenchVoices.length
  ){

    utterance.voice =
      frenchVoices[0];

  }


  window.speechSynthesis.cancel();


  window.speechSynthesis.speak(
    utterance
  );

}

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */


  /* =====================================================
     OUTILS
     ===================================================== */

  function getElement(id){

    return document.getElementById(id);

  }


  function safeParse(
    value,
    fallback
  ){

    try{

      return JSON.parse(
        value
      );

    }catch(error){

      return fallback;

    }

  }


  function getCurrentClass(){

    const select =
      getElement(
        "schoolClassSelect"
      );


    return String(
      select &&
      select.value
        ? select.value
        : "Classe"
    ).trim();

  }


  function getSchoolZone(){

    /*
      Première source :
      configuration déjà affichée.
    */

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


    /*
      Deuxième source :
      configuration enregistrée.
    */

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


  function twoDigits(number){

    return String(
      number
    ).padStart(
      2,
      "0"
    );

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


  function formatDateFr(
    iso
  ){

    if(!iso){
      return "";
    }


    const parts =
      iso.split("-");


    if(
      parts.length !== 3
    ){
      return iso;
    }


    const date =
      new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
      );


    return date.toLocaleDateString(
      "fr-FR",
      {
        weekday:
          "long",

        day:
          "numeric",

        month:
          "long",

        year:
          "numeric"
      }
    );

  }


  function formatTime(
    milliseconds
  ){

    const totalSeconds =
      Math.max(
        0,
        Math.floor(
          milliseconds /
          1000
        )
      );


    const minutes =
      Math.floor(
        totalSeconds /
        60
      );


    const seconds =
      totalSeconds %
      60;


    return (
      twoDigits(minutes) +
      ":" +
      twoDigits(seconds)
    );

  }


  /* =====================================================
     MARQUE BO'CITÉART
     ===================================================== */

  function brandHtml(){

    return `

      <span
        style="
          display:inline-block;
          white-space:nowrap;
          font-size:17px;
          font-weight:700;
        ">

        <span
          style="
            color:#2f5d46;
          ">
          Bo’Cité
        </span><span
          style="
            color:#b00020;
          ">
          Art
        </span>

      </span>

    `;

  }


  /* =====================================================
     NETTOYAGE VISUEL DE L'ÉCRAN ÉCOLE
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

      /*
        ANCIEN BLOC TECHNIQUE
        MASQUÉ POUR LE PROFESSEUR
      */

      #schoolVoicePermissionPanel,
      #schoolRecordVoiceBtn,
      #schoolStopRecordVoiceBtn,
      #schoolPlayRecordedVoiceBtn,
      #schoolDeleteRecordedVoiceBtn,
      #schoolRecordedVoiceStatus{

        display:none !important;

      }


      /*
        TYPOGRAPHIE ÉCOLE
      */

      #modalBody.bociteSchoolClean{

        color:#111111 !important;

        font-size:14px !important;

        font-weight:400 !important;

        line-height:1.5 !important;

      }


      #modalBody.bociteSchoolClean p,
      #modalBody.bociteSchoolClean li,
      #modalBody.bociteSchoolClean .muted,
      #modalBody.bociteSchoolClean .box{

        color:#111111 !important;

        font-size:14px !important;

        font-weight:400 !important;

        line-height:1.5 !important;

      }


      #modalBody.bociteSchoolClean .miniField{

        color:#111111 !important;

        font-size:14px !important;

        font-weight:400 !important;

      }


      /*
        Les anciens petits titres
        très gras deviennent les titres
        verts de l'espace École.
      */

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


      .bociteSchoolSimpleText strong{

        font-weight:400 !important;

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


    document.head.appendChild(
      style
    );

  }


  function cleanSchoolTypography(){

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
      !modalBody
    ){
      return;
    }


    if(
      String(
        modalTitle.textContent ||
        ""
      )
      .trim()
      !==
      "École"
    ){
      return;
    }


    modalBody.classList.add(
      "bociteSchoolClean"
    );

  }


  /* =====================================================
     ARRÊT PROPRE DU MICRO
     ===================================================== */

  function stopTracks(){

    if(
      activeStream
    ){

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

    if(
      timerId
    ){

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

    if(
      objectUrl
    ){

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


  /* =====================================================
     OVERLAY
     ===================================================== */

  function closeOverlay(){

    /*
      Si l'enregistrement est encore actif,
      on l'arrête réellement.
    */

    if(
      recorder &&
      recorder.state ===
        "recording"
    ){

      try{

        recorder.stop();

      }catch(error){

        resetRecorderState();

      }

    }
    else{

      resetRecorderState();

    }


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

            Enregistrement de la voix

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
          style="
            margin-top:16px;
          ">
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
        function(){

          closeOverlay();

        };

    }


    return overlay;

  }


  /* =====================================================
     AUTORISATION PARENTALE
     ===================================================== */

  function voicePermissionAvailable(){

    if(
      !window.BociteSchoolParentalGuard
    ){

      return true;
    }


    if(
      typeof window
        .BociteSchoolParentalGuard
        .canUseCurrentVoice !==
          "function"
    ){

      return true;
    }


    return Boolean(
      window
        .BociteSchoolParentalGuard
        .canUseCurrentVoice()
    );

  }


  function showParentPermission(){

    createOverlay();


    const content =
      getElement(
        "bociteSchoolSimpleContent"
      );


    content.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle">

        Autorisation parentale nécessaire

      </div>


      <p>
        La vraie voix de cet élève
        ne peut pas encore être utilisée.
      </p>


      <p>
        La classe peut continuer
        avec la voix synthétique
        pendant que l'autorisation
        est demandée.
      </p>


      <button
        id="bociteSchoolSimpleAskParent"
        type="button"
        class="
          bociteSchoolSimpleButton
        ">

        Demander l'autorisation

      </button>


      <button
        id="bociteSchoolSimpleContinueWithoutVoice"
        type="button"
        class="
          bociteSchoolSimpleButton
          bociteSchoolSimpleSecondary
        ">

        Continuer sans vraie voix

      </button>

    `;


    const ask =
      getElement(
        "bociteSchoolSimpleAskParent"
      );


    const continueWithout =
      getElement(
        "bociteSchoolSimpleContinueWithoutVoice"
      );


    if(ask){

      ask.onclick =
        function(){

          closeOverlay();


          if(
            window.BociteSchoolParentalGuard &&
            typeof window
              .BociteSchoolParentalGuard
              .openDemoConsent ===
                "function"
          ){

            window
              .BociteSchoolParentalGuard
              .openDemoConsent();

          }

        };

    }


    if(continueWithout){

      continueWithout.onclick =
        closeOverlay;

    }

  }


  /* =====================================================
     CHOIX DU FORMAT AUDIO
     ===================================================== */

  function getRecorderOptions(){

    if(
      !window.MediaRecorder
    ){

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
        let index = 0;
        index <
        candidates.length;
        index += 1
      ){

        if(
          MediaRecorder.isTypeSupported(
            candidates[index]
          )
        ){

          return {
            mimeType:
              candidates[index]
          };

        }

      }

    }


    return {};

  }


  /* =====================================================
     TIMER
     ===================================================== */

  function updateRecordingTimer(){

    const time =
      getElement(
        "bociteSchoolSimpleTimer"
      );


    const bar =
      getElement(
        "bociteSchoolSimpleProgressBar"
      );


    if(
      !time ||
      !bar
    ){
      return;
    }


    const elapsed =
      Date.now() -
      startedAt;


    const remaining =
      Math.max(
        0,
        MAX_RECORDING_MS -
        elapsed
      );


    const percent =
      Math.min(
        100,
        (
          elapsed /
          MAX_RECORDING_MS
        ) *
        100
      );


    time.textContent =
      formatTime(elapsed) +
      " / 02:00";


    bar.style.width =
      percent +
      "%";


    if(
      remaining <= 0
    ){

      stopRecording();

    }

  }


  /* =====================================================
     DÉMARRER
     ===================================================== */

  async function startRecording(){

    if(
      !voicePermissionAvailable()
    ){

      showParentPermission();

      return;

    }


    if(
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices
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


    pendingBlob =
      null;

    pendingAudioData =
      "";

    recordingFinished =
      false;


    createOverlay();


    const content =
      getElement(
        "bociteSchoolSimpleContent"
      );


    content.innerHTML = `

      <p>
        Préparation du microphone…
      </p>

    `;


    try{

      activeStream =
        await navigator.mediaDevices
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
            event.data.size >
              0
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
                type:
                  mimeType
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


          recordingFinished =
            true;


          showRecordingReview();

        };


      content.innerHTML = `

        <div
          class="bociteSchoolSimpleTitle">

          Enregistrement en cours

        </div>


        <p>
          Parlez normalement.
          L'enregistrement s'arrêtera
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
          ">

          00:00 / 02:00

        </div>


        <div
          id="bociteSchoolSimpleProgress">

          <div
            id="bociteSchoolSimpleProgressBar">
          </div>

        </div>


        <button
          id="bociteSchoolSimpleStop"
          type="button"
          class="bociteSchoolSimpleButton">

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

        "Le microphone n'a pas pu être utilisé. " +
        "Vérifiez son autorisation dans le navigateur puis recommencez."

      );

    }

  }


  /* =====================================================
     STOP
     ===================================================== */

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
     ERREUR
     ===================================================== */

  function showRecordingError(
    message
  ){

    const content =
      getElement(
        "bociteSchoolSimpleContent"
      );


    if(!content){
      return;
    }


    content.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle">

        Enregistrement interrompu

      </div>


      <p>
        ${message}
      </p>


      <button
        id="bociteSchoolSimpleRetry"
        type="button"
        class="bociteSchoolSimpleButton">

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


  /* =====================================================
     ÉCOUTE AVANT VALIDATION
     ===================================================== */

/* =========================================================
   ÇA COMMENCE ICI
   ÉCOUTE + CHOIX DE LA VOIX
   RÉELLE / FILLE / GARÇON
   ========================================================= */

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


  revokeObjectUrl();


  objectUrl =
    URL.createObjectURL(
      pendingBlob
    );


  /*
    Par défaut :
    on conserve la vraie voix enregistrée.
  */

  selectedVoiceMode =
    "real";


  content.innerHTML = `

    <div
      class="bociteSchoolSimpleTitle">

      Écoutez avant de valider

    </div>


    <p>
      Écoutez la voix enregistrée,
      puis choisissez celle
      que vous souhaitez utiliser.
    </p>


    <audio
      id="bociteSchoolSimpleAudio"
      controls
      preload="metadata"
      style="
        display:block;
        width:100%;
        margin-top:14px;
      ">
    </audio>


    <button
      id="bociteSchoolPlayRealVoice"
      type="button"
      class="bociteSchoolSimpleButton">

      ▶ Écouter la voix enregistrée

    </button>


    <label
      for="bociteSchoolSimpleVolume"
      style="
        display:block;
        margin-top:16px;
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
      style="
        width:100%;
        margin-top:8px;
      "
    >


    <div
      class="bociteSchoolSimpleTitle"
      style="
        margin-top:22px;
      ">

      Ou utiliser une voix synthétique

    </div>


    <p>
      Si la vraie voix de l'enfant
      ne peut pas être utilisée,
      choisissez une voix fille
      ou garçon adaptée à sa classe.
    </p>


    <div
      style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:12px;
      ">

      <button
        id="bociteSchoolSyntheticGirl"
        type="button"
        class="bociteSchoolSimpleButton"
        style="
          margin-top:0;
        ">

        ▶ Fille

      </button>


      <button
        id="bociteSchoolSyntheticBoy"
        type="button"
        class="bociteSchoolSimpleButton"
        style="
          margin-top:0;
        ">

        ▶ Garçon

      </button>

    </div>


    <div
      id="bociteSchoolVoiceSelected"
      style="
        margin-top:14px;
        padding:12px;
        border:1px solid #dedede;
        border-radius:10px;
        background:#ffffff;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.5;
      ">

      Voix choisie :
      voix réelle enregistrée.

    </div>


    <button
      id="bociteSchoolSimpleValidateAudio"
      type="button"
      class="bociteSchoolSimpleButton">

      ✓ Valider la voix choisie

    </button>


    <button
      id="bociteSchoolSimpleRetryAudio"
      type="button"
      class="
        bociteSchoolSimpleButton
        bociteSchoolSimpleSecondary
      ">

      Recommencer l'enregistrement

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


  const real =
    getElement(
      "bociteSchoolPlayRealVoice"
    );


  const girl =
    getElement(
      "bociteSchoolSyntheticGirl"
    );


  const boy =
    getElement(
      "bociteSchoolSyntheticBoy"
    );


  const selected =
    getElement(
      "bociteSchoolVoiceSelected"
    );


  const validate =
    getElement(
      "bociteSchoolSimpleValidateAudio"
    );


  const retry =
    getElement(
      "bociteSchoolSimpleRetryAudio"
    );


  function showChoice(
    text
  ){

    if(selected){

      selected.textContent =
        "Voix choisie : " +
        text +
        ".";

    }

  }


  /*
    On affecte directement
    le fichier audio temporaire.
  */

  if(audio){

    audio.src =
      objectUrl;

    audio.load();

  }


  /*
    Volume commun :
    vraie voix + voix synthétique.
  */

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


  /*
    ÉCOUTER LA VRAIE VOIX
  */

  if(real){

    real.onclick =
      function(){

        selectedVoiceMode =
          "real";


        showChoice(
          "voix réelle enregistrée"
        );


        if(!audio){
          return;
        }


        /*
          Coupe éventuellement
          une voix synthétique.
        */

        if(
          window.speechSynthesis
        ){

          window.speechSynthesis
            .cancel();

        }


        audio.volume =
          volume
            ? Number(
                volume.value
              )
            : 1;


        try{

          audio.currentTime =
            0;

        }catch(error){

          /* rien */

        }


        const playPromise =
          audio.play();


        if(
          playPromise &&
          typeof playPromise.catch ===
            "function"
        ){

          playPromise.catch(
            function(error){

              console.error(
                "Bo'CitéArt — lecture audio :",
                error
              );


              alert(
                "La voix enregistrée n'a pas pu être lue. Vous pouvez recommencer l'enregistrement ou choisir une voix synthétique."
              );

            }
          );

        }

      };

  }


  /*
    VOIX SYNTHÉTIQUE — FILLE
  */

  if(girl){

    girl.onclick =
      function(){

        selectedVoiceMode =
          "synthetic-girl";


        if(audio){

          audio.pause();

        }


        showChoice(
          "voix synthétique enfant — fille"
        );


        speakSyntheticChild(
          "girl"
        );

      };

  }


  /*
    VOIX SYNTHÉTIQUE — GARÇON
  */

  if(boy){

    boy.onclick =
      function(){

        selectedVoiceMode =
          "synthetic-boy";


        if(audio){

          audio.pause();

        }


        showChoice(
          "voix synthétique enfant — garçon"
        );


        speakSyntheticChild(
          "boy"
        );

      };

  }


  /*
    VALIDATION
  */

  if(validate){

    validate.onclick =
      function(){

        if(
          window.speechSynthesis
        ){

          window.speechSynthesis
            .cancel();

        }


        /*
          VRAIE VOIX :
          on convertit le fichier audio
          avant le calendrier.
        */

        if(
          selectedVoiceMode ===
            "real"
        ){

          convertPendingAudio();

          return;

        }


        /*
          VOIX SYNTHÉTIQUE :
          aucun fichier contenant
          la voix réelle de l'enfant
          n'est conservé.
        */

        pendingAudioData =
          "";


        showCalendarStep();

      };

  }


  /*
    RECOMMENCER
  */

  if(retry){

    retry.onclick =
      function(){

        if(
          window.speechSynthesis
        ){

          window.speechSynthesis
            .cancel();

        }


        if(audio){

          audio.pause();

        }


        revokeObjectUrl();


        pendingBlob =
          null;


        pendingAudioData =
          "";


        selectedVoiceMode =
          "real";


        startRecording();

      };

  }

}

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */

  /* =====================================================
     CONVERSION APRÈS VALIDATION
     ===================================================== */

  function convertPendingAudio(){

    if(
      !pendingBlob
    ){
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
     JOURS FÉRIÉS FRANÇAIS
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
        (b + 8) /
        25
      );

    const g =
      Math.floor(
        (b - f + 1) /
        3
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


  function addDays(
    date,
    days
  ){

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


  function isFrenchPublicHoliday(
    iso
  ){

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


  /* =====================================================
     CONTRÔLE CALENDRIER SCOLAIRE OFFICIEL
     ===================================================== */

  async function isOfficialSchoolHoliday(
    iso
  ){

    const zone =
      getSchoolZone();


    const zoneName =
      "Zone " +
      zone;


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
      'zones:"' +
      zoneName +
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


    if(
      !response.ok
    ){

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
      data.results.length >
        0
    );

  }


  /* =====================================================
     CHOIX DE LA DATE
     ===================================================== */

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


    content.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle">

        Choisissez le jour

      </div>


      <p>
        L'enregistrement est prêt.
      </p>


      <p>
        Vous pouvez choisir aujourd'hui
        ou l'un des prochains jours,
        dans la limite d'une semaine.
      </p>


      <p>
        Les week-ends, jours fériés
        et vacances scolaires
        ne sont pas programmables.
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

        Valider cette date

      </button>


      <button
        id="bociteSchoolSimpleBackToAudio"
        type="button"
        class="
          bociteSchoolSimpleButton
          bociteSchoolSimpleSecondary
        ">

        Réécouter avant de choisir

      </button>

    `;


    const schedule =
      getElement(
        "bociteSchoolSimpleSchedule"
      );


    const back =
      getElement(
        "bociteSchoolSimpleBackToAudio"
      );


    if(schedule){

      schedule.onclick =
        validateScheduleDate;

    }


    if(back){

      back.onclick =
        showRecordingReview;

    }

  }


  /* =====================================================
     VALIDATION DE LA DATE
     ===================================================== */

  async function validateScheduleDate(){

    const dateField =
      getElement(
        "bociteSchoolSimpleDate"
      );


    const message =
      getElement(
        "bociteSchoolSimpleDateMessage"
      );


    const scheduleButton =
      getElement(
        "bociteSchoolSimpleSchedule"
      );


    const iso =
      String(
        dateField &&
        dateField.value
          ? dateField.value
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


    if(
      !iso
    ){

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


    const day =
      date.getDay();


    /*
      Samedi + dimanche exclus.
    */

    if(
      day === 0 ||
      day === 6
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


    if(scheduleButton){

      scheduleButton.disabled =
        true;

      scheduleButton.textContent =
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


        if(scheduleButton){

          scheduleButton.disabled =
            false;

          scheduleButton.textContent =
            "Valider cette date";

        }


        return;

      }


      saveSchedule(
        iso
      );


      showScheduleSuccess(
        iso
      );

    }catch(error){

      console.error(
        "Bo'CitéArt — calendrier scolaire :",
        error
      );


      /*
        Si le calendrier officiel
        ne répond pas, on ne programme
        pas au hasard.
      */

      showMessage(
        "Le calendrier scolaire officiel n'a pas pu être vérifié. Réessayez dans quelques instants."
      );


      if(scheduleButton){

        scheduleButton.disabled =
          false;

        scheduleButton.textContent =
          "Valider cette date";

      }

    }

  }


  /* =====================================================
     STOCKAGE DES PROGRAMMATIONS
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


      return Array.isArray(data)
        ? data
        : [];

    }catch(error){

      return [];

    }

  }


  function saveSchedule(
    iso
  ){

    const rows =
      loadSchedule();


    /*
      Une programmation par
      classe + date.
    */

    const filtered =
      rows.filter(
        function(item){

          return !(
            item &&
            item.class ===
              pendingClass &&
            item.date ===
              iso
          );

        }
      );


    filtered.push({

      id:
        "school-voice-" +
        Date.now(),

      class:
        pendingClass,

      date:
        iso,

      audioData:
        pendingAudioData,

      mimeType:
        pendingBlob
          ? pendingBlob.type
          : "audio/webm",

      createdAt:
        new Date()
          .toISOString(),

      createdAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )

    });


    try{

      localStorage.setItem(
        SCHEDULE_KEY,
        JSON.stringify(
          filtered
        )
      );

    }catch(error){

      console.error(
        "Bo'CitéArt — programmation impossible :",
        error
      );

    }


    /*
      Si la date choisie est aujourd'hui,
      on rend immédiatement
      l'enregistrement disponible
      au système existant.
    */

    activateTodaySchedule();

  }


  /* =====================================================
     ACTIVER L'ENREGISTREMENT DU JOUR
     POUR LE MOTEUR ÉCOLE EXISTANT
     ===================================================== */

  function activateTodaySchedule(){

    const cls =
      getCurrentClass();


    const today =
      todayIso();


    const row =
      loadSchedule()
      .find(
        function(item){

          return (
            item &&
            item.class ===
              cls &&
            item.date ===
              today &&
            item.audioData
          );

        }
      );


    if(!row){
      return;
    }


    let legacy = {};


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

      legacy = {};

    }


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
        Date.now(),

      savedAtFr:
        new Date()
          .toLocaleString(
            "fr-FR"
          )

    };


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

  }


  /* =====================================================
     SUCCÈS
     ===================================================== */

  function showScheduleSuccess(
    iso
  ){

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


    content.innerHTML = `

      <div
        class="bociteSchoolSimpleTitle">

        C'est enregistré

      </div>


      <p>
        La voix a été préparée pour :
      </p>


      <p
        style="
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
        ">

        ${formatDateFr(iso)}

      </p>


      <p>
        Classe :
        ${pendingClass}
      </p>


      <p>
        Le professeur ou la personne autorisée
        garde ainsi la main sur chaque journée.
      </p>


      <button
        id="bociteSchoolSimpleFinish"
        type="button"
        class="bociteSchoolSimpleButton">

        Terminer

      </button>

    `;


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
     PANNEAU SIMPLE DANS ÉCOLE
     ===================================================== */

  function getTodaySchedule(){

    const cls =
      getCurrentClass();


    const today =
      todayIso();


    return (
      loadSchedule()
        .find(
          function(item){

            return (
              item &&
              item.class ===
                cls &&
              item.date ===
                today
            );

          }
        ) ||
      null
    );

  }


  function refreshSimplePanel(){

    const status =
      getElement(
        "bociteSchoolSimpleVoiceStatus"
      );


    if(!status){
      return;
    }


    activateTodaySchedule();


    const today =
      getTodaySchedule();


    if(today){

      status.textContent =
        "La voix du Mot du jour est prête pour aujourd'hui.";

    }
    else{

      status.textContent =
        "Aucune vraie voix n'est programmée pour aujourd'hui.";

    }

  }


  function installSimplePanel(){

    cleanSchoolTypography();


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


    if(
      getElement(
        "bociteSchoolSimpleVoicePanel"
      )
    ){

      refreshSimplePanel();

      return;

    }


    /*
      On utilise l'emplacement
      de l'ancien bouton vocal
      comme point de repère.
    */

    const oldRecordButton =
      getElement(
        "schoolRecordVoiceBtn"
      );


    if(!oldRecordButton){
      return;
    }


    let parent =
      oldRecordButton
        .parentElement;


    if(
      parent &&
      parent.parentElement
    ){

      parent =
        parent.parentElement;

    }


    if(!parent){
      return;
    }


    const panel =
      document.createElement(
        "div"
      );


    panel.id =
      "bociteSchoolSimpleVoicePanel";


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
        class="bociteSchoolSimpleTitle">

        La voix du Mot du jour

      </div>


      <p
        class="bociteSchoolSimpleText"
        style="
          margin:10px 0 0 0;
        ">

        Enregistrez la voix,
        écoutez-la,
        puis choisissez le jour
        où elle doit être utilisée.

      </p>


      <div
        id="bociteSchoolSimpleVoiceStatus"
        class="bociteSchoolSimpleText"
        style="
          margin-top:10px;
        ">
      </div>


      <button
        id="bociteSchoolSimpleStart"
        type="button"
        class="bociteSchoolSimpleButton">

        🎙 Enregistrer la voix de l'élève

      </button>


      <div
        class="bociteSchoolSimpleText"
        style="
          margin-top:10px;
        ">

        2 minutes maximum.
        Arrêt automatique.

      </div>

    `;


    parent.insertBefore(
      panel,
      parent.firstChild
    );


    const start =
      getElement(
        "bociteSchoolSimpleStart"
      );


    if(start){

      start.onclick =
        startRecording;

    }


    refreshSimplePanel();

  }


  /* =====================================================
     DÉTECTION DE L'ÉCRAN ÉCOLE
     ===================================================== */

  const observer =
    new MutationObserver(
      function(){

        window.setTimeout(
          installSimplePanel,
          0
        );

      }
    );


  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );


  /*
    Si le professeur change de classe,
    on actualise le statut.
  */

  document.addEventListener(
    "change",
    function(event){

      if(
        event.target &&
        event.target.id ===
          "schoolClassSelect"
      ){

        window.setTimeout(
          refreshSimplePanel,
          0
        );

      }

    },
    true
  );


  /*
    Lorsqu'une autorisation parentale
    change, le parcours simple
    la prend en compte automatiquement.
  */

  document.addEventListener(
    "bociteart:parent-permission-updated",
    function(){

      window.setTimeout(
        refreshSimplePanel,
        50
      );

    }
  );


  /*
    Fermeture de la fenêtre École :
    on libère toujours le microphone.
  */

  document.addEventListener(
    "click",
    function(event){

      const target =
        event.target &&
        typeof event.target.closest ===
          "function"
          ? event.target.closest(
              ".xbtn,#xBtn"
            )
          : null;


      if(!target){
        return;
      }


      const modalTitle =
        getElement(
          "modalTitle"
        );


      if(
        modalTitle &&
        String(
          modalTitle.textContent ||
          ""
        ).trim() ===
          "École"
      ){

        resetRecorderState();

      }

    },
    true
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

    close:
      closeOverlay

  };


  installStyles();


  window.setTimeout(
    installSimplePanel,
    100
  );


  console.log(
    "✅ Mot du jour — parcours professeur simplifié chargé"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
