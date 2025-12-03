/**
 * Convert PackBits literals to results.
 * @param literals PackBits literals.
 * @return Converted literals.
 */
export declare const packBitsLiteralToResult: (literals: number[]) => number[];
/**
 * Decompress PackBits compressed binary.
 * This method port Geeks with Blogs code (Apache License v2.0) to Node.
 * @param src Source binary.
 * @return Decompressed binary.
 * @see https://en.wikipedia.org/wiki/PackBits
 * @see http://geekswithblogs.net/rakker/archive/2015/12/14/packbits-in-c.aspx
 */
export declare const unpackBits: (src: number[]) => number[];
/**
 * Compress binary with ICNS RLE.
 * @param src Source binary.
 * @return Compressed binary.
 * @see https://github.com/fiji/IO/blob/master/src/main/java/sc/fiji/io/icns/RunLengthEncoding.java
 */
export declare const packICNS: (src: number[]) => any[];
/**
 * Compress binary with PackBits.
 * This method port Geeks with Blogs code (Apache License v2.0) to Node.
 * @param src Source binary.
 * @return Compressed binary.
 * @see https://en.wikipedia.org/wiki/PackBits
 * @see http://geekswithblogs.net/rakker/archive/2015/12/14/packbits-in-c.aspx
 */
export declare const packBits: (src: number[]) => number[];
