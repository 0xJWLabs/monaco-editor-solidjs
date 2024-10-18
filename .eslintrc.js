export default {
  extends: [
    'prettier',
    'airbnb',
    'plugin:solid/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['solid', 'prettier', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'array-bracket-spacing': 0,
    'camelcase': 0,
    'comma-dangle': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'jsx-a11y/href-no-hash': 0,
    'max-classes-per-file': 0,
    'no-underscore-dangle': 0,
    'prettier/prettier': 2,
    'solid/reactivity': 'warn',
    'solid/no-destructure': 'warn',
    'solid/jsx-no-undef': 'error',
    'semi': 0,
    'valid-jsdoc': 2,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error']
  }
};

