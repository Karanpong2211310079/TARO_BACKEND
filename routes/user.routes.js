const controller = require('../controller/user.controller');
const express = require("express");
const app = express();

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept , token"
      );
      next();
    });
    app.get("/user-profile", controller.getUserProfile);
    app.put("/user-point", controller.updateUserPoint);
    app.post("/user-card", controller.getUsercard);
    
};