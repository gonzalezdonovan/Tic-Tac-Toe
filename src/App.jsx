import { useState } from "react";
import "./index.css";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "winner-square" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  const result = calculateWinner(squares);
  const winner = result?.winner;
  const winningLine = result?.line;

  function handleClick(i) {
    if (squares[i] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    onPlay(nextSquares);
  }

  let status;

  if (winner) {
    status = (
      <div className="winner-message">
        🎉 ¡El jugador {winner} ganó! 🎉
      </div>
    );
  } else if (squares.every((s) => s !== null)) {
    status = <div className="draw-message">🤝 ¡Empate!</div>;
  } else {
    status = (
      <div className="status">
        Turno de: <span className={xIsNext ? "player-x" : "player-o"}>
          {xIsNext ? "X" : "O"}
        </span>
      </div>
    );
  }

  return (
    <>
      {status}

      <div className="board-row">
        {[0,1,2].map((i)=>(
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={()=>handleClick(i)}
            highlight={winningLine?.includes(i)}
          />
        ))}
      </div>

      <div className="board-row">
        {[3,4,5].map((i)=>(
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={()=>handleClick(i)}
            highlight={winningLine?.includes(i)}
          />
        ))}
      </div>

      <div className="board-row">
        {[6,7,8].map((i)=>(
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={()=>handleClick(i)}
            highlight={winningLine?.includes(i)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {

  const [history,setHistory] = useState([Array(9).fill(null)]);
  const [currentMove,setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares){

    const nextHistory = [
      ...history.slice(0,currentMove+1),
      nextSquares
    ];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(move){
    setCurrentMove(move);
  }

  function restartGame(){
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares,move)=>{

    let description;

    if(move>0){
      description = "Ir al movimiento #" + move;
    } else {
      description = "Ir al inicio";
    }

    return(
      <li key={move}>
        <button
          className="history-btn"
          onClick={()=>jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (

    <div className="game">

      <h1 className="title">🎮 Tic Tac Toe</h1>

      <div className="game-container">

        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>

        <div className="game-info">

          <h3>Historial</h3>

          <ol>{moves}</ol>

        </div>

      </div>

      <button className="restart" onClick={restartGame}>
        Reiniciar juego
      </button>

    </div>
  );
}

function calculateWinner(squares){

  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for(let i=0;i<lines.length;i++){

    const [a,b,c] = lines[i];

    if(
      squares[a] &&
      squares[a]===squares[b] &&
      squares[a]===squares[c]
    ){
      return {
        winner:squares[a],
        line:lines[i]
      };
    }
  }

  return null;
}