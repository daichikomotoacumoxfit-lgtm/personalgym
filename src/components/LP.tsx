import { concernImages, lifestyleImage } from '@/content/section-images';
import { customerReviews } from '@/content/customer-reviews';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Plus, Activity, ScanLine, UserRound, MapPin } from 'lucide-react';
import { SiInstagram, SiLine, SiThreads } from 'react-icons/si';
import type { SiteData, Section, CMSImage, Plan, SiteSettings } from '@/types/cms';
import { Header, StickyCTA, Analytics } from './Interactions';
const number = (n:number)=>n.toLocaleString('ja-JP');
function Eyebrow({children}:{children:React.ReactNode}) {return <p className="eyebrow">{children}</p>;}
function Heading({s,number:idx}:{s:Section;number?:string}) {return <div className="section-heading"><Eyebrow>{idx&&<span className="section-index">{idx} / </span>}{s.eyebrow}</Eyebrow><h2>{s.title}</h2>{s.body&&<p className="body-copy">{s.body}</p>}</div>;}
function CTA({data,location,light=false,small=false}:{data:SiteData;location:string;light?:boolean;small?:boolean}) {const trial=data.plans.find(p=>p.category==='trial');return <a className={`cta ${light?'cta-light':''} ${small?'cta-small':''}`} href={data.settings.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking data-location={location}><span>{trial?`初回${trial.duration}分体験を予約する`:'体験予約'}</span><ArrowUpRight size={20}/></a>;}
function Photo({image,className='',priority=false,crop,sizes}:{image?:CMSImage;className?:string;priority?:boolean;crop?:number;sizes?:string}) { if(!image)return null; const isRealPhoto=image.url.startsWith('/images/profile/'); return <div className={`photo ${className} ${crop!==undefined?'crop-photo':''} ${isRealPhoto?'real-photo':''}`}><Image src={image.url} alt={image.alt||'サービスと暮らしのイメージ写真'} fill sizes={sizes??(priority?'(max-width: 700px) 100vw, 80vw':'(max-width: 700px) 100vw, 50vw')} priority={priority} className={crop!==undefined?`quadrant quadrant-${crop}`:undefined}/></div>; }
function Price({plan,large=false}:{plan:Plan;large?:boolean}) {return <div className={`price ${large?'price-large':''}`}><span className="price-yen">¥</span><strong>{number(plan.price)}</strong><span className="tax">{plan.price===0?'（無料）':'（税込）'}</span></div>;}
function SocialIcon({service}:{service:'line'|'instagram'|'threads'}) {const Icon=service==='line'?SiLine:service==='instagram'?SiInstagram:SiThreads;return <Icon aria-hidden="true"/>}
function SocialLinks({settings}:{settings:SiteSettings}) {const links:[string,string|undefined,'line'|'instagram'|'threads'][]=[['公式LINE',settings.lineUrl,'line'],['Instagram',settings.instagramUrl,'instagram'],['Threads',settings.threadsUrl,'threads']];const visible=links.filter((entry):entry is [string,string,'line'|'instagram'|'threads']=>Boolean(entry[1]));if(!visible.length)return null;return <nav className="profile-socials" aria-label="河本大地のSNS"><Eyebrow>FOLLOW / CONTACT</Eyebrow><div>{visible.map(([label,url,service])=><a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label}を開く（新しいタブ）`}><span className="social-icon"><SocialIcon service={service}/></span><span className="social-label">{label}</span><ArrowUpRight className="social-arrow" size={16}/></a>)}</div></nav>;}
function ConsultationLink({plan,bookingUrl,location,showPrice=false}:{plan:Plan;bookingUrl:string;location:string;showPrice?:boolean}) {
 return <a className="consultation" href={plan.bookingUrl||bookingUrl} target="_blank" rel="noopener noreferrer" data-booking data-location={location}>
  <span>まずは無料WEBカウンセリングで相談する{showPrice&&<small>{plan.duration}分 / {plan.price===0?'無料':`¥${number(plan.price)}（税込）`}</small>}</span>
  <ArrowUpRight size={17}/>
 </a>;
}
function TrialOffer({data,plan,consult}:{data:SiteData;plan?:Plan;consult?:Plan}) {
 const {trialOffer:s,trialFlow}=data.lp;
 const steps=s.items.length?s.items:trialFlow.visible?trialFlow.items:[];
 return <section className="trial section" id="trial">
  <div className="trial-intro">
   <Heading s={s} number="07"/>
   {steps.length>0&&<ol className="trial-steps">{steps.map((item,i)=><li key={i}>
    <span aria-hidden="true">{String(i+1).padStart(2,'0')}</span>
    <div>{item.title}{item.text&&<p>{item.text}</p>}</div>
   </li>)}</ol>}
  </div>
  <div className="trial-card">
   <div className="trial-card-top"><span>FIRST SESSION</span><ArrowUpRight size={25}/></div>
   {plan?<><p className="plan-name">{plan.name}</p><div className="duration"><strong>{plan.duration}</strong><span>MINUTES / 初回体験</span></div>
    <div className="trial-price"><Price plan={plan} large/>{plan.regularPrice!==undefined&&<p className="regular-price">通常 <s>¥{number(plan.regularPrice)}</s>（税込）</p>}</div>
   </>:<p>料金・メニューは予約ページでご確認ください。</p>}
   {s.cta&&<CTA data={data} location="trial"/>}
   {s.closing&&<p className="trial-note">{s.closing}</p>}
   {consult&&<ConsultationLink plan={consult} bookingUrl={data.settings.bookingUrl} location="consultation" showPrice/>}
  </div>
 </section>;
}
function Footer({settings}:{settings:SiteSettings}) {return <footer className="footer"><div className="footer-top"><div><a className="footer-name" href="#main">{settings.storeName||settings.trainerName}</a><p>{settings.concept}</p></div><div><Eyebrow>BODY CARE & PERSONAL TRAINING</Eyebrow><p className="pre-line">{settings.areas}</p>{settings.hours&&<p>営業時間：{settings.hours}</p>}{settings.closedDays&&<p>定休日：{settings.closedDays}</p>}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {settings.storeName||settings.trainerName}</span><div>{settings.instagramUrl&&<a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}{settings.threadsUrl&&<a href={settings.threadsUrl} target="_blank" rel="noopener noreferrer">Threads ↗</a>}{settings.lineUrl&&<a href={settings.lineUrl} target="_blank" rel="noopener noreferrer">LINE ↗</a>}{settings.privacyPolicy&&<Link href="/privacy">プライバシーポリシー</Link>}{settings.legalUrl&&<a href={settings.legalUrl} target="_blank" rel="noopener noreferrer">法定表記 ↗</a>}<a href="#main">BACK TO TOP ↑</a></div></div></footer>;}
export function LandingPage({data}:{data:SiteData}) {
 const {lp,settings,plans,faqs,testimonials}=data;
 const trial=plans.find(p=>p.category==='trial');
 const consult=plans.find(p=>p.category==='consultation');
 const showTrialInPricing=Boolean(trial)&&!lp.trialOffer.visible;
 const trialDetails=lp.trialOffer.visible?'#trial':lp.pricing.visible?'#price':undefined;
 const showService=lp.integratedApproach.visible||lp.services.visible;
 const showTrainerProfile=lp.trainerProfile.visible&&Boolean(settings.trainerName);
 const conceptPhoto=lp.desiredFuture.image??lp.desiredFuture.items.find(item=>item.image)?.image;
 const qualifications=settings.qualifications.split('\n').filter(Boolean);
 const visible=[lp.hero.visible||lp.desiredFuture.visible?'concept':'',showService?'service':'',lp.benefits.visible?'features':'',lp.pricing.visible?'price':'',lp.accessAndFAQ.visible?'access':'',lp.accessAndFAQ.visible&&faqs.length?'faq':''];
 return <><Analytics/><Header settings={settings} visible={visible}/><main id="main">
 {lp.hero.visible&&<section className="hero" id="concept">
  <div className="hero-topline"><span>CARE FOR YOUR BODY. LIVE YOUR LIFE.</span><span>TOKYO / ONE-ON-ONE SESSION</span></div>
  <Photo image={lp.hero.image} className="hero-photo" priority/>
  <div className="hero-display" aria-hidden="true"><span>YOUR</span><span>LIFE<span className="period">.</span></span></div>
  <div className="hero-side-label" aria-hidden="true">YOUR BODY.<br/>YOUR TIME.<br/>YOUR LIFE.</div>
  <div className="hero-copy">
   <Eyebrow>{lp.hero.eyebrow}</Eyebrow>
   <h1>{lp.hero.title}</h1>
   <p>{lp.hero.body}</p>
   <div className="hero-actions">
    {lp.hero.cta&&<CTA data={data} location="hero"/>}
    {trialDetails&&<a className="text-link" href={trialDetails}>体験内容を見る <ArrowRight size={16}/></a>}
   </div>
   {((lp.hero.cta&&trial)||lp.hero.closing)&&<p className="hero-note">
    {lp.hero.cta&&trial&&<span>初回{trial.duration}分 ¥{number(trial.price)}（税込）</span>}
    {lp.hero.closing&&<span>{lp.hero.closing}</span>}
   </p>}
  </div>
  <div className="hero-bottom"><span>整体 × パーソナルトレーニング</span><a href={trialDetails||'#main'}>SCROLL TO EXPLORE <span>↓</span></a></div>
 </section>}
 {lp.hero.visible&&lp.hero.items.length>0&&<div className="feature-strip">{lp.hero.items.map((item,i)=>{const Icon=[Activity,ScanLine,UserRound][i%3];return <div key={i}><Icon size={26} strokeWidth={1.2}/><span><small>0{i+1}</small>{item.title}</span></div>;})}</div>}
 {lp.painPoints.visible&&<section className="pain dark-section section">
  <div><Heading s={lp.painPoints} number="01"/></div>
  <div className="pain-content">
   <ul>{lp.painPoints.items.map((item,i)=><li key={i}>
    <span className="list-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>
    <Photo image={item.image??concernImages[item.title]} className="pain-photo" sizes="(max-width: 760px) 105px, 152px"/>
    <div><h3>{item.title}</h3>{item.text&&<p className="body-copy">{item.text}</p>}</div>
   </li>)}</ul>
   {lp.painPoints.closing&&<p className="body-copy pain-closing">{lp.painPoints.closing}</p>}
  </div>
 </section>}
 {lp.desiredFuture.visible&&<section className="concept-section section" id={lp.hero.visible?undefined:"concept"}>
  <Heading s={lp.desiredFuture} number="02"/>
  <Photo image={!conceptPhoto||conceptPhoto.url==='/images/lifestyle.png'?lifestyleImage:conceptPhoto} className="concept-photo"/>
  {lp.desiredFuture.closing&&<p className="body-copy">{lp.desiredFuture.closing}</p>}
  {lp.desiredFuture.cta&&<CTA data={data} location="future"/>}
 </section>}
 {showService&&<section className="approach section" id="service">
  {lp.integratedApproach.visible&&<div id="approach">
   <Heading s={lp.integratedApproach} number="03"/>
   {lp.integratedApproach.items.slice(0,2).some(item=>item.image)&&<div className="approach-visuals">
    {lp.integratedApproach.items.slice(0,2).map((item,i)=>item.image&&<div key={i}>
     <Photo image={item.image} crop={item.image.url==='/images/services.png'?i:undefined}/>
     <span className="approach-caption"><span>{i===0?'CARE / 整体':'TRAINING / 運動'}</span><Plus size={20}/></span>
    </div>)}
   </div>}
   <ol className="approach-details">{lp.integratedApproach.items.map((item,i)=><li key={i}>
    <Eyebrow>{String(i+1).padStart(2,'0')}</Eyebrow><h3>{item.title}</h3><p className="body-copy">{item.text}</p>
   </li>)}</ol>
   {lp.integratedApproach.closing&&<p className="body-copy approach-example">{lp.integratedApproach.closing}</p>}
   {lp.integratedApproach.cta&&<CTA data={data} location="approach"/>}
  </div>}
  {lp.services.visible&&<div className="service-summary">
   {lp.integratedApproach.visible?<h3>{lp.services.title}</h3>:<Heading s={lp.services} number="03"/>}
   {lp.services.items.length>0&&<ul>{lp.services.items.map((item,i)=><li key={i}>{item.title}</li>)}</ul>}
   {lp.pricing.visible&&<a className="text-link" href="#price">料金を見る <ArrowUpRight size={17}/></a>}
  </div>}
 </section>}
 <section className="stories section customer-reviews" aria-labelledby="customer-reviews-title">
  <h2 id="customer-reviews-title">お客様の声</h2>
  <div className="story-grid">{customerReviews.map(review=><article key={review.title}>
   <h3>{review.title}</h3>
   <blockquote>「{review.quote}」</blockquote>
  </article>)}</div>
  <p className="fine-print">お客様ご本人の感想です。感じ方には個人差があります。</p>
 </section>
 {lp.testimonials.visible&&testimonials.length>0&&<section className="stories section"><Heading s={lp.testimonials}/><div className="story-grid">{testimonials.map(t=><article key={t.id}><Photo image={t.image}/><blockquote>{t.comment}</blockquote><p>{[t.age,t.occupation,t.period].filter(Boolean).join(' / ')}</p></article>)}</div><p className="fine-print">個人の感想であり、効果を保証するものではありません。</p></section>}
 {lp.benefits.visible&&<section className="benefits section" id="features">
  <Heading s={lp.benefits} number="04"/>
  {lp.benefits.items.length>0&&<ul className="reasons-list">{lp.benefits.items.map((item,i)=><li key={i}>
   <h3>{item.title}</h3>{item.text&&<p className="body-copy">{item.text}</p>}
  </li>)}</ul>}
  {showTrainerProfile&&<a className="text-link" href="#trainer">担当者について詳しく見る <ArrowRight size={16}/></a>}
  {lp.benefits.cta&&<CTA data={data} location="benefits"/>}
 </section>}
 {showTrainerProfile&&<section className="trainer section" id="trainer"><div className={`trainer-visual ${settings.trainerPhoto?'':'trainer-typography'}`}>{settings.trainerPhoto?<Photo image={settings.trainerPhoto}/>:<><Eyebrow>BEYOND THE DESK.</Eyebrow><span>MOVE<br/>TOWARD<br/>YOUR<br/>LIFE.</span><p>CARE & TRAINING<br/>FOR YOUR LIFE</p></>}</div><div className="trainer-copy"><Heading s={lp.trainerProfile} number="05"/><h3 className="trainer-name">{settings.trainerName}</h3><ul className="qualifications">{qualifications.map(q=><li key={q}>{q}</li>)}</ul><p className="body-copy">{settings.career}</p><p className="body-copy">{settings.biography}</p><SocialLinks settings={settings}/></div></section>}
 {lp.pricing.visible&&<section className="pricing section" id="price"><Heading s={lp.pricing} number="06"/><div className={showTrialInPricing?"pricing-layout":"pricing-layout pricing-layout-single"}>{showTrialInPricing&&trial&&<div className="pricing-trial"><Eyebrow>FIRST SESSION / 初回限定</Eyebrow><h3>{trial.name}</h3><span className="plan-duration">{trial.duration} MINUTES</span><Price plan={trial} large/>{trial.regularPrice!==undefined&&<p className="regular-price">通常 <s>¥{number(trial.regularPrice)}</s>（税込）</p>}{trial.description&&<p>{trial.description}</p>}{lp.pricing.cta&&<CTA data={data} location="pricing"/>}</div>}<div className="plan-list">{(['regular','ticket','consultation'] as const).map(category=>{const list=plans.filter(p=>p.category===category);return list.length>0&&<div className="plan-group" key={category}><Eyebrow>{({regular:'REGULAR / 通常メニュー',ticket:'TICKETS / 回数券',consultation:'CONSULTATION / 無料相談'})[category]}</Eyebrow>{list.map(plan=><article key={plan.id}><div><h3>{plan.name}</h3><p>{plan.duration}分{plan.sessions?` × ${plan.sessions}回`:''}{plan.sessions?` / 1回あたり${number(plan.price/plan.sessions)}円`:''}</p>{plan.description&&<p>{plan.description}</p>}</div><Price plan={plan}/></article>)}</div>;})}{plans.length===0&&<p>料金・メニューは予約ページでご確認ください。</p>}{lp.trialOffer.visible&&lp.pricing.cta&&(lp.trialOffer.cta?<a className="text-link pricing-trial-link" href="#trial">初回体験の料金・内容を見る <ArrowRight size={16}/></a>:<CTA data={data} location="pricing"/>)}</div></div><p className="pricing-note">{lp.pricing.closing}</p></section>}
 {lp.trialOffer.visible&&<TrialOffer data={data} plan={trial} consult={consult}/>}
 {lp.trialFlow.visible&&!lp.trialOffer.visible&&<section className="flow section"><Heading s={lp.trialFlow} number="07"/><ol>{lp.trialFlow.items.map((item,i)=><li key={i}><div className="flow-index">0{i+1}<ArrowRight size={20}/></div><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol></section>}

 {lp.accessAndFAQ.visible&&<section className="access section" id="access"><Heading s={lp.accessAndFAQ} number="08"/><div className="access-layout"><div className="access-info"><Eyebrow>LOCATION</Eyebrow><MapPin size={28} strokeWidth={1.3}/><h3>{settings.serviceLocation}</h3><ul>{settings.areas.split('\n').filter(Boolean).map(a=><li key={a}>{a}<ArrowUpRight size={14}/></li>)}</ul><p className="body-copy">{settings.bookingGuidance}</p>{settings.address&&<p>住所：{settings.address}</p>}{settings.nearestStation&&<p>{settings.nearestStation}{settings.walkingMinutes?` 徒歩${settings.walkingMinutes}分`:''}</p>}{settings.hours&&<p>営業時間：{settings.hours}</p>}{settings.phone&&<p>電話：{settings.phone}</p>}<p className="belongings">持ち物：{settings.belongings}</p></div></div></section>}
 {lp.accessAndFAQ.visible&&faqs.length>0&&<section className="faq section" id="faq"><Eyebrow>FREQUENTLY ASKED QUESTIONS</Eyebrow><h2>初めての方へ。</h2>{faqs.map((faq,i)=><details key={faq.id} data-faq={faq.question}><summary><span className="faq-q">Q{String(i+1).padStart(2,'0')}</span><span>{faq.question}</span><Plus size={18}/></summary><p>{faq.answer}</p></details>)}</section>}
 {lp.finalCTA.visible&&<section className="final dark-section"><div className="final-top"><span>LET’S START WITH YOUR FIRST SESSION.</span><ArrowUpRight size={38} strokeWidth={1}/></div><p className="final-display" aria-hidden="true">{lp.finalCTA.eyebrow}</p><div className="final-content"><div><h2>{lp.finalCTA.title}</h2><p className="body-copy">{lp.finalCTA.body}</p></div><div>{lp.finalCTA.cta&&<CTA data={data} location="final" light/>}{trial&&<p className="final-price">{trial.duration}分 / ¥{number(trial.price)}（税込）</p>}{lp.finalCTA.cta&&consult&&<ConsultationLink plan={consult} bookingUrl={settings.bookingUrl} location="consultation-final"/>}</div></div></section>}
 </main><Footer settings={settings}/><StickyCTA url={settings.bookingUrl} trial={trial}/></>;
}
