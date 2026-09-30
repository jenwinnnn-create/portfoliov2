import { useEffect, useState, useRef, useCallback } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@01";

/* Hacker-style "decrypt" text scramble.
   Returns { chars, replay } — render glitch chars in the accent color,
   and call replay() (e.g. on hover) to re-run the animation. */
export function useScramble(text, delay = 400) {
  const [chars, setChars] = useState(() =>
    text.split("").map(() => ({ ch: "░", glitch: true }))
  );
  const [nonce, setNonce] = useState(0);
  const busyRef = useRef(false);

  const replay = useCallback(() => {
    if (busyRef.current) return; // don't restart mid-scramble
    setNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    busyRef.current = true;
    const queue = text.split("").map((to) => {
      const start = Math.floor(Math.random() * 40);
      return { to, start, end: start + Math.floor(Math.random() * 40), char: "" };
    });
    let frame = 0;
    let raf;

    const tick = () => {
      let complete = 0;
      const out = queue.map((q) => {
        if (frame >= q.end) {
          complete++;
          return { ch: q.to, glitch: false };
        }
        if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          return { ch: q.char, glitch: true };
        }
        return { ch: "", glitch: false };
      });
      setChars(out);
      frame++;
      if (complete < queue.length) {
        raf = requestAnimationFrame(tick);
      } else {
        busyRef.current = false;
      }
    };

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      busyRef.current = false;
    };
  }, [text, delay, nonce]);

  return { chars, replay };
}
