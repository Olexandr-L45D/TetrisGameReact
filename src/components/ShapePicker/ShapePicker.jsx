import { useEffect, useState } from "react";
import css from "./TetrisGame.module.css";
import { FiSettings } from "react-icons/fi";
import { generateShapes, checkFullLines, clearLines } from "../GameLogic";
import GameBoard from "../GameBoard/GameBoard";
import ShapePickerMobileDrag from "../ShapePickerMobileDrag/ShapePickerMobileDrag";
import LogoGame from "/src/assets/emages/TetrisLogoGame.png";

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

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          if (!newGrid[row + r] || newGrid[row + r][col + c] !== null) {
            canPlace = false;
          }
        }
      }
    }

    if (!canPlace) return;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          newGrid[row + r][col + c] = shape[r][c];
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

  return (
    <main className={css.containerGame}>
      <div className={css.container}>
        <header className={css.headerContainer}>
          <section className={css.header}>
            <img src={LogoGame} alt="Tetris Logo" className={css.logoGame} />

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

        <ShapePickerMobileDrag
          shapes={shapes}
          onDrop={(row, col, shape) => handleDropShape(shape, row, col)}
        />
      </div>
    </main>
  );
};

export default TetrisGame;

// import css from "./ShapePicker.module.css";

// const ShapePicker = ({ shapes }) => {
//   const handleDragStart = (e, shape) => {
//     e.dataTransfer.setData("shape", JSON.stringify(shape));
//   };

//   return (
//     <footer className={css.shapePicker}>
//       {shapes.map((shape, index) => (
//         <div
//           key={index}
//           className={css.shape}
//           draggable
//           onDragStart={e => handleDragStart(e, shape)}
//         >
//           {shape.map((row, r) => (
//             <div key={r} className={css.shapeRow}>
//               {row.map((cell, c) => (
//                 <div
//                   key={c}
//                   className={css.shapeCell}
//                   style={{ backgroundColor: cell || "transparent" }}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       ))}
//     </footer>
//   );
// };

// export default ShapePicker;
