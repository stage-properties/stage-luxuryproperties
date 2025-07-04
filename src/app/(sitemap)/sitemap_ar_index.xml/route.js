import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Combine static and dynamic sitemaps
        const sitemaps = [
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/pages_ar.xml`,
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/buy_ar.xml`,
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/rent_ar.xml`,
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/offplan_ar.xml`,
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/areas-and-communities_ar.xml`,
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/developers_ar.xml`,
            `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog_ar.xml`,
        ];

        const sitemapIndexXML = await buildSitemapIndex(sitemaps);

        return new NextResponse(sitemapIndexXML, {
        headers: {
            "Content-Type": "application/xml",
            "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
        },
        });
    } catch (error) {
        console.error('Error generating sitemap index:', error);
        return NextResponse.error();
    }
}

async function buildSitemapIndex(sitemaps) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    for (const sitemapURL of sitemaps) {
        xml += "<sitemap>";
        xml += `<loc>${sitemapURL}</loc>`;
        xml += "</sitemap>";
    }

    xml += "</sitemapindex>";
    return xml;
}