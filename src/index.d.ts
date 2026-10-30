export interface M2MToolSpec {
  name: string;
  actionName: string;
  path: string;
  method: 'GET' | 'POST';
  priceSats: number;
  priceUsd: number;
  freeTrialEligible: boolean;
  param: string;
  example: string | number;
  description: string;
}

export interface M2MClientOptions {
  fetch?: typeof globalThis.fetch;
  apiBase?: string;
  maxPriceUsd?: number;
  m2mPass?: string;
  xPayment?: string;
  coinosToken?: string;
  lnbitsUrl?: string;
  lnbitsKey?: string;
  autoFreeTrial?: boolean;
  only?: string[];
}

export declare const API_BASE: string;
export declare const DEFAULT_MAX_PRICE_USD: number;
export declare const TOOLS: M2MToolSpec[];
export declare const BY_NAME: Record<string, M2MToolSpec>;
export declare const BY_ACTION: Record<string, M2MToolSpec>;

export declare function parsePaymentRequired(headers: any, body: any): Record<string, any>;
export declare function createClient(options?: M2MClientOptions): {
  apiBase: string;
  maxPriceUsd: number;
  call(toolName: string, payload?: Record<string, any>, overrides?: Record<string, any>): Promise<Record<string, any>>;
};
export declare function extractPayload(spec: M2MToolSpec, message: any, options?: Record<string, any>): Record<string, any>;
export declare const m2mFreedomProvider: {
  name: string;
  description: string;
  get(runtime?: any): Promise<{ text: string }>;
};
export declare function createM2MFreedomPlugin(options?: M2MClientOptions): {
  name: string;
  description: string;
  actions: any[];
  providers: any[];
  evaluators: any[];
  services: any[];
};
export declare const m2mFreedomPlugin: ReturnType<typeof createM2MFreedomPlugin>;
export default m2mFreedomPlugin;
