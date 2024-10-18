import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import MonacoDiffEditor from "./diff.jsx";
import MonacoEditor from "./editor.jsx";

export * from "./types";
// eslint-disable-next-line no-restricted-exports
export { MonacoEditor as default, MonacoDiffEditor, monaco };
