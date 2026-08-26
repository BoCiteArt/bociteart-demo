/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   CHEF D'ORCHESTRE UNIQUE DU PARCOURS

   1. INFORMATIONS LÉGALES
   2. INTRODUCTION
   3. CRÉATION DU COMPTE
   4. SYNOPTIQUE
   5. APPLICATION OFFICIELLE

   RÈGLE ESSENTIELLE :
   → seul ce fichier décide de l'étape suivante ;
   → aucun écran ne doit ouvrir directement un autre écran ;
   → aucun onglet existant de l'application n'est modifié.
   ========================================================= */

(function initBociteartStart(){

  "use strict";

  if(window.BociteStart){
    return;
  }

  /* =====================================================
     VERSION DU PARCOURS
     ===================================================== */

  const JOURNEY_VERSION =
    "8";

  /* =====================================================
     MODE PRÉSENTATION

     Avec ?presentation=1 dans l'adresse :
     le parcours complet recommence à chaque ouverture.

     Sans ce paramètre :
     le parcours apparaît seulement à la première utilisation.
     ===================================================== */

  const PRESENTATION_MODE =
    new URLSearchParams(
      window.location.search
    ).get("presentation") === "1";
   
  const STORAGE = {
    session:
      "bociteart_entry_session_v8",

    completed:
      "bociteart_entry_completed_v8"
  };

  const STEPS = {
    legal:
      "legal",

    introduction:
      "introduction",

    registration:
      "registration",

    synoptique:
      "synoptique",

    application:
      "application"
  };

  let currentStep =
    "";

  let transitionLocked =
    false;

  /* =====================================================
     STOCKAGE
     ===================================================== */

  function safeParse(
    value,
    fallback
  ){

    try{

      return JSON.parse(value);

    }catch(error){

      return fallback;
    }
  }

  function getStorageItem(key){

    try{

      return localStorage.getItem(key);

    }catch(error){

      return null;
    }
  }

  function setStorageItem(
    key,
    value
  ){

    try{

      localStorage.setItem(
        key,
        value
      );

      return true;

    }catch(error){

      console.warn(
        "Bo'CitéArt : stockage du parcours indisponible.",
        error
      );

      return false;
    }
  }

  function removeStorageItem(key){

    try{

      localStorage.removeItem(key);

      return true;

    }catch(error){

      return false;
    }
  }

  /* =====================================================
     ÉTAT DU PARCOURS
     ===================================================== */

  function getSession(){

    const saved =
      getStorageItem(
        STORAGE.session
      );

    return saved
      ? safeParse(saved, null)
      : null;
  }

  function saveSession(step){

    const session = {
      version:
        JOURNEY_VERSION,

      step:
        step,

      updatedAt:
        new Date().toISOString()
    };

    setStorageItem(
      STORAGE.session,
      JSON.stringify(session)
    );

    currentStep =
      step;

    return session;
  }

  function getCompletion(){

    const saved =
      getStorageItem(
        STORAGE.completed
      );

    return saved
      ? safeParse(saved, null)
      : null;
  }

  function journeyCompleted(){

    const completion =
      getCompletion();

    return Boolean(
      completion &&
      completion.completed === true &&
      completion.version ===
        JOURNEY_VERSION
    );
  }

  function saveCompletion(){

    const completion = {
      completed:true,

      version:
        JOURNEY_VERSION,

      completedAt:
        new Date().toISOString()
    };

    setStorageItem(
      STORAGE.completed,
      JSON.stringify(completion)
    );

    saveSession(
      STEPS.application
    );

    return completion;
  }

  /* =====================================================
     FERMETURE DES ÉCRANS DU NOUVEAU PARCOURS
     ===================================================== */

  function closeKnownOverlay(id){

    const element =
      document.getElementById(id);

    if(element){
      element.remove();
    }
  }

  function closeAllEntryScreens(){

    if(
      window.BociteLegal &&
      typeof window.BociteLegal.close ===
        "function"
    ){

      window.BociteLegal.close();
    }

    if(
      window.BociteIntroduction &&
      typeof window.BociteIntroduction.close ===
        "function"
    ){

      window.BociteIntroduction.close();
    }

    if(
      window.BoCiteArtRegistration &&
      typeof window.BoCiteArtRegistration.close ===
        "function"
    ){

      window.BoCiteArtRegistration.close();
    }

    if(
      window.BociteSynoptique &&
      typeof window.BociteSynoptique.close ===
        "function"
    ){

      window.BociteSynoptique.close();
    }

    closeKnownOverlay(
      "bociteLegalOverlay"
    );

    closeKnownOverlay(
      "bociteIntroductionOverlay"
    );

    closeKnownOverlay(
      "bociteRegistrationOverlay"
    );

    closeKnownOverlay(
      "bociteSynoptiqueOverlay"
    );
  }

  /* =====================================================
     VERROU DE TRANSITION
     Empêche un double clic d'ouvrir deux étapes.
     ===================================================== */

  function runTransition(callback){

    if(transitionLocked){
      return;
    }

    transitionLocked =
      true;

    try{

      callback();

    }finally{

      window.setTimeout(
        function(){

          transitionLocked =
            false;
        },
        250
      );
    }
  }

  /* =====================================================
     ÉTAPE 1 — INFORMATIONS LÉGALES
     ===================================================== */

  function openLegal(){

    runTransition(
      function(){

        closeAllEntryScreens();

        saveSession(
          STEPS.legal
        );

        if(
          window.BociteLegal &&
          typeof window.BociteLegal.open ===
            "function"
        ){

          window.BociteLegal.open();
          return;
        }

        console.error(
          "Bo'CitéArt : le module bociteart-legal.js n'est pas disponible."
        );
      }
    );
  }

  /* =====================================================
     ÉTAPE 2 — INTRODUCTION
     ===================================================== */

  function openIntroduction(){

    runTransition(
      function(){

        closeAllEntryScreens();

        saveSession(
          STEPS.introduction
        );

        if(
          window.BociteIntroduction &&
          typeof window.BociteIntroduction.open ===
            "function"
        ){

          window.BociteIntroduction.open();
          return;
        }

        console.error(
          "Bo'CitéArt : le module bociteart-introduction.js n'est pas disponible."
        );
      }
    );
  }

  /* =====================================================
     ÉTAPE 3 — CRÉATION DU COMPTE
     ===================================================== */

  function openRegistration(){

    runTransition(
      function(){

        closeAllEntryScreens();

        saveSession(
          STEPS.registration
        );

        if(
          window.BoCiteArtRegistration &&
          typeof window.BoCiteArtRegistration.open ===
            "function"
        ){

          window.BoCiteArtRegistration.open();
          return;
        }

        console.error(
          "Bo'CitéArt : le module bociteart-registration.js n'est pas disponible."
        );
      }
    );
  }

  /* =====================================================
     ÉTAPE 4 — SYNOPTIQUE
     ===================================================== */

  function openSynoptique(){

    runTransition(
      function(){

        closeAllEntryScreens();

        saveSession(
          STEPS.synoptique
        );

        if(
          window.BociteSynoptique &&
          typeof window.BociteSynoptique.open ===
            "function"
        ){

          window.BociteSynoptique.open();
          return;
        }

        console.error(
          "Bo'CitéArt : le module bociteart-synoptique.js n'est pas disponible."
        );
      }
    );
  }

  /* =====================================================
     ÉTAPE 5 — APPLICATION OFFICIELLE
     ===================================================== */

  function openApplication(){

    closeAllEntryScreens();

    saveCompletion();

    document.documentElement.style
      .removeProperty("overflow");

    document.body.style
      .removeProperty("overflow");

    window.scrollTo(
      0,
      0
    );

    /*
      Aucun espace particulier n'est ouvert ici.

      L'application officielle déjà présente
      dans index.html reste affichée sous les écrans
      de la porte d'entrée.

      Le parcours n'envoie donc pas l'utilisateur
      directement vers Entreprise, Commerce
      ou un autre onglet.
    */

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:application-ready",
        {
          detail:{
            journeyVersion:
              JOURNEY_VERSION,

            completedAt:
              new Date().toISOString()
          }
        }
      )
    );

    console.log(
      "✅ Parcours terminé — application officielle affichée"
    );
  }

  /* =====================================================
     RÉCEPTION DES VALIDATIONS
     ===================================================== */

  function handleLegalCompleted(){

    if(
      currentStep !==
      STEPS.legal
    ){
      return;
    }

    openIntroduction();
  }

  function handleIntroductionCompleted(){

    if(
      currentStep !==
      STEPS.introduction
    ){
      return;
    }

    openRegistration();
  }

/* =========================================================
   ÇA COMMENCE ICI
   VALIDATION FICHE → INTRODUCTION DU PROFIL → SYNOPTIQUE
   ========================================================= */

function handleRegistrationCompleted(event){

  if(
    currentStep !==
    STEPS.registration
  ){
    return;
  }


  const detail =
    event &&
    event.detail
      ? event.detail
      : null;


  const category =
    detail &&
    detail.category
      ? detail.category
      : "";


  /*
    La fiche vient d'être remplie.

    On présente d'abord l'introduction
    correspondant au profil.

    Ensuite seulement :
    passage au synoptique.
  */

  if(
    window.BociteRoleIntroductions &&
    typeof window.BociteRoleIntroductions
      .openForCategory ===
        "function"
  ){

    window.BociteRoleIntroductions
      .openForCategory(
        category,
        function(){

          openSynoptique();

        }
      );

    return;
  }


  /*
    Sécurité :
    si le module des introductions
    n'est pas disponible,
    le parcours continue normalement.
  */

  openSynoptique();

}

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
  function handleSynoptiqueCompleted(){

    if(
      currentStep !==
      STEPS.synoptique
    ){
      return;
    }

    openApplication();
  }

  document.addEventListener(
    "bociteart:legal-completed",
    handleLegalCompleted
  );

  document.addEventListener(
    "bociteart:introduction-completed",
    handleIntroductionCompleted
  );

  document.addEventListener(
    "bociteart:registration-completed",
    handleRegistrationCompleted
  );

  document.addEventListener(
    "bociteart:synoptique-completed",
    handleSynoptiqueCompleted
  );

  /* =====================================================
     REPRISE DU PARCOURS
     ===================================================== */

function resume(){

  /*
    MODE PRÉSENTATION :
    le parcours complet recommence
    depuis les informations légales.
  */

  if(PRESENTATION_MODE){

    removeStorageItem(
      STORAGE.session
    );

    removeStorageItem(
      STORAGE.completed
    );

    currentStep =
      "";

    openLegal();

    console.log(
      "✅ Parcours complet affiché"
    );

    return;
  }

  /*
    MODE UTILISATEUR NORMAL :
    après la première validation complète,
    l'application s'ouvre directement.
  */

 if(journeyCompleted()){

  openApplication();

  return;
}

  const session =
    getSession();

  const savedStep =
    session &&
    session.version ===
      JOURNEY_VERSION
        ? session.step
        : "";

  switch(savedStep){

    case STEPS.introduction:

      openIntroduction();
      break;

    case STEPS.registration:

      openRegistration();
      break;

    case STEPS.synoptique:

      openSynoptique();
      break;

    case STEPS.legal:
    default:

      openLegal();
      break;
  }
}
  /* =====================================================
     RÉINITIALISATION DE TEST
     ===================================================== */

  function resetJourney(){

    removeStorageItem(
      STORAGE.session
    );

    removeStorageItem(
      STORAGE.completed
    );

    currentStep =
      "";

    closeAllEntryScreens();

    openLegal();

    console.log(
      "✅ Parcours Bo'CitéArt réinitialisé"
    );
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteStart = {
    resume:
      resume,

    reset:
      resetJourney,

    openLegal:
      openLegal,

    openIntroduction:
      openIntroduction,

    openRegistration:
      openRegistration,

    openSynoptique:
      openSynoptique,

    openApplication:
      openApplication,

    getCurrentStep:
      function(){

        return currentStep;
      },

    journeyCompleted:
      journeyCompleted,

    storageKeys:
      Object.assign(
        {},
        STORAGE
      ),

    version:
      JOURNEY_VERSION
  };

  /* =====================================================
     DÉMARRAGE UNIQUE
     ===================================================== */

  function startJourney(){

    window.setTimeout(
      resume,
      0
    );
  }

  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      startJourney,
      {
        once:true
      }
    );

  }else{

    startJourney();
  }

  console.log(
    "✅ Chef d'orchestre Bo'CitéArt V8 chargé"
  );

})();

