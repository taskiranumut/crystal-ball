/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import { getPredictions } from "./api";
import store from "./store";
import { initChoicesItem, initFlatpickrItem } from "./services";
import {
  handleClickFormCancelButton,
  handleClickNewPredictionButton,
  handleClickTagButtons,
  handleSubmitPredictionForm,
} from "./events";
import { setSidebarTopValueDynamically } from "./layout";
import { runFunctionForElementList, fillElementsObject } from "./utils";
import { fetchAndListPredictions } from "./predictions";
import { fillTagButtonList } from "./tags";
import { startAppLayout } from "./templates";

const initApp = (root) => {
  if (!root) throw new Error("Invalid root element!");

  const { elements, selectorList } = store;

  startAppLayout(root);
  fillElementsObject(elements, selectorList);
  runFunctionForElementList("select.choices", initChoicesItem);
  runFunctionForElementList("input[type='date'].flatpickr", initFlatpickrItem);

  fetchAndListPredictions(elements.predictionListEl, getPredictions);
  fillTagButtonList(elements.tagButtonListEl);

  setSidebarTopValueDynamically({
    headerEl: elements.headerEl,
    sidebarEl: elements.sidebarEl,
  });

  handleClickNewPredictionButton({
    newPredictionBtnEl: elements.newPredictionBtnEl,
    newPredictionCardEl: elements.newPredictionCardEl,
    predictionListEl: elements.predictionListEl,
  });

  handleClickFormCancelButton({
    formCancelBtnEl: elements.formCancelBtnEl,
    newPredictionCardEl: elements.newPredictionCardEl,
    predictionListEl: elements.predictionListEl,
    newPredictionFormEl: elements.newPredictionFormEl,
  });

  handleSubmitPredictionForm({
    newPredictionFormEl: elements.newPredictionFormEl,
    newPredictionCardEl: elements.newPredictionCardEl,
    predictionListEl: elements.predictionListEl,
  });

  handleClickTagButtons({
    tagButtonListEl: elements.tagButtonListEl,
    predictionListEl: elements.predictionListEl,
    newPredictionCardEl: elements.newPredictionCardEl,
    newPredictionFormEl: elements.newPredictionFormEl,
  });
};

export default initApp;
