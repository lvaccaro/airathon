var express = require('express');
var cors = require('cors')
var storageRouter = require('./storage');
var reportRouter = require('./reports');


var app     = express();
var port    =   process.env.PORT || 80;


app.use(cors())

app.use('/storage', storageRouter);
app.use('/reports', reportRouter);

app.use(express.static('public'));

// we'll create our routes here

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);