/* faq-1 — json.data sorulari akordeon listesine cevirir.
   item: { question: {tr,en}, answer: {tr,en} } */
var backhtml = "";
if (json.data && json.data.length) {
  for (var fi = 0; fi < json.data.length; fi++) {
    var item = json.data[fi];
    var q = (item.question && item.question[json.lang]) || (item.question && item.question.tr) || "";
    var a = (item.answer && item.answer[json.lang]) || (item.answer && item.answer.tr) || "";
    if (!q) {
      continue;
    }
    backhtml +=
      '<div class="modulex-faq-item" style="animation-delay:' + (fi * 0.08) + 's">' +
      '<button type="button" class="modulex-faq-question" onclick="modulexFaqToggle(this)" aria-expanded="false">' +
      "<span>" + q + "</span>" +
      '<span class="material-symbols-outlined" aria-hidden="true">expand_more</span>' +
      "</button>" +
      '<div class="modulex-faq-answer"><div class="modulex-faq-answer-inner">' + a + "</div></div>" +
      "</div>";
  }
}
html = html.replace(/{{html}}/g, backhtml);
