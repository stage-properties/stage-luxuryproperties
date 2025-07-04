import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://stageproperties.com';

    const staticUrls = [
      `${baseUrl}/ar`,
      `${baseUrl}/ar/offplan`,
      `${baseUrl}/ar/our-team`,
      `${baseUrl}/ar/contact-us`,
      `${baseUrl}/ar/blogs`,
      `${baseUrl}/ar/developers`,

      `${baseUrl}/ar/buy/residential/properties-for-sale`,
      `${baseUrl}/ar/buy/residential/apartment-for-sale`,
      `${baseUrl}/ar/buy/residential/duplex-for-sale`,
      `${baseUrl}/ar/buy/residential/land-residential-for-sale`,
      `${baseUrl}/ar/buy/residential/townhouse-for-sale`,
      `${baseUrl}/ar/buy/residential/villa-for-sale`,
      `${baseUrl}/ar/buy/residential/penthouse-for-sale`,
      `${baseUrl}/ar/buy/residential/residential-full-floor-for-sale`,
      `${baseUrl}/ar/buy/residential/residential-half-floor-for-sale`,

      `${baseUrl}/ar/rent/residential/properties-for-rent`,
      `${baseUrl}/ar/rent/residential/apartment-for-rent`,
      `${baseUrl}/ar/rent/residential/duplex-for-rent`,
      `${baseUrl}/ar/rent/residential/land-residential-for-rent`,
      `${baseUrl}/ar/rent/residential/townhouse-for-rent`,
      `${baseUrl}/ar/rent/residential/villa-for-rent`,
      `${baseUrl}/ar/rent/residential/penthouse-for-rent`,
      `${baseUrl}/ar/rent/residential/residential-full-floor-for-rent`,
      `${baseUrl}/ar/rent/residential/residential-half-floor-for-rent`,

      `${baseUrl}/ar/buy/commercial/properties-for-sale`,
      `${baseUrl}/ar/buy/commercial/labour-camp-for-sale`,
      `${baseUrl}/ar/buy/commercial/office-for-sale`,
      `${baseUrl}/ar/buy/commercial/warehouse-for-sale`,
      `${baseUrl}/ar/buy/commercial/retail-for-sale`,
      `${baseUrl}/ar/buy/commercial/shop-for-sale`,
      `${baseUrl}/ar/buy/commercial/commercial-full-floor-for-sale`,
      `${baseUrl}/ar/buy/commercial/commercial-half-floor-for-sale`,

      `${baseUrl}/ar/rent/commercial/properties-for-rent`,
      `${baseUrl}/ar/rent/commercial/labour-camp-for-rent`,
      `${baseUrl}/ar/rent/commercial/office-for-rent`,
      `${baseUrl}/ar/rent/commercial/warehouse-for-rent`,
      `${baseUrl}/ar/rent/commercial/retail-for-rent`,
      `${baseUrl}/ar/rent/commercial/shop-for-rent`,
      `${baseUrl}/ar/rent/commercial/commercial-full-floor-for-rent`,
      `${baseUrl}/ar/rent/commercial/commercial-half-floor-for-rent`,

      `${baseUrl}/ar/mortgage-calculator`,
      `${baseUrl}/ar/areas-and-communities`,
    ];

    const staticEntries = staticUrls.map((entry) => {

      const _changeFrequency = (entry) => {
        if(entry === `${baseUrl}/our-team`){
          return 'monthly'
        } 
        else if(entry === `${baseUrl}/contact-us`){
          return 'yearly'
        }
        else if(entry === `${baseUrl}/mortgage-calculator`){
          return 'never'
        } 
        else return 'daily'
      }

      return (
        {
          url: entry,
          lastModified: new Date().toISOString().slice(0, 10),
          changeFrequency: _changeFrequency(entry),
          priority: entry === `${baseUrl}/` ? 1.0 : 0.9,
        }
      )
  });

    const sitemapXml = buildSitemapXml(staticEntries);

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Content-Length': Buffer.byteLength(sitemapXml).toString(),
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.error();
  }
}

function buildSitemapXml(entries) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const entry of entries) {
    xml += '<url>';
    xml += `<loc>${entry.url}</loc>`;
    xml += `<lastmod>${entry.lastModified}</lastmod>`;
    xml += `<changefreq>${entry.changeFrequency}</changefreq>`;
    xml += `<priority>${entry.priority}</priority>`;
    xml += '</url>';
  }

  xml += '</urlset>';
  return xml;
}