#!/usr/bin/env bash
set -euo pipefail

ENV="$HOME/mcp/.mcp.env"
[[ -f "$ENV" ]] || { echo "❌  $ENV not found"; exit 1; }

# ── 시크릿 export & MCP secret store 반영 ───────────────────────────────────
export $(grep -E '^(OPENAI_API_KEY|DRIVE_REFRESH_TOKEN)=' "$ENV" | xargs)
for k in OPENAI_API_KEY DRIVE_REFRESH_TOKEN; do
  docker mcp secret ls | grep -qx "$k" || docker mcp secret set "$k" "${!k}"
done

# ── google-drive 서버 설치·등록·ENV 매핑·Enable ────────────────────────────
docker pull -q mcp/gdrive:latest
docker mcp server ls | grep -q '^google-drive' || \
  docker mcp server add google-drive mcp/gdrive:latest
docker mcp server env google-drive DRIVE_REFRESH_TOKEN='${DRIVE_REFRESH_TOKEN}'
docker mcp server enable google-drive 2>/dev/null || true

# ── Gateway(포트 3333) 백그라운드 실행 (없을 때만) ────────────────────────
if ! lsof -i :3333 >/dev/null 2>&1; then
  nohup docker mcp gateway run --port 3333 \
        --servers google-drive \
        --secrets "$ENV" > ~/mcp/gateway.log 2>&1 &
  sleep 2
fi

# ── 요약 출력 ───────────────────────────────────────────────────────────────
echo -e "\n🟢  google-drive 서버:"
docker mcp server ls | grep google-drive

echo -e "\n🩺  Gateway health:"
curl -s http://localhost:3333/health || echo "❌  not responding"

echo -e "\n📌  예시 업로드:"
echo "echo '{\"file\":\"/ABS/PATH/FILE.png\",\"folderId\":\"YOUR_FOLDER_ID\"}' | \\"
echo "docker mcp tools call gdrive_upload_file"
