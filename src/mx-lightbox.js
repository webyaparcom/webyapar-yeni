
(function (kok) {
  "use strict";

  var durum = { kok: null, items: [], i: 0, tetikleyen: null, labels: {}, onKey: null, dokunBas: null };
  var CSS_ID = "mx-lightbox-css";

  var CSS =
    ".mx-lb{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;" +
    "background:rgba(10,10,12,.92);opacity:0;transition:opacity .2s ease;direction:ltr}" +
    "[dir=rtl] .mx-lb{direction:rtl}" +
    ".mx-lb.mx-lb-acik{opacity:1}" +
    ".mx-lb-sahne{margin:0;max-width:min(96vw,1400px);max-height:92vh;display:flex;flex-direction:column;align-items:center;gap:12px}" +
    ".mx-lb-img{max-width:100%;max-height:80vh;object-fit:contain;border-radius:4px;background:#111;" +
    "transform:scale(.98);transition:transform .2s ease}" +
    ".mx-lb-acik .mx-lb-img{transform:scale(1)}" +
    ".mx-lb-cap{color:#f2f2f2;font:15px/1.5 var(--mx-font-sans,system-ui,sans-serif);text-align:center;max-width:70ch;padding-inline:16px}" +
    ".mx-lb-cap strong{display:block;font-size:17px}" +
    ".mx-lb-say{color:#cfcfcf;font:13px/1 var(--mx-font-sans,system-ui,sans-serif);font-variant-numeric:tabular-nums}" +
    ".mx-lb-btn{position:absolute;display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;" +
    "border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:26px;line-height:1;cursor:pointer;" +
    "transition:background .2s ease;padding:0}" +
    ".mx-lb-btn:hover,.mx-lb-btn:focus-visible{background:rgba(255,255,255,.3);outline:2px solid #fff;outline-offset:2px}" +
    ".mx-lb-kapat{top:14px;inset-inline-end:14px}" +
    ".mx-lb-onceki{inset-inline-start:14px;top:50%;transform:translateY(-50%)}" +
    ".mx-lb-sonraki{inset-inline-end:14px;top:50%;transform:translateY(-50%)}" +
    ".mx-lb-tek .mx-lb-onceki,.mx-lb-tek .mx-lb-sonraki,.mx-lb-tek .mx-lb-say{display:none}" +
    "@media (max-width:768px){.mx-lb-img{max-height:70vh}.mx-lb-btn{min-width:48px;min-height:48px}}" +
    "@media (prefers-reduced-motion:reduce){.mx-lb,.mx-lb-img,.mx-lb-btn{transition:none}}" +
    "html.mx-lb-kilit{overflow:hidden}";

  function cssEkle() {
    if (!kok || !kok.document || kok.document.getElementById(CSS_ID)) {
      return;
    }
    var st = kok.document.createElement("style");
    st.id = CSS_ID;
    st.textContent = CSS;
    kok.document.head.appendChild(st);
  }

  function rtlMi() {
    var d = kok.document.documentElement.getAttribute("dir");
    return d === "rtl";
  }

  function etiket(ad, yedek) {
    var l = durum.labels || {};
    return l[ad] !== undefined && l[ad] !== null ? String(l[ad]) : yedek;
  }

  function el(etiketAdi, sinif, ozellik) {
    var e = kok.document.createElement(etiketAdi);
    if (sinif) {
      e.className = sinif;
    }
    for (var k in ozellik || {}) {
      if (Object.prototype.hasOwnProperty.call(ozellik, k)) {
        e.setAttribute(k, ozellik[k]);
      }
    }
    return e;
  }

  function ciz() {
    var oge = durum.items[durum.i];
    if (!oge || !durum.kok) {
      return;
    }
    var img = durum.kok.querySelector(".mx-lb-img");
    img.setAttribute("src", oge.src);
    img.setAttribute("alt", oge.alt || oge.title || "");
    var cap = durum.kok.querySelector(".mx-lb-cap");
    cap.textContent = "";
    if (oge.title) {
      var b = el("strong");
      b.textContent = oge.title;
      cap.appendChild(b);
    }
    if (oge.caption) {
      var s = el("span");
      s.textContent = oge.caption;
      cap.appendChild(s);
    }
    var kalip = etiket("counter", "{i} / {n}");
    durum.kok.querySelector(".mx-lb-say").textContent = kalip.replace("{i}", String(durum.i + 1)).replace("{n}", String(durum.items.length));
    durum.kok.classList.toggle("mx-lb-tek", durum.items.length < 2);
    
    [durum.i - 1, durum.i + 1].forEach(function (k) {
      if (durum.items[k]) {
        var on = new kok.Image();
        on.src = durum.items[k].src;
      }
    });
  }

  function git(adim) {
    var n = durum.items.length;
    if (n < 2) {
      return;
    }
    durum.i = (durum.i + adim + n) % n;
    ciz();
  }

  function odakTuzagi(ev) {
    var odaklanabilir = durum.kok.querySelectorAll("button:not([hidden])");
    var gorunur = [];
    for (var i = 0; i < odaklanabilir.length; i++) {
      var tek = durum.items.length < 2 && (odaklanabilir[i].classList.contains("mx-lb-onceki") || odaklanabilir[i].classList.contains("mx-lb-sonraki"));
      if (!tek) {
        gorunur.push(odaklanabilir[i]);
      }
    }
    if (!gorunur.length) {
      return;
    }
    var ilk = gorunur[0];
    var son = gorunur[gorunur.length - 1];
    var aktif = kok.document.activeElement;
    if (ev.shiftKey && (aktif === ilk || !durum.kok.contains(aktif))) {
      ev.preventDefault();
      son.focus();
    } else if (!ev.shiftKey && (aktif === son || !durum.kok.contains(aktif))) {
      ev.preventDefault();
      ilk.focus();
    }
  }

  function tusBasildi(ev) {
    if (ev.key === "Escape") {
      ev.preventDefault();
      kapat();
    } else if (ev.key === "ArrowRight") {
      ev.preventDefault();
      git(rtlMi() ? -1 : 1);
    } else if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      git(rtlMi() ? 1 : -1);
    } else if (ev.key === "Home") {
      ev.preventDefault();
      durum.i = 0;
      ciz();
    } else if (ev.key === "End") {
      ev.preventDefault();
      durum.i = durum.items.length - 1;
      ciz();
    } else if (ev.key === "Tab") {
      odakTuzagi(ev);
    }
  }

  function ac(items, index, secenek) {
    if (!kok || !kok.document || !items || !items.length) {
      return false;
    }
    if (durum.kok) {
      kapat(true);
    }
    secenek = secenek || {};
    cssEkle();
    durum.items = items;
    durum.i = Math.min(Math.max(0, index || 0), items.length - 1);
    durum.labels = secenek.labels || {};
    durum.tetikleyen = secenek.tetikleyen || kok.document.activeElement;

    var pencere = el("div", "mx-lb", { role: "dialog", "aria-modal": "true", "aria-label": etiket("dialog", etiket("close", "Lightbox")) });
    var sahne = el("figure", "mx-lb-sahne");
    sahne.appendChild(el("img", "mx-lb-img", { alt: "" }));
    sahne.appendChild(el("figcaption", "mx-lb-cap"));
    sahne.appendChild(el("div", "mx-lb-say", { "aria-live": "polite" }));
    pencere.appendChild(sahne);

    var kapatBtn = el("button", "mx-lb-btn mx-lb-kapat", { type: "button", "aria-label": etiket("close", "Close") });
    kapatBtn.textContent = "×";
    var onceki = el("button", "mx-lb-btn mx-lb-onceki mx-flip", { type: "button", "aria-label": etiket("prev", "Previous") });
    onceki.textContent = "‹";
    var sonraki = el("button", "mx-lb-btn mx-lb-sonraki mx-flip", { type: "button", "aria-label": etiket("next", "Next") });
    sonraki.textContent = "›";
    pencere.appendChild(kapatBtn);
    pencere.appendChild(onceki);
    pencere.appendChild(sonraki);

    kapatBtn.addEventListener("click", function () { kapat(); });
    onceki.addEventListener("click", function () { git(-1); });
    sonraki.addEventListener("click", function () { git(1); });
    
    pencere.addEventListener("click", function (ev) {
      if (ev.target === pencere || ev.target === sahne) {
        kapat();
      }
    });
    
    pencere.addEventListener("touchstart", function (ev) {
      durum.dokunBas = ev.changedTouches && ev.changedTouches[0] ? ev.changedTouches[0].clientX : null;
    }, { passive: true });
    pencere.addEventListener("touchend", function (ev) {
      if (durum.dokunBas === null || !ev.changedTouches || !ev.changedTouches[0]) {
        return;
      }
      var dx = ev.changedTouches[0].clientX - durum.dokunBas;
      durum.dokunBas = null;
      if (Math.abs(dx) < 48) {
        return;
      }
      var sola = dx < 0;
      git(sola !== rtlMi() ? 1 : -1);
    }, { passive: true });

    kok.document.body.appendChild(pencere);
    kok.document.documentElement.classList.add("mx-lb-kilit");
    durum.kok = pencere;
    durum.onKey = tusBasildi;
    kok.document.addEventListener("keydown", durum.onKey, true);
    ciz();
    
    var rAF = kok.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
    rAF(function () {
      pencere.classList.add("mx-lb-acik");
      kapatBtn.focus();
    });
    return true;
  }

  function kapat(sessiz) {
    if (!durum.kok) {
      return;
    }
    kok.document.removeEventListener("keydown", durum.onKey, true);
    if (durum.kok.parentNode) {
      durum.kok.parentNode.removeChild(durum.kok);
    }
    kok.document.documentElement.classList.remove("mx-lb-kilit");
    var geri = durum.tetikleyen;
    durum.kok = null;
    durum.items = [];
    durum.onKey = null;
    durum.tetikleyen = null;
    if (!sessiz && geri && typeof geri.focus === "function" && kok.document.contains(geri)) {
      geri.focus();
    }
  }

  function ogeVeri(e, kaynakFn) {
    if (kaynakFn) {
      return kaynakFn(e);
    }
    var src = e.getAttribute("data-mx-lb-src") || e.getAttribute("href");
    if (!src) {
      var im = e.tagName === "IMG" ? e : e.querySelector("img");
      src = im ? im.getAttribute("data-full") || im.getAttribute("src") : "";
    }
    var imgEl = e.tagName === "IMG" ? e : e.querySelector("img");
    return {
      src: src,
      alt: e.getAttribute("data-mx-lb-alt") || (imgEl ? imgEl.getAttribute("alt") : "") || "",
      title: e.getAttribute("data-mx-lb-title") || "",
      caption: e.getAttribute("data-mx-lb-caption") || ""
    };
  }

  function gorunurMu(e, koku) {
    for (var n = e; n && n !== koku.parentNode; n = n.parentNode) {
      if (n.nodeType !== 1) {
        continue;
      }
      if (n.hasAttribute("hidden") || (n.style && n.style.display === "none")) {
        return false;
      }
    }
    return true;
  }

  function bagla(koku, secici, secenek) {
    if (!koku || !koku.addEventListener) {
      return function () {};
    }
    secenek = secenek || {};
    function tikla(ev) {
      var hedef = ev.target && ev.target.closest ? ev.target.closest(secici) : null;
      if (!hedef || !koku.contains(hedef)) {
        return;
      }
      ev.preventDefault();
      var hepsi = koku.querySelectorAll(secici);
      var liste = [];
      var idx = 0;
      for (var i = 0; i < hepsi.length; i++) {
        if (!gorunurMu(hepsi[i], koku)) {
          continue;
        }
        if (hepsi[i] === hedef) {
          idx = liste.length;
        }
        liste.push(ogeVeri(hepsi[i], secenek.kaynak));
      }
      ac(liste, idx, { labels: secenek.labels, tetikleyen: hedef });
    }
    function tus(ev) {
      if ((ev.key === "Enter" || ev.key === " ") && ev.target && ev.target.matches && ev.target.matches(secici) && ev.target.tagName !== "A" && ev.target.tagName !== "BUTTON") {
        tikla(ev);
      }
    }
    koku.addEventListener("click", tikla);
    koku.addEventListener("keydown", tus);
    return function () {
      koku.removeEventListener("click", tikla);
      koku.removeEventListener("keydown", tus);
    };
  }

  var API = { ac: ac, kapat: kapat, bagla: bagla, acikMi: function () { return !!durum.kok; } };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
  if (kok) {
    kok.MxLightbox = API;
  }
})(typeof window !== "undefined" ? window : null);
