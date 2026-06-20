
import React, { useEffect, useState } from "react";
import { scanBoardPatterns } from "./utils/gameLogic";
import { getBestMove } from "./utils/engine";

const SIZE = 6;
const TOTAL_CELLS = SIZE * SIZE;
const EMPTY_BOARD = () => Array(TOTAL_CELLS).fill(null);

export default function App() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [selectedPiece, setSelectedPiece] = useState("X");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winnerText, setWinnerText] = useState("");

  const [round, setRound] = useState(1);
  const [moveCount, setMoveCount] = useState(0);
  const [round1Stats, setRound1Stats] = useState(null);

  useEffect(() => {
    if (isPlayerTurn || gameOver) return;

    const timer = setTimeout(() => {
      const aiIsOrder = round === 2;
      const move = getBestMove([...board], 3, aiIsOrder);

      if (move.index !== -1) {
        handleMove(move.index, move.piece);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, gameOver, board, round]);

  const determineOverallWinner = (r2OrderWon, r2Moves, r2Patterns) => {
    const r2Straight4s = r2Patterns.X.straight4 + r2Patterns.O.straight4;

    let result = "";

    if (round1Stats.orderWonRound) {
      if (r2OrderWon && r2Moves < round1Stats.moves) {
        result = "AI (Order) wins the game! (Faster 5-in-a-row)";
      } else if (r2OrderWon && r2Moves === round1Stats.moves) {
        if (r2Straight4s > round1Stats.straight4s) {
          result = "AI wins! (More straight 4s)";
        } else if (r2Straight4s < round1Stats.straight4s) {
          result = "You win! (More straight 4s in Round 1)";
        } else {
          result = "It's a Draw! (Perfect tie)";
        }
      } else {
        result = "You win the game! (AI failed to beat your move count)";
      }
    } else {
      if (r2OrderWon) {
        result = "AI wins the game! (Achieved 5-in-a-row)";
      } else if (r2Straight4s > round1Stats.straight4s) {
        result = "AI wins! (More straight 4s)";
      } else if (r2Straight4s < round1Stats.straight4s) {
        result = "You win! (More straight 4s in Round 1)";
      } else {
        result = "It's a Draw!";
      }
    }

    setWinnerText(result);
    setGameOver(true);
  };

  const handleMove = (index, piece) => {
    if (board[index] || gameOver) return;

    const nextBoard = [...board];
    nextBoard[index] = piece;
    setBoard(nextBoard);

    const nextMoveCount = moveCount + 1;
    setMoveCount(nextMoveCount);

    const patterns = scanBoardPatterns(nextBoard);
    const orderWonRound =
      patterns.X.straight5 > 0 || patterns.O.straight5 > 0;

    const boardFull = nextMoveCount === TOTAL_CELLS;

    if (orderWonRound || boardFull) {
      if (round === 1) {
        alert(
          `Round 1 Over! Order (You) ${
            orderWonRound ? "won" : "failed"
          } in ${nextMoveCount} moves.`
        );

        setRound1Stats({
          orderWonRound,
          moves: nextMoveCount,
          straight4s: patterns.X.straight4 + patterns.O.straight4,
        });

        setRound(2);
        setBoard(EMPTY_BOARD());
        setMoveCount(0);
        setIsPlayerTurn(false);
      } else {
        determineOverallWinner(orderWonRound, nextMoveCount, patterns);
      }

      return;
    }

    setIsPlayerTurn((turn) => !turn);
  };

  const handleCellClick = (index) => {
    if (isPlayerTurn) {
      handleMove(index, selectedPiece);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 font-mono text-slate-100">
      <h1 className="mb-2 text-4xl font-bold tracking-wide text-violet-300">
        Order & Chaos
      </h1>

      <div className="mb-6 text-center">
        <p className="text-lg font-semibold text-cyan-400">
          Round {round} of 2
        </p>

        <p className="text-md text-slate-300">
          {round === 1
            ? "You are ORDER. Build a 5 in a row."
            : "You are CHAOS. Prevent the AI from building a 5 in a row."}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Moves: {moveCount} / 36
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setSelectedPiece("X")}
          disabled={!isPlayerTurn || gameOver}
          className={`rounded px-6 py-2 font-bold transition-colors ${
            selectedPiece === "X"
              ? "bg-cyan-500 text-slate-950"
              : "bg-slate-700 text-slate-200"
          } disabled:opacity-50`}
        >
          Select X
        </button>

        <button
          onClick={() => setSelectedPiece("O")}
          disabled={!isPlayerTurn || gameOver}
          className={`rounded px-6 py-2 font-bold transition-colors ${
            selectedPiece === "O"
              ? "bg-violet-500 text-white"
              : "bg-slate-700 text-slate-200"
          } disabled:opacity-50`}
        >
          Select O
        </button>
      </div>

      <div className="grid grid-cols-6 gap-1 rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-lg">
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            className="flex h-12 w-12 cursor-pointer items-center justify-center bg-slate-900 text-2xl font-bold transition-colors hover:bg-slate-800 sm:h-16 sm:w-16 sm:text-3xl"
          >
            <span
              className={
                cell === "X" ? "text-cyan-400" : "text-violet-400"
              }
            >
              {cell}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 h-8 text-xl font-semibold">
        {gameOver ? (
          <span className="text-emerald-400">{winnerText}</span>
        ) : isPlayerTurn ? (
          <span className="text-cyan-400">Your Turn</span>
        ) : (
          <span className="animate-pulse text-violet-400">
            AI is Thinking...
          </span>
        )}
      </div>
    </div>
  );
}

