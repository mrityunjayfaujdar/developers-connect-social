const mongoose = require("mongoose");
const config = require('config');

const databaseURL = config.get("mongoURI");

const connectToDB = async () => { 
    try {
        await mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB Connected...")        
    } catch (err) { 
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectToDB;