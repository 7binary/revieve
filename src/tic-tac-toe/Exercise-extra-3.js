import * as React from 'react';
import { useEffect } from 'react';

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

const useLocalStorageState = (startValue = undefined, key = '_') => {
  const loadedValue = window.localStorage.getItem(key);
  const [value, setValue] = React.useState(loadedValue ? JSON.parse(loadedValue) : startValue);

  const updateValue = (newValue) => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue];
};

const HistoryWidget = ({ history, travelSquaresHistory }) => {
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
            onClick={() => travelSquaresHistory(historyRecord.move)}
          >
            Go to {historyRecord.move === 0 ? 'game start' : `move #${historyRecord.move}`}
            {historyRecord.current ? ' (current)' : ''}
          </button>
        </li>
      ))}
    </ul>
  );
};

const Board = () => {
    const [winner, setWinner] = React.useState(null);
    const [player, setPlayer] = React.useState(defaultPlayer);
    const [squares, setSquares] = useLocalStorageState(defaultSquares, 'squares');
    const [history, setHistory] = useLocalStorageState([], 'history');
    const [status, setStatus] = React.useState(defaultStatus);

    useEffect(() => {
      if (history.length === 0) {
        recordSquaresHistory(defaultSquares);
      }
    }, [history, squares]);

    const recordSquaresHistory = (nextSquares) => {
      const move = history.length;
      const currIndex = history.findIndex(h => h.current === true);
      const prevHistory = currIndex < move - 1
        ? history.slice(0, currIndex+1).map(h => ({ ...h, current: false }))
        : history.map(h => ({ ...h, current: false }));
      const addHistory = {
        move: prevHistory.length,
        squares: nextSquares,
        current: true,
      };
      setSquares(nextSquares);
      setHistory([...prevHistory, addHistory]);
    };

    const travelSquaresHistory = (move) => {
      const historyRecord = history.find(h => h.move === move);
      if (historyRecord) {
        const nextHistory = history.map(h => ({ ...h, current: h.move === move }));
        const nextPlayer = calculateNextValue({ squares: historyRecord.squares });
        const nextWinner = calculateWinner({ squares: historyRecord.squares });
        const nextStatus = calculateStatus({
          winner: nextWinner,
          squares: historyRecord.squares,
          nextValue: nextPlayer,
        });
        setSquares(historyRecord.squares);
        setHistory(nextHistory);
        setPlayer(nextPlayer);
        setWinner(nextWinner);
        setStatus(nextStatus);
      }
    };

    useEffect(() => {
      if (squares && squares.filter(Boolean).length > 0) {
        console.log('loaded', squares);
        const nextPlayer = calculateNextValue({ squares });
        const nextWinner = calculateWinner({ squares });
        const nextStatus = calculateStatus({
          winner: nextWinner,
          squares,
          nextValue: nextPlayer,
        });
        setPlayer(nextPlayer);
        setStatus(nextStatus);
        setWinner(nextWinner);
      }
    }, []);

    const selectSquare = (square) => {
      if (square < 0 || square > 8 || squares[square] || winner) {
        return false;
      }
      const nextSquares = [...squares];
      nextSquares[square] = player;
      recordSquaresHistory(nextSquares);
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
      setHistory([]);
    };

    const renderSquare = (i) => (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    );

    return (
      <div className="container">
        <div>
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
        <div className="info">
          <div className="status">{status}</div>
          <HistoryWidget history={history} travelSquaresHistory={travelSquaresHistory} />
        </div>
      </div>
    );
  }
;

const Game = () => {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
;

export default Game;
