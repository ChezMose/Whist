# Whist — Product Specifications

This document describes the intended behaviour of the app for Claude to use as a reference when implementing features.

---

## Game rules (Whist)

Whist is a trick-taking card game. The app is concerned only with score counting, not with enforcing game rules.

---

## User stories

User stories are in [specs/screens.md](screens.md).

---

## App screens

Screen descriptions and user stories are in [specs/screens.md](screens.md).

---

## Data model

The data model is in [specs/data-model.md](data-model.md).

---


## Persistence

- All completed games are stored locally via **expo-sqlite**.
- In-progress game state is held in the Zustand store (`store/gameStore.ts`); it should survive app restarts (persist to AsyncStorage or SQLite).
- No remote sync — fully offline.

---

## UX constraints

- Android only (APK, no iOS target).
- Simple, legible UI — usable at a card table with one hand.
- No authentication, no accounts.
- Dark mode support is a nice-to-have, not a requirement.

Full UX guidelines (layout, typography, color, interaction patterns, accessibility) are in [specs/UX.md](UX.md).

## For later versions

Features intentionally deferred are tracked in [specs/later.md](later.md).
