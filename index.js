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
                    siteName: resolve(dataSource.siteName, site),
                    region: dataSource.region,
                    currentFlow: resolve(dataSource.currentFlow, site),
                    currentLevel: resolve(dataSource.currentLevel, site),
                    lastUpdated: resolve(dataSource.lastUpdated, site),
                    coordinates: {
                        lat: resolve(dataSource.lat, site),
                        lng: resolve(dataSource.lng, site)
                    }
                };
            });
            sendDataToAPI(siteData);
        })
        .catch(err => console.log(err));
}

// Call Imediately on start (helpful for development)
// dataSources.forEach(dataSource => {
//     makeGetRequest(dataSource);
// });

makeGetRequest(dataSources[2]);
// Call every 30 mins
setInterval(() => {
    console.log("Flows last checked at " + new Date());
    dataSources.forEach(dataSource => {
        makeGetRequest(dataSource);
    });
}, 1800000); // 1sec == 1000

app.listen(port, () => console.log(`Listening on port: ${port}`));
