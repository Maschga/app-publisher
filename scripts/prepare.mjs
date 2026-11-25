import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

const file = (path) => new URL(`../${path}`, import.meta.url);
const { EXPO_OWNER: owner, EXPO_PROJECT_ID: projectId } = process.env;
assert.match(owner ?? '', /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/, 'Set EXPO_OWNER');
assert.match(projectId ?? '', /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i, 'Set EXPO_PROJECT_ID');
assert.notEqual(owner.toLowerCase(), 'evcc-io', 'Use your own Expo account');
assert.notEqual(projectId.toLowerCase(), 'b1b49826-1d85-42bf-997f-653600e16c51', 'Use your own EAS project');

const env = parseEnv(readFileSync(file('branding.env'), 'utf8'));
assert.ok(Object.keys(env).every((key) => key.startsWith('EVCC_APP_CUSTOM_')));

const config = file('app/app.config.ts');
let source = readFileSync(config, 'utf8');
for (const [original, replacement] of [
  ['owner: "evcc-io"', `owner: ${JSON.stringify(owner)}`],
  ['projectId: "b1b49826-1d85-42bf-997f-653600e16c51"', `projectId: ${JSON.stringify(projectId)}`],
  ['slug: getEnv(Envs.EVCC_APP_CUSTOM_NAME, "evcc")', 'slug: "energyhub21"'],
]) {
  assert.equal(source.split(original).length, 2, `Unexpected upstream Expo config: ${original}`);
  source = source.replace(original, replacement);
}

cpSync(file('custom-assets/'), file('app/custom-assets/'), { recursive: true });
writeFileSync(config, source);
writeFileSync(file('app/eas.json'), `${JSON.stringify({
  cli: { appVersionSource: 'remote' },
  build: {
    production: {
      distribution: 'store',
      autoIncrement: true,
      android: { buildType: 'app-bundle' },
      env: { ...env, EXPO_NO_DOTENV: '1' },
    },
  },
}, null, 2)}\n`);
