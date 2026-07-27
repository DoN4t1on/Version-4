#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/m38704828/Version-4"
DOMAIN="https://do-nation.saeedme.com"
SERVICE="localdonation-api"

cd "$APP_DIR"

echo "==> Installing dependencies..."
npm ci 2>/dev/null || npm install
cd server
npm ci --omit=dev 2>/dev/null || npm install --omit=dev
cd "$APP_DIR"

echo "==> Building frontend..."
API_ORIGIN="$DOMAIN" PUBLIC_URL="$DOMAIN" npm run build
chmod -R o+rX "$APP_DIR/dist"

echo "==> Restarting API..."
sudo systemctl restart "$SERVICE"

echo "==> Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "==> Health check..."
sleep 2
curl -sf http://127.0.0.1:5009/health | grep -q '"status":"ok"' && echo "API healthy"
curl -sf -o /dev/null -w "%{http_code}" http://127.0.0.1/ | grep -qE '200|301|302' && echo "nginx serving frontend"

echo "Deploy complete: $DOMAIN"
