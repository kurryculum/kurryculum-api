(function(){
  var COMMIT = '290cae2';
  var URL = 'https://cdn.jsdelivr.net/gh/kurryculum/kurryculum-api@' + COMMIT + '/KURRYCULUM-CALC-LIGHT.html';

  if(document.getElementById('nc-loaded')) return;

  fetch(URL)
    .then(function(r){ return r.text(); })
    .then(function(html){
      if(document.getElementById('nc-loaded')) return;

      var tmp = document.createElement('div');
      tmp.innerHTML = html;

      var scripts = [];
      tmp.querySelectorAll('script').forEach(function(s){
        scripts.push({ src: s.src || null, text: s.textContent || '' });
        s.parentNode.removeChild(s);
      });

      document.body.innerHTML = '';
      var frag = document.createDocumentFragment();
      while(tmp.firstChild) frag.appendChild(tmp.firstChild);
      document.body.appendChild(frag);

      var marker = document.createElement('div');
      marker.id = 'nc-loaded';
      marker.style.display = 'none';
      document.body.appendChild(marker);

      scripts.forEach(function(s){
        var sc = document.createElement('script');
        if(s.src){ sc.src = s.src; } else { sc.textContent = s.text; }
        document.body.appendChild(sc);
      });
    })
    .catch(function(e){ console.warn('KurryCalc failed:', e); });
})();
