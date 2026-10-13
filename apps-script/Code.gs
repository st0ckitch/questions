// Google Apps Script for the Student Transition Information Request form.
// Paste into the responses Google Sheet via Extensions → Apps Script, then deploy as a web app
// (Execute as: Me, Who has access: Anyone). See README.md.

const SPREADSHEET_ID = "1bATGVFtzyjq0Uu1cyHhwkOJQeSfbcNnDR1hfPaWKayM";
const SHEET_NAME = "Responses";
const SIGNATURE_FOLDER = "Student Transition Form – Signatures";

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

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
