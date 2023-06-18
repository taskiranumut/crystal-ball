// Virtual Routing
// -------------------------

import { stopCountdowns } from "../countdown";
import { handleFormErrors, resetFormData } from "../forms";
import { filterPredictionsAfterClickTagButton } from "../predictions";
import { getActiveTagBtn } from "../tags";
import {
  toggleElement,
  validateIsHtmlElement,
  removeChildElements,
} from "../utils";

/**
 * Navigates to the new prediction form, hides the prediction list and shows the new prediction form.
 * It also stops any ongoing countdowns and clears the prediction list.
 * @param {Object} options - The DOM elements for operation.
 * @param {HTMLElement} options.newPredictionCardEl - The new prediction form element.
 * @param {HTMLElement} options.predictionListEl - The prediction list element.
 */
export const goToNewPredictionForm = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );
  const { newPredictionCardEl, predictionListEl } = options;

  toggleElement("hide", predictionListEl);
  toggleElement("show", newPredictionCardEl);
  stopCountdowns();
  removeChildElements(predictionListEl);
};

/**
 * Navigates to the prediction list, hides the new prediction form and shows the prediction list.
 * It also triggers the filtering of predictions based on the active tag button.
 * @param {Object} options - The DOM elements for operation.
 * @param {HTMLElement} options.newPredictionCardEl - The new prediction form element.
 * @param {HTMLElement} options.predictionListEl - The prediction list element.
 * @param {Boolean|null} isAll - A flag to specify if it should return the 'all' button for the filter function.
 */
export const goToPredictionList = (options, isAll) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );
  const { newPredictionCardEl, predictionListEl, newPredictionFormEl } =
    options;

  toggleElement("hide", newPredictionCardEl);
  toggleElement("show", predictionListEl);

  resetFormData(newPredictionFormEl);
  handleFormErrors({ action: "hide", formEl: newPredictionFormEl });

  const tagBtnEl = getActiveTagBtn(isAll);
  filterPredictionsAfterClickTagButton({
    predictionListEl,
    tagBtnEl,
  });
};
