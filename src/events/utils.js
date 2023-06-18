import store from "../store/index";

/**
 * Checks whether a particular event is already attached to an element.
 * @param {Object} options - An object containing the necessary properties.
 * @param {Element} options.element - The DOM element to which the event is attached.
 * @param {String} options.eventName - The name of the event.
 * @returns {Boolean} Returns true if the event is already attached to the element, false otherwise.
 */
export const checkEvent = (options) => {
  const { element, eventName } = options;

  return (
    store.eventTracker[eventName] &&
    store.eventTracker[eventName].some((item) => item.element === element)
  );
};

/**
 * Adds an event listener to an element and keeps track of it. If `onceAdd` is set to true, the event listener is not added if it already exists.
 * @param {Object} options - An object containing the necessary properties.
 * @param {Element} options.element - The DOM element to which the event will be attached.
 * @param {String} options.eventName - The name of the event.ex
 * @param {Function} options.handler - The callback function that will be executed when the event is triggered.
 * @param {Boolean} [options.onceAdd=true] - A flag to specify whether the event should only be added if it doesn't already exist.
 */
export const addEvent = (options) => {
  const { element, eventName, handler, onceAdd = true } = options;

  if (onceAdd) {
    const hasEvent = checkEvent({ element, eventName });
    if (hasEvent) return;
  }

  if (!store.eventTracker[eventName]) {
    store.eventTracker[eventName] = [];
  }

  store.eventTracker[eventName].push({ element, handler });
  element.addEventListener(eventName, handler);
};
