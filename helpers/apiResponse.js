class ApiResponse {
  constructor(status, statusCode, message) {
    this.message = message;
    this.status = status;
    this.statusCode = statusCode;
  }

  prepare(res, response) {
    return res.status(this.statusCode).json(ApiResponse.sanitize(response));
  }

  send(res) {
    return this.prepare(res, this);
  }

  static sanitize(response) {
    const clone = { ...response };

    delete clone.statusCode;
    Object.keys(clone).forEach((key) => {
      if (typeof clone[key] === 'undefined') delete clone[key];
    });
    return clone;
  }
}

module.exports = ApiResponse;
