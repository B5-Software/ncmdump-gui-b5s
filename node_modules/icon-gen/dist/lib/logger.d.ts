/** Display the log message for the stdout. */
export default class Logger {
    private _available;
    /**
     * Initialize instance.
     * @param available "true" to display the report, default is "false".
     */
    constructor(available?: boolean);
    /**
     * Display a log message for the stdout.
     * @param args Message arguments.
     */
    log(...args: any[]): void;
    /**
     * Display an error message for the stdout.
     * @param args Message arguments.
     */
    error(...args: any[]): void;
}
