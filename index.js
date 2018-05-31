const express = require("express");
const axios = require("axios");
const cors = require("cors");
const moment = require("moment");

const dataSources = require("./populate-data-sources");

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
        data: siteData
    };

    app.get("/", (req, res) => {
        res.send(data);
    });
}

// normalizes all dates
function normalizeDate(dateString, formatString, time) {
    // formatString may be empty - if so, normal moment.js parsing occurs
    let date = moment(dateString, formatString);
    if (time) {
        // may need to normalize time in the future
        date.add(moment.duration(time, "HH:mm"));
    }
    return date.format("DD/MM/YYYY h:mma");
}

// Creates object path given a path string
function resolve(path, obj) {
    if (path === null) {
        return obj;
    }
    return path.split(".").reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj || self);
}

// Get counsil API gauge data
function makeGetRequest(dataSource) {
    return axios.get(dataSource.getUrl());
}

function mapData() {
    axios
        .all(
            dataSources.map(dataSource =>
                makeGetRequest(dataSource)
                    .then(response => {
                        return Array.from(
                            resolve(dataSource.getJsonPath(), response.data)
                        ).map(site => {
                            // mapping the data here
                            return {
                                siteName: resolve(
                                    dataSource.getSiteName(),
                                    site
                                ),
                                region: dataSource.getRegion(),
                                currentFlow: resolve(
                                    dataSource.getCurrentFlow(),
                                    site
                                ),
                                currentLevel: resolve(
                                    dataSource.getCurrentLevel(),
                                    site
                                ),
                                lastUpdated: normalizeDate(
                                    resolve(dataSource.getLastUpdated(), site),
                                    dataSource.getDateFormat(),
                                    resolve(
                                        dataSource.getLastUpdatedTime(),
                                        site
                                    )
                                ),
                                coordinates: {
                                    // TODO: implement method to convert Easting Northing to LatLng
                                    lat: resolve(
                                        dataSource.getLatitude(),
                                        site
                                    ),
                                    lng: resolve(
                                        dataSource.getLongitude(),
                                        site
                                    )
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
}

mapData();
setInterval(() => {
    mapData();
}, 1800000); // runs every 30 mins

app.listen(port, () => console.log(`Listening on port: ${port}`));
