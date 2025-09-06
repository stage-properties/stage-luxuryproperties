"use client";

import React from "react";
import ImageAccordion from "../../_components/ImageAccordion/ImageAccordion";

export default function AccordionSection({ title1, title2, items }) {
  return (
    <section className="wrapper accordionSection">
      <div className="accordionHeader">
        {title1 && <h2 className="title1">{title1}</h2>}
        {title2 && <h3 className="title2">{title2}</h3>}
      </div>

      <ImageAccordion items={items} />
    </section>
  );
}
