"use client";

import { useEffect, useMemo, useState } from "react";

const htmlToTerminalText = (html = "") =>
  String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export default function TerminalComponent({ data }) {
  const promptHtml = typeof data?.prompt === "string" ? data.prompt.trim() : "";
  const text = useMemo(() => htmlToTerminalText(promptHtml), [promptHtml]);
  const [typed, setTyped] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const typingDelay = 14;
    const restartDelay = 10000;
    let timeoutId;
    let isCancelled = false;

    if (!text) {
      timeoutId = window.setTimeout(() => {
        setTyped("");
        setIsTyping(false);
      }, 0);

      return () => {
        isCancelled = true;
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeoutId = window.setTimeout(() => {
        setTyped(text);
        setIsTyping(false);
      }, 0);

      return () => {
        isCancelled = true;
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    const startCycle = () => {
      if (isCancelled) return;

      setTyped("");
      setIsTyping(true);

      let currentIndex = 0;

      const typeNext = () => {
        if (isCancelled) return;

        currentIndex += 1;
        setTyped(text.slice(0, currentIndex));

        if (currentIndex < text.length) {
          timeoutId = window.setTimeout(typeNext, typingDelay);
          return;
        }

        setIsTyping(false);
        timeoutId = window.setTimeout(startCycle, restartDelay);
      };

      timeoutId = window.setTimeout(typeNext, typingDelay);
    };

    timeoutId = window.setTimeout(startCycle, 0);

    return () => {
      isCancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [text]);

  if (!promptHtml) {
    return null;
  }

  return (
      <section className="h-130 flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-3 bg-slate-900">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-emerald-500" aria-hidden="true" />
        </div>
        <span className="ml-3 text-xs tracking-wide text-slate-300">zsh — 80x24</span>
      </div>

      <div className="terminal-content flex-1 overflow-x-auto overflow-y-auto p-4 font-mono text-sm leading-7 text-emerald-300 md:p-6 md:text-base">
        <pre className="whitespace-pre-wrap wrap-break-word">
          <code>
            {typed}
            <span className={`terminal-cursor ml-0.5 inline-block ${isTyping ? "text-emerald-200" : "text-emerald-300"}`}>
              <span className="ml-1 block h-1 w-3 bg-emerald-300" />
            </span>
          </code>
        </pre>
      </div>

      <style jsx>{`
        .terminal-cursor {
          animation: terminal-cursor-blink 1s steps(1, end) infinite;
        }

        @keyframes terminal-cursor-blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}