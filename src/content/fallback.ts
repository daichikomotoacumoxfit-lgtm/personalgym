import initial from './initial.json';
import type { SiteData } from '@/types/cms';
/** User-supplied initial copy. Explicit local preview only; never a production error fallback. */
export const previewData = { ...initial, preview: true } as SiteData;
