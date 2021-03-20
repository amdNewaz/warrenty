var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var routes = require("./api/routes/index");
var exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');

var app = express();

app.use("/api", routes)
app.use(fileUpload());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use("/", routes)