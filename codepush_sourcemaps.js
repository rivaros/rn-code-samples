/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');
const process = require('process');
const args = require('yargs').argv;
const pkg = require('../package.json');
const helpers = require('./helpers.js');

const platform = args.platform === 'android' ? 'android' : 'ios';
const { version: appVersion, codepushVersion } = pkg;

if (!codepushVersion) {
  console.log('No codepush version detected');
  process.exit(1);
}

const uploadSourceMaps = async () => {
  const bugsnagApiKeyDev = helpers.getEnvVar(`.env.dev.local`, 'BUGSNAG_API_KEY');
  const uploadSourceMapDev = `yarn bugsnag-source-maps upload-react-native \
    --api-key ${bugsnagApiKeyDev} \
    --code-bundle-id ${appVersion}-${codepushVersion} \
    --platform ${platform} \
    --source-map build/CodePush/main.jsbundle.map \
    --bundle build/CodePush/main.jsbundle  
  `;

  const bugsnagApiKeyQa = helpers.getEnvVar(`.env.qa.local`, 'BUGSNAG_API_KEY');
  const uploadSourceMapQa = `yarn bugsnag-source-maps upload-react-native \
    --api-key ${bugsnagApiKeyQa} \
    --code-bundle-id ${appVersion}-${codepushVersion} \
    --platform ${platform} \
    --source-map build/CodePush/main.jsbundle.map \
    --bundle build/CodePush/main.jsbundle  
  `;

  const bugsnagApiKeyStaging = helpers.getEnvVar(`.env.staging.local`, 'BUGSNAG_API_KEY');
  const uploadSourceMapStaging = `yarn bugsnag-source-maps upload-react-native \
    --api-key ${bugsnagApiKeyStaging} \
    --code-bundle-id ${appVersion}-${codepushVersion} \
    --platform ${platform} \
    --source-map build/CodePush/main.jsbundle.map \
    --bundle build/CodePush/main.jsbundle  
  `;

  const bugsnagApiKeyProd = helpers.getEnvVar(`.env.prod.local`, 'BUGSNAG_API_KEY');
  const uploadSourceMapProd = `yarn bugsnag-source-maps upload-react-native \
    --api-key ${bugsnagApiKeyProd} \
    --code-bundle-id ${appVersion}-${codepushVersion} \
    --platform ${platform} \
    --source-map build/CodePush/main.jsbundle.map \
    --bundle build/CodePush/main.jsbundle  
  `;

  try {
    if (bugsnagApiKeyDev) {
      console.log('Uploading sourcemaps to DEV');
      await execSync(uploadSourceMapDev, { stdio: 'inherit' });
    }
    if (bugsnagApiKeyQa) {
      console.log('Uploading sourcemaps to QA');
      await execSync(uploadSourceMapQa, { stdio: 'inherit' });
    }
    if (bugsnagApiKeyStaging) {
      console.log('Uploading sourcemaps to STAGING');
      await execSync(uploadSourceMapStaging, { stdio: 'inherit' });
    }
    if (bugsnagApiKeyProd) {
      console.log('Uploading sourcemaps to PROD');
      await execSync(uploadSourceMapProd, { stdio: 'inherit' });
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

uploadSourceMaps();
