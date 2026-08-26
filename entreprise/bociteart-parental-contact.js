/* =========================================================
   ÇA COMMENCE ICI

   BO'CITÉART — MOINS DE 15 ANS
   LIEN AVEC UN PARENT OU RESPONSABLE

   IMPORTANT :
   - cette étape ne bloque jamais le jeune ;
   - elle ne donne aucune autorisation générale ;
   - elle prépare seulement le rattachement
     d'un parent ou responsable ;
   - les autorisations particulières
     seront demandées ensuite, fonction par fonction.

   DÉMO :
   aucun e-mail réel n'est envoyé depuis GitHub Pages.

   PRODUCTION :
   envoi du lien + validation + preuve
   exclusivement côté serveur.
   ========================================================= */

(function initBociteParentalContact(){

  "use strict";


  if(
    window.BociteParentalContact
  ){
    return;
  }


  const OVERLAY_ID =
    "bociteParentalContactOverlay";


  const STORAGE_KEY =
    "bociteart_parent_contact_request_v1";


  /* =====================================================
     OUTILS
     ===================================================== */

  function normalizeEmail(
    value
  ){

    return String(
      value || ""
    )
    .trim()
    .toLowerCase();

  }


  function emailIsValid(
    email
  ){

    return (
      email &&
      email.includes("@") &&
      email.includes(".")
    );

  }


  function createRequestId(){

    if(
      window.crypto &&
      typeof window.crypto.randomUUID ===
        "function"
    ){

      return (
        "parent-" +
        window.crypto.randomUUID()
      );

    }


    return (
      "parent-" +
      Date.now().toString(36) +
      "-" +
      Math.random()
        .toString(36)
        .slice(2,12)
    );

  }


  function savePendingRequest(
    request
  ){

    try{

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          request
        )
      );

      return true;

    }catch(error){

      console.warn(
        "Bo'CitéArt : demande parentale non enregistrée.",
        error
      );

      return false;

    }

  }


  function getPendingRequest(){

    try{

      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );


      return raw
        ? JSON.parse(raw)
        : null;

    }catch(error){

      return null;

    }

  }


  function clearPendingRequest(){

    try{

      localStorage.removeItem(
        STORAGE_KEY
      );

    }catch(error){

      /* rien */

    }

  }


  function getAccount(){

    try{

      if(
        window.BoCiteArtRegistration &&
        typeof window
          .BoCiteArtRegistration
          .getAccount ===
            "function"
      ){

        return (
          window
            .BoCiteArtRegistration
            .getAccount() ||
          null
        );

      }

    }catch(error){

      /* secours plus bas */

    }


    try{

      const raw =
        localStorage.getItem(
          "bociteart_account_demo_v1"
        );


      return raw
        ? JSON.parse(raw)
        : null;

    }catch(error){

      return null;

    }

  }


  /* =====================================================
     FERMETURE
     ===================================================== */

  function close(){

    const overlay =
      document.getElementById(
        OVERLAY_ID
      );


    if(overlay){
      overlay.remove();
    }

  }


  /* =====================================================
     ÉCRAN JEUNE
     ===================================================== */

  function open(
    options
  ){

    options =
      options || {};


    close();


    const account =
      options.account ||
      getAccount() ||
      {};


    const onContinue =
      typeof options.onContinue ===
        "function"
        ? options.onContinue
        : function(){};


    const overlay =
      document.createElement(
        "div"
      );


    overlay.id =
      OVERLAY_ID;


    overlay.style.cssText = `

      position:fixed;
      inset:0;
      z-index:1000002;

      overflow:auto;

      box-sizing:border-box;

      padding:16px 10px 34px;

      background:#f3eddf;

      font-family:Arial,sans-serif;

    `;


    overlay.innerHTML = `

      <div
        style="
          width:100%;
          max-width:650px;
          margin:0 auto;
          box-sizing:border-box;
          padding:20px 16px;
          border:2px solid #2f5d46;
          border-radius:15px;
          background:#fffdf7;
          color:#111111;
        ">


        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            line-height:1.35;
            margin-bottom:14px;
          ">

          Pour aller plus loin avec un parent
          ou responsable

        </div>


        <div
          style="
            font-size:14px;
            line-height:1.55;
          ">

          Tu peux continuer à découvrir
          <strong>Bo'CitéArt</strong>
          sans attendre.

          <br><br>

          Certaines fonctions pourront cependant
          demander plus tard l'accord d'un parent
          ou responsable.

          <br><br>

          Si tu le souhaites, tu peux dès maintenant
          indiquer son adresse électronique afin que
          <strong>Bo'CitéArt</strong> puisse préparer
          cette liaison.

        </div>


        <div
          style="
            margin-top:18px;
            padding:14px;
            background:#ffffff;
            border:1px solid #dedede;
            border-radius:10px;
            color:#111111;
            font-size:14px;
            line-height:1.55;
          ">

          <strong
            style="
              color:#2f5d46;
            ">
            Information destinée au parent
            ou responsable
          </strong>

          <br><br>

          Bo'CitéArt souhaite aussi aider
          les jeunes à mieux comprendre
          progressivement la réalité économique
          du territoire dans lequel ils grandissent.

          <br><br>

          Il ne s'agit pas de leur dire
          ce qu'ils doivent acheter.

          <br><br>

          Il s'agit de leur permettre de comprendre
          que certains choix du quotidien peuvent
          contribuer à faire vivre un petit commerce,
          un artisan, un producteur, un emploi,
          un métier ou un savoir-faire.

          <br><br>

          Ils pourront également apprendre
          à mieux découvrir les productions locales,
          régionales, françaises, ultramarines,
          artisanales, responsables ou équitables
          et, lorsque cela a du sens,
          certaines productions européennes
          de qualité.

          <br><br>

          <strong>
            Mieux connaître ce qui existe autour
            de soi permet aussi de mieux comprendre
            ce que l'on souhaite préserver,
            soutenir ou faire évoluer demain.
          </strong>

          <br><br>

          L'objectif reste de donner au jeune
          davantage de repères pour qu'il puisse
          progressivement se faire sa propre opinion
          et comprendre que ses choix peuvent aussi
          participer à la préservation d'un patrimoine
          économique, humain et culturel
          qui concerne son avenir.

        </div>


        <div
          style="
            margin-top:18px;
          ">

          <label
            for="bociteParentEmail"
            style="
              display:block;
              margin-bottom:7px;
              color:#111111;
              font-size:14px;
              font-weight:700;
            ">

            Adresse e-mail du parent
            ou responsable

          </label>


          <input
            id="bociteParentEmail"
            type="email"
            autocomplete="email"
            placeholder="exemple@adresse.fr"
            style="
              display:block;
              width:100%;
              box-sizing:border-box;
              padding:12px;
              border:2px solid #2f5d46;
              border-radius:9px;
              background:#ffffff;
              color:#111111;
              font-size:16px;
            "
          >

        </div>


        <div
          id="bociteParentRequestMessage"
          role="alert"
          style="
            display:none;
            margin-top:14px;
            padding:12px;
            border-radius:9px;
            background:#ffffff;
            border:1px solid #dedede;
            color:#111111;
            font-size:14px;
            line-height:1.5;
          ">
        </div>


        <button
          id="bociteParentRequestBtn"
          type="button"
          class="choiceBtn"
          style="
            width:100%;
            margin-top:16px;
          ">

          Préparer la demande pour mon parent

        </button>


        <button
          id="bociteParentSkipBtn"
          type="button"
          class="choiceBtn"
          style="
            width:100%;
            margin-top:10px;
          ">

          Continuer sans attendre

        </button>


        <div
          style="
            margin-top:15px;
            color:#444444;
            font-size:13px;
            line-height:1.45;
          ">

          Cette étape ne donne aucune autorisation
          générale.

          <br><br>

          Si une fonction particulière nécessite
          plus tard un accord — par exemple la
          diffusion de la voix pour le Mot du jour,
          une image, une vidéo ou une création —
          une demande distincte précisera exactement
          ce qui est proposé.

        </div>

      </div>

    `;


    document.body.appendChild(
      overlay
    );


    const emailField =
      document.getElementById(
        "bociteParentEmail"
      );


    const requestButton =
      document.getElementById(
        "bociteParentRequestBtn"
      );


    const skipButton =
      document.getElementById(
        "bociteParentSkipBtn"
      );


    const message =
      document.getElementById(
        "bociteParentRequestMessage"
      );


    requestButton.onclick =
      function(){

        const parentEmail =
          normalizeEmail(
            emailField
              ? emailField.value
              : ""
          );


        if(
          !emailIsValid(
            parentEmail
          )
        ){

          if(message){

            message.style.display =
              "block";

            message.textContent =
              "Indique une adresse e-mail valide ou choisis « Continuer sans attendre ».";

          }

          return;

        }


        const request = {

          requestId:
            createRequestId(),

          accountId:
            account.accountId ||
            "",

          youngCategory:
            "jeune",

          parentEmail:
            parentEmail,

          purpose:
            "parent_contact_link",

          status:
            "pending_server_send",

          /*
            AUCUNE autorisation particulière
            n'est accordée ici.
          */

          permissions:
            [],

          createdAt:
            new Date().toISOString(),

          version:
            "1"

        };


        savePendingRequest(
          request
        );


        document.dispatchEvent(
          new CustomEvent(
            "bociteart:parent-contact-requested",
            {
              detail:{

                requestId:
                  request.requestId,

                accountId:
                  request.accountId,

                parentEmail:
                  request.parentEmail,

                purpose:
                  request.purpose

              }
            }
          )
        );


        if(message){

          message.style.display =
            "block";

          message.innerHTML = `

            <strong>
              Demande préparée.
            </strong>

            <br><br>

            Dans la démonstration actuelle,
            aucun e-mail réel n'est encore envoyé.

            <br><br>

            En production, Bo'CitéArt enverra
            à cette adresse un lien unique
            permettant au parent ou responsable
            de confirmer son rattachement.

            <br><br>

            Tu peux continuer maintenant.

          `;

        }

      };


    skipButton.onclick =
      function(){

        close();

        onContinue();

      };


    overlay.scrollTop =
      0;

  }


  /* =====================================================
     API
     ===================================================== */

  window.BociteParentalContact = {

    open:
      open,

    close:
      close,

    getPendingRequest:
      getPendingRequest,

    clearPendingRequest:
      clearPendingRequest,

    storageKey:
      STORAGE_KEY

  };


  console.log(
    "✅ Liaison parentale Moins de 15 ans préparée"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
