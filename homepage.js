(function(){
  var el=document.getElementById('kurry-hp');
  if(!el)return;
  fetch('https://cdn.jsdelivr.net/gh/kurryculum/kurryculum-api@main/FINAL-theme2-with-lifestyle.html')
    .then(function(r){return r.text();})
    .then(function(html){
      var t=document.createElement('div');
      t.innerHTML=html;
      while(t.firstChild)el.parentNode.insertBefore(t.firstChild,el);
      el.parentNode.removeChild(el);
    });
})();
