export const title = 'これからの人生を楽しめる身体へ｜整体×パーソナルトレーニング';
export const description = '疲れやすさや姿勢・身体のラインの変化が気になる方へ。整体とパーソナルトレーニングで、今の身体と、これから楽しみたいことに合わせてサポートします。雪が谷大塚・中延・五反田周辺。';
export function siteUrl() { try { const u = new URL(process.env.NEXT_PUBLIC_SITE_URL || ''); return u.protocol === 'https:' ? u.origin : undefined; } catch { return; } }
