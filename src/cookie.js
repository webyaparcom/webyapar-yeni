
var MX_CEREZ_ANAHTAR = "mxCerezRizaV1";
var MX_CEREZ_SURUM = 1;
var MX_CEREZ_GECERLILIK_MS = 365 * 24 * 60 * 60 * 1000;
var MX_CEREZ_KATLAR = [
  { id: "islevsel", metin: "cookie-functionality" },
  { id: "analitik", metin: "cookie-performance" },
  { id: "pazarlama", metin: "cookie-targeting" }
];

var MX_COOKIE_I18N = {
  "cookingtext": {
    "tr": "Size daha iyi hizmet sunabilmek için kvkk'na uygun ve sınırlı şekilde verilerinizi topluyoruz. Veri ve çerez politikamızı inceleyebilirsiniz.",
    "ar": "من أجل تقديم خدمة أفضل لك، نجمع بياناتك وفقًا لـ KVKK وبشكل محدود. يمكنك الاطلاع على سياسة البيانات وملفات تعريف الارتباط الخاصة بنا.",
    "de": "Um Ihnen einen besseren Service bieten zu können, erheben wir Ihre Daten gemäß KVKK und in begrenztem Umfang. Sie können unsere Daten- und Cookie-Richtlinie einsehen.",
    "en": "In order to provide you with a better service, we collect your data in accordance with KVKK and in a limited way. You can review our data and cookie policy.",
    "ru": "Чтобы предоставить вам лучший сервис, мы собираем ваши данные в соответствии с KVKK и в ограниченном объеме. Вы можете ознакомиться с нашей политикой в отношении данных и файлов cookie.",
    "es": "Para brindarle un mejor servicio, recopilamos sus datos de acuerdo con KVKK y de forma limitada. Puede revisar nuestra política de datos y cookies.",
    "fr": "Afin de vous fournir un meilleur service, nous collectons vos données conformément au KVKK et de manière limitée. Vous pouvez consulter notre politique en matière de données et de cookies.",
    "it": "Per fornirti un servizio migliore, raccogliamo i tuoi dati in conformità con KVKK e in modo limitato. Puoi consultare la nostra informativa su dati e cookie.",
    "ja": "より良いサービスを提供するため、当社は KVKK に従い限定的な方法でお客様のデータを収集します。データおよび Cookie ポリシーをご確認いただけます。",
    "zh": "为了向您提供更好的服务，我们按照 KVKK 的规定并以有限的方式收集您的数据。您可以查阅我们的数据与 Cookie 政策。",
    "ko": "더 나은 서비스를 제공하기 위해 KVKK에 따라 제한된 방식으로 데이터를 수집합니다. 데이터 및 쿠키 정책을 확인하실 수 있습니다.",
    "pt": "Para lhe prestar um melhor serviço, recolhemos os seus dados de acordo com a KVKK e de forma limitada. Pode consultar a nossa política de dados e cookies."
  },
  "cookie-accept": {
    "tr": "Kabul Et",
    "ar": "قبول",
    "de": "Akzeptieren",
    "en": "Accept",
    "ru": "Принять",
    "es": "Aceptar",
    "fr": "Accepter",
    "it": "Accetta",
    "ja": "同意する",
    "zh": "接受",
    "ko": "동의",
    "pt": "Aceitar"
  },
  "cookie-details": {
    "tr": "Detaylı Bilgi",
    "ar": "معلومات تفصيلية",
    "de": "Weitere Informationen",
    "en": "More info",
    "ru": "Подробнее",
    "es": "Más información",
    "fr": "Plus d'infos",
    "it": "Maggiori informazioni",
    "ja": "詳細",
    "zh": "详细信息",
    "ko": "자세히",
    "pt": "Mais informações"
  },
  "cookie-title": {
    "tr": "Çerez ve Gizlilik Politikası",
    "ar": "سياسة ملفات تعريف الارتباط والخصوصية",
    "de": "Cookie- und Datenschutzrichtlinie",
    "en": "Cookie and Privacy Policy",
    "ru": "Политика в отношении файлов cookie и конфиденциальности",
    "es": "Política de cookies y privacidad",
    "fr": "Politique relative aux cookies et à la confidentialité",
    "it": "Informativa su cookie e privacy",
    "ja": "Cookieとプライバシーポリシー",
    "zh": "Cookie 与隐私政策",
    "ko": "쿠키 및 개인정보 정책",
    "pt": "Política de cookies e privacidade"
  },
  "cookie-intro": {
    "tr": "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Genel Veri Koruma Yönetmeliği (GDPR) uyarınca, web sitemizde aşağıdaki amaçlar için çerezler kullanılmaktadır:",
    "ar": "وفقًا لقانون حماية البيانات الشخصية رقم 6698 (KVKK) واللائحة العامة لحماية البيانات (GDPR)، تُستخدم ملفات تعريف الارتباط في موقعنا للأغراض التالية:",
    "de": "Gemäß dem Gesetz zum Schutz personenbezogener Daten Nr. 6698 (KVKK) und der Datenschutz-Grundverordnung (DSGVO) werden auf unserer Website Cookies für folgende Zwecke verwendet:",
    "en": "In accordance with Personal Data Protection Law No. 6698 (KVKK) and the General Data Protection Regulation (GDPR), cookies are used on our website for the following purposes:",
    "ru": "В соответствии с Законом о защите персональных данных № 6698 (KVKK) и Общим регламентом по защите данных (GDPR) на нашем сайте используются файлы cookie для следующих целей:",
    "es": "De conformidad con la Ley de Protección de Datos Personales n.º 6698 (KVKK) y el Reglamento General de Protección de Datos (GDPR), en nuestro sitio web se utilizan cookies para los siguientes fines:",
    "fr": "Conformément à la loi n° 6698 sur la protection des données personnelles (KVKK) et au règlement général sur la protection des données (RGPD), des cookies sont utilisés sur notre site aux fins suivantes :",
    "it": "In conformità alla legge n. 6698 sulla protezione dei dati personali (KVKK) e al Regolamento generale sulla protezione dei dati (GDPR), sul nostro sito vengono utilizzati cookie per i seguenti scopi:",
    "ja": "個人データ保護法 第6698号（KVKK）および一般データ保護規則（GDPR）に基づき、当サイトでは次の目的で Cookie を使用します。",
    "zh": "根据第 6698 号个人数据保护法（KVKK）和通用数据保护条例（GDPR），本网站将出于以下目的使用 Cookie：",
    "ko": "개인정보 보호법 제6698호(KVKK) 및 일반 개인정보 보호 규정(GDPR)에 따라 본 웹사이트에서는 다음 목적으로 쿠키를 사용합니다.",
    "pt": "Nos termos da Lei n.º 6698 de Proteção de Dados Pessoais (KVKK) e do Regulamento Geral de Proteção de Dados (GDPR), o nosso site utiliza cookies para os seguintes fins:"
  },
  "cookie-mandatory": {
    "tr": "Zorunlu Çerezler: Sitenin temel işlevlerini yerine getirebilmesi için kesinlikle gerekli olan çerezlerdir. Bu çerezler olmadan web sitesinin çalışması mümkün değildir.",
    "ar": "ملفات تعريف الارتباط الإلزامية: ضرورية لتشغيل الوظائف الأساسية للموقع. لا يمكن للموقع العمل بدونها.",
    "de": "Unbedingt erforderliche Cookies: Für die Grundfunktionen der Website zwingend notwendig. Ohne diese Cookies kann die Website nicht funktionieren.",
    "en": "Strictly necessary cookies: Essential for the basic functions of the site. The website cannot operate without these cookies.",
    "ru": "Обязательные файлы cookie: необходимы для базовых функций сайта. Без них сайт не может работать.",
    "es": "Cookies estrictamente necesarias: imprescindibles para las funciones básicas del sitio. El sitio no puede funcionar sin ellas.",
    "fr": "Cookies strictement nécessaires : indispensables aux fonctions de base du site. Le site ne peut pas fonctionner sans eux.",
    "it": "Cookie strettamente necessari: essenziali per le funzioni di base del sito. Il sito non può funzionare senza di essi.",
    "ja": "必須 Cookie: サイトの基本機能に不可欠です。これらがないとサイトは動作しません。",
    "zh": "必要 Cookie：网站基本功能所必需。没有这些 Cookie，网站无法运行。",
    "ko": "필수 쿠키: 사이트의 기본 기능에 반드시 필요합니다. 이 쿠키 없이는 웹사이트가 작동할 수 없습니다.",
    "pt": "Cookies estritamente necessários: essenciais para as funções básicas do site. O site não funciona sem eles."
  },
  "cookie-performance": {
    "tr": "Performans ve Analitik Çerezleri: Sitemizin performansını ölçmek ve iyileştirmek için kullanılır. Ziyaretçilerin siteyi nasıl kullandığı hakkında anonim istatistiksel veriler toplar.",
    "ar": "ملفات تعريف ارتباط الأداء والتحليلات: تُستخدم لقياس أداء الموقع وتحسينه. تجمع بيانات إحصائية مجهولة حول كيفية استخدام الزوار للموقع.",
    "de": "Leistungs- und Analyse-Cookies: Dienen der Messung und Verbesserung der Website-Leistung. Sie erfassen anonyme statistische Daten zur Nutzung.",
    "en": "Performance and analytics cookies: Used to measure and improve site performance. They collect anonymous statistical data about how visitors use the site.",
    "ru": "Файлы cookie производительности и аналитики: используются для измерения и улучшения работы сайта. Собирают анонимные статистические данные о посещениях.",
    "es": "Cookies de rendimiento y analítica: se usan para medir y mejorar el rendimiento del sitio. Recopilan datos estadísticos anónimos sobre el uso.",
    "fr": "Cookies de performance et d'analyse : utilisés pour mesurer et améliorer les performances du site. Ils collectent des données statistiques anonymes sur l'utilisation.",
    "it": "Cookie di prestazione e analitici: usati per misurare e migliorare le prestazioni del sito. Raccolgono dati statistici anonimi sull'utilizzo.",
    "ja": "パフォーマンスおよび分析 Cookie: サイトのパフォーマンス測定と改善に使用します。訪問者の利用状況に関する匿名の統計データを収集します。",
    "zh": "性能与分析 Cookie：用于衡量并改进网站性能。收集访客如何使用网站的匿名统计数据。",
    "ko": "성능 및 분석 쿠키: 사이트 성능을 측정하고 개선하는 데 사용됩니다. 방문자가 사이트를 어떻게 사용하는지에 대한 익명 통계를 수집합니다.",
    "pt": "Cookies de desempenho e análise: usados para medir e melhorar o desempenho do site. Recolhem dados estatísticos anónimos sobre a utilização."
  },
  "cookie-functionality": {
    "tr": "İşlevsellik Çerezleri: Size daha gelişmiş ve kişiselleştirilmiş bir deneyim sunmak için kullanılır. Tercihlerinizi hatırlamak için kullanılır.",
    "ar": "ملفات تعريف ارتباط الوظائف: تُستخدم لتقديم تجربة أكثر تخصيصًا وتذكر تفضيلاتك.",
    "de": "Funktionale Cookies: Ermöglichen ein erweitertes, personalisiertes Erlebnis und speichern Ihre Einstellungen.",
    "en": "Functionality cookies: Used to provide a more advanced, personalised experience and to remember your preferences.",
    "ru": "Функциональные файлы cookie: используются для персонализированного опыта и запоминания ваших предпочтений.",
    "es": "Cookies de funcionalidad: se usan para ofrecer una experiencia más personalizada y recordar sus preferencias.",
    "fr": "Cookies de fonctionnalité : utilisés pour offrir une expérience plus personnalisée et mémoriser vos préférences.",
    "it": "Cookie di funzionalità: usati per offrire un'esperienza più personalizzata e ricordare le tue preferenze.",
    "ja": "機能 Cookie: より高度でパーソナライズされた体験を提供し、設定を記憶するために使用します。",
    "zh": "功能 Cookie：用于提供更个性化的体验并记住您的偏好。",
    "ko": "기능 쿠키: 보다 개인화된 경험을 제공하고 기본 설정을 기억하는 데 사용됩니다.",
    "pt": "Cookies de funcionalidade: usados para oferecer uma experiência mais personalizada e lembrar as suas preferências."
  },
  "cookie-targeting": {
    "tr": "Hedefleme/Reklam Çerezleri: Size ve ilgi alanlarınıza uygun reklamlar göstermek için kullanılır.",
    "ar": "ملفات تعريف ارتباط الاستهداف/الإعلان: تُستخدم لعرض إعلانات تناسبك واهتماماتك.",
    "de": "Targeting-/Werbe-Cookies: Dienen der Anzeige von Werbung, die zu Ihnen und Ihren Interessen passt.",
    "en": "Targeting/advertising cookies: Used to show advertisements that match you and your interests.",
    "ru": "Рекламные файлы cookie: используются для показа рекламы, соответствующей вашим интересам.",
    "es": "Cookies de segmentación/publicidad: se usan para mostrar anuncios acordes a usted y sus intereses.",
    "fr": "Cookies de ciblage/publicité : utilisés pour afficher des publicités correspondant à vos centres d'intérêt.",
    "it": "Cookie di targeting/pubblicitari: usati per mostrare annunci in linea con te e i tuoi interessi.",
    "ja": "ターゲティング／広告 Cookie: お客様の関心に合った広告を表示するために使用します。",
    "zh": "定向/广告 Cookie：用于展示符合您和您兴趣的广告。",
    "ko": "타겟팅/광고 쿠키: 회원님과 관심사에 맞는 광고를 표시하는 데 사용됩니다.",
    "pt": "Cookies de segmentação/publicidade: usados para mostrar anúncios adequados a si e aos seus interesses."
  },
  "cookie-reject": {
    "tr": "Çerezleri kabul etmek istemiyorsanız, tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz. Ancak bu durumda site işlevlerinin bir kısmı düzgün çalışmayabilir.",
    "ar": "إذا كنت لا ترغب في قبول ملفات تعريف الارتباط، يمكنك تعطيلها من إعدادات المتصفح. ومع ذلك قد لا تعمل بعض وظائف الموقع بشكل صحيح.",
    "de": "Wenn Sie Cookies nicht akzeptieren möchten, können Sie sie in den Browsereinstellungen deaktivieren. Einige Funktionen der Website funktionieren dann möglicherweise nicht richtig.",
    "en": "If you do not want to accept cookies, you can disable them in your browser settings. Some site features may then not work properly.",
    "ru": "Если вы не хотите принимать файлы cookie, отключите их в настройках браузера. Некоторые функции сайта могут работать некорректно.",
    "es": "Si no desea aceptar cookies, puede desactivarlas en la configuración del navegador. Algunas funciones del sitio podrían no funcionar correctamente.",
    "fr": "Si vous ne souhaitez pas accepter les cookies, vous pouvez les désactiver dans les paramètres de votre navigateur. Certaines fonctions du site pourraient alors mal fonctionner.",
    "it": "Se non vuoi accettare i cookie, puoi disattivarli nelle impostazioni del browser. Alcune funzioni del sito potrebbero non funzionare correttamente.",
    "ja": "Cookie を受け入れない場合は、ブラウザ設定で無効にできます。その場合、サイトの一部機能が正しく動作しないことがあります。",
    "zh": "如果您不想接受 Cookie，可在浏览器设置中禁用它们。但部分网站功能可能无法正常工作。",
    "ko": "쿠키를 수락하지 않으려면 브라우저 설정에서 쿠키를 사용 중지할 수 있습니다. 이 경우 사이트 기능 일부가 제대로 작동하지 않을 수 있습니다.",
    "pt": "Se não quiser aceitar cookies, pode desativá-los nas definições do browser. Algumas funções do site poderão não funcionar corretamente."
  },
  "cookie-more": {
    "tr": "Daha detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.",
    "ar": "لمزيد من التفاصيل يمكنك الاطلاع على سياسة الخصوصية الخاصة بنا.",
    "de": "Weitere Einzelheiten finden Sie in unserer Datenschutzerklärung.",
    "en": "For more details, you can review our Privacy Policy.",
    "ru": "Подробнее см. в нашей Политике конфиденциальности.",
    "es": "Para más detalles, puede consultar nuestra Política de privacidad.",
    "fr": "Pour plus de détails, vous pouvez consulter notre Politique de confidentialité.",
    "it": "Per maggiori dettagli puoi consultare la nostra Informativa sulla privacy.",
    "ja": "詳細はプライバシーポリシーをご確認ください。",
    "zh": "更多详情请参阅我们的隐私政策。",
    "ko": "자세한 내용은 개인정보 처리방침을 확인해 주세요.",
    "pt": "Para mais detalhes, consulte a nossa Política de Privacidade."
  },
  "cookie-understand": {
    "tr": "Anladım ve Kabul Ediyorum",
    "ar": "فهمت وأوافق",
    "de": "Verstanden und akzeptiert",
    "en": "I understand and accept",
    "ru": "Понятно, принимаю",
    "es": "Entendido y acepto",
    "fr": "J'ai compris et j'accepte",
    "it": "Ho capito e accetto",
    "ja": "理解して同意します",
    "zh": "我已了解并接受",
    "ko": "이해했으며 동의합니다",
    "pt": "Compreendi e aceito"
  },
  "cookie-accept-all": {
    "tr": "Tümünü kabul et",
    "en": "Accept all",
    "ar": "قبول الكل",
    "de": "Alle akzeptieren",
    "ru": "Принять все",
    "es": "Aceptar todo",
    "fr": "Tout accepter",
    "it": "Accetta tutto",
    "ja": "すべて許可",
    "zh": "全部接受",
    "ko": "모두 허용",
    "pt": "Aceitar tudo"
  },
  "cookie-reject-all": {
    "tr": "Tümünü reddet",
    "en": "Reject all",
    "ar": "رفض الكل",
    "de": "Alle ablehnen",
    "ru": "Отклонить все",
    "es": "Rechazar todo",
    "fr": "Tout refuser",
    "it": "Rifiuta tutto",
    "ja": "すべて拒否",
    "zh": "全部拒绝",
    "ko": "모두 거부",
    "pt": "Rejeitar tudo"
  },
  "cookie-prefs": {
    "tr": "Tercihler",
    "en": "Preferences",
    "ar": "التفضيلات",
    "de": "Einstellungen",
    "ru": "Настройки",
    "es": "Preferencias",
    "fr": "Préférences",
    "it": "Preferenze",
    "ja": "設定",
    "zh": "偏好设置",
    "ko": "설정",
    "pt": "Preferências"
  },
  "cookie-save": {
    "tr": "Seçimleri kaydet",
    "en": "Save choices",
    "ar": "حفظ الاختيارات",
    "de": "Auswahl speichern",
    "ru": "Сохранить выбор",
    "es": "Guardar selección",
    "fr": "Enregistrer mes choix",
    "it": "Salva scelte",
    "ja": "選択を保存",
    "zh": "保存选择",
    "ko": "선택 저장",
    "pt": "Salvar escolhas"
  }
};

