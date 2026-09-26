/**
 * B4ES Website changes — status bridge for Claude.
 *
 * Install once: in the Google Sheet, Extensions -> Apps Script, paste this
 * file, set the SECRET script property, then Deploy -> New deployment -> Web app
 * (Execute as: Me, Who has access: Anyone). Full steps are in the README
 * section "Change-tracker sheet".
 *
 * It can only do two things, both on the "B4ES Web" tab:
 *   - read the rows (GET)
 *   - set a row's Status and append a dated note in "Claude notes" (POST)
 * Every request must carry the secret; without it nothing happens.
 */

var TAB = "B4ES Web";
var STATUSES = ["Not started", "In progress", "Blocked", "Launched"];
var NOTES_HEADER = "Claude notes";

function sheet_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(TAB);
  if (!sh) throw new Error("Tab not found: " + TAB);
  return sh;
}

function authorised_(secret) {
  var expected = PropertiesService.getScriptProperties().getProperty("SECRET");
  return expected && secret && secret === expected;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function header_(sh) {
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
}

function notesColumn_(sh) {
  var head = header_(sh);
  var i = head.indexOf(NOTES_HEADER);
  if (i >= 0) return i + 1;
  var col = head.length + 1;
  sh.getRange(1, col).setValue(NOTES_HEADER).setFontWeight("bold");
  return col;
}

function doGet(e) {
  if (!authorised_(e.parameter.secret)) return json_({ ok: false, error: "unauthorised" });
  var sh = sheet_();
  var values = sh.getDataRange().getValues();
  var head = values.shift().map(String);
  var rows = values
    .filter(function (r) { return String(r[0]).trim(); })
    .map(function (r) {
      var o = {};
      head.forEach(function (h, i) { o[h || "col" + (i + 1)] = r[i]; });
      return o;
    });
  return json_({ ok: true, rows: rows });
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) {}
  if (!authorised_(body.secret)) return json_({ ok: false, error: "unauthorised" });

  var section = String(body.section || "").trim().toLowerCase();
  if (!section) return json_({ ok: false, error: "section required" });
  if (body.status && STATUSES.indexOf(body.status) < 0) {
    return json_({ ok: false, error: "status must be one of: " + STATUSES.join(", ") });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet_();
    var head = header_(sh);
    var statusCol = head.indexOf("Status") + 1;
    var sections = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
    var row = -1;
    for (var i = 0; i < sections.length; i++) {
      if (String(sections[i][0]).trim().toLowerCase() === section) { row = i + 2; break; }
    }
    if (row < 0) return json_({ ok: false, error: "section not found" });

    if (body.status && statusCol > 0) sh.getRange(row, statusCol).setValue(body.status);
    if (body.note) {
      var col = notesColumn_(sh);
      var cell = sh.getRange(row, col);
      var stamp = Utilities.formatDate(new Date(), "Europe/London", "d MMM yyyy");
      var prev = String(cell.getValue() || "");
      cell.setValue((prev ? prev + "\n" : "") + stamp + ": " + String(body.note).slice(0, 2000)).setWrap(true);
    }
    return json_({ ok: true, row: row });
  } finally {
    lock.releaseLock();
  }
}
