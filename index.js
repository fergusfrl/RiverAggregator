const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
const moment = require("moment");

const Gauge = require("./models/Gauge");
const dataSources = require("./populate-data-sources");

require("./config/db");

const app = express();
app.use(cors());

let port = process.env.PORT || 3030;

// Updates / upserts database
function upDateDataBase(gaugeInfo) {
    Gauge.findOneAndUpdate(
        { siteName: gaugeInfo.siteName },
        {
            $set: {
                region: gaugeInfo.region,
                currentFlow: gaugeInfo.currentFlow,
                currentLevel: gaugeInfo.currentLevel,
                lastUpdated: gaugeInfo.lastUpdated,
                latitude: gaugeInfo.coordinates.lat,
                longitude: gaugeInfo.coordinates.lng,
                historyUrl: gaugeInfo.historyUrl
            }
        },
        { upsert: true },
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}

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

function getCoords(dynamic, lat, lng, site) {
    return dynamic
        ? { lat: resolve(lat, site), lng: resolve(lng, site) }
        : { lat, lng };
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
    if (path === null) return obj;
    return path
        .split(".")
        .reduce((prev, curr) => (prev ? prev[curr] : null), obj || self);
}

// Get counsil API gauge data
function makeGetRequest(url) {
    return axios.get(url);
}

function mapData() {
    axios
        .all(
            dataSources.map(dataSource =>
                makeGetRequest(dataSource.url)
                    .then(response => {
                        return Array.from(
                            resolve(dataSource.jsonPath, response.data)
                        ).map(site => {
                            // mapping the data here
                            let gaugeInfo = {
                                siteName: resolve(dataSource.siteName, site),
                                region: dataSource.region,
                                currentFlow: resolve(
                                    dataSource.currentFlow,
                                    site
                                ),
                                currentLevel: resolve(
                                    dataSource.currentLevel,
                                    site
                                ),
                                lastUpdated: normalizeDate(
                                    resolve(dataSource.lastUpdated, site),
                                    dataSource.dateFormat,
                                    resolve(dataSource.lastUpdatedTime, site)
                                ),
                                coordinates: getCoords(
                                    dataSource.hasDynamicCoords(),
                                    dataSource.latitude,
                                    dataSource.longitude,
                                    site
                                ),
                                historyUrl: dataSource.historyUrl.replace(
                                    "<siteName>",
                                    resolve(dataSource.siteName, site)
                                )
                            };

                            upDateDataBase(gaugeInfo);

                            return gaugeInfo;
                        });
                    })
                    .catch(err =>
                        console.log(
                            `Something is wrong with the "${
                                dataSource.title
                            }" data source`
                        )
                    )
            )
        )
        .then(data => {
            var totalData = data.reduce((acc, curr) => acc.concat(curr));
            sendDataToAPI(totalData);
        })
        .catch(err => console.log(err));
}

mapData();
setInterval(() => {
    mapData();
}, 1800000); // runs every 30 mins

// get individual river data
app.get("/:siteName", (req, res) => {
    Gauge.findOne({ siteName: req.params.siteName })
        .then(data =>
            res.send({
                metaData: { lastUpdated: new Date() },
                data: {
                    siteName: data.siteName,
                    region: data.region,
                    currentFlow: data.currentFlow,
                    currentLevel: data.currentFlow,
                    lastUpdate: data.lastUpdated,
                    coordinates: {
                        lat: data.latitude,
                        lng: data.longitude
                    },
                    historyUrl: data.historyUrl
                }
            })
        )
        .catch(err => console.log(err));
});

// get individual river historical data
// TODO: create dynamic way to retrieve historical flow info
app.get("/:siteName/history", (req, res) => {
    Gauge.findOne({ siteName: req.params.siteName }).then(data =>
        makeGetRequest(data.historyUrl).then(historicalData => {
            res.send({
                siteName: req.params.siteName,
                data: historicalData.data.value.map(instance => {
                    return {
                        time: instance.Time_NZST,
                        flow: instance.ValueAsRecorded_m3s
                    };
                })
            });
        })
    );
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
