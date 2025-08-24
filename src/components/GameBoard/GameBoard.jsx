import { useEffect, useState } from "react";
import css from "./GameBoard.module.css";

const GRID_SIZE = 8;
const CELL = 32; // можна підганяти під пристрої
const GAP = 3; // має збігатися з CSS gap

const COLORS = [
  "rgba(43, 82, 4, 1)", // зелений
  "#0000FF", // синій
  "#00BFFF", // голубий
  "#FFFF00", // жовтий
  "#800080", // фіолетовий
  "#FFA500", // оранжевий
  "#FF6347", // червоний (рідкісний бонус)
];

const getRandomColor = () =>
  Math.random() < 0.05 ? COLORS[6] : COLORS[Math.floor(Math.random() * 6)];

// Генерація заповненої випадковими кольорами дошки
const makeFilledGrid = () =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => getRandomColor())
  );

// Генерація порожньої дошки
const makeEmptyGrid = () =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );

export default function GameBoard() {
  const [grid, setGrid] = useState(makeFilledGrid());
  const [flashCells, setFlashCells] = useState([]);

  useEffect(() => {
    // через 5 секунд очистити дошку з анімацією
    const timer = setTimeout(() => {
      const allCells = [];
      grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) allCells.push(`${r}-${c}`);
        });
      });
      setFlashCells(allCells);

      // після 1s підсвітки очистити
      setTimeout(() => {
        setGrid(makeEmptyGrid());
        setFlashCells([]);
      }, 1000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [grid]);

  return (
    <section className={css.boardContainer}>
      <ul
        className={css.board}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL}px)`,
          gap: `${GAP}px`,
          padding: "3px", // відступ щоб квадратики не обрізались
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const isFlashing = flashCells.includes(key);
            return (
              <li
                key={key}
                className={`${css.cell} ${isFlashing ? css.flash : ""}`}
                style={{
                  width: CELL,
                  height: CELL,
                  backgroundColor: cell || "transparent",
                }}
              />
            );
          })
        )}
      </ul>
    </section>
  );
}

// import { useEffect, useState } from "react";
// import css from "./GameBoard.module.css";

// const GRID_SIZE = 8;
// const CELL = 32; // можна підганяти під пристрої
// const GAP = 4; // має збігатися з CSS gap

// const COLORS = [
//   "rgba(43, 82, 4, 1)", // зелений
//   "#0000FF", // синій
//   "#00BFFF", // голубий
//   "#FFFF00", // жовтий
//   "#800080", // фіолетовий
//   "#FFA500", // оранжевий
//   "#FF6347", // червоний (рідкісний бонус)
// ];

// const getRandomColor = () =>
//   Math.random() < 0.05 ? COLORS[6] : COLORS[Math.floor(Math.random() * 6)];

// // Генерація заповненої випадковими кольорами дошки
// const makeFilledGrid = () =>
//   Array.from({ length: GRID_SIZE }, () =>
//     Array.from({ length: GRID_SIZE }, () => getRandomColor())
//   );

// // Генерація порожньої дошки
// const makeEmptyGrid = () =>
//   Array.from({ length: GRID_SIZE }, () =>
//     Array.from({ length: GRID_SIZE }, () => null)
//   );

// export default function GameBoard() {
//   const [grid, setGrid] = useState(makeFilledGrid());

//   useEffect(() => {
//     // через 5 секунд очистити дошку
//     const timer = setTimeout(() => {
//       setGrid(makeEmptyGrid());
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <section className={css.boardContainer}>
//       <ul
//         className={css.board}
//         style={{
//           display: "grid",
//           gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL}px)`,
//           gap: `${GAP}px`,
//         }}
//       >
//         {grid.map((row, rowIndex) =>
//           row.map((cell, colIndex) => (
//             <li
//               key={`${rowIndex}-${colIndex}`}
//               className={css.cell}
//               style={{
//                 width: CELL,
//                 height: CELL,
//                 backgroundColor: cell || "transparent",
//               }}
//             />
//           ))
//         )}
//       </ul>
//     </section>
//   );
// }

// import React from "react";
// import css from "./GameBoard.module.css";

// const GameBoard = ({ grid, onDropShape }) => {
//   const handleDrop = (e, row, col) => {
//     e.preventDefault();
//     const shapeData = e.dataTransfer.getData("shape");
//     if (shapeData) {
//       const shape = JSON.parse(shapeData);
//       onDropShape(shape, row, col);
//     }
//   };

//   const allowDrop = e => e.preventDefault();

//   return (
//     <section className={css.boardContainer}>
//       <div className={css.board}>
//         {grid.map((row, rIndex) =>
//           row.map((cell, cIndex) => (
//             <div
//               key={`${rIndex}-${cIndex}`}
//               className={css.cell}
//               style={{ backgroundColor: cell || "transparent" }}
//               onDrop={e => handleDrop(e, rIndex, cIndex)}
//               onDragOver={allowDrop}
//             />
//           ))
//         )}
//       </div>
//     </section>
//   );
// };

// export default GameBoard;
