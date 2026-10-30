// Official M2M Freedom Market (https://m2mfreedom.com) zero-dependency client for ElizaOS & Autonomous AI Agents.
// Supports x402 v2/v1 (Base USDC & Solana USDC), L402 Bitcoin Lightning (Coinos / LNbits), Prepaid M2M Pass (0ms),
// Free-Trial mode (Oracle, Python Sandbox, Memory Vault), and dryRun pre-checks with strict per-call spend caps.

export const API_BASE = 'https://m2mfreedom.com';
export const DEFAULT_MAX_PRICE_USD = 0.25;

export const TOOLS = [
  {
    name: 'freedom_bitcoin_oracle_ping',
    actionName: 'FREEDOM_BITCOIN_ORACLE',
    path: '/api/v1/router/tools/oracle',
    method: 'POST',
    priceSats: 5,
    priceUsd: 0.005,
    freeTrialEligible: true,
    param: 'satsAmount',
    example: 100000,
    description:
      '5-Satoshi ($0.005 USDC) L402/x402 Icebreaker Handshake & Live Bitcoin Price Oracle (100/100 SLA). Returns live BTC/USD spot rate, Satoshi-to-USD conversion, and an HMAC-SHA256 cryptographic settlement proof. Supports 1 Free Trial call or free dryRun=true pre-check.'
  },
  {
    name: 'freedom_llm_inference',
    actionName: 'FREEDOM_LLM_INFERENCE',
    path: '/api/v1/router/tools/llm',
    method: 'POST',
    priceSats: 10,
    priceUsd: 0.0094,
    freeTrialEligible: false,
    param: 'prompt',
    example: 'Explain HTTP 402 and L402 Lightning in 2 sentences.',
    description:
      'Ultra-Fast OpenAI-Compatible LLM Inference Gateway (10 Sats / $0.0094 USDC | ~500 tokens/sec | 100/100 SLA Atomic Protection). Powered by openai/gpt-oss-120b, openai/gpt-oss-20b, and qwen/qwen3.8-27b. Also available at POST /v1/chat/completions. Supports free dryRun=true pre-check.'
  },
  {
    name: 'freedom_captcha_solver',
    actionName: 'FREEDOM_SOLVE_CAPTCHA',
    path: '/api/v1/router/tools/captcha',
    method: 'POST',
    priceSats: 90,
    priceUsd: 0.085,
    freeTrialEligible: false,
    param: 'websiteURL',
    example: 'https://example.com/login',
    description:
      '9-in-1 High-Speed CAPTCHA Solver for Autonomous Agents (55-130 Sats / $0.052-$0.122 USDC | 100/100 SLA Atomic Protection — zero charge if upstream fails). Solves Cloudflare Turnstile, Google reCAPTCHA v2/v3/Enterprise, hCaptcha, Arkose FunCaptcha, AWS WAF, GeeTest v3/v4, and Image/Text OCR.'
  },
  {
    name: 'freedom_stealth_unlocker',
    actionName: 'FREEDOM_STEALTH_UNLOCKER',
    path: '/api/v1/router/tools/stealth',
    method: 'POST',
    priceSats: 120,
    priceUsd: 0.113,
    freeTrialEligible: false,
    param: 'url',
    example: 'https://news.ycombinator.com',
    description:
      'Stealth Anti-Bot Web Unlocker (120 Sats / $0.113 USDC | 100/100 SLA). Multi-profile browser header rotation (Chrome/Safari/Firefox) that unlocks bot-protected pages into clean LLM-ready Markdown, OpenGraph metadata, and extracted JSON-LD.'
  },
  {
    name: 'freedom_clean_scraper',
    actionName: 'FREEDOM_CLEAN_SCRAPER',
    path: '/api/v1/router/tools/scrape',
    method: 'POST',
    priceSats: 40,
    priceUsd: 0.038,
    freeTrialEligible: false,
    param: 'url',
    example: 'https://example.com',
    description:
      'Clean Markdown Web Scraper (40 Sats / $0.038 USDC | 100/100 SLA). Strips scripts, ads, and navigation clutter from any public URL and returns token-efficient Markdown for LLM context windows.'
  },
  {
    name: 'freedom_python_sandbox',
    actionName: 'FREEDOM_PYTHON_SANDBOX',
    path: '/api/v1/router/tools/python',
    method: 'POST',
    priceSats: 60,
    priceUsd: 0.057,
    freeTrialEligible: true,
    param: 'code',
    example: 'import math; result = round(math.pi * (12.5 ** 2), 4)',
    description:
      'Isolated AST Python 3 Math & Quantitative Sandbox (60 Sats / $0.057 USDC | <50ms latency | 100/100 SLA). Executes deterministic math, statistical, and financial Python expressions inside an AST-validated sandbox. Supports 1 Free Trial call.'
  },
  {
    name: 'freedom_structured_extractor',
    actionName: 'FREEDOM_STRUCTURED_EXTRACTOR',
    path: '/api/v1/router/tools/extract',
    method: 'POST',
    priceSats: 85,
    priceUsd: 0.08,
    freeTrialEligible: false,
    param: 'url',
    example: 'https://en.wikipedia.org/wiki/Bitcoin',
    description:
      'Structured HTML Table, Links & Financial JSON Extractor + Live BTC Context (85 Sats / $0.080 USDC | 100/100 SLA). Extracts HTML tables into JSON rows, headings, hyperlinks, and regex-detected financial figures/tickers.'
  },
  {
    name: 'freedom_agent_memory',
    actionName: 'FREEDOM_AGENT_MEMORY',
    path: '/api/v1/router/tools/memory',
    method: 'POST',
    priceSats: 25,
    priceUsd: 0.024,
    freeTrialEligible: true,
    param: 'namespace',
    example: 'eliza-agent-default',
    description:
      'Persistent SQLite Key-Value Memory Vault for Autonomous AI Agents (25 Sats / $0.024 USDC | up to 16 KB per key | 100/100 SLA). Supports store, recall, list, and delete across agent sessions. Supports 1 Free Trial call.'
  },
  {
    name: 'freedom_clearinghouse_orderbook',
    actionName: 'FREEDOM_HIRE_AGENT_CLEARINGHOUSE',
    path: '/api/v1/market/open',
    method: 'GET',
    priceSats: 0,
    priceUsd: 0,
    freeTrialEligible: true,
    param: 'mode',
    example: 'list_open',
    description:
      'M2M Task Clearinghouse, Verified Worker Directory & Escrow Orderbook (100/100 SLA). Browse open task bounties (mode="list_open", free), list certified worker agents (mode="list_workers", free), inspect live SLA telemetry (mode="get_sla", free), or hire a verified worker / post a bounty into escrow (mode="hire" or "post_bounty", min 150 Sats, 25% clearinghouse fee).'
  }
];

