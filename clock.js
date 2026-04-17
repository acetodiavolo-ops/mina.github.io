(function(){
  'use strict';
  var CX=110, CY=110;

  function init(){
    /* City cards are static HTML — JS only fills live times */
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

    /* ── Hand rotation ── */
    /* querySelector works across namespaces; getElementById sometimes
       skips SVG elements in certain browsers when SVG is inline HTML */
    var hourEl = document.querySelector('#iglHour');
    var minEl  = document.querySelector('#iglMin');
    var secEl  = document.querySelector('#iglSec');

    function rotate(el,deg){
      if(!el) return;
      el.setAttribute('transform','rotate('+deg+','+CX+','+CY+')');
    }

    /* ── Time update ── */
    function update(){
      try{
        var now=new Date();
        var s=now.getSeconds()+now.getMilliseconds()/1000;
        var m=now.getMinutes()+s/60;
        var h=(now.getHours()%12)+m/60;
        rotate(hourEl,h*30);
        rotate(minEl,m*6);
        rotate(secEl,s*6);
      }catch(e){}
      CITIES.forEach(function(c,i){
        try{
          var t=document.getElementById('ict'+i);
          var d=document.getElementById('icd'+i);
          if(t) t.textContent=now.toLocaleTimeString(LOCALE,{timeZone:c.tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
          if(d) d.textContent=now.toLocaleDateString(LOCALE,{timeZone:c.tz,weekday:'short',month:'short',day:'numeric'});
        }catch(e){}
      });
    }
    update();
    setInterval(update,1000);

    /* ── Ticking sound ── */
    var actx=null,ticking=false,tto=null,tiv=null;
    function playTick(){
      try{
        if(!actx) return;
        var sr=actx.sampleRate,len=Math.floor(sr*.04);
        var buf=actx.createBuffer(1,len,sr),d=buf.getChannelData(0);
        for(var j=0;j<len;j++) d[j]=(Math.random()*2-1)*Math.exp(-j/(sr*.008));
        var src=actx.createBufferSource(),g=actx.createGain();
        g.gain.value=0.18; src.buffer=buf; src.connect(g); g.connect(actx.destination); src.start();
      }catch(e){}
    }
    function toggleTick(){
      ticking=!ticking;
      var dot=document.getElementById('iglTickDot');
      var lbl=document.getElementById('iglTickLabel');
      if(dot) dot.className='clock-tick-dot'+(ticking?' on':'');
      if(lbl) lbl.textContent=ticking?LABELS.on:LABELS.off;
      if(ticking){
        try{
          if(!actx) actx=new(window.AudioContext||window.webkitAudioContext)();
          if(actx.state==='suspended') actx.resume();
          var ms=1000-new Date().getMilliseconds();
          tto=setTimeout(function(){
            if(!ticking) return;
            playTick();
            tiv=setInterval(function(){if(ticking) playTick();},1000);
          },ms);
        }catch(e){}
      } else {
        clearTimeout(tto);
        clearInterval(tiv);
      }
    }
    var btn=document.getElementById('iglTickBtn');
    if(btn) btn.addEventListener('click',toggleTick);
  }

  /* Run after DOM is ready — defer handles this but DOMContentLoaded
     is a belt-and-suspenders safety net */
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  } else {
    init();
  }
})();
