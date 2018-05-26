const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

let port = process.env.PORT || 3030;
let url =
    "http://data.ecan.govt.nz/data/57/Water/River%20Stage%20flow%20summary%20by%20area/JSON?Sites=NORTH";

// *** PROGRAM PLAN ***
// Every ~30 minutes - request information from each cousil API w/ axios
// Store this information in as a json object
// Send this json object w/ express GET

// setInterval(() => {
//     console.log("Flows last checked at " + new Date());
//     // axios here
// }, 10000); // 1sec == 1000

// Get counsil API river data
axios.get(url).then(response => {
    var siteData = Array.from(response.data.data.item).map(site => {
        return {
            siteName: site.Site_x0020_Name,
            currentFlow: site.Flow,
            lastUpdated: site.Last_x0020_Sample
        };
    });
    console.log(siteData);

    // Send data w/ express to create API
    app.get("/", (req, res) => {
        res.send(siteData);
    });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
