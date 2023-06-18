/* eslint-disable no-console */
/**
 * Retrieves the list of prediction IDs that the user has already voted for.
 * @returns {Array<string>} An array of prediction IDs.
 */
const getVotedPredictionIds = () => {
  let idList = document.cookie.replace(
    /(?:(?:^|.*;\s*)pids\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  if (idList) {
    return JSON.parse(idList);
  }

  idList = localStorage.getItem("pids");
  if (idList) {
    return JSON.parse(idList);
  }

  return [];
};

/**
 * Adds a prediction ID to the list of predictions that the user has already voted for.
 * This list is stored in both the document's cookies and the local storage.
 * @param {string} predictionId - The ID of the prediction to be added.
 * @throws {Error} Throws an error if the 'predictionId' parameter is invalid.
 */
export const addVotedPredictionId = (predictionId) => {
  const votedPredictionIds = [...getVotedPredictionIds(), predictionId];

  document.cookie = `pids=${JSON.stringify(
    votedPredictionIds
  )}; expires=${new Date(
    Date.now() + 100 * 24 * 60 * 60 * 1000
  ).toUTCString()}; path=/; SameSite=Lax`;

  localStorage.setItem("pids", JSON.stringify(votedPredictionIds));
};

/**
 * Checks if the user has already voted for the prediction with the provided ID.
 * @param {string} predictionId - The ID of the prediction to be checked.
 * @returns {boolean} Returns true if the user has already voted, otherwise false.
 * @throws {Error} Throws an error if the 'predictionId' parameter is invalid.
 */
export const hasVotedPrediction = (predictionId) => {
  if (!predictionId) {
    console.error(`Invalid parameter, predictionId: ${predictionId}`);
    return null;
  }

  const idList = getVotedPredictionIds();
  return idList.includes(predictionId.toString());
};
