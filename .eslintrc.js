const importGroups = ['module'];

/*
 * Configuration for simple-import-sort plugin to detect
 * the different namespaces defined in the application.
 * This matches the "paths" property of the tsconfig.json file.
 */
const { compilerOptions } = require('get-tsconfig').getTsconfig('./tsconfig.json')['config'];
if ('paths' in compilerOptions) {
  const namespaces = Object.keys(compilerOptions.paths).map(path => path.replace('/*', ''));
  if (namespaces && namespaces.length > 0) {
    namespaces.forEach((element, index) => {
      importGroups.push('/^' + element + '/');
    });
  }
}

/*
 * Although many of the extended configurations already automatically
 * import the plugins, we have chosen to add them explicitly in case
 * the recommended configurations are dispensed with in the future.
 * In this way the rules could be added directly in the "rules" section.
 */
module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
    jest: true,
    'jest/globals': true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 12,
        sourceType: 'module'
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:node/recommended',
        'airbnb-typescript/base',
        'plugin:eslint-comments/recommended',
        'plugin:unicorn/recommended',
        'plugin:sonarjs/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:promise/recommended',
        'plugin:optimize-regex/recommended',
        'plugin:prettier/recommended',
        'plugin:jest-formatting/strict',
        'plugin:security/recommended',
        "plugin:jsonc/base"
      ],
      plugins: [
        '@typescript-eslint',
        'prefer-arrow',
        'node',
        'eslint-comments',
        'unicorn',
        'sonarjs',
        "jest-formatting",
        'import',
        'promise',
        'optimize-regex',
        'prettier',
        'jest-formatting',
        'security',
        'simple-import-sort',
        'unused-imports',
        'deprecation',
        'jest-extended',
        'eslint-plugin-import-helpers',
        "jest-async"
      ],
      settings: {
        // Define import resolver for import plugin
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true
          }
        },
        node: {
          tryExtensions: ['.json', '.node', '.js', '.ts', '.d.ts']
        }
      },
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'jest-extended/prefer-to-be-true': 'warn',
        'jest-extended/prefer-to-be-false': 'error',
        '@typescript-eslint/no-namespace': 'off',
        // For faster development
        'no-process-exit': 'off',
        'no-useless-constructor': 'off',
        'class-methods-use-this': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'unicorn/no-new-array': 'off',
        "jest-async/expect-return": "error",
        'unicorn/no-fn-reference-in-iterator': 'off',
        'unicorn/no-array-for-each': 'off',
        'unicorn/consistent-destructuring': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/prefer-spread': 'off',
        'unicorn/no-array-callback-reference': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/no-useless-undefined': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-process-exit': 'off',
        'unicorn/prefer-module': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: {
              regex: '^I[A-Z]',
              match: true
            }
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE']
          }
        ],
        // Import and order style
        'import-helpers/order-imports': [
          'warn',
          {
            newlinesBetween: 'always',
            groups: importGroups,
            alphabetize: {
              order: 'asc',
              ignoreCase: true
            }
          }
        ],
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['../*'],
                message: 'For imports of parent elements use better path aliases. For example, @domain/shared.'
              }
            ]
          }
        ],
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'simple-import-sort/exports': 'error',
        'import/prefer-default-export': 'off',
        'node/no-unpublished-import': 'off',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-deprecated': 'error',
        'import/exports-last': 'error',
        'padding-line-between-statements': [
          'error',
          {
            blankLine: 'always',
            prev: '*',
            next: 'export'
          },
          {
            blankLine: 'any',
            prev: 'export',
            next: 'export'
          }
        ],
        quotes: [
          'error',
          'single',
          {
            allowTemplateLiterals: true
          }
        ],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_'
          }
        ],

        /* General rules */
        'unicorn/prevent-abbreviations': [
          'warn',
          {
            ignore: ['\\.e2e$', /^ignore/i]
          }
        ],
        // This is disabled because of this issue: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/52595
        'unicorn/prefer-node-protocol': 'off',
        'deprecation/deprecation': 'warn',
        // Disallow unsupported ECMAScript syntax on the specified version
        // Ignore ES6 modules because people might be using babel
        'node/no-unsupported-features/es-syntax': [
          'error',
          {
            ignores: ['modules']
          }
        ],
        // node plugin cannot resolve TypeScript's path aliases. See https://github.com/mysticatea/eslint-plugin-node/issues/233
        'node/no-missing-import': 'off',
        'promise/no-callback-in-promise': 'off',
        'eslint-comments/disable-enable-pair': [
          'error',
          {
            allowWholeFile: true
          }
        ],
        'prefer-arrow/prefer-arrow-functions': [
          'warn',
          {
            disallowPrototype: true,
            singleReturnOnly: false,
            classPropertiesAllowed: false
          }
        ]
      },
      overrides: [
        {
          files: ['*.unit.ts', '*.int.ts', '*.e2e.ts', '*.spec.ts', '*.test.ts'],
          plugins: ['jest'],
          env: {
            jest: true,
            'jest/globals': true
          },
          extends: ['plugin:jest/recommended', 'plugin:jest/style'],
          rules: {
            'jest/expect-expect': [
              'error',
              {
                assertFunctionNames: ['expect', 'request.**.expect']
              }
            ]
          }
        }
      ]
    }
  ]
};
