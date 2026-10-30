/**
 * Testimonial Universal Embed Script
 * Sub-100ms async loader for Wall of Love, Carousels, and Badges
 * Complies with SRS 5.1 & PRD 4.3
 */
(function () {
  function initEmbeds() {
    // 1. Detect any script tag with data-space
    var currentScript = document.currentScript || (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

    var baseUrl = (currentScript && currentScript.src)
      ? currentScript.src.replace(/\/embed\.js(\?.*)?$/, "")
      : window.location.origin;

    var spaceSlug = currentScript ? currentScript.getAttribute("data-space") : null;
    var embedType = (currentScript && currentScript.getAttribute("data-type")) || "wall";
    var theme = (currentScript && currentScript.getAttribute("data-theme")) || "dark";

    // 2. Also detect any elements marked with data-testimonial-space
    var containers = document.querySelectorAll("[data-testimonial-space]");

    if (containers.length === 0 && spaceSlug) {
      // Auto-insert iframe right next to the script tag
      var wrapper = document.createElement("div");
      wrapper.className = "testimonial-embed-container";
      wrapper.style.width = "100%";
      wrapper.style.minHeight = embedType === "badge" ? "60px" : "400px";

      var iframe = document.createElement("iframe");
      iframe.src = baseUrl + "/embed/" + encodeURIComponent(spaceSlug) + "/" + encodeURIComponent(embedType) + "?theme=" + encodeURIComponent(theme);
      iframe.style.width = "100%";
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      iframe.style.display = "block";
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("loading", "lazy");

      if (embedType === "badge") {
        iframe.style.height = "70px";
      } else {
        iframe.style.minHeight = "600px";
      }

      wrapper.appendChild(iframe);
      currentScript.parentNode.insertBefore(wrapper, currentScript.nextSibling);

      // Listen for resize messages from child iframe
      window.addEventListener("message", function (e) {
        if (e.data && e.data.type === "TESTIMONIAL_RESIZE" && e.data.height) {
          iframe.style.height = e.data.height + "px";
        }
      });
    }

    // Process custom containers
    containers.forEach(function (el) {
      var s = el.getAttribute("data-testimonial-space");
      var t = el.getAttribute("data-testimonial-type") || "wall";
      var th = el.getAttribute("data-testimonial-theme") || "dark";

      var iframe = document.createElement("iframe");
      iframe.src = baseUrl + "/embed/" + encodeURIComponent(s) + "/" + encodeURIComponent(t) + "?theme=" + encodeURIComponent(th);
      iframe.style.width = "100%";
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      iframe.style.display = "block";
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("loading", "lazy");
      iframe.style.minHeight = t === "badge" ? "70px" : "600px";

      el.innerHTML = "";
      el.appendChild(iframe);

      window.addEventListener("message", function (e) {
        if (e.data && e.data.type === "TESTIMONIAL_RESIZE" && e.data.height && e.data.space === s) {
          iframe.style.height = e.data.height + "px";
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEmbeds);
  } else {
    initEmbeds();
  }
})();
