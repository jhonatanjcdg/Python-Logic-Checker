"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs = require("fs");
    var path2 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var TIPS = [
      "\u25C8 encrypted .env [www.dotenvx.com]",
      "\u25C8 secrets for agents [www.dotenvx.com]",
      "\u2301 auth for agents [www.vestauth.com]",
      "\u2318 custom filepath { path: '/custom/path/.env' }",
      "\u2318 enable debugging { debug: true }",
      "\u2318 override existing { override: true }",
      "\u2318 suppress logs { quiet: true }",
      "\u2318 multiple files { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`\u26A0 ${message}`);
    }
    function _debug(message) {
      console.log(`\u2506 ${message}`);
    }
    function _log(message) {
      console.log(`\u25C7 ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("no encoding is specified (UTF-8 is used by default)");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path2.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var dotenv = __toESM(require_main());
var path = __toESM(require("path"));
var vscode3 = __toESM(require("vscode"));

// src/utils/parser.ts
var vscode = __toESM(require("vscode"));
function getPrompt(code) {
  return `Act\xFAa como un linter avanzado especializado en detectar errores l\xF3gicos o de sem\xE1ntica en c\xF3digo Python (no errores de sintaxis que Python ya captura). 
El objetivo es ayudar a estudiantes principiantes. 

ENF\xD3CATE ESPECIALMENTE EN:
1. Variables que se reasignan (=) dentro de bucles cuando deber\xEDan acumularse (+=, -=, *=, etc.)
2. Variables con diferente capitalizaci\xF3n que se usan como si fueran la misma
3. Condiciones l\xF3gicas invertidas (if x > 5 cuando deber\xEDa ser x < 5)
4. \xCDndices y rangos incorrectos que pueden causar resultados inesperados
5. Inicializaciones de variables que podr\xEDan causar l\xF3gica incorrecta

Analiza el siguiente c\xF3digo y dame una lista de errores l\xF3gicos. 
Devuelve la respuesta ESTRICTAMENTE en formato JSON plano usando la siguiente estructura:
[
  {
    "line": numero_de_linea_donde_esta_el_error,
    "message": "Mensaje descriptivo del error en espa\xF1ol y c\xF3mo solucionarlo"
  }
]
Si no hay errores l\xF3gicos, devuelve una lista vac\xEDa []. No uses Markdown, solo devuelve el arreglo JSON de inmediato.
Recuerda que las l\xEDneas empiezan en 1.

C\xF3digo:
\`\`\`python
${code}
\`\`\``;
}
function parseAIResponse(responseText, document) {
  let parsedErrors = [];
  try {
    const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    const singleObjectMatch = responseText.match(/\{\s*"line"[\s\S]*\}/);
    let stringToParse = responseText;
    if (jsonMatch) {
      stringToParse = jsonMatch[0];
    } else if (singleObjectMatch) {
      stringToParse = "[" + singleObjectMatch[0] + "]";
    } else {
      stringToParse = responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    }
    parsedErrors = JSON.parse(stringToParse);
    if (parsedErrors && !Array.isArray(parsedErrors)) {
      parsedErrors = [parsedErrors];
    }
  } catch (e) {
    console.error("No se pudo parsear el JSON de la respuesta:", responseText);
    return { diagnostics: [], ranges: [] };
  }
  const diagnostics = [];
  const ranges = [];
  if (!Array.isArray(parsedErrors)) {
    return { diagnostics: [], ranges: [] };
  }
  for (const err of parsedErrors) {
    if (!err.line || !err.message) continue;
    const lineIndex = Math.max(0, parseInt(err.line) - 1);
    if (lineIndex >= document.lineCount) continue;
    const lineText = document.lineAt(lineIndex);
    const text = lineText.text;
    const startChar = lineText.firstNonWhitespaceCharacterIndex;
    const endChar = text.length;
    const range = new vscode.Range(lineIndex, startChar, lineIndex, endChar);
    const diagnostic = new vscode.Diagnostic(
      range,
      err.message,
      vscode.DiagnosticSeverity.Information
    );
    diagnostic.source = "Python Logic Checker";
    diagnostics.push(diagnostic);
    ranges.push(range);
  }
  return { diagnostics, ranges };
}

// src/providers/ollamaProvider.ts
async function fetchDiagnosticsFromOllama(endpoint, model, code, document) {
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
    throw new Error(`Ollama API error (${response.status}): ${errorText}. Aseg\xFArate de que Ollama est\xE1 en ejecuci\xF3n.`);
  }
  const result = await response.json();
  const responseText = result.message?.content || "";
  return parseAIResponse(responseText, document);
}

