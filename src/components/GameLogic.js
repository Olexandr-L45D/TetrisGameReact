const COLORS = [
  "#00fc54af", // салатово-зелений
  "hsla(240, 76%, 31%, 1.00)", // синій
  "#00BFFF", // голубий
  "#FFFF00", // жовтий
  "#800080", // фіолетовий
  "#ffa60090", // оранжевий
  "#ec1090ff", // червоний (рідкісний бонусний)
];

const getRandomColor = () => {
  const rareChance = Math.random();
  if (rareChance < 0.05) return COLORS[6];
  return COLORS[Math.floor(Math.random() * 6)];
};

// Обрізання зайвих порожніх рядів/колонок (нормалізація координат)
const normalizeShape = cells => {
  const minRow = Math.min(...cells.map(c => c.row));
  const minCol = Math.min(...cells.map(c => c.col));
  return cells.map(c => ({
    row: c.row - minRow,
    col: c.col - minCol,
  }));
};

// 🔧 Генерація випадкових фігур (ПОВЕРТАЄ 2D-матриці кольорів без зайвих порожніх полів)
export const generateShapes = (count = 5) => {
  // Більше прямокутних/прямих фігур
  const templates = [
    // 3 горизонтальні
    {
      cells: normalizeShape([{ row: 0, col: 0 }]),
    },
    {
      cells: normalizeShape([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ]),
    },
    {
      cells: normalizeShape([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]),
    },
    // 3 вертикальні
    {
      cells: normalizeShape([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 },
      ]),
    },
    {
      cells: normalizeShape([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]),
    },
    // 4x1 лінія
    {
      cells: normalizeShape([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 },
      ]),
    },
    // 2x3 прямокутник
    {
      cells: normalizeShape([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]),
    },
    // Г-подібна коротка
    {
      cells: normalizeShape([
        { row: 0, col: 0 },
        { row: 1, col: 0 },
      ]),
    },
    {
      cells: normalizeShape([
        { row: 1, col: 0 },
        { row: 0, col: 0 },
      ]),
    },
    // квадрат 2*2
    {
      cells: normalizeShape([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ]),
    },
  ];

  const shapes = [];
  for (let i = 0; i < count; i++) {
    const t = templates[Math.floor(Math.random() * templates.length)];
    const color = getRandomColor();

    // Будуємо мінімальну 2D-матрицю розміром (maxRow+1) x (maxCol+1)
    const maxRow = Math.max(...t.cells.map(c => c.row));
    const maxCol = Math.max(...t.cells.map(c => c.col));
    const rows = maxRow + 1;
    const cols = maxCol + 1;

    const matrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );

    t.cells.forEach(({ row, col }) => {
      matrix[row][col] = color; // один колір на всю фігуру
    });

    shapes.push(matrix);
  }
  return shapes;
};

// перевірка повних рядків і стовпців
export const checkFullLines = board => {
  const size = board.length;
  const fullRows = [];
  const fullCols = [];

  for (let r = 0; r < size; r++) {
    if (board[r].every(cell => cell !== null)) fullRows.push(r);
  }
  for (let c = 0; c < size; c++) {
    if (board.every(row => row[c] !== null)) fullCols.push(c);
  }
  return { fullRows, fullCols };
};

// очищення
export const clearLines = (board, fullRows, fullCols) => {
  const newBoard = board.map(row => [...row]);
  fullRows.forEach(r => newBoard[r].fill(null));
  fullCols.forEach(c => newBoard.forEach(row => (row[c] = null)));
  return newBoard;
};

// утіліта для пересуву клітин/ utils/getCellFromCoords.js
export function getCellFromCoords(x, y, cellSize = 34, gap = 2) {
  const effectiveCellSize = cellSize + gap;

  const col = Math.floor(x / effectiveCellSize);
  const row = Math.floor(y / effectiveCellSize);

  return { row, col };
}
