import test from 'node:test';
import assert from 'node:assert/strict';
import {
  m2mFreedomPlugin,
  createM2MFreedomPlugin,
  createClient,
  parsePaymentRequired,
  extractPayload,
  TOOLS,
  BY_NAME
} from '../src/index.js';

test('Plugin exports 8 valid ElizaOS actions and 1 context provider', async () => {
  assert.equal(m2mFreedomPlugin.name, 'plugin-m2m-freedom');
  assert.equal(m2mFreedomPlugin.actions.length, 8);
  assert.equal(m2mFreedomPlugin.providers.length, 1);

  for (const action of m2mFreedomPlugin.actions) {
    assert.ok(action.name);
    assert.ok(Array.isArray(action.similes) && action.similes.length > 0);
    assert.equal(typeof action.validate, 'function');
    assert.equal(typeof action.handler, 'function');
    assert.ok(Array.isArray(action.examples) && action.examples.length > 0);
  }

  const provRes = await m2mFreedomPlugin.providers[0].get({});
  assert.match(provRes.text, /M2M Freedom Market Gateway/);
});

test('parsePaymentRequired parses x402 v2 PAYMENT-REQUIRED header and L402 WWW-Authenticate', () => {
  const x402Doc = {
    x402Version: 2,
    resource: { url: 'https://m2mfreedom.com/api/v1/router/tools/oracle' },
    accepts: [
      {
        scheme: 'exact',
        network: 'eip155:8453',
        amount: '5000',
        payTo: '0x50A9f6256F1d9c20E5Bc76FED6eEdB65C1219D34',
        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
      }
    ]
  };
  const b64 = Buffer.from(JSON.stringify(x402Doc)).toString('base64');
  const headers = {
    'payment-required': b64,
    'www-authenticate': 'L402 macaroon="mac123", invoice="lnbc50n1..."'
  };
  const parsed = parsePaymentRequired(headers, { l402: { priceSats: 5 } });
  assert.equal(parsed.payment_required, true);
  assert.equal(parsed.x402_version, 2);
  assert.equal(parsed.price_usd, 0.005);
  assert.equal(parsed.price_sats, 5);
  assert.equal(parsed.options[0].network, 'eip155:8453');
  assert.equal(parsed.l402.macaroon, 'mac123');
});

test('Spend cap blocks calls above M2M_FREEDOM_MAX_PRICE_USD before hitting network', async () => {
  let called = false;
  const client = createClient({
    maxPriceUsd: 0.01,
    fetch: async () => {
      called = true;
      return new Response('{}', { status: 200 });
    }
  });
  const res = await client.call('freedom_stealth_unlocker', { url: 'https://example.com' });
  assert.equal(called, false);
  assert.equal(res.error, 'spend_cap_exceeded');
});

test('extractPayload extracts natural language parameters for all tools', () => {
  const p1 = extractPayload(BY_NAME.freedom_bitcoin_oracle_ping, {
    content: { text: 'Convert 250,000 satoshis to USD' }
  });
  assert.equal(p1.satsAmount, 250000);

  const p2 = extractPayload(BY_NAME.freedom_captcha_solver, {
    content: { text: 'Solve recaptcha_v2 on https://login.example.com with sitekey 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' }
  });
  assert.equal(p2.captchaType, 'recaptcha_v2');
  assert.equal(p2.websiteURL, 'https://login.example.com');
  assert.equal(p2.websiteKey, '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
});

test('Live M2M Freedom Gateway dryRun & 402 quote verification', async (t) => {
  if (!process.env.LIVE) {
    t.skip('Set LIVE=1 to run live network checks against https://m2mfreedom.com');
    return;
  }
  const client = createClient();

  // 1. Live dryRun=true pre-check (0 Sats, returns 200 OK)
  const dryRes = await client.call('freedom_bitcoin_oracle_ping', { satsAmount: 100000, dryRun: true });
  assert.equal(dryRes.ok, true);
  assert.equal(dryRes.result.dryRun, true);

  // 2. Live unpaid call returns structured x402 + L402 402 quote
  const quoteRes = await client.call('freedom_captcha_solver', {
    captchaType: 'turnstile',
    websiteURL: 'https://example.com',
    websiteKey: '0x4AAAAAAAB'
  });
  assert.equal(quoteRes.payment_required, true);
  assert.ok(quoteRes.options.length >= 1);
  assert.equal(quoteRes.options[0].pay_to, '0x50A9f6256F1d9c20E5Bc76FED6eEdB65C1219D34');

  // 3. Live Clearinghouse Orderbook free read
  const obRes = await client.call('freedom_clearinghouse_orderbook', { mode: 'list_open' });
  assert.equal(obRes.ok, true);
});
