/**
 * Iterates over each property of the given object, applies the provided template function to them,
 * and combines the results into a single string.
 * @param {Object} obj The object to iterate over.
 * @param {Function} templateFunction - The function to apply to each property of the object. This function should take two arguments: the property value and the property key, and return a string.
 * @param {Object} [options=null] - Additional options that may be used by the template function.
 * @returns {string} The resulting string, with each property of the object transformed by the template function and combined together. Returns an empty string if the provided object is null or undefined.
 */
export const generateTemplateString = (
  obj,
  templateFunction,
  options = null
) => {
  return obj
    ? Object.keys(obj)
        .map((key) => templateFunction(obj[key], key, options))
        .join("")
    : "";
};

/* eslint-disable no-console */
/**
 * Returns an error HTML template that contains error messages.
 * @param {string[]} messages - An array of error messages.
 * @returns {string} - The error HTML template string.
 */
export const getFormErrorTemplate = (messages) => {
  if (!Array.isArray(messages)) {
    console.error("Invalid parameter, messages must be an array.");
    return "";
  }

  const errorContainers = messages
    .map(
      (message) => `<div class="error__container error--with-icon">
      <span class="error__icon"><i class="fa-solid fa-circle-exclamation"></i></span>
      <span class="error__text">${message}</span>
    </div>`
    )
    .join("");

  return `
  <div class="error">${errorContainers}</div>
  `;
};

/**
 * Returns a template string representing an "empty content" message.
 * @returns {string} A string containing HTML structure for displaying an empty content message.
 */
export const getEmptyContentTemplate = () => {
  return `
    <div class="empty-content">
      <div class="empty-content__icon">
        <i class="fa-regular fa-circle-xmark fa-2xl"></i>
      </div>
      <p class="empty-content__text">There is no prediction!</p>
    </div>
  `;
};

/**
 * Creates a modal template.
 * @param {Object} options - Configuration options for the modal.
 * @param {string} [options.title=""] - The title for the modal.
 * @param {string} [options.content=""] - The content for the modal.
 * @param {string} [options.closeBtnText="OK"] - The text for the close button.
 * @returns {string} - A string representing the HTML structure of the modal.
 */
export const getModalTemplate = (options) => {
  const { title = "", content = "", closeBtnText = "OK" } = options;

  return `
    <div class="modal__overlay">
      <div class="modal__body card">
        <div class="modal__header">
          <h2>${title}</h2>
        </div>
        <div class="modal__content">
          <p>${content}</p>
        </div>
        <div class="modal__footer">
          <button id="close-modal" class="modal__close btn btn--primary ">${closeBtnText}</button>
        </div>
      </div>
    </div>
    `;
};

export const getLoaderTemplate = () => {
  return `
    <div id="main-loader" class="loader">
      <span class="loader__item loader__item--xl"></span>
    </div>
  `;
};
