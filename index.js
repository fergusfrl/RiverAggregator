const express = require("express");
const axios = require("axios");

const app = express();

let port = process.env.PORT || 3030;

app.get("/", (req, res) => {
    res.send("Hai");
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
