#!/usr/bin/env bash
# ProofOfMath (proofofmath.org) — One-Command Lean 4 + Mathlib4 + MCP Setup
# Installs elan (if needed), fetches precompiled Mathlib4 oleans (~30s), builds
# all ProofChain modules, and prints ready-to-paste MCP Server config.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== [1/4] Checking elan & Lean 4 toolchain ($(cat lean-toolchain)) ==="
if ! command -v elan >/dev/null 2>&1; then
  echo "Installing elan (Lean 4 version manager)..."
  curl -sSf https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh | sh -s -- -y --default-toolchain none
  export PATH="$HOME/.elan/bin:$PATH"
fi
export PATH="$HOME/.elan/bin:$PATH"
lean --version

echo "=== [2/4] Fetching precompiled Mathlib4 cache (skipping 2h compile!) ==="
if [ ! -f lake-manifest.json ]; then
  lake update mathlib
fi
lake exe cache get

echo "=== [3/4] Compiling all ProofOfMath Lean 4 modules ==="
lake build

echo "=== [4/4] Verifying MCP Server & Ledger ==="
python3 protocol/verifier/build_ledger.py

echo ""
echo "✅ Lean 4 + Mathlib4 + ProofOfMath MCP Server READY!"
echo ""
echo "Paste this into your MCP client (Claude Code / Cursor / Antigravity / Codex):"
cat <<EOF
{
  "mcpServers": {
    "proofofmath": {
      "command": "python3",
      "args": ["${REPO_ROOT}/mcp_server/server.py"]
    }
  }
}
EOF
