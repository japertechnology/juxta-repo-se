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

You can also run the same initialization via the `init-repos` workflow.

### Refreshing `repos.json`

`repos.json` can be updated manually with:

```bash
GITHUB_TOKEN=<token> python tooling/sync_repos.py refresh --org <org-name>
```

Run the `refresh-repos` workflow manually whenever you need to update `repos.json`.

### Manual workflows

Workflows in `.github/workflows` handle tasks like initializing and refreshing
repository references, dependency updates and security scanning. Trigger the
`init-repos` or `refresh-repos` workflows as needed, along with any other
maintenance jobs.

## How it works

The `tooling/sync_repos.py` script drives the synchronisation process. At a high
level the tool performs the following steps:

1. Calls the GitHub REST API to enumerate every repository in your organisation.
2. Either adds each repository as a **submodule** (default) or as a **subtree**
   if you pass the `--subtree` flag.
3. Writes summary information about each repository to `repos.json` so that
   other tooling can consume a consistent manifest.

Running the script requires that the environment variable `GITHUB_TOKEN` is set
with a token that has permission to read organisation repositories. The same
logic is used by the `init-repos` and `refresh-repos` workflows.

When a repository is initialised a `repos` directory is created. Inside it you
will find a folder for each repository. Submodules are shallow cloned to keep
the checkout lightweight, while subtrees copy the contents directly into the
`repos` directory.

`repos.json` contains fields such as the repository name, its SSH URL, default
branch and the latest release tag. This file is regenerated on every run so it
always reflects the current state of the organisation.

