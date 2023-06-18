import TAGS_DATA from "../constants/index";

/**
 * An object that defines validation schemas for different forms. Each property in the object represents a form (identified by a key, e.g., "newPredictionForm") and is associated with an object defining validation rules for that form's fields.
 *
 * Each field is an object that includes an array of rules, where each rule is an object that contains:
 * - rule: the validation rule to apply.
 * - options: (optional) additional parameters for the validation rule.
 * - message: the message to display if the validation fails.
 * @property {Object} newPredictionForm - An object representing validation rules for the "newPredictionForm" form.
 *
 * Note: You can add more schemas to this object following the described structure.
 */
export const validationSchemas = {
  newPredictionForm: {
    "prediction-content": {
      rules: [
        {
          rule: "required",
          message: "Prediction content cannot be empty.",
        },
        {
          rule: "charLimit",
          options: { min: 20 },
          message:
            "Please give some more details for prediction. (Character limit: 20-300)",
        },
        {
          rule: "charLimit",
          options: { max: 300 },
          message:
            "Please shorten the content a little. (Character limit: 20-300)",
        },
      ],
    },
    "realization-time": {
      rules: [
        {
          rule: "required",
          message: "Realization time cannot be empty.",
        },
        {
          rule: "validDate",
          options: { regex: /^\d{4}-\d{2}-\d{2}$/ },
          message: "Please enter a valid date.",
        },
        {
          rule: "dateLimit",
          options: { min: new Date() },
          message: "Realization time cannot be older than today.",
        },
      ],
    },
    tag: {
      rules: [
        {
          rule: "required",
          message: "Tag cannot be empty.",
        },
        {
          rule: "checkList",
          options: { list: TAGS_DATA.map((data) => data.value) },
          message: "Please choose a valid tag.",
        },
      ],
    },
    username: {
      rules: [
        {
          rule: "required",
          message: "Username cannot be empty.",
        },
        {
          rule: "charLimit",
          options: { min: 3, max: 25 },
          message: "Username has character limit: 3-25)",
        },
        {
          rule: "format",
          options: { regex: /^[a-zA-Z0-9-_.]+$/ },
          message:
            "Please don't use special characters in username (except: '.', '-', '_').",
        },
      ],
    },
    "info-address": {
      rules: [
        {
          rule: "validUrl",
          message:
            "Please enter a valid url. (Only https protocol is accepted.)",
        },
      ],
    },
  },
};
