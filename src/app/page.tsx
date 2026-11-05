import type { Metadata } from 'next';
import { LandingPage } from '@/components/LP';
import { getSiteData } from '@/lib/data';
import { siteUrl, title, description } from '@/lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata> { const data=await getSiteData(); return !data || data.preview || !siteUrl()?{robots:{index:false,follow:false}}:{}; }
export default async function Page() {
 const data=await getSiteData();
 if (!data) return <main className="unavailable"><p className="eyebrow">BODY CARE & PERSONAL TRAINING</p><h1>ただいま情報を確認しています。</h1><p>時間をおいて、もう一度アクセスしてください。</p></main>;
 const url=siteUrl();
 const structured = !data.preview && url ? {'@context':'https://schema.org','@type':'WebSite',url,name:data.settings.storeName||title,description,inLanguage:'ja'} : null;
 return <>{structured&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\\u003c')}}/>}<LandingPage data={data}/></>;
}
