const META_ENDPOINT_BASE = "https://graph.facebook.com";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return corsResponse(null, env, 204);
    }

    if (request.method !== "POST") {
      return corsResponse({ error: "Method not allowed" }, env, 405);
    }

    const origin = request.headers.get("Origin") || "";
    if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
      return corsResponse({ error: "Origin not allowed" }, env, 403);
    }

    if (!env.META_PIXEL_ID || !env.META_ACCESS_TOKEN) {
      return corsResponse({ error: "Meta environment is missing" }, env, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse({ error: "Invalid JSON" }, env, 400);
    }

    const eventName = cleanString(body.event_name);
    const eventId = cleanString(body.event_id);
    const eventSourceUrl = cleanString(body.event_source_url);

    if (!eventName || !eventId || !eventSourceUrl) {
      return corsResponse({ error: "Missing event_name, event_id or event_source_url" }, env, 400);
    }

    const userData = body.user_data || {};
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl,
          action_source: "website",
          user_data: {
            client_ip_address: request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "",
            client_user_agent: request.headers.get("User-Agent") || "",
            fbp: cleanString(userData.fbp),
            fbc: cleanString(userData.fbc),
            em: await sha256Lower(userData.em),
            ph: await sha256Phone(userData.ph),
            zp: await sha256Lower(userData.zp)
          },
          custom_data: body.custom_data || {}
        }
      ]
    };

    if (env.META_TEST_EVENT_CODE) {
      payload.test_event_code = env.META_TEST_EVENT_CODE;
    }

    const graphVersion = env.META_GRAPH_VERSION || "v21.0";
    const metaUrl = `${META_ENDPOINT_BASE}/${graphVersion}/${env.META_PIXEL_ID}/events?access_token=${encodeURIComponent(env.META_ACCESS_TOKEN)}`;
    const metaResponse = await fetch(metaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await metaResponse.json().catch(() => ({}));
    return corsResponse(result, env, metaResponse.ok ? 200 : metaResponse.status);
  }
};

function corsResponse(payload, env, status = 200) {
  const headers = {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(payload), { status, headers });
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function sha256Lower(value) {
  const normalized = cleanString(value).toLowerCase();
  if (!normalized) return "";
  return sha256(normalized);
}

async function sha256Phone(value) {
  const normalized = cleanString(value).replace(/[^\d+]/g, "");
  if (!normalized) return "";
  return sha256(normalized);
}

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
