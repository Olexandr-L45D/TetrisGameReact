import { useEffect, useState } from "react";
import { getCellFromCoords } from "../GameLogic";
import css from "./GameBoard.module.css";

const GRID_SIZE = 8;
const CELL_SIZE = 34;
const GAP = 2;

const COLORS = [
  "hsla(90, 84%, 34%, 1.00)", // зелений
  "rgba(10, 10, 148, 0.88)", // синій
  "#00BFFF", // голубий
  "#FFFF00", // жовтий
  "#800080", // фіолетовий
  "#FFA500", // оранжевий
  "#FF6347", // червоний (рідкісний бонус)
];

const getRandomColor = () =>
  Math.random() < 0.05 ? COLORS[6] : COLORS[Math.floor(Math.random() * 6)];

const makeFilledGrid = () =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => getRandomColor())
  );

const makeEmptyGrid = () =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );

const GameBoard = ({ grid, highlightRows = [], highlightCols = [] }) => {
  const [animatedGrid, setAnimatedGrid] = useState(makeFilledGrid());
  const [flashCells, setFlashCells] = useState([]);

  useEffect(() => {
    // 🔥 стартова анімація — підсвічує всі клітинки
    const timer = setTimeout(() => {
      const allCells = [];
      animatedGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) allCells.push(`${r}-${c}`);
        });
      });
      setFlashCells(allCells);

      // через 1с очистити дошку
      setTimeout(() => {
        setAnimatedGrid(makeEmptyGrid());
        setFlashCells([]);
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 ефект для підсвітки рядків/стовпців при заповненні
  useEffect(() => {
    if (highlightRows.length || highlightCols.length) {
      const cellsToFlash = [];

      highlightRows.forEach(r => {
        for (let c = 0; c < GRID_SIZE; c++) {
          cellsToFlash.push(`${r}-${c}`);
        }
      });

      highlightCols.forEach(c => {
        for (let r = 0; r < GRID_SIZE; r++) {
          cellsToFlash.push(`${r}-${c}`);
        }
      });

      setFlashCells(cellsToFlash);

      const timer = setTimeout(() => setFlashCells([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [highlightRows, highlightCols]);

  // після стартової анімації показуємо справжню grid
  const finalGrid = animatedGrid.every(row => row.every(cell => cell === null))
    ? grid
    : animatedGrid;

  // ---- КЛІК ----
  const handleBoardClick = event => {
    const board = document.getElementById("game-board");
    if (!board) return;

    const rect = board.getBoundingClientRect();

    // координати кліку відносно контейнера
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { row, col } = getCellFromCoords(x, y, CELL_SIZE, GAP, {
      left: 0,
      top: 0,
    });

    console.log("Click at row:", row, "col:", col);
  };

  // ---- DROP ----
  const handleDrop = event => {
    event.preventDefault();
    const board = document.getElementById("game-board");
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { row, col } = getCellFromCoords(x, y, CELL_SIZE, GAP, {
      left: 0,
      top: 0,
    });

    console.log("Dropped at row:", row, "col:", col);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  return (
    <section className={css.boardContainer}>
      <div
        id="game-board"
        className={css.board}
        onClick={handleBoardClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {finalGrid.map((row, rIndex) =>
          row.map((cell, cIndex) => {
            const id = `${rIndex}-${cIndex}`;
            return (
              <div
                key={id}
                className={`${css.cell} ${
                  flashCells.includes(id) ? css.flash : ""
                }`}
                style={{ backgroundColor: cell || "transparent" }}
              />
            );
          })
        )}
      </div>
    </section>
  );
};

export default GameBoard;
