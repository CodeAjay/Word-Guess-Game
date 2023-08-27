import React, { useState, useEffect } from "react";
import dataset from "./dataset";
import "../styles.css";
import correctSound from "./assets/correct.mp3";
import wrongSound from "./assets/wrong.mp3";
import gameOverSound from "./assets/gameover.mp3";

const Game = () => {
  const [word, setWord] = useState("");
  const [choice, setChoice] = useState("");
  const [newWord, setNewWord] = useState("");
  const [attempts, setAttempts] = useState();
  const [feedbackColor, setFeedbackColor] = useState("");
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState("");
  const [random, setRandom] = useState(null);
  const [guessedChars, setGuessedChars] = useState([]);

  const generate = () => {
    const randomIndex = Math.floor(Math.random() * 50);
    const selectedWord = dataset.words[randomIndex].word;
    setWord(selectedWord);

    setNewWord("_".repeat(selectedWord.length));
    setAttempts(10);
    setFeedbackColor("");
    setHint("");
    setRandom(randomIndex);
    setGuessedChars([]);
  };

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.addEventListener("error", (e) => console.error("Audio error:", e));
    audio.addEventListener("canplaythrough", () =>
      console.log("Audio can play")
    );
    audio.addEventListener("ended", () => console.log("Audio ended"));
    audio.play();
  };

  const handleGuess = () => {
    // e.persist();
    // const vl = e.target.value.toLowerCase();
    const vl = choice.toLowerCase();
    setChoice(vl);
    if (choice.length !== 1) {
      alert("Please enter a single character");
      return;
    }

    if (guessedChars.includes(vl)) {
      alert("You already guessed this character");
      return;
    }

    let updatedWord = newWord;
    let found = false;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === vl) {
        updatedWord =
          updatedWord.substring(0, i) + vl + updatedWord.substring(i + 1);
        found = true;
      }
    }

    if (!found) {
      setAttempts(attempts - 1);
      if (attempts <= 5 && attempts > 1) {
        const remainingHints = dataset.words[random].hints.filter(
          (hint) => !guessedChars.includes(hint.toLowerCase())
        );
        const randomHintIndex = Math.floor(
          Math.random() * remainingHints.length
        );
        setHint(`Hint: ${remainingHints[randomHintIndex]}`);

        setFeedbackColor("red");
        setGuess("Wrong Guess");
        playSound(wrongSound);
      } else if (attempts === 1) {
        setNewWord(word);
        playSound(gameOverSound);
      } else {
        setFeedbackColor("red");
        setGuess("Wrong Guess");
        setNewWord(word);
        playSound(wrongSound);
      }
    } else {
      setFeedbackColor("green");
      setGuess("Right Guess");
      playSound(correctSound);
    }

    setNewWord(updatedWord);
    setChoice("");
    setGuessedChars([...guessedChars, vl]);
  };

  useEffect(() => {
    if (attempts === 0) {
      setNewWord(word);
    }
    if (feedbackColor || guess || hint) {
      const timer = setTimeout(() => {
        setFeedbackColor("");
        setGuess("");
        setHint("");
      }, 2000);

      const hintTimer = setTimeout(() => {
        setHint("");
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(hintTimer);
      };
    }
  }, [attempts, feedbackColor, guess, hint]);

  const closePopup = () => {
    setWord("");
    setNewWord("");
    setAttempts();
    setFeedbackColor("");
    setGuess("");
    setHint("");
    setRandom(null);
    setGuessedChars([]);
  };

  return (
    <>
      <h1>This is our Awesome Word Guessing Game</h1>
      <button onClick={generate}>New Word</button>
      <p>Attempts Left: {attempts}</p>
      <p>{hint}</p>
      <br />
      <p>{newWord.split("").join(" ")}</p>
      <input
        placeholder="Guess any character"
        className={`inpt ${feedbackColor}`}
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
        maxLength={1}
      />
      <br />
      <button onClick={handleGuess}>Guess</button>
      <br />
      <p className={`inpt ${feedbackColor}`}>{guess}</p>

      {attempts === 0 && (
        <div className="game-over-popup">
          <div className="game-over-text">
            <p>Game Over!</p>
            <p>The word was: {word}</p>
            <button onClick={generate}>Play Again</button>
          </div>
          <button className="popup-close" onClick={closePopup}>
            &#10006; {/* Cross icon */}
          </button>
        </div>
      )}

      <audio id="correctSound">
        <source src={correctSound} type="audio/mpeg" />
      </audio>
      <audio id="wrongSound">
        <source src={wrongSound} type="audio/mpeg" />
      </audio>
      <audio id="gameOverSound">
        <source src={gameOverSound} type="audio/mpeg" />
      </audio>
    </>
  );
};

export default Game;
