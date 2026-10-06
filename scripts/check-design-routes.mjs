// Run against the local preview or a deployed version: node scripts/check-design-routes.mjs URL
// Render every static page and every resource, including both languages. This checks shared
// chrome integration; visual acceptance still requires desktop and mobile browser inspection.
import { readdir, readFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://localhost:3000';
async function pages(dir = 'app') {
 const result = [];
 for (const entry of await readdir(dir, { withFileTypes: true })) {
  const path = `${dir}/${entry.name}`;
  if (entry.isDirectory() && entry.name !== 'api') result.push(...await pages(path));
  else if (entry.name === 'page.tsx' && !path.includes('[')) result.push(path.replace(/^app/, '').replace(/\/page.tsx$/, '') || '/');
 }
 return result;
}
const source = await readFile('app/data/resources.ts','utf8');
const routes = [...new Set([...await pages(), ...[...source.matchAll(/slug: "([^"]+)"/g)].flatMap(([,slug]) => [`/resources/${slug}`, `/en/resources/${slug}`]), '/design-check-missing-page'])];
const failed=[];let index=0;
async function worker(){while(index<routes.length){const route=routes[index++];try{const response=await fetch(new URL(route,base));const html=await response.text();const expected=route==='/design-check-missing-page'?404:200;if(response.status!==expected|| (html.match(/data-design-system="pioneer"/g)||[]).length!==1 || !html.includes('class="design-footer"') || html.includes('class="brand-mark"')) failed.push({route,status:response.status,reason:'Unexpected response or missing shared chrome'});}catch(error){failed.push({route,reason:error.message});}}}
await Promise.all(Array.from({length:4},worker));
console.log(JSON.stringify({base,checked:routes.length,failed},null,2));if(failed.length)process.exitCode=1;
