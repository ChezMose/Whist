# Whist — UX Guidelines

This document defines the design principles, interaction patterns, and visual conventions for the Whist app.

---

## Design principles

1. **One hand, one glance.** The app is used at a card table while playing. Every primary action must be reachable with a single thumb without looking away for more than a second.
2. **Clarity over density.** Large text, high contrast, generous tap targets. Never cram information — paginate or scroll instead.
3. **Forgive mistakes.** Score entry is error-prone in a social context. Make corrections easy and always confirm destructive actions.
4. **Zero friction for the common case.** The happy path (record a round, advance) must be instant. Edge cases (edit a past round, end game early) can afford one extra tap.

---

## Layout & spacing

- Minimum tap target size: **48 × 48 dp**.
- Primary content area: **16 dp** horizontal padding.
- Section spacing: **24 dp** between logical groups.
- Avoid full-screen modals for simple confirmations — use bottom sheets or inline dialogs.

---

## Typography

- Base font size: **16 sp** for body text.
- Score display: **48 sp** or larger, bold — must be readable at arm's length across a table.
- Player names: **20 sp**, truncate with ellipsis after 20 characters.
- All text must pass WCAG AA contrast ratio (4.5:1 on body, 3:1 on large text).

---

## Color

- Each player has an individual color chosen at player creation (palette of 32 colors) so players instantly recognise their row.
- Player colors should be distinguishable for the most common forms of color blindness (avoid red/green as the sole differentiator — prefer blue/orange or blue/yellow).
- Neutral background: near-black (`#121212`) for the primary dark theme.
- Surface cards: `#1E1E1E`.
- Primary action: a single accent color (e.g. `#FFB300` amber) used consistently for CTAs.

> Dark mode is the default and primary theme. Light mode is a nice-to-have for a future iteration.

---

## Active game screen

This is the most-used screen; it deserves the most attention.

### Score display
- Player scores are displayed in a vertical list, each row in the player's color.
- Player name and current total score are shown on each row, in large numerals.
- The current round number is shown in a header above the list.

### Round entry (Contracts and Outcome phases)
- Each phase presents one player at a time, in order.
- A stepper (+/−) is used for input — no free keyboard entry.
- A **Next** button advances to the next player; the last player's **Next** confirms the phase.
- During the Contracts phase, the stepper is unconstrained.
- During the Outcome phase, the stepper is unconstrained.
- The score list gains a new column after each completed round.

---

## New game setup screen

- A seat list is shown (3 seats by default, up to 4).
- Tapping a seat opens the player selection flow (new player or existing player).
- A **+** button adds a seat; seats can be removed down to a minimum of 3.
- **Start game** is disabled until every seat has a player assigned.
- No required steps beyond filling seats — keep it minimal.

---

## History screen

- Flat list, most recent game at the top.
- Each row: date (relative if < 7 days, e.g. "Yesterday"), player names with their final scores.
- Swipe-to-delete with a confirmation snackbar ("Game deleted · Undo").
- Empty state: friendly illustration + "No games yet. Start your first game!" with a CTA button.

---

## Game detail screen

- Header: date, player names.
- Round-by-round table: one column per player showing their score for that round.
- Running totals row at the bottom, sticky.
- Read-only — no editing. Corrections should be made during the active game (future feature).

---

## Navigation

- Bottom tab bar with two tabs: **Game** (active session or new-game CTA) and **History**.
- The Game tab badge shows the current round number when a game is in progress.
- Back navigation is always available and never loses entered data without a confirmation prompt.

---

## Feedback & micro-interactions

- Score update after round confirmation: brief animated counter increment (≤ 300 ms).
- Invalid input: inline error label, no toast.
- Destructive actions (end game, delete history): require an explicit confirmation — either a dialog with "Cancel / Confirm" or a swipe-with-undo pattern.
- Loading states: only show a spinner if an operation takes > 300 ms (local SQLite ops should not).

---

## Accessibility

- All interactive elements have an `accessibilityLabel`.
- Score numerals include a text description for screen readers (e.g. "Alice score: 5").
- Avoid communicating state through color alone — pair with an icon or label.
- Support system font scaling up to 1.3× without layout breakage.
