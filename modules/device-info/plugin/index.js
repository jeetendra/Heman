/**
 * Expo Config Plugin for device-info local module
 *
 * A config plugin runs during `expo prebuild` to modify the generated
 * native project. This is what makes local modules survive a prebuild
 * without you manually editing android/ files.
 *
 * This plugin:
 *  1. Adds the local module as an Android include in settings.gradle
 *  2. Adds the implementation dependency in app/build.gradle
 *
 * Because expo-modules-core handles Module auto-discovery via its
 * annotation processor, there is NO need to touch MainApplication.kt —
 * that's the whole point of using Expo Modules over raw ReactPackage.
 */

const { withAppBuildGradle, withSettingsGradle } = require("@expo/config-plugins");
const path = require("path");

/**
 * Add `include ':device-info'` and the project dir pointer to settings.gradle
 */
function withDeviceInfoSettings(config) {
  return withSettingsGradle(config, (mod) => {
    const contents = mod.modResults.contents;

    // Relative path from android/ (rootProject.projectDir) to the module's android folder
    // android/ is one level inside the project root, so we need ../modules/...
    const modulePath = "../modules/device-info/android";

    const settingsEntry = [
      "",
      "// device-info local Expo Module",
      "include ':device-info'",
      `project(':device-info').projectDir = new File(rootProject.projectDir, '${modulePath}')`,
    ].join("\n");

    // Only add once
    if (!contents.includes("include ':device-info'")) {
      mod.modResults.contents = contents + settingsEntry;
    }

    return mod;
  });
}

/**
 * Add `implementation project(':device-info')` to app/build.gradle
 */
function withDeviceInfoDependency(config) {
  return withAppBuildGradle(config, (mod) => {
    const contents = mod.modResults.contents;

    const dep = `    implementation project(':device-info')`;

    if (!contents.includes("project(':device-info')")) {
      // Insert after the react-android dependency line
      mod.modResults.contents = contents.replace(
        `implementation("com.facebook.react:react-android")`,
        `implementation("com.facebook.react:react-android")\n${dep}`
      );
    }

    return mod;
  });
}

/**
 * The composed plugin — both transforms applied in sequence.
 * Listed in app.json plugins array to activate.
 */
module.exports = function withDeviceInfo(config) {
  config = withDeviceInfoSettings(config);
  config = withDeviceInfoDependency(config);
  return config;
};
