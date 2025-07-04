import { NextResponse } from 'next/server';
import { sitemapUrlGenerator, fetchAPI } from '@/app/[locale]/_utils/utils';


export async function GET() {
  try {
    const endPoint = 'slug/list';
    const response = await fetchAPI(endPoint, "noCache");

    let filteredData = response?.data || [];
    filteredData = filteredData.filter((entry) => entry.type === 'OFFPLAN');

    const entries = filteredData
      .map((entry) => {
        const urlPath = sitemapUrlGenerator(entry);
        if (!urlPath) return null; // Skip invalid entries

        return {
          url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/ar/${urlPath}`,
          lastModified: new Date(entry.updated_at).toISOString().slice(0, 10),
          changeFrequency: 'daily',
          priority: 0.8,
        };
      })
      .filter(Boolean); // Remove null entries

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