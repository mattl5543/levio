import React, { useEffect, useState } from "react";
import { LevenshteinDistance } from "./Lev";
import { GuessStoreHelper } from "./Helpers/GuessStore";
import { GameHelper } from "./Helpers/GameHelper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function App() {
  const [currentInput, setCurrentInput] = useState<string>("");
  const [lastWord, setLastWord] = useState<string>("");
  const [distance, setDistance] = useState<number>();

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

    const alreadyGuessed = guesses.find(
      (o) => o.value.toLowerCase() == guess.value.toLowerCase()
    );

    setDistance(guess.distance);
    setLastWord(guess.value);

    if (!alreadyGuessed) {
      GuessStoreHelper.storeGuess(gameId, guess);
      setGuesses((prev) => {
        return [...prev, guess];
      });
    } else {
      setAlreadyGuessed(guess.value);
    }
  };

  return (
    <div className="App">
      <h1>Some word game</h1>
      <form
        className="word-input"
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          id="outlined-basic"
          inputProps={{ inputMode: "text", pattern: '"[a-zA-Z]+"' }}
          required
          variant="outlined"
          onChange={(ev) => {
            setCurrentInput(ev.target.value);
          }}
        />
        <Button variant="contained">Guess</Button>
      </form>

      <div className="current-container">
        {lastWord && (
          <>
            <span className="last-word">{lastWord}</span> is{" "}
            <span className="distance">{distance}</span> operations away from
            the answer.
            <div>
              An operation can be either adding, removing or replacing a letter
              in the word.
            </div>
          </>
        )}
      </div>

      <div className="guess-container">
        {guesses.length > 0 && (
          <>
            <h3>Your guesses today:</h3>
            <ul>
              {guesses
                .sort((a, b) => a.distance - b.distance)
                .map((guess) => {
                  return (
                    <li
                      className={`guess ${
                        alreadyGuessed.toLowerCase() ==
                        guess.value.toLowerCase()
                          ? " already-guessed"
                          : ""
                      }`}
                    >
                      <div className={`guess-value`}>{guess.value}</div>
                      <div className="guess-distance">{guess.distance}</div>
                    </li>
                  );
                })}
            </ul>
          </>
        )}
      </div>

      <div className="footer">
        <div className="game-id">Game ID: {gameId}</div>
        <div className="game-options">
          <button
            onClick={() => {
              GuessStoreHelper.clearAll();
              setGuesses([]);
            }}
          >
            Clear Guesses
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
