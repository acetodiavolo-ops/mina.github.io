(function(){
  'use strict';
  var CX=110, CY=110;

  /* SVG clock face is inline HTML — JS only animates hands + city cards */
  var hourEl=document.getElementById('iglHour');
  if(!hourEl) return;

  var lang=/\/it\//.test(location.pathname)?'it':/\/sq\//.test(location.pathname)?'sq':'en';

  var CITIES=[
    {n:'Tirana',   tz:'Europe/Tirane'},
    {n:'London',   tz:'Europe/London'},
    {n:'Rome',     tz:'Europe/Rome'},
    {n:'Tokyo',    tz:'Asia/Tokyo'},
    {n:'New York', tz:'America/New_York'}
  ];

  var LABELS={
    en:{on:'Ticking on', off:'Ticking sound'},
    it:{on:'Attivo',     off:'Suono tic-tac'},
    sq:{on:'Aktiv',      off:'Ticking'}
  }[lang];

  var LOCALE={en:'en-GB',it:'it-IT',sq:'sq'}[lang];

  /* ── City cards ── */
  var row=document.getElementById('iglCities');
  if(row){
    CITIES.forEach(function(c,i){
      var card=document.createElement('div'); card.className='clock-city';
      var nm=document.createElement('div'); nm.className='clock-city-name'; nm.textContent=c.n;
      var tm=document.createElement('div'); tm.className='clock-city-time'; tm.id='ict'+i; tm.textContent='--:--';
      var dt=document.createElement('div'); dt.className='clock-city-date'; dt.id='icd'+i;
      card.appendChild(nm); card.appendChild(tm); card.appendChild(dt);
      row.appendChild(card);
    });
  }

  /* ── Clock update loop ── */
  var minEl=document.getElementById('iglMin');
  var secEl=document.getElementById('iglSec');
  function rotate(el,deg){el.setAttribute('transform','rotate('+deg+','+CX+','+CY+')');}

  function update(){
    var now=new Date();
    var s=now.getSeconds()+now.getMilliseconds()/1000;
    var m=now.getMinutes()+s/60;
    var h=(now.getHours()%12)+m/60;
    rotate(hourEl,h*30);
    if(minEl) rotate(minEl,m*6);
    if(secEl) rotate(secEl,s*6);
    CITIES.forEach(function(c,i){
      try{
        var t=document.getElementById('ict'+i),d=document.getElementById('icd'+i);
        if(t) t.textContent=now.toLocaleTimeString(LOCALE,{timeZone:c.tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
        if(d) d.textContent=now.toLocaleDateString(LOCALE,{timeZone:c.tz,weekday:'short',month:'short',day:'numeric'});
      }catch(e){}
    });
  }
  update(); setInterval(update,1000);

  /* ── Ticking sound (Web Audio — no files needed) ── */
  var actx=null,ticking=false,tto=null,tiv=null;
  function playTick(){
    if(!actx) return;
    var sr=actx.sampleRate,len=Math.floor(sr*.04);
    var buf=actx.createBuffer(1,len,sr),d=buf.getChannelData(0);
    for(var j=0;j<len;j++) d[j]=(Math.random()*2-1)*Math.exp(-j/(sr*.008));
    var src=actx.createBufferSource(),g=actx.createGain();
    g.gain.value=0.18; src.buffer=buf; src.connect(g); g.connect(actx.destination); src.start();
  }
  function toggleTick(){
    ticking=!ticking;
    var dot=document.getElementById('iglTickDot'),lbl=document.getElementById('iglTickLabel');
    if(dot) dot.className='clock-tick-dot'+(ticking?' on':'');
    if(lbl) lbl.textContent=ticking?LABELS.on:LABELS.off;
    if(ticking){
      if(!actx) actx=new(window.AudioContext||window.webkitAudioContext)();
      if(actx.state==='suspended') actx.resume();
      var ms=1000-new Date().getMilliseconds();
      tto=setTimeout(function(){
        if(!ticking) return;
        playTick();
        tiv=setInterval(function(){if(ticking) playTick();},1000);
      },ms);
    } else {clearTimeout(tto);clearInterval(tiv);}
  }
  var btn=document.getElementById('iglTickBtn');
  if(btn) btn.addEventListener('click',toggleTick);
})();
