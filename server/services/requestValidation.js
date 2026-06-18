const mongoose = require('mongoose');

const requireObjectId = (value, fieldName) => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    const error = new Error(`${fieldName} must be a valid identifier`);
    error.status = 422;
    throw error;
  }
  return new mongoose.Types.ObjectId(value);
};

const requireFiniteNumber = (value, fieldName, options = {}) => {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    const error = new Error(`${fieldName} must be a number`);
    error.status = 422;
    throw error;
  }
  if (options.min !== undefined && number < options.min) {
    const error = new Error(`${fieldName} must be at least ${options.min}`);
    error.status = 422;
    throw error;
  }
  if (options.max !== undefined && number > options.max) {
    const error = new Error(`${fieldName} must be at most ${options.max}`);
    error.status = 422;
    throw error;
  }
  return number;
};

const requireString = (value, fieldName, options = {}) => {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text || (options.max && text.length > options.max)) {
    const error = new Error(`${fieldName} is required and must be at most ${options.max || 'the allowed'} characters`);
    error.status = 422;
    throw error;
  }
  return text;
};

module.exports = { requireFiniteNumber, requireObjectId, requireString };
