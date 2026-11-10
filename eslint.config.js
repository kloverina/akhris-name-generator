import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist', 'node_modules', '.claude'] },

    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],

    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: { parser: tseslint.parser },
        },
    },

    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser, ...globals.node },
        },
        rules: {
            'vue/html-indent': ['warn', 4],
            'vue/html-self-closing': ['warn', { html: { void: 'any' } }],
            'vue/max-attributes-per-line': 'off',
            'vue/singleline-html-element-content-newline': 'off',
            'vue/multi-word-component-names': 'off',
        },
    },
);
