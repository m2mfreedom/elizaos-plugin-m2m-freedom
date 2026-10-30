// Official ElizaOS Plugin for M2M Freedom Market (https://m2mfreedom.com)
// Exposes 9 autonomous x402 (Base/Solana USDC) & L402 (Bitcoin Lightning) actions + 1 context provider.

import {
  API_BASE,
  DEFAULT_MAX_PRICE_USD,
  TOOLS,
  BY_NAME,
  BY_ACTION,
  createClient,
  parsePaymentRequired
} from './client.js';

export {
  API_BASE,
  DEFAULT_MAX_PRICE_USD,
  TOOLS,
  BY_NAME,
  BY_ACTION,
  createClient,
  parsePaymentRequired
};

const TRIGGERS = {
  freedom_bitcoin_oracle_ping: {
    similes: ['BTC_ORACLE', 'BITCOIN_PRICE_M2M', 'L402_PING', 'X402_PING', 'SATOSHI_USD_CONVERTER'],
    words: /\b(btc|bitcoin|satoshi|sats|oracle|m2m ping|l402|x402)\b/i,
    ask: 'Check the live Bitcoin price and convert 100,000 Satoshis to USD via M2M Freedom Oracle.'
  },
  freedom_llm_inference: {
    similes: ['LLM_INFERENCE_M2M', 'GROQ_CHAT_M2M', 'GPT_OSS_120B', 'QWEN_CHAT_M2M', 'FAST_LLM_COMPLETION'],
    words: /\b(llm|inference|gpt-oss|qwen|groq|chat completion|ask model|reasoning model)\b/i,
    ask: 'Run fast LLM inference on M2M Freedom (openai/gpt-oss-120b): Summarize why HTTP 402 enables autonomous agent economies.'
  },
  freedom_captcha_solver: {
    similes: ['SOLVE_CAPTCHA', 'BYPASS_TURNSTILE', 'SOLVE_RECAPTCHA', 'SOLVE_HCAPTCHA', 'SOLVE_FUNCAPTCHA', 'CAPTCHA_SOLVER'],
    words: /\b(captcha|turnstile|recaptcha|hcaptcha|funcaptcha|geetest|aws waf)\b/i,
    ask: 'Solve the Cloudflare Turnstile CAPTCHA on https://example.com/login with sitekey 0x4AAAAAAAB.'
  },
  freedom_stealth_unlocker: {
    similes: ['STEALTH_SCRAPE', 'UNLOCK_URL', 'BYPASS_ANTIBOT', 'FETCH_PROTECTED_PAGE', 'STEALTH_UNLOCKER'],
    words: /\b(unlock|stealth|anti-?bot|cloudflare page|protected page|bypass)\b.*\bhttps?:\/\//i,
    ask: 'Unlock and extract clean Markdown from https://news.ycombinator.com using M2M Stealth Unlocker.'
  },
  freedom_clean_scraper: {
    similes: ['SCRAPE_MARKDOWN', 'CLEAN_SCRAPE', 'READ_WEBPAGE_M2M', 'URL_TO_MARKDOWN'],
    words: /\b(scrape|markdown|read page|fetch url|clean html)\b.*\bhttps?:\/\//i,
    ask: 'Scrape https://example.com into clean LLM Markdown.'
  },
  freedom_python_sandbox: {
    similes: ['RUN_PYTHON_M2M', 'PYTHON_SANDBOX', 'QUANT_MATH_SANDBOX', 'EVAL_PYTHON'],
    words: /\b(python|sandbox|calculate|math|quant|import math|statistics)\b/i,
    ask: 'Run Python in the M2M Sandbox: import math; result = round(math.pi * (12.5 ** 2), 4)'
  },
  freedom_structured_extractor: {
    similes: ['EXTRACT_TABLES', 'EXTRACT_FINANCIAL_JSON', 'PARSE_HTML_TABLES', 'STRUCTURED_EXTRACTOR'],
    words: /\b(extract table|html table|financial figures|structured json|parse table)\b/i,
    ask: 'Extract structured HTML tables and financial figures from https://en.wikipedia.org/wiki/Bitcoin'
  },
  freedom_agent_memory: {
    similes: ['AGENT_MEMORY_VAULT', 'STORE_KV_MEMORY', 'RECALL_KV_MEMORY', 'PERSISTENT_MEMORY_M2M'],
    words: /\b(memory vault|store memory|recall memory|kv store|persistent memory)\b/i,
    ask: 'Store key "strategy_state" in M2M Agent Memory namespace "alpha-bot" with value {"risk":"low"}.'
  },
  freedom_clearinghouse_orderbook: {
    similes: ['M2M_ORDERBOOK', 'LIST_AGENT_BOUNTIES', 'HIRE_VERIFIED_AGENT', 'BROWSE_M2M_WORKERS', 'M2M_SLA'],
    words: /\b(orderbook|bounties|bounty|hire agent|verified workers|clearinghouse|m2m market)\b/i,
    ask: 'List open task bounties and verified worker agents on the M2M Freedom Clearinghouse.'
  }
};

