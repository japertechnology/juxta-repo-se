"""
Utility script for synchronising all repositories in a GitHub organisation.

The tool can fetch repositories using one of three methods: a simple "shadow"
clone (default), a git submodule or a git subtree. It produces a `repos.json`
manifest describing the state of the organisation.

Typical usage:
    GITHUB_TOKEN=<token> python tooling/sync_repos.py init --org my-org
"""
import argparse
import json
import os
import subprocess
from typing import List, Dict, Optional

from urllib.error import HTTPError
from urllib.request import Request, urlopen

# Base URL for all GitHub REST API calls.
API_BASE = "https://api.github.com"

class SimpleResponse:
    """Minimal response object mimicking ``requests.Response``."""

    def __init__(self, status_code: int, data: dict):
        self.status_code = status_code
        self._data = data

    def json(self) -> dict:
        return self._data

    def raise_for_status(self) -> None:
        if not (200 <= self.status_code < 300):
            raise HTTPError(None, self.status_code, "HTTP error", None, None)


def github_request(url: str, token: str, timeout: int = 10) -> SimpleResponse:
    """Perform an authenticated GET request to the GitHub API."""
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
    }
    req = Request(url, headers=headers)
    try:
        with urlopen(req, timeout=timeout) as resp:
            status = resp.status
            data = json.loads(resp.read().decode())
    except HTTPError as e:
        status = e.code
        body = e.read().decode() if e.fp else ""
        data = json.loads(body) if body else {}
    return SimpleResponse(status, data)

def get_repos(org: str, token: str) -> List[Dict]:
    """Return a list of all repositories in the organisation."""
    repos: List[Dict] = []
    page = 1
    while True:
        # GitHub paginates results; loop until an empty page is returned
        resp = github_request(
            f"{API_BASE}/orgs/{org}/repos?per_page=100&page={page}", token
        )
        if resp.status_code == 404:
            raise ValueError(
                f"Organization '{org}' not found or you do not have access"
            )
        resp.raise_for_status()
        data = resp.json()
        if not data:
            break
        repos.extend(data)
        page += 1
    return repos

def get_last_release(org: str, repo: str, token: str) -> Optional[str]:
    """Return the tag name of the latest release or ``None`` if none exist."""
    resp = github_request(
        f"{API_BASE}/repos/{org}/{repo}/releases/latest", token
    )
    if resp.status_code == 200:
        return resp.json().get("tag_name")
    return None

def build_repo_entry(repo: Dict, org: str, token: str) -> Dict:
    """Construct the dictionary entry written to ``repos.json``."""
    return {
        "name": repo["name"],
        "ssh_url": repo["ssh_url"],
        "default_branch": repo["default_branch"],
        "latest_release": get_last_release(org, repo["name"], token),
    }

def write_repos_json(entries: List[Dict], path: str = "repos.json") -> None:
    """Write repository metadata to ``repos.json`` with pretty formatting."""
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(entries, fh, indent=2)
        fh.write("\n")

def add_submodule(repo: Dict, path: str) -> None:
    """Add the repository as a git submodule with depth=1."""
    subprocess.run(
        ["git", "submodule", "add", "--depth", "1", repo["ssh_url"], path],
        check=True,
    )

def add_shadow_clone(repo: Dict, path: str) -> None:
    """Clone the repository with depth=1."""
    subprocess.run(
        ["git", "clone", "--depth", "1", repo["ssh_url"], path],
        check=True,
    )

def add_subtree(repo: Dict, path: str) -> None:
    """Add the repository using git subtree at the given path."""
    subprocess.run(
        [
            "git",
            "subtree",
            "add",
            "--prefix",
            path,
            repo["ssh_url"],
            repo["default_branch"],
            "--squash",
        ],
        check=True,
    )

def init_repos(org: str, token: str, method: str) -> None:
    """Initialise local references to all organisation repositories."""
    repos = get_repos(org, token)
    entries: List[Dict] = []
    os.makedirs("repos", exist_ok=True)
    for repo in repos:
        path = os.path.join("repos", repo["name"])
        # Only create the repo if the path doesn't already exist
        if not os.path.exists(path):
            if method == "subtree":
                add_subtree(repo, path)
            elif method == "submodule":
                add_submodule(repo, path)
            else:  # shadow clone
                add_shadow_clone(repo, path)
        entries.append(build_repo_entry(repo, org, token))
    # Write out the manifest after processing all repositories
    write_repos_json(entries)

def refresh_repos(org: str, token: str) -> None:
    """Update ``repos.json`` without touching any checked out repositories."""
    repos = get_repos(org, token)
    entries = [build_repo_entry(r, org, token) for r in repos]
    write_repos_json(entries)

def main() -> None:
    """Entry point for the CLI interface."""
    parser = argparse.ArgumentParser(
        description="Sync organization repositories"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_p = subparsers.add_parser(
        "init", help="Add repositories using the selected method"
    )
    init_p.add_argument("--org", required=True, help="GitHub organization")
    init_p.add_argument(
        "--method",
        choices=["shadow", "submodule", "subtree"],
        default="shadow",
        help="Clone method to use",
    )

    refresh_p = subparsers.add_parser("refresh", help="Refresh repos.json")
    refresh_p.add_argument("--org", required=True, help="GitHub organization")

    args = parser.parse_args()
    token = os.environ.get("GITHUB_TOKEN")  # personal access token or org token
    if not token:
        # Stop early if authentication credentials are missing
        raise SystemExit("GITHUB_TOKEN environment variable required")

    if args.command == "init":
        init_repos(args.org, token, args.method)
    elif args.command == "refresh":
        refresh_repos(args.org, token)

if __name__ == "__main__":
    # When executed directly, run the command line interface
    main()
