const express = require("express");
const { crawlFacebookData } = require("../controllers/crawlerController");

const crawlRouter = express.Router();
crawlRouter.post('/', crawlFacebookData);
module.exports = crawlRouter;
