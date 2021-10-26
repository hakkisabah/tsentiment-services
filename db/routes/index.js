const router = require("express").Router();

router.use("/oauth", require("./oauth"));

module.exports = router;