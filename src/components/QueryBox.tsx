"use client";

import { useState } from "react";

const samplePrompts: Array<{ label: string; text: string; fallback?: boolean }> = [
  {
    label: 'Electrician · 6" comp toe',
    text: "Customer is an electrician. Needs waterproof, comp toe, 6 inch, under $180. What should I show them?"
  },
  {
    label: "Outdoor mud · soft toe",
    text: "Someone works outdoors in mud and wants waterproof but does not need safety toe. What are good options?"
  },
  {
    label: "Ladder comparison",
    text: "Compare Marin Waterproof Comp Toe and Ryng Waterproof Comp Toe for ladder work."
  },
  {
    label: "Pull-on budget · fallback demo",
    text: "Customer wants a 10 inch pull-on waterproof soft toe boot under $160.",
    fallback: true
  },
  {
    label: "Heavy boot ask · fallback demo",
    text: "What product should I recommend for someone who wants a durable boot but complains about heavy footwear?",
    fallback: true
  }
];

type QueryBoxProps = {
  loading: boolean;
  onAsk: (query: string) => Promise<void>;
};

export function QueryBox({ loading, onAsk }: QueryBoxProps) {
  const [query, setQuery] = useState(samplePrompts[0].text);

  return (
    <form
      className="query-box"
      onSubmit={(event) => {
        event.preventDefault();
        if (query.trim()) {
          onAsk(query);
        }
      }}
    >
      <label htmlFor="crew-query">
        <h2>Rep Assistant</h2>
      </label>
      <textarea
        id="crew-query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Describe the customer need..."
      />
      <div className="prompt-row" aria-label="Sample prompts">
        {samplePrompts.map((prompt) => (
          <button
            className="chip"
            type="button"
            key={prompt.text}
            title={prompt.text}
            onClick={() => setQuery(prompt.text)}
          >
            {prompt.label}
            {prompt.fallback ? <span className="chip-flag">fallback</span> : null}
          </button>
        ))}
      </div>
      <div className="actions">
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Retrieving evidence..." : "Ask CrewGuide"}
        </button>
        <button className="secondary-button" type="button" onClick={() => setQuery("")}>
          Clear
        </button>
      </div>
    </form>
  );
}
