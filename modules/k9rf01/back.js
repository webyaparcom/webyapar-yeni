/* randevu-formu back.js — sunucu tarafı (render anında).
   Yapılan iş: desing'deki dizi/nesne verisini (hizmet, uzman, bölüm, çalışma saatleri, kapalı günler, ui sözlüğü)
   render diline çözüp sayfaya <script type="application/json"> olarak basar; istemci betiği oradan okur.
   Metinlerin tamamı index.json desing'dedir (W1) — burada sabit görünür metin yoktur.
   html içinde: {{veri}} → JSON, {{ui:anahtar}} → ui sözlüğünden düz metin (öznitelik için kaçışlı). */
try {
  var rfD = json.desing || {};
  var rfL = json.lang || "tr";
  var rfEsc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  var rfPick = function (v) { return wmPickLang(v, rfL); };
  var rfNum = function (v, vars, min, max) {
    var n = Number(v);
    if (!isFinite(n)) { n = vars; }
    if (n < min) { n = min; }
    if (n > max) { n = max; }
    return n;
  };
  var rfIso = function (s) { return /^\d{4}-\d{2}-\d{2}$/.test(String(s)) ? String(s) : ""; };
  var rfHm = function (s, vars) { return /^\d{1,2}:\d{2}$/.test(String(s)) ? String(s) : vars; };

  /* ui sözlüğü: {tr,en,ar} → düz metin; çoğul tablosu ({tr:{one,other},ar:{zero,...}}) nesne olarak kalır */
  var rfUi = {};
  var rfSrc = rfD.ui || {};
  for (var rfK in rfSrc) {
    if (!Object.prototype.hasOwnProperty.call(rfSrc, rfK)) { continue; }
    var rfV = rfSrc[rfK];
    if (rfV && typeof rfV === "object" && ((rfV[rfL] && typeof rfV[rfL] === "object") || (!rfV[rfL] && rfV.tr && typeof rfV.tr === "object"))) {
      rfUi[rfK] = rfV[rfL] && typeof rfV[rfL] === "object" ? rfV[rfL] : rfV.tr;
    } else {
      rfUi[rfK] = rfPick(rfV);
    }
  }

  var rfMode = ["randevu", "masa", "gosterim"].indexOf(rfD.mode) !== -1 ? rfD.mode : "randevu";
  var rfSubmit = ["whatsapp", "mailto", "ics"].indexOf(rfD.submit) !== -1 ? rfD.submit : "whatsapp";
  var rfCur = rfD.currency || "₺";
  var rfFmt = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  var rfServices = [];
  var rfSvcSrc = Array.isArray(rfD.services) ? rfD.services : [];
  for (var rfi = 0; rfi < rfSvcSrc.length; rfi++) {
    var rfS = rfSvcSrc[rfi] || {};
    if (!rfS.id) { continue; }
    var rfPrice = rfS.price === undefined || rfS.price === null || rfS.price === "" ? null : Number(rfS.price);
    rfServices.push({
      id: String(rfS.id),
      name: rfPick(rfS.name),
      duration: rfNum(rfS.duration, 30, 5, 600),
      price: rfPrice !== null && isFinite(rfPrice) ? rfPrice : null,
      priceText: rfPrice !== null && isFinite(rfPrice) ? rfFmt.format(rfPrice) + " " + (rfS.currency || rfCur) : ""
    });
  }

  var rfStaff = [];
  var rfStaffSrc = Array.isArray(rfD.staff) ? rfD.staff : [];
  for (var rfj = 0; rfj < rfStaffSrc.length; rfj++) {
    var rfP = rfStaffSrc[rfj] || {};
    if (!rfP.id) { continue; }
    rfStaff.push({
      id: String(rfP.id),
      name: rfPick(rfP.name),
      role: rfPick(rfP.role),
      services: Array.isArray(rfP.services) ? rfP.services.map(String) : []
    });
  }

  var rfSections = [];
  var rfSecSrc = Array.isArray(rfD.sections) ? rfD.sections : [];
  for (var rfm = 0; rfm < rfSecSrc.length; rfm++) {
    var rfC = rfSecSrc[rfm] || {};
    if (rfC.id) { rfSections.push({ id: String(rfC.id), name: rfPick(rfC.name) }); }
  }

  var rfH = rfD.hours || {};
  var rfDays = [];
  var rfDaysSrc = Array.isArray(rfH.days) && rfH.days.length ? rfH.days : [1, 2, 3, 4, 5];
  for (var rfd = 0; rfd < rfDaysSrc.length; rfd++) {
    var rfDn = Number(rfDaysSrc[rfd]);
    if (rfDn >= 1 && rfDn <= 7 && rfDays.indexOf(rfDn) === -1) { rfDays.push(rfDn); }
  }
  var rfBreaks = [];
  var rfBrSrc = Array.isArray(rfH.breaks) ? rfH.breaks : [];
  for (var rfb = 0; rfb < rfBrSrc.length; rfb++) {
    if (rfBrSrc[rfb] && rfBrSrc[rfb].start && rfBrSrc[rfb].end) {
      rfBreaks.push({ start: rfHm(rfBrSrc[rfb].start, "12:00"), end: rfHm(rfBrSrc[rfb].end, "13:00") });
    }
  }
  var rfHours = {
    days: rfDays,
    start: rfHm(rfH.start, "09:00"),
    end: rfHm(rfH.end, "18:00"),
    slot: rfNum(rfH.slot, 30, 5, 240),
    breaks: rfBreaks
  };

  var rfClosed = [];
  var rfClSrc = Array.isArray(rfD.closed) ? rfD.closed : [];
  for (var rfc = 0; rfc < rfClSrc.length; rfc++) {
    if (rfIso(rfClSrc[rfc])) { rfClosed.push(rfIso(rfClSrc[rfc])); }
  }

  var rfWeek = ["mon", "sat", "sun"].indexOf(rfD.weekStart) !== -1 ? rfD.weekStart : (rfL === "ar" ? "sat" : "mon");

  /* KVKK aydınlatma bağlantısı: iç sayfa adı → dil önekli yol; mutlak adres aynen */
  var rfKv = rfD.kvkk || {};
  var rfKvHref = "";
  if (rfKv.href) {
    rfKvHref = typeof wxLangInternalHref === "function" ? wxLangInternalHref(String(rfKv.href)) : String(rfKv.href);
  }
  if (/^\s*(javascript|data|vbscript):/i.test(String(rfKv.href || "")) || /^\s*(javascript|data|vbscript):/i.test(rfKvHref)) { rfKvHref = ""; }

  var rfPayload = {
    dil: rfL,
    mode: rfMode,
    submit: rfSubmit,
    demo: rfD.demo !== false,
    weekStart: rfWeek,
    leadDays: rfNum(rfD.leadDays, 1, 0, 365),
    maxDays: rfNum(rfD.maxDays, 60, 1, 730),
    maxPartySize: rfNum(rfD.maxPartySize, 8, 1, 100),
    masaDuration: rfNum(rfD.masaDuration, 90, 15, 480),
    requireEmail: rfD.requireEmail === true,
    phone: String(rfD.phone || ""),
    email: String(rfD.email || ""),
    location: rfPick(rfD.location),
    services: rfServices,
    staff: rfStaff,
    sections: rfSections,
    hours: rfHours,
    closed: rfClosed,
    kvkk: { text: rfPick(rfKv.text), href: rfKvHref },
    successText: rfPick(rfD.successText),
    ui: rfUi
  };
  var rfJson = JSON.stringify(rfPayload).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

  html = html.replace(/\{\{veri\}\}/g, function () { return rfJson; });
  html = html.replace(/\{\{ui:([A-Za-z0-9_]+)\}\}/g, function (m, key) {
    var v = rfUi[key];
    return typeof v === "string" ? rfEsc(v) : "";
  });
} catch (rfHata) {
  html = html.replace(/\{\{veri\}\}/g, function () { return "{}"; }).replace(/\{\{ui:[A-Za-z0-9_]+\}\}/g, function () { return ""; });
}
