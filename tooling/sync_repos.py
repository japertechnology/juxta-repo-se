import argparse
import json
import os
import subprocess
from typing import List, Dict, Optional

import requests

API_BASE = "https://api.github.com"

def github_request(url: str, token: str):
    headers = {"Authorization": f"token {token}", "Accept": "application/vnd.github+json"}
    return requests.get(url, headers=headers)

def get_repos(org: str, token: str) -> List[Dict]:
    repos = []
    page = 1
    while True:
        resp = github_request(f"{API_BASE}/orgs/{org}/repos?per_page=100&page={page}", token)
        resp.raise_for_status()
        data = resp.json()
        if not data:
            break
        repos.extend(data)
        page += 1
    return repos

def get_last_release(org: str, repo: str, token: str) -> Optional[str]:
    resp = github_request(f"{API_BASE}/repos/{org}/{repo}/releases/latest", token)
    if resp.status_code == 200:
        return resp.json().get("tag_name")
    return None

def build_repo_entry(repo: Dict, org: str, token: str) -> Dict:
    return {
        "name": repo["name"],
        "ssh_url": repo["ssh_url"],
        "default_branch": repo["default_branch"],
        "latest_release": get_last_release(org, repo["name"], token),
    }

def write_repos_json(entries: List[Dict], path: str = "repos.json"):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(entries, fh, indent=2)
        fh.write("\n")

def add_submodule(repo: Dict, path: str):
    subprocess.run(["git", "submodule", "add", "--depth", "1", repo["ssh_url"], path], check=True)

def add_subtree(repo: Dict, path: str):
    subprocess.run(["git", "subtree", "add", "--prefix", path, repo["ssh_url"], repo["default_branch"], "--squash"], check=True)

def init_repos(org: str, token: str, use_subtree: bool):
    repos = get_repos(org, token)
    entries = []
    os.makedirs("repos", exist_ok=True)
    for repo in repos:
        path = os.path.join("repos", repo["name"])
        if not os.path.exists(path):
            if use_subtree:
                add_subtree(repo, path)
            else:
                add_submodule(repo, path)
        entries.append(build_repo_entry(repo, org, token))
    write_repos_json(entries)

def refresh_repos(org: str, token: str):
    repos = get_repos(org, token)
    entries = [build_repo_entry(r, org, token) for r in repos]
    write_repos_json(entries)

def main():
    parser = argparse.ArgumentParser(description="Sync organization repositories")
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_p = subparsers.add_parser("init", help="Add repositories as submodules or subtrees")
    init_p.add_argument("--org", required=True, help="GitHub organization")
    init_p.add_argument("--subtree", action="store_true", help="Use git subtree instead of submodules")

    refresh_p = subparsers.add_parser("refresh", help="Refresh repos.json")
    refresh_p.add_argument("--org", required=True, help="GitHub organization")

    args = parser.parse_args()
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise SystemExit("GITHUB_TOKEN environment variable required")

    if args.command == "init":
        init_repos(args.org, token, args.subtree)
    elif args.command == "refresh":
        refresh_repos(args.org, token)

if __name__ == "__main__":
    main()
