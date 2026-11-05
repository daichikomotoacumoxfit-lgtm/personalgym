import { mkdir, writeFile } from 'node:fs/promises';
import initial from '../src/content/initial.json';
// Offline helper only. Never creates APIs or writes to a live microCMS service.
const dir = '.cms-export';
await mkdir(dir, {recursive:true});
const images: {location:string;localPath:string;alt:string}[]=[];
function stripLocalImages(value: unknown, path=''): unknown {
 if(Array.isArray(value))return value.map((v,i)=>stripLocalImages(v,`${path}[${i}]`));
 if(value && typeof value==='object') {
  const object=value as Record<string,unknown>;
  if(typeof object.url==='string'&&object.url.startsWith('/images/')) {images.push({location:path,localPath:object.url,alt:typeof object.alt==='string'?object.alt:''});return undefined;}
  return Object.fromEntries(Object.entries(object).map(([k,v])=>[k,stripLocalImages(v,`${path}.${k}`)]).filter(([,v])=>v!==undefined));
 }
 return value;
}
for(const [endpoint,content] of Object.entries(initial)) {
 const target=endpoint==='settings'?'site-settings':endpoint;
 await writeFile(`${dir}/${target}.json`,JSON.stringify(stripLocalImages(content,target),null,2)+'\n');
}
await writeFile(`${dir}/images.json`,JSON.stringify(images,null,2)+'\n');
console.log('Exported copy-only content to .cms-export/. Create APIs manually using docs/cms-schema.md. Upload original photos separately. No remote changes made.');
