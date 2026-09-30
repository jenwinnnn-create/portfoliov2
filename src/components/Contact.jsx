import { useState } from "react";
import { CONFIG } from "../config";
import { Icon } from "../icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function Contact() {
  const mailto = "mailto:" + CONFIG.email;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <Reveal>
      <div className="contact-box card beam rounded-[20px] px-8 py-14 text-center relative overflow-hidden">
        <h2 className="text-[1.6rem] md:text-[1.9rem] font-bold mb-3.5 tracking-[-0.02em] relative">
          Let's Design Something Together <span className="text-gradient">✦</span>
        </h2>
        <p className="text-muted max-w-[460px] mx-auto mb-[30px] relative text-[0.95rem]">
          Whether it's a design collaboration, feedback on my work, or just a friendly chat
          about interfaces — I'd love to hear from you.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap relative">
          <Magnetic>
            <a href={mailto} className="btn btn-primary">
              $ say_hello
            </a>
          </Magnetic>
          <Magnetic strength={0.22}>
            <button
              onClick={copyEmail}
              className={`btn btn-outline ${copied ? "border-accent text-accent" : ""}`}
              aria-live="polite"
            >
              <Icon name={copied ? "check" : "copy"} className="w-[15px] h-[15px]" />
              {copied ? "copied!" : "copy_email"}
            </button>
          </Magnetic>
        </div>
        <a
          href={mailto}
          className="font-mono text-accent text-[0.9rem] mt-[24px] inline-block relative"
        >
          {CONFIG.email}
        </a>
      </div>
    </Reveal>
  );
}
