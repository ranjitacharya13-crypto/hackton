"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ArrowUp, ShieldCheck, Lock, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { getMockResponse, THINKING_STAGES } from "@/lib/ai-engine";
import { AIMessage, ThinkingIndicator, AIOrb } from "@/components/ai/ai-message";
import { PermissionBadge } from "@/components/security/permission-badge";
import { cn } from "@/lib/utils";

export function AIChatPanel() {
  const { role, roleConfig, aiPanelOpen, setAiPanelOpen, consumePendingPrompt, addAudit } = useApp();
  const reduced = useReducedMotion();

  const [conversations, setConversations] = React.useState({});
  const [thinking, setThinking] = React.useState(false);
  const [stage, setStage] = React.useState(THINKING_STAGES[0]);
  const [input, setInput] = React.useState("");

  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const timersRef = React.useRef([]);

  const messages = conversations[role] || [];

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  React.useEffect(() => clearTimers, []);

  const appendMessage = React.useCallback(
    (roleKey, msg) => {
      setConversations((prev) => ({
        ...prev,
        [roleKey]: [...(prev[roleKey] || []), msg],
      }));
    },
    []
  );

  const send = React.useCallback(
    (rawText) => {
      const text = rawText?.trim();
      if (!text || thinking) return;
      const roleKey = role;
      const now = () =>
        new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });

      appendMessage(roleKey, { id: `u-${Date.now()}`, who: "user", text, time: now() });
      setInput("");
      setThinking(true);

      const stageDelay = reduced ? 260 : 680;
      THINKING_STAGES.forEach((s, i) => {
        timersRef.current.push(setTimeout(() => setStage(s), i * stageDelay));
      });

      timersRef.current.push(
        setTimeout(() => {
          const response = getMockResponse(roleKey, text);
          appendMessage(roleKey, {
            id: `ai-${Date.now()}`,
            who: "ai",
            time: now(),
            text: response.answer,
            sources: response.sources,
            context: response.context,
            safety: response.safety,
            recordsUsed: response.recordsUsed,
            pipeline: response.pipeline,
          });
          setThinking(false);
          addAudit({
            role: roleKey,
            actor: roleConfig.ai.panelTitle,
            action: "AI generated insight",
            resource: `${response.recordsUsed} authorized record${response.recordsUsed === 1 ? "" : "s"}`,
            category: "ai",
          });
        }, THINKING_STAGES.length * stageDelay + 320)
      );
    },
    [role, thinking, reduced, appendMessage, addAudit, roleConfig]
  );

  /* Consume a prompt queued by an "Ask AI" button elsewhere in the app */
  React.useEffect(() => {
    if (!aiPanelOpen) return;
    const pending = consumePendingPrompt();
    if (pending) {
      const t = setTimeout(() => send(pending.text), 350);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPanelOpen]);

  /* Autofocus + escape-to-close + scroll lock */
  React.useEffect(() => {
    if (!aiPanelOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 260);
    const onKey = (e) => {
      if (e.key === "Escape") setAiPanelOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [aiPanelOpen, setAiPanelOpen, reduced]);

  /* Keep scrolled to latest */
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages.length, thinking, reduced]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <AnimatePresence>
      {aiPanelOpen && (
        <>
          <motion.div
            key="ai-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAiPanelOpen(false)}
            className="fixed inset-0 z-[60] bg-ink-950/40 backdrop-blur-[2px]"
            aria-hidden
          />
          <motion.section
            key="ai-panel"
            role="dialog"
            aria-modal="true"
            aria-label={roleConfig.ai.panelTitle}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-0 z-[70] flex flex-col aurora-ink text-white shadow-panel sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[440px] sm:border-l sm:border-white/10 lg:w-[470px]"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <AIOrb size="md" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-[15px] font-bold leading-tight">
                  {roleConfig.ai.panelTitle}
                </h2>
                <p className="flex items-center gap-1.5 text-[11px] text-teal-300">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden>
                    <span className="absolute h-full w-full animate-pulse-dot rounded-full bg-teal-400" />
                  </span>
                  {roleConfig.ai.status}
                </p>
              </div>
              <span className="hidden sm:block">
                <PermissionBadge level="AUDITED" className="border-white/15 bg-white/5 text-teal-200" />
              </span>
              <button
                onClick={() => setAiPanelOpen(false)}
                aria-label="Close assistant panel"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="grid-fade-dark flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
              {messages.length === 0 && !thinking ? (
                <WelcomeState roleConfig={roleConfig} onPick={send} />
              ) : (
                <div className="space-y-6">
                  {messages.map((m) =>
                    m.who === "user" ? (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end"
                      >
                        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-white/95 px-4 py-2.5 text-sm leading-relaxed text-slate-900 shadow-sm">
                          {m.text}
                        </div>
                      </motion.div>
                    ) : (
                      <AIMessage key={m.id} message={m} roleConfig={roleConfig} tone="dark" />
                    )
                  )}
                  <AnimatePresence>{thinking && <ThinkingIndicator stage={stage} tone="dark" />}</AnimatePresence>

                  {/* Quick suggestions mid-conversation */}
                  {!thinking && messages.length > 0 && messages.length < 4 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {roleConfig.ai.suggestions.slice(0, 3).map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-200"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <footer className="border-t border-white/10 p-3.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-end gap-2 rounded-xl border border-white/15 bg-white/[0.06] p-2 pl-3.5 focus-within:border-teal-400/50 focus-within:ring-2 focus-within:ring-teal-400/20"
              >
                <label htmlFor="ai-input" className="sr-only">
                  {roleConfig.ai.placeholder}
                </label>
                <textarea
                  id="ai-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={onKeyDown}
                  placeholder={roleConfig.ai.placeholder}
                  className="max-h-[120px] flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-indigo-500 text-ink-950 shadow-sm transition-all hover:brightness-110 disabled:opacity-35"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </form>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-500">
                <Lock className="h-3 w-3" aria-hidden />
                Conceptual demo — answers come from mock authorized records, not real medical advice.
              </p>
            </footer>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

function WelcomeState({ roleConfig, onPick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col items-center justify-center text-center"
    >
      <AIOrb size="lg" className="animate-float" />
      <h3 className="mt-5 font-display text-xl font-bold">{roleConfig.ai.title}</h3>
      <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-slate-400">
        Ask questions about your authorized health records. Every answer shows its sources, consent scope and how it
        was generated.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        <PermissionBadge level="AUTHORIZED" className="border-white/15 bg-white/5 text-teal-200" />
        <PermissionBadge level="CONSENTED" className="border-white/15 bg-white/5 text-teal-200" />
        <PermissionBadge level="AUDITED" className="border-white/15 bg-white/5 text-indigo-200" />
      </div>

      <div className="mt-7 w-full max-w-sm space-y-2">
        {roleConfig.ai.suggestions.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
            onClick={() => onPick(s)}
            className="group flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-slate-200 transition-all hover:border-teal-400/40 hover:bg-teal-400/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            <span>{s}</span>
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-colors group-hover:text-teal-300" aria-hidden />
          </motion.button>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
        Answers respect {roleConfig.label.toLowerCase()} consent scope
      </p>
    </motion.div>
  );
}
