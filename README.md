# JAPER-GITHUB-SYNC

[![CodeQL](https://github.com/<org>/<repo>/actions/workflows/codeql.yml/badge.svg)](https://github.com/<org>/<repo>/actions/workflows/codeql.yml)
[![Dependabot Status](https://img.shields.io/github/dependabot/alerts/<org>/<repo>)](https://github.com/<org>/<repo>/security/dependabot)

This repository is a mechanism that brings all of the githubs on an account into sharp focus for AI consideraton, effectively being able to speak to an entire repository library.

## Usage

### Initial setup

Run the sync script to add every repository from your organisation as git submodules (shallow cloned):

```bash
GITHUB_TOKEN=<token> python tooling/sync_repos.py init --org <org-name>
```

To include repos using git subtree instead of submodules add `--subtree`:

```bash
GITHUB_TOKEN=<token> python tooling/sync_repos.py init --org <org-name> --subtree
```

### Refreshing `repos.json`

`repos.json` can be updated manually with:

```bash
GITHUB_TOKEN=<token> python tooling/sync_repos.py refresh --org <org-name>
```

Run the `refresh-repos` workflow manually whenever you need to update `repos.json`.

### Manual workflows

Workflows in `.github/workflows` handle tasks like dependency updates and
security scanning. Trigger these workflows manually whenever maintenance is
required.
