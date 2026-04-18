import * as vscode from 'vscode';

let diagnosticCollection: vscode.DiagnosticCollection;

// Configuración del resaltado verde premium
const logicErrorDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(76, 175, 80, 0.15)', // Fondo verde suave
    border: '1px solid #4CAF50',                // Borde verde esmeralda
    borderRadius: '3px',
    overviewRulerColor: 'rgba(76, 175, 80, 0.8)',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
});

export function activate(context: vscode.ExtensionContext) {
    console.log('Python Logic Checker está activa con OpenRouter.');

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
            const ollamaModel = config.get<string>('ollamaModel') || 'llama3';

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Window,
                title: `Analizando errores lógicos con Ollama (${ollamaModel})...`,
                cancellable: false
            }, async () => {
                result = await fetchDiagnosticsFromOllama(ollamaEndpoint, ollamaModel, code, document);
            });
        } else {
            let apiKey = config.get<string>('openRouterApiKey');
            
            // Llave de respaldo (fallback) del diplomado para que funcione sin configuración
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

function getPrompt(code: string): string {
    return `Actúa como un linter avanzado especializado en detectar errores lógicos o de semántica en código Python (no errores de sintaxis que Python ya captura). 
El objetivo es ayudar a estudiantes principiantes. 

Por favor, analiza el siguiente código y dame una lista de errores lógicos. 
Devuelve la respuesta ESTRICTAMENTE en formato JSON plano usando la siguiente estructura:
[
  {
    "line": numero_de_linea_donde_esta_el_error,
    "message": "Mensaje descriptivo del error en español y cómo solucionarlo"
  }
]
Si no hay errores lógicos, devuelve una lista vacía []. No uses Markdown, solo devuelve el arreglo JSON de inmediato.
Recuerda que las líneas empiezan en 1.

Código:
\`\`\`python
${code}
\`\`\``;
}

function parseAIResponse(responseText: string, document: vscode.TextDocument): { diagnostics: vscode.Diagnostic[], ranges: vscode.Range[] } {
    let parsedErrors: any = [];
    try {
        // 1. Intentar extraer solo el contenido dentro de bloques JSON si existen
        const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/); // Busca un array [ { ... } ]
        const singleObjectMatch = responseText.match(/\{\s*"line"[\s\S]*\}/); // Busca un objeto solo { "line": ... }
        
        let stringToParse = responseText;
        
        if (jsonMatch) {
            stringToParse = jsonMatch[0];
        } else if (singleObjectMatch) {
            stringToParse = "[" + singleObjectMatch[0] + "]"; // Lo envolvemos en array si mandó solo uno
        } else {
            // Limpieza básica si no hay marcas de bloques
            stringToParse = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        }

        parsedErrors = JSON.parse(stringToParse);
        
        // Si por alguna razón parseó un objeto en lugar de un array, lo metemos en uno
        if (parsedErrors && !Array.isArray(parsedErrors)) {
            parsedErrors = [parsedErrors];
        }
    } catch (e) {
        console.error("No se pudo parsear el JSON de la respuesta:", responseText);
        return { diagnostics: [], ranges: [] };
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const ranges: vscode.Range[] = [];

    // Verificación final de que sea iterable
    if (!Array.isArray(parsedErrors)) {
        return { diagnostics: [], ranges: [] };
    }

    for (const err of parsedErrors) {
        if (!err.line || !err.message) continue;

        const lineIndex = Math.max(0, parseInt(err.line) - 1);
        if (lineIndex >= document.lineCount) continue;

        const lineText = document.lineAt(lineIndex);
        const startChar = lineText.firstNonWhitespaceCharacterIndex;
        const endChar = lineText.text.length;

        const range = new vscode.Range(lineIndex, startChar, lineIndex, endChar);
        
        const diagnostic = new vscode.Diagnostic(
            range,
            err.message,
            vscode.DiagnosticSeverity.Information
        );
        diagnostic.source = 'Python Logic Checker';
        
        diagnostics.push(diagnostic);
        ranges.push(range);
    }

    return { diagnostics, ranges };
}

async function fetchDiagnosticsFromOllama(endpoint: string, model: string, code: string, document: vscode.TextDocument): Promise<{ diagnostics: vscode.Diagnostic[], ranges: vscode.Range[] }> {
    const prompt = getPrompt(code);
    const cleanEndpoint = endpoint.replace(/\/$/, "");

    const response = await fetch(`${cleanEndpoint}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": false,
            "format": "json" // Fomenta el uso estricto de JSON si el modelo lo permite
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error (${response.status}): ${errorText}. Asegúrate de que Ollama está en ejecución.`);
    }

    const result: any = await response.json();
    const responseText = result.message?.content || "";
    
    return parseAIResponse(responseText, document);
}

async function fetchDiagnosticsFromOpenRouter(apiKey: string, code: string, document: vscode.TextDocument): Promise<{ diagnostics: vscode.Diagnostic[], ranges: vscode.Range[] }> {
    const prompt = getPrompt(code);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://github.com/microsoft/vscode",
            "X-Title": "Python Logic Checker Extension",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "google/gemini-2.0-flash-001",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const result: any = await response.json();
    const responseText = result.choices?.[0]?.message?.content || "";
    
    return parseAIResponse(responseText, document);
}

export function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.clear();
    }
}
