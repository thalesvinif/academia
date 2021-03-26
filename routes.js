var express = require("express");
var routes = express.Router();
var instructors = require("./controllers/instructors");
var members = require("./controllers/members");

routes.get("/", function(req, res){
    return res.redirect("/instructors");
});

// Instructors
routes.get("/instructors", instructors.index);
routes.get("/instructors/create", function(req, res){
    return res.render("instructors/create");
});
routes.get("/instructors/:id", instructors.show);
routes.get("/instructors/:id/edit", instructors.edit);
routes.post("/instructors", instructors.post);
routes.put("/instructors", instructors.put);
routes.delete("/instructors", instructors.delete);

// Members
routes.get("/members", members.index);
routes.get("/members/create", members.create);
routes.get("/members/:id", members.show);
routes.get("/members/:id/edit", members.edit);
routes.post("/members", members.post);
routes.put("/members", members.put);
routes.delete("/members", members.delete);

module.exports = routes;