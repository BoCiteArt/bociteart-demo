/* =========================================================
   BO'CITÉART — ENTREPRISE
   CORRECTIFS GÉNÉRAUX
   ========================================================= */

(function initEntrepriseCorrectifs(){

  "use strict";

  const module =
    window.BociteEntreprise;

  if(!module){

    console.error(
      "Bo'CitéArt : module Entreprise introuvable."
    );

    return;
  }

  function getModal(){

    return document.querySelector(
      ".modal-content, .modalContent, #modalContent"
    );
  }

  function removeDuplicateBackButtons(){

    const modal =
      getModal();

    if(!modal){
      return;
    }

    const buttons =
      modal.querySelectorAll(
        ".entrepriseModuleBackBtn,#entrepriseBackBtn"
      );

    if(buttons.length <= 1){
      return;
    }

    buttons.forEach(function(btn,index){

      if(index>0){
        btn.remove();
      }

    });

  }

  function removeDuplicateFooters(){

    const modal =
      getModal();

    if(!modal){
      return;
    }

    const footers =
      modal.querySelectorAll(
        ".entrepriseModuleFooter"
      );

    if(footers.length<=1){
      return;
    }

    footers.forEach(function(box,index){

      if(index>0){
        box.remove();
      }

    });

  }

  function normalizeButtons(){

    const modal =
      getModal();

    if(!modal){
      return;
    }

    modal
      .querySelectorAll(".choiceBtn")
      .forEach(function(button){

        button.style.width="100%";

      });

  }

  function normalizeBoxes(){

    const modal =
      getModal();

    if(!modal){
      return;
    }

    modal
      .querySelectorAll(".box")
      .forEach(function(box){

        box.style.borderRadius="10px";

      });

  }

  function applyCorrections(){

    removeDuplicateBackButtons();

    removeDuplicateFooters();

    normalizeButtons();

    normalizeBoxes();

  }

  const observer =
    new MutationObserver(function(){

      window.setTimeout(
        applyCorrections,
        40
      );

    });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  console.log(
    "✅ Correctifs Entreprise chargés"
  );

})();

/* =========================================================
   BO'CITÉART — ASSISTANT ENTREPRISE RÉSEAU
   RÉPONSE DANS LE MÊME ENCART
   MODE DÉMONSTRATION + API DE PRODUCTION
   ========================================================= */

