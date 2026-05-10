(function(){
  var COMMIT = '290cae2';
  var URL = 'https://cdn.jsdelivr.net/gh/kurryculum/kurryculum-api@' + COMMIT + '/FINAL-theme2-with-lifestyle.html';

  function inject(html) {
    // Parse and split HTML vs scripts
    var tmp = document.createElement('div');
    tmp.innerHTML = html;

    var scripts = [];
    tmp.querySelectorAll('script').forEach(function(s){
      scripts.push({ src: s.src || null, text: s.textContent || '' });
      s.parentNode.removeChild(s);
    });

    // Insert HTML into body
    var frag = document.createDocumentFragment();
    while(tmp.firstChild) frag.appendChild(tmp.firstChild);
    document.body.appendChild(frag);

    // Execute scripts
    scripts.forEach(function(s){
      var sc = document.createElement('script');
      if(s.src){ sc.src = s.src; } else { sc.textContent = s.text; }
      document.body.appendChild(sc);
    });
  }

  fetch(URL)
    .then(function(r){ return r.text(); })
    .then(function(html){ inject(html); })
    .catch(function(e){ console.warn('KurryHP failed:', e); });
})();
