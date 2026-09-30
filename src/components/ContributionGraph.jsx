import { useEffect, useMemo, useState } from "react";
import { CONFIG } from "../config";
import { Icon } from "../icons";
import Reveal from "./Reveal";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CELL = 10; // px
const GAP = 2; // px

/* Deterministic PRNG so the offline sample pattern is stable. */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Sample data — only used when GitHub can't be reached,
   so the layout never breaks (e.g. offline preview). */
function sampleData() {
  const rand = mulberry32(42);
  const out = [];
  const today = new Date();
  for (let i = 370; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = d.getDay();
    let base = rand();
    if (dow === 0 || dow === 6) base *= 0.35; // calmer weekends
    if (rand() < 0.12) base = rand(); // bursts
    if (rand() < 0.08) base = 0; // off days
    const count = base < 0.25 ? 0 : Math.round(base * 9);
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
    out.push({
      date: d.toISOString().slice(0, 10),
      count,
      level,
      d,
    });
  }
  return out;
}

function groupWeeks(list) {
  const pad = list[0].d.getDay(); // align first column to Sunday
  const cells = [...Array(pad).fill(null), ...list];
  const cols = [];
  for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));
  return cols;
}

const fmtDate = (d) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

export default function ContributionGraph() {
  const { username } = CONFIG.activity;
  const [weeks, setWeeks] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let data = null;
      if (username) {
        try {
          const res = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
          );
          if (!res.ok) throw new Error("fetch failed");
          const json = await res.json();
          if (!Array.isArray(json.contributions)) throw new Error("bad payload");
          const list = json.contributions.map((c) => ({
            ...c,
            d: new Date(c.date + "T00:00:00"),
          }));
          data = {
            list,
            total: json.total?.lastYear ?? list.reduce((a, c) => a + c.count, 0),
          };
        } catch {
          data = null; // fall through to sample
        }
      }
      if (!data) {
        const list = sampleData();
        data = { list, total: list.reduce((a, c) => a + c.count, 0) };
      }
      if (cancelled) return;
      setWeeks(groupWeeks(data.list));
      setTotal(data.total);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const monthLabels = useMemo(() => {
    if (!weeks) return [];
    const out = [];
    let prev = -1;
    weeks.forEach((col, i) => {
      const first = col.find(Boolean);
      if (!first) return;
      const m = first.d.getMonth();
      if (m !== prev) {
        out.push({ i, label: MONTHS[m] });
        prev = m;
      }
    });
    return out;
  }, [weeks]);

  return (
    <Reveal>
      <div className="card beam p-5 md:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-baseline justify-between gap-4 mb-5 flex-wrap">
          <h3 className="font-semibold text-[0.95rem]">
            <span className="text-accent font-mono">{total.toLocaleString()}</span> contributions
            in the last year
          </h3>
          {username && (
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener"
              className="font-mono text-[0.72rem] text-faint hover:text-accent hover:no-underline transition-colors inline-flex items-center gap-1"
            >
              @{username} <Icon name="external" className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Graph */}
        <div className="overflow-x-auto pb-1">
          {!weeks ? (
            /* Skeleton while loading */
            <div className="animate-pulse">
              <div className="h-3.5 w-52 rounded bg-[var(--g0)] mb-4" />
              <div className="flex gap-[2px]">
                {Array.from({ length: 53 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-[2px]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <div key={j} className="w-[10px] h-[10px] rounded-[2.5px] bg-[var(--g0)]" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Month labels */}
              <div className="relative h-[14px] mb-1 ml-[30px]">
                {monthLabels.map((m) => (
                  <span
                    key={m.i + m.label}
                    className="absolute top-0 text-[9px] font-mono text-faint"
                    style={{ left: m.i * (CELL + GAP) }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              <div className="flex">
                {/* Day labels */}
                <div className="flex flex-col gap-[2px] w-[24px] mr-[6px]">
                  {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                    <div key={i} className="h-[10px] text-[8px] leading-[10px] font-mono text-faint">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                <div className="flex gap-[2px]">
                  {weeks.map((col, i) => (
                    <div key={i} className="flex flex-col gap-[2px]">
                      {col.map((cell, j) =>
                        cell ? (
                          <div
                            key={j}
                            className="w-[10px] h-[10px] rounded-[2.5px] transition-transform hover:scale-[1.5] hover:ring-1 hover:ring-[var(--border-hover)]"
                            style={{ background: `var(--g${cell.level})` }}
                            title={`${cell.count} contribution${cell.count === 1 ? "" : "s"} · ${fmtDate(cell.d)}`}
                          />
                        ) : (
                          <div key={j} className="w-[10px] h-[10px]" />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-[4px] mt-3 text-[9px] font-mono text-faint">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <div
                    key={l}
                    className="w-[10px] h-[10px] rounded-[2.5px]"
                    style={{ background: `var(--g${l})` }}
                  />
                ))}
                <span>More</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Reveal>
  );
}
