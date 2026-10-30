
(function () {
  "use strict";

  var VENDOR = {
    gsap: { js: "/src/vendor/gsap.min.js", globalName: "gsap" },
    scrolltrigger: { js: "/src/vendor/gsap-scrolltrigger.min.js", globalName: "ScrollTrigger", requires: ["gsap"] },
    lenis: { js: "/src/vendor/lenis.min.js", globalName: "Lenis" },
    toastify: { js: "/src/vendor/toastify.min.js", css: "/src/vendor/toastify.min.css", globalName: "Toastify" },
    sweetalert2: { js: "/src/vendor/sweetalert2.all.min.js", globalName: "Swal" },
    dayjs: { js: "/src/vendor/dayjs.min.js", globalName: "dayjs" },
    justvalidate: { js: "/src/vendor/just-validate.min.js", globalName: "JustValidate" },
    embla: { js: "/src/vendor/embla-carousel.min.js", globalName: "EmblaCarousel" },
    
    mxfiltre: { js: "/src/mx-filtre.js", globalName: "MxFiltre" },
    mxlightbox: { js: "/src/mx-lightbox.js", globalName: "MxLightbox" }
  };

  var mxLoadPromises = {};

  function mxReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function mxInjectScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("mx-ui: yuklenemedi " + src)); };
      document.head.appendChild(s);
    });
  }

  function mxInjectCss(href) {
    if (document.querySelector('link[href="' + href + '"]')) {
      return;
    }
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  
  window.mxLoad = function (name) {
    var def = VENDOR[name];
    if (!def) {
      return Promise.reject(new Error("mx-ui: bilinmeyen kutuphane " + name));
    }
    if (window[def.globalName]) {
      return Promise.resolve(window[def.globalName]);
    }
    if (mxLoadPromises[name]) {
      return mxLoadPromises[name];
    }
    var pre = Promise.resolve();
    if (def.requires) {
      pre = Promise.all(def.requires.map(function (r) { return window.mxLoad(r); }));
    }
    mxLoadPromises[name] = pre.then(function () {
      if (def.css) {
        mxInjectCss(def.css);
      }
      return mxInjectScript(def.js).then(function () {
        return window[def.globalName];
      });
    });
    return mxLoadPromises[name];
  };

  

  var mxFallbackToastTimer = null;

  function mxFallbackToast(msg, isError) {
    var el = document.querySelector(".mx-ui-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "mx-ui-toast";
      document.body.appendChild(el);
    }
    el.textContent = String(msg);
    el.classList.toggle("mx-ui-toast-error", !!isError);
    el.classList.add("mx-ui-toast-show");
    if (mxFallbackToastTimer) {
      clearTimeout(mxFallbackToastTimer);
    }
    mxFallbackToastTimer = setTimeout(function () {
      el.classList.remove("mx-ui-toast-show");
    }, 2400);
  }

  
  window.mxToast = function (msg, isError) {
    window.mxLoad("toastify").then(function (Toastify) {
      Toastify({
        text: String(msg),
        duration: 2400,
        gravity: "bottom",
        position: "center",
        stopOnFocus: true,
        style: {
          background: isError ? "#b91c1c" : "#1e293b",
          borderRadius: "10px",
          fontWeight: "600",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)"
        }
      }).showToast();
    }).catch(function () {
      mxFallbackToast(msg, isError);
    });
  };

  

  function mxFallbackConfirm(opts) {
    return new Promise(function (resolve) {
      var overlay = document.createElement("div");
      overlay.className = "mx-ui-confirm-overlay";
      var box = document.createElement("div");
      box.className = "mx-ui-confirm-box";
      var title = document.createElement("p");
      title.className = "mx-ui-confirm-title";
      title.textContent = opts.title || "";
      var text = document.createElement("p");
      text.className = "mx-ui-confirm-text";
      text.textContent = opts.text || "";
      var buttons = document.createElement("div");
      buttons.className = "mx-ui-confirm-buttons";
      var cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "mx-ui-confirm-cancel";
      cancelBtn.textContent = opts.cancelText || "Vazgec";
      var okBtn = document.createElement("button");
      okBtn.type = "button";
      okBtn.className = "mx-ui-confirm-ok";
      okBtn.textContent = opts.confirmText || "Evet";
      function close(result) {
        overlay.remove();
        resolve(result);
      }
      cancelBtn.onclick = function () { close(false); };
      okBtn.onclick = function () { close(true); };
      overlay.onclick = function (ev) {
        if (ev.target === overlay) {
          close(false);
        }
      };
      buttons.appendChild(cancelBtn);
      buttons.appendChild(okBtn);
      box.appendChild(title);
      box.appendChild(text);
      box.appendChild(buttons);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
    });
  }

  
  window.mxConfirm = function (opts) {
    opts = opts || {};
    return window.mxLoad("sweetalert2").then(function (Swal) {
      return Swal.fire({
        title: opts.title || "",
        text: opts.text || "",
        icon: opts.icon || "warning",
        showCancelButton: true,
        confirmButtonText: opts.confirmText || "Evet",
        cancelButtonText: opts.cancelText || "Vazgec",
        confirmButtonColor: "#e53935",
        reverseButtons: true
      }).then(function (result) {
        return !!result.isConfirmed;
      });
    }).catch(function () {
      return mxFallbackConfirm(opts);
    });
  };

  

  function mxPad(n) {
    return ("0" + n).slice(-2);
  }

  function mxBasicDate(value, format) {
    var d = value ? new Date(value) : new Date();
    if (isNaN(d.getTime())) {
      return "";
    }
    var map = {
      "DD": mxPad(d.getDate()),
      "MM": mxPad(d.getMonth() + 1),
      "YYYY": String(d.getFullYear()),
      "HH": mxPad(d.getHours()),
      "mm": mxPad(d.getMinutes())
    };
    var out = format || "DD.MM.YYYY HH:mm";
    for (var key in map) {
      out = out.split(key).join(map[key]);
    }
    return out;
  }

  
  window.mxDate = function (value, format) {
    if (window.dayjs) {
      try {
        return window.dayjs(value).format(format || "DD.MM.YYYY HH:mm");
      } catch (e) {
        return mxBasicDate(value, format);
      }
    }
    window.mxLoad("dayjs").catch(function () {});
    return mxBasicDate(value, format);
  };

  

  
  window.mxValidateForm = function (form, fields, onSuccess) {
    window.mxLoad("justvalidate").then(function (JustValidate) {
      var validator = new JustValidate(form, {
        errorFieldCssClass: "mx-ui-field-error",
        errorLabelStyle: { color: "#b91c1c", fontSize: "12px" }
      });
      for (var i = 0; i < fields.length; i++) {
        validator.addField(fields[i].selector, fields[i].rules);
      }
      validator.onSuccess(function () {
        onSuccess(form);
      });
    }).catch(function () {
      form.onsubmit = function (ev) {
        ev.preventDefault();
        if (form.checkValidity()) {
          onSuccess(form);
        } else {
          form.reportValidity();
        }
        return false;
      };
    });
  };

  

  
  window.mxGsap = function () {
    return window.mxLoad("gsap").then(function (gsap) {
      return window.mxLoad("scrolltrigger").then(function (ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        return gsap;
      });
    });
  };

  

  
  window.mxEmbla = function (root, options) {
    if (!root) {
      return Promise.reject(new Error("mx-ui: mxEmbla icin gecerli kok eleman gerekli"));
    }
    return window.mxLoad("embla").then(function (EmblaCarousel) {
      var factory = EmblaCarousel && EmblaCarousel.default ? EmblaCarousel.default : EmblaCarousel;
      return factory(root, options || {});
    });
  };

  

  function mxInitReveal() {
    if (mxReducedMotion() || !("IntersectionObserver" in window)) {
      return;
    }
    var content = document.getElementById("content");
    if (!content) {
      return;
    }
    var targets = [];
    for (var i = 0; i < content.children.length; i++) {
      var child = content.children[i];
      if (child.hasAttribute("data-mx-noanim")) {
        continue;
      }
      
      var pos = "";
      try {
        pos = window.getComputedStyle(child).position;
      } catch (e) {
        pos = "";
      }
      if (pos === "fixed" || pos === "sticky") {
        continue;
      }
      
      var rect = child.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        continue;
      }
      child.classList.add("mx-reveal");
      targets.push(child);
    }
    if (targets.length === 0) {
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) {
          var el = entries[e].target;
          el.classList.add("mx-reveal-in");
          observer.unobserve(el);
          
          (function (node) {
            setTimeout(function () {
              node.classList.remove("mx-reveal");
              node.classList.remove("mx-reveal-in");
            }, 700);
          })(el);
        }
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    for (var t = 0; t < targets.length; t++) {
      observer.observe(targets[t]);
    }
  }

  

  function mxInitSmoothScroll() {
    if (mxReducedMotion()) {
      return;
    }
    if (!document.body || !document.body.hasAttribute("data-mx-smooth")) {
      return;
    }
    window.mxLoad("lenis").then(function (Lenis) {
      var lenis = new Lenis({ autoRaf: true });
      window.mxLenis = lenis;
    }).catch(function () {});
  }

  setTimeout(function () {
    mxInitReveal();
    mxInitSmoothScroll();
  }, 60);
})();
