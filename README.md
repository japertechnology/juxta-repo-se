# Juxtarepose

It captures the latest GitHub snapshots of specified repositories, places them side‑by‑side, static and untouched, enabling AI-powered analysis and comparison without merging or preserving history.

## Quick Start

1. **Fork** this repository on GitHub, then **clone** it locally to your machine.
2. Generate a **GitHub token** with **read-only repository** access and save it under **`JUXTAREPOSE`** in your repository’s **Actions secrets**.
3. Open `.github/juxtarepose.txt`, and add each target repository on its own line using the format: `owner/repository`.
4. Trigger the [**juxtarepose-arrange**](.github/workflows/juxtarepose-arrange.yml) GitHub Workflow to fetch and arrange `.github/juxtarepose.txt` respoitory snapshots into the `repository/` directory.
5. Trigger the [**juxtarepose-clear**](.github/workflows/juxtarepose-clear.yml) GitHub Workflow to remove the `repository/` directory.
 
---

"JuxtaRepose" blends juxta‑ (Latin iuxta, “beside” or “near”) from which juxtapose (“to place side by side”) derives, with repose (from Latin reposāre, meaning “to rest”). Together, the name elegantly evokes code repositories resting side by side, untouched and ready for AI-powered comparison.

It perfectly encapsulates this tool’s ethos: fresh GitHub snapshots aligned in parallel repose, enabling focused analysis without merging or history overhead.
