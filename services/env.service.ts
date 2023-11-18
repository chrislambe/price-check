import { z } from "zod";
import { loadSync } from "dotenv";

const envSchema = z.object({
  TELEGRAM_BOT_API_TOKEN: z.string(),
  TELEGRAM_NOTIFICATION_CHAT_ID: z.string(),
});

export type IEnv = z.infer<typeof envSchema>;

export class EnvService {
  private readonly env;

  constructor() {
    loadSync({ export: true });
    this.env = envSchema.parse(Deno.env.toObject());
  }

  get(key: keyof typeof this.env) {
    return this.env[key];
  }
}
