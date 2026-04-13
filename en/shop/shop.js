(function(){
  var currentFilter = 'all';
  var currentSearch = '';

  fetch('/watches.json')
    .then(function(r){ return r.json(); })
    .then(function(WATCHES){
      renderWatches(WATCHES, 'all', '');

      document.querySelectorAll('.filter-chip').forEach(function(chip){
        chip.addEventListener('click', function(){
          document.querySelectorAll('.filter-chip').forEach(function(c){ c.classList.remove('active'); c.removeAttribute('aria-pressed'); });
          chip.classList.add('active');
          chip.setAttribute('aria-pressed','true');
          currentFilter = chip.dataset.filter;
          renderWatches(WATCHES, currentFilter, currentSearch);
        });
      });

      var searchInput = document.getElementById('shopSearch');
      if(searchInput){
        searchInput.addEventListener('input', function(){
          currentSearch = this.value.trim().toLowerCase();
          renderWatches(WATCHES, currentFilter, currentSearch);
        });
      }
    })
    .catch(function(){
      document.getElementById('shopCount').textContent = 'Could not load watches. Please refresh.';
    });

  function renderWatches(watches, filter, search){
    var filtered = filter === 'all' ? watches : watches.filter(function(w){ return w.condition === filter; });
    if(search){
      filtered = filtered.filter(function(w){
        return (w.model + ' ' + w.brand + ' ' + (w.reference||'') + ' ' + (w['description_en']||'')).toLowerCase().includes(search);
      });
    }
    var count = document.getElementById('shopCount');
    var grid = document.getElementById('shopGrid');
    count.textContent = filtered.length + ' watch' + (filtered.length !== 1 ? 'es' : '') + ' available';
    if(!filtered.length){
      grid.innerHTML = '<p class="no-watches">No watches match this filter right now. Check back soon!</p>';
      return;
    }
    if(search){
      filtered.sort(function(a,b){
        var s = search.toLowerCase();
        var aScore = (a.brand.toLowerCase().startsWith(s)?2:0) + (a.model.toLowerCase().startsWith(s)?1:0);
        var bScore = (b.brand.toLowerCase().startsWith(s)?2:0) + (b.model.toLowerCase().startsWith(s)?1:0);
        return bScore - aScore;
      });
    }
    grid.innerHTML = filtered.map(function(w){ return watchCard(w); }).join('');
  }

  function fmt(price, currency){
    if(!price) return 'Price on request';
    return (currency === 'EUR' ? '\u20ac' : currency) + Number(price).toLocaleString('en-EU');
  }

  function waMsg(w){
    var msg = "Hi, I\u2019m interested in the " + w.brand + ' ' + w.model + ' (Ref. ' + (w.reference||'N/A') + ') listed on your website.';
    return 'https://api.whatsapp.com/send?phone=355676360510&text=' + encodeURIComponent(msg);
  }

  function watchCard(w){
    var imgHtml = w.image
      ? '<a href="/en/shop/watch.html?id=' + w.id + '" aria-label="' + w.brand + ' ' + w.model + '"><img src="' + w.image + '" alt="' + w.brand + ' ' + w.model + '" loading="lazy"></a>'
      : '<div class="watch-img-placeholder"><i class="fas fa-clock" aria-hidden="true"></i></div>';
    var soldOverlay = w.sold ? '<div class="sold-overlay">Sold</div>' : '';
    var ctaHtml = w.sold
      ? '<span style="font-size:.82rem;color:#888">Sold</span>'
      : '<a href="' + waMsg(w) + '" target="_blank" rel="noopener noreferrer" class="watch-cta" data-fb-contact="1" aria-label="Enquire about ' + w.brand + ' ' + w.model + ' via WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Enquire</a>';
    return '<article class="watch-card' + (w.sold?' sold-card':'') + '">'
      + '<div class="watch-card-img">' + imgHtml + soldOverlay
      + '<span class="watch-badge">' + w.condition + '</span></div>'
      + '<div class="watch-card-body">'
      + '<p class="watch-brand">' + w.brand + '</p>'
      + '<h2 class="watch-model">' + w.model + '</h2>'
      + '<p class="watch-ref">Ref. ' + (w.reference||'\u2014') + ' &middot; ' + w.year + '</p>'
      + '<p class="watch-desc">' + (w.description_en || '') + '</p>'
      + '<div class="watch-card-footer">'
      + '<p class="watch-price">' + fmt(w.price, w.currency) + '</p>'
      + '<a href="https://instagram.com/iglisiwatch" target="_blank" rel="noopener noreferrer" class="watch-ig-link" aria-label="See on Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>'
      + ctaHtml
      + '</div></div></article>';
  }
})();
