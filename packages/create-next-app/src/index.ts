import { Helpers } from '@/Helpers';
import { input, select } from '@inquirer/prompts';
import { mkdir, writeFile } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { cyan, green } from 'picocolors';
import validateNpmPackageName from 'validate-npm-package-name';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

const projectName = await input({
    validate: (input) => {
        const validation = validateNpmPackageName(input.trim());
        return validation.validForNewPackages || validation.errors!.join();
    },
    message: 'Enter the project name',
    transformer: (input) => input.trim(),
});

const packageManager = await select({
    message: 'Pick a package manager',
    default: 'pnpm',
    choices: [
        {
            name: 'npm',
            value: 'npm',
        },
        {
            name: 'pnpm',
            value: 'pnpm',
        },
        {
            name: 'yarn',
            value: 'yarn',
        },
    ],
});

const projectRoot = path.resolve(process.cwd(), projectName);
Helpers.assertDirectoryNotExists(projectRoot);

await Helpers.copyTemplateFiles(['**'], projectRoot, {
    rename: (file) => {
        let dirname = path.dirname(file);
        if (dirname.includes('storybook')) {
            dirname = dirname.replace('storybook', '.storybook');
        } else if (dirname.includes('husky')) {
            dirname = dirname.replace('husky', '.husky');
        }

        let basename = path.basename(file);
        switch (basename) {
            case 'nvmrc':
            case 'gitignore':
            case 'eslintrc.json':
                basename = `.${basename}`;
        }

        return path.join(dirname, basename);
    },
});

const nextVersion = '14.1.4';

const storybookVersion = '^8.0.5';

const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    prettier: '@comradesharf/prettier-config',
    scripts: {
        dev: 'next dev | npx pino-prettier',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        storybook: 'storybook dev -p 6006',
        'build-storybook': 'storybook build',
        'type-check': 'tsc --noEmit --pretty',
        'test-storybook:ci': `npx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" "${packageManager} run build-storybook --test --quiet && npx http-server storybook-static --port 6006 --silent" "npx wait-on tcp:127.0.0.1:6006 && ${packageManager} test-storybook --maxWorkers=3"`,
        prepare: 'husky install',
    },
    'lint-staged': {
        '*.{js,jsx,ts,tsx}': 'eslint --cache --fix',
        '*.{js,jsx,css,md,tsx,ts,mdx,json}': 'prettier --write',
    },
    dependencies: {
        react: '^18',
        'react-dom': '^18',
        next: nextVersion,
    },
    devDependencies: {
        '@comradesharf/prettier-config': '^0.0.1',
        '@storybook/addon-essentials': storybookVersion,
        '@storybook/addon-interactions': storybookVersion,
        '@storybook/addon-links': storybookVersion,
        '@storybook/blocks': storybookVersion,
        '@storybook/nextjs': storybookVersion,
        '@storybook/react': storybookVersion,
        '@storybook/test': storybookVersion,
        '@types/node': '^20',
        '@types/react': '^18',
        '@types/react-dom': '^18',
        eslint: '^8',
        'eslint-config-next': nextVersion,
        'eslint-plugin-storybook': '^0.8.0',
        'eslint-plugin-unused-imports': '^3.1.0',
        husky: '^9.0.11',
        'lint-staged': '^15.2.2',
        postcss: '^8',
        prettier: '^3.2.5',
        storybook: storybookVersion,
        tailwindcss: '^3.4.1',
        typescript: '^5',
        vitest: '^1.4.0',
    },
};

await writeFile(
    path.join(projectRoot, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
);

await mkdir(path.join(projectRoot, 'public'));

console.log('\nInstalling dependencies:');
for (const dependency in { ...packageJson.dependencies }) {
    console.log(`- ${cyan(dependency)}`);
}

console.log('\nInstalling devDependencies:');
for (const dependency in packageJson.devDependencies) {
    console.log(`- ${cyan(dependency)}`);
}

console.log();

const gitInitialized = Helpers.tryGitInit(projectRoot);

if (gitInitialized) {
    console.log('\nInitialized a git repository.');
}

await Helpers.install(packageManager, { cwd: projectRoot });

if (gitInitialized) {
    Helpers.commitGitInitial(projectRoot);
    console.log('\nCommitted the initial project.');
}

console.log(`\n${green('Success!')} Created ${projectName} at ${projectRoot}`);
console.log('Inside that directory, you can run several commands:');
console.log();
console.log(cyan(`  ${packageManager} run dev`));
console.log('    Starts the development server.');
console.log();
console.log(cyan(`  ${packageManager} run build`));
console.log('    Builds the app for production.');
console.log();
console.log(cyan(`  ${packageManager} run storybook`));
console.log('    Open storybook.');
console.log();
console.log(cyan(`  ${packageManager} start`));
console.log('    Runs the built app in production mode.');
console.log();
console.log('We suggest that you begin by typing:');
console.log();
console.log(cyan('  cd'), projectRoot);
console.log(`  ${cyan(`${packageManager} run dev`)}`);
