import BlogSection from "../BlogsSection/BlogSection";
import CommunitySection from "../CommunitySection/CommunitySection";
import AccordionSection from "../AccordionSection/AccordionSection";
import DifferenceTabs from "../../_components/DifferentTabs/DifferentTabs";

const HomePageLazyLoad = async ({
  locale,
  blogs_subheading,
  community_subheading,
}) => {
  const items = [
    {
      src: "/services1.jpg",
      alt: "Bespoke interiors at sunset",
      subtitle: "White-Glove Services",
      title: "Bespoke Sales & Leasing – Residential & Commercial",
      text: "Whether you’re acquiring a rare penthouse or leasing a signature commercial space, our luxury brokerage is defined by discretion, market intelligence, and a deep understanding of prestige.",
      captionSide: "right",
    },
    {
      src: "/services2.jpg",
      alt: "Lobby and residences",
      title: "Tailored to Your Vision",
      text: "We curate opportunities that align with your ambitions — and exceed expectations.",
      captionSide: "left",
    },
    {
      src: "/services3.jpg",
      alt: "Contemporary chandelier and lounge",
      title: "Exceptional, End to End",
      text: "From private viewings to bespoke negotiations, every detail is handled with utmost care.",
      captionSide: "left",
    },
  ];

  return (
    <>
      <DifferenceTabs
        titleBig="The Stage Lux"
        titleSmall="Difference"
        subtitle="What Sets Stage Lux Apart"
        items={[
          {
            label: "Exclusive Access",
            text: "Gain privileged entry to Dubai’s most anticipated luxury developments before they reach the open market through developer partnerships and insider connections...",
          },
          {
            label: "Tailored Service",
            text: "Bespoke guidance shaped around your ambitions, handled with absolute discretion and refined taste.",
          },
          {
            label: "Global Network",
            text: "Direct reach into premier developers, private sellers, and international UHNW buyer pools.",
          },
          {
            label: "Discreet Experience",
            text: "From private viewings to white-glove closing, every detail is handled quietly and flawlessly.",
          },
        ]}
        initialIndex={0}
      />
      <CommunitySection
        community_subheading={community_subheading}
        locale={locale}
      />
      <AccordionSection
        items={items}
        title1="White-Glove Services"
        title2="Tailored for the Exceptional"
      />
      <BlogSection locale={locale} blogs_subheading={blogs_subheading} />
    </>
  );
};

export default HomePageLazyLoad;
