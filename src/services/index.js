import Choices from "choices.js";
import store from "../store/index";
import { validateIsHtmlElement } from "../utils/index";

/**
 * Adds an instance to the instances tracker object.
 * @param {HTMLElement} initEl - The HTML Element related to the instance.
 * @param {Object} instance - The instance that needs to be tracked.
 * @param {Object} instancesTracker - The tracker object where the instance is stored.
 * @returns {void}
 * @throws Will throw an error if any of the parameters are missing or if `initEl` is not an HTMLElement.
 */
const addToInstancesTracker = (initEl, instance, instancesTracker) => {
  validateIsHtmlElement(initEl);

  if (!instance || !instancesTracker) {
    throw new Error("Missing parameter, instance or instancesTracker.");
  }

  const tagName = initEl.tagName.toLowerCase();

  if (!instancesTracker[tagName]) instancesTracker[tagName] = [];

  // The array in path represents the nested object. Array elements iterate sequentially and the instance element in the object is reached.
  let instanceEl = null;
  instancesTracker.path.forEach((item) => {
    instanceEl = instanceEl ? instanceEl[item] : instance[item];
  });

  instancesTracker[tagName].push({ initEl, instance, instanceEl });
};

/**
 * Initializes a Choices.js instance with the provided parameters.
 * @param {HTMLElement|string} initEl - The HTML element or the query selector string that the Choices.js instance will be attached to.
 * @param {string} [optionsKey='defaultSelect'] - The key for the options object to use from the predefined option templates.
 * @param {string} [placeholder=''] - The placeholder text to be used in the select input.
 * @returns {Choices} A new Choices instance.
 * @throws Will throw an error if the initEl parameter is not a valid HTML element or a string, or if the optionsKey is not a valid key in the optionTemplates object.
 */
export const initChoicesItem = (
  initEl,
  optionsKey = "defaultSelect",
  placeholder = ""
) => {
  const optionTemplates = {
    defaultSelect: {
      allowHTML: true,
      removeItemButton: true,
      duplicateItemsAllowed: false,
      searchEnabled: false,
      placeholder: true,
      itemSelectText: "",
    },
  };

  if (!(initEl instanceof HTMLElement) && typeof initEl !== "string") {
    throw new Error(`(Choices) Invalid parameter, initEl: ${initEl}`);
  }

  const options = optionTemplates[optionsKey];

  if (!options) {
    throw new Error(`(Choices) Invalid parameter, optionsKey: ${optionsKey}`);
  }

  const instance = new Choices(initEl, {
    ...options,
    placeholderValue: placeholder,
  });
  addToInstancesTracker(initEl, instance, store.choicesInstances);

  return instance;
};

/**
 * Initializes a Flatpickr instance for a given input element.
 * @param {HTMLElement|string} initEl - The input element or a string selector to be initialized with Flatpickr.
 * @returns {object} A Flatpickr instance.
 * @throws Will throw an error if the provided `initEl` parameter is not an HTMLElement or string.
 */
export const initFlatpickrItem = (initEl) => {
  const options = {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    minDate: new Date(),
    disableMobile: "true",
  };

  if (!(initEl instanceof HTMLElement) && typeof initEl !== "string") {
    throw new Error(`(Flatpickr) Invalid parameter, initEl: ${initEl}`);
  }

  const instance = flatpickr(initEl, options);
  addToInstancesTracker(initEl, instance, store.flatpickrInstances);

  return instance;
};

/**
 * Adds an animation to a given HTML element. This function is based on the animate.css library.
 * @param {(HTMLElement|string)} element - A HTML element or a query selector for the element to be animated.
 * @param {string} animation - The name of the animation to be applied (based on animate.css).
 * @param {Array} [options] - Optional settings for the animation. These can be delay, repeat, speed, etc. (based on animate.css)
 * @returns {Promise<boolean>} A Promise that resolves to true when the animation ends. If there is any error, the Promise will resolve to false.
 * @throws {Error} If the element or animation parameters are invalid or missing, an error will be logged in the console and the function will return a Promise that resolves to false.
 */
export const addAnimation = (element, animation, options) => {
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

  return new Promise((resolve) => {
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
 * Retrieves a tracker object associated with a specific element.
 * @param {HTMLElement} initEl - The element whose associated tracker object should be retrieved.
 * @return {Object} The tracker object associated with the specified element.
 */
const getTrackerObj = (initEl) => {
  validateIsHtmlElement(initEl);
  const instanceTrackerList = [
    store.choicesInstances,
    store.flatpickrInstances,
  ];

  const tagName = initEl.tagName.toLowerCase();

  let trackerObj = null;
  instanceTrackerList.forEach((list) => {
    if (!list[tagName]) return;

    trackerObj = list[tagName].find((item) => item.initEl === initEl);
  });

  return trackerObj;
};

/**
 * Retrieves the instance element associated with a specific element.
 * @param {HTMLElement} initEl - The element whose associated instance element should be retrieved.
 * @return {HTMLElement} The instance element associated with the specified element.
 */
export const getInstanceEl = (initEl) => {
  validateIsHtmlElement(initEl);

  const trackerObj = getTrackerObj(initEl);
  return trackerObj ? trackerObj.instanceEl : null;
};
