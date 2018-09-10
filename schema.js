const Gauge = require("./models/Gauge");
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require("graphql");

const InfoType = new GraphQLObjectType({
    name: "Info",
    fields: () => ({
        flow: { type: GraphQLString },
        level: { type: GraphQLString }
    })
});

const HistoryType = new GraphQLObjectType({
    name: "History",
    fields: () => ({
        time: { type: GraphQLString },
        data: { type: InfoType }
    })
});

const GaugeType = new GraphQLObjectType({
    name: "Gauge",
    fields: () => ({
        siteName: { type: GraphQLString },
        lastUpdated: { type: GraphQLString },
        currentFlow: { type: GraphQLString },
        currentLevel: { type: GraphQLString },
        region: { type: GraphQLString },
        history: { type: GraphQLList(HistoryType)
//             resolve: (parent, args) => {
//                 return Gauge
//                     .findOne({ siteName: parent.siteName })
//                     .then(gauge => gauge.history)
//                     .catch(err => console.log(err));
//             }
        }
    })
});

// Root query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        allGauges: {
            type: new GraphQLList(GaugeType),
            resolve: async () => {
                return await Gauge.find({})
                    .then(gauge => gauge)
                    .catch(err => console.log(err));
            }
        },
        someGauges: {
            type: new GraphQLList(GaugeType),
            args: {
                siteNames: { type: new GraphQLList(GraphQLString) }
            },
            resolve: async (parentValue, args) => {
                return await Gauge.find({
                    siteName: { $in: args.siteNames }
                })
                    .then(gauge => gauge)
                    .catch(err => console.log(err));
            }
        },
        singleGauge: {
            type: GaugeType,
            args: {
                siteName: { type: GraphQLString }
            },
            resolve: async (parentValue, args) => {
                return await Gauge.findOne({ siteName: args.siteName })
                    .then(gauge => gauge)
                    .catch(err => console.log(err));
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: RootQuery });
