import jetpack from 'fs-jetpack';
import path from 'path';
import { config } from 'dotenv';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
import { swc } from 'rollup-plugin-swc3';
import jsonPlugin from '@rollup/plugin-json';
import { blueBright, greenBright, redBright } from 'colorette';
import builtinModules from 'builtin-modules';
import commonjsPlugin from '@rollup/plugin-commonjs';
import tsPaths from 'rollup-plugin-tsconfig-paths';
import typescriptPlugin from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { execSync } from 'child_process';

config({
	path: path.resolve('.env')
});

const buildOutput = 'dist';
const isProduction = process.env.PRODUCTION_MODE === 'true';
const useSWC = process.env.COMPILER_USE_SWC === 'true';
const sourcePath = path.resolve('src');
const pkgJson = jetpack.read('package.json', 'json');
const localInstalledPackages = [...Object.keys(pkgJson.dependencies)];

/**
 * Resolve given path by fs-jetpack
 */
function resolvePath(pathParts) {
	return jetpack.path(...pathParts);
}

/**
 * Generate success console message
 */
function successMessage(message, type = 'Success') {
	console.log(`[${greenBright(type)}] ${message}`);
}

/**
 * Generate error console message
 */
function errorMessage(message, type = 'Error') {
	console.log(`[${redBright(type)}] ${message}`);
}

/**
 * Copy given source to destination
 */
function copy(source, destination, options = { overwrite: true }) {
	return jetpack.copy(source, destination, options);
}

/**
 * CleanUp the build output
 */
function cleanUp() {
	if (!jetpack.exists(buildOutput)) {
		return;
	}

	const preserved = [
		'node_modules/**/*',
		'ragemp-server*',
		'.env',
		'BugTrap-x64.dll',
		'bin/**/*',
		'dotnet/**/*',
		'maps/**/*',
		'plugins/**/*',
		'client_packages/game_resources/dlcpacks/**/*',
		'pnpm-lock.yaml',
		'package-lock.json',
		'yarn.lock'
	];

	const removeablePaths = jetpack.find('dist', {
		matching: preserved.map((path) => `!${path}`),
		directories: false
	});

	removeablePaths.forEach((path) => {
		jetpack.remove(path);
		errorMessage(path, 'Removed');
	});
}

/**
 * Copy all static files they needed
 */
function copyFiles() {
	const prepareForCopy = [];

	prepareForCopy.push(
		{
			from: jetpack.path('package.json'),
			to: jetpack.path(buildOutput, 'package.json')
		},
		{
			from: jetpack.path('.env'),
			to: jetpack.path(buildOutput, '.env')
		},
		{
			from: jetpack.path('conf.json'),
			to: jetpack.path(buildOutput, 'conf.json')
		}
	);

	prepareForCopy.forEach((item) => {
		copy(item.from, item.to);
		successMessage(blueBright(`${item.from} -> ${item.to}`), 'Copied');
	});
}

cleanUp();
copyFiles();

/**
 * Custom plugin to build UI after server compilation
 */
function buildUIPlugin(isDevelopment) {
	return {
		name: 'build-ui',
		writeBundle() {
			try {
				successMessage('Building UI...', 'UI Build');
				const buildCommand = isDevelopment ? 'npm run build-fast' : 'npm run build';
				execSync(buildCommand, { 
					cwd: path.resolve('./ui'),
					stdio: 'inherit'
				});
				successMessage('UI build completed successfully', 'UI Build');
			} catch (error) {
				errorMessage(`UI build failed: ${error.message}`, 'UI Build');
				throw error;
			}
		}
	};
}

// Moves files from ui/dist to dist/client_packages/ui
function moveUIBuild() {
	const source = path.resolve('./ui/dist');
	const destination = path.resolve('./dist/client_packages/ui');

	jetpack.copy(source, destination, { overwrite: true });
	successMessage(`Moved UI build files from ${source} to ${destination}`, 'UI Build');
}

// use terser only if it is the typescript compiler in use
const terserMinify =
	isProduction && !useSWC
		? terser({
				keep_classnames: true,
				keep_fnames: true,
				output: {
					comments: false
				}
		  })
		: [];

const generateConfig = (options = {}) => {
	const { isServer } = options;

	const outputFile = isServer
		? resolvePath([buildOutput, 'packages', 'core', 'index.js'])
		: resolvePath([buildOutput, 'client_packages', 'index.js']);

	const serverPlugins = [];

	const isBuildUI = process.env.BUILD_UI === 'true';
	const plugins = [terserMinify];

	if (isBuildUI) {
		plugins.push(buildUIPlugin(!isProduction));
	}

	plugins.push(moveUIBuild());

	const external = [...builtinModules, ...localInstalledPackages];
	const tsConfigPath = resolvePath([sourcePath, isServer ? 'server' : 'client', 'tsconfig.json']);

	return {
		input: resolvePath([sourcePath, isServer ? 'server' : 'client', 'index.ts']),
		output: {
			file: outputFile,
			format: 'cjs'
		},
		plugins: [
			tsPaths({ tsConfigPath }),
			nodeResolvePlugin(),
			jsonPlugin(),
			commonjsPlugin(),
			useSWC
				? swc({
						tsconfig: tsConfigPath,
						minify: isProduction,
						jsc: {
							target: 'es2020',
							parser: {
								syntax: 'typescript',
								dynamicImport: true,
								decorators: true
							},
							transform: {
								legacyDecorator: true,
								decoratorMetadata: true
							},
							externalHelpers: true,
							keepClassNames: true,
							loose: true
						}
				  })
				: typescriptPlugin({
						check: false,
						tsconfig: tsConfigPath
				  }),
			isServer ? [...serverPlugins] : null,
			...plugins
		],
		external: isServer ? [...external] : null,
		inlineDynamicImports: true
	};
};

export default [generateConfig({ isServer: true }), generateConfig({ isServer: false })];
