# Baseline Test Results

Date: 2026-09-15
Commit under test: `28739d3` (`Merge pull request #25 from logicbyroshan/main`)

## Commands

```text
C:/Users/roshan/AppData/Local/Programs/Python/Python311/python.exe manage.py check
C:/Users/roshan/AppData/Local/Programs/Python/Python311/python.exe manage.py test
```

## Results

- `manage.py check`: passed; Django reported no issues and no silenced checks.
- `manage.py test`: exited successfully, but discovered and ran `0` tests.
- The four app test modules (`accounts/tests.py`, `community/tests.py`, `feed/tests.py`, and `riseapp/tests.py`) currently contain only the `TestCase` import and no test cases.

## Baseline Risks

- There is no meaningful automated behavior coverage before migration.
- Runtime verification must therefore include focused API tests, frontend tests, and end-to-end workflows before any legacy code is removed.
- The clone contains a Windows case-insensitive filename collision between `templates/Home.html` and `templates/home.html`; only `templates/home.html` is present in the working tree.
- `config/settings.py` contains development-only settings (`DEBUG = True`, empty `ALLOWED_HOSTS`, and a committed development secret key) that must not be used for production.
