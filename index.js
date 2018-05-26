const express = require("express");
const axios = require("axios");

const app = express();

const PORT = 3030;

app.get("/", (req, res) => {
    res.send("Hai");
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
