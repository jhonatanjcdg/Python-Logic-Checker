import * as vscode from 'vscode';
import { getPrompt, parseAIResponse } from '../utils/parser';

export async function fetchDiagnosticsFromOllama(endpoint: string, model: string, code: string, document: vscode.TextDocument): Promise<{ diagnostics: vscode.Diagnostic[], ranges: vscode.Range[] }> {
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
            "format": "json"
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
