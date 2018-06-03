const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GaugeSchema = new Schema({
    region: {
        type: String,
        required: true
    },
    siteName: {
        type: String,
        required: true
    },
    currentFlow: {
        type: String,
        required: false
    },
    currentLevel: {
        type: String,
        required: false
    },
    lastUpdated: {
        type: String,
        required: false
    },
    latitude: {
        type: String,
        required: false
    },
    longitude: {
        type: String,
        required: false
    },
    history: {
        type: Array,
        default: []
    }
});

const Gauge = mongoose.model("Gauge", GaugeSchema);

module.exports = Gauge;
