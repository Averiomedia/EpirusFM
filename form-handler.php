<?php
/* ============================================================
   Epirus FM – Formular-Handler für All-Inkl (PHP)
   Ersetzt Netlify Forms. Nimmt alle Website-Formulare entgegen,
   prüft Honeypot + Mindestverweildauer und mailt an info@.
   Antwort: JSON bei Fetch (Chat) bzw. Redirect (?anfrage=ok).
   ============================================================ */
mb_internal_encoding('UTF-8');

$ZIEL = 'info@epirusfm.de';
$ABSENDER_NAME = 'Epirus Website';
$ABSENDER_MAIL = 'info@epirusfm.de';

function antwort($ok, $referer) {
    $wantsJson = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
        || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok]);
        exit;
    }
    $ziel = $referer ? strtok($referer, '?') : 'index.html';
    $sep = (strpos($ziel, '?') === false) ? '?' : '&';
    header('Location: ' . $ziel . $sep . 'anfrage=' . ($ok ? 'ok' : 'fehler'));
    exit;
}

$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    antwort(false, $referer);
}

// 1. Honeypot (botprotect.js legt Feld "website" an)
if (!empty($_POST['website'])) {
    antwort(false, $referer);
}

// 2. Mindestverweildauer 3 s (botprotect.js setzt "_loaded")
$geladen = isset($_POST['_loaded']) ? (int) $_POST['_loaded'] : 0;
if ($geladen > 0 && (int) (microtime(true) * 1000) - $geladen < 3000) {
    antwort(false, $referer);
}

// 3. Eingeweihte Felder einsammeln (Steuerfelder auslassen)
$skip = ['website', '_loaded', 'form-name'];
$felder = [];
foreach ($_POST as $k => $v) {
    if (in_array($k, $skip, true)) continue;
    $v = is_array($v) ? implode(', ', $v) : (string) $v;
    $v = trim(strip_tags($v));
    if ($v === '') continue;
    $felder[$k] = mb_substr($v, 0, 2000);
}
if (count($felder) === 0) {
    antwort(false, $referer);
}

// 4. E-Mail bauen
$formular = isset($_POST['form-name']) ? preg_replace('/[^a-z0-9\-_]/i', '', (string) $_POST['form-name']) : 'website';
$betreff = '[Website] ' . $formular . ' – ' . date('d.m.Y H:i');
$zeilen = ['Neue Anfrage über: ' . $formular, 'Zeit: ' . date('d.m.Y H:i:s'), ''];
$replyAntwort = '';
foreach ($felder as $k => $v) {
    $label = ucfirst(str_replace(['-', '_'], ' ', $k));
    $zeilen[] = $label . ': ' . $v;
    if ($k === 'email' && filter_var($v, FILTER_VALIDATE_EMAIL)) {
        $replyAntwort = $v;
    }
}
$nachricht = implode("\n", $zeilen);

$kopf = 'From: ' . $ABSENDER_NAME . ' <' . $ABSENDER_MAIL . ">\r\n"
      . 'Reply-To: ' . ($replyAntwort !== '' ? $replyAntwort : $ABSENDER_MAIL) . "\r\n"
      . 'Content-Type: text/plain; charset=utf-8' . "\r\n"
      . 'X-Mailer: Epirus-Form-Handler';

$ok = @mail($ZIEL, '=?UTF-8?B?' . base64_encode($betreff) . '?=', $nachricht, $kopf);
antwort($ok, $referer);
