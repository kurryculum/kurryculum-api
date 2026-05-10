(function(){
  // Load the homepage HTML as a proper script src so <script> tags execute
  // Uses commit hash to bypass jsDelivr cache (@main is aggressively cached)
  var COMMIT = '290cae2';
  var BASE = 'https://cdn.jsdelivr.net/gh/kurryculum/kurryculum-api@' + COMMIT;

  // 1. Inject the stylesheet (fonts + styles from the HTML file)
  //    We load the HTML file via fetch, extract <style> and <link> tags,
  //    and inject them — then use a <script src> for the JS execution.
  //    Actually the cleanest approach: load via fetch, split CSS from JS,
  //    inject CSS as innerHTML (safe), execute scripts properly.

  fetch(BASE + '/FINAL-theme2-with-lifestyle.html')
    .then(function(r){ return r.text(); })
    .then(function(html){
      var el = document.getElementById('kurry-hp');
      if(!el) return;

      // Create a temp container to parse the HTML
      var temp = document.createElement('div');
      temp.innerHTML = html;

      // Insert all non-script nodes (HTML + CSS) before the placeholder
      var frag = document.createDocumentFragment();
      var scripts = [];

      Array.from(temp.childNodes).forEach(function(node){
        if(node.nodeName === 'SCRIPT'){
          // Collect scripts for later execution
          scripts.push({
            src: node.src || null,
            text: node.textContent || node.innerText || ''
          });
        } else {
          frag.appendChild(node.cloneNode(true));
        }
      });

      el.parentNode.insertBefore(frag, el);
      el.parentNode.removeChild(el);

      // Execute scripts in order — this is what innerHTML misses
      scripts.forEach(function(s){
        var sc = document.createElement('script');
        if(s.src){
          sc.src = s.src;
        } else {
          sc.textContent = s.text;
        }
        document.body.appendChild(sc);
      });
    })
    .catch(function(e){
      console.warn('KurryHP load error:', e);
    });
})();
