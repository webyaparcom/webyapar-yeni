/* pricing-1 — json.data planlarini fiyat kartlarina cevirir.
   item: { plan: {tr,en}, price, period: {tr,en}, note: {tr,en},
           features: "madde|madde" veya {tr:"...",en:"..."},
           ctaText: {tr,en}, ctaUrl, featured: true/false, flag: {tr,en} } */
function pricingLang(val, lang) {
  if (val == null) {
    return "";
  }
  if (typeof val === "object") {
    return val[lang] || val.tr || "";
  }
  return String(val);
}

/* G3 bulgusu (30 Eki 2026): "/slug" ile baslayan IC baglanti dil onekiyle cozulur ("/tr/slug/");
   dis baglanti, "#", "//" ve zaten "/tr/..." ile baslayan yollar aynen kalir. "#kesit" ve "?sorgu" korunur. */
function pricingHref(url) {
  var u = url == null ? "" : String(url).trim();
  if (!/^\/(?!\/)/.test(u) || /^\/(tr|en|ar|de|fr|ru|es|it|nl)(\/|$|[?#])/.test(u)) {
    return u || "#";
  }
  var tail = "";
  var cut = u.search(/[?#]/);
  if (cut > -1) {
    tail = u.slice(cut);
    u = u.slice(0, cut);
  }
  return wxLangInternalHref(u.replace(/^\/+/, "").replace(/\/+$/, "")) + tail;
}
var backhtml = "";
if (json.data && json.data.length) {
  for (var pi = 0; pi < json.data.length; pi++) {
    var item = json.data[pi];
    var plan = pricingLang(item.plan, json.lang);
    if (!plan) {
      continue;
    }
    var price = pricingLang(item.price, json.lang);
    var period = pricingLang(item.period, json.lang);
    var note = pricingLang(item.note, json.lang);
    var ctaText = pricingLang(item.ctaText, json.lang);
    var ctaUrl = pricingHref(item.ctaUrl);
    var flag = pricingLang(item.flag, json.lang);
    var featured = item.featured === true;

    var featuresHtml = "";
    var featuresRaw = pricingLang(item.features, json.lang);
    if (featuresRaw) {
      var parts = String(featuresRaw).split("|");
      for (var fj = 0; fj < parts.length; fj++) {
        if (!parts[fj]) {
          continue;
        }
        featuresHtml +=
          "<li>" +
          '<span class="material-symbols-outlined" aria-hidden="true">check_circle</span>' +
          "<span>" + parts[fj] + "</span>" +
          "</li>";
      }
    }

    backhtml +=
      '<div class="modulex-pricing-card' + (featured ? " modulex-pricing-featured" : "") + '" style="animation-delay:' + (pi * 0.1) + 's">' +
      (featured && flag ? '<div class="modulex-pricing-flag">' + flag + "</div>" : "") +
      '<h3 class="modulex-pricing-plan">' + plan + "</h3>" +
      '<div class="modulex-pricing-price">' +
      '<span class="modulex-pricing-amount">' + price + "</span>" +
      (period ? '<span class="modulex-pricing-period">' + period + "</span>" : "") +
      "</div>" +
      (note ? '<p class="modulex-pricing-note">' + note + "</p>" : "") +
      '<ul class="modulex-pricing-features">' + featuresHtml + "</ul>" +
      (ctaText ? '<a class="modulex-pricing-cta" href="' + ctaUrl + '">' + ctaText + "</a>" : "") +
      "</div>";
  }
}
html = html.replace(/{{html}}/g, backhtml);
