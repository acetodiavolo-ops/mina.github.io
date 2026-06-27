(function(){
  var currentFilter = 'all';
  var currentSearch = '';
  var currentSort   = 'default';
  var currentMinPrice = 50;
  var currentMaxPrice = 200;
  var PRICE_MIN = 50, PRICE_MAX = 200;

  fetch('https://raw.githubusercontent.com/acetodiavolo-ops/mina.github.io/main/watches.json?v=3')
    .then(function(r){ return r.json(); })
    .then(function(WATCHES){
      renderWatches(WATCHES);
      injectItemListSchema(WATCHES, 'en');

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

      var priceMinEl = document.getElementById('priceMin');
      var priceMaxEl = document.getElementById('priceMax');
      if(priceMinEl && priceMaxEl){
        function onPriceChange(){
          var vMin = parseInt(priceMinEl.value);
          var vMax = parseInt(priceMaxEl.value);
          if(vMin > vMax){ priceMinEl.value = vMax; vMin = vMax; }
          priceMinEl.style.zIndex = vMin >= PRICE_MAX - 5 ? 5 : 3;
          currentMinPrice = vMin;
          currentMaxPrice = vMax;
          var disp = document.getElementById('priceRangeDisplay');
          if(disp) disp.textContent = '€' + vMin + ' — €' + vMax;
          setPriceTrack(vMin, vMax);
          renderWatches(WATCHES);
        }
        priceMinEl.addEventListener('input', onPriceChange);
        priceMaxEl.addEventListener('input', onPriceChange);
      }
    })
    .catch(function(){
      document.getElementById('shopGrid').innerHTML = '<p class="no-watches">Could not load watches. Please refresh.</p>';
    });

  function renderWatches(watches){
    var filtered = currentFilter === 'all' ? watches.slice() : watches.filter(function(w){ return w.condition === currentFilter; });

    if(currentSearch){
      var s = currentSearch;
      filtered = filtered.filter(function(w){
        return (w.model+' '+w.brand+' '+(w.reference||'')+' '+(w.description_en||'')).toLowerCase().includes(s);
      });
    }

    filtered = filtered.filter(function(w){
      return (w.price||0) >= currentMinPrice && (w.price||0) <= currentMaxPrice;
    });

    // Sort
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
    count.textContent = filtered.length + ' watch' + (filtered.length !== 1 ? 'es' : '') + ' available';
    if(!filtered.length){
      grid.innerHTML = '<p class="no-watches">No watches match this filter right now. Check back soon!</p>';
      return;
    }
    grid.innerHTML = filtered.map(function(w){ return watchCard(w); }).join('');
  }

  function setPriceTrack(min, max){
    var fill = document.getElementById('priceTrackFill');
    if(!fill) return;
    var total = PRICE_MAX - PRICE_MIN;
    fill.style.left = ((min - PRICE_MIN) / total * 100) + '%';
    fill.style.width = ((max - min) / total * 100) + '%';
  }

  function injectItemListSchema(watches, lang) {
    var base = 'https://watch.al/' + lang + '/shop/';
    var items = watches.filter(function(w){ return !w.sold; }).map(function(w, i){
      return {
        '@type': 'ListItem',
        'position': i + 1,
        'url': base + w.id + '.html',
        'item': {
          '@type': 'Product',
          'name': w.brand + ' ' + w.model + (w.brand === 'Hislon' ? ' Swiss Watch' : ''),
          'image': w.image ? 'https://watch.al' + w.image : 'https://watch.al/og-image.png',
          'brand': {'@type': 'Brand', 'name': w.brand},
          'sku': w.reference || '',
          'offers': {
            '@type': 'Offer',
            'priceCurrency': w.currency || 'EUR',
            'price': String(w.price || ''),
            'availability': 'https://schema.org/InStock',
            'itemCondition': 'https://schema.org/NewCondition',
            'seller': {'@type': 'Organization', 'name': 'Iglisi Watch'},
            'url': base + w.id + '.html'
          }
        }
      };
    });
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Watches for Sale at Iglisi Watch',
      'url': 'https://watch.al/' + lang + '/shop/',
      'numberOfItems': items.length,
      'itemListElement': items
    };
    var el = document.getElementById('shop-ld-list');
    if (el) el.textContent = JSON.stringify(schema);
  }

  var EUR_TO_LEK = 97;
  function fmt(price, currency){
    if(!price) return 'Price on request';
    return (currency === 'EUR' ? '\u20ac' : currency) + Number(price).toLocaleString('en-EU');
  }
  function fmtLek(price, currency){
    if(!price || currency !== 'EUR') return '';
    return '<span style="font-size:.78rem;color:#888;font-weight:400"> \u00b7 ' + (Math.round(price * EUR_TO_LEK / 100) * 100).toLocaleString() + '\u00a0L</span>';
  }

  function waMsg(w){
    var msg = "Hi, I\u2019m interested in the " + w.brand + ' ' + w.model + ' (Ref. ' + (w.reference||'N/A') + ') listed on your website.';
    return 'https://api.whatsapp.com/send?phone=355676360510&text=' + encodeURIComponent(msg);
  }

  function watchCard(w){
    var imgHtml = w.image
      ? '<a href="/en/shop/' + w.id + '.html" aria-label="' + w.brand + ' ' + w.model + (w.brand === 'Hislon' ? ' Swiss Watch' : '') + '"><picture><source srcset="' + w.image.replace(/\.jpe?g$/i, '.webp') + '" type="image/webp"><img src="' + w.image + '" alt="' + w.brand + ' ' + w.model + (w.brand === 'Hislon' ? ' Swiss Watch' : '') + '" loading="lazy"></picture></a>'
      : '<div class="watch-img-placeholder"><i class="fas fa-clock" aria-hidden="true"></i></div>';
    var soldOverlay = w.sold ? '<div class="sold-overlay">Sold</div>' : '';
    var ctaHtml = w.sold
      ? '<span style="font-size:.82rem;color:#888">Sold</span>'
      : '<a href="' + waMsg(w) + '" target="_blank" rel="noopener noreferrer" class="watch-cta" data-fb-contact="1" aria-label="Enquire about ' + w.brand + ' ' + w.model + ' via WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Enquire</a>';
    return '<article class="watch-card' + (w.sold?' sold-card':'') + '">'
      + '<div class="watch-card-img">' + imgHtml + soldOverlay
      + '<span class="watch-badge">' + w.condition + '</span>'
      + (w.originalPrice ? '<span class="sale-badge">−10%</span>' : '')
      + '</div>'
      + '<div class="watch-card-body">'
      + '<p class="watch-brand">' + w.brand + (w.brand === 'Hislon' ? '<span style="font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;color:#8a9abf;font-weight:500;margin-left:.4rem;vertical-align:middle">Swiss</span>' : '') + '</p>'
      + '<h2 class="watch-model">' + w.model + '</h2>'
      + '<p class="watch-ref">Ref. ' + (w.reference||'\u2014') + '</p>'
      + '<p class="watch-desc">' + (w.description_en || '') + '</p>'
      + '<div class="watch-card-footer">'
      + '<div>'
      + '<p class="watch-price">' + fmt(w.price, w.currency) + fmtLek(w.price, w.currency) + '</p>'
      + (w.originalPrice ? '<p class="was-price-line">Was ' + (w.currency==='EUR'?'€':w.currency) + w.originalPrice + '</p>' : '')
      + '</div>'
      + '<a href="https://instagram.com/iglisiwatch" target="_blank" rel="noopener noreferrer" class="watch-ig-link" aria-label="See on Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>'
      + ctaHtml
      + '</div></div></article>';
  }
})();
