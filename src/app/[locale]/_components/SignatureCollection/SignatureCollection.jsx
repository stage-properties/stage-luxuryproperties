"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function SignatureCollections({
  title1 = "Signature",
  title2 = "Collections",
  blurb = "From architectural icons to serene waterfront estates, each property in our portfolio is a work of art. Discover homes crafted by the world’s leading developers and designers.",
  items = [],
}) {
  const svgRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [offset, setOffset] = useState(0); // which position each chip moves to

  // show up to 5 chips
  const visibleItems = useMemo(() => items.slice(0, 5), [items]);

  // rotate positions every 10 seconds
  useEffect(() => {
    if (visibleItems.length <= 1) return;
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % visibleItems.length);
    }, 5000);
    return () => clearInterval(id);
  }, [visibleItems.length]);

  // compute fixed positions along the curve
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const path = svg.querySelector("#sig-centerline");
    if (!path) return;

    const vb = svg.viewBox.baseVal;
    const sx = (svg.clientWidth || vb.width) / vb.width || 1;
    const sy = (svg.clientHeight || vb.height) / vb.height || 1;

    const n = Math.max(1, visibleItems.length);
    const total = path.getTotalLength();
    const spacing = n > 1 ? 1 / (n - 1) : 1;

    const pts = Array.from({ length: n }).map((_, i) => {
      const t = n === 1 ? 0.5 : i * spacing;
      const p = path.getPointAtLength(total * t);
      return { x: p.x * sx, y: p.y * sy };
    });

    setPoints(pts);
  }, [visibleItems.length]);

  // re-measure on resize
  useEffect(() => {
    const recompute = () => setPoints((prev) => [...prev]);
    const ro = new ResizeObserver(recompute);
    if (svgRef.current) ro.observe(svgRef.current);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, []);

  // visual focus based on position index (middle is spotlight)
  const n = Math.max(1, visibleItems.length);
  const centerIndex = (n - 1) / 2;

  return (
    <section className="signatureSection">
      <header className="sig-header">
        <div className="sig-titleRow">
          <span className="sig-title1">{title1}</span>
          <span className="sig-title2">{title2}</span>
        </div>
        <p className="sig-blurb">{blurb}</p>
      </header>

      <div className="sig-stage">
        {/* spotlight fixed center */}
        <div
          className="sig-spotlight"
          aria-hidden="true"
          style={{ left: "50%", top: "50%" }}
        />

        {/* SVG behind chips */}
        <svg
          ref={svgRef}
          className="sig-svg"
          viewBox="0 0 1917 336"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="sig-ribbon-grad"
              x1="1989.5"
              y1="-13.5"
              x2="1292.57"
              y2="951.466"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="rgba(17,17,17,0)" />
              <stop offset="0.761566" stopColor="#FFDB9F" />
              <stop offset="1" stopColor="rgba(17,17,17,0)" />
            </linearGradient>
            <filter id="sig-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            id="sig-ribbon"
            d="M1916.5 0.5C1916.5 0.833333 1916.5 1.16667 1916.5 1.5C1890.73 21.7325 1860.64 40.4429 1831.67 58.2442C1574.14 210.695 1285.59 328.106 983.833 331.998C983.222 331.999 982.611 332 982 332C664.482 330.418 357.294 216.619 85.5979 56.1361C56.3576 38.5314 27.2789 20.2577 -0.706596 0.595137C-0.902199 0.865046 -1.0978 1.13495 -1.2934 1.40486C26.633 21.2647 55.6162 39.6966 84.7928 57.4692C355.849 219.459 663.416 334.4 982 336C982.613 336 983.227 335.999 983.84 335.998C1286.83 332.064 1575.59 213.532 1832.49 59.5945C1861.2 41.023 1892.08 24.7209 1916.5 0.5Z"
            fill="url(#sig-ribbon-grad)"
            opacity="0.85"
          />

          <path
            id="sig-centerline"
            d="M 0 70 C 480 430, 1437 430, 1917 70"
            fill="none"
            stroke="transparent"
            strokeWidth="1"
            filter="url(#sig-glow)"
          />
        </svg>

        {/* Chips: each item moves to a new point index based on offset */}
        {visibleItems.map((item, i) => {
          if (!points.length) return null;

          // where this item should sit this cycle
          const posIndex = (i + offset) % n;
          const p = points[posIndex];

          // opacity/offset based on position, not item index
          const dist = Math.abs(posIndex - centerIndex);
          const maxDist = Math.max(centerIndex, n - 1 - centerIndex) || 1;
          const fadeStrength = 0.78;
          const curve = 1.25;
          const opacityVar = Math.max(
            0.2,
            1 - Math.pow(dist / maxDist, curve) * fadeStrength
          );

          const stageH = svgRef.current ? svgRef.current.clientHeight : 0;
          const baseOffset = stageH * 0.14;
          const dy = dist === 0 ? 0 : -baseOffset * (dist / maxDist);

          return (
            <figure
              key={i}
              className="sig-chip"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                "--chip-scale": 1,
                "--chip-opacity": opacityVar,
                "--chip-dy": `${dy}px`,
              }}
            >
              <div className="sig-frame">
                <div className="sig-circle">
                  <Image
                    src={item?.src || "/ourStoryBG.jpeg"}
                    alt={item?.label || "Signature"}
                    fill
                    sizes="(max-width: 1200px) 26vw, 260px"
                  />
                </div>
              </div>
              {item?.label && <figcaption>{item.label}</figcaption>}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
