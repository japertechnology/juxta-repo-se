# juxta-repo

Creates repo snapshots from a text list.

<br>

### Edit the list of GitHub Repositories

- [**Edit**](.github/juxta-repo.txt) the list or repositories to arrange.

<br>

### Execute a GitHub Actions

- [**Arrange**](.github/workflows/juxta-repo-arrange.yml) clones the repositories listed into the [**repository/**](repository/) directory.
 
- [**Clear**](.github/workflows/juxta-repo-clear.yml) deletes the [**repository/**](repository/) directory.

<br>

### Create a GitHub Personal Access Token

- Create a token either [**Fine-grained**](https://github.com/settings/personal-access-tokens) or [**Classic**](https://github.com/settings/tokens).

- Maintain a [**Repo Secret**](https://github.com/japertechnology/juxta-repo/settings/secrets/actions) called **JUXTA_REPO_PERMISSION** that contains a token.
