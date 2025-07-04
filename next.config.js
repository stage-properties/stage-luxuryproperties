const { fetchAPI } = require('./src/app/[locale]/_utils/fetch');
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      { hostname: "staging.stageproperties.com" },
      { hostname: "stageproperties.com" },
      { hostname: "d37zlj91i7b9eq.cloudfront.net" },
    ],
  },
  async redirects() {
    const strapiRedirects =  await fetchAPI('/redirects',"cache")

    const transformRedirects = (redirects) => {
      return redirects.map(redirect => ({
        source: encodeURI(redirect.from),
        destination: encodeURI(redirect.to),
        permanent: redirect.type === 'moved_permanently_301'
      }));
    };

    
    return [
      ...transformRedirects(strapiRedirects),
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });
    return config;
  },
};

module.exports = withNextIntl(nextConfig);