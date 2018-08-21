const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
const moment = require("moment-timezone");
const expressGraphQL = require("express-graphql");

const Gauge = require("./models/Gauge");
const dataSources = require("./populate-data-sources");
const schema = require("./schema.js");

require("./config/db");

const app = express();
app.use(cors());

const TIME_FORMAT = "DD/MM/YYYY h:mma";
const TIME_ZONE = "Pacific/Auckland";

// Updates / upserts database
function updateDataBase(gaugeInfo) {
    let updateObject = {
        region: gaugeInfo.region,
        ...(gaugeInfo.currentFlow && { currentFlow: gaugeInfo.currentFlow }),
        ...(gaugeInfo.currentLevel && { currentLevel: gaugeInfo.currentLevel }),
        lastUpdated: gaugeInfo.lastUpdated,
        latitude: gaugeInfo.coordinates.lat,
        longitude: gaugeInfo.coordinates.lng
    };

    let historyObject = {
        time: gaugeInfo.lastUpdated,
        data: {
            ...(gaugeInfo.currentFlow && {
                currentFlow: gaugeInfo.currentFlow
            }),
            ...(gaugeInfo.currentLevel && {
                currentLevel: gaugeInfo.currentLevel
            })
        }
    };

    Gauge.findOneAndUpdate(
        { siteName: gaugeInfo.siteName.toLowerCase(), history: { $size: 500 } },
        {
            $pop: { history: -1 }
        },
        err => {
            if (err) {
                console.log(err);
            }
        }
    );

    // update all values - only required on first run... may change to just flow & time
    Gauge.findOneAndUpdate(
        { siteName: gaugeInfo.siteName.toLowerCase() },
        {
            $set: updateObject,
            $addToSet: {
                history: historyObject
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
app.get("/^(?!graphql).*$/", (req, res) => {
    Gauge.findOne({ siteName: req.params[0].toLowerCase() })
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
    Gauge.find({})
        .then(data => {
            res.send({
                metaData: {
                    dataLength: data.length
                },
                data: data.map(gauge => {
                    const {
                        siteName,
                        lastUpdated,
                        currentFlow,
                        currentLevel,
                        region
                    } = gauge;
                    return {
                        siteName,
                        lastUpdated,
                        currentFlow,
                        currentLevel,
                        region
                    };
                })
            });
        })
        .catch(err => console.log(err));
});

let port = process.env.PORT || 3030;
let hostname =
    process.env.NODE && ~process.env.NODE.indexOf("heroku")
        ? "https://aggflow.herokuapp.com"
        : "localhost";

// refresh data every 15 mins to add to history and to keep heroku awake
setInterval(function() {
    mapData().catch(err => console.log(err));
}, 900000); // every 15 minutes (900000) pools APIs

mapData();

app.use(
    "/graphql",
    expressGraphQL({
        schema: schema,
        graphiql: true
    })
);

app.listen(port, () => console.log(`Server started at: ${hostname}:${port}`));

module.exports = { app, standardiseDate }; // export required for testing
