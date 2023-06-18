/* eslint-disable no-console */
import { getInstanceEl } from "../services";
import store from "../store";
import { getFormErrorTemplate } from "../templates";
import {
  appendStringAsChildElement,
  validateIsHtmlFormElement,
  formatDateUSA,
} from "../utils";

import { getCountdownData } from "../countdown";
import { hasVotedPrediction } from "../votes";

/**
 * Removes error items from the form.
 * @param {HTMLFormElement} formEl - The form element from which the error messages will be removed.
 */
const removeFormErrorItems = (formEl) => {
  validateIsHtmlFormElement(formEl);

  const errorElList = formEl.querySelectorAll(".error");
  errorElList.forEach((el) => el.remove());

  const errorBorderElList = formEl.querySelectorAll(".error--border");
  errorBorderElList.forEach((el) => el.classList.remove("error--border"));
};

/**
 * Adds error items to the form based on the provided errors.
 * @param {HTMLFormElement} formEl - The form element to which the error messages will be added.
 * @param {Array} errors - An array of error messages.
 */
const addFormErrorItems = (formEl, errors) => {
  validateIsHtmlFormElement(formEl);

  if (!Array.isArray(errors)) {
    console.error("Invalid type: errors parameter must be an array.");
    return;
  }

  errors.forEach((item) => {
    const { formItemName: name, messages } = item;
    const message = [messages[0]];
    const errorItem = getFormErrorTemplate(message);

    // formItemEl represents initEl (in instance trackers).
    const formItemEl = formEl.querySelector(`[name="${name}"]`);
    const formItemContainerEl = formItemEl.closest(".form__item-group");
    const instanceEl = getInstanceEl(formItemEl);

    if (instanceEl) instanceEl.classList.add("error--border");
    else formItemEl.classList.add("error--border");

    appendStringAsChildElement(formItemContainerEl, errorItem);
  });
};

/**
 * Resets the state of instance elements contained within a specified form element.
 * This function loops through each instance tracker, which contain functions to reset
 * instances of a specific type (e.g., Choices or Flatpickr instances).
 * @param {HTMLFormElement} formEl - The form element within which instance states will be reset.
 */
const resetInstancesInForm = (formEl) => {
  validateIsHtmlFormElement(formEl);

  const INSTANCE_TRACKER_LIST = [
    {
      tracker: store.choicesInstances,
      tagNames: Object.keys(store.choicesInstances),
      resetFunc: (instance) => instance.setChoiceByValue(""),
    },
    {
      tracker: store.flatpickrInstances,
      tagNames: Object.keys(store.flatpickrInstances),
      resetFunc: (instance) => instance.clear(),
    },
  ];

  INSTANCE_TRACKER_LIST.forEach(({ tracker, tagNames, resetFunc }) => {
    tagNames.forEach((tagName) => {
      if (tagName === "path") return;

      const tagTrackerList = tracker[tagName];
      if (!tagTrackerList) return;

      tagTrackerList.forEach(({ initEl, instance }) => {
        if (initEl && formEl.contains(initEl)) resetFunc(instance);
      });
    });
  });
};

/**
 * Retrieves and returns form data as a JavaScript object.
 * @param {HTMLFormElement} formEl - The form element from which to retrieve data.
 * @returns {Object} - An object representing the form data.
 * The object's properties correspond to form control names, and the values correspond to form control values.
 * @throws Will throw an error if the provided element is not an instance of HTMLFormElement.
 */
export const getFormData = (formEl) => {
  validateIsHtmlFormElement(formEl, "formEl");

  const formData = new FormData(formEl);
  return Object.fromEntries(formData.entries());
};

/**
 * Handles form errors according to the specified action (show or hide).
 * @param {Object} options - An object containing the action to take, the form element, and an array of error messages.
 */
export const handleFormErrors = (options) => {
  const { action: actionType, formEl, errors = null } = options;

  validateIsHtmlFormElement(formEl);

  const actionTypeObj = {
    show: true,
    hide: false,
    true: true,
    false: false,
  };

  const isActive = actionTypeObj[actionType];
  if (typeof isActive !== "boolean") {
    throw new Error(
      `Invalid parameter, actionType must be "show", "hide", "true" or "false". actionType: ${actionType}`
    );
  }

  if (!isActive) {
    removeFormErrorItems(formEl);
    return;
  }

  if (!errors) {
    return;
  }

  addFormErrorItems(formEl, errors);
};

/**
 * Resets form data.
 * @param {HTMLFormElement} formEl - The form element whose data will be reset.
 */
export const resetFormData = (formEl) => {
  validateIsHtmlFormElement(formEl);

  resetInstancesInForm(formEl);
  formEl.reset();
};

/**
 * Retrieves form data from a given HTMLFormElement and adds additional properties.
 * @param {HTMLFormElement} newPredictionFormEl - The form element from which to retrieve data.
 * @returns {Object} - An object representing the form data along with additional properties.
 * The object's properties include form control names, form control values and a votes object.
 * @throws Will throw an error if the provided element is not an instance of HTMLFormElement.
 */
export const getNewPredictionData = (newPredictionFormEl) => {
  validateIsHtmlFormElement(newPredictionFormEl);

  const formData = getFormData(newPredictionFormEl);
  return {
    info_url: formData["info-address"],
    prediction_content: formData["prediction-content"],
    realization_time: formData["realization-time"],
    tag: formData.tag,
    username: formData.username,
    votes: { up_count: 0, down_count: 0 },
    is_reviewed: false,
  };
};

/**
 * Takes a prediction object and returns a new object with processed data.
 * @param {object} prediction - The prediction object. Required keys: "id", "prediction_content", "tag", "votes", "realization_time".
 * @returns {object} An object that contains the processed prediction data.
 * @throws Will throw an error if the prediction parameter is not an object or if it's missing any of the required keys.
 */
export const createPredictionData = (prediction) => {
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
    prediction.realization_time,
    prediction.id
  );

  return {
    id: prediction.id,
    content: prediction.prediction_content,
    tag: prediction.tag,
    votes: prediction.votes,
    countdown: countdownData.units,
    countdownNext: countdownData.next,
    realizationTime: formatDateUSA(prediction.realization_time),
    username: prediction.username,
    infoUrl: prediction.info_url,
    hasVoted: hasVotedPrediction(prediction.id),
  };
};
