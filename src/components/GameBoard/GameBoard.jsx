import { useEffect, useState } from "react";
import css from "./GameBoard.module.css";

const GRID_SIZE = 8;
const COLORS = [
  "rgba(43, 82, 4, 1)", // зелений
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
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 ефект для підсвітки рядків/стовпців при заповненні
  useEffect(() => {
    if (highlightRows.length || highlightCols.length) {
      const cellsToFlash = [];

      // підсвічуємо повні рядки
      highlightRows.forEach(r => {
        for (let c = 0; c < GRID_SIZE; c++) {
          cellsToFlash.push(`${r}-${c}`);
        }
      });

      // підсвічуємо повні колонки
      highlightCols.forEach(c => {
        for (let r = 0; r < GRID_SIZE; r++) {
          cellsToFlash.push(`${r}-${c}`);
        }
      });

      setFlashCells(cellsToFlash);

      // прибираємо підсвітку через 1с
      const timer = setTimeout(() => setFlashCells([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [highlightRows, highlightCols]);

  // після стартової анімації показуємо справжню grid
  const finalGrid = animatedGrid.every(row => row.every(cell => cell === null))
    ? grid
    : animatedGrid;

  return (
    <section className={css.boardContainer}>
      <div id="game-board" className={css.board}>
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

// працювало без підсвітки заповнених 8 клітин

// import { useEffect, useState } from "react";
// import css from "./GameBoard.module.css";

// const GRID_SIZE = 8;
// const COLORS = [
//   "rgba(43, 82, 4, 1)", // зелений
//   "rgba(10, 10, 148, 0.88)", // синій
//   "#00BFFF", // голубий
//   "#FFFF00", // жовтий
//   "#800080", // фіолетовий
//   "#FFA500", // оранжевий
//   "#FF6347", // червоний (рідкісний бонус)
// ];

// const getRandomColor = () =>
//   Math.random() < 0.05 ? COLORS[6] : COLORS[Math.floor(Math.random() * 6)];

// const makeFilledGrid = () =>
//   Array.from({ length: GRID_SIZE }, () =>
//     Array.from({ length: GRID_SIZE }, () => getRandomColor())
//   );

// const makeEmptyGrid = () =>
//   Array.from({ length: GRID_SIZE }, () =>
//     Array.from({ length: GRID_SIZE }, () => null)
//   );

// const GameBoard = ({ grid }) => {
//   const [animatedGrid, setAnimatedGrid] = useState(makeFilledGrid());
//   const [flashCells, setFlashCells] = useState([]);

//   useEffect(() => {
//     // через 4с підсвітити всі клітинки
//     const timer = setTimeout(() => {
//       const allCells = [];
//       animatedGrid.forEach((row, r) => {
//         row.forEach((cell, c) => {
//           if (cell) allCells.push(`${r}-${c}`);
//         });
//       });
//       setFlashCells(allCells);

//       // через 1с очистити дошку
//       setTimeout(() => {
//         setAnimatedGrid(makeEmptyGrid());
//         setFlashCells([]);
//       }, 1000);
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, []);

//   // після ефекту "яскравого старту" показуємо справжню grid
//   const finalGrid = animatedGrid.every(row => row.every(cell => cell === null))
//     ? grid
//     : animatedGrid;

//   return (
//     <section className={css.boardContainer}>
//       <div id="game-board" className={css.board}>
//         {finalGrid.map((row, rIndex) =>
//           row.map((cell, cIndex) => {
//             const id = `${rIndex}-${cIndex}`;
//             return (
//               <div
//                 key={id}
//                 className={`${css.cell} ${
//                   flashCells.includes(id) ? css.flash : ""
//                 }`}
//                 style={{ backgroundColor: cell || "transparent" }}
//               />
//             );
//           })
//         )}
//       </div>
//     </section>
//   );
// };

// export default GameBoard;

// // GameBoard.jsx
// import css from "./GameBoard.module.css";

// const GameBoard = ({ grid }) => {
//   return (
//     <section className={css.boardContainer}>
//       {/* саме цей елемент матиме фіксований id */}
//       <div id="game-board" className={css.board}>
//         {grid.map((row, rIndex) =>
//           row.map((cell, cIndex) => (
//             <div
//               key={`${rIndex}-${cIndex}`}
//               className={css.cell}
//               style={{ backgroundColor: cell || "transparent" }}
//             />
//           ))
//         )}
//       </div>
//     </section>
//   );
// };

// export default GameBoard;

// // import React from "react";
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
