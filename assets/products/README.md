# Zerde product screenshots

The active landing page (`index.html`) presents three services: Reels made for the customer, search visibility, and booking automation. It displays the owner's `reels-results.jpg` collage and the three safe booking screenshots listed below. The six StoryFast studio images remain in this directory as archived product assets; the active landing page and its enlarged views do not display them.

## Current page assets

- `reels-results.jpg`: three Instagram examples cropped from the unmodified collage with CSS. Every crop opens the complete original collage in the enlarged view.
- `assistant-dashboard.png`: the unedited seven-day booking dashboard.
- `assistant-conversation-redacted.png`: the safely redacted conversation example.
- `assistant-conversations-redacted.png`: the safely redacted inbox example.
- `visibility-chatgpt-01.png`: the owner's unchanged ChatGPT answer excerpt, listing Cinta Aveda Institute first.
- `visibility-chatgpt-02.png`: the owner's unchanged ChatGPT comparison excerpt, listing Cinta Aveda Institute second. The page shows a podium based on each answer's first three entries; the “See the ChatGPT answer” button opens the original excerpt. These are two answer examples, not a before/after pair. See [`docs/visibility-screenshots.md`](../../docs/visibility-screenshots.md) for context and the gallery format.

## Original product asset provenance

The previous page used nine product screenshots supplied by the owner on September 25, 2026. Seven files are unchanged copies of those supplied images: the six StoryFast studio screens and the booking dashboard. The StoryFast screens belong to Zerde's video offering; the Zerde.ai screens belong to the booking assistant. Neither set is an AI search ranking result.

Original uploads live under the ignored `/images/` directory. Never commit or publish the original conversation screenshots; they contain customer phone numbers. For conversation and inbox views, only the two `*-redacted.png` files may be used on the site, including in enlarged views.

## Privacy edits

Created with the built-in imagegen tool (not the API/CLI), then copied into this directory. Both resulting images were visually checked: the seven inbox numbers and the two appearances of the number in the open conversation are unreadable. The country code alone remains in the open conversation. Generated outputs are retained under the Codex generated_images directory. These edited screenshots illustrate the interface; don't use them as exact archival copies.

Prompt for `assistant-conversation-redacted.png`:

> Use case: precise-object-edit. Edit target: the supplied real product screenshot. Privacy redaction only. Apply a VERY STRONG irreversible gaussian blur covering ALL digits of the customer phone number in exactly two places: (1) the number after 'Conversation with' in the top header (approx x475–630 y26–62 in the original 1328x671 image), (2) the phone number below 'Customer number' in the right Conversation Details card (approx x940–1055 y272–302). Blur must make every digit completely unreadable. Preserve the entire screenshot, dimensions/aspect ratio, all other UI, every other word, layout, colors, sharpness and margins exactly as provided. Do not redesign, recrop, replace text, or add decorative elements. Output only the edited full screenshot.

Prompt for `assistant-conversations-redacted.png`:

> Use case: precise-object-edit. Edit target: the supplied real product screenshot. Privacy redaction only. Apply a VERY STRONG irreversible gaussian blur covering EVERY customer's entire phone number in ALL SEVEN rows of the first table column Phone Number. The source is approximately 1325x672. Blur rectangles x268–380 with row y ranges 249–277, 311–339, 372–400, 433–461, 495–523, 556–584, 618–646. Every phone digit must be completely unreadable in every row. Preserve the entire screenshot and its aspect ratio, all other UI, every other word, layout, colors, sharpness and margins exactly. Do not redesign, recrop, replace numbers with invented numbers, change text, or add decorative elements. Output only the edited full screenshot.

The unedited assistant dashboard shows 16 appointments booked and 34.0% conversion for a selected seven-day reporting period. This is a single snapshot, not a general performance guarantee. It does not substantiate after-hours attribution or 20 weekly bookings.

## Additional results evidence — September 26, 2026

`reels-results.jpg` is an unchanged copy of the owner's `images/reels/example.jpg`. It shows three Instagram screenshots: 55.8K views, 240 likes, 32 shares/sends, and two visible “MATH” comments asking for a tour link. No customer phone numbers appear in this collage. Use these figures as engagement and inquiry evidence, not a count of paying clients or completed bookings. The page presents its three screenshots as CSS crops; the accessible enlarged view shows the complete original collage.

The search visibility gallery uses the two ChatGPT excerpts supplied and approved by the owner on September 26, 2026. They show Cinta Aveda Institute first and second in separate answers. The prompts and capture dates are not visible, so the page does not invent them or imply a consistent ranking. The previous illustrated comparison is retained only as an empty-gallery fallback.
