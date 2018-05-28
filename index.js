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

// Get counsil API gauge data
function makeGetRequest(dataSource) {
    return axios.get(dataSource.url);
}

axios
    .all(
        dataSources.map(dataSource =>
            makeGetRequest(dataSource)
                .then(response => {
                    return Array.from(
                        resolve(dataSource.jsonPath, response.data)
                    ).map(site => {
                        return {
                            siteName: resolve(dataSource.siteName, site),
                            region: dataSource.region,
                            currentFlow: resolve(dataSource.currentFlow, site),
                            currentLevel: resolve(
                                dataSource.currentLevel,
                                site
                            ),
                            lastUpdated: resolve(dataSource.lastUpdated, site), // TODO: implement method to add time top date / standardise all date formats
                            coordinates: {
                                // TODO: implement method to convert Easting Northing to LatLng
                                lat: resolve(dataSource.lat, site),
                                lng: resolve(dataSource.lng, site)
                            }
                        };
                    });
                })
                .catch(err => console.log(err))
        )
    )
    .then(data => {
        var totalData = data.reduce((acc, curr) => acc.concat(curr));
        sendDataToAPI(totalData);
    });

app.listen(port, () => console.log(`Listening on port: ${port}`));
