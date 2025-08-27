import { useEffect, useState } from "react";
import css from "./TetrisGame.module.css";
import { FiSettings } from "react-icons/fi";
import { generateShapes, checkFullLines, clearLines } from "../GameLogic";
import GameBoard from "../GameBoard/GameBoard";
import ShapePickerMobile from "../ShapePickerMobile/ShapePickerMobile";
import logoIcon from "/src/assets/emages/LogoSmailGame.png";
import restartSound from "/src/assets/audio/mixKids.mp3.wav";
import playIcon from "/src/assets/emages/play.png";
import { useNavigate } from "react-router-dom";
import winSound from "/src/assets/audio/allclicks.mp3.wav";

const GRID_SIZE = 8;

const TetrisGame = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const [highlightLogo, setHighlightLogo] = useState(false);

  // 🔥 новий стан для анімації рядків
  const [highlightRows, setHighlightRows] = useState([]);
  const [highlightCols, setHighlightCols] = useState([]);

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

    // ставимо фігуру
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          newGrid[row + r][col + c] = shape[r][c];
        }
      }
    }

    // перевірка заповнених рядків/стовпців
    const { fullRows, fullCols } = checkFullLines(newGrid);
    if (fullRows.length || fullCols.length) {
      // 🔥 1. запускаємо звук
      const audio = new Audio(winSound);
      audio.play().catch(() => {});

      // 🔥 2. підсвітка
      setHighlightRows(fullRows);
      setHighlightCols(fullCols);

      // 🔥 3. затримка 1 сек перед очищенням
      setTimeout(() => {
        const cleared = clearLines(newGrid, fullRows, fullCols);
        setGrid(cleared);

        const points = (fullRows.length + fullCols.length) * GRID_SIZE * 2;
        setScore(prev => prev + points);
        setTotalScore(prev => prev + points);

        // скидаємо підсвітку
        setHighlightRows([]);
        setHighlightCols([]);
      }, 1000);
    } else {
      setGrid(newGrid);
    }

    setShapes(generateShapes(3));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true); //  показуємо через 20 секунд
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  const [grid, setGrid] = useState(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
  );
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [shapes, setShapes] = useState(generateShapes(3));

  // 🔥 новий стан для підсвітки логотипа

  // ініціалізація (витягнути рекорд з localStorage)
  useEffect(() => {
    const savedTotal = localStorage.getItem("totalScore");
    if (savedTotal) setTotalScore(Number(savedTotal));
  }, []);

  // збереження рекорду
  useEffect(() => {
    localStorage.setItem("totalScore", totalScore);
  }, [totalScore]);

  // 🔥 ефект для підсвітки кожні 100 балів
  useEffect(() => {
    if (totalScore > 0 && totalScore % 100 === 0) {
      setHighlightLogo(true);
      const timer = setTimeout(() => setHighlightLogo(false), 5000); // 3s
      return () => clearTimeout(timer);
    }
  }, [totalScore]);

  // const handleDropShape = (shape, row, col) => {
  //   const newGrid = grid.map(r => [...r]);
  //   let canPlace = true;

  //   // перевіряємо чи можна поставити
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

  //   // ставимо фігуру
  //   for (let r = 0; r < shape.length; r++) {
  //     for (let c = 0; c < shape[r].length; c++) {
  //       if (shape[r][c]) {
  //         newGrid[row + r][col + c] = shape[r][c]; // колір
  //       }
  //     }
  //   }

  //   // перевірка заповнених рядків/стовпців
  //   const { fullRows, fullCols } = checkFullLines(newGrid);
  //   if (fullRows.length || fullCols.length) {
  //     const cleared = clearLines(newGrid, fullRows, fullCols);
  //     setGrid(cleared);

  //     const points = (fullRows.length + fullCols.length) * GRID_SIZE * 2; // 1 клітинка = 2 бали
  //     setScore(prev => prev + points);
  //     setTotalScore(prev => prev + points);
  //   } else {
  //     setGrid(newGrid);
  //   }
  //   // нові фігури
  //   setShapes(generateShapes(3));
  // };

  const handleGameFinall = () => {
    const audio = new Audio(restartSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <main className={css.containerGame}>
      <div className={css.container}>
        {/* Header */}
        <header className={css.headerContainer}>
          <section className={css.header}>
            <div
              className={`${css.logoGame} ${
                highlightLogo ? css.highlight : ""
              }`}
            >
              <img src={logoIcon} alt="Game Logo" className={css.logoGame} />
            </div>

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

        {/* Main Board компонент сітки гри з анімацією*/}
        <GameBoard
          grid={grid}
          onDropShape={handleDropShape}
          highlightRows={highlightRows}
          highlightCols={highlightCols}
        />

        {/* компонент з генерацією різних фігур різного кольору */}
        <ShapePickerMobile shapes={shapes} onDropShape={handleDropShape} />
        <button
          onClick={handleGameFinall}
          className={`${css.button} ${showButton ? css.visible : ""}`}
          aria-hidden={!showButton}
          tabIndex={showButton ? 0 : -1}
          type="button"
        >
          Play Game Again
          <img src={playIcon} alt="" className={css.arrow} />
        </button>
      </div>
    </main>
  );
};

export default TetrisGame;
