import { useEffect, useState } from "react";
import css from "./TetrisGame.module.css";
import { FiSettings } from "react-icons/fi";
import { generateShapes, checkFullLines, clearLines } from "../GameLogic";
import GameBoard from "../GameBoard/GameBoard";
// import ShapePickerMobileDrag from "../ShapePickerMobileDrag/ShapePickerMobileDrag";
// import LogoGame from "/src/assets/emages/TetrisLogoGame.png";
import { FcOnlineSupport } from "react-icons/fc";
import ShapePicker from "../ShapePicker/ShapePicker";

const GRID_SIZE = 8;

const TetrisGame = () => {
  const [grid, setGrid] = useState(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
  );
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [shapes, setShapes] = useState(generateShapes(3));

  useEffect(() => {
    const savedTotal = localStorage.getItem("totalScore");
    if (savedTotal) setTotalScore(Number(savedTotal));
  }, []);

  useEffect(() => {
    localStorage.setItem("totalScore", totalScore);
  }, [totalScore]);

  const handleDropShape = (shape, row, col) => {
    const newGrid = grid.map(r => [...r]);
    let canPlace = true;

    for (let r = 0; r < shape.cells.length; r++) {
      for (let c = 0; c < shape.cells[r].length; c++) {
        if (shape.cells[r][c]) {
          if (!newGrid[row + r] || newGrid[row + r][col + c] !== null) {
            canPlace = false;
          }
        }
      }
    }

    if (!canPlace) return;

    for (let r = 0; r < shape.cells.length; r++) {
      for (let c = 0; c < shape.cells[r].length; c++) {
        if (shape.cells[r][c]) {
          newGrid[row + r][col + c] = shape.color;
        }
      }
    }

    const { fullRows, fullCols } = checkFullLines(newGrid);
    if (fullRows.length || fullCols.length) {
      const cleared = clearLines(newGrid, fullRows, fullCols);
      setGrid(cleared);

      const points = (fullRows.length + fullCols.length) * GRID_SIZE * 2;
      setScore(prev => prev + points);
      setTotalScore(prev => prev + points);
    } else {
      setGrid(newGrid);
    }

    setShapes(generateShapes(3));
  };

  // const handleDropShape = (shape, row, col) => {
  //   const newGrid = grid.map(r => [...r]);
  //   let canPlace = true;

  //   for (let r = 0; r < shape.length; r++) {
  //     for (let c = 0; c < shape[r].length; c++) {
  //       if (shape[r][c]) {
  //         if (!newGrid[row + r] || newGrid[row + r][col + c] !== null) {
  //           canPlace = false;
  //         }
  //       }
  //     }
  //   }

  //   if (!canPlace) return;

  //   for (let r = 0; r < shape.length; r++) {
  //     for (let c = 0; c < shape[r].length; c++) {
  //       if (shape[r][c]) {
  //         newGrid[row + r][col + c] = shape[r][c];
  //       }
  //     }
  //   }

  //   const { fullRows, fullCols } = checkFullLines(newGrid);
  //   if (fullRows.length || fullCols.length) {
  //     const cleared = clearLines(newGrid, fullRows, fullCols);
  //     setGrid(cleared);

  //     const points = (fullRows.length + fullCols.length) * GRID_SIZE * 2;
  //     setScore(prev => prev + points);
  //     setTotalScore(prev => prev + points);
  //   } else {
  //     setGrid(newGrid);
  //   }

  //   setShapes(generateShapes(3));
  // };

  return (
    <main className={css.containerGame}>
      <div className={css.container}>
        <header className={css.headerContainer}>
          <section className={css.header}>
            <FcOnlineSupport className={css.logoGame} />
            {/* <img src={LogoGame} alt="Tetris Logo" className={css.logoGame} /> */}

            <div className={css.scoreBox}>
              <div className={css.scoreBackgroun}>
                <span className={css.scoreLabel}></span>
                <span className={css.scoreValue}>{totalScore}</span>
              </div>
            </div>

            <FiSettings className={css.settingsIcon} />
          </section>
          <div className={css.scoreOverlay}>
            <div className={css.scoreSquare}></div>
            <span className={css.scoreValueto}>{score}</span>
          </div>
        </header>

        <GameBoard grid={grid} onDropShape={handleDropShape} />
        <ShapePicker shapes={shapes} />

        {/* <ShapePickerMobileDrag
          shapes={shapes}
          onDrop={(row, col, shape) => handleDropShape(shape, row, col)}
        /> */}
      </div>
    </main>
  );
};

export default TetrisGame;