function mxCookieLang() {
  var htmlLang = "";
  if (document.documentElement && document.documentElement.getAttribute) {
    htmlLang = document.documentElement.getAttribute("lang") || "";
  }
  htmlLang = String(htmlLang).toLowerCase().replace(/_/g, "-");
  if (htmlLang.indexOf("-") !== -1) {
    htmlLang = htmlLang.split("-")[0];
  }
  if (htmlLang.length >= 2 && MX_COOKIE_I18N.cookingtext[htmlLang]) {
    return htmlLang;
  }
  var path = "";
  try {
    path = window.location.pathname || "";
  } catch (ePath) {
    path = "";
  }
  var m = String(path).match(/^\/([a-z]{2})(\/|$)/i);
  if (m && MX_COOKIE_I18N.cookingtext[m[1].toLowerCase()]) {
    return m[1].toLowerCase();
  }
  return "tr";
}

function mxCookieT(key) {
  var pack = MX_COOKIE_I18N[key] || {};
  var lang = mxCookieLang();
  if (pack[lang] != null && String(pack[lang]) !== "") {
    return String(pack[lang]);
  }
  if (pack.en != null && String(pack.en) !== "") {
    return String(pack.en);
  }
  if (pack.tr != null) {
    return String(pack.tr);
  }
  return "";
}

