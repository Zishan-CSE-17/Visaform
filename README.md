# Japan Visa Form Helper

A small website to fill in your details for the Japan *Application for Extension of Period of Stay*
(applicant, part 1) and download them as Excel or PDF. No server, no login: everything runs in the
browser and data stays on each person's own device.

## Put it online with GitHub Pages (free)

1. Create a new repository on GitHub (e.g. `visa-helper`), set it to **Public**.
2. Upload `index.html`, `style.css`, `app.js` and `README.md` (Add file > Upload files).
3. Go to **Settings > Pages**. Under *Build and deployment*, choose **Deploy from a branch**,
   branch **main**, folder **/ (root)**, then Save.
4. After a minute your site is at `https://YOUR-USERNAME.github.io/visa-helper/`. Share that link with friends.

## How people use it

1. Open the official ISA form links on the page and download the form for their status.
2. Fill in the details. They are saved automatically in that browser.
3. Download Excel, or "Save as PDF / Print" and choose *Save as PDF*.
4. Copy the values into the official form (item numbers match).

"Save my data" / "Load my data" creates a backup file to move between devices.

## Notes

- Excel export uses the SheetJS library from a CDN, so an internet connection is needed for that button.
- Official forms are linked, not copied, so people always get the current version.
- Use English letters as in the passport. Always check against the current ISA instructions.
