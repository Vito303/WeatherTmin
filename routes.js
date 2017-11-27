const express = require('express');
const router = express.Router();

const weatherService = require('./service');

router.get('/wdata', (req, res) => {
  weatherService.getPlainData(req, res);
});

module.exports = router;