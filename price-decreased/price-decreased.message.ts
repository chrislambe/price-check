import { z } from "zod";

export const priceDecreasedMessageSchema = z.object({
  action: z.literal("priceDecreased"),
  price: z.number(),
  lastPrice: z.number(),
});

export type IPriceDecreasedMessage = z.infer<
  typeof priceDecreasedMessageSchema
>;

export class PriceDecreasedMessage implements IPriceDecreasedMessage {
  action = "priceDecreased" as const;

  constructor(
    public readonly price: number,
    public readonly lastPrice: number
  ) {}
}
