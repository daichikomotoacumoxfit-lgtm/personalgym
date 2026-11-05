import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
import { isPreview } from '@/lib/data';
export default function sitemap(): MetadataRoute.Sitemap { const url=siteUrl(); return url && !isPreview() ? [{url,changeFrequency:'weekly',priority:1}] : []; }
