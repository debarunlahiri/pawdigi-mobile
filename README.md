# PawDigi Mobile

PawDigi is an Expo and React Native application for creating and managing digital pet passports, health records, vaccinations, alerts, guardians, and pet profiles.

## Requirements

- Node.js 18 or newer
- npm
- Android Studio and an Android SDK for local Android builds
- macOS with Xcode and CocoaPods for local iOS builds

## Installation

```bash
npm install
```

## Run the application

Start the Expo development server:

```bash
npm start
```

Run on an Android device or emulator:

```bash
npm run android
```

Run on an iOS simulator:

```bash
npm run ios
```

Run in a web browser:

```bash
npm run web
```

## Type checking

```bash
npm run typecheck
```

## Local native builds

Generate the native Android project and build/install the development app:

```bash
npx expo run:android
```

Generate the native iOS project and build/install the development app:

```bash
npx expo run:ios
```

The iOS command requires macOS and Xcode.

## Build an Android APK locally

This project does not require EAS to build an APK. Generate the native Android project first:

```bash
npx expo prebuild --platform android
```

Build a debug APK:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
cd android
./gradlew assembleDebug
```

The debug APK is generated with a timestamped filename:

```text
android/app/build/outputs/apk/debug/pawdigi_DDMMYYHHMMSS_debug.apk
```

Install it on a connected Android device:

```bash
adb install -r app/build/outputs/apk/debug/pawdigi_*_debug.apk
```

### Build a release APK

From the project root:

```bash
npx expo prebuild --platform android
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
cd android
./gradlew assembleRelease
```

The release APK is generated with a timestamped filename:

```text
android/app/build/outputs/apk/release/pawdigi_DDMMYYHHMMSS_release.apk
```

For example, a debug APK built at 18:42:09 on 11 July 2026 is named `pawdigi_110726184209_debug.apk`.

A production release must be signed with your Android upload keystore. Configure the keystore values in `android/gradle.properties` and the release signing configuration in `android/app/build.gradle` before distributing the APK.

### Build an Android App Bundle

For Google Play submission, build an `.aab` locally:

```bash
cd android
./gradlew bundleRelease
```

### Required Java version

Android builds should run with Java 17. Verify the active version before running Gradle:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
java -version
```

If Gradle reports `Unsupported class file major version 70`, it is running with Java 26. Stop existing daemons and restart the build under Java 17:

```bash
cd android
./gradlew --stop
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
./gradlew assembleDebug
```

The bundle is generated at:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

## Build iOS locally

Generate the native iOS project:

```bash
npx expo prebuild --platform ios
```

Install CocoaPods dependencies and open the workspace:

```bash
cd ios
pod install
open *.xcworkspace
```

In Xcode, select a development team and use **Product → Archive** to create an App Store or Ad Hoc build. Local iOS builds require macOS, Xcode, and an Apple Developer account for device distribution.

## Project structure

```text
assets/                 Images and SVG assets
src/components/         Shared UI components
src/screens/            Screens and application fragments
src/theme/              Colors, typography, and asset configuration
App.tsx                 Application shell and primary navigation
app.json                Expo application configuration
android/                Generated native Android project
ios/                    Generated native iOS project
```

## Clear the Expo cache

If Metro or Expo serves stale assets, restart it with:

```bash
npx expo start --clear
```
