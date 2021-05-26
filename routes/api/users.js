const express = require("express");
const router = express.Router();

// @route       Post api/users/register
// @desc        Test Route
// @access      Public
router.post("/", (req, res) => {
    console.log(req.body);
    res.send("Usr Route");
});

module.exports = router;
