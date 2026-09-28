/* =========================================================
   ÇA COMMENCE ICI — BLOC 1/3
   BO'CITÉART — COMMERCE / ENTREPRISE
   ========================================================= */

/* =========================================================
   BO'CITÉART
   MODULE COMMERCE / ENTREPRISE

   Fichier :
   entreprise/commerce/bociteart-commerce.js
   ========================================================= */

(function(){

"use strict";


/* =========================================================
   PROTECTION CONTRE UN DOUBLE CHARGEMENT
   ========================================================= */

if(
  window.__bociteCommerceModuleLoaded ===
    true
){
  return;
}


window.__bociteCommerceModuleLoaded =
  true;


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

    .bociteCommerceRoot
    .commerceCard{
      background:#fff;
      border:2px solid rgba(0,0,0,.08);
      border-radius:14px;
      padding:12px;
      margin:10px 0;
      color:#111;
      font-size:14px;
      font-weight:400;
    }

    .bociteCommerceRoot
    .commerceTitle{
      color:#2f5d46;
      font-size:17px;
      line-height:1.25;
      font-weight:700;
      margin:0 0 8px;
    }

    .bociteCommerceRoot
    .commerceText,

    .bociteCommerceRoot
    .commerceStatus,

    .bociteCommerceRoot
    .commerceLabel,

    .bociteCommerceRoot li{
      color:#111;
      font-size:14px;
      line-height:1.5;
      font-weight:400;
    }

    .bociteCommerceRoot
    .commerceBrand{
      display:inline-flex;
      gap:0;
      white-space:nowrap;
      font-weight:800;
    }

    .bociteCommerceRoot
    .commerceBrandGreen{
      color:#2f5d46;
    }

    .bociteCommerceRoot
    .commerceBrandRed{
      color:#a51e22;
    }

    .bociteCommerceRoot
    .commerceBtn{
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

    .bociteCommerceRoot
    .commerceBtn:disabled{
      opacity:.55;
      cursor:not-allowed;
    }

    .bociteCommerceRoot
    .commerceActions{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:10px;
    }

    .bociteCommerceRoot
    .commerceField{
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

    .bociteCommerceRoot
    textarea.commerceField{
      min-height:90px;
      resize:vertical;
    }

    .bociteCommerceRoot
    .commerceLabel{
      display:block;
      margin-top:10px;
      margin-bottom:5px;
    }

    .bociteCommerceRoot
    .commerceStatus{
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

    .bociteCommerceRoot
    .commerceWallet{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
    }

    .bociteCommerceRoot
    .commerceWalletValue{
      font-size:26px;
      font-weight:800;
      color:#9a7000;
      white-space:nowrap;
    }

    .bociteCommerceRoot
    .commerceRule{
      border-left:6px solid #2f5d46;
    }

    .bociteCommerceRoot
    .commerceSport{
      border-left:6px solid #2f5d46;
      background:#f3faf6;
    }

    .bociteCommerceRoot
    .commerceHidden{
      display:none;
    }

    .bociteCommerceRoot
    .commerceSmall{
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
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}


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


function commerceMerchantKey(){

  return (
    "bociteart_merchant_profile_v2__city__" +
    commerceActiveCity().cityId
  );
}


function commerceReadMerchant(){

  try{

    const raw =
      localStorage.getItem(
        commerceMerchantKey()
      );


    const saved =
      raw
        ? JSON.parse(raw)
        : {};


    return {

      id:
        String(
          saved.id ||
          ""
        ),

      shopName:
        String(
          saved.shopName ||
          ""
        ),

      address:
        String(
          saved.address ||
          ""
        ),

      phone:
        String(
          saved.phone ||
          ""
        ),

      email:
        String(
          saved.email ||
          ""
        ),

      sirenSiret:
        String(
          saved.sirenSiret ||
          ""
        ),

      partnerActive:
        saved.partnerActive !==
          false

    };

  }catch(error){

    return {

      id:"",
      shopName:"",
      address:"",
      phone:"",
      email:"",
      sirenSiret:"",
      partnerActive:true

    };
  }
}


function commerceId(){

  if(
    window.crypto &&
    typeof window.crypto.randomUUID ===
      "function"
  ){

    return (
      "BCA-M-" +
      window.crypto.randomUUID()
    );
  }


  return (
    "BCA-M-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2,10)
  );
}


function commerceWriteMerchant(
  data
){

  try{

    localStorage.setItem(
      commerceMerchantKey(),
      JSON.stringify(
        data
      )
    );

    return true;

  }catch(error){

    return false;
  }
}


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
    messages[
      reason
    ] ||
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

            Les bocitecoins territoriaux
            accompagnent les achats réalisés
            chez les commerces partenaires
            ${commerceBrandHtml()}.

            <br><br>

            Ils ne sont ni une monnaie,
            ni un moyen de paiement
            et ne sont jamais convertis
            en euros.

          </div>

        </div>


        <div class="commerceCard">

          <div class="commerceTitle">

            Votre portefeuille territorial

          </div>

          <div class="commerceWallet">

            <div class="commerceText">

              Ville active :
              <strong
                id="commerceActiveCityName"
              ></strong>

              <br>

              <span
                id="commerceCoinName"
              ></span>
              disponibles

            </div>

            <div
              class="commerceWalletValue"
              id="citizenCoinBalance"
            >
              0
            </div>

          </div>

          <div
            class="commerceSmall"
            style="margin-top:8px;"
          >

            Chaque ville conserve
            son propre portefeuille.

            Les soldes ne se mélangent
            pas entre les villes.

          </div>

        </div>


        <div class="commerceCard">

          <div class="commerceTitle">

            Commerces partenaires

          </div>

          <div
            id="demoCommercesList"
            class="commerceText"
          >

            Chargement des commerces
            partenaires…

          </div>

        </div>


        <div class="commerceCard">

          <div class="commerceTitle">

            Publicités & visibilité

          </div>

          <div class="commerceText">

            Votre fiche commerce
            reste enregistrée
            dans votre espace.

            La programmation
            des publicités passe
            par l’accès central
            « Publicités & visibilité ».

          </div>

        </div>


        <div class="commerceCard">

          <div class="commerceTitle">

            Espace interne commerçant

          </div>

          <div class="commerceText">

            Cet espace sert
            au commerce partenaire
            pour enregistrer sa fiche
            et traiter les opérations
            liées aux bocitecoins.

          </div>

          <div class="commerceActions">

            <button
              class="commerceBtn"
              id="merchantInternalOpenBtn"
              type="button"
            >
              Ouvrir mon espace Commerce
            </button>

          </div>

        </div>


        <div
          id="merchantInternalSpace"
          style="display:none;"
        >

          <div class="commerceCard">

            <div class="commerceTitle">

              Fiche du commerce

            </div>

            <div class="commerceText">

              La fiche est enregistrée
              pour la ville active.

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
              autocomplete="organization"
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
              autocomplete="street-address"
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
              autocomplete="tel"
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
              autocomplete="email"
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
            >

            <div class="commerceActions">

              <button
                class="commerceBtn"
                id="merchantProfileSaveBtn"
                type="button"
              >
                Enregistrer ma fiche
              </button>

            </div>

            <div
              id="merchantProfileStatus"
              class="commerceStatus"
              data-state="warn"
            >
              Fiche à vérifier.
            </div>

          </div>


          <div
            class="commerceCard commerceSport"
          >

            <div class="commerceTitle">

              Club sportif —
              30 VERT → 1 Cabas

            </div>

            <div class="commerceText">

              Le représentant du club
              effectue d’abord
              un achat distinct
              d’au moins 10 € TTC
              dans ce commerce partenaire.

              <br><br>

              Le commerce scanne ensuite
              le QR dynamique du club.

              Après validation,
              30 bocitecoins VERT
              sont retirés
              du portefeuille du club
              et un Cabas est remis.

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
              placeholder="Le contenu du QR apparaîtra ici après le scan. Il peut aussi être collé manuellement pour les tests."
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

              <div
                class="commerceActions"
              >

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
              placeholder="Ex : TICKET-20260928-001"
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
              En attente d’une opération.
            </div>

          </div>


          <div class="commerceCard">

            <div class="commerceTitle">

              Historique local
              de démonstration

            </div>

            <div class="commerceText">

              Les opérations validées
              restent rattachées
              à la ville active
              et au commerce.

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
          >
          </div>

          <div
            id="entrepriseTopicText"
            style="
              margin-top:10px;
              line-height:1.55;
            "
          >
          </div>

          <div
            id="entrepriseTopicActions"
            style="
              display:flex;
              gap:8px;
              flex-wrap:wrap;
              margin-top:14px;
            "
          >
          </div>

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
          >
          </div>

        </div>

      </div>

    </div>

  `
  );


  setTimeout(
    ()=>{

      const openCommerceSpace =
        $("openCommerceSpace");

      const openEntrepriseSpace =
        $("openEntrepriseSpace");

      const commerceSpace =
        $("commerceSpace");

      const entrepriseSpace =
        $("entrepriseSpace");


      function showProfessionalSpace(
        spaceName
      ){

        if(commerceSpace){

          commerceSpace.style.display =
            spaceName ===
              "commerce"
              ? "block"
              : "none";
        }


        if(entrepriseSpace){

          entrepriseSpace.style.display =
            spaceName ===
              "entreprise"
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
              ? JSON.parse(raw)
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
                    item[0] !==
                    current
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
          $("entrepriseTopicPanel");

        const title =
          $("entrepriseTopicTitle");

        const text =
          $("entrepriseTopicText");

        const actions =
          $("entrepriseTopicActions");


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

              </div>

            `

          },

/* =========================================================
   ÇA FINIT ICI — BLOC 1/3
   NE PAS COMMITER ENCORE
   ========================================================= */

                  <div class="box">
          Pourquoi chercher plus loin si votre futur collaborateur
          est peut-être déjà près de chez vous ?
        </div>

        <div class="entrepriseSectionTitle">
          Déposez votre offre
        </div>

        <p>
          Bo’CitéArt la diffuse en priorité dans votre commune puis,
          si nécessaire, élargit progressivement la recherche.
        </p>

        <p>
          Les candidats répondent uniquement à l’annonce qui les intéresse.
          Le CV, le message et les coordonnées restent liés à cette offre.
        </p>

        <div class="entrepriseSectionTitle">
          Votre historique vous est offert
        </div>

        <p>
          Toutes les candidatures restent disponibles dans votre espace privé.
          Vous pouvez retrouver un candidat plusieurs mois plus tard
          lorsqu’un nouveau besoin apparaît.
        </p>

        <p>
          Votre carnet de candidats se construit progressivement.
        </p>

        <div class="entrepriseSectionTitle">
          Des annonces toujours à jour
        </div>

        <p>
          Lorsque le recrutement est terminé, indiquez simplement
          <strong>Poste pourvu</strong>.
        </p>

        <p>
          L’annonce est retirée afin que les habitants ne perdent plus
          leur temps à répondre à une offre déjà pourvue.
        </p>

        <p>
          Cette règle respecte le temps du candidat comme celui de l’entreprise.
        </p>

        <div class="box">
          Parce que les compétences que vous recherchez sont souvent
          déjà près de chez vous.
        </div>

        ${entrepriseOtherTopics("emploi")}
      `,
      actions:[
        ["Publier une offre", "emploi-publier"],
        ["Consulter les offres", "emploi-consulter"],
        ["Répondre à une offre", "emploi-repondre"]
      ]
    },

    fidelisation:{
      title:"Attirez et fidélisez vos salariés autrement",
      html:`
        <div class="box">
          Recruter près de l’entreprise réduit déjà les temps
          et les coûts de transport du salarié.
        </div>

        <p>
          Un salarié ne recherche pas seulement une rémunération.
          Il regarde aussi la proximité, la reconnaissance,
          la qualité de vie et l’engagement de son employeur.
        </p>

        <div class="entrepriseSectionTitle">
          Quelques solutions concrètes
        </div>

        <p>
          Recruter en priorité dans la commune ou dans les communes voisines.
        </p>

        <p>
          Faire connaître les commerces, les services, les clubs
          et les activités accessibles près du lieu de travail.
        </p>

        <p>
          Valoriser les initiatives locales auxquelles l’entreprise participe.
        </p>

        <p>
          Associer les salariés à une action de mécénat ou à un projet
          utile au territoire.
        </p>

        <p>
          Mettre en avant les métiers, les équipes et le savoir-faire
          de l’entreprise afin de renforcer le sentiment d’appartenance.
        </p>

        <div class="box">
          Bo’CitéArt relie progressivement l’entreprise aux solutions
          qui existent réellement autour d’elle.
        </div>

        ${entrepriseOtherTopics("fidelisation")}
      `,
      actions:[
        ["Rechercher du personnel", "emploi"],
        ["Découvrir les services locaux", "annuaire"],
        ["Découvrir le mécénat", "mecenat"]
      ]
    },

    developpement:{
      title:"Développez votre entreprise",
      html:`
        <div class="box">
          Votre prochain client, fournisseur, salarié ou partenaire
          se trouve déjà dans votre ville ou à proximité.
        </div>

        <p>
          Une entreprise se développe grâce à ses produits et à ses services,
          mais aussi grâce aux rencontres, aux informations
          et aux bonnes décisions prises au bon moment.
        </p>

        <div class="entrepriseSectionTitle">
          Commencez par regarder autour de vous
        </div>

        <p>
          Découvrez les entreprises présentes dans votre commune,
          leurs métiers, leurs savoir-faire et leurs besoins.
        </p>

        <p>
          Recherchez un fournisseur, un sous-traitant,
          une compétence complémentaire ou un partenaire local.
        </p>

        <p>
          Faites connaître votre propre activité afin que les autres acteurs
          puissent également vous identifier.
        </p>

        <div class="box">
          Bo’CitéArt prépare des connexions utiles
          entre les acteurs du territoire.
        </div>

        ${entrepriseOtherTopics("developpement")}
      `,
      actions:[
        ["Les entreprises de ma ville", "annuaire"],
        ["Faire connaître mon entreprise", "visibilite"],
        ["Rechercher un partenaire", "partenaire"]
      ]
    },

    mutualisation:{
      title:"Réduisez vos charges",
      html:`
        <div class="box">
          <strong>
            Pourquoi continuer à négocier seul lorsqu’il est possible
            de construire des solutions communes ?
          </strong><br><br>

          Bo’CitéArt organise la démarche.
        </div>

        <p>
          Cochez les sujets qui vous intéressent.
          Chaque sélection augmente immédiatement le compteur.
        </p>

        <p>
          Plus les entreprises sont nombreuses,
          plus le rapport de force devient favorable.
        </p>

        <div id="entrepriseMutualisationCounters"></div>

        <div class="box" style="margin-top:12px;">
          Dès que le nombre nécessaire est atteint,
          Bo’CitéArt prépare la consultation auprès des prestataires.
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
        ["Voir mon Tableau de Direction", "direction"]
      ]
    },

    visibilite:{
      title:"Faites connaître vos métiers et votre savoir-faire",
      html:`
        <div class="box">
          Avant d’acheter ou de chercher ailleurs,
          les habitants doivent déjà savoir que vous existez.
        </div>

        <p>
          Il reste difficile de savoir
          qui fait quoi dans sa propre ville.
        </p>

        <div class="entrepriseSectionTitle">
          Faire connaître votre entreprise crée des leviers
        </div>

        <p>
          Emploi, bouche-à-oreille, partenariats,
          découverte des métiers, vocations chez les jeunes
          et transmission future.
        </p>

        <p>
          Même si vos produits ne s’adressent pas directement
          aux particuliers, les habitants connaissent vos métiers,
          parlent de vous et transmettent votre nom.
        </p>

        <div class="box">
          Une entreprise visible devient progressivement un repère
          pour les habitants, les salariés, les partenaires
          et les autres entreprises du territoire.
        </div>

        ${entrepriseOtherTopics("visibilite")}
      `,
      actions:[
        ["Voir les entreprises de la ville", "annuaire"],
        ["Présenter mon entreprise", "fiche-enrichie"],
        ["Diffuser une publicité", "publicite"]
      ]
    },

    economies:{
      title:"Comparez, choisissez, validez",
      html:`
        <div class="box">
          Recevez des propositions claires et comparables
          avant de prendre votre décision.
        </div>

        <p>
          Bo’CitéArt prépare la consultation, centralise les réponses
          et présente les solutions reçues.
        </p>

        <p>
          Les participants voient les propositions disponibles,
          le délai de réponse et l’état d’avancement.
        </p>

        <p>
          Chacun effectue son choix dans son Tableau de Direction.
        </p>

        <div class="box">
          Bo’CitéArt organise. L’entreprise compare et décide.
        </div>

        ${entrepriseOtherTopics("economies")}
      `,
      actions:[
        ["Voir les solutions communes", "mutualisation"],
        ["Ouvrir le Tableau de Direction", "direction"]
      ]
    },

    perennite:{
      title:"Préparez l’avenir de votre entreprise",
      html:`
        <div class="entrepriseSectionTitle">
          Savez-vous combien vaut réellement votre entreprise ?
        </div>

        <p>
          Cette première approche se réalise avec votre expert-comptable.
        </p>

        <p>
          Le chiffre d’affaires ne suffit pas.
          La rentabilité, la clientèle, l’équipe, la réputation,
          le matériel, l’organisation et le savoir-faire comptent aussi.
        </p>

        <div class="entrepriseSectionTitle">
          Souhaitez-vous la transmettre ?
        </div>

        <p>
          À vos enfants, à un salarié ou à un repreneur extérieur ?
        </p>

        <p>
          Commencez par en parler avec vos proches,
          puis avec votre expert-comptable afin d’obtenir
          une première approche chiffrée.
        </p>

        <p>
          La CCI, la CMA et les réseaux professionnels disposent
          également de services consacrés à la transmission.
        </p>

        <div class="box">
          Se renseigner avant d’agir permet de découvrir plusieurs chemins
          et de choisir celui qui correspond à votre situation.
        </div>

        ${entrepriseOtherTopics("perennite")}
      `,
      actions:[
        ["Rechercher un expert local", "expert"],
        ["Rechercher une chambre consulaire", "chambre"],
        ["Faire connaître mon entreprise", "visibilite"]
      ]
    },

    mecenat:{
      title:"Savez-vous à qui et à quoi sert le mécénat ?",
      html:`
        <div class="box">
          <strong>
            Le mécénat est accessible aux entreprises,
            quelle que soit leur taille.
          </strong>
        </div>

        <p>
          Le mécénat permet de soutenir un projet culturel,
          éducatif, sportif, associatif, patrimonial
          ou une autre action d’intérêt général.
        </p>

        <p>
          Il témoigne aussi de l’existence et de l’identité de l’entreprise
          dans sa ville.
        </p>

        <p>
          Chaque remerciement rappelle aux habitants
          qu’une entreprise locale a participé à un projet utile.
        </p>

        <p>
          Sous les conditions prévues par la loi,
          le mécénat ouvre droit aux avantages fiscaux applicables.
          L’expert-comptable précise les règles correspondant
          à l’entreprise.
        </p>

        <div class="box">
          Un geste discret s’inscrit durablement
          dans la vie de la ville.
        </div>

        ${entrepriseOtherTopics("mecenat")}
      `,
      actions:[
        ["Découvrir les projets locaux", "projets-mecenat"],
        ["Faire connaître mon engagement", "visibilite"],
        ["Poser une question", "ia"]
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
    $("entrepriseMutualisationCounters");


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
              "Cette première sélection ne constitue pas encore " +
              "un engagement définitif."
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

        Dans la version définitive,
        cette liste sera alimentée
        automatiquement par les données
        publiques officielles.

      </div>

      <input
        id="officialCompanySearch"
        class="miniField"
        placeholder="Rechercher un métier ou une entreprise"
      >

      <div
        id="officialCompaniesList"
        style="margin-top:12px;"
      >
      </div>

    `
  );


  setTimeout(
    ()=>{

      const demoCompanies = [

        {
          name:"Acier Nord",
          activity:
            "Travaux de métallerie et fabrication industrielle"
        },

        {
          name:"ABC Électricité",
          activity:
            "Installation électrique pour professionnels et particuliers"
        },

        {
          name:"Bâtir Conseil",
          activity:
            "Conseil et accompagnement dans le bâtiment"
        },

        {
          name:"Cabinet Horizon",
          activity:
            "Expertise comptable et accompagnement des entreprises"
        },

        {
          name:"Menuiserie du Centre",
          activity:
            "Menuiserie intérieure et extérieure"
        },

        {
          name:"Services Techniques du Nord",
          activity:
            "Maintenance et services aux entreprises"
        }

      ];


      const input =
        $("officialCompanySearch");

      const list =
        $("officialCompaniesList");


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


        const filtered =
          demoCompanies

            .filter(
              company =>
                company.name
                  .toLowerCase()
                  .includes(
                    query
                  ) ||
                company.activity
                  .toLowerCase()
                  .includes(
                    query
                  )
            )

            .sort(
              (a,b) =>
                a.name.localeCompare(
                  b.name,
                  "fr"
                )
            );


        list.innerHTML =
          filtered.length

            ? filtered
                .map(
                  company => `

                    <div class="box">

                      <strong>
                        ${escapeHtml(
                          company.name
                        )}
                      </strong>

                      <br>

                      ${escapeHtml(
                        company.activity
                      )}

                    </div>

                  `
                )
                .join("")

            : `

                <div class="box">
                  Aucun résultat trouvé
                  dans cette démonstration.
                </div>

              `;
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

  openModal(
    "Tableau de Direction",
    `

      <div class="entreprisePrivate">

        <strong>
          Accès réservé à l’entreprise
        </strong>

        <br><br>

        Dans la version définitive,
        cet espace est ouvert automatiquement
        pour chaque professionnel adhérent
        et reste inaccessible
        aux citoyens
        et aux autres entreprises.

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
      >
      </div>

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

      <div class="muted">

        Ces tarifs sont visibles uniquement
        dans l’espace professionnel.

      </div>

    `
  );


  setTimeout(
    ()=>{

      const host =
        $("directionMutualisationPreview");


      if(!host){
        return;
      }


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
      "ia"
  ){

    const input =
      $("entrepriseAiQuestion");


    if(input){
      input.focus();
    }


    return;
  }


  alert(
    "Cette fonction est préparée dans la démonstration.\n\n" +
    "Elle sera raccordée au compte professionnel, " +
    "aux paiements et aux données sécurisées " +
    "dans la version définitive."
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
  $("openOfficialCompanies");


if(openOfficialCompanies){

  openOfficialCompanies.onclick =
    openOfficialCompaniesDirectory;
}


const openEntrepriseDirection =
  $("openEntrepriseDirection");


if(openEntrepriseDirection){

  openEntrepriseDirection.onclick =
    openEntrepriseDirectionPanel;
}


const entrepriseAiAskBtn =
  $("entrepriseAiAskBtn");


if(entrepriseAiAskBtn){

  entrepriseAiAskBtn.onclick =
    ()=>{

      const input =
        $("entrepriseAiQuestion");

      const answer =
        $("entrepriseAiAnswer");


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
              $("aiOpenDirectory");


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
              $("aiOpenMutualisation");


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
              $("aiOpenEmployment");


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

          Dans la version définitive,
          l’IA Bo’CitéArt répondra
          à partir des ressources
          de votre ville
          et des services disponibles,
          avant d’élargir la recherche.

        </div>

      `;

    };
}


/* =========================================================
   ÇA FINIT ICI — BLOC 2/3
   ENCHAÎNER IMMÉDIATEMENT AVEC LE BLOC 3
   ========================================================= */

   /* =========================================================
   ÇA COMMENCE ICI — BLOC 3/3
   COMMERCE : RACCORDEMENTS + SPORT → COMMERCE
   ========================================================= */

const demoCommercesList =
  $("demoCommercesList");


if(demoCommercesList){

  const demo =
    typeof getDemoCity ===
      "function"
      ? getDemoCity()
      : null;

  const db =
    window.demoDatabase ||
    null;


  if(
    demo &&
    demo.mode ===
      "DEMO" &&
    db &&
    Array.isArray(
      db.commerces
    ) &&
    db.commerces.length
  ){

    demoCommercesList.innerHTML =
      db.commerces
        .slice(
          0,
          20
        )
        .map(
          c => `

            <div
              style="
                font-weight:700;
                margin:5px 0;
              "
            >

              ${escapeHtml(
                c.nom ||
                "Commerce"
              )}

              <span class="muted">
                • quartier
                ${escapeHtml(
                  String(
                    c.quartier ||
                    ""
                  )
                )}
              </span>

            </div>

          `
        )
        .join("") +

      `

        <div
          class="muted"
          style="margin-top:8px;"
        >

          Affichage de 20 commerces
          sur ${db.commerces.length}
          partenaires générés
          pour la démonstration.

        </div>

      `;

  }else{

    demoCommercesList.innerHTML = `

      <div
        style="
          font-weight:700;
          margin:5px 0;
        "
      >
        Boulangerie Croquet Alex
      </div>

      <div
        style="
          font-weight:700;
          margin:5px 0;
        "
      >
        Pharmacie Richardson
      </div>

      <div
        style="
          font-weight:700;
          margin:5px 0;
        "
      >
        Anaïs Fleurs
      </div>

      <div
        style="
          font-weight:700;
          margin:5px 0;
        "
      >
        Garage Planque
      </div>

    `;
  }
}


/* =========================================================
   VILLE ACTIVE + PORTEFEUILLE TERRITORIAL OR
   ========================================================= */

const city =
  commerceActiveCity();


const commerceActiveCityName =
  $("commerceActiveCityName");

const commerceCoinName =
  $("commerceCoinName");

const citizenBalanceEl =
  $("citizenCoinBalance");


if(
  commerceActiveCityName
){

  commerceActiveCityName.textContent =
    city.cityName;
}


if(
  commerceCoinName
){

  commerceCoinName.textContent =
    city.coinPlural;
}


if(
  citizenBalanceEl &&
  typeof window.loadCitizenWallet ===
    "function"
){

  const wallet =
    window.loadCitizenWallet();


  citizenBalanceEl.textContent =
    String(
      Number(
        wallet &&
        wallet.or ||
        0
      )
    );
}


/* =========================================================
   ESPACE INTERNE COMMERCE
   ========================================================= */

const merchantInternalOpenBtn =
  $("merchantInternalOpenBtn");

const merchantInternalSpace =
  $("merchantInternalSpace");


if(
  merchantInternalOpenBtn &&
  merchantInternalSpace
){

  merchantInternalOpenBtn.onclick =
    ()=>{

      const isHidden =
        merchantInternalSpace.style.display ===
          "none" ||
        merchantInternalSpace.style.display ===
          "";


      merchantInternalSpace.style.display =
        isHidden
          ? "block"
          : "none";


      merchantInternalOpenBtn.textContent =
        isHidden
          ? "Fermer mon espace Commerce"
          : "Ouvrir mon espace Commerce";

    };
}


/* =========================================================
   FICHE COMMERCE
   ========================================================= */

const merchantProfileName =
  $("merchantShopName");

const merchantProfileAddress =
  $("merchantAddress");

const merchantProfilePhone =
  $("merchantPhone");

const merchantProfileEmail =
  $("merchantEmail");

const merchantProfileSiret =
  $("merchantSiret");

const merchantProfileSaveBtn =
  $("merchantProfileSaveBtn");

const merchantProfileStatus =
  $("merchantProfileStatus");


function fillMerchant(){

  const profile =
    commerceReadMerchant();


  if(merchantProfileName){

    merchantProfileName.value =
      profile.shopName ||
      "";
  }


  if(merchantProfileAddress){

    merchantProfileAddress.value =
      profile.address ||
      "";
  }


  if(merchantProfilePhone){

    merchantProfilePhone.value =
      profile.phone ||
      "";
  }


  if(merchantProfileEmail){

    merchantProfileEmail.value =
      profile.email ||
      "";
  }


  if(merchantProfileSiret){

    merchantProfileSiret.value =
      profile.sirenSiret ||
      "";
  }


  if(merchantProfileStatus){

    if(
      profile.shopName &&
      profile.id
    ){

      merchantProfileStatus.dataset.state =
        "ok";

      merchantProfileStatus.textContent =
        "Commerce enregistré pour " +
        city.cityName +
        " — identifiant : " +
        profile.id;

    }else{

      merchantProfileStatus.dataset.state =
        "warn";

      merchantProfileStatus.textContent =
        "Fiche à compléter pour " +
        city.cityName +
        ".";
    }
  }
}


fillMerchant();


if(
  merchantProfileSaveBtn
){

  merchantProfileSaveBtn.onclick =
    ()=>{

      const previous =
        commerceReadMerchant();


      const data = {

        id:
          previous.id ||
          commerceId(),

        shopName:
          String(
            merchantProfileName
              ? merchantProfileName.value
              : ""
          ).trim(),

        sirenSiret:
          String(
            merchantProfileSiret
              ? merchantProfileSiret.value
              : ""
          ).trim(),

        address:
          String(
            merchantProfileAddress
              ? merchantProfileAddress.value
              : ""
          ).trim(),

        phone:
          String(
            merchantProfilePhone
              ? merchantProfilePhone.value
              : ""
          ).trim(),

        email:
          String(
            merchantProfileEmail
              ? merchantProfileEmail.value
              : ""
          ).trim(),

        partnerActive:
          true,

        cityId:
          city.cityId,

        cityName:
          city.cityName

      };


      if(
        !data.shopName
      ){

        alert(
          "Renseignez au minimum le nom du commerce."
        );

        return;
      }


      if(
        !commerceWriteMerchant(
          data
        )
      ){

        alert(
          "La fiche commerce n’a pas pu être enregistrée."
        );

        return;
      }


      fillMerchant();


      alert(
        "Fiche commerce enregistrée pour " +
        city.cityName +
        "."
      );

    };
}


/* =========================================================
   SPORT → COMMERCE
   ========================================================= */

const sportInput =
  $("commerceSportQrRaw");

const sportScanBtn =
  $("commerceSportScanBtn");

const sportCameraBox =
  $("commerceSportCameraBox");

const sportCameraVideo =
  $("commerceSportCamera");

const sportCameraStopBtn =
  $("commerceSportCameraStopBtn");

const sportAmount =
  $("commerceSportPurchaseAmount");

const sportPurchaseRef =
  $("commerceSportPurchaseRef");

const sportValidateBtn =
  $("commerceSportValidateBtn");

const sportStatus =
  $("commerceSportExchangeStatus");


let currentSportScan =
  null;

let sportCameraStream =
  null;

let sportCameraTimer =
  null;

let sportCameraBusy =
  false;


/* =========================================================
   STATUT SPORT
   ========================================================= */

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


/* =========================================================
   ARRÊT CAMÉRA
   ========================================================= */

function stopSportCamera(){

  if(
    sportCameraTimer
  ){

    clearInterval(
      sportCameraTimer
    );

    sportCameraTimer =
      null;
  }


  if(
    sportCameraStream
  ){

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


  if(
    sportCameraVideo
  ){

    try{

      sportCameraVideo.pause();

    }catch(error){}


    sportCameraVideo.srcObject =
      null;
  }


  if(
    sportCameraBox
  ){

    sportCameraBox.classList.add(
      "commerceHidden"
    );
  }


  sportCameraBusy =
    false;
}


/* =========================================================
   LECTURE ET PRÉCONTRÔLE QR SPORT
   ========================================================= */

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
      ) <
      Date.now()
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
      ". Le contrôle final vérifiera le solde, l’usage unique et le commerce."
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


/* =========================================================
   SCANNER CAMÉRA
   ========================================================= */

async function scanSportWithCamera(){

  if(
    !sportInput
  ){
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
      "Le scanner caméra n’est pas disponible sur cet appareil. Collez le contenu du QR dans le champ prévu."
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
      "La lecture QR n’est pas disponible sur cet appareil. Collez le contenu du QR."
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

          audio:
            false,

          video:{

            facingMode:{
              ideal:
                "environment"
            }

          }

        });


    if(
      !sportCameraVideo
    ){

      stopSportCamera();
      return;
    }


    sportCameraVideo.srcObject =
      sportCameraStream;


    await sportCameraVideo.play();


    if(
      sportCameraBox
    ){

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
            sportCameraVideo.readyState <
              2
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
      "La caméra n’a pas pu être ouverte. Autorisez son accès ou collez le QR du club."
    );
  }
}


