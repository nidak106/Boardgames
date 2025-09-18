import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client"; // 🆕 socket

const BASE_URL = "https://baordgame-backend-production.up.railway.app";
const socket = io(BASE_URL); // 🆕 connect to backend

export default function App() {
  const [playerPositions, setPlayerPositions] = useState([1, 1]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showLovePopup, setShowLovePopup] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [myPlayer, setMyPlayer] = useState(null); // 0 = Nida, 1 = Ivan

  const loadGame = async () => {
    const res = await axios.get(`${BASE_URL}/api/game`);
    setPlayerPositions(res.data.playerPositions);
    setTurn(res.data.turn);
    setDice(res.data.dice);
    setWinner(res.data.winner);
  };

  useEffect(() => {
    loadGame();

    // 🆕 Listen for realtime game updates
    socket.on("gameUpdated", (data) => {
      setPlayerPositions(data.playerPositions);
      setTurn(data.turn);
      setDice(data.dice);
      setWinner(data.winner);
    });

    return () => {
      socket.off("gameUpdated");
    };
  }, []);

  const rollDice = async () => {
    await axios.post(`${BASE_URL}/api/roll`);
    // no need to manually set state, socket will update it
  };

  const resetGame = async () => {
    await axios.post(`${BASE_URL}/api/reset`);
    // state will be updated via socket
  };

  const renderBoard = () => {
    const cells = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const base = 100 - row * 10;
        const cellNum = row % 2 === 0 ? base - col : base - (9 - col);

        const isPlayer1 = playerPositions[0] === cellNum;
        const isPlayer2 = playerPositions[1] === cellNum;

        cells.push(
          <div
            key={cellNum}
            className="flex items-center justify-center border text-xs relative h-12 w-12 bg-gradient-to-br from-yellow-100 to-yellow-200"
          >
            <span className="opacity-40 absolute top-1 left-1">{cellNum}</span>
            <div className="flex absolute bottom-0 left-0 w-full h-full justify-center items-end space-x-1">
              {isPlayer1 && (
                <img src="/player1.png" alt="Player 1" className="w-12 h-12 z-10" />
              )}
              {isPlayer2 && (
                <img src="/player2.png" alt="Player 2" className="w-12 h-12 z-10" />
              )}
            </div>
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-gradient-to-r from-purple-300 to-pink-300 min-h-screen">

      {/* ... your intro / love popups ... */}

      {gameStarted && myPlayer !== null && (
        <>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            🐍 Snake & Ladder 🎲
          </h1>

          <div className="relative">
            <div className="grid grid-cols-10 border-4 border-yellow-600 rounded-lg shadow-lg">
              {renderBoard()}
            </div>
            {/* snake + ladder images */}
          </div>

          <p className="text-lg text-white drop-shadow-md">
            {winner ? winner : `🎮 Turn: ${turn === 0 ? "Nida" : "Ivan"}`}
          </p>

          <div className="flex items-center space-x-3">
            {dice && <img src={`/dice${dice}.png`} alt={`Dice ${dice}`} className="w-12 h-12" />}
            <p className="text-xl text-white">Dice: {dice ?? "-"}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={rollDice}
              disabled={!!winner || myPlayer !== turn}
              className="px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Roll Dice
            </button>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}
