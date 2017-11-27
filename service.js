var request = require('request');

function parser(plain_data)
{
  plain_data.replace(/\r/g, '\n');
  var lines = plain_data.split('\n');
  str = lines[12].replace(/[*]/g, '');
  str = str.trim();
  console.log(str);
}

function getPlainData(req, res) {
  request.get('http://www.vremetolmin.si/plain.html', function (error, response, body) {
      if (error) throw error;
      wData = parser(body);
      //var dataJson = JSON.parse(wData);
      var dataJson = '';
      res.send(dataJson.data)
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