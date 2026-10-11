import fs from 'node:fs';
import { transformSync } from 'esbuild';
const source = fs.readFileSync('src/data/mockData.ts', 'utf8');
const {code} = transformSync(source, {loader:'ts',format:'esm'});
const data = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
fs.writeFileSync('portal/demo_data.json', JSON.stringify(data,null,2));
