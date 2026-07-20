/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 1 — INFORMATIONS LÉGALES

   RGPD / CGU / CGV
   → INTRODUCTION

   Ce fichier affiche uniquement l'écran légal.
   Il ne décide jamais lui-même de la page suivante.
   ========================================================= */

(function initBociteartLegal(){ 

  "use strict";

  if(window.BociteLegal){
    return;
  }

  const OVERLAY_ID =
    "bociteLegalOverlay";

  const STORAGE_KEY =
    "bociteart_legal_acceptance_v2";

  const LEGAL_VERSION = {
    rgpd:"2026-07-19",
    cgu:"2026-07-19",
    cgv:"2026-07-19"
  };

  /* =====================================================
     OUTILS
     ===================================================== */

  function getElement(id){

    return document.getElementById(id);
  }

function getLogoHtml(){

  return `
    <span style="color:#2f5d46;font-weight:900;">Bo'Cité</span><span style="color:#b00020;font-weight:900;">Art</span>
  `;

}
  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles(){

    if(
      getElement(
        "bociteLegalStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteLegalStyles";

    style.textContent = `
      #${OVERLAY_ID} {
        position:fixed;
        inset:0;
        z-index:999999;
        overflow-y:auto;
        box-sizing:border-box;
        padding:16px 10px 34px;
        background:#f3eddf;
        color:#111;
        font-family:Arial,sans-serif;
      }

      #bociteLegalCard {
        width:100%;
        max-width:620px;
        margin:0 auto;
        box-sizing:border-box;
        padding:23px 18px;
        border:2px solid #2f5d46;
        border-radius:15px;
        background:#fffdf7;
        box-shadow:0 8px 28px rgba(0,0,0,.13);
      }

      .bociteLegalTitle {
        margin:0;
        text-align:center;
        font-size:28px;
        line-height:1.25;
      }

      .bociteLegalIntro {
        margin-top:18px;
        font-size:17px;
        line-height:1.55;
      }

      .bociteLegalDocumentBtn {
        display:block;
        width:100%;
        margin-top:10px;
        padding:13px 12px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        color:#111;
        font-size:17px;
        font-weight:800;
        text-align:left;
        cursor:pointer;
      }

      .bociteLegalDocumentBtn[aria-expanded="true"] {
        background:#f2eee4;
      }

      .bociteLegalDocumentContent {
        display:none;
        margin-top:7px;
        padding:15px 13px;
        border-left:6px solid #2f5d46;
        border-radius:8px;
        background:#f7f3ea;
        font-size:15px;
        line-height:1.55;
      }

      .bociteLegalDocumentContent.isOpen {
        display:block;
      }

      .bociteLegalDocumentContent h3 {
        margin:0 0 12px;
        font-size:19px;
      }

      .bociteLegalDocumentContent p {
        margin:10px 0;
      }

      .bociteLegalAcceptance {
        display:flex;
        align-items:flex-start;
        gap:11px;
        margin-top:20px;
        padding:16px 14px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        font-size:16px;
        line-height:1.45;
        cursor:pointer;
      }

      #bociteLegalAcceptCheckbox {
        width:21px;
        height:21px;
        margin:1px 0 0;
        flex:0 0 auto;
        accent-color:#2f5d46;
        cursor:pointer;
      }

      #bociteLegalContinueBtn {
        display:block;
        width:100%;
        margin-top:18px;
        padding:15px 12px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        color:#111;
        font-size:18px;
        font-weight:900;
        cursor:pointer;
      }

      #bociteLegalContinueBtn:disabled {
        background:#aaa;
        color:#fff;
        border-color:#888;
        cursor:not-allowed;
        opacity:.75;
      }

      #bociteLegalMessage {
        display:none;
        margin-top:12px;
        padding:12px;
        border-left:6px solid #b00020;
        background:#f7f3ea;
        font-size:15px;
        line-height:1.45;
      }

      .bociteLegalPrivacyNote {
        margin-top:16px;
        color:#333;
        font-size:14px;
        line-height:1.45;
        text-align:center;
      }

      @media(max-width:600px){

        #${OVERLAY_ID} {
          padding:9px 7px 26px;
        }

        #bociteLegalCard {
          padding:20px 14px;
          border-radius:12px;
        }

        .bociteLegalTitle {
          font-size:25px;
        }

        .bociteLegalIntro {
          font-size:16px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  /* =====================================================
     CONTENU
     ===================================================== */

  function getLegalHtml(){

    return `
      <div id="bociteLegalCard">

        <h2 class="bociteLegalTitle">
          ${getLogoHtml()}
        </h2>

        <div class="bociteLegalIntro">

          Avant de poursuivre,
          vous pouvez consulter les informations
          relatives à l'utilisation de l'application,
          à la protection de vos données
          et aux services proposés.

          <br><br>

          Votre validation sera enregistrée
          automatiquement avec sa date,
          son heure
          et la version des documents acceptés.

        </div>

        <button
          id="bociteLegalRgpdBtn"
          class="bociteLegalDocumentBtn"
          type="button"
          aria-expanded="false">

          Protection des données — RGPD

        </button>

         <div
          id="bociteLegalRgpdContent"
          class="bociteLegalDocumentContent"
          style="padding:0; overflow:hidden;">

          <div
            style="
              max-height:320px;
              overflow-y:auto;
              padding:22px;
            ">

            <h3>Politique de confidentialité — RGPD</h3>

            <p>
              <strong>
                <span style="color:#17613b;">Bo'Cité</span><span style="color:#c40021;">Art</span>
              </strong>
              attache une importance particulière à la protection
              des données personnelles et applique les principes
              du Règlement général sur la protection des données
              ainsi que la réglementation française applicable.
            </p>

            <h4>1. Responsable du traitement</h4>

            <p>
              Le responsable du traitement est l'éditeur de
              Bo'CitéArt. Ses coordonnées légales définitives
              seront précisées lors de la mise en exploitation
              officielle du service.
            </p>

            <h4>2. Données utilisées</h4>

            <p>
              Seules les informations nécessaires au fonctionnement
              des services utilisés, à la gestion des accès,
              à la sécurité, à l'assistance, aux prestations choisies
              et au respect des obligations légales sont susceptibles
              d'être traitées.
            </p>

            <h4>3. Statistiques anonymes</h4>

            <p>
              Des statistiques d'installation, d'activation
              et d'utilisation peuvent être établies sans enregistrer
              le nom de l'utilisateur.
            </p>

            <p>
              Elles peuvent notamment distinguer une catégorie déclarée,
              une commune et un secteur d'activité afin de produire
              des bilans anonymes ou agrégés.
            </p>

            <h4>4. Finalités</h4>

            <p>
              Les données sont utilisées pour assurer le fonctionnement
              et la sécurité de Bo'CitéArt, permettre l'accès
              aux fonctionnalités choisies, gérer les demandes,
              les publications, les abonnements, les paiements,
              la facturation et satisfaire aux obligations légales.
            </p>

            <h4>5. Paiements</h4>

            <p>
              Les données bancaires complètes sont traitées
              par les prestataires de paiement sécurisés concernés.
              Bo'CitéArt ne les conserve pas.
            </p>

            <h4>6. Conservation et destinataires</h4>

            <p>
              Les informations sont conservées pendant la durée
              nécessaire aux finalités poursuivies ou pendant
              les délais imposés par la réglementation.
            </p>

            <p>
              Elles sont accessibles uniquement aux personnes
              et prestataires autorisés qui doivent en connaître
              pour assurer le fonctionnement du service.
            </p>

            <h4>7. Droits des personnes</h4>

            <p>
              Chaque utilisateur peut exercer ses droits d'accès,
              de rectification, d'effacement, d'opposition,
              de limitation et de portabilité dans les conditions
              prévues par la réglementation.
            </p>

            <h4>8. Sécurité</h4>

            <p>
              Des mesures techniques et organisationnelles adaptées
              sont mises en œuvre afin de limiter les risques
              d'accès non autorisé, de perte, d'altération
              ou de divulgation des informations.
            </p>

            <h4>9. Protection des traitements et du savoir-faire</h4>

            <p>
              Les méthodes d'organisation, traitements, interfaces,
              architectures, processus, développements, logiques
              fonctionnelles et évolutions propres à Bo'CitéArt
              constituent des éléments protégés.
            </p>

            <p>
              Les présentes informations répondent aux obligations
              légales sans divulguer les mécanismes internes,
              procédés techniques ou méthodes propriétaires
              mis en œuvre.
            </p>

            <h4>10. Évolution</h4>

            <p>
              La présente politique peut être adaptée afin de tenir
              compte des évolutions légales, réglementaires,
              techniques ou fonctionnelles du service.
            </p>

          </div>

          <div
            style="
              border-top:2px solid #2e684d;
              padding:10px 16px;
              background:#eee9df;
              font-size:13px;
              font-weight:800;
              text-align:center;
            ">

            Faites défiler le contenu de ce cadre
            pour lire le document jusqu'au bout.

          </div>

        </div>

        <button
          id="bociteLegalCguBtn"
          class="bociteLegalDocumentBtn"
          type="button"
          aria-expanded="false">

          Conditions générales d'utilisation

        </button>

        <div
          id="bociteLegalCguContent"
          class="bociteLegalDocumentContent"
          style="padding:0; overflow:hidden;">

          <div
            style="
              max-height:320px;
              overflow-y:auto;
              padding:22px;
            ">

            <h3>Conditions générales d'utilisation</h3>

            <h4>1. Objet</h4>

            <p>
              Bo'CitéArt est une plateforme numérique proposant
              différents services et espaces accessibles selon
              le profil de l'utilisateur et les fonctionnalités
              disponibles.
            </p>

            <h4>2. Acceptation</h4>

            <p>
              L'accès ou l'utilisation de tout ou partie
              de Bo'CitéArt implique l'acceptation des présentes
              conditions.
            </p>

            <h4>3. Comptes et accès</h4>

            <p>
              L'utilisateur s'engage à fournir des informations
              exactes et à protéger ses identifiants.
            </p>

            <p>
              Les accès privés, professionnels ou administratifs
              ne doivent pas être communiqués à une personne
              non autorisée.
            </p>

            <h4>4. Utilisation loyale</h4>

            <p>
              Chaque utilisateur doit respecter les lois,
              les droits des tiers, les présentes conditions
              et le bon fonctionnement du service.
            </p>

            <p>
              Toute utilisation frauduleuse, détournée, abusive
              ou susceptible de nuire à Bo'CitéArt peut entraîner
              la limitation, la suspension ou la suppression
              de l'accès concerné.
            </p>

            <h4>5. Contenus publiés</h4>

            <p>
              Chaque utilisateur demeure responsable des informations,
              annonces, documents, images ou contenus qu'il publie
              ou transmet.
            </p>

            <p>
              Bo'CitéArt peut refuser, suspendre ou retirer
              tout contenu manifestement illicite, trompeur,
              inapproprié ou portant atteinte aux droits d'autrui.
            </p>

            <h4>6. Disponibilité</h4>

            <p>
              Bo'CitéArt met en œuvre les moyens raisonnables
              pour assurer la disponibilité du service,
              sans garantir un fonctionnement permanent
              ou exempt d'interruption.
            </p>

            <h4>7. Responsabilité</h4>

            <p>
              Bo'CitéArt est un outil numérique de services
              et de communication. Il ne constitue pas un service
              de secours, de surveillance, de téléassistance
              ou d'intervention.
            </p>

            <p>
              Sa responsabilité ne peut être engagée pour les dommages
              résultant d'une mauvaise utilisation, d'une défaillance
              des réseaux ou équipements, d'un prestataire extérieur
              ou d'un événement indépendant de sa volonté,
              dans les limites prévues par la loi.
            </p>

            <h4>8. Propriété intellectuelle</h4>

            <p>
              Le nom Bo'CitéArt, sa marque, son identité visuelle,
              son concept, ses textes, contenus, interfaces,
              architectures, développements, bases de données,
              traitements, méthodes, processus, organisations
              et savoir-faire sont protégés.
            </p>

            <p>
              La consultation du service ne confère aucun droit
              de reproduction, d'exploitation, d'adaptation,
              d'extraction, de diffusion ou de réutilisation,
              totale ou partielle, sans autorisation écrite préalable.
            </p>

            <h4>9. Protection contre le picking et l'analyse automatisée</h4>

            <p>
              Toute collecte systématique, aspiration, extraction,
              analyse, copie, décompilation, contournement,
              ingénierie inverse ou réutilisation de tout ou partie
              de Bo'CitéArt est interdite sans autorisation écrite
              préalable.
            </p>

            <p>
              Cette interdiction concerne également l'utilisation
              de robots, scripts, outils automatisés, systèmes
              d'intelligence artificielle, techniques d'exploration
              de données ou procédés similaires, sous réserve
              des droits impérativement prévus par la loi.
            </p>

            <h4>10. Évolution des services</h4>

            <p>
              Bo'CitéArt peut modifier, compléter, suspendre
              ou faire évoluer ses fonctionnalités pour assurer
              son développement, sa sécurité et sa conformité.
            </p>

            <h4>11. Acceptation électronique</h4>

            <p>
              La validation électronique des présentes conditions
              matérialise leur acceptation dans les conditions
              prévues par la réglementation applicable.
            </p>

            <h4>12. Divisibilité</h4>

            <p>
              Si une disposition devait être déclarée nulle
              ou inapplicable, les autres dispositions
              conserveraient leur effet.
            </p>

            <h4>13. Droit applicable</h4>

            <p>
              Les présentes conditions sont régies par le droit français.
              Une recherche de solution amiable sera privilégiée
              avant toute procédure, sans préjudice des dispositions
              impératives applicables.
            </p>

          </div>

          <div
            style="
              border-top:2px solid #2e684d;
              padding:10px 16px;
              background:#eee9df;
              font-size:13px;
              font-weight:800;
              text-align:center;
            ">

            Faites défiler le contenu de ce cadre
            pour lire le document jusqu'au bout.

          </div>

        </div>

        <button
          id="bociteLegalCgvBtn"
          class="bociteLegalDocumentBtn"
          type="button"
          aria-expanded="false">

          Conditions générales de vente

        </button>

        <div
          id="bociteLegalCgvContent"
          class="bociteLegalDocumentContent"
          style="padding:0; overflow:hidden;">

          <div
            style="
              max-height:320px;
              overflow-y:auto;
              padding:22px;
            ">

            <h3>Conditions générales de vente</h3>

            <h4>1. Services concernés</h4>

            <p>
              Les présentes conditions encadrent les services payants,
              abonnements, prestations, publications, réservations
              publicitaires et accès professionnels proposés
              par Bo'CitéArt.
            </p>

            <p>
              La simple consultation des espaces publics ne crée
              aucun abonnement ni engagement de paiement.
            </p>

            <h4>2. Information préalable</h4>

            <p>
              Les caractéristiques essentielles, le tarif,
              la durée, les modalités de paiement et les conditions
              applicables sont présentés avant toute validation.
            </p>

            <h4>3. Commande</h4>

            <p>
              Toute commande, souscription ou réservation devient
              effective après validation et, lorsque cela est requis,
              après confirmation du paiement ou acceptation
              par Bo'CitéArt.
            </p>

            <h4>4. Tarifs et paiement</h4>

            <p>
              Les tarifs applicables sont ceux affichés au moment
              de la validation.
            </p>

            <p>
              Les paiements sont réalisés par l'intermédiaire
              de prestataires sécurisés. L'accès à un service payant
              peut être suspendu tant que le règlement n'est pas confirmé.
            </p>

            <h4>5. Réservations et diffusions</h4>

            <p>
              Certaines prestations nécessitent une réservation préalable.
              Une réservation validée devient ferme selon les conditions
              présentées avant sa confirmation.
            </p>

            <h4>6. Annulation et droit de rétractation</h4>

            <p>
              Les possibilités d'annulation, de modification,
              de report ou de rétractation dépendent de la nature
              du service, de la qualité du client et des conditions
              présentées lors de la commande.
            </p>

            <p>
              Les droits légaux impératifs du consommateur restent
              applicables lorsqu'ils sont prévus par la réglementation.
            </p>

            <h4>7. Facturation</h4>

            <p>
              Une facture ou un justificatif est établi lorsque
              la nature de la prestation ou la réglementation
              l'exige.
            </p>

            <h4>8. Absence de garantie de résultat</h4>

            <p>
              Bo'CitéArt met en œuvre des moyens raisonnables
              pour assurer ses prestations, sans garantir
              un résultat économique, commercial, financier,
              publicitaire ou un niveau de fréquentation déterminé.
            </p>

            <h4>9. Responsabilité</h4>

            <p>
              La responsabilité de Bo'CitéArt ne peut être engagée
              en cas de force majeure, d'interruption indépendante
              de sa volonté, de défaillance d'un réseau, d'un équipement,
              d'un prestataire ou d'une utilisation non conforme,
              dans les limites autorisées par la loi.
            </p>

            <h4>10. Propriété intellectuelle et protection du savoir-faire</h4>

            <p>
              Le concept Bo'CitéArt, sa marque, son identité,
              ses architectures, interfaces, développements,
              contenus, méthodes, traitements, processus,
              logiques fonctionnelles et savoir-faire demeurent
              la propriété de leurs titulaires.
            </p>

            <p>
              Toute reproduction, extraction, adaptation, analyse,
              décompilation, ingénierie inverse, diffusion,
              réutilisation ou exploitation, totale ou partielle,
              est interdite sans autorisation écrite préalable.
            </p>

            <p>
              Cette interdiction s'applique également aux opérations
              réalisées au moyen d'outils automatisés, de robots,
              de scripts, de techniques d'exploration de données
              ou de systèmes d'intelligence artificielle,
              sauf disposition légale impérative contraire.
            </p>

            <h4>11. Évolution</h4>

            <p>
              Les offres, services et fonctionnalités peuvent évoluer
              afin de répondre aux besoins des utilisateurs
              et aux évolutions techniques, réglementaires ou légales.
            </p>

            <h4>12. Acceptation électronique</h4>

            <p>
              La validation électronique d'une commande
              ou des présentes conditions matérialise leur acceptation
              dans les conditions prévues par la réglementation.
            </p>

            <h4>13. Divisibilité</h4>

            <p>
              Si une disposition devait être déclarée nulle
              ou inapplicable, les autres dispositions
              conserveraient leur effet.
            </p>

            <h4>14. Droit applicable</h4>

            <p>
              Les présentes conditions sont régies par le droit français.
              Une recherche de solution amiable sera privilégiée
              avant toute procédure, sans préjudice des règles
              impératives applicables.
            </p>

          </div>

          <div
            style="
              border-top:2px solid #2e684d;
              padding:10px 16px;
              background:#eee9df;
              font-size:13px;
              font-weight:800;
              text-align:center;
            ">

            Faites défiler le contenu de ce cadre
            pour lire le document jusqu'au bout.

          </div>

        </div>

        <label
          class="bociteLegalAcceptance"
          for="bociteLegalAcceptCheckbox">

          <input
            id="bociteLegalAcceptCheckbox"
            type="checkbox">

          <span>
            J'ai pris connaissance
            des informations relatives au RGPD,
            aux conditions générales d'utilisation
            et aux conditions générales de vente,
            et je souhaite poursuivre.
          </span>

        </label>

        <div
          id="bociteLegalMessage"
          role="alert">

          Cochez la case
          pour confirmer votre acceptation
          avant de continuer.

        </div>

        <button
          id="bociteLegalContinueBtn"
          type="button"
          disabled>

          Valider et continuer

        </button>

        <div class="bociteLegalPrivacyNote">

          Cette page ne peut pas passer
          à l'étape suivante
          sans votre clic.

        </div>

      </div>
    `;
  }

  /* =====================================================
     OUVERTURE ET FERMETURE
     ===================================================== */

  function closeLegal(){

    const overlay =
      getElement(
        OVERLAY_ID
      );

    if(overlay){
      overlay.remove();
    }
  }

  function openLegal(){

    installStyles();
    closeLegal();

    const overlay =
      document.createElement("div");

    overlay.id =
      OVERLAY_ID;

    overlay.innerHTML =
      getLegalHtml();

    document.body.appendChild(
      overlay
    );

    bindLegal();

    overlay.scrollTop = 0;
  }

  /* =====================================================
     ACCEPTATION
     ===================================================== */

  function createAcceptanceRecord(){

    const now =
      new Date();

    return {
      accepted:true,
      acceptedAt:
        now.toISOString(),
      localDate:
        now.toLocaleDateString("fr-FR"),
      localTime:
        now.toLocaleTimeString("fr-FR"),
      documents:
        Object.assign(
          {},
          LEGAL_VERSION
        ),
      source:
        "bociteart-entry-v6"
    };
  }

  function saveAcceptance(){

    const record =
      createAcceptanceRecord();

    try{

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(record)
      );

    }catch(error){

      console.warn(
        "Bo'CitéArt : validation légale non enregistrée.",
        error
      );
    }

    return record;
  }

  /* =====================================================
     ÉVÉNEMENTS
     ===================================================== */

  function toggleDocument(
    buttonId,
    contentId
  ){

    const button =
      getElement(buttonId);

    const content =
      getElement(contentId);

    if(
      !button ||
      !content
    ){
      return;
    }

    const opening =
      !content.classList.contains(
        "isOpen"
      );

    content.classList.toggle(
      "isOpen",
      opening
    );

    button.setAttribute(
      "aria-expanded",
      String(opening)
    );
  }

  function completeLegal(){

    const checkbox =
      getElement(
        "bociteLegalAcceptCheckbox"
      );

    const message =
      getElement(
        "bociteLegalMessage"
      );

    if(
      !checkbox ||
      !checkbox.checked
    ){

      if(message){
        message.style.display =
          "block";
      }

      return;
    }

    const acceptance =
      saveAcceptance();

    closeLegal();

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:legal-completed",
        {
          detail:{
            acceptance:
              acceptance
          }
        }
      )
    );
  }

  function bindLegal(){

    const checkbox =
      getElement(
        "bociteLegalAcceptCheckbox"
      );

    const continueButton =
      getElement(
        "bociteLegalContinueBtn"
      );

    const message =
      getElement(
        "bociteLegalMessage"
      );

    const rgpdButton =
      getElement(
        "bociteLegalRgpdBtn"
      );

    const cguButton =
      getElement(
        "bociteLegalCguBtn"
      );

    const cgvButton =
      getElement(
        "bociteLegalCgvBtn"
      );

    if(rgpdButton){

      rgpdButton.onclick =
        function(){

          toggleDocument(
            "bociteLegalRgpdBtn",
            "bociteLegalRgpdContent"
          );
        };
    }

    if(cguButton){

      cguButton.onclick =
        function(){

          toggleDocument(
            "bociteLegalCguBtn",
            "bociteLegalCguContent"
          );
        };
    }

    if(cgvButton){

      cgvButton.onclick =
        function(){

          toggleDocument(
            "bociteLegalCgvBtn",
            "bociteLegalCgvContent"
          );
        };
    }

    if(checkbox){

      checkbox.onchange =
        function(){

          if(continueButton){

            continueButton.disabled =
              !checkbox.checked;
          }

          if(
            message &&
            checkbox.checked
          ){

            message.style.display =
              "none";
          }
        };
    }

    if(continueButton){

      continueButton.onclick =
        completeLegal;
    }
  }

  /* =====================================================
     API PUBLIQUE
     ===================================================== */

  window.BociteLegal = {
    open:openLegal,
    close:closeLegal,
    storageKey:STORAGE_KEY,
    version:LEGAL_VERSION
  };

  console.log(
    "✅ Étape légale Bo'CitéArt V6 prête"
  );

})();
