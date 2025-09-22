/** A localStorage key for getting/setting liked listings */
export const STORAGE_KEY = "praceprojuniora.cz/liked";

export function isValidJson(data: string) {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const USER_AGENT =
  "praceprojuniora-bot/1.0 (contact: ondrejtucek9@gmail.com)";
