"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  Fragment,
} from "react";
import Image from "next/image";

export default function ImageAccordion({ items = [], initialIndex = 0 }) {
  const [active, setActive] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );

  const containerRef = useRef(null);

  const onKeyDown = useCallback(
    (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      setActive((idx) =>
        e.key === "ArrowRight"
          ? (idx + 1) % items.length
          : (idx - 1 + items.length) % items.length
      );
    },
    [items.length]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  if (!items.length) return null;

  return (
    <div
      ref={containerRef}
      className="wrapper imageAccordion withInfo"
      role="tablist"
      aria-label="Service gallery"
      tabIndex={0}
    >
      {items.map((it, i) => (
        <Fragment key={i}>
          {/* Pane */}
          <button
            type="button"
            className={[
              "pane",
              i === active ? "is-active" : "",
              i < active ? "leftOf" : "",
              i > active ? "rightOf" : "",
            ]
              .join(" ")
              .trim()}
            onClick={() => setActive(i)}
            role="tab"
            aria-selected={i === active}
            aria-controls={`pane-${i}`}
            tabIndex={0}
          >
            <div id={`pane-${i}`} className="imgRel" aria-hidden={false}>
              <Image
                src={it?.src ?? "/ourStoryBG.jpeg"}
                alt={it?.alt ?? ""}
                fill
                sizes="(min-width: 1024px) 33vw, 90vw"
                priority={i === active}
              />
            </div>
          </button>

          {/* Inline info panel */}
          {i === active && (it.title || it.subtitle || it.text) && (
            <div className="infoPanel" role="region" aria-live="polite">
              {it.subtitle && <div className="infoSubtitle">{it.subtitle}</div>}
              {it.title && <h3 className="infoTitle">{it.title}</h3>}
              {it.text && <p className="infoText">{it.text}</p>}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
