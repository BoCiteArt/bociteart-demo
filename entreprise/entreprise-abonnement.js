/* =========================================================
   BO'CITÉART — ENTREPRISE
   MODULE ABONNEMENT PROFESSIONNEL V2
   AVANTAGES • RENOUVELLEMENT • PAIEMENT • VALEUR CRÉÉE
   ========================================================= */

(function initEntrepriseAbonnement(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-abonnement.js."
    );

    return;
  }

  function getElement(id){

    return document.getElementById(id);
  }

  /* =======================================================
     1. STYLE
     ======================================================= */

  function injectSubscriptionStyles(){

    if(
      document.getElementById(
        "bociteEntrepriseAbonnementStylesV2"
      )
    ){
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "bociteEntrepriseAbonnementStylesV2";

    style.textContent = `

      .bociteSubscriptionBox{
        background:#ffffff !important;
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.55 !important;
      }

      .bociteSubscriptionBox,
      .bociteSubscriptionBox div,
      .bociteSubscriptionBox span,
      .bociteSubscriptionBox p{
        font-weight:400;
      }

      .bociteSubscriptionTitle{
        display:block;
        color:#2f5d46 !important;
        font-size:17px !important;
        font-weight:800 !important;
        line-height:1.35 !important;
        margin:0;
      }

      .bociteSubscriptionText{
        color:#111111 !important;
        font-size:14px !important;
        font-weight:400 !important;
        line-height:1.55 !important;
        margin-top:8px;
      }

      .bociteSubscriptionBenefit{
        display:block;
        margin-top:6px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      }

      .bociteSubscriptionHighlight{
        color:#2f5d46;
        font-size:14px;
        font-weight:700;
      }

      .bociteSubscriptionButton{
        width:100%;
        margin-top:8px;
        background:#ffffff !important;
        background-color:#ffffff !important;
        color:#111111 !important;
      }

      .bociteSubscriptionGrid{
        display:grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap:8px;
        margin-top:10px;
      }

      .bociteSubscriptionMetric{
        background:#ffffff;
        border:1px solid #d7d7d7;
        border-radius:10px;
        padding:10px;
        color:#111111;
        font-size:14px;
        font-weight:400;
      }

      .bociteSubscriptionMetric strong{
        display:block;
        color:#2f5d46;
        font-size:17px;
        font-weight:800;
        margin-bottom:3px;
      }

      .bociteSubscriptionStatus{
        display:inline-block;
        padding:4px 8px;
        border-radius:20px;
        background:#edf6ef;
        color:#2f5d46;
        font-size:13px;
        font-weight:700;
      }

      .bociteSubscriptionBrand{
        white-space:nowrap;
        font-weight:900 !important;
      }

      @media(max-width:520px){

        .bociteSubscriptionGrid{
          grid-template-columns:1fr;
        }

      }

    `;

    document.head
      .appendChild(
        style
      );
  }

  injectSubscriptionStyles();

  /* =======================================================
     2. LOGO TEXTE
     ======================================================= */

  function getBrandHtml(){

    return `
      <strong
        class="bociteSubscriptionBrand">
        <span
          style="color:#2f5d46;">
          Bo'Cité
        </span><span
          style="color:#b00020;">
          Art
        </span>
      </strong>
    `;
  }

  /* =======================================================
     3. DONNÉES ABONNEMENT
     ======================================================= */

  function getCurrentPlan(){

    if(
      typeof module.loadProfessionalSearchPlan ===
      "function"
    ){

      return (
        module.loadProfessionalSearchPlan() ||
        {}
      );
    }

    try{

      return JSON.parse(
        localStorage.getItem(
          "bociteart_entreprise_search_plan_v1"
        ) || "{}"
      );

    }catch(error){

      return {};
    }
  }

  function getSubscriptionAnniversary(plan){

    if(
      !plan ||
      !plan.startedAt
    ){

      return "";
    }

    const start =
      new Date(
        Number(
          plan.startedAt
        )
      );

    if(
      Number.isNaN(
        start.getTime()
      )
    ){
      return "";
    }

    const next =
      new Date(
        start
      );

    next.setFullYear(
      next.getFullYear() + 1
    );

    return next
      .toLocaleDateString(
        "fr-FR"
      );
  }

  /* =======================================================
     4. VALEUR CRÉÉE
     ======================================================= */

  function getProfessionalValue(){

    if(
      typeof module.loadProfessionalValue ===
      "function"
    ){

      return (
        module.loadProfessionalValue() ||
        {}
      );
    }

    return {};
  }

  /* =======================================================
     5. CONTENU PRINCIPAL
     ======================================================= */

  function getSubscriptionHtml(){

    const plan =
      getCurrentPlan();

    const value =
      getProfessionalValue();

    const anniversary =
      getSubscriptionAnniversary(
        plan
      );

    const premiumStatus =
      typeof module.getPremiumStatus ===
      "function"
        ? module.getPremiumStatus()
        : {
            frozen:false
          };

    const planLabel =
      plan.plan === "europe"
        ? "Recherche professionnelle Europe"
        : (
            plan.plan === "france"
              ? "Recherche professionnelle France"
              : "Accès professionnel local"
          );

    return `

      <div
        class="
          box
          bociteSubscriptionBox
        "
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteSubscriptionTitle">
          Un abonnement professionnel conçu pour être utile au quotidien
        </div>

        <div
          class="bociteSubscriptionText">

          ${getBrandHtml()}
          ne vous propose pas seulement
          une présence dans un annuaire.

          <br><br>

          Votre abonnement réunit progressivement
          plusieurs outils destinés
          à développer votre activité,
          gagner du temps,
          recruter,
          être mieux visible
          et mieux maîtriser certaines dépenses.

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Un annuaire vivant et enrichi
        </div>

        <div
          class="bociteSubscriptionText">

          Votre entreprise peut être présentée
          au-delà de son simple nom.

          <span
            class="bociteSubscriptionBenefit">
            • activité et métiers ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • savoir-faire et services ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • coordonnées et site Internet ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • recrutements ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • actualités et visibilité locale ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • informations professionnelles utiles.
          </span>

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Recherchez vos futurs partenaires
        </div>

        <div
          class="bociteSubscriptionText">

          Recherchez plus facilement :

          <span
            class="bociteSubscriptionBenefit">
            • fournisseurs ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • sous-traitants ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • partenaires ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • compétences ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • produits et services professionnels.
          </span>

          <br>

          Selon la formule souscrite,
          la recherche peut être élargie
          à votre département,
          votre région,
          la France
          puis aux pays européens disponibles.

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Recrutez et conservez votre historique
        </div>

        <div
          class="bociteSubscriptionText">

          Publiez vos besoins,
          recevez les candidatures
          et retrouvez vos échanges
          depuis votre espace professionnel.

          <span
            class="bociteSubscriptionBenefit">
            • offres d'emploi ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • stages et alternances ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • candidatures spontanées ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • historique daté et horodaté.
          </span>

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Faites connaître votre entreprise
        </div>

        <div
          class="bociteSubscriptionText">

          Utilisez les espaces de visibilité
          ${getBrandHtml()}
          pour présenter votre entreprise,
          vos métiers,
          votre actualité
          ou une publicité ponctuelle.

          <br><br>

          Les publications payantes restent distinctes
          de l'abonnement
          afin que vous gardiez la maîtrise
          de vos dépenses.

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Payez moins de charges
        </div>

        <div
          class="bociteSubscriptionText">

          Découvrez les besoins similaires
          d'autres professionnels
          et les possibilités de regroupement
          concernant notamment :

          <span
            class="bociteSubscriptionBenefit">
            • électricité et gaz ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • assurances ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • téléphonie et Internet ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • véhicules ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • entretien ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • fournitures et formations.
          </span>

          <br>

          <span
            class="bociteSubscriptionHighlight">
            Un simple clin d'œil :
            les économies réellement obtenues
            sur certaines charges
            peuvent contribuer à financer
            tout ou partie de votre abonnement.
          </span>

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Un Tableau de Direction pour tout retrouver
        </div>

        <div
          class="bociteSubscriptionText">

          Retrouvez progressivement
          dans un seul espace :

          <span
            class="bociteSubscriptionBenefit">
            • vos offres et candidatures ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • vos factures ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • vos recherches professionnelles ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • vos actions de visibilité ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • vos partenaires ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • vos économies mesurées ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • vos principaux indicateurs.
          </span>

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Déléguez certaines tâches à vos collaborateurs
        </div>

        <div
          class="bociteSubscriptionText">

          Le responsable principal
          pourra autoriser un collaborateur
          à gérer certains services,
          par exemple :

          <span
            class="bociteSubscriptionBenefit">
            • préparer une publicité ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • gérer les offres d'emploi ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • consulter certaines recherches ;
          </span>

          <span
            class="bociteSubscriptionBenefit">
            • suivre certains outils professionnels.
          </span>

          <br>

          Le responsable conserve la maîtrise
          des autorisations
          et peut retirer un accès
          à tout moment.

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        "
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteSubscriptionTitle">
          Votre abonnement actuel
        </div>

        <div
          class="bociteSubscriptionText">

          Formule :

          <strong
            style="
              color:#2f5d46;
              font-weight:700;
            ">
            ${planLabel}
          </strong>

          <br><br>

          État :

          <span
            class="bociteSubscriptionStatus">

            ${
              premiumStatus.frozen
                ? "Services premium temporairement gelés"
                : "Actif"
            }

          </span>

          ${
            anniversary
              ? `
                  <br><br>

                  Prochaine date anniversaire :

                  <strong
                    style="
                      color:#2f5d46;
                      font-weight:700;
                    ">
                    ${anniversary}
                  </strong>
                `
              : ""
          }

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Renouvellement annuel
        </div>

        <div
          class="bociteSubscriptionText">

          L'abonnement annuel est prévu
          avec renouvellement à sa date anniversaire,
          selon les conditions contractuelles
          applicables à la formule choisie.

          <br><br>

          Avant l'échéance,
          le professionnel retrouve
          dans son espace
          le montant,
          la date
          et le moyen de paiement utilisé.

          <br><br>

          En cas d'échec de paiement,
          le professionnel est informé.

          <br><br>

          Un dernier rappel est prévu
          cinq jours après l'échéance
          si le règlement n'a toujours pas été confirmé.

          <br><br>

          Si le paiement reste impayé,
          seuls les services premium sont gelés.

          <br><br>

          Le compte,
          les données,
          les factures
          et les fonctions de base
          restent accessibles.

          <br><br>

          Dès que le paiement est confirmé,
          les services premium sont réactivés.

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Choisissez votre moyen de paiement
        </div>

        <div
          class="bociteSubscriptionText">

          Les abonnements pourront être réglés
          principalement par prélèvement SEPA
          ou par le moyen de paiement
          proposé dans votre espace.

          <br><br>

          Lorsque le virement bancaire sera disponible,
          les coordonnées bancaires officielles
          ${getBrandHtml()}
          seront fournies directement
          depuis la configuration financière centrale.

          <br><br>

          Elles ne seront jamais recopiées
          manuellement dans plusieurs rubriques.

        </div>

        <button
          id="subscriptionPaymentMethodBtn"
          class="
            choiceBtn
            bociteSubscriptionButton
          "
          type="button">
          Voir mes moyens de paiement
        </button>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        ">

        <div
          class="bociteSubscriptionTitle">
          Ce que votre abonnement vous apporte
        </div>

        <div
          class="bociteSubscriptionText">

          À mesure que vous utilisez
          ${getBrandHtml()},
          cet espace pourra vous montrer
          concrètement ce que votre abonnement
          vous a apporté pendant l'année.

        </div>

        <div
          class="bociteSubscriptionGrid">

          <div
            class="bociteSubscriptionMetric">

            <strong>
              ${Number(
                value.profileViews || 0
              )}
            </strong>

            consultations de votre fiche

          </div>

          <div
            class="bociteSubscriptionMetric">

            <strong>
              ${Number(
                value.contacts || 0
              )}
            </strong>

            contacts reçus

          </div>

          <div
            class="bociteSubscriptionMetric">

            <strong>
              ${Number(
                value.applications || 0
              )}
            </strong>

            candidatures

          </div>

          <div
            class="bociteSubscriptionMetric">

            <strong>
              ${Number(
                value.professionalRequests || 0
              )}
            </strong>

            demandes professionnelles

          </div>

          <div
            class="bociteSubscriptionMetric">

            <strong>
              ${Number(
                value.partnerships || 0
              )}
            </strong>

            opportunités ou partenariats

          </div>

          <div
            class="bociteSubscriptionMetric">

            <strong>
              ${Number(
                value.measuredSavings || 0
              ).toLocaleString(
                "fr-FR",
                {
                  minimumFractionDigits:2,
                  maximumFractionDigits:2
                }
              )} €
            </strong>

            économies mesurées

          </div>

        </div>

      </div>


      <div
        class="
          box
          bociteSubscriptionBox
        "
        style="
          border-left:6px solid #2f5d46;
        ">

        <div
          class="bociteSubscriptionTitle">
          L'objectif reste simple
        </div>

        <div
          class="bociteSubscriptionText">

          L'objectif n'est pas simplement
          de vendre un abonnement.

          <br><br>

          L'objectif est que les services proposés
          puissent apporter au professionnel
          davantage de valeur
          que le coût de son abonnement.

        </div>

      </div>


      <div
        class="entrepriseModuleActions">

        <button
          id="subscriptionMonthlyBtn"
          class="
            choiceBtn
            bociteSubscriptionButton
          "
          type="button">
          Choisir un abonnement mensuel
        </button>

        <button
          id="subscriptionAnnualBtn"
          class="
            choiceBtn
            bociteSubscriptionButton
          "
          type="button">
          Choisir un abonnement annuel
        </button>

        <button
          id="subscriptionBillingBtn"
          class="
            choiceBtn
            bociteSubscriptionButton
          "
          type="button">
          Mes abonnements et factures
        </button>

        <button
          id="subscriptionCollaboratorsBtn"
          class="
            choiceBtn
            bociteSubscriptionButton
          "
          type="button">
          Gérer mes collaborateurs
        </button>

      </div>

    `;
  }

  /* =======================================================
     6. BOUTONS
     ======================================================= */

  function bindSubscription(){

    const monthlyButton =
      getElement(
        "subscriptionMonthlyBtn"
      );

    const annualButton =
      getElement(
        "subscriptionAnnualBtn"
      );

    const billingButton =
      getElement(
        "subscriptionBillingBtn"
      );

    const collaboratorsButton =
      getElement(
        "subscriptionCollaboratorsBtn"
      );

    const paymentMethodButton =
      getElement(
        "subscriptionPaymentMethodBtn"
      );


    if(monthlyButton){

      monthlyButton.onclick =
        function(){

          if(
            typeof module.activateSearchSubscription ===
            "function"
          ){

            module.activateSearchSubscription(
              "france",
              "mensuel"
            );

            return;
          }

          alert(
            "Le module de paiement sera raccordé ici."
          );
        };
    }


    if(annualButton){

      annualButton.onclick =
        function(){

          if(
            typeof module.activateSearchSubscription ===
            "function"
          ){

            module.activateSearchSubscription(
              "france",
              "annuel"
            );

            return;
          }

          alert(
            "Le module de paiement sera raccordé ici."
          );
        };
    }


    if(billingButton){

      billingButton.onclick =
        function(){

          if(
            typeof module.openSearchBilling ===
            "function"
          ){

            module.openSearchBilling();

            return;
          }

          alert(
            "L'espace facturation sera disponible après chargement."
          );
        };
    }


    if(collaboratorsButton){

      collaboratorsButton.onclick =
        function(){

          if(
            window.BoCiteArtRegistration &&
            typeof window.BoCiteArtRegistration
              .openCollaborators ===
            "function"
          ){

            window.BoCiteArtRegistration
              .openCollaborators();

            return;
          }

          if(
            typeof module.openCollaborators ===
            "function"
          ){

            module.openCollaborators();

            return;
          }

          alert(
            "La gestion des collaborateurs est préparée et sera raccordée au compte professionnel central."
          );
        };
    }


    if(paymentMethodButton){

      paymentMethodButton.onclick =
        function(){

          const bank =
            typeof module.getBociteBankInformation ===
            "function"
              ? module.getBociteBankInformation()
              : {};

          const hasBank =
            !!(
              bank &&
              bank.iban
            );

          alert(
            hasBank
              ? (
                  "Moyens de paiement disponibles :\n\n" +
                  "• paiement électronique ;\n" +
                  "• prélèvement SEPA ;\n" +
                  "• virement bancaire.\n\n" +
                  "Les coordonnées bancaires officielles sont disponibles dans votre espace sécurisé."
                )
              : (
                  "Les moyens de paiement sont préparés.\n\n" +
                  "L'IBAN professionnel Bo'CitéArt sera affiché ici dès son raccordement officiel."
                )
          );
        };
    }
  }

  /* =======================================================
     7. OUVERTURE
     ======================================================= */

  function openSubscriptionModule(){

    module.renderModulePage(

      "Abonnement professionnel",

      getSubscriptionHtml(),

      {
        afterRender:
          bindSubscription
      }

    );
  }

  module.registerScreen(
    "abonnement",
    openSubscriptionModule
  );

  module.openSubscriptionModule =
    openSubscriptionModule;

  console.log(
    "✅ Abonnement professionnel V2 chargé"
  );

})();
