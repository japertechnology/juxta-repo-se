# juxta-repo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![AI](https://img.shields.io/badge/Assisted-Development-2b2bff?logo=openai&logoColor=white) 

Captures the latest GitHub snapshots of specified repositories, places them side‑by‑side, static and untouched, enabling analysis and comparison without merging or preserving history.

[**.github/juxta-repo,txt**](.github/juxta-repo.txt) contains the list of repositories to arrange, each on its own line using the format: `owner/repository` and when committed arrangements will be made.

[**.github/workflows/juxta-repo-arrange**](.github/workflows/juxta-repo-arrange.yml) clones the repositories listed in `.github/juxta-repo.txt` file into a fresh `repository/` directory. Each target repository appears as a subfolder holding a snapshot of its files with no Git history.
 
[**.github/workflows/juxta-repo-clear**](.github/workflows/juxta-repo-clear.yml) deletes the `repository/` directory.
