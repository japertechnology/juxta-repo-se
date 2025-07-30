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

A GitHub Actions workflow runs nightly to keep `repos.json` current.

### Automation

The organisation uses **Renovate** for dependency updates. The shared
configuration lives in `.github/renovate.json` and the Renovate GitHub app
should be installed on all repositories.

Additional security scanning is handled by **CodeQL** and **Dependabot** via
workflows in `.github/workflows`.
