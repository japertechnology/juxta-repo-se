"""Generate repos.json from local repository clones.

This simplified tool no longer interacts with organisation APIs. It scans the
``repos/`` directory for git repositories and records basic metadata.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
from typing import Dict, List

def build_repo_entry(path: str) -> Dict[str, str | None]:
    """Return repository details derived from the local clone."""
    name = os.path.basename(path)
    ssh_url = None
    default_branch = None

    try:
        ssh_url = (
            subprocess.check_output(
                ["git", "-C", path, "config", "--get", "remote.origin.url"],
                text=True,
            ).strip()
        )
    except subprocess.CalledProcessError:
        pass

    try:
        default_branch = (
            subprocess.check_output(
                ["git", "-C", path, "rev-parse", "--abbrev-ref", "HEAD"],
                text=True,
            ).strip()
        )
    except subprocess.CalledProcessError:
        pass

    return {
        "name": name,
        "ssh_url": ssh_url,
        "default_branch": default_branch,
        "latest_release": None,
    }


def collect_entries(base: str = "repos") -> List[Dict[str, str | None]]:
    """Gather repo entries from directories under ``base``."""
    entries: List[Dict[str, str | None]] = []
    if not os.path.isdir(base):
        return entries
    for entry in sorted(os.listdir(base)):
        path = os.path.join(base, entry)
        if os.path.isdir(path):
            entries.append(build_repo_entry(path))
    return entries


def write_repos_json(entries: List[Dict[str, str | None]], path: str = "repos.json") -> None:
    """Write repository metadata to ``repos.json``."""
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(entries, fh, indent=2)
        fh.write("\n")


def init_repos() -> None:
    """Initialise ``repos.json`` from existing clones."""
    write_repos_json(collect_entries())


def refresh_repos() -> None:
    """Refresh ``repos.json`` using local clones."""
    write_repos_json(collect_entries())


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync local repositories")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("init", help="Generate repos.json from local clones")
    subparsers.add_parser("refresh", help="Update repos.json from local clones")
    args = parser.parse_args()

    if args.command == "init":
        init_repos()
    elif args.command == "refresh":
        refresh_repos()


if __name__ == "__main__":
    main()
