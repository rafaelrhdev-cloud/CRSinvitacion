# 🎓 Graduación 2025 — Colegio Real de Santiago | Plantel San Juan

Página web de invitación para las ceremonias de graduación de las 3 secciones.

## 📁 Estructura del proyecto

```
graduacion-colegio-real/
├── index.html          ← Página principal (única)
├── css/
│   └── style.css       ← Estilos, animaciones, colores institucionales
├── js/
│   └── main.js         ← Partículas, cursor, reveals, birretes, etc.
├── assets/
│   └── logo.png        ← Logotipo del Colegio Real de Santiago
└── README.md           ← Este archivo
```

## 🗓️ Secciones de graduación

| Sección     | Fecha         | Tema         |
|-------------|---------------|--------------|
| 1° Sección  | 1 de Julio    | Noche de Gala |
| 2° Sección  | 2 de Julio    | Noche de Honor |
| 3° Sección  | 3 de Julio    | Noche de Gloria |

## 🎨 Colores institucionales

- **Azul Royal:** `#1a237e`
- **Azul Profundo:** `#0d1b5e`
- **Dorado:** `#c9a84c`
- **Dorado Claro:** `#e8c96a`

## ✨ Características

- Partículas doradas flotantes animadas (canvas)
- Cursor personalizado dorado
- Birretes 🎓 cayendo en el hero
- Secciones con reveal on scroll
- Tarjetas con efecto 3D al hover
- Navegación fija con blur al hacer scroll
- Diseño responsive (mobile friendly)
- Animación de countdown automática al 1 julio
- Respeta `prefers-reduced-motion`

## 🚀 Cómo subir a GitHub Pages

```bash
git init
git add .
git commit -m "feat: página de graduación Colegio Real 2025"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

Luego en GitHub → Settings → Pages → Source: `main / root` → Save.

## 🛠️ Personalización rápida

- **Hora de la ceremonia:** busca `6:00 PM` / `7:00 PM` en `index.html`
- **Lugar:** busca "Auditorio Principal" en `index.html`
- **Countdown:** en `main.js` línea `const target = new Date('2025-07-01T19:00:00');`
- **Agregar sección de mapa:** añade un `<iframe>` de Google Maps en la sección correspondiente

---
*Diseñado con ❤️ y colores reales del Colegio Real de Santiago*
