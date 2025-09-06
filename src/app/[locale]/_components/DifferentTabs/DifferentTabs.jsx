"use client";

import React, { useState, useId } from "react";

export default function DifferenceTabs({
  titleBig = "The Stage Lux",
  titleSmall = "Difference",
  subtitle = "What Sets Stage Lux Apart",
  items = [],
  initialIndex = 0,
}) {
  const [active, setActive] = useState(initialIndex);
  const groupId = useId();

  // sensible fallback
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

  return (
    <section
      className="wrapper differenceSection"
      aria-labelledby={`${groupId}-title`}
    >
      <header className="ds-header">
        <h2 id={`${groupId}-title`} className="ds-title">
          <span className="ds-title-big">{titleBig}</span>{" "}
          <span className="ds-title-small">{titleSmall}</span>
        </h2>
        <p className="ds-subtitle">{subtitle}</p>
      </header>
      <div className="ds-parent">
        <div className="ds-tabs" role="tablist" aria-label="Differentiators">
          {safeItems.map((it, i) => (
            <button
              key={it.label}
              role="tab"
              aria-selected={active === i}
              aria-controls={`${groupId}-panel-${i}`}
              id={`${groupId}-tab-${i}`}
              tabIndex={active === i ? 0 : -1}
              className={`ds-tab ${active === i ? "is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              {it.label}
            </button>
          ))}
        </div>
        <div
          className="ds-panel"
          role="tabpanel"
          id={`${groupId}-panel-${active}`}
          aria-labelledby={`${groupId}-tab-${active}`}
        >
          <p>{safeItems[active].text}</p>
        </div>
      </div>
    </section>
  );
}
