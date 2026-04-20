# Python Logic Checker 🐍✨

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/logic-checker-python.python-logic-checker?color=brightgreen&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=logic-checker-python.python-logic-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Python Logic Checker** es una herramienta educativa de vanguardia diseñada para detectar errores de lógica y semántica en Python. Su principal fortaleza es el **análisis local mediante Ollama**, lo que garantiza privacidad, velocidad y cero costos de API, aunque también soporta modelos en la nube vía OpenRouter.

![Icono de la Extensión](icon.png)

## 📖 Guía de Configuración (Prioridad: Ollama Local)

Esta extensión está optimizada para funcionar con **Ollama**. Sigue estos pasos para activar el análisis local, que es la opción recomendada para este proyecto.

### 1. Preparación de Ollama (Análisis Local) 🏠
Para ejecutar el análisis sin depender de internet ni llaves paga:
1.  **Instalar Ollama**: Descárgalo desde [ollama.com](https://ollama.com/) e instálalo en tu sistema.
2.  **Descargar el Modelo**: Abre una terminal en tu computadora y descarga el modelo por defecto (`phi3`) o el que prefieras:
    ```bash
    ollama pull phi3
    ```
    *(También puedes usar `llama3`, `mistral` o `qwen:0.5b` según los recursos de tu PC).*
3.  **Verificar Ejecución**: Asegúrate de que el icono de Ollama esté visible en tu barra de tareas.

### 2. Configuración en Visual Studio Code 🛠️
Una vez instalado el proyecto (`npm install`) y Ollama:
1.  Abre los ajustes de VS Code (`Ctrl + ,`).
2.  Busca **"Python Logic Checker"**.
3.  Asegúrate de que:
    -   `Ai Provider` esté en **Ollama (Local)**.
    -   `Ollama Model` coincida con el que descargaste (ej. `phi3`).
    -   `Ollama Endpoint` sea `http://localhost:11434`.

### 3. Configuración Alternativa (OpenRouter Cloud) ☁️
Si prefieres usar modelos en la nube (como Gemini 1.5 Flash):
1.  Cambia el `Ai Provider` a **OpenRouter (Cloud)**.
2.  Localiza el archivo `.env.example`, cópialo como **`.env`**.
3.  Agrega tu clave: `OPENROUTER_API_KEY=tu_llave_aqui`.

## 🚀 Cómo usar la extensión

1.  **Ejecutar**: Presiona `F5` para lanzar la ventana de desarrollo.
2.  **Analizar**: Abre cualquier archivo `.py` y **guárdalo (`Ctrl + S`)**.
3.  **Visualizar**: 
    -   Los errores lógicos aparecerán resaltados en **verde esmeralda** directamente en el código.
    -   El detalle técnico y la sugerencia de corrección aparecerán en el panel de **Problemas** (Problems) de VS Code.

## 🌟 Características Principales

-   **Privacidad Total**: Con Ollama, tu código nunca sale de tu computadora.
-   **Análisis Semántico**: Detecta bucles infinitos, variables no utilizadas, lógica redundante y errores de comparación.
-   **Diseño Premium**: Interfaz limpia con subrayados que no interfieren con los errores de sintaxis estándar del lenguaje.

---

Desarrollado para el **Diplomado en Metodologías Ágiles y Tecnologías Avanzadas para el Desarrollo de Software** (Universidad de Nariño).
