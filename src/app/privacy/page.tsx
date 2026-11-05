import Link from 'next/link';
import { getSiteData } from '@/lib/data';
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
export const metadata={title:'プライバシーポリシー',robots:{index:false,follow:false}};
export default async function Privacy() {const data=await getSiteData();if(!data?.settings.privacyPolicy)notFound();return <main className="section legal-page"><Link href="/">← トップへ</Link><h1>プライバシーポリシー</h1><p className="body-copy">{data.settings.privacyPolicy}</p></main>;}
