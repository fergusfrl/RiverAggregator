const DataSource = require("./classes/DataSource");

let dataSources = [
    new DataSource(
        "Environment Canterbury (NORTH)",
        "Canterbury (North)",
        "http://data.ecan.govt.nz/data/57/Water/River%20Stage%20flow%20summary%20by%20area/JSON?Sites=NORTH",
        "data.item",
        "Site_x0020_Name",
        "Flow",
        "Stage_x0020_Height",
        "Last_x0020_Sample",
        "WGS84_Latitude",
        "WGS84_Longitude"
    ),
    new DataSource(
        "Environment Canterbury (SOUTH)",
        "Canterbury (South)",
        "http://data.ecan.govt.nz/data/57/Water/River%20Stage%20flow%20summary%20by%20area/JSON?Sites=SOUTH",
        "data.item",
        "Site_x0020_Name",
        "Flow",
        "Stage_x0020_Height",
        "Last_x0020_Sample",
        "WGS84_Latitude",
        "WGS84_Longitude"
    ),
    new DataSource(
        "Otago Regional Counsil",
        "Otago",
        "http://data.orc.govt.nz/v1/sql/TEL_RIVF_SUMMARY/",
        "value",
        "SiteName",
        "LatestFlow_m3s",
        "Stage_x0020_Height",
        "Date",
        "GeometrySRID4326.coordinates.1",
        "GeometrySRID4326.coordinates.0",
        "",
        "Time_NZST",
        "HH:mm",
        ""
    ),
    new DataSource(
        "Environment Southland (flow meters)",
        "Southland",
        "http://envdata.es.govt.nz/services/data.ashx?f=flow.xml",
        "sites",
        "Site",
        "Flow.Value",
        "",
        "DataTo",
        "",
        "",
        "DD/MM/YYYY h:mm:ss a"
    ),
    new DataSource(
        "Environment Southland (level meters)",
        "Southland",
        "http://envdata.es.govt.nz/services/data.ashx?f=water-level.xml",
        "sites",
        "Site",
        "",
        "WaterLevel.Value",
        "DataTo",
        "",
        "",
        "DD/MM/YYYY h:mm:ss a"
    ),
    new DataSource(
        "Marlborough District Counsil",
        "Marlborough",
        "http://hydro.marlborough.govt.nz/reports/riverreport.json",
        null,
        "SiteName",
        "Flow",
        "Stage",
        "LastUpdate",
        "",
        "",
        "DD MMM YYYY H:mm"
    ),
    new DataSource(
        "Taranaki Regional Counsil",
        "Taranaki",
        "https://www.trc.govt.nz/environment/maps-and-data/regional-overview//MapMarkers/?measureID=7",
        null,
        "title",
        "measure",
        "",
        "description",
        "lat",
        "lng"
    )
];

module.exports = dataSources;
