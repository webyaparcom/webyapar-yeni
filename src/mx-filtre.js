
(function (kok) {
  "use strict";

  
  function normalize(deger) {
    if (deger === null || deger === undefined) {
      return "";
    }
    var s = String(deger);
    
    s = s.replace(/İ/g, "i").replace(/I/g, "i").replace(/ı/g, "i");
    s = s.toLowerCase();
    if (typeof s.normalize === "function") {
      s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
    }
    
    s = s.replace(/[ً-ٰٟـ]/g, "");
    s = s.replace(/[آأإٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
    
    s = s.replace(/ß/g, "ss").replace(/ø/g, "o").replace(/ł/g, "l").replace(/đ/g, "d");
    return s.replace(/\s+/g, " ").trim();
  }

  function alanDegeri(oge, alan) {
    if (!alan) {
      return undefined;
    }
    if (alan.indexOf(".") === -1) {
      return oge[alan];
    }
    var parcalar = alan.split(".");
    var d = oge;
    for (var i = 0; i < parcalar.length; i++) {
      if (d === null || d === undefined) {
        return undefined;
      }
      d = d[parcalar[i]];
    }
    return d;
  }

  
  function duzMetin(deger, dil) {
    if (deger === null || deger === undefined) {
      return "";
    }
    if (typeof deger === "string" || typeof deger === "number") {
      return String(deger);
    }
    if (Array.isArray(deger)) {
      var p = [];
      for (var i = 0; i < deger.length; i++) {
        p.push(duzMetin(deger[i], dil));
      }
      return p.join(" ");
    }
    if (typeof deger === "object") {
      if (dil && deger[dil]) {
        return String(deger[dil]);
      }
      
      var t = [];
      for (var k in deger) {
        if (Object.prototype.hasOwnProperty.call(deger, k)) {
          t.push(duzMetin(deger[k], dil));
        }
      }
      return t.join(" ");
    }
    return "";
  }

  
function sayiOku(v) {
  if (v === null || v === undefined || v === "" || typeof v === "boolean") {
    return NaN;
  }
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
    var t = Date.parse(v);
    return isNaN(t) ? NaN : t;
  }
  return Number(v);
}

function varsayilanDurum(cfg) {
    return {
      q: "",
      facet: {},
      sirala: cfg.varsayilanSiralama || "",
      sayfa: 1
    };
  }

  function bosMu(v) {
    return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
  }

  
  function eslestir(oge, durum, cfg, haric) {
    var q = normalize(durum.q);
    if (q) {
      var alanlar = (cfg.arama && cfg.arama.alanlar) || [];
      var samanlik = [];
      for (var a = 0; a < alanlar.length; a++) {
        
        samanlik.push(normalize(duzMetin(alanDegeri(oge, alanlar[a]), null)));
      }
      var hepsi = samanlik.join(" ");
      var kelimeler = q.split(" ");
      for (var w = 0; w < kelimeler.length; w++) {
        if (hepsi.indexOf(kelimeler[w]) === -1) {
          return false;
        }
      }
    }
    var facets = cfg.facets || {};
    for (var ad in facets) {
      if (!Object.prototype.hasOwnProperty.call(facets, ad) || ad === haric) {
        continue;
      }
      var fc = facets[ad];
      var secili = durum.facet[ad];
      if (bosMu(secili)) {
        continue;
      }
      var deger = alanDegeri(oge, fc.alan || ad);
      if (fc.tip === "aralik") {
        var n = sayiOku(deger);
        var mn = secili[0] === "" || secili[0] === null || secili[0] === undefined ? null : Number(secili[0]);
        var mx = secili[1] === "" || secili[1] === null || secili[1] === undefined ? null : Number(secili[1]);
        if (!isFinite(n)) {
          return false;
        }
        if (mn !== null && isFinite(mn) && n < mn) {
          return false;
        }
        if (mx !== null && isFinite(mx) && n > mx) {
          return false;
        }
      } else if (fc.tip === "var") {
        var dolu = Array.isArray(deger) ? deger.length > 0 : Number(deger) > 0 || (typeof deger === "string" && deger !== "" && deger !== "0") || deger === true;
        if (secili === true || secili === "1" || secili === 1) {
          if (!dolu) {
            return false;
          }
        }
      } else {
        
        var liste = Array.isArray(secili) ? secili : [secili];
        var degerler = Array.isArray(deger) ? deger : [deger];
        var bulundu = false;
        for (var i = 0; i < degerler.length && !bulundu; i++) {
          for (var j = 0; j < liste.length; j++) {
            if (String(degerler[i]) === String(liste[j])) {
              bulundu = true;
              break;
            }
          }
        }
        if (!bulundu) {
          return false;
        }
      }
    }
    return true;
  }

  function sirala(liste, durum, cfg) {
    var tanim = cfg.siralama && cfg.siralama[durum.sirala];
    if (!tanim) {
      return liste;
    }
    var yon = tanim.yon === -1 ? -1 : 1;
    var kopya = liste.slice();
    
    var sirali = [];
    for (var i = 0; i < kopya.length; i++) {
      sirali.push({ o: kopya[i], i: i });
    }
    sirali.sort(function (x, y) {
      var a = alanDegeri(x.o, tanim.alan);
      var b = alanDegeri(y.o, tanim.alan);
      var c;
      if (tanim.tip === "metin") {
        var sa = normalize(duzMetin(a, cfg.dil));
        var sb = normalize(duzMetin(b, cfg.dil));
        c = sa < sb ? -1 : sa > sb ? 1 : 0;
      } else {
        var na = sayiOku(a);
        var nb = sayiOku(b);
        var aYok = !isFinite(na);
        var bYok = !isFinite(nb);
        
        if (aYok && bYok) {
          c = 0;
        } else if (aYok) {
          return 1;
        } else if (bYok) {
          return -1;
        } else {
          c = na < nb ? -1 : na > nb ? 1 : 0;
        }
      }
      return c !== 0 ? c * yon : x.i - y.i;
    });
    var out = [];
    for (var k = 0; k < sirali.length; k++) {
      out.push(sirali[k].o);
    }
    return out;
  }

  
  function hesapla(items, durum, cfg) {
    var suzulen = [];
    for (var i = 0; i < items.length; i++) {
      if (eslestir(items[i], durum, cfg)) {
        suzulen.push(items[i]);
      }
    }
    suzulen = sirala(suzulen, durum, cfg);
    var toplam = suzulen.length;
    var boyut = cfg.sayfaBoyutu > 0 ? cfg.sayfaBoyutu : 0;
    var sayfaSayisi = boyut ? Math.max(1, Math.ceil(toplam / boyut)) : 1;
    var sayfa = Math.min(Math.max(1, durum.sayfa || 1), sayfaSayisi);
    var liste = boyut ? suzulen.slice((sayfa - 1) * boyut, sayfa * boyut) : suzulen;
    return { liste: liste, tumu: suzulen, toplam: toplam, sayfa: sayfa, sayfaSayisi: sayfaSayisi, boyut: boyut };
  }

  
  function sayim(items, durum, cfg, facetAd) {
    var fc = (cfg.facets || {})[facetAd] || {};
    var sonuc = {};
    for (var i = 0; i < items.length; i++) {
      if (!eslestir(items[i], durum, cfg, facetAd)) {
        continue;
      }
      var deger = alanDegeri(items[i], fc.alan || facetAd);
      var degerler = Array.isArray(deger) ? deger : [deger];
      for (var j = 0; j < degerler.length; j++) {
        if (bosMu(degerler[j])) {
          continue;
        }
        var anahtar = String(degerler[j]);
        sonuc[anahtar] = (sonuc[anahtar] || 0) + 1;
      }
    }
    return sonuc;
  }

  
  function urlYaz(durum, cfg) {
    var parcalar = [];
    function ekle(ad, deger) {
      parcalar.push(encodeURIComponent(ad) + "=" + encodeURIComponent(deger));
    }
    var on = cfg.urlOnek || "";
    if (durum.q) {
      ekle(on + "q", durum.q);
    }
    var facets = cfg.facets || {};
    for (var ad in facets) {
      if (!Object.prototype.hasOwnProperty.call(facets, ad)) {
        continue;
      }
      var s = durum.facet[ad];
      if (bosMu(s)) {
        continue;
      }
      if (facets[ad].tip === "aralik") {
        ekle(on + ad, (s[0] === null || s[0] === undefined ? "" : s[0]) + "-" + (s[1] === null || s[1] === undefined ? "" : s[1]));
      } else if (Array.isArray(s)) {
        ekle(on + ad, s.join(","));
      } else {
        ekle(on + ad, s === true ? "1" : s);
      }
    }
    if (durum.sirala && durum.sirala !== (cfg.varsayilanSiralama || "")) {
      ekle(on + "sort", durum.sirala);
    }
    if (durum.sayfa > 1) {
      ekle(on + "p", durum.sayfa);
    }
    return parcalar.join("&");
  }

  function urlOku(sorgu, cfg) {
    var durum = varsayilanDurum(cfg);
    var on = cfg.urlOnek || "";
    var harita = {};
    String(sorgu || "").replace(/^\?/, "").split("&").forEach(function (cift) {
      if (!cift) {
        return;
      }
      var i = cift.indexOf("=");
      var k = decodeURIComponent((i === -1 ? cift : cift.slice(0, i)).replace(/\+/g, " "));
      var v = i === -1 ? "" : decodeURIComponent(cift.slice(i + 1).replace(/\+/g, " "));
      harita[k] = v;
    });
    if (harita[on + "q"]) {
      durum.q = harita[on + "q"];
    }
    var facets = cfg.facets || {};
    for (var ad in facets) {
      if (!Object.prototype.hasOwnProperty.call(facets, ad) || harita[on + ad] === undefined || harita[on + ad] === "") {
        continue;
      }
      var ham = harita[on + ad];
      var tip = facets[ad].tip;
      if (tip === "aralik") {
        var ab = ham.split("-");
        durum.facet[ad] = [ab[0] === "" ? null : Number(ab[0]), ab[1] === "" || ab[1] === undefined ? null : Number(ab[1])];
      } else if (tip === "var") {
        durum.facet[ad] = ham === "1" || ham === "true";
      } else if (tip === "coklu") {
        durum.facet[ad] = ham.split(",");
      } else {
        durum.facet[ad] = ham;
      }
    }
    if (harita[on + "sort"] && cfg.siralama && cfg.siralama[harita[on + "sort"]]) {
      durum.sirala = harita[on + "sort"];
    }
    if (harita[on + "p"]) {
      durum.sayfa = Math.max(1, parseInt(harita[on + "p"], 10) || 1);
    }
    return durum;
  }

  
  function olustur(cfg) {
    cfg = cfg || {};
    var items = cfg.items || [];
    var durum = varsayilanDurum(cfg);
    var aboneler = [];
    var win = typeof window !== "undefined" ? window : null;

    if (cfg.url && win && win.location) {
      durum = urlOku(win.location.search, cfg);
    }

    function sonuc() {
      var s = hesapla(items, durum, cfg);
      s.durum = durum;
      return s;
    }

    function duyur() {
      if (cfg.url && win && win.history && typeof win.history.replaceState === "function") {
        try {
          var qs = urlYaz(durum, cfg);
          win.history.replaceState(null, "", win.location.pathname + (qs ? "?" + qs : "") + (win.location.hash || ""));
        } catch (e) {
          
        }
      }
      var s = sonuc();
      for (var i = 0; i < aboneler.length; i++) {
        aboneler[i](s);
      }
      return s;
    }

    var ornek = {
      durum: function () { return durum; },
      sonuc: sonuc,
      abone: function (fn) {
        aboneler.push(fn);
        return function () {
          var i = aboneler.indexOf(fn);
          if (i !== -1) {
            aboneler.splice(i, 1);
          }
        };
      },
      
      ayarla: function (kismi) {
        for (var ad in kismi) {
          if (Object.prototype.hasOwnProperty.call(kismi, ad)) {
            if (bosMu(kismi[ad]) || kismi[ad] === false) {
              delete durum.facet[ad];
            } else {
              durum.facet[ad] = kismi[ad];
            }
          }
        }
        durum.sayfa = 1;
        return duyur();
      },
      ara: function (metin) {
        durum.q = String(metin || "");
        durum.sayfa = 1;
        return duyur();
      },
      sirala: function (anahtar) {
        durum.sirala = anahtar;
        durum.sayfa = 1;
        return duyur();
      },
      sayfaGit: function (n) {
        durum.sayfa = Math.max(1, Number(n) || 1);
        return duyur();
      },
      sifirla: function () {
        durum = varsayilanDurum(cfg);
        return duyur();
      },
      sayim: function (facetAd) { return sayim(items, durum, cfg, facetAd); },
      veriDegistir: function (yeni) {
        items = yeni || [];
        return duyur();
      },
      
      filtreVar: function () {
        if (durum.q) {
          return true;
        }
        for (var ad in durum.facet) {
          if (Object.prototype.hasOwnProperty.call(durum.facet, ad) && !bosMu(durum.facet[ad])) {
            return true;
          }
        }
        return false;
      }
    };
    return ornek;
  }

  
  function aramaBagla(girdi, ornek, bekleme) {
    var zamanlayici = null;
    if (!girdi || !girdi.addEventListener) {
      return function () {};
    }
    if (ornek.durum().q) {
      girdi.value = ornek.durum().q;
    }
    function onInput() {
      if (zamanlayici) {
        clearTimeout(zamanlayici);
      }
      zamanlayici = setTimeout(function () { ornek.ara(girdi.value); }, bekleme === undefined ? 150 : bekleme);
    }
    girdi.addEventListener("input", onInput);
    return function () { girdi.removeEventListener("input", onInput); };
  }

  
  function cogul(n, formlar, dil) {
    var kat = "other";
    try {
      kat = new Intl.PluralRules(dil || "en").select(Number(n));
    } catch (e) {
      kat = Number(n) === 1 ? "one" : "other";
    }
    if (Number(n) === 0 && formlar.zero !== undefined) {
      kat = "zero";
    }
    var metin = formlar[kat] !== undefined ? formlar[kat] : formlar.other;
    return String(metin === undefined ? "" : metin).replace(/\{n\}/g, String(n));
  }

  var API = {
    olustur: olustur,
    aramaBagla: aramaBagla,
    cogul: cogul,
    cekirdek: {
      normalize: normalize,
      eslestir: eslestir,
      sirala: sirala,
      hesapla: hesapla,
      sayim: sayim,
      urlYaz: urlYaz,
      urlOku: urlOku,
      duzMetin: duzMetin
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
  if (kok) {
    kok.MxFiltre = API;
  }
})(typeof window !== "undefined" ? window : null);
