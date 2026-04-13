(function(){
  var btt = document.getElementById('backToTop');
  if(btt){
    window.addEventListener('scroll', function(){ btt.classList.toggle('visible', window.scrollY > 300); }, {passive:true});
    btt.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  }
  var fy = document.getElementById('footerYear');
  if(fy) fy.textContent = new Date().getFullYear();

  var params = new URLSearchParams(window.location.search);
  var watchId = params.get('id');

  if(!watchId){
    showError('Nuk \u00ebsht\u00eb specifikuar asnji\u00eb or\u00eb.', 'Kthehuni n\u00eb dyqan p\u00ebr t\u00eb shfletuar t\u00eb gjitha or\u00ebt.');
    return;
  }

  fetch('/watches.json')
    .then(function(r){ return r.json(); })
    .then(function(watches){
      var w = watches.find(function(x){ return x.id === watchId; });
      if(!w){ showError('Ora nuk u gjet.', 'Kjo or\u00eb mund t\u00eb jet\u00eb shitur ose hequr. Shfletoni dyqanin p\u00ebr ato t\u00eb disponueshme.'); return; }
      render(w);
    })
    .catch(function(){ showError('Nuk mund t\u00eb ngarkohet e dhena e or\u00ebs.', 'Ju lutem rifreskoni ose kthehuni n\u00eb dyqan.'); });

  function fmt(price, currency){
    if(!price) return '\u00c7mimi me k\u00ebrkese';
    return (currency === 'EUR' ? '\u20ac' : currency) + Number(price).toLocaleString('sq-AL');
  }

  function waMsg(w){
    var msg = 'Pershendetje, jam i interesuar per oren ' + w.brand + ' ' + w.model + ' (Ref. ' + (w.reference||'N/A') + ') - a mund te konfirmoni nese \u00ebsht\u00eb ende e disponueshme?';
    return 'https://api.whatsapp.com/send?phone=355676360510&text=' + encodeURIComponent(msg);
  }

  function render(w){
    var title = w.brand + ' ' + w.model + ' \u2014 Iglisi Watch';
    var desc = (w.description_sq || w.description_en || '') + ' E disponueshme tek Iglisi Watch, Durr\u00ebs, Shqip\u00ebri.';
    var imgUrl = w.image ? 'https://watch.al' + w.image : 'https://watch.al/og-image.png';
    var pageUrl = 'https://watch.al/sq/shop/watch.html?id=' + w.id;
    var enUrl = 'https://watch.al/en/shop/watch.html?id=' + w.id;

    document.getElementById('page-title').textContent = title;
    document.getElementById('page-desc').setAttribute('content', desc);
    document.getElementById('og-title').setAttribute('content', title);
    document.getElementById('og-desc').setAttribute('content', desc);
    document.getElementById('og-image').setAttribute('content', imgUrl);
    document.getElementById('og-url').setAttribute('content', pageUrl);
    document.getElementById('canonical').setAttribute('href', pageUrl);
    document.getElementById('hreflang-sq').setAttribute('href', pageUrl);
    document.getElementById('hreflang-en').setAttribute('href', enUrl);
    document.getElementById('hreflang-xd').setAttribute('href', enUrl);

    var lt = document.querySelector('.lang-toggle');
    if(lt) lt.href = '/en/shop/watch.html?id=' + w.id;

    var ld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': w.brand + ' ' + w.model,
      'sku': w.reference || '',
      'brand': {'@type': 'Brand', 'name': w.brand},
      'description': w.description_sq || w.description_en || '',
      'image': imgUrl,
      'offers': {
        '@type': 'Offer',
        'priceCurrency': w.currency,
        'price': String(w.price),
        'availability': w.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        'itemCondition': 'https://schema.org/NewCondition',
        'seller': {'@type': 'Organization', 'name': 'Iglisi Watch'},
        'url': pageUrl
      }
    };
    document.getElementById('ld-json').textContent = JSON.stringify(ld);

    var imgHtml = w.image ? '<img src="' + w.image + '" alt="' + w.brand + ' ' + w.model + '" fetchpriority="high">' : '';
    var ctaBlock = w.sold
      ? '<p style="font-size:1rem;color:#888;font-weight:600">Kjo or\u00eb \u00ebsht\u00eb shitur.</p>'
      : '<div class="watch-cta-wrap">'
        + '<a href="' + waMsg(w) + '" target="_blank" rel="noopener noreferrer" class="watch-cta-main" data-fb-contact="1" aria-label="Pyesni via WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i> Pyesni n\u00eb WhatsApp</a>'
        + '<a href="https://instagram.com/iglisiwatch" target="_blank" rel="noopener noreferrer" class="watch-ig" aria-label="Shiko Instagram-in ton\u00eb"><i class="fab fa-instagram" aria-hidden="true"></i> Instagram</a>'
        + '</div>';

    document.getElementById('watch-content').className = 'watch-page';
    document.getElementById('watch-content').innerHTML =
      '<div class="watch-img-wrap">'
        + imgHtml
        + '<span class="watch-badge-pg">' + (w.sold ? 'Shitur' : (w.condition === 'New' ? 'I ri' : 'I p\u00ebrdorur')) + '</span>'
      + '</div>'
      + '<div class="watch-info">'
        + '<a href="/sq/shop/" class="back-link"><i class="fas fa-arrow-left" aria-hidden="true"></i> Kthehu n\u00eb dyqan</a>'
        + '<div>'
          + '<p class="watch-brand-pg">' + w.brand + '</p>'
          + '<h1 class="watch-title-pg">' + w.model + '</h1>'
          + '<p class="watch-ref-pg">Ref. ' + (w.reference||'\u2014') + ' &middot; ' + w.year + '</p>'
        + '</div>'
        + '<p class="watch-price-pg">' + fmt(w.price, w.currency) + '</p>'
        + '<p class="watch-desc-pg">' + (w.description_sq || w.description_en || '') + '</p>'
        + ctaBlock
        + '<div class="trust-row">'
          + '<span class="trust-item"><i class="fas fa-shield-alt" aria-hidden="true"></i> Garanci 1 vit</span>'
          + '<span class="trust-item"><i class="fas fa-star" aria-hidden="true"></i> E re &amp; origjinale</span>'
          + '<span class="trust-item"><i class="fas fa-clock" aria-hidden="true"></i> H\u00ebn\u2013Sht 8:30\u201320:30</span>'
        + '</div>'
      + '</div>';
  }

  function showError(heading, body){
    document.getElementById('watch-content').className = 'error-state';
    document.getElementById('watch-content').innerHTML =
      '<h2>' + heading + '</h2>'
      + '<p>' + body + '</p>'
      + '<a href="/sq/shop/" style="display:inline-block;margin-top:1.5rem;background:#06153b;color:#fff;padding:.7rem 1.8rem;border-radius:9999px;font-weight:700;text-decoration:none">Shfletoni Dyqanin</a>';
  }
})();
