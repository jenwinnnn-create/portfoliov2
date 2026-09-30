import { useEffect, useState } from "react";

/* Typewriter effect rotating through an array of roles. */
export function useTyping(roles, startDelay = 1200) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!roles.length) return;
    let role = 0;
    let char = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const current = roles[role];
      if (!deleting) {
        char++;
        setText(current.slice(0, char));
        if (char === current.length) {
          deleting = true;
          timer = setTimeout(tick, 2000);
          return;
        }
        timer = setTimeout(tick, 70 + Math.random() * 60);
      } else {
        char--;
        setText(current.slice(0, char));
        if (char === 0) {
          deleting = false;
          role = (role + 1) % roles.length;
          timer = setTimeout(tick, 500);
          return;
        }
        timer = setTimeout(tick, 35);
      }
    };

    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [roles, startDelay]);

  return text;
}