function mxCookieEsc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function checkCookie(name) {
  var parts = document.cookie.split(";");
  var i;
  var part;
  for (i = 0; i < parts.length; i++) {
    part = parts[i].replace(/^\s+/, "");
    if (part.indexOf(name + "=") === 0) {
      return true;
    }
  }
  return false;
}

function setCookie(name, value, days) {
  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/;SameSite=Lax";
}


function mxCerezRizaOku() {
  try {
    var ham = window.localStorage.getItem(MX_CEREZ_ANAHTAR);
    if (!ham) {
      return null;
    }
    var r = JSON.parse(ham);
    if (!r || typeof r !== "object") {
      return null;
    }
    if ((parseInt(r.surum, 10) || 0) !== MX_CEREZ_SURUM) {
      return null;
    }
    var t = Date.parse(r.zaman);
    if (isNaN(t) || Date.now() - t > MX_CEREZ_GECERLILIK_MS) {
      return null;
    }
    return r;
  } catch (e) {
    return null;
  }
}

function mxCerezYay(r) {
  try {
    window.dispatchEvent(new CustomEvent("mx:cerez-riza", { detail: r }));
  } catch (e) {}
}

function mxCerezKaydet(secim) {
  var r = { surum: MX_CEREZ_SURUM, zaman: new Date().toISOString(), zorunlu: true };
  var hepsi = true;
  var i;
  for (i = 0; i < MX_CEREZ_KATLAR.length; i++) {
    r[MX_CEREZ_KATLAR[i].id] = secim[MX_CEREZ_KATLAR[i].id] === true;
    if (!r[MX_CEREZ_KATLAR[i].id]) {
      hepsi = false;
    }
  }
  try {
    window.localStorage.setItem(MX_CEREZ_ANAHTAR, JSON.stringify(r));
  } catch (e) {}
  if (hepsi) {
    setCookie("cookieConsent", "true", 365);
  } else {
    setCookie("cookieConsent", "", -1);
  }
  hideCookieNotice();
  mxCerezYeniden(true);
  mxCerezYay(r);
}

