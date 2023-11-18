/// <reference lib="deno.unstable" />

import { PriceDecreasedHandler } from "./price-decreased/price-decreased.handler.ts";
import { PriceValidityExpiredHandler } from "./price-validity-expired/price-validity-expired.handler.ts";
import { PriceValidityExpiredMessage } from "./price-validity-expired/price-validity-expired.message.ts";
import { CachedPriceService } from "./services/cached-price.service.ts";
import { EnvService } from "./services/env.service.ts";
import { LivePriceService } from "./services/live-price.service.ts";
import { MessageService, messageSchema } from "./services/message.service.ts";

const envService = new EnvService();

const db = await Deno.openKv();

const cachedPriceService = new CachedPriceService(db);
const livePriceService = new LivePriceService(db);
const messageService = new MessageService(db);

console.log("listening for messages...");

messageService.listenQueue((unsafeMessage) => {
  const parseResult = messageSchema.safeParse(unsafeMessage);

  if (!parseResult.success) {
    /**
     * @todo how to handle parse error?
     */
    console.error(parseResult.error);
    return;
  }

  const { data: message } = parseResult;

  console.log(`received message: ${message.action}`);

  switch (message.action) {
    case "priceValidityExpired":
      return new PriceValidityExpiredHandler(
        cachedPriceService,
        livePriceService,
        messageService
      ).handle();
    case "priceDecreased":
      return new PriceDecreasedHandler(envService).handle(message);
  }
});

const cachedPrice = await cachedPriceService.getCachedPrice();

if (!cachedPrice) {
  await messageService.enqueue(new PriceValidityExpiredMessage());
}
