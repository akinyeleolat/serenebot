const ApiResponse = require('./apiResponse');
const { StatusCode, ResponseStatus } = require('./responseData');

class BadRequestResponse extends ApiResponse {
  constructor(message = 'Bad Parameters', data = null) {
    super(StatusCode.failure, ResponseStatus.badrequest, message);
    this.data = data;
  }
}
module.exports = BadRequestResponse;
