(function(){
  var condMap = {'New':'I ri','Pre-owned':'I p\u00ebrdorur'};
  var currentFilter = 'all';
  var currentSearch = '';
  var currentSort   = 'default';

  fetch('https://raw.githubusercontent.com/acetodiavolo-ops/mina.github.io/main/watches.json?v=2')
    .then(function(r){ return r.json(); })
    .then(function(WATCHES){
      renderWatches(WATCHES);

      document.querySelectorAll('.filter-chip').forEach(function(chip){
        chip.addEventListener('click', function(){
          document.querySelectorAll('.filter-chip').forEach(function(c){ c.classList.remove('active'); c.removeAttribute('aria-pressed'); });
          chip.classList.add('active');
          chip.setAttribute('aria-pressed','true');
          currentFilter = chip.dataset.filter;
          renderWatches(WATCHES);
        });
      });

      var searchInput = document.getElementById('shopSearch');
      if(searchInput){
        function onSearch(){ currentSearch = searchInput.value.trim().toLowerCase(); renderWatches(WATCHES); }
        searchInput.addEventListener('input', onSearch);
        searchInput.addEventListener('search', onSearch);
      }

      var sortEl = document.getElementById('shopSort');
      if(sortEl){
        sortEl.addEventListener('change', function(){ currentSort = this.value; renderWatches(WATCHES); });
      }
    })
    .catch(function(){
      document.getElementById('shopGrid').innerHTML = '<p class="no-watches">Nuk mund t\u00eb ngarkoje or\u00ebt. Rifreskoni faqen.</p>';
    });

  function renderWatches(watches){
    var filtered = currentFilter === 'all' ? watches.slice() : watches.filter(function(w){ return w.condition === currentFilter; });

    if(currentSearch){
      var s = currentSearch;
      filtered = filtered.filter(function(w){
        return (w.model+' '+w.brand+' '+(w.reference||'')+' '+(w.description_sq||'')).toLowerCase().includes(s);
      });
    }

    if(currentSearch && currentSort === 'default'){
      var s = currentSearch;
      filtered.sort(function(a,b){
        var aScore = (a.brand.toLowerCase().startsWith(s)?2:0)+(a.model.toLowerCase().startsWith(s)?1:0);
        var bScore = (b.brand.toLowerCase().startsWith(s)?2:0)+(b.model.toLowerCase().startsWith(s)?1:0);
        return bScore - aScore;
      });
    } else if(currentSort === 'price-asc'){
      filtered.sort(function(a,b){ return (a.price||0)-(b.price||0); });
    } else if(currentSort === 'price-desc'){
      filtered.sort(function(a,b){ return (b.price||0)-(a.price||0); });
    } else if(currentSort === 'brand'){
      filtered.sort(function(a,b){ return (a.brand+a.model).localeCompare(b.brand+b.model); });
    }

    var count = document.getElementById('shopCount');
    var grid  = document.getElementById('shopGrid');
    count.textContent = filtered.length + ' or\u00eb e disponueshme';
    if(!filtered.length){
      grid.innerHTML = '<p class="no-watches">Asnj\u00eb or\u00eb nuk p\u00ebrputhet me k\u00ebt\u00eb filtro tani. Kthehuni s\u00eb shpejti!</p>';
      return;
    }
    grid.innerHTML = filtered.map(function(w){ return watchCard(w); }).join('');
  }

  function fmt(price, currency){
    if(!price) return '\u00c7mimi me k\u00ebrkese';
    return (currency === 'EUR' ? '\u20ac' : currency) + Number(price).toLocaleString('sq-AL');
  }

  function waMsg(w){
    var msg = 'Pershendetje, jam i interesuar per oren ' + w.brand + ' ' + w.model + ' (Ref. ' + (w.reference||'N/A') + ') ne faqen tuaj.';
    return 'https://api.whatsapp.com/send?phone=355676360510&text=' + encodeURIComponent(msg);
  }

  function watchCard(w){
    var cond = condMap[w.condition] || w.condition;
    var imgHtml = w.image
      ? '<a href="/sq/shop/watch.html?id=' + w.id + '" aria-label="' + w.brand + ' ' + w.model + '"><img src="' + w.image + '" alt="' + w.brand + ' ' + w.model + '" loading="lazy"></a>'
      : '<div class="watch-img-placeholder"><i class="fas fa-clock" aria-hidden="true"></i></div>';
    var soldOverlay = w.sold ? '<div class="sold-overlay">Shitur</div>' : '';
    var ctaHtml = w.sold
      ? '<span style="font-size:.82rem;color:#888">Shitur</span>'
      : '<a href="' + waMsg(w) + '" target="_blank" rel="noopener noreferrer" class="watch-cta" data-fb-contact="1" aria-label="Pyesni per ' + w.brand + ' ' + w.model + ' ne WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Pyesni</a>';
    return '<article class="watch-card' + (w.sold?' sold-card':'') + '">'
      + '<div class="watch-card-img">' + imgHtml + soldOverlay
      + '<span class="watch-badge">' + cond + '</span></div>'
      + '<div class="watch-card-body">'
      + '<p class="watch-brand">' + w.brand + '</p>'
      + '<h2 class="watch-model">' + w.model + '</h2>'
      + '<p class="watch-ref">Ref. ' + (w.reference||'\u2014') + ' &middot; ' + w.year + '</p>'
      + '<p class="watch-desc">' + (w.description_sq || '') + '</p>'
      + '<div class="watch-card-footer">'
      + '<p class="watch-price">' + fmt(w.price, w.currency) + '</p>'
      + '<a href="https://instagram.com/iglisiwatch" target="_blank" rel="noopener noreferrer" class="watch-ig-link" aria-label="Shiko n\u00eb Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>'
      + ctaHtml
      + '</div></div></article>';
  }
})();
