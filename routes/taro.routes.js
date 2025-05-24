const controller = require('../controller/taro.controller');
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
    app.get("/taro-card", controller.getTaroCard);
    app.get("/taro-card/:id", controller.getTaroCardById);
    app.post("/add-usercard", controller.AddTaroCard);
    app.post("/created-card", controller.createTaroCard);
};