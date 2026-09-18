/* Private Google Apps Script bridge. Deploy as owner; access Anyone.
 * HMAC authorization is mandatory; never put its secret in browser code.
 * Do not run setup until real email delivery is intentionally enabled.
 */
var HEADERS = ['id', 'createdAt', 'fingerprint', 'emailHash', 'ipHash', 'name', 'email', 'company', 'purpose', 'message', 'consent', 'ownerState', 'ackState', 'ownerAttempts', 'ackAttempts', 'ownerNext', 'ackNext', 'ownerUpdated', 'ackUpdated', 'ackSubject', 'ackBody', 'phone'];

function properties_() {
  var p = PropertiesService.getScriptProperties().getProperties();
  if (!p.BRIDGE_SECRET || p.BRIDGE_SECRET.length < 32 || !p.SHEET_ID || !p.OWNER_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.OWNER_EMAIL)) throw Error('Missing configuration');
  return p;
}
function hmac_(text, secret) {
  return Utilities.computeHmacSha256Signature(text, secret).map(function (b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
}
function equal_(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function response_(payload, nonce, secret) {
  var timestamp = Date.now(), body = JSON.stringify(payload);
  return ContentService.createTextOutput(JSON.stringify({ timestamp: timestamp, nonce: nonce, payload: body, signature: hmac_(timestamp + '\n' + nonce + '\n' + body, secret) })).setMimeType(ContentService.MimeType.JSON);
}
function literal_(value) {
  var text = String(value || '');
  return /^[\s]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text) ? "'" + text : text;
}
function sheet_(book, name, headers) {
  var sheet = book.getSheetByName(name);
  if (!sheet) { sheet = book.insertSheet(name); sheet.appendRow(headers); sheet.setFrozenRows(1); }
  if (name === 'Leads') {
    var phoneHeader = sheet.getRange(1, 22).getValues()[0][0];
    if (phoneHeader && phoneHeader !== 'phone') throw Error('Column V is already in use; move its custom data before adding phone');
    if (!phoneHeader) sheet.getRange(1, 22).setValue('phone');
  }
  return sheet;
}
function validateLead_(lead) {
  if (!lead || !/^[a-f0-9-]{36}$/i.test(lead.idempotencyKey || '') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email || '') || lead.email.length > 254 ||
      typeof lead.name !== 'string' || lead.name.length < 2 || lead.name.length > 100 || /[\r\n\u0000]/.test(lead.name + lead.email + (lead.company || '')) ||
      typeof lead.company !== 'string' || lead.company.length > 150 || ['recruitment', 'networking', 'consulting', 'general', 'resume'].indexOf(lead.purpose) < 0 ||
      (typeof lead.phone !== 'string' || !/^\+?[0-9]{7,15}$/.test(lead.phone)) ||
      typeof lead.message !== 'string' || lead.message.length > 4000 || (lead.purpose !== 'resume' && lead.message.length < 10) || lead.consent !== true ||
      !/^[a-f0-9]{64}$/.test(lead.ipHash || '') || !lead.notification || typeof lead.notification.subject !== 'string' ||
      lead.notification.subject.length > 260 || /[\r\n\u0000]/.test(lead.notification.subject) || typeof lead.notification.message !== 'string' || lead.notification.message.length > 8500) throw Error('Invalid record');
}

function privateResume_(request, p) {
  if (Object.keys(request).some(function (key) { return key !== 'action' && key !== 'version'; }) ||
      ['resume/check', 'resume/read'].indexOf(request.action) < 0 || !p.RESUME_FILE_ID ||
      !/^[a-zA-Z0-9_-]{10,200}$/.test(p.RESUME_FILE_ID) || !/^[a-zA-Z0-9._-]{1,64}$/.test(p.RESUME_VERSION || '') ||
      request.version !== p.RESUME_VERSION) throw Error('Invalid resume configuration or version');
  var file = DriveApp.getFileById(p.RESUME_FILE_ID);
  if (file.getSharingAccess() !== DriveApp.Access.PRIVATE || file.getMimeType() !== 'application/pdf' ||
      file.getSize() < 5 || file.getSize() > 1048576) throw Error('Resume must be a private PDF of at most 1 MiB');
  var blob = file.getBlob(), bytes = blob.getBytes();
  if (blob.getContentType() !== 'application/pdf' || bytes.length < 5 || bytes.length > 1048576 ||
      bytes.length !== file.getSize() || [37,80,68,70,45].some(function (value, index) { return bytes[index] !== value; })) throw Error('Invalid resume bytes');
  var result = { ok: true, available: true, version: p.RESUME_VERSION, mimeType: 'application/pdf', size: bytes.length };
  if (request.action === 'resume/read') result.pdfBase64 = Utilities.base64Encode(bytes);
  return result;
}

function doPost(e) {
  var p, envelope;
  try {
    p = properties_();
    if (!e || !e.postData || e.postData.contents.length > 24000) throw Error('Bad request');
    envelope = JSON.parse(e.postData.contents);
    if (!Number.isSafeInteger(envelope.timestamp) || Math.abs(Date.now() - envelope.timestamp) > 300000 ||
        !/^[a-f0-9-]{36}$/i.test(envelope.nonce || '') || typeof envelope.payload !== 'string' || envelope.payload.length > 20000 ||
        !equal_(hmac_(envelope.timestamp + '\n' + envelope.nonce + '\n' + envelope.payload, p.BRIDGE_SECRET), envelope.signature)) throw Error('Unauthorized');
    var lead = JSON.parse(envelope.payload);
    if (!lead || !lead.action) validateLead_(lead);
    else if (['resume/check', 'resume/read'].indexOf(lead.action) < 0) throw Error('Unknown action');
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) throw Error('Busy');
    try {
      var book = SpreadsheetApp.openById(p.SHEET_ID);
      var nonces = sheet_(book, 'Replay', ['nonce', 'acceptedAt']);
      var now = Date.now();
      var nonceRows = nonces.getLastRow() > 1 ? nonces.getRange(2, 1, nonces.getLastRow() - 1, 2).getValues() : [];
      if (nonceRows.some(function (r) { return r[0] === envelope.nonce; })) throw Error('Replay');
      // Only authenticated requests enter this log. Prune timestamps beyond the accepted replay window.
      for (var n = nonceRows.length - 1; n >= 0; n--) if (Number(nonceRows[n][1]) < now - 600000) nonces.deleteRow(n + 2);
      nonces.appendRow([envelope.nonce, now]);
      if (lead.action) return response_(privateResume_(lead, p), envelope.nonce, p.BRIDGE_SECRET);
      var sheet = sheet_(book, 'Leads', HEADERS);
      var rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues() : [];
      var fingerprintFields = [lead.name, lead.email, lead.company, lead.purpose, lead.message, lead.consent];
      // Bind the required phone number to this request ID.
      fingerprintFields.push(lead.phone);
      var fingerprint = hmac_(JSON.stringify(fingerprintFields), p.BRIDGE_SECRET);
      var existing = rows.filter(function (r) { return r[0] === lead.idempotencyKey; })[0];
      if (existing) {
        if (!equal_(String(existing[2]), fingerprint)) throw Error('Idempotency conflict');
        return response_({ ok: true, saved: true, idempotencyKey: lead.idempotencyKey }, envelope.nonce, p.BRIDGE_SECRET);
      }
      var emailHash = hmac_(lead.email.toLowerCase(), p.BRIDGE_SECRET);
      var recent = rows.filter(function (r) { return Number(r[1]) > now - 3600000; });
      if (recent.filter(function (r) { return r[3] === emailHash; }).length >= 3 || recent.filter(function (r) { return r[4] === lead.ipHash; }).length >= 10 || recent.length >= 100) throw Error('Rate limited');
      sheet.appendRow([lead.idempotencyKey, now, fingerprint, emailHash, lead.ipHash, literal_(lead.name), literal_(lead.email), literal_(lead.company), lead.purpose, literal_(lead.message), true, 'pending', 'pending', 0, 0, now, now, now, now, literal_(lead.notification.subject), literal_(lead.notification.message), lead.phone ? "'" + lead.phone : '']);
      SpreadsheetApp.flush(); // Durable storage is the success boundary. Mail is asynchronous.
      return response_({ ok: true, saved: true, idempotencyKey: lead.idempotencyKey }, envelope.nonce, p.BRIDGE_SECRET);
    } finally { try { SpreadsheetApp.flush(); } finally { lock.releaseLock(); } }
  } catch (error) {
    if (p && envelope && envelope.nonce) return response_({ ok: false, saved: false, error: 'Request rejected or storage unavailable' }, envelope.nonce, p.BRIDGE_SECRET);
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized or unavailable' })).setMimeType(ContentService.MimeType.JSON);
  }
}

