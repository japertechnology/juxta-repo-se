# Juxtarepose

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![AI](https://img.shields.io/badge/Assisted-Development-2b2bff?logo=openai&logoColor=white) 

Captures the latest GitHub snapshots of specified repositories, places them side‑by‑side, static and untouched, enabling analysis and comparison without merging or preserving history.

---

## Quick Start

1. In your fork on GitHub, open the **Actions** tab.
2. Open [**.github/juxtarepose,txt**](.github/juxtarepose.txt), and add each target repository on its own line using the format: `owner/repository`.
3. Select either [**juxtarepose-arrange**](.github/workflows/juxtarepose-arrange.yml) or [**juxtarepose-clear**](.github/workflows/juxtarepose-clear.yml) in the sidebar and click **Run workflow**.
4. **juxtarepose-arrange** clones the repositories listed in `.github/juxtarepose.txt` into a fresh `repository/` directory. Each target repository appears as a subfolder holding a snapshot of its files with no Git history.
5. **juxtarepose-clear** simply deletes the `repository/` directory.

## Benefits

* **Merge-Free Side-by-Side Diffing**
  Instantly compare complete repo snapshots without polluting history or performing merges.

* **Pristine Static Analysis**
  Run linters, security scanners, and code-quality tools on untouched codebases to catch issues early.

* **Reliable Performance Baselines**
  Benchmark and profile against stable snapshots, isolating regressions from ongoing development noise.

* **Automated License Compliance & SBOMs**
  Generate accurate bills of materials and enforce open-source license rules without altering code.

* **Immutable Audit Trails**
  Track and compare successive snapshots for forensic investigations, anomaly detection, and compliance reporting.

* **AI-Driven Cross-Repo Synthesis**
  
  • **Dependency Graph Mapping:** Auto-discover function calls across repos to identify integration points.
  
  • **Context Unification:** Symlinked structures present a coherent codebase to large-language models.
  
  • **Semantic Indexing & Retrieval:** Surface relevant patterns and API usages for AI assistants.
  
  • **Multi-Agent Pipelines & Refactoring:** Orchestrate specialized agents to generate adapters and synthesize new cross-repo functions without manual merging.

---

## Etymology

"JuxtaRepose" blends juxta‑ (Latin iuxta, “beside” or “near”) from which juxtapose (“to place side by side”) derives, with repose (from Latin reposāre, meaning “to rest”). Together, the name elegantly evokes code repositories resting side by side, untouched and ready for AI-powered comparison.

It perfectly encapsulates this tool’s ethos: fresh GitHub snapshots aligned in parallel repose, enabling focused analysis without merging or history overhead.
