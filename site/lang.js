// The language switch's memory, and the once-only redirect (F017). GitHub Pages cannot redirect by
// language, so an English page with a German twin (`data-twin` on <html>) sends a browser that asks
// for German first there, once: only when no choice is stored and the visitor did not come from a
// page of this site. The choice is one word, "de" or "en", kept in this browser and never sent.
(function () {
  var KEY = 'lang';
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(word) { try { localStorage.setItem(KEY, word); } catch (e) {} }

  var html = document.documentElement;
  var twin = html.getAttribute('data-twin');
  if (html.getAttribute('lang') === 'en' && twin && !stored()) {
    var from = /^https?:\/\/([^\/?#]+)/.exec(document.referrer || '');
    var first = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    if (!(from && from[1] === location.host) && /^de(-|$)/i.test(first)) {
      store('de');
      location.replace(twin + (location.hash || ''));
      return;
    }
  }

  // The switch lands on the section the visitor is in.
  function follow() {
    var links = document.querySelectorAll('.langswitch a');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var base = link.getAttribute('data-base');
      if (base === null) {
        base = link.getAttribute('href').split('#')[0];
        link.setAttribute('data-base', base);
        link.addEventListener('click', function () { store(this.getAttribute('lang')); });
      }
      link.setAttribute('href', base + (location.hash || ''));
    }
  }
  document.addEventListener('DOMContentLoaded', follow);
  window.addEventListener('hashchange', follow);
})();
