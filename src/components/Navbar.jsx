import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { Icon } from "../icons";

export default function Navbar({ sections, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const progressRef = useRef(null);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        let current = "";
        for (const s of sections) {
          const el = document.getElementById(s.id);
          if (el && window.scrollY >= el.offsetTop - 200) current = s.id;
        }
        setActive(current);

        // scroll progress
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${pct})`;
        }
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-[2px] z-[110] origin-left scale-x-0
          bg-gradient-to-r from-accent to-accent2"
      />
      <nav
        className="fixed top-0 inset-x-0 z-[100] border-b border-border backdrop-blur-xl"
        style={{ background: "var(--nav-bg)" }}
      >
        <div className="max-w-[720px] mx-auto px-6 h-[58px] flex items-center justify-between">
          <a
            href="#"
            className="font-mono font-bold text-[0.95rem] text-text hover:no-underline flex items-center gap-1.5"
          >
            <span className="text-accent">~/</span>
            <span>{CONFIG.username}</span>
            <span className="text-accent">$</span>
          </a>

          <div className="flex items-center gap-1.5">
            {/* Links — dropdown on mobile, inline row on desktop */}
            <ul
              className={`flex gap-0.5 list-none transition-all duration-300
                fixed md:static top-[58px] right-4 flex-col md:flex-row items-stretch md:items-center
                bg-bg-soft md:bg-transparent border border-border md:border-0
                rounded-xl md:rounded-none p-2 md:p-0 min-w-[190px] md:min-w-0
                shadow-[var(--shadow)] md:shadow-none
                ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
                md:opacity-100 md:translate-y-0 md:pointer-events-auto`}
            >
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className={`font-mono text-[0.8rem] px-3 py-2 md:py-1.5 rounded-lg block transition-colors hover:no-underline ${
                      active === s.id
                        ? "text-accent bg-[var(--accent-soft)]"
                        : "text-muted hover:text-accent hover:bg-[var(--accent-soft)]"
                    }`}
                  >
                    <span className="text-accent2">#</span>
                    {s.id}
                  </a>
                </li>
              ))}
            </ul>

            {/* Theme toggle — always visible */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="w-[36px] h-[36px] rounded-[9px] bg-card border border-border text-text
                flex items-center justify-center transition-all duration-300
                hover:border-accent hover:rotate-[18deg] cursor-pointer"
            >
              <Icon name={theme === "dark" ? "moon" : "sun"} className="w-[17px] h-[17px]" />
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              className="md:hidden text-text p-1.5 cursor-pointer"
            >
              <Icon name="menu" className="w-[22px] h-[22px]" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
