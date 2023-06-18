import { appendStringAsChildElement } from "../utils";
import { generateTemplateString, getLoaderTemplate } from "./utils";
import appLogo from "../assets/images/main-logo.webp";

export {
  generateTemplateString,
  getFormErrorTemplate,
  getEmptyContentTemplate,
  getModalTemplate,
  getLoaderTemplate,
} from "./utils";

/**
 * Generates HTML structure for a countdown item.
 * @param {number|null} itemValue - The value of the countdown item. If the value is null, "-" will be displayed.
 * @param {string} itemName - The name of the countdown item.
 * @returns {string} The HTML structure for a countdown item as a string.
 */
export const getCountdownItemTemplate = (itemValue, itemName, options) => {
  const { next } = options;

  const errorClassName = !next ? "predictions__item-countdown-item--error" : "";

  return `
    <div class="predictions__item-countdown-item ${errorClassName}">
      <span class="predictions__item-countdown-item-number"
        >${itemValue == null ? "-" : itemValue}</span
      >
      <span class="predictions__item-countdown-item-text"
        >${itemName}</span
      >
    </div>
  `;
};

/**
 * Generates a template string for the vote button element.
 * @param {number} voteValue - The value of the vote count. If null, vote count will be displayed as 0.
 * @param {string} voteTypeKey - The key to determine the type of the vote button ("upCount" or "downCount").
 * @param {Object} options - Additional options.
 * @throws {Error} Will throw an error if voteTypeKey is not "upCount" or "downCount".
 * @returns {string} The template string for the vote button element.
 */
export const getVoteButtonTemplate = (voteValue, voteTypeKey, options) => {
  const voteTypes = {
    up_count: "up",
    down_count: "down",
  };

  const voteType = voteTypes[voteTypeKey];
  if (!voteType) {
    console.warn(`Invalid voteTypeKey: ${voteTypeKey}`);
    return null;
  }

  const { predictionId, isDisabled } = options;

  const dataPredictionIdAttr = predictionId
    ? `data-prediction-id="${predictionId}"`
    : "";

  const disabledAttr = isDisabled === true ? "disabled" : "";

  const titleText =
    isDisabled === true
      ? `You have already voted the prediction.`
      : `Vote ${voteType}!`;

  return `
    <button
      type="button"
      class="predictions__item-vote-button-item"
      data-vote-type="${voteType}"
      ${dataPredictionIdAttr}
      ${disabledAttr}
      title="${titleText}"
    >
      <span class="predictions__item-vote-button-item-icon"
        ><i class="fa-regular fa-thumbs-${voteType}"></i>
        <i class="fa-solid fa-thumbs-${voteType}"></i
      ></span>
      <span class="predictions__item-vote-counter">${
        voteValue == null ? "0" : voteValue
      }</span>
    </button>
  `;
};

/**
 * Generates a template for a prediction card using the provided data.
 * @param {object} data - The data object to create a prediction card template from.
 * @returns {string} A string that represents the HTML structure of a prediction card.
 * The data object is destructured into its properties. Each property is used where needed in the HTML string
 * that represents the structure of a prediction card. If the prediction has a countdown or votes, these are passed
 * to the `generateTemplateString` function along with a template function to generate the respective part of the prediction card.
 */
export const getPredictionCardTemplate = (data) => {
  const {
    id,
    content,
    countdown,
    countdownNext,
    tag,
    votes,
    realizationTime,
    username,
    infoUrl,
    hasVoted,
  } = data;

  const countdownItems = generateTemplateString(
    countdown,
    getCountdownItemTemplate,
    {
      next: countdownNext,
    }
  );
  const voteButtons = generateTemplateString(votes, getVoteButtonTemplate, {
    predictionId: id,
    isDisabled: hasVoted,
  });

  const usernameItem = `<a ${
    infoUrl ? `href="${infoUrl}"` : ""
  } class="url url--inherit url--secondary" title="Prediction Owner">(${username})</a>`;

  return `
    <div class="card card--full predictions__item${
      content ? "" : " hide"
    }" data-prediction-id="${id}">
      <p class="predictions__item-content"><span class="predictions__item-content-label">[Expired]</span> ${content} ${usernameItem}</p>
      <div class="predictions__item-date">
      <div id="countdown-items-container-${id}" class="predictions__item-countdown">${countdownItems}</div>
        <span class="predictions__item-realization-time ${
          !countdownNext ? "predictions__item-realization-time--error" : ""
        }">Realization: ${realizationTime}</span>
      </div>
      <span class="predictions__item-tag-label ${tag || "hide"}">${tag}</span>
      <div class="predictions__item-vote-buttons">${voteButtons}</div>
    </div>`;
};

