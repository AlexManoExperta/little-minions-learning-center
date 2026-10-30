# Credential photos (drop-in folder)

Put photos of the owner's licenses and certificates in this folder, then list them in
`js/main.js` → the `CREDENTIALS` array at the very top of the file.

1. Save each photo here, e.g. `assets/credentials/nm-child-care-license.jpg`
   - JPG or PNG, about 1200–1600 px on the long side, under ~500 KB each.
   - Use simple lowercase file names with dashes, no spaces.
   - **Privacy:** before publishing, cover/blur anything private (home address, date of birth,
     ID numbers you don't want public, signatures).
2. Open `js/main.js` and add one line per photo:

```js
const CREDENTIALS = [
  { src: "assets/credentials/nm-child-care-license.jpg", title: "New Mexico Child Care License", alt: "Photo of the New Mexico child care license" },
];
```

Each real photo replaces one "coming soon" tile (6 tiles are shown until there are 6+ photos).
Clicking a real photo opens it in a full-screen viewer (lightbox).
