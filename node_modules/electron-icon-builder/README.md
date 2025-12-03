# electron-icon-builder

[![npm](https://img.shields.io/npm/v/electron-icon-builder?color=success)](https://www.npmjs.com/package/electron-icon-builder)
[![node](https://img.shields.io/node/v/electron-icon-builder)](https://www.npmjs.com/package/electron-icon-builder)
[![dependencies status](https://img.shields.io/david/safu9/electron-icon-builder)](https://david-dm.org/safu9/electron-icon-builder)

An icon generator to generate all the icon files needed for electron packaging

## Global usage

Install globally using

```
npm install -g electron-icon-builder
```

To use

```
electron-icon-builder --input=/absolute/path/file.png --output=./relative/path/to/folder
```

## Local usage

Install locally
```
npm install --save-dev electron-icon-builder
```

To use
```
./node_modules/.bin/electron-icon-builder --input=/absolute/path/file.png --output=./relative/path/to/folder
```

## Arguments

```
--output, -o = [String] Folder to create files
--input, -i = [String] Path to PNG file
--flatten, -f  Flatten output structure
```

## Recommendations

Input file should be 1024px x 1024px or larger. Make sure it is a 1 to 1 aspect ratio on width to height.

## Output structure

```
[output dir]
    -[icons]
        -[mac]
            - icon.icns
        -[png]
            - 16x16.png
            - 24x24.png
            ...
            ...
            - 512x512.png
            - 1024x1024.png
        -[win]
            -icon.ico
```
When flatten option is enabled
```
[output dir]
    -[icons]
        - icon.icns
        - icon.ico
        - 16x16.png
        - 24x24.png
        ...
        ...
        - 512x512.png
        - 1024x1024.png
```
