/* =========================================================
   BO'CITÉART
   CONNECTEUR ANNUAIRE SANTÉ
   ========================================================= */

(function(){

  "use strict";

  const VERSION =
    "2026-09-14-01";


  async function searchHealthProfessionals(
    options
  ){

    const commune =
      String(
        options &&
        options.commune
          ? options.commune
          : ""
      ).trim();


    const query =
      String(
        options &&
        options.query
          ? options.query
          : ""
      ).trim();


    if(
      !commune
    ){

      return {
        ok:false,
        connected:false,
        rows:[],
        reason:"missing_commune"
      };

    }


    /*
     * Le navigateur ne contacte jamais
     * directement l'API officielle.
     *
     * Cette adresse sera raccordée
     * au serveur Bo'CitéArt.
     */

  const endpoint =
  String(
    window.BOCITEART_HEALTH_API_ENDPOINT ||
    ""
  ).trim();


if(
  !endpoint
){

  return {
    ok:false,
    connected:false,
    rows:[],
    reason:"not_configured"
  };

}


    try{

      const response =
        await fetch(
          endpoint,
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                commune:
                  commune,
                query:
                  query
              })
          }
        );


      if(
        !response.ok
      ){

        return {
          ok:false,
          connected:false,
          rows:[],
          reason:
            "service_unavailable"
        };

      }


      const data =
        await response.json();


      if(
        !data ||
        !Array.isArray(
          data.rows
        )
      ){

        return {
          ok:false,
          connected:false,
          rows:[],
          reason:
            "invalid_response"
        };

      }


      return {
        ok:true,
        connected:true,
        rows:
          data.rows
      };


    }catch(
      error
    ){

      console.warn(
        "Bo'CitéArt — Annuaire santé non raccordé.",
        error
      );


      return {
        ok:false,
        connected:false,
        rows:[],
        reason:
          "network_unavailable"
      };

    }

  }


  window.BociteHealthAPI = {

    version:
      VERSION,

    search:
      searchHealthProfessionals

  };


})();
