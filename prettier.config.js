export default {
    endOfLine: 'lf',
    arrowParens: 'always',
    bracketSpacing: true,
    printWidth: 100,
    semi: false,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    useTabs: false,
    overrides: [
        {
            files: '*.json',
            options: {
                printWidth: 200,
            },
        },
    ],
}
