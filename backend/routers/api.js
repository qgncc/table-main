const Router = require("express").Router
const getTable = require("../contorllers/getTable");

const router = Router();

router.get("/table", getTable)

module.exports = router