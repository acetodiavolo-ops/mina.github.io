(function(){
  /* Category-to-slug map — covers all three site languages (EN / IT / SQ).
     Keys are the normalised textContent of .b-card-cat / .b-feat-cat spans.
     Curly apostrophes are normalised to straight ones before lookup.        */
  var CAT={
    // ── English ──────────────────────────────────────────────────────────
    'watch care':'care','watch maintenance':'care','watch repair':'care',
    'watch knowledge':'knowledge','watch style':'knowledge',
    'watch buying guide':'buying','buying guide':'buying','local guide':'buying',
    'brand comparison':'buying','watch review':'buying','albania nationwide':'buying',
    'key services':'keys','gift guide':'gifts',
    // ── Italian ──────────────────────────────────────────────────────────
    'cura orologio':'care','manutenzione':'care',"cura dell'orologio":'care',
    'manutenzione orologio':'care','riparazione':'care',
    'conoscenza orologi':'knowledge','stile orologio':'knowledge',
    "guida all'acquisto":'buying','guida locale':'buying',
    'confronto marchi':'buying','albania nazionale':'buying',
    'recensione orologio':'buying',"guida ai regali":'gifts','servizi chiavi':'keys',
    // ── Albanian ─────────────────────────────────────────────────────────
    'kujdesi i orësh':'care','kujdesi i orës':'care',
    'mirëmbajtja':'care','mirëmbajtja e orës':'care','riparim':'care',
    'njohuri për orët':'knowledge','njohuri orësh':'knowledge',
    'stili i orës':'knowledge',
    'udhëzues blerjeje':'buying','udhëzues blerje':'buying',
    'udhëzues lokal':'buying','krahasim markash':'buying',
    'e gjithë shqipëria':'buying','recensim orësh':'buying',
    'udhëzues dhuratash':'gifts',
    'shërbime çelësash':'keys'
  };

  function getCat(card){
    var el=card.querySelector('.b-card-cat,.b-feat-cat');
    if(!el) return '';
    var t=el.textContent.trim().toLowerCase().replace(/\s+/g,' ').replace(/[‘’]/g,"'");
    return CAT[t]||'';
  }

  var q=document.getElementById('blog-search');
  var btns=document.querySelectorAll('.b-cat-btn');
  var active='all';

  function run(){
    var term=q?q.value.trim().toLowerCase():'';
    var cards=document.querySelectorAll('.b-card,.b-feat');
    var n=0;
    cards.forEach(function(c){
      var catOk=active==='all'||getCat(c)===active;
      var h=(c.querySelector('h2,h3')||{}).textContent||'';
      var d=(c.querySelector('.b-card-desc,.b-feat-desc')||{}).textContent||'';
      var textOk=!term||h.toLowerCase().includes(term)||d.toLowerCase().includes(term);
      var show=catOk&&textOk;
      c.style.display=show?'':'none';
      if(show) n++;
    });
    /* Hide section labels whose grids are fully hidden */
    document.querySelectorAll('.b-label').forEach(function(lbl){
      var el=lbl.nextElementSibling,has=false;
      while(el&&!el.classList.contains('b-label')){
        if((el.classList.contains('b-grid3')||el.classList.contains('b-row2'))&&
           [].some.call(el.querySelectorAll('.b-card'),function(c){return c.style.display!=='none';}))
          has=true;
        el=el.nextElementSibling;
      }
      lbl.style.display=has?'':'none';
    });
    var empty=document.getElementById('blog-empty');
    if(empty) empty.style.display=n?'none':'';
  }

  if(q){q.addEventListener('input',run);q.addEventListener('search',run);}

  btns.forEach(function(b){
    b.addEventListener('click',function(){
      active=this.dataset.filter;
      btns.forEach(function(x){x.setAttribute('aria-pressed','false');});
      this.setAttribute('aria-pressed','true');
      run();
    });
  });
})();
