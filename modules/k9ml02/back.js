/* menu-liste back.js — sunucu tarafı (render anında).
   Menü/fiyat verisini (kategori, ürün, alerjen, etiket) render diline çözüp HTML'e basar (JS kapalıyken de tam liste görünür),
   istemci süzgeci için küçük bir JSON verisi üretir. Görünür metinlerin tamamı index.json desing'dedir (W1).
   html içinde: {{toolsHtml}} {{printHtml}} {{tabsHtml}} {{menuHtml}} {{legendHtml}} {{veri}} {{ui:anahtar}} */
try {
  var mlD = json.desing || {};
  var mlL = json.lang || "tr";
  var mlEsc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  var mlPick = function (v) { return wmPickLang(v, mlL); };
  var mlSablon = function (s, v) {
    return String(s || "").replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] !== undefined ? String(v[k]) : m; });
  };
  var mlSafeSrc = function (s) {
    var v = String(s || "").trim();
    if (!v || /^\s*(javascript|data|vbscript):/i.test(v)) { return ""; }
    return v;
  };
  var mlSlug = function (s) { return String(s || "").replace(/[^A-Za-z0-9_-]/g, ""); };

  /* ui sözlüğü (çoğul tabloları nesne olarak kalır) */
  var mlUi = {};
  var mlUiSrc = mlD.ui || {};
  for (var mlK in mlUiSrc) {
    if (!Object.prototype.hasOwnProperty.call(mlUiSrc, mlK)) { continue; }
    var mlV = mlUiSrc[mlK];
    if (mlV && typeof mlV === "object" && ((mlV[mlL] && typeof mlV[mlL] === "object") || (!mlV[mlL] && mlV.tr && typeof mlV.tr === "object"))) {
      mlUi[mlK] = mlV[mlL] && typeof mlV[mlL] === "object" ? mlV[mlL] : mlV.tr;
    } else {
      mlUi[mlK] = mlPick(mlV);
    }
  }

  var mlMode = mlD.mode === "fiyat" ? "fiyat" : "menu";
  var mlCur = mlD.currency || "₺";
  var mlFmt0 = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  var mlFmt2 = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var mlMoney = function (n, cur) {
    return (Math.round(n) === n ? mlFmt0.format(n) : mlFmt2.format(n)) + " " + cur;
  };

  /* alerjen sözlüğü (index.json'daki sıra korunur) */
  var mlAlSrc = mlD.allergens || {};
  var mlAlIds = Object.keys(mlAlSrc);
  var mlAl = {};
  for (var mla = 0; mla < mlAlIds.length; mla++) {
    var mlA = mlAlSrc[mlAlIds[mla]] || {};
    mlAl[mlAlIds[mla]] = { icon: String(mlA.icon || "info"), code: mlPick(mlA.code), name: mlPick(mlA.name) };
  }
  var mlTagSrc = mlD.tagLabels || {};
  var mlTagIcons = mlD.tagIcons || {};
  var mlTagLabel = function (id) { return mlTagSrc[id] ? mlPick(mlTagSrc[id]) : id; };

  var mlShowAl = mlD.showAllergens !== false;

  /* kategori + ürün normalizasyonu */
  var mlCats = [];
  var mlCatSrc = Array.isArray(mlD.categories) ? mlD.categories : [];
  var mlUsedAl = {};
  var mlUsedTag = {};
  var mlFlat = [];
  for (var mlc = 0; mlc < mlCatSrc.length; mlc++) {
    var mlC = mlCatSrc[mlc] || {};
    var mlItems = [];
    var mlItSrc = Array.isArray(mlC.items) ? mlC.items : [];
    for (var mli = 0; mli < mlItSrc.length; mli++) {
      var mlI = mlItSrc[mli] || {};
      var mlPr = mlI.price === undefined || mlI.price === null || mlI.price === "" ? null : Number(mlI.price);
      var mlAls = [];
      var mlAlsSrc = Array.isArray(mlI.allergens) ? mlI.allergens : [];
      for (var mlq = 0; mlq < mlAlsSrc.length; mlq++) {
        if (mlAl[mlAlsSrc[mlq]] && mlAls.indexOf(mlAlsSrc[mlq]) === -1) { mlAls.push(mlAlsSrc[mlq]); mlUsedAl[mlAlsSrc[mlq]] = true; }
      }
      var mlTgs = [];
      var mlTgSrc = Array.isArray(mlI.tags) ? mlI.tags : [];
      for (var mlt = 0; mlt < mlTgSrc.length; mlt++) {
        if (mlTagSrc[mlTgSrc[mlt]] && mlTgs.indexOf(mlTgSrc[mlt]) === -1) { mlTgs.push(mlTgSrc[mlt]); mlUsedTag[mlTgSrc[mlt]] = true; }
      }
      var mlItem = {
        n: mlItems.length,
        name: mlPick(mlI.name),
        desc: mlPick(mlI.desc),
        priceText: mlPr !== null && isFinite(mlPr) ? mlMoney(mlPr, mlI.currency || mlCur) : "",
        from: mlI.from === true,
        duration: Number(mlI.duration) > 0 ? Number(mlI.duration) : 0,
        allergens: mlAls,
        tags: mlTgs,
        img: mlSafeSrc(mlI.img)
      };
      mlItems.push(mlItem);
    }
    mlCats.push({ id: mlSlug(mlC.id) || "c" + mlc, name: mlPick(mlC.name), desc: mlPick(mlC.desc), items: mlItems });
  }

  /* ---- HTML parçaları ---- */
  var mlCode = function (id) {
    var a = mlAl[id];
    return '<li class="modulex-ml-al" title="' + mlEsc(a.name) + '" data-a="' + mlEsc(id) + '">' +
      '<span class="material-symbols-outlined" aria-hidden="true">' + mlEsc(a.icon) + "</span>" +
      '<span class="modulex-ml-alcode" aria-hidden="true">' + mlEsc(a.code) + "</span>" +
      '<span class="modulex-ml-sr">' + mlEsc(a.name) + "</span></li>";
  };

  var mlMenuHtml = "";
  var mlItemNo = 0;
  var mlItemsData = [];
  for (var mlx = 0; mlx < mlCats.length; mlx++) {
    var mlCt = mlCats[mlx];
    var mlSecId = "ml-{{id}}-cat-" + mlx;
    mlMenuHtml += '<section class="modulex-ml-cat" data-c="' + mlx + '" aria-labelledby="' + mlSecId + '-h">' +
      '<h3 class="modulex-ml-cath" id="' + mlSecId + '-h">' + mlEsc(mlCt.name) + "</h3>" +
      (mlCt.desc ? '<p class="modulex-ml-catd">' + mlEsc(mlCt.desc) + "</p>" : "") +
      '<ul class="modulex-ml-items">';
    for (var mly = 0; mly < mlCt.items.length; mly++) {
      var it = mlCt.items[mly];
      var mlSearch = [it.name, it.desc];
      var mlYok = {};
      for (var mlz = 0; mlz < mlAlIds.length; mlz++) { mlYok[mlAlIds[mlz]] = it.allergens.indexOf(mlAlIds[mlz]) === -1; }
      var mlGv = {};
      for (var mlw = 0; mlw < it.tags.length; mlw++) { mlGv[it.tags[mlw]] = true; mlSearch.push(mlTagLabel(it.tags[mlw])); }
      mlItemsData.push({ i: mlItemNo, c: mlx, s: mlSearch.join(" "), y: mlYok, g: mlGv });
      mlMenuHtml += '<li class="modulex-ml-item' + (it.img ? " modulex-ml-hasimg" : "") + '" data-i="' + mlItemNo + '">';
      if (it.img) { mlMenuHtml += '<img class="modulex-ml-img" src="' + mlEsc(it.img) + '" alt="" loading="lazy" decoding="async">'; }
      mlMenuHtml += '<div class="modulex-ml-body"><div class="modulex-ml-line"><h4 class="modulex-ml-name">' + mlEsc(it.name) + "</h4>";
      mlMenuHtml += '<span class="modulex-ml-dots" aria-hidden="true"></span>';
      if (it.priceText) {
        mlMenuHtml += '<span class="modulex-ml-price">' + (it.from ? '<span class="modulex-ml-from">' + mlEsc(mlUi.from) + "</span> " : "") +
          '<bdi dir="ltr" class="mx-ltr">' + mlEsc(it.priceText) + "</bdi></span>";
      }
      mlMenuHtml += "</div>";
      if (it.tags.length) {
        mlMenuHtml += '<ul class="modulex-ml-tags">';
        for (var mlu = 0; mlu < it.tags.length; mlu++) {
          mlMenuHtml += '<li class="modulex-ml-tag"><span class="material-symbols-outlined" aria-hidden="true">' + mlEsc(mlTagIcons[it.tags[mlu]] || "label") + "</span>" + mlEsc(mlTagLabel(it.tags[mlu])) + "</li>";
        }
        mlMenuHtml += "</ul>";
      }
      if (it.desc) { mlMenuHtml += '<p class="modulex-ml-desc">' + mlEsc(it.desc) + "</p>"; }
      if (it.duration) { mlMenuHtml += '<p class="modulex-ml-dur"><span class="material-symbols-outlined" aria-hidden="true">schedule</span>' + mlEsc(mlSablon(mlUi.minUnit, { n: it.duration })) + "</p>"; }
      if (mlShowAl && it.allergens.length) {
        mlMenuHtml += '<div class="modulex-ml-alwrap"><span class="modulex-ml-alhead">' + mlEsc(mlUi.contains) + '</span><ul class="modulex-ml-als" aria-label="' + mlEsc(mlUi.allergensLabel) + '">';
        for (var mlv = 0; mlv < it.allergens.length; mlv++) { mlMenuHtml += mlCode(it.allergens[mlv]); }
        mlMenuHtml += "</ul></div>";
      }
      mlMenuHtml += "</div></li>";
      mlItemNo += 1;
    }
    mlMenuHtml += "</ul></section>";
  }

  /* kategori sekmeleri */
  var mlAllTab = mlD.allTab !== false;
  var mlTabsHtml = "";
  if (mlCats.length > 1 || mlAllTab) {
    var mlTabIdx = 0;
    var mlTabBtn = function (key, label) {
      var selected = mlTabIdx === 0;
      var h = '<button type="button" role="tab" class="modulex-ml-tab" id="ml-{{id}}-tab-' + mlTabIdx + '" data-k="' + mlEsc(key) + '"' +
        ' aria-controls="ml-{{id}}-panel" aria-selected="' + (selected ? "true" : "false") + '" tabindex="' + (selected ? "0" : "-1") + '">' + mlEsc(label) + "</button>";
      mlTabIdx += 1;
      return h;
    };
    if (mlAllTab) { mlTabsHtml += mlTabBtn("all", mlUi.allTab); }
    for (var mlj = 0; mlj < mlCats.length; mlj++) { mlTabsHtml += mlTabBtn(String(mlj), mlCats[mlj].name); }
  }

  /* süzgeç araçları (arama + alerjen/etiket çipleri) */
  var mlToolsHtml = "";
  var mlFilterAl = mlShowAl && mlMode === "menu" && mlD.filter !== false;
  var mlFilterTags = [];
  var mlFtSrc = Array.isArray(mlD.filterTags) ? mlD.filterTags : [];
  for (var mlf = 0; mlf < mlFtSrc.length; mlf++) { if (mlUsedTag[mlFtSrc[mlf]]) { mlFilterTags.push(mlFtSrc[mlf]); } }
  var mlUsedAlIds = [];
  for (var mlg = 0; mlg < mlAlIds.length; mlg++) { if (mlUsedAl[mlAlIds[mlg]]) { mlUsedAlIds.push(mlAlIds[mlg]); } }
  var mlHasSearch = mlD.search !== false;
  var mlHasChips = (mlFilterAl && mlUsedAlIds.length > 0) || (mlD.filter !== false && mlFilterTags.length > 0);
  if (mlHasSearch || mlHasChips) {
    mlToolsHtml += '<div class="modulex-ml-tools" data-ml="tools" role="group" aria-label="' + mlEsc(mlUi.toolsLabel) + '" hidden>';
    if (mlHasSearch) {
      mlToolsHtml += '<div class="modulex-ml-search"><label class="modulex-ml-sr" for="ml-{{id}}-q">' + mlEsc(mlUi.searchLabel) + "</label>" +
        '<span class="material-symbols-outlined" aria-hidden="true">search</span>' +
        '<input class="modulex-ml-q" id="ml-{{id}}-q" data-ml="q" type="search" autocomplete="off" placeholder="' + mlEsc(mlMode === "fiyat" && mlUi.searchHint_fiyat ? mlUi.searchHint_fiyat : mlUi.searchHint) + '"></div>';
    }
    if (mlHasChips) {
      mlToolsHtml += '<div class="modulex-ml-chips">';
      if (mlFilterAl && mlUsedAlIds.length) {
        mlToolsHtml += '<fieldset class="modulex-ml-fs"><legend class="modulex-ml-leg">' + mlEsc(mlUi.filterTitle) + '</legend>' +
          '<p class="modulex-ml-fhint">' + mlEsc(mlUi.filterHint) + '</p><div class="modulex-ml-chiprow">';
        for (var mlh = 0; mlh < mlUsedAlIds.length; mlh++) {
          var mlAi = mlAl[mlUsedAlIds[mlh]];
          mlToolsHtml += '<button type="button" class="modulex-ml-chip" data-a="' + mlEsc(mlUsedAlIds[mlh]) + '" aria-pressed="false">' +
            '<span class="material-symbols-outlined" aria-hidden="true">' + mlEsc(mlAi.icon) + "</span>" + mlEsc(mlSablon(mlUi.without, { name: mlAi.name })) + "</button>";
        }
        mlToolsHtml += "</div></fieldset>";
      }
      if (mlD.filter !== false && mlFilterTags.length) {
        mlToolsHtml += '<fieldset class="modulex-ml-fs"><legend class="modulex-ml-leg">' + mlEsc(mlUi.filterTagsTitle) + '</legend><div class="modulex-ml-chiprow">';
        for (var mlr = 0; mlr < mlFilterTags.length; mlr++) {
          mlToolsHtml += '<button type="button" class="modulex-ml-chip" data-t="' + mlEsc(mlFilterTags[mlr]) + '" aria-pressed="false">' +
            '<span class="material-symbols-outlined" aria-hidden="true">' + mlEsc(mlTagIcons[mlFilterTags[mlr]] || "label") + "</span>" + mlEsc(mlTagLabel(mlFilterTags[mlr])) + "</button>";
        }
        mlToolsHtml += "</div></fieldset>";
      }
      mlToolsHtml += '<button type="button" class="modulex-ml-clear" data-ml="clear" hidden>' + mlEsc(mlUi.clearFilters) + "</button></div>";
    }
    mlToolsHtml += "</div>";
  }

  var mlPrintHtml = "";
  if (mlD.print !== false) {
    mlPrintHtml = '<button type="button" class="modulex-ml-print" data-ml="print" hidden><span class="material-symbols-outlined" aria-hidden="true">print</span>' + mlEsc(mlUi.printBtn) + "</button>";
  }

  /* alerjen rehberi: 14 alerjen iki tabloya bölünür (masaüstünde yan yana, dar ekranda alt alta; her satır tek simge) */
  var mlLegendHtml = "";
  var mlLegendOn = mlD.allergenLegend !== false && mlShowAl && mlUsedAlIds.length > 0;
  if (mlLegendOn) {
    var mlHalf = Math.ceil(mlAlIds.length / 2);
    mlLegendHtml = '<section class="modulex-ml-legend" aria-labelledby="ml-{{id}}-legh"><h3 class="modulex-ml-legh" id="ml-{{id}}-legh">' + mlEsc(mlUi.legendTitle) + '</h3><div class="modulex-ml-legwrap">';
    for (var mll = 0; mll < 2; mll++) {
      mlLegendHtml += '<table class="modulex-ml-legt"><caption class="modulex-ml-sr">' + mlEsc(mlUi.legendCaption) + '</caption><thead class="modulex-ml-sr"><tr>' +
        '<th scope="col">' + mlEsc(mlUi.legendCode) + '</th><th scope="col">' + mlEsc(mlUi.legendName) + "</th></tr></thead><tbody>";
      for (var mlp = mll * mlHalf; mlp < Math.min(mlAlIds.length, (mll + 1) * mlHalf); mlp++) {
        var mlLa = mlAl[mlAlIds[mlp]];
        mlLegendHtml += '<tr><td class="modulex-ml-legc"><span class="modulex-ml-al"><span class="material-symbols-outlined" aria-hidden="true">' + mlEsc(mlLa.icon) +
          '</span><span class="modulex-ml-alcode">' + mlEsc(mlLa.code) + "</span></span></td><td>" + mlEsc(mlLa.name) + "</td></tr>";
      }
      mlLegendHtml += "</tbody></table>";
    }
    mlLegendHtml += "</div></section>";
  }

  var mlPayload = {
    dil: mlL,
    mode: mlMode,
    count: mlMode === "fiyat" ? mlUi.count_fiyat : mlUi.count_menu,
    cats: mlCats.length,
    usedAl: mlUsedAlIds,
    tags: mlFilterTags,
    items: mlItemsData
  };
  var mlJson = JSON.stringify(mlPayload).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

  var mlRep = function (re, val) { html = html.replace(re, function () { return val; }); };
  mlRep(/\{\{toolsHtml\}\}/g, mlToolsHtml);
  mlRep(/\{\{printHtml\}\}/g, mlPrintHtml);
  mlRep(/\{\{tabsHtml\}\}/g, mlTabsHtml);
  mlRep(/\{\{menuHtml\}\}/g, mlMenuHtml);
  mlRep(/\{\{legendHtml\}\}/g, mlLegendHtml);
  mlRep(/\{\{modeClass\}\}/g, mlMode === "fiyat" ? "modulex-ml-fiyat" : "modulex-ml-menu");
  mlRep(/\{\{veri\}\}/g, mlJson);
  html = html.replace(/\{\{ui:([A-Za-z0-9_]+)\}\}/g, function (m, key) {
    var v = mlUi[key];
    return typeof v === "string" ? mlEsc(v) : "";
  });
} catch (mlHata) {
  html = html.replace(/\{\{(toolsHtml|printHtml|tabsHtml|menuHtml|legendHtml|modeClass)\}\}/g, function () { return ""; })
    .replace(/\{\{veri\}\}/g, function () { return "{}"; }).replace(/\{\{ui:[A-Za-z0-9_]+\}\}/g, function () { return ""; });
}
