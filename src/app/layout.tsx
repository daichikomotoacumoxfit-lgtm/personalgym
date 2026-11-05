import type { Metadata } from 'next';
import { title, description, siteUrl } from '@/lib/seo';
import { isPreview } from '@/lib/data';
import '@fontsource-variable/noto-sans-jp';
import './globals.css';
const url = siteUrl();
export const metadata: Metadata = { title, description, ...(url ? {metadataBase:new URL(url),alternates:{canonical:url}} : {}), openGraph:{title,description,locale:'ja_JP',type:'website',...(url?{url,images:[{url:'/opengraph-image',width:1200,height:630}]}:{})},twitter:{card:'summary_large_image',title,description}, robots:isPreview() || !url?{index:false,follow:false}:{index:true,follow:true} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ja"><body>{children}</body></html>; }
