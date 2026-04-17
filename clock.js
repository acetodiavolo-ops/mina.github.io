(function(){
  'use strict';
  var NS='http://www.w3.org/2000/svg';
  var CX=110, CY=110;

  var wrap=document.getElementById('iglClockWrap');
  if(!wrap) return;

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

  /* ── SVG element factory ── */
  function el(tag,attrs){
    var e=document.createElementNS(NS,tag);
    if(attrs) Object.keys(attrs).forEach(function(k){e.setAttribute(k,attrs[k]);});
    return e;
  }

  /* ── Build clock SVG ── */
  var svg=el('svg',{viewBox:'0 0 220 220',width:'200',height:'200',
    style:'display:block;width:200px;height:200px'});

  /* Cream fill */
  svg.appendChild(el('circle',{cx:CX,cy:CY,r:108,fill:'#f5f0e8'}));
  /* Outer navy ring */
  svg.appendChild(el('circle',{cx:CX,cy:CY,r:107,fill:'none',stroke:'#06153b','stroke-width':'4'}));
  /* Second ring */
  svg.appendChild(el('circle',{cx:CX,cy:CY,r:92,fill:'none',stroke:'#06153b','stroke-width':'1.5'}));
  /* Inner dial ring */
  svg.appendChild(el('circle',{cx:CX,cy:CY,r:78,fill:'none',stroke:'#06153b','stroke-width':'0.8'}));

  /* Minute tick marks between ring2 and ring3 */
  for(var i=0;i<60;i++){
    var isMaj=i%5===0;
    var rad=(i/60*360-90)*Math.PI/180;
    svg.appendChild(el('line',{
      x1:CX+(isMaj?82:88)*Math.cos(rad), y1:CY+(isMaj?82:88)*Math.sin(rad),
      x2:CX+92*Math.cos(rad),            y2:CY+92*Math.sin(rad),
      stroke:'#06153b','stroke-width':isMaj?1.5:0.7,'stroke-linecap':'round'
    }));
  }

  /* ── Curved brand text (individual letter placement) ── */
  function arcText(chars,r,startDeg,endDeg,flip,fa){
    var n=chars.length, g=el('g');
    chars.forEach(function(ch,i){
      var deg=n>1?startDeg+(i/(n-1))*(endDeg-startDeg):(startDeg+endDeg)/2;
      var svgRad=(deg-90)*Math.PI/180;
      var x=CX+r*Math.cos(svgRad), y=CY+r*Math.sin(svgRad);
      var rot=flip?deg+180:deg;
      var t=el('text');
      Object.keys(fa).forEach(function(k){t.setAttribute(k,fa[k]);});
      t.setAttribute('x',x); t.setAttribute('y',y);
      t.setAttribute('text-anchor','middle');
      t.setAttribute('dominant-baseline','central');
      t.setAttribute('transform','rotate('+rot+','+x+','+y+')');
      t.textContent=ch;
      g.appendChild(t);
    });
    return g;
  }

  var bfa={'font-size':'13.5','font-weight':'800','font-family':"'Cormorant Garamond',serif",fill:'#06153b'};
  svg.appendChild(arcText('IGLISI'.split(''),100,-33,33,false,bfa));
  svg.appendChild(arcText('WATCH'.split(''),100,147,213,true,bfa));

  /* ── Hour markers ── */
  var ROMAN={0:'XII',3:'III',6:'VI',9:'IX'};
  for(var h=0;h<12;h++){
    var hDeg=h*30, hRad=(hDeg-90)*Math.PI/180;
    var hx=CX+65*Math.cos(hRad), hy=CY+65*Math.sin(hRad);
    if(h===0||h===3||h===6||h===9){
      var numKey=h===0?0:h===3?3:h===6?6:9;
      var t=el('text',{x:hx,y:hy,'text-anchor':'middle','dominant-baseline':'central',
        'font-size':'9.5','font-family':"'Cormorant Garamond',serif",
        'font-weight':'700',fill:'#06153b'});
      t.textContent=ROMAN[numKey]; svg.appendChild(t);
    } else {
      var ds=3.2, dia=el('polygon');
      dia.setAttribute('points',hx+','+(hy-ds)+' '+(hx+ds)+','+hy+' '+hx+','+(hy+ds)+' '+(hx-ds)+','+hy);
      dia.setAttribute('fill','#b4945c');
      svg.appendChild(dia);
    }
  }

  /* Subtitle */
  var sub=el('text',{x:CX,y:CY+38,'text-anchor':'middle','dominant-baseline':'central',
    'font-size':'5.8','font-family':"'Inter',sans-serif",'font-weight':'500',
    'letter-spacing':'0.8',fill:'#06153b',opacity:'0.5'});
  sub.textContent='DURRËS · EST. 2009'; svg.appendChild(sub);

  /* ── Hands ── */
  function handG(id){return el('g',{id:id,transform:'rotate(0,'+CX+','+CY+')'});}

  /* Hour hand — tapered gold polygon */
  var hg=handG('iglHour'), hp=el('polygon');
  hp.setAttribute('points',[CX+','+(CY-44),(CX+3.8)+','+(CY-10),(CX+1.5)+','+(CY+10),CX+','+(CY+12),(CX-1.5)+','+(CY+10),(CX-3.8)+','+(CY-10)].join(' '));
  hp.setAttribute('fill','#b4945c'); hg.appendChild(hp); svg.appendChild(hg);

  /* Minute hand — thinner gold polygon */
  var mg=handG('iglMin'), mp=el('polygon');
  mp.setAttribute('points',[CX+','+(CY-61),(CX+2.5)+','+(CY-18),(CX+1.2)+','+(CY+10),CX+','+(CY+12),(CX-1.2)+','+(CY+10),(CX-2.5)+','+(CY-18)].join(' '));
  mp.setAttribute('fill','#b4945c'); mg.appendChild(mp); svg.appendChild(mg);

  /* Second hand — thin dark line with counterweight */
  var sg=handG('iglSec');
  sg.appendChild(el('line',{x1:CX,y1:CY+15,x2:CX,y2:CY-64,
    stroke:'#7a1a00','stroke-width':'1.2','stroke-linecap':'round'}));
  sg.appendChild(el('circle',{cx:CX,cy:CY+10,r:3,fill:'#7a1a00'}));
  svg.appendChild(sg);

  /* Center cap */
  svg.appendChild(el('circle',{cx:CX,cy:CY,r:6,fill:'#b4945c'}));
  svg.appendChild(el('circle',{cx:CX,cy:CY,r:2.5,fill:'#06153b'}));

  wrap.appendChild(svg);

  /* ── City cards ── */
  var row=document.getElementById('iglCities');
  if(row){
    CITIES.forEach(function(c,i){
      var card=document.createElement('div'); card.className='clock-city';
      var nm=document.createElement('div'); nm.className='clock-city-name'; nm.textContent=c.n;
      var tm=document.createElement('div'); tm.className='clock-city-time'; tm.id='ict'+i; tm.textContent='--:--:--';
      var dt=document.createElement('div'); dt.className='clock-city-date'; dt.id='icd'+i;
      card.appendChild(nm); card.appendChild(tm); card.appendChild(dt);
      row.appendChild(card);
    });
  }

  /* ── Clock update loop ── */
  function update(){
    var now=new Date();
    var s=now.getSeconds()+now.getMilliseconds()/1000;
    var m=now.getMinutes()+s/60;
    var h=(now.getHours()%12)+m/60;
    var r='rotate(%r,'+CX+','+CY+')';
    document.getElementById('iglHour').setAttribute('transform',r.replace('%r',h*30));
    document.getElementById('iglMin').setAttribute('transform',r.replace('%r',m*6));
    document.getElementById('iglSec').setAttribute('transform',r.replace('%r',s*6));
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
    if(!actx)return;
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
      tto=setTimeout(function(){if(!ticking)return;playTick();tiv=setInterval(function(){if(ticking)playTick();},1000);},ms);
    } else {clearTimeout(tto);clearInterval(tiv);}
  }
  /* CSP-safe: addEventListener instead of onclick attribute */
  var btn=document.getElementById('iglTickBtn');
  if(btn) btn.addEventListener('click',toggleTick);
})();
