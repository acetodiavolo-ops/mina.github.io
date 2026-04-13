(function(){
  // If redirected back after non-JS form submit, show success state
  if(location.search.indexOf('valued=1') > -1){
    var form = document.getElementById('valForm');
    var success = document.getElementById('valSuccess');
    if(form) form.style.display = 'none';
    if(success) success.style.display = 'flex';
    var section = document.getElementById('watch-valuation');
    if(section) setTimeout(function(){ section.scrollIntoView({behavior:'smooth',block:'start'}); }, 150);
  }

  var form = document.getElementById('valForm');
  if(!form) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var btn = form.querySelector('.val-submit');
    if(btn) btn.disabled = true;
    fetch('https://api.web3forms.com/submit', { method:'POST', body: new FormData(form) })
      .then(function(r){ return r.json(); })
      .then(function(json){
        if(json.success){
          form.style.display = 'none';
          var s = document.getElementById('valSuccess');
          if(s) s.style.display = 'flex';
        } else {
          alert('Something went wrong. Please try again or contact us directly.');
          if(btn) btn.disabled = false;
        }
      })
      .catch(function(){
        alert('Network error. Please try again.');
        if(btn) btn.disabled = false;
      });
  });
})();
