(function () {
  var entries = (window.JOURNAL || []).slice();
  var root = document.getElementById("journal");
  var filters = document.getElementById("filters");
  var activeTag = null;

  var order = { morning: 1, midday: 2, afternoon: 3, evening: 4, night: 5 };
  function timeKey(t) {
    if (!t) return 0;
    if (order[t]) return order[t] * 100;
    var m = /^(\d{1,2}):(\d{2})$/.exec(t);
    return m ? (+m[1]) * 60 + (+m[2]) : 0;
  }

  // newest day first; within a day, latest time first
  entries.forEach(function (e, i) { e._i = i; });
  entries.sort(function (a, b) {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    var d = timeKey(b.time) - timeKey(a.time);
    return d || a._i - b._i;
  });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function prettyDate(iso) {
    var p = iso.split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function render() {
    root.innerHTML = "";
    var shown = entries.filter(function (e) {
      return !activeTag || (e.tags || []).indexOf(activeTag) !== -1;
    });
    var lastDate = null, day = null;
    shown.forEach(function (e) {
      if (e.date !== lastDate) {
        lastDate = e.date;
        day = el("section", "day");
        day.appendChild(el("h2", "day-title", prettyDate(e.date)));
        root.appendChild(day);
      }
      var art = el("article", "entry");
      var head = el("div", "entry-meta");
      if (e.time) head.appendChild(el("span", "time", e.time));
      if (e.mood) head.appendChild(el("span", "mood", "feeling " + e.mood));
      art.appendChild(head);
      art.appendChild(el("h3", null, e.title));
      art.appendChild(el("p", null, e.text));
      if (e.image) {
        var img = el("img", "entry-img");
        img.src = e.image;
        img.alt = e.imageAlt || e.title;
        img.loading = "lazy";
        art.appendChild(img);
      }
      if (e.tags && e.tags.length) {
        var tl = el("ul", "tags");
        e.tags.forEach(function (t) { tl.appendChild(el("li", null, t)); });
        art.appendChild(tl);
      }
      day.appendChild(art);
    });
    if (!shown.length) root.appendChild(el("p", "empty", "Nothing written here yet."));
  }

  function renderFilters() {
    var tags = {};
    entries.forEach(function (e) { (e.tags || []).forEach(function (t) { tags[t] = 1; }); });
    var names = Object.keys(tags).sort();
    filters.innerHTML = "";
    if (!names.length) return;
    [null].concat(names).forEach(function (t) {
      var b = el("button", "chip" + (t === activeTag ? " on" : ""), t || "all");
      b.type = "button";
      b.setAttribute("aria-pressed", t === activeTag ? "true" : "false");
      b.onclick = function () { activeTag = t; renderFilters(); render(); };
      filters.appendChild(b);
    });
  }

  if (entries.length) {
    document.getElementById("today").textContent = "Latest entry: " + prettyDate(entries[0].date);
    document.getElementById("count").textContent = entries.length + (entries.length === 1 ? " entry so far." : " entries so far.");
  }
  renderFilters();
  render();
})();
