// Google Apps Script for the Student Transition Information Request form.
// Paste into the responses Google Sheet via Extensions → Apps Script, then deploy as a web app
// (Execute as: Me, Who has access: Anyone). See README.md.

const SPREADSHEET_ID = "1bATGVFtzyjq0Uu1cyHhwkOJQeSfbcNnDR1hfPaWKayM";
const SHEET_NAME = "Responses";
const SIGNATURE_FOLDER = "Student Transition Form – Signatures";
const NOTIFY_EMAIL = "admissions@bist.ge"; // gets an email for every new submission

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    const record = { "Submitted at": new Date() };
    data.fields.forEach((f) => (record[f.label] = f.value));
    record["Signature"] = data.signature ? saveSignature_(data.signature, record) : "";

    // Keep a header row; append any new questions as new columns.
    const headers = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    Object.keys(record).forEach((k) => { if (!headers.includes(k)) headers.push(k); });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.appendRow(headers.map((h) => (h in record ? record[h] : "")));
    notify_(record, ss.getUrl());

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function saveSignature_(dataUrl, record) {
  const folders = DriveApp.getFoldersByName(SIGNATURE_FOLDER);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(SIGNATURE_FOLDER);
  const bytes = Utilities.base64Decode(dataUrl.split(",")[1]);
  const name = `${record["Student Full Name"] || "student"} – ${Utilities.formatDate(new Date(), "GMT+4", "yyyy-MM-dd HH-mm")}.png`;
  return folder.createFile(Utilities.newBlob(bytes, "image/png", name)).getUrl();
}

function notify_(record, sheetUrl) {
  const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  const rows = Object.keys(record).map((k) => {
    const v = record[k] instanceof Date ? record[k].toLocaleString() : record[k];
    const cell = k === "Signature" && v ? `<a href="${v}">View signature</a>` : esc(v || "—");
    return `<tr><td style="padding:6px 10px;border:1px solid #ddd;background:#f5f7fb;font-weight:bold;vertical-align:top">${esc(k)}</td>` +
           `<td style="padding:6px 10px;border:1px solid #ddd">${cell}</td></tr>`;
  }).join("");
  const student = record["Student Full Name"] || "a student";
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `New Student Transition Information Request: ${student}`,
    htmlBody: `<p>A new Student Transition Information Request was submitted for <b>${esc(student)}</b>.</p>` +
              `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px">${rows}</table>` +
              `<p><a href="${sheetUrl}">Open the responses sheet</a></p>`,
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
