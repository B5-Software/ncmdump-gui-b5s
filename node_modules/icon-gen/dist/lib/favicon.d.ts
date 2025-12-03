import { ImageInfo } from './png';
import Logger from './logger';
/** Options ot generate ICO file. */
export declare type FavOptions = {
    /** Prefix of an output PNG files. Start with the alphabet, can use `-` and `_`. This option is for PNG. The name of the ICO file is always `favicon.ico`. */
    name?: string;
    /** Size structure of PNG files to output. */
    pngSizes?: number[];
    /** Structure of an image sizes for ICO. */
    icoSizes?: number[];
};
/** Sizes required for the PNG files. */
export declare const REQUIRED_PNG_SIZES: number[];
/** Sizes required for ICO file. */
export declare const REQUIRED_ICO_SIZES: number[];
/** Sizes required for Favicon files. */
export declare const REQUIRED_IMAGE_SIZES: number[];
/**
 * Generate the FAVICON PNG file from the PNG images.
 * @param images File information for the PNG files generation.
 * @param dir Output destination the path of directory.
 * @param prefix Prefix of an output PNG files. Start with the alphabet, can use `-` and `_`. This option is for PNG. The name of the ICO file is always `favicon.ico`.
 * @param sizes Size structure of PNG files to output.
 * @param logger Logger.
 * @return Path of the generated files.
 */
export declare const generatePNG: (images: ImageInfo[], dir: string, prefix: string, sizes: number[], logger: Logger) => Promise<string[]>;
/**
 * Generate a FAVICON image files (ICO and PNG) from the PNG images.
 * @param images File information for the PNG files generation.
 * @param dir Output destination the path of directory.
 * @param logger Logger.
 * @param options Options.
 * @return Path of the generated files.
 */
declare const generateFavicon: (images: ImageInfo[], dir: string, logger: Logger, options: FavOptions) => Promise<string[]>;
export default generateFavicon;
