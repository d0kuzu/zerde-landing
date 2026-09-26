# Add search visibility screenshots

The search visibility section displays two real ChatGPT excerpts supplied and approved by the owner on September 26, 2026:

- `visibility-chatgpt-01.png`: Cinta Aveda Institute is first in a list of schools.
- `visibility-chatgpt-02.png`: Cinta Aveda Institute is second in a comparison table.

Both files are unchanged copies of the attached PNGs. The prompts and capture dates are outside the supplied crops. Treat them as two separate answer examples, not a before/after pair or a guarantee of ranking. The page's “Top 2” caption refers only to the answers shown.

The visible examples are HTML/CSS podiums. `productScreens.visibility.rankings` lists the first three schools in each source answer in the same order. Each entry contains a short visible label and the full accessible school name. Cinta Aveda Institute is highlighted. The source image opens through “See the ChatGPT answer” and supports zoom on mobile.

To add more examples:

1. Put the approved screenshots in `assets/products/`. Use clear filenames such as `visibility-chatgpt-01.png` and `visibility-chatgpt-02.png`. If an image contains personal information, remove it permanently before adding it here and use a name ending in `-redacted.png`. Do not publish raw uploads from `images/`.
2. In `assets/landing.js`, find `productScreens.visibility.slides`. Add one entry per image using this structure:

   ```js
   ["visibility-chatgpt-01.png", "Describe what this actual screenshot shows", "A short, factual caption"],
   ```

   Replace the example text with a description and caption supported by the supplied image. Include the query or capture date where it helps explain the result. A fourth value, `true`, is available for a portrait image if needed.

3. Add a matching `rankings` entry with the first three schools in the new answer. Reload the page. The tabs change the podium, caption, and the image used by the enlarged view together.
4. Check the full image on a phone and a desktop, open its enlarged view, and confirm that all private information is unreadable. Verify every image tab and the left/right arrow keys.

Only add an Aveda recommendation after the real screenshot is supplied and approved. Do not invent a ChatGPT answer, client result, rank, query, or date. A screenshot of one answer does not establish a consistent first-place ranking. Keep claims tied to the example shown.

Leaving `slides: []` keeps the illustrated comparison and hides the empty gallery. Existing booking screenshots must continue to use the safe files `assistant-conversation-redacted.png` and `assistant-conversations-redacted.png` in both the page and enlarged view.
