# EnergyHub21 App Publisher

Builds a branded Android App Bundle from a pinned [evcc companion app](https://github.com/evcc-io/app) revision. `branding.env` and `custom-assets/` hold the build-time overrides. Preparation applies them to a disposable `app/` checkout and writes an EAS build profile so the Expo worker receives the same values as GitHub Actions.

## Upload to GitHub

Create an empty **private** repository named `Maschga/app-publisher` at <https://github.com/new>. Do not initialize it with a README or license. From Git Bash:

```bash
cd /c/Users/delph/Documents/Repositories/app-publisher
git add .github .gitignore LICENSE README.md branding.env custom-assets scripts
git diff --cached --stat
git commit -m "Initial EnergyHub21 publisher"
git remote add origin https://github.com/Maschga/app-publisher.git
git push -u origin main
```

## Set up and run the build

1. Create an EAS project with slug `energyhub21` under your own Expo account or organization. Add its account/organization slug as `EXPO_OWNER` and its project UUID as `EXPO_PROJECT_ID` under GitHub **Settings → Secrets and variables → Actions → Variables**.
2. Configure remote Android signing credentials in EAS for `io.energyhub21.android`. For an existing Play Store app, use its existing upload key. Run the first interactive build locally so EAS can prompt for any missing setup:

   ```bash
   git clone https://github.com/evcc-io/app.git app
   git -C app checkout dd95b67c4fda0e33a79ff414d08dffd5c5c0fe29
   export EXPO_OWNER=your-expo-account
   export EXPO_PROJECT_ID=your-eas-project-uuid
   node scripts/prepare.mjs
   cd app
   npm ci
   npx --yes eas-cli@27.11.0 login
   EAS_NO_VCS=1 npx --yes eas-cli@27.11.0 build --platform android --profile production
   ```

   Use the Node version from `app/.node-version`. `EAS_NO_VCS=1` archives the prepared working tree rather than cloning the upstream Git revision again. Run it only inside the disposable `app/` checkout. Restore upstream `app.config.ts` there before repeating preparation.
3. Add an Expo access token as the GitHub Actions **secret** `EXPO_TOKEN`. Never commit credentials or access tokens. Open **Actions → Android release build → Run workflow** on `main`.

The workflow queues an EAS build and exits; follow the build link in the job log for status and the `.aab`. It does not submit to Google Play or create a GitHub release. iOS branding inputs are retained, but iOS builds are not enabled: they need the real Apple Team ID, signing credentials, and a separate widget App Group.

## License

MIT for the publisher scripts and documentation. The EnergyHub21 artwork is not covered by this license; verify permission before making the repository public. The bundled Roboto fonts retain their [own license](custom-assets/fonts/LICENSE).
