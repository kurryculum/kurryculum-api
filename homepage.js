(function(){
  var el = document.getElementById('kurry-hp');
  if(!el) return;
  fetch('https://raw.githubusercontent.com/kurryculum/kurryculum-api/main/FINAL-theme2-with-lifestyle.html')
    .then(function(r){ return r.text(); })
    .then(function(html){
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      while(tmp.firstChild){
        el.parentNode.insertBefore(tmp.firstChild, el);
      }
      el.parentNode.removeChild(el);
    })
    .catch(function(e){ console.warn('Kurry home load failed:', e); });
})();
