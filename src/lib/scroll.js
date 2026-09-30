import Lenis from "lenis";

/* Singleton Lenis instance — buttery inertia scrolling.
   Returns null under prefers-reduced-motion (native scrolling then). */
let lenis = null;

export function initLenis() {
  if (lenis || typeof window === "undefined") return lenis;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  lenis = new Lenis({
    lerp: 0.09,           // lower = heavier/more cinematic easing
    smoothWheel: true,
    syncTouch: false,
  });
  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (lenis) {
    lenis.scrollTo(el, {
      offset: -8,
      duration: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart
    });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
