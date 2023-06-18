import { validateIsHtmlElement } from "../utils/index";

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
 * Sets the top CSS style of a sidebar element dynamically based on the height of the header element.
 * This function relies on the `syncTopStylingWithElementSize` function.
 * @param {Object} options - An object containing the sidebar and header elements.
 * @param {Element} options.sidebarEl - The sidebar element whose top style will be adjusted.
 * @param {Element} options.headerEl - The header element whose height will be used to adjust the top style of the sidebar element.
 * @throws Will throw an error if the `validateIsHtmlElement` function is not defined or if it doesn't validate the correct element.
 */
export const setSidebarTopValueDynamically = (options) => {
  Object.entries(options).forEach(([key, value]) =>
    validateIsHtmlElement(value, key)
  );

  const { sidebarEl, headerEl } = options;
  syncTopStylingWithElementSize(sidebarEl, headerEl);
};
