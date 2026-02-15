#!/usr/bin/env bash
# Levanta el servidor local y crea un túnel público con ngrok para compartir la partida.
set -euo pipefail

PORT="${PORT:-3000}"

if ! command -v ngrok >/dev/null 2>&1; then
  echo "[error] ngrok no está instalado. Sigue README.md > 'Setup detallado de ngrok'."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "[info] Instalando dependencias..."
  npm install
fi

echo "[info] Iniciando servidor en puerto ${PORT}..."
npm run dev &
APP_PID=$!

cleanup() {
  echo "[info] Cerrando procesos..."
  kill "$APP_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

sleep 2

echo "[info] Abriendo túnel con ngrok en http://localhost:${PORT} ..."
ngrok http "${PORT}"
