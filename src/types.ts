import * as monacoEditor from "monaco-editor";
import type { Monaco } from "@monaco-editor/loader";

/**
 * @remarks
 * This will be `IStandaloneEditorConstructionOptions` in newer versions of monaco-editor, or
 * `IEditorConstructionOptions` in versions before that was introduced.
 */
export type EditorConstructionOptions = NonNullable<
  Parameters<typeof monacoEditor.editor.create>[1]
>

/**
 * Change handler signature for the Monaco editor content.
 */
export type ChangeHandler = (
  value: string,
  event: monacoEditor.editor.IModelContentChangedEvent,
) => void;

/** 
 * Base propereties for configuring a Monaco Editor.
 */
export interface MonacoEditorBaseProps {
  /**
   * Width of editor. Defaults to 100%.
   */
  width?: string;

  /**
   * Height of editor. Defaults to 100%.
   */
  height?: string;

  /**
   * The initial value of the auto created model in the editor.
   */
  defaultValue?: string;

  /**
   * The initial language of the auto created model in the editor. Defaults to 'javascript'.
   */
  language?: string;

  /**
   * Theme to be used for rendering.
   * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
   * You can create custom themes via `monaco.editor.defineTheme`.
   */
  theme?: Theme;

  /**
   * Optional string classname to append to the editor.
   */
  className?: string;

  /**
   * Optional class append to the editor.
   */
  class?: string;
}

export interface MonacoEditorProps extends MonacoEditorBaseProps {
  /**
   * Editor text during loading
   */
  loadingState?: string;

  /**
   * Save view state
   */
  saveViewState?: boolean;

  /**
   * Value of the auto created model in the editor.
   * If you specify `null` or `undefined` for this property, the component behaves in uncontrolled mode.
   * Otherwise, it behaves in controlled mode.
   */
  value?: string;

  /**
   * Refer to Monaco interface {monaco.editor.IStandaloneEditorConstructionOptions}.
   */
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions;

  /**
   * Refer to Monaco interface {monaco.editor.IEditorOverrideServices}.
   */
  overrideServices?: monacoEditor.editor.IEditorOverrideServices;

  /**
   * An event emitted before the editor mounted (similar to componentWillMount of React).
   */
  onBeforeMount?: (monaco: Monaco) => void | EditorConstructionOptions;

  /**
   * An event emitted when the editor has been mounted (similar to componentDidMount of React).
   */
  onMount?: (monaco: Monaco, editor: monacoEditor.editor.IStandaloneCodeEditor) => void;

  /**
   * An event emitted before the editor unmount (similar to componentWillUnmount of React).
   */
  onBeforeUnmount?: (monaco: Monaco, editor: monacoEditor.editor.IStandaloneCodeEditor) => void;

  /**
   * An event emitted when the content of the current model has changed.
   */
  onChange?: ChangeHandler;

  /**
   * Let the language be inferred from the path
   */
  path?: string;
}

// Default themes
export type Theme = monacoEditor.editor.BuiltinTheme | string;
