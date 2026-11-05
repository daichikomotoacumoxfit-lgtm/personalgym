export type CMSImage = { url: string; width: number; height: number; alt?: string };
export type ContentItem = { fieldId?: 'item'; title: string; text?: string; image?: CMSImage; label?: string };
export type Section = { fieldId?: 'section'; visible: boolean; eyebrow: string; title: string; body?: string; closing?: string; image?: CMSImage; items: ContentItem[]; cta?: boolean };
export const sectionKeys = ['hero','trialOffer','painPoints','desiredFuture','integratedApproach','benefits','testimonials','services','pricing','trialFlow','trainerProfile','accessAndFAQ','finalCTA'] as const;
export type SectionKey = typeof sectionKeys[number];
export type LP = Record<SectionKey, Section> & { id?: string };
export type SiteSettings = {
  storeName?: string; concept: string; bookingUrl: string; lineUrl?: string; instagramUrl?: string; threadsUrl?: string;
  address?: string; nearestStation?: string; walkingMinutes?: number; hours?: string; closedDays?: string; phone?: string;
  serviceLocation: string; areas: string; bookingGuidance: string; belongings: string;
  trainerName: string; trainerPhoto?: CMSImage; qualifications: string; career: string; biography: string;
  privacyPolicy?: string; legalUrl?: string;
};
export type Plan = { id: string; name: string; category: 'trial'|'regular'|'ticket'|'consultation'; price: number; regularPrice?: number; duration: number; sessions?: number; description?: string; order: number; published: boolean; bookingUrl?: string };
export type FAQ = { id: string; question: string; answer: string; order: number; published: boolean };
export type Testimonial = { id: string; age: string; occupation: string; period: string; comment: string; image?: CMSImage; order: number; published: boolean };
export type SiteData = { lp: LP; settings: SiteSettings; plans: Plan[]; faqs: FAQ[]; testimonials: Testimonial[]; preview: boolean };
