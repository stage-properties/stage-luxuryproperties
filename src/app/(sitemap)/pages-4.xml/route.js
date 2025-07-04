import { NextResponse } from 'next/server';
import { fetchCommunities } from './service';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://stageproperties.com';

    const communities = await fetchCommunities();
    // Extract all community slugs
    const communitySlugs = communities.data.map(item => item.attributes.slug);

    let staticUrls = [
      `${baseUrl}/`,
      `${baseUrl}/offplan`,
      `${baseUrl}/our-team`,
      `${baseUrl}/contact-us`,
      `${baseUrl}/blogs`,
      `${baseUrl}/developers`,
      `${baseUrl}/mortgage-calculator`,
      `${baseUrl}/areas-and-communities`,
    ];

    // Define the property URLs where you want to append community slugs
    const propertyUrls = [
      `${baseUrl}/buy/residential/properties-for-sale`,
      `${baseUrl}/buy/residential/apartment-for-sale`,
      `${baseUrl}/buy/residential/duplex-for-sale`,
      `${baseUrl}/buy/residential/land-residential-for-sale`,
      `${baseUrl}/buy/residential/townhouse-for-sale`,
      `${baseUrl}/buy/residential/villa-for-sale`,
      `${baseUrl}/buy/residential/penthouse-for-sale`,
      `${baseUrl}/buy/residential/residential-full-floor-for-sale`,
      `${baseUrl}/buy/residential/residential-half-floor-for-sale`,

      `${baseUrl}/rent/residential/properties-for-rent`,
      `${baseUrl}/rent/residential/apartment-for-rent`,
      `${baseUrl}/rent/residential/duplex-for-rent`,
      `${baseUrl}/rent/residential/land-residential-for-rent`,
      `${baseUrl}/rent/residential/townhouse-for-rent`,
      `${baseUrl}/rent/residential/villa-for-rent`,
      `${baseUrl}/rent/residential/penthouse-for-rent`,
      `${baseUrl}/rent/residential/residential-full-floor-for-rent`,
      `${baseUrl}/rent/residential/residential-half-floor-for-rent`,

      `${baseUrl}/buy/commercial/properties-for-sale`,
      `${baseUrl}/buy/commercial/labour-camp-for-sale`,
      `${baseUrl}/buy/commercial/office-for-sale`,
      `${baseUrl}/buy/commercial/warehouse-for-sale`,
      `${baseUrl}/buy/commercial/retail-for-sale`,
      `${baseUrl}/buy/commercial/shop-for-sale`,
      `${baseUrl}/buy/commercial/commercial-full-floor-for-sale`,
      `${baseUrl}/buy/commercial/commercial-half-floor-for-sale`,

      `${baseUrl}/rent/commercial/properties-for-rent`,
      `${baseUrl}/rent/commercial/labour-camp-for-rent`,
      `${baseUrl}/rent/commercial/office-for-rent`,
      `${baseUrl}/rent/commercial/warehouse-for-rent`,
      `${baseUrl}/rent/commercial/retail-for-rent`,
      `${baseUrl}/rent/commercial/shop-for-rent`,
      `${baseUrl}/rent/commercial/commercial-full-floor-for-rent`,
      `${baseUrl}/rent/commercial/commercial-half-floor-for-rent`
    ];

    // Create dynamic URLs by appending each community slug to each property URL
    const dynamicUrls = propertyUrls.flatMap(url =>
      communitySlugs.map(slug => `${url}/in-${slug}`)
    );

    // Merge dynamic URLs into your staticUrls array
    staticUrls = [...staticUrls, ...propertyUrls, ...dynamicUrls];

    // Build sitemap entries as before
    const staticEntries = staticUrls.map((entry) => {
      const _changeFrequency = (entry) => {
        if (entry === `${baseUrl}/our-team`) {
          return 'monthly';
        } else if (entry === `${baseUrl}/contact-us`) {
          return 'yearly';
        } else if (entry === `${baseUrl}/mortgage-calculator`) {
          return 'never';
        } else return 'daily';
      };

      return {
        url: entry,
        lastModified: new Date().toISOString().slice(0, 10),
        changeFrequency: _changeFrequency(entry),
        priority: entry === `${baseUrl}/` ? 1.0 : 0.9,
      };
    });

    // Limit the number of entries to 1000
    const limitedEntries = staticEntries.slice(4000, 5000);

    const sitemapXml = buildSitemapXml(limitedEntries);

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