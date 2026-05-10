(function(){
  var COMMIT = '290cae2';
  var URL = 'https://cdn.jsdelivr.net/gh/kurryculum/kurryculum-api@' + COMMIT + '/FINAL-theme2-with-lifestyle.html';

  // Prevent double-injection
  if(document.getElementById('lh-loaded')) return;

  fetch(URL)
    .then(function(r){ return r.text(); })
    .then(function(html){
      if(document.getElementById('lh-loaded')) return;

      var tmp = document.createElement('div');
      tmp.innerHTML = html;

      // Collect scripts
      var scripts = [];
      tmp.querySelectorAll('script').forEach(function(s){
        scripts.push({ src: s.src || null, text: s.textContent || '' });
        s.parentNode.removeChild(s);
      });

      // Clear the entire body and replace with fetched content
      document.body.innerHTML = '';
      var frag = document.createDocumentFragment();
      while(tmp.firstChild) frag.appendChild(tmp.firstChild);
      document.body.appendChild(frag);

      // Mark as loaded
      var marker = document.createElement('div');
      marker.id = 'lh-loaded';
      marker.style.display = 'none';
      document.body.appendChild(marker);

      // Execute scripts
      scripts.forEach(function(s){
        var sc = document.createElement('script');
        if(s.src){ sc.src = s.src; } else { sc.textContent = s.text; }
        document.body.appendChild(sc);
      });
    })
    .catch(function(e){ console.warn('KurryHP failed:', e); });
})();
