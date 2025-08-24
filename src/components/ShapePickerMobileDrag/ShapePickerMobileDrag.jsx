import { useCallback, useEffect, useState } from "react";
import css from "./ShapePickerMobileDrag.module.css";

/**
 * ShapePickerMobileDrag
 * - Працює на мобілці й десктопі (Pointer Events)
 * - Показує "привид" фігури під час перетягування
 * - Викликає onDrop(row, col, shape) при відпусканні над полем
 *
 * Очікуваний формат shapes:
 * [
 *   { cells: [[1,1],[1,0]], color: "#66cc33" },
 *   { cells: [[1,1,1]],     color: "#ffd700" },
 * ]
 */
export default function ShapePickerMobileDrag({
  shapes = [],
  onDrop,
  boardId = "gameBoard",
  cellSize = 32,
  gap = 3,
  gridSize = 8,
  boardPadding = 3,
}) {
  const [dragged, setDragged] = useState(null); // { shape, offsetX, offsetY }
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e, shape) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragged({ shape, offsetX, offsetY });
    setPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = useCallback(
    e => {
      if (!dragged) return;
      setPos({ x: e.clientX, y: e.clientY });
    },
    [dragged]
  );

  const endDrag = useCallback(
    (clientX, clientY) => {
      if (!dragged) return;

      const board = document.getElementById(boardId);
      if (board) {
        const rect = board.getBoundingClientRect();
        const xIn = clientX - rect.left - boardPadding;
        const yIn = clientY - rect.top - boardPadding;

        if (xIn >= 0 && yIn >= 0 && xIn <= rect.width && yIn <= rect.height) {
          const step = cellSize + gap;
          const col = Math.floor(xIn / step);
          const row = Math.floor(yIn / step);

          if (
            row >= 0 &&
            row < gridSize &&
            col >= 0 &&
            col < gridSize &&
            typeof onDrop === "function"
          ) {
            onDrop(row, col, dragged.shape);
          }
        }
      }

      setDragged(null);
    },
    [dragged, boardId, boardPadding, cellSize, gap, gridSize, onDrop]
  );

  const handlePointerUp = useCallback(
    e => {
      endDrag(e.clientX, e.clientY);
    },
    [endDrag]
  );

  useEffect(() => {
    if (!dragged) return;

    const onMove = ev => handlePointerMove(ev);
    const onUp = ev => handlePointerUp(ev);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragged, handlePointerMove, handlePointerUp]);

  return (
    <div className={css.shapePickerContainer}>
      {shapes.map((shape, idx) => (
        <div
          key={idx}
          className={`${css.shape} ${
            dragged?.shape === shape ? css.dragging : ""
          }`}
          onPointerDown={e => handlePointerDown(e, shape)}
        >
          {shape.cells.map((row, r) => (
            <div key={r} className={css.row}>
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={`${css.cell} ${cell ? css.filled : ""}`}
                  style={
                    cell
                      ? { background: shape.color, borderColor: shape.color }
                      : undefined
                  }
                />
              ))}
            </div>
          ))}
        </div>
      ))}

      {/* Привид фігури під час drag */}
      {dragged && (
        <div
          className={css.shape}
          style={{
            position: "fixed",
            left: pos.x - dragged.offsetX,
            top: pos.y - dragged.offsetY,
            pointerEvents: "none",
            transform: "translateZ(0)",
            opacity: 0.9,
            zIndex: 9999,
          }}
        >
          {dragged.shape.cells.map((row, r) => (
            <div key={r} className={css.row}>
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={`${css.cell} ${cell ? css.filled : ""}`}
                  style={
                    cell
                      ? {
                          background: dragged.shape.color,
                          borderColor: dragged.shape.color,
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
