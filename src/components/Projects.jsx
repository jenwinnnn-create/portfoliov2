import { CONFIG } from "../config";
import { Icon } from "../icons";
import Reveal from "./Reveal";
import Tilt from "./Tilt";

/* Renders nothing visible until you add entries to CONFIG.projects —
   App.jsx hides this whole section while the list is empty. */
export default function Projects() {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
      {CONFIG.projects.map((p, i) => (
        <Reveal key={p.title} delay={(i % 2) * 90} className="h-full">
          <Tilt className="h-full" max={6}>
          <div className="project-card card p-6 flex flex-col h-full relative overflow-hidden transition-[border,box-shadow] duration-300 hover:border-border-hover hover:shadow-[var(--shadow)]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-[0.7rem] text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex gap-2.5">
                {p.codeUrl && p.codeUrl !== "#" && (
                  <a
                    href={p.codeUrl}
                    target="_blank"
                    rel="noopener"
                    aria-label="Source code"
                    className="text-faint hover:text-accent transition-colors"
                  >
                    <Icon name="github" className="w-[18px] h-[18px]" />
                  </a>
                )}
                {p.liveUrl && p.liveUrl !== "#" && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener"
                    aria-label="Live demo"
                    className="text-faint hover:text-accent transition-colors"
                  >
                    <Icon name="external" className="w-[18px] h-[18px]" />
                  </a>
                )}
              </div>
            </div>
            <h3 className="text-[1.05rem] font-bold mb-2">
              <a
                href={p.liveUrl !== "#" ? p.liveUrl : p.codeUrl}
                target="_blank"
                rel="noopener"
                className="text-text hover:text-accent hover:no-underline"
              >
                {p.title}
              </a>
            </h3>
            <p className="text-muted text-[0.88rem] flex-1 mb-4">{p.description}</p>
            <div className="flex flex-wrap gap-2.5">
              {p.tags.map((t) => (
                <span key={t} className="font-mono text-[0.68rem] text-accent2">
                  {t}
                </span>
              ))}
            </div>
          </div>
          </Tilt>
        </Reveal>
      ))}
    </div>
  );
}
