import store from "../../store";
import {
  generateTemplateString,
  getCountdownItemTemplate,
} from "../../templates";
import {
  getElement,
  removeChildElements,
  appendStringAsChildElement,
} from "../../utils";

/**
 * Takes a date string in the "YYYY-MM-DD" format, and returns the corresponding timestamp at 23:59:59.
 * @param {string} dateString - The date string to convert. Must be in "YYYY-MM-DD" format.
 * @returns {number} - The timestamp corresponding to the provided date at 23:59:59.
 * @throws Will throw an error if the provided date string is not in the "YYYY-MM-DD" format or is not a valid date.
 */
const getTimestampFromDateString = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    throw new Error(
      `Invalid date string format: ${dateString}. It has to be "YYYY-MM-DD" format.`
    );
  }

  const date = new Date(`${dateString}T23:59:59`);
  if (Number.isNaN(date)) {
    throw new Error(`Invalid date: ${dateString}`);
  }

  return date.getTime();
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
const getRemainingTimeUnits = (predictionId, futureTimestamp = NaN) => {
  if (Number.isNaN(futureTimestamp)) {
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
};

/**
 * Calculates the remaining time (in years, months, days, hours, minutes, and seconds) to a specific time.
 * @param {string} realizationTime - The time of realization in a valid date string format.
 * @throws {Error} Throws an error if realizationTime is not a valid date string.
 * @returns {Object} Returns an object containing the remaining time in various units (years, months, days, hours, minutes, seconds).
 */
export const getCountdownData = (realizationTime, predictionId) => {
  const realizationTimeTimestamp = getTimestampFromDateString(realizationTime);
  return getRemainingTimeUnits(predictionId, realizationTimeTimestamp);
};

/**
 * Starts a countdown for each prediction in the provided raw data.
 * The countdown runs every second, updates the countdown data for each prediction, and updates the corresponding DOM element.
 * @param {Array} rawPredictions - The raw data containing the predictions.
 * @global
 */
export const startCountdowns = (rawPredictions) => {
  const endedCountdowns = [];

  store.globalCountdownInterval = setInterval(() => {
    rawPredictions.forEach((prediction) => {
      const countdownData = getCountdownData(
        prediction.realization_time,
        prediction.id
      );

      const isEndedCountdown = endedCountdowns.includes(prediction.id);
      if (isEndedCountdown) return;

      if (!countdownData.next) endedCountdowns.push(prediction.id);

      const countdownItems = generateTemplateString(
        countdownData.units,
        getCountdownItemTemplate,
        {
          next: countdownData.next,
        }
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
export const stopCountdowns = () => {
  clearInterval(store.globalCountdownInterval);
};
