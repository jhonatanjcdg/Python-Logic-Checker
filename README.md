# Python Logic Checker 🐍✨

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/LuisEstrada.python-logic-checker?color=brightgreen&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=LuisEstrada.python-logic-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Python Logic Checker** es una extensión diseñada para ayudar a estudiantes de programación a identificar errores de lógica y semántica en Python antes de ejecutar su código. Utiliza Inteligencia Artificial avanzada (vía OpenRouter) para analizar el flujo del programa y ofrecer sugerencias amigables en español.

![Icono de la Extensión](icon.png)

## 🚀 Características

- **Detección de Errores Lógicos**: Identifica bucles infinitos, variables mal inicializadas, lógica de comparación defectuosa y más.
- **Resaltado Premium**: Los errores se marcan con un elegante subrayado verde (no intrusivo) para diferenciarlos de los errores de sintaxis estándar.
- **Feedback en Español**: Explicaciones claras y sugerencias de corrección pensadas para principiantes.
- **Análisis al Guardar**: La verificación se realiza automáticamente cada vez que guardas tu archivo (`Ctrl+S`).

## 🛠️ Configuración

Para utilizar esta extensión, necesitas una API Key de **OpenRouter**:

1. Obtén tu llave en [openrouter.ai](https://openrouter.ai/).
2. En VS Code, ve a `Archivo > Preferencias > Configuración`.
3. Busca `pythonLogicChecker.openRouterApiKey`.
4. Pega tu API Key.

## 📝 Ejemplo de uso

Si escribes un código con un error de lógica común:

```python
# Un bucle que nunca termina
i = 0
while i < 10:
    print("Contando...")
    # ¡Olvidaste incrementar i!
```

Al guardar, la extensión resaltará la línea del bucle y te sugerirá: *"Parece que tienes un bucle infinito porque la variable 'i' no se modifica dentro del ciclo. Prueba añadir i += 1."*

---

Desarrollado para el **Diplomado en Metodologías Ágiles y Tecnologías Avanzadas para el Desarrollo de Software** (Universidad de Nariño).
