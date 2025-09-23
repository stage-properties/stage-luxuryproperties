"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function DifferenceTabs({
  titleBig = "The stage lux",
  titleSmall = "Difference",
  subtitle = "What Sets Stage Lux Apart",
  items = [],
  initialIndex = 0,
}) {
  const [active, setActive] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max((items?.length || 1) - 1, 0))
  );

  const safeItems = items?.length
    ? items
    : [
        {
          label: "Exclusive Access",
          text: "Gain privileged entry to Dubai’s most anticipated luxury developments before they reach the open market...",
        },
        {
          label: "Tailored Service",
          text: "Bespoke representation shaped around your ambitions, with absolute discretion and refined taste...",
        },
        {
          label: "Global Network",
          text: "Direct reach into premier developers, private sellers, and international UHNW circles...",
        },
        {
          label: "Discreet Experience",
          text: "From private viewings to white-glove closing, every interaction is handled with quiet precision...",
        },
      ];

  // --- Refs for indicator math
  const tabsRef = useRef(null);
  const btnRefs = useRef([]);
  const indicatorRef = useRef(null);

  // --- Mobile panel measuring
  const panelRefs = useRef([]);
  const [panelHeights, setPanelHeights] = useState([]);

  const measurePanels = () => {
    const hs = panelRefs.current.map((el) => (el ? el.scrollHeight : 0));
    setPanelHeights(hs);
  };

  useEffect(() => {
    measurePanels();
    const ro = new ResizeObserver(measurePanels);
    panelRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measurePanels);
    return () => {
      window.removeEventListener("resize", measurePanels);
      ro.disconnect();
    };
  }, [safeItems.length]);

  // Indicator geometry (left + width)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const recalcIndicator = () => {
    const btn = btnRefs.current[active];
    const rail = tabsRef.current;
    if (!btn || !rail) return;
    const btnRect = btn.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    const left = btnRect.left - railRect.left + rail.scrollLeft;
    const width = btnRect.width;
    setIndicator({ left, width });
  };

  useLayoutEffect(() => {
    recalcIndicator();
    // rail-only scroll centering (prevents page jump)
    const btn = btnRefs.current[active];
    const rail = tabsRef.current;
    if (rail && btn) {
      const targetLeft =
        btn.offsetLeft - (rail.clientWidth - btn.offsetWidth) / 2;
      rail.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, safeItems.length]);

  useEffect(() => {
    if (!tabsRef.current) return;
    const ro = new ResizeObserver(() => recalcIndicator());
    ro.observe(tabsRef.current);
    btnRefs.current.forEach((el) => el && ro.observe(el));
    const onScroll = () => recalcIndicator();
    tabsRef.current.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recalcIndicator);
    return () => {
      window.removeEventListener("resize", recalcIndicator);
      tabsRef.current?.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      className="wrapper differenceSection"
      aria-labelledby="difference-title"
    >
      <header className="ds-header">
        <h2 id="difference-title" className="ds-title">
          <span className="ds-title-big">{titleBig}</span>{" "}
          <span className="ds-title-small">{titleSmall}</span>
        </h2>
        <p className="ds-subtitle">{subtitle}</p>
      </header>

      <div className="ds-parent">
        {/* Tabs rail */}
        <div
          className="ds-tabs"
          role="tablist"
          aria-label="Differentiators"
          ref={tabsRef}
        >
          {safeItems.map((it, i) => (
            <div key={it.label} className="ds-tabWrapper">
              <button
                ref={(el) => (btnRefs.current[i] = el)}
                role="tab"
                aria-selected={active === i}
                aria-controls={`panel-${i}`}
                id={`tab-${i}`}
                tabIndex={active === i ? 0 : -1}
                className={`ds-tab ${active === i ? "is-active" : ""}`}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    setActive((p) => (p + 1) % safeItems.length);
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    setActive(
                      (p) => (p - 1 + safeItems.length) % safeItems.length
                    );
                  }
                }}
              >
                <span>{it.label}</span>
              </button>
            </div>
          ))}

          {/* Sliding indicator */}
          <div
            aria-hidden="true"
            ref={indicatorRef}
            className="ds-indicator"
            style={{
              width: `${indicator.width}px`,
              transform: `translateX(${indicator.left}px)`,
            }}
          />
        </div>

        {/* Desktop: horizontal sliding track */}
        <div className="ds-panels hideMobile" role="presentation">
          <div
            className="ds-panelsTrack"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {safeItems.map((it, i) => (
              <section
                key={it.label}
                className="ds-panelSlide"
                role="tabpanel"
                id={`panel-${i}`}
                aria-labelledby={`tab-${i}`}
                aria-hidden={active !== i}
              >
                <p>{it.text}</p>
              </section>
            ))}
          </div>
        </div>

        {/* Mobile: vertical sliding under each button (accordion) */}
        {safeItems.map((it, i) => (
          <div
            key={`${it.label}-m`}
            className="ds-panel hideDesktop ds-panelMobile"
            role="tabpanel"
            id={`panel-${i}-m`}
            aria-labelledby={`tab-${i}`}
            aria-hidden={active !== i}
            data-open={active === i}
            ref={(el) => (panelRefs.current[i] = el)}
            style={
              panelHeights[i] != null
                ? { ["--open-h"]: `${panelHeights[i]}px` }
                : undefined
            }
          >
            <div className="ds-panelMobile-inner">
              <p>{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
