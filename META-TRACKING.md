# Meta Tracking Setup

## Aktueller Stand

- Meta Pixel-ID: `986019473814008`.
- Consent-Banner ist aktiv.
- Meta Pixel wird erst geladen, wenn der Nutzer `Marketing erlauben` klickt.
- `PageView` feuert erst nach Marketing-Consent.
- `ViewContent` feuert nach Consent beim Start des Stil-Kompasses und beim Ergebnis-Screen.
- `Lead` feuert erst nach erfolgreichem LeadTable-Submit und nur bei Marketing-Consent.
- Es gibt keinen `noscript`-Pixel-Fallback, damit kein Tracking vor Consent ausgelöst wird.
- Open-Graph-Tags fuer Facebook/WhatsApp-Vorschau sind in `index.html` enthalten.

## Wichtige Hinweise

- Der LeadTable-Submit bleibt unabhängig vom Marketing-Consent; die Kontakt-Einwilligung im Formular ist separat.
- `meta-capi-worker.js` bleibt als optionales Serverless-Template im Repo, ist aber aktuell nicht mit der HTML verbunden.
- CAPI braucht einen geheimen Meta Access Token und darf nicht direkt im Frontend/GitHub Pages liegen.

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
2. Cookie-Banner mit `Marketing erlauben` akzeptieren.
3. Prüfen, ob `PageView` erscheint.
4. Stil-Kompass starten und Ergebnis erreichen.
5. Prüfen, ob `ViewContent` erscheint.
6. Test-Lead absenden.
7. Prüfen, ob `Lead` erscheint.
