# Meta Tracking Setup

## Aktueller Stand

- Meta Pixel ist direkt in `index.html` eingebaut.
- Pixel-ID: `986019473814008`.
- `PageView` feuert beim Seitenaufruf.
- `Lead` feuert erst nach erfolgreichem LeadTable-Submit.
- `noscript`-Fallback fuer `PageView` ist direkt nach `<body>` eingebaut.
- Open-Graph-Tags fuer Facebook/WhatsApp-Vorschau sind in `index.html` enthalten.

## Wichtige Hinweise

- Aktuell gibt es keinen Consent-Banner in der HTML. Wenn Tracking erst nach Einwilligung laden soll, muss ein Consent-Layer nachgeruestet werden.
- `meta-capi-worker.js` bleibt als optionales Serverless-Template im Repo, ist aber aktuell nicht mit der HTML verbunden.
- CAPI braucht einen geheimen Meta Access Token und darf nicht direkt im Frontend/GitHub Pages liegen.

## Events

```text
PageView
Lead
```

`Lead` wird nach erfolgreicher LeadTable-Antwort getrackt, zusammen mit:

```js
{
  content_name: latestResultProfile?.title || "Schwaiger Stil-Kompass",
  content_category: "Stil-Kompass",
  lead_type: latestResultState?.band || ""
}
```

## Test

1. Live-URL im Meta Events Manager unter **Test Events** öffnen.
2. Prüfen, ob `PageView` erscheint.
3. Test-Lead absenden.
4. Prüfen, ob `Lead` erscheint.
