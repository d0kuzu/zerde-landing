# Zerde — interactive landing concept

Open `index.html` directly, or serve this folder with `python -m http.server 4173 --bind 127.0.0.1`.

This independent version leaves the existing landing pages and their assets untouched. It uses plain HTML, CSS and JavaScript, with no build step or package dependencies. Google Fonts is optional; system fonts are used if it is unavailable.

The booking demo has four business scenarios, selectable times, replay and pause. The product tabs support arrow keys, Home and End. The video and AI search panels are illustrative product concepts. All businesses, customers and calendar entries are fictional examples.

The audit form validates locally and displays a clearly marked preview confirmation. It does not send requests, collect analytics, or use browser storage. Connect the form to an approved submission endpoint before publishing a production version.

The layout includes mobile navigation, a modal dialog, native FAQ disclosures, keyboard focus states and reduced-motion support.
