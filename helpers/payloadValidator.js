const errorResponse = require('./apiError');

module.exports = function validatePayload(payload, data, optionalConfig = {}) {
  const { error, value } = payload.validate(data, {
    allowUnknown: true,
    stripUnknown: true,
    errors: {
      wrap: {
        label: '',
      },
    },
    ...optionalConfig,
  });
  if (error) {
    const message = `${error.message}.`;
    errorResponse.throwError(message);
  }
  return value;
};
