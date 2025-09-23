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

  // --- Refs
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

  // --- Indicator geometry
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const recalcIndicator = () => {
    const btn = btnRefs.current[active];
    const rail = tabsRef.current;
    if (!btn || !rail) return;

    // Use offsets for stability with flex gaps and while scrolling
    const left = btn.offsetLeft - rail.scrollLeft;
    const width = btn.offsetWidth;

    setIndicator({ left, width });
  };

  useLayoutEffect(() => {
    // initial measure
    recalcIndicator();

    // center active tab within the rail without scrolling the page
    const btn = btnRefs.current[active];
    const rail = tabsRef.current;
    if (rail && btn) {
      const targetLeft =
        btn.offsetLeft - (rail.clientWidth - btn.offsetWidth) / 2;
      rail.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });

      // ensure we measure after the browser applies the scroll position
      const raf1 = requestAnimationFrame(recalcIndicator);
      const raf2 = requestAnimationFrame(recalcIndicator);
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, safeItems.length]);

  useEffect(() => {
    const rail = tabsRef.current;
    if (!rail) return;

    const ro = new ResizeObserver(() => recalcIndicator());
    ro.observe(rail);
    btnRefs.current.forEach((el) => el && ro.observe(el));

    const onScroll = () => recalcIndicator();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recalcIndicator);

    return () => {
      window.removeEventListener("resize", recalcIndicator);
      rail.removeEventListener("scroll", onScroll);
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

          {/* Sliding indicator (gold background) */}
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

        {/* Mobile: accordion (≤1024px) */}
        <div className="ds-accordion hideDesktop">
          {safeItems.map((it, i) => (
            <div key={`${it.label}-acc`} className="ds-accItem">
              <button
                className={`ds-accHeader ${active === i ? "is-open" : ""}`}
                aria-expanded={active === i}
                aria-controls={`acc-panel-${i}`}
                id={`acc-header-${i}`}
                onClick={() => setActive(i)}
              >
                <span>{it.label}</span>
              </button>

              <div
                id={`acc-panel-${i}`}
                role="region"
                aria-labelledby={`acc-header-${i}`}
                className="ds-accPanel"
                data-open={active === i}
                ref={(el) => (panelRefs.current[i] = el)}
                style={
                  panelHeights[i] != null
                    ? { "--open-h": `${panelHeights[i]}px` }
                    : undefined
                }
              >
                <div className="ds-accInner">
                  <p>{it.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
