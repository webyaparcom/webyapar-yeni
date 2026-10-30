html = html.replace(new RegExp("{{id}}", "g"), json.id);
/* {{img}} render motorunda boş kalırsa /img/<id>/?v=… 404 olur — desing.img veya index.jpg */
var imgFile =
  json && json.desing && json.desing.img != null && String(json.desing.img) !== ""
    ? String(json.desing.img).replace(/^\/+/, "")
    : "index.jpg";
html = html.replace(new RegExp("{{img}}", "g"), imgFile);
