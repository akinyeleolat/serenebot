const express = require('express');
const records = require('./record');

const router = express.Router();

router.use('/record/', records);

module.exports = router;
