/* =========================================================
   ÇA COMMENCE ICI — BO'CITÉART COMMERCE / ENTREPRISE
   Fichier : entreprise/commerce/bociteart-commerce.js
   ========================================================= */

(function(){
"use strict";

if(window.__bociteCommerceModuleLoaded === true) return;
window.__bociteCommerceModuleLoaded = true;

const STYLE_ID = "bociteartCommerceStylesV3";

const $id = id =>
  document.getElementById(id);

const esc = value =>
  String(value == null ? "" : value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");


/* =========================================================
   IDENTITÉ VISUELLE
   ========================================================= */

function brand(){

  return `
    <span class="commerceBrand">
      <span class="commerceBrandGreen">Bo'Cité</span>
      <span class="commerceBrandRed">Art</span>
    </span>
  `;
}


/* =========================================================
   STYLES
   ========================================================= */

function ensureStyles(){

  if(document.getElementById(STYLE_ID)){
    return;
  }

  const style =
    document.createElement("style");

  style.id =
    STYLE_ID;

  style.textContent = `

    .bociteCommerceRoot,
    .bociteCommerceRoot *{
      box-sizing:border-box;
    }

    .bociteCommerceRoot{
      color:#111;
      font-size:14px;
      line-height:1.5;
    }

    .bociteCommerceRoot .commerceCard,
    .bociteCommerceRoot .box{
      background:#fff;
      border:2px solid rgba(0,0,0,.08);
      border-radius:14px;
      padding:12px;
      margin:10px 0;
      color:#111;
    }

    .bociteCommerceRoot .commerceTitle,
    .bociteCommerceRoot .entrepriseSectionTitle{
      color:#2f5d46;
      font-size:17px;
      line-height:1.25;
      font-weight:700;
      margin:0 0 8px;
    }

    .bociteCommerceRoot .commerceBrand{
      display:inline-flex;
      white-space:nowrap;
      font-weight:800;
    }

    .bociteCommerceRoot .commerceBrandGreen{
      color:#2f5d46;
    }

    .bociteCommerceRoot .commerceBrandRed{
      color:#a51e22;
    }

    .bociteCommerceRoot .commerceBtn,
    .bociteCommerceRoot .choiceBtn{
      border:2px solid #2f5d46;
      background:#fff;
      color:#2f5d46;
      border-radius:12px;
      padding:10px 12px;
      font-size:14px;
      font-weight:700;
      cursor:pointer;
      font-family:inherit;
    }

    .bociteCommerceRoot button:disabled{
      opacity:.55;
      cursor:not-allowed;
    }

    .bociteCommerceRoot .commerceActions{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:10px;
    }

    .bociteCommerceRoot .commerceField,
    .bociteCommerceRoot .miniField{
      width:100%;
      border:2px solid rgba(0,0,0,.12);
      border-radius:12px;
      padding:10px;
      background:#fff;
      color:#111;
      font-size:14px;
      font-family:inherit;
      outline:none;
    }

    .bociteCommerceRoot textarea.commerceField,
    .bociteCommerceRoot textarea.miniField{
      min-height:90px;
      resize:vertical;
    }

    .bociteCommerceRoot .commerceLabel{
      display:block;
      margin-top:10px;
      margin-bottom:5px;
    }

    .bociteCommerceRoot .commerceStatus{
      margin-top:10px;
      padding:9px 10px;
      border-radius:10px;
      background:#f5f1ea;
    }

    .bociteCommerceRoot .commerceStatus[data-state="ok"]{
      border-left:4px solid #2f5d46;
    }

    .bociteCommerceRoot .commerceStatus[data-state="error"]{
      border-left:4px solid #a51e22;
    }

    .bociteCommerceRoot .commerceStatus[data-state="warn"]{
      border-left:4px solid #d4bb18;
    }

    .bociteCommerceRoot .commerceRule{
      border-left:6px solid #2f5d46;
    }

    .bociteCommerceRoot .commerceSport{
      border-left:6px solid #2f5d46;
      background:#f3faf6;
    }

    .bociteCommerceRoot .commerceHidden{
      display:none;
    }

    .bociteCommerceRoot .muted,
    .bociteCommerceRoot .commerceSmall{
      font-size:12px;
      color:#6e6a63;
    }

    .bociteCommerceRoot .entrepriseBand{
      display:block;
      width:100%;
      margin:7px 0;
      padding:11px;
      border:2px solid #2f5d46;
      border-radius:10px;
      background:#fffaf1;
      color:#111;
      text-align:left;
      cursor:pointer;
      font-weight:800;
    }

    .bociteCommerceRoot .entreprisePrivate{
      border:2px solid #2f5d46;
      background:#f7f2e8;
      border-radius:14px;
      padding:12px;
      margin-top:12px;
    }

    .bociteCommerceRoot .entrepriseCounter{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      padding:10px;
      margin-top:8px;
      border:2px solid rgba(0,0,0,.08);
      border-radius:12px;
      background:#fff;
    }

  `;

  document.head.appendChild(
    style
  );
}


/* =========================================================
   MODALE GÉNÉRALE
   ========================================================= */

function modal(
  title,
  html
){

  if(
    typeof window.openModal ===
    "function"
  ){
    return window.openModal(
      title,
      html
    );
  }

  if(
    typeof openModal ===
    "function"
  ){
    return openModal(
      title,
      html
    );
  }

  alert(
    "Le module d’affichage Bo’CitéArt n’est pas disponible."
  );
}


/* =========================================================
   VILLE ACTIVE
   ========================================================= */

function city(){

  try{

    if(
      window.BociteCityContext &&
      typeof window.BociteCityContext.get ===
        "function"
    ){

      const c =
        window.BociteCityContext.get();

      if(
        c &&
        c.cityId
      ){

        return {

          cityId:
            String(
              c.cityId
            )
            .trim()
            .toLowerCase(),

          cityName:
            String(
              c.cityName ||
              c.name ||
              "Ville"
            ).trim(),

          coinPlural:
            String(
              c.coinPlural ||
              "bocitecoins"
            ).trim()
        };
      }
    }

  }catch(e){}

  return {
    cityId:"wattignies",
    cityName:"Wattignies",
    coinPlural:"Watticoins"
  };
}


/* =========================================================
   RACCORDEMENT AU COMPTE CENTRAL
   ========================================================= */

function accountApi(){

  return (
    window.BoCiteArtRegistration ||
    window.BociteAccount ||
    null
  );
}


function organization(){

  const api =
    accountApi();

  try{

    return (
      api &&
      typeof api.getOrganization ===
        "function"
    )
      ? api.getOrganization()
      : null;

  }catch(e){

    return null;
  }
}


function account(){

  const api =
    accountApi();

  try{

    return (
      api &&
      typeof api.getAccount ===
        "function"
    )
      ? api.getAccount()
      : null;

  }catch(e){

    return null;
  }
}


function categoryOf(
  org
){

  return String(
    org &&
    org.category ||
    ""
  )
  .trim()
  .toLowerCase();
}


function profileOf(
  org
){

  return (
    org &&
    org.organizationProfile &&
    typeof org.organizationProfile ===
      "object"
  )
    ? org.organizationProfile
    : {};
}


function isProfessionalCategory(
  category
){

  return (
    category === "commerce" ||
    category === "entreprise"
  );
}


/* =========================================================
   IDENTITÉ COMMERCE CENTRALISÉE
   ========================================================= */

function centralMerchant(){

  const org =
    organization();

  if(
    !org ||
    categoryOf(org) !==
      "commerce"
  ){

    return {
      id:"",
      shopName:"",
      address:"",
      phone:"",
      email:"",
      sirenSiret:"",
      partnerActive:false,
      central:false
    };
  }

  const profile =
    profileOf(org);

  return {

    id:
      String(
        org.organizationId ||
        org.professionalIdentifier ||
        ""
      ),

    professionalIdentifier:
      String(
        org.professionalIdentifier ||
        ""
      ),

    shopName:
      String(
        profile.organizationName ||
        org.name ||
        ""
      ),

    address:
      String(
        profile.establishmentAddress ||
        ""
      ),

    phone:
      String(
        profile.phone ||
        org.ownerPhone ||
        ""
      ),

    email:
      String(
        profile.email ||
        org.ownerEmail ||
        ""
      ),

    sirenSiret:
      String(
        profile.siretOrSiren ||
        ""
      ),

    activity:
      String(
        profile.businessActivity ||
        ""
      ),

    partnerActive:
      (
        org.active === true &&
        org.validationStatus ===
          "validated" &&
        org.professionalAccessReady ===
          true
      ),

    central:true,

    organization:
      org
  };
}


/* =========================================================
   ÉTAT D'ACCÈS PROFESSIONNEL
   ========================================================= */

function accessState(
  expectedCategory
){

  const api =
    accountApi();

  const org =
    organization();

  const acc =
    account();


  if(!api){

    return {
      ok:false,
      reason:"central_unavailable"
    };
  }


  if(
    !acc ||
    !acc.accountId
  ){

    return {
      ok:false,
      reason:"account_missing"
    };
  }


  if(
    !org ||
    !org.organizationId
  ){

    return {
      ok:false,
      reason:"organization_missing",
      account:acc
    };
  }


  const category =
    categoryOf(org);


  if(
    expectedCategory &&
    category !== expectedCategory
  ){

    return {
      ok:false,
      reason:"wrong_category",
      category:category,
      organization:org
    };
  }


  let professional =
    {};

  try{

    professional =
      (
        typeof api.getProfessionalAccessState ===
        "function"
      )
        ? (
            api.getProfessionalAccessState() ||
            {}
          )
        : {};

  }catch(e){}


  const validated =
    (
      org.active === true &&
      org.validationStatus ===
        "validated"
    );


  const ready =
    (
      org.professionalAccessReady ===
        true ||
      professional.professionalAccessReady ===
        true
    );


  let context =
    null;

  try{

    context =
      (
        typeof api.getCurrentAccessContext ===
        "function"
      )
        ? api.getCurrentAccessContext()
        : null;

  }catch(e){}


  return {

    ok:
      (
        validated &&
        ready
      ),

    reason:
      !validated
        ? (
            org.validationStatus ||
            "draft"
          )
        : (
            !ready
              ? "initial_access_required"
              : "access_denied"
          ),

    account:
      acc,

    organization:
      org,

    professional:
      professional,

    context:
      context,

    validated:
      validated,

    ready:
      ready,

    category:
      category
  };
}


/* =========================================================
   MESSAGES D'ACCÈS
   ========================================================= */

function accessMessage(
  state,
  label
){

  const name =
    label ||
    "professionnel";

  switch(
    state &&
    state.reason
  ){

    case "central_unavailable":

      return (
        "Le compte central Bo’CitéArt n’est pas chargé."
      );


    case "account_missing":

      return (
        "Créez d’abord votre compte Bo’CitéArt puis choisissez le profil " +
        name +
        "."
      );


    case "organization_missing":

      return (
        "Votre compte existe, mais aucun dossier d’organisation n’est encore rattaché à ce profil."
      );


    case "wrong_category":

      return (
        "Le compte actuellement ouvert est rattaché au profil « " +
        String(
          state.category ||
          "autre"
        ) +
        " ». Ouvrez le compte correspondant à cet espace."
      );


    case "pending_review":

      return (
        "Votre dossier a été transmis et attend la validation Bo’CitéArt."
      );


    case "needs_information":

      return (
        "Votre dossier nécessite des informations complémentaires avant validation."
      );


    case "unfavorable":

      return (
        "Le dossier n’a pas été validé. Consultez les informations communiquées par Bo’CitéArt."
      );


    case "initial_access_required":

      return (
        "Votre organisation est validée. Utilisez maintenant votre identifiant professionnel et votre code d’accès initial."
      );


    case "draft":

      return (
        "Votre dossier d’organisation doit être complété puis transmis avant l’ouverture de l’espace professionnel."
      );


    default:

      return (
        "L’accès professionnel n’est pas encore ouvert."
      );
  }
}


/* =========================================================
   PREMIÈRE DEMANDE
   ========================================================= */

function startCentralRegistration(){

  const api =
    accountApi();

  if(
    !api ||
    typeof api.open !==
      "function"
  ){

    alert(
      "Le service central de création de compte n’est pas disponible."
    );

    return;
  }


  const acc =
    account();

  const org =
    organization();


  if(
    !acc ||
    !acc.accountId
  ){

    api.open();

    return;
  }


  if(
    org &&
    isProfessionalCategory(
      categoryOf(org)
    )
  ){

    const state =
      accessState(
        categoryOf(org)
      );

    alert(
      accessMessage(
        state,
        categoryOf(org) ===
          "commerce"
          ? "Commerce"
          : "Entreprise"
      )
    );

    return;
  }


  alert(
    "Un compte Bo’CitéArt est déjà présent sur cet appareil. Utilisez le profil correspondant à l’organisation que vous souhaitez ouvrir."
  );
}


/* =========================================================
   ACTIVATION INITIALE
   ========================================================= */

async function activateInitialAccess(
  expectedCategory,
  identifier,
  code
){

  const api =
    accountApi();

  const state =
    accessState(
      expectedCategory
    );


  if(state.ok){

    return {
      ok:true,
      alreadyReady:true
    };
  }


  if(!state.validated){

    return {
      ok:false,
      message:
        accessMessage(
          state,
          expectedCategory
        )
    };
  }


  if(
    !api ||
    typeof api.verifyProfessionalInitialAccess !==
      "function"
  ){

    return {
      ok:false,
      message:
        "Le service central d’activation professionnelle n’est pas disponible."
    };
  }


  try{

    const result =
      await api.verifyProfessionalInitialAccess(
        String(
          identifier ||
          ""
        ).trim(),

        String(
          code ||
          ""
        ).trim()
      );


    if(
      result &&
      result.ok === true
    ){

      return result;
    }


    const reasons = {

      invalid_professional_identifier:
        "Identifiant professionnel incorrect.",

      invalid_initial_access_code:
        "Code d’accès initial incorrect.",

      initial_access_already_used:
        "Ce code initial a déjà été utilisé. L’accès professionnel est déjà activé.",

      initial_access_not_issued:
        "Aucun code initial n’a encore été émis.",

      organization_not_validated:
        "L’organisation n’est pas encore validée.",

      organization_not_found:
        "Aucune organisation professionnelle n’a été trouvée."
    };


    return {

      ok:false,

      message:
        reasons[
          result &&
          result.reason
        ] ||
        "L’activation professionnelle a échoué."
    };

  }catch(e){

    return {
      ok:false,
      message:
        "L’activation professionnelle a échoué."
    };
  }
}


/* =========================================================
   CARTE D'ACCÈS CENTRALISÉE
   ========================================================= */

function renderAccessCard(
  type
){

  const label =
    type === "commerce"
      ? "Commerce"
      : "Entreprise";

  return `

    <div
      class="commerceCard"
      data-central-access="${esc(type)}"
    >

      <div class="commerceTitle">
        Accès professionnel ${esc(label)}
      </div>

      <div class="commerceText">
        Votre espace professionnel est rattaché
        au compte central ${brand()}.
      </div>

      <div class="commerceActions">

        <button
          class="commerceBtn"
          type="button"
          data-central-start="${esc(type)}"
        >
          Première demande d'accès
        </button>

        <button
          class="commerceBtn"
          type="button"
          data-central-existing="${esc(type)}"
        >
          J'ai déjà mes accès
        </button>

      </div>

      <div
        class="commerceStatus"
        data-central-status="${esc(type)}"
        data-state="warn"
      >
        L'accès privé s'ouvre après validation
        de l'organisation et activation
        de l'accès professionnel.
      </div>

      <div
        class="commerceHidden"
        data-central-activation="${esc(type)}"
      >

        <label class="commerceLabel">
          Identifiant professionnel
        </label>

        <input
          class="commerceField"
          type="text"
          autocomplete="username"
          data-central-identifier="${esc(type)}"
          placeholder="BCA-COM-… ou BCA-ENT-…"
        >

        <label class="commerceLabel">
          Code d'accès initial
        </label>

        <input
          class="commerceField"
          type="password"
          inputmode="numeric"
          autocomplete="one-time-code"
          data-central-code="${esc(type)}"
          placeholder="Code initial"
        >

        <div class="commerceActions">

          <button
            class="commerceBtn"
            type="button"
            data-central-activate="${esc(type)}"
          >
            Activer mon accès
          </button>

        </div>

      </div>

    </div>
  `;
}


/* =========================================================
   BOUTONS D'ACCÈS
   ========================================================= */

function bindCentralButtons(){

  document
    .querySelectorAll(
      "[data-central-start]"
    )
    .forEach(
      button => {

        button.onclick =
          function(){

            startCentralRegistration();
          };
      }
    );


  document
    .querySelectorAll(
      "[data-central-existing]"
    )
    .forEach(
      button => {

        button.onclick =
          function(){

            const type =
              button.getAttribute(
                "data-central-existing"
              );

            const state =
              accessState(
                type
              );

            const status =
              document.querySelector(
                '[data-central-status="' +
                type +
                '"]'
              );

            const activation =
              document.querySelector(
                '[data-central-activation="' +
                type +
                '"]'
              );


            if(state.ok){

              if(status){

                status.dataset.state =
                  "ok";

                status.textContent =
                  "Accès professionnel actif.";
              }


              if(
                type ===
                "commerce"
              ){

                openCommercePrivate();

              }else{

                openDirection();
              }

              return;
            }


            if(
              state.validated &&
              !state.ready
            ){

              if(activation){

                activation.classList.remove(
                  "commerceHidden"
                );
              }


              if(status){

                status.dataset.state =
                  "warn";

                status.textContent =
                  accessMessage(
                    state,
                    type
                  );
              }

              return;
            }


            if(status){

              status.dataset.state =
                "warn";

              status.textContent =
                accessMessage(
                  state,
                  type
                );
            }
          };
      }
    );


  document
    .querySelectorAll(
      "[data-central-activate]"
    )
    .forEach(
      button => {

        button.onclick =
          async function(){

            const type =
              button.getAttribute(
                "data-central-activate"
              );

            const identifier =
              document.querySelector(
                '[data-central-identifier="' +
                type +
                '"]'
              );

            const code =
              document.querySelector(
                '[data-central-code="' +
                type +
                '"]'
              );

            const status =
              document.querySelector(
                '[data-central-status="' +
                type +
                '"]'
              );


            button.disabled =
              true;


            const result =
              await activateInitialAccess(
                type,
                identifier
                  ? identifier.value
                  : "",
                code
                  ? code.value
                  : ""
              );


            button.disabled =
              false;


            if(
              !result ||
              result.ok !== true
            ){

              if(status){

                status.dataset.state =
                  "error";

                status.textContent =
                  result &&
                  result.message
                    ? result.message
                    : "Activation refusée.";
              }

              return;
            }


            if(status){

              status.dataset.state =
                "ok";

              status.textContent =
                "Accès professionnel activé.";
            }


            if(
              type ===
              "commerce"
            ){

              openCommercePrivate();

            }else{

              openDirection();
            }
          };
      }
    );
}

 /* =========================================================
   COMMERCE — ESPACE PRIVÉ
   ========================================================= */

function commercePrivateHtml(){

  return `

    <div
      id="merchantInternalSpace"
      class="commerceHidden"
    >

      <div class="commerceCard">

        <div class="commerceTitle">
          Mon établissement
        </div>

        <div
          id="commerceCentralMerchantProfile"
          class="commerceText"
        ></div>

      </div>


      <div class="commerceCard commerceSport">

        <div class="commerceTitle">
          Sport — échange 30 VERT contre 1 Cabas
        </div>

        <div class="commerceText">

          Le représentant du club présente
          son QR dynamique.

          Un achat réel distinct
          d'au moins 10 € TTC est obligatoire
          avant l'échange.

          Les 30 bocitecoins VERT sont retirés
          par le moteur Sport après validation.

          Le commerce ne modifie jamais
          directement le portefeuille du club.

        </div>


        <label class="commerceLabel">
          QR dynamique du club
        </label>

        <textarea
          id="commerceSportQrRaw"
          class="commerceField"
          placeholder="Scannez ou collez ici le QR dynamique du club."
        ></textarea>


        <div class="commerceActions">

          <button
            id="commerceSportScanBtn"
            class="commerceBtn"
            type="button"
          >
            Scanner le QR
          </button>

        </div>


        <div
          id="commerceSportCameraBox"
          class="commerceHidden"
          style="margin-top:10px"
        >

          <video
            id="commerceSportCamera"
            playsinline
            muted
            style="width:100%;max-height:300px;border-radius:12px;background:#111"
          ></video>

          <div class="commerceActions">

            <button
              id="commerceSportCameraStopBtn"
              class="commerceBtn"
              type="button"
            >
              Arrêter la caméra
            </button>

          </div>

        </div>


        <label class="commerceLabel">
          Montant de l'achat TTC
        </label>

        <input
          id="commerceSportPurchaseAmount"
          class="commerceField"
          type="number"
          min="10"
          step="0.01"
          inputmode="decimal"
          placeholder="10,00"
        >


        <label class="commerceLabel">
          Référence ticket / achat
        </label>

        <input
          id="commerceSportPurchaseRef"
          class="commerceField"
          type="text"
          placeholder="Référence du ticket"
        >


        <div class="commerceActions">

          <button
            id="commerceSportValidateBtn"
            class="commerceBtn"
            type="button"
          >
            Valider l'échange
          </button>

        </div>


        <div
          id="commerceSportExchangeStatus"
          class="commerceStatus"
          data-state="warn"
        >
          En attente du QR dynamique du club.
        </div>

      </div>


      <div class="commerceCard">

        <div class="commerceTitle">
          Historique
        </div>

        <div class="commerceText">

          Les opérations sont rattachées
          à la ville active et
          à l'organisation professionnelle.

        </div>

        <div class="commerceActions">

          <button
            class="commerceBtn"
            id="merchantHistoryExportBtn"
            type="button"
          >
            Exporter l'historique
          </button>

        </div>

      </div>

    </div>
  `;
}


/* =========================================================
   OUVERTURE ESPACE COMMERCE PRIVÉ
   ========================================================= */

function openCommercePrivate(){

  const state =
    accessState(
      "commerce"
    );

  if(!state.ok){

    alert(
      accessMessage(
        state,
        "Commerce"
      )
    );

    return false;
  }


  const merchant =
    centralMerchant();


  if(
    !merchant.central ||
    !merchant.partnerActive
  ){

    alert(
      "Le commerce doit être validé et actif avant l'ouverture de cet espace."
    );

    return false;
  }


  const space =
    $id(
      "merchantInternalSpace"
    );

  const profile =
    $id(
      "commerceCentralMerchantProfile"
    );


  if(profile){

    profile.innerHTML = `

      <strong>
        ${esc(
          merchant.shopName ||
          "Commerce"
        )}
      </strong>

      <br>

      Identifiant professionnel :
      ${esc(
        merchant.professionalIdentifier ||
        "—"
      )}

      <br>

      SIRET / SIREN :
      ${esc(
        merchant.sirenSiret ||
        "—"
      )}

      <br>

      Activité :
      ${esc(
        merchant.activity ||
        "—"
      )}

      <br>

      Adresse :
      ${esc(
        merchant.address ||
        "—"
      )}

      <br>

      E-mail :
      ${esc(
        merchant.email ||
        "—"
      )}

      <br>

      Téléphone :
      ${esc(
        merchant.phone ||
        "—"
      )}
    `;
  }


  if(space){

    space.classList.remove(
      "commerceHidden"
    );
  }


  return true;
}


/* =========================================================
   QR SPORT — LECTURE
   ========================================================= */

function parseSportScan(
  raw
){

  const value =
    String(
      raw ||
      ""
    ).trim();


  if(!value){

    throw new Error(
      "Présentez ou collez le QR dynamique du club."
    );
  }


  let data =
    null;


  try{

    data =
      JSON.parse(
        value
      );

  }catch(e){

    try{

      const decoded =
        decodeURIComponent(
          value
        );

      data =
        JSON.parse(
          decoded
        );

    }catch(e2){

      throw new Error(
        "Le contenu du QR Sport n'est pas reconnu."
      );
    }
  }


  if(
    !data ||
    typeof data !==
      "object"
  ){

    throw new Error(
      "Le QR Sport est invalide."
    );
  }


  if(
    String(
      data.type ||
      ""
    ) !==
    "sport_club_ref"
  ){

    throw new Error(
      "Ce QR n'est pas un QR Sport Bo’CitéArt."
    );
  }


  return data;
}


/* =========================================================
   MESSAGES ERREURS SPORT
   ========================================================= */

function sportError(
  reason
){

  const errors = {

    invalid_scan:
      "Le QR Sport n'est pas valide.",

    wrong_city:
      "Ce QR appartient à une autre ville Bo’CitéArt.",

    expired:
      "Ce QR dynamique a expiré. Demandez au club d'en afficher un nouveau.",

    already_used:
      "Ce QR dynamique a déjà été utilisé.",

    insufficient_balance:
      "Le club ne dispose pas des 30 bocitecoins VERT nécessaires.",

    merchant_rotation:
      "Ce commerce ne peut pas être utilisé pour cet échange. Le moteur Sport applique la rotation prévue.",

    merchant_inactive:
      "Le commerce n'est pas actif pour cette opération.",

    invalid_merchant:
      "L'identité du commerce n'a pas été reconnue.",

    purchase_required:
      "Un achat réel distinct est obligatoire avant l'échange.",

    purchase_too_low:
      "L'achat doit atteindre au moins 10 € TTC.",

    ticket_reference_required:
      "La référence du ticket ou de l'achat est obligatoire.",

    invalid_operation:
      "L'opération Sport n'est pas valide.",

    club_not_found:
      "Le club n'a pas été reconnu.",

    exchange_not_allowed:
      "L'échange n'est pas autorisé."
  };


  return (
    errors[
      String(
        reason ||
        ""
      )
    ] ||
    "L'échange n'a pas pu être validé."
  );
}


/* =========================================================
   QR SPORT — CAMÉRA + VALIDATION
   ========================================================= */

function bindSport(){

  const input =
    $id(
      "commerceSportQrRaw"
    );

  const scanBtn =
    $id(
      "commerceSportScanBtn"
    );

  const box =
    $id(
      "commerceSportCameraBox"
    );

  const video =
    $id(
      "commerceSportCamera"
    );

  const stopBtn =
    $id(
      "commerceSportCameraStopBtn"
    );

  const amount =
    $id(
      "commerceSportPurchaseAmount"
    );

  const reference =
    $id(
      "commerceSportPurchaseRef"
    );

  const validate =
    $id(
      "commerceSportValidateBtn"
    );

  const status =
    $id(
      "commerceSportExchangeStatus"
    );


  if(!validate){

    return;
  }


  let current =
    null;

  let stream =
    null;

  let timer =
    null;

  let busy =
    false;


  const setStatus =
    function(
      state,
      text
    ){

      if(status){

        status.dataset.state =
          state;

        status.textContent =
          text;
      }
    };


  const stop =
    function(){

      if(timer){

        clearInterval(
          timer
        );

        timer =
          null;
      }


      if(stream){

        stream
          .getTracks()
          .forEach(
            track => {

              try{

                track.stop();

              }catch(e){}
            }
          );

        stream =
          null;
      }


      if(video){

        try{

          video.pause();

        }catch(e){}

        video.srcObject =
          null;
      }


      if(box){

        box.classList.add(
          "commerceHidden"
        );
      }


      busy =
        false;
    };


  const read =
    function(){

      try{

        const scan =
          parseSportScan(
            input
              ? input.value
              : ""
          );


        const activeCity =
          city();


        const scanCity =
          String(
            scan.cityId ||
            ""
          )
          .trim()
          .toLowerCase();


        const operationId =
          String(
            scan.operationId ||
            ""
          )
          .trim()
          .toUpperCase();


        if(
          scanCity !==
          activeCity.cityId
        ){

          throw new Error(
            "Ce QR appartient à une autre ville Bo’CitéArt."
          );
        }


        if(
          !/^BCA-S-[A-Z0-9]{12,40}$/.test(
            operationId
          )
        ){

          throw new Error(
            "Ce QR dynamique Sport n'est pas valide."
          );
        }


        if(
          Number(
            scan.expiresAt ||
            0
          ) > 0 &&
          Number(
            scan.expiresAt
          ) <
          Date.now()
        ){

          throw new Error(
            "Ce QR dynamique a expiré. Demandez au club d'en afficher un nouveau."
          );
        }


        current =
          scan;


        setStatus(
          "ok",
          "QR Sport reconnu — club : " +
          String(
            scan.clubName ||
            scan.name ||
            scan.clubRef ||
            "Club partenaire"
          ) +
          ". Le contrôle final vérifiera le solde, l'usage unique et le commerce."
        );


        return scan;

      }catch(e){

        current =
          null;


        setStatus(
          "error",
          e &&
          e.message
            ? e.message
            : "QR Sport non reconnu."
        );


        return null;
      }
    };


  const camera =
    async function(){

      if(!input){

        return;
      }


      if(
        typeof window.BarcodeDetector !==
          "function" ||
        !navigator.mediaDevices ||
        typeof navigator.mediaDevices.getUserMedia !==
          "function"
      ){

        setStatus(
          "warn",
          "Le scanner caméra n'est pas disponible sur cet appareil. Collez le contenu du QR dans le champ prévu."
        );

        return;
      }


      stop();


      let detector;


      try{

        detector =
          new window.BarcodeDetector({
            formats:[
              "qr_code"
            ]
          });


        stream =
          await navigator.mediaDevices.getUserMedia({

            audio:false,

            video:{
              facingMode:{
                ideal:"environment"
              }
            }
          });


        if(!video){

          stop();

          return;
        }


        video.srcObject =
          stream;


        await video.play();


        if(box){

          box.classList.remove(
            "commerceHidden"
          );
        }


        setStatus(
          "warn",
          "Scanner actif : présentez le QR dynamique du club."
        );


        timer =
          setInterval(
            async function(){

              if(
                busy ||
                !video ||
                video.readyState < 2
              ){

                return;
              }


              busy =
                true;


              try{

                const codes =
                  await detector.detect(
                    video
                  );


                if(
                  codes &&
                  codes[0] &&
                  codes[0].rawValue
                ){

                  input.value =
                    String(
                      codes[0].rawValue
                    ).trim();


                  stop();

                  read();
                }

              }catch(e){

              }finally{

                busy =
                  false;
              }

            },
            450
          );

      }catch(e){

        stop();


        setStatus(
          "error",
          "La caméra n'a pas pu être ouverte. Autorisez son accès ou collez le QR du club."
        );
      }
    };


  if(scanBtn){

    scanBtn.onclick =
      async function(){

        if(
          input &&
          String(
            input.value ||
            ""
          ).trim()
        ){

          read();

          return;
        }


        await camera();
      };
  }


  if(stopBtn){

    stopBtn.onclick =
      stop;
  }


  validate.onclick =
    async function(){

      const state =
        accessState(
          "commerce"
        );


      if(!state.ok){

        setStatus(
          "error",
          accessMessage(
            state,
            "Commerce"
          )
        );

        return;
      }


      const bridge =
        window.BociteSportMerchant;


      if(
        !bridge ||
        typeof bridge.validateClubScan !==
          "function"
      ){

        setStatus(
          "error",
          "Le raccord Sport → Commerce n'est pas chargé."
        );

        return;
      }


      const scan =
        current ||
        read();


      if(!scan){

        return;
      }


      const merchant =
        centralMerchant();


      if(
        !merchant.partnerActive ||
        !merchant.id
      ){

        setStatus(
          "error",
          "Le commerce central doit être validé et actif."
        );

        return;
      }


      const purchaseAmount =
        Number(
          amount
            ? amount.value
            : 0
        );


      const purchaseReference =
        String(
          reference
            ? reference.value
            : ""
        ).trim();


      if(
        !Number.isFinite(
          purchaseAmount
        ) ||
        purchaseAmount < 10
      ){

        setStatus(
          "error",
          "Un achat réel d'au moins 10 € TTC est obligatoire."
        );

        return;
      }


      if(!purchaseReference){

        setStatus(
          "error",
          "Renseignez la référence du ticket ou de l'achat."
        );

        return;
      }


      validate.disabled =
        true;


      setStatus(
        "warn",
        "Validation en cours…"
      );


      try{

        const result =
          await bridge.validateClubScan(

            scan,

            {

              id:
                merchant.id,

              merchantId:
                merchant.id,

              name:
                merchant.shopName,

              shopName:
                merchant.shopName,

              sirenSiret:
                merchant.sirenSiret,

              partnerActive:
                merchant.partnerActive,

              bociteartPartner:
                merchant.partnerActive,

              partnerStatus:
                merchant.partnerActive
                  ? "active"
                  : "inactive"
            },

            {

              amountTTC:
                purchaseAmount,

              reference:
                purchaseReference,

              bocitecoinRecipient:
                "club",

              exchangeAccepted:
                true
            }
          );


        if(
          !result ||
          result.ok !== true
        ){

          setStatus(
            "error",
            sportError(
              result &&
              result.reason
            )
          );

          return;
        }


        setStatus(
          "ok",
          "Échange validé : 30 bocitecoins VERT retirés, 1 Cabas remis. Nouveau solde du club : " +
          Number(
            result.balance ||
            0
          ) +
          " VERT."
        );


        current =
          null;


        if(input){

          input.value =
            "";
        }


        if(amount){

          amount.value =
            "";
        }


        if(reference){

          reference.value =
            "";
        }

      }catch(e){

        setStatus(
          "error",
          "La validation de l'échange a échoué."
        );

      }finally{

        validate.disabled =
          false;
      }
    };
}


/* =========================================================
   EXPORT COMMERCE
   ========================================================= */

function bindExport(){

  const button =
    $id(
      "merchantHistoryExportBtn"
    );


  if(!button){

    return;
  }


  button.onclick =
    function(){

      const activeCity =
        city();

      const merchant =
        centralMerchant();


      const object = {

        exported_at_fr:
          new Date()
            .toLocaleString(
              "fr-FR"
            ),

        city:
          activeCity,

        organization_id:
          merchant.id,

        professional_identifier:
          merchant.professionalIdentifier,

        merchant_name:
          merchant.shopName
      };


      const text =
        "HISTORIQUE COMMERCE — EXPORT\n\n" +
        JSON.stringify(
          object,
          null,
          2
        );


      if(
        navigator.clipboard &&
        navigator.clipboard.writeText
      ){

        navigator.clipboard
          .writeText(
            text
          )
          .then(
            function(){

              alert(
                "Historique commerce copié."
              );
            }
          )
          .catch(
            function(){

              alert(
                text
              );
            }
          );

      }else{

        alert(
          text
        );
      }
    };
}


/* =========================================================
   ENTREPRISE — 8 THÈMES
   ========================================================= */

const ENTERPRISE_TOPICS = {

  emploi:{
    title:"Emploi",
    text:"Offres d'emploi, candidatures spontanées, métiers recherchés et suivi des réponses."
  },

  fidelisation:{
    title:"Fidélisation",
    text:"Créer des liens durables entre l'entreprise, ses salariés, ses clients et son territoire."
  },

  developpement:{
    title:"Développement",
    text:"Faire connaître les savoir-faire, rechercher de nouvelles opportunités et développer l'activité locale."
  },

  economies:{
    title:"Économies",
    text:"Identifier les besoins communs, réduire certaines charges et rechercher des solutions territoriales."
  },

  visibilite:{
    title:"Visibilité",
    text:"Présenter l'entreprise, ses activités, ses métiers, ses besoins et ses savoir-faire."
  },

  mutualisation:{
    title:"Solutions communes",
    text:"Regrouper certains besoins entre entreprises afin de rechercher des solutions communes."
  },

  perennite:{
    title:"Pérennité",
    text:"Anticiper les besoins, les évolutions, la transmission des savoir-faire et la continuité de l'activité."
  },

  mecenat:{
    title:"Mécénat",
    text:"Découvrir les projets Bo’CitéArt ouverts au mécénat et les modalités associées."
  }
};


/* =========================================================
   ANNUAIRE ENTREPRISE
   ========================================================= */

function publicCompaniesHtml(){

  return `

    <div class="commerceCard">

      <div class="commerceTitle">
        Annuaire professionnel
      </div>

      <div class="commerceText">

        Recherchez les entreprises,
        métiers et savoir-faire présents
        sur le territoire.

      </div>

      <div class="commerceActions">

        <button
          id="openOfficialCompanies"
          class="choiceBtn"
          type="button"
        >
          Rechercher une entreprise
        </button>

      </div>

    </div>
  `;
}


function openDirectory(){

  const activeCity =
    city();


  modal(
    "Annuaire professionnel",
    `

      <div class="bociteCommerceRoot">

        <div class="commerceCard">

          <div class="commerceTitle">
            Rechercher dans ${esc(
              activeCity.cityName
            )}
          </div>

          <div class="commerceText">

            La recherche privilégie
            les entreprises et commerces
            présents dans la commune,
            puis s'élargit au territoire
            lorsque cela est nécessaire.

          </div>

          <label class="commerceLabel">
            Métier, activité ou spécialité
          </label>

          <input
            id="commerceDirectorySearch"
            class="commerceField"
            type="search"
            placeholder="Exemple : électricien, menuisier, comptable…"
          >

          <div class="commerceActions">

            <button
              id="commerceDirectorySearchBtn"
              class="commerceBtn"
              type="button"
            >
              Rechercher
            </button>

          </div>

          <div
            id="commerceDirectoryResult"
            class="commerceStatus"
            data-state="warn"
          >
            Saisissez votre recherche.
          </div>

        </div>

      </div>
    `
  );


  setTimeout(
    function(){

      const input =
        $id(
          "commerceDirectorySearch"
        );

      const button =
        $id(
          "commerceDirectorySearchBtn"
        );

      const result =
        $id(
          "commerceDirectoryResult"
        );


      if(!button){

        return;
      }


      button.onclick =
        function(){

          const query =
            String(
              input
                ? input.value
                : ""
            ).trim();


          if(!query){

            if(result){

              result.dataset.state =
                "warn";

              result.textContent =
                "Indiquez un métier, une activité ou une spécialité.";
            }

            return;
          }


          if(result){

            result.dataset.state =
              "ok";

            result.textContent =
              "Recherche demandée : « " +
              query +
              " » — priorité à " +
              activeCity.cityName +
              ", puis élargissement territorial si nécessaire.";
          }
        };

    },
    0
  );
}


/* =========================================================
   ENTREPRISE — THÈME PUBLIC
   ========================================================= */

function renderEnterpriseTopic(
  key
){

  const topic =
    ENTERPRISE_TOPICS[
      key
    ];


  if(!topic){

    return;
  }


  const panel =
    $id(
      "entrepriseTopicPanel"
    );

  const title =
    $id(
      "entrepriseTopicTitle"
    );

  const text =
    $id(
      "entrepriseTopicText"
    );

  const actions =
    $id(
      "entrepriseTopicActions"
    );


  if(!panel){

    return;
  }


  panel.style.display =
    "block";


  if(title){

    title.textContent =
      topic.title;
  }


  if(text){

    text.textContent =
      topic.text;
  }


  if(actions){

    actions.innerHTML = `

      <button
        class="choiceBtn"
        type="button"
        data-enterprise-private-action="${esc(key)}"
      >
        Accéder aux services professionnels
      </button>
    `;


    const button =
      actions.querySelector(
        "[data-enterprise-private-action]"
      );


    if(button){

      button.onclick =
        function(){

          const state =
            accessState(
              "entreprise"
            );


          if(!state.ok){

            alert(
              accessMessage(
                state,
                "Entreprise"
              )
            );

            return;
          }


          openDirection(
            key
          );
        };
    }
  }
}

/* =========================================================
   ENTREPRISE — TABLEAU DE DIRECTION
   ========================================================= */

function openDirection(
  requestedTopic
){

  const state =
    accessState(
      "entreprise"
    );


  if(!state.ok){

    alert(
      accessMessage(
        state,
        "Entreprise"
      )
    );

    return;
  }


  const org =
    state.organization;

  const profile =
    profileOf(
      org
    );


  const topics =
    Object
      .entries(
        ENTERPRISE_TOPICS
      )
      .map(
        function(
          entry
        ){

          const key =
            entry[0];

          const value =
            entry[1];

          return `

            <div class="entrepriseCounter">

              <div>

                <strong>
                  ${esc(
                    value.title
                  )}
                </strong>

                <div class="commerceSmall">
                  ${esc(
                    value.text
                  )}
                </div>

              </div>

              <button
                class="choiceBtn"
                type="button"
                data-direction-topic="${esc(key)}"
              >
                Ouvrir
              </button>

            </div>
          `;
        }
      )
      .join("");


  modal(
    "Tableau de Direction",
    `

      <div class="bociteCommerceRoot">

        <div class="entreprisePrivate">

          <div class="commerceTitle">
            Espace privé Entreprise
          </div>

          <div class="commerceText">

            <strong>
              ${esc(
                profile.organizationName ||
                org.name ||
                "Entreprise"
              )}
            </strong>

            <br>

            Identifiant professionnel :
            ${esc(
              org.professionalIdentifier ||
              "—"
            )}

            <br>

            SIRET / SIREN :
            ${esc(
              profile.siretOrSiren ||
              "—"
            )}

            <br>

            Activité :
            ${esc(
              profile.businessActivity ||
              "—"
            )}

            <br>

            Adresse :
            ${esc(
              profile.registeredAddress ||
              "—"
            )}

          </div>

        </div>


        <div class="commerceCard">

          <div class="commerceTitle">
            Piloter mon activité avec Bo’CitéArt
          </div>

          ${topics}

        </div>


        <div
          id="directionTopicDetail"
          class="commerceCard"
        >

          <div class="commerceTitle">
            Sélectionnez un thème
          </div>

          <div class="commerceText">

            Les fonctions privées
            restent rattachées
            à l'organisation validée
            et aux droits de l'utilisateur.

          </div>

        </div>

      </div>
    `
  );


  setTimeout(
    function(){

      document
        .querySelectorAll(
          "[data-direction-topic]"
        )
        .forEach(
          function(
            button
          ){

            button.onclick =
              function(){

                const key =
                  button.getAttribute(
                    "data-direction-topic"
                  );

                const topic =
                  ENTERPRISE_TOPICS[
                    key
                  ];

                const detail =
                  $id(
                    "directionTopicDetail"
                  );


                if(
                  !topic ||
                  !detail
                ){

                  return;
                }


                detail.innerHTML = `

                  <div class="commerceTitle">
                    ${esc(
                      topic.title
                    )}
                  </div>

                  <div class="commerceText">
                    ${esc(
                      topic.text
                    )}
                  </div>

                  <div class="commerceStatus" data-state="ok">

                    Cet espace est rattaché
                    au compte professionnel
                    de l'entreprise.

                  </div>
                `;
              };
          }
        );


      if(
        requestedTopic &&
        ENTERPRISE_TOPICS[
          requestedTopic
        ]
      ){

        const button =
          document.querySelector(
            '[data-direction-topic="' +
            requestedTopic +
            '"]'
          );


        if(button){

          button.click();
        }
      }

    },
    0
  );
}


/* =========================================================
   COMMERCE — STRUCTURE PUBLIQUE
   ========================================================= */

function commerceHtml(){

  return `

    <div
      id="commerceSpace"
      style="display:none"
    >

      <div class="commerceCard commerceRule">

        <div class="commerceTitle">
          Les commerces partenaires dans votre ville
        </div>

        <div class="commerceText">

          Les bocitecoins territoriaux
          accompagnent les achats réalisés
          chez les commerces partenaires
          ${brand()}.

          Ils ne sont ni une monnaie,
          ni un moyen de paiement
          et ne sont jamais convertis
          en euros.

        </div>

      </div>


      <div class="commerceCard">

        <div class="commerceTitle">
          Commerces partenaires
        </div>

        <div
          id="commercePartnersList"
          class="commerceText"
        >
          Les commerces partenaires
          de la ville active apparaissent ici.
        </div>

      </div>


      <div class="commerceCard">

        <div class="commerceTitle">
          Publicités & visibilité
        </div>

        <div class="commerceText">

          La programmation des publicités
          et les services professionnels
          sont rattachés au compte central
          de l'établissement.

        </div>

      </div>


      ${renderAccessCard(
        "commerce"
      )}


      ${commercePrivateHtml()}

    </div>
  `;
}


/* =========================================================
   ENTREPRISE — STRUCTURE PUBLIQUE
   ========================================================= */

function entrepriseHtml(){

  const buttons =
    Object
      .entries(
        ENTERPRISE_TOPICS
      )
      .map(
        function(
          entry
        ){

          const key =
            entry[0];

          const value =
            entry[1];

          return `

            <button
              class="entrepriseBand"
              type="button"
              data-enterprise-topic="${esc(key)}"
            >
              ${esc(
                value.title
              )} — Cliquez ici…
            </button>
          `;
        }
      )
      .join("");


  return `

    <div
      id="entrepriseSpace"
      style="display:none"
    >

      <div class="commerceCard commerceRule">

        <div class="commerceTitle">
          Entreprises
        </div>

        <div class="commerceText">

          Découvrez les activités,
          métiers et savoir-faire
          de votre ville.

          La recherche commence
          dans la commune avant
          de s'élargir lorsque cela
          est nécessaire.

        </div>

      </div>


      ${publicCompaniesHtml()}


      ${renderAccessCard(
        "entreprise"
      )}


      <div class="commerceActions">

        <button
          class="choiceBtn"
          id="openEntrepriseDirection"
          type="button"
        >
          Tableau de Direction
        </button>

      </div>


      ${buttons}


      <div
        id="entrepriseTopicPanel"
        class="commerceCard"
        style="display:none"
      >

        <div
          id="entrepriseTopicTitle"
          class="commerceTitle"
        ></div>

        <div
          id="entrepriseTopicText"
          class="commerceText"
        ></div>

        <div
          id="entrepriseTopicActions"
          class="commerceActions"
        ></div>

      </div>


      <div class="commerceCard">

        <div class="commerceTitle">
          Vous avez une question précise ?
        </div>

        <div class="commerceText">

          La recherche Bo’CitéArt commence
          par les solutions disponibles
          dans votre ville,
          puis les communes voisines
          avant de s'élargir.

        </div>


        <textarea
          id="entrepriseAiQuestion"
          class="miniField"
          placeholder="Exemple : je cherche un électricien, un salarié, un avocat ou une solution pour réduire mes charges."
        ></textarea>


        <button
          class="choiceBtn"
          id="entrepriseAiAskBtn"
          type="button"
          style="margin-top:10px"
        >
          Poser ma question
        </button>


        <div
          id="entrepriseAiAnswer"
          class="commerceStatus"
          data-state="warn"
          style="display:none"
        ></div>

      </div>

    </div>
  `;
}


/* =========================================================
   ENTREPRISE — ÉVÉNEMENTS
   ========================================================= */

function bindEntreprise(){

  document
    .querySelectorAll(
      "[data-enterprise-topic]"
    )
    .forEach(
      function(
        button
      ){

        button.onclick =
          function(){

            renderEnterpriseTopic(
              button.getAttribute(
                "data-enterprise-topic"
              )
            );
          };
      }
    );


  const direction =
    $id(
      "openEntrepriseDirection"
    );


  if(direction){

    direction.onclick =
      function(){

        openDirection();
      };
  }


  const directory =
    $id(
      "openOfficialCompanies"
    );


  if(directory){

    directory.onclick =
      openDirectory;
  }


  const ask =
    $id(
      "entrepriseAiAskBtn"
    );


  if(ask){

    ask.onclick =
      function(){

        const input =
          $id(
            "entrepriseAiQuestion"
          );

        const output =
          $id(
            "entrepriseAiAnswer"
          );

        const question =
          String(
            input
              ? input.value
              : ""
          ).trim();


        if(!question){

          alert(
            "Écrivez votre question."
          );

          return;
        }


        if(output){

          output.style.display =
            "block";

          output.dataset.state =
            "ok";

          output.textContent =
            "Votre demande est prise en compte. La recherche territoriale sera traitée en priorité dans la commune active, puis élargie si nécessaire.";
        }
      };
  }
}


/* =========================================================
   OUVERTURE DU MODULE
   ========================================================= */

function openCommerceModule(){

  ensureStyles();


  modal(
    "Commerces & Entreprises",
    `

      <div class="bociteCommerceRoot">

        <div
          class="commerceCard"
          id="commerceEntrepriseChoice"
          style="text-align:center"
        >

          <div class="commerceTitle">
            Commerces & Entreprises avec ${brand()}
          </div>

          <div class="commerceText">
            Choisissez l'espace
            que vous souhaitez ouvrir.
          </div>

          <div
            class="commerceActions"
            style="justify-content:center"
          >

            <button
              class="commerceBtn"
              id="openCommerceSpace"
              type="button"
            >
              Commerce
            </button>

            <button
              class="commerceBtn"
              id="openEntrepriseSpace"
              type="button"
            >
              Entreprise
            </button>

          </div>

        </div>


        ${commerceHtml()}

        ${entrepriseHtml()}

      </div>
    `
  );


  setTimeout(
    function(){

      const commerce =
        $id(
          "commerceSpace"
        );

      const entreprise =
        $id(
          "entrepriseSpace"
        );

      const commerceButton =
        $id(
          "openCommerceSpace"
        );

      const entrepriseButton =
        $id(
          "openEntrepriseSpace"
        );


      const show =
        function(
          name
        ){

          if(commerce){

            commerce.style.display =
              name === "commerce"
                ? "block"
                : "none";
          }


          if(entreprise){

            entreprise.style.display =
              name === "entreprise"
                ? "block"
                : "none";
          }
        };


      if(commerceButton){

        commerceButton.onclick =
          function(){

            show(
              "commerce"
            );
          };
      }


      if(entrepriseButton){

        entrepriseButton.onclick =
          function(){

            show(
              "entreprise"
            );
          };
      }


      bindCentralButtons();

      bindSport();

      bindExport();

      bindEntreprise();


      const closeButton =
        $id(
          "xBtn"
        );


      if(
        closeButton &&
        closeButton.focus
      ){

        closeButton.focus();
      }

    },
    0
  );
}


/* =========================================================
   API PUBLIQUE
   ========================================================= */

window.BociteCommerceModule = {

  ready:true,

  open:
    openCommerceModule
};


window.openCommerceModule =
  openCommerceModule;


/* =========================================================
   FIN
   ========================================================= */

})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART COMMERCE / ENTREPRISE
   ========================================================= */ 
