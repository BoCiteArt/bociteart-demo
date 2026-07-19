/* ==========================================================
   BO'CITÉART
   MODULE INSCRIPTION
   Fichier : entreprise/bociteart-registration.js
   ========================================================== */

(function () {

"use strict";

/* ---------- Constantes ---------- */

const STORAGE = {
    installation : "bociteart_installation_id_v1",
    activation   : "bociteart_activation_v1",
    account      : "bociteart_account_demo_v1",
    registration : "bociteart_registration_completed_v1",
    statistics   : "bociteart_statistics_queue_v1"
};

/* ---------- Installation ---------- */

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

/* ---------- Statistiques ---------- */

function loadStatisticsQueue(){

    try{
        return JSON.parse(localStorage.getItem(STORAGE.statistics) || "[]");
    }catch(e){
        return [];
    }

}

function saveStatisticsQueue(queue){

    localStorage.setItem(
        STORAGE.statistics,
        JSON.stringify(queue)
    );

}

function addStatistic(data){

    const queue = loadStatisticsQueue();

    queue.push({

        installationId:getInstallationId(),
        date:new Date().toISOString(),
        ...data

    });

    saveStatisticsQueue(queue);

}

/* ---------- Compte ---------- */

function createAccount(data){

    localStorage.setItem(
        STORAGE.account,
        JSON.stringify(data)
    );

    localStorage.setItem(
        STORAGE.registration,
        "true"
    );

}

function registrationCompleted(){

    return localStorage.getItem(STORAGE.registration)==="true";

}

/* ---------- API publique ---------- */

window.BoCiteArtRegistration = {

    createAccount,
    registrationCompleted,
    addStatistic,
    getInstallationId

};

console.log("✅ bociteart-registration chargé");

})();
