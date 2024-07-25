import actionSchemaHbs from '#templates/action-schema.hbs';
import actionSchemaTestHbs from '#templates/action-schema.test.hbs';
import actionHbs from '#templates/action.hbs';
import actionMockHbs from '#templates/action.mock.hbs';
import componentHbs from '#templates/component.hbs';
import componentStoriesHbs from '#templates/component.stories.hbs';
import defaultHbs from '#templates/default.hbs';
import emailHbs from '#templates/email.hbs';
import emailStoriesHbs from '#templates/email.stories.hbs';
import errorHbs from '#templates/error.hbs';
import errorStoriesHbs from '#templates/error.stories.hbs';
import layoutHbs from '#templates/layout.hbs';
import layoutStoriesHbs from '#templates/layout.stories.hbs';
import loadingHbs from '#templates/loading.hbs';
import loadingStoriesHbs from '#templates/loading.stories.hbs';
import modelDbHbs from '#templates/model.db.hbs';
import modelFixturesHbs from '#templates/model.fixtures.hbs';
import modelHbs from '#templates/model.hbs';
import notFoundHbs from '#templates/not-found.hbs';
import notFoundStoriesHbs from '#templates/not-found.stories.hbs';
import pageHbs from '#templates/page.hbs';
import pageStoriesHbs from '#templates/page.stories.hbs';
import pdfHbs from '#templates/pdf.hbs';
import pdfStoriesHbs from '#templates/pdf.stories.hbs';
import queryHbs from '#templates/query.hbs';
import queryMockHbs from '#templates/query.mock.hbs';
import schemaHbs from '#templates/schema.hbs';
import schemaTestHbs from '#templates/schema.test.hbs';
import templateHbs from '#templates/template.hbs';
import templateStoriesHbs from '#templates/template.stories.hbs';
import fuzzypath from 'inquirer-fuzzy-path';
import { ActionType, NodePlopAPI } from 'plop';

const ComponentDirectoryPattern =
    /^src\/app\/(_lib|_schemas|_actions|_assets|api|_pdfs|_emails|_models|I|cron)\/?.*$/;

const PascalCasePattern = /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/;

const CamelCasePattern = /^[a-z]+(?:[A-Z][a-z]+)*$/;

