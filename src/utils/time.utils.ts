import { DateTime } from 'luxon';

export function isValidTimeZone(tz: string) {
  try {
    return DateTime.now().setZone(tz).isValid;
  } catch {
    return false;
  }
}
