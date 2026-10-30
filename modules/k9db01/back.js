/* demo-bandi — sunucu tarafi: ton tablosu, CTA baglantisi (dis/ic), metinlerin kacisli basilmasi.
   Not: bandBg/bandFg bos birakilirsa ton tablosundaki site-token renkleri kullanilir. */
var dbEsc = function (v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};
var dbDes = json.desing || {};
var dbLang = json.lang || "tr";
var dbTonlar = {
  /* info: sitenin metin/zemin renklerinin TERSI → her palette (acik/koyu) metin-zemin kontrasti kadar okunur */
  info: { bg: "var(--mx-site-text, #1b1b1b)", fg: "var(--mx-site-bg, #ffffff)" },
  accent: { bg: "var(--mx-site-primary, #2563eb)", fg: "var(--mx-site-primary-contrast, #ffffff)" },
  warning: { bg: "#fde68a", fg: "#3b2a00" }
};
var dbTon = dbTonlar[String(dbDes.tone || "info")] ? String(dbDes.tone || "info") : "info";
var dbBg = String(dbDes.bandBg || "").trim() || dbTonlar[dbTon].bg;
var dbFg = String(dbDes.bandFg || "").trim() || dbTonlar[dbTon].fg;
/* CSS degeri enjeksiyonu: yalniz guvenli karakterler (var(), color-mix(), hex, rgb) */
var dbCssGuvenli = function (v) {
  return /^[a-zA-Z0-9#%,.()\s-]+$/.test(v) ? v : "";
};
dbBg = dbCssGuvenli(dbBg) || dbTonlar[dbTon].bg;
dbFg = dbCssGuvenli(dbFg) || dbTonlar[dbTon].fg;
var dbHrefHam = String(dbDes.ctaHref || "").trim();
var dbDis = /^(https?:)?\/\//i.test(dbHrefHam);
var dbHref = "";
if (/^javascript:/i.test(dbHrefHam)) {
  dbHref = "";
} else if (dbHrefHam) {
  dbHref = dbDis ? dbHrefHam : wxLangInternalHref(dbHrefHam);
}
var dbSet = function (anahtar, deger) {
  html = html.split("{{" + anahtar + "}}").join(deger);
};
dbSet("dbTon", dbTon);
dbSet("dbBgCss", dbBg);
dbSet("dbFgCss", dbFg);
dbSet("dbHref", dbEsc(dbHref));
dbSet("dbHedef", dbDis ? ' target="_blank" rel="noopener noreferrer"' : "");
dbSet("dbYeniSekme", dbDis ? '<span class="mx-visually-hidden"> ' + dbEsc(wmPickLang(dbDes.newTabText, dbLang)) + "</span>" : "");
dbSet("text", dbEsc(wmPickLang(dbDes.text, dbLang)));
dbSet("ctaText", dbEsc(wmPickLang(dbDes.ctaText, dbLang)));
dbSet("ariaLabel", dbEsc(wmPickLang(dbDes.ariaLabel, dbLang)));
/* CTA metni ya da baglantisi bossa baglanti hic cizilmez */
if (!dbHref || !wmPickLang(dbDes.ctaText, dbLang)) {
  html = html.replace(/<a class="modulex-db-cta"[\s\S]*?<\/a>/, "");
}
