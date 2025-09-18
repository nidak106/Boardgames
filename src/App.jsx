import { useState } from "react";

// 🐍 Match these to your image positions
const snakes = {
  16: 5,   // snake1 (bottom right area)
  57: 22,  // snake3 (middle board)
  86: 66,  // snake4 (top area)
  98: 27  ,
  92:71 // snake2 (big diagonal one)
};

// 🪜 Match these to your image positions
const ladders = {
  13: 49,  
  42: 79,  
  52: 71
};

export default function App() {
  const [playerPositions, setPlayerPositions] = useState([1, 1]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showLovePopup, setShowLovePopup] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);

    setPlayerPositions((prev) => {
      const newPositions = [...prev];
      let nextPos = newPositions[turn] + roll;

      if (nextPos <= 100) {
        // show the new square first
        newPositions[turn] = nextPos;

        const snakeTarget = snakes[nextPos];
        const ladderTarget = ladders[nextPos];

        if (snakeTarget || ladderTarget) {
          setTimeout(() => {
            setPlayerPositions((prev2) => {
              const updated = [...prev2];
              updated[turn] = snakeTarget || ladderTarget;
              return updated;
            });
          }, 800); // delay so it doesn't "disappear"
        }
      }

      return newPositions;
    });

    setTurn((prev) => (prev === 0 ? 1 : 0));
  };

  const resetGame = () => {
    setPlayerPositions([1, 1]);
    setTurn(0);
    setDice(null);
  };

  const renderBoard = () => {
    const cells = [];
    for (let row = 0; row < 10; row++) {
      const rowCells = [];
      for (let col = 0; col < 10; col++) {
        // Calculate cell number based on left-to-right pattern
        const base = 100 - row * 10;
        const cellNum =
          row % 2 === 0
            ? base - col // left-to-right for even rows
            : base - (9 - col); // right-to-left for odd rows

        const isPlayer1 = playerPositions[0] === cellNum;
        const isPlayer2 = playerPositions[1] === cellNum;

        rowCells.push(
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
      cells.push(...rowCells);
    }
    return cells;
  };

  const winner =
    playerPositions[0] === 100
      ? "Nida Wins 🎉"
      : playerPositions[1] === 100
      ? "Ivan Wins 🎉"
      : null;

  return (
    <div className="flex flex-col items-center p-6 space-y-6 bg-gradient-to-r from-purple-300 to-pink-300 min-h-screen">

      {/* Intro Popup */}
      {showIntro && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-2xl font-bold mb-4">🎲 Ivan & Nida's Board Game 🎲</h2>
            <button
              onClick={() => {
                setShowIntro(false);
                setShowLovePopup(true);
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              Play
            </button>
          </div>
        </div>
      )}

      {/* Love Popup */}
      {showLovePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-2xl font-bold mb-4">❤ Do you love Nida? ❤</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLovePopup(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowLovePopup(false);
                  setGameStarted(true);
                }}
                className="px-6 py-2 bg-rose-300 text-white rounded-xl hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Section */}
      {gameStarted && (
        <>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            🐍 Snake & Ladder 🎲
          </h1>

          {/* Board with snakes/ladders */}
          <div className="relative">
            <div className="grid grid-cols-10 border-4 border-yellow-600 rounded-lg shadow-lg">
              {renderBoard()}
            </div>

            {/* Snake images */}
            <img
              src="/snake1.png"
              alt="Snake 1"
              className="absolute"
              style={{ top: "83%", left: "40%", width: "16%", transform: "rotate(70deg)" }}
            />
            <img
              src="/snake3.png"
              alt="Snake 2"
              className="absolute"
              style={{ top: "45%", left: "10%", width: "28%", transform: "rotate(90deg)" }}
            />
            <img
              src="/snake4.png"
              alt="Snake 3"
              className="absolute"
              style={{ top: "10%", left: "50%", width: "30%", transform: "rotate(0deg)" }}
            />
            <img
              src="/snake2.png"
              alt="Snake 4"
              className="absolute"
              style={{ top: "-6%", left: "15%", width: "60%", transform: "rotate(-60deg)" }}
            />
            <img
              src="/snake1.png"
              alt="Snake 4"
              className="absolute"
              style={{ top: "8%", left: "77%", width: "25%", transform: "rotate(60deg)" }}
            />

            {/* Ladder images */}
            <img
              src="/ladder1.png"
              alt="Ladder 1"
              className="absolute"
              style={{ top: "22%", left: "85%", width: "8%", transform: "rotate(30deg)" }}
            />
            <img
              src="/ladder1.png"
              alt="Ladder 2"
              className="absolute"
              style={{ top: "57%", left: "75%", width: "10%", transform: "rotate(25deg)" }}
            />
            <img
              src="/ladder1.png"
              alt="Ladder 3"
              className="absolute"
              style={{ top: "28%", left: "10%", width: "10%", transform: "rotate(-6deg)" }}
            />
          </div>

          <p className="text-lg text-white drop-shadow-md">
            {winner ? winner : `🎮 Turn: ${turn === 0 ? "Nida" : "Ivan"}`}
          </p>

          <div className="flex items-center space-x-3">
            {dice && (
              <img
                src={`/dice${dice}.png`}
                alt={`Dice ${dice}`}
                className="w-12 h-12"
              />
            )}
            <p className="text-xl text-white">Dice: {dice ?? "-"}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={rollDice}
              disabled={!!winner}
              className="px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600"
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
