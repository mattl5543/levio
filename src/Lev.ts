interface LevenshteinResponse {
  distance: number;
}

export const LevenshteinDistance = (
  source: string,
  target: string
): LevenshteinResponse => {
  // Set up
  const sourceSplit = source.toLowerCase().split("");
  const targetSplit = target.toLowerCase().split("");

  // Create base matrix
  const levMatrix: Array<Array<number>> = [];
  for (let i = 0; i <= sourceSplit.length; i++) {
    levMatrix[i] = [];
    for (let j = 0; j <= targetSplit.length; j++) {
      levMatrix[i][j] = 0;
    }
  }

  for (let i = 1; i <= sourceSplit.length; i++) {
    levMatrix[i][0] = i;
  }

  for (let j = 1; j <= targetSplit.length; j++) {
    levMatrix[0][j] = j;
  }

  // Calculate distance
  for (let j = 1; j <= targetSplit.length; j++) {
    for (let i = 1; i <= sourceSplit.length; i++) {
      let subCost = 0;
      if (sourceSplit[i - 1] !== targetSplit[j - 1]) {
        subCost = 1;
      }

      const removeCost = levMatrix[i - 1][j] + 1;
      const insertCost = levMatrix[i][j - 1] + 1;
      const totalSubCost = levMatrix[i - 1][j - 1] + subCost;
      const cost = Math.min(removeCost, insertCost, totalSubCost);

      levMatrix[i][j] = cost;
    }
  }

  // Last entry in the matrix is the distance
  return {
    distance: levMatrix[sourceSplit.length][targetSplit.length],
  };
};
