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
        lastUpdatedTime: "",
        dateFormat: "",
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
        lastUpdatedTime: "",
        dateFormat: "",
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
        lastUpdatedTime: "Time_NZST",
        dateFormat: "",
        lat: "GeometrySRID4326.coordinates.1",
        lng: "GeometrySRID4326.coordinates.0"
    },
    {
        title: "Environment Southland (flow meters)",
        region: "Southland",
        url: "http://envdata.es.govt.nz/services/data.ashx?f=flow.xml",
        jsonPath: "sites",
        siteName: "Site",
        currentFlow: "Flow.Value",
        currentLevel: "",
        lastUpdated: "DataTo",
        lastUpdatedTime: "",
        dateFormat: "DD/MM/YYYY h:mm:ss a",
        lat: "",
        lng: ""
    },
    {
        title: "Environment Southland (level meters)",
        region: "Southland",
        url: "http://envdata.es.govt.nz/services/data.ashx?f=water-level.xml",
        jsonPath: "sites",
        siteName: "Site",
        currentFlow: "WaterLevel.Value",
        currentLevel: "",
        lastUpdated: "DataTo",
        lastUpdatedTime: "",
        dateFormat: "DD/MM/YYYY h:mm:ss a",
        lat: "",
        lng: ""
    },
    {
        title: "Marlborough District Counsil",
        region: "Marlborough",
        url: "http://hydro.marlborough.govt.nz/reports/riverreport.json",
        jsonPath: null,
        siteName: "SiteName",
        currentFlow: "Flow",
        currentLevel: "Stage",
        lastUpdated: "LastUpdate",
        lastUpdatedTime: "",
        dateFormat: "DD MMM YYYY H:mm",
        lat: "",
        lng: ""
    }
];

module.exports = dataSources;
