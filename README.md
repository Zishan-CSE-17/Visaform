# VisaForm Japan

A static, browser-based editor for preparing a Japanese change-of-status application. The landing page links to the Immigration Services Agency’s PDF and Excel forms for 留学 → 技術・人文知識・国際業務. The official form directory covers other statuses.

## Put it on GitHub Pages

1. Unzip the project. Create a GitHub repository and upload the contents of the project folder so that `index.html`, `app.js`, `workbook.js`, `styles.css`, and the entire `vendor/` directory sit at the root.
2. Open **Settings → Pages** in that repository. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/(root)`. Save.
3. When GitHub shows the published URL, open it on desktop and mobile. Share that URL with friends. Upload only the site files to the repository. Keep personal copies of application documents on your device.
4. To preview locally, run `python3 -m http.server 8000` in the project folder and open `http://localhost:8000/`.

## Fill a form

- Download a blank form from the official links. If a direct link changes, use **Official form and requirements** and look for **在留資格変更許可申請書**.
- Choose the downloaded form in the app. For PDFs, click where the text baseline should begin, type the answer, and apply it. For Excel, select a sheet and answer cell, type the value, and apply it. The grid previews the first 100 rows and 48 columns. Enter a cell address to edit outside that range. Enter text dates and identifiers exactly as they should appear.
- Download your edited copy and review all pages. The workbook export keeps the original worksheet styling and layout. The browser grid previews cell values and merged areas. PDF additions are rendered as text images using your device's installed fonts.
- Complete signatures, photo placement, checkboxes and other visual details as appropriate. For PDF checkboxes, place a text mark in the correct position or complete them on the printed copy. Have the employer complete the employer pages.
- The app has no account, backend, analytics, browser storage, or automated submission. Your file stays on your device. Download before closing or refreshing the tab.

Third-party libraries are bundled in `vendor/` with their license notices.
