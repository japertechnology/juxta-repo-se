# juxta-repo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![AI](https://img.shields.io/badge/Assisted-Development-2b2bff?logo=openai&logoColor=white) 

Captures the latest GitHub snapshots of [**specified**](.github/juxta-repo.txt) repositories, places them [**side-by-side**](repository/), static and untouched, enabling analysis and comparison without merging or preserving history.

![https://github.com/japertechnology/juxta-repo/blob/main/juxta-repo.jpg](https://github.com/japertechnology/juxta-repo/blob/main/juxta-repo.jpg)

## Instructions

[**.github/juxta-repo,txt**](.github/juxta-repo.txt) contains the list of repositories to arrange, each on its own line using the format: `owner/repository` and when committed arrangements will be made.

[**.github/workflows/juxta-repo-arrange**](.github/workflows/juxta-repo-arrange.yml) clones the repositories listed in `.github/juxta-repo.txt` file into a fresh `repository/` directory. Each target repository appears as a subfolder holding a snapshot of its files with no Git history.
 
[**.github/workflows/juxta-repo-clear**](.github/workflows/juxta-repo-clear.yml) deletes the `repository/` directory.

To access private repos, store a GitHub token, [**fine-grained**](https://github.com/settings/personal-access-tokens) or [**classic**](https://github.com/settings/tokens), in a [**secret**](/settings/secrets/actions) named **JUXTA_REPO_PERMISSION**, with read access to those repos.

## Demonstration

As a **demonstration** this juxta‑repo has arranged the [**10 top educational GitHub repositories**](.github/juxta-repo.txt) into the [**repository**](repository/) for direct comparison and in-depth analysis across coding, system design, algorithms, and web‑dev learning paths.

##### [freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp) A nonprofit offering a comprehensive curriculum covering web development, data science, and more. It includes thousands of coding challenges, projects, and certifications.

##### [free-programming-books](https://github.com/EbookFoundation/free-programming-books) A massive collection of free programming books in over 30 languages, curated by the Free Ebook Foundation. It covers a wide range of programming topics and languages.

##### [Coding Interview University](https://github.com/jwasham/coding-interview-university) A self-study plan for software engineering interviews, covering computer science fundamentals, algorithms, and system design.

##### [Developer Roadmap](https://github.com/kamranahmedse/developer-roadmap) Visual roadmaps outlining the path to becoming a developer in various fields, including frontend, backend, and DevOps.

##### [System Design Primer](https://github.com/donnemartin/system-design-primer) A comprehensive guide to system design, including concepts, interview questions, and real-world examples.

##### [The Algorithms](https://github.com/TheAlgorithms/Python) A collection of algorithms implemented in Python, covering topics from basic to advanced levels. It's a great resource for learning and practicing algorithms.

##### [Awesome Learning Resources](https://github.com/lauragift21/awesome-learning-resources) A curated list of learning resources, including tutorials, courses, and books, across various programming languages and topics.

##### [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS) An in-depth series of books on JavaScript, exploring the language's core mechanisms and concepts.

##### [Public APIs](https://github.com/public-apis/public-apis) A collective list of free APIs for development across various domains, including weather, sports, and data.

##### [Exercism](https://github.com/exercism) An open-source platform offering coding exercises and mentorship in over 70 programming languages. It provides a hands-on approach to learning.
