# Juxtarepose

It captures the latest GitHub snapshots of specified repositories, places them side‑by‑side, static and untouched, enabling analysis and comparison without merging or preserving history.

## Quick Start

1. In your fork on GitHub, open the **Actions** tab.
2. Open [**.github/juxtarepose,txt**](.github/juxtarepose.txt), and add each target repository on its own line using the format: `owner/repository`.
3. Select either [**juxtarepose-arrange**](.github/workflows/juxtarepose-arrange.yml) or [**juxtarepose-clear**](.github/workflows/juxtarepose-clear.yml) in the sidebar and click **Run workflow**.
4. **juxtarepose-arrange** clones the repositories listed in `.github/juxtarepose.txt` into a fresh `repository/` directory. Each target repository appears as a subfolder holding a snapshot of its files with no Git history.
5. **juxtarepose-clear** simply deletes the `repository/` directory.

## Overview

By taking pristine repository snapshots and placing them in static juxtaposition, you can decouple analysis from any live development or history manipulation. This empowers teams to perform fully isolated diffs and reviews, run secure scans, establish performance baselines, enforce license policies, detect anomalies, create teaching demos, and even generate clean datasets for machine-learning—all without touching or altering the original repos.

### 1. Merge-Free Side-by-Side Code Review & Diffing

Get true side-by-side diffs of entire repositories—no branch merges, no history noise—so reviewers can focus purely on code differences. Tools like `git difftool` or web-based diff viewers render two snapshots in parallel for pinpoint clarity.

### 2. Static Code Analysis on Pristine Snapshots

Feed untouched snapshots into static analyzers (e.g., GitHub’s CodeQL) to detect bugs, security flaws, and coding-standard violations without any interference from uncommitted changes.

### 3. Focused Security & Incremental Scans

Run targeted SAST (e.g., CodeQL or third-party tools via SARIF) on specific snapshots—minimizing CI load while maintaining robust vulnerability coverage across a consolidated codebase.

### 4. Performance Benchmarking & Profiling

Use each snapshot as a stable performance baseline for profiling and benchmarking, isolating regressions in CPU, memory, or I/O without the variability of a changing code history.

### 5. License Compliance & SBOM Generation

Generate Software Bills of Materials (SBOMs) from static snapshots to inventory all dependencies and enforce open-source license policies, meeting both security-audit and regulatory requirements.

### 6. Audit Trails & Anomaly Detection

Compare successive snapshots to detect unauthorized or malicious changes—supporting continuous audit logging, CI/CD guardrails, and real-time alerting in regulated environments.

### 7. Educational Demonstrations & Documentation

Create side-by-side comparisons for tutorials, code reviews, or onboarding guides—visually illustrating refactoring steps, design pattern variations, or language-feature contrasts.

### 8. Machine-Learning Dataset Generation

Produce high-fidelity, history-clean datasets (e.g., CodeSearchNet) from snapshots to train models for code retrieval, summarization, or vulnerability prediction—ensuring no extraneous metadata skews your data.

### 9. Change-Impact Analysis & Triage

Quickly assess the scope of changes by isolating diffs between any two static points in time—streamlining impact analysis, QA prioritization, and release-planning decisions

## Etymology

"JuxtaRepose" blends juxta‑ (Latin iuxta, “beside” or “near”) from which juxtapose (“to place side by side”) derives, with repose (from Latin reposāre, meaning “to rest”). Together, the name elegantly evokes code repositories resting side by side, untouched and ready for AI-powered comparison.

It perfectly encapsulates this tool’s ethos: fresh GitHub snapshots aligned in parallel repose, enabling focused analysis without merging or history overhead.
