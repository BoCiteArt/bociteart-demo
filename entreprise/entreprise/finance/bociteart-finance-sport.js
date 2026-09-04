/* =========================================================
   ÇA COMMENCE ICI — BO'CITÉART — FINANCE — RACCORD SPORT

   Fichier public : finance/bociteart-finance-sport.js

   Cette passerelle relie le parrainage Sport au moteur Finance.
   Elle ne contient aucun secret bancaire et ne valide jamais
   elle-même un paiement réel.
   ========================================================= */

(function(){
  "use strict";

  if(
    window.BociteFinanceSport &&
    window.BociteFinanceSport.ready === true
  ){
    return;
  }

  const VERSION = "2026-09-03-01";
  const CONNECTOR_NAME = "sport-parrainage";
  const MOUNT_ID = "bociteSportFinanceMount";
  const PROFILE_KEY = "bociteart_finance_sport_merchant_v1";
  const MINIMUM_HT = 50;
  const PUBLICATION_DAYS = 5;

  let activeCorrectionDraftId = "";

  function sportFinanceCore(){
    return window.BociteFinance || null;
  }

  function sportFinanceUI(){
    return window.BociteFinanceUI || null;
  }

  function sportFinanceText(value){
    return String(value == null ? "" : value).trim();
  }

  function sportFinanceEscape(value){
    return sportFinanceText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function sportFinanceNow(){
    return new Date().toISOString();
  }

  function sportFinanceClub(){
    if(
      window.BociteSportModule &&
      typeof window.BociteSportModule.getClub === "function"
    ){
      return window.BociteSportModule.getClub() || {};
    }

    return {};
  }

  function sportFinanceAssociations(){
    const source = window.BOCITEART_FINANCE_ASSOCIATIONS;

    if(!Array.isArray(source)){
      return [];
    }

    return source.filter(function(item){
      return item &&
        item.validated === true &&
        sportFinanceText(item.id) &&
        sportFinanceText(item.name);
    });
  }

  function sportFinanceReadSavedProfile(){
    try{
      const saved = JSON.parse(
        window.sessionStorage.getItem(PROFILE_KEY) || "{}"
      );

      return saved && typeof saved === "object" ? saved : {};
    }catch(error){
      return {};
    }
  }

  function sportFinanceInitialProfile(){
    const shared = window.BOCITEART_LAST_SPORT_MERCHANT_PROFILE;
    const saved = sportFinanceReadSavedProfile();

    return Object.assign(
      {},
      shared && typeof shared === "object" ? shared : {},
      saved
    );
  }

  function sportFinanceField(id){
    return document.getElementById(id);
  }

  function sportFinanceValue(id){
    return sportFinanceText(sportFinanceField(id)?.value);
  }

  function sportFinanceReadProfile(){
    return {
      name: sportFinanceValue("bcfSportMerchantName"),
      sirenSiret: sportFinanceValue("bcfSportMerchantSiret"),
      address: sportFinanceValue("bcfSportMerchantAddress"),
      phone: sportFinanceValue("bcfSportMerchantPhone"),
      email: sportFinanceValue("bcfSportMerchantEmail"),
      accountingEmail: sportFinanceValue("bcfSportMerchantAccountingEmail"),
      website: sportFinanceValue("bcfSportMerchantWebsite"),
      updatedAt: sportFinanceNow()
    };
  }

  function sportFinanceSaveProfile(profile){
    const clean = profile && typeof profile === "object" ? profile : {};

    window.sessionStorage.setItem(PROFILE_KEY, JSON.stringify(clean));
    window.BOCITEART_LAST_SPORT_MERCHANT_PROFILE = Object.assign({}, clean);
    return clean;
  }

  function sportFinanceAmount(){
    const amount = Number(sportFinanceValue("bcfSportAmountHT"));
    return Math.round(amount * 100) / 100;
  }

  function sportFinanceChoice(){
    return sportFinanceText(
      document.querySelector(
        'input[name="bcfSportAllocation"]:checked'
      )?.value
    );
  }

  function sportFinanceSelectedAssociation(){
    const id = sportFinanceValue("bcfSportAssociation");

    return sportFinanceAssociations().find(function(item){
      return String(item.id) === String(id);
    }) || null;
  }

  function sportFinancePreview(profile, club, choice, association){
    const contact = profile.website || profile.phone || profile.email;
    const lines = [
      profile.name,
      profile.address
    ];

    if(contact){
      lines.push(contact);
    }

    lines.push(
      "Merci à ce commerçant pour son soutien au club " +
      sportFinanceText(club.name || club.officialName || "partenaire") + "."
    );

    if(choice === "HALF_HALF" && association){

          lines.push(
        "Merci également pour son soutien à " +
        sportFinanceText(association.name) + "."
      );
    }

    return lines.filter(Boolean);
  }

  function sportFinanceSetStatus(message, state){
    const target = sportFinanceField("bcfSportStatus");

    if(!target){
      return;
    }

    target.textContent = sportFinanceText(message);
    target.style.color = state === "error" ? "#7f1a1d" : "#111111";
    target.style.borderColor = state === "error" ? "#a51e22" : "";
  }

  function sportFinanceToggleAssociation(){
    const choice = sportFinanceChoice();
    const box = sportFinanceField("bcfSportAssociationBox");

    if(box){
      box.style.display = choice === "HALF_HALF" ? "block" : "none";
    }
  }

  function sportFinanceValidate(profile, club, amount, choice, association){
    const errors = [];

    if(!sportFinanceText(club.clubRef)){
      errors.push("La fiche d’identité du club doit être enregistrée.");
    }

    if(!profile.name){
      errors.push("Le nom ou l’enseigne du commerçant est obligatoire.");
    }

    if(!profile.sirenSiret){
      errors.push("Le SIREN ou SIRET du commerçant est obligatoire.");
    }

    if(!profile.address){
      errors.push("L’adresse du commerçant est obligatoire.");
    }

    if(!profile.accountingEmail){
      errors.push("L’adresse électronique comptable est obligatoire.");
    }

    if(!Number.isFinite(amount) || amount < MINIMUM_HT){
      errors.push("Le montant minimum est de 50 € HT.");
    }

    if(choice !== "ALL_CLUB" && choice !== "HALF_HALF"){
      errors.push("Choisissez la destination du soutien.");
    }

    if(choice === "HALF_HALF" && !association){
      errors.push("Choisissez une association préalablement validée.");
    }

    return errors;
  }

  function sportFinanceOpenReview(){
    const core = sportFinanceCore();
    const ui = sportFinanceUI();

    if(!core || !ui || ui.ready !== true){
      sportFinanceSetStatus(
        "Le service Finance est momentanément indisponible.",
        "error"
      );
      return;
    }

    const profile = sportFinanceSaveProfile(sportFinanceReadProfile());
    const club = sportFinanceClub();
    const amountHT = sportFinanceAmount();
    const choice = sportFinanceChoice();
    const association = sportFinanceSelectedAssociation();
    const errors = sportFinanceValidate(
      profile,
      club,
      amountHT,
      choice,
      association
    );

    if(errors.length){
      sportFinanceSetStatus(errors[0], "error");
      return;
    }

    const previewLines = sportFinancePreview(
      profile,
      club,
      choice,
      association
    );

    ui.open({
      connectorName: CONNECTOR_NAME,
      flowType: "sport_local_sponsorship",
      reviewTitle: "Dernière vérification avant paiement",
      payerRef: profile.sirenSiret,
      identityVersion: profile.updatedAt,
      beneficiaryRefs: [
        sportFinanceText(club.clubRef),
        association ? sportFinanceText(association.id) : ""
      ].filter(Boolean),
      amountHT: amountHT,
      allocationCode: choice,
      associationId: association ? sportFinanceText(association.id) : "",
      publicationDays: PUBLICATION_DAYS,
      previewLines: previewLines,
      previewText: previewLines.join(" — ")
    });
  }

  function sportFinanceEditIdentity(context){
    activeCorrectionDraftId = sportFinanceText(context && context.draftId);

    const firstField = sportFinanceField("bcfSportMerchantName");
    const returnButton = sportFinanceField("bcfSportReturnToReview");
    const correctionNotice = sportFinanceField("bcfSportCorrectionNotice");

    if(correctionNotice){
      correctionNotice.style.display = "block";
    }

    if(returnButton){
      returnButton.style.display = "block";
    }

    if(firstField){
      firstField.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(function(){ firstField.focus(); }, 300);
    }
  }

  function sportFinanceReturnToReview(){
    const ui = sportFinanceUI();
    const draftId = activeCorrectionDraftId;

    if(!ui || !draftId){
      return;
    }

    const profile = sportFinanceSaveProfile(sportFinanceReadProfile());
    const club = sportFinanceClub();
    const choice = sportFinanceChoice();
    const association = sportFinanceSelectedAssociation();
    const previewLines = sportFinancePreview(
      profile,
      club,
      choice,
      association
    );

    const returnButton = sportFinanceField("bcfSportReturnToReview");
    const correctionNotice = sportFinanceField("bcfSportCorrectionNotice");

    if(returnButton){
      returnButton.style.display = "none";
    }

       if(correctionNotice){
      correctionNotice.style.display = "none";
    }

    activeCorrectionDraftId = "";

    ui.resumeAfterIdentityEdit(draftId, {
      identityVersion: profile.updatedAt,
      previewLines: previewLines,
      previewText: previewLines.join(" — ")
    });
  }

  async function sportFinanceStartCheckout(request){
    const config = sportFinanceCore().getConfig();

    if(sportFinanceText(config.mode).toLowerCase() === "production"){
      if(!sportFinanceText(config.apiBaseUrl)){
        throw new Error("Le serveur sécurisé Finance n'est pas configuré.");
      }

      const response = await fetch(
        sportFinanceText(config.apiBaseUrl).replace(/\/$/, "") +
          "/payments/checkout",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request)
        }
      );

      if(!response.ok){
        throw new Error("Le paiement sécurisé est momentanément indisponible.");
      }

      return response.json();
    }

    if(
      !window.BociteFinanceTest ||
      window.BociteFinanceTest.ready !== true
    ){
      throw new Error("Le test à blanc Finance n'est pas chargé.");
    }

    return window.BociteFinanceTest.startCheckout(request);
  }

  function sportFinanceAssociationOptions(){
    const associations = sportFinanceAssociations();

    if(!associations.length){
      return `
        <option value="">
          En attente du choix défini par la mairie et Bo'CitéArt
        </option>
      `;
    }

    return `
      <option value="">Choisir l’association</option>
      ${associations.map(function(item){
        return '<option value="' + sportFinanceEscape(item.id) + '">' +
          sportFinanceEscape(item.name) + '</option>';
      }).join("")}
    `;
  }

  function sportFinanceRender(){
    const mount = sportFinanceField(MOUNT_ID);

    if(!mount || mount.dataset.financeReady === "1"){
      return;
    }

    const profile = sportFinanceInitialProfile();
    const associations = sportFinanceAssociations();

    mount.dataset.financeReady = "1";
    mount.innerHTML = `
      <div class="sportTitleCard">
        <div class="sportTitleText">
          Parrainage et publicité locale avec
          <span class="bociteSportLogo">Bo'Cité<span class="bociteSportArt">Art</span></span>
        </div>
      </div>

      <div class="sportCard">
        <div class="sportText">
          Le commerçant choisit un montant à partir de <strong>50 € HT</strong>.
          Après confirmation du paiement, la publicité est automatiquement transmise
          pour <strong>5 jours de diffusion réelle</strong>.
        </div>

        <div class="sportCard">
          <div class="sportSubTitle">Informations du commerçant</div>

          <div class="sportStatus">
            Relisez attentivement ces informations. Elles servent à préremplir la publicité
            et les documents associés. Une correction effectuée ici sera conservée pour
            poursuivre cette opération sans perdre le montant ni le bénéficiaire choisis.
          </div>

          <div id="bcfSportCorrectionNotice" class="sportStatus" style="display:none;">
            Corrigez les informations nécessaires, puis revenez à l’aperçu définitif.
          </div>

          <label class="sportLabel">Nom ou enseigne</label>
          <input id="bcfSportMerchantName" class="sportField" value="${sportFinanceEscape(profile.name || profile.shopName || profile.companyName)}">

          <label class="sportLabel">SIREN / SIRET</label>
          <input id="bcfSportMerchantSiret" class="sportField" value="${sportFinanceEscape(profile.sirenSiret || profile.siret)}">

          <label class="sportLabel">Adresse</label>
          <input id="bcfSportMerchantAddress" class="sportField" value="${sportFinanceEscape(profile.address)}">

          <label class="sportLabel">Téléphone</label>
          <input id="bcfSportMerchantPhone" class="sportField" value="${sportFinanceEscape(profile.phone)}">

          <label class="sportLabel">Site</label>
          <input id="bcfSportMerchantWebsite" class="sportField" value="${sportFinanceEscape(profile.website || profile.site)}">

          <label class="sportLabel">Email</label>
          <input id="bcfSportMerchantEmail" class="sportField" value="${sportFinanceEscape(profile.email)}">

          <label class="sportLabel">Email comptable</label>
          <input id="bcfSportMerchantAccountingEmail" class="sportField" value="${sportFinanceEscape(profile.accountingEmail || profile.email)}">

          <button id="bcfSportReturnToReview" class="sportBtn" type="button" style="display:none;width:100%;margin-top:12px;">
            Enregistrer les corrections et revenir à l’aperçu
          </button>
        </div>

        <div class="sportCard">
          <div class="sportSubTitle">Montant du parrainage</div>

          <label class="sportLabel">Montant en € HT</label>
          <input id="bcfSportAmountHT" class="sportField" type="number" min="50" step="1" value="50">

          <label class="sportCheck">
            <input type="radio" name="bcfSportAllocation" value="ALL_CLUB">
            <span><strong>100 % pour le club</strong></span>
          </label>

          <label class="sportCheck">
            <input type="radio" name="bcfSportAllocation" value="HALF_HALF" ${associations.length ? "" : "disabled"}>
            <span><strong>50 % pour le club / 50 % pour l’association choisie</strong></span>
          </label>

          <div id="bcfSportAssociationBox" style="display:none;margin-top:12px;">
            <label class="sportLabel">Association retenue</label>
            <select id="bcfSportAssociation" class="sportField" ${associations.length ? "" : "disabled"}>
              ${sportFinanceAssociationOptions()}
            </select>
          </div>

          ${associations.length ? "" : `
            <div class="sportStatus">
              Associations de recherche : en attente du choix défini par la mairie et Bo'CitéArt.
            </div>
          `}

          <button id="bcfSportOpenReview" class="sportBtn" type="button" style="width:100%;margin-top:12px;">
            Vérifier la publicité et payer
          </button>

          <div id="bcfSportStatus" class="sportStatus">
            Choisissez d’abord la destination du soutien.

                      </div>
        </div>
      </div>
    `;

    mount.querySelectorAll('input[name="bcfSportAllocation"]').forEach(
      function(radio){
        radio.addEventListener(
          "change",
          sportFinanceToggleAssociation
        );
      }
    );

    sportFinanceField("bcfSportOpenReview").onclick =
      sportFinanceOpenReview;

    sportFinanceField("bcfSportReturnToReview").onclick =
      sportFinanceReturnToReview;
  }

  function sportFinanceInstall(){
    const core = sportFinanceCore();

    if(
      core &&
      core.ready === true &&
      !core.getConnector(CONNECTOR_NAME)
    ){
      core.registerConnector(
        CONNECTOR_NAME,
        {
          startCheckout: sportFinanceStartCheckout,
          editIdentity: sportFinanceEditIdentity
        }
      );
    }

    sportFinanceRender();
  }

  if(document.readyState === "loading"){
    document.addEventListener(
      "DOMContentLoaded",
      sportFinanceInstall,
      { once:true }
    );
  }else{
    sportFinanceInstall();
  }

  const observer = new MutationObserver(function(){
    sportFinanceInstall();
  });

  observer.observe(
    document.documentElement,
    {
      childList:true,
      subtree:true
    }
  );

  if(sportFinanceCore()){
    sportFinanceCore().on(
      "payment-paid",
      function(draft){
        if(
          !draft ||
          draft.connectorName !== CONNECTOR_NAME
        ){
          return;
        }

        sportFinanceSetStatus(
          "Paiement confirmé. La publicité a été automatiquement transmise.",
          "success"
        );
      }
    );
  }

  window.BociteFinanceSport = {
    version: VERSION,
    ready: true,
    install: sportFinanceInstall,
    openReview: sportFinanceOpenReview
  };

  console.info("✅ Bo'CitéArt Finance — raccord Sport chargé");

})();

/* =========================================================
   ÇA FINIT ICI — BO'CITÉART — FINANCE — RACCORD SPORT
   ========================================================= */
