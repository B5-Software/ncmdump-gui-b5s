import { ICONOptions } from '../lib/index';
/** Options of command line interface. */
declare type CLIOptions = {
    /** Path of the SVG file or PNG file directory. */
    input: string;
    /** Path of the output directory. */
    output: string;
    /** Options of the icon generation. */
    icon: ICONOptions;
};
/**
 * Parse the arguments of command line interface.
 * @param argv Arguments of command line interface.
 * @returns Parsed options.
 */
export declare const parseArgv: (argv: string[]) => CLIOptions;
/**
 * Run the tool based on command line arguments.
 * @param argv Arguments of command line interface.
 * @returns Path of generated files.
 */
declare const exec: (argv: string[]) => Promise<string[]>;
export default exec;
