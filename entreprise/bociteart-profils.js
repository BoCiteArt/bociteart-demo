/* =========================================================
   BO'CITÉART — PORTE D'ENTRÉE
   ÉTAPE 4 — CHOIX DE L'UNIVERS

   FICHIER INDÉPENDANT :
   aucun onglet existant n'est modifié
   ========================================================= */

(function initBociteartProfils(){

  "use strict";

  if(window.BociteProfils){
    return;
  }

  const STORAGE_KEY =
    "bociteart_visit_profile_v1";

  const profiles = [
    {
      id:"jeune",
      title:"Jeune",
      description:
        "Découvrir les œuvres, participer avec l’école et faire entendre son regard sur la ville."
    },
    {
      id:"citoyen",
      title:"Citoyen",
      description:
        "Découvrir les initiatives, les commerces, les associations, les événements et les richesses locales."
    },
    {
      id:"ecole",
      title:"École",
      description:
        "Valoriser les élèves, les projets pédagogiques, les œuvres et la voix de l’enfant."
    },
    {
      id:"association",
      title:"Association",
      description:
        "Faire connaître ses actions, ses besoins, ses événements et rassembler davantage."
    },
    {
      id:"sport",
      title:"Club sportif",
      description:
        "Présenter ses activités, ses équipes, ses résultats, ses besoins et ses événements."
    },
    {
      id:"commerce",
      title:"Commerce",
      description:
        "Renforcer sa visibilité, fidéliser sa clientèle et participer à la dynamique locale."
    },
    {
      id:"entreprise",
      title:"Entreprise",
      description:
        "Développer sa visibilité, recruter, rechercher des partenaires et accéder aux outils professionnels."
    },
    {
      id:"mairie",
      title:"Mairie",
      description:
        "Valoriser les ressources du territoire et relier les habitants, les écoles et les acteurs locaux."
    }
  ];

  function getElement(id){

    return document.getElementById(id);
  }

  function getLogoHtml(){

    return `
      <span style="color:#2f5d46;font-weight:900;">
        Bo'Cité
      </span><span style="color:#b00020;font-weight:900;">
        Art
      </span>
    `;
  }

  function installStyles(){

    if(
      getElement(
        "bociteProfilsStyles"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "bociteProfilsStyles";

    style.textContent = `
      #bociteProfilsOverlay {
        position:fixed;
        inset:0;
        z-index:999999;
        overflow-y:auto;
        box-sizing:border-box;
        padding:16px 10px 34px;
        background:#f3eddf;
        color:#111;
        font-family:Arial, sans-serif;
      }

      #bociteProfilsCard {
        width:100%;
        max-width:680px;
        margin:0 auto;
        box-sizing:border-box;
        padding:22px 18px;
        border:2px solid #2f5d46;
        border-radius:15px;
        background:#fffdf7;
        box-shadow:0 8px 28px rgba(0,0,0,.13);
      }

      .bociteProfilsTitle {
        margin:0;
        color:#111;
        font-size:28px;
        line-height:1.3;
        text-align:center;
      }

      .bociteProfilsIntro {
        margin-top:15px;
        color:#111;
        font-size:17px;
        line-height:1.5;
        text-align:center;
      }

      .bociteProfilsNotice {
        margin-top:17px;
        padding:14px 13px;
        border-left:6px solid #2f5d46;
        background:#f6f2e9;
        color:#111;
        font-size:15px;
        line-height:1.5;
      }

      .bociteProfilsList {
        display:flex;
        flex-direction:column;
        gap:10px;
        margin-top:18px;
      }

      .bociteProfileBtn {
        display:block;
        width:100%;
        box-sizing:border-box;
        padding:15px 13px;
        border:2px solid #2f5d46;
        border-radius:11px;
        background:#fff;
        color:#111;
        text-align:left;
        cursor:pointer;
        touch-action:manipulation;
      }

      .bociteProfileBtn:hover,
      .bociteProfileBtn:focus {
        background:#f4f0e7;
        outline:3px solid rgba(47,93,70,.18);
      }

      .bociteProfileTitle {
        display:block;
        font-size:18px;
        font-weight:900;
      }

      .bociteProfileDescription {
        display:block;
        margin-top:6px;
        font-size:15px;
        line-height:1.45;
        font-weight:400;
      }

      #bociteProfilsBackBtn {
        display:block;
        width:100%;
        margin-top:14px;
        padding:13px 12px;
        border:2px solid #2f5d46;
        border-radius:10px;
        background:#fff;
        color:#111;
        font-size:17px;
        font-weight:800;
        cursor:pointer;
      }

      @media (max-width:600px) {
        #bociteProfilsOverlay {
          padding:9px 7px 26px;
        }

        #bociteProfilsCard {
          padding:19px 13px;
          border-radius:12px;
        }

        .bociteProfilsTitle {
          font-size:24px;
        }

        .bociteProfilsIntro {
          font-size:16px;
        }

        .bociteProfileTitle {
          font-size:17px;
        }

        .bociteProfileDescription {
          font-size:14px;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function getProfilesHtml(){

    const buttons =
      profiles.map(function(profile){

        return `
          <button
            class="bociteProfileBtn"
            type="button"
            data-bocite-profile="${profile.id}">

            <span class="bociteProfileTitle">
              ${profile.title}
            </span>

            <span class="bociteProfileDescription">
              ${profile.description}
            </span>

          </button>
        `;
      }).join("");

    return `
      <div id="bociteProfilsCard">

        <h2 class="bociteProfilsTitle">
          Choisissez votre univers
        </h2>

        <div class="bociteProfilsIntro">

          Chaque personne peut découvrir
          ${getLogoHtml()}
          selon ce qui l’intéresse.

          <br><br>

          Ce choix personnalise seulement la visite.

          <br>

          Il ne crée aucun abonnement
          et ne demande aucune fiche complète.

        </div>

        <div class="bociteProfilsNotice">

          Les informations publiques restent accessibles.

          <br><br>

          Une inscription adaptée sera proposée uniquement
          lorsqu’une fonction privée,
          une publication,
          un paiement
          ou un abonnement sera demandé.

        </div>

        <div class="bociteProfilsList">
          ${buttons}
        </div>

        <button
          id="bociteProfilsBackBtn"
          type="button">
          Retour
        </button>

      </div>
    `;
  }

  function removeProfiles(){

    const overlay =
      getElement(
        "bociteProfilsOverlay"
      );

    if(overlay){
      overlay.remove();
    }
  }

  function saveProfile(profileId){

    const record = {
      profile:profileId,
      selectedAt:
        new Date().toISOString()
    };

    try{

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(record)
      );

    }catch(error){

      console.warn(
        "Bo'CitéArt : profil de visite non enregistré.",
        error
      );
    }

    window.BociteCurrentProfile =
      record;

    return record;
  }

  function dispatchProfile(profileId){

    const record =
      saveProfile(
        profileId
      );

    removeProfiles();

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:profile-selected",
        {
          detail:record
        }
      )
    );

    openExistingSpace(
      profileId
    );
  }

  function openEntrepriseChoice(){

    const app =
      window.BociteEntreprise;

    if(
      app &&
      typeof app.openEntrepriseIntroduction ===
      "function"
    ){
      app.openEntrepriseIntroduction();
      return true;
    }

    if(
      app &&
      typeof app.openEntrepriseHome ===
      "function"
    ){
      app.openEntrepriseHome();
      return true;
    }

    if(
      app &&
      typeof app.openHome ===
      "function"
    ){
      app.openHome();
      return true;
    }

    return false;
  }

  function clickExistingButton(words){

    const candidates =
      Array.from(
        document.querySelectorAll(
          "button, .choiceBtn, [role='button'], a"
        )
      );

    const button =
      candidates.find(function(element){

        const text =
          String(
            element.textContent || ""
          )
            .toLowerCase()
            .normalize("NFD")
            .replace(
              /[\u0300-\u036f]/g,
              ""
            )
            .replace(
              /\s+/g,
              " "
            )
            .trim();

        return words.some(function(word){

          return text === word ||
            text.includes(word);
        });
      });

    if(button){

      button.click();
      return true;
    }

    return false;
  }

  function openExistingSpace(profileId){

    /*
      Aucun onglet existant n’est modifié.
      Ce fichier tente uniquement d’ouvrir
      les accès déjà présents.
    */

    if(
      profileId === "entreprise"
    ){

      if(openEntrepriseChoice()){
        return;
      }
    }

    const labels = {
      jeune:[
        "jeune",
        "enfant"
      ],
      citoyen:[
        "citoyen",
        "habitant"
      ],
      ecole:[
        "ecole",
        "école"
      ],
      association:[
        "association",
        "associations"
      ],
      sport:[
        "sport",
        "club sportif"
      ],
      commerce:[
        "commerce",
        "commerçant",
        "commercant"
      ],
      mairie:[
        "mairie",
        "ville"
      ]
    };

    if(
      labels[profileId] &&
      clickExistingButton(
        labels[profileId]
      )
    ){
      return;
    }

    /*
      Si l’accès existant n’est pas encore identifiable,
      on revient simplement à l’application actuelle.
    */

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:enter-existing-app",
        {
          detail:{
            profile:profileId
          }
        }
      )
    );

    alert(
      "Votre univers est sélectionné. " +
      "Le raccordement à cet espace existant sera réalisé sans modifier son contenu."
    );
  }

  function returnToSynoptique(){

    removeProfiles();

    if(
      window.BociteSynoptique &&
      typeof window.BociteSynoptique.open ===
      "function"
    ){
      window.BociteSynoptique.open();
      return;
    }

    document.dispatchEvent(
      new CustomEvent(
        "bociteart:open-synoptique"
      )
    );
  }

  function bindProfiles(){

    document
      .querySelectorAll(
        "[data-bocite-profile]"
      )
      .forEach(function(button){

        button.onclick = function(){

          dispatchProfile(
            button.getAttribute(
              "data-bocite-profile"
            )
          );
        };
      });

    const backButton =
      getElement(
        "bociteProfilsBackBtn"
      );

    if(backButton){

      backButton.onclick =
        returnToSynoptique;
    }
  }

  function openProfiles(){

    installStyles();
    removeProfiles();

    const overlay =
      document.createElement("div");

    overlay.id =
      "bociteProfilsOverlay";

    overlay.innerHTML =
      getProfilesHtml();

    document.body.appendChild(
      overlay
    );

    bindProfiles();

    window.setTimeout(function(){

      overlay.scrollTop = 0;

    },0);
  }

  function getSavedProfile(){

    try{

      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      return saved
        ? JSON.parse(saved)
        : null;

    }catch(error){

      return null;
    }
  }

  window.BociteProfils = {
    open:openProfiles,
    close:removeProfiles,
    getProfile:getSavedProfile,
    storageKey:STORAGE_KEY
  };

  document.addEventListener(
    "bociteart:open-profils",
    openProfiles
  );

  console.log(
    "✅ Choix des univers Bo'CitéArt prêt"
  );

})();
