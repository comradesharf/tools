import { execSync, spawn } from 'child_process';
import { once } from 'events';
import { glob } from 'fast-glob';
import { existsSync, rmSync } from 'fs';
import { copyFile, mkdir } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

export function assertDirectoryNotExists(dir: string) {
    if (existsSync(dir)) {
        console.log(`Directory ${dir} does already exists`);
        process.exit(1);
    }
}

export function getTemplateDirectory() {
    return path.join(path.dirname(fileURLToPath(import.meta.url)), 'template');
}

export async function copyTemplateFiles(
    src: string | string[],
    dest: string,
    {
        rename = (file) => file,
    }: {
        rename?: (file: string) => string;
    } = {},
) {
    if (typeof src === 'string') {
        src = [src];
    }

    const templateDir = getTemplateDirectory();

    const files = await glob(src, {
        cwd: templateDir,
    });

    await Promise.all(
        files.map(async (file) => {
            const srcPath = path.join(templateDir, file);
            const destPath = rename(path.join(dest, file));
            await mkdir(path.dirname(destPath), { recursive: true });
            await copyFile(srcPath, destPath);
        }),
    );
}

export async function install(packageManager: string, { cwd }: { cwd: string }) {
    await once(
        spawn(packageManager, ['install'], {
            cwd,
            stdio: 'inherit',
            env: {
                ...process.env,
                ADBLOCK: '1',
                NODE_ENV: 'development',
                DISABLE_OPENCOLLECTIVE: '1',
            },
        }),
        'close',
    );
}

export function tryGitInit(root: string) {
    try {
        execSync('git init', { stdio: 'ignore', cwd: root });
        execSync('git checkout -b main', { stdio: 'ignore', cwd: root });
        return true;
    } catch (e) {
        try {
            rmSync(path.join(root, '.git'), { recursive: true, force: true });
        } catch (_) {}
        return false;
    }
}

export function commitGitInitial(root: string) {
    execSync('git add -A', { stdio: 'ignore', cwd: root });
    execSync('git commit -m "Initial commit from @comradesharf/create-next-app"', {
        stdio: 'ignore',
        cwd: root,
    });
}

export const Helpers = {
    copyTemplateFiles,
    assertDirectoryNotExists,
    install,
    tryGitInit,
    commitGitInitial,
};
