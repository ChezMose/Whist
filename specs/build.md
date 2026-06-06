# Build & Development

## Tech stack

- React Native + TypeScript
- Expo (SDK 54, managed workflow)
- expo-router for navigation
- expo-sqlite for local game history
- Zustand for in-game state

## Run in development

### 1. Prerequisites

- [Node.js](https://nodejs.org) (v18 or later)
- An Expo account — create one free at [expo.dev](https://expo.dev)
- The **Expo Go** app installed on your Android device (available on the [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent))

### 2. Install dependencies

```bash
npm install
```

### 3. Log in to Expo

Required once so the tunnel can be created.

```bash
npx expo login
```

### 4. Start the dev server

```bash
npx expo start --tunnel --clear
```

The `--tunnel` flag routes traffic through ngrok so your phone doesn't need to be on the same Wi-Fi network as your PC. The `--clear` flag wipes the Metro cache to avoid stale bundle issues.

### 5. Open the app on your phone

Scan the QR code that appears in the terminal using the **Expo Go** app on your Android device.

## Build a release APK

```bash
eas build --platform android --profile preview
```

Requires an EAS account and a configured `eas.json`. The `preview` profile produces a sideloadable `.apk` file.