function mxCerezHepsi(deger) {
  var s = {};
  var i;
  for (i = 0; i < MX_CEREZ_KATLAR.length; i++) {
    s[MX_CEREZ_KATLAR[i].id] = deger;
  }
  return s;
}

function mxCerezKutulardan() {
  var s = {};
  var i;
  for (i = 0; i < MX_CEREZ_KATLAR.length; i++) {
    var cb = document.querySelector('.cookie-modal [data-mx-cerez-kat="' + MX_CEREZ_KATLAR[i].id + '"]');
    s[MX_CEREZ_KATLAR[i].id] = !!(cb && cb.checked);
  }
  return s;
}


function mxCerezYeniden(goster) {
  var b = document.querySelector(".cookie-reopen");
  if (!b && goster) {
    b = document.createElement("button");
    b.type = "button";
    b.className = "cookie-reopen";
    b.setAttribute("data-mx-cerez-tercih", "");
    b.setAttribute("aria-label", mxCookieT("cookie-prefs"));
    b.setAttribute("title", mxCookieT("cookie-prefs"));
    b.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5zm-3.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm2 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>';
    document.body.appendChild(b);
  }
  if (b) {
    if (goster) {
      b.removeAttribute("hidden");
    } else {
      b.setAttribute("hidden", "");
    }
  }
}

