# JAPER GitHub Sync

This github repository should:

1. references every other repo in the GitHub organisation, 
2. keeps those references continuously in‑sync, 
3. publishes shared libraries to GitHub Packages,
4. indexes the entire codebase fleet with Sourcegraph so developers *and* an AI assistant (Cody) can search or chat across projects, and 
5. automates fleet‑wide chores such as dependency bumps and security scans. The end‑state is a single repo where an agent—or any engineer—can discover, query, and orchestrate hundreds of independent repositories as if they were one. ([Git][1], [GitHub Docs][2], [sourcegraph.com][3], [sourcegraph.com][4])

---

## 1  Functional Requirements

### 1.1 Repository Aggregation

1. **Reference strategy** – Add every downstream repo to the meta‑repo as *Git submodules* (shallow‑cloned) for storage efficiency ([Git][1]).
2. **Manifest** – Generate `repos.json` containing name, SSH URL, default branch, and last release tag for each repo; update it manually via the GitHub API as needed.
3. **Alternative path** – Provide a flag to switch to *Git Subtree* copy‑based inclusion for teams that prefer single‑checkout workflows ([atlassian.com][5]).

### 1.2 Continuous Sync & CI/CD

1. **Reusable GitHub Action** – Ship a workflow template (`.github/workflows/org-ci.yml`) that every repo can `uses:` to share lint, test, & publish steps ([GitHub Docs][2]).
2. **Dependency hygiene** – Install **Renovate** as an org app; auto‑open PRs for outdated packages in every repo ([GitHub][6]).
3. **Security** – Enable Code QL and Dependabot across the fleet; expose badge status in meta‑repo README.

### 1.3 Package Distribution

1. Publish language artefacts (npm, PyPI, Maven, Docker) to **GitHub Packages** so any repo can consume versioned builds instead of source pointers ([GitHub Docs][7]).
2. Enforce semantic‑version tags (`major.minor.patch`) on every release.

### 1.4 Fleet Automation

1. **Bulk changes** – Bundle **Octoherd** scripts (TypeScript) for org‑wide sweeps—e.g., insert LICENSE, update PR templates, or add CI badge ([GitHub][8]).
2. **Event handling** – Optional Probot app to enforce branch‑naming rules or block unreviewed pushes.

### 1.5 Indexing & AI Query Layer

1. Deploy **Sourcegraph** (cloud or self‑host) pointed at the org to enable regex, structural, and symbol search across private repos ([sourcegraph.com][3]).
2. Enable **Cody** AI assistant with multi‑repo context so users can chat or generate code that spans repositories ([sourcegraph.com][4], [sourcegraph.com][9]).

---

## 2  Non‑Functional Requirements

| Area                | Requirement                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Performance**     | Meta‑repo clone ≤ 5 minutes with submodules shallow‑cloned (`--depth 1`).                                                  |
| **Scalability**     | Must support ≥ 500 child repos without CI timeout (use Bazel remote cache or Nx affected‑graph). ([Earthly][10], [Nx][11]) |
| **Security**        | Honour existing repo ACLs; AI index must respect GitHub permissions when serving code to Cody or search users.             |
| **Maintainability** | All automation scripts documented under `/tooling`; unit‑tested via the reusable workflow.                                 |

---

## 3  Technical Constraints & Preferences

1. **Build orchestration** – Prefer **Bazel** for poly‑language monorepo‑style builds; fallback to **Nx** for JS/TS‑heavy stacks ([Earthly][10], [Nx][11]).
2. **Language support** – Initial pipelines must cover Node (v18 LTS) and Python (3.12); design for pluggable runners.
3. **Hosting** – All infra may run in GitHub‑hosted runners; if self‑hosted runners are needed (e.g., for Bazel cache), provide Terraform/IaC scripts.

---

## 4  Deliverables

| #  | Artifact                                                            | Acceptance test                                                                                          |
| -- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| D1 | `meta-repo` Git repository with submodule map & manual sync action | Clone meta‑repo; verify submodule count equals GitHub API repo count ±1.                                 |
| D2 | Reusable CI workflow template                                       | Create sample repo; CI passes with lint & tests executed.                                                |
| D3 | Renovate & security posture                                         | PRs auto‑open on outdated deps; Code QL runs show “0 critical” on default branches.                      |
| D4 | Octoherd toolkit                                                    | Run `node tooling/add-license.js`; observe commit to ≥ 3 test repos.                                     |
| D5 | Sourcegraph + Cody integration guide                                | Search “def main” across fleet returns results in <1 s; Cody answers multi‑repo question with citations. |

