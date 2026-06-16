"use client";

import { useState } from "react";

type RepFeedbackProps = {
  query: string;
  productName?: string;
  onLogged: () => Promise<void> | void;
};

const FEEDBACK_OPTIONS: Array<{ key: string; label: string; logsFriction: boolean }> = [
  { key: "helpful", label: "Helpful", logsFriction: false },
  { key: "missing_product", label: "Missing product", logsFriction: true },
  { key: "missing_attribute", label: "Missing attribute", logsFriction: true },
  { key: "needs_clarification", label: "Needs clarification", logsFriction: true }
];

export function RepFeedback({ query, productName, onLogged }: RepFeedbackProps) {
  const [sendingKey, setSendingKey] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function send(option: (typeof FEEDBACK_OPTIONS)[number]) {
    setSendingKey(option.key);

    if (!option.logsFriction) {
      setStatus("Thanks - marked helpful for this demo session.");
      setSendingKey(null);
      return;
    }

    await fetch("/api/rep-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, productName, feedback: option.key })
    });

    setStatus("Logged for corporate follow-up.");
    setSendingKey(null);
    await onLogged();
  }

  return (
    <div className="rep-feedback">
      <p className="small-label">Was this answer useful?</p>
      <div className="actions">
        {FEEDBACK_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            className="secondary-button"
            disabled={sendingKey !== null}
            onClick={() => send(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {status ? <p className="notice">{status}</p> : null}
    </div>
  );
}
