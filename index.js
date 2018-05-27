const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

let port = process.env.PORT || 3030;
let url =
    "http://data.ecan.govt.nz/data/57/Water/River%20Stage%20flow%20summary%20by%20area/JSON?Sites=NORTH";

// setInterval(() => {
//     console.log("Flows last checked at " + new Date());
//     // TODO: put program here so updates occur every _X_ seconds
// }, 10000); // 1sec == 1000

// Get counsil API river data
axios.get(url).then(response => {
    var siteData = Array.from(response.data.data.item).map(site => {
        return {
            siteName: site.Site_x0020_Name,
            currentFlow: site.Flow,
            currentLevel: site.Stage_x0020_Height,
            lastUpdated: site.Last_x0020_Sample,
            coordinates: {
                lat: site.WGS84_Latitude,
                lng: site.WGS84_Longitude
            }
        };
    });

    // TODO: currently used for development - will remove before final deploy
    console.log(siteData);

    // Send data w/ express to create API
    app.get("/", (req, res) => {
        res.send(siteData);
    });
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
