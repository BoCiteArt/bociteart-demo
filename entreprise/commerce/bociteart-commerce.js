/* =========================================================
   ÇA COMMENCE ICI — BO’CITÉART COMMERCE / ENTREPRISE
   Fichier : entreprise/commerce/bociteart-commerce.js
   ========================================================= */

(function(){

"use strict";

/* =========================================================
   PROTECTION CONTRE UN DOUBLE CHARGEMENT
   ========================================================= */

if(
  window.__bociteCommerceModuleLoaded === true
){
  return;
}

window.__bociteCommerceModuleLoaded = true;


/* =========================================================
   PRÉSENTATION + OUTILS COMMERCE
   ========================================================= */

const COMMERCE_STYLE_ID =
  "bociteartCommerceStylesV2";


function commerceEnsureStyles(){

  if(
    document.getElementById(
      COMMERCE_STYLE_ID
    )
  ){
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    COMMERCE_STYLE_ID;

  style.textContent = `

    .bociteCommerceRoot,
    .bociteCommerceRoot *{
      box-sizing:border-box;
    }

    .bociteCommerceRoot{
      color:#111;
      font-size:14px;
      font-weight:400;
      line-height:1.5;
    }

    .bociteCommerceRoot .commerceCard{
      background:#fff;
      border:2px solid rgba(0,0,0,.08);
      border-radius:14px;
      padding:12px;
      margin:10px 0;
      color:#111;
      font-size:14px;
      font-weight:400;
    }

    .bociteCommerceRoot .commerceTitle{
      color:#2f5d46;
      font-size:17px;
      line-height:1.25;
      font-weight:700;
      margin:0 0 8px;
    }

    .bociteCommerceRoot .commerceText,
    .bociteCommerceRoot .commerceStatus,
    .bociteCommerceRoot .commerceLabel,
    .bociteCommerceRoot li{
      color:#111;
      font-size:14px;
      line-height:1.5;
      font-weight:400;
    }

    .bociteCommerceRoot .commerceBrand{
      display:inline-flex;
      gap:0;
      white-space:nowrap;
      font-weight:800;
    }

    .bociteCommerceRoot .commerceBrandGreen{
      color:#2f5d46;
    }

    .bociteCommerceRoot .commerceBrandRed{
      color:#a51e22;
    }

    .bociteCommerceRoot .commerceBtn{
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

    .bociteCommerceRoot .commerceBtn:disabled{
      opacity:.55;
      cursor:not-allowed;
    }

    .bociteCommerceRoot .commerceActions{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:10px;
    }

    .bociteCommerceRoot .commerceField{
      width:100%;
      border:2px solid rgba(0,0,0,.12);
      border-radius:12px;
      padding:10px;
      background:#fff;
      color:#111;
      font-size:14px;
      font-weight:400;
      font-family:inherit;
      outline:none;
    }

    .bociteCommerceRoot textarea.commerceField{
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

    .bociteCommerceRoot
    .commerceStatus[data-state="ok"]{
      border-left:4px solid #2f5d46;
    }

    .bociteCommerceRoot
    .commerceStatus[data-state="error"]{
      border-left:4px solid #a51e22;
    }

    .bociteCommerceRoot
    .commerceStatus[data-state="warn"]{
      border-left:4px solid #d4bb18;
    }

    .bociteCommerceRoot .commerceWallet{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
    }

    .bociteCommerceRoot .commerceWalletValue{
      font-size:26px;
      font-weight:800;
      color:#9a7000;
      white-space:nowrap;
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

    .bociteCommerceRoot .commerceSmall{
      font-size:12px;
      color:#6e6a63;
      font-weight:400;
    }

  `;

  document.head.appendChild(
    style
  );
}


function commerceBrandHtml(){

  return (
    '<span class="commerceBrand">' +
      '<span class="commerceBrandGreen">' +
        "Bo'Cité" +
      '</span>' +
      '<span class="commerceBrandRed">' +
        "Art" +
      '</span>' +
    '</span>'
  );
}


function commerceEsc(
  value
){

  return String(
    value == null
      ? ""
      : value
  )
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}


/* =========================================================
   VILLE ACTIVE
   ========================================================= */

function commerceActiveCity(){

  try{

    if(
      window.BociteCityContext &&
      typeof window.BociteCityContext.get ===
        "function"
    ){

      const city =
        window.BociteCityContext.get();

      if(
        city &&
        city.cityId
      ){

        return {

          cityId:
            String(
              city.cityId
            )
              .trim()
              .toLowerCase(),

          cityName:
            String(
              city.cityName ||
              city.name ||
              "Ville"
            )
              .trim(),

          coinPlural:
            String(
              city.coinPlural ||
              "bocitecoins"
            )
              .trim()

        };
      }
    }

  }catch(error){}

  return {

    cityId:
      "wattignies",

    cityName:
      "Wattignies",

    coinPlural:
      "Watticoins"

  };
}


/* =========================================================
   COMPTE CENTRAL BO'CITÉART
   ========================================================= */

function commerceAccountApi(){

  return (
    window.BoCiteArtRegistration ||
    window.BociteAccount ||
    null
  );
}


function commerceCentralAccount(){

  const api =
    commerceAccountApi();

  try{

    return (
      api &&
      typeof api.getAccount ===
        "function"
    )
      ? api.getAccount()
      : null;

  }catch(error){

    return null;
  }
}


function commerceCentralOrganization(){

  const api =
    commerceAccountApi();

  try{

    return (
      api &&
      typeof api.getOrganization ===
        "function"
    )
      ? api.getOrganization()
      : null;

  }catch(error){

    return null;
  }
}


function commerceCentralAccessState(
  expectedCategory
){

  const api =
    commerceAccountApi();

  const account =
    commerceCentralAccount();

  const organization =
    commerceCentralOrganization();


  if(!api){

    return {
      ok:false,
      reason:"central_unavailable"
    };
  }


  if(
    !account ||
    !account.accountId
  ){

    return {
      ok:false,
      reason:"account_missing"
    };
  }


  if(
    !organization ||
    !organization.organizationId
  ){

    return {
      ok:false,
      reason:"organization_missing"
    };
  }


  const category =
    String(
      organization.category ||
      ""
    )
      .trim()
      .toLowerCase();


  if(
    expectedCategory &&
    category !== expectedCategory
  ){

    return {
      ok:false,
      reason:"wrong_category",
      category:category,
      organization:organization,
      account:account
    };
  }


  const validated =
    (
      organization.active === true &&
      organization.validationStatus ===
        "validated"
    );


  const ready =
    organization.professionalAccessReady ===
      true;


  let context =
    null;


  try{

    if(
      typeof api.getCurrentAccessContext ===
        "function"
    ){

      context =
        api.getCurrentAccessContext();
    }

  }catch(error){}


  return {

    ok:
      validated &&
      ready,

    reason:
      !validated
        ? (
            organization.validationStatus ||
            "draft"
          )
        : (
            !ready
              ? "initial_access_required"
              : "access_denied"
          ),

    account:
      account,

    organization:
      organization,

    category:
      category,

    validated:
      validated,

    ready:
      ready,

    context:
      context

  };
}


function commerceCentralAccessMessage(
  state
){

  const messages = {

    central_unavailable:
      "Le compte central Bo’CitéArt n’est pas chargé.",

    account_missing:
      "Créez d’abord votre compte Bo’CitéArt puis choisissez votre profil professionnel.",

    organization_missing:
      "Votre compte existe, mais aucun dossier d’organisation n’est encore rattaché à ce profil.",

    wrong_category:
      "Le compte actuellement ouvert ne correspond pas à cet espace professionnel.",

    draft:
      "Votre dossier d’organisation doit être complété puis transmis avant l’ouverture de l’espace professionnel.",

    pending_review:
      "Votre dossier a été transmis et attend la validation Bo’CitéArt.",

    needs_information:
      "Votre dossier nécessite des informations complémentaires avant validation.",

    unfavorable:
      "Le dossier n’a pas été validé. Consultez les informations communiquées par Bo’CitéArt.",

    initial_access_required:
      "Votre organisation est validée. Utilisez votre identifiant professionnel et votre code d’accès initial.",

    access_denied:
      "L’accès professionnel n’est pas encore ouvert."

  };


  const reason =
    state &&
    state.reason ||
    "access_denied";


  return (
    messages[reason] ||
    messages.access_denied
  );
}


/* =========================================================
   IDENTITÉ COMMERCE ISSUE DU COMPTE CENTRAL
   ========================================================= */

function commerceReadMerchant(){

  const organization =
    commerceCentralOrganization();


  if(
    !organization ||
    String(
      organization.category ||
      ""
    )
      .trim()
      .toLowerCase() !==
      "commerce"
  ){

    return {

      id:"",
      professionalIdentifier:"",
      shopName:"",
      address:"",
      phone:"",
      email:"",
      sirenSiret:"",
      activity:"",
      partnerActive:false

    };
  }


  const profile =
    organization.organizationProfile ||
    {};


  return {

    id:
      String(
        organization.organizationId ||
        organization.professionalIdentifier ||
        ""
      ),

    professionalIdentifier:
      String(
        organization.professionalIdentifier ||
        ""
      ),

    shopName:
      String(
        profile.organizationName ||
        organization.name ||
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
        organization.ownerPhone ||
        ""
      ),

    email:
      String(
        profile.email ||
        organization.ownerEmail ||
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
        organization.active === true &&
        organization.validationStatus ===
          "validated" &&
        organization.professionalAccessReady ===
          true
      )

  };
}


/* =========================================================
   IDENTITÉ ENTREPRISE ISSUE DU COMPTE CENTRAL

   Aucun texte du parcours Entreprise d'origine
   n'est remplacé par cette fonction.

   Elle sert uniquement aux accès professionnels,
   à la publicité et au futur QR Entreprise.
   ========================================================= */

function commerceReadEnterprise(){

  const organization =
    commerceCentralOrganization();


  if(
    !organization ||
    String(
      organization.category ||
      ""
    )
      .trim()
      .toLowerCase() !==
      "entreprise"
  ){

    return {

      id:"",
      professionalIdentifier:"",
      companyName:"",
      address:"",
      phone:"",
      email:"",
      sirenSiret:"",
      activity:"",
      active:false

    };
  }


  const profile =
    organization.organizationProfile ||
    {};


  return {

    id:
      String(
        organization.organizationId ||
        organization.professionalIdentifier ||
        ""
      ),

    professionalIdentifier:
      String(
        organization.professionalIdentifier ||
        ""
      ),

    companyName:
      String(
        profile.organizationName ||
        organization.name ||
        ""
      ),

    address:
      String(
        profile.registeredAddress ||
        ""
      ),

    phone:
      String(
        profile.phone ||
        organization.ownerPhone ||
        ""
      ),

    email:
      String(
        profile.email ||
        organization.ownerEmail ||
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

    active:
      (
        organization.active === true &&
        organization.validationStatus ===
          "validated" &&
        organization.professionalAccessReady ===
          true
      )

  };
}


/* =========================================================
   INSCRIPTION CENTRALE
   ========================================================= */

function commerceOpenCentralRegistration(
  expectedCategory
){

  const api =
    commerceAccountApi();


  if(
    !api ||
    typeof api.open !==
      "function"
  ){

    alert(
      "Le service central Bo’CitéArt n’est pas disponible."
    );

    return;
  }


  const organization =
    commerceCentralOrganization();


  if(
    organization &&
    organization.organizationId
  ){

    const category =
      String(
        organization.category ||
        ""
      )
        .trim()
        .toLowerCase();


    if(
      expectedCategory &&
      category !== expectedCategory
    ){

      alert(
        "Le compte actuellement ouvert est rattaché à un autre profil professionnel."
      );

      return;
    }
  }


  api.open();
}


/* =========================================================
   PUBLICITÉ — GRAND BANDEAU
   ========================================================= */

function commerceOpenLargeAdvertising(){

  if(
    typeof window.openTicker ===
      "function"
  ){

    window.openTicker();

    return;
  }


  alert(
    "Le calendrier Publicités & visibilité n’est pas chargé."
  );
}


/* =========================================================
   PUBLICITÉ — PETIT BANDEAU

   Commerce + Entreprise.
   Le raccord reste centralisé afin de ne pas créer
   un second moteur publicitaire dans ce fichier.
   ========================================================= */

function commerceOpenSmallAdvertising(
  profile
){

  const candidates = [

    window.openSmallAdvertising,
    window.openSmallAdBooking,
    window.openPetitBandeauPublicite,
    window.openMedicalCommerceAdvertising

  ];


  for(
    const fn of candidates
  ){

    if(
      typeof fn ===
        "function"
    ){

      fn(
        profile
      );

      return;
    }
  }


  alert(
    "L’accès au petit bandeau est préparé pour ce profil. " +
    "Le raccord au gestionnaire du petit bandeau sera activé " +
    "depuis le module publicitaire central."
  );
}


window.BociteCommerceAdvertising = {

  openLarge:
    commerceOpenLargeAdvertising,

  openSmall:
    commerceOpenSmallAdvertising

};


/* =========================================================
   PRÉPARATION DU FUTUR QR ENTREPRISE

   Aucun QR Entreprise n'est inventé ici.

   La porte technique est prévue afin qu'un QR puisse
   ensuite être rattaché à l'identifiant permanent
   de l'entreprise sans modifier son identité.
   ========================================================= */

function commerceEnterpriseQrIdentity(){

  const enterprise =
    commerceReadEnterprise();


  if(
    !enterprise.id ||
    !enterprise.active
  ){

    return null;
  }


  return {

    type:
      "enterprise_ref",

    organizationId:
      enterprise.id,

    professionalIdentifier:
      enterprise.professionalIdentifier,

    companyName:
      enterprise.companyName,

    cityId:
      commerceActiveCity().cityId

  };
}


window.BociteEnterpriseQr = {

  getIdentity:
    commerceEnterpriseQrIdentity

};


/* =========================================================
   QR SPORT → COMMERCE
   ========================================================= */

function commerceParseSportScan(
  raw
){

  const text =
    String(
      raw ||
      ""
    )
      .trim();


  if(!text){

    throw new Error(
      "Scannez ou collez d’abord le QR du club."
    );
  }


  let scan;


  try{

    scan =
      JSON.parse(
        text
      );

  }catch(error){

    throw new Error(
      "Le QR Sport n’est pas lisible."
    );
  }


  if(
    !scan ||
    typeof scan !==
      "object" ||
    scan.type !==
      "sport_club_ref"
  ){

    throw new Error(
      "Ce QR ne correspond pas à un club Sport."
    );
  }


  return scan;
}


function commerceSportError(
  reason
){

  const messages = {

    invalid_scan:
      "Le QR du club n’est pas reconnu.",

    wrong_city:
      "Ce QR appartient à une autre ville Bo’CitéArt.",

    wrong_club:
      "Ce QR ne correspond pas au club attendu.",

    invalid_operation:
      "Ce QR dynamique n’est pas valide. Demandez au club d’en afficher un nouveau.",

    scan_expired:
      "Ce QR dynamique a expiré. Demandez au club d’en afficher un nouveau.",

    qr_already_used:
      "Ce QR a déjà été utilisé. Demandez au club d’en afficher un nouveau.",

    insufficient_balance:
      "Le club ne dispose pas des 30 bocitecoins VERT nécessaires.",

    merchant_rotation_required:
      "Le dernier Cabas a déjà été retiré dans ce commerce. Le club doit choisir un autre commerce partenaire.",

    merchant_not_active_partner:
      "Ce commerce n’est pas actif comme partenaire Bo’CitéArt.",

    merchant_partner_verification_required:
      "Le statut partenaire du commerce doit être vérifié.",

    merchant_identity_required:
      "L’identité du commerce est requise.",

    purchase_required:
      "Un achat réel d’au moins 10 € TTC est obligatoire avant l’échange du Cabas.",

    wallet_save_failed:
      "Le nouveau solde Sport n’a pas pu être enregistré.",

    ledger_save_failed:
      "L’historique Sport n’a pas pu être enregistré.",

    service_unavailable:
      "Le service de validation est momentanément indisponible."

  };


  return (
    messages[reason] ||
    "L’échange n’a pas été validé."
  );
}


/* =========================================================
   OUVERTURE COMMERCE / ENTREPRISE
   ========================================================= */

function openCommerceModule(){

  commerceEnsureStyles();


  openModal(
    "Commerces & Entreprises",
    `

    <div class="bociteCommerceRoot">

      <div
        class="commerceCard"
        id="commerceEntrepriseChoice"
        style="text-align:center;"
      >

        <div class="commerceTitle">

          Commerces & Entreprises avec
          ${commerceBrandHtml()}

        </div>

        <div class="commerceText">

          Choisissez l’espace
          que vous souhaitez ouvrir.

        </div>

        <div
          class="commerceActions"
          style="justify-content:center;"
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

            <!-- =========================================================
           ESPACE COMMERCE
           ========================================================= -->

      <div
        id="commerceSpace"
        style="display:none;"
      >

        <div
          class="commerceCard commerceRule"
        >

          <div class="commerceTitle">
            Les commerces partenaires
            dans votre ville
          </div>

          <div class="commerceText">

            Retrouvez les commerces partenaires
            Bo’CitéArt de votre ville,
            leurs activités,
            leurs services
            et les opérations proposées.

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
            de la ville apparaissent ici.
          </div>

        </div>


        <div class="commerceCard">

          <div class="commerceTitle">
            Publicités & visibilité
          </div>

          <div class="commerceText">

            Le commerce partenaire
            dispose de plusieurs espaces
            pour présenter son activité,
            ses produits,
            ses services
            et ses opérations.

          </div>


          <div class="commerceActions">

            <button
              class="commerceBtn"
              id="commerceLargeAdvertisingBtn"
              type="button"
            >
              Publicité — grand bandeau
            </button>

            <button
              class="commerceBtn"
              id="commerceSmallAdvertisingBtn"
              type="button"
            >
              Publicité — petit bandeau
            </button>

          </div>

        </div>


        <div class="commerceCard">

          <div class="commerceTitle">
            Accès professionnel Commerce
          </div>

          <div class="commerceText">

            L’espace professionnel
            est réservé aux commerces
            enregistrés et validés
            par Bo’CitéArt.

            <br><br>

            Lors de votre première inscription,
            votre fiche d’identité professionnelle
            est rattachée à votre compte Bo’CitéArt.

            <br><br>

            Après contrôle et validation,
            votre identifiant professionnel
            et votre code d’accès initial
            permettent d’activer
            votre espace Commerce.

          </div>


          <div class="commerceActions">

            <button
              class="commerceBtn"
              id="merchantRequestAccessBtn"
              type="button"
            >
              Première inscription
            </button>

            <button
              class="commerceBtn"
              id="merchantLoginOpenBtn"
              type="button"
            >
              J’ai déjà mes accès
            </button>

          </div>


          <div
            id="merchantLoginGate"
            style="
              display:none;
              margin-top:14px;
            "
          >

            <label
              class="commerceLabel"
              for="merchantLoginId"
            >
              Identifiant professionnel
            </label>

            <input
              class="commerceField"
              id="merchantLoginId"
              type="text"
              autocomplete="username"
            >


            <label
              class="commerceLabel"
              for="merchantLoginCode"
            >
              Code d’accès initial
            </label>

            <input
              class="commerceField"
              id="merchantLoginCode"
              type="password"
              inputmode="numeric"
              autocomplete="one-time-code"
            >


            <div class="commerceActions">

              <button
                class="commerceBtn"
                id="merchantInternalOpenBtn"
                type="button"
              >
                Entrer dans mon espace Commerce
              </button>

            </div>


            <div
              id="merchantLoginStatus"
              class="commerceStatus"
              data-state="warn"
              style="display:none;"
            ></div>

          </div>

        </div>


        <!-- =====================================================
             ESPACE PRIVÉ COMMERCE
             ===================================================== -->

        <div
          id="merchantInternalSpace"
          style="display:none;"
        >

          <div class="commerceCard">

            <div class="commerceTitle">
              Fiche d’identité du commerce
            </div>

            <div class="commerceText">

              Cette fiche reprend
              les informations professionnelles
              enregistrées dans votre compte Bo’CitéArt.

            </div>


            <label
              class="commerceLabel"
              for="merchantShopName"
            >
              Nom du commerce
            </label>

            <input
              class="commerceField"
              id="merchantShopName"
              type="text"
              readonly
            >


            <label
              class="commerceLabel"
              for="merchantAddress"
            >
              Adresse
            </label>

            <input
              class="commerceField"
              id="merchantAddress"
              type="text"
              readonly
            >


            <label
              class="commerceLabel"
              for="merchantActivity"
            >
              Activité
            </label>

            <input
              class="commerceField"
              id="merchantActivity"
              type="text"
              readonly
            >


            <label
              class="commerceLabel"
              for="merchantPhone"
            >
              Téléphone
            </label>

            <input
              class="commerceField"
              id="merchantPhone"
              type="tel"
              readonly
            >


            <label
              class="commerceLabel"
              for="merchantEmail"
            >
              E-mail
            </label>

            <input
              class="commerceField"
              id="merchantEmail"
              type="email"
              readonly
            >


            <label
              class="commerceLabel"
              for="merchantSiret"
            >
              SIREN / SIRET
            </label>

            <input
              class="commerceField"
              id="merchantSiret"
              type="text"
              readonly
            >


            <div
              id="merchantProfileStatus"
              class="commerceStatus"
              data-state="warn"
            >
              Vérification du dossier professionnel…
            </div>

          </div>


          <div class="commerceCard">

            <div class="commerceTitle">
              Publicités & visibilité
            </div>

            <div class="commerceText">

              Depuis votre espace professionnel,
              vous accédez aux emplacements
              publicitaires prévus par Bo’CitéArt.

            </div>


            <div class="commerceActions">

              <button
                class="commerceBtn"
                id="merchantLargeAdvertisingBtn"
                type="button"
              >
                Grand bandeau publicitaire
              </button>

              <button
                class="commerceBtn"
                id="merchantSmallAdvertisingBtn"
                type="button"
              >
                Petit bandeau publicitaire
              </button>

            </div>

          </div>


          <div
            class="commerceCard commerceSport"
          >

            <div class="commerceTitle">
              Club sportif —
              30 bocitecoins VERT → 1 Cabas
            </div>

            <div class="commerceText">

              Le représentant du club
              présente son QR dynamique
              depuis son espace Sport.

              <br><br>

              Avant l’échange,
              il réalise dans le commerce
              un achat réel et distinct
              d’au moins 10 € TTC.

              <br><br>

              Le commerce scanne ensuite
              le QR dynamique du club.

              Le système contrôle automatiquement
              la ville,
              le club,
              la validité du QR,
              son délai d’utilisation,
              son usage unique,
              le solde du club
              et la rotation entre commerces partenaires.

              <br><br>

              Après validation,
              30 bocitecoins VERT
              sont retirés du portefeuille Sport
              et le commerce remet un Cabas.

              <br><br>

              Les bocitecoins VERT
              restent totalement séparés
              des bocitecoins OR du citoyen.

            </div>


            <div
              class="commerceStatus"
              data-state="warn"
            >

              Pour faciliter l’accueil,
              privilégiez lorsque cela est possible
              un moment plus calme dans le commerce.

              Cette indication reste une courtoisie :
              elle ne bloque jamais l’échange
              lorsque les conditions sont remplies.

            </div>


            <label
              class="commerceLabel"
              for="commerceSportQrRaw"
            >
              QR dynamique du club
            </label>

            <textarea
              class="commerceField"
              id="commerceSportQrRaw"
              readonly
              placeholder="Le QR dynamique scanné apparaîtra ici."
            ></textarea>


            <div class="commerceActions">

              <button
                class="commerceBtn"
                id="commerceSportScanBtn"
                type="button"
              >
                Scanner le QR du club
              </button>

            </div>


            <div
              id="commerceSportCameraBox"
              class="commerceStatus commerceHidden"
              data-state="warn"
            >

              <video
                id="commerceSportCamera"
                playsinline
                muted
                style="
                  width:100%;
                  max-height:300px;
                  border-radius:10px;
                  background:#111;
                "
              ></video>


              <div class="commerceActions">

                <button
                  class="commerceBtn"
                  id="commerceSportCameraStopBtn"
                  type="button"
                >
                  Arrêter la caméra
                </button>

              </div>

            </div>


            <label
              class="commerceLabel"
              for="commerceSportPurchaseAmount"
            >
              Montant de l’achat TTC
            </label>

            <input
              class="commerceField"
              id="commerceSportPurchaseAmount"
              type="number"
              min="10"
              step="0.01"
              inputmode="decimal"
              placeholder="Minimum 10,00 €"
            >


            <label
              class="commerceLabel"
              for="commerceSportPurchaseRef"
            >
              Référence du ticket / achat
            </label>

            <input
              class="commerceField"
              id="commerceSportPurchaseRef"
              type="text"
            >


            <div class="commerceActions">

              <button
                class="commerceBtn"
                id="commerceSportValidateBtn"
                type="button"
              >
                Valider 30 VERT → 1 Cabas
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
              Historique des opérations
            </div>

            <div class="commerceText">

              Les opérations restent rattachées
              au commerce,
              à la ville
              et à l’identifiant professionnel
              correspondant.

            </div>


            <div class="commerceActions">

              <button
                class="commerceBtn"
                id="merchantHistoryExportBtn"
                type="button"
              >
                Exporter l’historique
              </button>

            </div>

          </div>

        </div>

      </div>


      <!-- =====================================================
           ESPACE ENTREPRISE
           CONTENU D'ORIGINE CONSERVÉ
           ===================================================== -->

      <div
        id="entrepriseSpace"
        style="display:none;"
      >

        <style>

          @keyframes entrepriseBandScroll {

            from {
              transform:translateX(100%);
            }

            to {
              transform:translateX(-100%);
            }

          }


          .entrepriseBand{

            display:block;
            width:100%;
            overflow:hidden;
            margin:7px 0;
            padding:0;

            border:
              2px solid #2f5d46;

            border-radius:10px;

            background:#fffaf1;
            color:#111;

            text-align:left;
            cursor:pointer;

          }


          .entrepriseBandText{

            display:inline-block;
            min-width:100%;
            padding:12px 0;

            white-space:nowrap;
            font-weight:900;

            animation:
              entrepriseBandScroll
              70s linear infinite;

            will-change:transform;

          }


          .entrepriseBandAction{

            color:#b00020;
            font-weight:900;

          }


          .entrepriseSectionTitle{

            margin-top:16px;
            font-size:18px;
            font-weight:900;
            color:#2f5d46;

          }


          .entreprisePrivate{

            border:
              2px solid #2f5d46;

            background:#f7f2e8;
            border-radius:14px;

            padding:12px;
            margin-top:12px;

          }


          .entrepriseCounter{

            display:flex;
            justify-content:space-between;
            align-items:center;

            gap:10px;
            padding:10px;
            margin-top:8px;

            border:
              2px solid rgba(0,0,0,.08);

            border-radius:12px;
            background:#fff;

          }


          .entrepriseCounterValue{

            font-size:18px;
            font-weight:900;
            color:#2f5d46;
            white-space:nowrap;

          }


          .entrepriseStatus{

            display:inline-block;

            padding:5px 8px;
            border-radius:999px;

            background:#efe4d3;

            font-size:11px;
            font-weight:900;

          }

        </style>


        <div
          style="
            font-weight:900;
            font-size:20px;
            margin:4px 0 10px;
          "
        >
          Entreprises
        </div>


        <div
          class="box"
          style="
            border-left:
              6px solid #2f5d46;
          "
        >

          <strong>
            Découvrez les entreprises
            de votre ville.
          </strong>

          <br><br>

          Retrouvez leurs activités,
          leurs métiers
          et leurs savoir-faire.

          La recherche commence toujours
          dans votre commune
          avant de s’élargir
          aux communes voisines
          lorsque cela est nécessaire.

        </div>


        <div
          style="
            display:flex;
            gap:8px;
            flex-wrap:wrap;
            margin-bottom:12px;
          "
        >

          <button
            class="choiceBtn"
            id="openOfficialCompanies"
            type="button"
          >
            Les entreprises de votre ville
          </button>

          <button
            class="choiceBtn"
            id="openEntrepriseDirection"
            type="button"
          >
            Tableau de Direction
          </button>

        </div>


        <!-- =================================================
             AJOUT TECHNIQUE AUTOUR DU CONTENU ENTREPRISE
             ================================================= -->

        <div class="commerceCard">

          <div class="commerceTitle">
            Accès professionnel Entreprise
          </div>

          <div class="commerceText">

            La fiche d’identité professionnelle
            et les accès de l’entreprise
            sont rattachés au compte central
            Bo’CitéArt.

          </div>


          <div class="commerceActions">

            <button
              class="commerceBtn"
              id="enterpriseRegistrationBtn"
              type="button"
            >
              Inscription / fiche d’identité
            </button>

            <button
              class="commerceBtn"
              id="enterpriseProfessionalAccessBtn"
              type="button"
            >
              Accéder à mon espace professionnel
            </button>

          </div>


          <div
            id="enterpriseProfessionalStatus"
            class="commerceStatus"
            data-state="warn"
          >
            Vérification de l’accès professionnel…
          </div>

        </div>


        <div class="commerceCard">

          <div class="commerceTitle">
            Publicités & visibilité
          </div>

          <div class="commerceText">

            L’entreprise enregistrée
            et validée dispose des espaces
            publicitaires prévus dans Bo’CitéArt.

          </div>


          <div class="commerceActions">

            <button
              class="commerceBtn"
              id="enterpriseLargeAdvertisingBtn"
              type="button"
            >
              Publicité — grand bandeau
            </button>

            <button
              class="commerceBtn"
              id="enterpriseSmallAdvertisingBtn"
              type="button"
            >
              Publicité — petit bandeau
            </button>

          </div>

        </div>


        <button
          class="entrepriseBand"
          type="button"
          data-enterprise-topic="emploi"
        >

          <span class="entrepriseBandText">

            Déposez votre offre •
            Trouvez la personne près de chez vous •

            <span class="entrepriseBandAction">
              Cliquez ici…
            </span>

          </span>

        </button>


        <button
          class="entrepriseBand"
          type="button"
          data-enterprise-topic="fidelisation"
        >

          <span class="entrepriseBandText">

            Attirez •
            Fidélisez vos salariés autrement •

            <span class="entrepriseBandAction">
              Cliquez ici…
            </span>

          </span>

        </button>


        <button
          class="entrepriseBand"
          type="button"
          data-enterprise-topic="developpement"
        >

          <span class="entrepriseBandText">

            Développement de votre entreprise •
            Nouvelles opportunités •

            <span class="entrepriseBandAction">
              Cliquez ici…
            </span>

          </span>

        </button>


        <button
          class="entrepriseBand"
          type="button"
          data-enterprise-topic="mutualisation"
        >

          <span class="entrepriseBandText">

            Réduisez vos charges •
            Élec • Gaz • Assur. • Tél. •

            <span class="entrepriseBandAction">
              Cliquez ici…
            </span>

          </span>

        </button>


        <button
          class="entrepriseBand"
          type="button"
          data-enterprise-topic="visibilite"
        >

          <span class="entrepriseBandText">

            Faites connaître vos métiers •
            Votre savoir-faire •

            <span class="entrepriseBandAction">
              Cliquez ici…
            </span>

          </span>

        </button>


        <button
          class="entrepriseBand"
          type="button"
          data-enterprise-topic="economies"
        >

          <span class="entrepriseBandText">

            Comparez • Choisissez • Validez •

            <span class="entrepriseBandAction">
              Cliquez ici…
            </span>

          </span>

        </button>


        <button
          class="entrepriseBand"
          type="button"
          data-enterprise-topic="perennite"
        >

          <span class="entrepriseBandText">

            Préparez l’avenir •
            Transmission • Reprise •

            <span class="entrepriseBandAction">
              Cliquez ici…
            </span>

          </span>

        </button>


        <button
          class="entrepriseBand"
          type="button"
          data-enterprise-topic="mecenat"
        >

          <span class="entrepriseBandText">

            Savez-vous à qui
            et à quoi sert le mécénat ? •

            <span class="entrepriseBandAction">
              Cliquez ici…
            </span>

          </span>

        </button>


        <div
          id="entrepriseTopicPanel"
          class="box"
          style="
            display:none;
            margin-top:12px;
          "
        >

          <div
            id="entrepriseTopicTitle"
            style="
              font-weight:900;
              font-size:19px;
              color:#2f5d46;
            "
          ></div>


          <div
            id="entrepriseTopicText"
            style="
              margin-top:10px;
              line-height:1.55;
            "
          ></div>


          <div
            id="entrepriseTopicActions"
            style="
              display:flex;
              gap:8px;
              flex-wrap:wrap;
              margin-top:14px;
            "
          ></div>

        </div>


        <div
          class="box"
          style="margin-top:14px;"
        >

          <strong>
            Vous avez une question précise ?
          </strong>

          <br><br>

          L’IA Bo’CitéArt répondra
          en recherchant d’abord
          les solutions disponibles
          dans votre ville,
          puis dans les communes voisines
          avant d’élargir la recherche.

          <textarea
            id="entrepriseAiQuestion"
            class="miniField"
            style="
              min-height:85px;
              margin-top:10px;
            "
            placeholder="Exemple : je cherche un électricien, un salarié, un avocat ou une solution pour réduire mes charges."
          ></textarea>

          <button
            class="choiceBtn"
            id="entrepriseAiAskBtn"
            type="button"
            style="margin-top:10px;"
          >
            Poser ma question
          </button>

          <div
            id="entrepriseAiAnswer"
            class="muted"
            style="margin-top:10px;"
          ></div>

        </div>

      </div>

    </div>

    `
  );


  setTimeout(
    ()=>{

      const openCommerceSpace =
        document.getElementById(
          "openCommerceSpace"
        );

      const openEntrepriseSpace =
        document.getElementById(
          "openEntrepriseSpace"
        );

      const commerceSpace =
        document.getElementById(
          "commerceSpace"
        );

      const entrepriseSpace =
        document.getElementById(
          "entrepriseSpace"
        );


      function showProfessionalSpace(
        spaceName
      ){

        if(commerceSpace){

          commerceSpace.style.display =
            spaceName === "commerce"
              ? "block"
              : "none";
        }


        if(entrepriseSpace){

          entrepriseSpace.style.display =
            spaceName === "entreprise"
              ? "block"
              : "none";
        }
      }


      if(openCommerceSpace){

        openCommerceSpace.onclick =
          ()=>{

            showProfessionalSpace(
              "commerce"
            );
          };
      }


      if(openEntrepriseSpace){

        openEntrepriseSpace.onclick =
          ()=>{

            showProfessionalSpace(
              "entreprise"
            );
          };
      }


      /* =====================================================
         PUBLICITÉ COMMERCE
         ===================================================== */

      const commerceLargeAdvertisingBtn =
        document.getElementById(
          "commerceLargeAdvertisingBtn"
        );

      const commerceSmallAdvertisingBtn =
        document.getElementById(
          "commerceSmallAdvertisingBtn"
        );


      if(commerceLargeAdvertisingBtn){

        commerceLargeAdvertisingBtn.onclick =
          ()=>{

            const state =
              commerceCentralAccessState(
                "commerce"
              );


            if(!state.ok){

              alert(
                commerceCentralAccessMessage(
                  state
                )
              );

              return;
            }


            commerceOpenLargeAdvertising();
          };
      }


      if(commerceSmallAdvertisingBtn){

        commerceSmallAdvertisingBtn.onclick =
          ()=>{

            const state =
              commerceCentralAccessState(
                "commerce"
              );


            if(!state.ok){

              alert(
                commerceCentralAccessMessage(
                  state
                )
              );

              return;
            }


            commerceOpenSmallAdvertising(
              commerceReadMerchant()
            );
          };
      }


      /* =====================================================
         PUBLICITÉ ENTREPRISE
         ===================================================== */

      const enterpriseLargeAdvertisingBtn =
        document.getElementById(
          "enterpriseLargeAdvertisingBtn"
        );

      const enterpriseSmallAdvertisingBtn =
        document.getElementById(
          "enterpriseSmallAdvertisingBtn"
        );


      if(enterpriseLargeAdvertisingBtn){

        enterpriseLargeAdvertisingBtn.onclick =
          ()=>{

            const state =
              commerceCentralAccessState(
                "entreprise"
              );


            if(!state.ok){

              alert(
                commerceCentralAccessMessage(
                  state
                )
              );

              return;
            }


            commerceOpenLargeAdvertising();
          };
      }


      if(enterpriseSmallAdvertisingBtn){

        enterpriseSmallAdvertisingBtn.onclick =
          ()=>{

            const state =
              commerceCentralAccessState(
                "entreprise"
              );


            if(!state.ok){

              alert(
                commerceCentralAccessMessage(
                  state
                )
              );

              return;
            }


            commerceOpenSmallAdvertising(
              commerceReadEnterprise()
            );
          };
      }

           /* =====================================================
         ACCÈS COMMERCE CENTRAL
         ===================================================== */

      const merchantRequestAccessBtn =
        document.getElementById(
          "merchantRequestAccessBtn"
        );

      const merchantLoginOpenBtn =
        document.getElementById(
          "merchantLoginOpenBtn"
        );

      const merchantLoginGate =
        document.getElementById(
          "merchantLoginGate"
        );

      const merchantLoginId =
        document.getElementById(
          "merchantLoginId"
        );

      const merchantLoginCode =
        document.getElementById(
          "merchantLoginCode"
        );

      const merchantLoginStatus =
        document.getElementById(
          "merchantLoginStatus"
        );

      const merchantInternalOpenBtn =
        document.getElementById(
          "merchantInternalOpenBtn"
        );

      const merchantInternalSpace =
        document.getElementById(
          "merchantInternalSpace"
        );


      if(merchantRequestAccessBtn){

        merchantRequestAccessBtn.onclick =
          ()=>{

            commerceOpenCentralRegistration(
              "commerce"
            );
          };
      }

if(
  merchantLoginOpenBtn &&
  merchantLoginGate
){

  merchantLoginOpenBtn.onclick =
    ()=>{

      const state =
        commerceCentralAccessState(
          "commerce"
        );


      /*
        La validation centrale ne suffit jamais
        à ouvrir directement l'espace privé.

        Même lorsque l'accès professionnel
        est déjà activé, le responsable doit
        s'authentifier.
      */

      const open =
        merchantLoginGate.style.display !==
          "block";


      merchantLoginGate.style.display =
        open
          ? "block"
          : "none";


      merchantLoginOpenBtn.textContent =
        open
          ? "Fermer l’accès"
          : "J’ai déjà mes accès";


      if(!open){
        return;
      }


      /*
        Préremplissage de l'identifiant permanent
        lorsqu'il existe déjà dans le compte central.
      */

      const api =
        commerceAccountApi();


      if(
        api &&
        typeof api.getProfessionalAccessState ===
          "function"
      ){

        const accessState =
          api.getProfessionalAccessState();


        if(
          accessState &&
          accessState.professionalIdentifier &&
          merchantLoginId
        ){

          merchantLoginId.value =
            String(
              accessState.professionalIdentifier
            );
        }
      }


      /*
        L'espace privé reste systématiquement fermé
        tant que l'authentification de cette ouverture
        n'est pas terminée.
      */

      if(merchantInternalSpace){

        merchantInternalSpace.style.display =
          "none";
      }


      if(
        merchantLoginStatus
      ){

        merchantLoginStatus.style.display =
          "block";


        /*
          Première activation :
          identifiant permanent + code initial.
        */

        if(
          state.reason ===
            "initial_access_required"
        ){

          merchantLoginStatus.dataset.state =
            "warn";

          merchantLoginStatus.textContent =
            "Saisissez votre identifiant professionnel et votre code initial à usage unique.";

          if(merchantLoginCode){

            merchantLoginCode.value =
              "";

            merchantLoginCode.focus();
          }

          return;
        }


        /*
          Accès professionnel déjà activé :
          le code saisi est désormais
          le code rapide personnel.
        */

        if(state.ok){

          merchantLoginStatus.dataset.state =
            "ok";

          merchantLoginStatus.textContent =
            "Accès professionnel reconnu. Utilisez votre code rapide personnel.";

          if(merchantLoginCode){

            merchantLoginCode.value =
              "";

            merchantLoginCode.focus();
          }

          return;
        }


        /*
          Compte non encore autorisé :
          on affiche l'état central réel.
        */

      merchantLoginStatus.dataset.state =
  "warn";


/*
  =====================================================
  DOSSIER À COMPLÉTER
  =====================================================
*/

if(
  state.reason ===
    "needs_information"
){

  const api =
    commerceAccountApi();

  const organization =
    api &&
    typeof api.getOrganization ===
      "function"
      ? api.getOrganization()
      : null;


  const reason =
    organization &&
    organization.validationReason
      ? String(
          organization.validationReason
        ).trim()
      : "";


  merchantLoginStatus.innerHTML = "";


  const message =
    document.createElement(
      "div"
    );


  message.style.fontSize =
    "14px";

  message.style.lineHeight =
    "1.5";


  message.innerHTML =
    "<strong>Votre dossier doit être complété.</strong>" +
    (
      reason
        ? "<br><br>" + reason
        : "<br><br>Certaines informations professionnelles doivent être corrigées ou complétées."
    );


  const completeBtn =
    document.createElement(
      "button"
    );


  completeBtn.type =
    "button";

  completeBtn.textContent =
    "Compléter mon dossier";


  completeBtn.style.width =
    "100%";

  completeBtn.style.marginTop =
    "14px";

  completeBtn.style.padding =
    "12px";

  completeBtn.style.border =
    "2px solid #2f5d46";

  completeBtn.style.borderRadius =
    "10px";

  completeBtn.style.background =
    "#ffffff";

  completeBtn.style.color =
    "#2f5d46";

  completeBtn.style.fontSize =
    "14px";

  completeBtn.style.fontWeight =
    "700";

  completeBtn.style.cursor =
    "pointer";


  completeBtn.onclick =
    ()=>{

      if(
        api &&
        typeof api.openOrganizationProfile ===
          "function"
      ){

        api.openOrganizationProfile();

        return;
      }


      merchantLoginStatus.innerHTML =
        "";

      merchantLoginStatus.dataset.state =
        "warn";

      merchantLoginStatus.textContent =
        "La fiche de votre organisation ne peut pas être ouverte actuellement.";
    };


  merchantLoginStatus.appendChild(
    message
  );


  merchantLoginStatus.appendChild(
    completeBtn
  );


  return;
}


/*
  =====================================================
  AUTRES ÉTATS DU DOSSIER
  =====================================================
*/

merchantLoginStatus.textContent =
  commerceCentralAccessMessage(
    state
  );
      }
    };
}

     if(
  merchantInternalOpenBtn &&
  merchantInternalSpace
){

  merchantInternalOpenBtn.onclick =
    async ()=>{

      const api =
        commerceAccountApi();

      let state =
        commerceCentralAccessState(
          "commerce"
        );


      /*
        =====================================================
        ACCÈS DÉJÀ ACTIF
        =====================================================
      */

      if(state.ok){

        const quickState =
          (
            api &&
            typeof api.getProfessionalQuickCodeState ===
              "function"
          )
            ? api.getProfessionalQuickCodeState()
            : null;


        /*
          L'accès professionnel a déjà été activé
          mais aucun code rapide personnel
          n'a encore été créé.

          Cela couvre notamment le cas où
          l'utilisateur a quitté l'écran juste
          après son premier code initial.
        */

        if(
          !quickState ||
          quickState.configured !== true
        ){

          if(
            !api ||
            typeof api.setProfessionalQuickCode !==
              "function"
          ){

            merchantLoginStatus.style.display =
              "block";

            merchantLoginStatus.dataset.state =
              "error";

            merchantLoginStatus.textContent =
              "Le service de création du code personnel n’est pas disponible.";

            return;
          }


          const quickCode =
            window.prompt(
              "Choisissez votre code personnel de 4 à 6 chiffres."
            );


          if(quickCode === null){

            merchantLoginStatus.style.display =
              "block";

            merchantLoginStatus.dataset.state =
              "warn";

            merchantLoginStatus.textContent =
              "Choisissez votre code personnel pour terminer la sécurisation de votre accès.";

            return;
          }


          const cleanQuickCode =
            String(
              quickCode
            )
            .replace(
              /\D/g,
              ""
            );


          if(
            cleanQuickCode.length < 4 ||
            cleanQuickCode.length > 6
          ){

            merchantLoginStatus.style.display =
              "block";

            merchantLoginStatus.dataset.state =
              "warn";

            merchantLoginStatus.textContent =
              "Le code personnel doit comporter de 4 à 6 chiffres.";

            return;
          }


          const confirmation =
            window.prompt(
              "Confirmez votre code personnel."
            );


          if(
            confirmation === null ||
            String(
              confirmation
            )
            .replace(
              /\D/g,
              ""
            ) !==
            cleanQuickCode
          ){

            merchantLoginStatus.style.display =
              "block";

            merchantLoginStatus.dataset.state =
              "warn";

            merchantLoginStatus.textContent =
              "Les deux codes personnels ne correspondent pas.";

            return;
          }


          const quickCreation =
            await api.setProfessionalQuickCode(
              cleanQuickCode
            );


          if(
            !quickCreation ||
            quickCreation.ok !== true
          ){

            merchantLoginStatus.style.display =
              "block";

            merchantLoginStatus.dataset.state =
              "error";

            merchantLoginStatus.textContent =
              "Le code personnel n’a pas été enregistré.";

            return;
          }


          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "ok";

          merchantLoginStatus.textContent =
            "Votre code personnel est enregistré.";


          merchantInternalSpace.style.display =
            "block";

          merchantLoginGate.style.display =
            "none";


          fillMerchantIdentity();


          merchantInternalSpace.scrollIntoView({
            behavior:"smooth",
            block:"start"
          });


          return;
        }


        /*
          L'accès est déjà activé et
          le code personnel existe.

          On contrôle désormais le code rapide.
        */

        const identifier =
          String(
            merchantLoginId
              ? merchantLoginId.value
              : ""
          ).trim();


        const quickCode =
          String(
            merchantLoginCode
              ? merchantLoginCode.value
              : ""
          )
          .replace(
            /\D/g,
            ""
          );


        if(
          !identifier ||
          !quickCode
        ){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "warn";

          merchantLoginStatus.textContent =
            "Renseignez votre identifiant professionnel et votre code personnel.";

          return;
        }


        const organization =
          (
            api &&
            typeof api.getOrganization ===
              "function"
          )
            ? api.getOrganization()
            : null;


        if(
          !organization ||
          String(
            organization.professionalIdentifier ||
            ""
          ).trim() !==
          identifier
        ){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "warn";

          merchantLoginStatus.textContent =
            "Identifiant professionnel incorrect.";

          return;
        }


        if(
          !api ||
          typeof api.verifyProfessionalQuickCode !==
            "function"
        ){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "error";

          merchantLoginStatus.textContent =
            "Le service de contrôle du code personnel n’est pas disponible.";

          return;
        }


        merchantInternalOpenBtn.disabled =
          true;


        try{

          const quickResult =
            await api.verifyProfessionalQuickCode(
              quickCode
            );


          if(
            !quickResult ||
            quickResult.ok !== true
          ){

            const failures =
              Number(
                quickResult &&
                quickResult.failures ||
                0
              );


            merchantLoginStatus.style.display =
              "block";

            merchantLoginStatus.dataset.state =
              "warn";


            if(failures >= 3){

              merchantLoginStatus.textContent =
                "Code personnel incorrect. Utilisez votre code rapide personnel.";

            }else{

              merchantLoginStatus.textContent =
                "Code personnel incorrect.";
            }


            return;
          }


          if(merchantLoginCode){

            merchantLoginCode.value =
              "";
          }


          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "ok";

          merchantLoginStatus.textContent =
            "Accès professionnel validé.";


          merchantInternalSpace.style.display =
            "block";

          merchantLoginGate.style.display =
            "none";


          fillMerchantIdentity();


          merchantInternalSpace.scrollIntoView({
            behavior:"smooth",
            block:"start"
          });


          return;

        }catch(error){

          console.error(
            "Bo'CitéArt — accès Commerce :",
            error
          );


          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "error";

          merchantLoginStatus.textContent =
            "L’accès professionnel n’a pas abouti.";


          return;

        }finally{

          merchantInternalOpenBtn.disabled =
            false;
        }
      }


      /*
        =====================================================
        PREMIER ACCÈS PROFESSIONNEL
        =====================================================
      */

      if(
        state.reason !==
          "initial_access_required"
      ){

        if(merchantLoginStatus){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "warn";

          merchantLoginStatus.textContent =
            commerceCentralAccessMessage(
              state
            );
        }

        return;
      }


      const identifier =
        String(
          merchantLoginId
            ? merchantLoginId.value
            : ""
        ).trim();


      const code =
        String(
          merchantLoginCode
            ? merchantLoginCode.value
            : ""
        ).trim();


      if(
        !identifier ||
        !code
      ){

        merchantLoginStatus.style.display =
          "block";

        merchantLoginStatus.dataset.state =
          "warn";

        merchantLoginStatus.textContent =
          "Renseignez votre identifiant professionnel et votre code d’accès initial.";

        return;
      }


      if(
        !api ||
        typeof api.verifyProfessionalInitialAccess !==
          "function"
      ){

        merchantLoginStatus.style.display =
          "block";

        merchantLoginStatus.dataset.state =
          "error";

        merchantLoginStatus.textContent =
          "Le service central d’activation professionnelle n’est pas disponible.";

        return;
      }


      merchantInternalOpenBtn.disabled =
        true;


      try{

        const result =
          await api.verifyProfessionalInitialAccess(
            identifier,
            code
          );


        if(
          !result ||
          result.ok !== true
        ){

          const reasons = {

            invalid_professional_identifier:
              "Identifiant professionnel incorrect.",

            invalid_initial_access_code:
              "Code d’accès initial incorrect.",

            initial_access_already_used:
              "Ce code initial a déjà été utilisé.",

            initial_access_not_issued:
              "Aucun code initial n’a encore été émis.",

            organization_not_validated:
              "L’organisation n’est pas encore validée.",

            organization_not_found:
              "Aucune organisation professionnelle n’a été trouvée."

          };


          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "warn";

          merchantLoginStatus.textContent =
            reasons[
              result &&
              result.reason
            ] ||
            "L’activation professionnelle a échoué.";


          return;
        }


        /*
          =====================================================
          LE CODE INITIAL EST MAINTENANT DÉTRUIT.

          Création immédiate du code personnel.
          =====================================================
        */

        if(
          typeof api.setProfessionalQuickCode !==
            "function"
        ){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "error";

          merchantLoginStatus.textContent =
            "L’accès est activé, mais le service de création du code personnel n’est pas disponible.";

          return;
        }


        const newQuickCode =
          window.prompt(
            "Votre premier accès est validé.\n\nChoisissez maintenant votre code personnel de 4 à 6 chiffres."
          );


        if(newQuickCode === null){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "warn";

          merchantLoginStatus.textContent =
            "Votre accès est activé. Choisissez votre code personnel pour terminer la sécurisation.";

          return;
        }


        const cleanNewQuickCode =
          String(
            newQuickCode
          )
          .replace(
            /\D/g,
            ""
          );


        if(
          cleanNewQuickCode.length < 4 ||
          cleanNewQuickCode.length > 6
        ){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "warn";

          merchantLoginStatus.textContent =
            "Le code personnel doit comporter de 4 à 6 chiffres.";

          return;
        }


        const confirmation =
          window.prompt(
            "Confirmez votre code personnel."
          );


        if(
          confirmation === null ||
          String(
            confirmation
          )
          .replace(
            /\D/g,
            ""
          ) !==
          cleanNewQuickCode
        ){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "warn";

          merchantLoginStatus.textContent =
            "Les deux codes personnels ne correspondent pas.";

          return;
        }


        const quickResult =
          await api.setProfessionalQuickCode(
            cleanNewQuickCode
          );


        if(
          !quickResult ||
          quickResult.ok !== true
        ){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "error";

          merchantLoginStatus.textContent =
            "Le code personnel n’a pas été enregistré.";

          return;
        }


        state =
          commerceCentralAccessState(
            "commerce"
          );


        if(!state.ok){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "warn";

          merchantLoginStatus.textContent =
            commerceCentralAccessMessage(
              state
            );

          return;
        }


        if(merchantLoginCode){

          merchantLoginCode.value =
            "";
        }


        merchantLoginStatus.style.display =
          "block";

        merchantLoginStatus.dataset.state =
          "ok";

        merchantLoginStatus.textContent =
          "Accès professionnel activé. Votre code personnel est enregistré.";


        merchantInternalSpace.style.display =
          "block";

        merchantLoginGate.style.display =
          "none";


        fillMerchantIdentity();


        merchantInternalSpace.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });

      }catch(error){

        console.error(
          "Bo'CitéArt — premier accès Commerce :",
          error
        );


        merchantLoginStatus.style.display =
          "block";

        merchantLoginStatus.dataset.state =
          "error";

        merchantLoginStatus.textContent =
          "L’activation professionnelle a échoué.";

      }finally{

        merchantInternalOpenBtn.disabled =
          false;
      }
    };
}
/* =====================================================
   ACCÈS PROFESSIONNEL ÉMIS PAR L'AGENT CENTRAL
   ===================================================== */

window.addEventListener(
  "bociteart:professional-access-issued",
  function(event){

    const detail =
      event &&
      event.detail
        ? event.detail
        : {};


    /*
      Ce module ne traite ici
      que les accès Commerce.
    */

    if(
      detail.category !== "commerce" ||
      !detail.professionalIdentifier ||
      !detail.initialAccessCode
    ){
      return;
    }


    /*
      Le code initial reste uniquement
      dans cet affichage temporaire.

      Il n'est enregistré ni dans
      localStorage ni dans le journal.
    */

    const overlay =
      document.createElement(
        "div"
      );


    overlay.style.cssText =
      [
        "position:fixed",
        "inset:0",
        "z-index:2147483646",
        "background:rgba(0,0,0,.52)",
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "padding:20px",
        "box-sizing:border-box"
      ].join(";");


    const card =
      document.createElement(
        "div"
      );


    card.style.cssText =
      [
        "width:min(520px,100%)",
        "max-height:90vh",
        "overflow:auto",
        "background:#ffffff",
        "border:2px solid #2f6b45",
        "border-radius:16px",
        "padding:22px",
        "box-sizing:border-box",
        "font-family:Arial,sans-serif",
        "color:#222222"
      ].join(";");


    const title =
      document.createElement(
        "div"
      );


    title.textContent =
      "Votre accès professionnel est validé";


    title.style.cssText =
      [
        "font-size:17px",
        "font-weight:700",
        "color:#2f6b45",
        "margin-bottom:14px"
      ].join(";");


    const intro =
      document.createElement(
        "div"
      );


    intro.textContent =
      "Conservez votre identifiant professionnel. Il restera définitivement rattaché à votre commerce.";


    intro.style.cssText =
      [
        "font-size:14px",
        "line-height:1.5",
        "margin-bottom:18px"
      ].join(";");


    const identifierLabel =
      document.createElement(
        "div"
      );


    identifierLabel.textContent =
      "Identifiant professionnel permanent";


    identifierLabel.style.cssText =
      [
        "font-size:14px",
        "font-weight:700",
        "margin-bottom:6px"
      ].join(";");


    const identifierBox =
      document.createElement(
        "div"
      );


    identifierBox.textContent =
      String(
        detail.professionalIdentifier
      );


    identifierBox.style.cssText =
      [
        "background:#f7f4ec",
        "border:1px solid #2f6b45",
        "border-radius:10px",
        "padding:12px",
        "font-size:16px",
        "font-weight:700",
        "word-break:break-word",
        "margin-bottom:18px"
      ].join(";");


    const codeLabel =
      document.createElement(
        "div"
      );


    codeLabel.textContent =
      "Code initial à usage unique";


    codeLabel.style.cssText =
      [
        "font-size:14px",
        "font-weight:700",
        "margin-bottom:6px"
      ].join(";");


    const codeBox =
      document.createElement(
        "div"
      );


    codeBox.textContent =
      String(
        detail.initialAccessCode
      );


    codeBox.style.cssText =
      [
        "background:#f7f4ec",
        "border:1px solid #2f6b45",
        "border-radius:10px",
        "padding:12px",
        "font-size:22px",
        "font-weight:700",
        "letter-spacing:4px",
        "text-align:center",
        "margin-bottom:14px"
      ].join(";");


    const warning =
      document.createElement(
        "div"
      );


    warning.textContent =
      "Ce code initial ne servira qu'une seule fois. Lors de votre première ouverture, vous choisirez votre code personnel de 4 à 6 chiffres.";


    warning.style.cssText =
      [
        "font-size:14px",
        "line-height:1.5",
        "margin-bottom:20px"
      ].join(";");


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.textContent =
      "J’ai noté mes accès";


    button.style.cssText =
      [
        "width:100%",
        "background:#ffffff",
        "color:#2f6b45",
        "border:2px solid #2f6b45",
        "border-radius:10px",
        "padding:12px 16px",
        "font-size:14px",
        "font-weight:700",
        "cursor:pointer"
      ].join(";");


    button.onclick =
      function(){

        /*
          On préremplit uniquement
          l'identifiant permanent.

          Le code initial n'est volontairement
          jamais recopié ni conservé.
        */

        if(merchantLoginId){

          merchantLoginId.value =
            String(
              detail.professionalIdentifier
            );
        }


        if(merchantLoginCode){

          merchantLoginCode.value =
            "";
        }


        overlay.remove();


        if(
          merchantLoginGate
        ){

          merchantLoginGate.style.display =
            "block";
        }


        if(
          merchantLoginOpenBtn
        ){

          merchantLoginOpenBtn.textContent =
            "Fermer l’accès";
        }


        if(
          merchantLoginStatus
        ){

          merchantLoginStatus.style.display =
            "block";

          merchantLoginStatus.dataset.state =
            "ok";

          merchantLoginStatus.textContent =
            "Votre identifiant est renseigné. Saisissez maintenant votre code initial à usage unique.";
        }


        if(merchantLoginCode){

          merchantLoginCode.focus();
        }
      };


    card.appendChild(
      title
    );

    card.appendChild(
      intro
    );

    card.appendChild(
      identifierLabel
    );

    card.appendChild(
      identifierBox
    );

    card.appendChild(
      codeLabel
    );

    card.appendChild(
      codeBox
    );

    card.appendChild(
      warning
    );

    card.appendChild(
      button
    );


    overlay.appendChild(
      card
    );


    document.body.appendChild(
      overlay
    );
  }
);
       
       /* =====================================================
         FICHE COMMERCE CENTRALE
         ===================================================== */

      function fillMerchantIdentity(){

        const merchant =
          commerceReadMerchant();


        const fields = {

          merchantShopName:
            merchant.shopName,

          merchantAddress:
            merchant.address,

          merchantActivity:
            merchant.activity,

          merchantPhone:
            merchant.phone,

          merchantEmail:
            merchant.email,

          merchantSiret:
            merchant.sirenSiret

        };


        Object.keys(
          fields
        )
          .forEach(
            id =>{

              const element =
                document.getElementById(
                  id
                );


              if(element){

                element.value =
                  fields[id] ||
                  "";
              }
            }
          );


        const status =
          document.getElementById(
            "merchantProfileStatus"
          );


        if(status){

          if(
            merchant.id &&
            merchant.partnerActive
          ){

            status.dataset.state =
              "ok";

            status.textContent =
              "Commerce validé — identifiant professionnel : " +
              (
                merchant.professionalIdentifier ||
                merchant.id
              );

          }else{

            status.dataset.state =
              "warn";

            status.textContent =
              "Le dossier professionnel doit être validé avant l’ouverture complète de cet espace.";
          }
        }
      }


      fillMerchantIdentity();


      /* =====================================================
         PUBLICITÉ DEPUIS L'ESPACE PRIVÉ COMMERCE
         ===================================================== */

      const merchantLargeAdvertisingBtn =
        document.getElementById(
          "merchantLargeAdvertisingBtn"
        );

      const merchantSmallAdvertisingBtn =
        document.getElementById(
          "merchantSmallAdvertisingBtn"
        );


      if(merchantLargeAdvertisingBtn){

        merchantLargeAdvertisingBtn.onclick =
          ()=>{

            const state =
              commerceCentralAccessState(
                "commerce"
              );


            if(!state.ok){

              alert(
                commerceCentralAccessMessage(
                  state
                )
              );

              return;
            }


            commerceOpenLargeAdvertising();
          };
      }


      if(merchantSmallAdvertisingBtn){

        merchantSmallAdvertisingBtn.onclick =
          ()=>{

            const state =
              commerceCentralAccessState(
                "commerce"
              );


            if(!state.ok){

              alert(
                commerceCentralAccessMessage(
                  state
                )
              );

              return;
            }


            commerceOpenSmallAdvertising(
              commerceReadMerchant()
            );
          };
      }


      /* =====================================================
         ACCÈS ENTREPRISE CENTRAL
         ===================================================== */

      const enterpriseRegistrationBtn =
        document.getElementById(
          "enterpriseRegistrationBtn"
        );

      const enterpriseProfessionalAccessBtn =
        document.getElementById(
          "enterpriseProfessionalAccessBtn"
        );

      const enterpriseProfessionalStatus =
        document.getElementById(
          "enterpriseProfessionalStatus"
        );


      function refreshEnterpriseAccess(){

        if(!enterpriseProfessionalStatus){
          return;
        }


        const state =
          commerceCentralAccessState(
            "entreprise"
          );


        if(state.ok){

          const enterprise =
            commerceReadEnterprise();


          enterpriseProfessionalStatus.dataset.state =
            "ok";

          enterpriseProfessionalStatus.textContent =
            "Entreprise validée — identifiant professionnel : " +
            (
              enterprise.professionalIdentifier ||
              enterprise.id
            );

          return;
        }


        enterpriseProfessionalStatus.dataset.state =
          "warn";

        enterpriseProfessionalStatus.textContent =
          commerceCentralAccessMessage(
            state
          );
      }


      if(enterpriseRegistrationBtn){

        enterpriseRegistrationBtn.onclick =
          ()=>{

            commerceOpenCentralRegistration(
              "entreprise"
            );
          };
      }


      if(enterpriseProfessionalAccessBtn){

        enterpriseProfessionalAccessBtn.onclick =
          ()=>{

            const state =
              commerceCentralAccessState(
                "entreprise"
              );


            if(!state.ok){

              alert(
                commerceCentralAccessMessage(
                  state
                )
              );

              return;
            }


            openEntrepriseDirectionPanel();
          };
      }


      refreshEnterpriseAccess();


      /* =====================================================
         QR SPORT
         ===================================================== */

      const city =
        commerceActiveCity();

      const sportInput =
        document.getElementById(
          "commerceSportQrRaw"
        );

      const sportScanBtn =
        document.getElementById(
          "commerceSportScanBtn"
        );

      const sportCameraBox =
        document.getElementById(
          "commerceSportCameraBox"
        );

      const sportCameraVideo =
        document.getElementById(
          "commerceSportCamera"
        );

      const sportCameraStopBtn =
        document.getElementById(
          "commerceSportCameraStopBtn"
        );

      const sportAmount =
        document.getElementById(
          "commerceSportPurchaseAmount"
        );

      const sportPurchaseRef =
        document.getElementById(
          "commerceSportPurchaseRef"
        );

      const sportValidateBtn =
        document.getElementById(
          "commerceSportValidateBtn"
        );

      const sportStatus =
        document.getElementById(
          "commerceSportExchangeStatus"
        );


      let currentSportScan =
        null;

      let sportCameraStream =
        null;

      let sportCameraTimer =
        null;

      let sportCameraBusy =
        false;


      function setSportStatus(
        state,
        text
      ){

        if(!sportStatus){
          return;
        }


        sportStatus.dataset.state =
          state;

        sportStatus.textContent =
          text;
      }


      function stopSportCamera(){

        if(sportCameraTimer){

          clearInterval(
            sportCameraTimer
          );

          sportCameraTimer =
            null;
        }


        if(sportCameraStream){

          sportCameraStream
            .getTracks()
            .forEach(
              track =>{

                try{

                  track.stop();

                }catch(error){}
              }
            );


          sportCameraStream =
            null;
        }


        if(sportCameraVideo){

          try{

            sportCameraVideo.pause();

          }catch(error){}


          sportCameraVideo.srcObject =
            null;
        }


        if(sportCameraBox){

          sportCameraBox.classList.add(
            "commerceHidden"
          );
        }


        sportCameraBusy =
          false;
      }


      function readSportQr(){

        try{

          const scan =
            commerceParseSportScan(
              sportInput
                ? sportInput.value
                : ""
            );


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
              city.cityId
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
              "Ce QR dynamique Sport n’est pas valide."
            );
          }


          if(
            Number(
              scan.expiresAt ||
              0
            ) > 0 &&
            Number(
              scan.expiresAt
            ) < Date.now()
          ){

            throw new Error(
              "Ce QR dynamique a expiré. Demandez au club d’en afficher un nouveau."
            );
          }


          currentSportScan =
            scan;


          setSportStatus(
            "ok",
            "QR Sport reconnu — club : " +
            String(
              scan.clubName ||
              scan.name ||
              scan.clubRef ||
              "Club partenaire"
            ) +
            "."
          );


          return scan;

        }catch(error){

          currentSportScan =
            null;


          setSportStatus(
            "error",
            error &&
            error.message
              ? error.message
              : "QR Sport non reconnu."
          );


          return null;
        }
      }

           async function scanSportWithCamera(){

        if(!sportInput){
          return;
        }


        if(
          typeof window.BarcodeDetector !==
            "function" ||
          !navigator.mediaDevices ||
          typeof navigator.mediaDevices.getUserMedia !==
            "function"
        ){

          setSportStatus(
            "warn",
            "Le scanner QR n’est pas disponible sur cet appareil."
          );

          return;
        }


        let supported =
          [];


        try{

          if(
            typeof window.BarcodeDetector.getSupportedFormats ===
              "function"
          ){

            supported =
              await window.BarcodeDetector
                .getSupportedFormats();
          }

        }catch(error){}


        if(
          supported.length &&
          !supported.includes(
            "qr_code"
          )
        ){

          setSportStatus(
            "warn",
            "La lecture des QR codes n’est pas disponible sur cet appareil."
          );

          return;
        }


        stopSportCamera();


        let detector;


        try{

          detector =
            new window.BarcodeDetector({

              formats:[
                "qr_code"
              ]

            });

        }catch(error){

          setSportStatus(
            "error",
            "Le lecteur QR n’a pas pu démarrer."
          );

          return;
        }


        try{

          sportCameraStream =
            await navigator.mediaDevices
              .getUserMedia({

                audio:false,

                video:{

                  facingMode:{
                    ideal:"environment"
                  }

                }

              });


          if(!sportCameraVideo){

            stopSportCamera();
            return;
          }


          sportCameraVideo.srcObject =
            sportCameraStream;


          await sportCameraVideo.play();


          if(sportCameraBox){

            sportCameraBox.classList.remove(
              "commerceHidden"
            );
          }


          setSportStatus(
            "warn",
            "Scanner actif : présentez le QR dynamique du club."
          );


          sportCameraTimer =
            setInterval(
              async ()=>{

                if(
                  sportCameraBusy ||
                  !sportCameraVideo ||
                  sportCameraVideo.readyState < 2
                ){

                  return;
                }


                sportCameraBusy =
                  true;


                try{

                  const codes =
                    await detector.detect(
                      sportCameraVideo
                    );


                  if(
                    codes &&
                    codes[0] &&
                    codes[0].rawValue
                  ){

                    sportInput.value =
                      String(
                        codes[0].rawValue
                      ).trim();


                    stopSportCamera();

                    readSportQr();
                  }

                }catch(error){

                  console.warn(
                    "Bo'CitéArt Commerce : lecture QR Sport.",
                    error
                  );

                }finally{

                  sportCameraBusy =
                    false;
                }

              },
              450
            );

        }catch(error){

          stopSportCamera();


          setSportStatus(
            "error",
            "La caméra n’a pas pu être ouverte. Vérifiez l’autorisation d’accès à la caméra."
          );
        }
      }


      if(sportScanBtn){

        sportScanBtn.onclick =
          async ()=>{

            await scanSportWithCamera();
          };
      }


      if(sportCameraStopBtn){

        sportCameraStopBtn.onclick =
          stopSportCamera;
      }


      /* =====================================================
         VALIDATION SPORT → COMMERCE
         ===================================================== */

      if(sportValidateBtn){

        sportValidateBtn.onclick =
          async ()=>{

            const state =
              commerceCentralAccessState(
                "commerce"
              );


            if(!state.ok){

              setSportStatus(
                "error",
                commerceCentralAccessMessage(
                  state
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

              setSportStatus(
                "error",
                "Le raccord Sport → Commerce n’est pas chargé."
              );

              return;
            }


            const scan =
              currentSportScan ||
              readSportQr();


            if(!scan){
              return;
            }


            const merchant =
              commerceReadMerchant();


            if(
              !merchant.id ||
              !merchant.shopName
            ){

              setSportStatus(
                "error",
                "La fiche professionnelle du commerce doit être complète."
              );

              return;
            }


            if(
              merchant.partnerActive !== true
            ){

              setSportStatus(
                "error",
                "Le commerce doit être validé et actif dans Bo’CitéArt."
              );

              return;
            }


            const amount =
              Number(
                sportAmount
                  ? sportAmount.value
                  : 0
              );


            const reference =
              String(
                sportPurchaseRef
                  ? sportPurchaseRef.value
                  : ""
              ).trim();


            if(
              !Number.isFinite(
                amount
              ) ||
              amount < 10
            ){

              setSportStatus(
                "error",
                "Un achat réel d’au moins 10 € TTC est obligatoire avant l’échange."
              );

              return;
            }


            if(!reference){

              setSportStatus(
                "error",
                "Renseignez la référence du ticket ou de l’achat."
              );

              return;
            }


            sportValidateBtn.disabled =
              true;


            setSportStatus(
              "warn",
              "Validation de l’échange en cours…"
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

                    professionalIdentifier:
                      merchant.professionalIdentifier,

                    name:
                      merchant.shopName,

                    shopName:
                      merchant.shopName,

                    sirenSiret:
                      merchant.sirenSiret,

                    partnerActive:
                      merchant.partnerActive === true,

                    bociteartPartner:
                      merchant.partnerActive === true,

                    partnerStatus:
                      merchant.partnerActive === true
                        ? "active"
                        : "inactive"

                  },

                  {

                    amountTTC:
                      amount,

                    reference:
                      reference,

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

                setSportStatus(
                  "error",
                  commerceSportError(
                    result &&
                    result.reason
                  )
                );

                return;
              }


              setSportStatus(
                "ok",
                "Échange validé : 30 bocitecoins VERT retirés du portefeuille du club et 1 Cabas remis. Nouveau solde : " +
                Number(
                  result.balance ||
                  0
                ) +
                " VERT."
              );


              currentSportScan =
                null;


              if(sportInput){

                sportInput.value =
                  "";
              }


              if(sportAmount){

                sportAmount.value =
                  "";
              }


              if(sportPurchaseRef){

                sportPurchaseRef.value =
                  "";
              }

            }catch(error){

              console.error(
                "Bo'CitéArt Commerce : validation Sport impossible.",
                error
              );


              setSportStatus(
                "error",
                "La validation de l’échange a échoué."
              );

            }finally{

              sportValidateBtn.disabled =
                false;
            }
          };
      }


      /* =====================================================
         HISTORIQUE COMMERCE
         ===================================================== */

      const merchantHistoryExportBtn =
        document.getElementById(
          "merchantHistoryExportBtn"
        );


      if(merchantHistoryExportBtn){

        merchantHistoryExportBtn.onclick =
          ()=>{

            const merchant =
              commerceReadMerchant();


            const exportObject = {

              exportedAt:
                new Date().toISOString(),

              city:
                commerceActiveCity(),

              merchant:{
                organizationId:
                  merchant.id,

                professionalIdentifier:
                  merchant.professionalIdentifier,

                shopName:
                  merchant.shopName,

                sirenSiret:
                  merchant.sirenSiret
              }

            };


            const exportText =
              "HISTORIQUE COMMERCE — BO’CITÉART\n\n" +
              JSON.stringify(
                exportObject,
                null,
                2
              );


            if(
              navigator.clipboard &&
              navigator.clipboard.writeText
            ){

              navigator.clipboard
                .writeText(
                  exportText
                )
                .then(
                  ()=>{

                    alert(
                      "Historique Commerce copié."
                    );
                  }
                )
                .catch(
                  ()=>{

                    alert(
                      exportText
                    );
                  }
                );

            }else{

              alert(
                exportText
              );
            }
          };
      }


      /* =====================================================
         ENTREPRISE — CONTENU D'ORIGINE
         ===================================================== */

      const ENTREPRISE_MUTUALISATION_KEY =
        "bociteart_entreprise_mutualisation_v1";


      function loadEntrepriseMutualisation(){

        try{

          const raw =
            localStorage.getItem(
              ENTREPRISE_MUTUALISATION_KEY
            );


          const saved =
            raw
              ? JSON.parse(
                  raw
                )
              : {};


          return {

            electricite:
              Number(
                saved.electricite ||
                17
              ),

            gaz:
              Number(
                saved.gaz ||
                9
              ),

            telephonie:
              Number(
                saved.telephonie ||
                24
              ),

            assurances:
              Number(
                saved.assurances ||
                12
              ),

            mutuelle:
              Number(
                saved.mutuelle ||
                8
              ),

            fournitures:
              Number(
                saved.fournitures ||
                6
              )

          };

        }catch(error){

          return {

            electricite:17,
            gaz:9,
            telephonie:24,
            assurances:12,
            mutuelle:8,
            fournitures:6

          };
        }
      }


      function saveEntrepriseMutualisation(
        data
      ){

        try{

          localStorage.setItem(
            ENTREPRISE_MUTUALISATION_KEY,
            JSON.stringify(
              data
            )
          );

        }catch(error){

          console.warn(
            "Enregistrement mutualisation impossible :",
            error
          );
        }
      }


      function entrepriseOtherTopics(
        current
      ){

        const topics = [

          [
            "emploi",
            "Recherche de personnel"
          ],

          [
            "fidelisation",
            "Fidélisation"
          ],

          [
            "developpement",
            "Développement"
          ],

          [
            "mutualisation",
            "Mutualisation"
          ],

          [
            "visibilite",
            "Visibilité"
          ],

          [
            "economies",
            "Économies"
          ],

          [
            "perennite",
            "Pérennité"
          ],

          [
            "mecenat",
            "Mécénat"
          ]

        ];


        return `

          <div
            class="entrepriseSectionTitle"
          >
            Vous pourriez également
            être intéressé par
          </div>

          <div
            style="
              display:flex;
              gap:7px;
              flex-wrap:wrap;
              margin-top:9px;
            "
          >

            ${
              topics

                .filter(
                  item =>
                    item[0] !== current
                )

                .map(
                  item => `

                    <button
                      class="choiceBtn entrepriseRelatedTopic"
                      type="button"
                      data-related-topic="${item[0]}"
                    >
                      ${item[1]}
                    </button>

                  `
                )

                .join("")
            }

          </div>

        `;
      }

           function renderEntrepriseTopic(
        topicKey
      ){

        window.currentModule =
          "entreprise";

        window.currentEntrepriseScreen =
          topicKey;


        const panel =
          document.getElementById(
            "entrepriseTopicPanel"
          );

        const title =
          document.getElementById(
            "entrepriseTopicTitle"
          );

        const text =
          document.getElementById(
            "entrepriseTopicText"
          );

        const actions =
          document.getElementById(
            "entrepriseTopicActions"
          );


        if(
          !panel ||
          !title ||
          !text ||
          !actions
        ){

          return;
        }


        const topics = {

          emploi:{

            title:
              "Vous recherchez du personnel ?",

            html:`

              <div class="box">

                <strong>
                  Les habitants de votre ville
                  seront les premiers informés.
                </strong>

                <br><br>

                Publiez vos besoins,
                présentez votre entreprise
                et rapprochez directement
                les compétences disponibles
                de votre territoire.

                Pourquoi chercher plus loin
                si votre futur collaborateur
                est peut-être déjà près de chez vous ?

              </div>

              <div class="entrepriseSectionTitle">
                Déposez votre offre
              </div>

              <p>
                Bo’CitéArt la diffuse en priorité
                dans votre commune puis,
                si nécessaire,
                élargit progressivement la recherche.
              </p>

              <p>
                Les candidats répondent uniquement
                à l’annonce qui les intéresse.
                Le CV, le message et les coordonnées
                restent liés à cette offre.
              </p>

              <div class="entrepriseSectionTitle">
                Votre historique vous est offert
              </div>

              <p>
                Toutes les candidatures restent disponibles
                dans votre espace privé.
                Vous pouvez retrouver un candidat
                plusieurs mois plus tard
                lorsqu’un nouveau besoin apparaît.
              </p>

              <p>
                Votre carnet de candidats
                se construit progressivement.
              </p>

              <div class="entrepriseSectionTitle">
                Des annonces toujours à jour
              </div>

              <p>
                Lorsque le recrutement est terminé,
                indiquez simplement
                <strong>Poste pourvu</strong>.
              </p>

              <p>
                L’annonce est retirée afin que les habitants
                ne perdent plus leur temps
                à répondre à une offre déjà pourvue.
              </p>

              <p>
                Cette règle respecte le temps du candidat
                comme celui de l’entreprise.
              </p>

              <div class="box">
                Parce que les compétences
                que vous recherchez sont souvent
                déjà près de chez vous.
              </div>

              ${entrepriseOtherTopics("emploi")}
            `,

            actions:[
              [
                "Publier une offre",
                "emploi-publier"
              ],
              [
                "Consulter les offres",
                "emploi-consulter"
              ],
              [
                "Répondre à une offre",
                "emploi-repondre"
              ]
            ]

          },


          fidelisation:{

            title:
              "Attirez et fidélisez vos salariés autrement",

            html:`

              <div class="box">

                Recruter près de l’entreprise
                réduit déjà les temps
                et les coûts de transport du salarié.

              </div>

              <p>
                Un salarié ne recherche pas seulement
                une rémunération.
                Il regarde aussi la proximité,
                la reconnaissance,
                la qualité de vie
                et l’engagement de son employeur.
              </p>

              <div class="entrepriseSectionTitle">
                Quelques solutions concrètes
              </div>

              <p>
                Recruter en priorité dans la commune
                ou dans les communes voisines.
              </p>

              <p>
                Faire connaître les commerces,
                les services,
                les clubs et les activités accessibles
                près du lieu de travail.
              </p>

              <p>
                Valoriser les initiatives locales
                auxquelles l’entreprise participe.
              </p>

              <p>
                Associer les salariés
                à une action de mécénat
                ou à un projet utile au territoire.
              </p>

              <p>
                Mettre en avant les métiers,
                les équipes et le savoir-faire
                de l’entreprise afin de renforcer
                le sentiment d’appartenance.
              </p>

              <div class="box">
                Bo’CitéArt relie progressivement
                l’entreprise aux solutions
                qui existent réellement autour d’elle.
              </div>

              ${entrepriseOtherTopics("fidelisation")}
            `,

            actions:[
              [
                "Rechercher du personnel",
                "emploi"
              ],
              [
                "Découvrir les services locaux",
                "annuaire"
              ],
              [
                "Découvrir le mécénat",
                "mecenat"
              ]
            ]

          },


          developpement:{

            title:
              "Développez votre entreprise",

            html:`

              <div class="box">
                Votre prochain client,
                fournisseur,
                salarié ou partenaire
                se trouve déjà dans votre ville
                ou à proximité.
              </div>

              <p>
                Une entreprise se développe
                grâce à ses produits
                et à ses services,
                mais aussi grâce aux rencontres,
                aux informations
                et aux bonnes décisions
                prises au bon moment.
              </p>

              <div class="entrepriseSectionTitle">
                Commencez par regarder autour de vous
              </div>

              <p>
                Découvrez les entreprises
                présentes dans votre commune,
                leurs métiers,
                leurs savoir-faire
                et leurs besoins.
              </p>

              <p>
                Recherchez un fournisseur,
                un sous-traitant,
                une compétence complémentaire
                ou un partenaire local.
              </p>

              <p>
                Faites connaître votre propre activité
                afin que les autres acteurs
                puissent également vous identifier.
              </p>

              <div class="box">
                Bo’CitéArt prépare des connexions utiles
                entre les acteurs du territoire.
              </div>

              ${entrepriseOtherTopics("developpement")}
            `,

            actions:[
              [
                "Les entreprises de ma ville",
                "annuaire"
              ],
              [
                "Faire connaître mon entreprise",
                "visibilite"
              ],
              [
                "Rechercher un partenaire",
                "partenaire"
              ]
            ]

          },


          mutualisation:{

            title:
              "Réduisez vos charges",

            html:`

              <div class="box">

                <strong>
                  Pourquoi continuer à négocier seul
                  lorsqu’il est possible
                  de construire des solutions communes ?
                </strong>

                <br><br>

                Bo’CitéArt organise la démarche.

              </div>

              <p>
                Cochez les sujets qui vous intéressent.
                Chaque sélection augmente immédiatement
                le compteur.
              </p>

              <p>
                Plus les entreprises sont nombreuses,
                plus le rapport de force devient favorable.
              </p>

              <div
                id="entrepriseMutualisationCounters"
              ></div>

              <div
                class="box"
                style="margin-top:12px;"
              >
                Dès que le nombre nécessaire est atteint,
                Bo’CitéArt prépare la consultation
                auprès des prestataires.
              </div>

              <p>
                Les propositions sont présentées clairement
                dans le Tableau de Direction.
              </p>

              <p>
                Chaque entreprise choisit ensuite
                la proposition qu’elle souhaite.
                La décision finale lui appartient.
              </p>

              ${entrepriseOtherTopics("mutualisation")}
            `,

            actions:[
              [
                "Voir mon Tableau de Direction",
                "direction"
              ]
            ]

          },


          visibilite:{

            title:
              "Faites connaître vos métiers et votre savoir-faire",

            html:`

              <div class="box">
                Avant d’acheter
                ou de chercher ailleurs,
                les habitants doivent déjà savoir
                que vous existez.
              </div>

              <p>
                Il reste difficile de savoir
                qui fait quoi dans sa propre ville.
              </p>

              <div class="entrepriseSectionTitle">
                Faire connaître votre entreprise crée des leviers
              </div>

              <p>
                Emploi,
                bouche-à-oreille,
                partenariats,
                découverte des métiers,
                vocations chez les jeunes
                et transmission future.
              </p>

              <p>
                Même si vos produits
                ne s’adressent pas directement
                aux particuliers,
                les habitants connaissent vos métiers,
                parlent de vous
                et transmettent votre nom.
              </p>

              <div class="box">
                Une entreprise visible
                devient progressivement un repère
                pour les habitants,
                les salariés,
                les partenaires
                et les autres entreprises du territoire.
              </div>

              ${entrepriseOtherTopics("visibilite")}
            `,

            actions:[
              [
                "Voir les entreprises de la ville",
                "annuaire"
              ],
              [
                "Présenter mon entreprise",
                "fiche-enrichie"
              ],
              [
                "Diffuser une publicité",
                "publicite"
              ]
            ]

          },


          economies:{

            title:
              "Comparez, choisissez, validez",

            html:`

              <div class="box">
                Recevez des propositions claires
                et comparables
                avant de prendre votre décision.
              </div>

              <p>
                Bo’CitéArt prépare la consultation,
                centralise les réponses
                et présente les solutions reçues.
              </p>

              <p>
                Les participants voient
                les propositions disponibles,
                le délai de réponse
                et l’état d’avancement.
              </p>

              <p>
                Chacun effectue son choix
                dans son Tableau de Direction.
              </p>

              <div class="box">
                Bo’CitéArt organise.
                L’entreprise compare et décide.
              </div>

              ${entrepriseOtherTopics("economies")}
            `,

            actions:[
              [
                "Voir les solutions communes",
                "mutualisation"
              ],
              [
                "Ouvrir le Tableau de Direction",
                "direction"
              ]
            ]

          },


          perennite:{

            title:
              "Préparez l’avenir de votre entreprise",

            html:`

              <div class="entrepriseSectionTitle">
                Savez-vous combien vaut réellement votre entreprise ?
              </div>

              <p>
                Cette première approche
                se réalise avec votre expert-comptable.
              </p>

              <p>
                Le chiffre d’affaires ne suffit pas.
                La rentabilité,
                la clientèle,
                l’équipe,
                la réputation,
                le matériel,
                l’organisation
                et le savoir-faire comptent aussi.
              </p>

              <div class="entrepriseSectionTitle">
                Souhaitez-vous la transmettre ?
              </div>

              <p>
                À vos enfants,
                à un salarié
                ou à un repreneur extérieur ?
              </p>

              <p>
                Commencez par en parler
                avec vos proches,
                puis avec votre expert-comptable
                afin d’obtenir
                une première approche chiffrée.
              </p>

              <p>
                La CCI,
                la CMA
                et les réseaux professionnels
                disposent également de services
                consacrés à la transmission.
              </p>

              <div class="box">
                Se renseigner avant d’agir
                permet de découvrir plusieurs chemins
                et de choisir celui
                qui correspond à votre situation.
              </div>

              ${entrepriseOtherTopics("perennite")}
            `,

            actions:[
              [
                "Rechercher un expert local",
                "expert"
              ],
              [
                "Rechercher une chambre consulaire",
                "chambre"
              ],
              [
                "Faire connaître mon entreprise",
                "visibilite"
              ]
            ]

          },


          mecenat:{

            title:
              "Savez-vous à qui et à quoi sert le mécénat ?",

            html:`

              <div class="box">

                <strong>
                  Le mécénat est accessible aux entreprises,
                  quelle que soit leur taille.
                </strong>

              </div>

              <p>
                Le mécénat permet de soutenir
                un projet culturel,
                éducatif,
                sportif,
                associatif,
                patrimonial
                ou une autre action d’intérêt général.
              </p>

              <p>
                Il témoigne aussi
                de l’existence
                et de l’identité de l’entreprise
                dans sa ville.
              </p>

              <p>
                Chaque remerciement rappelle
                aux habitants
                qu’une entreprise locale
                a participé à un projet utile.
              </p>

              <p>
                Sous les conditions prévues par la loi,
                le mécénat ouvre droit
                aux avantages fiscaux applicables.
                L’expert-comptable précise
                les règles correspondant à l’entreprise.
              </p>

              <div class="box">
                Un geste discret
                s’inscrit durablement
                dans la vie de la ville.
              </div>

              ${entrepriseOtherTopics("mecenat")}
            `,

            actions:[
              [
                "Découvrir les projets locaux",
                "projets-mecenat"
              ],
              [
                "Faire connaître mon engagement",
                "visibilite"
              ],
              [
                "Poser une question",
                "ia"
              ]
            ]

          }

        };


        const topic =
          topics[
            topicKey
          ];


        if(!topic){
          return;
        }


        title.textContent =
          topic.title;

        text.innerHTML =
          topic.html;

        actions.innerHTML =
          "";


        topic.actions.forEach(
          action =>{

            const button =
              document.createElement(
                "button"
              );


            button.className =
              "choiceBtn";

            button.type =
              "button";

            button.textContent =
              action[0];

            button.dataset.entrepriseAction =
              action[1];


            button.onclick =
              ()=>{

                handleEntrepriseAction(
                  action[1]
                );
              };


            actions.appendChild(
              button
            );
          }
        );


        panel.style.display =
          "block";


        panel
          .querySelectorAll(
            "[data-related-topic]"
          )
          .forEach(
            button =>{

              button.onclick =
                ()=>{

                  renderEntrepriseTopic(
                    button.getAttribute(
                      "data-related-topic"
                    )
                  );
                };
            }
          );


        if(
          topicKey ===
            "mutualisation"
        ){

          renderEntrepriseMutualisation();
        }


        panel.scrollIntoView({

          behavior:"smooth",
          block:"nearest"

        });
      }

           function renderEntrepriseMutualisation(){

        const host =
          document.getElementById(
            "entrepriseMutualisationCounters"
          );


        if(!host){
          return;
        }


        const data =
          loadEntrepriseMutualisation();


        const items = [

          [
            "electricite",
            "Électricité",
            30
          ],

          [
            "gaz",
            "Gaz",
            30
          ],

          [
            "telephonie",
            "Téléphonie",
            30
          ],

          [
            "assurances",
            "Assurances",
            30
          ],

          [
            "mutuelle",
            "Mutuelle",
            30
          ],

          [
            "fournitures",
            "Fournitures professionnelles",
            30
          ]

        ];


        host.innerHTML =
          items
            .map(
              item =>{

                const key =
                  item[0];

                const label =
                  item[1];

                const target =
                  item[2];

                const value =
                  Number(
                    data[key] ||
                    0
                  );


                return `

                  <div class="entrepriseCounter">

                    <div>

                      <strong>
                        ${label}
                      </strong>

                      <br>

                      <span class="muted">
                        Objectif conseillé :
                        ${target} participants
                      </span>

                    </div>


                    <div style="text-align:right;">

                      <div
                        class="entrepriseCounterValue"
                      >
                        ${value} / ${target}
                      </div>

                      <button
                        class="choiceBtn entrepriseMutualisationVote"
                        type="button"
                        data-mutualisation-key="${key}"
                        style="
                          margin-top:6px;
                          padding:7px 9px;
                        "
                      >
                        Je suis intéressé
                      </button>

                    </div>

                  </div>

                `;
              }
            )
            .join("");


        host
          .querySelectorAll(
            ".entrepriseMutualisationVote"
          )
          .forEach(
            button =>{

              button.onclick =
                ()=>{

                  const key =
                    button.getAttribute(
                      "data-mutualisation-key"
                    );


                  const current =
                    loadEntrepriseMutualisation();


                  current[key] =
                    Number(
                      current[key] ||
                      0
                    ) + 1;


                  saveEntrepriseMutualisation(
                    current
                  );


                  renderEntrepriseMutualisation();


                  alert(
                    "Votre intérêt est enregistré.\n\n" +
                    "Le compteur vient d’augmenter. " +
                    "Cette première sélection ne constitue pas encore un engagement définitif."
                  );
                };
            }
          );
      }


      function openOfficialCompaniesDirectory(){

        openModal(
          "Les entreprises de votre ville",
          `

            <div class="box">

              <strong>
                Annuaire officiel de la commune
              </strong>

              <br><br>

              Cet annuaire rassemble
              les entreprises référencées
              et leurs activités.

            </div>

            <input
              id="officialCompanySearch"
              class="miniField"
              placeholder="Rechercher un métier ou une entreprise"
            >

            <div
              id="officialCompaniesList"
              style="margin-top:12px;"
            ></div>

          `
        );


        setTimeout(
          ()=>{

            const input =
              document.getElementById(
                "officialCompanySearch"
              );

            const list =
              document.getElementById(
                "officialCompaniesList"
              );


            function renderCompanies(){

              if(!list){
                return;
              }


              const query =
                input
                  ? String(
                      input.value ||
                      ""
                    )
                      .trim()
                      .toLowerCase()
                  : "";


              let source =
                [];


              if(
                Array.isArray(
                  window.bociteartCompanies
                )
              ){

                source =
                  window.bociteartCompanies;
              }


              const filtered =
                source.filter(
                  company =>{

                    const name =
                      String(
                        company.name ||
                        company.nom ||
                        ""
                      )
                        .toLowerCase();

                    const activity =
                      String(
                        company.activity ||
                        company.activite ||
                        ""
                      )
                        .toLowerCase();


                    return (
                      !query ||
                      name.includes(
                        query
                      ) ||
                      activity.includes(
                        query
                      )
                    );
                  }
                );


              if(!filtered.length){

                list.innerHTML = `

                  <div class="box">

                    Aucun résultat
                    n’est actuellement disponible
                    pour cette recherche.

                  </div>

                `;

                return;
              }


              list.innerHTML =
                filtered
                  .map(
                    company => `

                      <div class="box">

                        <strong>
                          ${commerceEsc(
                            company.name ||
                            company.nom ||
                            "Entreprise"
                          )}
                        </strong>

                        <br>

                        ${commerceEsc(
                          company.activity ||
                          company.activite ||
                          ""
                        )}

                      </div>

                    `
                  )
                  .join("");
            }


            if(input){

              input.oninput =
                renderCompanies;
            }


            renderCompanies();

          },
          0
        );
      }


      function openEntrepriseDirectionPanel(){

        const state =
          commerceCentralAccessState(
            "entreprise"
          );


        if(!state.ok){

          alert(
            commerceCentralAccessMessage(
              state
            )
          );

          return;
        }


        openModal(
          "Tableau de Direction",
          `

            <div class="entreprisePrivate">

              <strong>
                Accès réservé à l’entreprise
              </strong>

              <br><br>

              Cet espace est rattaché
              au compte professionnel validé
              de l’entreprise.

            </div>


            <div class="entrepriseSectionTitle">
              Aperçu de votre activité
            </div>


            <div class="box">

              Candidatures reçues :
              <strong>3</strong>

              <br>

              Publicités programmées :
              <strong>1</strong>

              <br>

              Demandes de devis :
              <strong>2</strong>

              <br>

              Solutions communes suivies :
              <strong>4</strong>

            </div>


            <div class="entrepriseSectionTitle">
              Solutions communes
            </div>


            <div
              id="directionMutualisationPreview"
            ></div>


            <div class="entrepriseSectionTitle">
              Services professionnels
            </div>


            <div class="box">

              <strong>
                Adhésion annuelle professionnelle
              </strong>

              <br>

              329 € HT par an.

            </div>


            <div class="box">

              <strong>
                Fiche enrichie optionnelle
              </strong>

              <br>

              199 € HT par an.

            </div>


            <div class="box">

              <strong>
                Communication ponctuelle
              </strong>

              <br>

              50 € HT par publication
              ou offre d’emploi.

            </div>


            <div class="commerceCard">

              <div class="commerceTitle">
                Publicités & visibilité
              </div>

              <div class="commerceActions">

                <button
                  class="commerceBtn"
                  id="directionLargeAdvertisingBtn"
                  type="button"
                >
                  Grand bandeau publicitaire
                </button>

                <button
                  class="commerceBtn"
                  id="directionSmallAdvertisingBtn"
                  type="button"
                >
                  Petit bandeau publicitaire
                </button>

              </div>

            </div>

          `
        );


        setTimeout(
          ()=>{

            const host =
              document.getElementById(
                "directionMutualisationPreview"
              );


            if(host){

              const data =
                loadEntrepriseMutualisation();


              host.innerHTML = `

                <div class="box">

                  Électricité :
                  <strong>
                    ${data.electricite} participants
                  </strong>

                  <br>

                  Gaz :
                  <strong>
                    ${data.gaz} participants
                  </strong>

                  <br>

                  Téléphonie :
                  <strong>
                    ${data.telephonie} participants
                  </strong>

                  <br>

                  Assurances :
                  <strong>
                    ${data.assurances} participants
                  </strong>

                </div>

              `;
            }


            const large =
              document.getElementById(
                "directionLargeAdvertisingBtn"
              );

            const small =
              document.getElementById(
                "directionSmallAdvertisingBtn"
              );


            if(large){

              large.onclick =
                commerceOpenLargeAdvertising;
            }


            if(small){

              small.onclick =
                ()=>{

                  commerceOpenSmallAdvertising(
                    commerceReadEnterprise()
                  );
                };
            }

          },
          0
        );
      }


      function handleEntrepriseAction(
        action
      ){

        if(
          action ===
            "annuaire"
        ){

          openOfficialCompaniesDirectory();
          return;
        }


        if(
          action ===
            "direction"
        ){

          openEntrepriseDirectionPanel();
          return;
        }


        if(
          action ===
            "emploi"
        ){

          renderEntrepriseTopic(
            "emploi"
          );

          return;
        }


        if(
          action ===
            "mutualisation"
        ){

          renderEntrepriseTopic(
            "mutualisation"
          );

          return;
        }


        if(
          action ===
            "visibilite"
        ){

          renderEntrepriseTopic(
            "visibilite"
          );

          return;
        }


        if(
          action ===
            "mecenat"
        ){

          renderEntrepriseTopic(
            "mecenat"
          );

          return;
        }


        if(
          action ===
            "publicite"
        ){

          const state =
            commerceCentralAccessState(
              "entreprise"
            );


          if(!state.ok){

            alert(
              commerceCentralAccessMessage(
                state
              )
            );

            return;
          }


          commerceOpenLargeAdvertising();
          return;
        }


        if(
          action ===
            "ia"
        ){

          const input =
            document.getElementById(
              "entrepriseAiQuestion"
            );


          if(input){

            input.focus();
          }

          return;
        }


        alert(
          "Cette fonction est rattachée à l’espace professionnel de l’entreprise."
        );
      }


      document
        .querySelectorAll(
          "[data-enterprise-topic]"
        )
        .forEach(
          band =>{

            band.onclick =
              ()=>{

                renderEntrepriseTopic(
                  band.getAttribute(
                    "data-enterprise-topic"
                  )
                );
              };
          }
        );


      const openOfficialCompanies =
        document.getElementById(
          "openOfficialCompanies"
        );


      if(openOfficialCompanies){

        openOfficialCompanies.onclick =
          openOfficialCompaniesDirectory;
      }


      const openEntrepriseDirection =
        document.getElementById(
          "openEntrepriseDirection"
        );


      if(openEntrepriseDirection){

        openEntrepriseDirection.onclick =
          openEntrepriseDirectionPanel;
      }

           /* =====================================================
         QUESTION ENTREPRISE
         ===================================================== */

      const entrepriseAiAskBtn =
        document.getElementById(
          "entrepriseAiAskBtn"
        );


      if(entrepriseAiAskBtn){

        entrepriseAiAskBtn.onclick =
          ()=>{

            const input =
              document.getElementById(
                "entrepriseAiQuestion"
              );

            const answer =
              document.getElementById(
                "entrepriseAiAnswer"
              );


            const question =
              input
                ? String(
                    input.value ||
                    ""
                  ).trim()
                : "";


            if(!question){

              alert(
                "Écrivez votre question."
              );

              return;
            }


            if(!answer){
              return;
            }


            const lower =
              question.toLowerCase();


            if(
              lower.includes(
                "électricien"
              ) ||
              lower.includes(
                "plombier"
              ) ||
              lower.includes(
                "avocat"
              ) ||
              lower.includes(
                "comptable"
              )
            ){

              answer.innerHTML = `

                <div class="box">

                  Bo’CitéArt recherche d’abord
                  les professionnels présents
                  dans votre commune.

                  <br><br>

                  Si aucun résultat ne correspond,
                  la recherche est élargie
                  aux communes voisines puis,
                  si nécessaire,
                  à un territoire plus large.

                  <br><br>

                  <button
                    class="choiceBtn"
                    type="button"
                    id="aiOpenDirectory"
                  >
                    Consulter les entreprises
                    de la ville
                  </button>

                </div>

              `;


              setTimeout(
                ()=>{

                  const button =
                    document.getElementById(
                      "aiOpenDirectory"
                    );


                  if(button){

                    button.onclick =
                      openOfficialCompaniesDirectory;
                  }

                },
                0
              );


              return;
            }


            if(
              lower.includes(
                "charge"
              ) ||
              lower.includes(
                "électricité"
              ) ||
              lower.includes(
                "gaz"
              ) ||
              lower.includes(
                "assurance"
              ) ||
              lower.includes(
                "téléphone"
              )
            ){

              answer.innerHTML = `

                <div class="box">

                  Commencez par consulter
                  les solutions communes
                  déjà ouvertes dans votre ville.

                  <br><br>

                  Plus le nombre
                  de participants augmente,
                  plus les conditions
                  de négociation deviennent favorables.

                  <br><br>

                  <button
                    class="choiceBtn"
                    type="button"
                    id="aiOpenMutualisation"
                  >
                    Voir les solutions communes
                  </button>

                </div>

              `;


              setTimeout(
                ()=>{

                  const button =
                    document.getElementById(
                      "aiOpenMutualisation"
                    );


                  if(button){

                    button.onclick =
                      ()=>{

                        renderEntrepriseTopic(
                          "mutualisation"
                        );
                      };
                  }

                },
                0
              );


              return;
            }


            if(
              lower.includes(
                "personnel"
              ) ||
              lower.includes(
                "salarié"
              ) ||
              lower.includes(
                "recrut"
              )
            ){

              answer.innerHTML = `

                <div class="box">

                  Faites connaître votre besoin
                  en priorité aux habitants
                  de votre commune.

                  <br><br>

                  Les compétences recherchées
                  sont déjà présentes
                  à proximité.

                  <br><br>

                  <button
                    class="choiceBtn"
                    type="button"
                    id="aiOpenEmployment"
                  >
                    Ouvrir le recrutement local
                  </button>

                </div>

              `;


              setTimeout(
                ()=>{

                  const button =
                    document.getElementById(
                      "aiOpenEmployment"
                    );


                  if(button){

                    button.onclick =
                      ()=>{

                        renderEntrepriseTopic(
                          "emploi"
                        );
                      };
                  }

                },
                0
              );


              return;
            }


            answer.innerHTML = `

              <div class="box">

                Votre question
                a bien été prise en compte.

                <br><br>

                Bo’CitéArt recherche d’abord
                les solutions disponibles
                dans votre ville,
                puis dans les communes voisines
                lorsque cela est nécessaire.

              </div>

            `;
          };
      }


      /* =====================================================
         RAFRAÎCHISSEMENT DES ACCÈS
         ===================================================== */

      const initialCommerceState =
        commerceCentralAccessState(
          "commerce"
        );


      if(
        initialCommerceState.ok &&
        merchantLoginStatus
      ){

        merchantLoginStatus.style.display =
          "block";

        merchantLoginStatus.dataset.state =
          "ok";

        merchantLoginStatus.textContent =
          "Accès professionnel Commerce actif.";
      }


      const initialEnterpriseState =
        commerceCentralAccessState(
          "entreprise"
        );


      if(
        initialEnterpriseState.ok &&
        enterpriseProfessionalStatus
      ){

        const enterprise =
          commerceReadEnterprise();


        enterpriseProfessionalStatus.dataset.state =
          "ok";

        enterpriseProfessionalStatus.textContent =
          "Entreprise validée — identifiant professionnel : " +
          (
            enterprise.professionalIdentifier ||
            enterprise.id
          );
      }

    },
    0
  );


  return;
}


/* =========================================================
   PORTE PUBLIQUE DU MODULE
   ========================================================= */

window.BociteCommerceModule = {

  ready:true,

  open:
    openCommerceModule,

  getCommerceIdentity:
    commerceReadMerchant,

  getEnterpriseIdentity:
    commerceReadEnterprise,

  getEnterpriseQrIdentity:
    commerceEnterpriseQrIdentity,

  advertising:{

    openLarge:
      commerceOpenLargeAdvertising,

    openSmall:
      commerceOpenSmallAdvertising

  }

};


window.openCommerceModule =
  openCommerceModule;


/* =========================================================
   FIN
   ========================================================= */

})();

/* =========================================================
   ÇA FINIT ICI — BO’CITÉART COMMERCE / ENTREPRISE
   ========================================================= */
