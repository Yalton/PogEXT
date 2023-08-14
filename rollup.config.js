import path from 'path';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension';
import { emptyDir } from 'rollup-plugin-empty-dir';
import zip from 'rollup-plugin-zip';
import replace from '@rollup/plugin-replace';
import html from 'rollup-plugin-html';


const isProduction = process.env.NODE_ENV === 'production';

const getConfig = (version) => ({
	input: `src/manifest.${version}.ts`,
	output: {
		dir: 'dist/' + version,
		format: 'esm',
		chunkFileNames: path.join('chunks', '[name]-[hash].js'),
	},
    plugins: [
        replace({
            'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
            preventAssignment: true,
        }),
        babel({
            exclude: 'node_modules/**',
            presets: ['@babel/preset-react'],
          }),
        // html({ include: '**/*.html' }), 
        // typescript({ outDir: 'dist' }), 
        chromeExtension(),
        simpleReloader(),
        resolve(),
        commonjs(),
        typescript(),
        css(),
        image(),
        emptyDir(),
        isProduction && terser(),
        isProduction && zip({ dir: 'releases/' + version }),
    ],
});

const configs = [getConfig('v3')]; // Adjust as needed for your manifest versions
if (isProduction) configs.push(getConfig('v2'));

export default configs;
