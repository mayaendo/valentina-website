/**
 * Smooth in-page navigation; offset for fixed header.
 */
(function () {
  var header = document.querySelector(".site-header");
  var navLinks = document.querySelectorAll('.nav a[href^="#"]');

  function getOffset() {
    return header ? header.offsetHeight : 0;
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - getOffset();
      window.scrollTo({ top: top, behavior: "smooth" });
      history.pushState(null, "", id);
    });
  });
})();
