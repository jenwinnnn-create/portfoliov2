import { CONFIG } from "../config";
import Reveal from "./Reveal";

/* Clean stacked experience cards (inspo-site style).
   Renders nothing visible until you add entries to CONFIG.experience —
   App.jsx hides this whole section while the list is empty. */
export default function Experience() {
  return (
    <div className="flex flex-col gap-4">
      {CONFIG.experience.map((e, i) => (
        <Reveal key={e.role + e.company} delay={(i % 3) * 80}>
          <div className="card p-5 md:p-6 transition-all duration-300 hover:border-border-hover hover:-translate-y-[3px] hover:shadow-[var(--shadow)]">
            <div className="flex gap-4 items-start">
              <div
                className="w-[48px] h-[48px] min-w-[48px] rounded-[11px] border border-border
                  flex items-center justify-center font-mono font-bold text-[0.95rem] text-accent overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--accent-soft), var(--accent-2-soft))" }}
              >
                {e.logoUrl ? (
                  <img src={e.logoUrl} alt={`${e.company} logo`} className="w-full h-full object-cover" />
                ) : (
                  e.logoText
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-[1.02rem] font-bold leading-tight">{e.role}</div>
                    {e.companyUrl && e.companyUrl !== "#" ? (
                      <a
                        href={e.companyUrl}
                        target="_blank"
                        rel="noopener"
                        className="text-accent font-semibold text-[0.88rem]"
                      >
                        {e.company}
                      </a>
                    ) : (
                      <span className="text-accent font-semibold text-[0.88rem]">{e.company}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {e.badge && (
                      <span className="font-mono text-[0.62rem] tracking-wider uppercase text-accent bg-[var(--accent-soft)] border border-accent/40 px-2 py-[2px] rounded-full">
                        {e.badge}
                      </span>
                    )}
                    <span className="font-mono text-[0.72rem] text-faint whitespace-nowrap">
                      {e.date}
                    </span>
                  </div>
                </div>
                <ul className="text-muted text-[0.9rem] pl-[18px] list-disc mt-3 [&_strong]:text-text">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="mb-[5px]" dangerouslySetInnerHTML={{ __html: b }} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
