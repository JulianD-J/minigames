# MiniKart 2D Multiplayer (Node.js + Socket.IO)

Proyecto completo de juego multijugador online estilo Mario Kart 2D con login por U00, carreras en Canvas, chat, reportes y consola de administración.

## 1) Descargar el proyecto
Puedes hacerlo de 2 formas:

### Opción A — Git clone
```bash
git clone <URL_DEL_REPO>
cd minigames
```

### Opción B — ZIP
1. Descarga el ZIP desde tu hosting Git (GitHub/GitLab).
2. Extrae la carpeta.
3. Abre una terminal en la carpeta `minigames`.

## 2) Requisitos
- Node.js 18+
- npm 9+
- (Opcional para compartir online) ngrok

Verifica:
```bash
node -v
npm -v
```

## 3) Instalación y ejecución local
```bash
npm install
npm run dev
```

Servidor por defecto en `http://localhost:3000`.

## 4) Setup detallado de ngrok (para compartir link público)
Esto es justo la herramienta que te da un link público y redirige a tu `localhost:3000`.

### 4.1 Crear cuenta e instalar
1. Crea cuenta en `https://ngrok.com/`.
2. Descarga ngrok para tu sistema operativo:
   - Windows: zip ejecutable
   - macOS: `brew install ngrok/ngrok/ngrok`
   - Linux: paquete oficial o binario
3. Autentica tu máquina (una sola vez):
```bash
ngrok config add-authtoken TU_TOKEN_DE_NGROK
```

### 4.2 Abrir túnel manual
En terminal 1:
```bash
npm run dev
```
En terminal 2:
```bash
ngrok http 3000
```

ngrok mostrará una URL como:
`https://abc123.ngrok-free.app`

Comparte ese link y tus amigos entrarán a tu app local.

### 4.3 Abrir túnel con script del proyecto
También puedes usar:
```bash
npm run share
```
Ese script levanta el servidor y luego abre ngrok automáticamente.

## 5) Scripts
- `npm start`: iniciar servidor normal.
- `npm run dev`: iniciar servidor en modo watch.
- `npm test`: pruebas unitarias con Jest.
- `npm run share`: iniciar server + ngrok en un solo comando.

## 6) Estructura de carpetas
```txt
server/
  server.js
  adminConsole.js
  routes/
  controllers/
  models/
  utils/
  middleware/
public/
  index.html
  game.html
  admin.html
  css/
  js/
scripts/
  run-with-ngrok.sh
.env
tests/
```

## 7) Flujo de uso
1. Abre `http://localhost:3000`.
2. Login con U00 aprobado (ej. `U00123`) + alias.
3. Juega en `game.html`.
4. Admin entra por `admin-access.html` (pide token y crea sesión admin).
5. Luego abre automáticamente `admin.html` (protegido).

## 8) Consola Admin
- **Jugadores**: alias, ping, estado, power-ups.
- **Chat**: historial reciente.
- **Reportes**: quién reportó, a quién, motivo, hora.
- **Control Juego**: pánico, pause/resume, cambiar pista, reset, power-ups.

### Botón de pánico
- Pausa global de carrera.
- Silencia chat.
- Congela karts.


## 8.1) ¿Cómo abrir la consola admin y que otros players NO entren?
1. Abre `http://localhost:3000/admin-access.html`.
2. Ingresa `ADMIN_TOKEN` (el de tu `.env`).
3. El sistema crea cookie HttpOnly de sesión admin.
4. Recién ahí puedes abrir `admin.html`.

Si otro jugador intenta abrir `admin.html` sin sesión admin válida, recibe acceso denegado (403) y no podrá usar la consola.

## 9) Seguridad básica
- Endpoints admin protegidos con `x-admin-token`.
- Socket jugador requiere token de sesión.
- Socket admin valida `adminToken`.

## 10) Tests incluidos
- Validación de formato U00.
- API de revocación y bloqueo de login.
- Protección y acceso de endpoints admin.
