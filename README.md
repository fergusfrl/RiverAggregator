# Flow Aggregator

> Restful API which surfaces aggregated New Zealand river data from various sources.
> A live end point can be hit at https://aggflow.herokuapp.com/ though this endpoint may not be keep up to date with the latest commit.

## Quick Start

```bash
# Install dependencies
npm install

# Add Database Config Directory
mkdir config

# Create db.js file
vi db.js

# Add following code to db.js
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(<mongodb-uri>));

# Run Flow Aggregator
npm start

# Server runs on http://localhost:3030
```

## Requests

#### Get all river data

```bash
# GET
http://localhost:3030
```

<details><summary>Example response</summary>
<p>

```json
// GET
// http://localhost:3030
{
    "metaData":{
        "dataLength":301,
        "lastUpdated":"2018-06-02T02:08:56.440Z"
    },
    "data": [
        {
            "siteName":"Waiau Toa/Clarence Jollies (NIWA)",
            "region":"Canterbury (North)",
            "currentFlow":"12.585",
            "currentLevel":"0.293",
            "lastUpdated":"02/06/2018 1:00am",
            "coordinates": {
                "lat":"-42.45731",
                "lng":"172.906357"
            }
        },
        {
            "siteName":"Waiau Toa/Clarence at Clarence Valley Rd Br",
            "region":"Canterbury (North)",
            "currentLevel":"0.626",
            "lastUpdated":"02/06/2018 1:00am",
            "coordinates": {
                "lat":"-42.1106262",
                "lng":"173.841934"
            }
        },
        ...,
        ...
    ]
}
```

</p>
</details>

#### Get river data by site name

```bash
# GET
http://localhost:3030/<siteName>
```

<details><summary>Example response</summary>
<p>

```json
// GET
// http://localhost:3030/Taieri%20at%20Outram
{
    "metaData": { "lastUpdate": "2018-06-02T03:17:13.032Z" },
    "data": {
        "siteName": "Taieri at Outram",
        "region": "Otago",
        "currentFlow": "25.346",
        "currentLevel": "34.6",
        "lastUpdate": "02/06/2018 2:15pm",
        "coordinates": {
            "lat": "-45.849812",
            "lng": "170.242773"
        },
        "historyUrl": ""
    }
}
```

</p>
</details>

#### Get historical river data by site name

```bash
# GET
http://localhost:3030/<siteName>/history
```

<details><summary>Example response</summary>
<p>

```json
// GET
// http://localhost:3030/Taieri%20at%20Outram
{
    "metData":{
        "siteName":"Taieri at Outram",
        "lastUpdated":"03/06/2018 10:00am"
    },
    "data":[
        {
            "time":"03/06/2018 10:00am",
            "flow":"25.134",
            "level": "34.6"
        },
        {
            "time":"03/06/2018 10:30am",
            "flow":"24.572",
            "level": "33.8"
        },
        ...,
        ...
    ]
}
```

</p>
</details>

## Data Sources

> All data sources are open source and free. Our thanks and gratitude to the developers and engineers who keep this information available for public use

1.  [Otago Region Counsil](http://water.orc.govt.nz/WaterInfo/Default.aspx)
2.  [Environment Canterbury](https://www.ecan.govt.nz/data/riverflow/)
3.  [Environment Southland](http://envdata.es.govt.nz/)
4.  [Marlborough District Council](http://data.marlborough.govt.nz/floodwatch/)

## App Info

#### Author

Fergus Farrell

#### Version

1.0.0

#### License

This project is licensed under the MIT license
