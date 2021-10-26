const router = require("express").Router();

router.use("/web", require("./web"));
router.use("/db", require("./db"));
router.use("/oauth", require("./oauth"));
router.use("/api", require("./api"));

module.exports = router;