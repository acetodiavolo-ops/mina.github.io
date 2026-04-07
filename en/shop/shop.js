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
      {"id":"watch-7","brand":"Navimarine","model":"NM268-06","reference":"NM268-06","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-nm268-06.jpg","sold":false,"description_en":"A sport-inspired marine watch with a bold, clean dial and sturdy stainless steel case. Reliable quartz movement, date window, and a versatile strap — ready for both sea and city."},
      {"id":"watch-8","brand":"Hislon","model":"Classic","reference":"CL214S-04SS","year":2024,"condition":"New","price":199,"currency":"EUR","image":"/images/watches/hislon-cl214s-04ss.jpg","sold":false,"description_en":"The Classic CL214S-04SS in two-tone stainless steel — silver case with gold-tone accents. Fluted bezel, clean silver dial with gold-tone hands and indices, sapphire crystal, and date window. Timeless dress elegance at its finest."},
      {"id":"watch-9","brand":"Navimarine","model":"NMM1011","reference":"NMM1011","year":2024,"condition":"New","price":55,"currency":"USD","image":"/images/watches/navimarine-nmm1011.jpg","sold":false,"description_en":"A bold marine timepiece with a striking multi-layered dial and robust stainless steel case. Reliable quartz movement, luminous hands, and a durable strap — built for adventure on and off the water."},
      {"id":"watch-10","brand":"Navimarine","model":"NM232-04","reference":"NM232-04","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nm232-04.jpg","sold":false,"description_en":"A clean, sporty marine watch with a crisp dial and solid stainless steel case. Reliable quartz movement, date window, and a comfortable strap — understated style for everyday wear."},
      {"id":"watch-11","brand":"Navimarine","model":"NAVI 009-COL 6","reference":"NAVI-009-COL6","year":2024,"condition":"New","price":90,"currency":"EUR","image":"/images/watches/navimarine-navi-009-col6.jpg","sold":false,"description_en":"A vibrant sport marine watch with a colourful dial and durable stainless steel case. Reliable quartz movement, date window, and a comfortable strap — bold style for everyday adventures."},
      {"id":"watch-12","brand":"Navimarine","model":"NVM141-A1","reference":"NVM141-A1","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nvm141-a1.jpg","sold":false,"description_en":"A sleek marine watch with a refined dial and lightweight stainless steel case. Reliable quartz movement, date window, and a supple strap — effortless style for sea and everyday wear."},
      {"id":"watch-13","brand":"Navimarine","model":"NM181-03","reference":"NM181-03","year":2024,"condition":"New","price":65,"currency":"EUR","image":"/images/watches/navimarine-nm181-03.jpg","sold":false,"description_en":"A refined marine watch with a clean dial and solid stainless steel case. Reliable quartz movement, date window, and a comfortable strap — quiet confidence for every occasion."},
      {"id":"watch-14","brand":"Navimarine","model":"NT0029-2","reference":"NT0029-2","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-nt0029-2.jpg","sold":false,"description_en":"A bold sport watch with a striking dial and robust stainless steel case. Reliable quartz movement, date window, and a sturdy strap — strong character for active everyday wear."},
      {"id":"watch-15","brand":"Navimarine","model":"NM282-04","reference":"NM282-04","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nm282-04.jpg","sold":false,"description_en":"A classic marine watch with a well-balanced dial and reliable stainless steel case. Precise quartz movement, date window, and a comfortable strap — timeless style that fits any wrist and any occasion."},
      {"id":"watch-16","brand":"Navimarine","model":"NVM112-B4","reference":"NVM112-B4","year":2024,"condition":"New","price":65,"currency":"EUR","image":"/images/watches/navimarine-nvm112-b4.jpg","sold":false,"description_en":"A sharp marine watch with a distinctive dial design and sturdy stainless steel case. Reliable quartz movement, date window, and a comfortable strap — a confident choice for sea and city alike."},
      {"id":"watch-17","brand":"Navimarine","model":"NAVI 009-COL 1","reference":"NAVI-009-COL1","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-navi-009-col1.jpg","sold":false,"description_en":"A vibrant marine watch from the NAVI 009 collection with a bold colourful dial and solid stainless steel case. Reliable quartz movement, date window, and a comfortable strap — made to stand out on land and at sea."},
      {"id":"watch-18","brand":"Navimarine","model":"NM001101-color06","reference":"NM001101-COL06","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nm001101-col06.jpg","sold":false,"description_en":"A lively marine watch with a colourful dial and dependable stainless steel case. Reliable quartz movement, date window, and a flexible strap — casual style with a maritime spirit."},
      {"id":"watch-19","brand":"Navimarine","model":"NT0031-1","reference":"NT0031-1","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-nt0031-1.jpg","sold":false,"description_en":"A robust sport marine watch with a bold dial and solid stainless steel case. Reliable quartz movement, date window, and a durable strap — built for those who wear their watches hard."},
      {"id":"watch-20","brand":"Navimarine","model":"NM001404-Color04","reference":"NM001404-COL04","year":2024,"condition":"New","price":70,"currency":"EUR","image":"/images/watches/navimarine-nm001404-col04.jpg","sold":false,"description_en":"A eye-catching marine watch with a colourful dial and solid stainless steel case. Reliable quartz movement, date window, and a comfortable strap — expressive style for everyday adventures."}
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
  