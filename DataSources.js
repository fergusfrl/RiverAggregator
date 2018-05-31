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
        longitude
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
    }

    getTitle() {
        return this.title;
    }

    getRegion() {
        return this.region;
    }

    getUrl() {
        return this.url;
    }

    getJsonPath() {
        return this.jsonPath;
    }

    getSiteName() {
        return this.siteName;
    }

    getCurrentFlow() {
        return this.currentFlow;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getLastUpdated() {
        return this.lastUpdated;
    }

    getDateFormat() {
        return this.dateFormat;
    }

    getLastUpdatedTime() {
        return this.lastUpdatedTime;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }
}

module.exports = DataSource;
