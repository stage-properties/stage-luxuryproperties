"use client";
import React, { useState } from "react";
import { Link } from "@/i18n/routing";

export default function ListLink({
  label,
  path,
  subLink,
  responsive,
  onNavigate,
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(subLink) && subLink.length > 0;

  return (
    <li className="link">
      {hasChildren ? (
        <button
          type="button"
          className="linkContainer"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation(); // don't bubble to parents
            setOpen((v) => !v); // only toggle submenu
          }}
        >
          <span className="label">{label}</span>
          <span className={`chevron ${open ? "open" : ""}`}>⌄</span>
        </button>
      ) : (
        <Link
          href={path}
          className="linkContainer"
          onClick={onNavigate} // ✅ close drawer on real navigation
        >
          <span className="label">{label}</span>
        </Link>
      )}

      {hasChildren && open && (
        <ul className="subLinks">
          {subLink.map((child) => (
            <li key={child.id}>
              <Link
                href={child.path}
                onClick={onNavigate} // ✅ close drawer when clicking a child link
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .link {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 12px;
        }
        .linkContainer {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 222, 155, 0.1);
          color: #fff;
          font-family: var(--lara-font-family, system-ui);
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          cursor: pointer;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .linkContainer:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 222, 155, 0.25);
        }
        .chevron {
          transition: transform 0.25s ease;
        }
        .chevron.open {
          transform: rotate(180deg);
        }
        .subLinks {
          margin: 8px 0 14px;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .subLinks li a {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          text-transform: none;
          font-family: var(--lara-font-family, system-ui);
          transition: color 0.2s ease;
        }
        .subLinks li a:hover {
          color: #fff;
        }
      `}</style>
    </li>
  );
}
