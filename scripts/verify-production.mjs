import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';
const secret=randomBytes(32).toString('hex');
const env={...process.env,CONTENT_MODE:'cms',MICROCMS_SERVICE_DOMAIN:'',MICROCMS_API_KEY:'',MICROCMS_WEBHOOK_SECRET:secret};
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3001'],{env,stdio:'ignore'});
try {
 const base='http://127.0.0.1:3001';
 let ready=false;
 for(let i=0;i<60;i++){try{await fetch(base);ready=true;break;}catch{await new Promise(r=>setTimeout(r,200));}}
 assert(ready,'production server did not start');
 const html=await(await fetch(base)).text();
 assert(html.includes('ただいま情報を確認しています。'));
 assert(!html.includes('4,500'),'production must not silently render preview pricing');
 assert(html.includes('noindex'),'unavailable page must not be indexed');
 assert.equal((await fetch(`${base}/api/revalidate`,{method:'POST'})).status,401);
 const response=await fetch(`${base}/api/revalidate`,{method:'POST',headers:{'x-webhook-secret':secret}});
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{revalidated:true});
 console.log('PASS: production without CMS shows unavailable/noindex, has no preview prices, and authenticated webhook returns 200 (missing secret: 401). No real CMS connection was tested.');
}finally{server.kill('SIGTERM');}
