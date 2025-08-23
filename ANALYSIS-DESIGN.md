# Repository Overview
This repository aggregates static snapshots of selected GitHub projects for side-by-side inspection without preserving their Git history. Automated workflows read a list of target repositories and clone their contents into a local `repository/` directory for comparison and analysis.

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
- **.github/**: Workflow and configuration files that control cloning and cleanup.
- **repository/**: Contains one subdirectory per upstream project, each a snapshot without Git metadata.
- **README.md / SETTINGS.md / LICENSE.md**: Usage instructions, configuration, and licensing information.
- **juxta-repo.jpg**: Repository logo.

# Core Components
- **.github/juxta-repo.txt**: Plain-text list of `owner/repo` pairs defining which projects are cloned.
- **juxta-repo-arrange.yml**: GitHub Action that clones each listed repository, strips `.git` folders, and commits the snapshots.
- **juxta-repo-clear.yml**: Action that removes the existing `repository/` directory.
- **juxta-repo-cleanup.yml**: Optional workflow that renames documentation, deletes licensing and logo files, and removes snapshots for a clean fork.
- **repository/<project>**: Preserves the upstream file structures of each included project for offline examination.

# Data Flow or Control Flow
```
juxta-repo.txt --> juxta-repo-arrange workflow --> clone repos --> strip .git --> commit to repository/<name>
                                   |
                                   └--> juxta-repo-clear workflow --> remove repository/
```
The list in `juxta-repo.txt` drives cloning. The arrange workflow performs cloning and stripping, while the clear workflow purges snapshots when invoked.

# External Dependencies
- **GitHub Actions**: Orchestrates cloning and cleanup processes.
- **Git**: Performs cloning of external repositories and commits snapshots.
- **dos2unix / sed**: Normalize line endings before processing.
- **Bash**: Shell environment for workflow scripts.

# Notable Design Decisions
- Snapshots intentionally remove all Git history, focusing solely on file content for easier cross-project comparison.
- A single `repository/` directory gathers all snapshots, allowing additions or removals by editing one list.
- Workflow safety checks ensure the `repository/` directory exists and is not a symlink before deletion or modification.

# Limitations or Warnings
- The `repository/` directory can become very large as it stores full copies of external projects.
- Snapshots are static and require rerunning the arrange workflow to update with upstream changes.
- Users must consult each snapshot's license before reuse.

# Error Handling
The repository contains standard text and configuration files, enabling full inspection. No binary-only or opaque content prevents analysis.
