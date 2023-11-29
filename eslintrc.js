module.exports = {
  root: true,
  env: {
    es2021: true,
    jest: true,
    browser: true,
  },
  // mind the order of extends
  // https://eslint.org/docs/latest/user-guide/configuring/configuration-files#extending-configuration-files
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    '@react-native',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  ignorePatterns: ['!.*', 'dist', 'node_modules', '.history'],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'no-relative-import-paths',
    'jsx-expressions',
    'jest',
  ],
  rules: {
    'global-require': 0,
    'import/prefer-default-export': 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    // no /dev dependencies, while allowing exceptions below
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '@jest/globals',
          'scripts/**',
          'test/**', // tape, common npm pattern
          'tests/**', // also common npm pattern
          'spec/**', // mocha, rspec-like pattern
          '**/__tests__/**', // jest pattern
          '**/__mocks__/**', // jest pattern
          'test.{js,jsx}', // repos with a single test file
          'test-*.{js,jsx}', // repos with multiple top-level test files
          '**/*{.,_}{test,spec}.{js,jsx}', // tests where the extension or filename suffix denotes that it is a test
          '**/jest.config.js', // jest config
          '**/jest.setup.js', // jest setup
          '**/vue.config.js', // vue-cli config
          '**/webpack.config.js', // webpack config
          '**/webpack.config.*.js', // webpack config
          '**/rollup.config.js', // rollup config
          '**/rollup.config.*.js', // rollup config
          '**/gulpfile.js', // gulp config
          '**/gulpfile.*.js', // gulp config
          '**/Gruntfile{,.js}', // grunt config
          '**/protractor.conf.js', // protractor config
          '**/protractor.conf.*.js', // protractor config
          '**/karma.conf.js', // karma
          '**/commitlint.config.js',
        ],
        optionalDependencies: false,
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
        'no-param-reassign': ['error', { props: false }],
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        // next rule is disabled by prettier config and should not be used
        // 'object-curly-newline': ['error', { minProperties: 6, multiline: true, consistent: true }],
        'object-curly-newline': [
          'error',
          {
            ObjectExpression: { consistent: true, multiline: true },
            ObjectPattern: { consistent: true, multiline: true },
            ImportDeclaration: { consistent: true, multiline: true },
            ExportDeclaration: { consistent: true, multiline: true },
          },
        ],
        'lines-between-class-members': 'off',
        'default-case': 'off',

        'import/no-unresolved': [2, { ignore: ['.svg$', '.jpg$', '.png$', '.gif$'] }],
        'import/no-named-default': 'warn',

        'react/require-default-props': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // NOTE:  Some patterns in react-native (like defining the styles object at the bottom of the file)
        // contradict this rule
        // 'no-use-before-define': 'off',
        // '@typescript-eslint/no-use-before-define': ['error'],

        // NOTE:  These rules are not useful for react-native, only for web
        // 'jsx-a11y/anchor-is-valid': 'warn',
        // 'jsx-a11y/label-has-associated-control': ['error', {assert: 'either'}],
        // 'react/no-danger': 'off',
        'react-native/no-color-literals': 'error',
        'no-relative-import-paths/no-relative-import-paths': [
          'error',
          { allowSameFolder: true, rootDir: 'src' },
        ],
        'sort-imports': [
          'error',
          {
            ignoreDeclarationSort: true,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            allowSeparatedGroups: false,
          },
        ],
        'import/order': [
          'warn',
          {
            groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
            pathGroupsExcludedImportTypes: ['builtin'],
            'newlines-between': 'never',
            alphabetize: {
              order: 'asc', // sort in ascending order. Options: ['ignore', 'asc', 'desc']
              caseInsensitive: true, // ignore case. Options: [true, false]
            },
          },
        ],
        // prevention of incorrect imports
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'react-native',
                importNames: [
                  'View',
                  'ViewStyle',
                  'ScrollView',
                  'Text',
                  'TextStyle',
                  'Button',
                  'TextInput',
                  'TouchableOpacity',
                  'Image',
                  'ImageStyle',
                  'Pressable',
                ],
                message:
                  'Please use Box, Generic[*] components and [View|Text|Image]Extended styles',
              },
              {
                name: 'react-native-render-html',
                message: 'Please use GenericHtml component',
              },
              {
                name: 'react-native-fast-image',
                message: 'Please use GenericImage component',
              },
              {
                name: 'react-native-safe-area-context',
                importNames: ['useSafeAreaInsets'],
                message: 'Please use adapted version from core/insets',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'jsx-expressions/strict-logical-expressions': 'error',
      },
    },
    {
      files: ['helpers.js'],
      rules: {
        'import/no-unresolved': 0,
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
