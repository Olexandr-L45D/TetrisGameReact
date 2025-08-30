import { useEffect, useState } from "react";
import css from "./GameMainPage.module.css";
import startSound from "/src/assets/audio/successMixkit.mp3.wav";
import TetrisGame from "../../components/TetrisGame/TetrisGame";

const GameMainPage = () => {
  const [startGame, setStartGame] = useState(false);
  useEffect(() => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    setStartGame(true);
  }, []);

  return (
    <section className={css.container}>{startGame && <TetrisGame />}</section>
  );
};

export default GameMainPage;
