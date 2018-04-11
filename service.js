const { Client } = require('pg');
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
  line_data_sub = line_data_sub.split(' ');
  line_data_sub = line_data_sub[0];
  responseData['temperature'] = line_data_sub.trim();
  line_data_sub = line_data[1].split(': ');
  line_data_sub = line_data_sub[1].replace(/\s\r/g, '');
  line_data_sub = line_data_sub.split(' ');
  line_data_sub = line_data_sub[0];  
  responseData['max'] = line_data_sub.trim();
  line_data_sub = line_data[2].split(': ');
  line_data_sub = line_data_sub[1].replace(/\s\r/g, '');
  line_data_sub = line_data_sub.split(' ');
  line_data_sub = line_data_sub[0];  
  responseData['min'] = line_data_sub.trim();
  line_data_sub = line_data[2].split(': ');
  line_data_sub = line_data_sub[1].replace(/\s\r/g, '');
  line_data_sub = line_data_sub.split(' ');
  line_data_sub = line_data_sub[1];  
  responseData['unit'] = line_data_sub.trim();
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


const client = new Client({
  connectionString: "postgres://otmuhoeudinjzo:5fb84fc3623ae8b44594aea159685a309886ef34928783a0a8f8681de91c792d@ec2-54-247-95-125.eu-west-1.compute.amazonaws.com:5432/d9at58avc7pdv5",
  ssl: true,
});

client.connect();

async function getDBData(req, res) {
  try {
    var data = [{}];
    //await client.connect();
    result = await client.query('SELECT * FROM weather_station ORDER BY id ASC;');
    for (let row of result.rows) {
      console.log(JSON.stringify(row));
      data['rows'] = JSON.stringify(row);
    }
    return data;
  } catch (err) {
    throw err;
  } finally {
    //await client.end();  
  }

  // var data = [{}]; 
  // client.connect();
  // client.query('SELECT * FROM weather_station;', (err, res) => {
  //   if (err) throw err;
  //   for (let row of res.rows) {
  //     console.log(JSON.stringify(row));
  //     data['rows'] = JSON.stringify(row); 
  //   }
  //   client.end();
  // });
  // res.send(data);

  // client.connect();
  // var response = client.query("SELECT * FROM weather_station ORDER BY id ASC;");
  // response.rows.forEach(row=>{
  //     console.log(row);
  //     data.push(row);
  // });
  // client.end();
  //return res.json(data);
}

function checkServerError(res, error) {
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

module.exports = {
  getPlainData,
  getDBData
};