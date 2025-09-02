# [**juxta-repo**](https://github.com/japertechnology/juxta-repo)

[**Edit**](.github/juxta-repo.txt) the list, owner/repo, one repo per line.

[**Arrange**](.github/workflows/juxta-repo-arrange.yml) creates and populates the [**repository**](repository/) directory each week to refresh snapshots.

[**Clear**](.github/workflows/juxta-repo-clear.yml) deletes the [**repository**](repository/) directory.

[**Prune**](.github/workflows/juxta-repo-prune.yml) runs weekly to remove snapshots in [**repository**](repository/) older than the `SNAPSHOT_RETENTION_DAYS` threshold (default 30 days).

Private repo cloning requires a [**GitHub Personal Access Token**](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), [**fine-grained**](https://github.com/settings/personal-access-tokens) or [**classic**](https://github.com/settings/tokens), to be maintained in a [**Repo Secret**](https://github.com/japertechnology/juxta-repo/settings/secrets/actions) called **JUXTA_REPO_PERMISSION**.
