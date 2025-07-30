# Omni Repo Scope

This repository aggregates multiple repositories so automation tools and AI assistants can reason across the entire codebase.

## Quick start

1. **Clone this repo**.
2. Generate a GitHub token and store it as a `OMNI_READONLY` secret if cloning private repositories.
3. Run the workflows.

## Workflows

| Workflow | When to run | Purpose |
|----------|-------------|---------|
| [**init-repos**](.github/workflows/init-repos.yml) | Once at repository creation or after cleaning submodules | Clones repositories listed in `repos.txt` and writes `repos.json`. |
| [**refresh-repos**](.github/workflows/refresh-repos.yml) | Whenever you need an updated manifest | Regenerates `repos.json` from local clones. |
| [**org-ci**](.github/workflows/org-ci.yml) | Reusable workflow for each child repo | Runs lint, test and optional publish steps. |
| [**codeql**](.github/workflows/codeql.yml) | Periodically or before releases | Performs static analysis for security issues. |

### Suggested order

1. **init-repos** – Populate the `repos/` directory using shadow clones (or submodules/subtrees) and create `repos.json`.
2. **refresh-repos** – Run as needed to update `repos.json`.
3. **org-ci** – Apply this reusable workflow in individual repositories to enforce consistent CI.
4. **codeql** – Schedule or dispatch for repository-wide security scanning.

Dependabot is configured to keep dependencies fresh.

## How it works

`tooling/sync_repos.py` drives the synchronisation process:

1. The script scans the `repos/` directory for existing clones.
2. Metadata about each repository is written to `repos.json`.

Both the `init-repos` and `refresh-repos` workflows invoke this script. When running locally, set `GITHUB_TOKEN` if private repositories require authentication.

The generated `repos` directory contains a folder per repository. Shadow clones and submodules use shallow clones for speed, while subtrees copy files directly. `repos.json` captures repository names, SSH URLs and default branches so other tooling has a single source of truth.

Additional documentation lives in the [docs](docs/) directory.
