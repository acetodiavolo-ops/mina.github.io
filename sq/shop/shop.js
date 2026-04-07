  (function(){
    var btn = document.getElementById('backToTop');
    window.addEventListener('scroll', function(){ btn.classList.toggle('visible', window.scrollY > 300); }, {passive:true});
    btn.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });
    document.getElementById('footerYear').textContent = new Date().getFullYear();

    // Inline watch data — no fetch needed
    var WATCHES = [
      {"id":"watch-1","brand":"Hislon","model":"Classic","reference":"CL213S-02SS","year":2024,"condition":"New","price":199,"currency":"EUR","image":"/images/watches/hislon-cl213s-02ss.jpg","sold":false,"description_sq":"Elegancë e thjeshtë në çelik inox. Bezel i gdhendur, cadran argjendi me vija horizontale, xham safiri dhe dritare date. Orë e besueshme për çdo ditë."},
      {"id":"watch-2","brand":"Hislon","model":"Classic Queen","reference":"QL145T-09SG","year":2024,"condition":"New","price":189,"currency":"EUR","image":"/images/watches/hislon-ql145t-09sg.jpg","sold":false,"description_sq":"Orë elegante për femra me kasë dhe byzylyk në ngjyrë ari rozë. Profil i hollë, cadran elegant dhe lëvizje kuarci e besueshme."},
      {"id":"watch-3","brand":"Hislon","model":"Classic","reference":"CL213G-02SG","year":2024,"condition":"New","price":189,"currency":"EUR","image":"/images/watches/hislon-cl213g-02sg.jpg","sold":false,"description_sq":"Classic-u në çelik inox total gold. Bezel i gdhendur, cadran argjendi me vija, tregues dhe akrepë të artë, xham safiri dhe dritare date."},
      {"id":"watch-4","brand":"Hislon","model":"Masterwork","reference":"MS201S-04SS","year":2024,"condition":"New","price":184,"currency":"USD","image":"/images/watches/hislon-ms201s-04ss.jpg","sold":false,"description_sq":"Kronograf sport me cadran të zi, xham safiri dhe byzylyk çeliku. Tre nën-cadranë, detaje të kuqe dhe dritare date — precizion me karakter."},
      {"id":"watch-5","brand":"Hislon","model":"Classic Queen","reference":"QL113G-09SG","year":2024,"condition":"New","price":169,"currency":"EUR","image":"/images/watches/hislon-ql113g-09sg.jpg","sold":false,"description_sq":"Orë klasike për femra në çelik të artë me cadran sedef, tregues me kristale, xham safiri, akrepë blu dhe dritare date. Femërorësi pa kohë."},
      {"id":"watch-6","brand":"Hislon","model":"Women Classic Queen","reference":"QL113-09SS","year":2024,"condition":"New","price":149,"currency":"EUR","image":"/images/watches/hislon-ql113g-09ss.jpg?v=3","sold":false,"description_sq":"Women Classic Queen në çelik inox me cadran sedef, tregues me kristale, xham safiri, akrepë blu dhe dritare date. Elegancë e thjeshtë për çdo ditë."},
      {"id":"watch-7","brand":"Navimarine","model":"NM268-06","reference":"NM268-06","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-nm268-06.jpg","sold":false,"description_sq":"Ore marine me stil sportiv, cadran te paster dhe kase te forte celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i gjithanshme — gati per det dhe qytet."},
      {"id":"watch-8","brand":"Hislon","model":"Classic","reference":"CL214S-04SS","year":2024,"condition":"New","price":199,"currency":"EUR","image":"/images/watches/hislon-cl214s-04ss.jpg","sold":false,"description_sq":"Classic CL214S-04SS ne celiku inox dy-tone — kase argjendi me detaje te arta. Bezel i gdhendur, cadran argjendi me akrape dhe tregues te arte, xham safiri dhe dritare date. Elegance klasike ne kulmin e saj."},
      {"id":"watch-9","brand":"Navimarine","model":"NMM1011","reference":"NMM1011","year":2024,"condition":"New","price":55,"currency":"USD","image":"/images/watches/navimarine-nmm1011.jpg","sold":false,"description_sq":"Ore marine me cadran shume-shtresor me karakter te forte dhe kase te forte celiku inox. Levizje kuarci e besueshme, akrape ndriçuese dhe rrip i qendrueshem — krijuar per aventura ne det dhe ne qytet."},
      {"id":"watch-10","brand":"Navimarine","model":"NM232-04","reference":"NM232-04","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nm232-04.jpg","sold":false,"description_sq":"Ore marine me stil sportiv dhe te paster, cadran te qarte dhe kase te forte celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i rehatshme — elegance e qete per cdo dite."},
      {"id":"watch-11","brand":"Navimarine","model":"NAVI 009-COL 6","reference":"NAVI-009-COL6","year":2024,"condition":"New","price":90,"currency":"EUR","image":"/images/watches/navimarine-navi-009-col6.jpg","sold":false,"description_sq":"Ore marine sportive me cadran me ngjyra dhe kase te qendrueshem celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i rehatshme — stil i guximshem per aventurat e perditshme."},
      {"id":"watch-12","brand":"Navimarine","model":"NVM141-A1","reference":"NVM141-A1","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nvm141-a1.jpg","sold":false,"description_sq":"Ore marine elegante me cadran te rafinuar dhe kase te lehte celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i bute — stil pa mundim per detin dhe perditshmerin."},
      {"id":"watch-13","brand":"Navimarine","model":"NM181-03","reference":"NM181-03","year":2024,"condition":"New","price":65,"currency":"EUR","image":"/images/watches/navimarine-nm181-03.jpg","sold":false,"description_sq":"Ore marine e rafinuar me cadran te paster dhe kase te forte celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i rehatshme — elegance e qete per cdo rast."},
      {"id":"watch-14","brand":"Navimarine","model":"NT0029-2","reference":"NT0029-2","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-nt0029-2.jpg","sold":false,"description_sq":"Ore sportive me cadran te fuqishem dhe kase te forte celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i forte — karakter i gjalle per cdo dite aktive."},
      {"id":"watch-15","brand":"Navimarine","model":"NM282-04","reference":"NM282-04","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nm282-04.jpg","sold":false,"description_sq":"Ore marine klasike me cadran te balancuar dhe kase te besueshme celiku inox. Levizje kuarci precize, dritare date dhe rrip i rehatshme — stil i perjeteshem per cdo dore dhe cdo rast."},
      {"id":"watch-16","brand":"Navimarine","model":"NVM112-B4","reference":"NVM112-B4","year":2024,"condition":"New","price":65,"currency":"EUR","image":"/images/watches/navimarine-nvm112-b4.jpg","sold":false,"description_sq":"Ore marine me dizajn te vecante dhe kase te forte celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i rehatshme — zgjedhje e sigurt per detin dhe qytetin."},
      {"id":"watch-17","brand":"Navimarine","model":"NAVI 009-COL 1","reference":"NAVI-009-COL1","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-navi-009-col1.jpg","sold":false,"description_sq":"Ore marine e gjalle nga koleksioni NAVI 009 me cadran me ngjyra dhe kase te forte celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i rehatshme — krijuar per t'u dalluar ne toke dhe ne det."},
      {"id":"watch-18","brand":"Navimarine","model":"NM001101-color06","reference":"NM001101-COL06","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nm001101-col06.jpg","sold":false,"description_sq":"Ore marine e gjalle me cadran me ngjyra dhe kase te besueshme celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip fleksibel — stil i lire me fryme detare."},
      {"id":"watch-19","brand":"Navimarine","model":"NT0031-1","reference":"NT0031-1","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-nt0031-1.jpg","sold":false,"description_sq":"Ore marine sportive dhe e forte me cadran te fuqishem dhe kase te forte celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i qendrueshem — bere per ata qe e veshin oren pa kursim."},
      {"id":"watch-20","brand":"Navimarine","model":"NM001404-Color04","reference":"NM001404-COL04","year":2024,"condition":"New","price":70,"currency":"EUR","image":"/images/watches/navimarine-nm001404-col04.jpg","sold":false,"description_sq":"Ore marine me cadran me ngjyra dhe kase te forte celiku inox. Levizje kuarci e besueshme, dritare date dhe rrip i rehatshme — stil shprehes per aventurat e perditshme."}
    ];

    var currentFilter = 'all';
    var currentSearch = '';
    renderWatches(WATCHES, 'all', '');

    document.querySelectorAll('.filter-chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        document.querySelectorAll('.filter-chip').forEach(function(c){ c.classList.remove('active'); });
        chip.classList.add('active');
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

    var condMap = {'Excellent':'Shkëlqyer','Very Good':'Shumë Mirë','Good':'Mirë'};

    function renderWatches(watches, filter, search){
      var filtered = filter === 'all' ? watches : watches.filter(function(w){ return w.condition === filter; });
      if(search){
        filtered = filtered.filter(function(w){
          return (w.model + ' ' + w.brand + ' ' + w.reference).toLowerCase().includes(search);
        });
      }
      document.getElementById('shopCount').textContent = filtered.length + ' orë e disponueshme';
      if(!filtered.length){
        document.getElementById('shopGrid').innerHTML = '<p class="no-watches">Asnjë orë nuk përputhet me këtë filtër tani. Kthehuni së shpejti!</p>';
        return;
      }
      document.getElementById('shopGrid').innerHTML = filtered.map(watchCard).join('');
    }

    function fmt(price, currency){
      if(!price) return 'Çmimi me kërkesë';
      return (currency === 'EUR' ? '€' : currency) + Number(price).toLocaleString('sq-AL');
    }

    function waMsg(w){
      var msg = 'Pershendetje, jam i interesuar per oren ' + w.brand + ' ' + w.model + ' (Ref. ' + w.reference + ') ne faqen tuaj.';
      return 'https://api.whatsapp.com/send?phone=355676360510&text=' + encodeURIComponent(msg);
    }

    function watchCard(w){
      var imgHtml = w.image
        ? '<img src="' + w.image + '" alt="' + w.brand + ' ' + w.model + '" loading="lazy">'
        : '<div class="watch-img-placeholder"><i class="fas fa-clock" aria-hidden="true"></i></div>';
      var soldOverlay = w.sold ? '<div class="sold-overlay">Shitur</div>' : '';
      var cond = condMap[w.condition] || w.condition;
      var ctaHtml = w.sold
        ? '<span style="font-size:.82rem;color:#888">Shitur</span>'
        : '<a href="' + waMsg(w) + '" target="_blank" rel="noopener noreferrer" class="watch-cta" aria-label="Pyesni per ' + w.brand + ' ' + w.model + ' ne WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Pyesni</a>';
      return '<article class="watch-card' + (w.sold?' sold-card':'') + '">'
        + '<div class="watch-card-img">' + imgHtml + soldOverlay
        + '<span class="watch-badge">' + cond + '</span></div>'
        + '<div class="watch-card-body">'
        + '<p class="watch-brand">' + w.brand + '</p>'
        + '<h2 class="watch-model">' + w.model + '</h2>'
        + '<p class="watch-ref">Ref. ' + w.reference + ' &middot; ' + w.year + '</p>'
        + '<p class="watch-desc">' + (w.description_sq || '') + '</p>'
        + '<div class="watch-card-footer">'
        + '<p class="watch-price">' + fmt(w.price, w.currency) + '</p>'
        + ctaHtml
        + '</div></div></article>';
    }
  })();
  