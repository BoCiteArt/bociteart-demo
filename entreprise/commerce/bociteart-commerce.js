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
   MODULE COMMERCE / ENTREPRISE
   ========================================================= */

function openCommerceModule(){
  openModal("Commerces & Entreprises", `
    <div style="font-weight:900;margin-bottom:8px;">Commerces & Entreprises</div>

    <div class="box" id="commerceEntrepriseChoice" style="text-align:center;">
      <div style="font-weight:900;font-size:18px;margin-bottom:12px;">Choisissez votre espace</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button class="choiceBtn" id="openCommerceSpace" type="button">Commerce</button>
        <button class="choiceBtn" id="openEntrepriseSpace" type="button">Entreprise</button>
      </div>
    </div>

    <div id="commerceSpace" style="display:none;">

    <div class="box">
      <strong>Cadre :</strong> les bocitecoins ne sont ni une monnaie, ni un moyen de paiement, ni une conversion en euros.
      Ils servent de repère local Bo’CitéArt pour encourager la fidélité, la circulation dans la ville et la découverte des commerces partenaires.
    </div>

    <div class="box" style="border-left:6px solid #2f5d46;margin-top:10px;font-size:13px;line-height:1.45;">
      <div style="font-weight:800;margin-bottom:6px;">
        Comment diffuser une publicité dans le grand bandeau
      </div>

      <div>
        Remplissez votre fiche commerce une seule fois. Elle restera ensuite préremplie.
      </div>

      <div style="margin-top:8px;">
        Cliquez sur le grand bandeau publicitaire en haut de l’application,
        puis entrez votre code commerce, votre qr code ou un code de secours.
      </div>

      <div style="margin-top:8px;">
        Vous choisissez ensuite vos dates, votre texte, votre photo/logo,
        puis vous validez la publicité et le paiement associé.
      </div>

      <div class="muted" style="margin-top:8px;">
        En version live, chaque commerce aura son propre compte indépendant,
        lié à sa fiche, son siret/siren, ses informations de facturation
        et son accès sécurisé.
      </div>
    </div>

    <div class="walletBox">
      <div class="walletTitle">Wallet client — BoCitecoins OR</div>
      <div class="walletValue walletGold" id="citizenCoinBalance">37</div>
      <div class="walletSub">
        BoCitecoins disponibles pour échange chez les commerçants partenaires Bo’CitéArt selon les règles locales.
      </div>

      <div style="margin-top:12px;font-weight:900;">Progression vers le prochain palier</div>
      <div style="margin-top:8px;background:#efe4d3;border-radius:999px;overflow:hidden;height:14px;border:2px solid rgba(0,0,0,.08);">
        <div id="walletProgressBar" style="height:100%;width:0%;border-radius:999px;transition:width .25s ease;background:linear-gradient(90deg,#e4c81c 0%, #88b84b 55%, #2f8f46 100%);"></div>
      </div>

      <div id="walletProgressText" class="walletSub" style="margin-top:8px;">Chargement...</div>
      <div id="walletMotivation" class="walletSub" style="margin-top:6px;color:#2f5d46;font-weight:900;">&nbsp;</div>
      <div id="walletExpiryInfo" class="walletSub" style="margin-top:6px;">&nbsp;</div>
    </div>

    <div style="font-weight:900;margin-top:14px;">Paliers d’échange</div>
    <div class="box">
      <ul style="margin:8px 0 0 18px;font-weight:800;">
        <li><strong>12 bocitecoins</strong> : petits commerces partenaires identifiés</li>
        <li><strong>30 bocitecoins</strong> : premier palier d’échange</li>
        <li><strong>50 bocitecoins</strong> : avantage renforcé</li>
        <li><strong>100 bocitecoins</strong> : niveau premium</li>
      </ul>
      <div class="muted" style="margin-top:8px;">
        Les publicités du grand rectangle sont désormais gérées uniquement depuis l’accès central “Publicités & visibilité”.
      </div>
    </div>

   <div style="font-weight:900;margin-top:12px;">Commerces partenaires</div>
<div class="box">
 <div id="demoCommercesList" style="margin-top:12px;display:grid;gap:8px;">
  <div class="muted">Chargement des commerces partenaires...</div>
</div>

    <div class="box" style="margin-top:12px;">
      <div style="font-weight:900;">Accès interne commerce</div>
      <div class="muted" style="margin-top:6px;">
        Gestion commerçant : attribution des bocitecoins, fiche commerçant,
        historique et règles internes.
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
     <button class="choiceBtn" id="toggleCommerceAdminBtn" type="button">
Espace de gestion du commerce
        </button>
      </div>
    </div>

    <div id="commerceAdminPanel" style="display:none;">

      <div style="font-weight:900;margin-top:14px;">Attribution commerçant → client</div>
      <div class="box">
        <div style="margin-top:10px;font-weight:900;">Montant d’achat</div>
        <input class="miniField" id="shopPurchaseAmount" type="number" min="0" step="0.01" placeholder="Ex : 47.00" />

        <div style="margin-top:10px;font-weight:900;">Bocitecoins calculés</div>
        <div class="box" style="background:var(--bg);">
          <strong id="shopCoinsCalc">0</strong> bocitecoin(s) OR à verser
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
         <button class="choiceBtn" id="shopCalcBtn" type="button">
Calculer les Bo'CitéCoins
</button>

<button class="choiceBtn" id="shopScanClientBtn" type="button">
Scanner la carte du client
</button>

<button class="choiceBtn" id="shopCreditClientBtn" type="button">
Confirmer l'attribution
</button>

<button class="choiceBtn" id="shopUndoBtn" type="button" style="background:#fff;">
Annuler l'attribution (60 s)
</button>
        </div>
      </div>

      <div style="font-weight:900;margin-top:12px;">Fiche commerçant / code à scanner</div>
      <div class="box">
        <div style="margin-top:10px;font-weight:900;">Nom du commerce</div>
        <input class="miniField" id="merchantProfileName" placeholder="Nom du commerce">

        <div style="margin-top:10px;font-weight:900;">Adresse</div>
        <input class="miniField" id="merchantProfileAddress" placeholder="Adresse">

        <div style="margin-top:10px;font-weight:900;">Téléphone</div>
        <input class="miniField" id="merchantProfilePhone" placeholder="Téléphone">

        <div style="margin-top:10px;font-weight:900;">Email</div>
        <input class="miniField" id="merchantProfileEmail" placeholder="Email">

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
<button class="choiceBtn" id="merchantProfileSaveBtn" type="button">
Enregistrer mes informations
</button>

<button class="choiceBtn" id="merchantShowQrBtn" type="button">
Afficher mon QR Code commerçant
</button>
        </div>

        <div class="box" style="margin-top:12px;background:var(--bg);">
          <div style="font-weight:900;">Format du code commerçant</div>
          <div class="muted" id="merchantQrPreview" style="margin-top:8px;">
            Aucun code généré pour le moment.
          </div>
        </div>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
        <button class="choiceBtn" id="merchantHistoryExportBtn" type="button" style="background:#fff;">Exporter l'historique</button>
      </div>

    </div>
    </div>
    </div>

   <div id="entrepriseSpace" style="display:none;">

  <style>
    @keyframes entrepriseBandScroll {
      from { transform:translateX(100%); }
      to { transform:translateX(-100%); }
    }

    .entrepriseBand{
      display:block;
      width:100%;
      overflow:hidden;
      margin:7px 0;
      padding:0;
      border:2px solid #2f5d46;
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
      animation:entrepriseBandScroll 70s linear infinite;
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
      border:2px solid #2f5d46;
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
      border:2px solid rgba(0,0,0,.08);
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

  <div style="font-weight:900;font-size:20px;margin:4px 0 10px;">
    Entreprises
  </div>

  <div class="box" style="border-left:6px solid #2f5d46;">
    <strong>Découvrez les entreprises de votre ville.</strong><br><br>

    Retrouvez leurs activités, leurs métiers et leurs savoir-faire.

    La recherche commence toujours dans votre commune avant de s’élargir
    aux communes voisines lorsque cela est nécessaire.
  </div>

  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
    <button
      class="choiceBtn"
      id="openOfficialCompanies"
      type="button">
      Les entreprises de votre ville
    </button>

    <button
      class="choiceBtn"
      id="openEntrepriseDirection"
      type="button">
      Tableau de Direction
    </button>
  </div>

  <button class="entrepriseBand" type="button" data-enterprise-topic="emploi">
    <span class="entrepriseBandText">
      Déposez votre offre • Trouvez la personne près de chez vous •
      <span class="entrepriseBandAction">Cliquez ici…</span>
    </span>
  </button>

  <button class="entrepriseBand" type="button" data-enterprise-topic="fidelisation">
    <span class="entrepriseBandText">
      Attirez • Fidélisez vos salariés autrement •
      <span class="entrepriseBandAction">Cliquez ici…</span>
    </span>
  </button>

  <button class="entrepriseBand" type="button" data-enterprise-topic="developpement">
    <span class="entrepriseBandText">
      Développement de votre entreprise • Nouvelles opportunités •
      <span class="entrepriseBandAction">Cliquez ici…</span>
    </span>
  </button>

  <button class="entrepriseBand" type="button" data-enterprise-topic="mutualisation">
    <span class="entrepriseBandText">
      Réduisez vos charges • Élec • Gaz • Assur. • Tél. •
      <span class="entrepriseBandAction">Cliquez ici…</span>
    </span>
  </button>

  <button class="entrepriseBand" type="button" data-enterprise-topic="visibilite">
    <span class="entrepriseBandText">
      Faites connaître vos métiers • Votre savoir-faire •
      <span class="entrepriseBandAction">Cliquez ici…</span>
    </span>
  </button>

  <button class="entrepriseBand" type="button" data-enterprise-topic="economies">
    <span class="entrepriseBandText">
      Comparez • Choisissez • Validez •
      <span class="entrepriseBandAction">Cliquez ici…</span>
    </span>
  </button>

  <button class="entrepriseBand" type="button" data-enterprise-topic="perennite">
    <span class="entrepriseBandText">
      Préparez l’avenir • Transmission • Reprise •
      <span class="entrepriseBandAction">Cliquez ici…</span>
    </span>
  </button>

  <button class="entrepriseBand" type="button" data-enterprise-topic="mecenat">
    <span class="entrepriseBandText">
      Savez-vous à qui et à quoi sert le mécénat ? •
      <span class="entrepriseBandAction">Cliquez ici…</span>
    </span>
  </button>

  <div
    id="entrepriseTopicPanel"
    class="box"
    style="display:none;margin-top:12px;">

    <div
      id="entrepriseTopicTitle"
      style="font-weight:900;font-size:19px;color:#2f5d46;">
    </div>

    <div
      id="entrepriseTopicText"
      style="margin-top:10px;line-height:1.55;">
    </div>

    <div
      id="entrepriseTopicActions"
      style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
    </div>
  </div>

  <div class="box" style="margin-top:14px;">
    <strong>Vous avez une question précise ?</strong><br><br>

    L’IA Bo’CitéArt répondra en recherchant d’abord les solutions disponibles
    dans votre ville, puis dans les communes voisines avant d’élargir
    la recherche.

    <textarea
      id="entrepriseAiQuestion"
      class="miniField"
      style="min-height:85px;margin-top:10px;"
      placeholder="Exemple : je cherche un électricien, un salarié, un avocat ou une solution pour réduire mes charges.">
    </textarea>

    <button
      class="choiceBtn"
      id="entrepriseAiAskBtn"
      type="button"
      style="margin-top:10px;">
      Poser ma question
    </button>

    <div
      id="entrepriseAiAnswer"
      class="muted"
      style="margin-top:10px;">
    </div>
  </div>

</div>
`);

  setTimeout(()=>{

    const openCommerceSpace = $("openCommerceSpace");
    const openEntrepriseSpace = $("openEntrepriseSpace");
    const commerceSpace = $("commerceSpace");
    const entrepriseSpace = $("entrepriseSpace");

    function showProfessionalSpace(spaceName){
      if(commerceSpace){
        commerceSpace.style.display = spaceName === "commerce" ? "block" : "none";
      }
      if(entrepriseSpace){
        entrepriseSpace.style.display = spaceName === "entreprise" ? "block" : "none";
      }
    }

    if(openCommerceSpace){
      openCommerceSpace.onclick = ()=>showProfessionalSpace("commerce");
    }

   if(openEntrepriseSpace){
      openEntrepriseSpace.onclick = ()=>showProfessionalSpace("entreprise");
    }

  const ENTREPRISE_MUTUALISATION_KEY =
  "bociteart_entreprise_mutualisation_v1";

function loadEntrepriseMutualisation(){
  try{
    const raw =
      localStorage.getItem(ENTREPRISE_MUTUALISATION_KEY);

    const saved = raw ? JSON.parse(raw) : {};

    return {
      electricite:Number(saved.electricite || 17),
      gaz:Number(saved.gaz || 9),
      telephonie:Number(saved.telephonie || 24),
      assurances:Number(saved.assurances || 12),
      mutuelle:Number(saved.mutuelle || 8),
      fournitures:Number(saved.fournitures || 6)
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

function saveEntrepriseMutualisation(data){
  try{
    localStorage.setItem(
      ENTREPRISE_MUTUALISATION_KEY,
      JSON.stringify(data)
    );
  }catch(error){
    console.warn(
      "Enregistrement mutualisation impossible :",
      error
    );
  }
}

function entrepriseOtherTopics(current){
  const topics = [
    ["emploi", "Recherche de personnel"],
    ["fidelisation", "Fidélisation"],
    ["developpement", "Développement"],
    ["mutualisation", "Mutualisation"],
    ["visibilite", "Visibilité"],
    ["economies", "Économies"],
    ["perennite", "Pérennité"],
    ["mecenat", "Mécénat"]
  ];

  return `
    <div class="entrepriseSectionTitle">
      Vous pourriez également être intéressé par
    </div>

    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:9px;">
      ${
        topics
          .filter(item => item[0] !== current)
          .map(item => `
            <button
              class="choiceBtn entrepriseRelatedTopic"
              type="button"
              data-related-topic="${item[0]}">
              ${item[1]}
            </button>
          `)
          .join("")
      }
    </div>
  `;
}

function renderEntrepriseTopic(topicKey){
 window.currentModule = "entreprise";
window.currentEntrepriseScreen = topicKey;
  const panel = $("entrepriseTopicPanel");
  const title = $("entrepriseTopicTitle");
  const text = $("entrepriseTopicText");
  const actions = $("entrepriseTopicActions");

  if(!panel || !title || !text || !actions){
    return;
  }

  const topics = {

    emploi:{
      title:"Vous recherchez du personnel ?",
      html:`
        <div class="box">
          <strong>
            Les habitants de votre ville seront les premiers informés.
          </strong><br><br>

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
          Recruter près de l’entreprise peut déjà réduire les temps
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
          Bo’CitéArt ne se limite pas à proposer des idées :
          il relie progressivement l’entreprise aux solutions
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
          se trouve peut-être déjà dans votre ville.
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

        <p>
          Avant de chercher loin, regardez ce qui existe déjà près de vous.
        </p>

        <div class="box">
          Bo’CitéArt ne crée pas un simple annuaire.
          Il prépare des connexions utiles entre les acteurs du territoire.
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
            Pourquoi continuer à négocier seul lorsqu’il est tout à fait
            possible de se regrouper ?
          </strong><br><br>

          Tout le monde en parle. Peu le font réellement.
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
          Les propositions seront présentées clairement dans le
          Tableau de Direction.
        </p>

        <p>
          Chaque entreprise choisira ensuite la proposition qu’elle souhaite.
          La décision finale lui appartient.
        </p>

        <p>
          Lorsqu’une entreprise confirme définitivement sa participation,
          son engagement permet aussi aux autres participants
          de conserver les conditions obtenues.
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
          Parce qu’avant d’acheter ou de chercher ailleurs,
          les habitants doivent déjà savoir que vous existez.
        </div>

        <p>
          Le commerce en ligne progresse et éloigne progressivement
          une partie des achats des entreprises du territoire.
        </p>

        <p>
          Pourtant, il reste souvent difficile de savoir
          qui fait quoi dans sa propre ville.
        </p>

        <div class="entrepriseSectionTitle">
          Faire connaître votre entreprise crée des leviers
        </div>

        <p>
          L’emploi, le bouche-à-oreille, les partenariats,
          la découverte des métiers, les vocations chez les jeunes
          et la transmission future.
        </p>

        <p>
          Même si vos produits ne s’adressent pas directement
          aux particuliers, les habitants peuvent parler de vous,
          connaître vos métiers ou transmettre votre nom.
        </p>

        <p>
          Chaque année, des entreprises disparaissent faute de repreneur.
          Faire connaître votre activité aujourd’hui peut aussi
          contribuer à préparer demain.
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

        <p>
          La proposition qui réunit le plus grand nombre de confirmations
          peut alors permettre d’enclencher la réservation
          ou la prestation collective.
        </p>

        <div class="box">
          Bo’CitéArt organise. L’entreprise compare et décide.
        </div>

        ${entrepriseOtherTopics("economies")}
      `,
      actions:[
        ["Voir les mutualisations", "mutualisation"],
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
          Cette première approche est souvent réalisée avec votre
          expert-comptable.
        </p>

        <p>
          Il peut comparer votre entreprise avec d’autres structures
          de taille et d’activité proches dans le même bassin économique.
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
          Commencez par en parler discrètement avec vos proches,
          puis avec votre expert-comptable afin d’obtenir
          une première approche chiffrée.
        </p>

        <p>
          La CCI, la CMA et les réseaux professionnels disposent
          également de services consacrés à la transmission.
          Les consulter ne vous engage à rien.
        </p>

        <p>
          Selon votre projet, un avocat spécialisé ou un notaire
          pourra ensuite accompagner la cession, la succession,
          la propriété ou la nue-propriété.
        </p>

        <div class="box">
          Se renseigner avant d’agir permet de découvrir plusieurs chemins
          et de choisir celui qui correspond réellement à votre situation.
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
            Beaucoup d’entreprises connaissent peu le mécénat,
            n’y pensent jamais ou imaginent qu’il est réservé
            aux grandes entreprises.
          </strong><br><br>

          Pourtant, il est accessible à toutes,
          quelle que soit leur taille.
        </div>

        <p>
          Le mécénat permet de soutenir un projet culturel,
          éducatif, sportif, associatif, patrimonial
          ou toute autre action d’intérêt général.
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
          Cette présence discrète peut produire des effets durables :
          emploi, réputation, confiance, bouche-à-oreille,
          fierté des salariés et reconnaissance locale.
        </p>

        <p>
          Sous certaines conditions, le mécénat peut ouvrir droit
          à des avantages fiscaux prévus par la loi.
          Votre expert-comptable précisera les règles
          applicables à votre entreprise.
        </p>

        <div class="box">
          Un geste discret peut semer aujourd’hui
          ce qui grandira demain dans toute la ville.
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

  const topic = topics[topicKey];

  if(!topic){
    return;
  }

  title.textContent = topic.title;
  text.innerHTML = topic.html;
  actions.innerHTML = "";

topic.actions.forEach(action=>{
  const button = document.createElement("button");

  button.className = "choiceBtn";
  button.type = "button";
  button.textContent = action[0];
  button.dataset.entrepriseAction = action[1];

  button.onclick = ()=>{
    handleEntrepriseAction(action[1]);
  };

  actions.appendChild(button);
});

panel.style.display = "block";

panel.querySelectorAll("[data-related-topic]").forEach(button=>{
  button.onclick = ()=>{
    renderEntrepriseTopic(
      button.getAttribute("data-related-topic")
    );
  };
});

if(topicKey === "mutualisation"){
  renderEntrepriseMutualisation();
}

panel.scrollIntoView({
  behavior:"smooth",
  block:"nearest"
});
}

function renderEntrepriseMutualisation(){
  const host = $("entrepriseMutualisationCounters");

  if(!host){
    return;
  }

  const data = loadEntrepriseMutualisation();

  const items = [
    ["electricite", "Électricité", 30],
    ["gaz", "Gaz", 30],
    ["telephonie", "Téléphonie", 30],
    ["assurances", "Assurances", 30],
    ["mutuelle", "Mutuelle", 30],
    ["fournitures", "Fournitures professionnelles", 30]
  ];

  host.innerHTML = items.map(item=>{
    const key = item[0];
    const label = item[1];
    const target = item[2];
    const value = Number(data[key] || 0);

    return `
      <div class="entrepriseCounter">
        <div>
          <strong>${label}</strong><br>
          <span class="muted">
            Objectif conseillé : ${target} participants
          </span>
        </div>

        <div style="text-align:right;">
          <div class="entrepriseCounterValue">
            ${value} / ${target}
          </div>

          <button
            class="choiceBtn entrepriseMutualisationVote"
            type="button"
            data-mutualisation-key="${key}"
            style="margin-top:6px;padding:7px 9px;">
            Je suis intéressé
          </button>
        </div>
      </div>
    `;
  }).join("");

  host.querySelectorAll(".entrepriseMutualisationVote").forEach(button=>{
    button.onclick = ()=>{
      const key =
        button.getAttribute("data-mutualisation-key");

      const current = loadEntrepriseMutualisation();

      current[key] =
        Number(current[key] || 0) + 1;

      saveEntrepriseMutualisation(current);
      renderEntrepriseMutualisation();

      alert(
        "Votre intérêt est enregistré.\n\n" +
        "Le compteur vient d’augmenter. Cette première sélection " +
        "ne constitue pas encore un engagement définitif."
      );
    };
  });
}

function openOfficialCompaniesDirectory(){
  openModal("Les entreprises de votre ville", `
    <div class="box">
      <strong>Annuaire officiel de la commune</strong><br><br>

      Dans la version définitive, cette liste sera alimentée
      automatiquement par les données publiques officielles.
    </div>

    <input
      id="officialCompanySearch"
      class="miniField"
      placeholder="Rechercher un métier ou une entreprise">

    <div
      id="officialCompaniesList"
      style="margin-top:12px;">
    </div>
  `);

  setTimeout(()=>{
    const demoCompanies = [
      {
        name:"Acier Nord",
        activity:"Travaux de métallerie et fabrication industrielle"
      },
      {
        name:"ABC Électricité",
        activity:"Installation électrique pour professionnels et particuliers"
      },
      {
        name:"Bâtir Conseil",
        activity:"Conseil et accompagnement dans le bâtiment"
      },
      {
        name:"Cabinet Horizon",
        activity:"Expertise comptable et accompagnement des entreprises"
      },
      {
        name:"Menuiserie du Centre",
        activity:"Menuiserie intérieure et extérieure"
      },
      {
        name:"Services Techniques du Nord",
        activity:"Maintenance et services aux entreprises"
      }
    ];

    const input = $("officialCompanySearch");
    const list = $("officialCompaniesList");

    function renderCompanies(){
      if(!list){
        return;
      }

      const query =
        input
          ? String(input.value || "").trim().toLowerCase()
          : "";

      const filtered = demoCompanies
        .filter(company =>
          company.name.toLowerCase().includes(query) ||
          company.activity.toLowerCase().includes(query)
        )
        .sort((a,b) =>
          a.name.localeCompare(b.name, "fr")
        );

      list.innerHTML = filtered.length
        ? filtered.map(company => `
            <div class="box">
              <strong>${escapeHtml(company.name)}</strong><br>
              ${escapeHtml(company.activity)}
            </div>
          `).join("")
        : `
            <div class="box">
              Aucun résultat trouvé dans cette démonstration.
            </div>
          `;
    }

    if(input){
      input.oninput = renderCompanies;
    }

    renderCompanies();
  },0);
}

function openEntrepriseDirectionPanel(){
  openModal("Tableau de Direction", `
    <div class="entreprisePrivate">
      <strong>Accès réservé à l’entreprise</strong><br><br>

      Dans la version définitive, cet espace est ouvert automatiquement
      pour chaque professionnel adhérent et reste inaccessible
      aux citoyens et aux autres entreprises.
    </div>

    <div class="entrepriseSectionTitle">
      Aperçu de votre activité
    </div>

    <div class="box">
      Candidatures reçues : <strong>3</strong><br>
      Publicités programmées : <strong>1</strong><br>
      Demandes de devis : <strong>2</strong><br>
      Mutualisations suivies : <strong>4</strong>
    </div>

    <div class="entrepriseSectionTitle">
      Mutualisations
    </div>

    <div id="directionMutualisationPreview"></div>

    <div class="entrepriseSectionTitle">
      Services professionnels
    </div>

    <div class="box">
      <strong>Adhésion annuelle professionnelle</strong><br>
      329 € HT par an.
    </div>

    <div class="box">
      <strong>Fiche enrichie optionnelle</strong><br>
      199 € HT par an.
    </div>

    <div class="box">
      <strong>Communication ponctuelle</strong><br>
      50 € HT par publication ou offre d’emploi.
    </div>

    <div class="muted">
      Ces tarifs sont visibles uniquement dans l’espace professionnel.
    </div>
  `);

  setTimeout(()=>{
    const host = $("directionMutualisationPreview");

    if(!host){
      return;
    }

    const data = loadEntrepriseMutualisation();

    host.innerHTML = `
      <div class="box">
        Électricité :
        <strong>${data.electricite} participants</strong><br>

        Gaz :
        <strong>${data.gaz} participants</strong><br>

        Téléphonie :
        <strong>${data.telephonie} participants</strong><br>

        Assurances :
        <strong>${data.assurances} participants</strong>
      </div>
    `;
  },0);
}

function handleEntrepriseAction(action){
  if(action === "annuaire"){
    openOfficialCompaniesDirectory();
    return;
  }

  if(action === "direction"){
    openEntrepriseDirectionPanel();
    return;
  }

  if(action === "emploi"){
    renderEntrepriseTopic("emploi");
    return;
  }

  if(action === "mutualisation"){
    renderEntrepriseTopic("mutualisation");
    return;
  }

  if(action === "visibilite"){
    renderEntrepriseTopic("visibilite");
    return;
  }

  if(action === "mecenat"){
    renderEntrepriseTopic("mecenat");
    return;
  }

  if(action === "ia"){
    const input = $("entrepriseAiQuestion");

    if(input){
      input.focus();
    }

    return;
  }

  alert(
    "Cette fonction est préparée dans la démonstration.\n\n" +
    "Elle sera raccordée au compte professionnel, aux paiements " +
    "et aux données sécurisées dans la version définitive."
  );
}

document
  .querySelectorAll("[data-enterprise-topic]")
  .forEach(band=>{
    band.onclick = ()=>{
      renderEntrepriseTopic(
        band.getAttribute("data-enterprise-topic")
      );
    };
  });

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
  entrepriseAiAskBtn.onclick = ()=>{
    const input = $("entrepriseAiQuestion");
    const answer = $("entrepriseAiAnswer");

    const question =
      input
        ? String(input.value || "").trim()
        : "";

    if(!question){
      alert("Écrivez votre question.");
      return;
    }

    if(!answer){
      return;
    }

    const lower = question.toLowerCase();

    if(
      lower.includes("électricien") ||
      lower.includes("plombier") ||
      lower.includes("avocat") ||
      lower.includes("comptable")
    ){
      answer.innerHTML = `
        <div class="box">
          Bo’CitéArt recherchera d’abord les professionnels
          présents dans votre commune.<br><br>

          Si aucun résultat ne correspond, la recherche sera élargie
          aux communes voisines puis, seulement si nécessaire,
          à un territoire plus large.<br><br>

          <button
            class="choiceBtn"
            type="button"
            id="aiOpenDirectory">
            Consulter les entreprises de la ville
          </button>
        </div>
      `;

      setTimeout(()=>{
        const button = $("aiOpenDirectory");

        if(button){
          button.onclick =
            openOfficialCompaniesDirectory;
        }
      },0);

      return;
    }

    if(
      lower.includes("charge") ||
      lower.includes("électricité") ||
      lower.includes("gaz") ||
      lower.includes("assurance") ||
      lower.includes("téléphone")
    ){
      answer.innerHTML = `
        <div class="box">
          Commencez par consulter les mutualisations déjà ouvertes
          dans votre ville.<br><br>

          Plus le nombre de participants augmente,
          plus les conditions de négociation peuvent devenir favorables.<br><br>

          <button
            class="choiceBtn"
            type="button"
            id="aiOpenMutualisation">
            Voir les mutualisations
          </button>
        </div>
      `;

      setTimeout(()=>{
        const button = $("aiOpenMutualisation");

        if(button){
          button.onclick = ()=>{
            renderEntrepriseTopic("mutualisation");
          };
        }
      },0);

      return;
    }

    if(
      lower.includes("personnel") ||
      lower.includes("salarié") ||
      lower.includes("recrut")
    ){
      answer.innerHTML = `
        <div class="box">
          Faites connaître votre besoin en priorité
          aux habitants de votre commune.<br><br>

          Les compétences que vous recherchez
          sont souvent déjà près de chez vous.<br><br>

          <button
            class="choiceBtn"
            type="button"
            id="aiOpenEmployment">
            Ouvrir le recrutement local
          </button>
        </div>
      `;

      setTimeout(()=>{
        const button = $("aiOpenEmployment");

        if(button){
          button.onclick = ()=>{
            renderEntrepriseTopic("emploi");
          };
        }
      },0);

      return;
    }

    answer.innerHTML = `
      <div class="box">
        Votre question a bien été prise en compte.<br><br>

        Dans la version définitive, l’IA Bo’CitéArt répondra
        à partir des ressources de votre ville et des services disponibles,
        avant de proposer une recherche plus large.
      </div>
    `;
  };
}

    const toggleCommerceAdminBtn = $("toggleCommerceAdminBtn");
    const commerceAdminPanel = $("commerceAdminPanel");
    const demoCommercesList = $("demoCommercesList");

if(demoCommercesList){
  const demo = typeof getDemoCity === "function" ? getDemoCity() : null;
  const db = window.demoDatabase || null;

  if(demo && demo.mode === "DEMO" && db && Array.isArray(db.commerces) && db.commerces.length){
    demoCommercesList.innerHTML = db.commerces.slice(0, 20).map(c => `
      <div style="font-weight:800;">
        ${escapeHtml(c.nom || "Commerce")}
        <span class="muted">• quartier ${escapeHtml(String(c.quartier || ""))}</span>
      </div>
    `).join("") + `
      <div class="muted" style="margin-top:8px;">
        Affichage de 20 commerces sur ${db.commerces.length} partenaires générés pour la démonstration.
      </div>
    `;
  } else {
    demoCommercesList.innerHTML = `
      <div style="font-weight:800;">Boulangerie Croquet Alex <span class="muted">• bronze</span></div>
      <div style="font-weight:800;">Pharmacie Richardson <span class="muted">• argent</span></div>
      <div style="font-weight:800;">Anaïs Fleurs <span class="muted">• or</span></div>
      <div style="font-weight:800;">Garage Planque <span class="muted">• trophée</span></div>
    `;
  }
}

    if(toggleCommerceAdminBtn && commerceAdminPanel){
      toggleCommerceAdminBtn.onclick = ()=>{
        const isHidden = commerceAdminPanel.style.display === "none" || commerceAdminPanel.style.display === "";
        commerceAdminPanel.style.display = isHidden ? "block" : "none";
        toggleCommerceAdminBtn.textContent = isHidden ? "Fermer l’espace interne commerce" : "Ouvrir l’espace interne commerce";
      };
    }

    const amountInput = $("shopPurchaseAmount");
    const calcOut = $("shopCoinsCalc");
    const calcBtn = $("shopCalcBtn");
    const scanBtn = $("shopScanClientBtn");
    const creditBtn = $("shopCreditClientBtn");
    const undoBtn = $("shopUndoBtn");

    let lastCalculatedCoins = 0;
    let lastClientScanned = false;
    let lastCreditTx = null;
    let undoDeadlineTs = 0;

    const computeCoins = ()=>{
      const amount = Number(amountInput ? amountInput.value : 0);
      lastCalculatedCoins = Number.isFinite(amount) && amount >= 0 ? Math.floor(amount / 10) : 0;
      if(calcOut) calcOut.textContent = String(lastCalculatedCoins);
    };

    if(calcBtn){
      calcBtn.onclick = ()=>{
        computeCoins();
        alert("Calcul effectué.");
      };
    }

    if(scanBtn){
      scanBtn.onclick = ()=>{
        computeCoins();
        lastClientScanned = true;
        alert("Scan client simulé.");
      };
    }

    if(creditBtn){
      creditBtn.onclick = ()=>{
        computeCoins();

        if(!lastClientScanned){
          alert("Scanne d’abord le client.");
          return;
        }

        if(lastCalculatedCoins <= 0){
          alert("Aucun bocitecoin à verser pour ce montant.");
          return;
        }

        const w = loadCitizenWallet();
        const before = Number(w.or || 0);
        const after = before + lastCalculatedCoins;

        saveCitizenWallet({ or: after });

        lastCreditTx = {
          previous: before,
          resulting: after,
          amount: lastCalculatedCoins
        };

        undoDeadlineTs = Date.now() + 60000;
        lastClientScanned = false;

        const bal = $("citizenCoinBalance");
        if(bal) bal.textContent = after;

        alert(lastCalculatedCoins + " bocitecoin(s) OR versé(s) au client. Correction possible pendant 60 secondes.");
      };
    }

    if(undoBtn){
      undoBtn.onclick = ()=>{
        if(!lastCreditTx){
          alert("Aucune opération récente à corriger.");
          return;
        }

        if(Date.now() > undoDeadlineTs){
          alert("Délai de correction dépassé.");
          return;
        }

        saveCitizenWallet({ or: Math.max(0, Number(lastCreditTx.previous || 0)) });

        const bal = $("citizenCoinBalance");
        if(bal) bal.textContent = Number(lastCreditTx.previous || 0);

        lastCreditTx = null;

        alert("Dernière attribution annulée.");
      };
    }

    const MERCHANT_PROFILE_KEY = "bociteart_merchant_profile_v1";

    function loadMerchantProfile(){
      try{
        const raw = localStorage.getItem(MERCHANT_PROFILE_KEY);
        return raw ? JSON.parse(raw) : { shopName:"", address:"", phone:"", email:"" };
      }catch(e){
        return { shopName:"", address:"", phone:"", email:"" };
      }
    }

    function saveMerchantProfile(obj){
      try{
        localStorage.setItem(MERCHANT_PROFILE_KEY, JSON.stringify(obj));
      }catch(e){}
    }

    function buildMerchantProfilePayload(){
      const p = loadMerchantProfile();
      return {
        type: "merchant_profile",
        shopName: p.shopName || "",
        address: p.address || "",
        phone: p.phone || "",
        email: p.email || ""
      };
    }

    const merchantProfileName = $("merchantProfileName");
    const merchantProfileAddress = $("merchantProfileAddress");
    const merchantProfilePhone = $("merchantProfilePhone");
    const merchantProfileEmail = $("merchantProfileEmail");
    const merchantProfileSaveBtn = $("merchantProfileSaveBtn");
    const merchantShowQrBtn = $("merchantShowQrBtn");
    const merchantQrPreview = $("merchantQrPreview");

    const profile = loadMerchantProfile();

    if(merchantProfileName) merchantProfileName.value = profile.shopName || "";
    if(merchantProfileAddress) merchantProfileAddress.value = profile.address || "";
    if(merchantProfilePhone) merchantProfilePhone.value = profile.phone || "";
    if(merchantProfileEmail) merchantProfileEmail.value = profile.email || "";

    function refreshMerchantQrPreview(){
      if(!merchantQrPreview) return;
      merchantQrPreview.textContent = JSON.stringify(buildMerchantProfilePayload(), null, 2);
    }

    refreshMerchantQrPreview();

  if(merchantProfileSaveBtn){
  merchantProfileSaveBtn.onclick = ()=>{
    const data = {
      shopName: merchantProfileName ? String(merchantProfileName.value || "").trim() : "",
      address: merchantProfileAddress ? String(merchantProfileAddress.value || "").trim() : "",
      phone: merchantProfilePhone ? String(merchantProfilePhone.value || "").trim() : "",
      email: merchantProfileEmail ? String(merchantProfileEmail.value || "").trim() : ""
    };

    if(!data.shopName){
      alert("Renseigne au minimum le nom du commerce.");
      return;
    }

    saveMerchantProfile(data);
    refreshMerchantQrPreview();
    alert("Fiche commerçant enregistrée.");
  };
}

if(merchantShowQrBtn){
  merchantShowQrBtn.onclick = ()=>{
    const payload = buildMerchantProfilePayload();

    if(!payload.shopName){
      alert("Enregistre d’abord la fiche commerçant.");
      return;
    }

    refreshMerchantQrPreview();
    alert("Code commerçant à scanner :\n\n" + JSON.stringify(payload, null, 2));
  };
}

const merchantHistoryExportBtn = $("merchantHistoryExportBtn");

if(merchantHistoryExportBtn){
  merchantHistoryExportBtn.onclick = ()=>{
    const exportObj = {
      exported_at_fr: new Date().toLocaleString("fr-FR"),
      merchant_profile: loadMerchantProfile(),
      citizen_wallet_or: Number(loadCitizenWallet().or || 0)
    };

    const exportText =
      "HISTORIQUE COMMERCE — EXPORT DÉMO\n\n" +
      JSON.stringify(exportObj, null, 2);

    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(exportText)
        .then(()=>alert("Historique commerce copié."))
        .catch(()=>alert(exportText));
    }else{
      alert(exportText);
    }
  };
}

const xb = $("xBtn");
if(xb && xb.focus) xb.focus();

},0);

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
