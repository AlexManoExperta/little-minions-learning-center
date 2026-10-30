# Little Minions Learning Center — website

A static website (plain HTML + CSS + a small vanilla JS file, no build step) for
Little Minions Learning Center, 10631 Groundstone Rd SW, Albuquerque, NM 87121.
Phone 505-369-8606 · cerives1@gmail.com

```
index.html              ← all page content
css/styles.css          ← all styling (palette at the top)
js/main.js              ← menu, credentials gallery + lightbox, enrollment form
assets/logo.svg         ← original logo (sun + building blocks)
assets/favicon.svg      ← browser-tab icon
assets/og-image.svg/png ← social-sharing preview image
assets/credentials/     ← drop license / certificate photos here
previews/               ← screenshots (not needed for the live site)
```

## Preview locally

```bash
cd little-minions-learning-center
python3 -m http.server 8000
# open http://localhost:8000
```

## Add license / certificate photos

1. Copy the photos into `assets/credentials/` (JPG/PNG, ~1200–1600 px wide, simple file names).
   Blur/cover anything private first (date of birth, home details, signatures, ID numbers).
2. Open `js/main.js` and add one line per photo to the `CREDENTIALS` list at the top:

```js
const CREDENTIALS = [
  { src: "assets/credentials/nm-child-care-license.jpg", title: "New Mexico Child Care License", alt: "Photo of the New Mexico child care license" },
  { src: "assets/credentials/cpr-first-aid.jpg", title: "CPR & First Aid Certificate", alt: "Photo of the CPR and first aid certificate" },
];
```

Clicking a photo opens a full-size lightbox. `PLACEHOLDER_SLOTS` (in the same file) adds
"coming soon" tiles if you want empty slots.

The site uses `*-blurred.jpg` copies that hide license/certificate numbers and the Red Cross QR code.
The unblurred originals stay local only — they are listed in `.gitignore` and must not be published.

## The enrollment form

Right now there is **no form service**. When a parent presses **Send inquiry**, `js/main.js`
checks the required fields and opens the parent's email app with a message to
**cerives1@gmail.com**, pre-filled with name, phone, email, child's age, preferred shift and message.
The parent then presses send. (Phone and email are also shown as tap-to-call / tap-to-email links.)

### Switch to Formspree (or similar) later — only with the owner's approval

1. The owner creates her **own** free Formspree account and form (formspree.io), using cerives1@gmail.com.
2. In `index.html`, change the form's opening tag to:

```html
<form class="enroll-form" id="enroll-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" data-mode="formspree" novalidate>
```

   (`data-mode="formspree"` tells the script to validate and then let the form post normally.)
3. Update the small note under the button ("Sending opens your email app…").

Netlify Forms, Basin, or Getform work the same way: point `action` at their URL and set `data-mode` to anything other than `mailto`.

## Things to confirm with the owner

- Meal times (the daily meal schedule shows Morning / Midday / Afternoon / Evening — no exact times).
- Days of the week she is open (not stated on the site or in the structured data).
- Whether "text" is OK in addition to calling 505-369-8606 (site currently says "Call").
- Form service (see above).

## Deploy to GitHub Pages (when approved)

```bash
cd little-minions-learning-center
git init && git add . && git commit -m "Little Minions Learning Center website"
gh repo create <owner>/little-minions-learning-center --public --source=. --push
gh api -X POST repos/<owner>/little-minions-learning-center/pages -f "source[branch]=main" -f "source[path]=/"
```

The site will appear at `https://<owner>.github.io/little-minions-learning-center/`.
After deploying, add `<meta property="og:url">` and make `og:image` an absolute URL in `index.html`.
Optional: exclude `previews/` from the repo.