function hideCookieNotice() {
  var banner = document.querySelector(".cookie-banner");
  var modal = document.querySelector(".cookie-modal");
  var overlay = document.querySelector(".modal-overlay");
  if (banner) banner.parentNode.removeChild(banner);
  if (modal) modal.parentNode.removeChild(modal);
  if (overlay) overlay.parentNode.removeChild(overlay);
  
  document.documentElement.style.removeProperty("--mx-cookie-pad");
}


function mxCerezAlanAyarla() {
  var banner = document.querySelector(".cookie-banner");
  var root = document.documentElement;
  if (!banner) {
    root.style.removeProperty("--mx-cookie-pad");
    return;
  }
  var r = banner.getBoundingClientRect();
  
  var alt = Math.max(0, window.innerHeight - r.bottom);
  root.style.setProperty("--mx-cookie-pad", Math.ceil(r.height + alt + 16) + "px");
}
window.addEventListener("resize", mxCerezAlanAyarla);

function mxCerezDugmeler(ortaEtiket, ortaIslev) {
  var t = mxCookieEsc;
  return (
    '<button type="button" onclick="rejectCookies()" class="cookie-btn reject-btn">' +
    t(mxCookieT("cookie-reject-all")) +
    "</button>" +
    '<button type="button" onclick="' + ortaIslev + '()" class="cookie-btn details-btn">' +
    t(mxCookieT(ortaEtiket)) +
    "</button>" +
    '<button type="button" onclick="acceptCookies()" class="cookie-btn accept-btn">' +
    t(mxCookieT("cookie-accept-all")) +
    "</button>"
  );
}

