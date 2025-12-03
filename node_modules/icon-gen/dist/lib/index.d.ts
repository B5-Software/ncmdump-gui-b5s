/** Options of icon generation. */
export declare type ICONOptions = {
    /** Output setting of ICO file. */
    ico?: {
        /** Name of an output file. */
        name?: string;
        /** Structure of an image sizes. */
        sizes?: number[];
    };
    /** Output setting of ICNS file. */
    icns?: {
        /** Name of an output file. */
        name?: string;
        /** Structure of an image sizes. */
        sizes?: number[];
    };
    /** Output setting of Favicon file (PNG and ICO). */
    favicon?: {
        /** Prefix of an output PNG files. Start with the alphabet, can use `-` and `_`. This option is for PNG. The name of the ICO file is always `favicon.ico`. */
        name?: string;
        /** Size structure of PNG files to output. */
        pngSizes?: number[];
        /** Structure of an image sizes for ICO. */
        icoSizes?: number[];
    };
    /** `true` to display the processing status of the tool to `stdout`. */
    report: boolean;
};
/**
 * Generate an icon from SVG or PNG file.
 * @param src Path of the SVG file.
 * @param dest Path of the output files directory.
 * @param options Options.
 * @return Path of generated files.
 */
declare const generateIcon: (src: string, dest: string, options?: ICONOptions) => Promise<string[]>;
export default generateIcon;
