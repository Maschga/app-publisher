# EnergyHub21 App Publisher

Builds a branded Android App Bundle from a pinned [evcc app](https://github.com/evcc-io/app) revision. GitHub Actions queues the build on Expo EAS; it does not publish to Google Play.

## Setup

1. Push this repository to a private GitHub repo.
2. In the Expo organization that owns the project, open **Access tokens → Create robot**. Give the robot the **Developer** role and create an access token for it. In GitHub, save that token under **Settings → Secrets and variables → Actions → New repository secret** as `EXPO_TOKEN`.
3. Configure Android signing credentials in EAS (use the existing upload key for an app already in Play).
4. Run **Actions → Android release build → Run workflow** on `main`. Follow the job log for the EAS build link and `.aab`.

For the first test, the workflow pins the commit from [evcc app PR #366](https://github.com/evcc-io/app/pull/366). No `EVCC_APP_REF` variable is needed. Once an upstream release includes the white-label changes, replace the pinned ref in `.github/workflows/build.yml` with that release's commit SHA.

Keep `build.production.node` in `eas.json` aligned with `.node-version` at the pinned evcc app revision so GitHub Actions and the EAS worker use the same Node.js and bundled npm versions.

Branding, Expo/EAS project details, and Android package name are in `eas.json`; artwork is in `custom-assets/`. Update these when configuring another app. iOS builds are disabled; the Apple Team ID in `eas.json` is only needed if enabling iOS.

MIT applies to the publisher configuration and documentation, not the EnergyHub21 artwork. Roboto fonts retain their [own license](custom-assets/fonts/LICENSE).
