'use client';
import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import type { Plan, SiteSettings } from '@/types/cms';
export const navItems = [['CONCEPT','concept'],['SERVICE','service'],['FEATURES','features'],['PRICE','price'],['ACCESS','access']] as const;
type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };
function track(event:string,params:Record<string,unknown>={}) { const w=window as DataLayerWindow; (w.dataLayer ||= []).push({event,...params}); }
export function Analytics() {
  useEffect(()=> {
    track('page_view',{page_path:window.location.pathname});
    function click(event:MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-booking]') : null;
      if (target) { const params={cta_location:target.dataset.location,link_url:target.href}; track('cta_click',params); track('booking_link_click',params); }
    }
    function toggle(event:Event) { const target=event.target; if (target instanceof HTMLDetailsElement && target.open && target.dataset.faq) track('faq_open',{question:target.dataset.faq}); }
    document.addEventListener('click',click); document.addEventListener('toggle',toggle,true);
    return ()=>{document.removeEventListener('click',click);document.removeEventListener('toggle',toggle,true);};
  },[]);
  return null;
}
export function Header({settings,visible}:{settings:SiteSettings;visible:string[]}) {
  const [open,setOpen]=useState(false);
  useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[]);
  return <header className="site-header"><a href="#main" className="skip-link">本文へスキップ</a><div className="header-inner">
    <nav aria-label="メインメニュー" className="desktop-nav">{navItems.filter(([,id])=>visible.includes(id)).map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</nav>
    <button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?'メニューを閉じる':'メニューを開く'} aria-expanded={open} aria-controls="mobile-nav">{open?<X size={23}/>:<Menu size={23}/>}</button>
    <a className="wordmark" href="#main" aria-label="ページの先頭へ"><span>{settings.storeName || settings.trainerName || '整体 × パーソナル'}</span><small>BODY CARE & PERSONAL TRAINING</small></a>
    <a className="header-booking" href={settings.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking data-location="header">体験予約 <ArrowUpRight size={17}/></a>
  </div><nav id="mobile-nav" className={`mobile-nav ${open?'is-open':''}`} aria-label="モバイルメニュー" inert={!open}>{navItems.filter(([,id])=>visible.includes(id)).map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}<ArrowUpRight size={19}/></a>)}</nav></header>;
}
export function StickyCTA({url,trial}:{url:string;trial?:Plan}) { return <div className="sticky-cta"><a href={url} target="_blank" rel="noopener noreferrer" data-booking data-location="mobile-fixed"><span>{trial?`初回${trial.duration}分体験を予約する`:'体験予約'}<small>STORES 予約ページへ</small></span><ArrowUpRight size={23}/></a></div>; }
