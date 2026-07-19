/* ==========================================================
   BO'CITÉART
   MODULE INSCRIPTION
   Fichier : entreprise/bociteart-registration.js
   ========================================================== */

(function () {

"use strict";

/* ---------- Constantes ---------- */

const FORM_ID = "overlay-inscription";

const STORAGE = {

    installation : "bociteart_installation_id_v1",

    activation   : "bociteart_activation_v1",

    account      : "bociteart_account_demo_v1",

    registration : "bociteart_registration_completed_v1",

    statistics   : "bociteart_statistics_queue_v1"

};

let validationEnCours = false;

/* ---------- Outils ---------- */

function $(id){

    return document.getElementById(id);

}

function createInstallationId(){

    if(window.crypto && crypto.randomUUID){

        return crypto.randomUUID();

    }

    return "bociteart-"
        + Date.now().toString(36)
        + "-"
        + Math.random().toString(36).substring(2,10);

}

function getInstallationId(){

    let id = localStorage.getItem(STORAGE.installation);

    if(!id){

        id = createInstallationId();

        localStorage.setItem(STORAGE.installation,id);

    }

    return id;

}

function calculateAge(dateValue){

    if(!dateValue) return null;

    const birth = new Date(dateValue);

    const today = new Date();

    let age = today.getFullYear()-birth.getFullYear();

    const m = today.getMonth()-birth.getMonth();

    if(m<0 || (m===0 && today.getDate()<birth.getDate())){

        age--;

    }

    return age;

}

function ageGroup(age){

    if(age<18) return "moins18";

    if(age<30) return "18-29";

    if(age<45) return "30-44";

    if(age<60) return "45-59";

    return "60+";

}

console.log("✅ bociteart-registration Bloc 1 chargé");

})();
