import { PriceDecreasedMessage } from "../price-decreased/price-decreased.message.ts";
import { MessageService } from "../services/message.service.ts";
import { CachedPriceService } from "../services/cached-price.service.ts";
import { PriceValidityExpiredMessage } from "./price-validity-expired.message.ts";
import { LivePriceService } from "../services/live-price.service.ts";

export class PriceValidityExpiredHandler {
  constructor(
    private readonly cachedPriceService: CachedPriceService,
    private readonly livePriceService: LivePriceService,
    private readonly messageService: MessageService
  ) {}

  async handle() {
    console.log("price validity expired, refreshing price...");

    const livePrice = await this.livePriceService.getLivePrice();
    const cachedPrice = await this.cachedPriceService.getCachedPrice();

    if (cachedPrice && livePrice.value < cachedPrice.value) {
      console.log("price decreased, sending notification");
      await this.messageService.enqueue(
        new PriceDecreasedMessage(livePrice.value, cachedPrice.value)
      );
    } else {
      console.log("price did not decrease");
    }

    const { expiresAt } = await this.cachedPriceService.setCachedPrice(
      livePrice.value
    );

    const delay = expiresAt.getTime() - Date.now();

    console.log(`next price validity expiration in ${delay}ms`);

    await this.messageService.enqueue(new PriceValidityExpiredMessage(), {
      delay,
    });
  }
}
