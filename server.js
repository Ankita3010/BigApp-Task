require('./config.js');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Controller = require('./controller.js')
const routes = require('./routes.js');

var app = express();
mongoose.connect(MONGODB_URI,
    {useNewUrlParser : true});

app.use(bodyParser.json());

routes(app);

app.listen(PORT, () => {
  console.log('Server is up and running on port: ',PORT);
});
