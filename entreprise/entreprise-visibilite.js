/* =========================================================
   BO'CITÉART — ENTREPRISE
   VISIBILITÉ & COMMUNICATION
   VERSION PROPRE
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


  function escapeHtml(value){

    return String(
      value == null
        ? ""
        : value
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  }


  function getBrandHtml(){

    return `
      <strong
        style="
          white-space:nowrap;
          font-weight:700;
        ">
        <span style="color:#2f5d46;">
          Bo'Cité
        </span><span style="color:#b00020;">Art</span>
      </strong>
    `;
  }


  /* =======================================================
     PAGE PRINCIPALE VISIBILITÉ
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
            font-size:16px;
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
            font-size:16px;
            font-weight:700;
            margin-bottom:10px;
          ">
          Avant de commencer
        </div>

        Posez-vous une seule question :

        <br><br>

        <strong>
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
            font-size:16px;
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

        <strong>
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
          font-size:14px;
          font-weight:400;
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
          font-size:14px;
          font-weight:400;
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
          font-size:14px;
          font-weight:400;
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
          font-size:14px;
          font-weight:400;
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
          font-size:14px;
          font-weight:400;
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
            font-size:16px;
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
     PUBLICITÉ
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
     ACTUALITÉS
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
     EMPLOI
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
     ANNUAIRE
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
     RÉSULTATS DES COMMUNICATIONS
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
          ? JSON.parse(
              rawMetrics
            )
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
          ? JSON.parse(
              rawBookings
            )
          : {};

    }catch(error){

      bookings = {};
    }


    /* =====================================================
       CONSTRUCTION DES CAMPAGNES
       ===================================================== */

    const campaigns = [];


    Object.keys(
      bookings || {}
    )
    .forEach(
      function(monthKey){

        const month =
          bookings[
            monthKey
          ];


        if(
          !month ||
          typeof month !==
            "object"
        ){

          return;
        }


        Object.keys(
          month
        )
        .forEach(
          function(dayKey){

            const list =
              Array.isArray(
                month[
                  dayKey
                ]
              )
                ? month[
                    dayKey
                  ]
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
                      String(
                        ad.date ||
                        ""
                      ) +
                      "_" +
                      String(
                        ad.profileType ||
                        ""
                      ) +
                      "_" +
                      String(
                        ad.createdTs ||
                        ""
                      )
                    )
                  );


                const result =
                  metrics[
                    campaignId
                  ] &&
                  typeof metrics[
                    campaignId
                  ] ===
                    "object"
                    ? metrics[
                        campaignId
                      ]
                    : {};


                campaigns.push({

                  id:
                    campaignId,

                  title:
                    ad.title ||
                    ad.entityName ||
                    "Publicité",

                  date:
                    ad.date ||
                    "",

                  status:
                    ad.status ||
                    "",

                  openings:
                    Number(
                      result.openings ||
                      0
                    ),

                  calls:
                    Number(
                      result.calls ||
                      0
                    ),

                  itineraries:
                    Number(
                      result.itineraries ||
                      0
                    ),

                  coupons:
                    Number(
                      result.coupons ||
                      0
                    ),

                  qrActions:
                    Number(
                      result.qrActions ||
                      0
                    ),

                  quoteRequests:
                    Number(
                      result.quoteRequests ||
                      0
                    ),

                  bookingRequests:
                    Number(
                      result.bookingRequests ||
                      0
                    )

                });

              }
            );

          }
        );

      }
    );


    /* =====================================================
       CLASSEMENT CHRONOLOGIQUE
       ===================================================== */

    campaigns.sort(
      function(a,b){

        const dateA =
          String(
            a.date ||
            ""
          );


        const dateB =
          String(
            b.date ||
            ""
          );


        return dateA.localeCompare(
          dateB
        );
      }
    );


    /* =====================================================
       TOTAUX
       ===================================================== */

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
          Number(
            campaign.openings ||
            0
          );

        totalCalls +=
          Number(
            campaign.calls ||
            0
          );

        totalRoutes +=
          Number(
            campaign.itineraries ||
            0
          );

        totalCoupons +=
          Number(
            campaign.coupons ||
            0
          );

        totalQr +=
          Number(
            campaign.qrActions ||
            0
          );

        totalQuotes +=
          Number(
            campaign.quoteRequests ||
            0
          );

        totalBookings +=
          Number(
            campaign.bookingRequests ||
            0
          );

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
       COMPARAISON AVEC LA CAMPAGNE PRÉCÉDENTE
       ===================================================== */

    let comparisonHtml =
      "";


    if(
      campaigns.length >=
      2
    ){

      const previousCampaign =
        campaigns[
          campaigns.length -
          2
        ];


      const currentCampaign =
        campaigns[
          campaigns.length -
          1
        ];


      function campaignActionTotal(
        campaign
      ){

        return (
          Number(
            campaign.calls ||
            0
          ) +
          Number(
            campaign.itineraries ||
            0
          ) +
          Number(
            campaign.coupons ||
            0
          ) +
          Number(
            campaign.qrActions ||
            0
          ) +
          Number(
            campaign.quoteRequests ||
            0
          ) +
          Number(
            campaign.bookingRequests ||
            0
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


        if(
          differencePercent >
          0
        ){

          differenceText =
            "Cette campagne a généré " +
            differencePercent +
            " % d'actions de plus que la précédente.";

        }else if(
          differencePercent <
          0
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
              font-size:16px;
              font-weight:700;
              margin-bottom:8px;
            ">
            Comparaison avec votre campagne précédente
          </div>

          Campagne précédente :

          <br>

          ${escapeHtml(
            previousCampaign.title
          )}

          <br>

          Actions mesurées :
          ${previousActions}

          <br><br>

          Dernière campagne :

          <br>

          ${escapeHtml(
            currentCampaign.title
          )}

          <br>

          Actions mesurées :
          ${currentActions}

          <br><br>

          ${escapeHtml(
            differenceText
          )}

        </div>

      `;
    }


    /* =====================================================
       MEILLEUR RÉSULTAT
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
              Number(
                b.value ||
                0
              ) -
              Number(
                a.value ||
                0
              )
            );
          }
        )[0];


    let bestPerformanceHtml =
      "";


    if(
      bestPerformance &&
      Number(
        bestPerformance.value ||
        0
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
              font-size:16px;
              font-weight:700;
              margin-bottom:8px;
            ">
            Ce qui a le mieux fonctionné
          </div>

          L'action qui a généré
          le plus de résultats
          est actuellement :

          <br><br>

          ${escapeHtml(
            bestPerformance.label
          )}
          :
          ${Number(
            bestPerformance.value ||
            0
          )}

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
              font-size:16px;
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
       CONSEIL PROCHAINE CAMPAGNE
       ===================================================== */

    let nextCampaignAdviceHtml =
      "";


    if(
      bestPerformance &&
      Number(
        bestPerformance.value ||
        0
      ) > 0
    ){

      let adviceText =
        "";


      if(
        bestPerformance.label ===
        "Appels"
      ){

        adviceText =
          "Vos appels fonctionnent bien. Pour votre prochaine campagne, gardez un message court et un bouton Appeler bien visible.";

      }else if(
        bestPerformance.label ===
        "Itinéraires"
      ){

        adviceText =
          "Votre publicité donne envie de venir sur place. Mettez davantage en avant votre adresse, votre offre et ce que le client trouvera en venant.";

      }else if(
        bestPerformance.label ===
        "Bons consultés"
      ){

        adviceText =
          "Vos bons attirent l'attention. Une offre simple, claire et limitée dans le temps peut encore améliorer le résultat.";

      }else if(
        bestPerformance.label ===
        "Actions QR"
      ){

        adviceText =
          "Le QR code est bien utilisé. Continuez à proposer une action simple et immédiate derrière le QR.";

      }else if(
        bestPerformance.label ===
        "Demandes de devis"
      ){

        adviceText =
          "Votre publicité génère des demandes de devis. Présentez clairement votre savoir-faire et facilitez encore la prise de contact.";

      }else if(
        bestPerformance.label ===
        "Réservations / contacts"
      ){

        adviceText =
          "Votre publicité transforme bien l'intérêt en contact. Conservez un appel à l'action direct et une présentation très claire de votre offre.";
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
              font-size:16px;
              font-weight:700;
              margin-bottom:8px;
            ">
            Pour votre prochaine campagne
          </div>

          ${escapeHtml(
            adviceText
          )}

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
              font-size:16px;
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


    /* =====================================================
       DÉTAIL PAR COMMUNICATION
       ===================================================== */

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
                        font-size:16px;
                        font-weight:700;
                        margin-bottom:8px;
                      ">
                      ${escapeHtml(
                        campaign.title
                      )}
                    </div>

                    ${
                      campaign.date
                        ? `
                            Diffusion :
                            ${escapeHtml(
                              campaign.date
                            )}

                            <br><br>
                          `
                        : ""
                    }

                    Ouvertures :
                    ${campaign.openings}

                    <br>

                    Appels :
                    ${campaign.calls}

                    <br>

                    Itinéraires :
                    ${campaign.itineraries}

                    <br>

                    Bons consultés :
                    ${campaign.coupons}

                    <br>

                    Actions QR :
                    ${campaign.qrActions}

                    <br>

                    Demandes de devis :
                    ${campaign.quoteRequests}

                    <br>

                    Réservations / contacts :
                    ${campaign.bookingRequests}

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
                line-height:1.5;
              ">

              Aucun résultat publicitaire
              n'est encore enregistré.

            </div>

          `;


    /* =====================================================
       PAGE RÉSULTATS
       UNE SEULE DÉCLARATION DE html
       ===================================================== */

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
            font-size:16px;
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
            font-size:16px;
            font-weight:700;
            margin-bottom:10px;
          ">
          Résultat global
        </div>

        Ouvertures de vos publicités :
        ${totalOpenings}

        <br>

        Actions réalisées :
        ${totalActions}

        <br><br>

        Appels :
        ${totalCalls}

        <br>

        Itinéraires demandés :
        ${totalRoutes}

        <br>

        Bons consultés :
        ${totalCoupons}

        <br>

        Actions QR :
        ${totalQr}

        <br>

        Demandes de devis :
        ${totalQuotes}

        <br>

        Réservations / prises de contact :
        ${totalBookings}

      </div>


      ${comparisonHtml}

      ${bestPerformanceHtml}

      ${nextCampaignAdviceHtml}


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
            font-size:16px;
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
          font-size:16px;
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
            font-size:16px;
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

       /* =====================================================
       AFFICHAGE DE LA PAGE RÉSULTATS
       ===================================================== */

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


      window.setTimeout(
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

        },
        0
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


      window.setTimeout(
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

        },
        0
      );


      return;
    }


    alert(
      "Les résultats de vos communications sont momentanément indisponibles."
    );
  }


  /* =======================================================
     RACCORDEMENT DES BOUTONS
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
        function(){

          openAdvertising();

        };
    }


    if(newsButton){

      newsButton.onclick =
        function(){

          openNews();

        };
    }


    if(employmentButton){

      employmentButton.onclick =
        function(){

          openEmployment();

        };
    }


    if(directoryButton){

      directoryButton.onclick =
        function(){

          openDirectory();

        };
    }


    if(resultsButton){

      resultsButton.onclick =
        function(){

          openResults();

        };
    }
  }


  /* =======================================================
     OUVERTURE VISIBILITÉ
     ======================================================= */

  function openVisibilityModule(){

    const visibilityHtml =
      getVisibilityHtml();


    if(
      typeof module.renderModulePage ===
      "function"
    ){

      module.renderModulePage(
        "Visibilité & communication",
        visibilityHtml,
        {
          showBack:false,
          showFooter:false
        }
      );


      window.setTimeout(
        bindVisibility,
        0
      );


      return;
    }


    if(
      typeof module.renderModal ===
      "function"
    ){

      module.renderModal(
        "Visibilité & communication",
        visibilityHtml
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
     EXPOSITION DES FONCTIONS
     ======================================================= */

  module.openVisibilityModule =
    openVisibilityModule;


  module.openVisibility =
    openVisibilityModule;


  module.openVisibilityResults =
    openResults;


  module.getVisibilityHtml =
    getVisibilityHtml;


  window.openEntrepriseVisibility =
    openVisibilityModule;


  /* =======================================================
     RACCORDEMENT AU ROUTEUR ENTREPRISE
     ======================================================= */

  if(
    typeof module.registerScreen ===
    "function"
  ){

    module.registerScreen(
      "visibilite",
      openVisibilityModule
    );
  }


  console.log(
    "✅ Nouveau module Visibilité & communication chargé"
  );

})();