export default function (plop: NodePlopAPI) {
    plop.setDefaultInclude({
        generators: true,
    });

    plop.setPrompt('fuzzypath', fuzzypath);

    plop.setHelper('includes', function (this: any, haystack, needle, options) {
        return haystack.includes(needle) ? options.fn(this) : options.inverse(this);
    });

    plop.setGenerator('component', {
        description: 'Create a new component in the app',
        prompts: [
            {
                type: 'fuzzypath',
                name: 'dir',
                message: 'Where should the component be created?',
                rootPath: 'src/app',
                itemType: 'directory',
                excludePath: (nodePath: string) => ComponentDirectoryPattern.test(nodePath),
                excludeFilter: (nodePath: string) => nodePath.includes('_components'),
                suggestOnly: true,
                validate(value?: string) {
                    if (!value?.trim().length) {
                        return 'A directory is required';
                    }

                    if (!value.startsWith('src/app')) {
                        return 'The directory must be inside the src/app folder';
                    }

                    return true;
                },
                filter(value: string) {
                    return {
                        absolute: value.replace('src/', '#'),
                        original: value,
                        [Symbol.toPrimitive]() {
                            return this.original;
                        },
                    };
                },
            } as any,
            {
                type: 'input',
                name: 'name',
                message: 'What is your component name?',
                validate: (value?: string) => {
                    if (!value?.trim().length) {
                        return 'A component name is required';
                    }

                    if (!PascalCasePattern.test(value)) {
                        return 'The component name must be in PascalCase';
                    }

                    return true;
                },
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{ dir.original }}/_components/{{ name }}.tsx',
                templateFile: componentHbs,
                skipIfExists: true,
            },
            {
                type: 'add',
                path: '{{ dir.original }}/_components/{{ name }}.stories.tsx',
                templateFile: componentStoriesHbs,
                skipIfExists: true,
            },
        ],
    });

    plop.setGenerator('route', {
        description: 'Create a new route in the app',
        prompts: [
            {
                type: 'fuzzypath',
                name: 'dir',
                message: 'Where should the component be created?',
                rootPath: 'src/app',
                itemType: 'directory',
                excludePath: (nodePath: string) => ComponentDirectoryPattern.test(nodePath),
                excludeFilter: (nodePath: string) => nodePath.includes('_components'),
                suggestOnly: true,
                validate(value?: string) {
                    if (!value?.trim().length) {
                        return 'A directory is required';
                    }

                    if (!value.startsWith('src/app')) {
                        return 'The directory must be inside the src/app folder';
                    }

                    return true;
                },
                filter(value: string) {
                    return {
                        absolute: value.replace('src/', '#'),
                        original: value,
                        [Symbol.toPrimitive]() {
                            return this.original;
                        },
                    };
                },
            } as any,
            {
                type: 'checkbox',
                name: 'types',
                message: 'What type of route should be added?',
                choices: [
                    {
                        name: 'Page',
                        value: 'page',
                        checked: true,
                    },
                    {
                        name: 'Layout',
                        value: 'layout',
                        checked: true,
                    },
                    {
                        name: 'Loading',
                        value: 'loading',
                        checked: true,
                    },
                    {
                        name: 'Default',
                        value: 'default',
                        checked: false,
                    },
                    {
                        name: 'Error',
                        value: 'error',
                        checked: false,
                    },
                    {
                        name: 'Not Found',
                        value: 'not-found',
                        checked: false,
                    },
                    {
                        name: 'Template',
                        value: 'template',
                        checked: false,
                    },
                ],
                validate(input?: string[]) {
                    if (!input?.length) {
                        return 'At least one type must be selected';
                    }
                    return true;
                },
            },
        ],
        actions(data) {
            const _actions: Array<ActionType> = [];

            if (data!.types.includes('page')) {
                _actions.push(
                    {
                        type: 'add',
                        path: '{{ dir.original }}/page.tsx',
                        templateFile: pageHbs,
                        skipIfExists: true,
                    },
                    {
                        type: 'add',
                        path: '{{ dir.original }}/page.stories.tsx',
                        templateFile: pageStoriesHbs,
                        skipIfExists: true,
                    },
                );
            }

            if (data!.types.includes('loading')) {
                _actions.push(
                    {
                        type: 'add',
                        path: '{{ dir.original }}/loading.tsx',
                        templateFile: loadingHbs,
                        skipIfExists: true,
                    },
                    {
                        type: 'add',
                        path: '{{ dir.original }}/loading.stories.tsx',
                        templateFile: loadingStoriesHbs,
                        skipIfExists: true,
                    },
                );
            }

            if (data!.types.includes('layout')) {
                _actions.push(
                    {
                        type: 'add',
                        path: '{{ dir.original }}/layout.tsx',
                        templateFile: layoutHbs,
                        skipIfExists: true,
                    },
                    {
                        type: 'add',
                        path: '{{ dir.original }}/layout.stories.tsx',
                        templateFile: layoutStoriesHbs,
                        skipIfExists: true,
                    },
                );
            }

            if (data!.types.includes('error')) {
                _actions.push(
                    {
                        type: 'add',
                        path: '{{ dir.original }}/error.tsx',
                        templateFile: errorHbs,
                        skipIfExists: true,
                    },
                    {
                        type: 'add',
                        path: '{{ dir.original }}/error.stories.tsx',
                        templateFile: errorStoriesHbs,
                        skipIfExists: true,
                    },
                );
            }

            if (data!.types.includes('not-found')) {
                _actions.push(
                    {
                        type: 'add',
                        path: '{{ dir.original }}/not-found.tsx',
                        templateFile: notFoundHbs,
                        skipIfExists: true,
                    },
                    {
                        type: 'add',
                        path: '{{ dir.original }}/not-found.stories.tsx',
                        templateFile: notFoundStoriesHbs,
                        skipIfExists: true,
                    },
                );
            }

            if (data!.types.includes('template')) {
                _actions.push(
                    {
                        type: 'add',
                        path: '{{ dir.original }}/template.tsx',
                        templateFile: templateHbs,
                        skipIfExists: true,
                    },
                    {
                        type: 'add',
                        path: '{{ dir.original }}/template.stories.tsx',
                        templateFile: templateStoriesHbs,
                        skipIfExists: true,
                    },
                );
            }

            if (data!.types.includes('default')) {
                _actions.push({
                    type: 'add',
                    path: '{{ dir.original }}/default.tsx',
                    templateFile: defaultHbs,
                    skipIfExists: true,
                });
            }

            return _actions;
        },
    });

    plop.setGenerator('email', {
        description: 'Create a new email in the app',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your email name?',
                validate: (value?: string) => {
                    if (!value?.trim().length) {
                        return 'An email name is required';
                    }
                    return true;
                },
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/app/_emails/{{ pascalCase name }}.tsx',
                templateFile: emailHbs,
                skipIfExists: false,
            },
            {
                type: 'add',
                path: 'src/app/_emails/{{ pascalCase name }}.stories.tsx',
                templateFile: emailStoriesHbs,
                skipIfExists: true,
            },
        ],
    });

    plop.setGenerator('pdf', {
        description: 'Create a new pdf in the app',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your pdf name?',
                validate: (value?: string) => {
                    if (!value?.trim().length) {
                        return 'A pdf name is required';
                    }

                    if (!PascalCasePattern.test(value)) {
                        return 'The pdf name must be in PascalCase';
                    }

                    return true;
                },
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/app/_pdfs/{{ name }}.tsx',
                templateFile: pdfHbs,
                skipIfExists: false,
            },
            {
                type: 'add',
                path: 'src/app/_pdfs/{{ name }}.stories.tsx',
                templateFile: pdfStoriesHbs,
                skipIfExists: true,
            },
        ],
    });

    plop.setGenerator('schema', {
        description: 'Create a new schema in the app',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your schema name?',
                validate: (value?: string) => {
                    if (!value?.trim().length) {
                        return 'A schema name is required';
                    }

                    if (!PascalCasePattern.test(value)) {
                        return 'The schema name must be in PascalCase';
                    }

                    if (value.endsWith('Schema')) {
                        return 'The schema name should not end with Schema';
                    }

                    return true;
                },
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/app/_schemas/{{ name }}Schema.ts',
                templateFile: schemaHbs,
                skipIfExists: false,
            },
            {
                type: 'add',
                path: 'src/app/_schemas/{{ name }}Schema.test.ts',
                templateFile: schemaTestHbs,
                skipIfExists: true,
            },
        ],
    });

    plop.setGenerator('action', {
        description: 'Create a new action in the app',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your action name?',
                validate: (value?: string) => {
                    if (!value?.trim().length) {
                        return 'A action name is required';
                    }

                    if (!CamelCasePattern.test(value)) {
                        return 'The action name must be in camelCase';
                    }

                    return true;
                },
            },
            {
                type: 'confirm',
                name: 'schema',
                message: 'Does this action require a schema?',
                default: true,
            },
        ],
        actions(data) {
            const _actions: Array<ActionType> = [
                {
                    type: 'add',
                    path: 'src/app/_actions/{{ name }}.ts',
                    templateFile: actionHbs,
                    skipIfExists: true,
                },
                {
                    type: 'add',
                    path: 'src/app/_actions/{{ name }}.mock.ts',
                    templateFile: actionMockHbs,
                    skipIfExists: true,
                },
            ];

            if (data!.schema) {
                _actions.push(
                    {
                        type: 'add',
                        path: 'src/app/_schemas/{{ pascalCase name }}FormDataSchema.ts',
                        templateFile: actionSchemaHbs,
                        skipIfExists: true,
                    },
                    {
                        type: 'add',
                        path: 'src/app/_schemas/{{ pascalCase name }}FormDataSchema.test.ts',
                        templateFile: actionSchemaTestHbs,
                        skipIfExists: true,
                    },
                );
            }

            return _actions;
        },
    });

    plop.setGenerator('model', {
        description: 'Create a new model in the app',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your model name?',
                validate: (value?: string) => {
                    if (!value?.trim().length) {
                        return 'A model name is required';
                    }

                    if (!PascalCasePattern.test(value)) {
                        return 'The model name must be in PascalCase';
                    }

                    return true;
                },
            },
            {
                type: 'list',
                name: 'extension',
                message: 'What is your model extension?',
                choices: ['ts', 'tsx'],
                default: 'ts',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/app/_models/{{ name }}.{{ extension }}',
                templateFile: modelHbs,
                skipIfExists: true,
            },
            {
                type: 'append',
                path: 'src/app/_models/models.ts',
                template: `export const {{name}}Model = getModelForClass({{name}});`,
                unique: true,
                pattern: '// Append model here',
            },
            {
                type: 'append',
                path: 'src/app/_models/models.ts',
                template: `import { {{name}} } from '#app/_models/{{name}}.{{ extension }}';`,
                unique: true,
                pattern: '// Append import here',
            },
            {
                type: 'add',
                path: 'src/app/_models/{{name}}.db.ts',
                templateFile: modelDbHbs,
                skipIfExists: true,
            },
            {
                type: 'add',
                path: 'src/app/_models/{{name}}.fixtures.ts',
                templateFile: modelFixturesHbs,
                skipIfExists: true,
            },
        ],
    });

    plop.setGenerator('query', {
        description: 'Create a new query in the app',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is your query name?',
                validate: (value?: string) => {
                    if (!value?.trim().length) {
                        return 'A query name is required';
                    }

                    if (!CamelCasePattern.test(value)) {
                        return 'The model name must be in camelCase';
                    }

                    return true;
                },
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/app/_queries/{{ name }}.ts',
                templateFile: queryHbs,
                skipIfExists: true,
            },
            {
                type: 'add',
                path: 'src/app/_queries/{{ name }}.mock.ts',
                templateFile: queryMockHbs,
                skipIfExists: true,
            },
        ],
    });
}
