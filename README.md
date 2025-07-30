# Omni Repo Scope

`JAPER-GITHUB-SYNC` collects every repository in your organisation so that automation tools and AI assistants can reason across the entire codebase.

---

## Quick start

1. **Clone this repo** and install [Python 3](https://www.python.org/) and [Git](https://git-scm.com/).
2. Generate a GitHub token with permission to read your organisation’s repositories.
3. Run the initial sync to pull in all repositories as submodules:

   ```bash
   GITHUB_TOKEN=<token> python tooling/sync_repos.py init --org <org-name>
   ```
   
   Add `--subtree` if you prefer Git subtrees over submodules.
4. Commit the changes so the `repos/` folder and `repos.json` are tracked.

The same steps can be triggered via the **Init repository sync** workflow (`init-repos.yml`).

---

## Workflows

| Workflow | When to run | Purpose |
|----------|-------------|---------|
| **init-repos** | Once at repository creation or after cleaning submodules | Clones every org repository and writes `repos.json`. |
| **refresh-repos** | Whenever you need an updated manifest | Regenerates `repos.json` without touching existing checkouts. |
| **org-ci** | Reusable workflow for each child repo | Runs lint, test and optional publish steps. |
| **codeql** | Periodically or before releases | Performs static analysis for security issues. |

### Suggested order

1. **init-repos** – Populate the `repos/` directory with submodules or subtrees and create `repos.json`.
2. **refresh-repos** – Run as needed to keep `repos.json` in sync with GitHub.
3. **org-ci** – Apply this reusable workflow in individual repositories to enforce consistent CI.
4. **codeql** – Schedule or dispatch for organisation-wide security scanning.

Dependabot and Renovate are configured to keep dependencies fresh. Trigger their workflows or run `npx renovate` locally for bulk updates.

---

## How it works

`tooling/sync_repos.py` drives the synchronisation process:

1. The script calls the GitHub API to list every repository in the organisation.
2. Each repository is added either as a **submodule** (default) or as a **subtree** when `--subtree` is supplied.
3. Metadata about each repository is written to `repos.json`.

Both the `init-repos` and `refresh-repos` workflows invoke this script. Ensure `GITHUB_TOKEN` is set in your environment or secrets when running it manually.

The generated `repos` directory contains a folder per repository. Submodules are shallow-cloned for speed, while subtrees copy files directly. `repos.json` captures repository names, SSH URLs, default branches and latest release tags so other tooling has a single source of truth.

---

Additional documentation lives in the [docs](docs/) directory, including [Renovate usage](docs/RENOVATE.md) and the comprehensive [design document](DESIGN.md).