function mxCerezCiz() {
  var t = mxCookieEsc;
  var onceki = mxCerezRizaOku() || {};
  var banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("aria-label", mxCookieT("cookie-title"));
  banner.innerHTML =
    "<div>" +
    t(mxCookieT("cookingtext")) +
    "</div>" +
    '<div class="cookie-banner-buttons">' +
    mxCerezDugmeler("cookie-prefs", "showCookieDetails") +
    "</div>";
  document.body.appendChild(banner);
  mxCerezAlanAyarla();

  var kategoriler =
    '<li><label class="cookie-cat"><input type="checkbox" checked disabled> <span>' +
    t(mxCookieT("cookie-mandatory")) +
    "</span></label></li>";
  var i;
  for (i = 0; i < MX_CEREZ_KATLAR.length; i++) {
    kategoriler +=
      '<li><label class="cookie-cat"><input type="checkbox" data-mx-cerez-kat="' +
      MX_CEREZ_KATLAR[i].id +
      '"' +
      (onceki[MX_CEREZ_KATLAR[i].id] === true ? " checked" : "") +
      "> <span>" +
      t(mxCookieT(MX_CEREZ_KATLAR[i].metin)) +
      "</span></label></li>";
  }
  var modal = document.createElement("div");
  modal.className = "cookie-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML =
    "<h2>" +
    t(mxCookieT("cookie-title")) +
    "</h2>" +
    "<p>" +
    t(mxCookieT("cookie-intro")) +
    "</p>" +
    '<ul class="cookie-cats">' +
    kategoriler +
    "</ul>" +
    "<p>" +
    t(mxCookieT("cookie-more")) +
    "</p>" +
    '<div class="cookie-modal-actions">' +
    mxCerezDugmeler("cookie-save", "saveCookieChoices") +
    "</div>";
  document.body.appendChild(modal);

  var overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  document.body.appendChild(overlay);
}

