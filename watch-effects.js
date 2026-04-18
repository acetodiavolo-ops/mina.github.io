/*!
 * Iglisi Watch — Interactive Effects  v1.0
 * watch-effects.js
 */
(function(root,factory){
  if(typeof define==='function'&&define.amd){define([],factory);}
  else if(typeof module!=='undefined'&&module.exports){module.exports=factory();}
  else{root.IglisiEffects=factory();}
}(typeof self!=='undefined'?self:this,function(){
  'use strict';

  /* ============================================================
     CONCEPT 1: WATCHMAKER'S LOUPE
  ============================================================ */
  function Loupe(sectionSel,cardSel,options){
    var opts={size:110,zoom:2.5};
    if(options){if(options.size)opts.size=options.size;if(options.zoom)opts.zoom=options.zoom;}
    var section=document.querySelector(sectionSel);
    if(!section)return;
    section.style.position='relative';

    var loupe=document.createElement('div');
    loupe.className='iw-loupe';
    loupe.style.cssText='position:absolute;width:'+opts.size+'px;height:'+opts.size+'px;border-radius:50%;border:2px solid #b8953f;pointer-events:none;display:none;transform:translate(-50%,-50%);z-index:100;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06),0 4px 24px rgba(0,0,0,.35)';

    var canvas=document.createElement('canvas');
    var dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=opts.size*dpr; canvas.height=opts.size*dpr;
    canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;border-radius:50%';
    var ctx=canvas.getContext('2d');
    ctx.scale(dpr,dpr);

    var rim=document.createElement('div');
    rim.style.cssText='position:absolute;inset:0;border-radius:50%;border:1px solid rgba(184,149,63,.35);z-index:2;pointer-events:none';

    loupe.appendChild(canvas); loupe.appendChild(rim); section.appendChild(loupe);

    var activeImg=null;
    var half=opts.size/2;

    var cards=section.querySelectorAll(cardSel);
    for(var c=0;c<cards.length;c++){
      (function(card){
        card.addEventListener('mouseenter',function(){
          activeImg=card.querySelector('img');
          card.style.cursor='none';
          loupe.style.display='block';
        });
        card.addEventListener('mouseleave',function(){
          loupe.style.display='none';
          card.style.cursor='';
          activeImg=null;
        });
        card.addEventListener('mousemove',function(e){
          var sRect=section.getBoundingClientRect();
          loupe.style.left=(e.clientX-sRect.left)+'px';
          loupe.style.top=(e.clientY-sRect.top)+'px';
          if(!activeImg||!activeImg.complete||!activeImg.naturalWidth)return;
          var imgRect=activeImg.getBoundingClientRect();
          var relX=Math.max(0,Math.min(1,(e.clientX-imgRect.left)/imgRect.width));
          var relY=Math.max(0,Math.min(1,(e.clientY-imgRect.top)/imgRect.height));
          var nat={w:activeImg.naturalWidth,h:activeImg.naturalHeight};
          var srcW=nat.w/opts.zoom, srcH=nat.h/opts.zoom;
          var srcX=Math.max(0,Math.min(nat.w-srcW,relX*nat.w-srcW/2));
          var srcY=Math.max(0,Math.min(nat.h-srcH,relY*nat.h-srcH/2));
          ctx.clearRect(0,0,opts.size,opts.size);
          ctx.save();
          ctx.beginPath(); ctx.arc(half,half,half,0,Math.PI*2); ctx.clip();
          ctx.drawImage(activeImg,srcX,srcY,srcW,srcH,0,0,opts.size,opts.size);
          var vig=ctx.createRadialGradient(half,half,half*.5,half,half,half);
          vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,.20)');
          ctx.fillStyle=vig; ctx.beginPath(); ctx.arc(half,half,half,0,Math.PI*2); ctx.fill();
          ctx.restore();
        });
      }(cards[c]));
    }
  }

  /* ============================================================
     CONCEPT 2: ESCAPEMENT TICK-IN
  ============================================================ */
  function TickIn(){
    var audioCtx=null;
    function getAudio(){
      if(!audioCtx){
        try{
          audioCtx=new(window.AudioContext||window.webkitAudioContext)();
          // One-time gesture listener to unlock AudioContext on mobile
          function unlock(){
            if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume();
          }
          document.addEventListener('touchstart',unlock,{once:true,passive:true,capture:true});
          document.addEventListener('click',unlock,{once:true,capture:true});
        }catch(e){}
      }
      return audioCtx;
    }
    function tick(ctx){
      if(!ctx)return;
      // Resume suspended context (Chrome Android scroll, etc.)
      if(ctx.state==='suspended'){ctx.resume();return;}
      if(ctx.state!=='running')return;
      try{
        var osc=ctx.createOscillator(),gain=ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type='square';
        osc.frequency.setValueAtTime(1050+Math.random()*200,ctx.currentTime);
        gain.gain.setValueAtTime(0.032,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.038);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.04);
      }catch(e){}
    }
    function wrapChars(el){
      (function walk(node){
        if(node.nodeType===3){
          var frag=document.createDocumentFragment(),text=node.textContent;
          for(var i=0;i<text.length;i++){
            var span=document.createElement('span');
            span.className='iw-char'; span.textContent=text[i];
            if(text[i]===' '||text[i]==='\u00A0'||text[i]==='\n'){
              span.setAttribute('data-space',''); span.style.opacity='1';
            }
            frag.appendChild(span);
          }
          node.parentNode.replaceChild(frag,node);
        }else if(node.nodeType===1&&node.tagName!=='SCRIPT'){
          var kids=Array.prototype.slice.call(node.childNodes);
          for(var k=0;k<kids.length;k++) walk(kids[k]);
        }
      }(el));
      return Array.prototype.slice.call(el.querySelectorAll('.iw-char:not([data-space])'));
    }
    function animate(chars,speed,delay,withSound){
      var i=0,ctx=withSound?getAudio():null;
      setTimeout(function step(){
        if(i>=chars.length)return;
        chars[i].style.opacity='1';
        if(withSound)tick(ctx);
        i++;
        var next=speed+(Math.random()*speed*.4-speed*.2);
        setTimeout(step,Math.max(18,next));
      },delay);
    }
    return {
      init:function(){
        var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
        // Pre-create AudioContext and attach unlock listener immediately so
        // the first user gesture on mobile unlocks it before animation fires
        if(!reduced)getAudio();
        var elements=document.querySelectorAll('[data-tick-in]');
        if(!elements.length||!window.IntersectionObserver)return;
        var observer=new IntersectionObserver(function(entries){
          for(var e=0;e<entries.length;e++){
            var entry=entries[e];
            if(!entry.isIntersecting)continue;
            var el=entry.target;
            if(el.dataset.tickDone)continue;
            el.dataset.tickDone='1';
            observer.unobserve(el);
            if(reduced){
              var all=el.querySelectorAll('.iw-char');
              for(var a=0;a<all.length;a++) all[a].style.opacity='1';
              continue;
            }
            var speed=parseInt(el.dataset.tickSpeed,10)||50;
            var delay=parseInt(el.dataset.tickDelay,10)||0;
            var sound=el.dataset.tickSound!=='false';
            var chars=wrapChars(el);
            animate(chars,speed,delay,sound);
          }
        },{threshold:0.3});
        for(var i=0;i<elements.length;i++) observer.observe(elements[i]);
      }
    };
  }

  /* ============================================================
     CONCEPT 3: GOLD DUST CURSOR TRAIL
  ============================================================ */
  function Trail(sectionSel,options){
    var opts={color:'#b8953f',count:60,minSize:2,maxSize:5,decay:0.024,drift:0.3};
    if(options){
      if(options.color)  opts.color=options.color;
      if(options.count)  opts.count=options.count;
      if(options.minSize)opts.minSize=options.minSize;
      if(options.maxSize)opts.maxSize=options.maxSize;
      if(options.decay)  opts.decay=options.decay;
      if(options.drift)  opts.drift=options.drift;
    }
    var section=document.querySelector(sectionSel);
    if(!section)return;

    var canvas=document.createElement('canvas');
    canvas.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1';
    section.appendChild(canvas);
    var ctx=canvas.getContext('2d');

    var hex=opts.color.replace('#','');
    var cr=parseInt(hex.slice(0,2),16),cg=parseInt(hex.slice(2,4),16),cb=parseInt(hex.slice(4,6),16);

    function resize(){canvas.width=section.offsetWidth;canvas.height=section.offsetHeight;}
    resize();
    var rt; window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(resize,150);});

    var particles=[],mouseX=0,mouseY=0;

    section.addEventListener('mousemove',function(e){
      var rect=section.getBoundingClientRect();
      mouseX=e.clientX-rect.left; mouseY=e.clientY-rect.top;
      spawn(); spawn();
    });
    section.addEventListener('mouseleave',function(){particles=[];});

    function spawn(){
      var p={
        x:mouseX+(Math.random()-.5)*8,y:mouseY+(Math.random()-.5)*8,
        size:opts.minSize+Math.random()*(opts.maxSize-opts.minSize),
        opacity:.65+Math.random()*.35,
        vx:(Math.random()-.5)*.6,
        vy:-(opts.drift+Math.random()*opts.drift)
      };
      if(particles.length>=opts.count){particles.shift();}
      particles.push(p);
    }

    function render(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(var i=particles.length-1;i>=0;i--){
        var p=particles[i];
        p.x+=p.vx; p.y+=p.vy; p.opacity-=opts.decay;
        if(p.opacity<=0.01){particles.splice(i,1);continue;}
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size/2,0,Math.PI*2);
        ctx.fillStyle='rgba('+cr+','+cg+','+cb+','+p.opacity.toFixed(3)+')';
        ctx.fill();
      }
      requestAnimationFrame(render);
    }
    render();
  }

  /* ============================================================
     CONCEPT 4: LIVING BALANCE WHEEL
  ============================================================ */
  function BalanceWheel(selector,options){
    var opts={size:120,swing:38,speed:0.032,color:'#b8953f',dark:true};
    if(options){
      if(options.size!==undefined) opts.size=options.size;
      if(options.swing!==undefined)opts.swing=options.swing;
      if(options.speed!==undefined)opts.speed=options.speed;
      if(options.color)opts.color=options.color;
      if(options.dark!==undefined)opts.dark=options.dark;
    }
    var targets=document.querySelectorAll(selector);
    if(!targets.length)return;
    var ns='http://www.w3.org/2000/svg';
    var cx=opts.size/2,cy=opts.size/2,r=opts.size/2-4;

    function svgEl(tag,attrs){
      var node=document.createElementNS(ns,tag);
      var keys=Object.keys(attrs);
      for(var k=0;k<keys.length;k++) node.setAttribute(keys[k],attrs[keys[k]]);
      return node;
    }

    function buildSVG(){
      var svg=document.createElementNS(ns,'svg');
      svg.setAttribute('width',opts.size); svg.setAttribute('height',opts.size);
      svg.setAttribute('viewBox','0 0 '+opts.size+' '+opts.size);
      svg.setAttribute('style','display:block;overflow:visible');
      var jewel=opts.dark?'#0d1b3e':'#ffffff';
      var face =opts.dark?'#1a2d5a':'#f8f5ef';
      var spokeR=r-14;

      svg.appendChild(svgEl('circle',{cx:cx,cy:cy,r:r,fill:'none',stroke:opts.color,'stroke-width':'1.5'}));
      svg.appendChild(svgEl('circle',{cx:cx,cy:cy,r:r-7,fill:'none',stroke:opts.color,'stroke-width':'0.5',opacity:'0.22'}));

      var majTicks=[0,90,180,270];
      for(var m=0;m<majTicks.length;m++){
        var rad=(majTicks[m]-90)*Math.PI/180;
        svg.appendChild(svgEl('line',{
          x1:cx+(r-1)*Math.cos(rad),y1:cy+(r-1)*Math.sin(rad),
          x2:cx+(r-9)*Math.cos(rad),y2:cy+(r-9)*Math.sin(rad),
          stroke:opts.color,'stroke-width':'2','stroke-linecap':'round'
        }));
      }
      var minTicks=[30,60,120,150,210,240,300,330];
      for(var n=0;n<minTicks.length;n++){
        var rad2=(minTicks[n]-90)*Math.PI/180;
        svg.appendChild(svgEl('line',{
          x1:cx+(r-1)*Math.cos(rad2),y1:cy+(r-1)*Math.sin(rad2),
          x2:cx+(r-5)*Math.cos(rad2),y2:cy+(r-5)*Math.sin(rad2),
          stroke:opts.color,'stroke-width':'0.75',opacity:'0.45','stroke-linecap':'round'
        }));
      }

      var g=document.createElementNS(ns,'g');
      var spokes=[0,90,180,270];
      for(var s=0;s<spokes.length;s++){
        var sRad=(spokes[s]-90)*Math.PI/180;
        g.appendChild(svgEl('line',{
          x1:cx,y1:cy,x2:cx+spokeR*Math.cos(sRad),y2:cy+spokeR*Math.sin(sRad),
          stroke:opts.color,'stroke-width':'2.5','stroke-linecap':'round'
        }));
      }
      for(var j=0;j<spokes.length;j++){
        var jRad=(spokes[j]-90)*Math.PI/180;
        var jx=cx+spokeR*Math.cos(jRad),jy=cy+spokeR*Math.sin(jRad);
        g.appendChild(svgEl('circle',{cx:jx,cy:jy,r:5.5,fill:jewel,stroke:opts.color,'stroke-width':'1.5'}));
        g.appendChild(svgEl('circle',{cx:jx,cy:jy,r:2,fill:opts.color,opacity:'0.7'}));
      }
      g.appendChild(svgEl('circle',{cx:cx,cy:cy,r:8,fill:jewel,stroke:opts.color,'stroke-width':'1.5'}));
      g.appendChild(svgEl('circle',{cx:cx,cy:cy,r:3.5,fill:opts.color}));
      g.appendChild(svgEl('circle',{cx:cx,cy:cy,r:1.2,fill:jewel}));
      svg.appendChild(g);

      svg.appendChild(svgEl('path',{
        d:'M '+cx+' '+(cy-8)+' Q '+(cx+6)+' '+(cy-18)+' '+cx+' '+(cy-26),
        fill:'none',stroke:opts.color,'stroke-width':'0.6',opacity:'0.3'
      }));
      return {svg:svg,wheel:g};
    }

    function startAnimation(wheelEl,svgElement){
      var t=0,raf=null,running=false;
      function step(){
        t+=opts.speed;
        var angle=Math.sin(t)*opts.swing;
        wheelEl.setAttribute('transform','rotate('+angle.toFixed(3)+','+cx+','+cy+')');
        raf=requestAnimationFrame(step);
      }
      if(!window.IntersectionObserver){step();return;}
      var obs=new IntersectionObserver(function(entries){
        if(entries[0].isIntersecting&&!running){running=true;step();}
        else if(!entries[0].isIntersecting&&running){running=false;cancelAnimationFrame(raf);}
      },{threshold:0.1});
      obs.observe(svgElement);
    }

    for(var i=0;i<targets.length;i++){
      var target=targets[i];
      var built=buildSVG();
      target.appendChild(built.svg);
      startAnimation(built.wheel,built.svg);
    }
  }

  /* ============================================================
     PUBLIC API
  ============================================================ */
  return {
    loupe:function(sectionSel,cardSel,options){new Loupe(sectionSel,cardSel,options);},
    tickIn:function(){new TickIn().init();},
    trail:function(sectionSel,options){new Trail(sectionSel,options);},
    balanceWheel:function(selector,options){new BalanceWheel(selector,options);},
    init:function(config){
      config=config||{};
      if(config.loupe)        this.loupe(config.loupe.section,config.loupe.cards,config.loupe.options);
      if(config.tickIn)       this.tickIn();
      if(config.trail)        this.trail(config.trail.section,config.trail.options);
      if(config.balanceWheel) this.balanceWheel(config.balanceWheel.selector,config.balanceWheel.options);
    }
  };
}));
