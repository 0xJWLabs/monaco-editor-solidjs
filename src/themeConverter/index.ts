import { IVSCodeTheme } from "./interfaces";
import * as monaco from 'monaco-editor';
export * from './interfaces';

export function convertTheme(theme: IVSCodeTheme, base?: monaco.editor.BuiltinTheme): monaco.editor.IStandaloneThemeData {
    const monacoThemeRule: monaco.editor.ITokenThemeRule[] = []; // Define the type explicitly
    const returnTheme: monaco.editor.IStandaloneThemeData = {
        inherit: true,
        base: base ?? 'vs-dark',
        colors: theme.colors,
        rules: monacoThemeRule,
        encodedTokensColors: []
    };

    // Helper function to add rules to the theme
    const addRules = (scope: string | string[], settings: { foreground?: string; background?: string; fontStyle?: string }) => {
        const scopes = Array.isArray(scope) ? scope : [scope];
        scopes.forEach((s) => {
            monacoThemeRule.push({ token: s, ...settings });
        });
    };

    theme.tokenColors.forEach((color) => {
        // Handle the case where scope is a string or an array
        if (typeof color.scope === 'string') {
            const splitScopes = color.scope.split(',').map(s => s.trim());
            addRules(splitScopes, color.settings);
        } else if (Array.isArray(color.scope)) {
            addRules(color.scope, color.settings);
        }
    });

    return returnTheme;
}
