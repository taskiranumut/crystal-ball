let globalCountdownInterval;

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
 * Processes the response from a request and retrieves the data.
 * @param {Object} response - The response object to be processed.
 * @returns {Object} The data extracted from the response.
 * @throws {TypeError} Throws an error if 'response' is not an object.
 * @throws {Error} Throws an error if 'response.isSuccessful' is false.
 */
const getResponseData = (response) => {
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    throw new TypeError("'response' has to be an object.");
  }

  if (!response.isSuccessful) {
    throw new Error(response.error.message);
  }

  const data = response.data;

  return data;
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
 * @async
 * @returns {Array} The array of predictions obtained from the API.
 * @throws {Error} Throws an error if the request fails.
 */
const getPredictionsFromApi = async () => {
  const endpoint = `/`;
  const response = await sendRequest("GET", endpoint);
  return getResponseData(response);
};

/**
 * Fetches a specific prediction from the API using the provided prediction ID.
 * @async
 * @param {string} predictionId - The ID of the prediction to fetch.
 * @returns {Promise<Object>} The prediction data.
 * @throws {Error} Throws an error if the prediction ID is invalid or if the request is unsuccessful.
 */
const getPredictionFromApiById = async (predictionId = null) => {
  if (!predictionId) {
    throw new Error(`Invalid query params, predictionId: ${predictionId}`);
  }

  const endpoint = `/${predictionId}`;
  const response = await sendRequest("GET", endpoint);
  return getResponseData(response);
};

/**
 * @async
 * @param {string} [tagQuery=null] - The tag to query in the API.
 * @returns {Array} The array of predictions obtained from the API based on the tag query.
 * @throws {Error} Throws an error if the tagQuery is not valid or the request fails.
 */
const getPredictionsFromApiWithTagQuery = async (tagQuery = null) => {
  const validTagQueries = [
    "all",
    "technology",
    "politics",
    "science",
    "magazine",
  ];

  const isValidTagQuery = validTagQueries.some(
    (requiredQuery) => requiredQuery === tagQuery
  );
  if (!isValidTagQuery) {
    throw new Error(`Invalid query params, tagQuery: ${tagQuery}`);
  }

  const endpoint = tagQuery === "all" ? `/` : `?tag=${tagQuery}`;
  const response = await sendRequest("GET", endpoint);
  return getResponseData(response);
};

/**
 * Updates the vote count of a specific prediction in the API.
 * @async
 * @param {string} predictionId - The ID of the prediction to update.
 * @param {Object} data - The data to send in the request body, typically the updated vote count.
 * @returns {Promise<Object>} The updated prediction data.
 * @throws {Error} Throws an error if the prediction ID is invalid, if the request is unsuccessful or if the data to send is incorrect.
 */
const putUpdatedVoteToApi = async (predictionId = null, data) => {
  if (!predictionId) {
    throw new Error(`Invalid query params, predictionId: ${predictionId}`);
  }

  const endpoint = `/${predictionId}`;
  const response = await sendRequest("PUT", endpoint, data);
  return getResponseData(response);
};

/**
 * Adds an animation to a given HTML element. This function is based on the animate.css library.
 * @param {(HTMLElement|string)} element - A HTML element or a query selector for the element to be animated.
 * @param {string} animation - The name of the animation to be applied (based on animate.css).
 * @param {Array} [options] - Optional settings for the animation. These can be delay, repeat, speed, etc. (based on animate.css)
 * @returns {Promise<boolean>} A Promise that resolves to true when the animation ends. If there is any error, the Promise will resolve to false.
 * @throws {Error} If the element or animation parameters are invalid or missing, an error will be logged in the console and the function will return a Promise that resolves to false.
 */

