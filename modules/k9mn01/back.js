// Find the page with `modulestatus.page` set to true
var pagesettingjson = webmakerdata.pagesetting.data.find(
    function(item) { return item.modulestatus && item.modulestatus.page; },
);
// Ana sayfa linki - SEO için title ve aria-label ekle
var backhtml = `<a href="${wxLangInternalHref('')}" class="modulexmenuitem" role="menuitem" title="@home@ - ${webmakerdata.setting.name[json.lang] || ''}" aria-label="@home@">@home@</a>`;
if (pagesettingjson) {
    // Iterate over the relevant data to create HTML content
    for (var iterator of webmakerdata[pagesettingjson.path].data) {
        if (iterator.status == 'play' && iterator.category == '') {
            // Aktif sayfa kontrolü
            var isActive =
                iterator.path === page.path ||
                (page.path === '' && iterator.path === '');
            var activeClass = isActive ? ' modulexmenuactive' : '';
            var pageName = iterator.name[json.lang] || '';
            var pagePath = iterator.pathnext || iterator.path;
            var pageUrl = wxLangInternalHref(pagePath || "");
            
            // SEO için title ve aria-current ekle
            var ariaCurrent = isActive ? ' aria-current="page"' : '';
            var titleAttr = `title="${pageName}"`;
            
            backhtml += `<a href="${pageUrl}" class="modulexmenuitem${activeClass}" role="menuitem"${ariaCurrent} ${titleAttr} aria-label="${pageName}">${pageName}</a>`;
        }
    }
    // Replace the placeholder {{html}} with the generated backhtml content
    html = html.replace(new RegExp('{{html}}', 'g'), backhtml);
}
// Dil linklerini oluştur - mevcut sayfa path'ini koru ve SEO iyileştirmeleri ekle
langhtml = '';
for (var key in webmakerdata.setting.langs) {
    if (webmakerdata.setting.langs[key] == true) {
        // Mevcut sayfa path'ini al - eğer boşsa ana sayfa, değilse aynı path'i kullan
        var currentPagePath = page.path || '';
        var langUrl = '';
        var isCurrentLang = key === json.lang;
        
        langUrl = wxLangHref(key, currentPagePath || "");
        
        // SEO için hreflang ve aria-current ekle
        var hreflangAttr = `hreflang="${key}"`;
        var ariaCurrentAttr = isCurrentLang ? ' aria-current="true"' : '';
        var titleAttr = `title="${webmakerdata.setting.langs[key] || key}"`;
        
        langhtml += `<li role="none"><a href="${langUrl}" ${hreflangAttr}${ariaCurrentAttr} ${titleAttr} aria-label="@language-selector@: ${key}" lang="${key}">${key}</a></li>`;
    }
}
html = html.replace(new RegExp('{{langhtml}}', 'g'), langhtml);
