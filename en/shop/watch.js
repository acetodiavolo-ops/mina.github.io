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
    showError('No watch specified.', 'Go back to the shop to browse all available watches.');
    return;
  }

  fetch('/watches.json')
    .then(function(r){ return r.json(); })
    .then(function(watches){
      var w = watches.find(function(x){ return x.id === watchId; });
      if(!w){ showError('Watch not found.', "This watch may have been sold or removed. Browse the shop for what's available."); return; }
      render(w);
    })
    .catch(function(){ showError('Could not load watch data.', 'Please refresh or return to the shop.'); });

  function fmt(price, currency){
    if(!price) return 'Price on request';
    return (currency === 'EUR' ? '\u20ac' : currency) + Number(price).toLocaleString('en-EU');
  }

  function waMsg(w){
    var msg = "Hi, I\u2019m interested in the " + w.brand + ' ' + w.model + ' (Ref. ' + (w.reference||'N/A') + ') \u2014 can you confirm if it\u2019s still available?';
    return 'https://api.whatsapp.com/send?phone=355676360510&text=' + encodeURIComponent(msg);
  }

  function render(w){
    var title = w.brand + ' ' + w.model + ' \u2014 Iglisi Watch';
    var desc = (w.description_en || '') + ' Available at Iglisi Watch, Durr\u00ebs, Albania.';
    var imgUrl = w.image ? 'https://watch.al' + w.image : 'https://watch.al/og-image.png';
    var pageUrl = 'https://watch.al/en/shop/watch.html?id=' + w.id;
    var sqUrl = 'https://watch.al/sq/shop/watch.html?id=' + w.id;

    document.getElementById('page-title').textContent = title;
    document.getElementById('page-desc').setAttribute('content', desc);
    document.getElementById('og-title').setAttribute('content', title);
    document.getElementById('og-desc').setAttribute('content', desc);
    document.getElementById('og-image').setAttribute('content', imgUrl);
    document.getElementById('og-url').setAttribute('content', pageUrl);
    document.getElementById('canonical').setAttribute('href', pageUrl);
    var itUrl = 'https://watch.al/it/shop/watch.html?id=' + w.id;
    document.getElementById('hreflang-en').setAttribute('href', pageUrl);
    document.getElementById('hreflang-sq').setAttribute('href', sqUrl);
    document.getElementById('hreflang-it').setAttribute('href', itUrl);
    document.getElementById('hreflang-xd').setAttribute('href', pageUrl);

    var lt = document.querySelector('.lang-toggle');
    if(lt) lt.href = '/sq/shop/watch.html?id=' + w.id;

    var ld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': w.brand + ' ' + w.model,
      'sku': w.reference || '',
      'brand': {'@type': 'Brand', 'name': w.brand},
      'description': w.description_en || '',
      'image': imgUrl,
      'offers': {
        '@type': 'Offer',
        'priceCurrency': w.currency,
        'price': String(w.price),
        'availability': w.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        'itemCondition': w.condition === 'Pre-owned' ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
        'seller': {'@type': 'Organization', 'name': 'Iglisi Watch'},
        'url': pageUrl
      }
    };
    document.getElementById('ld-json').textContent = JSON.stringify(ld);

    var imgHtml = w.image ? '<img src="' + w.image + '" alt="' + w.brand + ' ' + w.model + '" fetchpriority="high">' : '';
    var ctaBlock = w.sold
      ? '<p style="font-size:1rem;color:#888;font-weight:600">This watch has been sold.</p>'
      : '<div class="watch-cta-wrap">'
        + '<a href="' + waMsg(w) + '" target="_blank" rel="noopener noreferrer" class="watch-cta-main" data-fb-contact="1" aria-label="Enquire via WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Enquire via WhatsApp</a>'
        + '<a href="https://instagram.com/iglisiwatch" target="_blank" rel="noopener noreferrer" class="watch-ig" aria-label="See our Instagram"><i class="fab fa-instagram" aria-hidden="true"></i> Instagram</a>'
        + '</div>';

    document.getElementById('watch-content').className = 'watch-page';
    document.getElementById('watch-content').innerHTML =
      '<div class="watch-img-wrap">'
        + imgHtml
        + '<span class="watch-badge-pg">' + (w.sold ? 'Sold' : w.condition) + '</span>'
      + '</div>'
      + '<div class="watch-info">'
        + '<a href="/en/shop/" class="back-link"><i class="fas fa-arrow-left" aria-hidden="true"></i> Back to shop</a>'
        + '<div>'
          + '<p class="watch-brand-pg">' + w.brand + '</p>'
          + '<h1 class="watch-title-pg">' + w.model + '</h1>'
          + '<p class="watch-ref-pg">Ref. ' + (w.reference||'\u2014') + ' &middot; ' + w.year + '</p>'
        + '</div>'
        + '<p class="watch-price-pg">' + fmt(w.price, w.currency) + '</p>'
        + '<p class="watch-desc-pg">' + (w.description_en || '') + '</p>'
        + ctaBlock
        + '<div class="trust-row">'
          + '<span class="trust-item"><i class="fas fa-shield-alt" aria-hidden="true"></i> 1-year guarantee</span>'
          + '<span class="trust-item"><i class="fas fa-star" aria-hidden="true"></i> Brand new &amp; genuine</span>'
          + '<span class="trust-item"><i class="fas fa-clock" aria-hidden="true"></i> Mon\u2013Sat 8:30\u201320:30</span>'
        + '</div>'
      + '</div>';
  }

  function showError(heading, body){
    document.getElementById('watch-content').className = 'error-state';
    document.getElementById('watch-content').innerHTML =
      '<h2>' + heading + '</h2>'
      + '<p>' + body + '</p>'
      + '<a href="/en/shop/" style="display:inline-block;margin-top:1.5rem;background:#06153b;color:#fff;padding:.7rem 1.8rem;border-radius:9999px;font-weight:700;text-decoration:none">Browse the Shop</a>';
  }
})();
