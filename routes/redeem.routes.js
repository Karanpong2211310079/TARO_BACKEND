const controller = require('../controller/reedeem.controller');
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
app.post("/redeem-code", controller.redeem);

};