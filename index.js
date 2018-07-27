const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
const moment = require("moment-timezone");

const Gauge = require("./models/Gauge");
const dataSources = require("./populate-data-sources");

require("./config/db");

const app = express();
app.use(cors());

const TIME_FORMAT = "DD/MM/YYYY h:mma";
const TIME_ZONE = "Pacific/Auckland";

// Updates / upserts database
function updateDataBase(gaugeInfo) {
    let updateObject = {
        region: gaugeInfo.region,
        currentFlow: gaugeInfo.currentFlow,
        currentLevel: gaugeInfo.currentLevel,
        lastUpdated: gaugeInfo.lastUpdated,
        latitude: gaugeInfo.coordinates.lat,
        longitude: gaugeInfo.coordinates.lng
    };

    let historyObject = {
        time: gaugeInfo.lastUpdated,
        data: {
            flow: gaugeInfo.currentFlow,
            level: gaugeInfo.currentLevel
        }
    };

    // update all values - only required on first run... may change to just flow & time
    Gauge.findOneAndUpdate(
        { siteName: gaugeInfo.siteName.toLowerCase() },
        {
            $set: updateObject
        },
        { upsert: true },
        err => {
            if (err) {
                console.log(err);
            }
        }
    );

    // add to history array if new time value
    Gauge.update(
        {
            siteName: gaugeInfo.siteName.toLowerCase(),
            "history.time": { $ne: gaugeInfo.lastUpdated }
        },
        { $push: { histroy: historyObject } }
    );

    // update history if same time value and different data values
    Gauge.update(
        {
            siteName: gaugeInfo.siteName.toLowerCase(),
            "history.time": gaugeInfo.lastUpdated
        },
        { $set: { "history.$.data": historyObject.data } }
    );
}

function getCoords(dynamic, lat, lng, site) {
    return dynamic
        ? { lat: resolve(lat, site), lng: resolve(lng, site) }
        : { lat, lng };
}

function standardiseDate(lastUpdated, dateFormat, time, timeFormat, timeZone) {
    let date;
    if (lastUpdated.charAt(0) !== "<") {
        date = moment(lastUpdated, dateFormat);
    } else {
        // allow for Taranakis format
        date = moment().startOf("day");
        time = lastUpdated.match(/([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/g);
        timeFormat = "HH:mma";
    }

    if (time) {
        date.add(moment.duration(time, timeFormat));
    }

    if (timeZone) {
        date.tz(timeZone);
    }

    return date.format(TIME_FORMAT);
}

// Creates object path given a path string
function resolve(path, obj) {
    if (path === null) return obj;
    return path
        .split(".")
        .reduce((prev, curr) => (prev ? prev[curr] : null), obj || self);
}

function mapData() {
    return axios.all(
        dataSources.map(dataSource =>
            axios
                .get(dataSource.url)
                .then(response => {
                    return Array.from(
                        resolve(dataSource.jsonPath, response.data)
                    ).map(site => {
                        // mapping the data here
                        let gaugeInfo = {
                            siteName: resolve(dataSource.siteName, site),
                            region: dataSource.region,
                            currentFlow: resolve(dataSource.currentFlow, site),
                            currentLevel: resolve(
                                dataSource.currentLevel,
                                site
                            ),
                            lastUpdated: standardiseDate(
                                resolve(dataSource.lastUpdated, site),
                                dataSource.dateFormat,
                                resolve(dataSource.lastUpdatedTime, site),
                                dataSource.timeFormat,
                                dataSource.timeZone
                            ),
                            coordinates: getCoords(
                                dataSource.hasDynamicCoords(),
                                dataSource.latitude,
                                dataSource.longitude,
                                site
                            )
                        };

                        updateDataBase(gaugeInfo);

                        return gaugeInfo;
                    });
                })
                .catch(err => console.log(err))
        )
    );
}

// get current data for an individual site
app.get("/:siteName", (req, res) => {
    Gauge.findOne({ siteName: req.params.siteName.toLowerCase() })
        .then(data =>
            res.send({
                metaData: {
                    lastUpdated: moment()
                        .tz(TIME_ZONE)
                        .format(TIME_FORMAT)
                },
                data: {
                    siteName: data.siteName,
                    region: data.region,
                    currentFlow: data.currentFlow,
                    currentLevel: data.currentLevel,
                    lastUpdate: data.lastUpdated,
                    coordinates: {
                        lat: data.latitude,
                        lng: data.longitude
                    }
                }
            })
        )
        .catch(err => console.log(err));
});

// get historical data for an individual site
app.get(`/:siteName/history`, (req, res) => {
    Gauge.findOne({ siteName: req.params.siteName.toLowerCase() })
        .then(data => {
            // ensures only 1000 historical entries for each site
            if (data.history.length > 999) {
                Gauge.findOneAndUpdate(
                    { siteName: req.params.siteName },
                    { $pop: { history: -1 } }
                );
            }

            res.send({
                metaData: {
                    siteName: data.siteName,
                    lastUpdated: moment()
                        .tz(TIME_ZONE)
                        .format(TIME_FORMAT)
                },
                data: data.history
            });
        })
        .catch(err => console.log(err));
});

// get all current river data
app.get("/", (req, res) => {
    mapData()
        .then(
            axios.spread((...response) => {
                let data = response.reduce((acc, curr) => acc.concat(curr));
                res.send({
                    metaData: {
                        dataLength: data.length,
                        lastUpdated: moment()
                            .tz(TIME_ZONE)
                            .format(TIME_FORMAT)
                    },
                    data
                });
            })
        )
        .catch(err => console.log(err));
});

let port = process.env.PORT || 3030;
let hostname =
    process.env.NODE && ~process.env.NODE.indexOf("heroku")
        ? "https://aggflow.herokuapp.com"
        : "localhost";

// refresh data every 15 mins to add to history and to keep heroku awake
setInterval(function() {
    axios
        .get(hostname)
        .then(data => {
            console.log(
                "Data updated at: " +
                    moment()
                        .tz(TIME_ZONE)
                        .format(TIME_FORMAT)
            );
        })
        .catch(err => console.log(err));
}, 900000); // every 15 minutes (900000) pools APIs

app.listen(port, () => console.log(`Server started at: ${hostname}:${port}`));

module.exports = { app, standardiseDate }; // export required for testing
