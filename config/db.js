const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
    .connect("mongodb://<dbuser>:<dbpassword>@ds121089.mlab.com:21089/rivers")
    .catch(err => consoole.log(err));
