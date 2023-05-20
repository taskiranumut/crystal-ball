/**
 * @typedef {Object} RequestResult
 * @property {boolean} isSuccessful - The request was successful or not.
 * @property {Object} [data] - The data received from the server.
 * @property {string} [error] - The error message if the request was not successful.
 */

/**
 * Send a request to a specified URL.
 * @async
 * @param {string} method - The HTTP method of the request (e.g., "GET", "POST").
 * @param {string} endpoint - The endpoint of the API where the request will be sent.
 * @param {Object} [data] - The data to be sent with the request.
 * @param {Object} [headers] - Additional headers for the request.
 * @returns {Promise<RequestResult>} The result of the request.
 * @throws {Error} Throws an error if the request is not successful.
 */
const sendRequest = async (method, endpoint, data = null, headers = {}) => {
  const API_URL = "https://64671255ba7110b663aeb19c.mockapi.io/predictions";

  try {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const responseData = await response.json();

    return { isSuccessful: true, data: responseData };
  } catch (error) {
    return { isSuccessful: false, error: error };
  }
};

/**
 * Send a POST request to post predictions to the API.
 * @param {Object} data - The data to be sent with the request.
 * @returns {Promise<RequestResult>} The result of the request.
 */
const postPredictionsToApi = (data) => {
  const endpoint = `/`;
  return sendRequest("POST", endpoint, data);
};

/**
 * Send a GET request to fetch predictions from the API.
 * @returns {Promise<RequestResult>} The result of the request, including data if successful.
 */
const getPredictionsFromApi = () => {
  const endpoint = `/`;
  return sendRequest("GET", endpoint);
};

/**
 * Fetches prediction data from the API with an optional tag query.
 * @function
 * @param {string} tagQuery - The tag query to filter predictions by. If the query is "all", it fetches all predictions.
 * @returns {Promise<RequestResult>} The result of the request, including data if successful.
 */
