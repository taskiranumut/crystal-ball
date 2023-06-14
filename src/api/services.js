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
const postPrediction = async (body) => {
  try {
    const requiredFields = [
      "votes",
      "prediction_content",
      "realization_time",
      "tag",
      "username",
      "info_url",
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

export default { postPrediction };
