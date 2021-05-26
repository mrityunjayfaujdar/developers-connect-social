const express = require("express");
const connectToDB = require("./config/db.js");
const app = express();

const PORT = process.env.PORT || 5000;

//connect to database
connectToDB();

//Initialize middleware to parse the JSON data from body
app.use(express.json({extended: false}));

app.get("/", (req, res) => {
    res.send("API is running");
});

//Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));

app.listen(PORT, () => {
    console.log("Server is running on Port - ", PORT);
});
