class DataSource {
    constructor(
        title,
        region,
        url,
        jsonPath,
        siteName,
        currentFlow,
        currentLevel,
        lastUpdated,
        dateFormat,
        lastUpdatedTime,
        timeFormat,
        latitude,
        longitude,
        historyUrl
    ) {
        this.title = title;
        this.region = region;
        this.url = url;
        this.jsonPath = jsonPath;
        this.siteName = siteName;
        this.currentFlow = currentFlow;
        this.currentLevel = currentLevel;
        this.lastUpdated = lastUpdated;
        this.dateFormat = dateFormat;
        this.lastUpdatedTime = lastUpdatedTime;
        this.timeFormat = timeFormat;
        this.latitude = latitude;
        this.longitude = longitude;
        this.historyUrl = historyUrl;
    }

    hasDynamicCoords() {
        return isNaN(this.latitude);
    }
}

module.exports = DataSource;
