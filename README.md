# Student Transition Information Request

A static HTML form (no server needed) hosted on GitHub Pages.

- `index.html`: the page
- `questions.js`: **all questions and options**. Edit this file to change the form.
- `style.css`: the design (navy background, gold labels, rounded white fields)
- `app.js`: rendering, validation, signature pad and submission
- `assets/logo.png`: official BIST crest (from "BIST logo yellow transparent.png")

## Where responses go

Each submission is emailed through [FormSubmit](https://formsubmit.co) to
**artyomananov@gmail.com**, with a CC to **i.sisauri@bist.ge**. The email contains
every answer in a table, and the drawn signature is attached as `signature.png`.

**One-time activation:** the first time the form is submitted, FormSubmit sends an
activation email to artyomananov@gmail.com. Someone must click **Activate Form** in that
email. Until then, no submissions are delivered, the first one included. After activating,
send a test submission.

### Optional: also save every response to a Google Sheet

1. Create a Google Sheet, then open **Extensions → Apps Script** and paste:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     const data = JSON.parse(e.postData.contents);
     let headers = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
     Object.keys(data).forEach((k) => { if (!headers.includes(k)) headers.push(k); });
     sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
     sheet.appendRow(headers.map((h) => data[h] ?? ""));
     return ContentService.createTextOutput("ok");
   }
   ```

2. Click **Deploy → New deployment → Web app**, set *Execute as: Me* and *Who has access: Anyone*, then deploy.
3. Paste the web app URL into `sheetsUrl` in `app.js`.

## Publishing with GitHub Pages

Repository **Settings → Pages → Build and deployment**: set Source to *Deploy from a branch*,
choose the branch and `/ (root)`, then save. The form will be live at
`https://<owner>.github.io/<repo>/` after a minute or two.
