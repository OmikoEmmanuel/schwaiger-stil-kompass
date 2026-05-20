# Meta Tracking Setup

## Was eingebaut ist

- Cookie-Banner mit `Marketing erlauben` und `Nur notwendig`.
- Meta Pixel wird erst nach Marketing-Einwilligung geladen.
- Browser-Events:
  - `PageView` nach Marketing-Einwilligung
  - `ViewContent` beim Quiz-Start
  - `ViewContent` beim Ergebnis-Screen
  - `Lead` nach erfolgreichem LeadTable-Submit
- CAPI-Forwarding an einen Serverless-Endpunkt, mit derselben `event_id` wie der Browser-Pixel.
- Open-Graph-Tags für Facebook/WhatsApp-Vorschau.

## Noch einzutragen in `index.html`

```js
const META_PIXEL_ID = "986019473814008";
const META_CAPI_ENDPOINT = "https://dein-worker.example.workers.dev";
```

Solange `META_CAPI_ENDPOINT` leer bleibt, feuert nur der Browser-Pixel. Das ist fuer GitHub Pages okay. CAPI braucht spaeter einen Server/Endpoint, weil der Meta Access Token geheim bleiben muss.

## Pixel frisch aufsetzen

1. In Meta Events Manager eine neue Datenquelle vom Typ Website anlegen.
2. Pixel-ID kopieren und in `META_PIXEL_ID` eintragen.
3. Domain verifizieren, falls Meta das fuer Kampagnenoptimierung fordert.
4. Im Events Manager unter Test Events die Seite öffnen und Marketing-Cookies erlauben.
5. Prüfen, ob `PageView`, `ViewContent` und nach Test-Lead `Lead` erscheinen.

## CAPI über Serverless Endpoint

`meta-capi-worker.js` ist ein Worker-Template. Secrets gehören in Cloudflare, nicht in GitHub Pages.

Cloudflare ist nur eine einfache Serverless-Option. Wenn kein Cloudflare vorhanden ist, kann derselbe Zweck auch ueber Vercel Functions, Netlify Functions, Make, Zapier oder einen eigenen Server geloest werden. Wichtig ist nur: Der Access Token darf nie im Frontend liegen.

Benötigte Worker-Variablen:

```text
META_PIXEL_ID=...
META_ACCESS_TOKEN=...
ALLOWED_ORIGIN=https://deine-domain.at
META_GRAPH_VERSION=v21.0
META_TEST_EVENT_CODE=TEST563   optional, nur fuer Test Events
```

Der Worker nimmt Browser-Events entgegen, ergänzt IP/User-Agent serverseitig, hasht E-Mail/Telefon/Postleitzahl und sendet an Meta Conversions API.

## Wichtig

- `eventID` im Browser und `event_id` im Server-Event müssen gleich bleiben. Das ist für Deduplizierung bereits eingebaut.
- CAPI-Token niemals in `index.html` oder ein öffentliches Repo schreiben.
- Nach dem Test `META_TEST_EVENT_CODE` wieder entfernen, sonst bleiben CAPI-Events als Test markiert.

## Testcode `TEST563`

Der aktuelle Meta-Testcode lautet:

```text
TEST563
```

Fuer den Browser-Pixel muss dieser Code normalerweise nicht in `index.html` eingetragen werden. Browser-Pixel-Events erscheinen im Events Manager unter Test Events, wenn die Live-URL dort getestet wird und auf der Seite Marketing-Cookies erlaubt wurden.

Fuer CAPI gehoert `TEST563` als Worker-Variable `META_TEST_EVENT_CODE` in den Serverless-Endpoint.
