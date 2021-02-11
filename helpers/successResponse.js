const ApiResponse = require('./apiResponse');
const { StatusCode, ResponseStatus } = require('./responseData');

class SuccessResponse extends ApiResponse {
  constructor(message, data = null) {
    super(StatusCode.success, ResponseStatus.success, message);
    this.data = data;
  }

  send(res) {
    return super.prepare(res, this);
  }
}

module.exports = SuccessResponse;
