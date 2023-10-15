const LS_KEY = "levio-guesses";

interface Guess {
  value: string;
  distance: number;
}

export class GuessStoreHelper {
  public static getAllGuesses = (gameId: number) => {
    return JSON.parse(
      localStorage.getItem(LS_KEY + `-${gameId}`) ?? "[]"
    ) as Guess[];
  };

  public static storeGuess = (gameId: number, value: Guess) => {
    const guesses = this.getAllGuesses(gameId);
    localStorage.setItem(
      LS_KEY + `-${gameId}`,
      JSON.stringify([...guesses, value])
    );
  };

  public static clearAll = () => {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(LS_KEY)) {
        localStorage.removeItem(key);
      }
    }
  };

  public static clearOld = () => {};
}
