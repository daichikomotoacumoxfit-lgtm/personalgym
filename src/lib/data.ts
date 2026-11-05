import 'server-only';
import { previewData } from '@/content/fallback';
import { getCMSData } from './microcms';
import type { SiteData } from '@/types/cms';
export const isPreview = () => process.env.CONTENT_MODE === 'preview' || (process.env.NODE_ENV === 'development' && !process.env.MICROCMS_SERVICE_DOMAIN && !process.env.MICROCMS_API_KEY);
export async function getSiteData(): Promise<SiteData | null> {
  if (isPreview()) return previewData;
  try { const cached = await getCMSData(); if (Date.now() - cached.fetchedAt > 600_000) throw new Error("Content cache exceeded maximum age"); return cached.data; }
  catch { console.error('[content] microCMS data unavailable. Check endpoint schemas, credentials and network access.'); return null; }
}
