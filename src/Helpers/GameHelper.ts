import WordLibrary from "../words.json";

export class GameHelper {
  private static START_OF_TIME = new Date("1997-03-14");
  public static GetGameId(): number {
    const now = new Date();
    const diff = now.getTime() - this.START_OF_TIME.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
  public static GetTodaysWord(): string {
    const wordId = this.GetGameId() % WordLibrary.words.length;
    return WordLibrary.words[wordId];
  }
}
