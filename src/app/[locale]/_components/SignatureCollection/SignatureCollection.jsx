"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function SignatureCollections({
  title1 = "Signature",
  title2 = "Collections",
  blurb = "From architectural icons to serene waterfront estates, each property in our portfolio is a work of art. Discover homes crafted by the world’s leading developers and designers.",
  items = [],
}) {
  const svgRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Rotate every 1 second
  useEffect(() => {
    if (items.length <= 3) return; // no need to rotate if only 3
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [items.length]);

  // Get the 3 items for current "window"
  const visibleItems = (() => {
    if (items.length <= 3) return items;
    return [
      items[activeIndex % items.length],
      items[(activeIndex + 1) % items.length],
      items[(activeIndex + 2) % items.length],
    ];
  })();

  // Positioning along curve
  useEffect(() => {
    const compute = () => {
      const svg = svgRef.current;
      if (!svg) return;
      const path = svg.querySelector("#sig-curve");
      if (!path) return;

      const vb = svg.viewBox.baseVal;
      const sx = svg.clientWidth / vb.width;
      const sy = svg.clientHeight / vb.height;

      const total = path.getTotalLength();
      const n = visibleItems.length;

      // use full curve width
      const start = total * 0.1;
      const end = total * 0.9;
      const span = end - start;

      const pts = Array.from({ length: n }).map((_, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const l = start + span * t;
        const p = path.getPointAtLength(l);
        return { x: p.x * sx, y: p.y * sy };
      });

      setPoints(pts);
    };

    compute();
    const ro = new ResizeObserver(compute);
    svgRef.current && ro.observe(svgRef.current);
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("resize", compute);
      ro.disconnect();
    };
  }, [visibleItems]);

  return (
    <section className="signatureSection">
      <header className="sig-header">
        <h2 className="ds-title">
          <span className="sig-title1">{title1}</span>{" "}
          <span className="sig-title2">{title2}</span>
        </h2>
        <p className="sig-blurb">{blurb}</p>
      </header>

      <div className="sig-stage">
        <svg
          ref={svgRef}
          className="sig-svg"
          viewBox="0 0 1917 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sig-gold-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,222,155,.7)" />
              <stop offset="100%" stopColor="rgba(255,222,155,.35)" />
            </linearGradient>
          </defs>

          {(() => {
            const MID_Y = 80;
            const DEPTH = 220;
            const CTRL_Y = MID_Y + DEPTH;
            const CTRL_X_L = 300;
            const CTRL_X_R = 1617;

            return (
              <path
                id="sig-curve"
                d={`M 0 ${MID_Y} C ${CTRL_X_L} ${CTRL_Y}, ${CTRL_X_R} ${CTRL_Y}, 1917 ${MID_Y}`}
                fill="none"
                stroke="url(#sig-gold-stroke)"
                strokeWidth={3}
                opacity="0.85"
                pointerEvents="none"
              />
            );
          })()}
        </svg>

        {/* Render 3 visible items */}
        {points.map((p, i) => {
          const item = visibleItems[i];
          if (!item) return null;
          const isCenter = i === 1; // middle one
          return (
            <figure
              key={i}
              className={`sig-chip ${isCenter ? "is-center" : ""}`}
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                transform: `translate(-50%, calc(-40%))`,
                width: "auto",
              }}
            >
              <div className="sig-thumb">
                <Image
                  style={{ padding: "1rem", borderRadius: "120.592px" }}
                  src={item?.src || "/ourStoryBG.jpeg"}
                  alt={item?.label || "Signature"}
                  fill
                  sizes="(max-width: 1200px) 22vw, 260px"
                />
              </div>
              {item?.label && <figcaption>{item.label}</figcaption>}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
