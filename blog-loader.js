(function(){
  if(!window.location.pathname.includes('blog')) return;
  
  var COMMIT = 'db2d232';
  var param = new URLSearchParams(window.location.search).get('article');
  
  // If article param exists, load the articles file
  var fileToLoad = param 
    ? 'https://cdn.jsdelivr.net/gh/kurryculum/kurryculum-api@' + COMMIT + '/blog-articles.html'
    : 'https://cdn.jsdelivr.net/gh/kurryculum/kurryculum-api@2442595/KURRYCULUM-BLOG-LIGHT.html';
  
  var markerId = param ? 'ba-loaded' : 'bl-loaded';
  if(document.getElementById(markerId)) return;
  
  fetch(fileToLoad).then(function(r){return r.text();}).then(function(html){
    if(document.getElementById(markerId)) return;
    var tmp=document.createElement('div');tmp.innerHTML=html;
    var scripts=[];
    tmp.querySelectorAll('script').forEach(function(s){scripts.push({src:s.src||null,text:s.textContent||''});s.parentNode.removeChild(s);});
    document.body.innerHTML='';
    var frag=document.createDocumentFragment();
    while(tmp.firstChild)frag.appendChild(tmp.firstChild);
    document.body.appendChild(frag);
    var m=document.createElement('div');m.id=markerId;m.style.display='none';document.body.appendChild(m);
    scripts.forEach(function(s){var sc=document.createElement('script');if(s.src){sc.src=s.src;}else{sc.textContent=s.text;}document.body.appendChild(sc);});
    
    // If article param, show the right article
    if(param && window.showArticle) {
      window.showArticle(param);
    } else if(param) {
      setTimeout(function(){ if(window.showArticle) window.showArticle(param); }, 500);
    }
  }).catch(function(e){console.warn('KurryBlog failed:',e);});
})();