if(
  sportScanBtn
){

  sportScanBtn.onclick =
    async ()=>{

      /*
        Si un QR a déjà été collé
        dans le champ,
        on le contrôle directement.

        Sinon on ouvre la caméra.
      */

      if(
        sportInput &&
        String(
          sportInput.value ||
          ""
        ).trim()
      ){

        readSportQr();
        return;
      }


      await scanSportWithCamera();

    };
}


if(
  sportCameraStopBtn
){

  sportCameraStopBtn.onclick =
    stopSportCamera;
}


/* =========================================================
   VALIDATION 30 VERT → 1 CABAS
   ========================================================= */

if(
  sportValidateBtn
){

  sportValidateBtn.onclick =
    async ()=>{

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
        !merchant.shopName ||
        !merchant.id
      ){

        setSportStatus(
          "error",
          "Enregistrez d’abord la fiche du commerce partenaire."
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
        amount <
          10
      ){

        setSportStatus(
          "error",
          "Un achat réel d’au moins 10 € TTC est obligatoire."
        );

        return;
      }


      if(
        !reference
      ){

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
        "Validation en cours…"
      );


      try{

        /*
          IMPORTANT :

          Aucun bocitecoin territorial OR
          n'est crédité ici avant
          la validation complète du moteur Sport.

          QR expiré,
          mauvaise ville,
          QR déjà utilisé,
          solde insuffisant,
          achat non conforme,
          commerce non partenaire
          ou rotation refusée
          = aucun crédit territorial.
        */

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
                true,

              bociteartPartner:
                true,

              partnerStatus:
                "active"

            },

            {

              amountTTC:
                amount,

              reference:
                reference,

              /*
                Le QR présenté ici
                est le QR SPORT.

                L'opération reste donc
                dans la casquette CLUB.

                Le portefeuille Sport
                est VERT.

                Le portefeuille citoyen
                reste OR et séparé.
              */

              bocitecoinRecipient:
                "club",

              exchangeAccepted:
                true

            }

          );


        if(
          !result ||
          result.ok !==
            true
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


        /*
          L'ÉCHANGE SPORT EST MAINTENANT VALIDÉ.

          30 VERT ont été retirés
          par le moteur Sport.

          On ne modifie jamais directement
          le portefeuille VERT depuis Commerce.
        */


        setSportStatus(
          "ok",
          "Échange validé : 30 bocitecoins VERT retirés, 1 Cabas remis. Nouveau solde du club : " +
          Number(
            result.balance ||
            0
          ) +
          " VERT."
        );


        currentSportScan =
          null;


        if(
          sportInput
        ){

          sportInput.value =
            "";
        }


        if(
          sportAmount
        ){

          sportAmount.value =
            "";
        }


        if(
          sportPurchaseRef
        ){

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


/* =========================================================
   EXPORT HISTORIQUE COMMERCE
   ========================================================= */

const merchantHistoryExportBtn =
  $("merchantHistoryExportBtn");


if(
  merchantHistoryExportBtn
){

  merchantHistoryExportBtn.onclick =
    ()=>{

      const exportObj = {

        exported_at_fr:
          new Date()
            .toLocaleString(
              "fr-FR"
            ),

        city:
          city,

        merchant_profile:
          commerceReadMerchant(),

        citizen_wallet_or:
          typeof window.loadCitizenWallet ===
            "function"
            ? Number(
                window
                  .loadCitizenWallet()
                  .or ||
                0
              )
            : 0

      };


      const exportText =
        "HISTORIQUE COMMERCE — EXPORT DÉMO\n\n" +
        JSON.stringify(
          exportObj,
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
                "Historique commerce copié."
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


/* =========================================================
   FOCUS FERMETURE MODALE
   ========================================================= */

const xb =
  $("xBtn");


if(
  xb &&
  xb.focus
){

  xb.focus();
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

  ready:
    true,

  open:
    openCommerceModule

};


window.openCommerceModule =
  openCommerceModule;


/* =========================================================
   FIN MODULE COMMERCE / ENTREPRISE
   ========================================================= */

})();

/* =========================================================
   ÇA FINIT ICI — BLOC 3/3
   FIN DU FICHIER
   ========================================================= */
