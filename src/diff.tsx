import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { createEffect, createMemo } from "solid-js";
import { MonacoDiffEditorProps } from "./types.js";
import { noop, processSize } from "./utils.js";

function MonacoDiffEditor({
  width,
  height,
  value,
  defaultValue,
  language,
  theme,
  options,
  overrideServices,
  editorWillMount,
  editorDidMount,
  editorWillUnmount,
  onChange,
  className,
  original,
  originalUri,
  modifiedUri,
}: MonacoDiffEditorProps) {
  let containerElement: HTMLDivElement | null = null;

  let editor: monaco.editor.IStandaloneDiffEditor | null = null;

  let _subscription: monaco.IDisposable | null = null;

  let __prevent_trigger_change_event: boolean | null = null;

  const fixedWidth = processSize(width);

  const fixedHeight = processSize(height);

  const style = createMemo(
    () => ({
      width: fixedWidth,
      height: fixedHeight,
    }),
    [fixedWidth, fixedHeight],
  );

  const handleEditorWillMount = () => {
    const finalOptions = editorWillMount(monaco);
    return finalOptions || {};
  };

  const handleEditorDidMount = () => {
    editorDidMount(editor, monaco);

    const { modified } = editor.getModel();
    _subscription = modified.onDidChangeContent((event) => {
      if (!__prevent_trigger_change_event) {
        onChange(modified.getValue(), event);
      }
    });
  };

  const handleEditorWillUnmount = () => {
    editorWillUnmount(editor, monaco);
  };

  const initModels = () => {
    const finalValue = value != null ? value : defaultValue;
    const originalModelUri = originalUri?.(monaco);
    const modifiedModelUri = modifiedUri?.(monaco);
    let originalModel =
      originalModelUri && monaco.editor.getModel(originalModelUri);
    let modifiedModel =
      modifiedModelUri && monaco.editor.getModel(modifiedModelUri);

    // Cannot create two models with the same URI,
    // if model with the given URI is already created, just update it.
    if (originalModel) {
      originalModel.setValue(original);
      monaco.editor.setModelLanguage(originalModel, language);
    } else {
      originalModel = monaco.editor.createModel(
        finalValue,
        language,
        originalModelUri,
      );
    }
    if (modifiedModel) {
      originalModel.setValue(finalValue);
      monaco.editor.setModelLanguage(modifiedModel, language);
    } else {
      modifiedModel = monaco.editor.createModel(
        finalValue,
        language,
        modifiedModelUri,
      );
    }

    editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
  };

  createEffect(
    () => {
      if (containerElement) {
        // Before initializing monaco editor
        handleEditorWillMount();
        editor = monaco.editor.createDiffEditor(
          containerElement,
          {
            ...(className ? { extraEditorClassName: className } : {}),
            ...options,
            ...(theme ? { theme } : {}),
          },
          overrideServices,
        );
        // After initializing monaco editor
        initModels();
        handleEditorDidMount();
      }
    },
    [],
  );

  createEffect(() => {
    if (editor) {
      editor.updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...options,
      });
    }
  }, [className, options]);

  createEffect(() => {
    if (editor) {
      editor.layout();
    }
  }, [width, height]);

  createEffect(() => {
    if (editor) {
      const { original: originalEditor, modified } = editor.getModel();
      monaco.editor.setModelLanguage(originalEditor, language);
      monaco.editor.setModelLanguage(modified, language);
    }
  }, [language]);

  createEffect(() => {
    if (editor) {
      const { modified } = editor.getModel();
      __prevent_trigger_change_event = true;
      // modifiedEditor is not in the public API for diff editors
      editor.getModifiedEditor().pushUndoStop();
      // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
      // @ts-expect-error
      modified.pushEditOperations(
        [],
        [
          {
            range: modified.getFullModelRange(),
            text: value,
          },
        ],
      );
      // modifiedEditor is not in the public API for diff editors
      editor.getModifiedEditor().pushUndoStop();
      __prevent_trigger_change_event = false;
    }
  }, [value]);

  createEffect(() => {
    monaco.editor.setTheme(theme);
  }, [theme]);

  createEffect(() => {
    if (editor) {
      const { original: originalEditor } = editor.getModel();
      if (original !== originalEditor.getValue()) {
        originalEditor.setValue(original);
      }
    }
  }, [original]);

  createEffect(
    () => () => {
      if (editor) {
        handleEditorWillUnmount();
        editor.dispose();
        const { original: originalEditor, modified } =
          editor.getModel();
        if (originalEditor) {
          originalEditor.dispose();
        }
        if (modified) {
          modified.dispose();
        }
      }
      if (_subscription) {
        _subscription.dispose();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div
      ref={containerElement}
      // @ts-ignore
      style={style}
      className="solid-monaco-editor-container"
    />
  );
}

MonacoDiffEditor.defaultProps = {
  width: "100%",
  height: "100%",
  original: null,
  value: null,
  defaultValue: "",
  language: "javascript",
  theme: null,
  options: {},
  overrideServices: {},
  editorWillMount: noop,
  editorDidMount: noop,
  editorWillUnmount: noop,
  onChange: noop,
  className: null,
};

MonacoDiffEditor.displayName = "MonacoDiffEditor";

export default MonacoDiffEditor;