const addAnimation = (element, animation, options) => {
  if (!element) {
    console.error(
      "(Animation Error) Invalid parameter: element is must be HTML element or query selector."
    );
    return Promise.resolve(false);
  }

  if (!animation) {
    console.error(
      "(Animation Error) Missing parameter: animation parameter is required."
    );
    return Promise.resolve(false);
  }

  const node =
    element instanceof HTMLElement ? element : document.querySelector(element);

  if (!node) {
    console.error(
      "(Animation Error) Not found element (node) for adding animation."
    );
    return Promise.resolve(false);
  }

  const prefix = "animate__";
  const animationInitializater = `${prefix}animated`;
  const animationName = `${prefix}${animation}`;
  const animationClassList = [animationInitializater, animationName];

  if (Array.isArray(options)) {
    options.forEach((option) => animationClassList.push(`${prefix}${option}`));
  }

  animationClassList.forEach((className) => node.classList.add(className));

  return new Promise((resolve, reject) => {
    const handleAnimationEnd = (e) => {
      e.stopPropagation();
      animationClassList.forEach((className) =>
        node.classList.remove(className)
      );
      resolve(true);
    };

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
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
 * Syncs the top CSS style of a sticky element with the height of a reference element.
 * This function uses the ResizeObserver API to watch for size changes in the reference element.
 * @param {Element} stickyElement - The element whose top style will be adjusted.
 * @param {Element} referenceElement - The element whose height will be used to adjust the top style of the sticky element.
 * @return {Function} A function that can be called to stop observing the reference element.
 */
const syncTopStylingWithElementSize = (stickyElement, referenceElement) => {
  let observer;

  const updateTopStyling = () => {
    const referenceHeight = referenceElement.getBoundingClientRect().height;
    const gap =
      parseFloat(
        getComputedStyle(referenceElement.parentNode).getPropertyValue(
          "grid-row-gap"
        )
      ) || 0;
    stickyElement.style.top = `${referenceHeight + gap}px`;
  };

  if ("ResizeObserver" in window) {
    observer = new ResizeObserver(updateTopStyling);
    observer.observe(referenceElement);
  }

  return () => {
    if (observer) observer.unobserve(referenceElement);
  };
};

/**
 * Formats a date string into the standard US format ("Month Day, Year").
 * @param {string} dateStr - The date string to be formatted. It must be a string representing a valid date.
 * @returns {string} The formatted date string.
 * @throws {Error} If the input date string is invalid or can't be parsed into a date, an error will be thrown.
 */
const formatDateUSA = (dateStr) => {
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
 * Increases a value in an object by a specified increment.
 * @param {Object} obj - The object that contains the value to be increased.
 * @param {string} key - The key of the value to be increased in the object.
 * @param {number} increment - The amount to increase the value by.
 * @returns {Object} The object with the increased value.
 * @throws {Error} Throws an error if the object, key or increment is invalid, or if the value or increment to be increased is NaN.
 */
const increaseObjectValue = (obj, key, increment) => {
  if (!obj || !key || !obj.hasOwnProperty(key)) {
    throw new Error(`Invalid parameters: obj[${key}] does not exist.`);
  }

  const value = parseInt(obj[key]);

  if (isNaN(value)) {
    throw new Error(`Invalid or NaN object value: obj[${key}].`);
  }

  if (isNaN(parseInt(increment))) {
    throw new Error(`Invalid or NaN increment value: ${increment}.`);
  }

  return { ...obj, [key]: value + parseInt(increment) };
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
 * Appends a string as a child element to a specified HTML parent element.
 * @param {HTMLElement} parentEl - The parent HTML element to which the string will be appended.
 * @param {string} stringChild - The string to be appended as an HTML child. If not provided or invalid, a warning is logged and the function will not append anything.
 * @throws Will throw an error if parentEl is not an instance of HTMLElement.
 */
const appendStringAsChildElement = (parentEl, stringChild = "") => {
  validateIsHtmlElement(parentEl);
  if (!stringChild)
    console.warn(
      "insertAdjacentHTML: stringChild parameter is not valid or empty."
    );

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
 * Retrieves the list of prediction IDs that the user has already voted for.
 * @returns {Array<string>} An array of prediction IDs.
 */
const getVotedPredictionIds = () => {
  let idList = document.cookie.replace(
    /(?:(?:^|.*;\s*)pids\s*\=\s*([^;]*).*$)|^.*$/,
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
const addVotedPredictionId = (predictionId) => {
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
const hasVotedPrediction = (predictionId) => {
  if (!predictionId) {
    console.error(`Invalid parameter, predictionId: ${predictionId}`);
    return;
  }

  const idList = getVotedPredictionIds();
  return idList.includes(predictionId);
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
 * Adds a CSS class to the prediction card element to indicate that it is expired.
 * This function relies on the document's structure and on the `getElement` function.
 * @param {string} predictionId - The ID of the prediction card to mark as expired.
 * @throws Will throw an error if the `getElement` function is not defined or if it doesn't select the correct element.
 */
const setPredictionAsExpired = (predictionId) => {
  const predictionCardEl = getElement(
    `.predictions__item[data-prediction-id="${predictionId}"]`
  );

  if (!predictionCardEl) return;

  const voteBtnElList = predictionCardEl.querySelectorAll(
    "button[data-prediction-id]"
  );

  predictionCardEl.classList.add("predictions__item--expired");
  voteBtnElList.forEach((voteBtnEl) => {
    voteBtnEl.disabled = true;
    voteBtnEl.removeAttribute("data-prediction-id");
  });
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
const getRemainingTimeUnits = (futureTimestamp = NaN, predictionId) => {
  try {
    if (isNaN(futureTimestamp)) {
      throw new Error("The future timestamp is not a number");
    }

    if (!predictionId) {
      throw new Error(
        `Missing or invalid parameter (predictionId): ${predictionId}`
      );
    }

    const diffMilliseconds = futureTimestamp - new Date().getTime();

    if (diffMilliseconds < 1000) {
      console.warn("The realization time is in the past.");
      setPredictionAsExpired(predictionId);

      return {
        units: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        },
        next: false,
      };
    }

    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    return {
      units: {
      days: diffDays,
      hours: diffHours % 24,
      minutes: diffMinutes % 60,
      seconds: diffSeconds % 60,
      },
      next: true,
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
    "username",
    "info_url",
  ];
  const predictionKeys = Object.keys(prediction);

  requiredKeys.forEach((key) => {
    if (!predictionKeys.includes(key)) {
      throw new Error(`Missing required key: ${key}`);
    }
  });

  const countdownData = getCountdownData(
    prediction["realization_time"],
    prediction["id"]
  );

  return {
    id: prediction["id"],
    content: prediction["prediction_content"],
    tag: prediction["tag"],
    votes: prediction["votes"],
    countdown: countdownData.units,
    countdownNext: countdownData.next,
    realizationTime: formatDateUSA(prediction["realization_time"]),
    username: prediction["username"],
    infoUrl: prediction["info_url"],
    hasVoted: hasVotedPrediction(prediction["id"]),
  };
};

/**
 * Calculates the remaining time (in years, months, days, hours, minutes, and seconds) to a specific time.
 * @param {string} realizationTime - The time of realization in a valid date string format.
 * @throws {Error} Throws an error if realizationTime is not a valid date string.
 * @returns {Object} Returns an object containing the remaining time in various units (years, months, days, hours, minutes, seconds).
 */
const getCountdownData = (realizationTime, predictionId) => {
  const realizationTimeTimestamp = getTimestampFromDateString(realizationTime);
  return getRemainingTimeUnits(realizationTimeTimestamp, predictionId);
};

/**
 * Iterates over each property of the given object, applies the provided template function to them,
 * and combines the results into a single string.
 * @param {Object} obj The object to iterate over.
 * @param {Function} templateFunction - The function to apply to each property of the object. This function should take two arguments: the property value and the property key, and return a string.
 * @param {Object} [options=null] - Additional options that may be used by the template function.
 * @returns {string} The resulting string, with each property of the object transformed by the template function and combined together. Returns an empty string if the provided object is null or undefined.
 */
const generateTemplateString = (obj, templateFunction, options = null) => {
  return obj
    ? Object.keys(obj)
        .map((key) => templateFunction(obj[key], key, options))
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
  stopCountdowns();
  removeChildElements(predictionListEl);
};

const goToPredictionList = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );
  const { newPredictionCardEl, predictionListEl } = options;

  hideElement(newPredictionCardEl);
  showElement(predictionListEl);
  fetchAndListPredictions(predictionListEl, getPredictionsFromApi);
};

/**
 * Adds prediction cards to the specified HTML element.
 * @param {HTMLElement} predictionListEl - The HTML element to which prediction cards will be appended.
 * @param {Array} predictions - An array of predictions to be listed.
 * @throws Will throw an error if predictionListEl is not an instance of HTMLElement.
 */
const listPredictions = (predictionListEl, predictions) => {
  validateIsHtmlElement(predictionListEl);

  const predictionCards = generatePredictionCards(predictions);
  appendStringAsChildElement(predictionListEl, predictionCards);
};

/**
 * Generates HTML string of prediction cards from the provided predictions array.
 * @param {Array} predictions - An array of predictions to be transformed into HTML string.
 * @throws Will throw an error if the predictions parameter is not an array.
 * @returns {string} A string of HTML representing each prediction as a card.
 */
const generatePredictionCards = (predictions) => {
    if (!Array.isArray(predictions)) {
    throw new Error("Invalid type: predictions parameter has to be an array.");
    }

  return predictions
      .map((prediction) => {
        const predictionData = createPredictionData(prediction);
        return getPredictionCardTemplate(predictionData);
      })
      .join("");
};

/**
 * @async
 * @param {HTMLElement} predictionListEl - The HTML element where the predictions will be listed.
 * @param {Function} fetchPredictionsFunc - The function to fetch predictions.
 * @throws {Error} Throws an error if the fetch operation fails.
 * @returns {Object} Returns an object indicating whether the operation was successful or not.
 * If it was not, the object also contains an 'error' property.
 */
const fetchAndListPredictions = async (
  predictionListEl,
  fetchPredictionsFunc
) => {
  try {
    const predictions = await fetchPredictionsFunc();
    stopCountdowns();

    removeChildElements(predictionListEl);
    listPredictions(predictionListEl, predictions);
    addClickEventToPredictionList(predictionListEl);
    startCountdowns(predictions);

    return { isFetched: true };
  } catch (error) {
    console.error(`Failed to fetch item: ${error}`);
    return { isFetched: false, error: error };
  }
};

/**
 * Starts a countdown for each prediction in the provided raw data.
 * The countdown runs every second, updates the countdown data for each prediction, and updates the corresponding DOM element.
 * @param {Array} rawPredictions - The raw data containing the predictions.
 * @global
 */
const startCountdowns = (rawPredictions) => {
  const endedCountdowns = [];

  globalCountdownInterval = setInterval(() => {
    rawPredictions.forEach((prediction) => {
      const countdownData = getCountdownData(
        prediction["realization_time"],
        prediction["id"]
      );

      const isEndedCountdown = endedCountdowns.includes(prediction.id);
      if (isEndedCountdown) return;

      if (!countdownData.next) endedCountdowns.push(prediction.id);

      const countdownItems = generateTemplateString(
        countdownData.units,
        getCountdownItemTemplate,
        { next: countdownData.next }
      );

      const countdownItemsContainerEl = getElement(
        `#countdown-items-container-${prediction.id}`
      );

      if (countdownItemsContainerEl) {
        removeChildElements(countdownItemsContainerEl);
        appendStringAsChildElement(countdownItemsContainerEl, countdownItems);
      }
    });
  }, 1000);
};

/**
 * Stops all countdowns that have been started with 'startCountdowns'.
 * @global
 */
const stopCountdowns = () => {
  clearInterval(globalCountdownInterval);
};

/**
 * Attaches click event listeners to the predictions list and handles vote button clicks.
 * @param {HTMLElement} predictionListEl - The HTML element of the prediction list.
 */
const addClickEventToPredictionList = (predictionListEl) => {
  validateIsHtmlElement(predictionListEl);

  let isActiveClick = false;

  predictionListEl.addEventListener("click", async (e) => {
    const voteBtnEl = e.target.closest(".predictions__item-vote-button-item");
    if (!voteBtnEl || isActiveClick) {
      return;
    }

    const predictionId = voteBtnEl.getAttribute("data-prediction-id");
    if (!predictionId) {
      return;
    }

    isActiveClick = true;

    const voteButtonsContainerEl = voteBtnEl.closest(
      ".predictions__item-vote-buttons"
    );

    const hasVoted = hasVotedPrediction(predictionId);
    if (hasVoted) {
      console.warn("The prediction has already voted.");
      return;
    }

    const voteBtnIconItem = voteBtnEl.querySelector(
      `.predictions__item-vote-button-item-icon`
    );
    await addAnimation(voteBtnIconItem, "swing", ["faster"]);

    await handleClickVoteBtn(voteBtnEl, predictionId, voteButtonsContainerEl);

    isActiveClick = false;
  });
};

/**
 * Handles click event on vote buttons, fetches the current votes, updates the vote count, and updates the vote buttons.
 * @async
 * @param {HTMLElement} voteBtnEl - The HTML element of the clicked vote button.
 * @param {string} predictionId - The ID of the prediction related to the clicked vote button.
 * @param {HTMLElement} voteButtonsContainerEl - The container of the vote buttons.
 * @throws {Error} Throws an error if the vote update operation fails.
 */
const handleClickVoteBtn = async (
  voteBtnEl,
  predictionId,
  voteButtonsContainerEl
) => {
  validateIsHtmlElement(voteBtnEl);
  validateIsHtmlElement(voteButtonsContainerEl);

  try {
    const voteType = voteBtnEl.getAttribute("data-vote-type");

    const currentVotes = await getCurrentVotes(predictionId);

    const updatedVotes = await updateVoteCount(
      predictionId,
      currentVotes,
      voteType
    );

    addVotedPredictionId(predictionId);

    const updatedVoteButtons = generateTemplateString(
      updatedVotes,
      getVoteButtonTemplate,
      { isDisabled: true }
    );

    removeChildElements(voteButtonsContainerEl);
    appendStringAsChildElement(voteButtonsContainerEl, updatedVoteButtons);

    const voteBtnCounterItem = voteButtonsContainerEl.querySelector(
      `[data-vote-type="${voteType}"] .predictions__item-vote-counter`
    );
    await addAnimation(voteBtnCounterItem, "bounceIn");

    return { isCompleted: true };
  } catch (error) {
    console.error(`Failed to update vote: ${error}`);
    return { isCompleted: false };
  }
};

/**
 * Fetches the current votes for a prediction from the API.
 * @async
 * @param {string} predictionId - The id of the prediction.
 * @returns {Object} The current votes of the prediction.
 * @throws {Error} Throws an error if the predictionId is empty or invalid, or if the fetched data is invalid.
 */
const getCurrentVotes = async (predictionId) => {
  if (!predictionId) {
    throw new Error("Invalid predictionId parameter: id is empty or invalid");
  }

  const prediction = await getPredictionFromApiById(predictionId);

  if (!prediction) {
    throw new Error("Invalid data: data is empty or invalid");
  }

  return { votes: prediction.votes };
};

/**
 * Updates the vote count for a prediction and puts the updated vote to the API.
 * @async
 * @param {string} predictionId - The id of the prediction.
 * @param {Object} currentVotes - The current votes of the prediction.
 * @param {string} voteType - The type of the vote ("up" or "down").
 * @returns {Object} The updated votes of the prediction.
 * @throws {Error} Throws an error if the predictionId or voteType is invalid, or if updating the vote count fails.
 */
const updateVoteCount = async (predictionId, currentVotes, voteType) => {
  if (!predictionId) {
    throw new Error("Invalid predictionId parameter: id is empty or invalid");
  }

  const validVoteTypes = ["up", "down"];

  if (!validVoteTypes.includes(voteType)) {
    throw new Error(
      `Invalid vote type: ${voteType}. Must be one of: ${validVoteTypes.join(
        ", "
      )}`
    );
  }

  const inreasedVotes = increaseObjectValue(
    currentVotes.votes,
    `${voteType}Count`,
    1
  );
  const data = { votes: inreasedVotes };

  const { votes } = await putUpdatedVoteToApi(predictionId, data);
  return votes;
};

/**
 * Toggles the disabled status of all vote buttons within the provided vote buttons container.
 * @param {boolean} shouldDisable - Determines whether the buttons should be disabled.
 * @param {HTMLElement} voteBtnEl - A button element within the vote buttons container.
 * @param {HTMLElement} voteButtonsContainerEl - The container element for the vote buttons.
 * @throws {Error} Throws an error if the provided elements are not valid or if 'shouldDisable' is not a boolean.
 */
const toggleButtonsDisabledStatus = (
  shouldDisable,
  voteBtnEl,
  voteButtonsContainerEl
) => {
  validateIsHtmlElement(voteBtnEl);
  validateIsHtmlElement(voteButtonsContainerEl);

  if (typeof shouldDisable !== "boolean") {
    throw new Error("Invalid parameter: shouldDisable must be a boolean.");
  }

  const voteButtonElList = voteButtonsContainerEl.querySelectorAll(
    ".predictions__item-vote-button-item"
  );
  voteButtonElList.forEach((btnEl) => (btnEl.disabled = shouldDisable));
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
  const {
    id,
    content,
    countdown,
    countdownNext,
    tag,
    votes,
    realizationTime,
    username,
    infoUrl,
    hasVoted,
  } = data;

  const countdownItems = generateTemplateString(
    countdown,
    getCountdownItemTemplate,
    { next: countdownNext }
  );
  const voteButtons = generateTemplateString(votes, getVoteButtonTemplate, {
    predictionId: id,
    isDisabled: hasVoted,
  });

  const usernameItem = `<a ${
    infoUrl ? `href="${infoUrl}"` : ""
  } class="url url--inherit url--secondary" title="Prediction Owner">(${username})</a>`;

  return `
    <div class="card card--full predictions__item${
      content ? "" : " hide"
    }" data-prediction-id="${id}">
      <p class="predictions__item-content"><span class="predictions__item-content-label">[Expired]</span> ${content} ${usernameItem}</p>
      <div class="predictions__item-date">
      <div id="countdown-items-container-${id}" class="predictions__item-countdown">${countdownItems}</div>
        <span class="predictions__item-realization-time ${
          !countdownNext ? "predictions__item-realization-time--error" : ""
        }">Realization: ${realizationTime}</span>
      </div>
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
const getCountdownItemTemplate = (itemValue, itemName, options) => {
  const { next } = options;

  const errorClassName = !next ? "predictions__item-countdown-item--error" : "";

  return `
    <div class="predictions__item-countdown-item ${errorClassName}">
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
 * @param {number} voteValue - The value of the vote count. If null, vote count will be displayed as 0.
 * @param {string} voteTypeKey - The key to determine the type of the vote button ("upCount" or "downCount").
 * @param {Object} options - Additional options.
 * @throws {Error} Will throw an error if voteTypeKey is not "upCount" or "downCount".
 * @returns {string} The template string for the vote button element.
 */
const getVoteButtonTemplate = (voteValue, voteTypeKey, options) => {
  const voteTypes = {
    upCount: "up",
    downCount: "down",
  };

  const voteType = voteTypes[voteTypeKey];
  if (!voteType) throw new Error(`Invalid voteTypeKey: ${voteTypeKey}`);

  const { predictionId, isDisabled } = options;

  const dataPredictionIdAttr = predictionId
    ? `data-prediction-id="${predictionId}"`
    : "";

  const disabledAttr = isDisabled === true ? "disabled" : "";

  const titleText =
    isDisabled === true
      ? `You have already voted the prediction.`
      : `Vote ${voteType}!`;

  return `
    <button
      type="button"
      class="predictions__item-vote-button-item"
      data-vote-type="${voteType}"
      ${dataPredictionIdAttr}
      ${disabledAttr}
      title="${titleText}"
    >
      <span class="predictions__item-vote-button-item-icon"
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

/**
 * Attaches click event listeners to tag buttons and filters the predictions list based on clicked tag.
 * @param {Object} options - The options for the function.
 * @param {Element} options.tagButtonListEl - The HTML element of the tag button list.
 * @param {Element} options.predictionListEl - The HTML element where the predictions will be listed.
 */
const handleClickTagButtons = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const { tagButtonListEl, predictionListEl } = options;

  tagButtonListEl.addEventListener("click", (e) => {
    const targetClassList = [...e.target.classList];
    const isValidTarget =
      targetClassList.includes("btn") &&
      !targetClassList.includes("btn--active");

    if (isValidTarget) {
      filterPredictionsAfterClickTagButton(predictionListEl, e);
    }
  });
};

/**
 * Filters and updates the predictions list based on the clicked tag button.
 * @async
 * @param {Element} predictionListEl - The HTML element where the predictions will be listed.
 * @param {Event} event - The event object from the tag button click event.
 * @throws {Error} Throws an error if the predictionListEl is not a valid HTML element or fetching predictions fails.
 */
const filterPredictionsAfterClickTagButton = async (
  predictionListEl,
  event
) => {
  validateIsHtmlElement(predictionListEl);

  const clickedBtn = event.target;
  clickedBtn.disabled = true;
  const tagQuery = clickedBtn.getAttribute("data-tag-value");

  const response = await fetchAndListPredictions(predictionListEl, () =>
        getPredictionsFromApiWithTagQuery(tagQuery)
      );

  if (!response.isFetched) {
    clickedBtn.disabled = false;
    return;
    }

  const oldActiveBtn = getElement("#tag-buttons-container .btn--active");
  oldActiveBtn.classList.remove("btn--active");

  clickedBtn.classList.add("btn--active");
  clickedBtn.disabled = false;
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

  fetchAndListPredictions(elements.predictionListEl, getPredictionsFromApi);
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
    predictionListEl: elements.predictionListEl,
  });
});
