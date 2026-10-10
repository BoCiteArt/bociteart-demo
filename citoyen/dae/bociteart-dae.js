
/* =========================================================
   ÇA COMMENCE ICI — bociteart-dae.js — VERSION TEST 10/10/2026 — 0845
   BO'CITÉART — CITOYEN — DAE
   ========================================================= */

(function initBociteartDae(){
  "use strict";
  if (window.BociteArtDae && window.BociteArtDae.loaded) return;

  const GREEN="#2f5d46", RED="#c84b43";
  const VIDEO="https://www.youtube.com/embed/3CAmp8yKYEg?rel=0&modestbranding=1";
  const WFS="https://datacarto.atlasante.fr/wfs/194a610d-f004-4ca2-95e4-4087eafb1ab9";
  const FALLBACK_TYPES=["ms:geodae_publique","geodae_publique"];
  const KEY="bociteart.dae.pointVictime.v1";
  const MAX_AGE_MS=60*60*1000;
  const $=id=>document.getElementById(id);
  let candidates=[],selectedId=null,user=null,pointVictime=null;
  let requestId=0,gpsWatch=null,metroTimer=null,metroAudio=null,layerCache=null,lifeTimer=null;
  let pendingVictim=null;

  function e(v){return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
  function norm(v){return String(v==null?"":v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();}
  function prop(obj,names){const p=obj&&obj.properties||{};for(const n of names)if(p[n]!==undefined&&p[n]!==null&&String(p[n]).trim()!=="")return p[n];return null;}
  function field(f,n){return prop(f,["c_"+n,n]);}
  function yes(v){return v===true||v===1||["oui","true","t","1","yes"].includes(norm(v));}
  function no(v){return v===false||v===0||["non","false","f","0","no"].includes(norm(v));}
  function number(v){if(v===null||v===undefined||String(v).trim()==="")return null;const n=Number(String(v).replace(",","."));return Number.isFinite(n)?n:null;}
  function todayExpired(v){if(!v)return false;const m=String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);if(!m)return false;const d=new Date(+m[1],+m[2]-1,+m[3]);if(d.getFullYear()!==+m[1]||d.getMonth()!==+m[2]-1||d.getDate()!==+m[3])return false;const t=new Date();t.setHours(0,0,0,0);return d<t;}
  function formatDate(v){const m=String(v||"").match(/^(\d{4})-(\d{2})-(\d{2})/);return m?`${m[3]}/${m[2]}/${m[1]}`:"Non renseignée";}
  function distKm(a,b){const rad=Math.PI/180,R=6371;const x=(b.lat-a.lat)*rad,y=(b.lng-a.lng)*rad;const h=Math.sin(x/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));}
  function distText(km){return km<1?Math.round(km*1000)+" m":km.toFixed(1).replace(".",",")+" km";}
  function coords(f){const lat=number(field(f,"lat_coor1")),lng=number(field(f,"long_coor1"));if(lat!==null&&lng!==null&&Math.abs(lat)<=90&&Math.abs(lng)<=180)return {lat,lng};const g=f&&f.geometry;if(g&&g.type==="Point"&&Array.isArray(g.coordinates)){const lon=number(g.coordinates[0]),la=number(g.coordinates[1]);if(la!==null&&lon!==null&&Math.abs(la)<=90&&Math.abs(lon)<=180)return{lat:la,lng:lon};}return null;}

  function daeFromFeature(f){
    const c=coords(f);if(!c)return null;
    if(norm(field(f,"etat_fonct"))!=="en fonctionnement")return null;
    const et=norm(field(f,"etat"));if(et&&et!=="actif")return null;
    const valid=norm(field(f,"etat_valid"));if(valid&&!(["valide","validee","valides","validees"].includes(valid)))return null;
    if(yes(field(f,"dae_mobile"))||yes(field(f,"doublon")))return null;
    const bat=field(f,"dtpr_bat"),pads=field(f,"dtpr_lcad");if(todayExpired(bat)||todayExpired(pads))return null;
    const id=String(field(f,"gid")||field(f,"id")||f.id||c.lat.toFixed(6)+":"+c.lng.toFixed(6));
    const address=[field(f,"adr_num"),field(f,"adr_voie"),field(f,"com_cp"),field(f,"com_nom")].filter(Boolean).join(" ").trim();
    const libre=field(f,"acc_lib");
    return {id,name:String(field(f,"nom")||"Défibrillateur déclaré"),lat:c.lat,lng:c.lng,address:address||"Adresse non renseignée",state:"Déclaré en fonctionnement",access:String(field(f,"acc")||"Non renseignée"),free:yes(libre)?"Oui":no(libre)?"Non":"Non renseigné",days:String(field(f,"disp_j")||"Non renseignés").replace(/\|/g,", "),hours:String(field(f,"disp_h")||"Non renseignés").replace(/\|/g,", "),details:String(field(f,"acc_complt")||""),avail:String(field(f,"disp_complt")||""),maintenance:formatDate(field(f,"dermnt")),battery:formatDate(bat),pads:formatDate(pads),km:Infinity};
  }

  function bbox(lat,lng,r){const dLat=r/111.32,dLng=r/(111.32*Math.max(0.15,Math.cos(lat*Math.PI/180)));return [lng-dLng,lat-dLat,lng+dLng,lat+dLat].join(",");}
  async function fetchTimeout(url,timeout){const ac=new AbortController(),timeoutId=setTimeout(()=>ac.abort(),timeout);try{return await fetch(url,{method:"GET",credentials:"omit",cache:"no-store",signal:ac.signal});}finally{clearTimeout(timeoutId);}}

  async function getLayers(){
    if(layerCache)return layerCache;
    let candidates=FALLBACK_TYPES.slice();
    try{
      const r=await fetchTimeout(WFS+"?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetCapabilities",7000);
      if(r.ok){
        const xml=new DOMParser().parseFromString(await r.text(),"application/xml");
        const types=Array.from(xml.getElementsByTagName("*")).filter(n=>n.localName==="FeatureType");
        const named=types.map(t=>Array.from(t.childNodes).find(n=>n.localName==="Name")).filter(Boolean).map(n=>n.textContent.trim());
        const publicLayers=named.filter(n=>/(geodae|defibrillat|dae)/i.test(n));
        candidates=[...new Set([...publicLayers,...candidates])];
      }
    }catch(_){ /* Essai sur les noms publics de repli. */ }
    layerCache=candidates;
    return candidates;
  }

  async function featuresInZone(lat,lng,r){
    // Essayer immédiatement la couche publique connue. La découverte WFS n'est
    // lancée qu'en cas d'échec pour éviter une requête inutile en situation d'urgence.
    let lastError=null;
    const tried=new Set();
    async function attempt(layer){
      tried.add(layer);
      const params=new URLSearchParams({SERVICE:"WFS",VERSION:"1.0.0",REQUEST:"GetFeature",TYPENAME:layer,OUTPUTFORMAT:"application/json",SRSNAME:"EPSG:4326",BBOX:bbox(lat,lng,r)+",EPSG:4326"});
      const response=await fetchTimeout(WFS+"?"+params,8500);
      if(!response.ok)throw new Error("HTTP "+response.status);
      const data=JSON.parse(await response.text());
      if(!data||!Array.isArray(data.features))throw new Error("Format GeoJSON non valide");
      if(data.features.length&&!data.features.some(f=>field(f,"etat_fonct")!==null)){
        throw new Error("La couche ne contient pas les champs Géo’DAE attendus");
      }
      layerCache=[layer];
      return data.features;
    }
    for(const layer of layerCache||FALLBACK_TYPES){
      try{return await attempt(layer);}catch(ex){lastError=ex;}
    }
    // L'URL/la couche peuvent évoluer ; découverte seulement après échec.
    layerCache=null;
    for(const layer of await getLayers()){
      if(tried.has(layer))continue;
      try{return await attempt(layer);}catch(ex){lastError=ex;}
    }
    throw lastError||new Error("Service de données indisponible");
  }

  async function findThree(from){
    const found=[],seen=new Set();
    for(const radius of [5,15,40]){
      const features=await featuresInZone(from.lat,from.lng,radius);
      for(const f of features){
        const d=daeFromFeature(f);if(!d)continue;
        d.km=distKm(from,d);if(d.km>radius+0.05)continue;
        const key=d.lat.toFixed(6)+";"+d.lng.toFixed(6);if(seen.has(key))continue;
        seen.add(key);found.push(d);
      }
      found.sort((a,b)=>a.km-b.km);
      if(found.length>=3)break;
    }
    return found.slice(0,3);
  }

  function storageSave(){try{if(pointVictime)sessionStorage.setItem(KEY,JSON.stringify(pointVictime));else sessionStorage.removeItem(KEY);}catch(_){}}
  function storageLoad(){try{const p=JSON.parse(sessionStorage.getItem(KEY)||"null");if(p&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Number.isFinite(p.time)&&Date.now()>=p.time&&Date.now()-p.time<MAX_AGE_MS)return p;}catch(_){}return null;}
  function markerText(){if(!pointVictime)return"Point non enregistré. Lancez la localisation au lieu de la victime.";return `📍 ${pointVictime.lat.toFixed(6)}, ${pointVictime.lng.toFixed(6)} — GPS ±${Math.round(pointVictime.accuracy||0)} m. Enregistré à ${new Date(pointVictime.time).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}.`;}

  function refreshPoint(){
    const out=$("daeVictimPoint");if(out)out.textContent=markerText();
    const btn=$("daeReturnVictim");if(btn)btn.disabled=!pointVictime;
    const recover=$("daeRecoverVictim");if(recover)recover.hidden=!pendingVictim;
    const clear=$("daeNewIncident");if(clear)clear.hidden=!pointVictime&&!pendingVictim;
  }

  function selected(){return candidates.find(d=>d.id===selectedId)||null;}
    function selectedInfo(){

    const d = selected();
    const p = $("daeSelectedInfo");

    if(!p) return;

    if(!d){

      p.textContent =
        "Cliquez sur « Me localiser et rechercher les DAE ». " +
        "Quand les résultats apparaissent, cliquez sur le numéro 1. " +
        "Si ce DAE est inaccessible, essayez le 2, puis le 3.";

      return;
    }

    const numero = candidates.indexOf(d) + 1;

    p.textContent =
      "DAE numéro " + numero + " : " + d.name + ". " +
      "Cliquez sur le numéro " + numero +
      " pour ouvrir Google Maps et être guidé à pied. " +
      "Pour un trajet en voiture, cliquez sur « Voiture ».";

  }
  function routeUrl(point,mode){const ll=point.lat+","+point.lng;return mode==="car"?"https://www.waze.com/ul?ll="+encodeURIComponent(ll)+"&navigate=yes&zoom=17":"https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(ll)+"&travelmode=walking";}
  function route(point,mode){if(!point)return;const url=routeUrl(point,mode);window.open(url,"_blank","noopener,noreferrer");}

  function renderResults(){
    const host=$("bociteDaeResults"),quick=$("daeQuickChoices");if(!host)return;
    if(quick){
      quick.innerHTML=candidates.map((d,i)=>`<button type="button" class="daeQuick" data-dae="${i}"
        style="text-align:left;flex:1;min-width:85px;background:${selectedId===d.id?'#e7f1ea':'#fff'};border:2px solid ${GREEN};border-radius:10px;padding:10px;color:${GREEN};cursor:pointer">
        <strong style="font-size:19px">${i+1}</strong> <span style="font-size:11px">${e(distText(d.km))}</span><br>
        <span style="font-size:11px">Ouvrir à pied ↗</span></button>`).join("");
      quick.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
        const d=candidates[Number(b.dataset.dae)];if(!d)return;
        selectedId=d.id;renderResults();route(d,"walk");
      }));
    }
    host.innerHTML=candidates.map((d,i)=>{
      const sel=selectedId===d.id;
      return `<section class="box" style="font-weight:400;border:${sel?"3px solid "+GREEN:"2px solid #d2ddd5"};background:#fff;margin-top:10px">
        <div style="display:flex;gap:10px;align-items:start"><div aria-label="DAE numéro ${i+1}" style="font-size:24px;font-weight:900;color:${sel?"#fff":GREEN};background:${sel?GREEN:"#edf4ef"};min-width:45px;padding:7px;text-align:center;border-radius:11px">${i+1}</div>
        <div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:900;color:${GREEN}">${e(d.name)}</div><div>${e(d.address)}</div><div style="font-weight:900;color:${RED}">${e(distText(d.km))} à vol d'oiseau</div></div></div>
        <div style="font-size:12px;line-height:1.45;margin-top:8px">
        État : ${e(d.state)}<br>Accès : ${e(d.access)} • libre : ${e(d.free)}<br>Jours : ${e(d.days)} • horaires : ${e(d.hours)}<br>
        ${d.details?"Précision : "+e(d.details)+"<br>":""}${d.avail?"Disponibilité : "+e(d.avail)+"<br>":""}
        Maintenance déclarée : ${e(d.maintenance)} • Batterie : ${e(d.battery)} • Électrodes : ${e(d.pads)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px">
        <button type="button" class="daeSelect" data-dae="${i}" style="grid-column:span 2;background:#fff;border:2px solid ${GREEN};border-radius:10px;padding:9px;color:${GREEN};font-weight:800">${sel?"✓ DAE "+(i+1)+" sélectionné":"Choisir DAE "+(i+1)}</button>
        <button type="button" class="daeWalk" data-dae="${i}" style="background:#fff;border:2px solid ${GREEN};border-radius:10px;padding:10px;font-weight:800">🚶 À pied ${i+1}</button>
        <button type="button" class="daeCar" data-dae="${i}" style="background:#fff;border:2px solid ${GREEN};border-radius:10px;padding:10px;font-weight:800">🚗 Voiture ${i+1}</button></div>
      </section>`;
    }).join("");
    host.querySelectorAll("button[data-dae]").forEach(b=>b.addEventListener("click",()=>{
      const d=candidates[Number(b.dataset.dae)];if(!d)return;
      selectedId=d.id;renderResults();selectedInfo();
      if(b.classList.contains("daeWalk"))route(d,"walk");
      if(b.classList.contains("daeCar"))route(d,"car");
    }));
    selectedInfo();
  }

  function gpsUpdate(pos){if(!pos||!pos.coords)return;const c=pos.coords;
    if(!Number.isFinite(c.latitude)||!Number.isFinite(c.longitude))return;
    user={lat:c.latitude,lng:c.longitude,accuracy:Number(c.accuracy)||0};
    const live=$("daeLivePosition");if(live)live.textContent=`${user.lat.toFixed(6)}, ${user.lng.toFixed(6)} (±${Math.round(user.accuracy)} m)`;
    if(pointVictime)return;
    pendingVictim=null;
    pointVictime={...user,time:Date.now(),note:""};storageSave();refreshPoint();
  }

  function startTracking(){if(!navigator.geolocation||gpsWatch!==null)return;try{gpsWatch=navigator.geolocation.watchPosition(gpsUpdate,()=>{}, {enableHighAccuracy:true,maximumAge:5000,timeout:12000});}catch(_){}}
  function stopTracking(){if(gpsWatch!==null&&navigator.geolocation){navigator.geolocation.clearWatch(gpsWatch);gpsWatch=null;}}
  function statusText(t){const h=$("bociteDaeStatus");if(h)h.textContent=t;}

  function locate(){
    if(!navigator.geolocation){statusText("GPS indisponible. Appelez le 112 ou le 15.");return;}
    const button=$("bociteDaeLocate"),token=++requestId;
    candidates=[];selectedId=null;renderResults();
    if(button)button.disabled=true;statusText("Localisation en cours…");
    navigator.geolocation.getCurrentPosition(async pos=>{
      if(token!==requestId)return;
      gpsUpdate(pos);const start={lat:user.lat,lng:user.lng};statusText("Position trouvée. Recherche officielle Géo’DAE en cours…");
      try{
        const results=await findThree(start);
        if(token!==requestId)return;
        candidates=results;selectedId=results[0]?.id||null;renderResults();startTracking();
        statusText(results.length?`${results.length} DAE proposé(s) par distance à vol d'oiseau. Disponibilité sur place non garantie ; vérifiez l’accès et les horaires, en particulier les DAE en intérieur.`:"Aucun DAE répondant aux critères dans le rayon recherché (40 km). Demandez aux secours où trouver un appareil.");
      }catch(err){
        if(token!==requestId)return;
        candidates=[];selectedId=null;renderResults();statusText("Recherche Géo’DAE indisponible ou incompatible avec cet appareil. Demandez aux secours où se trouve un DAE.");
        console.warn("Bo'CitéArt DAE : recherche impossible",err);
      }finally{if(token===requestId&&button)button.disabled=false;}
    },err=>{
      if(token!==requestId)return;if(button)button.disabled=false;
      statusText(err&&err.code===1?"Accès GPS refusé. Autorisez la localisation ou appelez les secours.":err&&err.code===3?"Délai GPS dépassé. Réessayez ou demandez l'aide des secours.":"Position GPS indisponible. Réessayez ou appelez les secours.");
    },{enableHighAccuracy:true,timeout:12000,maximumAge:0});
  }

  function stopMetro(){if(metroTimer!==null){clearInterval(metroTimer);metroTimer=null;}const btn=$("daeMetroButton");if(btn){btn.textContent="▶ Activer le rythme — adulte";btn.setAttribute("aria-pressed","false");}const s=$("daeMetroStatus");if(s)s.textContent="Arrêté. Le rythme ne remplace pas les consignes des secours.";}
  function beep(){if(!metroAudio)return;const t=metroAudio.currentTime,o=metroAudio.createOscillator(),g=metroAudio.createGain();o.frequency.value=680;g.gain.setValueAtTime(.13,t);g.gain.exponentialRampToValueAtTime(.001,t+.055);o.connect(g);g.connect(metroAudio.destination);o.start(t);o.stop(t+.06);}
  async function toggleMetro(){if(metroTimer!==null){stopMetro();return;}const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio){$("daeMetroStatus").textContent="Audio non disponible.";return;}try{if(!metroAudio)metroAudio=new Audio();await metroAudio.resume();if(!$('daeMetroButton')||metroAudio.state!=="running")return;beep();metroTimer=setInterval(()=>{if(document.hidden||!$("daeMetroButton")||!$("daeMetroButton").getClientRects().length){stopMetro();return;}beep();},60000/110);$("daeMetroButton").textContent="■ Arrêter le rythme";$("daeMetroButton").setAttribute("aria-pressed","true");$("daeMetroStatus").textContent="110 battements/minute — adulte uniquement.";}catch(_){stopMetro();$("daeMetroStatus").textContent="Impossible d'activer le son.";}}

  function drawing(type){
    const common='fill="#f7faf7" stroke="#2f5d46" stroke-width="3"';
    if(type===1)return `<svg viewBox="0 0 260 100" role="img" aria-label="Schéma de coffret à porte : tirer la porte vers soi" style="max-width:100%;height:100px"><rect x="55" y="10" width="100" height="78" rx="8" ${common}/><rect x="67" y="19" width="77" height="60" fill="#e3f0e9" stroke="#2f5d46"/><path d="M126 47 h7" stroke="#c84b43" stroke-width="6"/><path d="M159 49 h55 m-15 -13 15 13 -15 13" stroke="#c84b43" stroke-width="4" fill="none"/><text x="161" y="22" font-size="12">TIRER</text></svg>`;
    if(type===2)return `<svg viewBox="0 0 260 100" role="img" aria-label="Schéma de capot rond : tourner dans le sens indiqué sur le coffret" style="max-width:100%;height:100px"><circle cx="111" cy="49" r="39" ${common}/><circle cx="111" cy="49" r="27" fill="#e3f0e9" stroke="#2f5d46"/><path d="M160 27 C184 32 186 66 156 75 l4 -13 m-4 13 15 3" fill="none" stroke="#c84b43" stroke-width="4"/><text x="162" y="21" font-size="11">TOURNER</text></svg>`;
    return `<svg viewBox="0 0 260 100" role="img" aria-label="Schéma de coffret à code : lire les consignes et contacter les secours" style="max-width:100%;height:100px"><rect x="55" y="10" width="110" height="78" rx="7" ${common}/><rect x="70" y="23" width="55" height="45" fill="#e3f0e9"/><rect x="134" y="25" width="23" height="40" rx="4" fill="#fff" stroke="#2f5d46"/><text x="137" y="50" font-size="14" fill="#c84b43">#</text><text x="174" y="46" font-size="12">CODE</text></svg>`;
  }

      function modalHtml(){return `<div id="daeRoot" style="font:400 14px/1.5 system-ui,Arial;color:#111">

    <style>
      #daeRoot :is(p, div, span, section, button, a, b, strong) {
        font-size:14px !important;
        color:#111 !important;
        font-weight:400 !important;
        line-height:1.5 !important;
      }

      #daeRoot :is(h2, h3) {
        font-size:17px !important;
        color:#2f5d46 !important;
        font-weight:700 !important;
        line-height:1.4 !important;
      }

      #daeRoot .daeBrandGreen,
      #daeRoot span[style*="color:#2f5d46"] {
        color:#2f5d46 !important;
        font-size:17px !important;
        font-weight:700 !important;
      }

      #daeRoot .daeBrandRed,
      #daeRoot span[style*="color:#c84b43"] {
        color:#c84b43 !important;
        font-size:17px !important;
        font-weight:700 !important;
      }

      #daeRoot .daeQuick strong {
        color:#2f5d46 !important;
        font-size:19px !important;
        font-weight:700 !important;
      }

      #daeRoot [aria-label^="DAE numéro"] {
        background:#2f5d46 !important;
        color:#fff !important;
        font-size:22px !important;
        font-weight:700 !important;
      }

           #daeRoot svg text {
        font-size:14px !important;
      }

      /* Titres des blocs : vert, 17 px, gras */

      #daeRoot .box div[style*="font-size:17px"],
      #daeRoot .box b[style*="color:#2f5d46"] {
        font-size:17px !important;
        color:#2f5d46 !important;
        font-weight:700 !important;
      }

      /* Nom du DAE dans les résultats */

      #daeRoot #bociteDaeResults div[style*="font-size:15px"] {
        font-size:17px !important;
        color:#2f5d46 !important;
        font-weight:700 !important;
      }

      /* Alertes importantes : rouge, 17 px, gras */

      #daeRoot .box > b[style*="color:#c84b43"],
      #daeRoot .box p b[style*="color:#c84b43"] {
        font-size:17px !important;
        color:#c84b43 !important;
        font-weight:700 !important;
      }
    </style>

    <h2>
      <span class="daeBrandGreen">Bo’Cité</span><span class="daeBrandRed">Art</span>
      — Défibrillateur DAE
    </h2>
    <div class="box" style="font-weight:400;border:2px solid ${RED};background:white"><b style="color:${RED}">Urgence vitale : appelez d'abord les secours.</b><p>112 partout dans l'Union européenne ; en France, également 15 ou 18. Si la victime ne répond pas et ne respire pas normalement, commencez les compressions. Si possible, envoyez une autre personne chercher le DAE.</p>
    <div style="display:flex;gap:10px"><a href="tel:112" style="padding:9px;border:2px solid ${RED};border-radius:10px">Appeler 112</a><a href="tel:15" style="padding:9px;border:2px solid ${RED};border-radius:10px">Appeler 15</a></div></div>
    <section class="box" style="background:#fff;font-weight:400"><h3 style="color:${GREEN};font-size:15px;margin:0 0 7px">Point de départ — lieu de la victime</h3>
    <div id="daeVictimPoint" style="font-size:13px">Point non enregistré.</div>
    <p style="font-size:12px">La première position GPS devient le repère de retour et reste fixe, même lorsque vous vous déplacez. GPS parfois imprécis : mémorisez aussi l'entrée, l'étage et les indications à transmettre aux secours.</p>
    <div id="daePreviousNotice" style="font-size:12px;color:#555">Si vous rouvrez le DAE pendant la même urgence, confirmez explicitement le repère précédent avant de le réutiliser.</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button type="button" id="daeRecoverVictim" hidden style="background:#fff;border:2px solid ${GREEN};padding:10px;border-radius:10px">↩ Reprendre le repère précédent</button>
      <button type="button" id="daeNewIncident" hidden style="background:#fff;border:2px solid ${RED};padding:10px;border-radius:10px">Nouvelle intervention</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="daeReturnVictim" disabled style="background:#fff;border:2px solid ${GREEN};padding:10px;border-radius:10px">↩ Itinéraire retour vers la victime</button><button type="button" id="daeSaveHere" style="background:#fff;border:2px solid ${GREEN};padding:10px;border-radius:10px">📍 Redéfinir ici (confirmation)</button></div></section>
    <section class="box" style="background:#fff;font-weight:400"><h3 style="color:${GREEN};font-size:15px;margin:0 0 7px">Jusqu'à 3 défibrillateurs, du plus proche au plus éloigné</h3>
    <button type="button" id="bociteDaeLocate" style="background:#fff;border:2px solid ${GREEN};color:${GREEN};font-weight:900;padding:12px;border-radius:10px;width:100%">📍 Me localiser et rechercher les DAE</button>
    <div id="bociteDaeStatus" role="status" aria-live="polite" style="margin-top:8px">Autorisez le GPS pour rechercher autour de vous.</div>
    <div style="font-size:11px;color:#666;margin-top:4px">Position actuelle : <span id="daeLivePosition">Non obtenue</span></div>
    <div style="font-size:11px;color:#666;margin-top:4px">Distances indiquées à vol d'oiseau depuis la position au moment de la recherche (pas des temps de trajet réels).</div>
    <div id="daeQuickChoices" style="display:flex;flex-wrap:wrap;gap:8px;margin:9px 0" aria-label="Choix rapides DAE 1 2 3"></div>
    <div id="daeSelectedInfo" style="font-size:13px;margin-top:6px;color:${GREEN}">Choisissez un DAE pour ouvrir l'itinéraire.</div>
    <p style="font-size:14px;color:#111;font-weight:400;line-height:1.5;">
Cliquez d'abord sur le numéro 1 : c'est le DAE le plus proche à vol d'oiseau.
Google Maps vous guidera à pied.
Si ce DAE est inaccessible, revenez ici et cliquez sur le numéro 2, puis le 3.
Pour vous déplacer en voiture, utilisez le bouton « Voiture ».
Pour revenir auprès de la victime, cliquez sur « Itinéraire retour vers la victime ».
Le téléphone doit être connecté et sa localisation activée.
</p></section>
    <div class="box" style="
  background:#fff;
  color:#111;
  font-size:14px;
  font-weight:400;
  line-height:1.5;
">

  <div style="
    color:${GREEN};
    font-size:17px;
    font-weight:700;
  ">
    Données officielles Géo’DAE
  </div>

  <p>
    À chaque recherche, Bo’CitéArt consulte les données
    disponibles dans la base nationale Géo’DAE et recherche
    les appareils déclarés en fonctionnement.
  </p>

  <p>
    Les informations proviennent des responsables des
    défibrillateurs. Leur emplacement, leur accès et leur
    fonctionnement sur place ne peuvent pas être garantis.
    Si un DAE est inaccessible, essayez le 2, puis le 3,
    sans retarder les gestes de secours.
  </p>

</div>

<div id="bociteDaeResults"></div>
    <section class="box" style="background:#fff;font-weight:400"><h3 style="color:${GREEN};font-size:15px;margin:0 0 6px">Se former avant l'urgence</h3>
    <p><b style="color:${GREEN}">Aujourd'hui, prenez quelques minutes au calme.</b> Regardez cette vidéo autant de fois que nécessaire et mémorisez les premiers gestes. <b style="color:${RED}">Demain, c'est peut-être grâce à vous qu'une vie sera sauvée.</b></p>
    <p style="font-size:12px">En urgence, ne perdez pas de temps à regarder la vidéo : appelez les secours et suivez leurs consignes.</p>
    <div style="overflow:hidden;border-radius:12px"><iframe title="Gestes DAE — vidéo actuelle conservée" src="${VIDEO}" width="100%" height="210" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
    <p style="font-size:11px">Vidéo conservée sans remplacement automatique. Une formation pratique aux premiers secours reste recommandée.</p></section>
    <section class="box" style="font-weight:400;background:#fff"><h3 style="color:${GREEN};font-size:15px;margin:0 0 8px">Plans de principe : ouvrir un coffret DAE</h3><p style="font-size:12px">À étudier à tête reposée : l'ouverture réelle dépend du fabricant. Suivez toujours les pictogrammes et consignes présents sur le coffret.</p>
    ${[[1,"Porte à tirer","Repérez la poignée, tirez la porte. Une alarme peut retentir."],[2,"Capot à tourner","ATTENTION : sur les coffrets Rotaid, tournez le capot vers la GAUCHE, dans le sens inverse des aiguilles d'une montre. Un court mouvement suffit. L'alarme peut retentir. Pour les autres modèles, suivez le sens d'ouverture indiqué sur le coffret. Ne forcez pas."],[3,"Coffret sécurisé","Lisez les consignes. En cas de code inconnu, contactez les secours ; ne perdez pas de temps."]].map(x=>`<div style="margin:8px 0;padding:8px;border:1px solid #ddd;border-radius:10px"><b style="color:${GREEN}">${x[0]}. ${x[1]}</b><div>${drawing(x[0])}</div><div style="font-size:12px">${x[2]}</div></div>`).join("")}</section>
    <section class="box" style="font-weight:400;background:#fff"><h3 style="color:${GREEN};font-size:15px;margin:0 0 8px">Premiers gestes — adulte</h3>
    <p><b>1. Réaction :</b> vérifier que la personne ne répond pas ; demander de l'aide.</p><p><b>2. Alerter :</b> appeler le 112 (ou le 15 en France). Mettre le téléphone en haut-parleur, suivre le régulateur.</p>
   <h3>3. Vérifiez la respiration</h3>

<p>
  Chez l'adulte, placez une main sur le front
  et deux doigts sous le menton.

  Basculez doucement la tête en arrière
  et relevez le menton.

  (Ce geste permet d'ouvrir les voies aériennes
  pour faciliter le passage de l'air.)

  Vérifiez pendant 10 secondes maximum
  si la personne respire normalement.

  Attention : des halètements isolés
  ne sont pas une respiration normale.

  Si la personne ne répond pas
  et ne respire pas normalement,
  commencez immédiatement les compressions
  thoraciques en suivant les secours.
</p>
    <h3>4. Commencez le massage cardiaque</h3>

<p>
  Si la personne ne réagit pas et ne respire
  pas normalement, commencez immédiatement.

  Agenouillez-vous à côté de sa poitrine,
  sur une surface stable.

  Placez le talon d'une main au centre
  de la poitrine, puis l'autre main par-dessus.

  Gardez les bras tendus et placez vos épaules
  au-dessus de vos mains.

  Appuyez fermement, verticalement,
  de 5 à 6 cm chez l'adulte.

  Laissez la poitrine remonter complètement
  entre chaque compression.

  Maintenez un rythme de 100 à 120
  compressions par minute.

  Vous pouvez activer le métronome Bo’CitéArt
  pour vous aider à garder le rythme,
  sans retarder le massage.

  Si vous commencez à fatiguer,
  demandez immédiatement à une autre personne
  de vous remplacer. Le relais doit être rapide,
  avec le moins d'interruption possible.
</p>
    <h3>5. Préparez le défibrillateur</h3>

<p>
  Continuez le massage cardiaque pendant
  qu'une autre personne apporte et prépare le DAE.

  Allumez le DAE dès son arrivée.

  Si vous êtes plusieurs, continuez les compressions
  pendant qu'une autre personne pose les électrodes
  sur la poitrine nue, comme indiqué sur leurs dessins.

  Si vous êtes seul, interrompez les compressions
  uniquement le temps nécessaire pour poser
  les électrodes, puis suivez le DAE.

  Déplacez ou retirez les vêtements et le soutien-gorge
  seulement s'ils gênent la pose des électrodes.
</p>

<h3>6. Écoutez le défibrillateur</h3>

<p>
  Dès que le DAE parle, suivez ses instructions.

  Lorsqu'il analyse le rythme cardiaque,
  arrêtez les compressions.

  ATTENTION : personne ne doit toucher
  la victime pendant l'analyse ou le choc.

  Lorsque le DAE demande de reprendre
  le massage, recommencez immédiatement.

  Laissez le DAE allumé et ses électrodes en place.
</p>

<h3>7. Faites-vous remplacer si vous fatiguez</h3>

<p>
  Le massage cardiaque est fatigant.

  Si vous êtes plusieurs, organisez un relais
  environ toutes les deux minutes,
  avec une interruption aussi courte que possible.

  Si vous commencez à fatiguer,
  prévenez immédiatement les personnes présentes.

  Une autre personne peut vous remplacer
  pendant que vous récupérez.
</p>

<h3>8. Continuez jusqu'à la prise de relais</h3>

<p>
  Même lorsque les pompiers ou les secours arrivent,
  continuez les compressions pendant
  qu'ils préparent leur matériel.

  Ne vous arrêtez pas simplement parce qu'ils
  sont à vos côtés.

  Continuez jusqu'à ce qu'un pompier,
  un secouriste ou un professionnel de santé
  prenne effectivement le relais.

  Respectez toujours les pauses demandées
  par le défibrillateur et les instructions
  des secours.
</p>

<h3>9. Si la personne respire normalement</h3>

<p>
  Si la personne recommence à respirer normalement,
  cessez les compressions.

  Surveillez sa respiration, laissez les électrodes
  en place et suivez les instructions des secours.
</p>
    <div style="padding:9px;border:2px solid ${RED};border-radius:9px"><b style="color:${RED}">Bébé et enfant : gestes adaptés.</b> Ne reproduisez pas la technique adulte. Appelez les secours et suivez les instructions pédiatriques. Si vous avez été formé, appliquez le protocole pédiatrique.</div>
    <p><b style="color:${RED}">Chaque seconde compte :</b> dès l'arrêt cardiaque, le cerveau manque de sang et d'oxygène. Des lésions graves peuvent apparaître en quelques minutes ; ne retardez jamais la réanimation.</p>
    <div style="padding:9px;border:2px solid ${GREEN};border-radius:10px;text-align:center"><b style="color:${GREEN}">Métronome — compressions ADULTE (110/min)</b><div><button type="button" id="daeMetroButton" aria-pressed="false" style="margin:9px 0;padding:11px;background:#fff;border:2px solid ${GREEN};border-radius:10px">▶ Activer le rythme — adulte</button></div><div id="daeMetroStatus" role="status" style="font-size:12px">Son désactivé. La voix des secours est prioritaire ; un appel téléphonique peut empêcher la lecture sonore.</div></div>
    <p style="font-size:14px;color:#111;font-weight:400;">
  Informations de sensibilisation aux premiers secours.
  Une formation pratique reste recommandée.
</p>

<div style="
  margin-top:16px;
  padding:14px;
  background:#fff;
  border:1px solid #d2ddd5;
  border-radius:12px;
  font-size:14px;
  color:#111;
  font-weight:400;
  line-height:1.5;
">

  <div style="
    color:${GREEN};
    font-size:17px;
    font-weight:700;
  ">
    Information importante —
    <span style="color:${GREEN};">Bo’Cité</span><span style="color:${RED};">Art</span>
  </div>

  <p>
    Bo’CitéArt propose des informations et une aide
    à l’orientation. Ce service ne remplace ni les secours,
    ni une formation aux premiers secours, ni les instructions
    d’un professionnel de santé ou d’un défibrillateur.
  </p>

  <p>
    Les emplacements et caractéristiques des DAE proviennent
    de déclarations de tiers. Leur exactitude et leur
    actualisation ne peuvent pas être garanties.
    Le GPS, Internet, les services de navigation et
    l’application peuvent être indisponibles ou présenter
    des erreurs.
  </p>

  <p>
    Dans les limites autorisées par la loi, Bo’CitéArt
    décline toute responsabilité concernant les conséquences
    d’informations inexactes ou non actualisées fournies
    par des tiers, l’indisponibilité d’un DAE, les erreurs
    de localisation et les interruptions de services extérieurs.
    Cette information ne limite pas les responsabilités
    qui ne peuvent être légalement exclues.
  </p>

  <p>
    En urgence, appelez immédiatement le 112 ou le 15
    et suivez les instructions des secours et du DAE.
    N’attendez jamais l’application pour commencer
    les gestes adaptés.
  </p>

</div>
    </section></div>`;}

  function show(){
    stopMetro();stopTracking();++requestId;
    if(lifeTimer!==null){clearInterval(lifeTimer);lifeTimer=null;}
    user=null;candidates=[];selectedId=null;pointVictime=null;pendingVictim=storageLoad();
    if(typeof window.openModal!=="function"){console.error("Bo'CitéArt DAE : fenêtre openModal absente");return;}
    window.openModal("Défibrillateur (DAE)",modalHtml());
    const locateBtn=$("bociteDaeLocate"),returnBtn=$("daeReturnVictim"),repoint=$("daeSaveHere"),metronome=$("daeMetroButton"),recover=$("daeRecoverVictim"),newIncident=$("daeNewIncident");
    if(locateBtn)locateBtn.onclick=locate;
    if(returnBtn)returnBtn.onclick=()=>route(pointVictime,"walk");
    if(repoint)repoint.onclick=()=>{
      if(!user){statusText("Localisez-vous d'abord pour enregistrer ce point.");return;}
      if(window.confirm("Remplacer le lieu enregistré de la victime par votre position actuelle ?")){
        pointVictime={...user,time:Date.now()};storageSave();refreshPoint();
      }
    };
    if(metronome)metronome.onclick=toggleMetro;
    if(recover)recover.onclick=()=>{
      if(!pendingVictim)return;
      if(window.confirm("Reprendre le point enregistré lors de la précédente ouverture du DAE ? Vérifiez qu’il s’agit du MÊME incident.")){
        pointVictime=pendingVictim;pendingVictim=null;storageSave();refreshPoint();
      }
    };
    if(newIncident)newIncident.onclick=()=>{
      if(window.confirm("Commencer une nouvelle intervention et effacer le précédent repère ?")){
        pendingVictim=null;pointVictime=null;storageSave();refreshPoint();
      }
    };
    refreshPoint();renderResults();
    lifeTimer=setInterval(()=>{
      const root=$("daeRoot");
      if(!root||!root.isConnected||root.getClientRects().length===0){
        stopTracking();if(metroTimer!==null)stopMetro();
        clearInterval(lifeTimer);lifeTimer=null;
      }
    },1400);
  }

  function install(){const btn=$("daeBtn");if(!btn||btn.dataset.bociteDaeInstalled==="1")return !!btn;
    // Capture BEFORE the legacy addEventListener/onclick so the old modal cannot also open.
    btn.addEventListener("click",ev=>{ev.preventDefault();ev.stopImmediatePropagation();show();},true);
    btn.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();ev.stopImmediatePropagation();show();}},true);
    btn.dataset.bociteDaeInstalled="1";
    btn.setAttribute("aria-label","Trouver un défibrillateur près de moi");return true;
  }

  document.addEventListener("visibilitychange",()=>{if(document.hidden){stopMetro();stopTracking();}});
  window.addEventListener("pagehide",()=>{stopMetro();stopTracking();});
  window.BociteArtDae={loaded:true,open:show,reinstall:install,version:"1010260845"};
  if(!install())document.addEventListener("DOMContentLoaded",install,{once:true});
})();
/* =========================================================
   ÇA FINIT ICI — bociteart-dae.js — VERSION TEST 10/10/2026 — 0845
   ========================================================= */