// import { useEffect, useState } from "react";
// import css from "./TetrisGame.module.css";
// import { FiSettings } from "react-icons/fi";
// import { generateShapes, checkFullLines, clearLines } from "../GameLogic";
// import GameBoard from "../GameBoard/GameBoard";
// import ShapePicker from "../ShapePicker/ShapePicker";
// import LogoGame from "/src/assets/emages/TetrisLogoGame.png";

// const GRID_SIZE = 8;

// const TetrisGame = () => {
//   const [grid, setGrid] = useState(
//     Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
//   );
//   const [score, setScore] = useState(0);
//   const [totalScore, setTotalScore] = useState(0);
//   const [shapes, setShapes] = useState(generateShapes(3));

//   // ініціалізація (витягнути рекорд з localStorage)
//   useEffect(() => {
//     const savedTotal = localStorage.getItem("totalScore");
//     if (savedTotal) setTotalScore(Number(savedTotal));
//   }, []);

//   // збереження рекорду
//   useEffect(() => {
//     localStorage.setItem("totalScore", totalScore);
//   }, [totalScore]);

//   const handleDropShape = (shape, row, col) => {
//     const newGrid = grid.map(r => [...r]);
//     let canPlace = true;

//     // перевіряємо чи можна поставити
//     for (let r = 0; r < shape.length; r++) {
//       for (let c = 0; c < shape[r].length; c++) {
//         if (shape[r][c]) {
//           if (!newGrid[row + r] || newGrid[row + r][col + c] !== null) {
//             canPlace = false;
//           }
//         }
//       }
//     }

//     if (!canPlace) return;

//     // ставимо фігуру
//     for (let r = 0; r < shape.length; r++) {
//       for (let c = 0; c < shape[r].length; c++) {
//         if (shape[r][c]) {
//           newGrid[row + r][col + c] = shape[r][c]; // колір
//         }
//       }
//     }

//     // перевірка заповнених рядків/стовпців
//     const { fullRows, fullCols } = checkFullLines(newGrid);
//     if (fullRows.length || fullCols.length) {
//       const cleared = clearLines(newGrid, fullRows, fullCols);
//       setGrid(cleared);

//       const points = (fullRows.length + fullCols.length) * GRID_SIZE * 2; // 1 клітинка = 2 бали
//       setScore(prev => prev + points);
//       setTotalScore(prev => prev + points);
//     } else {
//       setGrid(newGrid);
//     }

//     // нові фігури
//     setShapes(generateShapes(3));
//   };

//   return (
//     <main className={css.containerGame}>
//       <div className={css.container}>
//         {/* Header */}
//         <header className={css.headerContainer}>
//           <section className={css.header}>
//             <img src={LogoGame} alt="" className={css.logoGame} />
//             {/* <FcBusinessman className={css.logoGame} /> */}

//             <div className={css.scoreBox}>
//               <div className={css.scoreBackgroun}>
//                 <span className={css.scoreLabel}></span>
//                 <span className={css.scoreValue}>{totalScore}</span>
//               </div>
//             </div>

//             <FiSettings className={css.settingsIcon} />
//           </section>
//           <div className={css.scoreOverlay}>
//             <div className={css.scoreSquare}></div>
//             <span className={css.scoreValueto}>{score}</span>
//           </div>
//         </header>

//         {/* Main Board */}
//         <GameBoard grid={grid} onDropShape={handleDropShape} />

//         {/* Shape Picker */}
//         <ShapePicker shapes={shapes} />
//       </div>
//     </main>
//   );
// };

// export default TetrisGame;

// <ShapePickerMobileDrag
//   shapes={shapes}
//   onDrop={(row, col, shape) => placeShapeOnBoard(shape, row, col)}
// />;

// import { useEffect, useState } from "react";
// import css from "./TetrisGame.module.css";
// import { FcBusinessman } from "react-icons/fc";
// import { FiSettings } from "react-icons/fi"; // шестерня

// const GRID_SIZE = 8;
// const COLORS = [
//   "#00fc54af", // салатово-зелений
//   "#0000FF", // синій
//   "#00BFFF", // голубий
//   "#FFFF00", // жовтий
//   "#800080", // фіолетовий
//   "#ffa60090", // оранжевий
//   "#FF6347", // червоний (рідкісний бонусний)
// ];

// const getRandomColor = () => {
//   const rareChance = Math.random();
//   if (rareChance < 0.05) return COLORS[6]; // 5% червоного
//   return COLORS[Math.floor(Math.random() * 6)];
// };

