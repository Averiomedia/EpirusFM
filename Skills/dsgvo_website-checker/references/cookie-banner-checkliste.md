# Cookie-Banner Detailanforderungen (DSK OH Digitale Dienste v1.2, Nov. 2024)

## Grundanforderungen (TDDDG § 25 + DSGVO Art. 6/7)

### Was muss VOR dem Banner gesperrt sein?
Folgendes darf NICHT laden, bevor der Nutzer aktiv einwilligt:
- Google Analytics / GTM
- Meta Pixel / alle Marketing-Pixel
- YouTube-Videos (Standardeinbindung)
- Google Maps (Standard)
- Hotjar, Clarity und ähnliche Session-Tools
- Externe Fonts (Google Fonts remote)
- Social Media Buttons mit direkter Datenübertragung

### Was darf OHNE Banner laden?
- Eigene, technisch notwendige Session-Cookies
- Login-Cookies nach aktivem Login
- Warenkorb-Cookies nach aktivem Produkthinzufügen
- CSRF-Tokens
- Sprachauswahl (wenn vom Nutzer verändert)
- Consent-Status-Cookie (nur ja/nein, keine UID!)

**Achtung neu (OH v1.2):** CMP-eigene Cookies (z.B. Borlabs, Usercentrics) mit UID sind ebenfalls einwilligungspflichtig. CMPs müssen so konfiguriert werden, dass sie selbst keine UIDs ohne Einwilligung setzen.

---

## Gestaltungsanforderungen

### Gleichwertigkeit (Dark Patterns verboten)

**✅ Erlaubt:**
- „Alle akzeptieren" und „Alle ablehnen" auf gleicher Ebene, gleiche Farbe, gleicher Aufwand
- Oder: „Alle akzeptieren" und „Nur notwendige" auf gleicher Ebene

**❌ Verboten:**
- „Ablehnen" nur auf zweiter Ebene (z.B. über „Einstellungen")
- Ablehnen-Button deutlich kleiner oder weniger sichtbar
- Voreingestellte Häkchen für Tracking-Kategorien
- Irreführende Formulierungen (z.B. „Ich bin einverstanden" ohne klares Ablehnen)
- Unnötige Klicks bis zur Ablehnung vs. 1 Klick für Akzeptieren

### Inhalt des Banners (Mindestangaben erste Ebene)
- Zweck der Verarbeitung (kurz und verständlich)
- Welche Kategorien von Cookies/Diensten
- Link zur vollständigen Datenschutzerklärung
- Link zum Impressum (muss stets sichtbar bleiben!)
- Möglichkeit zur Ablehnung auf erster Ebene

### Inhalt zweiter Ebene (detaillierte Einstellungen)
- Auflistung aller Kategorien mit Beschreibung
- Auflistung einzelner Dienste mit Anbieter und Zweck
- Möglichkeit zur Granular-Einwilligung (pro Kategorie)
- Hinweis auf Drittstaatentransfer pro Dienst

---

## Empfohlene CMP-Tools (Consent Management Platforms)

| Tool | Preis | Besonderheit |
|---|---|---|
| Borlabs Cookie (WP) | ~39€/Jahr | Sehr verbreitet, gut konfigurierbar |
| Real Cookie Banner (WP) | ~59€/Jahr | Starke DSGVO-Ausrichtung |
| Usercentrics | ab ~8€/Monat | Enterprise-Lösung, sehr vollständig |
| Cookiebot | ab ~9€/Monat | Automatisches Scanning |
| Consentmanager | ab ~12€/Monat | Flexibel, für Agenturen |
| klaro! | kostenlos (Open Source) | Für statische Seiten geeignet |

**Für statische Websites (GitHub Pages, HTML):**
- klaro.js (Open Source, konfigurierbar)
- Cookie-Consent von insites (Open Source)
- Manuelle Implementierung mit Consent-Logik

---

## Widerruf und Einwilligungsverwaltung

### Pflichten nach Einwilligung:
- Jederzeit widerrufbar (Art. 7 Abs. 3 DSGVO)
- Widerruf muss genauso einfach sein wie Einwilligung
- **Sichtbarer Link im Footer:** „Cookie-Einstellungen ändern" oder ähnlich

### Consent-Logging:
- Zeitstempel der Einwilligung
- Welche Kategorien wurden eingewilligt
- Version des Banners / der Datenschutzerklärung
- IP-Adresse oder User-Agent (zur Nachweisbarkeit)
- Mindestens 3 Jahre aufbewahren
- Auf EU-Servern speichern

### Erneuerung:
- Spätestens alle 12 Monate erneute Einwilligung einholen
- Bei Änderung der verarbeiteten Dienste sofort neuen Consent einholen

---

## Neue Entwicklung: PIMS (seit 01.04.2025)

Die Einwilligungsverwaltungsverordnung (EinwV) ist seit 01.04.2025 in Kraft. Sie regelt sogenannte Personal Information Management Services (PIMS):

- Nutzer können Einwilligungen zentral und browserübergreifend verwalten
- Anerkannte PIMS können den klassischen Cookie-Banner ersetzen
- Erste anerkannte PIMS sind noch in Entwicklung/Zertifizierung
- Relevanz für Website-Betreiber: Zunächst gering, da noch keine PIMS flächendeckend verfügbar

**Praxistipp 2025:** Klassischen Cookie-Banner weiterbetreiben und PIMS-Entwicklungen beobachten.

---

## Häufige Banner-Fehler und Bußgelder

| Fehler | Konsequenz | Beispiel |
|---|---|---|
| Kein Ablehnen auf Ebene 1 | Bis 300.000 € TDDDG | Microsoft Bing: 60 Mio. € (Frankreich) |
| Analytics ohne Einwilligung | Bis 20 Mio. € DSGVO | Google Analytics-Abmahnwelle DE |
| Vorausgefüllte Häkchen | Abmahnung + Bußgeld | – |
| Kein Consent-Log | Beweislastproblem | – |
| Cookie-Banner verdeckt Impressum | UWG-Abmahnung | – |
| Google Fonts remote | Abmahnung (LG München) | Abmahnwelle 2022 |