function showCookieNotice() {
  
  if (document.querySelector("[data-mx-cookie]")) {
    return;
  }
  document.addEventListener("click", function (e) {
    var hedef = e && e.target && e.target.closest ? e.target.closest("[data-mx-cerez-tercih]") : null;
    if (hedef) {
      if (e.preventDefault) e.preventDefault();
      mxCerezTercihAc();
    }
  });
  window.mxCerezTercihAc = mxCerezTercihAc;
  var r = mxCerezRizaOku();
  if (r) {
    mxCerezYeniden(true);
    mxCerezYay(r);
    return;
  }
  mxCerezCiz();
}

function mxCerezTercihAc() {
  hideCookieNotice();
  mxCerezYeniden(false);
  mxCerezCiz();
  showCookieDetails();
}

function showCookieDetails() {
  var modal = document.querySelector(".cookie-modal");
  var overlay = document.querySelector(".modal-overlay");
  if (modal) modal.classList.add("active");
  if (overlay) overlay.classList.add("active");
}

function acceptCookies() {
  mxCerezKaydet(mxCerezHepsi(true));
}

function rejectCookies() {
  mxCerezKaydet(mxCerezHepsi(false));
}

function saveCookieChoices() {
  mxCerezKaydet(mxCerezKutulardan());
}

window.addEventListener("load", showCookieNotice);
