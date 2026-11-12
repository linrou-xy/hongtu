/* ==========================================================================
   红途 · 行迹页脚本
   负责：地图节点与文章联动、平滑定位
   ========================================================================== */

(function () {
  "use strict";

  const markers = Array.from(document.querySelectorAll(".route-marker[data-target]"));
  const stops = Array.from(document.querySelectorAll(".route-stop[data-stop]"));

  if (markers.length === 0 || stops.length === 0) return;

  let activeId = "stop-nanliang";

  function setActive(id) {
    if (!id) return;
    activeId = id;
    markers.forEach(function (marker) {
      const isActive = marker.dataset.target === id;
      marker.classList.toggle("is-active", isActive);
      marker.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  markers.forEach(function (marker) {
    marker.addEventListener("click", function () {
      const target = document.getElementById(marker.dataset.target);
      if (!target) return;
      setActive(marker.dataset.target);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* 文章滚到视口中部时，同步地图节点 */
  if ("IntersectionObserver" in window) {
    const stopObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const markerId = "stop-" + entry.target.dataset.stop;
          const marker = document.querySelector('.route-marker[data-target="' + markerId + '"]');
          if (marker) setActive(markerId);
        });
      },
      { rootMargin: "-30% 0px -52% 0px", threshold: 0.01 }
    );

    stops.forEach(function (stop) {
      stopObserver.observe(stop);
    });
  }

  /* 初次进入时，让地图上的第一站保持激活 */
  setActive(activeId);
})();
