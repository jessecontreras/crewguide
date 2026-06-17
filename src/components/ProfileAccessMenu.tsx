"use client";

import { useEffect, useRef, useState } from "react";
import type { AccessMode } from "./types";

type ProfileAccessMenuProps = {
  accessMode: AccessMode;
  onAccessModeChange: (mode: AccessMode) => void;
  idPrefix: string;
};

export function ProfileAccessMenu({ accessMode, onAccessModeChange, idPrefix }: ProfileAccessMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownId = `${idPrefix}-dropdown`;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectMode(mode: AccessMode) {
    onAccessModeChange(mode);
    setOpen(false);
  }

  return (
    <div className="profile-menu" ref={rootRef}>
      <button
        type="button"
        className="profile-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={dropdownId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="profile-avatar" aria-hidden="true">
          CD
        </span>
        <span className="profile-meta">
          <span className="profile-name">CrewGuide Demo</span>
          <span className="profile-substatus">Demo workspace</span>
        </span>
        <span className="profile-chevron" aria-hidden="true">
          &#9662;
        </span>
      </button>

      <div
        id={dropdownId}
        className={`profile-dropdown${open ? " open" : ""}`}
        role="menu"
        aria-label="Access mode"
        inert={!open}
      >
        <p className="profile-dropdown-label">Access mode</p>
        <button
          type="button"
          role="menuitemradio"
          aria-checked={accessMode === "store"}
          className="access-mode-option"
          onClick={() => selectMode("store")}
        >
          <span className="access-mode-option-title">Store</span>
          <span className="access-mode-option-desc">Store team product guidance</span>
        </button>
        <button
          type="button"
          role="menuitemradio"
          aria-checked={accessMode === "business-ops"}
          className="access-mode-option"
          onClick={() => selectMode("business-ops")}
        >
          <span className="access-mode-option-title">Business Ops</span>
          <span className="access-mode-option-desc">AI operations and governed signals</span>
        </button>
        <p className="profile-dropdown-note">
          Demo access mode. Production would enforce this with identity, role claims, route
          guards, and API authorization.
        </p>
      </div>
    </div>
  );
}
