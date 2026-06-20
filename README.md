## Task 3: Order & Chaos
An asymmetric abstract strategy game played on a $6 \times 6$ grid.

**System Overview:**
In this game, the Order player aims to line up five identical tokens (either X or O) in a row, whether that’s horizontally, vertically, or diagonally. Meanwhile, the Chaos player’s goal is to fill all available spots on the grid while thwarting Order's attempts to create that winning line. Both players have access to a shared pool of X and O tokens.

**Implementation Details:**
* **Match Progression:** The game unfolds over multiple rounds. In Round 1, you’ll take on the role of Order to set a performance benchmark, and then in Round 2, you’ll switch gears to play as Chaos against a programmed opponent.
* **Heuristic Scanning:** This feature includes a matrix traversal algorithm designed to spot sequences of tokens (specifically those of lengths 4 and 5) and keep track of move counts to check for winning conditions.
* **Architecture:** The design follows a decoupled pattern, ensuring that the React presentation layer is separate from the core logic and state management, allowing for a clean and efficient structure.

### Website : https://chaos-and-order-ag6oxumk7-greatestansh0-6902s-projects.vercel.app/