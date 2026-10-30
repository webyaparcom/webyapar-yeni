/* Buton URL'leri dil onekiyle (F3 onarim, 25 Eki 2026): desing *Url degerleri "iletisim", "/tr/iletisim"
   veya tam URL olabilir. Goreli slug alt sayfada /tr/hakkimizda/iletisim gibi kirik yola donusuyordu; dil
   onekli sabit deger (/tr/...) Ingilizce sayfada Turkce sayfaya gidiyordu. Aktif dil onekiyle cozulur. */
function modulexCtaUrl(raw) {
  var s = String(raw == null ? "" : raw).trim();
  if (s === "" || s.charAt(0) === "#" || /^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|javascript:)/i.test(s)) {
    return s;
  }
  s = s.replace(/^\/[a-z]{2}(\/|$)/i, "/");
  return wxLangInternalHref(s);
}
var modulexCtaDesing = json && json.desing && typeof json.desing === "object" ? json.desing : {};
for (var modulexCtaKey in modulexCtaDesing) {
  if (/Url$/.test(modulexCtaKey)) {
    html = html.replace(
      new RegExp("\\{\\{" + modulexCtaKey + "\\}\\}", "g"),
      modulexCtaUrl(wmPickLang(modulexCtaDesing[modulexCtaKey], json.lang))
    );
  }
}
