import { useEffect, useRef } from "react";

/* Cursor follower — a tiny glowing dot with a lagging ring.
   Desktop (fine pointer) only; hidden until the first mouse move. */
export default function CursorGlow() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = -200, my = -200; // cursor
    let dx = mx, dy = my;     // dot pos (fast lerp)
    let rx = mx, ry = my;     // ring pos (slow lerp)
    let shown = false;
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };
    const onLeaveWindow = () => {
      shown = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const loop = () => {
      dx += (mx - dx) * 0.4;
      dy += (my - dy) * 0.4;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[300] w-[7px] h-[7px] rounded-full bg-accent
          pointer-events-none opacity-0 transition-opacity duration-300
          shadow-[0_0_14px_var(--accent-glow)]"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[300] w-[36px] h-[36px] rounded-full
          border border-accent/30 pointer-events-none opacity-0 transition-opacity duration-300"
      />
    </>
  );
}
