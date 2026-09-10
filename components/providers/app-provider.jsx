"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { ROLES, getRole } from "@/lib/roles";
import { initialConsents, initialAuditLogs, initialNotifications } from "@/lib/data";

const AppContext = React.createContext(null);

export function AppProvider({ children }) {
  const [role, setRoleId] = React.useState("patient");
  const [consents, setConsents] = React.useState(initialConsents);
  const [auditLogs, setAuditLogs] = React.useState(initialAuditLogs);
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const [aiPanelOpen, setAiPanelOpen] = React.useState(false);
  const [pendingPrompt, setPendingPrompt] = React.useState(null);
  const [toasts, setToasts] = React.useState([]);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const roleConfig = getRole(role);

  const pushToast = React.useCallback((toast) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addAudit = React.useCallback((entry) => {
    const now = new Date();
    setAuditLogs((prev) => [
      {
        id: `au-live-${Date.now()}`,
        time: now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false }),
        date: "Today",
        status: "success",
        ...entry,
      },
      ...prev,
    ]);
  }, []);

  const setRole = React.useCallback(
    (nextRole) => {
      if (!ROLES[nextRole]) return;
      setRoleId(nextRole);
      pushToast({
        kind: "info",
        title: `Viewing as ${getRole(nextRole).label}`,
        body: getRole(nextRole).name,
      });
    },
    [pushToast]
  );

  const setConsentStatus = React.useCallback(
    (id, status) => {
      setConsents((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          return {
            ...c,
            status,
            scope: status === "denied" ? "No Access" : c.scope === "No Access" ? "Access Granted" : c.scope,
            grantedAt: status === "denied" ? null : c.grantedAt || "Today",
            lastAccess: status === "denied" ? "Never" : c.lastAccess,
          };
        })
      );
      const c = initialConsents.find((x) => x.id === id);
      const verb = status === "denied" ? "revoked access from" : "granted access to";
      addAudit({
        role: "patient",
        actor: "Maya Chen",
        action: verb,
        resource: `Consent · ${c?.title || id}`,
        category: "consent",
      });
      pushToast({
        kind: status === "denied" ? "warning" : "success",
        title: status === "denied" ? "Access revoked" : "Access granted",
        body: `${c?.title || id} consent updated and recorded in the audit log.`,
      });
    },
    [addAudit, pushToast]
  );

  const openAI = React.useCallback((prompt = null) => {
    setPendingPrompt(prompt ? { text: prompt, ts: Date.now() } : null);
    setAiPanelOpen(true);
  }, []);

  const consumePendingPrompt = React.useCallback(() => {
    const p = pendingPrompt;
    setPendingPrompt(null);
    return p;
  }, [pendingPrompt]);

  const markAllNotificationsRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const value = {
    role,
    setRole,
    roleConfig,
    consents,
    setConsentStatus,
    auditLogs,
    addAudit,
    notifications,
    markAllNotificationsRead,
    aiPanelOpen,
    setAiPanelOpen,
    openAI,
    pendingPrompt,
    consumePendingPrompt,
    toasts,
    pushToast,
    dismissToast,
    mobileNavOpen,
    setMobileNavOpen,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = t.kind === "success" ? CheckCircle2 : t.kind === "warning" ? AlertTriangle : Info;
          const tone =
            t.kind === "success" ? "text-emerald-500" : t.kind === "warning" ? "text-amber-500" : "text-sky-500";
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white p-3.5 shadow-lift"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{t.title}</p>
                {t.body ? <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{t.body}</p> : null}
              </div>
              <button
                aria-label="Dismiss notification"
                onClick={() => onDismiss(t.id)}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
