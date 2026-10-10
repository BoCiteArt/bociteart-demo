/* =========================================================
   ÇA COMMENCE ICI — FICHIER COMPLET bociteart-dae.js
   ========================================================= */

/* =========================================================
   BO'CITÉART — CITOYEN — DAE
   Source : Géo'DAE — base nationale officielle
   Aucun secret / aucune clé API côté navigateur
   ========================================================= */

(function initBociteArtDae(){

  "use strict";

  if(window.BociteArtDae && window.BociteArtDae.loaded){
    return;
  }

  const GREEN = "#2f5d46";
  const RED = "#c84b43";

  const WFS_URL =
    "https://datacarto.atlasante.fr/wfs/194a610d-f004-4ca2-95e4-4087eafb1ab9";

  const WFS_TYPENAMES = [
    "ms:geodae_publique",
    "geodae_publique"
  ];

  const VIDEO_URL =
    "https://www.youtube.com/embed/3CAmp8yKYEg?rel=0&modestbranding=1";

  const VERIFIED_DATE = "10/10/2026";

  let userLat = null;
  let userLng = null;
  let userHeading = null;

  let selectedDae = null;
  let daeResults = [];

  let watchId = null;
  let orientationStarted = false;


  /* =========================================================
     OUTILS
     ========================================================= */

  function byId(id){
    return document.getElementById(id);
  }


  function esc(value){

    return String(
      value == null ? "" : value
    )
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function normalize(value){

    return String(
      value == null ? "" : value
    )
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }


  function boolValue(value){

    if(
      value === true ||
      value === 1
    ){
      return true;
    }

    const v =
      normalize(value);

    return (
      v === "t" ||
      v === "true" ||
      v === "1" ||
      v === "oui" ||
      v === "yes"
    );
  }


  function parseDate(value){

    if(!value){
      return null;
    }

    const raw =
      String(value).trim();

    const iso =
      raw.match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

    if(!iso){
      return null;
    }

    const date =
      new Date(
        Number(iso[1]),
        Number(iso[2]) - 1,
        Number(iso[3]),
        12,
        0,
        0,
        0
      );

    if(
      Number.isNaN(
        date.getTime()
      )
    ){
      return null;
    }

    return date;
  }


  function isExpired(value){

    const date =
      parseDate(value);

    if(!date){
      return false;
    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    date.setHours(
      0,
      0,
      0,
      0
    );

    return date < today;
  }


  function formatDate(value){

    const date =
      parseDate(value);

    if(!date){
      return "Donnée non renseignée";
    }

    return date.toLocaleDateString(
      "fr-FR"
    );
  }


  function toNumber(value){

    const n =
      Number(
        String(
          value == null ? "" : value
        ).replace(",", ".")
      );

    return Number.isFinite(n)
      ? n
      : null;
  }


  /* =========================================================
     DISTANCE / DIRECTION
     ========================================================= */

  function haversineKm(
    lat1,
    lon1,
    lat2,
    lon2
  ){

    const R = 6371;

    const rad =
      Math.PI / 180;

    const dLat =
      (lat2 - lat1) * rad;

    const dLon =
      (lon2 - lon1) * rad;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * rad) *
      Math.cos(lat2 * rad) *
      Math.sin(dLon / 2) ** 2;

    return (
      R *
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      )
    );
  }


  function bearingDeg(
    lat1,
    lon1,
    lat2,
    lon2
  ){

    const rad =
      Math.PI / 180;

    const deg =
      180 / Math.PI;

    const phi1 =
      lat1 * rad;

    const phi2 =
      lat2 * rad;

    const deltaLon =
      (lon2 - lon1) * rad;

    const y =
      Math.sin(deltaLon) *
      Math.cos(phi2);

    const x =
      Math.cos(phi1) *
      Math.sin(phi2) -

      Math.sin(phi1) *
      Math.cos(phi2) *
      Math.cos(deltaLon);

    return (
      Math.atan2(y, x) *
      deg +
      360
    ) % 360;
  }


  function distanceText(km){

    if(
      !Number.isFinite(km)
    ){
      return "Distance inconnue";
    }

    if(km < 1){

      return (
        Math.max(
          1,
          Math.round(km * 1000)
        ) +
        " m"
      );
    }

    return (
      km
        .toFixed(
          km < 10
            ? 1
            : 0
        )
        .replace(".", ",") +
      " km"
    );
  }


  function estimateWalkingMinutes(km){

    return Math.max(
      1,
      Math.round(
        (
          km *
          1.25 /
          4.5
        ) *
        60
      )
    );
  }


  function estimateDrivingMinutes(km){

    return Math.max(
      1,
      Math.round(
        (
          km *
          1.35 /
          30
        ) *
        60
      )
    );
  }


  /* =========================================================
     LECTURE DES DONNÉES GÉO'DAE
     ========================================================= */

  function property(
    feature,
    names
  ){

    const properties =
      feature &&
      feature.properties
        ? feature.properties
        : {};

    for(
      const name
      of names
    ){

      if(
        properties[name] !== undefined &&
        properties[name] !== null &&
        String(
          properties[name]
        ).trim() !== ""
      ){

        return properties[name];
      }
    }

    return null;
  }


  function featureCoords(feature){

    const pLat =
      toNumber(
        property(
          feature,
          [
            "c_lat_coor1",
            "latitude",
            "lat"
          ]
        )
      );

    const pLng =
      toNumber(
        property(
          feature,
          [
            "c_long_coor1",
            "longitude",
            "lon",
            "lng"
          ]
        )
      );

    if(
      pLat !== null &&
      pLng !== null
    ){

      return {
        lat:pLat,
        lng:pLng
      };
    }


    const geometry =
      feature &&
      feature.geometry;


    if(
      geometry &&
      geometry.type === "Point" &&
      Array.isArray(
        geometry.coordinates
      )
    ){

      const lng =
        toNumber(
          geometry.coordinates[0]
        );

      const lat =
        toNumber(
          geometry.coordinates[1]
        );

      if(
        lat !== null &&
        lng !== null
      ){

        return {
          lat,
          lng
        };
      }
    }


    if(
      geometry &&
      geometry.type === "MultiPoint" &&
      Array.isArray(
        geometry.coordinates
      ) &&
      Array.isArray(
        geometry.coordinates[0]
      )
    ){

      const lng =
        toNumber(
          geometry.coordinates[0][0]
        );

      const lat =
        toNumber(
          geometry.coordinates[0][1]
        );

      if(
        lat !== null &&
        lng !== null
      ){

        return {
          lat,
          lng
        };
      }
    }


    return null;
  }


  function cleanArrayText(value){

    if(
      value == null ||
      String(value).trim() === ""
    ){

      return "Donnée non renseignée";
    }

    return String(value)
      .replace(
        /[{}\[\]"]/g,
        ""
      )
      .replace(
        /,/g,
        ", "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();
  }


  /* =========================================================
     FILTRAGE SÉCURITÉ
     ========================================================= */

  function daeFromFeature(feature){

    const coords =
      featureCoords(feature);

    if(!coords){
      return null;
    }


    const state =
      property(
        feature,
        [
          "c_etat_fonct",
          "etat_fonct"
        ]
      );


    /*
      RÈGLE :
      uniquement les DAE déclarés
      "En fonctionnement".
    */

    if(
      normalize(state) !==
      "en fonctionnement"
    ){

      return null;
    }


    /*
      DAE supprimé / inactif :
      exclusion.
    */

    const administrativeState =
      normalize(
        property(
          feature,
          [
            "c_etat",
            "etat"
          ]
        )
      );

    if(
      administrativeState &&
      (
        administrativeState.includes(
          "supprim"
        ) ||
        administrativeState.includes(
          "inactif"
        )
      )
    ){

      return null;
    }


    /*
      Validation officielle.
    */

    const validationState =
      normalize(
        property(
          feature,
          [
            "c_etat_valid",
            "etat_valid"
          ]
        )
      );


    if(validationState){

      const accepted =
        [
          "valide",
          "valides",
          "validee",
          "validees"
        ];

      if(
        !accepted.includes(
          validationState
        )
      ){

        return null;
      }
    }


    /*
      DAE mobile :
      exclusion automatique.
    */

    if(
      boolValue(
        property(
          feature,
          [
            "c_dae_mobile",
            "dae_mobile"
          ]
        )
      )
    ){

      return null;
    }


    /*
      Batterie ou électrodes adultes
      déclarées périmées :
      exclusion automatique.
    */

    const batteryExpiry =
      property(
        feature,
        [
          "c_dtpr_bat",
          "dtpr_bat"
        ]
      );


    const adultPadsExpiry =
      property(
        feature,
        [
          "c_dtpr_lcad",
          "dtpr_lcad"
        ]
      );


    if(
      isExpired(
        batteryExpiry
      ) ||
      isExpired(
        adultPadsExpiry
      )
    ){

      return null;
    }


    /*
      Doublon déclaré :
      exclusion.
    */

    const duplicate =
      property(
        feature,
        [
          "c_doublon",
          "doublon"
        ]
      );


    if(
      boolValue(
        duplicate
      )
    ){

      return null;
    }


    const address =
      [
        property(
          feature,
          [
            "c_adr_num",
            "adr_num"
          ]
        ),

        property(
          feature,
          [
            "c_adr_voie",
            "adr_voie"
          ]
        ),

        property(
          feature,
          [
            "c_com_cp",
            "com_cp"
          ]
        ),

        property(
          feature,
          [
            "c_com_nom",
            "com_nom"
          ]
        )
      ]
        .filter(Boolean)
        .join(" ")
        .replace(
          /\s+/g,
          " "
        )
        .trim();


    const freeAccessRaw =
      property(
        feature,
        [
          "c_acc_lib",
          "acc_lib"
        ]
      );


    const freeAccess =
      freeAccessRaw == null
        ? null
        : boolValue(
            freeAccessRaw
          );


    return {

      id:String(
        property(
          feature,
          [
            "c_gid",
            "gid",
            "id"
          ]
        ) ||
        feature.id ||
        (
          coords.lat +
          "-" +
          coords.lng
        )
      ),

      name:String(
        property(
          feature,
          [
            "c_nom",
            "nom"
          ]
        ) ||
        "Défibrillateur automatisé externe"
      ),

      lat:
        coords.lat,

      lng:
        coords.lng,

      address:
        address ||
        "Adresse non renseignée",

      state:
        String(
          state ||
          "En fonctionnement"
        ),

      access:
        String(
          property(
            feature,
            [
              "c_acc",
              "acc"
            ]
          ) ||
          "Donnée non renseignée"
        ),

      accessDetails:
        String(
          property(
            feature,
            [
              "c_acc_complt",
              "acc_complt"
            ]
          ) ||
          ""
        ),

      freeAccess,

      days:
        cleanArrayText(
          property(
            feature,
            [
              "c_disp_j",
              "disp_j"
            ]
          )
        ),

      hours:
        cleanArrayText(
          property(
            feature,
            [
              "c_disp_h",
              "c_dispo_horaires",
              "disp_h"
            ]
          )
        ),

      availabilityDetails:
        String(
          property(
            feature,
            [
              "c_disp_complt",
              "disp_complt"
            ]
          ) ||
          ""
        ),

      lastMaintenance:
        property(
          feature,
          [
            "c_dermnt",
            "dermnt"
          ]
        ),

      lastUpdate:
        property(
          feature,
          [
            "c_maj_don",
            "c_edit_datemaj",
            "maj_don"
          ]
        ),

      batteryExpiry,

      adultPadsExpiry,

      distanceKm:null
    };
  }


  /* =========================================================
     ZONE DE RECHERCHE
     ========================================================= */

  function bboxAround(
    lat,
    lng,
    radiusKm
  ){

    const dLat =
      radiusKm /
      111.32;

    const cos =
      Math.max(
        0.2,
        Math.cos(
          lat *
          Math.PI /
          180
        )
      );

    const dLng =
      radiusKm /
      (
        111.32 *
        cos
      );

    return [
      lng - dLng,
      lat - dLat,
      lng + dLng,
      lat + dLat
    ];
  }


  /* =========================================================
     APPEL WFS OFFICIEL
     ========================================================= */

  async function fetchWfs(bbox){

    let lastError = null;


    for(
      const typeName
      of WFS_TYPENAMES
    ){

      try{

        const params =
          new URLSearchParams({

            SERVICE:
              "WFS",

            VERSION:
              "1.0.0",

            REQUEST:
              "GetFeature",

            TYPENAME:
              typeName,

            OUTPUTFORMAT:
              "application/json",

            SRSNAME:
              "EPSG:4326",

            BBOX:
              bbox.join(",") +
              ",EPSG:4326"
          });


        const response =
          await fetch(
            WFS_URL +
            "?" +
            params.toString(),
            {

              method:
                "GET",

              mode:
                "cors",

              cache:
                "no-store",

              credentials:
                "omit",

              referrerPolicy:
                "no-referrer"
            }
          );


        if(
          !response.ok
        ){

          throw new Error(
            "HTTP " +
            response.status
          );
        }


        const contentType =
          response.headers.get(
            "content-type"
          ) ||
          "";


        if(
          !contentType.includes(
            "json"
          ) &&
          !contentType.includes(
            "geojson"
          )
        ){

          const text =
            await response.text();

          throw new Error(
            "Réponse Géo'DAE non JSON : " +
            text.slice(
              0,
              80
            )
          );
        }


        const data =
          await response.json();


        if(
          data &&
          Array.isArray(
            data.features
          )
        ){

          return data.features;
        }


        throw new Error(
          "Format Géo'DAE inattendu"
        );

      }catch(error){

        lastError =
          error;
      }
    }


    throw (
      lastError ||
      new Error(
        "Service Géo'DAE indisponible"
      )
    );
  }


  /* =========================================================
     RECHERCHE DES 3 PLUS PROCHES
     ========================================================= */

  async function findNearestDae(
    lat,
    lng
  ){

    /*
      Recherche progressive :
      5 km
      puis 15 km
      puis 40 km.
    */

    const radii =
      [
        5,
        15,
        40
      ];


    const found = [];

    const seen =
      new Set();


    for(
      const radius
      of radii
    ){

      const features =
        await fetchWfs(
          bboxAround(
            lat,
            lng,
            radius
          )
        );


      for(
        const feature
        of features
      ){

        const dae =
          daeFromFeature(
            feature
          );


        if(!dae){
          continue;
        }


        dae.distanceKm =
          haversineKm(
            lat,
            lng,
            dae.lat,
            dae.lng
          );


        if(
          dae.distanceKm >
          radius * 1.15
        ){

          continue;
        }


        const key =
          dae.id +
          "|" +
          dae.lat.toFixed(6) +
          "|" +
          dae.lng.toFixed(6);


        if(
          seen.has(key)
        ){

          continue;
        }


        seen.add(key);

        found.push(dae);
      }


      found.sort(
        (a,b)=>
          a.distanceKm -
          b.distanceKm
      );


      if(
        found.length >= 3
      ){

        break;
      }
    }


    return found.slice(
      0,
      3
    );
  }


  /* =========================================================
     AFFICHAGE
     ========================================================= */

  function freeAccessText(dae){

    if(
      dae.freeAccess === true
    ){
      return "Oui";
    }


    if(
      dae.freeAccess === false
    ){
      return "Non";
    }


    return "Donnée non renseignée";
  }


  function expiryText(
    value,
    label
  ){

    if(!value){

      return (
        label +
        " : donnée non renseignée"
      );
    }


    return (
      label +
      " : " +
      formatDate(value)
    );
  }


  function renderDaeCards(){

    const host =
      byId(
        "bociteDaeResults"
      );


    if(!host){
      return;
    }


    if(
      !daeResults.length
    ){

      host.innerHTML = "";

      return;
    }


    host.innerHTML =
      daeResults
        .map(
          (dae,index)=>{

            const selected =
              selectedDae &&
              selectedDae.id ===
              dae.id;


            const border =
              selected
                ? (
                    "3px solid " +
                    GREEN
                  )
                : (
                    "2px solid rgba(47,93,70,.22)"
                  );


            const maintenance =
              dae.lastMaintenance
                ? formatDate(
                    dae.lastMaintenance
                  )
                : "Donnée non renseignée";


            const details =
              [
                dae.accessDetails,
                dae.availabilityDetails
              ]
                .filter(Boolean)
                .join(" — ");


            return `
              <div
                class="box"
                style="
                  margin-top:10px;
                  border:${border};
                  background:#fff;
                  font-weight:400;
                "
              >

                <div
                  style="
                    display:flex;
                    align-items:flex-start;
                    gap:10px;
                  "
                >

                  <div
                    style="
                      width:34px;
                      height:34px;
                      flex:0 0 34px;
                      border-radius:50%;
                      background:${selected ? GREEN : "#f2eee7"};
                      color:${selected ? "#fff" : GREEN};
                      display:flex;
                      align-items:center;
                      justify-content:center;
                      font-weight:900;
                      font-size:17px;
                    "
                  >
                    ${index + 1}
                  </div>

                  <div
                    style="
                      min-width:0;
                      flex:1;
                    "
                  >

                    <div
                      style="
                        color:${GREEN};
                        font-size:15px;
                        font-weight:900;
                        line-height:1.2;
                      "
                    >
                      ${esc(dae.name)}
                    </div>

                    <div
                      style="
                        margin-top:5px;
                        color:#111;
                        font-weight:400;
                      "
                    >
                      ${esc(dae.address)}
                    </div>

                    <div
                      style="
                        margin-top:7px;
                        font-weight:900;
                        color:${RED};
                      "
                    >
                      ${esc(
                        distanceText(
                          dae.distanceKm
                        )
                      )}
                    </div>

                  </div>

                </div>


                <div
                  style="
                    margin-top:10px;
                    font-size:13px;
                    line-height:1.45;
                    color:#111;
                    font-weight:400;
                  "
                >

                  <div>
                    <strong style="color:${GREEN};">
                      État :
                    </strong>

                    ${esc(dae.state)}
                  </div>


                  <div>
                    <strong style="color:${GREEN};">
                      Accessibilité :
                    </strong>

                    ${esc(dae.access)}
                  </div>


                  <div>
                    <strong style="color:${GREEN};">
                      Accès libre :
                    </strong>

                    ${esc(
                      freeAccessText(dae)
                    )}
                  </div>


                  <div>
                    <strong style="color:${GREEN};">
                      Jours :
                    </strong>

                    ${esc(dae.days)}
                  </div>


                  <div>
                    <strong style="color:${GREEN};">
                      Horaires :
                    </strong>

                    ${esc(dae.hours)}
                  </div>


                  ${
                    details
                      ? `
                        <div>
                          <strong style="color:${GREEN};">
                            Précision :
                          </strong>

                          ${esc(details)}
                        </div>
                      `
                      : ""
                  }


                  <div>
                    <strong style="color:${GREEN};">
                      Dernière maintenance déclarée :
                    </strong>

                    ${esc(maintenance)}
                  </div>


                  <div>
                    ${esc(
                      expiryText(
                        dae.batteryExpiry,
                        "Batterie"
                      )
                    )}
                  </div>


                  <div>
                    ${esc(
                      expiryText(
                        dae.adultPadsExpiry,
                        "Électrodes adultes"
                      )
                    )}
                  </div>


                  <div
                    style="
                      margin-top:7px;
                    "
                  >
                    <strong style="color:${GREEN};">
                      Estimation à pied :
                    </strong>

                    ~${estimateWalkingMinutes(
                      dae.distanceKm
                    )} min
                  </div>


                  <div>
                    <strong style="color:${GREEN};">
                      Estimation en voiture :
                    </strong>

                    ~${estimateDrivingMinutes(
                      dae.distanceKm
                    )} min
                  </div>


                  <div
                    style="
                      margin-top:4px;
                      font-size:11px;
                      color:#666;
                    "
                  >
                    Estimations Bo’CitéArt.
                    Le temps réel est donné
                    par l’application de navigation.
                  </div>

                </div>


                <div
                  style="
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:8px;
                    margin-top:10px;
                  "
                >

                  <button
                    type="button"
                    class="choiceBtn bociteDaeChoose"
                    data-dae-index="${index}"
                    style="
                      grid-column:1 / -1;
                      background:${selected ? "#e8f0eb" : "#fff"};
                      border:2px solid ${GREEN};
                      color:${GREEN};
                    "
                  >
                    ${
                      selected
                        ? "✓ DAE sélectionné"
                        : "➜ Choisir ce DAE"
                    }
                  </button>


                  <button
                    type="button"
                    class="choiceBtn bociteDaeWalk"
                    data-dae-index="${index}"
                    style="
                      background:#fff;
                      border:2px solid ${GREEN};
                    "
                  >
                    🚶 À pied
                  </button>


                  <button
                    type="button"
                    class="choiceBtn bociteDaeDrive"
                    data-dae-index="${index}"
                    style="
                      background:#fff;
                      border:2px solid ${GREEN};
                    "
                  >
                    🚗 En voiture
                  </button>

                </div>

              </div>
            `;
          }
        )
        .join("");


    host
      .querySelectorAll(
        ".bociteDaeChoose"
      )
      .forEach(
        button=>{

          button.onclick =
            ()=>{

              selectDae(
                Number(
                  button.dataset.daeIndex
                )
              );
            };
        }
      );


    host
      .querySelectorAll(
        ".bociteDaeWalk"
      )
      .forEach(
        button=>{

          button.onclick =
            ()=>{

              openWalking(
                daeResults[
                  Number(
                    button.dataset.daeIndex
                  )
                ]
              );
            };
        }
      );


    host
      .querySelectorAll(
        ".bociteDaeDrive"
      )
      .forEach(
        button=>{

          button.onclick =
            ()=>{

              openDriving(
                daeResults[
                  Number(
                    button.dataset.daeIndex
                  )
                ]
              );
            };
        }
      );
  }


  function selectDae(index){

    const dae =
      daeResults[index];


    if(!dae){
      return;
    }


    selectedDae =
      dae;


    renderDaeCards();

    updateArrow();

    updateSelectedSummary();
  }


  function updateSelectedSummary(){

    const host =
      byId(
        "bociteDaeSelected"
      );


    if(!host){
      return;
    }


    if(!selectedDae){

      host.innerHTML =
        "Aucun DAE sélectionné.";

      return;
    }


    host.innerHTML = `
      <strong
        style="
          color:${GREEN};
        "
      >
        DAE sélectionné :
      </strong>

      ${esc(selectedDae.name)}

      <br>

      <span
        style="
          font-weight:400;
        "
      >
        ${esc(selectedDae.address)}
        —
        ${esc(
          distanceText(
            selectedDae.distanceKm
          )
        )}
      </span>
    `;
  }


  /* =========================================================
     FLÈCHE DIRECTIONNELLE
     ========================================================= */

  function updateArrow(){

    const arrow =
      byId(
        "bociteDaeArrow"
      );

    const label =
      byId(
        "bociteDaeArrowLabel"
      );


    if(
      !arrow ||
      !label
    ){
      return;
    }


    if(
      userLat == null ||
      userLng == null ||
      !selectedDae
    ){

      arrow.style.transform =
        "rotate(0deg)";

      label.textContent =
        "La flèche s’active après localisation et sélection d’un DAE.";

      return;
    }


    const bearing =
      bearingDeg(
        userLat,
        userLng,
        selectedDae.lat,
        selectedDae.lng
      );


    const rotation =
      userHeading == null
        ? bearing
        : (
            (
              bearing -
              userHeading
            ) +
            360
          ) %
          360;


    arrow.style.transform =
      `rotate(${rotation}deg)`;


    if(
      userHeading == null
    ){

      label.textContent =
        "Direction générale du DAE : " +
        Math.round(bearing) +
        "°. Boussole non disponible.";

    }else{

      label.textContent =
        "La flèche pointe vers le DAE sélectionné et suit l’orientation du téléphone.";
    }
  }


  /* =========================================================
     NAVIGATION EXTERNE
     ========================================================= */

  function openWalking(dae){

    if(!dae){
      return;
    }


    const url =
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(
        dae.lat +
        "," +
        dae.lng
      ) +
      "&travelmode=walking";


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }


  function openDriving(dae){

    if(!dae){
      return;
    }


    const url =
      "https://www.waze.com/ul?ll=" +
      encodeURIComponent(
        dae.lat +
        "," +
        dae.lng
      ) +
      "&navigate=yes&zoom=17";


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }


  /* =========================================================
     BOUSSOLE
     ========================================================= */

  function orientationHandler(event){

    let heading =
      null;


    if(
      typeof event.webkitCompassHeading ===
      "number"
    ){

      heading =
        event.webkitCompassHeading;

    }else if(
      typeof event.alpha ===
      "number"
    ){

      heading =
        360 -
        event.alpha;
    }


    if(
      Number.isFinite(
        heading
      )
    ){

      userHeading =
        (
          heading +
          360
        ) %
        360;


      const out =
        byId(
          "bociteDaeHeading"
        );


      if(out){

        out.textContent =
          Math.round(
            userHeading
          ) +
          "°";
      }


      updateArrow();
    }
  }


  async function startOrientation(){

    if(
      orientationStarted
    ){
      return;
    }


    orientationStarted =
      true;


    try{

      if(
        typeof DeviceOrientationEvent !==
          "undefined" &&

        typeof DeviceOrientationEvent.requestPermission ===
          "function"
      ){

        const state =
          await DeviceOrientationEvent.requestPermission();


        if(
          state ===
          "granted"
        ){

          window.addEventListener(
            "deviceorientation",
            orientationHandler,
            true
          );

        }else{

          orientationStarted =
            false;
        }

      }else{

        window.addEventListener(
          "deviceorientationabsolute",
          orientationHandler,
          true
        );

        window.addEventListener(
          "deviceorientation",
          orientationHandler,
          true
        );
      }

    }catch(error){

      orientationStarted =
        false;
    }
  }


  /* =========================================================
     POSITION GPS
     ========================================================= */

  function updateUserPosition(
    lat,
    lng
  ){

    userLat =
      lat;

    userLng =
      lng;


    const latOut =
      byId(
        "bociteDaeLat"
      );

    const lngOut =
      byId(
        "bociteDaeLng"
      );


    if(latOut){

      latOut.textContent =
        lat.toFixed(6);
    }


    if(lngOut){

      lngOut.textContent =
        lng.toFixed(6);
    }


    for(
      const dae
      of daeResults
    ){

      dae.distanceKm =
        haversineKm(
          lat,
          lng,
          dae.lat,
          dae.lng
        );
    }


    daeResults.sort(
      (a,b)=>
        a.distanceKm -
        b.distanceKm
    );


    if(selectedDae){

      const refreshed =
        daeResults.find(
          item=>
            item.id ===
            selectedDae.id
        );


      if(refreshed){

        selectedDae =
          refreshed;
      }
    }


    renderDaeCards();

    updateSelectedSummary();

    updateArrow();
  }


  function startPositionWatch(){

    if(
      !navigator.geolocation ||
      watchId !== null
    ){

      return;
    }


    watchId =
      navigator.geolocation.watchPosition(

        position=>{

          updateUserPosition(
            position.coords.latitude,
            position.coords.longitude
          );
        },

        ()=>{},

        {
          enableHighAccuracy:true,
          maximumAge:3000,
          timeout:12000
        }
      );
  }


  /* =========================================================
     LOCALISATION + RECHERCHE
     ========================================================= */

  async function locateAndSearch(){

    const status =
      byId(
        "bociteDaeStatus"
      );

    const button =
      byId(
        "bociteDaeLocate"
      );


    /*
      La demande de boussole est déclenchée
      directement par le geste utilisateur.
    */

    startOrientation();


    if(
      !navigator.geolocation
    ){

      if(status){

        status.textContent =
          "La géolocalisation n’est pas disponible sur cet appareil.";
      }

      return;
    }


    if(button){

      button.disabled =
        true;
    }


    if(status){

      status.textContent =
        "Localisation en cours…";
    }


    navigator.geolocation.getCurrentPosition(

      async position=>{

        try{

          updateUserPosition(
            position.coords.latitude,
            position.coords.longitude
          );


          if(status){

            status.textContent =
              "Position trouvée. Recherche des DAE officiels en fonctionnement…";
          }


          daeResults =
            await findNearestDae(
              userLat,
              userLng
            );


          if(
            !daeResults.length
          ){

            selectedDae =
              null;

            renderDaeCards();

            updateSelectedSummary();

            updateArrow();


            if(status){

              status.textContent =
                "Aucun DAE répondant aux critères de sécurité n’a été trouvé dans la zone recherchée. Appelez immédiatement les secours et suivez leurs instructions.";
            }

            return;
          }


          selectedDae =
            daeResults[0];


          renderDaeCards();

          updateSelectedSummary();

          updateArrow();

          startPositionWatch();


          if(status){

            status.textContent =
              daeResults.length +
              " DAE officiel" +
              (
                daeResults.length > 1
                  ? "s"
                  : ""
              ) +
              " proposé" +
              (
                daeResults.length > 1
                  ? "s"
                  : ""
              ) +
              ", classé" +
              (
                daeResults.length > 1
                  ? "s"
                  : ""
              ) +
              " du plus proche au plus éloigné.";
          }

        }catch(error){

          console.error(
            "Bo'CitéArt DAE — recherche Géo'DAE :",
            error
          );


          daeResults =
            [];

          selectedDae =
            null;


          renderDaeCards();

          updateSelectedSummary();

          updateArrow();


          if(status){

            status.textContent =
              "Le service public Géo’DAE est momentanément indisponible. Appelez immédiatement les secours : ils peuvent vous guider vers un DAE disponible.";
          }

        }finally{

          if(button){

            button.disabled =
              false;
          }
        }
      },


      error=>{

        if(button){

          button.disabled =
            false;
        }


        if(!status){

          return;
        }


        if(
          error &&
          error.code === 1
        ){

          status.textContent =
            "Localisation refusée. Autorisez la position pour rechercher les DAE proches.";

        }else if(
          error &&
          error.code === 2
        ){

          status.textContent =
            "Position GPS indisponible pour le moment.";

        }else if(
          error &&
          error.code === 3
        ){

          status.textContent =
            "La recherche GPS a dépassé le délai prévu. Réessayez.";

        }else{

          status.textContent =
            "Impossible d’obtenir votre position.";
        }
      },


      {
        enableHighAccuracy:true,
        timeout:12000,
        maximumAge:0
      }
    );
  }


  /* =========================================================
     CONTENU DE LA FENÊTRE DAE
     ========================================================= */

  function modalHtml(){

    return `

      <div
        style="
          font-weight:400;
          color:#111;
        "
      >

        <div
          style="
            font-size:18px;
            font-weight:900;
            color:${GREEN};
            line-height:1.2;
          "
        >
          Défibrillateur
          <span style="color:${RED};">
            DAE
          </span>
        </div>


        <div
          class="box"
          style="
            margin-top:10px;
            background:#fff;
            border:2px solid ${RED};
            font-weight:400;
          "
        >

          <div
            style="
              font-weight:900;
              color:${RED};
            "
          >
            Urgence vitale
          </div>

          <div
            style="
              margin-top:5px;
            "
          >
            Appelez immédiatement les secours
            et suivez leurs instructions.
          </div>


          <div
            style="
              display:flex;
              gap:8px;
              flex-wrap:wrap;
              margin-top:9px;
            "
          >

            <a
              href="tel:112"
              class="choiceBtn"
              style="
                text-decoration:none;
                color:#111;
                background:#fff;
                border:2px solid ${RED};
              "
            >
              112
            </a>

            <a
              href="tel:15"
              class="choiceBtn"
              style="
                text-decoration:none;
                color:#111;
                background:#fff;
                border:2px solid ${RED};
              "
            >
              15
            </a>

            <a
              href="tel:18"
              class="choiceBtn"
              style="
                text-decoration:none;
                color:#111;
                background:#fff;
                border:2px solid ${RED};
              "
            >
              18
            </a>

          </div>

        </div>


        <div
          class="box"
          style="
            margin-top:10px;
            background:#fff;
            font-weight:400;
          "
        >

          <div
            style="
              font-weight:900;
              color:${GREEN};
            "
          >
            Trouver les DAE officiels les plus proches
          </div>


          <div
            id="bociteDaeStatus"
            style="
              margin-top:6px;
              color:#111;
            "
          >
            Appuyez sur le bouton pour autoriser
            votre position et lancer la recherche.
          </div>


          <button
            type="button"
            class="choiceBtn"
            id="bociteDaeLocate"
            style="
              width:100%;
              margin-top:10px;
              background:#fff;
              border:2px solid ${GREEN};
              color:${GREEN};
            "
          >
            📍 Trouver les défibrillateurs autour de moi
          </button>


          <div
            style="
              margin-top:10px;
              padding:9px;
              border-radius:10px;
              background:#faf8f2;
              font-size:12px;
              line-height:1.45;
            "
          >

            <div>
              <strong style="color:${GREEN};">
                Latitude :
              </strong>

              <span id="bociteDaeLat">
                -
              </span>
            </div>


            <div>
              <strong style="color:${GREEN};">
                Longitude :
              </strong>

              <span id="bociteDaeLng">
                -
              </span>
            </div>


            <div>
              <strong style="color:${GREEN};">
                Cap :
              </strong>

              <span id="bociteDaeHeading">
                Non disponible
              </span>
            </div>

          </div>

        </div>


        <div
          class="box"
          style="
            margin-top:10px;
            background:#fff;
            text-align:center;
            font-weight:400;
          "
        >

          <div
            style="
              font-weight:900;
              color:${GREEN};
            "
          >
            Direction du DAE sélectionné
          </div>


          <div
            style="
              height:120px;
              display:flex;
              align-items:center;
              justify-content:center;
              overflow:hidden;
            "
          >

            <div
              id="bociteDaeArrow"
              aria-hidden="true"
              style="
                font-size:86px;
                line-height:1;
                transform-origin:50% 50%;
                transition:transform .18s linear;
                color:${RED};
              "
            >
              ↑
            </div>

          </div>


          <div
            id="bociteDaeArrowLabel"
            style="
              font-size:12px;
              color:#555;
            "
          >
            La flèche s’active après localisation
            et sélection d’un DAE.
          </div>


          <div
            id="bociteDaeSelected"
            style="
              margin-top:8px;
              font-size:13px;
              line-height:1.4;
            "
          >
            Aucun DAE sélectionné.
          </div>

        </div>


        <div id="bociteDaeResults"></div>


        <div
          class="box"
          style="
            margin-top:12px;
            background:#fff;
            font-weight:400;
          "
        >

          <div
            style="
              font-weight:900;
              color:${GREEN};
              margin-bottom:8px;
            "
          >
            Vidéo DAE
          </div>


          <div
            style="
              border-radius:14px;
              overflow:hidden;
              background:#000;
            "
          >

            <iframe
              width="100%"
              height="220"
              src="${VIDEO_URL}"
              title="Utilisation d'un défibrillateur automatisé externe"
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>

          </div>


          <div
            style="
              margin-top:7px;
              font-size:12px;
              color:#555;
            "
          >
            La vidéo reste inchangée tant qu’une nouvelle
            référence officielle n’a pas été vérifiée et validée.
          </div>

        </div>


        <div
          class="box"
          style="
            margin-top:12px;
            background:#fff;
            font-weight:400;
            line-height:1.45;
          "
        >

          <div
            style="
              font-weight:900;
              color:${GREEN};
              font-size:15px;
            "
          >
            À retenir — arrêt cardiaque et DAE
          </div>


          <div style="margin-top:9px;">

            <strong style="color:${GREEN};">
              1. Alerter les secours
            </strong>

            <br>

            112 / 15 / 18 et suivre leurs instructions.

          </div>


          <div style="margin-top:9px;">

            <strong style="color:${GREEN};">
              2. Personne inconsciente qui ne respire pas normalement
            </strong>

            <br>

            Commencer immédiatement les compressions thoraciques.

          </div>


          <div style="margin-top:9px;">

            <strong style="color:${GREEN};">
              3. Dès que le DAE arrive
            </strong>

            <br>

            Allumer l’appareil, dénuder la poitrine,
            poser les électrodes et suivre
            ses instructions vocales.

          </div>


          <div style="margin-top:9px;">

            <strong style="color:${GREEN};">
              4. Pendant l’analyse ou le choc
            </strong>

            <br>

            Personne ne touche la victime.

          </div>


          <div style="margin-top:9px;">

            <strong style="color:${GREEN};">
              5. Après l’analyse ou le choc
            </strong>

            <br>

            Reprendre immédiatement la réanimation
            et continuer jusqu’à l’arrivée des secours
            ou au retour d’une respiration normale.

          </div>


          <div
            style="
              margin-top:12px;
              padding-top:10px;
              border-top:1px solid #ddd;
              font-size:11px;
              color:#555;
            "
          >

            Informations Bo’CitéArt vérifiées
            le ${VERIFIED_DATE}.

            <br>

            Sources suivies :
            Croix-Rouge française,
            Sécurité civile et Géo’DAE —
            base nationale officielle des défibrillateurs.

            <br>

            Les recommandations de premiers secours
            peuvent évoluer.

            Revenez consulter régulièrement cette rubrique
            pour rester informé des dernières consignes validées.

          </div>

        </div>

      </div>
    `;
  }


  /* =========================================================
     OUVERTURE DU MODULE
     ========================================================= */

  function openDae(){

    if(
      typeof window.openModal !==
      "function"
    ){

      console.error(
        "Bo'CitéArt DAE : openModal indisponible."
      );

      return;
    }


    daeResults =
      [];

    selectedDae =
      null;

    userLat =
      null;

    userLng =
      null;

    userHeading =
      null;


    if(
      watchId !== null &&
      navigator.geolocation
    ){

      navigator.geolocation.clearWatch(
        watchId
      );

      watchId =
        null;
    }


    window.openModal(
      "Défibrillateur (DAE)",
      modalHtml()
    );


    setTimeout(
      ()=>{

        const locate =
          byId(
            "bociteDaeLocate"
          );


        if(locate){

          locate.onclick =
            locateAndSearch;
        }

      },
      0
    );
  }


  /* =========================================================
     RACCORDEMENT AU BOUTON EXISTANT
     ========================================================= */

  function installButton(){

    const button =
      byId(
        "daeBtn"
      );


    if(!button){

      return false;
    }


    /*
      Écrase proprement l'ancien onclick
      qui ouvrait auparavant la carte Santé.
    */

    button.onclick =
      function(event){

        if(event){

          event.preventDefault();

          event.stopPropagation();
        }


        openDae();
      };


    button.onkeydown =
      function(event){

        if(
          event.key === "Enter" ||
          event.key === " "
        ){

          event.preventDefault();

          openDae();
        }
      };


    button.setAttribute(
      "aria-label",
      "Trouver les défibrillateurs officiels autour de moi"
    );


    return true;
  }


  window.BociteArtDae = {

    loaded:true,

    open:
      openDae,

    reinstall:
      installButton
  };


  if(
    !installButton()
  ){

    document.addEventListener(
      "DOMContentLoaded",
      installButton,
      {
        once:true
      }
    );
  }

})();


/* =========================================================
   ÇA FINIT ICI — FICHIER COMPLET bociteart-dae.js
   ========================================================= */
