import currency from "currency.js";
import { z } from "zod";

const productDataSchema = z.object({
  price: z.number(),
});

export class LivePriceService {
  constructor(private readonly db: Deno.Kv) {}

  async getLivePrice() {
    // const response = await fetch(
    //   "https://fellowproducts.com/products/ode-brew-grinder-gen-2.js"
    // );

    // const { price } = productDataSchema.parse(await response.json());

    const price = 37500;

    if (Number.isNaN(price)) {
      throw new Error("price is NaN");
    }

    return currency(price, { fromCents: true });
  }
}
