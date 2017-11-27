const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', routes);

const port = process.env.PORT || '3300';
app.listen(port, () => console.log(`API running on localhost:${port}`));