// const TetrisGame = () => {
//   const [grid, setGrid] = useState([]);
//   const [score, setScore] = useState(0);

//   // ініціалізація
//   useEffect(() => {
//     const savedScore = localStorage.getItem("gameScore");
//     if (savedScore) setScore(Number(savedScore));

//     const newGrid = Array.from({ length: GRID_SIZE }, () =>
//       Array.from({ length: GRID_SIZE }, () => getRandomColor())
//     );
//     setGrid(newGrid);
//   }, []);

//   // збереження скору
//   useEffect(() => {
//     localStorage.setItem("gameScore", score);
//   }, [score]);

//   return (
//     <section className={css.gameWrapper}>
//       <main className={css.containerGame}>
//         <div className={css.container}>
//           {/* Header */}
//           <header className={css.header}>
//             <FcBusinessman className={css.logoGame} />

//             <div className={css.scoreBox}>
//               <div className={css.scoreBackground}>
//                 <span className={css.scoreLabel}>Score</span>
//                 <span className={css.scoreValue}>{score}</span>
//               </div>
//             </div>

//             <FiSettings className={css.settingsIcon} />
//           </header>

//           {/* Main Board */}
//           <section className={css.boardContainer}>
//             <section className={css.boardWrapper}>
//               <div className={css.board}>
//                 {grid.map((row, rowIndex) =>
//                   row.map((color, colIndex) => (
//                     <div
//                       key={`${rowIndex}-${colIndex}`}
//                       className={css.cell}
//                       style={{ backgroundColor: color }}
//                     />
//                   ))
//                 )}
//               </div>
//             </section>
//           </section>

//           {/* Footer */}
//           <footer className={css.footer}>
//             <button className={css.button} onClick={() => setScore(0)}>
//               Reset Score
//             </button>
//           </footer>
//         </div>
//       </main>
//     </section>
//   );
// };

// export default TetrisGame;

// import { useEffect, useState } from "react";
// import css from "./TetrisGame.module.css";
// import { FcBusinessman } from "react-icons/fc";
// const GRID_SIZE = 8;
// const COLORS = [
//   "#00fc54af", // салатово-зелений
//   "#0000FF", // синій
//   "#00BFFF", // голубий
//   "#FFFF00", // жовтий
//   "#800080", // фіолетовий
//   "#ffa60090", // оранжевий
//   "#FF6347", // червоний (рідкісний бонусний)
// ];

// const getRandomColor = () => {
//   const rareChance = Math.random();
//   // Робимо червоний рідкісним
//   if (rareChance < 0.05) return COLORS[6];
//   return COLORS[Math.floor(Math.random() * 6)];
// };

// const TetrisGame = () => {
//   const [grid, setGrid] = useState([]);
//   const [score, setScore] = useState(0);

//   // ініціалізація
//   useEffect(() => {
//     const savedScore = localStorage.getItem("gameScore");
//     if (savedScore) setScore(Number(savedScore));

//     const newGrid = Array.from({ length: GRID_SIZE }, () =>
//       Array.from({ length: GRID_SIZE }, () => getRandomColor())
//     );
//     setGrid(newGrid);
//   }, []);

//   // збереження скору
//   useEffect(() => {
//     localStorage.setItem("gameScore", score);
//   }, [score]);

//   return (
//     <section className={css.gameWrapper}>
//       <main className={css.containerGame}>
//         <div className={css.container}>
//           {/* Header */}
//           <FcBusinessman className={css.logoGame} />
//           <header className={css.header}>
//             <h1 className={css.title}>Color Blocks</h1>
//             <div className={css.scoreBox}>
//               <span className={css.scoreLabel}>Score:</span>
//               <span className={css.scoreValue}>{score}</span>
//             </div>
//           </header>

//           {/* Main Board */}
//           <section className={css.boardContainer}>
//             <section className={css.boardWrapper}>
//               <div className={css.board}>
//                 {grid.map((row, rowIndex) =>
//                   row.map((color, colIndex) => (
//                     <div
//                       key={`${rowIndex}-${colIndex}`}
//                       className={css.cell}
//                       style={{ backgroundColor: color }}
//                     />
//                   ))
//                 )}
//               </div>
//             </section>
//           </section>
//           {/* Footer */}
//           <footer className={css.footer}>
//             <button className={css.button} onClick={() => setScore(0)}>
//               Reset Score
//             </button>
//           </footer>
//         </div>
//       </main>
//     </section>
//   );
// };

// export default TetrisGame;

//  <section className={`${css.gameWrapper} ${slideDown ? css.slideDown : ""}`}></section>
