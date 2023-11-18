const PRICE_KEY: Deno.KvKey = ["price"];

type CachedPrice = {
  value: number;
  expiresAt: Date;
};

const PRICE_VALIDITY_DURATION = 1000 * 60 * 60 * 24;

export class CachedPriceService {
  constructor(private readonly db: Deno.Kv) {}

  async getCachedPrice(): Promise<CachedPrice | null> {
    const { value } = await this.db.get<CachedPrice>(PRICE_KEY);

    return value;
  }

  async setCachedPrice(value: number) {
    const wrappedValue: CachedPrice = {
      value,
      expiresAt: new Date(Date.now() + PRICE_VALIDITY_DURATION),
    };

    await this.db.set(PRICE_KEY, wrappedValue);

    return wrappedValue;
  }
}
