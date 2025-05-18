# QR Code Generator API

A simple, static QR code generator API that runs entirely in the browser. This API allows you to generate QR codes in various formats (SVG, PNG, or URL) for any text or URL input.

## Usage

The API is accessible through URL parameters:

```
https://daviskartchner.com/qrcode/?data=[your-data]&type=[type]
```

### Parameters

- `data` (required): The content to encode in the QR code
- `type` (optional): Output format
  - `svg` (default) - Returns SVG format
  - `png` - Returns PNG format
  - `url` - Returns URL format

### Examples

1. Generate SVG QR code:
```
https://daviskartchner.com/qrcode/?data=Hello%20World
```

2. Generate PNG QR code:
```
https://daviskartchner.com/qrcode/?data=Hello%20World&type=png
```

3. Generate URL QR code:
```
https://daviskartchner.com/qrcode/?data=https://example.com&type=url
```

## Implementation

The API uses the [node-qrcode](https://github.com/soldair/node-qrcode) library for QR code generation. All processing is done client-side, making it suitable for static hosting.

## License

MIT License 