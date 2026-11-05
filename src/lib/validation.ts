import { sectionKeys, type SiteData, type LP, type Section, type Plan, type FAQ, type Testimonial, type SiteSettings } from '@/types/cms';
export function safeHttps(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  try { const u = new URL(value); if (u.protocol === 'https:' && !u.username && !u.password) return u.href; } catch {}
}
function record(v: unknown): v is Record<string, unknown> { return typeof v === 'object' && v !== null; }
const str = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
function image(v: unknown) {
  return record(v) && typeof v.url === 'string' && (v.url.startsWith('/images/') || safeHttps(v.url)?.startsWith('https://images.microcms-assets.io/')) && typeof v.width === 'number' && v.width > 0 && typeof v.height === 'number' && v.height > 0;
}
export function normalizeData(raw: { lp: unknown; settings: unknown; plans: unknown[]; faqs: unknown[]; testimonials: unknown[] }): SiteData {
  if (!record(raw.settings) || !safeHttps(raw.settings.bookingUrl)) throw new Error('site-settings.bookingUrl is required');
  const settings = { ...raw.settings } as SiteSettings;
  for (const key of ['concept','serviceLocation','areas','bookingGuidance','belongings','trainerName','qualifications','career','biography'] as const) if (!str(settings[key])) settings[key] = '';
  settings.bookingUrl = safeHttps(settings.bookingUrl)!;
  settings.lineUrl = safeHttps(settings.lineUrl); settings.instagramUrl = safeHttps(settings.instagramUrl); settings.legalUrl = safeHttps(settings.legalUrl);
  if (!image(settings.trainerPhoto)) delete settings.trainerPhoto;
  const lp = {} as LP;
  for (const key of sectionKeys) {
    const value = record(raw.lp) ? raw.lp[key] : undefined;
    if (!record(value) || value.visible !== true || !str(value.title)) { lp[key] = {visible:false,eyebrow:'',title:'',items:[]}; continue; }
    const section = { ...value, eyebrow: typeof value.eyebrow === 'string' ? value.eyebrow : '', body: typeof value.body === 'string' ? value.body : '', closing: typeof value.closing === 'string' ? value.closing : '', cta: value.cta === true } as Section;
    section.items = Array.isArray(value.items) ? value.items.filter(v => record(v) && str(v.title)).map(v => ({ title: v.title, text: typeof v.text === 'string' ? v.text : '', label: typeof v.label === 'string' ? v.label : '', ...(image(v.image) ? {image:v.image} : {}) })) : [];
    if (!image(section.image)) delete section.image;
    lp[key] = section;
  }
  const plans = raw.plans.filter((p): p is Plan => record(p) && p.published === true && str(p.id) && str(p.name) && typeof p.price === 'number' && Number.isFinite(p.price) && p.price >= 0 && typeof p.duration === 'number' && p.duration > 0).map(p => ({...p, category: (Array.isArray(p.category) ? p.category[0] : p.category) as Plan['category'], bookingUrl:safeHttps(p.bookingUrl), regularPrice: typeof p.regularPrice === 'number' && p.regularPrice > p.price ? p.regularPrice : undefined, sessions: typeof p.sessions === 'number' && p.sessions > 0 ? p.sessions : undefined })).filter(p => ['trial','regular','ticket','consultation'].includes(p.category)).sort((a,b)=>(a.order||0)-(b.order||0));
  const faqs = raw.faqs.filter((f): f is FAQ => record(f) && f.published === true && str(f.id) && str(f.question) && str(f.answer)).sort((a,b)=>(a.order||0)-(b.order||0));
  const testimonials = raw.testimonials.filter((t): t is Testimonial => record(t) && t.published === true && str(t.id) && str(t.comment)).map(t=>({...t,image:image(t.image)?t.image:undefined})).sort((a,b)=>(a.order||0)-(b.order||0));
  return {lp,settings,plans,faqs,testimonials,preview:false};
}
