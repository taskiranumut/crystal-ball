/**
 * An array of objects, each representing a tag to be used in the application.
 * Each tag object includes:
 * @property {string} value - The internal value of the tag.
 * @property {string} display - The display name of the tag.
 * @property {boolean} isActive - A flag indicating if the tag is active.
 */
const TAGS_DATA = [
  { value: "all", display: "All", isActive: true },
  { value: "politics", display: "Politics", isActive: false },
  { value: "magazine", display: "Magazine", isActive: false },
  { value: "finance", display: "Finance", isActive: false },
  { value: "technology", display: "Technology", isActive: false },
  { value: "science", display: "Science", isActive: false },
  { value: "humanity", display: "Humanity", isActive: false },
  { value: "society", display: "Society", isActive: false },
];

export default TAGS_DATA;
