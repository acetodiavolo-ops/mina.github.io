(function(){
  var q=document.getElementById('blog-search');
  var btns=document.querySelectorAll('.b-cat-btn');
  var active='all';

  function run(){
    var term=q?q.value.trim().toLowerCase():'';
    var cards=document.querySelectorAll('.b-card,.b-feat');
    var n=0;
    cards.forEach(function(c){
      var catOk=active==='all'||(c.dataset.cat||'')=== active;
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
