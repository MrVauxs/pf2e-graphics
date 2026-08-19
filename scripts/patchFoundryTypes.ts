/**
 * Patches upstream `verbatimModuleSyntax` violations in the pinned `foundry-pf2e` fork's
 * non-declaration `.mts` sources. `skipLibCheck` doesn't cover these (only `.d.ts` files),
 * so without this they fail `svelte-check`/`vite build` under our strict compiler options.
 *
 * Runs as a `postinstall` step since `pnpm patch-commit` hits a Windows MAX_PATH limit on this
 * package's deeply-nested type tree and can't persist the fix as a normal pnpm patch.
 */
import fs from 'node:fs';
import path from 'node:path';

const patches: { file: string; replacements: [string, string][] }[] = [
	{
		file: 'types/foundry/client/applications/sheets/token/mixin.mts',
		replacements: [
			[
				'import HandlebarsApplicationMixin, { HandlebarsRenderOptions, HandlebarsTemplatePart } from "../../api/handlebars-application.mjs";',
				'import HandlebarsApplicationMixin, { type HandlebarsRenderOptions, type HandlebarsTemplatePart } from "../../api/handlebars-application.mjs";',
			],
			[
				'import { DataSchema } from "./../../../../common/abstract/_types.mjs";',
				'import type { DataSchema } from "./../../../../common/abstract/_types.mjs";',
			],
			[
				'import {\n    ApplicationConfiguration,',
				'import type {\n    ApplicationConfiguration,',
			],
		],
	},
	{
		file: 'types/foundry/client/canvas/primary/primary-occludable-object.mts',
		replacements: [
			[
				'import { TileOcclusionMode } from "./../../../common/constants.mjs";',
				'import type { TileOcclusionMode } from "./../../../common/constants.mjs";',
			],
		],
	},
	{
		file: 'types/foundry/client/packages/client-package.mts',
		replacements: [
			[
				'import { PackageCompatibilityBadge, PackageManifestData } from "./_types.mjs";',
				'import type { PackageCompatibilityBadge, PackageManifestData } from "./_types.mjs";',
			],
		],
	},
];

const pnpmDir = 'node_modules/.pnpm';
const packageDirs = fs.existsSync(pnpmDir)
	? fs.readdirSync(pnpmDir)
			.filter(name => name.startsWith('foundry-pf2e@'))
			.map(name => path.join(pnpmDir, name, 'node_modules', 'foundry-pf2e'))
			.filter(dir => fs.existsSync(dir))
	: [];

for (const packageDir of packageDirs) {
	for (const { file, replacements } of patches) {
		const filePath = path.join(packageDir, file);
		if (!fs.existsSync(filePath)) continue;

		let content = fs.readFileSync(filePath, 'utf8');
		for (const [search, replace] of replacements) {
			if (content.includes(replace)) continue;
			if (!content.includes(search)) {
				console.warn(`[patchFoundryTypes] Expected text not found in ${filePath}; skipping (upstream may have changed).`);
				continue;
			}
			content = content.replace(search, replace);
		}
		fs.writeFileSync(filePath, content);
	}
}
