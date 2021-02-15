const errorResponse = require('../helpers/apiError');
const RecordModel = require('../model/record');

/**
 * @param {RecordData} data
 * @summary get all record
 */
function getAllRecord(data) {
  const locals = {
    data,
  };

  async function servicePromiseExecutor(resolve, reject) {
    try {
      locals.record = await RecordModel.find().sort({ createdAt: -1 });
      // TODO: paginated
      resolve(locals.record);
    } catch (e) {
      errorResponse.handleError(reject, e);
    }
  }
  return new Promise(servicePromiseExecutor);
}
module.exports = getAllRecord;
