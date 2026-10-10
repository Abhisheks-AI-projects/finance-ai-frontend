"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { Send } from "lucide-react";

const placeholders = [
  "I spent ₹500 on groceries today",
  "Show my expenses this month",
  "Add ₹3000 salary income for October",
  "What's my total spending this week?",
];

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (input || focused) return; // stop animation when user is typing or focused

    const current = placeholders[placeholderIdx];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (charIdx < current.length) {
        timeout = setTimeout(() => {
          setPlaceholder(current.slice(0, charIdx + 1));
          setCharIdx(charIdx + 1);
        }, 40);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setPlaceholder(current.slice(0, charIdx - 1));
          setCharIdx(charIdx - 1);
        }, 25);
      } else {
        setIsDeleting(false);
        setPlaceholderIdx((placeholderIdx + 1) % placeholders.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, placeholderIdx, input, focused]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 110) + "px";
  };

  return (
    <div className="px-3 md:px-4 pb-4 md:pb-6 pt-2 shrink-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #fdfbf8 30%)" }}>
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div
          style={{
            outline: "none",
            border: "1px solid #E0E0E0",
            boxShadow: focused
              ? "0px 4px 24px rgba(0,0,0,0.10), 0px 0px 16px 6px rgba(0,100,255,0.06)"
              : "0px 2px 12px rgba(0,0,0,0.08), 0px 1px 4px rgba(0,0,0,0.04)",
          }}
          className="relative flex flex-col justify-between gap-[6px] w-full min-h-[100px] md:min-h-[120px] rounded-2xl md:rounded-3xl p-3 md:p-4 bg-white transition-all duration-200"
        >
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={1}
              disabled={disabled}
              style={{ outline: "none", boxShadow: "none", border: "none" }}
              className="w-full resize-none bg-transparent py-0 pl-1 pr-0 overflow-y-auto text-[16px] leading-[22px] tracking-normal text-foreground disabled:bg-transparent disabled:opacity-50 max-h-[110px] relative z-10"
            />
            {!input && !focused && (
              <span className="absolute top-0 left-1 text-[16px] leading-[22px] text-[#9A9A9A] pointer-events-none z-0">
                {placeholder}
                <span className="inline-block w-[1.5px] h-[17px] bg-[#AAAAAA] ml-[1px] align-middle animate-pulse" />
              </span>
            )}
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={handleSend}
              disabled={disabled || !input.trim()}
              className="rounded-full p-[10px] bg-foreground text-white hover:opacity-80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
