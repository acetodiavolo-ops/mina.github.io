  (function(){
    // Back to top
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', function(){ btn.classList.toggle('visible', window.scrollY > 300); }, {passive:true});
    btn.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });

    // Footer year
    document.getElementById('footerYear').textContent = new Date().getFullYear();

    // Inline watch data — no fetch needed
    var WATCHES = [
      {"id":"watch-1","brand":"Hislon","model":"Classic","reference":"CL213S-02SS","year":2024,"condition":"New","price":199,"currency":"EUR","image":"/images/watches/hislon-cl213s-02ss.jpg","sold":false,"description_en":"Clean, understated elegance in stainless steel. Fluted bezel, horizontal-stripe silver dial, sapphire crystal, and date window. A reliable everyday dress watch."},
      {"id":"watch-2","brand":"Hislon","model":"Classic Queen","reference":"QL145T-09SG","year":2024,"condition":"New","price":189,"currency":"EUR","image":"/images/watches/hislon-ql145t-09sg.jpg","sold":false,"description_en":"A refined ladies' watch with a rose gold-tone case and bracelet. Slim profile, elegant dial, and reliable quartz movement — effortless everyday style."},
      {"id":"watch-3","brand":"Hislon","model":"Classic","reference":"CL213G-02SG","year":2024,"condition":"New","price":189,"currency":"EUR","image":"/images/watches/hislon-cl213g-02sg.jpg","sold":false,"description_en":"The Classic in full gold-tone stainless steel. Fluted bezel, horizontal-stripe silver dial, gold-tone hands and indices, sapphire crystal, and date window."},
      {"id":"watch-4","brand":"Hislon","model":"Masterwork","reference":"MS201S-04SS","year":2024,"condition":"New","price":184,"currency":"USD","image":"/images/watches/hislon-ms201s-04ss.jpg","sold":false,"description_en":"A bold sport-chic chronograph with a jet-black dial, sapphire crystal, and stainless steel bracelet. Three subdials, red accent details, and a date window — precision with attitude."},
      {"id":"watch-5","brand":"Hislon","model":"Classic Queen","reference":"QL113G-09SG","year":2024,"condition":"New","price":169,"currency":"EUR","image":"/images/watches/hislon-ql113g-09sg.jpg","sold":false,"description_en":"A ladies' classic in full gold-tone steel with a mother-of-pearl dial set with crystal indices, sapphire crystal, blue hands, and a date window. Timeless femininity."},
      {"id":"watch-6","brand":"Hislon","model":"Women Classic Queen","reference":"QL113-09SS","year":2024,"condition":"New","price":149,"currency":"EUR","image":"/images/watches/hislon-ql113g-09ss.jpg?v=3","sold":false,"description_en":"The Women Classic Queen in stainless steel with a mother-of-pearl dial, crystal indices, sapphire crystal, blue hands, and a date window. Understated elegance for every day."},
      {"id":"watch-7","brand":"Navimarine","model":"NM268-06","reference":"NM268-06","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-nm268-06.jpg","sold":false,"description_en":"A sport-inspired marine watch with a bold, clean dial and sturdy stainless steel case. Reliable quartz movement, date window, and a versatile strap — ready for both sea and city."}
    ];

    var currentFilter = 'all';
    var currentSearch = '';
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

    function renderWatches(watches, filter, search){
      var filtered = filter === 'all' ? watches : watches.filter(function(w){ return w.condition === filter; });
      if(search){
        filtered = filtered.filter(function(w){
          return (w.model + ' ' + w.brand + ' ' + w.reference).toLowerCase().includes(search);
        });
      }
      var count = document.getElementById('shopCount');
      var grid = document.getElementById('shopGrid');
      count.textContent = filtered.length + ' watch' + (filtered.length !== 1 ? 'es' : '') + ' available';
      if(!filtered.length){
        grid.innerHTML = '<p class="no-watches">No watches match this filter right now. Check back soon!</p>';
        return;
      }
      grid.innerHTML = filtered.map(function(w){ return watchCard(w); }).join('');
    }

    function fmt(price, currency){
      if(!price) return 'Price on request';
      return (currency === 'EUR' ? '€' : currency) + Number(price).toLocaleString('en-EU');
    }

    function waMsg(w){
      var msg = 'Hi, I\'m interested in the ' + w.brand + ' ' + w.model + ' (Ref. ' + w.reference + ') listed on your website.';
      return 'https://api.whatsapp.com/send?phone=355676360510&text=' + encodeURIComponent(msg);
    }

    function watchCard(w){
      var imgHtml = w.image
        ? '<img src="' + w.image + '" alt="' + w.brand + ' ' + w.model + '" loading="lazy">'
        : '<div class="watch-img-placeholder"><i class="fas fa-clock" aria-hidden="true"></i></div>';
      var soldOverlay = w.sold ? '<div class="sold-overlay">Sold</div>' : '';
      var ctaHtml = w.sold
        ? '<span style="font-size:.82rem;color:#888">Sold</span>'
        : '<a href="' + waMsg(w) + '" target="_blank" rel="noopener noreferrer" class="watch-cta" aria-label="Enquire about ' + w.brand + ' ' + w.model + ' via WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Enquire</a>';
      return '<article class="watch-card' + (w.sold?' sold-card':'') + '">'
        + '<div class="watch-card-img">' + imgHtml + soldOverlay
        + '<span class="watch-badge">' + w.condition + '</span></div>'
        + '<div class="watch-card-body">'
        + '<p class="watch-brand">' + w.brand + '</p>'
        + '<h2 class="watch-model">' + w.model + '</h2>'
        + '<p class="watch-ref">Ref. ' + w.reference + ' &middot; ' + w.year + '</p>'
        + '<p class="watch-desc">' + (w.description_en || '') + '</p>'
        + '<div class="watch-card-footer">'
        + '<p class="watch-price">' + fmt(w.price, w.currency) + '</p>'
        + ctaHtml
        + '</div></div></article>';
    }
  })();
  