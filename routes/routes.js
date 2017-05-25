var controller = require("./controller.js");

var appRouter = function(app) {
    app.get("/posts", controller.getlastestpost);
    app.post("/getpostbypage", controller.getpostbypage);
    app.post("/editposttype", controller.editposttype);
    
}

module.exports = appRouter;