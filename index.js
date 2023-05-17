/**
 * Simulates network latency.
 * @returns {Promise<void>} A promise that resolves after a random delay.
 */
const fakeNetworkLatency = async () => {
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
};

/**
 * Random ID generator function that generates IDs with a minimum and maximum length.
 * The IDs do not start with a number and include at least one number.
 * @param {number} [minLength=4] - The minimum length of the generated ID. Default is 4.
 * @param {number} [maxLength=16] - The maximum length of the generated ID. Default is 16.
 * @returns {string} A randomly generated ID.
 */
function generateId(minLength = 4, maxLength = 16) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let id = "";

  do {
    const char = chars[Math.floor(Math.random() * chars.length)];

    if (id.length === 0 && /^\d$/.test(char)) continue;

    id += char;
  } while (id.length < length);

  return id;
}

/**
 * Selects an element from the DOM.
 * @param {string} selector - The CSS selector of the element to select.
 * @returns {HTMLElement|null} The selected element, or null if not found.
 */
const getElement = (selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    console.error(`Element not found: ${selector}`);
    return null;
  }
  return element;
};

/**
 * Removes the 'hide' class from an HTML element to show it.
 * @param {HTMLElement} el - The element to show.
 * @throws {Error} Throws an error if the provided argument is not an HTMLElement.
 */
const showElement = (el) => {
  if (!(el instanceof HTMLElement)) {
    throw new Error("Invalid argument: showElement expects an HTMLElement");
  }
  el.classList.remove("hide");
};

/**
 * Adds the 'hide' class to an HTML element to hide it.
 * @param {HTMLElement} el - The element to hide.
 * @throws {Error} Throws an error if the provided argument is not an HTMLElement.
 */
const hideElement = (el) => {
  if (!(el instanceof HTMLElement)) {
    throw new Error("Invalid argument: hideElement expects an HTMLElement.");
  }
  el.classList.add("hide");
};

/**
 * Validates if a value is an instance of HTMLElement.
 * @param {any} value - The value to validate.
 * @param {string} [property="the value passed as an argument"] - The name of the property for error messaging.
 * @throws {Error} Throws an error if the value is not an instance of HTMLElement.
 */
const validateIsHtmlElement = (
  value,
  property = "the value passed as an argument"
) => {
  if (!(value instanceof HTMLElement)) {
    throw new Error(
      `Invalid parameter: ${property} is not an instance of HTMLElement.`
    );
  }
};

/**
 * Validates if the provided argument is an instance of HTMLFormElement.
 * @param {HTMLElement} el - The HTML element to validate.
 * @param {string} elName - The name of the argument being validated.
 * @throws Will throw an error if the provided element is not an instance of HTMLFormElement.
 */
const validateIsHtmlFormElement = (
  el,
  elName = "the value passed as an argument"
) => {
  if (!(el instanceof HTMLFormElement)) {
    throw new Error(`Invalid parameter: ${elName} is not a form element.`);
  }
};

/**
 * Fills an elements object with HTMLElements selected by their CSS selectors.
 * @param {object} elemenets - The elements object to fill.
 * @param {Array<{elName: string, selector: string}>} selectorList - The list of elements to select.
 * @throws {Error} Throws an error if the provided arguments are not an object and an array.
 */
const fillElementsObject = (elemenets, selectorList) => {
  if (
    !Array.isArray(selectorList) ||
    typeof elemenets !== "object" ||
    elemenets === null
  ) {
    throw new Error(
      `Invalid argument: fillElementsObject expects an object and an array.`
    );
  }

  selectorList.forEach(
    (item) => (elemenets[item.elName] = getElement(item.selector))
  );
};

/**
 * Retrieves and returns form data as a JavaScript object.
 * @param {HTMLFormElement} formEl - The form element from which to retrieve data.
 * @returns {Object} - An object representing the form data.
 * The object's properties correspond to form control names, and the values correspond to form control values.
 * @throws Will throw an error if the provided element is not an instance of HTMLFormElement.
 */
const getFormData = (formEl) => {
  validateIsHtmlFormElement(formEl, "formEl");

  const formData = new FormData(formEl);
  return Object.fromEntries(formData.entries());
};

