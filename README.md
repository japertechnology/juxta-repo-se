# [**juxta-repo**](https://github.com/japertechnology/juxta-repo)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![AI](https://img.shields.io/badge/Assisted-Development-2b2bff?logo=openai&logoColor=white)

Captures the latest GitHub snapshots of [**specified**](.github/juxta-repo.txt) repositories, places them [**side-by-side**](repository/), static and untouched, enabling analysis and comparison without merging or preserving history.

![https://github.com/japertechnology/juxta-repo/blob/main/juxta-repo.jpg](https://github.com/japertechnology/juxta-repo/blob/main/juxta-repo.jpg)

## Instructions

[**.github/juxta-repo.txt**](.github/juxta-repo.txt) contains the list of repositories to arrange, each on its own line using the format: `owner/repository` and when committed arrangements will be made.

[**.github/workflows/juxta-repo-arrange**](.github/workflows/juxta-repo-arrange.yml) clones the repositories listed in `.github/juxta-repo.txt` file into a fresh `repository/` directory. Each target repository appears as a subfolder holding a snapshot of its files with no Git history.
 
[**.github/workflows/juxta-repo-clear**](.github/workflows/juxta-repo-clear.yml) deletes the `repository/` directory.

To access private repos, store a GitHub token, [**fine-grained**](https://github.com/settings/personal-access-tokens) or [**classic**](https://github.com/settings/tokens), in a [**secret**](/settings/secrets/actions) named **JUXTA_REPO_PERMISSION**, with read access to those repos.

After forking you may [**.github/workflows/juxta-repo-cleanup**](.github/workflows/juxta-repo-cleanup.yml), this moves `README.md` to `HELP.md`, `SETTINGS.md` to `README.md`, deletes `LICENSE.md`, the logo and the `repository` directory.

## Demonstration

The repositories listed in [**.github/juxta-repo.txt**](.github/juxta-repo.txt) are currently arranged in the [**repository**](repository/).

##### [freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp) A nonprofit offering a comprehensive curriculum covering web development, data science, and more. It includes thousands of coding challenges, projects, and certifications.

##### [Build Your Own X](https://github.com/codecrafters-io/build-your-own-x) A curated list of tutorials for building your own technology like databases, operating systems, and more.

##### [Awesome](https://github.com/sindresorhus/awesome) A collaborative list of awesome lists, covering programming, technology, and many other topics.

##### [free-programming-books](https://github.com/EbookFoundation/free-programming-books) A massive collection of free programming books in over 30 languages, curated by the Free Ebook Foundation.

##### [Developer Roadmap](https://github.com/kamranahmedse/developer-roadmap) Visual roadmaps outlining the path to becoming a developer in various fields, including frontend, backend, and DevOps.

##### [Coding Interview University](https://github.com/jwasham/coding-interview-university) A self-study plan for software engineering interviews, covering computer science fundamentals, algorithms, and system design.

##### [System Design Primer](https://github.com/donnemartin/system-design-primer) A comprehensive guide to system design, including concepts, interview questions, and real-world examples.

##### [Awesome Python](https://github.com/vinta/awesome-python) A curated list of awesome Python frameworks, libraries, software, and resources.

## License of Included Repositories

The [repository](repository/) directory contains snapshots of external projects. Each subdirectory preserves the original project's license file. Please consult and adhere to those licenses before reusing or redistributing any contents.