export const BY_NAME = Object.fromEntries(TOOLS.map((t) => [t.name, t]));
export const BY_ACTION = Object.fromEntries(TOOLS.map((t) => [t.actionName, t]));

function decodeBase64Json(b64) {
  try {
    const raw =
      typeof Buffer !== 'undefined'
        ? Buffer.from(String(b64).trim(), 'base64').toString('utf8')
        : new TextDecoder().decode(Uint8Array.from(atob(String(b64).trim()), (c) => c.charCodeAt(0)));
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getHeader(headers, key) {
  if (!headers) return null;
  if (typeof headers.get === 'function') {
    return headers.get(key) || headers.get(key.toLowerCase()) || headers.get(key.toUpperCase());
  }
  return headers[key] ?? headers[key.toLowerCase()] ?? headers[key.toUpperCase()] ?? null;
}

/**
 * Parses both x402 (v2 header / v1 body) and L402 (WWW-Authenticate / body.l402) payment terms from an HTTP 402 response.
 */
export function parsePaymentRequired(headers, body) {
  const payReqHeader = getHeader(headers, 'payment-required');
  const wwwAuth = getHeader(headers, 'www-authenticate') || '';
  const decodedHeader = payReqHeader ? decodeBase64Json(payReqHeader) : null;
  const b = body && typeof body === 'object' ? body : {};
  const accepts = decodedHeader?.accepts || b.accepts || b.x402?.accepts || [];

  const options = accepts.map((a) => {
    const atomic = Number(a.amount ?? a.maxAmountRequired);
    return {
      scheme: a.scheme || 'exact',
      network: a.network,
      price_usd: Number.isFinite(atomic) ? Number((atomic / 1e6).toFixed(6)) : null,
      amount_atomic: String(a.amount ?? a.maxAmountRequired ?? ''),
      pay_to: a.payTo,
      asset: a.asset
    };
  });

  const macMatch = wwwAuth.match(/macaroon="([^"]+)"/i);
  const invMatch = wwwAuth.match(/invoice="([^"]+)"/i);
  const l402Macaroon = macMatch ? macMatch[1] : b.l402?.macaroon || null;
  const l402Invoice = invMatch ? invMatch[1] : b.l402?.invoice || null;
  const priceSats = b.l402?.priceSats ?? b.priceSats ?? null;

  return {
    payment_required: true,
    x402_version: (decodedHeader || b).x402Version ?? 2,
    resource: decodedHeader?.resource?.url || b.resource?.url || accepts[0]?.resource || null,
    price_sats: priceSats,
    price_usd: options[0]?.price_usd ?? (b.x402?.amountUSD ? Number(b.x402.amountUSD) : null),
    options,
    l402: l402Macaroon
      ? {
          macaroon: l402Macaroon,
          invoice: l402Invoice,
          price_sats: priceSats
        }
      : null,
    how_to_pay:
      'Pass M2M_FREEDOM_PASS (m2m-pass-<hex> from POST /api/v1/router/topup), or wrap fetch with @x402/fetch (Base/Solana USDC), or pass M2M_FREEDOM_X_PAYMENT (base:<0xTxHash> / solana:<TxSignature>), or configure COINOS_API_TOKEN / LNBITS_ADMIN_KEY for automatic L402 Lightning settlement.'
  };
}

