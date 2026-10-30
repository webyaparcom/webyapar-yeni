/* galeri-masonry - sunucu tarafi: veriyi dile cozer, kartlari/cipleri uretir, istemciye JSON tasir.
   Yer tutucular: gmvars gmclass gmhead gmchips gmitems gmcount gmempty gmveri.
   Veri: json.data (yoksa desing.items) = [{img, thumb?, title{}, cat, w, h, alt{}}]; kategoriler desing.cats = [{id, name{}}]. */
var gmDes = json.desing || {};
var gmLang = json.lang || "tr";

function gmEsc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function gmBool(v, d) {
  if (v === undefined || v === null || v === "") { return d; }
  return !(v === false || v === "false" || v === 0 || v === "0");
}

function gmNum(v, d, mn, mx) {
  var n = parseInt(v, 10);
  if (!isFinite(n)) { n = d; }
  return Math.min(mx, Math.max(mn, n));
}

/* Guvenli gorsel yolu: "/", http(s) ve data:image kabul; javascript: vb. reddedilir; yalin ad -> /img/<ad> */
function gmUrl(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|file):/i.test(s)) { return ""; }
  if (/^data:/i.test(s)) { return /^data:image\//i.test(s) ? s : ""; }
  if (s.charAt(0) === "/" || /^https?:\/\//i.test(s)) { return s; }
  return "/img/" + s;
}

function gmPick(v) {
  return wmPickLang(v, gmLang);
}

function gmDim(v, d) {
  var n = parseInt(v, 10);
  return isFinite(n) && n > 0 && n < 20000 ? n : d;
}

/* Cogul tablosu {zero|one|two|few|many|other: {tr,en,ar}} -> aktif dil icin {kategori: metin}.
   Yalniz bu dilde tanimli formlar (one/other icin yedek zincirli) alinir. */
function gmForms(tbl) {
  var f = {};
  var k;
  for (k in tbl || {}) {
    if (!Object.prototype.hasOwnProperty.call(tbl, k)) { continue; }
    var v = tbl[k];
    if (v && typeof v === "object") {
      if (v[gmLang] !== undefined && String(v[gmLang]).trim() !== "") {
        f[k] = String(v[gmLang]);
      } else if (k === "one" || k === "other") {
        f[k] = wmPickLang(v, gmLang);
      }
    }
  }
  return f;
}

function gmCogul(n, f) {
  var kat = "other";
  try { kat = new Intl.PluralRules(gmLang).select(n); } catch (e) { kat = n === 1 ? "one" : "other"; }
  if (n === 0 && f.zero !== undefined) { kat = "zero"; }
  var t = f[kat] !== undefined ? f[kat] : f.other;
  return String(t === undefined ? "" : t).replace(/\{n\}/g, String(n));
}

var gmItems = json.data && json.data.length ? json.data : (Array.isArray(gmDes.items) ? gmDes.items : []);
var gmCatsRaw = Array.isArray(gmDes.cats) ? gmDes.cats : [];

var gmFilter = gmBool(gmDes.filter, true);
var gmLightbox = gmBool(gmDes.lightbox, true);
var gmLazy = gmBool(gmDes.lazy, true);
var gmCaptions = String(gmDes.captions || "hover");
if (gmCaptions !== "hover" && gmCaptions !== "always" && gmCaptions !== "none") { gmCaptions = "hover"; }

var gmCols = gmDes.columns && typeof gmDes.columns === "object" ? gmDes.columns : {};
var gmCd = gmNum(gmCols.d, 4, 1, 8);
var gmCt = gmNum(gmCols.t, 3, 1, 6);
var gmCm = gmNum(gmCols.m, 2, 1, 4);

var gmRatio = String(gmDes.ratio || "auto");
var gmRatioM = /^(\d{1,2}):(\d{1,2})$/.exec(gmRatio);
var gmFixed = !!(gmRatioM && Number(gmRatioM[1]) > 0 && Number(gmRatioM[2]) > 0);

var gmVars = "--gm-cd:" + gmCd + ";--gm-ct:" + gmCt + ";--gm-cm:" + gmCm + ";" +
  (gmFixed ? "--gm-ar:" + gmRatioM[1] + " / " + gmRatioM[2] + ";" : "");

var gmClass = (gmFixed ? " modulex-gm-fixed" : " modulex-gm-masonry") +
  (parseFloat(gmDes.gap) === 0 ? " modulex-gm-flush" : "") +
  " modulex-gm-cap-" + gmCaptions;

/* Kategori adlari ve kullanilan kategoriler (bos kategori cipi gosterilmez) */
var gmCatName = {};
var gmCatOrder = [];
var gmi;
for (gmi = 0; gmi < gmCatsRaw.length; gmi++) {
  if (gmCatsRaw[gmi] && gmCatsRaw[gmi].id != null) {
    gmCatName[String(gmCatsRaw[gmi].id)] = gmPick(gmCatsRaw[gmi].name);
    gmCatOrder.push(String(gmCatsRaw[gmi].id));
  }
}
var gmCatCount = {};
for (gmi = 0; gmi < gmItems.length; gmi++) {
  var gmC = gmItems[gmi] && gmItems[gmi].cat != null ? String(gmItems[gmi].cat) : "";
  if (gmC) { gmCatCount[gmC] = (gmCatCount[gmC] || 0) + 1; }
}

/* Ogeler */
var gmHtml = "";
for (gmi = 0; gmi < gmItems.length; gmi++) {
  var it = gmItems[gmi] || {};
  var cat = it.cat != null ? String(it.cat) : "";
  var title = gmPick(it.title);
  var alt = gmPick(it.alt) || title;
  var w = gmDim(it.w, 800);
  var h = gmDim(it.h, 600);
  var full = gmUrl(it.img);
  var thumb = gmUrl(it.thumb) || full;
  var catLabel = gmCatName[cat] || "";

  var inner = "";
  if (thumb) {
    inner += '<img class="modulex-gm-img" src="' + gmEsc(thumb) + '" alt="' + gmEsc(alt) + '" width="' + w + '" height="' + h +
      '" loading="' + (gmLazy ? "lazy" : "eager") + '" decoding="async" />';
  } else {
    inner += '<span class="modulex-gm-ph" role="img" aria-label="' + gmEsc(alt) + '">' +
      '<span class="material-symbols-outlined" aria-hidden="true">image</span>' +
      (title ? '<span class="modulex-gm-ph-t">' + gmEsc(title) + "</span>" : "") + "</span>";
  }
  if (thumb && gmCaptions !== "none" && (title || catLabel)) {
    inner += '<span class="modulex-gm-cap" aria-hidden="true">' +
      (title ? '<span class="modulex-gm-cap-t">' + gmEsc(title) + "</span>" : "") +
      (catLabel ? '<span class="modulex-gm-cap-c">' + gmEsc(catLabel) + "</span>" : "") + "</span>";
  }

  var body;
  if (gmLightbox && full) {
    body = '<a class="modulex-gm-link" href="' + gmEsc(full) + '" data-mx-lb-src="' + gmEsc(full) + '" data-mx-lb-alt="' + gmEsc(alt) +
      '" data-mx-lb-title="' + gmEsc(title) + '" data-mx-lb-caption="' + gmEsc(catLabel) + '" aria-haspopup="dialog">' + inner + "</a>";
  } else {
    body = '<div class="modulex-gm-link modulex-gm-static">' + inner + "</div>";
  }
  gmHtml += '<li class="modulex-gm-item' + (thumb ? "" : " modulex-gm-item-ph") + '" data-gm-cat="' + gmEsc(cat) +
    '" style="--gm-w:' + w + ";--gm-h:" + h + ';animation-delay:' + Math.min(gmi, 12) * 0.04 + 's">' + body + "</li>";
}

/* Baslik */
var gmTitle = gmPick(gmDes.title);
var gmDesc = gmPick(gmDes.description);
var gmHead = "";
if (gmTitle || gmDesc) {
  gmHead = '<header class="modulex-gm-head">' +
    (gmTitle ? '<h2 class="modulex-gm-title">' + gmEsc(gmTitle) + "</h2>" : "") +
    (gmDesc ? '<p class="modulex-gm-desc">' + gmEsc(gmDesc) + "</p>" : "") + "</header>";
}

/* Filtre cipleri (JS gelene dek hidden; JS yoksa filtre anlamsiz) */
var gmChips = "";
var gmUsedCats = [];
for (gmi = 0; gmi < gmCatOrder.length; gmi++) {
  if (gmCatCount[gmCatOrder[gmi]]) { gmUsedCats.push(gmCatOrder[gmi]); }
}
var gmShowFilter = gmFilter && gmUsedCats.length > 1;
if (gmShowFilter) {
  gmChips = '<div class="modulex-gm-chips" role="group" aria-label="' + gmEsc(gmPick(gmDes.filterLabel)) + '" hidden>' +
    '<button type="button" class="modulex-gm-chip" data-gm-cat="" aria-pressed="true">' + gmEsc(gmPick(gmDes.allLabel)) +
    ' <bdi class="modulex-gm-chip-n">' + gmItems.length + "</bdi></button>";
  for (gmi = 0; gmi < gmUsedCats.length; gmi++) {
    gmChips += '<button type="button" class="modulex-gm-chip" data-gm-cat="' + gmEsc(gmUsedCats[gmi]) + '" aria-pressed="false">' +
      gmEsc(gmCatName[gmUsedCats[gmi]]) + ' <bdi class="modulex-gm-chip-n">' + gmCatCount[gmUsedCats[gmi]] + "</bdi></button>";
  }
  gmChips += "</div>";
}

var gmForm = gmForms(gmDes.countText);
var gmCountText = gmShowFilter ? gmCogul(gmItems.length, gmForm) : "";
var gmEmpty = gmItems.length ? "" : '<p class="modulex-gm-empty">' + gmEsc(gmPick(gmDes.emptyText)) + "</p>";

var gmLbLabels = {};
var gmLbSrc = gmDes.lightboxLabels || {};
var gmLbKey;
for (gmLbKey in gmLbSrc) {
  if (Object.prototype.hasOwnProperty.call(gmLbSrc, gmLbKey)) { gmLbLabels[gmLbKey] = gmPick(gmLbSrc[gmLbKey]); }
}

var gmVeri = JSON.stringify({
  lang: gmLang,
  filter: gmShowFilter,
  lightbox: gmLightbox,
  prefix: String(gmDes.urlPrefix || ""),
  count: gmForm,
  lb: gmLbLabels
}).replace(/</g, "\\u003c");

html = html.replace(/\{\{gmvars\}\}/g, function () { return gmVars; });
html = html.replace(/\{\{gmclass\}\}/g, function () { return gmClass; });
html = html.replace(/\{\{gmhead\}\}/g, function () { return gmHead; });
html = html.replace(/\{\{gmchips\}\}/g, function () { return gmChips; });
html = html.replace(/\{\{gmitems\}\}/g, function () { return gmHtml; });
html = html.replace(/\{\{gmcount\}\}/g, function () { return gmEsc(gmCountText); });
html = html.replace(/\{\{gmempty\}\}/g, function () { return gmEmpty; });
html = html.replace(/\{\{gmveri\}\}/g, function () { return gmVeri; });
