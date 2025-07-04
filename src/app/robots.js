const robots = () => {
    return {
        rules:[
            {
                
                userAgent:"*",
                allow:"/",
                disallow: ["/landing", "/?s="]
            }
        ],
        sitemap:`${process.env.NEXT_PUBLIC_WEBSITE_URL}/sitemap_index.xml`
    }
}

export default robots
