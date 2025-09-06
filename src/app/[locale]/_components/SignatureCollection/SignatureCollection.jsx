"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function SignatureCollections({
  title1 = "Signature",
  title2 = "Collections",
  blurb = "From architectural icons to serene waterfront estates, each property in our portfolio is a work of art. Discover homes crafted by the world’s leading developers and designers.",
  items = [],
}) {
  const data = items;
  const svgRef = useRef(null);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const compute = () => {
      const svg = svgRef.current;
      if (!svg) return;
      const path = svg.querySelector("#sig-curve");
      if (!path) return;

      const vb = svg.viewBox.baseVal; // viewBox {width,height}
      const sx = svg.clientWidth / vb.width; // viewBox -> px
      const sy = svg.clientHeight / vb.height;

      const total = path.getTotalLength();
      const n = data.length;

      // Use almost full width of the curve (minimal side gaps)
      const edgePad = 0.18;
      const start = total * edgePad;
      const end = total * (1 - edgePad);
      const span = end - start;

      // Even distribution
      const spread = 0.95;

      const pts = Array.from({ length: n }).map((_, i) => {
        const t0 = n === 1 ? 0.5 : i / (n - 1); // 0..1
        const t = 0.5 + (t0 - 0.5) * spread;
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
  }, [data.length]);

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
            // Move curve UP by lowering the midline Y
            const MID_Y = 80; // endpoints Y (closer to top)
            const DEPTH = 220; // dip amount for the smile
            const CTRL_Y = MID_Y + DEPTH;
            // Wider smile so ends show nicely
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

        {points.map((p, i) => {
          const item = data[i];
          const isCenter = i === Math.floor(data.length / 2);
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
