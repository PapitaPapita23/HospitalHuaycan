# Hospital Huaycan - Frontend

Aplicación web construida con React, Vite, Tailwind CSS y React Router.

## Stack tecnológico

- React 19
- Vite 8
- Tailwind CSS 4
- React Router DOM 7
- React Icons
- ESLint 10

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior

## Instalación

1. Clonar el repositorio.
2. Entrar al proyecto.
3. Instalar dependencias.

```bash
git clone <url-del-repositorio>
cd HospitalHuaycan
npm install
```

## Comandos disponibles

### Desarrollo

Levanta el servidor local con recarga en caliente.

```bash
npm run dev
```

Por defecto Vite expone una URL local similar a:

```text
http://localhost:5173
```

### Build de producción

Genera la carpeta de distribución optimizada.

```bash
npm run build
```

Salida esperada:

- Archivos estáticos en la carpeta `dist/`

### Vista previa del build

Sirve localmente el build de producción.

```bash
npm run preview
```

### Lint

Ejecuta validaciones de estilo y reglas de calidad.

```bash
npm run lint
```

## Arquitectura del proyecto

Se sigue una organización modular para escalar funcionalidades sin acoplar vistas globales con módulos de negocio.

```text
src/
├─ app/
│  ├─ layout/
│  │  ├─ components/
│  │  │  ├─ Header.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  └─ navItems.jsx
│  │  └─ PlatformLayout.jsx
│  ├─ pages/
│  │  ├─ HomePage.jsx
│  │  ├─ CalendarPage.jsx
│  │  ├─ ProfilePage.jsx
│  │  ├─ SettingsPage.jsx
│  │  ├─ SupportPage.jsx
│  │  └─ NotFoundPage.jsx
│  └─ router/
│     └─ AppRouter.jsx
├─ modules/
│  └─ auth/
│     ├─ assets/
│     ├─ components/
│     ├─ context/
│     │  └─ AuthContext.tsx
│     └─ pages/
│        ├─ Login.tsx
│        └─ RecoverPassword.tsx
├─ App.jsx
├─ main.jsx
└─ index.css
```

## Capas y responsabilidades

### app/

Contiene la infraestructura global de la aplicación:

- Enrutamiento principal
- Layout compartido posterior al login
- Páginas principales del sistema

### modules/

Contiene funcionalidades encapsuladas por dominio. En este caso:

- `modules/auth`: login, recuperación de clave, contexto de autenticación y recursos del módulo

## Flujo de navegación

Rutas principales definidas en `src/app/router/AppRouter.jsx`:

- Públicas:
	- `/` -> Login
	- `/login` -> Login
	- `/recuperar-clave` -> Recuperación de clave
- Internas (con layout persistente `Header + Navbar`):
	- `/home`
	- `/calendar`
	- `/profile`
	- `/settings`
	- `/support`
- Fallback:
	- `*` -> NotFound

## React Router en este proyecto

### ¿Dónde se configura?

La configuración de routing está distribuida en tres puntos:

- `src/main.jsx`: envuelve toda la app en `BrowserRouter`.
- `src/App.jsx`: renderiza el router principal.
- `src/app/router/AppRouter.jsx`: declara el árbol de rutas con `Routes` y `Route`.

### ¿Cómo funciona el layout persistente?

Se usa enrutamiento anidado de React Router:

- Ruta contenedora sin `path` con `element={<PlatformLayout />}`.
- Dentro de ella se declaran rutas hijas (`/home`, `/calendar`, etc.).
- `PlatformLayout` renderiza `Header` y `Navbar` una sola vez.
- El contenido de cada vista hija se inyecta con `Outlet`.

Esto permite mantener estructura común en todas las vistas internas, evitando duplicación de layout en cada página.

### Diferencia entre rutas públicas e internas

- Públicas: login y recuperación de clave (sin navbar lateral).
- Internas: vistas de plataforma (con layout completo).

Actualmente no hay bloqueo estricto por sesión en las rutas internas, por lo que el control de acceso se maneja a nivel de flujo UI y no por guard de router.

### Navegación en componentes

En el navbar se utiliza:

- `Link` para cambiar de ruta sin recargar la página.
- `useLocation` para detectar la ruta activa y resaltar el ítem seleccionado.

### ¿Cómo agregar una nueva ruta interna?

1. Crear la página en `src/app/pages`.
2. Importarla en `src/app/router/AppRouter.jsx`.
3. Agregar su `Route` dentro del bloque que usa `PlatformLayout`.
4. Añadir el item de navegación en `src/app/layout/components/navItems.jsx` (si debe verse en el menú lateral).

Ejemplo:

```jsx
import ReportsPage from '../pages/ReportsPage'

<Route element={<PlatformLayout />}>
  <Route path="/reports" element={<ReportsPage />} />
</Route>
```

### Recomendación para producción

Para reforzar seguridad y experiencia, implementar un componente `PrivateRoute` que valide `isAuthenticated` y redirija a `/login` cuando no exista sesión activa.

## Autenticación actual

El contexto `AuthContext` implementa un flujo mock para desarrollo:

- Simula login asíncrono
- Almacena estado `isAuthenticated`
- Expone `handleLogin`, `handleLogout` y `setUserRole`

Nota: actualmente las rutas internas están disponibles por enrutamiento directo. Si se requiere control estricto por sesión, se puede agregar un guard de rutas privadas.

## Estilos y UI

- Tailwind CSS 4 está integrado vía Vite (`@tailwindcss/vite`).
- El layout interno usa una estructura persistente con cabecera y barra lateral.
- El módulo de autenticación mantiene su propia composición visual y assets.

## Scripts del package.json

```json
{
	"dev": "vite",
	"build": "vite build",
	"lint": "eslint .",
	"preview": "vite preview"
}
```

## Troubleshooting rápido

### El proyecto no inicia

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

En Windows PowerShell, eliminar carpetas/archivos con:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev
```

### Error por comando start

Este proyecto no define `npm start`.
Usar:

- `npm run dev` para desarrollo
- `npm run preview` para previsualizar build

## Recomendaciones para escalar

- Agregar guards para rutas privadas basado en `isAuthenticated`
- Mover llamadas API a una capa `services` por módulo
- Incorporar pruebas unitarias para componentes críticos del login y layout
- Definir constantes de rutas en un solo archivo para evitar hardcodes
