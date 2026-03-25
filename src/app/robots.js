export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/packages", "/destinations", "/about", "/contact"],
        disallow: ["/dashboard/", "/admin/", "/moderator/", "/api/"],
      },
    ],
    sitemap: "https://mk-travel-agency.vercel.app/sitemap.xml",
    host:    "https://mk-travel-agency.vercel.app",
  };
}
