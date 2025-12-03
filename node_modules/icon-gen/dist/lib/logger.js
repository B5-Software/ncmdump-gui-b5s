"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Display the log message for the stdout. */
class Logger {
    /**
     * Initialize instance.
     * @param available "true" to display the report, default is "false".
     */
    constructor(available = false) {
        this._available = available;
    }
    /**
     * Display a log message for the stdout.
     * @param args Message arguments.
     */
    log(...args) {
        if (this._available) {
            console.log(...args);
        }
    }
    /**
     * Display an error message for the stdout.
     * @param args Message arguments.
     */
    error(...args) {
        if (this._available) {
            console.error(...args);
        }
    }
}
exports.default = Logger;
