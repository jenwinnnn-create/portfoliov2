import { useEffect } from "react";

/* Layered ambient background:
   1. two huge blurred gradient blobs (green + blue) slowly drifting
   2. a dim static blueprint grid
   3. a brighter accent-tinted grid revealed by a radial mask at the cursor
   Pure CSS animation for the blobs; a single rAF-throttled mousemove
   for the spotlight — no re-renders at all. */
export default function Aurora() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--mx", e.clientX + "px");
        root.style.setProperty("--my", e.clientY + "px");
        raf = 0;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* drifting aurora blobs */}
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      {/* dim grid + cursor-revealed accent grid */}
      <div className="grid-base absolute inset-0" />
      <div className="grid-spot absolute inset-0" />
      {/* CRT scanlines + ambient light sweep */}
      <div className="scanlines" />
      <div className="beam-sweep" />
      {/* HUD viewport corner brackets (desktop only) */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />
    </div>
  );
}
