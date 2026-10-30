if (page["text"] != undefined) {
  html = html.replace(new RegExp("{{text}}", "g"), page["text"][json.lang]);
} else {
  html = html.replace(new RegExp("{{text}}", "g"), "");
}
html = html.replace(
  new RegExp("{{img}}", "g"),
  "/img/" + json["id"] + "/" + json.desing["img"],
);
