# tic tac toe exercise

Please, read carefully this file

Do the exercise and make a PR. No need to deploy it anywhere.

## Running the project

- Run `npm i`
- Use `npm start` to run the project
- Use `npm test` to check your code

## 👨🏻‍💻 Exercise

You're expected to finish coding this tic-tac-toe game (with localStorage support)! Do not worry, the main logic is already written to avoid any waste of time and allow you to focus on a little code and show your great skills.

🔗 This is what we expect your PR to achieve: https://solution--tic-tac-toe-exercise.netlify.app/

File you need to edit: `/src/tic-tac-toe/Exercise.js`

`squares` is the managed state and it's the state of the board in a
single-dimensional array:

```
[
  'X', 'O', 'X',
  'X', 'O', 'O',
  'X', 'X', 'O'
]
```

### 🧞‍♂️ Provided helpers

`calculateNextValue` returns the `nextValue`, either the string `X` or `O`.

`calculateWinner` returns the `winner` if there is any. `winner` will be either the string `X` or `O`.

`calculateStatus` returns a text to show in the screen based on the board status.

## Extra Credit

### 1. 🥉 preserve state in localStorage

File: `/src/tic-tac-toe/Exercise-extra-1.js`

Our customers want to be able to pause a game, close the tab, and then resume
the game later. Can you store the game's state in `localStorage`?

### 2. 🥈 useLocalStorageState

File: `/src/tic-tac-toe/Exercise-extra-2.js`

It's cool that we can get localStorage support to another features, it'd be cool to use a `useLocalStorageState` custom hook. Can you create it?

### 3. 🥇 add game history feature

File: `/src/tic-tac-toe/Exercise-extra-3.js`

NOTE: This extra credit is one of the harder extra credits. Don't worry if you
struggle on it!

TIP: Moving the state management from the `Board`
component to the `Game` component can help. Here's what the JSX
returned from the `Game` component could be:

```javascript
return (
  <div className="game">
    <div className="game-board">
      <Board onClick={selectSquare} squares={currentSquares} />
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
    <div className="game-info">
      <div>{status}</div>
      <ol>{renderHistoricalMoves()}</ol>
    </div>
  </div>
);
```
