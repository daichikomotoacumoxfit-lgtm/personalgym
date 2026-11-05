export const title = 'デスクワーカーの肩こり・腰痛に｜整体×パーソナルトレーニング';
export const description = '仕事終わりに、好きなことを楽しめる身体へ。肩こり・腰痛に悩むデスクワーカーのための整体×パーソナルトレーニング。施術と運動を組み合わせ、あなたに合った身体づくりをサポートします。';
export function siteUrl() { try { const u = new URL(process.env.NEXT_PUBLIC_SITE_URL || ''); return u.protocol === 'https:' ? u.origin : undefined; } catch { return; } }
