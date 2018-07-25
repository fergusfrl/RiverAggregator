const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose
    .connect(process.env.MONGODB_URI)
    .then(console.log("Successfully connected to MongoDB"));
