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

// 🔍 Пошук групи однакових кольорів >= 6 клітинок (простий DFS)
const findMatches = grid => {
  const visited = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => false)
  );
  const matches = [];

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const dfs = (r, c, color, group) => {
    if (
      r < 0 ||
      c < 0 ||
      r >= GRID_SIZE ||
      c >= GRID_SIZE ||
      visited[r][c] ||
      grid[r][c] !== color
    ) {
      return;
    }
    visited[r][c] = true;
    group.push([r, c]);
    for (const [dr, dc] of directions) {
      dfs(r + dr, c + dc, color, group);
    }
  };

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!visited[r][c] && grid[r][c]) {
        const group = [];
        dfs(r, c, grid[r][c], group);
        if (group.length >= 6) {
          matches.push(...group);
        }
      }
    }
  }

  return matches;
};

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
  }, []);

  // 🔄 Виклик при кожній зміні grid — шукаємо групи
  useEffect(() => {
    const matches = findMatches(grid);
    if (matches.length > 0) {
      const keys = matches.map(([r, c]) => `${r}-${c}`);
      setFlashCells(keys);

      setTimeout(() => {
        setGrid(prev => {
          const newGrid = prev.map(row => [...row]);
          matches.forEach(([r, c]) => {
            newGrid[r][c] = null;
          });
          return newGrid;
        });
        setFlashCells([]);
      }, 1000);
    }
  }, [grid]);

  return (
    <section className={css.boardContainer}>
      <ul
        className={css.board}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL}px)`,
          gap: `${GAP}px`,
          padding: "3px",
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
// const GAP = 3; // має збігатися з CSS gap

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
//   const [flashCells, setFlashCells] = useState([]);

//   useEffect(() => {
//     // через 5 секунд очистити дошку з анімацією
//     const timer = setTimeout(() => {
//       const allCells = [];
//       grid.forEach((row, r) => {
//         row.forEach((cell, c) => {
//           if (cell) allCells.push(`${r}-${c}`);
//         });
//       });
//       setFlashCells(allCells);

//       // після 1s підсвітки очистити
//       setTimeout(() => {
//         setGrid(makeEmptyGrid());
//         setFlashCells([]);
//       }, 1000);
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [grid]);

//   return (
//     <section className={css.boardContainer}>
//       <ul
//         className={css.board}
//         style={{
//           display: "grid",
//           gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL}px)`,
//           gap: `${GAP}px`,
//           padding: "3px", // відступ щоб квадратики не обрізались
//         }}
//       >
//         {grid.map((row, rowIndex) =>
//           row.map((cell, colIndex) => {
//             const key = `${rowIndex}-${colIndex}`;
//             const isFlashing = flashCells.includes(key);
//             return (
//               <li
//                 key={key}
//                 className={`${css.cell} ${isFlashing ? css.flash : ""}`}
//                 style={{
//                   width: CELL,
//                   height: CELL,
//                   backgroundColor: cell || "transparent",
//                 }}
//               />
//             );
//           })
//         )}
//       </ul>
//     </section>
//   );
// }

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
