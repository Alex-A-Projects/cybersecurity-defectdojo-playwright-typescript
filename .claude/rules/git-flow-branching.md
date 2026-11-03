# GitHub Flow & Branch Naming Convention Rule

**Version:** 1.0
**Last Updated:** October 2026

---

## 1. Branching Strategy

This project follows **GitHub Flow**: simple, optimised for CI/CD.

## 2. Permanent branch

| Branch    | Purpose                            | Usage |
|-----------|------------------------------------|-------|
| `main`    | Stable test framework              | Team integration & CI/CD |

## 3. Branch types

| Type        | Purpose                                     |
|-------------|---------------------------------------------|
| `feat/`     | New feature or test coverage additions      |
| `fix/`      | Bug fixes (functional or test-related)      |
| `hotfix/`   | Urgent fixes                                |
| `refactor/` | Restructuring without behaviour change      |
| `chore/`    | Maintenance, dependencies, tooling, configs |
| `docs/`     | Documentation updates                       |
| `test/`     | Test-only changes (specs, test fixes)       |

## 4. Branch naming

```
<type>/DD-<issue-id>-<kebab-case-description>
```

Examples:

```
feat/dd-1234-add-finding-filters
fix/dd-9999-login-timeout
chore/dd-2222-update-playwright-config
docs/dd-3333-update-test-framework-guide
test/dd-4444-add-finding-regression-tests
```

## 5. Rules

1. Always lowercase
2. Use kebab-case only
3. Include issue ID when available (`DD-1234`)
4. One logical change per branch
5. No personal names or `wip`/`temp` branches

## 6. Recommended pre-push hook

```bash
#!/usr/bin/env bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
[ "$BRANCH" = "main" ] && exit 0
if ! echo "$BRANCH" | grep -Eq '^(feat|fix|hotfix|refactor|chore|docs|test)/DD-[0-9]+-[a-z0-9]+(-[a-z0-9]+)*$|^[a-z]+/DD-[0-9]+-[a-z0-9-]+$'; then
  echo "❌ Invalid branch name: $BRANCH"
  echo "✔ Format: <type>/DD-<id>-<description>"
  exit 1
fi
```

Not installed by default — this rule documents convention only.

## 7. Merge flow

1. Create PR → `main`
2. CI passes
3. Code review approval
4. Squash or rebase merge
5. Delete branch after merge
6. `main` stays stable

## 8. Hotfix flow

```bash
git checkout -b hotfix/DD-9999-critical main
# fix, test, commit → PR directly to main
```
