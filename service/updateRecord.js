const errorResponse = require('../helpers/apiError');
const RecordModel = require('../model/record');

/**
 * @typedef {Object} RecordData
 * @property {string} userId - user id
 * @property {*} update - field to be updated
 */

/**
 * @param {RecordData} data
 * @summary creates new users record
 */
function updateRecord(data) {
  const locals = {
    data,
  };

  async function servicePromiseExecutor(resolve, reject) {
    try {
      const {
        userId,
        updateData,
      } = locals.data;

      const recordInfo = await RecordModel
        .findOne({ userId })
        .sort({ createdAt: -1 })
        .limit(1);

      const { sessionId } = recordInfo;

      const updatedRecord = await RecordModel.findOneAndUpdate({ sessionId }, updateData, {
        returnOriginal: false,
      });

      locals.record = updatedRecord;
      resolve(locals.record);
    } catch (e) {
      errorResponse.handleError(reject, e);
    }
  }
  return new Promise(servicePromiseExecutor);
}
module.exports = updateRecord;
