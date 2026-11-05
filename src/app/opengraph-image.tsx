import { ImageResponse } from 'next/og';
export const alt = 'AFTER WORK. YOUR LIFE. — BODY CARE & TRAINING';
export const size = {width:1200,height:630};
export const contentType = 'image/png';
export default function Image() { return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',background:'#f2f1ee',color:'#171717',padding:70,width:'100%',height:'100%',fontFamily:'sans-serif'}}><div style={{fontSize:20,letterSpacing:5}}>BODY CARE & PERSONAL TRAINING</div><div style={{display:'flex',flexDirection:'column',fontSize:118,fontWeight:900,letterSpacing:-8,lineHeight:0.98}}><div>AFTER WORK.</div><div>YOUR LIFE.</div></div><div style={{fontSize:20,letterSpacing:3}}>CARE FOR YOUR BODY. MAKE TIME FOR YOUR LIFE.</div></div>, size); }
