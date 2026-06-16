type Stage = "idle" | "active" | "done";

type WorkflowLifecycleProps = {
  loading: boolean;
  hasAnswer: boolean;
  frictionLogged: boolean;
};

const STAGES: Array<{ id: "understand" | "retrieve" | "recommend" | "log"; label: string }> = [
  { id: "understand", label: "Understand customer need" },
  { id: "retrieve", label: "Retrieve approved product evidence" },
  { id: "recommend", label: "Recommend or clarify" },
  { id: "log", label: "Log friction for corporate follow-up" }
];

export function WorkflowLifecycle({ loading, hasAnswer, frictionLogged }: WorkflowLifecycleProps) {
  const states: Record<typeof STAGES[number]["id"], Stage> = {
    understand: hasAnswer || loading ? "done" : "active",
    retrieve: loading ? "active" : hasAnswer ? "done" : "idle",
    recommend: hasAnswer ? "done" : "idle",
    log: frictionLogged ? "done" : hasAnswer ? "active" : "idle"
  };

  return (
    <section className="lifecycle" aria-label="CrewGuide workflow stages">
      {STAGES.map((stage, index) => (
        <div className="lifecycle-step" key={stage.id} data-state={states[stage.id]}>
          <span className="lifecycle-index">{index + 1}</span>
          <p className="lifecycle-label">{stage.label}</p>
        </div>
      ))}
    </section>
  );
}
