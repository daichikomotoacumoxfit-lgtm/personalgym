import 'server-only';
import { createClient } from 'microcms-js-sdk';
import { unstable_cache } from 'next/cache';
import { normalizeData } from './validation';
export const CMS_TAG = 'lp-content';
export function cmsConfigured() { return !!process.env.MICROCMS_SERVICE_DOMAIN && !!process.env.MICROCMS_API_KEY; }
export const getCMSData = unstable_cache(async () => {
  if (!cmsConfigured()) throw new Error('CMS is not configured');
  const client = createClient({ serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!, apiKey: process.env.MICROCMS_API_KEY! });
  const [lp,settings,plans,faqs,testimonials] = await Promise.all([
    client.getObject({endpoint:'lp',customRequestInit:{cache:'no-store'}}), client.getObject({endpoint:'site-settings',customRequestInit:{cache:'no-store'}}),
    client.getAllContents({endpoint:'plans',customRequestInit:{cache:'no-store'},queries:{filters:'published[equals]true',orders:'order'}}),
    client.getAllContents({endpoint:'faqs',customRequestInit:{cache:'no-store'},queries:{filters:'published[equals]true',orders:'order'}}),
    client.getAllContents({endpoint:'testimonials',customRequestInit:{cache:'no-store'},queries:{filters:'published[equals]true',orders:'order'}}),
  ]);
  return { data: normalizeData({lp,settings,plans,faqs,testimonials}), fetchedAt: Date.now() };
}, ['microcms-site-v1'], {revalidate:300,tags:[CMS_TAG]});
