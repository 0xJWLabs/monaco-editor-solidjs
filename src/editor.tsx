import * as monacoEditor from "monaco-editor";
import { MonacoEditorProps } from "./types";
import { createEffect, createSignal, onCleanup, onMount, on, mergeProps } from "solid-js";
import { getOrCreateModel, noop } from "./utils";
import loader, { Monaco } from '@monaco-editor/loader';
import { MonacoContainer } from "./container";
import { Loader } from "./loader";

const viewStates = new Map();

export function MonacoEditor(editorProps: MonacoEditorProps) {
  const props = mergeProps(
    {
      theme: 'vs-light',
      width: '100%',
      height: '100%',
      language: 'javascript',
      loadingState: 'Loading...',
      defaultValue: '',
      saveViewState: true,
      onBeforeMount: noop,
      onMount: noop,
      onBeforeUnmount: noop,
    },
    editorProps,
  );
  const [monaco, setMonaco] = createSignal<Monaco>()
  const [editor, setEditor] = createSignal<monacoEditor.editor.IStandaloneCodeEditor>();

  let containerRef: HTMLDivElement;


  let abortInitialization: (() => void) | undefined
  let monacoOnChangeSubscription: monacoEditor.IDisposable;
  let isOnChangeSuppressed = false;

  onMount(async () => {
    loader.config({ monaco: monacoEditor });
    const loadMonaco = loader.init();

    abortInitialization = () => loadMonaco.cancel();

    try {
      const monaco = await loadMonaco;
      const editor = createEditor(monaco);
      setMonaco(monaco);
      setEditor(editor);

      props.onMount(monaco, editor)
      monacoOnChangeSubscription = editor.onDidChangeModelContent((event) => {
        if (!isOnChangeSuppressed) {
          props.onChange?.(editor.getValue(), event);
        }
      });
    } catch (err: any) {
      if (err?.type === 'cancelation') {
        return;
      }

      console.error('Could not initialize Monaco', err);
    }
  });

  onCleanup(() => {
    const _editor = editor();
    if (!_editor) {
      abortInitialization?.()
      return;
    }

    props.onBeforeUnmount?.(monaco()!, _editor);
    monacoOnChangeSubscription?.dispose();
    _editor.getModel()?.dispose()
    _editor.dispose()
  })


  // Update the editor's theme whenever the theme prop changes
  createEffect(
    on(
      () => props.theme,
      theme => {
        console.log("Setting theme to:", theme);
        monaco()?.editor.setTheme(theme);
      },
      { defer: true }
    )
  )

  createEffect(
    on(
      () => props.language,
      language => {
        const model = editor()?.getModel()
        if (!language || !model) {
          return
        }

        monaco()?.editor.setModelLanguage(model, language)
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => props.value,
      value => {
        const _editor = editor()
        if (!_editor || typeof value === 'undefined') {
          return
        }

        if (_editor.getOption(monaco()!.editor.EditorOption.readOnly)) {
          _editor.setValue(value);
          return;
        }

        if (value !== _editor.getValue()) {
          const model = _editor.getModel();
          isOnChangeSuppressed = true;
          model?.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: value,
              },
            ],
            // @ts-ignore
            undefined
          );

          _editor.pushUndoStop();
          isOnChangeSuppressed = false;
        }
      },
      { defer: true }
    )
  )

  createEffect(
    on(
      () => props.options,
      opts => {
        editor()?.updateOptions({
          ...(props.className ? { extraEditorClassName: props.className } : {}),
          ...opts
        });
      },
      { defer: true }
    )
  )

  createEffect(
    on(
      () => props.path,
      (path, prevPath) => {
        const _monaco = monaco()
        if (!_monaco) {
          return
        }

        const model = getOrCreateModel(_monaco, props.value ?? props.defaultValue, props.language, path)

        if (model !== editor()?.getModel()) {
          if (props.saveViewState) {
            viewStates.set(prevPath, editor()?.saveViewState())
          }
          editor()?.setModel(model)
          if (props.saveViewState) {
            editor()?.restoreViewState(viewStates.get(path))
          }
        }
      },
      { defer: true },
    ),
  )

  const createEditor = (monaco: Monaco) => {
    const model = getOrCreateModel(monaco, props.value ?? props.defaultValue, props.language, props.path);

    return monaco.editor.create(
      containerRef,
      {
        model: model,
        automaticLayout: true,
        ...props.options,
      },
      props.overrideServices,
    )
  }

  return (
    <MonacoContainer class={props.class} width={props.width} height={props.height}>
      {!editor() && <Loader>{props.loadingState}</Loader>}
      <div style={{ width: '100%' }} ref={containerRef!} />
    </MonacoContainer>
  )
}

MonacoEditor.displayName = "MonacoEditor";
