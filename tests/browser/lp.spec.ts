import { test, expect } from '@playwright/test';
const booking='https://komotodaichi.stores.jp/reserve/honten-go0hwc/2909115/book/course_type?courseCanonicalId=1199180';
test('desktop: complete copy, all CTAs, prices, FAQ events and loaded images', async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('h1')).toHaveText('これからの人生を、 もっと楽しめる身体へ。');
 await expect(page.locator('.hero-copy')).toContainText('姿勢や身体のラインの変化');
 await expect(page.locator('.hero-note')).toContainText('初回90分 ¥4,500（税込）');
 await expect(page.locator('.hero-note')).toContainText('体験後の入会義務なし');
 await expect(page.locator('main > section').nth(1)).toHaveClass(/\bpain\b/);
 await expect(page.locator('.pain-content h3')).toHaveText(['疲れ・身体の不調','姿勢・身体のライン','運動の続け方']);
 const trialDetails=page.getByRole('link',{name:'体験内容を見る'});
 await expect(trialDetails).toHaveAttribute('href','#trial');
 await trialDetails.click();
 await expect(page).toHaveURL(/#trial$/);
 const sections=await page.locator('main > section').evaluateAll(elements=>elements.map(element=>element.id||element.classList[0]));
 expect(sections).toEqual(['concept','pain','concept-section','service','features','trainer','price','trial','access','faq','final']);
 const service=page.locator('#service');
 await expect(service.getByRole('heading',{name:'今の身体を整え、これからの身体をつくる。'})).toBeVisible();
 await expect(service.locator('.approach-details h3')).toHaveText([
  '今の状態を確認する','必要なケアと運動を組み合わせる','日常でも続けられる方法を考える',
 ]);
 await expect(service.locator('.service-summary li')).toHaveCount(4);
 const reasons=page.locator('#service + #features');
 await expect(reasons.getByRole('heading',{name:'あなたの身体に、あなたに合った方法を。'})).toBeVisible();
 await expect(reasons.locator('.reasons-list li')).toHaveCount(3);
 await expect(page.locator('#trainer .trainer-visual img')).toHaveCount(1);
 for(const credential of ['鍼灸師','あん摩マッサージ指圧師','パーソナルトレーナー']){
  await expect(page.locator('#trainer .qualifications')).toContainText(credential);
 }
 const navigation=page.getByRole('navigation',{name:'メインメニュー'});
 await expect(navigation.getByRole('link',{name:'SERVICE'})).toHaveAttribute('href','#service');
 await expect(navigation.getByRole('link',{name:'FEATURES'})).toHaveAttribute('href','#features');
 await reasons.getByRole('link',{name:'担当者について詳しく見る'}).click();
 await expect(page).toHaveURL(/#trainer$/);
 await expect(page.locator('#trainer .trainer-name')).toHaveText('河本大地');
 await expect(page.getByText('REAL STORIES',{exact:true})).toHaveCount(0);
 const trial=page.locator('#trial');
 await expect(trial.locator('.trial-steps li > div')).toHaveText([
  /^カウンセリング/,/^姿勢・動きの確認/,/^整体と運動の体験/,/^今後のご提案/,
 ]);
 await expect(trial.locator('.trial-price')).toContainText('4,500');
 await expect(trial.locator('.trial-price')).toContainText('9,500');
 await expect(trial.locator('.trial-note')).toHaveText('体験後に入会する義務はありません。');
 await expect(page.locator('#price .pricing-trial')).toHaveCount(0);
 await expect(page.locator('#price .pricing-trial-link')).toHaveAttribute('href','#trial');
 await expect(page.locator('.flow')).toHaveCount(0);
 await expect(page.locator('.concept-section h2')).toHaveText('身体づくりは、人生を楽しむために。');
 await expect(page.locator('.concept-section img')).toHaveCount(1);
 await expect(page.locator('#faq details')).toHaveCount(6);
 for(const link of await page.locator('a[data-booking]:not(.consultation)').all()) {await expect(link).toHaveAttribute('href',booking);await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel','noopener noreferrer');}
 const consultationUrl='https://komotodaichi.stores.jp/reserve/honten-go0hwc/2909115/book/course_type?courseCanonicalId=951146';
 for(const container of [trial,page.locator('.final')]){
  await expect(container.getByRole('link',{name:'初回90分体験を予約する'})).toHaveAttribute('href',booking);
  const consultation=container.getByRole('link',{name:/まずは無料WEBカウンセリングで相談する/});
  await expect(consultation).toHaveAttribute('href',consultationUrl);
  await expect(consultation).toHaveAttribute('target','_blank');
  await expect(consultation).toHaveAttribute('rel','noopener noreferrer');
 }
 await expect(page.locator('.profile-socials a')).toHaveCount(3);
 await expect(page.locator('.profile-socials .social-icon svg')).toHaveCount(3);
 await expect(page.locator('#approach .photo.real-photo')).toHaveCount(2);
 await expect(page.locator('.profile-socials a').filter({hasText:'公式LINE'})).toHaveAttribute('href','https://lin.ee/np56EuG');
 await expect(page.locator('.profile-socials a').filter({hasText:'Instagram'})).toHaveAttribute('href','https://www.instagram.com/daichi.komoto.acumoxfit?vrfl=Z2MyaHp6YWl4d2Qy&utm_source=qr');
 await expect(page.locator('.profile-socials a').filter({hasText:'Threads'})).toHaveAttribute('href','https://www.threads.com/@daichi.komoto.acumoxfit?igshid=NTc4MTIwNjQ2YQ==');
 await expect(page.locator('#price')).toContainText('30,000');await expect(page.locator('#price')).toContainText('45,000');
 await page.locator('.faq summary').first().click();await expect(page.locator('.faq details').first()).toHaveAttribute('open','');
 await expect.poll(()=>page.evaluate(()=>((window as unknown as {dataLayer: {event:string}[]}).dataLayer||[]).some(e=>e.event==='faq_open'))).toBe(true);
 await page.locator('.header-booking').evaluate(el=>el.addEventListener('click',e=>e.preventDefault()));await page.locator('.header-booking').click();
 await expect.poll(()=>page.evaluate(()=>((window as unknown as {dataLayer: {event:string}[]}).dataLayer||[]).some(e=>e.event==='booking_link_click'))).toBe(true);
 for (const image of await page.locator('img').all()) { await image.scrollIntoViewIfNeeded(); await expect.poll(()=>image.evaluate(i=>(i as HTMLImageElement).naturalWidth)).toBeGreaterThan(0); }
 await page.evaluate(()=>document.fonts.ready); await page.evaluate(()=>window.scrollTo(0,0));
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).naturalWidth>0))).toBe(true);
 expect(errors).toEqual([]);
 await page.screenshot({path:'/tmp/lp-desktop.png',fullPage:true});
});
for(const width of [375,390,768,1024])test(`responsive ${width}: no overflow, fixed reservation access`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 if(width<761){
  const steps=await page.locator('.approach-details li').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().top));
  expect(steps[0]).toBeLessThan(steps[1]);
  expect(steps[1]).toBeLessThan(steps[2]);
  const photo=await page.locator('#trainer .trainer-visual').boundingBox();
  const heading=await page.locator('#trainer h2').boundingBox();
  expect(photo!.y+photo!.height).toBeLessThan(heading!.y);
  for(const selector of ['.hero h1','.hero-actions .cta']){
   const box=await page.locator(selector).boundingBox();
   expect(box).not.toBeNull();
   expect(box!.y).toBeGreaterThanOrEqual(75);
   expect(box!.y+box!.height).toBeLessThanOrEqual(844-64);
  }
 }
 if(width<761){await expect(page.locator('.sticky-cta')).toBeVisible();await page.locator('.menu-toggle').click();await expect(page.locator('#mobile-nav')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#mobile-nav')).toBeHidden();}
 await page.locator('footer').scrollIntoViewIfNeeded();
 const selector=width<761?'.sticky-cta':'.header-booking';
 const box=await page.locator(selector).boundingBox();expect(box).not.toBeNull();expect(box!.y).toBeGreaterThanOrEqual(0);expect(box!.y+box!.height).toBeLessThanOrEqual(845);
 if(width===390){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'/tmp/lp-mobile.png',fullPage:true});}
});
test('webhook denies missing or incorrect secrets',async({request})=>{
 expect((await request.post('/api/revalidate')).status()).toBe(401);
 expect((await request.post('/api/revalidate',{headers:{'x-webhook-secret':'incorrect'}})).status()).toBe(401);
});

