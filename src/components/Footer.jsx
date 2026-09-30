import { CONFIG } from "../config";

export default function Footer() {
  return (
    <footer className="border-t border-border py-[30px] text-center text-faint text-[0.78rem] font-mono relative z-[1]">
      <div className="max-w-[720px] mx-auto px-6">
        <span dangerouslySetInnerHTML={{ __html: CONFIG.footerText }} />
        <div className="mt-3 text-[0.65rem] text-faint/60 hidden md:flex items-center justify-center gap-x-4 flex-wrap gap-y-1">
          <span>press <span className="kbd">t</span> to toggle theme</span>
          <span>hover the name to re-scramble</span>
          <span>click the terminal to replay</span>
        </div>
      </div>
    </footer>
  );
}
