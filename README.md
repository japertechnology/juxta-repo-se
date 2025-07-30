# Omni Repo Scope

The repository collects every repository in your organisation so that automation tools and AI assistants can reason across the entire codebase.

---

## Quick start

1. **Clone this repo** and install [Python 3](https://www.python.org/) and [Git](https://git-scm.com/).
2. Generate a GitHub token with permission to read your organisation’s repositories and store it as a `OMNI_READONLY` secret.
3. Run the initial sync to pull in all repositories using shadow clones:

   ```bash
   GITHUB_TOKEN=<token> python tooling/sync_repos.py init --org <org-name>
   ```

   Use `--method submodule` or `--method subtree` to change the cloning method.
   If you receive a `404` error, double-check the organisation name and ensure
   your token has permission to access it.
4. Commit the changes so the `repos/` folder and `repos.json` are tracked.

The same steps can be triggered via the **Init repository sync** workflow (`init-repos.yml`).

---

## Workflows

| Workflow | When to run | Purpose |
|----------|-------------|---------|
| [**init-repos**](.github/workflows/init-repos.yml) | Once at repository creation or after cleaning submodules | Clones every org repository and writes `repos.json`. |
| [**refresh-repos**](.github/workflows/refresh-repos.yml) | Whenever you need an updated manifest | Regenerates `repos.json` without touching existing checkouts. |
| [**org-ci**](.github/workflows/org-ci.yml) | Reusable workflow for each child repo | Runs lint, test and optional publish steps. |
| [**codeql**](.github/workflows/codeql.yml) | Periodically or before releases | Performs static analysis for security issues. |

### Suggested order

1. **init-repos** – Populate the `repos/` directory using shadow clones (or submodules/subtrees) and create `repos.json`.
2. **refresh-repos** – Run as needed to keep `repos.json` in sync with GitHub.
3. **org-ci** – Apply this reusable workflow in individual repositories to enforce consistent CI.
4. **codeql** – Schedule or dispatch for organisation-wide security scanning.

Dependabot and Renovate are configured to keep dependencies fresh. Trigger their workflows or run `npx renovate` locally for bulk updates.

---

## How it works

`tooling/sync_repos.py` drives the synchronisation process:

1. The script calls the GitHub API to list every repository in the organisation.
2. Each repository is cloned using one of three methods: **shadow** clone (default), **submodule**, or **subtree** when selected via `--method`.
3. Metadata about each repository is written to `repos.json`.

Both the `init-repos` and `refresh-repos` workflows invoke this script. When running locally, set `GITHUB_TOKEN` in your environment. GitHub workflows use the `OMNI_READONLY` secret to populate this variable.

The generated `repos` directory contains a folder per repository. Shadow clones and submodules use shallow clones for speed, while subtrees copy files directly. `repos.json` captures repository names, SSH URLs, default branches and latest release tags so other tooling has a single source of truth.

---

Additional documentation lives in the [docs](docs/) directory, including [Renovate usage](docs/RENOVATE.md).
