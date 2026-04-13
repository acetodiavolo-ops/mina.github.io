(function(){
  if(location.search.indexOf('success=1') > -1){
    var fw = document.getElementById('b2b-form-wrap');
    var fs = document.getElementById('b2b-success');
    if(fw) fw.style.display = 'none';
    if(fs) fs.style.display = 'block';
  }
})();