/** Explicit owner setup: creates private tabs and ONE five-minute queue trigger. This enables real mail. */
function setup() {
  var p = properties_(), book = SpreadsheetApp.openById(p.SHEET_ID);
  sheet_(book, 'Leads', HEADERS); sheet_(book, 'Replay', ['nonce', 'acceptedAt']);
  var exists = ScriptApp.getProjectTriggers().some(function (trigger) { return trigger.getHandlerFunction() === 'processNotifications'; });
  if (!exists) ScriptApp.newTrigger('processNotifications').timeBased().everyMinutes(5).create();
}

/** Delivery is best effort, NOT exactly-once. A send exception or interrupted sending state requires owner review. */
function processNotifications() {
  var p = properties_(), lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    var sheet = SpreadsheetApp.openById(p.SHEET_ID).getSheetByName('Leads');
    if (!sheet || sheet.getLastRow() < 2) return;
    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
    var started = Date.now(), processed = 0;
    for (var i = 0; i < rows.length && processed < 8 && Date.now() - started < 180000; i++) {
      for (var side = 0; side < 2 && processed < 8; side++) {
        var row = rows[i], stateCol = 11 + side, attemptsCol = 13 + side, nextCol = 15 + side, updatedCol = 17 + side;
        var state = row[stateCol], now = Date.now();
        if (state === 'sending' && now - Number(row[updatedCol]) > 600000) {
          sheet.getRange(i + 2, stateCol + 1).setValue('needs_review'); continue;
        }
        if (['pending', 'deferred'].indexOf(state) < 0 || Number(row[nextCol]) > now) continue;
        if (Number(row[attemptsCol]) >= 8) { sheet.getRange(i + 2, stateCol + 1).setValue('failed'); continue; }
        processed++;
        var attempt = Number(row[attemptsCol]) + 1;
        sheet.getRange(i + 2, attemptsCol + 1).setValue(attempt);
        sheet.getRange(i + 2, updatedCol + 1).setValue(now);
        if (MailApp.getRemainingDailyQuota() < 1) {
          sheet.getRange(i + 2, stateCol + 1).setValue('deferred');
          sheet.getRange(i + 2, nextCol + 1).setValue(now + Math.min(24 * 3600000, Math.pow(2, attempt) * 15 * 60000));
          continue;
        }
        sheet.getRange(i + 2, stateCol + 1).setValue('sending');
        SpreadsheetApp.flush();
        try {
          if (side === 0) MailApp.sendEmail({ to: p.OWNER_EMAIL, replyTo: String(row[6]), subject: 'Portfolio enquiry: ' + (row[8] === 'consulting' ? 'Consulting Services' : row[8]), body: 'Name: ' + row[5] + '\nEmail: ' + row[6] + '\nPhone: ' + (String(row[21] || '').replace(/^'/, '') || 'Not provided') + '\nCompany: ' + row[7] + '\nPurpose: ' + (row[8] === 'consulting' ? 'Consulting Services' : row[8]) + '\n\n' + row[9] + '\n\nRecord: ' + row[0] });
          else MailApp.sendEmail({ to: String(row[6]), replyTo: p.OWNER_EMAIL, subject: String(row[19]), body: String(row[20]), name: 'Ujjwal Kumar' });
          sheet.getRange(i + 2, stateCol + 1).setValue('sent');
          sheet.getRange(i + 2, updatedCol + 1).setValue(Date.now());
          SpreadsheetApp.flush();
        } catch (error) {
          // It is unknowable whether Google accepted a send before an exception. Never automatically resend it.
          sheet.getRange(i + 2, stateCol + 1).setValue('needs_review');
          SpreadsheetApp.flush();
        }
      }
    }
  } finally { try { SpreadsheetApp.flush(); } finally { lock.releaseLock(); } }
}
