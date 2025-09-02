#!/usr/bin/env bash
set -euo pipefail

# Remove snapshots in the repository/ directory older than a retention period.
# Default retention is 30 days; override with SNAPSHOT_RETENTION_DAYS environment variable.

RETENTION_DAYS="${SNAPSHOT_RETENTION_DAYS:-30}"
SNAPSHOT_DIR="repository"

# Ensure directory exists and isn't a symlink for safety.
if [[ ! -d "$SNAPSHOT_DIR" || -L "$SNAPSHOT_DIR" ]]; then
  echo "Snapshot directory '$SNAPSHOT_DIR' missing or is a symlink; nothing to prune." >&2
  exit 0
fi

find "$SNAPSHOT_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"$RETENTION_DAYS" -print0 | while IFS= read -r -d '' dir; do
  echo "Pruning snapshot: $dir (older than $RETENTION_DAYS days)"
  rm -rf "$dir"
done
