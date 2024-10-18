import * as monacoEditor from "monaco-editor";
import { MonacoEditorProps } from "./types";
import { createEffect, createSignal, onCleanup, onMount, on, mergeProps } from "solid-js";
import { getOrCreateModel, noop } from "./utils";
import loader, { Monaco } from '@monaco-editor/loader';
import { MonacoContainer } from "./container";
import { Loader } from "./loader";

export function MonacoEditor(editorProps: MonacoEditorProps) {
  const props = mergeProps(
    {
      theme: 'vs-light',
      width: '100%',
      height: '100%',
      language: 'javascript',
      loadingState: 'Loading...',
      saveViewState: true,
      onBeforeMount: noop,
      onMount: noop,
      onBeforeUnmount: noop,
    },
    editorProps,
  );
  const [monaco, setMonaco] = createSignal<Monaco>()
  const [editor, setEditor] = createSignal<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const [subscription, setSubscription] = createSignal<monacoEditor.IDisposable | null>(null);
  const [preventTriggerChangeEvent, setPreventTriggerChangeEvent] = createSignal<boolean>(false);

  let containerElement: HTMLDivElement;


  const [onChangeRef] = createSignal(props.onChange);

  let abortInitialization: (() => void) | undefined

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
      setSubscription(editor.onDidChangeModelContent((event) => {
        if (!preventTriggerChangeEvent()) {
          onChangeRef()?.(editor.getValue(), event);
        }
      }));
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
    subscription()?.dispose();
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
          setPreventTriggerChangeEvent(true);
          _editor.executeEdits('', [
            {
              range: _editor.getModel()!.getFullModelRange(),
              text: value,
              forceMoveMarkers: true
            },
          ])

          _editor.pushUndoStop();
          setPreventTriggerChangeEvent(false);
        }
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

  const createEditor = (_monaco: Monaco) => {
    const finalValue = props.value ?? props.defaultValue;
    const finalOptions = { ...props.options, ...(props.onBeforeMount(monaco()) || {}) };
    const model = getOrCreateModel(_monaco, finalValue, props.language, props.path);

    return _monaco.editor.create(
      containerElement,
      {
        model: model,
        automaticLayout: true,
        ...finalOptions,
      },
      props.overrideServices,
    )
  }

  return (
    <MonacoContainer class={props.class} width={props.width} height={props.height}>
      {!editor() && <Loader>{props.loadingState}</Loader>}
      <div style={{ width: '100%' }} ref={containerElement!} />
    </MonacoContainer>
  )
}

MonacoEditor.displayName = "MonacoEditor";
