var request = require('request');

var responseData = {};

function parser(plain_data)
{
  plain_data.replace(/\r/g, '\n');
  var lines = plain_data.split('\n');
  //console.log(lines);
  line_data = lines[12].replace(/[*]/g, '');
  line_data = line_data.trim();
  responseData['name'] = line_data;
  line_data = lines[14].split(': ');
  line_data = line_data[1].replace(/\r/g, '');
  responseData['last_update'] = line_data;
  line_data = lines[17].split(': ');
  line_data = line_data[1].replace(/\s\r/g, '');
  responseData['current'] = line_data;
  line_data = lines[19].split(/[|]/);
  line_data_sub = line_data[0].split(' : ');
  line_data_sub = line_data_sub[1].replace(/\s\r/g, '');
  responseData['temperature'] = line_data_sub.trim();
  line_data_sub = line_data[1].split(': ');
  line_data_sub = line_data_sub[1].replace(/\s\r/g, '');
  responseData['max'] = line_data_sub.trim();
  line_data_sub = line_data[2].split(': ');
  line_data_sub = line_data_sub[1].replace(/\s\r/g, '');
  responseData['min'] = line_data_sub.trim();
  return JSON.stringify(responseData);
}

function getPlainData(req, res) {
  request.get('http://www.vremetolmin.si/plain.html', function (error, response, body) {
      if (error) throw error;
      wData = parser(body);
      var dataJson = JSON.parse(wData);
      //console.log(dataJson);
      res.send(dataJson)
  });
}

function checkServerError(res, error) {
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

module.exports = {
  getPlainData,
};