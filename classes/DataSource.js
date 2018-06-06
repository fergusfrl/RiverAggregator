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
        latitude,
        longitude,
        dateFormat = "",
        lastUpdatedTime = "",
        timeFormat = "",
        timeZone = "Pacific/Auckland"
    ) {
        this.title = title;
        this.region = region;
        this.url = url;
        this.jsonPath = jsonPath;
        this.siteName = siteName;
        this.currentFlow = currentFlow;
        this.currentLevel = currentLevel;
        this.lastUpdated = lastUpdated;
        this.latitude = latitude;
        this.longitude = longitude;
        this.dateFormat = dateFormat;
        this.lastUpdatedTime = lastUpdatedTime;
        this.timeFormat = timeFormat;
        this.timeZone = timeZone;
    }

    hasDynamicCoords() {
        return isNaN(this.latitude);
    }
}

module.exports = DataSource;
