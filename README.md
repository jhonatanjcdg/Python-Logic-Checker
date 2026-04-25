# Python Logic Checker 🐍✨

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/logic-checker-python.python-logic-checker?color=brightgreen&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=logic-checker-python.python-logic-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Python Logic Checker** es una herramienta educativa de vanguardia diseñada para detectar errores de lógica y semántica en Python. Su principal fortaleza es el **análisis local mediante Ollama**, lo que garantiza privacidad, velocidad y cero costos de API, aunque también soporta modelos en la nube vía **OpenRouter**.

![Icono de la Extensión](icon.png)

## 🚀 Inicio Rápido - Desde Cero

### 0. Clonar el Repositorio 📥

1. **Abre una terminal** en tu computadora (PowerShell, Git Bash o CMD).
2. **Navega a la carpeta donde quieres almacenar el proyecto**:
   ```bash
   cd C:\Proyectos
   ```
3. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/Python-Logic-Checker.git
   cd Python-Logic-Checker
   ```
4. **Cambiar a la rama Ollama** (rama de desarrollo con Ollama local):
   ```bash
   git checkout ollama
   ```

### 1. Instalar Dependencias 📦

1. **Asegúrate de tener Node.js instalado** (v16+). Descárgalo desde [nodejs.org](https://nodejs.org/).
2. **Abre la terminal en la carpeta del proyecto** y ejecuta:
   ```bash
   npm install
   ```
   Esto instalará todas las dependencias necesarias para compilar la extensión.

### 2. Compilar y Abrir la Ventana de Desarrollo 🔧

1. **Abre el proyecto en Visual Studio Code**:
   ```bash
   code .
   ```

2. **Compila el código** (opcional, pero recomendado):
   ```bash
   npm run compile
   ```

3. **Abre la ventana de desarrollo** presionando **`F5`**:
   - Se abrirá una **nueva ventana de VS Code** con la extensión cargada.
   - Esta es la ventana donde configurarás y probarás la extensión.

---

## ⚙️ Configuración en la Ventana de Desarrollo

Una vez que se abre la ventana de desarrollo con `F5`, configura el proveedor de IA según tu preferencia:

### Opción 1: Ollama Local 

#### Paso 1: Instalar y Configurar Ollama

1. **Descarga Ollama** desde [ollama.com](https://ollama.com/) según tu sistema operativo (Windows, macOS o Linux).
2. **Instala Ollama** siguiendo el asistente.
3. **Abre una terminal** y descarga el modelo que prefieras:
   ```bash
   ollama pull phi3
   ```
   **Opciones de modelos** según capacidad de tu PC:
   - `phi3` (recomendado, ~2GB, rápido) 

4. **Verifica que Ollama esté corriendo**: Debería verse un icono en tu bandeja del sistema (barra de tareas).

#### Paso 2: Configurar la Extensión para Ollama (en la ventana de desarrollo)

1. En la **ventana de desarrollo** (la que se abrió con F5), abre los ajustes: **`Ctrl + ,`**.

2. Busca **"Python Logic Checker"** o **"logic"**.

3. Configura los siguientes valores:
   - **`Ai Provider`** → Selecciona **`Ollama (Local)`**
   - **`Ollama Model`** → Ingresa el modelo descargado (ej: `phi3`)
   - **`Ollama Endpoint`** → `http://localhost:11434`

4. **Guarda los cambios** (`Ctrl + S`).

✅ **¡Listo!** Tu análisis local está configurado.

---

### Opción 2: OpenRouter en la Nube 

#### Paso 1: Crear Cuenta y Obtener API Key

