<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=monaco-editor-solidjs&background=tiles&project=%20" alt="monaco-editor-solidjs">
</p>

<h1 align="center">monaco-editor-solidjs</h1>

<div align="center">

[Monaco Editor](https://github.com/Microsoft/monaco-editor) for SolidJS.

[![NPM version][npm-image]][npm-url]
[![bun][bun-image]][bun-url]

[npm-url]: https://www.npmjs.com/package/monaco-editor-solidjs
[npm-image]: https://img.shields.io/npm/v/monaco-editor-solidjs?style=for-the-badge&logo=npm&labelColor=1e1e2e&color=a6e3a1
[bun-url]: https://bun.sh/
[bun-image]: https://img.shields.io/badge/maintained%2Fwith-bun-89b4fa.svg?style=for-the-badge&logo=bun&labelColor=1e1e2e

</div>

## Quick start

Install it:

```bash
npm i monaco-editor-solidjs
# or
yarn add monaco-editor-solidjs
# or
pnpm add monaco-editor-solidjs
# or
bun add monaco-editor-solidjs
```
## MonacoEditor

Basic Usage:

You can import and use the `MonacoEditor` component in your Solid Application:

```jsx
import { MonacoEditor } from 'monaco-editor-solidjs';

function Editor() {
    return <MonacoEditor language="javascript" defaultValue="console.log('Hello World!');" />;
}
```
