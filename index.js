const express = require("express");
const axios = require("axios");
const cors = require("cors");

const dataSources = require("./data-sources");

const app = express();
app.use(cors());

let port = process.env.PORT || 3030;

// Send aggregated data to flowagg API
function sendDataToAPI(siteData) {
    let data = {
        metaData: {
            dataLength: siteData.length,
            lastUpdated: new Date()
        },
        data: { siteData }
    };

    app.get("/", (req, res) => {
        res.send(data);
    });
}

// Creates object path given a path string
function resolve(path, obj) {
    return path.split(".").reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj || self);
}

// Get counsil API river data
function makeGetRequest(dataSource) {
    axios
        .get(dataSource.url)
        .then(response => {
            var siteData = Array.from(
                resolve(dataSource.jsonPath, response.data)
            ).map(site => {
                return {
                    siteName: site[dataSource.siteName],
                    region: dataSource.region,
                    currentFlow: site[dataSource.currentFlow],
                    currentLevel: site[dataSource.currentLevel],
                    lastUpdated: site[dataSource.lastUpdated],
                    coordinates: {
                        lat: site[dataSource.lat],
                        lng: site[dataSource.lng]
                    }
                };
            });
            sendDataToAPI(siteData);
        })
        .catch(err => console.log(err));
}

// Call Imediately on start (helpful for development)
dataSources.forEach(dataSource => {
    makeGetRequest(dataSource);
});
// Call every 30 mins
setInterval(() => {
    console.log("Flows last checked at " + new Date());
    dataSources.forEach(dataSource => {
        makeGetRequest(dataSource);
    });
}, 1800000); // 1sec == 1000

app.listen(port, () => console.log(`Listening on port: ${port}`));
