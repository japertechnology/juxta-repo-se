# juxta-repo

### Creates repo snapshots from a text list.

<br>

[**List Repositories**](.github/juxta-repo.txt) to clone, owner/repo, one repo per line.

<br>

[**Run Arrange**](.github/workflows/juxta-repo-arrange.yml) to clone the repositories listed into the [**repository**](repository/) directory.

[**Run Clear**](.github/workflows/juxta-repo-clear.yml) to delete the [**repository/**](repository) directory.

<br>

##### Private repos cloning requires a GitHub Personal Access Token, either [**Fine-grained**](https://github.com/settings/personal-access-tokens) or [**Classic**](https://github.com/settings/tokens), and maintain a [**Repo Secret**](https://github.com/japertechnology/juxta-repo/settings/secrets/actions) called **JUXTA_REPO_PERMISSION**.
