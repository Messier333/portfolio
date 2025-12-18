(function () {
  function initTOC() {
    const tocRoot = document.querySelector(".nav .toc");
    if (!tocRoot) return;

    const links = Array.from(tocRoot.querySelectorAll("a[href^='#']"));
    if (!links.length) return;

    const linkMap = new Map(links.map(a => [decodeURIComponent(a.getAttribute("href") || ""), a]));

    const headings = links
      .map(a => decodeURIComponent(a.getAttribute("href") || "").slice(1))
      .filter(Boolean)
      .map(id => document.getElementById(id))
      .filter(Boolean);

    function setActiveById(id) {
      const a = linkMap.get(`#${id}`);
      if (!a) return;
      tocRoot.querySelectorAll("a.active").forEach(x => x.classList.remove("active"));
      a.classList.add("active");
    }

    function setFirstActive() {
      const first = headings[0];
      if (first) setActiveById(first.id);
    }

    // 클릭 스크롤
    links.forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = decodeURIComponent(a.getAttribute("href") || "");
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (!el) return;

        // 스크롤 이동
        el.scrollIntoView({ behavior: "auto", block: "start" });

        // active 갱신 + 주소 갱신
        setActiveById(id);
        history.pushState(null, "", href);
      });
    });

    // ✅ 핵심: 스크롤 위치로 active 계산 (IO 안 씀)
    let ticking = false;

    function updateActive() {
      ticking = false;

      // 맨 위면 무조건 첫 항목
      if (window.scrollY <= 4) {
        setFirstActive();
        return;
      }

      // "현재 위치에서 가장 위에 가까운(이미 지나간) heading" 찾기
    const triggerY = Math.round(window.innerHeight * 0.22); // ✅ 화면 위쪽 22% 지점에서 변경(조절 가능)

    let current = null;
    for (const h of headings) {
    const top = h.getBoundingClientRect().top;
    if (top <= triggerY) current = h;   // ✅ 0 대신 triggerY
    else break;
    }

      // 아직 하나도 지나지 않았으면 첫 항목
      if (!current) {
        setFirstActive();
        return;
      }

      setActiveById(current.id);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", onScroll);

    // 최초 상태
    // 해시가 있으면 우선 반영
    const hash = decodeURIComponent(location.hash || "");
    if (hash && hash.startsWith("#")) {
      const id = hash.slice(1);
      if (document.getElementById(id)) setActiveById(id);
      else setFirstActive();
    } else {
      setFirstActive();
    }

    updateActive();
  }

  document.addEventListener("DOMContentLoaded", initTOC);
})();
