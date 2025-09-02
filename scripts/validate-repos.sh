#!/usr/bin/env bash
set -euo pipefail
shopt -s extglob

FILE="${1:-.github/juxta-repo.txt}"
ALLOWED="${OWNER_ALLOWLIST:-}"
MAX_SIZE="${MAX_REPO_SIZE_KB:-}"
TOKEN="${MULTI_REPO_TOKEN:-${GITHUB_TOKEN:-}}"

failed=0
lineno=0

while IFS= read -r line || [[ -n $line ]]; do
  lineno=$((lineno + 1))
  line="${line//$'\r'/}"
  line="${line##*( )}"
  line="${line%%*( )}"
  [[ -z "$line" || "$line" =~ ^# ]] && continue

  if [[ $line =~ ^https?://github.com/([^/]+)/([^/]+?)(\.git)?$ ]]; then
    owner="${BASH_REMATCH[1]}"
    repo="${BASH_REMATCH[2]}"
  elif [[ $line =~ ^[^/]+/[^/]+$ ]]; then
    owner="${line%%/*}"
    repo="${line##*/}"
  else
    echo "Line $lineno: invalid repository format '$line'" >&2
    failed=1
    continue
  fi

  if [[ -n "$ALLOWED" ]]; then
    IFS=',' read -ra allowed_arr <<< "${ALLOWED// /,}"
    allowed_ok=0
    for o in "${allowed_arr[@]}"; do
      [[ "$o" == "$owner" ]] && allowed_ok=1 && break
    done
    if [[ $allowed_ok -eq 0 ]]; then
      echo "Line $lineno: owner '$owner' is not in allowlist" >&2
      failed=1
      continue
    fi
  fi

  if [[ -n "$TOKEN" ]]; then
    api_url="https://api.github.com/repos/$owner/$repo"
    resp=$(curl -fsSL -H "Authorization: Bearer $TOKEN" "$api_url") || {
      echo "Line $lineno: repository $owner/$repo not found or inaccessible" >&2
      failed=1
      continue
    }
    if [[ -n "$MAX_SIZE" ]]; then
      size=$(echo "$resp" | grep -oE '"size":\s*[0-9]+' | head -1 | grep -oE '[0-9]+')
      if [[ -n "$size" && "$size" -gt "$MAX_SIZE" ]]; then
        echo "Line $lineno: repository $owner/$repo size ${size}KB exceeds limit ${MAX_SIZE}KB" >&2
        failed=1
      fi
    fi
  fi

done < "$FILE"

if [[ $failed -ne 0 ]]; then
  echo "Repository validation failed" >&2
  exit 1
fi

echo "Repository validation passed"
