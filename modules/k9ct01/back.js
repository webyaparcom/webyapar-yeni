/* contact-3 — url alani bos satirlarda href="undefined" yaziliyordu.
   Cozum: ikon/iceriden akilli href turetimi (mailto/tel/harita); link yoksa div. */
var backhtml = ``;
for (var iter of json.data) {
    var c3Text = (iter.text && typeof iter.text === 'object')
        ? (iter.text[json.lang] || iter.text.tr || '')
        : (iter.text || '');
    var c3Icon = iter.icon || '';
    var c3Url = iter.url || '';
    if (!c3Url && c3Text) {
        if (/mail/i.test(c3Icon) || (c3Text.indexOf('@') > -1 && c3Text.indexOf(' ') === -1)) {
            c3Url = 'mailto:' + c3Text.trim();
        } else if (/phone|call/i.test(c3Icon)) {
            c3Url = 'tel:' + c3Text.replace(/\s/g, '');
        } else if (/map|location/i.test(c3Icon)) {
            c3Url = 'https://maps.google.com/?q=' + encodeURIComponent(c3Text);
        }
    }
    var c3Inner = `<span class="material-symbols-outlined" aria-hidden="true">
                   ${c3Icon}
                  </span>
                  <div>${c3Text}</div>`;
    if (c3Url) {
        backhtml += `<a href="${c3Url}" target="_blank" rel="noopener noreferrer" class="modulexcontainerlist">
                  ${c3Inner}
                </a>`;
    } else {
        backhtml += `<div class="modulexcontainerlist">
                  ${c3Inner}
                </div>`;
    }
}
html = html.replace(new RegExp('{{html}}', 'g'), backhtml);