/**
 * Generates the HTML markup for a tag button.
 * @param {object} data - An object containing the data (value, display, isActive) for the tag button.
 * @returns {string} The HTML markup for the tag button.
 */
export const getTagButtonTemplate = (data) => {
  const { value, display, isActive } = data;

  return `
    <button type="button" data-tag-value="${value}" class="btn btn--lg btn--tag-secondary ${
    isActive ? "btn--active" : ""
  }">${display}</button>
  `;
};

const getMainTemplate = () => {
  return `
    <main class="main">
      <div class="main__container">
      ${getLoaderTemplate()}
      ${getNewPredictionFormTemplate()}
      <div id="predictions" class="predictions"></div>
      </div>
    </main>
  `;
};

const getNewPredictionFormTemplate = () => {
  return `
    <div id="new-prediction-card" class="card card--full hide">
      <div class="form">
        <form id="new-prediction-form" action="#">
          <div class="form__header">
            <h2 class="form__title form__title--xl">
              New Prediction
            </h2>
          </div>
          <div class="form__content">
            <div class="form__item-group">
              <label class="form__label" for="idPredictionContent"
                >Prediction Content<span class="form__sub-label"
                  >*</span
                ></label
              >
              <div>
                <textarea
                  class="form__item"
                  id="id-prediction-content"
                  name="prediction-content"
                  rows="5"
                ></textarea>
              </div>
            </div>
            <div class="form__item-group">
              <label class="form__label" for="idRealizationTime"
                >Realization Time<span class="form__sub-label"
                  >*</span
                ></label
              >
              <input
                type="date"
                id="id-realization-time"
                name="realization-time"
                class="form__item flatpickr"
                placeholder="Choose Date"
              />
            </div>
            <div class="form__item-group">
              <label class="form__label" for="idTag"
                >Tag<span class="form__sub-label">*</span></label
              >
              <select
                class="form__item choices"
                id="id-tag"
                name="tag"
              >
                <option value="" disabled selected>Choose Tag</option>
                <option value="politics">Politics</option>
                <option value="magazine">Magazine</option>
                <option value="finance">Finance</option>
                <option value="technology">Technology</option>
                <option value="science">Science</option>
                <option value="humanity">Humanity</option>
                <option value="society">Society</option>
              </select>
            </div>
            <div class="form__item-group">
              <label class="form__label" for="idUsername"
                >Username<span class="form__sub-label">*</span></label
              >
              <input
                type="text"
                id="id-username"
                name="username"
                class="form__item"
              />
            </div>
            <div class="form__item-group">
              <label class="form__label" for="idInfoAddress"
                >Info Address<span
                  class="form__sub-label form__sub-label--sm"
                  >(optional)</span
                ></label
              >
              <input
                type="input"
                id="id-info-address"
                name="info-address"
                class="form__item"
                placeholder="Twitter, Linkedin, Email etc..."
              />
            </div>
          </div>
          <div class="form__actions">
            <button class="btn btn--primary form__btn">Submit</button>
            <button
              type="button"
              id="form-cancel-btn"
              class="btn btn--secondary form__btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
};

const getHeaderTemplate = () => {
  return `
    <header id="header" class="header">
      <div class="header__container">
        <div class="header__logo-section">
          <div class="header__logo">
            <img
              src="${appLogo}"
              class="header__logo-image"
              alt="Uygulama logosu"
            />
          </div>
          <h1 class="header__title">Crystal Ball</h1>
        </div>
        <div class="header__navbar">
          <button
            type="button"
            id="new-prediction-btn"
            class="btn btn--xl btn--primary"
          >
            New Prediction
          </button>
        </div>
      </div>
    </header>
  `;
};

const getSidebarTemplate = () => {
  return `
    <aside id="sidebar" class="sidebar">
      <div class="sidebar__container">
        <div
          id="tag-buttons-container"
          class="sidebar__tag-buttons"
        ></div>
      </div>
    </aside>
  `;
};

const getFooterTemplate = () => {
  return `
    <footer class="footer">
      <div class="footer__container"></div>
    </footer>
  `;
};

const getAppLayoutTemplate = () => {
  return `
    <div class="container">
    <div id="modal-container" class="modal"></div>
      <div class="grid-container">
      ${getHeaderTemplate()}
      ${getSidebarTemplate()}
      ${getMainTemplate()}
      ${getFooterTemplate()}
      </div>
    </div>
  `;
};

export const startAppLayout = (root) => {
  const appLayout = getAppLayoutTemplate();
  appendStringAsChildElement(root, appLayout);
};
