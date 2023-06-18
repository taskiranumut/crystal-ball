/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { validateIsHtmlFormElement } from "../utils/index";
import { getFormData } from "../forms/index";
import { validationSchemas } from "./schemas";

/**
 * Returns an object with validation methods for different types of data.
 * @returns {Object} An object containing methods for different types of validations:
 * - required: checks if a value is not null or undefined.
 * - charLimit: checks if a string's length is within a specified range.
 * - dateLimit: checks if a date is within a specified range.
 * - validDate: checks if a string can be parsed into a valid date and optionally if it matches a given format.
 * - format: checks if a string matches a specified format (regular expression).
 * - validUrl: checks if a string can be parsed into a URL and optionally if it matches a given format.
 * - checkList: checks if a value is in a list or if a list contains a value.
 */
const getValidations = () => {
  const validations = {
    required: (value) => {
      return value === 0 ? true : value;
    },
    charLimit: (value, options = {}) => {
      const { min = 0, max = Infinity } = options;

      if (typeof value !== "string") return false;

      const minValue = Number(min);
      const maxValue = Number(max);

      if (Number.isNaN(minValue) || Number.isNaN(maxValue)) return false;

      if (minValue > maxValue) {
        console.error(
          `Error: Invalid 'min' - 'max' parameters. 'min': ${min}, 'max': ${max}. 'min' value cannot be higher then 'max' value.`
        );
        return false;
      }

      const len = value.length;
      return len >= minValue && len <= maxValue;
    },
    dateLimit: (value, options = {}) => {
      const { min = null, max = null } = options;

      if (!validations.validDate(value)) return false;

      value = Date.parse(value);
      if (min !== null && value < Date.parse(min)) return false;
      if (max !== null && value > Date.parse(max)) return false;

      return true;
    },
    validDate: (value, options = {}) => {
      const { regex } = options;

      const date = Date.parse(value);
      const maxDate = Date.parse("2099-12-31");
      const formatStatus = regex ? validations.format(value, { regex }) : true;

      return formatStatus && !Number.isNaN(date) && date <= maxDate;
    },
    format: (value, options = {}) => {
      const { regex } = options;

      if (typeof value !== "string" || !(regex instanceof RegExp)) return false;

      return regex.test(value);
    },
    validUrl: (value, options = {}) => {
      if (value === "") return true;

      const { regex = null } = options;

      if (regex) return validations.format(value, { regex });

      try {
        const url = new URL(value);
        return url.protocol === "https:";
      } catch (_) {
        return false;
      }
    },
    checkList: (value, options = {}) => {
      const { list, isExactly = true } = options;

      if (!Array.isArray(list)) return false;

      return list.some((listItem) => {
        return isExactly
          ? listItem === value
          : listItem.toString().includes(value.toString());
      });
    },
  };

  return validations;
};

/**
 * Validates a form item value according to a list of rules.
 * @param {string|number} value - The value of the form item to be validated.
 * @param {Array} rules - An array of validation rules for the form item.
 * @returns {Array|null} An array of validation error messages, or null if the item is valid.
 */
const validateItem = (value, rules) => {
  if (!Array.isArray(rules)) return null;
  if (rules.length === 0) return null;

  const validations = getValidations();

  return rules
    .map(({ rule, options, message }) => {
      const validationFunction = validations[rule];
      const isValidValue = validationFunction(value, options);

      if (!isValidValue) {
        return message;
      }

      return null;
    })
    .filter(Boolean);
};

/**
 * Validates form data according to a provided validation schema.
 * @param {Object} dataObj - The form data to be validated.
 * @param {Object} schema - The validation schema that contains rules for each form item.
 * @returns {Array} An array of validation result objects, each containing the name of the form item and any validation error messages.
 */
const getValidationErrors = (dataObj, schema) => {
  const formItemNames = Object.keys(schema);

  return formItemNames
    .map((formItemName) => {
      const value = dataObj[formItemName];
      const { rules } = schema[formItemName];
      const messages = validateItem(value, rules);

      if (Array.isArray(messages) && messages.length > 0) {
        return { formItemName, messages };
      }

      return null;
    })
    .filter(Boolean);
};

/**
 * Validates form data according to a specified validation schema.
 * @param {HTMLFormElement} formEl - The form element whose data is to be validated.
 * @param {string} schemaName - The name of the validation schema to use. It is contained in VALIDATION_SCHEMAS.
 * @returns {Object} An object containing a boolean indicating whether the form data is valid and an array of validation errors (or null if the data is valid).
 */
export const validateFormData = (formEl, schemaName) => {
  validateIsHtmlFormElement(formEl, "formEl");

  const schema = validationSchemas[schemaName];
  if (!schema) {
    console.error(`Not found validation schema for ${schema}`);
    return { isValid: true, errors: null };
  }

  const formData = getFormData(formEl);
  const errors = getValidationErrors(formData, schema);

  const isValid = errors.length === 0;
  return {
    isValid,
    errors: isValid ? null : errors,
  };
};
