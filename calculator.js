(function(){
  var el = document.getElementById('kurry-calc');
  if(!el) return;
  fetch('https://raw.githubusercontent.com/kurryculum/kurryculum-api/main/KURRYCULUM-CALC-LIGHT.html')
    .then(function(r){ return r.text(); })
    .then(function(html){
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      while(tmp.firstChild){
        el.parentNode.insertBefore(tmp.firstChild, el);
      }
      el.parentNode.removeChild(el);
    })
    .catch(function(e){ console.warn('Kurry calc load failed:', e); });
})();
