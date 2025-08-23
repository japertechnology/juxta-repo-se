# Repository Overview
This repository provides static snapshots of multiple external GitHub projects for side-by-side comparison without preserving their git history. Automated workflows clone specified repositories, strip metadata, and commit the raw files into a dedicated `repository/` directory.

# Directory and File Structure
```
/
├── .github/
│   ├── juxta-repo.txt
│   └── workflows/
│       ├── juxta-repo-arrange.yml
│       ├── juxta-repo-clear.yml
│       └── juxta-repo-cleanup.yml
├── repository/
│   ├── 996.ICU/
│   ├── awesome/
│   ├── awesome-python/
│   ├── build-your-own-x/
│   ├── coding-interview-university/
│   ├── developer-roadmap/
│   ├── free-programming-books/
│   ├── freeCodeCamp/
│   ├── react/
│   └── system-design-primer/
├── LICENSE.md
├── README.md
├── SETTINGS.md
└── juxta-repo.jpg
```
- **.github/**: Workflow and configuration files controlling snapshot creation and cleanup.
- **repository/**: Contains one subdirectory per cloned project, each a snapshot of the original repository without git metadata.
- **README.md / SETTINGS.md / LICENSE.md**: Usage instructions, configuration details, and licensing.
- **juxta-repo.jpg**: Repository logo.

# Core Components
- **.github/juxta-repo.txt**: Plain-text list of `owner/repo` pairs that defines which projects are cloned.
- **juxta-repo-arrange workflow**: GitHub Action that reads `juxta-repo.txt`, shallow-clones each entry, removes `.git` folders, and commits the clean snapshots.
- **juxta-repo-clear workflow**: Action that deletes the existing `repository/` directory and commits the removal.
- **juxta-repo-cleanup workflow**: Optional action that renames `SETTINGS.md` to `README.md`, deletes licensing and logo files, and removes the snapshot directory for a clean fork.
- **repository/<project>**: Subdirectories such as `freeCodeCamp/` or `awesome/` retain the upstream file structure of their source repositories for inspection.

# Data Flow or Control Flow
```
juxta-repo.txt ──> juxta-repo-arrange workflow ──> clone repos ──> strip .git ──> commit to repository/<name>
                                        │
                                        └────> juxta-repo-clear workflow ──> remove repository/
```
The list in `juxta-repo.txt` drives cloning. The arrange workflow performs cloning and stripping, while the clear workflow purges snapshots when invoked.

# External Dependencies
- **GitHub Actions**: Orchestrates automated cloning and cleanup processes.
- **Git**: Used for cloning external repositories and committing snapshots.
- **dos2unix / sed**: Ensures text files use Unix line endings prior to processing.
- **Bash**: Shell environment for workflow scripts.

# Notable Design Decisions
- Snapshots remove all git history to focus on file content, simplifying comparison between large projects.
- A single `repository/` directory holds all snapshots, making it easy to add or remove projects by editing one list.
- Workflow safety checks verify that the `repository/` directory exists and is not a symlink before deletion or modification.

# Limitations or Warnings
- The `repository/` directory can grow very large as it stores full copies of external projects.
- Updates require rerunning the arrange workflow; snapshots do not automatically sync with upstream changes.
- Users must observe each snapshot’s original license before reuse.

# Error Handling
The repository contains standard text and configuration files, allowing full analysis. No binary-only or opaque content prevents inspection.
