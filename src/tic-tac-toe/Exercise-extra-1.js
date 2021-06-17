import React, { useCallback, useState } from 'react';

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

const useLocalStorageState = (startValue = undefined, key = '_') => {
  const loadedValue = window.localStorage.getItem(key);
  const [value, setValue] = useState(loadedValue ? JSON.parse(loadedValue) : startValue);

  const updateValue = (newValue) => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue];
};

const defaultSquares = Array(9).fill(null);

const Board = () => {
  const [squares, setSquares] = useLocalStorageState(defaultSquares, 'squares');
  const restart = useCallback(() => setSquares(defaultSquares), []);

  const selectSquare = useCallback(
    (square) => {
      const winner = calculateWinner({ squares });
      if (square < 0 || square > 8 || squares[square] || winner) {
        return;
      }
      const nextSquares = [...squares];
      nextSquares[square] = calculateNextValue({ squares });
      setSquares(nextSquares);
    },
    [squares],
  );

  const renderSquare = useCallback(
    (i) => (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    ),
    [squares],
  );

  const getStatus = useCallback(
    () =>
      calculateStatus({
        winner: calculateWinner({ squares }),
        squares,
        nextValue: calculateNextValue({ squares }),
      }),
    [squares],
  );

  return (
    <div>
      <div className="status">{getStatus()}</div>
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
