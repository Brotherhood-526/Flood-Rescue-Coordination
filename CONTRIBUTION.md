# Contribution Guidelines

## General Guidelines

- Commit as you go, and try to keep your commits small and atomic.
- Commit early and commit often.
- Try to commit after you finish a feature or bug fix, don't commit broken code.

## Commit Messages

- Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) guidelines.
- Summary format:

```[type](scope): summary
optional body
```

- Suggested Types:
  - `feat`: A new feature, or an update to an existing feature
  - `fix`: A bug fix
  - `docs`: Only change docs
  - `chore`: Other general changes that don't change output
    (if you are unsure, use `chore`)

- Suggested Scopes (optional):
  - For Back-end: api, models, controllers, auth, db, etc.
  - For Front-end: components, pages, styles, etc.

- Examples:
  - `feat(api): add new route`
  - `fix(db): fix db connection`
  - `docs: create contribution guidelines`
  - `chore: rename contributing.md to CONTRIBUTION.md`
