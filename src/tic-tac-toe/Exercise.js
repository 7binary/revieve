import * as React from 'react';

// eslint-disable-next-line no-unused-vars
const calculateStatus = ({ winner, squares, nextValue }) =>
  winner ? `Winner: ${winner}` : squares.every(Boolean) ? `Scratch: Cat's game` : `Next player: ${nextValue}`;

// eslint-disable-next-line no-unused-vars
const calculateNextValue = ({ squares }) => {
  const xSquaresCount = squares.filter((r) => r === 'X').length;
  const oSquaresCount = squares.filter((r) => r === 'O').length;
  return oSquaresCount === xSquaresCount ? 'X' : 'O';
};

// eslint-disable-next-line no-unused-vars
const calculateWinner = ({ squares }) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const Board = () => {
  const squares = React.useState(Array(9).fill(null));

  // TIP: You'll need the following bits of information:
  // - nextValue => 'X' | 'O'
  // - winner => 'X' | 'O' | null
  // - status => `Winner: ${winner}` | `Scratch: Cat's game` | `Next player: ${nextValue}`
  // The calculations are already written in helper functions for you! So you can use those utilities
  // to create these variables

  const selectSquare = (square) => {
    // This is the function your square click handler will call. `square` should
    // be an index. So if they click the center square, this will be `4`.
  };

  const restart = () => {
    // reset the game
  };

  const renderSquare = (i) => (
    <button className="square" onClick={() => selectSquare(i)}>
      {squares[i]}
    </button>
  );

  return (
    <div>
      {/* put the status of the game in the board */}
      <div className="status">STATUS</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  );
};

const Game = () => {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
};

export default Game;
