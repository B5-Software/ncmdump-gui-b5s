import { ImageInfo } from './png';
import Logger from './logger';
/** Options of `generateICO`. */
export declare type ICOOptions = {
    /** Name of an output file. */
    name?: string;
    /** Structure of an image sizes. */
    sizes?: number[];
};
/** Sizes required for the ICO file. */
export declare const REQUIRED_IMAGE_SIZES: number[];
/**
 * Generate the ICO file from a PNG images.
 * @param images File information.
 * @param dir Output destination the path of directory.
 * @param logger Logger.
 * @param options Options.
 * @return Path of the generated ICO file.
 */
declare const generateICO: (images: ImageInfo[], dir: string, logger: Logger, options: ICOOptions) => Promise<string>;
export default generateICO;
