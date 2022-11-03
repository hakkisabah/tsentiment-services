const router = require("express").Router();

router.use("/twitter", require("./twitter"));

module.exports = router;