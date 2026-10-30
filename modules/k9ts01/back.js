/* testimonial-1 — manuel musteri yorumu kartlari.
   item: { name, role: {tr,en}, text: {tr,en}, rating (1-5), img } */

function ts1Lang(val) {
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
    var ts1Keys = Object.keys(val);
    return ts1Keys.length ? (val[ts1Keys[0]] || "") : "";
  }
  return String(val);
}

function ts1Stars(rating) {
  var r = Math.max(0, Math.min(5, Math.round(Number(rating) || 5)));
  var out = "";
  for (var si = 0; si < 5; si++) {
    out += si < r ? "\u2605" : "\u2606";
  }
  return out;
}

var backhtml = "";
var rows = Array.isArray(json.data) ? json.data : [];
for (var ti = 0; ti < rows.length; ti++) {
  var item = rows[ti];
  var name = ts1Lang(item.name);
  var text = ts1Lang(item.text);
  if (!name || !text) {
    continue;
  }
  var role = ts1Lang(item.role);
  var avatarHtml = item.img
    ? '<img src="/img/' + json.id + "/" + item.img + '" alt="' + name + '" loading="lazy" />'
    : name.charAt(0).toUpperCase();
  backhtml +=
    '<div class="modulex-testi-card" style="animation-delay:' + (ti * 0.08) + 's">' +
    '<span class="modulex-testi-quote" aria-hidden="true">&ldquo;</span>' +
    '<div class="modulex-testi-stars" aria-label="' + (Number(item.rating) || 5) + '/5">' + ts1Stars(item.rating) + "</div>" +
    '<p class="modulex-testi-text">' + text + "</p>" +
    '<div class="modulex-testi-person">' +
    '<div class="modulex-testi-avatar">' + avatarHtml + "</div>" +
    "<div>" +
    '<div class="modulex-testi-name">' + name + "</div>" +
    (role ? '<div class="modulex-testi-role">' + role + "</div>" : "") +
    "</div>" +
    "</div>" +
    "</div>";
}
html = html.replace(/{{html}}/g, backhtml);
