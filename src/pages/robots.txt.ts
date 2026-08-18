export const prerender = true;
export async function GET() { return new Response(`User-agent: *\nAllow: /\nSitemap: https://spatifex.com/sitemap.xml\n`, {headers: {'Content-Type':'text/plain'}}); }
