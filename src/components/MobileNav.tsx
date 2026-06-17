"use client";

import { useEffect, useRef, useState } from "react";
import type { AccessMode, ActiveView, NavItem } from "./types";

type MobileNavProps = {
  currentLabel: string;
  navItems: NavItem[];
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  accessMode: AccessMode;
  onAccessModeChange: (mode: AccessMode) => void;
};

export function MobileNav({
  currentLabel,
  navItems,
  activeView,
  onNavigate,
  accessMode,
  onAccessModeChange
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleModeChange(mode: AccessMode) {
    onAccessModeChange(mode);
  }

  function handleNavSelect(view: ActiveView) {
    setOpen(false);
    onNavigate(view);
  }

  return (
    <div className="mobile-nav-root" ref={rootRef}>
      <div className="mobile-header">
        <div className="mobile-header-title">
          <span className="mobile-header-brand">CrewGuide</span>
          <span className="mobile-header-page">{currentLabel}</span>
        </div>
        <button
          ref={triggerRef}
          type="button"
          className="mobile-nav-trigger"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav-dropdown"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      <div
        id="mobile-nav-dropdown"
        className={`mobile-nav-dropdown${open ? " open" : ""}`}
        role="dialog"
        aria-label="Navigation"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="mnav-workspace">
          <span className="mnav-avatar" aria-hidden="true">CD</span>
          <div className="mnav-workspace-info">
            <span className="mnav-workspace-name">CrewGuide Demo</span>
            <span className="mnav-workspace-sub">Demo workspace</span>
          </div>
        </div>

        <div className="mnav-section">
          <p className="mnav-section-label">Access</p>
          <div className="mnav-mode-row">
            <button
              type="button"
              className={`mnav-mode-btn${accessMode === "store" ? " active" : ""}`}
              aria-pressed={accessMode === "store"}
              onClick={() => handleModeChange("store")}
            >
              Store
            </button>
            <button
              type="button"
              className={`mnav-mode-btn${accessMode === "business-ops" ? " active" : ""}`}
              aria-pressed={accessMode === "business-ops"}
              onClick={() => handleModeChange("business-ops")}
            >
              Business Ops
            </button>
          </div>
        </div>

        <div className="mnav-section">
          <p className="mnav-section-label">
            {accessMode === "store" ? "Store view" : "Business Ops view"}
          </p>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="mnav-page-btn"
              aria-current={activeView === item.id ? "page" : undefined}
              onClick={() => handleNavSelect(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
