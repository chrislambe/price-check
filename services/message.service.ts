import { z } from "zod";
import { priceDecreasedMessageSchema } from "../price-decreased/price-decreased.message.ts";
import { priceValidityExpiredMessageSchema } from "../price-validity-expired/price-validity-expired.message.ts";

export const messageSchema = z.discriminatedUnion("action", [
  priceValidityExpiredMessageSchema,
  priceDecreasedMessageSchema,
]);

export type IMessage = z.infer<typeof messageSchema>;

export class MessageService {
  constructor(private readonly db: Deno.Kv) {}

  enqueue(message: IMessage, options?: Parameters<Deno.Kv["enqueue"]>[1]) {
    console.log(`enqueueing message: ${JSON.stringify(message)}`);
    return this.db.enqueue(message, options);
  }

  listenQueue(...args: Parameters<Deno.Kv["listenQueue"]>) {
    return this.db.listenQueue(...args);
  }
}
