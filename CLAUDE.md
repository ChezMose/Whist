# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Whist** is a personal Android app (APK) for tracking scores of the card game Whist played IRL. Whist is a trick-taking card game. Built with React Native + TypeScript using the Expo managed workflow.

Core features:
- Point counting UI during a game session
- Local persistence of game history (results, scores, players)

## Tech Stack

- **React Native** with **TypeScript**
- **Expo** managed workflow (SDK 50+)
- **AsyncStorage** or **expo-sqlite** for local data persistence
- **EAS Build** to produce the APK

## Commands

```bash
# Install dependencies
npm install

# Start the dev server (Expo Go or emulator)
npx expo start

# Start with a clear cache
npx expo start --clear

# Type checking
npx tsc --noEmit

# Lint
npx eslint . --ext .ts,.tsx

# Build a debug APK via EAS
eas build --platform android --profile preview

# Build a release APK via EAS
eas build --platform android --profile production
```

EAS requires an Expo account (`npx expo login`) and a configured `eas.json`. The `preview` profile produces an APK (`.apk`), while `production` produces an AAB by default — set `buildType: "apk"` in `eas.json` if a plain APK is needed for sideloading.

## Architecture

```
app/                  # Expo Router screens (file-based routing)
  (tabs)/             # Bottom-tab navigator
    index.tsx         # Active game / score counting screen
    history.tsx       # Past games list
  game/[id].tsx       # Detail view for a past game
components/           # Reusable UI pieces (ScoreBoard, PlayerRow, …)
store/                # State management (Zustand or React Context)
  gameStore.ts        # Current game state (players, scores, rounds)
storage/              # AsyncStorage / SQLite wrappers
  games.ts            # CRUD for persisted game records
types/                # Shared TypeScript types (Game, Player, Round, …)
```

### Data flow

1. The user starts a game (players, initial config) → written into `gameStore`.
2. Each round, points are entered in the scoring UI → store updates in memory.
3. On game end, the final record is serialised and persisted via `storage/games.ts`.
4. The history screen reads directly from storage.

### Local storage strategy

Use **expo-sqlite** (via `expo-sqlite/next` for the new async API) for structured game records — it handles queries and migrations more cleanly than AsyncStorage as data grows. AsyncStorage is fine for simple key/value preferences (theme, default player names).

## Specifications

Full product specs (game rules, screens, data model, scoring logic, UX constraints) are in [specs/index.md](specs/index.md). Read this file before implementing any feature.
