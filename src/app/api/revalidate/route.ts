import { timingSafeEqual } from 'node:crypto';
import { revalidateTag, revalidatePath } from 'next/cache';
import { CMS_TAG } from '@/lib/microcms';
export async function POST(request: Request) {
  const expected = process.env.MICROCMS_WEBHOOK_SECRET;
  const supplied = request.headers.get('x-webhook-secret') || '';
  if (!expected || supplied.length > 512 || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))) return Response.json({error:'Unauthorized'},{status:401});
  // All five APIs share a page. Invalidating all content also handles unpublish/delete.
  revalidateTag(CMS_TAG, {expire:0});
  revalidatePath('/', 'layout');
  return Response.json({revalidated:true});
}
