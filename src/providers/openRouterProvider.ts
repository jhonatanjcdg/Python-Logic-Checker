import * as vscode from 'vscode';
import { getPrompt, parseAIResponse } from '../utils/parser';

export async function fetchDiagnosticsFromOpenRouter(apiKey: string, code: string, document: vscode.TextDocument): Promise<{ diagnostics: vscode.Diagnostic[], ranges: vscode.Range[] }> {
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
