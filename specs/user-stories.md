# User Stories

## US-1 — App launch & navigation

- When the user opens the app, the main screen is shown.
- Navigation is provided by a bottom tab bar with four tabs: **Game**, **History**, **Rules**, and **Share**.
- The **Game** tab badge shows the current round number when a game is in progress.

## US-2 — New game setup screen

- Navigating to **New game** displays a seat list screen.
- 3 seats are shown by default, each empty.
- A **Start game** button is present but disabled.
- A **Cancel** button is shown in the top-right corner, placed and styled the same as the **Exit** button on the active game screen. Tapping it resets the setup (discards all seat assignments) and returns the user to the initial state of the Game tab.
- Tapping a seat opens the player selection flow (see dedicated user story).
- A **+** button below the seat list lets the user add an additional seat. The **+** button is hidden (or disabled) when the seat count reaches 8 — the maximum seat count is 8.
- The **Start game** button becomes enabled only when every seat has been assigned a player.
- Tapping **Start game** starts the game.

## US-3 — Player selection

When the user taps a seat, they are navigated to the **Player Selection** page, which presents three options:

**New player**
- The user enters a name and picks a color from a palette of 24 colors.
- The new player is saved to the database for reuse in future games.
- The new player is assigned to the tapped seat.

**Select existing player**
- A dropdown/search lets the user pick from the list of previously saved players.
- Players already assigned to another seat in the current game are hidden from the list — a player can only occupy one seat at a time.
- The selected player fills the seat.

**Remove seat**
- The seat is removed from the list.
- This option is disabled (or hidden) when there are 3 or fewer seats — the minimum seat count is 3.

**Exit**
- Returns the user to the home page.

## US-4 — Game screen

- When the game starts, the game screen is displayed.
- Each player's score is shown, starting at 0.
- Players are listed in seat order.
- The first player of the current round is indicated by a marker (e.g. **\***) next to their name.
- For the first round, the first player is the player in seat 1.
- Two buttons are visible:
  - **Contracts** (main action button) — behaviour described in a separate user story.
  - **Exit** — prompts a confirmation dialog ("End the game? The current round will be discarded."). Confirming ends the game, saves the completed rounds to the database, and returns the user to the home screen.
- After contracts are entered for the current round, the game screen shows:
  - The global game score for each player.
  - Each player's declared contract for the current round.
  - Who is the first player of the current round (marker next to their name).
  - The main action button changes to **Results**.

## US-5 — Contracts phase

- Each round starts with a **Contracts** phase.
- Tapping **Contracts** starts the contract entry flow for the current round.
- **Before player contracts are entered**, the Contracts screen first asks how many tricks are in this round. The user enters the trick count using an up/down stepper. A **Next** button confirms the trick count and advances to player contract entry.
- Each player, in **round order**, declares how many tricks they think they will win.
- The input uses an **up/down stepper** (increment/decrement).
- A **Next** button advances to the next player; the last player's **Next** confirms all contracts.
- A **Previous** button moves back to the previous player. For the first player, that button will cancel the contract phase and go back to the game screen, as if the round did not start (it cancels launching the round).
- **Contracts constraint — last player:** When the last player's contract count is being entered, the app computes the sum of all previously entered contracts plus the last player's current value. If that sum equals the total number of tricks in the round, the **Next** button is disabled — the user cannot confirm contracts until they adjust the last player's value so the total differs from the round's trick count.
- Once all contracts are entered, the user is returned to the game screen.

## US-6 — Result phase

- Tapping **Result** starts the result entry flow for the current round.
- The screen is similar to the Contracts screen: each player in **round order** fills in the number of tricks they actually won, using an up/down stepper. Their contract is shown as a reminder.
- A **Next** button advances to the next player; the last player's **Next** confirms all results.
- **Results constraint — last player:** The last player's **Next** button is disabled if the total of all entered results (including the last player's current value) differs from the round's trick count — every trick must be accounted for.
- A **Previous** button moves back to the previous player. For the first player, that button cancels the result phase and returns to the game screen, as if the Result button was never tapped (contracts are preserved).
- Score calculation per player for the round:
  - **Contract met:** `score = 1 + tricks won`
  - **Contract missed:** `score = -(1 + |contract - result|)`
- Once all results are entered:
  - The round scores are saved to the database.
  - The total game scores are updated for each player.
  - The user is redirected to the game screen, which now shows the updated total scores.
  - The main action button resets to **Contracts**, starting the next round.

**Quitting before round end**
- Tapping **Exit** during the Contracts or Result phase triggers the end-of-game confirmation.
- If confirmed, the current round is discarded and the game ends.

## US-7 — History

- Tapping **History** from the home screen displays the History tab, which contains two sub-sections accessible via a segmented control at the top: **Games** (default) and **Players**.

### US-7a — Games sub-section

- The **Games** sub-section displays the list of all past games stored in the database.
- If no games have been played yet, the screen shows: *"No games yet"* with a message prompting the user to start their first game on the Game tab.
- Each entry shows the list of players and their final score for that game.
- Tapping a game opens a detail view showing the scores of every round for that game.

### US-7c — Players sub-section

- The **Players** sub-section displays all saved players.
- If no players have been saved yet, the screen shows a message: *"No saved players yet."*
- Each row shows the player's color dot, name, an **Edit** button, and a **Delete** button.
- Tapping **Edit** opens a modal where the user can rename the player and/or change their color from the palette.
  - The name input is pre-filled with the current name.
  - The current color is pre-selected in the palette.
  - Tapping **Save** persists the changes; tapping **Cancel** discards them.
  - **Save** is disabled when the name field is empty.
- Tapping **Delete** shows a confirmation dialog: *"Delete [name]? They will be removed from your saved players. Past games are not affected."* with **Cancel** and **Delete** options.
  - Confirming removes the player from the database. Past game records are not modified.

## US-7b — Clear a game from detail

- The game detail view has a **Clear this game** button.
- Tapping it opens a confirmation dialog: *"Delete this game? This action cannot be undone."* with **Cancel** and **Delete** options.
- Confirming deletes the game from the database and navigates back to the History screen.

## US-8 — Rules

- Tapping **Rules** from the menu opens the rules screen.
- The screen is a scrollable page explaining: player count (3–8), seat order, rounds, the First Player rotation, contracts (bids), results (tricks won), and the scoring formula.
- Scoring is shown with both the formula and concrete examples:
  - Contract met: `+1 + tricks won`
  - Contract missed: `−(1 + |bid − won|)`
- The screen is read-only; no interaction required.

## US-9 — Share

- Tapping the **Share** tab opens the share screen.
- The screen lets users share the app with friends by pointing them to the GitHub repository via a QR code and a tappable link.
- The exact layout and URL are defined in [specs/share.md](share.md).
