import { test } from 'node:test';
import assert from 'node:assert/strict';
import initial from '../src/content/initial.json';
import { normalizeData, safeHttps } from '../src/lib/validation';
const fixture=()=>structuredClone(initial);
test('user-approved menu has six plans and a single consistent trial',()=>{
 const data=normalizeData(fixture());
 assert.equal(data.plans.length,6); assert.equal(data.testimonials.length,0);
 const trial=data.plans.find(p=>p.category==='trial')!;
 assert.deepEqual([trial.price,trial.regularPrice,trial.duration],[4500,9500,90]);
 assert.equal(data.settings.bookingUrl,'https://komotodaichi.stores.jp/reserve/honten-go0hwc/2909115/book/course_type?courseCanonicalId=1199180');
 assert.equal(data.plans.find(p=>p.category==='consultation')?.bookingUrl,'https://komotodaichi.stores.jp/reserve/honten-go0hwc/2909115/book/course_type?courseCanonicalId=951146');
});
test('CMS select arrays normalize; unpublished/deleted records disappear without fallback',()=>{
 const raw=fixture();const plans=raw.plans as unknown as Record<string,unknown>[];
 plans[0].category=['trial'];plans[1].published=false;
 const data=normalizeData(raw);assert.equal(data.plans.length,5);assert.equal(data.plans[0].category,'trial');
 raw.plans=[];raw.faqs=[];assert.equal(normalizeData(raw).plans.length,0);assert.equal(normalizeData(raw).faqs.length,0);
});
test('missing sections hide, incomplete optional content does not break the page',()=>{
 const raw=fixture() as unknown as Parameters<typeof normalizeData>[0];
 raw.lp={hero:{visible:true,title:'長い見出し'.repeat(100),eyebrow:'TOP',items:[{}, {title:'有効な項目'}]}};
 const data=normalizeData(raw);assert.equal(data.lp.hero.items.length,1);assert.equal(data.lp.pricing.visible,false);
});
test('unsafe reservation URLs fail closed; external links cannot execute scripts',()=>{
 for(const bad of ['javascript:alert(1)','http://example.com','https://user:pass@example.com','/reserve'])assert.equal(safeHttps(bad),undefined);
 const raw=fixture();raw.settings.bookingUrl='javascript:alert(1)';assert.throws(()=>normalizeData(raw));
});
test('malformed prices are not rendered and real published testimonials are supported',()=>{
 const raw=fixture();raw.plans[0].price=NaN;
 const data=normalizeData({...raw,testimonials:[{id:'real',published:true,comment:'利用者から提供された感想',order:1},{id:'hidden',published:false,comment:'非公開'}]});
 assert.equal(data.plans.some(p=>p.id==='trial'),false);assert.equal(data.testimonials.length,1);
});
