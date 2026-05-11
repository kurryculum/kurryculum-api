(function(){
  var price_to_prod = {
    '24.99': ['7-chakra','7 Chakra Ayurvedic Complex'],
    '29.99': ['sugaverve','Sugaverve'],
    '9.99':  ['beet-root','Beet Root + Black Pepper'],
    '8.99':  ['vitamin-b12','Vitamin B-12']
  };
  
  function patch(){
    document.querySelectorAll('.lh-btn-web').forEach(function(btn){
      if(btn.dataset.patched) return;
      btn.dataset.patched = '1';
      var foot = btn.closest('.lh-pfoot');
      if(!foot) return;
      var priceEl = foot.querySelector('.lh-pprice');
      if(!priceEl) return;
      var price = priceEl.textContent.replace('$','').trim();
      var prod = price_to_prod[price];
      if(!prod) return;
      var id = prod[0], name = prod[1], p = parseFloat(price);
      // Replace anchor with button to avoid navigation before sessionStorage set
      var newBtn = document.createElement('button');
      newBtn.className = btn.className;
      newBtn.textContent = btn.textContent;
      newBtn.onclick = function(e){
        e.preventDefault();
        try{sessionStorage.setItem('kurry_cart',JSON.stringify([{id:id,name:name,price:p,qty:1}]));}catch(er){}
        window.location.href='/checkout';
      };
      btn.parentNode.replaceChild(newBtn, btn);
    });
  }
  
  // Run multiple times to catch dynamically injected content
  setTimeout(patch, 500);
  setTimeout(patch, 1500);
  setTimeout(patch, 3000);
  
  // Also observe DOM changes
  if(window.MutationObserver){
    var obs = new MutationObserver(function(){ patch(); });
    obs.observe(document.body, {childList:true, subtree:true});
  }
})();
