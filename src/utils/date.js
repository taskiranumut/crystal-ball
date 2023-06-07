/**
 * Formats a date string into the standard US format ("Month Day, Year").
 * @param {string} dateStr - The date string to be formatted. It must be a string representing a valid date.
 * @returns {string} The formatted date string.
 * @throws {Error} If the input date string is invalid or can't be parsed into a date, an error will be thrown.
 */
export const formatDateUSA = (dateStr) => {
  if (!Date.parse(dateStr)) {
    throw new Error(`Invalid date: ${dateStr}`);
  }

  const dateObj = new Date(dateStr);

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
