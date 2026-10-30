var pagesettingjson = webmakerdata.pagesetting.data.find(
  function(item) { return item.modulestatus && item.modulestatus.page; },
);
var backhtml = `<li class="modulex-menu__item"><a class="modulex-menu_link" href="${wxLangInternalHref('')}">@home@</a></li>`;
if (pagesettingjson) {
  for (var page of webmakerdata[pagesettingjson.path]?.data || []) {
    if (page.status === "play") {
      backhtml += `<li class="modulex-menu__item"><a class="modulex-menu_link" href="/${
        json.lang
      }/${page.path}/">${((page.name && (page.name[json.lang] != null ? page.name[json.lang] : page.name.tr)) || "")}</a></li>`;
    }
  }
}
var color = json.desing.color.replace(/#/g, "");
html = html.replace(/{{html}}/g, backhtml).replace(/#color#/g, color);
