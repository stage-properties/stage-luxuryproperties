import { NextResponse } from 'next/server';
import { sitemapUrlGenerator, fetchAPI } from '@/app/[locale]/_utils/utils';

export async function GET() {
  try {
    const endPoint = 'slug/list';
    const response = await fetchAPI(endPoint, "noCache");

    let filteredData = response?.data || [];
    filteredData = filteredData.filter((entry) => entry.type === 'COMMUNITY');

    // List of URLs to skip (enter your full URLs here)
    const manualSkipUrls = [
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/ar/areas-and-communities/maritime-city`,
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/ar/areas-and-communities/jbr`,
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/ar/areas-and-communities/dubai-investment-park`
    ];

    // Use a Set to track and remove duplicate URLs
    const seenUrls = new Set();
    const entries = filteredData.reduce((acc, entry) => {
      const urlPath = sitemapUrlGenerator(entry);
      if (!urlPath) return acc; // Skip invalid entries

      const fullUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/ar/${urlPath}`;
      
      // Skip manually excluded URLs
      if (manualSkipUrls.includes(fullUrl)) return acc;
      
      // Skip duplicate URLs
      if (seenUrls.has(fullUrl)) return acc;
      seenUrls.add(fullUrl);

      acc.push({
        url: fullUrl,
        lastModified: new Date(entry.updated_at).toISOString().slice(0, 10),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
      return acc;
    }, []);

    const sitemapXml = buildSitemapXml(entries);

    return new NextResponse(sitemapXml, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(sitemapXml).toString(),
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