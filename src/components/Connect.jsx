import { CONFIG } from "../config";
import { Icon } from "../icons";
import Reveal from "./Reveal";

/* List-row style social links, like the inspo site —
   hidden automatically while CONFIG.socials is empty. */
export default function Connect() {
  return (
    <div className="flex flex-col gap-2.5">
      {CONFIG.socials.map((s, i) => (
        <Reveal key={s.label} delay={(i % 4) * 60}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener"
            className="group flex items-center gap-3.5 card rounded-xl px-4 py-3.5
              text-muted transition-all duration-300 hover:no-underline
              hover:border-accent hover:bg-[var(--accent-soft)] hover:translate-x-1"
          >
            <span className="w-[36px] h-[36px] rounded-[9px] border border-border bg-bg-soft
              flex items-center justify-center text-muted transition-colors
              group-hover:text-accent group-hover:border-accent">
              <Icon name={s.icon} className="w-[17px] h-[17px]" />
            </span>
            <span className="font-semibold text-[0.9rem] text-text">{s.label}</span>
            <span className="font-mono text-[0.72rem] text-faint">{s.handle}</span>
            <span className="ml-auto text-faint transition-all duration-300 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1">
              <Icon name="external" className="w-[15px] h-[15px]" />
            </span>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
