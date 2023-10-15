import React, { useEffect, useState } from "react";
import { LevenshteinDistance } from "./Lev";
import { GuessStoreHelper } from "./Helpers/GuessStore";
import { GameHelper } from "./Helpers/GameHelper";
import { IconButton, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";

function App() {
  const [currentInput, setCurrentInput] = useState<string>("");
  const [lastWord, setLastWord] = useState<string>("");
  const [distance, setDistance] = useState<number>();
  const [winState, setWinState] = useState<boolean>(false);

  const [hint, setHint] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);

  const [alreadyGuessed, setAlreadyGuessed] = useState<string>("");

  const gameId = GameHelper.GetGameId();
  const todaysWord = GameHelper.GetTodaysWord();

  const [guesses, setGuesses] = useState(
    GuessStoreHelper.getAllGuesses(gameId)
  );

  const reset = () => {
    setCurrentInput("");
    setLastWord("");
    setDistance(undefined);
    setWinState(false);
    setHint("");
    setShowHint(false);
    setAlreadyGuessed("");
    setGuesses([]);
    GuessStoreHelper.clearAll();
  };

  const handleSubmit = () => {
    const currentDistance = LevenshteinDistance(currentInput, todaysWord);
    console.log(currentDistance);
    const guess = {
      value: currentInput,
      distance: currentDistance.distance,
    };

    if (currentDistance.distance === 0) {
      setWinState(true);
    } else {
      setWinState(false);
    }

    const alreadyGuessed = guesses.find(
      (o) => o.value.toLowerCase() === guess.value.toLowerCase()
    );

    setDistance(guess.distance);
    setLastWord(guess.value);
    setCurrentInput("");

    if (!alreadyGuessed) {
      setAlreadyGuessed("");
      GuessStoreHelper.storeGuess(gameId, guess);
      setGuesses((prev) => {
        return [...prev, guess];
      });
    } else {
      setAlreadyGuessed(guess.value);
    }
  };

  useEffect(() => {
    const guesses = GuessStoreHelper.getAllGuesses(gameId);
    const winCheck = guesses.find((o) => o.distance === 0);
    setWinState(!!winCheck);

    const lastGuess = guesses[guesses.length - 1];
    if (!lastGuess) return;
    setDistance(lastGuess.distance);
    setLastWord(lastGuess.value);
    setCurrentInput("");
  }, [gameId]);

  useEffect(() => {
    if (lastWord.length < todaysWord.length) {
      setHint("You are missing some letters");
    }
    if (lastWord.length > todaysWord.length) {
      setHint("Your word has too many letters");
    }
    if (lastWord.length === todaysWord.length) {
      setHint(
        `Your word is the correct length but ${distance} letter(s) are either incorrect or in the wrong position`
      );
    }
  }, [lastWord, distance, todaysWord]);

  return (
    <div className="App">
      <h1>Some Word Game</h1>

      <div className="main-wrapper">
        <form
          className="word-input"
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
          }}
        >
          <input
            disabled={winState}
            className="guess-input"
            type="text"
            placeholder="Type a word"
            pattern="[a-zA-Z]+"
            required
            value={currentInput}
            onChange={(ev) => {
              setCurrentInput(ev.target.value);
            }}
          />

          <Button
            disabled={winState}
            variant="contained"
            disableElevation
            className="guess-button"
            type="submit"
          >
            <SendIcon />
          </Button>
        </form>

        <div className="current-container">
          {lastWord && winState && (
            <div className="winning-guess">
              <span className="last-word">{lastWord}</span> is the answer! You
              did it in {guesses.length} guesses!
            </div>
          )}
          {lastWord && !winState && (
            <div className="incorrect-guess">
              <div className="guess-description">
                <span className="last-word">{lastWord}</span> is{" "}
                <span className="distance">{distance}</span> operations away
                from the answer.
                <Tooltip
                  title="An operation can be either adding, removing or replacing a letter
              in the word."
                >
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </div>

              <div className="guess-options">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setShowHint(!showHint);
                  }}
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
              </div>

              {showHint && <div>{hint}</div>}
            </div>
          )}
        </div>

        <div className="guess-container">
          {guesses.length > 0 && (
            <>
              <h3>Your Guesses</h3>
              <ul>
                {guesses
                  .sort((a, b) => a.distance - b.distance)
                  .map((guess) => {
                    return (
                      <li
                        key={guess.value}
                        className={`guess ${
                          alreadyGuessed.toLowerCase() ===
                          guess.value.toLowerCase()
                            ? " already-guessed"
                            : ""
                        } ${
                          lastWord.toLowerCase() === guess.value.toLowerCase()
                            ? " last-guess"
                            : ""
                        }`}
                      >
                        <div className={`guess-value`}>{guess.value}</div>
                        <div className="guess-distance">
                          {guess.distance === 0 ? "WINNER" : guess.distance}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="footer">
        <div className="footer-info">
          <a href="https://github.com/mattl5543/levio" target="_blank">
            <GitHubIcon />
          </a>{" "}
          - Game ID: {gameId}
        </div>
        <div className="footer-options">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              reset();
            }}
          >
            Reset Game
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
