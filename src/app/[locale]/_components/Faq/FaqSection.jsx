import { fetchFAQsByPage } from "./service";
import Faq from "./component/Faq";
import { useServerPathname } from "../../_utils/useServerPathname";

const FaqSection = async ({ style, classname, headerStyle, parentStyleMobile, locale }) => {

    const {pathname} = useServerPathname()

  // If the path is not passed in, return null.
  if (!pathname) return null;

  // Fetch data on the server side.
  const data = await fetchFAQsByPage({ path: pathname });
  if (!data || !data.faq || !data.faq.length) return null;

  // Create the structured data for SEO.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faq.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answerNoFormatting
      }
    }))
  };

  const structuredDataJSON = JSON.stringify(structuredData);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJSON }} />
      <Faq data={data.faq} style={style} headerStyle={headerStyle} classname={classname} parentStyleMobile={parentStyleMobile} />
    </>
  );
};

export default FaqSection;