import React, { useCallback, useEffect, useState } from 'react';

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

const Board = ({ squares, selectSquare, restart }) => {
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

const HistoryWidget = ({ history, travelHistory }) => {
  if (!history) {
    return null;
  }

  return (
    <ul className="history">
      {history.map((historyRecord, index) => (
        <li key={historyRecord.move.toString()} className={`history-record ${historyRecord.current ? 'current' : ''}`}>
          <span className="history-number">{index + 1}.</span>
          <button
            className="history-btn"
            disabled={historyRecord.current ? 'disabled' : ''}
            onClick={() => travelHistory(historyRecord.move)}
          >
            Go to {historyRecord.move === 0 ? 'game start' : `move #${historyRecord.move}`}
            {historyRecord.current ? ' (current)' : ''}
          </button>
        </li>
      ))}
    </ul>
  );
};

const Game = () => {
  const [squares, setSquares] = useLocalStorageState(Array(9).fill(null), 'squares');
  const [history, setHistory] = useLocalStorageState([], 'history');

  const restart = useCallback(() => {
    setSquares(Array(9).fill(null));
    setHistory([]);
  }, []);

  useEffect(() => {
    recordSquaresHistory(squares);
  }, [squares]);

  const selectSquare = (square) => {
    const winner = calculateWinner({ squares });
    if (square < 0 || square > 8 || squares[square] || winner) {
      return;
    }
    const nextSquares = [...squares];
    nextSquares[square] = calculateNextValue({ squares });
    setSquares(nextSquares);
  };

  const recordSquaresHistory = (nextSquares) => {
    // don't record travelled
    const joinedSquares = nextSquares.join(' ');
    const actualHistory = history.find((h) => h.squares.join(' ') === joinedSquares);
    if (actualHistory) {
      const nextHistory = history.map((h) => ({ ...h, current: h.move === actualHistory.move }));
      setHistory(nextHistory);
      return;
    }

    const move = history.length;
    const currIndex = history.findIndex((h) => h.current === true);
    let prevHistory = [];

    if (nextSquares.filter(Boolean).length !== 0) {
      prevHistory =
        currIndex < move - 1
          ? history.slice(0, currIndex + 1).map((h) => ({ ...h, current: false }))
          : history.map((h) => ({ ...h, current: false }));
    }

    const newHistory = {
      move: prevHistory.length,
      squares: nextSquares,
      current: true,
    };
    setHistory([...prevHistory, newHistory]);
  };

  const travelHistory = (move) => {
    const historyRecord = history.find((h) => h.move === move);
    if (historyRecord) {
      const nextHistory = history.map((h) => ({ ...h, current: h.move === move }));
      setHistory(nextHistory);
      setSquares(historyRecord.squares);
    }
  };

  return (
    <div className="container">
      <Board squares={squares} selectSquare={selectSquare} restart={restart} />
      <HistoryWidget history={history} travelHistory={travelHistory} />
    </div>
  );
};

export default Game;
