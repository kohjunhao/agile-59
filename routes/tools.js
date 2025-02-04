const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("tools.ejs");
});

module.exports = router;