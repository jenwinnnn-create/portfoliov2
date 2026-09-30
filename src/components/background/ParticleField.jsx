import { useEffect, useRef } from "react";

/* Particle constellation on a fixed canvas — quiet theme accent.
   - Particles drift slowly and link up when near each other
   - Moving the cursor creates links to it + gently pushes particles away
   - Color follows --accent; pauses when the tab is hidden
   - Disabled entirely under prefers-reduced-motion */
export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles = [];
    let rgb = [51, 224, 146];
    const mouse = { x: -9999, y: -9999 };

    const readColor = () => {
      const v = getComputedStyle(document.body).getPropertyValue("--accent").trim();
      const h6 = v.replace("#", "");
      if (/^[0-9a-fA-F]{6}$/.test(h6)) {
        rgb = [parseInt(h6.slice(0, 2), 16), parseInt(h6.slice(2, 4), 16), parseInt(h6.slice(4, 6), 16)];
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12 * dpr,
        vy: (Math.random() - 0.5) * 0.12 * dpr,
        r: (Math.random() * 1.2 + 0.9) * dpr,
      }));
    };

    const LINK = 130;
    const MOUSE_LINK = 170;
    const REPEL = 100;

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      const linkPx = LINK * dpr;
      const mousePx = MOUSE_LINK * dpr;
      const repelPx = REPEL * dpr;
      const [r, g, b] = rgb;

      // particle <-> particle links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkPx * linkPx) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / linkPx) * 0.32})`;
            ctx.lineWidth = 0.7 * dpr;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // particle <-> cursor links + gentle repulsion
      for (const p of particles) {
        const dxM = p.x - mouse.x;
        const dyM = p.y - mouse.y;
        const dM = Math.hypot(dxM, dyM);
        if (dM < mousePx) {
          ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dM / mousePx) * 0.5})`;
          ctx.lineWidth = 0.8 * dpr;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        if (dM < repelPx && dM > 0.01) {
          const f = (1 - dM / repelPx) * 1.3 * dpr;
          p.x += (dxM / dM) * f;
          p.y += (dyM / dM) * f;
        }

        // integrate + wrap around edges
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      step();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const stop = () => cancelAnimationFrame(raf);

    const onMove = (e) => {
      mouse.x = e.clientX * dpr;
      mouse.y = e.clientY * dpr;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    readColor();
    resize();
    start();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("portfolio-theme", readColor);

    return () => {
      stop();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("portfolio-theme", readColor);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
