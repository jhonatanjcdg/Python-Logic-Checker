import * as vscode from 'vscode';

export function getPrompt(code: string): string {
    return `Actúa como un linter avanzado especializado en detectar errores lógicos o de semántica en código Python (no errores de sintaxis que Python ya captura). 
El objetivo es ayudar a estudiantes principiantes. 

ENFÓCATE ESPECIALMENTE EN:
1. Variables que se reasignan (=) dentro de bucles cuando deberían acumularse (+=, -=, *=, etc.)
2. Variables con diferente capitalización que se usan como si fueran la misma
3. Condiciones lógicas invertidas (if x > 5 cuando debería ser x < 5)
4. Índices y rangos incorrectos que pueden causar resultados inesperados
5. Inicializaciones de variables que podrían causar lógica incorrecta

Analiza el siguiente código y dame una lista de errores lógicos. 
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

export function parseAIResponse(responseText: string, document: vscode.TextDocument): { diagnostics: vscode.Diagnostic[], ranges: vscode.Range[] } {
    let parsedErrors: any = [];
    try {
        const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
        const singleObjectMatch = responseText.match(/\{\s*"line"[\s\S]*\}/);
        
        let stringToParse = responseText;
        
        if (jsonMatch) {
            stringToParse = jsonMatch[0];
        } else if (singleObjectMatch) {
            stringToParse = "[" + singleObjectMatch[0] + "]";
        } else {
            stringToParse = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        }

        parsedErrors = JSON.parse(stringToParse);
        
        if (parsedErrors && !Array.isArray(parsedErrors)) {
            parsedErrors = [parsedErrors];
        }
    } catch (e) {
        console.error("No se pudo parsear el JSON de la respuesta:", responseText);
        return { diagnostics: [], ranges: [] };
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const ranges: vscode.Range[] = [];

    if (!Array.isArray(parsedErrors)) {
        return { diagnostics: [], ranges: [] };
    }

    for (const err of parsedErrors) {
        if (!err.line || !err.message) continue;

        const lineIndex = Math.max(0, parseInt(err.line) - 1);
        if (lineIndex >= document.lineCount) continue;

        const lineText = document.lineAt(lineIndex);
        const text = lineText.text;
        
        // Resaltar toda la línea desde el primer carácter no blanco hasta el final
        const startChar = lineText.firstNonWhitespaceCharacterIndex;
        const endChar = text.length;

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
