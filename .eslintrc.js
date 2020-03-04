module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
    parser: 'babel-eslint',
    plugins: ['react', 'react-hooks'],
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true,
    },
    globals: {},
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            extends: ['airbnb-typescript-prettier'],
            plugins: ['react-hooks'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaFeatures: { jsx: true },
                ecmaVersion: 2020,
                sourceType: 'module',
                project: ['./tsconfig.json'],
            },
            rules: {
                'no-unused-expressions': 'off', // don't support optional chaining
                '@typescript-eslint/no-unused-expressions': 'error',
                'import/prefer-default-export': 'off',
                'no-console': 'off',
                'react-hooks/rules-of-hooks': 'error',
                'react-hooks/exhaustive-deps': 'warn',
                'react/react-in-jsx-scope': 'off',
                'react/jsx-props-no-spreading': 'off',
            },
        },
    ],
}
