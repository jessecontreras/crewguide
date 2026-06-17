"use client";

import { useEffect, useMemo, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { ProductScore } from "@/lib/catalog/product-types";
import { AiOperationsView } from "./AiOperationsView";
import { CatalogReadinessView } from "./CatalogReadinessView";
import { EvidencePanel } from "./EvidencePanel";
import { GovernanceView } from "./GovernanceView";
import { InventorySignalsView } from "./InventorySignalsView";
import { MobileNav } from "./MobileNav";
import { ProductImageModal } from "./ProductImageModal";
import { UseCasePipelineView } from "./UseCasePipelineView";
import { ProfileAccessMenu } from "./ProfileAccessMenu";
import { QueryBox } from "./QueryBox";
import { RecommendationCard } from "./RecommendationCard";
import { RepFeedback } from "./RepFeedback";
import { WorkflowLifecycle } from "./WorkflowLifecycle";
import type { AccessMode, ActiveView, AskResponse, FeedbackPayload, NavItem } from "./types";

type CrewGuideAppProps = {
  initialView: "rep" | "corporate";
};

const NAV_ITEMS: NavItem[] = [
  { id: "rep", label: "Rep Assistant", modes: ["store"] },
  { id: "use-case-pipeline", label: "Use Case Pipeline", modes: ["business-ops"] },
  { id: "ai-operations", label: "AI Use Case Operations", modes: ["business-ops"] },
  { id: "catalog-readiness", label: "Catalog Readiness", modes: ["business-ops"] },
  { id: "inventory-signals", label: "Inventory Signals", modes: ["business-ops"] },
  { id: "governance", label: "Governance", modes: ["business-ops"] }
];

const DEFAULT_VIEW_FOR_MODE: Record<AccessMode, ActiveView> = {
  store: "rep",
  "business-ops": "use-case-pipeline"
};

const INITIAL_ACCESS_MODE: Record<CrewGuideAppProps["initialView"], AccessMode> = {
  rep: "store",
  corporate: "business-ops"
};

const MODE_TO_PARAM: Record<AccessMode, string> = {
  store: "store",
  "business-ops": "business"
};

const VIEW_TO_PARAM: Record<ActiveView, string> = {
  rep: "rep",
  "use-case-pipeline": "pipeline",
  "ai-operations": "ai-ops",
  "catalog-readiness": "catalog",
  "inventory-signals": "inventory",
  governance: "governance"
};

const PARAM_TO_MODE: Record<string, AccessMode> = {
  store: "store",
  business: "business-ops"
};

const PARAM_TO_VIEW: Record<string, ActiveView> = {
  rep: "rep",
  pipeline: "use-case-pipeline",
  "ai-ops": "ai-operations",
  catalog: "catalog-readiness",
  inventory: "inventory-signals",
  governance: "governance"
};

function pushNavState(mode: AccessMode, view: ActiveView) {
  const url = new URL(window.location.href);
  url.searchParams.set("mode", MODE_TO_PARAM[mode]);
  url.searchParams.set("view", VIEW_TO_PARAM[view]);
  if (view !== "use-case-pipeline") url.searchParams.delete("case");
  window.history.pushState(null, "", url.toString());
}

function replaceNavState(mode: AccessMode, view: ActiveView) {
  const url = new URL(window.location.href);
  url.searchParams.set("mode", MODE_TO_PARAM[mode]);
  url.searchParams.set("view", VIEW_TO_PARAM[view]);
  if (view !== "use-case-pipeline") url.searchParams.delete("case");
  window.history.replaceState(null, "", url.toString());
}

function isViewValidForMode(view: ActiveView, mode: AccessMode): boolean {
  return NAV_ITEMS.some((item) => item.id === view && item.modes.includes(mode));
}

function getModeForView(view: ActiveView): AccessMode {
  return NAV_ITEMS.find((item) => item.id === view)?.modes[0] ?? "store";
}

export function CrewGuideApp({ initialView }: CrewGuideAppProps) {
  const [accessMode, setAccessMode] = useState<AccessMode>(INITIAL_ACCESS_MODE[initialView]);
  const [activeView, setActiveView] = useState<ActiveView>(
    DEFAULT_VIEW_FOR_MODE[INITIAL_ACCESS_MODE[initialView]]
  );
  const [askResponse, setAskResponse] = useState<AskResponse | null>(null);
  const [feedback, setFeedback] = useState<FeedbackPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [frictionLogged, setFrictionLogged] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [imageModalScore, setImageModalScore] = useState<ProductScore | null>(null);

  const visibleNavItems = useMemo(
    () => NAV_ITEMS.filter((item) => item.modes.includes(accessMode)),
    [accessMode]
  );

  useEffect(() => {
    if (!visibleNavItems.some((item) => item.id === activeView)) {
      setActiveView(DEFAULT_VIEW_FOR_MODE[accessMode]);
    }
  }, [accessMode, activeView, visibleNavItems]);

  function handleAccessModeChange(mode: AccessMode) {
    if (mode === accessMode) {
      return;
    }
    const defaultView = DEFAULT_VIEW_FOR_MODE[mode];
    setAccessMode(mode);
    setActiveView(defaultView);
    pushNavState(mode, defaultView);
  }

  function handleNavigate(view: ActiveView) {
    const targetMode = getModeForView(view);
    if (targetMode !== accessMode) {
      setAccessMode(targetMode);
    }
    setActiveView(view);
    pushNavState(targetMode, view);
  }

  async function refreshFeedback() {
    setFeedbackLoading(true);
    const response = await fetch("/api/feedback", { cache: "no-store" });
    const payload = (await response.json()) as FeedbackPayload;
    setFeedback(payload);
    setFeedbackLoading(false);
  }

  useEffect(() => {
    refreshFeedback().catch(() => setFeedbackLoading(false));
  }, []);

  useEffect(() => {
    function syncFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode");
      const viewParam = params.get("view");
      const mode: AccessMode | undefined = modeParam ? PARAM_TO_MODE[modeParam] : undefined;
      const view: ActiveView | undefined = viewParam ? PARAM_TO_VIEW[viewParam] : undefined;
      const defaultMode = INITIAL_ACCESS_MODE[initialView];
      const defaultView = isViewValidForMode(initialView as ActiveView, defaultMode)
        ? (initialView as ActiveView)
        : DEFAULT_VIEW_FOR_MODE[defaultMode];

      if (mode && view && isViewValidForMode(view, mode)) {
        setAccessMode(mode);
        setActiveView(view);
      } else if (mode && (!view || !isViewValidForMode(view, mode))) {
        const safeView = DEFAULT_VIEW_FOR_MODE[mode];
        setAccessMode(mode);
        setActiveView(safeView);
        replaceNavState(mode, safeView);
      } else if (!mode && view) {
        const canonicalMode = getModeForView(view);
        setAccessMode(canonicalMode);
        setActiveView(view);
        replaceNavState(canonicalMode, view);
      } else {
        setAccessMode(defaultMode);
        setActiveView(defaultView);
        replaceNavState(defaultMode, defaultView);
      }
    }

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [initialView]);

  async function handleAsk(query: string) {
    setLoading(true);
    setError(null);
    setFrictionLogged(false);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error("CrewGuide could not process that question.");
      }

      const payload = (await response.json()) as AskResponse;
      setAskResponse(payload);
      setExpandedProductId(
        payload.result.fallback ? null : (payload.result.topProducts[0]?.product.id ?? null)
      );
      setImageModalScore(null);
      if (payload.frictionEvent) {
        setFrictionLogged(true);
        await refreshFeedback();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRepFeedbackLogged() {
    setFrictionLogged(true);
    await refreshFeedback();
  }

  const missingCount = useMemo(() => {
    const events = feedback?.events ?? [];
    return events.filter((event) => event.reason === "missing_attribute").length;
  }, [feedback?.events]);

  const topProducts = askResponse?.result.topProducts ?? [];
  const currentLabel = visibleNavItems.find((item) => item.id === activeView)?.label ?? "";

  return (
    <Tooltip.Provider delayDuration={150}>
      <main className="shell">
        <MobileNav
          currentLabel={currentLabel}
          navItems={visibleNavItems}
          activeView={activeView}
          onNavigate={handleNavigate}
          accessMode={accessMode}
          onAccessModeChange={handleAccessModeChange}
        />

        <nav className="side-nav" aria-label="CrewGuide navigation">
          <div className="side-nav-brand">
            <img src="/brand/brunt-logo.svg" alt="BRUNT" className="side-nav-logo" />
            <p className="brand-name">CrewGuide</p>
          </div>
          <ProfileAccessMenu
            accessMode={accessMode}
            onAccessModeChange={handleAccessModeChange}
            idPrefix="desktop-profile-menu"
          />
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="side-nav-item"
              aria-current={activeView === item.id}
              onClick={() => handleNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="workspace-main">
          {activeView === "rep" ? (
            <div className="page-header">
              <p className="page-eyebrow">Store</p>
              <h1 className="page-title">Rep Assistant</h1>
              <p className="page-description">Grounded product guidance for store teams.</p>
            </div>
          ) : null}

          {activeView === "rep" ? (
            <WorkflowLifecycle
              loading={loading}
              hasAnswer={askResponse !== null}
              frictionLogged={frictionLogged}
            />
          ) : null}

          {activeView === "rep" ? (
            <section className="stack" aria-label="Rep assistant">
              <div className="panel">
                <QueryBox loading={loading} onAsk={handleAsk} />
                {error ? <p className="fallback">{error}</p> : null}
              </div>

              {askResponse ? (
                <section className="answer-grid" aria-label="CrewGuide answer">
                  <div className="panel stack">
                    {askResponse.result.fallback ? (
                      <div className="fallback">
                        <strong>Clarify before recommending.</strong>
                        <p className="summary">{askResponse.answer.summary}</p>
                        <p className="notice">
                          This is intentional. The assistant did not find enough approved product
                          evidence to answer safely, so it asks instead of guessing.
                        </p>
                      </div>
                    ) : (
                      <p className="summary">{askResponse.answer.summary}</p>
                    )}
                    {!askResponse.result.fallback ? (
                      <div className="product-list">
                        {topProducts.map((score, index) => (
                          <RecommendationCard
                            key={score.product.id}
                            score={score}
                            answer={askResponse.answer}
                            rank={index}
                            expanded={expandedProductId === score.product.id}
                            onExpand={() => setExpandedProductId(score.product.id)}
                            onCollapse={() => setExpandedProductId(null)}
                            onOpenImage={() => setImageModalScore(score)}
                          />
                        ))}
                      </div>
                    ) : null}

                    <RepFeedback
                      query={askResponse.result.query}
                      productName={askResponse.result.topProducts[0]?.product.name}
                      onLogged={handleRepFeedbackLogged}
                    />
                  </div>
                  <EvidencePanel response={askResponse} />
                </section>
              ) : (
                <section className="panel">
                  <h2>Ready prompts</h2>
                  <p className="notice">
                    Try the electrician query first, then the 10 inch pull-on budget query to show
                    the fallback and friction loop.
                  </p>
                </section>
              )}
            </section>
          ) : null}

          {activeView === "use-case-pipeline" ? <UseCasePipelineView /> : null}

          {activeView === "ai-operations" ? (
            <AiOperationsView
              feedback={feedback}
              loading={feedbackLoading}
              missingCount={missingCount}
              onRefresh={refreshFeedback}
              onNavigate={handleNavigate}
            />
          ) : null}

          {activeView === "catalog-readiness" ? <CatalogReadinessView feedback={feedback} /> : null}

          {activeView === "inventory-signals" ? <InventorySignalsView /> : null}

          {activeView === "governance" ? <GovernanceView /> : null}
        </div>
      </main>

      <ProductImageModal score={imageModalScore} onClose={() => setImageModalScore(null)} />
    </Tooltip.Provider>
  );
}
