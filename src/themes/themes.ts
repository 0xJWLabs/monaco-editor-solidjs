import { compile } from "@catppuccin/vscode";
import * as monacoEditor from "monaco-editor"
export const AllThemes = [
  {
    url: "https://fastly.jsdelivr.net/gh/shikijs/textmate-grammars-themes/packages/tm-themes/themes/tokyo-night.json",
    name: "tokyo-night",
    base: "vs-dark",
  },
  {
    url: "https://fastly.jsdelivr.net/gh/shikijs/textmate-grammars-themes/packages/tm-themes/themes/nord.json",
    name: "nord",
    base: "vs-dark",
  },
  {
    url: "https://fastly.jsdelivr.net/gh/shikijs/textmate-grammars-themes/packages/tm-themes/themes/one-dark-pro.json",
    name: "one-dark-pro",
    base: "vs-dark",
  },
  {
    url: "https://fastly.jsdelivr.net/gh/rose-pine/vscode/themes/rose-pine-color-theme.json",
    name: "rose-pine",
    base: "vs-dark",
  },
  {
    url: "https://fastly.jsdelivr.net/gh/rose-pine/vscode/themes/rose-pine-dawn-color-theme.json",
    name: "rose-pine-dawn",
    base: "vs",
  },
  {
    url: "https://fastly.jsdelivr.net/gh/rose-pine/vscode/themes/rose-pine-moon-color-theme.json",
    name: "rose-pine-moon",
    base: "vs-dark",
  },
  {
    item: compile("latte", {
      accent: "blue"
    }),
    name: "catppuccin-latte",
    base: "vs",
  },
  {
    item: compile("frappe", {
      accent: "blue"
    }),
    name: "catppuccin-frappe",
  },
  {
    item: compile("macchiato", {
      accent: "blue"
    }),
    name: "catppuccin-macchiato",
  },
  {
    item: compile("mocha", {
      accent: "blue"
    }),
    name: "catppuccin-mocha",
  }
] as { name: string; url?: string; item?: any, loaded?: boolean, base?: monacoEditor.editor.BuiltinTheme }[];
