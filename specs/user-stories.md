# User Stories

## US-1 — App launch & home screen

- When the user opens the app, a splash screen is displayed while data is loading.
- Once loading is complete, the home screen is shown with the title **Whist** and a menu.
- The menu contains two entries: **New game** and **History**.

## US-2 — New game setup screen

- Navigating to **New game** displays a seat list screen.
- 3 seats are shown by default, each empty.
- A **Start game** button is present but disabled.
- Tapping a seat opens the player selection flow (see dedicated user story).
- A **+** button below the seat list lets the user add an additional seat.
- The **Start game** button becomes enabled only when every seat has been assigned a player.
- Tapping **Start game** starts the game.

## US-3 — Player selection

When the user taps a seat, they are navigated to the **Player Selection** page, which presents three options:

**New player**
- The user enters a name and picks a color from a palette of 32 colors.
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
- Two buttons are displayed at the bottom:
  - **Contracts** (main action button) — behaviour described in a separate user story.
  - **Exit** — prompts a confirmation dialog ("End the game? The current round will be discarded."). Confirming ends the game, saves the completed rounds to the database, and returns the user to the home screen.
- After contracts are entered for the current round, the game screen shows each player's declared contract alongside their total score, and the main action button becomes **Result**.

## US-5 — Contracts phase

- Tapping **Contracts** starts the contract entry flow for the current round.
- Each player, in order, declares how many tricks they think they will win.
- The input uses an **up/down stepper** (increment/decrement).
- A **Next** button advances to the next player; the last player's **Next** confirms all contracts.
- Once all contracts are entered, the user is returned to the game screen.
- The game screen now shows each player's declared contract and the main action button changes to **Result**.

## US-6 — Result phase

- Tapping **Result** starts the result entry flow for the current round.
- The screen is similar to the Contracts screen: each player, in order, fills in the number of tricks they actually won, using an up/down stepper. Their contract is shown as a reminder.
- A **Next** button advances to the next player; the last player's **Next** confirms all results.
- Score calculation per player for the round:
  - **Contract met:** `score = 1 + tricks won`
  - **Contract missed:** `score = -(1 + |contract - result|)`
- Once all results are entered:
  - The round scores are saved to the database.
  - The total game scores are updated for each player.
  - The user is redirected to the game screen, which now shows the updated total scores.
  - The main action button resets to **Contracts**, starting the next round.

**Back / cancel during Contracts or Result entry**
- Navigating back or cancelling mid-round triggers the end-of-game confirmation (same as tapping **Exit** from the game screen).
- If confirmed, the current round is discarded and the game ends.

## US-7 — History

- Tapping **History** from the home screen displays the list of all past games stored in the database.
- If no games have been played yet, the screen shows: *"Nothing here — you have to play first!"*
- Each entry shows the list of players and their final score for that game.
- Tapping a game opens a detail view showing the scores of every round for that game.
