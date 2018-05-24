"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const path = require("path");
exports.migrate = async function () {
    const refreshFile = path.join(this.config.cacheDir, 'refresh');
    const refreshNeeded = async () => {
        try {
            const { mtime } = await fs.stat(refreshFile);
            const staleAt = new Date(mtime.valueOf() + 1000 * 60 * 60 * 24);
            return staleAt < new Date();
        }
        catch (err) {
            this.debug(err);
            return true;
        }
    };
    const refresh = async () => {
        await fs.outputFile(refreshFile, '');
        child_process_1.spawn(process.execPath, [path.join(__dirname, '../../../lib/hooks/init/refresh_run')], {
            detached: !this.config.windows,
            // stdio: 'inherit',
            stdio: 'ignore',
        }).unref();
    };
    if (await refreshNeeded())
        await refresh();
};
