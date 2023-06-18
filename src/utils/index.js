/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { getModalTemplate } from "../templates";

/**
 * Formats a date string into the standard US format ("Month Day, Year").
 * @param {string} dateStr - The date string to be formatted. It must be a string representing a valid date.
 * @returns {string} The formatted date string.
 * @throws {Error} If the input date string is invalid or can't be parsed into a date, an error will be thrown.
 */
export const formatDateUSA = (dateStr) => {
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
 * Validates if a value is an instance of HTMLElement.
 * @param {any} value - The value to validate.
 * @param {string} [property="the value passed as an argument"] - The name of the property for error messaging.
 * @throws {Error} Throws an error if the value is not an instance of HTMLElement.
 */
export const validateIsHtmlElement = (
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
export const validateIsHtmlFormElement = (
  el,
  elName = "the value passed as an argument"
) => {
  if (!(el instanceof HTMLFormElement)) {
    throw new Error(`Invalid parameter: ${elName} is not a form element.`);
  }
};

/**
 * Selects an element from the DOM.
 * @param {string} selector - The CSS selector of the element to select.
 * @returns {HTMLElement|null} The selected element, or null if not found.
 */
export const getElement = (selector) => {
  const element = document.querySelector(selector);
  if (!element) {
    console.error(`Element not found: ${selector}`);
    return null;
  }
  return element;
};

/**
 * Iterates over a NodeList or an Array of Elements and runs a specified function for each Element.
 * @param {NodeList|string} elements - A NodeList, an array of Elements or a string selector for the elements to iterate over.
 * @param {Function} listFunction - The function to be run for each Element in the NodeList or array.
 * @returns {void}
 * @throws Will throw an error if the provided `elements` parameter is not an NodeList, array, or string.
 * @throws Will throw an error if the provided `listFunction` parameter is not a function.
 */
export const runFunctionForElementList = (elements, listFunction) => {
  if (typeof elements !== "string" && !Array.isArray([...elements])) {
    throw new Error(
      `Invalid parameter, elements is not an array or a string. elements: ${elements}`
    );
  }

  if (typeof listFunction !== "function") {
    throw new Error(
      `Invalid parameter, listFunction is not a function. function: ${listFunction}`
    );
  }

  const elList = Array.isArray(elements)
    ? elements
    : document.querySelectorAll(elements);
  elList.forEach((el) => listFunction(el));
};

/**
 * Increases a value in an object by a specified increment.
 * @param {Object} obj - The object that contains the value to be increased.
 * @param {string} key - The key of the value to be increased in the object.
 * @param {number} increment - The amount to increase the value by.
 * @returns {Object} The object with the increased value.
 * @throws {Error} Throws an error if the object, key or increment is invalid, or if the value or increment to be increased is NaN.
 */
export const increaseObjectValue = (obj, key, increment) => {
  if (!obj || !key || !Object.prototype.hasOwnProperty.call(obj, key)) {
    throw new Error(`Invalid parameters: obj[${key}] does not exist.`);
  }

  const value = Number(obj[key]);

  if (Number.isNaN(value)) {
    throw new Error(`Invalid or NaN object value: obj[${key}].`);
  }

  if (Number.isNaN(Number(increment))) {
    throw new Error(`Invalid or NaN increment value: ${increment}.`);
  }

  return { ...obj, [key]: value + Number(increment) };
};

/**
 * Removes all child elements from a parent HTML element.
 * @param {HTMLElement} parentEl - The parent HTML element from which child elements will be removed.
 * @throws {Error} Will throw an error if parentEl is not an instance of HTMLElement.
 */
export const removeChildElements = (parentEl) => {
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
export const appendStringAsChildElement = (parentEl, stringChild = "") => {
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
 * Toggles visibility of an element based on the specified action type.
 * @param {('show'|'hide'|'true'|'false')} actionType - The action type to determine whether to show or hide the element.
 * @param {(HTMLElement|string)} selector - The HTMLElement or a selector string that points to an element to be shown or hidden.
 * @throws Will throw an error if the actionType parameter is not valid.
 */
export const toggleElement = (actionType, selector) => {
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

  const element =
    selector instanceof HTMLElement ? selector : getElement(selector);

  isActive ? showElement(element) : hideElement(element);
};

/**
 * Fills an elements object with HTMLElements selected by their CSS selectors.
 * @param {object} elements - The elements object to fill.
 * @param {Array<{elName: string, selector: string}>} selectorList - The list of elements to select.
 * @throws {Error} Throws an error if the provided arguments are not an object and an array.
 */
export const fillElementsObject = (elements, selectorList) => {
  if (
    !Array.isArray(selectorList) ||
    typeof elements !== "object" ||
    elements === null
  ) {
    throw new Error(
      `Invalid argument: fillElementsObject expects an object and an array.`
    );
  }

  selectorList.forEach((item) => {
    elements[item.elName] = getElement(item.selector);
  });
};

/**
 * Displays a modal with the provided options.
 * @param {Object} options - Configuration options for the modal.
 * @param {string} [options.title=""] - The title for the modal.
 * @param {string} [options.content=""] - The content for the modal.
 * @param {string} [options.closeBtnText="OK"] - The text for the close button.
 */
export const showModal = (options) => {
  const modalContainerEl = getElement("#modal-container");

  const modal = getModalTemplate(options);
  appendStringAsChildElement(modalContainerEl, modal);

  const closeBtnEl = getElement("#close-modal");
  closeBtnEl.addEventListener("click", (e) => {
    e.stopPropagation();
    removeChildElements(modalContainerEl);
  });

  const modalOverlayEl = getElement(".modal__overlay");
  modalOverlayEl.addEventListener("click", (e) => {
    e.stopPropagation();
  });
};
