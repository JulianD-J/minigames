# MiniKart 2D Multiplayer (Node.js + Socket.IO)

Proyecto de juego multijugador online estilo Mario Kart 2D con login por U00, carreras en Canvas, chat, reportes y consola de administración.

## 1) Descargar el proyecto
### Opción A — Git clone
```bash
git clone <URL_DEL_REPO>
cd minigames
```

### Opción B — ZIP
1. Descarga el ZIP desde GitHub/GitLab.
2. Extrae la carpeta.
3. Abre terminal en `minigames`.

## 2) Requisitos
- Node.js 18+
- npm 9+
- (Opcional para compartir online) ngrok

```bash
node -v
npm -v
```

## 3) Instalación y ejecución local
```bash
npm install
npm run dev
```
Servidor por defecto: `http://localhost:3000`.

## 4) Compartir con ngrok
1. Crea cuenta en `https://ngrok.com/`.
2. Configura token una vez:
```bash
ngrok config add-authtoken TU_TOKEN_DE_NGROK
```
3. Levanta app y túnel:
```bash
npm run dev
ngrok http 3000
```

También puedes usar:
```bash
npm run share
```

## 5) Scripts
- `npm start`: iniciar servidor normal.
- `npm run dev`: iniciar servidor en modo watch.
- `npm test`: pruebas unitarias con Jest.
- `npm run share`: iniciar server + ngrok.

## 6) Estructura de carpetas
```txt
server/
public/
scripts/
.env
tests/
```

## 7) Flujo de uso
1. Abre `http://localhost:3000`.
2. Login con U00 válido (formato `U00` + 6 dígitos, ej. `U00123456`) + alias.
3. Usuarios normales entran a `game.html`.
4. **Solo admin**: si ingresas exactamente `U00130246` y alias `JulianD`, el login te abre `admin.html`.

## 8) Consola Admin
- **Jugadores**: alias, ping, estado, power-ups.
- **Chat**: historial reciente.
- Chat global (solo emojis).
- **Reportes**: quién reportó, a quién, motivo, hora.
- **Control Juego**: pánico, pause/resume, cambiar pista, reset, power-ups.

### Regla de acceso admin (única manera)
La consola admin queda protegida por sesión de backend y **solo se crea** al hacer login con:
- U00: `U00130246`
- Alias: `JulianD`

Sin esa combinación exacta, `admin.html` devuelve acceso denegado.

## 9) Seguridad básica
- Endpoints admin protegidos con sesión admin del backend.
- Socket jugador requiere token de sesión.
- Socket admin solo habilita funciones si la sesión es admin.

## 10) Tests incluidos
- Validación de formato U00.
- API de revocación y bloqueo de login.
- Protección y acceso de endpoints admin.
- Filtro de chat solo emojis.