/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — COMPTE + AIDE
   INTRODUCTION GÉNÉRALE + 9 COURRIERS COMPLETS

   AJOUT UNIQUEMENT
   RIEN D'EXISTANT N'EST SUPPRIMÉ

   VERSION 25/08/2026
   ========================================================= */

(function installBociteCompteAideCourriersComplets(){

  "use strict";

  if(window.__bociteCompteAideCourriersCompletsV1){
    return;
  }

  window.__bociteCompteAideCourriersCompletsV1 = true;


  const COURRIERS_HTML = `

    <style>

      #bociteCompteAideCourriersCompletsV1{
        margin-top:22px;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.55;
      }

      #bociteCompteAideCourriersCompletsV1 p{
        margin:0 0 12px 0;
        color:#111111;
        font-size:14px;
        font-weight:400;
        line-height:1.55;
      }

      #bociteCompteAideCourriersCompletsV1 strong{
        font-weight:700;
      }

      #bociteCompteAideCourriersCompletsV1 .bociteIntroTitle,
      #bociteCompteAideCourriersCompletsV1 .bociteCourrierTitle{
        color:#2f5d46;
        font-size:17px;
        font-weight:700;
        line-height:1.35;
        margin:0 0 15px 0;
      }

      #bociteCompteAideCourriersCompletsV1 .bociteSousTitre{
        color:#2f5d46;
        font-size:16px;
        font-weight:700;
        line-height:1.35;
        margin:18px 0 12px 0;
      }

      #bociteCompteAideCourriersCompletsV1 .bociteSeparator{
        height:1px;
        background:rgba(47,93,70,.35);
        margin:28px 0;
      }

      #bociteCompteAideCourriersCompletsV1 .bociteRights{
        font-size:14px;
        font-weight:400;
      }

    </style>


    <div id="bociteCompteAideCourriersCompletsV1">


      <!-- =====================================================
           INTRODUCTION GÉNÉRALE VALIDÉE
           ===================================================== -->

      <div class="bociteIntroTitle">
        Bienvenue dans Bo’CitéArt
      </div>

      <p>
        Avant d’entrer, prenez simplement quelques instants pour lire cette introduction.
      </p>

      <p>
        Bo’CitéArt a été construit autour d’une idée simple :
      </p>

      <p>
        <strong>ce que nous regardons séparément peut parfois prendre un tout autre sens lorsqu’on commence à le regarder ensemble.</strong>
      </p>

      <p>
        Dans l’application, vous découvrirez plusieurs espaces, chacun accompagné de sa propre introduction.
      </p>

      <p>
        Chacune vous montrera un regard différent.
      </p>

      <p>
        Ne vous arrêtez pas seulement à celui qui vous concerne directement.
      </p>

      <p>
        En découvrant aussi la réalité des autres, certaines choses prendront progressivement un autre sens.
      </p>

      <p>
        <strong>C’est en reliant ces différents regards que l’ensemble commencera véritablement à se révéler.</strong>
      </p>

      <p>
        Vous n’avez rien à apprendre par cœur et aucun parcours ne vous sera imposé.
      </p>

      <p>
        Lors de votre première découverte, ces introductions vous seront présentées naturellement, au bon moment.
      </p>

      <p>
        Une fois lues, elles ne reviendront plus automatiquement.
      </p>

      <p>
        Vous pourrez simplement les relire plus tard, si vous le souhaitez, dans le petit onglet <strong>« Compte + aide »</strong>, situé en bas à droite de l’application, où vous trouverez également d’autres points utiles et importants pour <strong>mieux protéger votre accès, vous accompagner et découvrir progressivement les différents services mis à votre disposition.</strong>
      </p>

      <p>
        <strong>Ensemble, toutes ces introductions vous permettront peu à peu de faire la couture complète de ce nouveau monde qui se construit désormais avec vous.</strong>
      </p>

      <p>
        Ensuite, laissez votre curiosité, votre ressenti et votre intuition faire le reste.
      </p>

      <div class="bociteSousTitre">
        Pourquoi certaines choses ne sont-elles pas expliquées ?
      </div>

      <p>
        Bo’CitéArt souhaite permettre à chacun de comprendre son esprit, ce qu’il peut apporter et la place qu’il peut y trouver.
      </p>

      <p>
        Mais son fonctionnement repose aussi sur un savoir-faire qui doit rester protégé.
      </p>

      <p>
        Vous découvrirez donc les portes qui s’ouvrent, les possibilités et ce qu’elles peuvent apporter, sans que tous les mécanismes qui permettent d’y parvenir soient dévoilés.
      </p>

      <p>
        <strong>On montre les portes, on ne montre pas les engrenages.</strong>
      </p>

      <p>
        Il n’est donc pas nécessaire de tout comprendre maintenant.
      </p>

      <p>
        Au contraire.
      </p>

      <p>
        <strong>Entrez, découvrez, observez… et laissez peu à peu l’ensemble prendre son sens.</strong>
      </p>


      <div class="bociteSeparator"></div>


      <!-- =====================================================
           1 — COMMERCES & ENTREPRISES
           ===================================================== -->

      <div class="bociteCourrierTitle">
        1 — COMMERCES & ENTREPRISES — VOTRE PLACE DANS BO’CITÉART
      </div>

      <p>
        Ces courriers sont volontairement lisibles par tous.
      </p>

      <p>
        Bo’CitéArt relie beaucoup de sujets et d’acteurs. Il est impossible de tout expliquer dans une seule lettre lisible sur un téléphone. J’ai donc choisi d’en répartir les différentes facettes d’un courrier à l’autre.
      </p>

      <p>
        La même logique existe dans l’application : la majorité des univers reste ouverte à tous pour découvrir ce que font les autres, y trouver des idées utiles et surtout relier les choses et les gens.
      </p>

      <p>
        Seuls les espaces privés, les informations confidentielles et certains outils propres à chacun sont protégés.
      </p>

      <p>
        Madame, Monsieur,
      </p>

      <p>
        Commerçant, artisan, dirigeant d’entreprise ou autre professionnel, vous êtes connu de vos clients, de vos partenaires et de votre environnement professionnel.
      </p>

      <p>
        Mais êtes-vous certain d’être réellement connu dans toute votre commune et sur votre territoire ?
      </p>

      <p>
        C’est aussi de ce constat que part Bo’CitéArt.
      </p>

      <p>
        Vos activités diffèrent, mais beaucoup de vos besoins se rejoignent. C’est pourquoi Bo’CitéArt vous propose une même porte d’entrée, avant que chacun retrouve ce qui correspond davantage à sa réalité.
      </p>

      <p>
        Prenons simplement l’exemple du recrutement.
      </p>

      <p>
        Nous définissons un profil, publions une offre et lançons en quelque sorte une bouteille à la mer.
      </p>

      <p>
        Le bon profil peut être là, mais la réussite d’une collaboration dépend aussi de la distance, des horaires, de la vie familiale, de l’environnement de travail et de la connaissance réelle de l’entreprise.
      </p>

      <p>
        Mieux faire connaître votre activité en amont peut donc aider un candidat à se projeter autrement.
      </p>

      <p>
        <strong>Bien souvent, le recrutement de demain commence avant même la publication d’une annonce.</strong>
      </p>

      <p>
        L’annuaire professionnel Bo’CitéArt participe à cette logique : rendre plus visibles les commerces, entreprises, métiers, savoir-faire et compétences présents autour de nous.
      </p>

      <p>
        Un citoyen ou un candidat pourra également découvrir des professionnels et utiliser les possibilités de candidature prévues dans l’application.
      </p>

      <p>
        Se faire connaître, c’est aussi montrer ce que l’on ne voit pas derrière une vitrine, un atelier, un comptoir ou les murs d’un établissement.
      </p>

      <p>
        Les jeunes ont eux aussi beaucoup à gagner à mieux découvrir les métiers, les savoir-faire et les réalités professionnelles de leur territoire.
      </p>

      <p>
        <strong>« Je ne savais même pas que ce métier existait ici. »</strong>
      </p>

      <p>
        Encore faut-il leur avoir donné suffisamment de choses à découvrir pour pouvoir choisir.
      </p>

      <p>
        Et ce n’est qu’un exemple.
      </p>

      <p>
        Visibilité, développement, compétences, nouveaux contacts professionnels, pistes d’économies, pérennité, réactivité, mécénat autrement… d’autres possibilités vous attendent dans l’application.
      </p>

      <p>
        L’abonnement professionnel ouvre l’accès aux services et outils qui lui sont associés dans votre espace privé.
      </p>

      <p>
        Il est volontairement conçu pour rester accessible et surtout avoir du sens : apporter des services utiles, des avantages concrets et ouvrir d’autres possibilités.
      </p>

      <p>
        J’ai moi-même, comme beaucoup d’entre vous, eu la tête dans le guidon pendant des années.
      </p>

      <p>
        Avec le recul, j’aurais aimé connaître plus tôt certaines choses et regarder certains sujets sous d’autres angles.
      </p>

      <p>
        C’est aussi de cette expérience qu’est né Bo’CitéArt : rendre plus visibles, plus simples d’accès et surtout mieux reliées des possibilités utiles qui existent autour de nous.
      </p>

      <p>
        Ce courrier vous en donne quelques clés.
      </p>

      <p>
        Votre espace Commerce ou Entreprise vous permettra d’aller beaucoup plus loin.
      </p>

      <p>
        À vous maintenant de le découvrir.
      </p>

<!-- =====================================================
     ÇA COMMENCE ICI
     RAPPEL COMPTE + AIDE
     ===================================================== -->

<p>
  <strong>Si vous souhaitez relire cette fiche à tout moment, ouvrez simplement l’onglet « Compte + aide », situé en bas à droite de l’application. En descendant un peu dans la page, vous retrouverez cette fiche ainsi que toutes les autres, présentées à la suite selon les différentes rubriques, tuiles ou univers concernés.</strong>
</p>

<!-- =====================================================
     ÇA FINIT ICI
     ===================================================== -->

      <p>
        Bienvenue dans Bo’CitéArt.
      </p>

      <p>
        <strong>Bo’CitéArt : le bon sens, relié.</strong>
      </p>

      <p class="bociteRights">
        © Jean-Michel Brulé / Bo’CitéArt 2025 — Tous droits réservés.
      </p>

      <p class="bociteRights">
        Dépôts INPI • e-Soleau • EUIPO — Reproduction ou utilisation non autorisée des éléments protégés interdite.
      </p>


      <div class="bociteSeparator"></div>


      <!-- =====================================================
           2 — MAIRIE & ÉLUS
           ===================================================== -->

      <div class="bociteCourrierTitle">
        2 — MAIRIE & ÉLUS — VOTRE PLACE DANS BO’CITÉART
      </div>

      <p>
        Ces courriers sont volontairement lisibles par tous.
      </p>

      <p>
        Bo’CitéArt relie beaucoup de sujets et d’acteurs. Il est impossible de tout expliquer dans une seule lettre lisible sur un téléphone. J’ai donc choisi d’en répartir les différentes facettes d’un courrier à l’autre.
      </p>

      <p>
        La majorité des univers reste ouverte à tous pour découvrir, comprendre et mieux relier les acteurs de la ville.
      </p>

      <p>
        Les espaces privés et les informations qui doivent rester confidentielles sont protégés.
      </p>

      <p>
        Madame, Monsieur,
      </p>

      <p>
        Merci tout d’abord pour la confiance accordée à Bo’CitéArt.
      </p>

      <p>
        Bo’CitéArt a été pensé pour les villes, mais certainement pas pour leur imposer un modèle.
      </p>

      <p>
        Son architecture est le résultat d’un long travail transversal destiné à mieux relier les forces qui existent déjà dans une commune : habitants, commerces, entreprises, écoles, associations, sport, culture, services et mairie.
      </p>

      <p>
        La ville reste maîtresse de ses décisions.
      </p>

      <p>
        Bo’CitéArt veille à préserver la cohérence de sa méthode et de sa stratégie tout en adaptant son déploiement aux réalités du territoire.
      </p>

      <p>
        L’objectif est simple : permettre à davantage d’activité, de compétences, de participation et de richesse de rester, circuler et se développer localement.
      </p>

      <p>
        Bo’CitéArt permettra aussi d’observer ce que cette dynamique produit : participation, découvertes, visibilité des acteurs locaux, emploi, compétences et autres résultats utiles à la commune.
      </p>

      <p>
        La mairie n’a pas vocation à recevoir les données personnelles individuelles des utilisateurs.
      </p>

      <p>
        Bo’CitéArt ne traite que les informations nécessaires au fonctionnement, à la sécurité et à l’amélioration des services utilisés. Les analyses destinées à mesurer les résultats reposent autant que possible sur des données anonymisées ou agrégées.
      </p>

      <p>
        La mairie reçoit les tendances, résultats et bilans utiles à la compréhension de la dynamique de la commune, sans accès aux données individuelles des utilisateurs.
      </p>

      <p>
        Demain, plusieurs territoires pourront également créer de nouvelles passerelles sans effacer ce qui fait l’identité de chacun.
      </p>

      <p>
        <strong>Votre ville reste votre ville.</strong>
      </p>

      <p>
        Bo’CitéArt cherche simplement à mieux relier ce qu’elle possède déjà.
      </p>

      <p>
        Citoyens, commerces, entreprises, emploi, école, jeunesse, associations, sport, culture, services et mairie peuvent ainsi être regardés non plus comme une succession de sujets indépendants, mais comme les forces d’un même territoire.
      </p>

      <p>
        Bo’CitéArt ne prétend pas que tout est parfait ni que tout pourra être réalisé immédiatement.
      </p>

      <p>
        Mais l’essentiel est posé :
      </p>

      <p>
        <strong>relier ce qui fonctionne encore trop souvent séparément.</strong>
      </p>

      <p>
        Une ville peut multiplier les bonnes initiatives. Si chacune reste dans son propre couloir, une partie de leur force se perd.
      </p>

      <p>
        Bo’CitéArt propose justement de créer les passerelles qui manquent entre elles.
      </p>

      <p>
        Certaines propositions nécessiteront naturellement un travail préalable avec la ville avant toute mise en œuvre.
      </p>

      <p>
        Leur conception détaillée appartient à la méthode Bo’CitéArt et sera présentée aux interlocuteurs concernés au moment approprié.
      </p>

      <p>
        Une fois qu’une autre voie existe et que l’on sait que ces forces peuvent être mieux reliées, <strong>le statu quo n’est plus tout à fait neutre.</strong>
      </p>

      <p>
        Décider d’avancer est un choix.
      </p>

      <p>
        Décider de ne pas essayer l’est tout autant.
      </p>

      <p>
        Bo’CitéArt ne demande pas de croire à une promesse.
      </p>

      <p>
        Il propose de donner à une architecture déjà construite l’occasion de faire ses preuves sur le terrain.
      </p>

      <p>
        Car lorsqu’une ville possède déjà toutes ces forces, le véritable enjeu n’est peut-être plus de savoir si elles existent, mais de décider si l’on souhaite enfin mieux les relier.
      </p>

      <p>
        <strong>Votre ville reste votre ville. Mais désormais, une autre voie existe.</strong>
      </p>

<!-- =====================================================
     ÇA COMMENCE ICI
     RAPPEL COMPTE + AIDE
     ===================================================== -->

<p>
  <strong>Si vous souhaitez relire cette fiche à tout moment, ouvrez simplement l’onglet « Compte + aide », situé en bas à droite de l’application. En descendant un peu dans la page, vous retrouverez cette fiche ainsi que toutes les autres, présentées à la suite selon les différentes rubriques, tuiles ou univers concernés.</strong>
</p>

<!-- =====================================================
     ÇA FINIT ICI
     ===================================================== -->

      <p>
        Bienvenue dans Bo’CitéArt.
      </p>

      <p>
        <strong>Bo’CitéArt : le bon sens, relié.</strong>
      </p>

      <p class="bociteRights">
        © Jean-Michel Brulé / Bo’CitéArt 2025 — Tous droits réservés.
      </p>

      <p class="bociteRights">
        Dépôts INPI • e-Soleau • EUIPO — Reproduction ou utilisation non autorisée des éléments protégés interdite.
      </p>


      <div class="bociteSeparator"></div>


      <!-- =====================================================
           3 — COMMERCE DE PROXIMITÉ
           ===================================================== -->

      <div class="bociteCourrierTitle">
        3 — COMMERCE DE PROXIMITÉ / PETITE STRUCTURE
      </div>

      <p>
        Ces courriers sont volontairement lisibles par tous.
      </p>

      <p>
        Bo’CitéArt relie beaucoup de sujets et d’acteurs. Les différentes facettes du projet sont donc volontairement réparties d’un courrier et d’un univers à l’autre.
      </p>

      <p>
        Madame, Monsieur,
      </p>

      <p>
        Il ne s’agit ni de chercher un responsable, ni d’opposer petits et grands commerces.
      </p>

      <p>
        Il suffit de regarder autour de nous.
      </p>

      <p>
        Des vitrines s’éteignent, des cellules restent vides et lorsqu’un commerce disparaît, ce sont aussi du passage, des services, des emplois et une partie de la richesse locale qui s’éloignent.
      </p>

      <p>
        Le commerce en ligne fait désormais partie du quotidien. Il ne s’agit pas de le combattre.
      </p>

      <p>
        Mais le commerce physique continue, lui, à supporter ses locaux, ses charges, ses stocks, son personnel et toutes les réalités d’un établissement ouvert au public.
      </p>

      <p>
        Bo’CitéArt ne vient pas vous expliquer votre métier.
      </p>

      <p>
        Il cherche à créer davantage d’occasions d’être découvert par quelqu’un qui, autrement, ne serait peut-être jamais entré chez vous.
      </p>

      <p>
        Les bocitecoins et les Cabas Surprise font partie des éléments visibles de cette dynamique.
      </p>

      <p>
        Ils invitent les habitants à regarder autrement les commerces partenaires et à pousser des portes qu’ils connaissent moins.
      </p>

      <p>
        Pressing, retoucheur, cordonnier, photographe, réparateur, fleuriste, artisan, parapharmacie pour les produits admissibles et bien d’autres professionnels ont ainsi toute leur place.
      </p>

      <p>
        Les Cabas Surprise permettront également de faire découvrir la diversité des produits, services et savoir-faire présents dans la ville.
      </p>

      <p>
        Lorsque cela est possible, Bo’CitéArt encourage aussi la découverte de productions locales, régionales, françaises, ultramarines, artisanales, responsables ou équitables, ainsi que de productions européennes de qualité.
      </p>

      <p>
        Quelques semaines dans l’année sèmeront encore plus Bo’CitéArt et remettront ponctuellement davantage de lumière sur les commerces et professionnels de proximité.
      </p>

      <p>
        Mais votre univers Commerce va bien plus loin : emploi, visibilité, annuaire professionnel, candidatures, nouveaux contacts, pistes d’économies, pérennité et autres services utiles.
      </p>

      <p>
        L’abonnement professionnel ouvre l’accès aux services et outils qui lui sont associés dans votre espace privé.
      </p>

      <p>
        Il est conçu pour rester accessible et surtout avoir du sens.
      </p>

      <p>
        Bo’CitéArt cherche à faire en sorte que vous ne soyez plus seul à essayer d’attirer l’attention jusqu’à votre porte.
      </p>

      <p>
        Lorsque davantage d’activité reste dans la ville, elle contribue à faire vivre tout un environnement local.
      </p>

      <p>
        Votre espace Commerce vous permettra d’en découvrir beaucoup plus.
      </p>

<!-- =====================================================
     ÇA COMMENCE ICI
     RAPPEL COMPTE + AIDE
     ===================================================== -->

<p>
  <strong>Si vous souhaitez relire cette fiche à tout moment, ouvrez simplement l’onglet « Compte + aide », situé en bas à droite de l’application. En descendant un peu dans la page, vous retrouverez cette fiche ainsi que toutes les autres, présentées à la suite selon les différentes rubriques, tuiles ou univers concernés.</strong>
</p>

<!-- =====================================================
     ÇA FINIT ICI
     ===================================================== -->

      <p>
        Bienvenue dans Bo’CitéArt.
      </p>

      <p>
        <strong>Bo’CitéArt : le bon sens, relié.</strong>
      </p>

      <p class="bociteRights">
        © Jean-Michel Brulé / Bo’CitéArt 2025 — Tous droits réservés.
      </p>

      <p class="bociteRights">
        Dépôts INPI • e-Soleau • EUIPO — Reproduction ou utilisation non autorisée des éléments protégés interdite.
      </p>


      <div class="bociteSeparator"></div>


      <!-- =====================================================
           4 — MOYENNE / GRANDE SURFACE
           ===================================================== -->

      <div class="bociteCourrierTitle">
        4 — MOYENNE / GRANDE SURFACE — GRANDE ENSEIGNE
      </div>

      <p>
        Ces courriers sont volontairement lisibles par tous.
      </p>

      <p>
        Bo’CitéArt relie beaucoup de sujets et d’acteurs. Les différentes facettes du projet sont donc réparties entre les courriers et les univers de l’application.
      </p>

      <p>
        Madame, Monsieur le Directeur,
      </p>

      <p>
        Il ne s’agit ni d’opposer petits et grands commerces, ni de désigner un responsable.
      </p>

      <p>
        Une galerie qui se vide ou des commerces qui disparaissent font diminuer le passage et l’attractivité de tout un environnement commercial.
      </p>

      <p>
        Le commerce en ligne fait désormais partie du quotidien.
      </p>

      <p>
        Mais le commerce physique, petit ou grand, continue à porter bâtiments, équipes, emplois, stocks, investissements et présence réelle sur le territoire.
      </p>

      <p>
        Le constat reste simple :
      </p>

      <p>
        <strong>les petits ont besoin des grands, mais les grands ont aussi besoin des petits.</strong>
      </p>

      <p>
        Une grande enseigne constitue souvent un puissant point d’attraction.
      </p>

      <p>
        Mais la diversité des commerces et services qui l’entourent participe elle aussi à l’envie de venir, de circuler et de rester sur place.
      </p>

      <p>
        Bo’CitéArt souhaite inscrire cette force dans une dynamique territoriale plus large.
      </p>

      <p>
        Quelques périodes ponctuelles dans l’année pourront notamment remettre davantage en lumière les commerces, artisans, producteurs et indépendants de proximité.
      </p>

      <p>
        Votre établissement reste pleinement partenaire Bo’CitéArt et poursuit naturellement son activité.
      </p>

      <p>
        <strong>Il ne s’agit pas de proposer moins.</strong>
      </p>

      <p>
        <strong>Il s’agit de proposer autrement.</strong>
      </p>

      <p>
        Dans les actions Bo’CitéArt, chacun doit pouvoir contribuer à la dynamique sans que sa puissance ne finisse par effacer les autres.
      </p>

      <p>
        Les Cabas Surprise pourront notamment devenir une occasion de faire découvrir des produits, des producteurs, des professionnels et des savoir-faire du territoire, en complément de vos propres marques et assortiments.
      </p>

      <p>
        Productions locales, régionales, françaises, ultramarines, artisanales, responsables ou équitables, ainsi que productions européennes de qualité peuvent ainsi bénéficier d’une lumière supplémentaire.
      </p>

      <p>
        Cet équilibre fonctionne dans les deux sens : les commerces de proximité doivent eux aussi s’impliquer.
      </p>

      <p>
        Votre univers professionnel va bien au-delà des Cabas : visibilité, emploi, annuaire professionnel, nouveaux contacts, pistes d’économies, pérennité, mécénat autrement et autres outils adaptés à votre établissement.
      </p>

      <p>
        L’abonnement professionnel ouvre l’accès aux services et outils qui lui sont associés dans votre espace privé.
      </p>

      <p>
        Pour les bocitecoins et les opérations associées, leur intégration dépendra naturellement de la compatibilité de votre système de caisse avec les fonctions prévues par Bo’CitéArt.
      </p>

      <p>
        Votre force compte dans cet équilibre.
      </p>

      <p>
        Mise au service d’un environnement commercial vivant, elle contribue aussi à préserver du passage, de la diversité, de l’activité et de la vie autour de vous.
      </p>

      <p>
        Votre espace professionnel vous permettra maintenant d’en découvrir davantage.
      </p>

<!-- =====================================================
     ÇA COMMENCE ICI
     RAPPEL COMPTE + AIDE
     ===================================================== -->

<p>
  <strong>Si vous souhaitez relire cette fiche à tout moment, ouvrez simplement l’onglet « Compte + aide », situé en bas à droite de l’application. En descendant un peu dans la page, vous retrouverez cette fiche ainsi que toutes les autres, présentées à la suite selon les différentes rubriques, tuiles ou univers concernés.</strong>
</p>

<!-- =====================================================
     ÇA FINIT ICI
     ===================================================== -->

      <p>
        Bienvenue dans Bo’CitéArt.
      </p>

      <p>
        <strong>Bo’CitéArt : le bon sens, relié.</strong>
      </p>

      <p class="bociteRights">
        © Jean-Michel Brulé / Bo’CitéArt 2025 — Tous droits réservés.
      </p>

      <p class="bociteRights">
        Dépôts INPI • e-Soleau • EUIPO — Reproduction ou utilisation non autorisée des éléments protégés interdite.
      </p>


      <div class="bociteSeparator"></div>


      <!-- =====================================================
           5 — ÉCOLE & MILIEU SCOLAIRE
           ===================================================== -->

      <div class="bociteCourrierTitle">
        5 — ÉCOLE & MILIEU SCOLAIRE — VOTRE PLACE DANS BO’CITÉART
      </div>

      <p>
        Ces courriers sont volontairement lisibles par tous.
      </p>

      <p>
        Bo’CitéArt relie beaucoup de sujets et d’acteurs. Il serait impossible d’en expliquer toutes les facettes dans une seule lettre.
      </p>

      <p>
        Madame, Monsieur,
      </p>

      <p>
        L’école porte aujourd’hui bien davantage que la transmission des connaissances.
      </p>

      <p>
        Il faut enseigner, maintenir des repères, capter l’attention et continuer à donner envie d’apprendre dans un monde où les écrans, les réseaux sociaux et désormais l’intelligence artificielle occupent une place considérable.
      </p>

      <p>
        L’IA fera partie de l’avenir des jeunes.
      </p>

      <p>
        Mais elle ne remplacera ni les bases, ni le raisonnement, ni la curiosité, ni la capacité de comprendre ce qu’elle produit.
      </p>

      <p>
        Bo’CitéArt n’a vocation ni à faire cours, ni à expliquer aux enseignants leur métier, ni à définir la politique de l’école.
      </p>

      <p>
        Il cherche simplement à apporter un peu d’oxygène autour de l’enseignement, en reconnectant davantage les jeunes aux valeurs, au réel, à leur territoire et à ce qu’ils pourraient devenir demain.
      </p>

      <p>
        Le <strong>« mot du jour »</strong> en est un exemple.
      </p>

      <p>
        Bonjour. Merci. Pardon. Au revoir. L’amitié. Le respect. Une pensée pour un camarade absent ou malade…
      </p>

      <p>
        Des mots simples, des valeurs et des attentions que l’enfant peut faire vivre autrement.
      </p>

      <p>
        Encadrée dans le cadre prévu, sa contribution peut aussi lui permettre de découvrir que sa parole a de la valeur et peut être entendue au-delà de la classe.
      </p>

      <p>
        Curiosité, participation, confiance et reconnaissance peuvent ainsi reprendre une place différente.
      </p>

      <p>
        Bo’CitéArt veut également rapprocher davantage les jeunes du monde professionnel qui les entoure.
      </p>

      <p>
        Combien passent devant un atelier, un commerce ou une entreprise sans savoir ce qui existe réellement derrière ses portes ?
      </p>

      <p>
        Voir, rencontrer, questionner et découvrir concrètement aide à mémoriser, à comprendre et surtout à imaginer.
      </p>

      <p>
        <strong>« Je ne savais même pas que ce métier existait ici. »</strong>
      </p>

      <p>
        Alors, lorsque viendra la question :
      </p>

      <p>
        <strong>« Qu’aimerais-tu faire plus tard ? »</strong>
      </p>

      <p>
        l’objectif est que le traditionnel <strong>« Je ne sais pas »</strong> recule peu à peu devant tout ce qu’ils auront eu l’occasion de découvrir.
      </p>

      <p>
        Un diplôme a de la valeur. Il atteste d’un parcours, de connaissances et d’un niveau de formation.
      </p>

      <p>
        Mais un métier continue ensuite à s’apprendre, à se pratiquer, à se construire et à se maîtriser.
      </p>

      <p>
        L’entreprise doit elle aussi transmettre, accompagner et reconnaître la progression.
      </p>

      <p>
        La jeunesse lui apporte en retour son regard neuf, ses usages, ses technologies et l’énergie de sa génération.
      </p>

      <p>
        C’est lorsque ces deux mondes se comprennent mieux qu’ils peuvent réellement grandir ensemble.
      </p>

      <p>
        À terme, d’autres formes de découverte pourront encore ouvrir davantage de portes aux jeunes.
      </p>

      <p>
        L’école ne peut pas tout porter seule.
      </p>

      <p>
        Familles, entreprises, commerces, associations, clubs, institutions et territoire ont eux aussi une place à prendre autour d’elle.
      </p>

      <p>
        Bo’CitéArt cherche précisément à mieux relier ces forces.
      </p>

      <p>
        <strong>Redonner du sens, réveiller une curiosité, renforcer la confiance, faire découvrir un métier et permettre à un jeune de mieux imaginer son avenir : c’est déjà beaucoup.</strong>
      </p>

      <p>
        Dans la partie École & jeunes, vous découvrirez plus précisément l’esprit recherché et les possibilités proposées.
      </p>

      <!-- =====================================================
     ÇA COMMENCE ICI
     RAPPEL COMPTE + AIDE
     ===================================================== -->

<p>
  <strong>Si vous souhaitez relire cette fiche à tout moment, ouvrez simplement l’onglet « Compte + aide », situé en bas à droite de l’application. En descendant un peu dans la page, vous retrouverez cette fiche ainsi que toutes les autres, présentées à la suite selon les différentes rubriques, tuiles ou univers concernés.</strong>
</p>

<!-- =====================================================
     ÇA FINIT ICI
     ===================================================== -->

      <p>
        Bienvenue dans Bo’CitéArt.
      </p>

      <p>
        <strong>Bo’CitéArt : le bon sens, relié.</strong>
      </p>

      <p class="bociteRights">
        © Jean-Michel Brulé / Bo’CitéArt 2025 — Tous droits réservés.
      </p>

      <p class="bociteRights">
        Dépôts INPI • e-Soleau • EUIPO — Reproduction ou utilisation non autorisée des éléments protégés interdite.
      </p>


      <div class="bociteSeparator"></div>


      <!-- =====================================================
           6 — SPORT & CLUBS SPORTIFS
           ===================================================== -->

      <div class="bociteCourrierTitle">
        6 — SPORT & CLUBS SPORTIFS — VOTRE PLACE DANS BO’CITÉART
      </div>

      <p>
        Ces courriers sont volontairement lisibles par tous.
      </p>

      <p>
        Bo’CitéArt relie beaucoup de sujets et d’acteurs. Les différentes facettes du projet sont volontairement réparties dans l’application.
      </p>

      <p>
        Madame, Monsieur,
      </p>

      <p>
        Un club sportif n’est pas seulement un lieu où l’on pratique une discipline.
      </p>

      <p>
        On y apprend aussi l’effort, le respect, l’engagement, l’esprit d’équipe et la responsabilité.
      </p>

      <p>
        Mais beaucoup de clubs cherchent aujourd’hui de nouvelles ressources, de nouveaux soutiens et surtout de nouveaux liens pour continuer à faire vivre leurs projets.
      </p>

      <p>
        Bo’CitéArt souhaite leur ouvrir de nouvelles possibilités.
      </p>

      <p>
        Des gestes simples réalisés autour de la vie du club peuvent déjà devenir de belles occasions de développer civisme, respect des lieux, responsabilité et esprit collectif.
      </p>

      <p>
        L’engagement des jeunes peut ainsi être davantage reconnu et valorisé.
      </p>

      <p>
        Bo’CitéArt souhaite aussi faciliter de nouvelles rencontres entre clubs, commerces, entreprises, familles et autres acteurs du territoire.
      </p>

      <p>
        Pour un dirigeant, un éducateur ou un bénévole, pousser une nouvelle porte n’est pas toujours naturel.
      </p>

      <p>
        Le projet veut justement créer davantage d’occasions de faire connaissance, de présenter le club, ses besoins, ses projets et ce qu’il apporte à la ville.
      </p>

      <p>
        Le professionnel peut, lui aussi, découvrir autrement les personnes qui font vivre le sport local et choisir de s’y associer.
      </p>

      <p>
        Le club peut également devenir un formidable lieu d’apprentissage de la décision collective.
      </p>

      <p>
        Aider son équipe ?
      </p>

      <p>
        Soutenir un projet ?
      </p>

      <p>
        Partager ?
      </p>

      <p>
        Penser aussi à une cause solidaire ?
      </p>

      <p>
        Réfléchir ensemble à ce que l’on souhaite faire de ce que l’on a construit est déjà une manière d’apprendre.
      </p>

      <p>
        <strong>Responsabilité, partage, engagement, choix collectif, respect de l’effort des autres.</strong>
      </p>

      <p>
        Le sport devient alors un support d’apprentissage bien plus large que le seul résultat d’un match.
      </p>

      <p>
        Et pour l’encadrant, ces actions peuvent devenir un formidable moyen de fédérer son groupe autrement.
      </p>

      <p>
        Un nom devient un visage.
      </p>

      <p>
        Une enseigne devient une personne.
      </p>

      <p>
        Un club que l’on connaissait peu devient une équipe que l’on a envie de suivre.
      </p>

      <p>
        C’est ce cercle de connaissance et de reconnaissance que Bo’CitéArt cherche à favoriser.
      </p>

      <p>
        Les bocitecoins et certaines formes de valorisation pourront participer à cette dynamique dans le cadre prévu par Bo’CitéArt.
      </p>

      <p>
        Le fonctionnement détaillé restera naturellement réservé aux espaces et interlocuteurs concernés.
      </p>

      <p>
        Le club reste un lieu de sport.
      </p>

      <p>
        Mais il peut aussi devenir un formidable lieu d’apprentissage de la vie collective.
      </p>

      <p>
        <strong>Et ce n’est encore qu’une des facettes prévues pour le sport dans Bo’CitéArt.</strong>
      </p>

      <!-- =====================================================
     ÇA COMMENCE ICI
     RAPPEL COMPTE + AIDE
     ===================================================== -->

<p>
  <strong>Si vous souhaitez relire cette fiche à tout moment, ouvrez simplement l’onglet « Compte + aide », situé en bas à droite de l’application. En descendant un peu dans la page, vous retrouverez cette fiche ainsi que toutes les autres, présentées à la suite selon les différentes rubriques, tuiles ou univers concernés.</strong>
</p>

<!-- =====================================================
     ÇA FINIT ICI
     ===================================================== -->

      <p>
        Bienvenue dans Bo’CitéArt.
      </p>

      <p>
        <strong>Bo’CitéArt : le bon sens, relié.</strong>
      </p>

      <p class="bociteRights">
        © Jean-Michel Brulé / Bo’CitéArt 2025 — Tous droits réservés.
      </p>

      <p class="bociteRights">
        Dépôts INPI • e-Soleau • EUIPO — Reproduction ou utilisation non autorisée des éléments protégés interdite.
      </p>


      <div class="bociteSeparator"></div>


      <!-- =====================================================
           7 — ASSOCIATIONS
           ===================================================== -->

      <div class="bociteCourrierTitle">
        7 — ASSOCIATIONS — VOTRE PLACE DANS BO’CITÉART
      </div>

      <p>
        Ces courriers sont volontairement lisibles par tous.
      </p>

      <p>
        Bo’CitéArt relie beaucoup de sujets et d’acteurs. Les différentes facettes du projet sont volontairement réparties dans l’application.
      </p>

      <p>
        Madame, Monsieur,
      </p>

      <p>
        Une association donne beaucoup : du temps, de l’écoute, de l’énergie, des compétences et une présence dont on mesure parfois la valeur seulement lorsqu’elle vient à manquer.
      </p>

      <p>
        Derrière cela, il y a des bénévoles.
      </p>

      <p>
        Parmi eux, beaucoup sont retraités et trouvent encore dans l’association une belle occasion d’offrir leur expérience et leur temps à la société.
      </p>

      <p>
        Mais les années passent, la fatigue arrive et le manque de relais finit parfois par peser.
      </p>

      <p>
        Plus encore lorsque certains considèrent que <strong>ce qui leur est donné n’est que normal</strong>, sans mesurer l’effort et la générosité qu’il y a derrière.
      </p>

      <p>
        Et pourtant, beaucoup continuent.
      </p>

      <p>
        <strong>Il est temps que cette générosité soit mieux reconnue, mieux respectée et surtout davantage relayée.</strong>
      </p>

      <p>
        Car une société ne peut pas durablement reposer sur les mêmes épaules.
      </p>

      <p>
        Une association n’est pas seulement là pour donner. Elle aussi a le droit de recevoir du soutien, de la gratitude, de la reconnaissance et de nouvelles forces.
      </p>

      <p>
        Pour certaines actions qui s’y prêtent, Bo’CitéArt souhaite aussi remettre davantage de participation au cœur de la vie collective lorsque les personnes en ont réellement la possibilité.
      </p>

      <p>
        Préparer, ranger, accueillir, transmettre un savoir-faire ou simplement prêter main-forte peuvent déjà changer beaucoup de choses.
      </p>

      <p>
        <strong>Bénéficier d’une action associative et, lorsque l’on peut le faire, apporter aussi un peu en retour devrait devenir naturel.</strong>
      </p>

      <p>
        <strong>« Quand on ne veut pas faire quelque chose, on cherche des excuses. Quand on veut vraiment agir, on trouve des solutions. »</strong>
      </p>

      <p>
        Et devenir acteur apporte aussi beaucoup : <strong>confiance, utilité, rencontres, reconnaissance, dignité et fierté d’avoir participé.</strong>
      </p>

      <p>
        C’est une volonté profonde de Bo’CitéArt : <strong>faire participer le citoyen autrement et remettre en lumière ce qu’il peut lui aussi apporter.</strong>
      </p>

      <p>
        Car derrière chacun peut se cacher <strong>un talent, une passion, une créativité, une compétence, une idée ou un savoir-faire parfois très éloigné de son métier ou de ce que les autres connaissent de lui.</strong>
      </p>

      <p>
        Quel dommage de laisser parfois ces richesses dormir toute une vie simplement parce qu’elles n’ont jamais trouvé l’occasion de s’exprimer.
      </p>

      <p>
        <strong>Bo’CitéArt souhaite révéler, réveiller ces forces et leur donner de belles occasions de s’exprimer.</strong>
      </p>

      <p>
        Certaines propositions pourront également donner aux associations et aux citoyens l’occasion de participer autrement à la dynamique de leur ville.
      </p>

      <p>
        Leur cadre sera naturellement défini avec la mairie avant toute mise en œuvre.
      </p>

      <p>
        Certaines réalisations pourront être valorisées ou récompensées selon les modalités retenues.
      </p>

      <p>
        <strong>Volontairement, je n’en dirai pas davantage ici.</strong>
      </p>

      <p>
        <strong>Gardons encore quelques surprises…</strong>
      </p>

      <p>
        Bo’CitéArt conservera son esprit, la cohérence de sa méthode et de sa stratégie, tout en s’adaptant au paysage, aux réalités et aux décisions de chaque ville.
      </p>

      <p>
        Un vieux principe résume assez bien l’esprit recherché :
      </p>

      <p>
        <strong>mieux vaut apprendre à quelqu’un à pêcher que simplement lui donner un poisson.</strong>
      </p>

      <p>
        Aider, oui.
      </p>

      <p>
        Mais aussi permettre d’apprendre, de produire, de transmettre, de participer, de faire émerger les talents et les passions et de reprendre confiance dans ce que l’on est capable d’apporter.
      </p>

      <p>
        Dans la tuile <strong>Mairie & Asso</strong>, les associations retrouvent les informations et possibilités qui les concernent au fil du développement de Bo’CitéArt.
      </p>

      <p>
        Elles pourront également, si elles le souhaitent, diffuser des publicités dans le grand bandeau prévu à cet effet, aux mêmes conditions que les autres annonceurs.
      </p>

      <p>
        <strong>Et ce n’est là encore qu’une des facettes prévues pour les associations dans Bo’CitéArt.</strong>
      </p>

      <p>
        Bo’CitéArt ne remplace pas les associations.
      </p>

      <p>
        Il cherche à mieux reconnaître celles et ceux qui les font vivre, à révéler les forces encore cachées parmi les citoyens et à faire en sorte que, lorsque chacun le peut, <strong>participer devienne aussi naturel que recevoir.</strong>
      </p>

      <!-- =====================================================
     ÇA COMMENCE ICI
     RAPPEL COMPTE + AIDE
     ===================================================== -->

<p>
  <strong>Si vous souhaitez relire cette fiche à tout moment, ouvrez simplement l’onglet « Compte + aide », situé en bas à droite de l’application. En descendant un peu dans la page, vous retrouverez cette fiche ainsi que toutes les autres, présentées à la suite selon les différentes rubriques, tuiles ou univers concernés.</strong>
</p>

<!-- =====================================================
     ÇA FINIT ICI
     ===================================================== -->

      <p>
        Bienvenue dans Bo’CitéArt.
      </p>

      <p>
        <strong>Bo’CitéArt : le bon sens, relié.</strong>
      </p>

      <p class="bociteRights">
        © Jean-Michel Brulé / Bo’CitéArt 2025 — Tous droits réservés.
      </p>

      <p class="bociteRights">
        Dépôts INPI • e-Soleau • EUIPO — Reproduction ou utilisation non autorisée des éléments protégés interdite.
      </p>


      <div class="bociteSeparator"></div>


      <!-- =====================================================
           8 — CITOYEN
           ===================================================== -->

      <div class="bociteCourrierTitle">
        8 — CITOYEN — VOTRE PLACE DANS BO’CITÉART
      </div>

      <p>
        Ces courriers sont volontairement lisibles par tous.
      </p>

      <p>
        Bo’CitéArt relie beaucoup de sujets et d’acteurs. Vous pourrez ainsi découvrir librement la majorité de ses univers, mieux comprendre ce que vivent les autres et voir comment chacun prend sa place dans la vie de la ville.
      </p>

      <p>
        Seuls les espaces privés et les informations qui doivent rester confidentielles sont protégés.
      </p>

      <p>
        Madame, Monsieur,
      </p>

      <p>
        Dans Bo’CitéArt, le citoyen n’est pas seulement celui qui regarde ou utilise un service.
      </p>

      <p>
        <strong>Il est au cœur de la dynamique.</strong>
      </p>

      <p>
        L’application vous permettra de circuler simplement entre ses différents univers : vie locale, commerces et entreprises, emploi, école et jeunes, sport, associations, mairie, culture, mémoire locale et services utiles.
      </p>

      <p>
        Vous pourrez découvrir ce qui existe autour de vous, trouver des informations, des opportunités, chercher un emploi, pousser de nouvelles portes ou simplement vous laisser surprendre.
      </p>

      <p>
        <strong>Pas besoin de tout comprendre dès le départ : Bo’CitéArt est aussi fait pour se découvrir progressivement, selon vos besoins, vos envies et votre curiosité.</strong>
      </p>

      <p>
        Cette ouverture permet également quelque chose de précieux :
      </p>

      <p>
        <strong>regarder parfois la réalité avec les yeux de l’autre.</strong>
      </p>

      <p>
        Un commerçant, un chef d’entreprise, un enseignant, un bénévole ou un responsable de club porte lui aussi des contraintes, des choix, des imprévus et des responsabilités que l’on ne voit pas toujours.
      </p>

      <p>
        Mieux connaître leur réalité aide à mieux comprendre leurs difficultés, leurs décisions et ce qu’ils apportent.
      </p>

      <p>
        Bo’CitéArt cherche justement à recréer des passerelles entre des personnes qui vivent parfois les unes à côté des autres sans réellement se connaître.
      </p>

      <p>
        Mais chacun de nous possède aussi bien plus que ce que son activité quotidienne laisse apparaître.
      </p>

      <p>
        Beaucoup portent <strong>une passion, un talent, une créativité, une compétence ou un savoir-faire</strong> qui ne correspondent pas forcément au métier exercé.
      </p>

      <p>
        La vie nous conduit souvent, à juste titre, à choisir d’abord ce qui permet de vivre et de faire vivre sa famille.
      </p>

      <p>
        Mais derrière ce choix, certaines passions ou certains talents peuvent rester enfouis pendant des années, faute d’avoir trouvé une occasion de s’exprimer.
      </p>

      <p>
        <strong>Nous sommes souvent bien plus que le métier inscrit sur notre fiche de paie.</strong>
      </p>

      <p>
        Bo’CitéArt souhaite aussi contribuer à <strong>révéler, réveiller certaines de ces forces et leur donner de belles occasions de s’exprimer.</strong>
      </p>

      <p>
        Tout ne sera évidemment pas possible pour chacun.
      </p>

      <p>
        Mais participer à autre chose que son quotidien, essayer, créer, transmettre ou montrer une autre facette de soi peut déjà offrir un véritable espace de liberté, de confiance et de plaisir.
      </p>

      <p>
        Et lorsque quelque chose nous tient vraiment à cœur, l’engagement vient souvent naturellement : on essaie, on recommence, on progresse et l’on cherche à donner le meilleur de soi.
      </p>

      <p>
        <strong>Bo’CitéArt ne souhaite qu’une chose : créer davantage d’occasions de découvrir ce dont nous sommes capables, pour nous-mêmes d’abord, puis parfois avec les autres.</strong>
      </p>

      <p>
        Vous pourrez également lire les autres courriers.
      </p>

      <p>
        C’est volontaire : découvrir ce que Bo’CitéArt propose aux commerces, entreprises, écoles, associations, clubs sportifs ou à la mairie permet aussi de mieux comprendre sa propre place dans l’ensemble.
      </p>

      <p>
        Certaines possibilités ne se révéleront qu’en avançant dans l’application.
      </p>

      <p>
        <strong>Gardons encore quelques surprises…</strong>
      </p>

      <p>
        Votre place dans Bo’CitéArt est finalement assez simple :
      </p>

      <p>
        <strong>découvrir, comprendre, utiliser ce qui peut vous être utile et laisser aussi s’exprimer ce que vous portez en vous.</strong>
      </p>

      <p>
        Si chacun parvient à mieux connaître les autres tout en faisant grandir le meilleur de ce qu’il possède déjà, alors ensemble nous pouvons produire quelque chose de beaucoup plus fort :
      </p>

      <p>
        <strong>l’exemple.</strong>
      </p>

      <!-- =====================================================
     ÇA COMMENCE ICI
     RAPPEL COMPTE + AIDE
     ===================================================== -->

<p>
  <strong>Si vous souhaitez relire cette fiche à tout moment, ouvrez simplement l’onglet « Compte + aide », situé en bas à droite de l’application. En descendant un peu dans la page, vous retrouverez cette fiche ainsi que toutes les autres, présentées à la suite selon les différentes rubriques, tuiles ou univers concernés.</strong>
</p>

<!-- =====================================================
     ÇA FINIT ICI
     ===================================================== -->

      <p>
        Bienvenue dans Bo’CitéArt.
      </p>

      <p>
        <strong>Bo’CitéArt : le bon sens, relié.</strong>
      </p>

      <p class="bociteRights">
        © Jean-Michel Brulé / Bo’CitéArt 2025 — Tous droits réservés.
      </p>

      <p class="bociteRights">
        Dépôts INPI • e-Soleau • EUIPO — Reproduction ou utilisation non autorisée des éléments protégés interdite.
      </p>


      <div class="bociteSeparator"></div>


      <!-- =====================================================
           9 — MOINS DE 15 ANS
           ===================================================== -->

      <div class="bociteCourrierTitle">
        9 — MOINS DE 15 ANS — TA PLACE DANS BO’CITÉART
      </div>

      <p>
        À toi qui as moins de 15 ans,
      </p>

      <p>
        Tu ne le sais peut-être pas encore, mais <strong>tu es l’un des pivots les plus importants de Bo’CitéArt.</strong>
      </p>

      <p>
        Pourquoi ?
      </p>

      <p>
        Parce que le temps est devant toi.
      </p>

      <p>
        Tu vas encore découvrir énormément de choses, changer d’avis, essayer, apprendre, rencontrer des personnes et peut-être trouver un jour ce qui te passionne vraiment.
      </p>

      <p>
        Bo’CitéArt n’est qu’une toute petite partie, condensée, de tout ce que la vie te fera découvrir avec le temps.
      </p>

      <p>
        Dans l’application, tu pourras regarder autrement ce qui existe déjà autour de toi : ta ville, ses métiers, ses commerces, ses entreprises, ses clubs, ses associations, son histoire, sa culture, ses habitants et bien d’autres choses encore.
      </p>

      <p>
        Certaines t’intéresseront.
      </p>

      <p>
        D’autres peut-être pas.
      </p>

      <p>
        Et c’est très bien ainsi.
      </p>

      <p>
        <strong>Découvrir, c’est aussi apprendre peu à peu ce qui nous attire vraiment.</strong>
      </p>

      <p>
        Sans même t’en rendre compte, tu deviens déjà un petit ambassadeur de ce que tu découvres : tu en parles, tu le racontes et parfois tu donnes envie à d’autres de regarder à leur tour.
      </p>

      <p>
        Et peu à peu, tu deviens aussi l’ambassadeur de ta propre histoire.
      </p>

      <p>
        Une chose t’étonne ?
      </p>

      <p>
        Tu en parleras peut-être à tes copains, à ta famille ou à quelqu’un d’autre.
      </p>

      <p>
        Un métier t’intéresse ?
      </p>

      <p>
        Tu commenceras peut-être à poser des questions.
      </p>

      <p>
        Une activité te plaît ?
      </p>

      <p>
        Tu auras peut-être envie d’essayer.
      </p>

      <p>
        Une histoire te surprend ?
      </p>

      <p>
        Tu la regarderas peut-être autrement la prochaine fois que tu passeras devant le lieu où elle s’est produite.
      </p>

      <p>
        C’est aussi ainsi que la curiosité grandit.
      </p>

      <p>
        Utiliser Bo’CitéArt au quotidien pourra t’apporter <strong>des découvertes, des surprises, de l’éveil et parfois l’audace d’essayer quelque chose de nouveau.</strong>
      </p>

      <p>
        Et il existe encore une autre chose importante.
      </p>

      <p>
        Personne ne sait aujourd’hui tout ce que tu portes en toi.
      </p>

      <p>
        Peut-être as-tu déjà une passion.
      </p>

      <p>
        Peut-être plusieurs.
      </p>

      <p>
        Peut-être un talent que ta famille ou tes amis connaissent déjà.
      </p>

      <p>
        Ou peut-être quelque chose que <strong>personne, pas même toi, n’a encore découvert.</strong>
      </p>

      <p>
        Dessiner, inventer, construire, raconter, créer, réparer, jouer, observer, aider, imaginer…
      </p>

      <p>
        Il existe mille façons d’avoir du talent.
      </p>

      <p>
        <strong>À toi de découvrir les tiens, à ton rythme.</strong>
      </p>

      <p>
        Et lorsque tu en auras envie, peut-être choisiras-tu un jour de nous en montrer une petite partie… ou beaucoup plus.
      </p>

      <p>
        Bo’CitéArt souhaite justement créer davantage d’occasions pour que les jeunes puissent <strong>découvrir, essayer, oser et montrer ce dont ils sont capables</strong>, sans décider à leur place de ce qu’ils doivent devenir.
      </p>

      <p>
        Les écrans, les réseaux sociaux et l’intelligence artificielle feront partie de ton monde.
      </p>

      <p>
        Mais ton histoire, elle, reste à écrire.
      </p>

      <p>
        Et personne ne peut encore savoir tout ce que tu en feras.
      </p>

      <p>
        Certaines fonctions de Bo’CitéArt resteront naturellement protégées lorsqu’elles concernent tes informations personnelles ou nécessitent l’accord de tes parents ou responsables.
      </p>

      <p>
        Pour le reste, avance simplement à ton rythme.
      </p>

      <p>
        Regarde.
      </p>

      <p>
        Découvre.
      </p>

      <p>
        Laisse-toi surprendre.
      </p>

      <p>
        <strong>Le temps est avec toi.</strong>
      </p>

      <p>
        Et ce que tu découvriras aujourd’hui deviendra peut-être une partie de ce que tu seras demain.
      </p>

      <p>
        Le reste, tu le découvriras dans Bo’CitéArt.
      </p>

      <p>
        <strong>Gardons encore quelques surprises…</strong>
      </p>

      <p>
  <strong>Tu peux relire cette fiche quand tu le souhaites, mais aussi découvrir les autres. Pour cela, ouvre simplement l’onglet « Compte + aide », situé en bas à droite de l’application, puis descends un peu dans la page : tu y retrouveras toutes les fiches à la suite.</strong>
</p>

<p>
  <strong>Les lire petit à petit te permettra de mieux te familiariser avec ce qui t’entoure, de découvrir la réalité des autres et de te faire progressivement ta propre opinion sur le monde d’aujourd’hui… et sur celui de demain.</strong>
</p>

      <p>
        Bienvenue dans Bo’CitéArt.
      </p>

      <p>
        <strong>Ta ville a beaucoup de choses à te montrer.</strong>
      </p>

      <p>
        <strong>Et toi, peut-être beaucoup de choses à lui montrer un jour.</strong>
      </p>

      <p>
        <strong>Bo’CitéArt : le bon sens, relié.</strong>
      </p>

      <p class="bociteRights">
        © Jean-Michel Brulé / Bo’CitéArt 2025 — Tous droits réservés.
      </p>

      <p class="bociteRights">
        Dépôts INPI • e-Soleau • EUIPO — Reproduction ou utilisation non autorisée des éléments protégés interdite.
      </p>


    </div>
  `;

     window.BOCITEART_COURRIERS_HTML_V1 =
    COURRIERS_HTML;

  /* =====================================================
     AJOUT DANS COMPTE + AIDE
     APRÈS LE CONTENU EXISTANT
     ===================================================== */

  function injectCourriersDansCompteAide(){

    const modalTitle =
      document.getElementById("modalTitle");

    const modalBody =
      document.getElementById("modalBody");


    if(!modalTitle || !modalBody){
      return;
    }


    if(
      String(modalTitle.textContent || "").trim()
      !==
      "Compte + aide"
    ){
      return;
    }


    if(
      document.getElementById(
        "bociteCompteAideCourriersCompletsV1"
      )
    ){
      return;
    }


    modalBody.insertAdjacentHTML(
      "beforeend",
      COURRIERS_HTML
    );

  }


  /* =====================================================
     RACCORDEMENT AU BOUTON COMPTE + AIDE
     ===================================================== */

  function installer(){

    const openSecure =
      document.getElementById("openSecure");


    if(!openSecure){

      window.setTimeout(
        installer,
        300
      );

      return;

    }


    openSecure.addEventListener(
      "click",
      function(){

        /*
          Le contenu Compte + aide existant
          s'affiche d'abord.

          Ensuite seulement les introductions
          sont ajoutées en dessous.
        */

        window.setTimeout(
          injectCourriersDansCompteAide,
          0
        );

      }
    );


    console.log(
      "✅ Compte + aide — introduction générale et 9 courriers complets chargés"
    );

  }


  installer();

})();

