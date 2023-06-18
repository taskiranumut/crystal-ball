/* eslint-disable import/prefer-default-export */
import TAGS_DATA from "../../constants";
import { getTagButtonTemplate } from "../../templates";
import {
  getElement,
  validateIsHtmlElement,
  appendStringAsChildElement,
} from "../../utils";

/**
 * Returns the active tag button from the tag button container.
 * @param {Boolean|null} isAll - A flag to specify if it should return the 'all' button.
 * @returns {HTMLElement} - The active button element.
 */
export const getActiveTagBtn = (isAll = null) => {
  return isAll
    ? getElement("#tag-buttons-container [data-tag-value='all']")
    : getElement("#tag-buttons-container .btn--active");
};

/**
 * Fills a given HTML element with tag buttons. The tag buttons are generated
 * using data from a constant TAGS_DATA array.
 * @param {HTMLElement} tagButtonListEl - The HTML element to fill with tag buttons.
 * @throws {Error} If `tagButtonListEl` is not an instance of `HTMLElement`.
 */
export const fillTagButtonList = (tagButtonListEl) => {
  validateIsHtmlElement(tagButtonListEl);

  const tagButtons = TAGS_DATA.map((data) => getTagButtonTemplate(data)).join(
    ""
  );

  appendStringAsChildElement(tagButtonListEl, tagButtons);
};
