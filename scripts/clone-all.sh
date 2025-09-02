#!/usr/bin/env bash
set -euo pipefail
shopt -s extglob
echo "::add-mask::${MULTI_REPO_TOKEN}"

ESCAPED_TOKEN=$(printf '%s\n' "${MULTI_REPO_TOKEN}" | sed 's/[\\\/&]/\\&/g')

export GIT_ASKPASS="$(mktemp)"
cat > "$GIT_ASKPASS" <<'INNER'
#!/bin/sh
case "$1" in
  Username*) echo "x-access-token" ;;
  Password*) echo "$MULTI_REPO_TOKEN" ;;
esac
INNER
chmod +x "$GIT_ASKPASS"
export GIT_TERMINAL_PROMPT=0

while IFS= read -r repo || [[ -n $repo ]]; do
  # Trim whitespace and ignore blanks / comments
  repo="${repo//$'\r'/}"
  repo="${repo##*( )}"; repo="${repo%%*( )}"
  [[ -z "$repo" || "$repo" =~ ^# ]] && continue

  # Build full HTTPS URL (accepts owner/name or full URL)
  if [[ $repo =~ ^https?:// ]]; then
    url="$repo"
  else
    url="https://github.com/$repo.git"
  fi

  # Clone into repository/<repo-name>
  target="repository/$(basename "$url" .git)"
  echo "➤ Cloning $url → $target"
  if ! output=$(git clone --depth 1 "$url" "$target" 2>&1); then
    echo "$output" | sed "s/${ESCAPED_TOKEN}/[REDACTED]/g" >&2
    echo "❌ Failed to clone $repo" >&2
    continue
  fi
done < .github/juxta-repo.txt

