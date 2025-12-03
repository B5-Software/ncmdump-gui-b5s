import { ImageInfo } from './png';
import Logger from './logger';
/** Options of ICNS. */
export declare type ICNSOptions = {
    /** Name of an output file. */
    name?: string;
    /** Structure of an image sizes. */
    sizes?: number[];
};
/**
 * Sizes required for the ICNS file.
 * @type {Array}
 */
export declare const REQUIRED_IMAGE_SIZES: number[];
/**
 * Unpack an icon block files from ICNS file (For debug).
 * @param src Path of the ICNS file.
 * @param dest Path of directory to output icon block files.
 * @return Asynchronous task.
 */
export declare const debugUnpackIconBlocks: (src: string, dest: string) => Promise<void>;
/**
 * Create the ICNS file from a PNG images.
 * @param images Information of the image files.
 * @param dir Output destination the path of directory.
 * @param logger Logger.
 * @param options Options.
 * @return Path of generated ICNS file.
 */
declare const generateICNS: (images: ImageInfo[], dir: string, logger: Logger, options: ICNSOptions) => Promise<string>;
export default generateICNS;
