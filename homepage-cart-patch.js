// This patches Buy on Website buttons on the homepage to pass cart data
(function(){
  function patchBuyButtons() {
    document.querySelectorAll('.lh-btn-web').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var card = btn.closest('.lh-pcard');
        if (!card) return;
        var name = card.querySelector('.lh-pname') ? card.querySelector('.lh-pname').textContent.trim() : '';
        var priceEl = card.querySelector('.lh-pprice');
        var price = priceEl ? parseFloat(priceEl.textContent.replace('$','')) : 0;
        // Map name to product ID
        var idMap = {
          '7 Chakra Ayurvedic Complex': '7-chakra',
          'Sugaverve': 'sugaverve',
          'Beet Root + Black Pepper': 'beet-root',
          'Vitamin B-12': 'vitamin-b12',
          'BoneVite+': 'bonevite',
          'Krill Oil 500mg': 'krill-oil',
          'Collagen Peptides': 'collagen'
        };
        var id = idMap[name] || name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
        if (name && price) {
          try {
            sessionStorage.setItem('kurry_cart', JSON.stringify([{id:id, name:name, price:price, qty:1}]));
          } catch(err) {}
        }
      });
    });
  }
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchBuyButtons);
  } else {
    patchBuyButtons();
  }
  // Also run after a delay in case content loads dynamically
  setTimeout(patchBuyButtons, 2000);
})();
