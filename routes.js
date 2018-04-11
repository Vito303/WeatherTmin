const express = require('express');
const router = express.Router();

const weatherService = require('./service');

router.get('/wdata', (req, res) => {
  weatherService.getPlainData(req, res);
});

router.get('/wdb', async (req, res) => {
  resultdata = await weatherService.getDBData(req, res);
  res.send(resultdata.rows)
});

module.exports = router;