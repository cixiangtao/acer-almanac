# Releasing

English | [简体中文](RELEASING.zh-CN.md)

The workspace has three delivery surfaces. They share source and quality gates, but they do not share one public version.

## npm package

- Version source: root `package.json` and `packages/core/package.json`
- Strategy: Semantic Versioning
- Source branch: clean, protected `master`
- Tag: `v<version>` for the npm package only
- Changelog: root `CHANGELOG.md`

Release Please keeps one release PR current from Conventional Commit history. Maintainers review its constrained diff, synchronized versions, changelog, and required CI. Merging that PR triggers the Actions-owned path that reruns quality gates, packs the package, creates the tag, publishes through npm trusted publishing, and creates the GitHub Release. Do not bump versions, create release tags, or run `npm publish` locally.

The repository uses `RELEASE_APP_CLIENT_ID` and `RELEASE_APP_PRIVATE_KEY` for a GitHub App with Contents, Issues, and Pull requests read/write access so release PR checks run without manual workflow approval.

After publication, verify the registry independently:

```bash
npm view acer-almanac version dist-tags --json
```

Also install the public tarball in a clean temporary directory and compare npm, Git tag, and GitHub Release state.

## Chrome extension

The version is stored in `apps/chrome-extension/public/manifest.json` and `apps/chrome-extension/package.json`; both must change together. Create `release/chrome-v<version>` from the latest `master`, update only the two version files and changelog, then merge its reviewed pull request. The publishing workflow verifies the merge source and constrained diff before checking, testing, building, packaging, and submitting to the Chrome Web Store.

Manual tags, workflow dispatch, and local uploads are not release entry points. Treat `PENDING_REVIEW`, `STAGED`, and `PUBLISHED` as different states and verify the store status after submission.

## GitHub Pages

Pages has no independent semantic version. Each push to `master` runs the full gate and deploys `apps/web/dist`. Verify the workflow, homepage, assets, and privacy policy independently.

## Recovery

- After an npm failure, inspect the worktree, index, local and remote tags, registry, and release state before retrying.
- After a Chrome submission failure, read the store state before changing or resubmitting a version.
- A Pages failure does not roll back npm or Chrome delivery; report each surface separately.
