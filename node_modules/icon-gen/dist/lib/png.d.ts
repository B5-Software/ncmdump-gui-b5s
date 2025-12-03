import Logger from './logger';
/** Image file information. */
export declare type ImageInfo = {
    /** Image size (width/height). */
    size: number;
    /** Path of an image file. */
    filePath: string;
};
/**
 * Filter by size to the specified image information.
 * @param images Image file information.
 * @param sizes  Required sizes.
 * @return Filtered image information.
 */
export declare const filterImagesBySizes: (images: ImageInfo[], sizes: number[]) => ImageInfo[];
/**
 * Generate the PNG files.
 * @param src Path of SVG file.
 * @param dir Output destination The path of directory.
 * @param sizes Required PNG image size.
 * @param logger Logger.
 */
export declare const generatePNG: (src: string, dir: string, sizes: number[], logger: Logger) => Promise<ImageInfo[]>;
export default generatePNG;
