(function () {
  var shop = document.getElementById('shop');
  var data = { items: [] };
  try {
    var txt = document.getElementById('percy-shop').textContent.trim();
    if (txt) data = JSON.parse(txt);
  } catch (e) { console.error('Could not read shop data', e); }

  // Preview helper: open index.html?demo to see sample items
  if (location.search.indexOf('demo') !== -1 && !(data.items || []).length) {
    data = { kofi: '', items: [
      { code: 'D1', title: 'Sample drawing', blurb: 'Ink on paper.', price: '£5', pounds: 5, kind: 'drawing', img: '', link: '#', sold: false },
      { code: 'P1', title: 'Sample page', blurb: 'A printed page.', price: '£3', pounds: 3, kind: 'page', img: '', link: '#', sold: true }
    ] };
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var items = data.items || [];
  shop.textContent = '';
  if (!items.length) {
    shop.appendChild(el('p', 'empty', 'Nothing is listed just now — please check back soon.'));
  }
  items.forEach(function (it) {
    var card = el('article', 'card' + (it.sold ? ' sold' : ''));
    if (it.img) {
      var img = el('img');
      img.src = it.img; img.alt = it.title || '';
      img.loading = 'lazy';
      // If the server's image path is not published, try the copy in this project's images folder
      var base = String(it.img).split('/').pop();
      var tried = false;
      img.onerror = function () {
        if (!tried && /^[\w-]+\.svg$/.test(base)) { tried = true; img.src = 'images/' + base; }
        else img.remove();
      };
      card.appendChild(img);
    }
    var body = el('div', 'body');
    if (it.kind) body.appendChild(el('div', 'kind', it.kind));
    body.appendChild(el('h3', null, it.title || 'Untitled'));
    if (it.blurb) body.appendChild(el('p', null, it.blurb));
    var price = '';
    if (typeof it.price === 'number' || /^\d+(\.\d+)?$/.test(String(it.price || ''))) {
      price = it.price + (Number(it.price) === 1 ? ' coin' : ' coins');
    } else if (it.price) {
      price = String(it.price);
    } else if (it.pounds != null) {
      price = '£' + it.pounds;
    }
    if (price) body.appendChild(el('div', 'price', price));
    if (it.sold) {
      body.appendChild(el('span', 'btn', 'Sold'));
    } else if (it.link) {
      var a = el('a', 'btn', 'Buy');
      a.href = it.link;
      body.appendChild(a);
    } else {
      body.appendChild(el('p', 'howto', 'To buy, ask for item ' + (it.code || it.title) + '.'));
    }
    card.appendChild(body);
    shop.appendChild(card);
  });

  if (data.kofi) {
    var k = document.getElementById('kofi-link');
    k.href = /^https?:/.test(data.kofi) ? data.kofi : 'https://ko-fi.com/' + data.kofi;
    var kl = document.getElementById('kofi-line');
    kl.hidden = false; kl.style.display = '';
  }
})();
