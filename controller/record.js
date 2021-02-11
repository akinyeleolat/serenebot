const SuccessResponse = require('../helpers/successResponse');
const BadRequestResponse = require('../helpers/badRequestResponse');
const recordService = require('../service/getAllRecords');

async function getAllRecords(req, res) {
  try {
    const result = await recordService(req);
    new SuccessResponse('records retrieved', result, 200).send(res);
  } catch (error) {
    new BadRequestResponse(error.message).send(res);
  }
}

module.exports = getAllRecords;
