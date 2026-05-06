(function(){
  var btt = document.getElementById('backToTop');
  if(btt){
    window.addEventListener('scroll', function(){ btt.classList.toggle('show', window.scrollY > 400); }, {passive:true});
    btt.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  }
  var fy = document.getElementById('footerYear');
  if(fy) fy.textContent = new Date().getFullYear();

  var params = new URLSearchParams(window.location.search);
  var watchId = params.get('id');

  if(!watchId){
    showError('Nessun orologio specificato.', 'Torna al negozio per sfogliare tutti gli orologi disponibili.');
    return;
  }

  fetch('https://raw.githubusercontent.com/acetodiavolo-ops/mina.github.io/main/watches.json?v=2')
    .then(function(r){ return r.json(); })
    .then(function(watches){
      var w = watches.find(function(x){ return x.id === watchId; });
      if(!w){ showError('Orologio non trovato.', 'Questo orologio potrebbe essere stato venduto o rimosso. Sfoglia il negozio per vedere i disponibili.'); return; }
      render(w);
    })
    .catch(function(){ showError("Impossibile caricare i dati dell'orologio.", 'Ricarica la pagina o torna al negozio.'); });

  var EUR_TO_LEK = 97;
  function fmt(price, currency){
    if(!price) return 'Prezzo su richiesta';
    return (currency === 'EUR' ? '\u20ac' : currency) + Number(price).toLocaleString('it-IT');
  }
  function lekPrice(price, currency){
    if(!price || currency !== 'EUR') return 0;
    return Math.round(price * EUR_TO_LEK / 100) * 100;
  }

  function waMsg(w){
    var msg = "Salve, sono interessato all'orologio " + w.brand + ' ' + w.model + ' (Rif. ' + (w.reference||'N/A') + ') \u2014 potete confermare se \u00e8 ancora disponibile?';
    return 'https://api.whatsapp.com/send?phone=355676360510&text=' + encodeURIComponent(msg);
  }

  function render(w){
    var title = w.brand + ' ' + w.model + ' \u2014 Iglisi Watch';
    var desc = (w.description_it || w.description_en || '') + ' Disponibile da Iglisi Watch, Durazzo, Albania.';
    var imgUrl = w.image ? 'https://watch.al' + w.image : 'https://watch.al/og-image.png';
    var pageUrl = 'https://watch.al/it/shop/watch.html?id=' + w.id;
    var enUrl  = 'https://watch.al/en/shop/watch.html?id=' + w.id;
    var sqUrl  = 'https://watch.al/sq/shop/watch.html?id=' + w.id;

    document.getElementById('page-title').textContent = title;
    document.getElementById('page-desc').setAttribute('content', desc);
    document.getElementById('og-title').setAttribute('content', title);
    document.getElementById('og-desc').setAttribute('content', desc);
    document.getElementById('og-image').setAttribute('content', imgUrl);
    document.getElementById('og-url').setAttribute('content', pageUrl);
    document.getElementById('canonical').setAttribute('href', pageUrl);
    document.getElementById('hreflang-it').setAttribute('href', pageUrl);
    document.getElementById('hreflang-en').setAttribute('href', enUrl);
    document.getElementById('hreflang-sq').setAttribute('href', sqUrl);
    document.getElementById('hreflang-xd').setAttribute('href', enUrl);

    var lt = document.querySelector('.lang-toggle');
    if(lt) lt.href = '/en/shop/watch.html?id=' + w.id;

    var ld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': w.brand + ' ' + w.model,
      'sku': w.reference || '',
      'brand': {'@type': 'Brand', 'name': w.brand},
      'description': w.description_it || w.description_en || '',
      'image': imgUrl,
      'offers': {
        '@type': 'Offer',
        'priceCurrency': w.currency,
        'price': String(w.price),
        'priceSpecification': [
          {'@type': 'PriceSpecification', 'price': String(w.price), 'priceCurrency': w.currency},
          {'@type': 'PriceSpecification', 'price': String(lekPrice(w.price, w.currency)), 'priceCurrency': 'ALL'}
        ],
        'availability': w.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        'itemCondition': w.condition === 'Pre-owned' ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
        'seller': {'@type': 'Organization', 'name': 'Iglisi Watch'},
        'url': pageUrl
      }
    };
    document.getElementById('ld-json').textContent = JSON.stringify(ld);

    var imgHtml = w.image ? '<img src="' + w.image + '" alt="' + w.brand + ' ' + w.model + '" fetchpriority="high">' : '';
    var condIt = w.condition === 'New' ? 'Nuovo' : 'Usato';
    var ctaBlock = w.sold
      ? '<p style="font-size:1rem;color:#888;font-weight:600">Questo orologio \u00e8 stato venduto.</p>'
      : '<div class="watch-cta-wrap">'
        + '<a href="' + waMsg(w) + '" target="_blank" rel="noopener noreferrer" class="watch-cta-main" data-fb-contact="1" aria-label="Richiedi via WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Richiedi via WhatsApp</a>'
        + '<a href="https://instagram.com/iglisiwatch" target="_blank" rel="noopener noreferrer" class="watch-ig" aria-label="Vedi il nostro Instagram"><i class="fab fa-instagram" aria-hidden="true"></i> Instagram</a>'
        + '</div>';

    document.getElementById('watch-content').className = 'watch-page';
    document.getElementById('watch-content').innerHTML =
      '<div class="watch-img-wrap">'
        + imgHtml
        + '<span class="watch-badge-pg">' + (w.sold ? 'Venduto' : condIt) + '</span>'
      + '</div>'
      + '<div class="watch-info">'
        + '<a href="/it/shop/" class="back-link"><i class="fas fa-arrow-left" aria-hidden="true"></i> Torna al negozio</a>'
        + '<div>'
          + '<p class="watch-brand-pg">' + w.brand + '</p>'
          + '<h1 class="watch-title-pg">' + w.model + '</h1>'
          + '<p class="watch-ref-pg">Rif. ' + (w.reference||'\u2014') + '</p>'
        + '</div>'
        + '<p class="watch-price-pg">' + fmt(w.price, w.currency) + (lekPrice(w.price,w.currency) ? '<span style="font-size:1.1rem;color:#888;font-weight:500;margin-left:.5rem">· ' + lekPrice(w.price,w.currency).toLocaleString() + ' L</span>' : '') + '</p>'
        + '<p class="watch-desc-pg">' + (w.description_it || w.description_en || '') + '</p>'
        + ctaBlock
        + '<div class="trust-row">'
          + '<span class="trust-item" style="color:#1a7a3f;font-weight:600"><i class="fas fa-money-bill" aria-hidden="true" style="color:#1a7a3f"></i> Pagamento alla consegna</span>'
          + '<span class="trust-item"><i class="fas fa-shield-alt" aria-hidden="true"></i> Garanzia 1 anno</span>'
          + '<span class="trust-item"><i class="fas fa-star" aria-hidden="true"></i> Nuovo &amp; originale</span>'
          + '<span class="trust-item"><i class="fas fa-clock" aria-hidden="true"></i> Lun\u2013Sab 8:30\u201320:30</span>'
        + '</div>'
      + '</div>';
  }

  function showError(heading, body){
    document.getElementById('watch-content').className = 'error-state';
    document.getElementById('watch-content').innerHTML =
      '<h2>' + heading + '</h2>'
      + '<p>' + body + '</p>'
      + '<a href="/it/shop/" style="display:inline-block;margin-top:1.5rem;background:#06153b;color:#fff;padding:.7rem 1.8rem;border-radius:9999px;font-weight:700;text-decoration:none">Sfoglia il Negozio</a>';
  }
})();
