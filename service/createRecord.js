const errorResponse = require('../helpers/apiError');
const RecordModel = require('../model/record');

/**
 * @typedef {Object} UserData
 * @property {string} userId - user id
 * @property {string} username - username
 * @property {string} name -  name
 * @property {string} feeling - feeling
 */

/**
 * @param {RecordData} data
 * @summary creates new users record
 */
function createRecord(data) {
  const locals = {
    data,
  };

  async function servicePromiseExecutor(resolve, reject) {
    try {
      const {
        sessionId,
        userId,
        username,
        name,
        feeling,
      } = locals.data;

      const newRecord = new RecordModel({
        sessionId,
        userId,
        username,
        name,
        feeling,
      });

      await newRecord.save();

      locals.record = newRecord;

      resolve(locals.record);
    } catch (e) {
      errorResponse.handleError(reject, e);
    }
  }
  return new Promise(servicePromiseExecutor);
}
module.exports = createRecord;
