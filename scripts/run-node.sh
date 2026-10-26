#!/bin/sh
set -eu

if command -v node >/dev/null 2>&1 && node -e 'process.exit(process.versions.bun ? 1 : 0)' >/dev/null 2>&1; then
  exec node "$@"
fi

codex_node="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
if [ -x "$codex_node" ]; then
  exec "$codex_node" "$@"
fi

echo "A real Node.js runtime is required (Bun's node shim is not compatible with Vinext route discovery)." >&2
exit 1
