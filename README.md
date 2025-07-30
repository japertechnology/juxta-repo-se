# juxtarepose

"JuxtaRepose" blends juxta‑ (Latin iuxta, “beside” or “near”) from which juxtapose (“to place side by side”) derives, with repose (from Latin reposāre, meaning “to rest”). Together, the name elegantly evokes code repositories resting side by side, untouched and ready for AI-powered comparison.

It perfectly encapsulates this tool’s ethos: fresh GitHub snapshots aligned in parallel repose, enabling focused analysis without merging or history overhead.

## Quick Start

1. **Fork** this repository on GitHub, then **clone** it locally to your machine.
2. Generate a **GitHub token** with **read-only repository** access and save it under **`JUXTAREPOSE`** in your repository’s **Actions secrets**.
3. Open `.GitHub/JuxtaRepose.txt`, and add each target repository on its own line using the format: `owner/repository`.
4. Trigger the [**JuxtaRepose** workflow](.github/workflows/JuxtaRepose.yml) to fetch and arrange those snapshots into the `repository/` directory.
5. Retrigger to refresh.
 
