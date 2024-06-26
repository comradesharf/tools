import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
    stories: ['../src/app/**/*.mdx', '../src/app/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    staticDirs: ['../public'],
    features: {
        experimentalRSC: true,
    },
};

export default config;