(function installBociteNetworkAssistant(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    console.error(
      "Bo'CitéArt : module Entreprise introuvable."
    );
    return;
  }

  if(window.BOCITE_NETWORK_ASSISTANT_INSTALLED){
    return;
  }

  window.BOCITE_NETWORK_ASSISTANT_INSTALLED =
    true;

  /*
    En production, cette route sera raccordée
    au serveur sécurisé Bo'CitéArt.

    Aucun changement ne sera nécessaire
    dans l'application.
  */

  const ASSISTANT_ENDPOINT =
    "/api/bociteart-assistant";

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeHtml(value){

    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function findAssistantArea(button){

    if(!button){
      return null;
    }

    let area =
      button.closest(".box");

    if(
      area &&
      area.querySelector(
        "textarea, input[type='text'], input[type='search']"
      )
    ){
      return area;
    }

    const modal =
      button.closest(
        ".modal-content, .modalContent, #modalContent"
      );

    if(!modal){
      return null;
    }

    const fields =
      Array.from(
        modal.querySelectorAll(
          "textarea, input[type='text'], input[type='search']"
        )
      );

    const field =
      fields.find(function(item){

        return (
          item.id === "entrepriseAiQuestion" ||
          normalizeText(
            item.placeholder
          ).includes("question") ||
          normalizeText(
            item.placeholder
          ).includes("recherche")
        );
      });

    if(!field){
      return null;
    }

    return (
      field.closest(".box") ||
      field.parentElement ||
      modal
    );
  }

  function findQuestionField(area){

    if(!area){
      return null;
    }

    return (
      area.querySelector(
        "#entrepriseAiQuestion"
      ) ||
      area.querySelector("textarea") ||
      area.querySelector(
        "input[type='search']"
      ) ||
      area.querySelector(
        "input[type='text']"
      )
    );
  }

  function getResponseHost(area, button){

    if(!area){
      return null;
    }

    let host =
      area.querySelector(
        ".bociteAssistantResponse"
      );

    if(host){
      return host;
    }

    const oldHost =
      area.querySelector(
        "#entrepriseAiAnswer," +
        "#entrepriseAiAnswerV4"
      );

    if(oldHost){

      oldHost.classList.add(
        "bociteAssistantResponse"
      );

      oldHost.innerHTML = "";

      return oldHost;
    }

    host =
      document.createElement("div");

    host.className =
      "bociteAssistantResponse";

    host.style.marginTop =
      "14px";

    if(button){

      button.insertAdjacentElement(
        "afterend",
        host
      );

    }else{

      area.appendChild(host);
    }

    return host;
  }

  function getCurrentPageTitle(){

    const modalTitle =
      document.querySelector(
        ".modal-title," +
        ".modalTitle," +
        "#modalTitle," +
        ".modal-header h1," +
        ".modal-header h2"
      );

    return modalTitle
      ? String(
          modalTitle.textContent || ""
        ).trim()
      : "Entreprise";
  }

  function extractLocation(question){

    const text =
      String(question || "").trim();

    const patterns = [
      /\bville de\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /\bcommune de\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /\bautour de\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /\bprès de\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /\bsur\s+([a-zA-ZÀ-ÿ' -]{2,45})/i,
      /\bà\s+([a-zA-ZÀ-ÿ' -]{2,45})/i
    ];

    for(
      let index = 0;
      index < patterns.length;
      index++
    ){

      const match =
        text.match(
          patterns[index]
        );

      if(match){

        return String(
          match[1] || ""
        )
          .replace(
            /\b(?:rapidement|urgent|pour|avec|dans|et)\b.*$/i,
            ""
          )
          .trim();
      }
    }

    return "";
  }

  function buildLocalFallback(question){

    const normalized =
      normalizeText(question);

    const location =
      extractLocation(question);

    let category =
      "professionnel";

    let screen =
      "annuaire";

    if(
      normalized.includes("emploi") ||
      normalized.includes("recrut") ||
      normalized.includes("salarie") ||
      normalized.includes("candidat") ||
      normalized.includes("apprenti") ||
      normalized.includes("stage")
    ){
      category =
        "emploi";

      screen =
        "emploi";
    }

    if(
      normalized.includes("charge") ||
      normalized.includes("electricite") ||
      normalized.includes("gaz") ||
      normalized.includes("assurance") ||
      normalized.includes("mutualis")
    ){
      category =
        "mutualisation";

      screen =
        "mutualisation";
    }

    if(
      normalized.includes("mecenat") ||
      normalized.includes("mecene") ||
      normalized.includes("don")
    ){
      category =
        "mécénat";

      screen =
        "mecenat";
    }

    return {
      mode:"demonstration",

      answer:
        location
          ? (
              "Votre demande a été comprise. " +
              "La recherche doit commencer à " +
              location +
              ", puis être élargie aux communes voisines si aucun résultat suffisant n’est disponible."
            )
          : (
              "Votre demande a été comprise. " +
              "La recherche doit commencer dans votre commune, puis être élargie progressivement si nécessaire."
            ),

      notice:
        "Aucun résultat professionnel réel ne peut encore être confirmé tant que l’annuaire économique et le serveur de recherche Bo'CitéArt ne sont pas raccordés.",

      category:category,

      screen:screen,

      results:[],

      canExpand:true
    };
  }

  async function requestNetworkAnswer(question){

    const controller =
      new AbortController();

    const timeout =
      window.setTimeout(function(){

        controller.abort();

      },12000);

    try{

      const response =
        await fetch(
          ASSISTANT_ENDPOINT,
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
              question:question,
              location:
                extractLocation(question),
              page:
                getCurrentPageTitle(),
              source:
                "bociteart-entreprise"
            }),

            signal:
              controller.signal
          }
        );

      window.clearTimeout(
        timeout
      );

      if(!response.ok){

        throw new Error(
          "Réponse réseau " +
          response.status
        );
      }

      const data =
        await response.json();

      if(
        !data ||
        !String(
          data.answer || ""
        ).trim()
      ){
        throw new Error(
          "Réponse vide"
        );
      }

      return data;

    }catch(error){

      window.clearTimeout(
        timeout
      );

      console.info(
        "Assistant réseau indisponible, utilisation du mode démonstration.",
        error
      );

      return buildLocalFallback(
        question
      );
    }
  }

  function renderLoading(host){

    host.innerHTML = `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          color:#111;
        ">

        <strong>
          Recherche Bo'CitéArt en cours…
        </strong>

        <br><br>

        La recherche commence localement
        avant d’être élargie si nécessaire.
      </div>
    `;
  }

  function renderResults(results){

    if(
      !Array.isArray(results) ||
      !results.length
    ){
      return "";
    }

    return results
      .map(function(result){

        return `
          <div
            class="box"
            style="
              margin-top:10px;
              border-left:6px solid #2f5d46;
            ">

            <strong style="font-size:18px;">
              ${escapeHtml(
                result.name ||
                "Professionnel"
              )}
            </strong>

            ${
              result.activity
                ? `
                  <br><br>
                  ${escapeHtml(
                    result.activity
                  )}
                `
                : ""
            }

            ${
              result.city
                ? `
                  <br><br>
                  Commune :
                  ${escapeHtml(
                    result.city
                  )}
                `
                : ""
            }

            ${
              result.phone
                ? `
                  <br><br>
                  Téléphone :
                  ${escapeHtml(
                    result.phone
                  )}
                `
                : ""
            }

            ${
              result.email
                ? `
                  <br>
                  E-mail :
                  ${escapeHtml(
                    result.email
                  )}
                `
                : ""
            }

            ${
              result.url
                ? `
                  <br><br>

                  <a
                    href="${escapeHtml(
                      result.url
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="choiceBtn"
                    style="
                      display:block;
                      text-align:center;
                      text-decoration:none;
                    ">
                    Consulter la fiche
                  </a>
                `
                : ""
            }
          </div>
        `;
      })
      .join("");
  }

  function renderAnswer(
    host,
    data,
    question
  ){

    const results =
      Array.isArray(data.results)
        ? data.results
        : [];

    const noResultsText =
      results.length
        ? ""
        : `
          <div
            class="box"
            style="
              margin-top:12px;
              border-left:6px solid #b00020;
            ">

            <strong>
              Aucun résultat confirmé
              n’est disponible dans la zone recherchée.
            </strong>

            <br><br>

            Souhaitez-vous poursuivre
            dans les communes voisines,
            le département,
            la région,
            puis au niveau national si nécessaire ?
          </div>
        `;

    host.innerHTML = `
      <div
        class="box"
        style="
          border-left:6px solid #2f5d46;
          color:#111;
        ">

        <strong style="font-size:19px;">
          Réponse Bo'CitéArt
        </strong>

        <br><br>

        ${escapeHtml(
          data.answer ||
          "Votre demande a été comprise."
        )}

        ${
          data.notice
            ? `
              <br><br>

              <span style="font-weight:700;">
                ${escapeHtml(
                  data.notice
                )}
              </span>
            `
            : ""
        }
      </div>

      ${renderResults(results)}

      ${noResultsText}

      <button
        class="choiceBtn bociteAssistantOpenSectionBtn"
        type="button"
        data-screen="${escapeHtml(
          data.screen ||
          "annuaire"
        )}"
        style="
          width:100%;
          margin-top:12px;
        ">
        Ouvrir la rubrique correspondante
      </button>

      ${
        data.canExpand !== false
          ? `
            <button
              class="choiceBtn bociteAssistantExpandBtn"
              type="button"
              data-question="${escapeHtml(
                question
              )}"
              style="
                width:100%;
                margin-top:8px;
                background:#fff;
              ">
              Continuer la recherche plus loin
            </button>
          `
          : ""
      }

      <div
        class="bociteAssistantExpandedHost">
      </div>
    `;

    const sectionButton =
      host.querySelector(
        ".bociteAssistantOpenSectionBtn"
      );

    if(sectionButton){

      sectionButton.onclick = function(){

        const screen =
          sectionButton.getAttribute(
            "data-screen"
          ) || "annuaire";

        if(
          typeof app.openScreen ===
          "function"
        ){
          app.openScreen(
            screen
          );
        }
      };
    }

    const expandButton =
      host.querySelector(
        ".bociteAssistantExpandBtn"
      );

    if(expandButton){

      expandButton.onclick =
        async function(){

          expandButton.disabled =
            true;

          expandButton.textContent =
            "Recherche élargie en cours…";

          const expandedHost =
            host.querySelector(
              ".bociteAssistantExpandedHost"
            );

          const expandedQuestion =
            question +
            " Élargir la recherche aux communes voisines, au département, à la région puis au niveau national.";

          const expandedData =
            await requestNetworkAnswer(
              expandedQuestion
            );

          if(expandedHost){

            expandedHost.innerHTML = `
              <div
                class="box"
                style="
                  margin-top:12px;
                  border-left:6px solid #2f5d46;
                ">

                <strong>
                  Recherche élargie
                </strong>

                <br><br>

                ${escapeHtml(
                  expandedData.answer ||
                  "La recherche a été élargie."
                )}
              </div>

              ${renderResults(
                expandedData.results
              )}
            `;
          }

          expandButton.remove();
        };
    }

    host.scrollIntoView({
      behavior:"smooth",
      block:"nearest"
    });
  }

  async function answerQuestion(button){

    const area =
      findAssistantArea(
        button
      );

    const field =
      findQuestionField(
        area
      );

    const host =
      getResponseHost(
        area,
        button
      );

    if(
      !area ||
      !field ||
      !host
    ){
      alert(
        "La zone de question est momentanément indisponible."
      );

      return;
    }

    const question =
      String(
        field.value || ""
      ).trim();

    if(!question){

      alert(
        "Écrivez votre question avant de continuer."
      );

      field.focus();

      return;
    }

    renderLoading(
      host
    );

    const data =
      await requestNetworkAnswer(
        question
      );

    renderAnswer(
      host,
      data,
      question
    );
  }

  /*
    Capture prioritaire :
    l’ancien message provisoire
    ne peut plus remplacer la réponse.
  */

  document.addEventListener(
    "click",
    function(event){

      const target =
        event.target;

      if(
        !target ||
        typeof target.closest !==
        "function"
      ){
        return;
      }

      const button =
        target.closest("button");

      if(!button){
        return;
      }

      const text =
        normalizeText(
          button.textContent
        );

      const isAssistantButton =
        button.id ===
          "entrepriseAiAskBtn" ||

        button.id ===
          "entrepriseAiAskBtnV4" ||

        text ===
          "poser ma question";

      if(!isAssistantButton){
        return;
      }

      const area =
        findAssistantArea(
          button
        );

      if(!area){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation ===
        "function"
      ){
        event.stopImmediatePropagation();
      }

      answerQuestion(
        button
      );

    },
    true
  );

  document.addEventListener(
    "keydown",
    function(event){

      if(
        event.key !== "Enter" ||
        !event.target
      ){
        return;
      }

      if(
        event.target.id !==
        "entrepriseAiQuestion"
      ){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const area =
        event.target.closest(".box");

      const button =
        area
          ? Array.from(
              area.querySelectorAll(
                "button"
              )
            )
            .find(function(item){

              return normalizeText(
                item.textContent
              ) ===
                "poser ma question";
            })
          : null;

      answerQuestion(
        button
      );

    },
    true
  );

  console.log(
    "✅ Assistant Entreprise réseau raccordé"
  );

})();