/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — CORRECTION VISUELLE DES INTRODUCTIONS
   COMPTE + AIDE

   - chaque courrier sur fond blanc
   - titres verts 17 px gras
   - corps noir 14 px
   - Bo'Cité vert + Art rouge
   - Bo'CitéArt toujours attaché
   - aucun texte n'est modifié

   VERSION 25/08/2026
   ========================================================= */

(function installBociteCompteAidePresentationV2(){

  "use strict";

  if(window.__bociteCompteAidePresentationV2){
    return;
  }

  window.__bociteCompteAidePresentationV2 = true;


  /* =====================================================
     1. STYLES
     ===================================================== */

  function installerStyles(){

    if(
      document.getElementById(
        "bociteCompteAidePresentationV2Styles"
      )
    ){
      return;
    }


    const style =
      document.createElement("style");


    style.id =
      "bociteCompteAidePresentationV2Styles";


    style.textContent = `

      #bociteCompteAideCourriersCompletsV1{

        background:transparent !important;

        margin-top:20px !important;

        padding:0 !important;

        color:#111111 !important;

        font-size:14px !important;

        font-weight:400 !important;

        line-height:1.55 !important;

      }


      #bociteCompteAideCourriersCompletsV1
      .bociteDocumentCard{

        background:#ffffff !important;

        border:1px solid #dedede !important;

        border-radius:12px !important;

        padding:16px !important;

        margin:0 0 16px 0 !important;

        box-sizing:border-box !important;

        box-shadow:0 1px 2px rgba(0,0,0,.04) !important;

      }


      #bociteCompteAideCourriersCompletsV1 p{

        color:#111111 !important;

        font-size:14px !important;

        font-weight:400 !important;

        line-height:1.55 !important;

        margin:0 0 12px 0 !important;

      }


      #bociteCompteAideCourriersCompletsV1
      .bociteIntroTitle,

      #bociteCompteAideCourriersCompletsV1
      .bociteCourrierTitle{

        color:#2f5d46 !important;

        font-size:17px !important;

        font-weight:700 !important;

        line-height:1.35 !important;

        margin:0 0 15px 0 !important;

      }


      #bociteCompteAideCourriersCompletsV1
      .bociteSousTitre{

        color:#2f5d46 !important;

        font-size:16px !important;

        font-weight:700 !important;

        line-height:1.35 !important;

        margin:18px 0 12px 0 !important;

      }


      #bociteCompteAideCourriersCompletsV1 strong{

        font-weight:700 !important;

      }


      /*
         MARQUE BO'CITÉART

         Le bloc complet reste insécable :
         impossible de laisser Art partir seul
         à la ligne suivante.
      */

      #bociteCompteAideCourriersCompletsV1
      .bociteBrand{

        display:inline-block !important;

        white-space:nowrap !important;

        font-size:17px !important;

        font-weight:700 !important;

        line-height:1.15 !important;

        vertical-align:baseline !important;

      }


      #bociteCompteAideCourriersCompletsV1
      .bociteBrandGreen{

        color:#2f5d46 !important;

        font-size:17px !important;

        font-weight:700 !important;

      }


      #bociteCompteAideCourriersCompletsV1
      .bociteBrandRed{

        color:#b00020 !important;

        font-size:17px !important;

        font-weight:700 !important;

      }


      #bociteCompteAideCourriersCompletsV1
      .bociteRights{

        color:#111111 !important;

        font-size:14px !important;

        font-weight:400 !important;

      }


      #bociteCompteAideCourriersCompletsV1
      .bociteSeparator{

        display:none !important;

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =====================================================
     2. TRANSFORMER BO'CITÉART
     EN VERT + ROUGE SANS CHANGER LE TEXTE
     ===================================================== */

  function creerMarque(texte){

    const span =
      document.createElement("span");


    span.className =
      "bociteBrand";


    /*
       On garde exactement
       les majuscules/minuscules
       présentes dans le texte original.
    */

    const lower =
      texte.toLowerCase();


    const indexArt =
      lower.lastIndexOf("art");


    const partieVerte =
      texte.slice(
        0,
        indexArt
      );


    const partieRouge =
      texte.slice(
        indexArt
      );


    const green =
      document.createElement("span");


    green.className =
      "bociteBrandGreen";


    green.textContent =
      partieVerte;


    const red =
      document.createElement("span");


    red.className =
      "bociteBrandRed";


    red.textContent =
      partieRouge;


    span.appendChild(
      green
    );


    span.appendChild(
      red
    );


    return span;

  }


  function colorerToutesLesMarques(root){

    if(!root){
      return;
    }


    const testRegex =
      /Bo[’']CitéArt/i;


    const splitRegex =
      /(Bo[’']CitéArt)/gi;


    const walker =
      document.createTreeWalker(

        root,

        NodeFilter.SHOW_TEXT,

        {

          acceptNode(node){

            if(
              !node ||
              !node.nodeValue
            ){

              return NodeFilter.FILTER_REJECT;

            }


            const parent =
              node.parentElement;


            /*
               Ne jamais retraiter
               une marque déjà colorée.
            */

            if(
              parent &&
              parent.closest(
                ".bociteBrand"
              )
            ){

              return NodeFilter.FILTER_REJECT;

            }


            if(
              testRegex.test(
                node.nodeValue
              )
            ){

              return NodeFilter.FILTER_ACCEPT;

            }


            return NodeFilter.FILTER_REJECT;

          }

        }

      );


    const nodes = [];


    let current;


    while(
      current =
        walker.nextNode()
    ){

      nodes.push(
        current
      );

    }


    nodes.forEach(
      function(textNode){

        const texte =
          textNode.nodeValue;


        const morceaux =
          texte.split(
            splitRegex
          );


        const fragment =
          document.createDocumentFragment();


        morceaux.forEach(
          function(morceau){

            if(!morceau){
              return;
            }


            if(
              testRegex.test(
                morceau
              )
            ){

              fragment.appendChild(
                creerMarque(
                  morceau
                )
              );

            }
            else{

              fragment.appendChild(
                document.createTextNode(
                  morceau
                )
              );

            }

          }
        );


        textNode.parentNode.replaceChild(
          fragment,
          textNode
        );

      }
    );

  }


  /* =====================================================
     3. METTRE CHAQUE TEXTE
     DANS SA PROPRE FICHE BLANCHE
     ===================================================== */

  function transformerEnFichesBlanches(root){

    if(!root){
      return;
    }


    if(
      root.dataset.bociteWhiteCards ===
      "1"
    ){

      return;

    }


    const elements =
      Array.from(
        root.childNodes
      );


    const cards = [];


    let card =
      document.createElement(
        "section"
      );


    card.className =
      "bociteDocumentCard";


    function terminerCarte(){

      const contientTexte =
        String(
          card.textContent || ""
        ).trim();


      if(contientTexte){

        cards.push(
          card
        );

      }


      card =
        document.createElement(
          "section"
        );


      card.className =
        "bociteDocumentCard";

    }


    elements.forEach(
      function(node){

        /*
           Chaque ancien trait séparateur
           marque simplement le début
           d'une nouvelle fiche blanche.
        */

        if(
          node.nodeType === 1 &&
          node.classList &&
          node.classList.contains(
            "bociteSeparator"
          )
        ){

          terminerCarte();

          return;

        }


        card.appendChild(
          node
        );

      }
    );


    terminerCarte();


    root.replaceChildren(
      ...cards
    );


    root.dataset.bociteWhiteCards =
      "1";

  }


  /* =====================================================
     4. APPLICATION
     ===================================================== */

  function appliquerPresentation(){

    installerStyles();


    const root =
      document.getElementById(
        "bociteCompteAideCourriersCompletsV1"
      );


    if(!root){
      return;
    }


    transformerEnFichesBlanches(
      root
    );


    colorerToutesLesMarques(
      root
    );

  }


  /* =====================================================
     5. DÉTECTION DE L'OUVERTURE
     DE COMPTE + AIDE
     ===================================================== */

  document.addEventListener(
    "click",
    function(){

      window.setTimeout(
        appliquerPresentation,
        20
      );

    },
    true
  );


  /*
     Sécurité :
     si Compte + aide est déjà ouvert
     au moment du chargement.
  */

  window.setTimeout(
    appliquerPresentation,
    100
  );


  /*
     Sécurité supplémentaire :
     le contenu de la fenêtre modale
     peut être créé après le clic.
  */

  const observer =
    new MutationObserver(
      function(){

        appliquerPresentation();

      }
    );


  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );


  console.log(
    "✅ Compte + aide — présentation blanche et logo Bo'CitéArt corrigés"
  );

})();

/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — INTRODUCTIONS SELON LE PROFIL

   - une seule source pour les textes
   - affichage automatique une seule fois
   - relecture toujours possible dans Compte + aide
   - Commerce : courrier commun + petite structure
     + grande enseigne
   - Jeune : message préalable aux parents
   ========================================================= */

(function installBociteRoleIntroductions(){

  "use strict";

  if(window.BociteRoleIntroductions){
    return;
  }


  const STORAGE_PREFIX =
    "bociteart_role_intro_read_v1_";


  /* =====================================================
     CORRESPONDANCE DES 9 COURRIERS
     ===================================================== */

  const LETTERS = {

    commun:
      1,

    mairie:
      2,

    commerceProximite:
      3,

    grandeEnseigne:
      4,

    ecole:
      5,

    sport:
      6,

    association:
      7,

    citoyen:
      8,

    jeune:
      9

  };

/* =====================================================
   ÇA COMMENCE ICI
   PROFIL → INTRODUCTION PERSONNELLE
   ===================================================== */

const PROFILE_MAP = {

  citoyen:[
    LETTERS.citoyen
  ],

  jeune:[
    LETTERS.jeune
  ],

  mairie:[
    LETTERS.mairie
  ],

  ecole:[
    LETTERS.ecole
  ],

  sport:[
    LETTERS.sport
  ],

  association:[
    LETTERS.association
  ],

  /*
    Commerce :
    courrier commun
    + petite structure
    + grande enseigne.

    Il n'existe pas ensuite de tuile
    séparant petit et grand commerce.
  */
  commerce:[

    LETTERS.commun,
    LETTERS.commerceProximite,
    LETTERS.grandeEnseigne

  ],

  /*
    Entreprise :
    uniquement le courrier commun
    Commerces & Entreprises.
  */
  entreprise:[
    LETTERS.commun
  ]

};

  /* =====================================================
     MÉMOIRE DE LECTURE
     ===================================================== */

  function getStorageKey(
    number
  ){

    return (
      STORAGE_PREFIX +
      String(number)
    );

  }


  function isRead(
    number
  ){

    try{

      return (
        localStorage.getItem(
          getStorageKey(number)
        ) === "true"
      );

    }catch(error){

      return false;

    }

  }


  function markRead(
    number
  ){

    try{

      localStorage.setItem(
        getStorageKey(number),
        "true"
      );

    }catch(error){

      console.warn(
        "Bo'CitéArt : lecture introduction non enregistrée.",
        error
      );

    }

  }


  function hasUnread(
    numbers
  ){

    return numbers.some(
      function(number){

        return !isRead(number);

      }
    );

  }


  /* =====================================================
     RÉCUPÉRATION DU TEXTE EXACT
     DEPUIS COMPTE + AIDE

     Aucune réécriture.
     ===================================================== */

  function getLetterHtml(
    number
  ){

    const source =
      window.BOCITEART_COURRIERS_HTML_V1;


    if(!source){

      console.error(
        "Bo'CitéArt : source des courriers introuvable."
      );

      return "";

    }


    const host =
      document.createElement(
        "div"
      );


    host.innerHTML =
      source;


    const root =
      host.querySelector(
        "#bociteCompteAideCourriersCompletsV1"
      );


    if(!root){
      return "";
    }


    const nodes =
      Array.from(
        root.childNodes
      );


    const result =
      document.createElement(
        "div"
      );


    let collecting =
      false;


    for(
      let i = 0;
      i < nodes.length;
      i++
    ){

      const node =
        nodes[i];


      if(
        node.nodeType === 1 &&
        node.classList &&
        node.classList.contains(
          "bociteCourrierTitle"
        )
      ){

        const title =
          String(
            node.textContent || ""
          )
          .trim();


        if(
          title.indexOf(
            String(number) + " —"
          ) === 0
        ){

          collecting =
            true;

        }
        else if(
          collecting
        ){

          break;

        }

      }


      if(!collecting){
        continue;
      }


      if(
        node.nodeType === 1 &&
        node.classList &&
        node.classList.contains(
          "bociteSeparator"
        )
      ){

        break;

      }


      result.appendChild(
        node.cloneNode(true)
      );

    }


    return result.innerHTML;

  }


  /* =====================================================
     BO'CITÉART
     VERT + ART ROUGE
     TOUJOURS ATTACHÉ
     ===================================================== */

  function colorBrands(
    root
  ){

    if(!root){
      return;
    }


    const TEST =
      /Bo[’']CitéArt/i;


    const SPLIT =
      /(Bo[’']CitéArt)/gi;


    const walker =
      document.createTreeWalker(

        root,

        NodeFilter.SHOW_TEXT,

        {

          acceptNode(node){

            if(
              node &&
              node.nodeValue &&
              TEST.test(
                node.nodeValue
              )
            ){

              return NodeFilter
                .FILTER_ACCEPT;

            }


            return NodeFilter
              .FILTER_REJECT;

          }

        }

      );


    const nodes = [];

    let node;


    while(
      node =
        walker.nextNode()
    ){

      nodes.push(
        node
      );

    }


    nodes.forEach(
      function(textNode){

        const parts =
          textNode.nodeValue.split(
            SPLIT
          );


        const fragment =
          document.createDocumentFragment();


        parts.forEach(
          function(part){

            if(!part){
              return;
            }


            if(
              /^Bo[’']CitéArt$/i.test(
                part
              )
            ){

              const brand =
                document.createElement(
                  "span"
                );


              brand.style.whiteSpace =
                "nowrap";

              brand.style.fontSize =
                "17px";

              brand.style.fontWeight =
                "700";


              const index =
                part
                  .toLowerCase()
                  .lastIndexOf(
                    "art"
                  );


              const green =
                document.createElement(
                  "span"
                );


              green.style.color =
                "#2f5d46";


              green.textContent =
                part.slice(
                  0,
                  index
                );


              const red =
                document.createElement(
                  "span"
                );


              red.style.color =
                "#b00020";


              red.textContent =
                part.slice(
                  index
                );


              brand.appendChild(
                green
              );


              brand.appendChild(
                red
              );


              fragment.appendChild(
                brand
              );

            }
            else{

              fragment.appendChild(
                document.createTextNode(
                  part
                )
              );

            }

          }
        );


        textNode.parentNode
          .replaceChild(
            fragment,
            textNode
          );

      }
    );

  }


  /* =====================================================
     MESSAGE POUR LES PARENTS
     AVANT LA FICHE MOINS DE 15 ANS
     ===================================================== */

  function getParentNotice(){

    return `

      <div
        style="
          background:#ffffff;
          border:1px solid #dedede;
          border-left:6px solid #2f5d46;
          border-radius:12px;
          padding:16px;
          margin-bottom:14px;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.55;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:10px;
          ">
          Pour les parents ou responsables
        </div>

        Si vous autorisez votre enfant
        à utiliser Bo'CitéArt,
        prenez quelques instants
        pour lire cette fiche avec lui.

        <br><br>

        Partagez-en le sens avec lui
        si cela est nécessaire :
        cette étape est importante.

        <br><br>

        Vous pourrez également lui faire
        découvrir les autres introductions
        publiques, à son rythme,
        afin qu'il puisse progressivement
        mieux comprendre la place
        et la réalité des autres.

        <br><br>

        La fiche qui suit
        s'adresse ensuite directement à lui.

      </div>

    `;

  }


  /* =====================================================
     CRÉATION DE L'ÉCRAN
     ===================================================== */

  function createOverlay(){

    let overlay =
      document.getElementById(
        "bociteRoleIntroductionOverlay"
      );


    if(overlay){
      return overlay;
    }


    overlay =
      document.createElement(
        "div"
      );


    overlay.id =
      "bociteRoleIntroductionOverlay";


    overlay.style.cssText = `

      position:fixed;
      inset:0;
      z-index:1000000;

      display:none;

      background:
        rgba(0,0,0,.58);

      padding:14px;

      box-sizing:border-box;

      overflow:auto;

    `;


    overlay.innerHTML = `

      <div
        style="
          width:min(760px,100%);
          margin:20px auto;
          background:#f3e6d2;
          border-radius:18px;
          padding:14px;
          box-sizing:border-box;
        ">

        <div
          id="bociteRoleIntroductionNotice">
        </div>

        <div
          id="bociteRoleIntroductionCard"
          style="
            background:#ffffff;
            border:1px solid #dedede;
            border-radius:12px;
            padding:16px;
            box-sizing:border-box;
            color:#111111;
            font-size:14px;
            font-weight:400;
            line-height:1.55;
          ">
        </div>

        <button
          id="bociteRoleIntroductionContinue"
          class="choiceBtn"
          type="button"
          style="
            width:100%;
            margin-top:14px;
          ">
          Continuer
        </button>

      </div>

    `;


    document.body.appendChild(
      overlay
    );


    return overlay;

  }


  /* =====================================================
     PRÉSENTATION VISUELLE
     ===================================================== */

  function applyLetterStyle(
    card
  ){

    if(!card){
      return;
    }


    card
      .querySelectorAll("p")
      .forEach(
        function(p){

          p.style.color =
            "#111111";

          p.style.fontSize =
            "14px";

          p.style.fontWeight =
            "400";

          p.style.lineHeight =
            "1.55";

          p.style.margin =
            "0 0 12px 0";

        }
      );


    card
      .querySelectorAll(
        ".bociteCourrierTitle"
      )
      .forEach(
        function(title){

          title.style.color =
            "#2f5d46";

          title.style.fontSize =
            "17px";

          title.style.fontWeight =
            "700";

          title.style.lineHeight =
            "1.35";

          title.style.margin =
            "0 0 15px 0";

        }
      );


    colorBrands(
      card
    );

  }


  /* =====================================================
     AFFICHAGE D'UNE SÉQUENCE
     ===================================================== */

  function openNumbers(
    numbers,
    options,
    onComplete
  ){

    options =
      options || {};


    const queue =
      numbers.filter(
        function(number){

          return (
            options.force === true ||
            !isRead(number)
          );

        }
      );


    if(!queue.length){

      if(
        typeof onComplete ===
        "function"
      ){

        onComplete();

      }

      return;

    }


    const overlay =
      createOverlay();


    const notice =
      document.getElementById(
        "bociteRoleIntroductionNotice"
      );


    const card =
      document.getElementById(
        "bociteRoleIntroductionCard"
      );


    const button =
      document.getElementById(
        "bociteRoleIntroductionContinue"
      );


    let position =
      0;


    function showCurrent(){

      const number =
        queue[position];


      const html =
        getLetterHtml(
          number
        );


      if(!html){

        position++;


        if(
          position <
          queue.length
        ){

          showCurrent();

        }
        else{

          overlay.style.display =
            "none";


          if(
            typeof onComplete ===
            "function"
          ){

            onComplete();

          }

        }

        return;

      }


      /*
        Le message parental est séparé
        de la lettre elle-même.

        Le texte validé de la lettre
        n'est donc jamais modifié.
      */

      if(
        number ===
          LETTERS.jeune &&
        options.parentNotice ===
          true
      ){

        notice.innerHTML =
          getParentNotice();

        colorBrands(
          notice
        );

      }
      else{

        notice.innerHTML =
          "";

      }


      card.innerHTML =
        html;


      applyLetterStyle(
        card
      );


      overlay.style.display =
        "block";


      overlay.scrollTop =
        0;


      button.textContent =
        (
          position <
          queue.length - 1
        )
          ? "Lire la suite"
          : "Continuer";


      button.onclick =
        function(){

          markRead(
            number
          );


          position++;


          if(
            position <
            queue.length
          ){

            showCurrent();

            return;

          }


          overlay.style.display =
            "none";


          if(
            typeof onComplete ===
            "function"
          ){

            onComplete();

          }

        };

    }


    showCurrent();

  }


  /* =====================================================
     INTRODUCTION CORRESPONDANT AU PROFIL
     ===================================================== */

  function openForCategory(
    category,
    onComplete
  ){

    const normalized =
      String(
        category || ""
      )
      .trim()
      .toLowerCase();


    const numbers =
      PROFILE_MAP[
        normalized
      ];


    if(
      !numbers ||
      !numbers.length
    ){

      if(
        typeof onComplete ===
        "function"
      ){

        onComplete();

      }

      return;

    }


    openNumbers(
      numbers,
      {
        parentNotice:
          normalized ===
            "jeune"
      },
      onComplete
    );

  }


  /* =====================================================
     PREMIÈRE ENTRÉE DANS COMMERCE

     Pas de sous-tuile séparant
     petit commerce et grande enseigne.

     Les deux introductions sont donc
     proposées dans cette même branche.
     ===================================================== */

/* =========================================================
   ÇA COMMENCE ICI
   PREMIÈRE OUVERTURE DES UNIVERS
   ========================================================= */

function installCommerceOpening(){

  /*
    Le listener est placé sur WINDOW en capture.

    C'est volontaire :
    Entreprise possède déjà un raccordement
    en capture sur document.

    WINDOW passe avant DOCUMENT,
    donc l'introduction peut maintenant
    apparaître avant l'ouverture de l'application.
  */

  window.addEventListener(
    "click",
    function(event){

      const target =
        event.target &&
        typeof event.target.closest ===
          "function"
          ? event.target.closest(

              "#openCommerceSpace," +
              '[data-commerce-space="commerce"],' +
              "[data-open-commerce]," +

              '[data-open="ecole"],' +
              '[data-open="sport"],' +
              '[data-open="mairie"]'

            )
          : null;


      if(!target){
        return;
      }

      /*
        Après lecture, nous recréons le clic.

        Ce drapeau empêche l'introduction
        de bloquer ce deuxième clic.
      */

      if(
        target.__bociteIntroBypass ===
          true
      ){

        target.__bociteIntroBypass =
          false;

        return;
      }


      let numbers = [];

      /* ===================================================
         COMMERCE
         =================================================== */

      if(
        target.matches(
          "#openCommerceSpace," +
          '[data-commerce-space="commerce"],' +
          "[data-open-commerce]"
        )
      ){

        numbers = [

          LETTERS.commun,
          LETTERS.commerceProximite,
          LETTERS.grandeEnseigne

        ];

      }

      /* ===================================================
         ÉCOLE
         =================================================== */

      else if(
        target.matches(
          '[data-open="ecole"]'
        )
      ){

        numbers = [
          LETTERS.ecole
        ];

      }

      /* ===================================================
         SPORT
         =================================================== */

      else if(
        target.matches(
          '[data-open="sport"]'
        )
      ){

        numbers = [
          LETTERS.sport
        ];

      }

      /* ===================================================
         MAIRIE & ASSOCIATIONS

         Une même tuile accueille les deux.

         Si le compte indique clairement
         mairie ou association :
         on privilégie son courrier.

         Sinon :
         les deux introductions sont proposées.
         =================================================== */

      else if(
        target.matches(
          '[data-open="mairie"]'
        )
      ){

        let category = "";

        /*
          Première source :
          compte déjà chargé par le module
          d'inscription.
        */

        try{

          if(
            window.BoCiteArtRegistration &&
            typeof window
              .BoCiteArtRegistration
              .getAccount ===
                "function"
          ){

            const account =
              window
                .BoCiteArtRegistration
                .getAccount();

            if(
              account &&
              account.category
            ){

              category =
                String(
                  account.category
                )
                .trim()
                .toLowerCase();

            }

          }

        }catch(error){

          category = "";

        }

        /*
          Deuxième source de secours :
          compte local de démonstration.
        */

        if(!category){

          try{

            const raw =
              localStorage.getItem(
                "bociteart_account_demo_v1"
              );

            const account =
              raw
                ? JSON.parse(raw)
                : null;

            if(
              account &&
              account.category
            ){

              category =
                String(
                  account.category
                )
                .trim()
                .toLowerCase();

            }

          }catch(error){

            category = "";

          }

        }

        if(
          category ===
            "mairie"
        ){

          numbers = [
            LETTERS.mairie
          ];

        }
        else if(
          category ===
            "association"
        ){

          numbers = [
            LETTERS.association
          ];

        }
        else{

          numbers = [

            LETTERS.mairie,
            LETTERS.association

          ];

        }

      }

      if(
        !numbers.length
      ){

        return;
      }

      /*
        Si tout a déjà été lu,
        on laisse immédiatement
        le fonctionnement existant continuer.
      */

      if(
        !hasUnread(
          numbers
        )
      ){

        return;
      }

      /*
        Une introduction doit apparaître :
        on bloque uniquement ce premier clic.
      */

      event.preventDefault();

      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation ===
          "function"
      ){

        event.stopImmediatePropagation();

      }

      openNumbers(
        numbers,
        {},
        function(){

          /*
            Les introductions sont terminées.

            On relance exactement
            le même élément.

            À ce deuxième passage,
            le drapeau bypass laisse
            l'application existante s'ouvrir.
          */

/* =========================================================
   ÇA COMMENCE ICI
   REPRISE DE L'OUVERTURE APRÈS LES COURRIERS
   ========================================================= */

window.setTimeout(
  function(){

    /*
      Commerce possède déjà
      son fonctionnement onclick.

      On l'appelle directement
      pour éviter une nouvelle interception.
    */

    if(
      target.matches(
        "#openCommerceSpace," +
        '[data-commerce-space="commerce"],' +
        "[data-open-commerce]"
      ) &&
      typeof target.onclick ===
        "function"
    ){

      target.onclick.call(
        target
      );

      return;

    }


    /*
      Pour les autres univers,
      on conserve le clic normal
      avec le bypass.
    */

    target.__bociteIntroBypass =
      true;

    target.click();

  },
  0
);

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */

        }
      );

    },
    true
  );

}

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteRoleIntroductions = {

    openForCategory:
      openForCategory,

    openNumbers:
      openNumbers,

    isRead:
      isRead,

    hasUnread:
      hasUnread,

    markRead:
      markRead,

    letters:
      LETTERS

  };


  installCommerceOpening();


  console.log(
    "✅ Introductions Bo'CitéArt selon profil chargées"
  );

})();

/* =========================================================
   ÇA COMMENCE ICI
   BO'CITÉART — INTRODUCTIONS DES AUTRES UNIVERS

   ÉCOLE
   SPORT
   MAIRIE & ASSOCIATIONS
   ========================================================= */

(function installBociteOtherUniverseIntroductions(){

  "use strict";

  if(
    window.__bociteOtherUniverseIntroductionsV1
  ){
    return;
  }

  window.__bociteOtherUniverseIntroductionsV1 =
    true;


  window.addEventListener(
    "click",
    function(event){

      const target =
        event.target &&
        typeof event.target.closest ===
          "function"
          ? event.target.closest(
              '[data-open="ecole"],' +
              '[data-open="sport"],' +
              '[data-open="mairie"]'
            )
          : null;


      if(!target){
        return;
      }


      /*
        Deuxième clic :
        on laisse l'application
        fonctionner normalement.
      */

      if(
        target.__bociteOtherIntroBypass ===
          true
      ){

        target.__bociteOtherIntroBypass =
          false;

        return;
      }


      if(
        !window.BociteRoleIntroductions ||
        typeof window.BociteRoleIntroductions
          .openNumbers !==
            "function"
      ){

        return;
      }


      const letters =
        window.BociteRoleIntroductions
          .letters;


      if(!letters){
        return;
      }


      const universe =
        target.getAttribute(
          "data-open"
        );


      let numbers = [];


      /* ===================================================
         ÉCOLE
         =================================================== */

      if(
        universe ===
        "ecole"
      ){

        numbers = [
          letters.ecole
        ];

      }


      /* ===================================================
         SPORT
         =================================================== */

      else if(
        universe ===
        "sport"
      ){

        numbers = [
          letters.sport
        ];

      }


      /* ===================================================
         MAIRIE & ASSOCIATIONS
         =================================================== */

      else if(
        universe ===
        "mairie"
      ){

        let category = "";


        /*
          On regarde la catégorie
          du compte local existant.
        */

        try{

          const raw =
            localStorage.getItem(
              "bociteart_account_demo_v1"
            );


          const account =
            raw
              ? JSON.parse(raw)
              : null;


          if(
            account &&
            account.category
          ){

            category =
              String(
                account.category
              )
              .trim()
              .toLowerCase();

          }

        }catch(error){

          category = "";

        }


        /*
          Profil mairie :
          courrier mairie seulement.
        */

        if(
          category ===
          "mairie"
        ){

          numbers = [
            letters.mairie
          ];

        }


        /*
          Profil association :
          courrier association seulement.
        */

        else if(
          category ===
          "association"
        ){

          numbers = [
            letters.association
          ];

        }


        /*
          Autre visiteur :
          la tuile regroupe Mairie & Asso,
          donc découverte des deux regards.
        */

        else{

          numbers = [
            letters.mairie,
            letters.association
          ];

        }

      }


      if(!numbers.length){
        return;
      }


      /*
        Si les courriers concernés
        sont déjà lus,
        on laisse le clic normal.
      */

      if(
        typeof window.BociteRoleIntroductions
          .hasUnread ===
            "function" &&
        !window.BociteRoleIntroductions
          .hasUnread(
            numbers
          )
      ){

        return;
      }


      /*
        Un courrier doit être présenté :
        on bloque seulement ce premier clic.
      */

      event.preventDefault();

      event.stopPropagation();


      if(
        typeof event.stopImmediatePropagation ===
          "function"
      ){

        event.stopImmediatePropagation();

      }


      window.BociteRoleIntroductions
        .openNumbers(
          numbers,
          {},
          function(){

            /*
              Après lecture,
              on relance exactement
              la même tuile.

              Le drapeau permet
              au fonctionnement existant
              de reprendre sans nouvelle interception.
            */

            target.__bociteOtherIntroBypass =
              true;


            window.setTimeout(
              function(){

                target.click();

              },
              0
            );

          }
        );

    },
    true
  );


  console.log(
    "✅ Introductions École / Sport / Mairie & Asso raccordées"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */


