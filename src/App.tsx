import React, { useEffect, useState } from "react";
import { LevenshteinDistance } from "./Lev";
import { GuessStoreHelper } from "./Helpers/GuessStore";
import { GameHelper } from "./Helpers/GameHelper";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

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
      (o) => o.value.toLowerCase() == guess.value.toLowerCase()
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
    if (lastWord.length < todaysWord.length) {
      setHint("You are missing some letters");
    }
    if (lastWord.length > todaysWord.length) {
      setHint("Your word has too many letters");
    }
    if (lastWord.length == todaysWord.length) {
      setHint(
        `Your word is the correct length but ${distance} letters are incorrect`
      );
    }
  }, [lastWord]);

  return (
    <div className="App">
      <h1>Some word game</h1>

      <div className="main-wrapper">
        <form
          className="word-input"
          onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
          }}
        >
          <input
            className="guess-input"
            type="text"
            pattern="[a-zA-Z]+"
            required
            value={currentInput}
            onChange={(ev) => {
              setCurrentInput(ev.target.value);
            }}
          />

          <Button
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
            <>
              <span className="last-word">{lastWord}</span> is the answer!
            </>
          )}
          {lastWord && !winState && (
            <>
              <span className="last-word">{lastWord}</span> is{" "}
              <span className="distance">{distance}</span> operations away from
              the answer.
              <Tooltip
                title="An operation can be either adding, removing or replacing a letter
              in the word."
              >
                <IconButton>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </>
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
                          alreadyGuessed.toLowerCase() ==
                          guess.value.toLowerCase()
                            ? " already-guessed"
                            : ""
                        } ${
                          lastWord.toLowerCase() == guess.value.toLowerCase()
                            ? " last-guess"
                            : ""
                        }`}
                      >
                        <div className={`guess-value`}>{guess.value}</div>
                        <div className="guess-distance">
                          {guess.distance == 0 ? "WINNER" : guess.distance}
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
        <div className="footer-info">Game ID: {gameId}</div>
        <div className="footer-options">
          <Button
            variant="contained"
            onClick={() => {
              GuessStoreHelper.clearAll();
              setGuesses([]);
            }}
          >
            Clear Guesses
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowHint(!showHint);
            }}
          >
            {showHint ? hint : "Show Hint"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
