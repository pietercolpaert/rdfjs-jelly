import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';
import { dts } from 'rollup-plugin-dts';

const target = process.argv[2];
if (target !== 'node' && target !== 'browser') throw new Error('Usage: node scripts/build-types.mjs node|browser');
const root = new URL('../', import.meta.url);
const path = name => fileURLToPath(new URL(name, root));
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const dependencies = Object.keys(pkg.dependencies);

// tsup's declaration wrapper injects baseUrl even when tsconfig omits it.
// Use the plugin directly so declarations follow the project's module resolution.
const bundle = await rollup({
  input: path(target === 'node' ? 'src/index.ts' : 'src/browser.ts'),
  external: id => id.startsWith('node:') || dependencies.some(name => id === name || id.startsWith(`${name}/`)),
  plugins: [dts({ tsconfig: path('tsconfig.json'), compilerOptions: { declarationMap: false } })],
});
try {
  const files = target === 'node'
    ? ['dist/index.d.ts', 'dist/index.d.mts']
    : ['dist/browser-types/browser.d.mts'];
  for (const file of files) await bundle.write({ file: path(file), format: 'es' });
} finally {
  await bundle.close();
}
