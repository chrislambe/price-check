import { z } from "zod";

export const priceValidityExpiredMessageSchema = z.object({
  action: z.literal("priceValidityExpired"),
});

export type IPriceValidityExpiredMessage = z.infer<typeof priceValidityExpiredMessageSchema>;

export class PriceValidityExpiredMessage implements IPriceValidityExpiredMessage {
  action = "priceValidityExpired" as const;
}
