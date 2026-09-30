import Reveal from "./Reveal";

/* Consistent section wrapper: numbered label + drawing rule + title.
   Content sits in .skew-scroll so it bends with scroll velocity. */
export default function Section({ id, index, title, children }) {
  return (
    <section id={id} className="py-12 md:py-16 scroll-mt-4">
      <Reveal className="flex items-center gap-4 mb-3">
        <span className="font-mono text-accent text-[0.78rem] tracking-[0.18em] uppercase whitespace-nowrap">
          {String(index).padStart(2, "0")} // {id}
        </span>
        <span className="rule h-px flex-1 bg-gradient-to-r from-border-hover to-transparent" />
      </Reveal>
      {title && (
        <Reveal variant="clip-up">
          <h2 className="text-[1.5rem] md:text-[1.75rem] font-bold mb-6 tracking-[-0.02em]">
            {title}
          </h2>
        </Reveal>
      )}
      <div className="skew-scroll">{children}</div>
    </section>
  );
}
