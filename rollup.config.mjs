import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import glob from 'fast-glob';
import commonjs from '@rollup/plugin-commonjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default [
  {
    input: Object.fromEntries(
      glob.sync('src/**/*.ts')
      .filter(
        file => ['.d.ts', '__fixtures__'].every((toIgnore) => !file.includes(toIgnore))
      ).map(file => [
        // This remove `src/` as well as the file extension from each
        // file, so e.g. src/nested/foo.js becomes nested/foo
        path.relative(
          'src',
          file.slice(0, file.length - path.extname(file).length)
        ),
        // This expands the relative paths to absolute paths, so e.g.
        // src/nested/foo becomes /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url))
      ])
    ),
    output: {
      dir: './dist',
      format: 'cjs',
      exports: 'auto',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [
      commonjs(),
      typescript({
        tsconfig: './tsconfig.rollup.json',
      }),
      terser()
    ],
  },
];
