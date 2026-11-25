# EnergyHub21 App Publisher

Builds a branded Android App Bundle from a pinned [evcc companion app](https://github.com/evcc-io/app) revision. The static `eas.json` supplies the build profile and branding variables. The checkout in `app/` reads `../custom-assets/` directly.

## Upload to GitHub

Create an empty **private** repository named `Maschga/app-publisher` at <https://github.com/new>. Do not initialize it with a README or license. From Git Bash:

```bash
cd /c/Users/delph/Documents/Repositories/app-publisher
git add .github .easignore LICENSE README.md eas.json custom-assets
git diff --cached --stat
git commit -m "Initial EnergyHub21 publisher"
git remote add origin https://github.com/Maschga/app-publisher.git
git push -u origin main
```

## Set up and run the build

1. Set `EVCC_APP_REF` under GitHub **Settings → Secrets and variables → Actions → Variables** to the full SHA of a published `evcc-io/app` commit that supports Expo slug, owner, and EAS project ID overrides. The EnergyHub21 project values are in `eas.json` under `build.production.env`.
2. Configure remote Android signing credentials in EAS for `io.energyhub21.android`. For an existing Play Store app, use its existing upload key. Run the first interactive build locally so EAS can prompt for any missing setup:

   ```bash
   git clone https://github.com/evcc-io/app.git app
   git -C app checkout <evcc-app-commit-sha>
   cp eas.json app/eas.json
   cd app
   npm ci
   npx --yes eas-cli@27.11.0 login
   EAS_NO_VCS=1 EAS_PROJECT_ROOT="$(cd .. && pwd -P)" \
     npx --yes eas-cli@27.11.0 build --platform android --profile production
   ```

   Use the Node version from `app/.node-version`. Run EAS from `app/` but set `EAS_PROJECT_ROOT` to the absolute publisher directory so the archive includes both `app/` and its sibling `custom-assets/`. In Git Bash on Windows use `pwd -W` instead of `pwd -P` to get a native absolute path.
3. Add an Expo access token as the GitHub Actions **secret** `EXPO_TOKEN`. Never commit credentials or access tokens. Open **Actions → Android release build → Run workflow** on `main`.

The workflow queues an EAS build and exits; follow the build link in the job log for status and the `.aab`. It does not submit to Google Play or create a GitHub release. iOS branding inputs are retained, but iOS builds are not enabled: they need the real Apple Team ID, signing credentials, and a separate widget App Group.

## License

MIT for the publisher configuration and documentation. The EnergyHub21 artwork is not covered by this license; verify permission before making the repository public. The bundled Roboto fonts retain their [own license](custom-assets/fonts/LICENSE).