/* =========================================================
   BO'CITÉART — RECHERCHE PROFESSIONNELLE
   MODES FRANCE ET EUROPE
   ========================================================= */

(function addFranceEuropeSearchModes(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    return;
  }

  function escapeHtml(value){

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getCurrentQuestion(){

    const input =
      document.getElementById(
        "entrepriseAiQuestion"
      );

    return input
      ? String(input.value || "").trim()
      : "";
  }

  function getResponseHost(){

    return (
      document.querySelector(
        ".bociteAssistantResponse"
      ) ||
      document.getElementById(
        "entrepriseAiAnswer"
      ) ||
      document.getElementById(
        "entrepriseAiAnswerV4"
      )
    );
  }

  function openSearchMode(mode){

    const question =
      getCurrentQuestion();

    if(!question){

      alert(
        "Écrivez d’abord votre recherche."
      );

      return;
    }

    const host =
      getResponseHost();

    if(!host){
      return;
    }

    const isEurope =
      mode === "europe";

    host.insertAdjacentHTML(
      "beforeend",
      `
        <div
          class="box"
          style="
            margin-top:12px;
            border-left:6px solid #2f5d46;
          ">

          <strong style="font-size:19px;">
            Recherche ${
              isEurope
                ? "européenne"
                : "nationale"
            }
          </strong>

          <br><br>

          Recherche demandée :

          <br><br>

          <strong>
            ${escapeHtml(question)}
          </strong>

          <br><br>

          ${
            isEurope
              ? `
                La recherche sera effectuée
                séparément dans les pays européens
                connectés au réseau Bo'CitéArt.

                <br><br>

                Les résultats pourront être classés
                par pays,
                distance,
                activité,
                disponibilité
                et niveau de vérification.
              `
              : `
                La recherche sera étendue
                à l’ensemble de la France.

                <br><br>

                Les résultats pourront être classés
                par région,
                département,
                distance,
                activité
                et disponibilité.
              `
          }

          <br><br>

          <strong>
            Mode préparé pour le raccordement officiel.
          </strong>

          <br><br>

          Dès que le serveur professionnel sera connecté,
          les entreprises trouvées apparaîtront ici
          avec leurs coordonnées,
          leur activité
          et leur fiche détaillée.
        </div>
      `
    );

    /*
      Plus tard, le serveur recevra directement :
      scope = "france" ou scope = "europe".
    */

    if(
      typeof app.runProfessionalNetworkSearch ===
      "function"
    ){
      app.runProfessionalNetworkSearch({
        question:question,
        scope:mode
      });
    }
  }

  function addSearchModeButtons(){

    const host =
      getResponseHost();

    if(!host){
      return;
    }

    if(
      host.querySelector(
        "#bociteFranceSearchBtn"
      )
    ){
      return;
    }

    const container =
      document.createElement("div");

    container.className =
      "box";

    container.style.marginTop =
      "12px";

    container.style.borderLeft =
      "6px solid #b00020";

    container.innerHTML = `
      <strong style="font-size:18px;">
        Étendre directement la recherche
      </strong>

      <br><br>

      Vous pouvez choisir immédiatement
      une recherche nationale
      ou une recherche européenne séparée.

      <br><br>

      <button
        id="bociteFranceSearchBtn"
        class="choiceBtn"
        type="button"
        style="width:100%;">
        Rechercher dans toute la France
      </button>

      <button
        id="bociteEuropeSearchBtn"
        class="choiceBtn"
        type="button"
        style="
          width:100%;
          margin-top:8px;
          background:#fff;
        ">
        Rechercher en Europe
      </button>
    `;

    host.appendChild(
      container
    );

    const franceButton =
      document.getElementById(
        "bociteFranceSearchBtn"
      );

    const europeButton =
      document.getElementById(
        "bociteEuropeSearchBtn"
      );

    if(franceButton){

      franceButton.onclick =
        function(){

          openSearchMode(
            "france"
          );
        };
    }

    if(europeButton){

      europeButton.onclick =
        function(){

          openSearchMode(
            "europe"
          );
        };
    }
  }

  const observer =
    new MutationObserver(function(){

      window.setTimeout(
        addSearchModeButtons,
        40
      );
    });

  observer.observe(
    document.body,
    {
      childList:true,
      subtree:true
    }
  );

  window.setTimeout(
    addSearchModeButtons,
    100
  );

  console.log(
    "✅ Recherches France et Europe préparées"
  );

})();

