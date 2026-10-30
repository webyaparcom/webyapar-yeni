/* tema-galeri — sunucu tarafi: temalari sunucuda dile cozup kartlari KACISLI olarak basar (JS'siz de gorunur/indekslenir),
   cip/siralama/kutu metinlerini doldurur, MxFiltre icin dile cozulmus ogeleri tek JSON blogunda tasir. */
var tgEsc = function (v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};
var tgDes = json.desing || {};
var tgLang = json.lang || "tr";
var tgPick = function (v) {
  return wmPickLang(v, tgLang);
};
var tgSozluk = function (liste) {
  var s = {};
  var l = Array.isArray(liste) ? liste : [];
  for (var i = 0; i < l.length; i++) {
    if (l[i] && l[i].id != null) {
      s[String(l[i].id)] = l[i];
    }
  }
  return s;
};
var tgTurler = tgSozluk(tgDes.types);
var tgSektorler = tgSozluk(tgDes.sectors);
var tgOzellikler = tgSozluk(tgDes.featureDefs);

/* cogul: Intl.PluralRules (ar 6 form); eksik form -> other; {n} yerine sayi */
var tgCogul = function (n, tablo) {
  var f = tablo && typeof tablo === "object" ? tablo[tgLang] || tablo.tr || tablo.en || {} : {};
  var kat = "other";
  try {
    kat = new Intl.PluralRules(tgLang).select(Number(n));
  } catch (e) {
    kat = Number(n) === 1 ? "one" : "other";
  }
  if (Number(n) === 0 && f.zero !== undefined) {
    kat = "zero";
  }
  var m = f[kat] !== undefined ? f[kat] : f.other;
  return String(m === undefined ? "" : m).replace(/\{n\}/g, String(n));
};
var tgSayiHtml = function (metin, n) {
  /* "{n} sayfa" icinde sayiyi bdi ile yalitir ki Arapca satirda hane sirasi bozulmasin */
  var s = tgEsc(tgCogul(n, metin));
  return s.replace(String(n), '<bdi dir="ltr">' + String(n) + "</bdi>");
};
/* gorsel yolu: yalniz / ya da http(s) ya da duz dosya yolu; tirnak/aci parantez/javascript: reddedilir */
var tgGorsel = function (g) {
  var s = String(g == null ? "" : g).trim();
  if (!s || /[<>"'\s]/.test(s) || /^(javascript|data):/i.test(s)) {
    return "";
  }
  return s;
};
var tgSlugGuvenli = function (s) {
  return String(s == null ? "" : s).replace(/[^a-zA-Z0-9_.-]/g, "");
};
var tgHref = function (slug) {
  var s = String(slug == null ? "" : slug).trim();
  if (!s || /^javascript:/i.test(s)) {
    return "";
  }
  return wxLangInternalHref(s);
};

var tgVeri = Array.isArray(json.data) ? json.data : [];
var tgOgeler = [];
var tgKartlar = "";
var tgDemoTaban = tgHref(tgDes.demoPage);
var tgIstekTaban = tgHref(tgDes.ctaHref);
var tgMevcutTur = {};
var tgMevcutSektor = {};
for (var tgI = 0; tgI < tgVeri.length; tgI++) {
  var th = tgVeri[tgI] || {};
  var slug = tgSlugGuvenli(th.slug) || "tema-" + (tgI + 1);
  var ad = tgPick(th.name) || slug;
  var tur = String(th.type || "");
  var sek = String(th.sector || "");
  var turEt = tgTurler[tur] ? tgPick(tgTurler[tur].name) : tur;
  var sekEt = tgSektorler[sek] ? tgPick(tgSektorler[sek].name) : sek;
  var ozet = tgPick(th.summary);
  tgMevcutTur[tur] = (tgMevcutTur[tur] || 0) + 1;
  tgMevcutSektor[sek] = (tgMevcutSektor[sek] || 0) + 1;
  tgOgeler.push({
    id: String(tgI),
    slug: slug,
    type: tur,
    sector: sek,
    nameText: ad,
    summaryText: ozet,
    typeLabel: turEt,
    sectorLabel: sekEt,
    date: String(th.date || "")
  });

  /* masaustu + mobil ekran goruntusu; yoksa dekoratif yer tutucu */
  var gD = tgGorsel(th.shotDesktop);
  var gM = tgGorsel(th.shotMobile);
  var altD = tgPick(tgDes.shotAltDesktop).split("{name}").join(ad);
  var altM = tgPick(tgDes.shotAltMobile).split("{name}").join(ad);
  var masa = gD
    ? '<img class="modulex-tg-img" src="' + tgEsc(gD) + '" alt="' + tgEsc(altD) + '" loading="lazy" decoding="async" />'
    : '<span class="modulex-tg-ph" aria-hidden="true"><span class="material-symbols-outlined">desktop_windows</span><span class="modulex-tg-phname">' + tgEsc(ad) + "</span></span>";
  var mob = gM
    ? '<img class="modulex-tg-img" src="' + tgEsc(gM) + '" alt="' + tgEsc(altM) + '" loading="lazy" decoding="async" />'
    : '<span class="modulex-tg-ph" aria-hidden="true"><span class="material-symbols-outlined">smartphone</span></span>';

  /* dahil olanlar */
  var oz = Array.isArray(th.features) ? th.features : [];
  var ozHtml = "";
  for (var tgF = 0; tgF < oz.length; tgF++) {
    var def = tgOzellikler[String(oz[tgF])];
    if (!def) {
      continue;
    }
    ozHtml += '<li class="modulex-tg-feat"><span class="material-symbols-outlined" aria-hidden="true">' + tgEsc(def.icon || "check") + "</span><span>" + tgEsc(tgPick(def.name)) + "</span></li>";
  }

  /* eylemler: demo -> demo-cerceve sayfasi ?t=<slug>; sayfa tanimli degilse tema url'si (yeni sekme) */
  var demoHref = tgDemoTaban ? tgDemoTaban + "?t=" + encodeURIComponent(slug) : "";
  var demoDis = false;
  if (!demoHref && th.url && /^https?:\/\//i.test(String(th.url))) {
    demoHref = String(th.url);
    demoDis = true;
  }
  var istekHref = tgIstekTaban ? tgIstekTaban + "?tema=" + encodeURIComponent(slug) : "";
  var yeniSekme = demoDis ? '<span class="mx-visually-hidden"> ' + tgEsc(tgPick(tgDes.newTabText)) + "</span>" : "";

  tgKartlar +=
    '<article class="modulex-tg-card" data-tg-id="' + tgI + '" data-tg-slug="' + tgEsc(slug) + '" id="tema-' + tgEsc(slug) + '-{{id}}" aria-labelledby="tg-n-{{id}}-' + tgI + '">' +
    '<div class="modulex-tg-shots"><div class="modulex-tg-bar" aria-hidden="true"><i></i><i></i><i></i></div>' +
    '<div class="modulex-tg-desk">' + masa + '</div><div class="modulex-tg-mob">' + mob + "</div></div>" +
    '<div class="modulex-tg-body">' +
    '<div class="modulex-tg-badges"><span class="modulex-tg-badge modulex-tg-badge--sector">' + tgEsc(sekEt) + '</span><span class="modulex-tg-badge">' + tgEsc(turEt) + "</span></div>" +
    '<h3 class="modulex-tg-name" id="tg-n-{{id}}-' + tgI + '">' + tgEsc(ad) + "</h3>" +
    (ozet ? '<p class="modulex-tg-sum">' + tgEsc(ozet) + "</p>" : "") +
    (ozHtml ? '<p class="modulex-tg-incl">' + tgEsc(tgPick(tgDes.includedTitle)) + '</p><ul class="modulex-tg-feats">' + ozHtml + "</ul>" : "") +
    (Number(th.pages) > 0 ? '<p class="modulex-tg-pages">' + tgSayiHtml(tgDes.pagesText, Number(th.pages)) + "</p>" : "") +
    '<div class="modulex-tg-cta">' +
    (demoHref ? '<a class="mx-btn mx-btn--primary modulex-tg-btn" href="' + tgEsc(demoHref) + '"' + (demoDis ? ' target="_blank" rel="noopener noreferrer"' : "") + '><span>' + tgEsc(tgPick(tgDes.demoText)) + "</span>" + yeniSekme + '<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>' : "") +
    (istekHref ? '<a class="mx-btn mx-btn--outline modulex-tg-btn" href="' + tgEsc(istekHref) + '"><span>' + tgEsc(tgPick(tgDes.requestText)) + "</span></a>" : "") +
    "</div></div></article>";
}

/* cip dugmeleri (yalniz veride bulunan tur/sektorler, sozluk sirasinda) */
var tgCip = function (sozlukListe, mevcut, facet) {
  var h = '<button type="button" class="modulex-tg-chip is-active" data-tg-facet="' + facet + '" data-tg-val="" aria-pressed="true"><span>' + tgEsc(tgPick(tgDes.allText)) + '</span><span class="modulex-tg-n" data-tg-n=""></span></button>';
  var l = Array.isArray(sozlukListe) ? sozlukListe : [];
  for (var i = 0; i < l.length; i++) {
    var id = String(l[i].id);
    if (!mevcut[id]) {
      continue;
    }
    h += '<button type="button" class="modulex-tg-chip" data-tg-facet="' + facet + '" data-tg-val="' + tgEsc(id) + '" aria-pressed="false"><span>' + tgEsc(tgPick(l[i].name)) + '</span><span class="modulex-tg-n" data-tg-n="' + tgEsc(id) + '"></span></button>';
  }
  return h;
};
var tgSiralar = ["yeni", "ad", "sektor", "tur"];
var tgVars = tgSiralar.indexOf(String(tgDes.defaultSort)) !== -1 ? String(tgDes.defaultSort) : "yeni";
var tgIstemci = {
  lang: tgLang,
  items: tgOgeler,
  defaultSort: tgVars,
  url: tgDes.urlState !== false && tgDes.urlState !== "false",
  plural: tgDes.resultCount && typeof tgDes.resultCount === "object" ? tgDes.resultCount[tgLang] || tgDes.resultCount.tr || tgDes.resultCount.en || {} : {}
};
var tgJson = JSON.stringify(tgIstemci).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

var tgDegis = function (anahtar, deger) {
  html = html.split("{{" + anahtar + "}}").join(deger);
};
tgDegis("tgKartlar", tgKartlar);
tgDegis("tgCipTur", tgCip(tgDes.types, tgMevcutTur, "tur"));
tgDegis("tgCipSektor", tgCip(tgDes.sectors, tgMevcutSektor, "sektor"));
tgDegis("tgSiraSecili" + tgVars, " selected");
for (var tgS = 0; tgS < tgSiralar.length; tgS++) {
  tgDegis("tgSiraSecili" + tgSiralar[tgS], "");
}
var tgMetinler = ["title", "subtitle", "searchLabel", "searchPh", "sortLabel", "sortNew", "sortName", "sortSector", "sortType", "typeGroupLabel", "sectorGroupLabel", "resetText", "emptyTitle", "emptyText"];
for (var tgM = 0; tgM < tgMetinler.length; tgM++) {
  tgDegis(tgMetinler[tgM], tgEsc(tgPick(tgDes[tgMetinler[tgM]])));
}
tgDegis("tgVeri", tgJson);
