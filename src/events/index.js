/* eslint-disable no-console */
import { getCurrentVotes, postPrediction, updateVotes } from "../api";
import {
  getNewPredictionData,
  handleFormErrors,
  resetFormData,
} from "../forms";
import { filterPredictionsAfterClickTagButton } from "../features/predictions";
import { goToNewPredictionForm, goToPredictionList } from "../routes";
import { addAnimation } from "../services";
import { generateTemplateString, getVoteButtonTemplate } from "../templates";
import {
  increaseObjectValue,
  validateIsHtmlElement,
  removeChildElements,
  appendStringAsChildElement,
  showModal,
  toggleElement,
} from "../utils";
import { validateFormData } from "../validations";
import { addVotedPredictionId, hasVotedPrediction } from "../features/votes";
import { addEvent } from "./utils";

export { addEvent, checkEvent } from "./utils";

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
    `${voteType}_count`,
    1
  );
  const data = { votes: inreasedVotes };

  const { data: votes, isSuccessful } = await updateVotes(data, predictionId);

  if (!isSuccessful) {
    throw new Error(
      `votes could not be updated, predictionId: ${predictionId}`
    );
  }

  return votes;
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
      {
        isDisabled: true,
      }
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
 * Attaches click event listeners to the predictions list and handles vote button clicks.
 * @param {HTMLElement} predictionListEl - The HTML element of the prediction list.
 */
export const addClickEventToPredictionList = (predictionListEl) => {
  validateIsHtmlElement(predictionListEl);

  let isActiveClick = false;

  const eventHandlerFunction = async (e) => {
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
  };

  addEvent({
    element: predictionListEl,
    eventName: "click",
    handler: eventHandlerFunction,
  });
};

/**
 * Attaches a click event handler to the 'new prediction' button.
 * @param {Object} options - The HTMLElements needed for this function.
 * @param {HTMLElement} options.newPredictionBtnEl - The 'new prediction' button element.
 * @param {HTMLElement} options.newPredictionCardEl - The 'new prediction' card element.
 * @param {HTMLElement} options.predictionListEl - The list of predictions element.
 * @throws {Error} Throws an error if any of the options are not an instance of HTMLElement.
 */
export const handleClickNewPredictionButton = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const { newPredictionBtnEl, newPredictionCardEl, predictionListEl } = options;

  const eventHandlerFunction = () => {
    goToNewPredictionForm({ newPredictionCardEl, predictionListEl });
  };

  addEvent({
    element: newPredictionBtnEl,
    eventName: "click",
    handler: eventHandlerFunction,
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
export const handleClickFormCancelButton = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const {
    formCancelBtnEl,
    newPredictionCardEl,
    predictionListEl,
    newPredictionFormEl,
  } = options;

  const eventHandlerFunction = () => {
    goToPredictionList(
      { newPredictionCardEl, predictionListEl, newPredictionFormEl },
      false
    );
  };

  addEvent({
    element: formCancelBtnEl,
    eventName: "click",
    handler: eventHandlerFunction,
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
export const handleSubmitPredictionForm = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const { newPredictionFormEl, newPredictionCardEl, predictionListEl } =
    options;

  const eventHandlerFunction = async (e) => {
    e.preventDefault();

    const validation = validateFormData(
      newPredictionFormEl,
      "newPredictionForm"
    );

    handleFormErrors({
      action: "hide",
      formEl: newPredictionFormEl,
    });

    if (!validation.isValid) {
      handleFormErrors({
        action: "show",
        formEl: newPredictionFormEl,
        errors: validation.errors,
      });
      return;
    }

    const newPredictionData = getNewPredictionData(newPredictionFormEl);
    const response = await postPrediction(newPredictionData);

    if (!response.isSuccessful) throw new Error(response.error);

    showModal({
      title: "Prediction Will Be Reviewed",
      content:
        "Prediction was submitted successfully. It will be listed after the review is done.",
      closeBtnText: "OK",
    });

    goToPredictionList(
      { newPredictionCardEl, predictionListEl, newPredictionFormEl },
      true
    );
  };

  addEvent({
    element: newPredictionFormEl,
    eventName: "submit",
    handler: eventHandlerFunction,
  });
};

/**
 * Attaches click event listeners to tag buttons. When a tag button is clicked,
 * it hides the new prediction form, shows the prediction list and triggers
 * the filtering of predictions.
 * @param {Object} options - The options for the function.
 * @param {HTMLElement} options.tagButtonListEl - The HTML element of the tag button list.
 * @param {HTMLElement} options.predictionListEl - The HTML element where the predictions will be listed.
 * @param {HTMLElement} options.newPredictionCardEl - The new prediction form element.
 */
export const handleClickTagButtons = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const {
    tagButtonListEl,
    predictionListEl,
    newPredictionCardEl,
    newPredictionFormEl,
  } = options;

  const eventHandlerFunction = (e) => {
    const targetClassList = [...e.target.classList];
    const isValidTarget =
      targetClassList.includes("btn") &&
      !targetClassList.includes("btn--active");

    if (!isValidTarget) {
      return;
    }

    toggleElement("hide", newPredictionCardEl);
    toggleElement("show", predictionListEl);

    resetFormData(newPredictionFormEl);
    handleFormErrors({ action: "hide", formEl: newPredictionFormEl });

    filterPredictionsAfterClickTagButton({
      predictionListEl,
      event: e,
    });
  };

  addEvent({
    element: tagButtonListEl,
    eventName: "click",
    handler: eventHandlerFunction,
  });
};