1. **Crea una cuenta en [OpenRouter.ai](https://openrouter.ai/)**.
2. Ve a **Llaves de API** (Keys) en tu perfil.
3. **Copia tu clave API** (empieza con `sk-or-v1-`).

#### Paso 2: Agregar la API Key en la Ventana de Configuración

1. **En la ventana de desarrollo** (la que se abrió con F5), abre los ajustes: **`Ctrl + ,`**.

2. Busca **"Python Logic Checker"** o **"logic"** para ver todas las opciones de la extensión.

3. En la ventana de configuración, localiza y configura estos campos:
   - **`OpenRouter Api Key`** → **Pega tu clave API completa** (ej: `sk-or-v1-b...`)
   - **`Ai Provider`** → Selecciona **`OpenRouter (Cloud)`**


4. **Guarda los cambios** (`Ctrl + S`).

✅ **¡Listo!** Tu análisis en la nube está configurado.

## 🎯 Uso de la Extensión

### En Desarrollo (Modo Prueba)


1. **Abre la ventana de desarrollo** presionando **`F5`** (o `Ejecutar > Iniciar depuración`).
- Se abrirá una **nueva ventana de VS Code** con la extensión cargada.
2. **Crea o abre un archivo Python** en esa ventana (`archivo.py`). 
3. **Escribe o pega tu código Python**:
   ```python
   x = 5
   while x > 0:
       print("Hola")
   ```
5. **Guarda el archivo** (`Ctrl + S`).
6. **Espera unos segundos** mientras el modelo analiza el código.
7. **Visualiza los resultados**:
   - **Decoraciones en línea**: Los errores lógicos aparecen subrayados en **verde esmeralda** directamente en el código.
   - **Panel de Problemas**: Abre `Ver > Problemas` (o `Ctrl + Shift + M`) para ver detalles técnicos y sugerencias de corrección.

### En Producción (Extensión Instalada)

Una vez que la extensión esté instalada en VS Code (vía Marketplace o instalación manual):

1. **Abre cualquier archivo Python** en VS Code.
2. **Guarda el archivo** (`Ctrl + S`).
3. **Espera unos segundos** mientras el modelo analiza el código automáticamente.
4. **Visualiza los errores** en las decoraciones verdes y en el panel de Problemas.

### Ejemplo de Análisis

**Código con Error Lógico:**
```python
x = 5
while x > 0:  # Bucle infinito: x nunca cambia
    print("Analizando...")
```

**Resultado:**
- ✅ Se detecta el bucle infinito.
- ✅ Aparece mensaje: *"Bucle infinito detectado: variable 'x' nunca se modifica dentro del bucle"*.
- ✅ Se ofrece sugerencia: *"Asegúrate de que haya una operación que decrezca 'x' o rompa el bucle"*.

---

## 🌟 Características Principales

**Análisis de Errores Lógicos**
- Bucles infinitos
- Variables declaradas pero nunca utilizadas
- Lógica redundante
- Errores de comparación
- Condiciones imposibles

**Privacidad Total** (con Ollama)
- Tu código **nunca** sale de tu computadora
- Análisis completamente offline
- Cero dependencias de servidores externos

**Rendimiento Optimizado**
- Análisis instantáneo (1-2 segundos con Ollama)
- Interfaz no intrusiva
- Subrayados que no interfieren con errores de sintaxis estándar

**Diseño Premium**
- Indicadores visuales claros en verde esmeralda
- Integración perfecta con VS Code
- Mensajes de error descriptivos

**Opciones de Modelos**
- **Local**: Ollama con phi3, llama2, mistral, etc.
- **Cloud**: OpenRouter con GPT-4, Claude 3.5, Gemini 1.5, etc.

---

## 🔧 Desarrollo y Compilación

Si deseas **modificar la extensión**:

1. **Abre el proyecto en VS Code**:
   ```bash
   code .
   ```

2. **Compila el código TypeScript**:
   ```bash
   npm run compile
   ```

3. **Ejecuta la extensión en modo de desarrollo** (`F5`):
   - Abre una nueva ventana de VS Code con la extensión cargada.
   - Realiza cambios y presiona `Ctrl + R` para recargar.

4. **Empaqueta para publicar** (opcional):
   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

---

## 📝 Estructura del Proyecto

```
Python-Logic-Checker/
├── src/
│   ├── extension.ts          # Punto de entrada principal
│   ├── providers/
│   │   ├── ollamaProvider.ts       # Proveedor Ollama (local)
│   │   └── openRouterProvider.ts   # Proveedor OpenRouter (cloud)
│   ├── styles/
│   │   └── decorations.ts    # Estilos visuales (subrayados)
│   └── utils/
│       └── parser.ts         # Parser de análisis lógico
├── package.json              # Dependencias del proyecto
├── tsconfig.json             # Configuración TypeScript
├── README.md                 # Este archivo
└── LICENSE                   # MIT License
```

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si tengo ambos configurados (Ollama y OpenRouter)?**
A: La extensión usa el proveedor seleccionado en `Ai Provider`. Cambia entre ellos en los ajustes.

**P: ¿Puedo usar OpenRouter sin instalar Ollama?**
A: Sí, completamente. Configura solo OpenRouter y olvídate de Ollama.

**P: ¿Cuánto cuesta usar OpenRouter?**
A: Depende del modelo. Gemini 1.5 Flash cuesta ~$0.001 por análisis. Establece un límite de gasto en tu cuenta.

**P: ¿Por qué mi análisis es lento con Ollama?**
A: Probablemente tu PC es limitada. Prueba modelos más pequeños como `qwen:0.5b`.

**P: ¿La extensión funciona sin guardar el archivo?**
A: No, el análisis se ejecuta automáticamente al guardar (`Ctrl + S`).

---

## 📚 Recursos Útiles

- **Ollama**: [ollama.com](https://ollama.com/)
- **OpenRouter**: [openrouter.ai](https://openrouter.ai/)
- **Documentación de VS Code**: [code.visualstudio.com/api](https://code.visualstudio.com/api)
- **Visual Studio Marketplace**: [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=logic-checker-python.python-logic-checker)

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Ver archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado para el **Diplomado en Metodologías Ágiles y Tecnologías Avanzadas para el Desarrollo de Software** 🎓  
*Universidad de Nariño*
