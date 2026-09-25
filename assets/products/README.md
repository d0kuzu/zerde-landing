# Zerde product screenshots

The first landing version (`index.html`) uses nine screenshots supplied by the project owner on September 25, 2026. The StoryFast screens belong to Zerde's video offering; the Zerde.ai screens belong to the booking assistant. Neither set is an AI search ranking result.

Seven files are unchanged copies of the supplied images. Original uploads live under the ignored `/images/` directory. Never commit or publish the original conversation screenshots; they contain customer phone numbers. Only the two `*-redacted.png` files may be used on the site, including in enlarged views.

## Privacy edits

Created with the built-in imagegen tool (not the API/CLI), then copied into this directory. Both resulting images were visually checked: the seven inbox numbers and the two appearances of the number in the open conversation are unreadable. The country code alone remains in the open conversation. Generated outputs are retained under the Codex generated_images directory. These edited screenshots illustrate the interface; don't use them as exact archival copies.

Prompt for `assistant-conversation-redacted.png`:

> Use case: precise-object-edit. Edit target: the supplied real product screenshot. Privacy redaction only. Apply a VERY STRONG irreversible gaussian blur covering ALL digits of the customer phone number in exactly two places: (1) the number after 'Conversation with' in the top header (approx x475–630 y26–62 in the original 1328x671 image), (2) the phone number below 'Customer number' in the right Conversation Details card (approx x940–1055 y272–302). Blur must make every digit completely unreadable. Preserve the entire screenshot, dimensions/aspect ratio, all other UI, every other word, layout, colors, sharpness and margins exactly as provided. Do not redesign, recrop, replace text, or add decorative elements. Output only the edited full screenshot.

Prompt for `assistant-conversations-redacted.png`:

> Use case: precise-object-edit. Edit target: the supplied real product screenshot. Privacy redaction only. Apply a VERY STRONG irreversible gaussian blur covering EVERY customer's entire phone number in ALL SEVEN rows of the first table column Phone Number. The source is approximately 1325x672. Blur rectangles x268–380 with row y ranges 249–277, 311–339, 372–400, 433–461, 495–523, 556–584, 618–646. Every phone digit must be completely unreadable in every row. Preserve the entire screenshot and its aspect ratio, all other UI, every other word, layout, colors, sharpness and margins exactly. Do not redesign, recrop, replace numbers with invented numbers, change text, or add decorative elements. Output only the edited full screenshot.

The unedited assistant dashboard shows 16 appointments booked and 34.0% conversion for a selected seven-day reporting period. This is a single snapshot, not a general performance guarantee. It does not substantiate after-hours attribution, 20 weekly bookings, 55K Reel views, or a #1 ChatGPT ranking.
