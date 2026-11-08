/* Public configuration only: NEVER add a service-role key here. */
'use strict';
window.SEIYUN_CONFIG = Object.freeze({
 url:'https://tfknuqbaahesuqugfaib.supabase.co',
 publishableKey:'sb_publishable_PrtADc45VADOpGq9tGskZQ_UomVME_s',
 bucket:'menu-products',refreshMs:30000,
 confirmationRedirectUrl:'https://cafe-menu-generator.raj-techai2026.workers.dev/'
});
window.seiyunCloud=(()=>{
 if(!window.supabase?.createClient)return null;
 const config=window.SEIYUN_CONFIG;
 const client=window.supabase.createClient(config.url,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 const fail=r=>{if(r.error)throw Error(r.error.message||'Cloud request failed');};
 let user=null;
 async function getUser(){const {data,error}=await client.auth.getUser();if(error&&error.message!=='Auth session missing!')return null;user=data?.user||null;return user}
 async function requireUser(){return user||await getUser()||(()=>{throw Error('Please sign in first')})()}
 return {
  client,get ownerId(){return user?.id||null},
  getUser,
  async signIn(email,password){const r=await client.auth.signInWithPassword({email,password});fail(r);user=r.data.user;return user},
  async signUp(email,password){const r=await client.auth.signUp({email,password,options:{emailRedirectTo:config.confirmationRedirectUrl}});fail(r);user=r.data?.session?.user||null;return {needsConfirmation:!r.data?.session}},
  async signOut(){const r=await client.auth.signOut();fail(r);user=null},
  async getDraft(){const u=await requireUser();const r=await client.from('studio_private').select('draft').eq('owner_id',u.id).maybeSingle();fail(r);return r.data?.draft||null},
  async saveDraft(draft){const u=await requireUser();const r=await client.from('studio_private').upsert({owner_id:u.id,draft,updated_at:new Date().toISOString()},{onConflict:'owner_id'});fail(r)},
  async getPublished(ownerId){if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/.test(String(ownerId||'')))return null;const r=await client.from('studio_live').select('published,revision,published_at').eq('owner_id',ownerId).maybeSingle();fail(r);return r.data?.published||null},
  async publish(){await requireUser();const r=await client.rpc('publish_studio');fail(r);return r.data},
  async rollback(revision){await requireUser();const r=await client.rpc('rollback_studio',{target_revision:revision});fail(r);return r.data},
  async getHistory(){const u=await requireUser();const r=await client.from('studio_history').select('published').eq('owner_id',u.id).order('revision',{ascending:false}).limit(8);fail(r);return(r.data||[]).map(x=>x.published).reverse()},
  async upload(file){
   const u=await requireUser();
   if(!file||!['image/png','image/jpeg','image/webp','image/avif'].includes(file.type))throw Error('Use a PNG, JPG, WebP or AVIF image.');
   if(file.size>6291456)throw Error('Photo exceeds 6 MB. Choose a smaller image.');
   const ext=({'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/avif':'avif'})[file.type];
   const path=`${u.id}/${crypto.randomUUID()}.${ext}`;
   const r=await client.storage.from(config.bucket).upload(path,file,{upsert:false,contentType:file.type,cacheControl:'86400'});fail(r);
   return client.storage.from(config.bucket).getPublicUrl(path).data.publicUrl;
  }
 }
})();
