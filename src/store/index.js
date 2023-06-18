const store = {
  elements: {},
  selectorList: [
    { elName: "newPredictionBtnEl", selector: "#new-prediction-btn" },
    { elName: "newPredictionCardEl", selector: "#new-prediction-card" },
    { elName: "predictionListEl", selector: "#predictions" },
    { elName: "newPredictionFormEl", selector: "#new-prediction-form" },
    { elName: "formCancelBtnEl", selector: "#form-cancel-btn" },
    { elName: "tagButtonListEl", selector: "#tag-buttons-container" },
    { elName: "headerEl", selector: "#header" },
    { elName: "sidebarEl", selector: "#sidebar" },
  ],
  globalCountdownInterval: null,
  eventTracker: {},
  choicesInstances: {
    path: ["containerInner", "element"],
  },
  flatpickrInstances: {
    path: ["altInput"],
  },
};

export default store;
