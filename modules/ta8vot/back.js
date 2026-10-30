// Hero modulu back.js — coklu dil: desing alanlari string veya { tr, en, ar, ... }
function modulexHeroResolveText(value, lang) {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object") {
    if (value[lang]) {
      return value[lang];
    }
    if (value.tr) {
      return value.tr;
    }
    if (value.en) {
      return value.en;
    }
  }
  return "";
}

var heroLang = json.lang || "tr";
var stats = modulexHeroResolveText(json.desing.stats, heroLang);
var statsArr = stats ? stats.split("|") : [];
var statsHtml = "";
for (var i = 0; i < statsArr.length; i += 2) {
  statsHtml += '<div class="modulex-hero-stat"><div class="modulex-hero-stat-number">' + statsArr[i] + '</div><div class="modulex-hero-stat-label">' + statsArr[i + 1] + '</div></div>';
}
html = html.replace(new RegExp("{{stats}}", "g"), statsHtml);

var btn1 = modulexHeroResolveText(json.desing.btn1, heroLang);
var btn1_url = modulexHeroResolveText(json.desing.btn1_url, heroLang) || json.desing.btn1_url || "";
var btn2 = modulexHeroResolveText(json.desing.btn2, heroLang);
var btn2_url = modulexHeroResolveText(json.desing.btn2_url, heroLang) || json.desing.btn2_url || "";
var buttonsHtml = '<a href="' + btn1_url + '" class="modulex-hero-btn modulex-hero-btn-primary">' + btn1 + ' <span class="material-symbols-outlined">arrow_forward</span></a><a href="' + btn2_url + '" class="modulex-hero-btn modulex-hero-btn-secondary">' + btn2 + '</a>';
html = html.replace(new RegExp("{{buttons}}", "g"), buttonsHtml);

var badge = modulexHeroResolveText(json.desing.badge, heroLang);
html = html.replace(new RegExp("{{badge}}", "g"), badge);

var title = modulexHeroResolveText(json.desing.title, heroLang);
html = html.replace(new RegExp("{{title}}", "g"), title);

var desc = modulexHeroResolveText(json.desing.description, heroLang);
html = html.replace(new RegExp("{{description}}", "g"), desc);

var img = json.desing.image || "hero-bg.webp";
html = html.replace(new RegExp("{{image}}", "g"), img);

var alt = modulexHeroResolveText(json.desing.alt, heroLang) || "Hero";
html = html.replace(new RegExp("{{alt}}", "g"), alt);
