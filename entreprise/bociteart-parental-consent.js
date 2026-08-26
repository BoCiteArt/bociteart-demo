/* =========================================================
   ÇA COMMENCE ICI

   BO'CITÉART — AUTORISATION PARENTALE
   VERSION DÉMONSTRATION

   Première autorisation :
   → VOIX DE L'ENFANT / MOT DU JOUR

   IMPORTANT :
   - aucune autorisation générale ;
   - chaque usage est autorisé séparément ;
   - le parent peut refuser ;
   - le jeune continue à utiliser Bo'CitéArt ;
   - en production, le lien et la vérification
     seront gérés côté serveur.
   ========================================================= */

(function initBociteParentalConsent(){

  "use strict";


  if(window.BociteParentalConsent){
    return;
  }


  const OVERLAY_ID =
    "bociteParentalConsentOverlay";


  const STORAGE_KEY =
    "bociteart_parent_permissions_v1";


  /* =====================================================
     STOCKAGE
     ===================================================== */

  function readPermissions(){

    try{

      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );


      return raw
        ? JSON.parse(raw)
        : {};

    }catch(error){

      return {};

    }

  }


  function savePermissions(
    permissions
  ){

    try{

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          permissions
        )
      );

      return true;

    }catch(error){

      console.warn(
        "Bo'CitéArt : autorisation parentale non enregistrée.",
        error
      );

      return false;

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
     AUTORISATION MOT DU JOUR
     ===================================================== */

  function openMotDuJour(
    options
  ){

    options =
      options || {};


    close();


    const parentEmail =
      String(
        options.parentEmail || ""
      )
      .trim()
      .toLowerCase();


    const youngAccountId =
      String(
        options.accountId || ""
      );


    const overlay =
      document.createElement(
        "div"
      );


    overlay.id =
      OVERLAY_ID;


    overlay.style.cssText = `

      position:fixed;
      inset:0;
      z-index:1000005;

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
          max-width:680px;
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
            margin-bottom:15px;
          ">

          Autorisation parentale —
          Mot du jour

        </div>


        <div
          style="
            font-size:14px;
            line-height:1.55;
          ">

          Cette autorisation concerne uniquement
          l'utilisation de la voix de votre enfant
          dans la rubrique
          <strong>« Mot du jour »</strong>
          de Bo'CitéArt.

          <br><br>

          Elle ne donne aucune autorisation générale
          pour d'autres utilisations de son image,
          de sa voix ou de ses créations.

        </div>


        <div
          style="
            margin-top:18px;
            padding:14px;
            background:#ffffff;
            border:1px solid #dedede;
            border-radius:10px;
            font-size:14px;
            line-height:1.55;
          ">

          <strong
            style="
              color:#2f5d46;
            ">
            Ce que vous autorisez
          </strong>

          <br><br>

          Vous autorisez l'enseignant
          ou l'établissement scolaire
          à transmettre à Bo'CitéArt
          l'enregistrement vocal de votre enfant.

          <br><br>

          Vous autorisez également Bo'CitéArt
          à utiliser et diffuser cet enregistrement
          dans la rubrique
          <strong>« Mot du jour »</strong>,
          dans le cadre pédagogique prévu.

          <br><br>

          Le nom de famille de l'enfant
          n'a pas vocation à être affiché
          avec l'enregistrement.

          <br><br>

          Cette autorisation pourra être retirée
          pour les utilisations futures.

        </div>


        <div
          style="
            margin-top:18px;
            padding:14px;
            background:#ffffff;
            border:1px solid #dedede;
            border-radius:10px;
            font-size:14px;
            line-height:1.55;
          ">

          <strong
            style="
              color:#2f5d46;
            ">
            Pourquoi Bo'CitéArt propose cette participation
          </strong>

          <br><br>

          Le Mot du jour permet au jeune
          de participer autrement à la vie collective,
          de prendre confiance,
          de transmettre une idée,
          une valeur ou une attention
          et de découvrir que sa parole
          peut aussi avoir une place.

          <br><br>

          Plus largement, Bo'CitéArt souhaite
          progressivement aider les jeunes
          à mieux connaître leur territoire,
          ses métiers, ses commerces,
          ses artisans, ses producteurs
          et ses savoir-faire.

          <br><br>

          L'objectif n'est pas de leur dire
          ce qu'ils doivent acheter
          ou penser.

          <br><br>

          Il s'agit de leur permettre
          de mieux comprendre que leurs choix
          peuvent avoir des conséquences
          sur l'activité locale,
          les emplois,
          les petits commerces,
          les productions locales,
          régionales ou françaises
          et sur une partie du patrimoine
          économique et humain
          qu'ils retrouveront demain.

          <br><br>

          <strong>
            Mieux connaître ce qui nous entoure
            aide aussi à décider plus tard
            ce que l'on souhaite préserver,
            soutenir ou faire évoluer.
          </strong>

        </div>


        <label
          style="
            display:block;
            margin-top:18px;
            padding:14px;
            background:#ffffff;
            border:1px solid #dedede;
            border-radius:10px;
            font-size:14px;
            line-height:1.5;
          ">

          <input
            id="bociteParentLegalConfirm"
            type="checkbox"
            style="
              margin-right:8px;
              transform:scale(1.2);
            "
          >

          Je confirme être titulaire
          de l'autorité parentale
          ou représentant légal
          de l'enfant concerné.

        </label>


        <label
          style="
            display:block;
            margin-top:12px;
            padding:14px;
            background:#ffffff;
            border:1px solid #dedede;
            border-radius:10px;
            font-size:14px;
            line-height:1.5;
          ">

          <input
            id="bociteParentVoiceConsent"
            type="checkbox"
            style="
              margin-right:8px;
              transform:scale(1.2);
            "
          >

          J'autorise l'utilisation
          de la voix de mon enfant
          dans les conditions décrites ci-dessus.

        </label>


        <div
          id="bociteParentConsentMessage"
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
          id="bociteParentConsentAccept"
          type="button"
          class="choiceBtn"
          style="
            width:100%;
            margin-top:16px;
          ">

          Valider cette autorisation

        </button>


        <button
          id="bociteParentConsentRefuse"
          type="button"
          class="choiceBtn"
          style="
            width:100%;
            margin-top:10px;
          ">

          Je n'autorise pas cette utilisation

        </button>


        <div
          style="
            margin-top:16px;
            color:#555555;
            font-size:13px;
            line-height:1.45;
          ">

          Version démonstration :
          cette page ne constitue pas encore
          une vérification réelle de l'identité
          du parent.

          <br><br>

          En production, elle sera ouverte
          depuis un lien unique envoyé directement
          au parent ou responsable et validé
          côté serveur.

        </div>

      </div>

    `;


    document.body.appendChild(
      overlay
    );


    const legalConfirm =
      document.getElementById(
        "bociteParentLegalConfirm"
      );


    const voiceConsent =
      document.getElementById(
        "bociteParentVoiceConsent"
      );


    const acceptButton =
      document.getElementById(
        "bociteParentConsentAccept"
      );


    const refuseButton =
      document.getElementById(
        "bociteParentConsentRefuse"
      );


    const message =
      document.getElementById(
        "bociteParentConsentMessage"
      );


    acceptButton.onclick =
      function(){

        if(
          !legalConfirm.checked ||
          !voiceConsent.checked
        ){

          message.style.display =
            "block";


          message.textContent =
            "Les deux confirmations doivent être cochées pour autoriser cette utilisation.";


          return;

        }


        const permissions =
          readPermissions();


        permissions.motDuJourVoice = {

          status:
            "authorized",

          accountId:
            youngAccountId,

          parentEmail:
            parentEmail,

          authorizedAt:
            new Date().toISOString(),

          permissionVersion:
            "1",

          /*
            En démonstration seulement.
            Ne jamais présenter ceci
            comme une vérification réelle.
          */

          verification:
            "demo_unverified"

        };


        savePermissions(
          permissions
        );


        document.dispatchEvent(
          new CustomEvent(
            "bociteart:parent-permission-updated",
            {
              detail:{

                permission:
                  "mot_du_jour_voice",

                status:
                  "authorized",

                accountId:
                  youngAccountId

              }
            }
          )
        );


        message.style.display =
          "block";


        message.innerHTML = `

          <strong>
            Autorisation enregistrée
            pour la démonstration.
          </strong>

          <br><br>

          Elle concerne uniquement
          la voix de l'enfant
          pour le Mot du jour.

        `;


        window.setTimeout(
          close,
          1400
        );

      };


    refuseButton.onclick =
      function(){

        const permissions =
          readPermissions();


        permissions.motDuJourVoice = {

          status:
            "refused",

          accountId:
            youngAccountId,

          parentEmail:
            parentEmail,

          decidedAt:
            new Date().toISOString(),

          permissionVersion:
            "1",

          verification:
            "demo_unverified"

        };


        savePermissions(
          permissions
        );


        document.dispatchEvent(
          new CustomEvent(
            "bociteart:parent-permission-updated",
            {
              detail:{

                permission:
                  "mot_du_jour_voice",

                status:
                  "refused",

                accountId:
                  youngAccountId

              }
            }
          )
        );


        close();

      };


    overlay.scrollTop =
      0;

  }


  /* =====================================================
     CONSULTATION D'UNE AUTORISATION
     ===================================================== */

  function getPermission(
    name
  ){

    const permissions =
      readPermissions();


    return (
      permissions[
        name
      ] ||
      null
    );

  }


  function hasMotDuJourVoicePermission(){

    const permission =
      getPermission(
        "motDuJourVoice"
      );


    return Boolean(
      permission &&
      permission.status ===
        "authorized"
    );

  }


  /* =====================================================
     RETRAIT
     ===================================================== */

  function revokeMotDuJourVoice(){

    const permissions =
      readPermissions();


    permissions.motDuJourVoice = {

      status:
        "revoked",

      revokedAt:
        new Date().toISOString(),

      permissionVersion:
        "1"

    };


    savePermissions(
      permissions
    );


    document.dispatchEvent(
      new CustomEvent(
        "bociteart:parent-permission-updated",
        {
          detail:{

            permission:
              "mot_du_jour_voice",

            status:
              "revoked"

          }
        }
      )
    );

  }


  /* =====================================================
     API
     ===================================================== */

  window.BociteParentalConsent = {

    openMotDuJour:
      openMotDuJour,

    close:
      close,

    getPermission:
      getPermission,

    hasMotDuJourVoicePermission:
      hasMotDuJourVoicePermission,

    revokeMotDuJourVoice:
      revokeMotDuJourVoice,

    storageKey:
      STORAGE_KEY

  };


  console.log(
    "✅ Autorisations parentales Bo'CitéArt préparées"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
