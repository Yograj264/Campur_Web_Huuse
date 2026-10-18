import fs from 'node:fs';
import path from 'node:path';
import { build, transformSync } from 'esbuild';

const mobile = process.argv.includes('--mobile');
const root = path.resolve(import.meta.dirname, '..');
process.chdir(root);
function walk(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => {
    const file=path.join(directory,entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const files=mobile ? ['mobile/App.jsx','mobile/index.js'] : [...walk('src'),'vite.config.js',...fs.readdirSync('scripts').filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)];
const sources=files.filter(f=>/\.(jsx?|mjs)$/.test(f));
for (const file of sources) transformSync(fs.readFileSync(file,'utf8'),{loader:file.endsWith('.jsx')?'jsx':'js',jsx:'automatic',sourcefile:file,logLevel:'error'});
if (!mobile) await build({entryPoints:['src/main.jsx'],bundle:true,write:false,outdir:'dist',jsx:'automatic',loader:{'.css':'empty'},logLevel:'error'});
console.log(`JavaScript checks passed (${sources.length} files${mobile ? '' : ' + application imports'}).`);
