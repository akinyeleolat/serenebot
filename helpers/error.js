class AppError extends Error {
  constructor(config = { status: 'error', name: 'AppError' }, ...params) {
    // Pass remaining arguments to parent constructor
    super(...params);

    // Maintains proper stack trace for when application error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    this.name = config.name || 'CustomError';
    // Custom debugging information
    this.status = config.status || 'error';
    this.errorTimestamp = Date.now();
  }
}
module.exports = AppError;
