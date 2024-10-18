import * as monaco from "monaco-editor";
import { MonacoEditorProps } from "./types";
import { createEffect, createMemo, createSignal } from "solid-js";
import { noop, processSize } from "./utils";

function MonacoEditor({
  width = "100%",
  height = "100%",
  value = null,
  defaultValue = "",
  language = "javascript",
  theme = null,
  options = {},
  overrideServices = {},
  editorWillMount = noop,
  editorDidMount = noop,
  editorWillUnmount = noop,
  onChange = noop,
  className = null,
  uri
}: MonacoEditorProps) {
  const [containerElement] = createSignal<HTMLDivElement | null>(null);
  const [editor, setEditor] = createSignal<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [subscription, setSubscription] = createSignal<monaco.IDisposable | null>(null);
  const [preventTriggerChangeEvent, setPreventTriggerChangeEvent] = createSignal<boolean | null>(null);

  const fixedWidth = processSize(width);
  const fixedHeight = processSize(height);

  const [onChangeRef] = createSignal(onChange);

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
  }

  const handleEditorDidMount = () => {
    editorDidMount(editor(), monaco);
    setSubscription(editor().onDidChangeModelContent((event) => {
      if (!preventTriggerChangeEvent()) {
        onChangeRef()?.(editor().getValue(), event);
      }
    }))
  }

  const handleEditorWillUnmount = () => {
    editorWillUnmount(editor(), monaco);
  }

  const initMonaco = () => {
    const finalValue = value !== null ? value : defaultValue;

    if (containerElement()) {
      const finalOptions = { ...options, ...handleEditorWillMount() };
      const modelUri = uri?.(monaco);
      let model = modelUri && monaco.editor.getModel(modelUri);
      if (model) {
        model.setValue(finalValue);
        monaco.editor.setModelLanguage(model, language);
      } else {
        model = monaco.editor.createModel(finalValue, language, modelUri);
      }
      setEditor(monaco.editor.create(
        containerElement(),
        {
          model,
          ...(className ? { extraEditorClassName: className } : {}),
          ...finalOptions,
          ...(theme ? { theme } : {}),
        },
        overrideServices
      ));
      handleEditorDidMount();
    }
  };

  createEffect(initMonaco, []);

  createEffect(() => {
    if (editor()) {
      if (value === editor().getValue()) {
        return;
      }

      const model = editor().getModel();
      setPreventTriggerChangeEvent(true);
      editor().pushUndoStop();
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value,
          },
        ],
        undefined,
      );
      editor().pushUndoStop();
      setPreventTriggerChangeEvent(false);
    }
  }, [value]);

  createEffect(() => {
    if (editor()) {
      const model = editor().getModel();
      monaco.editor.setModelLanguage(model, language);
    }
  }, [language]);

  createEffect(() => {
    if (editor()) {
      const { model: _model, ...optionsWithoutModel } = options;
      editor().updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...optionsWithoutModel,
      });
    }
  }, [className, options]);

  createEffect(() => {
    if (editor()) {
      editor().layout();
    }
  }, [width, height]);

  createEffect(() => {
    monaco.editor.setTheme(theme);
    console.log(theme);
  }, [theme]);

  createEffect(
    () => () => {
      if (editor()) {
        handleEditorWillUnmount();
        editor().dispose();
      }
      if (subscription()) {
        subscription().dispose();
      }
    },
    []
  );

  return (
    // @ts-ignore
    <div ref={containerElement()} style={style()} class="solid-monaco-editor-container"></div>
  )
}

MonacoEditor.displayName = "MonacoEditor";

export default MonacoEditor;
