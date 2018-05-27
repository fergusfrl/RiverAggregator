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
    },
    {
        title: "Otago Regional Counsil",
        region: "Otago",
        url: "http://data.orc.govt.nz/v1/sql/TEL_RIVF_SUMMARY/",
        jsonPath: "value",
        siteName: "SiteName",
        currentFlow: "LatestFlow_m3s",
        currentLevel: "Stage_x0020_Height",
        lastUpdated: "Date",
        lat: "GeometrySRID4326.coordinates.1",
        lng: "GeometrySRID4326.coordinates.0"
    }
];

module.exports = dataSources;