---

## 5  Milestones & Timeline (suggested)

| Week | Milestone                                                         |
| ---- | ----------------------------------------------------------------- |
| 1    | Bootstrap meta‑repo; add all submodules; commit `repos.json`.     |
| 2    | Implement manual sync workflow; smoke‑test shallow clones.       |
| 3    | Ship reusable CI workflow; migrate three pilot repos.             |
| 4    | Stand up Sourcegraph; index pilot repos; enable Cody.             |
| 5    | Install Renovate; validate automated PRs.                         |
| 6    | Draft Octoherd scripts; run first fleet sweep.                    |
| 7‑8  | Harden security scans, Bazel/Nx cache, and produce hand‑off docs. |

---

## 6  Acceptance Criteria

* **Single‑command setup**: `gh repo clone <org>/meta --recurse-submodules --depth 1` works without manual steps.
* **Cross‑repo import**: Package published from repo A installs in repo B via GitHub Packages and passes CI.
* **Search latency**: Sourcegraph returns a multi‑repo symbol search in under 1 second for 95th percentile queries.
* **AI competency**: Cody answers “Find where `UserBillingService` is instantiated” by citing at least two different repos.
* **Maintenance**: Running `npm test` in `/tooling` covers > 80 % script logic.

---

## 7  Security & Compliance

* No plaintext secrets in repo history—enforce secret‑scan pre‑commit hook.
* Follow GitHub’s supply‑chain hardening guidelines (sigstore, provenance) for all published packages ([WIRED][12]).
* All logs and artefacts retained 30 days, encrypted at rest.

---

## 8  Reference Links

* Git Submodule docs ([Git][1])
* Git Subtree tutorial ([atlassian.com][5])
* Reusable workflows docs ([GitHub Docs][2])
* Renovate app ([GitHub][6])
* Octoherd project ([GitHub][8])
* Sourcegraph code‑search cheat sheet ([sourcegraph.com][3])
* GitHub Packages npm guide ([GitHub Docs][7])
* Bazel monorepo overview ([Earthly][10])
* Nx monorepo vs polyrepo ([Nx][11])
* Cody multi‑repo context docs ([sourcegraph.com][4])
* Agentic context gathering release ([sourcegraph.com][9])

---

[1]: https://git-scm.com/docs/git-submodule?utm_source=chatgpt.com "Git - git-submodule Documentation"
[2]: https://docs.github.com/en/actions/sharing-automations/reusing-workflows?utm_source=chatgpt.com "Reuse workflows - GitHub Docs"
[3]: https://sourcegraph.com/blog/how-to-search-cheat-sheet?utm_source=chatgpt.com "How to search code with Sourcegraph: a cheat sheet"
[4]: https://sourcegraph.com/docs/cody/core-concepts/context?utm_source=chatgpt.com "Cody Context - Sourcegraph docs"
[5]: https://www.atlassian.com/git/tutorials/git-subtree?utm_source=chatgpt.com "Git Subtree: Alternative to Git Submodule | Atlassian Git Tutorial"
[6]: https://github.com/apps/renovate?utm_source=chatgpt.com "GitHub Apps - Renovate · GitHub"
[7]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry?utm_source=chatgpt.com "Working with the npm registry - GitHub Docs"
[8]: https://github.com/octoherd/octoherd?utm_source=chatgpt.com "GitHub - octoherd/octoherd: Manage multiple repository updates all at once."
[9]: https://sourcegraph.com/changelog/agentic-context-gathering-available-in-cody?utm_source=chatgpt.com "Agentic context gathering available in Cody - Sourcegraph"
[10]: https://earthly.dev/blog/monorepo-with-bazel/?utm_source=chatgpt.com "Building a Monorepo with Bazel - Earthly Blog"
[11]: https://nx.dev/concepts/decisions/overview?utm_source=chatgpt.com "Monorepo or Polyrepo - Nx"
[12]: https://www.wired.com/story/github-code-signing-sigstore?utm_source=chatgpt.com "GitHub Moves to Guard Open Source Against Supply Chain Attacks"
