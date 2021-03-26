var express = require("express");
var nunjucks = require("nunjucks");
var methodOverride = require("method-override");
var routes = require("./routes");

var server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(methodOverride("_method"));
server.use(routes);

server.set("view engine", "njk");

nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
});

server.listen(5000, function() {
    console.log("Servidor rodando!");
});