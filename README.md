<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=monaco-editor-solidjs&background=tiles&project=%20" alt="monaco-editor-solidjs">
</p>

<h1 align="center">monaco-editor-solidjs</h1>

<div align="center">

[Monaco Editor](https://github.com/Microsoft/monaco-editor) for SolidJS.

[![NPM version][npm-image]][npm-url]
[![bun][bun-image]][bun-url]

[npm-url]: https://www.npmjs.com/package/monaco-editor-solidjs
[npm-image]: https://img.shields.io/npm/v/monaco-editor-solidjs?style=for-the-badge&logo=npm&labelColor=181825&color=a6e3a1
[bun-url]: https://bun.sh/
[bun-image]: https://img.shields.io/badge/maintained_with-bun-89b4fa.svg?style=for-the-badge&logo=bun&labelColor=181825

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

### Props

The `MonacoEditor` component accepts the following props:

| Prop               | Type                                                               | Default      | Description                                                                    |
|--------------------|--------------------------------------------------------------------|--------------|--------------------------------------------------------------------------------|
| `language`         | `string`                                                           | -            | The programming language for the editor. E.g., `"javascript"`, `"typescript"`. |
| `defaultValue`            | `string`                                                           | -            | Default value for the content of the editor.                                                         |
| `value`            | `string`                                                           | -            | Content of the editor.                                                         |
| `loadingState`     | `JSX.Element`                                                      | `"Loading…"` | JSX element to be displayed during the loading state.                          |
| `class`            | `string`                                                           | -            | CSS class for the editor container.                                            |
| `theme`            | `BuiltinTheme` or `string`                                         | `"vs"`       | The theme to be applied to the editor.                                         |
| `path`             | `string`                                                           | `""`         | Path used for Monaco model management for multiple files.                      |
| `overrideServices` | `object`                                                           | -            | Services to override the default ones provided by Monaco.                      |
| `width`            | `string`                                                           | `"100%"`     | Width of the editor container.                                                 |
| `height`           | `string`                                                           | `"100%"`     | Height of the editor container.                                                |
| `options`          | `object`                                                           | -            | Additional options for the Monaco editor.                                      |
| `saveViewState`    | `string`                                                           | `true`       | Whether to save the model view state for a given path of the editor.           |
| `onChange`         | `(value: string, event: editor.IModelContentChangedEvent) => void` | -            | Callback triggered when the content of the editor changes.                     |
| `onBeforeMount`          | `() => void`   | -            | Callback triggered before the editor mounts.
| `onMount`          | `(monaco: Monaco, editor: editor.IStandaloneCodeEditor) => void`   | -            | Callback triggered when the editor mounts.                                     |
| `onBeforeUnmount`  | `(monaco: Monaco, editor: editor.IStandaloneCodeEditor) => void`   | -            | Callback triggered before the editor unmounts.                                 |

### Getting Monaco and Editor Instances

You can get instances of both `monaco` and the `editor` by using the `onMount` callback:

```jsx
import { MonacoEditor } from 'monaco-editor-solidjs';

function Editor() {
  const handleMount = (monaco, editor) => {
    // Use monaco and editor instances here
  };

  return (
    <MonacoEditor
      language="javascript"
      defaultValue="console.log('Hello World!);"
      onMount={handleMount}
    />
  );
}
```

## License

[MIT](./LICENSE)
