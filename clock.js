(function(){
  var face=document.getElementById('iglClockFace');
  if(!face)return;

  var path=window.location.pathname;
  var lang=path.indexOf('/it/')>-1?'it':path.indexOf('/sq/')>-1?'sq':'en';

  var CITIES=[
    {n:'Durrës',   tz:'Europe/Tirane'},
    {n:'London',   tz:'Europe/London'},
    {n:'Rome',     tz:'Europe/Rome'},
    {n:'New York', tz:'America/New_York'}
  ];

  var LABELS={
    en:{on:'Ticking on',  off:'Ticking sound'},
    it:{on:'Attivo',      off:'Suono tic-tac'},
    sq:{on:'Aktiv',       off:'Ticking'}
  }[lang];

  var LOCALE={en:'en-GB',it:'it-IT',sq:'sq'}[lang];

  /* Build tick marks */
  for(var i=0;i<60;i++){
    var major=i%5===0,ang=i/60*360,rad=(ang-90)*Math.PI/180,r=63,cx=70,cy=70;
    var x=cx+Math.cos(rad)*r,y=cy+Math.sin(rad)*r;
    var tk=document.createElement('div');
    tk.style.cssText='position:absolute;width:'+(major?2:1)+'px;height:'+(major?10:5)+'px;'
      +'background:'+(major?'rgba(180,148,92,.65)':'rgba(255,255,255,.2)')+';'
      +'left:'+x+'px;bottom:'+(140-y)+'px;'
      +'transform-origin:bottom center;transform:rotate('+ang+'deg);margin-left:-1px';
    face.appendChild(tk);
  }

  /* Build city cards */
  var row=document.getElementById('iglCities');
  CITIES.forEach(function(c,i){
    var card=document.createElement('div');
    card.className='clock-city';
    card.innerHTML='<div class="clock-city-name">'+c.n+'</div>'
      +'<div class="clock-city-time" id="ict'+i+'">--:--:--</div>'
      +'<div class="clock-city-date" id="icd'+i+'"></div>';
    row.appendChild(card);
  });

  /* Update every second */
  function update(){
    var now=new Date();
    var s=now.getSeconds()+now.getMilliseconds()/1000;
    var m=now.getMinutes()+s/60;
    var h=(now.getHours()%12)+m/60;
    document.getElementById('iglClockS').style.transform='rotate('+(s*6)+'deg)';
    document.getElementById('iglClockM').style.transform='rotate('+(m*6)+'deg)';
    document.getElementById('iglClockH').style.transform='rotate('+(h*30)+'deg)';
    CITIES.forEach(function(c,i){
      try{
        document.getElementById('ict'+i).textContent=
          now.toLocaleTimeString(LOCALE,{timeZone:c.tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
        document.getElementById('icd'+i).textContent=
          now.toLocaleDateString(LOCALE,{timeZone:c.tz,weekday:'short',month:'short',day:'numeric'});
      }catch(e){}
    });
  }
  update();
  setInterval(update,1000);

  /* Ticking sound via Web Audio — no audio files needed */
  var actx=null,ticking=false,tto=null,tiv=null;
  function playTick(){
    if(!actx)return;
    var sr=actx.sampleRate,buf=actx.createBuffer(1,Math.floor(sr*.04),sr),d=buf.getChannelData(0);
    for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(sr*.008));
    var src=actx.createBufferSource(),g=actx.createGain();
    g.gain.value=0.14;src.buffer=buf;src.connect(g);g.connect(actx.destination);src.start();
  }
  window.iglToggleTick=function(){
    ticking=!ticking;
    document.getElementById('iglTickDot').className='clock-tick-dot'+(ticking?' on':'');
    document.getElementById('iglTickLabel').textContent=ticking?LABELS.on:LABELS.off;
    if(ticking){
      if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();
      if(actx.state==='suspended')actx.resume();
      var ms=1000-new Date().getMilliseconds();
      tto=setTimeout(function(){
        if(!ticking)return;
        playTick();
        tiv=setInterval(function(){if(ticking)playTick();},1000);
      },ms);
    }else{
      clearTimeout(tto);clearInterval(tiv);
    }
  };
})();
