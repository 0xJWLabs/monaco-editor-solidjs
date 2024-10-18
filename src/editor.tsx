import * as monaco from "monaco-editor";
import { MonacoEditorProps } from "./types";
import { useEffect, useRef, useMemo } from "@solidjs-hooks/solidjs-hooks";
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
} : MonacoEditorProps) {
  const containerElement = useRef<HTMLDivElement | null>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const _subscription = useRef<monaco.IDisposable | null>(null);
  const __prevent_trigger_change_event = useRef<boolean | null>(null);
  
  const fixedWidth = processSize(width);
  const fixedHeight = processSize(height);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const style = useMemo(
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
    editorDidMount(editor.current, monaco);
    _subscription.current = editor.current.onDidChangeModelContent((event) => {
      if (!__prevent_trigger_change_event.current) {
        onChangeRef.current?.(editor.current.getValue(), event);
      }
    })
  }

  const handleEditorWillUnmount = () => {
    editorWillUnmount(editor.current, monaco);
  }

  const initMonaco = () => {
    const finalValue = value !== null ? value : defaultValue;

    if (containerElement.current) {
      const finalOptions = { ...options, ...handleEditorWillMount() };
      const modelUri = uri?.(monaco);
      let model = modelUri && monaco.editor.getModel(modelUri);
      if (model) {
        model.setValue(finalValue);
        monaco.editor.setModelLanguage(model, language);
      } else {
        model = monaco.editor.createModel(finalValue, language, modelUri);
      }
      editor.current = monaco.editor.create(
        containerElement.current,
        {
          model,
          ...(className ? { extraEditorClassName: className } : {}),
          ...finalOptions,
          ...(theme ? { theme } : {}),
        },
        overrideServices
      );
      handleEditorDidMount();
    }
  };

  useEffect(initMonaco, []);

  useEffect(() => {
    if (editor.current) {
      if (value === editor.current.getValue()) {
        return;
      }

      const model = editor.current.getModel();
      __prevent_trigger_change_event.current = true;
      editor.current.pushUndoStop();
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
      editor.current.pushUndoStop();
      __prevent_trigger_change_event.current = false;
    }
  }, [value]);

  useEffect(() => {
    if (editor) {
      const model = editor.current.getModel();
      monaco.editor.setModelLanguage(model, language);
    }
  }, [language]);

  useEffect(() => {
    if (editor.current) {
      const { model: _model, ...optionsWithoutModel } = options;
      editor.current.updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...optionsWithoutModel,
      });
    }
  }, [className, options]);

  useEffect(() => {
    if (editor.current) {
      editor.current.layout();
    }
  }, [width, height]);

  useEffect(() => {
    monaco.editor.setTheme(theme);
  }, [theme]);

  useEffect(
    () => () => {
      if (editor.current) {
        handleEditorWillUnmount();
        editor.current.dispose();
      }
      if (_subscription.current) {
        _subscription.current.dispose();
      }
    },
    []
  );

  return (
    // @ts-ignore
    <div ref={containerElement.current} style={style} class="solid-monaco-editor-container"></div>
  )
}

MonacoEditor.displayName = "MonacoEditor";

export default MonacoEditor;
