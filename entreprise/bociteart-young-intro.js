/* =========================================================
   ÇA COMMENCE ICI

   BO'CITÉART — PREMIÈRE DÉCOUVERTE
   JEUNE / MOINS DE 15 ANS

   3 ÉCRANS COURTS
   Le courrier complet reste dans Compte + aide.
   ========================================================= */

(function initBociteYoungIntro(){

  "use strict";

  if(window.BociteYoungIntro){
    return;
  }

  const OVERLAY_ID =
    "bociteYoungIntroOverlay";


  function brand(){

    return `
      <span style="white-space:nowrap;font-weight:700;">
        <span style="color:#2f5d46;">Bo’Cité</span><span style="color:#b00020;">Art</span>
      </span>
    `;
  }


  const SCREENS = [

    {
      title:
        "Bienvenue dans Bo’CitéArt",

      html:`

        <p>
          Ici, tu vas pouvoir découvrir autrement
          ta ville, ses commerces, ses métiers,
          ses clubs, ses associations, son histoire
          et beaucoup d’autres choses.
        </p>

        <p>
          Certaines choses vont peut-être
          beaucoup t’intéresser.
          D’autres moins.
        </p>

        <p>
          <strong>
            Tu n’as pas besoin de tout comprendre aujourd’hui.
          </strong>
        </p>

        <p>
          Avance simplement à ton rythme,
          regarde et laisse-toi surprendre.
        </p>

      `,

      button:
        "Je découvre"
    },


    {
      title:
        "Regarde autour de toi",

      html:`

        <p>
          Regarde les commerçants chez qui tu vas,
          seul ou accompagné.
        </p>

        <p>
          Observe ce qu’ils font, leur métier,
          leurs gestes, ce qu’ils connaissent
          et ce qu’ils apportent autour d’eux.
        </p>

        <p>
          Peut-être qu’un jour,
          tu aimerais faire ce métier toi aussi.
        </p>

        <p>
          <strong>
            Laisse ton imagination te parler.
          </strong>
        </p>

        <p>
          Si quelque chose t’attire,
          pose-toi simplement la question :
        </p>

        <p>
          <strong>
            « Est-ce que j’aimerais faire
            ce métier plus tard ? »
          </strong>
        </p>

        <p>
          Et demain, qui sait ?
          Peut-être que ce sera toi derrière
          cette vitrine, dans cet atelier,
          cette entreprise ou à la place
          de ce professionnel.
        </p>

        <p>
          Fais la même chose avec tous les métiers
          que tu découvres ou que tu découvriras.
        </p>

        <p>
          Certains ne te plairont pas.
          D’autres éveilleront peut-être ta curiosité.
        </p>

        <p>
          <strong>
            Regarde, questionne, imagine
            et découvre ce qui pourrait
            un jour te correspondre.
          </strong>
        </p>

      `,

      button:
        "Je continue ma découverte"
    },


    {
      title:
        "À toi maintenant",

      html:`

        <p>
          En découvrant ${brand()},
          tu verras aussi que certains petits choix
          du quotidien peuvent avoir une importance
          autour de toi.
        </p>

        <p>
          Un petit commerce, un artisan,
          un producteur, un métier ou un savoir-faire
          peuvent parfois être juste à côté de chez toi.
        </p>

        <p>
          Les bocitecoins feront aussi partie
          de tes découvertes.
        </p>

        <p>
          Ils pourront t’aider peu à peu
          à regarder autrement les commerces
          et ce qui existe dans ta ville.
        </p>

        <p>
          <strong>
            À toi de découvrir, de comprendre
            et de te faire ta propre opinion.
          </strong>
        </p>

        <p>
          Certaines fonctions particulières,
          comme partager ta vraie voix,
          une photo, une vidéo ou une création,
          pourront demander l’accord
          d’un parent ou responsable.
        </p>

        <p>
          <strong>
            Mais cela ne t’empêchera jamais
            de continuer à découvrir ${brand()}.
          </strong>
        </p>

        <p>
          Et si un jour tu veux relire
          ta grande fiche ou découvrir celles
          des autres, tu les retrouveras
          dans <strong>Compte + aide</strong>,
          en bas à droite de l’application.
        </p>

      `,

      button:
        "Entrer dans Bo’CitéArt"
    }

  ];


  function close(){

    const overlay =
      document.getElementById(
        OVERLAY_ID
      );

    if(overlay){
      overlay.remove();
    }
  }


  function open(onComplete){

    close();

    let position = 0;


    const overlay =
      document.createElement("div");

    overlay.id =
      OVERLAY_ID;

    overlay.style.cssText = `
      position:fixed;
      inset:0;
      z-index:1000004;
      overflow:auto;
      box-sizing:border-box;
      padding:14px 10px 30px;
      background:#f3eddf;
      font-family:Arial,sans-serif;
    `;


    overlay.innerHTML = `

      <div
        style="
          width:100%;
          max-width:620px;
          margin:14px auto;
          padding:18px 16px;
          box-sizing:border-box;
          background:#ffffff;
          border:2px solid #2f5d46;
          border-radius:14px;
        ">

        <div
          id="bociteYoungIntroTitle"
          style="
            color:#2f5d46;
            font-size:17px;
            font-weight:700;
            line-height:1.35;
            margin-bottom:16px;
          ">
        </div>

        <div
          id="bociteYoungIntroText"
          style="
            color:#111111;
            font-size:14px;
            font-weight:400;
            line-height:1.55;
          ">
        </div>

        <button
          id="bociteYoungIntroContinue"
          type="button"
          class="choiceBtn"
          style="
            width:100%;
            margin-top:18px;
          ">
        </button>

      </div>

    `;


    document.body.appendChild(
      overlay
    );


    const title =
      document.getElementById(
        "bociteYoungIntroTitle"
      );

    const text =
      document.getElementById(
        "bociteYoungIntroText"
      );

    const button =
      document.getElementById(
        "bociteYoungIntroContinue"
      );


    function show(){

      const screen =
        SCREENS[position];


      title.textContent =
        screen.title;


      text.innerHTML =
        screen.html;


      text
        .querySelectorAll("p")
        .forEach(function(p){

          p.style.margin =
            "0 0 12px 0";

          p.style.fontSize =
            "14px";

          p.style.fontWeight =
            "400";

          p.style.color =
            "#111111";

        });


      button.textContent =
        screen.button;


      overlay.scrollTop =
        0;

    }


    button.onclick =
      function(){

        position++;


        if(
          position <
          SCREENS.length
        ){

          show();

          return;

        }


        close();


        if(
          typeof onComplete ===
          "function"
        ){

          onComplete();

        }

      };


    show();

  }


  window.BociteYoungIntro = {

    open:
      open,

    close:
      close

  };


  console.log(
    "✅ Première découverte Moins de 15 ans chargée"
  );

})();

/* =========================================================
   ÇA FINIT ICI
   ========================================================= */
