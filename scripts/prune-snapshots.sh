#!/usr/bin/env bash
set -euo pipefail

# Remove snapshot archives older than a retention threshold.
# Usage: RETENTION_DAYS=90 ./scripts/prune-snapshots.sh

RETENTION_DAYS="${RETENTION_DAYS:-${1:-90}}"
SNAPSHOT_DIR="snapshots"

if [ -d "$SNAPSHOT_DIR" ]; then
  find "$SNAPSHOT_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"$RETENTION_DAYS" -print -exec rm -rf {} +
fi
