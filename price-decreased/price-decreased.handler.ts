import { EnvService } from "../services/env.service.ts";
import { PriceDecreasedMessage } from "./price-decreased.message.ts";
import currency from "currency.js";

export class PriceDecreasedHandler {
  constructor(private readonly envService: EnvService) {}

  async handle(message: PriceDecreasedMessage) {
    const result = await fetch(
      `https://api.telegram.org/bot${this.envService.get(
        "TELEGRAM_BOT_API_TOKEN"
      )}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: this.envService.get("TELEGRAM_NOTIFICATION_CHAT_ID"),
          text: `Fellow Ode Gen 2 price decreased from ${currency(
            message.lastPrice
          ).format()} to ${currency(
            message.price
          ).format()}! Check it out: https://fellowproducts.com/products/ode-brew-grinder-gen-2`,
        }),
      }
    );

    console.log(await result.text());
  }
}
