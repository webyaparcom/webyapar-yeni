/* demo-cerceve — sunucu tarafi: tema listesini (ad + url) dile cozer, cihaz tanimlarini temizler, metinleri JSON blogunda istemciye tasir.
   url icindeki {lang} render diliyle degisir (ornek: https://<slug>.webyapar.com/{lang}/). Yalniz http(s) ya da site ici yol kabul edilir. */
var dcEsc = function (v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};
var dcDes = json.desing || {};
var dcLang = json.lang || "tr";
var dcPick = function (v) {
  return wmPickLang(v, dcLang);
};
var dcSlug = function (s) {
  return String(s == null ? "" : s).replace(/[^a-zA-Z0-9_.-]/g, "");
};
var dcUrl = function (u) {
  var s = String(u == null ? "" : u).trim().split("{lang}").join(dcLang);
  if (!s || /[<>"'\s]/.test(s) || /^(javascript|data|vbscript):/i.test(s)) {
    return "";
  }
  return /^(https?:)?\/\//i.test(s) || s.charAt(0) === "/" ? s : "";
};
var dcHref = function (slug) {
  var s = String(slug == null ? "" : slug).trim();
  return !s || /^javascript:/i.test(s) ? "" : wxLangInternalHref(s);
};

var dcTemalar = [];
var dcHam = Array.isArray(json.data) ? json.data : [];
for (var dcI = 0; dcI < dcHam.length; dcI++) {
  var th = dcHam[dcI] || {};
  var sl = dcSlug(th.slug);
  var url = dcUrl(th.url);
  if (!sl || !url) {
    continue;
  }
  dcTemalar.push({ slug: sl, name: dcPick(th.name) || sl, url: url });
}

/* cihazlar: id kucuk harf, w 240..3000, h 0 (= alani doldur) ya da 240..3000 */
var dcCihazlar = [];
var dcCh = Array.isArray(dcDes.devices) ? dcDes.devices : [];
for (var dcD = 0; dcD < dcCh.length; dcD++) {
  var c = dcCh[dcD] || {};
  var id = String(c.id || "").replace(/[^a-z]/g, "");
  var w = Number(c.w);
  var h = Number(c.h);
  if (!id || !isFinite(w) || w < 240 || w > 3000) {
    continue;
  }
  dcCihazlar.push({ id: id, w: Math.round(w), h: isFinite(h) && h >= 240 && h <= 3000 ? Math.round(h) : 0 });
}
if (!dcCihazlar.length) {
  dcCihazlar = [{ id: "desktop", w: 1440, h: 0 }, { id: "tablet", w: 820, h: 1180 }, { id: "mobile", w: 390, h: 844 }];
}

var dcAnahtarlar = [
  "backText", "deviceLabel", "deviceDesktop", "deviceTablet", "deviceMobile", "navLabel", "prevText", "nextText", "counterAria",
  "openText", "requestText", "frameTitle", "loadingText", "fallbackTitle", "fallbackText", "fallbackLong", "emptyText", "ariaLabel"
];
var dcT = {};
for (var dcK = 0; dcK < dcAnahtarlar.length; dcK++) {
  dcT[dcAnahtarlar[dcK]] = dcPick(dcDes[dcAnahtarlar[dcK]]);
}
var dcCfg = {
  lang: dcLang,
  themes: dcTemalar,
  devices: dcCihazlar,
  theme: dcSlug(dcDes.theme),
  request: dcHref(dcDes.ctaHref),
  timeout: Math.min(60000, Math.max(1500, Number(dcDes.timeoutMs) || 9000)),
  t: dcT
};
var dcJson = JSON.stringify(dcCfg).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

var dcDegis = function (a, d) {
  html = html.split("{{" + a + "}}").join(d);
};
for (var dcM = 0; dcM < dcAnahtarlar.length; dcM++) {
  dcDegis(dcAnahtarlar[dcM], dcEsc(dcT[dcAnahtarlar[dcM]]));
}
dcDegis("dcBackHref", dcEsc(dcHref(dcDes.backHref)));
dcDegis("dcVeri", dcJson);
/* cihaz dugmeleri: etiket anahtari device<Id> (desktop/tablet/mobile); bilinmeyen id'de id yazilir */
var dcIkon = { desktop: "desktop_windows", tablet: "tablet_mac", mobile: "smartphone" };
var dcEt = { desktop: dcT.deviceDesktop, tablet: dcT.deviceTablet, mobile: dcT.deviceMobile };
var dcDugme = "";
for (var dcB = 0; dcB < dcCihazlar.length; dcB++) {
  var cb = dcCihazlar[dcB];
  dcDugme +=
    '<button type="button" class="modulex-dc-dev" data-dc-dev="' + dcEsc(cb.id) + '" aria-pressed="false" title="' + dcEsc(dcEt[cb.id] || cb.id) + '">' +
    '<span class="material-symbols-outlined" aria-hidden="true">' + (dcIkon[cb.id] || "devices") + "</span>" +
    '<span class="modulex-dc-devtext">' + dcEsc(dcEt[cb.id] || cb.id) + "</span></button>";
}
dcDegis("dcDevices", dcDugme);
