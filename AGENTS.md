# AGENTS.md

Guidelines for contributors and AI agents working in this repository.

## QR Code Generator page

The interactive QR generator lives at `qrcode/generate.html` (a single static
file with inline CSS/JS). It runs entirely client-side and supports both a
GUI mode (default) and a headless "direct" mode driven by URL query parameters
(`?data=&type=&size=&dark=&light=&radius=&pad=&q=&logo=`), which powers the
API/shared links.

### Rules

- **Always bump the version when changing `qrcode/generate.html`.** The version
  badge is rendered from a `vX.Y.Z` string in the file (see `.version` in the
  header). Bump it with the repo script and include the bump in the same commit:

  ```sh
  node scripts/bump-version.mjs --type patch   # or minor | major
  node scripts/bump-version.mjs --type patch --commit   # stage + commit too
  ```

- `qrcode/index.html` is a redirect into `generate.html` (preserving any query
  string). `qrcode/api.html` documents the URL API. `qrcode/test.html` is a
  manual test page.

- The page uses the stock `qrcodejs` library
  (`cdnjs .../qrcodejs/1.0.0/qrcode.min.js`). It only renders Canvas; it does
  **not** support SVG or corner radius — SVG export is built manually from the
  QR matrix (`qr._oQRCode.getModuleCount()` / `.isDark(r,c)`) in
  `buildSvgString()`.

- All processing is client-side; no build step. Verify a change by opening the
  page locally or with a headless browser before pushing.