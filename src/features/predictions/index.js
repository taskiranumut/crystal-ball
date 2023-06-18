/* eslint-disable no-console */
import { getPredictionsByTag } from "../../api";
import { startCountdowns, stopCountdowns } from "../countdown";
import { addClickEventToPredictionList } from "../../events";
import { createPredictionData } from "../../forms";
import {
  getEmptyContentTemplate,
  getPredictionCardTemplate,
} from "../../templates";
import {
  validateIsHtmlElement,
  appendStringAsChildElement,
  removeChildElements,
  toggleElement,
  getElement,
} from "../../utils";

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
 * Adds prediction cards to the specified HTML element. If there are no predictions, it displays an "empty content" message.
 * @param {HTMLElement} predictionListEl - The HTML element to which prediction cards will be appended.
 * @param {Array} predictions - An array of predictions to be listed.
 * @throws Will throw an error if predictionListEl is not an instance of HTMLElement.
 */
export const listPredictions = (predictionListEl, predictions) => {
  validateIsHtmlElement(predictionListEl);

  const predictionCards = generatePredictionCards(predictions);

  const template = predictionCards || getEmptyContentTemplate();
  appendStringAsChildElement(predictionListEl, template);
};

/**
 * @async
 * @param {HTMLElement} predictionListEl - The HTML element where the predictions will be listed.
 * @param {Function} fetchPredictionsFunc - The function to fetch predictions.
 * @throws {Error} Throws an error if the fetch operation fails.
 * @returns {Object} Returns an object indicating whether the operation was successful or not.
 * If it was not, the object also contains an 'error' property.
 */
export const fetchAndListPredictions = async (
  predictionListEl,
  fetchPredictionsFunc
) => {
  try {
    stopCountdowns();
    removeChildElements(predictionListEl);
    toggleElement("show", "#main-loader");

    const { isSuccessful, data: predictions } = await fetchPredictionsFunc();

    if (!isSuccessful) {
      throw new Error(`${fetchPredictionsFunc} is not successful`);
    }

    toggleElement("hide", "#main-loader");
    listPredictions(predictionListEl, predictions);
    startCountdowns(predictions);
    addClickEventToPredictionList(predictionListEl);

    return { isFetched: true };
  } catch (error) {
    console.error(`Failed to fetch item: ${error}`);
    return { isFetched: false, error };
  }
};

/**
 * Filters and updates the predictions list based on the clicked tag button. After successful fetching,
 * it deactivates the old active button and activates the clicked button.
 * @async
 * @param {Object} options - The DOM elements and the event object for the operation.
 * @param {HTMLElement} options.predictionListEl - The HTML element where the predictions will be listed.
 * @param {Event|null} options.event - The click event object.
 * @param {HTMLElement|null} options.tagBtnEl - The clicked tag button element.
 * @throws Will throw an error if the clickedBtn parameter is not valid.
 */
export const filterPredictionsAfterClickTagButton = async (options) => {
  const { predictionListEl, event = null, tagBtnEl = null } = options;

  validateIsHtmlElement(predictionListEl);

  const clickedBtn = event ? event.target : tagBtnEl;
  if (!clickedBtn) {
    throw new Error(`Invalid tag buton element, clickedBtn: ${clickedBtn}`);
  }

  if (!tagBtnEl) clickedBtn.disabled = true;
  const tagQuery = clickedBtn.getAttribute("data-tag-value");

  const response = await fetchAndListPredictions(predictionListEl, () =>
    getPredictionsByTag("tag", tagQuery)
  );

  if (!response.isFetched) {
    clickedBtn.disabled = false;
    return;
  }

  const oldActiveBtn = getElement("#tag-buttons-container .btn--active");
  oldActiveBtn.classList.remove("btn--active");

  clickedBtn.classList.add("btn--active");
  if (!tagBtnEl) clickedBtn.disabled = false;
};
