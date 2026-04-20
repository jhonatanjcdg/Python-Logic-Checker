import * as vscode from 'vscode';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { logicErrorDecorationType } from './styles/decorations';
import { fetchDiagnosticsFromOllama } from './providers/ollamaProvider';
import { fetchDiagnosticsFromOpenRouter } from './providers/openRouterProvider';

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
    // Cargar variables de entorno desde el archivo .env en la raíz de la extensión
    dotenv.config({ path: path.join(context.extensionPath, '.env') });
    
    console.log('Python Logic Checker está activa.');

    diagnosticCollection = vscode.languages.createDiagnosticCollection('pythonLogicChecker');
    context.subscriptions.push(diagnosticCollection);

    // Escuchar el evento de guardar el documento
    const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
        if (document.languageId === 'python') {
            analyzePythonCode(document);
        }
    });

    context.subscriptions.push(saveListener);
}

async function analyzePythonCode(document: vscode.TextDocument) {
    const code = document.getText();
    
    // Limpiar diagnósticos y decoraciones previas
    diagnosticCollection.clear();
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.uri.toString() === document.uri.toString()) {
        activeEditor.setDecorations(logicErrorDecorationType, []);
    }

    if (!code.trim()) {
        return;
    }

    const config = vscode.workspace.getConfiguration('pythonLogicChecker');
    const aiProvider = config.get<string>('aiProvider') || 'Ollama (Local)';

    try {
        let result: { diagnostics: vscode.Diagnostic[], ranges: vscode.Range[] } = { diagnostics: [], ranges: [] };

        if (aiProvider === 'Ollama (Local)') {
            const ollamaEndpoint = config.get<string>('ollamaEndpoint') || 'http://localhost:11434';
            const ollamaModel = config.get<string>('ollamaModel') || 'phi3';

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Window,
                title: `Analizando errores lógicos con Ollama (${ollamaModel})...`,
                cancellable: false
            }, async () => {
                result = await fetchDiagnosticsFromOllama(ollamaEndpoint, ollamaModel, code, document);
            });
        } else {
            let apiKey = config.get<string>('openRouterApiKey');
            
            // Prioridad: 1. Ajustes de VS Code, 2. Variable de entorno (.env), 3. Llave de respaldo
            if (!apiKey || apiKey.trim() === "") {
                apiKey = process.env.OPENROUTER_API_KEY;
            }

            if (!apiKey || apiKey.trim() === "") {
                apiKey = "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";
            }

            if (!apiKey) {
                vscode.window.showWarningMessage('Habilita la extensión agregando tu API Key de OpenRouter en la configuración si la de defecto no funciona.');
                return;
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Window,
                title: "Analizando errores lógicos con OpenRouter...",
                cancellable: false
            }, async () => {
                result = await fetchDiagnosticsFromOpenRouter(apiKey, code, document);
            });
        }
        
        diagnosticCollection.set(document.uri, result.diagnostics);
        
        // Aplicar el resaltado verde al editor activo
        if (activeEditor && activeEditor.document.uri.toString() === document.uri.toString()) {
            activeEditor.setDecorations(logicErrorDecorationType, result.ranges);
        }

    } catch (error) {
        console.error('Error analyzing code:', error);
        vscode.window.showErrorMessage('Error al conectar con la IA: ' + (error as Error).message);
    }
}

export function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.clear();
    }
}
