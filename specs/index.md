# Whist — Product Specifications

This document describes the intended behaviour of the app for Claude to use as a reference when implementing features.

---

## Business rules

Whist is a trick-taking card game. The app is concerned only with score counting, not with enforcing game rules.

### Players and seats

- A game has a minimum of 3 players and a maximum of 8 players (recommended: 3 to 8).
- Each player has a score for the game, which is an integer (may be positive or negative).
- Players occupy seats in the game. The seat order does not change during a game.
- "Players in seat order" means all players listed in the order of their occupied seat.

### Rounds and scoring

- A game is divided into rounds. At the end of each round, scores for that round are calculated. A player's global score is the sum of their scores across all rounds.
- Each round has a **first player**. The first player rotates through the seat order: the first player of round N+1 is the player in the next seat after the first player of round N.
- "The first player" always refers to the first player of the current round.
- **Round order** is the order in which players act within a round. It starts with the first player, then continues through the seat order as a circular queue: after the last seat, it wraps back to the first seat. Example: with seats [A, B, C, D] and first player C, the round order is [C, D, A, B].
- **Contracts constraint:** The sum of all players' contracts in a round can **never** equal the total number of tricks in that round. This guarantees that at least one player will always score negatively in every round.

---

## Game rules (player-facing)

The rules as displayed to the user in the app are in [specs/game-rules.md](game-rules.md).

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

## Localization

The app is localized in three languages: **English** (`en`), **French** (`fr`), and **German** (`de`).
The device language is detected automatically at startup; English is the fallback.
All user-visible strings must have a translation in all three locale files (`locales/en.json`, `locales/fr.json`, `locales/de.json`).

Full UX guidelines (layout, typography, color, interaction patterns, accessibility) are in [specs/UX.md](UX.md).

## Share screen

What the Share screen displays and which URL it points to is in [specs/share.md](share.md).

---

## For later versions

Features intentionally deferred are tracked in [specs/later.md](later.md).
