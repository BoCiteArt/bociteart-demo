/* =========================================================
   BO'CITÉART — ENTREPRISE
   VISIBILITÉ & COMMUNICATION
   PORTE D'ENTRÉE SIMPLE
   ========================================================= */

(function initEntrepriseVisibilite(){

  "use strict";

  const module =
    window.BociteEntreprise;


  if(!module){

    console.error(
      "Bo'CitéArt : entreprise.js doit être chargé avant entreprise-visibilite.js."
    );

    return;
  }


  /* =======================================================
     OUTILS
     ======================================================= */

  function getElement(id){

    return document.getElementById(
      id
    );
  }


  function getBrandHtml(){

 return `<strong style="white-space:nowrap;font-weight:700;"><span style="color:#2f5d46;">Bo'Cité</span><span style="color:#b00020;">Art</span></strong>`;
  }


  /* =======================================================
     PAGE PRINCIPALE
     ======================================================= */

  function getVisibilityHtml(){

    return `

      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            line-height:1.3;
          ">
          Visibilité & communication
        </div>

        <div
          style="
            margin-top:8px;
            color:#111111;
            font-size:14px;
            font-weight:400;
          ">

          Préparez simplement
          votre communication locale.

          <br><br>

          ${getBrandHtml()}
          vous aide à réfléchir,
          préparer,
          tester
          et suivre vos actions.

        </div>

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:10px;
          ">
          Avant de commencer
        </div>

        Posez-vous une seule question :

        <br><br>

        <strong
          style="
            color:#111111;
            font-size:14px;
            font-weight:700;
          ">
          Quel résultat voulez-vous obtenir ?
        </strong>

        <br><br>

        • Faire venir des clients<br>
        • Faire connaître une offre<br>
        • Présenter un produit ou un service<br>
        • Obtenir des appels ou des contacts<br>
        • Obtenir des demandes de devis<br>
        • Obtenir des réservations<br>
        • Faire connaître votre savoir-faire<br>
        • Recruter

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:8px;
          ">
          Pense-bête
        </div>

        Avant de publier,
        vérifiez simplement :

        <br><br>

        • À qui voulez-vous parler ?<br>
        • Quel message doit être retenu ?<br>
        • Pourquoi agir maintenant ?<br>
        • Votre offre est-elle immédiatement comprise ?<br>
        • La date, le lieu ou le contact sont-ils indiqués ?

        <br><br>

        <strong
          style="
            color:#111111;
            font-size:14px;
            font-weight:700;
          ">
          Si une seule chose devait être retenue
          de votre publicité,
          laquelle serait-ce ?
        </strong>

      </div>


      <button
        id="visibilityAdvertisingBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Préparer une publicité
      </button>


      <button
        id="visibilityNewsBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Publier une actualité
      </button>


      <button
        id="visibilityEmploymentBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Recruter
      </button>


      <button
        id="visibilityDirectoryBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Voir ma présence dans l'annuaire
      </button>


      <button
        id="visibilityResultsBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#ffffff !important;
          color:#111111 !important;
        ">
        Voir les résultats de mes communications
      </button>


      <div
        class="box"
        style="
          margin-top:12px;
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:8px;
          ">
          Pour une publicité
        </div>

        Vous pourrez :

        <br><br>

        • préparer votre message ;<br>
        • ajouter vos photos ;<br>
        • voir votre publicité avant diffusion ;<br>
        • choisir les outils utiles ;<br>
        • tester le parcours à blanc ;<br>
        • faire valider la publicité ;<br>
        • suivre ensuite ses résultats.

        <br><br>

        Toute publicité préparée
        par un collaborateur
        devra être validée
        par le responsable
        avant sa diffusion.

      </div>

    `;
  }


  /* =======================================================
     OUVERTURE PUBLICITÉ
     ======================================================= */

  function openAdvertising(){

    if(
      typeof window.openTicker ===
      "function"
    ){

      window.openTicker();
      return;
    }


    alert(
      "L'espace Publicité est momentanément indisponible."
    );
  }


  /* =======================================================
     OUVERTURE ACTUALITÉS
     ======================================================= */

  function openNews(){

    if(
      typeof module.openVisibilityNews ===
      "function"
    ){

      module.openVisibilityNews();
      return;
    }


    if(
      typeof module.openEntrepriseNews ===
      "function"
    ){

      module.openEntrepriseNews();
      return;
    }


    alert(
      "L'espace Actualités est momentanément indisponible."
    );
  }


  /* =======================================================
     OUVERTURE EMPLOI
     ======================================================= */

  function openEmployment(){

    if(
      typeof module.openScreen ===
      "function"
    ){

      module.openScreen(
        "emploi"
      );

      return;
    }


    alert(
      "L'espace Emploi est momentanément indisponible."
    );
  }


  /* =======================================================
     OUVERTURE ANNUAIRE
     ======================================================= */

  function openDirectory(){

    if(
      typeof module.openScreen ===
      "function"
    ){

      module.openScreen(
        "annuaire"
      );

      return;
    }


    alert(
      "L'annuaire est momentanément indisponible."
    );
  }


  /* =======================================================
     RÉSULTATS
     POINT DE RACCORDEMENT
     ======================================================= */

  function openResults(){

    let metrics = {};
    let bookings = {};

    try{

      const rawMetrics =
        localStorage.getItem(
          "bociteart_pub_v3_metrics"
        );

      metrics =
        rawMetrics
          ? JSON.parse(rawMetrics)
          : {};

    }catch(error){

      metrics = {};
    }


    try{

      const rawBookings =
        localStorage.getItem(
          "bociteart_pub_v3_bookings"
        );

      bookings =
        rawBookings
          ? JSON.parse(rawBookings)
          : {};

    }catch(error){

      bookings = {};
    }

    /* =====================================================
       COMPARAISON AVEC LA CAMPAGNE PRÉCÉDENTE
       ===================================================== */

    campaigns.sort(
      function(a,b){

        const dateA =
          String(
            a.date || ""
          );

        const dateB =
          String(
            b.date || ""
          );

        return dateA.localeCompare(
          dateB
        );
      }
    );


    let comparisonHtml = "";


    if(
      campaigns.length >= 2
    ){

      const previousCampaign =
        campaigns[
          campaigns.length - 2
        ];


      const currentCampaign =
        campaigns[
          campaigns.length - 1
        ];


      function campaignActionTotal(
        campaign
      ){

        return (
          Number(
            campaign.calls || 0
          ) +
          Number(
            campaign.itineraries || 0
          ) +
          Number(
            campaign.coupons || 0
          ) +
          Number(
            campaign.qrActions || 0
          ) +
          Number(
            campaign.quoteRequests || 0
          ) +
          Number(
            campaign.bookingRequests || 0
          )
        );
      }


      const previousActions =
        campaignActionTotal(
          previousCampaign
        );


      const currentActions =
        campaignActionTotal(
          currentCampaign
        );


      let differenceText =
        "";


      if(
        previousActions === 0 &&
        currentActions > 0
      ){

        differenceText =
          "Cette campagne a généré des actions alors que la précédente n'en avait généré aucune.";

      }else if(
        previousActions === 0 &&
        currentActions === 0
      ){

        differenceText =
          "Les deux dernières campagnes n'ont encore généré aucune action mesurée.";

      }else{

        const differencePercent =
          Math.round(
            (
              (
                currentActions -
                previousActions
              ) /
              previousActions
            ) *
            100
          );


        if(differencePercent > 0){

          differenceText =
            "Cette campagne a généré " +
            differencePercent +
            " % d'actions de plus que la précédente.";

        }else if(
          differencePercent < 0
        ){

          differenceText =
            "Cette campagne a généré " +
            Math.abs(
              differencePercent
            ) +
            " % d'actions de moins que la précédente.";

        }else{

          differenceText =
            "Cette campagne a généré le même nombre d'actions que la précédente.";
        }
      }


      comparisonHtml = `

        <div
          class="box"
          style="
            background:#ffffff;
            color:#111111;
            font-size:14px;
            font-weight:400;
            line-height:1.5;
            border-left:6px solid #2f5d46;
          ">

          <div
            style="
              color:#2f5d46;
              font-size:17px;
              font-weight:700;
              margin-bottom:8px;
            ">
            Comparaison avec votre campagne précédente
          </div>

          Campagne précédente :

          <strong>
            ${previousCampaign.title}
          </strong>

          <br>

          Actions mesurées :
          <strong>
            ${previousActions}
          </strong>

          <br><br>

          Dernière campagne :

          <strong>
            ${currentCampaign.title}
          </strong>

          <br>

          Actions mesurées :
          <strong>
            ${currentActions}
          </strong>

          <br><br>

          ${differenceText}

        </div>

      `;
    }
     
    const campaigns = [];


    Object.keys(
      bookings || {}
    )
    .forEach(function(monthKey){

      const month =
        bookings[monthKey];

      if(
        !month ||
        typeof month !== "object"
      ){
        return;
      }


      Object.keys(month)
        .forEach(function(dayKey){

          const list =
            Array.isArray(
              month[dayKey]
            )
              ? month[dayKey]
              : [];


          list.forEach(
            function(ad){

              if(!ad){
                return;
              }


              const campaignId =
                String(
                  ad.campaignId ||
                  (
                    ad.date +
                    "_" +
                    ad.profileType +
                    "_" +
                    ad.createdTs
                  )
                );


              const result =
                metrics[campaignId] ||
                {};


              campaigns.push({

                id:
                  campaignId,

                title:
                  ad.title ||
                  ad.entityName ||
                  "Publicité",

                date:
                  ad.date || "",

                status:
                  ad.status || "",

                openings:
                  Number(
                    result.openings || 0
                  ),

                calls:
                  Number(
                    result.calls || 0
                  ),

                itineraries:
                  Number(
                    result.itineraries || 0
                  ),

                coupons:
                  Number(
                    result.coupons || 0
                  ),

                qrActions:
                  Number(
                    result.qrActions || 0
                  ),

                quoteRequests:
                  Number(
                    result.quoteRequests || 0
                  ),

                bookingRequests:
                  Number(
                    result.bookingRequests || 0
                  )

              });

            }
          );

        });

    });


    let totalOpenings = 0;
    let totalCalls = 0;
    let totalRoutes = 0;
    let totalCoupons = 0;
    let totalQr = 0;
    let totalQuotes = 0;
    let totalBookings = 0;


    campaigns.forEach(
      function(campaign){

        totalOpenings +=
          campaign.openings;

        totalCalls +=
          campaign.calls;

        totalRoutes +=
          campaign.itineraries;

        totalCoupons +=
          campaign.coupons;

        totalQr +=
          campaign.qrActions;

        totalQuotes +=
          campaign.quoteRequests;

        totalBookings +=
          campaign.bookingRequests;

      }
    );


    const totalActions =
      totalCalls +
      totalRoutes +
      totalCoupons +
      totalQr +
      totalQuotes +
      totalBookings;

    /* =====================================================
       CE QUI A LE MIEUX FONCTIONNÉ
       ===================================================== */

    const performanceItems = [

      {
        label:
          "Appels",
        value:
          totalCalls
      },

      {
        label:
          "Itinéraires",
        value:
          totalRoutes
      },

      {
        label:
          "Bons consultés",
        value:
          totalCoupons
      },

      {
        label:
          "Actions QR",
        value:
          totalQr
      },

      {
        label:
          "Demandes de devis",
        value:
          totalQuotes
      },

      {
        label:
          "Réservations / contacts",
        value:
          totalBookings
      }

    ];


    const bestPerformance =
      performanceItems
        .slice()
        .sort(
          function(a,b){

            return (
              Number(b.value || 0) -
              Number(a.value || 0)
            );

          }
        )[0];


    let bestPerformanceHtml = "";


    if(
      bestPerformance &&
      Number(
        bestPerformance.value || 0
      ) > 0
    ){

      bestPerformanceHtml = `

        <div
          class="box"
          style="
            background:#ffffff;
            color:#111111;
            font-size:14px;
            font-weight:400;
            line-height:1.5;
            border-left:6px solid #2f5d46;
          ">

          <div
            style="
              color:#2f5d46;
              font-size:17px;
              font-weight:700;
              margin-bottom:8px;
            ">
            Ce qui a le mieux fonctionné
          </div>

          L'action qui a généré
          le plus de résultats
          est actuellement :

          <br><br>

          <strong>
            ${bestPerformance.label}
          </strong>

          :
          <strong>
            ${bestPerformance.value}
          </strong>

          <br><br>

          Vous pouvez vous appuyer
          sur ce résultat
          pour préparer votre prochaine communication.

        </div>

      `;

    }else{

      bestPerformanceHtml = `

        <div
          class="box"
          style="
            background:#ffffff;
            color:#111111;
            font-size:14px;
            font-weight:400;
            line-height:1.5;
          ">

          <div
            style="
              color:#2f5d46;
              font-size:17px;
              font-weight:700;
              margin-bottom:8px;
            ">
            Ce qui a le mieux fonctionné
          </div>

          Pas encore assez d'actions mesurées
          pour identifier le meilleur résultat.

        </div>

      `;
    }

         /* =====================================================
       CONSEIL POUR LA PROCHAINE CAMPAGNE
       ===================================================== */

    let nextCampaignAdviceHtml = "";


    if(
      bestPerformance &&
      Number(
        bestPerformance.value || 0
      ) > 0
    ){

      let adviceText = "";


      if(
        bestPerformance.label ===
        "Appels"
      ){

        adviceText =
          "Vos appels fonctionnent bien. " +
          "Pour votre prochaine campagne, gardez un message court " +
          "et un bouton Appeler bien visible.";

      }else if(
        bestPerformance.label ===
        "Itinéraires"
      ){

        adviceText =
          "Votre publicité donne envie de venir sur place. " +
          "Mettez davantage en avant votre adresse, votre offre " +
          "et ce que le client trouvera en venant.";

      }else if(
        bestPerformance.label ===
        "Bons consultés"
      ){

        adviceText =
          "Vos bons attirent l'attention. " +
          "Une offre simple, claire et limitée dans le temps " +
          "peut encore améliorer le résultat.";

      }else if(
        bestPerformance.label ===
        "Actions QR"
      ){

        adviceText =
          "Le QR code est bien utilisé. " +
          "Continuez à proposer une action simple et immédiate " +
          "derrière le QR.";

      }else if(
        bestPerformance.label ===
        "Demandes de devis"
      ){

        adviceText =
          "Votre publicité génère des demandes de devis. " +
          "Présentez clairement votre savoir-faire " +
          "et facilitez encore la prise de contact.";

      }else if(
        bestPerformance.label ===
        "Réservations / contacts"
      ){

        adviceText =
          "Votre publicité transforme bien l'intérêt en contact. " +
          "Conservez un appel à l'action direct " +
          "et une présentation très claire de votre offre.";

      }


      nextCampaignAdviceHtml = `

        <div
          class="box"
          style="
            background:#ffffff;
            color:#111111;
            font-size:14px;
            font-weight:400;
            line-height:1.5;
            border-left:6px solid #2f5d46;
          ">

          <div
            style="
              color:#2f5d46;
              font-size:17px;
              font-weight:700;
              margin-bottom:8px;
            ">
            Pour votre prochaine campagne
          </div>

          ${adviceText}

        </div>

      `;

    }else{

      nextCampaignAdviceHtml = `

        <div
          class="box"
          style="
            background:#ffffff;
            color:#111111;
            font-size:14px;
            font-weight:400;
            line-height:1.5;
          ">

          <div
            style="
              color:#2f5d46;
              font-size:17px;
              font-weight:700;
              margin-bottom:8px;
            ">
            Pour votre prochaine campagne
          </div>

          Continuez à tester
          plusieurs façons de communiquer.

          <br><br>

          Les résultats permettront ensuite
          d'identifier ce qui fonctionne
          le mieux pour votre activité.

        </div>

      `;
    }
     
    const campaignHtml =
      campaigns.length
        ? campaigns
            .slice()
            .reverse()
            .map(
              function(campaign){

                return `

                  <div
                    class="box"
                    style="
                      background:#ffffff;
                      color:#111111;
                      font-size:14px;
                      font-weight:400;
                      line-height:1.5;
                    ">

                    <div
                      style="
                        color:#2f5d46;
                        font-size:17px;
                        font-weight:700;
                        margin-bottom:8px;
                      ">
                      ${campaign.title}
                    </div>

                    ${
                      campaign.date
                        ? `
                          <div>
                            Diffusion :
                            ${campaign.date}
                          </div>
                        `
                        : ""
                    }

                    <div
                      style="
                        margin-top:10px;
                      ">

                      Ouvertures :
                      <strong>
                        ${campaign.openings}
                      </strong>

                      <br>

                      Appels :
                      <strong>
                        ${campaign.calls}
                      </strong>

                      <br>

                      Itinéraires :
                      <strong>
                        ${campaign.itineraries}
                      </strong>

                      <br>

                      Bons consultés :
                      <strong>
                        ${campaign.coupons}
                      </strong>

                      <br>

                      Actions QR :
                      <strong>
                        ${campaign.qrActions}
                      </strong>

                      <br>

                      Demandes de devis :
                      <strong>
                        ${campaign.quoteRequests}
                      </strong>

                      <br>

                      Réservations / contacts :
                      <strong>
                        ${campaign.bookingRequests}
                      </strong>

                    </div>

                  </div>

                `;

              }
            )
            .join("")
        : `

            <div
              class="box"
              style="
                background:#ffffff;
                color:#111111;
                font-size:14px;
                font-weight:400;
              ">
              Aucun résultat publicitaire
              n'est encore enregistré.
            </div>

          `;


    const html = `

      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:8px;
          ">
          Résultats de vos communications
        </div>

        Suivez simplement
        ce que vos publicités
        ont réellement déclenché.

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.6;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:10px;
          ">
          Résultat global
        </div>

        Ouvertures de vos publicités :
        <strong>
          ${totalOpenings}
        </strong>

        <br>

        Actions réalisées :
        <strong>
          ${totalActions}
        </strong>

        <br><br>

        Appels :
        <strong>
          ${totalCalls}
        </strong>

        <br>

        Itinéraires demandés :
        <strong>
          ${totalRoutes}
        </strong>

        <br>

        Bons consultés :
        <strong>
          ${totalCoupons}
        </strong>

        <br>

        Actions QR :
        <strong>
          ${totalQr}
        </strong>

        <br>

        Demandes de devis :
        <strong>
          ${totalQuotes}
        </strong>

        <br>

        Réservations / prises de contact :
        <strong>
          ${totalBookings}
        </strong>

      </div>

    const html = `

      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:8px;
          ">
          Résultats de vos communications
        </div>

        Suivez simplement
        ce que vos publicités
        ont réellement déclenché.

      </div>


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.6;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:10px;
          ">
          Résultat global
        </div>

        Ouvertures de vos publicités :
        <strong>
          ${totalOpenings}
        </strong>

        <br>

        Actions réalisées :
        <strong>
          ${totalActions}
        </strong>

        <br><br>

        Appels :
        <strong>
          ${totalCalls}
        </strong>

        <br>

        Itinéraires demandés :
        <strong>
          ${totalRoutes}
        </strong>

        <br>

        Bons consultés :
        <strong>
          ${totalCoupons}
        </strong>

        <br>

        Actions QR :
        <strong>
          ${totalQr}
        </strong>

        <br>

        Demandes de devis :
        <strong>
          ${totalQuotes}
        </strong>

        <br>

        Réservations / prises de contact :
        <strong>
          ${totalBookings}
        </strong>

      </div>


      ${comparisonHtml}


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:8px;
          ">
          Comment lire vos résultats ?
        </div>

        Les ouvertures montrent
        combien de personnes
        ont voulu découvrir votre publicité.

        <br><br>

        Les appels,
        itinéraires,
        bons,
        QR codes,
        devis
        et réservations
        montrent les actions
        réellement déclenchées.

      </div>


      <div
        style="
          margin-top:14px;
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
        ">
        Détail par communication
      </div>


     ${campaignHtml}


<div
  class="box"
  style="
    margin-top:14px;
    background:#ffffff;
    color:#111111;
    font-size:14px;
    font-weight:400;
    line-height:1.5;
    border-left:6px solid #2f5d46;
  ">

  <div
    style="
      color:#2f5d46;
      font-size:17px;
      font-weight:700;
      margin-bottom:8px;
    ">
    Et maintenant ?
  </div>

  Utilisez ce que vous venez d'apprendre
  pour préparer votre prochaine communication.

  <button
    id="visibilityNewCampaignBtn"
    class="choiceBtn"
    type="button"
    style="
      width:100%;
      margin-top:12px;
      background:#ffffff !important;
      color:#111111 !important;
      font-size:14px;
      font-weight:400;
    ">
    Préparer une nouvelle publicité
  </button>

</div>

`;

      module.renderModulePage(
  "Résultats de mes communications",
  html,
  {
    showBack:false,
    showFooter:false,

    afterRender:
      function(){

        const newCampaignButton =
          getElement(
            "visibilityNewCampaignBtn"
          );

        if(newCampaignButton){

          newCampaignButton.onclick =
            function(){

              openAdvertising();

            };
        }
      }
  }
);
      return;
    }


      <div
        class="box"
        style="
          background:#ffffff;
          color:#111111;
          font-size:14px;
          font-weight:400;
          line-height:1.5;
          border-left:6px solid #2f5d46;
        ">

        <div
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            margin-bottom:8px;
          ">
          Comment lire vos résultats ?
        </div>

        Les ouvertures montrent
        combien de personnes
        ont voulu découvrir votre publicité.

        <br><br>

        Les appels,
        itinéraires,
        bons,
        QR codes,
        devis
        et réservations
        montrent les actions
        réellement déclenchées.

      </div>


      <div
        style="
          margin-top:14px;
          color:#2f5d46;
          font-size:17px;
          font-weight:700;
        ">
        Détail par communication
      </div>


      ${campaignHtml}

    `;


    if(
      typeof module.renderModulePage ===
      "function"
    ){

      module.renderModulePage(
        "Résultats de mes communications",
        html,
        {
          showBack:false,
          showFooter:false
        }
      );

      return;
    }


    if(
      typeof module.renderModal ===
      "function"
    ){

      module.renderModal(
        "Résultats de mes communications",
        html
      );

      return;
    }


    alert(
      "Le suivi des résultats est momentanément indisponible."
    );
  }

  /* =======================================================
     BIND
     ======================================================= */

  function bindVisibility(){

    const advertisingButton =
      getElement(
        "visibilityAdvertisingBtn"
      );


    const newsButton =
      getElement(
        "visibilityNewsBtn"
      );


    const employmentButton =
      getElement(
        "visibilityEmploymentBtn"
      );


    const directoryButton =
      getElement(
        "visibilityDirectoryBtn"
      );


    const resultsButton =
      getElement(
        "visibilityResultsBtn"
      );


    if(advertisingButton){

      advertisingButton.onclick =
        openAdvertising;
    }


    if(newsButton){

      newsButton.onclick =
        openNews;
    }


    if(employmentButton){

      employmentButton.onclick =
        openEmployment;
    }


    if(directoryButton){

      directoryButton.onclick =
        openDirectory;
    }


    if(resultsButton){

      resultsButton.onclick =
        openResults;
    }
  }

  /* =======================================================
     OUVERTURE DU MODULE
     ======================================================= */

  function openVisibilityModule(){

    if(
      typeof module.renderModulePage ===
      "function"
    ){

      module.renderModulePage(

        "Visibilité & communication",

        getVisibilityHtml(),

        {
          showBack:false,
          showFooter:false,
          afterRender:
            bindVisibility
        }

      );

      return;
    }


    if(
      typeof module.renderModal ===
      "function"
    ){

      module.renderModal(
        "Visibilité & communication",
        getVisibilityHtml()
      );

      window.setTimeout(
        bindVisibility,
        0
      );

      return;
    }


    alert(
      "L'espace Visibilité est momentanément indisponible."
    );
  }
   
  /* =======================================================
     EXPOSITION
     ======================================================= */

  module.registerScreen(
    "visibilite",
    openVisibilityModule
  );


  module.openVisibilityModule =
    openVisibilityModule;


  console.log(
    "✅ Nouveau module Visibilité & communication chargé"
  );

})();