function getSetting(runtime, key) {
  try {
    return runtime?.getSetting?.(key) ?? process.env[key];
  } catch {
    return process.env[key];
  }
}

/**
 * Extracts structured tool parameters from explicit options, message content, or natural language text.
 */
export function extractPayload(spec, message, options = {}) {
  const explicit = options?.parameters || options?.payload || options;
  const content = message?.content || {};
  const text = String(content.text || '').trim();
  const urlMatch = text.match(/\bhttps?:\/\/[^\s<>"')]+/i);

  switch (spec.name) {
    case 'freedom_bitcoin_oracle_ping': {
      const satsMatch = text.match(/\b(\d[\d,_]*)\s*(?:sats?|satoshis?)\b/i);
      const sats =
        explicit.satsAmount ??
        content.satsAmount ??
        (satsMatch ? Number(satsMatch[1].replace(/[,_]/g, '')) : 100000);
      return {
        satsAmount: Number.isFinite(Number(sats)) ? Number(sats) : 100000,
        ...(explicit.dryRun !== undefined ? { dryRun: Boolean(explicit.dryRun) } : {})
      };
    }

    case 'freedom_llm_inference': {
      const modelMatch = text.match(/\b(openai\/gpt-oss-120b|openai\/gpt-oss-20b|qwen\/qwen3\.8-27b|allam-2-7b)\b/i);
      const promptText =
        explicit.prompt ||
        content.prompt ||
        text.replace(/^.*?(?:llm|inference|ask model|gpt-oss-120b)\s*[:,-]?\s*/i, '').trim() ||
        'Explain HTTP 402 in 2 sentences.';
      return {
        model: explicit.model || content.model || (modelMatch ? modelMatch[1] : 'openai/gpt-oss-120b'),
        ...(Array.isArray(explicit.messages || content.messages)
          ? { messages: explicit.messages || content.messages }
          : { prompt: promptText }),
        ...(explicit.max_tokens !== undefined ? { max_tokens: Number(explicit.max_tokens) } : {}),
        ...(explicit.temperature !== undefined ? { temperature: Number(explicit.temperature) } : {}),
        ...(explicit.dryRun !== undefined ? { dryRun: Boolean(explicit.dryRun) } : {})
      };
    }

    case 'freedom_captcha_solver': {
      const typeMatch = text.match(
        /\b(turnstile|recaptcha_v2|recaptcha_v3|recaptcha_enterprise|hcaptcha|funcaptcha|amazon_waf|geetest|normal)\b/i
      );
      const keyMatch = text.match(/\b(?:sitekey|websiteKey|key)\s*[:=]?\s*([0-9a-zA-Z_-]{10,80})\b/i);
      return {
        captchaType: (explicit.captchaType || content.captchaType || (typeMatch ? typeMatch[1].toLowerCase() : 'turnstile')),
        websiteURL: explicit.websiteURL || content.websiteURL || (urlMatch ? urlMatch[0] : 'https://example.com'),
        websiteKey: explicit.websiteKey || content.websiteKey || (keyMatch ? keyMatch[1] : '0x4AAAAAAAB'),
        ...(explicit.dryRun !== undefined ? { dryRun: Boolean(explicit.dryRun) } : {})
      };
    }

    case 'freedom_stealth_unlocker':
    case 'freedom_clean_scraper': {
      return {
        url: explicit.url || content.url || (urlMatch ? urlMatch[0] : 'https://example.com'),
        ...(explicit.dryRun !== undefined ? { dryRun: Boolean(explicit.dryRun) } : {})
      };
    }

    case 'freedom_python_sandbox': {
      const codeBlock = text.match(/```(?:python|py)?\s*([\s\S]*?)```/i);
      const inlineCode = text.match(/(?:run|execute| sandbox)\s*[:]\s*(.+)$/i);
      return {
        code:
          explicit.code ||
          content.code ||
          (codeBlock ? codeBlock[1].trim() : inlineCode ? inlineCode[1].trim() : 'result = 2 + 2'),
        ...(explicit.dryRun !== undefined ? { dryRun: Boolean(explicit.dryRun) } : {})
      };
    }

    case 'freedom_structured_extractor': {
      return {
        ...(explicit.url || content.url || urlMatch
          ? { url: explicit.url || content.url || urlMatch[0] }
          : { text }),
        ...(explicit.dryRun !== undefined ? { dryRun: Boolean(explicit.dryRun) } : {})
      };
    }

    case 'freedom_agent_memory': {
      const isStore = /\b(store|save|set|write)\b/i.test(text);
      const isList = /\b(list)\b/i.test(text);
      const isDelete = /\b(delete|remove)\b/i.test(text);
      const action =
        explicit.action ||
        content.action ||
        (isStore ? 'store' : isDelete ? 'delete' : isList ? 'list' : 'recall');
      const keyMatch = text.match(/\bkey\s+["']?([a-zA-Z0-9_.-]+)["']?/i);
      const nsMatch = text.match(/\bnamespace\s+["']?([a-zA-Z0-9_.-]+)["']?/i);
      const jsonMatch = text.match(/(\{[\s\S]*\})/);
      let parsedValue = explicit.value ?? content.value;
      if (parsedValue === undefined && jsonMatch) {
        try {
          parsedValue = JSON.parse(jsonMatch[1]);
        } catch {
          parsedValue = { text: jsonMatch[1] };
        }
      }
      return {
        action,
        namespace: explicit.namespace || content.namespace || (nsMatch ? nsMatch[1] : 'eliza-agent-default'),
        key: explicit.key || content.key || (keyMatch ? keyMatch[1] : 'default_key'),
        ...(action === 'store' ? { value: parsedValue ?? { note: text } } : {}),
        ...(explicit.dryRun !== undefined ? { dryRun: Boolean(explicit.dryRun) } : {})
      };
    }

    case 'freedom_clearinghouse_orderbook': {
      const isWorkers = /\b(worker|skills|directory|verified)\b/i.test(text);
      const isSla = /\b(sla|uptime|telemetry)\b/i.test(text);
      const mode =
        explicit.mode ||
        content.mode ||
        (isSla ? 'get_sla' : isWorkers ? 'list_workers' : 'list_open');
      return {
        mode,
        ...(explicit.agentId || content.agentId ? { agentId: explicit.agentId || content.agentId } : {}),
        ...(explicit.skill || content.skill ? { skill: explicit.skill || content.skill } : {})
      };
    }

    default:
      return { ...explicit };
  }
}

function buildAction(spec, opts = {}) {
  const trigger = TRIGGERS[spec.name];
  const actionName = spec.actionName;

  return {
    name: actionName,
    similes: trigger.similes,
    description: spec.description,
    validate: async (_runtime, message) => {
      const text = String(message?.content?.text || '');
      return trigger.words.test(text);
    },
    handler: async (runtime, message, _state, options, callback) => {
      const client = createClient({
        fetch: opts.fetch,
        apiBase: opts.apiBase ?? getSetting(runtime, 'M2M_FREEDOM_API_BASE') ?? API_BASE,
        m2mPass: opts.m2mPass ?? getSetting(runtime, 'M2M_FREEDOM_PASS'),
        xPayment: opts.xPayment ?? getSetting(runtime, 'M2M_FREEDOM_X_PAYMENT'),
        coinosToken: opts.coinosToken ?? getSetting(runtime, 'COINOS_API_TOKEN'),
        lnbitsUrl: opts.lnbitsUrl ?? getSetting(runtime, 'LNBITS_URL'),
        lnbitsKey: opts.lnbitsKey ?? getSetting(runtime, 'LNBITS_ADMIN_KEY'),
        maxPriceUsd: Number(opts.maxPriceUsd ?? getSetting(runtime, 'M2M_FREEDOM_MAX_PRICE_USD') ?? DEFAULT_MAX_PRICE_USD),
        autoFreeTrial:
          opts.autoFreeTrial ??
          String(getSetting(runtime, 'M2M_FREEDOM_AUTO_FREE_TRIAL') || '').toLowerCase() === 'true'
      });

      const payload = extractPayload(spec, message, options);
      const out = await client.call(spec.name, payload);

      let text;
      if (out.payment_required) {
        const networks = (out.options || []).map((o) => o.network).join(', ') || 'eip155:8453, solana';
        text = `[M2M Freedom 402 Quote] ${spec.name} requires $${out.list_price_usd} USDC (${out.price_sats ?? spec.priceSats} Sats) via x402 (${networks}) or L402 Lightning. Configure M2M_FREEDOM_PASS, an x402-paying fetch, or COINOS_API_TOKEN to settle automatically.`;
      } else if (out.error) {
        text = `[M2M Freedom Error] ${spec.name}: ${out.error} — ${out.message}`;
      } else {
        text = JSON.stringify(out.result).slice(0, 4000);
      }

      await callback?.({ text, actions: [actionName], content: out });
      return {
        success: Boolean(out.ok),
        text,
        data: out
      };
    },
    examples: [
      [
        { name: '{{user}}', content: { text: trigger.ask } },
        { name: '{{agent}}', content: { text: `Executing ${actionName} via M2M Freedom Gateway (100/100 SLA)...`, actions: [actionName] } }
      ]
    ]
  };
}

/**
 * ElizaOS Context Provider — injects M2M Freedom Market availability, tool catalog, and payment status.
 */
export const m2mFreedomProvider = {
  name: 'M2M_FREEDOM_MARKET_PROVIDER',
  description: 'Provides M2M Freedom Market (https://m2mfreedom.com) HTTP 402 tool catalog, pricing, and settlement rail readiness.',
  get: async (runtime) => {
    const hasPass = Boolean(getSetting(runtime, 'M2M_FREEDOM_PASS'));
    const hasXPay = Boolean(getSetting(runtime, 'M2M_FREEDOM_X_PAYMENT'));
    const hasLightning = Boolean(getSetting(runtime, 'COINOS_API_TOKEN') || getSetting(runtime, 'LNBITS_ADMIN_KEY'));
    const mode = hasPass
      ? 'M2M_PASS (0ms Prepaid Session Active)'
      : hasXPay
        ? 'X402_USDC (Base/Solana Direct Proof Active)'
        : hasLightning
          ? 'L402_LIGHTNING (Auto-Settlement Active)'
          : 'QUOTE_OR_FREE_TRIAL (Returns live HTTP 402 x402/L402 quotes or executes Free Trial)';

    const summary = TOOLS.map((t) => `- ${t.actionName} (${t.name}): $${t.priceUsd} USDC / ${t.priceSats} Sats`).join('\n');
    return {
      text: `[M2M Freedom Market Gateway — https://m2mfreedom.com | SLA: 100/100 | Mode: ${mode}]\nAvailable Actions:\n${summary}`
    };
  }
};

/**
 * Factory to create the M2M Freedom ElizaOS Plugin with optional custom fetch / credentials.
 */
export function createM2MFreedomPlugin(opts = {}) {
  const selectedTools = TOOLS.filter(
    (s) => !opts.only || opts.only.includes(s.name) || opts.only.includes(s.actionName)
  );
  return {
    name: 'plugin-m2m-freedom',
    description:
      'Official M2M Freedom Market (https://m2mfreedom.com) plugin for ElizaOS: 9-in-1 CAPTCHA Solver, Stealth Anti-Bot Web Unlocker, Clean Markdown Scraper, Isolated Python 3 Quant Sandbox, Structured HTML/Financial Extractor, Persistent K/V Memory Vault, 5-Sat Bitcoin Oracle, and M2M Task Clearinghouse via x402 (Base/Solana USDC) and L402 Lightning.',
    actions: selectedTools.map((s) => buildAction(s, opts)),
    providers: [m2mFreedomProvider],
    evaluators: [],
    services: []
  };
}

export const m2mFreedomPlugin = createM2MFreedomPlugin();
export default m2mFreedomPlugin;
