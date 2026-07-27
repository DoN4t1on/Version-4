#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/m38704828/Version-4"
COMMIT_MSG="${1:-Deploy updates}"

cd "$APP_DIR"

if [ -n "$(git status --porcelain)" ]; then
  echo "==> Committing local changes..."
  git add -A
  git commit -m "$COMMIT_MSG"
fi

CURRENT_BRANCH="$(git branch --show-current)"
echo "==> Pushing to origin/$CURRENT_BRANCH..."
git push -u origin "$CURRENT_BRANCH"

echo "==> Pulling latest..."
git pull --rebase origin "$CURRENT_BRANCH"

echo "==> Deploying live..."
"$APP_DIR/scripts/deploy-live.sh"
