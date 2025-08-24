import { useNavigate } from "react-router-dom";
import css from "./HomePage.module.css";
import startSound from "/src/assets/audio/successMixkit.mp3.wav";
import { useState } from "react";
import Loader from "../../components/Loader/Loader";
import playIcon from "/src/assets/emages/btnStart.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGameStart = () => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    setLoading(true);
    setTimeout(() => {
      navigate("/gamemain");
    }, 1500); // плавний перехід після 1.5 с
  };

  return (
    <section className={css.container}>
      {loading ? (
        <Loader />
      ) : (
        <div className={css.card}>
          <h1 className={css.title}>Tetris</h1>
          <div className={css.titleGlo}></div>
          <button
            onClick={handleGameStart}
            className={css.buttonStart}
            type="button"
          >
            <img src={playIcon} alt="" className={css.arrow} />
          </button>
          <div className={css.blockBottom}></div>
        </div>
      )}
    </section>
  );
}