const getPredictionsFromApiWithTagQuery = (tagQuery) => {
  const endpoint = tagQuery === "all" ? `/` : `?tag=${tagQuery}`;
  return sendRequest("GET", endpoint);
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
 * Removes all child elements from a parent HTML element.
 * @param {HTMLElement} parentEl - The parent HTML element from which child elements will be removed.
 * @throws {Error} Will throw an error if parentEl is not an instance of HTMLElement.
 */
const removeChildElements = (parentEl) => {
  validateIsHtmlElement(parentEl);

  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
};

/**
 * Appends a child string as HTML to the parent HTML element.
 * @param {HTMLElement} parentEl - The parent HTML element to which the child string will be appended.
 * @param {string} stringChild - The child string that will be appended to the parent as HTML.
 * @throws {Error} Will throw an error if the parentEl is not a valid HTML element.
 * @throws {Error} Will throw an error if the stringChild is invalid or empty.
 */
const appendStringAsChildElement = (parentEl, stringChild = "") => {
  validateIsHtmlElement(parentEl);
  if (!stringChild) throw new Error("Child string is not valid or empty.");

  parentEl.insertAdjacentHTML("beforeend", stringChild);
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
 * Takes a date string in the "YYYY-MM-DD" format, and returns the corresponding timestamp at 23:59:59.
 * @param {string} dateString - The date string to convert. Must be in "YYYY-MM-DD" format.
 * @returns {number} - The timestamp corresponding to the provided date at 23:59:59.
 * @throws Will throw an error if the provided date string is not in the "YYYY-MM-DD" format or is not a valid date.
 */
const getTimestampFromDateString = (dateString) => {
  try {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      throw new Error(
        `Invalid date string format: ${dateString}. It has to be "YYYY-MM-DD" format.`
      );
    }

    const date = new Date(dateString + "T23:59:59");
    if (isNaN(date)) {
      throw new Error(`Invalid date: ${dateString}`);
    }

    return date.getTime();
  } catch (error) {
    console.error(`Failed to get timestamp: ${error}`);
  }
};

/**
 * Returns the remaining time between the current date and a future timestamp
 * in terms of days, hours, minutes, and seconds.
 * @param {number} [futureTimestamp=NaN] - The future timestamp in milliseconds.
 * @returns {Object} An object that represents the remaining time:
 * - days: The number of remaining days.
 * - hours: The number of remaining hours after the day calculation.
 * - minutes: The number of remaining minutes after the hour calculation.
 * - seconds: The number of remaining seconds after the minute calculation.
 * @throws {Error} If the futureTimestamp is not a number.
 * @throws {Error} If the futureTimestamp is in the past.
 */
const getRemainingTimeUnits = (futureTimestamp = NaN) => {
  try {
    if (isNaN(futureTimestamp)) {
      throw new Error("The future timestamp is not a number");
    }

    const diffMilliseconds = futureTimestamp - new Date().getTime();

    if (diffMilliseconds <= 0) {
      throw new Error("The future timestamp is in the past.");
    }

    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    return {
      days: diffDays,
      minutes: diffMinutes % 60,
      hours: diffHours % 24,
      seconds: diffSeconds % 60,
    };
  } catch (error) {
    console.error(`Error occurred: ${error}`);
  }
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
 * Retrieves form data from a given HTMLFormElement and adds additional properties.
 * @param {HTMLFormElement} newPredictionFormEl - The form element from which to retrieve data.
 * @returns {Object} - An object representing the form data along with additional properties.
 * The object's properties include form control names, form control values and a votes object.
 * @throws Will throw an error if the provided element is not an instance of HTMLFormElement.
 */
const getNewPredictionData = (newPredictionFormEl) => {
  validateIsHtmlFormElement(newPredictionFormEl);

  const formData = getFormData(newPredictionFormEl);
  return {
    info_url: formData["info-address"],
    prediction_content: formData["prediction-content"],
    realization_time: formData["realization-time"],
    info_url: formData["info-address"],
    tag: formData["tag"],
    username: formData["username"],
    votes: { upCount: 0, downCount: 0 },
  };
};

/**
 * Takes a prediction object and returns a new object with processed data.
 * @param {object} prediction - The prediction object. Required keys: "id", "prediction_content", "tag", "votes", "realization_time".
 * @returns {object} An object that contains the processed prediction data.
 * @throws Will throw an error if the prediction parameter is not an object or if it's missing any of the required keys.
 */
const createPredictionData = (prediction) => {
  if (typeof prediction !== "object" || prediction === null) {
    throw new Error("The prediction parameter must be an object.");
  }

  const requiredKeys = [
    "id",
    "prediction_content",
    "tag",
    "votes",
    "realization_time",
  ];
  const predictionKeys = Object.keys(prediction);

  requiredKeys.forEach((key) => {
    if (!predictionKeys.includes(key)) {
      throw new Error(`Missing required key: ${key}`);
    }
  });

  const realizationTimeTimestamp = getTimestampFromDateString(
    prediction["realization_time"]
  );

  return {
    id: prediction["id"],
    content: prediction["prediction_content"],
    tag: prediction["tag"],
    votes: prediction["votes"],
    countdown: getRemainingTimeUnits(realizationTimeTimestamp),
  };
};

/**
 * Iterates over each property of the given object, applies the provided template function to them,
 * and combines the results into a single string.
 * @param {Object} obj The object to iterate over.
 * @param {Function} templateFunction - The function to apply to each property of the object. This function should take two arguments: the property value and the property key, and return a string.
 * @returns {string} The resulting string, with each property of the object transformed by the template function and combined together. Returns an empty string if the provided object is null or undefined.
 */
const generateTemplateString = (obj, templateFunction) => {
  return obj
    ? Object.keys(obj)
        .map((key) => templateFunction(obj[key], key))
        .join("")
    : "";
};

const goToNewPredictionForm = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );
  const { newPredictionCardEl, predictionListEl } = options;

  hideElement(predictionListEl);
  showElement(newPredictionCardEl);
  removeChildElements(predictionListEl);
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

/**
 * Fetch predictions data from the API and fill the prediction list with it.
 * @param {HTMLElement} predictionListEl - The HTML element where the prediction list will be inserted.
 * @returns {Promise<void>} Nothing.
 * @throws Will throw an error if the predictions could not be fetched or if the predictions data is not an array.
 */
const fillPredictionList = async (predictionListEl) => {
  validateIsHtmlElement(predictionListEl);

  try {
    const response = await getPredictionsFromApi();

    if (!response.isSuccessful) {
      throw new Error(response.error.message);
    }

    const predictions = response.data;
    if (!Array.isArray(predictions)) {
      throw new Error("predictions has to be an array.");
    }

    const predictionCards = predictions
      .map((prediction) => {
        const predictionData = createPredictionData(prediction);
        return getPredictionCardTemplate(predictionData);
      })
      .join("");

    appendStringAsChildElement(predictionListEl, predictionCards);
  } catch (error) {
    console.error(`Failed to fetch item: ${error}`);
  }
};

/**
 * Fills a given HTML element with tag buttons. The tag buttons are generated
 * using data from a constant TAGS_DATA array.
 * @param {HTMLElement} tagButtonListEl - The HTML element to fill with tag buttons.
 * @throws {Error} If `tagButtonListEl` is not an instance of `HTMLElement`.
 */
const fillTagButtonList = (tagButtonListEl) => {
  validateIsHtmlElement(tagButtonListEl);

  const TAGS_DATA = [
    { value: "all", display: "All", isActive: true },
    { value: "technology", display: "Technology", isActive: false },
    { value: "politics", display: "Politics", isActive: false },
    { value: "science", display: "Science", isActive: false },
    { value: "magazine", display: "Magazine", isActive: false },
  ];

  const tagButtons = TAGS_DATA.map((data) => getTagButtonTemplate(data)).join(
    ""
  );

  appendStringAsChildElement(tagButtonListEl, tagButtons);
};

/**
 * Generates a template for a prediction card using the provided data.
 * @param {object} data - The data object to create a prediction card template from.
 * @returns {string} A string that represents the HTML structure of a prediction card.
 * The data object is destructured into its properties. Each property is used where needed in the HTML string
 * that represents the structure of a prediction card. If the prediction has a countdown or votes, these are passed
 * to the `generateTemplateString` function along with a template function to generate the respective part of the prediction card.
 */
const getPredictionCardTemplate = (data) => {
  const { id, content, countdown, tag, votes } = data;

  const countdownItems = generateTemplateString(
    countdown,
    getCountdownItemTemplate
  );
  const voteButtons = generateTemplateString(votes, getVoteButtonTemplate);

  return `
    <div class="card card--full predictions__item ${
      content ? "" : "hide"
    } data-prediction-id="${id}">
      <p class="predictions__item-content">${content}</p>
      <div class="predictions__item-countdown">${countdownItems}</div>
      <span class="predictions__item-tag-label ${tag || "hide"}">${tag}</span>
      <div class="predictions__item-vote-buttons">${voteButtons}</div>
    </div>`;
};

/**
 * Generates HTML structure for a countdown item.
 * @param {number|null} itemValue - The value of the countdown item. If the value is null, "-" will be displayed.
 * @param {string} itemName - The name of the countdown item.
 * @returns {string} The HTML structure for a countdown item as a string.
 */
const getCountdownItemTemplate = (itemValue, itemName) => {
  return `
    <div class="predictions__item-countdown-item">
      <span class="predictions__item-countdown-item-number"
        >${itemValue == null ? "-" : itemValue}</span
      >
      <span class="predictions__item-countdown-item-text"
        >${itemName}</span
      >
    </div>
  `;
};

/**
 * Generates a template string for the vote button element.
 * @param {number|null} voteValue - The value of the vote count. If null, vote count will be displayed as 0.
 * @param {string} voteTypeKey - The key to determine the type of the vote button ("upCount" or "downCount").
 * @throws {Error} Will throw an error if voteTypeKey is not "upCount" or "downCount".
 * @returns {string} The template string for the vote button element.
 */
const getVoteButtonTemplate = (voteValue, voteTypeKey) => {
  const voteTypes = {
    upCount: "up",
    downCount: "down",
  };

  const voteType = voteTypes[voteTypeKey];
  if (!voteType) throw new Error(`Invalid voteTypeKey: ${voteTypeKey}`);

  return `
    <button
      type="button"
      class="predictions__item-vote-button-item"
    >
      <span
        ><i class="fa-regular fa-thumbs-${voteType}"></i>
        <i class="fa-solid fa-thumbs-${voteType}"></i
      ></span>
      <span class="predictions__item-vote-counter">${
        voteValue == null ? "0" : voteValue
      }</span>
    </button>
  `;
};

/**
 * Generates the HTML markup for a tag button.
 * @param {object} data - An object containing the data (value, display, isActive) for the tag button.
 * @returns {string} The HTML markup for the tag button.
 */
const getTagButtonTemplate = (data) => {
  const { value, display, isActive } = data;

  return `
    <button type="button" data-tag-value="${value}" class="btn btn--lg btn--tag-secondary ${
    isActive ? "btn--active" : ""
  }">${display}</button>
  `;
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
 * Handle the submission of the prediction form.
 * It will validate the form, post the prediction data to the API, and then reset the form.
 * @param {Object} options - The options for handling the form submission.
 * @param {HTMLElement} options.newPredictionFormEl - The form element.
 * @param {HTMLElement} options.newPredictionCardEl - The HTML element of the new prediction card.
 * @param {HTMLElement} options.predictionListEl - The HTML element where the prediction list will be inserted.
 * @throws Will throw an error if posting the prediction data to the API is not successful.
 */
const handleSubmitPredictionForm = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const { newPredictionFormEl, newPredictionCardEl, predictionListEl } =
    options;

  newPredictionFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPredictionData = getNewPredictionData(newPredictionFormEl);
    const response = await postPredictionsToApi(newPredictionData);

    if (!response.isSuccessful) throw new Error(response.error.message);

    goToPredictionList({ newPredictionCardEl, predictionListEl });
    newPredictionFormEl.reset();
  });
};

const handleClickTagButtons = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const { tagButtonListEl } = options;

  tagButtonListEl.addEventListener("click", (e) => {
    const targetClassList = [...e.target.classList];
    const isPassiveBtn =
      targetClassList.includes("btn") &&
      !targetClassList.includes("btn--active");

    if (isPassiveBtn) {
      const oldActiveBtn = getElement("#tag-buttons-container .btn--active");
      oldActiveBtn.classList.remove("btn--active");
      const newActiveBtn = e.target;

      newActiveBtn.classList.add("btn--active");
    }
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
    { elName: "tagButtonListEl", selector: "#tag-buttons-container" },
  ];
  fillElementsObject(elements, selectorList);

  fillPredictionList(elements.predictionListEl);
  fillTagButtonList(elements.tagButtonListEl);

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

  handleClickTagButtons({
    tagButtonListEl: elements.tagButtonListEl,
  });
});
