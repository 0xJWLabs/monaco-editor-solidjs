import { type Monaco } from '@monaco-editor/loader';
import { AllThemes } from "./themes";
import { convertTheme } from '../themeConverter';

export const applyTheme = async (monaco: Monaco) => {
  AllThemes.forEach(async theme => {
    const { url, loaded, name, item, base } = theme;
    if (!loaded) {
      let data = url ? await fetch(url).then(res => res.json()) : item;
      data = convertTheme(data, base);
      theme.loaded = true;
      monaco.editor.defineTheme(name, data);
    }
  })
}

export const Themes = AllThemes.map((theme) => theme.name)
