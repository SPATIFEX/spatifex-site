import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else out.push(p)}return out}
const files=await walk(root);const html=files.filter(x=>x.endsWith('.html'));if(!html.length)throw new Error('no HTML output');
for(const file of html){const s=await readFile(file,'utf8');for(const token of ['<title>','name="description"','rel="canonical"','<main'])if(!s.includes(token))throw new Error(`${file}: missing ${token}`);for(const rx of [/<script\b/i,/<form\b/i,/<iframe\b/i,/mailto:/i,/<link[^>]+rel=["'](?:stylesheet|preconnect|prefetch|dns-prefetch)["'][^>]+https?:/i,/@import\s+url\(\s*["']?https?:/i,/<(?:img|source|video|audio)[^>]+(?:src|srcset)=["']https?:/i])if(rx.test(s))throw new Error(`${file}: forbidden stage-0/1 surface`);}
console.log(`SITE_STATIC_VERIFY: PASS (${html.length} HTML pages)`);
