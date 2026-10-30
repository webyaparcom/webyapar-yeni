
(function () {
  "use strict";
  if (window.MxStore && window.MxStore.__mxStore === true) {
    return;
  }

  var CART_KEY = "mxCartV1";
  var ORDERS_KEY = "mxOrdersV1";
  var UYE_CACHE_KEY = "mxUyeV1";
  var SON_SIPARIS_KEY = "mxSonSiparisV1";
  var ZAMAN_ASIMI_MS = 15000;

  
  
  

  function depoOku(depo, key, varsayilan) {
    try {
      var raw = depo && depo.getItem(key);
      return raw ? JSON.parse(raw) : varsayilan;
    } catch (e) {
      return varsayilan;
    }
  }

  function depoYaz(depo, key, deger) {
    try {
      if (!depo) {
        return;
      }
      if (deger == null) {
        depo.removeItem(key);
      } else {
        depo.setItem(key, JSON.stringify(deger));
      }
    } catch (e) {}
  }

  function yerel() {
    try {
      return window.localStorage;
    } catch (e) {
      return null;
    }
  }

  function oturumDepo() {
    try {
      return window.sessionStorage;
    } catch (e) {
      return null;
    }
  }

  function olayYay(ad, detay) {
    var ev = null;
    try {
      ev = new window.CustomEvent(ad, { detail: detay });
    } catch (e) {
      try {
        ev = document.createEvent("CustomEvent");
        ev.initCustomEvent(ad, false, false, detay);
      } catch (e2) {
        ev = null;
      }
    }
    if (ev && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(ev);
    }
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  
  function para(n, simge, dil) {
    var x = Number(n);
    if (!isFinite(x)) {
      x = 0;
    }
    var metin;
    var loc = dil || (document.documentElement && document.documentElement.getAttribute("lang")) || "tr";
    try {
      
      var kod = String(loc).toLowerCase().split(/[-_]/)[0];
      metin = new Intl.NumberFormat(kod === "tr" || kod === "ar" ? "tr-TR" : loc, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(x);
    } catch (e) {
      metin = x.toFixed(2).replace(".", ",");
    }
    return simge ? metin + " " + simge : metin;
  }

  function hataMetni(err, varsayilan) {
    if (err && typeof err.error === "string" && err.error) {
      return err.error;
    }
    return varsayilan || "";
  }

  
  
  

  var apiBilgi = apiKokCoz();
  var uyariVerildi = false;

  function apiKokCoz() {
    var raw = "";
    var meta = document.querySelector ? document.querySelector('meta[name="mx-api-base"]') : null;
    if (meta && meta.getAttribute("content") != null) {
      raw = String(meta.getAttribute("content") || "");
    }
    if (!raw && typeof window.mxApiBase === "string") {
      raw = window.mxApiBase;
    }
    raw = String(raw || "").trim();
    
    if (raw.indexOf("{") !== -1) {
      raw = "";
    }
    if (raw === "none") {
      return { kok: "", ayniOrigin: true, yok: true, ham: raw };
    }
    if (!raw) {
      return { kok: "", ayniOrigin: true, yok: false, ham: "" };
    }
    var origin = window.location && window.location.origin ? window.location.origin : "";
    var u = null;
    try {
      u = new window.URL(raw, window.location ? window.location.href : undefined);
    } catch (e) {
      u = null;
    }
    if (!u) {
      return { kok: "", ayniOrigin: true, yok: false, ham: raw };
    }
    var yol = String(u.pathname || "").replace(/\/+$/, "");
    if (u.origin === origin) {
      return { kok: yol, ayniOrigin: true, yok: false, ham: raw };
    }
    return { kok: u.origin + yol, ayniOrigin: false, yok: false, ham: raw };
  }

  function uyeKullanilabilir() {
    return !apiBilgi.yok && apiBilgi.ayniOrigin;
  }

  function caprazUyar() {
    if (uyariVerildi || apiBilgi.ayniOrigin || apiBilgi.yok) {
      return;
    }
    uyariVerildi = true;
    if (window.console && typeof window.console.warn === "function") {
      window.console.warn(
        "MxStore: API farkli origin (" + apiBilgi.kok + ") — mx_uye cerezi SameSite=Lax oldugu icin uyelik kullanilamiyor; sepet ve misafir siparis calisir."
      );
    }
  }

  function sorguYaz(sorgu) {
    if (!sorgu || typeof sorgu !== "object") {
      return "";
    }
    var parca = [];
    for (var k in sorgu) {
      if (Object.prototype.hasOwnProperty.call(sorgu, k) && sorgu[k] != null && sorgu[k] !== "") {
        parca.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(sorgu[k])));
      }
    }
    return parca.length ? "?" + parca.join("&") : "";
  }

  function hata(status, kod, error, alan, govde) {
    return { status: status || 0, kod: kod, error: error || "", alan: alan || "", body: govde || null };
  }

  
  function api(yol, opts) {
    var o = opts || {};
    if (apiBilgi.yok) {
      return Promise.reject(hata(0, "api-yok"));
    }
    if (o.uyeGerekli && !uyeKullanilabilir()) {
      caprazUyar();
      return Promise.reject(hata(0, "uye-kullanilamiyor"));
    }
    if (typeof window.fetch !== "function") {
      return Promise.reject(hata(0, "ag"));
    }
    var method = String(o.method || "GET").toUpperCase();
    var url = apiBilgi.kok + String(yol || "") + sorguYaz(o.sorgu);
    var istek = {
      method: method,
      credentials: "include",
      headers: { Accept: "application/json" }
    };
    if (o.body !== undefined && method !== "GET") {
      istek.headers["Content-Type"] = "application/json";
      istek.body = JSON.stringify(o.body);
    }
    var kontrol = null;
    try {
      kontrol = typeof window.AbortController === "function" ? new window.AbortController() : null;
    } catch (e) {
      kontrol = null;
    }
    if (kontrol) {
      istek.signal = kontrol.signal;
    }
    var bitti = false;
    var sure = o.zamanAsimi || ZAMAN_ASIMI_MS;

    return new Promise(function (resolve, reject) {
      var zamanlayici = setTimeout(function () {
        if (bitti) {
          return;
        }
        bitti = true;
        if (kontrol) {
          try {
            kontrol.abort();
          } catch (e) {}
        }
        reject(hata(0, "zaman-asimi"));
      }, sure);

      window.fetch(url, istek).then(function (res) {
        return res.text().then(function (metin) {
          var govde = null;
          try {
            govde = metin ? JSON.parse(metin) : {};
          } catch (e) {
            govde = null;
          }
          return { res: res, govde: govde };
        });
      }).then(function (r) {
        if (bitti) {
          return;
        }
        bitti = true;
        clearTimeout(zamanlayici);
        var st = r.res.status;
        if (r.govde === null || typeof r.govde !== "object") {
          
          if (st === 404 || st === 405 || st === 501 || (st >= 200 && st < 300)) {
            apiYokIsaretle();
            reject(hata(st, "api-yok"));
            return;
          }
          reject(hata(st, "http"));
          return;
        }
        if (st === 401 && !o.sifirlamaYok) {
          uyeAyarla(null);
        }
        if (!r.res.ok || r.govde.success === false) {
          var msg = typeof r.govde.error === "string" ? r.govde.error.replace(/^\[[A-Z_]+\]\s*/, "") : "";
          reject(hata(st, "http", msg, r.govde.alan, r.govde));
          return;
        }
        resolve(r.govde);
      }).catch(function () {
        if (bitti) {
          return;
        }
        bitti = true;
        clearTimeout(zamanlayici);
        reject(hata(0, "ag"));
      });
    });
  }

  function apiYokIsaretle() {
    if (apiBilgi.yok) {
      return;
    }
    apiBilgi.yok = true;
    if (uyeDurum !== "giris") {
      uyeDurumAyarla("kullanilamiyor");
    }
  }

  
  
  

  
  var MAX_ADET = 99;

  function adetSinirla(q) {
    var n = parseInt(q, 10);
    if (!isFinite(n) || n < 1) {
      return 1;
    }
    return Math.min(MAX_ADET, n);
  }

  
  function satirAnahtar(id, varyant) {
    return String(id) + "\u0000" + (varyant != null && varyant !== "" ? String(varyant) : "");
  }

  function satirNormal(it) {
    var satir = {
      id: String(it.id),
      name: it.name != null ? String(it.name) : "",
      price: Number(it.price) || 0,
      img: it.img != null ? String(it.img) : "",
      url: it.url != null ? String(it.url) : "",
      qty: adetSinirla(it && it.qty)
    };
    if (it.varyant != null && it.varyant !== "") {
      satir.varyant = String(it.varyant);
    }
    return satir;
  }

  function sepetHam() {
    var list = depoOku(yerel(), CART_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  function sepetOku() {
    var list = sepetHam();
    var out = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id != null && list[i].id !== "") {
        out.push(satirNormal(list[i]));
      }
    }
    return out;
  }

  function sepetToplam(list) {
    var l = list || sepetOku();
    var t = 0;
    for (var i = 0; i < l.length; i++) {
      t += (Number(l[i].price) || 0) * (l[i].qty || 1);
    }
    return Math.round(t * 100) / 100;
  }

  function sepetSayi(list) {
    var l = list || sepetOku();
    var n = 0;
    for (var i = 0; i < l.length; i++) {
      n += l[i].qty || 1;
    }
    return n;
  }

  function sepetDegisti(kaynak) {
    var list = sepetOku();
    var detay = { liste: list, sayi: sepetSayi(list), toplam: sepetToplam(list), kaynak: kaynak || "" };
    domSepet(detay.sayi);
    olayYay("mx:sepet", detay);
    return detay;
  }

  function sepetYaz(list, kaynak) {
    depoYaz(yerel(), CART_KEY, list);
    
    if (typeof window.mxCartRefresh === "function" && window.mxCartRefresh.mxStoreYedek !== true) {
      try {
        window.mxCartRefresh();
      } catch (e) {}
    }
    return sepetDegisti(kaynak || "mxstore");
  }

  function sepetEkle(item) {
    if (!item || item.id == null || item.id === "") {
      return sepetOku();
    }
    var list = sepetHam();
    var yeni = satirNormal(item);
    var anahtar = satirAnahtar(yeni.id, yeni.varyant);
    var bulundu = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id != null && satirAnahtar(list[i].id, list[i].varyant) === anahtar) {
        list[i].qty = adetSinirla((parseInt(list[i].qty, 10) || 1) + yeni.qty);
        bulundu = true;
        break;
      }
    }
    if (!bulundu) {
      list.push(yeni);
    }
    sepetYaz(list, "ekle");
    return sepetOku();
  }

  
  function sepetAdet(id, qty, varyant) {
    var hedef = String(id);
    var varyantli = varyant !== undefined;
    var anahtar = varyantli ? satirAnahtar(hedef, varyant) : "";
    var q = parseInt(qty, 10);
    var list = sepetHam();
    var next = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] && String(list[i].id) === hedef && (!varyantli || satirAnahtar(list[i].id, list[i].varyant) === anahtar)) {
        if (isFinite(q) && q > 0) {
          list[i].qty = adetSinirla(q);
          next.push(list[i]);
        }
      } else {
        next.push(list[i]);
      }
    }
    sepetYaz(next, "adet");
    return sepetOku();
  }

  function sepetSil(id, varyant) {
    return sepetAdet(id, 0, varyant);
  }

  function sepetTemizle() {
    sepetYaz([], "temizle");
    return [];
  }

  function abone(olayAdi, fn) {
    if (typeof fn !== "function" || typeof window.addEventListener !== "function") {
      return function () {};
    }
    var dinle = function (ev) {
      fn(ev && ev.detail ? ev.detail : {});
    };
    window.addEventListener(olayAdi, dinle);
    return function () {
      window.removeEventListener(olayAdi, dinle);
    };
  }

  
  function widgetSar() {
    var adlar = ["mxCartAdd", "mxCartSetQty", "mxCartRemove", "mxCartClear"];
    for (var i = 0; i < adlar.length; i++) {
      (function (ad) {
        var asil = window[ad];
        if (typeof asil !== "function" || asil.mxStoreSarili === true || asil.mxStoreYedek === true) {
          return;
        }
        var sarili = function () {
          var sonuc = asil.apply(this, arguments);
          sepetDegisti(ad);
          return sonuc;
        };
        sarili.mxStoreSarili = true;
        window[ad] = sarili;
      })(adlar[i]);
    }
  }

  
  function yedekTanimla() {
    function tanimla(ad, fn) {
      if (typeof window[ad] !== "function") {
        fn.mxStoreYedek = true;
        window[ad] = fn;
      }
    }
    tanimla("mxCartList", function () { return sepetOku(); });
    tanimla("mxCartCount", function () { return sepetSayi(); });
    tanimla("mxCartTotal", function () { return sepetToplam(); });
    tanimla("mxCartAdd", function (item) { sepetEkle(item); });
    tanimla("mxCartSetQty", function (id, qty) { sepetAdet(id, qty); });
    tanimla("mxCartRemove", function (id) { sepetSil(id); });
    tanimla("mxCartClear", function () { sepetTemizle(); });
    tanimla("mxCartRefresh", function () { sepetDegisti("refresh"); });
    tanimla("mxCartAddFromEl", function (el) {
      if (!el || !el.getAttribute) {
        return;
      }
      var id = el.getAttribute("data-mx-id");
      if (!id) {
        return;
      }
      var qty = 1;
      var qtyEl = document.querySelector('[data-mx-qty-for="' + id + '"]');
      if (qtyEl && qtyEl.value) {
        qty = parseInt(qtyEl.value, 10) || 1;
      }
      window.mxCartAdd({
        id: id,
        name: el.getAttribute("data-mx-name") || "",
        price: parseFloat(el.getAttribute("data-mx-price")) || 0,
        img: el.getAttribute("data-mx-img") || "",
        url: el.getAttribute("data-mx-url") || "",
        qty: qty
      });
    });
    if (typeof window.addToCart !== "function") {
      var kopru = function (id, qty) {
        var el = document.querySelector('[data-mx-id="' + id + '"]');
        if (!el) {
          return;
        }
        if (qty) {
          window.mxCartAdd({
            id: id,
            name: el.getAttribute("data-mx-name") || "",
            price: parseFloat(el.getAttribute("data-mx-price")) || 0,
            img: el.getAttribute("data-mx-img") || "",
            url: el.getAttribute("data-mx-url") || "",
            qty: qty
          });
        } else {
          window.mxCartAddFromEl(el);
        }
      };
      kopru.mxBridge = true;
      kopru.mxStoreYedek = true;
      window.addToCart = kopru;
    }
  }

  
  
  

  
  var uyeDurum = "bilinmiyor";
  var uyeVeri = null;
  var benSozu = null;

  function uyeOzet(u) {
    if (!u) {
      return null;
    }
    return {
      id: u.id,
      ad: u.ad || "",
      soyad: u.soyad || "",
      email: u.email || "",
      telefon: u.telefon || "",
      created_at: u.created_at || null,
      son_giris_at: u.son_giris_at || null
    };
  }

  function uyeDurumAyarla(durum) {
    var onceki = uyeDurum;
    uyeDurum = durum;
    domUye();
    if (onceki !== durum || durum === "giris") {
      olayYay("mx:uye", { durum: uyeDurum, uye: uyeVeri });
    }
  }

  function uyeAyarla(u) {
    uyeVeri = uyeOzet(u);
    depoYaz(oturumDepo(), UYE_CACHE_KEY, uyeVeri);
    uyeDurumAyarla(uyeVeri ? "giris" : (uyeKullanilabilir() ? "misafir" : "kullanilamiyor"));
    return uyeVeri;
  }

  function veriAl(govde) {
    return govde && govde.data !== undefined ? govde.data : govde;
  }

  function uyeBen(zorla) {
    if (!uyeKullanilabilir()) {
      caprazUyar();
      uyeDurumAyarla("kullanilamiyor");
      return Promise.resolve(null);
    }
    if (benSozu && !zorla) {
      return benSozu;
    }
    benSozu = api("/api/public/uye/ben", { uyeGerekli: true }).then(function (g) {
      return uyeAyarla(veriAl(g));
    }, function (err) {
      if (err && err.status === 401) {
        return uyeAyarla(null);
      }
      if (err && (err.kod === "api-yok" || err.kod === "uye-kullanilamiyor")) {
        uyeVeri = null;
        depoYaz(oturumDepo(), UYE_CACHE_KEY, null);
        uyeDurumAyarla("kullanilamiyor");
        return null;
      }
      
      if (uyeDurum === "bilinmiyor") {
        uyeDurumAyarla(uyeVeri ? "giris" : "kullanilamiyor");
      }
      return uyeVeri;
    });
    return benSozu;
  }

  function uyeIstek(yol, opts) {
    var o = opts || {};
    o.uyeGerekli = true;
    return api(yol, o);
  }

  function uyeKayit(v) {
    var d = v || {};
    return uyeIstek("/api/public/uye/kayit", {
      method: "POST",
      body: {
        ad: d.ad,
        soyad: d.soyad,
        email: d.email,
        sifre: d.sifre,
        telefon: d.telefon || "",
        kvkk: d.kvkk === true
      }
    }).then(function (g) {
      benSozu = null;
      return uyeAyarla(veriAl(g));
    });
  }

  function uyeGiris(email, sifre) {
    var b = email && typeof email === "object" ? email : { email: email, sifre: sifre };
    return uyeIstek("/api/public/uye/giris", {
      method: "POST",
      body: { email: b.email, sifre: b.sifre }
    }).then(function (g) {
      benSozu = null;
      return uyeAyarla(veriAl(g));
    });
  }

  function uyeCikis() {
    var bitir = function () {
      benSozu = null;
      uyeAyarla(null);
      return null;
    };
    return uyeIstek("/api/public/uye/cikis", { method: "POST", body: {} }).then(bitir, bitir);
  }

  function uyeGuncelle(v) {
    return uyeIstek("/api/public/uye/ben", { method: "PATCH", body: v || {} }).then(function (g) {
      return uyeAyarla(veriAl(g));
    });
  }

  
  function uyeSifre(eski, yeni) {
    var b = eski && typeof eski === "object" ? eski : { eski: eski, yeni: yeni };
    return uyeIstek("/api/public/uye/sifre", {
      method: "POST",
      body: { eski: b.eski, yeni: b.yeni }
    }).then(function (g) {
      return veriAl(g) || true;
    });
  }

  function uyeAdresler() {
    return uyeIstek("/api/public/uye/adres").then(function (g) {
      var l = veriAl(g);
      return Array.isArray(l) ? l : [];
    });
  }

  function uyeAdresEkle(a) {
    return uyeIstek("/api/public/uye/adres", { method: "POST", body: a || {} }).then(veriAl);
  }

  function uyeAdresGuncelle(id, a) {
    return uyeIstek("/api/public/uye/adres/" + encodeURIComponent(String(id)), {
      method: "PATCH",
      body: a || {}
    }).then(veriAl);
  }

  function uyeAdresSil(id) {
    return uyeIstek("/api/public/uye/adres/" + encodeURIComponent(String(id)), {
      method: "DELETE"
    }).then(veriAl);
  }

  
  function oturumGerekli(girisYolu) {
    return uyeBen().then(function (u) {
      if (!u && uyeDurum === "misafir" && girisYolu) {
        var donus = window.location ? window.location.pathname + (window.location.search || "") : "";
        var ayir = String(girisYolu).indexOf("?") === -1 ? "?" : "&";
        try {
          window.location.href = girisYolu + ayir + "donus=" + encodeURIComponent(donus);
        } catch (e) {}
      }
      return u;
    });
  }

  
  function guvenliDonus(q) {
    if (!q || typeof q !== "string" || q.charAt(0) !== "/") {
      return false;
    }
    if (/[\x00-\x1f\x7f]/.test(q) || q.charAt(1) === "/" || q.charAt(1) === "\\" || q.indexOf("\\") !== -1) {
      return false;
    }
    if (q.indexOf("://") !== -1 || /^[\/]*[a-z][a-z0-9+.\-]*:/i.test(q)) {
      return false;
    }
    try {
      var origin = window.location && window.location.origin;
      if (origin && new window.URL(q, origin).origin !== origin) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  function donusYolu(varsayilan) {
    var q = "";
    try {
      q = new window.URL(window.location.href).searchParams.get("donus") || "";
    } catch (e) {
      q = "";
    }
    if (guvenliDonus(q)) {
      return q;
    }
    return varsayilan || "";
  }

  
  
  

  
  function kalemlerSepetten(list) {
    var out = [];
    var sira = {};
    for (var i = 0; i < list.length; i++) {
      var anahtar = satirAnahtar(list[i].id, list[i].varyant);
      if (Object.prototype.hasOwnProperty.call(sira, anahtar)) {
        var onceki = out[sira[anahtar]];
        onceki.adet = adetSinirla(onceki.adet + (list[i].qty || 1));
        continue;
      }
      var k = { urunId: list[i].id, adet: adetSinirla(list[i].qty || 1) };
      if (list[i].varyant) {
        k.varyant = list[i].varyant;
      }
      sira[anahtar] = out.length;
      out.push(k);
    }
    return out;
  }

  
  function siparisOlustur(v) {
    var d = v || {};
    var sepet = sepetOku();
    var kalemler = Array.isArray(d.kalemler) && d.kalemler.length ? d.kalemler : kalemlerSepetten(sepet);
    if (!kalemler.length) {
      return Promise.reject(hata(0, "bos-sepet"));
    }
    
    if (apiBilgi.yok || d.demo === true) {
      return demoSiparisOlustur(d, sepet);
    }
    var govde = { kalemler: kalemler, odeme: d.odeme || "kapida" };
    var alanlar = ["adres", "adresId", "notu", "email", "ad_soyad", "ad", "soyad", "telefon"];
    for (var i = 0; i < alanlar.length; i++) {
      if (d[alanlar[i]] != null && d[alanlar[i]] !== "") {
        govde[alanlar[i]] = d[alanlar[i]];
      }
    }
    return api("/api/public/siparis", { method: "POST", body: govde }).then(function (g) {
      var data = veriAl(g) || {};
      var no = g.no || data.no;
      var kayit = {
        no: no,
        email: data.email || d.email || "",
        toplam: g.toplam != null ? g.toplam : data.toplam,
        durum: g.durum || data.durum || "beklemede",
        data: data,
        at: new Date().toISOString()
      };
      depoYaz(oturumDepo(), SON_SIPARIS_KEY, kayit);
      
      try {
        var gecmis = depoOku(yerel(), ORDERS_KEY, []);
        if (!Array.isArray(gecmis)) {
          gecmis = [];
        }
        gecmis.unshift({
          orderNo: no,
          date: kayit.at,
          items: sepet,
          total: kayit.toplam,
          name: data.ad_soyad || d.ad_soyad || "",
          phone: d.telefon || "",
          address: d.adres && d.adres.adres ? d.adres.adres : "",
          note: d.notu || "",
          email: kayit.email,
          kaynak: "d1",
          durum: kayit.durum
        });
        depoYaz(yerel(), ORDERS_KEY, gecmis.slice(0, 50));
      } catch (e) {}
      if (d.sepetiTemizle !== false) {
        sepetTemizle();
      }
      return kayit;
    });
  }

  
  function demoSiparisNo() {
    var z = new Date();
    var p2 = function (n) { return (n < 10 ? "0" : "") + n; };
    var rastgele = Math.floor(Math.random() * 900 + 100);
    return "DEMO-" + z.getFullYear() + p2(z.getMonth() + 1) + p2(z.getDate()) + "-" + p2(z.getHours()) + p2(z.getMinutes()) + p2(z.getSeconds()) + "-" + rastgele;
  }

  
  function demoSiparisOlustur(d, sepet) {
    if (d.basarisiz === true) {
      var h = hata(0, "odeme-basarisiz");
      h.demo = true;
      return Promise.reject(h);
    }
    var kalemler = [];
    var ara = 0;
    for (var i = 0; i < sepet.length; i++) {
      var adet = adetSinirla(sepet[i].qty || 1);
      var fiyat = Number(sepet[i].price) || 0;
      ara += fiyat * adet;
      kalemler.push({
        urun_id: sepet[i].id,
        ad: sepet[i].name || sepet[i].id,
        adet: adet,
        birim_fiyat: fiyat,
        satir_toplam: fiyat * adet,
        varyant: sepet[i].varyant || "",
        gorsel: sepet[i].img || ""
      });
    }
    var kargo = Number(d.kargo) > 0 ? Number(d.kargo) : 0;
    var indirim = Number(d.indirim) > 0 ? Number(d.indirim) : 0;
    var toplam = Math.max(0, ara + kargo - indirim);
    var no = demoSiparisNo();
    var at = new Date().toISOString();
    var yontem = d.odeme === "kart" || d.odeme === "havale" || d.odeme === "kapida" ? d.odeme : "kapida";
    var veri = {
      demo: true,
      no: no,
      email: d.email || "",
      ad_soyad: d.ad_soyad || "",
      kalemler: kalemler,
      ara_toplam: ara,
      kargo: kargo,
      indirim: indirim,
      toplam: toplam,
      odeme_yontemi: yontem,
      durum: "onaylandi",
      created_at: at
    };
    var kayit = { no: no, email: veri.email, toplam: toplam, durum: veri.durum, data: veri, at: at, demo: true };
    depoYaz(oturumDepo(), SON_SIPARIS_KEY, kayit);
    try {
      var gecmis = depoOku(yerel(), ORDERS_KEY, []);
      if (!Array.isArray(gecmis)) {
        gecmis = [];
      }
      gecmis.unshift({
        orderNo: no,
        date: at,
        items: sepet,
        total: toplam,
        name: veri.ad_soyad,
        phone: d.telefon || "",
        address: d.adres && d.adres.adres ? d.adres.adres : (typeof d.adres === "string" ? d.adres : ""),
        note: d.notu || "",
        email: veri.email,
        kaynak: "demo",
        durum: veri.durum
      });
      depoYaz(yerel(), ORDERS_KEY, gecmis.slice(0, 50));
    } catch (e) {}
    if (d.sepetiTemizle !== false) {
      sepetTemizle();
    }
    return Promise.resolve(kayit);
  }

  function siparisListem(sayfa) {
    return uyeIstek("/api/public/siparis", { sorgu: { sayfa: sayfa || 1 } }).then(function (g) {
      var d = veriAl(g) || {};
      if (!Array.isArray(d.siparisler)) {
        d.siparisler = [];
      }
      return d;
    });
  }

  function siparisDetay(no, email) {
    return api("/api/public/siparis/" + encodeURIComponent(String(no || "")), {
      sorgu: email ? { email: email } : null
    }).then(veriAl);
  }

  function sonSiparis() {
    return depoOku(oturumDepo(), SON_SIPARIS_KEY, null);
  }

  
  
  

  function hepsi(kok, secici) {
    var r = kok && kok.querySelectorAll ? kok.querySelectorAll(secici) : [];
    var out = [];
    for (var i = 0; i < r.length; i++) {
      out.push(r[i]);
    }
    return out;
  }

  function domSepet(sayi, kok) {
    var n = sayi == null ? sepetSayi() : sayi;
    var els = hepsi(kok || document, "[data-mx-sepet-sayi]");
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = String(n);
      if (n > 0) {
        els[i].removeAttribute("data-mx-bos");
      } else {
        els[i].setAttribute("data-mx-bos", "1");
      }
    }
  }

  function domUye(kok) {
    var r = kok || document;
    var giris = uyeDurum === "giris";
    var els = hepsi(r, "[data-mx-uye-goster]");
    for (var i = 0; i < els.length; i++) {
      var hedef = els[i].getAttribute("data-mx-uye-goster");
      var gorunur = hedef === "giris" ? giris : !giris;
      if (els[i].style) {
        els[i].style.display = gorunur ? "" : "none";
      }
      if (gorunur) {
        els[i].removeAttribute("aria-hidden");
      } else {
        els[i].setAttribute("aria-hidden", "true");
      }
    }
    var adlar = hepsi(r, "[data-mx-uye-ad]");
    for (var j = 0; j < adlar.length; j++) {
      adlar[j].textContent = uyeVeri ? (uyeVeri.ad || uyeVeri.email || "") : "";
    }
    if (document.documentElement && document.documentElement.setAttribute) {
      document.documentElement.setAttribute("data-mx-uye", uyeDurum);
    }
  }

  function bagla(kok) {
    domSepet(null, kok);
    domUye(kok);
  }

  
  
  

  var MxStore = {
    __mxStore: true,
    hazir: true,
    surum: "1.0.0",
    api: api,
    apiBilgi: function () {
      return { kok: apiBilgi.kok, ayniOrigin: apiBilgi.ayniOrigin, yok: apiBilgi.yok, uye: uyeKullanilabilir() };
    },
    para: para,
    esc: esc,
    hataMetni: hataMetni,
    bagla: bagla,
    sepet: {
      oku: sepetOku,
      ekle: sepetEkle,
      adet: sepetAdet,
      sil: sepetSil,
      temizle: sepetTemizle,
      toplam: function () { return sepetToplam(); },
      sayi: function () { return sepetSayi(); },
      abone: function (fn) { return abone("mx:sepet", fn); }
    },
    uye: {
      durum: function () { return uyeDurum; },
      mevcut: function () { return uyeVeri; },
      kullanilabilir: uyeKullanilabilir,
      kayit: uyeKayit,
      giris: uyeGiris,
      cikis: uyeCikis,
      ben: uyeBen,
      guncelle: uyeGuncelle,
      sifre: uyeSifre,
      adresler: uyeAdresler,
      adresEkle: uyeAdresEkle,
      adresGuncelle: uyeAdresGuncelle,
      adresSil: uyeAdresSil,
      oturumGerekli: oturumGerekli,
      donusYolu: donusYolu,
      abone: function (fn) { return abone("mx:uye", fn); }
    },
    siparis: {
      olustur: siparisOlustur,
      listem: siparisListem,
      detay: siparisDetay,
      son: sonSiparis,
      
      demoKip: function () { return !!apiBilgi.yok; }
    }
  };

  window.MxStore = MxStore;

  
  widgetSar();
  yedekTanimla();

  
  if (typeof window.addEventListener === "function") {
    window.addEventListener("storage", function (ev) {
      if (ev && ev.key === CART_KEY) {
        sepetDegisti("sekme");
      }
    });
  }

  
  var onbellek = depoOku(oturumDepo(), UYE_CACHE_KEY, null);
  if (onbellek && uyeKullanilabilir()) {
    uyeVeri = uyeOzet(onbellek);
    uyeDurum = "giris";
  }
  if (!uyeKullanilabilir()) {
    caprazUyar();
    uyeDurum = "kullanilamiyor";
  }
  bagla(document);

  
  var kuyruk = Array.isArray(window.mxStoreQ) ? window.mxStoreQ : [];
  window.mxStoreQ = {
    push: function (fn) {
      if (typeof fn === "function") {
        try {
          fn(MxStore);
        } catch (e) {
          if (window.console && window.console.error) {
            window.console.error("MxStore kuyruk:", e);
          }
        }
      }
      return 0;
    }
  };
  for (var qi = 0; qi < kuyruk.length; qi++) {
    window.mxStoreQ.push(kuyruk[qi]);
  }
  olayYay("mx:hazir", { MxStore: MxStore });

  
  if (uyeKullanilabilir()) {
    var gerek = hepsi(document, "[data-mx-uye-goster],[data-mx-uye-ad],[data-mx-uye]").length > 0 || kuyruk.length > 0 || !!onbellek;
    if (gerek) {
      uyeBen();
    } else if (uyeDurum === "bilinmiyor") {
      uyeDurum = "misafir";
      bagla(document);
    }
  }
})();