/**
 * Get an item from the local storage and parse it as JSON.
 *
 * @param {string} itemName - The name of the item to retrieve from the local storage.
 * @returns {(Object|null)} The parsed JSON object if the item exists and is a valid JSON string, null otherwise.
 * @throws {Error} Will throw an error if the `itemName` is not provided.
 */
const getItemFromLocalStorage = (itemName) => {
  try {
    if (!itemName) throw new Error("No item name provided.");

    const item = localStorage.getItem(itemName);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to get item from local storage: ${error}`);
    return null;
  }
};

const goToNewPredictionForm = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );
  const { newPredictionCardEl, predictionListEl } = options;

  hideElement(predictionListEl);
  showElement(newPredictionCardEl);
};

const goToPredictionList = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );
  const { newPredictionCardEl, predictionListEl } = options;

  hideElement(newPredictionCardEl);
  showElement(predictionListEl);
  fillPredictionList(predictionListEl);
};

const fillPredictionList = (predictionListEl) => {
  validateIsHtmlElement(predictionListEl);

  try {
    const predictions = getItemFromLocalStorage("predictions");
    if (predictions == null) {
      throw new Error("predictions not found in Local Storage.");
    }

    predictions.forEach((prediction) => {
      const data = {
        id: prediction["id"],
        content: prediction["prediction-content"],
        tag: prediction["tag"],
        // TODO: Below data will be dynamic.
        votes: { upCount: 0, downCount: 0 },
        countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      };
      const predictionCardElWithData = getPredictionCardElWithData(data);
      predictionListEl.insertAdjacentHTML(
        "beforeend",
        predictionCardElWithData
      );
    });
  } catch (error) {
    console.error(`Failed to fetch item: ${error}`);
  }
};

const getPredictionCardElWithData = (data) => {
  const { id, content, countdown, tag, votes } = data;
  return `
    <div class="card card--full predictions__item ${
      content ? "" : "hide"
    }"" data-prediction-id="${id}">
      <p class="predictions__item-content">${content}</p>
      <div class="predictions__item-countdown">
        <div class="predictions__item-countdown-item">
          <span class="predictions__item-countdown-item-number"
            >${countdown?.days == null ? "-" : countdown.days}</span
          >
          <span class="predictions__item-countdown-item-text"
            >Days</span
          >
        </div>
        <div class="predictions__item-countdown-item">
          <span class="predictions__item-countdown-item-number"
            >${countdown?.hours == null ? "-" : countdown.hours}</span
          >
          <span class="predictions__item-countdown-item-text"
            >Hours</span
          >
        </div>
        <div class="predictions__item-countdown-item">
          <span class="predictions__item-countdown-item-number"
            >${countdown?.minutes == null ? "-" : countdown.minutes}</span
          >
          <span class="predictions__item-countdown-item-text"
            >Minutes</span
          >
        </div>
        <div class="predictions__item-countdown-item">
          <span class="predictions__item-countdown-item-number"
            >${countdown?.seconds == null ? "-" : countdown.seconds}</span
          >
          <span class="predictions__item-countdown-item-text"
            >Seconds</span
          >
        </div>
      </div>
      <span class="predictions__item-tag-label ${tag || "hide"}">${tag}</span>
      <div class="predictions__item-vote-buttons">
        <button
          type="button"
          class="predictions__item-vote-button-item"
        >
          <span
            ><i class="fa-regular fa-thumbs-up"></i>
            <i class="fa-solid fa-thumbs-up"></i
          ></span>
          <span class="predictions__item-vote-counter">${
            votes?.upCount == null ? "0" : votes.upCount
          }</span>
        </button>
        <button
          type="button"
          class="predictions__item-vote-button-item"
        >
          <span
            ><i class="fa-regular fa-thumbs-down"></i>
            <i class="fa-solid fa-thumbs-down"></i
          ></span>
          <span class="predictions__item-vote-counter">${
            votes?.downCount == null ? "0" : votes.downCount
          }</span>
        </button>
      </div>
    </div>`;
};

/**
 * Attaches a click event handler to the 'new prediction' button.
 * @param {Object} options - The HTMLElements needed for this function.
 * @param {HTMLElement} options.newPredictionBtnEl - The 'new prediction' button element.
 * @param {HTMLElement} options.newPredictionCardEl - The 'new prediction' card element.
 * @param {HTMLElement} options.predictionListEl - The list of predictions element.
 * @throws {Error} Throws an error if any of the options are not an instance of HTMLElement.
 */
const handleClickNewPredictionButton = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const { newPredictionBtnEl, newPredictionCardEl, predictionListEl } = options;

  newPredictionBtnEl.addEventListener("click", () => {
    goToNewPredictionForm({ newPredictionCardEl, predictionListEl });
  });
};

/**
 * Attaches a click event handler to the 'cancel' button in the form.
 * @param {Object} options - The HTMLElements needed for this function.
 * @param {HTMLElement} options.formCancelBtnEl - The 'cancel' button element in the form.
 * @param {HTMLElement} options.newPredictionCardEl - The 'new prediction' card element.
 * @param {HTMLElement} options.predictionListEl - The list of predictions element.
 * @throws {Error} Throws an error if any of the options are not an instance of HTMLElement.
 */
const handleClickFormCancelButton = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const { formCancelBtnEl, newPredictionCardEl, predictionListEl } = options;

  formCancelBtnEl.addEventListener("click", () => {
    goToPredictionList({ newPredictionCardEl, predictionListEl });
  });
};

/**
 * Handles the submission of a prediction form.
 * @param {Object} options - The options for handling the form submission.
 * @param {HTMLFormElement} options.newPredictionFormEl - The form element to be submitted.
 * @param {HTMLElement} options.newPredictionCardEl - The card element that contains the form.
 * @param {HTMLElement} options.predictionListEl - The list element where the new prediction will be displayed.
 * @description This function will perform several actions when the form is submitted:
 * - Prevent the default form submission action.
 * - Retrieve the data from the form and add a unique id to it.
 * - Retrieve the existing predictions from local storage (or initialize an empty array if there are none).
 * - Add the new prediction to the list of predictions.
 * - Save the updated list of predictions to local storage.
 * - Hide the card that contains the form.
 * - Show the list where the new prediction will be displayed.
 * - Reset the form.
 * - Note: This function expects that all the elements passed in the `options` object are valid HTML elements.
 * If any of the elements are not valid, it will throw an error.
 */
const handleSubmitPredictionForm = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const { newPredictionFormEl, newPredictionCardEl, predictionListEl } =
    options;

  newPredictionFormEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = getFormData(newPredictionFormEl);
    const newFormData = { ...formData, id: generateId(8, 12) };

    const predictions = getItemFromLocalStorage("predictions") || [];
    const predictionsList = [...predictions, newFormData];

    localStorage.setItem("predictions", JSON.stringify(predictionsList));
    goToPredictionList({ newPredictionCardEl, predictionListEl });
    newPredictionFormEl.reset();
  });
};

window.addEventListener("load", () => {
  const elements = {};
  const selectorList = [
    { elName: "newPredictionBtnEl", selector: "#new-prediction-btn" },
    { elName: "newPredictionCardEl", selector: "#new-prediction-card" },
    { elName: "predictionListEl", selector: "#predictions" },
    { elName: "newPredictionFormEl", selector: "#new-prediction-form" },
    { elName: "formCancelBtnEl", selector: "#form-cancel-btn" },
  ];
  fillElementsObject(elements, selectorList);

  handleClickNewPredictionButton({
    newPredictionBtnEl: elements.newPredictionBtnEl,
    newPredictionCardEl: elements.newPredictionCardEl,
    predictionListEl: elements.predictionListEl,
  });

  handleClickFormCancelButton({
    formCancelBtnEl: elements.formCancelBtnEl,
    newPredictionCardEl: elements.newPredictionCardEl,
    predictionListEl: elements.predictionListEl,
  });

  handleSubmitPredictionForm({
    newPredictionFormEl: elements.newPredictionFormEl,
    newPredictionCardEl: elements.newPredictionCardEl,
    predictionListEl: elements.predictionListEl,
  });
});
