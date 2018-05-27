let dataSources = [
    {
        title: "Environment Canterbury (NORTH)",
        region: "Canterbury (North)",
        url:
            "http://data.ecan.govt.nz/data/57/Water/River%20Stage%20flow%20summary%20by%20area/JSON?Sites=NORTH",
        jsonPath: "data.item",
        siteName: "Site_x0020_Name",
        currentFlow: "Flow",
        currentLevel: "Stage_x0020_Height",
        lastUpdated: "Last_x0020_Sample",
        lat: "WGS84_Latitude",
        lng: "WGS84_Longitude"
    },
    {
        title: "Environment Canterbury (SOUTH)",
        region: "Canterbury (South)",
        url:
            "http://data.ecan.govt.nz/data/57/Water/River%20Stage%20flow%20summary%20by%20area/JSON?Sites=SOUTH",
        jsonPath: "data.item",
        siteName: "Site_x0020_Name",
        currentFlow: "Flow",
        currentLevel: "Stage_x0020_Height",
        lastUpdated: "Last_x0020_Sample",
        lat: "WGS84_Latitude",
        lng: "WGS84_Longitude"
    }
];

module.exports = dataSources;
