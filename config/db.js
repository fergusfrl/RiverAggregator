const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
    .connect("mongodb://fergusfrl:fergusfrl@ds121089.mlab.com:21089/rivers")
    .catch(err => console.log(err));
