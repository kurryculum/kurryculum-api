(function(){
  var el = document.getElementById('kurry-hp');
  if(!el) return;
  var COMMIT = '290cae2';
  fetch('https://cdn.jsdelivr.net/gh/kurryculum/kurryculum-api@' + COMMIT + '/FINAL-theme2-with-lifestyle.html')
    .then(function(r){ return r.text(); })
    .then(function(html){
      var tmp = document.createElement('div');
      tmp.innerHTML = html;

      // Collect scripts before inserting
      var scripts = [];
      tmp.querySelectorAll('script').forEach(function(s){
        scripts.push({ src: s.src || null, text: s.textContent || '' });
        s.parentNode.removeChild(s);
      });

      // Insert all non-script content
      var frag = document.createDocumentFragment();
      while(tmp.firstChild) frag.appendChild(tmp.firstChild);
      el.parentNode.insertBefore(frag, el);
      el.parentNode.removeChild(el);

      // Re-execute scripts in order
      scripts.forEach(function(s){
        var sc = document.createElement('script');
        if(s.src) { sc.src = s.src; } else { sc.textContent = s.text; }
        document.body.appendChild(sc);
      });
    })
    .catch(function(e){ console.warn('KurryHP load failed:', e); });
})();
