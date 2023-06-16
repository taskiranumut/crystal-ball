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
 * Retrieves data from a specified table in the database with a potential query.
 *
 * This function fetches data from the provided table based on the provided options, which may contain fields to return and query to filter data.
 *
 * @param {Object} options - An object that holds all the necessary parameters.
 * @param {string} options.tableName - The name of the table to fetch data from.
 * @param {string} [options.fields="*"] - A string specifying which fields to return from the data. By default, all fields are returned.
 * @param {Object} options.query - An object representing the query used to filter the data.
 * @param {string} options.query.queryName - The name of the query parameter.
 * @param {string|number} options.query.queryValue - The value of the query parameter.
 * @returns {Promise<Array<Object>>} - An array of objects representing the fetched data.
 * @throws {Error} - If fetching from the table fails or if no data is returned.
 */
const getFromTable = async (options) => {
  try {
    const { tableName, fields = "*", query = {} } = options;

    let queryBuilder = supabase.from(tableName).select(fields);

    const { queryName, queryValue } = query;
    if ((queryName, queryValue)) {
      queryBuilder = queryBuilder.eq(queryName, queryValue);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;

    if (!data) {
      throw new Error("No data returned from query");
    }

    return data;
  } catch (error) {
    console.error("Error in getFromTable:", error.message);
    throw error;
  }
};

export default {
  insertIntoTable,
  getFromTable,
};
