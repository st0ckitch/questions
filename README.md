# Student Transition Information Request

A static HTML form (no server needed) hosted on GitHub Pages.

- `index.html`: the page
- `questions.js`: **all questions and options**. Edit this file to change the form.
- `style.css`: the design (navy background, gold labels, rounded white fields)
- `app.js`: rendering, validation, signature pad and submission
- `assets/logo.png`: official BIST crest (from "BIST logo yellow transparent.png")

## Where responses go

Every submission is saved as a new row in a Google Sheet, and a copy of the answers is emailed to **admissions@bist.ge** (set `NOTIFY_EMAIL` in `apps-script/Code.gs`).
- **Sheet:** [responses sheet](https://docs.google.com/spreadsheets/d/1bATGVFtzyjq0Uu1cyHhwkOJQeSfbcNnDR1hfPaWKayM/edit), in a tab named **Responses**, which the script creates if needed
- **Columns:** one per question, plus "Submitted at"
- **Signatures:** each one is saved as a PNG in a Drive folder named
  *Student Transition Form – Signatures*. Its link goes in the "Signature" column.

### One-time setup (about 5 minutes)

1. Open the sheet above and go to **Extensions → Apps Script**.
2. Delete what's in `Code.gs`, paste in the contents of [`apps-script/Code.gs`](apps-script/Code.gs), and save.
3. Click **Deploy → New deployment**. Under the gear icon choose **Web app**, then set:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
4. Click **Deploy** and allow the permissions Google asks for.
5. Copy the **Web app URL** (it ends in `/exec`) and paste it into `sheetsUrl` in `app.js`.
   Then commit, or send the URL to whoever maintains this repo.

If you edit the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## Publishing with GitHub Pages

Repository **Settings → Pages → Build and deployment**: set Source to *Deploy from a branch*,
choose the branch and `/ (root)`, then save. The form will be live at
`https://<owner>.github.io/<repo>/` after a minute or two.
