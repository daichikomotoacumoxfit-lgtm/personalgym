import { test, expect } from '@playwright/test';
const booking='https://komotodaichi.stores.jp/reserve/honten-go0hwc';
test('desktop: complete copy, all CTAs, prices, FAQ events and loaded images', async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('h1')).toContainText('好きなことを楽しめる身体へ。');
 await expect(page.locator('main section')).toHaveCount(12);
 await expect(page.getByText('REAL STORIES',{exact:true})).toHaveCount(0);
 for(const link of await page.locator('a[data-booking]:not([data-location="consultation"])').all()) {await expect(link).toHaveAttribute('href',booking);await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel','noopener noreferrer');}
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
