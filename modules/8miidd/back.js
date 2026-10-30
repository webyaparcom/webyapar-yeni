/* stats-1 — sayac bandi. item: { number, suffix, label: {tr,en}, icon } */

function st1Lang(val) {
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
    var st1Keys = Object.keys(val);
    return st1Keys.length ? (val[st1Keys[0]] || "") : "";
  }
  return String(val);
}

var backhtml = "";
var rows = Array.isArray(json.data) ? json.data : [];
for (var si = 0; si < rows.length; si++) {
  var item = rows[si];
  var label = st1Lang(item.label);
  var numberVal = parseInt(item.number, 10);
  if (!label || !isFinite(numberVal)) {
    continue;
  }
  backhtml +=
    '<div class="modulex-stats-item" style="animation-delay:' + (si * 0.1) + 's">' +
    (item.icon ? '<div class="modulex-stats-icon"><span class="material-symbols-outlined" aria-hidden="true">' + item.icon + "</span></div>" : "") +
    '<div class="modulex-stats-number" data-mx-count="' + numberVal + '">0' +
    (item.suffix ? '<span class="modulex-stats-suffix">' + item.suffix + "</span>" : "") +
    "</div>" +
    '<div class="modulex-stats-label">' + label + "</div>" +
    "</div>";
}
html = html.replace(/{{html}}/g, backhtml);
