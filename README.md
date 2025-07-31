# juxta-repo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![AI](https://img.shields.io/badge/Assisted-Development-2b2bff?logo=openai&logoColor=white) 

Captures the latest GitHub snapshots of specified repositories, places them side‑by‑side, static and untouched, enabling analysis and comparison without merging or preserving history.

[**.github/juxta-repo,txt**](.github/juxta-repo.txt) contains the list of repositories to arrange, each on its own line using the format: `owner/repository` and when committed arrangements will be made.

[**.github/workflows/juxta-repo-arrange**](.github/workflows/juxta-repo-arrange.yml) clones the repositories listed in `.github/juxta-repo.txt` file into a fresh `repository/` directory. Each target repository appears as a subfolder holding a snapshot of its files with no Git history.
 
[**.github/workflows/juxta-repo-clear**](.github/workflows/juxta-repo-clear.yml) deletes the `repository/` directory.

Share <a href="https://www.facebook.com/share.php?u=https%3A%2F%2Fgithub.com%2Fjapertechnology%2Fjuxta-repo&p[images][0]=&p[title]=juxta-repo&p[summary]=">Facebook</a> <a href="http://www.linkedin.com/shareArticle?mini=true&url=https://github.com/japertechnology/juxta-repo&title=juxta-repo&summary=&source=">LinkedIn</a> <a href="https://toot.kytta.dev/?mini=true&url=https://github.com/japertechnology/juxta-repo&title=juxta-repo&summary=&source=">Mastodon</a> <a href="https://t.me/share/url?url=https://github.com/japertechnology/juxta-repo">Telegram</a> <a href="https://twitter.com/intent/tweet?text=https://github.com/japertechnology/juxta-repo">X</a>
