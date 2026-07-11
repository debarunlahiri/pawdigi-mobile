const { withAppBuildGradle } = require('@expo/config-plugins');

const marker = '// PawDigi APK filename';

module.exports = function withApkFilename(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy' || config.modResults.contents.includes(marker)) {
      return config;
    }

    config.modResults.contents += `

${marker}
android.applicationVariants.all { variant ->
    variant.outputs.all { output ->
        def buildTimestamp = new Date().format('ddMMyyHHmmss')
        output.outputFileName = "pawdigi_\${buildTimestamp}_\${variant.buildType.name}.apk"
    }
}
`;

    return config;
  });
};
