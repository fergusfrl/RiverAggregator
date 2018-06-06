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
                longitude: gaugeInfo.coordinates.lng
            },
            $addToSet: {
                history: {
                    time: gaugeInfo.lastUpdated,
                    flow: gaugeInfo.currentFlow,
                    level: gaugeInfo.currentLevel
                }
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
    let date = moment(lastUpdated, dateFormat);

    if (time) {
        date.add(moment.duration(time, timeFormat));
    }

    if (timeZone) {
        date.tz(timeZone);
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

                        upDateDataBase(gaugeInfo);

                        return gaugeInfo;
                    });
                })
                .catch(err => console.log(err))
        )
    );
}

// get current data for an individual site
app.get("/:siteName", (req, res) => {
    Gauge.findOne({ siteName: req.params.siteName })
        .then(data =>
            res.send({
                metaData: { lastUpdated: new Date() },
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
    Gauge.findOne({ siteName: req.params.siteName })
        .then(data => {
            // ensures only 1000 historical entries for each site
            if (data.history.length > 999) {
                Gauge.findOneAndUpdate(
                    { siteName: req.params.siteName },
                    { $pop: { history: -1 } }
                );
            }

            res.send({
                metaData: { siteName: data.siteName, lastUpdated: new Date() },
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
                        lastUpdated: new Date()
                    },
                    data
                });
            })
        )
        .catch(err => console.log(err));
});

let port = process.env.PORT || 3030;
let hostname = process.env.HOST || "localhost";

// refresh data every 15 mins to add to history and to keep heroku awake
setInterval(function() {
    axios
        .get(`${hostname}:${port}`)
        .then(data => {
            console.log("Data updated at: " + new Date());
        })
        .catch(err => console.log(err));
}, 900000); // every 15 minutes (900000) to poll data sources

app.listen(port, () => console.log(`Server started at: ${port}`));