/* =========================================================
   BO'CITÉART — CORRECTIF BANDES DÉFILANTES
   CLIC • TOUCHER • NAVIGATION
   ========================================================= */

(function repairEntrepriseScrollingBands(){

  "use strict";

  const app =
    window.BociteEntreprise;

  if(!app){
    return;
  }

  function normalizeText(value){

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function installBandStyles(){

    if(
      document.getElementById(
        "entrepriseBandClickRepairStyle"
      )
    ){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "entrepriseBandClickRepairStyle";

    style.textContent = `
      .entrepriseBand,
      .entreprise-band,
      [data-entreprise-screen],
      [data-screen],
      .marquee,
      .ticker,
      .scrollingBand {
        pointer-events:auto !important;
        cursor:pointer !important;
        touch-action:manipulation !important;
        position:relative !important;
        z-index:5 !important;
      }

      .entrepriseBand *,
      .entreprise-band *,
      [data-entreprise-screen] *,
      [data-screen] *,
      .marquee *,
      .ticker *,
      .scrollingBand * {
        pointer-events:none !important;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function detectScreen(element){

    if(!element){
      return "";
    }

    const directScreen =
      element.getAttribute(
        "data-entreprise-screen"
      ) ||
      element.getAttribute(
        "data-screen"
      );

    if(directScreen){
      return directScreen;
    }

    const text =
      normalizeText(
        element.textContent
      );

    if(
      text.includes("deposez une offre") ||
      text.includes("emploi") ||
      text.includes("recrut")
    ){
      return "emploi";
    }

    if(
      text.includes("attirez") ||
      text.includes("fidelisez") ||
      text.includes("fidelisation")
    ){
      return "fidelisation";
    }

    if(
      text.includes("developpez") ||
      text.includes("developpement")
    ){
      return "developpement";
    }

    if(
      text.includes("reduisez vos charges") ||
      text.includes("mutualisation")
    ){
      return "mutualisation";
    }

    if(
      text.includes("faites connaitre") ||
      text.includes("visibilite")
    ){
      return "visibilite";
    }

    if(
      text.includes("comparez") ||
      text.includes("economies")
    ){
      return "economies";
    }

    if(
      text.includes("preparez l avenir") ||
      text.includes("perennite")
    ){
      return "perennite";
    }

    if(
      text.includes("mecenat")
    ){
      return "mecenat";
    }

    if(
      text.includes("entreprises de votre ville") ||
      text.includes("annuaire")
    ){
      return "annuaire_local";
    }

    return "";
  }

  function findClickableBand(target){

    if(
      !target ||
      typeof target.closest !==
      "function"
    ){
      return null;
    }

    return target.closest(
      ".entrepriseBand," +
      ".entreprise-band," +
      "[data-entreprise-screen]," +
      "[data-screen]," +
      ".marquee," +
      ".ticker," +
      ".scrollingBand"
    );
  }

  function openBandScreen(element){

    const screen =
      detectScreen(
        element
      );

    if(
      !screen ||
      typeof app.openScreen !==
      "function"
    ){
      return;
    }

    app.openScreen(
      screen
    );
  }

  document.addEventListener(
    "click",
    function(event){

      const band =
        findClickableBand(
          event.target
        );

      if(!band){
        return;
      }

      const screen =
        detectScreen(
          band
        );

      if(!screen){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if(
        typeof event.stopImmediatePropagation ===
        "function"
      ){
        event.stopImmediatePropagation();
      }

      openBandScreen(
        band
      );

    },
    true
  );

  document.addEventListener(
    "touchend",
    function(event){

      const band =
        findClickableBand(
          event.target
        );

      if(!band){
        return;
      }

      const screen =
        detectScreen(
          band
        );

      if(!screen){
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      openBandScreen(
        band
      );

    },
    {
      capture:true,
      passive:false
    }
  );

  installBandStyles();

  console.log(
    "✅ Bandes défilantes Entreprise rendues cliquables"
  );

})();



