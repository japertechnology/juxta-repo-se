import sys
from pathlib import Path

# Ensure module import from repository/awesome-python directory
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import sort


def test_main_handles_file_starting_with_list_item(tmp_path, monkeypatch):
    readme = tmp_path / "README.md"
    readme.write_text("* [B Item](https://example.com/b)\n* [a Item](https://example.com/a)\n")

    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(sort, "sort_blocks", lambda: None)

    sort.main()

    assert readme.read_text() == "* [a Item](https://example.com/a)\n* [B Item](https://example.com/b)\n"
