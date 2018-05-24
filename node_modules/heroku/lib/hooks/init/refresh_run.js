"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config = require("@oclif/config");
const analytics_1 = require("../../analytics");
async function run() {
    const config = await Config.load({ root: __dirname });
    const analytics = new analytics_1.default(config);
    await analytics.submit();
}
run()
    .catch(require('@oclif/errors/handle'));
