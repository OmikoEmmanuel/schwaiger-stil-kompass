# Meta Tracking Setup

## Aktueller Stand

- Meta Pixel-ID: `986019473814008`.
- Microsoft Clarity Projekt-ID: `wu7xvjc5a7`.
- Cookie-Consent-Banner wurde entfernt.
- Meta Pixel und Microsoft Clarity werden direkt beim Seitenaufruf geladen.
- `PageView` feuert direkt beim Seitenaufruf.
- `ViewContent` feuert beim Start des Stil-Kompasses und beim Ergebnis-Screen.
- `Lead` feuert nach erfolgreichem LeadTable-Submit.
- Es gibt keinen `noscript`-Pixel-Fallback.
- Open-Graph-Tags fuer Facebook/WhatsApp-Vorschau sind in `index.html` enthalten.

## Wichtige Hinweise

- Die Kontakt-Einwilligung im Formular ist separat vom entfernten Cookie-Consent.
- `meta-capi-worker.js` bleibt als optionales Serverless-Template im Repo, ist aber aktuell nicht mit der HTML verbunden.
- CAPI braucht einen geheimen Meta Access Token und darf nicht direkt im Frontend/GitHub Pages liegen.
- Microsoft Clarity wird zusammen mit Meta Pixel beim Seitenaufruf initialisiert.

## Events

```text
PageView
ViewContent
Lead
```

`Lead` wird nach erfolgreicher LeadTable-Antwort getrackt, zusammen mit:

```js
{
  content_name: latestResultProfile?.title || "Schwaiger Stil-Kompass",
  content_category: "Stil-Kompass",
  lead_type: latestResultState?.band || "",
  status: "lead_submitted",
  postal_code: values.postalCode || ""
}
```

## Test

1. Live-URL im Meta Events Manager unter **Test Events** öffnen.
2. Prüfen, ob `PageView` erscheint.
3. Stil-Kompass starten und Ergebnis erreichen.
4. Prüfen, ob `ViewContent` erscheint.
5. Test-Lead absenden.
6. Prüfen, ob `Lead` erscheint.
7. Live-URL im Microsoft-Clarity-Projekt öffnen und nach einigen Minuten prüfen, ob Daten für Projekt `wu7xvjc5a7` eingehen.
