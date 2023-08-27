import React, { useState, useEffect } from "react";
import dataset from "./dataset";
import "../styles.css";
import correctSound from "./assets/correct.mp3";
import wrongSound from "./assets/wrong.mp3";
import gameOverSound from "./assets/gameover.mp3";
import cheersSound from "./assets/success.mp3";

const Game = () => {
  const [word, setWord] = useState();
  const [choice, setChoice] = useState("");
  const [newWord, setNewWord] = useState("");
  const [attempts, setAttempts] = useState();
  const [feedbackColor, setFeedbackColor] = useState("");
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState("");
  const [random, setRandom] = useState(null);
  const [guessedChars, setGuessedChars] = useState([]);
  // const [btn, setBtn]=useState('');

  const [showPopup, setShowPopup] = useState(false);

  const generate = () => {
    const randomIndex = Math.floor(Math.random() * 50);
    const selectedWord = dataset.words[randomIndex].word;
    setWord(selectedWord);

    setNewWord("_".repeat(selectedWord.length));
    setAttempts(3);
    setFeedbackColor("");
    setHint("");
    setRandom(randomIndex);
    setGuessedChars([]);
    setShowPopup(false);
  };

  const again = () => {
    const randomIndex = Math.floor(Math.random() * 50);
    const selectedWord = dataset.words[randomIndex].word;
    setWord(selectedWord);

    setNewWord("_".repeat(selectedWord.length));
    setAttempts(3);
    setFeedbackColor("");
    setHint("");
    setRandom(randomIndex);
    setGuessedChars([]);
    // setBtn('');
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
        setShowPopup(true);
        playSound(gameOverSound);
      } else {
        setFeedbackColor("red");
        setGuess("Wrong Guess");
        setNewWord(word);
        playSound(wrongSound);
      }
    } else {
      // debugger;
      if (newWord === word) {
        setFeedbackColor("green");
        setGuess("Right Guess");
        setShowPopup(true);
        playSound(cheersSound);
        setTimeout(() => {
          setFeedbackColor("");
          setGuess("");
          setWord("");
          // alert("Great! You Guessed the word right");
        }, 2000);

        return;
      } else {
        playSound(correctSound);
        setFeedbackColor("green");
        setGuess("Right Guess");
      }
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
        // setHint("");
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
    setShowPopup(false);
  };

  return (
    <>
      <h1>This is our Awesome Word Guessing Game</h1>
      {word ? "" : <p>Click the Button Below to Start the Game</p>}

      {word ? (
        <button onClick={generate}>New Word</button>
      ) : (
        <button onClick={generate}>Start</button>
      )}
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
      {word}
      <br />
      <p className={`inpt ${feedbackColor}`}>{guess}</p>
      {/* Word is : {word} and newWord is : {newWord} */}
      {showPopup && (
        <div className="game-over-popup">
          <div className="game-over-text">
            {word.length === newWord.length ? (
              <>
                <h5>Great</h5>
                <p> You Guessed it Right: {word}</p>
              </>
            ) : (
              <>
              attempts===0?(
                <p>Game Over!</p>
                <p>The word was: {word}</p>
              ):()
              </>
            )}
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
      <audio id="cheersSound">
        <source src={cheersSound} type="audio/mpeg" />
      </audio>
    </>
  );
};

export default Game;
