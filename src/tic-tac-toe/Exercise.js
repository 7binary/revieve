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

const defaultPlayer = 'X';
const defaultStatus = 'Next player: X';
const defaultSquares = Array(9).fill(null);

const Board = () => {
  const [winner, setWinner] = React.useState(null);
  const [player, setPlayer] = React.useState(defaultPlayer);
  const [squares, setSquares] = React.useState(defaultSquares);
  const [status, setStatus] = React.useState(defaultStatus);

  const selectSquare = (square) => {
    if (square < 0 || square > 8 || squares[square] || winner) {
      return false;
    }
    const nextSquares = [...squares];
    nextSquares[square] = player;
    setSquares(nextSquares);
    const nextWinner = calculateWinner({ squares: nextSquares });
    const nextPlayer = player === 'O' ? 'X' : 'O';

    if (nextWinner) {
      setWinner(nextWinner);
      const nextStatus = calculateStatus({
        winner: nextWinner,
        squares: nextSquares,
        nextValue: nextPlayer,
      });
      setStatus(nextStatus);
    } else {
      const nextStatus = calculateStatus({
        winner: null,
        squares: nextSquares,
        nextValue: nextPlayer,
      });
      setStatus(nextStatus);
      setPlayer(nextPlayer);
    }
  };

  const restart = () => {
    setStatus(defaultStatus);
    setSquares(defaultSquares);
    setPlayer(defaultPlayer);
    setWinner(null);
  };

  const renderSquare = (i) => (
    <button className="square" onClick={() => selectSquare(i)}>
      {squares[i]}
    </button>
  );

  return (
    <div>
      <div className="status">{status}</div>
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
