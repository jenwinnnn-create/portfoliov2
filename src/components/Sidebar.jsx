import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { Icon } from "../icons";
import { useScramble } from "../hooks/useScramble";
import { scrollToSection, getLenis } from "../lib/scroll";

const ITEM_H = 46; // item height
const ITEM_GAP = 6;

function ThemeButton({ theme, onToggle, className = "" }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className={`relative w-[38px] h-[38px] rounded-[10px] bg-card border border-border text-text
        overflow-hidden transition-colors duration-300 hover:border-accent cursor-pointer ${className}`}
    >
      <Icon
        name="sun"
        className={`absolute inset-0 m-auto w-[17px] h-[17px] transition-all duration-500 ease-[cubic-bezier(0.3,1.4,0.4,1)]
          ${theme === "dark" ? "opacity-0 rotate-[120deg] scale-50" : "opacity-100 rotate-0 scale-100"}`}
      />
      <Icon
        name="moon"
        className={`absolute inset-0 m-auto w-[17px] h-[17px] transition-all duration-500 ease-[cubic-bezier(0.3,1.4,0.4,1)]
          ${theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-[-120deg] scale-50"}`}
      />
    </button>
  );
}

function Logo({ onNavigate }) {
  const { chars, replay } = useScramble("~/JENWIN$", 250);
  return (
    <button
      onClick={() => onNavigate("hero")}
      onMouseEnter={replay}
      className="font-mono font-bold text-[0.95rem] text-text tracking-tight cursor-pointer text-left"
      title="back to top"
    >
      {chars.map((c, i) =>
        c.glitch ? (
          <span key={i} className="text-accent2">
            {c.ch}
          </span>
        ) : (
          <span key={i} className={c.ch === "~" || c.ch === "/" || c.ch === "$" ? "text-accent" : undefined}>
            {c.ch}
          </span>
        )
      )}
      <span className="inline-block w-[8px] h-[1em] bg-accent align-[-3px] ml-[3px] animate-[blink_1s_step-end_infinite]" />
    </button>
  );
}

function NavItems({ items, active, onNavigate, animated = true }) {
  const activeIdx = items.findIndex((s) => s.id === active);
  return (
    <div className="relative">
      {/* spring-loaded active pill */}
      <div
        className="absolute left-0 top-0 w-full rounded-[11px] bg-[var(--accent-soft)] border border-accent/25
          pointer-events-none transition-all duration-[550ms] ease-[cubic-bezier(0.3,1.45,0.35,1)]"
        style={{
          height: ITEM_H,
          transform: `translateY(${activeIdx >= 0 ? activeIdx * (ITEM_H + ITEM_GAP) : 0}px)`,
          opacity: activeIdx >= 0 ? 1 : 0,
        }}
      />
      {/* slim accent bar riding the left edge of the pill */}
      <div
        className="absolute left-0 top-0 w-[3px] rounded-full bg-accent pointer-events-none
          transition-all duration-[550ms] ease-[cubic-bezier(0.3,1.45,0.35,1)]
          shadow-[0_0_10px_var(--accent-glow)]"
        style={{
          height: 24,
          transform: `translateY(${activeIdx >= 0 ? activeIdx * (ITEM_H + ITEM_GAP) + (ITEM_H - 24) / 2 : 11}px)`,
          opacity: activeIdx >= 0 ? 1 : 0,
        }}
      />

      <ul className="flex flex-col" style={{ gap: ITEM_GAP }}>
        {items.map((s, i) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <button
                onClick={() => onNavigate(s.id)}
                className={`group relative w-full flex items-center gap-3.5 px-4 text-left
                  font-mono text-[0.82rem] cursor-pointer transition-all duration-300
                  hover:translate-x-[7px]
                  ${animated ? "side-item" : ""}
                  ${isActive ? "text-accent" : "text-muted hover:text-text"}`}
                style={{
                  height: ITEM_H,
                  animationDelay: animated ? `${160 + i * 70}ms` : undefined,
                }}
              >
                <span
                  className={`text-[0.66rem] transition-all duration-300
                    ${isActive ? "text-accent" : "text-faint group-hover:text-accent2"}`}
                >
                  {String(i).padStart(2, "0")}
                </span>
                <span className="tracking-wide">{s.id}</span>
                <span
                  className={`ml-auto text-[0.7rem] transition-all duration-300
                    ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0"}`}
                >
                  →
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Sidebar({ sections, theme, onToggleTheme }) {
  const items = [{ id: "hero" }, ...sections];
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const progressRef = useRef(null);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        let current = "hero";
        for (const s of items) {
          const el = document.getElementById(s.id);
          if (el && window.scrollY >= el.offsetTop - 220) current = s.id;
        }
        setActive(current);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        if (progressRef.current) progressRef.current.style.height = `${pct * 100}%`;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    getLenis()?.on("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll, { passive: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const navigate = (id) => {
    setOpen(false);
    scrollToSection(id);
  };

  /* lock body scroll when the mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] z-[100] flex-col
        border-r border-border backdrop-blur-xl px-6 py-9"
        style={{ background: "var(--nav-bg)" }}
      >
        <div className="side-item" style={{ animationDelay: "80ms" }}>
          <Logo onNavigate={navigate} />
        </div>

        <nav className="mt-14">
          <NavItems items={items} active={active} onNavigate={navigate} />
        </nav>

        <div className="mt-auto side-item" style={{ animationDelay: `${200 + items.length * 70}ms` }}>
          <div className="flex items-center gap-3">
            <ThemeButton theme={theme} onToggle={onToggleTheme} />
            <div className="font-mono text-[0.62rem] text-faint leading-[1.5]">
              theme
              <span className="block text-faint/60">
                or press <span className="kbd">t</span>
              </span>
            </div>
          </div>
        </div>

        {/* vertical scroll progress on the rail edge */}
        <div className="absolute right-[-1px] top-0 h-full w-[2px] bg-border/50">
          <div
            ref={progressRef}
            className="w-full bg-gradient-to-b from-accent to-accent2 transition-[height] duration-150 ease-out"
            style={{ height: "0%" }}
          />
        </div>
      </aside>

      {/* ============ MOBILE TOP BAR ============ */}
      <header
        className="md:hidden fixed top-0 inset-x-0 z-[100] border-b border-border backdrop-blur-xl"
        style={{ background: "var(--nav-bg)" }}
      >
        <div className="h-[56px] px-5 flex items-center justify-between">
          <Logo onNavigate={navigate} />
          <div className="flex items-center gap-2">
            <ThemeButton theme={theme} onToggle={onToggleTheme} />
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="text-text p-1.5 cursor-pointer"
            >
              <Icon name="menu" className="w-[22px] h-[22px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ============ MOBILE DRAWER ============ */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[130]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 animate-[fade-in_0.4s_ease_forwards]"
            onClick={() => setOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 h-full w-[264px] bg-bg-soft border-r border-border
              px-6 py-9 flex flex-col animate-[drawer-in_0.5s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          >
            <div className="flex items-center justify-between">
              <Logo onNavigate={navigate} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-muted hover:text-accent transition-colors p-1 cursor-pointer font-mono text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <nav className="mt-14">
              <NavItems items={items} active={active} onNavigate={navigate} />
            </nav>
            <div className="mt-auto">
              <div className="flex items-center gap-3">
                <ThemeButton theme={theme} onToggle={onToggleTheme} />
                <span className="font-mono text-[0.62rem] text-faint">theme</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
