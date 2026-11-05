import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
import { isPreview } from '@/lib/data';
export default function robots(): MetadataRoute.Robots { const url=siteUrl(); return {rules:{userAgent:'*',...(url && !isPreview()?{allow:'/',disallow:'/api/'}:{disallow:'/'})},...(url&&!isPreview()?{sitemap:`${url}/sitemap.xml`}:{})}; }
