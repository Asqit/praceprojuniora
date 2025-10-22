export const CONTACT_EMAIL = Deno.env.get("FRESH_PUBLIC_CONTACT_EMAIL") ??
  "BAD_VAR";

export const USER_AGENT = `praceprojuniora-bot/1.0 (contact: ${CONTACT_EMAIL})`;
