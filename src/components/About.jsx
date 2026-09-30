import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import Reveal from "./Reveal";

const CMD = "cat whoami.json";

export default function About() {
  const entries = Object.entries(CONFIG.terminal);
  const [typed, setTyped] = useState(""); // chars of CMD typed so far
  const [shown, setShown] = useState(0);  // entries revealed so far
  const [phase, setPhase] = useState("idle"); // idle | typing | listing | done
  const busyRef = useRef(false);
  const timers = useRef([]);
  const bodyRef = useRef(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /* Self-typing terminal: types the command char-by-char,
     then reveals each whoami.json line. Click to replay. */
  const run = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    clearTimers();
    setTyped("");
    setShown(0);
    setPhase("typing");

    let i = 0;
    const typeNext = () => {
      i++;
      setTyped(CMD.slice(0, i));
      if (i < CMD.length) {
        timers.current.push(setTimeout(typeNext, 40 + Math.random() * 55));
        return;
      }
      setPhase("listing");
      let j = 0;
      const showNext = () => {
        j++;
        setShown(j);
        if (j < entries.length) {
          timers.current.push(setTimeout(showNext, 140));
          return;
        }
        setPhase("done");
        busyRef.current = false;
      };
      timers.current.push(setTimeout(showNext, 280));
    };
    timers.current.push(setTimeout(typeNext, 300));
  }, [entries.length]);

  /* Start when the terminal scrolls into view */
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearTimers();
      busyRef.current = false;
    };
  }, [run]);

  const caret = <span className="animate-[blink_1s_step-end_infinite]">▊</span>;

  return (
    <div className="grid grid-cols-1 gap-7">
      {/* Paragraphs (HTML from config is intentional — it's your own content) */}
      <Reveal>
        <div>
          {CONFIG.aboutParagraphs.map((p, i) => (
            <p
              key={i}
              className="text-muted mb-4 text-[0.97rem] leading-[1.8] [&_strong]:text-text [&_a]:font-semibold"
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
        </div>
      </Reveal>

      {/* self-typing whoami.json terminal — click to replay */}
      <Reveal delay={100}>
        <div
          className="card beam overflow-hidden shadow-[var(--shadow)] transition-colors duration-300 hover:border-border-hover"
          title={phase === "done" ? "click to replay" : undefined}
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-bg-soft border-b border-border">
            <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
            <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
            <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-faint">whoami.json</span>
            <span className="ml-auto font-mono text-[0.62rem] text-faint/70 hidden sm:block">
              {phase === "done" ? "↻ click terminal to replay" : ""}
            </span>
          </div>
          <div
            ref={bodyRef}
            onClick={phase === "done" ? run : undefined}
            className={`px-5 py-[18px] font-mono text-[0.82rem] leading-[1.9] ${
              phase === "done" ? "cursor-pointer" : ""
            }`}
            style={{ minHeight: `${(entries.length + 2) * 25 + 36}px` }}
          >
            <div className="flex gap-2.5">
              <span className="text-accent select-none">$</span>
              <span>
                {typed}
                {phase === "typing" && caret}
                {phase === "idle" && caret}
              </span>
            </div>

            {entries.slice(0, shown).map(([k, v]) => (
              <div key={k} className="text-muted pl-[18px]">
                "<span className="text-accent2">{k}</span>": "{v}"
              </div>
            ))}

            {phase === "listing" && (
              <div className="pl-[18px] text-muted">{caret}</div>
            )}

            {phase === "done" && (
              <div className="flex gap-2.5">
                <span className="text-accent select-none">$</span>
                <span>{caret}</span>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
