import supabase from "./supabaseClient";

/**
 * Inserts new data into a specified table in the database.
 * @param {string} tableName - The name of the table to insert data into.
 * @param {Object} body - The data to be inserted into the table.
 * @returns {Promise<Object>} - The first element of the data that has been inserted.
 * @throws {Error} - If the insertion operation fails, or if the inserted data is null.
 */
const insertIntoTable = async (tableName, body) => {
  try {
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(body)
      .select();

    if (error) throw error;

    if (!insertedData) {
      throw new Error("Inserted data is null");
    }

    return insertedData[0];
  } catch (error) {
    console.error("Error in insertIntoTable:", error.message);
    throw error;
  }
};

/**
 * Retrieves all data from a specified table in the database.
 * @param {string} tableName - The name of the table to retrieve data from.
 * @returns {Promise<Array<Object>>} - The data retrieved from the table.
 * @throws {Error} - If the retrieval operation fails.
 */
const getAllFromTable = async (tableName, query = "*") => {
  try {
    const { data, error } = await supabase.from(tableName).select(query);

    if (error) throw error;

    if (!data) {
      throw new Error("No data returned from query");
    }

    return data;
  } catch (error) {
    console.error("Error in getAllFromTable:", error.message);
    throw error;
  }
};

export default { insertIntoTable, getAllFromTable };
