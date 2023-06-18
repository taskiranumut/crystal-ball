import db from "./db";

/**
 * Posts a new prediction to the database.
 *
 * This function first checks if all the required fields are provided in the body of the request.
 * It then inserts the votes data into the 'votes' table and the prediction data into the 'predictions' table.
 *
 * @param {Object} body - The body of the request, containing the prediction data (prediction_content, realization_time, tag, username, info_url, votes).
 * @returns {Promise<Object>} - An object indicating whether the operation was successful and containing either the inserted prediction data or an error message.
 * @throws {Error} - If any required fields are missing in the body of the request or if insertion into the 'votes' or 'predictions' table fails.
 */
export const postPrediction = async (body) => {
  try {
    const requiredFields = [
      "votes",
      "prediction_content",
      "realization_time",
      "tag",
      "username",
      "info_url",
      "is_reviewed",
    ];

    const bodyKeys = Object.keys(body);
    const missingFields = requiredFields.filter(
      (field) => !bodyKeys.includes(field)
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in body: ${missingFields.join(", ")}`
      );
    }

    const votesData = await db.insertIntoTable("votes", {
      up_count: body.votes.up_count,
      down_count: body.votes.down_count,
    });

    if (!votesData || !votesData.id) {
      throw new Error("Failed to insert into votes table");
    }

    const predictionData = await db.insertIntoTable("predictions", {
      prediction_content: body.prediction_content,
      realization_time: body.realization_time,
      tag: body.tag,
      username: body.username,
      info_url: body.info_url,
      votesId: votesData.id,
      is_reviewed: body.is_reviewed,
    });

    if (!predictionData) {
      throw new Error("Failed to insert into predictions table");
    }

    return { isSuccessful: true, data: predictionData };
  } catch (error) {
    console.error("Error in postPrediction:", error.message);
    return { isSuccessful: false, error: error.message };
  }
};

/**
 * Retrieves all predictions from the database.
 *
 * This function fetches all predictions and their related votes from the 'predictions' table,
 * and adjusts the format of the realization_time for each prediction.
 *
 * @returns {Promise<Object>} - An object indicating whether the operation was successful and containing either the array of fetched predictions or an error message.
 * @throws {Error} - If the fetching from the 'predictions' table fails.
 */
export const getPredictions = async () => {
  try {
    const predictions = await db.getFromTable({
      tableName: "reviewed_predictions",
      fields: `*, votes:votesId (*)`,
    });

    if (!predictions) {
      throw new Error("Failed to get predictions");
    }

    const rebasedPredictions = predictions.map((prediciton) => ({
      ...prediciton,
      realization_time: prediciton.realization_time.split("T")[0],
    }));

    return { isSuccessful: true, data: rebasedPredictions };
  } catch (error) {
    console.error("Error in postPrediction:", error.message);
    return { isSuccessful: false, error: error.message };
  }
};

/**
 * Retrieves predictions from the database based on a provided tag.
 * This function fetches predictions from the database and refines the returned data based on the provided query parameters.
 * @param {string} queryName - The name of the query parameter, usually it should be "tag".
 * @param {string} queryValue - The value of the query parameter, this specifies the tag of the prediction.
 * @returns {Promise<Object>} - An object containing a boolean indicating success or failure, and the data retrieved or the error message.
 * @throws {Error} - If the tag query is invalid or if fetching the predictions fails.
 */
export const getPredictionsByTag = async (queryName, queryValue) => {
  try {
    const validTagQueries = [
      "all",
      "technology",
      "politics",
      "science",
      "magazine",
      "finance",
      "humanity",
      "society",
    ];

    const isValidTagQuery = validTagQueries.some(
      (requiredQuery) => requiredQuery === queryValue
    );
    if (!isValidTagQuery) {
      throw new Error(`Invalid query params, tagQuery: ${queryValue}`);
    }

    const predictions = await db.getFromTable({
      tableName: "reviewed_predictions",
      fields: `*, votes:votesId (*)`,
      query: queryValue === "all" ? {} : { queryName, queryValue },
    });

    if (!predictions) {
      throw new Error("Failed to get predictions");
    }

    const rebasedPredictions = predictions.map((prediciton) => ({
      ...prediciton,
      realization_time: prediciton.realization_time.split("T")[0],
    }));

    return { isSuccessful: true, data: rebasedPredictions };
  } catch (error) {
    console.error("Error in postPrediction:", error.message);
    return { isSuccessful: false, error: error.message };
  }
};

/**
 * Gets the current vote counts for a given prediction.
 * @param {string} predictionId - The ID of the prediction to fetch votes for.
 * @returns {Promise<Object>} - An object containing the current vote counts.
 * @throws {Error} - If predictionId is not provided or no prediction is found for the given ID.
 */
export const getCurrentVotes = async (predictionId) => {
  if (!predictionId) {
    throw new Error("Invalid predictionId parameter: id is empty or invalid");
  }

  const [prediction] = await db.getFromTable({
    tableName: "reviewed_predictions",
    fields: `*, votes:votesId (*)`,
    query: { queryName: "id", queryValue: predictionId },
  });

  if (!prediction) {
    throw new Error("Invalid data: data is empty or invalid");
  }

  const { up_count, down_count } = prediction.votes;
  return { votes: { up_count, down_count } };
};

/**
 * Updates the vote counts for a given prediction.
 * @param {Object} body - The new vote counts to update.
 * @param {string} [predictionId] - The ID of the prediction to update votes for.
 * @returns {Promise<Object>} - An object indicating the success of the update operation and the updated data.
 * @throws {Error} - If predictionId is not provided, required fields are missing from body, or no prediction is found for the given ID.
 */
export const updateVotes = async (body, predictionId = null) => {
  try {
    if (!predictionId) {
      throw new Error(`Invalid query params, predictionId: ${predictionId}`);
    }

    const requiredFields = ["up_count", "down_count"];

    const bodyKeys = Object.keys(body.votes);
    const missingFields = requiredFields.filter(
      (field) => !bodyKeys.includes(field)
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in body: ${missingFields.join(", ")}`
      );
    }

    const [{ votesId }] = await db.getFromTable({
      tableName: "reviewed_predictions",
      fields: `votesId`,
      query: { queryName: "id", queryValue: predictionId },
    });

    if (!votesId) {
      throw new Error("Invalid votesId: votesId is empty or invalid");
    }

    const predictionData = await db.updateInTable({
      tableName: "votes",
      body: body.votes,
      query: { queryName: "id", queryValue: votesId },
    });

    return { isSuccessful: true, data: predictionData };
  } catch (error) {
    console.error("Error in postPrediction:", error.message);
    return { isSuccessful: false, error: error.message };
  }
};
