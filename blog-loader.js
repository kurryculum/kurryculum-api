(function(){
  if(!window.location.pathname.includes('blog')) return;
  var COMMIT = 'ed37294';
  var URL = 'https://cdn.jsdelivr.net/gh/kurryculum/kurryculum-api@' + COMMIT + '/KURRYCULUM-BLOG-LIGHT.html';
  if(document.getElementById('bl-loaded')) return;
  fetch(URL).then(function(r){return r.text();}).then(function(html){
    if(document.getElementById('bl-loaded')) return;
    var tmp=document.createElement('div');tmp.innerHTML=html;
    var scripts=[];
    tmp.querySelectorAll('script').forEach(function(s){scripts.push({src:s.src||null,text:s.textContent||''});s.parentNode.removeChild(s);});
    document.body.innerHTML='';
    var frag=document.createDocumentFragment();
    while(tmp.firstChild)frag.appendChild(tmp.firstChild);
    document.body.appendChild(frag);
    var m=document.createElement('div');m.id='bl-loaded';m.style.display='none';document.body.appendChild(m);
    scripts.forEach(function(s){var sc=document.createElement('script');if(s.src){sc.src=s.src;}else{sc.textContent=s.text;}document.body.appendChild(sc);});
  }).catch(function(e){console.warn('Kurry blog failed:',e);});
})();
