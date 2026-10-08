
/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — URGENCE SOLIDAIRE
   VERSION V3 — 07/10/2026

   OBJECTIFS
   - Un seul module autonome pour l'interface citoyenne.
   - Le bouton existant #associationDonBtn est conservé et renommé.
   - Dons ouverts à tous, même sans compte Bo'CitéArt.
   - Campagnes rattachées à une ville partenaire.
   - Agent IA simulé en démonstration : tri, contrôle, priorité,
     accompagnement, transparence, suivi et clôture.
   - Paiement DEMO complet et testable, sans argent réel.
   - Production : branchement obligatoire vers un PSP/IFP côté serveur.

   SÉCURITÉ
   - Aucune donnée de carte réelle n'est stockée.
   - Aucune pièce d'identité n'est stockée en localStorage.
   - Les fichiers de démonstration restent dans IndexedDB local.
   - Le mode production doit utiliser un backend sécurisé (OVH)
     et un prestataire de paiement réglementé.
   ========================================================= */

(function installBociteartSolidarityV3(){

  "use strict";

  if(window.BociteSolidarity && window.BociteSolidarity.version === "3.0.0"){
    return;
  }

  /* =========================================================
     CONFIGURATION
     ========================================================= */

  const VERSION = "3.0.0";

  const KEYS = {
    campaigns: "bociteart_solidarity_campaigns_v3",
    settings: "bociteart_solidarity_settings_v3",
    votes: "bociteart_solidarity_votes_v1",
    book: "bociteart_solidarity_book_v1",
    journal: "bociteart_solidarity_transparency_v1",
    paymentLedger: "bociteart_solidarity_payment_ledger_v1"
  };

  const DEFAULT_SETTINGS = {
    environment: "demo", // demo | production
    serviceRate: 0.025,
    pspRateEstimate: 0.029,
    pspFixedEstimate: 0.25,
    currency: "EUR",
    feeMode: "added",
    roundUpEnabled: true,
    publicPhotoMax: 5,
    privateProofMax: 10,
    voteHours: 72,
    livingBeneficiaryUnclaimedDays: 60,
    autoPublishGreen: true,
    legalWatchEnabled: true,
    paymentApiBase: "/api/solidarity",
    publicBaseUrl: "",
    demoCardNumber: "4970107111111119"
  };

  const STATUS = {
    DRAFT: "draft",
    PENDING_IDENTITY: "pending_identity",
    PENDING_AGENT: "pending_agent",
    PENDING_INFO: "pending_info",
    PENDING_VOTE: "pending_vote",
    LIVE: "live",
    SUSPENDED: "suspended",
    CLOSED: "closed",
    REJECTED: "rejected",
    DECEASED_REVIEW: "deceased_review"
  };

  const ACTOR_TYPES = [
    ["self", "La personne concernée"],
    ["third_party", "Un proche, voisin ou tiers qui souhaite aider"],
    ["association", "Une association"],
    ["mairie", "Une mairie / un CCAS"],
    ["school", "Une école / un établissement"],
    ["health", "Un établissement de santé"],
    ["religious", "Un lieu de culte / édifice"],
    ["other_structure", "Une autre structure"]
  ];

  const EVENT_TYPES = [
    ["fire", "Incendie", true],
    ["flood", "Inondation / dégât majeur", true],
    ["storm", "Tempête / catastrophe locale", true],
    ["housing", "Perte brutale du logement / relogement", true],
    ["medical", "Soins / opération / matériel médical restant à financer", true],
    ["disability", "Aide urgente liée au handicap", true],
    ["isolation", "Personne isolée / sans aidant / besoin vital", true],
    ["bereavement", "Décès / urgence familiale grave", true],
    ["collective", "Sinistre collectif majeur dans la commune", true],
    ["institution", "École, établissement, édifice ou service essentiel sinistré", true],
    ["other", "Autre situation grave à examiner", false]
  ];

  const FORBIDDEN_PATTERNS = [
    /\balerte enl[eè]vement\b/i,
    /\bpersonne disparue\b/i,
    /\bdisparition\b/i,
    /\bplainte\b/i,
    /\bd[eé]nonciation\b/i,
    /\bcasino\b/i,
    /\bpari(s)?\b/i,
    /\bcrypto(mon[nm]aie)?\b/i,
    /\bbitcoin\b/i,
    /\bamende(s)?\b/i,
    /\bdette(s)? de jeu\b/i,
    /\bfinancement politique\b/i,
    /\bplacement financier\b/i,
    /\binvestissement financier\b/i,
    /\barme(s)?\b/i,
    /\bstup[ée]fiant(s)?\b/i,
    /\bblanchiment\b/i
  ];

  const JOKE_PATTERNS = [
    /\bmdr\b/i,
    /\bptdr\b/i,
    /\blol\b/i,
    /\bjuste pour rire\b/i,
    /\bc['’]?est une blague\b/i,
    /\bpoisson d['’]avril\b/i,
    /\btest test\b/i
  ];

  /* =========================================================
     OUTILS GÉNÉRAUX
     ========================================================= */

  function nowIso(){
    return new Date().toISOString();
  }

  function addHoursIso(hours){
    return new Date(Date.now() + Number(hours || 0) * 3600000).toISOString();
  }

  function addDaysIso(days){
    return new Date(Date.now() + Number(days || 0) * 86400000).toISOString();
  }

  function uid(prefix){
    return String(prefix || "SOL") + "-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,8).toUpperCase();
  }

  function safeText(value){
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function money(value){
    const number = Number(value || 0);
    try{
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: getSettings().currency || "EUR"
      }).format(number);
    }catch(error){
      return number.toFixed(2).replace(".", ",") + " €";
    }
  }

  function formatDate(value){
    if(!value){ return ""; }
    const date = new Date(value);
    if(Number.isNaN(date.getTime())){ return ""; }
    return date.toLocaleDateString("fr-FR");
  }

  function loadJson(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(error){
      return fallback;
    }
  }

  function saveJson(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getSettings(){
    return Object.assign({}, DEFAULT_SETTINGS, loadJson(KEYS.settings, {}));
  }

  function setSettings(patch){
    const next = Object.assign({}, getSettings(), patch || {});
    saveJson(KEYS.settings, next);
    return next;
  }

  function loadCampaigns(){
    const items = loadJson(KEYS.campaigns, []);
    return Array.isArray(items) ? items : [];
  }

  function saveCampaigns(items){
    saveJson(KEYS.campaigns, Array.isArray(items) ? items : []);
  }

  function loadJournal(){
    const items = loadJson(KEYS.journal, []);
    return Array.isArray(items) ? items : [];
  }

  function addJournal(entry){
    const items = loadJournal();

      items.unshift(Object.assign({ id: uid("JRN"), at: nowIso() }, entry || {}));
    saveJson(KEYS.journal, items.slice(0, 500));
  }

  function getAccount(){
    try{
      const raw = localStorage.getItem("bociteart_account_demo_v1");
      return raw ? JSON.parse(raw) : null;
    }catch(error){
      return null;
    }
  }

  function getCurrentCity(){
    const account = getAccount() || {};
    const candidates = [
      window.BOCITEART_CURRENT_CITY,
      window.BociteCurrentCity,
      account.city,
      account.commune,
      account.cityName
    ];
    for(let i = 0; i < candidates.length; i += 1){
      const value = String(candidates[i] || "").trim();
      if(value){ return value; }
    }
    return "Votre commune";
  }

  function getCurrentCityId(){
    const account = getAccount() || {};
    const candidates = [
      window.BOCITEART_CURRENT_CITY_ID,
      window.BociteCurrentCityId,
      account.cityId,
      account.communeId,
      account.inseeCode
    ];
    for(let i = 0; i < candidates.length; i += 1){
      const value = String(candidates[i] || "").trim();
      if(value){ return value; }
    }
    return "";
  }

  function eventLabel(value){
    const found = EVENT_TYPES.find(function(row){ return row[0] === value; });
    return found ? found[1] : "Situation solidaire";
  }

  function actorLabel(value){
    const found = ACTOR_TYPES.find(function(row){ return row[0] === value; });
    return found ? found[1] : "Demandeur";
  }

  function statusLabel(value){
    const map = {};
    map[STATUS.DRAFT] = "Brouillon";
    map[STATUS.PENDING_IDENTITY] = "Vérification du demandeur";
    map[STATUS.PENDING_AGENT] = "Analyse en cours";
    map[STATUS.PENDING_INFO] = "Complément simple demandé";
    map[STATUS.PENDING_VOTE] = "Vote communautaire en cours";
    map[STATUS.LIVE] = "Collecte active";
    map[STATUS.SUSPENDED] = "Collecte suspendue";
    map[STATUS.CLOSED] = "Collecte terminée";
    map[STATUS.REJECTED] = "Demande non recevable";
    map[STATUS.DECEASED_REVIEW] = "Traitement financier spécialisé";
    return map[value] || value;
  }

  /* =========================================================
     MÉDIAS — PHOTOS PUBLIQUES / JUSTIFICATIFS PRIVÉS
     ========================================================= */

  const MEDIA_DB_NAME = "bociteart_solidarity_media_v3";
  const MEDIA_STORE = "media";

  function openMediaDb(){
    return new Promise(function(resolve, reject){
      if(!window.indexedDB){
        reject(new Error("IndexedDB indisponible."));
        return;
      }
      const request = indexedDB.open(MEDIA_DB_NAME, 1);
      request.onupgradeneeded = function(){
        const db = request.result;
        if(!db.objectStoreNames.contains(MEDIA_STORE)){
          const store = db.createObjectStore(MEDIA_STORE, { keyPath: "id" });
          store.createIndex("campaignId", "campaignId", { unique:false });
          store.createIndex("kind", "kind", { unique:false });
        }
      };
      request.onsuccess = function(){ resolve(request.result); };
      request.onerror = function(){ reject(request.error || new Error("Stockage média indisponible.")); };
    });
  }

  async function saveMediaFiles(campaignId, kind, fileList, maxFiles){
    const files = Array.from(fileList || []).slice(0, Number(maxFiles || 0));
    if(!files.length){ return []; }
    const db = await openMediaDb();
    return new Promise(function(resolve, reject){
      const tx = db.transaction(MEDIA_STORE, "readwrite");
      const store = tx.objectStore(MEDIA_STORE);
      const saved = [];
      files.forEach(function(file, index){
        const record = {
          id: campaignId + "-" + kind + "-" + Date.now() + "-" + index,
          campaignId: campaignId,
          kind: kind,
          name: String(file.name || "fichier"),
          type: String(file.type || "application/octet-stream"),
          size: Number(file.size || 0),
          createdAt: nowIso(),
          blob: file
        };
        store.put(record);
        saved.push({ id:record.id, name:record.name, type:record.type, size:record.size });
      });
      tx.oncomplete = function(){ db.close(); resolve(saved); };
      tx.onerror = function(){ const err = tx.error || new Error("Enregistrement média impossible."); db.close(); reject(err); };
    });
  }

  async function getMedia(campaignId, kind){
    try{
      const db = await openMediaDb();
      return await new Promise(function(resolve, reject){
        const tx = db.transaction(MEDIA_STORE, "readonly");
        const index = tx.objectStore(MEDIA_STORE).index("campaignId");
        const request = index.getAll(campaignId);
        request.onsuccess = function(){
          const all = request.result || [];
          resolve(kind ? all.filter(function(item){ return item.kind === kind; }) : all);
          db.close();
        };
        request.onerror = function(){ reject(request.error); db.close(); };
      });
    }catch(error){
      return [];
    }
  }

  async function renderPublicMedia(campaignId, container){
    if(!container){ return; }
    const media = await getMedia(campaignId, "public_photo");
    if(!media.length){
      container.innerHTML = '<div class="bociteSolidarityHelp">Aucune photo publique.</div>';
      return;
    }
    container.innerHTML = "";
    media.slice(0, getSettings().publicPhotoMax).forEach(function(item){
      const img = document.createElement("img");
      img.className = "bociteSolidarityPhoto";
      img.alt = "Photo transmise pour illustrer la situation";
      const url = URL.createObjectURL(item.blob);
      img.src = url;
      img.onload = function(){ window.setTimeout(function(){ URL.revokeObjectURL(url); }, 5000); };
      container.appendChild(img);
    });
  }

  /* =========================================================
     FINANCES / FRAIS / ARRONDI
     ========================================================= */

  function round2(value){
    return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
  }

  function feeBreakdown(donationAmount, roundUp){
    const settings = getSettings();
    const donation = Math.max(0, round2(donationAmount));
    const service = round2(donation * Number(settings.serviceRate || 0));
    const psp = round2(donation * Number(settings.pspRateEstimate || 0) + Number(settings.pspFixedEstimate || 0));
    const subtotal = round2(donation + service + psp);
    const roundedTotal = roundUp && settings.roundUpEnabled ? Math.ceil(subtotal) : subtotal;
    const support = round2(Math.max(0, roundedTotal - subtotal));
    return {
      donation: donation,
      beneficiary: donation,
      service: service,
      psp: psp,
      support: support,
      subtotal: subtotal,
      total: round2(roundedTotal)
    };
  }

  function donationCount(campaign){
    const items = Array.isArray(campaign && campaign.donations) ? campaign.donations : [];
    return items.filter(function(item){ return item.status === "paid"; }).length;
  }

  function amountCollected(campaign){
    const items = Array.isArray(campaign && campaign.donations) ? campaign.donations : [];
    return round2(items.reduce(function(total, item){
      return item.status === "paid" ? total + Number(item.amount || 0) : total;
    }, 0));
  }

  function amountRemaining(campaign){
    return Math.max(0, round2(Number(campaign.targetAmount || 0) - amountCollected(campaign)));
  }

  /* =========================================================
     AGENT — ADMISSIBILITÉ / URGENCE / PRIORITÉ
     ========================================================= */

  function calculateUrgencyScore(data){
    let score = 0;
    const factors = data.urgency || {};

    if(factors.immediateShelter){ score += 30; }
    if(factors.vitalMedical){ score += 35; }
    if(factors.childrenOrVulnerable){ score += 20; }
    if(factors.noImmediateSolution){ score += 20; }
    if(factors.essentialServiceInterrupted){ score += 25; }
    if(factors.collectiveImpact){ score += 15; }
    if(factors.deadline72h){ score += 25; }

      if(factors.deadline7d){ score += 15; }

    // Le montant demandé ne donne jamais de priorité.
    // Le statut mairie/privé ne donne jamais de priorité.
    return Math.min(100, score);
  }

  function analyseSubmission(data){
    const reasons = [];
    const requests = [];
    let risk = 0;

    const merged = [data.title, data.description, data.immediateNeed, data.proofSummary]
      .join(" ")
      .trim();

    FORBIDDEN_PATTERNS.forEach(function(pattern){
      if(pattern.test(merged)){
        risk += 100;
        reasons.push("Cette demande relève d'un autre service ou d'un usage interdit dans Urgence solidaire.");
      }
    });

    JOKE_PATTERNS.forEach(function(pattern){
      if(pattern.test(merged)){
        risk += 85;
        reasons.push("Le contenu ressemble à une plaisanterie ou à un usage détourné du service.");
      }
    });

    if(String(data.description || "").trim().length < 30){
      risk += 20;
      requests.push("Décrire en quelques phrases ce qui s'est passé.");
    }

    if(!String(data.city || "").trim()){
      risk += 45;
      requests.push("Indiquer la commune concernée.");
    }

    const target = Number(data.targetAmount || 0);
    if(!Number.isFinite(target) || target <= 0){
      risk += 35;
      requests.push("Indiquer un objectif de première urgence, même provisoire.");
    }

    if(!data.identityVerified){
      risk += 40;
      requests.push("Finaliser la vérification sécurisée du demandeur.");
    }

    const evidenceCount = Number(data.privateProofCount || 0) + Number(data.publicPhotoCount || 0);
    if(evidenceCount === 0){
      risk += 25;
      requests.push("Ajouter au moins un élément permettant de vérifier la situation, si disponible.");
    }

    if(data.eventType === "other"){
      requests.push("La catégorie doit être vérifiée juridiquement puis soumise au vote communautaire pendant 72 h.");
    }

    // "Je ne sais pas" sur assurance/aides n'est PAS une faute.
    if(data.insuranceStatus === "refuse_to_say"){
      risk += 25;
      requests.push("Pour calculer le besoin réel, indiquer au minimum si une assurance existe, même si le montant est encore inconnu.");
    }

    let level = "GREEN";
    if(risk >= 80){ level = "RED"; }
    else if(risk >= 30){ level = "ORANGE"; }

    if(data.eventType === "other" && level !== "RED"){
      level = "VOTE";
    }

    return {
      level: level,
      score: Math.min(100, risk),
      reasons: reasons,
      requests: requests,
      urgencyScore: calculateUrgencyScore(data),
      canAutoPublish: level === "GREEN" && data.identityVerified === true,
      requiresVote: level === "VOTE"
    };
  }

  function isCampaignLive(item){
    return !!item && item.status === STATUS.LIVE;
  }

  function activeCampaignsForCity(city, cityId){
    return loadCampaigns()
      .filter(function(item){
        if(!isCampaignLive(item)){ return false; }
        if(cityId && item.cityId){ return String(item.cityId) === String(cityId); }
        return String(item.city || "").toLowerCase() === String(city || "").toLowerCase();
      })
      .sort(sortCampaignPriority);
  }

  function allActiveCampaigns(){
    return loadCampaigns().filter(isCampaignLive).sort(sortCampaignPriority);
  }

  function sortCampaignPriority(a, b){
    const scoreDiff = Number(b.urgencyScore || 0) - Number(a.urgencyScore || 0);
    if(scoreDiff !== 0){ return scoreDiff; }
    // A urgence égale : premier arrivé, premier servi.
    return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
  }

  function featuredCampaignForCity(city, cityId){
    const items = activeCampaignsForCity(city || getCurrentCity(), cityId || getCurrentCityId());
    return items.length ? items[0] : null;
  }

  function publicProgress(item){
    const target = Number(item.targetAmount || 0);
    const collected = amountCollected(item);
    const pct = target > 0 ? Math.min(100, Math.round(collected / target * 100)) : 0;
    return { target:target, collected:collected, remaining:Math.max(0, round2(target-collected)), pct:pct };
  }

  /* =========================================================
     VOTE COMMUNAUTAIRE — NOUVELLES CATÉGORIES
     ========================================================= */

  function loadVotes(){
    const votes = loadJson(KEYS.votes, []);
    return Array.isArray(votes) ? votes : [];
  }

  function startCategoryVote(campaign){
    const votes = loadVotes();
    let vote = votes.find(function(item){ return item.campaignId === campaign.id; });
    if(vote){ return vote; }
    vote = {
      id: uid("VOTE"),
      campaignId: campaign.id,
      categoryProposal: campaign.title,
      startsAt: nowIso(),
      endsAt: addHoursIso(getSettings().voteHours),
      yes: 0,
      no: 0,
      reasonsYes: [],
      reasonsNo: [],
      voters: [],
      status: "open"
    };
    votes.push(vote);
    saveJson(KEYS.votes, votes);
    addJournal({ type:"category_vote_opened", campaignId:campaign.id, publicText:"Une proposition de nouvelle catégorie solidaire a été ouverte au vote pendant 72 heures." });
    return vote;
  }

  function castVote(campaignId, choice, reason){
    const account = getAccount() || {};
    const voterId = String(account.id || account.email || account.userId || "demo-" + Math.random().toString(36).slice(2));
    const votes = loadVotes();
    const vote = votes.find(function(item){ return item.campaignId === campaignId && item.status === "open"; });
    if(!vote){ throw new Error("Vote introuvable ou terminé."); }
    if(vote.voters.indexOf(voterId) >= 0){ throw new Error("Ce compte a déjà voté."); }
    vote.voters.push(voterId);
    if(choice === "yes"){
      vote.yes += 1;
      if(reason){ vote.reasonsYes.push(String(reason).slice(0,300)); }
    }else{
      vote.no += 1;
      if(reason){ vote.reasonsNo.push(String(reason).slice(0,300)); }
    }
    saveJson(KEYS.votes, votes);
    return vote;
  }

  function finalizeVoteIfDue(campaignId, force){
    const votes = loadVotes();
    const vote = votes.find(function(item){ return item.campaignId === campaignId; });
    if(!vote || vote.status !== "open"){ return vote || null; }
    if(!force && new Date(vote.endsAt).getTime() > Date.now()){ return vote; }
    vote.status = vote.yes > vote.no ? "accepted" : "rejected";
    vote.closedAt = nowIso();
    saveJson(KEYS.votes, votes);

    const campaigns = loadCampaigns();
    const campaign = campaigns.find(function(item){ return item.id === campaignId; });
    if(campaign){
      if(vote.status === "accepted" && campaign.identityVerified){
        campaign.status = STATUS.LIVE;
        campaign.publishedAt = campaign.publishedAt || nowIso();
        campaign.audit.push({ at:nowIso(), action:"category_vote_accepted" });
      }else if(vote.status === "rejected"){
        campaign.status = STATUS.REJECTED;
        campaign.audit.push({ at:nowIso(), action:"category_vote_rejected" });
      }
      saveCampaigns(campaigns);
    }

    addJournal({
      type:"category_vote_closed",
      campaignId:campaignId,
      publicText:"Vote terminé : " + vote.yes + " oui / " + vote.no + " non — " + (vote.status === "accepted" ? "catégorie acceptée" : "catégorie non retenue") + "."
    });
    ensureHomeTicker();
    return vote;
  }

  /* =========================================================
     ACCOMPAGNEMENT PRIVÉ — PENSE-BÊTE + AIDES
     ========================================================= */

  function guidanceForCampaign(item){
    const common = [
      { id:"safe", phase:"Aujourd'hui", label:"Vérifier que vous et vos proches êtes en sécurité et avez une solution pour la nuit.", why:"La sécurité et la mise à l'abri passent avant les démarches.", done:false },
      { id:"essentials", phase:"Aujourd'hui", label:"Prévoir médicaments, papiers disponibles, vêtements et besoins indispensables.", why:"Éviter qu'une nécessité immédiate soit oubliée dans le choc.", done:false },
      { id:"city_help", phase:"Aujourd'hui", label:"Contacter la mairie / le CCAS pour connaître les aides locales d'urgence.", why:"Certaines aides locales ne sont pas automatiques.", done:false },
      { id:"insurance", phase:"Dans les prochains jours", label:"Prévenir l'assurance si elle existe, même si vous ne connaissez pas encore la prise en charge.", why:"Ouvrir le dossier suffit d'abord ; les montants viendront plus tard.", done:false },
      { id:"docs", phase:"Dans les prochains jours", label:"Photographier et conserver les documents, devis, courriers et justificatifs reçus.", why:"Ils pourront servir à l'assurance, aux aides et au suivi du besoin réel.", done:false },
      { id:"update", phase:"Lorsque vous avez une nouvelle information", label:"Signaler simplement toute aide, indemnisation ou évolution importante.", why:"L'agent actualisera le besoin sans vous refaire remplir tout le dossier.", done:false }
    ];

      const extra = [];
    if(item.eventType === "fire" || item.eventType === "flood" || item.eventType === "storm" || item.eventType === "housing"){
      extra.push(
        { id:"housing", phase:"Aujourd'hui", label:"Demander une solution d'hébergement temporaire si nécessaire.", why:"La mairie, le CCAS ou les services sociaux peuvent orienter vers une solution disponible.", done:false },
        { id:"utilities", phase:"Dans les prochains jours", label:"Prévenir les fournisseurs d'énergie, d'eau et les services utiles si le logement est inutilisable.", why:"Éviter des facturations ou interventions inutiles.", done:false },
        { id:"school_work", phase:"Dans les prochains jours", label:"Prévenir l'école des enfants et/ou l'employeur si la situation perturbe le quotidien.", why:"Ils peuvent adapter temporairement l'organisation ou orienter vers des aides.", done:false }
      );
    }
    if(item.eventType === "medical" || item.eventType === "disability"){
      extra.push(
        { id:"care", phase:"Aujourd'hui", label:"Conserver le devis ou document indiquant le coût restant à financer.", why:"Le besoin doit être prouvé sans exposer inutilement le dossier médical.", done:false },
        { id:"cpam", phase:"Dans les prochains jours", label:"Vérifier les aides possibles auprès de l'Assurance Maladie, de la mutuelle et, si pertinent, de la MDPH.", why:"Des aides complémentaires peuvent réduire le reste à charge.", done:false }
      );
    }
    if(item.eventType === "collective"){
      extra.push(
        { id:"collective_contact", phase:"Aujourd'hui", label:"Suivre les consignes officielles de la mairie et du dispositif collectif ouvert pour les sinistrés.", why:"Un sinistre collectif peut ouvrir des aides spécifiques temporaires.", done:false }
      );
    }

    if(item.beneficiaryProtection === "minor"){
      extra.push({ id:"minor_protection", phase:"Dans les prochains jours", label:"Vérifier avec le prestataire financier le circuit protégé du mineur ou le paiement direct au fournisseur lorsque cela est possible.", why:"Les fonds restent au bénéfice exclusif du mineur et ne sont pas remis automatiquement à un tiers.", done:false });
    }

    if(item.beneficiaryProtection === "protected_adult"){
      extra.push({ id:"adult_protection", phase:"Dans les prochains jours", label:"Vérifier la mesure de protection et le compte ouvert au nom de la personne protégée.", why:"Le tuteur ne reçoit jamais automatiquement les fonds sur son compte personnel.", done:false });
    }

    const possibleAids = [
      { name:"Mairie / CCAS", status:"À vérifier localement", purpose:"Aides d'urgence, orientation sociale, hébergement, secours ponctuels." },
      { name:"France Services", status:"Selon la commune", purpose:"Aide pour les démarches administratives et les services publics." },
      { name:"CAF", status:"Selon votre situation", purpose:"Prestations familiales, logement et aides sociales selon conditions." },
      { name:"Assurance / mutuelle", status:item.insuranceStatus === "no" ? "Déclarée absente" : "À confirmer", purpose:"Indemnisation ou prise en charge selon le contrat et le sinistre." }
    ];

    if(item.eventType === "medical" || item.eventType === "disability"){
      possibleAids.push(
        { name:"Assurance Maladie / CPAM", status:"À vérifier", purpose:"Aides, action sanitaire et sociale, prise en charge selon situation." },
        { name:"MDPH", status:"Si handicap concerné", purpose:"Droits, prestations et orientation selon le besoin." }
      );
    }

    return {
      generatedAt: nowIso(),
      officialDirectoryStatus: "Production : mise à jour automatique via sources officielles à connecter côté serveur.",
      tasks: common.concat(extra),
      possibleAids: possibleAids
    };
  }

  function getOrBuildGuidance(item){
    if(item.guidance && Array.isArray(item.guidance.tasks)){
      return item.guidance;
    }
    return guidanceForCampaign(item);
  }

  function updateGuidanceTask(campaignId, taskId, done){
    const items = loadCampaigns();
    const item = items.find(function(row){ return row.id === campaignId; });
    if(!item){ throw new Error("Dossier introuvable."); }
    item.guidance = getOrBuildGuidance(item);
    const task = item.guidance.tasks.find(function(row){ return row.id === taskId; });
    if(task){ task.done = !!done; task.updatedAt = nowIso(); }
    item.audit.push({ at:nowIso(), action:"guidance_task_updated", taskId:taskId, done:!!done });
    saveCampaigns(items);
    return item.guidance;
  }

  /* =========================================================
     STYLES / HÔTE MODAL
     ========================================================= */

  function injectStyles(){
    if(document.getElementById("bociteSolidarityStylesV3")){ return; }
    const style = document.createElement("style");
    style.id = "bociteSolidarityStylesV3";
    style.textContent = `
      .bociteSolidarityRoot{font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.48;font-size:14px}
      .bociteSolidarityHead{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:12px}
      .bociteSolidarityTitle{font-size:20px;color:#2f5d46;font-weight:800;margin:0}
      .bociteSolidaritySub{font-size:13px;color:#666;margin-top:4px}
      .bociteSolidarityCard{background:#fff;border:1px solid #ded9cd;border-radius:14px;padding:14px;margin:11px 0;box-shadow:0 1px 3px rgba(0,0,0,.04)}
      .bociteSolidarityCard h3{color:#2f5d46;font-size:17px;margin:0 0 8px;font-weight:800}
      .bociteSolidarityBtn{background:#fff;border:2px solid #2f5d46;color:#2f5d46;border-radius:11px;padding:10px 13px;font-size:14px;font-weight:800;cursor:pointer}
      .bociteSolidarityBtn:hover{background:#f2f8f4}
      .bociteSolidarityBtnPrimary{background:#2f5d46;color:#fff}
      .bociteSolidarityBtnDanger{border-color:#b42318;color:#b42318}
      .bociteSolidarityBtnSoft{border-color:#777;color:#555}
      .bociteSolidarityActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
      .bociteSolidarityField{width:100%;box-sizing:border-box;border:1px solid #aaa;border-radius:9px;padding:10px;background:#fff;font-size:14px}
      .bociteSolidarityLabel{display:block;font-size:13px;font-weight:800;margin:10px 0 5px}
      .bociteSolidarityHelp{font-size:12px;color:#666;line-height:1.4;margin-top:5px}
      .bociteSolidarityGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .bociteSolidarityAlert{background:#fff3f1;border-left:4px solid #b42318;border-radius:8px;padding:10px;margin:10px 0;font-size:13px}
      .bociteSolidarityOk{background:#f1faf4;border-left:4px solid #2f5d46;border-radius:8px;padding:10px;margin:10px 0;font-size:13px}
      .bociteSolidarityInfo{background:#f7f2e8;border-left:4px solid #b69049;border-radius:8px;padding:10px;margin:10px 0;font-size:13px}
      .bociteSolidarityTicker{overflow:hidden;background:#b42318;color:#fff;border-radius:0 0 9px 9px;min-height:25px;display:flex;align-items:center;cursor:pointer;margin-top:3px}
      .bociteSolidarityTickerTrack{white-space:nowrap;display:inline-block;padding-left:100%;animation:bociteSolidarityScroll 18s linear infinite;font-size:11px;font-weight:800}
      @keyframes bociteSolidarityScroll{from{transform:translateX(0)}to{transform:translateX(-100%)}}
      .bociteSolidarityProgress{height:9px;background:#eee;border-radius:999px;overflow:hidden;margin-top:8px}
      .bociteSolidarityProgress span{display:block;height:100%;background:#2f5d46}
      .bociteSolidarityMeta{font-size:12px;color:#666;margin-top:5px}
      .bociteSolidarityBadge{display:inline-block;border-radius:999px;padding:4px 8px;background:#eef7f1;color:#2f5d46;font-size:11px;font-weight:800;margin:2px 4px 2px 0}
      .bociteSolidarityBadgeRed{background:#fff0ed;color:#b42318}
      .bociteSolidarityOverlay{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.55);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:18px 8px}
      .bociteSolidarityPanel{width:min(760px,100%);background:#f3efe5;border-radius:16px;padding:15px;box-sizing:border-box;position:relative}
      .bociteSolidarityClose{position:absolute;right:10px;top:8px;border:0;background:transparent;font-size:27px;cursor:pointer}
      .bociteSolidarityFee{display:grid;grid-template-columns:1fr auto;gap:6px 10px;margin-top:10px;font-size:13px}
      .bociteSolidarityFee strong{text-align:right}
      .bociteSolidarityPhotoGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}
      .bociteSolidarityPhoto{width:100%;height:180px;object-fit:cover;border-radius:10px;border:1px solid #ddd}
      .bociteSolidarityTask{display:grid;grid-template-columns:auto 1fr;gap:9px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #eee}
      .bociteSolidarityTask:last-child{border-bottom:0}
      .bociteSolidarityPhase{font-size:12px;color:#b42318;font-weight:800;margin-top:10px}
      .bociteSolidarityThanks{text-align:center;font-size:34px;font-weight:900;color:#2f5d46;padding:16px 0}
      .bociteSolidarityHearts{font-size:30px;animation:bociteHearts 1s ease-in-out 3;text-align:center}
      @keyframes bociteHearts{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
      .bociteSolidarityPaymentBox{border:2px solid #2f5d46;background:#fff;border-radius:14px;padding:13px;margin-top:10px}
      .bociteSolidarityCardNumber{letter-spacing:1px}
      .bociteSolidarityScope{font-size:12px;color:#555;background:#faf8f2;border:1px solid #ded9cd;border-radius:9px;padding:9px;margin-top:8px}
      .bociteSolidarityLine{height:1px;background:#e5e1d7;margin:12px 0}
      @media(max-width:620px){.bociteSolidarityGrid{grid-template-columns:1fr}.bociteSolidarityPhotoGrid{grid-template-columns:1fr}.bociteSolidarityPhoto{height:210px}}
    `;
    document.head.appendChild(style);
  }

  function getHost(){
    const modal = document.getElementById("modal");
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");

    if(modal && body){
      if(title){ title.textContent = "Urgence solidaire"; }
      modal.style.display = "block";
      return { body:body, close:function(){ modal.style.display = "none"; } };
    }

    let overlay = document.getElementById("bociteSolidarityOverlayV3");

    if(!overlay){
      overlay = document.createElement("div");
      overlay.id = "bociteSolidarityOverlayV3";
      overlay.className = "bociteSolidarityOverlay";
      overlay.innerHTML = '<div class="bociteSolidarityPanel"><button type="button" class="bociteSolidarityClose" aria-label="Fermer">×</button><div id="bociteSolidarityStandaloneBodyV3"></div></div>';
      document.body.appendChild(overlay);

      overlay.querySelector(".bociteSolidarityClose").addEventListener("click", function(){
        overlay.remove();
      });
    }

    return {
      body:document.getElementById("bociteSolidarityStandaloneBodyV3"),
      close:function(){
        const current = document.getElementById("bociteSolidarityOverlayV3");
        if(current){ current.remove(); }
      }
    };
  }

  function renderBase(html){
    injectStyles();
    const host = getHost();
    host.body.innerHTML = '<div class="bociteSolidarityRoot">' + html + '</div>';
    return host.body;
  }

  /* =========================================================
     BANDEAU / BOUTON EXISTANT
     ========================================================= */

  function tickerText(){
    const item = featuredCampaignForCity(getCurrentCity(), getCurrentCityId());

    if(!item){
      return "Aucune urgence solidaire vérifiée en cours dans cette commune.";
    }

    const p = publicProgress(item);

    return "URGENCE SOLIDAIRE — " +
      eventLabel(item.eventType) +
      " — " +
      (item.city || getCurrentCity()) +
      " — " +
      money(p.collected) +
      " réunis — " +
      donationCount(item) +
      " participants — cliquez pour aider";
  }

  function ensureHomeTicker(){
    injectStyles();

    const tile = document.getElementById("associationDonBtn");

    if(!tile){
      return false;
    }

    tile.setAttribute("aria-label", "Urgence solidaire");
    tile.innerHTML = "Urgence<br>solidaire";
    tile.style.position = "relative";

    tile.onclick = function(event){
      if(event){
        event.preventDefault();
        event.stopPropagation();
      }

      openHome();
    };

    tile.onkeydown = function(event){
      if(event.key === "Enter" || event.key === " "){
        event.preventDefault();
        tile.click();
      }
    };

    const wrapper = tile.parentElement || tile;

    let ticker = document.getElementById("bociteSolidarityTickerV3");

    if(!ticker){
      ticker = document.createElement("div");
      ticker.id = "bociteSolidarityTickerV3";
      ticker.className = "bociteSolidarityTicker";
      ticker.innerHTML =
        '<div class="bociteSolidarityTickerTrack" id="bociteSolidarityTickerTrackV3"></div>';

      wrapper.appendChild(ticker);
    }

    const track = document.getElementById("bociteSolidarityTickerTrackV3");

    if(track){
      track.textContent = tickerText();
    }

    ticker.onclick = function(){
      const featured = featuredCampaignForCity(getCurrentCity(), getCurrentCityId());

      if(featured){
        openCampaign(featured.id);
      }else{
        openHome();
      }
    };

    return true;
  }

  /* =========================================================
     CARTES CAMPAGNES / ÉCRAN PRINCIPAL
     ========================================================= */

  function campaignCard(item, compact){
    const p = publicProgress(item);
    const participants = donationCount(item);

    return `
      <div class="bociteSolidarityCard" data-campaign-card="${safeText(item.id)}">
        <div>

                <span class="bociteSolidarityBadge">${safeText(item.city || "Ville")}</span>
          <span class="bociteSolidarityBadge">${safeText(eventLabel(item.eventType))}</span>
          ${Number(item.urgencyScore || 0) >= 70 ? '<span class="bociteSolidarityBadge bociteSolidarityBadgeRed">Priorité forte</span>' : ''}
        </div>

        <h3 style="margin-top:8px">${safeText(item.title)}</h3>

        ${compact ? '' : '<div>' + safeText(item.publicSummary || item.description || "") + '</div>'}

        <div class="bociteSolidarityProgress">
          <span style="width:${p.pct}%"></span>
        </div>

        <div class="bociteSolidarityMeta">
          <strong>${safeText(money(p.collected))}</strong>
          réunis sur ${safeText(money(p.target))}
          — ${participants} participant${participants > 1 ? 's' : ''}
          — reste ${safeText(money(p.remaining))}
        </div>

        <div class="bociteSolidarityActions">
          <button type="button" class="bociteSolidarityBtn" data-action="view" data-id="${safeText(item.id)}">
            Voir
          </button>

          <button type="button" class="bociteSolidarityBtn bociteSolidarityBtnPrimary" data-action="donate" data-id="${safeText(item.id)}">
            Faire un don
          </button>

          <button type="button" class="bociteSolidarityBtn" data-action="share" data-id="${safeText(item.id)}">
            Partager
          </button>
        </div>
      </div>
    `;
  }

  function bindCampaignButtons(body){
    body.querySelectorAll('[data-action="view"]').forEach(function(btn){
      btn.addEventListener("click", function(){
        openCampaign(btn.getAttribute("data-id"));
      });
    });

    body.querySelectorAll('[data-action="donate"]').forEach(function(btn){
      btn.addEventListener("click", function(){
        openDonation(btn.getAttribute("data-id"));
      });
    });

    body.querySelectorAll('[data-action="share"]').forEach(function(btn){
      btn.addEventListener("click", function(){
        shareCampaign(btn.getAttribute("data-id"));
      });
    });
  }

  function openHome(){
    runAgentMaintenance();

    const city = getCurrentCity();
    const cityId = getCurrentCityId();

    const cityItems = activeCampaignsForCity(city, cityId);
    const allItems = allActiveCampaigns();

    const featured = cityItems.length ? cityItems[0] : null;

    const html = `
      <div class="bociteSolidarityHead">
        <div>
          <h2 class="bociteSolidarityTitle">
            Urgence solidaire
          </h2>

          <div class="bociteSolidaritySub">
            Aider rapidement une personne, une famille ou une situation grave vérifiée.
          </div>
        </div>
      </div>

      <div class="bociteSolidarityScope">
        Les appels sont rattachés aux villes partenaires Bo’CitéArt.
        En revanche,
        <strong>toute personne peut donner</strong>,
        même sans compte ni application,
        grâce au lien public et au QR dynamique.
      </div>

      ${
        featured
          ?
            '<div class="bociteSolidarityAlert">' +
            '<strong>Urgence mise en avant actuellement</strong> — ' +
            'l’agent la choisit selon l’urgence humaine, ' +
            'jamais selon le statut du demandeur ou le montant demandé.' +
            '</div>' +
            campaignCard(featured, false)
          :
            '<div class="bociteSolidarityOk">' +
            'Aucune urgence active dans votre commune actuellement.' +
            '</div>'
      }

      <div class="bociteSolidarityActions">
        <button type="button" class="bociteSolidarityBtn bociteSolidarityBtnPrimary" data-action="create">
          Signaler une situation
        </button>

        <button type="button" class="bociteSolidarityBtn" data-action="list">
          Voir toutes les urgences
        </button>

        <button type="button" class="bociteSolidarityBtn" data-action="my">
          Mes demandes / accompagnement
        </button>

        <button type="button" class="bociteSolidarityBtn" data-action="book">
          Livre des solidarités
        </button>

        <button type="button" class="bociteSolidarityBtn" data-action="votes">
          Votes citoyens
        </button>

        <button type="button" class="bociteSolidarityBtn" data-action="journal">
          Transparence
        </button>
      </div>

      <div class="bociteSolidarityCard">
        <h3>Le principe</h3>

        <div>
          Bo’CitéArt vérifie, publie et accompagne.
          Le PSP gère le paiement et les fonds.
          Les situations de succession, de tutelle,
          de remboursement ou de versement protégé
          restent traitées par les acteurs légalement compétents.
        </div>
      </div>
    `;

    const body = renderBase(html);

    bindCampaignButtons(body);

    body.querySelector('[data-action="create"]').addEventListener(
      "click",
      openCreateForm
    );

    body.querySelector('[data-action="list"]').addEventListener(
      "click",
      openAllCampaigns
    );

    body.querySelector('[data-action="my"]').addEventListener(
      "click",
      openMyRequests
    );

    body.querySelector('[data-action="book"]').addEventListener(
      "click",
      openSolidarityBook
    );

    body.querySelector('[data-action="votes"]').addEventListener(
      "click",
      openCommunityVotes
    );

    body.querySelector('[data-action="journal"]').addEventListener(
      "click",
      openTransparencyJournal
    );

    return allItems.length;
  }

  function openAllCampaigns(){
    const items = allActiveCampaigns();

    const cards =
      items.length
        ? items.map(function(item){
            return campaignCard(item, true);
          }).join("")
        : '<div class="bociteSolidarityOk">Aucune collecte active actuellement.</div>';

    const body = renderBase(`
      <div class="bociteSolidarityHead">
        <div>
          <h2 class="bociteSolidarityTitle">
            Toutes les urgences solidaires
          </h2>

          <div class="bociteSolidaritySub">
            Toutes les villes partenaires —
            chacun choisit librement la cause qu'il souhaite soutenir.
          </div>
        </div>
      </div>

      ${cards}

      <div class="bociteSolidarityActions">
        <button class="bociteSolidarityBtn" data-action="back" type="button">
          Retour
        </button>
      </div>
    `);

    bindCampaignButtons(body);

    body.querySelector('[data-action="back"]').addEventListener(
      "click",
      openHome
    );
  }

  /* =========================================================
     FORMULAIRE RAPIDE DE DEMANDE
     ========================================================= */

  function optionRows(rows){
    return rows.map(function(row){
      return '<option value="' +
        safeText(row[0]) +
        '">' +
        safeText(row[1]) +
        '</option>';
    }).join("");
  }

  function openCreateForm(){
    const city =
      getCurrentCity() === "Votre commune"
        ? ""
        : getCurrentCity();

    const body = renderBase(`
      <div class="bociteSolidarityHead">
        <div>
          <h2 class="bociteSolidarityTitle">
            Signaler une situation
          </h2>

          <div class="bociteSolidaritySub">
            On commence par l'essentiel.
            Les informations encore inconnues pourront être complétées plus tard.
          </div>
        </div>
      </div>

      <div class="bociteSolidarityInfo">
        <strong>
          Après un choc, “je ne sais pas encore” est une réponse normale.
        </strong>
        La collecte urgente ne doit pas devenir un dossier d'assurance.
      </div>

      <form id="bociteSolidarityCreateFormV3">

        <div class="bociteSolidarityGrid">

          <div>
            <label class="bociteSolidarityLabel" for="solActorType">
              Qui signale ?
            </label>

            <select class="bociteSolidarityField" id="solActorType">
              ${optionRows(ACTOR_TYPES)}
            </select>
          </div>

          <div>
            <label class="bociteSolidarityLabel" for="solEventType">
              Situation
            </label>

            <select class="bociteSolidarityField" id="solEventType">
              ${optionRows(EVENT_TYPES)}
            </select>
          </div>

        </div>

        <label class="bociteSolidarityLabel" for="solCity">
          Ville concernée
        </label>

        <input
          class="bociteSolidarityField"
          id="solCity"
          value="${safeText(city)}"
          required
        >

        <label class="bociteSolidarityLabel" for="solTitle">
          Titre simple
        </label>

        <input
          class="bociteSolidarityField"
          id="solTitle"
          maxlength="140"
          required
          placeholder="Ex. Incendie — une famille doit être relogée"
        >

        <label class="bociteSolidarityLabel" for="solDescription">
          Que s'est-il passé ?
        </label>

        <textarea
          class="bociteSolidarityField"
          id="solDescription"
          rows="4"
          maxlength="1800"
          required
          placeholder="Quelques phrases suffisent."
        ></textarea>

        <label class="bociteSolidarityLabel" for="solImmediateNeed">
          De quoi a-t-on besoin maintenant ?
        </label>

        <textarea
          class="bociteSolidarityField"
          id="solImmediateNeed"
          rows="3"
          maxlength="1200"
          placeholder="Ex. hébergement, vêtements, équipement, reste à charge médical..."
        ></textarea>

        <div class="bociteSolidarityGrid">

          <div>
            <label class="bociteSolidarityLabel" for="solTarget">
              Objectif de première urgence (€)
            </label>

            <input
              class="bociteSolidarityField"
              id="solTarget"
              type="number"
              min="1"
              step="1"
              required
            >

            <div class="bociteSolidarityHelp">
              Il peut être réévalué si des informations nouvelles apparaissent.
            </div>
          </div>

          <div>
            <label class="bociteSolidarityLabel" for="solInsurance">
              Assurance
            </label>

            <select class="bociteSolidarityField" id="solInsurance">
              <option value="unknown">
                Je ne sais pas encore / en cours
              </option>

              <option value="yes">
                Oui
              </option>

              <option value="no">
                Non
              </option>

              <option value="refuse_to_say">
                Je ne souhaite pas répondre
              </option>
            </select>
          </div>

        </div>

                <label class="bociteSolidarityLabel" for="solProtection">
          Protection particulière du bénéficiaire — si connue
        </label>

        <select class="bociteSolidarityField" id="solProtection">
          <option value="none">
            Aucune / non concerné / je ne sais pas
          </option>

          <option value="minor">
            Mineur
          </option>

          <option value="protected_adult">
            Majeur sous mesure de protection
          </option>

          <option value="unable_to_manage">
            Personne momentanément incapable de gérer les démarches
          </option>
        </select>

        <div class="bociteSolidarityHelp">
          Cette information sert uniquement à orienter le versement
          vers le circuit protégé approprié ;
          elle ne donne jamais au tuteur ou à un tiers
          un droit automatique sur les fonds.
        </div>

        <label class="bociteSolidarityLabel">
          Ce qui rend la situation urgente
        </label>

        <div class="bociteSolidarityCard" style="margin-top:5px">

          <label>
            <input type="checkbox" id="urgShelter">
            Besoin immédiat de logement / mise à l'abri
          </label>
          <br>

          <label>
            <input type="checkbox" id="urgMedical">
            Besoin vital / médical à échéance courte
          </label>
          <br>

          <label>
            <input type="checkbox" id="urgVulnerable">
            Enfant, personne âgée, handicapée ou particulièrement vulnérable
          </label>
          <br>

          <label>
            <input type="checkbox" id="urgNoSolution">
            Aucune solution immédiate disponible
          </label>
          <br>

          <label>
            <input type="checkbox" id="urgEssential">
            Service essentiel interrompu
          </label>
          <br>

          <label>
            <input type="checkbox" id="urgCollective">
            Plusieurs foyers/personnes touchés
          </label>
          <br>

          <label>
            <input type="checkbox" id="urg72">
            Échéance dans moins de 72 h
          </label>
          <br>

          <label>
            <input type="checkbox" id="urg7d">
            Échéance dans moins de 7 jours
          </label>

        </div>

        <label class="bociteSolidarityLabel" for="solPublicPhotos">
          Photos pouvant être montrées au public — 5 maximum
        </label>

        <input
          class="bociteSolidarityField"
          id="solPublicPhotos"
          type="file"
          accept="image/*"
          multiple
        >

        <label class="bociteSolidarityLabel" for="solPrivateProofs">
          Preuves privées — 10 maximum
        </label>

        <input
          class="bociteSolidarityField"
          id="solPrivateProofs"
          type="file"
          multiple
        >

        <div class="bociteSolidarityHelp">
          Les preuves privées ne sont pas affichées au public.
          On privilégie la preuve du besoin et du coût
          plutôt que des données intimes inutiles.
        </div>

        <label class="bociteSolidarityLabel" for="solProofSummary">
          Élément simple de vérification
        </label>

        <textarea
          class="bociteSolidarityField"
          id="solProofSummary"
          rows="2"
          placeholder="Ex. constat d'incendie, devis, courrier, attestation, témoin institutionnel..."
        ></textarea>

        <div class="bociteSolidarityCard">

          <h3>
            Vérification du demandeur
          </h3>

          <div>
            En production, cette étape sera assurée
            par le prestataire sécurisé.
            Aucune pièce d'identité brute
            ne sera stockée dans le navigateur.
          </div>

          <label style="display:block;margin-top:8px">
            <input type="checkbox" id="solIdentityDemo">
            Démonstration : considérer le demandeur vérifié
          </label>

        </div>

        <label style="display:block;margin:12px 0">

          <input
            type="checkbox"
            id="solDeclaration"
            required
          >

          Je certifie sincères les informations
          que je connais aujourd'hui
          et je m'engage à signaler
          toute évolution importante
          dont j'aurai connaissance.

        </label>

        <div class="bociteSolidarityActions">

          <button
            class="bociteSolidarityBtn bociteSolidarityBtnPrimary"
            type="submit"
          >
            Envoyer la demande
          </button>

          <button
            class="bociteSolidarityBtn"
            type="button"
            data-action="back"
          >
            Retour
          </button>

        </div>

      </form>
    `);

    body.querySelector('[data-action="back"]').addEventListener(
      "click",
      openHome
    );

    body
      .querySelector("#bociteSolidarityCreateFormV3")
      .addEventListener(
        "submit",
        handleCreateSubmission
      );
  }

  async function handleCreateSubmission(event){

    event.preventDefault();

    const settings = getSettings();

    const id = uid("SOL");

    const photosEl =
      document.getElementById("solPublicPhotos");

    const proofsEl =
      document.getElementById("solPrivateProofs");

    const identityVerified =
      document.getElementById("solIdentityDemo").checked === true;

    const campaign = {

      id:id,

      eventType:
        document.getElementById("solEventType").value,

      actorType:
        document.getElementById("solActorType").value,

      title:
        String(
          document.getElementById("solTitle").value || ""
        ).trim(),

      city:
        String(
          document.getElementById("solCity").value || ""
        ).trim(),

      cityId:
        getCurrentCityId() || null,

      description:
        String(
          document.getElementById("solDescription").value || ""
        ).trim(),

      publicSummary:
        String(
          document.getElementById("solDescription").value || ""
        ).trim(),

      immediateNeed:
        String(
          document.getElementById("solImmediateNeed").value || ""
        ).trim(),

      targetAmount:
        Number(
          document.getElementById("solTarget").value || 0
        ),

      insuranceStatus:
        document.getElementById("solInsurance").value,

      beneficiaryProtection:
        document.getElementById("solProtection").value,

      proofSummary:
        String(
          document.getElementById("solProofSummary").value || ""
        ).trim(),

      identityVerified:
        identityVerified,

      identityReference:
        identityVerified
          ? "DEMO-KYC-" + id
          : null,

      publicPhotoCount:
        photosEl && photosEl.files
          ? Math.min(
              photosEl.files.length,
              settings.publicPhotoMax
            )
          : 0,

      privateProofCount:
        proofsEl && proofsEl.files
          ? Math.min(
              proofsEl.files.length,
              settings.privateProofMax
            )
          : 0,

      urgency:{

        immediateShelter:
          document.getElementById("urgShelter").checked,

        vitalMedical:
          document.getElementById("urgMedical").checked,

        childrenOrVulnerable:
          document.getElementById("urgVulnerable").checked,

        noImmediateSolution:
          document.getElementById("urgNoSolution").checked,

        essentialServiceInterrupted:
          document.getElementById("urgEssential").checked,

        collectiveImpact:
          document.getElementById("urgCollective").checked,

        deadline72h:
          document.getElementById("urg72").checked,

        deadline7d:
          document.getElementById("urg7d").checked

      },

      createdAt:
        nowIso(),

      publishedAt:
        null,

      status:
        STATUS.PENDING_AGENT,

      donations:[],

      reports:[],

      financialUpdates:[],

      audit:[
        {
          at:nowIso(),
          action:"request_created",
          actorType:
            document.getElementById("solActorType").value
        }
      ]
    };

    campaign.protectionRoute =
      campaign.beneficiaryProtection === "minor"

        ? "PSP_PROTECTED_MINOR_OR_DIRECT_SUPPLIER"

        : campaign.beneficiaryProtection === "protected_adult"

          ? "PSP_PROTECTED_ADULT_ACCOUNT_JUDICIAL_RULES"

          : campaign.beneficiaryProtection === "unable_to_manage"

            ? "HELP_CONTACT_WITHOUT_FUND_CONTROL"

            : "STANDARD";

    campaign.collectiveDistributionMode =
      campaign.eventType === "collective"

        ? "PSP_PLUS_CCASS_OR_LEGALLY_COMPETENT_BODY_WITH_PUBLISHED_RULES"

        : null;

    campaign.aiReview =
      analyseSubmission(campaign);

    campaign.urgencyScore =
      campaign.aiReview.urgencyScore;

    campaign.guidance =
      guidanceForCampaign(campaign);

    if(
      campaign.aiReview.level ===
      "RED"
    ){

      campaign.status =
        STATUS.REJECTED;

      campaign.audit.push({
        at:nowIso(),
        action:"agent_rejected",
        reasons:campaign.aiReview.reasons
      });

      addJournal({
        type:"request_rejected",
        publicText:
          "Une demande a été refusée car elle ne relevait pas du périmètre Urgence solidaire ou présentait une anomalie importante."
      });

    }else if(
      campaign.aiReview.requiresVote
    ){

      campaign.status =
        STATUS.PENDING_VOTE;

      campaign.audit.push({
        at:nowIso(),
        action:"category_vote_required"
      });

    }else if(
      campaign.aiReview.canAutoPublish &&
      getSettings().autoPublishGreen
    ){

      campaign.status =
        STATUS.LIVE;

      campaign.publishedAt =
        nowIso();

      campaign.audit.push({
        at:nowIso(),
        action:"agent_auto_published_green"
      });

      addJournal({
        type:"campaign_published",
        campaignId:id,
        publicText:
          "Un appel solidaire vérifié a été publié automatiquement après contrôles."
      });

    }else{

      campaign.status =
        identityVerified
          ? STATUS.PENDING_INFO
          : STATUS.PENDING_IDENTITY;

      campaign.audit.push({
        at:nowIso(),
        action:"agent_requests_completion",
        requests:campaign.aiReview.requests
      });

    }

    const items =
      loadCampaigns();

    items.push(
      campaign
    );

    saveCampaigns(
      items
    );

    try{

      campaign.publicPhotoMedia =
        await saveMediaFiles(
          id,
          "public_photo",
          photosEl && photosEl.files,
          settings.publicPhotoMax
        );

      campaign.privateProofMedia =
        await saveMediaFiles(
          id,
          "private_proof",
          proofsEl && proofsEl.files,
          settings.privateProofMax
        );

      const refreshed =
        loadCampaigns();

      const stored =
        refreshed.find(function(row){
          return row.id === id;
        });

      if(stored){

        stored.publicPhotoMedia =
          campaign.publicPhotoMedia || [];

        stored.privateProofMedia =
          campaign.privateProofMedia || [];

        saveCampaigns(
          refreshed
        );
      }

    }catch(error){

      // Le dossier reste créé
      // même si le stockage local média
      // est indisponible.

    }

    if(
      campaign.status ===
      STATUS.PENDING_VOTE
    ){
      startCategoryVote(
        campaign
      );
    }

    ensureHomeTicker();

    openSubmissionResult(
      id
    );
  }

  function openSubmissionResult(id){

    const item =
      loadCampaigns().find(function(row){
        return row.id === id;
      });

    if(!item){
      return;
    }

    const review =
      item.aiReview || {};

    const requests =
      Array.isArray(review.requests) &&
      review.requests.length

        ? '<ul>' +
          review.requests.map(function(x){
            return '<li>' +
              safeText(x) +
              '</li>';
          }).join("") +
          '</ul>'

        : '';

    const reasons =
      Array.isArray(review.reasons) &&
      review.reasons.length

        ? '<ul>' +
          review.reasons.map(function(x){
            return '<li>' +
              safeText(x) +
              '</li>';
          }).join("") +
          '</ul>'

        : '';

    const body = renderBase(`
      <div class="bociteSolidarityHead">

        <div>

          <h2 class="bociteSolidarityTitle">
            Demande analysée
          </h2>

          <div class="bociteSolidaritySub">
            Dossier ${safeText(id)}
          </div>

        </div>

      </div>

      <div
        class="${
          review.level === 'RED'
            ? 'bociteSolidarityAlert'
            : review.level === 'GREEN'
              ? 'bociteSolidarityOk'
              : 'bociteSolidarityInfo'
        }"
      >

        <strong>
          Agent : ${safeText(review.level || '')}
        </strong>

        <br>

        ${safeText(statusLabel(item.status))}

        ${reasons}

        ${requests}

      </div>

      <div class="bociteSolidarityCard">

        <h3>
          Accompagnement déjà préparé
        </h3>

        <div>
          L'agent a aussi construit votre pense-bête privé
          et la liste des aides possibles.
          Vous pouvez l'ouvrir depuis
          « Mes demandes / accompagnement ».
        </div>

      </div>

      <div class="bociteSolidarityActions">

        ${
          item.status === STATUS.LIVE
            ? '<button type="button" class="bociteSolidarityBtn bociteSolidarityBtnPrimary" data-action="view">Voir la collecte publiée</button>'
            : ''
        }

        <button
          type="button"
          class="bociteSolidarityBtn"
          data-action="guidance"
        >
          Mon accompagnement
        </button>

        <button
          type="button"
          class="bociteSolidarityBtn"
          data-action="home"
        >
          Retour
        </button>

      </div>
    `);

    const view =
      body.querySelector('[data-action="view"]');

    if(view){
      view.addEventListener(
        "click",
        function(){
          openCampaign(id);
        }
      );
    }

    body
      .querySelector('[data-action="guidance"]')
      .addEventListener(
        "click",
        function(){
          openGuidance(id);
        }
      );

    body
      .querySelector('[data-action="home"]')
      .addEventListener(
        "click",
        openHome
      );
  }

   /* =========================================================
     CAMPAGNE PUBLIQUE
     ========================================================= */

  function campaignPublicLink(item){

    const settings =
      getSettings();

    const base =
      settings.publicBaseUrl ||
      (
        window.location.origin +
        window.location.pathname
      );

    return base +
      (
        base.indexOf("?") >= 0
          ? "&"
          : "?"
      ) +
      "solidarity=" +
      encodeURIComponent(item.id);
  }

  function renderDynamicQr(item, container){

    if(
      !container ||
      !item
    ){
      return;
    }

    const url =
      campaignPublicLink(item);

    container.innerHTML =
      "";

    if(
      typeof window.QRCode ===
      "function"
    ){

      try{

        new window.QRCode(
          container,
          {
            text:url,
            width:128,
            height:128
          }
        );

        const caption =
          document.createElement(
            "div"
          );

        caption.className =
          "bociteSolidarityHelp";

        caption.textContent =
          "QR dynamique public — partageable même avec une personne qui n'a pas installé Bo’CitéArt.";

        container.appendChild(
          caption
        );

        return;

      }catch(error){}

    }

    container.innerHTML =
      '<div class="bociteSolidarityHelp">' +
      'QR dynamique disponible lorsque la bibliothèque QR de Bo’CitéArt est chargée.' +
      '</div>';
  }

  function openCampaign(id){

    const item =
      loadCampaigns().find(function(row){
        return row.id === id;
      });

    if(!item){

      alert(
        "Cet appel n'existe plus."
      );

      return;
    }

    const isPublic =
      item.status === STATUS.LIVE ||
      item.status === STATUS.CLOSED;

    const p =
      publicProgress(item);

    const body = renderBase(`
      <div class="bociteSolidarityHead">

        <div>

          <h2 class="bociteSolidarityTitle">
            ${safeText(item.title)}
          </h2>

          <div class="bociteSolidaritySub">
            ${safeText(item.city)}
            —
            ${safeText(eventLabel(item.eventType))}
          </div>

        </div>

      </div>

      <div>

        <span class="bociteSolidarityBadge">
          Identité contrôlée
        </span>

        <span class="bociteSolidarityBadge">
          Justificatifs contrôlés
        </span>

        <span class="bociteSolidarityBadge">
          Objectif justifié
        </span>

      </div>

      <div class="bociteSolidarityCard">

        <div>
          ${safeText(
            item.publicSummary ||
            item.description
          )}
        </div>

        <div class="bociteSolidarityLine"></div>

        <div>

          <strong>
            Besoin :
          </strong>

          ${safeText(
            item.immediateNeed ||
            "Aide immédiate liée à la situation décrite."
          )}

        </div>

        <div class="bociteSolidarityProgress">

          <span
            style="width:${p.pct}%"
          ></span>

        </div>

        <div class="bociteSolidarityMeta">

          <strong>
            ${safeText(money(p.collected))}
          </strong>

          réunis sur
          ${safeText(money(p.target))}

          —
          ${donationCount(item)}
          participants

          —
          reste
          ${safeText(money(p.remaining))}

        </div>

        <div class="bociteSolidarityMeta">
          Un léger dépassement de l'objectif
          peut exister lorsque plusieurs dons
          arrivent au même moment.
        </div>

      </div>

      <div
        class="bociteSolidarityPhotoGrid"
        id="solPublicMediaV3"
      ></div>

      <div class="bociteSolidarityCard">

        <h3>
          Transparence
        </h3>

        <div>
          Les pièces privées ne sont pas publiées.
          Leur validation est indiquée ici
          sans exposer les documents personnels.
        </div>

        <div class="bociteSolidarityMeta">
          Lien public :
          ${safeText(campaignPublicLink(item))}
        </div>

        <div
          id="solDynamicQrV3"
          style="margin-top:10px"
        ></div>

      </div>

      ${
        item.status === STATUS.CLOSED &&
        item.closingMessage

          ?
            '<div class="bociteSolidarityOk">' +
            '<strong>Collecte terminée</strong><br>' +
            safeText(item.closingMessage) +
            '</div>'

          :
            ''
      }

      <div class="bociteSolidarityActions">

        ${
          isPublic &&
          item.status === STATUS.LIVE

            ?
              '<button type="button" class="bociteSolidarityBtn bociteSolidarityBtnPrimary" data-action="donate">' +
              'Faire un don' +
              '</button>'

            :
              ''
        }

        <button
          type="button"
          class="bociteSolidarityBtn"
          data-action="share"
        >
          Partager cet appel
        </button>

        ${
          item.status === STATUS.LIVE

            ?
              '<button type="button" class="bociteSolidarityBtn bociteSolidarityBtnDanger" data-action="report">' +
              'Signaler' +
              '</button>'

            :
              ''
        }

        <button
          type="button"
          class="bociteSolidarityBtn"
          data-action="back"
        >
          Retour
        </button>

      </div>
    `);

    renderPublicMedia(
      item.id,
      body.querySelector("#solPublicMediaV3")
    );

    renderDynamicQr(
      item,
      body.querySelector("#solDynamicQrV3")
    );

    const donate =
      body.querySelector('[data-action="donate"]');

    if(donate){

      donate.addEventListener(
        "click",
        function(){
          openDonation(id);
        }
      );
    }

    body
      .querySelector('[data-action="share"]')
      .addEventListener(
        "click",
        function(){
          shareCampaign(id);
        }
      );

    const report =
      body.querySelector('[data-action="report"]');

    if(report){

      report.addEventListener(
        "click",
        function(){
          reportCampaign(id);
        }
      );
    }

    body
      .querySelector('[data-action="back"]')
      .addEventListener(
        "click",
        openHome
      );
  }

  function shareCampaign(id){

    const item =
      loadCampaigns().find(function(row){
        return row.id === id;
      });

    if(!item){
      return;
    }

    const url =
      campaignPublicLink(item);

    const text =
      "Urgence solidaire — " +
      item.title +
      " — " +
      url;

    if(navigator.share){

      navigator.share({
        title:"Urgence solidaire",
        text:item.title,
        url:url
      }).catch(function(){});

      return;
    }

    if(
      navigator.clipboard &&
      navigator.clipboard.writeText
    ){

      navigator.clipboard
        .writeText(url)
        .then(function(){
          alert(
            "Lien public copié."
          );
        })
        .catch(function(){
          prompt(
            "Copiez ce lien :",
            url
          );
        });

    }else{

      prompt(
        "Copiez ce lien :",
        url
      );
    }
  }

  function reportCampaign(id){

    const reason =
      prompt(
        "Pourquoi signalez-vous cette collecte ?"
      );

    if(!reason){
      return;
    }

    const items =
      loadCampaigns();

    const item =
      items.find(function(row){
        return row.id === id;
      });

    if(!item){
      return;
    }

    item.reports =
      Array.isArray(item.reports)
        ? item.reports
        : [];

    item.reports.push({
      at:nowIso(),
      reason:String(reason).slice(0,500),
      status:"pending_agent_review"
    });

    item.audit.push({
      at:nowIso(),
      action:"public_report_received"
    });

    if(
      item.reports.length >= 3
    ){

      item.status =
        STATUS.SUSPENDED;

      item.audit.push({
        at:nowIso(),
        action:"automatic_suspension_reports"
      });

      addJournal({
        type:"campaign_suspended",
        campaignId:id,
        publicText:
          "Une collecte a été suspendue automatiquement le temps d'un contrôle après plusieurs signalements."
      });
    }

    saveCampaigns(
      items
    );

    ensureHomeTicker();

    alert(
      "Signalement transmis à l'agent. Merci."
    );

    openCampaign(
      id
    );
  }

  /* =========================================================
     DON / PAIEMENT — DÉMO + ADAPTATEUR PRODUCTION
     ========================================================= */

  function openDonation(id){

    const item =
      loadCampaigns().find(function(row){
        return row.id === id;
      });

    if(
      !item ||
      item.status !== STATUS.LIVE
    ){

      alert(
        "Cette collecte n'est pas ouverte aux dons."
      );

      return;
    }

    const body = renderBase(`
      <div class="bociteSolidarityHead">

        <div>

          <h2 class="bociteSolidarityTitle">
            Faire un don
          </h2>

          <div class="bociteSolidaritySub">
            ${safeText(item.title)}
          </div>

        </div>

      </div>

      <div class="bociteSolidarityCard">

        <label
          class="bociteSolidarityLabel"
          for="solDonationAmount"
        >
          Votre don (€)
        </label>

        <input
          class="bociteSolidarityField"
          id="solDonationAmount"
          type="number"
          min="1"
          step="0.01"
          placeholder="Montant libre"
        >

        <div class="bociteSolidarityHelp">
          Aucun montant n'est imposé ni présélectionné.
        </div>

        <label style="display:block;margin-top:10px">
          <input
            type="checkbox"
            id="solDonationAnonymous"
          >
          Ne pas afficher mon nom publiquement
        </label>

        <label style="display:block;margin-top:10px">
          <input
            type="checkbox"
            id="solRoundUp"
          >
          Arrondir le total à l'euro supérieur
          pour soutenir facultativement
          le maintien et le développement
          du service Bo’CitéArt
        </label>

        <div id="solFeePreviewV3"></div>

      </div>

      <div class="bociteSolidarityInfo">
        Le donateur n'a pas besoin d'un compte Bo’CitéArt.
        En production, les éventuels contrôles nécessaires
        au paiement sont gérés dans le parcours sécurisé
        du prestataire.
      </div>

      <label style="display:block;margin-top:10px">

        <input
          type="checkbox"
          id="solDonationAccept"
        >

        J'ai lu le détail du paiement
        et je confirme vouloir effectuer ce don.

      </label>

      <div class="bociteSolidarityActions">

        <button
          type="button"
          class="bociteSolidarityBtn bociteSolidarityBtnPrimary"
          data-action="payment"
        >
          Continuer vers le paiement
        </button>

        <button
          type="button"
          class="bociteSolidarityBtn"
          data-action="back"
        >
          Retour
        </button>

      </div>
    `);

    const amount =
      body.querySelector(
        "#solDonationAmount"
      );

    const roundUp =
      body.querySelector(
        "#solRoundUp"
      );

    const preview =
      body.querySelector(
        "#solFeePreviewV3"
      );

    function refresh(){

      const value =
        Number(
          amount.value || 0
        );

      if(
        !Number.isFinite(value) ||
        value <= 0
      ){

        preview.innerHTML =
          '<div class="bociteSolidarityHelp" style="margin-top:10px">' +
          'Saisissez votre montant : le calcul se fera automatiquement.' +
          '</div>';

        return;
      }

      const fees =
        feeBreakdown(
          value,
          roundUp.checked
        );

      preview.innerHTML = `
        <div class="bociteSolidarityFee">

          <span>
            Votre don
          </span>

          <strong>
            ${safeText(money(fees.donation))}
          </strong>

          <span>
            Le bénéficiaire reçoit
          </span>

          <strong>
            ${safeText(money(fees.beneficiary))}
          </strong>

          <span>
            Service Bo’CitéArt — 2,5 %
          </span>

          <strong>
            ${safeText(money(fees.service))}
          </strong>

          <span>
            Paiement sécurisé — estimation démo
          </span>

          <strong>
            ${safeText(money(fees.psp))}
          </strong>

          ${
            fees.support > 0

              ?
                '<span>Soutien facultatif Bo’CitéArt</span>' +
                '<strong>' +
                safeText(money(fees.support)) +
                '</strong>'

              :
                ''
          }

          <span>
            <strong>
              Total à payer
            </strong>
          </span>

          <strong>
            ${safeText(money(fees.total))}
          </strong>

        </div>
      `;
    }

    amount.addEventListener(
      "input",
      refresh
    );

    roundUp.addEventListener(
      "change",
      refresh
    );

    refresh();

    body
      .querySelector('[data-action="back"]')
      .addEventListener(
        "click",
        function(){
          openCampaign(id);
        }
      );

    body
      .querySelector('[data-action="payment"]')
      .addEventListener(
        "click",
        function(){

          const value =
            Number(
              amount.value || 0
            );

          if(
            !Number.isFinite(value) ||
            value < 1
          ){

            alert(
              "Indiquez un montant valide."
            );

            return;
          }

          if(
            !body
              .querySelector("#solDonationAccept")
              .checked
          ){

            alert(
              "Confirmez votre accord avant de continuer."
            );

            return;
          }

          openPaymentScreen({
            campaignId:id,
            donationAmount:round2(value),
            anonymous:
              body
                .querySelector("#solDonationAnonymous")
                .checked,
            roundUp:
              roundUp.checked,
            fees:
              feeBreakdown(
                value,
                roundUp.checked
              )
          });
        }
      );
  }

   function openPaymentScreen(payload){

    const settings =
      getSettings();

    const item =
      loadCampaigns().find(function(row){
        return row.id === payload.campaignId;
      });

    if(!item){
      return;
    }

    const demo =
      settings.environment !==
      "production";

    const body = renderBase(`
      <div class="bociteSolidarityHead">

        <div>

          <h2 class="bociteSolidarityTitle">
            Paiement sécurisé
          </h2>

          <div class="bociteSolidaritySub">
            ${
              demo
                ? 'DÉMONSTRATION — aucun argent réel'
                : 'Paiement traité par le prestataire réglementé'
            }
          </div>

        </div>

      </div>

      <div class="bociteSolidarityFee bociteSolidarityCard">

        <span>
          Don
        </span>

        <strong>
          ${safeText(money(payload.fees.donation))}
        </strong>

        <span>
          Service Bo’CitéArt
        </span>

        <strong>
          ${safeText(money(payload.fees.service))}
        </strong>

        <span>
          Frais PSP estimés
        </span>

        <strong>
          ${safeText(money(payload.fees.psp))}
        </strong>

        ${
          payload.fees.support > 0

            ?
              '<span>Soutien facultatif</span>' +
              '<strong>' +
              safeText(money(payload.fees.support)) +
              '</strong>'

            :
              ''
        }

        <span>
          Total
        </span>

        <strong>
          ${safeText(money(payload.fees.total))}
        </strong>

      </div>

      ${
        demo
          ?
          `
            <div class="bociteSolidarityPaymentBox">

              <h3 style="margin-top:0;color:#2f5d46">
                Carte bancaire — test uniquement
              </h3>

              <label
                class="bociteSolidarityLabel"
                for="solCardNumber"
              >
                Numéro de carte test
              </label>

              <input
                class="bociteSolidarityField bociteSolidarityCardNumber"
                id="solCardNumber"
                value="${safeText(settings.demoCardNumber)}"
                inputmode="numeric"
              >

              <div class="bociteSolidarityGrid">

                <div>

                  <label
                    class="bociteSolidarityLabel"
                    for="solCardExpiry"
                  >
                    Expiration
                  </label>

                  <input
                    class="bociteSolidarityField"
                    id="solCardExpiry"
                    value="12/30"
                  >

                </div>

                <div>

                  <label
                    class="bociteSolidarityLabel"
                    for="solCardCvc"
                  >
                    CVC
                  </label>

                  <input
                    class="bociteSolidarityField"
                    id="solCardCvc"
                    value="123"
                    inputmode="numeric"
                  >

                </div>

              </div>

              <div class="bociteSolidarityHelp">
                Ces champs n'existent que pour la démonstration locale.
                En production, les données de carte doivent être saisies
                dans le composant hébergé/tokenisé du PSP,
                jamais dans Bo’CitéArt.
              </div>

            </div>
          `
          :
          '<div class="bociteSolidarityInfo">' +
          'Vous allez être transféré vers le composant sécurisé du prestataire de paiement.' +
          '</div>'
      }

      <div class="bociteSolidarityActions">

        <button
          type="button"
          class="bociteSolidarityBtn bociteSolidarityBtnPrimary"
          data-action="pay"
        >
          Payer ${safeText(money(payload.fees.total))}
        </button>

        <button
          type="button"
          class="bociteSolidarityBtn"
          data-action="back"
        >
          Retour
        </button>

      </div>

      <div
        id="solPaymentStatusV3"
        role="status"
        aria-live="polite"
      ></div>
    `);

    body
      .querySelector('[data-action="back"]')
      .addEventListener(
        "click",
        function(){
          openDonation(
            payload.campaignId
          );
        }
      );

    body
      .querySelector('[data-action="pay"]')
      .addEventListener(
        "click",
        async function(){

          const status =
            body.querySelector(
              "#solPaymentStatusV3"
            );

          status.innerHTML =
            '<div class="bociteSolidarityInfo">' +
            'Traitement en cours…' +
            '</div>';

          try{

            let result;

            if(demo){

              const card =
                String(
                  body.querySelector("#solCardNumber").value || ""
                ).replace(/\s/g, "");

              if(
                card.length < 12
              ){
                throw new Error(
                  "Carte de démonstration invalide."
                );
              }

              result =
                await demoPayment(
                  payload
                );

            }else{

              result =
                await productionPayment(
                  payload
                );
            }

            recordSuccessfulDonation(
              payload.campaignId,
              {
                id:result.paymentId,
                amount:payload.donationAmount,
                anonymous:payload.anonymous,
                donorDisplayName:
                  payload.anonymous
                    ? "Anonyme"
                    : "Citoyen",
                serviceFee:payload.fees.service,
                pspFee:payload.fees.psp,
                supportAmount:payload.fees.support,
                totalPaid:payload.fees.total,
                pspReference:result.pspReference,
                paidAt:nowIso(),
                paymentProvider:result.provider
              }
            );

            openThankYou(
              payload.campaignId,
              payload
            );

          }catch(error){

            status.innerHTML =
              '<div class="bociteSolidarityAlert">' +
              '<strong>Paiement refusé ou interrompu.</strong><br>' +
              safeText(
                error.message ||
                "Erreur de paiement"
              ) +
              '</div>';
          }
        }
      );
  }

  function demoPayment(payload){

    return new Promise(
      function(resolve){

        window.setTimeout(
          function(){

            const paymentId =
              uid(
                "PAY-DEMO"
              );

            const ledger =
              loadJson(
                KEYS.paymentLedger,
                []
              );

            ledger.push({
              id:paymentId,
              campaignId:payload.campaignId,
              provider:"DEMO-PSP",
              status:"paid",
              donation:payload.fees.donation,
              service:payload.fees.service,
              psp:payload.fees.psp,
              support:payload.fees.support,
              total:payload.fees.total,
              createdAt:nowIso()
            });

            saveJson(
              KEYS.paymentLedger,
              ledger
            );

            resolve({
              paymentId:paymentId,
              pspReference:
                "DEMO-PSP-" +
                paymentId,
              provider:"DEMO-PSP"
            });

          },
          250
        );
      }
    );
  }

  async function productionPayment(payload){

    if(
      window.BociteSolidarityPayment &&
      typeof window.BociteSolidarityPayment.start ===
      "function"
    ){

      return window.BociteSolidarityPayment.start(
        payload
      );
    }

    const base =
      String(
        getSettings().paymentApiBase || ""
      ).replace(
        /\/$/,
        ""
      );

    if(!base){

      throw new Error(
        "API de paiement non configurée."
      );
    }

    const response =
      await fetch(
        base + "/payments/create",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          credentials:"same-origin",

          body:
            JSON.stringify({
              campaignId:
                payload.campaignId,

              donationAmount:
                payload.donationAmount,

              roundUp:
                payload.roundUp === true,

              anonymous:
                payload.anonymous === true
            })
        }
      );

    if(!response.ok){

      throw new Error(
        "Le prestataire de paiement est indisponible."
      );
    }

    const data =
      await response.json();

    if(data.redirectUrl){

      window.location.href =
        data.redirectUrl;

      throw new Error(
        "Redirection paiement."
      );
    }

    if(!data.paymentId){

      throw new Error(
        "Réponse PSP incomplète."
      );
    }

    return data;
  }

  function recordSuccessfulDonation(
    campaignId,
    donation
  ){

    const items =
      loadCampaigns();

    const item =
      items.find(function(row){
        return row.id === campaignId;
      });

    if(
      !item ||
      item.status !== STATUS.LIVE
    ){

      throw new Error(
        "Collecte non ouverte."
      );
    }

    item.donations =
      Array.isArray(item.donations)
        ? item.donations
        : [];

    item.donations.push({

      id:
        donation.id ||
        uid("DON"),

      amount:
        round2(
          donation.amount
        ),

      anonymous:
        donation.anonymous === true,

      donorDisplayName:
        donation.anonymous
          ? "Anonyme"
          : (
              donation.donorDisplayName ||
              "Citoyen"
            ),

      serviceFee:
        round2(
          donation.serviceFee
        ),

      pspFee:
        round2(
          donation.pspFee
        ),

      supportAmount:
        round2(
          donation.supportAmount
        ),

      totalPaid:
        round2(
          donation.totalPaid
        ),

      pspReference:
        donation.pspReference ||
        null,

      paymentProvider:
        donation.paymentProvider ||
        null,

      status:
        "paid",

      paidAt:
        donation.paidAt ||
        nowIso()

    });

    item.audit.push({
      at:nowIso(),
      action:"donation_paid",
      donationId:
        donation.id ||
        null,
      amount:
        round2(
          donation.amount
        )
    });

    saveCampaigns(
      items
    );

    ensureHomeTicker();

    return item;
  }

  function openThankYou(
    campaignId,
    payload
  ){

    const item =
      loadCampaigns().find(function(row){
        return row.id === campaignId;
      });

    const count =
      donationCount(item);

    const body = renderBase(`
      <div class="bociteSolidarityThanks">
        MERCI
      </div>

      <div class="bociteSolidarityHearts">
        ❤ ❤ ❤
      </div>

      <div
        class="bociteSolidarityCard"
        style="text-align:center"
      >

        <div>
          Votre don de
          <strong>
            ${safeText(money(payload.donationAmount))}
          </strong>
          est enregistré.
        </div>

        <div style="margin-top:8px">
          Vous êtes la
          <strong>
            ${count}<sup>e</sup>
          </strong>
          personne à participer
          à cet élan solidaire.
        </div>

        <div class="bociteSolidarityMeta">
          Le même merci est adressé à chacun,
          quel que soit le montant donné.
        </div>

      </div>

      <div
        class="bociteSolidarityActions"
        style="justify-content:center"
      >

        <button
          type="button"
          class="bociteSolidarityBtn"
          data-action="share"
        >
          Partager cet appel
        </button>

        <button
          type="button"
          class="bociteSolidarityBtn bociteSolidarityBtnPrimary"
          data-action="campaign"
        >
          Voir la collecte
        </button>

      </div>
    `);

    body
      .querySelector('[data-action="share"]')
      .addEventListener(
        "click",
        function(){
          shareCampaign(
            campaignId
          );
        }
      );

    body
      .querySelector('[data-action="campaign"]')
      .addEventListener(
        "click",
        function(){
          openCampaign(
            campaignId
          );
        }
      );
  }

   /* =========================================================
     MES DEMANDES / ACCOMPAGNEMENT
     ========================================================= */

  function openMyRequests(){

    const items =
      loadCampaigns()
        .slice()
        .sort(function(a,b){
          return new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime();
        });

    const cards =
      items.length

        ? items.map(function(item){

            return `
              <div class="bociteSolidarityCard">

                <h3>
                  ${safeText(item.title)}
                </h3>

                <div>
                  ${safeText(item.city)}
                  —
                  ${safeText(statusLabel(item.status))}
                </div>

                <div class="bociteSolidarityActions">

                  <button
                    type="button"
                    class="bociteSolidarityBtn"
                    data-guidance="${safeText(item.id)}"
                  >
                    Mon accompagnement
                  </button>

                  <button
                    type="button"
                    class="bociteSolidarityBtn"
                    data-view="${safeText(item.id)}"
                  >
                    Voir le dossier
                  </button>

                </div>

              </div>
            `;

          }).join("")

        : '<div class="bociteSolidarityOk">' +
          'Aucune demande enregistrée sur cet appareil.' +
          '</div>';

    const body = renderBase(`
      <div class="bociteSolidarityHead">

        <div>

          <h2 class="bociteSolidarityTitle">
            Mes demandes / accompagnement
          </h2>

        </div>

      </div>

      ${cards}

      <div class="bociteSolidarityActions">

        <button
          type="button"
          class="bociteSolidarityBtn"
          data-action="back"
        >
          Retour
        </button>

      </div>
    `);

    body
      .querySelectorAll("[data-guidance]")
      .forEach(function(btn){

        btn.addEventListener(
          "click",
          function(){

            openGuidance(
              btn.getAttribute("data-guidance")
            );
          }
        );
      });

    body
      .querySelectorAll("[data-view]")
      .forEach(function(btn){

        btn.addEventListener(
          "click",
          function(){

            openCampaign(
              btn.getAttribute("data-view")
            );
          }
        );
      });

    body
      .querySelector('[data-action="back"]')
      .addEventListener(
        "click",
        openHome
      );
  }

  function openGuidance(id){

    const item =
      loadCampaigns().find(function(row){
        return row.id === id;
      });

    if(!item){
      return;
    }

    const guidance =
      getOrBuildGuidance(item);

    const phases = [];

    guidance.tasks.forEach(
      function(task){

        if(
          phases.indexOf(task.phase) < 0
        ){

          phases.push(
            task.phase
          );
        }
      }
    );

    const tasksHtml =
      phases.map(function(phase){

        const rows =
          guidance.tasks
            .filter(function(task){
              return task.phase === phase;
            })
            .map(function(task){

              return `
                <div class="bociteSolidarityTask">

                  <input
                    type="checkbox"
                    data-task="${safeText(task.id)}"
                    ${task.done ? 'checked' : ''}
                  >

                  <div>

                    <strong>
                      ${safeText(task.label)}
                    </strong>

                    <div class="bociteSolidarityHelp">
                      ${safeText(task.why)}
                    </div>

                  </div>

                </div>
              `;

            }).join("");

        return '<div class="bociteSolidarityPhase">' +
          safeText(phase) +
          '</div>' +
          rows;

      }).join("");

    const aidsHtml =
      guidance.possibleAids.map(function(aid){

        return `
          <div class="bociteSolidarityCard">

            <strong>
              ${safeText(aid.name)}
            </strong>

            <div>
              ${safeText(aid.purpose)}
            </div>

            <div class="bociteSolidarityMeta">
              ${safeText(aid.status)}
            </div>

          </div>
        `;

      }).join("");

    const body = renderBase(`
      <div class="bociteSolidarityHead">

        <div>

          <h2 class="bociteSolidarityTitle">
            Mon accompagnement
          </h2>

          <div class="bociteSolidaritySub">
            ${safeText(item.title)}
          </div>

        </div>

      </div>

      <div class="bociteSolidarityOk">

        <strong>
          Je suis dépassé : que dois-je faire maintenant ?
        </strong>

        <br>

        L'agent met en tête les actions les plus urgentes.
        Le reste peut attendre.

      </div>

      <div class="bociteSolidarityCard">

        <h3>
          Mon pense-bête
        </h3>

        ${tasksHtml}

      </div>

      <h3 style="color:#2f5d46;font-size:17px">
        Mes aides possibles
      </h3>

      ${aidsHtml}

      <div class="bociteSolidarityInfo">
        ${safeText(guidance.officialDirectoryStatus)}
      </div>

      <div class="bociteSolidarityActions">

        <button
          type="button"
          class="bociteSolidarityBtn"
          data-action="back"
        >
          Retour
        </button>

      </div>
    `);

    body
      .querySelectorAll("[data-task]")
      .forEach(function(input){

        input.addEventListener(
          "change",
          function(){

            updateGuidanceTask(
              id,
              input.getAttribute("data-task"),
              input.checked
            );
          }
        );
      });

    body
      .querySelector('[data-action="back"]')
      .addEventListener(
        "click",
        openMyRequests
      );
  }

  function openCommunityVotes(){

    runAgentMaintenance();

    const votes =
      loadVotes().filter(function(vote){
        return vote.status === "open";
      });

    const body = renderBase(`
      <div class="bociteSolidarityHead">

        <div>

          <h2 class="bociteSolidarityTitle">
            Votes citoyens
          </h2>

          <div class="bociteSolidaritySub">
            Une nouvelle catégorie juridiquement recevable
            peut être intégrée au règlement
            après 72 h de vote de toute la communauté Bo’CitéArt.
          </div>

        </div>

      </div>

      ${
        votes.length

          ? votes.map(function(vote){

              const campaign =
                loadCampaigns().find(function(row){
                  return row.id === vote.campaignId;
                });

              return `
                <div
                  class="bociteSolidarityCard"
                  data-vote-card="${safeText(vote.campaignId)}"
                >

                  <h3>
                    ${safeText(
                      campaign
                        ? campaign.title
                        : vote.categoryProposal
                    )}
                  </h3>

                  <div>
                    ${
                      campaign
                        ? safeText(campaign.description)
                        : ''
                    }
                  </div>

                  <div class="bociteSolidarityMeta">
                    Fin du vote :
                    ${safeText(formatDate(vote.endsAt))}
                    —
                    ${vote.yes} oui /
                    ${vote.no} non
                  </div>

                  <div class="bociteSolidarityActions">

                    <button
                      class="bociteSolidarityBtn"
                      type="button"
                      data-vote="yes"
                      data-reason="Besoin humain grave et comparable"
                      data-id="${safeText(vote.campaignId)}"
                    >
                      Oui — besoin grave
                    </button>

                    <button
                      class="bociteSolidarityBtn"
                      type="button"
                      data-vote="yes"
                      data-reason="Dépense indispensable et justifiée"
                      data-id="${safeText(vote.campaignId)}"
                    >
                      Oui — dépense indispensable
                    </button>

                    <button
                      class="bociteSolidarityBtn bociteSolidarityBtnDanger"
                      type="button"
                      data-vote="no"
                      data-reason="Hors du périmètre Urgence solidaire"
                      data-id="${safeText(vote.campaignId)}"
                    >
                      Non — hors périmètre
                    </button>

                    <button
                      class="bociteSolidarityBtn bociteSolidarityBtnDanger"
                      type="button"
                      data-vote="no"
                      data-reason="Un autre dispositif paraît plus adapté"
                      data-id="${safeText(vote.campaignId)}"
                    >
                      Non — autre dispositif
                    </button>

                  </div>

                </div>
              `;

            }).join("")

          : '<div class="bociteSolidarityOk">' +
            'Aucun vote ouvert actuellement.' +
            '</div>'
      }

      <div class="bociteSolidarityActions">

        <button
          class="bociteSolidarityBtn"
          type="button"
          data-action="back"
        >
          Retour
        </button>

      </div>
    `);

    body
      .querySelectorAll("[data-vote]")
      .forEach(function(btn){

        btn.addEventListener(
          "click",
          function(){

            try{

              const vote =
                castVote(
                  btn.getAttribute("data-id"),
                  btn.getAttribute("data-vote"),
                  btn.getAttribute("data-reason")
                );

              alert(
                "Votre vote est enregistré : " +
                vote.yes +
                " oui / " +
                vote.no +
                " non."
              );

              openCommunityVotes();

            }catch(error){

              alert(
                error.message ||
                "Vote impossible."
              );
            }
          }
        );
      });

    body
      .querySelector('[data-action="back"]')
      .addEventListener(
        "click",
        openHome
      );
  }

  /* =========================================================
     LIVRE DES SOLIDARITÉS / TRANSPARENCE
     ========================================================= */

  function openSolidarityBook(){

    const closed =
      loadCampaigns().filter(function(item){
        return item.status === STATUS.CLOSED;
      });

    const html =
      closed.length

        ? closed.map(function(item){

            return `
              <div class="bociteSolidarityCard">

                <h3>
                  ${safeText(item.title)}
                </h3>

                <div>
                  ${safeText(item.city)}
                  —
                  ${safeText(money(amountCollected(item)))}
                  réunis
                  —
                  ${donationCount(item)}
                  participants.
                </div>

                <div class="bociteSolidarityMeta">
                  ${safeText(
                    item.closingMessage ||
                    "Collecte terminée."
                  )}
                </div>

              </div>
            `;

          }).join("")

        : '<div class="bociteSolidarityOk">' +
          'Le Livre des solidarités se remplira au fur et à mesure des collectes terminées.' +
          '</div>';

    const body = renderBase(`
      <div class="bociteSolidarityHead">

        <div>

          <h2 class="bociteSolidarityTitle">
            Livre des solidarités Bo’CitéArt
          </h2>

          <div class="bociteSolidaritySub">
            Ce que les citoyens ont rendu possible ensemble.
          </div>

        </div>

      </div>

      ${html}

      <div class="bociteSolidarityActions">

        <button
          class="bociteSolidarityBtn"
          data-action="back"
          type="button"
        >
          Retour
        </button>

      </div>
    `);

    body
      .querySelector('[data-action="back"]')
      .addEventListener(
        "click",
        openHome
      );
  }

  function openTransparencyJournal(){

    const journal =
      loadJournal();

    const votes =
      loadVotes();

    const journalHtml =
      journal.length

        ? journal
            .slice(0,50)
            .map(function(row){

              return `
                <div class="bociteSolidarityCard">

                  <strong>
                    ${safeText(formatDate(row.at))}
                  </strong>

                  <div>
                    ${safeText(
                      row.publicText ||
                      row.type ||
                      "Mise à jour"
                    )}
                  </div>

                </div>
              `;

            }).join("")

        : '<div class="bociteSolidarityOk">' +
          'Aucune entrée de transparence pour le moment.' +
          '</div>';

    const votesHtml =
      votes.length

        ? votes.map(function(vote){

            return `
              <div class="bociteSolidarityCard">

                <strong>
                  Vote de catégorie
                </strong>

                <div>
                  ${safeText(vote.categoryProposal)}
                </div>

                <div class="bociteSolidarityMeta">
                  ${vote.yes} oui
                  —
                  ${vote.no} non
                  —
                  ${safeText(vote.status)}
                </div>

              </div>
            `;

          }).join("")

        : "";

    const body = renderBase(`
      <div class="bociteSolidarityHead">

        <div>

          <h2 class="bociteSolidarityTitle">
            Journal de transparence
          </h2>

          <div class="bociteSolidaritySub">
            Décisions et résultats sans exposer les personnes.
          </div>

        </div>

      </div>

      ${votesHtml}

      ${journalHtml}

      <div class="bociteSolidarityActions">

        <button
          class="bociteSolidarityBtn"
          data-action="back"
          type="button"
        >
          Retour
        </button>

      </div>
    `);

    body
      .querySelector('[data-action="back"]')
      .addEventListener(
        "click",
        openHome
      );
  }

  /* =========================================================
     CLÔTURE / DÉCÈS / REMBOURSEMENTS / MAINTENANCE AGENT
     ========================================================= */

  function buildClosingMessage(item){

    return "Merci à toutes et à tous. Pour « " +
      item.title +
      " » à " +
      item.city +
      ", " +
      donationCount(item) +
      " personnes ont permis de réunir " +
      money(amountCollected(item)) +
      ". Merci pour cet élan de solidarité.";
  }

  function closeCampaign(
    id,
    options
  ){

    options =
      options || {};

    const items =
      loadCampaigns();

    const item =
      items.find(function(row){
        return row.id === id;
      });

    if(!item){

      throw new Error(
        "Collecte introuvable."
      );
    }

    item.status =
      STATUS.CLOSED;

    item.closedAt =
      nowIso();

    item.closingMessage =
      options.message ||
      buildClosingMessage(item);

    item.audit.push({
      at:nowIso(),
      action:"campaign_closed",
      total:amountCollected(item)
    });

    saveCampaigns(
      items
    );

    addJournal({
      type:"campaign_closed",
      campaignId:id,
      publicText:
        "Une collecte a été clôturée et ajoutée au Livre des solidarités."
    });

    ensureHomeTicker();

    return item;
  }

  function reportBeneficiaryDeath(id){

    const items =
      loadCampaigns();

    const item =
      items.find(function(row){
        return row.id === id;
      });

    if(!item){

      throw new Error(
        "Dossier introuvable."
      );
    }

    item.status =
      STATUS.DECEASED_REVIEW;

    item.audit.push({
      at:nowIso(),
      action:"beneficiary_death_reported",
      actionRequired:"notify_psp_specialist"
    });

    saveCampaigns(
      items
    );

    addJournal({
      type:"specialist_financial_review",
      campaignId:id,
      publicText:
        "Une collecte a été suspendue ; le traitement financier est désormais confié au prestataire réglementé compétent."
    });

    ensureHomeTicker();

    return item;
  }

  async function requestRefund(
    paymentId,
    reason
  ){

    const settings =
      getSettings();

    if(
      settings.environment !==
      "production"
    ){

      const ledger =
        loadJson(
          KEYS.paymentLedger,
          []
        );

      const payment =
        ledger.find(function(row){
          return row.id === paymentId;
        });

      if(!payment){

        throw new Error(
          "Paiement introuvable."
        );
      }

      payment.refundRequestedAt =
        nowIso();

      payment.refundReason =
        reason ||
        "demo";

      payment.status =
        "refund_requested";

      saveJson(
        KEYS.paymentLedger,
        ledger
      );

      return {
        status:"refund_requested",
        provider:"DEMO-PSP",
        paymentId:paymentId
      };
    }

    const base =
      String(
        settings.paymentApiBase || ""
      ).replace(
        /\/$/,
        ""
      );

    const response =
      await fetch(
        base + "/payments/refund",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          credentials:"same-origin",

          body:
            JSON.stringify({
              paymentId:paymentId,
              reason:
                reason ||
                "beneficiary_unavailable"
            })
        }
      );

    if(!response.ok){

      throw new Error(
        "Demande de remboursement PSP impossible."
      );
    }

    return response.json();
  }

  function runAgentMaintenance(){

    const items =
      loadCampaigns();

    let changed =
      false;

    items.forEach(
      function(item){

        if(
          item.status ===
          STATUS.PENDING_VOTE
        ){

          finalizeVoteIfDue(
            item.id,
            false
          );
        }

        if(
          item.status === STATUS.LIVE &&
          item.targetAmount > 0 &&
          amountCollected(item) >=
            Number(item.targetAmount || 0)
        ){

          // Léger dépassement accepté.
          // On ferme après le paiement
          // qui franchit l'objectif.

          item.status =
            STATUS.CLOSED;

          item.closedAt =
            nowIso();

          item.closingMessage =
            buildClosingMessage(item);

          item.audit.push({
            at:nowIso(),
            action:"auto_closed_target_reached",
            total:amountCollected(item)
          });

          addJournal({
            type:"campaign_target_reached",
            campaignId:item.id,
            publicText:
              "Une collecte a atteint son objectif et a été clôturée automatiquement."
          });

          changed =
            true;
        }
      }
    );

    if(changed){

      saveCampaigns(
        items
      );
    }

    return items;
  }

  /* =========================================================
     OUTILS DE DÉMONSTRATION / TEST
     ========================================================= */

  function addDemoCampaign(options){

    options =
      options || {};

    const items =
      loadCampaigns();

    const demo = {

      id:
        uid("DEMO"),

      demo:
        true,

      eventType:
        options.eventType ||
        "fire",

      actorType:
        options.actorType ||
        "third_party",

      title:
        options.title ||
        "DÉMONSTRATION — Incendie : aide immédiate à une famille",

      city:
        options.city ||
        getCurrentCity(),

      cityId:
        options.cityId ||
        getCurrentCityId() ||
        null,

      description:
        options.description ||
        "Démonstration du dispositif Urgence solidaire. Cet événement n'est pas réel.",

      publicSummary:
        options.description ||
        "Démonstration du dispositif Urgence solidaire. Cet événement n'est pas réel.",

      immediateNeed:
        options.immediateNeed ||
        "Hébergement temporaire, vêtements et premières nécessités.",

      targetAmount:
        Number(
          options.targetAmount ||
          6000
        ),

      insuranceStatus:
        "unknown",

      proofSummary:
        "Démonstration technique",

      identityVerified:
        true,

      identityReference:
        "DEMO-KYC",

      publicPhotoCount:
        0,

      privateProofCount:
        1,

      urgency:
        options.urgency ||
        {
          immediateShelter:true,
          vitalMedical:false,
          childrenOrVulnerable:true,
          noImmediateSolution:true,
          essentialServiceInterrupted:false,
          collectiveImpact:false,
          deadline72h:true,
          deadline7d:true
        },

      urgencyScore:
        0,

      status:
        STATUS.LIVE,

      createdAt:
        nowIso(),

      publishedAt:
        nowIso(),

      donations:[],

      reports:[],

      financialUpdates:[],

      audit:[
        {
          at:nowIso(),
          action:"demo_campaign_created"
        }
      ]
    };

    demo.urgencyScore =
      calculateUrgencyScore(
        demo
      );

    demo.aiReview = {
      level:"GREEN",
      score:0,
      reasons:[],
      requests:[],
      urgencyScore:
        demo.urgencyScore,
      canAutoPublish:true
    };

    demo.guidance =
      guidanceForCampaign(
        demo
      );

    items.push(
      demo
    );

    saveCampaigns(
      items
    );

    ensureHomeTicker();

    return demo;
  }

  function resetDemoData(){

    Object.keys(KEYS).forEach(
      function(k){

        localStorage.removeItem(
          KEYS[k]
        );
      }
    );

    ensureHomeTicker();
  }

  function getDebugSnapshot(){

    return {

      version:
        VERSION,

      settings:
        getSettings(),

      campaigns:
        loadCampaigns(),

      votes:
        loadVotes(),

      journal:
        loadJournal(),

      paymentLedger:
        loadJson(
          KEYS.paymentLedger,
          []
        )
    };
  }

  /* =========================================================
     API PUBLIQUE
     ========================================================= */

  window.BociteSolidarity = {

    version:
      VERSION,

    STATUS:
      STATUS,

    open:
      openHome,

    openHome:
      openHome,

    openCreateForm:
      openCreateForm,

    openCampaign:
      openCampaign,

    openDonation:
      openDonation,

    openGuidance:
      openGuidance,

    openAllCampaigns:
      openAllCampaigns,

    openCommunityVotes:
      openCommunityVotes,

    analyseSubmission:
      analyseSubmission,

    calculateUrgencyScore:
      calculateUrgencyScore,

    feeBreakdown:
      feeBreakdown,

    getCampaigns:
      loadCampaigns,

    getActiveCampaigns:
      allActiveCampaigns,

    getFeaturedCampaign:
      function(){

        return featuredCampaignForCity(
          getCurrentCity(),
          getCurrentCityId()
        );
      },

    getTickerText:
      tickerText,

    ensureHomeTicker:
      ensureHomeTicker,

    getSettings:
      getSettings,

    setSettings:
      setSettings,

    recordSuccessfulDonation:
      recordSuccessfulDonation,

    requestRefund:
      requestRefund,

    reportBeneficiaryDeath:
      reportBeneficiaryDeath,

    closeCampaign:
      closeCampaign,

    buildClosingMessage:
      buildClosingMessage,

    startCategoryVote:
      startCategoryVote,

    castVote:
      castVote,

    finalizeVoteIfDue:
      finalizeVoteIfDue,

    updateGuidanceTask:
      updateGuidanceTask,

    runAgentMaintenance:
      runAgentMaintenance,

    addDemoCampaign:
      addDemoCampaign,

    resetDemoData:
      resetDemoData,

    debug:
      getDebugSnapshot
  };

  window.openBociteSolidarity =
    openHome;

  function boot(){

    injectStyles();

    ensureHomeTicker();

    runAgentMaintenance();

    try{

      const params =
        new URLSearchParams(
          window.location.search ||
          ""
        );

      const campaignId =
        params.get(
          "solidarity"
        );

      if(campaignId){

        window.setTimeout(
          function(){

            openCampaign(
              campaignId
            );

          },
          0
        );
      }

    }catch(error){}

  }

  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      boot
    );

  }else{

    boot();
  }

  console.log(
    "✅ Bo’CitéArt — Urgence solidaire V3 chargé"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   BO'CITÉART — URGENCE SOLIDAIRE V3
   ========================================================= */

