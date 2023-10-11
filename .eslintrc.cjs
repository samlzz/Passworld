module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb',
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react', 'prettier'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'import/extension': [0],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: true,
                optionalDependencies: true,
                peerDependencies: true,
            },
        ],
        'import/prefer-default-export': 0,
        'react/no-unescaped-entities': [
            'error',
            {
                forbid: [
                    {
                        char: " ' ",
                        alternative: ' &#39; ',
                    },
                ],
            },
        ],
        'no-console': 'off',
        'react/no-array-index-key': 'off',
        'react/jsx-no-useless-fragment': 'off',
        'react-hooks/exhaustive-deps': 'off',
    },
};