test('preview metadata, image alternatives and internal destinations', async ({page,request})=>{
 await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('lang','ja');
 await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
 await expect(page).toHaveTitle('これからの人生を楽しめる身体へ｜整体×パーソナルトレーニング');
 const description=await page.locator('meta[name="description"]').getAttribute('content');
 expect(description).toContain('姿勢・身体のライン');
 await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content',description!);
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
 await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
 const headingLevels=await page.getByRole('heading').evaluateAll(headings=>headings.map(heading=>Number(heading.tagName.slice(1))));
 for(let i=1;i<headingLevels.length;i++) expect(headingLevels[i]).toBeLessThanOrEqual(headingLevels[i-1]+1);
 for(const img of await page.getByRole('main').locator('img').all()) await expect(img).toHaveAttribute('alt',/\S/);
 const missing=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(link=>link.getAttribute('href')!.slice(1)).filter(id=>!document.getElementById(id)));
 expect(missing).toEqual([]);
 const robots=await request.get('/robots.txt');
 expect(robots.ok()).toBe(true);
 expect(await robots.text()).toMatch(/^Disallow: \/$/m);
 const sitemap=await request.get('/sitemap.xml');
 expect(sitemap.ok()).toBe(true);
 expect(await sitemap.text()).not.toContain('<loc>');
 const ogImage=await request.get('/opengraph-image');
 expect(ogImage.ok()).toBe(true);
 expect(ogImage.headers()['content-type']).toMatch(/^image\//);
});

test('mobile keyboard navigation returns focus on menu dismissal and operates FAQ',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto('/');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('link',{name:'本文へスキップ'})).toBeFocused();
 await page.keyboard.press('Tab');
 const menu=page.getByRole('button',{name:'メニューを開く'});
 await expect(menu).toBeFocused();
 await page.keyboard.press('Enter');
 await page.keyboard.press('Tab');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('navigation',{name:'モバイルメニュー'}).getByRole('link',{name:'CONCEPT'})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(menu).toBeFocused();
 await expect(menu).toHaveAttribute('aria-expanded','false');
 const summary=page.locator('.faq summary').first();
 await summary.focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('.faq details').first()).toHaveAttribute('open','');
 await page.keyboard.press('Space');
 await expect(page.locator('.faq details').first()).not.toHaveAttribute('open','');
});
