const express = require('express');

const getAllrecords = require('../../controller/record');

const router = express.Router();

router.get('/', getAllrecords);

module.exports = router;
