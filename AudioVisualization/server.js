var http = require("http");
var express = require('express');
var app = express();

var path = require('path');

//var server = require('http').createServer(app);
var request = require('request');
var querystring = require('querystring');

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 8888);

console.log('server running...');

app.get('/', function(req, res){
    
    res.status(200).sendFile('audioVisualization.html', { root: __dirname + "/" } );
    //res.sendFile(__dirname + '/audioVisualization.html');
});