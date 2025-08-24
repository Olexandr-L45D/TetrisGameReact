# React + Vite

# game-tetris

🕹️ Game Flow (Roadmap)

Start the Application The app initializes with routing and basic navigation
setup.

Home Page Landing page with a Start Game button.

GameSettingModal / Settings Player selects the game settings (e.g., difficulty
level, speed, theme, language). Settings are stored in the application state.

TetrisGame / Game Board

Displays the Tetris grid (e.g., 10x20).

Handles falling Tetromino blocks.

Allows player to move, rotate, and drop blocks.

Detects collisions with the board edges or existing blocks.

Clears completed lines and updates the score.

Handles increasing difficulty (speed up) as the game progresses.

Game Logic (Core)

Manages spawning and movement of Tetromino shapes.

Checks for line completions.

Tracks current score, level, and cleared lines.

Detects Game Over condition.

Includes animations for line clears and block placement.

GameOverModal / Result Screen

Displays Game Over message with final score.

Shows stats (lines cleared, level reached).

## Includes a Play Again button to reset and start a new game.

Features

Classic Tetris gameplay.

Configurable difficulty and speed.

Smooth animations for falling blocks and line clears.

Audio feedback for actions (move, rotate, clear line).

Score, level, and progress tracking.

Replay option to start a new game instantly.

## Build Notes

- Ensure proper signing configuration if building for Android:
  ```properties
  RELEASE_STORE_FILE=keystore/my-release-key.jks
  RELEASE_STORE_PASSWORD=yourKeystorePassword
  RELEASE_KEY_ALIAS=my-key-alias
  RELEASE_KEY_PASSWORD=yourKeyPassword
  ```
  ##
  Суть гри Тетріс полягає в тому, щоб складати падаючі фігури з різнокольорових
  блоків (тетраміно), формуючи з них суцільні горизонтальні та вертикальні лінії
  в ігровому квадратному полі. Коли така лінія утворюється, вона зникає, а
  блоки, що знаходяться вище, опускаються вниз, звільняючи місце для нових
  фігур. Гравець повинен якомога довше запобігати заповненню стакана догори, щоб
  не програти, та набирати бали, заповнюючи ці лінії.
