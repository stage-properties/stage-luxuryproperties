import { ReduxProvider } from "./redux/provider";
import "./globals.css";
import "./app.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useServerPathname } from "./_utils/useServerPathname";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import GlobalPopup from "./_components/GlobalPopup/GlobalPopup";
import PopularSearchesSection from "./_components/PopularSearches/PopularSearchesSection";
import { serverPathname } from "@/app/[locale]/_utils/serverPathname";

export default async function RootLayout({ children, params: { locale } }) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const { origin } = serverPathname();

  const { pathname } = useServerPathname();

  const jsonData = `{"@context":"http://schema.org","@type":"Organization","name":"Stage Properties Brokers LLC","legalName":"Stage Properties Brokers LLC","alternateName":"Stage Properties Brokers LLC","url":"${origin}/","description":"Discover prime investment opportunities with Stage Properties, Dubai's leading property broker. Your gateway to buying properties in Dubai.","sameAs":["https://www.facebook.com/stageproperties/","https://x.com/stageproperties","https://www.instagram.com/stageproperties/","https://www.youtube.com/@stageproperties","https://www.linkedin.com/company/stage-properties-brokers-llc?originalSubdomain=ae","https://www.tiktok.com/@stageproperties"],"logo":"${origin}/_next/image?url=%2FStage_Logo_White.png&w=828&q=75","image":"${origin}/_next/image?url=%2FStage_Logo_White.png&w=828&q=75","telephone":"+971 522 081 705","email":"info@stageproperties.com","founder":"Ghassan Saliba","foundingDate":"01-01-2020","award":["Alliance by EMAAR", "DAMAC Unity", "Rising Star Award by DAMAC", "Regalia Performance Award by DEYAAR Properties", "Rising Star Award by Jumierah Golf Estates", "Broker Award by Binghatti"],"foundingLocation":"Dubai","numberOfEmployees":"98","address":{"@type":"PostalAddress","streetAddress":"OFFICE 106, BUILDING 3","addressLocality":" DUBAI HILLS BUSINESS PARK","addressRegion":"DUBAI HILLS ESTATE","postalCode":"215088, Dubai, UAE","addressCountry":"AE"},"contactPoint":{"@type":"ContactPoint","contactType":"sales","telephone":"+971 522 081 705","email":"info@stageproperties.com","areaServed":"AE","availableLanguage":["English","Turkish","Arabic","Spanish","French","German","Hindi","Punjabi","Pashto","Romanian","Russian","Turkish","Urdu"]},"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"79"}}`;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <link rel="icon preload" href="/favicon.ico" sizes="any" />
      {/* <meta name="google-site-verification" content="mhv9v3VuNgVQ3YpO9ijfvRlcUsd29_kGoEOBR3nteRc"></meta> */}
      <head>
        {pathname === "/" && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonData }}
          />
        )}

        <meta name="yandex-verification" content="1bc00c15b3a4cfce" />
        <meta name="msvalidate.01" content="2F8C1B95FC778023AF724047A0471392" />
        {/* <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "j4t4lj46q5");
          `
        }}
      >
      </script> */}
        {/* <!-- Google Tag Manager --> */}
        {/* <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            '
            https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PFLLGQW5');
          `
        }}
      >
      </script> */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=AW-449815056" /> */}
        {/* <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'AW-449815056');
          `
        }}
      >
      </script> */}

        {/* <!-- End Google Tag Manager --> */}
      </head>
      <body>
        {/* <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-PFLLGQW5" 
            height="0" 
            width="0" 
            style={{ display: "none", visibility: "hidden" }} 
          />
        </noscript> */}
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <GlobalPopup />
            {children}
            <PopularSearchesSection />
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
