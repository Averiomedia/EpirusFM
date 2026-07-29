# Drittstaatentransfer: USA-Dienste & internationale Datenübertragung

## Rechtslage (Stand 2025)

### EU-US Data Privacy Framework (DPF) – seit Juli 2023
- Neuer Angemessenheitsbeschluss nach Schrems II-Urteil (2020)
- US-Unternehmen können sich DPF-zertifizieren lassen
- Zertifizierte Unternehmen dürfen EU-Daten ohne weitere Schutzmaßnahmen empfangen
- **Liste prüfen:** https://www.dataprivacyframework.gov/list

**Achtung:** Das DPF ist politisch umstritten und könnte erneut vom EuGH gekippt werden. Als Backup-Lösung sollten SCCs vorhanden sein.

### Standardvertragsklauseln (SCC)
- Von der EU-Kommission genehmigte Vertragsklauseln
- Gelten als geeignete Garantie (Art. 46 DSGVO)
- Müssen mit US-Auftragsverarbeitern abgeschlossen werden, wenn kein Angemessenheitsbeschluss vorliegt
- Seit 2021: Neue SCC-Version verpflichtend
- Ergänzt durch Transfer Impact Assessment (TIA)

### Angemessenheitsbeschlüsse für andere Länder
Länder, für die ein Angemessenheitsbeschluss vorliegt (kein Zusatzaufwand nötig):
- UK (nach Brexit eigener Beschluss)
- Schweiz
- Japan, Südkorea, Neuseeland, Kanada (kommerzieller Bereich), u.a.
- **Kein** Angemessenheitsbeschluss für: China, Russland, Indien (Vorsicht!)

## Dokumentation in der Datenschutzerklärung

Bei jedem eingesetzten US-Dienst muss die DSE enthalten:
1. Name des Dienstleisters und Sitz (z.B. "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland")
2. Hinweis auf mögliche Datenweitergabe in die USA
3. Rechtsgrundlage des Transfers (DPF-Zertifizierung ODER SCC)
4. Link zur Datenschutzrichtlinie des Dienstleisters
5. Möglichkeit zur DPF-Liste (optional, aber empfohlen)

### Musterformulierung für DSE (Google Analytics)
```
Diese Website verwendet Google Analytics 4, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Im Rahmen der Nutzung von Google Analytics können Daten in die USA übermittelt werden. Google LLC ist unter dem EU-US Data Privacy Framework (DPF) zertifiziert. Die Datenverarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Weitere Informationen finden Sie in der Datenschutzrichtlinie von Google: https://policies.google.com/privacy
```

## TikTok – Besonderes Risiko

TikTok (ByteDance) ist ein chinesischer Konzern. Für China besteht:
- **Kein** Angemessenheitsbeschluss
- Keine vollständige SCC-Absicherung möglich (chinesische Gesetze ermöglichen staatlichen Zugriff)
- Hohe Risiko-Bewertung durch Datenschutzbehörden
- **Empfehlung:** TikTok Pixel nur einsetzen, wenn dringende Notwendigkeit und ausführliche rechtliche Prüfung

## Schrems III – Ausblick

Das DPF könnte erneut vom EuGH gekippt werden (politische Entwicklungen in den USA unter Trump-Administration 2025 erhöhen dieses Risiko). Backup-Strategie:
1. SCC mit allen US-Anbietern abschließen (auch wenn DPF ausreicht)
2. Transfer Impact Assessment (TIA) dokumentieren
3. Datenschutzfreundliche EU-Alternativen evaluieren (Brevo statt Mailchimp, Hetzner statt AWS, etc.)

## Checkliste Drittstaatentransfer

- [ ] Alle eingesetzten Dienste auf Hauptsitz und Serverstandorte geprüft
- [ ] Für jeden Nicht-EU-Dienst: DPF-Zertifizierung oder SCC vorhanden?
- [ ] In Datenschutzerklärung für jeden Dienst der Transfer dokumentiert
- [ ] Verzeichnis der Verarbeitungstätigkeiten (VVT) aktualisiert
- [ ] AVV mit jedem Auftragsverarbeiter abgeschlossen (auch US-Anbieter)
