import { useRef } from "react";

/* 3D tilt wrapper — cards rotate subtly toward the cursor with a soft
   accent glare that follows it. Desktop (fine pointer) only. */
export default function Tilt({ children, max = 7, className = "" }) {
  const ref = useRef(null);

  const canHover = () =>
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e) => {
    if (!canHover()) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max;
    const ry = (px - 0.5) * max;
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt relative will-change-transform transition-transform duration-300 ease-out ${className}`}
    >
      {children}
      <div className="tilt-glare" aria-hidden="true" />
    </div>
  );
}
