  (function(){
    var btn = document.getElementById('backToTop');
    window.addEventListener('scroll', function(){ btn.classList.toggle('visible', window.scrollY > 300); }, {passive:true});
    btn.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });
    document.getElementById('footerYear').textContent = new Date().getFullYear();

    // Inline watch data — no fetch needed
    var WATCHES = [
      {"id":"watch-1","brand":"Hislon","model":"Classic","reference":"CL213S-02SS","year":2024,"condition":"New","price":199,"currency":"EUR","image":"/images/watches/hislon-cl213s-02ss.jpg","sold":false,"description_it":"Eleganza sobria in acciaio inossidabile. Lunetta zigrinata, quadrante argentato a righe orizzontali, cristallo zaffiro e finestrella data. Un orologio da giorno affidabile."},
      {"id":"watch-2","brand":"Hislon","model":"Classic Queen","reference":"QL145T-09SG","year":2024,"condition":"New","price":189,"currency":"EUR","image":"/images/watches/hislon-ql145t-09sg.jpg","sold":false,"description_it":"Orologio da donna raffinato con cassa e bracciale in oro rosa. Profilo sottile, quadrante elegante e movimento al quarzo affidabile."},
      {"id":"watch-3","brand":"Hislon","model":"Classic","reference":"CL213G-02SG","year":2024,"condition":"New","price":189,"currency":"EUR","image":"/images/watches/hislon-cl213g-02sg.jpg","sold":false,"description_it":"Il Classic in acciaio inossidabile total gold. Lunetta zigrinata, quadrante argentato a righe, lancette e indici dorati, cristallo zaffiro e finestrella data."},
      {"id":"watch-4","brand":"Hislon","model":"Masterwork","reference":"MS201S-04SS","year":2024,"condition":"New","price":184,"currency":"USD","image":"/images/watches/hislon-ms201s-04ss.jpg","sold":false,"description_it":"Cronografo sport-chic audace con quadrante nero, cristallo zaffiro e bracciale in acciaio. Tre sotto-quadranti, dettagli rossi e finestrella data — precisione con carattere."},
      {"id":"watch-5","brand":"Hislon","model":"Classic Queen","reference":"QL113G-09SG","year":2024,"condition":"New","price":169,"currency":"EUR","image":"/images/watches/hislon-ql113g-09sg.jpg","sold":false,"description_it":"Orologio da donna classico in acciaio dorato con quadrante madreperla, indici con cristalli, cristallo zaffiro, lancette blu e finestrella data. Femminilità senza tempo."},
      {"id":"watch-6","brand":"Hislon","model":"Women Classic Queen","reference":"QL113-09SS","year":2024,"condition":"New","price":149,"currency":"EUR","image":"/images/watches/hislon-ql113g-09ss.jpg?v=3","sold":false,"description_it":"La Women Classic Queen in acciaio inossidabile con quadrante madreperla, indici con cristalli, cristallo zaffiro, lancette blu e finestrella data. Eleganza sobria per ogni giorno."},
      {"id":"watch-7","brand":"Navimarine","model":"NM268-06","reference":"NM268-06","year":2024,"condition":"New","price":80,"currency":"EUR","image":"/images/watches/navimarine-nm268-06.png","sold":false,"description_it":"Un orologio marino dallo stile sportivo con quadrante pulito e cassa robusta in acciaio inossidabile. Movimento al quarzo affidabile, finestrella data e cinturino versatile — pronto per il mare e la citta."},
      {"id":"watch-8","brand":"Hislon","model":"Classic","reference":"CL214S-04SS","year":2024,"condition":"New","price":199,"currency":"EUR","image":"/images/watches/hislon-cl214s-04ss.jpg","sold":false,"description_it":"Il Classic CL214S-04SS in acciaio inossidabile bicolore — cassa argentata con dettagli dorati. Lunetta zigrinata, quadrante argentato con lancette e indici dorati, cristallo zaffiro e finestrella data. Eleganza senza tempo."},
      {"id":"watch-9","brand":"Navimarine","model":"NMM1011","reference":"NMM1011","year":2024,"condition":"New","price":55,"currency":"USD","image":"/images/watches/navimarine-nmm1011.jpg","sold":false,"description_it":"Un orologio marino deciso con quadrante multistrato dal carattere forte e cassa robusta in acciaio inossidabile. Movimento al quarzo affidabile, lancette luminose e cinturino resistente — fatto per l'avventura in mare e in citta."},
      {"id":"watch-10","brand":"Navimarine","model":"NM232-04","reference":"NM232-04","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nm232-04.jpg","sold":false,"description_it":"Un orologio marino dallo stile sportivo e pulito con quadrante nitido e cassa solida in acciaio inossidabile. Movimento al quarzo affidabile, finestrella data e cinturino comodo — stile sobrio per ogni giorno."},
      {"id":"watch-11","brand":"Navimarine","model":"NAVI 009-COL 6","reference":"NAVI-009-COL6","year":2024,"condition":"New","price":90,"currency":"EUR","image":"/images/watches/navimarine-navi-009-col6.jpg","sold":false,"description_it":"Un orologio marino sportivo con quadrante colorato e cassa resistente in acciaio inossidabile. Movimento al quarzo affidabile, finestrella data e cinturino comodo — stile deciso per le avventure di tutti i giorni."},
      {"id":"watch-12","brand":"Navimarine","model":"NVM141-A1","reference":"NVM141-A1","year":2024,"condition":"New","price":60,"currency":"EUR","image":"/images/watches/navimarine-nvm141-a1.jpg","sold":false,"description_it":"Un orologio marino elegante con quadrante curato e cassa leggera in acciaio inossidabile. Movimento al quarzo affidabile, finestrella data e cinturino morbido — stile senza sforzo per il mare e il quotidiano."}
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

    var condMap = {'Excellent':'Eccellente','Very Good':'Ottimo','Good':'Buono'};

    function renderWatches(watches, filter, search){
      var filtered = filter === 'all' ? watches : watches.filter(function(w){ return w.condition === filter; });
      if(search){
        filtered = filtered.filter(function(w){
          return (w.model + ' ' + w.brand + ' ' + w.reference).toLowerCase().includes(search);
        });
      }
      document.getElementById('shopCount').textContent = filtered.length + ' orologio/i disponibil' + (filtered.length === 1 ? 'e' : 'i');
      if(!filtered.length){
        document.getElementById('shopGrid').innerHTML = '<p class="no-watches">Nessun orologio corrisponde a questo filtro al momento. Torna presto!</p>';
        return;
      }
      document.getElementById('shopGrid').innerHTML = filtered.map(watchCard).join('');
    }

    function fmt(price, currency){
      if(!price) return 'Prezzo su richiesta';
      return (currency === 'EUR' ? '€' : currency) + Number(price).toLocaleString('it-IT');
    }

    function waMsg(w){
      var msg = 'Salve, sono interessato all\'orologio ' + w.brand + ' ' + w.model + ' (Rif. ' + w.reference + ') sul vostro sito.';
      return 'https://api.whatsapp.com/send?phone=355676360510&text=' + encodeURIComponent(msg);
    }

    function watchCard(w){
      var imgHtml = w.image
        ? '<img src="' + w.image + '" alt="' + w.brand + ' ' + w.model + '" loading="lazy">'
        : '<div class="watch-img-placeholder"><i class="fas fa-clock" aria-hidden="true"></i></div>';
      var soldOverlay = w.sold ? '<div class="sold-overlay">Venduto</div>' : '';
      var cond = condMap[w.condition] || w.condition;
      var ctaHtml = w.sold
        ? '<span style="font-size:.82rem;color:#888">Venduto</span>'
        : '<a href="' + waMsg(w) + '" target="_blank" rel="noopener noreferrer" class="watch-cta" aria-label="Richiedi info su ' + w.brand + ' ' + w.model + ' via WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Richiedi Info</a>';
      return '<article class="watch-card' + (w.sold?' sold-card':'') + '">'
        + '<div class="watch-card-img">' + imgHtml + soldOverlay
        + '<span class="watch-badge">' + cond + '</span></div>'
        + '<div class="watch-card-body">'
        + '<p class="watch-brand">' + w.brand + '</p>'
        + '<h2 class="watch-model">' + w.model + '</h2>'
        + '<p class="watch-ref">Rif. ' + w.reference + ' &middot; ' + w.year + '</p>'
        + '<p class="watch-desc">' + (w.description_it || '') + '</p>'
        + '<div class="watch-card-footer">'
        + '<p class="watch-price">' + fmt(w.price, w.currency) + '</p>'
        + ctaHtml
        + '</div></div></article>';
    }
  })();
  