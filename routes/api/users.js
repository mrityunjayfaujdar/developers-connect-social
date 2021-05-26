const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route       Post api/users/register
// @desc        Test Route
// @access      Public
router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check(
            "password",
            "Please enter minimum 6 characters for password."
        ).isLength({min: 3}),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //bad request
            return res.status(400).json({errors: errors.array()});
        }

        const {name, email, password} = req.body;
        try {
            let user = await User.findOne({email});

            if (user) {
                //User exist
                return res
                    .status(400)
                    .json({errors: [{msg: "User already exists."}]});
            }

            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm",
            });

            user = new User({
                name,
                email,
                avatar,
                password,
            });

            //encrypt the passsword
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            //Return a JSON webtoken
            const payload = {
                user: {
                    id: user.id,
                },
            };

            const jwtSecret = config.get("jwtSecret");
            jwt.sign(
                payload,
                jwtSecret,
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({token});
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error....");
        }
    }
);

module.exports = router;