// src/providers/openRouterProvider.ts
async function fetchDiagnosticsFromOpenRouter(apiKey, code, document) {
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
  const result = await response.json();
  const responseText = result.choices?.[0]?.message?.content || "";
  return parseAIResponse(responseText, document);
}

// src/styles/decorations.ts
var vscode2 = __toESM(require("vscode"));
var logicErrorDecorationType = vscode2.window.createTextEditorDecorationType({
  backgroundColor: "rgba(76, 175, 80, 0.15)",
  // Fondo verde suave
  border: "1px solid #4CAF50",
  // Borde verde esmeralda
  borderRadius: "3px",
  overviewRulerColor: "rgba(76, 175, 80, 0.8)",
  overviewRulerLane: vscode2.OverviewRulerLane.Right
});

// src/extension.ts
var diagnosticCollection;
function activate(context) {
  dotenv.config({ path: path.join(context.extensionPath, ".env") });
  console.log("Python Logic Checker est\xE1 activa.");
  diagnosticCollection = vscode3.languages.createDiagnosticCollection("pythonLogicChecker");
  context.subscriptions.push(diagnosticCollection);
  const saveListener = vscode3.workspace.onDidSaveTextDocument((document) => {
    if (document.languageId === "python") {
      analyzePythonCode(document);
    }
  });
  context.subscriptions.push(saveListener);
}
async function analyzePythonCode(document) {
  const code = document.getText();
  diagnosticCollection.clear();
  const activeEditor = vscode3.window.activeTextEditor;
  if (activeEditor && activeEditor.document.uri.toString() === document.uri.toString()) {
    activeEditor.setDecorations(logicErrorDecorationType, []);
  }
  if (!code.trim()) {
    return;
  }
  const config2 = vscode3.workspace.getConfiguration("pythonLogicChecker");
  const aiProvider = config2.get("aiProvider") || "Ollama (Local)";
  try {
    let result = { diagnostics: [], ranges: [] };
    if (aiProvider === "Ollama (Local)") {
      const ollamaEndpoint = config2.get("ollamaEndpoint") || "http://localhost:11434";
      const ollamaModel = config2.get("ollamaModel") || "phi3";
      await vscode3.window.withProgress({
        location: vscode3.ProgressLocation.Window,
        title: `Analizando errores l\xF3gicos con Ollama (${ollamaModel})...`,
        cancellable: false
      }, async () => {
        result = await fetchDiagnosticsFromOllama(ollamaEndpoint, ollamaModel, code, document);
      });
    } else {
      const apiKey = config2.get("openRouterApiKey");
      if (!apiKey || apiKey.trim() === "") {
        vscode3.window.showWarningMessage("Por favor, configura tu API Key de OpenRouter en los ajustes de VS Code para usar la IA en la nube.");
        return;
      }
      await vscode3.window.withProgress({
        location: vscode3.ProgressLocation.Window,
        title: "Analizando errores l\xF3gicos con OpenRouter...",
        cancellable: false
      }, async () => {
        result = await fetchDiagnosticsFromOpenRouter(apiKey, code, document);
      });
    }
    diagnosticCollection.set(document.uri, result.diagnostics);
    if (activeEditor && activeEditor.document.uri.toString() === document.uri.toString()) {
      activeEditor.setDecorations(logicErrorDecorationType, result.ranges);
    }
  } catch (error) {
    console.error("Error analyzing code:", error);
    vscode3.window.showErrorMessage("Error al conectar con la IA: " + error.message);
  }
}
function deactivate() {
  if (diagnosticCollection) {
    diagnosticCollection.clear();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
