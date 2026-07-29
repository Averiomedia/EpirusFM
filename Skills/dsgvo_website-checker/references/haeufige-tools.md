# DSGVO-Status häufiger Website-Tools (Stand 2025)

## Analytics & Tracking

| Tool | Einwilligungspflicht | Drittstaatentransfer | Empfehlung |
|---|---|---|---|
| Google Analytics 4 | ✅ Ja (immer) | USA (DPF-zertifiziert) | Nur mit CMP + Consent |
| Google Tag Manager | ✅ Ja (lädt weitere Dienste) | USA (DPF-zertifiziert) | Nur mit CMP |
| Matomo (selbst gehostet) | ⚠️ Nur wenn UID-Cookies | Kein Drittstaatentransfer | Ohne UID-Cookies evtl. ohne Banner möglich |
| Matomo (Cloud) | ✅ Ja | Deutschland/EU möglich | Mit CMP |
| Plausible (selbst gehostet) | ❌ Nein | Kein | Cookiefrei, ohne Banner nutzbar |
| Plausible (Cloud) | ❌ Nein | EU (Estland) | Cookiefrei, ohne Banner nutzbar |
| Fathom | ❌ Nein | EU-Server verfügbar | Cookiefrei |
| Hotjar | ✅ Ja | USA (DPF-zertifiziert) | Nur mit CMP |
| Microsoft Clarity | ✅ Ja | USA (DPF-zertifiziert) | Nur mit CMP |

## Fonts

| Dienst | Problem | Lösung |
|---|---|---|
| Google Fonts (remote) | IP-Übertragung an Google-Server USA ohne Einwilligung | Lokal einbinden via google-webfonts-helper.herokuapp.com |
| Google Fonts (lokal) | ✅ Kein Problem | Standard-Lösung, empfohlen |
| Adobe Fonts (Typekit) | Einwilligungspflichtig wenn remote | Im CMP als externe Ressource deklarieren |
| System Fonts | ✅ Kein Problem | Datenschutzfreundlichste Option |

## Marketing & Pixel

| Tool | Einwilligungspflicht | Drittstaatentransfer | Hinweise |
|---|---|---|---|
| Meta Pixel / Facebook Pixel | ✅ Ja (immer) | USA (DPF-zertifiziert) | Nur nach Einwilligung laden |
| TikTok Pixel | ✅ Ja | USA / Singapur | Besonderes Risiko (chinesischer Konzern) |
| Pinterest Tag | ✅ Ja | USA (DPF-zertifiziert) | Nur nach Einwilligung |
| LinkedIn Insight Tag | ✅ Ja | USA (DPF-zertifiziert) | Nur nach Einwilligung |
| Google Ads Conversion | ✅ Ja | USA (DPF-zertifiziert) | Nur nach Einwilligung |

## E-Mail-Marketing

| Tool | AVV verfügbar | Drittstaatentransfer | Hinweise |
|---|---|---|---|
| Mailchimp | ✅ Ja | USA (DPF-zertifiziert) | In DSE dokumentieren |
| ActiveCampaign | ✅ Ja | USA (DPF-zertifiziert) | In DSE dokumentieren |
| Brevo (ehem. Sendinblue) | ✅ Ja | EU (Frankreich) | Datenschutzfreundlich, empfohlen |
| CleverReach | ✅ Ja | Deutschland | Sehr datenschutzfreundlich |
| Mailerlite | ✅ Ja | EU | In DSE dokumentieren |
| Systeme.io | ✅ Ja | Frankreich | In DSE dokumentieren |
| ConvertKit / Kit | ✅ Ja | USA (DPF-zertifiziert) | In DSE dokumentieren |

## Formulare

| Tool | AVV verfügbar | Drittstaatentransfer | Hinweise |
|---|---|---|---|
| Contact Form 7 (WP) | n/a (kein Dritter) | Kein (wenn Daten lokal) | Datenschutzhinweis am Formular nötig |
| Typeform | ✅ Ja | USA (DPF-zertifiziert) | In DSE erwähnen |
| Tally | ✅ Ja | EU/USA | In DSE erwähnen |
| Google Forms | ✅ Ja | USA (DPF-zertifiziert) | Nicht für sensible Daten empfohlen |
| JotForm | ✅ Ja | USA/EU verfügbar | In DSE erwähnen |

## Buchung & Kalender

| Tool | AVV verfügbar | Drittstaatentransfer | Hinweise |
|---|---|---|---|
| Calendly | ✅ Ja | USA (DPF-zertifiziert) | In DSE erwähnen |
| TidyCal | ✅ Ja | USA | In DSE erwähnen |
| Acuity Scheduling | ✅ Ja | USA (DPF-zertifiziert) | In DSE erwähnen |
| Cal.com (selbst gehostet) | n/a | Kein | Datenschutzfreundlichste Option |

## Videos

| Einbindung | Problem | Lösung |
|---|---|---|
| YouTube Standard | Setzt Cookies ohne Einwilligung | youtube-nocookie.com ODER via CMP laden |
| YouTube Nocookie-Modus | Reduziert Cookies, nicht cookies-frei | Immer noch im CMP deklarieren |
| Vimeo | Setzt Cookies | Via CMP laden |
| Direktes Video-Hosting | ✅ Kein Drittanbieter-Problem | Empfohlene Lösung für Datenschutz |

## Hosting

| Anbieter | AVV verfügbar | Standort | Hinweise |
|---|---|---|---|
| IONOS | ✅ Ja | Deutschland | Sehr empfohlen für deutsche Kunden |
| Hetzner | ✅ Ja | Deutschland | Sehr datenschutzfreundlich |
| All-Inkl | ✅ Ja | Deutschland | Gut für deutsche Kunden |
| Strato | ✅ Ja | Deutschland | Standard |
| GitHub Pages | ✅ Via GitHub AGB | USA (Microsoft, DPF) | In DSE erwähnen |
| Netlify | ✅ Ja | USA (DPF-zertifiziert) | In DSE erwähnen |
| Vercel | ✅ Ja | USA (DPF-zertifiziert) | In DSE erwähnen |
| WP Engine | ✅ Ja | USA/EU verfügbar | EU-Region wählen |

## Payment

| Tool | AVV verfügbar | Drittstaatentransfer | Hinweise |
|---|---|---|---|
| Stripe | ✅ Ja | USA (DPF-zertifiziert) | Standard, gut dokumentiert |
| PayPal | ✅ Ja | USA (DPF-zertifiziert) | Eigene Datenschutzrichtlinie relevant |
| Digistore24 | ✅ Ja | Deutschland | In DSE erwähnen |
| CopeCart | ✅ Ja | Deutschland | In DSE erwähnen |
| elopage | ✅ Ja | Deutschland | In DSE erwähnen |

## Social Media Widgets

| Einbindung | Problem | Lösung |
|---|---|---|
| Facebook Like-Button direkt | Überträgt sofort Daten | Shariff oder CMP-gesteuert |
| Instagram Feed (Drittanbieter) | Cookies und Datentransfer | Einwilligung via CMP |
| Twitter/X Einbettung | Cookies und Datentransfer | Einwilligung via CMP |
| Google Maps Standard | Cookies und Datentransfer | OpenStreetMap ODER via CMP |
| Google Maps (Maps JS API) | Einwilligungspflichtig | Via CMP laden |