/**
 * Settles a BOLT11 Lightning invoice via Coinos or LNbits and returns the payment preimage.
 */
async function payLightningInvoice(bolt11, { coinosToken, lnbitsUrl, lnbitsKey, fetchImpl }) {
  if (!bolt11 || String(bolt11).startsWith('lnbc_fallback')) return null;

  if (coinosToken) {
    const res = await fetchImpl('https://coinos.io/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${coinosToken}`
      },
      body: JSON.stringify({ payreq: bolt11 })
    });
    if (res.ok) {
      const data = await res.json();
      return data.preimage || data.payment_preimage || data.hash || null;
    }
  }

  if (lnbitsKey && lnbitsUrl) {
    const res = await fetchImpl(`${String(lnbitsUrl).replace(/\/+$/, '')}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': lnbitsKey
      },
      body: JSON.stringify({ out: true, bolt11 })
    });
    if (res.ok) {
      const data = await res.json();
      return data.payment_hash || data.checking_id || null;
    }
  }

  return null;
}

/**
 * Creates a zero-dependency M2M Freedom Market client with spend caps and multi-rail settlement.
 */
export function createClient({
  fetch: fetchImpl = (...args) => globalThis.fetch(...args),
  apiBase = API_BASE,
  maxPriceUsd = DEFAULT_MAX_PRICE_USD,
  m2mPass,
  xPayment,
  coinosToken,
  lnbitsUrl = 'https://legend.lnbits.com',
  lnbitsKey,
  autoFreeTrial = false
} = {}) {
  const base = String(apiBase || API_BASE).replace(/\/+$/, '');
  const cap = Number.isFinite(Number(maxPriceUsd)) && Number(maxPriceUsd) > 0 ? Number(maxPriceUsd) : DEFAULT_MAX_PRICE_USD;

  return {
    apiBase: base,
    maxPriceUsd: cap,

    /**
     * Calls any M2M Freedom Market tool by name with payload and optional overrides.
     */
    async call(toolName, payload = {}, overrides = {}) {
      const spec = BY_NAME[toolName] || BY_ACTION[toolName];
      if (!spec) {
        return { error: 'unknown_tool', message: `Unknown M2M Freedom tool: ${toolName}` };
      }

      // Handle free read modes of freedom_clearinghouse_orderbook
      let method = spec.method;
      let path = spec.path;
      let reqBody = { ...payload };

      if (spec.name === 'freedom_clearinghouse_orderbook') {
        const mode = reqBody.mode || 'list_open';
        if (mode === 'list_open') {
          method = 'GET';
          path = '/api/v1/market/open';
        } else if (mode === 'list_workers') {
          method = 'GET';
          path = reqBody.skill ? `/api/v1/market/skills?skill=${encodeURIComponent(reqBody.skill)}` : '/api/v1/market/skills';
        } else if (mode === 'get_sla') {
          method = 'GET';
          path = '/api/v1/sla';
        } else if (mode === 'hire' && reqBody.agentId) {
          method = 'POST';
          path = `/api/v1/market/hire/${encodeURIComponent(reqBody.agentId)}`;
        } else if (mode === 'post_bounty') {
          method = 'POST';
          path = '/api/v1/market/bounty';
        }
      }

      const estimatedUsd = spec.priceUsd || 0;
      if (method === 'POST' && !reqBody.dryRun && estimatedUsd > cap) {
        return {
          error: 'spend_cap_exceeded',
          tool: spec.name,
          list_price_usd: estimatedUsd,
          max_price_usd: cap,
          message: `Refusing ${spec.name}: list price $${estimatedUsd} exceeds M2M_FREEDOM_MAX_PRICE_USD ($${cap}).`
        };
      }

      const headers = {
        Accept: 'application/json',
        'User-Agent': 'ElizaOS-M2MFreedom-Plugin/1.0.0'
      };
      if (method === 'POST') {
        headers['Content-Type'] = 'application/json';
      }

      const activePass = overrides.m2mPass ?? m2mPass;
      const activeXPay = overrides.xPayment ?? xPayment;
      const useFreeTrial =
        overrides.freeTrial ??
        reqBody.freeTrial ??
        (autoFreeTrial && spec.freeTrialEligible && !activePass && !activeXPay && !coinosToken && !lnbitsKey);

      if (activePass) {
        headers['X-M2M-Pass'] = activePass;
      }
      if (activeXPay) {
        if (String(activeXPay).startsWith('base:') || String(activeXPay).startsWith('solana:')) {
          headers['Authorization'] = `x402 ${activeXPay}`;
        } else {
          headers['PAYMENT-SIGNATURE'] = activeXPay;
          headers['X-PAYMENT'] = activeXPay;
        }
      }
      if (useFreeTrial) {
        headers['X-Free-Trial'] = 'true';
      }

      const url = `${base}${path}`;
      const res = await fetchImpl(url, {
        method,
        headers,
        body: method === 'POST' ? JSON.stringify(reqBody) : undefined
      });

      const rawText = await res.text();
      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { raw: rawText };
      }

      if (res.status === 402) {
        const terms = parsePaymentRequired(res.headers, data);
        const liveUsd = terms.price_usd ?? estimatedUsd;

        if (liveUsd > cap) {
          return {
            ...terms,
            tool: spec.name,
            list_price_usd: liveUsd,
            error: 'spend_cap_exceeded',
            message: `Live 402 price $${liveUsd} exceeds M2M_FREEDOM_MAX_PRICE_USD ($${cap}).`
          };
        }

        // Attempt automatic L402 Lightning payment if Coinos or LNbits is configured
        if (terms.l402?.invoice && terms.l402?.macaroon && (coinosToken || lnbitsKey)) {
          const preimage = await payLightningInvoice(terms.l402.invoice, {
            coinosToken,
            lnbitsUrl,
            lnbitsKey,
            fetchImpl
          });
          if (preimage) {
            const retryHeaders = {
              ...headers,
              Authorization: `L402 ${terms.l402.macaroon}:${preimage}`
            };
            const retryRes = await fetchImpl(url, {
              method,
              headers: retryHeaders,
              body: method === 'POST' ? JSON.stringify(reqBody) : undefined
            });
            const retryData = await retryRes.json().catch(() => ({}));
            if (retryRes.ok) {
              return {
                ok: true,
                tool: spec.name,
                settled_via: 'L402_LIGHTNING',
                price_sats: terms.price_sats,
                result: retryData
              };
            }
          }
        }

        return {
          ...terms,
          tool: spec.name,
          list_price_usd: liveUsd
        };
      }

      if (!res.ok) {
        return {
          error: data?.error || `http_${res.status}`,
          status: res.status,
          tool: spec.name,
          message: data?.message || data?.hint || rawText.slice(0, 300),
          data
        };
      }

      return {
        ok: true,
        tool: spec.name,
        settled_via: activePass ? 'M2M_PASS' : activeXPay ? 'X402_USDC' : useFreeTrial ? 'FREE_TRIAL' : 'OPEN_OR_DRYRUN',
        result: data
      };
    }
  };
}
