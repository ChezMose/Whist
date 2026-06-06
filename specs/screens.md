# Whist — App Screens

Each screen is described as user stories. The canonical user stories are in [specs/user-stories.md](user-stories.md).

---

## 1. Navigation

- As a player, I want a bottom tab bar with **Game**, **History**, **Rules**, and **Share** tabs so I can quickly start or review a game, consult the rules, or share the app.

---

## 2. New game setup

- As a player, I want to see a list of seats (3 by default) so I can assign a player to each one.
- As a player, I want to tap a seat to open the player selection flow.
- As a player, I want to add an extra seat (up to 8 total) so more players can join.
- As a player, I want **Start game** to become enabled only when every seat has a player assigned.
- As a player, I want a **Cancel** button in the top-right corner (same style as the Exit button on the game screen) so I can discard the setup and return to the initial state.

---

## 3. Player selection

- As a player, I want to create a new player by entering a name and picking a color, so they are saved for future games.
- As a player, I want to pick an existing player from the saved list so I don't have to re-enter their name.
- As a player, I want players already assigned to another seat to be hidden from the list, so the same player cannot occupy two seats at once.
- As a player, I want to remove a seat (minimum 3 seats) to adjust the player count.

---

## 4. Active game screen

- As a player, I want to see each player's current total score so I know the standings at a glance.
- As a player, I want to tap **Contracts** to start the contract entry phase for the current round.
- As a player, after contracts are entered, I want to see the contracts displayed on the game screen before entering results.
- As a player, I want to tap **Result** (shown after contracts are entered) to record how many tricks each player actually won.
- As a player, I want to tap **Exit** and confirm to end the game early, discarding the current unfinished round.

---

## 5. Contracts phase

- As a player, I want to enter the number of tricks in the round before declaring contracts, so the app can enforce the contracts constraint.
- As a player, I want each player to declare their contract (tricks they expect to win) using a stepper, one at a time.
- As a player (last to declare), I want the **Next** button to be disabled if my contract would make the total equal to the round's trick count, so the constraint that at least one player scores negatively is always enforced.
- As a player, I want to be returned to the game screen with contracts displayed once all players have entered theirs.

---

## 6. Result phase

- As a player, I want each player to enter how many tricks they actually won, using a stepper, one at a time.
- As a player, I want scores to be calculated and saved automatically once all results are confirmed.
- As a player, I want to be returned to the game screen with updated scores after each round.

---

## 7. History screen

The History screen has two sub-sections, selectable via a segmented control at the top.

### 7a. Games sub-section (default)

- As a player, I want to see a chronological list of past games (most recent first).
- As a player, I want each entry to show the players and their final score for that game.
- As a player, I want to tap a game to see its round-by-round detail.

### 7b. Players sub-section

- As a player, I want to see a list of all saved players so I can manage them.
- As a player, I want to tap **Edit** next to a player to rename them and/or change their color.
- As a player, I want to tap **Delete** next to a player and confirm to remove them from the database (past games unaffected).

---

## 8. Game detail

- As a player, I want to see each player's score for every round and their running total.
- As a player, I want to delete a game from its detail view by tapping **Clear this game** and confirming, so I can remove unwanted records from the history.

---

## 9. Rules screen

- As a player, I want to read the game rules inside the app so I can check scoring or explain the game to newcomers without leaving the table.
- The screen explains: player count, rounds, the First Player rotation, contracts, results, and the scoring formula.
- Scoring examples are shown inline (e.g. bid 3 won 3 → +4; bid 3 won 2 → −2).

---

## 10. Share screen

- As a player, I want to share the app with friends by scanning a QR code or tapping a link that points to the GitHub repository.
- The exact layout and URL are defined in [specs/share.md](share.md).
