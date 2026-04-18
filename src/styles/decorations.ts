import * as vscode from 'vscode';

export const logicErrorDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(76, 175, 80, 0.15)', // Fondo verde suave
    border: '1px solid #4CAF50',                // Borde verde esmeralda
    borderRadius: '3px',
    overviewRulerColor: 'rgba(76, 175, 80, 0.8)',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
});
