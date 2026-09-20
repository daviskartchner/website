# QR Code Generator

A simple, static QR code generator that runs entirely in the browser. Use the interactive tool to design your QR code (templates, colors, sizes, error correction, and more), or hit the URL API to generate one programmatically.

The live tool lives at:

```
https://daviskartchner.com/qrcode/
```

## Interactive Tool

In the tool you can:

- Pick a template: URL, WiFi, Email, Phone, SMS, or Contact Card
- Choose format (PNG, JPG, SVG) and size
- Customize colors, corner radius, padding, error correction, and encoding
- Preview live and download the result

## API

The URL API is accessible through the `generate.html` endpoint:

```
https://daviskartchner.com/qrcode/generate.html?data=[your-data]&type=[type]
```

Full documentation: https://daviskartchner.com/qrcode/api.html

### Parameters

- `data` (required): The content to encode in the QR code
- `type` (optional): Output format
  - `svg` (default) - Returns SVG format
  - `png` - Returns PNG format
  - `url` - Returns URL format

### Examples

1. Generate SVG QR code:
```
https://daviskartchner.com/qrcode/generate.html?data=Hello%20World
```

2. Generate PNG QR code:
```
https://daviskartchner.com/qrcode/generate.html?data=Hello%20World&type=png
```

3. Generate URL QR code:
```
https://daviskartchner.com/qrcode/generate.html?data=https://example.com&type=url
```

## Implementation

The generator uses the [qrcodejs](https://github.com/davidshimjs/qrcodejs) library for QR code generation. All processing is done client-side, making it suitable for static hosting.

## License

MIT License