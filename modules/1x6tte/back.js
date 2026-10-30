/* values-1 — kurumsal deger sutunlari (rakamsiz).
   item: { icon, name: {tr,en}, description: {tr,en} } */

function vl1Lang(val) {
  if (val == null) {
    return "";
  }
  if (typeof val === "object") {
    if (val[json.lang] != null) {
      return val[json.lang];
    }
    if (val.tr != null) {
      return val.tr;
    }
    var vl1Keys = Object.keys(val);
    return vl1Keys.length ? (val[vl1Keys[0]] || "") : "";
  }
  return String(val);
}

var backhtml = "";
var rows = Array.isArray(json.data) ? json.data : [];
for (var vi = 0; vi < rows.length; vi++) {
  var item = rows[vi];
  var name = vl1Lang(item.name);
  if (!name) {
    continue;
  }
  var desc = vl1Lang(item.description);
  var iconName = item.icon ? String(item.icon) : "verified";
  backhtml +=
    '<div class="modulex-values-card" style="animation-delay:' + (vi * 0.08) + 's">' +
    '<div class="modulex-values-icon" aria-hidden="true">' +
    '<span class="material-symbols-outlined">' + iconName + "</span></div>" +
    '<h3 class="modulex-values-card-title">' + name + "</h3>" +
    (desc ? '<p class="modulex-values-card-text">' + desc + "</p>" : "") +
    "</div>";
}
html = html.replace(/{{html}}/g, backhtml);
