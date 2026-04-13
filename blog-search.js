(function(){
  var q = document.getElementById('blog-search');
  if(!q) return;
  function run(){
    var term = q.value.trim().toLowerCase();
    var cards = document.querySelectorAll('.blog-card[data-tags]');
    var shown = 0;
    cards.forEach(function(card){
      var tags = (card.dataset.tags || '').toLowerCase();
      var title = (card.querySelector('h2,h3') || {}).textContent || '';
      var match = !term || tags.includes(term) || title.toLowerCase().includes(term);
      card.style.display = match ? '' : 'none';
      if(match) shown++;
    });
    var empty = document.getElementById('blog-empty');
    if(empty) empty.style.display = (shown === 0 && term) ? '' : 'none';
  }
  q.addEventListener('input', run);
  q.addEventListener('search', run);
})();
